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
import imago.http.classHeadHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.classTDHtmlObject;
import imago.http.classTRHtmlObject;
import imago.http.classTableHtmlObject;
import imago.http.baseClass.baseUser;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import polaris.encoders.HTML;
import worklist.ImagoWorklistException;
import worklist.IworklistEngine;
import core.Global;


public class errorMsgEngine implements IworklistEngine {
    private HttpSession                 mySession;
    private ServletContext              myContext;
    private HttpServletRequest          myRequest;
    private baseUser                    logged_user=null;

    private String                      inputErrore = "";
    private String                      inputRicarica = "";
    private String                      inputCaricaOnTop = "";
    private String                      inputMsgToAdd = "";



    public errorMsgEngine (HttpSession myInputSession,
    ServletContext myInputContext,
    HttpServletRequest myInputRequest) throws
    ImagoWorklistException {
        // inizializzazione engine della worklist
        super();
        try {
            mySession = myInputSession;
            myContext = myInputContext;
            myRequest = myInputRequest;
            leggiDatiInput();
            //creaDocumentoHtml();
        } catch (ImagoWorklistException ex) {
            throw ex;
        }
    }

    private void leggiDatiInput() throws ImagoWorklistException {

        try {
            // parsing dati in ingresso
            this.inputErrore = classStringUtil.checkNull(myRequest.getParameter("errore"));
            this.inputRicarica = classStringUtil.checkNull(myRequest.getParameter("ricarica"));
            this.inputCaricaOnTop = classStringUtil.checkNull(myRequest.getParameter("caricaOnTop"));
            this.inputMsgToAdd = classStringUtil.checkNull(myRequest.getParameter("msgToAdd"));
            // valore di default S
            if (this.inputCaricaOnTop.equalsIgnoreCase("")){
                this.inputCaricaOnTop = "S";
            }
        } catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        }
    }

    public String addBottomJScode() {
        StringBuffer sb= new StringBuffer();
        sb.append("<SCRIPT>");
        sb.append("initGlobalObject()\n");
        sb.append("</SCRIPT>");
        return sb.toString();
    }

    public String addTopJScode() {

        StringBuffer sb= new StringBuffer();
        sb.append("<SCRIPT>");
        sb.append("var errore='"+ this.inputErrore +"'\n");
        sb.append("var ricarica='"+ this.inputRicarica +"'\n");
        sb.append("var varCaricaOnTop='" + this.inputCaricaOnTop + "'\n");
        sb.append("\n");
        sb.append("</SCRIPT>");
        return sb.toString();
    }

    public org.apache.ecs.html.Body creaBodyHtml() throws ImagoWorklistException {

        Body                            corpoHtml =null;
        try{
            corpoHtml = new Body();
            // crea tabella per errore
            corpoHtml.addElement(creaTabellaErrore());
            //*** FORMS
            corpoHtml.addElement(addForms());
            // disattivo pulsante destro
            classJsObject.setNullContextMenuEvent(corpoHtml,this.logged_user);
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
            initMainObjects();
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
    }


    public imago.http.classHeadHtmlObject creaHeadHtml() throws ImagoWorklistException {

        classJsObject               myJS = null;
        classHeadHtmlObject         testata = null;
        // Definisco Title del documento
        try {
            // definisco Head
            testata = new classHeadHtmlObject();
            // ********** includo i files ********
            if (this.logged_user!=null){
		testata.addElement ( classTabExtFiles.getIncludeString ( this.
			logged_user , "" , this.getClass ().getName () ,
				     this.myContext ) ) ;
	    }
            else{
                testata.addCssLink("std/css/errorMsg.css");
                testata.addJSLink("std/jscript/fillLabels.js");
                testata.addJSLink("std/jscript/errorMsgEngine.js");
            }
            //*****
            myJS = new classJsObject();
            // appendo array per gestione label
            if (this.logged_user!=null){
		testata.addJscode ( myJS.getArrayLabel ( "errorMsgEngine" ,
			this.logged_user ) ) ;
	    }
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


    private String addForms(){

        StringBuffer            sb=null;
        sb = new StringBuffer();
        // *****
        sb.append("\n");

        // ***** creo form per aggiornamento
        //sb.append(myFormUtil.getFormAggiorna(myRequest,"frmAggiorna","registraReferto", "POST",""));
        // *****
        sb.append("\n");
        return sb.toString();
    }

    private String creaTabellaErrore ()
    {
        StringBuffer                     sb = null;
        classTableHtmlObject             myTable = null;
        classTRHtmlObject                myTR = null;
        classTDHtmlObject                myTD = null;
        sb = new StringBuffer();
        myTable = new classTableHtmlObject();
        myTD = new classTDHtmlObject(new classLabelHtmlObject("","","lblTitolo"));
        myTR = new classTRHtmlObject();
        myTR.addAttribute("class","titolo");
        myTR.appendSome(myTD);
        myTable.appendSome(myTR);
        myTD = new classTDHtmlObject(new classLabelHtmlObject("","",this.inputErrore));
        myTD.appendSome("\n" + HTML.encode(this.inputMsgToAdd));
        myTR = new classTRHtmlObject();
        myTR.addAttribute("class","information");
        myTR.appendSome(myTD);
        myTable.appendSome(myTR);
        myTable.addAttribute("class","classErrorTable");
        sb.append(myTable.toString());
        return sb.toString();
    }


}
