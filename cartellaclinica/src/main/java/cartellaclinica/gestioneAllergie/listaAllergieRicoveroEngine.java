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
 File: consultazioneCalendarioGes.java
 Autore: Jack
 */
package cartellaclinica.gestioneAllergie;

import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classIFrameHtmlObject;
import imago.http.classImgHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classOptionHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classSelectHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTableHtmlObject;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

public class listaAllergieRicoveroEngine extends functionObj {

	private functionDB fDB = null;
	private functionStr fStr = null;

	private String idRemoto = new String("");
	private String ricovero = new String("");
	private String reparto = new String("");
	private String inserisci = new String("");

	public listaAllergieRicoveroEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
		fStr = new functionStr();
	}

	public listaAllergieRicoveroEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();
		classTabHeaderFooter HeadSection = null;
		classTableHtmlObject cTable = null;
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		classSelectHtmlObject cCombo = null;
		classOptionHtmlObject cOption = null;

		try {

			this.readDati();

			cDoc.appendHead(this.createHead());

			cBody.addAttribute("onClick", "javascript:hideContextMenu();");
			cBody.addAttribute("onContextMenu", "javascript:return MenuTxDx();");

			HeadSection = new classTabHeaderFooter("Gestione Allerte");
			HeadSection.addColumn("classButtonHeader", new classDivButton("registra", "pulsante", "javascript:salvaTutto();", "P", "").toString());
			cBody.addElement(HeadSection.toString());

			String sql = new String("Select * from cartclin.VIEW_ALLERTE_RICOVERO where N_RICOVERO='" + ricovero + "' and ID_REMOTO='" + idRemoto + "' ");
			sql += " order by TIPO,DATA_INS";
			ResultSet rs = fDB.openRs(sql);

			cTable = new classTableHtmlObject("100%");
			cTable.addAttribute("class", "classDataTable");
			cTable.addAttribute("id", "oTable");
			cRow = new classRowDataTable();
			cCol = new classColDataTable("th", "5%", "Superato");
			cRow.addCol(cCol);
			cCol = new classColDataTable("th", "10%", "Tipo");
			cRow.addCol(cCol);
			cCol = new classColDataTable("th", "45%", "Descrizione");
			cRow.addCol(cCol);
			cCol = new classColDataTable("th", "20%", "Tipologia");
			cRow.addCol(cCol);
			cCol = new classColDataTable("th", "20%", "Sintomo");
			cRow.addCol(cCol);
			/*cCol= new classColDataTable("th","20%","Modificato da");
			 cRow.addCol(cCol);    */
			cTable.appendSome(cRow.toString());
			while (rs.next()) {
				cRow = new classRowDataTable();
				cRow.addAttribute("id", rs.getString("IDEN_ALLERGIA"));
				cCol = new classColDataTable("", "", "");
				cCol.addAttribute("class", "risolto" + rs.getString("SUPERATO"));
				cCol.addAttribute("superato", rs.getString("SUPERATO"));
				cCol.addEvent("onClick", "javascript:switchSuperato(this);");
				cRow.addCol(cCol);
				cCol = new classColDataTable("", "", rs.getString("TIPO"));
				cRow.addCol(cCol);
				classInputHtmlObject cInput = new classInputHtmlObject("text", "txtTesto", chkNull(rs.getString("TESTO")));
				cInput.addAttribute("style", "width:100%");
				cCol = new classColDataTable("", "", cInput);
				cRow.addCol(cCol);
				cCol = new classColDataTable("", "", getComboTipologia(chkNull(rs.getString("TIPOLOGIA")), chkNull(rs.getString("TIPO"))));
				cRow.addCol(cCol);
				cCol = new classColDataTable("", "", getComboSintomo(chkNull(rs.getString("SINTOMO")), chkNull(rs.getString("TIPO"))));
				cRow.addCol(cCol);
				/*cCol= new classColDataTable("","",rs.getString("UTE_MOD"));
				 cCol.addAttribute("title",rs.getString("DATA_MOD"));
				 cRow.addCol(cCol);    */
				cTable.appendSome(cRow.toString());
			}
			fDB.close(rs);

			cBody.addElement(cTable.toString());

			classFormHtmlObject cForm = new classFormHtmlObject("formWkAllergie", "listaAllergieRicovero", "POST", "_self");
			cForm.addAttribute("style", "margin:0px;padding:0px;");
			cForm.appendSome(new classInputHtmlObject("hidden", "idRemoto", idRemoto));
			cForm.appendSome(new classInputHtmlObject("hidden", "ricovero", ricovero));
			cForm.appendSome(new classInputHtmlObject("hidden", "reparto", reparto));
			cForm.appendSome(new classInputHtmlObject("hidden", "inserisci", ""));
			cBody.addElement(cForm.toString());

			cBody.addElement(new classIFrameHtmlObject("", "frameSave", 1, 1).toString());
			cBody.addElement(addContextMenu().toString());
			cBody.addElement("<SCRIPT>aggiornaWkAllergie();</SCRIPT>");
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

	/**
	 * getComboSintomo
	 *
	 * @return String
	 */
	private String getComboSintomo(String valoreAttivo, String Tipo) throws SqlQueryException, SQLException {
		classSelectHtmlObject cCombo = new classSelectHtmlObject("cmbSintomo");
		cCombo.addOption("-1", "", valoreAttivo.equals(""));
		ResultSet rs = fDB.openRs("SELECT iden,descrizione from cartclin.TAB_CODIFICHE where TIPO_DATO='SINTOMO_" + Tipo + "' and CODICE_REPARTO in ('ALL','" + reparto + "')");
		while (rs.next()) {
			cCombo.addOption(rs.getString("IDEN"), rs.getString("DESCRIZIONE"), rs.getString("IDEN").equals(valoreAttivo));
		}
		fDB.close(rs);

		return cCombo.toString();
	}

	/**
	 * getComboTipologia
	 *
	 * @return String
	 */
	private String getComboTipologia(String valoreAttivo, String Tipo) throws SqlQueryException, SQLException {
		classSelectHtmlObject cCombo = new classSelectHtmlObject("cmbTipologia");
		cCombo.addOption("-1", "", (valoreAttivo.equals("") || valoreAttivo.equals("-1")));
		ResultSet rs = fDB.openRs("SELECT iden,descrizione from cartclin.TAB_CODIFICHE where TIPO_DATO='TIPO_" + Tipo + "' and CODICE_REPARTO in ('ALL','" + reparto + "')");
		while (rs.next()) {
			cCombo.addOption(rs.getString("IDEN"), rs.getString("DESCRIZIONE"), rs.getString("IDEN").equals(valoreAttivo));
		}
		fDB.close(rs);

		return cCombo.toString();
	}

	private void readDati() throws SQLException, SqlQueryException {

		this.idRemoto = this.cParam.getParam("idRemoto").trim();
		this.ricovero = this.cParam.getParam("ricovero").trim();
		this.reparto = this.cParam.getParam("reparto").trim();
		this.inserisci = this.cParam.getParam("inserisci").trim();

		if (inserisci != null && !inserisci.equals("")) {
			String sql = new String("");
			sql = "Insert into cartclin.TAB_ALLERTE_RICOVERO (TIPO,ID_REMOTO,N_RICOVERO,CODICE_REPARTO,UTE_INS,UTE_MOD) values ('" + inserisci + "','" + idRemoto + "','" + ricovero + "','" + reparto + "'," + bUtente.iden_per + "," + bUtente.iden_per + ")";
			fDB.executeQueryData(sql);
		}

	}

	private classHeadHtmlObject createHead() throws SQLException, SqlQueryException, Exception {

		return HeaderUtils.createHeadWithIncludes(this.getClass().getName(), hSessione);

	}

	private String chkNull(String input) {
		if (input == null) {
			return "";
		} else {
			return input;
		}
	}

	private classDivHtmlObject addContextMenu() {

		classTableHtmlObject Table = null;
		classRowDataTable Row = null;
		classColDataTable Col = null;

		classDivHtmlObject Div = new classDivHtmlObject();

		Div.addAttribute("id", "contextualMenu");
		Div.addAttribute("Style", "position:absolute;visibility:hidden");

		Table = new classTableHtmlObject();
		Table.addAttribute("class", "ContextMenuLinks");
		Table.addAttribute("cellspacing", "0");
		Table.addAttribute("cellpadding", "0");
		Table.addAttribute("border", "0");

		Row = new classRowDataTable();
		Col = new classColDataTable("", "", "Gestione allerte");
		Col.addAttribute("class", "titleMenuOption");
		Col.addAttribute("colSpan", "2");
		Row.addCol(Col);
		Table.appendSome(Row.toString());

		Row = new classRowDataTable();
		Col = new classColDataTable("", "", new classImgHtmlObject("imagexPix/contextMenu/MnCntIns.gif", "", "", 0, "30", "30"));
		Col.addAttribute("class", "DropDownIcon");
		Row.addCol(Col);
		Col = new classColDataTable("", "", "Inserisci allergia");
		Col.addAttribute("class", "ContextMenuNormal");
		Col.addAttribute("align", "right");
		Col.addEvent("onMouseOver", "javascript:this.className='ContextMenuOver'");
		Col.addEvent("onMouseOut", "javascript:this.className='ContextMenuNormal'");
		Col.addEvent("onClick", "javascript:inserisci('ALLERGIA');");
		Row.addCol(Col);
		Table.appendSome(Row.toString());

		Row = new classRowDataTable();
		Col = new classColDataTable("", "", new classImgHtmlObject("imagexPix/contextMenu/MnCntIns.gif", "", "", 0, "30", "30"));
		Col.addAttribute("class", "DropDownIcon");
		Row.addCol(Col);
		Col = new classColDataTable("", "", "Inserisci Reazione Avversa");
		Col.addAttribute("class", "ContextMenuNormal");
		Col.addAttribute("align", "right");
		Col.addEvent("onMouseOver", "javascript:this.className='ContextMenuOver'");
		Col.addEvent("onMouseOut", "javascript:this.className='ContextMenuNormal'");
		Col.addEvent("onClick", "javascript:inserisci('AVVERSA');");
		Row.addCol(Col);
		Table.appendSome(Row.toString());

		Row = new classRowDataTable();
		Col = new classColDataTable("", "", new classImgHtmlObject("imagexPix/contextMenu/MnCntIns.gif", "", "", 0, "30", "30"));
		Col.addAttribute("class", "DropDownIcon");
		Row.addCol(Col);
		Col = new classColDataTable("", "", "Inserisci controindicazione");
		Col.addAttribute("class", "ContextMenuNormal");
		Col.addAttribute("align", "right");
		Col.addEvent("onMouseOver", "javascript:this.className='ContextMenuOver'");
		Col.addEvent("onMouseOut", "javascript:this.className='ContextMenuNormal'");
		Col.addEvent("onClick", "javascript:inserisci('CONTROINDICAZIONE');");
		Row.addCol(Col);
		Table.appendSome(Row.toString());

		Row = new classRowDataTable();
		Col = new classColDataTable("", "", new classImgHtmlObject("imagexPix/contextMenu/MnCntIns.gif", "", "", 0, "30", "30"));
		Col.addAttribute("class", "DropDownIcon");
		Row.addCol(Col);
		Col = new classColDataTable("", "", "Inserisci allerta generica");
		Col.addAttribute("class", "ContextMenuNormal");
		Col.addAttribute("align", "right");
		Col.addEvent("onMouseOver", "javascript:this.className='ContextMenuOver'");
		Col.addEvent("onMouseOut", "javascript:this.className='ContextMenuNormal'");
		Col.addEvent("onClick", "javascript:inserisci('ALLERTA');");
		Row.addCol(Col);
		Table.appendSome(Row.toString());

		Div.appendSome(Table);

		return Div;
	}

}
