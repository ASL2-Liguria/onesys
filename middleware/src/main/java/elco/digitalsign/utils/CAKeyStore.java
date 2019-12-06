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
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Date;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.HttpVersion;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.Credentials;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.bouncycastle.cms.CMSProcessableByteArray;
import org.bouncycastle.cms.CMSSignedData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.crypt.CryptException;
import elco.crypt.CryptInterface;
import elco.crypt.PBECryptString;
import elco.exceptions.SignUtilsException;
import elco.insc.Constants;
import elco.insc.FileUtils;

/**
 * @author Roberto Rizzo
 */
public final class CAKeyStore {

	private static Logger logger = LoggerFactory.getLogger(CAKeyStore.class);
	private static final String CRYPTKSKEY = "f+gv2mBdLvjOunEJ8KWvPA==";
	private String ksKey = null;
	private KeyStore keystore;
	private Date creationDate = new Date(0L);
	private HttpHost proxy = null;
	private Credentials defaultCreds = null;
	public static final String CACERTSURL = "http://www.cnipa.gov.it/site/_files/lista%20dei%20certificati.html";

	/**
	 * The keystore is constructed using data present on site: "http://www.cnipa.gov.it/"
	 *
	 * @throws CryptException
	 */
	public CAKeyStore() throws CryptException {
		init();
		keystore = null;
	}

	/**
	 * Construct the keystore from a byte array
	 *
	 * @param ksb
	 *            byte array representing a keystore
	 * @throws SignUtilsException
	 */
	public CAKeyStore(byte[] ksb) throws SignUtilsException {
		try {
			init();
			keystore = KeyStore.getInstance("JKS");
			ByteArrayInputStream bis = new ByteArrayInputStream(ksb);
			keystore.load(bis, ksKey.toCharArray());
			bis.close();
			creationDate = new Date();
		} catch (Exception ex) {
			throw new SignUtilsException(ex);
		}
	}

	/**
	 * Construct the keystore from a file
	 *
	 * @param ksPath
	 *            Path to a keystore
	 * @throws SignUtilsException
	 * @throws IOException
	 */
	public CAKeyStore(String ksPath) throws SignUtilsException, IOException {
		this(elco.dicom.utils.IOUtils.loadByteArray(ksPath));
		creationDate = FileUtils.getLastModificationTime(ksPath);
	}

	private void init() throws CryptException {
		CryptInterface ci = new PBECryptString();
		ksKey = ci.deCrypt(CRYPTKSKEY.getBytes());
	}

	/**
	 * @param proxyIP
	 *            proxy server ip address
	 * @param proxyPort
	 *            proxy server port
	 */
	public void setProxy(String proxyIP, int proxyPort) {
		if (proxyIP != null && proxyPort > 0) {
			proxy = new HttpHost(proxyIP, proxyPort);
		}
	}

	/**
	 * @param proxyUser
	 *            proxy server user
	 * @param proxyPassword
	 *            proxy server user password
	 */
	public void setProxyCredentials(String proxyUser, String proxyPassword) {
		if (proxyUser != null && proxyPassword != null) {
			defaultCreds = new UsernamePasswordCredentials(proxyUser, proxyPassword);
		}
	}

	/**
	 * @param toFind
	 *            certificate alias
	 * @return Returns the certificate associated with the given alias
	 */
	public final X509Certificate getCACert(String toFind) {
		X509Certificate cert = null;

		try {
			cert = (X509Certificate) keystore.getCertificate(toFind);
		} catch (Exception ex) {
			logger.error("", ex);
		}

		return cert;
	}

	/**
	 * @return return used KeyStore
	 */
	public final KeyStore getKeyStore() {
		return keystore;
	}

	/**
	 * Create a CA certificates list
	 */
	public final void createCACertsList() {
		try {
			createKeyStore(getCACertListFromURL());
			creationDate = new Date();
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	/**
	 * Save CA certificates list to file
	 *
	 * @param ksPath
	 * @throws IOException
	 */
	public final void saveCACertsList2File(String ksPath) throws SignUtilsException {
		try {
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			keystore.store(bos, ksKey.toCharArray());
			elco.dicom.utils.IOUtils.saveByteArray(ksPath, bos.toByteArray());
		} catch (Exception ex) {
			throw new SignUtilsException(ex);
		}
	}

	/**
	 * @return CA certificates list creation date
	 */
	public Date getCreationDate() {
		return creationDate;
	}

	private final byte[] getCACertListFromURL() throws SignUtilsException {
		InputStream responseStream = null;

		try {
			// Questo codice è stato testato con il sito del "cnipa"
			// Per eventuali altri siti è tutto da verificare
			HttpClientBuilder builder = HttpClientBuilder.create();
			if (proxy != null) {
				builder.setProxy(proxy);
				if (defaultCreds != null) {
					CredentialsProvider credsProvider = new BasicCredentialsProvider();
					credsProvider.setCredentials(AuthScope.ANY, defaultCreds);
					builder.setDefaultCredentialsProvider(credsProvider);
				}
			}
			CloseableHttpClient httpClient = builder.build();

			HttpGet get = new HttpGet(CACERTSURL);
			get.addHeader("Content-type", "text/html; charset=UTF-8");
			get.setProtocolVersion(HttpVersion.HTTP_1_1);
			HttpResponse response = httpClient.execute(get);
			String page = IOUtils.toString(response.getEntity().getContent(), Constants.DEFAULT_VM_CHARSET);
			String fileURL = page.substring(page.lastIndexOf("href=") + 6, page.indexOf("p7m") + 3);

			get = new HttpGet(fileURL);
			get.addHeader("Content-type", "application/zip; charset=UTF-8");
			get.setProtocolVersion(HttpVersion.HTTP_1_1);
			response = httpClient.execute(get);
			// leggo il file ".zip" e lo passo direttamente come stream di byte
			// per la costruzione del keystore
			responseStream = response.getEntity().getContent();
			return elco.dicom.utils.IOUtils.loadByteArray(responseStream);
		} catch (Exception ex) {
			throw new SignUtilsException(ex);
		} finally {
			FileUtils.safeClose(responseStream);
		}
	}

	private final void createKeyStore(byte[] caList) {
		try {
			keystore = KeyStore.getInstance("JKS");
			keystore.load(null);

			CMSSignedData sdata = new CMSSignedData(caList);
			CMSProcessableByteArray cpb = (CMSProcessableByteArray) sdata.getSignedContent();
			ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream((byte[]) cpb.getContent()));

			byte[] zeb;
			ZipEntry ze = zis.getNextEntry();
			while (ze != null) {
				if (!ze.isDirectory()) {
					zeb = new byte[(int) ze.getSize()];
					int read = zis.read(zeb);
					if (read > 0) { // NOSONAR
						addCertificateToKeyStore(zeb);
					}
				}

				ze = zis.getNextEntry();
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}

	private void addCertificateToKeyStore(byte[] zeb) throws CertificateException {
		CertificateFactory cf = CertificateFactory.getInstance("X.509");
		ByteArrayInputStream inStream = new ByteArrayInputStream(zeb);
		X509Certificate cert = null;
		String alias;

		try {
			cert = (X509Certificate) cf.generateCertificate(inStream);
			alias = cert.getIssuerX500Principal().getName();
			keystore.setCertificateEntry(alias, cert);
		} catch (CertificateException ex) {
			logger.debug("", ex);
		} catch (Exception ex) {
			logger.error("", ex);
		} finally {
			IOUtils.closeQuietly(inStream);
		}
	}
}
