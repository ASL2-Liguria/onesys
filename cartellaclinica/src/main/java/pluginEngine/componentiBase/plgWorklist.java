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
    File: plgWorklist.java
    Autore: Jack
*/

package pluginEngine.componentiBase;

import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import generatoreEngine.obj.engineObj;
import generatoreEngine.worklist.worklistCreator;
import imago.http.classDataTable;
import imago.sql.SqlQueryException;
import imagoAldoUtil.ImagoUtilException;
import imagoAldoUtil.classMenuFactory;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.json.JSONException;

public class plgWorklist extends baseAttributeEngine
{
    private final String DEFAULT_ID_TABLE = "oTableWk";
    private final String DEFAULT_URL_LOAD = "worklistLoad";
    private String          id_table   = null;
    private String          url_load   = null;
    private String          wk_where   = null;
    private classDataTable  h_table    = null;
    private worklistCreator workEngine = null;
    private engineObj       eObj       = null;

    public plgWorklist()
    {
        super();
        super.set_percorso_engine(PATH_ENGINE.TABLE);
    }

    public Object get_attribute_engine()
    {
        return this.h_table;
    }

    public void getValueContainer(String nome)
    {
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        this.h_table  = new classDataTable("");
        this.id_table = new String(this.DEFAULT_ID_TABLE);
        this.url_load = new String(this.DEFAULT_URL_LOAD);
        this.eObj     = new engineObj(context, request);

        try
        {
            this.workEngine = new worklistCreator(context, request);
        }
        catch(SqlQueryException ex)
        {
        }

        this.eObj.readRequest();
    }

    public void setIdTable(String id)
    {
        this.id_table = id;
    }

    public void setUrlLoad(String url)
    {
        this.url_load = url;
    }

    public void setWhere(String where)
    {
        this.wk_where = where;
    }

    public void setTipoWk(String name)
    {
        this.workEngine.setTipoWkName(name);
    }

    public void setTabCampiWk(String name)
    {
        this.workEngine.setTabCampiWkName(name);
    }

    public void setTabDimWk(String name)
    {
        this.workEngine.setTabDimWkName(name);
    }

    public void setTabJSWk(String name)
    {
        this.workEngine.setTabJSWkName(name);
    }

    public void setTabOrderWk(String name)
    {
        this.workEngine.setTabOrderWkName(name);
    }

    public void addEventRowWK(String evento, String js)
    {
        this.workEngine.addEventRow(js, evento);
    }

    public void appendJSbody(String codice)
    {
        super.uHTML.append_last_element_body("<script>" + codice + "</script>");
    }

    public void draw(String tipo_wk)
    {
        this.draw(tipo_wk, "");
    }

    public void draw(String tipo_wk, String menu_dx)
    {
        String           js    = new String("jQuery('#" + this.id_table + "').removeClass('classDataEntryTable');\njQuery('#" + this.id_table + "').worklist(");
        classMenuFactory cMenu = null;

        if(this.wk_where == null || this.wk_where.equals(""))
            this.wk_where = this.eObj.getRequestRead().get("WHERE_WK");

        super.uHTML.get_body().addAttribute("onContextMenu", "return MenuTxDx();");
        super.uHTML.get_body().addAttribute("onClick", "javascript:hideContextMenu();");

        try
        {
            js += this.workEngine.getJSONCreatorWorklist(tipo_wk, this.wk_where).toString();
        }
        catch(JSONException ex)
        {
        }

        js+=");";

        this.h_table.addAttribute("id", this.id_table);

        super.uHTML.append_last_element_body("<script>" + js + "</script>");

        if(!menu_dx.equals(""))
        {
            cMenu = new classMenuFactory(this.eObj.utente, menu_dx, this.eObj.session);

            try
            {
                //super.uHTML.append_last_element_body(cMenu.getMenuTendina(super.uHTML.pagina.tabella.getTable()).toString());
                super.uHTML.pagina.appendForm(cMenu.getMenuTendina(super.uHTML.pagina.tabella.getTable()).toString());
            }
            catch(ImagoUtilException ex1)
            {
            }
        }
    }
}
