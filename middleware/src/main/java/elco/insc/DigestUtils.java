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

/**
 * @author Roberto Rizzo
 */
public final class DigestUtils {

	private DigestUtils() {
	}

	/**
	 * Compute the SHA256 value of a String
	 *
	 * @param input
	 *            input String
	 * @return SHA256 of the input as String
	 */
	public static String getSHA256(String input) {
		return org.apache.commons.codec.digest.DigestUtils.sha256Hex(input);
	}

	/**
	 * Compute the SHA256 value of a byte array
	 *
	 * @param input
	 *            input byte array
	 * @return SHA256 of the input as String
	 */
	public static String getSHA256(byte[] input) {
		return org.apache.commons.codec.digest.DigestUtils.sha256Hex(input);
	}

	/**
	 * Compute the SHA1 value of a String
	 *
	 * @param input
	 *            input String
	 * @return SHA1 of the input as String
	 */
	public static String getSHA1(String input) {
		return org.apache.commons.codec.digest.DigestUtils.sha1Hex(input);
	}

	/**
	 * Compute the SHA1 value of a byte array
	 *
	 * @param input
	 *            input byte array
	 * @return SHA1 of the input as String
	 */
	public static String getSHA1(byte[] input) {
		return org.apache.commons.codec.digest.DigestUtils.sha1Hex(input);
	}

	/**
	 * Compute the MD5 value of a String
	 *
	 * @param input
	 *            input String
	 * @return MD5 of the input as String
	 */
	public static String getMD5(String input) {
		return org.apache.commons.codec.digest.DigestUtils.md5Hex(input);
	}

	/**
	 * Compute the MD5 value of a byte array
	 *
	 * @param input
	 *            input byte array
	 * @return MD5 of the input as String
	 */
	public static String getMD5(byte[] input) {
		return org.apache.commons.codec.digest.DigestUtils.md5Hex(input);
	}
}
