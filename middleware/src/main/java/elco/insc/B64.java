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

import org.apache.commons.codec.binary.Base64;

/**
 * B64 utilities
 *
 * @author Roberto Rizzo
 */
public final class B64 {

	private B64() {
	}

	/**
	 * Encode base 64
	 *
	 * @param data
	 *            data to encode
	 * @return encoded base64 byte[]
	 */
	public static byte[] encodeB64(byte[] data) {
		return Base64.encodeBase64(data);
	}

	/**
	 * Encode base 64
	 *
	 * @param data
	 *            data to encode
	 * @return encoded base64 String
	 */
	public static String encodeB64String(byte[] data) {
		return Base64.encodeBase64String(data);
	}

	/**
	 * Decode base 64
	 *
	 * @param data
	 *            data to decode
	 * @return decoded base64 byte[]
	 */
	public static byte[] decodeB64(byte[] data) {
		return Base64.decodeBase64(data);
	}

	/**
	 * Decode base 64
	 *
	 * @param data
	 *            data to decode
	 * @return decoded base64 byte[]
	 */
	public static byte[] decodeB64(String data) {
		return Base64.decodeBase64(data);
	}

	/**
	 * Is base 64 encoded
	 *
	 * @deprecated Base64 is a group of similar binary-to-text encoding. This function che return false positive
	 * @param data
	 *            data to verify
	 * @return true if input data is base64 encoded
	 */
	@Deprecated
	public static boolean isB64(byte[] data) {
		return Base64.isBase64(data);
	}

	/**
	 * Is base 64 encoded
	 *
	 * @deprecated Base64 is a group of similar binary-to-text encoding. This function che return false positive
	 * @param data
	 *            data to verify
	 * @return true if input data is base64 encoded
	 */
	@Deprecated
	public static boolean isB64(String data) {
		return Base64.isBase64(data);
	}
}
