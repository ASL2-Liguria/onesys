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
package ACR;

import imago.http.baseClass.baseUser;

import java.sql.Connection;
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
public class Update {
	private Statement stm = null;

	private Connection Conn = null;

	private int num = 0;

	public Update() {

	}

	public String UpdateDB(String var) {
		String Error = "";
		try {
			String[] Dati = var.split("[*]");
			baseUser logged_user =Global.getUser(WebContextFactory.get().getSession());
			Conn = logged_user.db.getDataConnection();
			stm = Conn.createStatement();
			String sql = "update referti set COD_RSCN1='" + Dati[0] + "', COD_RSCN2='" + Dati[1] + "', NOTE_SCIENTIFICHE='" + Dati[2] + "' where iden=" + Dati[6];
			String sql1 = "update esami set COD_SNC21='" + Dati[3] + "', COD_SNC22='" + Dati[4] + "', COD_SNC23='" + Dati[5] + "' where iden_ref=" + Dati[6];
			num = num + stm.executeUpdate(sql);
			num = num + stm.executeUpdate(sql1);
			Conn.commit();
			stm.close();
			Conn.close();
			Error = Integer.toString(num);
		} catch (Exception ex) {
			Error = ex.getMessage();
		} finally {
			try {
				stm.close();
				Conn.close();
			} catch (Exception e) {
				Error = Error + "  " + e.getMessage();
			}
		}

		return Error;
	}
}
