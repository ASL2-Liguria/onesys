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
package src.Sel_Stampa;

import imago.a_util.CContextParam;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import stampe.anteprima.IElaborazioneStampa;
import stampe.anteprima.printInfo;

/**
 * @author linob
 * @version 1.0
 * @scope Definita una classe per stampare dentro l'activeX dalla webapp di
 *        cristal clear
 */
public class ElaborazioneStampaCristalClear implements IElaborazioneStampa {
	private printInfo myParam = null;
	private String strUrlServletPdf = "";
	private HttpServletRequest myRequest = null;
	private Hashtable myTableRequest = null;
	private final String webappname = "crystal?init=pdf";
	private ElcoLoggerInterface logger = null;

	public ElaborazioneStampaCristalClear() {
		logger = new ElcoLoggerImpl(this.getClass().getSimpleName());
	}

	@Override
	public void Elaborazione() {

		String sf = "";
		String key = "";
		String val = "";
		Enumeration e = null;
		String url = "";
		logger.info("Inizio composizione url");
		try {
			url = myParam.getUrlImago().substring(0,
					myParam.getUrlImago().length() - 1);
			strUrlServletPdf = url.substring(0, url.lastIndexOf("/") + 1);
			strUrlServletPdf += webappname;
			logger.info("strUrlServletPdf: " + strUrlServletPdf);

			strUrlServletPdf += "&report=" + myParam.getPathReport()
					+ myParam.getReportName();
			logger.info("strUrlServletPdf: " + strUrlServletPdf);

			sf = (String) myTableRequest.get("stampaSelection");

			if (sf != null && !sf.equals("")) {
				sf = URLEncoder.encode(sf, "UTF-8");
				strUrlServletPdf += "&" + "sf=" + sf;
			}

			try {
				// Forzo il catch dell'eccezione nullpointer se non esiste il
				// parametro stampaPrompt,in questo modo, separo la stampa da
				// applet da quella con activex per la gestione della selection
				// formula che in un caso è passata tramite request(activex)
				// mentre nel caso applet viene passata tramite json
				JSONArray jsonPrompt = new JSONArray(
						(String) myTableRequest.get("stampaPrompt"));
				JSONObject jsonInterno = null;
				Iterator it = null;
				for (int i = 0; i < jsonPrompt.length(); i++) {
					try {
						jsonInterno = jsonPrompt.getJSONObject(i);
					} catch (JSONException e1) {
						// TODO Auto-generated catch block
						logger.error(e1.getLocalizedMessage());
					}
					it = jsonInterno.keys();
					while (it.hasNext()) {
						String keyInterno = (String) it.next();
						try {
							strUrlServletPdf += "&"
									+ keyInterno.replaceAll("[<>]", "") + "="
									+ jsonInterno.getString(keyInterno);
						} catch (JSONException e1) {
							// TODO Auto-generated catch block
							logger.error(e1.getMessage());
						}
					}
				}
			} catch (NullPointerException exnull) {
				e = myTableRequest.keys();
				while (e.hasMoreElements()) {
					key = (String) e.nextElement();
					val = (String) myTableRequest.get(key);

					if (key.length() > 5
							&& key.substring(0, 6).equals("prompt")) {
						strUrlServletPdf += "&" + key.replaceAll("[<>]", "")
								+ "=" + val;
					}
				}
			}
			logger.info(strUrlServletPdf);
		} catch (UnsupportedEncodingException e1) {
			logger.error(e1.getMessage());
		} catch (Exception e1) {
			logger.error(e1.getMessage());
		}
	}

	/**
	 * getNCopie
	 *
	 * @return String
	 * @todo Implement this src.Sel_Stampa.IElaborazioneStampa method
	 */
	@Override
	public String getNCopie() {
		String ncop = "";
		return ncop;
	}

	/**
	 * getUrlPdf
	 *
	 * @return String
	 * @todo Implement this src.Sel_Stampa.IElaborazioneStampa method
	 */
	@Override
	public String getUrlPdf() {
		return strUrlServletPdf;
	}

	/**
	 * setParam
	 *
	 * @param par
	 *            printInfo
	 * @param myRichieste
	 *            Hashtable
	 * @param myInputRequest
	 *            HttpServletRequest
	 * @param myConteParam
	 *            CContextParam
	 * @todo Implement this src.Sel_Stampa.IElaborazioneStampa method
	 */
	@Override
	public void setParam(printInfo par, Hashtable myRichieste,
			HttpServletRequest myInputRequest, CContextParam myConteParam) {
		this.myParam = par;
		this.myRequest = myInputRequest;
		this.myTableRequest = myRichieste;
	}

	@Override
	public void setParam(printInfo par, Hashtable myRichieste, HttpServletRequest myInputRequest, CContextParam myConteParam,
			boolean appletParameters) {
		this.myParam = par;
		this.myRequest = myInputRequest;
		this.myTableRequest = myRichieste;
		
	}
}
