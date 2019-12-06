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


import imago.sql.ElcoLoggerInterface;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import matteos.servlets.Logger;

import com.inet.report.Engine;


/**
 * Estende la classe Properties e aggiunge metodi per ottenere parametri da vari tipi di oggetti.
 * 
 * @author matteos
 *
 */
public class Parametri extends Properties {
	
	ElcoLoggerInterface log = Logger.getLogger();
	
	private String encoding = "utf-8";
	
	public static String param_ConnectionPool = "connessione";

	public static String param_OutputFormat = "OutputFormat";
	public static String param_OutputFormatHtmLayout = "OutputFormatHtmLayout";
	
	//Report (input)
	public static String param_report = "report";
	public static String param_stampeReportFolder = "stampeReportFolder";
	public static String param_sf = "sf";
	
	
	public String getConnessione() {
		return this.getProperty(param_ConnectionPool);
	}
	public void setConnessione(String value) {
		this.setProperty(param_ConnectionPool, value);
	}
	
	public void setOutputFormat(String value) {
		this.setProperty(param_OutputFormat, value);
	}
	public String getOutputFormat() {
		String export_format = this.getProperty(param_OutputFormat);
		if (export_format == null)
			export_format = Engine.EXPORT_PDF;
		return export_format;
	}
	/**
	 * Se il formato di export &egrave; htm 
	 * @return
	 */
	public boolean getOutputFormatIsHtm() {
		return (getOutputFormat().matches(Engine.EXPORT_HTML + ".*"));
	}
	/**
	 * Layout della pagina html di output (passato a Engine.setUserProperties() - nome parametro "layout"). Puo' assumere i valori:
	 * <br/> single: one html file for all report pages; one page header and page footer for the complete report (default) 
     * <br/> concat: one html file for all report pages; one page header and page footer per report page
     * <br/> ccdefault: one html file per report page (Nota: e' il valore di default per CrystalClear, non per queste librerie) 
	 * @param value
	 */
	public void setOutputFormatHtmLayout(String value) {
		this.setProperty(param_OutputFormatHtmLayout, value);
	}
	/**
	 * 
	 * @return default "single", documento in una sola pagina
	 */
	public String getOutputFormatHtmLayout() {
		String layout = getProperty(param_OutputFormatHtmLayout);
		if (layout==null || layout.length()==0)
			return "single";
		else
			return layout;
	}
	public String getReport() {
		return this.getProperty(param_report);
	}
	public void setReport(String value) {
		this.setProperty(param_report, value);
	}
	public String getReportFolder() {
		return this.getProperty(param_stampeReportFolder);
	}
	public void setReportFolder(String value) {
		this.setProperty(param_stampeReportFolder, value);
	}
	public String getSf() {
		return this.getProperty(param_sf);
	}
	public void setSf(String value) {
		this.setProperty(param_sf, value);
	}
	public void setPrompt(String prompt, String value) {
		this.setProperty("prompt<" + prompt + ">", value);
	}
	
	/**
	 * Ottiene un parametro specifico dal ServletContext specificato.
	 * 
	 * @param context
	 * @param parametro
	 * @return
	 */
	public boolean getFromServletContext(ServletContext context,String parametro) {
		String value = context.getInitParameter(parametro);
		if (value == null)
			return false;
		this.setProperty(parametro,value);
		return true;
	}
	
	/**
	 * Ottiene tutti i parametri dal HttpServletRequest specificato.
	 * 
	 * @param request
	 * @return
	 */
	public boolean getAllFromHttpServletRequest (HttpServletRequest request) {
		Enumeration enm = request.getParameterNames();
		int size1 = this.size();
		String paramname;
		while (enm.hasMoreElements()) {
			paramname = (String) enm.nextElement();
			this.setProperty(paramname,request.getParameter(paramname));
		}
		if (size1 < this.size())
			return true;
		else
			return false;
	}
	
	/**
	 * Ottiene un parametro specifico dal HttpServletRequest specificato.
	 * 
	 * @param request
	 * @param parametro
	 * @return
	 */
	public boolean getFromHttpServletRequest (HttpServletRequest request, String parametro) {
		try {
			String value = URLDecoder.decode(request.getParameter(URLEncoder.encode(parametro,encoding)),encoding);
			if (value == null)
				return false;
			this.setProperty(parametro,value);
			return true;
		} catch (UnsupportedEncodingException e) {
			return false;
		}
	}
	
	public Object setProperty(String key, String value) {
		log.debug(key + "=" + value);
		if (value == null)
			return null;
		return super.setProperty(key, value);
	}
}
