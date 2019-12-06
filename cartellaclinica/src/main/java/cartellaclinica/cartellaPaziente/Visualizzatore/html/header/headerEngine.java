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
package cartellaclinica.cartellaPaziente.Visualizzatore.html.header;

import generic.utility.html.HeaderUtils;
import imago.http.ImagoHttpException;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classIFrameHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLIHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTabHeaderFooter;
import imago.http.classTableHtmlObject;
import imago.http.classULHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;

public class headerEngine extends functionObj {

	private functionDB fDB = null;

	ServletContext cContext;

	HttpServletRequest cRequest;

	Hashtable<Integer, Hashtable> hashColonne = new Hashtable<Integer, Hashtable>();

	String codCdc = "";

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
	String daData = "";

	String aData = "";

	String traceUser = "";

	String nosologicoConf = "";

	String repartoConf = "";

	HttpSession session = null;

	boolean boolIdentifEst = false;

	Hashtable<String, String> parametriIn = new Hashtable<String, String>();

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(headerEngine.class);

	baseGlobal infoGlobal = null;

	public headerEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) {

		super(cont, req, sess);
		fDB = new functionDB(this);
		cContext = cont;
		cRequest = req;
		session = sess;
		bReparti = super.bReparti;//Global.getReparti(hSessione);
	}

	public headerEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));

	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();
		classFormHtmlObject cForm = null;
		classFormHtmlObject cFormFiltri = null;
		classTabHeaderFooter HeadSection = null;
		classTableHtmlObject cTable = null;
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		classInputHtmlObject cInput = null;
		classIFrameHtmlObject cFrame = null;
		classDivHtmlObject cDiv = null;
		classULHtmlObject cUL = null;
		classLIHtmlObject cLI = null;

		try {

			cDoc.appendHead(this.createHead());

			cForm = new classFormHtmlObject("formRequest", "listDocument", "POST", "frameList");
			cForm.addAttribute("style", "margin: 0px; padding: 0px;");

			cFormFiltri = new classFormHtmlObject("formFiltri", "frameFiltri", "POST", "frameFiltri");
			cFormFiltri.addAttribute("style", "margin: 0px; padding: 0px;");

			String key;
			String value;
			String repartoIn = cRequest.getParameter("reparto");
			Enumeration en = cRequest.getParameterNames();

			configuraData(repartoIn);

			while (en.hasMoreElements()) {
				key = (String) en.nextElement();
				value = cRequest.getParameter(key);

				String par = parametriIn.get(key);
				if (par != null) {

					// se e' settato N non devo considerare il valore per quel
					// parametro in ingresso
					if (par.equalsIgnoreCase("N")) {
						cInput = new classInputHtmlObject("hidden", key, "");
						cInput.addAttribute("valore_iniziale", "");
						cForm.appendSome(cInput);
						cFormFiltri.appendSome(cInput);
					} // se non e' N lo considero
					else {
						cInput = new classInputHtmlObject("hidden", key, value);
						cInput.addAttribute("valore_iniziale", value);
						cForm.appendSome(cInput);
						cFormFiltri.appendSome(cInput);
					}
				} // se non e' presente quel parametro nella stringa di
				// configurazione lo considero come mi arriva in ingresso
				else {
					cInput = new classInputHtmlObject("hidden", key, value);
					cInput.addAttribute("valore_iniziale", value);
					cForm.appendSome(cInput);
					cFormFiltri.appendSome(cInput);
				}

			}

			// aggiungo un input per poter distinguere se il reparto l'ho
			// configurato da filtri reparti
			cInput = new classInputHtmlObject("hidden", "filtroReparto", "");
			cInput.addAttribute("valore_iniziale", "");
			cForm.appendSome(cInput);
			cFormFiltri.appendSome(cInput);

			cInput = new classInputHtmlObject("hidden", "daData", daData);
			cInput.addAttribute("valore_iniziale", daData);
			cForm.appendSome(cInput);
			cFormFiltri.appendSome(cInput);

			cInput = new classInputHtmlObject("hidden", "aData", aData);
			cInput.addAttribute("valore_iniziale", aData);
			cForm.appendSome(cInput);
			cFormFiltri.appendSome(cInput);

			String filtroDoc = checkFiltroDocumento();
			if (filtroDoc.equals("S")) {
				// campo per filtro tipologia documento solo se il filtro tipdoc
				// e' attivo
				cInput = new classInputHtmlObject("hidden", "hDoc", getTipoDocUte());
				cForm.appendSome(cInput);
				cFormFiltri.appendSome(cInput);
			} else {
				cInput = new classInputHtmlObject("hidden", "hDoc", "");
				cForm.appendSome(cInput);
				cFormFiltri.appendSome(cInput);

			}

			// mi dice se e' attivo il filtro
			cInput = new classInputHtmlObject("hidden", "filtroDoc", filtroDoc);
			cForm.appendSome(cInput);
			cFormFiltri.appendSome(cInput);

			// mi salvo l'utente loggato
			baseUser logged_user = null;
			logged_user = Global.getUser(session);
			cInput = new classInputHtmlObject("hidden", "webUser", logged_user.login);
			cForm.appendSome(cInput);

			// mi salvo l'impostazione traceuser che mi dice se tracciare le
			// azioni dell'utente
			String par = parametriIn.get("traceUser");
			cInput = new classInputHtmlObject("hidden", "traceUser", "");
			if (par != null) {
				cInput.addAttribute("valore_iniziale", par);
			} else {
				// se traceUser non e' configurato per reparto perche' non mi
				// viene passato, metto la variabile che ho settato
				// eventualemente con quello che c'e' in configura_moduli
				cInput.addAttribute("valore_iniziale", traceUser);
			}
			cForm.appendSome(cInput);

			// sono i filtri tip documento impostati da cc_configura_reparto, se
			// il filtro non e' attivo e ci sono li considero
			cInput = new classInputHtmlObject("hidden", "tipoDocVal", parametriIn.get("tipoDocVal"));
			cForm.appendSome(cInput);
			cFormFiltri.appendSome(cInput);

			//se inserire l'icona di apertura immagini pacs
			cInput = new classInputHtmlObject("hidden", "aperturaPacs", parametriIn.get("aperturaPacs"));
			cForm.appendSome(cInput);
			cFormFiltri.appendSome(cInput);

			cDiv = new classDivHtmlObject("divAnag");
			cDiv.appendSome("<h3></h3>");
			cBody.addElement(cDiv.toString());

			cUL = new classULHtmlObject();
			cUL.addAttribute("id", "nav");
			cLI = new classLIHtmlObject(true);
			cLI.appendSome("<LI><a id='aggiorna'  href='javascript:parent.aggiornaLista();'>Visualizza documenti </a></LI>");
			cUL.appendSome(cLI);
			cLI = new classLIHtmlObject(true);
			cLI.appendSome("<LI><a id='chiudiPagina'  href='javascript:ChiudiPagina();'>Chiudi</a></LI>");
			cUL.appendSome(cLI);
			cLI = new classLIHtmlObject(true);
			cLI.appendSome("<LI><a id='chiudiDoc'  href='javascript:chiudiDocumento();'>Chiudi documento</a></LI>");
			cUL.appendSome(cLI);

			cDiv = new classDivHtmlObject("divMenu");
			cDiv.appendSome(cUL.toString());
			cBody.addElement(cDiv.toString());

			/*
			 * cUL = new classULHtmlObject(); cUL.addAttribute("id",
			 * "navChiudiDoc"); cLI = new classLIHtmlObject(false);
			 * cLI.appendSome(
			 * "<a id='chiudiDoc' href='javascript:chiudiDocumento();'>Chiudi documento</a>"
			 * ); cUL.appendSome(cLI);
			 * 
			 * cDiv = new classDivHtmlObject("divMenuDoc");
			 * cDiv.appendSome(cUL.toString());
			 * cBody.addElement(cDiv.toString());
			 */
			cBody.addElement("<SCRIPT>document.all.chiudiDoc.style.display='none';</SCRIPT>");

			// cFrame = new classIFrameHtmlObject("frameFiltri");
			cFrame = new classIFrameHtmlObject();
			cFrame.addAttribute("width", "100%");
			// cFrame.addAttribute("height","90px");
			cFrame.addAttribute("height", "70px");
			cFrame.addAttribute("name", "frameFiltri");
			cFrame.addAttribute("scrolling ", "no");
			cBody.addElement(cFrame.toString());

			cBody.addElement(cFormFiltri.toString());
			cBody.addElement("<SCRIPT>document.formFiltri.submit();</SCRIPT>");

			cFrame = new classIFrameHtmlObject("frameRicercaAvanzata");
			cFrame.addAttribute("width", "100%");
			// cFrame.addAttribute("height","200px");
			cFrame.addAttribute("height", "27%");
			cFrame.addAttribute("name", "frameRicercaAvanzata");
			cFrame.addAttribute("scrolling ", "no");
			cBody.addElement(cFrame.toString());

			cFrame = new classIFrameHtmlObject();
			cFrame.addAttribute("width", "100%");
			// cFrame.addAttribute("height","500px");
			cFrame.addAttribute("height", "87%");
			cFrame.addAttribute("name", "frameList");
			cFrame.addAttribute("id", "frameList");
			cFrame.addAttribute("scrolling ", "no");
			cBody.addElement(cFrame.toString());

			cFrame = new classIFrameHtmlObject();
			cFrame.addAttribute("width", "100%");
			// cFrame.addAttribute("height","802px");
			cFrame.addAttribute("height", "95%");
			cFrame.addAttribute("name", "frameDocument");
			cFrame.addAttribute("scrolling ", "no");
			cBody.addElement(cFrame.toString());

			cBody.addElement(cForm.toString());

			// cBody.addElement("<SCRIPT>alert('vai');document.all.frameList.style.display='block';</SCRIPT>");
			// cBody.addElement("<SCRIPT>alert('vai');document.all.frameDocument.style.display='none';</SCRIPT>");
			cBody.addElement("<SCRIPT>document.all.frameDocument.style.display='none';</SCRIPT>");

			// se mi viene passato l'identificativo richiesta i filtri non li
			// considero
			if (boolIdentifEst == true) {
				cBody.addElement("<SCRIPT>document.all.frameFiltri.style.display='none';</SCRIPT>");
			}
			cBody.addElement("<SCRIPT>document.all.frameRicercaAvanzata.style.display='none';</SCRIPT>");

			// test
			cBody.addElement("<SCRIPT>top.setVeloNero('frameList')</SCRIPT>");
			cBody.addElement("<SCRIPT>document.formRequest.submit();</SCRIPT>");
			cBody.addElement("<script>disabilitaTastoDx()</script>");

			cBody.addAttribute("onunload", "javascript:onUnloadChiudi();");

			// //////////
			cDoc.setBody(cBody);
			sOut = cDoc.toString();
		} catch (SqlQueryException ex) {
			sOut = ex.getMessage();
			logInterface.error(ex.getMessage(), ex);
		} catch (SQLException ex) {
			sOut = ex.getMessage();
			logInterface.error(ex.getMessage(), ex);
		} catch (Exception ex) {
			sOut = ex.getMessage();
			logInterface.error(ex.getMessage(), ex);
		}

		return sOut;
	}

	private classHeadHtmlObject createHead() throws SqlQueryException, SQLException, Exception {
		return HeaderUtils.createHeadWithIncludesNoDefault(this.getClass().getName(), hSessione);
	}

	public void configuraData(String repartoIn) throws SqlQueryException, SQLException, Exception {

		String sql;
		ResultSet rs = null;
		PreparedStatement ps;

		try {
			infoGlobal = baseRetrieveBaseGlobal.getBaseGlobal(cContext, session);
		} catch (ImagoHttpException e) {
			logInterface.error(e.getMessage(), e);
		}

		if (repartoIn != null && !repartoIn.equalsIgnoreCase("")) {
			rs = null;
			// sql="select cod_cdc from centri_di_costo where cod_dec='"+repartoIn+"'";
			sql = "select cod_cdc from centri_di_costo where cod_dec=?";
			ps = this.fDB.getConnectData().prepareStatement(sql);
			ps.setString(1, repartoIn);
			rs = ps.executeQuery();

			// rs= this.fDB.openRs(sql);
			if (rs.next()) {
				codCdc = rs.getString("cod_cdc");
			}

			this.fDB.close(rs);
			ps.close();

		}

		/*
		 * parametriIn.put("nosologico",
		 * chkNull(caricaParametri(infoGlobal.SITO,
		 * "",codCdc,"VISUALIZZATORE_NOSOLOGICO_IN")));
		 * parametriIn.put("reparto",
		 * chkNull(caricaParametri(infoGlobal.SITO,"",
		 * codCdc,"VISUALIZZATORE_REPARTO_IN"))); parametriIn.put("traceUser",
		 * chkNull
		 * (caricaParametri(infoGlobal.SITO,"",codCdc,"VISUALIZZATORE_TRACE_USER"
		 * ))); parametriIn.put("tipoDocVal",
		 * chkNull(caricaParametri(infoGlobal.
		 * SITO,"",codCdc,"VISUALIZZATORE_FILTRO_TIPO_DOC_VAL"))); String
		 * giorniIn=chkNull(caricaParametri(infoGlobal.SITO,"",codCdc,
		 * "VISUALIZZATORE_GIORNI"));
		 */
		parametriIn.put("nosologico", chkNull(bReparti.getValue(codCdc, "VISUALIZZATORE_NOSOLOGICO_IN")));
		parametriIn.put("reparto", chkNull(bReparti.getValue(codCdc, "VISUALIZZATORE_REPARTO_IN")));
		parametriIn.put("traceUser", chkNull(bReparti.getValue(codCdc, "VISUALIZZATORE_TRACE_USER")));
		parametriIn.put("tipoDocVal", chkNull(bReparti.getValue(codCdc, "VISUALIZZATORE_FILTRO_TIPO_DOC_VAL")));
		parametriIn.put("aperturaPacs", chkNull(bReparti.getValue(codCdc, "VISUALIZZATORE_APERTURA_PACS")));

		String giorniIn = chkNull(bReparti.getValue(codCdc, "VISUALIZZATORE_GIORNI"));

		if (giorniIn != null && !giorniIn.equalsIgnoreCase("")) {
			rs = null;
			// sql="select to_char(sysdate,'yyyymmdd') as data_odierna,to_char(sysdate-"+giorniIn+",'yyyymmdd') as data_conf from dual";
			sql = "select to_char(sysdate,'yyyymmdd') as data_odierna,to_char(sysdate-?,'yyyymmdd') as data_conf from dual";
			ps = this.fDB.getConnectData().prepareStatement(sql);
			ps.setString(1, giorniIn);
			rs = ps.executeQuery();

			if (rs.next()) {
				daData = rs.getString("data_conf");
				aData = rs.getString("data_odierna");
			}

			this.fDB.close(rs);
			ps.close();
		}

		// se le date non sono ancora state valorizzate...
		if (daData.equals("")) {

			rs = null;
			sql = "select to_char(sysdate,'yyyymmdd') as data_odierna,to_char(sysdate-365,'yyyymmdd') as data_conf from dual";

			rs = this.fDB.openRs(sql);

			if (rs.next()) {
				daData = rs.getString("data_conf");
				aData = rs.getString("data_odierna");
			}

			this.fDB.close(rs);
		}
	}

	/*
	 * public String caricaParametri(String inSito, String inAzienda,String
	 * inReparto, String inPar) throws SQLException, SqlQueryException{
	 * 
	 * String sql; ResultSet rs = null; String outVal="";
	 * 
	 * rs = null; sql="select pck_configurazioni.getValue('"+inSito+
	 * "','"+inAzienda+ "','"+inReparto+ "','"+inPar+ "') from dual";
	 * 
	 * rs= this.fDB.openRsWeb(sql);
	 * 
	 * if (rs.next()) {
	 * 
	 * outVal=rs.getString(1); } this.fDB.close(rs);
	 * 
	 * return outVal; }
	 */
	public String getTipoDocUte() {
		String tipoDocUte = "";
		baseUser utente = this.fDB.bUtente;
		String sql;
		ResultSet rs = null;
		PreparedStatement ps = null;
		rs = null;

		// sql="select LASTVALUECHAR FROM FILTRI WHERE TIPO='400' AND USER_NAME='"+utente.login+"'";
		sql = "select LASTVALUECHAR FROM FILTRI WHERE TIPO='400' AND USER_NAME=?";

		try {
			ps = this.fDB.getConnectData().prepareStatement(sql);
			ps.setString(1, utente.login);
			rs = ps.executeQuery();

			if (rs.next()) {
				tipoDocUte = rs.getString("LASTVALUECHAR");

			}

			if (tipoDocUte == null) {
				tipoDocUte = "";
			}

		} catch (Exception e) {
			logInterface.error(e.getMessage(), e);
		} finally {
			try {

				this.fDB.close(rs);
				ps.close();
			} catch (SQLException e) {
				logInterface.error(e.getMessage(), e);
			}
		}

		return tipoDocUte;
	}

	public String checkFiltroDocumento() throws SQLException ,Exception{

		String sql = "";
		ResultSet rs = null;
		String result = "N";
		// sql="select VALORE from CONFIGURA_MODULI where modulo='VISUALIZZATORE' and variabile='FILTRO_TIPO_DOCUMENTO'";

		// se mi arriva l'identificativo della richiesta il filtro non deve
		// essere attivo
		if (cRequest.getParameter("filtriAggiuntivi") == null || !cRequest.getParameter("filtriAggiuntivi").contains("identificativoEsterno")) {

			/*
			 * try { result=chkNull(caricaParametri(infoGlobal.SITO,"",codCdc,
			 * "VISUALIZZATORE_FILTRO_TIPO_DOC")); } catch (SqlQueryException
			 * e1) { logInterface.error(e1.getMessage(), e1); }
			 */
			result = chkNull(bReparti.getValue(codCdc, "VISUALIZZATORE_FILTRO_TIPO_DOC"));

		} else {
			boolIdentifEst = true;
		}

		return result;

	}

	private String chkNull(String input) {
		if (input == null) {
			return "";
		} else {
			return input;
		}
	}

}
