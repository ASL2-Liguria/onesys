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
package cartellaclinica.cartellaPaziente.Visualizzatore.openDocument;

//import imago.http.classMetaHtmlObject;

import imago.http.classHeadHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imagoAldoUtil.classStringUtil;
import imagoUtils.classJsObject;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

/**
 * @author fabioc
 */
public class CreaDocHtml {
	public Document DocHtml;
	public String Funzione = "";
	private baseGlobal basGlobali;
	private baseUser log_user = null;

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(
			CreaDocHtml.class);

	public CreaDocHtml() {

		super();

	}

	public Document creaDocumentoHtml(String pdfPosition, String n_copie,
			String reqAnteprima, String stampante) {

		DocHtml = new Document();
		DocHtml.setHead(addHead(log_user));
		DocHtml.setTitle(creaTitoloHtml());
		DocHtml.appendHead(addTopJScode(pdfPosition, n_copie, reqAnteprima,
				stampante));
		DocHtml.setBody(creaBodyHtml(pdfPosition, reqAnteprima));

		return DocHtml;
	}

	// Metodo che crea il Body, che setta l'activeX
	public Body creaBodyHtml(String pdfPosition, String reqAnteprima) {

		Body testo = new Body();
		try {
			classHeadHtmlObject ciao;
			testo.addAttribute("class", "body");

			if (Funzione.equalsIgnoreCase("REFERTO_STD")
					|| Funzione.equalsIgnoreCase("ETIPAZIENTE_STD")
					|| Funzione.equalsIgnoreCase("ETICHETTE_STD")
					|| Funzione.equalsIgnoreCase("SCHEDA_ANAG_STD")
					|| Funzione.equalsIgnoreCase("SCHEDA_ESEC_STD")
					|| Funzione.equalsIgnoreCase("TICKET_STD")
					|| Funzione.equalsIgnoreCase("")) {
				classLabelHtmlObject label_titolo = new classLabelHtmlObject(
						"", "", "titoloAnte");
				classTabHeaderFooter footer = new classTabHeaderFooter(" ");
				footer.setClasses("classTabHeader", "classTabFooterSx",
						"classTabHeaderMiddle", "classTabFooterDx");

				// classDivButton pulsanteChiudi = new classDivButton("",
				// "pulsante", "javascript:closeAnteprima();","btChiudi","");
				// header.addColumn("classButtonHeader",
				// pulsanteChiudi.toString());
				// testo.addElement(footer.toString());
				// testo.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);tutto_schermo();");

			} else {
				testo.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);");
			}
			// se il campo dove e' presente il pdf e' vuoto mi ritorna un errore
			// 'Errore campo Pdf Vuoto'
			if (pdfPosition.length() < 5) {
				testo.addElement("<SCRIPT>\n");
				if (pdfPosition.equalsIgnoreCase("noRef")) {
					testo.addElement("javascript:alert('Esame non Ancora Refertato')");
				}

				testo.addElement("pdfPosition='http://localhost:8081/SERVLETreadFromDB?iden=a'\n");
				testo.addElement("</SCRIPT>\n");
				logInterface.warn("PDF URL NON VALORIZZATA CORRETTAMENTE: "
						+ pdfPosition);
			}

			// qui se tutto e' apposto chiama il javascript che setta l'activeX
			if (reqAnteprima == null) {
				reqAnteprima = "S";
			}

			if ("N".equalsIgnoreCase(reqAnteprima)) {
				testo.addElement("<font face=tahoma size=12 color=black>Stampa in corso....</font>");
			}
			testo.addElement("<SCRIPT>\n");
			testo.addElement("initMainObject(pdfPosition);");
			testo.addElement("</SCRIPT>\n");
		} catch (Exception e) {
			logInterface.error(e.getMessage(), e);
		}
		return testo;
	}

	public String addTopJScode(String pdfPosition, String n_copie,
			String reqAnteprima, String stampante) {
		// setta le variabili nell'HTML che mi serviranno per creare l'activeX
		// infoPC = (basePC) .getSessione().getAttribute("parametri_pc");
		String OffTop = "-1";
		String OffLeft = "-1";
		String Rotate = "-1";

		String stamp = stampante;

		if (reqAnteprima == null)
			reqAnteprima = "S";
		StringBuffer sb = new StringBuffer();
		try {
			sb.append("<SCRIPT>\n");
			sb.append("var DisPulsPrint='N';\n");
			sb.append("var funzioneStampa='';\n");
			sb.append("var StampaSu='';\n");
			sb.append("var sorgente='';\n");
			sb.append("var pdfPosition='" + pdfPosition + "';\n");
			sb.append("var n_copie='" + n_copie + "';\n");
			sb.append("var requestAnteprima='" + reqAnteprima + "';\n");
			sb.append("var OffsTop='" + OffTop + "';\n");
			sb.append("var OffsLeft='" + OffLeft + "';\n");
			sb.append("var Rotation='" + Rotate + "';\n");
			stamp = classStringUtil.processReportText(stamp);
			sb.append("var selezionaStampante='" + stamp + "';\n");
			sb.append("var width=996;\n");
			sb.append("var height=684;\n");
			sb.append("</SCRIPT>\n");
		} catch (Exception e) {
			logInterface.error(e.getMessage(), e);
		}
		return sb.toString();
	}

	public classHeadHtmlObject addHead(baseUser logged_user) {
		baseUser log_user = null;
		classHeadHtmlObject testata = null;
		log_user = logged_user;
		classJsObject myJS = null;
		testata = new classHeadHtmlObject();
		myJS = new classJsObject();
		try {
			testata.addJSLink("std/jscript/tutto_schermo.js");
			testata.addJSLink("std/jscript/fillLabels.js");
			testata.addJSLink("std/jscript/src/Sel_Stampa/elabStampa.js");
			testata.addJSLink("std/jscript/engine/jquery.js");
			testata.addJSLink("std/jscript/visualizzatore/openDocument.js");
			testata.addCssLink("std/css/button.css");
		} catch (Exception ex) {
			logInterface.error(ex.getMessage(), ex);
		}
		return testata;
	}

	// crea il tiotolo dell'html
	public Title creaTitoloHtml() {
		Title titolo = null;
		try {
			titolo = new Title("Repository");

		} catch (Exception ex) {
			logInterface.error(ex.getMessage(), ex);

		}
		return titolo;
	}

}
