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

import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.cert.X509Certificate;
import java.util.ArrayList;

import javax.security.auth.x500.X500Principal;

import org.bouncycastle.asn1.ocsp.OCSPObjectIdentifiers;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.Extensions;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.bouncycastle.cert.ocsp.BasicOCSPResp;
import org.bouncycastle.cert.ocsp.CertificateID;
import org.bouncycastle.cert.ocsp.CertificateStatus;
import org.bouncycastle.cert.ocsp.OCSPReq;
import org.bouncycastle.cert.ocsp.OCSPReqBuilder;
import org.bouncycastle.cert.ocsp.OCSPResp;
import org.bouncycastle.cert.ocsp.SingleResp;
import org.bouncycastle.operator.DigestCalculatorProvider;
import org.bouncycastle.operator.bc.BcDigestCalculatorProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.exceptions.OCSPException;

/**
 * @author Roberto Rizzo
 */
public final class OCSPUtils {

	private static Logger logger = LoggerFactory.getLogger(OCSPUtils.class);

	private OCSPUtils() {
	}

	/**
	 * @param cert
	 * @param keyStorePath
	 * @throws Exception
	 */
	public static final void ocsp(X509Certificate cert, String keyStorePath) throws OCSPException {
		X509Certificate caCert = null;

		try {
			ArrayList<String> urls = (ArrayList<String>) URIS.getURIS(cert, "1.3.6.1.5.5.7.48.2");
			urls.forEach(uri -> logger.info(uri));

			X500Principal principal = cert.getIssuerX500Principal();
			CAKeyStore caks = new CAKeyStore(keyStorePath);
			caCert = caks.getCACert(principal.getName());
			OCSPReq request = generateOCSPRequest(caCert, cert.getSerialNumber());
			byte[] array = request.getEncoded();

			URL url = new URL("http://ocsp.digsigtrust.com:80/");
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestProperty("Content-Type", "application/ocsp-request");
			con.setRequestProperty("Accept", "application/ocsp-response");
			con.setDoOutput(true);
			OutputStream out = con.getOutputStream();
			DataOutputStream dataOut = new DataOutputStream(new BufferedOutputStream(out));
			dataOut.write(array);
			dataOut.flush();
			dataOut.close();

			if (con.getResponseCode() != 200) {
				throw new OCSPException("Communication error, can't verify using OCSP");
			}

			// Get response
			InputStream in = (InputStream) con.getContent();
			OCSPResp ocspResponse = new OCSPResp(in);

			if (ocspResponse.getStatus() == 0) {
				BasicOCSPResp basicResponse = (BasicOCSPResp) ocspResponse.getResponseObject();
				if (basicResponse != null) {
					SingleResp[] responses = basicResponse.getResponses();
					if (responses.length == 1) {
						Object status = responses[0].getCertStatus();
						if (status == CertificateStatus.GOOD) {
							status = null;
						} else if (status instanceof org.bouncycastle.cert.ocsp.RevokedStatus) {
							throw new OCSPException("OCSP status is revoked!");
						} else if (status instanceof org.bouncycastle.cert.ocsp.UnknownStatus) {
							throw new OCSPException("OCSP status is unknown!");
						}
					}
				}
			}
		} catch (Exception ex) {
			throw new OCSPException(ex);
		}
	}

	private static final OCSPReq generateOCSPRequest(X509Certificate issuerCert, BigInteger serialNumber) throws OCSPException {
		try {
			// Add provider BC
			Providers.registerBCProvider();

			// Generate the id for the certificate we are looking for
			DigestCalculatorProvider dcp = new BcDigestCalculatorProvider();
			CertificateID id = new CertificateID(dcp.get(CertificateID.HASH_SHA1), new JcaX509CertificateHolder(issuerCert), serialNumber);

			// basic request generation with nonce
			OCSPReqBuilder gen = new OCSPReqBuilder();
			gen.addRequest(id);

			// create details for nonce extension
			BigInteger nonce = BigInteger.valueOf(System.currentTimeMillis());
			Extension extension = new Extension(OCSPObjectIdentifiers.id_pkix_ocsp_nonce, false, nonce.toByteArray());

			gen.setRequestExtensions(new Extensions(extension));

			return gen.build();
		} catch (Exception ex) {
			throw new OCSPException(ex);
		}
	}
}
