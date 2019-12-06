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
import it.elco.whale.actions.scopes.Esami.SendXmlEsamiRequest;
import it.elco.whale.actions.scopes.Esami.SendXmlEsamiRequest.MetodoValues;
import it.elco.whale.actions.scopes.Esami.beans.Richiesta;
import it.elco.whale.actions.scopes.Esami.beans.Response;
import java.util.ArrayList;

/**
 *
 * @author francescog
 */
public class AnnullaPrestazioneAssociata extends Action{
    
    @NotNull
    private StatementFromFile sff;
    
    @NotNull
    private String iden_richiesta,motivo_annullamento;

    @Setter(key="sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }   
    
    public AnnullaPrestazioneAssociata(){
        super();
    }    
    
    private AnnullaPrestazioneAssociata(StatementFromFile sff, String iden_richiesta, String motivo_annullamento) {
        this.sff = sff;
        this.iden_richiesta = iden_richiesta;
        this.motivo_annullamento = motivo_annullamento;
    }    
    
    @Setter(key="iden_richiesta")
    public void setIdenRichiesta(String iden_richiesta) {
        this.iden_richiesta = iden_richiesta;
    }

    @Setter(key="motivo_annullamento")
    public void setMotivoAnnullamento(String motivo_annullamento) {
        this.motivo_annullamento = motivo_annullamento;
    }

    @Override
    public ActionResponse execute() throws Throwable {
        
        ArrayList<Richiesta> richieste = new ArrayList<Richiesta>();
        Richiesta richiesta = new Richiesta();
         richiesta.setTipo("P");
        richiesta.setIdentificativoEsterno("1", this.iden_richiesta);            
        
        richieste.add(richiesta);               
        
        Response response = SendXmlEsamiRequest.execute(sff, MetodoValues.Cancellazione, richieste,motivo_annullamento).getStructuredResponse();
        
        if(response.getPrestazioni().isEmpty() || response.getPrestazioni().get(0).getCodiceErrore().equals("-20113")){
            return new ActionResponse(true);
        }else{
            return new ActionResponse(false, response.getPrestazioni().get(0).getDescrizioneErrore());
        }
                
    }        
    
    public static ActionResponse execute(StatementFromFile sff, String iden_richiesta, String motivo_annullamento) throws Throwable{        
        AnnullaPrestazioneAssociata canceller = new AnnullaPrestazioneAssociata(sff,iden_richiesta,motivo_annullamento);
        return canceller.execute();
    }
}
