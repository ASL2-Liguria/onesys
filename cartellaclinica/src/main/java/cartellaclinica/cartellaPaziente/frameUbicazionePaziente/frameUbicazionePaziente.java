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
package cartellaclinica.cartellaPaziente.frameUbicazionePaziente;

import generic.servletEngine;
import generic.statements.StatementFromFile;
import java.sql.ResultSet;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;


public class frameUbicazionePaziente extends servletEngine{

	public frameUbicazionePaziente(ServletContext pCont,HttpServletRequest pReq){
		super(pCont,pReq);
	}

	public String getBody(){
		StringBuilder body = new StringBuilder();
		StatementFromFile sff = null;
		try {
			sff = new StatementFromFile(this.hSessione);
			ResultSet rs = sff.executeQuery("UbicazionePaziente.xml", "getDati",new String[] {
					this.cParam.getParam("ricovero").trim(),this.cParam.getParam("idRemoto").trim()});
			if (rs.next()) {
				body.append("<table class='tabella'>");
				body.append("<tr><td colspan='2' class='tdPaziente'>"+rs.getString("NOME")+" "+rs.getString("COGN")+"</td></tr>");
				body.append("<tr><td class='tdInt'>Tipo ricovero:</td><td>"+chkNull(rs.getString("TIPO_RICOVERO"))+"</td></tr>");
				body.append("<tr><td class='tdInt'>Reparto giuridico:</td><td>"+chkNull(rs.getString("REPARTO"))+"</td></tr>");
				body.append("<tr><td class='tdInt'>Reparto assistenziale:</td>");
				if (rs.getString("REPARTO_APPOGGIO")!=null){
					body.append("<td>"+rs.getString("REPARTO_APPOGGIO")+"</td></tr>");	
				}
				else{
					body.append("<td>"+chkNull(rs.getString("REPARTO"))+"</td></tr>");
				}
				body.append("<tr><td class='tdInt'>Stanza:</td><td>"+chkNull(rs.getString("STANZA"))+"</td></tr>");
				body.append("<tr><td class='tdInt'>Letto:</td><td>"+chkNull(rs.getString("LETTO"))+"</td></tr>");
				body.append("</table>");
			} 
			else{
				body.append("<table><tr><td>Prosecuzione di ricovero</td></tr></table>");
			}
		}
		catch (Exception e) {
			body.append(e.getMessage());
		}
		finally{
			sff.close();
		}
		return body.toString();
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
