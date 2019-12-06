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
import java.security.cert.CertificateParsingException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.bouncycastle.asn1.ASN1InputStream;
import org.bouncycastle.asn1.ASN1Primitive;
import org.bouncycastle.asn1.DEROctetString;
import org.bouncycastle.asn1.DERSequence;
import org.bouncycastle.asn1.DERTaggedObject;
import org.bouncycastle.asn1.DLSequence;

/**
 * @author Roberto Rizzo
 */
public final class URIS {

	private URIS() {
	}

	/**
	 * @param certificate
	 * @param extensionValue
	 * @return List of URIs
	 * @throws CertificateParsingException
	 */
	public static final List<String> getURIS(X509Certificate certificate, String extensionValue) throws CertificateParsingException {
		ASN1InputStream oAsnInStream = null;
		ASN1InputStream oAsnInStream2 = null;

		try {
			byte[] val1 = certificate.getExtensionValue(extensionValue);
			oAsnInStream = new ASN1InputStream(new ByteArrayInputStream(val1));
			ASN1Primitive derObj = oAsnInStream.readObject();
			DEROctetString dos = (DEROctetString) derObj;
			byte[] val2 = dos.getOctets();
			oAsnInStream2 = new ASN1InputStream(new ByteArrayInputStream(val2));
			ASN1Primitive derObj2 = oAsnInStream2.readObject();

			return getDERValue(derObj2);
		} catch (Exception ex) {
			throw new CertificateParsingException(ex);
		} finally {
			IOUtils.closeQuietly(oAsnInStream2);
			IOUtils.closeQuietly(oAsnInStream);
		}
	}

	private static final List<String> getDERValue(ASN1Primitive derObj) {
		if (derObj instanceof DLSequence) { // 2016-07-08
			ArrayList<String> ret = new ArrayList<>();
			DLSequence seq = (DLSequence) derObj;
			Enumeration<?> enums = seq.getObjects();
			while (enums.hasMoreElements()) {
				ASN1Primitive nestedObj = (ASN1Primitive) enums.nextElement();
				ArrayList<String> ders = (ArrayList<String>) getDERValue(nestedObj);
				if (ders != null) {
					ret.addAll(ders);
				}
			}

			return ret;
		}

		if (derObj instanceof DERSequence) {
			ArrayList<String> ret = new ArrayList<>();
			DERSequence seq = (DERSequence) derObj;
			Enumeration<?> enums = seq.getObjects();
			while (enums.hasMoreElements()) {
				ASN1Primitive nestedObj = (ASN1Primitive) enums.nextElement();
				ArrayList<String> ders = (ArrayList<String>) getDERValue(nestedObj);
				if (ders != null) {
					ret.addAll(ders);
				}
			}

			return ret;
		}

		if (derObj instanceof DERTaggedObject) {
			DERTaggedObject derTag = (DERTaggedObject) derObj;
			if (derTag.isExplicit() && !derTag.isEmpty()) {
				ASN1Primitive nestedObj = derTag.getObject();
				return getDERValue(nestedObj);
			}

			DEROctetString derOct = (DEROctetString) derTag.getObject();
			String val = new String(derOct.getOctets());
			ArrayList<String> ret = new ArrayList<>();
			ret.add(val);

			return ret;
		}

		return null;
	}
}
