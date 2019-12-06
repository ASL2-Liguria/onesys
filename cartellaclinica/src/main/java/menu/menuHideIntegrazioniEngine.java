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
 * menuHideIntegrazioniEngine.java
 *
 * Created on 31 maggio 2006, 15.48
 */

package menu;
import imago.crypto.CryptPasswordInterface;
import imago.crypto.ImagoCryptoException;
import imago.http.ImagoHttpException;
import imago.http.classHeadHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;
import imagoUtils.logToOutputConsole;

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
 * @author  aldog
 */
public class menuHideIntegrazioniEngine implements IworklistEngine {


    private HttpSession         mySession;
    private ServletContext      myContext;
    private HttpServletRequest  myRequest;


    private baseUser                    logged_user=null;
    private baseGlobal                  infoGlobali=null;
    private basePC                      infoPC = null;
    private baseWrapperInfo             myBaseInfo =null;

    private boolean                     bolSyncPacsActive = false;
    private boolean                     bolVocalObjActive= false;
    // variabile del pathfile js di integrazione PACS
    private ArrayList                   arrayPathJsFileSyncPacs=null;
    private String                      strIdPacsObject = "";
    // integrazione vocale (aggiunto per magicPhoneido che prevede 2 controlli)
//    private vocalInfoProfile            myVocal = null;



    /** Creates a new instance of menuHideIntegrazioniEngine */
    public menuHideIntegrazioniEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest){
        this.mySession = myInputSession;
        this.myContext = myInputContext;
        this.myRequest = myInputRequest;

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
        this.arrayPathJsFileSyncPacs = new ArrayList();
    }


    @Override
	public String addTopJScode(){



        String      pwdChiaro= "";
        String      pwdCriptata = "";
        CryptPasswordInterface myObj = null;

        StringBuffer sb= new StringBuffer();

	Class myObjDefault = null ;
	try
	{
	    myObjDefault = Class.forName ( this.myContext.getInitParameter (
		    "CryptType" ) ) ;
            myObj = ( CryptPasswordInterface ) myObjDefault.newInstance () ;
            pwdChiaro = myObj.deCrypt(this.myBaseInfo.getUser().pwd);
	}
	catch ( ClassNotFoundException ex1 )
	{
            logToOutputConsole.writeLogToSystemOutput(this, "ClassNotFoundException \n" + ex1.getMessage () ) ;
            pwdChiaro="";
	}
	catch ( IllegalAccessException ex )
	{
            logToOutputConsole.writeLogToSystemOutput(this, "IllegalAccessException \n" + ex.getMessage () ) ;
	    /** @todo Handle this exception */
            pwdChiaro="";
	}
	catch ( InstantiationException ex )
	{
            logToOutputConsole.writeLogToSystemOutput(this, "InstantiationException \n" + ex.getMessage () ) ;
	    /** @todo Handle this exception */
            pwdChiaro="";
	}
	catch ( ImagoCryptoException ex )
	{
            logToOutputConsole.writeLogToSystemOutput(this, "ImagoCryptoException \n" + ex.getMessage () ) ;
	    /** @todo Handle this exception */
            pwdChiaro="";
	}

        sb.append("<SCRIPT>");
        sb.append("var bolSyncPacsActive=" + this.bolSyncPacsActive +";\n");
        sb.append("var pwdDecrypted = \"" + pwdChiaro +"\";\n");
        sb.append("var bolVocalObjActive = " + this.bolVocalObjActive +";\n");

        for (int i=0; i<this.logged_user.pwd.length;i++){
            if (pwdCriptata.equalsIgnoreCase("")){
                //ASCIIUtility.toString(this.logged_user.pwd,)
                pwdCriptata =  String.valueOf(Character.getNumericValue((char) logged_user.pwd[i]));
            }
            else{
                pwdCriptata +=  String.valueOf(Character.getNumericValue((char) logged_user.pwd[i]));
            }
        }
        sb.append("var pwdCrypted = \"" + pwdCriptata +"\";\n");
        if (this.bolSyncPacsActive==true){
            // SOLO un pacs per volta puo' essere
            // abilitato a fare la login
            // possono pero' coesistere pacs web
            sb.append("// objectSyncPacs contiene la chiave dell'oggetto PACS che viene usato per fare la sync del login\n");
            sb.append("var objectSyncPacs = \"" + this.getPacsObject() +"\";\n");
        }
        else{
            sb.append("var objectSyncPacs = \"\";\n");
        }
        sb.append("var handle_chiusura='';\n");
        sb.append("</SCRIPT>");
        // classe JS utente per PACS
        sb.append(classJsObject.javaClass2jsClass(this.myBaseInfo.getGlobal()));
        sb.append(classJsObject.javaClass2jsClass(this.myBaseInfo.getUser()));
        sb.append(classJsObject.javaClass2jsClass(this.myBaseInfo.getPC()));
        return sb.toString();
    }

    /**
     * metodo che aggiunge codice js in fondo alla pagina
     *
     */
    @Override
	public String addBottomJScode(){
        StringBuffer sb= new StringBuffer();
        // appendo codice JS
        sb.append("<SCRIPT>");
        sb.append("initGlobalObject();\n");
        sb.append("</SCRIPT>");
        return sb.toString();
    }

    @Override
	public org.apache.ecs.html.Body creaBodyHtml() throws ImagoWorklistException {

        Body                        corpoHtml =null;
        String                      strTmp = "";


        corpoHtml = new Body();
        corpoHtml.addAttribute("onUnload","javascript:scarica();");
        // OBJECT clsKILLHOME
//        myObjectKillHome = new classObjectHtmlObject("clsKillHome","CLSID:7AD029D9-ABD7-40D3-A0AC-BDDF3F309598","cab/killhome/prjkillhome.CAB#version=2,0,0,3");
//        corpoHtml.addElement(myObjectKillHome.toString());
//        corpoHtml.addElement("<SCRIPT src='std/jscript/menu/killHomeEmbObj.js'></script>");
        // aggiungo interfaccia per OCX per PACS
        // non aggiungo + l'oggetto (tag) direttamente
        // ma includo il file js esterno
        strTmp = retrievePacsObject();
        if (!strTmp.equalsIgnoreCase("")){
	    corpoHtml.addElement ( "<SCRIPT src='" + strTmp + "'></script>" ) ;
	}
        strTmp = "";
        // inclusione file js per gestione vocale
        // per definizione oggetto
 /*       if (this.myVocal!=null){
            strTmp = this.myVocal.getJsDefinitionInsideHideFrame();
            if (!strTmp.equalsIgnoreCase("")){
		corpoHtml.addElement ( "<SCRIPT src='" + strTmp +"'></script>" ) ;
	    }
	}*/
        corpoHtml.addElement(addBottomJScode());

        return corpoHtml;
    }

    @Override
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

    @Override
	public classHeadHtmlObject creaHeadHtml() throws ImagoWorklistException {

        classJsObject               myJS = null;
        classHeadHtmlObject         testata = null;
        // Definisco Title del documento
        try {
            myJS = new classJsObject();

            // definisco Head
            testata = new classHeadHtmlObject();
            testata.addElement(myJS.getArrayLabel("menuHideIntegrazioniEngine", this.logged_user));
            // ********** includo i files ********
            testata.addElement(classTabExtFiles.getIncludeString(this.logged_user,"",this.getClass().getName(),this.myContext));
            // **********
            // carico SOLO il js relativo alla sync del PACS
            // selezionata
            if (this.arrayPathJsFileSyncPacs!=null){
                for (int i=0;i< this.arrayPathJsFileSyncPacs.size();i++){
                    testata.addJSLink(this.arrayPathJsFileSyncPacs.get(i).toString());
                }
            }
            // JS relativi al vocale
           /* if (this.myVocal!=null){
                if (this.myVocal.getArrayJsToLoadInsideHideFrame().size()>0){
                      for (int k=0;k< this.myVocal.getArrayJsToLoadInsideHideFrame().size();k++){
                          testata.addJSLink ( this.myVocal.
                                  getArrayJsToLoadInsideHideFrame ().
                                  get ( k ).toString () ) ;
                      }
                }
            }*/

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
    @Override
	public imago.http.classMetaHtmlObject creaMetaHtml() throws ImagoWorklistException {
        classMetaHtmlObject MetaTag=null;

        MetaTag = new classMetaHtmlObject();
        return MetaTag;
    }

    @Override
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

    /**
     * metodo che controlla se sono
     * attive delle sync con pacs
     * e restituisce oggetto corrispondende
     */
    private String retrievePacsObject(){
        // stringa che conterra' gli oggetti Object
        // delle varie integrazioni con pacs
        // se non ci sono Object
        // non verra' aggiunto nulla
        String                          strReturn="";
        

       /* if (this.myBaseInfo.getPC().pacsInfo.bolActive){
            strScriptPacsControl = this.myBaseInfo.getPC().pacsInfo.jsFileForEmbedObject;
            this.setPacsObject(this.myBaseInfo.getPC().pacsInfo.pacsType);
            this.arrayPathJsFileSyncPacs = this.myBaseInfo.getPC().pacsInfo.jsFileToLoad;
            this.bolSyncPacsActive = this.myBaseInfo.getPC().pacsInfo.bolActive;
            strReturn = strScriptPacsControl;
        }*/
        // ************************************************************************
        // ********************* ATTENZIONE verificare che funzioni ***************
        // ************************************************************************
        // ************************************************************************

        /*
        // ********
        // SYSTEM V - Mediprime
        // ********
        if (this.myBaseInfo.getPC().abilita_sinc_mediprime.equalsIgnoreCase("S")){
            strScriptPacsControl = "std/jscript/syncPacsJs/carestreamEmbObj.js";
            // setto il tipo di pacs che verra' usato
            this.setPacsObject(basePacsType.strCodeMediprime);
            this.arrayPathJsFileSyncPacs.add("std/jscript/syncPacsJs/syncSystem5Engine.js");
            //strReturn = mySyncObj.toString();
            strReturn = strScriptPacsControl;
            this.bolSyncPacsActive = true;
        }
        // MIM
        // questo tipo di pacs NON
        // puo' essere utilizzato come pacs per fare l'autologin
        // o per fare l'autosync. e' un caso particolare
        if (this.myBaseInfo.getPC().abilita_pacs_mim.equalsIgnoreCase("S")){
            this.arrayPathJsFileSyncPacs.add("std/jscript/syncPacsJs/syncMIM.js");
            this.setPacsObject(basePacsType.strCodeMim);
            this.bolSyncPacsActive = true;
        }

        // AGFA
        if (this.myBaseInfo.getPC().abilita_pacs_agfa.equalsIgnoreCase("S")){
            this.arrayPathJsFileSyncPacs.add("std/jscript/syncPacsJs/syncAGFA.js");
            this.setPacsObject(basePacsType.strCodeAGFA);
            this.bolSyncPacsActive = true;
        }
*/
        // MediSurf
        // questo tipo di pacs NON
        // puo' essere utilizzato come pacs per fare l'autologin
        // o per fare l'autosync. e' un caso particolare
        if (this.myBaseInfo.getGlobal().attiva_sinc_medisurf.equalsIgnoreCase("S")){
            this.arrayPathJsFileSyncPacs.add("std/jscript/syncPacsJs/syncSystem5MediSurf.js");
        }
        // ***********


        return strReturn;
    }


    private String getPacsObject(){
        return this.strIdPacsObject;
    }


}
