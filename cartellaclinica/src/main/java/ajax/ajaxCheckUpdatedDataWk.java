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
import imagoCreateWk.classCheckUpdatedDataWk;

import org.directwebremoting.WebContextFactory;

import core.Global;

/**
 * 
 * metodo che controlla se una query ha un numero diverso di righe come output.
 * 
 * Questa chiamata viene utilizzata per segnalare all'utente se ci sono stati o
 * meno degli aggiornamenti nella wk
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
public class ajaxCheckUpdatedDataWk {
	public ajaxCheckUpdatedDataWk() {
	}

	/**
	 * 
	 * ritorna true se c'e' stata una qualche variazione nel numero di record
	 * 
	 * @param oldNumRighe
	 *            String
	 * @param sql
	 *            String
	 * @return boolean
	 */
	public boolean ajaxCheckUpdate(String oldNumRighe, String sql) {
		int nRighe = 0;
		boolean bolEsito = false;
		baseUser logged_user = null;

		if (oldNumRighe.equalsIgnoreCase("")) {
			nRighe = 0;
		} else {
			try {
				nRighe = Integer.valueOf(oldNumRighe);
			} catch (java.lang.Exception ex) {
				nRighe = 0;
			}
		}
		logged_user = Global.getUser(WebContextFactory.get().getSession(false));
		if (logged_user != null) {
			try {
				bolEsito = classCheckUpdatedDataWk.checkUpdatedData(logged_user.db.getDataConnection(), nRighe, sql);
			} catch (java.lang.Exception ex) {
				ex.printStackTrace();
			}
		}
		return bolEsito;
	}
}
