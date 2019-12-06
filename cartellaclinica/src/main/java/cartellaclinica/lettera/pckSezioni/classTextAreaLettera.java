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
package cartellaclinica.lettera.pckSezioni;


public class classTextAreaLettera {
    private String idTxtArea;
    private String label;
    private String riferimenti;
    public String value="";

    public classTextAreaLettera(String id,String lbl,String ref,String contenuto){
        this.idTxtArea=id;
        this.label = lbl;
        this.riferimenti=ref;
        this.value=contenuto;
    }

    public String toHTML(String lblSezione){

        String resp="<span class=SubTitleSection>"+this.label+"</span>\n";
        resp+="<div name=\'idTxtStd\' idSezione=\'"+this.idTxtArea+"\' ></div>";
        resp+=      "<textarea name=\""+this.idTxtArea+"\" id=\""+this.idTxtArea+"\" "+this.riferimenti+" sezione=\""+lblSezione+"\" label=\""+this.label+"\" attiva=S>";

        if(this.value!=null)
            resp+=      this.value;

        resp+=      "</textarea>";

        return resp;
    }

    public void setValue(String val){
        this.value = val;
    }
}
