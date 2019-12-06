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
package ACR;

import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.ImagoHttpException;
import imago.http.classDivButton;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseSessionAndContext;
import imago.http.baseClass.baseUser;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import worklist.ImagoWorklistException;
import core.Global;
/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: </p>
 *
 * <p>Company: </p>
 *
 * @author Fabio
 * @version 1.0
 */
public class SL_ACROCXEngine {
 private baseUser            log_user;
  private baseGlobal          v_globali;
 private HttpSession         mySession=null;
 private  ServletContext    myContext=null;
 CLogError                   log=null;
 private String              idenRef="";
 private String              opener="";
 private String              codice="";
    public SL_ACROCXEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest, CContextParam myConteParam) {
        mySession=myInputSession;
        myContext=myInputContext;
        this.log_user= Global.getUser(mySession);
        try {
            v_globali = baseRetrieveBaseGlobal.getBaseGlobal(myInputContext,
                    myInputSession);
        } catch (ImagoHttpException ex) {
        }
        if (myInputRequest.getParameter("idenRef")!= null)
        idenRef=myInputRequest.getParameter("idenRef")+"";
       else
        idenRef="";
    if (myInputRequest.getParameter("ACRopener")!= null)
        opener=myInputRequest.getParameter("ACRopener")+"";
       else
        opener="1";
    if (myInputRequest.getParameter("codice")!= null)
        codice=myInputRequest.getParameter("codice")+"";
       else
        codice="";


    }
    public Document creaDocumentoHtml()   {
           baseUser               log_user=null;


           log_user= Global.getUser(mySession);
           Document DocHtml=new Document();

           try{

           log=new CLogError(log_user.db.getWebConnection(), null ,  "SL_ACROCX", log_user.login);
               log.setFileName("SL_ACROCX");
               log.setClassName("ACR.SL_ACROCX");
            }
            catch(Exception ex){
               //System.out.println(ex);
              }
          try {

           DocHtml.setHead(addHead(log_user));
           DocHtml.setTitle(creaTitoloHtml());
           DocHtml.appendHead(addTopJScode());
           DocHtml.setBody(creaBodyHtml());
          }
          catch(Exception ex){
               //System.out.println(ex);
              }

           return DocHtml;
       }
       //Metodo che crea il Body, che setta l'activeX
       public Body creaBodyHtml() throws ImagoWorklistException {

           Body testo=new Body();
           try {
               classFormHtmlObject form = new classFormHtmlObject("formACR", "SLACR", "POST");
               form.addAttribute("id","principale");
               testo.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);tutto_schermo();");
               classLabelHtmlObject label_titolo=new classLabelHtmlObject("","","titoloAnte");
               classTabHeaderFooter header = new classTabHeaderFooter(""+label_titolo);
               classDivButton pulsanteChiudi = new classDivButton("", "pulsante", "javascript:self.close();","btChiudi","");
                header.addColumn("classButtonHeader", pulsanteChiudi.toString());
               form.appendSome(header.toString());
                testo.addAttribute("class","body");


                form.appendSome("<SCRIPT>\n");
                form.appendSome("initACR();");
                form.appendSome("</SCRIPT>\n");
                classTabHeaderFooter footer = new classTabHeaderFooter(" ");
                footer.setClasses("classTabHeader", "classTabFooterSx",
                                  "classTabHeaderMiddle", "classTabFooterDx");
                form.appendSome(footer.toString());
                classFormHtmlObject formClose = new classFormHtmlObject("frmID", "javascript:self.close()", "POST");
                formClose.addAttribute("id","id_chiusura");
                classFormHtmlObject formSaveClose = new classFormHtmlObject("frmID2", "javascript:ACRtoCampo('"+opener+"')", "POST");
                formSaveClose.addAttribute("id","id_salva");
                classInputHtmlObject cod= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"hcodice","","");
                testo.addElement(form.toString());
           testo.addElement(formClose.toString());
           formSaveClose.appendSome(cod.toString());
           testo.addElement(formSaveClose.toString());

          classJsObject.setNullContextMenuEvent(testo,this.v_globali);
       }
           catch (Exception e)
           {log.writeLog("Errore nella Creazione del Body",CLogError.LOG_ERROR);}
           return testo;
       }

       public String addTopJScode() {
           StringBuffer sb = new StringBuffer();
           try {
           new baseSessionAndContext(myContext,mySession);
         //  sb.append(classJsObject.javaClass2jsClass((Object)this.v_globali));
           sb.append("<SCRIPT>\n");
           sb.append("var db2xml_path='"+ Global.getBaseUrl() +"XML2DB';\n");
           sb.append("var codice='"+ codice +"';\n");
           if (!idenRef.equalsIgnoreCase("") && idenRef!=null)
           {sb.append("var gestione='N';\n");}
           else
           {sb.append("var gestione='S';\n");}
           sb.append("</SCRIPT>\n");
           }
           catch (Exception e)
           {log.writeLog("Errore nella Creazione del TopJs",CLogError.LOG_ERROR);}
           return sb.toString();
       }

       public classHeadHtmlObject addHead(baseUser logged_user){
           baseUser               log_user=null;
           classHeadHtmlObject    testata=null;
           log_user=logged_user;
           testata = new classHeadHtmlObject();
           new classJsObject();
           try{
               classJsObject label_js = new classJsObject();
               String jsLabel = null;
               jsLabel = label_js.getArrayLabel("SL_ACROCX", log_user);
               testata.addElement(jsLabel);
               /*testata.addJSLink("std/jscript/ACR/Acr_Js.js");
               testata.addJSLink("dwr/engine.js");
               testata.addJSLink("dwr/util.js");
               testata.addJSLink("dwr/interface/Update.js");
               testata.addCssLink("std/css/normalBody.css");
               testata.addJSLink("std/jscript/fillLabels.js");
               testata.addJSLink("std/jscript/tutto_schermo.js");
               testata.addCssLink("std/css/headerTable.css");
               testata.addCssLink("std/css/dataTable.css");
               testata.addCssLink("std/css/dataEntryTable.css");
               testata.addCssLink("std/css/filterTable.css");
               testata.addCssLink("std/css/button.css");
               testata.addCssLink("std/css/dataEntryTable.css");
               *
               */
               testata.addElement(classTabExtFiles.getIncludeString(this.log_user, "", this.getClass().getName(), this.myContext));
           } catch (Exception ex) {
               //System.out.println(ex);


           log.writeLog("Errore nella Creazione dell' Head",CLogError.LOG_ERROR);}
           return testata;
       }
       //crea il tiotolo dell'html
       public Title creaTitoloHtml() throws ImagoWorklistException {
           Title titolo=null;
           try {
             //  titolo = new Title("PolaRis ACR");


           } catch (Exception ex) {
               //System.out.println(ex);
               log.writeLog("Errore nella Creazione del Titolo",CLogError.LOG_ERROR);
           }
           return titolo;
       }

}

