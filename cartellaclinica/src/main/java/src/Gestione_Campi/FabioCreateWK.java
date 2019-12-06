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
 * generateWorklist.java
 *
 * Created on 18 gennaio 2006, 14.31
 */
package src.Gestione_Campi;


import imago.a_sql.CLogError;
import imago.http.ImagoHttpException;
import imago.http.classDataTable;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWorklistField;
import imago.http.baseClass.baseWrapperInfo;
import imago.sql.TableResultSet;
import imagoAldoUtil.classMenuFactory;
import imagoAldoUtil.classTabExtFiles;
import imagoCreateWk.IprocessDataTable;
import imagoUtils.classJsObject;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Vector;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;


/**
 * Classe per la creazione della pagina contenente la worklist
 * @author elenad
 */
public class FabioCreateWK extends imagoCreateWk.classWk{
    private baseUser logged_user = null;
    private String nome_worklist = null;
    private String tabTipo_wk = null;
    private String vettoreCampiPersonali [] = null;
    private Hashtable hashDati = null;
    private Hashtable hashHeader = null;
    private CLogError log = null;
    private boolean SeChiamato=false;
    private String select = null;
    private int numero_pagine;
    private ArrayList lista_nomi_campi_array = null;
    private ArrayList lista_nomi_array = null;
    private String nome_funzione = null;
    private String Illuminapred="";
    private Document document  = null;
    private Body     corpoHtml = null;
    private classHeadHtmlObject testata = null;
    private classDivHtmlObject div = null;
    private HttpServletRequest req = null;
    /*form della pagina*/
    private classFormHtmlObject form = null;
    private classMenuFactory            context_menu;
    /*Indica il numero di operazioni del menu di contesto*/
    private int elementi_context_menu = 0;
    /*Nome della tabella contentuta nella tabella imagoweb.lingue per le label*/
    private String nome_tabella_label = null;
    /*Link di un file js o css da aggiungere all'elemento classHeadHtmlObject del documento*/
    private String link_js = null;
    private String link_css = null;
    private String header = null;
    private String footer = null;
    private String script = null;
    /*contiene il nome della form della worklist su cui effettuare l'ordinamento manuale*/
    private String nome_form_manual_order = null;
    /*ArrayList contenente eventualmente number_forms di form aggiuntive a quella contenente la worklist*/
    private ArrayList forms = null;
//    private classContextMenu menuContesto = null;
    private ServletContext myContext;
    /*campo utilizzato per aggiungere una colonna non contenuta nel db*/
    private baseWorklistField colonna_info = null;
    private IprocessDataTable nome_classe_elabora_colonna = null;

    private IprocessDataTable myInterface = null;
    /*Se questo campo è diverso da "" significa che è stato richiamato dalla Gestione delle Richieste
     contiene gli array js creati per gestire le informazioni della richiesta*/
    private String script_info = "";
    private String call_setArrayFormInfoRichieste = null;
    private baseWrapperInfo bWI= null;
    /*Gestione pulsanti Avanti Indietro nella paginazione*/
    private String funzione_indietro = null;
    private String funzione_avanti = null;
    private String label_indietro = null;
    private String label_avanti = null;
    private baseGlobal         v_globali;
    private int numero_pagine_totali = 0;
    public String ProJS_RollOver="";
    public String ProJS_RollOut="";
    public String FileJS_Illumina="";
    private String title = null;
    /*Indica l'elemento div contenente la legenda dello Stato dell'esame*/
    private String div_legenda_stato = null;
    private String web_data="web";
    /** Creates a new instance of generateWorklist */
    public FabioCreateWK() {
    }

    /**
     * Costruttore la costruzione di una worklist utilizzando la classe di Aldo:
     * @param nome_worklist Nome della worklist contenuto nel campo del db nella tabella imago_web.tipo_wk.tipo_wk
     * @param logged_user oggetto di tipo baseUser
     * @param tabTipo_wk nome tabella che contiene il tipo di worklist
     * @param vettoreCampiPersonali è un array con le chiavi (TAB_CAMPI_WK.KEYCAMPO) dei campi NON obbligatori da visualizzare
     * @param hashtableElaboratore hashtable delle classi che modificano un determinato campo
     * @param hashtableHeaderElaboratore hashtable delle classi che modificano la testata di un determinato campo
     * @param numero_pagine numero della pagina da visualizzare
     * @param select select contenente la where condition
     * @param lista_nomi_campi_array  lista dei nomi dei campi nella tabella o nella vista che contengono i valori con cui
     *                          si vogliono riempire gli array js. Tali campi devono essere inseriti
     *                          nell'elenco dei campi da visualizzare nella tabella tab_campi_wk.nome_campo ed
     *                          il campo tab_campi_wk.obbligatorio deve valere 'N' per affinchè non venga visualizzato
     * @param lista_nomi_array arrayList contenente i nomi degli eventuali array che si vogliono vengano restituiti
     *                                dalla worklist
     * @param nome_funzione indica il nome della funzione con eventuale parametro che viene chiamata alla
     * scaturazione dell'evento onClick sulla worklist
     *
     */
    public FabioCreateWK(baseUser logged_user, String nome_worklist, String tabTipo_wk, String [] vettoreCampiPersonali, Hashtable hashtableElaboratore, Hashtable hashtableHeaderElaboratore, int numero_pagine, String select, ArrayList lista_nomi_campi_array, ArrayList lista_nomi_array, String nome_funzione, CLogError log, String hidManualOrderAsc, String hidManualOrderDesc, baseGlobal v_glob) {
        this.logged_user = logged_user;
        this.hashDati = hashtableElaboratore;
        this.hashHeader = hashtableHeaderElaboratore;
        this.nome_worklist = nome_worklist;
        this.tabTipo_wk = tabTipo_wk;
        this.vettoreCampiPersonali = vettoreCampiPersonali;
        this.v_globali=v_glob;
        this.select = select;
        this.numero_pagine = numero_pagine;
        this.lista_nomi_array = lista_nomi_array;
        this.lista_nomi_campi_array = lista_nomi_campi_array;
        this.nome_funzione = nome_funzione;

        this.log = log;
        this.log.setClassName("src.Gestione_Campi.FabioCreateWK");
    }

    /**
     * Metodo per la creazione dell'header della worklist
     * @param nome_label_header indica il nome della label contenuta nella tabella lingue
     * @param nome_funzioni elenco dei nomi delle funzioni collegate ai pulsanti
     * @param nome_label_pulsanti nome delle label dei pulsanti
     * @param stringa aggiuntiva eventuale stringa da aggiungere al titolo dell'header
     * @throws ImagoHttpException Eccezione sugli elementi html che estende quella generale di Imago
     */
    public void creaHeader(String nome_label_header, ArrayList nome_funzioni, ArrayList nome_label_pulsanti, String stringa_aggiuntiva){
        try{
            classTabHeaderFooter header = null;
            classLabelHtmlObject label_titolo = new classLabelHtmlObject("", "", nome_label_header);
            header = new classTabHeaderFooter(label_titolo + stringa_aggiuntiva);
            if(nome_funzioni.size() > 0){
                for(int i = 0; i < nome_funzioni.size(); i++){
                    classDivButton button_pulsante = new classDivButton("", "pulsante", "javascript:" + nome_funzioni.get(i), nome_label_pulsanti.get(i).toString(),"");
                    header.addColumn("classButtonHeader", button_pulsante.toString());
                }
            }
            this.header =  header.toString();
        }
        catch(Exception e){
            this.log.writeLog("creaHeader(): " + e, CLogError.LOG_ERROR);
        }
    }


    /*
     *throws ImagoHttpException
     */
    public void creaAvantiIndietro(String funzione_indietro, String funzione_avanti, String label_indietro, String label_avanti) {
        try{
            this.funzione_avanti = funzione_avanti;
            this.funzione_indietro = funzione_indietro;
            this.label_avanti = label_avanti;
            this.label_indietro = label_indietro;
        }

        catch(Exception e){
            this.log.writeLog("creaAvantiIndietro(param): " + e, CLogError.LOG_ERROR);
        }
    }

    /*
     *throws ImagoHttpException
     */
    private String creaFooterAvantiIndietro() {
        String footer_av_ind = "";
        try{
            classTabHeaderFooter footer =  new classTabHeaderFooter(" ");
            footer.setClasses("classTabHeader","classTabFooterSx","classTabHeaderMiddle","classTabFooterDx");
            if(this.numero_pagine_totali < this.numero_pagine){
                this.numero_pagine = this.numero_pagine - 1;
                this.funzione_indietro = "indietro("+(this.numero_pagine-1)+");";
            }
            if(this.numero_pagine_totali == 0 || this.numero_pagine_totali == this.numero_pagine && (this.numero_pagine -1 == 0)){//this.getNumPagineTotali()
            }
            else
                if(this.numero_pagine_totali == this.numero_pagine){
                    footer_av_ind = "";
                    classDivButton button_pulsante_ind = new classDivButton("", "pulsante", "javascript:" + this.funzione_indietro, this.label_indietro, "");
                    footer.addColumn("classButtonHeader", button_pulsante_ind.toString());
                }
                else
                    if(this.numero_pagine_totali > this.numero_pagine && this.numero_pagine != 1){
                        classDivButton button_pulsante_ind = new classDivButton("", "pulsante", "javascript:" + this.funzione_indietro, this.label_indietro, "");
                        footer.addColumn("classButtonHeader", button_pulsante_ind.toString());
                        classDivButton button_pulsante_av = new classDivButton("", "pulsante", "javascript:" + this.funzione_avanti, label_avanti,"");
                        footer.addColumn("classButtonHeader", button_pulsante_av.toString());
                    }
                    else {//if(this.numero_pagine_totali != 0)
                        footer_av_ind = "";
                        classDivButton button_pulsante_av = new classDivButton("", "pulsante", "javascript:" + this.funzione_avanti, label_avanti,"");
                        footer.addColumn("classButtonHeader", button_pulsante_av.toString());
                    }
            footer_av_ind = footer.toString();
        }
        catch(Exception e){
            this.log.writeLog("imago.GestioneWorklist.generateWorklist.creaAvantiIndietro(): " + e, CLogError.LOG_ERROR);
        }
        return footer_av_ind;
    }


    /**
     * Metodo per settare il nome della tabella in imagoweb.lingue che contiene le
     * label da utilizzare nella pagina della worklist
     * @param nome_tabella_label contiene il nome della tabella su cui vi sono le label della pagina
     */
    public void setNomeTabellaLabel(String nome_tabella_label) {
        this.nome_tabella_label = nome_tabella_label;
    }

    /**
     * Metodo per aggiungere un file js alla pagina
     * @param link_js stringa contenente il percorso del file
     */
    public void addLinkJs(String link_js) {
        this.link_js = link_js;
    }

    /**
     * Metodo per creare la form della pagina (eventualmente:in quanto posso mettere tutto dentro il
     * body per poter creare la worklist di Aldo)
     * @param name nome della form
     * @param action nome della servlet
     * @param id id della form
     * @param target indica dove verrà aperta la pagina richiamata nell'action
     * @param method POST o GET
     * @throws ImagoHttpException Eccezione sugli elementi html che estende quella generale di Imago
     */
    public void setFormPage(String name, String action, String id, String target, String method){
        try{
            form = new classFormHtmlObject(name, action, method, target);
            if(id != null && !id.equalsIgnoreCase(""))
                form.addAttribute("id", id);
        }
        catch(Exception e){
            this.log.writeLog(" setFormPage(): " + e, CLogError.LOG_ERROR);
        }
    }

    /**
     * Metodo da settare con il numero di form che si vogliono aggiungere a quella
     * della worklist.Indica il numero di elementi dentro l'arrayList forms che contiene le fomrs
     * aggiuntive
     * @param number Numero di form che si vogliono aggiungere alla pagina contenente la worklist
     */
    public void setNumberForms(int number){
        this.forms = new ArrayList(number);
    }

    /**
     * Metodo per aggiungere alla form dei campi(nascosti)
     * @param type tipo del campo
     * @param name nome campo di input
     * @param value valore
     * @throws ImagoHttpException Eccezione sugli elementi html che estende quella generale di Imago
     */
    public void addInputElementToForm(String type, String name, String value){
        try{
            classInputHtmlObject in = new classInputHtmlObject(type, name, value);
            form.appendSome(in);
        }
        catch(Exception e){
            this.log.writeLog(" addInputElementToForm(): " + e, CLogError.LOG_ERROR);
        }
    }


    /**
     * Metodo per aggiungere il menù di contesto alla pagina contenente la worklist
     * @return il parametro di ritorno indica se il metodo è stato richiamato o meno.
     * Se è uguale a zero alla pagina non aggiungerò il menù di contesto, in caso
     * contrario verrà aggiunto (=1);
     * @param procedura
     * @param logged_user oggetto baseUser che indica l'utente loggato
     * @throws ImagoHttpException Eccezione sugli elementi html che estende quella generale di Imago
     */
    public int addContextMenu(baseUser logged_user, String procedura, HttpSession session){
        elementi_context_menu = 1;
        try{
            context_menu = new classMenuFactory(logged_user, procedura, session);

        }
        catch(Exception e){
            this.log.writeLog(" addContextMenu(): " + e, CLogError.LOG_ERROR);
        }
        return elementi_context_menu;
    }

    /**
     * Metodo per settare il title della pagina contenente la worklist
     * @param title stringa contenente il title della finestra
     */
    public void setTitle(String title){
        this.title = title;
    }


    /**
     * Metodo da richiamare per la creazione della pagina contenente la worklist
     * @throws ImagoHttpException Eccezione sugli elementi html che estende quella generale di Imago
     * @return pagina contenente la worklist e tutti gli elementi per gestirla
     */
    public String creaPagina(){
        try{
            document = new Document();
            testata = new classHeadHtmlObject();
            if (myContext != null)
            {
            	testata.addElement(classTabExtFiles.getIncludeString(logged_user, "", this.getClass().getName(), this.myContext));
            	testata.addElement(classTabExtFiles.getIncludeString(logged_user, "", "Default", this.myContext));
            }
            else
            {
            testata.addCssLink("std/css/normalBody.css");
            testata.addCssLink("std/css/headerTable.css");
            testata.addCssLink("std/css/button.css");
            testata.addCssLink("std/css/dataTable.css");
            testata.addCssLink("std/css/dataEntryTable.css");
            testata.addCssLink("std/css/filterTable.css");
            testata.addCssLink("std/css/ContextMenu.css");
            testata.addCssLink("std/css/urgentColor.css");
            testata.addJSLink("std/jscript/fillLabels.js");
            testata.addJSLink("std/jscript/colori_selezione.js");
            testata.addJSLink("std/jscript/contextMenu.js");
            testata.addCssLink("std/css/updownArrow.css");
            testata.addJSLink("std/jscript/manualOrder.js");
            }
            /*
             css e js per la gestione dell'ordinamento manuale;
             in aggiunta vedi campo in imagoweb.TIPO_WK.en_ordina_manuale
             */
           

            /*contiene tutto ciò che serve per la selezione di una riga*/
            if (!FileJS_Illumina.equalsIgnoreCase(""))
            testata.addJSLink(FileJS_Illumina);
        else
            testata.addJSLink("std/jscript/worklist/al_selRiga.js");

            if(this.link_css != null){
                String elenco_file_css [] = this.link_css.split("[*]");
                if(elenco_file_css.length > 0)
                    for(int i = 0; i < elenco_file_css.length; i++)
                        testata.addCssLink(elenco_file_css[i]);
            }
            if(this.link_js != null){
                String elenco_file_js [] = this.link_js.split("[*]");
                if(elenco_file_js.length > 0)
                    for(int i = 0; i < elenco_file_js.length; i++)
                        testata.addJSLink(elenco_file_js[i]);
            }

            div = new classDivHtmlObject("div","display='block'");

            if(this.title != null)
                testata.addElement(new Title(this.title));

            document.setHead(testata);
            classJsObject label_js = new classJsObject();
            String jsLabel = null;
            jsLabel = label_js.getArrayLabel(this.nome_tabella_label, this.logged_user);
            document.appendHead(jsLabel);

            corpoHtml = new Body();

            String onload = "javascript:fillLabels(arrayLabelName,arrayLabelValue);";
            corpoHtml.addAttribute("onLoad", onload);
            corpoHtml.addAttribute("class","body;");

            /*CREAZIONE LAYOUT*/
            if(this.header != null)
                corpoHtml.addElement(this.header);

            div.appendSome(creaWorklist());

            this.numero_pagine_totali = this.getNumPagineTotali();
            this.setRecordPerPagina(10);
            int recperpag=this.getNumRecordPerPagina();

            corpoHtml.addElement(div.toString());
            if(this.footer != null){
                corpoHtml.addElement(this.footer);
            }

            if(this.funzione_avanti != null && this.label_avanti != null){
                corpoHtml.addElement(creaFooterAvantiIndietro());
            }

            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "num_tot_pag", String.valueOf(this.numero_pagine_totali)));
            form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "num_rec_per_pag", String.valueOf(recperpag)));

//            if(this.hidManualOrderAsc == null)
//                this.hidManualOrderAsc = "";
//            if(this.hidManualOrderDesc == null)
//                this.hidManualOrderDesc = "";
            //form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hidManualOrderAsc", this.hidManualOrderAsc));
            //form.appendSome(new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "hidManualOrderDesc", this.hidManualOrderDesc));
            //        /*
            //        codice per aggiungere il menu contestuale alla sola tabella contenente i record della worklist
            //         */
            //            if (context_menu != null && menuContesto != null){
            //                    corpoHtml.addElement(menuContesto.toString());
            //            }

            corpoHtml.addElement(form.toString());
            corpoHtml.addElement(addAbbContext());
            /*aggiungo form aggiuntive*/
            if(this.forms != null){
                if(this.forms.size() !=  0){
                    for(int i = 0; i < forms.size(); i ++)
                        corpoHtml.addElement(this.forms.get(i).toString());
                }
            }

            if(this.script != null)
                corpoHtml.addElement(this.script);

            if(this.nome_form_manual_order != null)
                corpoHtml.addElement(this.nome_form_manual_order);

            String menuContesto = null;
            if(this.elementi_context_menu == 1)
                menuContesto = context_menu.getMenuTendina(corpoHtml);
            if (context_menu != null){
                corpoHtml.addElement(menuContesto);
            }


            if (SeChiamato)
            {corpoHtml.addElement(Illuminapred);}
            document.setBody(corpoHtml);

            if(this.div_legenda_stato != null)
                document.getBody().addElement(div_legenda_stato);


            /*Creazione del div nascosto per gestire il tooltip delle informazioni delle Richieste*/
            if(call_setArrayFormInfoRichieste != null)
                document.getHtml().addElement("<div id='dek' class='DEK'></div>");
        }
        catch(Exception e){
            this.log.writeLog(" creaPagina(): " + e, CLogError.LOG_ERROR);
        }
        return(document.toString());
    }




    /**
     * Metodo che ritorna la stringa contenente la worklist
     * @throws ImagoHttpException Eccezione sugli elementi html che estende quella generale di Imago
     * @return worklist aldo
     */
    private String creaWorklist(){
        String elenco_array_js = null;
        String strTitoliTabellaDati = null;
        classDataTable tabella_worklist = null;
        try{
        	this.bWI= new baseWrapperInfo(this.logged_user, this.v_globali, null,this.req.getSession(), this.myContext, this.req);
        	this.setBaseInfo(bWI);
            this.init(logged_user.db.getWebConnection(), logged_user.lingua, this.nome_worklist , this.tabTipo_wk, vettoreCampiPersonali, hashDati,hashHeader, numero_pagine);
            if(this.nome_worklist.equalsIgnoreCase("T_WEB") || this.nome_worklist.equalsIgnoreCase("T_PC") ||
            this.nome_worklist.equalsIgnoreCase("WK_GRUPPI"))
                this.setConnessioneDati(this.logged_user.db.getWebConnection());
            else
                this.setConnessioneDati(this.logged_user.db.getWebConnection());

            if(this.colonna_info != null)
                this.addColumn(colonna_info, this.nome_classe_elabora_colonna, myInterface, true);//new classElaboraInformazioni()

            if (web_data.equalsIgnoreCase("data"))
            {this.setConnessioneDati(this.logged_user.db.getDataConnection());}
            if(select == null)
                select = " where iden = -100";
            /*All'apertura della pagina voglio che nn ci siano record visualizzati*/
            this.setWhereCondition(this.select);
            //System.out.println(select);

            /*setto ordine manuale se è stato richiesto*/
//            if(this.hidManualOrderAsc != null && !this.hidManualOrderAsc.equalsIgnoreCase(""))
//                this.setManualOrderWk(this.hidManualOrderAsc, "ASC");
//            else
//                if(this.hidManualOrderDesc != null && !this.hidManualOrderDesc.equalsIgnoreCase(""))
//                    this.setManualOrderWk(this.hidManualOrderDesc, "DESC");

            /*
             setto gestione rollover riga
             */
            if (!ProJS_RollOver.equalsIgnoreCase(""))
                this.addAttributeEveryRow("onMouseOver","javascript:rowSelect_over_illumina(this.sectionRowIndex);");
             else
                    this.addAttributeEveryRow("onMouseOver","javascript:rowSelect_over(this.sectionRowIndex);");

        if (!ProJS_RollOut.equalsIgnoreCase(""))
         this.addAttributeEveryRow("onMouseOut",ProJS_RollOut);
            else
            this.addAttributeEveryRow("onMouseOut","javascript:rowSelect_out(this.sectionRowIndex);");

            strTitoliTabellaDati = this.creaTitoliTabellaDati().toString();
            Hashtable lista_vettori_js = new Hashtable();
            for(int i = 0; i < this.lista_nomi_array.size(); i++)
                lista_vettori_js.put(this.lista_nomi_campi_array.get(i), this.lista_nomi_array.get(i));

            this.setRetrieveArrayJs(lista_vettori_js);

            tabella_worklist = this.creaTabellaWorklist(null, null);

            //chiamare  setArrayFormInfoRichieste
            if(call_setArrayFormInfoRichieste != null)
                setArrayFormInfoRichieste();

            //            /*
            //              codice per aggiungere il menu contestuale alla sola tabella contenente i record della worklist
            //             */
            //            if(this.elementi_context_menu == 1 && context_menu != null)
            //                menuContesto = (classContextMenu) context_menu.getMenuTendina(tabella_worklist);



            elenco_array_js = this.getArrayJs();
        }
        catch(ImagoHttpException ex){

           this.log.writeLog(" creaWorklist(): " + ex.getMessage(), CLogError.LOG_ERROR);
       }

        catch(Exception e){
            this.log.writeLog(" creaWorklist(): " + e, CLogError.LOG_ERROR);
        }
        return(strTitoliTabellaDati + tabella_worklist + elenco_array_js + script_info);
    }


    /**
     * Metodo da sovrascrivere della classe ereditata che indica cosa avviene con la
     * scaturazione dell'evento onClick
     * @return stringa contenente il metodo illumina
     */
    public String illumina() {
        return "javascript:" + this.nome_funzione;
    }
    public void setRequest(HttpServletRequest reqin) {
        this.req=reqin;
    }
    public String illuminapre() {
        SeChiamato=true;

        Illuminapred="<SCRIPT> illumina(0); </SCRIPT>";
        return Illuminapred;
    }

    public String addAbbContext(){
           StringBuffer sb= new StringBuffer();
           try{

               sb.append(classJsObject.javaClass2jsClass((Object)this.logged_user));
              sb.append("<SCRIPT>\n");
              sb.append("initbaseUser();");
              sb.append("</SCRIPT>");

           }
           catch(Exception e){
               this.log.writeLog(" addBottomJS(): " + e, CLogError.LOG_ERROR);
           }
           return sb.toString();
    }

    /**
     * Metodo che fa la select sul db per costuire gli array contenenti le informazioni
     * da visualizzare nel tooltip delle informazioni (Gestione Richieste)
     * @throws ImagoHttpException eccezione
     * @return l'array chiamato array_informazioni (che è a 2 dimensioni) che contene l'elenco
     *         delle informazioni riguardanti la richiesta selezionata
     */
    private String setArrayFormInfoRichieste(){
        try{
            Vector vector = this.getFieldArray("IDEN");
            if(vector != null && vector.size() > 0){

                String array_js_info = "var array_informazioni = new Array(" + vector.size() + ");\n";

                for(int i = 0; i < vector.size(); i++){
                    String esami_prenotati = "";
                    String medico_prescrittore = "";
                    String operatore_richiedente = "";
                    String operatore_controllo = "";
                    String query = "select med_richiedente, TR.ute_controllo, TE.descr, TR.descr_op_rich ";
                    query += " from infoweb.testata_richieste TR, infoweb.dettaglio_richieste DR, radsql.tab_esa TE";
                    query += " where TR.iden = DR.iden_testata and DR.iden_tab_esa = TE.iden and TR.iden = ";
                    query += vector.get(i);
                    TableResultSet trs = new TableResultSet();
                    trs.getResultSet(this.logged_user.db.getDataConnection(), query);
                    while(trs.rs.next()){
                        esami_prenotati += trs.rs.getString(3) + "<br>";
                        medico_prescrittore = trs.rs.getString(1);
                        operatore_controllo = trs.rs.getString(2);
                        operatore_richiedente = trs.rs.getString(4);
                    }
                    array_js_info += "array_informazioni[" + i + "] = new Array('" + esami_prenotati + "', '" + medico_prescrittore + "', '" + operatore_richiedente + "', '" + operatore_controllo + "');\n";
                    trs.close();
                }
                script_info = "\n\n<SCRIPT>\n" + array_js_info + "\n</SCRIPT>\n\n";
            }
        }
        catch(Exception e){
            this.log.writeLog(" setArrayFormInfoRichieste(): " + e, CLogError.LOG_ERROR);
        }
        return script_info;
    }
    public void setSrvContext(ServletContext inputContext)
    {
    	this.myContext=inputContext;
    }
    

}
