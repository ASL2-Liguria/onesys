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
package unisys.login;

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.dbConnections;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import oracle.jdbc.OraclePreparedStatement;
import unisys.baseObj.UniSysConfig;
import unisys.layout.Page;

public abstract class PageLoginEngine {
	
	protected final ServletContext      context;
	protected final HttpServletRequest	request;
	protected final dbConnections 		dbConns;
	protected final ElcoLoggerInterface	logger;
    
	protected Page				page	= null;
    
	protected String	ipRilevato		= new String("");
	protected String	nomeHost		= new String("");
	protected String	abilitatoSmartCard = new String("N");
	
	protected UniSysConfig config;
	
	protected String attiva_comped 	= "ATTIVA_COMPED";
	protected String attiva_applet 	= "ATTIVA_APPLET";        
	protected String login_ldap		= "LOGIN_LDAP";
	/**
     * Costruttore
     * 
     * @param ServletContext
     * @param HttpServletRequest
     * @param HttpServletResponse
     */
    public PageLoginEngine(ServletContext cont, HttpServletRequest req, HttpServletResponse resp)
    {
    	this.context	= cont;
        this.request	= req;
        this.dbConns	= new dbConnections();
        this.logger		= new ElcoLoggerImpl(this.getClass().getSimpleName());
    }
    
    static public PageLoginEngine getConfiguredLogin(ServletContext cont, HttpServletRequest req, HttpServletResponse resp) {
    	String pageclass = cont.getInitParameter("LOGIN_PAGE");
    	try {
			return (PageLoginEngine) Class.forName(pageclass).getConstructor(ServletContext.class, HttpServletRequest.class, HttpServletResponse.class).newInstance(cont, req, resp);
		} catch (Exception e) {
			new ElcoLoggerImpl(PageLoginEngine.class.getSimpleName()).error(e);
			return null;
		}
    }
    
    public abstract String generaPagina() throws ServletException, IOException;
    
    /**
     * Riceve il NOME HOST dalla funzione Oracle UTL_INADDR.GET_HOST_NAME basandosi sull'IP
     * 
     * @param ip
     * @return NOME HOST
     */
    protected void getNomeHost(String ip)
    {
    	Connection 		conn 	= null;
    	ResultSet   	rs     	= null;
        
        try 
    	{
        	conn = this.dbConns.getWebConnection();
			
			OraclePreparedStatement ps=(OraclePreparedStatement) conn.prepareStatement("select UTL_INADDR.GET_HOST_NAME(:pIp) NHOST from dual");
	    	ps.setStringAtName("pIp", ip);    	
	    	
	    	rs = ps.executeQuery();
	    	
	    	if(rs.next())
	    		this.nomeHost = rs.getString("NHOST");
		}
    	catch (Exception e) 
    	{
    		this.logger.warn("getNomeHost() - Errore durante la lettura del nome host - host " + this.request.getRemoteAddr() + " unknown");
		}
    	finally
    	{
    		try {
    			if(rs!=null && !rs.isClosed())
    				rs.close();
				conn.close();
			}
    		catch (Exception e) 
    		{
				this.logger.error("getNomeHost() - Errore durante la chiusura della connessione");
			}
    		finally
    		{
		        rs = null;
		        conn = null;
    		}
    	}   	
    }
}
