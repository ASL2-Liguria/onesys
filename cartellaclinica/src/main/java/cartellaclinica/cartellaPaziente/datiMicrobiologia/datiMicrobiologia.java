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
package cartellaclinica.cartellaPaziente.datiMicrobiologia;

import generic.servletEngine;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import it.elco.json.actions.Marshall;
import it.elco.whale.converters.MapFactory;
import it.elco.whale.privacy.datiLaboratorio.datiLaboratorioPrivacy;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import oracle.jdbc.OracleCallableStatement;
import oracle.sql.CLOB;

import org.apache.ecs.Doctype;
import org.jdom.Attribute;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.json.JSONException;

import cartellaclinica.cartellaPaziente.datiStrutturatiLabo.listDocumentLaboratorioGriglia;
import core.database.UtilityLobs;

public class datiMicrobiologia extends servletEngine {

    private String daData = new String("");
    private String aData = new String("");
    private String idPatient = new String("");
    private String nosologico = new String("");
    private String modalita = new String("");
    private String reparto = new String("");
    private String errorProcedure = new String("");
    CLOB myLob;

    classFormHtmlObject cFormDati = null;
    classInputHtmlObject cInput = null;
    ArrayList<String> idenRichieste;

    private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(datiMicrobiologia.class);

    String classTd = "";
    String datiPs[] = null;
    Map<String, Object> map_configurazione_privacy;
    Map<String, Object> map_configurazione_privacy_micro;
    
    public datiMicrobiologia(ServletContext pCont, HttpServletRequest pReq) {
        super(pCont, pReq);
    }

    @Override
	protected String getBody() {

        classDivHtmlObject cDiv = null;
        org.jdom.Document xml = null;
        Iterator iterator = null;
        Iterator iterRisultati = null;
        Element item = null;
        Element itemRis = null;
        int cont = 0;
        int contAnti = 1;
        int posAnti = 1;
        HashMap<String, Integer> hashAnti = null;
        String divRis = "";
        String th = "";
        String classCss = "";

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
        try {

            readDati();

        } catch (Exception e) {

            sOut = e.getMessage();
            logInterface.error(e.getMessage(), e);
        }
        
        Map<String, Object> map_configurazioni = null;
        try {
            map_configurazioni = MapFactory.fromJSonString(bReparti.getValue(reparto, "CONFIG_DATI_STRUTTURATI_LABO_MICRO"));
        } catch (JSONException ex) {
            Logger.getLogger(datiMicrobiologia.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex){
            Logger.getLogger(datiMicrobiologia.class.getName()).log(Level.SEVERE, null, ex);        	
        }

//        this.map_configurazione_privacy = (Map<String, String>) ((List<Map<String, String>>) map_configurazioni.get("PRIVACY")).get(0);
//      Configurazione della privacy presa dalla configurazione pc con key='ATTIVA_PRIVACY'
        try {
			this.map_configurazione_privacy = new Marshall(bReparti.getValue(reparto, "ATTIVA_PRIVACY")).execute();
		} catch (IOException ex) {
            Logger.getLogger(datiMicrobiologia.class.getName()).log(Level.SEVERE, null, ex); 
		}catch (Exception ex){
            Logger.getLogger(datiMicrobiologia.class.getName()).log(Level.SEVERE, null, ex);        	
        }
        this.map_configurazione_privacy_micro = (Map<String, Object>) this.map_configurazione_privacy.get("DATI_MICROBIOLOGIA");


        try {

            xml = getXml();

        } catch (Exception e) {

            sOut = e.getMessage();
            logInterface.error(e.getMessage(), e);
        }        
        
        //Procedura in Errore
        if (errorProcedure != null) {
            cDiv = new classDivHtmlObject("divNull", "", "Procedura In Errore: " + errorProcedure);
            sOut = cDiv.toString();
        } else {

            if (!xml.getRootElement().getChild("RICHIESTE").getChildren().iterator().hasNext()) {
                sOut += "<DIV id='divNull'>Nessun dato presente</DIV>";
            } else {

                sOut += "<DIV id='divMain'>";
                sOut += "<DIV id='divIntRichieste' style='width:679px;'>";
                sOut += "Legenda: S - Ceppo sensibile, R - Ceppo resistente, I - Risposta intermedia";
		    	sOut+="<DIV style='width:75px;'>Data invio</DIV>";
		    	sOut+="<DIV style='width:60px;'>Data referto</DIV>";
		    	sOut+="<DIV style='width:300px;'>Esame - <i>Materiale</i></DIV>";
		    	sOut+="<DIV style='width:240px;'>Germe</DIV>";
                sOut += "</DIV>";

                iterator = xml.getRootElement().getChild("ANTIBIOTICI").getChildren().iterator();     

                hashAnti = new HashMap<String, Integer>();
                while (iterator.hasNext()) {
                    cont += 1;
                    item = (Element) iterator.next();
                    th += "<div class='rotate-container'><div class='rotate'>" + item.getAttributeValue("DESCR") + "</div></div>";
                    hashAnti.put(item.getAttributeValue("COD"), cont);
                }

                sOut += "<DIV id='divIntAntib'>";
                sOut += "<DIV id='container' style='width:" + String.valueOf(cont * 32) + "px;'>";
                sOut += th;
                sOut += "</DIV>";
                sOut += "</DIV>";

                sOut += "<DIV id='divWrapper'>";

                divRis = "<DIV id='divRis'><table width='" + String.valueOf(cont * 30) + "px'>";
                sOut += "<DIV id='divRichieste'><table>";
                iterator = xml.getRootElement().getChild("RICHIESTE").getChildren().iterator();
                
                iterRisultati = xml.getRootElement().getChild("RICHIESTE").getChild("RICHIESTA").getChildren().iterator();
                
                Class clazzDatiLaboratorio = null;
                ArrayList<Map> lstIterator = null;
                
                if ("S".equalsIgnoreCase((String) this.map_configurazione_privacy_micro.get("ATTIVA"))){ 
                    try {
                        clazzDatiLaboratorio = Class.forName((String) map_configurazione_privacy_micro.get("CLASS_IMPLEMENTAZIONE"));
                        datiLaboratorioPrivacy interfaceDatiLaboratorio = (datiLaboratorioPrivacy)clazzDatiLaboratorio.getDeclaredConstructor(new Class[]{Map.class  }).newInstance(new Object[]{setInfoPazienteFromPrivacy(xml.getRootElement().getChild("DATIANAG"))});
                        lstIterator = interfaceDatiLaboratorio.gestionePrivacy(iterator); 
                    } catch (ClassNotFoundException ex) {
                        Logger.getLogger(datiMicrobiologia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (NoSuchMethodException ex) {
                        Logger.getLogger(datiMicrobiologia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (SecurityException ex) {
                        Logger.getLogger(datiMicrobiologia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (InstantiationException ex) {
                        Logger.getLogger(datiMicrobiologia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (IllegalAccessException ex) {
                        Logger.getLogger(datiMicrobiologia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (IllegalArgumentException ex) {
                        Logger.getLogger(datiMicrobiologia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (InvocationTargetException ex) {
                        Logger.getLogger(datiMicrobiologia.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }else{
                    lstIterator = new ArrayList<Map>();
                    while(iterator.hasNext()){
                        Map<String,Object> map = new HashMap<String,Object>();
                        Element itemMap    = (Element) iterator.next();
                        List<Attribute> attributes = itemMap.getAttributes();
                        for (Attribute att:attributes){
                        	map.put(att.getName(),att.getValue()); 
                        }
                        map.put("RISULTATI",itemMap.getChildren());
                        lstIterator.add(map);
                    }
                }                
                
                iterator = lstIterator.iterator();
                while (iterator.hasNext()) {
                    Map<String,Object> itemMap = (Map<String,Object>) iterator.next();

                    sOut += "<tr richiesta='" + (String)itemMap.get("IDEN") + "'";
                    
                /*   if (itemMap.get("DESCR_GERME").toString().length()>=7 && !"NEGATIV".equalsIgnoreCase(itemMap.get("DESCR_GERME").toString().substring(0, 7))) {
                        sOut += " class='positivo'>";
                    } else {
                        sOut += " class='negativo'>";
                    }*/
                    
                    if (itemMap.get("RICHIESTA_VALIDATA").toString().equalsIgnoreCase("8")){
                    	sOut += " class='definitiva'>";
                    }
                    else{
                    	sOut += " class='non_definitiva'>";
                    }
                    
                    classCss = "";
                    if (!"".equals(itemMap.get("NOTE"))) {
                        classCss = " noteRichiesta";
                    }

                    sOut += "<td class='dataAcc" + classCss + "' note='" + (String)itemMap.get("NOTE") + "'>" + ((String)itemMap.get("DATA_ACC")).substring(6, 8) + "/" + ((String)itemMap.get("DATA_ACC")).substring(4, 6) + "/" + ((String)itemMap.get("DATA_ACC")).substring(0, 4) + "</td>";
                    sOut += "<td class='dataRef'>" + ((String)itemMap.get("DATA_REF")).substring(6, 8) + "/" + ((String)itemMap.get("DATA_REF")).substring(4, 6) + "/" + ((String)itemMap.get("DATA_REF")).substring(0, 4) + "</td>";
                    sOut+="<td class='materiale'>"+(String)itemMap.get("DESCR_ESAME")+"<BR><i>"+(String)itemMap.get("MATERIALE")+"</i></td>";
                    if (itemMap.get("DESCR_GERME").toString().length()>=7 && !"NEGATIV".equalsIgnoreCase(itemMap.get("DESCR_GERME").toString().substring(0, 7))) {
                        sOut += "<td class='germe'>" + itemMap.get("DESCR_GERME") + "</td>";
                    } else {
                        sOut += "<td class='germe'>NEGATIVO</td>";
                    }

                    sOut += "</tr>";

                    contAnti = 1;
                    divRis += "<tr>";
                    if (itemMap.get("RISULTATI")!=null){
                        iterRisultati = ((List) itemMap.get("RISULTATI")).iterator();
                        if(contAnti==1){
                        	divRis += "<td class='tdEmpty'></td>";
                        }
                        while (iterRisultati.hasNext()) {
                            itemRis = (Element) iterRisultati.next();
                            try {
                                posAnti = hashAnti.get(itemRis.getAttributeValue("COD_ANTIBIOTICO"));
                            } catch (Exception e) {
                                continue;
                            }
                            while (contAnti < posAnti) {
                                divRis += "<td>&nbsp;</td>";
                                contAnti += 1;
                            }

                            divRis += "<td";
                            if (!itemRis.getAttributeValue("MIC").equals("")) {
                                divRis += " class='mic' title='" + itemRis.getAttributeValue("MIC") + "'";
                            }
                            divRis += ">" + itemRis.getAttributeValue("RISULTATO") + "</td>";

                            contAnti += 1;
                        }
                        while (contAnti <= cont) {
                            divRis += "<td>&nbsp;</td>";
                            contAnti += 1;
                        }                   	
                    }
                    divRis += "</tr>";

                }
                divRis += "</table></DIV>";
                sOut += "</table></DIV>";
                sOut += divRis;
                sOut += "</DIV>";
                sOut += "</DIV>";
            }
        }
        return sOut;
    }

    private void readDati() {

        this.daData = this.cParam.getParam("daData").trim();
        this.aData = this.cParam.getParam("aData").trim();
        this.idPatient = this.cParam.getParam("idPatient").trim();
        this.reparto = this.cParam.getParam("reparto").trim();
        this.modalita = this.cParam.getParam("modalita").trim();
        this.nosologico = this.cParam.getParam("nosologico").trim();
    }

    public org.jdom.Document getXml() throws SQLException, SqlQueryException {

        String sStat = new String("");
        OracleCallableStatement cs = null;
        org.jdom.Document docXml = null;
        CLOB myLob = null;
        try {

            sStat = "{ call CC_DATI_LABORATORIO.GET_XML_MICROBIOLOGIA(?, ?, ?, ?, ?, ?, ?, ?) }";
            cs = (OracleCallableStatement) this.fDB.getConnectData().prepareCall(sStat);

            cs.setString(1, modalita);
            cs.setString(2, reparto);
            cs.setString(3, idPatient);
            cs.setString(4, nosologico);
            cs.setString(5, daData);
            cs.setString(6, aData);

            cs.registerOutParameter(7, Types.CLOB);
            cs.registerOutParameter(8, Types.VARCHAR);

            cs.executeUpdate();

            myLob = cs.getCLOB(7);
            errorProcedure = cs.getString(8);

            /*		File data 			= new File("C:\\LOG_CLOB.txt");
             Reader reader 		= myLob.getCharacterStream();
             FileWriter writer 	= new FileWriter(data);
             char[] buffer 		= new char[1];

             while (reader.read(buffer) > 0) {
             writer.write(buffer);
             }
	
             writer.close();*/
            InputStream is = myLob.getAsciiStream();

            if (errorProcedure != null && !errorProcedure.equals("")) {
                throw new Exception(errorProcedure);
            }

            SAXBuilder builder = new SAXBuilder();
            docXml = builder.build(new InputStreamReader(is, "ISO-8859-1"));

        } catch (Exception e) {
            logInterface.error(e.getMessage(), e);
            logInterface.warn("Errore Lancio GET_XML_MICROBIOLOGIA: " + e.getMessage());
        } finally {
            try {
                cs.close();
                cs = null;
            UtilityLobs.freeClob(myLob);
            } catch (SQLException e) {
                logInterface.error(e.getMessage(), e);
            }
        }
        return docXml;

    }

    public static String apici(String tmpVal) {
        tmpVal = tmpVal.replaceAll("'", "''");

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
    
    private Map<String,Object> setInfoPazienteFromPrivacy(Element anagrafica){
        Map<String,Object> paramPaziente = new HashMap<String,Object>();
        /*Parametri Anagrafici del XML*/
        paramPaziente.put("iden_anag",anagrafica.getAttributeValue("IDEN_ANAG"));  
        paramPaziente.put("cognome",anagrafica.getAttributeValue("COGNOME"));
        paramPaziente.put("nome",anagrafica.getAttributeValue("NOME"));
        paramPaziente.put("comune_nascita",anagrafica.getAttributeValue("COMNASC"));        
        paramPaziente.put("data_nascita",anagrafica.getAttributeValue("DATANASC"));
        paramPaziente.put("sesso",anagrafica.getAttributeValue("SESSO"));
        paramPaziente.put("codice_fiscale",anagrafica.getAttributeValue("CODFISC"));        
        paramPaziente.put("id_remoto",anagrafica.getAttributeValue("ID_REMOTO"));     
        /*cod_dec_utente*/
        paramPaziente.put("codice_utente",this.bUtente.cod_dec);        
        /*Parametri Generici Presi dalla request*/
        paramPaziente.put("emergenza_medica", this.hRequest.getParameter("emergenza_medica").trim());
        paramPaziente.put("builderClass", map_configurazione_privacy_micro.get("BUILDER"));        
        paramPaziente.put("predicateClass", map_configurazione_privacy_micro.get("PREDICATE_FACTORY"));         
        paramPaziente.put("assigning_authority", map_configurazione_privacy_micro.get("ASSIGNING_AUTHORITY"));
        paramPaziente.put("query",map_configurazione_privacy_micro.get("QUERY"));
        paramPaziente.put("tipologia_accesso",this.hRequest.getParameter("TIPOLOGIA_ACCESSO").trim()==null?"":this.hRequest.getParameter("TIPOLOGIA_ACCESSO").trim());
        paramPaziente.put("evento_corrente",this.hRequest.getParameter("EVENTO_CORRENTE").trim()==null?"":this.hRequest.getParameter("EVENTO_CORRENTE").trim());            
        try {/*Aggiungo Oggetto SFF per il builder*/
            paramPaziente.put("sff",super.getStatementFromFile());
        } catch (Exception ex) {
            Logger.getLogger(listDocumentLaboratorioGriglia.class.getName()).log(Level.SEVERE, null, ex);
        }
        return paramPaziente;
    }
}

