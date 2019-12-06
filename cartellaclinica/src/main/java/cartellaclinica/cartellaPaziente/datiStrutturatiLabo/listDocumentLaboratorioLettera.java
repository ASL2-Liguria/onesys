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
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.sql.SqlQueryException;
import it.elco.whale.converters.MapFactory;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import matteos.utils.XmlUtils;
import oracle.jdbc.OracleCallableStatement;
import oracle.sql.CLOB;

import org.apache.ecs.Doctype;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.json.JSONException;

import core.database.UtilityLobs;

public class listDocumentLaboratorioLettera extends servletEngine {

    private String reparto = "";
    private String errorProcedure = "";

    public listDocumentLaboratorioLettera(ServletContext pCont, HttpServletRequest pReq) {
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
        String sOut = "";
        classTableHtmlObject cTable = null;
        classColDataTable cColGruppo = null;
        org.jdom.Document xml = null;
        ArrayList<String> alAnalisi = new ArrayList<String>();
        int contCol = 0;
        String classCss;

        String tipoAnalisi;

        try {

            readDati();

            xml = getXml();

            super.BODY.addAttribute("class", "bodyCartella");

        } catch (Exception e) {

            sOut = e.getMessage();
            log.error(e.getMessage(), e);
        }

        //Procedura in Errore
        if (errorProcedure != null) {

            cTable = getTableError("Procedura in Errore");

        } else {
            if (!xml.getRootElement().getChild("ANALISI").getChildren().iterator().hasNext()) {

                cTable = getTableError("Nessun dato strutturato di laboratorio presente");                                

            } else {

                try {
                    // button 				= checkButton();

                    cTable = new classTableHtmlObject();
                    cTable.addAttribute("id", "tabRisultatiLabo");

                    classRowDataTable cRow = new classRowDataTable();
                    cRow.addAttribute("id", "head");

                    // 	TD Check All
                    classColDataTable cCol = new classColDataTable("TH", "", "<input type='checkbox' checked id='checkAll' onclick='DATI_STRUTTURATI_ALLEGA.de_seleziona_all(this)'/> <label for='checkAll'>Tutti</label>");
                    cCol.addAttribute("id", "thIntEsame");
                    cCol.addAttribute("width", "250px");
                    cRow.addCol(cCol);

                    // div di intestazione delle richieste #############      
                    contCol = 6;
                    Iterator iterator = xml.getRootElement().getChild("ANALISI").getChildren().iterator();

                    while (iterator.hasNext()) {

                        Element item = (Element) iterator.next();

                        alAnalisi.add(item.getAttributeValue("IDEN_RICHIESTA"));

                        cCol = new classColDataTable("TH", "", "<input type='checkbox' id='R" + item.getAttributeValue("IDEN_RICHIESTA") + "' class='chkIdenTestata' iden_testata='" + item.getAttributeValue("IDEN_RICHIESTA") + "' /><label class='lblCheckRichiestaPrestazione'> " + item.getAttributeValue("DATA").substring(6, 8) + "/" + item.getAttributeValue("DATA").substring(4, 6) + "/" + item.getAttributeValue("DATA").substring(0, 4) + "</label>");

                        if (item.getAttributeValue("COD_CDC").equals(reparto)) {
                            classCss = "thInt";
                        } else {
                            classCss = "thIntAltriRep";
                        }

                        cCol.addAttribute("class", classCss);
                        cCol.addAttribute("IDEN_RICHIESTA", item.getAttributeValue("IDEN_RICHIESTA"));
                        cCol.addAttribute("DESCRPROV", item.getAttributeValue("DESCR_CDC"));
                        cRow.addCol(cCol);
                        contCol += 1;

                    }

                    cTable.addAttribute("width", String.valueOf(550 + (alAnalisi.size() * 100)) + "px");

                    cCol = new classColDataTable("TH", "", "<label>V.MIN</label>");
                    cCol.addAttribute("class", "colValMinInt colIntestazione");
                    cCol.addAttribute("width", "75px");
                    cRow.addCol(cCol);

                    cCol = new classColDataTable("TH", "", "<label>V.MAX</label>");
                    cCol.addAttribute("class", "colValMaxInt colIntestazione");
                    cCol.addAttribute("width", "75px");
                    cRow.addCol(cCol);

                    cCol = new classColDataTable("TH", "", "<label>U.M.</label>");
                    cCol.addAttribute("class", "colUnMisInt colIntestazione");
                    cCol.addAttribute("width", "75px");
                    cRow.addCol(cCol);

                    cTable.appendSome(cRow.toString());

                    //	fine div di intestazione delle richieste ###################     
                } catch (Exception e) {
                    super.BODY.setOnLoad("setVisible();");
                    sOut = e.getMessage();
                    log.error(e.getMessage(), e);
                }

                try {
                    // Ciclo per Gruppo
                    int numrichieste = xml.getRootElement().getChild("ANALISI").getContentSize();
                    Iterator iterGruppi = xml.getRootElement().getChild("ESAMI").getChildren().iterator();

                    while (iterGruppi.hasNext()) {

                        // Add Intestazione Gruppo Tabella Esami
                        Element itemGruppo = (Element) iterGruppi.next();
                        classRowDataTable cRowGruppo = new classRowDataTable();
                        cRowGruppo.addAttribute("class", "gruppoEsami");

                        if (itemGruppo.getAttributeValue("DESCR_GRUPPO") != null && !itemGruppo.getAttributeValue("DESCR_GRUPPO").trim().equalsIgnoreCase("")) {
                            cColGruppo = new classColDataTable("TH", "", itemGruppo.getAttributeValue("DESCR_GRUPPO"));
                            cColGruppo.addAttribute("colspan", "" + (numrichieste + 4) + "");
                        }

                        cRowGruppo.addCol(cColGruppo);
                        cTable.appendSome(cRowGruppo.toString());

                        // Analisi Multiple   	  
                        Iterator iteratorAnalisiMulti = itemGruppo.getChildren().iterator();
                        while (iteratorAnalisiMulti.hasNext()) {

                            Element itemAnalisiMulti = (Element) iteratorAnalisiMulti.next();
                            if (itemAnalisiMulti.getAttributeValue("ATTIVO").equalsIgnoreCase("S")) {

                                classRowDataTable cRowEsameMulti = new classRowDataTable();
                                cRowEsameMulti.addAttribute("class", "rigaAnalisiMulti");
                                classColDataTable cColEsameMulti = new classColDataTable("TD", "", itemAnalisiMulti.getAttributeValue("DESCR"));
                                cColEsameMulti.addAttribute("colspan", String.valueOf(contCol));
                                cColEsameMulti.addAttribute("codiceEsame", itemAnalisiMulti.getAttributeValue("IDESAMEMULTIPLO"));
                                cRowEsameMulti.addCol(cColEsameMulti);
                                cTable.appendSome(cRowEsameMulti.toString());

                                tipoAnalisi = "S";

                            } else {
                                tipoAnalisi = "M";
                            }

                            // Ciclo Ogni Esame Per Gruppo   	  
                            Iterator iteratorEsami = itemAnalisiMulti.getChildren().iterator();
                            while (iteratorEsami.hasNext()) {

                                classRowDataTable cRowEsame = new classRowDataTable();
                                cRowEsame.addAttribute("class", "rigaEsame");
                                Element itemEsame = (Element) iteratorEsami.next();

                                classColDataTable cColEsame = new classColDataTable("TH", "", "<input type='checkbox' id='" + itemEsame.getAttributeValue("IDEN_TAB_ESA") + "' cod_dec='" + itemEsame.getAttributeValue("CODICEESA") + "' class='chkIdEsameSingolo' /><label class='lblCheckRichiestaPrestazione'>" + itemEsame.getAttributeValue("DESCR") + " " + super.chkNull(itemEsame.getAttributeValue("MATERIALE")) + " " + super.chkNull(itemEsame.getAttributeValue("PROVENIENZA")) + "</label>");

                                if (tipoAnalisi.equalsIgnoreCase("S")) {
                                    cColEsame.addAttribute("class", "colEsameSingolo");
                                } else {
                                    cColEsame.addAttribute("class", "colEsameMultiplo");
                                }

                                cRowEsame.addCol(cColEsame);

                                for (int i = 0; i < alAnalisi.size(); i++) {
                                    List elms = XmlUtils.getNodesByXpath(itemEsame, "/ROOT/ESAMI//ESAME[@COD_DEC='"+itemEsame.getAttributeValue("COD_DEC")+"' and @CODICE_MATERIALE='"+super.chkNull(itemEsame.getAttributeValue("CODICE_MATERIALE"))+"' and @PROVENIENZA='"+super.chkNull(itemEsame.getAttributeValue("PROVENIENZA"))+"']/*[@IDEN_RICHIESTA='"+alAnalisi.get(i)+"']");
                                    // Controllo iden_richiesta del Risultato. Se Corrisponde alla posizione alAnalisi.get(i) Lo Inserisco
                                    if (elms.size() > 0) {
                                        Element itemRichiesta = (Element) elms.get(0);
                                        cColEsame = new classColDataTable("TD", "", itemRichiesta.getValue());

                                        cColEsame.addAttribute("ID_WHALE", super.chkNull(itemRichiesta.getAttributeValue("IDEN_RICHIESTA")));

                                        if (itemRichiesta.getAttributeValue("COLORE") != null && !itemRichiesta.getAttributeValue("COLORE").equals("")) {

                                            if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("BLUE")) {

                                                if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")) {
                                                    cColEsame.addAttribute("style", "COLOR:blue; FONT-WEIGHT:BOLD;  background:#DCE0E0;");
                                                } else {
                                                    cColEsame.addAttribute("style", "COLOR:blue; FONT-WEIGHT:BOLD; ");
                                                }

                                            } else if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("RED")) {

                                                if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")) {
                                                    cColEsame.addAttribute("style", "COLOR:red; FONT-WEIGHT:BOLD;  background:#DCE0E0;");
                                                } else {
                                                    cColEsame.addAttribute("style", "COLOR:red; FONT-WEIGHT:BOLD; ");
                                                }
                                            }
                                        } else if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")) {
                                            cColEsame.addAttribute("style", "background:#DCE0E0;");
                                        }

                                        cRowEsame.addCol(cColEsame);
                                    } else {

                                        // Add Colonna Vuota
                                        cColEsame = new classColDataTable("TD", "", "&nbsp");
                                        cRowEsame.addCol(cColEsame);
                                    }
                                }

                                cColEsame = new classColDataTable("TD", "", itemEsame.getAttributeValue("VALORERIFMIN") + "&nbsp;");
                                cColEsame.addAttribute("class", "colValMin");
                                cRowEsame.addCol(cColEsame);

                                cColEsame = new classColDataTable("TD", "", itemEsame.getAttributeValue("VALORERIFMAX") + "&nbsp;");
                                cColEsame.addAttribute("class", "colValMax");
                                cRowEsame.addCol(cColEsame);

                                cColEsame = new classColDataTable("TD", "", itemEsame.getAttributeValue("UNMISURA").replace("µ", "&#956;") + "&nbsp;");
                                cColEsame.addAttribute("class", "colUnMis");
                                cRowEsame.addCol(cColEsame);

                                cTable.appendSome(cRowEsame.toString());

                            }
                        }
                    }

                } catch (Exception e) {

                    sOut = e.getMessage();
                    log.error(e.getMessage(), e);
                }

            }

            sOut += cTable.toString();

        }

        return sOut;
    }

    private classTableHtmlObject getTableError(String message) {
        classTableHtmlObject cTable = new classTableHtmlObject();
        cTable.addAttribute("id", "tabNoDatiLabo");

        classRowDataTable cRowNoDatiLabo = new classRowDataTable();
        cRowNoDatiLabo.addAttribute("id", "trNoDatiLabo");

        classColDataTable cColNoDatiLabo = new classColDataTable("TD", "", message);
        cColNoDatiLabo.addAttribute("id", "tdNoDatiLabo");

        cRowNoDatiLabo.addCol(cColNoDatiLabo);
        cTable.appendSome(cRowNoDatiLabo.toString());
        return cTable;
    }

    private void readDati() {
        this.reparto = this.cParam.getParam("reparto").trim();
    }

    private org.jdom.Document getXml() throws SQLException, SqlQueryException, JSONException, Exception {

        OracleCallableStatement cs = null;
        org.jdom.Document docXml = null;
        
        String idenRichiesta = param("idenRichiesta");

        String[] datiPs = checkRisultatiPs();
        CLOB myLob = null;    
        if (reparto != null && reparto.equals("")) {
            reparto = this.fDB.bUtente.listaReparti.get(0);
        }
        try {

            String sStat = "{ call CC_DATI_LABORATORIO.GET_XML_ESAMI_LABO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) }";
            cs = (OracleCallableStatement) this.fDB.getConnectData().prepareCall(sStat);

            cs.setString(1, param("modalita"));
            cs.setString(2, reparto);
            cs.setString(3, param("nosologico"));
            cs.setString(4, param("idPatient"));
            cs.setString(5, idenRichiesta);
            cs.setString(6, "TUTTE");

            if (datiPs[0].equals("S") && idenRichiesta.equals("")) {
                cs.setString(7, datiPs[1]);
            } else {
                cs.setString(7, null);
            }

            cs.setString(8, param("daData"));
            cs.setString(9, param("aData"));
            cs.setString(10, param("elencoEsami"));
            cs.setString(11, param("provRisultati"));
            cs.setString(12, "");
            cs.registerOutParameter(13, Types.CLOB);
            cs.registerOutParameter(14, Types.VARCHAR);

            cs.executeUpdate();

            log.warn("fine GET_XML_ESAMI_LABO");

            myLob = cs.getCLOB(13);
            errorProcedure = cs.getString(14);

            InputStream is = myLob.getAsciiStream();

            if (errorProcedure != null && !errorProcedure.equals("")) {
                throw new Exception(errorProcedure);
            }

            SAXBuilder builder = new SAXBuilder();
            docXml = builder.build(new InputStreamReader(is, "ISO-8859-1"));

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        } finally {
            try {
                cs.close();
                UtilityLobs.freeClob(myLob);
            } catch (SQLException e) {
                log.error(e.getMessage(), e);
            }
        }
        return docXml;

    }

    private String[] checkRisultatiPs() throws SQLException, JSONException, Exception {

        Map<String, Object> map_configurazioni = MapFactory.fromJSonString(bReparti.getValue(reparto, "CONFIG_DATI_STRUTTURATI_LABO"));

        // Configurazione Risultati PS
        List<Map<String, String>> ps = (List<Map<String, String>>) map_configurazioni.get("PS");
        String result[] = {ps.get(0).get("dati"), ps.get(0).get("giorni").toString()};

        return result;

    }

    @Override
    protected String getTitle() {
        return "";
    }

    @Override
    protected String getBottomScript() {
        return "";
    }

}
