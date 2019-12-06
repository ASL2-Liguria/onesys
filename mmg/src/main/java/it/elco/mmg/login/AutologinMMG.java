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
package it.elco.mmg.login;

import it.elco.auth.login.LoginAbstract;
import it.elco.caronte.call.impl.iCallProcedureFunction;
import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.listener.ElcoContextInfo;
import it.elco.util.Cryptography.CryptographyManager;

import javax.security.auth.login.LoginException;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Classe per l'autologin su fenixMMG Modificata l'11/06/2014 per prendere anche
 * l'hostname del pc che fa l'autologin
 *
 * @author lucas
 *
 */
public class AutologinMMG extends LoginAbstract {

	String nomeHost;

	public AutologinMMG(ServletContext cont, HttpServletRequest req, HttpServletResponse resp, ServletConfig conf, String sito, String versione) {
		super(cont, req, resp, conf, sito, versione);
		this.nomeHost = req.getParameter("nomeHost");
	}

	@SuppressWarnings("unchecked")
	@Override
	public void executeLogin(String user, String psw, String session_id) throws LoginException {
		logger.debug("Verifica autologin in corso [user: " + user + "]");

		this.checkNull(user);

		String result = "KO";

		try {
			iCallProcedureFunction callProcedure = CaronteFactory.getFactory().createCallProcedure("MMG_DATI");
			callProcedure.setSqlInParameter("p_utente", user);
			callProcedure.setSqlInParameter("p_pc", nomeHost);
			callProcedure.setSqlInParameter("p_session_id", session_id);
			callProcedure.setSqlOutParameter("p_result");
			result = (String) callProcedure.execute(ElcoContextInfo.getSystemParameter("login.storedProcedureAutoLogin", this.sito, this.versione));
		} catch (Exception e) {
			throw new LoginException("KO$Errore durante richiesta login.");
		}

		if (!(result.startsWith("OK"))) {
			throw new LoginException(result);
		}

		logger.debug("Login effettuato [user: " + user + ", psw: " + psw + "]");
	}

	@Override
	public void checkLogin(String user, String psw) throws LoginException {
		//To change body of implemented methods use File | Settings | File Templates.
		logger.debug("Verifica autologin in corso [user: " + user + "]");

		this.checkNull(user);

		String result = "KO";

		try {
			iCallProcedureFunction callProcedure = CaronteFactory.getFactory().createCallProcedure("CONFIG_WEB");
			callProcedure.setSqlInParameter("p_utente", user);
			callProcedure.setSqlInParameter("p_pwd", CryptographyManager.encrypt(config.getServletContext(), psw));
			callProcedure.setSqlInParameter("p_sito", this.sito);
			callProcedure.setSqlInParameter("p_versione", this.versione);
			callProcedure.setSqlOutParameter("p_result");
			result = (String) callProcedure.execute(ElcoContextInfo.getSystemParameter("login.checkAutoLoginProcedure", this.sito, this.versione));
		} catch (Exception e) {
			throw new LoginException("KO$Errore durante richiesta login.");
		}

		if (!(result.startsWith("OK"))) {
			throw new LoginException(result);
		}

		logger.debug("Login effettuato [user: " + user + ", psw: " + psw + "]");
	}

	private void checkNull(String user) throws LoginException {
		if (user.equals("")) {
			logger.debug("Accesso negato, manca username.");

			throw new LoginException("KO$Inserire username.");
		}
	}
}
