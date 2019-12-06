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
package generic.utility.html;

import generatoreEngine.components.html.htmlA;
import generatoreEngine.components.html.htmlDiv;
import generatoreEngine.components.html.htmlH2;
import generatoreEngine.components.html.htmlLabel;
import generatoreEngine.components.html.htmlLi;
import generatoreEngine.components.html.htmlUl;
import generatoreEngine.components.html.ibase.iHtmlTagBase;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author Fra
 * @version 1.0
 */
public class Tabulatore {

    iHtmlTagBase headerTabs;
    iHtmlTagBase tabs = new htmlDiv().setId("tabs");
    iHtmlTagBase ulTabs = new htmlUl().addAttribute("class","ulTabs");
    iHtmlTagBase contentTabs = new htmlDiv().setId("contentTabs");
    iHtmlTagBase footerTabs = new htmlDiv().setId("footerTabs");
    iHtmlTagBase buttons = new htmlDiv().addAttribute("class","buttons");

    public Tabulatore() {
        this("");
    }

    public Tabulatore(String pHeaderTabsText) {
        this.headerTabs = new htmlDiv().setId("headerTabs").appendChild(new htmlH2().setTagValue(pHeaderTabsText));
    }

    public void appendTabulatore(iHtmlTagBase pParentElement){
        pParentElement.appendChild(this.tabs.appendChild(this.ulTabs));
        pParentElement.appendChild(this.headerTabs);
        pParentElement.appendChild(this.contentTabs);
        pParentElement.appendChild(this.footerTabs.appendChild(this.buttons));
    }

    public String toString(){
        StringBuffer html = new StringBuffer();
        html.append(this.tabs.appendChild(this.ulTabs).generateTagHtml());
        html.append(this.headerTabs.generateTagHtml());
        html.append(this.contentTabs.generateTagHtml());
        html.append(this.footerTabs.appendChild(this.buttons).generateTagHtml());

        return html.toString();
    }

    public Tabulatore addTab(String pText){
        this.ulTabs.appendChild(new htmlLi().appendChild(new htmlLabel().setTagValue(pText)));
        return this;
    }

    public Tabulatore addTab(String pText,iHtmlTagBase pElement){
        this.addTab(pText);
        this.addContentTab(pElement);
        return this;
    }

    public Tabulatore addContentTab(iHtmlTagBase pElement){
        this.contentTabs.appendChild(pElement);
        return this;
    }

    public Tabulatore addButton(String pId,String pText){
        this.buttons.appendChild(new htmlA().setId(pId).addAttribute("class","button").setTagValue(pText));
        return this;
    }

}
