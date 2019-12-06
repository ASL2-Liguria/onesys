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
 * Serv_VisualPermEngine.java
 *
 * Created on 8 settembre 2006, 17.15
 */

package src.Gestione_Campi;

import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.ImagoHttpException;
import imago.http.classDivButton;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;
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
 * @author fabioc
 */
public class Serv_VisualPermEngine {
	private HttpServletRequest myRequest = null;

	private baseUser logged_user = null;

	private CLogError log = null;

	private ServletContext myContext = null;

	private String InnerCampo, InnerScheda, InnerUtente, InnerUtenteWcampo;

	/** Creates a new instance of Serv_VisualPermEngine */
	public Serv_VisualPermEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest, CContextParam myConteParam) {
		myContext = myInputContext;
		myRequest = myInputRequest;
		logged_user = Global.getUser(myRequest.getSession());
		try {
			this.log = new CLogError(logged_user.db.getWebConnection(), myRequest, "Serv_GestCampi_Campi", logged_user.login);
			log.setFileName("Serv_GestCampi_Ope");
			log.setClassName("src.Gestione_Campi.Serv_GestCampi_Ope");
		} catch (Exception ex) {
			// System.out.println(ex);
		}

	}

	public org.apache.ecs.Document creaDocumentoHtml() {

		Document doc = null;

		doc = new Document();

		doc.setHead(addHead(logged_user));

		doc.setBody(creaBody());
		return doc;

	}

	public Body creaBody() {
		Body testo = new Body();
		CVW_Gest_Rel_Data risultato_sel = null;
		functionHTML fHtml = new functionHTML();
		classFormHtmlObject form = new classFormHtmlObject("formVisual", "Serv_VisualPerm", "POST");
		fHtml.init_table();
		InnerUtente = logged_user.login;
		String Stato = "0";
		leggiDatiInput(myRequest);

		new ArrayList();
		new ArrayList();
		classJsObject label_js = new classJsObject();
		String jsLabel = null;

		try {
			jsLabel = label_js.getArrayLabel("ServletVisualPerm", logged_user);
		} catch (ImagoHttpException e) {
			log.writeLog("Problemi nel trovare nella tabella delle lingue i client esatti ", CLogError.LOG_ERROR);
		}
		form.appendSome(jsLabel);

		classLabelHtmlObject label_Ricerca = new classLabelHtmlObject("", "", "visual_Tit");
		classTabHeaderFooter header = new classTabHeaderFooter(label_Ricerca.toString());
		classTabHeaderFooter footer = new classTabHeaderFooter(" ");
		footer.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");

		classDivButton button_mod = new classDivButton("", "pulsante", "javascript:modPerm();", "modPerm_buttom", "");
		footer.addColumn("classButtonHeader", button_mod.toString());
		classDivButton button_canc = new classDivButton("", "pulsante", "javascript:cancPerm();", "cancPerm_buttom", "");
		footer.addColumn("classButtonHeader", button_canc.toString());

		classInputHtmlObject Hutente_worklist_campo = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "Hutente_worklist_campo", "", "");
		form.appendSome(Hutente_worklist_campo.toString());
		if (InnerScheda != null) {
			classInputHtmlObject Hscheda = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "Hscheda", "", InnerScheda);
			form.appendSome(Hscheda.toString());
		}
		if (InnerCampo != null) {
			classInputHtmlObject Hcampo = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "Hcampo", "", InnerCampo);
			form.appendSome(Hcampo.toString());
		}
		if (InnerUtente != null) {
			classInputHtmlObject Hutente = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "Hutente", "", InnerUtente);
			form.appendSome(Hutente.toString());
		}
		if (InnerScheda.equalsIgnoreCase("")) {
			fHtml.creaColonnaDescr("Nessuna scheda", "lblDescrizioneScheda");
		} else {
			fHtml.creaColonnaDescr(InnerScheda, "lblDescrizioneScheda");
		}

		if (InnerCampo.equalsIgnoreCase(""))
			fHtml.creaColonnaDescr("Nessuna campo", "lblDescrizioneCampo");
		else {
			fHtml.creaColonnaDescr(InnerCampo, "lblDescrizioneCampo");
		}

		if (!InnerCampo.equalsIgnoreCase("") && !InnerScheda.equalsIgnoreCase("")) {
			try {
				CVW_Gest_Rel carica_view = new CVW_Gest_Rel(logged_user.db.getWebConnection());
				carica_view.loadData("CAMPO='" + InnerCampo + "' and SCHEDA='" + InnerScheda + "' and UTENTE='" + InnerUtenteWcampo + "' order by utente");
				if (carica_view.getData(0) != null) {
					risultato_sel = carica_view.getData(0);
				} else {
					carica_view.loadData("CAMPO='" + InnerCampo + "' and SCHEDA='" + InnerScheda + "' and UTENTE is null  order by utente");
					risultato_sel = carica_view.getData(0);
				}

				Stato = risultato_sel.m_view_stato;
			} catch (Exception e) {
				log.writeLog("Errore nella creazione della worklist " + e.getMessage(), CLogError.LOG_ERROR);

				Stato = "50";
			}
		}
		switch (Integer.parseInt(Stato)) {
		case 50: {
			break;
		}
		case 1: {
			break;
		}
		case 10: {
			break;
		}
		case 20: {
			break;
		}
		default: {
			break;
		}

		}
		{
			classInputHtmlObject Hperm = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "Hperm", "", Stato);
			form.appendSome(Hperm.toString());
		}
		{
			classInputHtmlObject Hazione = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "Hazione", "", "");
			form.appendSome(Hazione.toString());
		}
		ArrayList TypeVision = new ArrayList();
		ArrayList TypeIdenVision = new ArrayList();

		TypeVision.add(0, new String("Nessuna Relazione"));
		TypeVision.add(1, new String("ReadOnly"));
		TypeVision.add(2, new String("NotVisible"));
		TypeVision.add(3, new String("Editable"));
		TypeVision.add(3, new String("Obligatory"));
		TypeVision.add(3, new String("Important"));
		TypeIdenVision.add(0, new String("1"));
		TypeIdenVision.add(1, new String("1"));
		TypeIdenVision.add(2, new String("10"));
		TypeIdenVision.add(3, new String("20"));
		TypeIdenVision.add(3, new String("30"));
		TypeIdenVision.add(3, new String("50"));
		fHtml.creaColonnaCombo("Stato", TypeVision, TypeIdenVision, Stato, "S");

		fHtml.aggiungiRiga();
		fHtml.getTable();

		form.appendSome(header.toString());
		form.appendSome(fHtml.getTable().toString());
		form.appendSome(footer.toString());
		form.appendSome("<SCRIPT>fillLabels(arrayLabelName,arrayLabelValue);</script>");
		testo.addElement(form.toString());

		classJsObject.setNullContextMenuEvent(testo, this.logged_user);

		return testo;
	}

	public classHeadHtmlObject addHead(baseUser logged_user) {
		classHeadHtmlObject testata = null;

		testata = new classHeadHtmlObject();
		new classJsObject();
		try {
			/*
			 * testata.addJSLink("std/jscript/tutto_schermo.js");
			 * testata.addJSLink("dwr/engine.js");
			 * testata.addJSLink("dwr/util.js");
			 * testata.addJSLink("dwr/interface/UpdatePermissioni.js");
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
			// "std/jscript/src/Gest_Campi/Gestione_campi.js*";
			testata.addElement(classTabExtFiles.getIncludeString(logged_user, "", this.getClass().getName(), this.myContext));
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

	private void leggiDatiInput(HttpServletRequest myInputRequest) {

		InnerCampo = "";
		InnerScheda = "";
		if (myInputRequest.getParameter("Hcampo") != null)
			InnerCampo += myInputRequest.getParameter("Hcampo");
		if (myInputRequest.getParameter("Hscheda") != null)
			InnerScheda += myInputRequest.getParameter("Hscheda");
		if (myInputRequest.getParameter("Hutente") != null)
			InnerUtente = myInputRequest.getParameter("Hutente");
		else
			InnerUtente = "";
		if (myInputRequest.getParameter("Hutente_worklist_campo") != null)
			InnerUtenteWcampo = myInputRequest.getParameter("Hutente_worklist_campo");
		else
			InnerUtenteWcampo = "";

	}
}
