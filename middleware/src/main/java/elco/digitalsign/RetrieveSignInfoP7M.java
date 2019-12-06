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

import java.nio.ByteBuffer;
import java.security.cert.X509Certificate;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.ASN1OctetString;
import org.bouncycastle.asn1.cms.Attribute;
import org.bouncycastle.asn1.cms.AttributeTable;
import org.bouncycastle.asn1.cms.CMSAttributes;
import org.bouncycastle.asn1.x509.Time;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cms.CMSException;
import org.bouncycastle.cms.CMSProcessableByteArray;
import org.bouncycastle.cms.CMSSignedData;
import org.bouncycastle.cms.SignerInformation;
import org.bouncycastle.cms.SignerInformationStore;
import org.bouncycastle.cms.SignerInformationVerifier;
import org.bouncycastle.tsp.TimeStampToken;
import org.bouncycastle.util.Store;

import elco.digitalsign.utils.Base64;
import elco.digitalsign.utils.Certificates;
import elco.exceptions.SignException;

/**
 * @author Roberto Rizzo
 */
public final class RetrieveSignInfoP7M extends RetrieveSignInfoBase {

	private SignerInformation signer = null;
	private CMSSignedData cmsSignedData = null;

	/**
	 * @param signedBytes
	 * @throws SignException
	 */
	public RetrieveSignInfoP7M(byte[] signedBytes) throws SignException {
		super();
		intitRetrieveSignInfo(signedBytes);
	}

	/**
	 * @param signedBytes
	 * @param keyStorePath
	 * @throws SignException
	 */
	public RetrieveSignInfoP7M(byte[] signedBytes, String keyStorePath) throws SignException {
		super(keyStorePath);
		intitRetrieveSignInfo(signedBytes);
	}

	private void intitRetrieveSignInfo(byte[] signedBytes) throws SignException {
		try {
			byte[] decoded64Bytes = Base64.getData(signedBytes);
			cmsSignedData = new CMSSignedData(decoded64Bytes);
		} catch (CMSException ex) {
			SignException sex = new SignException(ex);
			sex.status = ERROR_NOT_SIGNED_CONTENT;
			sex.error = "Not signed contenent";
			throw sex;
		} catch (Exception ex) {
			throw new SignException(ex);
		}

		// Recupero il file escludendo la parte di firma
		CMSProcessableByteArray cpb = (CMSProcessableByteArray) cmsSignedData.getSignedContent();
		originalData = (byte[]) cpb.getContent();
	}

	@SuppressWarnings("unchecked")
	@Override
	public final SignInfo[] getSignInfo() throws SignException {
		SignInfo[] si = null;

		try {
			Store<X509CertificateHolder> certs = cmsSignedData.getCertificates();
			SignerInformationStore signers = cmsSignedData.getSignerInfos();
			Collection<SignerInformation> sc = signers.getSigners();
			Iterator<SignerInformation> scit = sc.iterator();
			si = new SignInfo[sc.size()];
			int index = 0;

			while (scit.hasNext()) {
				signer = scit.next();
				Collection<X509CertificateHolder> certCollection = certs.getMatches(signer.getSID());
				if (certCollection.isEmpty()) {
					continue;
				}

				X509CertificateHolder certHolder = certCollection.iterator().next();
				X509Certificate cert = Certificates.getX509Certificate(certHolder, provider);
				si[index] = getInfo(cert);
				index++;
			}
		} catch (Exception ex) {
			throw new SignException(ex);
		}

		return si;
	}

	@Override
	protected void getTimeStampDate(SignInfo sInfo) {
		try {
			AttributeTable attTable = signer.getUnsignedAttributes();
			if (attTable != null) {
				Attribute attr = attTable.get(new ASN1ObjectIdentifier(TimeStamp.TIMESTAMPOID));
				if (attr != null) {
					TimeStampToken tsToken = new TimeStampToken(new CMSSignedData(attr.getAttrValues().getObjectAt(0).toASN1Primitive().getEncoded()));

					// prendo il digest del file firmato
					Attribute digestAttr = signer.getSignedAttributes().get(CMSAttributes.messageDigest);
					byte[] messageDigest = ((ASN1OctetString) digestAttr.getAttrValues().getObjectAt(0)).getOctets();

					TimeStampInfo tspInfo = (new TimeStamp()).getTimeStampInfo(tsToken);

					ByteBuffer bbmDigest = ByteBuffer.wrap(messageDigest);
					ByteBuffer bbtspDigest = ByteBuffer.wrap(tspInfo.tspDigest);
					if (bbmDigest.compareTo(bbtspDigest) != 0) {
						throw new SignException("Not a valid time stamp");
					}

					// Se il timestamp è "valido" per questa firma prendo la data memorizzata
					sInfo.setSignerTimestampDate(tspInfo.tspDate);
				}
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	@Override
	protected Date getSignTime() {
		Date signTime = null;

		try {
			AttributeTable attrTable = signer.getSignedAttributes();
			Attribute attr = attrTable.get(CMSAttributes.signingTime);
			if (attr != null) {
				Time time = Time.getInstance(attr.getAttrValues().getObjectAt(0));
				signTime = time.getDate();
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return signTime;
	}

	@Override
	protected boolean verifyDigest(X509Certificate cert) {
		boolean result = false;

		try {
			SignerInformationVerifier siv = Certificates.fromX509CertToSignerVer(cert);
			result = signer.verify(siv);
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return result;
	}
}
