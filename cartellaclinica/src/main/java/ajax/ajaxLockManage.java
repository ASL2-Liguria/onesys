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
import imago.sql.SqlQueryException;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.structErroreControllo;

import javax.servlet.ServletContext;

import org.directwebremoting.WebContextFactory;

import core.Global;

public class ajaxLockManage {
	public ajaxLockManage() {

	}

	/**
	 * 
	 * controlla se un determinato record di una tabella e' lockato o meno da un
	 * altro utente
	 * 
	 * NB il parametro DEVE essere: ESAMI.IDEN
	 * 
	 * 
	 * 
	 * @param strParametri
	 *            String
	 * @return String Viene ritornato vuoto se tutto ok ! , altrimenti viene
	 *         ritornata una stringa
	 */
	public String checkLockRecordReferto(String strParametri) {
		String errore = "";
		ServletContext myContext = null;
		String[] arrayParametri = null;
		baseUser logged_user = null;
		int i = 0;

		structErroreControllo myErrore = new structErroreControllo(false, "");

		new classRsUtil();
		if (strParametri == null) {
			return "Parameters null to ajaxLockManage.checkLockRecord";
		} else {
			if (strParametri.equalsIgnoreCase("")) {
				return "Parameters null to ajaxLockManage.checkLockRecord";
			}
			// parametri
			arrayParametri = strParametri.split("[*]");
			// ********
			try {
				myContext = WebContextFactory.get().getServletContext();
				if (myContext == null) {
					return "checkLockRecordReferto - Error: Context is null";
				}
			} catch (java.lang.Exception ex) {
				return "checkLockRecordReferto - Error: Can't retrieve context object - Param: " + strParametri;
			}
			// utente loggato
			try {
				logged_user = Global.getUser(WebContextFactory.get().getSession(false));
			} catch (java.lang.Exception ex) {
				return "checkLockRecordReferto - Error: Can't retrieve logged user - Param: " + strParametri;
			}
			try {
				// controllo se utente e' nullo
				if (logged_user == null) {
					return "checkLockRecordReferto - Error: User null. Can't retrieve logged user - Param: " + strParametri;
				}
				for (i = 0; i < arrayParametri.length; i++) {
					myErrore = classRsUtil.checkLockRecord(logged_user.db.getDataConnection(), "ESAMI", arrayParametri[i]);
					if (myErrore.bolError) {
						// record gia' lockati
						return "LOCK" + "*" + myErrore.strDescrErrore;
					}
				}
			} catch (SqlQueryException ex) {
				return "Error connecting to DB via user connection";
			}

		}
		return errore;

	}
}
