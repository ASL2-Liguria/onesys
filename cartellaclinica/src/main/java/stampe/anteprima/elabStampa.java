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
package stampe.anteprima;

import imago.a_util.CContextParam;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.winbuild.CSessionError;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;

import core.Global;

public class elabStampa extends HttpServlet {
	private ServletConfig       sConfig = null;
	private ServletContext      myContext=null;
	private static final String CONTENT_TYPE = "text/html";

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		sConfig = config;
		myContext = sConfig.getServletContext();
	}


	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		CContextParam		myContextParam		=	null;
		HttpSession    		mySession			=	null;
		elabStampaEngine   	MYelabStampaEngine	=	null;
		elabStampaEngineToServletStampe MyElab	= 	null;
		ElcoLoggerInterface logger = null;
		baseUser            logged_user			=	null;
		basePC              infoPC				=	null;
		mySession = request.getSession(false);
		try{
			myContextParam=new CContextParam(this);
			logged_user = Global.getUser(mySession);
			logger = new ElcoLoggerImpl(this.getClass().getSimpleName());
		}
		catch(Exception ex){
			logger.error(ex.getMessage());
		}
		logger.info("Inizializzata Servlet ElabStampa");

		if(mySession==null) {
			response.getWriter().println(CSessionError.buildHTML());
			response.getWriter().flush();
			response.getWriter().close();
			return;
		} else {
			try {
				infoPC = (basePC) mySession.getAttribute("parametri_pc");

				if (infoPC.DIRECTORY_REPORT==null || infoPC.DIRECTORY_REPORT.equalsIgnoreCase("") )
				{
					Errore_Configurazione Error= new Errore_Configurazione(mySession,request,"elabStampa","noConf",myContextParam);
					Document ErroreHtml=(Error.creaDocumentoHtml());
					response.getWriter().println(ErroreHtml);
				}
				else
				{

					if ("S".equalsIgnoreCase(request.getParameter("stampaPdfDiretto")))
					{/*Ritorna pagina html con dentro il pdf(se adobe installato o altro) passando direttamente da servletStampe/crystal.war a seconda della processclass*/
						logger.info("Visualizza pdf diretto dentro browser");
						response.setContentType(CONTENT_TYPE);
						MyElab = new elabStampaEngineToServletStampe(mySession, myContext, request,myContextParam);
						Document Htmlfinito=(MyElab.creaUrlToServletStampe());
						response.getWriter().println(Htmlfinito);
					}else
					{/*Ritorna pagina html con activex dentro il pdf(se adobe installato o altro) passando direttamente da servletStampe/crystal.war a seconda della processclass*/					
						logger.info("Visualizza/stampa pdf from ServletStampe/webapp cristalclear");
						response.setContentType(CONTENT_TYPE);
						MYelabStampaEngine = new elabStampaEngine(mySession, myContext, request,myContextParam);
						Document Htmlfinito=(MYelabStampaEngine.creaHtml());
						response.getWriter().println(Htmlfinito);
					}
				}
				logger.info("Fine Generazione Stampa");
			} catch (Exception ex) 	{
				response.getWriter().println(ex);
				logger.error("Errore generale creazione stampa"
						+ ex.getMessage());
			}finally{
				response.getWriter().flush();
				response.getWriter().close();
			}
		}

	}


	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		//System.out.println("doGet") ;
		processRequest(request, response);
	}


	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		//System.out.println("doPost") ;
		processRequest(request, response);
	}
	@Override
	public void destroy() {

	}
}


