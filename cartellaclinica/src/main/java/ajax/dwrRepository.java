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
package ajax;

import imago.http.baseClass.baseUser;

import java.sql.ResultSet;
import java.sql.Statement;

import org.directwebremoting.WebContextFactory;

import core.Global;

public class dwrRepository {
    public dwrRepository() {
    }
    public String dwrGetUrlRepo (String var) {
        String[] Dati = var.split("[*]");
        baseUser logged_user = Global.getUser(WebContextFactory.get().getSession(false));
            String ret="";
            try{
                String strSql =
                        "SELECT VALORE FROM CONFIGURA_MODULI where modulo='REPOSITORY' and variabile='" +
                        Dati[0]+"'";
               Statement stm = logged_user.db.getWebConnection().createStatement();
                ResultSet rst;
                rst = stm.executeQuery(strSql);

                //Estrazione dei Dati
                if (rst.next() == true) {
                    ret = rst.getString("VALORE");
                }
                } catch (Exception ex)
                {
                  ret=ex.getMessage();
                }

        return ret;

    }

    public String dwrGetIdenRemoto (String var) {
//       String[] Dati = var.split("[*]");
       baseUser logged_user = Global.getUser(WebContextFactory.get().getSession(false));
           String ret="";
           try{
               String strSql =
                       "SELECT ID_REMOTO FROM VIEW_IDEN_REPOSITORY where iden=" + var;
              Statement stm = logged_user.db.getDataConnection().createStatement();
               ResultSet rst;
               rst = stm.executeQuery(strSql);

               //Estrazione dei Dati
               if (rst.next() == true) {
                   ret = rst.getString("ID_REMOTO");
               }
               } catch (Exception ex)
               {
                 ret=ex.getMessage();
               }

       return ret;

   }


}
