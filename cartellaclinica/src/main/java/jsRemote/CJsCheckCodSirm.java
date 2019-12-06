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
 * CJsCheckCodSirm.java
 *
 * Created on 10 ottobre 2006, 10.00
 */

package jsRemote;

import imago.http.baseClass.baseUser;
import imago.sql.TableResultSet;
import imago.util.CGestioneErrori;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import core.Global;

/**
 *
 * @author  elenad
 */
public class CJsCheckCodSirm {

    /** Creates a new instance of CJsCheckCodSirm */
    public CJsCheckCodSirm() {
    }

    public String checkCodSirm(String cod_sirm)
    {
        HttpSession 	session = (WebContextFactory.get()).getSession(false);

        if(session == null)
            return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

        baseUser logged_user = Global.getUser(session);

        String errore = "";
        if(cod_sirm == null)
            return "Parametri nulli passati alla jsRemote.CJsCheckCodSirm";
        else
            if(!cod_sirm.equalsIgnoreCase(""))
            {
                TableResultSet trs = null;
                /*Prendo solo il primo carattere per effettuare il controllo dell'esistenza del cod_sirm in tab_tesa*/
                String met_app_org = cod_sirm.substring(0,1);
                try{
                    if(cod_sirm != null && !cod_sirm.equalsIgnoreCase("")){
                        trs = new TableResultSet();
                        trs.getSelectColumnsWhereCond(logged_user.db.getDataConnection(), "met_app_org", "tab_tesa", "met_app_org like '" + met_app_org.replace('\'', '"') + "%' and deleted = 'N'");
                        if(!trs.rs.next()){
                            errore = "0";
                        }
                        trs.close();
                    }
                }
                catch(Exception e){
                    errore = "eccezione " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
                }
            }
        return errore;
    }
}
