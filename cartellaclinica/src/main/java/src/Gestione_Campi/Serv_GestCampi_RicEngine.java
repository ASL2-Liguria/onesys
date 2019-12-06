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
 * Serv_GestCampi_RicEngine.java
 *
 * Created on 4 settembre 2006, 16.32
 */

package src.Gestione_Campi;

import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.ImagoHttpException;
import imago.http.classDivButton;
import imago.http.classHeadHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.baseUser;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.html.functionHTML;

import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;

/**
 * 
 * @author fabioc src.Gestione_Campi.Serv_GestCampi_RicEngine
 */
public class Serv_GestCampi_RicEngine {
	private baseUser LoggedUser;

	private HttpServletRequest MYrequest;

	CLogError log = null;

	private ServletContext myContext = null;

	/** Creates a new instance of SevletLLengine */
	public Serv_GestCampi_RicEngine(HttpServletRequest request, HttpSession Sessione, ServletContext Contesto, CContextParam ContextParam) {
		LoggedUser = Global.getUser(Sessione);
		MYrequest = request;
		myContext = Contesto;
		try {

			log = new CLogError(LoggedUser.db.getWebConnection(), request, "Serv_GestCampi_Ric", LoggedUser.login);
			log.setFileName("Serv_GestCampi_RicEngine");
			log.setClassName("src.Sel_Stampa.Serv_GestCampi_RicEngine");
		} catch (Exception ex) {
			// System.out.println(ex);
		}
	}

	public org.apache.ecs.Document creaDocumentoHtml() {
		Document doc = null;

		doc = new Document();

		doc.setHead(addHead(LoggedUser));

		classJsObject label_js = new classJsObject();
		String jsLabel = null;
		try {
			jsLabel = label_js.getArrayLabel("ServletGestCampi", LoggedUser);
		} catch (ImagoHttpException e) {
			log.writeLog("Problemi nel trovare nella tabella delle lingue i client esatti ", CLogError.LOG_ERROR);
		}
		doc.appendHead(jsLabel);
		try {
			doc.setBody(creaBody());
		} catch (Exception e) {
			log.writeLog("Errore nella creazione del body " + e.getMessage(), CLogError.LOG_ERROR);
		}
		return doc;

	}

	public Body creaBody() {
		Body testo = new Body();
		functionHTML fHtml = new functionHTML();
		fHtml.init_table();

		functionDB fDB = null;
		new ArrayList();
		new ArrayList();
		String InnerUtente = "";
		fDB = new functionDB(myContext, MYrequest);
		testo.addAttribute("onLoad", "fillLabels(arrayLabelName,arrayLabelValue);");
		classLabelHtmlObject label_Ricerca = new classLabelHtmlObject("", "", "ricerca_tit");
		classTabHeaderFooter header = new classTabHeaderFooter(label_Ricerca);
		classTabHeaderFooter footer = new classTabHeaderFooter(" ");
		footer.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
		classDivButton button_ricerca = new classDivButton("", "pulsante", "javascript:applicaRicercaOpe();", "ricerca_but", "");
		footer.addColumn("classButtonHeader", button_ricerca.toString());
		fDB.setArrayDatiWeb("WEB", "WEBUSER", "WEBUSER", "", "", "S", "S");

		/*
		 * fHtml.creaColonnaDescrMiddle("","ricercaSche");
		 * fHtml.creaColonnaField("ricScheda"); fHtml.aggiungiRiga();
		 * fHtml.creaColonnaDescrMiddle("","ricercaScheDesc");
		 * fHtml.creaColonnaField("ricSchedaDesc"); fHtml.aggiungiRiga();
		 */
		fHtml.creaColonnaDescrMiddle("", "utente");
		fHtml.creaColonnaCombo("user", fDB.getArrayDati(), fDB.getArrayCodici(), InnerUtente, "S", "onchange", "javascript:applicaRicercaOpe()");
		fHtml.aggiungiRiga();
		fHtml.getTable();

		testo.addElement(header.toString());
		testo.addElement(fHtml.getTable().toString());
		testo.addElement(footer.toString());

		classJsObject.setNullContextMenuEvent(testo, this.LoggedUser);

		return testo;
	}

	public classHeadHtmlObject addHead(baseUser logged_user) {
		classHeadHtmlObject testata = null;
		testata = new classHeadHtmlObject();
		new classJsObject();
		try {
			/*
			 * testata.addJSLink("std/jscript/tutto_schermo.js");
			 * testata.addCssLink("std/css/textArea.css");
			 * testata.addJSLink("std/jscript/fillLabels.js");
			 * testata.addCssLink("std/css/button.css");
			 * testata.addCssLink("std/css/dataEntryTable.css");
			 * testata.addCssLink("std/css/normalBody.css");
			 * testata.addJSLink("std/jscript/ShowHideLayer.js");
			 * testata.addJSLink("sdt/jscript/optionJsUtil.js");
			 * testata.addCssLink("std/css/headerTable.css");
			 * testata.addCssLink("std/css/dataTable.css");
			 * testata.addCssLink("std/css/dataEntryTable.css");
			 * testata.addJSLink
			 * ("std/jscript/src/Gest_Campi/Gestione_ricerca.js");
			 */
			testata.addElement(classTabExtFiles.getIncludeString(this.LoggedUser, "", this.getClass().getName(), this.myContext));
			// "std/jscript/src/Gest_Campi/Gestione_campi.js*";

			// testata.addJSLink("std/jscript/src/Sel_Stampa/elabStampa.js");
			// testata.addJscode(myJS.getArrayLabel("Servlet_GestCampi",LoggedUser));

			/* Gestione del calendario */
			// testata.addCssLink("std/css/ImageX.css");
			// testata.addJscode(CCalendarWin.getScriptForCalendar("",""));

		} catch (Exception ex) {
			// System.out.println(ex);
			log.writeLog("Problemi nel creare la testata della pagina Html ", CLogError.LOG_ERROR);
		}
		return testata;
	}

}
