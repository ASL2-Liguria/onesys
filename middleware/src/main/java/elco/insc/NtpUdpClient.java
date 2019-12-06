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
package elco.insc;

import java.io.IOException;
import java.net.InetAddress;
import java.util.Date;

import org.apache.commons.net.ntp.NTPUDPClient;
import org.apache.commons.net.ntp.TimeInfo;

/**
 * @author Roberto Rizzo
 */
public final class NtpUdpClient {

	/**
	 * Default ntp udp port
	 */
	public static final int DEFAULTPORT = 123;
	/**
	 * Default timeout 10 seconds
	 */
	public static final int DEFAULTTIMEOUT = 10000;

	private NtpUdpClient() {
	}

	/**
	 * Return current date from a NTP time server
	 *
	 * @param serverIP
	 *            NTP server IP or name
	 * @param port
	 *            server port
	 * @param timeout
	 *            communication timeout in milliseconds
	 * @return Return current time plus offset needed to adjust local clock to match remote clock or NULL in case of errors
	 * @throws IOException
	 */
	public static Date getDate(String serverIP, int port, int timeout) throws IOException {
		Date date = null;
		NTPUDPClient client = null;

		try {
			client = new NTPUDPClient();
			client.setDefaultTimeout(timeout);
			client.open();
			InetAddress hostAddr = InetAddress.getByName(serverIP);
			TimeInfo info = client.getTime(hostAddr, port);
			info.computeDetails();
			date = new Date(System.currentTimeMillis() + info.getOffset());
		} catch (Exception ex) {
			throw new IOException(ex);
		} finally {
			FileUtils.safeClose(client);
		}

		return date;
	}

	/**
	 * Return current date from a NTP time server using default port 123 and default timeout of 10 seconds
	 *
	 * @param serverIP
	 *            NTP server IP or name
	 * @return Return current time plus offset needed to adjust local clock to match remote clock or NULL in case of errors
	 * @throws IOException
	 */
	public static Date getDate(String serverIP) throws IOException {
		return getDate(serverIP, DEFAULTPORT, DEFAULTTIMEOUT);
	}
}
