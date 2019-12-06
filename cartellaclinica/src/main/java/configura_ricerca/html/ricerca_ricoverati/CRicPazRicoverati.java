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
 * CRicPazWorklist.java
 *
 * Created on 20 ottobre 2005, 14.24
 */

package configura_ricerca.html.ricerca_ricoverati;

import imago.GestioneWorklist.generateWorklist;
import imago.a_sql.CLogError;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.baseUser;
import imago.sql.AnagraficaRemota;
import imago.sql.AnagraficaRemotaException;
import imago.sql.TableColumn;
import imago.util.CVarContextSession;
import imagoAldoUtil.classStringUtil;
import imagoCreateWk.classTabDimColByUer;
import imagoCreateWk.classTabJsArrayWk;

import java.util.ArrayList;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import processClass.classElaboraReadOnly;
import configura_ricerca.exception.ConfiguraRicercaException;
import java.util.Date;

/**
 *
 * @author elenad
 */
public class CRicPazRicoverati
{
    private HttpServletRequest request = null;
    private HttpSession session = null;
    private ServletContext context = null;
    private baseUser logged_user = null;
    //private basePC pc = null;
    private baseGlobal v_globali = null;
    private CLogError log = null;
    private String select = null;

    private String tipo_wk = null;
    private String nome_vista = null;
    private String hidManualOrderAsc = null;
    private String hidManualOrderDesc = null;
    private String applicativo = null;
    private String inputNomeCampoToResize = "", inputFieldWidthToResize = "";


    //private ElcoLoggerInterface logInterface =  new ElcoLoggerImpl(listDocumentLabEngine.class);

    /**
     *
     */
    public CRicPazRicoverati()
    {
    }

    /**
     *
     * @param request
     *           HttpServletRequest
     * @param context
     *           ServletContext
     * @param session
     *           HttpSession
     * @param log
     *           CLogError
     */
    public CRicPazRicoverati(HttpServletRequest request, ServletContext context, HttpSession session, CLogError log) throws ConfiguraRicercaException
    {
        this.request = request;
        this.context = context;
        this.session = session;
        this.log = log;
        this.log.setClassName(this.getClass().getName());

        getVarContextSession();

        this.tipo_wk = classStringUtil.checkNull(this.request.getParameter("tipo_wk"));
        this.nome_vista = classStringUtil.checkNull(this.request.getParameter("nome_vista"));

        if(classStringUtil.checkNull(this.request.getParameter("provenienza")).equals("ripristino_cancellati"))
        {
            this.tipo_wk = "WK_RIC_PAZ_RIPRISTINO_CANCELLATI";
            this.nome_vista = "VIEW_WK_ANAG_RIPR_CANC";
        }

        this.hidManualOrderAsc = this.request.getParameter("hidManualOrderAsc");
        this.hidManualOrderDesc = this.request.getParameter("hidManualOrderDesc");
        this.applicativo = this.request.getParameter("applicativo");

        this.inputNomeCampoToResize = classStringUtil.checkNull(request.getParameter("hidNomeCampoToResize"));
        this.inputFieldWidthToResize = classStringUtil.checkNull(request.getParameter("hidWidthFieldToResize"));
        classTabDimColByUer.controlloRidimensionamentoColonna(this.logged_user, this.inputNomeCampoToResize, this.inputFieldWidthToResize, this.tipo_wk);

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

          //modifica Dario (se viene passato il filtro dei reparti selezionati aggiorno baseUser
            String rep=(String) this.request.getParameter("filtro_reparti");
            if(rep!=null && !rep.equals("")){
            	this.logged_user.setFieldValue("FILTRO_REPARTI_WK", rep);
                this.logged_user.filtro_reparti_wk=rep;
            }

            //this.pc = var_cs.getBasePC();
            log.setClassName(this.getClass().getName());
            log.setFileName("CRicPazWorklist.java");

            this.v_globali = var_cs.getBaseGlobal();
        }
        catch(Exception e)
        {
            this.log.writeLog(this.getClass().getName() + ".getVarContextSession(): " + e.getMessage(), CLogError.LOG_ERROR);
            throw new ConfiguraRicercaException(this.getClass().getName() + ".getVarContextSession(): " + e.getMessage());
        }
    }

    /**
     *
     * @return String
     * @throws ConfiguraRicercaException
     */
    public String worklist_pazienti() throws ConfiguraRicercaException
    {
        return crea_worklist_pazienti();
    }

    /**
     * Metodo che genera la parte di worklist ottenuta dalla ricerca anagrafica
     *
     * @return
     */
    private String crea_worklist_pazienti() throws ConfiguraRicercaException
    {
//        System.out.println("[START] crea_worklist_pazienti() ...");
//        Date dateIN = new Date();
        
        String tab_elem_menudd_procedura = null;
        String illumina = null;
        String wk = null;
        String pag = null;
        int pagina_da_vis = 1;
        int indietro = 0;
        int avanti = 0;
        int num_record_remoti = 0;
        /* Campo che indica se la ricerca verrà effettuata in locale o in remoto */
        String ricerca_anagrafica = "-1";
        generateWorklist worklist = null;
        classTabJsArrayWk myTabJsArrayWk = null;
        Hashtable listaVettoriJS = new Hashtable();

        Hashtable hashDati = new Hashtable();
        Hashtable hashHeader = new Hashtable();
        ArrayList lista_nomi_campi_array = null;
        ArrayList lista_nomi_array = null;
        ArrayList funzioni = new ArrayList();
        ArrayList label = new ArrayList();

        try
        {
            pag = this.request.getParameter("pagina_da_vis");

            try
            {
                pagina_da_vis = Integer.parseInt(pag);
            }
            catch(Exception e)
            {
                pagina_da_vis = 1;
            }

            this.select = crea_where_condition();

            //num_record_remoti = checkNomeWorklistNomeVista();

            illumina = "illumina(this.sectionRowIndex);";

            /*
             * Il campo READONLY va trattato in modo particolare con il TD
             * colorato:
             * rosso = readonly
             * giallo = record modificabile
             */
            hashDati.put("urgenza", new classElaboraReadOnly());

            /*
             * Devo filtrare le ricerche remote in base alla sessione dell'utente
             * loggato tranne quella dei ricoverati di WHALE
             */
            if(!classStringUtil.checkNull(this.applicativo).equals("WHALE"))
            {
                if(this.tipo_wk.indexOf("REMOTA") != -1)
                {
                    if(classStringUtil.checkNull(select).equals(""))
                    {
                        select += " where user_session = '" + this.session.getId() + "' ";
                    }
                    else
                    {
                        select += " and user_session = '" + this.session.getId() + "' ";
                    }
                }
            }

            worklist = new generateWorklist(logged_user, this.tipo_wk, "TIPO_WK", null, hashDati, hashHeader, pagina_da_vis, this.select, lista_nomi_campi_array, lista_nomi_array, illumina, this.log, this.hidManualOrderAsc, this.hidManualOrderDesc);

            myTabJsArrayWk = new classTabJsArrayWk(this.logged_user, this.tipo_wk);
            listaVettoriJS = myTabJsArrayWk.getJsInfo();

            worklist.setAndEnableResizeElementForColumn("idResizeElementForColumn");

            worklist.setRetrieveArrayJs(listaVettoriJS);

            worklist.setOrderCondition(this.request.getParameter("hidOrder"));

            //worklist.setBaseInformazioni();

            worklist.setNomeTabellaLabel("CRicPazWorklist");

            label.add("titolo");

            worklist.setFormPage("form", "", "form", "", "POST");
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "pagina_da_vis", String.valueOf(pagina_da_vis));
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "provenienza", classStringUtil.checkNull(this.request.getParameter("provenienza")));
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "tipo_wk", classStringUtil.checkNull(this.request.getParameter("tipo_wk")));
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "nome_vista", classStringUtil.checkNull(this.request.getParameter("nome_vista")));
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "hidWhere", classStringUtil.checkNull(this.request.getParameter("hidWhere")));
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "hidOrder", classStringUtil.checkNull(this.request.getParameter("hidOrder")));
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "permissioni", this.logged_user.cod_ope);

            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "NOME", classStringUtil.checkNull(this.request.getParameter("NOME")));
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "COGN", classStringUtil.checkNull(this.request.getParameter("COGN")));
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "DATA", classStringUtil.checkNull(this.request.getParameter("DATA")));
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "NUM_NOSOLOGICO", classStringUtil.checkNull(this.request.getParameter("NUM_NOSOLOGICO")));

            if(classStringUtil.checkNull(this.request.getParameter("provenienza")).equalsIgnoreCase("worklistRichieste") || classStringUtil.checkNull(this.request.getParameter("provenienza")).equalsIgnoreCase("ripristino_cancellati") || classStringUtil.checkNull(this.request.getParameter("provenienza")).equalsIgnoreCase("RiconciliaSpostaEsami"))
            {
                ricerca_anagrafica = "1"; //ricerca in locale
            }
            else
            { //&& num_record_remoti != -1 && num_record_remoti != 0
                if((this.v_globali.ricerca_anagrafica.equals("1") || this.v_globali.ricerca_anagrafica.equals("2") || this.v_globali.ricerca_anagrafica.equals("3")))
                {
                    ricerca_anagrafica = "2"; //ricerca in remoto
                }
                else
                {
                    ricerca_anagrafica = "1"; //ricerca in locale
                }
            }

            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "ricerca_anagrafica", ricerca_anagrafica);

            /*
             * try
             * {
             * provenienze = new
             * classProvenienza(this.logged_user.db.getDataConnection(),
             * String.valueOf(this.logged_user.provenienza_login_iden));
             * provenienze_data = provenienze.getData(0);
             *
             * cdc = new CCentriDiCosto(this.logged_user.db.getDataConnection());
             * cod_cdc = cdc.getCodCDC(provenienze_data.CDC);
             * worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN,
             * "hcdc", classStringUtil.checkNull(cod_cdc));
             * }
             * catch(Exception e)
             * {
             * this.log.writeError(this.getClass().getName() +
             * ".crea_worklist_pazienti():creazione campo hcdc " + e.getMessage());
             * throw new ConfiguraRicercaException(this.getClass().getName() +
             * ".crea_worklist_pazienti(): " + e.getMessage());
             * }
             */

            worklist.creaHeader("titolo", funzioni, label, "");

            /* Gestione delle funzioni per la paginazione */
            indietro = pagina_da_vis - 1;
            funzioni.add("indietro(" + indietro + ");");
            avanti = pagina_da_vis + 1;
            funzioni.add("avanti(" + avanti + ");");
            label.add("indietro");
            label.add("avanti");
            worklist.creaAvantiIndietro("indietro(" + indietro + ");", "avanti(" + avanti + ");", "indietro", "avanti");
            funzioni.clear();
            label.clear();

            tab_elem_menudd_procedura = check_context_menu();
            worklist.addContextMenu(logged_user, tab_elem_menudd_procedura, this.session);
            /*Inserisco il nome della form della worklist per poter effettuare l'ordinamento manuale*/
            worklist.addVarManualOrder("form");
            worklist.addBottomJS(this.campi_hidden());

            try
            {
                wk = worklist.creaPagina(this.getClass().getName(), session, context, request);
         //       wk = wk.concat("<script>$(document).ready(function(){funzione();});</script>");
            }
            catch(Exception e)
            {
                this.log.writeError(this.getClass().getName() + ".crea_worklist_pazienti():" + e.getMessage());
                throw new ConfiguraRicercaException(this.getClass().getName() + ".crea_worklist_pazienti(): " + e.getMessage());
            }
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".crea_worklist_pazienti(): " + e.getMessage());
        }
        
//        Date dateOUT = new Date();
//        
//        long diff = dateOUT.getTime() - dateIN.getTime();
//        long milliseconds = diff % 1000;
//	long seconds = diff / 1000 % 60;
//	long minutes = diff / (60 * 1000) % 60;
//	//long hours = diff / (60 * 60 * 1000) % 24;        
//        System.out.println("[END] crea_worklist_pazienti(): [MINUTI] " + minutes + " [SECONDI] " + seconds + " [MILLISECONDI] " + milliseconds);
        
        return wk;
    }

    /**
     * Funzione che genera la where condition da passare alla classe che genera
     * una worklist
     * valorizzata quando viene premuto il pulsante 'Applica' dalla parte di
     * ricerca
     *
     * @return where condition (più eventuale order by)
     */
    private String crea_where_condition() throws ConfiguraRicercaException
    {       
        String where_condition = "";
        String hidWhere = null;

        try
        {
            hidWhere = this.request.getParameter("hidWhere");
            if(hidWhere != null)
            {
                where_condition = hidWhere;
            }

            /*
             * if(where_condition.equalsIgnoreCase("")){
             * where_condition = " where iden = -100";
             * }
             */
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".crea_where_condition(): " + e.getMessage());
        }
              
        return where_condition;
    }

    /**
     *
     * @return int
     * @throws ConfiguraRicercaException
     */
    private int ricerca_in_locale() throws ConfiguraRicercaException
    {
        Date dateIN = new Date();
        
        int record_trovati = 0;
        TableColumn trs = null;

        if(!classStringUtil.checkNull(this.select).equals("") && !classStringUtil.checkNull(this.select).equalsIgnoreCase("where iden = '-100'"))
        {
            trs = new TableColumn();
            try
            {
                record_trovati = trs.getNumberRows(this.logged_user.db.getDataConnection(), "SELECT * FROM " + nome_vista + " " + this.select);
            }
            catch(Exception e)
            {
                this.log.writeError(this.getClass().getName() + ".ricerca_in_locale(): " + e.getMessage());
                throw new ConfiguraRicercaException(this.getClass().getName() + ".ricerca_in_locale(): " + e.getMessage());
            }
            finally
            {
                try
                {
                    trs.close();
                    trs = null;
                }
                catch(Exception e)
                {
                    throw new ConfiguraRicercaException(this.getClass().getName() + ".ricerca_in_locale(): " + e.getMessage());
                }
            }
        }
        else
        {
            record_trovati = -1;
        }
        
        Date dateOUT = new Date();
        
        long diff = dateOUT.getTime() - dateIN.getTime();
        long milliseconds = diff % 1000;
	long seconds = diff / 1000 % 60;
	long minutes = diff / (60 * 1000) % 60;
	//long hours = diff / (60 * 60 * 1000) % 24;        
        System.out.println("Tempo di elaborazione di ricerca_in_locale(): [MINUTI] " + minutes + " [SECONDI] " + seconds + " [MILLISECONDI] " + milliseconds);
        
        return record_trovati;
    }

    /**
     *
     * @return int
     * @throws ConfiguraRicercaException
     */
    private int ricerca_in_remoto() throws ConfiguraRicercaException
    {
        Date dateIN = new Date();
        
        short num_record = -1;
        Class classe = null;
        AnagraficaRemota obj = null;
        int tipoRicercaAnagraficaUtente = 0;

         try{
            classe = Class.forName(v_globali.classeAnagraficaRemota);
            obj = (AnagraficaRemota) classe.newInstance();

            try{
               tipoRicercaAnagraficaUtente = Integer.parseInt(this.logged_user.tipo_ricerca_anagrafica);

               obj.setServletContext(this.context);
               obj.setUserSession(this.session.getId());
               obj.setConnections(this.logged_user.db);

               obj.RimuoviDati();

               /*0: ricerca per cognome, nome e data
                 7: ricerca per cognome, nome e data su WHALE*/
               if(tipoRicercaAnagraficaUtente == 0 || tipoRicercaAnagraficaUtente == 7){

                   if(!classStringUtil.checkNull(this.request.getParameter("COD_FISC")).equals("")){
                           if(!classStringUtil.checkNull(this.request.getParameter("NOME")).equals("") || !classStringUtil.checkNull(this.request.getParameter("COGN")).equals("") || !classStringUtil.checkNull(this.request.getParameter("DATA")).equals("") || !classStringUtil.checkNull(this.request.getParameter("COD_FISC")).equals("")){
                           num_record = obj.RicercaPerNomeCognomeDataCodiceFiscale(this.request.getParameter("NOME"), this.request.getParameter("COGN"), this.request.getParameter("DATA"), this.request.getParameter("COD_FISC"));
                        }
                   }
                   else{

                  if(!classStringUtil.checkNull(this.request.getParameter("NOME")).equals("") || !classStringUtil.checkNull(this.request.getParameter("COGN")).equals("") || !classStringUtil.checkNull(this.request.getParameter("DATA")).equals("")){
                     num_record = obj.RicercaPerNomeCognomeData(this.request.getParameter("NOME"), this.request.getParameter("COGN"), this.request.getParameter("DATA"));
                  }
                   }
               }
               else{
                  if(tipoRicercaAnagraficaUtente == 1){
                     num_record = obj.RicercaPerCodiceFiscale(this.request.getParameter("COD_FISC"));
                  }
                  else
                     if(tipoRicercaAnagraficaUtente == 4){
                        num_record = obj.RicercaPerNumeroNosologico(this.request.getParameter("NUM_NOSOLOGICO"));
                     }
               }
            }
            catch(AnagraficaRemotaException e){
               this.log.writeError(this.getClass().getName() + ".ricerca_in_remoto(): AnagraficaRemotaException " + e.getMessage() + " Oggetto Remoto: " + obj);
               throw new ConfiguraRicercaException(this.getClass().getName() + ".ricerca_in_remoto(): " + e.getMessage());
            }
         }
         catch(Exception e){
            this.log.writeError(this.getClass().getName() + ".ricerca_in_remoto(): " + e.getMessage() + " oggetto CLASSE: " + classe);
            throw new ConfiguraRicercaException(this.getClass().getName() + ".ricerca_in_remoto(): " + e.getMessage());
         }
         
        Date dateOUT = new Date();
        
        long diff = dateOUT.getTime() - dateIN.getTime();
        long milliseconds = diff % 1000;
	long seconds = diff / 1000 % 60;
	long minutes = diff / (60 * 1000) % 60;
	//long hours = diff / (60 * 60 * 1000) % 24;        
        System.out.println("Tempo di elaborazione di ricerca_in_remoto(): [MINUTI] " + minutes + " [SECONDI] " + seconds + " [MILLISECONDI] " + milliseconds);
 
        
        return num_record;
    }

    /**
     * In GESTIONE_PARAMETRI where V_GLOBALI - ricerca_anagrafica
     *
     * 0: ricerca solo in locale
     * 1: ricerca locale + remota
     * 2: ricerca remota + locale
     * 3: ricerca remota
     *
     * @return numero di record trovati in remoto
     * @throws ConfiguraRicercaException
     */
    private int ricerca_anagrafica() throws ConfiguraRicercaException
    {
        Date dateIN = new Date();
        
        int num_record_remoti = 0;
        String nome_worklist = null;
        String nome_vista = null;
        int tipo_ricerca_anagrafica = 0;
        try
        {
            tipo_ricerca_anagrafica = Integer.parseInt(this.v_globali.ricerca_anagrafica);

            switch(tipo_ricerca_anagrafica)
            {
            case 0:
                nome_worklist = this.tipo_wk;
                nome_vista = this.nome_vista;
                break;

            case 1:
                if(this.ricerca_in_locale() == 0 && !classStringUtil.checkNull(this.applicativo).equals("WHALE"))
                {
                    nome_worklist = this.tipo_wk + "_REMOTA";
                    nome_vista = this.nome_vista + "_REMOTA";
                    num_record_remoti = this.ricerca_in_remoto();
                }
                else
                {
                    nome_worklist = this.tipo_wk;
                    nome_vista = this.nome_vista;
                }
                break;

            case 2:
                num_record_remoti = this.ricerca_in_remoto();
                if(num_record_remoti == 0)
                {
                    nome_worklist = this.tipo_wk;
                    nome_vista = this.nome_vista;
                }
                else
                {
                    nome_worklist = this.tipo_wk + "_REMOTA";
                    nome_vista = this.nome_vista + "_REMOTA";
                }
                break;

            case 3:
                nome_worklist = this.tipo_wk + "_REMOTA";
                nome_vista = this.nome_vista + "_REMOTA";
                num_record_remoti = this.ricerca_in_remoto();
                break;
            }

            this.tipo_wk = nome_worklist;
            this.nome_vista = nome_vista;
        }
        catch(Exception e)
        {
            this.log.writeError(this.getClass().getName() + ".ricerca_anagrafica(): " + e.getMessage());
            throw new ConfiguraRicercaException(this.getClass().getName() + ".ricerca_anagrafica(): " + e.getMessage());
        }
        
        Date dateOUT = new Date();
        
        long diff = dateOUT.getTime() - dateIN.getTime();
        long milliseconds = diff % 1000;
	long seconds = diff / 1000 % 60;
	long minutes = diff / (60 * 1000) % 60;
	//long hours = diff / (60 * 60 * 1000) % 24;        
        System.out.println("Tempo di elaborazione di ricerca_anagrafica(): [MINUTI] " + minutes + " [SECONDI] " + seconds + " [MILLISECONDI] " + milliseconds);

        
        return num_record_remoti;
    }

    /**
     *
     * @return int
     * @throws ConfiguraRicercaException
     */
    private int checkNomeWorklistNomeVista() throws ConfiguraRicercaException
    {
        int num_record_remoti = 0;
        try
        {
            num_record_remoti = this.ricerca_anagrafica();
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".checkNomeWorklistNomeVista(): " + e.getMessage());
        }
        return num_record_remoti;
    }

    /**
     * Metodo per richiamare il context_menu coerente con chi chiama la ricerca
     * del paziente
     *
     * @return TAB_ELEM_MENUDD.procedura
     */
    private String check_context_menu() throws ConfiguraRicercaException
    {
        String context_menu = "";
        //AccettaPrenotaRichieste richieste = null;

        try
        {
            if(this.select.equals("where iden = '-100'"))
            {
                context_menu = "FromMenuVerticalMenuNoInsert";
            }
            else
            {
                context_menu = classStringUtil.checkNull(this.request.getParameter("provenienza"));

                /*
                 * if(context_menu.equalsIgnoreCase("worklistRichieste"))
                 * {
                 * richieste = (AccettaPrenotaRichieste)
                 * getAttr("accettazione_prenotazione_richieste");
                 * context_menu = "worklistRichieste" +
                 * richieste.tipo_registrazione;
                 * }
                 * else
                 * {
                 */
                if(!this.v_globali.ricerca_anagrafica.equals("0") && this.tipo_wk.indexOf("REMOTA") != -1)
                {
                    context_menu += "Remote";
                }
                //}
            }
        }
        catch(Exception e)
        {
            throw new ConfiguraRicercaException(this.getClass().getName() + ".check_context_menu(): " + e.getMessage());
        }

        if(classStringUtil.checkNull(context_menu).equals(""))
        {
            context_menu = "MENU_EMPTY";
            System.out.println("Menu Ricerca Paziente vuoto");
        }
        return context_menu;
    }

    /**
     *
     * @return String
     * @throws ConfiguraRicercaException
     */
    private String campi_hidden() throws ConfiguraRicercaException
    {
        String form = "";
        imago.util.CTabForm tab_form = null;
        try
        {
            tab_form = new imago.util.CTabForm(this.logged_user, "RICERCA_ANAGRAFICA");
            form = tab_form.get();
        }
        catch(Exception e)
        {
            this.log.writeError(this.getClass().getName() + ".campi_hidden(): = GESTIONE_ANAGRAFICA " + e.getMessage());
            throw new ConfiguraRicercaException(this.getClass().getName() + ".campi_hidden(): GESTIONE_ANAGRAFICA " + e.getMessage());
        }
        return form;
    }

}
