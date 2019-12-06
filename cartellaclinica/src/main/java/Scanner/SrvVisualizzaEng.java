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
package Scanner;

//import imago.http.classMetaHtmlObject;
import imago.a_sql.CLogError;
import imago.http.classDivButton;
import imago.http.classHeadHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.*;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;
import core.Global;
import worklist.ImagoWorklistException;

/**
 * @author fabioc
 */
public class SrvVisualizzaEng  {
    public Document DocHtml;
    public String Funzione="";
    private      baseUser               log_user=null;
    public  CLogError           log=null;
    public   String pdfPosition="";
    private ServletContext myContext;
    public SrvVisualizzaEng  () {

        super();

    }

    public Document creaDocumentoHtml(basePC infoPC,baseUser logged_user,HttpServletRequest request,HttpServletResponse respone,ServletContext HtmyContext) throws ImagoWorklistException {

    	myContext=HtmyContext;
        try{

        log=new CLogError(logged_user.db.getWebConnection(), null ,  "elabStampa", logged_user.login);
            log.setFileName("CreaDocHtml");
            log.setClassName("src.Sel_Stampa.CreaDocHtml");
         }
         catch(Exception ex){
            //System.out.println(ex);
           }
           log.writeInfo("Inizializzata CreaDocHtml");
     log_user=logged_user;
        getPdfPosition(request,HtmyContext);
        DocHtml=new Document();
        DocHtml.setHead(addHead(log_user));
        DocHtml.setTitle(creaTitoloHtml());
        DocHtml.appendHead(addTopJScode(pdfPosition,infoPC.printername_ref_client));
        DocHtml.setBody(creaBodyHtml(pdfPosition,"S"));

        return DocHtml;
    }
    //Metodo che crea il Body, che setta l'activeX
    public Body creaBodyHtml(String pdfPosition,String reqAnteprima) throws ImagoWorklistException {

        Body testo=new Body();
        try {
        classHeadHtmlObject ciao;
        testo.addAttribute("class","body");
        testo.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);");


          classLabelHtmlObject label_titolo=new classLabelHtmlObject("","","titoloAnte");
            classTabHeaderFooter header = new classTabHeaderFooter(""+label_titolo);
            classDivButton pulsanteChiudi = new classDivButton("", "pulsante", "javascript:opener.aggiorna();self.close();","btChiudi","");
             header.addColumn("classButtonHeader", pulsanteChiudi.toString());
           // testo.addElement(header.toString());
            testo.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);tutto_schermo();");
            testo.addElement("<SCRIPT>\n");
            log.writeInfo("Richiamo il javascript che che inizializza l'activeX");
            testo.addElement("initMainObject(pdfPosition);");
            testo.addElement("</SCRIPT>\n");
        }
        catch (Exception e)
        {log.writeLog("Errore nella Creazione del Body" +e.getMessage(),CLogError.LOG_ERROR);}
        classJsObject.setNullContextMenuEvent(testo,log_user);
        return testo;
    }


    public String addTopJScode(String pdfPosition,String stampante) {
        //setta le variabili nell'HTML che mi serviranno per creare l'activeX
        //infoPC = (basePC) .getSessione().getAttribute("parametri_pc");
        String OffTop = "-1";
       String OffLeft = "-1";
       String Rotate = "-1";
       log.writeInfo("Inizializzo il Top JS COde");



        StringBuffer sb= new StringBuffer();
        try {
        sb.append(classJsObject.javaClass2jsClass((Object)this.log_user));
        sb.append("<SCRIPT>\n");
        sb.append("var DisPulsPrint='N';\n");
        sb.append("var funzioneStampa='SCANNER';\n");
        sb.append("var StampaSu='N';\n");
        sb.append("var sorgente='SCANNER';\n");
        sb.append("var pdfPosition='"+ pdfPosition + "';\n");
        sb.append("var n_copie='1';\n");
        sb.append("var requestAnteprima='S';\n");
        sb.append("var OffsTop='"+ OffTop+ "';\n");
        sb.append("var OffsLeft='"+ OffLeft+ "';\n");
        sb.append("var Rotation='"+ Rotate+ "';\n");
          stampante=classStringUtil.processReportText(stampante);
        sb.append("var selezionaStampante='"+stampante+ "';\n");
        sb.append("var width=996;\n");
        sb.append("var height=684;\n");
        sb.append("</SCRIPT>\n");
        }
        catch (Exception e)
        {log.writeLog("Errore nella Creazione del TopJs" +e.getMessage(),CLogError.LOG_ERROR);}
        return sb.toString();
    }

    public classHeadHtmlObject addHead(baseUser logged_user){
        baseUser               log_user=null;
        classHeadHtmlObject    testata=null;
        log_user=logged_user;
        classJsObject myJS = null;
        testata = new classHeadHtmlObject();
        myJS = new classJsObject();
        try{
        	
            testata.addJSLink("std/jscript/tutto_schermo.js");
            testata.addJSLink("std/jscript/fillLabels.js");
             testata.addCssLink("std/css/headerTable.css");
            testata.addJSLink("std/jscript/src/Sel_Stampa/elabStampa.js");
            testata.addJSLink("dwr/engine.js");
            testata.addJSLink("dwr/util.js");
            testata.addJSLink("dwr/interface/LogJavascript.js");
            testata.addCssLink("std/css/button.css");
            testata.addCssLink("std/css/normalBody.css");
   //         testata.addElement(classTabExtFiles.getIncludeString(this.log_user, "", this.getClass().getName(), this.myContext));
            testata.addJscode(myJS.getArrayLabel("classStampa",log_user));
            
        } catch (Exception ex) {
            //System.out.println(ex);


        log.writeLog("Errore nella Creazione dell' Head" + ex.getMessage(),CLogError.LOG_ERROR);}
        return testata;
    }
    //crea il tiotolo dell'html
    public Title creaTitoloHtml() throws ImagoWorklistException {
        Title titolo=null;
        try {
//            titolo = new Title("PolaRis");


        } catch (Exception ex) {
            //System.out.println(ex);
            log.writeLog("Errore nella Creazione del Titolo" +ex.getMessage(),CLogError.LOG_ERROR);
        }
        return titolo;
    }
    public void getPdfPosition(HttpServletRequest request,ServletContext HtmyContext){
        pdfPosition="";
        pdfPosition = Global.getBaseUrl();
        pdfPosition += "ServleTReadDocument" + "?iden="+request.getParameter("iden") ;
    }

}
