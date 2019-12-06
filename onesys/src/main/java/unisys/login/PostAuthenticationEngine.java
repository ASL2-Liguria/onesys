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
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package unisys.login;

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.dbConnections;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.text.SimpleDateFormat;
import java.util.Enumeration;
import java.util.Hashtable;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import oracle.jdbc.OraclePreparedStatement;
import org.json.JSONObject;
import unisys.baseObj.UniSysConfig;
import unisys.baseObj.UniSysPC;
import unisys.baseObj.UniSysUser;
import unisys.userLog;

/**
 *
 * @author linob
 */
public class PostAuthenticationEngine {
	private static final long serialVersionUID = 0;

	private static final String CONTENT_TYPE = "text/plain";

	private static final String _GENERIC_ERROR = "KO$Errore interno<br />Contattare assistenza";

	private static final String _TAB_UTE_LOG = "UTENTI_LOGGATI";

	private ServletContext sContext = null;

	private HttpServletRequest sRequest = null;

	private HttpServletResponse sResponse = null;        
        
	private HttpSession session = null;

	private Hashtable<String, String> hRequest = null;

	private UniSysConfig loginConfig = null;

	private UniSysUser baseUser = null;

	private UniSysConfig baseGlobal = null;

	private UniSysPC basePC = null;

	private String ip = null;

	private String nomeHost = null;

	private dbConnections dbConns = null;

	// private Connection conn = null;

	private ElcoLoggerInterface logger = null;


	
	enum Azione {
		login, cambiapassword
	}

        public PostAuthenticationEngine(ServletContext pCont,HttpServletRequest pReq,HttpServletResponse pResp,HttpSession pSess) /*throws Exception*/ {
            this.sContext   = pCont;
            this.sRequest   = pReq;
            this.sResponse  = pResp;
            this.session    = pSess;
            this.logger = new ElcoLoggerImpl(getClass().getSimpleName());
            this.hRequest = new Hashtable<String, String>();
            this.dbConns = new dbConnections();
        }
                
	public String gestione() {

                Class<?> classLogin = null;
		LoginAbstract loginObject = null;
                String azione = "";
		/*
		 * Se non ricevo i parametri "username" e "password" torno alla login
		 * page
		 */
		if (!this.sRequest.getParameterMap().containsKey("username") && !this.sRequest.getParameterMap().containsKey("password")) {
			// this.logger.warn("Dati di login non ricevuti - Ip:" +
			// this.sRequest.getRemoteAddr());
			this.logger.info("Dati di login non ricevuti - Ip:" + this.sRequest.getRemoteAddr());
		}

		/* Legge dalla tabella PARAMETRI_PAGE o GES_CONFIG_PAGE */
		this.logger.info("Inizio lettura parametri dalla tabella di configurazioni");

		this.loginConfig = new UniSysConfig(UniSysConfig.GRUPPO_LOGIN);

		this.logger.info("Parametri di configurazione: USO_DHCP" + this.loginConfig.getParametro("USO_DHCP") + "RELOAD_CONTEXT" + this.loginConfig.getParametro("RELOAD_CONTEXT") + "LOGIN_URL" + this.loginConfig.getParametro("LOGIN_URL") + "LOGIN_CLASS" + this.loginConfig.getParametro("LOGIN_CLASS") + "TAB_PC" + this.loginConfig.getParametro("TAB_PC") + "TAB_GLOBALI" + this.loginConfig.getParametro("TAB_GLOBALI") + "TAB_WEB" + this.loginConfig.getParametro("TAB_WEB"));

		/*
		 * Legge la classe di Login da utilizzare da web.xml, altrimenti da
		 * configurazione su db
		 */
		String classe_login = sContext.getInitParameter("LOGIN_CLASS");
		if (classe_login == null || classe_login.length() == 0)
			classe_login = this.loginConfig.getParametro("LOGIN_CLASS");
		try {
			classLogin = Class.forName(classe_login);
		} catch (ClassNotFoundException e) {
			// this.logger.error("Class not found - Verificare " +
			// this.config.getParametro("LOGIN_CLASS"));
			this.logger.info("ERRORE - Class not found - Verificare " + this.loginConfig.getParametro("LOGIN_CLASS"));
			e.printStackTrace();
		}

		/*
		 * Istanzio un oggetto del tipo letto in precedenza (deve rispettare
		 * l'interfaccia iLogin)
		 */
		try {
			loginObject = (LoginAbstract) classLogin.getConstructor(new Class[] { ServletContext.class, HttpServletRequest.class, HttpServletResponse.class }).newInstance(this.sContext, this.sRequest, this.sResponse);
		} catch (Exception e) {
			e.printStackTrace();
			this.logger.info("Errore durante l'inizializzazione della classe di Login: " + classLogin);
			// this.logger.error("Errore durante l'inizializzazione della classe di Login: "
			// + classLogin);

			return _GENERIC_ERROR+" "+e.getMessage();
		}

		try {
			this.leggiRequest();

			String user = this.getValueRequest("username");
			String psw  = this.getValueRequest("password");
			azione      = this.getValueRequest("azione");
			this.logger.info("user: " + user + ",psw: " + psw);

			loginObject.setConnection(this.dbConns);

			if (user == "")
				throw new Exception("KO$Accesso negato<br />Inserire username.");
			if (psw == "")
				throw new Exception("KO$Accesso negato<br />Inserire password.");
                        this.logger.info("azione: " + Azione.valueOf(azione));
			switch (Azione.valueOf(azione)) {
			case login:
				loginObject.verifyLogin(user, psw);
	
				/*
				 * this.conn = this.dbConns.getWebConnection();
				 * 
				 * if(force.equals("S")) { this.forzaLogout(user); } else {
				 * this.checkUtentiLoggati(this.conn, user); }
				 */
	
				this.creaBaseUser(user);
	
				//this.creaBaseGlobal();

				String force = this.getValueRequest("forceLogout");
				this.ip = this.getValueRequest("ipRilevato");
				this.nomeHost = this.getValueRequest("nomeHost");
	
				this.session = this.sRequest.getSession(true);
	
				// this.creaBasePC();
				this.logger.info("Caricamento attributi di sessione");
	
				baseUser.saveInSession(session);
	
				this.session.setAttribute("indirizzo_pc", this.ip); // TEMPORANEO:
                                // Serve per il
                                // tapullo di
                                // jack (top
                                // secret ;))
				this.session.setAttribute("nomeHost", this.nomeHost);
	
				this.logger.info("Fine caricamento attributi di sessione");
				// this.session.setAttribute("parametri_globali", this.baseGlobal);
				// this.session.setAttribute("parametri_pc", this.basePC);
	
				// this.insertLog();
				break;
			case cambiapassword:
				String password_nuova = this.getValueRequest("password_nuova");
				loginObject.cambiaPwd(user, psw, password_nuova);
			}


			return "OK$" + loginConfig.getParametro("LOGIN_URL");
		} catch (Exception ex) {
                        this.logger.info("Errore durante " + Azione.valueOf(azione));
			return ex.getMessage();
		}
	}

	/**
	 * Inserisce in una hash table i parametri ricevuti
	 * 
	 * @throws Exception
	 */
	private void leggiRequest() throws Exception {
		String chiave = null;
		String valore = null;
		Enumeration<?> a_chiave = null;

		this.hRequest.clear();

		if (this.sRequest != null) {
			try {
				a_chiave = this.sRequest.getParameterNames();

				while (a_chiave.hasMoreElements()) {
					chiave = (String) a_chiave.nextElement();

					if (chiave != null) {
						valore = this.sRequest.getParameter(chiave);

						this.hRequest.put(chiave, valore == null ? new String("") : valore.trim());
					}
				}
			} catch (Exception ex) {
				ex.printStackTrace();
				// this.logger.error("Errore interno - leggiRequest() - " +
				// ex.getMessage());
				this.logger.info("Errore interno - leggiRequest() - " + ex.getMessage());
				throw new Exception(_GENERIC_ERROR);
			}
		} else {
			this.logger.info("Errore interno - leggiRequest() - Oggetto request nullo!");
			// this.logger.error("Errore interno - leggiRequest() - Oggetto request nullo!");
			throw new Exception(_GENERIC_ERROR);
		}
	}

	/**
	 * Ritorna un valore dalla hash table della request
	 * 
	 * @param chiave
	 * @return valore
	 */
	private String getValueRequest(String chiave) {
		return this.hRequest.get(chiave) == null ? new String("") : this.hRequest.get(chiave);
	}

	/**
	 * Crea l'oggetto BaseUser
	 * 
	 * @param webuser
	 * @throws Exception
	 */
	private void creaBaseUser(String webuser) throws Exception {
		try {
			this.baseUser = new UniSysUser(webuser, this.dbConns, this.loginConfig.getParametro("TAB_WEB"));
			this.baseUser.load();
		} catch (Exception ex) {
			ex.printStackTrace();
			this.logger.error("creaBaseUser(" + webuser + ") - Errore durante la creazione di baseUser");
			throw new Exception(_GENERIC_ERROR);
		}
	}

	/**
	 * Crea l'oggetto BaseGlobal
	 * 
	 * @throws Exception
	 */
	private void creaBaseGlobal() throws Exception {
		try {
			this.baseGlobal = new UniSysConfig();
			this.sContext.setAttribute("parametri_globali", this.baseGlobal);
		} catch (Exception ex) {
			ex.printStackTrace();
			this.logger.error("creaBaseGlobal() - Errore durante la creazione di baseGlobal");
			throw new Exception(_GENERIC_ERROR);
		}
	}

	/**
	 * Crea l'oggetto BasePC
	 * 
	 * @throws Exception
	 */
	private void creaBasePC() throws Exception {
		try {
			if (this.loginConfig.getParametro("USO_DHCP").equalsIgnoreCase("S"))
				this.ip = this.nomeHost;

			this.basePC = new UniSysPC(this.ip, this.dbConns, this.loginConfig.getParametro("TAB_PC"));
			this.basePC.load();
		} catch (java.lang.Exception ex) {
			ex.printStackTrace();
			throw new Exception("KO$Errore durante la creazione di basePC<br />Ip: " + this.ip);
		}
	}

	/**
	 * Verifica se l'utente passato a parametro risulta gia' loggato In caso
	 * positivo ritorna una stringa JSON con i dati di localizzazione
	 * 
	 * @param user
	 *            - WebUser
	 * @throws Exception
	 */
	private void checkUtentiLoggati(Connection conn, String user) throws Exception {
		ResultSet rs = null;
		boolean ok = false;

		try {
			OraclePreparedStatement ps = (OraclePreparedStatement) conn.prepareStatement("select * from " + _TAB_UTE_LOG + " where WEBUSER=:pUser and SESSIONE_SCADUTA = 'N'");
			ps.setStringAtName("pUser", user);

			rs = ps.executeQuery();
			ok = rs.next();

			if (ok) {
				String key = new String("");
				String value = new String("");

				ResultSetMetaData metadata = rs.getMetaData();
				int columnCount = metadata.getColumnCount();

				JSONObject store = new JSONObject();

				for (int i = 1; i < columnCount; i++) {
					key = metadata.getColumnName(i);
					value = rs.getString(i);
					store.put(key, value);
				}

				throw new Exception("FF$" + store.toString());
			}
		} catch (java.lang.Exception ex) {
			throw new Exception(ex.getMessage());
		} finally {
			rs.close();
			rs = null;
			conn.close();
			conn = null;
		}
	}

	/**
	 * Inserisce una riga nella tabella degli utenti loggati
	 * 
	 * @throws Exception
	 */
	private void insertLog() throws Exception {
		try {
			userLog uLog = new userLog(_TAB_UTE_LOG);

			uLog.setWebuser(this.baseUser.getWebuser());
			uLog.setIp(this.ip);
			uLog.setNomeHost(this.nomeHost);
			uLog.setWebserver(this.sRequest.getServerName());
			uLog.setDataAccesso(getStringOggi());
			uLog.setDescrUte(this.baseUser.getParametro("DESCRIPTION"));
			uLog.setUteSession(this.session.getId());

			uLog.insertLog(this.dbConns);
		} catch (java.lang.Exception ex) {
			ex.printStackTrace();
			throw new Exception("KO$" + ex.getMessage());
		}
	}

	/**
	 * Forza il logout di un utente gia' loggato
	 * 
	 * @param user
	 *            - WebUser
	 * @throws Exception
	 */
	private void forzaLogout(String user) throws Exception {
		try {
			userLog uLog = new userLog(_TAB_UTE_LOG);

			uLog.setWebuser(user);

			uLog.forzaLogout(this.dbConns);
		} catch (java.lang.Exception ex) {
			ex.printStackTrace();
			throw new Exception("KO$" + ex.getMessage());
		}
	}

	/**
	 * Calcola Data e Ora attuali
	 * 
	 * @return Data/Ora attuali
	 */
	private String getStringOggi() {
		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
		return sdf.format(new java.util.Date());
	}



         /** Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
         * @param request servlet request
         * @param response servlet response
         *
         *
         */
 
        
}






