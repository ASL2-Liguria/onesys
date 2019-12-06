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
package stampe.crystalclear;

import java.io.ByteArrayOutputStream;
import java.sql.Connection;

/**
 * Classe utilizzabile come interfaccia con l'esterno, in alternativa alla servlet.
 * 
 * @author matteos
 *
 */
public class Stampe {

	protected Parametri params;
	protected ByteArrayOutputStream baos;
	private Connection conn;
	
	/**
	 * Costruttore base.
	 */
	public Stampe() {
		baos = null;
		params = new Parametri();
	}
	
	/**
	 * Costruttore che usa un oggetto Parametri preesistente per la configurazione.
	 * 
	 * @param params
	 */
	public Stampe(Parametri params) {
		this.setParametri(params);
	}
	
	/**
	 * Imposta "params" come oggetto "Parametri" (contenente tutti i parametri di configurazione)
	 * della classe. Sovrascrive un eventuale oggetto gi&agrave; presente.
	 * 
	 * @param params
	 */
	public void setParametri(Parametri params) {
		this.params = params;
	}
	
	/**
	 * Aggiunge un parametro all'oggetto "Parametri" interno (contenente tutti i parametri di configurazione).
	 *  
	 * @param paramname
	 * @param paramvalue
	 */
	public void setParam(String paramname, String paramvalue) {
		params.setProperty(paramname,paramvalue);
	}
	
	/**
	 * Incorpora nell'oggetto Stampe un Object che potra' essere utilizzato
	 * dalle classi richiamate (con identificazione del tipo a runtime).
	 * Probabilmente l'oggetto sar&agrave; di tipo Connection. 
	 * 
	 * @param oggetto
	 */
	public void setConnectionOrRelevantObject(Connection conn) {
		this.conn = conn;
	}

	/**
	 * Restituisce il pdf elaborato, come array di byte. Se non &egrave; ancora stato
	 * elaborato (chiamando esegui()), lo elabora.
	 * 
	 * @return
	 * @throws ImagoStampeException esaminare e.getMessage().
	 */
	public byte[] getBytes() throws ImagoStampeException {
		if (baos == null)
			esegui();
		return baos.toByteArray();
	}
	
	/**
	 * Esegue il report. L'output pu&ograve; essere ottenuto in seguito da getBytes().
	 * 
	 * @throws ImagoStampeException
	 */
	public void esegui() throws ImagoStampeException {
		baos = new ByteArrayOutputStream();
		new StampeEngine(params,baos,conn);
	}
}
