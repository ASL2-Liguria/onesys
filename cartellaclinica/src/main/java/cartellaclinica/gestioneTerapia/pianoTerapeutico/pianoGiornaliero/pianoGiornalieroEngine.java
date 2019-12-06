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
package cartellaclinica.gestioneTerapia.pianoTerapeutico.pianoGiornaliero;

import generic.statements.StatementFromFile;
import generic.utility.html.HeaderUtils;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imagoUtils.classJsObject;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.sql.CallableStatement;
import java.sql.Clob;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.html.Body;

import configurazioneReparto.baseReparti;

public class pianoGiornalieroEngine extends functionObj {

	private functionDB fDB = null;
	private int offSet = -1;
	private int tipoFiltro = 25;
	private int idenVisita = 0;
	private int idenAccesso = 0;
	private String scrollTop = new String("");
//  private int idenAnag=0;
//  private String reparto ="";
//  private String ricovero="";
	private String filtroCartella = "";

	private boolean error = false;
	private String strError = "";

	public ElcoLoggerInterface log = new ElcoLoggerImpl(this.getClass());

	public pianoGiornalieroEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
	}

	public pianoGiornalieroEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		Body cBody = new Body();

		CallableStatement CS = null;

		Clob lob = null;

		try {

			this.readDati();

			cBody.addAttribute("onload", "afterLoad(" + scrollTop + ");");

			if (error) {
				cBody.addElement("<script>alert('Errore : " + strError + "');</script>");
			}

			CS = fDB.getConnectData().prepareCall("{call CC_PIANO_GIORNALIERO_MAIN (?,?,?,?,?,?)}");

			CS.setString(1, bUtente.login);
			CS.setString(2, filtroCartella);
			CS.setInt(3, idenVisita);
			CS.setInt(4, offSet);
			CS.setInt(5, this.tipoFiltro);
			CS.registerOutParameter(6, Types.CLOB);
			try {
				CS.execute();
			} catch (SQLException ex) {
				CS.execute();
			}

			cBody.addElement(CS.getString(6));
			lob = CS.getClob(6);

			sOut = cBody.toString() + getFormExtern().toString() + "</html>";

		} catch (Exception ex) {
			log.error(ex);
			sOut = ex.getMessage();
		} finally {
			try {
				if (lob != null) {
					lob.free();
				}
				CS.close();
				CS = null;
			} catch (Exception ex) {
				sOut = ex.getMessage();
			}
		}

		return sOut;
	}

	private void readDati() {

		idenVisita = Integer.valueOf(cParam.getParam("iden_visita").trim());
		idenAccesso = Integer.valueOf(cParam.getParam("CONTROLLO_ACCESSO").trim());
//      idenAnag =Integer.valueOf(cParam.getParam("iden_anag").trim());
//      ricovero =cParam.getParam("ricovero").trim();
//      reparto =cParam.getParam("reparto").trim();
		filtroCartella = cParam.getParam("filtroCartella").trim();
		scrollTop = cParam.getParam("scrollTop").trim();

		if (!chkNull(cParam.getParam("offSet")).equals("")) {
			this.offSet = Integer.valueOf(cParam.getParam("offSet").trim());
		}
		if (!chkNull(cParam.getParam("tipoFiltro")).equals("")) {
			this.tipoFiltro = Integer.valueOf(cParam.getParam("tipoFiltro").trim());
		}

		PreparedStatement stat = null;

		try {
			if (!chkNull(cParam.getParam("StatementName")).equals("")) {
				StatementFromFile util = new StatementFromFile(this.hSessione);
				String[] binds = new String[0];
				if (!chkNull(cParam.getParam("sqlBinds")).equals("")) {
					binds = cParam.getParam("sqlBinds").split("#");
				}
				util.executeStatement(cParam.getParam("StatementFile"), cParam.getParam("StatementName"), binds, 0);
			}
			if (!chkNull(cParam.getParam("sql")).equals("")) {
				stat = this.fDB.getConnectData().prepareCall(cParam.getParam("sql"));
				if (!chkNull(cParam.getParam("sqlBinds")).equals("")) {
					String[] binds = cParam.getParam("sqlBinds").split("#");
					for (int i = 0; i < binds.length; i++) {
						stat.setString(1 + i, (binds[i].length() < 1 ? null : binds[i]));
					}
				}
				stat.execute();
			}
			if (!chkNull(cParam.getParam("filtri")).equals("")) {
				String sql = "begin ";
				sql += "delete from FILTRI where TIPO=? and USER_NAME=?;";
				sql += "insert into FILTRI (TIPO,USER_NAME,LASTVALUECHAR,LASTVALUEINT) values (?,?,?,-1);";
				sql += "end;";
				stat = this.fDB.getConnectData().prepareCall(sql);
				stat.setInt(1, this.tipoFiltro);
				stat.setString(2, bUtente.login);
				stat.setInt(3, this.tipoFiltro);
				stat.setString(4, bUtente.login);
				stat.setString(5, cParam.getParam("filtri"));

				stat.execute();
			}
		} catch (Exception e) {
			error = true;
			strError = e.getMessage();
			log.error(strError);
		} finally {
			try {
				stat.close();
				stat = null;
			} catch (Exception ex) {
				stat = null;
			}
		}

	}

	private classFormHtmlObject getFormExtern() {
		classFormHtmlObject vForm = new classFormHtmlObject("EXTERN", "pianoGiornaliero", "POST", "_self");
		vForm.appendSome(new classInputHtmlObject("hidden", "CONTROLLO_ACCESSO", String.valueOf(idenAccesso)));
		vForm.appendSome(new classInputHtmlObject("hidden", "iden_visita", String.valueOf(idenVisita)));
		vForm.appendSome(new classInputHtmlObject("hidden", "scrollTop", scrollTop));
//      vForm.appendSome(new classInputHtmlObject("hidden","iden_anag",String.valueOf(idenAnag)));
//      vForm.appendSome(new classInputHtmlObject("hidden","reparto",reparto));
//      vForm.appendSome(new classInputHtmlObject("hidden","ricovero",ricovero));
		vForm.appendSome(new classInputHtmlObject("hidden", "offSet", String.valueOf(offSet)));
		vForm.appendSome(new classInputHtmlObject("hidden", "sql", ""));
		vForm.appendSome(new classInputHtmlObject("hidden", "sqlBinds", ""));
		vForm.appendSome(new classInputHtmlObject("hidden", "filtri", ""));
		vForm.appendSome(new classInputHtmlObject("hidden", "tipoFiltro", String.valueOf(this.tipoFiltro)));
		vForm.appendSome(new classInputHtmlObject("hidden", "filtroCartella", filtroCartella));
		vForm.appendSome(new classInputHtmlObject("hidden", "StatementFile", ""));
		vForm.appendSome(new classInputHtmlObject("hidden", "StatementName", ""));
		return vForm;
	}

	public classHeadHtmlObject createHead() throws SQLException, SqlQueryException, Exception {

		classHeadHtmlObject cHead = HeaderUtils.createHeadWithIncludesNoDefault(this.getClass().getName(), hSessione);;

		cHead.addElement(classJsObject.javaClass2jsClass(this.bUtente));
		cHead.addElement("<SCRIPT>initbaseUser();</SCRIPT>");

		baseReparti conf = super.bReparti;//Global.getReparti(hSessione);
		cHead.addElement(conf.getConfigurazioniReparti().toString());

		return cHead;

	}

	private String chkNull(String input) {
		if (input == null) {
			return "";
		} else {
			return input;
		}
	}
}
