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
 File:
 Autore: Fra
 */
package cartellaclinica.lettera;

import generic.utility.html.HeaderUtils;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classULHtmlObject;
import imago.sql.SqlQueryException;
import imagoUtils.classJsObject;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import matteos.database.DbUtils;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import cartellaclinica.lettera.pckInfo.classInfoLettera;
import cartellaclinica.lettera.pckSezioni.classSezioneLettera;
import cartellaclinica.utils.gestBloccoFunzioni.controlloBlocco;
import configurazioneReparto.baseReparti;
import generatoreEngine.components.html.htmlIFrame;


public class letteradimissioniEngine extends functionObj {

	private functionDB fDB = null;
	private functionStr fStr = null;

	private String idenVisita = new String("");
	private String idenVisitaRegistrazione = new String("");
	private String idenAnag = new String("");
	private String reparto = new String("");
	private String ricovero = new String("");
	private String funzione = new String("");
	private String idenVersione = new String("");
	private String readonly = "N";
	private String stato = "";
	private String attivo = "";
	private String typeFirma = "";

	private String controlloAccesso = new String("");

	baseReparti letteraReparto;

	private ArrayList<classSezioneLettera> lstSezioni = new ArrayList<classSezioneLettera>();
	private ArrayList<classInfoLettera> lstInfo = new ArrayList<classInfoLettera>();

	private classDivHtmlObject divBottomBar = new classDivHtmlObject("footer");
	private String iden_terapia_associata = new String("");

	public letteradimissioniEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
		fStr = new functionStr();

		letteraReparto = super.bReparti;//Global.getReparti(sess);
		setTypeFirma("typeFirma");

	}

	public letteradimissioniEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() throws IllegalAccessException, InstantiationException, ClassNotFoundException, NumberFormatException {
		String sOut = new String("");

		boolean show = true;
		int count = 0;

		Document cDoc = new Document();
		cDoc.setDoctype(new Doctype.Html401Transitional());

		Body cBody = new Body();
		cBody.setID("body");
		cBody.addAttribute("onload", "initGlobalObject();");
		cBody.addAttribute("onbeforeunload", "unLock();");
		cBody.addAttribute("onselectstart", "return false;");

		classDivHtmlObject divHeader = new classDivHtmlObject("divHeader");
		classDivHtmlObject divBody = new classDivHtmlObject("divBody");

		classDivHtmlObject headerLeft = new classDivHtmlObject("headerLeft");
		classDivHtmlObject headerRight = new classDivHtmlObject("headerRight");

		classDivHtmlObject divSections = new classDivHtmlObject("sections");
		classDivHtmlObject divInfos = new classDivHtmlObject("infos");
		classDivHtmlObject divFrame	 = new classDivHtmlObject("divFrame");
		classULHtmlObject cUL = new classULHtmlObject();

		try {
			this.readDati();
			if ("M".equalsIgnoreCase(super.bUtente.tipo)) {
				controlloBlocco cb = new controlloBlocco(hSessione, "CC_LETTERA_VERSIONI", this.funzione, Integer.valueOf(idenVisita));
				if (cb.isLocked()) {
					cBody.addElement("<script>alert('" + cb.getMessage() + "');</script>");
					this.readonly = "S";
				}
			}
			this.checkVersione();

			if (this.idenVersione.equals("")) {
				this.readConfigurazioniSezioni();
			} else {
				this.loadConfigurazioneFromXml();
			}

			this.readConfigurazioniInfoButton();

			cDoc.appendHead(this.createHead());

			for (int i = 0; i < lstSezioni.size(); i++) {
				if (show) {
					cUL.appendSome("<li class=active><span onclick=\"javascript:showSection(" + count + ");\" ordine=" + count + ">" + lstSezioni.get(i).label + "</span></li>");
				} else {
					cUL.appendSome("<li><span onclick=\"javascript:showSection(" + count + ");\" ordine=" + count + ">" + lstSezioni.get(i).label + "</span></li>");
				}

				divSections.appendSome(lstSezioni.get(i).toHTML(show));
				//show=false;
				count++;
			}
			cUL.addAttribute("id", "tabSections");
			headerLeft.appendSome(cUL);

			cUL = new classULHtmlObject();
			show = true;
			count = 0;

			for (int i = 0; i < lstInfo.size(); i++) {
				if (show) {
					cUL.appendSome("<li class=active><span onclick=\"javascript:showInfo(" + count + ");\" ordine=" + count + ">" + lstInfo.get(i).label + "</span></li>");
				} else {
					cUL.appendSome("<li><span onclick=\"javascript:showInfo(" + count + ");\" ordine=" + count + ">" + lstInfo.get(i).label + "</span></li>");
				}
				divInfos.appendSome(lstInfo.get(i).toHTML(show));
				show = false;
				count++;
			}

			cUL.addAttribute("id", "tabInfos");
			headerRight.appendSome(cUL);


			divHeader.appendSome(headerLeft);
			divHeader.appendSome(headerRight);

			divBody.appendSome(divSections);
			divBody.appendSome(divInfos);

			htmlIFrame frameConsenso = new htmlIFrame();
			String src = "consenso.html?";
			src += "tabella=RADSQL.NOSOLOGICI_PAZIENTE";
			src += "&statement_to_load=loadConsensoEspressoDocumento";
			src += "&iden="+this.idenVisita;
			src += "&tipologia_documento="+this.funzione;			
			frameConsenso.setId("idFrameConsenso");
			frameConsenso.setSrc(src);
			divFrame.appendSome(frameConsenso.generateTagHtml());
			divBody.appendSome(divFrame);		
			
			
			cBody.addElement(divHeader.toString());
			cBody.addElement(divBody.toString());

			cBody.addElement(this.divBottomBar.toString());

			cBody.addElement(this.getFormLettera());
			
			cDoc.setBody(cBody);
			sOut = cDoc.toString();
		} catch (SqlQueryException ex) {
			sOut = ex.getMessage();
		} catch (SQLException ex) {
			sOut = ex.getMessage();
		} catch (Exception ex) {
			sOut = ex.getMessage();
		}

		return sOut;
	}

	private void readDati() {
		this.idenVisita = this.cParam.getParam("idenVisita").trim();
		this.idenVisitaRegistrazione = this.cParam.getParam("idenVisitaRegistrazione").trim();
		this.idenAnag = this.cParam.getParam("idenAnag").trim();
		this.reparto = this.cParam.getParam("reparto").trim();
		this.ricovero = this.cParam.getParam("ricovero").trim();
		this.funzione = this.cParam.getParam("funzione").trim();
		this.idenVersione = this.cParam.getParam("idenVersione").trim();
		this.controlloAccesso = this.cParam.getParam("CONTROLLO_ACCESSO").trim();
	}

	/**
	 * Lettura configurazione lettera(sezioni di sinistra) da database TABELLA:
	 * IMAGOWEB.CONFIG_MENU_REPARTO, CONFIGURAZIONE ASL2: PROCEDURA =
	 * 'letteraDimissioniSezioni', CODICE_REPARTO = 'ASL2', FUNZIONE =
	 * 'LETTERA_STANDARD'
	 *
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
	private void readConfigurazioniSezioni() throws SQLException, SqlQueryException, Exception {
		/*  
		 String valoreRepartoSezioni		= letteraReparto.getValue(this.reparto,"letteraDimissioniSezioni");
		 String valoreRepartoInfo		 	= letteraReparto.getValue(this.reparto,"letteraDimissioniInfo");
		 String valoreRepartoBottomButton	= letteraReparto.getValue(this.reparto,"letteraDimissioniBottomButton");
		 */
		PreparedStatement ps;

		ResultSet rs;

		String sql = "Select GRUPPO,LABEL,IDEN_FIGLIO,QUERY,RIFERIMENTI from CONFIG_MENU_REPARTO where PROCEDURA=? and CODICE_REPARTO=? and FUNZIONE=?  and IDEN_PADRE is null and ATTIVO='S' order by ORDINAMENTO";

		ps = fDB.getConnectWeb().prepareStatement(sql);
		ps.setString(1, "letteraDimissioniSezioni");
		ps.setString(2, letteraReparto.getValue(this.reparto, "letteraDimissioniSezioni"));
		ps.setString(3, funzione);

		rs = ps.executeQuery();
		while (rs.next()) {
			lstSezioni.add(new classSezioneLettera(rs.getString("LABEL"), fDB, rs.getString("IDEN_FIGLIO"), letteraReparto.getValue(this.reparto, "letteraDimissioniSezioni"), funzione, Integer.valueOf(idenVisita), ricovero));
		}
		fDB.close(rs);
	}

	/**
	 * Lettura configurazione lettera(sezioni di destra(INFO) e
	 * bottoni(REGISTRA,FIRMA,STAMPA)) da database SEZIONI INFO - TABELLA:
	 * IMAGOWEB.CONFIG_MENU_REPARTO, SEZIONI INFO - CONFIGURAZIONE ASL2:
	 * PROCEDURA = 'letteraDimissioniInfo',CODICE_REPARTO = 'ASL2', FUNZIONE =
	 * 'LETTERA_STANDARD' SEZIONI BUTTON - TABELLA:
	 * IMAGOWEB.CONFIG_MENU_REPARTO, SEZIONI BUTTON - CONFIGURAZIONE ASL2:
	 * PROCEDURA = 'letteraDimissioniBottomButton',CODICE_REPARTO = 'ASL2',
	 * FUNZIONE = funzione javascript richiamata(REGISTRA:registra('N');
	 * ,FIRMA:registra('S'); ,STAMPA:stampaLetteraDimissioniBozza();) funzioni
	 * presenti nel file js:
	 * ricercaPazienti/ricoverati/scheda_ricovero/letteraDim/letteraDimEngine.js
	 *
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
	private void readConfigurazioniInfoButton() throws SQLException, SqlQueryException, Exception {
		/* CONFIGURAZIONE SEZIONI INFO*/
		PreparedStatement ps;
		ResultSet rs;
		String procedura = "";
		String sql = "Select GRUPPO,LABEL,IDEN_FIGLIO,QUERY,RIFERIMENTI from CONFIG_MENU_REPARTO where PROCEDURA=? and CODICE_REPARTO=? and FUNZIONE=?  and IDEN_PADRE is null and ATTIVO='S' order by ORDINAMENTO";
		ps = fDB.getConnectWeb().prepareStatement(sql);
		ps.setString(1, "letteraDimissioniInfo");
		ps.setString(2, letteraReparto.getValue(this.reparto, "letteraDimissioniInfo"));
		ps.setString(3, funzione);

		rs = ps.executeQuery();
		while (rs.next()) {
			sql = "";
			if (rs.getString("QUERY") != null) {
				sql = rs.getString("QUERY").replaceAll("#IDEN_VISITA#", this.idenVisita).replaceAll("#IDEN_ANAG#", this.idenAnag).replaceAll("#CODICE_REPARTO#", this.reparto).replaceAll("#NUM_NOSOLOGICO#", this.ricovero);
				lstInfo.add(new classInfoLettera(this.fDB, rs.getString("LABEL"), sql, rs.getString("GRUPPO")));
			} else {
				lstInfo.add(new classInfoLettera(this.hRequest, this.hSessione, this.fDB, rs.getString("LABEL"), rs.getString("RIFERIMENTI")));
			}

		}
		fDB.close(rs);

		classButton btn;
		/* CONFIGURAZIONE BUTTON INFO*/

		sql = "Select FUNZIONE,LABEL,GRUPPO from CONFIG_MENU_REPARTO where PROCEDURA=? and CODICE_REPARTO=?  and (TIPO_UTE=? or TIPO_UTE is null) and ATTIVO='S' order by ORDINAMENTO desc";
		ps = fDB.getConnectWeb().prepareStatement(sql);
		if (this.stato.equalsIgnoreCase("F")) {
			procedura = "letteraDimissioniBottomButtonFirma";
		} else {
			procedura = "letteraDimissioniBottomButton";
		}
		ps.setString(1, procedura);
		ps.setString(2, letteraReparto.getValue(this.reparto, procedura));
		ps.setString(3, bUtente.tipo);
		rs = ps.executeQuery();
		while (rs.next()) {
			btn = new classButton(rs.getString("LABEL"), rs.getString("FUNZIONE"), rs.getString("GRUPPO"));
			this.divBottomBar.appendSome(btn.getHtml());
		}
		fDB.close(rs);

	}

	private classHeadHtmlObject createHead() throws SQLException, SqlQueryException, Exception {

		classHeadHtmlObject cHead = HeaderUtils.createHeadWithIncludes(this.getClass().getName(), hSessione);

		cHead.addElement(classJsObject.javaClass2jsClass(this.bUtente));

		return cHead;

	}

	private void checkVersione() throws SQLException, SqlQueryException {
		PreparedStatement ps;
		ResultSet rs;

		if (this.idenVersione.equals("")) {
			ps = fDB.getConnectData().prepareCall("select IDEN,STATO,ATTIVO,IDEN_TERAPIA_ASSOCIATA from CC_LETTERA_VERSIONI where iden_visita=? and ATTIVO='S' and funzione=?");
			ps.setInt(1, Integer.valueOf(idenVisita));
			ps.setString(2, this.funzione);
			rs = ps.executeQuery();
			if (rs.next()) {
				this.idenVersione = rs.getString("IDEN");
				this.stato = rs.getString("STATO");
				this.attivo = rs.getString("ATTIVO");
				this.iden_terapia_associata = DbUtils.checkNullString(rs.getString("IDEN_TERAPIA_ASSOCIATA"));
			}
			fDB.close(rs);
		}
	}

	/**
	 * Lettura configurazione lettera(sezioni di sinistra) da xml -> si verifica
	 * quando si apre la lettera ed e' presente una lettera salvata
	 * precedentemente. Lettura sulla vista VIEW_CC_LETTERA_SEZ_CLOB
	 *
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
	private void loadConfigurazioneFromXml() throws SQLException, SqlQueryException {

		Integer idx = null;

		PreparedStatement ps;
		ResultSet rs;

		ps = fDB.getConnectData().prepareCall("select * from VIEW_CC_LETTERA_SEZ_CLOB where iden_versione=?");
		ps.setInt(1, Integer.valueOf(this.idenVersione));
		rs = ps.executeQuery();

		while (rs.next()) {
			for (int i = 0; i < lstSezioni.size(); i++) {
				if (lstSezioni.get(i).label.equals(chkNull(rs.getString("SEZIONE")))) {
					idx = i;
				}
			}
			if (idx == null) {
				lstSezioni.add(new classSezioneLettera(chkNull(rs.getString("SEZIONE")), fDB, Integer.valueOf(idenVisita), ricovero, funzione));
				idx = lstSezioni.size() - 1;
			}
			lstSezioni.get(idx).addTxtArea(rs.getString("ID_ELEMENTO"), rs.getString("LABEL"), rs.getString("ROWS"), rs.getString("TESTO_HTML"));
			this.stato = rs.getString("STATO");
			this.attivo = rs.getString("ATTIVO");
			idx = null;
		}
		fDB.close(rs);
	}

	private String getFormLettera() throws Exception {

		String strForms;

		classFormHtmlObject form = new classFormHtmlObject("frmLettera", "", "POST", "");

		form.appendSome(new classInputHtmlObject("hidden", "CONTROLLO_ACCESSO", controlloAccesso));
		form.appendSome(new classInputHtmlObject("hidden", "idenVisita", idenVisita));
		form.appendSome(new classInputHtmlObject("hidden", "iden_terapia_associata", iden_terapia_associata));
		form.appendSome(new classInputHtmlObject("hidden", "idenVisitaRegistrazione", idenVisitaRegistrazione));
		form.appendSome(new classInputHtmlObject("hidden", "idenAnag", idenAnag));
		form.appendSome(new classInputHtmlObject("hidden", "reparto", reparto));
		form.appendSome(new classInputHtmlObject("hidden", "ricovero", ricovero));
		form.appendSome(new classInputHtmlObject("hidden", "funzione", funzione));
		form.appendSome(new classInputHtmlObject("hidden", "idenVersione", idenVersione));
		form.appendSome(new classInputHtmlObject("hidden", "readonly", readonly));
		form.appendSome(new classInputHtmlObject("hidden", "stato", stato));
		form.appendSome(new classInputHtmlObject("hidden", "attivo", attivo));

		strForms = form.toString() + "\n";

		form = new classFormHtmlObject("frmFirmaLettera", "", "POST", "");

		form.appendSome(new classInputHtmlObject("hidden", "idenVisita", idenVisita));
		form.appendSome(new classInputHtmlObject("hidden", "idenVisitaRegistrazione", idenVisitaRegistrazione));
		form.appendSome(new classInputHtmlObject("hidden", "whereReport", idenVisita));
		form.appendSome(new classInputHtmlObject("hidden", "campoDaFiltrare", "IDEN_VISITA"));
		form.appendSome(new classInputHtmlObject("hidden", "typeProcedure", funzione));
		form.appendSome(new classInputHtmlObject("hidden", "typeFirma", letteraReparto.getValue(this.reparto, getTypeFirma())));
		form.appendSome(new classInputHtmlObject("hidden", "reparto", letteraReparto.getValue(this.reparto, "reportFirma")));
		form.appendSome(new classInputHtmlObject("hidden", "repartoDati", this.reparto));
		form.appendSome(new classInputHtmlObject("hidden", "allegaDatiStr", "N##"));
		form.appendSome(new classInputHtmlObject("hidden", "idenAnag", idenAnag));

		strForms += form.toString() + "\n";

		return "\n" + strForms;
	}

	private String chkNull(String input) {
		if (input == null) {
			return "";
		} else {
			return input;
		}
	}

	public String getTypeFirma() {
		return typeFirma;
	}

	public void setTypeFirma(String typeFirma) {
		this.typeFirma = typeFirma;
	}

}
