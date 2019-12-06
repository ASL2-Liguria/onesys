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



import imago.http.classFrameHtmlObject;
import imago.http.classFramesetHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imagoAldoUtil.classTabExtFiles;
import imagoAldoUtil.structErroreControllo;
import imagoUtils.classJsObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Html;
import org.apache.ecs.html.Title;

import worklist.ImagoWorklistException;
import worklist.IworklistEngine;
import core.Global;

public class utentiActionListFramesetEngine implements IworklistEngine {

    private HttpSession         mySession;
    private ServletContext      myContext;
    private baseUser                    logged_user=null;
    private baseGlobal                  infoGlobali=null;
    private basePC                      infoPC = null;
    private baseWrapperInfo             myBaseInfo =null;

    public utentiActionListFramesetEngine(HttpSession myInputSession,
    ServletContext myInputContext,
    HttpServletRequest myInputRequest) throws ImagoWorklistException{
        mySession = myInputSession;
        myContext = myInputContext;
    }

    public String addBottomJScode() {
        return "";
    }


    public org.apache.ecs.html.Body creaBodyHtml() throws ImagoWorklistException {
        Body    myBody =null;
        return myBody;

    }

    public org.apache.ecs.Document creaDocumentoHtml() throws ImagoWorklistException {
        Document doc = null;

        doc = new Document();
        doc.setDoctype(new Doctype.Html401Transitional());


        try {
            initMainObjects();
            doc.setTitle(creaTitoloHtml());
            // attacco Head al documento
            doc.setHead(creaHeadHtml());
            doc.setHtml(creaHtml());
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

    public imago.http.classHeadHtmlObject creaHeadHtml() throws ImagoWorklistException {
        classHeadHtmlObject     testata=null;

        testata = new classHeadHtmlObject();

        return testata;
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

    private Html creaHtml() throws ImagoWorklistException{

        classFrameHtmlObject        myFrame = null;
        classFramesetHtmlObject     myFrameset = null;
        Html                        myHtml = null;
        // definisco frameset
        myFrameset = new classFramesetHtmlObject("80,*","","NO", "0");
        myFrameset.addAttribute("framespacing", "0");
        myFrameset.addAttribute("id", "oFramesetWkTraceUser");
        myFrame = new classFrameHtmlObject("WkTraceUserTopFrame","utentiactionlistfilter", "NO");
        myFrame.addAttribute("id","idWkTraceUserTopFrame");
        myFrame.setNoResize(true);
        myFrameset.appendSome(myFrame);
        myFrame = new classFrameHtmlObject("WkTraceUserMainFrame","blank", "AUTO");
        myFrame.addAttribute("id","idWkTraceUserMainFrame");
        myFrameset.appendSome(myFrame);
        // ****************************

        myHtml = new Html();
        myHtml.addElement(addTopJScode());
        myHtml.addElement(myFrameset.toString());
        // scrivo documento su oggetto di output
        return myHtml;
    }


    private void initMainObjects(){
        new structErroreControllo(false,"");
        this.logged_user = Global.getUser(mySession);
        this.infoGlobali = (baseGlobal) myContext.getAttribute("parametri_globali");
        this.infoPC = (basePC) mySession.getAttribute("parametri_pc");
        this.myBaseInfo = new baseWrapperInfo(this.logged_user, this.infoGlobali,this.infoPC);
    }

    public String addTopJScode(){
        StringBuffer sb= new StringBuffer();
        // ********** includo i files ********
        sb.append(classTabExtFiles.getIncludeString(this.logged_user,"",this.getClass().getName(),this.myContext));
        // **********
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getGlobal()));
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getUser()));
        sb.append(classJsObject.javaClass2jsClass((Object)this.myBaseInfo.getPC()));
        sb.append("<SCRIPT>");
        sb.append("initGlobalObject();\n");
        sb.append("</SCRIPT>");
        return sb.toString();
    }

}
