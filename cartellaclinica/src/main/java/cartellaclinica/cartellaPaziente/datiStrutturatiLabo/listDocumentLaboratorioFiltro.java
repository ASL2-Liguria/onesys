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
package cartellaclinica.cartellaPaziente.datiStrutturatiLabo;

import generic.servletEngine;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classIFrameHtmlObject;
import imago.http.classInputHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import it.elco.whale.converters.MapFactory;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.ecs.Doctype;
import org.json.JSONException;

import cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocumentLab.listDocumentLabEngine;

public class listDocumentLaboratorioFiltro extends servletEngine
{
	private String idPaziente 		= new String("");
	private String nosologico 		= new String("");
	private String daData 			= new String("");
	private String aData 			= new String("");
	private String elencoEsami 		= new String("");
	private String numRichieste 	= new String("");
	private String provChiamata 	= new String("");
	private String reparto 			= new String("");
	private String idenRichiesta 	= new String("");
	private String tipologia	 	= new String("");
	private String modalita	 	= new String("");
	
	private ElcoLoggerInterface logInterface 		=  new ElcoLoggerImpl(listDocumentLabEngine.class);
	private classIFrameHtmlObject cIframeGriglia 	= new classIFrameHtmlObject("","iframeGriglia",0,0);

	String htmlNumRichieste;
	String htmlButtonStampa;
	String htmlLblProvenienza;
	String htmlLblEsami;

	String htmlFiltroData;
	classFormHtmlObject cFormDati = null;
	classInputHtmlObject cInput = null;
	ArrayList<String> idenRichieste;
	String classTd="";
	String datiPs []=null;
	Map<String, Object> mapConfigurazioni=null;

	public listDocumentLaboratorioFiltro(ServletContext pCont,HttpServletRequest pReq){
		super(pCont,pReq);
		this.bReparti = super.bReparti;//Global.getReparti(pReq.getSession());

	}    

	@Override
	protected String getBody(){	

		try {
			super.setDocType(Doctype.XHtml10Transitional.class);
		} catch (InstantiationException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IllegalAccessException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		String sOut 				= new String("");
		classDivHtmlObject cDiv 	= null;

		try
		{
			readDati(); 
			mapConfigurazioni = MapFactory.fromJSonString(bReparti.getValue(reparto,"CONFIG_DATI_STRUTTURATI_LABO"));

			datiPs				= checkRisultatiPs();
			
			if(provChiamata.equals("MMG"))
				super.BODY.addAttribute("class", "bodyMMG");
			else if(provChiamata.equals("AMBULATORIO"))
				super.BODY.addAttribute("class", "bodyAmbulatorio");
			else if(provChiamata.equals("IPATIENT"))
				super.BODY.addAttribute("class", "bodyIPatient");
			else
				super.BODY.addAttribute("class", "bodyCartella");
						
			
		}catch (Exception e){
			super.BODY.setOnLoad("setVisible();");
			sOut = e.getMessage();
			logInterface.error(e.getMessage(), e);
		} 


		// Creo Form Dati Generici
		cFormDati = new classFormHtmlObject("formDati","","");
		cInput = new classInputHtmlObject("hidden","datiPs",datiPs[0]);
		cFormDati.appendSome(cInput);
		cInput = new classInputHtmlObject("hidden","datiPsGiorni",datiPs[1]);
		cFormDati.appendSome(cInput);

		// Appendo Il Form Dato Generici
		sOut =cFormDati.toString();


		cDiv = new classDivHtmlObject("divMenu");   
		try 
		{	
			// Filtro Da Data A data
			htmlFiltroData	= getDataFiltro();
			cDiv.appendSome(htmlFiltroData);
			
	
			// Select Numero Richieste
			cDiv.appendSome(getOptionRichieste());
			if(modalita.equals("PAZIENTE")){
				cDiv.appendSome(getProvenienzaFiltro());
			}
			cDiv.appendSome(getEsamiFiltro());
			cDiv.appendSome(getFiltroBranca());
			cDiv.appendSome(getButtonFiltro());

			sOut += cDiv.toString();

			cIframeGriglia = new classIFrameHtmlObject("","iframeGriglia",0,0);
			cIframeGriglia.addAttribute("scrolling", "no");
			sOut += cIframeGriglia.toString();

		}
		catch (Exception e) {
			super.BODY.setOnLoad("setVisible();");
			sOut = e.getMessage();
		} 
		return sOut; 
	}

	private void readDati() {

		this.idPaziente 		= this.cParam.getParam("idPatient").trim();
		this.elencoEsami 		= this.cParam.getParam("elencoEsami").trim(); 
		this.tipologia	 		= this.cParam.getParam("tipologia").trim();
		this.reparto 			= this.cParam.getParam("reparto").trim();     
		this.nosologico 		= this.cParam.getParam("nosologico").trim();
		this.idenRichiesta 		= this.cParam.getParam("idenRichiesta").trim();
		this.provChiamata 		= this.cParam.getParam("provChiamata").trim();
		this.aData 				= this.cParam.getParam("aData").trim();
		this.daData				= this.cParam.getParam("daData").trim(); 
		this.modalita			= this.cParam.getParam("modalita").trim(); 
		
	}


	public String getButtonRichiesta() {

		String htmlButtonRichiesta = "";

		htmlButtonRichiesta	+= "<div id='divFiltroDate' class='wrapSezioneMenu'>";
		htmlButtonRichiesta	+= "<label class='lblMenuDatiLaboratorio'>Da Data</label><input id='inpFiltroDaData' class='inpFiltroData' />";
		htmlButtonRichiesta	+= "<label class='lblMenuDatiLaboratorio'>A Data</label><input id='inpFiltroAData' class='inpFiltroData'/>";
		htmlButtonRichiesta	+= "</div>";

		return htmlButtonRichiesta;
	}		
	
	public String getButtonFiltro() throws JSONException {

		String htmlOut	= "";
		
		List<Map<String,String>> buttons = (List<Map<String,String>>) mapConfigurazioni.get("BUTTONS");
		
		for(Map<String,String> button : buttons){
						
			String id = button.get("id");
		
			boolean show = button.get("show").equals("S");		

			htmlOut += show ? "<div id='"+id+"' class='HeaderButton'></div>": "";
		
		}
		
		return htmlOut;
	}

	public String getDataFiltro() {

		String htmlFiltroData = "";

		htmlFiltroData	+= "<div id='divFiltroDate' class='wrapSezioneMenu'>";
		htmlFiltroData	+= "<span class='spnMenuDatiLaboratorio'>Da Data</span><input id='inpFiltroDaData' class='inpFiltroData' />";
		htmlFiltroData	+= "<span class='spnMenuDatiLaboratorio'>A Data</span><input id='inpFiltroAData' class='inpFiltroData'/>";
		htmlFiltroData	+= "</div>";

		return htmlFiltroData;
	}

	public String getProvenienzaFiltro() {

		String htmlProvenienzaFiltro = "";

		htmlProvenienzaFiltro	+= "<div id='divFiltroProvenienza' class='wrapSezioneMenu'>";
		htmlProvenienzaFiltro	+= "<LABEL id='lblSceltaProvenienza' class='lblMenuDatiLaboratorio' name='lblSceltaProvenienza' onclick='javascript:apri_filtro(this);' FILTRO_CAMPO_SAVE='' FILTRO_CAMPO_TIPO='TEXT' FILTRO_CAMPO_VALORE='hProvenienzaFiltro' FILTRO_CAMPO_DESCRIZIONE='lblElencoProvenienza' FILTRO_KEY_LEGAME='FILTRO_DATI_STRUTTURALI_PROVENIENZA' title='Provenienze Selezionate:'>Provenienze</LABEL>";
		htmlProvenienzaFiltro	+= "<label id='lblElencoProvenienza' class='lblMenuDatiLaboratorio'></label>";
		htmlProvenienzaFiltro	+= "<input type='HIDDEN' id='hProvenienzaFiltro'/>";
		htmlProvenienzaFiltro	+= "</div>";

		return htmlProvenienzaFiltro;
	}

	public String getEsamiFiltro() {

		String htmlProvenienzaFiltro = "";

		htmlProvenienzaFiltro	+= "<div id='divFiltrEsami' class='wrapSezioneMenu'>";
		htmlProvenienzaFiltro	+= "<label id='lblSceltaEsamiProfili' class='lblMenuDatiLaboratorio' title='Analisi Selezionate:'>Analisi</label>";
		htmlProvenienzaFiltro	+= "<label id='lblElencoEsami' class='lblMenuDatiLaboratorio'></label>";
		htmlProvenienzaFiltro	+= "<input type='HIDDEN' id='hEsamiFiltro'/>";
		htmlProvenienzaFiltro	+= "<input type='HIDDEN' id='hEsamiFiltroRange'/>";
		htmlProvenienzaFiltro	+= "</div>";

		return htmlProvenienzaFiltro;
	}
	

	public String getFiltroBranca() throws JSONException{

		String htmlFiltroBranca = "";
		
		htmlFiltroBranca	+= "<div id='divFiltriBranca' class='wrapSezioneMenu'><UL id=filtriBranca class=pulsanteULCenter>";
		
		htmlFiltroBranca	+= "<LI id='LABO'><A href=\"javascript:NS_DATI_LABO.NS_FILTRI_FUNZIONI.scegliBranca('LABO');\">Labo</A></LI>";
		htmlFiltroBranca	+= "<LI id='MICRO'><A href=\"javascript:NS_DATI_LABO.NS_FILTRI_FUNZIONI.scegliBranca('MICRO');\">Microbiol.</A></LI>";
		htmlFiltroBranca	+= "<LI id='RIA'><A href=\"javascript:NS_DATI_LABO.NS_FILTRI_FUNZIONI.scegliBranca('RIA');\">RIA</A></LI></UL></DIV>";

		return htmlFiltroBranca;
	}

	public String getOptionRichieste() throws JSONException {

		String htmlOut	="";
		// Configurazione Combo
		List<Map<String,String>> combo = (List<Map<String,String>>) mapConfigurazioni.get("FILTRO");		
		String[] comboColonne	= combo.get(0).get("day").split("\\|");
		
		// Valorizzo NUM_RICHIESTE a seconda che l'abbia in GET
		this.numRichieste		= (!this.cParam.getParam("numRichieste").equalsIgnoreCase("")) ? this.cParam.getParam("numRichieste").trim() : combo.get(1).get("selected");
		
		if (idenRichiesta.equals("")){

			htmlOut	= "<DIV class='wrapSezioneMenu'><span class='spnMenuDatiLaboratorio'>N. Richieste: </span>";
			htmlOut += "<select name='selectRichieste'>"; 

			// Select da Array comboColonne
			for(int i =0; i < comboColonne.length ; i++){
				// comboColonne[i].equals(combo.get(1).get("selected"))
				if (comboColonne[i].equals(numRichieste))
					htmlOut	+= "<option value='"+comboColonne[i]+"' SELECTED>"+comboColonne[i]+"</option>";	 
				else
					htmlOut	+= "<option value='"+comboColonne[i]+"'>"+comboColonne[i]+"</option>";	
			}
			htmlOut+="</select>";
			htmlOut	+= "</DIV>";
		}else{
		
			htmlOut	= "<DIV class='wrapSezioneMenu'><span class='spnMenuDatiLaboratorio'>N. Richieste: </span>";
			htmlOut += "<select name='selectRichieste'><option value='1' SELECTED>1</option></select>";
			htmlOut	+= "</DIV>";
			
		}	

		return htmlOut;  
	}


	public String[] checkRisultatiPs() throws SQLException, JSONException{

		// Configurazione Risultati PS
		List<Map<String,String>> ps = (List<Map<String,String>>) mapConfigurazioni.get("PS");		
		String result[]				= {ps.get(0).get("dati"),ps.get(0).get("giorni").toString()};

		return result;

	}

	@Override
	protected String getTitle() {
		// TODO Auto-generated method stub
		return "";
	}

	@Override
	protected String getBottomScript() {
		// TODO Auto-generated method stub
		return "";
	}

}
