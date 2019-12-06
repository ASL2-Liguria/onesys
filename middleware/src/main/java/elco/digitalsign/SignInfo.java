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

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.insc.GenericUtils;
import elco.insc.XML;
import elco.middleware.camel.beans.XMLDocument;

/**
 * @author Roberto Rizzo
 */
public final class SignInfo {

	private static final Logger logger = LoggerFactory.getLogger(SignInfo.class);

	public static final int VALID_SIGN = 0;
	public static final int WARNING_CANT_VALIDATE_CERT_TO_CA = 1;
	public static final int ERROR_INVALID_SIGN = -1;
	public static final int ERROR_NOT_VALID_CA = -2;
	public static final int ERROR_CANT_FIND_CA_CERT = -3;
	public static final int ERROR_NOT_VALID_CERT = -4;
	public static final int ERROR_CANT_VALIDATE_SIGN = -5;

	private int status = VALID_SIGN;
	private String details = "";
	private String caCommonName = "";
	private String caCountrycode = "";
	private String caOrganization = "";
	private String caOrganizationUnit = "";
	private String signer = "";
	private String signerSerialNumber = "";
	private String signerCommonName = "";
	private String signerOrganization = "";
	private String signerOrganizationUnit = "";
	private String signerDNQualifier = "";
	private String signerCountry = "";
	private String signerKeyUsage = "";
	private Date signerValidFromDate = null;
	private Date signerValidToDate = null;
	private String signerSignAlgName = "";
	private String signerCertType = "";
	private Date signerSignDate = null;
	private String signerEmail = "";
	private RevocationInfo signerRevInfos = null;
	private Date signerTimestampDate = null;
	private boolean documentModified = true;
	private int revisionNumber = 1;
	private byte[] certificate = null;

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	public String getCaCommonName() {
		return caCommonName;
	}

	public void setCaCommonName(String caCommonName) {
		this.caCommonName = caCommonName;
	}

	public String getCaCountrycode() {
		return caCountrycode;
	}

	public void setCaCountrycode(String caCountrycode) {
		this.caCountrycode = caCountrycode;
	}

	public String getCaOrganization() {
		return caOrganization;
	}

	public void setCaOrganization(String caOrganization) {
		this.caOrganization = caOrganization;
	}

	public String getCaOrganizationUnit() {
		return caOrganizationUnit;
	}

	public void setCaOrganizationUnit(String caOrganizationUnit) {
		this.caOrganizationUnit = caOrganizationUnit;
	}

	public String getSigner() {
		return signer;
	}

	public void setSigner(String signer) {
		this.signer = signer;
	}

	public String getSignerSerialNumber() {
		return signerSerialNumber;
	}

	public void setSignerSerialNumber(String signerSerialNumber) {
		this.signerSerialNumber = signerSerialNumber;
	}

	public String getSignerCommonName() {
		return signerCommonName;
	}

	public void setSignerCommonName(String signerCommonName) {
		this.signerCommonName = signerCommonName;
	}

	public String getSignerOrganization() {
		return signerOrganization;
	}

	public void setSignerOrganization(String signerOrganization) {
		this.signerOrganization = signerOrganization;
	}

	public String getSignerOrganizationUnit() {
		return signerOrganizationUnit;
	}

	public void setSignerOrganizationUnit(String signerOrganizationUnit) {
		this.signerOrganizationUnit = signerOrganizationUnit;
	}

	public String getSignerDNQualifier() {
		return signerDNQualifier;
	}

	public void setSignerDNQualifier(String signerDNQualifier) {
		this.signerDNQualifier = signerDNQualifier;
	}

	public String getSignerCountry() {
		return signerCountry;
	}

	public void setSignerCountry(String signerCountry) {
		this.signerCountry = signerCountry;
	}

	public String getSignerKeyUsage() {
		return signerKeyUsage;
	}

	public void setSignerKeyUsage(String signerKeyUsage) {
		this.signerKeyUsage = signerKeyUsage;
	}

	public Date getSignerValidFromDate() {
		return signerValidFromDate;
	}

	public void setSignerValidFromDate(Date signerValidFromDate) {
		this.signerValidFromDate = signerValidFromDate;
	}

	public Date getSignerValidToDate() {
		return signerValidToDate;
	}

	public void setSignerValidToDate(Date signerValidToDate) {
		this.signerValidToDate = signerValidToDate;
	}

	public String getSignerSignAlgName() {
		return signerSignAlgName;
	}

	public void setSignerSignAlgName(String signerSignAlgName) {
		this.signerSignAlgName = signerSignAlgName;
	}

	public String getSignerCertType() {
		return signerCertType;
	}

	public void setSignerCertType(String signerCertType) {
		this.signerCertType = signerCertType;
	}

	public Date getSignerSignDate() {
		return signerSignDate;
	}

	public void setSignerSignDate(Date signerSignDate) {
		this.signerSignDate = signerSignDate;
	}

	public String getSignerEmail() {
		return signerEmail;
	}

	public void setSignerEmail(String signerEmail) {
		this.signerEmail = signerEmail;
	}

	public RevocationInfo getSignerRevInfos() {
		return signerRevInfos;
	}

	public void setSignerRevInfos(RevocationInfo signerRevInfos) {
		this.signerRevInfos = signerRevInfos;
	}

	public Date getSignerTimestampDate() {
		return signerTimestampDate;
	}

	public void setSignerTimestampDate(Date signerTimestampDate) {
		this.signerTimestampDate = signerTimestampDate;
	}

	public boolean isDocumentModified() {
		return documentModified;
	}

	public void setDocumentModified(boolean documentModified) {
		this.documentModified = documentModified;
	}

	public int getRevisionNumber() {
		return revisionNumber;
	}

	public void setRevisionNumber(int revisionNumber) {
		this.revisionNumber = revisionNumber;
	}

	public byte[] getCertificate() {
		return certificate;
	}

	public void setCertificate(byte[] certificate) {
		this.certificate = certificate;
	}

	/**
	 * @return XMLDocument
	 */
	public XMLDocument getAsXMLDocument() {
		XMLDocument responseDoc = null;

		try {
			responseDoc = XML.getDocument("<INFO/>");
			responseDoc.add(XMLDocument.root, "<STATUS>" + status + "</STATUS>");
			responseDoc.add(XMLDocument.root, "<DETAILS>" + details + "</DETAILS>");
			responseDoc.add(XMLDocument.root, "<CACN>" + caCommonName + "</CACN>");
			responseDoc.add(XMLDocument.root, "<CACC>" + caCountrycode + "</CACC>");
			responseDoc.add(XMLDocument.root, "<CAO>" + caOrganization + "</CAO>");
			responseDoc.add(XMLDocument.root, "<CAOU>" + caOrganizationUnit + "</CAOU>");
			responseDoc.add(XMLDocument.root, "<SIGNER>" + signer + "</SIGNER>");
			responseDoc.add(XMLDocument.root, "<SIGNERSN>" + signerSerialNumber + "</SIGNERSN>");
			responseDoc.add(XMLDocument.root, "<SIGNERCN>" + signerCommonName + "</SIGNERCN>");
			responseDoc.add(XMLDocument.root, "<SIGNERO>" + signerOrganization + "</SIGNERO>");
			responseDoc.add(XMLDocument.root, "<SIGNEROU>" + signerOrganizationUnit + "</SIGNEROU>");
			responseDoc.add(XMLDocument.root, "<SIGNERDNQ>" + signerDNQualifier + "</SIGNERDNQ>");
			responseDoc.add(XMLDocument.root, "<SIGNERC>" + signerCountry + "</SIGNERC>");
			responseDoc.addComment(XMLDocument.root,
					"digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment, keyAgreement, keyCertSign, cRLSign, encipherOnly, decipherOnly");
			responseDoc.add(XMLDocument.root, "<SIGNERKU>" + signerKeyUsage + "</SIGNERKU>");
			responseDoc.add(XMLDocument.root, "<SIGNERVFD>" + GenericUtils.dateToString(signerValidFromDate) + "</SIGNERVFD>");
			responseDoc.add(XMLDocument.root, "<SIGNERVTD>" + GenericUtils.dateToString(signerValidToDate) + "</SIGNERVTD>");
			responseDoc.add(XMLDocument.root, "<SIGNERALGN>" + signerSignAlgName + "</SIGNERALGN>");
			responseDoc.add(XMLDocument.root, "<SIGNERCT>" + signerCertType + "</SIGNERCT>");
			responseDoc.add(XMLDocument.root, "<SIGNERSD>" + GenericUtils.dateToString(signerSignDate) + "</SIGNERSD>");
			responseDoc.add(XMLDocument.root, "<SIGNEREM>" + signerEmail + "</SIGNEREM>");
			XMLDocument crlDoc = XML.getDocument("<CRLINFO/>");
			if (signerRevInfos != null) {
				crlDoc.add(XMLDocument.root, "<URL>" + signerRevInfos.getCRLInfos().getURI() + "</URL>");
				crlDoc.add(XMLDocument.root, "<ACUPDATE>" + GenericUtils.dateToString(signerRevInfos.getCRLInfos().getThisUpdate()) + "</ACUPDATE>");
				crlDoc.add(XMLDocument.root, "<NEXTUPDATE>" + GenericUtils.dateToString(signerRevInfos.getCRLInfos().getNextUpdate()) + "</NEXTUPDATE>");
				crlDoc.add(XMLDocument.root, "<REVDATE>" + GenericUtils.dateToString(signerRevInfos.getRevocationDate()) + "</REVDATE>");
				crlDoc.add(XMLDocument.root, "<X509CRL>" + signerRevInfos.getCRLInfos().getX509CRL() + "</X509CRL>");
			}
			responseDoc.addChild(XMLDocument.root, crlDoc);
			responseDoc.add(XMLDocument.root, "<SIGNERTSD>" + GenericUtils.dateToString(signerTimestampDate) + "</SIGNERTSD>");
			responseDoc.add(XMLDocument.root, "<DOCMODIFIED>" + documentModified + "</DOCMODIFIED>");
			responseDoc.add(XMLDocument.root, "<REVNUMBER>" + revisionNumber + "</REVNUMBER>");
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return responseDoc;
	}
}
