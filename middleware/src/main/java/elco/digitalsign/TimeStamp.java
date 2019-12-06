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

import java.math.BigInteger;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.bouncycastle.asn1.ASN1InputStream;
import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.ASN1OctetString;
import org.bouncycastle.asn1.ASN1Primitive;
import org.bouncycastle.asn1.DERSet;
import org.bouncycastle.asn1.cms.Attribute;
import org.bouncycastle.asn1.cms.AttributeTable;
import org.bouncycastle.asn1.cms.CMSAttributes;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cms.CMSSignedData;
import org.bouncycastle.cms.SignerId;
import org.bouncycastle.cms.SignerInformation;
import org.bouncycastle.cms.SignerInformationStore;
import org.bouncycastle.cms.SignerInformationVerifier;
import org.bouncycastle.tsp.TimeStampRequest;
import org.bouncycastle.tsp.TimeStampRequestGenerator;
import org.bouncycastle.tsp.TimeStampResponse;
import org.bouncycastle.tsp.TimeStampToken;
import org.bouncycastle.util.Store;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.digitalsign.utils.Certificates;

/**
 * @author Roberto Rizzo
 */
public final class TimeStamp {

	private static Logger logger = LoggerFactory.getLogger(TimeStamp.class);
	public static final String TIMESTAMPOID = "1.2.840.11359.1.9.16.1.4";

	/**
	 * questa funzione genera un timestamp per ogni firmatario del file e lo allega come unsigned attribute con OID = 1.2.840.11359.1.9.16.1.4
	 *
	 * @param tssUrl
	 *            URL del timestamp server
	 * @param sData
	 *            file firmato per il quale generare il timestamp
	 * @return CMSSignedData
	 */
	@SuppressWarnings("unchecked")
	public CMSSignedData addTimeStampToSignedData(String tssUrl, CMSSignedData sData) {
		try {
			HttpClientBuilder builder = HttpClientBuilder.create();
			CloseableHttpClient httpClient = builder.build();

			TimeStampRequestGenerator reqGen = new TimeStampRequestGenerator();
			// richiedo alla TSA di ritornare il suo certificato
			reqGen.setCertReq(true);

			// la richiesta deve essere fatta con il metodo post
			HttpPost post = new HttpPost(tssUrl);
			post.setProtocolVersion(org.apache.http.HttpVersion.HTTP_1_0);
			post.addHeader("Content-type", "application/timestamp-query; charset=UTF-8");

			List<SignerInformation> vNewSigners = new ArrayList<>();
			Iterator<SignerInformation> iter = ((sData.getSignerInfos()).getSigners()).iterator();
			while (iter.hasNext()) {
				SignerInformation oSi = iter.next();
				Attribute digestAttr = oSi.getSignedAttributes().get(CMSAttributes.messageDigest);
				byte[] messageDigest = ((ASN1OctetString) digestAttr.getAttrValues().getObjectAt(0)).getOctets();
				TimeStampRequest request = reqGen.generate(new ASN1ObjectIdentifier(oSi.getDigestAlgOID()), messageDigest);

				Set<String> set = new HashSet<>(1);
				set.add(oSi.getDigestAlgOID());
				// valido la richiesta se non fosse valida verrebbe generata una eccezione
				request.validate(set, null, null);

				post.setEntity(new ByteArrayEntity(request.getEncoded()));
				HttpResponse response = httpClient.execute(post);

				// leggo la risposta
				TimeStampResponse resp = new TimeStampResponse(response.getEntity().getContent());
				// valido la risposta rispetto alla richiesta se non fosse valida verrebbe generata una eccezione
				resp.validate(request);

				TimeStampToken tsToken = resp.getTimeStampToken();
				SignerId signerId = tsToken.getSID();

				BigInteger certSerialNumber = signerId.getSerialNumber();

				Store<?> certs = tsToken.getCertificates();

				X509Certificate certificate = null;
				X509Certificate cert;
				Iterator<?> iterc = certs.getMatches(signerId).iterator();
				while (iterc.hasNext()) {
					cert = (X509Certificate) iterc.next();
					if (certSerialNumber != null) {
						if (cert.getSerialNumber().equals(certSerialNumber)) {
							certificate = cert;
						}
					} else {
						if (certificate == null) {
							certificate = cert;
						}
					}
				}

				// verifico il certificato della TSA
				// se non fosse valido verrebbe generata una eccezione
				SignerInformationVerifier siv = Certificates.fromX509CertToSignerVer(certificate);
				tsToken.validate(siv);

				ASN1InputStream is = new ASN1InputStream(tsToken.getEncoded()); // NOSONAR
				ASN1Primitive derObj = is.readObject();
				IOUtils.closeQuietly(is);

				DERSet derSet = new DERSet(derObj);

				Attribute attr = new Attribute(new ASN1ObjectIdentifier(TIMESTAMPOID), derSet);

				Hashtable<String, Attribute> ht = new Hashtable<>(); // NOSONAR
				ht.put(attr.toString(), attr);

				AttributeTable unsignedAttrs = new AttributeTable(ht);

				SignerInformation sinf = SignerInformation.replaceUnsignedAttributes(oSi, unsignedAttrs);
				vNewSigners.add(sinf);
			}

			SignerInformationStore oNewSignerInformationStore = new SignerInformationStore(vNewSigners);

			return CMSSignedData.replaceSigners(sData, oNewSignerInformationStore);
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return null;
	}

	/**
	 * @param tsToken
	 *            time stamp token
	 * @return ritorna un oggetto contenente in chiaro le informazioni sul timestamp
	 */
	public TimeStampInfo getTimeStampInfo(TimeStampToken tsToken) {
		TimeStampInfo info = new TimeStampInfo();

		try {
			info.tspDigest = tsToken.getTimeStampInfo().getMessageImprintDigest();
			info.tspDate = tsToken.getTimeStampInfo().getGenTime();

			@SuppressWarnings("unchecked")
			Collection<X509CertificateHolder> certCollection = tsToken.getCertificates().getMatches(tsToken.getSID());
			X509CertificateHolder certH = certCollection.iterator().next();
			X509Certificate cert = Certificates.getX509Certificate(certH, null);

			info.issuer = cert.getIssuerX500Principal().getName();
			info.subject = cert.getSubjectX500Principal().getName();
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return info;
	}
}
