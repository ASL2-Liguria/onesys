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
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package it.elco.whale.servlets;

import generic.statements.StatementFromFile;
import groovy.util.ScriptException;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionFactory;
import it.elco.whale.actions.scopes.Scripting.ExecuteGroovy;
import it.elco.whale.converters.MapFactory;
import org.json.JSONObject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author francescog
 */
public class HttpAction extends HttpServlet {

    private final ElcoLoggerInterface logger = new ElcoLoggerImpl(this.getClass());

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        PrintWriter writer = resp.getWriter();

        String url = req.getPathInfo();

        Pattern pattern = Pattern.compile("/([a-zA-Z]*)/([a-zA-Z]*)/(info|\\{.*\\})$");
        Matcher matcher = pattern.matcher(url);

        String scope, action, params;

        if (matcher.find()) {
            scope = matcher.group(1);
            action = matcher.group(2);
            params = matcher.group(3);
        } else {
            printError(writer, "Unrecognizable Resource");
            return;
        }

        try {
            
            logger.info("Action --> " + scope + "/" + action);
            
            String usernameAndPassword = req.getHeader("Authentication");

            if ("info".equals(params)) {
                resp.sendRedirect("../../../documentation/api/" + scope + "/" + action + ".html");
                return;
            }
            
            logger.info("Authentication requested -->" + usernameAndPassword);
            if (usernameAndPassword == null || "".equals(usernameAndPassword) || !isUserAllowed(scope, action, usernameAndPassword)) {
                accessDenied(writer);
                return;
            }
                       
            Map<String, Object> parameters = MapFactory.fromJSonString(params);

            HttpSession session = req.getSession(true);
            session.setAttribute("session-creator", this.getClass().getName()+".class");
            parameters.put(Action.sff, new StatementFromFile(session));
            parameters.put(Action.session, session);

            if (!parameters.containsKey(Action.synchronizedExecution)) {
                parameters.put(Action.synchronizedExecution, true);
            }

            JSONObject json = new JSONObject(ActionFactory.executeAction(scope, action, parameters).getOutParameters());
            writer.print(json.toString());
            
            
        } catch (Throwable t) {
            logger.error(t);
            printError(writer, t.getMessage());
        }

    }

    private boolean isUserAllowed(String scope, String action, final String usernameAndPassword) throws ScriptException {

        final StringTokenizer tokenizer = new StringTokenizer(usernameAndPassword, ":");
        final String username = tokenizer.nextToken();
        final String password = tokenizer.nextToken();

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("username", username);
        params.put("password", password);
        params.put("logger", logger);
        params.put("isAllowed", false);

        return (Boolean) ExecuteGroovy.execute("api/authorization/" + scope + "/" + action + ".groovy", params).getOutParameter("isAllowed");

    }

    private void printError(PrintWriter writer, String message) {
        writer.format("{\"success\":false,\"message\":\"%s\"}", message);
    }

    private void accessDenied(PrintWriter writer) {
        printError(writer, "Access denied for this resource");
    }

}
