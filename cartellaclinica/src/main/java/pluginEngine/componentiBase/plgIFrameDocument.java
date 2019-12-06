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
    File: plgIFrame.java
    Autore: Jack
*/

package pluginEngine.componentiBase;

import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import imago.http.classIFrameHtmlObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class plgIFrameDocument extends baseAttributeEngine
{
    private classIFrameHtmlObject IFrame = null;

    public plgIFrameDocument()
    {
        super();
        super.set_percorso_engine(PATH_ENGINE.FORM);
    }

    public void getValueContainer(String nome)
    {
    }

    public Object get_attribute_engine()
    {
        super.set_generic(this.IFrame);

        super.uHTML.append_element_body(this.IFrame.toString());

        return null;
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
    }

    public void draw(String indirizzo)
    {
        if(indirizzo == null || indirizzo.trim().equalsIgnoreCase(""))
           this.IFrame = new classIFrameHtmlObject("blank");
       else
           this.IFrame = new classIFrameHtmlObject(indirizzo);

       this.IFrame.addAttribute("SRC_ORIGINE", indirizzo);
       this.IFrame.addAttribute("frameborder", "0");
    }
}
