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
    File: plgDivLegenda.java
    Autore: Jack
*/

package pluginEngine.componentiBase;

import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import imago.http.classDivHtmlObject;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class plgDivLegenda extends baseAttributeEngine
{
    private classDivHtmlObject dLegenda = null;
    private functionObj        fObj     = null;
    private functionStr        fStr     = null;
    private functionDB         fDB      = null;

    public plgDivLegenda()
    {
        super.set_percorso_engine(null);
    }

    public Object get_attribute_engine()
    {
        return null;
    }

    public void getValueContainer(String nome)
    {
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        this.fObj     = new functionObj(context, request);
        this.fDB      = new functionDB(this.fObj);
        this.fStr     = new functionStr();
        this.dLegenda = new classDivHtmlObject("idLayLegStato", "position: Absolute; visibility:hidden;");

        this.dLegenda.addAttribute("onMouseOut", "hideLayerSetPos('idLayLegStato')");
        this.dLegenda.addAttribute("class", "livelloStato");
    }

    public void draw(String query)
    {
        ResultSet rs  = null;
        int       idx = 0;

        try
        {
            rs = fDB.openRs(query);

            while(rs.next())
            {
                this.dLegenda.appendSome("<DIV id='" + String.valueOf(idx++) + "'>" + this.fStr.verifica_dato(rs.getString(1)) + "</DIV>");
            }

            if(idx > 0)
            {
                super.uHTML.append_element_body(this.dLegenda.toString());
            }
        }
        catch(SqlQueryException ex)
        {
        }
        catch(SQLException ex)
        {
        }
        finally
        {
            try
            {
                this.fDB.close(rs);
            }
            catch(SQLException ex1)
            {
            }
        }
    }
}
