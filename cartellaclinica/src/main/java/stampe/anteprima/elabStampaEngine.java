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

import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseSessionAndContext;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imagoAldoUtil.ImagoUtilException;
import imagoAldoUtil.classEsame;

import java.util.Enumeration;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;

import core.Global;
/**
 * @author fabioc
 */
public class elabStampaEngine  {
    /**
     *
     */
    HttpSession                         mySession;
    ServletContext                      myContext;
    HttpServletRequest                  myRequest;
    String                              requestIden = "", funzioChiamata="",chiaSorgernte="",requestAnteprima="";
    CLogError                           log=null;
   CContextParam                        myContextParam=null;
    private baseGlobal                  infoGlobali=null;
    private basePC                      infoPC = null;
    private baseWrapperInfo             myBaseInfo =null;
    private baseUser                    logged_user=null;
    private Hashtable                   tabellaRichieste=null;

    /**
     * costruttore della classe
     *
     *@param myInputSession     HttpSession sessione chiamante
     *@param myInputContext     ServletContext
     *@param myInputRequest     HttpServletRequest
     */


    public  elabStampaEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest,CContextParam myConteParam) {

        // inizializzazione engine della worklist
        super();
        try {
            mySession = myInputSession;
            myContext = myInputContext;
            this.infoGlobali= baseRetrieveBaseGlobal.getBaseGlobal(myContext, mySession);
            myRequest = myInputRequest;
            myContextParam=myConteParam;
            logged_user = Global.getUser(mySession);
            log=new CLogError(logged_user.db.getWebConnection(), myRequest,  "elabStampa", logged_user.login);
            log.setFileName("elabStampaEngine.java");
            log.setClassName("src.Sel_Stampa.elabStampaEngine");
            tabellaRichieste=getObjectForm(myRequest);
            log.writeInfo("Costruzione elabStampaEngine effettuata con successo");
                    } catch (Exception ex) {
            log.writeLog("Sessione o request non pervenuti all'Engine" + ex.getMessage(),0);
        }
    }

    public Document creaHtml() throws Exception { //ImagoStampeException{

        Document                            Doc=null;
        classEsame                          myEsame=null;
        CLogError                           log=null;
        processPrintInfo                    myProcessInfo=null;
        printInfo                           FamyPrintInfo = null;
        String      			    nome="",pdfUrl="",n_copie="";
        IElaborazioneStampa                 myInterface=null;
        baseSessionAndContext               myBaseHttpInfo = null;
        String                             Stampante="";

        logged_user = Global.getUser(mySession);
        infoPC = (basePC) mySession.getAttribute("parametri_pc");
        myBaseInfo = new baseWrapperInfo(this.logged_user, this.infoGlobali,this.infoPC);
        myBaseHttpInfo=new baseSessionAndContext(myContext,mySession);
        try{
            log=new CLogError(logged_user.db.getWebConnection(), myRequest, "elabStampa", logged_user.login);
            log.setFileName("elabStampaEngine.java");
            log.setClassName("src.Sel_Stampa.elabStampaEngine");}
         catch(Exception ex){
                    }
        log.writeInfo("Inizio Elaborazione");
        chiaSorgernte=(String)tabellaRichieste.get("stampaSorgente");
        funzioChiamata=(String)tabellaRichieste.get("stampaFunzioneStampa");





        myProcessInfo= new processPrintInfo("","",tabellaRichieste,myBaseInfo,myBaseHttpInfo,myRequest);
        try{

            FamyPrintInfo = myProcessInfo.getPrintInfo();

        }
        catch(ImagoUtilException ex){

            log.writeLog("Nella Tebella configura Stampe non esiste una PROCESSCLASSche abbia FUNZIONE_CHIAMANTE="+funzioChiamata+"e CDC="+myEsame.reparto + ex.getMessage(),0);
            //System.out.println("Nella Tebella configura Stampe non esiste una PROCESSCLASSche abbia FUNZIONE_CHIAMANTE="+funzioChiamata+"e CDC="+myEsame.reparto);

             pdfUrl="" ;  }
        //richiama dalla tabella imagoweb.configurastampe tramite la funzione chiamante
        //la classe specifica da utilizzare per rendere il report
        try{
            nome = FamyPrintInfo.getProcessClass();
            Class myObjDefault = Class.forName(nome);
            myInterface = (IElaborazioneStampa)myObjDefault.newInstance();
            myInterface.setParam(FamyPrintInfo,tabellaRichieste,myRequest,myContextParam);
            myInterface.Elaborazione();
            pdfUrl=myInterface.getUrlPdf();
            n_copie=myInterface.getNCopie();
            if (n_copie.equalsIgnoreCase(""))
            {n_copie=FamyPrintInfo.getNcopie();
            }
        }

        catch(Exception ex){
            //System.out.println(ex);
            log.writeLog("Errore nell impostazione dei dati per la creazione della Stampa" + ex.getMessage(),CLogError.LOG_ERROR );
            pdfUrl="";
        }


        String Conf_Stam_Eti="-1";
        log.writeInfo("Eseguta con Successo la creazione della stringa per la stampa");
        CreaDocHtml DocHtml=new CreaDocHtml();
        DocHtml.SetContext(myContext);
        try{
            requestAnteprima=(String) tabellaRichieste.get("stampaAnteprima");
           // requestAnteprima="N";
            String StampaSu=infoPC.scelta_stampante;
            if (funzioChiamata.equalsIgnoreCase("ETICHETTE_STD") || funzioChiamata.equalsIgnoreCase("ETIPAZIENTE_STD") || funzioChiamata.contains("ETI"))
            {
            Stampante=infoPC.printername_eti_client;
            //Rotate=infoPC
            Conf_Stam_Eti=infoPC.configurazione_eti;
            }
            else
            Stampante=infoPC.printername_ref_client;
            if (tabellaRichieste.containsKey("stampaStampante"))
            {
                Stampante=(String) tabellaRichieste.get("stampaStampante");
            }
            DocHtml.setRequest(myRequest);
            DocHtml.SetBasePc(infoPC);
            Doc=DocHtml.creaDocumentoHtml(pdfUrl,n_copie,requestAnteprima,logged_user,Stampante,chiaSorgernte,funzioChiamata,StampaSu,Conf_Stam_Eti,this.infoGlobali,myContextParam); }
        catch(Exception ex){
            //System.out.println(ex);
            log.writeLog("Errore nella creazione dell'Html" +ex.getMessage(),CLogError.LOG_ERROR );
            try{ }
            //Doc=DocHtml.creaDocumentoHtml("","","",logged_user,"","","");}
             catch(Exception e){
            //System.out.println(e);
            log.writeLog("Errore nella creazione del file di errore",CLogError.LOG_ERROR );}
        }
        return Doc;
    }




    public static Hashtable getObjectForm(HttpServletRequest myRequest){
        int                     i=0;
        Enumeration             paramNames =null;
        Hashtable               myHash=null;
       // log.writeInfo("Inizializzazione dei Parametri di Stampa");
        i = myRequest.getParameterMap().size();
        if (i > 0) {
            paramNames = myRequest.getParameterNames();
            myHash = new Hashtable();
            while(paramNames.hasMoreElements()) {
                String parm = (String)paramNames.nextElement();
                myHash.put(parm,myRequest.getParameter(parm));
            }
        }
	return myHash;
    }
}



