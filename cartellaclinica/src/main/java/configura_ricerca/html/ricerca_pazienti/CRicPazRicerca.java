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
import imago.http.classDataTable;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.baseUser;
import imago.util.CTabForm;
import imago.util.CVarContextSession;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import configura_ricerca.db.CConfiguraRicerca;
import configura_ricerca.db.CConfiguraRicercaDati;
import configura_ricerca.exception.ConfiguraRicercaException;
import generic.utility.html.HeaderUtils;

/**
 *
 * <p>
 * Title:
 * </p>
 *
 * <p>
 * Description:
 * </p>
 *
 * <p>
 * Copyright:
 * </p>
 *
 * <p>
 * Company:
 * </p>
 *
 * @author elenad
 * @version 1.0
 */
public class CRicPazRicerca
{
    private HttpSession session = null;
    private HttpServletRequest request = null;
    private ServletContext context = null;
    private baseUser logged_user = null;
    private CLogError log = null;
    private baseGlobal v_globali = null;

    private CConfiguraRicercaDati ricPazDati = null;
    private CConfiguraRicerca ricPaz = null;
    private String NOME_RICERCA = null;
    private String CAMPI = null;
    private String PULSANTI_LABEL = null;
    private String PULSANTI_FUNZIONIJS = null;
    private String TIPO_WK = null;
    private String NOME_VISTA = null;
    private String FUNZIONE_CARICA_WK = null;

    /** Creates a new instance of CRicPazRicerca */
    public CRicPazRicerca()
    {
    }

    /* Costruttore chiamato dalla servlet SL_RicPazRicerca */
    public CRicPazRicerca(HttpServletRequest request, HttpSession session, ServletContext context)
    {
        this.request = request;
        this.session = session;
        this.context = context;
    }

    /**
     *
     * @throws ConfiguraRicercaException
     */
    private void getVarContextSession() throws ConfiguraRicercaException
    {
        CVarContextSession var_cs = null;
        try
        {
            var_cs = new CVarContextSession(this.session, this.context);
            this.logged_user = var_cs.getBaseUser();
            this.v_globali = var_cs.getBaseGlobal();

            log = new CLogError(logged_user.db.getWebConnection(), request, "CRicPazRicerca", logged_user.login);
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".getVarContextSession():ERRORE CREAZIONE OGGETTO LOG " + e.getMessage());
        }
        log.setClassName(this.getClass().getName());
        log.setFileName("CRicPazRicerca.java");
        log.writeLog("Inizio CRicPazRicerca", CLogError.LOG_DEBUG);
    }

    /**
     *
     * @return String
     * @throws ConfiguraRicercaException
     */
    public String creaPagRic() throws ConfiguraRicercaException
    {
        Document document = null;
        classHeadHtmlObject testata = null;
        Body corpoHtml = null;
        classFormHtmlObject form = null;

        classDataTable table = null;

        classDivHtmlObject div = null;
        classJsObject label_js = null;
        classTabHeaderFooter header = null;

        String jsLabel = null;

        try
        {
            document = new Document();

            this.getVarContextSession();
            this.getRicerca();

            div = new classDivHtmlObject("div", "display='block'");
            form = new classFormHtmlObject("form_pag_ric", "", "POST", "");
            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hidWhere", ""));
            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hidOrder", ""));
            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "pagina_da_vis", ""));
            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "provenienza", classStringUtil.checkNull(this.request.getParameter("provenienza"))));
            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "tipo_wk", classStringUtil.checkNull(this.TIPO_WK)));
            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "nome_vista", classStringUtil.checkNull(this.NOME_VISTA)));
            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hidcampo0", ""));

            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hCOGN", classStringUtil.checkNull(this.request.getParameter("cogn_paz"))));
            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hNOME", classStringUtil.checkNull(this.request.getParameter("nome_paz"))));
            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hDATA", classStringUtil.checkNull(this.request.getParameter("data_paz"))));

            try
            {
                testata = HeaderUtils.createHeadWithIncludes(this.getClass().getName(), this.session);

                document.setHead(testata);
            }
            catch(Exception e)
            {
                this.log.writeError(this.getClass().getName() + ".creaPagRic(): errore include css, js " + e.getMessage());
                throw new ConfiguraRicercaException(this.getClass().getName() + ".creaPagRic(): errore include css, js " + e.getMessage());
            }

            label_js = new classJsObject();
            jsLabel = label_js.getArrayLabel("CRicPazRicerca", this.logged_user);
            document.appendHead(jsLabel);

            corpoHtml = new Body();

            corpoHtml.addAttribute("onLoad", "javascript:caricamento();");
            //corpoHtml.addAttribute("class", "body");

            header = new classTabHeaderFooter(this.NOME_RICERCA);

            table = new classDataTable("classDataEntryTable", ricPaz.getCampiRicerca(ricPazDati));

            form.appendSome(header.toString());
            div.appendSome(table.toString());
            form.appendSome(div.toString());

            form.appendSome(this.getFooter());

            corpoHtml.addElement(form.toString());

            corpoHtml.addElement(addBottomJScode());

            corpoHtml.addElement(campi_hidden());

            try
            {
                classJsObject.setNullContextMenuEvent(corpoHtml, this.logged_user);
                document.setBody(corpoHtml);
            }
            catch(Exception e)
            {
                this.log.writeError(this.getClass().getName() + ".creaPagRic(): " + e.getMessage());
                throw new ConfiguraRicercaException(this.getClass().getName() + ".creaPagRic(): " + e.getMessage());
            }
        }
        catch(Exception e)
        {
            this.log.writeError(this.getClass().getName() + ".creaPagRic(): " + e.getMessage());
            throw new ConfiguraRicercaException(this.getClass().getName() + ".creaPagRic(): " + e.getMessage());
        }
        return(document.toString());
    }

    /**
     *
     * @return String
     * @throws ConfiguraRicercaException
     */
    private String getFooter() throws ConfiguraRicercaException
    {
        classTabHeaderFooter footer = null;
        String elenco_pulsantiLabel[] = null;
        String elenco_pulsantiFunzioniJs[] = null;

        footer = new classTabHeaderFooter("&nbsp;");
        footer.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
        try
        {
            if(!this.PULSANTI_LABEL.equals(""))
            {
                elenco_pulsantiLabel = this.PULSANTI_LABEL.split("[@]");
                elenco_pulsantiFunzioniJs = this.PULSANTI_FUNZIONIJS.split("[@]");
                if(elenco_pulsantiLabel != null)
                {
                    for(int i = 0; i < elenco_pulsantiLabel.length; i++)
                    {
                        footer.addColumn("classButtonHeader", new classDivButton("", "pulsante", "javascript:" + elenco_pulsantiFunzioniJs[i], elenco_pulsantiLabel[i], "").toString());
                    }
                }
            }
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".getFooter(): " + e.getMessage());
        }
        return footer.toString();
    }

    /**
     *
     * @throws ConfiguraRicercaException
     *
    private void setCampiUtente(int tipoRicerca) throws ConfiguraRicercaException
    {
        String parametri[] = null;
        parametri = this.PARAMETRI.split("@");

        //logged_user.setFieldValue("LOADONSTARTUP", "SL_RicercaPazienteFrameset?rf1=" + parametri[0] + "&rf2=" + parametri[1] + "&rf3=" + parametri[2] + "&provenienza=FromMenuVerticalMenu");

        logged_user.setFieldValue("LOADONSTARTUP", "SL_RicercaPazienteFrameset?rf1=" + parametri[0] + "&rf2=" + parametri[1] + "&rf3=" + parametri[2] + "&provenienza="+classStringUtil.checkNull(this.request.getParameter("provenienza")));

        logged_user.setFieldValue("TIPO_RICERCA_ANAGRAFICA", String.valueOf(tipoRicerca));
        try
        {
            logged_user.loadInitValue();
        }
        catch(Exception e)
        {

        }
    }*/

    /**
     *
     * @throws ConfiguraRicercaException
     */
    private void getRicerca() throws ConfiguraRicercaException
    {
        String tipo_ricerca = null;
        /* Tipo di ricerca anagrafica per cognome, nome e data nascita */
        int tipoRicerca = Integer.parseInt(this.logged_user.tipo_ricerca_anagrafica);

        try
        {
            /*
             * tipo_ricerca: parametro passato dalla scelta della ricerca
             * effettuata dal menu verticale
             */
            tipo_ricerca = classStringUtil.checkNull(this.request.getParameter("tipo_ricerca"));
            if(!tipo_ricerca.equals(""))
            {
                tipoRicerca = Integer.parseInt(tipo_ricerca);
            }

            ricPaz = new CConfiguraRicerca(this.logged_user);
            ricPaz.loadData("TIPO_RICERCA = '" + tipoRicerca + "' AND MODULO = 'RICERCA_PAZIENTI'", true);
            ricPazDati = ricPaz.getData(0);

            this.CAMPI = classStringUtil.checkNull(ricPazDati.CAMPI);
            this.NOME_RICERCA = classStringUtil.checkNull(ricPazDati.NOME_RICERCA);
            this.PULSANTI_FUNZIONIJS = classStringUtil.checkNull(ricPazDati.PULSANTI_FUNZIONIJS);
            this.PULSANTI_LABEL = classStringUtil.checkNull(ricPazDati.PULSANTI_LABEL);
            this.TIPO_WK = classStringUtil.checkNull(ricPazDati.TIPO_WK);
            this.NOME_VISTA = classStringUtil.checkNull(ricPazDati.NOME_VISTA);
            this.FUNZIONE_CARICA_WK = classStringUtil.checkNull(ricPazDati.FUNZIONE_CARICA_WK);

/*            if(tipoRicerca != 8)
            	this.setCampiUtente(tipoRicerca);*/
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".creaPagRic(): " + e.getMessage());
        }
    }

    /**
     *
     * @return ArrayList
     * @throws ConfiguraRicercaException
     *
     *            private ArrayList getCampiRicerca() throws
     *            ConfiguraRicercaException{
     *            classColDataTable td = null;
     *            classRowDataTable tr = null;
     *            classInputHtmlObject in = null;
     *            classLabelHtmlObject label = null;
     *            ArrayList lista_colonne = null;
     *            ArrayList lista_righe = null;
     *
     *            String elenco_campi[] = null;
     *            String elenco_eventi[] = null;
     *            String elenco_funzionijs[] = null;
     *            String elenco_campiTipologia[] = null;
     *
     *            lista_colonne = new ArrayList();
     *            lista_righe = new ArrayList();
     *
     *            try{
     *            if(!this.CAMPI.equals("")){
     *            elenco_campi = this.CAMPI.split("[@]");
     *            elenco_eventi = this.NOME_EVENTO.split("[@]");
     *            elenco_funzionijs = this.FUNZIONI.split("[@]");
     *            elenco_campiTipologia = CAMPI_TIPOLOGIA.split("[@]");
     *
     *            for(int i = 0; i < elenco_campi.length; i++){
     *            label = new classLabelHtmlObject("", "", "L" +
     *            elenco_campi[i]);
     *            td = new imago.http.classColDataTable("TD", "", label);
     *            td.addAttribute("class", "classTdLabelNoWidth");
     *            lista_colonne.add(td);
     *
     *            in = new classInputHtmlObject(elenco_campiTipologia[i], "TXT" +
     *            elenco_campi[i], "", "30", "");
     *            in.addAttribute("id", "idcampo" + i);
     *
     *            try{
     *            in.addAttribute(elenco_eventi[i], "javascript:" +
     *            elenco_funzionijs[i]);
     *            }
     *            catch(Exception e){
     *            in.addAttribute("#", "javascript:#");
     *            }
     *
     *            td = new imago.http.classColDataTable("TD", "", in);
     *            td.addAttribute("class", "classTdField");
     *            lista_colonne.add(td);
     *
     *            tr = new classRowDataTable("", lista_colonne);
     *            lista_colonne.clear();
     *            lista_righe.add(tr);
     *            }
     *            }
     *            }
     *            catch(Exception e){
     *            throw new ConfiguraRicercaException(this.getClass().getName() +
     *            ".getCampiRicerca(): " + e.getMessage());
     *            }
     *            return lista_righe;
     *            }
     */

    /**
     *
     * @return String
     * @throws ConfiguraRicercaException
     */
    private String addBottomJScode() throws ConfiguraRicercaException
    {
        StringBuffer sb = new StringBuffer();
        try
        {
            if(this.CAMPI.indexOf("DATA") != -1)
            {
                /* Caso in cui c'e' un campo di tipo DATE nella parte di ricerca */
                sb.append("<SCRIPT>\n");
                sb.append("var oDateMask = new MaskEdit(\"dd/mm/yyyy\", \"date\");\n");
                sb.append("oDateMask.attach(document.form_pag_ric.DATA);\n");
                sb.append("</SCRIPT>");
            }
            sb.append(classJsObject.javaClass2jsClass(this.v_globali));
            sb.append(classJsObject.javaClass2jsClass(this.logged_user));

            sb.append("<SCRIPT>initbaseGlobal();initbaseUser();" + this.FUNZIONE_CARICA_WK + "</SCRIPT>");
        }
        catch(Exception e)
        {
            this.log.writeLog(this.getClass().getName() + ".addBottomJScode(): " + e.getMessage(), CLogError.LOG_ERROR);
            throw new ConfiguraRicercaException(this.getClass().getName() + ".addBottomJScode(): " + e.getMessage());
        }
        return sb.toString();
    }

    /**
     *
     * @return String
     */
    private String campi_hidden()
    {
        CTabForm tab_form = null;
        String form = "";
        try
        {
            tab_form = new CTabForm(this.logged_user, this.getClass().getName());
            form = tab_form.get();
        }
        catch(Exception e)
        {
            e.printStackTrace();
            this.log.writeError(this.getClass().getName() + ".campi_hidden():  --- " + e.getMessage());
        }
        return form;
    }

}
