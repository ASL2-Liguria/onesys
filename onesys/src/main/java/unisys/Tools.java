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
package unisys;

import java.io.File;

import imago.crypto.CryptPasswordInterface;

import javax.servlet.ServletContext;

public class Tools {
	
	private Tools() {
	}

	public static byte[] cryptPassword(ServletContext context, String psw) {
		byte[] output = null;
		CryptPasswordInterface iCrypto = null;
		Class<?> cCrypto;

		try {
			cCrypto = Class.forName(context.getInitParameter("CryptType"));

			iCrypto = (CryptPasswordInterface) cCrypto.newInstance();

			output = iCrypto.crypt(psw);
		} catch (java.lang.Exception e) {
			e.printStackTrace();
		}

		return output;
	}

	public static String decryptPassword(ServletContext context, String psw) {
		String output = null;
		CryptPasswordInterface iCrypto = null;
		Class<?> cCrypto;

		try {
			cCrypto = Class.forName(context.getInitParameter("CryptType"));

			iCrypto = (CryptPasswordInterface) cCrypto.newInstance();

			output = iCrypto.deCrypt(psw.getBytes());
		} catch (java.lang.Exception e) {
			e.printStackTrace();
		}

		return output;
	}

	public static String fromByteToString(byte[] lista) {
		int i = 0;
		String strOutput = "";
		String strTmp = "";

		if (lista != null) {
			try {
				for (i = 0; i < lista.length; i++) {
					strTmp += String.valueOf((char) lista[i]);
				}
			} catch (java.lang.Exception ex) {
			}
		}
		strOutput = strTmp;
		return strOutput;
	}
	
	public static String addTimestamp(String path, ServletContext context) {
		try {
			if (path.indexOf("?") < 0) {
//				File risorsa = new File(context.getRealPath("/") + path);
//				path = path + (path.contains("?") ? "&" : "?") + "t=" + risorsa.lastModified();
				//finche' non avremo JCSCache:
				path = path + "?t=" + context.getInitParameter("CACHE_INCLUDE_FILES");
			}
		} catch (Exception e) {
		}
		return path;
	}
}
