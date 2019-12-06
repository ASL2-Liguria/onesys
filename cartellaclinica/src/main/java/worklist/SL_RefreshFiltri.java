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
 * SL_RefreshFiltri.java
 *
 * Created on 7 luglio 2006, 15.14
 */

package worklist;

import imago.a_sql.CLogError;
import imago.a_util.CClientParam;
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

import org.apache.ecs.html.Body;
import org.apache.ecs.html.Head;
import org.apache.ecs.html.Html;

/**
 * Servlet richiamata dalla pagina di scelta dei cdc nella gestione dei filtri.
 * Tale servlet farà in modo di aggiornare, al cambiamento della scelta dei cdc,
 * le parti che dipendono da questo valore.
 *  Nei filtri sono le sale, le provenienze ed i medici
 *
 * @author  elenad
 * @version
 */
public class SL_RefreshFiltri extends HttpServlet {
    private HttpSession         session = null;
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

    /**
     * Metodo per prendere i parametri di sessione dell'utente loggato
     * @return oggetto utente che contiene tutte le variabili contenute in imagoweb.web
     */
    private baseUser getVarContextSession(){
        CVarContextSession var_cs = new CVarContextSession(this.session, this.context);
        return (var_cs.getBaseUser());
    }

    /** Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        CLogError log = null;
        try{
            session = request.getSession(false);
            if(session == null){
                out.println(CSessionError.buildHTML());
                out.close();
            }
            else{
                CClientParam client_param = new CClientParam(request);
                baseUser logged_user = this.getVarContextSession();

                /*
                 Impostazione Log
                 **/
                log = new CLogError(logged_user.db.getWebConnection(), request, "SL_RefreshFiltri", logged_user.login);
                log.setClassName("worklist.SL_RefreshFiltri");
                log.setFileName("SL_RefreshFiltri.java");
                log.writeLog("Inizio SL_RefreshFiltri", CLogError.LOG_DEBUG);
                CUtility.datiFormLog("SL_RefreshFiltri", request, log);

                CRefreshFiltri refresh = new CRefreshFiltri(log, client_param, logged_user);

                Head head=new Head();
                Body body=new Body();
                Html html=new Html();

                head.addElement("<script type='text/javascript' src='std/jscript/worklist/Filtri/gestione_filtri.js' language='JavaScript'></script>");

                html.addElement(head.toString()+"\n");
                String reload_provenienze = "<SCRIPT>\n";
                reload_provenienze += refresh.addJsBottom() + "\n";
                reload_provenienze += "refreshFiltri();\n";
                reload_provenienze += "</SCRIPT>\n";
                body.addElement(reload_provenienze);
                html.addElement(body.toString()+"\n");
                out.println(html.toString());


                out.close();
            }
        }
        catch(Exception e){
            e.printStackTrace();
            log.writeError("worklist.SL_RefreshFiltri.processRequest " + e.getMessage());
        }
    }

    /** Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        processRequest(request, response);
    }

    /** Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        processRequest(request, response);
    }

    /** Returns a short description of the servlet.
     */
    public String getServletInfo() {
        return "Short description";
    }

}
