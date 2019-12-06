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
package stampe.anteprima;

import imago.a_util.CContextParam;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseSessionAndContext;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imagoAldoUtil.ImagoUtilException;

import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Iterator;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import core.Global;

/**
 * @author linob
 * @date 2015-03-13
 */
public class elabStampaEngineUrl {
	/**
     *
     */
	HttpSession mySession;
	ServletContext myContext;
	HttpServletRequest myRequest;
	String requestIden = "", funzioChiamata = "", chiaSorgernte = "",
			requestAnteprima = "";

	CContextParam myContextParam = null;
	private baseGlobal infoGlobali = null;
	private basePC infoPC = null;
	private baseWrapperInfo myBaseInfo = null;
	private baseUser logged_user = null;
	private Hashtable tabellaRichieste = null;
	private Hashtable<String, Hashtable> hashtabellaRichieste = null;
	private ElcoLoggerInterface logger = null;
	private String pdfUrl = null;
	private JSONArray jsonArroutput = null;

	public JSONArray getJsonArroutput() {
		return jsonArroutput;
	}

	public void setJsonArroutput(JSONObject jsonoutput) {
		this.jsonArroutput.put(jsonoutput);
	}

	private String reportLocation = null;

	/**
	 * costruttore della classe
	 *
	 * @param myInputSession
	 *            HttpSession sessione chiamante
	 * @param myInputContext
	 *            ServletContext
	 * @param myInputRequest
	 *            HttpServletRequest
	 * @param jsoninput
	 */

	public elabStampaEngineUrl(HttpSession myInputSession,
			ServletContext myInputContext, HttpServletRequest myInputRequest,
			CContextParam myConteParam, JSONArray jsonarrayinput) {

		// inizializzazione engine della worklist
		super();
		try {
			mySession = myInputSession;
			myContext = myInputContext;
			this.infoGlobali = baseRetrieveBaseGlobal.getBaseGlobal(myContext,
					mySession);
			myRequest = myInputRequest;
			myContextParam = myConteParam;
			logged_user = Global.getUser(mySession);
			logger = new ElcoLoggerImpl(this.getClass().getSimpleName());
			hashtabellaRichieste = getObjectFromJson(jsonarrayinput);
			logger.info("Costruttore elabStampaEngineUrl finito");
			this.jsonArroutput = new JSONArray();
		} catch (Exception ex) {
			logger.error("Sessione o request non pervenuti all'Engine"
					+ ex.getMessage());
		}
	}

	public void elaborazione() throws Exception { // ImagoStampeException{
		logger.info("Costruttore elabStampaEngineUrl finito");
		JSONObject joutput = null;
		processPrintInfo myProcessInfo = null;
		printInfo FamyPrintInfo = null;
		String nome = "";
		IElaborazioneStampa myInterface = null;
		baseSessionAndContext myBaseHttpInfo = null;

		logged_user = Global.getUser(mySession);
		infoPC = (basePC) mySession.getAttribute("parametri_pc");
		myBaseInfo = new baseWrapperInfo(this.logged_user, this.infoGlobali,
				this.infoPC);
		myBaseHttpInfo = new baseSessionAndContext(myContext, mySession);

		logger.info("Inizio Elaborazione");

		Enumeration<String> enumKey = hashtabellaRichieste.keys();
		while (enumKey.hasMoreElements()) {
			joutput = new JSONObject();
			String key = enumKey.nextElement();

			tabellaRichieste = hashtabellaRichieste.get(key);

			chiaSorgernte = (String) tabellaRichieste.get("stampaSorgente");
			funzioChiamata = (String) tabellaRichieste
					.get("stampaFunzioneStampa");

			myProcessInfo = new processPrintInfo("", "", tabellaRichieste,
					myBaseInfo, myBaseHttpInfo, myRequest);
			try {

				FamyPrintInfo = myProcessInfo.getPrintInfo();

			} catch (ImagoUtilException ex) {

				logger.error("Nella Tebella configura Stampe non esiste una PROCESSCLASS che abbia FUNZIONE_CHIAMANTE="
						+ funzioChiamata
						+ "e CDC="
						+ (String) tabellaRichieste.get("stampaReparto")
						+ ex.getMessage());
			}

			// richiama dalla tabella imagoweb.configurastampe tramite la
			// funzione
			// chiamante
			// la classe specifica da utilizzare per rendere il report
			try {
				nome = FamyPrintInfo.getProcessClass();
				logger.info("ProcessClass Name: " + nome);
				Class myObjDefault = Class.forName(nome);
				myInterface = (IElaborazioneStampa) myObjDefault.newInstance();
				myInterface.setParam(FamyPrintInfo, tabellaRichieste,
						myRequest, myContextParam,true);
				myInterface.Elaborazione();
				logger.info("ProcessClass fine Elaborazione");
				
				logger.info("Setto la url" + myInterface.getUrlPdf());
				joutput.put("url", myInterface.getUrlPdf());

				logger.info("Setto la stampante" + myInterface.getUrlPdf());
				joutput.put("stampante",
						tabellaRichieste.get("stampaStampante"));
				
				logger.info("Setto la configurazione" + myInterface.getUrlPdf());
				joutput.put("opzioni",
						tabellaRichieste.get("stampaOpzioni") == null ? ""
								: tabellaRichieste.get("stampaOpzioni"));

			}

			catch (Exception ex) {
				logger.error(ex);
				pdfUrl = "";
				joutput.put("error", "Errore"+ex.getLocalizedMessage());
			}
			setJsonArroutput(joutput);

		}



	}

	public static Hashtable getObjectForm(HttpServletRequest myRequest) {
		int i = 0;
		Enumeration paramNames = null;
		Hashtable myHash = null;
		// log.writeInfo("Inizializzazione dei Parametri di Stampa");
		i = myRequest.getParameterMap().size();
		if (i > 0) {
			paramNames = myRequest.getParameterNames();
			myHash = new Hashtable();
			while (paramNames.hasMoreElements()) {
				String parm = (String) paramNames.nextElement();
				myHash.put(parm, myRequest.getParameter(parm));
			}
		}
		return myHash;
	}

	public Hashtable<String, Hashtable> getObjectFromJson(JSONArray json) {
		Hashtable<String, Hashtable> hashMyHash = new Hashtable<String, Hashtable>();
		Hashtable<String, String> myHash = null;
		JSONObject jsonInterno = new JSONObject();
		Iterator it = null;
		for (int i = 0; i < json.length(); i++) {
			myHash = new Hashtable<String, String>();
			try {
				jsonInterno = json.getJSONObject(i);
			} catch (JSONException e1) {
				// TODO Auto-generated catch block
				logger.error(e1.getLocalizedMessage());
			}
			it = jsonInterno.keys();
			while (it.hasNext()) {
				String keyInterno = (String) it.next();
				try {
					myHash.put(keyInterno, jsonInterno.getString(keyInterno));
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					logger.error(e.getMessage());
				}
			}
			hashMyHash.put(Integer.toString(i), myHash);

		}

		return hashMyHash;
	}

}
