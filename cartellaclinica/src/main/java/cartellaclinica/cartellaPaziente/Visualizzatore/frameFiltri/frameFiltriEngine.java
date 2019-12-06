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
package cartellaclinica.cartellaPaziente.Visualizzatore.frameFiltri;

import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.html.standardHTML;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Iterator;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import plugin.getPoolConnection;
import cartellaclinica.cartellaPaziente.Visualizzatore.frameFiltri.html.cFiltriHtmlFoot;
import cartellaclinica.cartellaPaziente.Visualizzatore.frameFiltri.html.cFiltriHtmlHidden;
import cartellaclinica.cartellaPaziente.Visualizzatore.frameFiltri.html.cFiltriHtmlOpt;
import generic.utility.html.HeaderUtils;

public class frameFiltriEngine extends functionObj {

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

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(frameFiltriEngine.class);

	public frameFiltriEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) {
		super(cont, req, sess);
		cContext = cont;
		cRequest = req;
		this.fObj = new functionObj(cont, req, sess);
		this.fStr = new functionStr();
		fDB = new functionDB(this);

	}

	public frameFiltriEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));

	}

	public String gestione() {

		String sHtml = new String("");
		String sHtml2 = new String("");
		String cName = new String("");

		Class cDB = null;
		Class cPar[] = {functionObj.class};
		Object oDB = null;
		Object arg[] = null;
		Method cMet = null;
		Document cDoc = new Document();
		Body cBody = new Body();
		standardHTML sHTML = new standardHTML();
		classFormHtmlObject cForm = new classFormHtmlObject("filtri", "", "POST", "");
  //    cOpzioniHtmlInt      cInt    = new cOpzioniHtmlInt();

		cFiltriHtmlOpt cOpt = new cFiltriHtmlOpt();
		cFiltriHtmlHidden cHidden = new cFiltriHtmlHidden();
		cFiltriHtmlFoot cFoot = new cFiltriHtmlFoot();
		String sOut = new String("");

		try {

			readDati();

			getCDC();

			sHtml = "set_view_cdc(\"";

			if (!this.reparto.equals("")) {

				if (!this.reparto.substring(0, 1).equals("'")) {
					this.reparto = "'" + this.reparto + "'";
				}
			}
			sHtml += this.reparto + "\", \"";
			sHtml += this.descrCDC + "\");\n";

			if (!this.nosologico.equals("")) {
				sHtml += "set_nosologico('";
				sHtml += this.nosologico + "');\n";
			}

			if (filtroDoc.equals("S")) {
				getDescrDoc();
				sHtml2 = "set_view_tipdoc(\"";
				sHtml2 += this.hDoc + "\", \"";
				sHtml2 += this.descrDoc + "\");\n";
			}

			cDoc.appendHead(this.createHead());

			cForm.appendSome(cOpt.draw(fObj, nosologico, daData, aData, repartiUtente, filtroDoc));
			cForm.appendSome(cHidden.draw());
			//    cForm.appendSome(cFoot.draw());

			cBody.addElement(cForm.toString());

			cBody.addElement(sHTML.draw_form_calendar().toString());

			/*if(!fJs.equalsIgnoreCase(""))
			 {
			 cBody.addElement("<script>\n" + fJs + "\n</script>");
			 }
			 cBody.addElement("\n<SCRIPT>\n\tfillLabels(arrayLabelName,arrayLabelValue);\n</SCRIPT>\n");*/
			/*    fJs = "\n<SCRIPT>\n\t" + fJs + "\n\tfillLabels(arrayLabelName,arrayLabelValue);";
			 if(dati.auto_visualizza.equalsIgnoreCase("S"))
			 {
			 fJs += "\n\taggiorna('" + dati.tipo + "');";
			 }
			 fJs += "\naggiorna('');</SCRIPT>";
			 */
			cBody.addElement("<script>\n" + sHtml + "\n</script>");
			if (filtroDoc.equals("S")) {
				cBody.addElement("<script>\n" + sHtml2 + "\n</script>");
			}
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

	public void getCDC() throws SqlQueryException, SQLException {

		if (!reparto.equals("")) {
			// String sql="Select DESCR from centri_di_costo where cod_dec='"+reparto+"'";
			String sql = "Select DESCR from centri_di_costo where cod_dec=?";

			ResultSet rs = null;

			PreparedStatement ps = this.fDB.getConnectData().prepareStatement(sql);
			ps.setString(1, reparto);
			rs = ps.executeQuery();

			if (rs.next()) {
				descrCDC = rs.getString("DESCR");
			}
			this.fDB.close(rs);
			ps.close();

		}

		baseUser utente = this.fDB.bUtente;
		ArrayList listaReparti = utente.listaReparti;
		String dsid = utente.description;
		String sa = utente.CDC_UTENTE;

		for (Iterator it = listaReparti.iterator(); it.hasNext();) {
			if (!repartiUtente.equals("")) {
				repartiUtente = repartiUtente + ",";
			}
			repartiUtente = repartiUtente + "'" + it.next() + "'";

		}

	}

	public void getDescrDoc() {

		Statement stm = null;
		ResultSet rs = null;

		if (!hDoc.equalsIgnoreCase("")) {
			try {
//	conn= new Connessione().getConnection(cContext);
				myPoolConnection = new getPoolConnection(cContext.getInitParameter("RegistryPoolName"), cContext.getInitParameter("RegistryUser"), cContext.getInitParameter("RegistryPwd"), cContext.getInitParameter("CryptType"));
				conn = myPoolConnection.getConnection();

				stm = conn.createStatement();
				rs = stm.executeQuery("SELECT DISPLAY  FROM CLASSCODE WHERE CODE IN (" + hDoc + ") ORDER BY DISPLAY");

				while (rs.next()) {
					if (!descrDoc.equals("")) {
						descrDoc += "," + rs.getString("DISPLAY");
					} else {
						descrDoc = rs.getString("DISPLAY");
					}
				}

			} catch (Exception e) {
				logInterface.error(e.getMessage(), e);
			} finally {
				try {

					//new Connessione().chiudi(conn,cContext);
					myPoolConnection.chiudi(conn);
					stm.close();
				} catch (Exception e) {

					logInterface.error(e.getMessage(), e);
				}

			}
		}

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
