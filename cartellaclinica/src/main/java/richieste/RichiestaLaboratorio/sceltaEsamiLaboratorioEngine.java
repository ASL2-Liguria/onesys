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
File: sceltaEsamiLaboratorioEngine.java
Author: Fabriziod
*/

package richieste.RichiestaLaboratorio;


import imago.http.classAHtmlObject;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classIFrameHtmlObject;
import imago.http.classLIHtmlObject;
import imago.http.classSpanHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classULHtmlObject;
import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;
import imagoAldoUtil.classTabExtFiles;
import imago_jack.imago_function.obj.functionObj;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;

public class sceltaEsamiLaboratorioEngine extends functionObj{
	
	private HttpSession             session = null;
	private ServletContext          context = null;
	private HttpServletRequest      request = null;
	
	private Statement stm = null;
	private Connection Conn =null;
	private ResultSet rset = null;
		
	private baseUser logged_user = null;
	
	public sceltaEsamiLaboratorioEngine(HttpServletRequest request, HttpSession session, ServletContext context){
		this.session = session;
	    this.context = context;
	    this.request = request;
	
	    this.logged_user = Global.getUser(session);
	}
	
	public String printSceltaEsamiLaboratorio(){
		String sOut = new String("");
	  
		Document cDoc = new Document();
		Body cBody = new Body();
		classHeadHtmlObject cHead = new classHeadHtmlObject();
		classTabHeaderFooter HeadSection;
		
		/**
		 * Div container generale
		 */
		classDivHtmlObject cDivContainer = new classDivHtmlObject("container");
		
		cDoc.setDoctype(new Doctype.Html401Transitional());
		
		//cBody.addAttribute("onLoad","javascript:ricordaEsami();urgenza();");	
		
	//	Crea HEAD pagina html
		cHead.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", "DEFAULT_CSS", this.context));
		cHead.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", "SCELTA_ESAMI_LABORATORIO", this.context));
		cDoc.appendHead(cHead);
		
		try{	
			Conn = logged_user.db.getDataConnection();
		    
			classULHtmlObject ulTabber	= new classULHtmlObject();
			ulTabber.addAttribute("id", "nav");
			
			classDivHtmlObject divTabs = new classDivHtmlObject("divtabs");
			
		    stm = Conn.createStatement();
			String query = "select variabile DESCR, valore SERVLET from imagoweb.configura_moduli where modulo = 'TABULATORE_LABO' order by ORDINE";
		    rset = stm.executeQuery(query);
		    
		    classLIHtmlObject 			liTab;
		    classAHtmlObject 			aTab;
		    classSpanHtmlObject			spanTab;
		    
		    classDivHtmlObject			divtab;
		    classIFrameHtmlObject		iFrameTab;
		    
		    int n = 1;
		    while (rset.next()){
		    	//	CREAZIONE TAB
		    	liTab = new classLIHtmlObject(false);
		    	liTab.addAttribute("tab", "divtab"+n);
		    	
		    	//	Assegna l'ID "active" al primo tab
		    	if(n == 1) liTab.addAttribute("id", "active");
		    	
		    	spanTab	= new classSpanHtmlObject();
		    	spanTab.appendSome(rset.getObject("DESCR").toString());
		    	
		    	aTab = new classAHtmlObject("#");
		    	aTab.appendSome(spanTab);
		    	
		    	liTab.appendSome(aTab);
		    	ulTabber.appendSome(liTab);
		    	//	FINE CREAZIONE TAB
		    	
		    	//	CREAZIONE DIVTAB
		    	divtab = new classDivHtmlObject("divtab"+n);
		    	
		    	if(n != 1) divtab.addAttribute("class", "divtab tabhide");
		    	else divtab.addAttribute("class", "divtab");
//		    	String servlet = new String ("");
//		    	servlet = rset.getObject("SERVLET").toString();
//		    	
		    	iFrameTab = new classIFrameHtmlObject(rset.getString("SERVLET").toString()+"?Hiden_pro="+request.getParameter("Hiden_pro")+
		    			"&URGENZA="+request.getParameter("URGENZA")+
		    			"&REPARTO_RICHIEDENTE="+request.getParameter("REPARTO_RICHIEDENTE")+
		    			"&CDC_DESTINATARIO="+request.getParameter("CDC_DESTINATARIO")+
		    			"&METODICA="+request.getParameter("METODICA")+
		    			"&TIPO="+request.getParameter("TIPO")+
		    			"&IDPAGINA="+request.getParameter("IDPAGINA")+
		    			"&Hiden_sc_labo="+request.getParameter("Hiden_sc_labo")+
		    			"&Hiden_sc_micro="+request.getParameter("Hiden_sc_micro"));
		    	iFrameTab.addAttribute("frameborder", "0");
		    	iFrameTab.addAttribute("id", "iFrame-"+n);
		    	
//		    	iFrameTab = new classIFrameHtmlObject(rset.getString("SERVLET").toString()+"?Hiden_pro="+request.getParameter("Hiden_pro")+"&URGENZA="+request.getParameter("URGENZA")+"&REPARTO="+request.getParameter("REPARTO")+"&IDPAGINA="+request.getParameter("IDPAGINA"));
//		    	iFrameTab.addAttribute("frameborder", "0");
//		    	iFrameTab.addAttribute("id", "iFrame-"+n);
		    	
		    	divtab.appendSome(iFrameTab);
		    	divTabs.appendSome(divtab);
		    	//	FINE CREAZIONE DIVTAB
		    	
				n++;
			}	
		    cDivContainer.appendSome(ulTabber);
		    cDivContainer.appendSome(divTabs);
		    
		    
		    /*	TABBER
				<ul id="nav">
					<li tab="divtab1" id="active"><a href="#"><span>Titolo</span></a></li>
					<li tab="divtab2"><a href="#"><span>Titolo</span></a></li>
					<li tab="divtab3"><a href="#"><span>Titolo</span></a></li>
					<li tab="divtab4"><a href="#"><span>Titolo</span></a></li>
					<li tab="divtab5"><a href="#"><span>Titolo</span></a></li>
				</ul>
			
				<div class="divtab" id="divtab1"><iframe frameborder="0" src="http://www.elco.it"></iframe></div>
				<div class="divtab tabhide" id="divtab2"><iframe frameborder="0" src="http://www.google.it"></iframe></div>
				<div class="divtab tabhide" id="divtab3"><iframe frameborder="0" src="http://www.elco.it"></iframe></div>
				<div class="divtab tabhide" id="divtab4"><iframe frameborder="0" src="http://www.google.it"></iframe></div>
				<div class="divtab tabhide" id="divtab5"><iframe frameborder="0" src="http://www.google.it"></iframe></div>
			*/
		    
			cBody.addElement(cDivContainer.toString());
			
			//	Footer
			HeadSection = new classTabHeaderFooter("&nbsp;");
		    HeadSection.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
		    HeadSection.addColumn("classButtonHeader", new classDivButton("Deselez. tutto", "pulsante", "javascript:DeselezionaTutto();", "G", "").toString());
		    HeadSection.addColumn("classButtonHeader", new classDivButton("Continua", "pulsante", "javascript:arrayEsami();", "F", "").toString());
		    HeadSection.addColumn("classButtonHeader", new classDivButton("Annulla", "pulsante", "javascript:self.close();", "A", "").toString());
		    cBody.addElement(HeadSection.toString());
		    
		    //	Chiude il BODY e stampa la pagina
		    cDoc.setBody(cBody);
		    sOut = cDoc.toString();
		    
		    rset.close();
		    stm.close();
	  }
	  catch (SqlQueryException ex) {
	    sOut = ex.getMessage();
	  }
	  catch (SQLException ex) {
	    sOut = ex.getMessage();
	  }
	
	  return sOut;
	}

}