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

import it.elco.contatti.data.Contatto;
import it.elco.contatti.data.factory.ContattoFactory;
import it.elco.contatti.exceptions.ContattiException;
import it.elco.core.data.RpcResponse;
import it.elco.database.ContextInfo;
import it.elco.fenix.adt.servlets.AdtAPIServlet;
import it.elco.json.Json;

import javax.servlet.annotation.WebServlet;

import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(urlPatterns="/adt/CancelPendingTransferGiuridico/*")
public class CancelPendingTransferGiuridico extends AdtAPIServlet{       
       
    @Override
    protected void processJson(String json, String body, ContextInfo ctx, PrintWriter writer) throws ContattiException {
    	Contatto contatto = ContattoFactory.fromJsonString("".equalsIgnoreCase(json) ? body : json);
        processContatto(contatto,ctx,writer);
    }

    @Override
    protected void processString(String string, String body, ContextInfo ctx, PrintWriter writer){
        throw new UnsupportedOperationException("Not supported yet.");
    } 
    
    @Override
    protected void processXml(String xml, String body, ContextInfo ctx, PrintWriter writer) {
        throw new UnsupportedOperationException("Not supported yet.");
    }         
    
    private void processContatto(Contatto contatto, ContextInfo ctx, PrintWriter writer) throws ContattiException {
        
    	RpcResponse response = this.getControllerAdt().cancelPendingTransferGiuridico(contatto,ctx);

        try {
            writer.format("{\"version\":\"%s\", \"success\":true,\"contatto\":%s}", response.getVersion(), Json.stringify(contatto));
        } catch (IOException e) {
            throw new ContattiException(e);
        }

    }
    
}
