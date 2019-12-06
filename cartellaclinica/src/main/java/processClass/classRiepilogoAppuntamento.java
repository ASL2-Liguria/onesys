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
package processClass;

import cartellaclinica.gestioneAppuntamenti.components.ColumnHeader;
import generic.statements.StatementFromFile;
import imago.http.classColDataTable;
import imagoCreateWk.IprocessDataTable;
import imagoView.Iview;
import it.elco.whale.actions.scopes.RiepilogoRicovero.GetConfigurazioneColonne;
import java.util.ArrayList;
import java.util.Iterator;
import javax.servlet.http.HttpSession;

/**
 *
 * @author francescog
 */
public class classRiepilogoAppuntamento implements IprocessDataTable {

    private StatementFromFile sff;
    private HttpSession session;
    private String cod_cdc;
    
    @Override
    public String processData(Iview interfacciaVista) {
        try {
            cod_cdc = interfacciaVista.getField("COD_CDC");      
            session = interfacciaVista.getBaseInfo().getSessione();
            sff = new StatementFromFile(session);
        } catch (Exception ex) {
            return ex.getMessage();
        }
        return "";
    }

    @Override
    public String processData(String oggetto) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public classColDataTable processColumn(classColDataTable oggetto) {
         
        try{

            ArrayList<ColumnHeader> colonne = GetConfigurazioneColonne.execute(sff, session, cod_cdc).getColonne();
            
            StringBuilder sb = new StringBuilder();
           
            sb.append("<div class=\"wk-tabberRiepilogo\">");
            
            for(ColumnHeader colonna : colonne){
                if(colonna.getCampi().size() > 0){
                    sb.append("<span>").append("<a class=\"wk-tabberRiepilogo\" data-key=\"");
                     
                    Iterator<String> it = colonna.getCampi().keySet().iterator();
                    while(it.hasNext()){
                        sb.append( it.next()).append(" ");                        
                    }
                    
                    sb.append("\">").append(colonna.getLabel()).append("</a>").append("</span>"); 
                }
            }
            
            sb.append("</div>");
            
            oggetto.appendSome(sb.toString());
        }catch(Throwable t){          
            oggetto.appendSome(t.getMessage());
        }finally{      
            this.sff.close();
        }
        
        return oggetto;
    }
    
}
