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
package stampe.multi;

import cartellaclinica.cartellaPaziente.Visualizzatore.openDocument.CreaDocHtml;
import core.Global;
import imago.a_util.CContextParam;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import java.util.Enumeration;
import java.util.Hashtable;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.ecs.Document;

public class elabStampaMultiEngine {

    HttpSession mySession;
    ServletContext myContext;
    HttpServletRequest myRequest;
    String requestIden = "", funzioChiamata = "", chiaSorgernte = "", requestAnteprima = "";
    CContextParam myContextParam = null;
    private basePC infoPC;
//	private baseWrapperInfo	myBaseInfo =null;
    private baseUser logged_user;
    private Hashtable<String, String> tabellaRichieste = null;
    ElcoLoggerInterface logger = null;

    public elabStampaMultiEngine() {
        this.logger = new ElcoLoggerImpl(this.getClass().getName() + ".class");
    }

    /**
     * costruttore della classe
     *
     * @param myInputSession HttpSession sessione chiamante
     * @param myInputContext ServletContext
     * @param myInputRequest HttpServletRequest
     */
    public elabStampaMultiEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest, CContextParam myConteParam) {
        // inizializzazione engine della worklist
        super();
        try {
            mySession = myInputSession;
            myContext = myInputContext;
            myRequest = myInputRequest;
            myContextParam = myConteParam;
            logged_user = Global.getUser(mySession);
            tabellaRichieste = getObjectForm(myRequest);
            this.logger = new ElcoLoggerImpl(this.getClass().getName() + ".class");
        } catch (Exception ex) {

        }
    }

    public Document creaHtml() throws Exception {
        Document Doc = null;
        String n_copie = "";
        String Stampante = "";

        infoPC = (basePC) mySession.getAttribute("parametri_pc");

        /*		myBaseInfo 	= new baseWrapperInfo(this.logged_user, this.infoGlobali,this.infoPC);

		new baseSessionAndContext(myContext,mySession);*/
        this.logger.info("init - ElabStampa");
        /* recupero dalla request determinati parametri : nomi report e parametri report
			 * riempo gli array splittando per ;*/
        n_copie = tabellaRichieste.get("numCopie");

        CreaDocHtml DocHtml = new CreaDocHtml();
        try {
            this.logger.debug("Creo HTML con ActiveX di stampa");
            requestAnteprima = tabellaRichieste.get("stampaAnteprima");
            Stampante = infoPC.printername_ref_client;
            Doc = DocHtml.creaDocumentoHtml(getUrlPdf(), n_copie, requestAnteprima, Stampante);
        } catch (Exception ex) {
            this.logger
                    .error("Eccezione nella creazione della pagina html di stampa",
                            ex);
        }
        return Doc;
    }

    public static Hashtable<String, String> getObjectForm(HttpServletRequest myRequest) {
        int i = 0;
        Enumeration<String> paramNames = null;
        Hashtable<String, String> myHash = null;
        // log.writeInfo("Inizializzazione dei Parametri di Stampa");
        i = myRequest.getParameterMap().size();
        if (i > 0) {
            paramNames = myRequest.getParameterNames();
            myHash = new Hashtable<String, String>();
            while (paramNames.hasMoreElements()) {
                String parm = paramNames.nextElement();
                myHash.put(parm, myRequest.getParameter(parm));
            }
        }
        return myHash;
    }

    public String getUrlPdf() {
        String pdfUrl = "";
        try {
            /* recupero dalla request determinati parametri : nomi report e parametri report
			 * riempo gli array splittando per ;*/

            pdfUrl = Global.getBaseUrl() + "ServletStampeMulti?webUser="
                    + this.logged_user.login + "&idenRicovero="
                    + tabellaRichieste.get("idenRicovero");

            this.logger.info("PDF URL: " + pdfUrl);

        } catch (Exception ex) {

            pdfUrl = "";
        }
        return pdfUrl;
    }

    public static String getStaticUrlPdf(HttpServletRequest myInputRequest) {
        String pdfUrl = "";
        try {
            /* recupero dalla request determinati parametri : nomi report e parametri report
			 * riempo gli array splittando per ;*/
            String idenRicovero = myInputRequest.getParameter("idenRicovero");
            String userName = myInputRequest.getParameter("userName");
            String numerazione = myInputRequest.getParameter("numerazione");
            pdfUrl = Global.getBaseUrl() + "ServletStampeMulti?webUser="
                    + userName + "&idenRicovero="
                    + idenRicovero + "&numerazione=" + numerazione;

        } catch (Exception ex) {

            pdfUrl = "";
        }
        return pdfUrl;
    }

}
