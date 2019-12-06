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

import generatoreEngine.toolkit.xml.toolKitXML;
import it.elco.menu.components.standard.menuReader;
import it.elco.toolkit.toolKitJSON;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

public class testMenu {

    /**
     * @param args
     */
    public static void main(String[] args) {
		
		
		/*menuReader mR =new menuReader();

		mR.setPathConfig("C:\\temp");
        mR.setPathFileConfig("engine.xml");
		mR.readConfig("C:\\temp\\menu.xml");*/

        /*String xml = "<campi><campo id=\"dd\">ciao</campo><campo id=\"dd\">ciao</campo></campi>";

        JSONObject xmlJson = new JSONObject();
        try {
            xmlJson = org.json.XML.toJSONObject(xml);
        } catch (JSONException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

        System.out.println(xmlJson); */




        String jSonSave = "{\"username\":\"fabri\",\"iden_cdc\":[\"1\",\"22\",\"333\"]}";

        String xmlSave = null;

        JSONObject jSonTmp = null;
        try
        {
            jSonTmp = new JSONObject(jSonSave);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        toolKitJSON jSon = new toolKitJSON(jSonTmp);

        try
        {
            //xmlSave = jSon.getXMLmod();
            xmlSave = jSon.toXmlRequest();
        }
        catch (JSONException e)
        {
            e.printStackTrace();
        }

        //System.out.println("XMLSAVE -> " + xmlSave);

    }

}
