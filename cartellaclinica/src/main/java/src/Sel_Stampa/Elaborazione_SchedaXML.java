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
 * <p>
 * Title:
 * </p>
 *
 * <p>
 * Description:
 * </p>
 *
 * <p>
 * Copyright:
 * </p>
 *
 * <p>
 * Company:
 * </p>
 *
 * @author Francesco
 * @version 1.0
 */
public class Elaborazione_SchedaXML implements IElaborazioneStampa {
	private printInfo myParam = null;
	private String strUrlServletPdf = "";
	private HttpServletRequest myRequest = null;
	private ElcoLoggerInterface logger = null;
	private Hashtable<String, String> myHashParameters = null;

	public Elaborazione_SchedaXML() {
		logger = new ElcoLoggerImpl(this.getClass().getSimpleName());
	}

	/**
	 * Elaborazione
	 *
	 * @todo Implement this src.Sel_Stampa.IElaborazioneStampa method
	 */
	@Override
	public void Elaborazione() {

		/* Originale */
		String sf = "";
		String key = "";
		String val = "";
		Hashtable<String, String> HashPromt = null;
		Enumeration e = null;
		logger.info("Inizio composizione url");
		try {

			strUrlServletPdf = myParam.getUrlImago();
			logger.info("strUrlServletPdf: " + strUrlServletPdf);
			strUrlServletPdf = strUrlServletPdf + "ServletStampe" + "?report="
					+ myParam.getReportName();
			logger.info("strUrlServletPdf: " + strUrlServletPdf);
			sf = myRequest.getParameter("stampaSelection");
			if (sf != null && !sf.equals("")) {
				sf = URLEncoder.encode(sf, "UTF-8");
				strUrlServletPdf = strUrlServletPdf + "&" + "sf=" + sf;
			}
			logger.info("strUrlServletPdf: " + strUrlServletPdf);
			// strUrlServletPdf += "&requestAnteprima=S";
			HashPromt = new Hashtable<String, String>();
			e = myRequest.getParameterNames();

			while (e.hasMoreElements()) {
				key = (String) e.nextElement();
				val = myRequest.getParameter(key);

				if (key.length() > 5 && key.substring(0, 6).equals("prompt")) {
					HashPromt.put(key, val);
				}
			}
			
			e = HashPromt.keys();
			while (e.hasMoreElements()) {
				key = (String) e.nextElement();
				val = HashPromt.get(key);

				strUrlServletPdf = strUrlServletPdf + "&" + key + "=" + val;
			}
			if (myHashParameters!=null && !myHashParameters.isEmpty()){
				try {
					// Forzo il catch dell'eccezione nullpointer se non esiste il
					// parametro stampaPrompt,in questo modo, separo la stampa da
					// applet da quella con activex per la gestione della selection
					// formula che in un caso è passata tramite request(activex)
					// mentre nel caso applet viene passata tramite json
					JSONArray jsonPrompt = new JSONArray(
							myHashParameters.get("stampaPrompt"));
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
										+ keyInterno + "="
										+ jsonInterno.getString(keyInterno);
							} catch (JSONException e1) {
								// TODO Auto-generated catch block
								logger.error(e1.getMessage());
							}
						}
					}
				} catch (NullPointerException exnull) {
					e = myHashParameters.keys();
					while (e.hasMoreElements()) {
						key = (String) e.nextElement();
						val = myHashParameters.get(key);

						if (key.length() > 5
								&& key.substring(0, 6).equals("prompt")) {
							strUrlServletPdf += "&" + key
									+ "=" + val;
						}
					}
				}
				logger.info(strUrlServletPdf);
			}
			
			logger.info(strUrlServletPdf);
		} catch (UnsupportedEncodingException e1) {
			logger.error(e1);
		} catch (Exception e1) {
			logger.error(e1);
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
		myParam = par;
		this.myRequest = myInputRequest;
	}

	@Override
	public void setParam(printInfo par, Hashtable myRichieste,
			HttpServletRequest myInputRequest, CContextParam myConteParam,boolean appletParameters) {
		myParam = par;
		this.myRequest = myInputRequest;
		if (appletParameters){
			this.myHashParameters = myRichieste;	
		}
		
	}
}
