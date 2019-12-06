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
package cartellaclinica.gestioneTerapia.pianoTerapeutico.pianoGiornaliero;

import imago.sql.SqlQueryException;
import imago.winbuild.CSessionError;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class pianoGiornaliero extends HttpServlet {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private static final String CONTENT_TYPE = "text/html";
    private ServletContext sCont = null;

//Initialize global variables
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        sCont = config.getServletContext();
    }

//Process the HTTP Get request
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType(CONTENT_TYPE);
        PrintWriter out = response.getWriter();
        pianoGiornalieroEngine cEng = null;

        //Object writeMonitor = new Object();

        if (request.getSession(false) != null) {
            try {
                cEng = new pianoGiornalieroEngine(sCont, request);



                out.println("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/1999/REC-html401-19991224/loose.dtd\">");
                out.println("<HTML>" + cEng.createHead().toString());
                out.flush();


                out.println(cEng.gestione());

            } catch (Exception ex) {
            }
        } else {
            out.println(CSessionError.buildHTML());
        }

        out.close();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

//Clean up resources
    public void destroy() {
    }
}
