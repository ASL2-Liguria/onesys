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
import static java.util.logging.Level.FINE;
import static java.util.logging.Level.INFO;
import static java.util.logging.Level.SEVERE;
import imago.http.baseClass.baseUser;
import imago.sql.AnagraficaRemota;
import imago.sql.AnagraficaRemotaException;
import imago.sql.AnagraficaRemotaRicoverati;
import imago.sql.dbConnections;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import java.util.logging.Level;

import javax.servlet.ServletContext;

import oracle.jdbc.pool.OracleDataSource;


public class RicercaRemotaWhale implements AnagraficaRemotaRicoverati, AnagraficaRemota {

	/**
	 * se settato a false logga su DB; se true logga su System.out
	 */
	boolean printLog = true; //se true stampa a video; se false logga su DB
	boolean gestisciNosologico = false;
	boolean gestisciEsenzioni = false;

	/**
	 * connessione Dati
	 */
	Connection connDati;

	/**
	 * connessione Web (CONFIGURA_MODULI)
	 */
	Connection connWeb;

	/**
	 * Connessione per la vista AAC (anagrafe assistiti)
	 */
	Connection connAAC;

	/**
	 * Connessione per la vista SIO (anagrafe ricoverati)
	 */
	Connection connSio;

	/**
	 * parametri vista AAC (anagrafe assistiti)
	 */
	String aacDriverType;
	String aacAddress;
	String aacDbName;
	String aacPort;
	String aacUser;
	String aacPwd;
	String aacRemoteTable;

	/**
	 * parametri vista SIO (anagrafe ricoverati)
	 */
	String sioViewDriverType;
	String sioViewAddress = null;
	String sioViewDbName;
	String sioViewPort;
	String sioViewUser;
	String sioViewPwd;
	String sioRemoteTable;
	String sioRemoteTablePre = null;
	String sioRemoteTableDimProtetta = null;
	String sioColProvenienza;
	String sioColIdAnagRemota = null;
	String sioGestisciRicovero = null;
	String campiObbligatori = null;

	String sequenceName;
	String oeRemoteAnagTable;


	int queryTimeOut;
	String colIdAnagRemota;
	String userSession;
	String sqlInsLog;
	PreparedStatement pstmtLog;
	Level logLevel;
	



	public RicercaRemotaWhale() {
		super();
		sqlInsLog = "Insert into TAB_LOGS " +
		" (COL_DATE, COL_TIME, COL_MILLIS, " +
		"COL_SEQUENCE, COL_LEVEL, COL_LOGGER, " +
		"COL_THREAD, COL_CLASS, COL_METHOD, " +
		"COL_MESSAGE, COL_HOST) " +
		" Values " +
		" (?, ?, ?, " +
		"0, ?, ?, " +
		"' ', 'RicercaRemotaWhale', ?," +
		"?, ' ')";
	}


	public long EsisteAnagrafica(String idAnagRemota) throws AnagraficaRemotaException {
		log(INFO, "Richiamato: EsisteAnagrafica - " + idAnagRemota, "EsisteAnagrafica");
		long res = 0;

		Statement stmt = null;
		ResultSet rs = null;
		try	{

			String sql = "SELECT * from COD_EST_ANAG WHERE " + colIdAnagRemota + " = '" + idAnagRemota + "'";

			log(FINE, sql, "EsisteAnagrafica");

			stmt = connDati.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			rs = stmt.executeQuery(sql);
			if(!rs.last()){
				log(INFO, "EsisteAnagrafica ritorna: 0", "EsisteAnagrafica");
				return 0;
			}

			if(rs.getRow() > 1){
				String msg = "Identificativo remoto " + idAnagRemota + " duplicato";
				log(SEVERE, "EsisteAnagrafica : " + msg, "EsisteAnagrafica");
				//throw new Exception(msg);
				return 0;
			}
			res = rs.getLong("IDEN_ANAG");
		}
		catch(Exception e)
		{
			log(SEVERE, e.getMessage(), "EsisteAnagrafica");
			throw new AnagraficaRemotaException(e);
		}
		finally
		{
			try
			{
				stmt.close(); }
			catch(Exception e)
			{}
		}
		log(INFO, "EsisteAnagrafica ritorna: " + res, "EsisteAnagrafica");
		return res;
	}

	public long InsertAnagrafica(String idAnagRemota) throws AnagraficaRemotaException {
		log(INFO, "Richiamato: InsertAnagrafica - " + idAnagRemota, "InsertAnagrafica");
		long res = 0;
		Statement stmt = null;
		ResultSet rs = null;
		String nosologico = null;
		try
		{
			String sql = "SELECT * FROM " + oeRemoteAnagTable +
			" WHERE ID_ANAGREMOTA='" + idAnagRemota + "'";
			stmt = connDati.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			log(FINE, sql, "InsertAnagrafica");
			rs = stmt.executeQuery(sql);
			if(!rs.last())
				return 0;
			/*if(rs.getRow()>1){
	     String msg = "InsertAnagrafica : Identificativo remoto "+ idAnagRemota +" duplicato";
	     log(SEVERE, msg, "InsertAnagrafica");
	     throw new Exception(msg);
	       }*/
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
			try
			{
				nosologico = rs.getString("NUM_NOSOLOGICO"); }
			catch(Exception e)
			{
				e.printStackTrace(); }

			String sqlInsert = creaInsert("ANAG", dati);
			log(FINE, sqlInsert, "InsertAnagrafica");
			Statement stmtInsert = null;
			Statement stmtUpd = null;
			try
			{
				stmtInsert = connDati.createStatement();
				int insertedRows = stmtInsert.executeUpdate(sqlInsert);
				if(insertedRows == 0){
					String msg = "InsertAnagrafica : Errore nell'insert " + sqlInsert + " in ANAG";
					log(SEVERE, msg, "InsertAnagrafica");
					throw new Exception(msg);
				}
				String sqlSeq = "SELECT SEQ_ANAG.CURRVAL FROM DUAL";
				String sequenceValue = null;
				log(FINE, sqlSeq, "InsertAnagrafica");
				ResultSet rsSeq = stmtInsert.executeQuery(sqlSeq);
				if(rsSeq.next()){
					sequenceValue = rsSeq.getString(1);
					res = Long.parseLong(sequenceValue);
				}
				else
				{
					String msg = "InsertAnagrafica : Errore nella gestione della sequence " + sqlSeq + " in ANAG";
					log(SEVERE, msg, "InsertAnagrafica");
					throw new Exception();
				}

				String sqlUpd = "UPDATE COD_EST_ANAG " +
				"SET " + colIdAnagRemota + " = '" + idAnagRemota + "' " +
				" where IDEN_ANAG='" + sequenceValue + "'";
				log(FINE, "InsertAnagrafica : " + sqlUpd);
				stmtUpd = connDati.createStatement();
				insertedRows = stmtUpd.executeUpdate(sqlUpd);
				if(insertedRows == 0)
				{
					String msg = "InsertAnagrafica : Errore nell'update " + sqlUpd + " in COD_EST_ANAG";
					log(SEVERE, msg, "InsertAnagrafica");
					throw new Exception();
				}

				if(gestisciNosologico)
				{
					try
					{
						if(nosologico != null)
						{
							String delNos = "UPDATE NOSOLOGICI_PAZIENTE SET DELETED = 'S' " +
							" WHERE IDEN_ANAG = '" + sequenceValue + "' AND ASSIGNING_AUTHORITY = 'WHALE'";
							stmt.executeUpdate(delNos);
							String insNos = "INSERT INTO NOSOLOGICI_PAZIENTE " +
							"       ( IDEN_ANAG, NUM_NOSOLOGICO, ASSIGNING_AUTHORITY) " +
							"values ('" + sequenceValue + "','" + nosologico + "','WHALE')";
							stmt.executeUpdate(insNos);
						}
					}
					catch(Exception e)
					{
						e.printStackTrace();
					}
				}
				
				if(gestisciEsenzioni) {	
					callRrAllineaEsenzioniRemote(rs.getString("NOME"), rs.getString("COGN"), rs.getString("SESSO"), rs.getString("COD_FISC"));
				}

			}
			finally
			{
				try
				{
					stmtInsert.close(); }
				catch(Exception e)
				{}
				try
				{
					stmtUpd.close(); }
				catch(Exception e)
				{}
			}
		}
		catch(Exception e)
		{
			throw new AnagraficaRemotaException(e);
		}
		finally
		{
			try
			{
				stmt.close(); }
			catch(Exception e)
			{}
		}
		log(INFO, "InsertAnagrafica ritorna: " + res, "InsertAnagrafica");
		return res;
	}

	public short RicercaPerCodiceFiscale(String codiceFiscale) throws AnagraficaRemotaException {
		log(INFO, "Richiamato: RicercaPerCodiceFiscale - " + codiceFiscale, "RicercaPerCodiceFiscale");
		short rowCount = 0;
		try
		{
			connAAC = getOracleConnection(aacDriverType, aacAddress, aacDbName, Integer.valueOf(aacPort), aacUser, aacPwd);
			log(FINE, "connessione connAAC = " + connAAC.toString(), "RicercaPerCodiceFiscale");

			String queryView = "SELECT * FROM " + aacRemoteTable + " WHERE COD_FISC = '" + codiceFiscale + "'";
			log(FINE, queryView, "RicercaPerCodiceFiscale");

			rowCount = eseguiRicerca(queryView, connAAC);
		}
		catch(Exception e)
		{
			throw new AnagraficaRemotaException(e);
		}
		finally
		{
			try{connAAC.close(); }catch(Exception e){}
		}
		log(INFO, "Ritornate " + rowCount + " righe", "RicercaPerCodiceFiscale");
		return rowCount;
	}


	public short RicercaPerNomeCognomeData(String nome, String cognome, String data) throws AnagraficaRemotaException {
		log(INFO, "Richiamato: RicercaPerNomeCognomeData - " + nome + " - " + cognome + " - " + data, "RicercaPerNomeCognomeData");
		short rowCount = 0;

		try
		{
			connAAC = getOracleConnection(aacDriverType, aacAddress, aacDbName, Integer.valueOf(aacPort), aacUser, aacPwd);
//			log(FINE, "connessione connAAC = " + connAAC.toString(), "RicercaPerNomeCognomeData");

			StringBuffer queryView = new StringBuffer("SELECT * FROM " + aacRemoteTable);
			queryView.append(" WHERE NOME like '" + nome.replaceAll("'", "''") + "%'");
			queryView.append(" AND COGNOME like '" + cognome.replaceAll("'", "''") + "%' ");
			if((data != null) && !data.equals(""))
				queryView.append(" AND DATA_NASCITA = to_date('" + data + "', 'DD/MM/YYYY')");
			log(FINE, queryView.toString(), "RicercaPerNomeCognomeData");

			rowCount = eseguiRicerca(queryView.toString(), connAAC);
		}
		catch(Exception e)
		{
			throw new AnagraficaRemotaException(e);
		}
		finally
		{
			try{connAAC.close(); }catch(Exception e){}
		}
		log(INFO, "Ritornate " + rowCount + " righe", "RicercaPerNomeCognomeData");
		return rowCount;
	}



	/**/
	public short RicercaPerNomeCognomeDataCodiceFiscale(String nome, String cognome, String data, String codiceFiscale) throws AnagraficaRemotaException {
		log(INFO, "Richiamato: RicercaPerNomeCognomeData - " + nome + " - " + cognome + " - " + data, "RicercaPerNomeCognomeData");
		short rowCount = 0;

		try
		{
			connAAC = getOracleConnection(aacDriverType, aacAddress, aacDbName, Integer.valueOf(aacPort), aacUser, aacPwd);
			log(FINE, "connessione connAAC = " + connAAC.toString(), "RicercaPerNomeCognomeData");

			StringBuffer queryView = new StringBuffer("SELECT * FROM " + aacRemoteTable);
			queryView.append(" WHERE NOME like '" + nome.replaceAll("'", "''") + "%'");
			queryView.append(" AND COGNOME like '" + cognome.replaceAll("'", "''") + "%' ");
			if((data != null) && !data.equals(""))
				queryView.append(" AND DATA_NASCITA = to_date('" + data + "', 'DD/MM/YYYY')");
			if((codiceFiscale != null) && !codiceFiscale.equals(""))
				queryView.append(" AND COD_FISCALE like '" + codiceFiscale.replaceAll("'", "''") + "%' ");


			log(FINE, queryView.toString(), "RicercaPerNomeCognomeDataCodiceFiscale");

			rowCount = eseguiRicerca(queryView.toString(), connAAC);
		}
		catch(Exception e)
		{
			throw new AnagraficaRemotaException(e);
		}
		finally
		{
			try{connAAC.close(); }catch(Exception e){}
		}
		log(INFO, "Ritornate " + rowCount + " righe", "RicercaPerNomeCognomeDataCodiceFiscale");
		return rowCount;
	}

	/**/

	public short RicercaPerNumeroArchivio(String arg0) throws AnagraficaRemotaException {
		try
		{
			throw new Exception("Metodo di ricerca non implementato");
		}
		catch(Exception e)
		{
			throw new AnagraficaRemotaException(e);
		}
		finally
		{
			//try{connAAC.close();}catch(Exception e){}
		}
	}


	public short RicercaPerNumeroNosologico(String arg0) throws AnagraficaRemotaException {
		try
		{
			throw new Exception("Metodo di ricerca non implementato");
		}
		catch(Exception e)
		{
			throw new AnagraficaRemotaException(e);
		}
		finally
		{
			//try{connAAC.close();}catch(Exception e){}
		}
	}


	public short RicercaPerPatientID(String PID) throws AnagraficaRemotaException {
		log(INFO, "Richiamato: RicercaPerPatientID - " + PID, "RicercaPerPatientID");
		short rowCount = 0;

		try
		{
			connAAC = getOracleConnection(aacDriverType, aacAddress, aacDbName, Integer.valueOf(aacPort), aacUser, aacPwd);
			log(FINE, "connessione connAAC = " + connAAC.toString(), "RicercaPerPatientID");

			String queryView = "SELECT * FROM " + aacRemoteTable +
			" WHERE " + sioColIdAnagRemota + " = '" + PID + "'";
			log(FINE, "RicercaPerPatientID - " + queryView);

			rowCount = eseguiRicerca(queryView, connAAC);
		}
		catch(Exception e)
		{
			throw new AnagraficaRemotaException(e);
		}
		finally
		{
			try{connAAC.close(); }catch(Exception e){}
		}
		log(INFO, "Ritornate " + rowCount + " righe", "RicercaPerPatientID");
		return rowCount;
	}


	public void RimuoviDati() throws AnagraficaRemotaException {
		log(INFO, "Richiamato: RimuoviDati", "RimuoviDati");

		Statement stmt = null;
		String sql = "DELETE FROM " + oeRemoteAnagTable + " WHERE USER_SESSION='" + userSession + "'" +
		" OR DATA_INS < (SYSDATE + NUMTODSINTERVAL (-1, 'DAY'))";
		log(FINE, sql, "RimuoviDati");

		try
		{
			stmt = connDati.createStatement();
			stmt.executeUpdate(sql);
		}
		catch(Exception e)
		{
			throw new AnagraficaRemotaException("RimuoviDati - " + e.getMessage());
		}
		finally
		{
			try{stmt.close(); }catch(Exception e){}
		}

	}


	public void UpdateAnagrafica(String idAnagRemota) throws AnagraficaRemotaException {
		log(INFO, "Richiamato: UpdateAnagrafica - " + idAnagRemota, "UpdateAnagrafica");

		Statement stmt = null;
		Statement stmtUpd = null;
		ResultSet rs = null;

		String nosologico = null;

		try
		{
			stmt = connDati.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

			String idRis = String.valueOf(EsisteAnagrafica(idAnagRemota));

			String sqlRemAnag = "SELECT * FROM " + oeRemoteAnagTable + " where ID_ANAGREMOTA = '" + idAnagRemota + "'";
			log(FINE, sqlRemAnag, "UpdateAnagrafica");

			rs = stmt.executeQuery(sqlRemAnag);
			if(!rs.next())
			{
				String msg = "Identificativo remoto " + idAnagRemota + " non trovato su REMOTEANAG";
				log(SEVERE, msg, "UpdateAnagrafica");
				throw new Exception(msg);
			}
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
			dati.put("DELETED", "N");
			try{
				nosologico = rs.getString("NUM_NOSOLOGICO");
				}
			catch(Exception e){
				e.printStackTrace();
				}
			String whereCondition = " IDEN = " + idRis;
			String sqlUpd = creaUpdate("ANAG", dati, whereCondition);
			log(INFO, sqlUpd, "UpdateAnagrafica");

			stmtUpd = connDati.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			int updatedRows = stmtUpd.executeUpdate(sqlUpd);
			if(updatedRows == 0){
				String msg = "Errore nell'update " + sqlUpd + " in ANAG";
				log(SEVERE, msg, "UpdateAnagrafica");
				throw new Exception(msg);
			}

			if(gestisciNosologico){
				try{
					if(nosologico != null){
						String delNos = "UPDATE NOSOLOGICI_PAZIENTE SET DELETED = 'S' " +
						" WHERE IDEN_ANAG = '" + idRis + "' AND ASSIGNING_AUTHORITY = 'WHALE'";
						stmt.executeUpdate(delNos);
						String insNos = "INSERT INTO NOSOLOGICI_PAZIENTE " +
						"       ( IDEN_ANAG, NUM_NOSOLOGICO, ASSIGNING_AUTHORITY) " +
						"values ('" + idRis + "','" + nosologico + "','WHALE')";
						stmt.executeUpdate(insNos);
					}
				}
				catch(Exception e){
					e.printStackTrace();
					}
			}
			
			if(gestisciEsenzioni) {	
				callRrAllineaEsenzioniRemote(rs.getString("NOME"), rs.getString("COGN"), rs.getString("SESSO"), rs.getString("COD_FISC"));
			}

		}
		catch(Exception e){
			throw new AnagraficaRemotaException(e);
		}
		finally
		{
			try	{stmt.close(); }catch(Exception e){}
			try{stmtUpd.close(); }catch(Exception e){}
		}
	}


	public void setConnections(dbConnections dbConn) throws AnagraficaRemotaException {
		try		{
			connDati = dbConn.getDataConnection();
			connWeb = dbConn.getWebConnection();
		}
		catch(Exception e){
			e.printStackTrace();
			throw new AnagraficaRemotaException(e);
		}

		try
		{
			caricaParametriConfiguraModuli();
			pstmtLog = connDati.prepareStatement(sqlInsLog);
		}
		catch(Exception e)
		{
			throw new AnagraficaRemotaException("setConnections - " + e);
		}

	}

	/**
	 * utilizzata per test
	 * @param conn
	 * @throws AnagraficaRemotaException
	 */
	public void setConnections(Connection conn) throws Exception {
		connDati = conn;
		userSession = "DavideTest";
		pstmtLog = connDati.prepareStatement(sqlInsLog);
		caricaParametriConfiguraModuli();
	}


	public void setServletContext(ServletContext arg0) throws AnagraficaRemotaException {}


	public void setUserSession(String userSession) throws AnagraficaRemotaException {
		this.userSession = userSession;
//		try
//		{
//			caricaParametriConfiguraModuli();
//			pstmtLog = connDati.prepareStatement(sqlInsLog);
//		}
//		catch(Exception e)
//		{
//			throw new AnagraficaRemotaException("setUserSession - " + e);
//		}
	}

	private void caricaParametriConfiguraModuli() throws Exception {
		Statement stmt = null;
		ResultSet rs = null;
		try {
			String sql = "SELECT * FROM CONFIGURA_MODULI WHERE MODULO = 'RICERCA_REMOTA_WHALE'";
			stmt = connWeb.createStatement();
			rs = stmt.executeQuery(sql);
			while(rs.next()){
				String variabile = rs.getString("VARIABILE");
				String valore = rs.getString("VALORE");
				System.out.println(variabile + " = " + valore);

				if(variabile.equals("AAC_ANAG_ADDRESS"))
					aacAddress = valore;
				else if(variabile.equals("AAC_ANAG_DB_NAME"))
					aacDbName = valore;
				else if(variabile.equals("AAC_ANAG_DRIVER_TYPE"))
					aacDriverType = valore;
				else if(variabile.equals("AAC_ANAG_PORT"))
					aacPort = valore;
				else if(variabile.equals("AAC_ANAG_USER"))
					aacUser = valore;
				else if(variabile.equals("AAC_ANAG_PWD"))
					aacPwd = valore;
				else if(variabile.equals("AAC_REMOTE_ANAG_TABLE"))
					aacRemoteTable = valore;

				else if(variabile.equals("SIO_ANAG_ADDRESS"))
					sioViewAddress = valore;
				else if(variabile.equals("SIO_ANAG_DB_NAME"))
					sioViewDbName = valore;
				else if(variabile.equals("SIO_ANAG_DRIVER_TYPE"))
					sioViewDriverType = valore;
				else if(variabile.equals("SIO_ANAG_PORT"))
					sioViewPort = valore;
				else if(variabile.equals("SIO_ANAG_USER"))
					sioViewUser = valore;
				else if(variabile.equals("SIO_ANAG_PWD"))
					sioViewPwd = valore;
				else if(variabile.equals("SIO_REMOTE_ANAG_TABLE"))
					sioRemoteTable = valore;
				else if(variabile.equals("SIO_REMOTE_ANAG_TABLE_PRE"))
					sioRemoteTablePre = valore;
				else if(variabile.equals("SIO_COL_PROVENIENZA"))
					sioColProvenienza = valore;
				else if(variabile.equals("SIO_REMOTE_ANAG_TABLE_DIM_P"))
					sioRemoteTableDimProtetta = valore;

				else if(variabile.equals("QUERY_TIMEOUT"))
					queryTimeOut = Integer.valueOf(valore);
				else if(variabile.equals("COL_ID_ANAG_REMOTA"))
					colIdAnagRemota = valore;
				else if(variabile.equals("LOG_LEVEL"))
					logLevel = Level.parse(valore);
				else if(variabile.equals("ANAG_SEQUENCE_NAME"))
					sequenceName = valore;
				else if(variabile.equals("OE_REMOTEANAG_TABLE"))
					oeRemoteAnagTable = valore;
				else if(variabile.equals("SIO_COL_ID_ANAG_REMOTA"))
					sioColIdAnagRemota = valore;
				else if(variabile.equals("SIO_GESTISCI_RICOVERO"))
					sioGestisciRicovero = valore;
				else if(variabile.equals("GESTISCI_NOSOLOGICO")) {
					if(valore.toUpperCase().equals("Y"))
							gestisciNosologico = true;
				}
				else if(variabile.equals("GESTISCI_ESENZIONI")) {
					if(valore.toUpperCase().equals("Y"))
							gestisciEsenzioni = true;
				}
				else if (variabile.equals("AAC_REMOTE_ANAG_TABLE_CAMPI_OBBLIGATORI")) {
					campiObbligatori = valore;
				}

			}
		}
		catch(Exception e)
		{
			throw new AnagraficaRemotaException("setUserSession - " + e.getStackTrace());
		}
		finally
		{
			try
			{
				stmt.close(); }
			catch(Exception e)
			{}
		}
	}

	private static Connection getOracleConnection(
			String driverType,
			String serverName,
			String dbName,
			int portNumber,
			String user,
			String pwd) {
		try
		{
			OracleDataSource ods = null;
			ods = new OracleDataSource();
			ods.setDriverType(driverType);
			ods.setServerName(serverName);
			ods.setDatabaseName(dbName);
			ods.setPortNumber(portNumber);
			ods.setUser(user);
			ods.setPassword(pwd);
			return ods.getConnection();
		}
		catch(SQLException sqle)
		{
			sqle.printStackTrace();
			return null;
		}
	}

	/**
	 * Metodo che crea una insert sql.<br>
	 * Nell'HashMap <code> dati </code> la key rappresenta il nome colonna
	 * mentre il value il dato da inserire.
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
		while(iter.hasNext())
		{
			key = iter.next();
			value = dati.get(key);
			if(value == null)
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

	private short eseguiRicerca(String query, Connection conn) throws Exception {
		log(INFO, "Richiamato: eseguiRicerca - " + query, "eseguiRicerca");
		
		if (campiObbligatori != null && !campiObbligatori.equals("")) {
			log(INFO, "Aggiunta gestione campi obbligatori", "eseguiRicerca");
			query = query + campiObbligatori;
		}

		Statement stmt = null;
		ResultSet rs = null;
		short rowCount = 0;

		try
		{
			log(FINE, query, "eseguiRicerca");
			stmt = conn.createStatement();
			stmt.setQueryTimeout(this.queryTimeOut);
			rs = stmt.executeQuery(query);
//			connDati.setAutoCommit(false);
			while(rs.next())
			{
				HashMap<String, String> dati = new HashMap<String, String>();
				dati.put("COGN", rs.getString("COGNOME"));
				dati.put("NOME", rs.getString("NOME"));
				dati.put("SESSO", rs.getString("SESSO"));
				dati.put("DATA", formattaData("yyyyMMdd", rs.getDate("DATA_NASCITA")));
				dati.put("COD_FISC", rs.getString("COD_FISCALE"));
				dati.put("ID_ANAGREMOTA", rs.getString(sioColIdAnagRemota));
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
                try
				{
					dati.put("DATA_MORTE", formattaData("yyyyMMdd", rs.getDate("DATA_DECESSO"))); }
				catch(Exception e)
				{}
				//dati.put("COD_NAZIONE", rs.getString("COD_NAZIONALITA"));/////////////////////////
				try
				{
					dati.put("INDIR", rs.getString("IND_RESIDENZA")); }
				catch(Exception e)
				{}
				try
				{
					dati.put("CAP", rs.getString("CAP_RESIDENZA")); }
				catch(Exception e)
				{}
				//dati.put("PROV", rs.getString("COD_PROVINCIA_RESID"));/////////////////////////
				try
				{
					dati.put("DOM_INDIR", rs.getString("IND_DOMICILIO")); }
				catch(Exception e)
				{}
				try
				{
					dati.put("DOM_CAP", rs.getString("CAP_DOMICILIO")); }
				catch(Exception e)
				{}
				try
				{
					dati.put("DOM_PROV", rs.getString("COD_PROV_DOMICILIO")); }
				catch(Exception e)
				{}
                try {
                  String cpd = rs.getString("COD_PROVINCIA_DOMICILIO");
                  if (cpd == null)
                    cpd = "";
                  String ccd = rs.getString("COD_COMUNE_DOMIC");
                  if (ccd == null)
                    ccd = "";
                  dati.put("DOM_COMUNE", cpd + ccd); } catch (Exception e) {}
				try
				{
					dati.put("TEL", rs.getString("NUM_TELEFONO")); }
				catch(Exception e)
				{}
				try
				{
					dati.put("CREG", rs.getString("COD_REGIONE")); }
				catch(Exception e)
				{}
				try
				{
					dati.put("CUSL", rs.getString("COD_ASL")); }
				catch(Exception e)
				{}
				String sqlInsert = creaInsert(oeRemoteAnagTable, dati);
				log(FINE, sqlInsert, "eseguiRicerca");
				Statement stmtInsert = null;
				try
				{
					stmtInsert = connDati.createStatement();
					int insertedRows = stmtInsert.executeUpdate(sqlInsert);
					if(insertedRows == 0)
					{
						String msg = "Errore nell'insert " + sqlInsert + " in " + oeRemoteAnagTable;
						log(SEVERE, msg, "eseguiRicerca");
						throw new Exception(msg);
					}
					rowCount++;
				}
				finally
				{
/*					try
					{
						connDati.commit(); }
					catch(Exception e)
					{
						e.printStackTrace(); }
					try
					{
						connDati.setAutoCommit(true); } // queste cose comunque dovrebbero finire nel finally piu' esterno, altrimenti in caso di errore rimane l'autoCommit disabilitato
					catch(Exception e)
					{
						e.printStackTrace(); }*/
					try
					{
						stmtInsert.close(); }
					catch(Exception e)
					{
						e.printStackTrace(); }
				}
			}

		}
		catch(Exception e)
		{
/*			try
			{
				connDati.rollback(); }
			catch(Exception e1)
			{
				e1.printStackTrace(); }*/
			throw new AnagraficaRemotaException(e);
		}
		finally
		{
			try
			{
				stmt.close(); }
			catch(Exception e)
			{}
		}
		return rowCount;

	}

	/**
	 * Metodo che crea una update sql.<br>
	 * Nell'HashMap <code> dati </code> la key rappresenta il nome colonna
	 * mentre il value il dato da inserire.<br>
	 * Non effettua update di colonne per valori <code>null</code>.
	 * @param tabella
	 * @param dati
	 * @param whereCondition
	 * @return
	 */
	private static String creaUpdate(String tabella, HashMap<String, String> dati, String whereCondition) {

		Set<String> keys = dati.keySet();

		StringBuffer sql = new StringBuffer("UPDATE " + tabella + " SET ");
		Iterator<String> iter = keys.iterator();
		String key;
		String value;
		while(iter.hasNext())
		{
			key = iter.next();
			value = dati.get(key);
			if(value != null)
				sql.append(" " + key + " = '" + value.replaceAll("'", "''") + "', ");
		}
		sql.replace(sql.length() - 2, sql.length(), " ");
		sql.append(" WHERE " + whereCondition);

		return sql.toString();
	}

	private void log(Level level, String msg) {
		log(level, msg, " ");
	}

	private void log(Level level, String msg, String method) {

		if(printLog)
		{
			System.out.println(level.toString() + " - " + method + " - "+msg);
			return;
		}

		if(level.intValue() < logLevel.intValue())
			return;
		try
		{
			Date now = new Date();
			pstmtLog.setString(1, formattaData("yyyyMMdd", now)); //COL_DATE
			pstmtLog.setString(2, formattaData("hh:mm:ss", now)); //COL_TIME
			pstmtLog.setInt(3, Integer.parseInt(formattaData("SSS", now))); //COL_MILLIS
			pstmtLog.setString(4, level.toString()); //COL_LEVEL
			pstmtLog.setString(5, "RR-" + userSession); //COL_LOGGER
			pstmtLog.setString(6, method); //COL_METHOD
			pstmtLog.setString(7, msg); //COL_MESSAGE
			pstmtLog.executeUpdate();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}

	public void finalize() {
		try
		{
			pstmtLog.close(); }
		catch(Exception e)
		{}
	}


	/**
	 * unico metodo richiamato dall'OE
	 * */
	public short RicercaPerProvenienza(String idenProvenienza) throws AnagraficaRemotaException {
		log(INFO, "Richiamato: RicercaPerProvenienza - " + idenProvenienza, "RicercaPerProvenienza");
		short ct = 0;
		ArrayList<String> provenienze = new ArrayList<String>();
		provenienze.add(idenProvenienza);
		ct = RicercaPerProvenienze(provenienze);
		log(INFO, "RicercaPerProvenienza ritorna: " + ct, "RicercaPerProvenienza");
		return ct;
	}


	//
	/**
	 * metodo richiamato da Whale
	 * */
	public short RicercaPerProvenienze(ArrayList provenienze) throws AnagraficaRemotaException {
		StringBuffer inProvenienze = new StringBuffer("'");
		String whereCond="";

		for(String provenienza : (ArrayList<String>) provenienze)
		{
			inProvenienze.append("''" + provenienza + "'',");
		}
		inProvenienze.replace(inProvenienze.length() - 1, inProvenienze.length(), "'");

		log(INFO, "Richiamato: RicercaPerProvenienze - " + inProvenienze, "RicercaPerProvenienze");
		short ct = 0;
		if(sioViewAddress == null)
			return ct;
		try
		{
			ResultSet rs=connDati.createStatement().executeQuery("Select cartclin.GET_WHERE_REPARTI("+inProvenienze+") WHERECOND from dual");
			if (rs.next())
				whereCond = rs.getString("WHERECOND");

			connSio = getOracleConnection(sioViewDriverType, sioViewAddress, sioViewDbName, Integer.valueOf(sioViewPort), sioViewUser, sioViewPwd);
			log(FINE, "connessione connSio = " + connSio.toString(), "RicercaPerProvenienze");
//			connDati.setAutoCommit(false);
			Statement stmt = null;
			try
			{
				stmt = connSio.createStatement();
				StringBuffer sql = new StringBuffer("select /*+first_rows(100)*/ 'R' TIPO_RICOVERO, " +
						sioRemoteTable + ".COGNOME, " +
						sioRemoteTable + ".NOME, " +
						sioRemoteTable + ".SESSO, " +
						sioRemoteTable + ".DATA_NASCITA, " +
						sioRemoteTable + ".CODICE_FISCALE, " +
						sioRemoteTable + ".PIN_AZIENDA, " +
						sioRemoteTable + ".NUMERO_CARTELLA, " +
						sioRemoteTable + ".REGIME_RICOVERO, " +
						sioRemoteTable + "." + sioColProvenienza + "," +
						"to_char(" + sioRemoteTable + ".DATA_RICOVERO,'yyyyMMdd') DATA_RICOVERO" +
						" from " + sioRemoteTable);
				sql.append(" where " + whereCond);
				if(sioRemoteTablePre != null)
				{
					sql.append(" union ");
					sql.append("select 'P' TIPO_RICOVERO, " +
							sioRemoteTablePre + ".COGNOME, " +
							sioRemoteTablePre + ".NOME, " +
							sioRemoteTablePre + ".SESSO, " +
							sioRemoteTablePre + ".DATA_NASCITA, " +
							sioRemoteTablePre + ".CODICE_FISCALE, " +
							sioRemoteTablePre + ".PIN_AZIENDA, " +
							sioRemoteTablePre + ".NUMERO_CARTELLA, " +
							sioRemoteTablePre + ".REGIME_RICOVERO, " +
							sioRemoteTablePre + "." + sioColProvenienza + "," +
							"to_char(" + sioRemoteTablePre + ".DATA_RICOVERO,'yyyyMMdd') DATA_RICOVERO" +
							" from " + sioRemoteTablePre);
					sql.append(" where " + whereCond);
				}
				if(sioRemoteTableDimProtetta != null)
				{
					sql.append(" union ");
					sql.append("select 'D' TIPO_RICOVERO, " +
							sioRemoteTableDimProtetta + ".COGNOME, " +
							sioRemoteTableDimProtetta + ".NOME, " +
							sioRemoteTableDimProtetta + ".SESSO, " +
							sioRemoteTableDimProtetta + ".DATA_NASCITA, " +
							sioRemoteTableDimProtetta + ".CODICE_FISCALE, " +
							sioRemoteTableDimProtetta + ".PIN_AZIENDA, " +
							sioRemoteTableDimProtetta + ".NUMERO_CARTELLA, " +
							sioRemoteTableDimProtetta + ".REGIME_RICOVERO, " +
							sioRemoteTableDimProtetta + "." + sioColProvenienza + "," +
							"to_char(" + sioRemoteTableDimProtetta + ".DATA_RICOVERO,'yyyyMMdd') DATA_RICOVERO" +
							" from " + sioRemoteTableDimProtetta);
					sql.append(" where " + whereCond);
				}

				log(FINE, sql.toString(), "RicercaPerProvenienze");
				rs = stmt.executeQuery(sql.toString());
				ResultSet rsRicoveri;
				String dataRicovero;
				Statement stmtInsert = null;
				int insertedRows;
				while(rs.next())
				{
					String idAnagRemota = rs.getString(sioColIdAnagRemota);
					if((idAnagRemota==null) || (idAnagRemota.trim().equals("")))
						continue;


					ct++;

					dataRicovero=rs.getString("DATA_RICOVERO");

					HashMap<String, String> dati = new HashMap<String, String>();
					dati.put("COGN", rs.getString("COGNOME"));
					dati.put("NOME", rs.getString("NOME"));
					dati.put("SESSO", rs.getString("SESSO"));
					dati.put("DATA", formattaData("yyyyMMdd", rs.getDate("DATA_NASCITA")));
					dati.put("COD_FISC", rs.getString("CODICE_FISCALE"));
					dati.put("ID_ANAGREMOTA", idAnagRemota);
					dati.put("REPARTO_DI_RICOVERO", rs.getString(sioColProvenienza));
					dati.put("NUM_NOSOLOGICO", rs.getString("NUMERO_CARTELLA"));
					String regimeRicovero = rs.getString("REGIME_RICOVERO");
					if(regimeRicovero == null || regimeRicovero.trim().equals("") || regimeRicovero.trim().equals("1"))
						dati.put("TIPO_RICOVERO", rs.getString("TIPO_RICOVERO"));
					else
						if(regimeRicovero.trim().equals("2"))
							dati.put("TIPO_RICOVERO", rs.getString("TIPO_RICOVERO") + "D");
					dati.put("USER_SESSION", userSession);

					String sqlInsert = creaInsert(oeRemoteAnagTable, dati);
					if (sioGestisciRicovero.equals("S")){
						String sqlRicovero = "Select 1 from CARTCLIN.RICOVERI where RICOVERO_TERMINATO = 'N' AND ID_REMOTO='"+dati.get("ID_ANAGREMOTA")+"' and N_RICOVERO='"+dati.get("NUM_NOSOLOGICO")+"' and CODICE_REPARTO=(select COD_CDC from CENTRI_DI_COSTO where COD_DEC='"+dati.get("REPARTO_DI_RICOVERO")+"')";
						rsRicoveri=connDati.createStatement().executeQuery(sqlRicovero);
						if (!rsRicoveri.next())
						{
							try
							{
								stmtInsert = connDati.createStatement();

								sqlRicovero = "Update CARTCLIN.RICOVERI set RICOVERO_TERMINATO='S' where ID_REMOTO='"+dati.get("ID_ANAGREMOTA")+"'";
								try{
									insertedRows = stmtInsert.executeUpdate(sqlRicovero);
								}catch (Exception e){
									throw new Exception("Errore nell' update :" + sqlRicovero + " | ERROR:" +e.getMessage());
								}

								sqlRicovero = "Insert into CARTCLIN.RICOVERI (ID_REMOTO,N_RICOVERO,CODICE_REPARTO,DATA_INI_RICOVERO)";
								sqlRicovero += "values ('"+dati.get("ID_ANAGREMOTA")+"','"+dati.get("NUM_NOSOLOGICO")+"',(select COD_CDC from CENTRI_DI_COSTO where COD_DEC='"+dati.get("REPARTO_DI_RICOVERO")+"'),'"+dataRicovero+"')";

								log(FINE, sqlRicovero, "RicercaPerProvenienze");
								insertedRows = stmtInsert.executeUpdate(sqlRicovero);
								if(insertedRows == 0)
									throw new Exception("Errore nell'insert :" + sqlRicovero);
							}
							finally
							{
								try
								{
									stmtInsert.close();
								}
								catch(Exception e)
								{}
							}

						}
					}

					log(FINE, sqlInsert, "RicercaPerProvenienze");

					try
					{
						stmtInsert = connDati.createStatement();
						insertedRows = stmtInsert.executeUpdate(sqlInsert);
						if(insertedRows == 0)
							throw new Exception("Errore nell'insert " + sqlInsert + " in " + oeRemoteAnagTable);

					}
					finally
					{
						try
						{
							stmtInsert.close();
						}
						catch(Exception e)
						{}
					}
				}
			}
			finally
			{
				try
				{
/*					connDati.commit();
					connDati.setAutoCommit(true);*/
					stmt.close();
				}
				catch(Exception e)
				{
					e.printStackTrace();
				}

			}
		}
		catch(Exception e)
		{
/*			try
			{
				connDati.rollback();
			}
			catch(Exception e1)
			{
				e1.printStackTrace();
			} */
			e.printStackTrace();
			throw new AnagraficaRemotaException("RicercaPerProvenienze" + e.getMessage());
		}
		finally
		{
			try
			{
				connSio.close();
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}
		}
		log(INFO, "RicercaPerProvenienze ritorna: " + ct, "RicercaPerProvenienze");
		return ct;
	}


	public void setInformazioniUtente(baseUser arg0) throws AnagraficaRemotaException {

	}


	public void setRemoteConnString(String conn_string)
			throws AnagraficaRemotaException {
		// TODO Auto-generated method stub

	}


	public void setRemoteUser(String user) throws AnagraficaRemotaException {
		// TODO Auto-generated method stub

	}


	public void setRemotePwd(String pwd) throws AnagraficaRemotaException {
		// TODO Auto-generated method stub

	}
	
	public void callRrAllineaEsenzioniRemote(String nome, String cognome, String sesso, String codiceFiscale) {
		CallableStatement cs = null;

		try {
			cs = connDati.prepareCall("{call RR_ALLINEA_ESENZIONI_REMOTE (?, ?, ?, ?)}");
			cs.setString(1, nome);
			cs.setString(2, cognome);
			cs.setString(3, sesso);
			cs.setString(4, codiceFiscale);
			cs.execute();
		} catch (SQLException sqle) {
			log(SEVERE, sqle.getMessage(), "callRrAllineaEsenzioniRemote");
		} finally {
			try {
				cs.close();
			} catch (Exception e) {
				log(SEVERE, e.getMessage(), "callRrAllineaEsenzioniRemote");
			}
		}
	}


}
