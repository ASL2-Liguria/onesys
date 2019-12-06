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
package cartellaclinica.cartellaPaziente.frameWkBisogni;

import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

public class frameWkBisogniEngine extends functionObj {

	private functionDB fDB = null;
	private functionStr fStr = null;

	private String idenVisita = new String("");

	public frameWkBisogniEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
		fStr = new functionStr();
	}

	public frameWkBisogniEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();
		//cBody.addAttribute("onClick","javascript:parent.apriBisogniAssistenziali();");
		cBody.addAttribute("style", "cursor:hand;");
		//classTabHeaderFooter HeadSection = null;
		classTableHtmlObject cTable = new classTableHtmlObject("100%");
		cTable.addAttribute("class", "classDataTable");
		classRowDataTable cRow = null;
		classColDataTable cCol = null;

		try {

			this.readDati();

			cDoc.appendHead(this.createHead());

			cRow = new classRowDataTable();
			cCol = new classColDataTable("TH", "", "BISOGNO");
			cRow.addCol(cCol);
			cCol = new classColDataTable("TH", "", "LIV. ASSISTENZA");
			cRow.addCol(cCol);
			cCol = new classColDataTable("TH", "", "ATTIVITA");
			cRow.addCol(cCol);
			cTable.appendSome(cRow.toString());
			cRow = null;
			classDivHtmlObject cDiv = new classDivHtmlObject("fixme");
			cDiv.appendSome(cTable);

			cBody.addElement(cDiv.toString());

			cTable = new classTableHtmlObject("100%");
			cTable.addAttribute("class", "classDataTable");

			String sql = new String("Select FUNZIONE,BISOGNO,LIVELLO_ASSISTENZA,N_ATTIVITA from VIEW_CC_BISOGNI_RICOVERO where IDEN_VISITA=?");
			PreparedStatement ps = fDB.getConnectData().prepareStatement(sql);
			ps.setInt(1, Integer.valueOf(idenVisita));
			ResultSet rs = ps.executeQuery();

			/*      String sql = new String("Select * from VIEW_CC_BISOGNI_RICOVERO where IDEN_VISITA="+idenVisita);
			 ResultSet rs = fDB.openRs(sql);*/
			while (rs.next()) {
				cRow = new classRowDataTable();
				cRow.addAttribute("onClick", "parent.apriBisogno('" + rs.getString("FUNZIONE") + "');");
				cCol = new classColDataTable("", "", rs.getString("BISOGNO"));
				cRow.addCol(cCol);
				cCol = new classColDataTable("", "", rs.getString("LIVELLO_ASSISTENZA"));
				cRow.addCol(cCol);
				cCol = new classColDataTable("", "", rs.getString("N_ATTIVITA"));
				cRow.addCol(cCol);
				cTable.appendSome(cRow.toString());
			}
			fDB.close(rs);

			if (cRow == null) {
				cRow = new classRowDataTable();
				cCol = new classColDataTable("", "", "Non e' stata compilata nessuna scheda dei bisogni assistenziali per il ricovero selezionato");
				cCol.addAttribute("colSpan", "3");
				cRow.addCol(cCol);
				cTable.appendSome(cRow.toString());
			}

			cBody.addElement(cTable.toString());

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

	private void readDati() throws SQLException, SqlQueryException {
		this.idenVisita = this.cParam.getParam("idenVisita").trim();
	}

	private classHeadHtmlObject createHead() throws SQLException, SqlQueryException, Exception {
		return HeaderUtils.createHeadWithIncludes(this.getClass().getName(), hSessione);
	}
}
