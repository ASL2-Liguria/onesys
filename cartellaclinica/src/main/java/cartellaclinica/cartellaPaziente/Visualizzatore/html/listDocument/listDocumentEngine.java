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
 /*
 File: consultazioneCalendarioGes.java
 Autore: Jack
 */
package cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocument;

import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classIFrameHtmlObject;
import imago.http.classImgHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTabHeaderFooter;
import imago.http.classTableHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import plugin.getPoolConnection;

public class listDocumentEngine extends functionObj {

	private String idPaziente = new String("");

	private String nosologico = new String("");

	private String reparto = new String("");

	private String indiceColonna = new String("");

	private String sortType = new String("");

	private String daData = new String("");

	private String aData = new String("");

	private String sqlWhere = new String("");

	private String cognome = new String("");

	private String nome = new String("");

	private String datanasc = new String("");

	private String sesso = new String("");

	private String idDocument = new String("");

	private String listDocument = new String("");

	private String[] arrayDocument;

	private String filtriAggiuntivi = new String("");

	private String filtroReparto = new String("");

	private String hDoc = new String("");

	private String filtroDoc = new String("");

	private String filtroTipoDocVal = new String("");

	private String traceUser = new String("");

	private String aperturaPacs = new String("");

	String URI;

	String uriSS;

	String MIMETYPE;

	String IDREFERTOLAB;

	String IDDOC;

	String idAccettazione;

	String elencoEsami;

	Connection conn;

	getPoolConnection myPoolConnection = null;

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(listDocumentEngine.class);

	private String valnosolRs = "";

	private String cognomeRs = new String("");

	private String nomeRs = new String("");

	private String datanascRs = new String("");

	private String titoloAnag = new String("");

	private String patientIdWhere = null;

	private functionDB fDB = null;

	ServletContext cContext;

	HttpServletRequest cRequest;

	HttpSession session = null;

	Hashtable<Integer, Hashtable> hashColonne = new Hashtable<Integer, Hashtable>();

	boolean boolIdentifEst = false;

	int cont1;

	String select_query = "Select ";

	/**
	 * Contiene i parametri di configurazione provenienti da applicativo
	 * intestazione ordine larghezza in % metodo da chiamare per reperire il
	 * dato parametri del metodo intervallati da §
	 */
	ArrayList<String> ArJoin;

	Hashtable<String, String> hashRequest = new Hashtable<String, String>();

	/**
	 * contiene i parametri generici dataIni dataFine URN documento DocStatus
	 * DocType User repartoProduttore riferito al documento repartoUtente per la
	 * configurazione
	 */
	Hashtable<String, String> hashMetadatiRichiesti = new Hashtable<String, String>();

	/**
	 * contiene le coppie name§value per filtrare i documenti
	 */
	public listDocumentEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) {

		super(cont, req, sess);
		fDB = new functionDB(this);
		cContext = cont;
		cRequest = req;
		session = sess;

	}

	public listDocumentEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));

	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();
		classFormHtmlObject cForm = null;
		classTabHeaderFooter HeadSection = null;
		classTableHtmlObject cTable = null;
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		classInputHtmlObject cInput = null;
		classIFrameHtmlObject cFrame = null;
		classDivHtmlObject cDiv = null;
		classDivHtmlObject cDivNull = null;
		classImgHtmlObject cImgAcr = null;
		classImgHtmlObject cImgDoc = null;
		classImgHtmlObject cImgAsc = null;
		classImgHtmlObject cImgDesc = null;
		ResultSet rs = null;
		ResultSet rs1 = null;

		String confReparto = cRequest.getParameter("confReparto");
		if (confReparto == null) {
			confReparto = "DEFAULT";
		}

		try {

			readDati();
			// checkFiltriDoc();

			cDoc.appendHead(this.createHead());

			cTable = new classTableHtmlObject();
			cTable.addAttribute("id", "tabella");
			// cTable.addAttribute("onMouseOut","javascript:tableOut();");

			cRow = new classRowDataTable();

			// mi carico le immagini che mi serviranno successivamente
			// cImgAcr = new
			// classImgHtmlObject("imagexPix/Visualizzatore/Acrobat.png","","",0,"25px","25px");
			// cImgDoc = new
			// classImgHtmlObject("imagexPix/Visualizzatore/Tabella.png","","",0,"25px","25px");
			// cImgDoc.addAttribute("title", "Visualizza Dati Strutturati");
			cImgAsc = new classImgHtmlObject("imagexPix/Visualizzatore/deselASC.png", "", 0);
			cImgDesc = new classImgHtmlObject("imagexPix/Visualizzatore/deselDESC.png", "", 0);

			HashMap<String, String> valori_campi;
			ArrayList<HashMap<String, String>> list_campi = new ArrayList<HashMap<String, String>>();

			String sql_campi = "select nomecampo,labelcampo,larghezza,ordine from tab_campi_wk where tipo_wk='VISUALIZZATORE_" + confReparto + "' AND obbligatorio='S' order by ordine";
			rs1 = this.fDB.openRsWeb(sql_campi);

			int cont = 0;
			// String select_query="Select ";
			String order_by = "";
			// creo l'intestazione della tabella

			// a inizio riga aggiungo due colonne contenenti icone
			// identificatrici della presenza documento e dati strutturati
			cCol = new classColDataTable("TH", "", "");
			cRow.addCol(cCol);
			/*
			 * cCol = new classColDataTable("TH","",""); cRow.addCol(cCol);
			 */

			while (rs1.next()) {

				// mi creo gia' la select della query sulla vista
				if (cont == 0) {
					select_query += rs1.getString("nomecampo");
					// la prima volta che viene caricata la worklist, senza aver
					// cliccato sugli ordinamenti delle colonne, faccio in modo
					// che ordini per la prima colonna
					// order_by=" order by " + rs1.getString("nomecampo") ;
					order_by = " order by substr(creationtime,7,4)||substr(creationtime,4,2)||substr(creationtime,1,2) ||  substr(creationtime,12,2) ||  substr(creationtime,15,2) ||  substr(creationtime,18,2) desc ";

				} else {
					select_query += "," + rs1.getString("nomecampo");
				}

				valori_campi = new HashMap<String, String>();
				valori_campi.put("nomecampo", rs1.getString("nomecampo"));
				valori_campi.put("larghezza", rs1.getString("larghezza"));
				valori_campi.put("ordine", rs1.getString("ordine"));

				if (indiceColonna.equals(rs1.getString("ordine"))) {

					if (rs1.getString("nomecampo").equalsIgnoreCase("CREATIONTIME")) {
						order_by = " order by substr(creationtime,7,4)||substr(creationtime,4,2)||substr(creationtime,1,2) ||  substr(creationtime,12,2) ||  substr(creationtime,15,2) ||  substr(creationtime,18,2) " + sortType;
					} else {
						order_by = " order by " + rs1.getString("nomecampo") + " " + sortType;
					}

				}

				list_campi.add(cont, valori_campi);
				cont += 1;

				cCol = new classColDataTable("TH", rs1.getString("larghezza"), "");

				cImgAsc.addEvent("onClick", "javascript:sort('" + rs1.getString("ordine") + "','ASC')");
				cCol.appendSome(cImgAsc);
				cImgDesc.addEvent("onClick", "javascript:sort('" + rs1.getString("ordine") + "','DESC')");
				cCol.appendSome(cImgDesc);

				cCol.appendSome(rs1.getString("labelcampo"));
				cRow.addCol(cCol);

			}

			cTable.appendSome("<thead>" + cRow.toString() + "</thead>");

			// --------------------------------------
			// mi carico le righe della tabella
			cDiv = new classDivHtmlObject("riq");

			// se mi e' stato passato l'identificativo paziente da whale..
			if (!this.idPaziente.equals("")) {
				getIdPatient(this.idPaziente);
			}

			sqlWhere = componiWhere();

			sql_campi = select_query + ", IDREFERTOLAB,URI, uriSS, MIMETYPE,TIPODOC,ID,ID_ESAME_DICOM from (" + sqlWhere + order_by;

			logInterface.info(sql_campi);

			String colorEven = "even";

			// rs= this.fDB.openRs(sql_campi);
			Statement stm = null;
			// conn= new Connessione().getConnection(cContext);
			myPoolConnection = new getPoolConnection(cContext.getInitParameter("RegistryPoolName"), cContext.getInitParameter("RegistryUser"), cContext.getInitParameter("RegistryPwd"), cContext.getInitParameter("CryptType"));
			conn = myPoolConnection.getConnection();
			stm = conn.prepareStatement("select", ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
			rs = stm.executeQuery(sql_campi);

			cont1 = 0;

			if (rs.next()) {

				String tBody = new String("<tbody>");
				/*
				 * cognomeRs = rs.getString("COGNOME"); nomeRs =
				 * rs.getString("NOME"); datanascRs =
				 * rs.getString("DATA_NASC").substring(6,
				 * 8)+'/'+rs.getString("DATA_NASC").substring(4,
				 * 6)+'/'+rs.getString("DATA_NASC").substring(0, 4);
				 */
				String patientIdOld = rs.getString("PATIENTID");
				URI = rs.getString("URI");
				uriSS = rs.getString("uriSS");
				MIMETYPE = rs.getString("MIMETYPE");
				IDREFERTOLAB = rs.getString("IDREFERTOLAB");
				IDDOC = rs.getString("ID");

				rs.beforeFirst();

				while (rs.next()) {

					cRow = new classRowDataTable();

					cRow.addAttribute("onMouseOver", "javascript:trHover(this,\"listDocument\");");
					cRow.addAttribute("onClick", "javascript:trClick(this,\"listDocument\");");
					// cRow.addAttribute("onDblClick","javascript:trDblClick(this);");
					cRow.addAttribute("onMouseOut", "javascript:tableOut(this,\"listDocument\");");
					cRow.addAttribute("uri", rs.getString("URI"));
					cRow.addAttribute("mimeType", rs.getString("MIMETYPE"));
					cRow.addAttribute("uriSS", chkNull(rs.getString("uriSS")));
					cRow.addAttribute("idDoc", chkNull(rs.getString("ID")));
					String[] patientIdSplit = (rs.getString("PATIENTID")).split("\\^");
					cRow.addAttribute("patientId", chkNull(patientIdSplit[0]));
					// cRow.addAttribute("patientId",chkNull(rs.getString("PatientIdExternal")));
					IDREFERTOLAB = rs.getString("IDREFERTOLAB");
					cRow.addAttribute("selected", "0");

					// idAccettazione=rs.getString("IDACCETTAZIONE");
					// elencoEsami=rs.getString("ELENCO_ESAMI");
					// ID_RICHIESTA_WHALE=rs.getString("ID_RICHIESTA_WHALE");
					// nel caso ce nella ricerca avanzata ci fossero piu'
					// pazienti con stesso nome cognome datanasc cambio il
					// colore del recor
					if (!rs.getString("PATIENTID").equals(patientIdOld)) {
						if (colorEven.equals("even")) {
							colorEven = "even2";
						} else {
							colorEven = "even";
						}
					}
					patientIdOld = rs.getString("PATIENTID");

					// a inizio riga aggiungo due colonne contenenti icone
					// identificatrici della presenza documento e dati
					// strutturati
					cCol = new classColDataTable("TD", "", "");
					// cCol.addAttribute("uri",rs.getString("URI"));
					// cCol.addAttribute("mimeType",rs.getString("MIMETYPE"));
					// cCol.addAttribute("uriSS",chkNull(rs.getString("uriSS")));
					// cCol.addAttribute("patientId",chkNull(rs.getString("PATIENTID")));
					// cCol.addAttribute("onClick","javascript:trDblClick(this.parentNode);");
					// cCol.addAttribute("style","CURSOR: hand; COLOR: blue; TEXT-DECORATION: underline");

					// cCol.appendSome(cImgAcr);
					classDivHtmlObject acrDiv = new classDivHtmlObject("", "", "&nbsp");
					acrDiv.addAttribute("class", "imageAcr");
					acrDiv.addAttribute("title", "Apri referto");
					acrDiv.addAttribute("onClick", "javascript:trDblClick(this.parentNode.parentNode);");
					cCol.appendSome(acrDiv.toString());

					if (aperturaPacs.equals("S") && !chkNull(rs.getString("ID_ESAME_DICOM")).equals("") && chkNull(rs.getString("TIPODOC")).equals("cc0001")) {
						classDivHtmlObject dicomDiv = new classDivHtmlObject("", "", "&nbsp");
						dicomDiv.addAttribute("class", "imagePacs");
						dicomDiv.addAttribute("title", "Apri immagini");
						dicomDiv.addAttribute("onClick", "javascript:getDatiPacs('" + rs.getString("ID_ESAME_DICOM") + "');");
						cCol.appendSome(dicomDiv.toString());
					}
					cRow.addCol(cCol);

					/*
					 * cCol = new classColDataTable("TD","","");
					 * 
					 * if (IDREFERTOLAB!=null ){
					 * 
					 * cCol.addAttribute("onClick", "javascript:refLab(this);");
					 * // cCol.addAttribute("style",
					 * "CURSOR: hand; COLOR: blue; TEXT-DECORATION: underline");
					 * cCol.addAttribute("IDREFERTO",IDREFERTOLAB);
					 * cCol.addAttribute("NOSOLOGICO",nosologico);
					 * cCol.addAttribute("DADATA",daData);
					 * cCol.addAttribute("ADATA",aData); //
					 * cCol.addAttribute("IDACCETTAZIONE"
					 * ,chkNull(idAccettazione));
					 * cCol.addAttribute("idDoc",chkNull(rs.getString("ID")));
					 * // cCol.addAttribute("ELENCOESAMI",chkNull(elencoEsami));
					 * // cCol.addAttribute("ID_RICHIESTA_WHALE",chkNull(
					 * ID_RICHIESTA_WHALE));
					 * 
					 * classDivHtmlObject labDiv = new
					 * classDivHtmlObject("","","&nbsp");
					 * labDiv.addAttribute("class", "imageLab");
					 * cCol.appendSome(labDiv.toString()); //
					 * cImg.addEvent("onClick"
					 * ,"javascript:sort('"+rs1.getString("ordine")+"','ASC')");
					 * // cCol.appendSome(cImgDoc); } cRow.addCol(cCol);
					 */
					for (HashMap<String, String> valori_riga : list_campi) {

						cCol = new classColDataTable("TD", (String) valori_riga.get("larghezza"), rs.getString((String) valori_riga.get("nomecampo")));
						cCol.addAttribute("class", colorEven);
						cCol.addAttribute("classStart", colorEven);

						// se e' un referto di laboratorio devo attivare il link
						// alla pagina degli esami di laboratorio altrimenti
						// l'onclick normale al pdf del documento
						if (IDREFERTOLAB != null && valori_riga.get("nomecampo").equals("DESCRIZIONE")) {

							// cCol.addAttribute("onClick",
							// "javascript:refLab(this);");
							// cCol.addAttribute("style","COLOR: blue; TEXT-DECORATION: underline");
							cCol.addAttribute("IDREFERTO", IDREFERTOLAB);

						}

						cRow.addCol(cCol);

					}

					tBody += cRow.toString();
					cont1 += 1;
					// System.out.println(cont1);
				}

				tBody += "</tbody>";
				cTable.appendSome(tBody);

				if (nosologico.equals("")) {
					// valnosolRs="non presente";
					valnosolRs = "";
				} else {
					valnosolRs = nosologico;
					// cDiv.appendSome("<h3>"+cognomeRs
					// +" "+nomeRs+" "+datanascRs+"   n°nosologico:"+valnosolRs+"</h3>");
				}

				// mi carico i dati anagrafici del paziente
				getDatiAnag(patientIdOld);

				if (!cognomeRs.equals("") && !nosologico.equals("")) {
					titoloAnag = cognomeRs + " " + nomeRs + " " + datanascRs + "   n°nosologico:" + valnosolRs;
				} else {
					titoloAnag = cognomeRs + " " + nomeRs + " " + datanascRs;
				}

			} else {
				if (nosologico.equals("")) {
					valnosolRs = "";
				} else {
					valnosolRs = nosologico;
				}

				getDatiAnagWhale(this.idPaziente);
				if (!cognomeRs.equals("") && !nosologico.equals("")) {
					titoloAnag = cognomeRs + " " + nomeRs + " " + datanascRs + "   n°nosologico:" + valnosolRs;
				} else if (!cognomeRs.equals("") && nosologico.equals("")) {
					titoloAnag = cognomeRs + " " + nomeRs + " " + datanascRs;
				} else {
					titoloAnag = "";
				}
			}

			if (cont1 == 0) {
				cDivNull = new classDivHtmlObject("divNull", "", "Nessun documento trovato");
				cDiv.appendSome(cDivNull.toString());
			} else {
				cDiv.appendSome(cTable.toString());
			}

			cBody.addElement(cDiv.toString());
			cBody.addElement("<script>\n espandiTabella(\"listDocument\"); \n</script>");

			// cBody.addElement("<script type='text/javascript'>$(document).ready(function(){$('#tabella').chromatable({width: \"100%\", height: \"500px\",	scrolling: \"yes\"});});</script>");
			// cBody.addElement("<SCRIPT>parent.aggiornaDivAnag(\""+cognomeRs
			// +" "+nomeRs+" "+ datanascRs
			// +"   n°nosologico:"+valnosolRs+"\")</SCRIPT>");
			cBody.addElement("<SCRIPT>parent.aggiornaDivAnag(\"" + titoloAnag + "\")</SCRIPT>");

			// se mi arrivata come parametro l' iddocument e solo uno (non di
			// piu'..) simulo il doppio click e apro direttamente il documento

			/*
			 * if (!idDocument.equals("")) if (arrayDocument.length==1){
			 * cBody.addElement
			 * ("<SCRIPT>parent.setSingleSrc(\""+MIMETYPE+"\",\""
			 * +URI+"\",\""+uriSS+"\")</SCRIPT>"); }
			 */
			// se la richiesta mi arriva con l'identificativo esterno e c'e'
			// legato un solo documento apro direttamente il pdf
			if (boolIdentifEst == true && cont1 == 1) {
				cBody.addElement("<SCRIPT>setSingleSrcAppoggio(\"" + MIMETYPE + "\",\"" + URI + "\",\"" + uriSS + "\",\"" + IDDOC + "\")</SCRIPT>");
			}

			cBody.addElement("<script>disabilitaTastoDx()</script>");
			// cBody.addElement("<script type='text/javascript'>$(document).ready(function(){$('#tabella').chromatable({width: \"100%\", height: \"500px\",	scrolling: \"yes\"});});</script>");

			cBody.addElement("<script type='text/javascript'>$(document).ready(function(){ top.$('div.velonero').remove();});</script>");

			cDoc.setBody(cBody);
			sOut = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" + cDoc.toString();

		} catch (Exception e) {
			sOut = e.getMessage();
			logInterface.error(e.getMessage(), e);

		} finally {
			try {
				fDB.close(rs);
				fDB.close(rs1);

				// new Connessione().chiudi(conn,cContext);
				myPoolConnection.chiudi(conn);
			} catch (SQLException e) {
				sOut = e.getMessage();
				logInterface.error(e.getMessage(), e);
			}

		}

		return sOut;
	}

	private classHeadHtmlObject createHead() throws SqlQueryException, SQLException, Exception {
		return HeaderUtils.createHeadWithIncludesNoDefault(this.getClass().getName(), hSessione);
	}

	private String chkNull(String input) {
		if (input == null) {
			return "";
		} else {
			return input;
		}
	}

	private void readDati() throws SQLException, SqlQueryException {

		this.idPaziente = this.cParam.getParam("idPatient").trim();
		this.nosologico = this.cParam.getParam("nosologico").trim();
		this.reparto = this.cParam.getParam("reparto").trim();
		this.indiceColonna = this.cParam.getParam("indiceColonna").trim();
		this.sortType = this.cParam.getParam("sortType").trim();
		this.cognome = this.cParam.getParam("cognome").trim();
		this.nome = this.cParam.getParam("nome").trim();
		this.datanasc = this.cParam.getParam("datanasc").trim();
		this.sesso = this.cParam.getParam("sesso").trim();
		this.daData = this.cParam.getParam("daData").trim();
		this.aData = this.cParam.getParam("aData").trim();
		this.idDocument = this.cParam.getParam("idDocument").trim();
		this.filtriAggiuntivi = this.cParam.getParam("filtriAggiuntivi").trim();
		this.hDoc = this.cParam.getParam("hDoc").trim();
		this.filtroDoc = this.cParam.getParam("filtroDoc").trim();
		this.filtroTipoDocVal = this.cParam.getParam("tipoDocVal").trim();
		this.traceUser = this.cParam.getParam("traceUser").trim();
		this.aperturaPacs = this.cParam.getParam("aperturaPacs").trim();

	}

	private String componiWhere() {
		String where = "";
		String queryOut = "";
		String sqlWhere2 = "";

		queryOut += select_query + ", IDREFERTOLAB,URI, uriSS, MIMETYPE, TIPODOC,ID,ID_ESAME_DICOM  from xdsregistry.view_documenti where ";

		/*
		 * if (!idDocument.equals("")){ arrayDocument = idDocument.split("@");
		 * 
		 * for (int i=0; i<arrayDocument.length; i++ ){
		 * 
		 * if (i==0) listDocument="'"+arrayDocument[i]+"'"; else
		 * listDocument+=",'"+arrayDocument[i]+"'"; }
		 * 
		 * where+= " id in ("+listDocument+") ";
		 * 
		 * }
		 */
		if (!nosologico.equals("")) {
			if (!where.equals("")) {
				where += " and ";
			}
			where += " id in (select parent from xdsregistry.slot where name='nosologico' and value='" + nosologico + "')";
		}

		if (!filtriAggiuntivi.equals("")) {
			if (!where.equals("")) {
				where += " and ";
			}
			String[] filtri = filtriAggiuntivi.split("§");
			String[] chiaveValore;
			for (int i = 0; i < filtri.length; i++) {
				chiaveValore = filtri[i].split("~");
				if (chiaveValore[0].equals("identificativoEsterno")) {
					boolIdentifEst = true;
				}
				if (i == 0) // where+=chiaveValore[0]+"='"+chiaveValore[1]+"' ";
				{
					where += "  id in(select distinct(parent) from xdsregistry.slot where name='" + chiaveValore[0] + "' and value in('" + chiaveValore[1] + "'))";
				} else // where+=" and " +
				// chiaveValore[0]+"='"+chiaveValore[1]+"' ";
				{
					where += " and  id in(select distinct(parent) from xdsregistry.slot where name='" + chiaveValore[0] + "' and value in('" + chiaveValore[1] + "'))";
				}
			}

		}

		// se non filtro ne per nosologico ne per richiesta filtro per idpatient
		// se c'e'
		if (where.equals("")) {

			// se mi e' stato passato l'identificativo paziente da whale...
			if (patientIdWhere != null) {
				if (!patientIdWhere.equals("")) {
					if (!where.equals("")) {
						where += " and ";
					}
					// where+=" PATIENTID='"+patientIdWhere+"'";
					where += " PATIENTID in (" + patientIdWhere + ") ";
					// where+=" PATIENTID='"+idPaziente+"'";
				} // se non e' stata trovata corrispondenza per quel paziente..
				else {
					if (!where.equals("")) {
						where += " and ";
					}
					where += " PATIENTID='0' ";

				}
			}
		}

		/*
		 * 
		 * if (!cognome.equals("")){ if (!where.equals("")) where+=" and ";
		 * where+=" COGNOME='"+apici(cognome)+"'"; } if (!nome.equals("")){ if
		 * (!where.equals("")) where+=" and "; where+=" NOME='"+apici(nome)+"'";
		 * } if (!datanasc.equals("")){ if (!where.equals("")) where+=" and ";
		 * where+=" DATA_NASC='"+datanasc+"'"; } if (!sesso.equals("")){ if
		 * (!where.equals("")) where+=" and "; where+="  SESSO='"+sesso+"'"; }
		 */
		// se la where e' non e' vuota e quindi si filtra per paziente o per
		// nosologico o per richiesta posso aggiungere le altre condizioni
		if (!where.equals("")) {

			if (!where.equals("")) {
				where += " and ";
			}
			where += " status='Approved' ";

			if (!where.equals("")) {
				where += " ) ";
			}

			// le prossime condizioni le considero solamente se non mi arriva
			// l'idenificativo della richiesta
			if (boolIdentifEst == false) {

				if (!daData.equals("")) {
					if (!sqlWhere2.equals("")) {
						sqlWhere2 += " and ";
					}
					sqlWhere2 += "  substr(creationtime,7,4)||substr(creationtime,4,2)||substr(creationtime,1,2) >='" + daData + "'";
				}
				if (!aData.equals("")) {
					if (!sqlWhere2.equals("")) {
						sqlWhere2 += " and ";
					}
					sqlWhere2 += "  substr(creationtime,7,4)||substr(creationtime,4,2)||substr(creationtime,1,2) <='" + aData + "'";
				}

				if (!reparto.equals("")) {
					if (!reparto.substring(0, 1).equals("'")) {
						reparto = "'" + reparto + "'";
					}

					if (!sqlWhere2.equals("")) {
						sqlWhere2 += " and ";
					}
					sqlWhere2 += "  id in (select /*+first_rows(1)*/ distinct(parent) from xdsregistry.slot where name='provenienza' and value in(" + reparto + ")) ";
				}

				if ((filtroDoc.equals("") || filtroDoc.equals("N")) && filtroTipoDocVal != null && !filtroTipoDocVal.equals("")) {
					hDoc = filtroTipoDocVal;
				}

				if (!hDoc.equals("")) {
					if (!sqlWhere2.equals("")) {
						sqlWhere2 += " and ";
					}
					sqlWhere2 += "  TIPODOC IN (" + hDoc + ") ";
				}

			}

			if (!sqlWhere2.equals("")) {
				where += "where " + sqlWhere2;
			}
		} // se la where e' ancora vuota e quindi non si filtra ne per paziente,
		// ne per nosologico, ne per richiesta
		else {
			where += " PATIENTID='0') ";
		}

		queryOut += where;

		return queryOut;

	}

	public static String apici(String tmpVal) {
		tmpVal = tmpVal.replaceAll("'", "''");

		return tmpVal;
	}

	public void getIdPatient(String patientId) throws SqlQueryException, SQLException {

		// String
		// sql="SELECT value FROM externalidentifier WHERE identificationscheme = 'urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427' AND value like '"+patientId+"^%' and rownum=1 ";
		// String
		// sql="SELECT distinct(value) FROM externalidentifier WHERE identificationscheme = 'urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427' AND value like '"+patientId+"^%'  ";
		String sql = "SELECT distinct(value) FROM externalidentifier WHERE identificationscheme = 'urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427' AND value like ?  ";

		ResultSet rs = null;
		PreparedStatement ps = null;

		patientIdWhere = "";

		try {

			// conn= new Connessione().getConnection(cContext);
			myPoolConnection = new getPoolConnection(cContext.getInitParameter("RegistryPoolName"), cContext.getInitParameter("RegistryUser"), cContext.getInitParameter("RegistryPwd"), cContext.getInitParameter("CryptType"));
			conn = myPoolConnection.getConnection();

			ps = conn.prepareStatement(sql);
			ps.setString(1, patientId + "^%");
			rs = ps.executeQuery();

			/*
			 * if (rs.next()) { patientIdWhere= rs.getString("value"); } else{
			 * patientIdWhere=""; }
			 */
			while (rs.next()) {

				if (patientIdWhere.equals("")) {
					patientIdWhere = "'" + rs.getString("value") + "'";
				} else {
					patientIdWhere += ",'" + rs.getString("value") + "'";
				}

			}

		} catch (Exception e) {

			logInterface.error(e.getMessage(), e);

		} finally {
			try {
				fDB.close(rs);
				ps.close();

				// new Connessione().chiudi(conn,cContext);
				myPoolConnection.chiudi(conn);
			} catch (SQLException e) {

				logInterface.error(e.getMessage(), e);
			}

		}

	}

	public void getDatiAnag(String patientIdDoc) throws SqlQueryException, SQLException {

		String patientId = "";

		// se non mi viene passato da whale l'identificativo paziente prendo
		// quello che mi ricavo da un documento della worklist
		if (patientIdWhere == null || patientIdWhere.equals("")) // patientId="'"+patientIdDoc+"'";
		{
			patientId = patientIdDoc;
		} else {
			patientId = patientIdWhere;
		}

		// String
		// sql="SELECT value FROM externalidentifier WHERE identificationscheme = 'urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427' AND value like '"+patientId+"^%' and rownum=1 ";
		String sql = "declare vCognome varchar2(5000):='';vNome varchar2(5000):='';vData varchar2(5000):=''; begin for cur in (select COLUMN_VALUE from table(radsql.split(?))) loop begin SELECT COGNOME,NOME,DATA_NASC into vCognome,vNome,vData FROM view_anag where patientid =cur.column_value and rownum=1; exception when no_data_found then null; end; end loop; ? := vCognome;?:=vNome;?:= vData; end;";// ("+patientId+")";

		// ResultSet rs = null;
		CallableStatement stm = null;

		try {

			// conn= new Connessione().getConnection(cContext);
			myPoolConnection = new getPoolConnection(cContext.getInitParameter("RegistryPoolName"), cContext.getInitParameter("RegistryUser"), cContext.getInitParameter("RegistryPwd"), cContext.getInitParameter("CryptType"));
			conn = myPoolConnection.getConnection();
			// stm = conn.prepareStatement("select",
			// ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
			stm = conn.prepareCall(sql);
			stm.setString(1, patientId.replace("'", ""));
			stm.registerOutParameter(2, Types.VARCHAR);
			stm.registerOutParameter(3, Types.VARCHAR);
			stm.registerOutParameter(4, Types.VARCHAR);
			// rs = stm.executeQuery(sql);
			stm.execute();

			cognomeRs = stm.getString(2);
			nomeRs = stm.getString(3);
			datanascRs = stm.getString(4).substring(6, 8) + '/' + stm.getString(4).substring(4, 6) + '/' + stm.getString(4).substring(0, 4);

			/*
			 * if (rs.next()) { cognomeRs = rs.getString("COGNOME"); nomeRs =
			 * rs.getString("NOME"); datanascRs =
			 * rs.getString("DATA_NASC").substring(6,
			 * 8)+'/'+rs.getString("DATA_NASC").substring(4,
			 * 6)+'/'+rs.getString("DATA_NASC").substring(0, 4); } else{
			 * cognomeRs = ""; nomeRs = ""; datanascRs = ""; }
			 */
		} catch (Exception e) {

			logInterface.error(e.getMessage(), e);

		} finally {
			try {
				// fDB.close(rs);
				stm.close();

				// new Connessione().chiudi(conn,cContext);
				myPoolConnection.chiudi(conn);
			} catch (SQLException e) {

				logInterface.error(e.getMessage(), e);
			}

		}

	}

	public void getDatiAnagWhale(String patientId) throws SqlQueryException, SQLException {

		// String
		// sql="SELECT value FROM externalidentifier WHERE identificationscheme = 'urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427' AND value like '"+patientId+"^%' and rownum=1 ";
		String sql = "SELECT COGN,NOME,DATA FROM radsql.anag a,radsql.cod_est_anag c where a.iden=c.iden_anag and c.id1=?";

		ResultSet rs = null;
		PreparedStatement stm = null;
		stm = this.fDB.getConnectData().prepareCall(sql);
		stm.setString(1, patientId);
		rs = stm.executeQuery();

		if (rs.next()) {
			cognomeRs = rs.getString("COGN");
			nomeRs = rs.getString("NOME");
			datanascRs = rs.getString("DATA").substring(6, 8) + '/' + rs.getString("DATA").substring(4, 6) + '/' + rs.getString("DATA").substring(0, 4);
		} else {
			cognomeRs = "";
			nomeRs = "";
			datanascRs = "";
		}
		this.fDB.close(rs);

	}

	/*
	 * 
	 * public void checkFiltriDoc() throws SQLException{
	 * 
	 * String sql=""; ResultSet rs = null; baseGlobal infoGlobal =null; String
	 * outVal="";
	 * 
	 * 
	 * try { infoGlobal = baseRetrieveBaseGlobal.getBaseGlobal(cContext,
	 * session); } catch (ImagoHttpException e) {
	 * logInterface.error(e.getMessage(), e); }
	 * 
	 * 
	 * 
	 * sql="select pck_configurazioni.getValue('"+infoGlobal.SITO+"','','"+reparto
	 * + "','VISUALIZZATORE_FILTRO_TIPO_DOC_VAL') from dual";
	 * 
	 * try { rs= this.fDB.openRsWeb(sql); if (rs.next()) {
	 * outVal=rs.getString(1); }
	 * 
	 * if ((filtroDoc.equals("") || filtroDoc.equals("N")) && outVal!=null &&
	 * !outVal.equals("")) hDoc=outVal;
	 * 
	 * 
	 * } catch (Exception e) { logInterface.error(e.getMessage(), e); } finally{
	 * try { this.fDB.close(rs); } catch (SQLException e) {
	 * logInterface.error(e.getMessage(), e); } }
	 * 
	 * 
	 * }
	 */
}
