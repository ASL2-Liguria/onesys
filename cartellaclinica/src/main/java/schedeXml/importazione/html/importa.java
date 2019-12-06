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
package schedeXml.importazione.html;

import generic.servletEngine;
import imago.sql.SqlQueryException;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import schedeXml.importazione.html.configurazione.xml;

/**
 * <p>Title: </p>
 *
 * <p>Description: Servlete per l'importazione congigurata di schede prodotte da CONFIGURAZIONE_SCHEDE</p>
 *
 * <p>Copyright: Copyright (c) 2011</p>

 *
 * @author Francesco
 * @version 1.0
 */
public class importa extends servletEngine{

    xml conf;
    Hashtable<String,String> lingue=new Hashtable<String,String>();

    public importa(ServletContext pCont,HttpServletRequest pReq) {
        super(pCont, pReq);
    }

    public String getBody(){

        String body ="";

        try {

            PreparedStatement ps;
            ResultSet rs;

            ps=fDB.getConnectWeb().prepareCall("select pck_configurazioni.getValueCdc(?,?) XML from dual");
            ps.setString(1,param("REPARTO"));
            ps.setString(2,"IMP_SCHEDA_"+param("FUNZIONE"));
            rs=ps.executeQuery();
            if(rs.next()){
                conf= new xml(rs.getString("XML"));
            }
            fDB.close(rs);

            setLingue();

        } catch (SQLException ex) {
            log.error(ex);
        } catch (SqlQueryException ex) {
            log.error(ex);
        }

        /*controllo utenti abilitati*/
        boolean abilitato =false;
        for (int i=0;i<conf.vUtentiAbilitati.length;i++){
            if(conf.vUtentiAbilitati[i].equals(bUtente.tipo))
               abilitato=true;
        }
        if(!abilitato){
            body = "<script>alert(\"L'utente non e' abilitato all'importazione di questa scheda\");self.close();</script>";
        }else{
            /*intestazione*/
            body += "<div class=header>";
            body += "<div class='btn chiudi' onClick='annulla();' title='annulla'></div>";
            body += "<div class='btn registra' onClick='registra();' title='registra'></div>";
            body += "</div>";
            body += "<div class=intestazione>" + conf.vPagina.title + "</div>";

            /*elenco schede disponibili*/
            String whereWk = conf.vSorgente.where_wk;
            whereWk = whereWk.replace("#IDEN_ANAG#", param("IDEN_ANAG"));
            whereWk = whereWk.replace("#IDEN_VISITA#", param("IDEN_VISITA"));
            whereWk = whereWk.replace("#NUM_NOSOLOGICO#", param("NUM_NOSOLOGICO"));
            body += "<iframe id=frameSorgente src=\"servletGenerator?KEY_LEGAME=" +
                    conf.vSorgente.tipo_wk + "&WHERE_WK=" + whereWk +
                    "\" border=0></iframe>";

            /*checkbox per la selezione delle imostazioni*/
  //          body += conf.getHtml(lingue);

//            body += getFormRequest();

        }

        return body;
    }

    /**
     * setLingue
     */
    private void setLingue() throws SqlQueryException, SQLException {
        PreparedStatement ps;
        ResultSet rs;

        ps=fDB.getConnectWeb().prepareCall("select TRAD1,TRAD2,TRAD3 from lingue where origine=?");
        ps.setString(1,conf.vPagina.origine);
        rs=ps.executeQuery();
        if(rs.next()){
        	StringBuilder sb = new StringBuilder();
        	String trad1=rs.getString("TRAD1");
        	String trad2=rs.getString("TRAD2");
        	String trad3=rs.getString("TRAD3");
        	sb.append(trad1==null?"":trad1);
        	sb.append(trad2==null?"":trad2);
        	sb.append(trad3==null?"":trad3);
            String key,val;

            String[] arCoppie= sb.toString().split("[*]");

            for(int i=0;i<arCoppie.length;i++){
                key = arCoppie[i].split("=")[0];
                val = arCoppie[i].split("=")[1];
                lingue.put(key,val);
            }
        }
        fDB.close(rs);
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
