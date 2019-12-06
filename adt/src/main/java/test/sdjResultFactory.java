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
package test;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

import generatoreEngine.toolkit.xml.toolKitXML;

public class sdjResultFactory
{
	public sdjResultFactory()
	{
	}
	
	public sdjBaseResultSet XmlToResultSet(String xml) throws SQLException
	{
		toolKitXML 			tkXml 	= new toolKitXML();
		sdjBaseResultSet 	rs_ret 	= new sdjResultSet();

		if(tkXml.openXml(xml))
		{
			tkXml.readNode("//ROWSET/ROW");
			
			if(tkXml.getSizeNodeList() > 0)
			{
				rs_ret.dati = new ArrayList<Hashtable<String, String>>();

				for(int i = 0; i < tkXml.getSizeNodeList(); i++)
				{
					toolKitXML 					tkField = new toolKitXML();
					Hashtable<String, String> 	riga 	= new Hashtable<String, String>();

					tkField.readNode(tkXml.getNode(i), "*/text()");

					for(int j = 0; j < tkField.getSizeNodeList(); j++)
					{
						tkField.getNode(j);

						riga.put(tkField.getNodeName(), tkField.getNodeValue());
					}

					rs_ret.dati.add(riga);

					if(rs_ret.meta == null)
						rs_ret.meta = new sdjResulSetMetaData(riga);
				}
			}
		}
		else
			throw new SQLException("Xml vuoto o non valido");

		return rs_ret;
	}
}