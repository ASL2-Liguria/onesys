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
package stampe.anteprima;

import imago.http.baseClass.baseUser;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import org.directwebremoting.WebContextFactory;

import core.Global;

/**
 * <p>
 * Title:
 * </p>
 * 
 * <p>
 * Description:
 * </p>
 * 
 * <p>
 * Copyright:
 * </p>
 * 
 * <p>
 * Company:
 * </p>
 * 
 * @author Fabio
 * @version 1.0
 */
public class SceltaStampa {

	private Statement stm = null;

	private Connection Conn = null;

	public SceltaStampa() {

	}

	public String SelectReparto(String var) {
		String Ret = "";
		String ArrCDC = "";
		try {
			String[] Dati = var.split("[*]");
			baseUser logged_user = Global.getUser(WebContextFactory.get().getSession(false));
			Conn = logged_user.db.getWebConnection();
			String sql = "Select * from configura_stampe where FUNZIONE_CHIAMANTE='" + Dati[0] + "'";
			stm = this.Conn.createStatement();
			ResultSet rst;
			rst = stm.executeQuery(sql);

			// Estrazione dei Dati
			while (rst.next() == true) {
				String temp_S_N = "";
				temp_S_N = rst.getString("RICHIEDI_REPORT");
				if (temp_S_N.equalsIgnoreCase("S")) {
					ArrCDC += rst.getString("CDC") + "@";
				}
			}

			if (ArrCDC.equalsIgnoreCase("")) {
				Ret = "NO";
			} else {
				Ret = "OK*" + ArrCDC;
			}

			// num=num+stm.executeUpdate(sql);

			Conn.commit();

			Conn.close();

		} catch (Exception ex) {
			Ret = "KO*" + ex.getMessage();
			try {

				Conn.close();
			} catch (Exception e) {
				Ret = "KO*" + e.getMessage();
			}
		} finally {
			try {
				Conn.close();
			} catch (Exception e) {
				Ret = "KO*" + e.getMessage();
			}

		}
		return Ret;
	}

}
