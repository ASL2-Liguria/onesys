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
 * processPrintInfo.java
 *
 * Created on 15 giugno 2006, 16.58
 */

package stampe.anteprima;

import imago.a_sql.CEsami;
import imago.a_sql.CLogError;
import imago.a_sql.CTabPro;
import imago.a_sql.CTabProData;
import imago.http.ImagoHttpException;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseSessionAndContext;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imagoAldoUtil.ImagoUtilException;
import imagoAldoUtil.classConfiguraStampe;
import imagoAldoUtil.classEsame;
import imagoAldoUtil.classReferto;
import imagoAldoUtil.structErroreControllo;

import java.util.Calendar;
import java.util.Hashtable;
import java.util.Vector;

import javax.servlet.http.HttpServletRequest;

import stampe.crystalclear.Parametri;
import ACR.DecodificaPwd;
import core.Global;

/**
 *
 * classe che in base al tipo di stampa che si vuole effettuare ritorna le
 * informazioni per stampare il report
 *
 */
public class processPrintInfo {

	private String strFunzioneStampa = "";
	private String strNumCopie = "";
	private baseWrapperInfo myBaseInfo = null;
	private printInfo myPrintInfo = null;
	private baseSessionAndContext myBaseHttpInfo = null;
	private String strPathReport = "";
	private String strNameExportedPdf = "";
	private CEsami myEsameRicPaz = null;
	private HttpServletRequest myRequest = null;
	private CLogError logPrint = null;
	private baseUser logged_user = null;
	private Hashtable myRichieste = null;
	private String Reparto = "";
	private classEsame myEsame = null;
	private basePC infoPC = null;
	private String strEsame = "";
	private java.sql.Connection myConn = null;

	/**
	 * costruttore della classe
	 *
	 * @param FunzioneStampa
	 *            String nome della procedura di stampa
	 * @param NumCopie
	 *            String numero di copie (questo ha precedenza su quello letto
	 *            nel DB.Se vuoto viene preso valore dal db
	 * @param printWhere
	 *            String where condition aggiuntiva
	 * @param Esame
	 *            classEsame info sull'esame
	 * @param myInfo
	 *            baseWrapperInfo info di base
	 */
	public processPrintInfo(String FunzioneStampa, String NumCopie,
			String printWhere, classEsame Esame, baseWrapperInfo myInfo,
			baseSessionAndContext myHttpInfo, HttpServletRequest myInputRequest) {

		this.strNumCopie = NumCopie;

		myEsame = Esame;
		this.myBaseInfo = myInfo;
		infoPC = this.myBaseInfo.getPC();
		this.myBaseHttpInfo = myHttpInfo;
		classReferto Referto = null;
		this.myRequest = myInputRequest;
		logged_user = this.myBaseInfo.getUser();
		try {
			Referto = new classReferto(logged_user.db.getDataConnection(),
					Esame.iden_ref);
		} catch (Exception e) {
			e.printStackTrace();
		}
		Reparto = "";
		Reparto = Referto.reparto;
		if (Reparto.equalsIgnoreCase("")) {
			Reparto = Esame.reparto;
		}
		strEsame = Esame.iden;
		strFunzioneStampa = FunzioneStampa;
		try {
			logPrint = new CLogError(logged_user.db.getWebConnection(),
					myRequest, "SERVLETreadFromDB", logged_user.login);
		} catch (Exception ex) {
			System.out.println(ex);
		}
		logPrint.setFileName("processPrintInfo");
		logPrint.setClassName("src.Sel_Stampa.processPrintInfo");
	}

	public processPrintInfo(String NumCopie, String printWhere,
			Hashtable MyRichiesteTabella, baseWrapperInfo myInfo,
			baseSessionAndContext myHttpInfo, HttpServletRequest myInputRequest) {

		this.strNumCopie = NumCopie;
		int typeDB = Integer.parseInt(myHttpInfo.getContesto()
				.getInitParameter("TIPODB"));
		infoPC = (basePC) myHttpInfo.getSessione().getAttribute("parametri_pc");
		this.myRichieste = MyRichiesteTabella;
		this.myBaseInfo = myInfo;
		this.myBaseHttpInfo = myHttpInfo;
		this.myRequest = myInputRequest;
		logged_user = Global.getUser(myBaseHttpInfo.getSessione());
		strFunzioneStampa = (String) myRichieste.get("stampaFunzioneStampa");
		try {
			logPrint = new CLogError(logged_user.db.getWebConnection(),
					myRequest, "SERVLETreadFromDB", logged_user.login);
		} catch (Exception ex) {
			System.out.println(ex);
		}
		logPrint.setFileName("processPrintInfo");
		logPrint.setClassName("src.Sel_Stampa.processPrintInfo");

		if (myRichieste.containsKey("stampaIdenRef")) {
			myEsameRicPaz = new CEsami(logged_user, logPrint, typeDB);
			myEsameRicPaz.loadData("iden_ref="
					+ (String) myRichieste.get("stampaIdenRef"));
			strEsame = Integer.toString(myEsameRicPaz.getData(0).m_iIDEN);
			Reparto = myEsameRicPaz.getData(0).m_strREPARTO;
		} else {
			strEsame = (String) myRichieste.get("stampaIdenEsame");

			Reparto = (String) myRichieste.get("stampaReparto");
			if (Reparto != null && !Reparto.equalsIgnoreCase("")) {
				String[] arrayRep = Reparto.split("[*]");
				Reparto = arrayRep[0];
			} else

			{
				if (infoPC.DIRECTORY_REPORT.equalsIgnoreCase("")
						|| infoPC.DIRECTORY_REPORT == null)
					Reparto = "";
				else
					Reparto = infoPC.DIRECTORY_REPORT;
			}

			if (Reparto.equalsIgnoreCase("") || Reparto == null) {
				logPrint.writeLog(
						"Nessun Reparto Pervenuto o selezionato Errore!! ",
						CLogError.LOG_ERROR);
			}
		}
	}

	/**
	 * costruttore della classe per la stampa delle statistiche
	 *
	 */

	public processPrintInfo(String myIP, String NumCopie, String printWhere,
			Hashtable MyRichiesteTabella, baseSessionAndContext myHttpInfo,
			HttpServletRequest myInputRequest, java.sql.Connection Connessione) {
		this.myConn = Connessione;
		this.strNumCopie = NumCopie;
		Integer.parseInt(myHttpInfo.getContesto().getInitParameter("TIPODB"));
		infoPC = new basePC(myIP);
		try {
			logPrint = new CLogError(Connessione, "processPirntInfo");
		} catch (Exception ex) {
			System.out.println(ex);
		}

		try {
			infoPC.loadInitValue(myConn);
		} catch (ImagoHttpException ex) {
		}
		this.myRichieste = MyRichiesteTabella;

		this.myBaseHttpInfo = myHttpInfo;
		this.myRequest = myInputRequest;

		strFunzioneStampa = (String) myRichieste.get("stampaFunzioneStampa");

		Reparto = infoPC.DIRECTORY_REPORT;

		if (Reparto.equalsIgnoreCase("") || Reparto == null) {
			System.out
					.println("Nessun Reparto Pervenuto o selezionato Errore!! ");
		}

	}

	/**
	 * @return printInfo ritorna le informazioni base per la stampa NB per i
	 *         path vengono utilizzati gli "/" come divisori di cartelle
	 */
	public printInfo getPrintInfo() throws ImagoUtilException {

		structErroreControllo myErrore = null;

		myErrore = this.processInfo();
		if (myErrore.bolError == true) {
			throw (new ImagoUtilException(myErrore.strDescrErrore));
		}
		return this.myPrintInfo;
	}

	/**
	 * metodo che effettua l'elaborazione
	 *
	 */
	private structErroreControllo processInfo() {

		structErroreControllo myErrore = null;
		classConfiguraStampe myConfiguraStampe = null;
		String myWhereCondition = "";
		new Vector();
		this.myPrintInfo = new printInfo();
		myErrore = new structErroreControllo(false, "", "");
		try {
			if (myConn == null)
				myConfiguraStampe = new classConfiguraStampe(
						this.myBaseInfo.getUser().db.getWebConnection(),
						this.strFunzioneStampa, Reparto);
			else
				myConfiguraStampe = new classConfiguraStampe(myConn,
						this.strFunzioneStampa, Reparto);

		}

		catch (java.lang.Exception ex) {
			myErrore.bolError = true;
			myErrore.strDescrErrore = "processPrintInfo.processInfo - Errore: "
					+ ex.getMessage();
			logPrint.writeLog(
					"processPrintInfo.processInfo - Errore: " + ex.getMessage(),
					0);
			return myErrore;
		}
		if (myConfiguraStampe.getCdc() == null
				|| myConfiguraStampe.getCdc().equalsIgnoreCase("")) {
			myErrore.bolError = true;
			myErrore.strDescrErrore = "processPrintInfo.processInfo - Errore creazione classeConfiguraStampe";
			logPrint.writeError("processPrintInfo.processInfo - Errore creazione classeConfiguraStampe");
			return myErrore;
		}
		// *********************************
		// ** controllo il nome del report *
		// *********************************
		if (myConfiguraStampe.getNomeReport().equalsIgnoreCase("")) {
			myErrore.bolError = true;
			myErrore.strDescrErrore = "processPrintInfo.processInfo - Errore nome report nullo.\nProcedura stampa: "
					+ this.strFunzioneStampa;
			logPrint.writeError("processPrintInfo.processInfo - Errore nome report nullo.Procedura stampa: "
					+ this.strFunzioneStampa);
			return myErrore;
		}
		// *********************************
		// *** controllo esistenza sezioni *
		// *********************************
		/*
		 * if (myConfiguraStampe.vectSezioniStampe==null){ myErrore.bolError =
		 * true; myErrore.strDescrErrore =
		 * "processPrintInfo.processInfo - Errore nessuna sezione configurata.\nProcedura stampa: "
		 * + this.strFunzioneStampa; return myErrore; } if
		 * (myConfiguraStampe.vectSezioniStampe.size()==0){ myErrore.bolError =
		 * true; myErrore.strDescrErrore =
		 * "processPrintInfo.processInfo - Errore nessuna sezione configurata.\nProcedura stampa: "
		 * + this.strFunzioneStampa; return myErrore; }
		 */

		// **************************************
		// *** setto info del report ************
		// **************************************

		this.myPrintInfo.setWHereCondition(myWhereCondition);
		// strPathReport=(String)this.myBaseHttpInfo.getContesto().getInitParameter("PathDirectoryReport");
		if (myConfiguraStampe.getReportLocation() == null
				|| "".equalsIgnoreCase(myConfiguraStampe.getReportLocation())) {
			strPathReport = Global.context
					.getInitParameter(Parametri.param_stampeReportFolder);
		} else {

			if ("S".equalsIgnoreCase(infoPC.USO_APPLET_STAMPA)) {
				if ("".equalsIgnoreCase(myConfiguraStampe.getReportLocation())) {
					strPathReport = Global.context
							.getInitParameter(Parametri.param_stampeReportFolder);
				} else {
					Reparto = "";
					strPathReport = myConfiguraStampe.getReportLocation();
				}
			} else {
				if ("".equalsIgnoreCase(myConfiguraStampe
						.getReportLocation_activex())) {
					strPathReport = Global.context
							.getInitParameter(Parametri.param_stampeReportFolder);
				} else {
					Reparto = "";
					strPathReport = myConfiguraStampe
							.getReportLocation_activex();
				}
			}
		}

		this.myPrintInfo.setPathReport(strPathReport);
		// String Funzione="";
		String nameReport = "";

		// Esame=(String) myRichieste.get("stampaIdenEsame");
		// strFunzioneStampa=(String) myRichieste.get("stampaFunzioneStampa");
		String strNcopie = "";
		if (strFunzioneStampa.equalsIgnoreCase("REFERTO_STD")) {
			try {
				myEsame = new classEsame(logged_user.db.getDataConnection(),
						strEsame);
				CTabPro Provenienza = new CTabPro(
						logged_user.db.getDataConnection());
				Provenienza.loadData(myEsame.iden_pro, true);
				CTabProData DataProvenienza = new CTabProData();
				DataProvenienza = Provenienza.getData(0);
				int n_c = DataProvenienza.m_iNUM_COPIE;
				if (n_c < 1) {
					n_c = 0;
				}
				strNcopie = Integer.toString(n_c);
				nameReport = DataProvenienza.m_strNOME_REPORT;
			} catch (Exception e) {
				logPrint.writeLog(
						"Errore nella connessione alla tabella Tab_pro per esame= "
								+ myEsame.iden + "  Err:" + e.getMessage(),
						CLogError.LOG_ERROR);
			}
			if (nameReport == null || nameReport.equalsIgnoreCase("")) {
				nameReport = myConfiguraStampe.getNomeReport();
			}
			if (strNcopie == null || strNcopie.equalsIgnoreCase("")
					|| strNcopie.equalsIgnoreCase("0")
					|| strNcopie.equalsIgnoreCase("-1")) {
				strNcopie = myConfiguraStampe.getNum_copie();
			}
		} else {
			nameReport = myConfiguraStampe.getNomeReport();
			strNcopie = myConfiguraStampe.getNum_copie();
		}
		this.myPrintInfo.setReportName(Reparto + "/" + nameReport);

		this.myPrintInfo.setProcessClass(myConfiguraStampe.getProcessClass());

		// *********************************
		// **** controllo numero copie *****
		// *********************************
		if (this.strNumCopie.equalsIgnoreCase("")
				|| this.strNumCopie.equalsIgnoreCase("0")) {
			this.myPrintInfo.setNcopie(strNcopie);
		} else {
			this.myPrintInfo.setNcopie(strNcopie);
		}
		// setto nome esported Pdf
		// lo lascio anche se non è strettamente necessario
		/*
		 * try { this.myPrintInfo.setNcopie(this.GetNcopieFromFunction()); }
		 * catch (Exception e) { e.printStackTrace();
		 * this.myPrintInfo.setNcopie("1"); }
		 */
		this.strNameExportedPdf = this.myBaseHttpInfo.getSessione().getId();
		Calendar rightNow = Calendar.getInstance();
		this.strNameExportedPdf = this.strNameExportedPdf
				+ Integer.toString(rightNow.get(Calendar.HOUR_OF_DAY))
				+ Integer.toString(rightNow.get(Calendar.MINUTE))
				+ Integer.toString(rightNow.get(Calendar.SECOND));
		this.myPrintInfo.setPdfName(myConfiguraStampe.getNomeReport() + "_"
				+ this.strNameExportedPdf + ".pdf");
		this.myPrintInfo.setUser(this.myBaseHttpInfo.getContesto()
				.getInitParameter("DataUser"));
		new DecodificaPwd();
		DecodificaPwd.decodificaPwd(this.myBaseHttpInfo.getContesto(),
				this.myBaseHttpInfo.getContesto().getInitParameter("DataPwd"));
		this.myPrintInfo.setPassword(this.myBaseHttpInfo.getContesto()
				.getInitParameter("DataPwd"));
		this.myPrintInfo.setReparto(Reparto);
		// servono nel caso che non si voglia avere il parametro sul webxml
		// della Url di imago
		// String Url=myRequest.getRequestURL().toString();
		// String Uri=myRequest.getRequestURI();
		// String UrlImago=Url.replaceAll(Uri, "/");
		// if (Url.equalsIgnoreCase(UrlImago))
		// {logPrint.writeLog("Errore Uri e Url Uguali",CLogError.LOG_ERROR); }
		this.myPrintInfo.setUrlImago(Global.getBaseUrl());

		// chiamare l'elaborazione della classe
		// relativa a "processClass"
		// passandogli in ingresso this.myPrintInfo
		// in modo tale che venga completata (Sf, parametri, ncopie...)
		// in base al tipo di report/funzione stampa desiderato

		// *************
		// setta la url per
		// reperire il PDF via http
		// richiamando la classe di matteo e passandogli nell'ordine:
		//
		// report
		// sf
		// user
		// password

		/*
		 * strUrlServletPdf =
		 * (String)this.myBaseHttpInfo.getContesto().getInitParameter
		 * ("baseUrlImagox"); strUrlServletPdf = strUrlServletPdf +
		 * "ServletStampe" + "?report" + this.myPrintInfo.getReportName();
		 * strUrlServletPdf = strUrlServletPdf + "&" +"sf=" +
		 * this.myPrintInfo.getSF(); strUrlServletPdf = strUrlServletPdf + "&"
		 * +"user=" +
		 * (String)this.myBaseHttpInfo.getContesto().getInitParameter(
		 * "DataUser"); strUrlServletPdf = strUrlServletPdf + "&" +"password=" +
		 * (
		 * String)this.myBaseHttpInfo.getContesto().getInitParameter("DataPwd");
		 */
		// aggiungere codice che cicla
		// nell'hashtable dei parametri e li aggiunga alla
		// URL

		// ****

		return myErrore;
	}
	/*
	 * public String GetNcopieFromFunction() throws Exception{
	 * 
	 * if (myEsame==null) { myEsame = new
	 * classEsame(logged_user.db.getDataConnection(),strEsame) ; } String psSql=
	 * "select GetNCopie (?,?,?,?,?) test from dual"; String ncopie="";
	 * PreparedStatement ps; ps=
	 * this.logged_user.db.getDataConnection().prepareStatement(psSql);
	 * ps.setString(1,this.strFunzioneStampa); ps.setString(2,this.Reparto);
	 * ps.setString(3,this.infoPC.nome_host);
	 * ps.setString(4,this.logged_user.login);
	 * ps.setString(5,this.myEsame.iden);
	 * 
	 * ResultSet rs = ps.executeQuery(); if (rs.next()) {
	 * ncopie=rs.getString(1); } return ncopie; }
	 */
}

/*
 * public void settaURL {
 * 
 * 
 * 
 * String nome = myPrintInfo.getProcessClass(); Class myObjDefault =
 * Class.forName(nome); IElaborazioneStampa myInterface =
 * (IElaborazioneStampa)myObjDefault.newInstance();
 * myInterface.setParam(myPrintInfo, myEsame.iden);
 * 
 * 
 * 
 * } }
 */
