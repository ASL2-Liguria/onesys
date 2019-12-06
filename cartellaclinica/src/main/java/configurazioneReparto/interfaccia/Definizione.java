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
package configurazioneReparto.interfaccia;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import matteos.utils.XmlUtils;

import org.jdom.Document;


public class Definizione {

    private Connection vConn;

    public Definizione(Connection pConn ) {
        this.vConn = pConn;
    }

    public String getHtml(String pCodice) throws SQLException {

        ResultSet rs= null;
        PreparedStatement ps = null;
        StringBuffer definizione = new StringBuffer();

        ps = vConn.prepareCall("select CODICE , DESCRIZIONE , valore_default SESSIONE_DB , visualizza_medico SESSIONE_WEB ,visualizza_infermiere SESSIONE_CLIENT , urlimage XML from tab_codifiche where TIPO_DATO=? and  CODICE=?");
        ps.setString(1,"PARAMETRO_CONFIGURAZIONE");
        ps.setString(2,pCodice);
        rs = ps.executeQuery();

        if(rs.next()){

            String vType,vMenu = "";

            Document doc = null;
            try {
                doc = XmlUtils.parseJDomDocumentFromString(rs.getString("XML"));
                vType = doc.getRootElement().getChild("cr").getAttributeValue("type");
                vMenu = doc.getRootElement().getChild("mr").getAttributeValue("attivo");
            } catch (Exception ex) {
                vType = "TXT";
                vMenu = "S";
            }

            definizione.append("<div class=\"Lista Definizione\" name=\"" + chkNull(rs.getString("CODICE")) + "\" size=\"200\">");

            definizione.append("<input id=\"txtDescrizione\" value=\"" + chkNull(rs.getString("DESCRIZIONE")) + "\"/>");

            definizione.append("<input id=\"chkSessioneDb\" type=\"checkbox\" " + (chkNull(rs.getString("SESSIONE_DB")).equals("S") ? "checked=\"checked\"" : "") + "/>");
            definizione.append("<label>Sessione DB</label>");

            definizione.append("<input id=\"chkSessioneWeb\" type=\"checkbox\" " + (chkNull(rs.getString("SESSIONE_WEB")).equals("S") ? "checked=\"checked\"" : "") + "/>");
            definizione.append("<label>Sessione WEB</label>");

            definizione.append("<input id=\"chkSessioneClient\" type=\"checkbox\"  " + (chkNull(rs.getString("SESSIONE_CLIENT")).equals("S") ? "checked=\"checked\"" : "") + "/>");
            definizione.append("<label>Sessione CLIENT</label>");

            definizione.append("<input id=\"radTxt\" type=\"radio\" name=\"dataType\" value=\"TXT\" " + (vType.equals("TXT") ? "checked=\"checked\"" : "") + "/>");
            definizione.append("<label for=\"radTxt\">TXT</label>");

            definizione.append("<input id=\"radXml\" type=\"radio\" name=\"dataType\" value=\"XML\" " + (vType.equals("XML") ? "checked=\"checked\"" : "") + "/>");
            definizione.append("<label for=\"radXml\">XML</label>");

            definizione.append("<input id=\"radJson\" type=\"radio\" name=\"dataType\" value=\"JSON\" " + (vType.equals("JSON") ? "checked=\"checked\"" : "") + "/>");
            definizione.append("<label for=\"radJson\">JSON</label>");

            definizione.append("<input id=\"chkMenu\" type=\"checkbox\"  " + (vMenu.equals("S") ? "checked=\"checked\"" : "") + "/>");
            definizione.append("<label>Menu linkati</label>");

            definizione.append("<input id=\"btnSalvaDefinizione\" type=\"button\" value=\"Salva\"/>");

            definizione.append("</div>");
        }
        rs.close();
        ps.close();
        return definizione.toString();
    }

    private String chkNull(String in){
        return (in==null?"":in);
    }
}
