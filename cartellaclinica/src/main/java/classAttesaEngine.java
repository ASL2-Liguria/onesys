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
 * classAttesaEngine.java
 *
 * Created on 8 settembre 2006, 15.32
 */

/**
 *
 * @author  aldo
 */

import imago.http.ImagoHttpException;
import imago.http.classDivHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.classTDHtmlObject;
import imago.http.classTRHtmlObject;
import imago.http.classTableHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import worklist.ImagoWorklistException;
import core.Global;

/*
 java.lang.Object
 org.apache.axis.utils.XMLUtils*/

public class classAttesaEngine {

	private HttpSession mySession;

	private ServletContext myContext;

	private baseUser logged_user = null;

	private basePC infoPC = null;

	private baseGlobal infoGlobali = null;

	private baseWrapperInfo myBaseInfo = null;

	/** Creates a new instance of classAttesaEngine */
	public classAttesaEngine(HttpSession myInputSession, ServletContext myInputContext) throws ImagoWorklistException {
		this.mySession = myInputSession;
		this.myContext = myInputContext;
	}

	public void leggiDatiInput() {
		return;
	}

	public org.apache.ecs.html.Body creaBodyHtml() throws worklist.ImagoWorklistException {
		Body corpoHtml = null;
		classTableHtmlObject myTable = null;
		classTRHtmlObject myTR = null;
		classTDHtmlObject myTD = null;
		classLabelHtmlObject myLabel = null;
		classDivHtmlObject myDiv = null;

		corpoHtml = new Body();
		myTable = new classTableHtmlObject("150px", "classTableAttesa", "");
		myTable.addAttribute("cellspacing", "0");
		myTable.addAttribute("cellpadding", "0");
		myTable.addAttribute("bgcolor", "#000000");
		myTable.addAttribute("height", "70px");
		myDiv = new classDivHtmlObject("idWallpaperAttesa");
		// myImg = new
		// classImgHtmlObject("imagexPix/wallpaper/attesa.gif","",0);

		myTD = new classTDHtmlObject(myDiv);
		myTR = new classTRHtmlObject();
		myTR.appendSome(myTD);
		myTable.appendSome(myTR);

		myLabel = new classLabelHtmlObject("", "", "lblAttesa");
		myLabel.addAttribute("class", "classTestoAttesa");
		myTD = new classTDHtmlObject(myLabel);
		myTD.addAttribute("height", "20px");
		myTD.addAttribute("align", "center");
		myTR = new classTRHtmlObject();
		myTR.appendSome(myTD);
		myTable.appendSome(myTR);

		corpoHtml.addElement(myTable.toString());
		// disattivo pulsante destro
		classJsObject.setNullContextMenuEvent(corpoHtml, this.logged_user);
		corpoHtml.addElement(addBottomJScode());
		return corpoHtml;

	}

	private void initMainObjects() {
		this.logged_user = Global.getUser(mySession);
		this.infoPC = (basePC) this.mySession.getAttribute("parametri_pc");
		try {
			this.infoGlobali = baseRetrieveBaseGlobal.getBaseGlobal(this.myContext, this.mySession);
		} catch (ImagoHttpException ex) {
		}
		this.myBaseInfo = new baseWrapperInfo(this.logged_user, this.infoGlobali, this.infoPC);
	}

	public org.apache.ecs.Document creaDocumentoHtml() throws worklist.ImagoWorklistException {
		Document doc = null;

		doc = new Document();

		try {
			initMainObjects();
			leggiDatiInput();
			doc.setTitle(creaTitoloHtml());
			doc.setBody(creaBodyHtml());
			// attacco Head al documento
			doc.setHead(creaHeadHtml());
		} catch (java.lang.NullPointerException ex) {
			ImagoWorklistException newEx = new ImagoWorklistException(ex);
			ex.printStackTrace();
			throw newEx;
		} catch (ImagoWorklistException ex) {
			ex.printStackTrace();
			throw ex;
		}
		return doc;
	}

	private String addBottomJScode() {
		StringBuffer sb = new StringBuffer();
		sb.append("<SCRIPT>");
		sb.append("initGlobalObject()\n");
		sb.append("</SCRIPT>");
		sb.append("\n");
		// appendo codice JS

		return sb.toString();
	}

	public imago.http.classHeadHtmlObject creaHeadHtml() throws worklist.ImagoWorklistException {

		classJsObject myJS = null;
		classHeadHtmlObject testata = null;

		// Definisco Title del documento
		try {
			// definisco Head
			testata = new classHeadHtmlObject();
			// ********** includo i files ********
			testata.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", this.getClass().getName(), this.myContext));
			// *****
			myJS = new classJsObject();
			testata.addJscode(myJS.getArrayLabel(this.getClass().getSimpleName(), this.logged_user));
			// appendo Meta all'Head
			testata.addElement(creaMetaHtml());
			testata.addElement(addTopJScode());
			return testata;
		} catch (ImagoWorklistException ex) {
			ex.printStackTrace();
			throw ex;
		} catch (java.lang.NullPointerException ex) {
			ImagoWorklistException newEx = new ImagoWorklistException(ex);
			ex.printStackTrace();
			throw newEx;
		} catch (java.lang.Exception ex) {
			ImagoWorklistException newEx = new ImagoWorklistException(ex);
			ex.printStackTrace();
			throw newEx;
		}
	}

	public imago.http.classMetaHtmlObject creaMetaHtml() throws ImagoWorklistException {
		classMetaHtmlObject MetaTag = null;

		MetaTag = new classMetaHtmlObject();
		return MetaTag;
	}

	public String addTopJScode() {

		StringBuffer sb = new StringBuffer();

		// appendo codice JS
		sb.append(classJsObject.javaClass2jsClass((Object) this.myBaseInfo.getGlobal()));
		sb.append(classJsObject.javaClass2jsClass((Object) this.myBaseInfo.getUser()));
		sb.append(classJsObject.javaClass2jsClass((Object) this.myBaseInfo.getPC()));

		return sb.toString();
	}

	public org.apache.ecs.html.Title creaTitoloHtml() throws ImagoWorklistException {
		// Definisco Title del documento
		try {
			Title titolo = new Title(" ");
			titolo.addAttribute("id", "htmlTitolo");
			return titolo;
		} catch (java.lang.Exception ex) {
			ImagoWorklistException newEx = new ImagoWorklistException(ex);
			ex.printStackTrace();
			throw newEx;
		}
	}

}
