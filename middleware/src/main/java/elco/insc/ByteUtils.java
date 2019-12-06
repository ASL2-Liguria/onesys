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

import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;

import org.apache.commons.lang3.ArrayUtils;

/**
 * @author Roberto Rizzo
 */
public final class ByteUtils {

	private ByteUtils() {
	}

	/**
	 * @param array
	 * @return false if array is not null and array.length > 0. true in any other case
	 */
	public static boolean isEmpty(byte[] array) {
		return !(array != null && array.length > 0);
	}

	/**
	 * @param input
	 *            byte array to shift
	 * @return a shifted byte array clone
	 */
	public static byte[] shiftByteArrayLeft(byte[] input) {
		byte[] output = ArrayUtils.clone(input);

		for (int index = 0; index < output.length - 1; index++) {
			output[index] = output[index + 1];
		}

		return output;
	}

	/**
	 * Convert inputArray from pInputCharset to pOutputCharset
	 *
	 * @param inputArray
	 *            byte[] to convert
	 * @param pInputCharset
	 *            input charset (ex. UTF-8)
	 * @param pOutputCharset
	 *            output charset (ex. ISO-8859-1)
	 * @return converted byte[]
	 */
	public static byte[] convert2Charset(byte[] inputArray, String pInputCharset, String pOutputCharset) {
		Charset inputCharset = Charset.forName(pInputCharset);
		ByteBuffer inputBuffer = ByteBuffer.wrap(inputArray);
		CharBuffer inputData = inputCharset.decode(inputBuffer);

		Charset outputCharset = Charset.forName(pOutputCharset);
		ByteBuffer outputBuffer = outputCharset.encode(inputData);

		return outputBuffer.array();
	}
}
