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

import imago.http.baseClass.baseUser;
import imagoAldoUtil.classRsUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import org.directwebremoting.WebContextFactory;

import core.Global;

/**
 * Esegue una query di comando (delete, update, insert....) prendendo la
 * connessione dall'utente di sessione(baseUser) switchando tra i db in base ad
 * un parametro che puo' valere WEB oppure DATA
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
 * Copyright: Copyright (c) 2006
 * </p>
 * 
 * <p>
 * Company: El.Co.
 * </p>
 * 
 * @author Aldo
 * @version 1.0
 */
public class ajaxQueryCommand {
	public ajaxQueryCommand() {
	}

	/**
	 * eegue query
	 * 
	 * 
	 * 
	 * @param tipoDB
	 *            String vale WEB se eseguo query su imagoweb, DATA su radsql
	 * @param sql
	 *            String
	 * @return String
	 * 
	 *         NB ritorna "OK" oppure "KO*descrizione errore di ritorno"
	 */
	public String ajaxDoCommand(String tipoDB, String sql) {
		String strOutput = "";
		baseUser logged_user = null;
		PreparedStatement stm = null;
		Connection myConn = null;
		ResultSet rs = null;

		if (sql.equalsIgnoreCase("")) {
			return "KO*Error no sql statement";
		}
		new classRsUtil();
		logged_user = Global.getUser(WebContextFactory.get().getSession(false));
		if (logged_user != null) {

			try {
				if (tipoDB.equalsIgnoreCase("WEB")) {
					myConn = logged_user.db.getWebConnection();
				} else {
					myConn = logged_user.db.getDataConnection();
				}
				stm = myConn.prepareStatement(sql);
				rs = stm.executeQuery();
				strOutput = "OK";
			} catch (java.lang.Exception ex) {
				ex.printStackTrace();
				strOutput = "KO*" + ex.getMessage();
			} finally {
				try {
					rs.close();
					rs = null;
					stm.close();
					stm = null;
					// ATTENZIONE !!!
					// myConn.close();
					// myConn = null;
				} catch (java.lang.Exception ex2) {
					ex2.printStackTrace();
				}
			}
		}

		return strOutput;
	}
}
