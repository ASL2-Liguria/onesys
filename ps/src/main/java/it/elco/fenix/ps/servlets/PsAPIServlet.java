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
package it.elco.fenix.ps.servlets;

import it.elco.baseObj.factory.baseFactory;
import it.elco.baseObj.iBase.iBasePC;
import it.elco.baseObj.iBase.iBaseUser;
import it.elco.caronte.datasource.ElcoOracleDataSource;
import it.elco.contatti.ControllerProperties;
import it.elco.contatti.ControllerProperties.ControllerPropertyKey;
import it.elco.core.actions.LoadPropertiesFile;
import it.elco.core.converters.StringFactory;
import it.elco.database.ContextInfo;
import it.elco.database.DataSourceManager;
import it.elco.fenix.DataFormat;
import it.elco.fenix.adt.ControllerAdtWeb;
import it.elco.fenix.ps.ControllerPsWeb;
import it.elco.ps.ControllerPs;
import it.elco.toolkit.toolKitShortcut;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Servlet che viene estesa da tutti i metodi inerenti al cntatto dell'applicativo.
 * Istanzia il controller e se gia' esiste controlla la valorizzazione dei parametri della connessione.
 * 
 * @author alessandro.arrighi
 */
public abstract class PsAPIServlet extends HttpServlet {

	private ControllerPs controller = null;

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String url = req.getPathInfo();
        String body = StringFactory.fromStream(req.getInputStream());

        PrintWriter writer = resp.getWriter();
        Pattern pattern = Pattern.compile("/([a-z]*)/(.*)");
        Matcher matcher = pattern.matcher(url);

        String UNKNOWN = "UNKNOWN";
        String MODULE = "FENIX-PS";

        if(!toolKitShortcut.checkSession(req, resp, true)) {
            return;
        }

        resp.setContentType("application/json");

        if (controller == null) {
            try {
                controller = new ControllerPsWeb(new LoadPropertiesFile(this.getClass().getResourceAsStream(baseFactory.getBaseGlobal("ADT","2.6.0").get("controller.properties.file"))).execute());
            } catch (Throwable ex) {
                writer.format("{\"success\":false,\"message\":\"%s\"}", "Errore durante la creazione del Controller: %s", ex.getMessage());
                return;
            }
        }

        // Valorizzo i dati di sessione
        HttpSession session = req.getSession(false);

        iBaseUser baseUser = baseFactory.getBaseUser(session);
        iBasePC basePc = baseFactory.getBasePC(session);
        String clientId = ("".equals(baseUser.getWebuser()) ? UNKNOWN : baseUser.getWebuser()) + "@" + ("".equals(basePc.getIp()) ? UNKNOWN : basePc.getIp());

        ContextInfo ctx = new ContextInfo();
        String strAction = new String(req.getServletPath());
        strAction = strAction.length() > 32 ? new String(strAction).substring(0,32) : strAction;
        ctx.setAction(strAction);
        ctx.setClientID(clientId);
        ctx.setModule(MODULE);

        if (matcher.find()) {

            try {

                switch (DataFormat.valueOf(matcher.group(1))) {
                    case string:
                        processString(matcher.group(2), body, ctx, writer);
                        break;
                    case json:
                        processJson(matcher.group(2), body, ctx, writer);
                        break;
                    case xml:
                        processXml(matcher.group(2), body, ctx, writer);
                        break;
                    default:
                        throw new ServletException("DataFormat non valido");
                }

            } catch (Throwable ex) {
                writer.format("{\"success\":false,\"message\":\"%s\"}", ex.getMessage());
            }

        } else {
            writer.format("{\"success\":false,\"message\":\"%s\"}", "Formato URL non valido");
        }
    }

    protected ControllerPs getControllerPs(){
        return this.controller;
    }
    
    protected abstract void processString(String string, String body, ContextInfo ctx, PrintWriter writer) throws Throwable;
    
    protected abstract void processJson(String json, String body, ContextInfo ctx, PrintWriter writer) throws Throwable;

    protected abstract void processXml(String xml, String body, ContextInfo ctx, PrintWriter writer) throws Throwable;
}
