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
package cartellaclinica.gestioneTerapia.elements.tools;


import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.util.Date;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import matteos.servlets.Logger;
import matteos.utils.XmlUtils;

import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

import core.Global;

public class Template {
	
	private static String folderPath = "";
	
	private static String reload(String filename) throws Exception {
		long now = new Date().getTime();
		
		String folderFilename = getFolderPath() + filename;
		String file = getContext().getRealPath(".")+"/WEB-INF/templates/"+ folderFilename;
		File templatefile = new File(file);
		
		if (!templatefile.exists()){
			Logger.getLogger().error("File di template non esistente: " + folderFilename);
			Logger.getLogger().error("Ricaricato il file di template di default");
			folderFilename = filename; 
			file = getContext().getRealPath(".")+"/WEB-INF/templates/"+ folderFilename;
			templatefile = new File(file);
		}
		
		Object obj = core.Global.context.getAttribute(folderFilename);
		
		if (obj!= null && now <= getLastCheck(folderFilename) + getRecheckEvery(folderFilename))
			return folderFilename;
		
		setLastCheck(folderFilename);
		
		
		
		if (obj == null || templatefile.lastModified() > getLastReload(folderFilename)) {
				Document doc = XmlUtils.parseJDomDocumentFromFile(file);
				setRecheckEvery(folderFilename, doc.getRootElement().getAttributeValue("seconds"));
				setDocument(folderFilename, doc);
				setLastReload(folderFilename);
		}
		return folderFilename;
	}

	public static Element replaceTemplate(Element temp) throws Exception {
		String filename = temp.getAttributeValue("file");
		reload(filename);
		String id = "i";
		String tid = temp.getAttributeValue(id);
		Document doc = getDocument(filename);
		XPath xp = XPath.newInstance("//*[@" + id + "='" + tid + "']");
		Element elm = (Element) ((Element) ((Element) xp.selectSingleNode(doc)).clone()).detach(); // Aaaaaaaah!
		Iterator<Attribute> it = temp.getAttributes().iterator();
		while (it.hasNext()) {
			Attribute a = it.next();
			elm.setAttribute(a.getName(),a.getValue());
		}
		Element parent = temp.getParentElement();
		parent.addContent(parent.indexOf(temp), elm);
		temp.detach();
		return elm;
	}

	public static Element replaceTemplate(Element temp, HttpServletRequest request,String reparto) throws Exception {
		String filename = temp.getAttributeValue("file");
		setFolderPath(request,filename,reparto);
		String folderFilename = reload(filename);
		String id = "i";
		String tid = temp.getAttributeValue(id);
		Document doc = getDocument(folderFilename);
		XPath xp = XPath.newInstance("//*[@" + id + "='" + tid + "']");
		Element elm = (Element) ((Element) ((Element) xp.selectSingleNode(doc)).clone()).detach(); // Aaaaaaaah!
		Iterator<Attribute> it = temp.getAttributes().iterator();
		while (it.hasNext()) {
			Attribute a = it.next();
			elm.setAttribute(a.getName(),a.getValue());
		}
		Element parent = temp.getParentElement();
		parent.addContent(parent.indexOf(temp), elm);
		temp.detach();
		return elm;
	}
	
	private static Document getDocument(String filename) {
		return (Document) core.Global.context.getAttribute(filename);
	}
	
	private static ServletContext getContext() {
		return core.Global.context;
	}
	
	private static synchronized void setDocument(String filename, Document doc) {
		getContext().setAttribute(filename, doc);
	}
	
	private static long getLastReload(String filename) {
		try {
			return ((Date) getContext().getAttribute(filename + ".lastreload")).getTime();
		} catch (Exception e) {
			return 0;
		}
	}
	
	private static long getLastCheck(String filename) {
		try {
			return ((Date) getContext().getAttribute(filename + ".lastcheck")).getTime();
		} catch (Exception e) {
			return 0;
		}
	}
	
	private static long getRecheckEvery(String filename) {
		try {
			return ((Integer) getContext().getAttribute(filename + ".recheckevery")).intValue() * 1000;
		} catch (Exception e) {
			return 600*1000; //default 10 minuti
		}
	}
	
	private static synchronized void setLastReload(String filename) {
		getContext().setAttribute(filename + ".lastreload", new Date());
	}
	
	private static synchronized void setLastCheck(String filename) {
		getContext().setAttribute(filename + ".lastcheck", new Date());
	}
	
	private static synchronized void setRecheckEvery(String filename, String seconds) {
		int sec;
		try {
			sec = Integer.parseInt(seconds);
		} catch (Exception nfe) {
			sec = 0;
		}
		if (sec == 0)
			sec = 60;
		getContext().setAttribute(filename + ".recheckevery", new Integer(sec));
	}
	
	private static void removeDocument(String filename) {
		getContext().removeAttribute(filename);
	}

	public static String getFolderPath() {
		return folderPath;
	}

	public static void setFolderPath(HttpServletRequest request, String filename, String reparto) {
        Document xmldoc =null;

        try{
        	xmldoc = XmlUtils.parseJDomDocumentFromString(Global.getReparti(request.getSession()).getValue(reparto,"TERAPIE_PATH_CONFIGURAZIONE"));
            List lst = xmldoc.getRootElement().getChildren("PATH");
            Iterator it = lst.iterator();

            Element elmNodoStato;

            while(it.hasNext()){
                elmNodoStato = (Element) it.next();
                if(elmNodoStato.getAttributeValue("file").equals(filename)){
                	folderPath = elmNodoStato.getAttributeValue("valore");	
                }
            }
        }catch(Exception ex){
        	folderPath = "";
        }
		
	}
	
	
}
