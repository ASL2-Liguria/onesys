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
 * utentiCampiWkEngine.java
 *
 * Created on 2 ottobre 2006, 16.08
 */

package gesUtilita.gesUtenti;

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
import imago.http.baseClass.baseUser;
import imago.sql.TableResultSet;
import imagoAldoUtil.classFormUtil;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoAldoUtil.structErroreControllo;
import imagoUtils.classJsObject;

import java.sql.ResultSet;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import worklist.ImagoWorklistException;
import worklist.IworklistEngine;
import core.Global;
/**
 *
 * @author  aldo
 */
public class utentiCampiWkEngine implements IworklistEngine {

    // oggetti accessibili a tutta la classe
    HttpSession                         mySession;
    ServletContext                      myContext;
    HttpServletRequest                  myRequest;
    String                              myTipoWk = "", arrayJsWorklist="";
    private baseUser                    logged_user=null;

    String                              arrayCampoAll="", arrayLabelCampo="", arrayCampoIn="", arrayCampoOut="";

    /** Creates a new instance of utentiCampiWkEngine */
    public utentiCampiWkEngine(HttpSession myInputSession,
    ServletContext myInputContext,
    HttpServletRequest myInputRequest,
    String TipoWk
    ) throws
    ImagoWorklistException {
        // inizializzazione engine della worklist
        super();
        try {
            mySession = myInputSession;
            myContext = myInputContext;
            myRequest = myInputRequest;
            myTipoWk = TipoWk;
            // ATTENZIONE
            initMainObjects();
            // *******
            leggiDatiInput();
            //creaDocumentoHtml();
        } catch (ImagoWorklistException ex) {
            throw ex;
        }
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

    public String addTopJScode() {
        StringBuffer sb = new StringBuffer();
        sb.append(this.arrayCampoAll + "\n");
        sb.append(this.arrayLabelCampo + "\n");
        sb.append(this.arrayCampoIn + "\n");
        sb.append(this.arrayCampoOut + "\n");
        sb.append("<SCRIPT>\n");
        sb.append("\n");
        sb.append("</SCRIPT>");
        return sb.toString();
    }

    private void initMainObjects(){
        this.logged_user = Global.getUser(mySession);
    }


    /**
     * metodo che legge i dati in input
     * dell'oggetto Request
     */
    private void leggiDatiInput() throws ImagoWorklistException {

        return;
    }


    public org.apache.ecs.html.Body creaBodyHtml() throws ImagoWorklistException {

        Body                    corpoHtml;
        structErroreControllo   myErrore= new structErroreControllo(false,"");



        // estropolo dati per connessione DB
        // definisco body
        corpoHtml = new Body();

        corpoHtml.addElement(creaTabellaPrincipale(myErrore));
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

    /**
     * metodo principale che crea tutta la pagina HTML
     */
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


    /**
     * metodo che crea l'oggetto HEAD
     */
    public classHeadHtmlObject creaHeadHtml() throws ImagoWorklistException {
        classHeadHtmlObject testata = null;
        classJsObject myJS = null;

        // Definisco Title del documento
        try {
            myJS = new classJsObject();
            // definisco Head
            testata = new classHeadHtmlObject();
            // carico le label dinamiche e i msg js
            testata.addElement(myJS.getArrayLabel("utentiCampiWk", this.logged_user));
            // **
            // ********** includo i files ********
            testata.addElement(classTabExtFiles.getIncludeString(this.logged_user,"",this.getClass().getName(),this.myContext));
            // **********

            // appendo Meta all'Head
            testata.addElement(creaMetaHtml());
            // ***************** ATTENZIONE
            testata.addElement(this.arrayJsWorklist);

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


    private String addForms(){

        StringBuffer            sb=null;
        classFormHtmlObject     frmAggiorna=null;

        sb = new StringBuffer();
        sb.append("\n");



        // ***** creo form per aggiornamento
        frmAggiorna = classFormUtil.getObjectFormAggiorna(myRequest,"frmAggiorna","worklist", "POST","");
        // appendo
        sb.append(frmAggiorna.toString());
        // *****

        sb.append("\n");
        return sb.toString();
    }


    private String creaTabellaPrincipale(structErroreControllo myErrore){

        String                  strWhere ="", sql = "", campiUtente="", strWhereIn= "", strWhereOut="";
        String                  strOrder = "";
        ResultSet               rsCampiWk =null;
        TableResultSet          myTable = null;
        String[]                vettore = null;
        classRsUtil             rsUtil=null;
        classJsObject           myJS = null;
        classFormHtmlObject     myForm = null;
        classLabelHtmlObject    myLabel = null;



        myJS = new classJsObject();
        rsUtil = new classRsUtil();
        try{
            strWhere = " where webuser='" + logged_user.login +"'";
            sql = "Select worklist from web " + strWhere;
            myTable = new TableResultSet();
            myTable.setLogOnDb(this.logged_user, "utentiCampiWkEngine.creaTabellaPrincipale");
            rsCampiWk = myTable.returnResultSet(this.logged_user.db.getWebConnection(),sql);
            if (rsCampiWk.next()){
                campiUtente = rsUtil.returnStringFromRs(rsCampiWk,"worklist");
                if (!campiUtente.equalsIgnoreCase("")){
                    vettore = campiUtente.split("[*]");
                    for (int i=0;i<vettore.length;i++){
                        if (strWhereIn.equalsIgnoreCase("")){
                            strWhereIn = " keycampo<>'" + vettore[i] +"'";
                            strWhereOut = " keycampo='" + vettore[i] +"'";
                        }
                        else{
                            strWhereIn = strWhereIn + " AND keycampo<>'" + vettore[i] +"'";
                            strWhereOut = strWhereOut + " OR keycampo='" + vettore[i] +"'";
                        }
                    }
                }
            }
            // ****
            rsCampiWk.close();
            rsCampiWk = null;
            myTable.close();
            // *****
            // genero vettore per le label di tutti i campi
            strOrder = " order by keycampo";
            strWhere = " where lingua='" + this.logged_user.lingua + "' AND obbligatorio<>'S' AND tipo_wk='WK_REFERTAZIONE'";
            sql = "Select * from TAB_CAMPI_WK " + strWhere + strOrder;
            rsCampiWk = myTable.returnResultSet(this.logged_user.db.getWebConnection(),sql);
            // chiamo la funzione per generare gli array
            // ove c'e' il controllo se il resultset è pieno
            this.arrayCampoAll = myJS.creaArrayJS(rsCampiWk, "keycampo", "arrayCampoAll");
            this.arrayLabelCampo = myJS.creaArrayJS(rsCampiWk, "labelCampo", "arrayLabelCampo");
            // ****
            rsCampiWk.close();
            rsCampiWk = null;
            myTable.close();
            // *****
            //  genero array per riempire SELECT IN
            if (strWhereIn.equalsIgnoreCase("")){
                sql = "Select * from TAB_CAMPI_WK " + strWhere + strOrder;
            }
            else{
                sql = "Select * from TAB_CAMPI_WK " + strWhere + " AND (" + strWhereIn + ")" + strOrder;
            }

            rsCampiWk = myTable.returnResultSet(this.logged_user.db.getWebConnection(),sql);
            this.arrayCampoIn = myJS.creaArrayJS(rsCampiWk, "keycampo", "arrayCampoIn");
            // array per SELECT OUT
            if (strWhereOut.equalsIgnoreCase("")){
                sql = "Select * from TAB_CAMPI_WK where KEYCAMPO='-1'";
            }
            else{
                sql = "Select * from TAB_CAMPI_WK " + strWhere + " AND (" + strWhereOut + ")" + strOrder;
            }
            // ****
            rsCampiWk.close();
            rsCampiWk = null;
            myTable.close();
            // *****
            rsCampiWk = myTable.returnResultSet(this.logged_user.db.getWebConnection(),sql);
            this.arrayCampoOut = myJS.creaArrayJS(rsCampiWk, "keycampo", "arrayCampoOut");

        }
        catch (java.lang.Exception ex){
            myErrore.bolError = true;
            myErrore.strDescrErrore = ex.getMessage();

        }
        finally{
            try{
                rsCampiWk.close();
                rsCampiWk= null;
                myTable.close();
                myTable = null;


            }
            catch(java.lang.Exception ex){
            }
        }

        // form con dati anagrafici
        myForm = new classFormHtmlObject("frmDati","utentiRegistraCampiWk","POST","workFrame");
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"idenCampi",""));
        new classDivHtmlObject("box");
        new classDivHtmlObject("left");
        new classDivHtmlObject("right");
        new classDivHtmlObject("upInfo");
        new classDivHtmlObject("downInfo");
        new classDivHtmlObject("content");
        new classDivHtmlObject("bottomInfo");

        // **** TAB header
        myLabel = new classLabelHtmlObject("","","lbltitolo1");
        classTabHeaderFooter tabHeader = new classTabHeaderFooter(myLabel);
        myForm.appendSome(tabHeader.toString());
        //****
        myForm.appendSome(creaTabellaListBox());
        // ***** Tab FOOTER
        classTabHeaderFooter tabFooter = new classTabHeaderFooter("&nbsp;");
        tabFooter.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
        // ************
        // aggiungo pulsanti
        classDivButton divButton = new classDivButton("", "pulsante","javascript:registra()","btSave","");
        tabFooter.addColumn("classButtonHeader",divButton.toString());
        divButton = new classDivButton("", "pulsante", "javascript:chiudi();","btClose","");
        tabFooter.addColumn("classButtonHeader",divButton.toString());
        myForm.appendSome(tabFooter.toString());
        return myForm.toString();

    }



    /**
     * metodo che crea
     * la tabella che contiene
     * i list box dei campiWk
     *
     */

    private classTableHtmlObject creaTabellaListBox(){

        classTableHtmlObject        myTable = null;
        classTDHtmlObject           myTD = null;
        classTRHtmlObject           myTR = null;
        classSelectHtmlObject       mySelect=null;





        // ***********************

        myTable = new classTableHtmlObject();
        myTable.addAttribute("class","classDataEntryTable");
        // 1 RIGA !
        myTD = new classTDHtmlObject();
        myTD.addAttribute("class","classTdLabel");
        myTD.appendSome(new classLabelHtmlObject("","","lbltutticampi"));
        myTR = new classTRHtmlObject();
        myTR.appendSome(myTD);

        myTD = new classTDHtmlObject();
        myTD.addAttribute("class","classTdField");
        myTD.addAttribute("rowspan", "3");
        myTD.appendSome(new classDivButton(">>","pulsante","javascript:add_selected_elements(\"selCampiIn\",\"selCampiOut\",true);"));
        myTD.appendSome(new classDivButton("<<","pulsante","javascript:add_selected_elements(\"selCampiOut\",\"selCampiIn\",true);"));
        myTR.appendSome(myTD);

        myTD = new classTDHtmlObject();
        myTD.addAttribute("class","classTdLabel");
        myTD.appendSome(new classLabelHtmlObject("","","lblcampiout"));
        myTR.appendSome(myTD);
        myTable.appendSome(myTR);


        // 2 Riga
        myTD = new classTDHtmlObject();
        myTD.addAttribute("class","classTdField");
        mySelect = new classSelectHtmlObject("selCampiIn",10);
        mySelect.addEvent("ondblClick","javascript:add_selected_elements(\"selCampiIn\",\"selCampiOut\",true);");
        mySelect.addEvent("onChange","javascript:caricaLabelCampo(\"infoCampoSx\",\"selCampiIn\");");
        myTD.appendSome(mySelect);
        myTR = new classTRHtmlObject();
        myTR.appendSome(myTD);

        myTD = new classTDHtmlObject();
        myTD.addAttribute("class","classTdField");
        mySelect = new classSelectHtmlObject("selCampiOut",10);
        mySelect.addEvent("ondblClick","javascript:add_selected_elements(\"selCampiOut\",\"selCampiIn\",true);");
        mySelect.addEvent("onChange", "javascript:caricaLabelCampo(\"infoCampoDx\",\"selCampiOut\");");
        myTD.appendSome(mySelect);

        myTR.appendSome(myTD);
        myTable.appendSome(myTR);

        // 3 Riga
        myTD = new classTDHtmlObject();
        myTD.addAttribute("class","classTdLabel");
        myTD.appendSome(new classLabelHtmlObject("","","lblDescr1"));
        myTD.appendSome(new classLabelHtmlObject("","","infoCampoSx"));
        myTR = new classTRHtmlObject();
        myTR.appendSome(myTD);

        myTD = new classTDHtmlObject();
        myTD.addAttribute("class","classTdLabel");
        myTD.appendSome(new classLabelHtmlObject("","","lblDescr2"));
        myTD.appendSome(new classLabelHtmlObject("","","infoCampoDx"));
        myTR.appendSome(myTD);

        myTable.appendSome(myTR);

        return myTable;

    }

}
