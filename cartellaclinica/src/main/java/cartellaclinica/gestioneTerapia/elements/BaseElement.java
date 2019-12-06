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
package cartellaclinica.gestioneTerapia.elements;

import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerInterface;

import java.io.IOException;
import java.sql.Connection;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import matteos.database.DbException;
import matteos.database.DbUtils;
import matteos.servlets.Logger;
import matteos.servlets.login.LoggedUser;
import matteos.servlets.polaris.PolarisContext;
import matteos.utils.StringUtils;
import matteos.utils.XmlUtils;
import matteos.utils.reflect.ClassUtils;
import oracle.jdbc.OracleConnection;

import org.apache.ecs.ElementAttributes;
import org.apache.ecs.html.Div;
import org.jdom.Attribute;
import org.jdom.Content;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.Parent;
import org.jdom.Text;
import org.jdom.xpath.XPath;

import cartellaclinica.gestioneTerapia.elements.tools.Template;
import cartellaclinica.gestioneTerapia.elements.tools.TerapiaXmlConst;
import cartellaclinica.gestioneTerapia.elements.tools.TerapiaXmlConst.Accesso;
import core.Global;

public abstract class BaseElement {

	final protected Element root;

	final protected BaseElement parent;

	final protected ServletContext context;

	final protected HttpServletRequest request;

	final protected HttpServletResponse response;

	final protected ElcoLoggerInterface log;

	final protected baseUser logged_user;
	
	final protected Div div;

	protected String tipo;
	
	final protected String reparto;

	protected TerapiaXmlConst.Accesso modalita_accesso = null;

	// protected Hashtable<Element, BaseElement> instanced_objects;

	protected BaseElement getParent() {
		return this.parent;
	}

	public void setModalitaAccesso(Accesso ma) {
		try {
			modalita_accesso = ma;
		} catch (Exception e) {
			modalita_accesso = Accesso.lettura;
		}
	}

	public BaseElement(){
		this.context 		= null;
		this.request 		= null;
		this.response 		= null;
		this.reparto 		= null;
		this.log 			= null;
		this.root 			= null;
		this.parent 		= null;
		this.tipo 			= null;
		this.div 			= null;
		this.logged_user	= null;
	}
	
	public BaseElement(Element el, BaseElement parent, ServletContext context, HttpServletRequest request, HttpServletResponse response, baseUser logged_user ,String reparto) {
		this.context = context;
		this.request = request;
		this.response = response;
		this.reparto = reparto;
		this.log = Logger.getLogger();
		this.root = el;
		this.parent = parent;
		this.tipo = el.getAttributeValue(TerapiaXmlConst.tipo);
		this.div = new Div();
		this.div.addAttribute(TerapiaXmlConst.cls, root.getName());
		this.logged_user = logged_user;
		replaceTemplates();
	}

	final public void setAttributes() {
		setAttributes(root, div);
	}

	final protected void setAttributes(String attribute) {
		setAttributes(root, div, attribute);
	}

	final protected void setAttributes(Element elm, ElementAttributes htmlelem, String attributename) {
		String attributi = elm.getAttributeValue(attributename);
		if (!DbUtils.isVuoto(attributi)) {
			for (String x : attributi.split(";")) {
				if (!DbUtils.isVuoto(x)) {
					String[] y = x.split("=");
					if (y.length == 2)
						htmlelem.addAttribute(y[0], StringUtils.voidStringIfNull(y[1]));
					else
						htmlelem.addAttribute(y[0], "");
				}
			}
		}
	}

	final protected void setAttributes(Element elm, ElementAttributes htmlelem) {
		setAttributes(elm, htmlelem, TerapiaXmlConst.a_globali);
		setAttributes(elm, htmlelem, TerapiaXmlConst.a_ereditabili);
		// Serve per le OPTION
		if (modalita_accesso != null)
			setAttributes(elm, htmlelem, TerapiaXmlConst.a_modalita(modalita_accesso));
	}

	final private void propagaAttributiEreditabili(Element elm) {
		String valore = getStringAttribute(TerapiaXmlConst.a_ereditabili);
		if (DbUtils.isVuoto(valore))
			return;
		setOrAppendAttributiEreditabili(elm, valore);
	}

	public static void setOrAppendAttributiEreditabili(Element elm, String value) {
		String attr = elm.getAttributeValue(TerapiaXmlConst.a_ereditabili);
		if (!DbUtils.isVuoto(attr))
			value = attr + ";" + value;
		elm.setAttribute(TerapiaXmlConst.a_ereditabili, value);
	}

	public String getStringAttribute(String name) {
		return StringUtils.voidStringIfNull(root.getAttributeValue(name));
	}

	public int getIntAttribute(String name) {
		try {
			return Integer.parseInt(getStringAttribute(name));
		} catch (NumberFormatException n) {
			return 0;
		}
	}

	public boolean getBoolAttribute(String name) {
		return getBoolAttribute(root, name);
	}

	public boolean getBoolAttribute(Element elm, String name) {
		Attribute attr = elm.getAttribute(name);
		if (attr == null)
			return false;
		else {
			String val = attr.getValue();
			if (val == null || "1".equalsIgnoreCase(val) || "Y".equalsIgnoreCase(val) || "S".equalsIgnoreCase(val) || "yes".equalsIgnoreCase(val) || "true".equalsIgnoreCase(val) || "ok".equalsIgnoreCase(val) || "on".equalsIgnoreCase(val))
				return true;
			else
				return false;
		}
	}

	protected String extractValue(Object obj) {
		if (obj instanceof Content)
			return ((Content) obj).getValue();
		if (obj instanceof Attribute)
			return ((Attribute) obj).getValue();
		// if (obj instanceof String)
		return (String) obj;
	}

	/*
	 * protected void setValue(Object obj, String value) { if (obj instanceof
	 * Text) ((Text) obj).setText(value); if (obj instanceof Attribute)
	 * ((Attribute) obj).setValue(value); }
	 */

	protected String getXPath() {
		return getXPath(root);
	}

	protected String getXPath(Object elem) {
		if (elem == null || elem instanceof Document)
			return "";
		String current = null;
		Parent xmlparent;
		if (elem instanceof Attribute) {
			current = "/@" + ((Attribute) elem).getName();
			xmlparent = ((Attribute) elem).getParent();
		}
		if (elem instanceof Text) {
			current = "/text()";
			xmlparent = ((Text) elem).getParent();
		}
		if (elem instanceof Element) {
			String name = ((Element) elem).getName();
			current = "/" + name;

			// Se necessario identificare per qualche tag l'elemento
			String[] attributes = getKeyAttributeNames((Element) elem);
			for (int i = 0; !DbUtils.isVuoto(attributes) && i < attributes.length; i++) {
				if (i == 0)
					current = current + "[";
				else
					current = current + " and ";
				current = current + "@" + attributes[i] + "='" + StringUtils.voidStringIfNull(((Element) elem).getAttributeValue(attributes[i])) + "'";
				if (i == attributes.length - 1)
					current = current + "]";
			}
		}
		BaseElement be_parent = getParent();
		if (current == null)
			return "";
		else {
			if (be_parent != null)
				return getParent().getXPath() + current;
			else
				return current;
		}
	}

	/**
	 * @param xpath
	 * @return the first selected item, which may be of types: Element,
	 *         Attribute, Text, CDATA, Comment, ProcessingInstruction, Boolean,
	 *         Double, String, or null if no item was selected.
	 * @throws JDOMException
	 */
	public Object getObjectByXPath(String xpath) throws JDOMException {
		XPath xp = XPath.newInstance(xpath);
		return xp.selectSingleNode(root);
	}

	public String getStringByXPath(String xpath) throws JDOMException {
		return extractValue(getObjectByXPath(xpath));
	}

	public Element getElementByXPath(String xpath) throws JDOMException {
		return (Element) getObjectByXPath(xpath);
	}

	public List<Object> getObjectsByXPath(String xpath) throws JDOMException {
		XPath xp = XPath.newInstance(xpath);
		return (List<Object>) xp.selectNodes(root);
	}

	public void setObjectValueByXPath(String xpath, String value) throws JDOMException {
		String rootxpath = xpath.substring(0, xpath.lastIndexOf("/"));
		String childxpath = xpath.substring(xpath.lastIndexOf("/") + 1);
		Element elem = (Element) getObjectByXPath(rootxpath);
		if (childxpath.matches("^text\\(\\)$"))
			elem.setText(value);
		if (childxpath.matches("^@.*"))
			elem.setAttribute(childxpath.substring(1), value);
	}

	public void setAllValuesByXpath(String[] xpaths, String[] values) {
		for (int i = 0; i < xpaths.length; i++) {
			try {
				setObjectValueByXPath(xpaths[i], values[i]);
//			} catch (JDOMException jde) {
//				log.error(jde);
			} catch (Exception e) {
				log.error(e);
			}
		}
	}
	
	public BaseElement getInstance(Element elm) throws Exception {
		return getInstance(elm, this);
	}

	public BaseElement getInstance(Element elm, BaseElement parentbe) throws Exception {
		String classe = elm.getAttributeValue(TerapiaXmlConst.classe);
		if (DbUtils.isVuoto(classe))
			classe = elm.getName();
		if (Template.class.getSimpleName().equalsIgnoreCase(classe)) {
			// Attenzione: modifica l'albero XML, quindi va in errore se si sta
			// ciclando sui nodi.
			elm = Template.replaceTemplate(elm);
			return getInstance(elm);
		}
		propagaAttributiEreditabili(elm);
		String classe_w_path = BaseElement.class.getPackage().getName() + "." + classe;
		BaseElement instanced = (BaseElement) ClassUtils.Istanzia(classe_w_path, new Object[] { elm, parentbe, context, request, response,logged_user, reparto }, new Class[] { Element.class, BaseElement.class, ServletContext.class, HttpServletRequest.class, HttpServletResponse.class, baseUser.class,String.class });
		// instanced_objects.put(elm, instanced);
		instanced.setModalitaAccesso(parentbe.modalita_accesso);
		// instanced.setAttributes(TerapiaXmlConst.a_modalita(modalita_accesso));
		instanced.setAttributes();
		return instanced;
	}

	public void setAttribute(String attribute, String value) {
		this.root.setAttribute(attribute, value);
	}

	public final Div getDiv() {
		generaDiv(div);
		return div;
	}

	protected abstract void generaDiv(Div div);

	public final String getHtml() {
		return getDiv().toString();
	}

	public final String getXml() throws IOException {
		Document doc = root.getDocument();
		if (doc == null) {
			doc = new Document();
			doc.setRootElement(root);
		}
		return XmlUtils.getStringFromDocument(doc,"ISO-8859-1");
	}

	final protected String[] getKeyAttributeNames(Element elem) {
		String attributes = elem.getAttributeValue(TerapiaXmlConst.key);
		if (!DbUtils.isVuoto(attributes)) {
			return attributes.split(",");
		} else {
			Hashtable<String, String[]> default_key_attributes = new Hashtable<String, String[]>();
			default_key_attributes.put(GruppoFarmaci.class.getSimpleName(), new String[] { "tipo" });
			default_key_attributes.put(Farmaco.class.getSimpleName(), new String[] { "iden" });
			default_key_attributes.put(UserInput.class.getSimpleName(), new String[] { "name" });
			return default_key_attributes.get(elem.getName());
		}
	}

	protected Connection getDataConnection() throws DbException {
		return PolarisContext.getDataConnection(logged_user, context);
	}

	protected OracleConnection getOracleDataConnection() throws DbException {
		return (OracleConnection) getDataConnection();
	}

	public void applySelected(Element selected) {
		if (selected == null)
			return;
		List<Attribute> attrs = selected.getAttributes();
		Iterator<Attribute> it = attrs.iterator();
		while (it.hasNext()) {
			Attribute a = it.next();
			root.setAttribute(a.getName(), a.getValue());
		}
	}

	private void replaceTemplates() {
		String templatetag=Template.class.getSimpleName();
		int howmanyleft = root.getChildren(templatetag).size();
		Element el = root.getChild(templatetag);
		try {
			while (el != null && howmanyleft > 0) {
				howmanyleft--;
				Template.replaceTemplate(el, this.request,this.reparto);
				el = root.getChild(Template.class.getSimpleName());
			}
		} catch (Exception e) {
			log.error(e);
		}
	}
}
