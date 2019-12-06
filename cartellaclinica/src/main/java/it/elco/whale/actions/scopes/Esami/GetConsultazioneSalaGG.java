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
package it.elco.whale.actions.scopes.Esami;

import generic.statements.StatementFromFile;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionParameter;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;
import it.elco.whale.actions.scopes.Database.GetListFromResultset;
import java.util.List;
import org.json.JSONArray;

/**
 *
 * @author francescog
 */
public class GetConsultazioneSalaGG extends Action {

    public GetConsultazioneSalaGG() {
        super();
    }
    
    @NotNull
    private StatementFromFile sff;
    
    @NotNull
    private String cod_cdc,giorni;
    
    @NotNull
    private String[] codici_sale;

    @Setter(key = "sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key = "cod_cdc")
    public void setCodCdc(String cod_cdc) {
        this.cod_cdc = cod_cdc;
    }

    @Setter(key = "codici_sale")
    public void setCodiciSale(String codici_sale) {
        this.codici_sale = codici_sale.split("[|]");
    }

    @Setter(key = "giorni")
    public void setGiorni(String giorni) {
        this.giorni = giorni;
    }

    @Override
    public ActionResponse execute() throws Throwable {

        ActionResponse response = new ActionResponse(true);
        
        for (int i = 0; i < codici_sale.length; i++) {
            
            String[] resp = sff.executeStatement("PST_Prenotazione.xml", "getConfigurazioneSala", new String[]{codici_sale[i]}, 1);

            if (resp[0].equals("KO")) {
                throw new Exception(resp[1]);
            }

            List records = GetListFromResultset.execute(sff, "PST_Prenotazione.xml", "getConsultazioneTerapieSalaGG", new String[]{cod_cdc,codici_sale[i],resp[2],giorni}).getRecords();
            
            response.setOutParameter(new ActionParameter(codici_sale[i], (new JSONArray(records)).toString()));                        
        }
                
        return response;
    }
}
