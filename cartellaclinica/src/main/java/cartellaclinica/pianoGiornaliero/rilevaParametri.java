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

import generic.servletEngine;

import java.io.StringReader;
import java.util.Date;
import java.util.TimeZone;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;

import cartellaclinica.beans.ParametroType;
import java.sql.ResultSet;

public class rilevaParametri extends servletEngine {

    public rilevaParametri(ServletContext pCont, HttpServletRequest pReq) {
        super(pCont, pReq);
    }

    public String getBody() {
    	String rilevaDa=param("rilevaDa");
        String body = "";
        int t;
       // body += "<DIV id='parametri'>"; 
        t=0;
        try {
        	//if (param("idenTestata").equals("")) {
        	if (!rilevaDa.equals("undefined")){
        		String testoTab[] = new String[3];
        		testoTab[0]="ALTRE PRESCRIZIONI";
        		testoTab[1]="PARAMETRI VITALI";
        		testoTab[2]="ALTRE";
        		String testoSezione[]=new String[3];
        		testoSezione[0]="ALTRE_PRESCRIZIONI";
        		testoSezione[1]="PARAMETRI_VITALI";
        		testoSezione[2]="ALTRE";
            	body += "<ul id='tab_menu'>";
            	for (int i=0; i<=2; i++){
            		body +="<li id=idTab"+i;
            		if (i==Integer.parseInt(rilevaDa)){
            			body+=" class=selTab>";
            		}
            		else {
            			body+=" class=deselTab>";
            		}
            		body += testoTab[i];
            		body += "</li>";
            	}
            	body +="</ul>";	
            	 body += "<DIV id='parametri'>"; 
            	for (int j=0; j<=2; j++){
            		body += "<div class=ContenutoTab id=dividTab"+j+">";
            		//body +="<table id='parametri"+j+"' width=100%>";
            		String idTestata=param("idenTestata");
            		if (param("idenTestata").equals("")){
            			ResultSet rs = getStatementFromFile().executeQuery("parametri.xml", "getParametriRepartoSezione", new String[]{param("reparto"),testoSezione[j]});
                		while (rs.next()) {
                            if (rs.getString("RILEVABILE").equals("S")) {
                                body += getDivParametro(rs.getString("IDEN"));
                            	//body += getRowParametro(rs.getString("IDEN"),t);
                            }
                            t++;
                		}  
                		
                	}
            		else{
            			for (String idenParametro : this.cParam.getParam("idenTestata").trim().split(",")) {
                            body += getDivParametro(idenParametro);
            				//body += getRowParametro(idenParametro,t);
            				t++;
                        } 
            		}
            		getStatementFromFile().close();
            		body += "</div>";
            	}
            	//body += "<div class=ContenutoTab id=dividTab0>";
            	
            	
                /////
             	/*body += "<div class=ContenutoTab id=dividTab1>";
                //body += "<DIV id='parametri'>";

                rs = getStatementFromFile().executeQuery("parametri.xml", "getParametriReparto", new String[]{param("reparto"),"PARAMETRI_VITALI"});

	            while (rs.next()) {
	                 if (rs.getString("RILEVABILE").equals("S")) {
	                     body += getDivParametro(rs.getString("IDEN"));
	                 }
	            }
	            getStatementFromFile().close();
	                 
	            body += "</DIV>";
                 /////
             	body += "<div class=ContenutoTab id=dividTab2>";
                 //body += "<DIV id='parametri'>";
             	rs = getStatementFromFile().executeQuery("parametri.xml", "getParametriReparto", new String[]{param("reparto"),"ALTRE"});

                while (rs.next()) {
                    if (rs.getString("RILEVABILE").equals("S")) {
                        body += getDivParametro(rs.getString("IDEN"));
                    }
                }
                getStatementFromFile().close();           
                body += "</DIV>";*/
            	
            } 
            else {
            	body += "<DIV id='parametri'>"; 
            	for (String idenParametro : this.cParam.getParam("idenTestata").trim().split(",")) {
                      body += getDivParametro(idenParametro);
            		//body += getRowParametro(idenParametro,t);
            		t++;
                }  
            //	body += "</table>";
            }
        	body += "</DIV>";  
        	 ////
        	body += "<DIV class='divDate'>";
            String[] date = this.cParam.getParam("concatDate").trim().split("[|]");
            String oggi = DateFormatUtils.format(new Date(), "yyyyMMdd", TimeZone.getTimeZone("Europe/Rome"));
            for (int i = 0; i < date.length; i++) {
                //body += "<INPUT type=radio id='data" + i + "' name=data value='" + date[i] + "' ";
            	// date e ora verranno impostate lato client da javascript come viene fatto con data e ora della somministrazione terapia
            	body += "<INPUT type=radio id='data" + i + "' name=data value='' ";
                //if (date[i].matches(oggi)) {
                //    body += "checked";
                //}
                body += "/>";
                //body += "<LABEL for='data" + i + "'>" + date[i].substring(6, 8) + "/" + date[i].subSequence(4, 6) + "/" + date[i].subSequence(0, 4) + "</LABEL>";
                body += "<LABEL for='data" + i + "'></LABEL>";
            }
            body += "</DIV>";
            body += "<DIV class=divOra>";
            body += "<input name=txt_ora type=text id=txt_ora  value='"
                    //+ DateFormatUtils.format(new Date(), "HH:mm", TimeZone.getTimeZone("Europe/Rome")) + "' size=6/><img src='imagexPix/calendario/orologio.jpg' onclick= \"apriOrologio('txt_ora');\"/>";
            		+ "' size=6/><img src='imagexPix/calendario/orologio.jpg' onclick= \"apriOrologio('txt_ora');\"/>";
            body += "</DIV>";
            body += "<DIV class=rowButton>";
            body += "<span id='close' class='button'>Annulla</span>";
            body += "<span id='save' class='button'>OK</span>";
            body += "</DIV></div>";
        } catch (Exception e) {
            e.printStackTrace();
            body += e.getMessage();
        }
        return body;
    }

      private String getDivParametro(String iden_parametro) throws Exception {

        String div = "";

        int iden = Integer.parseInt(iden_parametro);
        ParametroType parametro = ParametroType.getParametroType(iden, this.hSessione);
        div += "<DIV class='parametro' iden='" + iden + "' descr='" + parametro.getDescrizione() + "'>";
        div += "<DIV class='paramIntestazione'><DIV class=\"intLeft\">";
        if (parametro.getNRilevazioni().equals("S")) {
        	div += "<SPAN class=\"addRilevazione\">&nbsp;</SPAN>";
        }
        div += "<SPAN class=\"removeRilevazione\">&nbsp;</SPAN>";
        div += "<LABEL><STRONG>" + parametro.getDescrizione() + "</STRONG></LABEL></DIV>";
        if (parametro.getValoreMinimo()!=0 || parametro.getValoreMassimo()!=0){
        	div+="<SPAN class=\"valoriAccettati\"><LABEL>- Valori accettati:"+parametro.getValoreMinimo()+"-"+parametro.getValoreMassimo()+"</LABEL></SPAN>";
         }        
        div +="</DIV>";
        div += "<DIV class='valori'><DIV class='rilevazione'><LABEL>Valore: </LABEL>";
        if (parametro.getDecodifica() != null) {
            div += "<SELECT><OPTION value=''></OPTION>";
            Document xml = loadXMLFromString(parametro.getDecodifica());
            for (int i = 0; i < xml.getElementsByTagName("VALORE_1").getLength(); i++) {
                Element e = (Element) xml.getElementsByTagName("VALORE_1").item(i);
                div += "<OPTION value='" + e.getAttribute("encoded") + "'>" + e.getAttribute("decoded") + "</OPTION>";
            }
            div += "</SELECT>";
        } else {
            div += "<INPUT/>";
        }
        if (parametro.getSeparatore() != null) {
            div += "<LABEL class='separatore'>" + parametro.getSeparatore() + "</LABEL><INPUT/>";
        }
        div += "</DIV>";
        
        div += "<DIV id='campiAggiuntivi'>";
        if (parametro.getCampiAggiuntivi()!=null){
        Document confXml = loadXMLFromString(parametro.getCampiAggiuntivi());
           for (int i = 0; i < confXml.getElementsByTagName("ELEMENTO").getLength(); i++) {
            Element e = (Element) confXml.getElementsByTagName("ELEMENTO").item(i);
            div += "<DIV class='" + e.getAttribute("class")+"'>";
            div += "<LABEL>" + e.getAttribute("descr")+"</LABEL>";        
            if (e.getAttribute("type").equals("text")){ 
            	div += "<INPUT name='" + e.getAttribute("name")+"' descr='" + e.getAttribute("descr")+"'/>";
            }           
            else if(e.getAttribute("type").equals("select")){  
            	div += "<SELECT name='" + e.getAttribute("name")+"' descr='" + e.getAttribute("descr")+"'><OPTION value=''></OPTION>";
                 for (int i1 = 0; i1 < e.getElementsByTagName("VALORE_1").getLength(); i1++) {
                     Element e1 = (Element) e.getElementsByTagName("VALORE_1").item(i1);
                     div += "<OPTION value='" + e1.getAttribute("encoded") + "'>" + e1.getAttribute("decoded") + "</OPTION>";
                 }
                 div += "</SELECT>";
            }
            div += "</DIV>";
          }
        }
        else{
        	div +="&nbsp;";
        }
        div += "</DIV>";
        
        div += "<DIV class='note'><LABEL>Note: </LABEL><INPUT/></DIV>";
        
        div += "</DIV>";
        div += "</DIV>";

        return div;
    }

      private String getRowParametro(String iden_parametro, int nriga) throws Exception {

        String row = "";

        int iden = Integer.parseInt(iden_parametro);
        ParametroType parametro = ParametroType.getParametroType(iden, this.hSessione);
        row += "<tr class='parametro' id='r"+nriga+"' iden='" + iden + "' descr='" + parametro.getDescrizione() + "'>";
        row +="<td class='paramIntestazione' colspan=6>";
        if (parametro.getNRilevazioni().equals("S")) {
            row += "<SPAN class=\"addRilevazione\">&nbsp;</SPAN>";
        }
        row += "<SPAN class=\"removeRilevazione\">&nbsp;</SPAN>";
        row += "<LABEL><STRONG>" + parametro.getDescrizione() + "</STRONG></LABEL></td></tr>";
        row += "<tr class='parametroVal' id='r"+nriga+"' iden='" + iden + "'><td class='valori rilevazione'><LABEL>Valore: </LABEL>";
        if (parametro.getDecodifica() != null) {
            row += "<SELECT><OPTION value=''></OPTION>";
            Document xml = loadXMLFromString(parametro.getDecodifica());
            for (int i = 0; i < xml.getElementsByTagName("VALORE_1").getLength(); i++) {
                Element e = (Element) xml.getElementsByTagName("VALORE_1").item(i);
                row += "<OPTION value='" + e.getAttribute("encoded") + "'>" + e.getAttribute("decoded") + "</OPTION>";
            }
            row += "</SELECT>";
        } else {
            row += "<INPUT/>";
        }
        if (parametro.getSeparatore() != null) {
            row += "<LABEL class='separatore'>" + parametro.getSeparatore() + "</LABEL><INPUT/>";
        }
        row += "</td>";
        
       

        if (parametro.getCampiAggiuntivi()!=null){
        Document confXml = loadXMLFromString(parametro.getCampiAggiuntivi());
        
        for (int i = 0; i < confXml.getElementsByTagName("ELEMENTO").getLength(); i++) {
            Element e = (Element) confXml.getElementsByTagName("ELEMENTO").item(i);
            row += "<td class='" + e.getAttribute("class")+"'>";
            
            row += "<LABEL>" + e.getAttribute("descr")+"</LABEL>";
            
            if (e.getAttribute("type").equals("text")){ 
          	  row += "<INPUT name='" + e.getAttribute("name")+"' descr='" + e.getAttribute("descr")+"'/>";
            }
            
            else if(e.getAttribute("type").equals("select")){  
            	 row += "<SELECT name='" + e.getAttribute("name")+"' descr='" + e.getAttribute("descr")+"'><OPTION value=''></OPTION>";
                 for (int i1 = 0; i1 < e.getElementsByTagName("VALORE_1").getLength(); i1++) {
                     Element e1 = (Element) e.getElementsByTagName("VALORE_1").item(i1);
                     row += "<OPTION value='" + e1.getAttribute("encoded") + "'>" + e1.getAttribute("decoded") + "</OPTION>";
                 }
                 row += "</SELECT>";
            }
            
            row += "</td>";
            
        }        
        }
        
        row += "<td class='note'><LABEL>Note: </LABEL><INPUT/></td>";
        // valori minimo e massimo
        if (parametro.getValoreMinimo()!=0 || parametro.getValoreMassimo()!=0){
        	row += "<td class='minmaxPar'><LABEL>Range "+parametro.getValoreMinimo()+"-"+parametro.getValoreMassimo()+"</LABEL></td>";
        }
        row += "</tr>";
        //row += "</DIV>";

        return row;
    }
      
  
  

    @Override
    public String getBottomScript() {
        return "";
    }

    private Document loadXMLFromString(String xml) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        InputSource is = new InputSource(new StringReader(xml));
        return builder.parse(is);
    }

    @Override
    protected String getTitle() {
        return "";
    }
}
