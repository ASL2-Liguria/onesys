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
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Collections;

import javax.xml.crypto.dsig.CanonicalizationMethod;
import javax.xml.crypto.dsig.DigestMethod;
import javax.xml.crypto.dsig.Reference;
import javax.xml.crypto.dsig.SignatureMethod;
import javax.xml.crypto.dsig.SignedInfo;
import javax.xml.crypto.dsig.Transform;
import javax.xml.crypto.dsig.XMLSignature;
import javax.xml.crypto.dsig.XMLSignatureFactory;
import javax.xml.crypto.dsig.dom.DOMSignContext;
import javax.xml.crypto.dsig.keyinfo.KeyInfo;
import javax.xml.crypto.dsig.keyinfo.KeyInfoFactory;
import javax.xml.crypto.dsig.keyinfo.X509Data;
import javax.xml.crypto.dsig.spec.C14NMethodParameterSpec;
import javax.xml.crypto.dsig.spec.TransformParameterSpec;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;

import elco.digitalsign.utils.OCSPUtils;
import elco.exceptions.SignException;

/**
 * @author Roberto Rizzo
 */
public final class SignDataXML extends BaseSign {

	private XMLSignatureFactory signFac = null;
	private SignedInfo signedInfo = null;
	private DocumentBuilderFactory dbfactory = null;
	private Transformer transformer = null;
	private KeyInfoFactory keyinfofactory = null;
	private ArrayList<Object> listData = null;
	private ArrayList<Object> listInfo = null;
	private boolean addCRL = false;
	private boolean addSubject = false;

	/**
	 * Costruttore
	 *
	 * @param pin
	 *            codice pin della smartcard
	 * @param pkcs11Provider
	 *            path al provider PKCS11 (un file .dll per windows, un file .so per linux) - il file cambia con la smartcard, è fornito dal produttore della scheda
	 */
	public SignDataXML(String pin, String pkcs11Provider) {
		try {
			initCertificateAndPrivateKey(pin, pkcs11Provider);
			signFac = XMLSignatureFactory.getInstance("DOM");
			DigestMethod digest = signFac.newDigestMethod(DigestMethod.SHA1, null);
			Transform transform = signFac.newTransform(Transform.ENVELOPED, (TransformParameterSpec) null);
			Reference ref = signFac.newReference("", digest, Collections.singletonList(transform), null, null);
			SignatureMethod signature = signFac.newSignatureMethod(SignatureMethod.RSA_SHA1, null);
			signedInfo = signFac.newSignedInfo(signFac.newCanonicalizationMethod(CanonicalizationMethod.INCLUSIVE_WITH_COMMENTS, (C14NMethodParameterSpec) null), signature,
					Collections.singletonList(ref));

			keyinfofactory = signFac.getKeyInfoFactory();
			listData = new ArrayList<>(2);
			listData.add(cert); // aggiungo sempre il certificato del firmatario

			listInfo = new ArrayList<>(2);
			listInfo.add(keyinfofactory.newKeyValue(cert.getPublicKey())); // aggiungo sempre la public key del
			// firmatario

			dbfactory = DocumentBuilderFactory.newInstance();
			dbfactory.setNamespaceAware(true);
			transformer = TransformerFactory.newInstance().newTransformer();
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	/**
	 * @param addCRL
	 */
	public void addCRL(boolean addCRL) {
		this.addCRL = addCRL;
	}

	/**
	 * @param addSubject
	 */
	public void addSubject(boolean addSubject) {
		this.addSubject = addSubject;
	}

	@Override
	public byte[] sign(byte[] toSignBytes, int verifyCertificate) throws SignException {
		byte[] signedData = null;
		RevocationInfo crlInfo = null;

		try {
			if (verifyCertificate == VERIFY_CERTIFICATE_REVOCATION_CRL) {
				crlInfo = verifyCRLS();
			} else if (verifyCertificate == VERIFY_CERTIFICATE_REVOCATION_OCSP) {
				OCSPUtils.ocsp(cert, "");
			}

			if (addCRL) { // aggiungo la CRL all'XML
				if (crlInfo == null) {
					crlInfo = (new CRLS(cert)).getRevocationInfos();
					if (crlInfo.getCRLInfos().getX509CRL() != null) {
						listData.add(crlInfo.getCRLInfos().getX509CRL());
					}
				}
			}
			if (addSubject) { // aggiungo dati in chiaro riguardanti il firmatario
				listData.add(cert.getSubjectX500Principal().getName("RFC1779"));
			}
			listData.trimToSize();
			X509Data x509data = keyinfofactory.newX509Data(listData);

			listInfo.add(x509data);
			listInfo.trimToSize();
			KeyInfo keyInfo = keyinfofactory.newKeyInfo(listInfo);

			ByteArrayInputStream toSignIs = new ByteArrayInputStream(toSignBytes);
			Document doc = dbfactory.newDocumentBuilder().parse(toSignIs);
			toSignIs.close();
			DOMSignContext dsc = new DOMSignContext(oPrivateKey, doc.getDocumentElement());
			XMLSignature signature = signFac.newXMLSignature(signedInfo, keyInfo);
			signature.sign(dsc);

			ByteArrayOutputStream signedXML = new ByteArrayOutputStream();
			transformer.transform(new DOMSource(doc), new StreamResult(signedXML));
			signedData = signedXML.toByteArray();
			signedXML.close();
		} catch (Exception ex) {
			throw new SignException(ex);
		}

		return signedData;
	}
}
