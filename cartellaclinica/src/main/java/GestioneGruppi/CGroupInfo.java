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
 * CGroupInfo.java
 *
 * Created on 22 giugno 2006, 14.28
 */

package GestioneGruppi;

import generic.utility.html.HeaderUtils;
import imago.a_sql.CGroup;
import imago.a_sql.CGroupData;
import imago.a_sql.CLogError;
import imago.a_sql.ISQLException;
import imago.a_util.CClientParam;
import imago.a_util.CContextParam;
import imago.http.classColDataTable;
import imago.http.classDataTable;
import imago.http.classDivButton;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classSelectHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.baseUser;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

/**
 * Classe per la costruzione del codice html per la visualizzazione delle informazioni
 * delle permissioni di un gruppo imagoweb.GRUPPI.cod_ope, imagoweb.GRUPPI.permissioni_tabelle
 *
 * @author  elenad
 */
public class CGroupInfo
{
    private baseUser logged_user = null;
    private CContextParam context_param = null;
    private CClientParam client_param = null;
    private CLogError log = null;
    private classLabelHtmlObject label = null;
    private classRowDataTable tr = null;
    private classColDataTable td = null;
    private ArrayList lista_colonne = new ArrayList();
    private ArrayList lista_righe = new ArrayList();
    private ServletContext context = null;
    private HttpSession session = null;
    private HttpServletRequest request = null;

    /** Creates a new instance of CGroupInfo */
    public CGroupInfo()
    {
    }

    public CGroupInfo(baseUser logged_user, CContextParam context_param, CClientParam client_param, CLogError log, HttpSession session, ServletContext context, HttpServletRequest request)
    {
        this.logged_user = logged_user;
        this.context_param = context_param;
        this.client_param = client_param;
        this.log = log;
        this.session = session;
        this.context = context;
        this.request = request;
    }

    private String creaHeader()
    {
        classTabHeaderFooter header = null;
        try
        {
            label = new classLabelHtmlObject("", "", "label_titolo");
            header = new classTabHeaderFooter(label);
        }
        catch(Exception e)
        {
            e.printStackTrace();
            this.log.writeError("GestioneGruppi.CGroupInfo.creaHeader(): " + e.getMessage());
        }
        return header.toString();
    }

    private String creaFooter()
    {
        classDivButton button_chiudi = null;
        classTabHeaderFooter footer = new classTabHeaderFooter("&nbsp;");
        footer.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
        try
        {
            button_chiudi = new classDivButton("", "pulsante", "javascript:chiudi();", "LBL_Close", "");
            footer.addColumn("classButtonHeader", button_chiudi.toString());

        }
        catch(Exception e)
        {
            e.printStackTrace();
            this.log.writeError("GestioneGruppi.CGroupInfo.creaFooter(): " + e.getMessage());
        }
        return(footer.toString());
    }

    private classRowDataTable creaLayerSceltaGruppi()
    {
        label = new classLabelHtmlObject("", "", "gruppo");
        td = new classColDataTable("TD", "", label);
        td.addAttribute("class", "classTdLabel");
        td.addAttribute("width", "40%");
        lista_colonne.add(td);

        classSelectHtmlObject select = new classSelectHtmlObject("gruppi");
        select.addEvent("onChange", "javascript:informazioni_permissioni();");
        select.addAttribute("style", "width=70%");
        CGroup gruppi = new CGroup(this.logged_user, Integer.parseInt(this.context_param.getParam("TIPODB")));
        try
        {
            gruppi.loadData();
        }
        catch(ISQLException e)
        {
            e.printStackTrace();
            this.log.writeError("GestioneGruppi.CGroupInfo.creaLayerSceltaGruppi(): " + e.getMessage());
        }
        ArrayList elenco_gruppi = gruppi.getData();

        for(int i = 0; i < elenco_gruppi.size(); i++)
        {
            CGroupData gruppi_data = (CGroupData) elenco_gruppi.get(i);
            if(gruppi_data.m_strCOD_DEC.equalsIgnoreCase(this.client_param.getParam("cod_gruppo")))
            {
                select.addOption(String.valueOf(i), gruppi_data.m_strCOD_DEC, true);
            }
            else
            {
                select.addOption(String.valueOf(i), gruppi_data.m_strCOD_DEC, false);
            }
        }
        td = new classColDataTable("TD", "", select);
        td.addAttribute("width", "60%");
        td.addAttribute("class", "classTdField");
        lista_colonne.add(td);

        tr = new classRowDataTable("", lista_colonne);
        return tr;
    }

    private classRowDataTable creaLayerPermissioni(String id_descr, String id_valore)
    {
        lista_colonne.clear();
        label = new classLabelHtmlObject("", "", id_descr);
        td = new classColDataTable("TD", "", label);
        td.addAttribute("class", "classTdLabel");
        lista_colonne.add(td);
        label = new classLabelHtmlObject("", "", id_valore);
        td = new classColDataTable("TD", "", label);
        td.addAttribute("class", "classTdField");
        lista_colonne.add(td);
        tr = new classRowDataTable("", lista_colonne);
        return tr;
    }


    private String creaLayer()
    {
        tr = this.creaLayerSceltaGruppi();
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_CODGRUPPO", "cod_gruppo");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_LSTData1", "descr_gruppo");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_PRENO", "prenotazione");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_ACC", "accettazione");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_ESE", "esecuzione");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_REF", "refertazione");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_MODANAG", "gestione_anagrafica");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_GESPARA", "gestione_parametri");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_TABMAGA", "gestione_magazzino");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_REFDEF", "referti_definitivi");
        lista_righe.add(tr);

        tr = this.creaLayerPermissioni("LBL_RIPR_CANC_ALTRO", "ripristino_cancellati_altro");
        lista_righe.add(tr);

        tr = this.creaLayerPermissioni("LBL_CANCESAMI", "cancellazione_esami");
        lista_righe.add(tr);

        /*GESTIONE TABELLE*/
        tr = this.creaLayerPermissioni("LBL_SAL_MAC_ARE", "sale_macch_aree");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_TAB_AMM", "tick_onere"); //Ticket, Onere
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_TAB_ESAMI", "esami");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_REF_STD_ACR", "ref_std_acr");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_TAB_PROV", "prov");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_OP_TEC_MED", "op_tec_med");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_TAB_CDC", "cdc");
        lista_righe.add(tr);
        tr = this.creaLayerPermissioni("LBL_TAB_ALTRE", "statoPaz_fasceOra_prof");
        lista_righe.add(tr);

        classDataTable table = new classDataTable("classDataEntryTable", lista_righe);
        table.addAttribute("cols", "2");
        return table.toString();
    }

    public String write_info()
    {
        Document document = new Document();
        classHeadHtmlObject testata = null;

        /*Impostazione CSS e Javascript*/
        try
        {
            testata = HeaderUtils.createHeadWithIncludes(this.getClass().getName(), session);

            document.setHead(testata);
        }
        catch(Exception e)
        {
            e.printStackTrace();
            this.log.writeError("GestioneGruppi.CGroupInfo.write_info(): errore include css, js: " + e.getMessage());
        }

        classJsObject label_js = new classJsObject();
        String jsLabel = null;
        try
        {
            jsLabel = label_js.getArrayLabel("SL_GroupManager", this.logged_user);
            document.appendHead(jsLabel);

            String onload = "javascript:fillLabels(arrayLabelName,arrayLabelValue);tutto_schermo();";

            Body corpoHtml = new Body();
            corpoHtml.addAttribute("onLoad", onload);
            corpoHtml.addAttribute("class", "body;");

            classFormHtmlObject form = new classFormHtmlObject("form", "", "", "");

            form.appendSome(creaHeader());
            form.appendSome(creaLayer());
            form.appendSome(creaFooter());

            corpoHtml.addElement(form.toString());

            String script = "<SCRIPT>\n\n";
            script += "informazioni_permissioni();\n";
            script += "</SCRIPT>\n\n";
            corpoHtml.addElement(script);

            // disattivo pulsante destro
            classJsObject.setNullContextMenuEvent(corpoHtml, this.logged_user);

            document.setBody(corpoHtml);
        }
        catch(Exception e)
        {
            e.printStackTrace();
            this.log.writeError("GestioneGruppi.CGroupInfo.write_info(): " + e.getMessage());
        }
        return(document.toString());
    }
}

/*testata.addCssLink("std/css/normalBody.css");
        testata.addCssLink("std/css/headerTable.css");
        testata.addCssLink("std/css/button.css");
        testata.addCssLink("std/css/dataTable.css");
        testata.addCssLink("std/css/dataEntryTable.css");
        testata.addJSLink("std/jscript/fillLabels.js");
        testata.addJSLink("std/jscript/tutto_schermo.js");

        testata.addJSLink("std/jscript/Utilita/GestioneGruppi/informazioni_permissioni.js");
 */
