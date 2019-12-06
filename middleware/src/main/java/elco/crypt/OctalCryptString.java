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
package elco.crypt;

/**
 *
 * @author Roberto Rizzo
 *
 */
public final class OctalCryptString implements CryptInterface {

	@Override
	public byte[] crypt(String cleartext) throws CryptException {
		int len = cleartext.length();
		String octalString = new String();
		char oneChar;
		String octalValue;

		for (int index = 0; index < len; index++) {
			oneChar = cleartext.charAt(index);
			octalValue = Integer.toOctalString(oneChar);
			if (octalValue.length() < 3) {
				octalValue = (new StringBuilder()).append("0").append(octalValue).toString();
			}
			octalString = (new StringBuilder()).append(octalString).append(octalValue).toString();
		}

		return octalString.getBytes();
	}

	@Override
	public String deCrypt(byte[] cryptedtext) throws CryptException {
		String strCrypt = new String(cryptedtext);
		int len = strCrypt.length();
		String octalStr;
		String cleartext = new String();

		for (int index = 0; index < len; index += 3) {
			octalStr = (new StringBuilder()).append("0").append(strCrypt.substring(index, index + 3)).toString();
			cleartext = (new StringBuilder()).append(cleartext).append((char) Integer.decode(octalStr).intValue()).toString();
		}

		return cleartext;
	}

	@Override
	public String getCryptAlgorithm() {
		return "Octal";
	}
}