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

import imago.http.ImagoHttpException;
import imago.http.classDivButton;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.util.CTabForm;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.ecs.Doctype;

public class SrvFirmaPdf extends SrvFirma{

	public SrvFirmaPdf(ServletContext pCont, HttpServletRequest pReq) throws InstantiationException, IllegalAccessException {
		super(pCont, pReq);
		super.setDocType(null);		
		// TODO Auto-generated constructor stub
	}

	protected String getBody() {

		String body = super.getBody();	
		try {
			body += campi_hidden();
		} catch (ImagoHttpException e) {
			e.printStackTrace();
		}
		
        classLabelHtmlObject label_titolo = new classLabelHtmlObject("", "",    "titolo");

        classTabHeaderFooter header = new classTabHeaderFooter(label_titolo);
        
        if (checkReparto(super.request.getParameter("typeProcedure")))
        {
        	classDivButton pulsanteStampaCartella = new classDivButton("", "pulsante","javascript:firmaPdf.apriStampaGlobale();", "btStampaCartella", "");
        	header.addColumn("classButtonHeader", pulsanteStampaCartella.toString());
        }  
        
        classDivButton pulsanteChiudi = new classDivButton("", "pulsante","javascript:firmaPdf.closeAnteprima();", "btChiudi", "");
        header.addColumn("classButtonHeader", pulsanteChiudi.toString());
        body += header.toString();
            
        return body;		
	}

	protected String getTitle(){
		super.getTitle();
		return "Firma";
		
	}
	
	protected String getBottomScript() {
		return "";//"<SCRIPT type=\"text/javascript\">InizializzaFirma();</SCRIPT>";
	}
	
    private String campi_hidden() throws ImagoHttpException {
        CTabForm tab_form = null;
        String form = "";
        try {
            tab_form = new CTabForm(super.bUtente, super.getClass().getName());
            form = tab_form.get();
        } catch (Exception e) {
            throw new ImagoHttpException(super.getClass().getName() +                    ".campi_hidden(): tipo_wk = WK_RICHIESTE --- " +                                         e.getMessage());
        }
        return form;
    }
	
    private Boolean checkReparto(String funzione)
    {
        /**
         * Da rendere configurabile
         */
    	if ("LETTERA_DIMISSIONI_DH".equals(funzione) || "LETTERA_STANDARD".equals(funzione))
    	{/*non aggiungo il button stampa cartella*/
    		return true;   		
    	}
    	else
    	{/*aggiungo il button stampa cartella nel caso delle varie lettere*/
    		return false;
    	} 
    } 	
}
