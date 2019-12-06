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
package elco.digitalsign.utils;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.security.Provider;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.style.IETFUtils;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cms.SignerInformationVerifier;
import org.bouncycastle.cms.jcajce.JcaSimpleSignerInfoVerifierBuilder;
import org.bouncycastle.operator.OperatorCreationException;

import elco.exceptions.SignInfoException;
import elco.insc.B64;

/**
 * @author Roberto Rizzo
 */
public final class Certificates {

	private Certificates() {
	}

	/**
	 * @param cert
	 * @return SignerInformationVerifier
	 * @throws OperatorCreationException
	 */
	public static SignerInformationVerifier fromX509CertToSignerVer(X509Certificate cert) throws OperatorCreationException {
		return new JcaSimpleSignerInfoVerifierBuilder().setProvider("BC").build(cert);
	}

	/**
	 * @param x500name
	 * @param identifier
	 * @return RDN as String
	 */
	public static String getRDN(X500Name x500name, ASN1ObjectIdentifier identifier) {
		try {
			RDN[] rdns = x500name.getRDNs(identifier);
			return IETFUtils.valueToString(rdns[0].getFirst().getValue());
		} catch (Exception ex) { // NOSONAR
			return "";
		}
	}

	/**
	 * @param certHolder
	 * @param provider
	 * @return X509Certificate
	 * @throws CertificateException
	 */
	public static X509Certificate getX509Certificate(X509CertificateHolder certHolder, Provider provider) throws CertificateException {
		JcaX509CertificateConverter jcc = new JcaX509CertificateConverter();
		if (provider != null) {
			jcc.setProvider(provider);
		}

		return jcc.getCertificate(certHolder);
	}

	/**
	 * @param certificate
	 *            Encoded X509Certificate
	 * @return X509Certificate
	 * @throws CertificateException
	 */
	public static X509Certificate getX509Certificate(byte[] certificate) throws CertificateException {
		X509Certificate cert = null;

		try (InputStream inStream = new ByteArrayInputStream(certificate)) {
			CertificateFactory cf = CertificateFactory.getInstance("X.509");
			cert = (X509Certificate) cf.generateCertificate(inStream);
		} catch (Exception ex) {
			throw new CertificateException(ex);
		}

		return cert;
	}

	/**
	 * @param certificate
	 *            base64 encoded certificate
	 * @return X509Certificate
	 * @throws CertificateException
	 */
	public static X509Certificate getX509Certificate(String certificate) throws CertificateException {
		return getX509Certificate(B64.decodeB64(certificate));
	}

	/**
	 * <p>
	 * Checks that the certificate is currently valid. It is if the current date and time are within the validity period given in the certificate.
	 * </p>
	 * <p>
	 * The validity period consists of two date/time values: the first and last dates (and times) on which the certificate is valid. It is defined in ASN.1 as:<br>
	 * validity Validity Validity ::= SEQUENCE { notBefore CertificateValidityDate, notAfter CertificateValidityDate } CertificateValidityDate ::= CHOICE { utcTime UTCTime,
	 * generalTime GeneralizedTime }
	 * </p>
	 *
	 * @param certificate
	 * @return boolean
	 */
	public static boolean checkValidity(X509Certificate certificate) {
		boolean valid = false;
		try {
			certificate.checkValidity();
			valid = true;
		} catch (Exception ex) { // NOSONAR
		}

		return valid;
	}

	/**
	 * @param certificate
	 * @return KeyUsage[1]
	 */
	public static boolean isNonRepudiation(X509Certificate certificate) {
		return certificate.getKeyUsage()[1];
	}

	/**
	 * Verifies that this certificate was signed using the private key that corresponds to the public key of the CA
	 *
	 * @param cert
	 *            X509Certificate
	 * @param keyStorePath
	 * @throws SignInfoException
	 */
	public static void verifyCA(X509Certificate cert, String keyStorePath) throws SignInfoException {
		try {
			CAKeyStore caks = new CAKeyStore(keyStorePath);
			verifyCA(cert, caks);
		} catch (Exception ex) {
			throw new SignInfoException(ex);
		}
	}

	/**
	 * Verifies that this certificate was signed using the private key that corresponds to the public key of the CA
	 *
	 * @param cert
	 *            X509Certificate
	 * @param caKeyStore
	 * @throws SignInfoException
	 */
	public static void verifyCA(X509Certificate cert, CAKeyStore caKeyStore) throws SignInfoException {
		try {
			X509Certificate caCert = caKeyStore.getCACert(cert.getIssuerX500Principal().getName());
			cert.verify(caCert.getPublicKey());
		} catch (Exception ex) {
			throw new SignInfoException(ex);
		}
	}
}
