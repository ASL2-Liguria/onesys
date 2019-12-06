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
 * CJsGestioneAnagrafica.java
 * 
 * Created on 4 ottobre 2006, 17.06
 */

package jsRemote;

import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.baseUser;
import imago.sql.AnagraficaRemota;
import imago.sql.TableDelete;
import imago.sql.TableResultSet;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import core.Global;

/**
 * Classe che gestisce le operazioni effettuate dall'anagrafica remota. Bisogna
 * controllare se il record trovato in remoto esiste in locale in caso
 * affermativo aggiornarlo con l'anagrafica remota e procedere con l'operazione
 * di modifica o inserimento esame o visualizzazione degli esami.La
 * cancellazione in remoto non si può effettuare. Nel caso in cui l'anagrafica
 * non è presente in ANAG allora si procederà all'inserimento.
 * 
 * Gestisce altresì il metodo eliminaEsenzioniPaziente() utilizzato per
 * effettuare la cancellazione dalla tabella ESENZIONI_PAZIENTE; nel caso in cui
 * si inseriscano delle esenzioni durante l'operazione di inserimento di una
 * anagrafica e non si effettua il salvataggio del paziente, tali record salvati
 * nella tabella delle esenzioni con iden_anag = -1 devono essere eliminati.
 * 
 * Gestisce anche la ricerca del reparto legato ad un numero di ricovero. Dalla
 * Ricerca Pazienti -> Numero Nosologico viene ricercato il reparto che è
 * associato al nosologico ricercato.
 * 
 * @author elenad
 */
public class CJsGestioneAnagrafica{
	
	/** Creates a new instance of CJsGestioneAnagrafica */
	public CJsGestioneAnagrafica(){
	}
	
	/**
	 * 
	 * @param iden_remote_anag
	 *           String
	 * @return String
	 */
	public String gestione_anagrafica(String iden_remote_anag){
		long iden_anag = -1;
		String messaggio = "";
		Class classe = null;
		AnagraficaRemota obj = null;
		HttpSession session = null;
		baseUser logged_user = null;
		baseGlobal v_globali = null;
		ServletContext context = null;
		
		session = (WebContextFactory.get()).getSession(false);
		context = (ServletContext) (WebContextFactory.get()).getServletContext();
		
		if(session == null)
			return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
		
		try {
			logged_user = Global.getUser(session);
			v_globali = (baseGlobal) context.getAttribute("parametri_globali");
			
			classe = Class.forName(v_globali.classeAnagraficaRemota);
			obj = (AnagraficaRemota) classe.newInstance();
			
			/*
			 * Richiamato per gestire l'apertura del file di log che viene chiuso
			 * nelle operazioni di ricerca, inserimento, modifica paziente e il
			 * recupero delle informazioni nel web.xml
			 */
			obj.setServletContext(context);
			
			obj.setConnections(logged_user.db);
			
			/* Controllo se esiste ANAG.iden */
			long iden_anag_esistente = obj.EsisteAnagrafica(iden_remote_anag);
			if(iden_anag_esistente == 0) {
				/*
				 * Il record remoto non esiste in locale allora inserisco il record
				 * in locale
				 */
				iden_anag = obj.InsertAnagrafica(iden_remote_anag);
			}
			else {
				/*
				 * Il record remoto esiste già in locale allora passo ANAG.iden.
				 * Richiamo il metodo di modifica per avere (soprattutto nel caso
				 * della ricerca remota+locale) il record inlocale sempre aggiornato
				 * (poichè in remoto potrebbero averla modificata)
				 */
				obj.UpdateAnagrafica(iden_remote_anag);
				iden_anag = iden_anag_esistente;
			}
			
			messaggio = String.valueOf(iden_anag);
		}
		catch (Exception e) {
			messaggio = "jsRemote.CJsGestioneAnagrafica.gestione_anagrafica(): " + e.getMessage();
		}
		return messaggio;
	}
	
	/**
	 * 
	 * @param idenAnag_sorgente
	 *           String
	 * @return String
	 */
	public String eliminaEsenzioniPaziente(String idenAnag_sorgente){
		String error = "";
		String idenSorgente[] = null;
		HttpSession session = null;
		baseUser logged_user = null;
		TableDelete delete = null;
		String del = null;
		
		try {
			session = (WebContextFactory.get()).getSession(false);
			if(session == null)
				return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
			
			idenSorgente = idenAnag_sorgente.split("[*]");
			logged_user = Global.getUser(session);
			
			delete = new TableDelete();
			del = "DELETE FROM ESENZIONI_PAZIENTE WHERE IDEN_ANAG = " + idenSorgente[0];
			
			delete.deleteQuery(logged_user.db.getDataConnection(), del);
		}
		catch (Exception e) {
			error = "jsRemote.CJsGestioneAnagrafica.eliminaEsenzioniPaziente() " + e.getMessage();
		}
		finally {
			try {
				delete.close();
			}
			catch (Exception e) {
				
			}
		}
		return error + '@' + idenSorgente[1];
	}
	
	/**
	 * 
	 * @param select
	 *           String
	 * @return String
	 */
	public String getRepartoRicovero(String iden_anag, String select){
		int iden_provenienza = 0;
		String result = null;
		TableResultSet trs = null;
		HttpSession session = null;
		baseUser logged_user = null;
		
		session = (WebContextFactory.get()).getSession(false);
		if(session == null)
			return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
		
		try {
			logged_user = Global.getUser(session);
			
			trs = new TableResultSet();
			trs.getResultSet(logged_user.db.getDataConnection(), select);
			if(trs.rs.next()) {
				iden_provenienza = trs.rs.getInt("provenienza");
				result = iden_anag + "," + String.valueOf(iden_provenienza);
			}
			else
				result = iden_anag + ",''";
		}
		catch (Exception e) {
			result = this.getClass().getName() + ".getRepartoRicovero(" + select + "): " + e.getMessage();
		}
		finally {
			try {
				trs.close();
			}
			catch (Exception e) {
				trs = null;
			}
		}
		return result;
	}
	
}
