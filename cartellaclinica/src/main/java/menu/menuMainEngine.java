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
 * menuMainEngine.java
 *
 * Created on 11 settembre 2006, 11.06
 */

package menu;

import imago.http.ImagoHttpException;
import imago.http.classBarMenu;
import imago.http.classHeadHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.classTabBarMenu;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import java.util.ArrayList;

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
public class menuMainEngine implements IworklistEngine {

    private HttpSession         mySession;
    private ServletContext      myContext;
    private baseUser                    logged_user=null;
    private baseGlobal                  infoGlobali=null;
    private basePC                      infoPC = null;
    private baseWrapperInfo             myBaseInfo =null;

    /** Creates a new instance of menuMainEngine */
    public menuMainEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest){
        this.mySession = myInputSession;
        this.myContext = myInputContext;

    }

    public String addBottomJScode() {
        StringBuffer sb= new StringBuffer();
        // appendo codice JS
        sb.append("<SCRIPT>\n");
        sb.append("initGlobalObject();\n");
        sb.append("</SCRIPT>");
        return sb.toString();
    }

    public String addTopJScode() {


        StringBuffer sb= new StringBuffer();
        sb.append("<SCRIPT>");
/*
        SERVER_NAME         request.getServerName();
        SERVER_SOFTWARE     request.getServletContext().getServerInfo();
        SERVER_PROTOCOL     request.getProtocol();
        SERVER_PORT         request.getServerPort()
        REQUEST_METHOD      request.getMethod()
        PATH_INFO           request.getPathInfo()
        PATH_TRANSLATED     request.getPathTranslated()
        SCRIPT_NAME         request.getServletPath()
        DOCUMENT_ROOT       request.getRealPath("/")
        QUERY_STRING        request.getQueryString()
        REMOTE_HOST         request.getRemoteHost()
        REMOTE_ADDR         request.getRemoteAddr()
        AUTH_TYPE           request.getAuthType()
        REMOTE_USER         request.getRemoteUser()
        CONTENT_TYPE        request.getContentType()
        CONTENT_LENGTH      request.getContentLength()
        HTTP_ACCEPT         request.getHeader("Accept")
        HTTP_USER_AGENT     request.getHeader("User-Agent")
        HTTP_REFERER        request.getHeader("Referer")
*/

        sb.append("var homepage=\"" + this.myBaseInfo.getGlobal().urlHomepage +"\";\n");
        sb.append("</SCRIPT>");
        // classe JS utente per PACS
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getGlobal()));
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getUser()));
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getPC()));

        return sb.toString();
    }

    public org.apache.ecs.html.Body creaBodyHtml() throws ImagoWorklistException {

        Body                        corpoHtml = null;

        classBarMenu                myBarMenu;
        ArrayList                   lista ;
        classTabBarMenu             barList=null;


        // estrapolo subito utente loggato
        try{
            // definisco body
            corpoHtml = new Body();
            // aggiungo BarMenu
            // aggiungo elementi al barmenu
            lista = new ArrayList();
            /*
            myTextLink = new classTextLink("Cambia Login", "javascript:cambiaLogin();");
            lista.add(myTextLink);
            myTextLink = new classTextLink("Lock RIS", "javascript:lockWorkstation();");
            lista.add(myTextLink);
            myTextLink = new classTextLink("CDC", "javascript:open_choose_cdc();");
            lista.add(myTextLink);
            myTextLink = new classTextLink("Esci", "javascript:top.close();");
            lista.add(myTextLink);
            */
            barList = new classTabBarMenu(this.logged_user,"barMenuMain");
            lista = barList.getBarMenu();
            myBarMenu = new classBarMenu("barMenuMain",lista, this.logged_user);
            corpoHtml.addElement(myBarMenu.toString());
            // disattivo pulsante destro
            classJsObject.setNullContextMenuEvent(corpoHtml,this.logged_user);
            // ***
            corpoHtml.addElement(addBottomJScode());
        }
        catch(java.lang.Exception ex){
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            throw newEx;
        }
        // appendo corpo al documento
        return corpoHtml ;




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

    public classHeadHtmlObject creaHeadHtml() throws ImagoWorklistException {

        classJsObject               myJS = null;
        classHeadHtmlObject         testata = null;
        // Definisco Title del documento
        try {
            myJS = new classJsObject();
            new classRsUtil();

            // definisco Head
            testata = new classHeadHtmlObject();
            testata.addElement(myJS.getArrayLabel("menuMain", this.logged_user));
            // ********** includo i files ********
            testata.addElement(classTabExtFiles.getIncludeString(this.logged_user,"",this.getClass().getName(),this.myContext));
            // **********

            // aggiungo CSS del menu
            // testata.addCssLink("");
            // testata.addCssLink("");

            /*Funzione js open_choose_cdc() per l'apertura della pagina
            di gestione dei centri di costo*/
            // testata.addJSLink("");
            // testata.addJSLink("");
            // carico SOLO il js relativo alla sync del PACS

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

}
