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
 * SL_RicPazWorklist.java
 *
 * Created on 20 ottobre 2005, 14.20
 */

package configura_ricerca.servlet.ricerca_ricoverati;

import imago.a_sql.CLogError;
import imago.a_util.CUtility;
import imago.http.baseClass.baseUser;
import imago.util.CVarContextSession;
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

import configura_ricerca.html.ricerca_ricoverati.CRicPazRicoverati;

/**
 *
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: </p>
 *
 * <p>Company: </p>
 *
 * @author elenad
 * @version 1.0
 */
public class SL_RicPazRicoverati extends HttpServlet {

    private ServletConfig sConfig = null;
    private ServletContext context = null;

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        sConfig = config;
        context = sConfig.getServletContext();
    }

    /** Destroys the servlet.
     */
    public void destroy() {

    }

    protected /*synchronized*/ void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        CRicPazRicoverati worklist = null;
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        CLogError log = null;
        HttpSession session = null;
        baseUser logged_user = null;
        try
        {
            session = request.getSession(false);

            if(session == null)
            {
                out.println(CSessionError.buildHTML());
            }
            else
            {

                CVarContextSession var_cs = new CVarContextSession(session, this.context);
                logged_user = var_cs.getBaseUser();

                /*Impostazione Log**/
                log = new CLogError(logged_user.db.getWebConnection(), request, "CRicPazRicerca", logged_user.login);
                log.setClassName(this.getClass().getName() + ".SL_RicPazRicoverati");
                log.setFileName("SL_RicPazRicoverati.java");
                log.writeLog("Inizio SL_RicPazRicoverati", CLogError.LOG_DEBUG);
                CUtility.datiFormLog("SL_RicPazRicoverati", request, log);

                worklist = new CRicPazRicoverati(request, this.context, session, log);

                out.println(worklist.worklist_pazienti());
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
            out.println(this.getClass().getName() + " -- " + e.getMessage());
        }
        out.close();
    }

    /** Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    /** Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    /** Returns a short description of the servlet.
     */
    public String getServletInfo() {
        return "Short description";
    }

}
