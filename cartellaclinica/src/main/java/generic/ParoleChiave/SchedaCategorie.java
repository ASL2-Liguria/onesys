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
package generic.ParoleChiave;

import generic.servletEngine;
import generic.statements.StatementFromFile;
import imagoAldoUtil.classCentroDiCosto;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author Francesco
 * @version 1.0
 */


public class SchedaCategorie extends servletEngine {

    private HashSet<Integer> hParoleAssociate = new HashSet<Integer>();
    private String Sql = "";
    private PreparedStatement ps;
    private ResultSet rs = null;
    private cProperties Properties = new cProperties();

    public SchedaCategorie(ServletContext pCont, HttpServletRequest pReq) {
        super(pCont, pReq);
    }

    public String getBody() {

        StringBuffer sb = new StringBuffer();

        associaParole();

        setParoleAssociate();

//        sb.append("<body>");

        sb.append(getBarraHeader());

        sb.append("<div class=\"Properties\">");
//        if (!param("REPARTO").equals("")) {
        sb.append(getComboReparti());
//        }

        if (!param("CAMPO_DESCRIZIONE").equals("")) {
            sb.append(getCampoDescrizione());
        }

        if (!param("PAGE_IMPOSTAZIONI").equals("")) {
            sb.append(getFrameImpostazioni());
        }
        sb.append("</div>");

        String[] ArAmbiti = param("AMBITI").split(",", -1);
        Sql = "select iden,codice,parola from parole_chiave where ambito=? order by parola";
        try {

            ps = fDB.getConnectData().prepareStatement(Sql);

            for (int i = 0; i < ArAmbiti.length; i++) {

                sb.append("<div class=\"Ambito\">");

                ps.setString(1, ArAmbiti[i]);
                rs = ps.executeQuery();

                while (rs.next()) {
                    sb.append(buildParola(rs.getInt("IDEN"), rs.getString("PAROLA"),param("TYPE").equals("RADIO")));
                }

                sb.append("</div>");
            }
            fDB.close(rs);
            sb.append(getBarraFooter());

        } catch (Exception ex) {
            log.error(ex);
        } finally {
            try {
                fDB.close(rs);
            } catch (SQLException ex) {
                log.error(ex);
            }
        }

//        sb.append(getFormRequest());

//        sb.append("</body>");
        return sb.toString();

    }

    private String buildParola(int pIden, String pParola, boolean radio) {
        String type = "";
    	if (radio) {
        	type="radio";
        } else {
        	type = "checkbox";
        }
    	String resp = "<div>";

        resp += "<input name=\"Keyword\" class=\"Keyword\" type=\""+type+"\" id=\"" + pIden + "\" " + (hParoleAssociate.contains(pIden) ? "checked=\"checked\"" : "") + "/>";
        resp += "<label for=\"" + pIden + "\">" + pParola + "</label>";

        resp += "</div>";
        return resp;
    }

    private void setParoleAssociate(){
        Sql = "select iden_parola_chiave from parole_chiave_associazione where iden_tabella=? and tabella=?";
        try {
            ps = fDB.getConnectData().prepareStatement(Sql);
            ps.setInt(1, Integer.valueOf(param("IDEN_TABELLA")));
            ps.setString(2, param("TABELLA"));

            rs = ps.executeQuery();
            while (rs.next()) {
                hParoleAssociate.add(rs.getInt("IDEN_PAROLA_CHIAVE"));
            }
            fDB.close(rs);

        } catch (Exception ex) {
            log.error(ex);
        }
    }

    private String getCampoDescrizione(){

        Sql = "select "+param("CAMPO_DESCRIZIONE")+" from "+param("TABELLA")+" where iden=?";
        try {
            ps = fDB.getConnectData().prepareStatement(Sql);
            ps.setInt(1, Integer.valueOf(param("IDEN_TABELLA")));

            rs = ps.executeQuery();
            if (rs.next()) {
              Properties.Descrizione = chkNull(rs.getString(param("CAMPO_DESCRIZIONE")));
            }
            fDB.close(rs);

        } catch (Exception ex) {
            log.error(ex);
        }

        String resp="<div>";
        resp += "<label>Descrizione</label>";
        resp += "<input id=\"txtDescrizione\" value=\""+Properties.Descrizione+"\"/>";
        resp += "</div>";

        return resp;
    }

    private String getFrameImpostazioni(){

        String url = param("PAGE_IMPOSTAZIONI");
        String height = (param("HEIGHT_IMPOSTAZIONI").equals("")?"25px":param("HEIGHT_IMPOSTAZIONI"));
        String width = (param("WIDTH_IMPOSTAZIONI").equals("")?"90%":param("WIDTH_IMPOSTAZIONI"));
        String scrolling = (param("SCROLL_IMPOSTAZIONI").equals("")?"no":param("SCROLL_IMPOSTAZIONI"));

        String frame = "<iframe id=\"frmImpostazioni\" src=\"" + url + "\" height=\"" + height + "\" width=\"" + width + "\" scrolling=\"" + scrolling + "\"></iframe>";

        return frame;
    }
    
    private String getComboReparti() {
    	String html = "<div><label>Reparto da associare</label>";
    	html+="<select id=\"cmbReparto\" >";
    	for (classCentroDiCosto cdc : bUtente.listaOggettiReparto) { 
    		html+="<option value='"+cdc.cod_cdc+"'>"+cdc.descr+"</option>\n";	
    	}
    	html+="</select></div>";
    	return html;
    }

    private String getBarraHeader(){
        return "<div class=header>Associazione categorie</div>";
    }

    private String getBarraFooter() {
    	 String div = "<div class=footer>";
//         div += "<div class='btn chiudi' title='annulla'></div>";
         div += "<div class='button registra' title='registra'>Registra</div>";
         div += "</div>";
         return div;
    }
    private void associaParole(){

        if(!param("IDEN_ASSOCIATI").equals("")){
            try {
                StatementFromFile SFF = new StatementFromFile(this.hSessione);
                String[] resp = SFF.executeStatement("paroleChiave.xml","setKeyWords",new String[]{param("IDEN_TABELLA"),param("TABELLA"),param("IDEN_ASSOCIATI"),"N","",""},0);
                if(resp[0].equals("KO")){
                    throw new Exception(resp[1]);
                }
            } catch (Exception ex) {
                log.error(ex);
            }

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
}
