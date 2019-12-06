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
 * Interface to be implemented if a class wants to qualify as a ConnectionListener.<br>
 * Note that a Shell is per contract also forced to implement this interface.
 *
 * @see elco.telnetd.net.ConnectionEvent
 * @see elco.telnetd.shell.Shell
 */
public interface ConnectionListener {

	/**
	 * Called when a CONNECTION_IDLE event occured.
	 *
	 * @param ce
	 *            ConnectionEvent instance.
	 * @see elco.telnetd.net.ConnectionEvent#CONNECTION_IDLE
	 */
	public void connectionIdle(ConnectionEvent ce);

	/**
	 * Called when a CONNECTION_TIMEDOUT event occured.
	 *
	 * @param ce
	 *            ConnectionEvent instance.
	 * @see elco.telnetd.net.ConnectionEvent#CONNECTION_TIMEDOUT
	 */
	public void connectionTimedOut(ConnectionEvent ce);

	/**
	 * Called when a CONNECTION_LOGOUTREQUEST occured.
	 *
	 * @param ce
	 *            ConnectionEvent instance.
	 * @see elco.telnetd.net.ConnectionEvent#CONNECTION_LOGOUTREQUEST
	 */
	public void connectionLogoutRequest(ConnectionEvent ce);

	/**
	 * Called when a CONNECTION_BREAK event occured.
	 *
	 * @param ce
	 *            ConnectionEvent instance.
	 * @see elco.telnetd.net.ConnectionEvent#CONNECTION_BREAK
	 */
	public void connectionSentBreak(ConnectionEvent ce);
}
