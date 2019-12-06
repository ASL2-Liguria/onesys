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
package unisys.login;

import imago.crypto.CryptPasswordInterface;
import imago.sql.SqlQueryException;
import imago.sql.dbConnections;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import oracle.jdbc.OraclePreparedStatement;
import unisys.baseObj.UniSysConfig;

public class PostAuthenticationSiss extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final String CONTENT_TYPE = "text/plain";

	private ServletContext sContext = null;

	private UniSysConfig config = null;

	private String webuser = null;

	private String psw = null;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		this.sContext = config.getServletContext();
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter out = response.getWriter();

		response.setContentType(CONTENT_TYPE);

		if (!request.getParameterMap().containsKey("codFisc")) {
			out.println("KO$Errore in lettura dati da SmartCard");
			out.close();

			return;
		}

		String codFisc = request.getParameter("codFisc");

		try {
			this.leggiParam();
			this.getUserPswSmartCard(codFisc);
		} catch (Exception ex) {
			out.println(ex.getMessage());
			out.close();
			return;
		}

	}

	// Process the HTTP Post request
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	// Clean up resources
	public void destroy() {
	}

	private void getUserPswSmartCard(String codFisc) throws Exception {
		dbConnections dbConns = new dbConnections();
		Connection conn = null;
		String query = new String("");
		ResultSet rs = null;
		boolean ok = false;

		try {
			conn = dbConns.getWebConnection();

			query = "select WEBUSER,WEBPASSWORD from " + this.config.getParametro("TAB_WEB") + " where COD_FISC=:pCodFisc";
			OraclePreparedStatement ps = (OraclePreparedStatement) conn.prepareStatement(query);

			ps.setStringAtName("pCodFisc", codFisc);

			rs = ps.executeQuery();
			ok = rs.next();

			if (ok) {
				this.webuser = rs.getString("WEBUSER");
				this.psw = rs.getString("WEBPASSWORD");
			}

		} catch (SqlQueryException e) {
			e.printStackTrace();
			throw new Exception("KO$Errore in lettura dati da SmartCard");
		} finally {
			try {
				if (rs != null && !rs.isClosed())
					rs.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			rs = null;
			conn = null;
		}

		if (ok) {
			this.psw = decryptPassword(this.sContext, this.psw);

			throw new Exception("OK$" + this.webuser + "#" + this.psw);
		} else {
			throw new Exception("KO$Codice Fiscale Non presente");
		}
	}

	/**
	 * Carica i parametri letti dalla tabella di configurazione (GES_CONFIG_PAGE
	 * o PARAMETRI_PAGE)
	 */
	private void leggiParam() {
		Connection confConn = null;
		// toolKitUtility tool = new toolKitUtility();

		// tool.init(this.sContext, null);

		try {
			confConn = new dbConnections().getWebConnection();
			this.config = new UniSysConfig(UniSysConfig.GRUPPO_LOGIN);
		} catch (SqlQueryException e2) {
		}

		finally {
			try {
				if (confConn != null)
					confConn.close();
			} catch (Exception ex) {
			}
		}
	}

	private String decryptPassword(ServletContext context, String psw) {
		String output = null;
		CryptPasswordInterface iCrypto = null;
		Class<?> cCrypto;

		try {
			cCrypto = Class.forName(context.getInitParameter("CryptType"));

			iCrypto = (CryptPasswordInterface) cCrypto.newInstance();

			output = iCrypto.deCrypt(psw.getBytes());
		} catch (java.lang.Exception e) {
			e.printStackTrace();
		}

		return output;
	}

}
