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
 * Errore_Configurazione.java
 *
 * Created on 29 agosto 2006, 12.02
 */

package stampe.anteprima;
import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.ImagoHttpException;
import imago.http.classHeadHtmlObject;
import imago.http.baseClass.baseUser;
import imagoUtils.classJsObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;
/**
 *
 * @author  fabioc
 */
public class Errore_Configurazione {
    private baseUser            LoggedUser;
    CLogError                   log=null;
    String                      MyOrigine="";
     String                     TypeError="";
    /** Creates a new instance of SL_Stampa_TabEngine */
    public Errore_Configurazione (HttpSession myInputSession, HttpServletRequest myInputRequest,String Origine, String Type,CContextParam myContextParam) {

        LoggedUser=Global.getUser(myInputSession);
        MyOrigine=Origine;
        TypeError=Type;

        try{

        log=new CLogError(LoggedUser.db.getWebConnection(), myInputRequest,"SL_Stampa_TabFiltri", LoggedUser.login);
            log.setFileName("SL_Stampa_TabEngineFiltri");
            log.setClassName("src.Sel_Stampa.SL_Stampa_TabEngineFiltri");
         }
         catch(Exception ex){
            //System.out.println(ex);
           }
    }
    public org.apache.ecs.Document creaDocumentoHtml()  {
        Document doc = null;

        doc = new Document();

        doc.setHead(addHead(LoggedUser));

        classJsObject label_js = new classJsObject();
        String jsLabel = null;
        try{
        jsLabel = label_js.getArrayLabel(MyOrigine, LoggedUser);
        }
        catch(ImagoHttpException e){
        log.writeLog("Problemi nel trovare nella tabella delle lingue i client esatti ",CLogError.LOG_ERROR);}
        doc.appendHead(jsLabel);

        doc.setBody(creaBody());
        return doc;

    }

      public Body creaBody(){
        Body testo = new Body();
        //testo.setOnLoad("tutto_schermo();fillLabels(arrayLabelName,arrayLabelValue);");

        testo.addAttribute("onLoad", "fillLabels(arrayLabelName,arrayLabelValue);");
         testo.addElement("<SCRIPT>");

      testo.addElement("alert(ritornaJsMsg('"+ TypeError +"'));");
        testo.addElement("</SCRIPT>");
        return testo;
    }


        public classHeadHtmlObject addHead(baseUser logged_user){
        classHeadHtmlObject    testata=null;
        testata = new classHeadHtmlObject();
        new classJsObject();
        try{

            testata.addJSLink("std/jscript/fillLabels.js");

            //testata.addJSLink("sdt/jscript/src/ListeLavoro/SelDeselAll.js");
            //testata.addJscode(myJS.getArrayLabel("ServletLLFiltri",LoggedUser));

            /*Gestione del calendario*/



        } catch (Exception ex) {
            //System.out.println(ex);
        log.writeLog("Problemi nel creare la testata della pagina Html ",CLogError.LOG_ERROR);}
        return testata;
    }


}
