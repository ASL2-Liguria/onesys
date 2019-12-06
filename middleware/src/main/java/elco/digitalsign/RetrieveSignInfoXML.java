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
import java.io.StringWriter;
import java.security.Key;
import java.security.KeyException;
import java.security.Provider;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.xml.crypto.AlgorithmMethod;
import javax.xml.crypto.KeySelector;
import javax.xml.crypto.KeySelectorException;
import javax.xml.crypto.KeySelectorResult;
import javax.xml.crypto.XMLCryptoContext;
import javax.xml.crypto.XMLStructure;
import javax.xml.crypto.dsig.Reference;
import javax.xml.crypto.dsig.SignatureMethod;
import javax.xml.crypto.dsig.XMLSignature;
import javax.xml.crypto.dsig.XMLSignatureFactory;
import javax.xml.crypto.dsig.dom.DOMValidateContext;
import javax.xml.crypto.dsig.keyinfo.KeyInfo;
import javax.xml.crypto.dsig.keyinfo.KeyValue;
import javax.xml.crypto.dsig.keyinfo.X509Data;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import com.rits.cloning.Cloner;

import elco.digitalsign.utils.Base64;
import elco.exceptions.SignException;
import elco.exceptions.SignInfoException;

/**
 * @author Roberto Rizzo
 */
public final class RetrieveSignInfoXML extends RetrieveSignInfoBase {

	private static final String PROVIDERNAME = "org.apache.jcp.xml.dsig.internal.dom.XMLDSigRI"; // "org.jcp.xml.dsig.internal.dom.XMLDSigRI"
	private DocumentBuilderFactory docBildFac = null;
	private XMLSignatureFactory signatureFac = null;
	private DOMValidateContext valContext = null;
	private XMLSignature signature = null;
	private CertificateFactory certificateFactory = null;
	private byte[] signedBytes = null;
	private NodeList nlSignature = null;
	private NodeList nlCertificate = null;

	/**
	 * @param signedBytes
	 * @throws SignException
	 */
	public RetrieveSignInfoXML(byte[] signedBytes) throws SignException {
		super();
		initRetriveSignInfoXML(signedBytes);
	}

	/**
	 * @param signedBytes
	 * @param keyStorePath
	 * @throws SignException
	 */
	public RetrieveSignInfoXML(byte[] signedBytes, String keyStorePath) throws SignException {
		super(keyStorePath);
		initRetriveSignInfoXML(signedBytes);
	}

	private void initRetriveSignInfoXML(byte[] signedBytes) throws SignException {
		try {
			this.signedBytes = Base64.getData(signedBytes);
			docBildFac = DocumentBuilderFactory.newInstance();
			docBildFac.setNamespaceAware(true);
			certificateFactory = CertificateFactory.getInstance("X.509");
			signatureFac = XMLSignatureFactory.getInstance("DOM", (Provider) Class.forName(PROVIDERNAME).newInstance());

			Document doc = docBildFac.newDocumentBuilder().parse(new ByteArrayInputStream(this.signedBytes));
			String prefix = doc.getPrefix();

			// Estraggo la parte di firma
			String findSignature = (prefix != null) ? prefix + ":Signature" : "Signature";
			Cloner cloner = new Cloner();
			NodeList tmpSignature = doc.getElementsByTagNameNS(XMLSignature.XMLNS, findSignature);
			nlSignature = cloner.deepClone(tmpSignature);
			if (nlSignature.getLength() == 0) {
				throw new SignException("Can't find 'Signature' element");
			}

			String findCertificate = (prefix != null) ? prefix + ":X509Certificate" : "X509Certificate";
			nlCertificate = cloner.deepClone(doc.getElementsByTagNameNS(XMLSignature.XMLNS, findCertificate));
			if (nlCertificate.getLength() == 0) {
				throw new SignException("Can't find 'X509Certificate' element");
			}

			// Recupero l'XML senza la firma
			doc.getFirstChild().removeChild(tmpSignature.item(0));
			Transformer transformer = TransformerFactory.newInstance().newTransformer();
			StringWriter writer = new StringWriter();
			transformer.transform(new DOMSource(doc), new StreamResult(writer));
			writer.flush();
			originalData = writer.toString().getBytes();
			writer.close();
		} catch (Exception ex) {
			throw new SignException(ex);
		}
	}

	@Override
	public SignInfo[] getSignInfo() throws SignException {
		SignInfo[] si = null;

		try {
			valContext = new DOMValidateContext(new KeyValueKeySelector(), nlSignature.item(0));
			signature = signatureFac.unmarshalXMLSignature(valContext);

			// Estraggo i certificati dei firmatari
			si = new SignInfo[nlCertificate.getLength()];
			byte[] certificateByte;
			// Estraggo tutte le informazioni dei firmatari
			for (int index = 0; index < nlCertificate.getLength(); index++) {
				certificateByte = Base64.getData(nlCertificate.item(index).getFirstChild().getNodeValue().getBytes());
				X509Certificate cert = (X509Certificate) certificateFactory.generateCertificate(new ByteArrayInputStream(certificateByte));
				si[index] = getInfo(cert);
			}

			boolean result = signature.getSignatureValue().validate(valContext);
			if (result) { // Reference validation
				@SuppressWarnings("unchecked")
				Iterator<Reference> iReferences = signature.getSignedInfo().getReferences().iterator();
				while (iReferences.hasNext() && result) {
					result = iReferences.next().validate(valContext);
				}
			} else {
				throw new SignInfoException(SignInfo.ERROR_INVALID_SIGN, "Reference validation failed");
			}

			// Core validation
			if (!signature.validate(valContext)) {
				throw new SignInfoException(SignInfo.ERROR_INVALID_SIGN, "Core validation failed");
			}
		} catch (Exception ex) {
			throw new SignException(ex);
		}

		return si;
	}

	@Override
	protected Date getSignTime() {
		return null;
	}

	@Override
	protected void getTimeStampDate(SignInfo info) {
		info.setSignerTimestampDate(null);
	}

	@Override
	protected boolean verifyDigest(X509Certificate cert) {
		return true; // Funzione non significativa per la verifica di un XML
	}

	private class KeyValueKeySelector extends KeySelector {
		@Override
		public KeySelectorResult select(KeyInfo keyInfo, KeySelector.Purpose purpose, AlgorithmMethod method, XMLCryptoContext context) throws KeySelectorException {
			if (keyInfo == null) {
				throw new KeySelectorException("Null KeyInfo object!");
			}
			SignatureMethod sm = (SignatureMethod) method;
			@SuppressWarnings("unchecked")
			List<XMLStructure> list = keyInfo.getContent();

			XMLStructure xmlStructure;
			PublicKey pk;
			for (int i = 0; i < list.size(); i++) {
				xmlStructure = list.get(i);
				if (xmlStructure instanceof KeyValue) {
					pk = null;
					try {
						pk = ((KeyValue) xmlStructure).getPublicKey();
					} catch (KeyException ke) {
						throw new KeySelectorException(ke);
					}
					if (algEquals(sm.getAlgorithm(), pk.getAlgorithm())) {
						return new SimpleKeySelectorResult(pk);
					}
				} else if (xmlStructure instanceof X509Data) { // Da verificare
					List<?> objs = ((X509Data) xmlStructure).getContent();
					Object obj;
					for (int e = 0; e < objs.size(); e++) {
						obj = objs.get(e);
						if (obj instanceof X509Certificate) {
							pk = ((X509Certificate) obj).getPublicKey();
							if (algEquals(sm.getAlgorithm(), pk.getAlgorithm())) {
								return new SimpleKeySelectorResult(pk);
							}
						}
					}
				}
			}

			throw new KeySelectorException("No KeyValue element found!");
		}

		boolean algEquals(String algURI, String algName) { // NOSONAR
			if ("DSA".equalsIgnoreCase(algName) && algURI.equalsIgnoreCase(SignatureMethod.DSA_SHA1) // NOSONAR
					|| ("RSA".equalsIgnoreCase(algName) && algURI.equalsIgnoreCase(SignatureMethod.RSA_SHA1))
					|| ("RSA".equalsIgnoreCase(algName) && "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256".equalsIgnoreCase(algURI))
					|| ("HMAC".equalsIgnoreCase(algName) && algURI.equalsIgnoreCase(SignatureMethod.HMAC_SHA1))) {
				return true;
			}

			return false;
		}
	}

	private class SimpleKeySelectorResult implements KeySelectorResult {
		private PublicKey pk = null;

		SimpleKeySelectorResult(PublicKey pk) {
			this.pk = pk;
		}

		@Override
		public Key getKey() {
			return pk;
		}
	}
}
