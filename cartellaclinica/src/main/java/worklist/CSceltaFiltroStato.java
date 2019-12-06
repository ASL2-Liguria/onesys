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
/**
 *
 */
package worklist;

import imago.GestioneWorklist.generateWorklist;
import imago.a_sql.CLogError;
import imago.a_util.CClientParam;
import imago.a_util.CContextParam;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;

import java.util.ArrayList;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @author elenad
 *
 */
public class CSceltaFiltroStato
{
    private baseUser logged_user = null;
    private CContextParam context_param = null;
    private CClientParam client_param = null;
    private CLogError log = null;
    private String hidManualOrderAsc = "";
    private String hidManualOrderDesc = "";
    private ServletContext context = null;
    private HttpSession session = null;
    private HttpServletRequest request = null;

    /** Creates a new instance of CSceltaFiltroStato */
    public CSceltaFiltroStato()
    {
    }

    public CSceltaFiltroStato(baseUser logged_user, CClientParam client_param, CContextParam context_param, CLogError log, HttpSession session, ServletContext context, HttpServletRequest request)
    {
        this.logged_user = logged_user;
        this.client_param = client_param;
        this.context_param = context_param;
        this.log = log;
        this.session = session;
        this.context = context;
        this.request = request;
    }

    public String creaWorklist()
    {
        Hashtable hashDati = new Hashtable();
        Hashtable hashHeader = new Hashtable();

        ArrayList lista_nomi_campi_array = new ArrayList();
        ArrayList lista_nomi_array = new ArrayList();
        lista_nomi_campi_array.add("iden");
        lista_nomi_array.add("iden");
        lista_nomi_campi_array.add("valore_filtro");
        lista_nomi_array.add("valore_filtro");
        lista_nomi_campi_array.add("nome_filtro");
        lista_nomi_array.add("nome_filtro");
        lista_nomi_campi_array.add("webuser");
        lista_nomi_array.add("webuser");
        lista_nomi_campi_array.add("abilitato");
        lista_nomi_array.add("abilitato");
        lista_nomi_campi_array.add("where_cond_filtro");
        lista_nomi_array.add("where_cond_filtro");

        String select = " WHERE WEBUSER = '" + this.logged_user.login + "' ";

        this.hidManualOrderAsc = this.client_param.getParam("hidManualOrderAsc");
        this.hidManualOrderDesc = this.client_param.getParam("hidManualOrderDesc");

        Hashtable hashListPersonalOrderWk = logged_user.listPersonalOrderWk;
        ArrayList arrayListPersonalOrderWk = (ArrayList) hashListPersonalOrderWk.get("WK_FILTRO_STATO");

        if(arrayListPersonalOrderWk != null && arrayListPersonalOrderWk.size() == 0)
        {
            if(this.hidManualOrderDesc.equalsIgnoreCase("") && this.hidManualOrderAsc.equalsIgnoreCase(""))
            {
                select += " ORDER BY nome_filtro";
            }
        }

        String illumina = "illumina_multiplo_generica(this.sectionRowIndex);";

        generateWorklist worklist = new generateWorklist(logged_user, "WK_FILTRO_STATO", "TIPO_WK", null, hashDati, hashHeader, 1, select, lista_nomi_campi_array, lista_nomi_array, illumina, this.log, this.hidManualOrderAsc, this.hidManualOrderDesc);

        worklist.setTitle("Gestione Scelta Stati Esami");

        worklist.setNomeTabellaLabel("CSceltaFiltroStato");
        ArrayList funzioni = new ArrayList();
        ArrayList label = new ArrayList();
        String wk = "";
        try
        {
            worklist.creaHeader("lbl_titolo", funzioni, label, "");

            /*
             Context_menu
             */
            worklist.addContextMenu(logged_user, "scelta_filtro_stato", this.session);

            worklist.setFormPage("form", "", "form", "", "POST");

            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "tabFiltriStato_valore_filtro", "");
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "tabFiltriStato_nome_filtro", "");
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "tabFiltriStato_iden", "");
            worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "operazione", "");

            funzioni.clear();
            label.clear();

            String funzione = "";
            funzione += "var debug = '" + this.context_param.getParam("debug") + "';\n\n";
            worklist.addBottomJScode(funzione);

            funzioni.add("attiva()");
            label.add("attiva");
            funzioni.add("disattiva()");
            label.add("disattiva");
            funzioni.add("applica()");
            label.add("applica");
            funzioni.add("chiudi()");
            label.add("chiudi");
            worklist.creaFooter(funzioni, label);

            /*Inserisco il nome della form della worklist per poter effettuare l'ordinamento manuale*/
            worklist.addVarManualOrder("form");

            wk = worklist.creaPagina(this.getClass().getName(), this.session, this.context, request); //baseRetrieveBaseGlobal.getBaseGlobal(this.context, this.session)
            wk += "<script>tutto_schermo();init();</script>";
        }
        catch(Exception e)
        {
            e.printStackTrace();
            this.log.writeError("worklist.CSceltaFiltroStato.creaWorklist(): " + e.getMessage());
        }
        return wk;
    }
}
