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
package unisys.logout;

import imago.sql.dbConnections;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import unisys.userLog;
import unisys.baseObj.UniSysConfig;


public class logoutEngine
{
	private final String		PAGINA_CONFIG	= "US_LOGIN"; 
	
	private ServletContext      context  		= null;
	private HttpServletRequest  request  		= null;
	private HttpSession			session  		= null;
	
	private UniSysConfig				config   		= null;
	private dbConnections 		dbConns  		= null;
	
    public logoutEngine(ServletContext cont, HttpServletRequest req, HttpSession sess, HttpServletResponse response)
    {
        this.context = cont;
        this.request = req;
        this.session = sess;
        this.dbConns = new dbConnections();
        this.config	 = new UniSysConfig(UniSysConfig.GRUPPO_LOGIN);
    }

    public logoutEngine(ServletContext cont, HttpServletRequest req, HttpSession sess)
    {
        this(cont, req, sess, null);
    }
    
    public String generatePage()
    {
    	// 	TODO unlock user's records
    	
    	String sRet = new String("");
    	String modalita = new String("");
    	
    	modalita = this.request.getParameter("MODALITA");
    	
    	//this.effettuaLogout(this.fObj.bUtente.login);
    	
    	if(modalita.equalsIgnoreCase("CHANGELOGIN"))
    	{
    		invalidSession();
    		sRet = "LOGIN";
    	}
    	else
    	{
    		invalidSession();
    		sRet = "<HTML><HEAD></HEAD><BODY><SCRIPT>self.close();</SCRIPT></BODY></HTML>";    		
    	}
    	    	
    	//this.setSessioneScaduta(this.fObj.bUtente.login);
    			
    	return sRet;
    }
    
    //	invalida la sessione
    private void invalidSession()
    {
		try
		{
			//this.fObj.hSessione.invalidate();	
		}
		catch ( java.lang.Exception ex )
		{
		    ex.printStackTrace () ;
		}
    }
    
    private void effettuaLogout(String user)
	{
		try
		{
			userLog uLog = new userLog(this.config.getParametro("TAB_UTE_LOG"));
			
			uLog.setWebuser(user);
			uLog.setUteSession(this.session.getId());
			
			uLog.effettuaLogout(this.dbConns);
		}
		catch(java.lang.Exception ex)
    	{
			ex.printStackTrace () ;
    	}		
	}
    
    private void setSessioneScaduta(String user)
    {
    	try
		{
    		userLog uLog = new userLog(config.getParametro("TAB_UTE_LOG"));
    		
    		uLog.setWebuser(user);
    		uLog.setUteSession(this.session.getId());
    		
    		uLog.setSessioneScaduta(this.dbConns);
		}
    	catch(java.lang.Exception ex)
    	{
			ex.printStackTrace () ;
    	}
    }
    
    
}
