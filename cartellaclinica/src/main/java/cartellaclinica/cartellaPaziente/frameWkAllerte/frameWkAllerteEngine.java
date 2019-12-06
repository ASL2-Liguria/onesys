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
package cartellaclinica.cartellaPaziente.frameWkAllerte;

import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classHeadHtmlObject;
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

public class frameWkAllerteEngine extends functionObj {

	private functionDB fDB = null;

	private String iden_anag = new String("");

	public frameWkAllerteEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
	}

	public frameWkAllerteEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();
		cBody.addAttribute("onClick", "javascript:parent.apriProblemiAllerte();");
		classTableHtmlObject cTable = new classTableHtmlObject("100%");
		cTable.addAttribute("class", "classDataTable");
		classRowDataTable cRow = null;
		classColDataTable cCol = null;

		try {

			this.readDati();

			cDoc.appendHead(this.createHead());

			cRow = new classRowDataTable();

			cRow.addCol(new classColDataTable("TH", "10%", "TIPO"));
			cRow.addCol(new classColDataTable("TH", "50%", "DESCRIZIONE"));
			cRow.addCol(new classColDataTable("TH", "20%", "SINTOMI"));
			cRow.addCol(new classColDataTable("TH", "20%", "TIPOLOGIA"));

			cTable.appendSome(cRow.toString());
			cRow = null;
			classDivHtmlObject cDiv = new classDivHtmlObject("fixme");
			cDiv.appendSome(cTable);

			cBody.addElement(cDiv.toString());

			cTable = new classTableHtmlObject("100%");
			cTable.addAttribute("class", "classDataTable");

			String sql = new String("Select TIPO,DESCRIZIONE,SINTOMI,TIPOLOGIA from VIEW_CC_ALLERTE_RICOVERO where IDEN_ANAG=? and SUPERATO='N' ");
			PreparedStatement ps = fDB.getConnectData().prepareCall(sql);
			ps.setInt(1, Integer.valueOf(iden_anag));

			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				cRow = new classRowDataTable();
				cRow.addCol(new classColDataTable("", "10%", chkNull(rs.getString("TIPO"))));
				cCol = new classColDataTable("", "50%", chkNull(rs.getString("DESCRIZIONE")));
				cCol.addAttribute("title", chkNull(rs.getString("DESCRIZIONE")));
				cRow.addCol(cCol);
				cRow.addCol(new classColDataTable("", "20%", chkNull(rs.getString("SINTOMI"))));
				cRow.addCol(new classColDataTable("", "20%", chkNull(rs.getString("TIPOLOGIA"))));
				cTable.appendSome(cRow.toString());
			}
			fDB.close(rs);
			if (cRow == null) {
				cRow = new classRowDataTable();
				cCol = new classColDataTable("", "", "Non e' stata indicata alcuna allerta per il ricovero selezionato");
				cCol.addAttribute("colSpan", "3");
				cRow.addCol(cCol);
				cTable.appendSome(cRow.toString());
			}

			cBody.addElement(cTable.toString());

			cDoc.setBody(cBody);
			sOut = cDoc.toString();
		} catch (Exception ex) {
			sOut = ex.getMessage();
		}

		return sOut;
	}

	private void readDati() throws SQLException, SqlQueryException {
		this.iden_anag = this.cParam.getParam("iden_anag").trim();
	}

	private classHeadHtmlObject createHead() throws SQLException, SqlQueryException, Exception {
		return HeaderUtils.createHeadWithIncludes(this.getClass().getName(), hSessione);
	}

	private String chkNull(String input) {
		return (input == null ? "" : input);
	}

}
