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
 * scanDBengine.java
 *
 * Created on 24 luglio 2006, 12.46
 */

package winPopup;
import imago.http.ImagoHttpException;
import imago.http.classColDataTable;
import imago.http.classDataTable;
import imago.http.classDivButton;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTabHeaderFooter;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imago.http.winPopUp.classCollWinDett;
import imago.http.winPopUp.classWinDett;
import imago.http.winPopUp.classWinTest;
import imago.sql.TableResultSet;
import imagoAldoUtil.classFormUtil;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;
import imagoUtils.logToOutputConsole;

import java.sql.ResultSet;
import java.util.ArrayList;

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
public class scanDBengine implements worklist.IworklistEngine {

    HttpSession                         mySession;
    ServletContext                      myContext;
    HttpServletRequest                  myRequest;

    private baseGlobal                  infoGlobali=null;
    private basePC                      infoPC = null;
    private baseWrapperInfo             myBaseInfo =null;
    private baseUser                    logged_user=null;

    private classRsUtil                 rsUtil = null;
    private StringBuffer                stringaSel = null;


    String                              inputRic = "",inputProcedura = "", inputWhere="", inputNumPagina="", inputOrdine="", inputFiltroCdcAttivo="", inputReparto="", inputInText="";
    String                              strWhere="", strOrder="", strFrom="", sql = "", strCampi="", strWhereCdc = "";
    String                              strCodiciSelezionati="";

    private int                         indiceRiga=0;

    String[]                            vettoreCampi=null, vettoreTestata=null, vettoreLarghezza=null, vettoreDisplay=null, vettoreRigReuturn=null, vettoreOrdinamenti=null;
    int                                 contatore = 0;

    private classWinTest                myWinTest = null;
    private classWinDett                myWinDett = null;
    int                                 nPagTot = 0, nRecTot=0;

    classCollWinDett                    myCollWinDett = null;
    ArrayList                           listaWinDett = null, listaCodiciJS=null;

    int                                 intIndiceWinDettCorrente = 0;
    int                                 intIndiceCampoInRicerca = 0;


    /** Creates a new instance of scanDBengine */
    public scanDBengine(HttpSession myInputSession,
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
            initMainObjects();
            // *******
            leggiDatiInput();
            //creaDocumentoHtml();
        } catch (ImagoWorklistException ex) {
            throw ex;
        }
    }

    private void initMainObjects() throws ImagoWorklistException{

        this.logged_user = Global.getUser(mySession);
        this.infoPC = (basePC) mySession.getAttribute("parametri_pc");
        try{
            this.infoGlobali = baseRetrieveBaseGlobal.getBaseGlobal(this.myContext, this.mySession);
        }
        catch(ImagoHttpException ex){
        }
        this.myBaseInfo = new baseWrapperInfo(this.logged_user, this.infoGlobali,this.infoPC);
        try{
            this.myWinTest = new classWinTest(this.logged_user,  classStringUtil.checkNull(this.myRequest.getParameter("myproc")), " AND OGGETTO='SCANDB'");
            this.myCollWinDett = new classCollWinDett(this.logged_user, classStringUtil.checkNull(this.myRequest.getParameter("myproc")), "");
            this.listaWinDett = myCollWinDett.getWinDettElements();
        }
        catch(imago.http.ImagoHttpException ex){
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            throw newEx;
        }
        rsUtil = new classRsUtil();
    }


    /**
     * metodo che aggiunge codice js in testa alla pagina
     *
     */
    public String addTopJScode() {
        String          strTmp="";

        StringBuffer sb = new StringBuffer();
        // appendo codice JS
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getGlobal()));
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getUser()));
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getPC()));
        sb.append("<SCRIPT>\n");
        if (this.listaCodiciJS.size()==1){
            sb.append("var array_codici = new Array(1);\n");
            sb.append("array_codici[0]=\"" + this.listaCodiciJS.get(0).toString()+"\";\n");
        }
        else{
            for (int i=0;i<this.listaCodiciJS.size();i++){
                if (strTmp.equalsIgnoreCase("")){
                    strTmp = "\"" + this.listaCodiciJS.get(i).toString() + "\"";
                }
                else{
                    strTmp = strTmp + ", \"" + this.listaCodiciJS.get(i).toString() + "\"";
                }
            }
            sb.append("var array_codici = new Array(" + strTmp +");\n");
        }

        // appendo variabili js
        sb.append("var winpos_left=\"" + this.myWinTest.pos_left + "\";\n");
        sb.append("var winpos_top=\"" + this.myWinTest.pos_top + "\";\n");
        sb.append("var winpos_width=\"" + this.myWinTest.pos_width + "\";\n");
        sb.append("var winpos_height=\"" + this.myWinTest.pos_height + "\";\n");
        // ***
        sb.append("function seleziona(");
        strTmp="";
        for (contatore=0;contatore<vettoreRigReuturn.length;contatore++){
            if (!(vettoreRigReuturn[contatore].equalsIgnoreCase(""))){
                if (strTmp.equalsIgnoreCase("")){
                    strTmp = vettoreRigReuturn[contatore];
                }
                else{
                    strTmp += "," + vettoreRigReuturn[contatore];
                }
            }
        }
        sb.append(strTmp);
        sb.append("){\n");
        sb.append("try{\n");
        sb.append(" if(typeof window.opener.set_scan_db_value === 'object') {\n");
        for (contatore=0;contatore<vettoreRigReuturn.length;contatore++){
            if (!(vettoreRigReuturn[contatore].equalsIgnoreCase(""))){
                sb.append(" window.opener.set_scan_db_value(\""+vettoreRigReuturn[contatore]+"\", "+vettoreRigReuturn[contatore]+", \""+myWinDett.nome_form+"\");\n");
            }
        }       
        sb.append(" } else {\n");
        for (contatore=0;contatore<vettoreRigReuturn.length;contatore++){
            if (!(vettoreRigReuturn[contatore].equalsIgnoreCase(""))){
                sb.append(" window.opener.document." + myWinDett.nome_form + "." + vettoreRigReuturn[contatore] + ".value = " + vettoreRigReuturn[contatore]+ ";\n");
            }
        }   
        sb.append(" }\n");
        // chiamo eventuale funzione dopo
        if (!myWinDett.nome_func.equalsIgnoreCase("")){
            sb.append("window.opener." + myWinDett.nome_func + ";\n");
        }
        // apro finestra successiva
        if (!myWinDett.pagina_succ.equalsIgnoreCase("")){
            sb.append("finestra = window.open(\"" + myWinDett.pagina_succ + "\",\"\",\"top=0, left=0, width=800, height=600,statusbar=yes\";\n");
        }
        sb.append("} catch(e) {\n");
        sb.append("/* alert(e.message); */\n");
        sb.append("}\n");
        sb.append("self.close();\n");
        sb.append("}\n");
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

    /**
     * metodo che legge i dati in input
     * dell'oggetto Request
     */
    private void leggiDatiInput() throws ImagoWorklistException {

        try {
            // parsing dati in ingresso
            this.inputRic = classStringUtil.checkNull(this.myRequest.getParameter("myric"));
            this.inputProcedura = classStringUtil.checkNull(this.myRequest.getParameter("myproc"));
            this.inputWhere = classStringUtil.checkNull(this.myRequest.getParameter("mywhere"));
            this.inputNumPagina = classStringUtil.checkNull(this.myRequest.getParameter("numpagina"));
            this.inputOrdine = classStringUtil.checkNull(this.myRequest.getParameter("ordinecampo"));
            this.inputFiltroCdcAttivo = classStringUtil.checkNull(this.myRequest.getParameter("filtro_cdc_attivo"));
            this.inputReparto = classStringUtil.checkNull(this.myRequest.getParameter("loc_reparto"));
            this.inputInText = classStringUtil.checkNull(this.myRequest.getParameter("HchkInText"));

            /*
            if (inputFiltroCdcAttivo.equalsIgnoreCase("")){
                if (this.myBaseInfo.getGlobal().filtro_cdc.equalsIgnoreCase("S")){
                    inputFiltroCdcAttivo = "S";
                }
                else{
                    inputFiltroCdcAttivo = "N";
                }
            }
             */
            if (inputNumPagina.equalsIgnoreCase("")){
                inputNumPagina = "1";
            }

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


    public org.apache.ecs.html.Body creaBodyHtml() throws worklist.ImagoWorklistException {

        Body                    corpoHtml=null;
        classFormHtmlObject     myForm=null;

        corpoHtml = new Body();
        myForm = new classFormHtmlObject("frmricerca","","POST","");
        myForm.appendSome(creaTabHeader().toString());
        myForm.appendSome(creaSezioneRicerca().toString());
        myForm.appendSome(creaTabellaDati().toString());
        myForm.appendSome(creaTabFooter().toString());
        // ******************************
        // definizione campi hidden
        // ******************************
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"myric",this.inputRic));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"myproc",this.inputProcedura));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"mywhere",this.inputWhere));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"ordinecampo",this.inputOrdine));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"numpagina",this.inputNumPagina));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"filtro_cdc_attivo",this.inputFiltroCdcAttivo));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"loc_reparto",this.inputReparto));
        // ***
        corpoHtml.addElement(myForm.toString());
        // disattivo pulsante destro
        classJsObject.setNullContextMenuEvent(corpoHtml,this.logged_user);

        // aggiungo altre forms
        corpoHtml.addElement(addForms());
        corpoHtml.addElement(addBottomJScode());

        return corpoHtml;
    }

    public org.apache.ecs.Document creaDocumentoHtml() throws worklist.ImagoWorklistException {
        Document doc = null;
        doc = new Document();
        try {
            doc.setBody(creaBodyHtml());
            // attacco Head al documento
            doc.setHead(creaHeadHtml());
            doc.setTitle(creaTitoloHtml());
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

    public imago.http.classHeadHtmlObject creaHeadHtml() throws worklist.ImagoWorklistException {
        classHeadHtmlObject testata = null;
        classJsObject myJS = null;

        // Definisco Title del documento
        try {
            myJS = new classJsObject();
            // definisco Head
            testata = new classHeadHtmlObject();
            // carico le label dinamiche e i msg js
            testata.addElement(myJS.getArrayLabel("scanDB", this.logged_user));
            // **
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

    /**
     * metodo che crea l'oggetto TITLE
     */
    public Title creaTitoloHtml() throws ImagoWorklistException {

        // Definisco Title del documento
        try {
            Title titolo = new Title(myWinTest.titolo);
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
     * metodo che crea il
     * footer della finestra
     *
     */
    private classTabHeaderFooter creaTabFooter(){

        classTabHeaderFooter        tabFooter=null;
        classLabelHtmlObject        myLabel=null;
        classDivButton              divButton=null;

        tabFooter = new classTabHeaderFooter("&nbsp;");
        tabFooter.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
        // aggiungo salto pagina a
        myLabel = new classLabelHtmlObject("","","lblPagTot");
        tabFooter.addColumn("classButtonHeader",myLabel.toString() + " : " + this.inputNumPagina +"/"+ String.valueOf(nPagTot));
        // aggiungo pulsanti per la paginazione
        if (nPagTot>0){
            if (Integer.parseInt(inputNumPagina)>1){
                divButton = new classDivButton("", "pulsante","javascript:cambia_pagina(" + String.valueOf((Integer.parseInt(this.inputNumPagina)-1)) + ");","btIndietro","");
                tabFooter.addColumn("classButtonHeader",divButton.toString());
            }
            if (Integer.parseInt(inputNumPagina)<nPagTot){
                divButton = new classDivButton("", "pulsante", "javascript:cambia_pagina(" + String.valueOf((Integer.parseInt(this.inputNumPagina)+1)) +");","btAvanti","");
                tabFooter.addColumn("classButtonHeader",divButton.toString());
            }
        }
        return tabFooter;
    }


    /**
     * metodo che crea
     * l'header della finestra
     *
     */
    private classTabHeaderFooter creaTabHeader(){

        classTabHeaderFooter        tabHeader = null;
        classDivButton              divButton = null;


        tabHeader = new classTabHeaderFooter(myWinTest.testata);
        divButton = new classDivButton("", "pulsante","javascript:cerca();","btFind","");
        tabHeader.addColumn("classButtonHeader",divButton.toString());
        /*
        if (!(myWinTest.filtro_cdc.equalsIgnoreCase(""))){
            if (this.myBaseInfo.getGlobal().filtro_cdc.equalsIgnoreCase("S")){
                divButton = new classDivButton("", "pulsante","javascript:filtracdc();","btCdc","");
                tabHeader.addColumn("classButtonHeader",divButton.toString());
            }
        }
*/
        divButton = new classDivButton("", "pulsante","javascript:chiudi();","btClose","");
        tabHeader.addColumn("classButtonHeader",divButton.toString());
        return tabHeader;
    }

    /**
     * metodo che crea
     * la sezione di ricerca
     * della finestra
     */
    private classDataTable creaSezioneRicerca(){

        classDataTable          mySearchTable=null;
        classLabelHtmlObject    myLabel=null;
        classColDataTable       myCol=null;

        ArrayList               listaCol = null, listaRow = null, listaElementi = null, listaOggettiRicerca=null;
        classInputHtmlObject    myInput = null, myRadio= null;
        classRowDataTable       myRow = null;



        listaCol = new ArrayList();
        listaRow = new ArrayList();
        listaElementi = new ArrayList();
        listaOggettiRicerca = new ArrayList();

        if (this.inputOrdine.equalsIgnoreCase("")){
            myWinDett = (classWinDett)listaWinDett.get(0);
            intIndiceWinDettCorrente = 0;
        }
        else{
            // devo prendere il WinDett giusto
            for (contatore=0;contatore<listaWinDett.size();contatore++){
                myWinDett = (classWinDett)listaWinDett.get(contatore);
                if (inputOrdine.equalsIgnoreCase(myWinDett.ordine_num)){
                    intIndiceWinDettCorrente = contatore;
                    break;
                }
            }
        }
        // ATTENZIONE
        // creare check per ricerca all'interno del testo
        // e NB devo sempre ricercare la descrizione SENZA
        // il % davanti
        myLabel = new classLabelHtmlObject(myWinDett.ordine_des,"","lblricerca");
        myCol = new classColDataTable("TD","",myLabel);
        myCol.addAttribute("class","classTdLabel");
        listaCol.add(myCol);
        myInput = new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"ricerca","","30","30");
        // inizializzo valore del textbox
        myInput.addAttribute("value", inputRic);
        myInput.addEvent("onkeypress", "javascript:intercetta_tasti();");
        myInput.addEvent("onBlur","javascript:this.value=this.value.toUpperCase();");
        listaOggettiRicerca.add(myInput);
        // label per ricerca dentro descrizione
        listaOggettiRicerca.add(new classLabelHtmlObject("","","lblFindInText"));
        // checkBox per ricerca nella descrizione
        myInput = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX,"chkInText","S");
        myInput.addEvent("onclick","javascript:document.frmricerca.HchkInText.value = this.checked;cerca();");
        if (this.inputInText.equalsIgnoreCase("true")){
            myInput.setChecked(true);
        }
        listaOggettiRicerca.add(myInput);
        // campo hidden per gestione check
        listaOggettiRicerca.add(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"HchkInText",this.inputInText));
        myCol = new imago.http.classColDataTable("TD","",listaOggettiRicerca);
        myCol.addAttribute("class","classTdField");
        listaCol.add(myCol);
        myRow = new classRowDataTable("",listaCol);
        listaRow.add(myRow);
        if (listaWinDett.size()>1){
            // seconda riga
            listaCol = new ArrayList();
            myLabel = new classLabelHtmlObject("","","lblordine");
            myCol = new imago.http.classColDataTable("TD","",myLabel);
            myCol.addAttribute("class","classTdLabel");
            listaCol.add(myCol);
            listaElementi = new ArrayList();
            for (contatore=0;contatore<listaWinDett.size();contatore++){
                classWinDett myWinDettTemp = (classWinDett)listaWinDett.get(contatore);
                // creo gli n radio button per l'ordinamento
                myRadio = new classInputHtmlObject(classTypeInputHtmlObject.typeRADIO,"ordine",myWinDettTemp.ordine_num);
                myRadio.addEvent("onclick","javascript:cambia_ordine(this.value);");
                // il primo deve essere selezionato, per ora
                // salvo selezioni diverse in loopback
                if (inputOrdine.equalsIgnoreCase("")){
                    if (contatore==0){
                        myRadio.setChecked(true);
                    }
                }
                else{
                    if (inputOrdine.equalsIgnoreCase(myWinDettTemp.ordine_num)){
                        myRadio.setChecked(true);
                    }
                }
                listaElementi.add(myRadio);
                myLabel = new classLabelHtmlObject(myWinDettTemp.ordine_des,"","lblordine"+contatore);
                listaElementi.add(myLabel.toString());
            }
            myCol = new imago.http.classColDataTable("TD","",listaElementi);
            myCol.addAttribute("class","classTdField");
            listaCol.add(myCol);
            myRow = new imago.http.classRowDataTable("",listaCol);
            listaRow.add(myRow);
        }
        // aggiungo riga alla tabella di ricerca
        mySearchTable = new classDataTable("classDataEntryTable",listaRow);
        return mySearchTable;
    }

    /**
     *
     *
     *
     */
    private classDataTable creaTabellaDati() throws ImagoWorklistException{

        ArrayList                   listaCol=null;
        String                      strCampi="";
        String                      strWhereChiaveRicerca = "";

        TableResultSet              myTable = null;
        ResultSet                   rs = null;

        classColDataTable           myTH = null, myTD = null;
        classRowDataTable           myTR = null;
        classDataTable              myDataTable = null;

        String                      strTmp="", strCodiceJS="";
        String                      cdc=null;
        String                      strCdcAttivi ="";

        int                         numeroRecordEffettivo=0;


        listaCol = new ArrayList();
        new ArrayList();
        new ArrayList();
        listaCodiciJS = new ArrayList();
        myTable = new TableResultSet();

        try{

            myTable.setLogOnDb(this.myBaseInfo.getUser(), "scanDbEngine");
        }
        catch(java.lang.Exception ex){
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            throw newEx;
        }
        stringaSel = new StringBuffer();
        // ***************
        //****** tabella dati ********************/
        // in base ai dati di input costruisco la sql
        // ****
        vettoreCampi = myWinDett.rig_campi.split("[*]");
        vettoreTestata = myWinDett.rig_testa.split("[*]");
        vettoreLarghezza = myWinDett.rig_largh.split("[*]");
        vettoreDisplay = myWinDett.vis_campi.split("[*]");
        vettoreRigReuturn = myWinDett.rig_return.split("[*]");
        vettoreOrdinamenti = myWinDett.ordine_cl.split("[*]");
        // elaboro stringa di ricerca
        // metto in AND con LIKE il primo campo visualizzabile
        // a meno che non sia stato richiesto l'ordine per un altro campo

        // filtro solo gli attivi

//        strWhere = " ATTIVO='S'";
        // **** ATTENZIONE il campo deleted e' stato rimosso
        // ora questo filtro verra' aapplicato o meno all'interno del DB in WIN_TEST.CL_WHERE
        // ***
        if (!(inputRic.equalsIgnoreCase(""))){
            for (contatore=0;contatore<vettoreCampi.length;contatore++){
                if (vettoreDisplay[contatore].equalsIgnoreCase("1")){
                    if (this.inputInText.equalsIgnoreCase("true")){
			strWhereChiaveRicerca = vettoreCampi[ contatore ] +
						" LIKE '%" +
						inputRic.
						replaceAll ( "[\']" , "\'\'" ) +
						"%'" ;
		    }
                    else{
                        strWhereChiaveRicerca = vettoreCampi[ contatore ] +
                                                                        " LIKE '" +
                                                                        inputRic.
                                                                        replaceAll ( "[\']" , "\'\'" ) +
						"%'" ;
                    }
                    intIndiceCampoInRicerca = contatore;
                    break;
                }
            }
        }
        if (!(myWinTest.cl_where.equalsIgnoreCase(""))){
            if (strWhere.equalsIgnoreCase("")){
                //strWhere = myWinTest.cl_where.replaceAll("[\']", "\'\'");
                strWhere = myWinTest.cl_where;
            }
            else{
                //strWhere = strWhere + " AND " + myWinTest.cl_where.replaceAll("[\']", "\'\'");
                strWhere = strWhere + " AND " + myWinTest.cl_where;
            }
        }
        // ordinamenti
        strOrder = "";
        for (contatore=0;contatore<vettoreOrdinamenti.length;contatore++){
            if (strOrder.equalsIgnoreCase("")){
                strOrder = vettoreOrdinamenti[contatore];
            }
            else{
                strOrder = strOrder + " , " + vettoreOrdinamenti[contatore];
            }
        }
        strFrom = myWinTest.cl_from;
        for (contatore=0;contatore<vettoreCampi.length;contatore++){
            if (strCampi.equalsIgnoreCase("")){
                strCampi = classStringUtil.checkNull(vettoreCampi[contatore]);
            }
            else{
                strCampi = strCampi + " , "+ classStringUtil.checkNull(vettoreCampi[contatore]);
            }
        }
        // controllo su CDC
        // 20061114
        // considero tutti i cdc per i quali
        // l'utente e' abilitato
        // NB non esiste + il concetto di unico cdc attivo
        //if (!(myWinTest.filtro_cdc.equalsIgnoreCase(""))){
        //  if ((this.myBaseInfo.getGlobal().filtro_cdc.equalsIgnoreCase("S"))&&(inputFiltroCdcAttivo.equalsIgnoreCase("S"))){
        // filtro anche per cdc
        if (inputReparto.equalsIgnoreCase("")){
            // inizializzo inputCdc
            for (int i=0;i<this.logged_user.listaReparti.size();i++){
                try{
                    cdc = (String)this.logged_user.listaReparti.get(i);
                }
                catch(java.lang.Exception ex){
                    cdc = "";
                }
                if (!cdc.equalsIgnoreCase("")){
                    if (inputReparto.equalsIgnoreCase("")){
                        this.inputReparto =  cdc;
                    }
                    else{
                        this.inputReparto = this.inputReparto + "*" + cdc;
                    }
                }
            }
        }
        // ora lavoro su inputReparto
        String[] listaCdc = this.inputReparto.split("[*]");
        for (int i=0;i<listaCdc.length;i++){
            if (strCdcAttivi.equalsIgnoreCase("")){
                strCdcAttivi = " WHERE cod_cdc='" + listaCdc[i] + "'";
            }
            else{
                strCdcAttivi = strCdcAttivi + " OR cod_cdc='" + listaCdc[i] + "'";
            }
        }
        if (!strCdcAttivi.equalsIgnoreCase("")){
            sql = "select ordine from centri_di_costo " + strCdcAttivi;
            //myLog.writeLog ( sql , CLogError.LOG_DEBUG ) ;
            try{
                rs = myTable.returnResultSet(this.myBaseInfo.getUser().db.getDataConnection(), sql);
                while(rs.next()){
                    strTmp = rsUtil.returnStringFromRs(rs,"ordine");
                    if (strWhereCdc.equalsIgnoreCase("")){
                        strWhereCdc = " substr(cdc," + strTmp +",1) = 'X'";
                    }
                    else{
                        strWhereCdc += " OR substr(cdc," + strTmp +",1) = 'X'";
                    }
                }

            }
            catch(java.lang.Exception ex){
                logToOutputConsole.writeLogToSystemOutput(this, sql + "\n" + ex.getCause().getMessage())          ;
                ImagoWorklistException newEx = new ImagoWorklistException(ex);
                throw newEx;
            }
            finally{
                try{
                    // resetto stm e rs
                    rs.close();
                    rs = null;
                    myTable.close();
                }
                catch(java.lang.Exception ex){
                }
            }

        }
        //  }
        //}
        //**********
        if (intIndiceCampoInRicerca<vettoreOrdinamenti.length){
	    if ( vettoreOrdinamenti[ intIndiceCampoInRicerca ].toString ().
		 equalsIgnoreCase ( vettoreCampi[ intIndiceCampoInRicerca ].
				    toString () ) )
	    {
		// ok
	    }
	    else
	    {
		// cambio al volo la chiave di ricerca
		strWhereChiaveRicerca = strWhereChiaveRicerca.replaceAll (
			vettoreCampi[ intIndiceCampoInRicerca ].toString () ,
			vettoreOrdinamenti[ intIndiceCampoInRicerca ].toString ().split("[,]")[0].toString() ) ;
	    }
	}
        sql = getSql(strCampi, strWhereChiaveRicerca, strWhere);
        String sqlToCall = "";
        for (int j=0;j<vettoreOrdinamenti.length;j++){
            sqlToCall = "";
            if (j==0){
                // primo giro uso l'originale
                sqlToCall = sql;
            }
            else{
                sqlToCall = getSql(strCampi, strWhereChiaveRicerca.replaceAll(vettoreOrdinamenti[j-1],vettoreOrdinamenti[j]), strWhere);
            }
            // estrapolo  numero di record totali
            String sqlCount = "select count(*) as totale from (" + sqlToCall + ")";
            //myLog.writeLog ( sqlCount , CLogError.LOG_DEBUG ) ;
            try{
                rs = myTable.returnResultSet(this.myBaseInfo.getUser().db.getDataConnection(),sqlCount);
                if (rs.next()){
                    nRecTot = rs.getInt("totale");
                }
                else{
                    nRecTot = 0;
                }
                if (nRecTot!=0){
		    break ;
		}
            }
            catch(java.lang.Exception ex){
                ex.printStackTrace();
                ImagoWorklistException newEx = new ImagoWorklistException(ex);
                throw newEx;
            }
            finally{
                try{
                    rs.close();
                    rs = null ;
                    myTable.close () ;
                }
                catch(java.lang.Exception ex){
                }
            }
        }

        // controllo che
        // se non ho trovato nessun record
        // cercando per il campo i-esimo
        // devo fare la ricerca per il campo i-esimo + 1
        // ATTENZIONE
        // AL MOMENTO considero
        // solo un'alternativa presente in ORDINE_CL

        // ****************
        // aggiungo ordine
        // ****************
        sqlToCall = sqlToCall + " ORDER BY " +  strOrder;
        try{
	    rs = myTable.returnResultSet ( this.myBaseInfo.getUser ().db.
					   getDataConnection () , sqlToCall ) ;
	}
        catch(java.lang.Exception ex){

        }

        // **********************************
        // ************ INTESTAZIONE COLONNE
        // *****************************************
        // creo JSarray
        listaCol = new ArrayList();
        // inserisco una prima colonna vuota che conterra l'indice di riga o il selettore
        myTH = new classColDataTable("TH","20px","&nbsp;");
        myTH.setAttribute(false,"classHeaderTabella", "");
        listaCol.add(myTH);
        for (contatore=0;contatore<vettoreCampi.length;contatore++){
            if (vettoreDisplay[contatore].equalsIgnoreCase("1")){
                myTH = new classColDataTable("TH",classStringUtil.checkNull(vettoreLarghezza[contatore]),classStringUtil.checkNull(vettoreTestata[contatore]));
                myTH.setAttribute(false,"classHeaderTabella", "");
                listaCol.add(myTH);
            }

        }
        // creo prima riga intestazioni
        myTR = new classRowDataTable("",listaCol);
        // ********************************************
        // *********************************************

        myDataTable = new classDataTable("classDataTable",myTR);
        // **************************
        // aggiungo attributo id
        myDataTable.addAttribute("id","oTable");
        // *****************************************************************************************
        // ************************* creo tabella dei dati *****************************************
        // *****************************************************************************************
        indiceRiga = 0;
        // ****
        try{
            // ****************************************
            if (rs.next()){
                rs.last();
                numeroRecordEffettivo = rs.getRow();
                rs.beforeFirst();
            }
            // controllo il numero di record per non finire
            // nella pagina sbagliata nel caso in cui avesso cambiato ricerca
            if (numeroRecordEffettivo < ((Integer.parseInt(inputNumPagina)-1)* Integer.parseInt(myWinTest.righe_max))){
                // out of bound
                inputNumPagina = "1";
            }
            // ****************************************
            while (rs.next()){
                if (indiceRiga==0){
                    // calcolo da quale record devo partire
                    int nriga = (Integer.parseInt(inputNumPagina)-1)* Integer.parseInt(myWinTest.righe_max);
                    if (nriga>0){
                        rs.absolute(nriga+1);
                    }
                }
                listaCol.clear();
                // aggiungo campo per la selezione
                // *******************************
                // creo link per selezione
                this.strCodiciSelezionati = "";
                for (contatore=0;contatore<vettoreCampi.length;contatore++){
                    try{
                        strCodiceJS = rsUtil.returnStringFromRs(rs,vettoreCampi[contatore]).replaceAll("[\']", "\\\\'").trim();
                    }
                    catch(java.lang.Exception ex){
                        strCodiceJS="''";
                    }
                    if (this.strCodiciSelezionati.equalsIgnoreCase("")){
                        this.strCodiciSelezionati = "'" + strCodiceJS + "'";
                    }
                    else{
                        this.strCodiciSelezionati += "@'" + strCodiceJS + "'";
                    }
                }
                // ***
                // tengo traccia dei vari codici
                this.listaCodiciJS.add(this.strCodiciSelezionati);
                // *****

                // aggiungo pulsante per la selezione
                classDivButton myDivButton = new classDivButton(">>", "pulsanteSelettore", "javascript:ricerca()","oSelector" + String.valueOf(indiceRiga),"");
                myTD = new classColDataTable("TD","30",myDivButton);
                listaCol.add(myTD);
                for (contatore=0;contatore<vettoreRigReuturn.length;contatore++){
                    // devo controllare se devo visualizzarlo o meno
                    if (vettoreDisplay[contatore].equalsIgnoreCase("1")){
                        // da visualizzare
                        String larghezzaColonna = "";
                        if (contatore <vettoreLarghezza.length){
                            larghezzaColonna = vettoreLarghezza[contatore];
                        }
                        else{
                            larghezzaColonna = "";
                        }
                        try{
                            myTD = new classColDataTable("TD",classStringUtil.checkNull(larghezzaColonna),rsUtil.returnStringFromRs(rs,vettoreCampi[contatore]));
                        }
                        catch(imagoAldoUtil.ImagoUtilException ex){
                            ImagoWorklistException newEx = new ImagoWorklistException(ex);
                            throw newEx;
                        }
                        listaCol.add(myTD);
                    }
                }
                myTR = new imago.http.classRowDataTable("",listaCol);
                myTR.addAttribute("onClick", "javascript:illumina(this.sectionRowIndex);");
                // setto gestione rollover riga
                myTR.addAttribute("onMouseOver","javascript:rowSelect_over(this.sectionRowIndex);");
                myTR.addAttribute("onMouseOut","javascript:rowSelect_out(this.sectionRowIndex);");

                myDataTable.addRow(myTR);
                indiceRiga++;
                // creo stringhe per vettori JS
                if (stringaSel.length()==0){
                    // primo ciclo
                    stringaSel.append("0");
                }
                else{
                    stringaSel.append(",0");
                }
                if (indiceRiga==Integer.parseInt(myWinTest.righe_max)){
                    break;
                }
            }

        }
        catch(java.lang.Exception ex){
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            throw newEx;
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
        // calcolo il numero di pagine totali per sapere come gestire i pulsanti
        nPagTot = java.lang.Math.abs(nRecTot / Integer.parseInt(myWinTest.righe_max));
        if ((nRecTot % Integer.parseInt(myWinTest.righe_max))>0){
            // esiste resto
            nPagTot ++;
        }
        return myDataTable;
    }


    private String addForms(){

        StringBuffer            sb=null;

        classFormHtmlObject     myForm=null;
        sb = new StringBuffer();
        sb.append("\n");
        // ***** creo form per aggiornamento
        myForm = classFormUtil.getObjectFormAggiorna(myRequest,"","scanDB", "POST","");
        // appendo
        sb.append(myForm.toString());

        sb.append("\n");
        return sb.toString();
    }

    /**
     *
     *  costruisce la sql da eseguire
     *
     * @return String
     */
    private String getSql(String strCampi, String strWhereChiaveRicerca, String strWhere){

        String sql = "";
        String strWhereGlobale= "";

        if (strWhere.equalsIgnoreCase("")){
            strWhereGlobale = strWhereChiaveRicerca ;
        }
        else{
            if (strWhereChiaveRicerca.equalsIgnoreCase("")){
                strWhereGlobale = " (" + strWhere + ")";
            }
            else{
                strWhereGlobale = strWhereChiaveRicerca + " AND (" + strWhere + ")";
            }

        }
        if (strWhereGlobale.equalsIgnoreCase("")){
            if (myWinDett.rig_distinct.equalsIgnoreCase("S")){
                sql = "Select distinct " + strCampi + " from " + strFrom ;
            }
            else{
                sql = "Select " + strCampi + " from " + strFrom ;
            }
            if (!inputWhere.equalsIgnoreCase("")){
                sql = sql + " WHERE " + inputWhere;
                // aggiungo eventuale AND su CDC
                if (myWinTest.filtro_cdc.equalsIgnoreCase("S")){
                    if ( ! ( strWhereCdc.equalsIgnoreCase ( "" ) ) )
                    {
                        sql = sql + " AND (" + strWhereCdc + ")" ;
                    }
                }
            }
            else{
                if (myWinTest.filtro_cdc.equalsIgnoreCase("S")){
                    if ( ! ( strWhereCdc.equalsIgnoreCase ( "" ) ) )
                    {
                        sql = sql + " WHERE (" + strWhereCdc +
                              ")" ;
                    }
                }
            }
        }
        else{
            if (myWinDett.rig_distinct.equalsIgnoreCase("S")){
                sql = "Select distinct " + strCampi + " from " + strFrom + " WHERE " + strWhereGlobale;
            }
            else{
                sql = "Select " + strCampi + " from " + strFrom + " WHERE " + strWhereGlobale;
            }
            //myLog.writeLog ( sql , CLogError.LOG_DEBUG ) ;
            // aggiungo eventuale AND su CDC
            if (myWinTest.filtro_cdc.equalsIgnoreCase("S")){
                if ( ! ( strWhereCdc.equalsIgnoreCase ( "" ) ) )
                {
                    sql = sql + " AND (" + strWhereCdc + ")" ;
                }
            }
            if (!inputWhere.equalsIgnoreCase("")){
                sql = sql + " AND " + inputWhere;
            }
        }
        return sql;
    }

}
