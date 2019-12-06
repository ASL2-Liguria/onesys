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
package stampe.multi;

import imago.a_util.CContextParam;
import imago.http.baseClass.basePC;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
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
import org.apache.ecs.Document;
import org.json.JSONObject;

/**
 * Servlet implementation class elabStampaMultiPdf
 */
public class elabStampaMulti extends HttpServlet {

    private ServletConfig sConfig = null;
    private ServletContext myContext = null;
    private ElcoLoggerInterface logger = null;

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        sConfig = config;
        myContext = sConfig.getServletContext();
        this.logger = new ElcoLoggerImpl(this.getClass().getSimpleName());
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        CContextParam myContextParam = null;
        HttpSession mySession = null;
        elabStampaMultiEngine MYelabStampaEngine = null;
        PrintWriter out = response.getWriter();
        basePC infoPC = null;

        if (("text/plain").equals(request.getParameter("httpAccept"))) {
            try {
                response.setContentType("response.setContentType(\"text/javascript\");");
                MYelabStampaEngine = new elabStampaMultiEngine();
                String callback = request.getParameter("callback");
                JSONObject json = new JSONObject();
                json.put("url", MYelabStampaEngine.getStaticUrlPdf(request));
                out.print(callback + "(" + json.toString() + ")");
            } catch (Exception ex) {
                logger.error(ex.getMessage());
            } finally {
                out.flush();
            }
        } else {
            mySession = request.getSession(false);
            try {
                myContextParam = new CContextParam(this);
            } catch (Exception ex) {
                logger.error(ex.getMessage());
            }
            logger.info("Inizializzata Servlet ElabStampa");

            if (mySession == null) {
                out.println(CSessionError.buildHTML());
                out.close();
                return;
            } else {
                try {
                    //System.out.println("      Sessione Presente") ;
                    infoPC = (basePC) mySession.getAttribute("parametri_pc");
                    MYelabStampaEngine = new elabStampaMultiEngine(mySession, myContext, request, myContextParam);

                    if (infoPC.DIRECTORY_REPORT == null || infoPC.DIRECTORY_REPORT.equalsIgnoreCase("")) {
//                    /*Errore_Configurazione Error= new Errore_Configurazione(mySession,request,"elabStampa","noConf",myContextParam);
//                           Document ErroreHtml=(Error.creaDocumentoHtml());*/
                        out.println("Errore Stampe ElabStampa2");
                    } else {
                        Document Htmlfinito = (MYelabStampaEngine.creaHtml());
                        out.println(Htmlfinito);
                    }
                } catch (Exception ex) {
                    out.println(ex);
                    logger.error("Errore generale creazione stampa" + ex.getMessage());
                } finally {
                    out.flush();
                }
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //System.out.println("doGet") ;
        processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //System.out.println("doPost") ;
        processRequest(request, response);
    }

    public void destroy() {

    }

}
