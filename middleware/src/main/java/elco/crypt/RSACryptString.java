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

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

import javax.crypto.Cipher;

import elco.insc.B64;

/**
 *
 * @author Roberto Rizzo
 *
 */
public final class RSACryptString implements CryptInterface {

	private static final String	ALGORITHM	= "RSA";
	private PublicKey			publicKey	= null;
	private PrivateKey			privateKey	= null;

	/**
	 *
	 * @param b64PublicKey
	 *            base64 encoded X509EncodedKey (DER format)
	 * @throws CryptException
	 */
	public void setPublicKey(String b64PublicKey) throws CryptException {
		try {
			publicKey = KeyFactory.getInstance(ALGORITHM).generatePublic(new X509EncodedKeySpec(B64.decodeB64(b64PublicKey)));
		} catch (Exception ex) {
			throw new CryptException(ex);
		}
	}

	/**
	 *
	 * @param b64PrivateKey
	 *            base64 encoded PKCS8EncodedKey (DER format)
	 * @throws CryptException
	 */
	public void setPrivateKey(String b64PrivateKey) throws CryptException {
		try {
			privateKey = KeyFactory.getInstance(ALGORITHM).generatePrivate(new PKCS8EncodedKeySpec(B64.decodeB64(b64PrivateKey)));
		} catch (Exception ex) {
			throw new CryptException(ex);
		}
	}

	@Override
	public byte[] crypt(String cleartext) throws CryptException {
		byte[] cipherText = null;

		try {
			Cipher cipher = Cipher.getInstance(ALGORITHM);
			cipher.init(Cipher.ENCRYPT_MODE, publicKey);
			cipherText = cipher.doFinal(cleartext.getBytes());
		} catch (Exception ex) {
			throw new CryptException(ex);
		}

		return cipherText;
	}

	@Override
	public String deCrypt(byte[] cryptedtext) throws CryptException {
		byte[] dectyptedText = null;

		try {
			Cipher cipher = Cipher.getInstance(ALGORITHM);
			cipher.init(Cipher.DECRYPT_MODE, privateKey);
			dectyptedText = cipher.doFinal(cryptedtext);
		} catch (Exception ex) {
			throw new CryptException(ex);
		}

		return new String(dectyptedText);
	}

	@Override
	public String getCryptAlgorithm() {
		return ALGORITHM;
	}
}
