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
package cartellaclinica.dwr;

import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;

import java.sql.Array;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Types;

import javax.servlet.http.HttpSession;

import oracle.sql.ARRAY;
import oracle.sql.ArrayDescriptor;

import org.directwebremoting.WebContextFactory;

import core.Global;

public class dwrConfigurazioneVisualizzazione {


    Connection conn = null;
    baseUser User=null;
    public dwrConfigurazioneVisualizzazione(){}

    public dwrConfigurazioneVisualizzazione(baseUser pUser) throws  SqlQueryException {
        this.User= pUser;
        this.conn=User.db.getDataConnection();
    }


    private void init() throws SqlQueryException{
            HttpSession Sess= WebContextFactory.get().getSession();
            User=Global.getUser(Sess);
            conn=User.db.getDataConnection();
	}

    public String getTableEsami(String id,String cls,String sql){
        String resp="OK*";
        try{
            if(conn==null)
                init();
            ResultSet rs;

            rs = conn.createStatement().executeQuery(sql);
            resp+="<table id=\""+id+"\" class=\""+cls+"\">\n";

            resp+="<tr><th>Codice</th><th>Descrizione</th></tr>\n";

            while(rs.next()){
                resp+="<tr value="+rs.getString("IDEN")+" descr=\""+rs.getString("COD_ESA")+"\" class=esameSorg tipo=esameSorg>\n";
                resp+="<th>"+rs.getString("COD_ESA")+"</th><td>"+rs.getString("DESCR")+"</td>\n";
                resp+="</tr>\n";
            }
            resp+="</table>\n";
        }catch(Exception e){
            resp="KO*"+e.getMessage();
        }

        return resp;

    }

    public String setConfigurazioni(String reparto,String tipoVisualizzazione,String[] arIdenEsa,String[] arOrderEsa,String[] arGruppoDescr,String[] arGruppoOrdine) {

        String resp = "";

        Array oraIdenEsa=null;
        Array oraOrderEsa=null;
        Array oraGruppoDescr=null;
        Array oraGruppoOrdine=null;

        CallableStatement CS = null;
        try {

            init();

            oraIdenEsa      = new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_HASH",conn),conn,arIdenEsa);
            oraOrderEsa     = new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_HASH",conn),conn,arOrderEsa);
            oraGruppoDescr  = new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_HASH",conn),conn,arGruppoDescr);
            oraGruppoOrdine = new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_HASH",conn),conn,arGruppoOrdine);

            CS = conn.prepareCall("{call CC_LABO_CONFIG_SAVE (?,?,?,?,?,?,?)}");

            CS.setString(1,reparto);
            CS.setString(2,tipoVisualizzazione);
            CS.setArray(3, oraIdenEsa);
            CS.setArray(4, oraOrderEsa);
            CS.setArray(5, oraGruppoDescr);
            CS.setArray(6, oraGruppoOrdine);

            CS.registerOutParameter(7, Types.VARCHAR);

            CS.execute();
            resp = CS.getString(7);


        } catch (Exception ex) {
            resp = ex.getMessage();
        } finally {
            try{CS.close();}catch (Exception e){}
            CS = null;
        }
        return resp;
    }
}
