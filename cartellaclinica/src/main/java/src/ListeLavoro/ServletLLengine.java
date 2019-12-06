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
 * ServletLLengine.java
 *
 * Created on 8 agosto 2006, 16.38
 */

package src.ListeLavoro;

import imago.a_sql.CLogError;
import imago.http.classFrameHtmlObject;
import imago.http.classFramesetHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.baseClass.baseUser;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Html;
import org.apache.ecs.html.Title;

import core.Global;
/**
 * 
 * @author fabioc
 */
public class ServletLLengine {
	private HttpSession mySession;

	private HttpServletRequest myRequest;

	private baseUser logged_user = null;

	private CLogError ServLLLog = null;

	/** Creates a new instance of ServletLLengine */
	public ServletLLengine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest) {
		try {
			mySession = myInputSession;
			myRequest = myInputRequest;

			// creaDocumentoHtml();
		} catch (Exception ex) {

		}

	}

	public org.apache.ecs.Document creaDocumentoHtml() {
		Document doc = null;

		doc = new Document();
		doc.setDoctype(new Doctype.Html401Transitional());

		try {
			initMainObjects();
			doc.setTitle(creaTitoloHtml());
			// attacco Head al documento
			doc.setHead(creaHeadHtml());
			doc.setHtml(creaHtml());
		} catch (Exception ex) {
		}

		return doc;

	}

	public imago.http.classHeadHtmlObject creaHeadHtml() {
		classHeadHtmlObject testata = null;

		testata = new classHeadHtmlObject();
		testata.addJSLink("std/jscript/src/Sel_Stampa/elabStampa.js");
		testata.addJSLink("std/jscript/src/ListeLavoro/SelDeselAll.js");
		return testata;
	}

	public org.apache.ecs.html.Title creaTitoloHtml() {
		// Definisco Title del documento
		Title titolo = null;
		try {
			// titolo= new Title("Polaris ");
			// titolo.addAttribute("id", "htmlTitolo");

		} catch (Exception ex) {

		}
		return titolo;
	}

	private Html creaHtml() {

		classFrameHtmlObject myFrame = null;
		classFramesetHtmlObject myFrameset = null;
		Html myHtml = null;
		// definisco frameset
		try {
			myFrameset = new classFramesetHtmlObject("400,*", "", "NO", "0");
			myFrameset.addAttribute("framespacing", "0");
			myFrameset.addAttribute("id", "oFramesetLL");

		} catch (Exception ex) {
			// System.out.println(ex);
			ServLLLog.writeLog("Problemi nel creare la pagina divisa in Frame ", CLogError.LOG_ERROR);
		}
		// primo frame per gestione messaggistica
		try {
			myFrame = new classFrameHtmlObject("LLFiltriFrame", "ServletLLFiltri", "NO");
			myFrame.setNoResize(true);
			myFrameset.appendSome(myFrame);

		} catch (Exception ex) {
			// System.out.println(ex);
			ServLLLog.writeLog("Problemi nel creare il primo Frame ", CLogError.LOG_ERROR);
		}
		// secondo frame per gestione integrazioni
		try {
			myFrame = new classFrameHtmlObject("LLelabStampe", "blank", "NO");
			myFrame.setNoResize(true);
			myFrame.addAttribute("scrolling", "auto");
			myFrameset.appendSome(myFrame);
		} catch (Exception ex) {
			// System.out.println(ex);
			ServLLLog.writeLog("Problemi nel creare il secondo Frame ", CLogError.LOG_ERROR);
		}
		// *********
		myHtml = new Html();
		myHtml.addElement(myFrameset.toString());
		// scrivo documento su oggetto di output
		return myHtml;

	}

	private void initMainObjects() {
		this.logged_user = Global.getUser(mySession);
		try {
			this.ServLLLog = new CLogError(logged_user.db.getWebConnection(), myRequest, "SERVLETLL", logged_user.login);
			ServLLLog.setFileName("ServletLL");
			ServLLLog.setClassName("src.ListeLavoro.ServletLL");
		} catch (Exception e) {
		}
	}

}
