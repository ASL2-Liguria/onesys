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
package ACR;

import imago.a_sql.CEsaInfo;
import imago.a_sql.CEsami;
import imago.a_sql.CLogError;
import imago.a_util.CContextParam;
import imago.http.classDivButton;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseUser;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.html.functionHTML;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;

/**
 * 
 * @author fabioc
 */
public class SL_ACREngine {
	private baseUser LoggedUser;

	private HttpServletRequest MYrequest;

	private ServletContext MYContext;

	private CContextParam myContextParam = null;

	CLogError log = null;

	private String idenRef = "";

	private String Esa_ACR1 = "";

	private String Esa_ACR2 = "";

	private String Esa_ACR3 = "";

	private String Ref_RSCN2 = "";

	private String Ref_RSCN1 = "";

	private String Ref_Note = "";

	/** Creates a new instance of SL_Stampa_TabEngine */
	public SL_ACREngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest, CContextParam myConteParam) {
		if (myInputRequest.getParameter("idenRef") != null)
			idenRef = myInputRequest.getParameter("idenRef");
		else
			idenRef = "";
		MYContext = myInputContext;
		LoggedUser = Global.getUser(myInputSession);
		MYrequest = myInputRequest;
		myContextParam = myConteParam;
		try {

			log = new CLogError(LoggedUser.db.getWebConnection(), myInputRequest, "SL_ACR", LoggedUser.login);
			log.setFileName("SL_ACREngine");
			log.setClassName("ACR.SL_ACREngine");
		} catch (Exception ex) {
			// System.out.println(ex);
		}
	}

	public org.apache.ecs.Document creaDocumentoHtml() {
		Document doc = null;

		doc = new Document();

		doc.setHead(addHead(LoggedUser));

		doc.setBody(creaBody());

		return doc;

	}

	public Body creaBody() {

		Body testo = new Body();
		testo.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);tutto_schermo();");
		functionHTML fHTML = new functionHTML();
		classFormHtmlObject form = new classFormHtmlObject("formACR_Cons", "SL_ACR", "POST");
		classLabelHtmlObject label_titolo = new classLabelHtmlObject("", "", "titoloAcr");
		classTabHeaderFooter header = new classTabHeaderFooter("" + label_titolo);
		form.appendSome(header.toString());
		try {
			CEsaInfo CarPrecEsaInfo = new CEsaInfo();
			CEsami CarPrecEsa = new CEsami(LoggedUser, myContextParam, log);
			CarPrecEsa.loadData("iden_ref=" + idenRef);
			CarPrecEsaInfo = CarPrecEsa.getData(0);
			Esa_ACR1 = CarPrecEsaInfo.m_strCOD_SNC21;
			Esa_ACR2 = CarPrecEsaInfo.m_strCOD_SNC22;
			Esa_ACR3 = CarPrecEsaInfo.m_strCOD_SNC23;
			if (Ref_RSCN1 == null)
				Ref_RSCN1 = "";
			if (Ref_RSCN2 == null)
				Ref_RSCN2 = "";
			if (Esa_ACR1 == null)
				Esa_ACR1 = "";
			if (Esa_ACR2 == null)
				Esa_ACR2 = "";
			if (Esa_ACR3 == null)
				Esa_ACR3 = "";

		} catch (Exception e) {
		}
		// CarPrecEsaInfo.m_
		functionDB fDB = new functionDB(MYContext, MYrequest);
		fDB.setArrayDati("TAB_CODICI_SCIENTIFICI", "DESCRIZIONE", "CODICE", "", "", "S", "S");
		functionDB fDB1 = new functionDB(MYContext, MYrequest);
		fDB1.setArrayDati("TAB_CODICI_SCIENTIFICI_1", "DESCRIZIONE", "CODICE", "", "", "S", "S");
		// classDivButton But_CodScie1 = new
		// classDivButton("","pulsante","","lblBut_CodScie1","");
		fHTML.creaColonnaDescr("", "lblBut_CodScie1");
		fHTML.creaColonnaCombo("combo_scn1", fDB.getArrayDati(), fDB.getArrayCodici(), Ref_RSCN1, "S", "", "");
		fHTML.aggiungiRiga();
		// classDivButton But_CodScie2 = new
		// classDivButton("","pulsante","","lblBut_CodScie2","");
		fHTML.creaColonnaDescr("", "lblBut_CodScie2");
		fHTML.creaColonnaCombo("combo_scn2", fDB1.getArrayDati(), fDB1.getArrayCodici(), Ref_RSCN2, "S", "", "");
		fHTML.aggiungiRiga();
		// classDivButton But_Note = new
		// classDivButton("","pulsante","","Fie_CodNote","");
		fHTML.creaColonnaDescr("", "Fie_CodNote");
		fHTML.creaColonnaTxtArea("TxtNote", Ref_Note, "", "");
		fHTML.aggiungiRiga();
		classDivButton But_Acr1 = new classDivButton("", "pulsante", "javascript:apriACR('" + idenRef + "','1',document.formACR_Cons.Fie_Acr1.value)", "lblBut_Acr1", "");
		fHTML.creaColonnaPulsante(But_Acr1);
		fHTML.creaColonnaField("Fie_Acr1", Esa_ACR1, "");
		fHTML.aggiungiRiga();
		classDivButton But_Acr2 = new classDivButton("", "pulsante", "javascript:apriACR('" + idenRef + "','2',document.formACR_Cons.Fie_Acr2.value)", "lblBut_Acr2", "");
		fHTML.creaColonnaPulsante(But_Acr2);
		fHTML.creaColonnaField("Fie_Acr2", Esa_ACR2, "");
		fHTML.aggiungiRiga();
		classDivButton But_Acr3 = new classDivButton("", "pulsante", "javascript:apriACR('" + idenRef + "','3',document.formACR_Cons.Fie_Acr3.value)", "lblBut_Acr3", "");
		fHTML.creaColonnaPulsante(But_Acr3);
		fHTML.creaColonnaField("Fie_Acr3", Esa_ACR3, "");
		fHTML.aggiungiRiga();
		form.appendSome(fHTML.getTable().toString());
		classTabHeaderFooter footer = new classTabHeaderFooter(" ");
		footer.setClasses("classTabHeader", "classTabFooterSx", "classTabHeaderMiddle", "classTabFooterDx");
		classDivButton button_sel = new classDivButton("", "pulsante", "javascript:salvaTab();", "save", "");
		footer.addColumn("classButtonHeader", button_sel.toString());
		classDivButton button_close = new classDivButton("", "pulsante", "javascript:self.close();", "chiudi", "");
		footer.addColumn("classButtonHeader", button_close.toString());
		classInputHtmlObject idenEx = new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN, "idenRef", idenRef, "");
		form.appendSome(idenEx.toString());
		form.appendSome(footer.toString());
		testo.addElement(form.toString());

		// tutto_schermo();

		classJsObject.setNullContextMenuEvent(testo, this.LoggedUser);
		return testo;
	}

	public classHeadHtmlObject addHead(baseUser logged_user) {
		baseUser log_user = null;
		classHeadHtmlObject testata = null;
		log_user = logged_user;
		testata = new classHeadHtmlObject();
		new classJsObject();
		try {
			classJsObject label_js = new classJsObject();
			String jsLabel = null;
			jsLabel = label_js.getArrayLabel("SL_ACR", log_user);
			testata.addElement(jsLabel);
			/*
			 * testata.addJSLink("std/jscript/ACR/Acr_Js.js");
			 * testata.addJSLink("dwr/engine.js");
			 * testata.addJSLink("dwr/util.js");
			 * testata.addJSLink("dwr/interface/Update.js");
			 * testata.addCssLink("std/css/normalBody.css");
			 * testata.addJSLink("std/jscript/fillLabels.js");
			 * testata.addJSLink("std/jscript/tutto_schermo.js");
			 * testata.addCssLink("std/css/headerTable.css");
			 * testata.addCssLink("std/css/dataTable.css");
			 * testata.addCssLink("std/css/dataEntryTable.css");
			 * testata.addCssLink("std/css/filterTable.css");
			 * testata.addCssLink("std/css/button.css");
			 * testata.addCssLink("std/css/dataEntryTable.css");
			 */
			testata.addElement(classTabExtFiles.getIncludeString(this.LoggedUser, "", this.getClass().getName(), this.MYContext));

			// testata.addJSLink("sdt/jscript/src/ListeLavoro/SelDeselAll.js");
			// testata.addJscode(myJS.getArrayLabel("ServletLLFiltri",LoggedUser));

			/* Gestione del calendario */

		} catch (Exception ex) {
			// System.out.println(ex);
			log.writeLog("Problemi nel creare la testata della pagina Html ", CLogError.LOG_ERROR);
		}
		return testata;
	}
}

/**
 * <p>
 * Title:
 * </p>
 * 
 * <p>
 * Description:
 * </p>
 * 
 * <p>
 * Copyright:
 * </p>
 * 
 * <p>
 * Company:
 * </p>
 * 
 * @author Fabio
 * @version 1.0
 */
