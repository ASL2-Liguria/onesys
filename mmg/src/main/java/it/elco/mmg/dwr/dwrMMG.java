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
package it.elco.mmg.dwr;

import it.elco.listener.ElcoContextInfo;
import it.elco.mmg.anagrafica.AnagraficaRemotaException;
import it.elco.mmg.anagrafica.RicercaRemotaWhale;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * 
 * @author lucas
 *
 */
public class dwrMMG {
	
	private final ServletContext context;
	private final HttpServletRequest request;
	private final HttpSession session;
	private final Logger log;
	private final String sito;
	private final String versione;

	public dwrMMG() throws Exception {
		this.log = LoggerFactory.getLogger(getClass());
		this.context = WebContextFactory.get().getServletContext();
		this.request = WebContextFactory.get().getHttpServletRequest();
		this.session = this.request.getSession(false);
        this.sito = ElcoContextInfo.getSystemParameter("SITO");
        this.versione = ElcoContextInfo.getSystemParameter("VERSIONE");
	}
	
	public int RicercaInRemoto(String[] aBind, String[] aVal) throws AnagraficaRemotaException {

		/*
		 * cogn=COGNOME nome=NOME data=DATA NASCITA codfisc=CODICE FISCALE
		 */

		short num_record = -1;
		RicercaRemotaWhale obj = null;
		
		obj = new RicercaRemotaWhale();
		try {
			obj.setUserSession(session);
			obj.setConnections();

			obj.RimuoviDati();

			num_record = obj.ricerca(aBind, aVal);
			
			if (num_record > 0) {
				obj.ciclaRecord();
			}
			
			/*
			 * Chiudo le connessioni web e dati
			 */

		} catch (AnagraficaRemotaException are) {
			log.info(are.getMessage());
			throw are;
		} catch (Exception ex) {
			log.error(ex.getLocalizedMessage());
			throw new AnagraficaRemotaException("Errore nella ricerca remota - " + ex.getLocalizedMessage());
		} finally {
			try {
				obj.destroy();
			} catch (Exception e) {
				log.error(e.getLocalizedMessage(), e);
			}
		}

		return num_record;
	}
}
