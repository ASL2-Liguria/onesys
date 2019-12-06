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
public class UniSysPC extends baseObj implements Serializable, HttpSessionBindingListener {
	private static final long serialVersionUID = 1L;

	private String ip = null;

	private String tabPC = null;

	/**
	 * Costruttore di basePC
	 * 
	 * @param ip
	 * @param dbConns
	 */
	public UniSysPC(String ip) {
		super();

		this.ip = ip;
		this.tabPC = "CONFIGURA_PC";
	}

	/**
	 * Costruttore di basePC
	 * 
	 * @param ip
	 * @param dbConns
	 * @param tabPC
	 *            - Nome della tabella da leggere
	 */
	public UniSysPC(String ip, dbConnections dbConns, String tabPC) {
		super();

		this.ip = ip;
		this.tabPC = tabPC;
	}

	public void load() throws Exception {
		this.leggiPC();
	}

	/**
	 * Valorizza hashBasePC e jsonBasePC con i dati dell'utente
	 * 
	 * Legge dalla vista indicata nella tab di configurazione (xEs:
	 * ges_config_page)
	 * 
	 * @throws Exception
	 */
	private void leggiPC() throws Exception {
		Connection conn = null;
		ResultSet rs = null;
		dbConnections dbConns = new dbConnections();
		try {
			conn = dbConns.getWebConnection();
		} catch (SqlQueryException e1) {
			this.logger.error("Errore durante la getWebConnection()");
			e1.printStackTrace();
		}

		try {
			OraclePreparedStatement ps = (OraclePreparedStatement) conn.prepareStatement("select * from " + this.tabPC + " where IP = :pIp and DELETED <> 'S'");
			ps.setStringAtName("pIp", this.ip);

			rs = ps.executeQuery();

			if (rs.next()) {
				String key = new String("");
				String value = new String("");

				ResultSetMetaData metadata = rs.getMetaData();
				int columnCount = metadata.getColumnCount();

				for (int i = 1; i < columnCount; i++) {
					key = metadata.getColumnName(i);
					value = rs.getString(i);

					this.setParametro(key, value);
				}
			} else {
				throw new Exception("PC " + this.ip + " non presente nel db");
			}
		} catch (java.lang.Exception ex) {
			this.logger.error("Errore durante la lettura dei dati del PC [" + this.ip + "]\n" + ex.getMessage());
			ex.printStackTrace();
			throw new Exception("PC " + this.ip + " non presente nel db");
		} finally {
			try {
				rs.close();
				conn.close();
				dbConns.closeAllConnections();
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
	public String getIp() {
		return this.ip;
	}

	// quando la sessione scade
	public void valueUnbound(javax.servlet.http.HttpSessionBindingEvent httpSessionBindingEvent) {
	}

	@Override
	public void valueBound(HttpSessionBindingEvent arg0) {
	}
}
