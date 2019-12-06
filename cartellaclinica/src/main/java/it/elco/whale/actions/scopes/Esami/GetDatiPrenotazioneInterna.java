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

import cartellaclinica.cartellaPaziente.data.base.cEvento;
import cartellaclinica.cartellaPaziente.data.cAccesso;
import cartellaclinica.cartellaPaziente.data.cRicovero;
import generic.statements.StatementFromFile;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionParameter;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;
import it.elco.whale.actions.scopes.Esami.DecodeIdenAnagIdenPro.DecodeIdenAnagIdenProResponse;

/**
 *
 * @author francescog
 */
public class GetDatiPrenotazioneInterna  extends Action{

    public class GetDatiPrenotazioneInternaResponse extends ActionResponse{

        private GetDatiPrenotazioneInternaResponse(String iden_ricovero, String iden_visita, String id_ris_paziente, String iden_pro){
            super(new ActionParameter("iden_ricovero", iden_ricovero),new ActionParameter("iden_visita", iden_visita),new ActionParameter("ID_RIS_PAZIENTE", id_ris_paziente),new ActionParameter("IDEN_PRO", iden_pro));            
        }     
        
        public String getIdenRicovero() throws Throwable{
            return this.getOutParameterString("iden_ricovero");
        }
        
        public String getIdenVisita() throws Throwable{
            return this.getOutParameterString("iden_visita");
        }        
        
        public String getIdRis() throws Throwable{
            return this.getOutParameterString("ID_RIS_PAZIENTE");
        }

        public String getIdenPro() throws Throwable{
            return this.getOutParameterString("IDEN_PRO");
        }         
        
    }    
    
    @NotNull
    private StatementFromFile sff;
    
    @NotNull
    private String iden_evento;
    
    public GetDatiPrenotazioneInterna() {
        super();
    }   
    
    private GetDatiPrenotazioneInterna(StatementFromFile sff,String iden_evento){             
        this.sff = sff;
        this.iden_evento = iden_evento;        
    }    
    
    @Setter(key="sff") 
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key="iden_evento") 
    public void setIdenEvento(String iden_evento) {
        this.iden_evento = iden_evento;
    }    
    
    @Override
    public GetDatiPrenotazioneInternaResponse execute() throws Throwable {

        cRicovero Ricovero = null;
        cAccesso Accesso = null;
               
        cEvento vEvento = new cEvento(this.sff, this.iden_evento);
        
        switch (Integer.valueOf(vEvento.getAccesso())) {
        case 0:
            Ricovero = new cRicovero(vEvento);
            Accesso = new cAccesso(this.sff, Ricovero.getLinkAccesso());
            break;
        case 1:           
            Accesso = new cAccesso(this.sff, vEvento);
            Ricovero = new cRicovero(this.sff, Accesso.getIdenRicovero());
            break;
        }    
          
        DecodeIdenAnagIdenProResponse response = DecodeIdenAnagIdenPro.execute(this.sff, vEvento.getIdenAnag(), Accesso.getReparto().getCodDec());
        
        return new GetDatiPrenotazioneInternaResponse(
                    Accesso.getIden(),
                    Ricovero.getIden(),
                    response.getIdRis(),
                    response.getIdenPro()
                );

    }
    
    public static GetDatiPrenotazioneInternaResponse execute(StatementFromFile sff,String iden_evento) throws Throwable{
        
        GetDatiPrenotazioneInterna getter = new GetDatiPrenotazioneInterna(sff, iden_evento);
        return getter.execute();   
        
    }    
    
}
