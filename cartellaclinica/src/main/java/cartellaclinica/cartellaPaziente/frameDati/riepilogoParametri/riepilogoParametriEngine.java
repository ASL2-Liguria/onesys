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
package cartellaclinica.cartellaPaziente.frameDati.riepilogoParametri;

import generic.statements.StatementFromFile;
import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classRowDataTable;
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

public class riepilogoParametriEngine extends functionObj {

	private functionDB fDB = null;
	private functionStr fStr = null;

	private String idParametro = new String("");
	private String idenAnag = new String("");
	private String offset = new String("");

	public riepilogoParametriEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
		fStr = new functionStr();
	}

	public riepilogoParametriEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();
		classTabHeaderFooter HeadSection = null;
		classTableHtmlObject cTable = new classTableHtmlObject("100%");
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		classDivHtmlObject cDiv = new classDivHtmlObject();
		cDiv.addAttribute("style", "width:100%;height:100%");
		cDiv.addEvent("onClick", "javascipt:self.close();");
		classDivHtmlObject cDivHeaderTable = new classDivHtmlObject();
		cDivHeaderTable.addAttribute("id", "fixme");
		classTableHtmlObject cHeaderTable = new classTableHtmlObject("100%");
		cHeaderTable.addAttribute("class", "classDataTable");

//    PreparedStatement ps = null;
		StatementFromFile sff = null;
		ResultSet rs = null;
		try {

			this.readDati();

			cDoc.appendHead(this.createHead());

			sff = new StatementFromFile(this.hSessione);
			rs = sff.executeQuery("parametri.xml", "getValoriUltimeNOre", new String[]{idenAnag, idParametro, offset});

			cRow = new classRowDataTable();
			cCol = new classColDataTable("", "", "Nessun dato presente nelle ultime " + offset + "h");
			cCol.addAttribute("class", "classTdLabelNoWidth");
			cRow.addCol(cCol);
			cTable.appendSome(cRow.toString());

			while (rs.next()) {
				if (HeadSection == null) {

					HeadSection = new classTabHeaderFooter(rs.getString("DESCRIZIONE") + " - Ultime " + offset + "h");
					cDivHeaderTable.appendSome(HeadSection.toString());

					cRow = new classRowDataTable();
					cCol = new classColDataTable("th", "20%", "VALORE");
					cRow.addCol(cCol);
					cCol = new classColDataTable("th", "30%", "DATA ORA");
					cRow.addCol(cCol);
					cCol = new classColDataTable("th", "30%", "UTENTE");
					cRow.addCol(cCol);
					cCol = new classColDataTable("th", "20%", "REPARTO");
					cRow.addCol(cCol);
					cHeaderTable.appendSome(cRow.toString());
					cDivHeaderTable.appendSome(cHeaderTable);
					cDiv.appendSome(cDivHeaderTable);

					cTable = new classTableHtmlObject("100%");
				}
				cRow = new classRowDataTable("");

				cCol = new classColDataTable("", "20%", rs.getString("VALORE"));
				cCol.addAttribute("class", rs.getString("CLASSE"));
				cRow.addCol(cCol);
				cCol = new classColDataTable("", "30%", rs.getString("DATA_ORA"));
				cCol.addAttribute("class", "classTdLabelNoWidth");
				cRow.addCol(cCol);
				cCol = new classColDataTable("", "30%", rs.getString("DESCR_UTE"));
				cCol.addAttribute("class", "classTdLabelNoWidth");
				cRow.addCol(cCol);
				cCol = new classColDataTable("", "20%", rs.getString("CODICE_REPARTO"));
				cCol.addAttribute("class", "classTdLabelNoWidth");
				cRow.addCol(cCol);

				cTable.appendSome(cRow.toString());
			}

			cDiv.appendSome(cTable);
			cBody.addElement(cDiv.toString());
			cDoc.setBody(cBody);
			sOut = cDoc.toString();
		} catch (Exception ex) {
			sOut = ex.getMessage();
		} finally {
			sff.close();
		}

		return sOut;
	}

	private void readDati() throws SQLException, SqlQueryException {

		this.idenAnag = this.cParam.getParam("idenAnag").trim();
		this.idParametro = this.cParam.getParam("idParametro").trim();
		this.offset = this.cParam.getParam("offset").trim();
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
