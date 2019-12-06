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
package cartellaclinica.cartellaPaziente.Visualizzatore.frameFiltriExt;

import generic.utility.html.HeaderUtils;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.html.standardHTML;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import plugin.getPoolConnection;

public class frameFiltriEngineExt extends functionObj {

	private functionObj fObj;
	private functionStr fStr;
	private functionDB fDB = null;
	ServletContext cContext;
	HttpServletRequest cRequest;
	private String idPaziente = new String("");
	private String nosologico = new String("");
	private String reparto = new String("");
	private String indiceColonna = new String("");
	private String sortType = new String("");
	private String descrCDC = new String("");
	private String daData = new String("");
	private String aData = new String("");
	private String hDoc = new String("");
	private String filtroDoc = new String("");
	String repartiUtente = "";
	String descrDoc = "";
	Connection conn;
	getPoolConnection myPoolConnection = null;

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(frameFiltriEngineExt.class);

	public frameFiltriEngineExt(ServletContext cont, HttpServletRequest req, HttpSession sess) {
		super(cont, req, sess);
		sess.setAttribute("session-creator", this.getClass().getName() + ".class");
		cContext = cont;
		cRequest = req;
		this.fObj = new functionObj(cont, req, sess);
		this.fStr = new functionStr();
		fDB = new functionDB(this);
	}

	public frameFiltriEngineExt(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(true));

	}

	public String gestione() {

		String sHtml = new String("");
		String sHtml2 = new String("");
		String cName = new String("");

		Object oDB = null;
		Object arg[] = null;
		Method cMet = null;
		Document cDoc = new Document();
		Body cBody = new Body();
		standardHTML sHTML = new standardHTML();
		classFormHtmlObject cForm = new classFormHtmlObject("filtri", "", "POST", "");
  //    cOpzioniHtmlInt      cInt    = new cOpzioniHtmlInt();

		cFiltriHtmlOptExt cOpt = new cFiltriHtmlOptExt();
		String sOut = new String("");

		try {

			readDati();

			cDoc.appendHead(this.createHead());

			cForm.appendSome(cOpt.draw(fObj, daData, aData));

			cBody.addElement(cForm.toString());

			cBody.addElement(sHTML.draw_form_calendar().toString());

			cBody.addElement("<script>\n" + sHtml + "\n</script>");

			cBody.addElement("<script>disabilitaTastoDx()</script>");

			cDoc.setBody(cBody);
			sOut = cDoc.toString();

		} catch (SQLException ex) {
			sOut = ex.getMessage();
		} catch (SqlQueryException ex) {
			sOut = ex.getMessage();
			logInterface.error(ex.getMessage(), ex);
		} catch (Exception ex) {
			sOut = ex.getMessage();
			logInterface.error(ex.getMessage(), ex);
		}

		return sOut;
	}

	private classHeadHtmlObject createHead() throws SqlQueryException, SQLException, Exception {
		return HeaderUtils.createHeadWithIncludesNoDefault(this.getClass().getName(), hSessione);
	}

	private void readDati() throws SQLException, SqlQueryException {

		this.idPaziente = this.cParam.getParam("idPatient").trim();
		this.nosologico = this.cParam.getParam("nosologico").trim();
		this.reparto = this.cParam.getParam("reparto").trim();
		this.indiceColonna = this.cParam.getParam("indiceColonna").trim();
		this.sortType = this.cParam.getParam("sortType").trim();
		this.daData = this.cParam.getParam("daData").trim();
		this.aData = this.cParam.getParam("aData").trim();
		this.hDoc = this.cParam.getParam("hDoc").trim();
		this.filtroDoc = this.cParam.getParam("filtroDoc").trim();
	}

}
