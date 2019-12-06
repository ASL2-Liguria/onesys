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

import java.security.Provider;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.Date;

import javax.security.auth.x500.X500Principal;

import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.digitalsign.utils.CAKeyStore;
import elco.digitalsign.utils.Certificates;
import elco.digitalsign.utils.Providers;
import elco.exceptions.SignException;
import elco.exceptions.SignInfoException;
import elco.insc.XML;
import elco.middleware.camel.beans.XMLDocument;

/**
 * @author Roberto Rizzo
 */
public abstract class RetrieveSignInfoBase {

	protected static Logger logger = LoggerFactory.getLogger(RetrieveSignInfoBase.class);
	private boolean verifyCertificateRevocation = false;
	private final X509Certificate caCert = null;
	private CAKeyStore caKeyStore = null;
	protected byte[] originalData = null;
	protected Provider provider = null;
	public static final int NO_ERRORS = 0;
	public static final int GENERAL_ERROR = 1;
	public static final int ERROR_NOT_SIGNED_CONTENT = 2;

	/**
	 * @throws SignException
	 */
	public RetrieveSignInfoBase() throws SignException {
		initRetrieveSignInfoBase();
	}

	/**
	 * @param keyStorePath
	 * @throws SignException
	 */
	public RetrieveSignInfoBase(String keyStorePath) throws SignException {
		try {
			caKeyStore = new CAKeyStore(keyStorePath);
		} catch (Exception ex) {
			throw new SignException(ex);
		}

		initRetrieveSignInfoBase();
	}

	/**
	 * @param verifyCertificateRevocation
	 */
	public void setVerifyCertificateRevocation(boolean verifyCertificateRevocation) {
		this.verifyCertificateRevocation = verifyCertificateRevocation;
	}

	/**
	 * @return boolean
	 */
	public boolean getVerifyCertificateRevocation() {
		return verifyCertificateRevocation;
	}

	/**
	 * @return byte[]
	 */
	public byte[] getOriginalData() {
		return originalData;
	}

	private void initRetrieveSignInfoBase() throws SignException {
		try {
			// Registro il provider Bouncy Castle per la gestione
			provider = Providers.registerBCProvider();
		} catch (Exception ex) {
			SignException sex = new SignException(ex);
			sex.status = GENERAL_ERROR;
			sex.error = "Can't add a Bouncy Castle provider";
			throw sex;
		}
	}

	/**
	 * @return SignInfo[]
	 * @throws SignException
	 */
	public abstract SignInfo[] getSignInfo() throws SignException;

	/**
	 * @return XMLDocument
	 * @throws SignException
	 */
	public XMLDocument getSignInfoAsXMLDocument() throws SignException {
		XMLDocument siXML = null;

		try {
			siXML = XML.getDocument("<INFOS/>");
			SignInfo[] siArray = getSignInfo();
			if (siArray != null) {
				for (SignInfo si : siArray) {
					siXML.addChild(XMLDocument.root, si.getAsXMLDocument());
				}
			}
		} catch (Exception ex) {
			throw new SignException(ex);
		}

		return siXML;
	}

	protected abstract boolean verifyDigest(X509Certificate cert);

	protected abstract Date getSignTime();

	protected abstract void getTimeStampDate(SignInfo sInfo);

	protected SignInfo getInfo(X509Certificate cert) {
		SignInfo signinfo = new SignInfo();

		try {
			getEncoded(signinfo, cert);

			// keyUsage
			// digitalSignature (0)
			// nonRepudiation (1)
			// keyEncipherment (2)
			// dataEncipherment (3)
			// keyAgreement (4)
			// keyCertSign (5)
			// cRLSign (6)
			// encipherOnly (7)
			// decipherOnly (8)
			signinfo.setSignerKeyUsage(Arrays.toString(cert.getKeyUsage()));
			signinfo.setSignerSignDate(getSignTime());

			// gestisco l'autority (issuer)
			X500Name x500name = new X500Name(cert.getIssuerX500Principal().getName(X500Principal.RFC1779));
			signinfo.setCaCommonName(Certificates.getRDN(x500name, BCStyle.CN));
			signinfo.setCaCountrycode(Certificates.getRDN(x500name, BCStyle.C));
			signinfo.setCaOrganization(Certificates.getRDN(x500name, BCStyle.O));
			signinfo.setCaOrganizationUnit(Certificates.getRDN(x500name, BCStyle.OU));

			verifyCA(cert);

			// gestisco il firmatario (subject)
			x500name = new X500Name(cert.getSubjectX500Principal().getName(X500Principal.RFC1779));
			signinfo.setSigner(Certificates.getRDN(x500name, BCStyle.GIVENNAME) + " " + Certificates.getRDN(x500name, BCStyle.SURNAME));
			signinfo.setSignerCountry(Certificates.getRDN(x500name, BCStyle.C));
			signinfo.setSignerCommonName(Certificates.getRDN(x500name, BCStyle.CN));
			signinfo.setSignerOrganization(Certificates.getRDN(x500name, BCStyle.O));
			signinfo.setSignerOrganizationUnit(Certificates.getRDN(x500name, BCStyle.OU));
			signinfo.setSignerEmail(Certificates.getRDN(x500name, BCStyle.EmailAddress));
			signinfo.setSignerSerialNumber(Certificates.getRDN(x500name, BCStyle.SERIALNUMBER));
			signinfo.setSignerDNQualifier(Certificates.getRDN(x500name, BCStyle.DN_QUALIFIER));
			signinfo.setSignerValidFromDate(cert.getNotBefore());
			signinfo.setSignerValidToDate(cert.getNotAfter());
			signinfo.setSignerSignAlgName(cert.getSigAlgName());
			signinfo.setSignerCertType(cert.getType());

			signinfo.setDocumentModified(!verifyDigest(cert));

			// Verifico che il certificato sia firmato dalla CA presunta
			// Potrei non trovare il certificato della CA. Per ora è gestito come warning
			if (caCert == null) { // NOSONAR
				signinfo.setStatus(SignInfo.WARNING_CANT_VALIDATE_CERT_TO_CA);
				signinfo.setDetails("Warning can't validate the certificate against CA");
			} else {
				verify(cert);
			}

			getTimeStampDate(signinfo);

			if (verifyCertificateRevocation) {
				CRLS crls = new CRLS(cert);
				crls.setProxy("DIRECT", "", 0);
				signinfo.setSignerRevInfos(crls.getRevocationInfos());
			}
		} catch (SignInfoException ex) { // NOSONAR
			signinfo.setStatus(ex.status);
			signinfo.setDetails(ex.error);
		} catch (Exception ex) { // NOSONAR
			signinfo.setStatus(SignInfo.ERROR_CANT_VALIDATE_SIGN);
			signinfo.setDetails(ex.getLocalizedMessage());
		}

		return signinfo;
	}

	private void getEncoded(SignInfo signinfo, X509Certificate cert) {
		try {
			signinfo.setCertificate(cert.getEncoded());
		} catch (Exception ex) {
			logger.warn("", ex);
		}
	}

	private void verify(X509Certificate cert) throws SignInfoException {
		try {
			cert.verify(caCert.getPublicKey(), provider.getName()); // NOSONAR
		} catch (Exception ex) {
			throw new SignInfoException(SignInfo.ERROR_NOT_VALID_CA, ex);
		}
	}

	private void verifyCA(X509Certificate cert) throws SignInfoException {
		if (caKeyStore != null) {
			Certificates.verifyCA(cert, caKeyStore);
		}
	}
}
