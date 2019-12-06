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
    File: plgTableLista.java
    Autore: Jack
*/

package pluginEngine.componentiBase;

import generatoreEngine.html.engine_html.components.htmlTable;
import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import imago.http.classDivHtmlObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class plgTableLista extends baseAttributeEngine
{
    private static String      DEFAULT_CLASS = "classTdLabelNoWidthLink";

    private String[]           a_descr  = null;
    private String[]           a_value  = null;
    private String             js_call  = null;
    private String             id_div   = null;
    private String             td_class = null;
    private htmlTable          h_table  = null;
    private classDivHtmlObject c_div    = null;

    public plgTableLista()
    {
        super();
    }

    public Object get_attribute_engine()
    {
        this.c_div.appendSome(this.h_table.getTable());
        return this.c_div;
        //return this.h_table.getTable();
    }

    public void getValueContainer(String nome)
    {
        this.a_value = super.getDatiContainer().getField(nome).getArrayChiave();
        this.a_descr = super.getDatiContainer().getField(nome).getArrayDescrizione();
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        super.set_percorso_engine(PATH_ENGINE.GROUP_LAYER); // TABLE

        this.h_table = new htmlTable();
        this.c_div   = new classDivHtmlObject();
    }

    public void set_js_call(String js)
    {
        this.js_call = js;
    }

    public void set_id_div(String id)
    {
        this.id_div = id;
    }

    public void set_class_td(String clsTd)
    {
        this.td_class = clsTd;
    }

    public void draw()
    {
        if(this.id_div != null)
            this.c_div.addAttribute("id", id_div);

        for(int idx = 0; this.a_descr != null && idx < this.a_descr.length; idx++)
        {
            this.h_table.riga.colonna.campo.creaLabel("", this.a_descr[idx]);
            this.h_table.riga.colonna.setClasse(this.td_class == null ? DEFAULT_CLASS:this.td_class);
            this.h_table.riga.colonna.creaColonnaTD();

            if(js_call != null)
                this.h_table.riga.add_event("onclick", "javascript:" + this.js_call + "('" + this.a_value[idx].replaceAll("'", "\'") + "');");

            this.h_table.aggiungiRiga();
        }

        this.h_table.draw_table();
    }
}
