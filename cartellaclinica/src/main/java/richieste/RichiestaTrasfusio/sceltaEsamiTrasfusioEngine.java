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
Autore: alessandroa
 */

package richieste.RichiestaTrasfusio;

import generic.statements.StatementFromFile;
import imago.http.classColDataTable;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFieldsetHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classLegendHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTabHeaderFooter;
import imago.http.classTableHtmlObject;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;
import imagoAldoUtil.classTabExtFiles;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;

public class sceltaEsamiTrasfusioEngine extends functionObj {
	
	private functionDB fDB 					= null;
	private baseUser logged_user 			= null;
	private String urgenza					= new String("");
	private String tipo						= new String("");
	private String metodica_trasfusio		= new String("");
	private String reparto_sorgente			= new String("");
	private String reparto_destinatario		= new String("");
	private functionStr	function_string		= new functionStr();

	public sceltaEsamiTrasfusioEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
		this.logged_user = Global.getUser(sess);

	}

	public sceltaEsamiTrasfusioEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		
        String sOut 							= new String("");
        Document cDoc 							= new Document();
        Body cBody 								= new Body();
        
        classRowDataTable cRow 					= null;
        classColDataTable cCol 					= null;
        classLabelHtmlObject cLabel 			= null;
        
        StatementFromFile sff 					= null;
        StatementFromFile sff_profili			= null;
        StatementFromFile sff_profili_dettaglio	= null;
        
        readDati();
        
        classDivHtmlObject cDivListaEsami 	= new classDivHtmlObject("ListaEsami");
        classDivHtmlObject cDivListaProfili = new classDivHtmlObject("DivProfili");
        
		classTabHeaderFooter HeadSection;
		
		try {

			classHeadHtmlObject cHead = new classHeadHtmlObject();

			cHead.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", "DEFAULT_CSS", this.sContxt));
			cHead.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", "SCELTA_ESAMI_TRASFUSIO", this.sContxt));
			cDoc.appendHead(cHead);

			// INIZIO SEZIONE PROFILI
			classFieldsetHtmlObject FieldSet 	= new classFieldsetHtmlObject();
			classLegendHtmlObject Legend 		= new classLegendHtmlObject ("Profili");
			classTableHtmlObject ListaProfili 	= new classTableHtmlObject("100%");
			
			FieldSet.addAttribute("id", "RiquadroProfili");			
			FieldSet.appendSome(Legend.toString());			
			ListaProfili.addAttribute ("class", "TableProfilo");

			cRow = new classRowDataTable();
			
			sff_profili 			= new StatementFromFile(hSessione);   	  	
			ResultSet rs_profili 	= sff_profili.executeQuery("OE_Trasfusionale.xml", "getProfili", new String[]{this.reparto_destinatario, this.reparto_sorgente, this.urgenza});

			while (rs_profili.next()){

				sff_profili_dettaglio 			= new StatementFromFile(hSessione);
				ResultSet rs_profili_dettaglio = sff_profili_dettaglio.executeQuery("OE_Trasfusionale.xml", "getProfiliDettaglio", new String[]{rs_profili.getString("PROFILO"), this.reparto_destinatario});

				cCol = new classColDataTable("TD", "", "");

				// ADD PROFILO
				if (rs_profili_dettaglio.next()) {      	  
					classInputHtmlObject cInput = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,rs_profili.getString("PROFILO"),rs_profili_dettaglio.getString("RS")); 
					cCol.appendSome(cInput.toString());            
				}

				classInputHtmlObject cCheck = new classInputHtmlObject(classTypeInputHtmlObject.typeCHECKBOX, "chkProfilo", "");
				cCheck.addAttribute("profilo", rs_profili.getString("PROFILO"));
				cCheck.addAttribute("id", rs_profili.getString("COD_GRUPPO"));
				cCheck.addAttribute("urgenza", rs_profili.getString("URGENZA"));
				cCheck.addEvent("onClick", "javascript:scegliProfilo(this.profilo)");

				cLabel = new classLabelHtmlObject(rs_profili.getString("PROFILO"));
				cLabel.addAttribute("for",rs_profili.getString("COD_GRUPPO"));
				cLabel.addAttribute("id", "labelProfilo");
				cCol.appendSome(cCheck.toString());
				cCol.appendSome(cLabel.toString());
				cRow.addCol(cCol);

				sff_profili_dettaglio.close();
				rs_profili_dettaglio.close();

			}

			ListaProfili.appendSome (cRow.toString());
			cDivListaProfili.appendSome (ListaProfili.toString());
			FieldSet.appendSome(cDivListaProfili.toString());
			cBody.addElement(FieldSet.toString());

			rs_profili.close();
			sff_profili.close();
			
			// FINE SEZIONE PROFILI

			// INIZIO SEZIONE ESAMI
			
			classFieldsetHtmlObject FieldSetEsami 	= new classFieldsetHtmlObject();
			classDivHtmlObject Esami 				= new classDivHtmlObject ();
			classTableHtmlObject ListaEsami 		= new classTableHtmlObject();
			classLegendHtmlObject LegendEsami 		= new classLegendHtmlObject ("Esami");
			String tappoProv 						= new String("");
			
			FieldSetEsami.addAttribute("id", "RiquadroEsami");			
			FieldSetEsami.appendSome(LegendEsami.toString());
			
			sff 				= new StatementFromFile(hSessione);
			ResultSet rs_esami 	= sff.executeQuery("OE_Richiesta.xml", "getEsamiRichiedibili", new String[]{this.reparto_destinatario, this.reparto_sorgente, this.tipo, this.urgenza, this.metodica_trasfusio});

			int cont = 0;

			// IDEN - DESCR - DESCSIRM - COD_DEC - COD_ESA - COD_MIN - METODICA - URGENZA - MDC - IDEN_SCHEDA - IDEN_TAPPO - DESCR_TAPPO - CLASSE_TAPPO - ORDINE_ESAME - FUNICOLO
			while(rs_esami.next())
			{
				if(!tappoProv.equals(rs_esami.getString("COL11")))			
				{
					if(!tappoProv.equals("")) { 									// se tappoProv é uguale ad una stringa vuota (primo giro del ciclo)

						for(int idx = cont; idx <=4; idx++)
							cRow.addCol(new classColDataTable("TD","","&nbsp;"));	// definisco la colonna contenitrice degli esami

						ListaEsami.appendSome (cRow.toString());					// appendo la colonna alla tabella
						Esami.appendSome (ListaEsami.toString());					// appendo la tabella al DIV
						cDivListaEsami.appendSome (Esami.toString());
						cont = 0;
					}

					Esami = new classDivHtmlObject (rs_esami.getString("COL12"));
					Esami.addAttribute ("class", rs_esami.getString("COL13"));
					ListaEsami = new classTableHtmlObject();



					cRow = new classRowDataTable();

					tappoProv = rs_esami.getString("COL11");					//valorizzo tappoProv con l'iden del Tappo

					cCol= new classColDataTable("TH","",rs_esami.getString("COL12"));
					cCol.addAttribute ("rowspan","100");
					cCol.addAttribute ("IDEN_PROVETTA", rs_esami.getString("COL11"));
					cCol.addEvent("onClick", "javascript:selezioneProvetta(this.IDEN_PROVETTA)");
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
					cCheck.addAttribute ("id",rs_esami.getString("COL01"));
					cCheck.addAttribute ("descr_esa",rs_esami.getString("COL02"));
					cCheck.addAttribute ("tappo", rs_esami.getString("COL11"));
					cCheck.addAttribute ("urgenza", rs_esami.getString("COL08"));
					cCheck.addAttribute("funicolo", rs_esami.getString("COL16"));
					cLabel = new classLabelHtmlObject(rs_esami.getString("COL02"));
					cLabel.addAttribute("for",rs_esami.getString("COL01"));
					cCol.appendSome(cCheck.toString());
					cCol.appendSome(cLabel.toString());
					cRow.addCol(cCol);


				}

				cont++;
			}

			for(int idx = cont - 1; idx <=4; idx++)
				cRow.addCol(new classColDataTable("TD","","&nbsp;"));

			fDB.close(rs_esami);

			ListaEsami.appendSome (cRow.toString());
			Esami.appendSome (ListaEsami.toString());
			cDivListaEsami.appendSome(Esami.toString());
			FieldSetEsami.appendSome(cDivListaEsami.toString());

			cBody.addElement(FieldSetEsami.toString());

			//    	Footer
			HeadSection = new classTabHeaderFooter("&nbsp;");
			HeadSection.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
			HeadSection.addColumn("classButtonHeader", new classDivButton("Deselez. tutto", "pulsante", "javascript:DeselezionaTutto();", "G", "").toString());
			HeadSection.addColumn("classButtonHeader", new classDivButton("Continua", "pulsante", "javascript:arrayEsami();", "F", "").toString());
			HeadSection.addColumn("classButtonHeader", new classDivButton("Annulla", "pulsante", "javascript:self.close();", "A", "").toString());
			cBody.addElement(HeadSection.toString());

			cDoc.setBody(cBody);
			sOut = cDoc.toString();


		}
        catch (SqlQueryException ex) {
          sOut = ex.getMessage();
        }
        catch (SQLException ex) {
          sOut = ex.getMessage();
        } catch (Exception ex) {
        	sOut = ex.getMessage();
		}finally{
        	if(sff != null)
        		sff.close();
        	sff = null;
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
	
	private void readDati() {

		this.tipo 					= hRequest.getParameter("TIPO");
		this.reparto_sorgente		= hRequest.getParameter("REPARTO_RICHIEDENTE");		
		this.reparto_destinatario 	= hRequest.getParameter("CDC_DESTINATARIO");     
		this.urgenza 				= hRequest.getParameter("URGENZA") != "" ? hRequest.getParameter("URGENZA") : "0" ;
		this.metodica_trasfusio		= hRequest.getParameter("METODICA");
						
	}
}
