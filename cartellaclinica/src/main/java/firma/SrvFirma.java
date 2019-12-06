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
import imago.http.classInputHtmlObject;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import generic.servletEngine;

public class SrvFirma extends servletEngine {

	protected HttpServletRequest request 	= null; 

	public SrvFirma(ServletContext pCont,HttpServletRequest pReq){
		super(pCont,pReq);
		this.request = pReq;
		this.setBaseObject(false, false, false, false);
	}

	
	@Override
	protected String getBody() {
		// TODO Auto-generated method stub


		this.BODY.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);tutto_schermo();");
		String body = "";
        body += getFormConfigurazione().toString();


        if (checkReparto(this.request.getParameter("typeProcedure"))){//refertazione di una consulenza
            body += ("<form name=\'frmReturnToWk\' action=\'javascript:opener.top.close();self.close();\' >");
        }
        else
        {//refertazione di una lettera di dimissioni
        	body += ("<form name=\'frmReturnToWk\' action=\'javascript:self.close();\' >");
        }
        body += ("<input type=\'hidden\' name=\'iden_per\' value="+super.bUtente.iden_per+">");
        body += ("</input>");
        body += ("<input type=\'hidden\' name=\'cod_fisc\' value="+super.bUtente.cod_fisc+">");
        body += ("</input>");
        body += ("</form>");
        
        return body;		
	}

	@Override
	protected String getTitle() {
		return null;
		// TODO Auto-generated method stub
	}

	@Override
	protected String getBottomScript() {
		return "";
	}

	protected classFormHtmlObject getFormConfigurazione() {
		classFormHtmlObject cForm = null;
		String reparto = "";
		if (checkReparto(this.request.getParameter("typeProcedure"))){
			cForm 	= new classFormHtmlObject("formConfigurazioneFirma","javascript:opener.top.refreshPage();self.close();","","");
			reparto = request.getParameter("repartoDest");//configurazione del reparto destinatario
		}
		else{
			cForm 	= new classFormHtmlObject("formConfigurazioneFirma","","","");
			reparto = request.getParameter("reparto");			
		}
			
		
		ResultSet rs;
		ResultSetMetaData rsmd;
		try {
			rs = this.getStatementFromFile().executeQuery("firma.xml","getImagowebCcConfigurazioneFirme",
					new String[]{	this.request.getParameter("typeProcedure"),
									reparto,
									this.request.getParameter("typeFirma")
								});
			
			if (rs.next()) {
				rsmd = rs.getMetaData();
				for (int i = 1; i <= rsmd.getColumnCount(); i++)
					cForm.appendSome(new classInputHtmlObject("hidden",rsmd.getColumnName(i), this.chkNull(rs.getString(rsmd.getColumnName(i)))));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		cForm.appendSome(new classInputHtmlObject("hidden","webScheme", request.getScheme()));
		cForm.appendSome(new classInputHtmlObject("hidden","webServerName", request.getServerName()));
		cForm.appendSome(new classInputHtmlObject("hidden","webServerPort",String.valueOf(request.getServerPort())));
		cForm.appendSome(new classInputHtmlObject("hidden","webContextPath", request.getContextPath()));
		
		return cForm;
	}

	private boolean checkReparto(String funzione)
	{
		String rep = new String("");
		boolean ret;
		/**
		 * Da rendere configurabile
		 */
		if ("CONSULENZE_REFERTAZIONE".equals(funzione))
		{/*nella refertazione di una consulenza, devo andare a considerare il reparto destinatario e non quello che esegu la consulenza*/
			ret = true;    		
		}
		else
		{/*devo considerare la configurazione per il reparto che esegue la lettera*/
			ret = false;
		} 
		return ret;
	} 



}
