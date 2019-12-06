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
import java.sql.SQLException;

import core.Global;

import oracle.jdbc.OraclePreparedStatement;

/**
 * Classe che mantiene le principali informazioni
 * legate all'utente loggato in quel momento
 *
 * @author  AldoG
 * @version 1.0
 * 
 * @author FabrizioD
 * @version 2.0
 */
public class UniSysConfig extends baseObj implements Serializable 
{
    private static final long 		serialVersionUID = 1L;
    
    public static final String GRUPPO_LOGIN = "LOGIN";
    public static final String GRUPPO_GLOBALI = "GLOBALI";
    
    public UniSysConfig(String gruppo) {
		super();
		leggiGlobal(gruppo);
    }

    public UniSysConfig()
    {
		this(GRUPPO_GLOBALI);
    }

    public void load(String gruppo)
	{
		this.leggiGlobal(gruppo);
	}

    private void leggiGlobal(String gruppo)
    {
    	Connection 	conn	= null;
    	ResultSet	rs		= null;
    	
    	dbConnections dbConns = new dbConnections();
    	
    	try 
		{
			conn = dbConns.getWebConnection();
		}
		catch (SqlQueryException e1) 
		{
			this.logger.error("Errore durante la getWebConnection()");
			e1.printStackTrace();
		}
		
		try
    	{
    		OraclePreparedStatement ps=(OraclePreparedStatement) conn.prepareStatement("select NOME, VALORE from VIEW_US_CONFIG where gruppo=? and VERSIONE=?");
    		ps.setString(1, gruppo);
    		ps.setString(2, Global.getVersione());
	    	rs = ps.executeQuery();

	    	while(rs.next())
	    	{
	    		String	key 				= new String("");
	        	String	value				= new String("");
	        	
	        	key 	= rs.getString("NOME");
				value	= rs.getString("VALORE");
					
				this.setParametro(key, value);
			}
    	}
    	catch(java.lang.Exception ex)
    	{
    		this.logger.error("Errore durante la lettura di \n" + ex.getMessage());
    		ex.printStackTrace();
    	}
    	finally
		{
			try 
			{
				rs.close();
				conn.close();
			}
			catch (SQLException e) 
			{
				e.printStackTrace();
			}
	        rs = null;
	        conn = null;
		}
    }

}