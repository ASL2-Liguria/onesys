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
 * utentiOptionPreferitiEngine.java
 *
 * Created on 27 settembre 2006, 11.23
 */

package gesUtilita.gesUtenti;


import imago.http.ImagoHttpException;
import imago.http.classDivButton;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.classOptionHtmlObject;
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
import imagoAldoUtil.classTabExtFiles;
import imagoAldoUtil.structErroreControllo;
import imagoUtils.classJsObject;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Enumeration;

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
public class utentiOptionPreferitiEngine implements IworklistEngine {

    // oggetti accessibili a tutta la classe
    HttpSession                         mySession;
    ServletContext                      myContext;
    HttpServletRequest                  myRequest;
    String                              myTipoWk = "", arrayJsWorklist="";
    private baseGlobal                  infoGlobali=null;
    private basePC                      infoPC = null;
    private baseWrapperInfo             myBaseInfo =null;
    private baseUser                    logged_user=null;

    private ArrayList                   arrayProcedure = null;
    private ArrayList                   arrayDescrizioneProcedure = null;

    private ArrayList                   arrayPreferitiDisponibili = null;
    private ArrayList                   arrayPreferitiSelezionati = null;

    private ArrayList                   arrayCodicePreferitiDisponibili = null;
    private ArrayList                   arrayCodicePreferitiSelezionati = null;


    /** Creates a new instance of utentiOptionPreferitiEngine */
    public utentiOptionPreferitiEngine(HttpSession myInputSession,
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
        // estropolo dati per connessione DB
        // definisco body
        corpoHtml = new Body();
        new structErroreControllo(false,"");
        // crea testata
        corpoHtml.addElement(this.creaHeaderTabella().toString());
        // tabella procedure
        corpoHtml.addElement(this.creaTabellaComboProcedure().toString());
        // tabella listbox preferiti
        corpoHtml.addElement(this.creaTabellaListBox().toString());
        // creafooter
        corpoHtml.addElement(this.creaFooterTabella().toString());
        // disattivo pulsante destro
        classJsObject.setNullContextMenuEvent(corpoHtml,this.logged_user);
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
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getGlobal()));
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getUser()));
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getPC()));
        sb.append("<SCRIPT>\n");
        sb.append("\n");
        sb.append(classJsObject.convertArrayList2jsArray(this.arrayProcedure, "arrayProcedure",true));
        sb.append(classJsObject.convertArrayList2jsArray(this.arrayCodicePreferitiDisponibili, "arrayCodicePreferitiDisponibili",true));
        sb.append(classJsObject.convertArrayList2jsArray(this.arrayCodicePreferitiSelezionati, "arrayCodicePreferitiSelezionati",true));
        sb.append(classJsObject.convertArrayList2jsArray(this.arrayDescrizioneProcedure, "arrayDescrizioneProcedure",true));
        sb.append(classJsObject.convertArrayList2jsArray(this.arrayPreferitiDisponibili, "arrayPreferitiDisponibili",true));
        sb.append(classJsObject.convertArrayList2jsArray(this.arrayPreferitiSelezionati, "arrayPreferitiSelezionati",true));
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

        arrayPreferitiDisponibili = new ArrayList();
        arrayPreferitiSelezionati = new ArrayList();

        arrayProcedure = new ArrayList();
        arrayDescrizioneProcedure = new ArrayList();

        arrayCodicePreferitiDisponibili = new ArrayList();
        arrayCodicePreferitiSelezionati = new ArrayList();

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
     * metodo che legge i dati in input
     * dell'oggetto Request
     */
    private void leggiDatiInput() throws ImagoWorklistException {

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
            testata.addElement(myJS.getArrayLabel("utentiOptionPreferitiEngine", this.logged_user));
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
        classFormHtmlObject     frmAggiorna=null, myForm = null;

        sb = new StringBuffer();
        sb.append("\n");


        myForm = new classFormHtmlObject("frmRegistra","utentiRegistraPreferiti","POST","wndRegistraPreferiti");
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"hArrayPreferitiDisponibili",""));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"hArrayCodiciPreferitiDisponibili",""));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"hArrayPreferitiSelezionati",""));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"hArrayCodiciPreferitiSelezionati",""));
        myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"hArrayProcedure",""));
        sb.append(myForm.toString());
        // ***** creo form per aggiornamento
        frmAggiorna = classFormUtil.getObjectFormAggiorna(myRequest,"frmAggiorna","worklist", "POST","");
        // appendo
        sb.append(frmAggiorna.toString());
        // *****

        sb.append("\n");
        return sb.toString();
    }


    /**
     * metodo che crea la tabella
     * che contiene il combo delle procedure
     * disponibili per scegliere i preferiti
     *
     */
    private classTableHtmlObject creaTabellaComboProcedure(){

        classTableHtmlObject        myTable = null;
        classTDHtmlObject           myTD = null;
        classTRHtmlObject           myTR = null;
        classLabelHtmlObject        myLabel = null;
        classSelectHtmlObject       mySelect = null;
        classOptionHtmlObject       myOption = null;

        TableResultSet              myTabRs = null, myTabRs2=null;
        ResultSet                   myRs = null, myRs2=null;

        String                      sql = "", strTmp = "";

        classRsUtil                 myUtil = null;




        mySelect = new classSelectHtmlObject("selProcedure");
        mySelect.addEvent("onChange","javascript:changeProcedura();");
        myUtil = new classRsUtil();
        sql = "select procedura from tab_elem_menudd where preferito='S' ";
        sql += " AND lingua='" + this.logged_user.lingua +"'";
        sql += " group by procedura order by procedura";
        myTabRs = new TableResultSet();
        try{
            myTabRs.setLogOnDb(this.logged_user, "utentiOptionPreferitiEngine.creaComboProcedure");
            myRs = myTabRs.returnResultSet(this.logged_user.db.getWebConnection(), sql);
            // ********
            // costruisco il combo
            // ********
            while (myRs.next()){
                strTmp = myUtil.returnStringFromRs(myRs,"procedura");
                myOption = new classOptionHtmlObject(strTmp, strTmp);
                mySelect.appendSome(myOption);
                // aggiungo procedura alla lista
                this.arrayProcedure.add(strTmp);
                myTabRs2 = new TableResultSet();
                try{
		    sql =
			    "select descr_procedura from tab_elem_menudd where procedura='" +
			    strTmp + "'" ;
		    myTabRs2.setLogOnDb ( this.logged_user ,
			    "utentiOptionPreferitiEngine.creaComboProcedure" ) ;
		    myRs2 = myTabRs2.returnResultSet ( this.logged_user.db.
			    getWebConnection () , sql ) ;
		    if ( myRs2.next () )
		    {
			this.arrayDescrizioneProcedure.add ( myUtil.
				returnStringFromRs ( myRs2 , "descr_procedura" ) ) ;
		    }
		}
                catch(java.lang.Exception ex){
                    ex.printStackTrace();
                }
                finally{
                    try{
                        myRs2.close();
                        myRs2 = null;
                        myTabRs2.close();
                    }
                    catch(java.lang.Exception ex){
                    }
                }
            }
        }
        catch(java.lang.Exception ex){
        }
        finally{
            try{
                myRs.close();
                myRs = null;
                myTabRs.close();
                myTabRs = null;
                myRs2 = null;
                myTabRs2 = null;
            }
            catch(java.lang.Exception ex){
            }
        }
        // costruisco le colonne
        // etichetta
        myTD = new classTDHtmlObject(new classLabelHtmlObject("","","lblProcedura"));
        myTD.addAttribute("class","classTdLabel");
        myTR = new classTRHtmlObject();
        myTR.appendSome(myTD);
        // colonna combo
        myTD = new classTDHtmlObject(mySelect);
        myTD.addAttribute("class","classTdField");
        // creo label per descrizione procedura
        myLabel = new classLabelHtmlObject("","","lblDescrProcedura");
        myTD.appendSome("&nbsp;&nbsp;" + myLabel.toString());
        myTR.appendSome(myTD);
        // appendo la riga
        myTable = new classTableHtmlObject();
        myTable.addAttribute("class","classDataEntryTable");
        myTable.appendSome(myTR);


        return myTable;
    }
    // *******


    /**
     * metodo che crea
     * il listbox con i preferiti
     * ancora disponibili
     *
     */
    private classSelectHtmlObject getSelectPreferitiDisponibili(){

        classSelectHtmlObject       mySelect = null;
        TableResultSet              myTabRs = null;
        ResultSet                   myRs = null;

        String                      sql = "", strValue = "", strDescr="", strWhere="";

        classRsUtil                 myUtil = null;

        Enumeration                 keys;

        mySelect = new classSelectHtmlObject("selCampiIn");
        myUtil = new classRsUtil();

        for (int i=0;i<this.arrayProcedure.size();i++){
            sql = "Select descrizione, codice_option from tab_elem_menudd ";
            sql += " WHERE procedura='" + this.arrayProcedure.get(i).toString() + "'";
            sql += " AND preferito = 'S'";
            sql += " AND attivo = 'S'";
            sql += " AND lingua ='" + this.logged_user.lingua +"'";
            try{
                // controllo quali sono quelli già selezionati dall'utente
                keys = this.logged_user.listPersonalOptionMenu.keys();
                while (keys.hasMoreElements()){
                    String key = (String)keys.nextElement();
                    if (key.equalsIgnoreCase(this.arrayProcedure.get(i).toString())){
                        // sono nella procedura corretta
                        ArrayList listaPreferitiUtente = new ArrayList();
                        listaPreferitiUtente = (ArrayList) this.logged_user.listPersonalOptionMenu.get(key);
                        for (int k=0;k<listaPreferitiUtente.size();k++){
                            if (strWhere.equalsIgnoreCase("")){
                                strWhere = " codice_option<>'" + listaPreferitiUtente.get(k).toString() +"'";
                            }
                            else{
                                strWhere = strWhere + " AND codice_option<>'" + listaPreferitiUtente.get(k).toString() +"'";
                            }
                        }
                        if (!strWhere.equalsIgnoreCase("")){
                            strWhere = " AND (" + strWhere + ")";
                        }
                        // esco dal ciclo
                        break;
                    }
                }
            }
            catch(java.lang.Exception ex){
                return mySelect;
            }
            // **********
            sql += strWhere;
            // aggiunto 20080505
            sql += " order by descrizione";
            strWhere = "";
            myTabRs = new TableResultSet();
            try{
                myTabRs.setLogOnDb(this.logged_user, "utentiOptionPreferitiEngine.getSelectPreferitiDisponibili");
                myRs = myTabRs.returnResultSet(this.logged_user.db.getWebConnection(), sql);
                // ********
                // costruisco il combo
                // ********
                strDescr = "";
                strValue = "";
                while (myRs.next()){
                    if (strDescr.equalsIgnoreCase("")){
                        strDescr = myUtil.returnStringFromRs(myRs,"descrizione");
                        strValue = myUtil.returnStringFromRs(myRs,"codice_option");
                    }
                    else{
                        strDescr = strDescr + "*" + myUtil.returnStringFromRs(myRs,"descrizione");
                        strValue = strValue + "*" + myUtil.returnStringFromRs(myRs,"codice_option");
                    }
                    //myOption = new classOptionHtmlObject(strValue, strDescr);
                    //mySelect.appendSome(myOption);
                }
                // aggiungo info agli array
                // Nb ogni elemento avrà i preferiti
                // (descr o valore a seconda dell'array)
                // splittati da un '*'
                // l'indice dell'array è allineato
                // a quello dell'array delle procedure
                // questo per facilitare la gestione
                // in fase di jscript
                this.arrayCodicePreferitiDisponibili.add(strValue);
                this.arrayPreferitiDisponibili.add(strDescr);
            }
            catch(java.lang.Exception ex){
            }
            finally{
                try{
                    myTabRs.close();
                    myTabRs = null;
                    myRs.close();
                    myRs = null;
                }
                catch(java.lang.Exception ex){
                }
            }
        }
        // " normalizzo" i vettori alla lunghezza
        // di quelli delle procedure
        if (this.arrayProcedure.size()>this.arrayCodicePreferitiDisponibili.size()){
            int differenza = this.arrayProcedure.size() - this.arrayCodicePreferitiDisponibili.size();
            for (int k=0;k<differenza;k++){
                this.arrayCodicePreferitiDisponibili.add("''");
                this.arrayPreferitiDisponibili.add("''");
            }
        }
        // *************

        mySelect.addEvent("ondblClick","javascript:add_selected_elements(\"selCampiIn\",\"selCampiOut\",true);aggiornaArray();");
        mySelect.setMultiple(true);
        mySelect.addAttribute("size", "10");

        return mySelect;
    }
    // *******



    /**
     * metodo che crea
     * il listbox con i preferiti
     * ancora disponibili
     *
     */
    private classSelectHtmlObject getSelectPreferitiSelezionati(){

        classSelectHtmlObject       mySelect = null;
        TableResultSet              myTabRs = null;
        ResultSet                   myRs = null;

        String                      sql = "", strValue = "", strDescr="", strWhere="";

        classRsUtil                 myUtil = null;

        Enumeration                 keys;

        mySelect = new classSelectHtmlObject("selCampiOut");
        myUtil = new classRsUtil();

        for (int i=0;i<this.arrayProcedure.size();i++){
            sql = "Select descrizione, codice_option from tab_elem_menudd ";
            sql += " WHERE procedura='" + this.arrayProcedure.get(i).toString() + "'";
            sql += " AND preferito = 'S'";
            sql += " AND LINGUA ='" + this.logged_user.lingua +"'";

            // filtro cmq su quellio attivi
            // perchè quando salvo
            // i valori nella tabell web
            // vengono cancellati e reinseriti
            // quindi anche se uno dei preferiti
            // è stato disattivato, alla successiva
            // riassegnazione verrà cancellato
            sql += " AND attivo = 'S'";
            try{
                // controllo quali sono quelli già selezionati dall'utente
                keys = this.logged_user.listPersonalOptionMenu.keys();
                strWhere = "";
                while (keys.hasMoreElements()){
                    String key = (String)keys.nextElement();
                    if (key.equalsIgnoreCase(this.arrayProcedure.get(i).toString())){
                        // sono nella procedura corretta
                        ArrayList listaPreferitiUtente = new ArrayList();
                        listaPreferitiUtente = (ArrayList) this.logged_user.listPersonalOptionMenu.get(key);
                        strWhere = "";
                        for (int k=0;k<listaPreferitiUtente.size();k++){
                            if (strWhere.equalsIgnoreCase("")){
                                strWhere = " codice_option='" + listaPreferitiUtente.get(k).toString() +"'";
                            }
                            else{
                                strWhere = strWhere + " OR codice_option='" + listaPreferitiUtente.get(k).toString() +"'";
                            }
                        }
                        if (!strWhere.equalsIgnoreCase("")){
                            strWhere = " AND (" + strWhere + ")";
                        }
                        // esco dal ciclo
                        break;
                    }

                }
            }
            catch(java.lang.Exception ex){
                return mySelect;
            }
            // **********
            sql += strWhere;
            // aggiunto 20080505
            sql += " order by descrizione";
            if (!strWhere.equalsIgnoreCase("")){
		myTabRs = new TableResultSet () ;
		try
		{
		    myTabRs.setLogOnDb ( this.logged_user ,
			    "utentiOptionPreferitiEngine.getSelectPreferitiSelezionati" ) ;
		    myRs = myTabRs.returnResultSet ( this.logged_user.db.
			    getWebConnection () , sql ) ;
		    // ********
		    // costruisco il combo
		    // ********
		    strDescr = "" ;
		    strValue = "" ;
		    while ( myRs.next () )
		    {
			if ( strDescr.equalsIgnoreCase ( "" ) )
			{
			    strDescr = myUtil.returnStringFromRs ( myRs ,
				    "descrizione" ) ;
			    strValue = myUtil.returnStringFromRs ( myRs ,
				    "codice_option" ) ;
			}
			else
			{
			    strDescr = strDescr + "*" +
				       myUtil.
				       returnStringFromRs ( myRs , "descrizione" ) ;
			    strValue = strValue + "*" +
				       myUtil.
				       returnStringFromRs ( myRs , "codice_option" ) ;
			}
			//myOption = new classOptionHtmlObject(strValue, strDescr);
			//mySelect.appendSome(myOption);
		    }
		    // aggiungo info agli array
		    // Nb ogni elemento avrà i preferiti
		    // (descr o valore a seconda dell'array)
		    // splittati da un '*'
		    // l'indice dell'array è allineato
		    // a quello dell'array delle procedure
		    // questo per facilitare la gestione
		    // in fase di jscript
		    this.arrayCodicePreferitiSelezionati.add ( strValue ) ;
		    this.arrayPreferitiSelezionati.add ( strDescr ) ;
		}
		catch ( java.lang.Exception ex )
		{
		}
		finally
		{
		    try
		    {
			myTabRs.close () ;
			myTabRs = null ;
			myRs.close () ;
			myRs = null ;
		    }
		    catch ( java.lang.Exception ex )
		    {
		    }
		}
	    }
            else{
                // nessun elemento già selezionato per
                // la procedura corrente
                this.arrayCodicePreferitiSelezionati.add ( "" ) ;
                this.arrayPreferitiSelezionati.add ( "" ) ;
            }
        }
        // " normalizzo" i vettori alla lunghezza
        // di quelli delle procedure
        if (this.arrayProcedure.size()>this.arrayCodicePreferitiSelezionati.size()){
            int differenza = this.arrayProcedure.size() - this.arrayCodicePreferitiSelezionati.size();
            for (int k=0;k<differenza;k++){
                this.arrayCodicePreferitiSelezionati.add("''");
                this.arrayPreferitiSelezionati.add("''");
            }
        }
        mySelect.setMultiple(true);
        mySelect.addAttribute("size", "10");
        mySelect.addEvent("ondblClick","javascript:add_selected_elements(\"selCampiOut\",\"selCampiIn\",true);aggiornaArray();");
        return mySelect;
    }

    /**
     * metodo che crea
     * la tabella che contiene
     * i list box dei preferiti
     *
     */

    private classTableHtmlObject creaTabellaListBox(){

        classTableHtmlObject        myTable = null;
        classTDHtmlObject           myTD = null;
        classTRHtmlObject           myTR = null;
        myTable = new classTableHtmlObject();
        myTable.addAttribute("class","classDataEntryTable");
        // costruisco le colonne
        // costruisco colonne per intestazione
        myTD = new classTDHtmlObject(new classLabelHtmlObject("","","lblDisponibili"));
        myTD.addAttribute("class","classTdLabel");
        myTR = new classTRHtmlObject();
        myTR.appendSome(myTD);

        myTD = new classTDHtmlObject();
        myTD.addAttribute("class","classTdLabel");
        myTR.appendSome(myTD);

        myTD = new classTDHtmlObject(new classLabelHtmlObject("","","lblSelezionati"));
        myTD.addAttribute("class","classTdLabel");
        myTR.appendSome(myTD);
        myTable.appendSome(myTR);

        // colona per preferiti ancora disponibili
        myTD = new classTDHtmlObject(this.getSelectPreferitiDisponibili());
        myTD.addAttribute("class","classTdField");
        myTR = new classTRHtmlObject();
        myTR.appendSome(myTD);
        // colonna per pulsanti
        myTD = new classTDHtmlObject(new classDivButton(">>","pulsante","javascript:add_selected_elements(\"selCampiIn\",\"selCampiOut\",true);aggiornaArray()"));
        myTD.addAttribute("class","classTdField");
        myTD.appendSome(new classDivButton("<<","pulsante","javascript:add_selected_elements(\"selCampiOut\",\"selCampiIn\",true);aggiornaArray();"));
        myTR.appendSome(myTD);
        // colonna per preferiti già selezionati
        myTD = new classTDHtmlObject(this.getSelectPreferitiSelezionati());
        myTD.addAttribute("class","classTdField");
        myTR.appendSome(myTD);
        // appendo la riga


        myTable.appendSome(myTR);


        return myTable;

    }



    private classTabHeaderFooter creaHeaderTabella()  {

        classTabHeaderFooter            tabHeader = null;
        classLabelHtmlObject            myLabel = null;
        myLabel = new classLabelHtmlObject("", "",
        "lbltitolo");
        tabHeader = new classTabHeaderFooter(myLabel);
        return tabHeader;


    }


    private classTabHeaderFooter creaFooterTabella()  {

        classTabHeaderFooter        tabFooter = null;
        classDivButton              divButton=null;

        tabFooter = new classTabHeaderFooter("&nbsp;");
        tabFooter.setClasses("classTabHeader", "classTabFooterSx",
        "classTabHeaderMiddle", "classTabFooterDx");
        divButton = new classDivButton("", "pulsante","javascript:registra()","btSave","");
        tabFooter.addColumn("classButtonHeader",divButton.toString());
        divButton = new classDivButton("", "pulsante", "javascript:chiudi();","btClose","");
        tabFooter.addColumn("classButtonHeader",divButton.toString());

        return tabFooter;

    }

}


