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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.itextpdf.text.pdf.AcroFields;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.security.PdfPKCS7;

import elco.dicom.utils.IOUtils;
import elco.digitalsign.utils.Base64;
import elco.exceptions.SignException;

/**
 * @author Roberto Rizzo
 */
public final class RetrieveSignInfoPDF extends RetrieveSignInfoBase {

	private PdfPKCS7 signer = null;
	private PdfReader reader;
	private int totalRevisions = 0;
	private ArrayList<String> names;
	private AcroFields acroFields;

	/**
	 * @param signedBytes
	 * @throws SignException
	 */
	public RetrieveSignInfoPDF(byte[] signedBytes) throws SignException {
		super();
		initRetrieveSignInfoPDF(signedBytes);
	}

	/**
	 * @param signedBytes
	 * @param keyStorePath
	 * @throws SignException
	 */
	public RetrieveSignInfoPDF(byte[] signedBytes, String keyStorePath) throws SignException {
		super(keyStorePath);
		initRetrieveSignInfoPDF(signedBytes);
	}

	private void initRetrieveSignInfoPDF(byte[] signedBytes) throws SignException {
		try {
			byte[] decodedBytes = Base64.getData(signedBytes);
			originalData = decodedBytes;
			reader = new PdfReader(decodedBytes);
			acroFields = reader.getAcroFields();
			totalRevisions = acroFields.getTotalRevisions();
			names = acroFields.getSignatureNames();
		} catch (Exception ex) {
			throw new SignException(ex);
		}
	}

	/**
	 * @return Total document revisions
	 */
	public int getTotalRevisions() {
		return totalRevisions;
	}

	/**
	 * @return Revisions names
	 */
	public List<String> getRevisionsNames() {
		return names;
	}

	/**
	 * Extract a revision from the document
	 *
	 * @param name
	 *            Revision name
	 * @return byte[]
	 * @throws IOException
	 */
	public byte[] extractRevision(String name) throws IOException {
		try (InputStream is = acroFields.extractRevision(name); ByteArrayOutputStream bais = new ByteArrayOutputStream()) {
			IOUtils.safeCopy(is, bais);
			return bais.toByteArray();
		}
	}

	@Override
	public final SignInfo[] getSignInfo() throws SignException {
		SignInfo[] si = null;

		try {
			si = new SignInfo[names.size()];
			for (int index = 0; index < names.size(); index++) {
				String name = names.get(index);
				signer = acroFields.verifySignature(name);
				X509Certificate cert = signer.getSigningCertificate();
				// OCSPUtils.ocsp(cert, "Y:\\Lavori\\eclipse2\\DigitalSign\\filefirmati\\CACerts.jks");
				si[index] = getInfo(cert);
				si[index].setRevisionNumber(acroFields.getRevision(name));
			}
		} catch (Exception ex) {
			throw new SignException(ex);
		}

		return si;
	}

	@Override
	protected Date getSignTime() {
		return signer.getSignDate().getTime();
	}

	@Override
	protected boolean verifyDigest(X509Certificate cert) {
		boolean result = false;

		try {
			// verifico la validità del documento
			result = signer.verify();
		} catch (GeneralSecurityException ex) {
			logger.error("", ex);
		}

		return result;
	}

	@Override
	protected void getTimeStampDate(SignInfo info) {
		Calendar timeStampDate = signer.getTimeStampDate();
		if (timeStampDate != null) {
			info.setSignerTimestampDate(timeStampDate.getTime());
		}
	}
}
