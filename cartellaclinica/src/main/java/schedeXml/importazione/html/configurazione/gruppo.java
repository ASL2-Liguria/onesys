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
package schedeXml.importazione.html.configurazione;

import generic.utility.controlStructure;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;

import org.jdom.Element;


public class gruppo {

    ArrayList<riga> alRighe = new ArrayList<riga>();
    String id,lbl;
    boolean Default;
    controlStructure cs = new controlStructure();

    public gruppo(Element pElm) {

        Default = pElm.getAttributeValue("default").equals("S");
        id=pElm.getAttributeValue("id");
        lbl=pElm.getAttributeValue("lbl");

        List lst = pElm.getChildren("RIGA");
        Iterator it = lst.iterator();

        while (it.hasNext()) {
            alRighe.add(new riga((Element) it.next()));
        }

    }

    public String getHtml(Hashtable<String,String> pLingue) {


        String html = "<div>";

        html+="<div class=gruppo>";

        html += "<input type=checkbox id=\""+id+"\" " + cs.ifControl(Default,"checked")+ " onClick=\"abilitaGruppo(this);\"/>";
        html += "<label for=\""+id+"\">"+pLingue.get(lbl)+"</label>";

        html += "</div>";

        for (int i = 0; i < alRighe.size(); i++) {
            html += alRighe.get(i).getHtml(pLingue,Default);
        }

        html+="</div>";

        return html;
    }

}
