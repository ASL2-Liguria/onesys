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
package cartellaclinica.lettera.pckInfo;

import imago.sql.SqlQueryException;
import imagoAldoUtil.classTabExtFiles;
import imago_jack.imago_function.db.functionDB;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class cDatiLaboratorio implements ILetteraInfo{

    HttpServletRequest Request;
    HttpSession Session;
    functionDB fDB;

    public cDatiLaboratorio(){}

    public void setRequest(HttpServletRequest req, HttpSession p_sess,functionDB p_fDB) {
        this.Request = req;
        this.Session = p_sess;
        this.fDB = p_fDB;
    }

    public String getHtml() throws SQLException, SqlQueryException {
        String resp="";

        resp+="<div class=divFiltroLaboratorio>\n";

            resp+="<div style='display:block;clear:both;'>\n";
            resp+="<span class=header>Range</span>\n";
            resp +="<input type=radio name=radioFiltroLabo id=radioEpisodio checked onclick=\"switchRicerca(this);\"/><label for=radioEpisodio>Episodio</label>\n";
            resp +="<input type=radio name=radioFiltroLabo id=radioRicovero onclick=\"switchRicerca(this);\"/><label for=radioRicovero>Ricovero</label>\n";
            resp+="</div>\n";

            resp += "<div id='wrapperFiltroDatiLabo'>\n";
            resp += "<span class=header>Impostazioni</span>\n";
            resp += "<div class='vrapSezFiltroLabo'><input type=checkbox id=chkTabLaboBordi checked/><span>Genera bordi</span></div>\n";
            resp += "<div class='vrapSezFiltroLabo'><input type=checkbox id=chkTabLaboGruppi checked/><span>Genera gruppi</span></div>\n";
            resp += "<span id=btnAllegaDatiLabo >Allega</span>";
            resp+="</div>\n";



        resp+="</div>\n";

//        resp+="<div class=divTabLaboratorio id=divTabLaboratorio >\n";
        resp+="<div class=divTabLaboratorio id=divTabLaboratorio>\n";

       /*try{
            ResultSet rs;
            PreparedStatement ps = fDB.getConnectData().prepareCall("Select CC_LABO_GET_TAB_RIS_2(?,?,?) TAB from dual");
            ps.setString(1,Request.getParameter("reparto"));
            ps.setString(2,Request.getParameter("ricovero"));
            //ps.setInt(3,Integer.valueOf(Request.getParameter("idenVisita")));
            ps.setInt(3,0);
            rs=ps.executeQuery();
            if(rs.next()){
                resp+=rs.getString("TAB");
            }else{
                resp+="Errore nella ricezione della tabella dati";
            }
            fDB.close(rs);
        }catch(Exception e){
            resp+= e.getMessage();
        }*/

        resp+="</div>\n";
        //System.out.println(resp);
        resp+= getSpecificLink();

        return resp;
    }

    private String getSpecificLink() throws SqlQueryException, SQLException {
        return classTabExtFiles.getIncludeString(fDB.getConnectWeb(), "TAB_EXT_FILES", this.getClass().getName(), "");
    }


}
