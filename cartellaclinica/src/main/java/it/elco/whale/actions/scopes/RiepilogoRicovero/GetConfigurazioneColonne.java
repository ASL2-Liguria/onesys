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
package it.elco.whale.actions.scopes.RiepilogoRicovero;

import generic.statements.StatementFromFile;
import imago.http.baseClass.baseUser;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionParameter;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpSession;

import cartellaclinica.gestioneAppuntamenti.components.ColumnHeader;
import configurazioneReparto.baseReparti;
import core.Global;

/**
 *
 * @author francescog
 */
public class GetConfigurazioneColonne extends Action{
      
    public class GetConfigurazioneColonneResponse extends ActionResponse{

        private GetConfigurazioneColonneResponse(ArrayList<ColumnHeader> colonne){
            super(new ActionParameter("colonne", colonne));            
        }     
        
        public ArrayList<ColumnHeader> getColonne() throws Throwable{
            return (ArrayList<ColumnHeader>) this.getOutParameter("colonne");
        }    
        
    }    
    
    @NotNull
    private StatementFromFile sff;
    
    @NotNull
    private HttpSession session;
    
    @NotNull
    private String cod_cdc;
    
    private String keyConfigurazione;    
    
    public GetConfigurazioneColonne(){
        super();
    }
    
    private GetConfigurazioneColonne(StatementFromFile sff, HttpSession session, String cod_cdc) {
        this.sff = sff;
        this.session = session;
        this.cod_cdc = cod_cdc;
    }   
    
    @Setter(key="sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key="session")
    public void setSession(HttpSession session) {
        this.session = session;
    }

    @Setter(key="cod_cdc")
    public void setCodCdc(String cod_cdc) {
        this.cod_cdc = cod_cdc;
    }    
    
    @Override
    public GetConfigurazioneColonneResponse execute() throws Throwable {
        
//        baseReparti bReparti = (baseReparti) this.session.getAttribute("baseReparti");
        baseReparti bReparti = Global.getReparti(this.session);
        keyConfigurazione = bReparti.getValue(this.cod_cdc, "RIEPILOGO_RICOVERO_COLONNE");

        ArrayList<ColumnHeader> colonne = null;

        colonne = getConfigurazioneColonneFromSession();

        if(colonne == null){
            colonne= getConfigurazioneColonneFromDb();
            this.setConfigurazioneColonneInSession(colonne);
        }                        
        return new GetConfigurazioneColonneResponse(colonne);
       
    }   
    
    public static GetConfigurazioneColonneResponse execute(StatementFromFile sff, HttpSession session, String cod_cdc) throws Throwable{
        GetConfigurazioneColonne getter = new GetConfigurazioneColonne(sff, session, cod_cdc);
        return getter.execute();
    }
   
    public ArrayList<ColumnHeader> getColonne() throws Throwable{
        return (ArrayList<ColumnHeader>) this.execute().getOutParameter("colonne");
    }
    
    private ArrayList<ColumnHeader> getConfigurazioneColonneFromSession() {
        
        HashMap mapConfigurazioni = (HashMap) this.session .getAttribute("RIEPILOGO_RICOVERO_COLONNE");
        
        if(mapConfigurazioni == null){
            return null;
        }

        if(mapConfigurazioni.containsKey(keyConfigurazione)){
            return (ArrayList<ColumnHeader>) mapConfigurazioni.get(keyConfigurazione);
        }else{
            return null;
        }
    }
    
    private void setConfigurazioneColonneInSession(ArrayList<ColumnHeader> colonne) {
        HashMap mapConfigurazioni;
        
        if(this.session .getAttribute("RIEPILOGO_RICOVERO_COLONNE") == null){
            mapConfigurazioni = new HashMap();
        }else{
            mapConfigurazioni = (HashMap) this.session.getAttribute("RIEPILOGO_RICOVERO_COLONNE");
        }
        
        mapConfigurazioni.put(keyConfigurazione, colonne);
        
        this.session .setAttribute("RIEPILOGO_RICOVERO_COLONNE",mapConfigurazioni);
    }
    
    private ArrayList<ColumnHeader> getConfigurazioneColonneFromDb() throws SQLException, Exception{
        ArrayList<ColumnHeader> colonne = new ArrayList<ColumnHeader>();

        baseUser bUser = (baseUser) this.session.getAttribute("login");       

        ResultSet rs = this.sff.executeQuery("AccessiAppuntamenti.xml", "getConfigurazioneColonne", new String[]{keyConfigurazione, bUser.tipo});
        while (rs.next()) {
            colonne.add(new ColumnHeader(rs.getString("SCOPE"), chkNull(rs.getString("LABEL")), chkNull(rs.getString("WIDTH")), chkNull(rs.getString("RIFERIMENTI"))));
        }           
        
        this.sff.close();
        
        return colonne;
    }
    
    private String chkNull(String in){
        return in == null ? "" : in;
    }
    
}
