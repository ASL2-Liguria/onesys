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
package worklist;

import imago.a_sql.CLogError;
import imago.a_util.CClientParam;
import imago.a_util.CContextParam;
import imago.a_util.CUtility;
import imago.http.ImagoHttpException;
import imago.http.baseClass.baseUser;
import imago.util.CVarContextSession;
import imago.winbuild.CSessionError;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


/**
 * Servlet implementation class for Servlet: SL_SceltaFiltroStato
 *
 * @web.servlet
 *   name="SL_SceltaFiltroStato"
 *   display-name="SL_SceltaFiltroStato"
 *   description=
 *   "Servlet chiamata dai Filtri per visualizzare la scelta dei filtri sullo stato
 *   esame che l'utente vuole visualizzare nella worklist degli esami"
 *
 * @web.servlet-mapping
 *   url-pattern="/SL_SceltaFiltroStato"
 *
 */
public class SL_SceltaFiltroStato extends javax.servlet.http.HttpServlet
{
    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private ServletContext context = null;
    private HttpSession session = null;
    private baseUser logged_user = null;

    /** Initializes the servlet.
     */
    public void init(ServletConfig config) throws ServletException
    {
        super.init(config);
        context = config.getServletContext();
    }

    /** Destroys the servlet.
     */
    public void destroy()
    {

    }

    private void getVarContextSession() throws ImagoHttpException
    {
        CVarContextSession var_cs = new CVarContextSession(this.session, this.context);
        this.logged_user = var_cs.getBaseUser();
    }

    /** Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setContentType("text/html");

        PrintWriter out = response.getWriter();
        CSceltaFiltroStato scelta_stato = null;
        CClientParam client_param = new CClientParam(request);
        CLogError log = null;

        this.session = request.getSession(false);
        if(this.session != null)
        {
            CContextParam cp = new CContextParam(this);
            try
            {
                this.getVarContextSession();

                //Impostazione Log
                log = new CLogError(this.logged_user.db.getWebConnection(), request, "SL_SceltaFiltroStato", logged_user.login);
                log.setClassName("worklist.SL_SceltaFiltroStato");
                log.setFileName("SL_SceltaFiltroStato.java");

                log.writeLog("Inizio della costruzione della pagina HTML per SL_SceltaFiltroStato", CLogError.LOG_DEBUG);

                CUtility.datiFormLog("SL_SceltaFiltroStato", request, log);

                scelta_stato = new CSceltaFiltroStato(this.logged_user, client_param, cp, log, session, context, request);
                out.println(scelta_stato.creaWorklist());
            }
            catch(Exception e)
            {
                e.printStackTrace();
                log.writeError("worklist.SL_SceltaFiltroStato.processRequest " + e.getMessage());
            }
        }
        else
        {
            out.println(CSessionError.buildHTML());
        }
        out.close();
    }


    /** Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        processRequest(request, response);
    }

    /** Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        processRequest(request, response);
    }

    /** Returns a short description of the servlet.
     */
    public String getServletInfo()
    {
        return "Short description";
    }


}
