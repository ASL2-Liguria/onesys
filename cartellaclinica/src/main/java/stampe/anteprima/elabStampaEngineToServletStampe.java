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

import imago.a_util.CContextParam;
import imago.http.classHeadHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseSessionAndContext;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imagoAldoUtil.ImagoUtilException;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import java.util.Enumeration;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import worklist.ImagoWorklistException;
import core.Global;
/**
 * @author linob
 */
public class elabStampaEngineToServletStampe  {
	/**
	 *
	 */
	HttpSession                         mySession;
	ServletContext                      myContext;
	HttpServletRequest                  myRequest;
	String                              requestIden = "", funzioChiamata="",chiaSorgernte="",requestAnteprima="";
	CContextParam                   	myContextParam=null;
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


	public  elabStampaEngineToServletStampe(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest,CContextParam myConteParam) {

		// inizializzazione engine della worklist
		super();
		try {
			mySession = myInputSession;
			myContext = myInputContext;
			this.infoGlobali= baseRetrieveBaseGlobal.getBaseGlobal(myContext, mySession);
			myRequest = myInputRequest;
			myContextParam=myConteParam;
			logged_user = Global.getUser(mySession);
			tabellaRichieste=getObjectForm(myRequest);
		} catch (Exception ex) {
		}
	}

	public Document creaUrlToServletStampe() {
//generazione della stringa di pdf(uguale ad elabStampaEngine)
		Document                            Doc=null;
		processPrintInfo                    myProcessInfo=null;
		printInfo                           FamyPrintInfo = null;
		String      			    nome="",pdfUrl="",n_copie="";
		IElaborazioneStampa                 myInterface=null;
		baseSessionAndContext               myBaseHttpInfo = null;

		logged_user = Global.getUser(mySession);
		infoPC = (basePC) mySession.getAttribute("parametri_pc");
		myBaseInfo = new baseWrapperInfo(this.logged_user, this.infoGlobali,this.infoPC);
		myBaseHttpInfo=new baseSessionAndContext(myContext,mySession);

		chiaSorgernte=(String)tabellaRichieste.get("stampaSorgente");
		funzioChiamata=(String)tabellaRichieste.get("stampaFunzioneStampa");

		myProcessInfo= new processPrintInfo("","",tabellaRichieste,myBaseInfo,myBaseHttpInfo,myRequest);
		try
		{
			FamyPrintInfo = myProcessInfo.getPrintInfo();
		}
		catch(ImagoUtilException ex)
		{
			pdfUrl="" ;  
		}
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
			{
				n_copie=FamyPrintInfo.getNcopie();
			}
		}

		catch(Exception ex){
			pdfUrl="";
		}

		try {
			Doc = creaDocumentoHtml(pdfUrl);
		} catch (ImagoWorklistException e) {

			e.printStackTrace();
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
	
    public Document creaDocumentoHtml(String pdfPosition) throws ImagoWorklistException {

    	Document DocHtml=new Document();
    	DocHtml.setHead(addHead(this.logged_user));
        DocHtml.setBody(creaBodyHtml(pdfPosition));

        return DocHtml;
    }
	
    public classHeadHtmlObject addHead(baseUser logged_user){
        classHeadHtmlObject    testata=null;
        classJsObject myJS = null;

        testata = new classHeadHtmlObject();
        myJS = new classJsObject();
        try{
        	  testata.addJSLink("std/jscript/src/Sel_Stampa/elabStampa.js");
        	  testata.addElement(classTabExtFiles.getIncludeString(this.logged_user.db.getWebConnection(), "", "classStampa",this.logged_user.lingua));
            testata.addJscode(myJS.getArrayLabel("classStampa",this.logged_user));
        } catch (Exception ex) {
    }
        return testata;
    }


	public Body creaBodyHtml(String pdfPosition) throws ImagoWorklistException {

    	Body testo=new Body();
    	try {
    		testo.addAttribute("class","body");

    		if (pdfPosition.length()<5)
    		{           
    			testo.addElement("<SCRIPT>\n");
    			if (pdfPosition.equalsIgnoreCase("noRef"))
    			{
    				testo.addElement("javascript:alert('Esame non Ancora Refertato')");
    			}
    			testo.addElement("pdfPosition='http://localhost:8081/SERVLETreadFromDB?iden=a'\n");
    			testo.addElement("</SCRIPT>\n");    
    		}
    		//Richiamo da qua adobe,caricando nella pagina il pdf
    		testo.addElement("<SCRIPT>\n");
    		testo.addElement("var pdfPosition = '"+pdfPosition+"';");
    		testo.addElement("initMainServletStampe(pdfPosition);");
    		testo.addElement("</SCRIPT>\n");
    	}
    	catch (Exception e)
    	{
    		
    	}
    	return testo;
}
}
    
    




