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
 * CJsCheck.java
 *
 * Created on 22 settembre 2006, 12.05
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
 * Classe che controlla se esiste un record nel db o meno.
 *
 * @author  elenad
 */
public class CJsCheck {

    /** Creates a new instance of CJsCheck */
    public CJsCheck() {
    }

    /**
     * Metodo che controlla se esiste o meno un record in tabella.
     * @param valori variabile che contiene: campo della select @ nome tabella @ where condition
     * @return 0: record non presente in tabella
     *         1: record presente in tabella ed attivo(verrà richiamata la funzione js funzione() dalla funzione di callback)
     *         2: record presente in tabella ed inattivo(verrà richiamata la funzione js funzione() dalla funzione di callback)
     *         stringa di errore se la select restituisce una eccezione
     */
    public String checkCodiceUnivoco(String valori)
    {
        HttpSession 	session = (WebContextFactory.get()).getSession(false);

        if(session == null)
            return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";


        baseUser logged_user = Global.getUser(session);


        if(valori == null || valori.equalsIgnoreCase(""))
            return "Parametri nulli passati alla jsRemote.CJsCheck.checkCodiceUnivoco()";

        String  attivo 			= null;
        int     iden   			= 0;
        String  error  			= "";
        String  fasce_orarieDescr    	= "";
        String  tab_refCod_ref       	= "";

        String split [] = valori.split("[@]");
        String nome_campi_select = split[0];
        String tabella = split[1];
        String nome_campo = split[2];
        String valore_campo = "";
        try{
        	valore_campo = split[3];
        }
        catch(Exception e)
        {
        	/*Caso in cui il valore del campo da ricercare è vuoto.*/
        }
        String where_cond = null;
        if(valore_campo.trim().equalsIgnoreCase(""))
        	where_cond = nome_campo;
        else
        	where_cond = nome_campo + " = '" + valore_campo + "'";



        TableResultSet trs = new TableResultSet();
        try{
            trs.getSelectColumnsWhereCond(logged_user.db.getDataConnection(), nome_campi_select, tabella, where_cond);
            if(trs.rs.next())
            {
                attivo = trs.rs.getString("attivo");
                iden   = trs.rs.getInt("iden");
                if(tabella.equalsIgnoreCase("tab_fasce_orarie"))
                {
                	fasce_orarieDescr = trs.rs.getString("descr");
                }
                if(tabella.equalsIgnoreCase("tab_ref"))
                	tab_refCod_ref = trs.rs.getString("cod_ref");
            }
            trs.close();
            if(attivo == null)
                error = "0";/*record non presente in db*/
            else
                if(attivo.equalsIgnoreCase("S"))
                    error = "1";/*record esistente ed attivo*/
                else
                    error = "2";/*record esistente e inattivo*/
        }
        catch(Exception e){
            error = "Errore in jsRemote.CJsCheck.checkCodiceUnivoco(): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
        }
        if(tabella.equalsIgnoreCase("tab_fasce_orarie"))
        	return error + "@"+ nome_campo + "@" + iden + "@" + tabella + "@" + fasce_orarieDescr;
        else
        	if(tabella.equalsIgnoreCase("tab_ref"))
        		return error + "@"+ nome_campo + "@" + iden + "@" + tabella + "@" + tab_refCod_ref;
        	else
        		return error + "@"+ nome_campo + "@" + iden + "@" + tabella + "@" + valore_campo;
    }

    /**
     * Metodo che riattiva un record disattivo
     * @param contiene il nome della tabella su cui verrà effettuato l'update + l'iden del record
     * 		  + il valore del campo che deve essere univoco per ogni record nella determinata tabella
     * @return una stringa diversa da vuota nel caso in cui si sia verificato
     * 		   un errore nell'operazione di update(eccezione)
     * 		   + il nome della tabella
     * 		   + il valore del campo che deve essere univoco
     */
    public String riattiva_record(String tabella_iden_valoreCampo)
    {
        HttpSession 	session = (WebContextFactory.get()).getSession(false);

        if(session == null)
            return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

        baseUser logged_user = Global.getUser(session);


    	String tab_iden_valoreCampo [] = tabella_iden_valoreCampo.split("[@]");
    	String errore = "";
    	TableUpdate upd = new TableUpdate();

    	String update = "UPDATE "+ tab_iden_valoreCampo[0] +" SET ATTIVO = 'S' WHERE IDEN = " + tab_iden_valoreCampo[1];
    	try{
    		upd.updateQuery(logged_user.db.getDataConnection(), update);
    		upd.close();
    	}
    	catch(Exception e){
    		errore = "CJsCheck.riattiva_record(): " + e;
    	}
    	String res = "";
    	try{
    		res = errore + '@' + tab_iden_valoreCampo[0] + '@' + tab_iden_valoreCampo[2];
    	}
    	catch(Exception e){
    		/*Caso particolare della fascia oraria che fa il controllo sull'univocità di 2 campi:
    		 * ora_ini ed ora_fine.Non viene passata al metodo il valore da associare
    		 * al campo di ricerca dopo la riattivazione del record*/
    		res = errore + '@' + tab_iden_valoreCampo[0] + '@' + tab_iden_valoreCampo[3];
    	}
    	return res;
    }


    /*
     * Metodo che effettua la ricerca, mediante i parametri passati in input, dell'esistenza
     * o meno di un record
     * */
    public String esistenzaCodice(String param)
    {
        HttpSession 	session = (WebContextFactory.get()).getSession(false);

        if(session == null)
            return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

        baseUser logged_user = Global.getUser(session);


    	if(param == null || param.equalsIgnoreCase(""))
            return "Parametri nulli passati alla jsRemote.CJsCheck.esistenzaCodice()";


    	String split [] = param.split("[@]");
        String nome_campi_select = split[0];
        String tabella = split[1];
        String where_cond = split[2];
        String record_esistente = "0";

        TableResultSet trs = new TableResultSet();
        try{
            trs.getSelectColumnsWhereCond(logged_user.db.getDataConnection(), nome_campi_select, tabella, where_cond);
            if(trs.rs.next())
            {
            	record_esistente = "1";
            }
            trs.close();
        }
    	catch(Exception e){
    		record_esistente = "CJsCheck.esistenzaCodice(): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
    	}
    	return record_esistente;
    }
}
