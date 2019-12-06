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
package unisys.login;

import java.io.IOException;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ecs.html.A;
import org.apache.ecs.html.Div;
import org.apache.ecs.html.H2;
import org.apache.ecs.html.H3;
import org.apache.ecs.html.H4;
import org.apache.ecs.wml.Img;
import org.json.JSONException;
import org.json.JSONObject;

import unisys.baseObj.UniSysConfig;
import unisys.layout.Page;

/**
 * Costruzione della pagina di login
 * 
 * @author LinoB su base del pageLoginEngine di FabrizioD
 */
public class PageLoginEngineUnified extends PageLoginEngine {

	public PageLoginEngineUnified(ServletContext cont, HttpServletRequest req, HttpServletResponse resp) {
		super(cont, req, resp);
	}

	/**
	 * Metodo per la generazione della pagina di Login
	 * 
	 * @return String con contenuto HTML
	 * @throws ServletException
	 * @throws IOException
	 */
	@Override
	public String generaPagina() throws ServletException, IOException {
		 
		 String bodyComped = "<OBJECT id=\"Digest\""+
		 "classid=\"clsid:CBBABF03-D183-11D2-819C-00001C011F1D\">"+
		 "</OBJECT>\n\n";
		 
		/*String bodyApplet = "<OBJECT name=\"appletLogin\" type=\"application/x-java-applet\" height=\"0\" width=\"0\">\n"
				+ "<param name=\"code\" value=\"it.elco.applet.NomeHostSmartCard.class\">\n" 
				+ "<param name=\"archive\" value=\"std/app/SignedAppletHostSmartCard.jar\">\n" 
				+ "</OBJECT>\n\n";*/

		Div divContent = null;
		H2 h2TitLogin = null;
		H3 h3Version = null;
		H4 h4Ip = null;
		Img imgLogo = new Img("images/sfondoUnisys_1.jpg");

		this.logger.info("Init - Login Engine Unisys");

		this.config = new UniSysConfig(UniSysConfig.GRUPPO_LOGIN);
		
		Enumeration<String> en = this.request.getParameterNames();
		while (en.hasMoreElements()) {
			String chiave = en.nextElement();
			this.config.setParametro(chiave, request.getParameter(chiave));
		}

		this.logger.info("Init - Rilevamento IP");

		ipRilevato = this.request.getRemoteAddr();

		if (ipRilevato.equals("0:0:0:0:0:0:0:1") || ipRilevato.equals("127.0.0.1"))
			ipRilevato = "192.168.3.187"; // Hack per locale

		this.logger.info("IP rilevato - " + ipRilevato);

		// this.getNomeHost(ipRilevato); // Se ci sono problemi a rilevare il
		// nomeHost da DB,
		// nomeHost = "" e verra' incluso il JS che richiama l'ActiveX

		this.page = new Page(context.getServletContextName(),context);
		this.page.addCss("std/css/Login/login.css");
		this.page.addJs("std/jscript/engine/jquery-min.js");
		this.page.addJs("std/jscript/Login/deployJava.js");
		this.page.addJs("std/jscript/Login/nomeHost.js");
		this.page.addJs("std/jscript/Login/login.js");
		
		/*if (this.config.getParametro(this.attiva_applet).equalsIgnoreCase("S"))
		{
			this.page.addToBody(bodyApplet);
		}*/

		if (this.config.getParametro(this.attiva_comped).equalsIgnoreCase("S"))
		{
			this.page.addToBody(bodyComped);
		}
		/*this.page.addToBody(bodyApplet);*/
		/*Carico nella pagina il json(array associativo) di view_us_config*/
		String json ="<script type='text/javascript'>var properties = "+ this.config.getJson() +"</script>";
		this.page.addToBody(json.toString());
				
		divContent = new Div();
		divContent.addAttribute("id", "content");

		Div divFormLogin = new Div();
		divFormLogin.addAttribute("id", "divFormLogin");
		divFormLogin.addAttribute("class", "riqLogin");

		imgLogo.addAttribute("id", "imgLogo");

		h2TitLogin = new H2("Log In");
		h3Version = new H3("System: " + this.config.getParametro("VERSIONE"));
		h4Ip = new H4("Ip: " + ipRilevato);
		
		String form_login = "<form action=\"Authentication\" accept-charset=\"UTF-8\" method=\"post\" id=\"formLogin\">\n"
				+ "	<label for=\"username\">Utente:</label>\n" + "	<input type=\"text\" name=\"username\" id=\"username\" value=\"\" class=\"field\" />\n\n"
				+ "	<label for=\"password\">Password:</label>\n" + "	<input type=\"password\" name=\"password\" id=\"password\" value=\"\" class=\"field\" />\n\n"
				+ "	<input type=\"hidden\" name=\"ipRilevato\" value=\"" + ipRilevato + "\">\n\n"
				+ "	<input type=\"hidden\" name=\"nomeHost\" id=\"nomeHost\" value=\"" + this.nomeHost + "\">\n\n"
				+ "	<input type=\"hidden\" name=\"azione\" value=\"" + PostAuthenticationEngine.Azione.login + "\">\n\n"
				+ "	<input type=\"hidden\" name=\"forceLogout\" id=\"forceLogout\" value=\"N\">\n\n" + "</form>\n";
		// body += bodyComped;
		Div formlogin = new Div(form_login);
		formlogin.addAttribute("id", "form_login");
		
		String form_cambia_pwd = "<form action=\"Authentication\" accept-charset=\"UTF-8\" method=\"post\" id=\"formCambiaPwd\">\n"
				+ "	<label for=\"username\">Utente:</label>\n" + "	<input type=\"text\" name=\"username\" id=\"username_cambiapwd\" value=\"\" class=\"field\" readonly=\"true\" />\n\n"
				+ "	<label for=\"password_attuale\">Password Attuale:</label>\n" + "	<input type=\"password\" name=\"password\" id=\"password_attuale\" value=\"\" class=\"field\" />\n\n"
				+ "	<label for=\"password_nuova\">Nuova Password:</label>\n" + "	<input type=\"password\" name=\"password_nuova\" id=\"password_nuova\" value=\"\" class=\"field\" />\n\n"
				+ "	<label for=\"password_nuova_2\">Ripeti Nuova Password:</label>\n" + "	<input type=\"password\" name=\"password_nuova_2\" id=\"password_nuova_2\" value=\"\" class=\"field\" />\n\n"
				+ "	<input type=\"hidden\" name=\"azione\" value=\"" + PostAuthenticationEngine.Azione.cambiapassword + "\">\n\n" + "</form>\n";
		
		Div formcambiapwd = new Div(form_cambia_pwd);
		formcambiapwd.addAttribute("id", "form_cambia_pwd");
		formcambiapwd.addAttribute("class", "hide");

		Div errorMsg = new Div();
		errorMsg.addAttribute("id", "errorMsg");
		errorMsg.addAttribute("class", "hide");

		A butLogin = new A("#");
		butLogin.addElement("Log in");
		butLogin.addAttribute("id", "butLogin");
		butLogin.addAttribute("class", "butLogin");

		A butCambia = new A("#");
		butCambia.addElement("Cambia Pwd");
		butCambia.addAttribute("class", "butLogin");
		butCambia.addAttribute("id", "butCambiaPwd");

		A butSmart = new A("#");
		butSmart.addElement("Smart Card Login");
		butSmart.addAttribute("class", "butLogin hide");
		butSmart.addAttribute("id", "butSmart");
		
		Div buttons_login = new Div();
		buttons_login.addAttribute("id", "buttons_login");
		buttons_login.addElement(butLogin);
		buttons_login.addElement(butCambia);
		buttons_login.addElement(butSmart);
		
		A butCambiaPwdOk = new A("#");
		butCambiaPwdOk.addElement("Cambia Pwd");
		butCambiaPwdOk.addAttribute("class", "butLogin");
		butCambiaPwdOk.addAttribute("id", "butCambiaPwdOk");
		
		A butCambiaPwdAnnulla = new A("#");
		butCambiaPwdAnnulla.addElement("Annulla");
		butCambiaPwdAnnulla.addAttribute("class", "butLogin");
		butCambiaPwdAnnulla.addAttribute("id", "butCambiaPwdAnnulla");
		
		Div buttons_cambia_pwd = new Div();
		buttons_cambia_pwd.addAttribute("id", "buttons_cambia_pwd");
		buttons_cambia_pwd.addAttribute("class", "hide");
		buttons_cambia_pwd.addElement(butCambiaPwdOk);
		buttons_cambia_pwd.addElement(butCambiaPwdAnnulla);

		divFormLogin.addElement(formlogin);
		divFormLogin.addElement(formcambiapwd); /*hide*/
		divFormLogin.addElement(errorMsg);
		divFormLogin.addElement(buttons_login);
		divFormLogin.addElement(buttons_cambia_pwd);

		divContent.addElement(imgLogo);
		divContent.addElement(divFormLogin);

		this.page.addToBody(divContent.toString());
		
		/*this.page.addJs("std/jscript/engine/jquery-min.js");
		this.page.addJs("std/jscript/Login/login.js");

		if (nomeHost.equals(""))
			this.page.addJs("std/jscript/Login/nomeHost.js");
*/
		return this.page.generaPagina();
	}
}
