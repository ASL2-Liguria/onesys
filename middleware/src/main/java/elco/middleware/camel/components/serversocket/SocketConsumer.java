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
package elco.middleware.camel.components.serversocket;

import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.impl.DefaultConsumer;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Roberto Rizzo
 */
public final class SocketConsumer extends DefaultConsumer implements Runnable {

	private static final Logger logger = LoggerFactory.getLogger(SocketConsumer.class);
	private ServerSocket serverSocket = null;
	private Thread managementThread = null;

	public SocketConsumer(SocketEndpoint endpoint, Processor processor) {
		super(endpoint, processor);
	}

	@Override
	public SocketEndpoint getEndpoint() {
		return (SocketEndpoint) super.getEndpoint();
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
		}
	}

	@Override
	public void run() {
		logger.info("Entering management thread for: Endpoint[{}]", getEndpoint().getEndpointUri());

		boolean endLoop = false;
		while (!endLoop) {
			try {
				Socket clientSocket = serverSocket.accept();
				(new Thread(new SocketReceiver(clientSocket))).start(); // thread that manages client's connection
			} catch (Exception ex) {
				logger.error("", ex);
				endLoop = true;
			}
		}

		logger.info("Exiting management thread for: Endpoint[{}]", getEndpoint().getEndpointUri());
	}

	private class SocketReceiver implements Runnable {

		private final Socket clientSocket;

		public SocketReceiver(Socket clientSocket) {
			this.clientSocket = clientSocket;
		}

		@Override
		public void run() {
			Exchange exchange = getEndpoint().createExchange();
			exchange.setProperty(Exchange.CHARSET_NAME, getEndpoint().getEncoding());

			try {
				Message in = exchange.getIn();
				in.setHeader("remoteAddress", clientSocket.getRemoteSocketAddress().toString());
				in.setHeader("remotePort", clientSocket.getPort());
				in.setBody(clientSocket, Socket.class);
				getProcessor().process(exchange);
			} catch (Exception ex) {
				exchange.setException(ex); // only exchange processing error
			} finally {
				IOUtils.closeQuietly(clientSocket);
			}

			// handle any thrown exception
			if (exchange.getException() != null) {
				getExceptionHandler().handleException("Error processing exchange", exchange, exchange.getException());
			}
		}
	}
}
