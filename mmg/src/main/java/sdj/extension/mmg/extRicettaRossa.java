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
import generatoreEngine.components.html.htmlInput;
import generatoreEngine.components.html.htmlOption;
import generatoreEngine.components.html.htmlSelect;
import generatoreEngine.components.html.htmlTable;
import generatoreEngine.components.html.htmlTd;
import generatoreEngine.components.html.htmlTh;
import generatoreEngine.components.html.htmlTr;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import it.elco.baseObj.BaseUser;
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
 * @author lucas
 *
 */

public class extRicettaRossa extends extensionHtmlBase
{
	private static final long serialVersionUID	= -6440620892493186077L;
	
	private Logger	logger	 	= LoggerFactory.getLogger(getClass());
	
	private ServletContext		sContext	= null;
	private HttpServletRequest	sRequest	= null;
	private HttpSession			session		= null;
	
	private htmlDiv	 	divTable			= null;
	private BaseUser	baseUser			= null;
	private String	 	idenAnag 	    	= null;
	private String 		idenProblema   		= null;
	private String		medicinaIniziativa 	= null;
	private String		numRow 	    		= null;
	private String		queryFarmaci		= "RICETTE.RICETTE_FARMACI_";
	
	private SqlRowSet sql_cmbMotivoNonSost = null;
	
	@Override
	/**
	 * init(this.context, request, response, this.conf_servlet) arriva da page
	 */
	public void init(Object[] param) throws extensionExceptionInit 
	{
		sContext	= (ServletContext)		param[0];
		sRequest	= (HttpServletRequest)	param[1];
		session		= sRequest.getSession(false);
		
		baseUser			= (BaseUser) session.getAttribute("BASEUSER");
		idenAnag    		= sRequest.getParameter("IDEN_ANAG");
		idenProblema 		= sRequest.getParameter("IDEN_PROBLEMA");
		medicinaIniziativa	= sRequest.getParameter("MED_INIZ");
		numRow      		= chkNull(sRequest.getParameter("NUM_ROW"));
		
		// se il paziente è in un percorso di medicina d'iniziativa cambio le query da utilizzare
		if("S".equalsIgnoreCase(medicinaIniziativa)){
			queryFarmaci = "RICETTE.RICETTE_FARMACI_MI_";
		}
	}

	@Override
	public void end() throws extensionExceptionEnd 
	{
	}
	
	public void initRR(String type)
	{
		divTable = this.createTable();
		iHtmlTagBase Container =  super.getHtmlWork();
		Container.appendChild(divTable);
		htmlDiv endDiv = new htmlDiv();
		endDiv.setId("divFineLista");
		endDiv.setTagValue("&nbsp;");
		Container.appendChild(endDiv);
	}
	
	private htmlDiv createTable()	
	{
		logger.debug("Creazione Tabella Ricetta Rossa [sito:"+sito+" - versione:"+sito+"]");
		
		int index = 0;
		
		Map<String,String> params = new HashMap<String, String>();
		htmlDiv divRet = new htmlDiv();
		divRet.addAttribute("class","divRicetta");

		//creo la tabella risultati
		htmlTable table = new htmlTable();
		

		iDataManager dm = CaronteFactory.getFactory().createDataManager("MMG_DATI", toolKitShortcut.generateClientID(this.session));
		
		params.put("iden_anag", idenAnag);
		
		if(idenProblema.equalsIgnoreCase("")){
			idenProblema = null;
		}
		
		if(numRow.equalsIgnoreCase("")){
			numRow = "75";
		}
		
		params.put("iden_problema", idenProblema);
		params.put("num_row", numRow);
		
		params.put("iden_utente", baseUser.get("IDEN_PER"));
		
		try {

			table=this.creaMaschera();
			table.appendChild(this.creaInt());
			htmlTr row1 = new htmlTr();
			row1 = this.creaRiga(index);
			table.appendChild(row1);
			
			for (int x = 0; x <= 2; x++) {

				SqlRowSet sql = dm.getSqlRowSetByQuery(queryFarmaci + x, params);
				
				while(sql.next()){
	
					index++;
					String idx = String.valueOf(index);
					
					htmlTr row = new htmlTr();
					row.appendChild(this.creaTd("td_data"+idx, chkNull(sql.getString("DATA")), idx, "classData"));
					row.appendChild(this.creaTdAction("td_action"+idx, idx));
					row.appendChild(this.creaTd("td_farmaco"+idx, chkNull(sql.getString("FARMACO")), idx, "classFarmaco", chkNull(sql.getString("PRINCIPIO_ATTIVO"))));
					row.appendChild(this.creaTdInput("td_quantita"+idx, chkNull(sql.getString("QUANTITA")), idx, "classQuantita", chkNull(sql.getString("QUANTITA"))));
					row.appendChild(this.creaTdInput("td_posologia"+idx, chkNull(sql.getString("POSOLOGIA")), idx, "classPosologia", chkNull(sql.getString("POSOLOGIA"))));
					row.appendChild(this.creaTdInput("td_esenzione"+idx, chkNull(sql.getString("ESENZIONE")),idx, "classEsenzione", chkNull(sql.getString("ESENZIONE_DESCRIZIONE"))));
					row.appendChild(this.creaTdCheckCombo("td_Sost"+idx, chkNull(sql.getString("DESCR_SOST")), idx, "classSost"));
					row.addAttribute("concedibile",chkNull(sql.getString("CONCEDIBILITA")));
					row.addAttribute("iden",chkNull(sql.getString("IDEN")));
					row.addAttribute("data",chkNull(sql.getString("DATA_ISO")));
					row.addAttribute("cod_farmaco",chkNull(sql.getString("COD_FARMACO")));
					row.addAttribute("cod_posologia",chkNull(sql.getString("COD_POSOLOGIA")));
					row.addAttribute("cod_esenzione",chkNull(sql.getString("COD_ESENZIONE")));
					row.addAttribute("classe_farmaco",chkNull(sql.getString("CLASSE_FARMACO")));
					/*row.addAttribute("principio_attivo",chkNull(sql.getString("PRINCIPIO_ATTIVO")));*/
					row.addAttribute("cod_sost",chkNull(sql.getString("COD_SOST")));
					row.addAttribute("cod_pa",chkNull(sql.getString("COD_PA")));
					row.addAttribute("sost",chkNull(sql.getString("SOST")));
					row.addAttribute("cronica",chkNull(sql.getString("CRONICITA")));
					row.addAttribute("periodica",chkNull(sql.getString("PERIODICITA")));
					row.addAttribute("temporanea",chkNull(sql.getString("TEMPORANEITA")));
					row.addAttribute("rimanenza",chkNull(sql.getString("RIMANENZA")));
					row.addAttribute("iden_problema",chkNull(sql.getString("IDEN_PROBLEMA")));
					row.addAttribute("deleted",chkNull(sql.getString("DELETED")));
					row.addAttribute("daStampare",chkNull(sql.getString("DA_STAMPARE")));
					row.addAttribute("coloreIcona",chkNull(sql.getString("CLASSE_ICONA")));
					row.addAttribute("blocco",chkNull(sql.getString("BLOCCO")));
					row.addAttribute("attivo",chkNull(sql.getString("ATTIVO")));
					row.addAttribute("nota_cuf",chkNull(sql.getString("NOTA_CUF")));
					row.addAttribute("forzatura",chkNull(sql.getString("FORZATURA")));
					row.addAttribute("pt",chkNull(sql.getString("PIANO_TERAPEUTICO")));
					row.addAttribute("data_ini",chkNull(sql.getString("DATA_INIZIO")));
					row.addAttribute("data_fine",chkNull(sql.getString("DATA_FINE")));
					row.addAttribute("oscurato", chkNull(sql.getString("OSCURATO")));
					row.addAttribute("ripetibile", chkNull(sql.getString("RIPETIBILE")));
					row.addAttribute("suggerita", chkNull(sql.getString("SUGGERITA")));
					row.addAttribute("show_farmaco_originale", chkNull(sql.getString("SHOW_FARMACO_ORIGINALE")));
					row.addAttribute("stampa_posologia", chkNull(sql.getString("STAMPA_POSOLOGIA")));
					row.addAttribute("mi", chkNull(sql.getString("MED_INIZ")));
					row.addAttribute("tipo_mi", chkNull(sql.getString("TIPO_MED_INIZ")));
					row.addAttribute("sito", chkNull(sql.getString("SITO")));
					row.addAttribute("iden_ricetta", chkNull(sql.getString("IDEN_RICETTA")));
					row.addAttribute("iden_medico", chkNull(sql.getString("IDEN_MEDICO")));
					row.addAttribute("iden_utente", chkNull(sql.getString("IDEN_UTENTE")));
					/*
					row.addAttribute("descr_suggerita", chkNull(sql.getString("DESCR_SUGGERITA")));
					*/
					
					//row.appendChild(this.creaTdCheck("td_PA"+idx, "", idx, "classPA"));
					//row.addAttribute("forzaRR",chkNull(sql.getString("FORZA_RICETTA_ROSSA")));
					//row.addAttribute("pa",chkNull(sql.getString("PA")));

					row.addAttribute("class","trRigaFarmaci");
					row.addAttribute("idx", idx);
					
					table.appendChild(row);
					
				}
			}
			
			index++;
			table.addAttribute("idx_next", String.valueOf(index));

		}catch (Exception e) {
			e.printStackTrace();
		}
		
		//appendo la tabella
		divRet.appendChild(table);
		return divRet;
	}
	

	//creo la maschera delle ricette farmaci
	public htmlTable creaMaschera(){
		
		htmlTable table = new htmlTable();
		
		table.addAttribute("id", "tableRisultati");
		table.addAttribute("class","tabRicFarmaci");
		
		return table;
	}

	private htmlTr creaRiga(int index) {
		
		//TODO: da rivedere inserendo la possibilita di creare la riga configurando le colonne da fare vedere
		
		String idx = String.valueOf(index);
		
		htmlTr row = new htmlTr();
		row.appendChild(this.creaTd("td_data"+idx, "", idx, "classData"));
		row.appendChild(this.creaTdAction("td_action"+idx, idx));
 		row.appendChild(this.creaTdInput("td_farmaco"+idx, "", idx, "classFarmaco Ins", ""));
		row.appendChild(this.creaTdInput("td_quantita"+idx, "", idx, "classQuantita", ""));
		row.appendChild(this.creaTdInput("td_posologia"+idx, "", idx, "classPosologia", ""));
		row.appendChild(this.creaTdInput("td_esenzione"+idx, "", idx, "classEsenzione", ""));
//		row.appendChild(this.creaTdCheck("td_PA"+idx, "", idx, "classPA"));
		row.appendChild(this.creaTdCheckCombo("td_Sost"+idx, "", idx, "classSost"));
		
		row.addAttribute("concedibile","N");
		row.addAttribute("classe_farmaco","");		
		row.addAttribute("iden","");
		row.addAttribute("data","");
		row.addAttribute("cod_farmaco","");
		row.addAttribute("cod_posologia","");
		row.addAttribute("cod_esenzione","");
		row.addAttribute("cod_sost","");
		row.addAttribute("cod_pa","");
		/*row.addAttribute("principio_attivo","");*/
		row.addAttribute("sost","");
		row.addAttribute("cronica","");
		row.addAttribute("periodica","");
		row.addAttribute("temporanea","");
		row.addAttribute("rimanenza","");
		row.addAttribute("iden_problema","");
		row.addAttribute("deleted","N");
		row.addAttribute("daStampare","N");
		row.addAttribute("coloreIcona","N");
		row.addAttribute("blocco","");
		row.addAttribute("attivo","S");
		row.addAttribute("nota_cuf","");
		row.addAttribute("forzatura","");
		row.addAttribute("pt","");
		row.addAttribute("data_ini","");
		row.addAttribute("data_fine","");
		row.addAttribute("oscurato","N");
		row.addAttribute("ripetibile","");
		row.addAttribute("suggerita","");
		row.addAttribute("descr_suggerita","");
		row.addAttribute("show_farmaco_originale","");
		row.addAttribute("stampa_posologia","N");
		row.addAttribute("mi",""); 
		row.addAttribute("tipo_mi",""); 
		row.addAttribute("sito","MMG"); 
		row.addAttribute("class","trRigaFarmaci");
		//row.addAttribute("pa","");
		//row.addAttribute("forzaRR","");
		row.addAttribute("tipoRiga","ins");
		row.addAttribute("idx", idx);
		return row;	
	}
	
	private htmlI creaTagI(String id, String className, String TagValue, String Title){
		
		htmlI tagI = new htmlI();
		tagI.addAttribute("class", className);
		tagI.addAttribute("id", id);
		tagI.setTagValue(TagValue);
		tagI.addAttribute("title", Title);
		
		return tagI;
	}
	
	private htmlTd creaTdAction(String id, String idx) {
		
		htmlTd tdAction = new htmlTd();
		tdAction.addAttribute("id", id);
		tdAction.addAttribute("class","tdRRFarmaci tdAction");
		
		htmlDiv divCheck = new htmlDiv();
		divCheck.addAttribute("class", "divCheck");
		htmlInput check = new htmlInput("checkbox");
		check.addAttribute("id","chkSeleziona"+idx);
		check.addAttribute("class","chkSeleziona");
		tdAction.appendChild(check);
		
		//Appendo le icone al td
		tdAction.appendChild(this.creaTagI("icoAction"+idx, "icon-cog-1","",""));
		tdAction.appendChild(this.creaTagI("icoCrono"+idx, "icon-hourglass","",""));
		tdAction.appendChild(this.creaTagI("icoScorta"+idx, "icon-attention","",""));
		tdAction.appendChild(this.creaTagI("icoInfo"+idx, "icon-info-circled","",""));
		tdAction.appendChild(this.creaTagI("icoSSN"+idx, "iconSSN","SSN","Farmaco concedibile in regime SSN"));
		tdAction.appendChild(this.creaTagI("icoRipetibile"+idx, "iconRipetibile","R","Prescrizione ripetibile"));
		tdAction.appendChild(this.creaTagI("icoStampare"+idx, "icon-doc","",""));
		tdAction.appendChild(this.creaTagI("icoBlocco"+idx, "icon-lock","",""));
		tdAction.appendChild(this.creaTagI("icoPT"+idx, "iconPT","PT","Piano Terapeutico in scadenza in data "));
		tdAction.appendChild(this.creaTagI("icoNoMedIniz"+idx, "icon-cancel-1 medIniz","","Oscurata dalla Medicina Iniziativa"));
		tdAction.appendChild(this.creaTagI("icoOscurato"+idx, "icon-minus-circled","","Farmaco oscurato"));
		
		return tdAction;
	}
	
	
	private htmlTh creaTHInt(String className, String id, String Descrizione){
		
		htmlTh th = new htmlTh();
		th.addAttribute("id", id);
		th.addAttribute("class", className + " " + id);
		th.addAttribute("title", Descrizione);
		th.setTagValue(Descrizione);
		th.appendChild(this.creaTagI("ico_"+id+"_asc", "icon-down","",""));
		th.appendChild(this.creaTagI("ico_"+id+"_asc", "icon-up","",""));
		
		return th;
	}
	

	private htmlTd creaTd(String id, String Descrizione, String idx, String ClassName){
		
		htmlTd td = new htmlTd();
		td.addAttribute("id", id);
		td.addAttribute("class", "tdRRFarmaci "+ClassName);
		td.addAttribute("title", Descrizione);
		td.setTagValue(Descrizione);
		
		return td;
	}
	
	
	private htmlTd creaTd(String id, String Descrizione, String idx, String ClassName, String DescrizioneAggiuntiva){

		String descrAgg;
		if(!DescrizioneAggiuntiva.equalsIgnoreCase("")){			
			descrAgg = "Principio Attivo: " + DescrizioneAggiuntiva;
		}else{
			descrAgg = Descrizione;
		}
		htmlTd td = new htmlTd();
		td.addAttribute("id", id);
		td.addAttribute("class", "tdRRFarmaci "+ClassName);
		td.setTagValue(Descrizione);
		td.addAttribute("title", descrAgg);
		
		return td;
	}
	
	private htmlTd creaTdCheckCombo(String id, String Value, String idx, String ClassName){
		
		Map<String,String> paramsSql = new HashMap<String, String>();
		
		htmlTd td = new htmlTd();
		td.addAttribute("id", id);
		td.addAttribute("class", "tdRRFarmaci "+ClassName);
		htmlInput check = new htmlInput("checkbox");
		check.addAttribute("id","chkSost"+idx);
		check.addAttribute("class","chkSost");
		/*
		 * Credo non serva perche' Value e' la descrizione
		 */
		if(Value.equalsIgnoreCase("S")){
			check.addAttribute("checked","true");
		}
		
		td.appendChild(check);
		htmlSelect combo = new htmlSelect();
		combo.addAttribute("id","txtSost"+idx);
		combo.addAttribute("style","display:none; float:right");
		combo.addAttribute("title", Value);
		
		iDataManager dmCombo = CaronteFactory.getFactory().createDataManager("MMG_DATI", toolKitShortcut.generateClientID(this.session));
		
		paramsSql.put("tipo_dato", "cmbMotivoNonSost");
		paramsSql.put("tipo_scheda", "RICETTA_ROSSA");
		
		try{
			
			if (sql_cmbMotivoNonSost == null) {
				sql_cmbMotivoNonSost = dmCombo.getSqlRowSetByQuery("MMG_DATI.SELECT_MMG_CODIFICHE", paramsSql);
			} else {
				sql_cmbMotivoNonSost.beforeFirst();
			}
			
			while(sql_cmbMotivoNonSost.next()){
				
				htmlOption opt = new htmlOption();
				opt.addAttribute("value", sql_cmbMotivoNonSost.getString("CODICE"));
				opt.setTagValue(sql_cmbMotivoNonSost.getString("DESCRIZIONE"));
				opt.addAttribute("title",sql_cmbMotivoNonSost.getString("DESCRIZIONE"));
				
				combo.appendChild(opt);
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		
		td.appendChild(combo);
		
		return td;
		
	}
	
	private htmlTd creaTdInput(String id, String Descrizione, String idx, String ClassName, String Title){

		
		
		htmlTd tdInput = new htmlTd();
		htmlInput inp = new htmlInput("text");
		tdInput.addAttribute("id", id);
		tdInput.addAttribute("class", "tdRRFarmaci "+ClassName);
		inp.addAttribute("id","txt"+id);
		inp.addAttribute("class", "text");
		inp.addAttribute("value",Descrizione);
		tdInput.addAttribute("title", Descrizione);
		tdInput.appendChild(inp);
		
		return tdInput;
	}

	private htmlTr creaInt() {
		
		htmlTr row = new htmlTr();
		row.addAttribute("class","intestazione");

		iDataManager dmInt = CaronteFactory.getFactory().createDataManager("MMG_DATI", toolKitShortcut.generateClientID(this.session));
		
		try {
			
			SqlRowSet sql = dmInt.getSqlRowSetByQuery("RICETTE.INTESTAZIONE_RR_FARMACI");
			
			while(sql.next()){
				row.appendChild(this.creaTHInt("thRicetta classData", "th_data", sql.getString("DATA")));
				row.appendChild(this.creaTHInt("thRicetta tdAction", "th_action", ""));
				row.appendChild(this.creaTHInt("thRicetta classFarmaco", "th_farmaco", sql.getString("FARMACO")));
				row.appendChild(this.creaTHInt("thRicetta classQuantita", "th_quantita", sql.getString("QUANTITA")));
				row.appendChild(this.creaTHInt("thRicetta classPosologia", "th_posologia", sql.getString("POSOLOGIA")));
				row.appendChild(this.creaTHInt("thRicetta classEsenzione", "th_esenzione", sql.getString("ESENZIONE")));
//				row.appendChild(this.creaTHInt("thRicetta classPA", "th_PA", sql.getString("PA")));
				row.appendChild(this.creaTHInt("thRicetta classSost", "th_sostituibilita", sql.getString("SOST")));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return row;
	}
    
	private String chkNull(String input) {
		if (input == null)
			return "";
		else
			return input;
	}
}