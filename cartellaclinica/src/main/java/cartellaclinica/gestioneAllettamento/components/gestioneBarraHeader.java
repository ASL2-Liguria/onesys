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
package cartellaclinica.gestioneAllettamento.components;

import java.sql.ResultSet;
import java.util.ArrayList;

import imago.http.baseClass.baseUser;
import generic.statements.StatementFromFile;

import generatoreEngine.components.html.htmlDiv;
import generatoreEngine.components.html.htmlOption;
import generatoreEngine.components.html.htmlSelect;
import generatoreEngine.components.html.htmlSpan;
import generatoreEngine.components.html.htmlTd;
import generatoreEngine.components.html.htmlTr;
import generatoreEngine.components.html.ibase.iHtmlTagBase;

public class gestioneBarraHeader {

	private StatementFromFile sff = null;
	private String idenStanza= null;
	private ArrayList<String> listaCodCdcReparti = null;
	private ArrayList<String> listaIdenGruppi = null;
	private ArrayList<String> listaDescrGruppi = null;
	private String gruppoIniziale = "";


	public gestioneBarraHeader(StatementFromFile pSff, ArrayList<String> repartiUtenteIden){
		this.sff = pSff;
		this.listaCodCdcReparti = repartiUtenteIden;
	}

	public gestioneBarraHeader(StatementFromFile pSff, String idenStanza) {
		this.sff = pSff;
		this.idenStanza = idenStanza;
	}

	public iHtmlTagBase generaBarraStanze() {
		htmlDiv divBarra = new htmlDiv();
		divBarra.addAttribute("id", "divBarraReparti");
		divBarra.addAttribute("class", "divBarraReparti");
		creaListaGruppiReparti();

		/*for (int i = 0; i <this.listaIdenGruppi.size();i++) {
			//htmlSpan spanBarra = new htmlSpan();
			htmlDiv divButtonBarra = new htmlDiv(); 
			if (this.listaIdenGruppi.get(i).equalsIgnoreCase(this.getGruppoIniziale()))
				divButtonBarra.addAttribute("class", "buttonBarraSelected");
			else			
				divButtonBarra.addAttribute("class", "buttonBarra");


			divButtonBarra.appendTagValue(this.listaDescrGruppi.get(i));
			divButtonBarra.addAttribute("iden_gruppo",this.listaIdenGruppi.get(i));
			divBarra.appendChild(divButtonBarra);
		}*/
		htmlDiv divTitleBarra = new htmlDiv();
		divTitleBarra.addAttribute("id", "divTitleBarra");
		divTitleBarra.addAttribute("class", "divTitleBarra");
		
		htmlSelect selBarraReparto = new htmlSelect();
		selBarraReparto.addAttribute("id", "selBarraReparto");
		htmlOption opt = null;
		for (int i = 0; i <this.listaIdenGruppi.size();i++) {
			opt = new htmlOption(this.listaDescrGruppi.get(i),this.listaIdenGruppi.get(i));
			if (this.listaIdenGruppi.get(i).equalsIgnoreCase(this.getGruppoIniziale()))
				opt.setSelected(true);
			else			
				opt.setSelected(false);
			selBarraReparto.appendOption(opt);
		}
		
		divBarra.appendChild(divTitleBarra);
		divBarra.appendChild(selBarraReparto);
		return divBarra;
	}
	
	public iHtmlTagBase generaBarraLetti() {
		htmlDiv divBarra = new htmlDiv();
		divBarra.addAttribute("id", "divBarraReparti");
		divBarra.addAttribute("class", "divBarraReparti");

		htmlDiv divBarraReparto = new htmlDiv();	
		divBarraReparto.addAttribute("id", "barraIntestazione");
		divBarraReparto.addAttribute("class", "barraIntestazione");
		divBarraReparto.appendTagValue(retrieveInfoGruppiReparti());
		divBarra.appendChild(divBarraReparto);


		htmlDiv divBarraButtonBack = new htmlDiv();
		divBarraButtonBack.addAttribute("id", "buttonBarraBack");
		divBarraButtonBack.addAttribute("class", "buttonBarraBack");
		divBarraButtonBack.appendTagValue("Torna Indietro");
		divBarra.appendChild(divBarraButtonBack);		
		return divBarra;
	}

	private void creaListaGruppiReparti(){
		ResultSet rs = null;
		this.listaDescrGruppi 	= new ArrayList<String>();
		this.listaIdenGruppi	= new ArrayList<String>();
		for (String codCdcReparto : this.listaCodCdcReparti) {
			try {
				rs = this.sff.executeQuery("CCE_gestioneAllettamento.xml", "allettamento.retrieveGruppiCdcUtente",
						new String[]{	codCdcReparto
				});
				while (rs.next()){
					if (!listaDescrGruppi.contains(rs.getString("descrizione"))){
						listaDescrGruppi.add(rs.getString("descrizione"));
						listaIdenGruppi.add(rs.getString("iden"));
					}
				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

	}	

	private String retrieveInfoGruppiReparti(){
		ResultSet rs = null;
		String ret = "";
		try {
			rs = this.sff.executeQuery("CCE_gestioneAllettamento.xml", "allettamento.retrieveDettaglioStanza",
					new String[]{	this.idenStanza
			});
			if (rs.next()){
				ret = rs.getString("descrizione_stanza");
				ret += " "+ rs.getString("descrizione_gruppo");
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ret;
	}

	public String getGruppoIniziale() {
		return gruppoIniziale;
	}

	public void setGruppoIniziale(String repartoIniziale) {
		this.gruppoIniziale = repartoIniziale;
	}

}
