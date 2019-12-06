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

import java.sql.ResultSet;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;


public class associaRepartiModelli extends servletEngine{


    public associaRepartiModelli(ServletContext pCont,HttpServletRequest pReq){
        super(pCont,pReq);
    }

    public String getBody(){
    	String body="";
    	StatementFromFile SFF=null;
        try{
            body += getHeader();
        	
        	SFF = new StatementFromFile(this.hSessione);
            ResultSet rs = SFF.executeQuery("terapie.xml","prescrizioniStd.getRepartiAssocia",new String[] {param("iden_modello"),bUtente.login});
 
            body+="<div id='content'><table>\n";
            while(rs.next()) {
            	body+="<tr><td><input type=checkbox value='"+rs.getString("COD_CDC")+"' " +
            			(rs.getInt("ASSOCIATO")==1?"checked ":"")+
            			(rs.getInt("ASSOCIABILE")==0?"disabled ":"")+
            					"/></td>";
            	body+= "<td>"+rs.getString("DESCR")+"</td></tr>";
            }
            body+="</table></div>\n";
            body += getFooter();
        }catch(Exception e){
            body="ERRORE" + e.getMessage();
        } finally {
        	if (SFF!=null) {
        		SFF.close();
        	}
        }
        return body;
    }
    
    private String getHeader() {
    	return "<div class='header'>ASSOCIA REPARTI</div>";
    }
    private String getFooter() {
    	return "<div class='footer'><span class='btn' id='associa'>Salva</span></div>";
    }

	@Override
	protected String getBottomScript() {
		return "";
	}

	@Override
	protected String getTitle() {
		return "";
	}
}
