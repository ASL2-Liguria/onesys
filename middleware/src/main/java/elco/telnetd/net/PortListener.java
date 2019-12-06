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
package elco.telnetd.net;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.text.MessageFormat;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.telnetd.BootException;

/**
 * Class that implements a <tt>PortListener</tt>.<br>
 * If available, it accepts incoming connections and passes them to an associated <tt>ConnectionManager</tt>.
 *
 * @see elco.telnetd.net.ConnectionManager
 */
public class PortListener implements Runnable {

	private static Logger logger = LoggerFactory.getLogger(PortListener.class);
	private final String mName;
	private int mPort; // port number running on
	private final int mFloodProtection; // flooding protection
	private ServerSocket mServerSocket = null; // server socket
	private Thread mThread;
	private ConnectionManager mConnectionManager; // connection management thread
	private boolean mStopping = false;
	private boolean mAvailable; // Flag for availability
	private static final String LOGMSG = "Listening to port {0,number,integer} with a connectivity queue size of {1,number,integer}.";

	/**
	 * Constructs a PortListener instance.<br>
	 * Its private because its called by a factory method.
	 *
	 * @param port
	 *            int that specifies the port number of the server socket.
	 * @param floodprot
	 *            that specifies the server socket queue size.
	 */
	private PortListener(String name, int port, int floodprot) {
		mName = name;
		mAvailable = false;
		mPort = port;
		mFloodProtection = floodprot;
	}

	/**
	 * Returns the name of this <tt>PortListener</tt>.
	 *
	 * @return the name as <tt>String</tt>.
	 */
	public String getName() {
		return mName;
	}

	public void setPort(int port) {
		mPort = port;
	}

	/**
	 * Tests if this <tt>PortListener</tt> is available.
	 *
	 * @return true if available, false otherwise.
	 */
	public boolean isAvailable() {
		return mAvailable;
	}

	/**
	 * Sets the availability flag of this <tt>PortListener</tt>.
	 *
	 * @param b
	 *            true if to be available, false otherwise.
	 */
	public void setAvailable(boolean b) {
		mAvailable = b;
	}// setAvailable

	/**
	 * Starts this <tt>PortListener</tt>.
	 */
	public void start() {
		logger.debug("start()");
		mThread = new Thread(this);
		mThread.start();
		mAvailable = true;
	}

	/**
	 * Stops this <tt>PortListener</tt>, and returns when everything was stopped successfully.
	 */
	public void stop() {
		logger.debug("stop()::" + this.toString());
		// flag stop
		mStopping = true;
		mAvailable = false;
		// take down all connections
		mConnectionManager.stop();

		// close server socket
		try {
			mServerSocket.close();
		} catch (IOException ex) {
			logger.error("stop()", ex);
		}

		// wait for thread to die
		try {
			mThread.join();
		} catch (InterruptedException iex) { // NOSONAR
			logger.error("stop()", iex);
		}

		logger.info("stop()::Stopped " + this.toString());
	}

	/**
	 * Listen constantly to a server socket and handles incoming connections through the associated {a:link ConnectionManager}.
	 *
	 * @see elco.telnetd.net.ConnectionManager
	 */
	@Override
	public void run() {
		try {
			/*
			 * A server socket is opened with a connectivity queue of a size specified in int floodProtection. Concurrent login handling under normal circumstances should be
			 * handled properly, but denial of service attacks via massive parallel program logins should be prevented with this.
			 */
			mServerSocket = new ServerSocket(mPort, mFloodProtection);

			// log entry
			Object[] args = { new Integer(mPort), new Integer(mFloodProtection) };
			logger.info(MessageFormat.format(LOGMSG, args));

			do {
				try { // NOSONAR
					Socket s = mServerSocket.accept();
					if (mAvailable) { // NOSONAR
						mConnectionManager.makeConnection(s);
					} else {
						// just shut down the socket
						s.close();
					}
				} catch (SocketException ex) {
					if (mStopping) {
						// server socket was closed blocked in accept
						logger.debug("run(): ServerSocket closed by stop()");
					} else {
						logger.error("run()", ex);
					}
				}
			} while (!mStopping);

		} catch (IOException e) {
			logger.error("run()", e);
		}
		logger.debug("run(): returning.");
	}

	/**
	 * Returns reference to ConnectionManager instance associated with the PortListener.
	 *
	 * @return the associated ConnectionManager.
	 */
	public ConnectionManager getConnectionManager() {
		return mConnectionManager;
	}

	/**
	 * Factory method for a PortListener instance, returns an instance of a PortListener with an associated ConnectionManager.
	 *
	 * @param settings
	 *            Properties that contain all configuration information.
	 */
	public static PortListener createPortListener(String name, Properties settings) throws BootException {
		PortListener pl = null;

		try {
			// 1. read settings of the port listener itself
			int port = Integer.parseInt(settings.getProperty(name + ".port"));
			int floodprot = Integer.parseInt(settings.getProperty(name + ".floodprotection"));

			if (Boolean.parseBoolean(settings.getProperty(name + ".secure"))) {
				// do nothing for now, probably set factory in the future
			}
			pl = new PortListener(name, port, floodprot);
		} catch (Exception ex) {
			logger.error("createPortListener()", ex);
			throw new BootException("Failure while creating PortListener instance:\n" + ex.getMessage());
		}

		// 2. factorize a ConnectionManager, passing the settings, if we do not have one yet
		if (pl.mConnectionManager == null) {
			pl.mConnectionManager = ConnectionManager.createConnectionManager(name, settings);
			try {
				pl.mConnectionManager.start();
			} catch (Exception exc) {
				logger.error("createPortListener()", exc);
				throw new BootException("Failure while starting ConnectionManager watchdog thread:\n" + exc.getMessage());
			}
		}
		return pl;
	}
}
