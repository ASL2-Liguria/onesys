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

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import matteos.database.DbUtils;
import matteos.utils.StringUtils;

import org.apache.ecs.html.Div;
import org.apache.ecs.html.Input;
import org.apache.ecs.html.TextArea;
import org.jdom.Element;

/**
 * 
 * <UserInput tipo="text|textarea|hidden|..." name="Nome" value="" descr="Rilevazione Nome" [key="name"] />
 * <UserInput classe="Options" tipo="radio|select" name="sceltaradio" value="" descr="Rilevazione radio" value_descr="Descrizione del valore" [key="name"]/>
 * <UserInput classe="Udm" [tipo="select"] name="udm" value="" descr="Unita di misura" value_descr="Descrizione del valore" [key="name"] />
 * <UserInput classe="Timeline" [tipo="Timeline"] name="timeline" value="" descr="" [key="name"]/>
 * 
 * @author matteos
 *
 */
public class UserInput extends BaseElement {
	
	protected String getName() {
		return StringUtils.voidStringIfNull(getStringAttribute("name"));
	}
	
	protected String getValue() {
		return StringUtils.voidStringIfNull(getStringAttribute("value"));
	}

	public UserInput(Element elm, BaseElement parent, ServletContext context, HttpServletRequest request, HttpServletResponse response, baseUser logged_user, String reparto) throws NullPointerException {
		super(elm, parent, context, request, response, logged_user, reparto);
		div.addAttribute("tipo", this.tipo);
		div.addAttribute("xpath", getXPath() + "/@value");
		div.addAttribute("value", getValue());
		div.addAttribute("name", getName());
		div.addElement("<div label>" + getDescr() + "</div>");
	}

	@Override
	protected void generaDiv(Div div) {
		Div innerdiv = new Div();
		if ("textarea".equalsIgnoreCase(this.tipo)) {
			TextArea ta;
			ta = new TextArea(getName(), getIntAttribute("rows"), getIntAttribute("cols"));
			ta.addElement(getValue());
			innerdiv.addElement(ta);
		} else {
			Input input = new Input(this.tipo,getName(),getValue());
			if (Input.checkbox.equalsIgnoreCase(this.tipo) && !DbUtils.isVuoto(getValue()))
				input.setChecked(true);
			innerdiv.addElement(input);
		}
		div.addElement(innerdiv);
	}

	protected String getDescr() {
		return StringUtils.voidStringIfNull(getStringAttribute("descr"));
	}

}
