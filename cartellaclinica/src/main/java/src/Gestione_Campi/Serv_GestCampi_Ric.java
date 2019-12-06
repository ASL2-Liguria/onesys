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
 * Serv_GestCampi_Ric.java
 *
 * Created on 4 settembre 2006, 16.17
 */

package src.Gestione_Campi;

/**
 *
 * @author  fabioc
 */
import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.baseClass.baseUser;
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

import core.Global;
public class Serv_GestCampi_Ric extends HttpServlet {


    private ServletConfig sConfig = null;
    private ServletContext myContext = null;

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        sConfig = config;
        myContext = sConfig.getServletContext();
    }


    protected void processRequest(HttpServletRequest request,
                                  HttpServletResponse response) throws
            ServletException, IOException {
        CContextParam myContextParam = null;
        HttpSession mySession = null;
        Serv_GestCampi_RicEngine myEngine = null;
        CLogError log = null;
        baseUser logged_user = null;
        mySession = request.getSession(false);
        try {
            myContextParam = new CContextParam(this);
            logged_user = Global.getUser(mySession);
            log = new CLogError(logged_user.db.getWebConnection(), request,
                                "Serv_GestCampi_Ric", logged_user.login);
            log.setFileName("Serv_GestCampi_Ric");
            log.setClassName("src.Gestione_Campi.Serv_GestCampi_Ric");
        } catch (Exception ex) {
            //System.out.println(ex);
        }
        PrintWriter out = response.getWriter();

        //System.out.println("Serv_GestCampi_Ric");
        if (mySession == null) {
            out.println(CSessionError.buildHTML());
            out.close();
            return;
        } else {
            try {
                //System.out.println("Sessione Presente");
                myEngine = new Serv_GestCampi_RicEngine(request, mySession,
                        myContext, myContextParam);
                out.println(myEngine.creaDocumentoHtml());

            } catch (Exception ex) {
                out.println(ex);
                log.writeLog("Errore generale creazione Lista Lavori ",
                             CLogError.LOG_ERROR);
            }
        }

    }


    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response) throws ServletException,
            IOException {
        //System.out.println("doGet");
        processRequest(request, response);
    }


    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws ServletException,
            IOException {
        //System.out.println("doPost");
        processRequest(request, response);
    }

    public void destroy() {

    }
}
