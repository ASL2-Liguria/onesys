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
/**
 *
 * @author francescog
 */
public class DecodeIdenAnagIdenPro extends Action {

    public class DecodeIdenAnagIdenProResponse extends ActionResponse{

        private DecodeIdenAnagIdenProResponse(String id_ris_paziente, String iden_pro){
            super(new ActionParameter("ID_RIS_PAZIENTE", id_ris_paziente),new ActionParameter("IDEN_PRO", iden_pro));            
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
    private String iden_anag;
    
    @NotNull
    private String cod_prov;
    
    public DecodeIdenAnagIdenPro(){
        super();
    }
    
    public DecodeIdenAnagIdenPro(StatementFromFile sff,String iden_anag,String cod_prov){
        this.sff = sff;
        this.iden_anag = iden_anag;
        this.cod_prov = cod_prov;
    }

    @Setter(key="sff") 
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key="iden_anag") 
    public void setIden_anag(String iden_anag) {
        this.iden_anag = iden_anag;
    }

    @Setter(key="cod_prov") 
    public void setCod_prov(String cod_prov) {
        this.cod_prov = cod_prov;
    }        
    
    @Override
    public DecodeIdenAnagIdenProResponse execute() throws Throwable {
        String[] response = this.sff.executeStatement("PST_Prenotazione.xml", "getIdentificativiAmbulatorio", new String[]{this.iden_anag,this.cod_prov}, 2);
        if(response[0].equals("KO")){
            throw new Exception(response[1]);
        }
        
        return new DecodeIdenAnagIdenProResponse(response[2], response[3]);
    }
    
    public static DecodeIdenAnagIdenProResponse execute(StatementFromFile sff,String iden_anag,String cod_prov) throws Throwable{
        
        DecodeIdenAnagIdenPro decoder = new DecodeIdenAnagIdenPro(sff, iden_anag, cod_prov);
        return decoder.execute();   
        
    }
}
