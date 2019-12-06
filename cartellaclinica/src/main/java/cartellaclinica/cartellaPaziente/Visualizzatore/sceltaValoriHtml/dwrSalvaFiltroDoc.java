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
package cartellaclinica.cartellaPaziente.Visualizzatore.sceltaValoriHtml;

import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import cartellaclinica.cartellaPaziente.Visualizzatore.html.header.headerEngine;
import core.Global;

public class dwrSalvaFiltroDoc {

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(headerEngine.class);

	public dwrSalvaFiltroDoc() {
	}

	public String update_filtro_tip_doc(String elenco_valori_filtri) {
		String error = "";
		String tipologia_esami = "";
		Connection conn = null;
		PreparedStatement st = null;

		if (elenco_valori_filtri == null) {
			return "Parametri nulli passati dal filtro tipologia documento";
		}

		HttpSession session = (WebContextFactory.get()).getSession(false);

		baseUser logged_user = null;

		/* Problema della Sessione Scaduta */
		if (session == null) {
			return "sessione_scaduta";
		} else {
			logged_user = Global.getUser(session);
		}

		try {
			conn = logged_user.db.getDataConnection();
			st = conn.prepareStatement("select LASTVALUECHAR FROM FILTRI WHERE TIPO=? AND USER_NAME=?");
			st.setInt(1, 400);
			st.setString(2, logged_user.login);

			ResultSet rs = st.executeQuery();
			if (rs.next()) {
				rs.close();
				st.close();
				rs = null;
				st = null;
				if (elenco_valori_filtri.equals("")) {
					st = conn.prepareStatement("UPDATE FILTRI SET LASTVALUECHAR=? WHERE TIPO=? AND USER_NAME=?");
					st.setString(1, "");
					st.setInt(2,400);
					st.setString(3, logged_user.login);
				} else {
					st = conn.prepareStatement("UPDATE FILTRI SET LASTVALUECHAR=? WHERE TIPO=? AND USER_NAME=?");
					st.setString(1, elenco_valori_filtri); // .replace("'", "''")
					st.setInt(2,400);
					st.setString(3, logged_user.login);
				}
				st.executeUpdate();
			} else {
				rs.close();
				st.close();
				rs = null;
				st = null;
				if (!elenco_valori_filtri.equals("")) {
					st = conn.prepareStatement("Insert into FILTRI (USER_NAME,TIPO,LASTVALUECHAR) values (?,?,?)");
					st.setString(1, logged_user.login);
					st.setInt(2,400);
					st.setString(3, elenco_valori_filtri); //.replace("'", "''")
					st.executeUpdate();
				}
			}
			
			return "OK";

		} catch (Exception e) {
			logInterface.error(e.getMessage(), e);
		} finally {
			try {
				st.close();
				// conn.close();
			} catch (SQLException e) {
				logInterface.error(e.getMessage(), e);
			}

		}
		return error;
	}

}
