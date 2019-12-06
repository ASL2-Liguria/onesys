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
 * SL_Group.java
 *
 * Created on 8 giugno 2005, 15.55
 */

package GestioneGruppi;

import imago.a_sql.CDataBaseIX;
import imago.a_sql.CFieldType;
import imago.a_sql.CLogError;
import imago.a_sql.CWeb;
import imago.a_sql.ISQLException;
import imago.a_util.CClientParam;
import imago.a_util.CContextParam;
import imago.a_util.CUtility;
import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;
import imago.util.CVarContextSession;
import imago.winbuild.CSessionError;
import imagoUtils.classJsObject;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.ecs.html.Body;
import org.apache.ecs.html.Head;
import org.apache.ecs.html.Html;

/**
 *
 * @author  MAZZORAN Andrea
 * @version 1.0.0.1
 */
public class SL_Group extends HttpServlet {
    private ServletContext context = null;
    private HttpSession session = null;
    private CLogError f_log = null;

    /** Initializes the servlet.
     */
    public void init(ServletConfig config) throws ServletException {
	super.init(config);
	context = config.getServletContext();

    }

    /** Destroys the servlet.
     */
    public void destroy() {

    }

    private baseUser getVarContextSession() {
	CVarContextSession var_cs = new CVarContextSession(this.session, this.context);
	return(var_cs.getBaseUser());
    }

    /** Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	int T = 0;
	response.setContentType("text/html");
	PrintWriter out = response.getWriter();
	CClientParam cliParam = new CClientParam(request);
	CContextParam cp = new CContextParam(this);
	boolean bCheckBoxAttivo = false;
	String strButton = new String("");
	String strSearch = new String("");
	String strIden = new String("");
	String strIdenGroup = new String("");
	String strWhere = new String("");
	CGroupWin finGruppo = null;
	Head head = new Head();
	Body body = new Body();
	Html html = new Html();

	this.session = request.getSession(false);
	if(this.session != null)
	{
	    baseUser logged_user = this.getVarContextSession();

	    strButton = cliParam.getParam(CGroupWin.INPUTBUTTON);
	    strIden = cliParam.getParam(CGroupWin.INPUTIDEN);
	    strIdenGroup = cliParam.getParam(CGroupWin.INPUTIDENGROUP);
	    strSearch = cliParam.getParam(CGroupWin.TXTGROUPNAME);
	    if(cliParam.getParam("attivo").compareTo("S") == 0)
		bCheckBoxAttivo = true;
	    else
		bCheckBoxAttivo = false;
	    try
	    {
		CDataBaseIX dbx = new CDataBaseIX(logged_user, Integer.parseInt(cp.getParam("TIPODB")));
		dbx.connect();
		//Impostazione Log
		this.f_log = new CLogError(dbx.m_dbWeb.getConnection(), request, "SL_Group", logged_user.login);
		this.f_log.setClassName("imago.GesUtilita.gesUtenti.SL_Group");
		this.f_log.setFileName("SL_Group.java");

		this.f_log.writeLog("Inizio della costruzione della pagina HTML per SL_Group", CLogError.LOG_DEBUG);
		this.f_log.writeLog("DataUser[" + (cp.getParam("DataUser") == null ? "<null>" : cp.getParam("DataUser")) + "], DataPwd[" + (cp.getParam("DataPwd") == null ? "<null>" : cp.getParam("DataPwd")) + "], WebUser["
				    + (cp.getParam("WebUser") == null ? "<null>" : cp.getParam("WebUser")) + "], WebPwd[" + (cp.getParam("WebPwd") == null ? "<null>" : cp.getParam("WebPwd")) + "]", CLogError.LOG_DEBUG);

		CUtility.datiFormLog("SL_Group", request, this.f_log);

		finGruppo = new CGroupWin(this.f_log);

		if(strButton != null)
		{
		    if(strButton.trim().compareTo(CGroupWin.BTN_GROUPCLOSE) == 0)
		    {
			finGruppo.buildHTML(head, body, logged_user, "", dbx.m_dbWeb, bCheckBoxAttivo);
		    }
		    else
			if(strButton.trim().compareTo(CGroupWin.BTN_GROUPSAVE) == 0)
			{
			    CWeb webTable = new CWeb(dbx.m_dbWeb);
			    CFieldType fT = new CFieldType();
			    ArrayList webData = new ArrayList();
			    String[] idenSel = new String[CGroupWin.MAXNUMUTENTIINGRUPPO];

			    fT.setFieldName("IDEN_GROUP");
			    fT.setFieldType(CFieldType.TYPE_NUMERIC);
			    fT.setValue("-1");
			    webData.add(fT);

			    //Eliminazione di tutti gli utenti del gruppo
			    strWhere = "IDEN_GROUP=" + strIdenGroup;
			    try
			    {
				webTable.updateData(webData, strWhere);
			    }
			    catch(ISQLException e)
			    {
				e.printStackTrace();
				this.f_log.writeLog("GestioneGruppi.SL_Group.processRequest():update web " + e.getMessage());
			    }

			    //Inserimento degli utenti selezionati nel gruppo
			    strWhere = "";
			    idenSel = CUtility.compactStr(strIden, '*', CGroupWin.MAXNUMUTENTIINGRUPPO);
			    T = 0;
			    while(idenSel[T] != null)
			    {
				if(strWhere.compareTo("") != 0)
				{
				    strWhere = strWhere.concat(" OR ");
				}
				strWhere = strWhere.concat("IDEN=" + idenSel[T]);
				T++;
			    }

			    webData.clear();
			    fT.setFieldName("IDEN_GROUP");
			    fT.setFieldType(CFieldType.TYPE_NUMERIC);
			    fT.setValue(strIdenGroup);
			    webData.add(fT);
			    try
			    {
				webTable.updateData(webData, strWhere);
			    }
			    catch(ISQLException e)
			    {
				e.printStackTrace();
				this.f_log.writeLog("GestioneGruppi.SL_Group.processRequest():2 update web " + e.getMessage());
			    }

			    finGruppo.buildHTML(head, body, logged_user, strSearch, dbx.m_dbWeb, bCheckBoxAttivo);
			}
			else
			    if(strButton.trim().compareTo(CGroupWin.BTN_GROUPSEARCH) == 0)
			    {
				finGruppo.buildHTML(head, body, logged_user, strSearch, dbx.m_dbWeb, bCheckBoxAttivo);
			    }
			    else
			    {
				finGruppo.buildHTML(head, body, logged_user, "", dbx.m_dbWeb, bCheckBoxAttivo);
			    }
		}
		else
		{
		    finGruppo.buildHTML(head, body, logged_user, "", dbx.m_dbWeb, bCheckBoxAttivo);
		}
	    }
	    catch(SqlQueryException e)
	    {
		e.printStackTrace();
		this.f_log.writeError("GestioneGruppi.SL_Group.processRequest: buildHTML " + e.getMessage());
	    }

	    html.addElement(head);

	    // disattivo pulsante destro
	    try
	    {
		classJsObject.setNullContextMenuEvent(body, logged_user);
	    }
	    catch(Exception e)
	    {
		e.printStackTrace();
		this.f_log.writeError("GestioneGruppi.SL_Group.processRequest:setNullContextMenuEvent " + e.getMessage());
	    }
	    html.addElement(body);
	    out.println(html.toString());
	}
	else
	{
	    out.println(CSessionError.buildHTML());
	}
	out.close();
    }

    /** Handles the HTTP <code>GET</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	processRequest(request, response);
    }

    /** Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	processRequest(request, response);
    }

    /** Returns a short description of the servlet.
     */
    public String getServletInfo() {
	return "Short description";
    }

}
