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
package FirmaDigitaleGenerica;

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

public class SrvFirmaPdfGenerica extends HttpServlet {
    private ServletConfig sConfig = null;
    private ServletContext myContext = null;

    @Override
	public void init(ServletConfig config) throws ServletException {
        super.init(config);
        this.sConfig = config;
        this.myContext = this.sConfig.getServletContext();
    }

    protected void processRequest(HttpServletRequest request,
                                  HttpServletResponse response) throws
            ServletException, IOException {
        HttpSession mySession = null;
        mySession = request.getSession(false);
		basePC bPC = null;

        ElcoLoggerInterface ElI = new ElcoLoggerImpl(SrvFirmaPdfGenerica.class);
        PrintWriter out = response.getWriter();
        FirmaPdfEngineGenerica EFD = null;
		FirmaPdfEngineGenericaMulti EFDM = null;
        if (mySession == null) {
            ElI.warn("Sessione nulla impossibile continuare");
            out.println(CSessionError.buildHTML());
            out.close();
            return;
        }
        try {
			bPC = (basePC) mySession.getAttribute("parametri_pc");
			if ("S".equalsIgnoreCase(bPC.abilita_firma_digitale)) {
				EFDM = new FirmaPdfEngineGenericaMulti(mySession,
						this.myContext, request, response);
				EFDM.elabora();
				out.println(EFDM.getHtml());
			} else {
				EFD = new FirmaPdfEngineGenerica(mySession, this.myContext,
						request, response);
				EFD.elabora();
				out.println(EFD.getHtml());
			}

        } catch (Exception ex) {
            ElI.error(ex.getMessage());
            out.println("Errore nella Generazione della pagina: ");
            out.println(ex.getMessage());
            out.println(ex.getLocalizedMessage());
            out.println("**************                ************");
            for (int i = 0; i < ex.getStackTrace().length; ++i) {
                out.println(ex.getStackTrace()[1].toString());
            }
        }
    }

    @Override
	protected void doGet(HttpServletRequest request,
                         HttpServletResponse response) throws ServletException,
            IOException {
        processRequest(request, response);
    }

    @Override
	protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws
            ServletException, IOException {
        processRequest(request, response);
    }

    @Override
	public void destroy() {
    }
}


