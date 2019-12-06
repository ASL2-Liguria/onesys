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
 * Servlet_GestCampiEngine.java
 *
 * Created on 4 settembre 2006, 11.37
 */

package src.Gestione_Campi;

/**
 *
 * @author  fabioc
 */

import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.classFrameHtmlObject;
import imago.http.classFramesetHtmlObject;
import imago.http.baseClass.baseUser;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.html.Html;

import core.Global;

/**
 * 
 * @author fabioc
 */
public class Servlet_GestCampiEngine {
	private baseUser LoggedUser;

	CLogError log = null;

	/** Creates a new instance of SL_Stampa_TabEngine */
	public Servlet_GestCampiEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest, CContextParam myConteParam) {

		LoggedUser = Global.getUser(myInputSession);
		try {

			log = new CLogError(LoggedUser.db.getWebConnection(), myInputRequest, "Serv_GestCampi_Ric", LoggedUser.login);
			log.setFileName("Serv_GestCampi_Ric");
			log.setClassName("src.Sel_Stampa.Serv_GestCampi_Ric");
		} catch (Exception ex) {
			// System.out.println(ex);
		}

	}

	public Html creaDocumentoHtml() {
		classFrameHtmlObject myFrame = null;
		classFramesetHtmlObject myFrameset = null;
		Html myHtml = null;
		// definisco frameset
		try {
			myFrameset = new classFramesetHtmlObject("9%,41%,41%,9%", "", "NO", "1");
			myFrameset.addAttribute("framespacing", "0");
			myFrameset.addAttribute("id", "Piano_lavoro_giornaliero");
		} catch (Exception ex) {
			// System.out.println(ex);
			log.writeLog("Problemi nel creare la pagina divisa in Frame ", CLogError.LOG_ERROR);
		}
		// primo frame per gestione messaggistica
		try {
			myFrame = new classFrameHtmlObject("GestCampi_ricerca", "Serv_GestCampi_Ric", "NO");
			myFrame.setNoResize(true);
			myFrameset.appendSome(myFrame);
		} catch (Exception ex) {
			// System.out.println(ex);
			log.writeLog("Problemi nel creare il primo Frame ", CLogError.LOG_ERROR);
		}
		// secondo frame per gestione integrazioni

		try {
			myFrame = new classFrameHtmlObject("GestCampi_Scheda", "Serv_GestCampi_Ope", "NO");
			myFrame.setNoResize(true);
			myFrame.addAttribute("scrolling", "auto");
			myFrameset.appendSome(myFrame);
		} catch (Exception ex) {
			// System.out.println(ex);
			log.writeLog("Problemi nel creare il secondo Frame ", CLogError.LOG_ERROR);
		}
		try {
			myFrame = new classFrameHtmlObject("GestCampi_Campo", "Serv_GestCampi_Campi", "NO");
			myFrame.setNoResize(true);
			myFrame.addAttribute("scrolling", "auto");
			myFrameset.appendSome(myFrame);
		} catch (Exception ex) {
			// System.out.println(ex);
			log.writeLog("Problemi nel creare il terzo Frame ", CLogError.LOG_ERROR);
		}
		try {
			myFrame = new classFrameHtmlObject("VisualPerm", "Serv_VisualPerm", "NO");
			myFrame.setNoResize(true);
			myFrame.addAttribute("scrolling", "auto");
			myFrameset.appendSome(myFrame);
		} catch (Exception ex) {
			// System.out.println(ex);
			log.writeLog("Problemi nel creare il terzo Frame ", CLogError.LOG_ERROR);
		}
		// *********
		myHtml = new Html();
		myHtml.addElement(myFrameset.toString());
		// scrivo documento su oggetto di output
		return myHtml;

	}

}
