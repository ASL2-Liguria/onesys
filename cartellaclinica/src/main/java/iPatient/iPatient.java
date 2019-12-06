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
package iPatient;

import generic.statements.StatementFromFile;
import generic.servletEngine;
import generic.statements.StatementFromFile;
import imago.http.classDivHtmlObject;
import imago.http.classIFrameHtmlObject;
import imago.http.classLIHtmlObject;
import imago.http.classULHtmlObject;
import it.elco.json.actions.Marshall;
import it.elco.whale.actions.scopes.Paziente.GetIPatientData;
import it.elco.whale.actions.scopes.Paziente.GetIPatientData.IPatientData;
import it.elco.whale.actions.scopes.Paziente.GetIPatientData.IPatientDataResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import java.net.URLDecoder;
import java.net.URLEncoder;

public class iPatient extends servletEngine {
    public static final String session_user = "login";
    private HttpSession session             = super.hSessione;
    
    private String id_paziente  = new String("");
    public String reparto       = new String("");
    public String prov_chiamata = new String("");
    public String emergenzaMedica = new String("");
    public Boolean attivaPrivacy;
    public String fileQuery = new String("");    
    
    private String body;
    private classIFrameHtmlObject iframe_body           = null;
    private classDivHtmlObject div_body                 = null;
    private classDivHtmlObject div_spinner              = null;
    private classDivHtmlObject div_wrap_menu_laterale   = null;
    private classULHtmlObject ul_menu_laterale          = null;
    private classLIHtmlObject li_menu_laterale          = null;
    private classDivHtmlObject div_ricerca_pz           = null;
    private classDivHtmlObject div_info_top             = null;
    private classDivHtmlObject div_chiudi               = null;
    private classDivHtmlObject div_btn_consenso         = null;
    private Map<String, Object> map_configurazione_privacy = null;
    private Map<String, Object> map_configurazione_privacy_ipatient = null;
	private String tipologiaAccesso;
	private String eventoCorrente;

    public iPatient(ServletContext pCont, HttpServletRequest pReq) throws Exception {
        super(pCont, pReq);
        this.bReparti = super.bReparti;//Global.getReparti(pReq.getSession());
        setBaseGlobal(true);
        setBaseReparti(true);
        setBaseUser(true);
        setBasePc(true);
    }

	@Override
	public String getBody() {
    	readDati();

        try {
            checkPrivacy();
        	body = getMenuLaterale();
            body += getInfoTop();
            body += getRicercaPazienti();
            body += getBodySection();
        }catch (Exception e) {
        	log.error(e);
        } catch (Throwable e) {
        	log.error(e);
        }

        try {
            super.setDocType(Doctype.XHtml10Transitional.class);
        } catch (InstantiationException e) {
        	log.error(e);
        } catch (IllegalAccessException e) {
        	log.error(e);
        }

        return body;
    }

	
	
	private void checkPrivacy() throws Exception {
		try {
			this.map_configurazione_privacy = new Marshall(bReparti.getValue(reparto, "ATTIVA_PRIVACY")).execute();
		} catch (IOException e) {
        	log.error(e);
		}
        this.map_configurazione_privacy_ipatient = (Map<String, Object>) this.map_configurazione_privacy.get("IPATIENT");		
	}

	private String getInfoTop() throws Exception{
		
		div_info_top	= new classDivHtmlObject();
		div_ricerca_pz	= new classDivHtmlObject();
		div_chiudi		= new classDivHtmlObject();
		div_btn_consenso= new classDivHtmlObject();
        
		div_info_top.addAttribute("id", "divInfoTOP");
		div_info_top.addAttribute("class", "divSezione");
		
		div_info_top.appendSome("<p>INFO DA MODIFICARE DINAMICAMENTE</p>");
					
		div_ricerca_pz.addAttribute("id", "divRicercaPZ");
		div_ricerca_pz.addAttribute("class", "divBtnTop");

		div_btn_consenso.addAttribute("id", "divBtnConsenso");  
        
		div_chiudi.addAttribute("id", "divBtnChiudi");
		div_chiudi.addAttribute("class", "divBtnTop");
		div_chiudi.addAttribute("onclick", "NS_PAGINA.Events.close();");
		
		div_info_top.appendSome(div_chiudi);
		div_info_top.appendSome(div_btn_consenso);
        div_info_top.appendSome(div_ricerca_pz);		
		
		return div_info_top.toString();
	}
	
    private String getRicercaPazienti() throws Exception {
        classIFrameHtmlObject iRicercaPz = new classIFrameHtmlObject();
		iRicercaPz.addAttribute("id", "iRicercaPz");
		iRicercaPz.addAttribute("src", "");
		
		return iRicercaPz.toString();
	}
	
    // Struttura Menu Laterale
    private String getMenuLaterale() throws Throwable {
        div_wrap_menu_laterale = new classDivHtmlObject();
        div_wrap_menu_laterale.addAttribute("id", "divMenuSX");
        div_wrap_menu_laterale.addAttribute("class", "divSezione");

        ul_menu_laterale = new classULHtmlObject();
        ul_menu_laterale.addAttribute("id", "UlMenuLaterale");
        this.emergenzaMedica = param("SET_EMERGENZA_MEDICA").trim();
        if ("S".equalsIgnoreCase((String)this.map_configurazione_privacy_ipatient.get("ATTIVA"))){
        	this.attivaPrivacy = true;
        	this.fileQuery = (String) this.map_configurazione_privacy_ipatient.get("fileQuerySI");
        }else{
        	this.attivaPrivacy = false;
        	this.fileQuery = (String) this.map_configurazione_privacy_ipatient.get("fileQueryNO");
        }
        
        this.tipologiaAccesso = param("TIPOLOGIA_ACCESSO").trim();
        this.eventoCorrente = param("EVENTO_CORRENTE").trim();
        
        IPatientDataResponse resp = GetIPatientData.execute(this.getStatementFromFile(), session, id_paziente, prov_chiamata, emergenzaMedica,this.attivaPrivacy, this.fileQuery, this.tipologiaAccesso, this.eventoCorrente);

        Iterator<String> it = resp.getData().keySet().iterator();

        while (it.hasNext()) {
            String key = it.next();
            IPatientData data = resp.getData().get(key);
            ul_menu_laterale.appendSome(getButtonMenuLaterale(data.getLabel(), data.get("livello").toString(), "0", data.getFunzione(), data.getTipoUte(), data.getCoinvolgimentoCura()));
        }

        div_wrap_menu_laterale.appendSome(ul_menu_laterale);

        return div_wrap_menu_laterale.toString();
    }

    // Button Menu Laterale SX
    private String getButtonMenuLaterale(String label, String livello, String active, String function, String tipo_ute, String coinvolgimentocura) {
        li_menu_laterale = new classLIHtmlObject(true);

        // Heandler JS e CSS settato dinamicamente
        li_menu_laterale.addAttribute("livello", livello);
        li_menu_laterale.addAttribute("funzione", function);
        li_menu_laterale.addAttribute("tipo_ute", tipo_ute);
        li_menu_laterale.addAttribute("coinvolgimento_cura", coinvolgimentocura);
        li_menu_laterale.appendSome("<div class='divWrapButton'><div class='divLblButton'>" + label + "</div></div>");

        return li_menu_laterale.toString();
    }

    private String getBodySection() throws Exception {
        iframe_body = new classIFrameHtmlObject("", "iBody", 0, 0);
        div_body = new classDivHtmlObject();

        div_spinner = new classDivHtmlObject();
        div_spinner.addAttribute("id", "divSpinner");
        div_spinner.appendSome("<img id='imgSpinner' src='imagexPix/loading.gif' />");

        div_body.addAttribute("id", "divBody");
        div_body.addAttribute("class", "divSezione");

        return iframe_body.toString() + div_spinner.toString() + div_body.toString();
    }

    private void readDati() {
        this.id_paziente = param("id_paziente").trim();
        this.reparto = param("REPARTO").trim();
        this.prov_chiamata = param("PROV_CHIAMATA").trim();
    }

    @Override
    protected String getTitle() {
        // TODO Auto-generated method stub
        return "";
    }

    @Override
    protected String getBottomScript() {
        // TODO Auto-generated method stub
        return "";
    }
}
