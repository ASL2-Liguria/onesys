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
package cartellaclinica.pianoGiornaliero;

import generatoreEngine.components.html.htmlInput;
import generatoreEngine.components.html.htmlTable;
import generatoreEngine.components.html.htmlTdTh;
import generatoreEngine.components.html.htmlTr;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import generic.servletEngine;
import generic.statements.StatementFromFile;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class bilancioIdrico extends servletEngine{

	private HttpServletRequest request 				= null;
	private ElcoLoggerInterface logInterface 		= new ElcoLoggerImpl(bilancioIdrico.class);



	public bilancioIdrico(ServletContext pCont,HttpServletRequest pReq){
		super(pCont,pReq);
		this.request 	= pReq;
	}

	public String getBody(){
		
		String body = ""; 

			try {	
				String dataBilancioIni = request.getParameter("DATA_INI");
				String dataBilancioFine	= request.getParameter("DATA_FINE");
				String idenVisita = request.getParameter("IDEN_VISITA");
				StatementFromFile sff = new StatementFromFile(this.hSessione);
				ResultSet rs = sff.executeQuery("terapie.xml","bilancio.getSomministrazioni",new String[]{dataBilancioIni,dataBilancioFine,dataBilancioIni,dataBilancioFine,dataBilancioIni,dataBilancioFine,idenVisita,dataBilancioIni,dataBilancioFine});

				logInterface.debug("Log WK Bilancio - terapie.xml" + " - bilancio.getSomministrazioni - Parametri: [" + dataBilancioIni + "," + dataBilancioIni + "," +  dataBilancioIni +  "," + dataBilancioFine + "," +  idenVisita.toString() + "," +  dataBilancioIni + "," +  dataBilancioIni + "]");
				
				if (!rs.isBeforeFirst()) {
					return "Nessuna somministrazione infusionale nell'intervallo di tempo considerato";
				}
				
				iHtmlTagBase table = new htmlTable();
				table.appendChild(new htmlTr().addAttribute("class", "trIntestazioneWk")
					.appendChild(new htmlTdTh("th").setTagValue("Somministrazioni nelle 24h"))
					.appendChild(new htmlTdTh("th").setTagValue("Inizio infusione"))
					.appendChild(new htmlTdTh("th").setTagValue("Fine infusione"))
					.appendChild(new htmlTdTh("th").setTagValue("Stato infusione"))
					.appendChild(new htmlTdTh("th").setTagValue("Volume tot - volume eliminato"))
					.appendChild(new htmlTdTh("th").setTagValue("Somministrato [ml]"))
					.appendChild(new htmlTdTh("th").setTagValue("Residuo [ml]"))
					.appendChild(new htmlTdTh("th").setTagValue("Infuso [ml]")));
				
				while (rs.next())
				{				
					table.appendChild(
							new htmlTr()
							.addAttribute("class", "trDatiWk")
							.addAttribute("IDEN_DETTAGLIO",rs.getString("IDEN"))
							.addAttribute("PRE",rs.getString("PRE"))
							.addAttribute("POST",rs.getString("POST"))
							.addAttribute("STATO_INFUSIONE",rs.getString("STATO"))
							.addAttribute("SOTTOTIPO_SCHEDA",rs.getString("SOTTOTIPO_SCHEDA"))
							.addAttribute("VOLUME",rs.getString("VOLUME"))
							.addAttribute("RESIDUO_SEGNALATO",rs.getString("RESIDUO_SEGNALATO"))
							.addAttribute("SOMMINISTRATO_COMPETENTE",rs.getString("SOMMINISTRATO_COMPETENTE"))
							.addAttribute("SOMMINISTRATO_PRECEDENTE",rs.getString("SOMMINISTRATO_PRECEDENTE"))
								.appendChild(new htmlTdTh("td").setName("farmaci").setTagValue(rs.getString("INTESTAZIONE")))
								.appendChild(new htmlTdTh("td").setName("iniInfusione").addAttribute("pre",rs.getString("PRE")).setTagValue(rs.getString("VALIDITA_INIZIO")))
								.appendChild(new htmlTdTh("td").setName("fineInfusione").addAttribute("post",rs.getString("POST")).setTagValue(rs.getString("VALIDITA_FINE")))
								.appendChild(new htmlTdTh("td").setName("stato").addAttribute("stato",rs.getString("STATO")).setTagValue("<span>" + rs.getString("STATO_DECODED")+ "</span>"))
								.appendChild(new htmlTdTh("td").setName("volume").setTagValue(rs.getString("VOLUME").replace(".", ",")))
								.appendChild(new htmlTdTh("td").setName("somministrato").setTagValue(rs.getString("SOMMINISTRATO_COMPETENTE")))
								.appendChild(new htmlTdTh("td").setName("residuo").appendChild(new htmlInput())
								.appendChild(new htmlTdTh("td").setName("infuso"))));
				}
				sff.close();				
				body += table.generateTagHtml() ;
			}
			catch (SqlQueryException ex) {
				body = "bilancioIdrico - getHtml(): " + ex.getMessage();
			}
			catch (SQLException ex) {
				body = "bilancioIdrico - getHtml(): " + ex.getMessage();
			}
			catch(Exception ex){
				body=ex.getMessage();
				logInterface.error(ex.getMessage(), ex);
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
