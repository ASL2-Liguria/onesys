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
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classImgHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Array;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Iterator;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import oracle.jdbc.OracleCallableStatement;
import oracle.sql.ARRAY;
import oracle.sql.ArrayDescriptor;
import oracle.sql.CLOB;

import org.apache.ecs.Doctype;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocumentLab.listDocumentLabEngine;
import core.database.UtilityLobs;

public class listDocumentLaboratorioGriglia extends servletEngine
{
	private String idPaziente 		= new String("");
	private String nosologico 		= new String("");
	private String daData 			= new String("");
	private String aData 			= new String("");
	private String provRisultati 	= new String("");
	private String elencoEsami 		= new String("");
	private String reparto 			= new String("");
	private String idenRichiesta 	= new String("");
	private String provChiamata 	= new String("");
	private String errorProcedure 	= new String("");
	private String encoding 		= new String("utf-8");;

	String URI;
    String uriSS;
    String MIMETYPE;
    Connection conn;
    String numRicIn="";
    String htmlButtonStampa;
    String htmlLblProvenienza;
    String htmlLblEsami;    
    String htmlFiltroData;
    String numRichieste				= new String("");

    classFormHtmlObject cFormDati 	= null;
    classInputHtmlObject cInput 	= null;
    ArrayList<String> idenRichieste;
    
    private ElcoLoggerInterface logInterface =  new ElcoLoggerImpl(listDocumentLabEngine.class);
    
    classImgHtmlObject cImgGraf 	= null;
    
    String classTd					= "";
    String datiPs []				= null;
	
    ServletContext cContext;
    HttpSession session				= null;


    public listDocumentLaboratorioGriglia(ServletContext pCont,HttpServletRequest pReq){
        super(pCont,pReq);
        this.bReparti = super.bReparti;//Global.getReparti(pReq.getSession());
        
    }    

@Override
protected String getBody(){	
	
	try {
		super.setDocType(Doctype.XHtml10Transitional.class);
	}catch (InstantiationException e1) {
		// TODO Auto-generated catch block
		e1.printStackTrace();
	} catch (IllegalAccessException e1) {
		// TODO Auto-generated catch block
		e1.printStackTrace();
	}
	String sOut 					= new String("");
    classTableHtmlObject cTable 	= null;
    classTableHtmlObject datiTable	= null;
    classTableHtmlObject leftTable	= null;   
    classRowDataTable cRow 			= null;
    classColDataTable cCol 			= null;
    classDivHtmlObject cDiv 		= null;
    classDivHtmlObject cDivMain 	= null;

    Iterator iterator				= null;
    Iterator iteratorGruppi			= null;
    Iterator iteratorEsami			= null;
    org.jdom.Document xml			= null;
    
    ArrayList<String> alAnalisi 	= new ArrayList<String>();
    ArrayList<String> idenRichieste = new ArrayList<String>();
    
    String nosologici				= "";
    int contCol						= 0;
    String button []				= null;
    String classCss;
    String tipoAnalisi				= "";          
	try{
		
		readDati();  
		datiPs				= checkRisultatiPs();
		//htmlNumRichieste	= getOptionRichieste();
		xml 				= getXml();
	
		if(provChiamata.equals("MMG"))
			super.BODY.addAttribute("class", "bodyMMG");
		else if(provChiamata.equals("AMBULATORIO"))
			super.BODY.addAttribute("class", "bodyAmbulatorio");
		else
			super.BODY.addAttribute("class", "bodyCartella");
		    		
	}catch (Exception e){

		sOut = e.getMessage();
		logInterface.error(e.getMessage(), e);
	} 
    
		//Procedura in Errore
    	if (errorProcedure != null){
    		cDiv = new classDivHtmlObject("divNull","","Procedura In Errore: " + errorProcedure);
    		sOut = cDiv.toString();
    	}
    	else
    	{		
		    if ( !xml.getRootElement().getChild("ANALISI").getChildren().iterator().hasNext()){
		    	cDiv = new classDivHtmlObject("divNull","","Nessun dato strutturato di laboratorio presente");
		    	sOut += cDiv.toString();
		    }
			else{
			 
				cDivMain = new classDivHtmlObject("divMain"); 
				cDiv = new classDivHtmlObject("divMenu");
				classDivHtmlObject cHeader = new classDivHtmlObject("divHeader");
				
				// Creo Form Dati Generici
				cFormDati = new classFormHtmlObject("formDatiLabo","","");
				cFormDati.addAttribute("id","formDatiLabo");
				
				cInput = new classInputHtmlObject("hidden","datiPs",datiPs[0]);
				cInput.addAttribute("id","datiPs");
				cFormDati.appendSome(cInput);
		        
		        cInput = new classInputHtmlObject("hidden","datiPsGiorni",datiPs[1]);
		        cInput.addAttribute("id","datiPsGiorni");
		        cFormDati.appendSome(cInput);
		         
		        Element datiConf=xml.getRootElement().getChild("DATICONF");
		        cInput = new classInputHtmlObject("hidden","dataMinima",datiConf.getChildText("DATAMINIMA"));
		        cInput.addAttribute("id","dataMinima");
		        cFormDati.appendSome(cInput);
		        
		        cInput = new classInputHtmlObject("hidden","codProRep",datiConf.getChildText("COD_PRO_REP"));
		        cInput.addAttribute("id","codProRep");
		        cFormDati.appendSome(cInput);
		        
		        Element datiAnag =datiConf.getChild("DATIANAG");
		    	cInput = new classInputHtmlObject("hidden","cognome",datiAnag.getAttributeValue("COGNOME"));
		    	cInput.addAttribute("id","cognome");
		    	cFormDati.appendSome(cInput);
		        
		        cInput = new classInputHtmlObject("hidden","nome",datiAnag.getAttributeValue("NOME"));
		        cInput.addAttribute("id","nome");
		        cFormDati.appendSome(cInput);
		        
		        cInput = new classInputHtmlObject("hidden","codfisc",datiAnag.getAttributeValue("CODFISC"));
		        cInput.addAttribute("id","codfisc");
		        cFormDati.appendSome(cInput);
		        
		        cInput = new classInputHtmlObject("hidden","sesso",datiAnag.getAttributeValue("SESSO"));
		        cInput.addAttribute("id","sesso");
		        cFormDati.appendSome(cInput);
		        
		        cInput = new classInputHtmlObject("hidden","datanasc",datiAnag.getAttributeValue("DATANASC"));
		        cInput.addAttribute("id","datanasc");
		        cFormDati.appendSome(cInput);
		        
		        cDivMain.appendSome(cFormDati.toString());
		        
				try 
				{					
					button 				= checkButton();
					
					cTable = new classTableHtmlObject();
					
					cTable.addAttribute("id","tabIntestazione");

					cRow = new classRowDataTable(); 
					
					// Nosologici per Grafici
					Element itemNos = xml.getRootElement().getChild("NOSOLOGICI");
					nosologici		= itemNos.getValue();
					
					// 	Div Intestazione Esami (ESAME,VAL MIN, VAL MAX...)   
					cCol = new classColDataTable("TD","","&nbsp;"); 
					cCol.addAttribute("class", "colGraf");
					cRow.addCol(cCol);

					cCol = new classColDataTable("TD","","ESAME");
					cCol.addAttribute("class", "colEsameIntestazione");
					cRow.addCol(cCol);  

					cCol = new classColDataTable("TD","","V.MIN");
					cCol.addAttribute("class", "colValMin");
					cRow.addCol(cCol); 
					
					cCol = new classColDataTable("TD","","V.MAX");
					cCol.addAttribute("class", "colValMax");
					cRow.addCol(cCol);  

					// Configuro Visualizzazione UM
					if(button.length > 2 && button[2] != null && button[2].equals("S") ){
						cCol = new classColDataTable("TD","","U.M.");
						cCol.addAttribute("class", "colUnMis");
						cRow.addCol(cCol);
					}
					cTable.appendSome(cRow.toString()); 
					cDiv = new classDivHtmlObject("divBloc");      
					
					cDiv.appendSome(cTable);     
					cDivMain.appendSome(cDiv.toString());


					// div di intestazione delle richieste #############      
					contCol=6;

					cTable 	= new classTableHtmlObject();
					cTable.addAttribute("id","tabIntestazioneRisultati");
					cRow 	= new classRowDataTable(); 
					iterator=xml.getRootElement().getChild("ANALISI").getChildren().iterator();

					while (iterator.hasNext()){
						
						Element item = (Element)iterator.next();
						alAnalisi.add(item.getName());
						
						if (item.getAttributeValue("tipo").equals("LAB"))
							idenRichieste.add(item.getAttributeValue("IDEN_RICHIESTA"));
						
						cCol	= new classColDataTable("TD","",item.getAttributeValue("data").substring(6, 8)+"/"+item.getAttributeValue("data").substring(4, 6)+"/"+ item.getAttributeValue("data").substring(0, 4)+"<BR>"+ item.getAttributeValue("ora"));

						if(item.getAttributeValue("codcdc").equals(reparto))
							classCss="tdInt";						
						else						
							classCss="tdIntAltriRep";
						
						if(item.getAttributeValue("tipo").equals("LAB")){
							classCss+=" link";
							cCol.addAttribute("onClick","javascript:NS_DATI_LABO_GRIGLIA.UTILS.apriReferto("+item.getAttributeValue("IDEN_RICHIESTA")+")");
							cCol.addAttribute("title","Apri documento");
						}
						cCol.addAttribute("class", classCss);	  
						cCol.addAttribute("DATA_RICHIESTA", item.getAttributeValue("data"));
						cCol.addAttribute("IDEN_RICHIESTA", item.getAttributeValue("IDEN_RICHIESTA"));
						cCol.addAttribute("DESCRPROV", item.getAttributeValue("descrprov"));
						cRow.addCol(cCol);     
						contCol+=1;

					}

					cTable.appendSome(cRow.toString());

					cDiv = new classDivHtmlObject("divInt");
					cTable.addAttribute("width", String.valueOf(alAnalisi.size()*100)+"px");
					cDiv.appendSome(cTable.toString());  
					cDivMain.appendSome(cDiv.toString());
					//	fine div di intestazione delle richieste ###################     


				}
				catch (Exception e) {
					super.BODY.setOnLoad("setVisible();");
					sOut = e.getMessage();
					logInterface.error(e.getMessage(), e);
				} 

				// Creo le Tabelle Wrapper di Esami e Risultati
				datiTable = new classTableHtmlObject();    
				datiTable.addAttribute("id","datiTable");

				leftTable = new classTableHtmlObject();
				leftTable.addAttribute("id","tabellaLeft");

				try{    	  
					// Gruppi
					Iterator iterGruppi = xml.getRootElement().getChild("ESAMI").getChildren().iterator();
					while (iterGruppi.hasNext()){   	

						// Add Intestazione Gruppo Tabella Esami
						Element itemGruppo	= (Element)iterGruppi.next();
						cRow = new classRowDataTable();
						cRow.addAttribute("class", "rigaGruppo");
						
						if (itemGruppo.getAttributeValue("DESCR_GRUPPO") != null && !itemGruppo.getAttributeValue("DESCR_GRUPPO").trim().equalsIgnoreCase("")){
							cCol = new classColDataTable("TD","",itemGruppo.getAttributeValue("DESCR_GRUPPO"));
							cCol.addAttribute("class", "tdGruppo");
						}
						else
							cCol = new classColDataTable("TD","","&nbsp");	
						
						cCol.addAttribute("colspan", String.valueOf(6));
						cRow.addCol(cCol);    	
						leftTable.appendSome(cRow.toString());

						// Add Riga Vuotoa Intestazione Gruppo Risultati
						cRow = new classRowDataTable();
						cRow.addAttribute("class", "rigaGruppo");
						cCol = new classColDataTable("TD","","&nbsp");
						cCol.addAttribute("colspan", String.valueOf(contCol));
						cRow.addCol(cCol);    	
						datiTable.appendSome(cRow.toString());

						// Analisi Multiple   	  
						Iterator iteratorAnalisiMulti	= itemGruppo.getChildren().iterator();  
						while (iteratorAnalisiMulti.hasNext()){

							Element itemAnalisiMulti = (Element)iteratorAnalisiMulti.next();
							if (itemAnalisiMulti.getAttributeValue("ATTIVO").equalsIgnoreCase("S")){
								
								// Riga Intestazione Esami
								cRow = new classRowDataTable();
								cRow.addAttribute("class", "rigaAnalisiMulti");
								cCol = new classColDataTable("TD","",itemAnalisiMulti.getAttributeValue("DESCR"));
								cCol.addAttribute("colspan", String.valueOf(6));
								cCol.addAttribute("codiceEsame",itemAnalisiMulti.getAttributeValue("IDESAMEMULTIPLO"));								
								cRow.addCol(cCol);
								leftTable.appendSome(cRow.toString());
								
								// Riga Vuota Tabella Risultati
								cRow = new classRowDataTable();
								cRow.addAttribute("class", "rigaAnalisiMulti");
								cCol = new classColDataTable("TD","","&nbsp");
								cCol.addAttribute("colspan", String.valueOf(contCol));
								cRow.addCol(cCol); 
								datiTable.appendSome(cRow.toString());								
								
								tipoAnalisi	= "S";
								
							}else{
								tipoAnalisi	= "M";
							}
							
							iteratorEsami	= itemAnalisiMulti.getChildren().iterator();
							while (iteratorEsami.hasNext()){
								
								cRow = new classRowDataTable();								
								cRow.addAttribute("class", "rigaEsame");
								
								Element itemEsame = (Element)iteratorEsami.next();                 
								
								// Add Icona Grafico
								cCol = new classColDataTable("TD","","");
								cCol.addAttribute("class", "colGraf");
								cCol.addAttribute("onClick", "javascript:NS_DATI_LABO_GRIGLIA.UTILS.grafLabWhale(this);");
								
								if (itemEsame.getAttributeValue("CODICEESA")!=null && !itemEsame.getAttributeValue("CODICEESA").equalsIgnoreCase(""))
									cCol.addAttribute("codiceEsame",itemEsame.getAttributeValue("CODICEESA"));
								else
									cCol.addAttribute("codiceEsame",itemEsame.getName().substring(5,itemEsame.getName().length()));
	
								// Richiesta Singola Il Grafico Non Serve
								cCol.addAttribute("idenRichiesta",idenRichiesta);
								cCol.addAttribute("elencoNosologici",nosologici);
								cCol.addAttribute("idPaziente",idPaziente);
								cCol.addAttribute("materiale",super.chkNull(itemEsame.getAttributeValue("CODICE_MATERIALE")));
								cCol.addAttribute("provenienza",super.chkNull(itemEsame.getAttributeValue("PROVENIENZA")));
								
								classDivHtmlObject  grafDiv = new classDivHtmlObject("","","&nbsp");
								grafDiv.addAttribute("class", "imageGraf");
								cCol.appendSome(grafDiv.toString()); 
	
								cRow.addCol(cCol);
								
								if (tipoAnalisi.equalsIgnoreCase("S")){									
									cCol = new classColDataTable("TD","","- " + itemEsame.getAttributeValue("DESCR") +" "+super.chkNull(itemEsame.getAttributeValue("MATERIALE"))+ " "+ super.chkNull(itemEsame.getAttributeValue("PROVENIENZA")) + " " + super.chkNull(itemEsame.getAttributeValue("DATA_PRELIEVO")) );
									cCol.addAttribute("class", "colEsameSingolo");
								}else{									
									cCol = new classColDataTable("TD","",itemEsame.getAttributeValue("DESCR") +" "+super.chkNull(itemEsame.getAttributeValue("MATERIALE"))+ " " + super.chkNull(itemEsame.getAttributeValue("PROVENIENZA")) + " " + super.chkNull(itemEsame.getAttributeValue("DATA_PRELIEVO")) );
									cCol.addAttribute("class", "colEsameMultiplo");
								}

								cRow.addCol(cCol);
	
								cCol = new classColDataTable("TD","",itemEsame.getAttributeValue("VALORERIFMIN"));
								cCol.addAttribute("class", "colValMin");
								cRow.addCol(cCol);
								cCol = new classColDataTable("TD","",itemEsame.getAttributeValue("VALORERIFMAX"));
								cCol.addAttribute("class", "colValMax");
								cRow.addCol(cCol);
	
								if(button.length>2 && button[2] != null && button[2].equals("S") ){
									cCol = new classColDataTable("TD","",itemEsame.getAttributeValue("UNMISURA"));
									cCol.addAttribute("class", "colUnMis");
									cRow.addCol(cCol);
								}
								leftTable.appendSome(cRow.toString());
	
								//per ogni esame ciclo l'elenco delle richieste ...creo una nuova riga e la inserisco nel div dei dati
								cRow = new classRowDataTable();
								cRow.addAttribute("class", "rigaEsame");
								
								for (int i=0;i<alAnalisi.size();i++)
								{
									Element itemRichiesta=itemEsame.getChild(alAnalisi.get(i));
	
									classTd="";
									//se è presente la richiesta per lo specifico esame inserisco il risultato nella colonna specifica
									if (itemRichiesta != null){
										cCol = new classColDataTable("TD","",itemRichiesta.getValue()); 
										cCol.addAttribute("title",itemRichiesta.getAttributeValue("RISULTATOESAMELUNGO"));
										cCol.addAttribute("GERMI",super.chkNull(itemRichiesta.getAttributeValue("GERMI")));
										cCol.addAttribute("RICHIESTA",super.chkNull(itemRichiesta.getAttributeValue("IDEN_RICHIESTA")));
										cCol.addAttribute("PROGRANALISI",super.chkNull(itemRichiesta.getAttributeValue("PROGRANALISI")));
										cCol.addAttribute("PROGRANALISIPR",super.chkNull(itemRichiesta.getAttributeValue("PROGRANALISIPR")));
	
	
										if (itemRichiesta.getAttributeValue("RISULTATOESAMELUNGO")!=null && !itemRichiesta.getAttributeValue("RISULTATOESAMELUNGO").equals("") )
											classTd=" classTitle ";
	
										if (itemRichiesta.getAttributeValue("COLORE") !=null && !itemRichiesta.getAttributeValue("COLORE").equals("") ){
	
											if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("BLUE")){
	
												if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8"))        
													cCol.addAttribute("style","COLOR:blue; FONT-WEIGHT:BOLD;  background:#DCE0E0;");
												else
													cCol.addAttribute("style","COLOR:blue; FONT-WEIGHT:BOLD; ");
											}else if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("RED")){
	
												if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8"))
													cCol.addAttribute("style","COLOR:red; FONT-WEIGHT:BOLD;  background:#DCE0E0;");
												else
													cCol.addAttribute("style","COLOR:red; FONT-WEIGHT:BOLD; ");
												
											}
										}else if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8"))
											cCol.addAttribute("style","background:#DCE0E0;"); 
	
										if(itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")){
											if (classTd.equals(""))
												classTd="colDati"; 
											else
												classTd+=" colDati"; 		 
										}
	
										if(!itemRichiesta.getAttributeValue("GERMI").equalsIgnoreCase("0")){
											if (classTd.equals(""))
												classTd="datiMicrobiologia"; 
											else
												classTd+=" datiMicrobiologia";
										}
	
										if (!classTd.equals(""))
											cCol.addAttribute("class", classTd); 
	
										cRow.addCol(cCol);    		  
									
									}else{	
										// Cella Vuota
										cCol = new classColDataTable("TD","","&nbsp");
										if (classTd.equals(""))
											classTd="colDati"; 
										else
											classTd+=" colDati"; 
	
										if (!classTd.equals(""))
											cCol.addAttribute("class", classTd); 
	
										cRow.addCol(cCol);      		  
									}
								}
	
								datiTable.appendSome(cRow.toString());	
	
							}
						}
					}            

				}    
				catch (Exception e) {
					super.BODY.setOnLoad("setVisible();");
					sOut = e.getMessage();
					logInterface.error(e.getMessage(), e);
				}
				classDivHtmlObject cDivWrapperDati =  new classDivHtmlObject("divWrapper");      
				
				cDiv = new classDivHtmlObject("divLeft");      
				cDiv.appendSome(leftTable.toString());

				cDivWrapperDati.appendSome(cDiv.toString());
				
				cDiv = new classDivHtmlObject("divDati"); 
				datiTable.addAttribute("width", String.valueOf(alAnalisi.size()*100)+"px");
				cDiv.appendSome(datiTable.toString());

				cDivWrapperDati.appendSome(cDiv.toString());
      
				cDiv.addEvent("onScroll", "javascript:divInt.scrollLeft=divDati.scrollLeft;divLeft.scrollTop=divDati.scrollTop;");
				
				cDivMain.appendSome(cDivWrapperDati.toString());
      
				sOut += cDivMain.toString();
  
			}
		    
	 
		    // Esiti Consultati
		    if (idenRichiesta.equals(""))
		    	controllaDocumentiVisionati(idenRichieste);
      
    	} 
      
    	return sOut; 
  }


 
private void readDati() {

	this.idPaziente 		= this.cParam.getParam("idPatient").trim();
	this.elencoEsami 		= this.cParam.getParam("elencoEsami").trim();     
	this.reparto 			= this.cParam.getParam("reparto").trim();     
	this.nosologico 		= this.cParam.getParam("nosologico").trim();
	this.idenRichiesta 		= this.cParam.getParam("idenRichiesta").trim();	
	this.numRichieste		= this.cParam.getParam("numRichieste").trim();
	this.provRisultati		= this.cParam.getParam("provRisultati").trim();
	this.provChiamata		= this.cParam.getParam("provChiamata").trim();
	this.aData 				= this.cParam.getParam("aData").trim();
	this.daData				= this.cParam.getParam("daData").trim();
}
  
  
public org.jdom.Document getXml() throws SQLException, SqlQueryException{
	
	String sStat 					= new String("");
	OracleCallableStatement cs    	= null;
	org.jdom.Document docXml		= null;

	baseUser utente 				= this.fDB.bUtente;
	ArrayList listaReparti 			= utente.listaReparti;
	String sa						= utente.CDC_UTENTE;
    CLOB myLob                      = null;
  	
	if (reparto!=null && reparto.equals(""))
		reparto=(String) listaReparti.get(0);	

	try {   

		sStat 	= "{ call GET_XML_ESAMI_LABO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) }";
		cs		= (OracleCallableStatement) this.fDB.getConnectData().prepareCall(sStat);

		cs.setString(1,reparto);
		cs.setString(2,nosologico);
		cs.setString(3,idenRichiesta);
		cs.setString(4, idPaziente);
		cs.setString(5, numRichieste);
		
		if(datiPs[0].equals("S") && idenRichiesta.equals(""))
			cs.setString(6,datiPs[1]);
		else
			cs.setString(6,null); 

		cs.setString(7,daData);
		cs.setString(8,aData);
		cs.setString(9,elencoEsami);
		cs.setString(10,provRisultati);
		cs.setString(11,provChiamata);
		cs.registerOutParameter(12, Types.CLOB);
		cs.registerOutParameter(13, Types.VARCHAR);


		cs.executeUpdate();

		logInterface.warn("fine GET_XML_ESAMI_LABO");

		myLob           = cs.getCLOB(12);
		errorProcedure	= cs.getString(13);
		
		InputStream is =myLob.getAsciiStream();

		if (errorProcedure!=null && !errorProcedure.equals(""))
			throw new Exception(errorProcedure);		

		SAXBuilder builder = new SAXBuilder();
		docXml = builder.build(new InputStreamReader(is, "ISO-8859-1")) ;

	}catch (Exception e) {
		logInterface.error(e.getMessage(), e);
	}
	finally{
		try{
			cs.close();
			cs = null;
            UtilityLobs.freeClob(myLob);
		}catch (SQLException e){
			logInterface.error(e.getMessage(), e);
		}
	}
	return docXml;
   
  }
  
  
public void controllaDocumentiVisionati(ArrayList<String> idenRich){

	String            sStat = new String("");
	CallableStatement cs    = null;

	try {   
		Array oraIdenRichieste = new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", this.fDB.getConnectData()), this.fDB.getConnectData(), idenRich.toArray());

		baseUser utente = this.fDB.bUtente;

		sStat 	= "{ call CC_LABO_CONFERMA_LETTURA(?, ?, ?) }";
		cs		= this.fDB.getConnectData().prepareCall(sStat);

		cs.setInt(1,utente.iden_per);
		cs.setArray(2,oraIdenRichieste);
		cs.registerOutParameter(3, Types.VARCHAR);      
		cs.executeUpdate();          
		
		String error = cs.getString(3);

		if (error!=null && !error.equals(""))
			throw new Exception(error);		

	}catch(Exception e){
		logInterface.error(e.getMessage(), e);
	}
	finally{
		try {
			cs.close();
			cs = null;
		} catch (SQLException e) {
			logInterface.error(e.getMessage(), e);
		}

	}

}

public String[] checkButton() throws SQLException, Exception{

	String result[]	= {"S","S","N"};
	String outVal	= bReparti.getValue(reparto,"VISUALIZZATORE_BUTTON_LABO");

	String[] valori	= new String[3];
	
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
