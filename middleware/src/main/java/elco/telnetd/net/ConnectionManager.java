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
import java.net.InetAddress;
import java.net.Socket;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.telnetd.BootException;

/**
 * Class that takes care for active and queued connection. Housekeeping is done also for connections that were just broken off, or exceeded their timeout. Note that instances of
 * this class can only be created by using the factory method createConnectionManager(Properties settings).
 */
public class ConnectionManager implements Runnable {

	private static Logger logger = LoggerFactory.getLogger(ConnectionManager.class);
	private Thread mThread;
	private final ThreadGroup mThreadGroup; // ThreadGroup all connections run in
	private final List<Connection> mOpenConnections;
	private final LinkedList<Connection> mClosedConnections;
	private ConnectionFilter mFilter; // reference to the connection filter
	private final int mMaxConnections; // maximum allowed connections stored from the properties
	private final int mWarningTimeout; // time to idle warning
	private final int mDisconnectTimeout; // time to idle diconnection
	private final int mHousekeepingInterval; // interval for managing cleanups
	private final String mLoginShell;
	private boolean mLineMode = false;
	private boolean mStopping = false;

	private ConnectionManager(int con, int timew, int timedis, int hoke, ConnectionFilter filter, String lsh, boolean lm) {
		mThreadGroup = new ThreadGroup(new StringBuffer().append(this.toString()).append("Connections").toString());
		mOpenConnections = Collections.synchronizedList(new ArrayList<Connection>(100));
		mClosedConnections = new LinkedList<>();
		mFilter = filter;
		mLoginShell = lsh;
		mLineMode = lm;
		mMaxConnections = con;
		mWarningTimeout = timew;
		mDisconnectTimeout = timedis;
		mHousekeepingInterval = hoke;
	}

	/**
	 * Set a connection filter for this ConnectionManager instance. The filter is used to handle IP level allow/deny of incoming connections.
	 *
	 * @param filter
	 *            ConnectionFilter instance.
	 */
	public void setConnectionFilter(ConnectionFilter filter) {
		mFilter = filter;
	}

	/**
	 * Gets the active ConnectionFilter instance or returns null if no filter is set.
	 *
	 * @return the managers ConnectionFilter.
	 */
	public ConnectionFilter getConnectionFilter() {
		return mFilter;
	}

	/**
	 * Returns the number of open connections.
	 *
	 * @return the number of open connections as <tt>int</tt>.
	 */
	public int openConnectionCount() {
		return mOpenConnections.size();
	}

	/**
	 * Returns the {@link Connection} at the given index.
	 *
	 * @param idx
	 * @return Connection
	 */
	public Connection getConnection(int idx) {
		synchronized (mOpenConnections) {
			return mOpenConnections.get(idx);
		}
	}

	/**
	 * Get all {@link Connection} instances with the given <tt>InetAddress</tt>.
	 *
	 * @return all {@link Connection} instances with the given <tt>InetAddress</tt>.
	 */
	public Connection[] getConnectionsByAdddress(InetAddress addr) {
		ArrayList<Object> l = new ArrayList<>();
		synchronized (mOpenConnections) {
			for (Iterator<Connection> iterator = mOpenConnections.iterator(); iterator.hasNext();) {
				Connection connection = iterator.next();
				if (connection.getConnectionData().getInetAddress().equals(addr)) {
					l.add(connection);
				}
			}
		}
		Connection[] conns = new Connection[l.size()];
		return l.toArray(conns);
	}

	/**
	 * Starts this <tt>ConnectionManager</tt>.
	 */
	public void start() {
		mThread = new Thread(this);
		mThread.start();
	}

	/**
	 * Stops this <tt>ConnectionManager</tt>.
	 */
	public void stop() {
		logger.debug("stop()::{}", this.toString());
		mStopping = true;
		// wait for thread to die
		try {
			mThread.join();
		} catch (InterruptedException iex) { // NOSONAR
			logger.error("stop()", iex);
		}
		synchronized (mOpenConnections) {
			for (Iterator<Connection> iter = mOpenConnections.iterator(); iter.hasNext();) {
				try {
					Connection tc = iter.next();
					// maybe write a disgrace to the socket?
					tc.close();
				} catch (Exception exc) {
					logger.error("stop()", exc);
				}
			}
			mOpenConnections.clear();
		}
		logger.debug("stop():: Stopped {}", this.toString());
	}

	/**
	 * Method that that tries to connect an incoming request. Properly queueing.
	 *
	 * @param insock
	 *            Socket thats representing the incoming connection.
	 */
	public void makeConnection(Socket insock) {
		logger.debug("makeConnection()::" + insock.toString());
		if (mFilter == null || (mFilter != null && mFilter.isAllowed(insock.getInetAddress()))) { // NOSONAR
			// we create the connection data object at this point to
			// store certain information there.
			ConnectionData newCD = new ConnectionData(insock, this);
			newCD.setLoginShell(mLoginShell);
			newCD.setLineMode(mLineMode);
			if (mOpenConnections.size() < mMaxConnections) {
				// create a new Connection instance
				Connection con = new Connection(mThreadGroup, newCD);
				// log the newly created connection
				Object[] args = { new Integer(mOpenConnections.size() + 1) };
				logger.info(MessageFormat.format("connection #{0,number,integer} made.", args));
				// register it for being managed
				synchronized (mOpenConnections) {
					mOpenConnections.add(con);
				}
				// start it
				con.start();
			}
		} else {
			logger.info("makeConnection():: Active Filter blocked incoming connection.");
			try {
				insock.close();
			} catch (IOException ex) {
				logger.error("", ex);
			}
		}
	}

	/**
	 * Periodically does following work:
	 * <ul>
	 * <li>cleaning up died connections.
	 * <li>checking managed connections if they are working properly.
	 * <li>checking the open connections.
	 * </ul>
	 */
	@Override
	public void run() {
		// housekeep connections
		try {
			do {
				// clean up closed connections
				cleanupClosed();
				// check all active connections
				checkOpenConnections();
				// sleep interval
				Thread.sleep(mHousekeepingInterval);
			} while (!mStopping);

			// check all active connections and signal them to close
			checkCloseRequest();
		} catch (Exception e) {
			logger.error("run()", e);
		}
		logger.debug("run():: Ran out {}", this.toString());
	}

	private void cleanupClosed() {
		if (mStopping) {
			return;
		}
		// cleanup loop
		while (!mClosedConnections.isEmpty()) {
			Connection nextOne = mClosedConnections.pop();
			logger.info("cleanupClosed():: Removing closed connection {}", nextOne.toString());
			synchronized (mOpenConnections) {
				mOpenConnections.remove(nextOne);
			}
		}
	}

	private void checkCloseRequest() {
		if (mStopping) {
			// do routine checks on active connections
			synchronized (mOpenConnections) {
				for (Iterator<Connection> iter = mOpenConnections.iterator(); iter.hasNext();) {
					Connection conn = iter.next();
					conn.processConnectionEvent(new ConnectionEvent(conn, ConnectionEvent.CONNECTION_LOGOUTREQUEST));
				}
				/* end Timeouts check */
			}
		}
	}

	private void checkOpenConnections() {
		if (mStopping) {
			return;
		}
		// do routine checks on active connections
		synchronized (mOpenConnections) {
			for (Iterator<Connection> iter = mOpenConnections.iterator(); iter.hasNext();) {
				Connection conn = iter.next();
				ConnectionData cd = conn.getConnectionData();
				// check if it is dead and remove it.
				if (!conn.isActive()) {
					registerClosedConnection(conn);
					continue;
				}
				/* Timeouts check */
				// first we caculate the inactivity time
				long inactivity = System.currentTimeMillis() - cd.getLastActivity();
				// now we check for warning and disconnection
				if (inactivity > mWarningTimeout) {
					// ..and for disconnect
					if (inactivity > (mDisconnectTimeout + mWarningTimeout)) {
						// this connection needs to be disconnected :)
						logger.debug("checkOpenConnections():{} exceeded total timeout", conn.toString());
						// fire logoff event for shell site cleanup , beware could hog the daemon thread
						conn.processConnectionEvent(new ConnectionEvent(conn, ConnectionEvent.CONNECTION_TIMEDOUT));
					} else {
						// this connection needs to be warned :)
						if (!cd.isWarned()) {
							logger.debug("checkOpenConnections():{} exceeded warning timeout", conn.toString());
							cd.setWarned(true);
							// warning event is fired but beware this could hog the daemon thread!!
							conn.processConnectionEvent(new ConnectionEvent(conn, ConnectionEvent.CONNECTION_IDLE));
						}
					}
				}
			}
			/* end Timeouts check */
		}
	}

	/**
	 * Called by connections that got broken (i.e. I/O errors). The housekeeper will properly close the connection, and take care for misc necessary cleanup.
	 *
	 * @param con
	 *            the connection that is broken. public void registerBrokenConnection(Connection con) { if (!m_BrokenConnections.contains(con) &&
	 *            !m_ClosedConnections.contains(con)) { log.debug("registerBrokenConnection()::" + con.toString()); m_BrokenConnections.push(con); } }//registerBrokenConnection
	 */
	public void registerClosedConnection(Connection con) {
		if (mStopping) {
			return;
		}
		if (!mClosedConnections.contains(con)) {
			logger.debug("registerClosedConnection()::" + con.toString());
			mClosedConnections.push(con);
		}
	}

	/**
	 * Factory method for the ConnectionManager.<br>
	 * A class operation that will return a new ConnectionManager instance.
	 *
	 * @param settings
	 *            Properties containing the settings for this instance.
	 */
	public static ConnectionManager createConnectionManager(String name, Properties settings) throws BootException {
		try {
			int maxc = Integer.parseInt(settings.getProperty(name + ".maxcon"));
			int timow = Integer.parseInt(settings.getProperty(name + ".time_to_warning"));
			int timodis = Integer.parseInt(settings.getProperty(name + ".time_to_timedout"));
			int hoke = Integer.parseInt(settings.getProperty(name + ".housekeepinginterval"));
			String filterclass = settings.getProperty(name + ".connectionfilter");
			ConnectionFilter filter = null;
			String loginshell;
			boolean linemode = false;
			if (filterclass != null && filterclass.length() != 0 && !"none".equalsIgnoreCase(filterclass)) {
				// load filter
				filter = (ConnectionFilter) Class.forName(filterclass).newInstance();
				filter.initialize(settings);
			}
			loginshell = settings.getProperty(name + ".loginshell");
			if (loginshell == null || loginshell.length() == 0) {
				logger.error("Login shell not specified");
				throw new BootException("Login shell must be specified");
			}
			String inputmode = settings.getProperty(name + ".inputmode");
			if (inputmode == null || inputmode.length() == 0) {
				logger.info("Input mode not specified using character input as default");
				linemode = false;
			} else if ("line".equalsIgnoreCase(inputmode)) {
				linemode = true;
			}

			return new ConnectionManager(maxc, timow, timodis, hoke, filter, loginshell, linemode);
		} catch (Exception ex) {
			throw new BootException("Failure while creating ConnectionManger instance", ex);
		}
	}
}
