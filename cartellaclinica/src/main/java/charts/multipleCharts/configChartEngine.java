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
package charts.multipleCharts;

import imago.http.classAHtmlObject;
import imago.http.classColDataTable;
import imago.http.classDivButton;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classIFrameHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLIHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTabHeaderFooter;
import imago.http.classTableHtmlObject;
import imago.http.classULHtmlObject;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import charts.multipleCharts.dati.parsedXml;
import generic.utility.html.HeaderUtils;

public class configChartEngine extends functionObj {

	private functionDB fDB = null;
	private functionStr fStr = null;

	private String idenAnag = new String("");
	private String idenVisita = new String("");
	private String ricovero = new String("");
	private String reparto = new String("");
	private String idenGrafico = new String("");

	public configChartEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
		fStr = new functionStr();
	}

	public configChartEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		cDoc.setDoctype(new Doctype.Html401Transitional());
		Body cBody = new Body();
		classTabHeaderFooter HeadSection = null;
		classTableHtmlObject cTable = null;
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		classIFrameHtmlObject cFrame = null;
		classFormHtmlObject cForm = null;

		classInputHtmlObject cInput = null;
		classDivHtmlObject cDivContainer = null;
		classDivHtmlObject cDiv = null;
		classLabelHtmlObject cLabel = null;

		ResultSet rs = null;
		ResultSet rsParametri = null;

		try {

			this.readDati();

			if (idenGrafico.equals("")) {
				insertGrafico();
			}

			String sql = "SELECT tab.CONTENUTO.getStringVal() STRXML,DESCRIZIONE ,IDEN_UTE,tab.IDEN_ANAG,tab.CODICE_REPARTO,W.N_RICOVERO||' - '||W.COGN||' '||W.NOME||' '||W.DATA_NASCITA INTESTAZIONE from CC_GRAFICI tab,VIEW_TRITTICO_RICOVERO W  where tab.iden=" + idenGrafico + " and W.iden_visita=" + idenVisita;
			rs = fDB.openRs(sql);
			if (rs.next()) {

				parsedXml pXml = new parsedXml(rs.getString("STRXML"));

				cDoc.appendHead(this.createHead());

				HeadSection = new classTabHeaderFooter("Generazione grafico parametri : " + rs.getString("INTESTAZIONE"));
				cBody.addElement(HeadSection.toString());

				cBody.addAttribute("onload", "init();");
				cBody.addAttribute("onunload", "unload();");

				sql = "select * from VIEW_CC_PARAMETRI_REPARTO where CODICE_REPARTO='" + reparto + "'";
				rsParametri = fDB.openRs(sql);

				classULHtmlObject cUL = new classULHtmlObject();
				cUL.addAttribute("id", "nav");
				cUL.addAttribute("class", "tabbernav");

				classLIHtmlObject cLI;
				classAHtmlObject cA;

				for (int i = 0; i < pXml.getPeriodi().size(); i++) {
					cLI = new classLIHtmlObject(false);
					cLI.addAttribute("class", "");
					cLI.addAttribute("style", "cursor:hand;");
					cLI.addAttribute("ordine", pXml.getPeriodi().get(i).ordine);
					cLI.addAttribute("data_ini", pXml.getPeriodi().get(i).dataIni);
					cLI.addAttribute("data_fine", pXml.getPeriodi().get(i).dataFine);
					cLI.addAttribute("n_giorni", pXml.getPeriodi().get(i).n_giorni);
					cLI.addAttribute("episodio", pXml.getPeriodi().get(i).episodio);
					cLI.addAttribute("ricovero", pXml.getPeriodi().get(i).ricovero);
					cLI.addAttribute("storico", pXml.getPeriodi().get(i).storico);

					cLI.addEvent("onClick", "javascript:selectTabber(this);");
					cLI.addEvent("onDblClick", "javascript:editPeriodo(this);");

					cA = new classAHtmlObject();
					if (!pXml.getPeriodi().get(i).dataIni.equals("")) {
						cA.appendSome(convDate(pXml.getPeriodi().get(i).dataIni) + " - " + convDate(pXml.getPeriodi().get(i).dataFine) + "&nbsp;");
					} else if (!pXml.getPeriodi().get(i).n_giorni.equals("")) {
						cA.appendSome("Ultimi " + pXml.getPeriodi().get(i).n_giorni + " giorni&nbsp;");
					} else if (pXml.getPeriodi().get(i).ricovero.equals("true")) {
						cA.appendSome("Ricovero " + this.ricovero + "&nbsp;");
					} else if (pXml.getPeriodi().get(i).episodio.equals("true")) {
						cA.appendSome("Episodio " + this.ricovero + " " + this.reparto + "&nbsp;");
					} else if (pXml.getPeriodi().get(i).storico.equals("true")) {
						cA.appendSome("Storico paziente&nbsp;");
					}

					if (pXml.getPeriodi().size() > 1) {
						cLabel = new classLabelHtmlObject("&nbsp;x&nbsp;");
						cLabel.addEvent("onClick", "javascript:removePeriodo('" + pXml.getPeriodi().get(i).ordine + "');");
						cA.appendSome(cLabel);
					}

					cLI.appendSome(cA);

					cUL.appendSome(cLI);
				}
				cLI = new classLIHtmlObject(false);
				cLI.addAttribute("class", "");
				//cLI.addAttribute("style", "cursor:hand;");
				cLI.addEvent("onClick", "addPeriodo();");

				cA = new classAHtmlObject();
				cA.appendSome("&nbsp;<label>+</label>&nbsp;");
				cLI.appendSome(cA);
				cUL.appendSome(cLI);

				cDiv = new classDivHtmlObject();
				cDiv.addAttribute("width", "100%");
				cDiv.appendSome(cUL);

				cBody.addElement(cDiv.toString());

				cTable = new classTableHtmlObject("100%");
				cTable.addAttribute("id", "tabMain");

				while (rsParametri.next()) {
					cForm = new classFormHtmlObject("parametro" + rsParametri.getString("IDEN_PARAMETRO"), "", "POST");

					cRow = new classRowDataTable();
					cRow.addAttribute("iden_parametro", rsParametri.getString("IDEN_PARAMETRO"));

					cDivContainer = new classDivHtmlObject();
					cInput = new classInputHtmlObject("checkbox", "chkParametro", "");
					cInput.addAttribute("iden_parametro", rsParametri.getString("IDEN_PARAMETRO"));
					cInput.addAttribute("descr", rsParametri.getString("SIGLA"));
					cInput.addAttribute("precision", pXml.getPrecision(rsParametri.getString("IDEN_PARAMETRO")));
					cInput.setChecked(pXml.visualizzaParametro(rsParametri.getString("IDEN_PARAMETRO")));
					cInput.addEvent("onClick", "abilitaParametro(this);");

					cLabel = new classLabelHtmlObject(cInput.toString());
					cLabel.appendSome(rsParametri.getString("DESCRIZIONE"));

					cForm.appendSome(cLabel);

					cDiv = new classDivHtmlObject();

					cInput = new classInputHtmlObject("checkbox", "chkParametroLine", "");
					cInput.setChecked(pXml.visualizzaParametroLine(rsParametri.getString("IDEN_PARAMETRO")));

					cLabel = new classLabelHtmlObject(cInput.toString());
					cLabel.appendSome("Line");
					if (!pXml.visualizzaParametro(rsParametri.getString("IDEN_PARAMETRO"))) {
						cLabel.addAttribute("style", "visibility:hidden");
					}

					cDiv.addAttribute("style", "padding-left:15px;");
					cDiv.appendSome(cLabel);

					cForm.appendSome(cDiv);

					cDiv = new classDivHtmlObject();

					cInput = new classInputHtmlObject("checkbox", "chkParametroShape", "");
					cInput.setChecked(pXml.visualizzaParametroShape(rsParametri.getString("IDEN_PARAMETRO")));

					cLabel = new classLabelHtmlObject(cInput.toString());
					cLabel.appendSome("Shape");
					if (!pXml.visualizzaParametro(rsParametri.getString("IDEN_PARAMETRO"))) {
						cLabel.addAttribute("style", "visibility:hidden");
					}

					cDiv.addAttribute("style", "padding-left:15px;");
					cDiv.appendSome(cLabel);

					cForm.appendSome(cDiv);

					cDiv = new classDivHtmlObject();

					cInput = new classInputHtmlObject("checkbox", "chkParametroLabel", "");
					cInput.setChecked(pXml.visualizzaParametroLabel(rsParametri.getString("IDEN_PARAMETRO")));

					cLabel = new classLabelHtmlObject(cInput.toString());
					cLabel.appendSome("Label");
					if (!pXml.visualizzaParametro(rsParametri.getString("IDEN_PARAMETRO"))) {
						cLabel.addAttribute("style", "visibility:hidden");
					}

					cDiv.addAttribute("style", "padding-left:15px;");
					cDiv.appendSome(cLabel);

					cForm.appendSome(cDiv);
					cDivContainer.appendSome(cForm);
					cCol = new classColDataTable("td", "20%", cDivContainer);
					cCol.addAttribute("valign", "top");
					cCol.addAttribute("class", "classTdLabelNoWidth");
					cRow.addCol(cCol);

					cCol = new classColDataTable("td", "50%", "");
					for (int i = 0; i < pXml.getPeriodi().size(); i++) {
						if (pXml.visualizzaParametro(rsParametri.getString("IDEN_PARAMETRO"))) {
							cFrame = new classIFrameHtmlObject("servletGenerator?KEY_LEGAME=WK_GRAFICI_FARMACI&WHERE_WK= where iden_grafico=" + idenGrafico + " and iden_parametro=" + rsParametri.getString("IDEN_PARAMETRO") + " and ORDINE=" + pXml.getPeriodi().get(i).ordine);
						} else {
							cFrame = new classIFrameHtmlObject();
						}

						cFrame.addAttribute("id", rsParametri.getString("IDEN_PARAMETRO") + "#" + pXml.getPeriodi().get(i).ordine);
						cFrame.addAttribute("ordine", pXml.getPeriodi().get(i).ordine);
						cFrame.addAttribute("iden_parametro", rsParametri.getString("IDEN_PARAMETRO"));
						cFrame.addAttribute("src2call", "servletGenerator?KEY_LEGAME=WK_GRAFICI_FARMACI&WHERE_WK= where iden_grafico=" + idenGrafico + " and iden_parametro=" + rsParametri.getString("IDEN_PARAMETRO") + " and ORDINE=" + pXml.getPeriodi().get(i).ordine);
						cFrame.addAttribute("frameborder", "0");
						cFrame.addAttribute("class", "frameParamFarmaco");
						cCol.appendSome(cFrame);
					}
					cCol.addAttribute("class", "classTdLabelNoWidth");
					cCol.addAttribute("valign", "top");
					cRow.addCol(cCol);

					cTable.appendSome(cRow.toString());
				}
				rsParametri.close();

				cDiv = new classDivHtmlObject();
				cDiv.addAttribute("id", "divMain");
				cDiv.appendSome(cTable);

				cBody.addElement(cDiv.toString());

				cDiv = new classDivHtmlObject();
				cDiv.addAttribute("id", "divFarmaci");

				for (int i = 0; i < pXml.getPeriodi().size(); i++) {
					if (!pXml.getPeriodi().get(i).dataIni.equals("")) {
						cFrame = new classIFrameHtmlObject("wkTerapiePeriodo?ordine=" + pXml.getPeriodi().get(i).ordine + "&idenAnag=" + idenAnag + "&dataIni=" + pXml.getPeriodi().get(i).dataIni + "&dataFine=" + pXml.getPeriodi().get(i).dataFine);
					} else if (!pXml.getPeriodi().get(i).n_giorni.equals("")) {
						cFrame = new classIFrameHtmlObject("wkTerapiePeriodo?ordine=" + pXml.getPeriodi().get(i).ordine + "&idenAnag=" + idenAnag + "&n_giorni=" + pXml.getPeriodi().get(i).n_giorni);
					} else if (pXml.getPeriodi().get(i).episodio.equals("true")) {
						cFrame = new classIFrameHtmlObject("wkTerapiePeriodo?ordine=" + pXml.getPeriodi().get(i).ordine + "&idenAnag=" + idenAnag + "&idenVisita=" + idenVisita);
					} else if (pXml.getPeriodi().get(i).ricovero.equals("true")) {
						cFrame = new classIFrameHtmlObject("wkTerapiePeriodo?ordine=" + pXml.getPeriodi().get(i).ordine + "&idenAnag=" + idenAnag + "&ricovero=" + ricovero);
					} else if (pXml.getPeriodi().get(i).storico.equals("true")) {
						cFrame = new classIFrameHtmlObject("wkTerapiePeriodo?ordine=" + pXml.getPeriodi().get(i).ordine + "&idenAnag=" + idenAnag);
					}

					cFrame.addAttribute("id", "Farmaci" + pXml.getPeriodi().get(i).ordine);
					cFrame.addAttribute("frameborder", "0");
					cFrame.addAttribute("class", "frameFarmaci");
					cDiv.appendSome(cFrame);
				}
				cBody.addElement(cDiv.toString());

				HeadSection = new classTabHeaderFooter("&nbsp");
				HeadSection.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
				HeadSection.addColumn("classButtonHeader", new classDivButton("Visualizza", "pulsante", "javascript:visualizza();", "P", "").toString());
				HeadSection.addColumn("classButtonHeader", new classDivButton("Registra", "pulsante", "javascript:registra();", "P", "").toString());
				HeadSection.addColumn("classButtonHeader", new classDivButton("Chiudi", "pulsante", "javascript:top.close();", "P", "").toString());
				cBody.addElement(HeadSection.toString());

				cForm = new classFormHtmlObject("dati", "configChart", "POST");
				cInput = new classInputHtmlObject("hidden", "idenAnag", idenAnag);
				cForm.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "idenVisita", idenVisita);
				cForm.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "ricovero", ricovero);
				cForm.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "idenGrafico", idenGrafico);
				cForm.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "reparto", reparto);
				cForm.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "idenPer", String.valueOf(bUtente.iden_per));
				cForm.appendSome(cInput);

				cBody.addElement(cForm.toString());

				cForm = new classFormHtmlObject("save", "", "POST");
				cInput = new classInputHtmlObject("hidden", "iden_anag", chkNull(rs.getString("IDEN_ANAG")));
				cForm.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "iden_ute", chkNull(rs.getString("IDEN_UTE")));
				cForm.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "codice_reparto", chkNull(rs.getString("CODICE_REPARTO")));
				cForm.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "descrizione", chkNull(rs.getString("DESCRIZIONE")));
				cForm.appendSome(cInput);

				cBody.addElement(cForm.toString());

				cDoc.setBody(cBody);
				sOut = cDoc.toString();
			} else {
				sOut = "Errore nella ricezione della configurazione del grafico";
			}
			rs.close();
		} catch (SqlQueryException ex) {
			sOut = ex.getMessage();
		} catch (SQLException ex) {
			sOut = ex.getMessage();
		} catch (Exception ex) {
			sOut = ex.getMessage();
		}

		return sOut;
	}

	private void readDati() throws SQLException, SqlQueryException {

		idenAnag = cParam.getParam("idenAnag").trim();
		idenVisita = cParam.getParam("idenVisita").trim();
		ricovero = cParam.getParam("ricovero").trim();
		idenGrafico = cParam.getParam("idenGrafico").trim();
		reparto = cParam.getParam("reparto").trim();

	}

	private classHeadHtmlObject createHead() throws SQLException, SqlQueryException, Exception {
		return HeaderUtils.createHeadWithIncludes(this.getClass().getName(), hSessione);
	}

	private String chkNull(String input) {
		if (input == null) {
			return "";
		} else {
			return input;
		}
	}

	private String convDate(String in) {
		return in.substring(6, 8) + "/" + in.substring(4, 6) + "/" + in.substring(0, 4);
	}

	private void insertGrafico() throws SqlQueryException, SQLException, Exception {

		int idenInserito = 0;
		CallableStatement CS;

		CS = fDB.getConnectData().prepareCall("{call CC_GRAFICO_INSERT (?,?,?,?)}");

		CS.setInt(1, bUtente.iden_per);
		CS.setString(2, reparto);
		CS.registerOutParameter(3, Types.INTEGER);
		CS.registerOutParameter(4, Types.VARCHAR);

		CS.execute();
		idenInserito = CS.getInt(3);
		if (idenInserito > 0) {
			idenGrafico = String.valueOf(idenInserito);
		} else {
			throw new Exception(CS.getString(4));
		}

		CS.close();

		CS = null;

	}
}
