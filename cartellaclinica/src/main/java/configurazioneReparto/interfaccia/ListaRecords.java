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

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author not attributable
 * @version 1.0
 */
public class ListaRecords {

    private Connection vConn;
    private ResultSet rs;
    private PreparedStatement ps;


    public ListaRecords(Connection pConn) {
        this.vConn = pConn;
    }

    public String getHtml(){
        StringBuffer html = new StringBuffer();
        html.append("<div class=\"Lista Records\">");

        /*html.append("<table>");
        html.append("<tr>");

        html.append("<th width=\"10%\">Sito</th>");
        html.append("<th width=\"10%\">Struttura</th>");
        html.append("<th width=\"10%\">Reparto</th>");
        html.append("<th width=\"60%\">Valore</th>");
        html.append("<td  width=\"10%\"></td>");


         html.append("</tr>");
         html.append("</table>");*/

         html.append("</div>");
         return html.toString();
    }

    public String getHtml(String pKey, String pType, String pMenuAttivo) throws SQLException {
        StringBuffer html = new StringBuffer();

        html.append("<table key=\"" + pKey + "\" type=\"" + pType + "\" menu=\"" + pMenuAttivo + "\">");

        html.append("<tr>");

        html.append("<td width=\"5%\"></td>");
        html.append("<th width=\"10%\">Sito</th>");
        html.append("<th width=\"10%\">Struttura</th>");
        html.append("<th width=\"10%\">Reparto</th>");
        html.append("<th width=\"60%\">Valore</th>");
        html.append("<td width=\"5%\"><input id=\"btnInserisciRecord\" type=\"button\" value=\"Add\"/></td>");


        html.append("</tr>");

        ps = this.vConn.prepareCall("Select ROWID,SITO,STRUTTURA,CDC,VALORE from imagoweb.CC_CONFIGURA_REPARTO where KEY=? order by SITO,STRUTTURA,CDC");

        ps.setString(1,pKey);
        rs = ps.executeQuery();
        while(rs.next()){
            html.append("<tr rowid=\""+ chkNull(rs.getString("ROWID")) +"\">");

            html.append("<td>" + (pMenuAttivo.equals("S")?"<input name=\"btnApriMenu\" type=\"button\" value=\"Menu\"/>":"") +"</td>");
            html.append("<td><input value=\""+ chkNull(rs.getString("SITO")) + "\" name=\"txtSito\"/></td>");
            html.append("<td><input value=\""+ chkNull(rs.getString("STRUTTURA")) + "\" name=\"txtStruttura\"/></td>");
            html.append("<td><input value=\""+ chkNull(rs.getString("CDC")) + "\" name=\"txtReparto\"/></td>");
            html.append("<td><input value=\""+ chkNull(rs.getString("VALORE")) + "\" name=\"txtValore\"/></td>");

            html.append("<td><input name=\"btnEliminaRecord\" type=\"button\" value=\"Del\"/></td>");

            html.append("</tr>");
        }
        rs.close();
        ps.close();

        html.append("</table>");

        return html.toString();
    }
    private String chkNull(String in){
        return (in==null?"":in);
    }
}
