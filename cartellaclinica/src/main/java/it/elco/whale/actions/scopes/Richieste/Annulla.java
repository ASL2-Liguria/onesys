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

/**
 *
 * @author francescog
 */
public class Annulla extends Action{

    @NotNull
    private StatementFromFile sff;
    
    @NotNull
    private String iden_richiesta,motivo_annullamento,iden_per;
    
    @NotNull
    private boolean annulla_prestazione;
    
    private String iden_med;
     
    public Annulla(){
        super();
    }   
    
    private Annulla(StatementFromFile sff, String iden_richiesta, String motivo_annullamento, String iden_per, String iden_med, boolean annulla_prestazione) {
        this.sff = sff;
        this.iden_richiesta = iden_richiesta;
        this.motivo_annullamento = motivo_annullamento;
        this.iden_per = iden_per;
        this.iden_med = iden_med;
        this.annulla_prestazione = annulla_prestazione;
    }    
    
    @Setter(key="sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key="iden_richiesta")
    public void setIdenRichiesta(String iden_richiesta) {
        this.iden_richiesta = iden_richiesta;
    }

    @Setter(key="motivo_annullamento")
    public void setMotivoAnnullamento(String motivo_annullamento) {
        this.motivo_annullamento = motivo_annullamento;
    }

    @Setter(key="iden_per")
    public void setIdenPer(String iden_per) {
        this.iden_per = iden_per;
    }
    
    @Setter(key="iden_med")
    public void setIdenMed(String iden_med) {
        this.iden_med = iden_med;
    }    

    @Setter(key="annulla_prestazione")
    public void setAnnullaPrestazione(String annulla_prestazione) {
        this.annulla_prestazione = annulla_prestazione.equals("S");
    }
    
    public void setAnnullaPrestazione(boolean annulla_prestazione) {
        this.annulla_prestazione = annulla_prestazione;
    }    
    
    @Override
    public ActionResponse execute() throws Throwable {
                
        String[] resp = this.sff.executeStatement("OE_Richiesta.xml", "Annulla", new String[]{this.iden_richiesta,this.motivo_annullamento,this.iden_per,this.iden_med}, 1);
                        
        if(resp[0].equals("KO") || resp[2].equals("OK") == false){
            String message = resp[0].equals("KO") ? resp[1] : resp[2].split("@")[1];
            throw new Exception(message);
        }
         
        if(this.annulla_prestazione){
            return AnnullaPrestazioneAssociata.execute(sff, iden_richiesta, motivo_annullamento);
        }else{
            return new ActionResponse(true);
        }
                
    }
    
    public static ActionResponse execute(StatementFromFile sff, String iden_richiesta, String motivo_annullamento, String iden_per) throws Throwable{       
        return Annulla.execute(sff, iden_richiesta, motivo_annullamento, null);
    }    
    
    public static ActionResponse execute(StatementFromFile sff, String iden_richiesta, String motivo_annullamento, String iden_per, String iden_med, boolean annulla_prestazione) throws Throwable{
        Annulla canceller = new Annulla(sff, iden_richiesta, motivo_annullamento, iden_per, iden_med,annulla_prestazione);
        return canceller.execute();
    }
    
}
