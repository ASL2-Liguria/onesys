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
package jsRemote;

import imago.http.baseClass.baseUser;
import imago.sql.TableInsert;
import imago.sql.TableResultSet;
import imago.sql.TableUpdate;
import imago.util.CGestioneErrori;

import java.sql.PreparedStatement;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import core.Global;

public class CJsRichieste {

    /**
     *
     * @param iden_richiesta String
     * @return String
     */
    public String richiesta_controllata(String iden_richiesta) {
	String error = "";
	if(iden_richiesta != null && !iden_richiesta.equalsIgnoreCase(""))
	{
	    HttpSession session = (WebContextFactory.get()).getSession(false);

	    if(session == null)
		return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

	    baseUser logged_user = Global.getUser(session);

	    TableUpdate update = new TableUpdate();
	    String upd = "UPDATE INFOWEB.testata_richieste ";
	    upd += "set RICHIESTA_CONTROLLATA = 'S', ";
	    upd += "UTE_CONTROLLO = " + logged_user.iden_per + ", ";
	    upd += "DESCR_UTE_CONTROLLO = '" + logged_user.description + "' ";
	    upd += "where iden = " + iden_richiesta;
	    try
	    {
		update.updateQuery(logged_user.db.getDataConnection(), upd);
		update.close();
	    }
	    catch(Exception e)
	    {
		error = "jsRemote.CJsRichieste.richiesta_controllata(): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
	    }
	}
	return error;
    }

    /**
     *
     * @param idenRichieste_anagIden String
     * @return String
     */
    public String trova_tab_esaIden(String idenRichieste_anagIden) {
	String ret = null;
	HttpSession session = null;
	baseUser logged_user = null;
	TableResultSet trs = null;
	String rich_idenAnag[] = null;
	String testata_richiesteIden = null;
	String TR_iden[] = null;
	String query = null;
	String tabEsa_iden = "";

	session = (WebContextFactory.get()).getSession(false);
	if(session == null)
	    return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

	logged_user = Global.getUser(session);

	rich_idenAnag = idenRichieste_anagIden.split("[@]");

	query = rich_idenAnag[0];
	testata_richiesteIden = rich_idenAnag[1];
	TR_iden = testata_richiesteIden.split("[*]");

	try
	{
	    for(int i = 0; i < TR_iden.length; i++)
	    {
		trs = new TableResultSet();
		trs.getResultSet(logged_user.db.getDataConnection(), query + TR_iden[i]);
		while(trs.rs.next())
		    tabEsa_iden += trs.rs.getInt("IDEN_TAB_ESA") + "*";
	    }
	    ret = tabEsa_iden;
	}
	catch(Exception e)
	{
	    ret = "-1";
	}
	finally
	{
	    try
	    {
		trs.close();
		trs = null;
	    }
	    catch(Exception e)
	    {
		trs = null;
	    }
	}
	return ret + "@" + rich_idenAnag[2];
    }


    /**
     *
     * @param metodiche String
     * @return String
     */
    public String gestione_metodica(String metodiche) {
	TableInsert insert = null;
	String messaggio = "";
	String upd = null;
	String ins = null;
	baseUser logged_user = null;
	int num_row_upd = 0;

	HttpSession session = (WebContextFactory.get()).getSession(false);

	if(session == null)
	    return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

	logged_user = Global.getUser(session);
        PreparedStatement ps = null;
	try
	{
            upd = "UPDATE FILTRI SET LASTVALUECHAR=? WHERE TIPO=? AND USER_NAME=?";
            ps = logged_user.db.getDataConnection().prepareCall(upd);
            ps.setString(1,metodiche.replaceAll("[']", "\\\''"));
            ps.setInt(2,100);
            ps.setString(3,logged_user.login);
            ps.execute();
            ps.close();
	    /*update = new TableUpdate();
	    upd = "UPDATE FILTRI SET LASTVALUECHAR = '" + metodiche.replaceAll("[']", "\\\''") + "' ";
	    upd += "WHERE USER_NAME = '" + logged_user.login + "' ";
	    upd += "AND TIPO = 100 ";

	    num_row_upd = update.updateQuery(logged_user.db.getDataConnection(), upd);
	    update.close();*/
	}
	catch(Exception ex)
	{
	    messaggio = "jsRemote.CJsRichieste.gestione_metodica():modifica FILTRI " + CGestioneErrori.GetStackTraceErrorAsString(ex.getStackTrace());
	}

	if(num_row_upd == 0)
	{
	    insert = new TableInsert();
	    try
	    {
		ins = "INSERT INTO FILTRI (USER_NAME, TIPO, LASTVALUECHAR, ATTIVO) VALUES ('";
		ins += logged_user.login + "', 100, '" + metodiche.replaceAll("[']", "\\\''") + "', 'X')";

		insert.insertQuery(logged_user.db.getDataConnection(), ins);
		insert.close();
	    }
	    catch(Exception ex)
	    {
		messaggio = "jsRemote.CJsGestioneAnagrafica.gestione_anagrafica():inserimento in FILTRI " + CGestioneErrori.GetStackTraceErrorAsString(ex.getStackTrace());
	    }
	}
	return messaggio;
    }

}
