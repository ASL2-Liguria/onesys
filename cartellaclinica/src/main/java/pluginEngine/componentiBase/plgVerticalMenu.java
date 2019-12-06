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
    File: plgVerticalMenu.java
    Autore: Jack
*/

package pluginEngine.componentiBase;

import generatoreEngine.dati.components.dbConnectionConfig;
import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import generatoreEngine.obj.engineObj;
import imago.http.classAHtmlObject;
import imago.http.classDivHtmlObject;
import imago.http.classLIHtmlObject;
import imago.http.classULHtmlObject;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.str.functionStr;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class plgVerticalMenu extends baseAttributeEngine
{
    private engineObj   eObj    = null;
    private String      cUlMenu = null;
    private functionStr fStr    = null;

    public plgVerticalMenu()
    {
        super();
        super.set_percorso_engine(PATH_ENGINE.GROUP_LAYER);

        this.fStr = new functionStr();
    }

    public Object get_attribute_engine()
    {
        classDivHtmlObject cDiv = new classDivHtmlObject("DIV_VERTICAL_MENU");

        cDiv.appendSome(this.cUlMenu);
        cDiv.addAttribute("class", "clsMenuFrame");

        return cDiv;
    }

    public void getValueContainer(String nome)
    {
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        this.eObj = new engineObj(context, request);
    }

    public void draw()
    {
        ResultSet          rs     = null;
        dbConnectionConfig dbUtil = new dbConnectionConfig();

        try
        {
            dbUtil.setConnection(this.eObj.utente.db.getWebConnection());

            rs = dbUtil.getResultSet("select DESCRIZIONE, LIVELLO, ORDINE, CODICE, LINK from VIEW_VERTICAL_MENU where LINGUA = :lingua", new Object[]{this.eObj.globale.lingua}, new String[][]{{"lingua", "S"}});

            this.cUlMenu = this.draw_vertical(rs);
        }
        catch(SqlQueryException ex)
        {
            ex.printStackTrace();
        }
        catch(SQLException ex)
        {
            ex.printStackTrace();
        }
        finally
        {
            try
            {
                dbUtil.closeResultSet(rs);
            }
            catch(SQLException ex)
            {
                ex.printStackTrace();
            }
        }

        rs     = null;
        dbUtil = null;
    }

    private String draw_vertical(ResultSet rs) throws SQLException
    {
        classULHtmlObject cUlContainer = new classULHtmlObject();
        classLIHtmlObject cLiContainer = null;
        classULHtmlObject cUlMenu      = null;
        classLIHtmlObject cLiMenu      = null;
        boolean           plus         = true;

        cUlContainer.addAttribute("class", "container");

        while(rs.next())
        {
            cLiContainer = new classLIHtmlObject(true);
            cLiContainer.addAttribute("class", "menu");

            cUlMenu = new classULHtmlObject();

            if(rs.getString("CODICE").equals("0"))
            {
                cLiMenu = this.draw_title_menu(this.fStr.verifica_dato(rs.getString("DESCRIZIONE")), "javascript:expand_menu();", "title_center", false, "<span id='keepIcon' class='keepMenu'></span>");
            }
            else
            {
                if(rs.getString("CODICE").indexOf(".") == -1)
                {
                    if(rs.next())
                        plus = rs.getString("CODICE").indexOf(".") > 0;
                    else
                        plus = false;

                    rs.previous();

                    cLiMenu = this.draw_title_menu(this.fStr.verifica_dato(rs.getString("DESCRIZIONE")), this.fStr.verifica_dato(rs.getString("LINK")), "title", plus);
                }
            }

            cUlMenu.appendSome(cLiMenu);

            cLiMenu = this.draw_sub_vertical(rs);

            if(cLiMenu != null)
                cUlMenu.appendSome(cLiMenu);

            cLiContainer.appendSome(cUlMenu);
            cUlContainer.appendSome(cLiContainer);
        }

        return cUlContainer.toString();
    }

    private classLIHtmlObject draw_title_menu(String titolo, String link, String classe, boolean includispan)
    {
        return this.draw_title_menu(titolo, link, classe, includispan, "");
    }

    private classLIHtmlObject draw_title_menu(String titolo, String link, String classe, boolean includispan, String alternative)
    {
        classLIHtmlObject cLiRet = new classLIHtmlObject(true);
        classAHtmlObject  cAHref = new classAHtmlObject(link.equals("") ? "#":link, (includispan ? titolo + "<span class='menuPlus'>+</span>":titolo+alternative));

        if(!classe.equals(""))
            cLiRet.addAttribute("class", classe);

        cLiRet.appendSome(cAHref);

        return cLiRet;
    }

    private classLIHtmlObject draw_sub_vertical(ResultSet rs) throws SQLException
    {
        int               count     = 0;
        classLIHtmlObject cLiRet    = new classLIHtmlObject(true);
        classULHtmlObject cUlElenco = new classULHtmlObject();

        cLiRet.addAttribute("class", "sub-menu");

        while(rs.next() && rs.getString("CODICE").indexOf(".") > 0)
        {
            count++;
            cUlElenco.appendSome(this.draw_title_menu(this.fStr.verifica_dato(rs.getString("DESCRIZIONE")), this.fStr.verifica_dato(rs.getString("LINK")), "", false));
        }

        rs.previous();

        cLiRet.appendSome(cUlElenco);

        return count > 0 ? cLiRet:null;
    }
}
