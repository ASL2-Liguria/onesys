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
package unisys.baseObj;

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

import java.io.Serializable;
import java.util.Enumeration;
import java.util.Properties;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

import org.json.JSONObject;

public class baseObj implements Serializable, HttpSessionBindingListener {
	
	private static final long serialVersionUID = 1L;
	
	protected transient ElcoLoggerInterface logger = null;
	
	/**
	 * Hash table (Properties) contenente tutti i valori letti dalla vista di
	 * configurazione
	 * 
	 * Utilizzare i metodi baseObj.getProperty e baseObj.setProperty
	 */
	private Properties properties = null;
	
	protected baseObj() {
		this.logger = new ElcoLoggerImpl(this.getClass().getSimpleName());
		this.properties = new Properties();
		this.properties.clear();
	}

	@Override
	public void valueBound(HttpSessionBindingEvent arg0) {
	}

	@Override
	public void valueUnbound(HttpSessionBindingEvent arg0) {
	}
	

	/**
	 * Ritorna una stringa JSON con i dati dell'utente. Generato sul momento
	 * (JSONObject non e' serializzabile).
	 * 
	 * @return JSON
	 */
	public String getJson() {
		JSONObject json = new JSONObject();
		Enumeration<Object> enm = properties.keys();
		while (enm.hasMoreElements()) {
			String key = (String) enm.nextElement();
			try {
				json.put(key, properties.get(key));
			} catch (Exception jse) {
				logger.error(jse);
			}
		}
		return json.toString();
	}


	/**
	 * Ritorna un dato dell'utente preso dalla hash table hashBaseUser
	 * 
	 * @param chiave
	 * @return valore
	 */
	public String getParametro(String chiave) {
		return this.properties.getProperty(chiave) == null ? new String("") : this.properties.getProperty(chiave);
	}
	
	public void setParametro(String chiave, String valore) {
		if (chiave != null)
			properties.setProperty(chiave, valore == null ? new String("") : valore);
	}
}
