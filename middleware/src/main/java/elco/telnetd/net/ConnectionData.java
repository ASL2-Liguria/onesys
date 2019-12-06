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

import java.net.InetAddress;
import java.net.Socket;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * An utility class that is used to store and allow retrieval of all data associated with a connection.
 *
 * @see elco.telnetd.net.Connection
 */
public class ConnectionData {

	// Associations
	private final ConnectionManager mCM; // the connection's ConnectionManager
	private final Socket mSocket; // the connection's socket
	private final InetAddress mIP; // the connection's IP Address Object
	private final HashMap<String, String> mEnvironment; // the environment

	// Members
	private String mHostName; // cache for the hostname
	private String mHostAddress; // cache for the host ip
	private final int mPort; // port of the connection
	private Locale mLocale; // locale of the connection
	private long mLastActivity; // timestamp for the last activity
	private boolean mWarned; // warned flag
	private String mNegotiatedTerminalType; // negotiated TerminalType as String
	private final int[] mTerminalGeometry; // negotiated terminal geometry
	private boolean mTerminalGeometryChanged = true; // flag for changes in the terminal geometry
	private String mLoginShell; // the login shell
	private boolean mLineMode = false;

	/**
	 * Constructs a ConnectionData instance storing vital information about a connection.
	 *
	 * @param sock
	 *            Socket of the inbound connection.
	 */
	public ConnectionData(Socket sock, ConnectionManager cm) {
		mSocket = sock;
		mCM = cm;
		mIP = sock.getInetAddress();
		setHostName();
		setHostAddress();
		setLocale();
		mPort = sock.getPort();
		// this will set a default geometry and terminal type for the terminal
		mTerminalGeometry = new int[2];
		mTerminalGeometry[0] = 80; // width
		mTerminalGeometry[1] = 25; // height
		mNegotiatedTerminalType = "default";
		mEnvironment = new HashMap<>(20);
		// this will stamp the first activity for validity :)
		activity();
	}// ConnectionData

	/**
	 * Returns a reference to the ConnectionManager the connection is associated with.
	 *
	 * @return Reference to the associated ConnectionManager.
	 * @see elco.telnetd.net.ConnectionManager
	 */
	public ConnectionManager getManager() {
		return mCM;
	}// getManager

	/**
	 * Returns a reference to the socket the Connection is associated with.
	 *
	 * @return Reference to the associated Socket.
	 * @see java.net.Socket
	 */
	public Socket getSocket() {
		return mSocket;
	}// getSocket

	/**
	 * Returns the remote port to which the socket is connected.
	 *
	 * @return String that contains the remote port number to which the socket is connected.
	 */
	public int getPort() {
		return mPort;
	}// getPort

	/**
	 * Returns the fully qualified host name for the connection's IP address.<br>
	 * The name is cached on creation for performance reasons. Subsequent calls will not result in resolve queries.
	 *
	 * @return String that contains the fully qualified host name for this address.
	 */
	public String getHostName() {
		return mHostName;
	}// getHostName

	/**
	 * Returns the IP address of the connection.
	 *
	 * @return String that contains the connection's IP address.<br>
	 *         The format "%d.%d.%d.%d" is well known, where %d goes from zero to 255.
	 */
	public String getHostAddress() {
		return mHostAddress;
	}// getHostAddress

	/**
	 * Returns the InetAddress object associated with the connection.
	 *
	 * @return InetAddress associated with the connection.
	 */
	public InetAddress getInetAddress() {
		return mIP;
	}// getInetAddress

	/**
	 * Returns the Locale object associated with the connection by carrying out a simple domain match. <br>
	 * This can either be effective, if your users are really home in the country they are connecting from, or ineffective if they are on the move getting connected from anywhere
	 * in the world.<br>
	 * <br>
	 * Yet this gives the chance of capturing a default locale and starting from some point. On application context this can be by far better handled, so be aware that it makes
	 * sense to spend some thoughts on that thing when you build your application.
	 *
	 * @return the Locale object "guessed" for the connection based on its host name.
	 */
	public Locale getLocale() {
		return mLocale;
	}// getLocale

	/**
	 * Returns a timestamp of the last activity that happened on the associated connection.
	 *
	 * @return the timestamp as a long representing the difference, measured in milliseconds, between the current time and midnight, January 1, 1970 UTC.
	 */
	public long getLastActivity() {
		return mLastActivity;
	}// getLastActivity

	/**
	 * Sets a new timestamp to the actual time in millis retrieved from the System. This will remove an idle warning flag if it has been set. Note that you can use this behaviour
	 * to implement your own complex idle timespan policies within the context of your application.<br>
	 * The check frequency of the ConnectionManager should just be set according to the lowest time to warning and time to disconnect requirements.
	 */
	public void activity() {
		mWarned = false;
		mLastActivity = System.currentTimeMillis();
	}// setLastActivity

	/**
	 * Sets the state of the idle warning flag.<br>
	 * Note that this method will also update the the timestamp if the idle warning flag is removed, which means its kind of a second way to achieve the same thing as with the
	 * activity method.
	 *
	 * @param bool
	 *            true if a warning is to be issued, false if to be removed.
	 * @see #activity()
	 */
	public void setWarned(boolean bool) {
		mWarned = bool;
		if (!bool) {
			mLastActivity = System.currentTimeMillis();
		}
	}// setWarned

	/**
	 * Returns the state of the idle warning flag, which will be true if a warning has been issued, and false if not.
	 *
	 * @return the state of the idle warning flag.
	 */
	public boolean isWarned() {
		return mWarned;
	}// isWarned

	/**
	 * Sets the terminal geometry data.<br>
	 * <em>This method should not be called explicitly
	 * by the application (i.e. the its here for the io subsystem).</em><br>
	 * A call will set the terminal geometry changed flag.
	 *
	 * @param width
	 *            of the terminal in columns.
	 * @param height
	 *            of the terminal in rows.
	 */
	public void setTerminalGeometry(int width, int height) {
		mTerminalGeometry[0] = width;
		mTerminalGeometry[1] = height;
		mTerminalGeometryChanged = true;
	}// setTerminalGeometry

	/**
	 * Returns the terminal geometry in an array of two integers.
	 * <ul>
	 * <li>index 0: Width in columns.
	 * <li>index 1: Height in rows.
	 * </ul>
	 * A call will reset the terminal geometry changed flag.
	 *
	 * @return integer array containing width and height.
	 */
	public int[] getTerminalGeometry() {
		// we toggle the flag because the change should now be known
		if (mTerminalGeometryChanged) {
			mTerminalGeometryChanged = false;
		}
		return mTerminalGeometry;
	}// getTerminalGeometry

	/**
	 * Returns the width of the terminal in columns for convenience.
	 *
	 * @return the number of columns.
	 */
	public int getTerminalColumns() {
		return mTerminalGeometry[0];
	}// getTerminalColumns

	/**
	 * Returns the height of the terminal in rows for convenience.
	 *
	 * @return the number of rows.
	 */
	public int getTerminalRows() {
		return mTerminalGeometry[1];
	}// getTerminalRows

	/**
	 * Returns the state of the terminal geometry changed flag, which will be true if it has been set, and false if not.
	 *
	 * @return the state of the terminal geometry changed flag.
	 */
	public boolean isTerminalGeometryChanged() {
		return mTerminalGeometryChanged;
	}// isTerminalGeometryChanged

	/**
	 * Sets the terminal type that has been negotiated between telnet client and telnet server, in form of a String.<br>
	 * <p/>
	 * <em>This method should not be called explicitly
	 * by the application (i.e. the its here for the io subsystem).</em><br>
	 *
	 * @param termtype
	 *            the negotiated terminal type as String.
	 */
	public void setNegotiatedTerminalType(String termtype) {
		mNegotiatedTerminalType = termtype;
	}// setNegotiatedTerminalType

	/**
	 * Returns the terminal type that has been negotiated between the telnet client and the telnet server, in of a String.<br>
	 *
	 * @return the negotiated terminal type as String.
	 */
	public String getNegotiatedTerminalType() {
		return mNegotiatedTerminalType;
	}// getNegotiatedTerminalType

	/**
	 * Returns the hashmap for storing and retrieving environment variables to be passed between shells.
	 *
	 * @return a <tt>HashMap</tt> instance.
	 */
	public Map<String, String> getEnvironment() {
		return mEnvironment;
	}// getEnvironment

	/**
	 * Sets the login shell name.
	 *
	 * @param s
	 *            the shell name as string.
	 */
	public void setLoginShell(String s) {
		mLoginShell = s;
	}// setLoginShell

	/**
	 * Returns the login shell name.
	 *
	 * @return the shell name as string.
	 */
	public String getLoginShell() {
		return mLoginShell;
	}// getLoginShell

	/**
	 * Tests if in line mode.
	 *
	 * @return true if in line mode, false otherwise
	 */
	public boolean isLineMode() {
		return mLineMode;
	}// isLineMode

	/**
	 * Sets the line mode flag for the connection. Note that the setting will only be used at startup at the moment.
	 *
	 * @param b
	 *            true if to be initialized in linemode, false otherwise.
	 */
	public void setLineMode(boolean b) {
		mLineMode = b;
	}// setLineMode

	/**
	 * Mutator for HostName cache
	 */
	private void setHostName() {
		mHostName = mIP.getHostName();
	}// setHostName

	/**
	 * Mutator for HostAddress cache
	 */
	private void setHostAddress() {
		mHostAddress = mIP.getHostAddress();
	}// setHostAddress

	/**
	 * Mutator for Locale Sets a Locale derived from the hostname, or the default which is Locale.ENGLISH if something goes wrong. The localhost represents a problem for example :)
	 */
	private void setLocale() {
		String country = getHostName();
		try {
			country = country.substring(country.lastIndexOf('.') + 1);
			if ("at".equals(country)) {
				mLocale = new Locale("de", "AT");
				return;
			} else if ("de".equals(country)) {
				mLocale = new Locale("de", "DE");
				return;
			} else if ("mx".equals(country)) {
				mLocale = new Locale("es", "MX");
				return;
			} else if ("es".equals(country)) {
				mLocale = new Locale("es", "ES");
				return;
			} else if ("it".equals(country)) {
				mLocale = Locale.ITALY;
				return;
			} else if ("fr".equals(country)) {
				mLocale = Locale.FRANCE;
				return;
			} else if ("uk".equals(country)) {
				mLocale = new Locale("en", "GB");
				return;
			} else if ("arpa".equals(country)) {
				mLocale = Locale.US;
				return;
			} else if ("com".equals(country)) {
				mLocale = Locale.US;
				return;
			} else if ("edu".equals(country)) {
				mLocale = Locale.US;
				return;
			} else if ("gov".equals(country)) {
				mLocale = Locale.US;
				return;
			} else if ("org".equals(country)) {
				mLocale = Locale.US;
				return;
			} else if ("mil".equals(country)) {
				mLocale = Locale.US;
				return;
			} else {
				// default to English
				mLocale = Locale.ENGLISH;
			}
		} catch (Exception ex) {
			// default to english
			mLocale = Locale.ENGLISH;
		}
	}
}
