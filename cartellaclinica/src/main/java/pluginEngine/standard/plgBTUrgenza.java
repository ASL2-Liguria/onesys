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
    File: plgBTUrgenza.java
    Autore: Jack
*/

package pluginEngine.standard;

import generatoreEngine.html.engine_html.components.htmlRow;
import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import imago.http.classDivButton;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class plgBTUrgenza extends baseAttributeEngine
{
    private htmlRow  hRiga   = null;
    private String   js_bt   = null;
    private String[] a_value = null;
    private String[] a_descr = null;

    public plgBTUrgenza()
    {
        super();
    }

    public Object get_attribute_engine()
    {
        return this.hRiga;
    }

    public void getValueContainer(String nome)
    {
        this.a_value = super.getDatiContainer().getField(nome).getArrayChiave();
        this.a_descr = super.getDatiContainer().getField(nome).getArrayDescrizione();
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        this.hRiga = new htmlRow();

        this.hRiga.colonna.setStato(super.uHTML.pagina.tabella.riga.colonna.getStato(), super.uHTML.pagina.tabella.riga.colonna.getStatoLabelMessage());

        super.set_percorso_engine(PATH_ENGINE.ROW);

        this.setJS("");
    }

    public void setJS(String funzione)
    {
        if(funzione != null)
            this.js_bt = funzione;
        else
            this.js_bt = new String("");
    }

    public void draw()
    {
        this.hRiga.colonna.campo.setId("hUrgenza");
        this.hRiga.colonna.campo.creaFieldHIDDEN("hUrgenza");
        this.hRiga.colonna.appendField();

        for(int idx = 0; idx < this.a_descr.length && idx < this.a_value.length; idx++)
        {
            this.hRiga.colonna.setClasse("");
            this.hRiga.colonna.add_attribute("width", "25%");
            this.hRiga.colonna.campo.sostituisciContenuto(new classDivButton(this.a_descr[idx], "pulsanteUrgenza" + this.a_value[idx], "javascript:document.all.hUrgenza.value='" + this.a_value[idx] + "';" + this.js_bt).toString()); // , "lblUrgenza" + this.a_value[idx], ""
            this.hRiga.colonna.creaColonnaTD();
        }
    }
}
