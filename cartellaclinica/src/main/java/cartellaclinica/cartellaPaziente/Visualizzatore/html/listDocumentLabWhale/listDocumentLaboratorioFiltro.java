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
package cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocumentLabWhale;
import generic.servletEngine;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classIFrameHtmlObject;
import imago.http.classImgHtmlObject;
import imago.http.classInputHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;

import cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocumentLab.listDocumentLabEngine;
import core.Global;

public class listDocumentLaboratorioFiltro extends servletEngine
{
	private String idPaziente = new String("");

	private String nosologico = new String("");
	private String daData = new String("");
	private String aData = new String("");
	private String elencoEsami = new String("");
	private String provChiamata = new String("");
	private String reparto = new String("");
	private String idenRichiesta = new String("");

	String URI;
	String uriSS;
	String MIMETYPE;
	Connection conn;
	String numRicIn="";
	String htmlNumRichieste;
	String htmlButtonStampa;
	String htmlLblProvenienza;
	String htmlLblEsami;

	String htmlFiltroData;
	String numRichieste= new String("");
	String intestazione= new String("");
	classFormHtmlObject cFormDati = null;
	classInputHtmlObject cInput = null;
	ArrayList<String> idenRichieste;

	private ElcoLoggerInterface logInterface =  new ElcoLoggerImpl(listDocumentLabEngine.class);

	classImgHtmlObject cImgGraf = null;

	String classTd="";
	String datiPs []=null;



	ServletContext cContext;
	HttpSession session=null;
	Hashtable<Integer,Hashtable> hashColonne = new Hashtable<Integer,Hashtable>();
	/**
	 * Contiene i parametri di configurazione provenienti da applicativo
	 * intestazione
	 * ordine
	 * larghezza in %
	 * metodo da chiamare per reperire il dato
	 * parametri del metodo intervallati da §
	 */
	ArrayList<String> ArJoin;
	Hashtable<String,String> hashRequest = new Hashtable<String,String>();
	/**
	 * contiene i parametri generici
	 * dataIni
	 * dataFine
	 * URN documento
	 * DocStatus
	 * DocType
	 * User
	 * repartoProduttore    riferito al documento
	 * repartoUtente        per la configurazione
	 */
	Hashtable<String,String> hashMetadatiRichiesti = new Hashtable<String,String>();
	/**
	 * contiene le coppie name§value per filtrare i documenti
	 */

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
		String sOut = new String("");
		classDivHtmlObject cDiv = null;
		classIFrameHtmlObject cIframeGriglia = null;
		String button []=null;

		try
		{
			readDati();  
			datiPs				= checkRisultatiPs();
			htmlNumRichieste	= getOptionRichieste();
			
			if(provChiamata.equals("MMG"))
				super.BODY.addAttribute("class", "bodyMMG");
			else if(provChiamata.equals("AMBULATORIO"))
				super.BODY.addAttribute("class", "bodyAmbulatorio");
			else
				super.BODY.addAttribute("class", "bodyCartella");
						
			
		}catch (Exception e){
			super.BODY.setOnLoad("setVisible();");
			sOut = e.getMessage();
			logInterface.error(e.getMessage(), e);
		} 


		// Creo Form Dati Generici
		cFormDati = new classFormHtmlObject("formDati","","");
		cInput = new classInputHtmlObject("hidden","numRichieste",htmlNumRichieste);
		cFormDati.appendSome(cInput);
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
			cDiv.appendSome(htmlNumRichieste);
			
			htmlLblProvenienza	= getProvenienzaFiltro();
			cDiv.appendSome(htmlLblProvenienza);

			htmlLblEsami	= getEsamiFiltro();
			cDiv.appendSome(htmlLblEsami);

			// Button Export
			button 				= checkButton();
			htmlButtonStampa	= getButtonExport(button);
			cDiv.appendSome(htmlButtonStampa);

			sOut += cDiv.toString();

			cIframeGriglia = new classIFrameHtmlObject("","iframeGriglia",0,0);
			cIframeGriglia.addAttribute("scrolling", "no");
			sOut += cIframeGriglia.toString();

		}
		catch (Exception e) {
			super.BODY.setOnLoad("setVisible();");
			sOut = e.getMessage();
			logInterface.error(e.getMessage(), e);
		} 
		return sOut; 
	}



	private void readDati() {

		this.idPaziente 		= this.cParam.getParam("idPatient").trim();
		this.elencoEsami 		= this.cParam.getParam("elencoEsami").trim();     
		this.reparto 			= this.cParam.getParam("reparto").trim();     
		this.nosologico 		= this.cParam.getParam("nosologico").trim();
		this.idenRichiesta 		= this.cParam.getParam("idenRichiesta").trim();
		this.provChiamata 		= this.cParam.getParam("provChiamata").trim();

		this.numRichieste		= this.cParam.getParam("numRichieste").trim();
		this.intestazione		= this.cParam.getParam("intestazione").trim();

		this.aData 				= this.cParam.getParam("aData").trim();
		this.daData				= this.cParam.getParam("daData").trim();      

	}


	public String getButtonRichiesta() {

		String htmlButtonRichiesta = "";

		htmlButtonRichiesta	+= "<div id='divFiltroDate' class='wrapSezioneMenu'>";
		htmlButtonRichiesta	+= "<label class='lblMenuDatiLaboratorio'>Da Data</label><input id='inpFiltroDaData' class='inpFiltroData' />";
		htmlButtonRichiesta	+= "<label class='lblMenuDatiLaboratorio'>A Data</label><input id='inpFiltroAData' class='inpFiltroData'/>";
		htmlButtonRichiesta	+= "</div>";

		return htmlButtonRichiesta;
	}
	
	public String getButtonExport(String[] arButtonStampa) {

		String htmlOut	= "<div title='Inserimento Richieste' class='pulsWkRich buttonExport' onclick=top.inserisciRichiestaConsulenza();><A href=\"#\"></A></div>";

		if(arButtonStampa[0].toString().equalsIgnoreCase("S")){
			htmlOut += "<div id='expExcel' class='buttonExport' title='Esporta in Excel' onclick=javascript:NS_DATI_LABO.NS_FILTRI_EXPORT.AutomateExcel();></div>";
		}
		// pulsanteLabWhale
		if(arButtonStampa[1].toString().equalsIgnoreCase("S")){

			if(datiPs[0].equals("S") && idenRichiesta.equals("")){
				htmlOut	+= "<div id='expPdf' class=buttonExport title='Esporta in PDF' onclick=javascript:NS_DATI_LABO.NS_FILTRI_EXPORT.esportaPdf();></div>";
			}else{			  
				htmlOut	+= "<div id='expPdf' class=buttonExport title='Esporta in PDF' onclick=javascript:NS_DATI_LABO.NS_FILTRI_EXPORT.esportaPdf();></div>";
			}

		}
		
		if(arButtonStampa[2].toString().equalsIgnoreCase("S")){
			htmlOut	+= "<div id=\"divAddRisultato\" onclick='NS_DATI_LABO.NS_FILTRI_FUNZIONI.addRisultato()' title='Inserisci Risultato Manualmente' class='buttonExport'></div>";
		}
		
		htmlOut	+= "<div id='refreshPage' class='buttonExport' title='Aggiorna Dati di Laboratorio' onclick=javascript:NS_DATI_LABO.NS_FILTRI_FUNZIONI.aggiornaDatiStrutturati(\""+reparto+"\",\""+nosologico+"\",\""+idPaziente+"\") ></A></div>";

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

	public String getOptionRichieste() throws Exception{

		String htmlOut	= "";
		String outVal	= "";  

		// se idenRichiesta non è null Non Creo la Select con il Numero delle Richieste
		// La Select delle Richieste è Stata Spostata nel Filtro della Cartella

		if (idenRichiesta.equals("")){

			htmlOut	= "<DIV class='wrapSezioneMenu'><span class='spnMenuDatiLaboratorio'>N° Richieste: </span><select name='selectRichieste'>"; 
			outVal	= bReparti.getValue(reparto,"VISUALIZZATORE_NUM_RICH");

			String[] valori= new String[2];

			if (outVal != null && !outVal.equals("")){

				valori			= outVal.split("#");		
				String[] temp	= valori[0].split(",");

				// Se Non Viene Passato in Get il Numero delle Richieste Lo Prendo dalla Pagina (baseReparti) 
				if (numRichieste==null || numRichieste.equals("")){

					if(valori.length>1){
						numRicIn		= valori[1];
						numRichieste	= valori[1];
					}else{
						// Se non esiste il Valore di default viene settato con il piu basso della Select
						numRicIn		= temp[0];
						numRichieste	= temp[0];
					}	 
				}
				else
				{
					numRicIn	= numRichieste;
				}	     

				// Creo La Select
				for(int i =0; i < temp.length ; i++)

					if (temp[i].equals(numRicIn))
						htmlOut	+= "<option value='"+temp[i]+"' SELECTED>"+temp[i]+"</option>";	 
					else
						htmlOut	+= "<option value='"+temp[i]+"'>"+temp[i]+"</option>";	

				htmlOut+="</select>";

				//se non è presente il valore iniziale lo setto con il più basso dei valori		 
				if(numRicIn.equals(""))
					numRicIn	= temp[0]; 
			}
			else
			{
				htmlOut="";	 
			}
		}

		htmlOut	+= "</DIV>";

		return htmlOut;  
	}



	public String[] checkButton() throws SQLException, Exception{

		String result[]={"S","S","S"};
		String outVal="";


		outVal=bReparti.getValue(reparto,"VISUALIZZATORE_BUTTON_LABO");	

		String[] valori= new String[3];
		if (outVal!=null && !outVal.equals("")){
			
			valori= outVal.split("#");
			if(valori.length>0)
				result[0]=valori[0];
			
			if(valori.length>1)
				result[1]=valori[1];
			
			if(valori.length>2)
				result[2]=valori[2];
			
		}

		return result;

	}

	public String[] checkRisultatiPs() throws SQLException, Exception{

		String result[]={"N","0"};
		String outVal="";


		outVal=bReparti.getValue(reparto,"VISUALIZZATORE_DATI_PS");
		String[] valori= new String[2];
		if (outVal!=null){
			valori= outVal.split("#");
			if(valori.length>0){
				result[0]=valori[0];
			}
			if(valori.length>1){
				result[1]=valori[1];
			}

		}

		return result;

	}

	public static String apici(String tmpVal){
		tmpVal = tmpVal.replaceAll("'","''");

		return tmpVal;
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
