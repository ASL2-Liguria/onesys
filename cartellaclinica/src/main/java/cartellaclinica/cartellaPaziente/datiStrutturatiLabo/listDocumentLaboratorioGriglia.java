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
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import it.elco.json.actions.Marshall;
import it.elco.whale.converters.MapFactory;
import it.elco.whale.privacy.datiLaboratorio.datiLaboratorioPrivacy;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.InvocationTargetException;
import java.sql.Array;
import java.sql.CallableStatement;
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

import matteos.utils.XmlUtils;
import oracle.jdbc.OracleCallableStatement;
import oracle.sql.ARRAY;
import oracle.sql.ArrayDescriptor;
import oracle.sql.CLOB;

import org.apache.ecs.Doctype;
import org.jdom.Attribute;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import core.database.UtilityLobs;

public class listDocumentLaboratorioGriglia extends servletEngine {

    private String reparto = "";
    private String idenRichiesta = "";
    private String provChiamata = "";
    private String errorProcedure = "";
    private String classTd = "";
    Map<String, Object> map_configurazione_privacy=null;
    Map<String, Object> map_configurazione_privacy_labo=null;
    
    private final ElcoLoggerInterface logInterface = new ElcoLoggerImpl(listDocumentLaboratorioGriglia.class);

    public listDocumentLaboratorioGriglia(ServletContext pCont, HttpServletRequest pReq) {
        super(pCont, pReq);
        this.bReparti = super.bReparti;//Global.getReparti(pReq.getSession());
    }

    @Override
    protected String getBody() {

        try {
            super.setDocType(Doctype.XHtml10Transitional.class);
        } catch (InstantiationException e1) {
            log.error(e1);
        } catch (IllegalAccessException e1) {
            log.error(e1);
        }
        String sOut = "", classCss, tipoAnalisi, un_misura = "";

        classTableHtmlObject cTable;
        classTableHtmlObject datiTable = null, leftTable = null;

        classRowDataTable cRow;
        classColDataTable cCol;

        classDivHtmlObject cDiv, cDivMain = null;

        Iterator iterator, iteratorEsami;

        org.jdom.Document xml = null;

        ArrayList<String> alIdenRichieste = new ArrayList<String>();
        ArrayList<String> idenRichieste = new ArrayList<String>();
        Map<String, Object> map_configurazioni=null;

        int contCol = 0;

        try {

            readDati();

            // Configurazione Visualizzazione UM
          if (!provChiamata.equals("MMG")) { 
	            map_configurazioni = MapFactory.fromJSonString(bReparti.getValue(reparto, "CONFIG_DATI_STRUTTURATI_LABO"));
	            List<Map<String, String>> conf_um = (List<Map<String, String>>) map_configurazioni.get("COLS");
	            this.map_configurazione_privacy = new Marshall(bReparti.getValue(reparto, "ATTIVA_PRIVACY")).execute();
	            this.map_configurazione_privacy_labo = (Map<String, Object>) this.map_configurazione_privacy.get("DATI_LABORATORIO");
	            un_misura = conf_um.get(0).get("UM");
          }

            xml = getXml();

            if (provChiamata.equals("MMG")) {
                super.BODY.addAttribute("class", "bodyMMG");
            } else if (provChiamata.equals("AMBULATORIO")) {
                super.BODY.addAttribute("class", "bodyAmbulatorio");
            } else if (provChiamata.equals("IPATIENT")) {
                super.BODY.addAttribute("class", "bodyIPatient");
            } else if (provChiamata.equals("INFO")) {
                super.BODY.addAttribute("class", "bodyInfo");
            } else {
                super.BODY.addAttribute("class", "bodyCartella");
            }

        } catch (Exception e) {
            sOut = e.getMessage();
            logInterface.error(e.getMessage(), e);
        }

        //Procedura in Errore
        if (errorProcedure != null) {
            cDiv = new classDivHtmlObject("divNull", "", "Procedura In Errore: " + errorProcedure);
            sOut = cDiv.toString();
        } else {
            if (!(xml.getRootElement().getChild("ANALISI")).getChildren().iterator().hasNext()) {
                cDiv = new classDivHtmlObject("divNull", "", "Nessun dato strutturato di laboratorio presente");
                sOut += cDiv.toString();
            } else {

                // Itero sul primo figlio <ANALISI> dell'XML
                iterator = xml.getRootElement().getChild("ANALISI").getChildren().iterator();
                /* TODO
                 AGGIUNGERE CONFIGURAZIONE PER LÁA GESTIONE DELLA PRIVACY                   
                 */
                ArrayList<Map> lstIterator = null;

                if (map_configurazione_privacy!=null && "S".equalsIgnoreCase((String) map_configurazione_privacy_labo.get("ATTIVA"))) {
                    Class clazzDatiLaboratorio;
                    try {
                        clazzDatiLaboratorio = Class.forName((String) map_configurazione_privacy_labo.get("CLASS_IMPLEMENTAZIONE"));
                        datiLaboratorioPrivacy interfaceDatiLaboratorio = (datiLaboratorioPrivacy) clazzDatiLaboratorio.getDeclaredConstructor(new Class[]{Map.class}).newInstance(new Object[]{setInfoPazienteFromPrivacy(xml.getRootElement().getChild("DATICONF").getChild("DATIANAG"))});
                        lstIterator = interfaceDatiLaboratorio.gestionePrivacy(iterator);

                    } catch (ClassNotFoundException ex) {
                        Logger.getLogger(listDocumentLaboratorioGriglia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (NoSuchMethodException ex) {
                        Logger.getLogger(listDocumentLaboratorioGriglia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (SecurityException ex) {
                        Logger.getLogger(listDocumentLaboratorioGriglia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (InstantiationException ex) {
                        Logger.getLogger(listDocumentLaboratorioGriglia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (IllegalAccessException ex) {
                        Logger.getLogger(listDocumentLaboratorioGriglia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (IllegalArgumentException ex) {
                        Logger.getLogger(listDocumentLaboratorioGriglia.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (InvocationTargetException ex) {
                        Logger.getLogger(listDocumentLaboratorioGriglia.class.getName()).log(Level.SEVERE, null, ex);
                    }

                } else {
                    lstIterator = new ArrayList<Map>();
                	while (iterator.hasNext()) {
                        Map<String, Object> map = new HashMap<String, Object>();
                        Element item = (Element) iterator.next();
                        List attributes = item.getAttributes();
                        Iterator it = attributes.iterator();
                        while (it.hasNext()) {
                            Attribute att = (Attribute) it.next();
                            map.put(att.getName(), att.getValue());
                        }
                        lstIterator.add(map);
                    }
                }

                if (lstIterator.isEmpty()) {
                    cDiv = new classDivHtmlObject("divNull", "", "Nessun dato strutturato di laboratorio presente");
                    sOut += cDiv.toString();
                } else {
                    try {
                        cDivMain = new classDivHtmlObject("divMain");
                        cDivMain.appendSome(this.getFormDati(xml.getRootElement().getChild("DATICONF")));

                        cTable = new classTableHtmlObject();

                        cTable.addAttribute("id", "tabIntestazione");

                        cRow = new classRowDataTable();

                        cRow.addCol(getTd("&nbsp;", "colGraf"));
                        cRow.addCol(getTd("ESAME", "colEsameIntestazione"));
                        cRow.addCol(getTd("V.MIN", "colValMin"));
                        cRow.addCol(getTd("V.MAX", "colValMax"));

                        if (un_misura.equals("S")) {
                            cRow.addCol(getTd("U.M.", "colUnMis"));
                        }

                        cTable.appendSome(cRow.toString());
                        cDiv = new classDivHtmlObject("divBloc");

                        cDiv.appendSome(cTable);
                        cDivMain.appendSome(cDiv.toString());

                        // div di intestazione delle richieste #############      
                        contCol = 6;

                        cTable = new classTableHtmlObject();
                        cTable.addAttribute("id", "tabIntestazioneRisultati");
                        cRow = new classRowDataTable();

                        /*datiLaboratorioPrivacyImpl listPrivacy = new datiLaboratorioPrivacyImpl(setInfoPazienteFromPrivacy(xml.getRootElement().getChild("DATICONF").getChild("DATIANAG")));
                        ArrayList<Map> lstIterator = listPrivacy.gestionePrivacy(iterator);*/
                        for (Map<String, Object> item : lstIterator) {
                            //Element item = (Element) iterator.next();                        
                            alIdenRichieste.add((String) item.get("IDEN"));

                            if (item.get("TIPO").equals("LAB")) {
                                idenRichieste.add((String) item.get("IDEN"));
                            }

                            cCol = new classColDataTable("TD", "", item.get("DATA").toString().substring(6, 8) + "/" + item.get("DATA").toString().substring(4, 6) + "/" + item.get("DATA").toString().substring(0, 4) + "<BR>" + item.get("ORA").toString());

                            classCss = (item.get("COD_CDC").equals(reparto)) ? "tdInt" : "tdIntAltriRep";

                            if (!"".equals(item.get("NOTE").toString())) {
                                classCss += " noteRichiesta";
                            }

                            if ("LAB".equals(item.get("TIPO").toString())) {
                                classCss += " link";
                                cCol.addAttribute("onClick", "NS_DATI_LABO_GRIGLIA.UTILS.apriReferto(this)");
                                cCol.addAttribute("title", "Apri documento");
                            }
                            cCol.addAttribute("class", classCss);
                            cCol.addAttribute("DATA_RICHIESTA", item.get("DATA").toString());
                            cCol.addAttribute("IDEN", item.get("IDEN").toString());
                            cCol.addAttribute("IDEN_RICHIESTA", item.get("IDEN").toString());
                            cCol.addAttribute("DESCR_CDC", item.get("DESCR_CDC").toString());
                            cCol.addAttribute("NOTE", item.get("NOTE").toString());
                            cCol.addAttribute("INT_EST", item.get("INT_EST").toString());
                            cCol.addAttribute("TIPO", item.get("TIPO").toString());
                            cRow.addCol(cCol);
                            contCol += 1;

                        }

                        cTable.appendSome(cRow.toString());

                        cDiv = new classDivHtmlObject("divIntestazione");
                        cTable.addAttribute("width", String.valueOf(alIdenRichieste.size() * 100) + "px");
                        cDiv.appendSome(cTable.toString());
                        cDivMain.appendSome(cDiv.toString());
                        // fine div di intestazione delle richieste ###################     
                    } catch (Exception e) {
                        super.BODY.setOnLoad("setVisible();");
                        sOut = e.getMessage();
                        logInterface.error(e.getMessage(), e);
                    }

                    // Creo le Tabelle Wrapper di Esami e Risultati
                    datiTable = new classTableHtmlObject();
                    datiTable.addAttribute("id", "datiTable");

                    leftTable = new classTableHtmlObject();
                    leftTable.addAttribute("id", "tabellaLeft");

                    try {
                        // Gruppi
                        Iterator iterGruppi = xml.getRootElement().getChild("ESAMI").getChildren().iterator();
                        while (iterGruppi.hasNext()) {

                            // Add Intestazione Gruppo Tabella Esami
                            Element itemGruppo = (Element) iterGruppi.next();
                            cRow = new classRowDataTable();
                            cRow.addAttribute("class", "rigaGruppo");

                            if (itemGruppo.getAttributeValue("DESCR_GRUPPO") != null && !itemGruppo.getAttributeValue("DESCR_GRUPPO").trim().equalsIgnoreCase("")) {
                                cCol = new classColDataTable("TD", "", itemGruppo.getAttributeValue("DESCR_GRUPPO"));
                                cCol.addAttribute("class", "tdGruppo");
                            } else {
                                cCol = new classColDataTable("TD", "", "&nbsp");
                            }

                            cCol.addAttribute("colspan", String.valueOf(6));
                            cRow.addCol(cCol);
                            leftTable.appendSome(cRow.toString());

                            // Add Riga Vuotoa Intestazione Gruppo Risultati
                            cRow = new classRowDataTable();
                            cRow.addAttribute("class", "rigaGruppo");
                            cCol = new classColDataTable("TD", "", "&nbsp");
                            cCol.addAttribute("colspan", String.valueOf(contCol));
                            cRow.addCol(cCol);
                            datiTable.appendSome(cRow.toString());

                            // Analisi Multiple   	  
                            Iterator iteratorAnalisiMulti = itemGruppo.getChildren().iterator();
                            while (iteratorAnalisiMulti.hasNext()) {

                                Element itemAnalisiMulti = (Element) iteratorAnalisiMulti.next();
                                if (itemAnalisiMulti.getAttributeValue("ATTIVO").equalsIgnoreCase("S")
                                        && itemAnalisiMulti.getAttributeValue("SHOW").equalsIgnoreCase("S")) {

                                    // Riga Intestazione Esami
                                    cRow = new classRowDataTable();
                                    cRow.addAttribute("class", "rigaAnalisiMulti");
                                    cCol = new classColDataTable("TD", "", itemAnalisiMulti.getAttributeValue("DESCR"));
                                    cCol.addAttribute("colspan", String.valueOf(6));
                                    cCol.addAttribute("codiceEsame", itemAnalisiMulti.getAttributeValue("IDESAMEMULTIPLO"));
                                    cRow.addCol(cCol);
                                    leftTable.appendSome(cRow.toString());

                                    // Riga Vuota Tabella Risultati
                                    cRow = new classRowDataTable();
                                    cRow.addAttribute("class", "rigaAnalisiMulti");
                                    cCol = new classColDataTable("TD", "", "&nbsp");
                                    cCol.addAttribute("colspan", String.valueOf(contCol));
                                    cRow.addCol(cCol);
                                    datiTable.appendSome(cRow.toString());

                                    tipoAnalisi = "S";

                                } else {
                                    tipoAnalisi = "M";
                                }

                                iteratorEsami = itemAnalisiMulti.getChildren().iterator();
                                while (iteratorEsami.hasNext()) {

                                    cRow = new classRowDataTable();
                                    cRow.addAttribute("class", "rigaEsame");

                                    Element itemEsame = (Element) iteratorEsami.next();

                                    // Add Icona Grafico
                                    cCol = new classColDataTable("TD", "", "");
                                    cCol.addAttribute("class", "colGraf");
                                    cCol.addAttribute("onClick", "javascript:NS_DATI_LABO_GRIGLIA.UTILS.grafLabWhale(this);");

                                    if (itemEsame.getAttributeValue("COD_DEC") != null && !itemEsame.getAttributeValue("COD_DEC").equalsIgnoreCase("")) {
                                        cCol.addAttribute("COD_ESA", itemEsame.getAttributeValue("COD_ESA"));
                                    } else {
                                        cCol.addAttribute("COD_ESA", itemEsame.getName().substring(5, itemEsame.getName().length()));
                                    }

                                    // Richiesta Singola Il Grafico Non Serve
                                    cCol.addAttribute("MATERIALE", super.chkNull(itemEsame.getAttributeValue("CODICE_MATERIALE")));

                                    classDivHtmlObject grafDiv = new classDivHtmlObject("", "", "&nbsp");
                                    grafDiv.addAttribute("class", "imageGraf");
                                    grafDiv.addAttribute("COD_ESA", itemEsame.getAttributeValue("COD_ESA"));
                                    cCol.appendSome(grafDiv.toString());

                                    cRow.addCol(cCol);

                                    	if (tipoAnalisi.equalsIgnoreCase("S")) {
	                                //    cCol = new classColDataTable("TD", "", "&nbsp;&nbsp; - " + itemEsame.getAttributeValue("DESCR") + "&lt;BR&gt;" + super.chkNull(itemEsame.getAttributeValue("MATERIALE")) + " " + super.chkNull(itemEsame.getAttributeValue("PROVENIENZA")) + " " + super.chkNull(itemEsame.getAttributeValue("DATA_PRELIEVO")));
	                                     cCol = new classColDataTable("TD", "", "");
	                                     cCol.appendSome("<DIV class='divDescrizione'>&nbsp;&nbsp; - "+itemEsame.getAttributeValue("DESCR")+" " + super.chkNull(itemEsame.getAttributeValue("PROVENIENZA")) + " " + super.chkNull(itemEsame.getAttributeValue("DATA_PRELIEVO"))+"</DIV><DIV class='divMateriale'>&nbsp;&nbsp;&nbsp; "+super.chkNull(itemEsame.getAttributeValue("MATERIALE"))+"</DIV>");
	                                    cCol.addAttribute("class", "colEsameSingolo");
	                                } else {
	                                 //   cCol = new classColDataTable("TD", "", itemEsame.getAttributeValue("DESCR") + " " + super.chkNull(itemEsame.getAttributeValue("MATERIALE")) + " " + super.chkNull(itemEsame.getAttributeValue("PROVENIENZA")) + " " + super.chkNull(itemEsame.getAttributeValue("DATA_PRELIEVO")));
	                                     cCol = new classColDataTable("TD", "", "");
	                                     cCol.appendSome("<DIV class='divDescrizione'>"+itemEsame.getAttributeValue("DESCR")+" " + super.chkNull(itemEsame.getAttributeValue("PROVENIENZA")) + " " + super.chkNull(itemEsame.getAttributeValue("DATA_PRELIEVO"))+"</DIV><DIV class='divMateriale'>"+super.chkNull(itemEsame.getAttributeValue("MATERIALE"))+"</DIV>");
	                                    cCol.addAttribute("class", "colEsameMultiplo");
	                                }


                                    cRow.addCol(cCol);

                                    cRow.addCol(getTd(itemEsame.getAttributeValue("VALORERIFMIN"), "colValMin"));
                                    cRow.addCol(getTd(itemEsame.getAttributeValue("VALORERIFMAX"), "colValMax"));

                                    if (un_misura.equals("S")) {
                                        cRow.addCol(getTd(itemEsame.getAttributeValue("UNMISURA"), "colUnMis"));
                                    }
                                    leftTable.appendSome(cRow.toString());

                                    //per ogni esame ciclo l'elenco delle richieste ...creo una nuova riga e la inserisco nel div dei dati
                                    cRow = new classRowDataTable();
                                    cRow.addAttribute("class", "rigaEsame");

                                    for (int i = 0; i < alIdenRichieste.size(); i++) {
                                        List elms = XmlUtils.getNodesByXpath(itemEsame, "/ROOT/ESAMI//ESAME[@COD_DEC='" + itemEsame.getAttributeValue("COD_DEC") + "' and @CODICE_MATERIALE='" + super.chkNull(itemEsame.getAttributeValue("CODICE_MATERIALE")) + "' and @PROVENIENZA='" + super.chkNull(itemEsame.getAttributeValue("PROVENIENZA")) + "' and @DATA_PRELIEVO='" + super.chkNull(itemEsame.getAttributeValue("DATA_PRELIEVO")) + "']/*[@IDEN_RICHIESTA='" + alIdenRichieste.get(i) + "']");
                                        classTd = "";
                                        //se Ë presente la richiesta per lo specifico esame inserisco il risultato nella colonna specifica
                                        if (elms.size() > 0) {
                                            Element itemRichiesta = (Element) elms.get(0);
                                            cCol = new classColDataTable("TD", "", itemRichiesta.getValue());
                                            cCol.addAttribute("title", itemRichiesta.getAttributeValue("RISULTATOESAMELUNGO"));
                                            cCol.addAttribute("GERMI", super.chkNull(itemRichiesta.getAttributeValue("GERMI")));
                                            cCol.addAttribute("RICHIESTA", super.chkNull(itemRichiesta.getAttributeValue("IDEN")));
                                            cCol.addAttribute("PROGRANALISI", super.chkNull(itemRichiesta.getAttributeValue("PROGRANALISI")));
                                            cCol.addAttribute("PROGRANALISIPR", super.chkNull(itemRichiesta.getAttributeValue("PROGRANALISIPR")));

                                            if (itemRichiesta.getAttributeValue("RISULTATOESAMELUNGO") != null && !itemRichiesta.getAttributeValue("RISULTATOESAMELUNGO").equals("")) {
                                                classTd = " classTitle ";
                                            }

                                            if (itemRichiesta.getAttributeValue("COLORE") != null && !itemRichiesta.getAttributeValue("COLORE").equals("")) {

                                                if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("BLUE")) {

                                                    if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")) {
                                                        cCol.addAttribute("style", "COLOR:blue; FONT-WEIGHT:BOLD;  background:#DCE0E0;");
                                                    } else {
                                                        cCol.addAttribute("style", "COLOR:blue; FONT-WEIGHT:BOLD; ");
                                                    }
                                                } else if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("RED")) {

                                                    if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")) {
                                                        cCol.addAttribute("style", "COLOR:red; FONT-WEIGHT:BOLD;  background:#DCE0E0;");
                                                    } else {
                                                        cCol.addAttribute("style", "COLOR:red; FONT-WEIGHT:BOLD; ");
                                                    }

                                                }
                                            } else if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")) {
                                                classTd = "colDatiNoFirmati";
                                            }

                                            if (itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")) {
                                                classTd += (classTd.equals("")) ? "colDati" : " colDati";
                                            }

                                            if (!itemRichiesta.getAttributeValue("GERMI").equalsIgnoreCase("0")) {
                                                classTd += (classTd.equals("")) ? "datiMicrobiologia" : " datiMicrobiologia";
                                            }

                                            if (!classTd.equals("")) {
                                                cCol.addAttribute("class", classTd);
                                            }

                                            cRow.addCol(cCol);

                                        } else {
                                            // Cella Vuota
                                            cCol = new classColDataTable("TD", "", "&nbsp");
                                            classTd += (classTd.equals("")) ? "colDati" : " colDati";

                                            if (!classTd.equals("")) {
                                                cCol.addAttribute("class", classTd);
                                            }

                                            cRow.addCol(cCol);
                                        }
                                    }

                                    datiTable.appendSome(cRow.toString());

                                }
                            }
                        }

                    } catch (Exception e) {
                        sOut = e.getMessage();
                        logInterface.error(e.getMessage(), e);
                    }
                    classDivHtmlObject cDivWrapperDati = new classDivHtmlObject("divWrapper");

                  if(!provChiamata.equals("MMG") && map_configurazioni.get("ESITI_CONSULTATI").equals("S") && this.fDB.bUtente.tipo.equals("M")){  
                    cRow = new classRowDataTable();
                    cRow.addAttribute("class", "rigaEsameLetto");
                    cCol = new classColDataTable("TD", "", "RISULTATI LETTI");
                    cCol.addAttribute("colspan", "4");
                    cRow.addCol(cCol);
                    leftTable.appendSome(cRow.toString());
                    
                    datiTable.appendSome("<tr class='rigaEsameLetto'>");
                    for (int i = 0; i < alIdenRichieste.size(); i++) {
                    	datiTable.appendSome("<td><input name='chkLetto' idenTestata='"+alIdenRichieste.get(i)+"' type='checkbox'></input></td>");
                    }
                    datiTable.appendSome("</tr>");
                  }
             /*       if(xml.getRootElement().getChildText("VISUALIZZA_ASTERISCO").equalsIgnoreCase("S")){
                    	cRow = new classRowDataTable();
                        cRow.addAttribute("class", "rigaAsterisco");
                     //   cCol = new classColDataTable("TD", "", "* ATTENZIONE: LE VISUALIZZAZIONI DEL DATO STRUTTURATO<BR>POTREBBERO NON ESSERE STATE VISUALIZZATE CORRETTAMENTE");
                        cCol = new classColDataTable("TD", "", "* Attenzione: le visualizzazioni del dato strutturato<BR>potrebbero non essere state visualizzate correttamente");
                        cCol.addAttribute("colspan", "4");
                        cRow.addCol(cCol);
                        leftTable.appendSome(cRow.toString());
                        
                        datiTable.appendSome("<tr class='rigaAsterisco'>");
                        for (int i = 0; i < alIdenRichieste.size(); i++) {
                        	datiTable.appendSome("<td></td>");
                        }
                        datiTable.appendSome("</tr>");	
                    	
                    	
                    	
                    }*/
                  
                    cDiv = new classDivHtmlObject("divLeft");
                    cDiv.appendSome(leftTable.toString());

                    cDivWrapperDati.appendSome(cDiv.toString());

                    cDiv = new classDivHtmlObject("divDati");
                    datiTable.addAttribute("width", String.valueOf(alIdenRichieste.size() * 100) + "px");
                    cDiv.appendSome(datiTable.toString());

                    cDivWrapperDati.appendSome(cDiv.toString());
                    cDivMain.appendSome(cDivWrapperDati.toString());

                    sOut += cDivMain.toString();

                }
            }
            // Esiti Consultati
              if ("".equals(idenRichiesta)) {
            	if (!idenRichieste.isEmpty() && ((!provChiamata.equals("MMG") && map_configurazioni.get("ESITI_CONSULTATI").equals("N")) || !this.fDB.bUtente.tipo.equals("M"))){
                    controllaDocumentiVisionati(idenRichieste);            		
            	}
            }

        }

        return sOut;
    }

    private classFormHtmlObject getFormDati(Element datiConf) {
        classFormHtmlObject form = new classFormHtmlObject("formDatiLabo", "", "");
        form.addAttribute("id", "formDatiLabo");

        form.appendSome(getInputHidden("dataMinima", datiConf.getChildText("DATAMINIMA")));
        form.appendSome(getInputHidden("codProRep", datiConf.getChildText("COD_PRO_REP")));

        Element datiAnag = datiConf.getChild("DATIANAG");

        appendDatiAnagrafici(form, datiAnag);

        return form;
    }

    private void appendDatiAnagrafici(classFormHtmlObject form, Element anagrafica) {
        form.appendSome(getInputHidden("cognome", anagrafica.getAttributeValue("COGNOME")));
        form.appendSome(getInputHidden("nome", anagrafica.getAttributeValue("NOME")));
        form.appendSome(getInputHidden("codfisc", anagrafica.getAttributeValue("CODFISC")));
        form.appendSome(getInputHidden("sesso", anagrafica.getAttributeValue("SESSO")));
        form.appendSome(getInputHidden("datanasc", anagrafica.getAttributeValue("DATANASC")));
        form.appendSome(getInputHidden("iden_anag", anagrafica.getAttributeValue("IDEN_ANAG")));
    }

    private classInputHtmlObject getInput(String id, String value, String type) {
        classInputHtmlObject input = new classInputHtmlObject(type, id, value);
        input.addAttribute("id", id);
        return input;
    }

    private classInputHtmlObject getInputHidden(String id, String value) {
        return this.getInput(id, value, "hidden");
    }

    private classColDataTable getTableColumn(String tagName, String text, String className) {
        classColDataTable column = new classColDataTable(tagName, "", text);
        column.addAttribute("class", className);
        return column;
    }

    private classColDataTable getTd(String text, String className) {
        return this.getTableColumn("TD", text, className);
    }

    private void readDati() {
        this.reparto = this.cParam.getParam("reparto").trim();
        this.idenRichiesta = this.cParam.getParam("idenRichiesta").trim();
        this.provChiamata = this.cParam.getParam("provChiamata").trim();
    }

    private org.jdom.Document getXml() throws SQLException, SqlQueryException {

        OracleCallableStatement cs = null;
        org.jdom.Document docXml = null;
        CLOB myLob = null;

        ArrayList listaReparti = this.fDB.bUtente.listaReparti;

        if (reparto != null && reparto.equals("")) {
            reparto = (String) listaReparti.get(0);
        }

        try {
            String sStat = "{ call CC_DATI_LABORATORIO.GET_XML_ESAMI_LABO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) }";
            cs = (OracleCallableStatement) this.fDB.getConnectData().prepareCall(sStat);

            cs.setString(1, param("modalita"));
            cs.setString(2, reparto);
            cs.setString(3, param("nosologico"));
            cs.setString(4, param("idPatient"));
            cs.setString(5, idenRichiesta);
            cs.setString(6, param("numRichieste"));
            cs.setString(7, param("giorni_ps"));
            cs.setString(8, param("daData"));
            cs.setString(9, param("aData"));
            cs.setString(10, param("elencoEsami"));
            cs.setString(11, param("provRisultati"));
            cs.setString(12, param("branca"));
            cs.registerOutParameter(13, Types.CLOB);
            cs.registerOutParameter(14, Types.VARCHAR);

            cs.executeUpdate();

            logInterface.info("fine GET_XML_ESAMI_LABO");

            myLob = cs.getCLOB(13);
            errorProcedure = cs.getString(14);

            /* ***** Output CLOB X DEBUG ******
		
             File data 			= new File("C:\\LOG_CLOB.txt");
             Reader reader 		= myLob.getCharacterStream();
             FileWriter writer 	= new FileWriter(data);
             char[] buffer 		= new char[1];

             while (reader.read(buffer) > 0) {
             writer.write(buffer);
             }
	
             writer.close();
		
             */
            InputStream is = myLob.getAsciiStream();

            if (errorProcedure != null && !errorProcedure.equals("")) {
                throw new Exception(errorProcedure);
            }

            SAXBuilder builder = new SAXBuilder();
            docXml = builder.build(new InputStreamReader(is, "ISO-8859-1"));

        } catch (Exception e) {
            logInterface.error("Errore Lancio GET_XML_ESAMI_LABO: ", e);
        } finally {
            try {
                cs.close();
                UtilityLobs.freeClob(myLob);
            } catch (SQLException e) {
                logInterface.error(e.getMessage(), e);
            }
        }
        return docXml;

    }

    private void controllaDocumentiVisionati(ArrayList<String> idenRich) {

        CallableStatement cs = null;

        try {
            Array oraIdenRichieste = new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", this.fDB.getConnectData()), this.fDB.getConnectData(), idenRich.toArray());

            String sStat = "{ call CC_LABO_CONFERMA_LETTURA(?, ?, ?) }";
            cs = this.fDB.getConnectData().prepareCall(sStat);

            cs.setInt(1, this.fDB.bUtente.iden_per);
            cs.setArray(2, oraIdenRichieste);
            cs.registerOutParameter(3, Types.VARCHAR);
            cs.executeUpdate();

            String error = cs.getString(3);

            if (error != null && !error.equals("")) {
                throw new Exception(error);
            }

        } catch (Exception e) {
            logInterface.error(e.getMessage(), e);
        } finally {
            try {
                cs.close();
            } catch (SQLException e) {
                logInterface.error(e.getMessage(), e);
            }

        }

    }

    @Override
    protected String getTitle() {
        return "";
    }

    @Override
    protected String getBottomScript() {
        return "";
    }

    private Map<String, Object> setInfoPazienteFromPrivacy(Element anagrafica) {
        Map<String, Object> paramPaziente = new HashMap<String, Object>();
        /*Parametri Anagrafici del XML*/
        paramPaziente.put("iden_anag", anagrafica.getAttributeValue("IDEN_ANAG"));
        paramPaziente.put("cognome", anagrafica.getAttributeValue("COGNOME"));
        paramPaziente.put("nome", anagrafica.getAttributeValue("NOME"));
        paramPaziente.put("comune_nascita", anagrafica.getAttributeValue("COMNASC"));
        paramPaziente.put("data_nascita", anagrafica.getAttributeValue("DATANASC"));
        paramPaziente.put("sesso", anagrafica.getAttributeValue("SESSO"));
        paramPaziente.put("codice_fiscale", anagrafica.getAttributeValue("CODFISC"));
        paramPaziente.put("id_remoto",anagrafica.getAttributeValue("ID_REMOTO"));        
        /*cod_dec_utente*/
        paramPaziente.put("codice_utente", this.bUtente.cod_dec);
        /*Parametri Generici Presi dalla request*/
        paramPaziente.put("emergenza_medica", this.hRequest.getParameter("emergenza_medica").trim());
       if(map_configurazione_privacy_labo!=null){
	        paramPaziente.put("builderClass", map_configurazione_privacy_labo.get("BUILDER"));
	        paramPaziente.put("predicateClass", map_configurazione_privacy_labo.get("PREDICATE_FACTORY"));
	        paramPaziente.put("assigning_authority", map_configurazione_privacy_labo.get("ASSIGNING_AUTHORITY"));
	        paramPaziente.put("query",map_configurazione_privacy_labo.get("QUERY"));
       }
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
