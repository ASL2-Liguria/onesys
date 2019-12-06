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
 * utentiRegistraPreferitiEngine.java
 *
 * Created on 29 settembre 2006, 12.34
 */

package gesUtilita.gesUtenti;

import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.baseClass.baseUser;
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
/**
 *
 * @author  aldo
 */
public class utentiRegistraPreferitiEngine implements IworklistEngine {



    // oggetti accessibili a tutta la classe
    HttpSession                         mySession;
    ServletContext                      myContext;
    HttpServletRequest                  myRequest;
    String                              myTipoWk = "", arrayJsWorklist="";
    private baseUser                    logged_user=null;

    private String[]                   arrayProcedure = null;

    private String[]                   arrayCodicePreferitiSelezionati = null;


    /** Creates a new instance of utentiOptionPreferitiEngine */
    public utentiRegistraPreferitiEngine(HttpSession myInputSession,
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
     * metodo per la creazione del BODY
     */
    public Body creaBodyHtml() throws ImagoWorklistException {

        Body                    corpoHtml;
        structErroreControllo   myErrore = null;


        // estropolo dati per connessione DB
        // definisco body
        corpoHtml = new Body();
        myErrore = new structErroreControllo(false,"");

        myErrore = salvaPrefertiUtente();
        if (myErrore.bolError==true){
            // gestione errore
            return corpoHtml;
        }

        // aggiunge codice JS in fondo pagina
        corpoHtml.addElement(addBottomJScode());
        // *** aggiungo le forms
        corpoHtml.addElement(addForms());
        // ****
        corpoHtml.addElement("\n");
        return corpoHtml;

    }


    // ****************************************************************************

    /**
     * metodo che aggiunge codice js in testa alla pagina
     *
     */
    public String addTopJScode() {
        StringBuffer sb = new StringBuffer();
        new classJsObject();

        // appendo codice JS
        //sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getGlobal()));
        //sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getUser()));
        //sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getPC()));
        sb.append("<SCRIPT>\n");
        sb.append("\n");
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


    private void initMainObjects(){

        this.logged_user = Global.getUser(mySession);
    }


    /**
     * metodo che legge i dati in input
     * dell'oggetto Request
     */
    private void leggiDatiInput() throws ImagoWorklistException {
        String      inputCodiciSelezionati = "";
        String      inputProcedure = "";
        inputCodiciSelezionati = classStringUtil.checkNull(myRequest.getParameter("hArrayCodiciPreferitiSelezionati"));
        inputProcedure = classStringUtil.checkNull(myRequest.getParameter("hArrayProcedure"));

        this.arrayCodicePreferitiSelezionati = inputCodiciSelezionati.split("[@]");
        this.arrayProcedure= inputProcedure.split("[*]");

        return;
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
            testata.addElement(myJS.getArrayLabel("utentiRegistraPreferitiEngine", this.logged_user));
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

    /**
     * metodo che aggiorna i menu preferiti
     * relativi all'utente
     *
     */
    private structErroreControllo salvaPrefertiUtente(){
        structErroreControllo   myErrore = new structErroreControllo(false,"");
        // variabile che conterrà la string di uscita
        String                  strOutput = "";
        String                  strProcedura = "";
        String                  strTmp ="";

        for (int i=0; i<this.arrayProcedure.length;i++){
            strProcedura = arrayProcedure[i].toString();
            strTmp = "";
            try{
                strTmp = this.arrayCodicePreferitiSelezionati[i].toString();
            }
            catch(java.lang.Exception ex){
                // non esiste l'elemento
            }
            if (!strTmp.equalsIgnoreCase("VOID")){
                strTmp = strTmp.replaceAll("[*]",",");
                if (strOutput.equalsIgnoreCase("")){
                    strOutput = strProcedura + "=" + strTmp;
                }
                else{
                    strOutput += "*" + strProcedura + "=" + strTmp;
                }
            }
        }


        myErrore = this.logged_user.setPreferiti(this.logged_user, strOutput);
        try{
            this.logged_user.loadInitValue();
        }
        catch(imago.http.ImagoHttpException ex){
            myErrore.bolError = true;
            myErrore.strDescrErrore = ex.getMessage();
        }
        return myErrore;
    }


}
