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
package configurazioneReparto.confLabo;

import generic.servletEngine;
import imago.http.classDivHtmlObject;
import imago.sql.SqlQueryException;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import cartellaclinica.dwr.dwrConfigurazioneVisualizzazione;

public class cConfiguraVisualizzazioneDatiLaboratorio extends servletEngine {

	private String repartoAttivo = null;

	private String openClose = null;

	private String[] arOpenClose = null;

	private String txtRicercaValue = "";

	public cConfiguraVisualizzazioneDatiLaboratorio(ServletContext cont, HttpServletRequest req) {
		super(cont, req);
		this.repartoAttivo = req.getParameter("reparto");
		this.openClose = req.getParameter("openClose");
		this.txtRicercaValue = req.getParameter("txtRicerca");
		//Non sembra necessario:
		setBaseObject(true, true, true, true);

		if (this.openClose != null)
			this.arOpenClose = this.openClose.split("[*]");
	}

	public String getBody() {

		String sOut = "";
		try {
			
			BODY.setOnLoad("init();");
			BODY.addAttribute("onbeforeunload", "registra();");

			sOut += "<div id=left>\n";

			sOut += getTabellaRicerca();

			if (this.txtRicercaValue == null || this.txtRicercaValue.equals(""))
				sOut += "<div id=\"lstEsamiContainer\"><table id=lstEsami class=hide></table></div>";
			else {
				String sql = "select IDEN,COD_ESA,DESCR from TAB_ESA where METODICA='L' and (DESCR like '%" + txtRicercaValue + "%' or COD_ESA like '%" + txtRicercaValue + "%') and ROWNUM<30 order by COD_ESA";
				dwrConfigurazioneVisualizzazione dCV = new dwrConfigurazioneVisualizzazione(bUtente);
				sOut += "<div id=\"lstEsamiContainer\">" + dCV.getTableEsami("lstEsami", "lstEsami", sql).split("[*]")[1] + "</div>";
			}

			sOut += "</div>\n";

			sOut += "<div id=right>\n";
			sOut += getConfigurazioni();
			sOut += "</div>\n";

			// sOut+=
			// "<div id=barraFooter><div class=pulsanteBarra><a href=# onClick=\"reloadPage();\">Registra</a></div></div>\n";

			sOut += "<form name=dati><input type=hidden name=reparto value=" + repartoAttivo + "></form>\n";

		} catch (Exception e) {
			sOut = "<body>" + e.getMessage() + "</body>";
		}
		return sOut;
	}

	private String getConfigurazioni() throws SQLException, SqlQueryException {
		int progressivoGruppi = 0;
		int progressivoEsami = 0;

		classDivHtmlObject divGruppo = null;
		classDivHtmlObject divEsami = null;

		String piuMeno = "";

		String gruppoAttivo = null;
		String resp = "";

		String sql = "Select * from RADSQL.VIEW_CC_LABO_CONFIG_VISUAL where REPARTO=?";
		PreparedStatement ps = fDB.getConnectWeb().prepareCall(sql);
		ps.setString(1, this.repartoAttivo);
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			if (gruppoAttivo == null || !gruppoAttivo.equals(rs.getString("COD_GRUPPO"))) {
				if (divGruppo != null) {
					divGruppo.appendSome(divEsami);
					resp += divGruppo.toString(); // appendo il gruppo
													// precedente se presente
				}
				gruppoAttivo = rs.getString("COD_GRUPPO");

				divGruppo = new classDivHtmlObject("gruppo");
				if (this.arOpenClose == null || this.arOpenClose[progressivoGruppi].equals("0"))
					divGruppo.addAttribute("class", "close");
				else
					divGruppo.addAttribute("class", "open");

				divGruppo.addAttribute("ordine", String.valueOf(progressivoGruppi));

				if (this.arOpenClose == null || this.arOpenClose[progressivoGruppi].equals("0"))
					piuMeno = "+";
				else
					piuMeno = "-";
				divGruppo.appendSome(getDivLegend(rs.getString("DESCR_GRUPPO"), piuMeno));
				progressivoGruppi++;

				divEsami = new classDivHtmlObject("esami");
				divEsami.addAttribute("class", "esami");
				progressivoEsami = 0;
			}
			if (rs.getString("IDEN_ESA") != null) // caso di un gruppo senza
													// esami
				divEsami.appendSome(getDivEsame(rs.getString("DESCR_ESA"), rs.getString("IDEN_ESA"), progressivoEsami));
			else
				divGruppo.appendSome("<div class=noEsami>Nessun esame associato al gruppo</div>");
			progressivoEsami++;
		}

		if (divGruppo != null) {
			divGruppo.appendSome(divEsami);
			resp += divGruppo.toString(); // appendo il gruppo precedente se
											// presente
		}

		return resp;
	}

	private String getDivLegend(String descrGruppo, String openClose) {
		String divLegend = "";

		divLegend += "<div class=legend>\n";
		divLegend += "<a href=# title=\"Apri/Chiudi\" onclick=\"ApriChiudiGruppo(this,this.parentNode.parentNode,null);\">" + openClose + "</a>\n";
		divLegend += "<a href=# title=\"Sposta su\" onclick=\"step(this,'legend',true);\">Su</a>\n";
		divLegend += "<a href=# title=\"Sposta giu'\" onclick=\"step(this,'legend',false);\">Giu'</a> \n";
		divLegend += "<a href=# title=\"Rimuovi gruppo\" onclick=\"remove(this);\">X</a>\n";
		divLegend += "<div id=legend tipo=legend ondblclick=\"setLegend(this);\">" + descrGruppo + "</div>\n";
		divLegend += "</div>\n";

		return divLegend;
	}

	private String getDivEsame(String descrEsa, String idenEsa, int progr) {
		String divEsame = "";

		divEsame += "<div ordine=" + progr + " value=" + idenEsa + ">\n";
		divEsame += "<a href=# title=\"Sposta su\" onclick=\"step(this,'esame',true);\">Su</a>\n";
		divEsame += "<a href=# title=\"Sposta giu'\" onclick=\"step(this,'esame',false);\">Giu'</a>\n";
		divEsame += "<a href=# title=\"Rimuovi esame\" onclick=\"remove(this);\">X</a>\n";
		divEsame += "<span id=esame tipo=esame value=" + idenEsa + ">" + descrEsa + "</span> \n";
		divEsame += "</div>\n";

		return divEsame;

	}

	private String getTabellaRicerca() {
		String resp = "";

		resp += "<table class=lstEsami>\n";
		resp += "<tr><th>Reparto</th><td><select onChange=\"switchReparto(this);\">";

		for (int i = 0; i < bUtente.listaReparti.size(); i++) {
			if ((repartoAttivo == null && i == 0) || (repartoAttivo != null && bUtente.listaReparti.get(i).equals(repartoAttivo))) {
				resp += "<option selected value=\"" + bUtente.listaReparti.get(i) + "\">" + bUtente.listaReparti.get(i) + "</option>";
				repartoAttivo = (String) bUtente.listaReparti.get(i);
			} else
				resp += "<option value=\"" + bUtente.listaReparti.get(i) + "\">" + bUtente.listaReparti.get(i) + "</option>";
		}

		resp += "</select></td></tr>";
		resp += "<tr><th>Nuovo gruppo</th><td><input onblur=\"creaObjGruppo(this.value);\" onkeypress=\"if(event.keyCode==13)this.blur();\"/></td></tr>";
		resp += "<tr><th>Ricerca esame</th><td><input id=\"txtRicercaEsame\" value=\"" + chkNull(this.txtRicercaValue) + "\"/></td></tr>";
		resp += "</table>";

		return resp;
	}

	@Override
	protected String getBottomScript() {
		return "";
	}

	@Override
	protected String getTitle() {
		return "";
	}
}
