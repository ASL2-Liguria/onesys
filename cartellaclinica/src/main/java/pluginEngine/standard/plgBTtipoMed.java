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
/*
    File: plgBTtipoMed.java
    Autore: Lino
 */

package pluginEngine.standard;

import java.sql.ResultSet;
import java.util.ArrayList;

import generatoreEngine.html.engine_html.components.htmlRow;
import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import generatoreEngine.components.html.htmlSpan;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import generic.statements.*;


public class plgBTtipoMed extends baseAttributeEngine
{
	private htmlRow  hRiga   = null;
	private ArrayList<String> a_tipo = null;
	private ArrayList<String> a_tipo_med = null;
	private ArrayList<String> a_descr = null;
	private StatementFromFile sff =  null;
	private String repDestinatario = null;

	public plgBTtipoMed()
	{
		super();
	}

	public Object get_attribute_engine()
	{
		return this.hRiga;
	}

	public void getValueContainer(String nome)
	{
	}

	public void init(ServletContext context, HttpServletRequest request) 
	{
		try {
			this.sff = new StatementFromFile(request.getSession(false));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}		
		setRepDestinatario(request.getParameter("DESTINATARIO"));

    	this.hRiga = new htmlRow();
		super.set_percorso_engine(PATH_ENGINE.ROW);
	}

	public void draw(String classNameButton)          
	{
		setArrayForAttribute();
		String dimension =  Integer.toString(Math.abs(100/Integer.valueOf(this.a_tipo.size())));
		for(int idx=0;idx < this.a_descr.size();idx++)
		{
			this.hRiga.colonna.setClasse("");
			this.hRiga.colonna.add_attribute("width", dimension + "%");
			htmlSpan clbSpanBtn = new htmlSpan();  
			clbSpanBtn.addAttribute("class", classNameButton);
			clbSpanBtn.addAttribute("tipo", this.a_tipo.get(idx)==null?"":this.a_tipo.get(idx));
			clbSpanBtn.addAttribute("tipo_med", this.a_tipo_med.get(idx)==null?"":this.a_tipo_med.get(idx));		
			clbSpanBtn.appendTagValue(this.a_descr.get(idx)==null?"":this.a_descr.get(idx));
			
			this.hRiga.colonna.campo.sostituisciContenuto(clbSpanBtn.generateTagHtml()); 
			this.hRiga.colonna.creaColonnaTD();
		}
	}

	private void setArrayForAttribute() {
		// TODO Auto-generated method stub
		ResultSet rs 	= null;
		a_tipo 		= new ArrayList<String>();
		a_tipo_med 		= new ArrayList<String>();
		a_descr 		= new ArrayList<String>();
		
		try {
			rs = this.sff.executeQuery("OE_Consulenza.xml", "consulenze.retrieveTipoMed", new String[]{getRepDestinatario()});
			while (rs.next()){
				a_tipo.add(rs.getString("tipo"));
				a_tipo_med.add(rs.getString("tipo_med"));
				a_descr.add(rs.getString("descr"));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 		
	}

	public String getRepDestinatario() {
		return repDestinatario;
	}

	public void setRepDestinatario(String repDestinatario) {
		this.repDestinatario = repDestinatario==null?"":repDestinatario;
	}
}
