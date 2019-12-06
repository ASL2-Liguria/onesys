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
/*
 File: consultazioneCalendarioGes.java
 Autore: Jack
 */
package charts.multipleCharts;

import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTabHeaderFooter;
import imago.http.classTableHtmlObject;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

public class wkTerapiePeriodoEngine extends functionObj {

	private functionDB fDB = null;
	private functionStr fStr = null;

	private String idenAnag = new String("");
	private String idenVisita = new String("");
	private String n_giorni = new String("");
	private String ricovero = new String("");
	private String dataIni = new String("");
	private String dataFine = new String("");
	private String ordine = new String("");

	public wkTerapiePeriodoEngine(ServletContext cont, HttpServletRequest req,
			HttpSession sess) {
		super(cont, req, sess);
		fDB = new functionDB(this);
		fStr = new functionStr();
	}

	public wkTerapiePeriodoEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() {
		String sOut = new String("");

		boolean addDrag = false;

		Document cDoc = new Document();
		Body cBody = new Body();
		cBody.addAttribute("onselectstart", "javascript:return false;");
		classTabHeaderFooter HeadSection = null;
		classTableHtmlObject cTable = new classTableHtmlObject("100%");
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		classDivHtmlObject cDiv = new classDivHtmlObject();
		cDiv.addAttribute("style", "width:100%;height:100%");
		classDivHtmlObject cDivHeaderTable = new classDivHtmlObject();
		cDivHeaderTable.addAttribute("id", "fixme");
		classTableHtmlObject cHeaderTable = new classTableHtmlObject("100%");
		cHeaderTable.addAttribute("class", "classDataTable");

		try {

			this.readDati();

			cDoc.appendHead(this.createHead());

			String sql = "";
			String titleSection = "";
			if (!dataIni.equals("")) {
				titleSection = "Farmaci somministrati " + convDate(dataIni) + " - " + convDate(dataFine);
				sql = "select * from table(cc_farmaci_periodo(" + idenAnag + ",'" + dataIni + "','" + dataFine + "',null,null,null)) order by descrizione";
			} else if (!n_giorni.equals("")) {
				titleSection = "Farmaci somministrati negli ultimi " + n_giorni + " giorni";
				sql = "select * from table(cc_farmaci_periodo(" + idenAnag + ",null,null," + n_giorni + ",null,null)) order by descrizione";
			} else if (!idenVisita.equals("")) {
				titleSection = "Farmaci somministrati nell'episodio";
				sql = "select * from table(cc_farmaci_periodo(" + idenAnag + ",null,null,null," + idenVisita + ",null)) order by descrizione";
			} else if (!ricovero.equals("")) {
				titleSection = "Farmaci somministrati nel ricovero " + ricovero;
				sql = "select * from table(cc_farmaci_periodo(" + idenAnag + ",null,null,null,null,'" + ricovero + "')) order by descrizione";
			} else {
				titleSection = "Farmaci somministrati al paziente";
				sql = "select * from table(cc_farmaci_periodo(" + idenAnag + ",null,null,null,null,null)) order by descrizione";
			}

			ResultSet rs = fDB.openRs(sql);

			cRow = new classRowDataTable();
			cCol = new classColDataTable("", "", "Nessun farmaco somministrato nel periodo di interesse");
			cCol.addAttribute("class", "classTdLabelNoWidth");
			cRow.addCol(cCol);
			cTable.appendSome(cRow.toString());

			while (rs.next()) {

				addDrag = true;

				if (HeadSection == null) {

					HeadSection = new classTabHeaderFooter(titleSection);
					cDivHeaderTable.appendSome(HeadSection.toString());

					cRow = new classRowDataTable();
					cRow.addAttribute("style", "cursor:hand;");

					cCol = new classColDataTable("th", "10%", "");
					cRow.addCol(cCol);
					cCol = new classColDataTable("th", "90%", "Descrizione");
					cRow.addCol(cCol);
					cHeaderTable.appendSome(cRow.toString());
					cDivHeaderTable.appendSome(cHeaderTable);
					cDiv.appendSome(cDivHeaderTable);

					cTable = new classTableHtmlObject("100%");
					cTable.addAttribute("class", "classDataTable");
					cTable.addAttribute("id", "oTable");
				}
				cRow = new classRowDataTable("");
				cRow.addAttribute("iden_farmaco", rs.getString("IDEN"));
				cRow.addAttribute("descr_farmaco", rs.getString("DESCRIZIONE"));

				cCol = new classColDataTable("td", "10%", "<div style='cursor:hand;background-image:url(imagexPix/contextMenu/left_32.png);width:32px;height:32px'/>");
				cRow.addCol(cCol);
				cCol = new classColDataTable("", "90%", rs.getString("DESCRIZIONE"));
				cRow.addCol(cCol);

				cTable.appendSome(cRow.toString());
			}
			fDB.close(rs);
			cDiv.appendSome(cTable);
			cBody.addElement(cDiv.toString());
			if (addDrag) {
				cBody.addElement("<SCRIPT>appendObject(document.all.oTable,'" + ordine + "')</SCRIPT>");
			}
			cDoc.setBody(cBody);
			sOut = cDoc.toString();
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

		this.idenAnag = this.cParam.getParam("idenAnag").trim();
		this.n_giorni = chkNull(this.cParam.getParam("n_giorni").trim());
		this.idenVisita = chkNull(this.cParam.getParam("idenVisita").trim());
		this.ricovero = chkNull(this.cParam.getParam("ricovero").trim());
		this.dataIni = chkNull(this.cParam.getParam("dataIni").trim());
		this.dataFine = chkNull(this.cParam.getParam("dataFine").trim());
		this.ordine = this.cParam.getParam("ordine").trim();

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

}
