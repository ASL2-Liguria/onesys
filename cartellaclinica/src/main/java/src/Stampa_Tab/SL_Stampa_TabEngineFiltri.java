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
 * SL_Stampa_TabEngine.java
 *
 * Created on 8 agosto 2006, 15.56
 */

package src.Stampa_Tab;

import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.ImagoHttpException;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.baseUser;
import imagoUtils.classJsObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;
/**
 *
 * @author  fabioc
 */
public class SL_Stampa_TabEngineFiltri {
    private baseUser            LoggedUser;
    private HttpServletRequest  MYrequest;
    private CContextParam       myContextParam=null;
    CLogError                   log=null;

    /** Creates a new instance of SL_Stampa_TabEngine */
    public SL_Stampa_TabEngineFiltri(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest, CContextParam myConteParam) {
        LoggedUser=Global.getUser(myInputSession);
        MYrequest=myInputRequest;
        myContextParam=myConteParam;
         try{

        log=new CLogError(LoggedUser.db.getWebConnection(), myInputRequest, "SL_Stampa_TabFiltri", LoggedUser.login);
            log.setFileName("SL_Stampa_TabEngineFiltri");
            log.setClassName("src.Sel_Stampa.SL_Stampa_TabEngineFiltri");
         }
         catch(Exception ex){
            //System.out.println(ex);
           }
    }
    public org.apache.ecs.Document creaDocumentoHtml()  {
        Document doc = null;

        doc = new Document();

        doc.setHead(addHead(LoggedUser));
          doc.appendHead(addTopJScode());
        classJsObject label_js = new classJsObject();
        String jsLabel = null;
        try{
        jsLabel = label_js.getArrayLabel("SL_Stampa_TabEngine", LoggedUser);
        }
        catch(ImagoHttpException e){
        log.writeLog("Problemi nel trovare nella tabella delle lingue i client esatti ",CLogError.LOG_ERROR);}
        doc.appendHead(jsLabel);

        doc.setBody(creaBody());
        return doc;

    }

      public Body creaBody(){
        Body testo = new Body();
        //testo.setOnLoad("tutto_schermo();fillLabels(arrayLabelName,arrayLabelValue);");

        testo.addAttribute("onLoad", "fillLabels(arrayLabelName,arrayLabelValue);");
        testo.addAttribute("onDblClick", "return;");

        //tutto_schermo();
        testo.addElement(addTopJScode());
        classFormHtmlObject formNascostaStampaTab = new classFormHtmlObject("formNascostaStampaTab", "elabStampa", "POST","Stampa_Tab_elabStampe");
        //classFormHtmlObject formNascostaStampa = new classFormHtmlObject("formNascostaStampa", "elabStampa", "POST","LLelabStampe");
        classFormHtmlObject form = new classFormHtmlObject("formSta_Tab", "SL_Stampa_Tab_filtri", "POST");

        Scelta_CDC CDC= new Scelta_CDC(LoggedUser,MYrequest,myContextParam);
        CDC.creaCDC(form);
        SceltaTabella Tab= new SceltaTabella(LoggedUser,MYrequest,myContextParam);
        Tab.creaComboTabelle(form);
        SceltaOrdinamento ORD= new SceltaOrdinamento(LoggedUser,MYrequest,myContextParam);
        ORD.creaListBoxOrdi(form);
        SceltaType Typ= new SceltaType(LoggedUser,MYrequest,myContextParam);
        Typ.creaRadio(form);
        n_copie cop = new n_copie (LoggedUser,MYrequest,myContextParam);
        cop.creaTextnCopie(form);
        classLabelHtmlObject label_titolo=new classLabelHtmlObject("","","titolo");
        classTabHeaderFooter header = new classTabHeaderFooter(""+label_titolo);
        classDivButton apri_chiudi= new classDivButton("", "pulsante", "javascript:espandiFrameTab();", "apri_chiudi","");
        header.addColumn("classButtonHeader", apri_chiudi.toString());
        classTabHeaderFooter footer = new classTabHeaderFooter(" ");
        footer.setClasses("classTabHeader","classTabFooterSx","classTabHeaderMiddle","classTabFooterDx");
        classDivButton button_sel = new classDivButton("", "pulsante", "javascript:creaAnteprima();","ante","");
        footer.addColumn("classButtonHeader", button_sel.toString());

        classDivButton button_close = new classDivButton("", "pulsante", "javascript:chiudi();","chiudi","");
        header.addColumn("classButtonHeader", button_close.toString());
        classDivHtmlObject div = new classDivHtmlObject("div_imposta","display='block'");
        testo.addElement(header.toString());
        div.appendSome(form.toString());

        div.appendSome(footer.toString());
        testo.addElement(div.toString());
        FormNascosta FormDati =new FormNascosta();
        FormDati.CreaFormNascosta(formNascostaStampaTab);
        testo.addElement(formNascostaStampaTab.toString());
        classJsObject.setNullContextMenuEvent(testo,this.LoggedUser);
        return testo;
    }


        public classHeadHtmlObject addHead(baseUser logged_user){
        classHeadHtmlObject    testata=null;
        testata = new classHeadHtmlObject();
        new classJsObject();
        try{
            testata.addJSLink("std/jscript/tutto_schermo.js");
            testata.addCssLink("std/css/textArea.css");
            testata.addJSLink("std/jscript/fillLabels.js");
            testata.addCssLink("std/css/button.css");
            testata.addCssLink("std/css/dataEntryTable.css");
            testata.addCssLink("std/css/normalBody.css");
            //testata.addJSLink("std/jscript/ShowHideLayer.js");
            testata.addJSLink("std/jscript/src/SL_Stampa_Tab/SL_Stampa_Tab.js");
            testata.addJSLink("sdt/jscript/optionJsUtil.js");
            testata.addCssLink("std/css/headerTable.css");
            testata.addCssLink("std/css/dataTable.css");
            testata.addCssLink("std/css/dataEntryTable.css");
            testata.addCssLink("std/css/filterTable.css");
            //testata.addJSLink("sdt/jscript/src/ListeLavoro/SelDeselAll.js");
            //testata.addJscode(myJS.getArrayLabel("ServletLLFiltri",LoggedUser));

            /*Gestione del calendario*/
            testata.addCssLink("std/css/ImageX.css");


        } catch (Exception ex) {
            //System.out.println(ex);
        log.writeLog("Problemi nel creare la testata della pagina Html ",CLogError.LOG_ERROR);}
        return testata;
    }

        public String addTopJScode() {
        //setta le variabili nell'HTML che mi serviranno per creare l'activeX

        StringBuffer sb= new StringBuffer();
        sb.append(classJsObject.javaClass2jsClass((Object)this.LoggedUser));
        return sb.toString();
    }
}
