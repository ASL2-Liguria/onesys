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
package cartellaclinica.gestioneBisogni;

import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTabHeaderFooter;
import imago.http.classTableHtmlObject;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

public class mainBisogniEngine extends functionObj {

	private functionDB fDB = null;
	//private functionStr fStr = null;

	private String iden_visita = new String("");
	private String reparto = new String("");
	private String action = new String("");
	private String id2save = new String("");
	private String funzione = new String("");

	private Hashtable<Integer, String> tabLivelli = new Hashtable<Integer, String>();

	public mainBisogniEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
		//fStr = new functionStr();
	}

	public mainBisogniEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		cDoc.setDoctype(new Doctype.Html401Transitional());
		Body cBody = new Body();

		try {

			cDoc.appendHead(this.createHead());

			cBody.addElement(this.readDati());

			if (!funzione.equals("")) {
				cBody.addAttribute("onLoad", "apriScheda('" + funzione + "');");
			}

			cBody.addElement(this.createSectionBisogni());

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
	 * createSectionBisogni
	 *
	 * @return String
	 */
	private String createSectionBisogni() throws SQLException, SqlQueryException {
		classTabHeaderFooter HeadSection = null;

		String result = new String("");

		HeadSection = new classTabHeaderFooter("Gestione bisogni assistenziali");
		HeadSection.setClasses("classTabHeader", "classTabHeaderSx",
				"classTabHeaderMiddle",
				"classTabHeaderDx");
		// result +=HeadSection.toString()+"\n";

		result += this.createTabBisogni();

		return result;
	}

	private void setTabLivelli() throws SqlQueryException, SQLException {

		String sql = new String("Select * from VIEW_CC_BISOGNI_RICOVERO where IDEN_VISITA=?");
		PreparedStatement ps = fDB.getConnectData().prepareStatement(sql);
		ps.setInt(1, Integer.valueOf(iden_visita));
		ResultSet rs = ps.executeQuery();

		/*String sql = new String("Select * from VIEW_CC_BISOGNI_RICOVERO where IDEN_VISITA="+iden_visita);
		 ResultSet rs = this.fDB.openRs(sql);*/
		while (rs.next()) {
			this.tabLivelli.put(rs.getInt("IDEN_BISOGNO"), rs.getString("CLASSE_ASSISTENZA"));
		}
		this.fDB.close(rs);
	}

	/**
	 * createTabBisogni
	 *
	 * @return String
	 */
	private String createTabBisogni() throws SqlQueryException, SQLException {

		classFormHtmlObject cForm = new classFormHtmlObject("formBisogni", "mainBisogni", "post", "_self");
		cForm.addAttribute("style", "margin:0px;padding:0px;");
		classTableHtmlObject cTable = new classTableHtmlObject("100%");
		//
		classRowDataTable cRow = new classRowDataTable();
		classColDataTable cCol = null;

		/*String sql = new String("Select * from VIEW_CC_BISOGNI_REPARTO where CODICE_REPARTO='"+this.reparto+"'");
		 ResultSet rs =  this.fDB.openRs(sql);
		 */
		String sql = new String("Select * from VIEW_CC_BISOGNI_REPARTO where CODICE_REPARTO=?");
		PreparedStatement ps = fDB.getConnectData().prepareStatement(sql);
		ps.setString(1, reparto);
		ResultSet rs = ps.executeQuery();

		while (rs.next()) {

			cCol = new classColDataTable("", "", "");
			cCol.addAttribute("style", "text-align:center");
			cCol.addAttribute("title", rs.getString("DESCRIZIONE"));
			if (this.tabLivelli.containsKey(rs.getInt("IDEN_BISOGNO"))) {
				cCol.addAttribute("class", this.tabLivelli.get(rs.getInt("IDEN_BISOGNO")));
			} else {
				cCol.addAttribute("class", "tdLivello");
			}

			cCol.addEvent("onClick", "javascript:registra('" + rs.getString("IDEN_BISOGNO") + "');apriScheda('" + rs.getString("FUNZIONE") + "');");
			cCol.appendSome(rs.getString("INTESTAZIONE"));

			cRow.addCol(cCol);
		}
		this.fDB.close(rs);
		if (cCol == null) {
			cCol = new classColDataTable("", "", "Nessun bisogno assistenziale associato al reparto di ricovero");
			cRow.addCol(cCol);
		}
		cTable.appendSome(cRow.toString());
		cForm.appendSome(cTable);

		cForm.appendSome(new classInputHtmlObject("hidden", "action", ""));
		cForm.appendSome(new classInputHtmlObject("hidden", "id2save", ""));
		cForm.appendSome(new classInputHtmlObject("hidden", "reparto", this.reparto));
		cForm.appendSome(new classInputHtmlObject("hidden", "iden_visita", this.iden_visita));

		return cForm.toString();
	}

	private String readDati() throws SQLException, SqlQueryException {
		String result = new String("");
		this.iden_visita = this.cParam.getParam("iden_visita").trim();
		this.reparto = this.cParam.getParam("reparto").trim();
		this.funzione = this.cParam.getParam("funzione").trim();
		this.action = this.cParam.getParam("action").trim();

		if (chkNull(this.action).equals("save")) {
			this.id2save = this.cParam.getParam("id2save").trim();
			result = this.salvaBisogni();
		} else {

		}
		this.setTabLivelli();

		return result;
	}

	/**
	 * salvaBisogni
	 */
	private String salvaBisogni() throws SQLException, SqlQueryException {

		CallableStatement CS = fDB.getConnectData().prepareCall(
				"{call CC_SALVABISOGNI (?,?,?)}");

		CS.setInt(1, Integer.valueOf(iden_visita));
		CS.setInt(2, Integer.valueOf(id2save));
		CS.registerOutParameter(3, Types.VARCHAR);
		CS.execute();
		String outParam = new String("");
		if (!CS.getString(3).equals("Salvataggio completato")) {
			outParam += "<SCRIPT>\nalert('" + CS.getString(3) + "');\n</SCRIPT>\n";
		}

		CS.close();
		return outParam;
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

}
