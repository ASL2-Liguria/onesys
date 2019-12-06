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
package it.elco.mmg.anagrafica;

import it.elco.cache.CacheManager;
import it.elco.caronte.dataManager.impl.iDataManager;
import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.toolkit.toolKitShortcut;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import javax.servlet.http.HttpSession;

import oracle.jdbc.OraclePreparedStatement;
import oracle.jdbc.pool.OracleDataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.support.rowset.SqlRowSet;

public class RicercaRemotaWhale {
	private String GESTISCI_ESENZIONI = "N";
	
	private final int MAX_RECORD = 50;

	/**
	 * connessione Dati
	 */
	private Connection connDati;
	
	private iDataManager datamanager;

	/**
	 * Connessione per la vista AAC (anagrafe assistiti)
	 */
	private Connection connAAC;

	/**
	 * parametri vista AAC (anagrafe assistiti)
	 */
	private String AAC_ANAG_DRIVER_TYPE;
	private String AAC_ANAG_ADDRESS;
	private String AAC_ANAG_DB_NAME;
	private String AAC_ANAG_PORT;
	private String AAC_ANAG_USER;
	private String AAC_ANAG_PWD;
	private String AAC_REMOTE_ANAG_TABLE;

	/**
	 * parametri vista SIO (anagrafe ricoverati)
	 */
	private String SIO_COL_ID_ANAG_REMOTA = null;
	private String AAC_REMOTE_ANAG_TABLE_CAMPI_OBBLIGATORI = null;

	private String OE_REMOTEANAG_TABLE;

	private int QUERY_TIMEOUT;
	private String COL_ID_ANAG_REMOTA;
	private String userSession;

	private final Logger log;

	private HttpSession session;

	public RicercaRemotaWhale() {
		log = LoggerFactory.getLogger(getClass());
	}

	private long EsisteAnagrafica(String idAnagRemota) throws AnagraficaRemotaException {
		log.info("Richiamato: EsisteAnagrafica - " + idAnagRemota);
		long res = 0;

		Statement stmt = null;
		ResultSet rs;
		try {

			String sql = "SELECT * from RADSQL.COD_EST_ANAG WHERE " + COL_ID_ANAG_REMOTA + " = '" + idAnagRemota + "'";

			log.debug(sql);

			stmt = connDati.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			rs = stmt.executeQuery(sql);
			if (!rs.last()) {
				log.info("EsisteAnagrafica ritorna: 0");
				return 0;
			}

			if (rs.getRow() > 1) {
				String msg = "Identificativo remoto " + idAnagRemota + " duplicato";
				log.error("EsisteAnagrafica : " + msg);
				// throw new Exception(msg);
				return 0;
			}
			res = rs.getLong("IDEN_ANAG");
		} catch (Exception e) {
			log.error("EsisteAnagrafica [" + idAnagRemota + "] ", e.getMessage());
			throw new AnagraficaRemotaException(e);
		} finally {
			try {
				stmt.close();
			} catch (Exception e) {
			}
		}
		log.info("EsisteAnagrafica ritorna: " + res);
		return res;
	}

	private long InsertAnagrafica(String idAnagRemota) throws AnagraficaRemotaException {
		log.info("Richiamato: InsertAnagrafica - " + idAnagRemota);
		long res = 0;
		Statement stmt = null;
		ResultSet rs;
		try {
			String sql = "SELECT * FROM " + OE_REMOTEANAG_TABLE + " WHERE ID_ANAGREMOTA='" + idAnagRemota + "'";
			stmt = connDati.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			log.debug(sql);
			rs = stmt.executeQuery(sql);
			if (!rs.last())
				return 0;
			/*
			 * if(rs.getRow()>1){ String msg =
			 * "InsertAnagrafica : Identificativo remoto "+ idAnagRemota
			 * +" duplicato"; log.error(msg); throw new Exception(msg); }
			 */
			HashMap<String, String> dati = new HashMap<String, String>();
			dati.put("COGN", rs.getString("COGN"));
			dati.put("NOME", rs.getString("NOME"));
			dati.put("SESSO", rs.getString("SESSO"));
			dati.put("DATA", rs.getString("DATA"));
			dati.put("COD_FISC", rs.getString("COD_FISC"));
			dati.put("COM_NASC", rs.getString("COM_NASC"));
			dati.put("COM_RES", rs.getString("COM_RES"));
			dati.put("DATA_MORTE", rs.getString("DATA_MORTE"));
			dati.put("INDIR", rs.getString("INDIR"));
			dati.put("CAP", rs.getString("CAP"));
			dati.put("DOM_INDIR", rs.getString("DOM_INDIR"));
			dati.put("DOM_COMUNE", rs.getString("DOM_COMUNE"));
			dati.put("TEL", rs.getString("TEL"));
			dati.put("CREG", rs.getString("CREG"));
			dati.put("CUSL", rs.getString("CUSL"));

			String sqlInsert = creaInsert("ANAG", dati);
			log.debug(sqlInsert);
			Statement stmtInsert = null;
			Statement stmtUpd = null;
			try {
				stmtInsert = connDati.createStatement();
				int insertedRows = stmtInsert.executeUpdate(sqlInsert);
				if (insertedRows == 0) {
					String msg = "InsertAnagrafica : Errore nell'insert " + sqlInsert + " in ANAG";
					log.error(msg);
					throw new Exception(msg);
				}
				String sqlSeq = "SELECT RADSQL.SEQ_ANAG.CURRVAL FROM DUAL";
				String sequenceValue = null;
				log.debug(sqlSeq);
				ResultSet rsSeq = stmtInsert.executeQuery(sqlSeq);
				if (rsSeq.next()) {
					sequenceValue = rsSeq.getString(1);
					res = Long.parseLong(sequenceValue);
				} else {
					String msg = "InsertAnagrafica : Errore nella gestione della sequence " + sqlSeq + " in ANAG";
					log.error(msg);
					throw new Exception();
				}

				String sqlUpd = "UPDATE RADSQL.COD_EST_ANAG " + "SET " + COL_ID_ANAG_REMOTA + " = '" + idAnagRemota + "' " + " where IDEN_ANAG='" + sequenceValue + "'";
				log.debug("InsertAnagrafica : " + sqlUpd);
				stmtUpd = connDati.createStatement();
				insertedRows = stmtUpd.executeUpdate(sqlUpd);
				if (insertedRows == 0) {
					String msg = "InsertAnagrafica : Errore nell'update " + sqlUpd + " in COD_EST_ANAG";
					log.error(msg);
					throw new Exception();
				}

				if ("Y".equalsIgnoreCase(GESTISCI_ESENZIONI)) {
					callRrAllineaEsenzioniRemote(rs.getString("NOME"), rs.getString("COGN"), rs.getString("SESSO"), rs.getString("COD_FISC"));
				}

			} finally {
				try {
					stmtInsert.close();
				} catch (Exception e) {
				}
				try {
					stmtUpd.close();
				} catch (Exception e) {
				}
			}
		} catch (Exception e) {
			log.error("InsertAnagrafica [" + idAnagRemota + "] " + e.getMessage());
			throw new AnagraficaRemotaException(e);
		} finally {
			try {
				stmt.close();
			} catch (Exception e) {
			}
		}
		log.info("InsertAnagrafica ritorna: " + res);
		return res;
	}

	public short ricerca(String[] aBind, String[] aVal) throws AnagraficaRemotaException {
		short rowCount = 0;

		try {
			connAAC = getOracleConnection(AAC_ANAG_DRIVER_TYPE, AAC_ANAG_ADDRESS, AAC_ANAG_DB_NAME, Integer.valueOf(AAC_ANAG_PORT), AAC_ANAG_USER, AAC_ANAG_PWD);
			log.debug("connessione connAAC = " + connAAC.toString());

			StringBuilder queryView = new StringBuilder("SELECT * FROM " + AAC_REMOTE_ANAG_TABLE);
			queryView.append(" WHERE NOME like :nome || '%'");
			queryView.append(" AND COGNOME like :cogn || '%' ");
			queryView.append(" AND (:data is null or DATA_NASCITA = to_date(:data, 'YYYYMMDD'))");
			queryView.append(" AND COD_FISCALE like nvl(:cod_fisc, '%') ");

			log.debug(queryView.toString());

			rowCount = eseguiRicerca(queryView.toString(), aBind, aVal, connAAC);
		} finally {
			try {
				connAAC.close();
			} catch (Exception e) {
				log.error(e.getMessage());
			}
		}
		log.info("Ritornate " + rowCount + " righe");
		return rowCount;
	}

	public void RimuoviDati() {
		log.info("Richiamato: RimuoviDati");

		Statement stmt = null;
		String sql = "DELETE FROM " + OE_REMOTEANAG_TABLE + " WHERE USER_SESSION='" + userSession + "'"
				+ " OR DATA_INS < (SYSDATE + NUMTODSINTERVAL (-1, 'DAY'))";
		log.debug(sql);

		try {
			stmt = connDati.createStatement();
			stmt.executeUpdate(sql);
		} catch (Exception e) {
			log.error("RimuoviDati per userSession [" + userSession + "]: " + e.getMessage());
		} finally {
			try {
				stmt.close();
			} catch (Exception e) {
			}
		}

	}

	public void setConnections() throws Exception {
		
		this.datamanager = CaronteFactory.getFactory().createDataManager("WHALE", toolKitShortcut.generateClientID(this.session));
		this.connDati = CaronteFactory.getFactory().createDataSource("WHALE", toolKitShortcut.generateClientID(this.session)).getConnection();
		
		caricaParametriConfiguraModuli();
	}

	public void setUserSession(HttpSession session) {
		this.session = session;
		this.userSession = session.getId();
	}

	private void caricaParametriConfiguraModuli() throws Exception {
		SqlRowSet rs;
		try {
			CacheManager cm = new CacheManager("RicercaRemotaWhale");
			rs = (SqlRowSet) cm.getObject("CONFIGURAZIONE");
			if (rs != null) {
				rs.beforeFirst();
			} else {
				rs = datamanager.getSqlRowSetByQuery("RICERCA_REMOTA.CONFIGURAZIONE");
				cm.setObject("CONFIGURAZIONE", rs);
			}
			while (rs.next()) {
				String variabile = rs.getString("VARIABILE");
				String valore = rs.getString("VALORE");
				log.debug(variabile + " = " + valore);
				/*				
				try {
					this.getClass().getField(variabile).set(this, valore);
				} catch (Exception e) {
					log.error(variabile + " = " + valore + " - " + e.getMessage());
				}
				*/

				if (variabile.equals("AAC_ANAG_ADDRESS"))
					AAC_ANAG_ADDRESS = valore;
				else if (variabile.equals("AAC_ANAG_DB_NAME"))
					AAC_ANAG_DB_NAME = valore;
				else if (variabile.equals("AAC_ANAG_DRIVER_TYPE"))
					AAC_ANAG_DRIVER_TYPE = valore;
				else if (variabile.equals("AAC_ANAG_PORT"))
					AAC_ANAG_PORT = valore;
				else if (variabile.equals("AAC_ANAG_USER"))
					AAC_ANAG_USER = valore;
				else if (variabile.equals("AAC_ANAG_PWD"))
					AAC_ANAG_PWD = valore;
				else if (variabile.equals("AAC_REMOTE_ANAG_TABLE"))
					AAC_REMOTE_ANAG_TABLE = valore;
				else if (variabile.equals("QUERY_TIMEOUT"))
					QUERY_TIMEOUT = Integer.valueOf(valore);
				else if (variabile.equals("COL_ID_ANAG_REMOTA"))
					COL_ID_ANAG_REMOTA = valore;
				else if (variabile.equals("OE_REMOTEANAG_TABLE"))
					OE_REMOTEANAG_TABLE = valore;
				else if (variabile.equals("SIO_COL_ID_ANAG_REMOTA"))
					SIO_COL_ID_ANAG_REMOTA = valore;
				else if (variabile.equals("GESTISCI_ESENZIONI")) {
					GESTISCI_ESENZIONI = valore;
				} else if (variabile.equals("AAC_REMOTE_ANAG_TABLE_CAMPI_OBBLIGATORI")) {
					AAC_REMOTE_ANAG_TABLE_CAMPI_OBBLIGATORI = valore;
				}

			}
		} catch (Exception e) {
			throw new AnagraficaRemotaException("caricaParametriConfiguraModuli - " + e.getStackTrace());
		}
	}

	private Connection getOracleConnection(String driverType, String serverName, String dbName, int portNumber, String user, String pwd) {
		try {
			OracleDataSource ods = null;
			ods = new OracleDataSource();
			ods.setDriverType(driverType);
			ods.setServerName(serverName);
			ods.setDatabaseName(dbName);
			ods.setPortNumber(portNumber);
			ods.setUser(user);
			ods.setPassword(pwd);
			return ods.getConnection();
		} catch (SQLException sqle) {
			log.error(sqle.getLocalizedMessage(), sqle);
			return null;
		}
	}

	/**
	 * Metodo che crea una insert sql.<br>
	 * Nell'HashMap <code> dati </code> la key rappresenta il nome colonna
	 * mentre il value il dato da inserire.
	 * 
	 * @param tabella
	 * @param dati
	 * @return
	 */
	private static String creaInsert(String tabella, HashMap<String, String> dati) {

		Set<String> keys = dati.keySet();

		StringBuffer sql = new StringBuffer("INSERT INTO " + tabella + " ");
		StringBuffer cols = new StringBuffer();
		StringBuffer vals = new StringBuffer();
		Iterator<String> iter = keys.iterator();
		String key;
		String value;
		while (iter.hasNext()) {
			key = iter.next();
			value = dati.get(key);
			if (value == null)
				value = "";
			cols.append(key + ", ");
			vals.append("'" + value.replaceAll("'", "''") + "', ");
		}
		cols.replace(cols.length() - 2, cols.length(), "");
		vals.replace(vals.length() - 2, vals.length(), "");

		sql.append("(" + cols + ")");
		sql.append(" VALUES (" + vals + ")");

		return sql.toString();
	}

	private static String formattaData(String pattern, Date data) {
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		return sdf.format(data);
	}

	private short eseguiRicerca(String query, String[] aBind, String[] aVal, Connection conn) throws AnagraficaRemotaException {
		log.info("Richiamato: eseguiRicerca - " + query);

		if (AAC_REMOTE_ANAG_TABLE_CAMPI_OBBLIGATORI != null && !AAC_REMOTE_ANAG_TABLE_CAMPI_OBBLIGATORI.equals("")) {
			log.info("Aggiunta gestione campi obbligatori");
			query = query + AAC_REMOTE_ANAG_TABLE_CAMPI_OBBLIGATORI;
		}
		
		//query = query + " and rownum <= " + MAX_RECORD + 1;

		OraclePreparedStatement stmt = null;
		ResultSet rs = null;
		short rowCount = 0;

		try {
			log.debug(query);
			stmt = (OraclePreparedStatement) conn.prepareStatement(query);
			
			for (int cnt = 0; cnt < aBind.length; cnt++) {
				String key = aBind[cnt];
				String value = aVal[cnt];
				stmt.setStringAtName(key, value == null ? "" : value);
			}
			stmt.setQueryTimeout(this.QUERY_TIMEOUT);
			rs = stmt.executeQuery();
			int counter = 0;
			while (rs.next()) {
				counter++;
				if (counter > MAX_RECORD) {
					log.error("Troppi risultati, aggiungere dettagli alla ricerca del paziente");
					throw new AnagraficaRemotaException("Troppi risultati, aggiungere dettagli alla ricerca del paziente");
				}
				HashMap<String, String> dati = new HashMap<String, String>();
				dati.put("COGN", rs.getString("COGNOME"));
				dati.put("NOME", rs.getString("NOME"));
				dati.put("SESSO", rs.getString("SESSO"));
				dati.put("DATA", formattaData("yyyyMMdd", rs.getDate("DATA_NASCITA")));
				dati.put("COD_FISC", rs.getString("COD_FISCALE"));
				dati.put("ID_ANAGREMOTA", rs.getString(SIO_COL_ID_ANAG_REMOTA));
				dati.put("USER_SESSION", userSession);
				String cpn = rs.getString("COD_PROVINCIA_NASC");
				if (cpn == null)
					cpn = "";
				String ccn = rs.getString("COD_COMUNE_NASC");
				if (ccn == null)
					cpn = "";
				dati.put("COM_NASC", cpn + ccn);

				String cpr = rs.getString("COD_PROVINCIA_RESID");
				String ccr = rs.getString("COD_COMUNE_RESID");
				if (cpr != null && ccr != null)
					dati.put("COM_RES", cpr + ccr);
				try {
					Date data = rs.getDate("DATA_DECESSO");
					if (data != null)
						dati.put("DATA_MORTE", formattaData("yyyyMMdd", data));
				} catch (Exception e) {
					log.error("DATA_DECESSO - " + e.getMessage());
				}
				// dati.put("COD_NAZIONE",
				// rs.getString("COD_NAZIONALITA"));/////////////////////////
				try {
					dati.put("INDIR", rs.getString("IND_RESIDENZA"));
				} catch (Exception e) {
					log.error("IND_RESIDENZA - " + e.getMessage());
				}
				try {
					dati.put("CAP", rs.getString("CAP_RESIDENZA"));
				} catch (Exception e) {
					log.error("CAP_RESIDENZA - " + e.getMessage());
				}
				// dati.put("PROV",
				// rs.getString("COD_PROVINCIA_RESID"));/////////////////////////
				try {
					dati.put("DOM_INDIR", rs.getString("IND_DOMICILIO"));
				} catch (Exception e) {
					log.error("IND_DOMICILIO - " + e.getMessage());
				}
				try {
					dati.put("DOM_CAP", rs.getString("CAP_DOMICILIO"));
				} catch (Exception e) {
					log.error("CAP_DOMICILIO - " + e.getMessage());
				}
				/*
				try {
					dati.put("DOM_PROV", rs.getString("COD_PROV_DOMICILIO"));
				} catch (Exception e) {
					log.error("COD_PROVINCIA_DOMIC - " + e.getMessage());
				}
				*/
				try {
					String cpd = rs.getString("COD_PROVINCIA_DOMIC");
					if (cpd == null)
						cpd = "";
					String ccd = rs.getString("COD_COMUNE_DOMIC");
					if (ccd == null)
						ccd = "";
					dati.put("DOM_COMUNE", cpd + ccd);
				} catch (Exception e) {
					log.error("COD_PROVINCIA_DOMIC - COD_COMUNE_DOMIC - " + e.getMessage());
				}
				try {
					dati.put("TEL", rs.getString("NUM_TELEFONO"));
				} catch (Exception e) {
					log.error("NUM_TELEFONO - " + e.getMessage());
				}
				try {
					dati.put("CREG", rs.getString("COD_REGIONE"));
				} catch (Exception e) {
					log.error("COD_REGIONE - " + e.getMessage());
				}
				try {
					dati.put("CUSL", rs.getString("COD_ASL"));
				} catch (Exception e) {
					log.error("COD_ASL - " + e.getMessage());
				}
				String sqlInsert = creaInsert(OE_REMOTEANAG_TABLE, dati);
				log.debug(sqlInsert);
				Statement stmtInsert = null;
				try {
					stmtInsert = connDati.createStatement();
					int insertedRows = stmtInsert.executeUpdate(sqlInsert);
					if (insertedRows == 0) {
						log.error("Errore anagrafica remota [" + sqlInsert + "] in " + OE_REMOTEANAG_TABLE);
						throw new AnagraficaRemotaException("Errore anagrafica remota");
					}
					rowCount++;
				} catch (SQLException ex) {
					log.error("Errore anagrafica remota - insert [" + sqlInsert + "] in " + OE_REMOTEANAG_TABLE + " - " + ex.getMessage());
					throw new AnagraficaRemotaException("Errore anagrafica remota - insert");
				} finally {
					try {
						stmtInsert.close();
					} catch (Exception e) {
						log.error(e.getLocalizedMessage(), e);
					}
				}
			}

		} catch (SQLException ex) {
			log.error("Errore anagrafica remota - select - " + ex.getMessage(), ex);
			throw new AnagraficaRemotaException("Errore anagrafica remota - select");
		} finally {
			try {
				stmt.close();
			} catch (Exception e) {
				log.error(e.getLocalizedMessage(), e);
			}
		}
		return rowCount;

	}

	private void callRrAllineaEsenzioniRemote(String nome, String cognome, String sesso, String codiceFiscale) {
		CallableStatement cs = null;

		try {
			cs = connDati.prepareCall("{call RADSQL.RR_ALLINEA_ESENZIONI_REMOTE (?, ?, ?, ?)}");
			cs.setString(1, nome);
			cs.setString(2, cognome);
			cs.setString(3, sesso);
			cs.setString(4, codiceFiscale);
			cs.execute();
		} catch (SQLException sqle) {
			log.error(sqle.getMessage());
		} finally {
			try {
				cs.close();
			} catch (Exception e) {
				log.error(e.getMessage());
			}
		}
	}

	public void ciclaRecord() throws AnagraficaRemotaException {
		CallableStatement cs = null;
		ResultSet rs = null;
		try {
			cs = connDati.prepareCall("select ID_ANAGREMOTA from " + OE_REMOTEANAG_TABLE + " where USER_SESSION=:user_session");
			cs.setString("user_session", this.userSession);
			rs = cs.executeQuery();
			while (rs.next()) {
				String ID_ANAGREMOTA = rs.getString("ID_ANAGREMOTA");
				if (this.EsisteAnagrafica(ID_ANAGREMOTA) <= 0) {
					this.InsertAnagrafica(ID_ANAGREMOTA);
				}
			}
		} catch (SQLException sqle) {
			log.error("ciclaRecord, userSession [" + this.userSession + "] " + sqle.getMessage());
			throw(new AnagraficaRemotaException(sqle));
		} finally {
			try {rs.close(); rs = null;} catch (Exception e){};
			try {cs.close(); cs = null;} catch (Exception e) {};
		}
	}
	
	public void destroy() {
		try {RimuoviDati();} catch (Exception e) {};
		try {connDati.close(); connDati = null;} catch (Exception e){};
	}

}
