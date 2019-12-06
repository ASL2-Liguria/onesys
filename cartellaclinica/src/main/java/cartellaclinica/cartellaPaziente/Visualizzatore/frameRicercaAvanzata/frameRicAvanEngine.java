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
package cartellaclinica.cartellaPaziente.Visualizzatore.frameRicercaAvanzata;

import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLIHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.http.classULHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.html.standardHTML;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.lang.reflect.Method;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

public class frameRicAvanEngine extends functionObj {

	private functionObj fObj;
	private functionStr fStr;
	private functionDB fDB = null;
	ServletContext cContext;
	HttpServletRequest cRequest;
	private String idPaziente = new String("");
	private String nosologico = new String("");
	private String reparto = new String("");
	private String indiceColonna = new String("");
	private String sortType = new String("");
	private String descrCDC = new String("");

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(frameRicAvanEngine.class);

	public frameRicAvanEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) {
		super(cont, req, sess);
		cContext = cont;
		cRequest = req;
		this.fObj = new functionObj(cont, req, sess);
		this.fStr = new functionStr();
		fDB = new functionDB(this);

	}

	public frameRicAvanEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));

	}

	public String gestione() {

		String sHtml = new String("");
		String cName = new String("");

		Class cDB = null;
		Class cPar[] = {functionObj.class};
		Object oDB = null;
		Object arg[] = null;
		Method cMet = null;
		Document cDoc = new Document();
		Body cBody = new Body();
		standardHTML sHTML = new standardHTML();
		classFormHtmlObject cForm = new classFormHtmlObject("formRicAvan", "", "POST", "");
		classTableHtmlObject cTable = null;
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		classInputHtmlObject cInput = null;
		classLabelHtmlObject cLabel = null;

		String sOut = new String("");

		classULHtmlObject cUL = null;
		classLIHtmlObject cLI = null;

		try {

			readDati();

			cDoc.appendHead(this.createHead());

			cTable = new classTableHtmlObject();
			cTable.addAttribute("id", "tabellaRicAvan");

			cRow = new classRowDataTable();
			cCol = new classColDataTable("TD", "", "Cognome");
			cRow.addCol(cCol);

			cInput = new classInputHtmlObject("text", "textCognome", "", "60");
			cInput.addEvent("onKeyPress", "tasti()");
			cInput.addEvent("onBlur", "toUpp()");
			cCol = new classColDataTable("TD", "", cInput.toString());
			cRow.addCol(cCol);

			cTable.appendSome(cRow.toString());

			cRow = new classRowDataTable();
			cCol = new classColDataTable("TD", "", "Nome");
			cRow.addCol(cCol);

			cInput = new classInputHtmlObject("text", "textNome", "", "60");
			cInput.addEvent("onKeyPress", "tasti()");
			cInput.addEvent("onBlur", "toUpp()");
			cCol = new classColDataTable("TD", "", cInput.toString());
			cRow.addCol(cCol);

			cTable.appendSome(cRow.toString());

			cRow = new classRowDataTable();
			cCol = new classColDataTable("TD", "", "Data di nascita");
			cRow.addCol(cCol);

			cInput = new classInputHtmlObject("text", "textDataNasc", "", "30");
			cInput.addAttribute("maxlength", "10");
			cInput.addEvent("onKeyPress", "tasti()");
			cCol = new classColDataTable("TD", "", cInput.toString());
			cRow.addCol(cCol);

			cTable.appendSome(cRow.toString());

			cRow = new classRowDataTable();
			cCol = new classColDataTable("TD", "", "Sesso");
			cRow.addCol(cCol);

			cCol = new classColDataTable("TD", "", "");
			cLabel = new classLabelHtmlObject("Maschio");
			cCol.appendSome(cLabel);
			cInput = new classInputHtmlObject("radio", "radioSesso", "");
			cInput.addAttribute("id", "radioM");
			cInput.addEvent("onKeyPress", "tasti()");
			cCol.appendSome(cInput.toString());
			cLabel = new classLabelHtmlObject("Femmina");
			cCol.appendSome(cLabel);
			cInput = new classInputHtmlObject("radio", "radioSesso", "");
			cInput.addAttribute("id", "radioF");
			cInput.addEvent("onKeyPress", "tasti()");
			cCol.appendSome(cInput.toString());
			cRow.addCol(cCol);

			cTable.appendSome(cRow.toString());

			cForm.appendSome(cTable);

			cBody.addElement(cForm.toString());

			cUL = new classULHtmlObject();
			cUL.addAttribute("id", "nav");
			cLI = new classLIHtmlObject(false);

			cLI.appendSome("<a id='reset' href='javascript:resetFiltri();'>Reset</a>");
			cUL.appendSome(cLI);

			cLI = new classLIHtmlObject(false);
			cLI.appendSome("<a id='ricerca' href='javascript:avviaRicerca();'>Avvia ricerca</a>");

			cUL.appendSome(cLI);

			cBody.addElement(cUL.toString());

			cBody.addElement("<script>\n  var oDateMask;	oDateMask = new MaskEdit('dd/mm/yyyy', 'date'); oDateMask.attach(document.formRicAvan.textDataNasc); \n</script>");

			cDoc.setBody(cBody);
			sOut = cDoc.toString();

		} catch (SQLException ex) {
			sOut = ex.getMessage();
		} catch (SqlQueryException ex) {
			sOut = ex.getMessage();
			logInterface.error(ex.getMessage(), ex);
		} catch (Exception ex) {
			sOut = ex.getMessage();
			logInterface.error(ex.getMessage(), ex);
		}

		return sOut;
	}

	private classHeadHtmlObject createHead() throws SqlQueryException, SQLException, Exception {
		return HeaderUtils.createHeadWithIncludesNoDefault(this.getClass().getName(), hSessione);
	}

	private void readDati() throws SQLException, SqlQueryException {

		this.idPaziente = this.cParam.getParam("idPatient").trim();
		this.nosologico = this.cParam.getParam("nosologico").trim();
		this.reparto = this.cParam.getParam("reparto").trim();
		this.indiceColonna = this.cParam.getParam("indiceColonna").trim();
		this.sortType = this.cParam.getParam("sortType").trim();
	}

}
