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
package cartellaclinica.cartellaPaziente.Visualizzatore.frameFiltri.html;

import imago.http.classInputHtmlObject;
import imago.http.classTypeInputHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago_jack.imago_function.html.functionHTML;
import imago_jack.imago_function.obj.functionObj;


public class cFiltriHtmlOpt extends functionHTML
{
	
	 private ElcoLoggerInterface logInterface =  new ElcoLoggerImpl(cFiltriHtmlOpt.class);
	
    public cFiltriHtmlOpt()
    {
        super();
    }

    public String draw(functionObj fo,String nosologico,String daData, String aData, String repartiUte, String filtroDoc)
    {
   
        this.init_table();
        this.set_attributo_table("id", "tableOpt");

        this.init_riga();
       
        this.creaColonnaDescr("Reparto", "lblCDC", "", "", "", "javascript:apri_scelta(document.filtri.Hcdc.value,\""+repartiUte+"\",'filtroReparto');");       
        this.creaColonnaViewField("", "lblElencoCDC");
        
        if (!nosologico.equals("")){
        
       // this.setDisabled(true);
     //   	gestioneConstStato z = new gestioneConstStato();
    //    this.setStatusColonna(z.NotVisible);
        this.creaColonnaCheck("check_nosologico","", "", "3", true);
        }
        
   
        if (filtroDoc.equals("S")){
        
        this.creaColonnaDescr("Tipologia documento", "lblTipoDoc", "", "", "", "javascript:apri_scelta(parent.formFiltri.hDoc.value,'','filtroTipDoc');");       
        this.creaColonnaViewField("", "lblElencoTipoDoc");
        	
        	
        }
   

        this.aggiungiRiga();

        this.init_riga();

        this.setViewCalendar(true);

        this.creaColonnaDescr("Da data", "");
        this.creaColonnaFieldDate(new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT, "txtdadata", daData.substring(6, 8)+"/"+daData.substring(4,6)+"/"+daData.substring(0, 4), "12", "10"), "1");
     
         
        this.creaColonnaDescr("A data", "");
        this.creaColonnaFieldDate(new classInputHtmlObject(classTypeInputHtmlObject.typeTEXT, "txtadata", aData.substring(6, 8)+"/"+aData.substring(4,6)+"/"+aData.substring(0, 4), "12", "10"), "1");

 
        this.setViewCalendar(true);
        

        this.aggiungiRiga();

        return this.getTable().toString();
    }
    
    
   
    
    
}
