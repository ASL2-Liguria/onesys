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
package configura_ricerca.html.ricerca_pazienti;

import imago.a_sql.CLogError;
import imago.http.classFrameHtmlObject;
import imago.http.classFramesetHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.baseClass.baseUser;
import imago.util.CVarContextSession;
import imagoAldoUtil.classStringUtil;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Html;
import org.apache.ecs.html.Title;

import configura_ricerca.exception.ConfiguraRicercaException;

/**
 *
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 *
   tipo_ricerca = 1: COGN,NOME,DATA; 2:NUMERO NOSOLOGICO
   rf1 = righe frame 1
   rf2 = righe frame 2
   rf3 = righe frame 3
   provenienza
   servlet_call_after?????

 *
 * <p>Copyright: </p>
 *
 * <p>Company: </p>
 *
 * @author elenad
 * @version 1.0
 */
public class CRicercaPazientiFrameset {
    private HttpSession session = null;
    private HttpServletRequest request = null;
    private ServletContext context = null;
    private CLogError log = null;
    private baseUser logged_user = null;

    public CRicercaPazientiFrameset() {
    }

    /**
     *
     * @param request HttpServletRequest
     * @param session HttpSession
     * @param context ServletContext
     */
    public CRicercaPazientiFrameset(HttpServletRequest request, HttpSession session, ServletContext context) {
        this.request = request;
        this.session = session;
        this.context = context;
    }

    /**
     *
     * @throws ConfiguraRicercaException
     */
    private void getVarContextSession() throws ConfiguraRicercaException {
        CVarContextSession var_cs = new CVarContextSession(this.session, this.context);
        this.logged_user = var_cs.getBaseUser();

        try
        {
            log = new CLogError(logged_user.db.getWebConnection(), request, "CRicercaPazientiFrameset", logged_user.login);
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".getVarContextSession():ERRORE CREAZIONE OGGETTO LOG " + e.getMessage());
        }
        log.setClassName(this.getClass().getName());
        log.setFileName("CRicercaPazientiFrameset.java");
        log.writeLog("Inizio CRicercaPazientiFrameset", CLogError.LOG_DEBUG);
    }

    /**
     *
     * @return String
     * @throws ConfiguraRicercaException
     */
    private String creaPaginaHtml() throws ConfiguraRicercaException {
        Title titolo = null;
        classMetaHtmlObject MetaTag = null;
        classFrameHtmlObject frame = null;
        classFramesetHtmlObject frameset = null;
        classHeadHtmlObject testata = null;
        Document document = null;
        String servlet = null;
        String righeFrames = null;
        String rf1 = null;
        String rf2 = null;
        String rf3 = null;
        String provenienza = null;
        String tipo_ricerca = null;
        String cogn_paz = null;
        String nome_paz = null;
        String data_paz = null;

        try
        {
            document = new Document();
            titolo = new Title("Ricerca Pazienti");
            testata = new classHeadHtmlObject();
            MetaTag = new classMetaHtmlObject();

            testata.addElement(titolo);
            testata.addElement(MetaTag);
            document.setHead(testata);

            rf1 = classStringUtil.checkNull(this.request.getParameter("rf1"));
            rf2 = classStringUtil.checkNull(this.request.getParameter("rf2"));
            rf3 = classStringUtil.checkNull(this.request.getParameter("rf3"));
            provenienza = classStringUtil.checkNull(this.request.getParameter("provenienza"));
            tipo_ricerca = classStringUtil.checkNull(this.request.getParameter("tipo_ricerca"));

            /*Variabili utilizzate per la gestione dei tabulatori della Prenotazione*/
            cogn_paz = classStringUtil.checkNull(this.request.getParameter("cogn_paz"));
            nome_paz = classStringUtil.checkNull(this.request.getParameter("nome_paz"));
            data_paz = classStringUtil.checkNull(this.request.getParameter("data_paz"));

            righeFrames = rf1 + "," + rf2 + "," + rf3;
            if(provenienza.equalsIgnoreCase("FromMenuVerticalMenu"))
                righeFrames += ",0";

            frameset = new classFramesetHtmlObject(righeFrames, "", "NO", "0");

            frameset.addAttribute("framespacing", "0");
            frameset.addAttribute("id", "oFramesetRicercaPaziente");

            /*
             PRIMO FRAME per la parte di ricerca
             */
            servlet = "SL_RicPazRicerca?provenienza=" + provenienza;
            servlet += "&tipo_ricerca=" + tipo_ricerca;
            servlet += "&cogn_paz=" + classStringUtil.checkNull(cogn_paz);
            servlet += "&nome_paz=" + classStringUtil.checkNull(nome_paz);
            servlet += "&data_paz=" + classStringUtil.checkNull(data_paz);

            frame = new classFrameHtmlObject("RicPazRicercaFrame", servlet, "NO");
            frame.addAttribute("id", "idRicPazRicercaFrame");
            frame.setNoResize(true);
            frameset.appendSome(frame);

            /*
             SECONDO FRAME contenente i risultati della ricerca del primo frame
             */
            //servlet = "SL_RicPazWorklist?provenienza=" + classStringUtil.checkNull(this.request.getParameter("provenienza"));
            //servlet += "&tipo_ricerca=" + classStringUtil.checkNull(this.request.getParameter("tipo_ricerca"));
            frame = new classFrameHtmlObject("RicPazWorklistFrame", "blank", "YES");
            frame.addAttribute("id", "idRicPazWorklistFrame");
            frame.setNoResize(true);
            frameset.appendSome(frame);

            /*
             TERZO FRAME se occorresse...
             */
            servlet = "blank";
            frame = new classFrameHtmlObject("RicPazUtilityFrame", servlet, "YES");
            frame.addAttribute("id", "idRicPazUtilityFrame");
            frame.setNoResize(true);
            frameset.appendSome(frame);

            /*QUARTO: contiene le info dell'esame*/
            if(provenienza.equalsIgnoreCase("FromMenuVerticalMenu"))
            {
                frame = new classFrameHtmlObject("worklistInfoEsame", servlet, "YES");
                frame.addAttribute("id", "idworklistInfoEsame");
                frame.setNoResize(true);
                frameset.appendSome(frame);
            }

            document.setHtml(new Html(frameset.toString()));
        }
        catch(Exception e)
        {
            this.log.writeLog(this.getClass().getName() + ".creaPaginaHtml(): " + e.getMessage(), CLogError.LOG_ERROR);
            throw new ConfiguraRicercaException(this.getClass().getName() + ".creaPaginaHtml(): " + e.getMessage());
        }
        return document.toString();
    }

    /**
     *
     * @return String
     * @throws ConfiguraRicercaException
     */
    public String creaFrameset() throws ConfiguraRicercaException {
        String frameset = new String("");
        try
        {
            this.getVarContextSession();
            frameset = creaPaginaHtml();
        }
        catch(Exception e)
        {
            this.log.writeLog(this.getClass().getName() + ".creaFrameset(): " + e.getMessage(), CLogError.LOG_ERROR);
            throw new ConfiguraRicercaException(this.getClass().getName() + ".creaFrameset(): " + e.getMessage());
        }
        return frameset;
    }

}
