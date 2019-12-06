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
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Iterator;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import oracle.jdbc.OracleCallableStatement;
import oracle.sql.CLOB;

import org.apache.ecs.Doctype;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocumentLab.listDocumentLabEngine;
import core.database.UtilityLobs;

public class listDocumentLaboratorioLettera extends servletEngine
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

    public listDocumentLaboratorioLettera(ServletContext pCont,HttpServletRequest pReq){
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
   
    classRowDataTable cRow 				= null;
    classRowDataTable cRowGruppo		= null;
    classRowDataTable cRowEsame			= null;
    classRowDataTable cRowEsameMulti	= null;
    classRowDataTable cRowNoDatiLabo	= null;
    classColDataTable cCol 				= null;
    classColDataTable cColGruppo 		= null;
    classColDataTable cColEsame 		= null;
    classColDataTable cColEsameMulti	= null;
    classColDataTable cColNoDatiLabo	= null;
    
    classInputHtmlObject inputTestata 	= null;
    classInputHtmlObject inputEsame 	= null;

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
		xml 				= getXml();
	
		super.BODY.addAttribute("class", "bodyCartella");
		    		
	}catch (Exception e){

		sOut = e.getMessage();
		logInterface.error(e.getMessage(), e);
	} 
    
		//Procedura in Errore
    	if (errorProcedure != null){
    		
    		cTable = new classTableHtmlObject();					
			cTable.addAttribute("id","tabNoDatiLabo");

			cRowNoDatiLabo = new classRowDataTable();
			cRowNoDatiLabo.addAttribute("id","trNoDatiLabo");
			
			cColNoDatiLabo = new classColDataTable("TD","","Procedura in Errore");
			cColNoDatiLabo.addAttribute("id","tdNoDatiLabo");
			
			cRowNoDatiLabo.addCol(cColNoDatiLabo);
			cTable.appendSome(cRowNoDatiLabo.toString());
			
    	}
    	else
    	{		
		    if (!xml.getRootElement().getChild("ANALISI").getChildren().iterator().hasNext()){
		    	
		    	cTable = new classTableHtmlObject();					
				cTable.addAttribute("id","tabNoDatiLabo");

				cRowNoDatiLabo = new classRowDataTable();
				cRowNoDatiLabo.addAttribute("id","trNoDatiLabo");
				
				cColNoDatiLabo = new classColDataTable("TD","","Nessun dato strutturato di laboratorio presente");
				cColNoDatiLabo.addAttribute("id","tdNoDatiLabo");
				
				cRowNoDatiLabo.addCol(cColNoDatiLabo);
				cTable.appendSome(cRowNoDatiLabo.toString());

		    }
			else{

				
				try 
				{					
					button 				= checkButton();
					
					cTable = new classTableHtmlObject();					
					cTable.addAttribute("id","tabRisultatiLabo");

					cRow = new classRowDataTable();
					cRow.addAttribute("id","head");
					
					// Carico Nosologici per Grafici
					Element itemNos = xml.getRootElement().getChild("NOSOLOGICI");
					nosologici		= itemNos.getValue();
					
					// 	TD Check All
					cCol = new classColDataTable("TH","","<input type='checkbox' checked id='checkAll' onclick='DATI_STRUTTURATI_ALLEGA.de_seleziona_all(this)'/> <label for='checkAll'>Tutti</label>"); 
					cCol.addAttribute("id","thIntEsame");
					cRow.addCol(cCol);
					
					// div di intestazione delle richieste #############      
					contCol=6;
					iterator	= xml.getRootElement().getChild("ANALISI").getChildren().iterator();
					
					while (iterator.hasNext()){
						
						Element item = (Element)iterator.next();
						alAnalisi.add(item.getName());
						
						if (item.getAttributeValue("tipo").equals("LAB"))
							idenRichieste.add(item.getAttributeValue("IDEN_RICHIESTA"));
						
						cCol	= new classColDataTable("TH","","<input type='checkbox' id='R" + item.getAttributeValue("IDEN_RICHIESTA")+ "' class='chkIdenTestata' iden_testata='" + item.getAttributeValue("IDEN_RICHIESTA") + "' /><label class='lblCheckRichiestaPrestazione'> " + item.getAttributeValue("data").substring(6, 8)+"/"+item.getAttributeValue("data").substring(4, 6)+"/"+ item.getAttributeValue("data").substring(0, 4)+"</label>");
						
						if(item.getAttributeValue("codcdc").equals(reparto))
							classCss="thInt";						
						else						
							classCss="thIntAltriRep";
						
						cCol.addAttribute("class", classCss);	  
						cCol.addAttribute("IDEN_RICHIESTA", item.getAttributeValue("IDEN_RICHIESTA"));
						cCol.addAttribute("DESCRPROV", item.getAttributeValue("descrprov"));
						cRow.addCol(cCol);     
						contCol+=1;

					}

					cCol = new classColDataTable("TH","","<label>V.MIN</label>");
					cCol.addAttribute("class", "colValMinInt colIntestazione");
					cRow.addCol(cCol); 
					
					cCol = new classColDataTable("TH","","<label>V.MAX</label>");
					cCol.addAttribute("class", "colValMaxInt colIntestazione");
					cRow.addCol(cCol);  

					cCol = new classColDataTable("TH","","<label>U.M.</label>");
					cCol.addAttribute("class", "colUnMisInt colIntestazione");
					cRow.addCol(cCol);
					
					cTable.appendSome(cRow.toString());

					//	fine div di intestazione delle richieste ###################     


				}
				catch (Exception e) {
					super.BODY.setOnLoad("setVisible();");
					sOut = e.getMessage();
					logInterface.error(e.getMessage(), e);
				} 

				try{    	  
					// Ciclo per Gruppo
					int numrichieste 	= xml.getRootElement().getChild("ANALISI").getContentSize();
					Iterator iterGruppi = xml.getRootElement().getChild("ESAMI").getChildren().iterator();
					
					while (iterGruppi.hasNext()){   	

						// Add Intestazione Gruppo Tabella Esami
						Element itemGruppo	= (Element)iterGruppi.next();
						cRowGruppo = new classRowDataTable();
						cRowGruppo.addAttribute("class", "gruppoEsami");
						
						if (itemGruppo.getAttributeValue("DESCR_GRUPPO") != null && !itemGruppo.getAttributeValue("DESCR_GRUPPO").trim().equalsIgnoreCase("")){
							cColGruppo = new classColDataTable("TH","",itemGruppo.getAttributeValue("DESCR_GRUPPO"));
							cColGruppo.addAttribute("colspan",  ""+(numrichieste + 4)+"" );
						}	

						cRowGruppo.addCol(cColGruppo);    	
						cTable.appendSome(cRowGruppo.toString());
						
						// Analisi Multiple   	  
						Iterator iteratorAnalisiMulti	= itemGruppo.getChildren().iterator();  
						while (iteratorAnalisiMulti.hasNext()){

							Element itemAnalisiMulti = (Element)iteratorAnalisiMulti.next();
							if (itemAnalisiMulti.getAttributeValue("ATTIVO").equalsIgnoreCase("S")){
								

								cRowEsameMulti = new classRowDataTable();
								cRowEsameMulti.addAttribute("class", "rigaAnalisiMulti");
								cColEsameMulti = new classColDataTable("TD","",itemAnalisiMulti.getAttributeValue("DESCR"));
								cColEsameMulti.addAttribute("colspan", String.valueOf(contCol));
								cColEsameMulti.addAttribute("codiceEsame",itemAnalisiMulti.getAttributeValue("IDESAMEMULTIPLO"));								
								cRowEsameMulti.addCol(cColEsameMulti);
								cTable.appendSome(cRowEsameMulti.toString());
								
								tipoAnalisi	= "S";
								
							}else{
								tipoAnalisi	= "M";
							}							
							
							
							// Ciclo Ogni Esame Per Gruppo   	  
							iteratorEsami	= itemAnalisiMulti.getChildren().iterator();
							while (iteratorEsami.hasNext()){
	
								cRowEsame = new classRowDataTable();
								cRowEsame.addAttribute("class", "rigaEsame");
								Element itemEsame = (Element)iteratorEsami.next();                    
								
								
								cColEsame = new classColDataTable("TH","","<input type='checkbox' id='" + itemEsame.getAttributeValue("IDEN_TAB_ESA") + "' cod_dec='" + itemEsame.getAttributeValue("CODICEESA") + "' class='chkIdEsameSingolo' /><label class='lblCheckRichiestaPrestazione'>"+ itemEsame.getAttributeValue("DESCR") +" "+super.chkNull(itemEsame.getAttributeValue("MATERIALE"))+" "+super.chkNull(itemEsame.getAttributeValue("PROVENIENZA")) + "</label>");
								
								
								if (tipoAnalisi.equalsIgnoreCase("S"))									
									cColEsame.addAttribute("class", "colEsameSingolo");
								else									
									cColEsame.addAttribute("class", "colEsameMultiplo");								
	
								cRowEsame.addCol(cColEsame);
								
								for (int i=0;i<alAnalisi.size();i++)
								{
									Element itemRichiesta=itemEsame.getChild(alAnalisi.get(i));	
									
									// Controllo iden_richiesta del Risultato. Se Corrisponde alla posizione alAnalisi.get(i) Lo Inserisco
									if (itemRichiesta != null){
										cColEsame = new classColDataTable("TD","",itemRichiesta.getValue()); 
										
										cColEsame.addAttribute("ID_WHALE",super.chkNull(itemRichiesta.getAttributeValue("IDEN_RICHIESTA")));
										
										if (itemRichiesta.getAttributeValue("COLORE") !=null && !itemRichiesta.getAttributeValue("COLORE").equals("") ){
	
											if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("BLUE")){
	
												if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8"))        
													cColEsame.addAttribute("style","COLOR:blue; FONT-WEIGHT:BOLD;  background:#DCE0E0;");
												else
													cColEsame.addAttribute("style","COLOR:blue; FONT-WEIGHT:BOLD; ");
												
											}else if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("RED")){
	
												if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8"))
													cColEsame.addAttribute("style","COLOR:red; FONT-WEIGHT:BOLD;  background:#DCE0E0;");
												else
													cColEsame.addAttribute("style","COLOR:red; FONT-WEIGHT:BOLD; ");											
											}
										}else if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")){
											cColEsame.addAttribute("style","background:#DCE0E0;"); 
										}
										
										if(!itemRichiesta.getAttributeValue("GERMI").equalsIgnoreCase("0")){
											if (classTd.equals(""))
												classTd+=" datiMicrobiologia";
										}
	
										cRowEsame.addCol(cColEsame);    		  
									}								
									else{	
										
										// Add Colonna Vuota
										cColEsame = new classColDataTable("TD","","&nbsp");
										cRowEsame.addCol(cColEsame);      		  
									}
								}
	
								cColEsame = new classColDataTable("TD","",itemEsame.getAttributeValue("VALORERIFMIN")+"&nbsp;");
								cColEsame.addAttribute("class", "colValMin");
								cRowEsame.addCol(cColEsame);
								
								cColEsame = new classColDataTable("TD","",itemEsame.getAttributeValue("VALORERIFMAX")+"&nbsp;");
								cColEsame.addAttribute("class", "colValMax");
								cRowEsame.addCol(cColEsame);
	
								cColEsame = new classColDataTable("TD","",itemEsame.getAttributeValue("UNMISURA").replace("µ", "&#956;")+"&nbsp;");
								cColEsame.addAttribute("class", "colUnMis");
								cRowEsame.addCol(cColEsame);
								
								cTable.appendSome(cRowEsame.toString());
								
							}
						}
					}            

				}catch (Exception e) {
					
					sOut = e.getMessage();
					logInterface.error(e.getMessage(), e);
				}			
  
			}
		    
		    sOut += cTable.toString();
      
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
