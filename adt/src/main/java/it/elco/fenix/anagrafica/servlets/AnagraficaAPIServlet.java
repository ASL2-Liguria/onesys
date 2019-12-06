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
package it.elco.fenix.anagrafica.servlets;

import it.elco.anagrafica.ControllerAnagrafica;
import it.elco.baseObj.factory.baseFactory;
import it.elco.core.actions.LoadPropertiesFile;
import it.elco.fenix.DataFormat;
import it.elco.fenix.adt.ControllerAdtWeb;
import it.elco.fenix.anagrafica.ControllerAnagraficaWeb;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Controller Anagrafica per gestione eventi che hanno come oggetto l'anagrafica e non il contatto.
 * Es A45 MergePatient
 * 
 * @author alessandroa
 */

public abstract class AnagraficaAPIServlet extends HttpServlet {

    private ControllerAnagrafica controller = null;
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    	processRequest(req, resp);
    }
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	processRequest(req, resp);
    }

    protected ControllerAnagrafica getControllerAnagrafica(){
        return this.controller;
    }
    
    private void processRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException{
    	
    	resp.setContentType("application/json");
    	PrintWriter writer = resp.getWriter();
        
    	// Istanzio Controller Anagrafico
        if (controller == null) {
            try {
            	controller = new ControllerAnagraficaWeb(new LoadPropertiesFile(this.getClass().getResourceAsStream("/config/properties/controller.properties")).execute());
            } catch (Throwable ex) {                
                writer.format("{\"success\":false,\"message\":\"%s\"}", "Errore durante la creazione del Controller: %s", ex.getMessage());
                return;
            }
        }
        
        // Gestione lettura BODY REQUEST
        StringBuffer jb = new StringBuffer();
        
        try {
            String line = null;
            BufferedReader reader = req.getReader();
            
            while ((line = reader.readLine()) != null) {
            	jb.append(line);
            }
            
        } catch (Exception e) { 
        	writer.format("{\"success\":false,\"message\":\"%s\"}", "Errore durante la lettura del BODY request: %s", e.getMessage());
        	return;
        }
        
        // Gestione Input Chiamata
        String url = req.getPathInfo();
        
        Pattern pattern = Pattern.compile("/([a-z]*)/(.*)");
        Matcher matcher = pattern.matcher(url);

        if (matcher.find()) {

            try {

            	// DataFormat format = DataFormat.valueOf(matcher.group(1));
            	
                switch (DataFormat.valueOf(matcher.group(1))) {
                    case string:
                        processString(matcher.group(2), String.valueOf(jb), writer);
                        break;
                    case json:
                        processJson(matcher.group(2), String.valueOf(jb), writer);
                        break;
                    case xml:
                        processXml(matcher.group(2), jb.toString(), writer);
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
    
    protected abstract void processString(String string, String body, PrintWriter writer) throws  Throwable;
    
    protected abstract void processJson(String json, String body, PrintWriter writer) throws  Throwable;

    protected abstract void processXml(String xml, String body, PrintWriter writer) throws  Throwable;
}
