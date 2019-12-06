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

import imago.crypto.CryptPasswordInterface;
import imago.http.baseClass.baseUser;
import imagoAldoUtil.checkUser.classUserManage;

import javax.servlet.ServletContext;

import org.directwebremoting.WebContextFactory;

import core.Global;

public class ajaxUserManage {
	public ajaxUserManage() {
	}

	/**
	 * metodo che controlla se un utente esiste o meno
	 * 
	 * @param utente
	 *            String
	 * @return boolean: true: esiste false:NON esiste
	 */
	public boolean ajaxExistUser(String utente) {

		boolean bolEsito = false;
		ServletContext myContext = null;

		myContext = WebContextFactory.get().getServletContext();
		if (myContext != null) {
			if (classUserManage.existUser(myContext, utente)) {
				bolEsito = true;
			} else {
				bolEsito = false;
			}
		}
		return bolEsito;
	}

	/**
	 * Controlla se e' corretta la coppia utente/pwd
	 * 
	 * 
	 * @param utente
	 *            String
	 * @param pwd
	 *            String
	 * @return boolean
	 */
	public boolean ajaxCheckUserPwd(String utente, String pwd) {
		boolean bolEsito = false;
		ServletContext contesto = null;

		contesto = WebContextFactory.get().getServletContext();
		if (contesto != null) {
			bolEsito = classUserManage.checkUserPwd(contesto, utente, pwd);
		}
		return bolEsito;
	}

	/**
	 * metodo che ritorna le provenienze x le quali e' abilitato l'utente
	 * 
	 * 
	 * 
	 * 
	 * @param utente
	 *            String
	 * @return String stringa di uscita: iden1*descr1@iden2*descr2@idenk*descrk
	 */
	public String ajaxGetProvenienzeAbilitate(String utente) {
		String strOutput = "";
		ServletContext contesto = null;

		contesto = WebContextFactory.get().getServletContext();
		if (contesto != null) {
			strOutput = classUserManage.getProvenienzeAbilitate(contesto, utente);
		}
		return strOutput;
	}

	/**
	 * aggiorna la password dell'utente
	 * 
	 * @param utente
	 *            String
	 * @param oldPwd
	 *            String
	 * @param newPwd
	 *            String
	 * @return boolean
	 */
	public boolean ajaxChangeUserPassword(String utente, String newPwd) {
		boolean bolEsito = false;
		ServletContext contesto = null;

		contesto = WebContextFactory.get().getServletContext();
		if (contesto != null) {
			bolEsito = classUserManage.changeUserPassword(contesto, utente, newPwd);
		}
		return bolEsito;
	}

	/**
	 * ritorna la password in chiaro
	 * 
	 * @param utente
	 *            String
	 * @return String
	 */
	public String ajaxGetFlatPwd(String utente) {
		String strOutput = "";
		ServletContext contesto = null;

		contesto = WebContextFactory.get().getServletContext();
		if (contesto != null) {
			strOutput = classUserManage.getFlatPwd(contesto, utente);
		}
		return strOutput;
	}

	/**
	 * verifica se la password di manager e' corretta
	 * 
	 * @return boolean
	 */
	public boolean ajaxCheckManagerPwd(String valore) {
		boolean bolEsito = false;
		ServletContext contesto = null;

		contesto = WebContextFactory.get().getServletContext();
		if (contesto != null) {
			bolEsito = classUserManage.checkManagerPwd(contesto, valore);
		}
		return bolEsito;
	}

	/**
	 * 
	 * ritorna la password criptata
	 * 
	 * @param utente
	 *            String
	 * @return byte[]
	 */
	public byte[] ajaxGetCryptedPwd(String utente) {
		byte[] listaByte = null;
		ServletContext contesto = null;

		contesto = WebContextFactory.get().getServletContext();
		if (contesto != null) {
			listaByte = classUserManage.getCryptedPwd(contesto, utente);
		}
		return listaByte;
	}

	/**
	 * controlla se la password sia ancora attiva
	 * 
	 * true: NON + attiva false: ok
	 * 
	 * @param utente
	 *            String
	 * @return boolean
	 */
	public boolean ajaxPasswordExpired(String utente) {
		boolean bolEsito = true;
		ServletContext contesto = null;

		contesto = WebContextFactory.get().getServletContext();
		if (contesto != null) {
			bolEsito = classUserManage.passwordExpired(contesto, utente);
		}

		return bolEsito;
	}

	/**
	 * controlla se un account utente sia ancora attivo o meno
	 * 
	 * true: NON + attivo false: OK
	 * 
	 * @param utente
	 *            String
	 * @return boolean
	 */
	public boolean ajaxLoginExpired(String utente) {
		boolean bolEsito = true;
		ServletContext contesto = null;

		contesto = WebContextFactory.get().getServletContext();
		if (contesto != null) {
			bolEsito = classUserManage.loginExpired(contesto, utente);
		}

		return bolEsito;
	}

	/**
	 * metodo che aggiorna il campo dei campi personali dell'utente
	 * 
	 * @param utente
	 *            String
	 * @param tipoWk
	 *            String
	 * @param value
	 *            String
	 * @return boolean
	 */
	public boolean ajaxSetPosizioneCampiWk(String tipoWk, String value) {
		boolean bolEsito = true;
		baseUser logged_user = null;

		logged_user = Global.getUser(WebContextFactory.get().getSession(false));
		if (logged_user != null) {
			try {
				logged_user.setPosizioneCampiWk(tipoWk, value);
			} catch (java.lang.Exception ex) {
				bolEsito = false;
			}
		}
		return bolEsito;
	}

	/**
	 * funzione che prende value in ingresso e ritorna la stringa convertita in
	 * modo criptato
	 * 
	 * @param value
	 *            String
	 * @return String
	 */
	public String getCryptedString(String value) {
		String strOutput = "";
		ServletContext contesto = null;
		byte[] listaByte = null;
		CryptPasswordInterface myObj = null;

		if (value == "") {
			return strOutput;
		}
		contesto = WebContextFactory.get().getServletContext();
		if (contesto != null) {
			try {
				Class myObjDefault = Class.forName(contesto.getInitParameter("CryptType"));
				myObj = (CryptPasswordInterface) myObjDefault.newInstance();
				listaByte = myObj.crypt(value);
				strOutput = classUserManage.fromByteToString(listaByte);
			} catch (java.lang.Exception ex) {
				ex.printStackTrace();
			}
		}

		return strOutput;
	}

}
