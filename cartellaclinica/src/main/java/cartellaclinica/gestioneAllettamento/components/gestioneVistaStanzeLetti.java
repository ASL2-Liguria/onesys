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
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

import org.apache.ecs.xhtml.div;

import generatoreEngine.components.html.htmlInput;
import generatoreEngine.components.html.htmlSpan;
import generatoreEngine.components.html.htmlTd;
import generatoreEngine.components.html.htmlTr;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import generatoreEngine.components.html.htmlDiv;
import generic.statements.StatementFromFile;

public class gestioneVistaStanzeLetti {
	private StatementFromFile sff = null;
	private String idenGruppo = null;
	private String idenStanza = null;
	
	
	public gestioneVistaStanzeLetti(StatementFromFile pSff,String idenGruppo, String idenStanza) {
		this.sff = pSff;
		this.idenGruppo = idenGruppo;
		this.idenStanza = idenStanza;
	}

	public ArrayList<htmlDiv> generaVistaStanzeLetti(){

		//query per ritornarmi il numero di stanze associate a quel id gruppo
		//allettamento.retrieveElencoStanze
		ResultSet rs = null;
		ArrayList<htmlDiv> hashStanze = new ArrayList<htmlDiv>(); 
		String pStatement 	= "";
		String[] pParamQuery= null;		
		if (idenStanza.equalsIgnoreCase("")){
			pStatement = "allettamento.retrieveElencoStanze";
			pParamQuery= new String[]{this.idenGruppo};
		}else{
			pStatement = "allettamento.retrieveElencoLetti";
			pParamQuery= new String[]{this.idenGruppo,this.idenStanza};
		}
		
		try {
			rs = this.sff.executeQuery("CCE_gestioneAllettamento.xml", pStatement,pParamQuery);
			while (rs.next()){
				//crea i vari div
				if (idenStanza.equalsIgnoreCase("")){
					hashStanze.add(creaDivStanza(rs.getString("iden_stanza"),rs.getString("iden_gruppo"),chkNull(rs.getString("descrizione")),chkNull(rs.getString("tipo_stanza")),chkNull(rs.getString("occupazione")),chkNull(rs.getString("n_letti_liberi")),chkNull(rs.getString("n_letti_occupati"))));
				}else{
					hashStanze.add(creaDivLetti(rs.getString("iden_letto"),chkNull(rs.getString("descrizione")),chkNull(rs.getString("occupazione")),chkNull(rs.getString("num_nosologico")),chkNull(rs.getString("descrizione_paziente")),chkNull(rs.getString("descrizione_cdc_allettamento")),chkNull(rs.getString("sesso")),chkNull(rs.getString("tipologiaLetto"))));
				}
					
			}	
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				rs.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return hashStanze;

	}

	private htmlDiv creaDivStanza(	String iden_stanza, String iden_gruppo,String descrizione_stanza,String tipo_stanza,String occupazione,String nLettiLiberi,String nLettiOccupati){
		
		htmlDiv divStanza = new htmlDiv();

		divStanza.addAttribute("id", iden_stanza);
		divStanza.addAttribute("iden_gruppo", iden_gruppo);
		divStanza.addAttribute("class", "stanza");
		divStanza.addAttribute("disponibilita", occupazione);
		divStanza.addAttribute("titolo", descrizione_stanza);
		divStanza.addAttribute("tipologiaStanza", tipo_stanza);		
		//titolo
		htmlDiv headerStanza = new htmlDiv();
		headerStanza.appendTagValue(descrizione_stanza);
		headerStanza.addAttribute("id", "titoloStanza");
		headerStanza.addAttribute("class","titoloStanza_"+occupazione);
		//contenuto(riepilogo info letto + button riepilogo pazienti)
		htmlDiv contentStanza = new htmlDiv();
		contentStanza.addAttribute("class","contenutoStanza_"+occupazione);
		
		htmlDiv infoDegentiLetti = new htmlDiv();
		creaButtonInfoDegenti(infoDegentiLetti,tipo_stanza);
		contentStanza.appendChild(infoDegentiLetti); // float:right, width: 100%; margin-right:-33%;

		htmlDiv infoLettiLiberi = new htmlDiv();
		infoLettiLiberi.addAttribute("class", "infoLettiLiberi");
		htmlSpan imgInfoLiberi  = new htmlSpan();
		imgInfoLiberi.addAttribute("id", "lettoLibero");
		imgInfoLiberi.addAttribute("class", "lettoLibero");
		htmlSpan spanInfoLiberi =  new htmlSpan();
		spanInfoLiberi.addAttribute("id", "nLettoLiberi");
		spanInfoLiberi.addAttribute("class", "nLettoLiberi");
		spanInfoLiberi.appendTagValue(nLettiLiberi);
		
		infoLettiLiberi.appendChild(imgInfoLiberi);
		infoLettiLiberi.appendChild(spanInfoLiberi);		

		contentStanza.appendChild(infoLettiLiberi);  // float:left, width: 32.9%
		
		htmlDiv infoLettiOccupati = new htmlDiv();
		infoLettiOccupati.addAttribute("class", "infoLettiOccupati");
		htmlSpan imgInfoOccupati  = new htmlSpan();
		imgInfoOccupati.addAttribute("id", "lettoOccupato");
		imgInfoOccupati.addAttribute("class", "lettoOccupato");
		htmlSpan spanInfoOccupati =  new htmlSpan();
		spanInfoLiberi.addAttribute("id", "nLettoOccupati");		
		spanInfoLiberi.addAttribute("class", "nLettoOccupati");
		spanInfoOccupati.appendTagValue(nLettiOccupati);
	
		infoLettiOccupati.appendChild(imgInfoOccupati);
		infoLettiOccupati.appendChild(spanInfoOccupati);
		
		contentStanza.appendChild(infoLettiOccupati);// float:left,clear:left  width: 32.9%	
		
		htmlDiv footerStanza = new htmlDiv();			
		footerStanza.addAttribute("class","footerStanza_"+occupazione);
		
		divStanza.appendChild(headerStanza);
		divStanza.appendChild(contentStanza);
		divStanza.appendChild(footerStanza);
		
		return divStanza;
	}

	private iHtmlTagBase creaButtonInfoDegenti(htmlDiv divButtonInfo,String tipoStanza) {
		divButtonInfo.addAttribute("class", "buttonInfoStanza");
		htmlSpan buttonSpanInfo =  new htmlSpan();
		
		if (tipoStanza.equalsIgnoreCase("MISTA")) {
			buttonSpanInfo.addAttribute("id", "imgListaDegenti_"+tipoStanza);
		}
		else if(tipoStanza.equalsIgnoreCase("DONNE")){
			buttonSpanInfo.addAttribute("id", "imgListaDegenti_"+tipoStanza);
		}
		else{
			buttonSpanInfo.addAttribute("id", "imgListaDegenti_"+tipoStanza);
		}
		
		divButtonInfo.appendChild(buttonSpanInfo);
		return divButtonInfo;
	}

	private htmlDiv creaDivLetti(String iden_letto, String descrizione, String occupazione,String num_nosologico, String descrizione_paziente, String descrizione_cdc_allettamento,String sesso,String tipologiaLetto) {
		htmlDiv divLetto = new htmlDiv();

		divLetto.addAttribute("id", iden_letto);
		divLetto.addAttribute("iden_letto", iden_letto);
		divLetto.addAttribute("class", "letto");
		divLetto.addAttribute("disponibilita", occupazione);
		divLetto.addAttribute("tipologiaLetto",tipologiaLetto);
		divLetto.addAttribute("descrizioneLetto",descrizione + " " + descrizione_cdc_allettamento);
		
		//titolo
		htmlDiv headerLetto = new htmlDiv();
		headerLetto.addAttribute("class","titoloLetto_"+occupazione);
		htmlSpan headerTitleLettoCdc  = new htmlSpan();
		headerTitleLettoCdc.addAttribute("class", "headerTitleLettoCdc");
		if (occupazione.equalsIgnoreCase("occupato"))
		{
			headerTitleLettoCdc.appendTagValue(descrizione+ " "+descrizione_cdc_allettamento);
		}else{
			headerTitleLettoCdc.appendTagValue(descrizione);
		}
		htmlSpan headerTitleLettoPaz  = new htmlSpan();
		headerTitleLettoPaz.appendTagValue(descrizione_paziente);
		headerTitleLettoPaz.addAttribute("class", "headerTitleLettoPaz");
		htmlSpan headerTitleLettoNos  = new htmlSpan();
		headerTitleLettoNos.appendTagValue(num_nosologico);
		headerTitleLettoNos.addAttribute("class", "headerTitleLettoNos");
		headerLetto.appendChild(headerTitleLettoCdc);
		headerLetto.appendChild(headerTitleLettoPaz);
		headerLetto.appendChild(headerTitleLettoNos);
		
		//contenuto(riepilogo info letto + button riepilogo pazienti)
		htmlDiv contentLetto = new htmlDiv();
		if (sesso.equalsIgnoreCase(""))
			contentLetto.addAttribute("class","contenutoLetto_"+occupazione);
		else if (!sesso.equalsIgnoreCase("") &&  sesso.equalsIgnoreCase("M"))
			contentLetto.addAttribute("class","contenutoLetto_"+occupazione+"Uomo");
		else	
			contentLetto.addAttribute("class","contenutoLetto_"+occupazione+"Donna");
		
		
		htmlSpan imgLettoLibero  = new htmlSpan();
		imgLettoLibero.addAttribute("id", "letto"+occupazione);
		contentLetto.appendChild(imgLettoLibero);
		
		if (occupazione.equalsIgnoreCase("occupato")){
			htmlSpan spanRimuoviAllettato =  new htmlSpan();
			spanRimuoviAllettato.addAttribute("class", "rimuoviAllettato");
			contentLetto.appendChild(spanRimuoviAllettato);		
		}
		
		htmlDiv footerLetto = new htmlDiv();			
		footerLetto.addAttribute("class","footerLetto_"+occupazione);
		
		divLetto.appendChild(headerLetto);
		divLetto.appendChild(contentLetto);
		divLetto.appendChild(footerLetto);
		
		return divLetto;

	}

    private String chkNull(String in){return (in==null?"":in);}

		


	
}
