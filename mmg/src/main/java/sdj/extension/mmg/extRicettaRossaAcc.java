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
import generatoreEngine.components.html.htmlScript;
import generatoreEngine.components.html.htmlTable;
import generatoreEngine.components.html.htmlTd;
import generatoreEngine.components.html.htmlTh;
import generatoreEngine.components.html.htmlTr;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import generatoreEngine.toolkit.xml.toolKitXML;
import it.elco.baseObj.BaseUser;
import it.elco.cache.CacheManager;
import it.elco.caronte.dataManager.impl.iDataManager;
import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.listener.ElcoContextInfo;
import it.elco.toolkit.toolKitJSON;
import it.elco.toolkit.toolKitShortcut;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.w3c.dom.DOMException;


/**
 * 
 * @author lucas
 *
 */

public class extRicettaRossaAcc extends extensionHtmlBase{
	
	private static final long serialVersionUID	= -6440620892493186077L;

	private static final String	__ID_TABLE				= "TABLE_PARAM";
	
	private Logger	logger	 	= LoggerFactory.getLogger(getClass());
	
	private ServletContext		sContext	= null;
	private HttpServletRequest	sRequest	= null;
	private HttpSession			session		= null;
	
	private htmlDiv				divTable			= null;
	private BaseUser			baseUser			= null;
	private String				webuser				= null;
	private String				lingua				= null;
	private String				idenAnag 	    	= null;
	private String				idenProblema    	= null;
	private String				realPath 	    	= null;
	private String				numRow 	    		= null;
	private String				medicinaIniziativa 	= null;
	private String				queryAccertamenti	= "RICETTE.RICETTE_ACCERTAMENTI";
	

	private String				js_jquery_id  	= null;
	private String				js_method_AC_ajax= null;
	private String				js_method_AC_list= null;
	
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
		idenAnag    = sRequest.getParameter("IDEN_ANAG");
		idenProblema= sRequest.getParameter("IDEN_PROBLEMA");
		numRow      = chkNull(sRequest.getParameter("NUM_ROW"));
		realPath    = ElcoContextInfo.getContextPath();
		
		medicinaIniziativa	= sRequest.getParameter("MED_INIZ");
		numRow      		= chkNull(sRequest.getParameter("NUM_ROW"));
		
		// se il paziente è in un percorso di medicina d'iniziativa cambio le query da utilizzare
		if("S".equalsIgnoreCase(medicinaIniziativa)){
			queryAccertamenti = "RICETTE.RICETTE_ACCERTAMENTI_MI";
		}
		
		this.js_jquery_id = "$";
		this.js_method_AC_ajax = "autocomplete";
		this.js_method_AC_list = "autocompleteList";
	}

	@Override
	public void end() throws extensionExceptionEnd 
	{
	}
	
	public void initRR(String type)
	{
		String sKey = "TABLE_PARAM$" + __ID_TABLE + "$" + webuser + "$" + lingua;
		
//		CacheManager cache = new CacheManager("RIC_ROSSA_ACCERTAMENTI");
//		divTable =(htmlDiv) cache.getObject(sKey);
		
//		if(divTable== null)
//		{
			divTable = this.createTable();
//			cache.setObject(sKey, divTable);
//		}
		
		iHtmlTagBase Container =  super.getHtmlWork();
		Container.appendChild(divTable);
		htmlDiv endDiv = new htmlDiv();
		endDiv.setId("divFineLista");
		endDiv.setTagValue("&nbsp;");
		Container.appendChild(endDiv);
	}
	
	private htmlDiv createTable()	
	{
		logger.debug("Creazione Tabella Ricetta Rossa Accertamenti [sito:"+sito+" - versione:"+sito+"]");
		
		int index = 0;
		
		Map<String,String> params = new HashMap<String, String>();
		htmlDiv divRet = new htmlDiv();
		divRet.addAttribute("class","divRicettaAcc");

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
			htmlTr row1 = this.creaRiga(index);
			table.appendChild(row1);

			SqlRowSet sql = dm.getSqlRowSetByQuery(queryAccertamenti, params);
			
			while(sql.next()){

				index++;
				String idx = String.valueOf(index);
				
				htmlTr row = new htmlTr();
				row.appendChild(this.creaTd("td_data"+idx, chkNull(sql.getString("DATA")), idx, "classData"));
				row.appendChild(this.creaTdAction("td_action"+idx, idx));
				row.appendChild(this.creaTd("td_accertamento"+idx, chkNull(sql.getString("ACCERTAMENTO")), idx, "classAccertamento", "Diagnosi: "+chkNull(sql.getString("DIAGNOSI"))));		
				row.appendChild(this.creaTdInput("td_quantita"+idx, chkNull(sql.getString("QUANTITA")), idx, "classQuantita"));
				row.appendChild(this.creaTdInput("td_risultato"+idx, chkNull(sql.getString("RISULTATO")), idx, "classRisultato"));
				row.appendChild(this.creaTdInput("td_esenzione"+idx, chkNull(sql.getString("ESENZIONE")),idx, "classEsenzione"));
				row.addAttribute("iden", chkNull(sql.getString("IDEN")));
				row.addAttribute("data", chkNull(sql.getString("DATA_ISO")));
				row.addAttribute("cod_accertamento", chkNull(sql.getString("COD_ACCERTAMENTO")));
				row.addAttribute("cod_esenzione", chkNull(sql.getString("COD_ESENZIONE")));
				row.addAttribute("cronica", chkNull(sql.getString("CRONICITA")));
				row.addAttribute("periodica", chkNull(sql.getString("PERIODICITA")));
				row.addAttribute("temporanea", chkNull(sql.getString("TEMPORANEITA")));
				row.addAttribute("iden_problema", chkNull(sql.getString("IDEN_PROBLEMA")));
				row.addAttribute("deleted", chkNull(sql.getString("DELETED")));
				row.addAttribute("daStampare", chkNull(sql.getString("DA_STAMPARE")));
				row.addAttribute("blocco", chkNull(sql.getString("BLOCCO")));
				row.addAttribute("attivo", chkNull(sql.getString("ATTIVO")));
				row.addAttribute("note_prescrizione", chkNull(sql.getString("NOTE_PRESCRIZIONE")));
				row.addAttribute("diagnosi", chkNull(sql.getString("DIAGNOSI")));
				row.addAttribute("urgenza", chkNull(sql.getString("URGENZA")));
				row.addAttribute("cod_situazione_clinica", chkNull(sql.getString("COD_SITUAZIONE_CLINICA")));
				row.addAttribute("pat_summary", chkNull(sql.getString("PAT_SUMMARY")));
				row.addAttribute("oscurato", chkNull(sql.getString("OSCURATO")));
				row.addAttribute("data_esecuzione", chkNull(sql.getString("DATA_ESECUZIONE")));
				row.addAttribute("forzatura", chkNull(sql.getString("FORZATURA")));
				row.addAttribute("importanza", chkNull(sql.getString("IMPORTANZA")));
				row.addAttribute("suggerita", chkNull(sql.getString("SUGGERITA")));
				row.addAttribute("cicliche", chkNull(sql.getString("CICLICHE")));
				row.addAttribute("num_sedute", chkNull(sql.getString("NUM_SEDUTE")));
				row.addAttribute("mi", chkNull(sql.getString("MED_INIZ")));
				row.addAttribute("tipo_mi", chkNull(sql.getString("TIPO_MED_INIZ")));
				row.addAttribute("sito", chkNull(sql.getString("SITO")));
				row.addAttribute("appropriatezza", chkNull(sql.getString("APPROPRIATEZZA")));
				row.addAttribute("id_nota_appropriatezza", chkNull(sql.getString("ID_NOTA_APPROPRIATEZZA")));
				row.addAttribute("iden_ricetta", chkNull(sql.getString("IDEN_RICETTA")));
				row.addAttribute("iden_medico", chkNull(sql.getString("IDEN_MEDICO")));
				row.addAttribute("iden_utente", chkNull(sql.getString("IDEN_UTENTE")));
				
				row.addAttribute("class","trRigaAccertamenti");
				row.addAttribute("idx", idx);
				
				table.appendChild(row);
				
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
		
		//TODO: da rivedere inserendo la possibilita' di creare la riga configurando le colonne da fare vedere
		
		String idx = String.valueOf(index);
		
		htmlTr row = new htmlTr();
		row.appendChild(this.creaTd("td_data"+idx, "", idx, "classData"));
		row.appendChild(this.creaTdAction("td_action"+idx, idx));
 		row.appendChild(this.creaTdInput("td_accertamento"+idx, "", idx, "classAccertamento Ins"));
 		row.appendChild(this.creaTdInput("td_quantita"+idx, "", idx, "classQuantita"));
		row.appendChild(this.creaTdInput("td_risultato"+idx, "", idx, "classRisultato"));
		row.appendChild(this.creaTdInput("td_esenzione"+idx, "", idx, "classEsenzione"));
		row.addAttribute("iden","");
		row.addAttribute("data", "");
		row.addAttribute("cod_accertamento", "");
		row.addAttribute("cod_esenzione", "");
		row.addAttribute("cronica", "");
		row.addAttribute("periodica", "");
		row.addAttribute("temporanea", "");
		row.addAttribute("iden_problema", "");
		row.addAttribute("deleted", "N");
		row.addAttribute("daStampare", "N");
		row.addAttribute("blocco", "N");
		row.addAttribute("attivo", "S");
		row.addAttribute("note_prescrizione", "");
		row.addAttribute("diagnosi", "");
		row.addAttribute("urgenza", "");
		row.addAttribute("cod_situazione_clinica", "");
		row.addAttribute("pat_summary", "N");
		row.addAttribute("oscurato", "N");
		row.addAttribute("data_esecuzione", "");
		row.addAttribute("forzatura", "");
		row.addAttribute("importanza", "");
		row.addAttribute("suggerita", "");
		row.addAttribute("cicliche", "0");
		row.addAttribute("num_sedute", "0");
		row.addAttribute("mi", "");
		row.addAttribute("tipo_mi", "");
		row.addAttribute("sito", "MMG");
		row.addAttribute("class","trRigaAccertamenti");
		row.addAttribute("tipoRiga","ins");
		row.addAttribute("idx", idx);
		return row;	
	}


	private htmlTr creaRiga(HashMap obj, int index) {
	
		//TODO: da rivedere inserendo la possibilita' di creare la riga configurando le colonne da fare vedere

		String idx = String.valueOf(index);
		
		htmlTr row = new htmlTr();
		row.appendChild(this.creaTd("td_data"+idx, obj.get("data").toString(), idx, "classData"));
		row.appendChild(this.creaTdAction("td_action"+idx, idx));
		row.appendChild(this.creaTd("td_accertamento"+idx, chkNull(obj.get("accertamento").toString()), idx, "classAccertamento", "Diagnosi: "+chkNull(obj.get("diagnosi").toString())));		
		row.appendChild(this.creaTdInput("td_quantita"+idx, chkNull(obj.get("quantita").toString()), idx, "classQuantita"));
		row.appendChild(this.creaTdInput("td_risultato"+idx, chkNull(obj.get("risultato").toString()), idx, "classRisultato"));
		row.appendChild(this.creaTdInput("td_esenzione"+idx, chkNull(obj.get("esenzione").toString()),idx, "classEsenzione"));
		row.addAttribute("iden",chkNull(obj.get("iden").toString()));
		row.addAttribute("data", chkNull(obj.get("data_iso").toString()));
		row.addAttribute("cod_accertamento", chkNull(obj.get("cod_accertamento").toString()));
		row.addAttribute("cod_esenzione", chkNull(obj.get("cod_esenzione").toString()));
		row.addAttribute("cronica", chkNull(obj.get("cronica").toString()));
		row.addAttribute("periodica", chkNull(obj.get("periodica").toString()));
		row.addAttribute("temporanea", chkNull(obj.get("temporanea").toString()));
		row.addAttribute("iden_problema", chkNull(obj.get("iden_problema").toString()));
		row.addAttribute("deleted", chkNull(obj.get("deleted").toString()));
		row.addAttribute("daStampare", chkNull(obj.get("daStampare").toString()));
		row.addAttribute("blocco", chkNull(obj.get("blocco").toString()));
		row.addAttribute("attivo", chkNull(obj.get("attivo").toString()));
		row.addAttribute("note_prescrizione", chkNull(obj.get("note_prescrizione").toString()));
		row.addAttribute("diagnosi", chkNull(obj.get("diagnosi").toString()));
		row.addAttribute("urgenza", chkNull(obj.get("urgenza").toString()));
		row.addAttribute("cod_situazione_clinica", chkNull(obj.get("cod_situazione_clinica").toString()));
		row.addAttribute("pat_summary", chkNull(obj.get("pat_summary").toString()));
		row.addAttribute("oscurato", chkNull(obj.get("oscurato").toString()));
		row.addAttribute("data_esecuzione", chkNull(obj.get("data_esecuzione").toString()));
		row.addAttribute("class","trRigaAccertamenti");
		row.addAttribute("idx", idx);
		return row;
	}
	
	private htmlI creaTagI(String id, String className){
		
		return creaTagI(id,className,"","");
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
		tdAction.addAttribute("class","tdRRAccertamenti tdAction");
		
		htmlDiv divCheck = new htmlDiv();
		divCheck.addAttribute("class", "divCheck");
		htmlInput check = new htmlInput("checkbox");
		check.addAttribute("id","chkSeleziona"+idx);
		check.addAttribute("class","chkSeleziona");
		tdAction.appendChild(check);
		
		//Appendo le icone al td
		tdAction.appendChild(this.creaTagI("icoAction"+idx, "icon-cog-1"));
		tdAction.appendChild(this.creaTagI("icoCrono"+idx, "icon-hourglass"));
		tdAction.appendChild(this.creaTagI("icoStampare"+idx, "icon-doc"));
		tdAction.appendChild(this.creaTagI("icoNota"+idx, "icon-pencil"));
		tdAction.appendChild(this.creaTagI("icoPS"+idx, "iconPS","PS","Accertamento visibile nel Patient Summary"));
		tdAction.appendChild(this.creaTagI("icoOscurato"+idx, "icon-minus-circled","","Accertamento oscurato"));
		tdAction.appendChild(this.creaTagI("icoInfo"+idx, "icon-info-circled"));
		tdAction.appendChild(this.creaTagI("icoNoMedIniz"+idx, "icon-cancel-1 medIniz","","Oscurata dalla Medicina Iniziativa"));
		
		return tdAction;
	}
	
	
	private htmlTh creaTHInt(String className, String id, String Descrizione){
		
		htmlTh th = new htmlTh();
		th.addAttribute("id", id);
		th.addAttribute("class", className + " " + id);
		th.setTagValue(Descrizione);
		th.addAttribute("title",Descrizione);
		th.appendChild(this.creaTagI("ico_"+id+"_asc", "icon-down"));
		th.appendChild(this.creaTagI("ico_"+id+"_asc", "icon-up"));
		
		return th;
	}
	

	private htmlTd creaTd(String id, String Descrizione, String idx, String ClassName){
		
		return creaTd(id, Descrizione, idx, ClassName, Descrizione);
	}
	
	private htmlTd creaTd(String id, String Descrizione, String idx, String ClassName, String title){
		
		htmlTd td = new htmlTd();
		td.addAttribute("id", id);
		td.addAttribute("class", "tdRRAccertamenti "+ClassName);
		td.setTagValue(Descrizione);
		td.addAttribute("title",title);
		
		return td;
	}
	
	private htmlTd creaTdInput(String id, String Descrizione, String idx, String ClassName){

		htmlTd tdInput = new htmlTd();
		htmlInput inp = new htmlInput("text");
		tdInput.addAttribute("id", id);
		tdInput.addAttribute("class", "tdRRAccertamenti "+ClassName);
		tdInput.addAttribute("title",Descrizione);
		inp.addAttribute("id","txt"+id);
		inp.addAttribute("class", "text");
		inp.addAttribute("value",Descrizione);
		tdInput.appendChild(inp);
		
		return tdInput;
	}
	
	private htmlTd creaTdInputAutocomplete(String id, String Descrizione, String idx, String ClassName){
		
		String id_campo = "txt"+id+idx;
		htmlTd tdInput = new htmlTd();
		htmlInput inp = new htmlInput("text");
		tdInput.addAttribute("id", id);
		tdInput.addAttribute("class", "tdRRAccertamenti "+ClassName);
		tdInput.addAttribute("title",Descrizione);
		inp.addAttribute("id",id_campo);
		inp.addAttribute("class", "text");
		inp.addAttribute("value",Descrizione);
		tdInput.appendChild(inp);
		this.generaAutoCompleteAjax("AC_CODICE_PROBLEMA", "AC_CODICE_PROBLEMA", "accertamento", id_campo);
		
		return tdInput;	
	}

	private htmlTr creaInt() {
		
		htmlTr row = new htmlTr();
		row.addAttribute("class","intestazione");

		iDataManager dmInt = CaronteFactory.getFactory().createDataManager("MMG_DATI", toolKitShortcut.generateClientID(this.session));
		
		try {

			SqlRowSet sql = dmInt.getSqlRowSetByQuery("RICETTE.INTESTAZIONE_RR_ACCERTAMENTI");
			
			while(sql.next()){
				row.appendChild(this.creaTHInt("thRicetta classData", "th_data", sql.getString("DATA")));
				row.appendChild(this.creaTHInt("thRicetta tdAction", "th_action", ""));
				row.appendChild(this.creaTHInt("thRicetta classAccertamento", "th_accertamento", sql.getString("ACCERTAMENTO")));
				row.appendChild(this.creaTHInt("thRicetta classQuantita", "th_quantita", sql.getString("QUANTITA")));
				row.appendChild(this.creaTHInt("thRicetta classRisultato", "th_risultato", sql.getString("RISULTATO")));
				row.appendChild(this.creaTHInt("thRicetta classEsenzione", "th_esenzione", sql.getString("ESENZIONE")));
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return row;
	}

	/* parte prelevata dalla servlet di autocomplete di jacopo per inserirla all'itnerno della ricetta rossa */
	
	private String getPathModel(){
		return realPath+"config/autocomplete/model/";
	}

	public void generaAutoCompleteAjax(String id_list,String file_config,String col_save, String idCampo)
	{		
		if(file_config != null && !file_config.trim().equals(""))
		{
			String tag_id = idCampo;

			if(tag_id != null && !tag_id.trim().equals(""))
			{
                super.getHtmlWork().appendChild(this.generaInputHidden(tag_id,col_save));

				try
				{
					htmlScript script = new htmlScript();
                    JSONObject config;
                    config=this.readConfig(getPathModel()+ file_config+".xml","//AUTOCOMPLETE/AJAX/*/text()","AJAX");

                    config.put("binds",this.readConfig(getPathModel()+ file_config+".xml","//AUTOCOMPLETE/QUERY_BINDS/*/text()","QUERY_BINDS"));
                    if(id_list != null && !id_list.trim().equals(""))
                    config.put("idList",id_list);    //se configurata, Associo la List
				    System.out.println(config.toString());
					script.addAttribute("type", "text/javascript");
					script.appendContent("$(document).ready(function(){");

					script.appendContent(this.js_jquery_id + "('#" + tag_id + "')." + this.js_method_AC_ajax + "(" +config.toString() + ");");
					
					script.appendContent("});");
					
					super.getHtmlWork().getTop().appendChild(script);
				}
				catch(Exception e)
				{
					e.printStackTrace();
				}
			}
		}else{
			logger.warn("File di configurazione mancante.");
		}
	}
	
	public void generaAutoCompleteList(String lbl,String id_list,String file_config) throws JSONException {
		
		htmlScript script = new htmlScript();
        JSONObject config;
        config=this.readConfig(getPathModel()+ file_config+".xml","//AUTOCOMPLETE/LIST/*/text()","LIST");

        config.put("binds",this.readConfig(getPathModel()+ file_config+".xml","//AUTOCOMPLETE/QUERY_BINDS/*/text()","QUERY_BINDS"));
		
		script.addAttribute("type", "text/javascript");
		script.appendContent("$(document).ready(function(){");

		script.appendContent(this.js_jquery_id + "('#" + lbl + "')." + this.js_method_AC_list + "('"+id_list+"',"+config.toString()+");");
		
		script.appendContent("});");

		super.getHtmlWork().getTop().appendChild(script);
		
	}
	

    private JSONObject readConfig(String config,String parentNode,String type)
    {
        CacheManager cache = new CacheManager("AC_CONFIG");
        String sKey = "AC_"+config+"_"+type;
        JSONObject conf = (JSONObject) cache.getObject(sKey);

        if(conf == null || conf.equals(""))
        {
            conf = readConfigFromFile(config,parentNode);
            cache.setObject(sKey, conf);
        }

        return conf;
    }

    private JSONObject readConfigFromFile(String config,String parentNode)
    {
        toolKitXML tk  = new toolKitXML();
        toolKitJSON tjson=new toolKitJSON();
        if(tk.openXmlFile(config))
        {
            tk.readNode(parentNode);
            for(int i = 0; i < tk.getSizeNodeList(); i++)
            {
                try {
                    tk.getNode(i);
                    try
                    {
                        toolKitXML tktype = new toolKitXML(tk.getNode().getParentNode());
                        if(tktype.getAttributeValue("type") != null && tktype.getAttributeValue("type").equals("js"))
                            tjson.appendJSONString(tk.getNodeName(),tk.getNodeValue());
                        else
                            tjson.appendObject(tk.getNodeName(),tk.getNodeValue());
                    }
                    catch(JSONException e){
                        e.printStackTrace();}
                } catch (DOMException e) {
                    e.printStackTrace();
                }
            }
        }
        return tjson.getJSONObject();
    }
    
    private htmlInput generaInputHidden(String id_text,String col_save)
    {
        htmlInput hInput =new htmlInput();
        hInput.setId("h-"+id_text);
        hInput.setType("hidden");
        hInput.setColonnaSave(col_save);
        return hInput;
    }
    
	private String chkNull(String input) {
		if (input == null)
			return "";
		else
			return input;
	}
}