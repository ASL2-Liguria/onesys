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
 * CJsCheckOrdineCdc.java
 *
 * Created on 25 settembre 2006, 8.58
 */

package jsRemote;

import imago.http.baseClass.baseUser;
import imago.sql.TableResultSet;
import imago.util.CGestioneErrori;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import core.Global;

/**
 * Classe che effettua il controllo sul campo ORDINE della tabella
 * CENTRI_DI_COSTO.
 * Se esiste un record con il valore del campo ordine uguale a quello inserito dall'utente
 * dalla finestra di inserimento di un cdc il metodo checkOrdineCdc restituisce 0 altrimenti 1
 *
 * @author  elenad
 */
public class CJsCheckOrdineCdc {

    /** Creates a new instance of CJsCheckOrdineCdc */
    public CJsCheckOrdineCdc() {
    }


    /**
     *
     * @param ordine CENTRI_DI_COSTO.ordine
     * @return 0: record presente nella tabella centri_di_costo
     *         1: record non presente nella tabella dei centri_di_costo
     *         stringa di errore se la select restituisce una eccezione
     */
    public String checkOrdineCdc(String ordine)
    {
        String 		error 	= "";
        HttpSession 	session = (WebContextFactory.get()).getSession(false);

        if(session == null)
            return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";

        baseUser logged_user = Global.getUser(session);


        if(ordine == null || ordine.equalsIgnoreCase(""))
            return "valori nulli passati alla jsRemote.CJsCheckOrdineCdc";

        TableResultSet trs = new TableResultSet();
        try{
            trs.getResultSet(logged_user.db.getDataConnection(), "SELECT ORDINE FROM CENTRI_DI_COSTO WHERE ORDINE = " + ordine);
            if(trs.rs.next()){
                /*Record presente nel db*/
                error = "0";
            }
            else
                /*Record NON presente nel db*/
                error = "1";
            trs.close();

        }
        catch(Exception e){
            error = "Errore in jsRemote.CJsCheckOrdineCdc.checkOrdineCdc(): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
        }
        return error;
    }

}
