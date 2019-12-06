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
package stampe.anteprima;

//import imago.http.classMetaHtmlObject;
import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.classDivButton;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseUser;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import java.util.Enumeration;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import worklist.ImagoWorklistException;

/**
 * @author fabioc src.Sel_Stampa.CreaDocHtml
 */
public class CreaDocHtml  {
    public Document DocHtml;
    public String Funzione="";
    private baseGlobal basGlobali;
    private      baseUser               log_user=null;
    public  CLogError           log=null;
    public Hashtable TabelleRichieste=null;
    public String[] ParamToJS=null;
    public basePC myPc=null;
    public ServletContext myContext=null;
    public CreaDocHtml  () {

        super();

    }

    public Document creaDocumentoHtml(String pdfPosition,String n_copie,String reqAnteprima,baseUser logged_user,String stampante,String Sorgente, String FunzioneStampa,String StampaSu,String Conf_Stam_Eti, baseGlobal infoGlobal, CContextParam ContextParam) throws ImagoWorklistException {

        basGlobali=infoGlobal;
        log_user=logged_user;
        Funzione=FunzioneStampa;

        try{

        log=new CLogError(logged_user.db.getWebConnection(), null ,  "elabStampa", logged_user.login);
            log.setFileName("CreaDocHtml");
            log.setClassName("src.Sel_Stampa.CreaDocHtml");
         }
         catch(Exception ex){
            //System.out.println(ex);
           }
           log.writeInfo("Inizializzata CreaDocHtml");
        DocHtml=new Document();
        DocHtml.setHead(addHead(log_user));
        DocHtml.setTitle(creaTitoloHtml());
        DocHtml.appendHead(addTopJScode(pdfPosition,n_copie,reqAnteprima,stampante,Sorgente,FunzioneStampa,StampaSu,Conf_Stam_Eti));
        DocHtml.setBody(creaBodyHtml(pdfPosition,reqAnteprima));

        return DocHtml;
    }



    //Metodo che crea il Body, che setta l'activeX
    public Body creaBodyHtml(String pdfPosition,String reqAnteprima) throws ImagoWorklistException {

        Body testo=new Body();
        try {
        testo.addAttribute("class","body");
        testo.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);");

     if (Funzione.equalsIgnoreCase("REFERTO_STD") || Funzione.equalsIgnoreCase("ETIPAZIENTE_STD") || Funzione.equalsIgnoreCase("ETICHETTE_STD")||Funzione.equalsIgnoreCase("SCHEDA_ANAG_STD") || Funzione.equalsIgnoreCase("SCHEDA_ESEC_STD") || Funzione.equalsIgnoreCase("TICKET_STD")   )
        {   classLabelHtmlObject label_titolo=new classLabelHtmlObject("","","titoloAnte");
            classTabHeaderFooter header = new classTabHeaderFooter(""+label_titolo);
            classDivButton pulsanteChiudi = new classDivButton("", "pulsante", "javascript:closeAnteprima();","btChiudi","");
             header.addColumn("classButtonHeader", pulsanteChiudi.toString());
            testo.addElement(header.toString());
            testo.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);tutto_schermo();Inizializza();");

        }
        else
        {  testo.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);");
        }
        // se il campo dove è presente il pdf è vuoto mi ritorna un errore 'Errore campo Pdf Vuoto'
        if (pdfPosition.length()<5)
        {           testo.addElement("<SCRIPT>\n");
                    if (pdfPosition.equalsIgnoreCase("noRef"))
                           testo.addElement("javascript:alert('Esame non Ancora Refertato')");
                    testo.addElement("pdfPosition='http://localhost:8081/SERVLETreadFromDB?iden=a'\n");
                    testo.addElement("</SCRIPT>\n");    }

        //qui se tutto è apposto chiama il javascript che setta l'activeX
        if (reqAnteprima==null)
            reqAnteprima="S";

            if (reqAnteprima.equalsIgnoreCase("N"))
        {testo.addElement("<font face=tahoma size=12 color=black>Stampa in corso....</font>");}
        testo.addElement("<SCRIPT>\n");
        log.writeInfo("Richiamo il javascript che che inizializza l'activeX");
        testo.addElement("initMainObject(pdfPosition);");
        testo.addElement("</SCRIPT>\n");
                classFormHtmlObject frmAfter= new classFormHtmlObject("frmFrom","javascript:callFromAX();","GET");
                testo.addElement(frmAfter.toString());
        }

        catch (Exception e)
        {log.writeLog("Errore nella Creazione del Body" +e.getMessage(),CLogError.LOG_ERROR);}
        classJsObject.setNullContextMenuEvent(testo,log_user);
        return testo;
    }


    public String addTopJScode(String pdfPosition,String n_copie,String reqAnteprima,String stampante,String Sorgente, String FunzioneStampa,String StampaSu,String Conf_Stam_Eti) {
        //setta le variabili nell'HTML che mi serviranno per creare l'activeX
        //infoPC = (basePC) .getSessione().getAttribute("parametri_pc");
        String OffTop = "-1";
       String OffLeft = "-1";
       String Rotate = "-1";
       log.writeInfo("Inizializzo il Top JS COde");
        if (Conf_Stam_Eti!= null && !Conf_Stam_Eti.trim().equalsIgnoreCase(""))
        {
            String[] Configurazione = Conf_Stam_Eti.split("[*]");

            for (int i = 0; i < Configurazione.length; i++) {
                if (Configurazione[i].startsWith("OffTop")) {
                    String[] nuova_imp = Configurazione[i].split("=");
                    OffTop = nuova_imp[1];
                }
                if (Configurazione[i].startsWith("OffLeft")) {
                    String[] nuova_imp = Configurazione[i].split("=");
                    OffLeft = nuova_imp[1];
                }
                if (Configurazione[i].startsWith("Rotate")) {
                    String[] nuova_imp = Configurazione[i].split("=");
                    Rotate = nuova_imp[1];
                }
            }
        }
         String stamp=stampante;

         if (reqAnteprima==null)
            reqAnteprima="S";
        StringBuffer sb= new StringBuffer();
        try {
        	try{
        sb.append(classJsObject.javaClass2jsClass((Object)this.log_user));
        sb.append(classJsObject.javaClass2jsClass((Object)this.basGlobali));
        sb.append(classJsObject.javaClass2jsClass((Object)this.myPc));
        	}
        	catch (Exception e)
            {log.writeLog("Errore aggiungendo baseClass TopJs" +e.getMessage(),CLogError.LOG_ERROR);}

        sb.append("<SCRIPT>\n");
        sb.append("var DisPulsPrint='N';\n");
        sb.append("var funzioneStampa='"+ FunzioneStampa+ "';\n");
        sb.append("var StampaSu='"+ StampaSu+ "';\n");
        sb.append("var sorgente='"+ Sorgente+ "';\n");
        sb.append("var pdfPosition='"+ pdfPosition + "';\n");
        sb.append("var n_copie='"+ n_copie + "';\n");
        sb.append("var requestAnteprima='"+ reqAnteprima+ "';\n");
        sb.append("var OffsTop='"+ OffTop+ "';\n");
        sb.append("var OffsLeft='"+ OffLeft+ "';\n");
        sb.append("var Rotation='"+ Rotate+ "';\n");
try{
        stamp=classStringUtil.processReportText(stamp);
}
catch (Exception e)
{log.writeLog("Errore convertendo la stampante" +e.getMessage(),CLogError.LOG_ERROR);}
        sb.append("var selezionaStampante='"+stamp+ "';\n");

        sb.append("var width=996;\n");
        sb.append("var height=684;\n");
/*        try{
        for (int to=0; to<ParamToJS.length;to++)
        {
            sb.append(ParamToJS[to]);
        }
        }
        catch (Exception e)
        {
        	log.writeLog("Errore aggiungendo parametri esterni del TopJs" +e.getMessage(),CLogError.LOG_ERROR);
        	}*/
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
          
          if (this.myContext!=null)
          {
        	  testata.addElement(classTabExtFiles.getIncludeString(this.log_user, "", "classStampa",this.myContext));  
          }
          else
          {
        	  testata.addJSLink("std/jscript/tutto_schermo.js");
        	  testata.addJSLink("std/jscript/fillLabels.js");
        	  testata.addCssLink("std/css/headerTable.css");
        	  testata.addJSLink("std/jscript/src/Sel_Stampa/elabStampa.js");
        	  testata.addJSLink("dwr/engine.js");
        	  testata.addJSLink("dwr/util.js");
        	  testata.addJSLink("dwr/interface/LogJavascript.js");
        	  testata.addCssLink("std/css/button.css");
        	  testata.addCssLink("std/css/normalBody.css");
        	  testata.addElement(classTabExtFiles.getIncludeString(this.log_user.db.getWebConnection(), "", "classStampa",this.log_user.lingua));
          }
            testata.addJscode(myJS.getArrayLabel("classStampa",log_user));
        } catch (Exception ex) {
            //System.out.println(ex);
        log.writeLog("Errore nella Creazione dell' Head" + ex.getMessage(),CLogError.LOG_ERROR);
    }
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
public void setRequest(HttpServletRequest myRequest){
   int i;
   int cont=0;
    i = myRequest.getParameterMap().size();
   ParamToJS=new String[i];


          if (i > 0) {
              Enumeration paramNames = myRequest.getParameterNames();

              while(paramNames.hasMoreElements()) {

                  String parm = (String)paramNames.nextElement();
                  if(myRequest.getParameter(parm)!=null && !myRequest.getParameter(parm).equalsIgnoreCase(""))
                  {
                      ParamToJS[cont] = "var " + parm + "='" +
                                        myRequest.getParameter(parm) + "';\n";
                      cont++;
                  }
              }
          }

 }
 public void SetBasePc(basePC infoPC)
 {
     this.myPc=infoPC;
 }
 public void SetContext(ServletContext srvContext)
 {
     this.myContext=srvContext;
 }


}
