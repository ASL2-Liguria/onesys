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
package gesUtilita.gesUtenti ;

import imago.http.ImagoHttpException;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imagoAldoUtil.classFormUtil;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoAldoUtil.structErroreControllo;
import imagoUtils.classJsObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import worklist.ImagoWorklistException;
import worklist.IworklistEngine;
import core.Global;

public class utentiActionListFilterEngine implements IworklistEngine {
    private HttpSession                 mySession;
    private ServletContext              myContext;
    private HttpServletRequest          myRequest;
    private baseUser                    logged_user=null;
    private baseGlobal                  infoGlobali=null;
    private basePC                      infoPC = null;

    private String                      inputTXTDADATA="", inputTXTADATA="";

    /** Creates a new instance of registraRefertoEngine */
    public utentiActionListFilterEngine(HttpSession myInputSession,
    ServletContext myInputContext,
    HttpServletRequest myInputRequest) throws
    ImagoWorklistException {
        // inizializzazione engine della worklist
        super();
        try {
            mySession = myInputSession;
            myContext = myInputContext;
            myRequest = myInputRequest;
            initMainObjects();
            leggiDatiInput();
            //creaDocumentoHtml();
        } catch (ImagoWorklistException ex) {
            throw ex;
        }
    }

    private void leggiDatiInput() throws ImagoWorklistException {

        try {
            // parsing dati in ingresso
            this.inputTXTDADATA = classStringUtil.checkNull(myRequest.getParameter("txtDaData"));
            this.inputTXTADATA = classStringUtil.checkNull(myRequest.getParameter("txtAData"));
        } catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        }
    }

    public String addBottomJScode() {
        StringBuffer sb= new StringBuffer();
        sb.append("<SCRIPT>");
        sb.append("var defaultFromDate='"+ this.inputTXTDADATA +"';\n");
        sb.append("var defaultToDate='"+ this.inputTXTADATA +"';\n");
        sb.append("initGlobalObject()\n");
        sb.append("</SCRIPT>");
        return sb.toString();
    }

    public String addTopJScode() {

        StringBuffer sb= new StringBuffer();
        sb.append("<SCRIPT>");
        // aggiungo vettori codici estrattiu dalla view

        sb.append("\n");
        sb.append("</SCRIPT>");
        return sb.toString();
    }

    public org.apache.ecs.html.Body creaBodyHtml() throws ImagoWorklistException {

        Body                            corpoHtml =null;
        classActionListFilterTable      myFilter = null;
        classFormHtmlObject             myForm = null;
        classDivHtmlObject              myDiv = null;

        try{
            corpoHtml = new Body();
            new structErroreControllo(false,"");


            myForm = new classFormHtmlObject("frmMain","utentiactionlistwk","POST","WkTraceUserMainFrame");
            // tabHeader
            myForm.appendSome(creaHeaderTabella().toString());
            // filtri
            myFilter = new classActionListFilterTable(new baseWrapperInfo(this.logged_user,this.infoGlobali,this.infoPC));
            myDiv = new classDivHtmlObject("divFilter");
            myDiv.appendSome(myFilter.getLayout().toString());
            myForm.appendSome(myDiv);
            // tabfooter
            myForm.appendSome(creaFooterTabella().toString());
            // campi hidden
            myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"hidWhere",""));
            myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"hidOrder",""));
            myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"hidUser",""));
            corpoHtml.addElement(myForm.toString());
            //*** FORMS
            corpoHtml.addElement(addForms());
            // appendo JS
            corpoHtml.addElement(addBottomJScode());
        }
        catch(java.lang.Exception ex){
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            throw newEx;
        }
        return corpoHtml;
    }

    public org.apache.ecs.Document creaDocumentoHtml() throws ImagoWorklistException {
        Document doc = null;

        doc = new Document();

        try {
            doc.setTitle(creaTitoloHtml());
            doc.setBody(creaBodyHtml());
            // attacco Head al documento
            doc.setHead(creaHeadHtml());
        } catch (java.lang.NullPointerException ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        } catch (ImagoWorklistException ex) {
            ex.printStackTrace();
            throw ex;
        }
        return doc;
    }

    private void initMainObjects(){
        this.logged_user = Global.getUser(mySession);
        this.infoPC = (basePC) mySession.getAttribute("parametri_pc");
        try{
            this.infoGlobali = baseRetrieveBaseGlobal.getBaseGlobal(this.myContext, this.mySession);
        }
        catch(ImagoHttpException ex){
            
        }
    }


    public imago.http.classHeadHtmlObject creaHeadHtml() throws ImagoWorklistException {

        classJsObject               myJS = null;
        classHeadHtmlObject         testata = null;
        // Definisco Title del documento
        try {
            // definisco Head
            testata = new classHeadHtmlObject();
            // ********** includo i files ********
            testata.addElement(classTabExtFiles.getIncludeString(this.logged_user,"",this.getClass().getName(),this.myContext));
            // **********
            //*****
            myJS = new classJsObject();
            // appendo array per gestione label
            testata.addJscode(myJS.getArrayLabel("utentiActionListFilterEngine",this.logged_user));
            // appendo Meta all'Head
            testata.addElement(creaMetaHtml());
            testata.addElement(addTopJScode());
            return testata;
        }catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        }
    }

    public imago.http.classMetaHtmlObject creaMetaHtml() throws ImagoWorklistException {
        classMetaHtmlObject MetaTag=null;

        MetaTag = new classMetaHtmlObject();
        return MetaTag;
    }

    public org.apache.ecs.html.Title creaTitoloHtml() throws ImagoWorklistException {
        // Definisco Title del documento
        try {
            Title titolo = new Title(" ");
            titolo.addAttribute("id", "htmlTitolo");
            return titolo;
        } catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        }
    }

    private classTabHeaderFooter creaHeaderTabella() throws ImagoWorklistException {

        classTabHeaderFooter            tabHeader = null;
        classLabelHtmlObject            myLabel = null;


        myLabel = new classLabelHtmlObject("", "","lbltitolo");
        tabHeader = new classTabHeaderFooter(myLabel);

        return tabHeader;

    }


    private classTabHeaderFooter creaFooterTabella() throws ImagoWorklistException {

        classTabHeaderFooter tabFooter = null;
        classDivHtmlObject              buttonContainer = null;
        classDivButton                  divButton=null;


        try {
            tabFooter = new classTabHeaderFooter("&nbsp;");
            tabFooter.setClasses("classTabHeader", "classTabFooterSx",
            "classTabHeaderMiddle", "classTabFooterDx");
            buttonContainer = new classDivHtmlObject("menuDDcontainer");
            divButton = new classDivButton("", "pulsante", "javascript:ShowHideLayer('divFilter');","btupdown","");
            buttonContainer.appendSome(divButton);
            divButton = new classDivButton("", "pulsante", "javascript:applica()","btSearch","");
            buttonContainer.appendSome(divButton);
            tabFooter.addColumn("classButtonHeaderContainer",buttonContainer.toString());
            return tabFooter;
        } catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        }
    }



    private String addForms(){

        StringBuffer            sb=null;
        sb = new StringBuffer();
        // *****
        sb.append("\n");
        sb.append(draw_form_calendar().toString());
        sb.append("\n");
        // ***** creo form per aggiornamento
        sb.append(classFormUtil.getFormAggiorna(myRequest,"frmAggiorna","utentiactionlistfilter", "POST",""));
        // *****
        sb.append("\n");
        return sb.toString();
    }

    public classFormHtmlObject draw_form_calendar()
       {
           classFormHtmlObject formCal = new classFormHtmlObject("frmCalendar", "SL_Calendar", "POST");

           formCal.addAttribute("id", "frmCalendar");
           formCal.addAttribute("target", "Calendario");
           formCal.appendSome(new classInputHtmlObject("hidden", "dataCal", ""));
           formCal.appendSome(new classInputHtmlObject("hidden", "dataObj", ""));

           return formCal;
    }


}
