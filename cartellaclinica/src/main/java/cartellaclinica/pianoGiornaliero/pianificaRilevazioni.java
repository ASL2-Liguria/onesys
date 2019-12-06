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
package cartellaclinica.pianoGiornaliero;

import generic.servletEngine;

import java.util.Date;
import java.util.TimeZone;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.time.DateFormatUtils;

import java.sql.ResultSet;
import java.sql.SQLException;

public class pianificaRilevazioni extends servletEngine {

    public pianificaRilevazioni(ServletContext pCont, HttpServletRequest pReq) {
        super(pCont, pReq);
    }

    @Override
    public String getBody() {

        StringBuilder sb = new StringBuilder();

        try {

            sb.append("<DIV class='title'>Pianifica Rilevazioni</DIV>");

            appendFieldsetProfili(sb);
            
            appendFieldsetParametri(sb);

            appendFormPianificazione(sb);           

            appendRowButton(sb);

            return sb.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    @Override
    public String getBottomScript() {
        return "";
    }

    @Override
    protected String getTitle() {
        return "";
    }

    private void appendFieldsetProfili(StringBuilder sb) throws SQLException, Exception  {
        sb.append("<fieldset id='profili'>");

        sb.append("<legend>Profili</legend>");

        sb.append("<span name=\"selectall\" class=\"btn H15 W60\">Tutti</span>");
        
        ResultSet rs = getStatementFromFile().executeQuery("parametri.xml", "getProfiliReparto", new String[]{param("cod_cdc")});

        while (rs.next()) {     
            
                String data_profile ="";
                
                ResultSet parametri = (ResultSet) rs.getObject("PARAMETRI");
                while(parametri.next()){
                       data_profile += "[" + parametri.getString("COD_DEC") + "]";
                }
                parametri.close();
                
                sb.append("<span data-profile=\""+data_profile+"\" class=\"btn H15 W60\">" + rs.getString("DESCR") + "</span>");
        }        
        
        

        sb.append("</fieldset>");
    }

    private void appendFieldsetParametri(StringBuilder sb) throws SQLException, Exception {
        sb.append("<fieldset id='parametri'>");

        sb.append("<legend>Parametri da pianificare</legend>");

        ResultSet rs = getStatementFromFile().executeQuery("parametri.xml", "getParametriReparto", new String[]{param("cod_cdc")});

        while (rs.next()) {
            if (rs.getString("RILEVABILE").equals("S")) {                

                sb.append("<span data-iden=\""+rs.getString("IDEN")+"\" class=\"btn H15 W60").append(rs.getString("IDEN").equals(param("iden_parametro")) ? " selected" : "").append("\" title=\"").append(rs.getString("DESCRIZIONE")).append("\" data-codice=\""+rs.getString("COD_DEC")+"\">");
                sb.append(rs.getString("SIGLA"));
                sb.append("</span>");                
                
            }
        }

        sb.append("</fieldset>");
    }

    private void appendFormPianificazione(StringBuilder sb) {
        
        sb.append("<fieldset id='profili'>");

        sb.append("<legend>Pianificazione</legend>");        
        
        sb.append("<div class='inline'>");

        sb.append("<label>Data inizio</label>");
        sb.append("<input id='DataInizio' type='text' value='").append(getFormatData()).append("'/>");

        sb.append("<label>Ora inizio</label>");
        sb.append("<input id='OraInizio' type='text' value='").append(getFormatOra()).append("'/>");

        sb.append("<label>Numero giorni</label>");
        sb.append("<input id='NumeroGiorni' type='text'/>");

        sb.append("<label>Profili orari</label>");
        sb.append("<select id='cmbProfiliOrari'><option /></select>");
        
        sb.append("</div>");
        
        appendTimeline(sb);
        
         sb.append("</fieldset>");

    }

    private String getFormatData() {
        return DateFormatUtils.format(new Date(), "dd/MM/yyyy", TimeZone.getTimeZone("Europe/Rome"));
    }

    private String getFormatOra() {
        return DateFormatUtils.format(new Date(), "HH:mm", TimeZone.getTimeZone("Europe/Rome"));
    }

    private void appendTimeline(StringBuilder sb) {
        sb.append("<div id='scrollObj' initX='' speed=''>");

        sb.append("<div id='timeline' class='timeline' onmousedown='timeline.Scroll(true);' onmouseup='timeline.Scroll(false);' >");

        sb.append("<table border='0' cellpadding='0' cellspacing='0'>");
        sb.append("<tbody index='0' showGiorni='1' showOre='1'  showBlocchi='1' editing='1' printOre='1'>");
        sb.append("<div id='toolTip'></div>");
        sb.append("</tbody>");
        sb.append("</table>");

        sb.append("</div>");

        sb.append("</div>");
    }

    private void appendRowButton(StringBuilder sb) {
        sb.append("<DIV class=rowButton>");
        sb.append("<span id='close' class='button'>Annulla</span>");
        sb.append("<span id='save' class='button'>OK</span>");
        sb.append("</DIV>");
    }
}
