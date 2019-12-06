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
 * CJsUpdTareEsa.java
 *
 * Created on 9 ottobre 2006, 10.18
 */

package jsRemote;

import imago.a_sql.CTareEsa;
import imago.http.baseClass.baseUser;
import imago.util.CGestioneErrori;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import core.Global;

/**
 *
 * @author  elenad
 */
public class CJsUpdTareEsa {

    /** Creates a new instance of CJsUpdTareEsa */
    public CJsUpdTareEsa() {
    }

    /**
     *
     * @param sal_mac_are_esa String
     * @return String
     */
    public String update_tare_esa(String sal_mac_are_esa)
    {
        String errore = "";
        HttpSession 	session = (WebContextFactory.get()).getSession(false);

        if(session == null)
            return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

        baseUser logged_user = Global.getUser(session);

        ServletContext context = (ServletContext)(WebContextFactory.get()).getServletContext();
        try{
            String param [] = sal_mac_are_esa.split("[@]");

            CTareEsa tare_esa = new CTareEsa(logged_user);
            String iden_esami = param[3].replaceAll("[*]", ",");
            String where_cond_sal_mac_are = "iden_sal = " + param[0];
            where_cond_sal_mac_are += " and iden_mac = " + param[1];
            where_cond_sal_mac_are += " and iden_are = " + param[2];
            where_cond_sal_mac_are += " and iden in (" + iden_esami + ")";

            if(tare_esa.loadData(false, where_cond_sal_mac_are)){
                /*Caso della cancellazione dalla tabella TARE_ESA*/
                tare_esa.delete(logged_user, where_cond_sal_mac_are);
            }
            else{
                /*Caso dell'inserimento in tabella TARE_ESA*/
                String elenco_esa_insert = param[3];
                String esami [] = elenco_esa_insert.split("[*]");
                for(int i = 0; i < esami.length; i++){
                    String insert = "insert into TARE_ESA ";
                    insert += "(iden_sal, iden_mac, iden_are, iden) values (";
                    insert += param[0] + ", ";
                    insert += param[1] + ", ";
                    insert += param[2] + ", ";
                    insert += esami[i]+ ")";

                    tare_esa.insert(logged_user, insert, context);
                }
            }
        }
        catch(Exception e){
            errore = CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
        }
        return errore;
    }
}
