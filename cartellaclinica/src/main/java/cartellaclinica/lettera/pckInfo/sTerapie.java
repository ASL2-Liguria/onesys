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
package cartellaclinica.lettera.pckInfo;

import generatoreEngine.components.html.htmlSpan;
import generic.servletEngine;
import generic.statements.StatementFromFile;
import imago.http.classColDataTable;
import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.http.classTextAreaHtmlObject;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import configurazioneReparto.baseReparti;


public class sTerapie extends servletEngine {

    private HttpServletRequest request = null;
    private baseReparti bReparti;

    public sTerapie(ServletContext pCont, HttpServletRequest pReq) {
        super(pCont, pReq);
        this.request = pReq;
        this.bReparti = super.bReparti;//Global.getReparti(pReq.getSession());

    }

    @Override
	public String getBody() {

        String frasiStd = "";
		try {
			frasiStd = bReparti.getValue(this.cParam.getParam("reparto").trim(), "LETTERA_FRASI_STD");
		} catch (Exception ex) {
            log.error("BaseReparti getValue Error", ex);
		}
        StatementFromFile sff = null;
//        StatementFromFile sff2 = null;
//        StatementFromFile sff3 = null;
//        StatementFromFile sff4 = null;
        ResultSet rs = null;
//        ResultSet rs1 = null;
        
        String body = ""; // "<body>";
        try {
            body += "<script>" + frasiStd + "</script>";

//    		body += "Filtra terapie: " 
//    			 +	"<input type=\"radio\" name=\"radFarma\" onClick=\"javascript:filtraTabFarmaci(this)\" value=\"T\" checked> Tutte" 
//    			 +	"<input type=\"radio\" name=\"radFarma\" onClick=\"javascript:filtraTabFarmaci(this)\"value=\"P\"> Ricovero"
//    			 +	"<input type=\"radio\" name=\"radFarma\" onClick=\"javascript:filtraTabFarmaci(this)\"value=\"A\"> Anamnesi";
//    		body +=	"<br/><br/>\n";
            classTableHtmlObject cTable = null;
            classRowDataTable cRow = null;
            classColDataTable cCol = null;
            sff = getStatementFromFile();//new StatementFromFile(this.hSessione);

            ArrayList<String> categorie = new ArrayList<String>();

            try {
                String[] valore = sff.executeStatement("configurazioni.xml", "getValueCdc", new String[]{request.getParameter("reparto"), "LETTERA_FARMACI_CATEGORIE"}, 1);
                categorie = new ArrayList<String>(Arrays.asList(valore[2].split(",")));
            } catch (Exception e) {
                log.info("Errore o assenza parametro di configurazione LETTERA_FARMACI_CATEGORIE");
            }

            categorie.add(0, "");

            List<HashMap<String, String>> result = new ArrayList<HashMap<String, String>>();

            try {
//                sff = new StatementFromFile(this.hSessione);
                sff.executeStatement("terapie.xml", "set_dati_farmacie", new String[]{this.cParam.getParam("reparto").trim()}, 0);

//                sff2 = new StatementFromFile(hSessione);

                if (!request.getParameter("idenLettera").isEmpty()) {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date dateLetterDimission = null;

                    // Caricamento delle terapie del paziente salvate nella lettera di dimissione                            
                    rs = sff.executeQuery("terapie.xml", "domiciliari.farmaci_lettera", new String[]{request.getParameter("idenLettera")});
                    int columns = rs.getMetaData().getColumnCount();
                    while (rs.next()) {
                        if (dateLetterDimission == null) {
                            dateLetterDimission = sdf.parse(rs.getString("DATA_INSERIMENTO"));
                        }
                        Map<String, String> record = new HashMap<String, String>();
                        int j = 1;
                        while (j <= columns) {
                            record.put(rs.getMetaData().getColumnName(j), rs.getString(j));
                            j++;
                        }
                        result.add((HashMap<String, String>) record);
                    }
                    
                    if (dateLetterDimission == null){
                        rs = sff.executeQuery("terapie.xml", "domiciliari.farmaci_lettera_associata", new String[]{request.getParameter("idenTerapiaAssociata")});
                        int columnsTer = rs.getMetaData().getColumnCount();
                        while (rs.next()) {
                            if (dateLetterDimission == null) {
                                dateLetterDimission = sdf.parse(rs.getString("DATA_INSERIMENTO"));
                            }
                            Map<String, String> record = new HashMap<String, String>();
                            int j = 1;
                            while (j <= columnsTer) {
                                record.put(rs.getMetaData().getColumnName(j), rs.getString(j));
                                j++;
                            }
                            result.add((HashMap<String, String>) record);
                        }
                    }

                    // Caricamento delle terapie aggiunte dopo la registrazione della lettera di dimissione
//                    sff = new StatementFromFile(hSessione);
                    if (request.getParameter("farmaciAlBisogno").equalsIgnoreCase("0")) {
                        rs = sff.executeQuery("terapie.xml", "domiciliari.farmaci_ricovero_no_bisogno", new String[]{request.getParameter("idenRicovero"),request.getParameter("idenRicovero")});
                    } else {
                        rs = sff.executeQuery("terapie.xml", "domiciliari.farmaci_ricovero", new String[]{request.getParameter("idenRicovero"),request.getParameter("idenRicovero")});
                    }
                    int columns1 = rs.getMetaData().getColumnCount();
                    while (rs.next()) {
                        Date dateTherapy = sdf.parse(rs.getString("DATA_INSERIMENTO"));
                        if (dateLetterDimission == null || dateTherapy.compareTo(dateLetterDimission) >= 0) {
                            Map<String, String> record = new HashMap<String, String>();
                            int j = 1;
                            while (j <= columns1) {
                                record.put(rs.getMetaData().getColumnName(j), rs.getString(j));
                                j++;
                            }
                            result.add((HashMap<String, String>) record);
                        }
                    }
//                    sff3.close();
                } else {
//                	if (("LETTERA".equalsIgnoreCase(request.getParameter("opener"))) && !("".equalsIgnoreCase(request.getParameter("idenTerapiaDomiciliare")))){
////                        sff4 = new StatementFromFile(hSessione);
//                		rs = sff.executeQuery("terapie.xml", "domiciliari.farmaci_lettera", new String[]{request.getParameter("idenTerapiaDomiciliare")});
//                        int columns = rs.getMetaData().getColumnCount();
//                        while (rs.next()) {
//                            Map<String, String> record = new HashMap<String, String>();
//                            int j = 1;
//                            while (j <= columns) {
//                                record.put(rs.getMetaData().getColumnName(j), rs.getString(j));
//                                j++;
//                            }
//                            result.add((HashMap<String, String>) record);
//                        }
//                	}
//                	
//                	
                    // Caricamento delle terapie del paziente durante il ricovero                            
                    if (request.getParameter("farmaciAlBisogno").equalsIgnoreCase("0")) {
                        rs = sff.executeQuery("terapie.xml", "domiciliari.farmaci_ricovero_no_bisogno", new String[]{request.getParameter("idenRicovero"),request.getParameter("idenRicovero")});
                    } else {
                        rs = sff.executeQuery("terapie.xml", "domiciliari.farmaci_ricovero", new String[]{request.getParameter("idenRicovero"),request.getParameter("idenRicovero")});
                    }

                    int columns = rs.getMetaData().getColumnCount();
                    while (rs.next()) {
                        Map<String, String> record = new HashMap<String, String>();
                        int j = 1;
                        while (j <= columns) {
                            record.put(rs.getMetaData().getColumnName(j), rs.getString(j));
                            j++;
                        }
                        result.add((HashMap<String, String>) record);
                    }
                }

                cTable = new classTableHtmlObject("60%");
                cTable.addAttribute("class", "classDataTable");
                cTable.addAttribute("id", "tabWkTerapieLettera");
                cRow = new classRowDataTable();
                cRow.addAttribute("id", "initTr");
                cCol = new classColDataTable("th", "5%", "1° Ciclo");
                cRow.addCol(cCol);
                cCol = new classColDataTable("th", "25%", "Farmaco Terapia Domiciliare");
                cRow.addCol(cCol);
                cCol = new classColDataTable("th", "25%", "Posologia");
                cRow.addCol(cCol);
                cCol = new classColDataTable("th", "25%", "Durata");
                cRow.addCol(cCol);
                cCol = new classColDataTable("th", "5%", "Scatole");
                cRow.addCol(cCol);
                cCol = new classColDataTable("th", "10%", "Categoria<div class='button' onclick='aggiungiCategoria(0)'>(aggiungi)</div><div id='addCategoria' style='display:none'><input id='categoria'/><div class='button' onclick='aggiungiCategoria(1)'>OK</div></div>");
                cRow.addCol(cCol);
                cCol = new classColDataTable("th", "5%", "Elimina");
                cRow.addCol(cCol);
                cTable.appendSome(cRow.toString());
                int tipoTerapia = -1;

                int pos = 0;
                while (pos < result.size()) {
                    //System.out.println(result.get(pos).get("IDEN_TIPO_TERAPIA"));
                    int tipoTerapiaRec = Integer.parseInt(result.get(pos).get("IDEN_TIPO_TERAPIA"));
                    if (tipoTerapiaRec != tipoTerapia) {
                        cRow = new classRowDataTable();
                        cRow.addAttribute("class", "gruppoTerapia");
                        cCol = new classColDataTable("", "", result.get(pos).get("DESCR_TIPO_TERAPIA"));
                        cCol.addAttribute("colspan", "6");
                        cRow.addCol(cCol);
                        cCol = new classColDataTable("", "", "");
                        cCol.addAttribute("class", "canc");
                        cCol.addEvent("onClick", "javascript:deleteGruppo(this);");
                        cRow.addCol(cCol);
                        cTable.appendSome(cRow.toString());
                        tipoTerapia = tipoTerapiaRec;
                    }

                    cRow = new classRowDataTable();
                    cRow.addAttribute("class", "terapia");
                    cCol = new classColDataTable("", "", "");
                    //System.out.println("PRIMO CICLO: " + result.get(pos).get("PRIMO_CICLO"));
                    if (result.get(pos).get("PRIMO_CICLO") == null) {
                        cCol.addAttribute("class", "NoSpunta");
                        cCol.addEvent("onClick", "javascript:apriAltriFarmaci();");
                    } else if (result.get(pos).get("PRIMO_CICLO").matches("S") || result.get(pos).get("PRIMO_CICLO").matches("1")) {
                        cCol.addAttribute("class", "Spunta");
                        cCol.addAttribute("checked", "S");
                        cCol.addEvent("onClick", "javascript:spunta(this);");
                    } else if (result.get(pos).get("PRIMO_CICLO").matches("N") || result.get(pos).get("PRIMO_CICLO").matches("0")) {
                        cCol.addAttribute("class", "Spunta");
                        cCol.addAttribute("checked", "N");
                        cCol.addEvent("onClick", "javascript:spunta(this);");
                    }

                    cRow.addCol(cCol);
                    cCol = new classColDataTable("", "", result.get(pos).get("FARMACO"));
                    cCol.addAttribute("iden_far", result.get(pos).get("IDEN_FARMACO"));
                    cCol.addAttribute("cod_dec", result.get(pos).get("COD_DEC"));
                    cCol.addAttribute("id_sos", result.get(pos).get("IDEN_SOSTANZA") == null ? "" : result.get(pos).get("IDEN_SOSTANZA"));
                    cCol.addAttribute("tipo_ter", result.get(pos).get("IDEN_TIPO_TERAPIA"));
                    String stato = result.get(pos).get("STATO");
                    if (stato.contentEquals("A")) {
                        cCol.addAttribute("title", "Terapia domiciliare segnalata in anamnesi");
                    }
                    cCol.addAttribute("stato_ter", stato);

                    String dose = result.get(pos).get("DOSE") != null ? result.get(pos).get("DOSE") : "";
                    if (result.get(pos).get("UDM") != null) {
                        dose += " " + result.get(pos).get("UDM");
                    }
                    if (result.get(pos).get("ORARI") != null) {
                        dose += " (" + result.get(pos).get("ORARI") + ")";
                        if (Integer.parseInt(result.get(pos).get("SOMMINISTRATA24H")) > 0) {
                            cCol.addAttribute("class", "ultime");
                            cCol.addAttribute("title", "Terapia somministrata nelle ultime 24h");
                        }
                    }
                    cRow.addCol(cCol);
                    classTextAreaHtmlObject cDose = new classTextAreaHtmlObject("", dose, "1", "1");
                    cDose.addAttribute("class", "expand");
                    cDose.addAttribute("style", "width:95%");
                    cCol = new classColDataTable("", "", cDose);
                    cCol.addAttribute("align", "center");
                    cRow.addCol(cCol);
                    String durata = result.get(pos).get("DURATA") != null ? result.get(pos).get("DURATA") : "";
                    classTextAreaHtmlObject cDurata = new classTextAreaHtmlObject("", durata, "1", "1");
                    cDurata.addAttribute("style", "width:95%");
                    cDurata.addAttribute("class", "autocomplete expand");
                    cCol = new classColDataTable("", "", cDurata);
                    cCol.addAttribute("align", "center");
                    cRow.addCol(cCol);
                    String scatole = result.get(pos).get("NUM_SCATOLE") != null ? result.get(pos).get("NUM_SCATOLE") : "";
                    classInputHtmlObject cInput = new classInputHtmlObject("", "", scatole);
                    if (result.get(pos).get("PRIMO_CICLO") == null) {
                        cInput.addAttribute("style", "width:20px; visibility:hidden");
                    } else {
                        if (result.get(pos).get("PRIMO_CICLO").matches("S") || result.get(pos).get("PRIMO_CICLO").matches("1")) {
                            cInput.addAttribute("style", "width:20px");
                        } else {
                            cInput.addAttribute("style", "width:20px; visibility:hidden");
                        }
                    }
                    cInput.addAttribute("maxlength", "2");
                    cInput.addEvent("onBlur", "javascript:isNumber(this);");
                    cCol = new classColDataTable("", "", cInput);
                    cCol.addAttribute("align", "center");
                    cRow.addCol(cCol);
                    String categoria = result.get(pos).get("CATEGORIA") != null ? result.get(pos).get("CATEGORIA") : "";
                    if (!categorie.contains(categoria)) {
                        categorie.add(categoria);
                    }
                    cCol = new classColDataTable("", "", "<select class='selCategoria'><option>" + categoria + "</option></select>");
                    cRow.addCol(cCol);
                    cCol = new classColDataTable("", "", "");
                    cCol.addAttribute("class", "canc");
                    cCol.addEvent("onClick", "javascript:deleteRow(this);");
                    cRow.addCol(cCol);
                    cTable.appendSome(cRow.toString());
                    pos++;
                }
//    			fDB.close(rs);

                cRow = new classRowDataTable();
                cRow.addAttribute("class", "gruppoTerapia");
                cRow.addAttribute("id", "nuoveTerapieTr");
                cCol = new classColDataTable("", "", "NUOVE TERAPIE INSERITE");
                cCol.addAttribute("colspan", "6");
                cRow.addCol(cCol);
                cCol = new classColDataTable("", "", "");
                cRow.addCol(cCol);
                cTable.appendSome(cRow.toString());

                /*cRow = new classRowDataTable();
                 cRow.addAttribute("id","finalTr");
                 cRow.addAttribute("onClick","javascript:apriProntuario();");
                 cCol= new classColDataTable("","","");
                 cCol.addAttribute("class", "button");
                 cRow.addCol(cCol);
                 cCol= new classColDataTable("","","Inserisci nuova terapia domiciliare");
                 cCol.addAttribute("colspan","6");
                 cCol.addAttribute("class","link");
                 cRow.addCol(cCol);
                 cTable.appendSome(cRow.toString());*/
                body += "<div id='tableContainer'>" + cTable.toString() + "</div>";
            } catch (Exception ex) {
                body = "cWkTerapie - getHtml(): " + ex.getMessage();
            }
//    		body += "</div><br/>\n";
            body += "<select id=prototype class='selCategoria' style='display:none'>";
            for (String categoria : categorie) {
                body += "<option>" + categoria + "</option>";
            }
            body += "</select>\n";
            
//            if ("LETTERA".equalsIgnoreCase(request.getParameter("opener"))){
                body += spanButton("btnCancel","btn","Chiudi terapie senza importare");
                body += spanButton("btnGeneraTerapie","btn","Importa nella lettera");
                body += spanButton("btnReload","btn","Ricarica terapie");
                body += spanButton("btnLetterePre","btn","Lettere Precedenti");
                body += spanButton("btnProntuario","btn","Apri prontuario");
       	
//            }else{
////Non usato            	
////                body += spanButton("btnTerapiePre","btn","Terapie Domiciliari Precedenti"); 
//                body += spanButton("btnProntuario","btn","Apri prontuario");
////                body += spanButton("btnRegistraTerapiaDomiciliare","btn","Registra Terapia");
//                body += spanButton("btnFirmaTerapiaDomiciliare","btn","Firma Terapia");	   
//            }
            
            /*body += "<span id=btnCancel class=btn>Chiudi terapie senza importare</span>";
            body += "<span id=btnGeneraTerapie class=btn>Importa nella lettera</span>";
            body += "<span id=btnReload class=btn>Ricarica terapie</span>";
            body += "<span id=btnLetterePre class=btn>Lettere Precedenti</span>";
            body += "<span id=btnTerapiePre class=btn>Terapie Domiciliari Precedenti</span>";
            body += "<span id=btnProntuario class=btn>Apri prontuario</span>";
            body += "<span id=btnFirmaTerapiaDomiciliare class=btn>Firma</span>";*/
            
            body+=formFirma();
            
//          body+= "</body>\n";

        } catch (Exception e) {
//              body="<body>"+e.getMessage()+"</body>";
            body = e.getMessage();
        } finally {
        	try {
				rs.close();
//	        	rs1.close();
        	} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}

//            try {
//                sff.close();
//            } catch (Exception e) {
//            }
//            try {
//                sff2.close();
//            } catch (Exception e) {
//            }
//            try {
//                sff3.close();
//            } catch (Exception e) {
//            }
//            try {
//                sff4.close();
//            } catch (Exception e) {
//            }
        }
        return body;
    }

    private String formFirma() {
    	classFormHtmlObject form= new classFormHtmlObject("frmFirmaTerapiaDomiciliare","","POST","");

		form.appendSome(new classInputHtmlObject("hidden","idenVisita",request.getParameter("idenRicovero")));
		form.appendSome(new classInputHtmlObject("hidden","idenVisitaRegistrazione",request.getParameter("idenVisita")));
		form.appendSome(new classInputHtmlObject("hidden","idenVersione",request.getParameter("idenLettera").isEmpty() == true?"":request.getParameter("idenLettera")));
		
		return form.toString();
	}

    private String spanButton(String id,String cls,String value) {
    	htmlSpan span = new htmlSpan();
    	span.setId(id);
    	span.addAttribute("class", cls);
    	span.setTagValue(value);
	
		return span.generateTagHtml();
	}    
    
	@Override
    public String getBottomScript() {
        return "";
    }

    @Override
    protected String getTitle() {
        return "";
    }
}
