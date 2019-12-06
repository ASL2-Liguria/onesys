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
import generatoreEngine.components.html.htmlTable;
import generatoreEngine.components.html.htmlTd;
import generatoreEngine.components.html.htmlTh;
import generatoreEngine.components.html.htmlTr;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import it.elco.baseObj.BaseUser;
import it.elco.cache.CacheManager;
import it.elco.caronte.dataManager.impl.iDataManager;
import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.toolkit.toolKitShortcut;

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
 * @author lucad 
 * @revision lucad (modifiche con th) - lucas (creazione tabella noresult)
 *
 */

public class extControllaFarmaco extends extensionHtmlBase
{
	private static final long serialVersionUID	= -6440620892493186077L;

	private static final String	__ID_TABLE				= "TABLE_FARMACI_INTERAZIONI";
	
	private Logger	logger	 	= LoggerFactory.getLogger(extControllaFarmaco.class);
	
	private ServletContext		sContext	= null;
	private HttpServletRequest	sRequest	= null;
	private HttpSession			session		= null;
	
	private SqlRowSet		rs				= null;
	private SqlRowSet		rsFarmaci		= null;
	private htmlTable		table			= null;

	private BaseUser			baseUser		= null;
	private String				webuser			= null;
	private String				lingua			= null;
	private String				farmaci			= null;
	private String				iden_anag		= null;
	private String				NoInterazione 	= null;
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
		iden_anag = sRequest.getParameter("IDEN_ANAG");
	}

	@Override
	public void end() throws extensionExceptionEnd {}
	
	public void generaTable(String NomeTag){
		
		String sKey = "TABLE_FARMACI_INTERAZIONI@" + __ID_TABLE + "@" + webuser + "@" + lingua;
		
		CacheManager cache = new CacheManager("TABLE_FARMACI_INTERAZIONI");
		table =(htmlTable) cache.getObject(sKey);
		table = new htmlTable();
		table.addAttribute("id", "tableInterazioni");
		setTraduzioneInterazione(NomeTag);
		htmlDiv tableInterazionis = createDiv();
		
		iHtmlTagBase menuContainer =  super.getHtmlWork();
		menuContainer.appendChild(tableInterazionis);
	}

	private htmlDiv createDiv (){
		
		logger.debug("Creazione div Table Interazioni Farmaci Intolleranze[sito:"+sito+" - versione:"+sito+" ]");
		iDataManager dataManager = CaronteFactory.getFactory().createDataManager("MMG_DATI", toolKitShortcut.generateClientID(session));
		htmlDiv divTabInteraz = new htmlDiv();
		int idx = 0;
		int contatore = 0;
		

		try{
			
			Map<String,String> params = new HashMap<String, String>();
			params.put("iden_anag", iden_anag);
			params.put("deleted", "N");

			rs = dataManager.getSqlRowSetByQuery("RICETTE.ALLERGIE_INTOLLERANZE", params);

			htmlTr intest = new htmlTr();
			htmlTh th = new htmlTh();
			htmlTh th2 = new htmlTh();
			intest.addAttribute("class","trHeadTbl");
			intest.addAttribute("id","tr_HeaderTbl");
			th.setId("th_Intolleranza");
			th.setTagValue(super.getTranslator().getHtmlTranslatorText(th.getAttribute("id").getValue().toString()));
			th2.setId("th_Farmaco");
			th2.setTagValue(super.getTranslator().getHtmlTranslatorText(th2.getAttribute("id").getValue().toString()));
			intest.appendChild(th);
			intest.appendChild(th2);
			table.appendChild(intest);

			while(rs.next()){
				
				if(!this.chkNull(rs.getString("ATC_GMP")).equalsIgnoreCase("")){
					Map<String,String> pars = new HashMap<String, String>();
					pars.put("codici_farmaci", farmaci);
					pars.put("codice_atc",rs.getString("ATC_GMP"));
					pars.put("cod_pa",rs.getString("COD_PA"));
					
					rsFarmaci = dataManager.getSqlRowSetByQuery("RICETTE.AVVERTENZE_FARMACI", pars);
					idx = 0; //farmaco
					
					while(rsFarmaci.next()){
						idx ++;
						contatore++;
						
						htmlTr riga = new htmlTr();
						riga.addAttribute("idx",String.valueOf(idx));
						htmlTd tdFarmaco = new htmlTd();
						htmlTd tdAllergiaInt = new htmlTd();
						if(idx < 2){
							tdAllergiaInt.addAttribute("id","idAllergiaIntoll"+rs.getString("DESCRIZIONE"));
							tdAllergiaInt.setTagValue(rs.getString("DESCRIZIONE"));
							riga.addAttribute("class","trPrima");
						}else{
							tdAllergiaInt.addAttribute("id","idAllergiaIntoll"+Integer.toString(idx));
						}
						tdAllergiaInt.addAttribute("class", "tdFarmacoAll");	
						tdFarmaco.addAttribute("id", "tdFarmaco_"+rsFarmaci.getString("codice"));
						tdFarmaco.addAttribute("codice",rsFarmaci.getString("codice"));
						tdFarmaco.addAttribute("class", "tdAllergia");
						tdFarmaco.setTagValue(rsFarmaci.getString("DESCRIZIONE"));
						riga.appendChild(tdAllergiaInt);
						riga.appendChild(tdFarmaco);
						table.appendChild(riga);
					}
				}
			}
			
		}catch(Exception e){
    		e.printStackTrace();
		}
		
		//non ho trovato risultati, quindi creo la riga e la tabella per l'assenza di allergie
		if(contatore<1){
			table = new htmlTable();
			table.addAttribute("id", "tableNoInterazioni");
			table.appendChild(this.creaRigaNoResult(idx));
		}
		
		divTabInteraz.appendChild(table);
		return divTabInteraz;
	}
	
	//metodo per creare riga per l'assenza di allergie/intolleranze
	private htmlTr creaRigaNoResult(int idx){
		
		htmlTr riga = new htmlTr();
		riga.addAttribute("idx",String.valueOf(idx));
		riga.addAttribute("class","trPrima");
		htmlTd tdFarmaco = new htmlTd();
		tdFarmaco.addAttribute("id", "tdFarmaco_0");
		tdFarmaco.addAttribute("codice","0");
		tdFarmaco.addAttribute("colSpan","4");
		tdFarmaco.addAttribute("class", "tdNoAllergie");
		tdFarmaco.setTagValue(this.NoInterazione);
		riga.appendChild(tdFarmaco);
		
		return riga;
	}
	
	private String chkNull(String input) {
		if (input == null)
			return "";
		else
			return input;
	}
	public void setTraduzioneInterazione(String NomeTag){
		this.NoInterazione = super.getTranslator().getHtmlTranslatorText(NomeTag);
	}
	
	
}