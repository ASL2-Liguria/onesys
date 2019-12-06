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
import imago.sql.TableResultSet;
import imagoAldoUtil.classRsUtil;

import java.sql.ResultSet;

import org.directwebremoting.WebContextFactory;

import core.Global;

public class ajaxRecordCheck {
	public ajaxRecordCheck() {
	}

	/**
	 * 
	 * metodo che effettua una query e ritorna (con un booleano) se esiste
	 * almeno un record con la where passata come parametro
	 * 
	 * NB il parametro tipoDB DEVE valere o WEB o DATA (case unsensitive) a
	 * seconda di quale DB si vuole interrogare. Di Default il valore e' DATA
	 * 
	 * NB il parametro strWHERE, se compilato, DEVE contenere la clausola WHERE
	 * 
	 * 
	 * 
	 * @param tipoDB
	 * @param strTable
	 *            String
	 * @param strWhere
	 *            String
	 * @return boolean: false indica che NON esistono record
	 */
	public boolean ajaxExistRecord(String tipoDB, String strTable, String strWhere) {
		baseUser logged_user = null;
		boolean bolEsito = false;
		TableResultSet myTable = null;
		ResultSet rs = null;
		String sql = "";
		classRsUtil myUtil = null;

		if (strTable.equalsIgnoreCase("")) {
			return bolEsito;
		}
		myUtil = new classRsUtil();
		sql = "select count(*) nrecord from " + strTable + " " + strWhere;
		logged_user = Global.getUser(WebContextFactory.get().getSession(false));
		if (logged_user != null) {
			myTable = new TableResultSet();
			try {
				if (tipoDB.equalsIgnoreCase("WEB")) {
					rs = myTable.returnResultSet(logged_user.db.getWebConnection(), sql);
				} else {
					rs = myTable.returnResultSet(logged_user.db.getDataConnection(), sql);
				}
				if (rs.next()) {
					if (Integer.valueOf(myUtil.returnStringFromRs(rs, "nrecord")) > 0) {
						bolEsito = true;
					}
				}
			} catch (java.lang.Exception ex) {
				ex.printStackTrace();
			} finally {
				try {
					rs.close();
					rs = null;
					myTable.close();
					myTable = null;
				} catch (java.lang.Exception ex2) {
					ex2.printStackTrace();
				}
			}
		}
		return bolEsito;
	}
}
