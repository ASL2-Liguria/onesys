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
 * CGroupManager.java
 *
 * Created on 10 giugno 2005, 16.38
 */

package GestioneGruppi;

import imago.GestioneWorklist.generateWorklist;
import imago.a_sql.CLogError;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;

import java.util.ArrayList;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Classe per la costruzione del codice <B>HTML</B> che serve per la gestione dei
 * Gruppi; la finestra permetterà di gestire l' inserimento, la modifica, la
 * cancellazione e la visualizzazione delle informazioni dei gruppi
 * @author MAZZORAN Andrea
 * @version 1.0.0.1
 */
public class CGroupManager
{
    private ServletContext context = null;
    private HttpSession session = null;
    private HttpServletRequest request = null;

    private CLogError log = null;
    private baseUser logged_user = null;

    /**
     * Metodo costruttore della classe CGroupManager
     */
    public CGroupManager(CLogError log, baseUser logged_user, HttpSession session, ServletContext context, HttpServletRequest request)
    {
        this.session = session;
        this.context = context;
        this.log = log;
        this.logged_user = logged_user;
        this.request = request;
    }

    public String creaWorklist()
    {
        String pagina = "";
        Hashtable hashDati = new Hashtable();
        Hashtable hashHeader = new Hashtable();
        String select = null;
        select = "where deleted = 'N' order by cod_dec";
        String illumina = "illumina(this.sectionRowIndex);";
        ArrayList lista_nomi_campi_array = new ArrayList();
        ArrayList lista_nomi_array = new ArrayList();
        lista_nomi_campi_array.add("iden");
        lista_nomi_campi_array.add("cod_dec");
        lista_nomi_campi_array.add("descr");
        lista_nomi_campi_array.add("cod_ope");
        lista_nomi_campi_array.add("permissioni_tabelle");

        lista_nomi_array.add("iden");
        lista_nomi_array.add("cod_dec");
        lista_nomi_array.add("descr");
        lista_nomi_array.add("cod_ope");
        lista_nomi_array.add("permissioni_tabelle");
        try
        {
            generateWorklist worklist = new generateWorklist(this.logged_user, "WK_GRUPPI", "TIPO_WK", null, hashDati, hashHeader, 1, select, lista_nomi_campi_array, lista_nomi_array, illumina, this.log, "", "");

            worklist.setNomeTabellaLabel("SL_GroupManager");
            worklist.setFormPage("form_hidden", "SL_InsModGroup", "form_hidden", "SL_InsModGroup", "POST");
            /*
                Campi nascosti della worklist per poter fare la ricerca durante la paginazione
             */
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "hCodDec", "");
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "hDescr", "");
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "hCodOpe", "");
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "hpermissioni_tabelle", "");
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "hOpe", "");
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "hiden_group", "");

            worklist.setNumberForms(1);

            String campi_input = "<input value='' name='cod_gruppo'  type='hidden'>\n";
            campi_input += "<input value='' name='descr_gruppo'  type='hidden'>\n";
            campi_input += "<input value='' name='cod_ope'  type='hidden'>\n";
            campi_input += "<input value='' name='permissioni_tabella'  type='hidden'>\n";
            worklist.setForms("form_info", "SL_Group_Info", "form_info", "win_info", "POST", campi_input);

            ArrayList funzioni = new ArrayList();
            ArrayList label = new ArrayList();
            worklist.creaHeader("label_titolo", funzioni, label, "");
            worklist.addContextMenu(this.logged_user, "Gruppi", this.session);
            funzioni.clear();
            label.clear();
            worklist.creaFooter(funzioni, label);

            pagina = worklist.creaPagina(this.getClass().getName(), this.session, this.context, this.request); //baseRetrieveBaseGlobal.getBaseGlobal(this.context, this.session)
        }
        catch(Exception e)
        {
            e.printStackTrace();
            this.log.writeError("GestioneGruppi.CGroupManager.creaWorklist(): " + e.getMessage());
        }
        return pagina;
    }
}
/*worklist.addLinkJs("std/jscript/Utilita/GestioneGruppi/groupManager.js*std/jscript/tutto_schermo.js");
         worklist.addLinkCss("std/css/gesUtenti/AN_groupinfo.css");*/
