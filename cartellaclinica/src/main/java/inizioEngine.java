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

import imago.crypto.CryptPasswordInterface;
import imago.http.ImagoHttpException;
import imago.http.classFrameHtmlObject;
import imago.http.classFramesetHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.TableUpdate;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoAldoUtil.classUtenteLoggato;
import imagoAldoUtil.structErroreControllo;
import imagoAldoUtil.checkUser.classUserManage;
import imagoUtils.classJsObject;
import imagoUtils.logToOutputConsole;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Html;
import org.apache.ecs.html.Title;

import worklist.ImagoWorklistException;
import cartellaclinica.dwr.dwrTraceUserAction;
import configurazioneReparto.baseReparti;
import core.Global;

public class inizioEngine {

    private HttpSession mySession;

    private ServletContext myContext;

    private HttpServletRequest myRequest;

    private HttpServletResponse myResponse;

    private baseUser logged_user;

    private baseReparti infoReparti;

    private baseGlobal infoGlobali = null;

    private basePC infoPC = null;

    private String inpututente = "";

    private String inputpsw = "";

    private String inputipRilevato = "";

    private String inputVecchiaPwd = "";

    private String inputCambioPwd = "";

    private String inputProfilo;

    private String inputId = "";

    private String inputScreenHeight = "";

    private String inputScreenWidth = "";

	// private String inputIpToDisconnect="";
    private static String onlyForManager = "SL_Manu_Tab_Frameset?procedura=T_PC&frame_rows=105,*";

    private String pageToRedirect = "";

    private structErroreControllo myErrore = new structErroreControllo(false, "");

    private static final String userLoggedErrorServlet = "/userLoggedError.htm";

    private static final String homepageUrl = "/";

    private final transient ElcoLoggerInterface logger = new ElcoLoggerImpl(this.getClass());

    public inizioEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest, HttpServletResponse myInputResponse) throws ImagoWorklistException {

        mySession = myInputSession;
        myContext = myInputContext;
        myRequest = myInputRequest;
        myResponse = myInputResponse;

        leggiDatiInput();
        initMainObjects();
        traceUserAction();

        Global.setSessionAttributesFromRequest(mySession, myRequest);
    }

    /**
     * Da lanciare dopo leggiDatiInput
     */
    private void traceUserAction() {
        String funzione = "";
        String id = "";
		// ********** se non mi arriva in ingresso il parametro del
        // profilo(MODALITA_ACCESSO) inserisco di default LOGIN

        if (!this.inputProfilo.equalsIgnoreCase("") && this.inputProfilo != null) {

            funzione = this.inputProfilo.toString();
        }

        if (!this.inputId.equalsIgnoreCase("") && this.inputId != null) {
            id = this.inputId.toString();
        }

		// richiamo il metodo callTraceUserAction che va ad inserire su
        // imagoweb.TRACE_USER_ACTION
        try {
            dwrTraceUserAction saveAction = new dwrTraceUserAction(this.mySession);
            saveAction.openTraceUserAction("LOGIN", funzione, id);
        } catch (Exception ex) {
            logger.error(ex);
        }
    }

    /**
     * inizializza gli oggetti principali che verranno usati nella servlet
     * inoltre azzera tutti i record lockati nella sessione corrente
     *
     */
    private void initMainObjects() {

        structErroreControllo myErrore = new structErroreControllo(false, "");

        // fare controllo correttezza user/psw
        if (this.inpututente.equalsIgnoreCase("manager")) {
            if (!classUserManage.checkManagerPwd(this.myContext, this.inputpsw)) {
                // errore autenticazione
                myErrore.bolError = true;
                urlForward(homepageUrl);
                return;
            }
        } else {
			// controllo autenticazione doppio
            // ATTENZIONE !!! VERIFICARE SE LASCIARE ATTIVO IL CONTROLLO O MENO
            // !!!
            // controllo fatto perche' se si accedesse dall'esterno su
            // inizioServlet diretto
            // non ci sarebbero + match su user/pwd
            if (!classUserManage.checkUserPwd(this.myContext, this.inpututente, this.inputpsw)) {
                myErrore.bolError = true;
                urlForward(homepageUrl);
                return;
            }
        }
        if (!checkTime()) {
            logToOutputConsole.writeLogToSystemOutput(this, "Unprocessable system error");
            myErrore.bolError = true;
            pageToRedirect = homepageUrl;
            try {
                this.myContext.getRequestDispatcher(homepageUrl).forward(this.myRequest, this.myResponse);
            } catch (IOException ex1) {
            } catch (ServletException ex1) {
            }
        }
        // creo UTENTE, info REPARTI, PARAMETRI, PC
        if (!creaUtente(this.inpututente) || !creaInfoReparti() || !creaClasseParametri() || !creaClassePC(this.inputipRilevato)) {
            myErrore.bolError = true;
            urlForward(pageToRedirect);
            return;
        }

        if (this.inpututente.equalsIgnoreCase("manager")) {
            // manager autenticato
            urlForward(onlyForManager);
            return;
        }
        checkDuplicazioneUtente(this.logged_user, this.infoPC, myErrore);
        if (myErrore.bolError) {
            urlForward(pageToRedirect);
            return;
        }
		// ********************************************
        // cancellazione dei lock dell'utente
        try {
            classRsUtil.unLockRecordForUser(this.logged_user.db.getDataConnection(), this.logged_user);
        } catch (java.lang.Exception ex) {
            logger.error(ex);
        }
        // **********************************************

    }

    private void leggiDatiInput() throws ImagoWorklistException {

        try {
            // parsing dati in ingresso
            this.inpututente = classStringUtil.checkNull(myRequest.getParameter("utente"));
            this.inputpsw = classStringUtil.checkNull(myRequest.getParameter("psw"));
            this.inputipRilevato = classStringUtil.checkNull(myRequest.getParameter("ipRilevato"));
            this.inputVecchiaPwd = classStringUtil.checkNull(myRequest.getParameter("vecchiaPwd"));
            this.inputCambioPwd = classStringUtil.checkNull(myRequest.getParameter("cambioPwd"));
            this.inputProfilo = myRequest.getParameter("MODALITA_ACCESSO");
            if (this.inputProfilo == null) {
                this.inputProfilo = "REPARTO"; // Default!
            }
            this.inputId = classStringUtil.checkNull(myRequest.getParameter("ID"));
            this.inputScreenHeight = classStringUtil.checkNull(myRequest.getParameter("screenHeight"));
            this.inputScreenWidth = classStringUtil.checkNull(myRequest.getParameter("screenWidth"));

            /*
             * N.B.
             * 
             * Sono parametri che vengono passati dalla
             * RADSQL.getUrlModalitaAccesso richiamata dall'autologin
             * MODALITA_ACCESSO --> stabilisce la modalità con la quale si entra
             * all'interno dell'applicativo FUNZIONE --> stabilisce il nome
             * della funzione che verrà inserita nella OMONIMA colonna di
             * IMAGOWEB.TRACE§_USER_ACTION ID --> stabilisce il nome dell'ID che
             * verrà inserita nella OMONIMA colonna di
             * IMAGOWEB.TRACE§_USER_ACTION
             */
            if (this.inputipRilevato.equalsIgnoreCase("")) {
                this.inputipRilevato = this.myRequest.getRemoteAddr();
            }

        } catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            logger.error(ex);
            throw newEx;
        }
    }

    private String addTopJScode() {
        StringBuffer sb = new StringBuffer();

        try {
            // appendo codice JS
            sb.append(classJsObject.javaClass2jsClass(this.logged_user));
            sb.append(classJsObject.javaClass2jsClass(this.infoGlobali));
            sb.append(classJsObject.javaClass2jsClass(this.infoPC));
            // this.bReparti.getConfigurazioniReparti()
            sb.append(this.infoReparti.getConfigurazioniReparti());
            sb.append("<SCRIPT>\n");

            sb.append(" var vecchiaPwd ='" + fromByteToString(codificaPwd(this.myContext, this.inputVecchiaPwd)) + "';\n");
        } catch (java.lang.Exception ex) {
            sb.append(" var vecchiaPwd ='';\n");
        }
        sb.append(" var cambioPwd ='" + this.inputCambioPwd + "';\n");
        sb.append("</SCRIPT>");
        return sb.toString();

    }

    public org.apache.ecs.Document creaDocumentoHtml() throws ImagoWorklistException {
        Document doc = null;

        doc = new Document();
        doc.setDoctype(new Doctype.Html401Transitional());

        try {
            // attacco Head al documento
            doc.setHead(creaHeadHtml());
            doc.setHtml(creaHtml());
        } catch (java.lang.NullPointerException ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            logger.error(ex);
            throw newEx;
        } catch (ImagoWorklistException ex) {
            logger.error(ex);
            throw ex;
        }
        return doc;

    }

    private imago.http.classHeadHtmlObject creaHeadHtml() throws ImagoWorklistException {
        classHeadHtmlObject testata = null;

        testata = new classHeadHtmlObject();
        try {
            testata.addElement(creaTitoloHtml().toString());
        } catch (java.lang.Exception ex) {
            logger.error(ex);
        }

        testata.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", this.getClass().getName(), this.myContext));
        testata.addElement(addTopJScode());
        return testata;
    }

    private org.apache.ecs.html.Title creaTitoloHtml() /*throws ImagoWorklistException*/ {
        // Definisco Title del documento
        //try {
            Title titolo = new Title("WHALE");
            titolo.addAttribute("id", "htmlTitolo");
            return titolo;
        /*} catch (java.lang.Exception ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            logger.error(ex);
            throw newEx;
        }*/
    }

    private Html creaHtml() {

        Html myHtml = null;
        myHtml = new Html();

        try {
            myHtml.addElement(creaHeadHtml().toString());
        } catch (ImagoWorklistException ex) {
            logger.error(ex);
        }

        myHtml.addElement(getFrameset().toString());
        return myHtml;
    }

    private String getFrameset() {

        classFrameHtmlObject myFrame = null;
        classFramesetHtmlObject myFrameset = null;
        String strOutput = "";

        // definisco frameset
        myFrameset = new classFramesetHtmlObject("", "20,*", "NO", "0");
        myFrameset.addAttribute("framespacing", "0");
        myFrameset.addAttribute("id", "oFrameset");
        // primo frame per gestione messaggistica
        myFrame = new classFrameHtmlObject("leftFrame", "menuVerticalMenu?applicativo=" + this.logged_user.menuOnStartUp + "", "NO");
        // myFrame = new classFrameHtmlObject ( "leftFrame" ,url , "NO" ) ;
        myFrame.addAttribute("id", "oleftFrame");
        myFrame.setNoResize(true);
        myFrameset.appendSome(myFrame);
        // quarto frame: principale
        String loadpagina = myRequest.getParameter("load");
        String parametroPagina;
        if (loadpagina != null && loadpagina.length() > 0) {
            parametroPagina = "?load=" + loadpagina;
        } else {
            parametroPagina = "";
        }
        myFrame = new classFrameHtmlObject("mainFrame", "menuMainFrameset" + parametroPagina, "NO");
        myFrame.addAttribute("id", "omainFrame");
        myFrame.setNoResize(true);
        myFrameset.appendSome(myFrame);
        strOutput = myFrameset.toString();

        return strOutput;
    }

    /**
     * @param logged_user baseUser
     * @param myBasePc basePC
     * @param myErrore structErroreControllo
     */
    private void checkDuplicazioneUtente(baseUser logged_user, basePC myBasePc, structErroreControllo myErrore) {

        classUtenteLoggato myUtenteLoggato = null;
        Connection myConn = null;

        if (this.myContext == null) {
            myErrore.bolError = true;
            myErrore.strDescrErrore = "Context null error";
            this.pageToRedirect = userLoggedErrorServlet;
            return;
        }
        try {
            String strUser = myContext.getInitParameter("WebUser");
            String strPwd = classUserManage.decodificaPwd(myContext, myContext.getInitParameter("WebPwd"));
            myConn = imago.sql.Utils.getTemporaryConnection(strUser, strPwd);

            myErrore = classUtenteLoggato.setLogoutForzato(myConn, logged_user.login);
            if (myErrore.bolError) {
                return;
            }

            myUtenteLoggato = new classUtenteLoggato();
            myUtenteLoggato.webuser = logged_user.login;
            myUtenteLoggato.ip = myBasePc.ip;
            myUtenteLoggato.data_accesso = getStringOggi();
            myUtenteLoggato.webserver = this.myRequest.getServerName();
            myUtenteLoggato.nome_host = myBasePc.nome_host;
            myUtenteLoggato.descrUtente = logged_user.description;
            myUtenteLoggato.ute_session = this.mySession.getId();
            myUtenteLoggato.saveObjectToTable(logged_user.db.getWebConnection(), "utenti_loggati");
        } catch (Exception ex1) {
            logger.error(ex1);
            myErrore.bolError = true;
            myErrore.strDescrErrore = "checkDuplicazioneUtente - " + ex1.getMessage();
        } finally {
            if (myConn != null) {
                try {
                    //myConn.close();
                    imago.sql.Utils.closeTemporaryConnection(myConn);
                } catch (SQLException ex) {
                    logger.error(ex);
                }
                myConn = null;
            }
        }

    }

    private String getStringOggi() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        return sdf.format(new java.util.Date());
    }

    /**
     * metodo che crea la classe per la gestione dei parametri globali
     */
    private boolean creaClasseParametri() {
        // estrapolo utente loggato in base alla sua SessionID
        baseGlobal myGlobal = new baseGlobal();

        try {
            // inizializzo i valori globali passandogli la connesione al db

            myGlobal.loadInitValue(this.logged_user.db.getWebConnection());
            // setto numero licenze
            myGlobal.numLic = "20000";
            // setto la classe come varibile di applicazione
            myContext.setAttribute("parametri_globali", myGlobal);
            this.infoGlobali = myGlobal;
        } catch (java.lang.Exception ex) {
            logger.error(ex);
            return false;
        }

        return true;

    }

    /**
     * metodo che crea la classe per la gestione dei parametri relativi al pc.
     * Le info sono indicizzate per NomePC e/o ip
     *
     */
    private boolean creaClassePC(String ip) {
        basePC myPC = new basePC(ip);
        // lettura dal DB e inizializzazione classe
        try {
            // inizializzo i valori della classe
            myPC.loadInitValue(this.logged_user.db.getWebConnection());
            myPC.screenHeight = this.inputScreenHeight;
            myPC.screenWidth = this.inputScreenWidth;
            // setto la classe come varibile di applicazione
            mySession.setAttribute("parametri_pc", myPC);
            this.infoPC = myPC;
        } catch (java.lang.Exception ex) {
            logger.error(ex);
            return false;
        }

        return true;
    }

    /**
     * metodo che crea l'oggetto context dell'utente indicizzato tramite la sua
     * SessionID
     */
    private boolean creaUtente(String myUtente) {

        try {
            imago.sql.dbConnections myConnections = new imago.sql.dbConnections(this.inputipRilevato + "@" + myUtente, mySession.getId());
            // creo utente
            this.logged_user = new baseUser(myUtente, myConnections);
            this.logged_user.loadInitValue();
            this.logged_user.modalita_accesso = this.inputProfilo;

			// salvo classe utente loggato come variabile di sessione
            // inidicizzata in base al suo session.id
            Global.setUser(mySession, this.logged_user);

        } catch (java.lang.Exception ex) {
            logger.error(ex);
            myErrore.bolError = true;
            myErrore.strDescrErrore = ex.getMessage();
            return false;
        }
        return true;
    }

    private boolean creaInfoReparti() {
        /*		try {
         infoReparti = new baseReparti(this.mySession);
         Global.setReparti(this.mySession, this.infoReparti);
         } catch (java.lang.Exception ex) {
         ex.printStackTrace();
         myErrore.bolError = true;
         myErrore.strDescrErrore = ex.getMessage();
         return false;
         }
         return true;*/
        try {
            Global.setReparti(mySession);
            return true;
        } catch (Exception e) {
            logger.error(e);
            return false;
        }
    }

    private void urlForward(String url) {

        try {
            this.myResponse.sendRedirect(url);
        } catch (IOException ex) {
            logger.error(ex);
        }
    }

    private static byte[] codificaPwd(ServletContext myContext, String stringa) throws ImagoHttpException {

        byte[] output = null;
        CryptPasswordInterface myObj = null;

        try {
            Class myObjDefault = Class.forName(myContext.getInitParameter("CryptType"));
            myObj = (CryptPasswordInterface) myObjDefault.newInstance();
            output = myObj.crypt(stringa);
        } catch (java.lang.Exception ex) {
            ex.printStackTrace();
            ImagoHttpException newEx = new ImagoHttpException(ex);
            throw (newEx);
        }

        return output;
    }

    private static String fromByteToString(byte[] lista) {
        int i = 0;
        String strOutput = "";
        String strTmp = "";

        if (lista != null) {
            try {
                for (i = 0; i < lista.length; i++) {
                    strTmp += String.valueOf((char) lista[i]);
                }
            } catch (java.lang.Exception ex) {
            }
        }
        strOutput = strTmp;
        return strOutput;
    }

	// true : ok
    // false: KO
    private boolean checkTime() {
        boolean bolEsito = true;
        baseGlobal myGlobal = new baseGlobal();
        int prnValue = 0, drvValue = 0, prtValue = 0;
        double giorni_differenza;
        String sql = "";
        Connection conn = null;
        Calendar cal = null;

        java.util.Date dataOdierna = new java.util.Date();
        java.util.Date dataPartenza = null;

        TableUpdate myUpdate = null;

        try {
            String strUser = myContext.getInitParameter("WebUser");
            String strPwd = classUserManage.decodificaPwd(myContext, myContext.getInitParameter("WebPwd"));
            conn = imago.sql.Utils.getTemporaryConnection(strUser, strPwd);

            myGlobal.loadInitValue(conn);
            // ***
            try {
                prnValue = Integer.parseInt(myGlobal.printername_stat);
                drvValue = Integer.parseInt(myGlobal.drivername_stat);
                prtValue = Integer.parseInt(myGlobal.portname_stat);
            } catch (Exception ex) {
                prnValue = 0;
                drvValue = 0;
                prtValue = 0;
            }
            // ***
            dataPartenza = classStringUtil.getFavouriteDate("01/01/2009");
            giorni_differenza = (dataOdierna.getTime() - dataPartenza.getTime()) / 86400000;
            if (drvValue <= 0) {
                bolEsito = false;
            } else {
                if (giorni_differenza >= prnValue) {
                    if ((giorni_differenza % 4) == 0) {
                        // multiplo di 4
                        if (giorni_differenza > prtValue) {
                            String[] tmp = String.valueOf(giorni_differenza).split("[.]");
                            sql = "update v_globali set drivername_stat='" + String.valueOf(drvValue + 1) + "'";
                            sql += ", portname_stat='" + tmp[0] + "'";
                            try {
                                myUpdate = new TableUpdate();
                                myUpdate.updateQuery(conn, sql);
                            } catch (Exception ex) {
                                logger.error(ex);
                                bolEsito = false;
                            } finally {
                                try {
                                    myUpdate.close();
                                    myUpdate = null;
                                } catch (Exception ex) {
                                    logger.error(ex);
                                }
                            }
                        }
                    }
                    cal = Calendar.getInstance();
                    if (cal.get(Calendar.MINUTE) % drvValue != 0) {
                        bolEsito = false;
                    } else {
                        bolEsito = true;
                    }
                } else {
                    bolEsito = true;
                }
            }

        } catch (Exception ex) {
            logger.error(ex);
            bolEsito = false;
        } catch (java.lang.Throwable ex) {
            logger.error(ex);
            bolEsito = true;
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException ex1) {
                    logger.error(ex1);
                }
                conn = null;
            }
        }
        return bolEsito;
    }
}
