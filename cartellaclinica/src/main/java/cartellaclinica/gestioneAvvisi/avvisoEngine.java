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
package cartellaclinica.gestioneAvvisi;

import imago.http.classHeadHtmlObject;
import imago.sql.SqlQueryException;
import imagoUtils.classJsObject;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.CallableStatement;
import java.sql.Clob;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Enumeration;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;

import com.rits.cloning.Cloner;

import core.cache.CacheTabExtFiles;
import core.database.UtilityLobs;

public class avvisoEngine extends functionObj {

	private functionDB fDB = null;
	private functionStr fStr = null;

	private String nomeSP = new String("");
	private String origine = new String("");
	private ArrayList<String> nomiParametro = new ArrayList<String>();
	private ArrayList<String> tipiParametro = new ArrayList<String>();
	private ArrayList<String> valoriParametro = new ArrayList<String>();

	public avvisoEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
		fStr = new functionStr();
	}

	public avvisoEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		cDoc.setDoctype(new Doctype.Html401Transitional());

		CallableStatement CS = null;
		Clob clob = null;
		try {

			this.readDati();

			cDoc.appendHead(this.createHead());

			String strP = "";
			for (int i = 0; i < nomiParametro.size(); i++) {
				strP += "?,";
			}
			strP += "?"; //parametro di out

			CS = fDB.getConnectData().prepareCall("{call " + nomeSP + " (" + strP + ")}");

			for (int i = 0; i < nomiParametro.size(); i++) {
				if (tipiParametro.get(i).equalsIgnoreCase("NUMBER")) {
					try {
						CS.setInt(Integer.valueOf(nomiParametro.get(i)), chkNull4number(valoriParametro.get(i)));
					} catch (SQLException ex) {
						throw new Exception("Valore non numerico per un parametro di tipo NUMBER");
					}
				} else if (tipiParametro.get(i).equalsIgnoreCase("VARCHAR")) {
					CS.setString(Integer.valueOf(nomiParametro.get(i)), valoriParametro.get(i));
				} else {
					throw new Exception("Tipo di parametro non riconosciuto");
				}
			}

			CS.registerOutParameter(nomiParametro.size() + 1, Types.CLOB);
			CS.execute();
			cDoc.appendBody(CS.getString(nomiParametro.size() + 1));
			clob = CS.getClob(nomiParametro.size() + 1);

			sOut = cDoc.toString();
		} catch (SqlQueryException ex) {
			sOut = ex.getMessage();
		} catch (SQLException ex) {
			sOut = ex.getMessage();
		} catch (Exception ex) {
			sOut = ex.getMessage();
		} finally {
			UtilityLobs.freeClob(clob);
		}

		return sOut;
	}

	private void readDati() throws SQLException, SqlQueryException {
		String key = "";
		String val = "";

      //nomeSP = cParam.getParam("nomeSP").trim();
		Enumeration e = cParam.getParams().keys();

		while (e.hasMoreElements()) {
			key = (String) e.nextElement();
			val = (String) cParam.getParams().get(key);
			if (key.equals("nomeSP")) {
				nomeSP = val;
			} else if (key.equals("origine")) {
				origine = val;
			} else {
				nomiParametro.add(key);
				tipiParametro.add(chkNull(val.split("@")[0]));
				valoriParametro.add(chkNull(val.split("@")[1]));
			}
		}

	}

	private classHeadHtmlObject createHead() throws SQLException, SqlQueryException {
		if (origine.equals("")) {
			origine = "Default";
		}
		Cloner cloner = new Cloner();
		String servletName = this.getClass().getName();
		
		classHeadHtmlObject cHead = (classHeadHtmlObject) CacheTabExtFiles.getObject(servletName, origine);
		if (cHead == null) {
			
			cHead = new classHeadHtmlObject();
			String sql = "Select * from imagoweb.tab_ext_files where (ORIGINE='" + origine + "' or ORIGINE='" + servletName + "') order by ordine";
			ResultSet rs = null;

			rs = this.fDB.openRs(sql);
			while (rs.next()) {
				if (rs.getString("PATH_FILE").substring(rs.getString("PATH_FILE").length() - 2, rs.getString("PATH_FILE").length()).equals("js")) {
					cHead.addJSLink(CacheTabExtFiles.addTimestamp(rs.getString("PATH_FILE")));
				} else {
					cHead.addCssLink(CacheTabExtFiles.addTimestamp(rs.getString("PATH_FILE")));
				}
			}
			this.fDB.close(rs);
			CacheTabExtFiles.setObject(servletName, origine, cHead);
		}
		
		classHeadHtmlObject cHeadClone = cloner.deepClone(cHead);
		
		cHeadClone.addElement(classJsObject.javaClass2jsClass(this.bUtente));
		cHeadClone.addElement("<SCRIPT>initbaseUser();</SCRIPT>");

		cHeadClone.addElement(classJsObject.javaClass2jsClass(this.bPC));
		cHeadClone.addElement("<SCRIPT>initbasePC();</SCRIPT>");

		cHeadClone.addElement(classJsObject.javaClass2jsClass(this.bGlobale));
		cHeadClone.addElement("<SCRIPT>initbaseGlobal();</SCRIPT>");

		return cHeadClone;
	}

	private String chkNull(String input) {
		if (input == null || input.equalsIgnoreCase("NULL")) {
			return "";
		} else {
			return input;
		}
	}

	private int chkNull4number(String input) {
		if (input == null || input.equalsIgnoreCase("NULL") || input.equalsIgnoreCase("null") || input.equalsIgnoreCase("")) {
			return 0;
		} else {
			return Integer.valueOf(input);
		}
	}
}
