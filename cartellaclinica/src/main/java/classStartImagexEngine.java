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
 * classStartEngine.java
 *
 * Created on 16 maggio 2006, 9.47
 */

import imago.http.IHtmlObject;
import imago.http.ImagoHttpException;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.classTDHtmlObject;
import imago.http.classTRHtmlObject;
import imago.http.classTableHtmlObject;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.sql.TableResultSet;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoAldoUtil.checkUser.classUserManage;
import imagoUtils.classJsObject;
import imagoUtils.logToOutputConsole;

import java.net.InetAddress;
import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import worklist.ImagoWorklistException;
import worklist.IworklistEngine;
import core.Global;

/**
 * 
 * @author aldog
 */
public class classStartImagexEngine implements IworklistEngine {

	HttpSession mySession;

	ServletContext myContext;

	HttpServletRequest myRequest;

	HttpServletResponse myResponse;

	String arrayJsWorklist = "";

	private baseGlobal infoGlobali = null;

	private basePC infoPC = null;

	private Connection myConnImago = null;

	private boolean bolSyncPacsActive = false;

	// variabile del pathfile js di integrazione PACS
	private ArrayList arrayPathJsFileSyncPacs = null;

	private String strIdPacsObject = "";

	/** Creates a new instance of classStartImagexEngine */
	public classStartImagexEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest, HttpServletResponse myInputResponse) {

		// inizializzazione engine della worklist
		super();
		mySession = myInputSession;
		myContext = myInputContext;
		myRequest = myInputRequest;
		myResponse = myInputResponse;
		// *******
		leggiDatiInput();
		initMainObjects();
	}

	/**
	 * metodo che legge i dati in input dell'oggetto Request
	 */
	private void leggiDatiInput() {
		arrayPathJsFileSyncPacs = new ArrayList();
	}

	/**
	 * 
	 * inizializza l'oggetto
	 */
	private void initMainObjects() {

		String strIP = "", hostname = "", strConnectionString = "", strUser = "", strPwd = "";
		InetAddress addr = null;

		new classRsUtil();
		// istanzio dinamicamente per nome la classe per la connessione al DB
		try {
			strConnectionString = this.myContext.getInitParameter("ConnectionString");
			strUser = this.myContext.getInitParameter("WebUser");
			strPwd = classUserManage.decodificaPwd(this.myContext, this.myContext.getInitParameter("WebPwd"));
			this.myConnImago = imago.sql.Utils.getTemporaryConnection(strUser, strPwd);

		} catch (java.lang.Exception ex) {
			ex.printStackTrace();
			try {
				myContext.getRequestDispatcher("/errorMsg?errore=lblDbError&ricarica=N&caricaOnTop=N&msgToAdd=No Db Connection. \n Connection string: " + strConnectionString + "\n user: " + this.myContext.getInitParameter("WebUser") + "\n" + ex.getMessage()).forward(myRequest, myResponse);
			} catch (java.lang.Exception ex1) {
			}
		}

		try {
			// carico info globali
			this.infoGlobali = new baseGlobal();
			this.infoGlobali.loadInitValue(this.myConnImago);
			// ******** ATTENZIONE
			if (this.infoGlobali.uso_dhcp.equalsIgnoreCase("S")) {
				if (this.infoGlobali.INTERROGA_DNS_SERVER.equalsIgnoreCase("S")) {
					try {
						// prendo hostname
						addr = InetAddress.getByName(this.myRequest.getRemoteAddr());
						// Get the host name
						hostname = addr.getHostName();
						addr.getCanonicalHostName();
					} catch (java.lang.Exception ex1) {
						ex1.printStackTrace();
					}
					strIP = hostname;
				} else {
					// NON interroga il server DNS
					strIP = this.myRequest.getRemoteAddr();
				}
			} else {
				strIP = this.myRequest.getRemoteAddr();
			}
			this.infoPC = new basePC(strIP);
			this.infoPC.loadInitValue(this.myConnImago);
		} catch (java.lang.Exception ex) {
			ex.printStackTrace();
		}
	}

	@Override
	public String addBottomJScode() {
		StringBuffer sb = new StringBuffer();
		// appendo codice JS
		sb.append("<SCRIPT>");
		sb.append("initGlobalObject()");
		sb.append("</SCRIPT>");
		return sb.toString();
	}

	@Override
	public String addTopJScode() {
		StringBuffer sb = new StringBuffer();

		// converto classe globali
		sb.append(classJsObject.javaClass2jsClass(this.infoGlobali));
		sb.append(classJsObject.javaClass2jsClass(this.infoPC));
		sb.append("\n<SCRIPT>" + "\n");
		sb.append("var bolSyncPacsActive=" + this.bolSyncPacsActive + ";\n");
		sb.append("var pwdDecrypted = \"\";\n");
		sb.append("var pwdCrypted = \"\";\n");
		if (this.bolSyncPacsActive == true) {
			// SOLO un pacs per volta puo' essere
			// abilitato a fare la login
			// possono pero' coesistere pacs web
			sb.append("// objectSyncPacs contiene la chiave dell'oggetto PACS che viene usato per fare la sync del login\n");
			sb.append("var objectSyncPacs = \"" + this.getPacsObject() + "\";\n");
		} else {
			sb.append("var objectSyncPacs = \"\";\n");
		}
		sb.append("</SCRIPT>" + "\n");
		return sb.toString();
	}

	@Override
	public org.apache.ecs.html.Body creaBodyHtml() {
		Body corpoHtml;
		corpoHtml = new Body();
		// appendo layer al corpo
		try {
			corpoHtml.addElement(creaLayerLogin().toString());
			// **
			corpoHtml.addElement(creaLayerManager().toString());
			// *****
			corpoHtml.addElement(creaLayerCambioPassword().toString());
			// aggiungo interfaccia per OCX per PACS
			corpoHtml.addElement("<SCRIPT src='" + retrievePacsObject() + "'></script>");
			// ******
//			corpoHtml.addElement("<SCRIPT src='std/jscript/menu/killHomeEmbObj.js'></script>");
			// disattivo pulsante destro
			// attenzione qui non ho ancora l'utente
			// attivo quindi mi rifaccio al parametro in v_globali
			classJsObject.setNullContextMenuEvent(corpoHtml, this.infoGlobali);
			corpoHtml.addElement(addForms());
			// *
			corpoHtml.addElement(addBottomJScode() + "\n");
		} catch (java.lang.Exception ex) {
			try {
				myContext.getRequestDispatcher("/errorMsg?errore=lblDbError&ricarica=N&caricaOnTop=N&msgToAdd=" + ex.getMessage()).forward(myRequest, myResponse);
			} catch (java.lang.Exception ex1) {
			}
		}
		return corpoHtml;
	}

	@Override
	public org.apache.ecs.Document creaDocumentoHtml() throws ImagoWorklistException {

		Document doc = null;
		doc = new Document();
		try {
			// controllo validita'
			doc.setBody(creaBodyHtml());
			// attacco Head al documento
			doc.setHead(creaHeadHtml());

		} catch (java.lang.Exception ex) {
			try {
				myContext.getRequestDispatcher("/errorMsg?errore=lblDbError&ricarica=N&caricaOnTop=N&msgToAdd=" + ex.getMessage()).forward(myRequest, myResponse);
			} catch (java.lang.Exception ex1) {
			}
		}
		return doc;
	}

	@Override
	public imago.http.classHeadHtmlObject creaHeadHtml() {
		classHeadHtmlObject testata = null;

		classJsObject myJS = null;

		// Definisco Title del documento

		myJS = new classJsObject();
		// definisco Head
		testata = new classHeadHtmlObject();
		try {
			testata.addElement(creaTitoloHtml().toString());
		} catch (java.lang.Exception ex) {
		}

		// *** include string ********
		testata.addElement(classTabExtFiles.getIncludeString(this.myConnImago, "TAB_EXT_FILES", this.getClass().getName(), this.infoGlobali.lingua, this.myContext, this.infoGlobali));
		// ***************************
		// carico cmq il js
		// che gestisce lo startup del Pacs (nel caso di crash del ris
		// verra' fatta una getcurrentuser se supportata)
		// carico SOLO il js relativo alla sync del PACS
		// selezionata
		if (this.arrayPathJsFileSyncPacs != null) {
			for (int i = 0; i < this.arrayPathJsFileSyncPacs.size(); i++) {
				testata.addJSLink(this.arrayPathJsFileSyncPacs.get(i).toString());
			}
		}
		// appendo Meta all'Head
		try {
			testata.addJscode(myJS.getArrayLabel("classStartImagex", this.myConnImago, this.infoGlobali.lingua));
		} catch (ImagoHttpException ex) {
			System.out.println(ex.getMessage());
		} finally {
			// non serve + la connessione chiudo
			try {
				if (this.myConnImago != null) {
					imago.sql.Utils.closeTemporaryConnection(myConnImago);
					this.myConnImago = null;
				}
			} catch (Exception ex) {
				logToOutputConsole.writeLogToSystemOutput(this, "Error: " + ex.getCause().getMessage());
			}

		}
		testata.addElement(creaMetaHtml());
		// ***************** ATTENZIONE
		testata.addElement(addTopJScode());
		return testata;

	}

	@Override
	public imago.http.classMetaHtmlObject creaMetaHtml() {

		classMetaHtmlObject MetaTag = null;
		MetaTag = new classMetaHtmlObject();
		return MetaTag;

	}

	@Override
	public org.apache.ecs.html.Title creaTitoloHtml() throws ImagoWorklistException {
		// Definisco Title del documento
		try {
			// Definisco Title del documento
			Title titolo = new Title(Global.getTitle());
			return titolo;
		} catch (java.lang.Exception ex) {
			ImagoWorklistException newEx = new ImagoWorklistException(ex);
			ex.printStackTrace();
			throw newEx;
		}
	}

	/**
	 * metodo che ritorna il layer principale
	 * 
	 */
	private classFormHtmlObject creaLayerLogin() {
		classTableHtmlObject myTable = null;
		classTRHtmlObject myTR = null;
		classTDHtmlObject myTD = null;
		classInputHtmlObject myInput = null;
		classLabelHtmlObject myLabel = null;
		classFormHtmlObject myForm = null;

		myForm = new classFormHtmlObject("accesso", "UserExistTest", "POST", "ImagexMainWindow");
		// appendo campi hidden
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "nlicenze", ""));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "oldPwd", ""));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "sorgente", "homepage"));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "ipPC", ""));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "homepage", ""));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "menu", ""));

		// LAYER di LOGIN
		classDivHtmlObject myDivLayerLogin = new classDivHtmlObject("oLayMain");
		myTable = new classTableHtmlObject();
		myTable.addAttribute("class", "LoginTable");
		myTable.addAttribute("cellpadding", "1");
		myTable.addAttribute("cellspacing", "0");

		myTR = new classTRHtmlObject();
		myLabel = new classLabelHtmlObject("", "", "lblLogin");
		myTR.appendSome(creaTD(myLabel, "LABEL"));

		myInput = new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT, "UserName", "", "20", "30");
		myInput.addEvent("onkeypress", "javascript:intercetta_tasti();");
		myInput.addEvent("onblur", "javascript:switch_link_psw();");
		myTR.appendSome(creaTD(myInput, "FIELD"));
		myTR.addAttribute("id", "trFirstRowLogin");

		// DEVO INSERIRE IMMAGINE per fare cambia password
		classDivButton myDivPwd = new classDivButton("", "pulsante", "#", "oLinkPsw", "");
		myTR.appendSome(creaTD(myDivPwd, "BUTTON"));
		myTable.appendSome(myTR);

		// 2 riga
		myTR = new classTRHtmlObject();
		myLabel = new classLabelHtmlObject("", "", "lblPassword");
		myTR.appendSome(creaTD(myLabel, "LABEL"));

		myInput = new classInputHtmlObject(classTypeInputHtmlObject.typePASSWORD, "Password", "", "20", "30");
		myInput.addAttribute("id", "oLinkPsw");
		myInput.addEvent("onkeypress", "javascript:intercetta_tasti();");
		myTR.appendSome(creaTD(myInput, "FIELD"));

		// DEVO INSERIRE IMMAGINE per fare login
		classDivButton myDivLogin = new classDivButton("", "pulsante", "javascript:autenticaLogin();", "btLogin", "");
		myTR.appendSome(creaTD(myDivLogin, "BUTTON"));
		myTR.addAttribute("id", "trSecondRowLogin");
		myTable.appendSome(myTR);

		// inserisco informazioni
		myTR = new classTRHtmlObject();
		myTR.appendSome(creaTD("&nbsp;", "LABEL"));

		try {
			myLabel = new classLabelHtmlObject(addInfoImago(), "", "lblInfoPolaris");
		} catch (java.lang.Exception ex) {
			try {
				myContext.getRequestDispatcher("/errorMsg?errore=lblDbError&ricarica=N&caricaOnTop=N&msgToAdd=" + ex.getMessage()).forward(myRequest, myResponse);
			} catch (java.lang.Exception ex1) {
			}

			myLabel = new classLabelHtmlObject("Error connecting to DB", "", "lblInfoPolaris");
		}
		myTD = creaTD(myLabel, "INFO");
		myTD.addAttribute("colspan", "2");
		myTR.appendSome(myTD);
		myTable.appendSome(myTR);
		// appendo tabella al layer
		myDivLayerLogin.appendSome(myTable);
		myForm.appendSome(myDivLayerLogin);
		return myForm;
	}

	/**
	 * metodo che ritorna il layer Manager
	 * 
	 */
	private classFormHtmlObject creaLayerManager() {
		classLabelHtmlObject myLabel = null;
		classTableHtmlObject myTable = null;
		// ********************************************
		// ********* LAYER di gestione MANAGER
		// ********************************************
		classDivHtmlObject myDivPwdManagerLay = new classDivHtmlObject("oLayPwd_manager");
		classFormHtmlObject myFrmCheckPwdManager = new classFormHtmlObject("frm_check_pwd_manager", "cambiaPassword", "POST", "wnd_check_cambio_pwd_manager");
		myTable = new classTableHtmlObject();
		myTable.addAttribute("class", "LoginTable");
		myTable.addAttribute("cellpadding", "1");
		myTable.addAttribute("cellspacing", "0");
		classTRHtmlObject TRManager = new classTRHtmlObject();
		myLabel = new classLabelHtmlObject("", "", "lblPasswordManager");
		TRManager.appendSome(creaTD(myLabel, "LABEL"));
		classInputHtmlObject InputManager = new classInputHtmlObject(classTypeInputHtmlObject.typePASSWORD, "oldPwd", "");
		TRManager.appendSome(creaTD(InputManager, "FIELD"));
		TRManager.appendSome(creaTD(new classDivButton("", "pulsante", "javascript:cambiaPassword();", "btOKmanager", ""), "BUTTON"));
		// prima riga
		myTable.appendSome(TRManager);
		// **
		TRManager = new classTRHtmlObject();
		myLabel = new classLabelHtmlObject("", "", "lblNumLicenze");
		TRManager.appendSome(creaTD(myLabel, "LABEL"));
		InputManager = new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT, "nlicenze", "");
		TRManager.appendSome(creaTD(InputManager, "FIELD"));
		TRManager.appendSome(creaTD(new classDivButton("", "pulsante", "javascript:riattiva_login();", "btAnnullaManager", ""), "BUTTON"));

		myTable.appendSome(TRManager);
		// appendo table a form
		myDivPwdManagerLay.appendSome(myTable);
		myFrmCheckPwdManager.appendSome(myDivPwdManagerLay);
		return myFrmCheckPwdManager;
	}

	/**
	 * metodo che ritorna il layer principale
	 * 
	 */
	private classFormHtmlObject creaLayerCambioPassword() {

		classLabelHtmlObject myLabel = null;
		classTableHtmlObject myTable = null;
		classInputHtmlObject myInp = null;
		// ********************************************
		// ********* LAYER cambio password
		// ********************************************
		classDivHtmlObject myDivPwdLay = new classDivHtmlObject("oLayPwd");
		classFormHtmlObject myFrmCheckPwd = new classFormHtmlObject("frm_check_pwd", "cambiaPassword", "POST", "wnd_check_cambio_pwd");
		myInp = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "password_scaduta", "N");
		myFrmCheckPwd.appendSome(myInp);
		myInp = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "password_manager", "");
		myFrmCheckPwd.appendSome(myInp);
		myInp = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "utente_scaduto", "");
		myFrmCheckPwd.appendSome(myInp);
		myInp = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "utente", "");
		myFrmCheckPwd.appendSome(myInp);
		myInp = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "holdPwd", "");
		myFrmCheckPwd.appendSome(myInp);
		myInp = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "sorgente", "homepage");
		myFrmCheckPwd.appendSome(myInp);
		// creazione tabella per cambio pwd
		myTable = new classTableHtmlObject();
		myTable.addAttribute("class", "LoginTable");
		myTable.addAttribute("cellpadding", "1");
		myTable.addAttribute("cellspacing", "0");
		myTable.addAttribute("class", "LoginTable");
		// 1 riga
		classTRHtmlObject myTrPwd = new classTRHtmlObject();
		myLabel = new classLabelHtmlObject("", "", "lblOldPwd");
		myTrPwd.appendSome(creaTD(myLabel, "LABEL"));
		myTrPwd.appendSome(creaTD(new classInputHtmlObject(classTypeInputHtmlObject.typePASSWORD, "oldPwd", ""), "FIELD"));
		myTrPwd.appendSome(creaTD(new classDivButton("", "pulsante", "javascript:cambiaPassword();", "btOKcambio", ""), "BUTTON"));
		myTable.appendSome(myTrPwd);
		// 2riga
		myTrPwd = new classTRHtmlObject();
		myLabel = new classLabelHtmlObject("", "", "lblNewPwd");
		myTrPwd.appendSome(creaTD(myLabel, "LABEL"));
		myTrPwd.appendSome(creaTD(new classInputHtmlObject(classTypeInputHtmlObject.typePASSWORD, "newPwd", ""), "FIELD"));
		myTrPwd.appendSome(creaTD(new classDivButton("", "pulsante", "javascript:riattiva_login();", "btAnnullaCambio", ""), "BUTTON"));
		myTable.appendSome(myTrPwd);
		// 3 riga
		myTrPwd = new classTRHtmlObject();
		myLabel = new classLabelHtmlObject("", "", "lblNewPwdAgain");
		myTrPwd.appendSome(creaTD(myLabel, "LABEL"));
		myTrPwd.appendSome(creaTD(new classInputHtmlObject(classTypeInputHtmlObject.typePASSWORD, "newPwd2", ""), "FIELD"));

		myTable.appendSome(myTrPwd);
		// appendo a form...
		myDivPwdLay.appendSome(myTable);
		myFrmCheckPwd.appendSome(myDivPwdLay);
		return myFrmCheckPwd;
	}

	private String addForms() {
		StringBuffer sb = null;
		classFormHtmlObject myForm = null;

		sb = new StringBuffer();
		sb.append("\n");

		myForm = new classFormHtmlObject("frmLogin", "inizioServlet", "POST", "CR_wndMain");
		// myForm = new classFormHtmlObject("frmLogin","", "POST",
		// "CR_wndMain");
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "utente", ""));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "psw", ""));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "ipRilevato", ""));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "screenHeight", ""));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "screenWidth", ""));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "vecchiaPwd", ""));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "cambioPwd", "N"));
		myForm.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "opener", "WHALE"));
		sb.append(myForm.toString());
		sb.append("\n");

		return sb.toString();
	}

	/**
	 * 
	 * metodo che estrapola le info sul sistema
	 */
	private String addInfoImago() throws ImagoHttpException {

		String sql;
		ResultSet rs_info = null;
		String outputString = "";
		Connection myConnRadsql = null;
		TableResultSet myTable = null;
		String strUser = "", strPwd = "";

		try {
			this.myContext.getInitParameter("ConnectionString");
			strUser = this.myContext.getInitParameter("DataUser");
			strPwd = classUserManage.decodificaPwd(this.myContext, this.myContext.getInitParameter("DataPwd"));
			myConnRadsql = imago.sql.Utils.getTemporaryConnection(strUser, strPwd);
			// accesso al db dei dati
			sql = "Select max(release) as release from versione";
			myTable = new TableResultSet();
			rs_info = myTable.returnResultSet(myConnRadsql, sql);
			if (rs_info.next() == true) {
				outputString = outputString + "Rel: " + rs_info.getString("release");
			}
		}

		catch (Exception ex) {
			ImagoHttpException newEx = new ImagoHttpException(ex);
			ex.printStackTrace();
			throw (newEx);
		} finally {
			try {
				rs_info.close();
				rs_info = null;
				myTable.close();
				myTable = null;
				if (myConnRadsql != null) {
					imago.sql.Utils.closeTemporaryConnection(myConnRadsql);
					myConnRadsql = null;
				}
			} catch (java.lang.Exception ex) {
			}
		}
		return outputString;
	}

	/**
	 * crea TD
	 * 
	 * @param oggetto
	 *            IHtmlObject oggetto da inserire
	 * @param tipo
	 *            string : LABEL, FIELD, BUTTON
	 */
	private classTDHtmlObject creaTD(IHtmlObject oggetto, String tipo) {
		return creaTD(oggetto.toString(), tipo);
	}

	/**
	 * crea TD
	 * 
	 * @param oggetto
	 *            IHtmlObject oggetto da inserire
	 * @param tipo
	 *            string : LABEL, FIELD, BUTTON
	 */
	private classTDHtmlObject creaTD(String oggetto, String tipo) {

		classTDHtmlObject myTD = null;

		myTD = new classTDHtmlObject(oggetto);
		if (tipo.equalsIgnoreCase("LABEL")) {
			myTD.addAttribute("class", "LoginLabel");
		} else if (tipo.equalsIgnoreCase("FIELD")) {
			myTD.addAttribute("class", "LoginField");
		} else if (tipo.equalsIgnoreCase("BUTTON")) {
			myTD.addAttribute("class", "LoginButton");
		} else if (tipo.equalsIgnoreCase("INFO")) {
			myTD.addAttribute("class", "SystemInfo");
		}
		return myTD;
	}

	/**
	 * metodo che controlla se sono attive delle sync con pacs e restituisce
	 * oggetto corrispondende
	 */
	private String retrievePacsObject() {
		// stringa che conterra' gli oggetti Object
		// delle varie integrazioni con pacs
		// se non ci sono Object
		// non verra' aggiunto nulla
		String strReturn = "";
		String strAbilitaMP = "";
		String strScriptPacsControl = "";
		new classRsUtil();
		try {
			if (this.myRequest.getRemoteAddr().equalsIgnoreCase("")) {
				strAbilitaMP = "N";
			} else {
				strAbilitaMP = this.infoPC.abilita_sinc_mediprime;
			}
		} catch (java.lang.Exception ex) {
			strAbilitaMP = "N";
		}

		// ********
		// SYSTEM V - Mediprime
		// ********
		try {
			if (strAbilitaMP.equalsIgnoreCase("S")) {
				// *********
				// restituisco oggetto SYSTEM Vs
				// *********
				/*
				 * mySyncObj = new classObjectHtmlObject("prjImago2MP",
				 * "CLSID:2BBE026C-3095-4CB4-8ACE-E8502F1C5E2D"
				 * ,"cab/system5/prjImago2MP.CAB#version=1,0,0,6"); if
				 * (strLogMP.equalsIgnoreCase("S")){ myParam = new
				 * classParamHtmlObject("trace", "1"); } else{ myParam = new
				 * classParamHtmlObject("trace", "0"); }
				 * mySyncObj.appendSome(myParam);
				 */
				strScriptPacsControl = "std/jscript/syncPacsJs/carestreamEmbObj.js";
				// setto il tipo di pacs che verra' usato
				// this.setPacsObject ( basePacsType.strCodeMediprime ) ;
				this.arrayPathJsFileSyncPacs.add("std/jscript/syncPacsJs/syncSystem5Engine.js");
				// strReturn = mySyncObj.toString();
				strReturn = strScriptPacsControl;
				this.bolSyncPacsActive = true;
			}

		} catch (Exception ex) {
			System.out.println("retrievePacsObject - " + ex.getMessage());
		}
		// ***********
		return strReturn;
	}

	private String getPacsObject() {
		return this.strIdPacsObject;
	}

}
