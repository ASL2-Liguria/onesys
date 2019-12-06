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
package cartellaclinica.gestioneProblemi.albero;

import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classIFrameHtmlObject;
import imago.http.classRowDataTable;
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

public class alberoEngine extends functionObj {

	private functionDB fDB = null;
	private functionStr fStr = null;

	private String tipo = new String("");
	private String valore = new String("");

	public alberoEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
		fStr = new functionStr();
	}

	public alberoEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();
		classIFrameHtmlObject cFrame = null;
		classTableHtmlObject cTable = null;
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		classDivHtmlObject cDiv = null;

		try {

			this.readDati();

			cDoc.appendHead(this.createHead());

			String tipo2open = new String("");

			cTable = new classTableHtmlObject("100%");
			cTable.addAttribute("cellspacing", "0");
			cTable.addAttribute("id", "oTable");

			String sql = "Select * from VIEW_ICD_" + tipo + " ";
			if (!valore.equals("")) {
				sql += "where COD_PARENT='" + valore + "'";
			}
			ResultSet rs = fDB.openRs(sql);

			if (tipo.equals("SETTORI")) {
				tipo2open = "GRUPPI";
			} else if (tipo.equals("GRUPPI")) {
				tipo2open = "SOTTOGRUPPI";
			} else if (tipo.equals("SOTTOGRUPPI")) {
				tipo2open = "DESCRIZIONI";
			}

			if (tipo.equals("SOTTOGRUPPI")) {
				if (!rs.next()) {
					sql = "Select * from VIEW_ICD_DESCRIZIONI where COD_PARENT='" + valore + "' ";
					rs = fDB.openRs(sql);
					tipo2open = "";
					tipo = "DESCRIZIONI";
				} else {
					rs = fDB.openRs(sql);
				}
			}
			while (rs.next()) {
				cRow = new classRowDataTable();
				cCol = new classColDataTable("", "", "");
				cCol.addAttribute("style", "padding-left:10px");

				cDiv = new classDivHtmlObject("", "", rs.getString("COD") + " - " + rs.getString("DESCR"));

				cDiv.addAttribute("class", "ramoChiuso");
				if (tipo.equals("DESCRIZIONI")) {
					cDiv.addAttribute("onClick", "javascript:setProblema(this)");
					cDiv.addAttribute("id", rs.getString("IDEN_ICD"));
				} else {
					cDiv.addAttribute("onClick", "javascript:apriRamo(this)");
					cDiv.addAttribute("id", rs.getString("COD"));
				}

				cDiv.addAttribute("tipo2open", tipo2open);

				cCol.appendSome(cDiv);

				cFrame = new classIFrameHtmlObject("");
				cFrame.addAttribute("style", "display:none;width:100%");
				cFrame.addAttribute("id", "frame" + rs.getString("COD"));
				cFrame.addAttribute("frameBorder", "1");
				cDiv = new classDivHtmlObject("", "", cFrame);
				cCol.appendSome(cDiv);

				cRow.addCol(cCol);

				cTable.appendSome(cRow.toString());
			}
			fDB.close(rs);

			cBody.addElement(cTable.toString());

			String bottomJs = new String("<script>setAltezza();</script>\n");

			cBody.addElement(bottomJs);

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

		this.tipo = this.cParam.getParam("tipo").trim();
		this.valore = this.cParam.getParam("valore").trim();

	}

	private classHeadHtmlObject createHead() throws SQLException, SqlQueryException, Exception {
		return HeaderUtils.createHeadWithIncludes(this.getClass().getName(), hSessione);
	}

}
