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
package refertazioneConsulenze.pckObject;

import generatoreEngine.components.html.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class pckTextArea implements iRefLetObject{
    private String idTxtArea;
    private String label;
    private String riferimenti;
    public String value;
    private String ordinamento;

    public pckTextArea(String id,String lbl,String ref,String contenuto){
        this.idTxtArea=id;
        this.label = lbl;
        this.riferimenti=ref;
        this.value=contenuto;
    }

    public pckTextArea(String id,String lbl,String ref,String contenuto, String ordinamento){
        this.idTxtArea=id;
        this.label = lbl;
        this.riferimenti=ref;
        this.value=contenuto;
        this.ordinamento = ordinamento;
    }

	@Override
	public String toHtml(String lblSezione) {
		String resp = "";
        int rows = 0;
		String nRows= "";
		htmlSpan spanSezione = new htmlSpan();
		spanSezione.addAttribute("class", "SubTitleSection");
		spanSezione.appendTagValue(this.label);
		spanSezione.addAttribute("id", "span"+this.idTxtArea);

		htmlDiv divTestiStd = new htmlDiv();
		divTestiStd.addAttribute("name", "idTxtStd");
		divTestiStd.addAttribute("idSezione", this.idTxtArea);

		htmlTextarea textArea = new htmlTextarea();
		textArea.addAttribute("name"	, this.idTxtArea);
		textArea.addAttribute("id"		, this.idTxtArea);
		textArea.addAttribute("sezione"	, lblSezione);
		textArea.addAttribute("label"	, this.label);
		textArea.addAttribute("attiva"	, "S");
		textArea.addAttribute("ordinamento", this.ordinamento);

        try {
            rows = Integer.valueOf(this.riferimenti);
            textArea.setRows(rows);
        } catch (NumberFormatException nfe) {
            Pattern pattern = Pattern.compile("rows=\\d");
            Matcher matcher = pattern.matcher(this.riferimenti);
            if (matcher.find()) {
                Pattern patternNum = Pattern.compile("\\d");
                Matcher matcherNum = patternNum.matcher(matcher.group(0));
                if (matcherNum.find()) {
                    nRows = matcherNum.group(0);
                    textArea.setRows(nRows);
                }
            }

        }

        /*Pattern pattern = Pattern.compile("class=\"[a-zA-Z]*\"");
         Matcher matcher = pattern.matcher(this.riferimenti);
         if (matcher.find())
         {
         Pattern patternStr = Pattern.compile("Terapie|Readonly");
         Matcher matcherStr = patternStr.matcher(matcher.group(0));
         if (matcherStr.find()){
         textArea.addAttribute("class", matcherStr.group(0));
         }

         }*/
        if(this.value!=null || this.value!="")
    		textArea.appendTagValue(value);

        resp = spanSezione.generateTagHtml() + divTestiStd.generateTagHtml() + textArea.generateTagHtml();
        return resp;


	}


	@Override
	public String toHtml() {
		// TODO Auto-generated method stub
		return null;
	}


}