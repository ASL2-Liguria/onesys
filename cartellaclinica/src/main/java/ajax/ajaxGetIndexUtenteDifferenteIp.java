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

import imago.sql.CallStoredProcedure;
import imago.sql.TableResultSet;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.classUtenteLoggato;
import imagoAldoUtil.checkUser.classUserManage;
import imagoUtils.logToOutputConsole;

import java.sql.Connection;
import java.sql.ResultSet;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.directwebremoting.WebContextFactory;

/**
 * 
 * classe che attraverso il metodo ritorna se l'utente e' gia' connesso da un ip
 * differente da quello indicato dal parametro
 * 
 * <p>
 * Title:
 * </p>
 * 
 * <p>
 * Description:
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2007
 * </p>
 * 
 * <p>
 * Company:
 * </p>
 * 
 * @author not attributable
 * @version 1.0
 * 
 *          NB usare classUtente.getIndexUtenteDifferenteIp
 */
public class ajaxGetIndexUtenteDifferenteIp {

	public ajaxGetIndexUtenteDifferenteIp() {
	}

	/**
	 * 
	 * ritorna la stringa splittata: indice*ip dove ha trovato utente
	 * connesso*data accesso*webserver -1 se NON ha trovato
	 * 
	 * l'utente loggato su ip differente da quello passato come parametro
	 * 
	 * @param utente
	 *            String
	 * @param ip
	 *            String
	 */
	public String getIndexUtenteDifferenteIp(String utente, String ip) {
		String strOutput = "-1";
		ServletContext myContext = null;
		HttpServletRequest myRequest = null;
		String myIp = "";
		String strEsitoCheck = "";
		TableResultSet myTable = null;
		ResultSet rs = null;
		classRsUtil myUtil = null;
		Connection myConn = null;

		if (utente.equalsIgnoreCase("")) {
			strOutput = "-1";
		} else {
			try {
				myIp = ip;
				// controllo ip
				if (myIp.equalsIgnoreCase("")) {
					// provo a tirarlo fuori
					// dalla reuqest
					myRequest = WebContextFactory.get().getHttpServletRequest();
					myIp = myRequest.getRemoteAddr();
				}

				myContext = WebContextFactory.get().getServletContext();
				WebContextFactory.get().getSession(false);

				try {
					new CallStoredProcedure();
					String strUser = myContext.getInitParameter("WebUser");
					String strPwd = classUserManage.decodificaPwd(myContext, myContext.getInitParameter("WebPwd"));
					myConn = imago.sql.Utils.getTemporaryConnection(strUser, strPwd);
					strEsitoCheck = classUtenteLoggato.getInfoVerficaLoginUtente(myConn, "sp_VerificaLoginUtente", utente, myIp);
					if (strEsitoCheck.toString().equalsIgnoreCase("2")) {
						// utente gia' loggato altrove
						// ove ?
						myTable = new TableResultSet();
						String sql = "select * from (select * from utenti_loggati where webuser = '" + utente + "' order by iden desc) where rownum <= 1";
						try {
							rs = myTable.returnResultSet(myConn, sql);
							if (rs.next()) {
								myUtil = new classRsUtil();
								strOutput = "0*";
								strOutput += myUtil.returnStringFromRs(rs, "webuser") + "*";
								strOutput += myUtil.returnStringFromRs(rs, "ip") + "*";
								strOutput += myUtil.returnStringFromRs(rs, "data_accesso") + "*";
								strOutput += myUtil.returnStringFromRs(rs, "webserver") + "*";
								strOutput += myUtil.returnStringFromRs(rs, "nome_host") + "*";
								strOutput += myUtil.returnStringFromRs(rs, "descrutente") + "*";
							}
						} catch (Exception ex3) {
							logToOutputConsole.writeLogToSystemOutput(this, "sql: " + sql + " Error:\n" + ex3.getMessage());
							ex3.printStackTrace();
						} finally {
							try {
								rs.close();
								rs = null;
								myTable.close();
								myTable = null;
							} catch (Exception ex5) {
							}
						}

					} else {
						// tutto ok
						strOutput = "-1";
					}
				} catch (Exception ex2) {
					logToOutputConsole.writeLogToSystemOutput(this, " Error:\n" + ex2.getMessage());
					ex2.printStackTrace();
				} finally {
					if (myConn != null) {
						imago.sql.Utils.closeTemporaryConnection(myConn);
						myConn = null;
					}
				}
			} catch (java.lang.Exception ex) {
				ex.printStackTrace();
				strOutput = "-1";
			}
		}
		// ritorna stringa cosi' strutturata
		// indice*webuser*ip*data_accesso*webserver*nome_host*descr_utente

		return strOutput;

	}

}
