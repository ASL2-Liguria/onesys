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
package cartellaclinica.gestioneBckSchede;

import generic.utility.html.HeaderUtils;
import imago.http.classHeadHtmlObject;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

public class bckValuesEngine extends functionObj {

	private functionDB fDB = null;
	//private functionStr fStr = null;

	private String Query = new String("");
	private String title = new String("");

	public bckValuesEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
		//fStr = new functionStr();
	}

	public bckValuesEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();

		try {

			this.readDati();
			cDoc.appendHead(this.createHead());
			String sql = new String("select cc_get_bck_key_campo('" + Query + "','" + title + "') RES from dual");
			ResultSet rs = fDB.openRs(sql);
			if (rs.next()) {
				cBody.addElement(rs.getString("RES"));
			}
			fDB.close(rs);
			cBody.addAttribute("onClick", "javascript:self.close();");
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
		this.Query = this.cParam.getParam("Query").trim();
		this.title = this.cParam.getParam("title").trim();

	}

	private classHeadHtmlObject createHead() throws SQLException, SqlQueryException, Exception {
		return HeaderUtils.createHeadWithIncludes(this.getClass().getName(), hSessione);
	}
}
