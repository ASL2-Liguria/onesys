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

import cartellaclinica.gestioneAppuntamenti.components.ColumnHeader;
import cartellaclinica.gestioneAppuntamenti.components.ComponentFactory;
import cartellaclinica.gestioneAppuntamenti.components.Item;
import cartellaclinica.gestioneAppuntamenti.components.Row;
import generic.statements.StatementFromFile;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionParameter;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;
import java.util.ArrayList;
import java.util.Iterator;
import javax.servlet.http.HttpSession;

/**
 *
 * @author francescog
 */
public class GetSingleRow extends Action {
    
    public class GetSingleRowResponse extends ActionResponse{

        private GetSingleRowResponse(ArrayList<String> elements){
            super(new ActionParameter("elements", elements));            
        }     
        
        public ArrayList<String> getElements() throws Throwable{
            return (ArrayList<String>) this.getOutParameter("elements");
        }    
        
    }     
    
    @NotNull
    private StatementFromFile sff;

    @NotNull
    private HttpSession session;
    
    @NotNull
    private String iden_ricovero,data,cod_cdc;

    private String iden_prericovero;

    public GetSingleRow(){
        super();
    }
    
    private GetSingleRow(StatementFromFile sff, HttpSession session, String iden_ricovero, String data, String cod_cdc, String iden_prericovero) {
        this.sff = sff;
        this.session = session;
        this.iden_ricovero = iden_ricovero;
        this.data = data;
        this.cod_cdc = cod_cdc;
        this.iden_prericovero = iden_prericovero;
    }       
    
    @Setter(key="sff") 
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key="session")
    public void setSession(HttpSession session) {
        this.session = session;
    }

    @Setter(key="iden_ricovero")
    public void setIdenRicovero(String iden_ricovero) {
        this.iden_ricovero = iden_ricovero;
    }

    @Setter(key="iden_prericovero")
    public void setIdenPrericovero(String iden_prericovero) {
        this.iden_prericovero = iden_prericovero;
    }

    @Setter(key="data")
    public void setData(String data) {
        this.data = data;
    }

    @Setter(key="cod_cdc")
    public void setCodCdc(String cod_cdc) {
        this.cod_cdc = cod_cdc;
    }       
    
    @Override
    public GetSingleRowResponse execute() throws Throwable {

        Row row = ComponentFactory.makeSingleRow(
                this.sff,
                this.iden_ricovero,
                this.iden_prericovero,
                this.data
         );

        return new GetSingleRowResponse(this.getTabberElements(row));

    }

    public static GetSingleRowResponse execute(StatementFromFile sff, HttpSession session, String iden_ricovero, String data, String cod_cdc, String iden_prericovero) throws Throwable{
        GetSingleRow getter = new GetSingleRow(sff, session, iden_ricovero, data, cod_cdc, iden_prericovero);
        return getter.execute();
    }
    
    private ArrayList<String> getTabberElements(Row row) throws Throwable {

        ArrayList<String> elements = new ArrayList<String>();

        ArrayList<ColumnHeader> colonne = this.getConfigurazioneColonne();

        for (ColumnHeader colonna : colonne) {
            StringBuilder sb = new StringBuilder();

            Iterator<String> it = colonna.getCampi().keySet().iterator();
            while (it.hasNext()) {
                String key = it.next();

                sb.append("<ul data-key=\"" + key + "\">");

                if (row.getSections().containsKey(key)) {
                    for (Item item : row.getSections().get(key)) {
                        sb.append(item.toHtml());
                    }
                } else {
                    sb.append(key).append(" - nessun dato presente");
                }

                sb.append("</ul>");

            }
            elements.add(sb.toString());
        }

        return elements;
    }

    private ArrayList<ColumnHeader> getConfigurazioneColonne() throws Throwable {
        return GetConfigurazioneColonne.execute(sff, session, cod_cdc).getColonne() ; 
    }
    
}
