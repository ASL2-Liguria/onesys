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

import generatoreEngine.components.html.htmlDiv;
import generatoreEngine.components.html.htmlInput;
import generatoreEngine.components.html.htmlOption;
import generatoreEngine.components.html.htmlSelect;
import generatoreEngine.components.html.htmlSpan;
import generatoreEngine.components.html.htmlTable;
import generatoreEngine.components.html.htmlTd;
import generatoreEngine.components.html.htmlTr;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import generic.statements.StatementFromFile;

public class gestioneRicercaPazientiDaAllettare {
	private String iden_anag;
	private String cogn;
	private String nome;
	private String data;
	private String cod_fisc;
	private String idenGruppo;
	private StatementFromFile sff;
	
	public gestioneRicercaPazientiDaAllettare(){
		
	}

	public gestioneRicercaPazientiDaAllettare(StatementFromFile pSff, String idenGruppo){
		this.sff = pSff;
		this.setIdenGruppo(idenGruppo);
	}
	
	public htmlTable generaRicercaPazientiDaAllettare(String cogn,String nome,String data,String codfisc,String repdegenza){
		htmlTable tabRicerca = new htmlTable();
		
		htmlTr title = new htmlTr();
		htmlTd tdTitle = new htmlTd();
		tdTitle.addAttribute("colspan", "2");
		tdTitle.appendTagValue("Ricerca Pazienti");
		tdTitle.addAttribute("class","formTrTitle");
		title.appendChild(tdTitle);
		tabRicerca.appendChild(title);
		tabRicerca.appendChild(creaTrTitleInput("Cognome","idCognome","text",cogn));
		tabRicerca.appendChild(creaTrTitleInput("Nome","idNome","text",nome));
		tabRicerca.appendChild(creaTrTitleInput("Data di Nascita","idData","text",data));		
		tabRicerca.appendChild(creaTrTitleInput("Codice fiscale","idCodFisc","text",codfisc));		
		tabRicerca.appendChild(creaTrTitleInput("Da Allettare","idAlle","checkbox",""));		
		tabRicerca.appendChild(creaTrTitleOption("Reparto di Degenza","idRepDegenza",repdegenza));	
		tabRicerca.appendChild(creaTrButton(new String[]{"Resetta","Ricerca"}));	
		
		return tabRicerca;
	}
	
	private htmlTr creaTrTitleInput(String label, String id, String type, String value){
		htmlTr tr = new htmlTr();
		
		htmlTd title = new htmlTd();
		title.appendTagValue(label);
		title.addAttribute("class", "classTdTitle");
		
		htmlInput input = new htmlInput();
		input.addAttribute("type", type);
		input.addAttribute("id", id);
		input.addAttribute("name", id);
		input.addAttribute("class", "classTdInput");
		if (!value.equalsIgnoreCase("")){
			input.addAttribute("value",value);
		}
		htmlTd tdinput = new htmlTd();
		tdinput.appendChild(input);
		tr.appendChild(title);
		tr.appendChild(tdinput);
		return tr;
	}

	private iHtmlTagBase creaTrTitleOption(String label, String id, String repDegenza) {
		ResultSet rs = null;
		htmlTr tr = new htmlTr();
		htmlTd title = new htmlTd();
		title.appendTagValue(label);
		title.addAttribute("class", "classTdTitle");
		htmlTd tdselect = new htmlTd();
		htmlSelect sel = new htmlSelect();
		sel.addAttribute("id", id);
		htmlOption opt = null;
		ArrayList<String> codCdcRep = new ArrayList<String>();
		int count = 0;
		try{
			rs = this.sff.executeQuery("CCE_gestioneAllettamento.xml","allettamento.formRicerca.fillOptionRepartoDegenza", new String[]{this.getIdenGruppo()});
			while (rs.next()){
				opt = new htmlOption(rs.getString("descrizione_reparto"),rs.getString("cod_cdc"));
				codCdcRep.add(rs.getString("cod_cdc"));
				if (repDegenza.equalsIgnoreCase(rs.getString("cod_cdc")))
					opt.setSelected(true);
				sel.appendOption(opt);
			}
		}catch(Exception ex){
			ex.printStackTrace();
		}
		tdselect.appendChild(sel);
		tr.appendChild(title);
		tr.appendChild(tdselect);
		
		
		return tr;
	}	
	
	private htmlTr creaTrButton(String[] label){
		htmlTr tr = new htmlTr();
		htmlTd td = new htmlTd();
		td.addAttribute("colspan", "2");
		for(int i=0;i<label.length;i++){
			
			htmlDiv div = new htmlDiv();
			div.appendTagValue(label[i]);
			div.addAttribute("id", "id"+label[i]);

			td.appendChild(div);
			
		}
		tr.appendChild(td);
		return tr;
	}

	public String getIden_anag() {
		return iden_anag;
	}

	public void setIden_anag(String iden_anag) {
		this.iden_anag = iden_anag;
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
	
    private String chkNull(String in){return (in==null?"":in);}

	public String getIdenGruppo() {
		return idenGruppo;
	}

	public void setIdenGruppo(String idenGruppo) {
		this.idenGruppo = idenGruppo;
	}
}
