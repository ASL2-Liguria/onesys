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
package charts;
/*
 * classAttesa.java
 *
 * Created on 8 settembre 2006, 15.26
 */


import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author  francesco
 * @author  gianlucab
 * @version 1.0
 */
public class Charts extends HttpServlet {

    private ServletConfig       sConfig = null;
    private ServletContext      context = null;
    /** Initializes the servlet.
     */
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        sConfig = config;
        context = sConfig.getServletContext();
    }

    /** Destroys the servlet.
     */
    public void destroy() {

    }

    /** Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException, Exception {
        HttpSession                 session = request.getSession(true);
        //response.setContentType("text/xml");
        // *******************
        PrintWriter out = null;
        GenericChart chart = null; // 2014-03-26 - gianlucab - Dichiarazione di un grafico generico.
        // setto la sessione
        if (session.isNew()) {
            session.setAttribute("session-creator", this.getClass().getName()+".class");
            session.setMaxInactiveInterval(120);
        }
        try {
            if (request.getParameterMap().containsKey("tipo")){
                chart = new ChartsEngine(session, context, request,response);
            }
            else if (request.getParameterMap().containsKey("test")){
            	//String value = request.getParameter("test");
            	chart = new XYLineChart(session, context, request,response);
            }
            else if (request.getParameterMap().containsKey("puppa")){
                chart = new combinedChartReport(session, context, request,response);
            }
            else {
                chart = new combinedChart(session,context,request,response);
            }
            chart.Work();
        } catch (Exception ex) {
            ex.printStackTrace();
            } finally {
            	/**
            	 * Null pointer access: The variabile out can only be null at this location.
            	 */
            	if (out != null)
            		out.println(chart.getReponse());
            }
        }

    /** Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        try {
          processRequest(request, response);
        }
        catch (IOException ex) {
        }
        catch (ServletException ex) {
        }
        catch (Exception ex) {
        	ex.printStackTrace();
        }
    }

    /** Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException{
        try {
          processRequest(request, response);
        }
        catch (IOException ex) {
        }
        catch (ServletException ex) {
        }
        catch (Exception ex) {
        	ex.printStackTrace();
        }
    }

    /** Returns a short description of the servlet.
     */
    public String getServletInfo() {
        return "Servlet per il salvataggio semi-automatico delle pagine HTML";
    }

}

