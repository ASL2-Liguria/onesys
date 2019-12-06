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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.Charset;

import javax.mail.internet.MimeUtility;

import org.apache.commons.io.IOUtils;

/**
 * @author Roberto Rizzo
 */
public final class UUCoder {

	private UUCoder() {
	}

	/**
	 * @param toEncode
	 *            value to encode
	 * @param fileName
	 *            Encoded section name
	 * @param charset
	 *            Characterset name
	 * @return encoded result as byte[]
	 * @throws IOException
	 */
	public static byte[] uuEncode(String toEncode, String fileName, String charset) throws IOException {
		return uuEncode(toEncode.getBytes(charset), fileName);
	}

	/**
	 * @param toEncode
	 *            value to encode
	 * @param fileName
	 *            Encoded section name
	 * @return encoded result as byte[]
	 * @throws IOException
	 */
	public static byte[] uuEncode(byte[] toEncode, String fileName) throws IOException {
		byte[] result;

		try (ByteArrayOutputStream ous = new ByteArrayOutputStream(); OutputStream encoderStream = MimeUtility.encode(ous, "uuencode", fileName);) {
			encoderStream.write(toEncode);
			result = ous.toByteArray();
		} catch (Exception ex) {
			throw new IOException(ex);
		}

		return result;
	}

	/**
	 * @param toDecode
	 *            value to decode
	 * @param charset
	 *            Characterset name
	 * @return decoded result as byte[]
	 * @throws IOException
	 */
	public static byte[] uuDecode(String toDecode, String charset) throws IOException {
		byte[] result;

		try (InputStream decodedStream = MimeUtility.decode(IOUtils.toInputStream(toDecode, Charset.forName(charset)), "uuencode");) {
			result = elco.dicom.utils.IOUtils.loadByteArray(decodedStream);
		} catch (Exception ex) {
			throw new IOException(ex);
		}

		return result;
	}
}
