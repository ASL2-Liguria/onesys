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
package cartellaclinica.cartellaPaziente.frameAppuntamenti;

import generic.servletEngine;
import generic.statements.StatementFromFile;
import imago.http.classColDataTable;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;

import java.sql.ResultSet;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;


public class frameAppuntamenti extends servletEngine{

	public frameAppuntamenti(ServletContext pCont,HttpServletRequest pReq){
		super(pCont,pReq);
	}

	public String getBody(){
		String body = "";

		try {
			classTableHtmlObject cTable = new classTableHtmlObject("100%");
						
			classRowDataTable cRowTh,cRowNumApp,cRowNumVisite = null;
			classColDataTable cColTh,cColNumApp,cColNumVisite = null;
                        
			String frameTitle = "<div id='divTitle' class='std'><div>Appuntamenti Programmati</div></div>";
			cRowTh = new classRowDataTable();
			cRowNumApp = new classRowDataTable();
                        //cRowNumVisite = new classRowDataTable();
			StatementFromFile sff = new StatementFromFile(this.hSessione);
			ResultSet rs = sff.executeQuery("AccessiAppuntamenti.xml", "getAppuntamentiInfo",new String[] {
					this.cParam.getParam("idenRicovero").trim(),
					this.cParam.getParam("reparto").trim()});
			while (rs.next()) {
				cColTh= new classColDataTable("th","",rs.getString("DATA_OUT"));
				cColTh.addEvent("onClick","javascript:top.apriWkAppuntamenti('"+rs.getString("DATA")+"','"+rs.getString("DATA_OUT")+"');");
				if (rs.getInt("settimana")%2==0) {
					cColTh.addAttribute("class", "pari");
				} else {
					cColTh.addAttribute("class", "dispari");
				}
				cRowTh.addCol(cColTh);
				cColNumApp= new classColDataTable("td","",rs.getString("NUM_APPUNTAMENTI"));
				if (rs.getInt("PAZ_PRESENTE")==1) {
					cColNumApp.addAttribute("class", "pazPresente");
					cColNumApp.addAttribute("title", "Paziente presente alla data indicata");
				}
				cRowNumApp.addCol(cColNumApp);
                                
                                /*cColNumVisite = new classColDataTable("td","",rs.getString("NUM_VISITE"));
				if (rs.getInt("PAZ_PRESENTE")==1) {
					cColNumVisite.addAttribute("class", "pazPresente");
					cColNumVisite.addAttribute("title", "Paziente presente alla data indicata");
				}
                                cRowNumVisite.addCol(cColNumVisite);*/
			}
			cTable.appendSome(cRowTh.toString());
			cTable.appendSome(cRowNumApp.toString());
                        //cTable.appendSome(cRowNumVisite.toString());
			body += frameTitle;
			body += "<div id=divTable class='std'>"+cTable.toString()+"</div>";
			
		} catch (Exception e) {
			body = e.getMessage();
			e.printStackTrace();
		}
		return body;
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
