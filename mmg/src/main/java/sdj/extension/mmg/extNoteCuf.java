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
package sdj.extension.mmg;


import generatoreEngine.components.extension.base.extensionHtmlBase;
import generatoreEngine.components.extension.exception.extensionExceptionEnd;
import generatoreEngine.components.extension.exception.extensionExceptionInit;
import generatoreEngine.components.html.htmlDiv;
import generatoreEngine.components.html.htmlI;
import generatoreEngine.components.html.htmlTable;
import generatoreEngine.components.html.htmlTd;
import generatoreEngine.components.html.htmlTr;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import it.elco.baseObj.BaseUser;
import it.elco.cache.CacheManager;
import it.elco.caronte.dataManager.impl.iDataManager;
import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.toolkit.toolKitShortcut;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.support.rowset.SqlRowSet;

/**
 * 
 * @author lucas
 *
 */

public class extNoteCuf extends extensionHtmlBase
{
	private static final long serialVersionUID	= -6440620892493186077L;

	private static final String	__ID_TABLE				= "TABLE_NOTE_CUF";
	
	private Logger	logger	 	= LoggerFactory.getLogger(extNoteCuf.class);
	
	private ServletContext		sContext	= null;
	private HttpServletRequest	sRequest	= null;
	private HttpSession			session		= null;
	private SqlRowSet			rsInfo			= null;
	private htmlTable			table			= null;
	private BaseUser			baseUser		= null;
	private String				webuser			= null;
	private String				lingua			= null;
	private String				farmaci			= null;
	private String				tipoRicetta		= null;
	private String				problemi		= null;
	
	@Override
	/**
	 * init(this.context, request, response, this.conf_servlet) arriva da page
	 */
	public void init(Object[] param) throws extensionExceptionInit 
	{
		sContext	= (ServletContext)		param[0];
		sRequest	= (HttpServletRequest)	param[1];
		session		= sRequest.getSession(false);
		
		webuser		= (String) session.getAttribute("USERNAME");
		baseUser	= (BaseUser) session.getAttribute("BASEUSER");
		lingua		= baseUser.get("LINGUA");
		
		farmaci		= sRequest.getParameter("FARMACI");
		problemi 	= sRequest.getParameter("PROBLEMI");
		tipoRicetta = sRequest.getParameter("TIPO_RICETTA");
	}

	@Override
	public void end() throws extensionExceptionEnd {}
	
	public void generaTable(String Parameter){
		
		String sKey = "TABLE_NOTE_CUF@" + __ID_TABLE + "@" + webuser + "@" + lingua;
		
		CacheManager cache = new CacheManager("TABLE_NOTE_CUF");
		table =(htmlTable) cache.getObject(sKey);
		table = new htmlTable();
		table.addAttribute("id", "tableNote");
		
		iHtmlTagBase menuContainer =  super.getHtmlWork();
		menuContainer.appendChild(this.createDiv());
		//System.out.println(menu.generateTagHtml());
	}

	private htmlDiv createDiv (){
		
		logger.debug("Creazione div Table Note Cuf[sito:"+sito+" - versione:"+sito+" ]");
		iDataManager dataManager = CaronteFactory.getFactory().createDataManager("MMG_DATI", toolKitShortcut.generateClientID(this.session));
		htmlDiv divTableNoteCuf = new htmlDiv();
		int idx = 0;
		int contatore = 0;

		try{
			if (farmaci != null) {
				String[] splitFarmaci = farmaci.split(",");
				
				for(int i = 0; i<splitFarmaci.length;i++){
					
					Map<String,String> params = new HashMap<String, String>();
					params.put("cod_farmaco", splitFarmaci[i]);
					
					rsInfo = dataManager.getSqlRowSetByQuery("RICETTE.FARMACI_NOTE_CUF", params);
					//dataManager.setOrder("Order By FARMACO");
					String codFarmaco;
					//array per il controllo delle note se gia' presenti
					ArrayList<String> Arr = new ArrayList();
					
					
					while(rsInfo.next()){
					
						codFarmaco = rsInfo.getString("COD_FARMACO");
						
						
						if(!this.chkNull(rsInfo.getString("NOTA1")).equalsIgnoreCase("")){
							
							contatore++;
							
							Arr.add(rsInfo.getString("NOTA1"));
							
							htmlTr riga = new htmlTr();
							riga.addAttribute("idx",String.valueOf(idx));
							riga.addAttribute("class","trPrima");
							htmlTd tdFarmaco = new htmlTd();
							tdFarmaco.addAttribute("id", "tdFarmaco_"+codFarmaco);
							tdFarmaco.addAttribute("codice",codFarmaco);
							tdFarmaco.addAttribute("class", "tdFarmaco");
							tdFarmaco.setTagValue(rsInfo.getString("FARMACO"));
							riga.appendChild(tdFarmaco);
							htmlTd tdNota= new htmlTd();
							tdNota.addAttribute("id", "tdNota_"+rsInfo.getString("NOTA1"));
							tdNota.addAttribute("codice", "Nota_"+rsInfo.getString("COD_FARMACO"));
							tdNota.addAttribute("codiceNota", rsInfo.getString("NOTA1"));
							tdNota.addAttribute("class", "tdNota");
							tdNota.addAttribute("name", "Nota_"+codFarmaco);
							tdNota.addAttribute("cod_farmaco", codFarmaco);
							tdNota.setTagValue("Nota: "+rsInfo.getString("NOTA1"));
							htmlI icon = new htmlI();
							icon.addAttribute("id", "icon_"+codFarmaco);
							icon.addAttribute("class", "icon-info-circled iconFloat");
							tdNota.appendChild(icon);
							riga.appendChild(tdNota);
							table.appendChild(riga);
							
							
							if(!this.chkNull(rsInfo.getString("NOTA2")).equalsIgnoreCase("")){
									
								if(!Arr.contains(rsInfo.getString("NOTA2"))){
									Arr.add(rsInfo.getString("NOTA2"));
									table.appendChild(this.creaNota(codFarmaco, rsInfo.getString("COD_FARMACO"), rsInfo.getString("NOTA2"), idx));
								}
							}
							
/*							if(!this.chkNull(rsInfo.getString("NOTA3")).equalsIgnoreCase("")){
								
								if(!Arr.contains(rsInfo.getString("NOTA3"))){
									Arr.add(rsInfo.getString("NOTA3"));
									table.appendChild(this.creaNota(codFarmaco, rsInfo.getString("COD_FARMACO"), rsInfo.getString("NOTA3"), idx));
								}
							}
							
							if(!this.chkNull(rsInfo.getString("NOTA4")).equalsIgnoreCase("")){
								
								if(!Arr.contains(rsInfo.getString("NOTA4"))){
									Arr.add(rsInfo.getString("NOTA4"));
									table.appendChild(this.creaNota(codFarmaco, rsInfo.getString("COD_FARMACO"), rsInfo.getString("NOTA4"), idx));
								}
							}*/
							
							if (this.chkNull(rsInfo.getString("NOTA1")).equalsIgnoreCase("004")
									||this.chkNull(rsInfo.getString("NOTA2")).equalsIgnoreCase("004")
									/*||this.chkNull(rsInfo.getString("NOTA3")).equalsIgnoreCase("04")
									||this.chkNull(rsInfo.getString("NOTA4")).equalsIgnoreCase("04")*/){ //gestione della forzatura nel caso una delle note sia la 04
								htmlTr vTr = new htmlTr();
								vTr.addAttribute("idx",String.valueOf(idx));
								htmlTd vTd1 = new htmlTd();
								vTd1.addAttribute("id", "tdAnyway");
								vTd1.addAttribute("class", "tdFarmacoVuoto");
								vTd1.addAttribute("codice",codFarmaco);
								vTd1.setTagValue("");
								vTr.appendChild(vTd1);
								htmlTd vTd2= new htmlTd();
								vTd2.addAttribute("class", "tdNota");
								vTd2.addAttribute("cod_farmaco", codFarmaco);
								vTd2.addAttribute("codiceNota", "forzaRR");
								vTd2.setTagValue("Forza Ricetta Rossa");
								vTr.appendChild(vTd2);
								table.appendChild(vTr);
							}
							
							idx++;
						}	
						
						
						if(!this.chkNull(rsInfo.getString("NOTA1")).equalsIgnoreCase("") || 
								!this.chkNull(rsInfo.getString("NOTA2")).equalsIgnoreCase("")){
							htmlTr rigaVuota = new htmlTr();
							rigaVuota.addAttribute("class", "trVuota");
							table.appendChild(rigaVuota);
						}
						
					}
				}
			}
		}catch(Exception e){
    		logger.error(e.getLocalizedMessage(), e);
		}
		
		if (contatore<1 && "RR_FARMACI".equalsIgnoreCase(tipoRicetta)){
			table.appendChild(this.creaRigaNoResult());
		}
		
		divTableNoteCuf.appendChild(table);
		return divTableNoteCuf;
	}
	
	private htmlTr creaNota(String codiceFarmaco, String Codice, String Nota, int idx){
		
		htmlTr rigaFV = new htmlTr();
		rigaFV.addAttribute("idx",String.valueOf(idx));
		htmlTd tdFarmacoVuoto = new htmlTd();
		tdFarmacoVuoto.addAttribute("id", "tdFarmaco_Vuoto"+codiceFarmaco);
		tdFarmacoVuoto.addAttribute("class", "tdFarmacoVuoto");
		rigaFV.appendChild(tdFarmacoVuoto);
		htmlTd tdNota = new htmlTd();
		tdNota.addAttribute("id", "tdNota4_"+Nota);
		tdNota.addAttribute("class", "tdNota");
		tdNota.addAttribute("codice", "Nota_"+Codice);
		tdNota.addAttribute("codiceNota", Nota);
		tdNota.setTagValue("Nota: "+Nota);
		tdNota.addAttribute("name", "Nota_"+codiceFarmaco);
		tdNota.addAttribute("cod_farmaco", codiceFarmaco);
		htmlI iconInfo = new htmlI();
		iconInfo.addAttribute("id", "icon_"+codiceFarmaco);
		iconInfo.addAttribute("class", "icon-info-circled iconFloat");
		tdNota.appendChild(iconInfo);
		rigaFV.appendChild(tdNota);
		return rigaFV;
		
	}
	
	private htmlTr creaRigaNoResult(){
		
		htmlTr rigaNoResult = new htmlTr();
		htmlTd tdFarmacoVuoto = new htmlTd();
		tdFarmacoVuoto.addAttribute("class", "tdFarmaco");
		tdFarmacoVuoto.setTagValue("Nessuna Nota Cuf selezionabile");
		htmlTd tdFarmacoVuoto1 = new htmlTd();
		
		rigaNoResult.appendChild(tdFarmacoVuoto);
		rigaNoResult.appendChild(tdFarmacoVuoto1);
		
		return rigaNoResult;
	}
	
	private String chkNull(String input) {
		if (input == null)
			return "";
		else
			return input;
	}
}