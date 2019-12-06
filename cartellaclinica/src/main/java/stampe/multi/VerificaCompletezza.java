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
/**
 * Genera una pagina HTML per visualizzare una check-list di stampa dei moduli di cartella.
 *
 * @author  gianlucab
 * @version 1.0
 * @since   2015-06-17
 */

package stampe.multi;

import generic.servletEngine;
import generic.statements.Exception.NoDataFoundException;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringEscapeUtils;

public class VerificaCompletezza extends servletEngine {
	private List<Modulo> moduli;
	private String[] vResp;
	
	/* Costruttore */
	public VerificaCompletezza(ServletContext cont, HttpServletRequest req) throws NoDataFoundException, SQLException, Exception {
		super(cont, req);
		
		final int argc = 7; // N. parametri utilizzati dallo statement
		try{
			this.vResp = this.getStatementFromFile().executeStatement("stampe.xml", "StampaGlobale.Esegui", new String[]{
				new String(cParam.getParam("IDEN_RICOVERO")).trim(),
				new String(cParam.getParam("FUNZIONE")).trim(),
				new String(cParam.getParam("SITO")).trim(),
				"", // struttura
				new String(cParam.getParam("REPARTO")).trim(),
				"FUNZIONE",
				"PARAMETER",
				"PDF_FIRMATO",
				new String(cParam.getParam("TIPO_RICOVERO")).trim()
			}, argc);
			
			if (vResp.length > argc+1) {
				String[] funzioni = vResp[2].split(";", -1);
				String[] formule = vResp[3].split(";", -1);
				String[] percorsi = vResp[4].split(";", -1);
				String[] firmati = vResp[5].split(";", -1);
				String[] controlli = vResp[6].split(";", -1);
				String[] descrizioni = vResp[7].split(";", -1);
				String[] moduli = vResp[8].split(";", -1);
				
				Integer[] elements = new Integer[]{
				    funzioni.length,
				    formule.length,
				    percorsi.length,
				    firmati.length,
				    controlli.length,
				    descrizioni.length,
				    moduli.length
				};
				
				Set<Integer> distinct = new HashSet<Integer>(Arrays.asList(elements));
				if( distinct.size() != 1 && !distinct.contains(argc)) {
					throw new NullPointerException("Gli array di configurazione hanno lunghezze differenti");
				}
				
				this.moduli = new ArrayList<Modulo>();
				for (int i=0, length=funzioni.length; i<length; i++) {
					if (!descrizioni[i].equals("")) {
						this.moduli.add(
						    new Modulo(funzioni[i], formule[i], percorsi[i], firmati[i], controlli[i], descrizioni[i], moduli[i])
						);
					}
				}
			}
		} catch (Exception e) {
			this.vResp = new String[]{"KO", e.getMessage()};
		}
	}
	
	@Override
	protected String getBody() {
		StringBuilder body = new StringBuilder("<form accept-charset='UNKNOWN' method='POST' name='dati' action='' enctype='application/x-www-form-urlencoded'>\n");
		
		// Titolo
		body.append("<TABLE class=classTabHeader cellSpacing=0 cellPadding=0><TBODY>\n<TR>\n"+
		"<TD class=classTabHeaderSx></TD>\n"+
		"<TD class=classTabHeaderMiddle><LABEL id=\"lblTitle\" name=\"lblTitle\">Verifica completezza e conformit&agrave;</LABEL></TD>\n"+
		"<TD class=classTabHeaderDx></TD></TR></TBODY></TABLE>\n");
		
		// Modulistica
		body.append("<fieldset id=\"lblDivModulistica\"><legend><label id=\"lblModulistica\" name=\"lblModulistica\">MODULISTICA</label></legend>\n");
		body.append("<div id='divModulistica'>\n");
		try {
			body.append("<ul>");
			for (Modulo m: moduli) {
				if (m.getControllo().equalsIgnoreCase("S")) {
					body.append("<li><img src='imagexPix/button/icon/semaforo_verde.png' title='Documento compilato'/>&nbsp;"+StringEscapeUtils.escapeHtml4(m.getDescrizione())+"</li>");
				} else {
					if ("A".equalsIgnoreCase(m.getModulo())){
						body.append("<li><img src='imagexPix/button/icon/semaforo_rosso.png' title='Documento non compilato'/>&nbsp;"+StringEscapeUtils.escapeHtml4(m.getDescrizione())+"</li>");						
					}
				}
			}
			body.append("</ul>");
		} catch (Exception e) {}
		body.append("</div>\n");
		body.append("</fieldset>\n");
		
		
		// Richieste
		body.append("<fieldset id=\"lblDivRichieste\"><legend><label id=\"lblRichieste\" name=\"lblRichieste\">RICHIESTE</LABEL></legend>\n");
		body.append("<div id=\"divRichieste\">\n");
		body.append("</div></fieldset>\n");

		// Footer
		body.append("<TABLE id=\"lblFooter\" class=\"classTabHeader\" cellSpacing=\"0\" cellPadding=\"0\"><TBODY>\n"+
			"<TR>\n"+
			"<TD class=classTabFooterSx></TD>\n"+
			"<TD class=classTabHeaderMiddle>&nbsp;</TD>\n"+
			"<TD class=classButtonHeader>\n"+
			"<DIV class=pulsante id=\"lblDivStampaCartella\"><A href=\"javascript:void(0);\"><LABEL id=\"lblStampaCartella\" name=\"lblStampaCartella\">Stampa cartella</LABEL></A></DIV></TD>\n"+
			"<TD class=classButtonHeader>\n"+
			"<DIV class=pulsante id=\"lblDivStampaReferti\"><A href=\"javascript:void(0);\"><LABEL id=\"lblStampaReferti\" name=\"lblStampaReferti\">Stampa moduli e referti</LABEL></A></DIV></TD>\n"+
			"<TD class=classTabFooterDx></TD></TR></TBODY></TABLE>"
		);
		
		return body.append("</form>\n").toString();
	}

	@Override
	protected String getTitle() {
		return "";
	}

	@Override
	protected String getBottomScript() {
		StringBuilder script = new StringBuilder("<script type=\"text/javascript\">\nvar vResp = [");
		for (String s : vResp) {
			script.append("'"+StringEscapeUtils.escapeEcmaScript(s)+"',\n");
		}
		script.append("''];\n</script>");
		return script.toString();
	}
	
	/* Inner Class */
    private class Modulo {
        private String funzione;
        private String formula;
        private String percorso;
        private String firmato;
        private String controllo;
        private String descrizione;
        private String modulo;
        
        /* Costruttore */
        public Modulo(String funzione, String formula, String percorso, String firmato, String controllo, String descrizione, String modulo) {
        	this.funzione = funzione;
        	this.formula = formula;
        	this.percorso = percorso;
        	this.firmato = firmato;
        	this.controllo = controllo;
        	this.descrizione = descrizione;
        	this.modulo = modulo;
        }
        
        public String getFunzione() {
        	return this.funzione;
        }
        
        public String getFormula() {
        	return this.formula;
        }
        
        public String getPercorso() {
        	return this.percorso;
        }
        
        public String getFirmato() {
        	return this.firmato;
        }
        
        public String getControllo() {
        	return this.controllo;
        }
        
        public String getDescrizione() {
        	return this.descrizione;
        }
        
        public String getModulo() {
        	return this.modulo;
        }
    }
}