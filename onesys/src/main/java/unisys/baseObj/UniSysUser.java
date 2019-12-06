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
package unisys.baseObj;

import imago.sql.SqlQueryException;
import imago.sql.dbConnections;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

import oracle.jdbc.OraclePreparedStatement;

/**
 * Classe che mantiene le principali informazioni legate all'utente loggato in
 * quel momento
 * 
 * @author AldoG
 * @version 1.0
 * 
 * @author FabrizioD
 * @version 2.0
 */
public class UniSysUser extends baseObj implements Serializable, HttpSessionBindingListener {
	private static final long serialVersionUID = 1L;

	private String webuser = null;

	private String view = null;

	private dbConnections dbConns = null;

	/**
	 * Costruttore di baseUser
	 * 
	 * @param webuser
	 *            by Login
	 * @param dbConns
	 */
	public UniSysUser(String webuser, dbConnections dbConns, String view) {
		super();

		this.webuser = webuser;
		this.view = view;
		this.dbConns = dbConns;
	}

	public void load() {
		this.leggiUser();
	}

	/**
	 * Valorizza properties con i dati dell'utente
	 * 
	 * Legge dalla vista indicata nella tab di configurazione (xEs: ges_config_page)
	 */
	private void leggiUser() {
		Connection conn = null;
		ResultSet rs = null;

		try {
			conn = this.dbConns.getWebConnection();
		} catch (SqlQueryException e1) {
			this.logger.error("Errore durante la getWebConnection()");
			e1.printStackTrace();
		}

		try {
			OraclePreparedStatement ps = (OraclePreparedStatement) conn.prepareStatement("select * from " + this.view + " where WEBUSER = :pUser and DELETED <> 'S'");
			ps.setStringAtName("pUser", this.webuser);

			rs = ps.executeQuery();

			if (rs.next()) {
				String key = new String("");
				String value = new String("");

				ResultSetMetaData metadata = rs.getMetaData();
				int columnCount = metadata.getColumnCount();

				for (int i = 1; i <= columnCount; i++) {
					key = metadata.getColumnName(i);
					value = rs.getString(i);

					this.setParametro(key, value);
				}
			} else {
				throw new Exception("Utente " + this.webuser + " non presente nel db");
			}
		} catch (java.lang.Exception ex) {
			this.logger.error("Errore durante la lettura dei dati dell'utente [" + this.view + "]\n" + ex.getMessage());
			ex.printStackTrace();
		} finally {
			try {
				rs.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			rs = null;
			conn = null;
		}
	}

	/**
	 * Ritorna webuser
	 * 
	 * @return webuser
	 */
	public String getWebuser() {
		return this.webuser;
	}

	// quando la sessione scade
	public void valueUnbound(javax.servlet.http.HttpSessionBindingEvent httpSessionBindingEvent) {
		try {
			dbConns.closeAllConnections();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	@Override
	public void valueBound(HttpSessionBindingEvent arg0) {
	}

	public static UniSysUser getSessionUser(HttpSession session) {
		return (UniSysUser) session.getAttribute("utente");
	}

	public static String getSessionLoginName(HttpSession session) {
		return getSessionUser(session).webuser;
	}

	public static dbConnections getConnections(HttpSession session) {
		return (dbConnections) getSessionUser(session).dbConns;
	}

	public void saveInSession(HttpSession session) {
		session.setAttribute("utente", this);
	}
}
