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

import org.apache.ecs.html.Div;
import org.jdom.Element;

public class Timeline extends UserInput {

	public Timeline(Element elm, BaseElement parent, ServletContext context, HttpServletRequest request, HttpServletResponse response, baseUser logged_user, String reparto) throws NullPointerException {
		super(elm, parent, context, request, response, logged_user,reparto);
		if (DbUtils.isVuoto(this.tipo)) {
			this.tipo = getClass().getSimpleName();
			div.removeAttribute("tipo");
			div.addAttribute("tipo", this.tipo);
		}
	}

	@Override
	protected void generaDiv(Div div) {
		div.addElement("<div id='scrollObj' initX='' speed=''><div id='timeline' class='timeline' onmousedown='timeline.Scroll(true);' onmouseup='timeline.Scroll(false);' ><table border='0' cellpadding='0' cellspacing='0'><tbody index='0' showGiorni='1' showOre='1'  showBlocchi='1' editing='1' printOre='1'><div id='toolTip'></div> </tbody></table></div></div>");
	}

}
