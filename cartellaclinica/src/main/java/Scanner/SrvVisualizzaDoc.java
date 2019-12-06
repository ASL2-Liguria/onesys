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
package Scanner;

/*
 import imago.winbuild.CSessionError;
 import imagoAldoUtil.classEsame;
 import imago.http.*;
 import imago.http.baseClass.*;
 import imago.util.CVarContextSession;
 import java.io.*;
 import java.sql.*;
 */
import imago.a_sql.CLogError;

import imago.a_util.CContextParam;
import imago.http.classLabelHtmlObject;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseUser;
import imago.winbuild.CSessionError;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

//import matteos.stampe.*;

import javax.servlet.ServletOutputStream;
import java.sql.ResultSet;
import imago.sql.*;

import org.apache.commons.codec.binary.Base64;

public class SrvVisualizzaDoc extends HttpServlet {

	private ServletConfig sConfig = null;

	private ServletContext myContext = null;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		sConfig = config;
		myContext = sConfig.getServletContext();
	}

	protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		CContextParam myContextParam = null;
		HttpSession mySession = null;
		SrvVisualizzaEng Eng = null;
		CLogError log = null;
		baseUser logged_user = null;
		basePC infoPC = null;
		mySession = request.getSession(false);
		classLabelHtmlObject label = null;
		try {
			myContextParam = new CContextParam(this);
			logged_user = core.Global.getUser(mySession);
			log = new CLogError(logged_user.db.getWebConnection(), request, "SERVLETreadFromDB", logged_user.login);
			log.setFileName("SERVLETreadFromDB.java");
			log.setClassName("src.Sel_Stampa.SERVLETreadFromDB");
		} catch (Exception ex) {
			// System.out.println(ex);
		}
		log.writeInfo("Inizializzata Servlet ElabStampa");
		String iden = request.getParameter("iden");
		String Sql = "select mime_type from documenti_allegati where iden=" + iden;
		String m_type = "";

		TableResultSet myTable = null;
		myTable = new TableResultSet();

		ResultSet rs = null;
		try {

			rs = myTable.returnResultSet(logged_user.db.getDataConnection(), Sql);

			if (rs.next()) {
				m_type = rs.getString("mime_type").trim();

			}
		} catch (Exception E) {
			;
		}
		try {
			myTable.close();
		} catch (SqlQueryException ex2) {
		}
		if (m_type == null || m_type.equalsIgnoreCase("") || m_type.equalsIgnoreCase("application/pdf")) {
			PrintWriter out = response.getWriter();

			// System.out.println("Anteprima Stampa");
			if (mySession == null) {
				out.println(CSessionError.buildHTML());
				out.close();
				return;
			} else {
				try {
					// System.out.println("      Sessione Presente");
					infoPC = (basePC) mySession.getAttribute("parametri_pc");
					Eng = new SrvVisualizzaEng();
					out.println(Eng.creaDocumentoHtml(infoPC, logged_user, request, response, myContext).toString());

				} catch (Exception ex) {
					out.println(ex);
					log.writeLog("Errore generale creazione stampa" + ex.getMessage(), CLogError.LOG_DEBUG);
				}
			}
		} else {

			ServleTReadDocumentEng SrdE = new ServleTReadDocumentEng(mySession, myContext, request);

			ServletOutputStream out = response.getOutputStream();
			response.setContentType(m_type);
			try {

				out.write(Base64.decodeBase64(SrdE.LeggiDBCreaServlet()));
/*			} catch (ImagoStampeException ex1) {
			} catch (IOException ex1) {*/
			} catch (Exception e) {
			}
		}
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// System.out.println("doGet") ;
		processRequest(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// System.out.println("doPost") ;
		processRequest(request, response);
	}

	public void destroy() {

	}
}
