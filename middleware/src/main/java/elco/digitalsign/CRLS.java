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
import java.io.InputStream;
import java.net.Authenticator;
import java.net.InetSocketAddress;
import java.net.PasswordAuthentication;
import java.net.Proxy;
import java.net.URL;
import java.net.URLConnection;
import java.security.cert.CertificateFactory;
import java.security.cert.CertificateParsingException;
import java.security.cert.X509CRL;
import java.security.cert.X509CRLEntry;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import javax.naming.ConfigurationException;
import javax.naming.Context;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import javax.security.auth.x500.X500Principal;

import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.digitalsign.utils.Certificates;
import elco.digitalsign.utils.URIS;
import elco.exceptions.SignException;
import elco.insc.ByteUtils;
import elco.insc.FileUtils;

/**
 * @author Roberto Rizzo
 */
public final class CRLS {

	private static final Logger logger = LoggerFactory.getLogger(CRLS.class);
	private static final String CRLDISTRIBUTIONPOINTOID = "2.5.29.31"; // NOSONAR
	private static final String CRLSEARCHSTRING = "certificaterevocationlist;binary"; // "certificaterevocationlist"
	private Proxy proxy = null;
	private final X509Certificate certificate;
	private final ArrayList<String> distributionPoints;
	private CRLInfos crlInfos = null;

	/**
	 * @param certificate
	 * @throws CertificateParsingException
	 */
	public CRLS(X509Certificate certificate) throws CertificateParsingException {
		this.certificate = certificate;
		distributionPoints = (ArrayList<String>) getDistributionPoints();
	}

	/**
	 * @param crlInfos
	 */
	public void setCRLInfos(CRLInfos crlInfos) {
		this.crlInfos = crlInfos;
	}

	/**
	 * @param revinfo
	 * @throws SignException
	 */
	public void verifyRevocation(RevocationInfo revinfo) throws SignException {
		if (revinfo.getRevocationDate() != null) {
			throw new SignException("Certificate revoked: " + revinfo.getRevocationDate().toString());
		}
	}

	/**
	 * @return List<String>
	 * @throws CertificateParsingException
	 */
	public List<String> getDistributionPoints() throws CertificateParsingException {
		return URIS.getURIS(certificate, CRLDISTRIBUTIONPOINTOID);
	}

	/**
	 * @return RevocationInfo
	 */
	public RevocationInfo getRevocationInfos() {
		RevocationInfo revinfo = null;

		try {
			if (crlInfos == null) {
				crlInfos = getCRL(distributionPoints);
			}
			X509CRLEntry entry = isRevoked(crlInfos.getX509CRL()); // NOSONAR
			revinfo = new RevocationInfo(crlInfos);
			getRevocationDetails(entry, revinfo);
			X500Name x500name = new X500Name(certificate.getSubjectX500Principal().getName(X500Principal.RFC1779));
			String owner = Certificates.getRDN(x500name, BCStyle.GIVENNAME) + " " + Certificates.getRDN(x500name, BCStyle.SURNAME);
			revinfo.setSerialNumber(certificate.getSerialNumber());
			revinfo.setCertificateOwner(owner);
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return revinfo;
	}

	/**
	 * @param proxyType
	 * @param ip
	 * @param port
	 * @throws ConfigurationException
	 */
	public void setProxy(String proxyType, String ip, int port) throws ConfigurationException {
		String type = proxyType.toUpperCase();
		if ("DIRECT".equals(type)) {
			proxy = Proxy.NO_PROXY;
			logger.info("Configured proxy type: DIRECT");
		} else if ("HTTP".equals(type)) {
			proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(ip, port));
			logger.info("Configured proxy type: HTTP");
		} else if ("SOCKS".equals(type)) {
			proxy = new Proxy(Proxy.Type.SOCKS, new InetSocketAddress(ip, port));
			logger.info("Configured proxy type: SOCKS");
		} else {
			throw new ConfigurationException("Unknown type " + proxyType);
		}
	}

	/**
	 * @param user
	 * @param password
	 */
	public void setProxyAuthenticator(final String user, final String password) {
		if (user != null && password != null) {
			Authenticator authenticator = new Authenticator() {
				@Override
				public PasswordAuthentication getPasswordAuthentication() {
					return new PasswordAuthentication(user, password.toCharArray());
				}
			};
			Authenticator.setDefault(authenticator);
		}
	}

	private X509CRLEntry isRevoked(X509CRL x509crl) {
		return x509crl.getRevokedCertificate(certificate);
	}

	private void getRevocationDetails(X509CRLEntry entry, RevocationInfo revinfo) {
		if (entry != null) {
			revinfo.setRevoked(true);
			revinfo.setRevocationDate(entry.getRevocationDate());
			revinfo.setRevocationReason(entry.getRevocationReason().toString());
		}
	}

	private CRLInfos getCRL(List<String> distributionPoints) {
		CRLInfos crlinfos = null;

		for (String uri : distributionPoints) {
			try {
				X509CRL x509crl = getFromUri(uri);
				if (x509crl != null) {
					crlinfos = new CRLInfos(uri, x509crl);
					break;
				}
			} catch (Exception ex) {
				logger.warn("", ex);
			}
		}

		return crlinfos;
	}

	private X509CRL getFromUri(String uri) throws SignException {
		try {
			CertificateFactory cf = CertificateFactory.getInstance("X.509");
			X509CRL x509crl = null;

			String urilc = uri.toLowerCase();
			if (proxy.type() == Proxy.Type.DIRECT) {
				if (urilc.startsWith("ldap")) {
					x509crl = getFromLDAPUri(uri, cf);
				} else if (urilc.startsWith("http") || urilc.startsWith("https") || urilc.startsWith("ftp")) {
					x509crl = getFromHTTPUri(uri, cf);
				}
			} else {
				if (!urilc.startsWith("ldap")) {
					x509crl = getFromHTTPUri(uri, cf);
				}
			}

			return x509crl;
		} catch (Exception ex) {
			throw new SignException(ex);
		}
	}

	private X509CRL getFromLDAPUri(String uri, CertificateFactory cf) {
		InputStream inStream = null;
		X509CRL x509crl = null;

		try { // NOSONAR
			Hashtable<String, String> env = new Hashtable<>(); // NOSONAR
			env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
			env.put(Context.SECURITY_AUTHENTICATION, "none");
			env.put(Context.PROVIDER_URL, uri);

			DirContext ctx = new InitialDirContext(env);
			Attributes avals = ctx.getAttributes("");

			Attribute aVal = avals.get(CRLSEARCHSTRING);
			if (aVal != null) {
				byte[] val = (byte[]) aVal.get();
				if (!ByteUtils.isEmpty(val)) {
					inStream = new ByteArrayInputStream(val);
					x509crl = (X509CRL) cf.generateCRL(inStream);
				}
			}
		} catch (Exception ex) {
			logger.error("", ex);
		} finally {
			FileUtils.safeClose(inStream);
		}

		return x509crl;
	}

	private X509CRL getFromHTTPUri(String uri, CertificateFactory cf) {
		InputStream inputStream = null;
		X509CRL x509crl = null;

		try {
			logger.info("Configured proxy: {} {}", proxy.type(), proxy.address() != null ? proxy.address().toString() : "");
			URLConnection urlConnection = new URL(uri).openConnection(proxy);
			inputStream = urlConnection.getInputStream();
			x509crl = (X509CRL) cf.generateCRL(inputStream);
		} catch (Exception ex) {
			logger.error("", ex);
		} finally {
			FileUtils.safeClose(inputStream);
		}

		return x509crl;
	}
}
