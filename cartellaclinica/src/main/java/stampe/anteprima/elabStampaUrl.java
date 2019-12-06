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
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package stampe.anteprima;

import imago.a_util.CContextParam;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONException;

/**
 *
 * @author linob - 22/03/2015
 */
public class elabStampaUrl extends HttpServlet{
    
	private static final long serialVersionUID 	= 1L;
	private static final String	CONTENT_TYPE	= "application/json";
	private ServletConfig sConfig = null;
	private ServletContext myContext = null;
	private ElcoLoggerInterface	logger			= null;
    
	@Override
	public void init(ServletConfig config) throws ServletException
    {
        super.init(config);
		sConfig = config;
		myContext = sConfig.getServletContext();
        this.logger		= new ElcoLoggerImpl(this.getClass().getSimpleName());
    }	
	
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        processRequest(request, response);
    }    

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType(CONTENT_TYPE);
		CContextParam myContextParam = null;
		HttpSession mySession = null;
		String line = null;
		StringBuffer jb = new StringBuffer();
		elabStampaEngineUrl myElab = null;
		myContextParam = new CContextParam(this);
		try {
			logger.info("Inizio Recupero json data");
			BufferedReader reader = request.getReader();
			while ((line = reader.readLine()) != null) {
				jb.append(line);
			}

		} catch (Exception e) {
			System.out.println(e.getLocalizedMessage());
		}
		logger.info(jb.toString());
		logger.info("Generazione json input");
		try {
			JSONArray jsonArray = new JSONArray(jb.toString());
			myElab = new elabStampaEngineUrl(request.getSession(false),
					myContext, request, myContextParam, jsonArray);
			myElab.elaborazione();
			response.getWriter().print(myElab.getJsonArroutput());
		} catch (JSONException e) {
        	this.logger.error(e);
        	response.getWriter().print("JSONERROR"+e.getMessage());
		} catch (Exception ex){
        	this.logger.error(ex);
        	response.getWriter().print("Errore nella generazione url"+ex.getLocalizedMessage());			
		}finally{
            response.getWriter().close();
        }
    }
    
}
