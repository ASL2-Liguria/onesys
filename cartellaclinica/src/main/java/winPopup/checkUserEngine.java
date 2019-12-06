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
 * checkUser.java
 *
 * Created on 7 luglio 2006, 16.19
 */

package winPopup;
import imago.http.classHeadHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.baseClass.baseUser;
import imago.sql.TableResultSet;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoAldoUtil.checkUser.classAutenticaUtente;
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
public class checkUserEngine implements worklist.IworklistEngine{

    HttpSession                         mySession;
    ServletContext                      myContext;
    HttpServletRequest                  myRequest;

    private baseUser                    logged_user=null;

    private String                      inputLogin="", inputPwd="", inputTipoCrypto="", inputReparto = "";
    private String                      strUserDescription="", strIdenMed="", strUserTipo="", strUserTipoMed="";
    private boolean                     bolAutenticato = false;


    /** Creates a new instance of checkUser */
    public checkUserEngine(HttpSession myInputSession,
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
    }


    /**
     * metodo che aggiunge codice js in testa alla pagina
     *
     */
    public String addTopJScode() {
        StringBuffer sb = new StringBuffer();
        // appendo codice JS
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
        sb.append("var bolAutenticato=" + this.bolAutenticato +";\n");
        sb.append("var userDescription=\"" + this.strUserDescription + "\";\n");
        sb.append("var idenMedFirma=\"" + this.strIdenMed +"\";\n");
        sb.append("var userLogin=\"" + this.inputLogin + "\";\n");
        sb.append("var userReparto=\"" + this.inputReparto + "\";\n");
        sb.append("var userTipo=\"" + this.strUserTipo + "\";\n");
        sb.append("var userTipoMed=\"" + this.strUserTipoMed + "\";\n");

        sb.append("initGlobalObject();\n");
        sb.append("</SCRIPT>");
        return sb.toString();
    }

    public org.apache.ecs.html.Body creaBodyHtml() throws worklist.ImagoWorklistException {
        Body                    corpoHtml = null;
        classAutenticaUtente    myCheck=null;
        TableResultSet          myTable=null;
        ResultSet               rs=null;
        classRsUtil             myUtil = null;

        myCheck = new classAutenticaUtente();
        try{
            this.bolAutenticato = myCheck.autenticaUtente(this.logged_user.db.getWebConnection(), this.inputLogin, this.inputPwd, this.inputTipoCrypto);
            if (this.bolAutenticato){
                // se e' ok faccio query
                // per sapere utente e descrizione
                String sql = "Select web.webuser,radsql.tab_per.descr, radsql.tab_per.iden, tab_per.tipo, tab_per.tipo_med ";
                sql = sql + " from web,radsql.tab_per ";
                sql = sql + " where webuser='" + this.inputLogin + "'";
                sql = sql + " AND web.iden_per = radsql.tab_per.iden";

                try{
                    myUtil = new classRsUtil();
                    myTable = new TableResultSet();
                    rs = myTable.returnResultSet(this.logged_user.db.getWebConnection(),sql);
                    if(rs.next()){
                        this.strUserDescription = myUtil.returnStringFromRs(rs, "descr");
                        this.strIdenMed = myUtil.returnStringFromRs(rs, "iden");
                        this.strUserTipo = myUtil.returnStringFromRs(rs, "tipo");
                        this.strUserTipoMed = myUtil.returnStringFromRs(rs, "tipo_med");
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

            }
        }
        catch(java.lang.Exception ex){
            this.bolAutenticato = false;
        }
        // estropolo dati per connessione DB
        // definisco body
        corpoHtml = new Body();
        // disattivo pulsante destro
        classJsObject.setNullContextMenuEvent(corpoHtml,this.logged_user);

        // *** aggiungo le forms
        corpoHtml.addElement(addForms());
        // ****
        corpoHtml.addElement("\n");
        // aggiunge codice JS in fondo pagina
        corpoHtml.addElement(addBottomJScode());
        return corpoHtml;

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



    /**
     * metodo che legge i dati in input
     * dell'oggetto Request
     */
    private void leggiDatiInput() throws ImagoWorklistException {

        try {
            // parsing dati in ingresso
            this.inputLogin = classStringUtil.checkNull(myRequest.getParameter("hidLogin"));
            this.inputPwd = classStringUtil.checkNull(myRequest.getParameter("hidPwd"));
            this.inputTipoCrypto = classStringUtil.checkNull(myRequest.getParameter("hidTipoCrypto"));
            this.inputReparto = classStringUtil.checkNull(myRequest.getParameter("hidReparto"));
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
        StringBuffer sb = new StringBuffer();
        sb.append("\n");
        return sb.toString();
    }



}
