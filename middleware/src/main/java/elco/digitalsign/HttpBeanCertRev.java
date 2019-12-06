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

import java.io.IOException;
import java.security.cert.X509Certificate;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

import javax.activation.DataHandler;
import javax.security.auth.x500.X500Principal;

import org.apache.camel.Exchange;
import org.apache.camel.Handler;
import org.apache.commons.lang3.StringUtils;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.crypt.PBECryptString;
import elco.digitalsign.utils.CAKeyStore;
import elco.digitalsign.utils.Certificates;
import elco.exceptions.NoValueException;
import elco.exceptions.SignInfoException;
import elco.exceptions.SignUtilsException;
import elco.insc.Constants;
import elco.insc.FileUtils;
import elco.middleware.camel.beans.XMLDocument;

/**
 * @author Roberto Rizzo
 */
public final class HttpBeanCertRev {

	private static final Logger logger = LoggerFactory.getLogger(HttpBeanCertRev.class);
	private final ConcurrentMap<String, CRLInfos> crlsMap = new ConcurrentHashMap<>();
	private final String proxyType;
	private final String proxyIP;
	private final int proxyPort;
	private String proxyUser = null;
	private String proxyPassword = null;
	private CAKeyStore caKeyStore = null;
	private String caKeyStorePath = null;
	private int updateCAKeystoreDays = 7;
	private static final String ATTACHMENTNAME = "certB64";

	/**
	 * @throws IOException
	 */
	public HttpBeanCertRev() throws IOException {
		try {
			proxyType = "DIRECT";
			proxyIP = null;
			proxyPort = 0;
			caKeyStore = new CAKeyStore();
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * @param proxyType
	 * @param proxyIP
	 * @param proxyPort
	 * @throws IOException
	 */
	public HttpBeanCertRev(String proxyType, String proxyIP, int proxyPort) throws IOException {
		try {
			this.proxyType = proxyType;
			this.proxyIP = proxyIP;
			this.proxyPort = proxyPort;
			caKeyStore = new CAKeyStore();
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Default 7 days
	 *
	 * @param updateCAKeystoreDays
	 */
	public void setUpdateDays(int updateCAKeystoreDays) {
		this.updateCAKeystoreDays = updateCAKeystoreDays;
	}

	/**
	 * @param proxyUser
	 */
	public void setProxyUser(String proxyUser) {
		this.proxyUser = proxyUser;
	}

	/**
	 * B64-PBE crypted password
	 *
	 * @param proxyPassword
	 * @throws IOException
	 */
	public void setProxyPassword(String proxyPassword) throws IOException {
		try {
			PBECryptString pbes = new PBECryptString();
			this.proxyPassword = pbes.deCrypt(proxyPassword.getBytes());
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * @param caKeyStorePath
	 */
	public void setCAKeyStore(String caKeyStorePath) {
		this.caKeyStorePath = caKeyStorePath;
	}

	@Handler
	public void handler(Exchange exchange) throws IOException {
		XMLDocument response = XMLDocument.getDocument("<X509INFOS/>", Constants.DEFAULT_VM_CHARSET);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
		String certStringB64 = null;

		try {
			DataHandler dh = exchange.getIn().getAttachment(ATTACHMENTNAME);
			if (dh != null) {
				certStringB64 = dh.getContent().toString();
			} else {
				certStringB64 = exchange.getIn().getHeader(ATTACHMENTNAME, String.class);
			}

			if (certStringB64 == null) {
				throw new NoValueException("Can't extract certificate");
			}

			logger.info("Certificate extracted from message");
			X509Certificate certificate = Certificates.getX509Certificate(certStringB64);
			logger.info("Start retrieving information for the certificate number: {}", certificate.getSerialNumber());

			CRLS crls = new CRLS(certificate);
			crls.setProxy(proxyType, proxyIP, proxyPort);
			crls.setProxyAuthenticator(proxyUser, proxyPassword);

			CRLInfos crlinfos;
			for (String uri : crls.getDistributionPoints()) {
				crlinfos = crlsMap.get(uri);
				if (crlinfos != null && crlinfos.getNextUpdate().after(new Date())) {
					crls.setCRLInfos(crlinfos);
					logger.info("Found cached entry for uri \"{}\" valid up to \"{}\"", uri, crlinfos.getNextUpdate());
					break;
				}
			}

			RevocationInfo rinfo = crls.getRevocationInfos();
			crlsMap.put(rinfo.getCRLInfos().getURI(), rinfo.getCRLInfos());

			X500Name caX500Name = new X500Name(certificate.getIssuerX500Principal().getName(X500Principal.RFC1779));
			String caCommonName = Certificates.getRDN(caX500Name, BCStyle.CN);

			if (caKeyStorePath != null) {
				verifyCA(certificate);
				logger.info("Certificate signed by: {}", caCommonName);
			}
			logger.info("Finished retrieving information for the certificate number: {}", certificate.getSerialNumber());

			String serialNumber = rinfo.getSerialNumber().toString();
			response.add(XMLDocument.root, "<SERIALNUMBER>" + serialNumber + "</SERIALNUMBER>");

			response.add(XMLDocument.root, "<CACOMMONNAME>" + caCommonName + "</CACOMMONNAME>");

			response.add(XMLDocument.root, "<NONREPUDIATION>" + Certificates.isNonRepudiation(certificate) + "</NONREPUDIATION>");

			String notBefore = sdf.format(certificate.getNotBefore());
			response.add(XMLDocument.root, "<NOTBEFORE>" + notBefore + "</NOTBEFORE>");
			String notAfter = sdf.format(certificate.getNotAfter());
			response.add(XMLDocument.root, "<NOTAFTER>" + notAfter + "</NOTAFTER>");

			response.add(XMLDocument.root, "<VALID>" + Certificates.checkValidity(certificate) + "</VALID>");

			response.add(XMLDocument.root, "<REVOKED>" + rinfo.isRevoked() + "</REVOKED>");
			if (rinfo.isRevoked()) {
				String date = sdf.format(rinfo.getRevocationDate());
				response.add(XMLDocument.root, "<REVOCATIONDATE>" + date + "</REVOCATIONDATE>");
				response.add(XMLDocument.root, "<REVOCATIONREASON>" + rinfo.getRevocationReason() + "</REVOCATIONREASON>");
			}
		} catch (Exception ex) {
			String exceptionAsString = ex.getLocalizedMessage() + Constants.lineSeparator + StringUtils.join(ex.getStackTrace(), Constants.lineSeparator);
			response.add(XMLDocument.root, "<ERROR>" + exceptionAsString + "</ERROR>");
			logger.error("", ex);
		}

		exchange.getOut().setBody(response.toString());
	}

	private void verifyCA(X509Certificate certificate) throws SignInfoException {
		try {
			Date timeNow = new Date();
			Date keyStoreModificationTime = FileUtils.getLastModificationTime(caKeyStorePath);
			if (keyStoreModificationTime.getTime() == 0) {
				createKeyStoreFromURL();
			} else {
				if ((TimeUnit.MILLISECONDS.toDays(timeNow.getTime() - keyStoreModificationTime.getTime())) >= updateCAKeystoreDays) {
					createKeyStoreFromURL();
				} else {
					createKeyStoreFromFile();
				}
			}

			Certificates.verifyCA(certificate, caKeyStore);
		} catch (Exception ex) {
			throw new SignInfoException(ex);
		}
	}

	private void createKeyStoreFromFile() throws SignUtilsException, IOException {
		logger.info("Create keystore from File");
		synchronized (caKeyStore) {
			caKeyStore = new CAKeyStore(caKeyStorePath);
		}
	}

	private void createKeyStoreFromURL() throws SignUtilsException {
		try {
			logger.info("Create keystore from URL");
			synchronized (caKeyStore) {
				caKeyStore = new CAKeyStore();
				if (!"DIRECT".equals(proxyType)) { // since 5.0.3 - 29/09/2016
					caKeyStore.setProxy(proxyIP, proxyPort);
					caKeyStore.setProxyCredentials(proxyUser, proxyPassword);
				}
				caKeyStore.createCACertsList();
				caKeyStore.saveCACertsList2File(caKeyStorePath);
			}
		} catch (Exception ex) {
			throw new SignUtilsException(ex);
		}
	}
}
