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
package cartellaclinica.gestioneTerapia;

import generic.servletEngine;
import generic.statements.StatementFromFile;
import it.elco.whale.actions.scopes.Database.GetListFromResultset;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author Fra
 * @version 1.0
 */
public class CicloTerapia extends servletEngine {

    //private StatementFromFile sff;
    private HashMap<String, String> hmParametri;

    public CicloTerapia(ServletContext pCont, HttpServletRequest pReq) throws Exception {
        super(pCont, pReq);
        //sff = this.getStatementFromFile();//new StatementFromFile(this.hSessione);
        hmParametri = new HashMap<String, String>();
    }

    @Override
    public String getBody() {

        StringBuilder body = new StringBuilder();
        try {
            
            if (param("Procedura").equals("INSERIMENTO")) {
                
                setParametriPaziente();

                body.append(this.getImpostazioniCiclo());

                body.append(this.getParametriPaziente());

                body.append(this.getBsa());
                
            }
             
            body.append(this.getTabs());

            body.append(this.getFooterTabs());

            body.append(this.getModelli());

            body.append(this.getInfoSale());
                    
            
            return body.toString();
        } catch (Throwable ex) {
            log.error(ex);
            return "<body>" + ex.getMessage() + "</body>";
        } finally {
            //sff.close();
        }
    }

    private String getModelli() throws Exception {

        StringBuilder frames = new StringBuilder();
        ResultSet rs = null;

        if (param("Procedura").equals("INSERIMENTO")) {

            rs = this.getStatementFromFile().executeQuery("terapie.xml", "Cicli.getModelli", new String[]{param("IDEN_CICLO")});
            while (rs.next()) {
                frames.append("<iframe iden_modello=\"" + rs.getString("IDEN") + "\" src=\"SchedaTerapia?IDEN_VISITA=" + param("idenVisita") + "&IDEN_MODELLO=" + rs.getString("IDEN") + "&STATO=MODELLO&ID_SESSIONE=" + rs.getString("IDEN") + "\"></iframe>");
            }
        }

        if (param("Procedura").equals("MODIFICA_TERAPIA")) {
            rs = this.getStatementFromFile().executeQuery("terapie.xml", "Cicli.getTerapia", new String[]{param("IDEN_TERAPIA")});
            while (rs.next()) {
                frames.append("<iframe iden_terapia=\"" + rs.getString("IDEN_TERAPIA") + "\" iden_scheda=\"" + rs.getString("IDEN_SCHEDA") + "\" numero_ciclo=\"" + rs.getString("NUMERO_CICLO") + "\" src=\"SchedaTerapia?IDEN_VISITA=" + param("idenVisita") + "&IDEN_SCHEDA=" + rs.getString("IDEN_SCHEDA") + "&STATO=CONFERMATA&ID_SESSIONE=" + rs.getString("IDEN_SCHEDA") + "\"></iframe>");
            }
        }

        if (param("Procedura").equals("MODIFICA_CICLO")) {
            rs = this.getStatementFromFile().executeQuery("terapie.xml", "Cicli.getTerapie", new String[]{param("IDEN_CICLO")});
            while (rs.next()) {
                frames.append("<iframe iden_terapia=\"" + rs.getString("IDEN_TERAPIA") + "\" iden_scheda=\"" + rs.getString("IDEN_SCHEDA") + "\" numero_ciclo=\"" + rs.getString("NUMERO_CICLO") + "\" src=\"SchedaTerapia?IDEN_VISITA=" + param("idenVisita") + "&IDEN_SCHEDA=" + rs.getString("IDEN_SCHEDA") + "&STATO=CONFERMATA&ID_SESSIONE=" + rs.getString("IDEN_SCHEDA") + "\"></iframe>");
            }
        }

        if (!rs.isClosed()) {
            rs.close();
        }

        return frames.toString();
    }

    private String getInput(String id, String value) {
        return getInput(id, value, null);
    }

    private String getInput(String id, String value, String label) {
        StringBuilder sb = new StringBuilder();
        if (label != null) {
            sb.append("    <div class=\"Label\">" + label + "</div>");
        }

        sb.append("    <div class=\"Data\">");
        sb.append("        <input id=\"" + id + "\" type=\"text\" value=\"" + value + "\"/>");
        sb.append("    </div>");
        return sb.toString();
    }

    private String getButton(String id, String label) {
        return getButton(id, label, "");
    }

    private String getButton(String id, String label, String title) {
        StringBuilder sb = new StringBuilder();

        sb.append("    <div class=\"Button\">");
        sb.append("        <a class=\"button\" id=\"" + id + "\" title=\"" + title + "\">" + label + "</a>");
        sb.append("    </div>");

        return sb.toString();
    }

    private String getRigaVuota() {
        return "<div></div>";
    }

    private String getParametriPaziente() {
        StringBuilder sb = new StringBuilder();

        sb.append("<fieldset>");

        sb.append("<legend>Parametri Paziente</legend>");

        sb.append("<div class=\"Impostazioni\">");

        sb.append(getRigaVuota());

        sb.append("<div>");

        sb.append(getInput("txtPeso", getParametro("PESO"), "Peso"));

        sb.append("</div>");
        sb.append("<div>");

        sb.append(getInput("txtAltezza", getParametro("ALTEZZA"), "Altezza"));

        sb.append(getButton("btnRegistraRilevazioni", "Registra"));

        sb.append("</div>");

        sb.append("</fieldset>");

        return sb.toString();
    }

    private String getBsa() {
        StringBuilder sb = new StringBuilder();

        sb.append("<fieldset>");

        sb.append("<legend>BSA</legend>");

        sb.append("<div class=\"Impostazioni\">");

        sb.append(getRigaVuota());
        sb.append(getRigaVuota());

        sb.append("    <div>");

        sb.append(getInput("txtBsa", getParametro("BSA")));

        sb.append(getButton("btnAdeguaBsa", "Adegua BSA"));

        sb.append("    </div>");

        sb.append("</div>");

        sb.append("</fieldset>");

        return sb.toString();
    }

    private String getImpostazioniCiclo() throws SQLException, Exception {
        StringBuilder sb = new StringBuilder();
        ResultSet rs = this.getStatementFromFile().executeQuery("terapie.xml", "Cicli.getImpostazioni", new String[]{param("IDEN_CICLO")});

        if (rs.next()) {

            sb.append("<fieldset>");
            sb.append("<legend>Impostazioni Ciclo</legend>");

            sb.append("<div class=\"Impostazioni\">");

            sb.append("<div>");

            sb.append(getInput("NomeCiclo", rs.getString("DESCRIZIONE"), "Nome Ciclo"));

            sb.append(getInput("DataInizio", "", "Data inizio"));

            sb.append("</div>");
            sb.append("<div>");

            sb.append("    <div class=\"Label\">Giorno inizio</div>");

            sb.append("    <div class=\"Data\">");
            sb.append("        <input name=\"GiornoInizio\" type=\"radio\" value=\"0\" " + (chkNull(rs.getString("GIORNO_INIZIO")).equals("0") ? "checked=\"checked\"" : "") + "/>0");
            sb.append("        <input name=\"GiornoInizio\" type=\"radio\" value=\"1\" " + (chkNull(rs.getString("GIORNO_INIZIO")).equals("1") ? "checked=\"checked\"" : "") + "/>1");
            sb.append("    </div>");

            sb.append(getInput("IntervalloCiclo", chkNull(rs.getString("INTERVALLO_CICLO")), "Giorni intervallo"));

            sb.append("</div>");

            sb.append("<div>");

            sb.append(getInput("NumeroCicli", chkNull(rs.getString("NUMERO_CICLI")), "Numero cicli"));

            sb.append(getButton("btnRicalcolaCicli", "Ricalcola Cicli"));

            sb.append("</div>");

            sb.append("</div>");
            sb.append("</fieldset>");
        }

        return sb.toString();
    }

    private void setParametriPaziente() throws Exception {
        ResultSet rs = this.getStatementFromFile().executeQuery("parametri.xml", "getUltimiParametriRilevati", new String[]{param("idenAnag"),param("reparto"),"TERAPIE_CICLICHE"});
        while (rs.next()) {
            this.hmParametri.put(rs.getString("COD_DEC"), rs.getString("VALORE"));
        }
    }

    private String getParametro(String pCodDec) {
        return chkNull(this.hmParametri.get(pCodDec));
    }

    private String getTabs() {
        StringBuilder sb = new StringBuilder();
        sb.append("<div id=\"tabs\">");
        sb.append("    <ul class=\"ulTabs\" id=\"tabCicli\"></ul>  ");
        sb.append("</div>");

        sb.append("<div id=\"headerTabs\">");
        sb.append("    <h2></h2>");
        sb.append("</div>");

        sb.append(" <div id=\"contentTabs\"></div>");
        return sb.toString();
    }

    private String getFooterTabs() {
        StringBuilder sb = new StringBuilder();
        sb.append("<div id=\"footerTabs\">");
        sb.append("    <div class=\"buttons\">");
        sb.append("        <a class=\"button\" id=\"btnConferma\" title=\"\">Conferma</a>");
        sb.append("    </div>");
        sb.append("</div>   ");
        return sb.toString();
    }

    @Override
    public String getBottomScript() {
        return "";
    }

    @Override
    protected String getTitle() {
        return "";
    }
    
    private String getInfoSale() throws Throwable{
        
        List records = GetListFromResultset.execute(this.getStatementFromFile(),"PST_Prenotazione.xml", "getSale", new String[]{param("reparto"),"TERAPIA"}).getRecords();
        
        JSONArray json = new JSONArray(records);
        
        return "<input type=\"hidden\" id=\"hSale\" name=\"hSale\" value='"+json.toString()+"' />";
    }
}
