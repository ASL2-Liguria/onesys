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
 * winCheckUserEngine.java
 *
 * Created on 4 luglio 2006, 11.04
 */

package winPopup;

import imago.http.ImagoHttpException;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.classSelectHtmlObject;
import imago.http.classTDHtmlObject;
import imago.http.classTRHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTableHtmlObject;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imago.sql.TableResultSet;
import imagoAldoUtil.classFormUtil;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import java.sql.ResultSet;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import worklist.ImagoWorklistException;
import core.Global;

/**
 *
 * @author  aldo
 */
public class winCheckUserEngine implements worklist.IworklistEngine {


    HttpSession                         mySession;
    ServletContext                      myContext;
    HttpServletRequest                  myRequest;

    private baseGlobal                  infoGlobali=null;
    private basePC                      infoPC = null;
    private baseWrapperInfo             myBaseInfo =null;
    private baseUser                    logged_user=null;


    String                              inputFunctionToCall="", inputUser="", inputCryptoType="", inputLoginLocked="N";
    String                              inputCdcLocked="", inputCdcDefault="";

    /** Creates a new instance of winCheckUserEngine */
    public winCheckUserEngine(HttpSession myInputSession,
    ServletContext myInputContext,
    HttpServletRequest myInputRequest
    ) throws
    ImagoWorklistException {
        // inizializzazione engine della worklist
        super();
        try {
            this.mySession = myInputSession;
            this.myContext = myInputContext;
            this.myRequest = myInputRequest;
            // ATTENZIONE
            initMainObjects();
            // *******
            leggiDatiInput();
            //creaDocumentoHtml();
        } catch (ImagoWorklistException ex) {
            throw ex;
        }
    }

    private void initMainObjects(){


        this.logged_user = Global.getUser(mySession);
        this.infoPC = (basePC) mySession.getAttribute("parametri_pc");
        try{
            this.infoGlobali = baseRetrieveBaseGlobal.getBaseGlobal(this.myContext, this.mySession);
        }
        catch(ImagoHttpException ex){
        }
        this.myBaseInfo = new baseWrapperInfo(this.logged_user, this.infoGlobali,this.infoPC);
    }


    /**
     * metodo che aggiunge codice js in testa alla pagina
     *
     */
    public String addTopJScode() {
        StringBuffer sb = new StringBuffer();
        // appendo codice JS
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getGlobal()));
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getUser()));
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getPC()));
        sb.append("<SCRIPT>\n");
        if (this.inputLoginLocked.equalsIgnoreCase("S")){
            sb.append("var loginLocked = true;\n");
        }
        else{
            sb.append("var loginLocked = false;\n");
        }
        sb.append("</SCRIPT>");
        return sb.toString();
    }

    /**
     * metodo che aggiunge codice js in fondo alla pagina
     *
     */
    public String addBottomJScode() {
        StringBuffer sb = new StringBuffer();
        // appendo codice JS
        sb.append("<SCRIPT>");
        sb.append("initGlobalObject();\n");
        sb.append("</SCRIPT>");
        return sb.toString();
    }

    public org.apache.ecs.html.Body creaBodyHtml() throws worklist.ImagoWorklistException {
        Body                    corpoHtml = null;
        classFormHtmlObject     myForm = null;
        try {
            // estropolo dati per connessione DB
            // definisco body
            corpoHtml = new Body();
            myForm = new classFormHtmlObject("frmMain","", "POST", "wndCheckDb");

            myForm.appendSome(this.creaHeaderTabella().toString());
            myForm.appendSome(this.creaLayerLogin().toString());
            myForm.appendSome(this.creaFooterTabella().toString());
            corpoHtml.addElement(myForm.toString());
            // aggiunge codice JS in fondo pagina
            corpoHtml.addElement(addBottomJScode());
            // disattivo pulsante destro
            classJsObject.setNullContextMenuEvent(corpoHtml,this.logged_user);
            // *** aggiungo le forms
            corpoHtml.addElement(addForms());
            // ****
            corpoHtml.addElement("\n");
            return corpoHtml;
        }
        catch(java.lang.Exception ex){
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            throw newEx;
        }

    }


    public classHeadHtmlObject creaHeadHtml() throws ImagoWorklistException {
        classHeadHtmlObject testata = null;
        classJsObject myJS = null;

        // Definisco Title del documento
        try {
            myJS = new classJsObject();
            // definisco Head
            testata = new classHeadHtmlObject();
            // carico le label dinamiche e i msg js
            testata.addElement(myJS.getArrayLabel("winCheckUser", this.logged_user));

            // ********** includo i files ********
            testata.addElement(classTabExtFiles.getIncludeString(this.logged_user,"",this.getClass().getName(),this.myContext));
            // **********

            // appendo Meta all'Head
            testata.addElement(creaMetaHtml());
            testata.addElement(addTopJScode());
            return testata;
        } catch (ImagoWorklistException ex) {
            ex.printStackTrace();
            throw ex;
        } catch (java.lang.NullPointerException ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        } catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        }
    }

    public Document creaDocumentoHtml() throws ImagoWorklistException {

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

    /**
     * metodo che crea l'oggetto TITLE
     */
    public Title creaTitoloHtml() throws ImagoWorklistException {

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


    /**
     * metodo che crea l'oggetto META
     */
    public classMetaHtmlObject creaMetaHtml() throws ImagoWorklistException {

        classMetaHtmlObject MetaTag = null;
        // Definisco Title del documento
        try {
            MetaTag = new classMetaHtmlObject();
            return MetaTag;
        } catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        }
    }

    private classDivHtmlObject creaLayerLogin() throws ImagoWorklistException{
        classTableHtmlObject        myHtmlTable=null;
        classTRHtmlObject           myTR=null;
        classTDHtmlObject           myTD = null;
        classInputHtmlObject        myInput = null;
        classLabelHtmlObject        myLabel = null;
        classSelectHtmlObject       mySelect=null;
        TableResultSet              myTable = null;
        String                      strReparto = "";
        ResultSet                   rs = null;

        int                         numeroCdc =0;

        // LAYER di LOGIN
        classDivHtmlObject myDivLayerLogin = new classDivHtmlObject("oLayMain");
        myHtmlTable = new classTableHtmlObject("200");
        myHtmlTable.addAttribute("class","classDataEntryTable");
        myTR = new classTRHtmlObject();
        myLabel = new classLabelHtmlObject("", "","lblLogin");
        myTD = new classTDHtmlObject(myLabel.toString(),"100");
        myTD.addAttribute("class","classTdLabel");
        // appendo colonna
        myTR.appendSome(myTD);
        myTD = new classTDHtmlObject();
        myTD.addAttribute("class","classTdField");
        myInput = new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"UserName",this.inputUser,"15");
        myInput.addEvent("onkeypress","javascript:intercetta_tasti();");
        myInput.addEvent("onblur","javascript:reloadCdc();");
        myInput.addAttribute("tabindex","0");
        if (this.inputLoginLocked.equalsIgnoreCase("S")){
            myInput.setReadOnly(true);
        }
        myTD.appendSome(myInput);
        myTR.appendSome(myTD);
        myTD = new classTDHtmlObject();
        // DEVO INSERIRE IMMAGINE per fare cambia password
        classDivButton myDivLogin = new classDivButton("", "pulsante", "javascript:verifica_pwd();","btLogin","");
        myTD.appendSome(myDivLogin.toString());
        myTR.appendSome(myTD);
        myHtmlTable.appendSome(myTR);
        // 2 riga
        myTR = new classTRHtmlObject();
        myLabel = new classLabelHtmlObject("", "","lblPassword");
        myTD = new classTDHtmlObject(myLabel.toString(),"100");
        myTD.addAttribute("class","classTdLabel");
        myTR.appendSome(myTD);
        myTD = new classTDHtmlObject();
        myTD.addAttribute("class","classTdField");
        myInput = new classInputHtmlObject(classTypeInputHtmlObject.typePASSWORD,"Password","","15");
        myInput.addEvent("onkeypress","javascript:intercetta_tasti();");
        myInput.addAttribute("tabindex","1");
        myTD.appendSome(myInput);
        //
        myTR.appendSome(myTD);
        myTD = new classTDHtmlObject();
        // DEVO INSERIRE IMMAGINE per fare login
        classDivButton myDivPwd = new classDivButton("", "pulsante", "javascript:chiudi();","oLinkPsw","");
        myTD.appendSome(myDivPwd.toString());
        myTR.appendSome(myTD);
        myHtmlTable.appendSome(myTR);
        // *******************************
        // ** inserire riga per il cdc ***
        // *******************************
        myTR = new classTRHtmlObject();
        myLabel = new classLabelHtmlObject("", "","lblCdc");
        myTD = new classTDHtmlObject(myLabel.toString(),"100");
        myTD.addAttribute("class","classTdLabel");
        myTR.appendSome(myTD);
        mySelect = new classSelectHtmlObject("selCdc");

        classRsUtil myUtil = new classRsUtil();
        try{

            String sql = "Select * from view_CdcAttivi_Utente";
            sql = sql + " where webuser='" + this.inputUser +"' and attivo='S'";
            myTable = new TableResultSet();
            rs = myTable.returnResultSet(this.logged_user.db.getWebConnection(),sql);
            if (rs.next()){
                rs.last();
                numeroCdc = rs.getRow();
                rs.beforeFirst();
            }
            // controllo che se e' il cdc e' lockato DEVO
            // avere un solo option con CDC quello di default
            if (this.inputCdcLocked.equalsIgnoreCase("S")){
                // controllo cmq se nominativo esiste
                if (numeroCdc>0){
                    // deve esistere il reparto
                    if (!this.inputCdcDefault.equalsIgnoreCase("")){
                        // aggiungo solo quel CDC
                        mySelect.addOption(this.inputCdcDefault,this.inputCdcDefault,true);
                    }
                    else{
                        // errore CDC nullo
                        ImagoWorklistException newEx = new ImagoWorklistException("winCheckUserEngine - creaBody . Errore Cdc nullo");
                        throw newEx;
                    }
                    mySelect.setDisabled(true);
                }
            }
            else{

                // il CDC non e' bloccato
                while (rs.next()){
                    strReparto = myUtil.returnStringFromRs(rs,"reparto");
                    if (numeroCdc==1){
                        mySelect.addOption(strReparto,strReparto,true);
                    }
                    else{
                        if (this.inputCdcDefault.equalsIgnoreCase(strReparto)){
                            mySelect.addOption(strReparto,strReparto,true);
                        }
                        else{
                            mySelect.addOption(strReparto,strReparto,false);
                        }
                    }
                }
            }

        }
        catch(java.lang.Exception ex){
            ex.printStackTrace();
        }
        finally{
            try{
                rs.close();
                rs = null ;
                myTable.close () ;
		myTable = null ;
            }
            catch(java.lang.Exception ex){
            }
        }
        mySelect.addAttribute("id","idCdc");
        myTD = new classTDHtmlObject(mySelect);
        myTD.addAttribute("class","classTdField");
        myTR.appendSome(myTD);
        myHtmlTable.appendSome(myTR);

        // appendo tabella al layer
        myDivLayerLogin.appendSome(myHtmlTable);
        return myDivLayerLogin;
    }


    /**
     * metodo che legge i dati in input
     * dell'oggetto Request
     */
    private void leggiDatiInput() throws ImagoWorklistException {

        try {
            // parsing dati in ingresso
            this.inputCryptoType= classStringUtil.checkNull(myRequest.getParameter("hidCryptoType"));
            this.inputFunctionToCall = classStringUtil.checkNull(myRequest.getParameter("hidFunctionToCall"));
            this.inputLoginLocked = classStringUtil.checkNull(myRequest.getParameter("hidLoginLocked"));
            // indica se il cdc deve essere bloccato o meno
            this.inputCdcLocked = classStringUtil.checkNull(myRequest.getParameter("hidCdcLocked"));
            // indica il cdc di default (si intende il codice)
            this.inputCdcDefault = classStringUtil.checkNull(myRequest.getParameter("hidCdcDefault"));
            this.inputUser = classStringUtil.checkNull(myRequest.getParameter("hidUser"));

        } catch (java.lang.NullPointerException ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        } catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        }
    }

    // creazione heder della tabella
    private classTabHeaderFooter creaHeaderTabella()  {

        classTabHeaderFooter tabHeader = null;
        classLabelHtmlObject myLabel = null;
        myLabel = new classLabelHtmlObject("&nbsp;", "", "lbltitolo");
        tabHeader = new classTabHeaderFooter(myLabel);
        return tabHeader;

    }

    // creazione del footer della tabella
    private classTabHeaderFooter creaFooterTabella() throws ImagoWorklistException {

        classTabHeaderFooter tabFooter = null;

        try {
            tabFooter = new classTabHeaderFooter("&nbsp;");
            tabFooter.setClasses("classTabHeader", "classTabFooterSx",
            "classTabHeaderMiddle", "classTabFooterDx");
            return tabFooter;
        } catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        }
    }

    private String addForms(){

        StringBuffer            sb=null;
        classFormHtmlObject     myForm=null;


        sb = new StringBuffer();
        sb.append("\n");
        // FORM gestione esame
        myForm = new classFormHtmlObject("frmCheckUser","checkUser", "POST", "wndCheckUserEngine");
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hidLogin", ""));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hidPwd", ""));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hidTipoCrypto", this.inputCryptoType));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hidReparto", ""));
        sb.append(myForm.toString());
        sb.append("\n");

        // ***** creo form per aggiornamento
        myForm = classFormUtil.getObjectFormAggiorna(myRequest,"frmAggiorna","winCheckUser", "POST","");
        // appendo
        sb.append(myForm.toString());
        // *****

        sb.append("\n");
        return sb.toString();
    }
}
