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
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;

import com.itextpdf.text.Font;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfDate;
import com.itextpdf.text.pdf.PdfDictionary;
import com.itextpdf.text.pdf.PdfName;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfSignature;
import com.itextpdf.text.pdf.PdfSignatureAppearance;
import com.itextpdf.text.pdf.PdfStamper;
import com.itextpdf.text.pdf.PdfString;
import com.itextpdf.text.pdf.security.CertificateInfo;

import elco.exceptions.SignException;

/**
 * @author Roberto Rizzo
 */
public final class SignDataPDF extends BaseSign {

	private SignDataP7M p7msigner = null;
	private Certificate[] certList = null;
	private String reason = null;
	private String location = null;
	private Font font = null;
	private Rectangle signRect = null;
	private static final int CSIZE = 4000;
	private MessageDigest md = null;
	private SimpleDateFormat sdf = null;
	private String cn = null;
	private int read = 0;
	private byte[] buff = null;
	private byte[] pk = null;
	private byte[] outc = null;
	private InputStream is = null;
	private String viewText = null;
	private HashMap<PdfName, Integer> exc = null;
	private Calendar calSignDate = null;

	/**
	 * @param pin
	 *            codice pin della smartcard
	 * @param pcks11Provider
	 *            path al provider PKCS11 (un file .dll per windows, un .so per linux) - il file cambia con la smartcard, è fornito dal produttore della smart card
	 * @throws SignException
	 */
	public SignDataPDF(String pin, String pcks11Provider) throws SignException {
		init(pin, pcks11Provider);

		signRect = new Rectangle(500, 650, 200, 550);
	}

	/**
	 * @param pin
	 *            codice pin della smartcard
	 * @param pcks11Provider
	 *            path al provider PKCS11 (un file .dll per windows, un .so per linux) - il file cambia con la smartcard, è fornito dal produttore della smart card
	 * @param rec
	 * @throws SignException
	 */
	public SignDataPDF(String pin, String pcks11Provider, Rectangle rec) throws SignException {
		init(pin, pcks11Provider);

		signRect = rec;
	}

	private void init(String pin, String pcks11Provider) throws SignException {
		p7msigner = new SignDataP7M(pin, pcks11Provider);
		cert = p7msigner.getCertificate();
		certList = new Certificate[1];
		certList[0] = cert;

		font = new Font();
		font.setSize(0);
		font.setStyle(Font.BOLD);
		font.setColor(0, 0, 0);

		try {
			md = MessageDigest.getInstance("SHA1");
		} catch (NoSuchAlgorithmException ex) {
			throw new SignException(ex);
		}

		sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		cn = CertificateInfo.getSubjectFields((X509Certificate) certList[0]).getField("CN");
		buff = new byte[8192];
		outc = new byte[CSIZE];
		exc = new HashMap<>();
		exc.put(PdfName.CONTENTS, new Integer(CSIZE * 2 + 2));
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	@Override
	public byte[] sign(byte[] toSignBytes, int verifyCertificate) throws SignException {
		ByteArrayOutputStream signedPdf = new ByteArrayOutputStream();

		try {
			PdfReader reader = new PdfReader(toSignBytes);
			PdfStamper stp = PdfStamper.createSignature(reader, signedPdf, '\0');
			PdfSignatureAppearance sap = stp.getSignatureAppearance();
			sap.setVisibleSignature(signRect, 1, "Firma digitale");
			sap.setLayer2Font(font);
			sap.setCertificate(certList[0]);

			// sap.setCrypto(null, this.certList, null, PdfSignatureAppearance.SELF_SIGNED);

			sap.setCertificationLevel(PdfSignatureAppearance.CERTIFIED_NO_CHANGES_ALLOWED);
			calSignDate = new GregorianCalendar();
			sap.setSignDate(calSignDate);
			if (reason != null) {
				sap.setReason(reason);
			}
			if (location != null) {
				sap.setLocation(location);
			}
			sap.setCryptoDictionary(makeSignature());
			viewText = String.format("Documento firmato digitalmente da %s il %s.%nLuogo: %s.%nMotivazione: %s.", cn, sdf.format(calSignDate.getTime()), location, reason);
			sap.setLayer2Text(viewText);
			sap.preClose(exc);

			is = sap.getRangeStream();
			read = 0;
			while ((read = is.read(buff, 0, buff.length)) > 0) {
				md.update(buff, 0, read);
			}
			is.close();

			pk = p7msigner.sign(md.digest(), verifyCertificate);
			PdfDictionary dic2 = new PdfDictionary();
			System.arraycopy(pk, 0, outc, 0, pk.length);
			dic2.put(PdfName.CONTENTS, new PdfString(outc).setHexWriting(true));
			sap.close(dic2);
			reader.close();
		} catch (Exception ex) {
			throw new SignException(ex);
		}

		return signedPdf.toByteArray();
	}

	private PdfSignature makeSignature() {
		PdfSignature sign = new PdfSignature(PdfName.ADOBE_PPKMS, PdfName.ADBE_PKCS7_SHA1);
		sign.setDate(new PdfDate(calSignDate));
		sign.setName(cn);
		if (reason != null) {
			sign.setReason(reason);
		}
		if (location != null) {
			sign.setLocation(location);
		}

		return sign;
	}
}
