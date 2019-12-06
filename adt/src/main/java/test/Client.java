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
package test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import it.elco.fenix.DataFormat;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Client di invio messaggi HL7 OMG_O19
 * Es. {"MESSAGE":[{"NAME":"OMG_O19","VALUE":{"MSH":{"MSH.1":"|","MSH.2":"^~\\&","MSH.3":"DNLAB","MSH.4":"NOEMALIFE","MSH.5":"PROMETEO","MSH.6":"NOEMALIFE","MSH.7":"20131218154401.561","MSH.9":{"MSG.1":"OMG","MSG.2":"O19","MSG.3":"OMG_O19"},"MSH.10":"20131218154401.561","MSH.11":"P","MSH.12":"2.5"},"PATIENT":{"PID":{"PID.3":[{"CX.1":"VRGNTN50A21I158A","CX.5":"PK"},{"CX.1":"ASDASDASDASDA","CX.5":"CF"},{"CX.1":"826012601A11","CX.5":"SSN"}],"PID.5":{"XPN.1":"Rossi","XPN.2":"Mario"},"PID.7":"20131218","PID.8":"M"}},"ORDER":[{"ORC":{"ORC.1":"NW","ORC.2":"465001851","ORC.4":"46500185","ORC.9":"201312181544","ORC.21":"10055","ORC.29":"0"},"OBSERVATION_REQUEST":{"OBR":{"OBR.1":"1","OBR.2":"465001851","OBR.4":"1001","OBR.7":"201312181544"},"OBSERVATION":[{"OBX":{"OBX.1":"1","OBX.2":"ST","OBX.3":{"CE.1":"ALTEZZA","CE.2":"Altezza del paziente","CE.3":"LN"},"OBX.5":"160","OBX.11":"F"}},{"OBX":{"OBX.1":"2","OBX.2":"ST","OBX.3":{"CE.1":"DATAULTIMEMESTR","CE.2":"Data ultime mestr.","CE.3":"LN"},"OBX.5":"","OBX.11":"F"}}]}},{"ORC":{"ORC.1":"NW","ORC.2":"465001852","ORC.4":"46500185","ORC.9":"201312181544","ORC.21":"10055","ORC.29":"0"},"OBSERVATION_REQUEST":{"OBR":{"OBR.1":"2","OBR.2":"465001852","OBR.4":"1003","OBR.7":"201312181544"},"OBSERVATION":[{"OBX":{"OBX.1":"1","OBX.2":"ST","OBX.3":{"CE.1":"OPERATORE","CE.2":"Consulting doctor","CE.3":"LN"},"OBX.5":"","OBX.11":"F"}},{"OBX":{"OBX.1":"2","OBX.2":"ST","OBX.3":{"CE.1":"PESO","CE.2":"Peso del paziente","CE.3":"LN"},"OBX.5":"77","OBX.11":"F"}},{"OBX":{"OBX.1":"3","OBX.2":"ST","OBX.3":{"CE.1":"ALTEZZA","CE.2":"Altezza del paziente","CE.3":"LN"},"OBX.5":"","OBX.11":"F"}}]}},{"ORC":{"ORC.1":"NW","ORC.2":"465001853","ORC.4":"46500185","ORC.9":"201312181544","ORC.21":"10055","ORC.29":"0"},"OBSERVATION_REQUEST":{"OBR":{"OBR.1":"3","OBR.2":"465001853","OBR.4":"1005","OBR.7":"201312181544"},"OBSERVATION":[{"OBX":{"OBX.1":"1","OBX.2":"ST","OBX.3":{"CE.1":"OPERATORE","CE.2":"Consulting doctor","CE.3":"LN"},"OBX.5":"","OBX.11":"F"}},{"OBX":{"OBX.1":"2","OBX.2":"ST","OBX.3":{"CE.1":"DIURESI","CE.2":"Diuresi nelle 24h","CE.3":"LN"},"OBX.5":"1500","OBX.11":"F"}}]}},{"ORC":{"ORC.1":"NW","ORC.2":"465001854","ORC.4":"46500185","ORC.9":"201312181544","ORC.21":"10055","ORC.29":"0"},"OBSERVATION_REQUEST":{"OBR":{"OBR.1":"4","OBR.2":"465001854","OBR.4":"1007","OBR.7":"201312181544"},"OBSERVATION":[{"OBX":{"OBX.1":"1","OBX.2":"ST","OBX.3":{"CE.1":"PESO","CE.2":"Peso del paziente","CE.3":"LN"},"OBX.5":"91","OBX.11":"F"}},{"OBX":{"OBX.1":"2","OBX.2":"ST","OBX.3":{"CE.1":"ALTEZZA","CE.2":"Altezza del paziente","CE.3":"LN"},"OBX.5":"190","OBX.11":"F"}}]}}]}}]}
 * @author marcoulr <marco.ubertonelarocca at elco.it>
 */
@WebServlet(urlPatterns="/adt/Client/*")
public class Client extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
		response.setContentType("application/json");
        //response.setCharacterEncoding("UTF-8");
    	response.setCharacterEncoding("ISO-8859-1");
        PrintWriter out = response.getWriter();
        String url = request.getPathInfo();
        Pattern pattern = Pattern.compile("/([a-z]*)");
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()){
        	try {

                DataFormat format = DataFormat.valueOf(matcher.group(1));
                switch (format) {
                	case json: 
                		String message=getBody(request);
	                	senderHl7 sender = new senderHl7(message);  
	                	out.format(sender.sendMessage(getServletContext().getRealPath("/")));
	                    break;
                	default:
                        throw new ServletException("DataFormat non valido");
                }                	
                
	        } catch (Throwable ex) {                
	            out.format("{\"STATO\":\"KO\",\"MESSAGGIO\":\"%s\"}", ex.getMessage());
	            //ex.printStackTrace(resp.getWriter());
	        }
	    	finally {            
	            out.close();
	        }
        }else {
            out.format("{\"STATO\":\"KO\",\"MESSAGGIO\":\"%s\"}", "Formato URL non valido");
        }
        
    }

	private String getBody(HttpServletRequest req) throws IOException {
		
		StringBuilder stringBuilder = new StringBuilder();
		BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(req.getInputStream()));
        char[] charBuffer = new char[128];
        int bytesRead = -1;
        while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
            stringBuilder.append(charBuffer, 0, bytesRead);
        }
        
        return stringBuilder.toString();
        
	}
	
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
        processRequest(request, response);
        
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
        processRequest(request, response);
        
    }

    @Override
    public String getServletInfo() {
    	
        return "Short description";
        
    }// </editor-fold>
    
}
