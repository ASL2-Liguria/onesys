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
 * SERVLETreadFromDB.java
 *
 * Created on 19 luglio 2006, 11.06
 */

package Scanner;

import imago.a_sql.CLogError;
import imago.http.baseClass.baseUser;
import imago.lang.atr;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;

import core.Global;
import ACR.DecodificaPwd;


/**
 * 
 * @author fabioc
 */
public class ServleTReadDocument extends HttpServlet {

	private ServletConfig sConfig = null;

	private ServletContext myContext = null;
	
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		sConfig = config;
		myContext = sConfig.getServletContext();

	}

	protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		HttpSession mySession = null;
		ServleTReadDocumentEng MYSERVLETread = null;
		ServletOutputStream servletoutputstream = null;
		byte[] arrayInput = null;
		CLogError log = null;
		baseUser logged_user = null;
		String Login = "";
		Connection Web_Conn = null;
		mySession = request.getSession(false);// .getSession(false);
		if (mySession == null) {
			try {
				mySession = request.getSession(true);
                mySession.setAttribute("session-creator", this.getClass().getName()+".class");
				String utente = (String) request.getParameter("utente");
				imago.sql.dbConnections myConnections = new imago.sql.dbConnections();
				// gli passo i driver per la connessione
				myConnections.setDrivers((String) myContext.getInitParameter("DbDriver"));
				// gli passo i dati per la connesione a Imagoweb

				DecodificaPwd dec = new DecodificaPwd();
				String pwdWeb = dec.decodificaPwd(myContext, myContext.getInitParameter("WebPwd"));
				myConnections.setWEBConnectionParams(myContext.getInitParameter("WebUser"), pwdWeb, myContext.getInitParameter("ConnectionString"));
				// gli passo i dati per la connessione a Radsql
				String pwd = dec.decodificaPwd(myContext, myContext.getInitParameter("DataPwd"));
				myConnections.setDATAConnectionParams(myContext.getInitParameter("DataUser"), pwd, myContext.getInitParameter("ConnectionString"));
				// creo le connesioni
				myConnections.makeConnections();
				// creo utente
				logged_user = new baseUser(utente, myConnections);
				Global.setUser(mySession, logged_user);

			} catch (Exception e) {
			}
		} else {
			try {
				logged_user = core.Global.getUser(mySession);
				Web_Conn = logged_user.db.getWebConnection();
				Login = logged_user.login;
			} catch (Exception e) {
			}
		}
		try {
			log = new CLogError(Web_Conn, request, "SERVLETreadFromDB", Login);
			log.setFileName("SERVLETreadFromDB.java");
			log.setClassName("src.Sel_Stampa.SERVLETreadFromDB");

			servletoutputstream = response.getOutputStream();

		}

		catch (java.lang.Exception ex) {
			log.writeLog("Impossibile trovare il response della Servlet", CLogError.LOG_ERROR);
		}

		try {

			// System.out.println("Lettura PDF da Database");
			MYSERVLETread = new ServleTReadDocumentEng(mySession, myContext, request);
			byte[] myPdf = null;
			myPdf = MYSERVLETread.LeggiDBCreaServlet();
			if (myPdf == null) {
				String Errore = "JVBERi0xLjMNCjMgMCBvYmoNCjw8DQovUHJvZHVjZXIgKFBERlhDIExpYnJhcnkgXCh2ZXJzaW9uIDIuNVwpLikNCi9PU0luZm8gKHZpczogMTQ4OyB2ZXI6IDUuMTsgYm46IDAwMDAwYTI4OyBwbGF0ZjogMjsgQ0RTOiBTZXJ2aWNlIFBhY2sgMikNCi9DcmVhdGlvbkRhdGUgKEQ6MjAwNjA3MjAxMDAxNDArMDEnMDAnKQ0KPj4NCmVuZG9iag0KNCAwIG9iag0KPDwNCi9UeXBlIC9Gb250RGVzY3JpcHRvcg0KL0ZvbnROYW1lIC9DYWxpYnJpDQovRmxhZ3MgMzINCi9Gb250QkJveCBbLTQ3NiAtMTk0IDEyMTQgOTUyXQ0KL01pc3NpbmdXaWR0aCAyMjYNCi9TdGVtSCA4NQ0KL1N0ZW1WIDg1DQovSXRhbGljQW5nbGUgMA0KL0NhcEhlaWdodCA2MzgNCi9YSGVpZ2h0IDQ3MA0KL0FzY2VudCA5NTINCi9EZXNjZW50IC0yNjkNCi9MZWFkaW5nIDIyMQ0KL01heFdpZHRoIDEyODgNCi9BdmdXaWR0aCA1MDMNCj4+DQplbmRvYmoNCjUgMCBvYmoNCjw8DQovVHlwZSAvRm9udA0KL1N1YnR5cGUgL1RydWVUeXBlDQovQmFzZUZvbnQgL0NhbGlicmkNCi9GaXJzdENoYXIgMzINCi9MYXN0Q2hhciAxMjINCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nDQovRm9udERlc2NyaXB0b3IgNCAwIFINCi9XaWR0aHMgWyAyMjYgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMA0KMjUyIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwDQowIDAgMCAwIDAgMCAwIDQ4OCAwIDAgMCAwIDAgMCAwIDANCjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDANCjAgMCAwIDQ3OSAwIDQyMyA1MjUgNDk4IDAgMCAwIDIyOSAwIDAgMjI5IDANCjUyNSA1MjcgNTI1IDAgMzQ5IDAgMzM1IDAgMCAwIDAgMCAzOTVdPj4NCmVuZG9iag0KNiAwIG9iag0KPDwNCi9GaWx0ZXIgWy9GbGF0ZURlY29kZV0gL0xlbmd0aCAxNDgNCj4+DQpzdHJlYW0NCnjaRY49C8IwEIb3g/sPNyZDYpI2bbKKdXATsolDqVGEYDQIgr/eEAou98LD+3EvhG1AUHSrRyrjKSwIphuktp56XXWgsEPY7DX1jsIV4cSmUnKJ/EzhgCBqrtMtp5r7U5kbpfWehHXS/guMk2r0a8kjpjTTwj0rcf7eMxeuMuLasEtM1Pgzl7dcd6b65xHhBxR0J9dlbmRzdHJlYW0NCmVuZG9iag0KNyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDEgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDUgMCBSDQo+Pg0KL1Byb2NTZXQgWy9QREYgL1RleHRdDQo+Pg0KL01lZGlhQm94IFswIDAgNTk1LjIgODQxLjkxOV0NCi9Db250ZW50cyBbNiAwIFJdDQo+Pg0KZW5kb2JqDQoxIDAgb2JqDQo8PA0KL1R5cGUgL1BhZ2VzDQovQ291bnQgMQ0KL0tpZHMgWw0KNyAwIFINCl0NCj4+DQplbmRvYmoNCjIgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL1BhZ2VzIDEgMCBSDQo+Pg0KZW5kb2JqDQp4cmVmDQowIDgNCjAwMDAwMDAwMDAgNjU1MzUgZg0KMDAwMDAwMTI1MCAwMDAwMCBuDQowMDAwMDAxMzE4IDAwMDAwIG4NCjAwMDAwMDAwMTAgMDAwMDAgbg0KMDAwMDAwMDE5NSAwMDAwMCBuDQowMDAwMDAwNDY2IDAwMDAwIG4NCjAwMDAwMDA4NTIgMDAwMDAgbg0KMDAwMDAwMTA4MCAwMDAwMCBuDQp0cmFpbGVyDQo8PA0KL1NpemUgOA0KL0luZm8gMyAwIFINCi9Sb290IDIgMCBSDQovSUQgWzw3QTAzNzEwRjJGNDUxNTUyNjJCOEY2MkMyQ0E0N0Y4ND48N0EwMzcxMEYyRjQ1MTU1MjYyQjhGNjJDMkNBNDdGODQ+XQ0KPj4NCnN0YXJ0eHJlZg0KMTM3Mw0KJSVFT0YNCg==";
				byte[] filebyte = atr.toByteArray(Errore);
				arrayInput = Base64.decodeBase64(filebyte);

			} else {
				if (myContext.getInitParameter("EncodingTypePdfInDb").equals("BINARY")) {
					arrayInput = (myPdf);
				} else {
					arrayInput = Base64.decodeBase64(myPdf);
				}
			}

			servletoutputstream.write(arrayInput);
			servletoutputstream.flush();

		} catch (Exception ex) {
			log.writeLog("Sul database non è presente il pdf ne in base 64 ne in binario", CLogError.LOG_ERROR);
			ex.printStackTrace();

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
