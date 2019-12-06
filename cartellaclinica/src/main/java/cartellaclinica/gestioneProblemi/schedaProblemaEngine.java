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
/*
    File: schedaProblemaEngine.java
    Autore: Fra
 */

package cartellaclinica.gestioneProblemi;

import core.cache.CacheTabExtFiles;
import generic.statements.StatementFromFile;
import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classSelectHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTableHtmlObject;
import imago.http.classTextAreaHtmlObject;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.obj.functionObj;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

public class schedaProblemaEngine extends functionObj {

    private StatementFromFile sff;
    private int idProblema = 0;
    private String idenVisita = new String("");
    private String tipoICD = new String("");

    public schedaProblemaEngine(ServletContext cont, HttpServletRequest req,
                                HttpSession sess) throws Exception {
        super(cont, req, sess);
        sff = new StatementFromFile(sess);
    }

    public schedaProblemaEngine(ServletContext cont, HttpServletRequest req) throws Exception {
        this(cont, req, req.getSession(false));
    }

    public String gestione() throws Exception {
        String sOut = new String("");

        Document cDoc = new Document();
        Body cBody = new Body();
        classTabHeaderFooter HeadSection = null;
        classTableHtmlObject cTable = null;
        classRowDataTable cRow = null;
        classColDataTable cCol = null;

        String idenICD = new String("");

        String descrICD = new String("");
        String note = new String("");
        String uteIns = new String("");
        String uteRis = new String("");
        String uteMod = new String("");
        String risolto = new String("N");
        int priorita = 0;
        try {

            this.readDati();

            if (idProblema > 0) {
                ResultSet rs = sff.executeQuery("Problemi.xml","getProblema",new String[]{String.valueOf(idProblema)});
                if (rs.next()) {
                    idenICD = rs.getString("IDEN_ICD");
                    tipoICD = rs.getString("TIPO_ICD");
                    descrICD = rs.getString("DESCR_ICD");
                    note = chkNull(rs.getString("NOTE"));
                    uteIns = chkNull(rs.getString("UTE_INS")) + " - " + chkNull(rs.getString("DATA_INS"));
                    uteRis = chkNull(rs.getString("UTE_RIS")) + " - " + chkNull(rs.getString("DATA_RIS"));
                    uteMod = chkNull(rs.getString("UTE_MOD")) + " - " + chkNull(rs.getString("DATA_MOD"));
                    priorita = rs.getInt("PRIORITA");
                    risolto = chkNull(rs.getString("RISOLTO"));
                }
                sff.close();
            }

            cDoc.appendHead(this.createHead());
            //cBody.addAttribute("onUnload", "javascript:aggiornaOpener();");

            HeadSection = new classTabHeaderFooter("Scheda Probemi Sanitari Correlati");
            cBody.addElement(HeadSection.toString());

            cTable = new classTableHtmlObject("100%");
            cTable.addAttribute("class", "classDataTable");

            cRow = new classRowDataTable(); //row con risolto e priorita'
            cCol = new classColDataTable("", "10%", "Risolto");
            cCol.addAttribute("class", "classTdLabel");
            cRow.addCol(cCol);
            cCol = new classColDataTable("", "40%", "");
            cCol.addAttribute("class", "risolto" + risolto);
            cCol.addAttribute("risolto", risolto);
            cCol.addAttribute("id","tdRisolto");
            cRow.addCol(cCol);
            cCol = new classColDataTable("", "10%", "Priorita'");
            cCol.addAttribute("class", "classTdLabel");
            cRow.addCol(cCol);

            classSelectHtmlObject cCombo = this.getCmbPriorita();
            cCombo.addAttribute("prioritaOriginale", String.valueOf(priorita));
            cCol = new classColDataTable("", "40%", cCombo);
            cCol.addAttribute("class", "classTdField");
            cRow.addCol(cCol);
            cTable.appendSome(cRow.toString());

            cRow = new classRowDataTable(); //row con il codice icd
            cCol = new classColDataTable("", "10%", "Classificazione ICD");
            cCol.addAttribute("class", "classTdLabel LinkICD");

            cRow.addCol(cCol);

            cCol = new classColDataTable("", "90%","");
            classLabelHtmlObject cLabel = new classLabelHtmlObject(descrICD,"","lblClassificazioneICD");
            cLabel.addAttribute("idenIcd",idenICD);
            cCol.appendSome(cLabel);
            classDivHtmlObject cDivAcr = new classDivHtmlObject("clsACR");
            cCol.appendSome(cDivAcr);

            cCol.addAttribute("class", "classTdField");
            cCol.addAttribute("colSpan", "3");
            cRow.addCol(cCol);
            cTable.appendSome(cRow.toString());

            cRow = new classRowDataTable(); // row con il textarea delle note
            cCol = new classColDataTable("", "10%", "Note");
            cCol.addAttribute("class", "classTdLabel");
            cRow.addCol(cCol);
            cCol = new classColDataTable("", "90%", new classTextAreaHtmlObject("txtNote", note, "6", "100"));
            cCol.addAttribute("class", "classTdField");
            cCol.addAttribute("colSpan", "3");
            cRow.addCol(cCol);
            cTable.appendSome(cRow.toString());

            cRow = new classRowDataTable(); // row con il medico inserente
            cCol = new classColDataTable("", "10%", "Inserito da");
            cCol.addAttribute("class", "classTdLabel");
            cRow.addCol(cCol);
            cCol = new classColDataTable("", "90%", uteIns);
            cCol.addAttribute("class", "classTdField");
            cCol.addAttribute("colSpan", "3");
            cRow.addCol(cCol);
            cTable.appendSome(cRow.toString());

            cRow = new classRowDataTable(); // row con il medico risolutore
            cCol = new classColDataTable("", "10%", "Risolto da");
            cCol.addAttribute("class", "classTdLabel");
            cRow.addCol(cCol);
            cCol = new classColDataTable("", "90%", uteRis);
            cCol.addAttribute("class", "classTdField");
            cCol.addAttribute("colSpan", "3");
            cRow.addCol(cCol);
            cTable.appendSome(cRow.toString());

            cRow = new classRowDataTable(); // row con il medico modificante
            cCol = new classColDataTable("", "10%", "Ultima modifica di");
            cCol.addAttribute("class", "classTdLabel");
            cRow.addCol(cCol);
            cCol = new classColDataTable("", "90%", uteMod);
            cCol.addAttribute("class", "classTdField");
            cCol.addAttribute("colSpan", "3");
            cRow.addCol(cCol);
            cTable.appendSome(cRow.toString());

            cBody.addElement(cTable.toString());

            HeadSection = new classTabHeaderFooter("&nbsp;");
            HeadSection.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
            HeadSection.addColumn("classButtonHeader", new classDivButton("registra", "pulsante", "javascript:registra();", "P", "").toString());
            cBody.addElement(HeadSection.toString());

            classFormHtmlObject cForm = new classFormHtmlObject("EXTERN", "", "", "");
            cForm.addAttribute("style", "margin:0px;padding:0px;");
            cForm.appendSome(new classInputHtmlObject("hidden", "idenVisita", idenVisita));
            cForm.appendSome(new classInputHtmlObject("hidden", "tipoICD", tipoICD));
            cForm.appendSome(new classInputHtmlObject("hidden", "idProblema", String.valueOf(idProblema)));

            cBody.addElement(cForm.toString());

            cDoc.setBody(cBody);
            sOut = cDoc.toString();
        } catch (SqlQueryException ex) {
            sOut = ex.getMessage();
        } catch (SQLException ex) {
            sOut = ex.getMessage();
        }

        return sOut;
    }

    private void readDati() throws SQLException, SqlQueryException {

        this.idenVisita = this.cParam.getParam("idenVisita").trim();

        if (this.cParam.getParam("idProblema").trim() != null && !this.cParam.getParam("idProblema").trim().equals(""))
            this.idProblema = Integer.valueOf(this.cParam.getParam("idProblema").trim());
        if (this.cParam.getParam("tipoICD").trim() != null && !this.cParam.getParam("tipoICD").trim().equals(""))
            this.tipoICD = this.cParam.getParam("tipoICD").trim();
    }

    private classHeadHtmlObject createHead() throws SQLException, SqlQueryException, Exception {
		return HeaderUtils.createHeadWithIncludes(this.getClass().getName(), hSessione);
    }

    private String chkNull(String input) {
        return (input == null ? "" : input);
    }

    private classSelectHtmlObject getCmbPriorita() throws SQLException, Exception {

        classSelectHtmlObject vSelect = new classSelectHtmlObject("cmbPriorita");

        ResultSet rs = sff.executeQuery("configurazioni.xml", "getTabCodifiche", new String[] {"PROBLEMI","PRIORITA"});
        while (rs.next()) {
            vSelect.addOption(rs.getString("IDEN"), rs.getString("DESCRIZIONE"), false);
        }

        sff.close();
        return vSelect;
    }

}
