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
package unisys;

import imago.sql.dbConnections;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import oracle.jdbc.OraclePreparedStatement;

public class userLog {

	private String tabUteLog = null;
	
	private String	webuser			= "";
	private String	ip				= "";
	private String	dataAccesso		= "";
	private String	webserver		= "";
	private String	nomeHost		= "";
    private String	descrUtente		= "";
    private String	uteSession		= "";
    private String	sessioneScaduta	= "";
    private String	logoutEffettuato = "";
	
	public userLog(String tabUteLog)
	{
		this.tabUteLog = tabUteLog;
	}
	
	/**
	 * Inserisce una riga in UTENTI_LOGGATI
	 * 
	 * @param dbConns
	 * @throws Exception
	 */
	public void insertLog(dbConnections dbConns) throws Exception
	{
		Connection 	conn	= dbConns.getDataConnection();
		
		ResultSet   rs     	= null;
		String		query 	= 	"insert into " + this.tabUteLog +
								"(webserver	 , ip  , data_accesso, nome_host , descrUtente, webuser  , ute_session) VALUES " + 
								"(:pWebServer, :pIp, :pDataAcc   , :pNomeHost, :pDescrUte , :pWebuser, :pSession  )";
		
		try 
		{
			OraclePreparedStatement ps=(OraclePreparedStatement) conn.prepareStatement(query);
			
			ps.setStringAtName("pWebServer", this.webserver);
			ps.setStringAtName("pIp", this.ip);
			ps.setStringAtName("pDataAcc", this.dataAccesso);
			ps.setStringAtName("pNomeHost", this.nomeHost);
			ps.setStringAtName("pDescrUte", this.descrUtente);
			ps.setStringAtName("pWebuser", this.webuser);
			ps.setStringAtName("pSession", this.uteSession);
			
    		rs = ps.executeQuery();
    		
    		rs.close();
            rs = null;
            conn.close();
            conn = null;
		}
		catch (SQLException e) 
		{
			e.printStackTrace();
		}
	}
	
	public int forzaLogout(dbConnections dbConns) throws Exception
	{
		Connection 	conn	= dbConns.getDataConnection();
		
		ResultSet   rs     	= null;
		String		query 	= "Update " + this.tabUteLog + " set logout_effettuato = 'F' where webuser = :pUser and logout_effettuato = 'N'";
		
		try 
		{
			OraclePreparedStatement ps=(OraclePreparedStatement) conn.prepareStatement(query);
			
			ps.setStringAtName("pUser", this.webuser);
						
    		rs = ps.executeQuery();
    		
    		rs.close();
            rs = null;
            conn.close();
            conn = null;
		}
		catch (SQLException e) 
		{
			e.printStackTrace();
			return -1;
		}
				
		return 1;
	}
	
	public int effettuaLogout(dbConnections dbConns) throws Exception
	{
		Connection 	conn	= dbConns.getDataConnection();
		
		ResultSet   rs     	= null;
		String		query 	= "Update " + this.tabUteLog + " set logout_effettuato = 'S' where webuser = :pUser and logout_effettuato = 'N' and ute_session = :pSession";
		
		try 
		{
			OraclePreparedStatement ps=(OraclePreparedStatement) conn.prepareStatement(query);
			
			ps.setStringAtName("pUser", this.webuser);
			ps.setStringAtName("pSession", this.uteSession);
						
    		rs = ps.executeQuery();
    		
    		rs.close();
            rs = null;
            conn.close();
            conn = null;
		}
		catch (SQLException e) 
		{
			e.printStackTrace();
			return -1;
		}
				
		return 1;
	}
	
	public int setSessioneScaduta(dbConnections dbConns) throws Exception
	{
		Connection 	conn	= dbConns.getDataConnection();
		
		ResultSet   rs     	= null;
		String		query 	= "Update " + this.tabUteLog + " set sessione_scaduta = 'S' where webuser = :pUser and logout_effettuato = 'N' and ute_session = :pSession";
		
		try 
		{
			OraclePreparedStatement ps=(OraclePreparedStatement) conn.prepareStatement(query);
			
			ps.setStringAtName("pUser", this.webuser);
			ps.setStringAtName("pSession", this.uteSession);
						
    		rs = ps.executeQuery();
    		
    		rs.close();
            rs = null;
            conn.close();
            conn = null;
		}
		catch (SQLException e) 
		{
			e.printStackTrace();
			return -1;
		}
				
		return 1;
	}
	
	public void setWebuser(String par)
	{
		this.webuser = par;
	}
	
	public void setIp(String par)
	{
		this.ip = par;
	}
	
	public void setDataAccesso(String par)
	{
		this.dataAccesso = par;
	}
	
	public void setWebserver(String par)
	{
		this.webserver = par;
	}
	
	public void setNomeHost(String par)
	{
		if(par == "") par = this.ip;
		this.nomeHost = par;
	}
	
	public void setDescrUte(String par)
	{
		this.descrUtente = par;
	}
	
	public void setUteSession(String par)
	{
		this.uteSession = par;
	}
	
	public void setSessioneScaduta(String par)
	{
		this.sessioneScaduta = par;
	}
	
	public void setLogoutEffettuato(String par)
	{
		this.logoutEffettuato = par;
	}
}
