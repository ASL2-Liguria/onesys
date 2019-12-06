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

import generic.statements.StatementFromFile;
import imago.http.baseClass.baseUser;
import it.elco.whale.actions.scopes.Database.GetListFromResultset;

import it.elco.whale.actions.scopes.Placeholder.Replace;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import matteos.database.DbUtils;
import matteos.utils.StringUtils;
import matteos.utils.XmlUtils;

import org.apache.ecs.html.Div;
import org.apache.ecs.html.Input;
import org.apache.ecs.html.Label;
import org.apache.ecs.html.Option;
import org.apache.ecs.html.Select;
import org.jdom.Attribute;
import org.jdom.Element;

public class Options extends UserInput {


	protected enum Tipo {
		radio, select;
	}

	public Options(Element el, BaseElement parent, ServletContext context, HttpServletRequest request, HttpServletResponse response, baseUser logged_user, String reparto) {
		super(el, parent, context, request, response, logged_user, reparto);
		div.addAttribute("value_descr", getValueDescr());
		Element query = root.getChild("QUERY");

		if (query != null) {

			String select = query.getTextNormalize();
			List alst = query.getAttributes();
			Iterator<Attribute> ait = alst.iterator();
			while (ait.hasNext()) {
				Attribute a = ait.next();
				select = select.replaceAll("#" + a.getName() + "#", a.getValue());
			}

			PreparedStatement ps = null;
			ResultSet rst = null;

			try {
				ps = getDataConnection().prepareStatement(select);
				rst = ps.executeQuery();
				while (rst.next()) {
					try {
						root.addContent(XmlUtils.getJDomElementFromString(rst.getString(1)));
					} catch (Exception je) {
						log.error(je);
					}
				}
			} catch (SQLException sqle) {
				log.error(sqle);
			} finally {
				DbUtils.close(rst);
				rst = null;
				DbUtils.close(ps);
				ps = null;
			}
			root.removeContent(query);
		}

                                    Element statement = root.getChild("STATEMENT");

                                    if (statement != null) {

                                        String file_name = statement.getAttributeValue("file-name");
                                        String statement_name = statement.getAttributeValue("name");
                                        String parameters = statement.getAttributeValue("parameters");

                                        HashMap<String,String> request_parameters = new HashMap<String,String>();
                                        Enumeration<String> en = request.getParameterNames();

                                        while(en.hasMoreElements()){
                                            String key = en.nextElement();
                                            request_parameters.put(key, request.getParameter(key));
                                        }

                                        HashMap<String,Object> data = new HashMap<String, Object>();
                                        data.put("request", request_parameters);

                                        try {
                                            parameters = Replace.execute(parameters, data).getString();

                                            List<Map> list = GetListFromResultset.execute(new StatementFromFile(request.getSession()), file_name, statement_name, parameters.split("[|]")).getRecords();

                                            for(Map record : list){
                                                Element option = new Element("OPTION");

                                                option.setText((String)record.get(statement.getAttributeValue("campo-text")));
                                                option.setAttribute("value",(String)record.get(statement.getAttributeValue("campo-value")));

                                                if (statement.getAttributeValue("attributes")!=null){
                                                    data.put("record", record);

                                                    String[] attributes = Replace.execute(statement.getAttributeValue("attributes"), data).getString().split("[|]");
                                                    for(String attribute : attributes){
                                                        String key = attribute.substring(0, attribute.indexOf("="));
                                                        String value = attribute.substring(attribute.indexOf("=")+1);

                                                        option.setAttribute(key,value);
                                                    }
                                                    data.remove("record");
                                                }
                                                root.addContent(option);
                                            }


                                        } catch (Throwable ex) {
                                            Logger.getLogger(Options.class.getName()).log(Level.SEVERE, null, ex);
                                        }

                                        root.removeContent(statement);
                                    }


	}

	protected String getValueDescr() {
		return getStringAttribute("value_descr");
	}

	@Override
	protected void generaDiv(Div div) {

		Div innerdiv = new Div();

		List<Element> options = root.getChildren("OPTION");

		ListIterator<Element> lst = options.listIterator();
		switch(Tipo.valueOf(tipo)) {
		case radio:
			while (lst.hasNext()) {
				Element elm = lst.next();
				String value = StringUtils.voidStringIfNull(elm.getAttributeValue("value"));

				String id = getName() + value;

				Input radio = new Input(Input.radio, getName(), value);
				radio.setID(id);
				radio.setChecked(value.equalsIgnoreCase(getValue()));
				setAttributes(elm, radio);
				innerdiv.addElement(radio);

				Label lab = new Label(id);
				lab.addElement(elm.getTextTrim());
				innerdiv.addElement(lab);
			}

			div.addElement(innerdiv);
			break;
		case select:
			Select combo = new Select();
			combo.setName(getName());
			while (lst.hasNext()) {
				Element elm = lst.next();
				String value = StringUtils.voidStringIfNull(elm.getAttributeValue("value"));
				Option opt = new Option(elm.getText(), value, elm.getText()); // elm.getAttributeValue("label")
				opt.setSelected(value.equalsIgnoreCase(getValue()));
				setAttributes(elm, opt);
				combo.addElement(opt);
			}
			innerdiv.addElement(combo);
			div.addElement(innerdiv);
			break;
		default:
		}

	}

}
