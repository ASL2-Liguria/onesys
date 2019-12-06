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
package elco.digitalsign;

import java.io.ByteArrayInputStream;
import java.security.Key;
import java.security.KeyStore;
import java.security.cert.X509Certificate;
import java.util.Date;
import java.util.Enumeration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.digitalsign.utils.Providers;
import elco.exceptions.SignException;
import elco.insc.B64;

/**
 * @author Roberto Rizzo
 */
public abstract class BaseSign {

	protected static Logger logger = LoggerFactory.getLogger(BaseSign.class);
	protected X509Certificate cert = null;
	protected Key oPrivateKey = null;
	public static final int NO_VERIFY_CERTIFICATE_REVOCATION = 0;
	public static final int VERIFY_CERTIFICATE_REVOCATION_CRL = 1;
	public static final int VERIFY_CERTIFICATE_REVOCATION_OCSP = 2;

	/**
	 * Initialize certificate and private key
	 *
	 * @param pin
	 * @param pkcs11Provider
	 * @throws SignException
	 */
	protected void initCertificateAndPrivateKey(String pin, String pkcs11Provider) throws SignException {
		try {
			String pkcs11config = "name=PKCS11\n" + "library=" + pkcs11Provider;

			// Registro i providers: uno per la firma PKCS11 ed un'altro,Bouncy Castle, per la gestione
			Providers.registerPKCS11Provider(new ByteArrayInputStream(pkcs11config.getBytes()));
			Providers.registerBCProvider();

			KeyStore oKeyStore = KeyStore.getInstance("PKCS11");
			oKeyStore.load(null, pin.toCharArray());
			Enumeration<?> oEnum;
			String sAlias;
			boolean[] bKeyUsage;

			// Cerco il certificato appropriato per la firma
			for (oEnum = oKeyStore.aliases(); oEnum.hasMoreElements();) {
				sAlias = (String) oEnum.nextElement();

				bKeyUsage = ((X509Certificate) oKeyStore.getCertificate(sAlias)).getKeyUsage();

				if (bKeyUsage[1]) {
					try { // NOSONAR
						oPrivateKey = oKeyStore.getKey(sAlias, null);
						cert = (X509Certificate) oKeyStore.getCertificate(sAlias);
						cert.checkValidity();
						break; // Ho trovato un certificato utile per la firma (nonRepudiation) e valido
					} catch (Exception ex) {
						cert = null;
						logger.warn("", ex);
					}
				}
			}
		} catch (Exception ex) {
			throw new SignException(ex);
		}
	}

	/**
	 * @param date
	 * @throws SignException
	 */
	public void checkValidity(Date date) throws SignException {
		try {
			cert.checkValidity(date);
		} catch (Exception ex) {
			throw new SignException(ex);
		}
	}

	/**
	 * @param signedBytes
	 *            bytes to encode in B64
	 * @return encoded bytes as String
	 */
	protected String toBase64(byte[] signedBytes) {
		return B64.encodeB64String(signedBytes);
	}

	/**
	 * @return certificate used for sign document
	 */
	protected X509Certificate getCertificate() {
		return cert;
	}

	/**
	 * @param toSignBytes
	 *            bytes to digitally sign
	 * @param verifyCertificate
	 *            true to verify certificate revocation
	 * @return digitally signed bytes
	 */
	protected abstract byte[] sign(byte[] toSignBytes, int verifyCertificate) throws SignException;

	/**
	 * @return certificate revocation informations
	 * @throws Exception
	 */
	protected RevocationInfo verifyCRLS() throws SignException {
		try {
			CRLS crls = new CRLS(cert);
			RevocationInfo crlinfo = crls.getRevocationInfos();
			crls.verifyRevocation(crlinfo);
			return crlinfo;
		} catch (Exception ex) {
			throw new SignException(ex);
		}
	}
}
