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
package unisys.menu;

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago.sql.dbConnections;
import imago_jack.imago_function.str.functionStr;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import oracle.jdbc.OraclePreparedStatement;

import org.apache.ecs.html.A;
import org.apache.ecs.html.Div;
import org.apache.ecs.html.FieldSet;
import org.apache.ecs.html.H3;
import org.apache.ecs.html.IMG;
import org.apache.ecs.html.LI;
import org.apache.ecs.html.Legend;
import org.apache.ecs.html.P;
import org.apache.ecs.html.Span;
import org.apache.ecs.html.UL;

import unisys.baseObj.UniSysConfig;
import unisys.baseObj.UniSysUser;
import unisys.layout.Page;

/**
 * Classe per la creazione della pagina UniSys
 * 
 * Configurabile tramite la vista IMAGOWEB.VIEW_US_MENU
 * 
 * @author Fabrizio
 */
public class MenuPrincipale {
	private static final String _VIEW_MENU = "VIEW_US_MENU";

	private static final String _VIEW_INFO = "VIEW_US_INFO";

	HttpSession mySession;

	ServletContext myContext;

	HttpServletRequest myRequest;

	HttpServletResponse myResponse;

	dbConnections myConnections = null;

	functionStr fStr = null;

	String ipRilevato;

	String nomeHost;

	String login;

	String tipomed;

	String gruppomed;

	String abilitaNewHome;

	UniSysUser bu;

	private UniSysConfig loginConfig = null;
	
	private Page page = null;

	private ElcoLoggerInterface logger = new ElcoLoggerImpl(this.getClass());

	/**
	 * 
	 * @param cont
	 * @param req
	 * @param response
	 * @param sess
	 */
	public MenuPrincipale(ServletContext cont, HttpServletRequest req, HttpServletResponse response, HttpSession sess) {
		this.myContext = cont;
		this.myRequest = req;
		this.mySession = sess;
		this.myResponse = response;
		this.fStr = new functionStr();
		this.loginConfig = new UniSysConfig(UniSysConfig.GRUPPO_LOGIN);
	}

	/**
	 * Sessione: .getSession(false) -> prende la sessione creata dalla pagina
	 * precedente
	 * 
	 * @param cont
	 * @param req
	 */
	public MenuPrincipale(ServletContext cont, HttpServletRequest req, HttpServletResponse response) {
		this(cont, req, response, req.getSession(false));
	}

	/**
	 * Metodo per la generazione della pagina
	 * 
	 * @return html
	 */
	public String initMenu() {
		logger.debug("Start generazione pagina - MenuPrincipale.initMenu()");

		try {
			logger.debug("1/4 - Controllo sessione");
			checkSessione(); // Controllo della presenza di una sessione. Se non
								// presente, avvia la pagina di login

			logger.debug("2/4 - Lettura parametri");
			readParams(); // Lettura parametri di sessione

			logger.debug("3/4 - Lettura dati baseUser [" + this.login + "]");
			readBaseUser(); // Lettura dati utente

			logger.debug("4/4 - Creazione pagina");
			drawPage(); // Disegna la pagina
		} catch (Exception e) {
			logger.error("Errore generazione pagina");

			this.page = new Page("UniSys - Errore", this.myContext);
			this.page.addToBody(e.getMessage());

			e.printStackTrace();
		}

		logger.debug("End generazione pagina - MenuPrincipale.initMenu()");

		return this.page.generaPagina();
	}

	/**
	 * Disegna la pagina
	 * 
	 * @throws Exception
	 */
	private void drawPage() throws Exception {
		this.page = new Page("UniSys", this.myContext);
		this.page.addCss("std/css/LayoutHomepage/homepage.css");

		this.creaBody();

		this.page.addToBody(this.formInput());
		this.page.addToBody(this.creaJsInfo());

		this.page.addJs("std/jscript/engine/jquery-min.js");
		this.page.addJs("std/jscript/Homepage/function.js");
	}

	/**
	 * Elementi html della pagina
	 */
	private void creaBody() {
		Div wrap = new Div();
		wrap.addAttribute("id", "wrap2");

		IMG logo = new IMG("images/logo.jpg");
		logo.addAttribute("id", "logo");

		Div sfAzz = new Div();
		sfAzz.addAttribute("id", "sfAzz");

		wrap.addElement(logo);
		wrap.addElement(sfAzz);
		wrap.addElement(this.drawInfo());

		wrap.addElement(this.drawMenu());

		this.page.addToBody(wrap.toString());
	}
	
	private String formInput(){
		String form_param = "<form action=\"Authentication\" accept-charset=\"UTF-8\" method=\"post\" id=\"idAttiva\">\n"
				+ "	<input type=\"hidden\" name=\"idAttivaApplet\" id=\"idAttivaApplet\" value=\"" + this.loginConfig.getParametro("ATTIVA_APPLET") + "\">\n\n"
				+ "	<input type=\"hidden\" name=\"idAttivaComped\" id=\"idAttivaComped\" value=\"" + this.loginConfig.getParametro("ATTIVA_COMPED") + "\">\n\n" + "</form>\n";
		return form_param;
	}
	/**
	 * Creazione riquadro informazioni
	 * 
	 * @return
	 */
	private String drawInfo() {
		String html = new String("");

		String query = null;
		Connection conn = null;
		OraclePreparedStatement ps = null;
		ResultSet rs = null;

		query = "select * from " + _VIEW_INFO + " where codice_gruppo = :codice_gruppo";

		try {
			logger.debug("drawInfo() - getConnection");
			conn = this.myConnections.getWebConnection();

			logger.debug("drawInfo() - esecuzione query: " + query + " con :codice_gruppo = " + this.gruppomed);

			ps = (OraclePreparedStatement) conn.prepareStatement(query, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ps.setStringAtName("codice_gruppo", this.gruppomed);

			rs = ps.executeQuery();

			if (rs.next()) {
				rs.previous();

				while (rs.next()) {
					P info = new P();
					info.addAttribute("class", "Info");

					Span func = new Span();
					func.addAttribute("class", "func");
					func.addElement(rs.getString("DESCRIZIONE"));

					Span data = new Span();
					data.addAttribute("class", "data");
					data.addElement("(" + rs.getString("DATA") + ")");

					Span tit = new Span();
					tit.addAttribute("class", "tit");
					tit.addElement(rs.getString("TITOLO"));

					Span icoInfo = new Span();
					icoInfo.addAttribute("class", "info");
					icoInfo.addAttribute("title", rs.getString("MESSAGGIO"));
					icoInfo.addElement("&nbsp;");

					info.addElement(func);
					info.addElement(data);
					info.addElement(tit);
					info.addElement(icoInfo);

					String url_manuale = rs.getString("URL_MANUALE");
					if (url_manuale != null) {
						Span icoPdf = new Span();
						icoPdf.addAttribute("class", "manuale");
						A pdf = new A();
						pdf.addAttribute("href", url_manuale);
						pdf.addAttribute("target", "_blank");
						icoPdf.addElement(pdf);
						info.addElement(icoPdf);
					}

					html += info;
				}
			}
		} catch (SqlQueryException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				rs.close();
				conn.close();
			} catch (SQLException ex) {
				ex.printStackTrace();
			}
		}

		if (!html.equals("")) {
			Div informazioni = new Div();
			informazioni.addAttribute("id", "informazioni");

			H3 titInfo = new H3("Informazioni");
			informazioni.addElement(titInfo);

			Div divInfo = new Div();
			divInfo.addAttribute("id", "divInformazioni");
			divInfo.addElement(html);
			informazioni.addElement(divInfo);

			return informazioni.toString();
		}

		return "";
	}

	/**
	 * Creazione menu
	 * 
	 * @return
	 */
	private String drawMenu() {
		String htmlMenu = new String("");

		UL ulMenu = new UL();
		UL ulEme = new UL();
		UL ulRepe = new UL();
		UL ulSostInf = new UL();
		
		Div hiddenUrl = new Div();

		String query = null;
		Connection conn = null;
		OraclePreparedStatement ps = null;
		ResultSet rs = null;

		query = "select * from " + _VIEW_MENU + " where codice_gruppo = :codice_gruppo";

		try {
			logger.debug("drawMenu() - getConnection");
			conn = this.myConnections.getWebConnection();

			logger.debug("drawMenu() - esecuzione query: " + query + " con :codice_gruppo = " + this.gruppomed);

			ps = (OraclePreparedStatement) conn.prepareStatement(query);
			ps.setStringAtName("codice_gruppo", this.gruppomed);

			rs = ps.executeQuery();

			while (rs.next()) {
				ulMenu.addElement(this.drawIco(rs.getString("FUNZIONE"), rs.getString("URL_IMG"), rs.getString("DESCRIZIONE"), rs.getString("URL_MANUALE")));
				if ((this.tipomed.equals("M")) && rs.getString("EMERGENZA").equals("S")) {
					if (rs.getString("URL_MANUALE_EMERGENZA") == null)
						ulEme.addElement(this.drawButEme(rs.getString("FUNZIONE"), rs.getString("DESCRIZIONE")));
					else
						ulEme.addElement(this.drawButEme(rs.getString("FUNZIONE"), rs.getString("DESCRIZIONE"), rs.getString("URL_MANUALE_EMERGENZA")));
				}
				if ((this.tipomed.equals("M")) && rs.getString("REPERIBILITA").equals("S")) {
					if (rs.getString("URL_MANUALE_REPERIBILITA") == null)
						ulRepe.addElement(this.drawButRepe(rs.getString("FUNZIONE"), rs.getString("DESCRIZIONE")));
					else
						ulRepe.addElement(this.drawButRepe(rs.getString("FUNZIONE"), rs.getString("DESCRIZIONE"), rs.getString("URL_MANUALE_REPERIBILITA")));
				}
				if ((this.tipomed.equals("I")) && rs.getString("SOSTITUZIONE_INFERMIERISTICA").equals("S")) {
					if (rs.getString("URL_MANUALE_SOSTITUZIONE") == null)
						ulSostInf.addElement(this.drawButSostInf(rs.getString("FUNZIONE"), rs.getString("DESCRIZIONE")));
					else
						ulSostInf.addElement(this.drawButSostInf(rs.getString("FUNZIONE"), rs.getString("DESCRIZIONE"), rs.getString("URL_MANUALE_SOSTITUZIONE")));
				}	
				
				hiddenUrl.addElement("<input type='hidden' id='" + rs.getString("FUNZIONE") + "' value='" + rs.getString("URL_WEBAPP") + "' />");
			}
		} catch (SqlQueryException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				rs.close();
				conn.close();
			} catch (SQLException ex) {
				ex.printStackTrace();
			}
		}

		Div menu = new Div();
		menu.addAttribute("id", "divMenu");
		menu.addElement("\n\t" + ulMenu + "\n");
		menu.addElement("\n\t" + hiddenUrl + "\n");
		htmlMenu = menu.toString() + "\n";

		if (this.tipomed.equals("M")) // Disegno i menu Emergenza e Reperibilita
										// solo se l'utente e' un medico
		{
			Div but = new Div();
			but.addAttribute("id", "but");

			Div butWrap = new Div();
			butWrap.addAttribute("id", "butWrap");

			Div divEme = new Div();
			divEme.addAttribute("id", "divEmergenza");
			divEme.addAttribute("class", "but");

			Div divRepe = new Div();
			divRepe.addAttribute("id", "divReperibilita");
			divRepe.addAttribute("class", "but");

			FieldSet fEme = new FieldSet();
			Legend lEme = new Legend("Emergenza");
			fEme.addElement("\n" + lEme);
			fEme.addElement("\n" + ulEme);
			divEme.addElement("\n" + fEme);

			FieldSet fRepe = new FieldSet();
			Legend lRepe = new Legend("Reperibilita");
			fRepe.addElement("\n" + lRepe);
			fRepe.addElement("\n" + ulRepe);
			divRepe.addElement("\n" + fRepe);

			if (!ulEme.isEmpty())
				butWrap.addElement("\n" + divEme);

			if (!ulRepe.isEmpty())
				butWrap.addElement("\n" + divRepe);

			but.addElement("\n" + butWrap);

			htmlMenu += but.toString();
		}
		else if (this.tipomed.equals("I")){
			Div but = new Div();
			but.addAttribute("id", "but");

			Div butWrap = new Div();
			butWrap.addAttribute("id", "butWrap");

			Div divSostInf = new Div();
			divSostInf.addAttribute("id", "divSostInfermieristico");
			divSostInf.addAttribute("class", "but");

			FieldSet fSostInf = new FieldSet();
			Legend lSostInf = new Legend("Sostituzione Infermieristica");
			fSostInf.addElement("\n" + lSostInf);
			fSostInf.addElement("\n" + ulSostInf);
			divSostInf.addElement("\n" + fSostInf);



			if (!ulSostInf.isEmpty())
				butWrap.addElement("\n" + divSostInf);


			but.addElement("\n" + butWrap);

			htmlMenu += but.toString();
		}

		return htmlMenu;
	}


	/**
	 * Disegna un pulsante per EMERGENZA
	 * 
	 * @param func
	 * @param descr
	 * @return
	 */
	private String drawButEme(String func, String descr) {
		return this.drawBut(func, descr, "EMERGENZA");
	}

	/**
	 * Override della funzione per la gestione dell'aggiunta del link al manuale
	 * 
	 * @param func
	 * @param descr
	 * @param url_manuale
	 * @return
	 */
	private String drawButEme(String func, String descr, String url_manuale) {
		return this.drawBut(func, descr, "EMERGENZA", url_manuale);
	}

	/**
	 * Disegna un pulsante per REPERIBILITA
	 * 
	 * @param func
	 * @param descr
	 * @return
	 */
	private String drawButRepe(String func, String descr) {
		return this.drawBut(func, descr, "REPERIBILITA");
	}

	/**
	 * Override della funzione per la gestione dell'aggiunta del link al manuale
	 * 
	 * @param func
	 * @param descr
	 * @param url_manuale
	 * @return
	 */
	private String drawButRepe(String func, String descr, String url_manuale) {
		return this.drawBut(func, descr, "REPERIBILITA", url_manuale);
	}

	/**
	 * Disegna un pulsante per EMERGENZA
	 * 
	 * @param func
	 * @param descr
	 * @return
	 */
	private String drawButSostInf(String func, String descr) {
		// TODO Auto-generated method stub
		return this.drawBut(func, descr, "SOSTITUZIONE_INFERMIERISTICA");
	}
	/**
	 * Disegna un pulsante per EMERGENZA
	 * 
	 * @param func
	 * @param descr
	 * @return
	 */
	private String drawButSostInf(String func, String descr, String url_manuale) {
		// TODO Auto-generated method stub
		return this.drawBut(func, descr, "SOSTITUZIONE_INFERMIERISTICA", url_manuale);
	}
	
	
	/**
	 * Disegna un pulsante con type a parametro
	 * 
	 * @param func
	 * @param descr
	 * @param type
	 * @return
	 */
	private String drawBut(String func, String descr, String type) {
		logger.debug("");

		LI li = new LI();
		li.setNeedClosingTag(true);

		A a = new A("javascript:creaurlbut('" + func + "','" + this.nomeHost + "','" + this.login + "','" + type + "','" + this.abilitaNewHome + "');");
		Span span = new Span(descr);

		a.addElement("\t" + span + "\n\t");
		li.addElement("\n\t" + a + "\n\t");

		return "\t" + li.toString() + "\n";
	}

	/**
	 * Override della funzione per l'aggiunta del link al manuale
	 * 
	 * @param func
	 * @param descr
	 * @param type
	 * @param url
	 * @return
	 */
	private String drawBut(String func, String descr, String type, String url_manuale) {
		logger.debug("");

		LI li = new LI();
		li.setNeedClosingTag(true);

		A a = new A("javascript:creaurlbut('" + func + "','" + this.nomeHost + "','" + this.login + "','" + type + "','" + this.abilitaNewHome + "');");
		Span span = new Span(descr);

		a.addElement("\t" + span + "\n\t");
		li.addElement("\n\t" + a + "\n\t");

		A manuale = new A(url_manuale);
		manuale.addAttribute("title", "Manuale di " + descr);
		manuale.addAttribute("class", "Manuale");
		manuale.addElement("Manuale");
		manuale.addAttribute("target", "_blank");
		li.addElement("\t" + manuale + "\n\t");

		return "\t" + li.toString() + "\n";
	}

	/**
	 * Disegna un icona per il menu
	 * 
	 * @param func
	 * @param url_img
	 * @param descr
	 * @return
	 */
	private String drawIco(String func, String url_img, String descr, String url_manuale) {
		logger.debug("");

		LI li = new LI();
		li.setNeedClosingTag(true);

		A a = new A("javascript:creaurl('" + func + "','" + this.nomeHost + "','" + this.login + "','" + this.abilitaNewHome + "');");
		IMG img = new IMG((url_img == null) ? "" : url_img);
		Span span = new Span(descr);

		a.addElement("\n\t\t" + img + "\n\t");
		a.addElement("\t" + span + "\n\t");
		li.addElement("\n\t" + a + "\n\t");

		if (url_manuale != null) {
			A manuale = new A(url_manuale);
			manuale.addAttribute("title", "Manuale di " + descr);
			manuale.addAttribute("class", "Manuale");
			manuale.addElement("Manuale");
			manuale.addAttribute("target", "_blank");
			li.addElement("\t" + manuale + "\n\t");
		}

		return "\t" + li.toString() + "\n";
	}

	/**
	 * Stampa il json di baseUser utilizzabile da JS
	 * 
	 * @return
	 */
	private String creaJsInfo() {
		return "<script type='text/javascript'>var user = " + this.bu.getJson() + "</script>\n";
	}

	/**
	 * Controllo della presenza di una sessione. Se non presente, avvia la
	 * pagina di login
	 * 
	 * @throws Exception
	 * @throws IOException
	 */
	private void checkSessione() throws Exception {
		if (this.mySession == null) {
			this.myResponse.sendRedirect(this.myRequest.getContextPath());
			throw new Exception("Errore di sessione - Redirect alla pagina di login");
		}
	}

	/**
	 * Lettura parametri di sessione
	 * 
	 * @throws Exception
	 */
	private void readParams() throws Exception {
		try {
			logger.debug("get dbConnections from session");
			this.myConnections = UniSysUser.getConnections(mySession);

			logger.debug("Lettura parametri");
			this.login = UniSysUser.getSessionLoginName(mySession);
			this.ipRilevato = (String) this.mySession.getAttribute("indirizzo_pc");
			this.nomeHost = (String) this.mySession.getAttribute("nomeHost");

			logger.info("LOGIN: " + this.login + ", IPRILEVATO: " + this.ipRilevato + ", NOMEHOST: " + this.nomeHost);
		} catch (Exception e) {
			throw new Exception("Errore in lettura parametri");
		}
	}

	/**
	 * Lettura dati utente
	 * 
	 * @throws Exception
	 */
	private void readBaseUser() throws Exception {
		try {
			this.bu = UniSysUser.getSessionUser(mySession);

			this.tipomed = bu.getParametro("TIPO");
			this.gruppomed = bu.getParametro("GRUPPO");
			this.abilitaNewHome = bu.getParametro("NEWHOME");
		} catch (Exception e) {
			throw new Exception("Errore in lettura dati utente");
		}
	}
}
