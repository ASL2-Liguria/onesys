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
package ajax;

import imago.sql.TableInsert;
import imago.sql.TableResultSet;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.structErroreControllo;
import imagoAldoUtil.checkUser.classUserManage;
import imagoAldoUtil.pcManage.classPcManage;
import imagoUtils.logToOutputConsole;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

public class ajaxPcManage {
	public ajaxPcManage() {
	}

	/**
	 * @param hostNameIp
	 *            String
	 * @return boolean
	 */
	public boolean ajaxPcCheck(String hostNameIp) {
		boolean bolEsito = false;
		ServletContext contesto = null;
		structErroreControllo myErrore = new structErroreControllo(false, "");

		contesto = WebContextFactory.get().getServletContext();
		if (contesto != null) {
			bolEsito = classPcManage.existPc(contesto, hostNameIp);
		}
		if (!bolEsito) {
			// pc non esiste
			if (getAutoInsertPc(contesto).equalsIgnoreCase("S")) {
				myErrore = insertPC(contesto, hostNameIp);
				if (myErrore.bolError) {
					// errore inserimento
					logToOutputConsole.writeLogToSystemOutput(this, "Error: Error insert record with ip:" + hostNameIp, imago.a_sql.CLogError.LOG_ERROR, contesto, WebContextFactory.get().getSession());
					bolEsito = false;
				} else {
					bolEsito = true;
				}
			}
		}
		return bolEsito;
	}

	/**
	 * @param contesto
	 *            ServletContext
	 * @return String
	 */
	private String getAutoInsertPc(ServletContext contesto) {

		Connection myConnImago = null;
		ResultSet rs = null;
		TableResultSet myTable = null;
		String sql = "", polaris_auto_insert_pc = "";
		String strUser = "", strPwd = "";
		// accesso al db web
		try {
			// strConnectionString = contesto.getInitParameter (
			// "ConnectionString" ) ;
			strUser = contesto.getInitParameter("WebUser");
			strPwd = classUserManage.decodificaPwd(contesto, contesto.getInitParameter("WebPwd"));
			myConnImago = imago.sql.Utils.getTemporaryConnection(strUser, strPwd);
			myTable = new TableResultSet();
			sql = "Select gericos_auto_insert_pc from v_globali";
			rs = myTable.returnResultSet(myConnImago, sql);
			if (rs.next() == true) {
				polaris_auto_insert_pc = rs.getString("gericos_auto_insert_pc");
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			try {
				rs.close();
				rs = null;
				myTable.close();
				myTable = null;
				if (myConnImago != null) {
					imago.sql.Utils.closeTemporaryConnection(myConnImago);
					myConnImago = null;
				}
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
		return polaris_auto_insert_pc;
	}

	/**
	 * @param contesto
	 *            ServletContext
	 * @param hostNameIp
	 *            String
	 * @return structErroreControllo
	 */
	private structErroreControllo insertPC(ServletContext contesto, String hostNameIp) {
		structErroreControllo myErrore = new structErroreControllo(false, "");

		Properties info = null;
		Connection myConnImago = null;
		TableInsert myTable = null;
		String sql = "";
		String strUser = "", strPwd = "";

		if (!hostNameIp.equalsIgnoreCase("")) {
			// controllo
			info = new Properties();
			info.put("user", contesto.getInitParameter("WebUser"));
			info.put("password", contesto.getInitParameter("WebPwd"));
			// accesso al db web
			try {

				strUser = contesto.getInitParameter("WebUser");
				strPwd = classUserManage.decodificaPwd(contesto, contesto.getInitParameter("WebPwd"));
				// strConnectionString = contesto.getInitParameter (
				// "ConnectionString" ) ;
				myConnImago = imago.sql.Utils.getTemporaryConnection(strUser, strPwd);
				myTable = new TableInsert();
				sql = "INSERT INTO CONFIGURA_PC (IP, NOME_HOST) VALUES ";
				sql += "(";

				sql += "'" + classStringUtil.repapici(hostNameIp) + "',";
				sql += "'" + classStringUtil.repapici(hostNameIp) + "')";
				myTable.insertQuery(myConnImago, sql);
			} catch (Exception ex) {
				logToOutputConsole.writeLogToSystemOutput(this, "Error - sql: " + sql + " - Error:" + ex.getCause().getMessage());
			} finally {
				try {
					myTable.close();
					myTable = null;
					if (myConnImago != null) {
						imago.sql.Utils.closeTemporaryConnection(myConnImago);
						myConnImago = null;
					}
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
		} else {
			myErrore.bolError = true;
			myErrore.strDescrErrore = "ajaxPcManage - Hostname null or empty";
		}
		return myErrore;
	}


	// ritorna il numero di sec rimasti al timeout di sessione
	public long ajax_getSecondsLeftBeforeSessionTimeout() {
		long secRimasti = -1;
		HttpSession mySession = null;

		try {
			mySession = WebContextFactory.get().getSession(false);
			secRimasti = mySession.getLastAccessedTime();
		} catch (Exception ex) {
		}
		return secRimasti;
	}
}
