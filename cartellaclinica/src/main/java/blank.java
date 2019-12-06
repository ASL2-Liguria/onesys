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
 * blank.java
 *
 * Created on 12 aprile 2005, 17.15
 */

import imago.http.classHeadHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.baseClass.baseUser;
import imagoAldoUtil.classTabExtFiles;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import core.Global;
/**
 *
 * @author  aldog
 * @version
 */
public class blank extends HttpServlet {

    private HttpSession         session = null;
    private ServletConfig       sConfig = null;
    private ServletContext      context = null;

    /** Initializes the servlet.
     */
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        sConfig = config;
        context = sConfig.getServletContext();
    }

    /** Destroys the servlet.
     */
    public void destroy() {
        // distruggo oggetti per connessione al DB
    }


    protected void doElabora(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        session = request.getSession(false);
        creaPaginaHtml(out);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException{
        doElabora(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException{
        doElabora(request, response);
    }

    private void creaPaginaHtml(PrintWriter out){

        classHeadHtmlObject         testata = null;
        classMetaHtmlObject         MetaTag = null;
        Document                    doc = null;
        Body                        corpoHtml = null;
        baseUser                    logged_user=null;

        doc = new Document();
        doc.setDoctype(new Doctype.Html40Transitional());
        // Definisco Title del documento
        Title titolo = new Title(" ");
        doc.setTitle(titolo);
        // definisco Head
        testata = new classHeadHtmlObject();
        // ********** includo i files ********
        try{
            if (this.session!=null){
		logged_user = Global.getUser(session);
		if ( logged_user != null )
		{
		    testata.addElement ( classTabExtFiles.getIncludeString (
			    logged_user , "" , this.getClass ().getName () ,
			    this.context ) ) ;
		}
	    }
	}
        catch(java.lang.Exception ex){
            ex.printStackTrace();
        }
        //*****
        // creo tag Meta
        MetaTag = new classMetaHtmlObject();
        // appendo Meta all'Head
        testata.addElement(MetaTag);
        // attacco Head al documento
        doc.setHead(testata);
        // definisco body
        corpoHtml = new Body();
        // appendo corpo al documento
        doc.setBody(corpoHtml);
        out.println(doc.toString());
    }
}
