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
package cartellaclinica.gestioneAppuntamenti;

import cartellaclinica.gestioneAppuntamenti.components.ColumnHeader;
import cartellaclinica.gestioneAppuntamenti.components.ComponentFactory;
import cartellaclinica.gestioneAppuntamenti.components.TipologiaColonna;
import generic.servletEngine;
import generic.statements.StatementFromFile;
import it.elco.whale.actions.scopes.RiepilogoRicovero.GetConfigurazioneColonne;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author francescog
 * @version 2.0
 */
public class RiepilogoRicovero extends servletEngine {

    private enum Filtro {
        NUM_NOSOLOGICO, ANAG_REPARTO, ANAG_STRUTTURA, IDEN_ANAG;
    }

    private Filtro FILTRO;

    private StatementFromFile sff;
    private ArrayList<ColumnHeader> colonne;   

    public RiepilogoRicovero(ServletContext pCont, HttpServletRequest pReq) throws Exception {
        super(pCont, pReq);
        sff = this.getStatementFromFile();
        colonne = new ArrayList<ColumnHeader>();
    }

    @Override
    public String getBody() {

        StringBuilder body = new StringBuilder();

        try {

            this.setContextValues();

            this.setConfigurazioneColonne();

            body.append(this.getHtmlIntestazione());

            body.append(getHtmlRowHeader());

            body.append("<div class=\"Scroll\">");

            FILTRO = Filtro.valueOf(param("FILTRO"));
            switch(FILTRO){

                case NUM_NOSOLOGICO:
                    body.append(
                        ComponentFactory.makeTableRicovero(
                                sff,
                                param("IDEN_RICOVERO"),
                                param("IDEN_PRERICOVERO"),
                                param("DATA_INIZIO"),
                                param("DATA_FINE")
                        )
                                .toHtml(colonne)
                    );
                    break;

                case ANAG_REPARTO:
                    body.append(
                            ComponentFactory.makeTableAnagReparto(
                                    sff,
                                    param("IDEN_ANAG"),
                                    param("COD_CDC"),
                                    param("DATA_INIZIO"),
                                    param("DATA_FINE")
                            )
                                    .toHtml(colonne)
                    );
                    break;
            }

            body.append("</div>");

        } catch (Throwable ex) {
            log.error(ex);
            body.append(ex.getMessage());
        } finally {
            sff.close();
        }
        return body.toString();
    }

    private void setContextValues() throws SQLException, Exception {
        ResultSet rs = sff.executeQuery("cartellaPaziente.xml", "getEvento", new String[]{this.bUtente.login, this.bUtente.modalita_accesso, param("IDEN_RICOVERO")});
        if (rs.next()) {
            this.hashRequest.put("IDEN_ANAG", rs.getString("IDEN_ANAG"));
            this.hashRequest.put("NUM_NOSOLOGICO", rs.getString("NUM_NOSOLOGICO"));
            this.hashRequest.put("COD_CDC", rs.getString("COD_CDC"));
            this.hashRequest.put("DIMESSO_RICOVERO", chkNull(rs.getString("DIMESSO")));
            this.hashRequest.put("IDEN_PRERICOVERO", chkNull(rs.getString("IDEN_PRERICOVERO")));
            
            if(this.hashRequest.containsKey("DATA_INIZIO") == false){
                this.hashRequest.put("DATA_INIZIO", chkNull(rs.getString("DATA_INIZIO")));
            }
            
             if(this.hashRequest.containsKey("DATA_FINE") == false){
                 if(rs.getString("DATA_FINE") == null){
                     this.hashRequest.put("DATA_FINE",(new SimpleDateFormat("yyyyMMdd")).format(new Date()));
                 }else{
                    this.hashRequest.put("DATA_FINE", rs.getString("DATA_FINE"));
                 }
             }
        }
    }

    private void setConfigurazioneColonne() throws Throwable {                                 
        colonne = GetConfigurazioneColonne.execute(sff, hSessione, param("COD_CDC")).getColonne();
    }

    private StringBuilder getHtmlIntestazione(){
        StringBuilder sb = new StringBuilder();

        sb.append("<div id=\"Intestazione\">");

        sb.append("<table class=classTabHeader cellSpacing=0 cellPadding=0>");
        sb.append("<tr><td class=classTabHeaderSx></td>");
        sb.append("<td class=classTabHeaderMiddle><label>Riepilogo Ricovero</label></td>");
        sb.append("<td class=classTabHeaderDx></TD></tr></table>");

        sb.append("<table class='classDataEntryTable'>");
     
        sb.append("  <tr>");
        sb.append("    <td class='classTdLabel'><label>Diario Medico</label></td>");
        sb.append("    <td class='classTdField'><input type=\"checkbox\" id=\"chkDiarioMedico\" ").append(param("DiarioMedico").equals("S") ? "checked=\"checked\"" : "").append("/></td>");
        sb.append("    <td class='classTdLabel'><label>Diario Infermiere</label></td>");
        sb.append("    <td class='classTdField'><input type=\"checkbox\" id=\"chkDiarioInfermiere\" ").append(param("DiarioInfermiere").equals("S") ? "checked=\"checked\"" : "").append("/></td>");
        sb.append("  </tr>");
        
        /*sb.append("  <tr>");
        sb.append("    <td class='classTdLabel'><label>Da Data</label></td>");
        sb.append("    <td class='classTdField'><input class=\"Calendario\" id=\"txtDaData\" value=\"").append(param("DATA_INIZIO")).append("\"/></td>");
        sb.append("    <td class='classTdLabel'><label>A Data</label></td>");
        sb.append("    <td class='classTdField'><input  class=\"Calendario\" id=\"txtAData\" value=\"").append(param("DATA_FINE")).append("\"/></td>");
        sb.append("  </tr>");*/
        
        sb.append("</table>");

        sb.append("</div>");        
        
        return sb;    
    }
    
    private StringBuilder getHtmlRowHeader() {
        StringBuilder sb = new StringBuilder();

        sb.append("<div class=\"Riga tHeader\" >");

        for (int i = 0; i < colonne.size(); i++) {

            ColumnHeader cr = colonne.get(i);

            switch (TipologiaColonna.getEnum(cr.getScope())) {
                case DATA:
                    sb.append("<div class=\"Data tHeader\">").append(cr.getLabel()).append("</div>");
                    break;
                case ORA:
                    sb.append("<div class=\"Ora tHeader\">").append(cr.getLabel()).append("</div>");
                    break;
                case INFO:
                      sb.append("<div class=\"Info tHeader\">").append(cr.getLabel()).append("</div>");
                    break;
                case ACCESSO:
                    sb.append("<div class=\"Accesso tHeader\">").append(cr.getLabel()).append("</div>");
                    break;
                case APPUNTAMENTO:
                    sb.append("<div class=\"Appuntamento tHeader\">").append(cr.getLabel()).append("</div>");
                    break;
                case NOTE_APPUNTAMENTO:
                    sb.append("<div class=\"NoteAppuntamento tHeader\">").append(cr.getLabel()).append("</div>");
                    break;
                case GENERICA:
                    break;
            }

        }

        sb.append("</div>");

        return sb;
    }

    @Override
    public String getBottomScript() {
        return "";
    }

    @Override
    protected String getTitle() {
        return "";
    }
}