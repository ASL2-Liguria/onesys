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

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import matteos.database.DbUtils;
import matteos.utils.StringUtils;

import org.jdom.Element;

public class Farmaco extends Gruppo {

    protected int getIden() {
    	return getIntAttribute("iden");
    }

	public Farmaco(Element el, BaseElement parent, ServletContext context, HttpServletRequest request, HttpServletResponse response, baseUser logged_user,String reparto) {
		super(el, parent, context, request, response, logged_user, reparto);
		if (getIden() > 0)
			div.addAttribute("iden", getIden());
	}

	public void setValues(String IDEN_FARMACO) throws SQLException {
		PreparedStatement stm = null;
		ResultSet rst = null;
		try {
			stm = getDataConnection().prepareStatement("select * from VIEW_CC_FARMACI_SOSTANZE where IDEN=?");
			stm.setInt(1, Integer.parseInt(IDEN_FARMACO));
			rst = stm.executeQuery();
			while (rst.next()) {
				setAttribute("descr", rst.getString("DESCR")); // Viene preso via xpath dalla label contenuta
				
				setAttribute("iden", rst.getString("IDEN"));
				div.addAttribute("iden", getIden());
				
				setAttribute("sostanza", StringUtils.voidStringIfNull(rst.getString("DESCR_SOSTANZA"))); // Viene preso via xpath dalla label contenuta
			}
		} catch (SQLException sqle) {
			log.error("Farmaco.setValues(" + IDEN_FARMACO + ")", sqle);
		} finally {
			DbUtils.close(rst);
			DbUtils.close(stm);
			rst = null;
			stm = null;
		}
	}
}
