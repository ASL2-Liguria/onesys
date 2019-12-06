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
package it.elco.whale.GestioneDatiSanitari;

import generic.servletEngine;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import org.jdom.Document;
import org.jdom.Element;
import core.Global;
import matteos.utils.XmlUtils;
import generatoreEngine.components.html.htmlA;
import generatoreEngine.components.html.htmlDiv;
import generatoreEngine.components.html.htmlInput;
import generatoreEngine.components.html.htmlLi;
import generatoreEngine.components.html.htmlSpan;
import generatoreEngine.components.html.htmlUl;

public abstract class AssociazioneDatiAbstract extends servletEngine{
	ServletContext context;
	HttpServletRequest request;

	public AssociazioneDatiAbstract(ServletContext pCont,HttpServletRequest pReq){
		super(pCont,pReq);
		this.context= pCont;
		this.request = pReq;
	}
	protected abstract String getStatementName();

	protected abstract String getIdenRiferimento();

	protected abstract String getNomeGruppoFunzionale();

	protected abstract htmlDiv getTestata();
	htmlSpan SpanGenerale = new htmlSpan();
	@Override
	public String getBody() {
		if (getTestata()!=null){
			SpanGenerale.appendChild(getTestata());
		}
		SpanGenerale.appendChild(getElencofiltri());
		SpanGenerale.appendChild(getBodyHtml());

		return SpanGenerale.generateTagHtml();
	}


	public htmlDiv getElencofiltri(){


		htmlDiv divDati = new htmlDiv();
		divDati.addAttribute("class", "divElencoDati");

		try {
			Document doc = XmlUtils.parseJDomDocumentFromFile(Global.context.getRealPath(".") + "/WEB-INF/statements/AssociazioneDatiAccesso.xml");
			@SuppressWarnings("rawtypes")
			List lista = XmlUtils.getNodesByXpath(doc, "/root/statements_list/"+getNomeGruppoFunzionale()+"/statement");
			Iterator<?> it = lista.iterator();

			while( it.hasNext()){

				Element element = (Element)it.next();
				divDati.appendChild(creainputIndice(element.getAttribute("label").getValue(),element.getAttribute("tabella-riferimento").getValue(),element.getAttribute("name").getValue(), element.getAttribute("funzione-riferimento").getValue(),getNomeGruppoFunzionale()));

			}
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}


		return divDati;
	}
	public htmlUl getBodyHtml(){
		htmlUl UlGenerale = new htmlUl();
		if (request.getParameter("funzione_collegata")!=null){
			UlGenerale.addAttribute("data-funzione",(request.getParameter("funzione_collegata").substring(request.getParameter("funzione_collegata").length()-9,request.getParameter("funzione_collegata").length())));
		}


		try {


			ResultSet resAcessi = this.getStatementFromFile().executeQuery("AssociazioneDatiAccesso.xml", getStatementName(), new String[]{getIdenRiferimento()});
			ResultSet resDettagli = null;

			HashMap<String, htmlUl> listaAccessi = new HashMap<String, htmlUl>();
			UlGenerale.addAttribute("class","ulgenerico");
			while (resAcessi.next()){
				htmlLi liPerOgniAccesso = new htmlLi();
				htmlSpan SpanDiAccesso = new htmlSpan();
				liPerOgniAccesso.addAttribute("data-iden_evento", resAcessi.getString("iden"));
				liPerOgniAccesso.addAttribute("class", "LiconSpaneUl");
				SpanDiAccesso.setTagValue(resAcessi.getString("data_ricovero")+ " "+ resAcessi.getString("cod_cdc") +" " + resAcessi.getString("descr"));
				SpanDiAccesso.addAttribute("class", "spanAccesso");
				liPerOgniAccesso.appendChild(SpanDiAccesso);
				UlGenerale.appendChild(liPerOgniAccesso);
				htmlUl UlContenitoreDatiAccesso = new htmlUl();
				UlContenitoreDatiAccesso.addAttribute("class", "ulConLiDati");
				liPerOgniAccesso.appendChild(UlContenitoreDatiAccesso);
				listaAccessi.put(resAcessi.getString("iden"), UlContenitoreDatiAccesso);
			}

			if (request.getParameter("statementname")!=null){
				String statement = request.getParameter("statementname");
				String a  = statement.substring(statement.length()-8,statement.length());
				if (a.equals("Ricovero")){
					resDettagli= this.getStatementFromFile().executeQuery("AssociazioneDatiAccesso.xml", statement, new String[]{getIdenRiferimento()});
				}else{
					resDettagli= this.getStatementFromFile().executeQuery("AssociazioneDatiAccesso.xml", statement, new String[]{getIdenRiferimento(), getIdenRiferimento()});
				}

			}

			if(resDettagli!=null){

				while (resDettagli.next()){

					htmlLi lidatoAccesso = new htmlLi();
					htmlA ref = new htmlA();
					ref.addAttribute("class", "ref");
					htmlSpan span = new htmlSpan();
					span.addAttribute("class","spanconimmagine");
					String medico;
					if(resDettagli.getString("medico")==null){
						medico = "";
					}else{
						medico=resDettagli.getString("medico");
					}
					ref.setTagValue(medico +" \n"+ resDettagli.getString("data"));
					htmlDiv primodivinutile = new htmlDiv();
					primodivinutile.addAttribute("class","divcontenuto");
					primodivinutile.appendChild(ref);
					primodivinutile.appendChild(span);

					lidatoAccesso.appendChild(primodivinutile);
					lidatoAccesso.addAttribute("data-funzione", request.getParameter("funzione_collegata"));
					lidatoAccesso.addAttribute("data-iden", resDettagli.getString("iden"));
					lidatoAccesso.addAttribute("class","sortable");
					if (listaAccessi.get(resDettagli.getString("iden_visita"))!= null){
						listaAccessi.get(resDettagli.getString("iden_visita")).appendChild(lidatoAccesso);
					}
				}
			}



		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error(e);

		}

		return UlGenerale;
	}

	private htmlInput creainputIndice(String value, String nometabella, String nomestatement, String funzionecollegata, String gruppofunzionale){
		htmlInput inputdati = new htmlInput();
		inputdati.setType("submit");
		inputdati.setValue(value);
		inputdati.setId(nometabella);
		inputdati.addAttribute("data-gruppo-funzionale", gruppofunzionale);
		inputdati.addAttribute("data-statement", nomestatement);
		inputdati.addAttribute("data-funzionecollegata", funzionecollegata);
		inputdati.addAttribute("class","bottonifiltro");
		return inputdati;
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
