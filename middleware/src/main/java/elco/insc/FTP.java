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

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.apache.camel.CamelContext;

/**
 * FTP, SFTP, FTPS utilities
 *
 * @author Roberto Rizzo
 */
public final class FTP {

	private FTP() {
	}

	/**
	 * Send to an ftp, sftp or ftps server
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param data
	 * @param fileName
	 * @param separator
	 */
	public static void send(CamelContext context, String type, String destination, String user, String password, byte[] data, String fileName, String separator) {
		Map<String, Object> headers = new HashMap<>();
		headers.put("CamelFileName", fileName);
		Camel.to(context, type + "://" + user + "@" + destination + "?password=" + password + "&separator=" + separator + "&binary=true&autoCreate=true&disconnect=true", data,
				headers);
	}

	/**
	 * Send to an ftp, sftp or ftps server
	 *
	 * @param context
	 * @param type
	 * @param destination
	 * @param user
	 * @param password
	 * @param data
	 * @param fileName
	 * @param separator
	 */
	public static void send(CamelContext context, String type, String destination, String user, String password, InputStream data, String fileName, String separator) {
		Map<String, Object> headers = new HashMap<>();
		headers.put("CamelFileName", fileName);
		Camel.to(context, type + "://" + user + "@" + destination + "?password=" + password + "&separator=" + separator + "&binary=true&autoCreate=true&disconnect=true", data, // NOSONAR
				headers, InputStream.class); // NOSONAR
	}

	/**
	 * Get from an ftp, sftp or ftps server
	 *
	 * @param context
	 * @param type
	 * @param destination
	 * @param user
	 * @param password
	 * @param fileName
	 * @param separator
	 * @param timeout
	 * @return InputStream
	 */
	public static InputStream getStream(CamelContext context, String type, String destination, String user, String password, String fileName, String separator, long timeout) {
		return Camel.from(context, type + "://" + user + "@" + destination + "?password=" + password + "&separator=" + separator + "&fileName=" + fileName + "&binary=true",
				timeout, InputStream.class);
	}

	/**
	 * Get from an ftp, sftp or ftps server
	 *
	 * @param context
	 * @param type
	 * @param destination
	 * @param user
	 * @param password
	 * @param fileName
	 * @param separator
	 * @param timeout
	 * @return byte[]
	 */
	public static byte[] get(CamelContext context, String type, String destination, String user, String password, String fileName, String separator, long timeout) {
		return Camel.from(context, type + "://" + user + "@" + destination + "?password=" + password + "&separator=" + separator + "&fileName=" + fileName + "&binary=true",
				timeout);
	}

	/**
	 * Send to an sftp server
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param data
	 * @param fileName
	 */
	public static void sftp(CamelContext context, String destination, String user, String password, byte[] data, String fileName, String separator) {
		send(context, "sftp", destination, user, password, data, fileName, separator);
	}

	/**
	 * Send to an sftp server
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param data
	 * @param fileName
	 */
	public static void sftp(CamelContext context, String destination, String user, String password, InputStream data, String fileName, String separator) {
		send(context, "sftp", destination, user, password, data, fileName, separator);
	}

	/**
	 * Get from an sftp
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param fileName
	 * @param separator
	 * @param timeout
	 * @return byte[]
	 */
	public static byte[] sftpGet(CamelContext context, String destination, String user, String password, String fileName, String separator, long timeout) {
		return get(context, "sftp", destination, user, password, fileName, separator, timeout);
	}

	/**
	 * Get from an sftp
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param fileName
	 * @param separator
	 * @param timeout
	 * @return InputStream
	 */
	public static InputStream sftpGetStream(CamelContext context, String destination, String user, String password, String fileName, String separator, long timeout) {
		return getStream(context, "sftp", destination, user, password, fileName, separator, timeout);
	}

	/**
	 * Send to an ftp server
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param data
	 * @param fileName
	 * @param separator
	 */
	public static void ftp(CamelContext context, String destination, String user, String password, byte[] data, String fileName, String separator) {
		send(context, "ftp", destination, user, password, data, fileName, separator);
	}

	/**
	 * Send to an ftp server
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param data
	 * @param fileName
	 * @param separator
	 */
	public static void ftp(CamelContext context, String destination, String user, String password, InputStream data, String fileName, String separator) {
		send(context, "ftp", destination, user, password, data, fileName, separator);
	}

	/**
	 * Get from an ftp
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param fileName
	 * @param separator
	 * @param timeout
	 * @return byte[]
	 */
	public static byte[] ftpGet(CamelContext context, String destination, String user, String password, String fileName, String separator, long timeout) {
		return get(context, "ftp", destination, user, password, fileName, separator, timeout);
	}

	/**
	 * Get from an ftp
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param fileName
	 * @param separator
	 * @param timeout
	 * @return InputStream
	 */
	public static InputStream ftpGetStream(CamelContext context, String destination, String user, String password, String fileName, String separator, long timeout) {
		return getStream(context, "ftp", destination, user, password, fileName, separator, timeout);
	}

	/**
	 * Send to an ftps server
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param data
	 * @param fileName
	 * @param separator
	 */
	public static void ftps(CamelContext context, String destination, String user, String password, byte[] data, String fileName, String separator) {
		send(context, "ftps", destination, user, password, data, fileName, separator);
	}

	/**
	 * Send to an ftps server
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param data
	 * @param fileName
	 * @param separator
	 */
	public static void ftps(CamelContext context, String destination, String user, String password, InputStream data, String fileName, String separator) {
		send(context, "ftps", destination, user, password, data, fileName, separator);
	}

	/**
	 * Get from an ftps
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param fileName
	 * @param separator
	 * @param timeout
	 * @return byte[]
	 */
	public static byte[] ftpsGet(CamelContext context, String destination, String user, String password, String fileName, String separator, long timeout) {
		return get(context, "ftps", destination, user, password, fileName, separator, timeout);
	}

	/**
	 * Get from an ftps
	 *
	 * @param context
	 * @param destination
	 * @param user
	 * @param password
	 * @param fileName
	 * @param separator
	 * @param timeout
	 * @return InputStream
	 */
	public static InputStream ftpsGetStream(CamelContext context, String destination, String user, String password, String fileName, String separator, long timeout) {
		return getStream(context, "ftps", destination, user, password, fileName, separator, timeout);
	}
}
