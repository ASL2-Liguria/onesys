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
    File: consultazioneCalendarioGes.java
    Autore: Fra
 */

package cartellaclinica.gestioneProblemi;

import core.cache.CacheTabExtFiles;
import generic.statements.StatementFromFile;
import generic.utility.html.HeaderUtils;
import imago.http.classAHtmlObject;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classImgHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classSelectHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTableHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.obj.functionObj;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

public class listaProblemiRicoveroEngine extends functionObj {

    private StatementFromFile sff;
    private String FiltroCartella,idenVisita,idenRicovero,numNosologico,codCdc,idenAnag = new String("");
    private ElcoLoggerImpl logger = null;

    public listaProblemiRicoveroEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) throws Exception {
        super(cont, req, sess);
        this.logger = new ElcoLoggerImpl(this.getClass());
        sff = new StatementFromFile(sess);
    }

    public listaProblemiRicoveroEngine(ServletContext cont, HttpServletRequest req) throws Exception {
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


        try {
            classSelectHtmlObject cCombo = this.getCmbPriorita();

            this.readDati();

            cDoc.appendHead(this.createHead());

            cBody.addAttribute("onClick", "javascript:hideContextMenu();");
            cBody.addAttribute("onContextMenu", "javascript:return MenuTxDx();");

            HeadSection = new classTabHeaderFooter("Gestione Diagnosi");
            cBody.addElement(HeadSection.toString());

            classFormHtmlObject cForm = new classFormHtmlObject("formWkProblemi", "listaProblemiRicovero", "POST", "_self");
            cForm.addAttribute("style", "margin:0px;padding:0px;");
            cForm.appendSome(new classInputHtmlObject("hidden", "idenVisita", (idenVisita.equals("")?idenRicovero:idenVisita)));

            ResultSet rs = null;

            if(FiltroCartella.equals("IDEN_VISITA"))
                rs = sff.executeQuery("Problemi.xml","getWkProblemi",new String[]{idenVisita});
            else if(FiltroCartella.equals("NUM_NOSOLOGICO"))
                rs = sff.executeQuery("Problemi.xml","getWkProblemiNosologico",new String[]{numNosologico});
            else if(FiltroCartella.equals("ANAG_REPARTO"))
                rs = sff.executeQuery("Problemi.xml","getWkProblemiReparto",new String[]{idenAnag,codCdc});
            else if(FiltroCartella.equals("IDEN_ANAG"))
                rs = sff.executeQuery("Problemi.xml","getWkProblemiPaziente",new String[]{idenAnag});
            else if (FiltroCartella.equals("ANAG_STRUTTURA"))
            	rs = sff.executeQuery("Problemi.xml","getWkProblemiPazienteSpecialita",new String[]{idenAnag,codCdc});

            cTable = new classTableHtmlObject("100%");
            cTable.addAttribute("class", "classDataTable");
            cRow = new classRowDataTable();

            //cRow.addCol(new classColDataTable("th", "5%", "Risolto"));
            cRow.addCol(new classColDataTable("th", "35%", "Classificazione ICD"));
            cRow.addCol(new classColDataTable("th", "10%", "Inserito da"));
            //cRow.addCol(new classColDataTable("th", "20%", "Risolto da"));
            cRow.addCol(new classColDataTable("th", "30%", "NOTE"));
            cRow.addCol(new classColDataTable("th", "5%", "COD_CDC"));
            cRow.addCol(new classColDataTable("th", "10%", "Priorita'"));
            cRow.addCol(new classColDataTable("th", "10%", "Data"));

            cTable.appendSome(cRow.toString());

            while (rs.next()) {
                cRow = new classRowDataTable();

                cRow.addAttribute("id", rs.getString("IDEN_PROBLEMA"));
                cRow.addAttribute("tipoICD", rs.getString("TIPO_ICD"));
                //cRow.addAttribute("risolto", rs.getString("RISOLTO"));
                cRow.addAttribute("deleted", rs.getString("DELETED"));

                cCol = new classColDataTable("", "", "");
                /*
                if(rs.getString("DELETED").equals("S")){
                    cCol.addAttribute("class", "deleted");
                }else{
                    cCol.addAttribute("class", "risolto" + rs.getString("RISOLTO"));
                }
                cRow.addCol(cCol);*/

                cCol = new classColDataTable("", "", new classAHtmlObject("#", rs.getString("COD_ICD") + " - " + rs.getString("DESCR_ICD")));
                cCol.addAttribute("title", chkNull(rs.getString("NOTE")));
                cRow.addCol(cCol);

                cCol = new classColDataTable("", "", rs.getString("UTE_INS"));
                cCol.addAttribute("title", rs.getString("DATA_INS"));
                cRow.addCol(cCol);

                //cCol = new classColDataTable("", "", chkNull(rs.getString("UTE_RIS")));
                cCol = new classColDataTable("", "", chkNull(rs.getString("NOTE")));
                //cCol.addAttribute("title", chkNull(rs.getString("DATA_RIS")));
                cRow.addCol(cCol);
                cCol = new classColDataTable("", "", chkNull(rs.getString("COD_CDC")));
                cRow.addCol(cCol);

                cCombo.addAttribute("prioritaOriginale", chkNull(rs.getString("PRIORITA")));
                cCol = new classColDataTable("", "", cCombo);
                cRow.addCol(cCol);
                cCol = new classColDataTable("", "", chkNull(rs.getString("DATA_INS")));
                cRow.addCol(cCol);
                
                cTable.appendSome(cRow.toString());
            }

            sff.close();
            cForm.appendSome(cTable);
            cBody.addElement(cForm.toString());
            cBody.addElement(addContextMenu().toString());

            cDoc.setBody(cBody);
            sOut = cDoc.toString();

        } catch (SqlQueryException ex) {
            logger.error(ex);
            sOut = ex.getMessage();
        } catch (SQLException ex) {
            logger.error(ex);
            sOut = ex.getMessage();
        } finally {
            sff.close();
        }

        return sOut;
    }

    private void readDati() throws SQLException, SqlQueryException {
        this.FiltroCartella = this.cParam.getParam("FiltroCartella").trim();
        this.idenVisita = this.cParam.getParam("iden_visita").trim();
        this.idenRicovero = this.cParam.getParam("iden_ricovero").trim();
        this.numNosologico = this.cParam.getParam("ricovero").trim();
        this.codCdc = this.cParam.getParam("reparto").trim();
        this.idenAnag = this.cParam.getParam("iden_anag").trim();
    }

    private classHeadHtmlObject createHead() throws SQLException, SqlQueryException, Exception {
		return HeaderUtils.createHeadWithIncludes(this.getClass().getName(), hSessione);
    }

    private String chkNull(String input) {return (input == null?"":input);}

    private classDivHtmlObject addContextMenu() throws SQLException, Exception {

        classTableHtmlObject Table = null;
        classRowDataTable Row = null;
        classColDataTable Col = null;

        classDivHtmlObject Div = new classDivHtmlObject();

        Div.addAttribute("id", "contextualMenu");
        Div.addAttribute("Style", "position:absolute;visibility:hidden");

        Table = new classTableHtmlObject();
        Table.addAttribute("class", "ContextMenuLinks");
        Table.addAttribute("cellspacing", "0");
        Table.addAttribute("cellpadding", "0");
        Table.addAttribute("border", "0");

        Row = new classRowDataTable();

        Col = new classColDataTable("", "", "Gestione problemi");
        Col.addAttribute("class", "titleMenuOption");
        Col.addAttribute("colSpan", "2");
        Row.addCol(Col);

        Table.appendSome(Row.toString());

        ResultSet rs = sff.executeQuery("configurazioni.xml","getTabElemMenuDD",new String[]{"WK_PROBLEMI"});
        while(rs.next()){
            Row = new classRowDataTable();

            if(rs.getString("URLIMG") != null){
                Col = new classColDataTable("", "", new classImgHtmlObject(rs.getString("URLIMG"), "", "", 0, "30", "30"));
            }else{
                Col = new classColDataTable("", "","");
            }
            Col.addAttribute("class", "DropDownIcon");
            Row.addCol(Col);

            Col = new classColDataTable("", "", rs.getString("DESCRIZIONE"));
            Col.addAttribute("class", "ContextMenuNormal");
            Col.addAttribute("align", "right");
            Col.addEvent("onMouseOver", "javascript:this.className='ContextMenuOver'");
            Col.addEvent("onMouseOut", "javascript:this.className='ContextMenuNormal'");
            Col.addEvent("onClick", rs.getString("LINK"));
            Row.addCol(Col);

            Table.appendSome(Row.toString());

        }
        sff.close();

        Div.appendSome(Table);

        return Div;
    }

    private classSelectHtmlObject getCmbPriorita() throws SQLException, Exception {

        classSelectHtmlObject vSelect = new classSelectHtmlObject("cmbPriorita");

        //ResultSet rs = sff.executeQuery("configurazioni.xml", "getTabCodifiche", new String[] {"PROBLEMI","PRIORITA"});
        ResultSet rs = sff.executeQuery("configurazioni.xml", "getTabCodifiche", new String[] {"SCHEDA_DIAGNOSI","radTipoDia"});
        while (rs.next()) {
            vSelect.addOption(rs.getString("IDEN"), rs.getString("DESCRIZIONE"), false);
        }

        sff.close();
        return vSelect;
    }
}
