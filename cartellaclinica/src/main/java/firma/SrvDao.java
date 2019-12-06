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
package firma;

import imago.http.classFormHtmlObject;

import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;

import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago_jack.imago_function.html.functionHTML;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import generic.servletEngine;

public class SrvDao extends servletEngine {

	private HttpServletRequest request = null; 


	public SrvDao(ServletContext pCont,HttpServletRequest pReq){
		super(pCont,pReq);
		this.request = pReq;
		this.setBaseObject(true, true, true, true);
	}
	
	@Override
	protected String getBody() {
		String body = "";
		this.BODY.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);");
		/*String body = "";
        classLabelHtmlObject label_titolo = new classLabelHtmlObject("", "",    "titolo");
        
        classTabHeaderFooter header = new classTabHeaderFooter(label_titolo); 
        classDivButton pulsanteChiudi = new classDivButton("", "pulsante","javascript:closeAnteprima();", "btChiudi", "");
        header.addColumn("classButtonHeader", pulsanteChiudi.toString());
        body += header.toString();*/
		classDivButton pulsanteRegistra = new classDivButton("", "pulsanteSiss","", "btRegistra", "");
		classDivButton pulsanteChiudi = new classDivButton("", "pulsanteSiss","", "btChiudi", "");
		classDivHtmlObject containerButton = new classDivHtmlObject("classTabHeaderMiddle");
		containerButton.appendSome(pulsanteChiudi);
		containerButton.appendSome(pulsanteRegistra);
		body+= getTableCheck();


        body+= containerButton.toString();

        
        return body;		
	}

	@Override
	protected String getTitle() {
		// TODO Auto-generated method stub
		return "Modifica Oscuramento e Autorizzazione";
	}

	@Override
	protected String getBottomScript() {
		return "";
	}




	private String getTableCheck() {

		
		functionHTML fhtml = new functionHTML();    
		classFormHtmlObject form = new classFormHtmlObject("formDAO", "SrvDAO", "POST");
		
	    classLabelHtmlObject label_titolo = new classLabelHtmlObject("", "", "titoloDAO");
	    classTabHeaderFooter header = new classTabHeaderFooter(label_titolo);
	    
	    
	    form.appendSome(header.toString());
	    label_titolo = new classLabelHtmlObject("", "", "titoloOscuramento");
	    header = new classTabHeaderFooter(label_titolo);
	    form.appendSome(header.toString());

	    fhtml.init_table();
	    fhtml.init_riga();
	    fhtml.creaColonnaCheck("oscCitta", "", "Oscuramento Volere Cittadino", "", false);
	    fhtml.aggiungiRiga();
	    fhtml.creaColonnaCheck("oscHIV", "", "Oscuramento per HIV", "", false);
	    fhtml.aggiungiRiga();
	    fhtml.creaColonnaCheck("oscVio", "", "Oscuramento per Violenza Subita", "", false);
	    fhtml.aggiungiRiga();
	    fhtml.creaColonnaCheck("oscGra", "", "Oscuramento per interruzione volontaria di Gravidanza", "", false);
	    fhtml.aggiungiRiga();
	    fhtml.creaColonnaCheck("oscTos", "", "Oscuramento per tossicodipendenza", "", false);
	    fhtml.aggiungiRiga();
	    form.appendSome(fhtml.getTable().toString());
	    label_titolo = new classLabelHtmlObject("", "", "titoloAutorizzazione");
	    header = new classTabHeaderFooter(label_titolo);
	    form.appendSome(header.toString());
	    fhtml.init_table();
	    fhtml.init_riga();
	    fhtml.creaColonnaCheck("Autorizzazione", "", "Autorizzazione", "", false);
	    fhtml.aggiungiRiga();
	    form.appendSome(fhtml.getTable().toString());
	    label_titolo = new classLabelHtmlObject("", "", "titoloNote");
	    header = new classTabHeaderFooter(label_titolo);
	    form.appendSome(header.toString());
	    fhtml.init_table();
	    fhtml.init_riga();

	    fhtml.creaColonnaTitle("", "");
	    fhtml.aggiungiRiga();
	    fhtml.init_table();
	    fhtml.init_riga();
	    form.appendSome(fhtml.getTable().toString());
	    fhtml.creaColonnaTxtArea("txtArea", "");
	    fhtml.aggiungiRiga();
	    form.appendSome(fhtml.getTable().toString());
	    
		return form.toString();
	}

}
