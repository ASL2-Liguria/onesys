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

package richieste.sceltaEsamiMedNucLaboSV;

import core.Global;
import imago.http.baseClass.baseUser;
import imago.http.*;
import imago.sql.SqlQueryException;
import imagoAldoUtil.classTabExtFiles;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
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

public class sceltaMedNucLaboSVEngine extends functionObj {
	
	private functionDB fDB = null;
	private baseUser logged_user = null;
	private String Sito = new String("");

	public sceltaMedNucLaboSVEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) {

		super(cont, req, sess);
		fDB = new functionDB(this);
		this.logged_user = Global.getUser(sess);
		/* potrebbe non funzionare */
	}

	public sceltaMedNucLaboSVEngine(ServletContext cont, HttpServletRequest req) {

		this(cont, req, req.getSession(false));

	}
	
	public sceltaMedNucLaboSVEngine() {

	}

	public String gestione() {

		Document vDoc = new Document();
		vDoc.setDoctype(new Doctype.Html401Transitional());
		Body vBody = new Body();
        String sOut = new String("");
		
        vBody.addElement(getHeadDocument(vBody, vDoc));

		classTabHeaderFooter HeadSection2 = new classTabHeaderFooter("Esami Laboratorio Medicina Nucleare");
		vBody.addElement(HeadSection2.toString());
		
		vBody.addElement(getIntestEsami(Sito));
        vBody.addElement(getBodyEsami(Sito));
        vBody.addElement(getFooterSection());
        vDoc.setBody(vBody);
		sOut = vDoc.toString();
		
		return sOut;
		
	}
	
	private String getHeadDocument(Body cBody, Document cDoc){
		
		classDivHtmlObject cDivListaProfili = new classDivHtmlObject("ListaProfili");
		cBody.addAttribute("onLoad", "javascript:ricordaEsami();");
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		CallableStatement stmSito = null;
		CallableStatement stmProfili = null;
		ResultSet rsSito = null;
        ResultSet Profili = null;
        String sOut = new String("");
        plgBTMetodiche plsProfili = new plgBTMetodiche();
        String variabile = new String("");
        int cont=0;
        String rigaPuls = new String("");
        

		try {

			stmSito=fDB.getConnectWeb().prepareCall("select imagoweb.pck_configurazioni.getValueGlobal('SITO') SITO from dual");
			rsSito = stmSito.executeQuery();
			
			while (rsSito.next()){
				
				Sito = chkNull(rsSito.getString("SITO"));
				
			}
			
			
			
			// head
			classHeadHtmlObject cHead = new classHeadHtmlObject();
			cHead.addElement(classTabExtFiles.getIncludeString( this.logged_user, "", "DEFAULT_CSS", this.sContxt));
			cHead.addElement(classTabExtFiles.getIncludeString( this.logged_user, "", "ESAMI_MEDNUCRIA_SV", this.sContxt));
			cDoc.appendHead(cHead);

			//PROFILI /////////////////////////
	        stmProfili = fDB.getConnectWeb().prepareCall("select distinct DESCR PROFILO, cod_gruppo from radsql.TAB_ESA_GRUPPI where sito = 'MNU-VITRO-NOTE' and REPARTO =? order by descr");
			stmProfili.setString(1, this.cParam.getParam("REPARTO").trim());
	        
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

			/*
			cCol = new classColDataTable("TD", "15%", "Profili Esami");
			cCol.addAttribute("id","lblProfilo");
			Riga.addCol(cCol);

			cCol = new classColDataTable("TD", "75%", "");
			classSelectHtmlObject SelProfili = new classSelectHtmlObject("SelProfili");
			SelProfili.addAttribute("id", "SelProfili");
			SelProfili.addAttribute("colSpan", "2");

			// parte aggiunta per inserire un campo vuoto nella select
			classOptionHtmlObject Opt = null;
			Opt = new classOptionHtmlObject("", "");
			SelProfili.addOption(Opt.toString());
			*/

			// ciclo i risultati per popolare la select


			cCol = new classColDataTable("TD", "100%", "");
			
	        classULHtmlObject _UL = new classULHtmlObject();
	        classLIHtmlObject _LI = null;

	        _UL.addAttribute("class", "pulsanteULCenter");
	        _UL.addAttribute("id", "elenco_profili");

			while (Profili.next()) {
				
				/*CallableStatement stmGruppi = null;
		        ResultSet rsGruppi = null;
				
				stmGruppi = fDB.getConnectWeb().prepareCall("SELECT cod_gruppo, gruppo profilo FROM RADSQL.TAB_ESA_GRUPPI WHERE DESCR=? and REPARTO=?");
				
				stmGruppi.setString(1, Profili.getString("PROFILO"));
				stmGruppi.setString(2, this.cParam.getParam("REPARTO"));
				
				rsGruppi = stmGruppi.executeQuery();*/
				
				//Opt = new classOptionHtmlObject(Profili.getString("COD_GRUPPO"), Profili.getString("PROFILO"));
				
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

				/*
				
				while (rsGruppi.next()) {

					Opt.addAttribute("iden_esami", rsGruppi.getString("RS"));

				}
				
				Opt.addAttribute("id", "optProfilo");
				Opt.addAttribute("profilo", Profili.getString("PROFILO"));
				SelProfili.addOption(Opt.toString());
				
				fDB.close(rsGruppi);
				
				*/
			}
			
			
			_UL.appendSome(rigaPuls);
			cCol.appendSome(_UL.toString());
			Riga.addCol(cCol);
			ListaProfili.appendSome(Riga.toString());

			fDB.close(Profili);
/*
			SelProfili.addEvent("onchange","javascript:scegliProfilo(this.options[this.selectedIndex].value)");
			cCol.appendSome(SelProfili.toString());
			Riga.addCol(cCol);
			ListaProfili.appendSome(Riga.toString());

			// Se si vuole aggiungere il capo ricerca decommentare la parte di
			// codice seguente. Da implementare, ricerca non ancora gestita
			
		/*	Riga = new classRowDataTable();
			
			cCol = new classColDataTable("TD", "25%", "Ricerca");
			cCol.addAttribute("id","lblRicerca");
			Riga.addCol(cCol);
				  
			cCol = new classColDataTable("TD", "75%", "");
			classInputHtmlObject testoRicerca = new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT,"txtRic","", "100");
			testoRicerca.addAttribute("id","txtRic");
			cCol.appendSome(testoRicerca.toString());
			Riga.addCol(cCol);
			ListaProfili.appendSome(Riga.toString());
			
			Riga = new classRowDataTable();
			 cCol = new classColDataTable("TD", "25%", "Numero esami selezionati");
			 cCol.addAttribute("id","lblEsamiSelezionati");
			 Riga.addCol(cCol);
			cCol = new classColDataTable("TD", "75%", "");
			classInputHtmlObject EsamiSelezionati = new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT, "txtEsamiSelezionati","");
			EsamiSelezionati.addAttribute("id", "txtEsamiSelezionati");
			EsamiSelezionati.addAttribute("class", "testoEsami");
			EsamiSelezionati.setReadOnly(true);
			cCol.addAttribute("colspan", "2");
			cCol.appendSome(EsamiSelezionati.toString());
			Riga.addCol(cCol);

			// appendo la tabella dei profili al div e il div al body

			ListaProfili.appendSome(Riga.toString());
			
		*/	
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
	
	private String  getIntestEsami(String vSito){
		

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
		
		if (!vSito.equals("") || !vSito.equals(null)){
			
			/*cCol = new classColDataTable("TH", "", "IMPEGNATIVA"); 
			
			cCol.addAttribute("class", "intTempi");
			cRow.addCol(cCol);
			*/
		/*	cCol = new classColDataTable("TH", "", "ORARIO"); 
			
			cCol.addAttribute("class", "intTempi");
			cRow.addCol(cCol);*/
			
			cCol = new classColDataTable("TH", "", "INFO ESAME"); 
			
			cCol.addAttribute("class", "intTempi");
			cRow.addCol(cCol);
		}

		ListaEsamiInt.appendSome(cRow.toString());
		ListaEsamiInt.appendSome("</thead>");
		sOut=ListaEsamiInt.toString();

		return sOut;
	}

	private String getBodyEsami(String vSito) {
		
		CallableStatement stmEsami = null;
	    ResultSet rsSito = null;
	    ResultSet rsEsami = null;
		classDivHtmlObject cDivListaEsami = new classDivHtmlObject("ListaEsami");
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
        int cont = 0;
        String vOut = new String("");

		try{
			String where = new String();
            String reparto =  hRequest.getParameter("REPARTODESTINATARIO");
            String struttura;
            //la gestione della struttura è rimandata nel file js mednuc_vitro.js
            if(hRequest.getParameter("STRUTTURA")!= ""){
                struttura = "= '" + hRequest.getParameter("STRUTTURA")+"'";
            }else{
                struttura = "is null";
            }

			classTableHtmlObject ListaEsami = new classTableHtmlObject("100%","", "sceltaEsami");
			ListaEsami.addAttribute("class", "classDataTableMednuc");
			ListaEsami.appendSome("<tbody>");
			
			//ESAMI //////////////////////////	

            String query = "  SELECT" +
                    "    E.IDEN," +
                    "    E.DESCR," +
                    "    e.cod_esa," +
                    "    E.COD_MIN," +
                    "    ter.reparto_destinazione," +
                    "    ter.reparto_sorgente," +
                    "    ter.tipo," +
                    "    ter.struttura_richiedente" +
                    "  FROM" +
                    "    radsql.tab_esa e" +
                    "  JOIN radsql.tab_esa_reparto ter" +
                    "  ON" +
                    "    ter.iden_esa = e.iden" +
                    "  WHERE" +
                    "   ter.REPARTO_DESTINAZIONE = '"+reparto+"'" +
                    "  AND  TER.STRUTTURA_RICHIEDENTE "+struttura+"" +
                    "  AND  E.ATTIVO     = 'S'" +
                    "  AND ter.tipo = 'L'" +
                    "  AND ter.attivo = 'S'" +
                    "  ORDER BY" +
                    "    E.DESCR ASC";

            stmEsami = fDB.getConnectWeb().prepareCall(query);

	        rsEsami = stmEsami.executeQuery();


			while (rsEsami.next()) {
				
				cont++;

				cRow = new classRowDataTable();
				cRow.addAttribute("id", "tr"+cont);

				cCol = new classColDataTable("TD", "", "");
				classInputHtmlObject cCheck = new classInputHtmlObject(
						classTypeInputHtmlObject.typeCHECKBOX, "chkEsami", "");
				cCheck.addAttribute("id", rsEsami.getString("IDEN"));
				cRow.addAttribute("id_esame",rsEsami.getString("IDEN"));
				cCheck.addAttribute("descr", rsEsami.getString("DESCR"));
				cCheck.addAttribute("cod_esa", rsEsami.getString("COD_ESA"));
				cCheck.addAttribute("rownumber", String.valueOf(cont) );
				cCheck.addEvent("onClick", "javascript: valorizzaCampo(this);");
				cCol.addAttribute("class", "tdCheck");
				cCol.appendSome(cCheck.toString());
				cRow.addCol(cCol);

				cCol = new classColDataTable("TD", "", rsEsami.getString("COD_ESA"));
				cCol.addAttribute("class", "tdCodEsa");
				cRow.addCol(cCol);

				cCol = new classColDataTable("TD", "", rsEsami.getString("DESCR"));
				cCol.addAttribute("class", "tdDescr");
				cRow.addCol(cCol);

				cCol = new classColDataTable("TD", "", rsEsami.getString("COD_MIN"));
				cCol.addAttribute("class", "tdCod");
				cRow.addCol(cCol);
				
				if (!vSito.equals("") || !vSito.equals(null)){
					
				/*	
					cCol = new classColDataTable("TD", "", ""); 
					cCol.addAttribute("class", "tdTempi");
					classInputHtmlObject inputImp = new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT, "txtImpegnativa"+cont,"");
					inputImp.addAttribute("class", "tempi");
					cCol.appendSome(inputImp);
					cRow.addCol(cCol);
				 */
				/*	cCol = new classColDataTable("TD", "", ""); 
					cCol.addAttribute("class", "tdTempi");
					classInputHtmlObject inputEsenzione = new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT, "txtOrario"+cont,"");
					inputEsenzione.addAttribute("class", "tempi");
					cCol.appendSome(inputEsenzione);
					cRow.addCol(cCol);
				*/
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

			fDB.close(rsEsami);

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
	
	public String scegliProfilo(String idenEsaProfilo){
		
		return null;
		
	}
	
	private int rimanda(int Prova){
		
		int Puzzetta = Prova;
		return Puzzetta;
		
	}

	private String chkNull(String input) {
		if (input == null)
			return "";
		else
			return input;
	}

}