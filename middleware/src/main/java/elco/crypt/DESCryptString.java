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

import java.security.spec.AlgorithmParameterSpec;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.IvParameterSpec;

import org.apache.commons.codec.binary.Base64;

/**
 *
 * @author Roberto Rizzo
 *
 */
public final class DESCryptString implements CryptInterface {

	private static final byte[]		salt			= { -16, 121, 26, -101, 125, -62, -4, 112 };
	private final String			desPWD;
	private Cipher					desCipher;
	private AlgorithmParameterSpec	paramSpec;
	private SecretKey				secKey;
	private static final String		ENCRYPTIONTYPE	= "DES/CBC/PKCS5Padding";
	private static final byte[]		desPBA			= { 48, 54, 48, 48, 54, 55, 49, 54, 48, 49, 53, 55, 49, 53, 52, 49, 52, 49, 49, 54, 50, 49, 53, 49, 49, 54, 51, 49, 52, 53, 49,
			53, 52, 49, 52, 51, 49, 53, 55 };

	public DESCryptString() throws CryptException {
		desPWD = (new OctalCryptString()).deCrypt(desPBA);
		desCipher = null;
		paramSpec = null;
		secKey = null;

		init();
	}

	public DESCryptString(String despwd) throws CryptException {
		desPWD = despwd;
		desCipher = null;
		paramSpec = null;
		secKey = null;

		init();
	}

	private void init() throws CryptException {
		try {
			desCipher = Cipher.getInstance(ENCRYPTIONTYPE);
			paramSpec = new IvParameterSpec(salt);
			SecretKeyFactory keyFac = SecretKeyFactory.getInstance(ENCRYPTIONTYPE);
			DESKeySpec desKeySpec = new DESKeySpec(desPWD.getBytes());
			secKey = keyFac.generateSecret(desKeySpec);
		} catch (Exception ex) {
			throw new CryptException(ex);
		}
	}

	@Override
	public byte[] crypt(String cleartext) throws CryptException {
		try {
			desCipher.init(Cipher.ENCRYPT_MODE, secKey, paramSpec);

			return Base64.encodeBase64(desCipher.doFinal(cleartext.getBytes()));
		} catch (Exception ex) {
			throw new CryptException(ex);
		}
	}

	@Override
	public String deCrypt(byte[] cryptedtext) throws CryptException {
		byte[] clearText;
		try {
			desCipher.init(Cipher.DECRYPT_MODE, secKey, paramSpec);
			clearText = desCipher.doFinal(Base64.decodeBase64(cryptedtext));

			return new String(clearText);
		} catch (Exception ex) {
			throw new CryptException(ex);
		}
	}

	@Override
	public String getCryptAlgorithm() {
		return desCipher.getAlgorithm();
	}
}
