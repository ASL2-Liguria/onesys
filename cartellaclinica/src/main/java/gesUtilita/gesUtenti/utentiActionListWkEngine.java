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
import imago.http.classDataTable;
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
import imago.http.baseClass.baseWorklistField;
import imago.http.baseClass.baseWrapperInfo;
import imagoAldoUtil.classFormUtil;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoAldoUtil.structErroreControllo;
import imagoAldoUtil.httpRequestUtil.requestUtil;
import imagoCreateWk.IprocessDataTable;
import imagoCreateWk.classTipoWk;
import imagoUtils.classJsObject;

import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import processClass.classElaboraIndiceRiga;
import worklist.ImagoWorklistException;
import worklist.IworklistEngine;
import core.Global;





public class utentiActionListWkEngine implements IworklistEngine{


    // oggetti accessibili a tutta la classe
    HttpSession                         mySession;
    ServletContext                      myContext;
    HttpServletRequest                  myRequest;
    String                              arrayJsWorklist="";
    String                              strLimiteRecordWk = "";
    private baseGlobal                  infoGlobali=null;
    private basePC                      infoPC = null;
    private baseWrapperInfo             myBaseInfo =null;
    private baseUser                    logged_user=null;

    // lista dei file js aggiuntivi
//    private Vector                      vectListaJsFile=null;
    private classTipoWk                 myClassTipoWk = null;


    // *****
    StringBuffer            stringaSel;
    int                     numeroRecord = 0;
    String                  inputData = "", inputUtente = "";
    String                  inputWhere = "", inputOrder = "",inputManualOrderAsc="",inputManualOrderDesc="";
    String                  vistaWk = "";
    /**
     * classe che crea la pagina HTML
     * e spara fuori la stringa
     */
    public utentiActionListWkEngine(HttpSession myInputSession,
    ServletContext myInputContext,
    HttpServletRequest myInputRequest
    ) throws
    ImagoWorklistException {
        // inizializzazione engine della worklist
        super();
        try {
            this.getClass().getName();
            mySession = myInputSession;
            myContext = myInputContext;
            myRequest = myInputRequest;
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
     * inizializza
     * gli oggetti principali
     * che verranno usati nella sevlet
     * inoltre azzera tutti i record lockati
     * nella sessione corrente
     *
     */
    private void initMainObjects(){

        new structErroreControllo(false,"");

        this.logged_user = Global.getUser(mySession);
        //this.infoGlobali = (baseGlobal) myContext.getAttribute("parametri_globali");
        this.infoPC = (basePC) mySession.getAttribute("parametri_pc");
        try{
            this.infoGlobali = baseRetrieveBaseGlobal.getBaseGlobal(this.myContext, this.mySession);
        }
        catch(ImagoHttpException ex){
        }
        this.myBaseInfo = new baseWrapperInfo(this.logged_user, this.infoGlobali,this.infoPC,mySession,myContext,myRequest);
        // sblocco tutti i record
        try{
            classRsUtil.unLockRecordForSavingReportForSession(this.logged_user.db.getDataConnection(), this.mySession.getId());
        }
        catch(java.lang.Exception ex){
            ex.printStackTrace();
        }
        // inizializzo oggetto di Log

    }


    /**
     * metodo che legge i dati in input
     * dell'oggetto Request
     */
    private void leggiDatiInput() throws ImagoWorklistException {

        // parsing dati in ingresso
        this.inputWhere = classStringUtil.checkNull(myRequest.getParameter("hidWhere"));
        this.inputOrder = classStringUtil.checkNull(myRequest.getParameter("hidOrder"));
        this.inputManualOrderAsc = classStringUtil.checkNull(myRequest.getParameter("hidManualOrderAsc"));
        this.inputManualOrderDesc = classStringUtil.checkNull(myRequest.getParameter("hidManualOrderDesc"));
        this.inputUtente  = classStringUtil.checkNull(myRequest.getParameter("hidUser"));

    }

    /**
     * metodo principale che crea tutta la pagina HTML
     * NB in ingresso vengono letti i seguenti campi:
     *
     * hidWhere
     * hidOrder
     *
     * indipendentemente dal metodo usato GET / POST
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
    public Title creaTitoloHtml() {

        // Definisco Title del documento
        Title titolo = new Title(" ");
        titolo.addAttribute("id", "htmlTitolo");
        return titolo;
    }


    /**
     * metodo che crea l'oggetto META
     */
    public classMetaHtmlObject creaMetaHtml() {

        classMetaHtmlObject MetaTag = null;
        // Definisco Title del documento
        MetaTag = new classMetaHtmlObject();
        return MetaTag;
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
            testata.addElement(myJS.getArrayLabel("utentiActionListWkEngine", this.logged_user));

            // ********** includo i files ********
            testata.addElement(classTabExtFiles.getIncludeString(this.logged_user,"",this.getClass().getName(),this.myContext));
            // **********
            // appendo Meta all'Head
            testata.addElement(creaMetaHtml());
            // ***************** ATTENZIONE
            testata.addElement(this.arrayJsWorklist);

            testata.addElement(addTopJScode());
            return testata;
        } catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        }
    }

    private classTabHeaderFooter creaHeaderTabella()  {

        classTabHeaderFooter            tabHeader = null;
        classLabelHtmlObject            myLabel = null;
        myLabel = new classLabelHtmlObject("", "","lbltitolo");
        tabHeader = new classTabHeaderFooter(myLabel);
        // *******************************
        return tabHeader;

    }


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


    /**
     * metodo per la creazione del BODY
     */
    public Body creaBodyHtml() throws ImagoWorklistException {

        Body                    corpoHtml;
        classDivHtmlObject      divFloatingMenu=null, divHeader=null, divWorklist=null;

        try {
            // estropolo dati per connessione DB
            // definisco body
            corpoHtml = new Body();
            new structErroreControllo(false,"");
            // istanzio variabile per il contenimento stringa di selezione
            stringaSel = new StringBuffer();
            //****
            // creo wk
            wkAutenticazioni myWk = new wkAutenticazioni();
            myWk = (wkAutenticazioni) creaTabellaWk(this.logged_user);
            myWk.setConnessioneDati(this.logged_user.db.getWebConnection());
            this.strLimiteRecordWk = myWk.getLimiteRecordWorklist();
            // setto gestione rollover riga
            myWk.addAttributeEveryRow("onMouseOver","javascript:rowSelect_over(this.sectionRowIndex);");
            myWk.addAttributeEveryRow("onMouseOut","javascript:rowSelect_out(this.sectionRowIndex);");
            // **** aggiungo in automatico le colonne
            // supplementari definite in TIPO_WK
            myWk.autoAddColumn();
            // ***
            String strTitoliTabellaDati = myWk.creaTitoliTabellaDati().toString();
            classDataTable tabellaWk = myWk.creaTabellaWorklist(null, null);

            // aggiungo menu contestuale alla sola tabella
            //classContextMenu menuContesto = (classContextMenu) myMenuContestuale.getMenuTendina(tabellaWk);
            String strTabellaWorklist = tabellaWk.toString();

            // estrapolo array JS della wk appena renderizzata
            this.arrayJsWorklist = myWk.getArrayJs();
            // appendo tabella con intestazioni al body
            // <div id="divStayTopLeft" style="position:absolute">
            // <div id="idLayerTestata">

            // **** TAB HEADER
            divHeader = new classDivHtmlObject("idLayerTestata");
            divHeader.appendSome(creaHeaderTabella().toString());
            divHeader.appendSome(strTitoliTabellaDati);

            divFloatingMenu = new classDivHtmlObject("divStayTopLeft","position:absolute",divHeader);
            corpoHtml.addElement(divFloatingMenu.toString());
            // ***********************
            // DIV Worklist
            divWorklist = new classDivHtmlObject("idLayerWorklist");
            divWorklist.appendSome(strTabellaWorklist);
            corpoHtml.addElement(divWorklist.toString());

            // disattivo pulsante destro
            classJsObject.setNullContextMenuEvent(corpoHtml,this.logged_user);
            // ************
            //Vector myVector = new Vector();
            //myVector = myWk.getFieldArray("STATO");
            // **********************


            // *******************************************************************************************
            corpoHtml.addElement(creaFooterTabella().toString());
            // aggiungo livelli dei MENU
            corpoHtml.addElement("\n");
            // *** aggiungo le forms
            corpoHtml.addElement(addForms());
            // aggiunge codice JS in fondo pagina
            corpoHtml.addElement(addBottomJScode());
            // ****
            corpoHtml.addElement("\n");
            return corpoHtml;
        }
        catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        }
    }


    // ****************************************************************************

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
        sb.append("var defaultUser='"+ this.inputUtente +"';\n");
        sb.append("var numeroLimiteRecordWk='" + this.strLimiteRecordWk + "';\n");
        sb.append("var enableAlternateColors='"+ this.myClassTipoWk.getAlternateColor() + "';\n");
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



    private String addForms(){

        StringBuffer            sb=null;
        classFormHtmlObject     frmAggiorna=null;

        sb = new StringBuffer();
        sb.append("\n");
        // ***** creo form per aggiornamento
        frmAggiorna = classFormUtil.getObjectFormAggiorna(myRequest,"frmAggiorna","utentiactionlistwk", "POST","");
        frmAggiorna.addEvent("onsubmit", "javascript:loadWaitWindow()");

        if (!requestUtil.esisteParametroInRequest(this.myRequest,"hidManualOrderAsc")){
            // non c'è il campo per ordinamento manuale
            // lo creo
            frmAggiorna.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hidManualOrderAsc", ""));
        }
        if (!requestUtil.esisteParametroInRequest(this.myRequest,"hidManualOrderDesc")){
            // non c'è il campo per ordinamento manuale
            // lo creo
            frmAggiorna.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hidManualOrderDesc", ""));
        }
        // appendo
        sb.append(frmAggiorna.toString());
        // *****

        sb.append("\n");
        return sb.toString();
    }


    /**
     * metodo che crea la worklist
     *@param    user baseUser      utente loggato
     *@return   classWk            ritorna l'oggetto worklist
     *
     *
     */
    private imagoCreateWk.classWk creaTabellaWk(baseUser user) throws ImagoWorklistException{

        Hashtable           hashDati=null;
        Hashtable           hashHeader =null;
        wkAutenticazioni     myOwnWk =null;
        baseWorklistField   campoIndiceRiga=null;
        hashDati = new Hashtable();
        hashHeader = new Hashtable();

        try{
            // gestisco campo urgenza
//            hashDati.put("URGENZA", new classElaboraUrgenza());

            myOwnWk = new wkAutenticazioni();
            myOwnWk.setWhereCondition(this.inputWhere);
            if (this.inputOrder.equalsIgnoreCase("")){
                myOwnWk.setOrderCondition("ORDER BY WEBUSER ");
            }
            else{
                myOwnWk.setOrderCondition(this.inputOrder);
            }
            // setto ordine manuale se è stato richiesto
            if (!this.inputManualOrderAsc.equalsIgnoreCase("")){
                myOwnWk.setManualOrderWk(this.inputManualOrderAsc,"ASC");
            }
            else{
                if (!this.inputManualOrderDesc.equalsIgnoreCase("")){
                    myOwnWk.setManualOrderWk(this.inputManualOrderDesc,"DESC");
                }
            }
            // **********************************
            // definizione classe per la wk
            myOwnWk.init(user.db.getWebConnection(), user.lingua, "WK_TRACE_USER", "TIPO_WK", null,hashDati,hashHeader,1);
            this.myClassTipoWk = myOwnWk.getTipoWk();
            myOwnWk.setConnessioneDati(user.db.getDataConnection());
            // **********
            // aggiungo colonna indice riga
            IprocessDataTable myInterface=null;

            campoIndiceRiga = new baseWorklistField("indice");
            campoIndiceRiga.labelcampo="#";
            campoIndiceRiga.larghezza = "20px";
            myOwnWk.addColumn(campoIndiceRiga, new classElaboraIndiceRiga(), myInterface,true);

            // il settagio del retrive degli arrayJS devo
            // farlo prima di creare la wk
            myOwnWk.setRetrieveArrayJs(creaArrayWk());

            // DEVO chiamare questo metodo
            // affinchè le classi
            // di elaborazione colonna possano
            // chiamare il metodo processData(Iview)
            myOwnWk.setBaseInfo(this.myBaseInfo);

        }
        catch (imago.sql.SqlQueryException ex) {
            ImagoWorklistException newEx= new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;

        }
        return myOwnWk;

    }


    private Hashtable creaArrayWk(){

        Hashtable listaVettoriJS = new Hashtable();
//        listaVettoriJS.put("datanascita", "array_data");

        return listaVettoriJS;
    }

}
