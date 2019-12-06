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
 * SL_Aggiungi_CampoEngine.java
 *
 * Created on 12 settembre 2006, 12.41
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
import imagoUtils.classJsObject;
import imago_jack.imago_function.html.functionHTML;

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
public class SL_Aggiungi_SchedaEngine {
	private baseUser LoggedUser;

	private HttpServletRequest MYrequest;

	CLogError log = null;

	private String Azione = "";

	private String DaModificare = "";

	/** Creates a new instance of SevletLLengine */
	public SL_Aggiungi_SchedaEngine(HttpServletRequest request, HttpSession Sessione, ServletContext Contesto, CContextParam ContextParam) {
		LoggedUser = Global.getUser(Sessione);
		MYrequest = request;
		try {

			log = new CLogError(LoggedUser.db.getWebConnection(), request, "SL_Aggiungi_Scheda", LoggedUser.login);
			log.setFileName("SL_Aggiungi_CampoEngine");
			log.setClassName("src.Sel_Stampa.SL_Aggiungi_CampoEngine");
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
			jsLabel = label_js.getArrayLabel("SL_Campo", LoggedUser);
		} catch (ImagoHttpException e) {
			log.writeLog("Problemi nel trovare nella tabella delle lingue i client esatti ", CLogError.LOG_ERROR);
		}
		try {
			doc.appendHead(jsLabel);
		} catch (Exception e) {
			log.writeLog("Problemi nel creare il body che aggiunge modifica o cancella una scheda ", CLogError.LOG_ERROR);
		}
		try {
			doc.setBody(creaBody());
		} catch (Exception e) {
			log.writeLog("Problemi nel creare l'head che aggiunge modifica o cancella una scheda ", CLogError.LOG_ERROR);
		}
		return doc;

	}

	public Body creaBody() {
		Body testo = new Body();
		classFormHtmlObject form = new classFormHtmlObject("formAggCampo", "SL_RegistraDB", "POST");
		functionHTML fHtml = new functionHTML();

		fHtml.init_table();
		leggiDatiInput(MYrequest);
		String D = "";
		classLabelHtmlObject label_aggCampo = null;

		String Imposta = "";

		fHtml.creaColonnaDescrMiddle("NOME_Scheda", "CAMPO");
		if (Azione.equalsIgnoreCase("Cancella")) {
			Imposta = "CancellaScheda";
			classInputHtmlObject HScheda = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "HScheda", "", DaModificare);
			form.appendSome(HScheda.toString());
			classInputHtmlObject HImposta = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "HImposta", "", Imposta);
			form.appendSome(HImposta.toString());
			form.appendSome("<SCRIPT>CancellaDBScheda('CancellaScheda','" + DaModificare + "');</script>");
			// form.addEvent("onload","<SCRIPT>RegistraDBScheda("+Imposta+");</script>");
		} else {
			if (Azione.equalsIgnoreCase("Modifica")) {
				try {
					CGes_campo_scheda_Data CampoCaricato = new CGes_campo_scheda_Data();
					CGes_campo_scheda CaricaCampo = new CGes_campo_scheda(LoggedUser.db.getWebConnection());
					CaricaCampo.loadData("SCHEDA='" + DaModificare + "'");
					CampoCaricato = CaricaCampo.getData(0);

					fHtml.creaColonnaField("FieCampo", DaModificare);
					fHtml.aggiungiRiga();

					fHtml.creaColonnaDescrMiddle("DESCRIZIONE", "DESCRIZIONE");
					if (CampoCaricato.m_descrizione == null) {
						D = "";
					} else {
						D = CampoCaricato.m_descrizione;
					}
					fHtml.creaColonnaField("FieDescrizione", D);
					fHtml.aggiungiRiga();

					label_aggCampo = new classLabelHtmlObject("", "", "tit_mod_campo");

					Imposta = "ModificaScheda";
				} catch (Exception e) {
				}
			}
			if (!Azione.equalsIgnoreCase("Modifica")) {
				fHtml.creaColonnaField("FieCampo");
				fHtml.aggiungiRiga();
				fHtml.creaColonnaDescrMiddle("DESCRIZIONE", "DESCRIZIONE");
				fHtml.creaColonnaField("FieDescrizione");
				fHtml.aggiungiRiga();
				label_aggCampo = new classLabelHtmlObject("", "", "tit_agg_campo");
				Imposta = "AggiungiScheda";
			}

			fHtml.getTable();
			classInputHtmlObject HScheda = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "HScheda", "", "");
			form.appendSome(HScheda.toString());
			classInputHtmlObject HDescrizione = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "HDescrizione", "", "");
			form.appendSome(HDescrizione.toString());
			classInputHtmlObject HImposta = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "HImposta", "", Imposta);
			form.appendSome(HImposta.toString());
			classTabHeaderFooter header = new classTabHeaderFooter(label_aggCampo);
			classTabHeaderFooter footer = new classTabHeaderFooter(" ");
			footer.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");

			new classDivButton("", "pulsante", "javascript:EliminaDBScheda();", "elimina", "");

			classDivButton button_ricerca = new classDivButton("", "pulsante", "javascript:RegistraDBScheda('" + Imposta + "');", "registra", "");
			classDivButton button_chiudi = new classDivButton("", "pulsante", "javascript:self.close();", "chiudi", "");
			footer.addColumn("classButtonHeader", button_ricerca.toString());
			footer.addColumn("classButtonHeader", button_chiudi.toString());
			form.appendSome(header.toString());
			form.appendSome(fHtml.getTable().toString());
			form.appendSome(footer.toString());
			form.appendSome("<SCRIPT>fillLabels(arrayLabelName,arrayLabelValue);</script>");
		}
		testo.addElement(form.toString());
		classJsObject.setNullContextMenuEvent(testo, this.LoggedUser);
		return testo;
	}

	public classHeadHtmlObject addHead(baseUser logged_user) {
		classHeadHtmlObject testata = null;
		testata = new classHeadHtmlObject();
		new classJsObject();
		try {
			testata.addJSLink("std/jscript/tutto_schermo.js");
			testata.addCssLink("std/css/textArea.css");
			testata.addJSLink("std/jscript/fillLabels.js");
			testata.addCssLink("std/css/button.css");
			testata.addCssLink("std/css/dataEntryTable.css");
			testata.addCssLink("std/css/normalBody.css");
			testata.addJSLink("std/jscript/ShowHideLayer.js");
			testata.addJSLink("sdt/jscript/optionJsUtil.js");
			testata.addCssLink("std/css/headerTable.css");
			testata.addCssLink("std/css/dataTable.css");
			testata.addCssLink("std/css/dataEntryTable.css");
			testata.addJSLink("std/jscript/src/Gest_Campi/GestioneSalva.js");

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

		Azione = myInputRequest.getParameter("Azione");
		if (Azione.equalsIgnoreCase("Modifica") || Azione.equalsIgnoreCase("Cancella")) {
			DaModificare = myInputRequest.getParameter("selezionato");
		}
	}
}
