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

/**
 * Class implementing a ConnectionEvent.<br>
 * These events are used to communicate things that are supposed to be handled within the application context. These events are processed by the Connection instance calling upon
 * its registered listeners.
 *
 * @see elco.telnetd.net.Connection
 * @see elco.telnetd.net.ConnectionListener
 */
public class ConnectionEvent {

	private final int mType;
	private final Connection mSource;
	// Constants

	/**
	 * Defines the connection idle event type.<br>
	 * It occurs if a connection has been idle exceeding the configured time to warning.
	 */
	public static final int CONNECTION_IDLE = 100;

	/**
	 * Defines the connection timed out event type.<br>
	 * It occurs if a connection has been idle exceeding the configured time to warning and the configured time to timedout.
	 */
	public static final int CONNECTION_TIMEDOUT = 101;

	/**
	 * Defines the connection requested logout event type.<br>
	 * It occurs if a connection requested disgraceful logout by sending a <Ctrl>-<D> key combination.
	 */
	public static final int CONNECTION_LOGOUTREQUEST = 102;

	/**
	 * Defines the connection broken event type.<br>
	 * It occurs if a connection has to be closed by the system due to communication problems (i.e. I/O errors).
	 */
	public static final int CONNECTION_BROKEN = 103;

	/**
	 * Defines the connection sent break event type.<br>
	 * It occurs when the connection sent a NVT BREAK.
	 */
	public static final int CONNECTION_BREAK = 104;

	/**
	 * Constructs a new instance of a ConnectionEvent with a given source (Connection) and a given type.
	 *
	 * @param source
	 *            Connection that represents the source of this event.
	 * @param typeid
	 *            int that contains one of the defined event types.
	 */
	public ConnectionEvent(Connection source, int typeid) {
		mType = typeid;
		mSource = source;
	}

	/**
	 * Accessor method returning the source of the ConnectionEvent instance.
	 *
	 * @return Connection representing the source.
	 */
	public Connection getSource() {
		return mSource;
	}

	/**
	 * Method that helps identifying the type.
	 *
	 * @param typeid
	 *            int that contains one of the defined event types.
	 */
	public boolean isType(int typeid) {
		return mType == typeid;
	}
}
