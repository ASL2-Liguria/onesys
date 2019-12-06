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

package richieste.sceltaEsamiMedNucLabo;

import core.Global;
import generic.statements.StatementFromFile;
import imago.http.baseClass.baseUser;
import imago.http.*;
import imago.sql.SqlQueryException;
import imagoAldoUtil.classTabExtFiles;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class sceltaMedNucLaboEngine extends functionObj {
	
	private functionDB fDB = null;
	private baseUser logged_user = null;

	public sceltaMedNucLaboEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) {

		super(cont, req, sess);
		fDB = new functionDB(this);
		this.logged_user = Global.getUser(sess);
	}

	public sceltaMedNucLaboEngine(ServletContext cont, HttpServletRequest req) {

		this(cont, req, req.getSession(false));

	}

	public String gestione() throws Exception {

		String sOut = new String("");

		Document cDoc = new Document();
		cDoc.setDoctype(new Doctype.Html401Transitional());
		Body cBody = new Body();
		classDivHtmlObject cDivListaEsami = new classDivHtmlObject("ListaEsami");
		classDivHtmlObject cDivListaProfili = new classDivHtmlObject("ListaProfili");
		cBody.addAttribute("onLoad", "javascript:ricordaEsami();");
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		CallableStatement stmProfili = null;
        CallableStatement stmEsami = null;
        ResultSet rsEsami = null;
        ResultSet Profili = null;

		try {

			// head
			classHeadHtmlObject cHead = new classHeadHtmlObject();
			cHead.addElement(classTabExtFiles.getIncludeString( this.logged_user, "", "DEFAULT_CSS", this.sContxt));
			cHead.addElement(classTabExtFiles.getIncludeString( this.logged_user, "", "ESAMI_MEDNUCRIA", this.sContxt));
			cDoc.appendHead(cHead);

			//PROFILI /////////////////////////
	        stmProfili = fDB.getConnectWeb().prepareCall("select distinct DESCR PROFILO, cod_gruppo from radsql.TAB_ESA_GRUPPI where sito = 'MNU-VITRO' and REPARTO =? order by descr");
			stmProfili.setString(1, this.cParam.getParam("REPARTO").trim());
	        
	        Profili = stmProfili.executeQuery();

			// creo la sezione della scelta profilo

			classTabHeaderFooter HeadSection = new classTabHeaderFooter("Profili Laboratorio Medicina Nucleare");
			cDivListaProfili.appendSome(HeadSection.toString());

			classTableHtmlObject ListaProfili = new classTableHtmlObject("100%", "", "sceltaProfili");
			ListaProfili.addAttribute("class", "classDataTableMednuc");

			classRowDataTable Riga = new classRowDataTable();

			cCol = new classColDataTable("TH", "50%", "PROFILO ESAMI");
			Riga.addCol(cCol);

			cCol = new classColDataTable("TD", "50%", "");
			classSelectHtmlObject SelProfili = new classSelectHtmlObject("SelProfili");
			SelProfili.addAttribute("id", "SelProfili");

			// parte aggiunta per inserire un campo vuoto nella select
			classOptionHtmlObject Opt = null;
			Opt = new classOptionHtmlObject("", "");
			SelProfili.addOption(Opt.toString());

			// ciclo i risultati per popolare la select

			while (Profili.next()) {
				
				CallableStatement stmGruppi = null;
		        ResultSet rsGruppi = null;
				
				stmGruppi = fDB.getConnectWeb().prepareCall("SELECT WM_CONCAT(IDEN_ESA)RS FROM RADSQL.TAB_ESA_GRUPPI WHERE DESCR=? and REPARTO=?");
				
				stmGruppi.setString(1, Profili.getString("PROFILO"));
				stmGruppi.setString(2, this.cParam.getParam("REPARTO"));
				
				rsGruppi = stmGruppi.executeQuery();
				
				Opt = new classOptionHtmlObject(Profili.getString("COD_GRUPPO"), Profili.getString("PROFILO"));

				while (rsGruppi.next()) {

					Opt.addAttribute("iden_esami", rsGruppi.getString("RS"));

				}

				Opt.addAttribute("id", "optProfilo");
				Opt.addAttribute("profilo", Profili.getString("PROFILO"));
				SelProfili.addOption(Opt.toString());
				fDB.close(rsGruppi);
			}

			fDB.close(Profili);

			SelProfili.addEvent("onchange","javascript:scegliProfilo(this.options[this.selectedIndex].iden_esami)");
			cCol.appendSome(SelProfili.toString());
			Riga.addCol(cCol);
			ListaProfili.appendSome(Riga.toString());

			// Se si vuole aggiungere il capo ricerca decommentare la parte di
			// codice seguente. Da implementare, ricerca non ancora gestita

			// cCol = new classColDataTable("TH", "25%", "Ricerca");
			// Riga.addCol(cCol);
			//	  
			// cCol = new classColDataTable("TD", "25%", "");
			// classInputHtmlObject testoRicerca = new
			// classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"txtRic",""
			// );
			// cCol.appendSome(testoRicerca.toString());
			// Riga.addCol(cCol);

			Riga = new classRowDataTable();
			// cCol = new classColDataTable("TH", "25%", "Esami selezionati");
			// Riga.addCol(cCol);
			cCol = new classColDataTable("TD", "100%", "");
			classInputHtmlObject EsamiSelezionati = new classInputHtmlObject(
					classTypeInputHtmlObject.typeTEXT, "txtEsamiSelezionati",
					"");
			EsamiSelezionati.addAttribute("id", "txtEsamiSelezionati");
			EsamiSelezionati.addAttribute("class", "testoEsami");
			EsamiSelezionati.setReadOnly(true);
			cCol.addAttribute("colspan", "2");
			cCol.appendSome(EsamiSelezionati.toString());
			Riga.addCol(cCol);

			// appendo la tabella dei profili al div e il div al body
			ListaProfili.appendSome(Riga.toString());
			cDivListaProfili.appendSome(ListaProfili.toString());
			cBody.addElement(cDivListaProfili.toString());

			// creo la sezione egli esami
			classTabHeaderFooter HeadSection2 = new classTabHeaderFooter("Esami Laboratorio Medicina Nucleare");
			cDivListaEsami.appendSome(HeadSection2.toString());

			classTableHtmlObject ListaEsami = new classTableHtmlObject("100%","", "sceltaEsami");
			ListaEsami.addAttribute("class", "classDataTableMednuc");
			ListaEsami.appendSome("<thead>");

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

			ListaEsami.appendSome(cRow.toString());
			ListaEsami.appendSome("</thead>");
			
            String reparto_destinazione =  hRequest.getParameter("REPARTODESTINATARIO");
            String reparto_sorgente 	=  hRequest.getParameter("REPARTO");
            String tipo 				=  hRequest.getParameter("TIPO");
            String urgenza 				=  hRequest.getParameter("URGENZA") != "" ? hRequest.getParameter("URGENZA") : "0" ;

            //ESAMI //////////////////////////			
			StatementFromFile sff = new StatementFromFile(this.hSessione);
	        ResultSet rs = sff.executeQuery("OE_Richiesta.xml","getEsamiRichiedibili", new String[]{reparto_destinazione, reparto_sorgente, tipo, urgenza});

	        // Ordine Posionione Campio WK_RESULT : IDEN - DESCR - DESCSIRM - COD_DEC - COD_ESA - COD_MIN - METODICA - URGENZA - MDC
			while (rs.next()) {

				cRow = new classRowDataTable();

				cCol = new classColDataTable("TD", "", "");
				classInputHtmlObject cCheck = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX, "chkEsami", "");
				cCheck.addAttribute("id", rs.getString("COL01"));
				cCheck.addAttribute("descr", rs.getString("COL02"));
				cCheck.addAttribute("cod_esa", rs.getString("COL05"));
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

				ListaEsami.appendSome(cRow.toString());

			}

			rs.close();
			sff.close();

			// appendo il div della lista esami al body
			cDivListaEsami.appendSome(ListaEsami.toString());

			// Inserisco il footer con i tre pulsanti
			HeadSection = new classTabHeaderFooter("&nbsp");
			HeadSection.setClasses("classTabHeader", "classTabFooterSx","classTabHeaderMiddle", "classTabFooterDx");
			HeadSection.addColumn("classButtonHeader", new classDivButton("Deselez. tutto", "pulsante","javascript:DeselezionaTutto();", "G", "").toString());
			HeadSection.addColumn("classButtonHeader",
			new classDivButton("Continua", "pulsante","javascript:arrayEsami();", "F", "").toString());
			HeadSection.addColumn("classButtonHeader", new classDivButton("Annulla", "pulsante", "javascript:self.close();", "A", "").toString());

			cDivListaEsami.appendSome(HeadSection.toString());

			cBody.addElement(cDivListaEsami.toString());
			cDoc.setBody(cBody);
			sOut = cDoc.toString();

		} catch (SqlQueryException ex) {
			sOut = ex.getMessage();
		} catch (SQLException ex) {
			sOut = ex.getMessage();
		}

		return sOut;
	}

	@SuppressWarnings("unused")
	private String chkNull(String input) {
		if (input == null)
			return "";
		else
			return input;
	}

}