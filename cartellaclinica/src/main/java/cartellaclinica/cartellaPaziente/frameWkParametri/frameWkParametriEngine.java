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
 Autore: Fra
 */
package cartellaclinica.cartellaPaziente.frameWkParametri;

import generic.statements.StatementFromFile;
import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classImgHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

public class frameWkParametriEngine extends functionObj {

	private functionDB fDB = null;

	private String idenAnag, reparto, offset,iden_ricovero;

	public frameWkParametriEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
	}

	public frameWkParametriEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();
		//classTabHeaderFooter HeadSection = null;
		classTableHtmlObject cTable = new classTableHtmlObject("100%");
		cTable.addAttribute("class", "classDataTable");
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		classImgHtmlObject cImg = null;

		try {

			this.readDati();

			cDoc.appendHead(this.createHead());

			cRow = new classRowDataTable();
			cCol = new classColDataTable("TH", "50%", "Rilevazioni in data odierna");
			// 
			cRow.addCol(cCol);
			cCol = new classColDataTable("TH", "20%", "Valore");
			cRow.addCol(cCol);
			cCol = new classColDataTable("TH", "20%", "Data e Ora");
			cRow.addCol(cCol);
			cCol = new classColDataTable("TH", "5%", "");
			cRow.addCol(cCol);
			cCol = new classColDataTable("TH", "5%", "");
			cRow.addCol(cCol);
			cTable.appendSome(cRow.toString());
			cRow = null; //svuoto la row per controllare se ci sono o meno record
			classDivHtmlObject cDiv = new classDivHtmlObject("fixme");
			cDiv.appendSome(cTable);

			cBody.addElement(cDiv.toString());

			cTable = new classTableHtmlObject("100%");
			cTable.addAttribute("class", "classDataTable");

			StatementFromFile stf = new StatementFromFile(hSessione);
			ResultSet rs = stf.executeQuery("parametri.xml", "getUltimiParametriRilevati", new String[]{idenAnag,iden_ricovero, reparto, "" });
			while (rs.next()) {
				cRow = new classRowDataTable();
				//cRow.addAttribute("onClick","javascipt:apriRiepilogoParametro('"+idenAnag+"','"+rs.getString("IDEN_PARAMETRO")+"','24')");
				cCol = new classColDataTable("", "50%", rs.getString("DESCRIZIONE"));
				cRow.addCol(cCol);
				cCol = new classColDataTable("", "20%", rs.getString("VALORE"));
				cRow.addCol(cCol);
				cCol = new classColDataTable("", "20%", rs.getString("ORARIO"));
				cRow.addCol(cCol);

				cImg = new classImgHtmlObject("imagexPix/button/mini/btLista18.png", "Apri lista", 0);
				cImg.addEvent("onClick", "apriRiepilogoParametro('" + idenAnag + "','" + rs.getString("IDEN_PARAMETRO") + "','" + offset + "');");
				cImg.addAttribute("style", "cursor:hand;");

				cCol = new classColDataTable("", "5%", cImg);
				cRow.addCol(cCol);

				cImg = new classImgHtmlObject("imagexPix/button/mini/btGraph.gif", "Mostra grafico", 0);
				cImg.addEvent("onClick", "apriGrafico(" + idenAnag + "," + rs.getString("IDEN_PARAMETRO") + ",'" + reparto + "');");
				cImg.addAttribute("style", "cursor:hand;");

				cCol = new classColDataTable("", "5%", cImg);
				cRow.addCol(cCol);
				cTable.appendSome(cRow.toString());
			}
			stf.close();

			if (cRow == null) {
				cRow = new classRowDataTable();
				cCol = new classColDataTable("", "", "Nessun parametro registrato");
				cCol.addAttribute("colSpan", "2");
				cRow.addCol(cCol);
				cTable.appendSome(cRow.toString());
			}

			cBody.addElement(cTable.toString());

			cDoc.setBody(cBody);
			sOut = cDoc.toString();
		} catch (Exception e) {
			sOut = e.getMessage();
		}

		return sOut;
	}

	private void readDati() throws SQLException, SqlQueryException {
		this.idenAnag = this.cParam.getParam("iden_anag").trim();
		this.reparto = this.cParam.getParam("reparto").trim();
		this.iden_ricovero = this.cParam.getParam("iden_ricovero").trim();
		this.offset = this.cParam.getParam("offset").equals("") ? "48" : this.cParam.getParam("offset");
	}

	private classHeadHtmlObject createHead() throws SQLException, SqlQueryException, Exception {
		return HeaderUtils.createHeadWithIncludes(this.getClass().getName(), hSessione);
	}

}
