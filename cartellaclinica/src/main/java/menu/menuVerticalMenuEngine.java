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
// FrontEnd Plus GUI for JAD
// DeCompiled : menuVerticalMenuEngine.class

package menu;

import imago.http.ImagoHttpException;
import imago.http.classDivHtmlObject;
import imago.http.classDivVerticalMenu;
import imago.http.classDivVerticalMenuButton;
import imago.http.classFieldsetHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classLegendHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.classTabExtFiles;
import imagoAldoUtil.classTabVerticalMenu;
import imagoAldoUtil.classTabVerticalMenuElement;
import imagoAldoUtil.classUtenteLoggato;
import imagoAldoUtil.structErroreControllo;
import imagoAldoUtil.checkUser.classUserManage;
import imagoUtils.classJsObject;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import worklist.ImagoWorklistException;
import worklist.IworklistEngine;
import core.Global;

public class menuVerticalMenuEngine implements IworklistEngine {

    private HttpSession mySession;
    private ServletContext myContext;
    private HttpServletRequest myRequest;
    private baseUser logged_user;
    private baseGlobal infoGlobali;
    private basePC infoPC;
    private baseWrapperInfo myBaseInfo;
    private ArrayList listaUtentiLoggati;
    final String imgCross = "imagexPix/button/mini/cross.gif";
    final String imgMinus = "imagexPix/button/mini/minus.gif";

    public menuVerticalMenuEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest) {
	logged_user = null;
	infoGlobali = null;
	infoPC = null;
	myBaseInfo = null;
	listaUtentiLoggati = null;
	mySession = myInputSession;
	myContext = myInputContext;
	myRequest = myInputRequest;
    }

    private void initMainObjects() {
        Connection   myConn=null;
	logged_user = Global.getUser(mySession);
	try
	{
	    infoGlobali = baseRetrieveBaseGlobal.getBaseGlobal(myContext, mySession);
	}
	catch(ImagoHttpException ex)
	{
        }
        try{
	    infoPC = ( basePC ) mySession.getAttribute ( "parametri_pc" ) ;
	    myBaseInfo = new baseWrapperInfo ( logged_user , infoGlobali ,
					       infoPC ) ;
	    String strUser = myContext.getInitParameter ( "WebUser" ) ;
	    String strPwd = classUserManage.decodificaPwd ( myContext ,
		    myContext.getInitParameter ( "WebPwd" ) ) ;
	    String strConnectionString = myContext.getInitParameter (
		    "ConnectionString" ) ;
	    myConn = imago.sql.Utils.getTemporaryConnection ( strUser , strPwd ,
		    strConnectionString ) ;
	    listaUtentiLoggati = classUtenteLoggato.getListaUtentiLoggati (
		    myConn ) ;
	}
        catch(Exception ex){
            ex.printStackTrace();
        }
    }

    public String addTopJScode() {
	StringBuffer sb = new StringBuffer();
	sb.append(classJsObject.javaClass2jsClass(myBaseInfo.getGlobal()));
	sb.append(classJsObject.javaClass2jsClass(myBaseInfo.getUser()));
	sb.append(classJsObject.javaClass2jsClass(myBaseInfo.getPC()));
	sb.append(creaArrayJsUtenti(myContext));
	sb.append("<SCRIPT>");
	sb.append("var handle_chiusura='';\n");
	sb.append("</SCRIPT>");
	return sb.toString();
    }

    public String addBottomJScode() {
	StringBuffer sb = new StringBuffer();
	sb.append("<SCRIPT>");
	sb.append("initGlobalObject();\n");
	sb.append("</SCRIPT>");
	return sb.toString();
    }

    public Body creaBodyHtml() throws ImagoWorklistException {
        String hlinguettaMenuVerticale = null;
	Body corpoHtml = null;
	corpoHtml = new Body();
	classDivHtmlObject mainDiv = new classDivHtmlObject("layMenuContainer");
        imago.util.CTabForm   tab_form = null;

	//mainDiv.addAttribute("style", "display:none;");
        hlinguettaMenuVerticale = this.myRequest.getParameter("hlinguettaMenuVerticale");
//        System.out.println("+++++++++++++++++++++++++++"+hlinguettaMenuVerticale+"+++++++++++++++++++++++++++");
        if(hlinguettaMenuVerticale == null)
            hlinguettaMenuVerticale = "none";
        mainDiv.addAttribute("style", "display:"+ hlinguettaMenuVerticale +";");


	classDivVerticalMenu menu = new classDivVerticalMenu();
	try
	{
	    mainDiv.appendSome(getMenu(logged_user, menu));
	}
	catch(ImagoHttpException ex)
	{
	    ImagoWorklistException newEx = new ImagoWorklistException(ex);
	    throw newEx;
	}
	mainDiv.appendSome(creaDivInfoUtente());
	corpoHtml.addElement(mainDiv.toString());
	classJsObject.setNullContextMenuEvent(corpoHtml, logged_user);
	corpoHtml.addElement(addForms());
        // aggiungo le eventuali form tabellate
        tab_form = new imago.util.CTabForm ( this.logged_user ,"VERTICAL_MENU") ;
        try
        {
            corpoHtml.addElement ( tab_form.get () ) ;
        }
        catch ( java.lang.Exception ex )
        {
            ex.printStackTrace () ;
        }

	classDivHtmlObject divBookMark = new classDivHtmlObject("layBM");
	divBookMark.addEvent("onclick", "javascript:parent.expandMenu();");
	divBookMark.appendSome(addBottomJScode());
	corpoHtml.addElement(divBookMark.toString());
	return corpoHtml;
    }

    public Document creaDocumentoHtml() throws ImagoWorklistException {
	Document doc = null;
	doc = new Document();
	try
	{
	    initMainObjects();
	    doc.setTitle(creaTitoloHtml());
	    doc.setBody(creaBodyHtml());
	    doc.setHead(creaHeadHtml());
	}
	catch(NullPointerException ex)
	{
	    ImagoWorklistException newEx = new ImagoWorklistException(ex);
	    ex.printStackTrace();
	    throw newEx;
	}
	catch(ImagoWorklistException ex)
	{
	    ex.printStackTrace();
	    throw ex;
	}
	return doc;
    }

    public classHeadHtmlObject creaHeadHtml() throws ImagoWorklistException {
	classJsObject myJS = null;
	classHeadHtmlObject testata = null;
	try
	{
	    myJS = new classJsObject();
	    new classRsUtil();
	    testata = new classHeadHtmlObject();
	    testata.addElement(myJS.getArrayLabel("menuVerticalMenuEngine", logged_user));
	    testata.addElement(classTabExtFiles.getIncludeString(logged_user, "", getClass().getName(), myContext));
	    testata.addElement(creaMetaHtml());
	    testata.addElement(addTopJScode());
	    return testata;
	}
	catch(Exception ex)
	{
	    ImagoWorklistException newEx = new ImagoWorklistException(ex);
	    ex.printStackTrace();
	    throw newEx;
	}
    }

    public classMetaHtmlObject creaMetaHtml() throws ImagoWorklistException {
	classMetaHtmlObject MetaTag = null;
	MetaTag = new classMetaHtmlObject();
	return MetaTag;
    }

    public Title creaTitoloHtml() throws ImagoWorklistException {
	try
	{
	    Title titolo = new Title(" ");
	    titolo.addAttribute("id", "htmlTitolo");
	    return titolo;
	}
	catch(Exception ex)
	{
	    ImagoWorklistException newEx = new ImagoWorklistException(ex);
	    ex.printStackTrace();
	    throw newEx;
	}
    }

    private String addForms() {
	StringBuffer sb = null;
	classFormHtmlObject form = null;
	classFormHtmlObject form_ric_paz = null;
	classFormHtmlObject form_ric_esa = null;
	classFormHtmlObject form_magazzino = null;
	classFormHtmlObject form_magazzinoMN = null;
	sb = new StringBuffer();
	sb.append("\n");
	form = new classFormHtmlObject("form_hidden", "", "POST", "workFrame");
	classInputHtmlObject procedura = new classInputHtmlObject("hidden", "procedura", "");
	form.appendSome(procedura);
	classInputHtmlObject frame_rows = new classInputHtmlObject("hidden", "frame_rows", "");
	form.appendSome(frame_rows);
	sb.append(form.toString());
	sb.append("\n");
	form_ric_paz = new classFormHtmlObject("form_ric_paz", "", "POST", "workFrame");
	form_ric_paz.appendSome(new classInputHtmlObject("hidden", "param_ric", ""));
	form_ric_paz.appendSome(new classInputHtmlObject("hidden", "menuVerticalMenu", ""));
	form_ric_paz.appendSome(new classInputHtmlObject("hidden", "rows_frame_uno", ""));
	form_ric_paz.appendSome(new classInputHtmlObject("hidden", "rows_frame_due", ""));
	form_ric_paz.appendSome(new classInputHtmlObject("hidden", "servlet_call_after", ""));
	form_ric_paz.appendSome(new classInputHtmlObject("hidden", "cdc", ""));
	form_ric_paz.appendSome(new classInputHtmlObject("hidden", "nome_funzione_ricerca", ""));
	form_ric_paz.appendSome ( new classInputHtmlObject ( "hidden" ,
		"tipo_ricerca" , "" ) ) ;
	form_ric_paz.appendSome ( new classInputHtmlObject ( "hidden" ,
		"provenienza" , "" ) ) ;
	form_ric_paz.appendSome ( new classInputHtmlObject ( "hidden" ,
		"rf1" , "" ) ) ;
	form_ric_paz.appendSome ( new classInputHtmlObject ( "hidden" ,
		"rf2" , "" ) ) ;
	form_ric_paz.appendSome ( new classInputHtmlObject ( "hidden" ,
		"rf3" , "" ) ) ;
	sb.append(form_ric_paz.toString());
	sb.append("\n");
	form_ric_esa = new classFormHtmlObject("form_ric_esa", "worklistInizio", "POST", "workFrame");
	form_ric_esa.appendSome(new classInputHtmlObject("hidden", "topSource", ""));
	sb.append(form_ric_esa.toString());
	sb.append("\n");
	form_magazzino = new classFormHtmlObject("form_magazzino", "", "POST", "workFrame");
	form_magazzino.appendSome(new classInputHtmlObject("hidden", "tipo_ricerca", ""));
	form_magazzino.appendSome(new classInputHtmlObject("hidden", "menuVerticalMenu", ""));
	form_magazzino.appendSome(new classInputHtmlObject("hidden", "frame_rows", ""));
	form_magazzino.appendSome(new classInputHtmlObject("hidden", "nome_tabella", ""));
	form_magazzino.appendSome(new classInputHtmlObject("hidden", "nome_funzione_ricerca", ""));
	sb.append(form_magazzino.toString());
	sb.append("\n");
	form_magazzinoMN = new classFormHtmlObject("form_magazzinoMN", "", "POST", "workFrame");
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "tipo_wk_b", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "label_titolo_b", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "table_b", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "hattivita_b", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "tipo_wk_mr", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "label_titolo_mr", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "table_mr", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "hattivita_mr", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "where_condition_mr", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "order_by_mr", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "tipo_wk_kf", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "label_titolo_kf", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "table_kf", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "hattivita_kf", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "where_condition_kf", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "order_by_kf", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "tipo_wk_gen", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "label_titolo_gen", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "table_gen", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "hattivita_gen", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "where_condition_gen", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "order_by_gen", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "tipo_wk_el", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "label_titolo_el", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "table_el", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "hattivita_el", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "where_condition_el", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "order_by_el", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "tipo_wk_kc", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "label_titolo_kc", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "table_kc", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "hattivita_kc", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "where_condition_kc", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "order_by_kc", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "where_condition_b", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "order_by_b", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "colonne", ""));
	form_magazzinoMN.appendSome(new classInputHtmlObject("hidden", "righe", ""));
	sb.append(form_magazzinoMN.toString());
	sb.append("\n");
	return sb.toString();
    }

    private classDivHtmlObject creaDivInfoUtente() {
	classDivHtmlObject divUser = null;
	classFieldsetHtmlObject myFieldset = null;
	classLabelHtmlObject myLabel = null;
	String strCdcAttivi = "";
	String cdc = null;
	structErroreControllo myErrore = new structErroreControllo(false, "");
	String data_ultimo_utilizzo = "";
	//	vocalInfoProfile myVocal = null;
	divUser = new classDivHtmlObject("container");
	myFieldset = new classFieldsetHtmlObject();
	myLabel = new classLabelHtmlObject("", "", "lbltitoloInfo");
	myFieldset.appendSome(new classLegendHtmlObject(myLabel.toString()));
	myFieldset.addAttribute("id", "idTitoloInfo");
	myFieldset.addAttribute("class", "classTitoloInfo");
	myLabel = new classLabelHtmlObject("", "", "lblUtente");
	myFieldset.appendSome(new classDivHtmlObject("attributo", "", myLabel.toString()));
	myFieldset.appendSome(new classDivHtmlObject("valore", "", logged_user.login));
	myLabel = new classLabelHtmlObject("", "", "lblOperatore");
	myFieldset.appendSome(new classDivHtmlObject("attributo", "", myLabel.toString()));
	myFieldset.appendSome(new classDivHtmlObject("valore", "", logged_user.description));
	myLabel = new classLabelHtmlObject("", "", "lblReparto");
	myFieldset.appendSome(new classDivHtmlObject("attributo", "", myLabel.toString()));
	for(int i = 0; i < logged_user.listaReparti.size(); i++)
	{
	    try
	    {
		cdc = (String) logged_user.listaReparti.get(i);
	    }
	    catch(Exception ex)
	    {
		cdc = "";
	    }
	    if(cdc.equalsIgnoreCase(""))
		continue;
	    if(strCdcAttivi.equalsIgnoreCase(""))
		strCdcAttivi = cdc;
	    else
		strCdcAttivi = (new StringBuilder()).append(strCdcAttivi).append(", ").append(cdc).toString();
	}

	myFieldset.appendSome(new classDivHtmlObject("valore", "", strCdcAttivi));
	myLabel = new classLabelHtmlObject("", "", "lblUltimoAccesso");
	myFieldset.appendSome(new classDivHtmlObject("attributo", "", myLabel.toString()));
	try
	{
	    if(logged_user.data_ultimo_utilizzo == null)
	    {
		myErrore = logged_user.updateDateWithTodayValue("data_ultimo_utilizzo");
		myErrore = logged_user.updateDateWithTodayValue("data_inserimento_pw");
		logged_user.loadInitValue();
		if(myErrore.bolError)
		    data_ultimo_utilizzo = "";
		else
		    data_ultimo_utilizzo = logged_user.data_ultimo_utilizzo.toString();
	    }
	    else
	    {
		data_ultimo_utilizzo = logged_user.data_ultimo_utilizzo.toString();
		myErrore = logged_user.updateDateWithTodayValue("data_ultimo_utilizzo");
	    }
	}
	catch(Exception ex)
	{
	    data_ultimo_utilizzo = "";
	}
	myFieldset.appendSome(new classDivHtmlObject("valore", "", data_ultimo_utilizzo));
	/*myLabel = new classLabelHtmlObject("", "", "lblMsgRcv");
	myFieldset.appendSome(new classDivHtmlObject("attributo", "", myLabel.toString()));
	myFieldset.appendSome(new classDivHtmlObject("valore", "", "&nbsp;"));*/
	/*myLabel = new classLabelHtmlObject("", "", "lblVocal");
	myFieldset.appendSome(new classDivHtmlObject("attributo", "", myLabel.toString()));*/
/*	myVocal = new vocalInfoProfile(myBaseInfo);
	if(myVocal != null)
	{
	    if(!myVocal.getVocalIntegrationActive())
	    {
		strTmp = (new StringBuilder()).append("&nbsp;").append((new classLabelHtmlObject("", "", "lblVocalStateOFF")).toString()).toString();
		myImg = new classImgHtmlObject("imagexPix/button/mini/vocal_off.gif", "", "", 0, "25px", "25px");
	    }
	    else
	    {
		strTmp = (new StringBuilder()).append("&nbsp;").append((new classLabelHtmlObject("", "", "lblVocalStateON")).toString()).toString();
		myImg = new classImgHtmlObject("imagexPix/button/mini/vocal_on.gif", "", "", 0, "25px", "25px");
		myImg.addAttribute("alt", myVocal.getVocalType());
	    }
	    strTmp = (new StringBuilder()).append(strTmp).append("&nbsp;").append(myImg.toString()).toString();
	    myFieldset.appendSome(new classDivHtmlObject("divVocalIcon", "", strTmp));
	}*/
	/*myLabel = new classLabelHtmlObject("", "", "lblSyncPacs");
	myFieldset.appendSome(new classDivHtmlObject("attributo", "", myLabel.toString()));
	myFieldset.appendSome(new classDivHtmlObject("valore", "", getInfoSyncPacs()));*/
	/*if(logged_user.livello.equalsIgnoreCase("0"))
	{
	    myLabel = new classLabelHtmlObject("", "", "lblLoggedUser");
	    myFieldset.appendSome(new classDivHtmlObject("attributo", "", myLabel.toString()));
	    myFieldset.appendSome(new classDivHtmlObject("valore", "", getInfoLoggedUser(myContext)));
	}*/
	divUser.appendSome(myFieldset);
	return divUser;
    }

    private String getMenu(baseUser utente, classDivVerticalMenu menu) throws ImagoHttpException {
	String strWhere = "";
	String strOrder = "";
	String myDescrizione = "";
	String myCodice = "";
	String mySubDescrizione = "";
	String myLink = "";
	String mySubLink = "";
	boolean sottomenu = false;
	ArrayList lista = null;
	ArrayList myMenu = null;
	ArrayList myMenuSub = null;
	classTabVerticalMenu myVerticalMenu = null;
	classTabVerticalMenu myVerticalMenuSub = null;
	classTabVerticalMenuElement myTabElement = null;
        new structErroreControllo(false,"");

	String APPLICATIVO = null;
	try
	{
	    APPLICATIVO = this.myRequest.getParameter("applicativo");

            if(APPLICATIVO == null){
                APPLICATIVO = "GESTIONE_RICHIESTE";
            }
            this.logged_user.setFieldValue("menuonstartup", APPLICATIVO);
        this.logged_user.loadInitValue();
            new classRsUtil();
	    strOrder = " order by livello,ordine";
	    strWhere = " Where livello = 0";

	    strWhere += " and applicativo = '" + APPLICATIVO + "'";
//	    strWhere += " and applicativo = 'INVIO_RICHIESTE'";
	    strWhere = (new StringBuilder()).append(strWhere).append(" AND LINGUA='").append(utente.lingua).append("'").toString();
	    myVerticalMenu = new classTabVerticalMenu(utente, strWhere, strOrder);
	    myMenu = new ArrayList();
	    myMenuSub = new ArrayList();
	    myMenu = myVerticalMenu.getLista();
	    for(int i = 0; i < myMenu.size(); i++)
	    {
		lista = new ArrayList();
		sottomenu = false;
		myTabElement = (classTabVerticalMenuElement) myMenu.get(i);
		myDescrizione = myTabElement.descrizione;
		myCodice = myTabElement.codice;
		myLink = myTabElement.link;
		strOrder = " order by ordine";
		strWhere = " where livello= 1";

		strWhere += " and applicativo = '" + APPLICATIVO + "'";

		strWhere = (new StringBuilder()).append(strWhere).append(" AND LINGUA='").append(utente.lingua).append("'").toString();
		strWhere = (new StringBuilder()).append(strWhere).append(" and codice like '").append(myCodice).append(".%'").toString();
		myVerticalMenuSub = new classTabVerticalMenu(utente, strWhere, strOrder);
		myMenuSub = myVerticalMenuSub.getLista();
		for(int j = 0; j < myMenuSub.size(); j++)
		{
		    sottomenu = true;
		    myTabElement = (classTabVerticalMenuElement) myMenuSub.get(j);
		    mySubDescrizione = myTabElement.descrizione;
		    mySubLink = myTabElement.link;
		    if(classStringUtil.controlloPermissioni(myTabElement.permissionilivelloute, utente.livello, myTabElement.permissionibase, utente.cod_ope, myTabElement.permissionitabelle, utente.permissioni_tabelle))
			lista.add(new classDivVerticalMenuButton(mySubLink, mySubDescrizione));
		}

		if(sottomenu)
		    menu.addElements(myDescrizione, lista);
		else
		    if(classStringUtil.controlloPermissioni(myTabElement.permissionilivelloute, utente.livello, myTabElement.permissionibase, utente.cod_ope, myTabElement.permissionitabelle, utente.permissioni_tabelle))
		    {
			classDivVerticalMenuButton pulsante = new classDivVerticalMenuButton(myLink, myDescrizione);
			menu.addElement(pulsante.toString());
		    }
	    }

	}
	catch(Exception ex)
	{
	    ImagoHttpException newEx = new ImagoHttpException(ex);
	    ex.printStackTrace();
	    throw newEx;
	}
	return menu.toString();
    }

    private String creaArrayJsUtenti(ServletContext context) {
	StringBuffer sb = null;
	Field listaField[] = null;
	Field unitField = null;
	classUtenteLoggato myUtente = null;
	String strTmp = "";
	String strElementiArray = "";
	sb = new StringBuffer();
	sb.append("<SCRIPT>\n");
	for(int i = 0; i < listaUtentiLoggati.size(); i++)
	{
	    myUtente = (classUtenteLoggato) listaUtentiLoggati.get(i);
	    strTmp = "";
	    strTmp = (new StringBuilder()).append("var classUtente").append(String.valueOf(i)).append(" = new Object();\n").toString();
	    if(strElementiArray.equalsIgnoreCase(""))
		strElementiArray = (new StringBuilder()).append("classUtente").append(String.valueOf(i)).toString();
	    else
		strElementiArray = (new StringBuilder()).append(strElementiArray).append(" , classUtente").append(String.valueOf(i)).toString();
	    listaField = myUtente.getClass().getFields();
	    for(int k = 0; k < listaField.length; k++)
	    {
		unitField = listaField[k];
		String nomeField = unitField.getName();
		String valoreField = "";
		try
		{
		    valoreField = unitField.get(myUtente).toString();
		}
		catch(Exception ex1)
		{
		    ex1.printStackTrace();
		}
		strTmp = (new StringBuilder()).append(strTmp).append("classUtente").append(String.valueOf(i)).append(".").append(nomeField.toUpperCase()).append(" = '").append(classStringUtil.processReportText(valoreField)).append("';\n").toString();
	    }

	    sb.append(strTmp);
	}

	if(listaUtentiLoggati.size() < 2)
	{
	    sb.append("var listaUtentiLoggati = new Array();\n");
	    if(listaUtentiLoggati.size() == 1)
		sb.append("listaUtentiLoggati[0]=classUtente0;\n");
	}
	else
	{
	    sb.append((new StringBuilder()).append("var listaUtentiLoggati = new Array(").append(strElementiArray).append(");\n").toString());
	}
	sb.append("</SCRIPT>\n");
	return sb.toString();
    }
}
