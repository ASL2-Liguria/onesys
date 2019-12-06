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

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.PBEParameterSpec;

import org.apache.commons.codec.binary.Base64;

/**
 *
 * @author Roberto Rizzo
 *
 */
public final class PBECryptString implements CryptInterface {

	private static final byte[]	salt			= { -56, 117, 22, -115, 123, -72, -1, 119 };
	private final int			iterationCount;
	private final String		pbePWD;
	private Cipher				pbeCipher;
	private PBEParameterSpec	pbeParamSpec;
	private SecretKey			secKey;
	private static final String	ENCRYPTIONTYPE	= "PBEWithMD5AndDES";
	private static final byte[]	pbePBA			= { 48, 54, 48, 48, 54, 53, 49, 53, 49, 49, 53, 53, 49, 52, 49, 49, 52, 55, 49, 53, 55, 49, 52, 53, 49, 53, 52, 49, 52, 51, 49, 53,
			55 };

	public PBECryptString() throws CryptException {
		iterationCount = 1000;
		pbePWD = (new OctalCryptString()).deCrypt(pbePBA);
		pbeCipher = null;
		pbeParamSpec = null;
		secKey = null;

		init();
	}

	public PBECryptString(String pbepwd, int iteretioncount) throws CryptException {
		if (iteretioncount <= 1000) {
			throw new CryptException("Interation count must be greater than 1000");
		}

		iterationCount = iteretioncount;
		pbePWD = pbepwd;
		pbeCipher = null;
		pbeParamSpec = null;
		secKey = null;

		init();
	}

	private void init() throws CryptException {
		try {
			pbeCipher = Cipher.getInstance(ENCRYPTIONTYPE);
			pbeParamSpec = new PBEParameterSpec(salt, iterationCount);
			SecretKeyFactory keyFac = SecretKeyFactory.getInstance(ENCRYPTIONTYPE);
			PBEKeySpec pbeKeySpec = new PBEKeySpec(pbePWD.toCharArray());
			secKey = keyFac.generateSecret(pbeKeySpec);
		} catch (Exception ex) {
			throw new CryptException(ex);
		}
	}

	@Override
	public byte[] crypt(String cleartext) throws CryptException {
		try {
			pbeCipher.init(Cipher.ENCRYPT_MODE, secKey, pbeParamSpec);

			return Base64.encodeBase64(pbeCipher.doFinal(cleartext.getBytes()));
		} catch (Exception ex) {
			throw new CryptException(ex);
		}
	}

	@Override
	public String deCrypt(byte[] cryptedtext) throws CryptException {
		byte[] clearText;
		try {
			pbeCipher.init(Cipher.DECRYPT_MODE, secKey, pbeParamSpec);
			clearText = pbeCipher.doFinal(Base64.decodeBase64(cryptedtext));

			return new String(clearText);
		} catch (Exception ex) {
			throw new CryptException(ex);
		}
	}

	@Override
	public String getCryptAlgorithm() {
		return pbeCipher.getAlgorithm();
	}
}