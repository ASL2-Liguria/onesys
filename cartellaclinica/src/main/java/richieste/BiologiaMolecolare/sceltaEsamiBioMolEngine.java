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
File: sceltaEsamiMicroEngine.java
Autore: Fabriziod
*/

package richieste.BiologiaMolecolare;



import imago.http.classDivHtmlObject;
import imago.http.classFieldsetHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classLegendHtmlObject;
import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;
import imagoAldoUtil.classTabExtFiles;
import imago_jack.imago_function.obj.functionObj;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;

public class sceltaEsamiBioMolEngine extends functionObj{

	private HttpSession             session = null;
	private ServletContext          context = null;
	private baseUser logged_user = null;
	
	public sceltaEsamiBioMolEngine(HttpServletRequest request, HttpSession session, ServletContext context){
		this.session = session;
	    this.context = context;
	    this.logged_user = Global.getUser(session);
	}
	
	public String sceltaEsamiBioMol(){
		
		Connection Conn =null;
		Statement stm = null;
		CallableStatement stm2 = null;
		ResultSet rset = null;
		ResultSet rset2 = null;
		
		String sOut = new String("");
	  
		Document cDoc = new Document();
		Body cBody = new Body();
		classHeadHtmlObject cHead = new classHeadHtmlObject();
		
		/**
		 * Div container generale
		 */
		classDivHtmlObject cDivContainer = new classDivHtmlObject("container");
		
		/**
		 * Div contenente un materiale e i relativi esami associati
		 */
		String divRiga;
		/**
		 * Materiale con link per selezionare tutti
		 */
		String aMat;
		
		String hRiga = "";
		
		cBody.addAttribute("onLoad","javascript:ricordaEsami();urgenza();");	
		
	//	Crea HEAD pagina html
		cHead.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", "DEFAULT_CSS", this.context));
		cHead.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", "SCELTA_ESAMI_BIOMOL", this.context));
		cDoc.appendHead(cHead);
		
		try{	
			/*ResultSet rsMat = null;
		    String sqlMat = "select iden, cod_art, descr from mg_art where tipo = '1'"; // selezione dei materiali relativi a Biologia Molecolare
		    rsMat = fDB.openRs(sqlMat);*/
			
			Conn = logged_user.db.getDataConnection();
		    
		    stm = Conn.createStatement();
			String query = "select iden, cod_art, descr from mg_art where tipo = '1'";
		    rset = stm.executeQuery(query);
		    
		    /**
		     * Per ogni materiale creo div con classe = "rigaMat" e id = "mat-COD_ART"
		     */
			
			stm2 = Conn.prepareCall("select CET.IDEN IDEN_CET, COD_DEC, DESCR, TE.IDEN from RADSQL.TAB_ESA TE left join RADSQL.COD_EST_TABELLA CET on TE.IDEN = CET.IDEN_TABELLA where CET.CODICE = ?"); 
			
		    while (rset.next()){
								
				//	Crea l'ancora Materiale
				aMat = "<a href='#' onclick='selezionaTutto("+"\""+rset.getObject("COD_ART").toString()+"\""+")' class='aMat' title='Seleziona tutti gli esami associati'>"+rset.getObject("DESCR").toString()+"</a>\n";
				
				stm2.setInt(1,Integer.valueOf(rset.getObject("IDEN").toString()));

				rset2 = stm2.executeQuery();
				
			    int n = 0;
			    String input = "";
			    String descr = "";
			    
			    while (rset2.next()){
			    	descr = rset.getObject("DESCR").toString() +" -> "+ rset2.getObject("DESCR").toString();
			    	input += "<span class='chkMat'><input id='"+rset2.getObject("IDEN").toString()+"' materiale='"+rset.getObject("IDEN").toString()+"' value='"+rset2.getObject("COD_DEC").toString()+"' descr='"+descr+"' name='chkMat' type='checkbox'></input><label for='"+rset2.getObject("IDEN").toString()+"'>"+rset2.getObject("DESCR").toString()+"</label></span>\n";
			    	n++;
			    }
			    
	//			Aggiunge una classe tra h1,h2,h3 per definire l'altezza della riga
				if(n < 3) hRiga = "h1";
				else if(n < 6) hRiga = "h2";
				else if(n < 9) hRiga = "h3";
				else if(n < 12) hRiga = "h4";
				
	//			Ogni associazione e' contenuta in un div con classe rigaMat
				divRiga = "<div id='mat-"+rset.getObject("COD_ART").toString()+"' class='rigaMat "+hRiga+"'>\n";
				
	//			Aggiunge la riga al container
				cDivContainer.appendSome(divRiga+aMat+"<div id=inputContainer>"+input+"</div></div>\n");
				
			}		
		    
		    classFieldsetHtmlObject fieldSet = new classFieldsetHtmlObject();
		    classLegendHtmlObject legend = new classLegendHtmlObject("Esami");
		    fieldSet.appendSome(legend);
		    fieldSet.appendSome(cDivContainer);
		    
			cBody.addElement(fieldSet.toString());
					    
		    //	Chiude il BODY e stampa la pagina
		    cDoc.setBody(cBody);
		    sOut = cDoc.toString();

	  }
	  catch (SqlQueryException ex) {
	    sOut = ex.getMessage();
	  }
	  catch (SQLException ex) {
	    sOut = ex.getMessage();
	  }
	  finally{
	    
	    try {
	    	rset.close();
			stm.close();
		} catch (SQLException e) {
			rset = null;
			stm= null;
		}
	    try {
	    	rset2.close();
			stm2.close();
		} catch (SQLException e) {
			rset2 = null;
			stm2= null;
		}
	    
	  }
	  return sOut;
	}

}