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
/**
 *
 */
package jsRemote;

import imago.http.baseClass.baseUser;
import imago.sql.TableResultSet;
import imago.sql.TableUpdate;
import imago.util.CGestioneErrori;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import core.Global;

/**
 * @author elenad
 *
 */
public class CJsCheckPrimaryKey {

    /*
     * @param param
     * 			nome tabella
     * 			where condition
     */
    public String check_primary_key(String param)
    {
        HttpSession 	session = (WebContextFactory.get()).getSession(false);

        if(session == null)
            return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

        baseUser logged_user = Global.getUser(session);


    	String tabella_whereCondition_campo [] = param.split("[@]");
    	String errore = "";
    	String deleted = "";
    	TableResultSet trs = new TableResultSet();

        String select = "SELECT " + tabella_whereCondition_campo[2] + " FROM "+ tabella_whereCondition_campo[0];
    	select += " WHERE " + tabella_whereCondition_campo[1];
    	try{
              trs.getResultSet(logged_user.db.getWebConnection(), select);
              if(trs.rs.next())
                      deleted = trs.rs.getString(tabella_whereCondition_campo[2]);

              errore = deleted;
    	}
    	catch(Exception e){
    		errore = "CJsCheck.check_primary_key(): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
    	}
        finally{
            try{
                trs.close();
            }
            catch(Exception e){
            }
        }
    	return errore;
    }

    /*
     * @param param
     * 			nome tabella
     * 			where condition
     */
    public String ripristina_record(String param)
    {
        HttpSession 	session = (WebContextFactory.get()).getSession(false);

        if(session == null)
            return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

        baseUser logged_user = Global.getUser(session);


    	String tabella_whereCondition_campo [] = param.split("[@]");
    	String errore = "";
    	TableUpdate update = new TableUpdate();

    	try{
              String upd = "UPDATE "+ tabella_whereCondition_campo[0];
              upd += " SET " + tabella_whereCondition_campo[2] + " WHERE  " + tabella_whereCondition_campo[1];
              update.updateQuery(logged_user.db.getWebConnection(), upd);
    	}
    	catch(Exception e){
    		errore = "CJsCheck.ripristina_record(): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
    	}
        finally{
            try{
                update.close();
            }
            catch(Exception e){
            }
        }

    	return errore;
    }
}
