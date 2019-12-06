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
import java.io.IOException;
import java.security.AuthProvider;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.Security;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.util.List;

import javax.security.auth.callback.CallbackHandler;
import javax.smartcardio.Card;
import javax.smartcardio.CardChannel;
import javax.smartcardio.CardException;
import javax.smartcardio.CardTerminal;
import javax.smartcardio.CommandAPDU;
import javax.smartcardio.ResponseAPDU;
import javax.smartcardio.TerminalFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.security.pkcs11.SunPKCS11;

/**
 * @author Roberto Rizzo
 */
@SuppressWarnings("restriction")
public class ReadPublicCertificate {

	private static Logger logger = LoggerFactory.getLogger(ReadPublicCertificate.class);

	/**
	 * @param pin
	 * @param pPKCS11Provider
	 * @throws UnrecoverableKeyException
	 * @throws KeyStoreException
	 * @throws NoSuchAlgorithmException
	 * @throws CertificateException
	 * @throws IOException
	 */
	public ReadPublicCertificate(String pin, String pPKCS11Provider)
			throws UnrecoverableKeyException, KeyStoreException, NoSuchAlgorithmException, CertificateException, IOException {
		String pkcs11config = "name=PKCS11\n" + "library=" + pPKCS11Provider;
		pkcs11config += "\nattributes(*,*,*)={ CKA_TOKEN=null }";
		pkcs11config += "\nattributes(*,CKO_PUBLIC_KEY,*)={ CKA_TOKEN=true }";

		List<CardTerminal> ls = null;
		try {
			ls = TerminalFactory.getDefault().terminals().list();
			CardTerminal ct = ls.get(0);
			Card cd = ct.connect("*");
			CardChannel channel = cd.getBasicChannel();
			byte[] masterCardRid = new byte[] { (byte) 0xA0, 0x00, 0x00, 0x00, 0x04 };
			CommandAPDU command = new CommandAPDU(0x00, 0xA4, 0x04, 0x00, masterCardRid);
			ResponseAPDU response = channel.transmit(command);
			@SuppressWarnings("unused")
			byte[] resp = response.getData();

			cd.disconnect(false);
		} catch (CardException ex) {
			logger.error("", ex);
		}

		CallbackHandler cmdLineHdlr = new com.sun.security.auth.callback.TextCallbackHandler();

		// Creo un provider per il PKCS11
		ByteArrayInputStream configStream = new ByteArrayInputStream(pkcs11config.getBytes());
		// Provider oProvider = new SunPKCS11(configStream);

		AuthProvider oProvider = new SunPKCS11(configStream);
		oProvider.setCallbackHandler(cmdLineHdlr);

		Security.addProvider(oProvider);

		KeyStore oKeyStore = KeyStore.getInstance("PKCS11");
		// oKeyStore.load(null, pin.toCharArray());
		oKeyStore.load(null, null);
		// oKeyStore.load(null);
	}
}
