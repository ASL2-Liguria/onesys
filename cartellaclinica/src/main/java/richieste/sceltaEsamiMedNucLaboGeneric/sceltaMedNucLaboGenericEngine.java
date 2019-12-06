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

package richieste.sceltaEsamiMedNucLaboGeneric;

import core.Global;
import generic.statements.StatementFromFile;
import imago.http.baseClass.baseUser;
import imago.http.*;
import imago.sql.SqlQueryException;
import imagoAldoUtil.classTabExtFiles;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;
import oracle.jdbc.OracleCallableStatement;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.xhtml.legend;
import pluginEngine.standard.plgBTMetodiche;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

public class sceltaMedNucLaboGenericEngine extends functionObj {
	
	private functionDB fDB 					= null;
	private baseUser logged_user 			= null;
	private String sito 					= new String("");
	private String urgenza					= new String("");
	private String tipo						= new String("");
	private String reparto_sorgente			= new String("");
	private String reparto_destinatario		= new String("");
	private String info_colonna				= new String("");
	private String metodica					= new String("");
	
	private functionStr	function_string		= new functionStr();

	public sceltaMedNucLaboGenericEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) {
		super(cont, req, sess);
		this.logged_user 	= Global.getUser(sess);
		fDB 				= new functionDB(this);		
	}

	public sceltaMedNucLaboGenericEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}
	
	public String gestione() throws Exception {

		readDati();
		Document vDoc 	= new Document();		
		Body vBody 		= new Body();
        String sOut 	= new String("");
        
        vDoc.setDoctype(new Doctype.Html401Transitional());        
        vBody.addElement(getHeadDocument(vBody, vDoc));

		classTabHeaderFooter HeadSection2 = new classTabHeaderFooter("Esami Laboratorio Medicina Nucleare");
		vBody.addElement(HeadSection2.toString());
		
		vBody.addElement(getIntestEsami());
        vBody.addElement(getBodyEsami());
        vBody.addElement(getFooterSection());
        vDoc.setBody(vBody);
		
        sOut = vDoc.toString();
		
		return sOut;
		
	}
	
	private String getHeadDocument(Body cBody, Document cDoc){
		
		classDivHtmlObject cDivListaProfili = new classDivHtmlObject("ListaProfili");
		
		classRowDataTable cRow 				= null;
		classColDataTable cCol 				= null;
		CallableStatement stmSito		 	= null;
		CallableStatement stmProfili 		= null;
		ResultSet rsSito	 				= null;
        ResultSet Profili 					= null;
        String rigaPuls 					= new String("");
        String sOut 						= new String("");
     
        int cont							= 0;
        
        
        cBody.addAttribute("onLoad", "javascript:ricordaEsami();");

		try {

			// head
			classHeadHtmlObject cHead = new classHeadHtmlObject();
			cHead.addElement(classTabExtFiles.getIncludeString( this.logged_user, "", "DEFAULT_CSS", this.sContxt));
			cHead.addElement(classTabExtFiles.getIncludeString( this.logged_user, "", "ESAMI_MEDNUCRIA_SV", this.sContxt));
			cDoc.appendHead(cHead);

			//PROFILI /////////////////////////
	        stmProfili = fDB.getConnectWeb().prepareCall("select distinct DESCR PROFILO, cod_gruppo from radsql.TAB_ESA_GRUPPI where sito = 'MNU-VITRO-NOTE' and REPARTO =? order by descr");
			stmProfili.setString(1, this.cParam.getParam("REPARTO_RICHIEDENTE").trim());
	        
	        Profili = stmProfili.executeQuery();
	  
			// creo la sezione della scelta profilo
			classTabHeaderFooter HeadSection = new classTabHeaderFooter("Profili Laboratorio Medicina Nucleare");
			cDivListaProfili.appendSome(HeadSection.toString());
			
			classFieldsetHtmlObject fsProfili = new classFieldsetHtmlObject();
			fsProfili.addAttribute("id","divProfiliFS");
			legend leg = new legend("Profili");
			fsProfili.appendSome(leg.toString());
			
			classTableHtmlObject ListaProfili = new classTableHtmlObject("100%", "", "sceltaProfili");
			ListaProfili.addAttribute("class", "classDataTableMednucRicerca");

			classRowDataTable Riga = new classRowDataTable();

			cCol = new classColDataTable("TD", "100%", "");
			
	        classULHtmlObject _UL = new classULHtmlObject();
	        classLIHtmlObject _LI = null;

	        _UL.addAttribute("class", "pulsanteULCenter");
	        _UL.addAttribute("id", "elenco_profili");

			while (Profili.next()) {
				
				classAHtmlObject A= new classAHtmlObject("javascript:" + hRequest.getParameter("funzione_profili")+ "('" + Profili.getString("COD_GRUPPO")  + "');", Profili.getString("PROFILO"));
				
		        _LI = new classLIHtmlObject(true);
		        _LI.addAttribute("id", "profilo_" + Profili.getString("COD_GRUPPO"));
		        _LI.appendSome(A.toString());
		        
		        rigaPuls += _LI.toString();

	            cont++;
	            
	            if(((cont) >= Integer.parseInt(hRequest.getParameter("num_col")))&& cont > 0)
	            {	            	
	   			 	_UL.appendSome(rigaPuls);
	   			 	rigaPuls = new String("");
	   			 	cCol.appendSome(_UL.toString());
	   			 	Riga.addCol(cCol);
	   			 	ListaProfili.appendSome(Riga.toString());
	   			 	cont=0;
	   			 	
	   				Riga=new classRowDataTable();
	   				cCol = new classColDataTable("TD", "100%", "");
	   			 	
	                _UL = new classULHtmlObject();
	                _UL.addAttribute("class", "pulsanteULCenter");
	                _UL.addAttribute("id", "elenco_profili");
	            }

			}
			
			
			_UL.appendSome(rigaPuls);
			cCol.appendSome(_UL.toString());
			Riga.addCol(cCol);
			ListaProfili.appendSome(Riga.toString());

			fDB.close(Profili);

			fsProfili.appendSome(ListaProfili.toString());
			cDivListaProfili.appendSome(fsProfili.toString());
		
			sOut = cDivListaProfili.toString();

		} catch (SqlQueryException ex) {
			sOut = ex.getMessage();
		} catch (SQLException ex) {
			sOut = ex.getMessage();
		}
		
		return sOut;

	}
	
	private String  getIntestEsami(){
		

		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		String sOut = new String("");

		// creo la sezione egli esami
		classTableHtmlObject ListaEsamiInt = new classTableHtmlObject("100%","", "sceltaEsami");
		ListaEsamiInt.addAttribute("class", "classDataTableMednuc");
		ListaEsamiInt.appendSome("<thead>");

		cRow = new classRowDataTable();
		cCol = new classColDataTable("TH", "", "CHECK ESAME");
		cCol.addAttribute("class", "intCheck");
		cRow.addCol(cCol);

		cCol = new classColDataTable("TH", "", "CODICE ESAME");
		cCol.addAttribute("class", "intCodEsa");
		cRow.addCol(cCol);

		cCol = new classColDataTable("TH", "", "ESAME");
		cCol.addAttribute("class", "intEsami");
		cRow.addCol(cCol);

		cCol = new classColDataTable("TH", "", "CODICE"); 
		cCol.addAttribute("class", "intCod");
		cRow.addCol(cCol);
		
		if (this.info_colonna.equals("S")){						
			cCol = new classColDataTable("TH", "", "INFO ESAME");		
			cCol.addAttribute("class", "intTempi");
			cRow.addCol(cCol);
		}

		ListaEsamiInt.appendSome(cRow.toString());
		ListaEsamiInt.appendSome("</thead>");
		sOut=ListaEsamiInt.toString();

		return sOut;
	}

	private String getBodyEsami() throws Exception {
		
	    ResultSet rsSito = null;
	    ResultSet rsEsami = null;
		classDivHtmlObject cDivListaEsami = new classDivHtmlObject("ListaEsami");
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
        int cont = 0;
        String vOut = new String("");

		try{
			classTableHtmlObject ListaEsami = new classTableHtmlObject("100%","", "sceltaEsami");
			ListaEsami.addAttribute("class", "classDataTableMednuc");
			ListaEsami.appendSome("<tbody>");
			
			// STATEMENT ESAMI		
			StatementFromFile sff = new StatementFromFile(this.hSessione);
	        ResultSet rs = sff.executeQuery("OE_Richiesta.xml","getEsamiRichiedibili", new String[]{this.reparto_destinatario, this.reparto_sorgente, this.tipo, this.urgenza, this.metodica});

			while (rs.next()) {
				
				cont++;

				cRow = new classRowDataTable();
				cRow.addAttribute("id", "tr"+cont);
				
				// Ordine Posizione Campi REC_SCELTA_ESAMI : IDEN - DESCR - DESCSIRM - COD_DEC - COD_ESA - COD_MIN - METODICA - URGENZA - MDC
				cCol = new classColDataTable("TD", "", "");
				classInputHtmlObject cCheck = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX, "chkEsami", "");
				cCheck.addAttribute("id", rs.getString("COL01"));
				cRow.addAttribute("id_esame",rs.getString("COL01"));
				cCheck.addAttribute("descr", rs.getString("COL02"));
				cCheck.addAttribute("cod_esa", rs.getString("COL05"));
				cCheck.addAttribute("rownumber", String.valueOf(cont) );
				cCheck.addEvent("onClick", "javascript: valorizzaCampo(this);");
				cCol.addAttribute("class", "tdCheck");
				cCol.appendSome(cCheck.toString());
				cRow.addCol(cCol);

				cCol = new classColDataTable("TD", "", rs.getString("COL05"));
				cCol.addAttribute("class", "tdCodEsa");
				cRow.addCol(cCol);

				cCol = new classColDataTable("TD", "", rs.getString("COL02"));
				cCol.addAttribute("class", "tdDescr");
				cRow.addCol(cCol);

				cCol = new classColDataTable("TD", "", rs.getString("COL06"));
				cCol.addAttribute("class", "tdCod");
				cRow.addCol(cCol);
				
				if (this.info_colonna.equals("S")){
					
					cCol = new classColDataTable("TD", "", ""); 
					cCol.addAttribute("class", "tdTempi");
					classInputHtmlObject inputTempi = new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT, "txtInfoEsami"+cont,"");
					inputTempi.addAttribute("class", "tempi");
					inputTempi.addAttribute("id","txtInfoEsami"+cont);
					cCol.appendSome(inputTempi);
					cRow.addCol(cCol);
					
				}

				ListaEsami.appendSome(cRow.toString());	

			}

			rs.close();
			sff.close();

			cDivListaEsami.appendSome(ListaEsami.toString());
			ListaEsami.appendSome("</tbody>");
			vOut=cDivListaEsami.toString();
		
			
		} catch (SqlQueryException ex) {
			vOut = ex.getMessage();
		} catch (SQLException ex) {
			vOut = ex.getMessage();
		}
		
		return vOut;

	}
	
	private String getFooterSection(){
		
		// Inserisco il footer con i tre pulsanti
		classTabHeaderFooter HeadSection = new classTabHeaderFooter("&nbsp");
		HeadSection.setClasses("classTabHeader", "classTabFooterSx","classTabHeaderMiddle", "classTabFooterDx");
		HeadSection.addColumn("classButtonHeader", new classDivButton("Deselez. tutto", "pulsante","javascript:DeselezionaTutto();", "G", "").toString());
		HeadSection.addColumn("classButtonHeader",
		new classDivButton("Continua", "pulsante","javascript:arrayEsami();", "F", "").toString());
		HeadSection.addColumn("classButtonHeader", new classDivButton("Annulla", "pulsante", "javascript:self.close();", "A", "").toString());

		return HeadSection.toString();
		
	}
	
	private void readDati() {

		this.tipo 					= hRequest.getParameter("TIPO");
		this.reparto_sorgente		= hRequest.getParameter("REPARTO_RICHIEDENTE");		
		this.reparto_destinatario 	= hRequest.getParameter("CDC_DESTINATARIO");     
		this.info_colonna 			= hRequest.getParameter("INFO_COLONNA");
		this.urgenza 				= hRequest.getParameter("URGENZA") != "" ? hRequest.getParameter("URGENZA") : "0" ;
		this.sito 					= hRequest.getParameter("SITO");
		this.metodica				= hRequest.getParameter("METODICA");
				
	}

}