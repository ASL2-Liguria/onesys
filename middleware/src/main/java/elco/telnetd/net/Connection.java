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

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.telnetd.io.BasicTerminalIO;
import elco.telnetd.io.TerminalIO;
import elco.telnetd.shell.Shell;
import elco.telnetd.shell.ShellManager;

/**
 * Class that implements a connection with this telnet daemon.<br>
 * It is derived from java.lang.Thread, which reflects the architecture constraint of one thread per connection. This might seem a waste of resources, but as a matter of fact
 * sharing threads would require a far more complex imlementation, due to the fact that telnet is not a stateless protocol (i.e. alive throughout a session of multiple requests and
 * responses).<br>
 * Each Connection instance is created by the listeners ConnectionManager instance, making it part of a threadgroup and passing in an associated ConnectionData instance, that holds
 * vital information about the connection. Be sure to take a look at their documention.<br>
 * <p/>
 * Once the thread has started and is running, it will get a login shell instance from the ShellManager and run passing its own reference.
 *
 * @see elco.telnetd.net.ConnectionManager
 * @see elco.telnetd.net.ConnectionData
 * @see elco.telnetd.shell.ShellManager
 * @see elco.telnetd.io.TerminalIO
 */
public class Connection extends Thread {

	private static Logger logger = LoggerFactory.getLogger(Connection.class);
	private static int mNumber; // unique number for a thread in the thread group
	private boolean mDead;
	private final ArrayList<ConnectionListener> mListeners;

	// Associations
	private final ConnectionData mConnectionData; // associated information
	private final BasicTerminalIO mTerminalIO; // associated terminal io
	private Shell mNextShell = null; // next shell to be run

	/**
	 * Constructs a TelnetConnection by invoking its parent constructor and setting of various members.<br>
	 * Subsequently instantiates the whole i/o subsystem, negotiating telnet protocol level options etc.<br>
	 *
	 * @param tcg
	 *            ThreadGroup that this instance is running in.
	 * @param cd
	 *            ConnectionData instance containing all vital information of this connection.
	 * @see elco.telnetd.net.ConnectionData
	 */
	public Connection(ThreadGroup tcg, ConnectionData cd) {
		super(tcg, "Connection" + (++mNumber));

		mConnectionData = cd;
		// init the connection listeners for events
		// (there should actually be only one or two)
		mListeners = new ArrayList<>(3);
		mTerminalIO = new TerminalIO(this);
		mDead = false;
	}

	/**
	 * Method overloaded to implement following behaviour:
	 * <ol>
	 * <li>On first entry, retrieve an instance of the configured login shell from the ShellManager and run it.
	 * <li>Handle a shell switch or close down disgracefully when problems (i.e. unhandled unchecked exceptions) occur in the running shell.
	 * </ol>
	 */
	@Override
	public void run() {
		boolean done = false;

		try {
			Shell sh = ShellManager.getReference().getShell(mConnectionData.getLoginShell());
			do {
				sh.run(this); // NOSONAR
				if (mDead) {
					done = true; // NOSONAR
					break;
				}
				sh = getNextShell();
				if (sh == null) {
					done = true;
				}
			} while (!done || mDead);
		} catch (Exception ex) {
			logger.error("run()", ex); // Handle properly
		} finally {
			// call close if not dead already
			if (!mDead) {
				close();
			}
		}
		logger.debug("run():: Returning from " + this.toString());
	}

	/**
	 * Method to access the associated connection data.
	 *
	 * @return ConnectionData associated with the Connection instance.
	 * @see elco.telnetd.net.ConnectionData
	 */
	public ConnectionData getConnectionData() {
		return mConnectionData;
	}

	/**
	 * Method to access the associated terminal io.
	 *
	 * @return BasicTerminalIO associated with the Connection instance.
	 * @see elco.telnetd.io.BasicTerminalIO
	 */
	public BasicTerminalIO getTerminalIO() {
		return mTerminalIO;
	}

	/**
	 * Method to prepare the Connection for a shell switch.<br>
	 * A shell instance will be acquired from the ShellManager according to the given name.<br>
	 * In case of a nonexistant name the return will be false, otherwise true.
	 *
	 * @param name
	 *            String that should represent a valid shell name.
	 * @return boolean flagging if the request could be carried out correctly.
	 * @see elco.telnetd.shell.ShellManager
	 */
	public boolean setNextShell(String name) {
		mNextShell = ShellManager.getReference().getShell(name);
		if (mNextShell == null) {
			return false;
		}
		return true;
	}

	/**
	 * Method used internally to retrieve the next shell to be run. Its like a one-slot stack, so that we dont end up in a never ending story.
	 */
	private Shell getNextShell() {
		// get shell
		Shell shell = mNextShell;

		if (shell != null) {
			// empty single queue
			mNextShell = null;
			// return it
			return shell;
		}
		return null;
	}

	/**
	 * Closes the connection and its underlying i/o and network resources.<br>
	 */
	public synchronized void close() {
		if (mDead) {
			return;
		}
		try {
			// connection dead
			mDead = true;
			// close i/o
			mTerminalIO.close();
		} catch (Exception ex) {
			logger.error("", ex);
			// handle
		}
		try {
			// close socket
			mConnectionData.getSocket().close();
		} catch (Exception ex) {
			logger.error("", ex);
			// handle
		}
		try {
			// register closed connection in ConnectionManager
			mConnectionData.getManager().registerClosedConnection(this);
		} catch (Exception ex) {
			logger.error("", ex);
			// handle
		}
		try {
			// try to interrupt it
			interrupt();
		} catch (Exception ex) {
			logger.error("", ex);
			// handle
		}

		logger.debug("Closed {} and inactive", this.toString());
	}

	/**
	 * Returns if a connection has been closed.<br>
	 *
	 * @return the state of the connection.
	 */
	public boolean isActive() {
		return !mDead;
	}

	/****** Event handling ****************/

	/**
	 * Method that registers a ConnectionListener with the Connection instance.
	 *
	 * @param cl
	 *            ConnectionListener to be registered.
	 * @see elco.telnetd.net.ConnectionListener
	 */
	public void addConnectionListener(ConnectionListener cl) {
		mListeners.add(cl);
	}

	/**
	 * Method that removes a ConnectionListener from the Connection instance.
	 *
	 * @param cl
	 *            ConnectionListener to be removed.
	 * @see elco.telnetd.net.ConnectionListener
	 */
	public void removeConnectionListener(ConnectionListener cl) {
		mListeners.remove(cl);
	}

	/**
	 * Method called by the io subsystem to pass on a "low-level" event. It will be properly delegated to all registered listeners.
	 *
	 * @param ce
	 *            ConnectionEvent to be processed.
	 * @see elco.telnetd.net.ConnectionEvent
	 */
	public void processConnectionEvent(ConnectionEvent ce) {
		for (int i = 0; i < mListeners.size(); i++) {
			ConnectionListener cl = mListeners.get(i);
			if (ce.isType(ConnectionEvent.CONNECTION_IDLE)) {
				cl.connectionIdle(ce);
			} else if (ce.isType(ConnectionEvent.CONNECTION_TIMEDOUT)) {
				cl.connectionTimedOut(ce);
			} else if (ce.isType(ConnectionEvent.CONNECTION_LOGOUTREQUEST)) {
				cl.connectionLogoutRequest(ce);
			} else if (ce.isType(ConnectionEvent.CONNECTION_BREAK)) {
				cl.connectionSentBreak(ce);
			}
		}
	}
}
