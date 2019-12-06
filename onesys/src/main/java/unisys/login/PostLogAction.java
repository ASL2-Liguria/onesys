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

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class PostLogAction extends HttpServlet
{
	private static final long serialVersionUID 	= 1L;
	private static final String	CONTENT_TYPE	= "text/plain";

	private ElcoLoggerInterface	logger			= null;
	
	public void init(ServletConfig config) throws ServletException
    {
        super.init(config);
        this.logger		= new ElcoLoggerImpl(this.getClass().getSimpleName());
    }
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
		PrintWriter 	out				= response.getWriter();
    	response.setContentType(CONTENT_TYPE);
		if(!request.getParameterMap().containsKey("log"))
	    {
			out.println("KO$Errore in lettura dei dati per il logger");
    		out.close();
    		
	    	return;
	    }
		
		String log	= request.getParameter("log");
    			
		try 
        {
			this.writeTempFileLogger(log);
        }
		catch (Exception ex) 
        {
        	out.println(ex.getMessage());
        	out.close();
	    	return;
		}
		
    }
	
	//Process the HTTP Post request
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        doGet(request, response);
    }

    //Clean up resources
    public void destroy()
    {
    }
    
    private void writeTempFileLogger(String log) throws Exception
    {
    	String[] arrayLog = new String[100];
    	arrayLog = log.split("<!!!>");
    	try 
    	{
    	    for (int i=0;i<arrayLog.length;i++)
    	    {
    	    	this.logger.info(arrayLog[i].toString());
    	    }
    	} 
    	catch (Exception e) 
    	{
			e.printStackTrace();
    		throw new Exception("KO$" + e.getMessage());  
    	}	
    }
    
	
    public String getStringOggi()
	{
		 SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		 return sdf.format ( new java.util.Date () ) ;	
	}

}
