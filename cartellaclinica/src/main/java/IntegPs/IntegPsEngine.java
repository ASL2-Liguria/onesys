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
package IntegPs;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import worklist.ImagoWorklistException;

public class IntegPsEngine {
    HttpSession mySession ;
    HttpServletRequest myRequest ;
    HttpServletResponse myResponse ;
	private static final String PAGE_TOP = ""
	      + "<html>"
	      + "<head>" 
	      +	"<link href=\"std/css/headerTable.css\" type=\"text/css\" rel=\"stylesheet\">"
	      +	"<link href=\"std/css/button.css\" type=\"text/css\" rel=\"stylesheet\">"
	      +	"<link href=\"std/css/normalBody.css\" type=\"text/css\" rel=\"stylesheet\">"
	      + "<script>"
	      + "var arrayLabelName = new Array(\"btChiudi\",\"titoloAnte\");"
	      + "var arrayLabelValue = new Array(\"CHIUDI\",\"Anteprima di Stampa\");"
	      + "</script>" 
	      + "<script>"
	      + "var DisPulsPrint=\"N\";"
	      + "var funzioneStampa=\"\";"
	      + "var StampaSu=\"N\";"
	      + "var sorgente=\"null\";"
	      + "var pdfPosition=\"\";"
	      + "var n_copie=\"1\";"
	      + "var requestAnteprima=\"S\";"
	      + "var OffsTop=\"-1\";"
	      + "var OffsLeft=\"-1\";"
	      + "var Rotation=\"-1\";"
	      + "var selezionaStampante=\"\";"
	      + "var width=996;"
	      + "var height=684;"
	      + "</script>"
	      + "<script type=\"text/javascript\" src=\"std/jscript/fillLabels.js\" language=\"JavaScript\"></script>"
	      + "<script type=\"text/javascript\" src=\"std/jscript/src/Sel_Stampa/elabStampa.js\" language=\"JavaScript\"></script>"
	      + "</head>"
	      + "<body onLoad=\"fillLabels(arrayLabelName,arrayLabelValue);\" class=\"body\">"
	      + "</body>"; 
    
    
    
    public IntegPsEngine ( HttpSession myInputSession,
    	    HttpServletRequest myInputRequest,
    	    HttpServletResponse myInputResponse ) throws ImagoWorklistException {

    	          mySession = myInputSession;
    	          myRequest = myInputRequest;
    	          myResponse = myInputResponse;
    	      /*    fDB = new functionDB(this);
    	          fStr = new functionStr();
    	      */    
    	    }
    
    public String creaHead(){
    	String cHead="";
    	return cHead;
    }
    
    
    public String creaDocumentoHtml(){
    	String reparto = "";
    	String tipo = "";
    	String idRichiesta = "";
    	String num_nosologico = "";
    	reparto = myRequest.getParameter("reparto");
    	tipo = 	myRequest.getParameter("tipo");
    	idRichiesta = myRequest.getParameter("idRichiesta");
    	num_nosologico = myRequest.getParameter("num_nosologico");
    	/*System.out.println("tipo"+tipo);
    	System.out.println("reparto"+reparto);
    	System.out.println("reparto"+idRichiesta);*/
    	String myHtml="";
    	myHtml=IntegPsEngine.PAGE_TOP;
    	//System.out.println("prima"+myHtml);
    	
    	myHtml+= "<script>"
    		+"UrlIntegPS(\""+tipo+"\",\""+reparto+"\",\""+idRichiesta+"\",\""+num_nosologico+"\");"
    		+"</script>"
    		+"</html>";
    	
    	//System.out.println("dopo"+myHtml);
    	return myHtml;
    }
}
