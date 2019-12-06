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
 * menuMain.java
 *
 * Created on 1 marzo 2005, 12.43
 */

package menu;



import imago.winbuild.CSessionError;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import worklist.ImagoWorklistException;
import worklist.IworklistEngine;


/**
 *
 * @author  aldog
 */

/**
 *classe che contiene il menu fisso del RIS
 *ovvero la barretta con i comandi principali
 *
 */
public class menuMain extends HttpServlet{

    private ServletConfig       sConfig = null;
    private ServletContext      context = null;

    /** Creates a new instance of menuHideIntegrazioni */
    public menuMain() {
    }

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
        // distruggo oggetti per connessione al DB
    }


    protected void doElabora(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        HttpSession                 session = request.getSession(false);
        IworklistEngine             myMenuMainEngine=null;

        response.setContentType("text/html");
        // *******************
        PrintWriter out = response.getWriter();
        // setto la sessione
        if (session == null) {
            out.println(CSessionError.buildHTML());
            out.close();
            return;
        } else {
            try {
                myMenuMainEngine = new menuMainEngine(session, context, request);
                out.println(myMenuMainEngine.creaDocumentoHtml());
            } catch (ImagoWorklistException ex) {
                out.println(ex.toHTMLText());
                ex.printStackTrace();
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException{
        doElabora(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException{
        doElabora(request, response);
    }



}
