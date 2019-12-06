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
import it.elco.whale.actions.scopes.Esami.DecodeIdenAnagIdenPro;
import it.elco.whale.actions.scopes.Esami.SendXmlEsamiRequest;
import it.elco.whale.actions.scopes.Esami.SendXmlEsamiRequest.MetodoValues;
import it.elco.whale.actions.scopes.Esami.beans.Prestazione;
import it.elco.whale.actions.scopes.Esami.beans.Response;
import it.elco.whale.actions.scopes.Esami.beans.ResponsePrestazione;
import it.elco.whale.actions.scopes.Esami.beans.Richiesta;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author francescog
 */
public class AssociaPrestazioni extends Action {
   
    @NotNull
    private StatementFromFile sff;
    
    @NotNull
    private String iden_anag, cod_prov, cod_area, cod_prest, iden_visita, iden_ricovero;

    public AssociaPrestazioni(){
        super();
    }    
    
    private AssociaPrestazioni(StatementFromFile sff, String iden_anag, String cod_prov, String cod_area, String cod_prest, String iden_visita, String iden_ricovero) {
        this.sff = sff;
        this.iden_anag = iden_anag;
        this.cod_prov = cod_prov;
        this.cod_area = cod_area;
        this.cod_prest = cod_prest;
        this.iden_visita = iden_visita;
        this.iden_ricovero = iden_ricovero;
    }
        
    @Setter(key="sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }    

    @Setter(key="iden_anag")
    public void setIden_anag(String iden_anag) {
        this.iden_anag = iden_anag;
    }

    @Setter(key="COD_PROV")
    public void setCodProv(String cod_prov) {
        this.cod_prov = cod_prov;
    }

    @Setter(key="COD_AREA")
    public void setCodArea(String cod_area) {
        this.cod_area = cod_area;
    }

    @Setter(key="COD_PREST")
    public void setCod_prest(String cod_prest) {
        this.cod_prest = cod_prest;
    }

    @Setter(key="iden_visita")
    public void setIdenVisita(String iden_visita) {
        this.iden_visita = iden_visita;
    }

    @Setter(key="iden_ricovero")
    public void setIdenRicovero(String iden_ricovero) {
        this.iden_ricovero = iden_ricovero;
    }
            
    @Override
    public ActionResponse execute() throws Throwable {

        ArrayList<Richiesta> richieste = new ArrayList<Richiesta>();
        Richiesta richiesta = new Richiesta();
        
        setHeaders(richiesta);

        setPrestazioni(richiesta);

        richieste.add(richiesta);
                       
        Response response = SendXmlEsamiRequest.execute(sff, MetodoValues.Inserimento, richieste).getStructuredResponse();
                
        String errors = "";
        
        for(ResponsePrestazione prestazione : response.getPrestazioni()){
            if(prestazione.getCodiceErrore().equals("")){
                setIdenEsameAmbulatorio(prestazione.getIdentificativoEsterno("1"),prestazione.getIdenEsame());
            }else{
                errors += prestazione.getDescrizioneErrore() + "\n";
            }
        }

        if(errors.equals("")){
            return new ActionResponse(true);
        }else{
            return new ActionResponse(false, errors);
        }
    }
    
    public ActionResponse execute(StatementFromFile sff, String iden_anag, String cod_prov, String cod_area, String cod_prest, String iden_visita, String iden_ricovero) throws Throwable{
        AssociaPrestazioni associator = new AssociaPrestazioni(sff, iden_anag, cod_prov, cod_area, cod_prest, iden_visita,  iden_ricovero);
        return associator.execute();
    }
    
    private void setHeaders(Richiesta richiesta) throws Throwable{
                        
        String id_ris = DecodeIdenAnagIdenPro.execute(this.sff, this.iden_anag, this.cod_prov).getIdRis();
        
        richiesta.setIdRisPaziente(id_ris);
        richiesta.setTipo("P");
        richiesta.setOccupaSlot("S");
        richiesta.setCodUrgenza("0");
        richiesta.setCodProv(this.cod_prov);   
        
        richiesta.setIdentificativoEsterno("3", this.iden_ricovero);
        richiesta.setIdentificativoEsterno("4", this.iden_visita);           
    }
    
    private void setPrestazioni(Richiesta richiesta) throws SQLException, Exception{

      ResultSet rs = this.sff.executeQuery("OE_Richiesta.xml", "getRichiesteInserite");
        while (rs.next()) {                         

            Prestazione prestazione = new Prestazione();

            prestazione.setCodArea(this.cod_area);
            prestazione.setCodPrest(this.cod_prest);
            
            prestazione.setDataApp(rs.getString("DATA"));
            prestazione.setOraApp(rs.getString("ORA"));

            prestazione.setIdentificativoEsterno("1", rs.getString("IDEN"));

            richiesta.addPrestazione(prestazione);
            
        }        
        
    }
    
    private void setIdenEsameAmbulatorio(String iden_richiesta,String iden_esame) throws Exception{
        String[] response = this.sff.executeStatement("OE_Richiesta.xml", "setIdenEsameAmbulatorio", new String[]{iden_richiesta,iden_esame},0);
        if(response[0].equals("KO")){
            throw new Exception(response[1]);
        }
    }
}
