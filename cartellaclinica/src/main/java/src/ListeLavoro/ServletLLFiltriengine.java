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
 * SevletLLengine.java
 *
 * Created on 31 luglio 2006, 11.16
 */

package src.ListeLavoro;

import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.ImagoHttpException;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;
/**
 * src.ListeLavoro.ServletLLFiltriengine
 * 
 * @author fabioc
 */
public class ServletLLFiltriengine {
	private baseUser LoggedUser;

	private HttpServletRequest MYrequest;

	private ServletContext myContext;

	private CContextParam myContextParam = null;

	CLogError log = null;

	/** Creates a new instance of SevletLLengine */
	public ServletLLFiltriengine(HttpServletRequest request, HttpSession Sessione, ServletContext Contesto, CContextParam ContextParam) {
		LoggedUser = Global.getUser(Sessione);
		MYrequest = request;
		myContext = Contesto;
		myContextParam = ContextParam;
		try {

			log = new CLogError(LoggedUser.db.getWebConnection(), request, "SERVLETreadFromDB", LoggedUser.login);
			log.setFileName("ServletLLFiltri");
			log.setClassName("src.Sel_Stampa.ServletLLFiltri");
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
			jsLabel = label_js.getArrayLabel("ServletLL", LoggedUser);
		} catch (ImagoHttpException e) {
			log.writeLog("Problemi nel trovare nella tabella delle lingue i client esatti ", CLogError.LOG_ERROR);
		}
		doc.appendHead(jsLabel);

		doc.setBody(creaBody());
		return doc;

	}

	public Body creaBody() {
		Body testo = new Body();
		// testo.setOnLoad("tutto_schermo();fillLabels(arrayLabelName,arrayLabelValue);");

		testo.addAttribute("onLoad", "fillLabels(arrayLabelName,arrayLabelValue);");

		// tutto_schermo();
		testo.addElement(addTopJScode());
		classFormHtmlObject form = new classFormHtmlObject("formLL", "ServletLLFiltri", "POST");
		classFormHtmlObject formNascostaStampa = new classFormHtmlObject("formNascostaStampa", "elabStampa", "POST", "LLelabStampe");
		GestioneCDC CDC = new GestioneCDC(LoggedUser, MYrequest, myContextParam);
		CDC.creaCDC(form);
		GestioneSale mySale = new GestioneSale(LoggedUser, MYrequest, myContextParam);
		mySale.creaSale(form, CDC.stringaCDC(), CDC.getnumeroCDC());
		GestioneStato Stato = new GestioneStato(LoggedUser, MYrequest, myContextParam);
		Stato.creaStato(form);
		GestioneFiltri myFiltri = new GestioneFiltri(LoggedUser, MYrequest, myContextParam);
		myFiltri.creaFiltri(form, testo, CDC.getnumeroCDC(), mySale.getnumeroAre());
		GestioneData mydata = new GestioneData(LoggedUser, MYrequest, myContextParam);
		mydata.creaData(form, testo);
		GestioneProvenienza myProv = new GestioneProvenienza(LoggedUser, MYrequest, myContextParam);
		myProv.creaProv(form, myFiltri.getStringFiltriSel(), CDC.stringaCDC());
		GestioneSuddivisione mySudd = new GestioneSuddivisione(LoggedUser, MYrequest, myContextParam);
		mySudd.creaSudd(form);
		FormNascosta myFormNasc = new FormNascosta();
		myFormNasc.CreaFormNascosta(formNascostaStampa);
		testo.addElement(formNascostaStampa.toString());
		PulsanteStampa myPuls = new PulsanteStampa(LoggedUser, MYrequest);
		myPuls.creaPuls(form);
		classInputHtmlObject open_close = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "openclose", "true", "");
		open_close.addAttribute("id", "openclose");
		form.appendSome(open_close);

		testo.addElement(form.toString());
		testo.addElement("<SCRIPT>\n");
		testo.addElement("controllo=false;frameiniziali();");
		testo.addElement("</SCRIPT>\n");
		testo.addElement("<script>jQuery('#txtDaData').datepick({showOnFocus: false, showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'});</script>");
		testo.addElement("<script>jQuery('#txtAData').datepick({showOnFocus: false, showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'});</script>");
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
			 * testata.addJSLink("std/jscript/src/ListeLavoro/SelDeselAll.js");
			 * testata.addJSLink("std/jscript/src/MedNuc.js");
			 * testata.addCssLink("std/css/button.css");
			 * testata.addCssLink("std/css/dataEntryTable.css");
			 * testata.addCssLink("std/css/normalBody.css");
			 * testata.addJSLink("std/jscript/ShowHideLayer.js");
			 * testata.addJSLink("std/jscript/optionJsUtil.js");
			 * testata.addJSLink("std/jscript/Calendar/calendar.js");
			 * testata.addCssLink("std/css/headerTable.css");
			 * testata.addCssLink("std/css/dataTable.css");
			 * testata.addCssLink("std/css/dataEntryTable.css");
			 * testata.addCssLink("std/css/filterTable.css");
			 * //testata.addJSLink("std/jscript/src/Sel_Stampa/elabStampa.js");
			 */
			// testata.addJscode(myJS.getArrayLabel("ServletLLFiltri",LoggedUser));

			/* Gestione del calendario */
			testata.addElement(classTabExtFiles.getIncludeString(logged_user, "", this.getClass().getName(), this.myContext));
			// testata.addJscode(CCalendarWin.getScriptForCalendar("","test"));

		} catch (Exception ex) {
			// System.out.println(ex);
			log.writeLog("Problemi nel creare la testata della pagina Html ", CLogError.LOG_ERROR);
		}
		return testata;
	}

	public String addTopJScode() {
		// setta le variabili nell'HTML che mi serviranno per creare l'activeX

		StringBuffer sb = new StringBuffer();
		sb.append(classJsObject.javaClass2jsClass((Object) this.LoggedUser));
		sb.append("<SCRIPT>\n");
		sb.append("var controllo=true;\n");
		sb.append("</SCRIPT>\n");
		return sb.toString();
	}

}
