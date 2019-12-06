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

import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import matteos.database.DbUtils;
import matteos.servlets.polaris.PolarisContext;

import org.apache.ecs.html.Div;
import org.apache.ecs.html.Option;
import org.apache.ecs.html.Select;
import org.jdom.Element;

/**
 * @author matteos
 * @deprecated Usare il template basato sulle Options
 */
public class Udm extends Options {

	public Udm(Element el, BaseElement parent, ServletContext context, HttpServletRequest request, HttpServletResponse response, baseUser logged_user, String reparto) {
		super(el.setAttribute("tipo", Options.Tipo.select.name()), parent, context, request, response, logged_user, reparto);
/*		if (DbUtils.isVuoto(getName()))
			setAttribute("name", "UdmFarmaco");*/
	}

	@Override
	protected void generaDiv(Div div) {
		try {
			Select sel = new Select();
			Statement stm = PolarisContext.getDataConnection(logged_user, context).createStatement();
			int selected;
			try {
				selected = Integer.parseInt(getValue());
			} catch (NumberFormatException nfe) {
				selected=getDefault();
			}
			ResultSet rst = stm.executeQuery("select IDEN, DESCRIZIONE, case when iden=" + selected + " then 0 when iden in (" + getPreferred() + ") then 1 else 2 end LIV from tab_codifiche where tipo_scheda='FARMACI' and tipo_dato='UDM' and attivo='S' and deleted='N' order by LIV, ORDINE");
			while (rst.next()) {
				Option op = new Option("", rst.getString("IDEN"), rst.getString("DESCRIZIONE"));
				switch(rst.getInt("LIV")) {
				case 0:
					op.addAttribute("default", "");
					break;
				case 1:
					op.addAttribute("specifico", "");
				default:
//					op.addAttribute("cls", "udm_2");
				}
				sel.addElement(op);
			}
/*			if (!isEditable())
				sel.setDisabled(true);*/
			Div innerdiv = new Div();
			innerdiv.addElement(sel);
			div.addElement(innerdiv);
		} catch (Exception e) {
			log.error(e);
		}
	}

	protected int getDefault() {
		return getIntAttribute("default");
	}

	protected String getPreferred() {
		String ritorno = getStringAttribute("preferred");
		if (DbUtils.isVuoto(ritorno))
			return "0";
		else
			return ritorno;
	}

}
