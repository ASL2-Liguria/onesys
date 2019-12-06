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

import java.security.PrivateKey;

import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.bouncycastle.cms.CMSProcessableByteArray;
import org.bouncycastle.cms.CMSSignedData;
import org.bouncycastle.cms.CMSSignedDataGenerator;
import org.bouncycastle.cms.CMSSignedGenerator;
import org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.DigestCalculatorProvider;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;

import elco.digitalsign.utils.OCSPUtils;
import elco.exceptions.SignException;

/**
 * @author Roberto Rizzo
 */
public final class SignDataP7M extends BaseSign {

	private CMSSignedDataGenerator generator = null;

	/**
	 * Costruttore
	 *
	 * @param pin
	 *            codice pin della smartcard
	 * @param pkcs11Provider
	 *            path al provider PKCS11 (un file .dll per windows, un file .so per linux) - il file cambia con la smartcard, è fornito dal produttore della scheda
	 */
	public SignDataP7M(String pin, String pkcs11Provider) {
		try {
			initCertificateAndPrivateKey(pin, pkcs11Provider);
			generator = new CMSSignedDataGenerator();
			JcaDigestCalculatorProviderBuilder jdcpb = new JcaDigestCalculatorProviderBuilder();
			DigestCalculatorProvider jsigb = jdcpb.setProvider("SunPKCS11-PKCS11").build();
			JcaSignerInfoGeneratorBuilder sis = new JcaSignerInfoGeneratorBuilder(jsigb);
			ContentSigner sha256Signer = new JcaContentSignerBuilder(CMSSignedGenerator.DIGEST_SHA256).build((PrivateKey) oPrivateKey);
			generator.addSignerInfoGenerator(sis.build(sha256Signer, cert));

			// this.generator.addSigner((PrivateKey) this.oPrivateKey, this.cert, CMSSignedGenerator.DIGEST_SHA256);

			generator.addCertificate(new JcaX509CertificateHolder(cert));
		} catch (Exception ex) {
			generator = null;
			logger.error("", ex);
		}
	}

	@Override
	public byte[] sign(byte[] toSignBytes, int verifyCertificate) throws SignException {
		byte[] encoded;

		try {
			if (generator == null) {
				throw new SignException("Can't create a 'generator' for sign");
			}

			if (verifyCertificate == VERIFY_CERTIFICATE_REVOCATION_CRL) {
				verifyCRLS();
			} else if (verifyCertificate == VERIFY_CERTIFICATE_REVOCATION_OCSP) {
				OCSPUtils.ocsp(cert, "");
			}

			CMSSignedData signedData = generator.generate(new CMSProcessableByteArray(toSignBytes), true);
			encoded = signedData.getEncoded();
		} catch (Exception ex) {
			throw new SignException(ex);
		}

		return encoded;
	}
}
