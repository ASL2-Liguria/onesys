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

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;

import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class SrvFirmaSiss extends SrvFirma {

	private HttpServletRequest request 	= null;
	private boolean getFirstFirma		= true;

	public SrvFirmaSiss(ServletContext pCont, HttpServletRequest pReq) {
		super(pCont, pReq);
		this.request = pReq;
		if (this.request.getParameter("stato").equalsIgnoreCase("F")){
			this.setGetFirstFirma(false);
		}
		
		// TODO Auto-generated constructor stub
	}

	protected String getBody() {
		String body = super.getBody();	
		//this.BODY.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);tutto_schermo();");
        classLabelHtmlObject label_titolo = new classLabelHtmlObject("", "",    "titolo");

        classTabHeaderFooter header = new classTabHeaderFooter(label_titolo); 
        classDivButton pulsanteChiudi = new classDivButton("", "pulsanteSiss","javascript:beforeSISS.closeAnteprima();", "btChiudi", "");
        header.addColumn("classButtonHeader", pulsanteChiudi.toString());
        body += header.toString();
        
        body+= this.getTableConfigSiss().toString();
        body+= this.getButtonFirmaSiss().toString();
        return body;		
	}

	protected String getTitle(){
		super.getTitle();
		return "Firma SISS";
		
	}
	
	protected classFormHtmlObject getTableConfigSiss() {
		classFormHtmlObject cForm = new classFormHtmlObject("formConfigFirmaSiss","","","");
		ResultSet rs;
		ResultSetMetaData rsmd;
		try {
			rs = this.getStatementFromFile().executeQuery("firmaSiss.xml","siss.getImagowebConfigFirmaSiss",
					new String[]{this.bReparti.getValue(super.request.getParameter("repartoDest"), "configFirmaSiss"),super.request.getParameter("typeFirma").equalsIgnoreCase("SISS")? "S":"N"});
			
			if (rs.next()) {
				rsmd = rs.getMetaData();
				for (int i = 1; i <= rsmd.getColumnCount(); i++)
					cForm.appendSome(new classInputHtmlObject("hidden",rsmd.getColumnName(i), this.chkNull(rs.getString(rsmd.getColumnName(i)))));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return cForm;
	}


	protected classDivHtmlObject getButtonFirmaSiss() {
		classDivHtmlObject containerButton = new classDivHtmlObject("classButtonHeader");
		/*Se il parametro primaFirma è true,tiro fuori solo i button di firma e modificadao*/
		classDivButton buttonFirma	= new classDivButton("", "pulsanteSiss", "","idBtnFirma","");
		classDivButton 	buttonDao	= new classDivButton("", "pulsanteSiss", "","idBtnDao","");
		classDivButton 	buttonSost 	= new classDivButton("", "pulsanteSiss", "","idBtnFirmaSost","");
		classDivButton 	buttonAnnul	= new classDivButton("", "pulsanteSiss", "","idBtnFirmaAnnul","");
//		classDivButton 	buttonInteg	= new classDivButton("", "pulsante", "","idBtnFirmaInteg","idBtnFirmaInteg");
//		containerButton.appendSome(buttonInteg);
		
		if (this.isGetFirstFirma()){
			containerButton.appendSome(buttonDao);
			containerButton.appendSome(buttonFirma);
		}else{
			//containerButton.appendSome(buttonFirma);
			containerButton.appendSome(buttonDao);
			containerButton.appendSome(buttonSost);
			containerButton.appendSome(buttonAnnul);
		}
		
		return containerButton;
	}
	
	public boolean isGetFirstFirma() {
		return getFirstFirma;
	}
	

	public void setGetFirstFirma(boolean getFirstFirma) {
		this.getFirstFirma = getFirstFirma;
	}
	
}
