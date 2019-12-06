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

import java.sql.ResultSet;
import java.util.Date;

import generatoreEngine.components.html.htmlDiv;
import generatoreEngine.components.html.htmlInput;
import generatoreEngine.components.html.htmlLabel;
import generatoreEngine.components.html.htmlSpan;
import generatoreEngine.components.html.htmlTable;
import generatoreEngine.components.html.htmlTdTh;
import generatoreEngine.components.html.htmlTr;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import generic.servletEngine;
import generic.statements.StatementFromFile;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.json.JSONObject;

public class importaTerapie extends servletEngine{

	private HttpServletRequest request = null; 

	public importaTerapie(ServletContext pCont,HttpServletRequest pReq){
		super(pCont,pReq);
		this.request = pReq;
	}

	public String getBody(){
//		Class c = Class.forName("Test");
//		c.
		String body=""; 
		String idenAnag = request.getParameter("idenAnag");
		String idenRicovero = request.getParameter("idenRicovero");
		int idenVisitaPre = -1;
		assert (idenVisitaPre > 0) : "teribbile";
		try {
			StatementFromFile sff = new StatementFromFile(this.hSessione);
			ResultSet rs = sff.executeQuery("terapie.xml","importa.getTerapie",new String[]{idenAnag,idenRicovero,idenRicovero});
			
			iHtmlTagBase table = new htmlTable();
			table.addAttribute("cellspa cing", "0").appendChild(new htmlTr()
				.appendChild(new htmlTdTh("th").setTagValue("Tipo"))
				.appendChild(new htmlTdTh("th").setTagValue("Farmaci"))
				.appendChild(new htmlTdTh("th").setTagValue("Prescrizione"))
				.appendChild(new htmlTdTh("th").setTagValue("Data Inizio"))
				.appendChild(new htmlTdTh("th").setTagValue("Durata"))
				.appendChild(new htmlTdTh("th").setTagValue("Seleziona")));
			while (rs.next())
			{
				int idenVisita = rs.getInt("IDEN_VISITA");
				String fine_ricovero = rs.getString("DATA_FINE_RICOVERO")==null?
						DateFormatUtils.format(new Date(), "dd/MM/yyyy"):rs.getString("DATA_FINE_RICOVERO");
				if (idenVisita!=idenVisitaPre) {
					table.appendChild(new htmlTr().addAttribute("iden_visita",Integer.toString(idenVisita))
							.appendChild(new htmlTdTh("th").addAttribute("colspan","5")
							.setTagValue("Terapie inserite in " + rs.getString("REPARTO") 
									+ " dal " + rs.getString("DATA_RICOVERO")
									+ " al " + fine_ricovero))
							.appendChild(new htmlTdTh("th").setName("seleziona").appendChild(new htmlInput("checkbox").setTagValue("tutte"))));
					idenVisitaPre=idenVisita;
				}
				table.appendChild(new htmlTr()
					.addAttribute("iden_scheda",rs.getString("IDEN_SCHEDA"))
					.addAttribute("iden_visita",Integer.toString(idenVisita))
					.appendChild(new htmlTdTh("td").setName("tipo").setTagValue(rs.getString("TIPO")))
					.appendChild(new htmlTdTh("td").setName("terapia").setTagValue(rs.getString("INTESTAZIONE")))
					.appendChild(new htmlTdTh("td").setName("prescrizione").setTagValue(rs.getString("PRESCRIZIONE")))
					.appendChild(new htmlTdTh("td").setName("data_ini")
							.appendChild(new htmlInput().addAttribute("class","data"))
							.appendChild(new htmlInput().addAttribute("class","ora"))
							)
					.appendChild(new htmlTdTh("td").setName("durata")
							.appendChild(new htmlInput().addAttribute("name", "giorni"))
							.appendChild(new htmlLabel().setTagValue("giorni /"))
							.appendChild(new htmlSpan().addAttribute("title","fino a fine ricovero")
									.appendChild(new htmlInput("checkbox").addAttribute("name", "nodatafine"))
									.appendChild(new htmlLabel().setTagValue("f.f.r.")))
					.appendChild(new htmlTdTh("td").setName("seleziona").appendChild(new htmlInput("checkbox")))));
			}
			sff.close();
			
			body += new htmlDiv().setId("content").appendChild(table).generateTagHtml();
			body += new htmlDiv().addAttribute("class", "footer")
					.appendChild(new htmlSpan().addAttribute("class", "btn").setId("import").setTagValue("Importa"))
					.generateTagHtml();
		} catch (Exception e) {
			// TODO Auto-generated catch block
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
		// TODO Auto-generated method stub
		return null;
	}
}
