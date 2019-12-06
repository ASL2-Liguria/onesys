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



import java.sql.ResultSet;
import java.util.HashMap;

import generatoreEngine.components.html.htmlA;
import generatoreEngine.components.html.htmlDiv;
import generatoreEngine.components.html.htmlLi;
import generatoreEngine.components.html.htmlSpan;
import generatoreEngine.components.html.htmlUl;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class AssociazioneDatiAccesso extends AssociazioneDatiAbstract{

	public AssociazioneDatiAccesso(ServletContext pCont, HttpServletRequest pReq) {
		super(pCont, pReq);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected String getStatementName() {
		// TODO Auto-generated method stub
		return "getElencoAccessi";
	}

	@Override
	protected String getIdenRiferimento() {
		// TODO Auto-generated method stub
		return param("IdenRicovero");
	}

	@Override
	protected String getNomeGruppoFunzionale() {
		// TODO Auto-generated method stub
		return "gruppo-funzionale-accessi";
	}

	@Override
	protected htmlDiv getTestata() {
		htmlDiv div = new htmlDiv();
		htmlUl ulgenerico = new htmlUl();
		ulgenerico.addAttribute("class", "ulgenerico");
		HashMap<String, htmlUl> listaAccessi = new HashMap<String, htmlUl>();
		try {
			ResultSet resRicovero = this.getStatementFromFile().executeQuery("AssociazioneDatiAccesso.xml", "getRicovero", new String[]{param("IdenRicovero")});
			ResultSet resRicoveroDEttagli = null;
			while(resRicovero.next()){
				htmlUl ul = new htmlUl();
				htmlLi liPerOgniAccesso = new htmlLi();
				htmlSpan SpanDiAccesso = new htmlSpan();
				liPerOgniAccesso.addAttribute("data-iden_evento", resRicovero.getString("iden"));
				liPerOgniAccesso.addAttribute("class", "LiconSpaneUl");
				SpanDiAccesso.setTagValue(resRicovero.getString("data_ricovero")+ " "+ resRicovero.getString("cod_cdc") +" " + resRicovero.getString("descr"));
				SpanDiAccesso.addAttribute("class", "spanAccesso");
				liPerOgniAccesso.appendChild(SpanDiAccesso);
				ul.appendChild(liPerOgniAccesso);
				htmlUl UlContenitoreDatiAccesso = new htmlUl();
				UlContenitoreDatiAccesso.addAttribute("class", "ulConLiDati");
				liPerOgniAccesso.appendChild(UlContenitoreDatiAccesso);
				ulgenerico.appendChild(liPerOgniAccesso);
				listaAccessi.put(resRicovero.getString("iden"), UlContenitoreDatiAccesso);
			}

			if (request.getParameter("statementname")!=null){
				String statement = request.getParameter("statementname");
				resRicoveroDEttagli= this.getStatementFromFile().executeQuery("AssociazioneDatiAccesso.xml", statement, new String[]{getIdenRiferimento(), getIdenRiferimento()});
			}

			if(resRicoveroDEttagli!=null){

				while (resRicoveroDEttagli.next()){

					htmlLi lidatoAccesso = new htmlLi();
					htmlA ref = new htmlA();
					ref.addAttribute("class", "ref");
					htmlSpan span = new htmlSpan();
					span.addAttribute("class","spanconimmagine");
					String medico;
					if(resRicoveroDEttagli.getString("medico")==null){
						medico = "";
					}else{
						medico=resRicoveroDEttagli.getString("medico");
					}
					ref.setTagValue(medico +" \n"+ resRicoveroDEttagli.getString("data"));
					htmlDiv primodivinutile = new htmlDiv();
					primodivinutile.addAttribute("class","divcontenuto");
					primodivinutile.appendChild(ref);
					primodivinutile.appendChild(span);

					lidatoAccesso.appendChild(primodivinutile);
					lidatoAccesso.addAttribute("data-funzione", request.getParameter("funzione_collegata"));
					lidatoAccesso.addAttribute("data-iden", resRicoveroDEttagli.getString("iden"));
					lidatoAccesso.addAttribute("class","sortable");
					if (listaAccessi.get(resRicoveroDEttagli.getString("iden_visita"))!= null){
						listaAccessi.get(resRicoveroDEttagli.getString("iden_visita")).appendChild(lidatoAccesso);
					}

				} 

			}
		}
		catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		div.appendChild(ulgenerico);
		return div;

	}
}
