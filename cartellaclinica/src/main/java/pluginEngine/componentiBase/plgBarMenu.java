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
    File: plgBarMenu.java
    Autore: Jack
*/

package pluginEngine.componentiBase;

import generatoreEngine.dati.components.dbConnectionConfig;
import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import generatoreEngine.obj.engineObj;
import imago.http.classDivHtmlObject;
import imago.sql.SqlQueryException;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class plgBarMenu extends baseAttributeEngine
{
    private final String ID_DEFAULT_MENU = "barMenuMain";

    private engineObj          eObj    = null;
    private classDivHtmlObject cDiv    = null;

    public plgBarMenu()
    {
        super();
        super.set_percorso_engine(PATH_ENGINE.GROUP_LAYER);
    }

    public Object get_attribute_engine()
    {
        return this.cDiv;
    }

    public void getValueContainer(String nome)
    {
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        this.cDiv = new classDivHtmlObject();
        this.eObj = new engineObj(context, request);
    }

    public void draw()
    {
        this.draw(this.ID_DEFAULT_MENU);
    }

    public void draw(String key)
    {
        ResultSet          rs     = null;
        dbConnectionConfig dbUtil = null;
        String             info   = new String("");

        // Fissi ma nn so per quanto :D
        //this.cDiv.appendSome("<h5 class='barMenuTitle'>User:</h5><h5 class='barMenuValue'>" + this.eObj.utente.login + "</h5>");
        //this.cDiv.appendSome("<h5 class='barMenuTitle'>Ip:</h5><h5 class='barMenuValue'>" + this.eObj.pc.ip + "</h5>");

        this.cDiv.appendSome("<div id='infoSx'><h5 class='barMenuTitle'>Ip:</h5><h5 class='barMenuValue'>" + this.eObj.pc.ip + "</h5><h5 class='barMenuTitle'>Ip:</h5><h5 class='barMenuValue'>" + this.eObj.pc.ip + "</h5></div>");

        if(!key.equals(""))
        {
            dbUtil = new dbConnectionConfig();
            try
            {
                dbUtil.setConnection(this.eObj.utente.db.getWebConnection());

                rs = dbUtil.getResultSet("select LINK, URLIMG, DESCRIZIONE from TAB_BARMENU where LINGUA = :lingua and IDBARMENU = :idmenu and ATTIVO = :attivo order by ORDINE desc", new Object[]{this.eObj.globale.lingua, key, "S"}, new String[][]{{"lingua", "S"}, {"idmenu", "S"}, {"attivo", "S"}});

                while(rs.next())
                {
                    //this.cDiv.appendSome("<a href='" + rs.getString("LINK") + "'>" + rs.getString("DESCRIZIONE") + "</a><img src='" + rs.getString("URLIMG") + "'>");
                    info += "<a href='" + rs.getString("LINK") + "'>" + rs.getString("DESCRIZIONE") + "</a><img src='" + rs.getString("URLIMG") + "'>";
                }
                this.cDiv.appendSome("<div id='infoDx'>" + info + "</div>");
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
                    dbUtil.closeResultSet(rs);
                }
                catch(SQLException ex1)
                {
                }
            }

            rs     = null;
            dbUtil = null;
        }
    }
}
