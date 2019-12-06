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
package cartellaclinica.gestioneAllettamento;

import generatoreEngine.components.html.htmlDiv;
import generic.servletEngine;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import cartellaclinica.gestioneAllettamento.components.gestioneBarraHeader;
import cartellaclinica.gestioneAllettamento.components.gestioneRicercaPazientiDaAllettare;
import cartellaclinica.gestioneAllettamento.components.gestioneVistaStanzeLetti;

public class SrvAllettamento extends servletEngine{
	
	private String reparto 			= "";
	private String idenStanza 		= "";
	private String visualizzazione 	= "";
	private String idenGruppo		= "";
	private String cogn		= "";
	private String nome		= "";	
	private String data		= "";
	private String cod_fisc = "";
	private String repdegenza = "";
	
	public ArrayList<String> repartiUtenteIden = null;
	public ArrayList<String> repartiUtenteDescr = null;
	
	public SrvAllettamento(ServletContext pCont,HttpServletRequest pReq) throws Exception{
        super(pCont,pReq);
        bReparti = super.bReparti;//Global.getReparti(hSessione);
        this.setBaseUser(true);
        this.setBaseReparti(true);    
    }
	
	@Override
	protected String getBody() {
		
		this.getInitialParameter();
		
		htmlDiv divContainer	= new htmlDiv();
		divContainer.addAttribute("id", "divContainer");
		divContainer.addAttribute("class", "divContainer");
		htmlDiv divHeader 		= new htmlDiv();
		divHeader.addAttribute("id", "divHeader");
		divHeader.addAttribute("class", "divHeader");
		htmlDiv divWrapper 		= new htmlDiv();
		divWrapper.addAttribute("id", "divWrapper");
		divWrapper.addAttribute("class", "divWrapper");
		htmlDiv divContent 		= new htmlDiv();
		divContent.addAttribute("id", "divContent");
		divContent.addAttribute("class", "divContent");		
		htmlDiv divNavigation	= new htmlDiv();
		divNavigation.addAttribute("id", "divNavigation");
		divNavigation.addAttribute("class", "divNavigation");		
		htmlDiv divExtra		= new htmlDiv();
		divExtra.addAttribute("id", "divExtra");
		divExtra.addAttribute("class", "divExtra");		
		htmlDiv divFooter		= new htmlDiv();
		divFooter.addAttribute("id", "divFooter");
		divFooter.addAttribute("class", "divFooter");		
		
		
		gestioneBarraHeader barra = null;
		try {
			if (this.getIdenStanza().equalsIgnoreCase(""))
			{
				barra = new gestioneBarraHeader(this.getStatementFromFile(),this.repartiUtenteIden);
				barra.setGruppoIniziale(this.getIdenGruppo());
				divHeader.appendChild(barra.generaBarraStanze());
			}
			else{
				barra = new gestioneBarraHeader(this.getStatementFromFile(),this.getIdenStanza());
				barra.setGruppoIniziale(this.getIdenGruppo());
				divHeader.appendChild(barra.generaBarraLetti());
			}
				
		} catch (Exception e) {
			e.printStackTrace();
		}

		
		divContainer.appendChild(divHeader);
		
		gestioneVistaStanzeLetti gestioneStanze = null;
		try {
			if (this.getIdenGruppo().equalsIgnoreCase(""))
			{
				divContent.appendChild(divError("idContentError","divContentError","Configurazione Mancante per il reparto selezionato"));
			}
			else
			{
				if (this.getIdenStanza().equalsIgnoreCase(""))
				{
					gestioneStanze = new gestioneVistaStanzeLetti(this.getStatementFromFile(),this.getIdenGruppo(),this.getIdenStanza());
	
					for (generatoreEngine.components.html.htmlDiv divStanze : gestioneStanze.generaVistaStanzeLetti()){
						divContent.appendChild(divStanze);
					}
	
				}
				else
				{
					gestioneStanze = new gestioneVistaStanzeLetti(this.getStatementFromFile(),this.getIdenGruppo(),this.getIdenStanza());
	
					for (generatoreEngine.components.html.htmlDiv divLetti : gestioneStanze.generaVistaStanzeLetti()){
						divContent.appendChild(divLetti);
					}
	
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		divWrapper.appendChild(divContent);
		
		divContainer.appendChild(divWrapper);
		
		gestioneRicercaPazientiDaAllettare ricercaPaz = null;
		try {
			ricercaPaz = new gestioneRicercaPazientiDaAllettare(this.getStatementFromFile(),this.getIdenGruppo());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		divNavigation.appendChild(ricercaPaz.generaRicercaPazientiDaAllettare(this.getCogn(),this.getNome(),this.getData(),this.getCod_fisc(),this.getRepdegenza()));
		
		divContainer.appendChild(divNavigation);
		
		divContainer.appendChild(divExtra);		

		if (!super.param("apriDaWk").equalsIgnoreCase("") && !super.param("apriDaWk").equalsIgnoreCase("undefined")){ 
			htmlDiv divButtonBackWkRicoverati	= new htmlDiv();
			divButtonBackWkRicoverati.addAttribute("id", "divButtonBackWkRicoverati");
			divButtonBackWkRicoverati.addAttribute("class", "divButtonBackWkRicoverati");
			divButtonBackWkRicoverati.addAttribute("wkToRecall", super.param("apriDaWk"));
			divFooter.appendChild(divButtonBackWkRicoverati);
		}		
		
		
		divContainer.appendChild(divFooter);			
		// TODO Auto-generated method stub
		return divContainer.generateTagHtml();
	}

	private htmlDiv divError(String id,String classe,String msg) {
		htmlDiv divError = new htmlDiv();
		divError.addAttribute("id", id);
		divError.addAttribute("class", classe);
		divError.appendTagValue(msg);
		// TODO Auto-generated method stub
		return divError;
	}

	@Override
	protected String getTitle() {
		// TODO Auto-generated method stub
		return "ALLETTAMENTO";
	}

	@Override
	protected String getBottomScript() {
		// TODO Auto-generated method stub
		return "";
	}
	
	/*
	 * 1) non gli viene passato il reparto in request(prendo il primo disponibile fra quelli configurati)
	 * 2) gli viene passato il reparto in request
	 * */
	private void getInitialParameter(){
		ResultSet rs = null;
		//se non gli viene passato il reparto, gli passo il primo reparto configurato nell'utente

		this.setReparto(super.param("reparto").equalsIgnoreCase("")?"":super.param("reparto"));
		
		if (super.param("iden_gruppo").toString().equalsIgnoreCase("")){
			for (String idenCodCdcReparto : this.repartiUtenteIden){ 
				try{
					rs = this.getStatementFromFile().executeQuery("CCE_gestioneAllettamento.xml", "allettamento.retrieveGruppiCdcUtente",new String[]{idenCodCdcReparto});
					while (rs.next()){//recupero il primo iden_gruppo codificato relativo al primo reparto
						this.setIdenGruppo(rs.getString("iden"));
						super.hRequest.setAttribute("iden_gruppo", this.getIdenGruppo());
						super.hashRequest.put("iden_gruppo", this.getIdenGruppo());
					}
				} catch (Exception e) {
					//e.printStackTrace();
				}
				
			}
		}
		else{
			this.setIdenGruppo(super.param("iden_gruppo"));
		}
		
		this.setIdenStanza(super.param("idenStanza").equalsIgnoreCase("")?"":super.param("idenStanza"));
		/*Parametri aggiuntivi per la servlet richiamata dalla wk ricoverati*/
		/*this.setCogn(super.param("apriDaWk").equalsIgnoreCase("")?"":super.param("apriDaWkRicoverati"));*/
		this.setCogn(super.param("cogn").equalsIgnoreCase("")?"":super.param("cogn"));
		this.setNome(super.param("nome").equalsIgnoreCase("")?"":super.param("nome"));
		this.setData(super.param("data").equalsIgnoreCase("")?"":super.param("data"));
		this.setCod_fisc(super.param("codfisc").equalsIgnoreCase("")?"":super.param("codfisc"));
		this.setRepdegenza(super.param("repdegenza").equalsIgnoreCase("")?"":super.param("repdegenza"));
	}
	
	public void retrieveReparti(){
		/*Reparti recuperati dai filtri + Reparti configurati su baseUser*/
		ResultSet rs = null;
		try{
			rs = this.getStatementFromFile().executeQuery("CCE_gestioneAllettamento.xml", "allettamento.retrieveCdcFiltriUtente",new String[]{bUtente.login});
			while (rs.next()){//recupero il primo iden_gruppo codificato relativo al primo reparto
				this.repartiUtenteIden.add(rs.getString("cod_cdc"));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		this.repartiUtenteIden.addAll(bUtente.listaReparti);
		//aggiunto tutti i baseReparti codificati
		Set<String> s = new LinkedHashSet<String>(repartiUtenteIden);
		this.repartiUtenteIden = new ArrayList<String>(s);
	}
	
    public String getReparto() {
		return reparto;
	}

	public void setReparto(String reparto) {
		this.repartiUtenteIden 	= new ArrayList<String>();
		if (reparto.equalsIgnoreCase(""))
			retrieveReparti();
		else	
			this.repartiUtenteIden.add(reparto);
//		this.reparto = reparto;
	}

	public void setReparto(ArrayList<String> reparti) {
		this.reparto = reparto;
	}
	
	public String getIdenStanza() {
		return idenStanza;
	}

	public void setIdenStanza(String idenStanza) {
		this.idenStanza = idenStanza;
	}
	
	public String getIdenGruppo() {
		return idenGruppo;
	}

	public void setIdenGruppo(String idenGruppo) {
		this.idenGruppo = idenGruppo;
	}

	public String getCogn() {
		return cogn;
	}

	public void setCogn(String cogn) {
		this.cogn = cogn;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getCod_fisc() {
		return cod_fisc;
	}

	public void setCod_fisc(String cod_fisc) {
		this.cod_fisc = cod_fisc;
	}

	public String getRepdegenza() {
		return repdegenza;
	}

	public void setRepdegenza(String repdegenza) {
		this.repdegenza = repdegenza;
	}	
}
