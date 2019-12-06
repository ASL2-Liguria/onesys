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
package cartellaclinica.cartellaPaziente.Visualizzatore.html.headerExt;

import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classIFrameHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLIHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTabHeaderFooter;
import imago.http.classTableHtmlObject;
import imago.http.classULHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import plugin.getPoolConnection;

public class headerEngineExt extends functionObj {

	private functionDB fDB = null;

	ServletContext cContext;

	HttpServletRequest cRequest;

	Hashtable<Integer, Hashtable> hashColonne = new Hashtable<Integer, Hashtable>();

	/**
	 * Contiene i parametri di configurazione provenienti da applicativo
	 * intestazione ordine larghezza in % metodo da chiamare per reperire il
	 * dato parametri del metodo intervallati da §
	 */
	ArrayList<String> ArJoin;

	Hashtable<String, String> hashRequest = new Hashtable<String, String>();

	/**
	 * contiene i parametri generici dataIni dataFine URN documento DocStatus
	 * DocType User repartoProduttore riferito al documento repartoUtente per la
	 * configurazione
	 */
	Hashtable<String, String> hashMetadatiRichiesti = new Hashtable<String, String>();

	/**
	 * contiene le coppie name§value per filtrare i documenti
	 */
	String daData = "";

	String aData = "";

	String nosologicoConf = "";

	String repartoConf = "";

	String traceUser = "";

	baseGlobal infoGlobal = null;

	Hashtable<String, String> parametriIn = new Hashtable<String, String>();

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(headerEngineExt.class);

	Connection conn;

	getPoolConnection myPoolConnection = null;

	public headerEngineExt(ServletContext cont, HttpServletRequest req, HttpSession sess) {

		// super(cont, req, sess);
		// fDB = new functionDB(this);
		cContext = cont;
		cRequest = req;

	}

	public headerEngineExt(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));

	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();
		classFormHtmlObject cForm = null;
		classFormHtmlObject cFormFiltri = null;
		classTabHeaderFooter HeadSection = null;
		classTableHtmlObject cTable = null;
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		classInputHtmlObject cInput = null;
		classIFrameHtmlObject cFrame = null;
		classDivHtmlObject cDiv = null;
		classULHtmlObject cUL = null;
		classLIHtmlObject cLI = null;

		try {

			cDoc.appendHead(this.createHead());

			cForm = new classFormHtmlObject("formRequest", "listDocumentExt", "POST", "frameList");
			cForm.addAttribute("style", "margin: 0px; padding: 0px;");

			cFormFiltri = new classFormHtmlObject("formFiltri", "frameFiltriExt", "POST", "frameFiltri");
			cFormFiltri.addAttribute("style", "margin: 0px; padding: 0px;");

			String key;
			String value;
			String repartoIn = cRequest.getParameter("reparto");
			Enumeration en = cRequest.getParameterNames();
			configuraData(repartoIn);

			while (en.hasMoreElements()) {
				key = (String) en.nextElement();
				value = (String) cRequest.getParameter(key);

				cInput = new classInputHtmlObject("hidden", key, value);
				cInput.addAttribute("valore_iniziale", value);
				cForm.appendSome(cInput);

			}

			// mi salvo l'impostazione traceuser che mi dice se tracciare le
			// azioni dell'utente
			cInput = new classInputHtmlObject("hidden", "traceUser", "");
			cInput.addAttribute("valore_iniziale", traceUser);
			cForm.appendSome(cInput);

			cInput = new classInputHtmlObject("hidden", "daData", daData);
			cInput.addAttribute("valore_iniziale", daData);
			cForm.appendSome(cInput);
			cFormFiltri.appendSome(cInput);

			cInput = new classInputHtmlObject("hidden", "aData", aData);
			cInput.addAttribute("valore_iniziale", aData);
			cForm.appendSome(cInput);
			cFormFiltri.appendSome(cInput);

			/*
			 * cUL = new classULHtmlObject(); cUL.addAttribute("id", "nav"); cLI
			 * = new classLIHtmlObject(false);
			 * 
			 * cLI.appendSome(
			 * "<a id='aggiorna' href='javascript:parent.aggiornaListaExt();'>Visualizza documenti</a>"
			 * ); cUL.appendSome(cLI);
			 * 
			 * cLI = new classLIHtmlObject(false); cLI.appendSome(
			 * "<a id='chiudi_pagina' href='javascript:ChiudiPagina();'>Chiudi</a>"
			 * ); cUL.appendSome(cLI);
			 * 
			 * cBody.addElement(cUL.toString());
			 * 
			 * 
			 * 
			 * cDiv = new classDivHtmlObject("divAnag");
			 * cDiv.appendSome("<h3></h3>"); cBody.addElement(cDiv.toString());
			 */

			cDiv = new classDivHtmlObject("divAnag");
			cDiv.appendSome("<h3></h3>");
			cBody.addElement(cDiv.toString());

			cUL = new classULHtmlObject();
			cUL.addAttribute("id", "nav");
			cLI = new classLIHtmlObject(false);
			cLI.appendSome("<a id='aggiorna' href='javascript:parent.aggiornaListaExt();'>Visualizza documenti</a>");
			cUL.appendSome(cLI);
			cLI = new classLIHtmlObject(false);
			cLI.appendSome("<a id='chiudiPagina' href='javascript:ChiudiPagina();'>Chiudi</a>");
			cUL.appendSome(cLI);
			cLI = new classLIHtmlObject(false);
			cLI.appendSome("<a id='chiudiDoc' href='javascript:chiudiDocumentoExt();'>Chiudi documento</a>");
			cUL.appendSome(cLI);

			cDiv = new classDivHtmlObject("divMenu");
			cDiv.appendSome(cUL.toString());
			cBody.addElement(cDiv.toString());

			cBody.addElement("<SCRIPT>document.all.chiudiDoc.style.display='none';</SCRIPT>");

			cFrame = new classIFrameHtmlObject();
			cFrame.addAttribute("width", "100%");
			// cFrame.addAttribute("height","90px");
			cFrame.addAttribute("height", "35px");
			cFrame.addAttribute("name", "frameFiltri");
			cFrame.addAttribute("scrolling ", "no");
			cBody.addElement(cFrame.toString());

			cBody.addElement(cFormFiltri.toString());
			cBody.addElement("<SCRIPT>document.formFiltri.submit();</SCRIPT>");

			cFrame = new classIFrameHtmlObject();
			cFrame.addAttribute("width", "100%");
			// cFrame.addAttribute("height","500px");
			cFrame.addAttribute("height", "100%");
			cFrame.addAttribute("name", "frameList");
			cFrame.addAttribute("scrolling ", "no");
			cBody.addElement(cFrame.toString());

			cFrame = new classIFrameHtmlObject();
			cFrame.addAttribute("width", "100%");
			// cFrame.addAttribute("height","802px");
			cFrame.addAttribute("height", "100%");
			cFrame.addAttribute("name", "frameDocument");
			cFrame.addAttribute("scrolling ", "no");
			cBody.addElement(cFrame.toString());

			cBody.addElement(cForm.toString());

			cBody.addElement("<SCRIPT>document.all.frameDocument.style.display='none';</SCRIPT>");

			if (cRequest.getParameter("filtriAggiuntivi") != null && cRequest.getParameter("filtriAggiuntivi").contains("identificativoEsterno")) {
				cBody.addElement("<SCRIPT>document.all.frameFiltri.style.display='none';</SCRIPT>");
			}

			// test
			cBody.addElement("<SCRIPT>document.formRequest.submit();</SCRIPT>");

			cBody.addElement("<script>disabilitaTastoDx()</script>");

			// //////////
			cDoc.setBody(cBody);
			sOut = cDoc.toString();
		} catch (SqlQueryException ex) {
			sOut = ex.getMessage();
			logInterface.error(ex.getMessage(), ex);
		} catch (SQLException ex) {
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

	public void configuraData(String repartoIn) throws SqlQueryException, SQLException {

		String sql;
		ResultSet rs = null;
		Statement stm = null;

		// traceUser=chkNull(caricaParametri("","","","VISUALIZZATORE_TRACE_USER"));
		traceUser = "N";
		
		if (repartoIn == null)
			repartoIn = "";

		String giorniIn = chkNull(caricaParametri("", "", repartoIn, "VISUALIZZATORE_GIORNI"));

		if (giorniIn != null && !giorniIn.equalsIgnoreCase("")) {
			rs = null;
			sql = "select to_char(sysdate,'yyyymmdd') as data_odierna,to_char(sysdate-" + giorniIn + ",'yyyymmdd') as data_conf from dual";

			try {
				myPoolConnection = new getPoolConnection(cContext.getInitParameter("PoolName"), cContext.getInitParameter("WebUser"), cContext.getInitParameter("WebPwd"), cContext.getInitParameter("CryptType"));
				conn = myPoolConnection.getConnection();

				stm = conn.prepareStatement("select", ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
				rs = stm.executeQuery(sql);

				if (rs.next()) {
					daData = rs.getString("data_conf");
					aData = rs.getString("data_odierna");
				}
			} catch (Exception e) {
				logInterface.error(e.getMessage(), e);

			}

			finally {
				try {
					stm.close();
					rs.close();
					myPoolConnection.chiudi(conn);
				} catch (SQLException e) {
					logInterface.error(e.getMessage(), e);
				}
			}
		}

	}

	public String caricaParametri(String inSito, String inAzienda, String inReparto, String inPar) throws SQLException, SqlQueryException {

		String sql;
		ResultSet rs = null;
		String outVal = "";
		Statement stm = null;

		try {
			myPoolConnection = new getPoolConnection(cContext.getInitParameter("PoolName"), cContext.getInitParameter("WebUser"), cContext.getInitParameter("WebPwd"), cContext.getInitParameter("CryptType"));
			conn = myPoolConnection.getConnection();

			rs = null;
			sql = "select pck_configurazioni.getValue('" + inSito + "','" + inAzienda + "','" + inReparto + "','" + inPar + "') from dual";

			stm = conn.prepareStatement("select", ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
			rs = stm.executeQuery(sql);

			if (rs.next()) {

				outVal = rs.getString(1);
			}

		} catch (Exception e) {
			logInterface.error(e.getMessage(), e);

		}

		finally {
			try {
				stm.close();
				rs.close();
				myPoolConnection.chiudi(conn);
			} catch (SQLException e) {
				logInterface.error(e.getMessage(), e);
			}

		}

		return outVal;
	}

	private String chkNull(String input) {
		if (input == null)
			return "";
		else
			return input;
	}

}
