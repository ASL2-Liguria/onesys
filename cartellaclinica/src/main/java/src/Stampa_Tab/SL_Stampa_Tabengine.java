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

package src.Stampa_Tab;
import imago.a_sql.CLogError;
import imago.http.classFrameHtmlObject;
import imago.http.classFramesetHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.baseClass.baseUser;
import imagoUtils.classJsObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Html;
import org.apache.ecs.html.Title;

import core.Global;

/**
 * 
 * @author fabioc
 */
public class SL_Stampa_Tabengine {
	private HttpSession mySession;

	private HttpServletRequest myRequest;

	CLogError log = null;

	private baseUser logged_user = null;

	/** Creates a new instance of ServletLLengine */
	public SL_Stampa_Tabengine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest) {
		try {
			mySession = myInputSession;
			myRequest = myInputRequest;

			// creaDocumentoHtml();
		} catch (Exception ex) {
			log.writeLog("Errore nell' inizializzazione della pagina", CLogError.LOG_ERROR);
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
			doc.appendHead(addTopJScode());
			doc.setHtml(creaHtml());
			doc.setBody(creaBody());
		} catch (Exception ex) {
			log.writeLog("Errore nella creazione della pagina", CLogError.LOG_ERROR);
		}

		return doc;

	}

	public Body creaBody() {
		Body testo = new Body();

		classJsObject.setNullContextMenuEvent(testo, this.logged_user);
		return testo;
	}

	public imago.http.classHeadHtmlObject creaHeadHtml() {
		classHeadHtmlObject testata = null;

		testata = new classHeadHtmlObject();
		testata.addJSLink("std/jscript/src/Sel_Stampa/elabStampa.js");
		testata.addJSLink("std/jscript/src/Stampa_Tab/SL_Stampa_Tab.js");
		return testata;
	}

	public org.apache.ecs.html.Title creaTitoloHtml() {
		// Definisco Title del documento
		Title titolo = new Title();
		titolo.addAttribute("id", "htmlTitolo");
		return titolo;
	}

	public String addTopJScode() {
		StringBuffer sb = new StringBuffer();

		sb.append(classJsObject.javaClass2jsClass((Object) this.logged_user));

		return sb.toString();
	}

	private Html creaHtml() {

		classFrameHtmlObject myFrame = null;
		classFramesetHtmlObject myFrameset = null;
		Html myHtml = null;
		// definisco frameset
		myFrameset = new classFramesetHtmlObject("360,*", "", "NO", "0");
		myFrameset.addAttribute("framespacing", "0");
		myFrameset.addAttribute("id", "oFramesetStampaTab");
		// primo frame per gestione messaggistica

		myFrame = new classFrameHtmlObject("StampaTabFiltriFrame", "SL_Stampa_Tab_filtri", "NO");

		myFrame.setNoResize(true);
		myFrameset.appendSome(myFrame);
		// secondo frame per gestione integrazioni
		myFrame = new classFrameHtmlObject("Stampa_Tab_elabStampe", "blank", "NO");
		myFrame.setNoResize(true);
		myFrame.addAttribute("scrolling", "auto");
		myFrameset.appendSome(myFrame);
		// *********
		myHtml = new Html();
		myHtml.addElement(myFrameset.toString());
		// scrivo documento su oggetto di output
		return myHtml;

	}

	private void initMainObjects() {
		this.logged_user = Global.getUser(mySession);
		try {
			this.log = new CLogError(logged_user.db.getWebConnection(), myRequest, "SERVLETLL", logged_user.login);
			log.setFileName("ServletLL");
			log.setClassName("src.ListeLavoro.ServletLL");
		} catch (Exception e) {
		}
	}

}
