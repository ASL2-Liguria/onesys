/* Copyright (c) 2018, EL.CO. SRL.  All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided
 * with the distribution.
 * THIS SOFTWARE IS PROVIDED FREE OF CHARGE AND ON AN "AS IS" BASIS,
 * WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED INCLUDING
 * WITHOUT LIMITATION THE WARRANTIES THAT IT IS FREE OF DEFECTS, MERCHANTABLE,
 * FIT FOR A PARTICULAR PURPOSE OR NON-INFRINGING. THE ENTIRE RISK
 * AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU.
 * SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL
 * NECESSARY SERVICING, REPAIR, OR CORRECTION.
 * IN NO EVENT SHALL ELCO SRL BE LIABLE TO YOU FOR DAMAGES, INCLUDING
 * ANY GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING
 * OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING, BUT NOT
 * LIMITED TO, LOSS OF DATA, DATA BEING RENDERED INACCURATE, LOSS OF
 * BUSINESS PROFITS, LOSS OF BUSINESS INFORMATION, BUSINESS INTERRUPTIONS,
 * LOSS SUSTAINED BY YOU OR THIRD PARTIES, OR A FAILURE OF THE SOFTWARE
 * TO OPERATE WITH ANY OTHER SOFTWARE) EVEN IF ELCO SRL HAS BEEN ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGES.
 */
package elco.middleware.camel.components.netprotocol;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.impl.DefaultConsumer;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.insc.ByteUtils;
import elco.insc.Constants;

/**
 * @author Roberto Rizzo
 */
public final class NetConsumer extends DefaultConsumer implements Runnable {

	private static final Logger logger = LoggerFactory.getLogger(NetConsumer.class);
	private ServerSocket serverSocket = null;
	private Thread managementThread = null;
	private byte[] messageTerminator = null;
	private int soTimeout = 0;
	private int readTimeout = 0;
	private final ArrayList<SocketReceiver> receivers = new ArrayList<>();

	public NetConsumer(NetEndpoint endpoint, Processor processor) {
		super(endpoint, processor);
		messageTerminator = endpoint.getMessageTerminator();
		readTimeout = endpoint.getReadTimeout();
		if (readTimeout > 0) {
			soTimeout = 10000;
		}
	}

	@Override
	public NetEndpoint getEndpoint() {
		return (NetEndpoint) super.getEndpoint();
	}

	@Override
	protected void doStart() throws Exception {
		if (managementThread == null) {
			InetAddress address = InetAddress.getByName(getEndpoint().getAddress());
			serverSocket = new ServerSocket(getEndpoint().getPort(), getEndpoint().getQueue(), address);
			managementThread = new Thread(this); // thread that waits for connections
			managementThread.start();
		}
	}

	@Override
	protected void doStop() throws Exception {
		if (managementThread != null) {
			IOUtils.closeQuietly(serverSocket);
			serverSocket = null;
			for (SocketReceiver receiver : receivers) {
				receiver.exit();
			}
		}
	}

	@Override
	public void run() {
		logger.info("Entering management thread for: Endpoint[{}]", getEndpoint().getEndpointUri());

		boolean endLoop = false;
		while (!endLoop) {
			try {
				Socket clientSocket = serverSocket.accept();
				clientSocket.setSoTimeout(soTimeout);

				SocketReceiver receiver;
				for (Iterator<SocketReceiver> iterator = receivers.iterator(); iterator.hasNext();) {
					receiver = iterator.next();
					if (receiver.isExited()) { // NOSONAR
						iterator.remove(); // remove terminated receivers
					}
				}

				receiver = new SocketReceiver(clientSocket);
				receivers.add(receiver);
				Thread thread = new Thread(receiver); // thread that manages clients connection
				thread.start();
			} catch (Exception ex) { // NOSONAR
				endLoop = true;
			}
		}

		logger.info("Exiting management thread for: Endpoint[{}]", getEndpoint().getEndpointUri());
	}

	// manage single client connection
	private class SocketReceiver implements Runnable {

		private final Socket clientSocket;
		private InputStream inputStream;
		private Exchange exchange;
		private int nread = 0;
		private final byte[] data = new byte[1024];
		private final ByteArrayOutputStream bais = new ByteArrayOutputStream();
		private int nLastPosition = 0;
		private byte[] messageTerminatorRead = new byte[messageTerminator.length];
		private int timeToExpire = Integer.MAX_VALUE;

		public SocketReceiver(Socket clientSocket) {
			this.clientSocket = clientSocket;
		}

		public void exit() {
			timeToExpire = 0;
		}

		public boolean isExited() {
			return timeToExpire == 0;
		}

		@Override
		public void run() {
			logger.info("Entering management thread for client {}", clientSocket.getRemoteSocketAddress().toString());

			timeToExpire = readTimeout;
			inputStream = getInputStream();
			if (inputStream != null) {
				while (timeToExpire > 0) {
					exchange = getEndpoint().createExchange();
					exchange.setProperty(Exchange.CHARSET_NAME, getEndpoint().getEncoding());
					try {
						nread = inputStream.read(data);
						if (nread <= 0) { // NOSONAR
							throw new IOException("No more data to read from input stream");
						}
						bais.write(data, 0, nread);
						timeToExpire = readTimeout;

						if (verifyMessageTerminator(data, nread)) { // NOSONAR
							Message in = exchange.getIn();
							in.setHeader("remoteAddress", clientSocket.getRemoteSocketAddress().toString());
							in.setHeader("remotePort", clientSocket.getPort());
							in.setBody(bais.toByteArray(), byte[].class);
							bais.reset();
							processExchange(null);
						}
					} catch (SocketTimeoutException ex) {
						timeToExpire -= (soTimeout / Constants.ONESECONDMILLISECONDS);
						logger.error("", ex);
					} catch (Exception ex) {
						timeToExpire = 0;
						processExchange(ex);
					}
				} // while
			}

			IOUtils.closeQuietly(inputStream);
			IOUtils.closeQuietly(clientSocket);

			// handle any thrown exception
			if (exchange != null && exchange.getException() != null) {
				getExceptionHandler().handleException("Error processing exchange", exchange, exchange.getException());
			}

			timeToExpire = 0;
			logger.info("Exiting management thread for client {}", clientSocket.getRemoteSocketAddress().toString());
		}

		private void processExchange(Exception ex) {
			try {
				if (ex != null) {
					exchange.setException(ex);
				}
				getProcessor().process(exchange);
			} catch (Exception ex1) {
				exchange.setException(ex1);
				timeToExpire = 0;
			}
		}

		private InputStream getInputStream() {
			InputStream iStream = null;

			try {
				iStream = clientSocket.getInputStream();
			} catch (Exception ex) {
				exchange = getEndpoint().createExchange();
				exchange.setProperty(Exchange.CHARSET_NAME, getEndpoint().getEncoding());
				processExchange(ex);
			}

			return iStream;
		}

		private boolean verifyMessageTerminator(byte[] data, int nread) {
			boolean returnValue = false;

			for (int index = 0; index < nread && !returnValue; index++) {
				if (nLastPosition >= messageTerminatorRead.length) {
					messageTerminatorRead = ByteUtils.shiftByteArrayLeft(messageTerminatorRead);
					nLastPosition = messageTerminatorRead.length - 1;
				}
				messageTerminatorRead[nLastPosition] = data[index];
				nLastPosition++;
				returnValue = Arrays.equals(messageTerminator, messageTerminatorRead);
			}

			return returnValue;
		}
	}
}
