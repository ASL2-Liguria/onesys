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
File: consultazioneCalendarioGes.java
Autore: Lucas
*/

package richieste.Microbiologia2;


import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classFieldsetHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classLegendHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;
import imagoAldoUtil.classTabExtFiles;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;



public class MicrobiologiaEngine extends functionObj
{
private functionDB fDB = null;
private baseUser logged_user = null;


public MicrobiologiaEngine(ServletContext cont, HttpServletRequest req,
                           HttpSession sess) {
  super(cont, req, sess);
  fDB = new functionDB(this);
  this.logged_user = Global.getUser(sess);

}

public MicrobiologiaEngine(ServletContext cont, HttpServletRequest req) {
  this(cont, req, req.getSession(false));
}
public String gestione() {
	  String sOut = new String("");

	  Document cDoc = new Document();
	  Body cBody = new Body();
	  classDivHtmlObject cDivListaEsami = new classDivHtmlObject("ListaEsami");
	  cBody.addAttribute("onLoad","javascript:try{ricordaEsami();}catch(e){};urgenza();");
	  classRowDataTable cRow = null;
	  classColDataTable cCol = null;
	  classLabelHtmlObject cLabel = null;


	  try {

		  classHeadHtmlObject cHead = new classHeadHtmlObject();
		  
		  cHead.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", "DEFAULT_CSS", this.sContxt));
		  cHead.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", "ESAMI_MICRO", this.sContxt));
		  
		  cDoc.appendHead(cHead);

	  
		  CallableStatement stmEsami = null;
		  ResultSet rsEsami = null;
  
		  //select per la selezione degli esami
		  stmEsami = fDB.getConnectWeb().prepareCall("SELECT distinct iden_esa,descr, cod_gruppo, descr_gruppo, classe, urgenza, ORDINE_TAPPO, ordine_esame " +
									"FROM RADSQL.VIEW_SCELTA_ESAMI_MICRO WHERE IDEN_SCHEDA=? AND ATTIVO<>'X' order by ordine_tappo, ordine_Esame" ); 
		  
		  stmEsami.setInt(1, Integer.valueOf(this.cParam.getParam("Hiden_sc_micro").trim()));
		  //stmEsami.setString(2, this.cParam.getParam("Hiden_pro").trim());

		  rsEsami = stmEsami.executeQuery();


		  // creo la sezione egli esami
		
		  classDivHtmlObject Esami = new classDivHtmlObject ();
		  classTableHtmlObject ListaEsami = new classTableHtmlObject();
		  String tappoProv = new String("");
		  
		  classFieldsetHtmlObject FieldSet = new classFieldsetHtmlObject();
		  FieldSet.addAttribute("id", "RiquadroEsami");
		  classLegendHtmlObject Legend = new classLegendHtmlObject ("Esami");
		  FieldSet.appendSome(Legend.toString());
		
		  int cont = 0;


	  while(rsEsami.next())
	  {
	    if(!tappoProv.equalsIgnoreCase(rsEsami.getString("DESCR_GRUPPO")))
	    {
	        if(!tappoProv.equals("")) { 
	        	
	        	for(int idx = cont; idx <=4; idx++)
	        		
	        		cRow.addCol(new classColDataTable("TD","","&nbsp;"));
	        	
	        	ListaEsami.appendSome (cRow.toString());
	        	Esami.appendSome (ListaEsami.toString());
	        	cDivListaEsami.appendSome (Esami.toString());
	        	cont = 0;
	        	}
	        
	        Esami = new classDivHtmlObject (rsEsami.getString("DESCR_GRUPPO"));
	        Esami.addAttribute ("class", rsEsami.getString("CLASSE"));
	        ListaEsami = new classTableHtmlObject();
	       

	        
	        cRow = new classRowDataTable();

	        tappoProv = rsEsami.getString("DESCR_GRUPPO");
	        
	        cCol= new classColDataTable("TH","",tappoProv);
	        cCol.addAttribute ("rowspan","100");
	        cCol.addAttribute ("gruppo", rsEsami.getString("DESCR_GRUPPO"));
	        cCol.addEvent("onClick", "javascript:selezioneProvetta(this.gruppo)");
	        cRow.addCol(cCol);
	        cont=1;    // riporto il contatore a '1' evitando così la colonna del tappo (che è l'header)
	        
	    }

	    if(cont > 4)
	    {
	    	ListaEsami.appendSome (cRow.toString());
	    	cRow = new classRowDataTable();
	    	cont = 1;
	    }

	    if (cont>0 && cont<=4)
	    {
	    	cCol = new classColDataTable("TD", "", "");
	        classInputHtmlObject cCheck = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX, "chkEsami", "");
	        cCheck.addAttribute ("id",rsEsami.getString("IDEN_ESA"));
	        cCheck.addAttribute ("descr",rsEsami.getString("DESCR"));
	        cCheck.addAttribute ("gruppo", rsEsami.getString("DESCR_GRUPPO"));
	        cCheck.addAttribute ("urgenza", rsEsami.getString("URGENZA"));
	        cLabel = new classLabelHtmlObject(rsEsami.getString("DESCR"));
	        cLabel.addAttribute("for",rsEsami.getString("IDEN_ESA"));
	        cCol.appendSome(cCheck.toString());
	        cCol.appendSome(cLabel.toString());
	        cRow.addCol(cCol);
	      
	       
	    }
	    
	    cont++;
	  }
	  
	  for(int idx = cont - 1; idx <=4; idx++)
		  cRow.addCol(new classColDataTable("TD","","&nbsp;"));
	  
	  fDB.close(rsEsami);
	  
	  ListaEsami.appendSome (cRow.toString());
	  Esami.appendSome (ListaEsami.toString());
	  		
	  cDivListaEsami.appendSome(Esami.toString());
	  FieldSet.appendSome(cDivListaEsami.toString());
	  		
	  cBody.addElement(FieldSet.toString());		
	  cDoc.setBody(cBody);
	  sOut = cDoc.toString();


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