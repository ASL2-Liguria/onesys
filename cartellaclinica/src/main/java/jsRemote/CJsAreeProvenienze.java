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
import imago.sql.TableDelete;
import imago.sql.TableInsert;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import core.Global;

/**
 *
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: </p>
 *
 * <p>Company: </p>
 *
 * @author elenad
 * @version 1.0
 */
public class CJsAreeProvenienze {

    /**
     *
     */
    public CJsAreeProvenienze() {
    }

    /**
     *
     * @param where_condition String
     * @return String
     */
    public String delete_tab_aree_provenienze(String where_condition) {
	String errore = "";
	String del = "";
	TableDelete delete = null;
	HttpSession session = null;
	baseUser logged_user = null;
	try
	{
	    session = (WebContextFactory.get()).getSession(false);
	    if(session == null)
		return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

	    logged_user = Global.getUser(session);

	    delete = new TableDelete();
	    del = "DELETE FROM TAB_AREE_PROVENIENZE WHERE " + where_condition;
	    delete.deleteQuery(logged_user.db.getDataConnection(), del);
	}
	catch(Exception e)
	{
	    errore = e.getMessage() + " - " + del;
	}
	finally
	{
	    try
	    {
		delete.close();
		delete = null;
	    }
	    catch(Exception e)
	    {

	    }
	}
	return errore;
    }

    /**
     *
     * @param sal_mac_area_provenienze String
     * @return String
     */
    public String insert_tab_aree_provenienze(String sal_mac_area_provenienze) {
	String errore = "";
	String ins = "";
	TableInsert insert = null;
	String param[] = null;
	String provenienze[] = null;
	baseUser logged_user = null;
	HttpSession session = null;

	try
	{
	    session = (WebContextFactory.get()).getSession(false);
	    if(session == null)
		return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

	    logged_user = Global.getUser(session);

	    param = sal_mac_area_provenienze.split("[@]");

	    provenienze = param[3].split("[*]");

	    for(int i = 0; i < provenienze.length; i++)
	    {
		insert = new TableInsert();
		ins = "INSERT INTO TAB_AREE_PROVENIENZE (IDEN_SAL, IDEN_MAC, IDEN_ARE, IDEN_PRO) ";
		ins += "VALUES (" + param[0] + ", " + param[1] + ", " + param[2] + ", ";
		ins += provenienze[i] + ")";

		insert.insertQuery(logged_user.db.getDataConnection(), ins);
	    }
	}
	catch(Exception e)
	{
	    errore = e.getMessage() + " - " + ins;
	}
	finally
	{
	    try
	    {
		insert.close();
		insert = null;
	    }
	    catch(Exception e)
	    {

	    }
	}

	return errore;
    }


}
