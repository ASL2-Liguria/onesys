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
package src.Gestione_Campi;

import imago.a_sql.CLogError;
import imago.a_sql.CWeb;
import imago.http.ImagoHttpException;
import imago.http.classDivButton;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classSelectHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;
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
public class SL_Associa_CampoEngine {

	private HttpSession mySession = null;

	private baseUser logged_user = null;

	private String User = "";

	private CLogError log = null;

	private String Iden_scheda = "";

	/** Creates a new instance of SL_RegistraDBEngine */
	public SL_Associa_CampoEngine(HttpServletRequest myInputRequest, ServletContext myContext) {
		mySession = myInputRequest.getSession(false);
		logged_user = Global.getUser(mySession);
		Iden_scheda = myInputRequest.getParameter("hidWhere");
		User = myInputRequest.getParameter("utente_sel");
		try {

			log = new CLogError(logged_user.db.getWebConnection(), myInputRequest, "SL_Associa_Campo", logged_user.login);
			log.setFileName("SL_Associa_Campo");
			log.setClassName("src.Sel_Stampa.SL_Associa_Campo");
		} catch (Exception ex) {
			// System.out.println(ex);
		}
	}

	/**
	 * @return
	 * @see
	 */
	public org.apache.ecs.Document creaDocumentoHtml() {
		Document doc = null;

		doc = new Document();

		doc.setHead(addHead(logged_user));

		classJsObject label_js = new classJsObject();
		String jsLabel = null;
		try {
			jsLabel = label_js.getArrayLabel("ServletGestCampi", logged_user);
		} catch (ImagoHttpException e) {
			log.writeLog("Problemi nel trovare nella tabella delle lingue i client esatti ", CLogError.LOG_ERROR);
		}
		doc.appendHead(jsLabel);

		doc.setBody(creaBody());
		return doc;
	}

	/**
	 * @param logged_user
	 * @return
	 */
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
			// testata.addJSLink("std/jscript/ShowHideLayer.js");
			testata.addJSLink("std/jscript/src/SL_Stampa_Tab/SL_Stampa_Tab.js");
			testata.addJSLink("sdt/jscript/optionJsUtil.js");
			testata.addCssLink("std/css/headerTable.css");
			testata.addCssLink("std/css/dataTable.css");
			testata.addCssLink("std/css/dataEntryTable.css");
			testata.addCssLink("std/css/filterTable.css");
			testata.addJSLink("std/jscript/src/Gest_Campi/Gestione_associa.js");
			// testata.addJSLink("sdt/jscript/src/ListeLavoro/SelDeselAll.js");
			// testata.addJscode(myJS.getArrayLabel("ServletLLFiltri",LoggedUser));

			/* Gestione del calendario */
			// testata.addCssLink("std/css/ImageX.css");

		} catch (Exception ex) {
			// System.out.println(ex);
			log.writeLog("Problemi nel creare la testata della pagina Html ", CLogError.LOG_ERROR);
		}
		return testata;
	}

	public Body creaBody() {
		Body testo = new Body();
		functionHTML fHtml = new functionHTML();
		functionHTML fHtml1 = new functionHTML();
		functionHTML fHtml2 = new functionHTML();
		classFormHtmlObject form = new classFormHtmlObject("formAssCampo", "SL_AssociaDB", "POST");
		fHtml1.init_table();
		fHtml.init_table();

		try {
			CWeb listautenti = new CWeb(logged_user.db.getWebConnection(), 1);
			String[][] utenti = null;
			CGes_campo_scheda Tab_scheda = new CGes_campo_scheda(logged_user.db.getWebConnection());
			CGes_campo_scheda_Data Tab_schedaData = new CGes_campo_scheda_Data();
			if (User == null || User.equalsIgnoreCase("")) {

				listautenti.loadData("%", true);
				int n_utenti = listautenti.getNRecordLoad();

				utenti = new String[n_utenti][2];
				for (int i = 0; i < n_utenti; i++) {
					utenti[i][0] = Integer.toString(listautenti.getData(i).m_iIDEN);
					utenti[i][1] = listautenti.getData(i).m_strWEBUSER;
				}
			} else {

				listautenti.loadData(User, true);
				int n_utenti = listautenti.getNRecordLoad();

				utenti = new String[n_utenti][2];
				for (int i = 0; i < n_utenti; i++) {
					utenti[i][0] = Integer.toString(listautenti.getData(i).m_iIDEN);
					utenti[i][1] = listautenti.getData(i).m_strWEBUSER;
				}
			}

			/*
			 * if (Iden_scheda.equalsIgnoreCase("")) { Tab_scheda.loadAllData();
			 * SchedeCar=Tab_scheda.getData();} else{
			 */
			Tab_scheda.loadData("iden=" + Iden_scheda);
			Tab_schedaData = Tab_scheda.getData(0);// }

			CGes_campo_dettaglio Tab_campo = new CGes_campo_dettaglio(logged_user.db.getWebConnection());
			Tab_campo.loadallData();
			int n_campi = Tab_campo.getData().size();
			String[][] campi = new String[n_campi][2];

			for (int a = 0; a < n_campi; a++) {
				campi[a][0] = Integer.toString(Tab_campo.getData(a).m_iden);
				campi[a][1] = Tab_campo.getData(a).m_campo;
			}
			classSelectHtmlObject select_campi = new classSelectHtmlObject("allcampi");
			classSelectHtmlObject select_campi_sel = new classSelectHtmlObject("campo_selezionato");
			classSelectHtmlObject select_utenti = new classSelectHtmlObject("allutenti");
			classSelectHtmlObject select_utenti_sel = new classSelectHtmlObject("utenti_selezionati");
			select_campi.addAttribute("style", "width:100%");
			select_campi_sel.addAttribute("style", "width:100%");
			select_utenti.addAttribute("style", "width:100%");
			select_utenti_sel.addAttribute("style", "width:100%");
			// riga selezione campo
			fHtml.creaColonnaDescr("", "lbldescCamp", "", "20");
			fHtml.creaColonnaSelect(select_campi, "", "ondblClick", "javascript:add_list_elements(\"allcampi\",\"campo_selezionato\")", "10", campi);
			fHtml.creaColonnaDescr("", "lbldescCampIns", "", "20");
			fHtml.creaColonnaSelect(select_campi_sel, "", "ondblClick", "javascript:add_list_elements(\"campo_selezionato\",\"allcampi\")", "10");
			fHtml.aggiungiRiga();

			// riga selezione utente/gruppi
			// fHtml.creaColonnaDescr("","");
			// fHtml.creaColonnaCombo("",listaUtenti,listaUtenti,"","");
			// fHtml.aggiungiRiga();
			// riga selezione utenti
			if (User == null || User.equalsIgnoreCase("")) {
				fHtml2.creaColonnaDescr("", "lbldescUten", "", "20");
				fHtml2.creaColonnaSelect(select_utenti, "", "ondblClick", "javascript:add_list_elements(\"allutenti\",\"utenti_selezionati\")", "10", utenti);
			}

			if (User == null || User.equalsIgnoreCase("")) {
				fHtml2.creaColonnaDescr("", "lbldescUtenIns", "", "20");
				fHtml2.creaColonnaSelect(select_utenti_sel, "", "ondblClick", "javascript:add_list_elements(\"allutenti\",\"utenti_selezionati\")", "10");
			} else {
				fHtml2.creaColonnaDescrMiddle("", "lbldescUtenIns");
				fHtml2.creaColonnaSelect(select_utenti_sel, "", "", "", "1", utenti);
			}
			// fHtml2.creaColonnaSelect(select_utenti_sel,"","ondblClick","javascript:add_list_elements(\"utenti_selezionati\",\"allutenti\")","10");
			fHtml2.aggiungiRiga();
			// riga selezione Stato
			fHtml1.creaColonnaDescrMiddle("", "lblImpostaStato");
			ArrayList TypeVision = new ArrayList();
			ArrayList TypeIdenVision = new ArrayList();

			TypeVision.add(new String("ReadOnly"));
			TypeVision.add(new String("NotVisible"));
			TypeVision.add(new String("Editable"));
			TypeVision.add(new String("Obligatory"));
			TypeIdenVision.add(new String("1"));
			TypeIdenVision.add(new String("10"));
			TypeIdenVision.add(new String("20"));
			TypeIdenVision.add(new String("30"));
			fHtml1.creaColonnaCombo("Ins_stato", TypeVision, TypeIdenVision, "", "");
			// fHtml1.creaColonnaField("Ins_stato","","","","");
			fHtml1.aggiungiRiga();

			classLabelHtmlObject label_Ricerca = new classLabelHtmlObject("", "", "tit_associa");
			classTabHeaderFooter header = new classTabHeaderFooter(label_Ricerca.toString() + Tab_schedaData.m_scheda);
			classTabHeaderFooter footer = new classTabHeaderFooter(" ");
			footer.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
			classDivButton Aggiungi = new classDivButton("", "pulsante", "javascript:applicaAssocia();", "associa", "");
			classDivButton Chiudi = new classDivButton("", "pulsante", "javascript:self.close();", "close_associa", "");
			footer.addColumn("classButtonHeader", Aggiungi.toString());
			footer.addColumn("classButtonHeader", Chiudi.toString());
			classInputHtmlObject Hstr_campi = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "Hstr_campi", "", "");
			form.appendSome(Hstr_campi.toString());
			classInputHtmlObject Hstr_utenti = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "Hstr_utenti", "", "");
			form.appendSome(Hstr_utenti.toString());
			classInputHtmlObject Hstr_scheda = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "Hstr_scheda", Iden_scheda, Iden_scheda);
			form.appendSome(Hstr_scheda.toString());
			classInputHtmlObject Hstr_stato = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "Hstr_stato", "", "");
			form.appendSome(Hstr_stato.toString());
			form.appendSome(header.toString());

			form.appendSome(fHtml.getTable().toString());
			form.appendSome(fHtml2.getTable().toString());
			form.appendSome(fHtml1.getTable().toString());
			form.appendSome(footer.toString());
			form.appendSome("<SCRIPT>fillLabels(arrayLabelName,arrayLabelValue);</script>");
		} catch (Exception e) {
			log.writeLog("Errore nella creazione del body" + e.getMessage(), CLogError.LOG_ERROR);
		}

		testo.addElement(form.toString());
		classJsObject.setNullContextMenuEvent(testo, this.logged_user);
		return testo;
	}
}
