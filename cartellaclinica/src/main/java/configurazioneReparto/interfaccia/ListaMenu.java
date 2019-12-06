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

import imago.sql.SqlQueryException;

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
public class ListaMenu {
    private Connection vConn;
    private ResultSet rs;
    private PreparedStatement ps;

    public ListaMenu(Connection pConn) {
        this.vConn = pConn;
    }

    public String getHtml(){
        StringBuffer html = new StringBuffer();
        html.append("<div class=\"Lista Menu\"></div>");

        return html.toString();
    }

    public String getHtml(String pProcedura, String pCodiceReparto,String pIdenPadre) throws SqlQueryException, SQLException {

        StringBuffer lstMenu = new StringBuffer();

        lstMenu.append("<table procedura=\"" + pProcedura + "\" codice_reparto=\"" + pCodiceReparto + "\" iden_padre=\"" + pIdenPadre + "\">");

        if(pIdenPadre == null){
            lstMenu.append("<tr>");

            lstMenu.append("<td></td>");
            lstMenu.append("<th>Ordinamento</th>");
            lstMenu.append("<th>Funzione</th>");
            lstMenu.append("<th>Label</th>");
            lstMenu.append("<th>Attivo</th>");
            lstMenu.append("<th>Tipo Utente</th>");
            lstMenu.append("<th>Gtuppo</th>");

            lstMenu.append("</tr>");
        }



        if(pIdenPadre == null){
            ps = vConn.prepareCall("select ORDINAMENTO,FUNZIONE,LABEL,ATTIVO,TIPO_UTE,GRUPPO,IDEN_FIGLIO from imagoweb.config_menu_reparto where PROCEDURA=? and CODICE_REPARTO=?  and IDEN_PADRE is null order by ORDINAMENTO");
        }else{
            ps = vConn.prepareCall("select ORDINAMENTO,FUNZIONE,LABEL,ATTIVO,TIPO_UTE,GRUPPO,IDEN_FIGLIO from imagoweb.config_menu_reparto where PROCEDURA=? and CODICE_REPARTO=?  and IDEN_PADRE=? order by ORDINAMENTO");
            ps.setInt(3, Integer.valueOf(pIdenPadre));
        }
        ps.setString(1,pProcedura);
        ps.setString(2,pCodiceReparto);

        rs = ps.executeQuery();

        while(rs.next()){
            lstMenu.append("<tr iden_figlio=\"" + chkNull(rs.getString("IDEN_FIGLIO")) + "\">");

            if(rs.getString("IDEN_FIGLIO")!= null){
                lstMenu.append("<td width=\"5%\" class=\"BtnPlus\"><input name=\"btnApriMenu\" type=\"button\" value=\"+\"/></td>");
            }else{
                lstMenu.append("<td width=\"5%\" class=\"Tree\" >--------</td>");
            }

            lstMenu.append("<td width=\"5%\"><input value=\"" + chkNull(rs.getString("ORDINAMENTO")) + "\"/></td>");
            lstMenu.append("<td width=\"30%\"><input value=\"" + chkNull(rs.getString("FUNZIONE")) + "\"/></td>");
            lstMenu.append("<td width=\"25%\"><input value=\"" + chkNull(rs.getString("LABEL")) + "\"/></td>");
            lstMenu.append("<td width=\"5%\"><input value=\"" + chkNull(rs.getString("ATTIVO")) + "\"/></td>");
            lstMenu.append("<td width=\"5%\"><input value=\"" + chkNull(rs.getString("TIPO_UTE")) + "\"/></td>");
            lstMenu.append("<td width=\"10%\"><input value=\"" + chkNull(rs.getString("GRUPPO")) + "\"/></td>");

            lstMenu.append("</tr>");
            if(rs.getString("IDEN_FIGLIO")!=null)
                lstMenu.append("<tr iden_padre=\"" + chkNull(rs.getString("IDEN_FIGLIO")) + "\"><td colspan=\"7\"></td></tr>");
        }
        rs.close();
        ps.close();

        lstMenu.append("</table>");

        return lstMenu.toString();
    }

    private String chkNull(String in){
        return (in==null?"":in);
    }
}
