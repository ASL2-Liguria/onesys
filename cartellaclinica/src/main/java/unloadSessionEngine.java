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
/*
 * unloadSessionEngine.java
 *
 * Created on 5 luglio 2006, 10.08
 */

import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.structErroreControllo;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import cartellaclinica.dwr.dwrTraceUserAction;

/**
 * 
 * @author aldo
 */
public class unloadSessionEngine {
	HttpSession mySession;

	ServletContext myContext;

	HttpServletRequest myRequest;

//	private basePC infoPC = null;

//	private baseUser logged_user = null;

	/** Creates a new instance of unloadSessionEngine */
	/** viene chiamata quando e' fatto il cambia login */
	public unloadSessionEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest) {

		String inputChangeLogin = "N";

		this.mySession = myInputSession;
		this.myContext = myInputContext;
		this.myRequest = myInputRequest;
		initMainObjects();
		try {
			inputChangeLogin = classStringUtil.checkNull(myRequest.getParameter("changeLogin"));
		} catch (java.lang.Exception ex) {
			inputChangeLogin = "N";
		}
		if (inputChangeLogin.equalsIgnoreCase("")) {
			inputChangeLogin = "N";
		}

		/*
		 * // rimuovi utente // dalla lista egli utenti connessi // sia dalla
		 * lista che dal db try{ myErrore =
		 * classUtenteLoggato.setLogoutEffettuato
		 * (this.logged_user.db.getWebConnection(), this.logged_user.login,
		 * this.mySession.getId()); } catch(Exception ex){ ex.printStackTrace();
		 * } // forzo cmq la chiusura delle connessioni try{ if
		 * (this.logged_user!=null){ if (this.logged_user.db!=null){
		 * this.logged_user.db.closeAllConnections(); } } } catch(Exception ex){
		 * ex.printStackTrace(); }
		 */
		
		/* Lasciamo fare a valueUnbound su Session.invalidate();
		try {
			if (this.logged_user != null) {
				this.logged_user.forcedValueUnbound(this.mySession);
			}
		} catch (Exception ex) {
			logToOutputConsole.writeLogToSystemOutput(this, "Errore forcing unbound");
		}
		*/

		//
		// invalida la session
		// if (inputChangeLogin.equalsIgnoreCase("S")){
		// invalido la sessione SOLO se
		// non e' dovuta ad un cambio login
		invalidSession();
		// }
	}

	public String getHtml() {
		return "<HTML><HEAD></HEAD><BODY><SCRIPT>self.close();</SCRIPT></BODY></HTML>";
	}

	private void initMainObjects() {
		new structErroreControllo();

		try {
//			this.logged_user = Global.getUser(mySession);

			/*
			 * String funzione = (( baseUser ) mySession.getAttribute ( "login"
			 * )).modalita_accesso; if (funzione.equalsIgnoreCase("")){ funzione
			 * ="LOGIN"; }
			 */

			String funzione = "LOGIN";
			// vado a 'chiudere' la riga su TRACE_USER_ACTION
			dwrTraceUserAction saveAction = new dwrTraceUserAction(this.mySession);
			String id = "";
			saveAction.closeTraceUserAction(funzione, id);

			/*
			 * classTypeUserAction myAction = new classTypeUserAction("LOGOUT");
			 * classTraceUserAction.saveAction(myAction, this.mySession,
			 * this.myRequest);
			 */
			// ********************************************
			// cancellazione dei lock dell'utente
/*			try {
				classRsUtil.unLockRecordForUser(this.logged_user.db.getDataConnection(), this.logged_user);
			} catch (java.lang.Exception ex) {
			}*/
			// **********************************************

//			this.infoPC = (basePC) mySession.getAttribute("parametri_pc");

		} catch (Exception ex) {
			System.out.println(ex);
		}
	}

	private void invalidSession() {

		// chiude tutti gli oggetti di session
		// invalida la sessione
		try {
			this.mySession.invalidate();

		} catch (java.lang.Exception ex) {
			ex.printStackTrace();
		}

	}
}
