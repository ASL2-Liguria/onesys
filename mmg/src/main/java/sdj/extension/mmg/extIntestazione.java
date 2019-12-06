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
package sdj.extension.mmg;


import generatoreEngine.components.extension.base.extensionHtmlBase;
import generatoreEngine.components.extension.exception.extensionExceptionEnd;
import generatoreEngine.components.extension.exception.extensionExceptionInit;
import generatoreEngine.components.html.htmlDiv;
import generatoreEngine.components.html.htmlInput;
import generatoreEngine.components.html.htmlLabel;
import generatoreEngine.components.html.htmlSelect;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import it.elco.baseObj.BaseUser;
import it.elco.caronte.dataManager.impl.iDataManager;
import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.toolkit.toolKitShortcut;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.support.rowset.SqlRowSet;

/**
 * 
 * @author jacopo
 * @author lucas per la parte del menu it.elco.mmg
 *
 */
@Deprecated
public class extIntestazione extends extensionHtmlBase
{
	private static final long serialVersionUID	= -6440620892493186077L;
	
	private Logger	logger	 	= LoggerFactory.getLogger(extIntestazione.class);
	
	private ServletContext		sContext	= null;
	private HttpServletRequest	sRequest	= null;
	private HttpSession			session		= null;
	
	private BaseUser			baseUser		= null;
	
	@Override
	/**
	 * init(this.context, request, response, this.conf_servlet) arriva da page
	 */
	public void init(Object[] param) throws extensionExceptionInit {
		sContext	= (ServletContext)		param[0];
		sRequest	= (HttpServletRequest)	param[1];
		session		= sRequest.getSession(false);
		baseUser	= (BaseUser) session.getAttribute("BASEUSER");
	}

	@Override
	public void end() throws extensionExceptionEnd 
	{
		
	}
	public void generaIntestazione()
	{
		
		iHtmlTagBase container =  super.getHtmlWork();
		container.appendChild(createDivInfo());
	}

	private htmlDiv createDivInfo (){
		
		htmlDiv divInformazioni = new htmlDiv();
		divInformazioni.addAttribute("id","divInfo");

		htmlSelect comboProblema = new htmlSelect();
		comboProblema.addAttribute("id", "cmbMenuProblema");
		comboProblema.addAttribute("class", "cmbMenuProblema");

		htmlDiv divIconInfo = new htmlDiv();
		divIconInfo.addAttribute("id","divIconInfo");
		htmlInput inp = new htmlInput();
		inp.addAttribute("id","hConsenso");
		inp.addAttribute("type", "hidden");
		inp.addAttribute("value", "");
		divIconInfo.appendChild(inp);

		htmlDiv divIconAllergieInt = new htmlDiv();
		divIconAllergieInt.addAttribute("id","divAllInt");
		htmlInput inpAllInt = new htmlInput();
		inpAllInt.addAttribute("id","hAllInt");
		inpAllInt.addAttribute("type", "hidden");
		inpAllInt.addAttribute("value", "");
		divIconAllergieInt.appendChild(inpAllInt);


		divInformazioni.addAttribute("id","divInfo");
		divInformazioni.appendChild(divIconInfo);
		divInformazioni.appendChild(divIconAllergieInt);
		divInformazioni.appendChild(createLabel("lblInfoPaziente","","lblInfo"));
		divInformazioni.appendChild(createLabel("aInfoPaziente","", "lblDettaglioInfo"));
		divInformazioni.appendChild(createLabel("lblInfoEta","","lblInfo"));
		divInformazioni.appendChild(createLabel("aInfoEta","", "lblDettaglioInfo"));
		divInformazioni.appendChild(createLabel("lblInfoCodFisc","","lblInfo"));
		divInformazioni.appendChild(createLabel("aInfoCodFisc","", "lblDettaglioInfo"));
		divInformazioni.appendChild(createLabel("lblMedBase","","lblInfo"));
		divInformazioni.appendChild(createLabel("aInfoMedBase","", "lblDettaglioInfo"));
		divInformazioni.appendChild(createLabel("lblInfoUtente","","lblInfo"));
		divInformazioni.appendChild(createLabel("aInfoUtente","", "lblDettaglioInfo"));
		divInformazioni.appendChild(createLabel("lblInfoLogin","","lblInfo"));
		divInformazioni.appendChild(createLabel("aInfoLogin","", "lblDettaglioInfo"));
		divInformazioni.appendChild(createLabel("lblInfoAccesso","","lblInfo"));
		divInformazioni.appendChild(createLabel("aInfoAccesso","", "lblDettaglioInfo"));
		divInformazioni.appendChild(createLabel("lblMedPrescrittore","","lblInfo"));
		divInformazioni.appendChild(createLabel("aInfoMedPrescr","", "lblDettaglioInfo"));
		divInformazioni.appendChild(comboProblema);
		divInformazioni.appendChild(createLabel("aInfoProblema","", "lblDettaglioInfo"));
		divInformazioni.appendChild(createLabel("lblInfoProblema","","lblInfo"));
		
		return divInformazioni;
	}
	
	private htmlLabel createLabel(String pId, String pValue, String pClass){
		
		htmlLabel Label = new htmlLabel();
		
		try{
				
			Label.addAttribute("id", pId);
			Label.addAttribute("class", pClass);
			Label.setTagValue(pValue);
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return Label;
	}
	
}
