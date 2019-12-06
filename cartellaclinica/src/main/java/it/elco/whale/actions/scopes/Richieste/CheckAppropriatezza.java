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
package it.elco.whale.actions.scopes.Richieste;

import generic.statements.StatementFromFile;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;
import it.elco.whale.actions.scopes.Scripting.ExecuteGroovy;
import java.sql.ResultSet;
import java.util.Map;

/**
 *
 * @author
 * francescog
 */
public class CheckAppropriatezza extends Action {

    private StatementFromFile sff;
    @NotNull
    private Map<String, Object> message;
    @NotNull
    private String richiedente;

    @Setter(key = "sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key = "message")
    public void setRichiesta(Map<String, Object> message) {
        this.message = message;        
    }

    @Setter(key = "richiedente")
    public void setRichiedente(String richiedente) {
        this.richiedente = richiedente;        
    }    
    
    @Override
    public ActionResponse execute() throws Throwable {

        String[] outs = this.sff.executeStatement("configurazioni.xml", "getValueCdc", new String[]{this.richiedente, "OE_CHECK_APPROPRIATEZZA"}, 1);

        if (outs[0].equals("KO")) {
            return new ActionResponse(false, outs[1]);
        }

        String script_path = outs[2];

        if (script_path != null) {

            completaAnagrafica((Map<String, Object>) message.get("PAZIENTE"));

            ActionResponse response = ExecuteGroovy.execute(script_path, this.message);

            if (response.getSuccess() == false) {
                return response;
            }

            if (response.getOutParameter("out_success").equals(false)) {
                return new ActionResponse(false, response.getOutParameterString("out_message"));
            }

            return new ActionResponse(true, response.getOutParameterString("out_message"));
        }

        return new ActionResponse();

    }

    private void completaAnagrafica(Map<String, Object> paziente) throws Exception {
        ResultSet rs = this.sff.executeQuery("cartellaPaziente.xml", "getPaziente", new String[]{String.valueOf(paziente.get("ID"))});

        if (rs.next()) {
            // Completamento dati paziente
            paziente.put("CF", rs.getString("COD_FISC"));
            paziente.put("TS", rs.getString("TESSERA_SANITARIA"));
            paziente.put("NOME", rs.getString("NOME"));
            paziente.put("COGNOME", rs.getString("COGN"));
            paziente.put("DATA", rs.getString("DATA"));
            paziente.put("SESSO", rs.getString("SESSO"));
        }

    }
}
