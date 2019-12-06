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
Autore: Lucas
 */

package richieste.sceltaEsamiLabo;

import generic.statements.StatementFromFile;
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
import imago_jack.imago_function.str.functionStr;

import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;

public class sceltaEsamiLaboEngine extends functionObj {
	private functionDB fDB 			= null;
	private functionStr fStr 		= null;
	private baseUser logged_user 	= null;

	public sceltaEsamiLaboEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) {
		super(cont, req, sess);
		fDB 				= new functionDB(this);
		fStr				= new functionStr();
		this.logged_user 	= Global.getUser(sess);

	}

	public sceltaEsamiLaboEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() throws Exception {
        
		String sOut 				= new String("");
        Document cDoc 				= new Document();
        Body cBody 					= new Body();
        classRowDataTable cRow 		= null;
        classColDataTable cCol 		= null;
        classLabelHtmlObject cLabel = null;
        
        classDivHtmlObject cDivListaEsami = new classDivHtmlObject("ListaEsami");
        classDivHtmlObject cDivListaProfili = new classDivHtmlObject("DivProfili");
        cBody.addAttribute("onLoad","javascript:try{ricordaEsami();}catch(e){}"); 
        
        try {

        	classHeadHtmlObject cHead = new classHeadHtmlObject();

        	cHead.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", "DEFAULT_CSS", this.sContxt));
        	cHead.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", "ESAMI_LABO", this.sContxt));

        	cDoc.appendHead(cHead);

        	CallableStatement stmProfili = null;
        	ResultSet rsProfilo = null;

        	// Profili
        	stmProfili = fDB.getConnectWeb().prepareCall("select distinct DESCR PROFILO, cod_gruppo,URGENZA	 from RADSQL.tab_esa_gruppi where sito = 'LABO' and reparto=? and urgenza=?");

        	stmProfili.setString(1, this.cParam.getParam("REPARTO").trim());
        	stmProfili.setString(2, this.cParam.getParam("URGENZA").trim());

        	CallableStatement stmEsami 	= null;

        	String cdc_destinatario 	=  hRequest.getParameter("CDC_DESTINATARIO");
        	String reparto_richiedente 	=  hRequest.getParameter("REPARTO_RICHIEDENTE");
        	String tipo 				=  hRequest.getParameter("TIPO");
        	String metodica 			=  hRequest.getParameter("METODICA");
        	String urgenza 				=  hRequest.getParameter("URGENZA") != "" ? hRequest.getParameter("URGENZA") : "0" ;


        	StatementFromFile sff 	= new StatementFromFile(this.hSessione);
        	ResultSet rsEsami 		= sff.executeQuery("OE_Richiesta.xml","getEsamiRichiedibili", new String[]{cdc_destinatario, reparto_richiedente, tipo, urgenza, metodica});

        	/*
	    	//select per la selezione degli esami
			stmEsami = fDB.getConnectWeb().prepareCall("SELECT distinct iden_Esa,descr, iden_tappo, tappo, urgenza, classe,ORDINE_TAPPO, ordine_esame " +
														"FROM RADSQL.VIEW_SCELTA_ESAMI_LABO WHERE IDEN_SCHEDA=? " +
														"and URGENZA=? AND ATTIVO<>'X' ORDER BY ORDINE_TAPPO, iden_tappo, ordine_esame"); 

			stmEsami.setInt(1, Integer.valueOf(this.cParam.getParam("Hiden_sc_labo").trim()));
			stmEsami.setInt(2, Integer.valueOf(this.cParam.getParam("URGENZA").trim()));
        	 */

        	rsProfilo = stmProfili.executeQuery();

        	classFieldsetHtmlObject FieldSet = new classFieldsetHtmlObject();
        	FieldSet.addAttribute("id", "RiquadroProfili");
        	classLegendHtmlObject Legend = new classLegendHtmlObject ("Profili");
        	FieldSet.appendSome(Legend.toString());

        	classTableHtmlObject ListaProfili = new classTableHtmlObject("100%");
        	ListaProfili.addAttribute ("class", "TableProfilo");
        	cRow = new classRowDataTable();


        	// ciclo i risultati per creare la riga dei profili con checkbox e descrizione

        	while (rsProfilo.next()){

        		CallableStatement stmGruppi = null;
        		ResultSet rsGruppi = null;

        		stmGruppi = fDB.getConnectWeb().prepareCall("SELECT WM_CONCAT(IDEN_ESA)RS FROM radsql.TAB_ESA_GRUPPI WHERE DESCR=? and REPARTO=?");
        		stmGruppi.setString(1, rsProfilo.getString("PROFILO"));
        		stmGruppi.setString(2, this.cParam.getParam("REPARTO").trim());

        		cCol = new classColDataTable("TD", "", "");

        		rsGruppi = stmGruppi.executeQuery();

        		if (rsGruppi.next()) {
        			classInputHtmlObject cInput = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,rsProfilo.getString("PROFILO"),rsGruppi.getString("RS")); 
        			cCol.appendSome(cInput.toString());
        		}

        		classInputHtmlObject cCheck = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX, "chkProfilo", "");
        		cCheck.addAttribute("profilo", fStr.valorizza_nullo(	rsProfilo.getString("PROFILO")));
        		cCheck.addAttribute("id", rsProfilo.getString("COD_GRUPPO"));
        		cCheck.addAttribute("urgenza", rsProfilo.getString("URGENZA"));
        		cCheck.addEvent("onClick", "javascript:scegliProfilo(this.profilo)");
        		cLabel = new classLabelHtmlObject(rsProfilo.getString("PROFILO"));
        		cLabel.addAttribute("for",rsProfilo.getString("COD_GRUPPO"));
        		cLabel.addAttribute("id", "labelProfilo");
        		cCol.appendSome(cCheck.toString());
        		cCol.appendSome(cLabel.toString());
        		cRow.addCol(cCol);

        		fDB.close(rsGruppi);

        	}

        	ListaProfili.appendSome (cRow.toString());
        	cDivListaProfili.appendSome (ListaProfili.toString());
        	FieldSet.appendSome(cDivListaProfili.toString());
        	cBody.addElement(FieldSet.toString());


        	fDB.close(rsProfilo);

        	// creo la sezione egli esami

        	classFieldsetHtmlObject FieldSetEsami = new classFieldsetHtmlObject();
        	FieldSetEsami.addAttribute("id", "RiquadroEsami");
        	classLegendHtmlObject LegendEsami = new classLegendHtmlObject ("Esami");
        	FieldSetEsami.appendSome(LegendEsami.toString());
        	classDivHtmlObject Esami = new classDivHtmlObject ();
        	classTableHtmlObject ListaEsami = new classTableHtmlObject();
        	String tappoProv = new String("");

        	int cont = 0;

        	// IDEN - DESCR - DESCSIRM - COD_DEC - COD_ESA - COD_MIN - METODICA - URGENZA - MDC - IDEN_SCHEDA - IDEN_TAPPO - DESCR_TAPPO - CLASSE_TAPPO - ORDINE_ESAME
        	while(rsEsami.next())
        	{
        		if(!tappoProv.equals(rsEsami.getString("COL11")))
        		{
        			if(!tappoProv.equals("")) { 

        				for(int idx = cont; idx <=4; idx++)              		
        					cRow.addCol(new classColDataTable("TD","","&nbsp;"));

        				ListaEsami.appendSome (cRow.toString());
        				Esami.appendSome (ListaEsami.toString());
        				cDivListaEsami.appendSome (Esami.toString());
        				cont = 0;
        			}

        			Esami = new classDivHtmlObject (rsEsami.getString("COL12"));
        			Esami.addAttribute ("class", rsEsami.getString("COL13"));
        			ListaEsami = new classTableHtmlObject();

        			cRow 		= new classRowDataTable();
        			tappoProv = rsEsami.getString("COL11");

        			cCol= new classColDataTable("TH","",rsEsami.getString("COL12"));
        			cCol.addAttribute ("rowspan","100");
        			cCol.addAttribute ("tappo", rsEsami.getString("COL11"));
        			cCol.addEvent("onClick", "javascript:selezioneProvetta(this.tappo)");
        			cRow.addCol(cCol);
        			cont=1;    // riporto il contatore a '1' evitando così la colonna del tappo (che è l'header posizionato a sinistra)

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
        			cCheck.addAttribute ("id",rsEsami.getString("COL01"));
        			cCheck.addAttribute ("descr",rsEsami.getString("COL02"));
        			cCheck.addAttribute ("tappo", rsEsami.getString("COL11"));
        			cCheck.addAttribute ("urgenza", rsEsami.getString("COL08"));
        			cLabel = new classLabelHtmlObject(rsEsami.getString("COL02"));
        			cLabel.addAttribute("for",rsEsami.getString("COL01"));
        			cCol.appendSome(cCheck.toString());
        			cCol.appendSome(cLabel.toString());
        			cRow.addCol(cCol);             
        		}

        		cont++;
        	}

        	rsEsami.close();
        	sff.close();

        	for(int idx = cont - 1; idx <=4; idx++)
        		cRow.addCol(new classColDataTable("TD","","&nbsp;"));



        	ListaEsami.appendSome (cRow.toString());
        	Esami.appendSome (ListaEsami.toString());
        	cDivListaEsami.appendSome(Esami.toString());
        	FieldSetEsami.appendSome(cDivListaEsami.toString());

        	cBody.addElement(FieldSetEsami.toString());
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
