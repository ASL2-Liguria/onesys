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
    File: plgBTMetodiche.java
    Autore: Jack
*/

package pluginEngine.standard;

import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import imago.http.classAHtmlObject;
import imago.http.classLIHtmlObject;
import imago.http.classULHtmlObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class plgBTMetodiche extends baseAttributeEngine
{
    private final String CLASS_UL = "pulsanteULCenter";
    private final String JS_LI    = "set_metodica";
    private final int    NUM_COL  = 6;

    private int      n_col;
    private String   risultato;
    private String   js_click;
    private String   classeBT;
    private String[] a_value;
    private String[] a_descr;

    public plgBTMetodiche()
    {
        super();
    }

    public Object get_attribute_engine()
    {
        return this.risultato;
    }

    public void getValueContainer(String nome)
    {
        this.a_value = super.getDatiContainer().getField(nome).getArrayChiave();
        this.a_descr = super.getDatiContainer().getField(nome).getArrayDescrizione();
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        super.set_percorso_engine(PATH_ENGINE.COLUMN_CONTAIN);

        this.risultato = new String("");
        this.js_click  = JS_LI;
        this.classeBT  = CLASS_UL;
        this.n_col     = NUM_COL;
    }

    public void setClasseUL(String classe)
    {
        if(classe != null && classe.trim().equals(""))
        {
            this.classeBT = classe;
        }
    }

    public void setJS(String js)
    {
        if(js != null && !js.trim().equals(""))
        {
            this.js_click = js;
        }
    }

    public void setNumeroColonne(String num)
    {
        try
        {
            this.n_col = Integer.valueOf(num);
        }
        catch(Exception ex)
        {
            this.n_col = NUM_COL;
        }
    }

    public void draw()
    {
        classULHtmlObject ulMeto = new classULHtmlObject();
        classLIHtmlObject liMeto = null;

        ulMeto.addAttribute("class", this.classeBT);
        ulMeto.addAttribute("id", "elenco_metodiche");

        for(int idx = 0; idx < this.a_value.length; idx++)
        {
            liMeto = new classLIHtmlObject(true);
            liMeto.addAttribute("id", "metodica_" + this.a_value[idx]);
            liMeto.appendSome(new classAHtmlObject("javascript:" + this.js_click + "('" + this.a_value[idx]  + "');", this.a_descr[idx]));

            ulMeto.appendSome(liMeto);

            if(((idx + 1) % this.n_col) == 0 && idx > 0)
            {
                this.risultato += ulMeto.toString();

                ulMeto = new classULHtmlObject();
                ulMeto.addAttribute("class", this.classeBT);
                ulMeto.addAttribute("id", "elenco_metodiche");
            }
            //this.risultato += (new classDivButton(this.a_descr[idx], "pulsante", "javascript:alert('" + this.a_value[idx] + "')")).toString() + (idx > 0 && (idx % 5) == 0 ? "<BR>":"");
        }
        this.risultato += ulMeto.toString();
    }
}
