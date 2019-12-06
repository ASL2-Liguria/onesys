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
package charts.multipleCharts.dati;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.sql.Clob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;

import org.jdom.Element;
import org.jdom.Document;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

public class parsedXml {

	private ArrayList<cParametro> alParametri = new ArrayList<cParametro>();
	private ArrayList<cPeriodo> alPeriodi = new ArrayList<cPeriodo>();
	private ArrayList<cFarmaco> alFarmaci = new ArrayList<cFarmaco>();

	public parsedXml(Clob inXml) throws NullPointerException, IOException, JDOMException, SQLException {
		Reader r = inXml.getCharacterStream();
		SAXBuilder builder = new SAXBuilder();
		Document docXml = builder.build(r);
		readXml(docXml);
	}
	
	@Deprecated
	public parsedXml(String inXml) throws IOException, JDOMException {
		InputStream is = new ByteArrayInputStream(inXml.getBytes("UTF-8"));
		SAXBuilder builder = new SAXBuilder();
		Document docXml = builder.build(is);
		readXml(docXml);
	}

	private void readXml(Document docXml) {
		Iterator<?> iterator;
		
		iterator=((Element) docXml.getRootElement().getChild("PARAMETRI")).getChildren().iterator();
		while (iterator.hasNext())
			alParametri.add(new cParametro((Element)iterator.next()));

		iterator=((Element) docXml.getRootElement().getChild("PERIODI")).getChildren().iterator();
		while (iterator.hasNext())
			alPeriodi.add(new cPeriodo((Element)iterator.next()));

		iterator=((Element) docXml.getRootElement().getChild("FARMACI")).getChildren().iterator();
		while (iterator.hasNext())
			alFarmaci.add(new cFarmaco((Element)iterator.next()));
	}
	
	public ArrayList<cPeriodo> getPeriodi(){
		return alPeriodi;
	}
	
	public ArrayList<cParametro> getParametri(){
		return alParametri;
	}
	
	public ArrayList<cFarmaco> getFarmaci(){
		return alFarmaci;
	}
	
	public boolean visualizzaParametro(String idenParametro){
		boolean resp = false;

		for (int i=0;i<alParametri.size();i++)
			if(alParametri.get(i).idenParametro.equals(idenParametro))
				resp = true;
		return resp;
	}
	
	public boolean visualizzaParametroLine(String idenParametro){
		boolean resp = false;

		for (int i=0;i<alParametri.size();i++)
			if(alParametri.get(i).idenParametro.equals(idenParametro))
				resp = alParametri.get(i).line.equals("S");
		return resp;
	}
	
	public boolean visualizzaParametroShape(String idenParametro){
		boolean resp = false;

		for (int i=0;i<alParametri.size();i++)
			if(alParametri.get(i).idenParametro.equals(idenParametro))
				resp = alParametri.get(i).shape.equals("S");
		return resp;
	}
	
	public boolean visualizzaParametroLabel(String idenParametro){
		boolean resp = false;

		for (int i=0;i<alParametri.size();i++)
			if(alParametri.get(i).idenParametro.equals(idenParametro))
				resp = alParametri.get(i).label.equals("S");
		return resp;
	}
	
	public ArrayList<cFarmaco> getFarmaciParametroPeriodo(String idenParametro,String ordinePeriodo)
	{
		ArrayList<cFarmaco> al = new ArrayList<cFarmaco>();
		for (int i =0;i<alFarmaci.size();i++) {
			if (alFarmaci.get(i).idenParametro.equals(idenParametro) && alFarmaci.get(i).ordinePeriodo.equals(ordinePeriodo))
				al.add(alFarmaci.get(i));
		}
		return al;
	}
	
	public String getPrecision(String iden_parametro)
	{
		String ret = "";
		for(int i = 0;i<alParametri.size();i++) {
			if (alParametri.get(i).idenParametro.equals(iden_parametro))
				ret = alParametri.get(i).precision;
		}
		return ret;
	}
}
