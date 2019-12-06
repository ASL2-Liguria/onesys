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
package it.elco.fenix.adt.servlets;

import it.elco.adt.ControllerAdt;
import it.elco.baseObj.factory.baseFactory;
import it.elco.baseObj.iBase.iBasePC;
import it.elco.baseObj.iBase.iBaseUser;
import it.elco.core.actions.LoadPropertiesFile;
import it.elco.core.converters.StringFactory;
import it.elco.database.ContextInfo;
import it.elco.fenix.DataFormat;
import it.elco.fenix.adt.ControllerAdtWeb;
import it.elco.toolkit.toolKitShortcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


public abstract class AdtAPIServlet extends HttpServlet {

    private ControllerAdt controller = null;
    private final Logger logger = LoggerFactory.getLogger(AdtAPIServlet.class);

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException {
    	processRequest(req, resp);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException {
    	processRequest(req, resp);
    }

    protected void setControllerAdt() throws ServletException {

        if (this.controller == null) {
            try {
                controller = new ControllerAdtWeb(new LoadPropertiesFile(this.getClass().getResourceAsStream("/config/properties/controller.properties")).execute());
            } catch (Throwable ex) {
                throw new ServletException(String.format("Errore durante la creazione del controller: %s",ex.getMessage()),ex);
            }
        }
    }

    protected ControllerAdt getControllerAdt(){
        return this.controller;
    }

    protected Logger getLogger(){ return this.logger; }

    protected String getBody(HttpServletRequest req) throws ServletException {

        String encoding = req.getCharacterEncoding();

        try {
            return  (encoding == null) ? new String(StringFactory.fromStream(req.getInputStream()).getBytes()) : new String(StringFactory.fromStream(req.getInputStream()).getBytes(), encoding);
        } catch (IOException e){
            throw new ServletException(e);
        }
    }

    private void processRequest(HttpServletRequest req, HttpServletResponse resp) throws ServletException {

        String body = this.getBody(req);

        if (!toolKitShortcut.checkSession(req, resp, true)) {
            return;
        }

        this.setControllerAdt();

        String UNKNOWN = "UNKNOWN";
        String MODULE = "FENIX-ADT";
        HttpSession session = req.getSession(false);
        iBaseUser baseUser = baseFactory.getBaseUser(session);
        iBasePC basePc = baseFactory.getBasePC(session);
        String clientId = ("".equals(baseUser.getWebuser()) ? UNKNOWN : baseUser.getWebuser()) + "@" + ("".equals(basePc.getIp()) ? UNKNOWN : basePc.getIp());

        ContextInfo ctx = new ContextInfo();
        ctx.setAction(req.getServletPath());
        ctx.setClientID(clientId);
        ctx.setModule(MODULE);

        Pattern pattern = Pattern.compile("/([a-z]*)/(.*)");
        Matcher matcher = pattern.matcher(req.getPathInfo());

        if (matcher.find()) {

            resp.setContentType("application/json");

            PrintWriter writer = null;

            // Non viene utilizzato il try-with-resource in quanto quest ultimo chiude la resorce prima del catch
            try {

                writer = resp.getWriter();

                this.getLogger().debug(String.format("Process %s - format %s, GET parameter %s, body %s", req.getServletPath(), matcher.group(1), matcher.group(2), body));

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

                this.getLogger().info(String.format("Process %s tramite %s eseguita con successo", req.getServletPath(), this.getClass()));

            } catch (Throwable ex) {

                this.logger.error(String.format("path %s - message %s - format %s - body %s", req.getServletPath(), ex.getMessage(), matcher.group(1), body), ex);

                resp.setStatus(500);

                writer.println(ex.getMessage());

            } finally {
                writer.close();
            }

        } else {
            this.logger.error(String.format("Formato url %s non valido", req.getPathInfo()));
        }
    }

    protected abstract void processString(String string, String body, ContextInfo ctx, PrintWriter writer) throws  Throwable;

    protected abstract void processJson(String json, String body, ContextInfo ctx, PrintWriter writer) throws  Throwable;

    protected abstract void processXml(String xml, String body, ContextInfo ctx, PrintWriter writer) throws  Throwable;
}