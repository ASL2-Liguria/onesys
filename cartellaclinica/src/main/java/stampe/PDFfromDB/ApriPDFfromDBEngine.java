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
package stampe.PDFfromDB;

import imago.http.classDivButton;
import imago.http.classHeadHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;
import imagoAldoUtil.classTabExtFiles;
import imago_jack.imago_function.obj.functionObj;

import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import core.Global;
public class ApriPDFfromDBEngine extends functionObj
{
	private baseUser logged_user= null;
	private String iden_vers	= new String("");
	private String AbsPath		= new String("");
	private String db			= new String("");
	private String idenVisita 	= new String("");
	public  String request 		= new String("");
	private String funzione		= new String("");
	private String progr		= new String("");
	private String ServletName	= "ServleTReadPDF?db=&iden=";
	private String ServletNamePo= "ServleTReadPDF?iden=";
	private String ServletNamePT= "";
	

	public ApriPDFfromDBEngine(ServletContext cont, HttpServletRequest req,HttpSession sess) 
	{
		super(cont, req, sess);
		this.logged_user = Global.getUser(sess);
	}

	public ApriPDFfromDBEngine(ServletContext cont, HttpServletRequest req)
	{
		this(cont, req, req.getSession(false));
		//prelevo il percorso per andare ad utilizzare la servletReadPDF
		/*request = "http://" + req.getServerName();
		request += ":" + req.getServerPort();
		request +=  req.getContextPath();
		request += "/ServleTReadPDF?iden=" + req.getParameter("iden_versione");*/
	}

	private void readDati()throws SqlQueryException,SQLException
	{
		this.idenVisita = this.cParam.getParam("idenVisita").trim();
		this.iden_vers 	= this.cParam.getParam("idenVersione").trim();
		if ("".equalsIgnoreCase(this.cParam.getParam("AbsolutePath").trim())){
			this.AbsPath = Global.getBaseUrl();			
		}else{
			this.AbsPath = this.cParam.getParam("AbsolutePath").trim();
		}
		this.db	= this.cParam.getParam("db").trim();
		/* campi per la firma piano terapeutico*/
		this.funzione	= this.cParam.getParam("funzione").trim();
		this.progr		= this.cParam.getParam("progr").trim();
		this.ServletNamePT= "ServleTReadPDF?db=&iden="+this.iden_vers+"&funzione="+this.funzione+"&progressivo="+this.progr;
		this.ServletNamePo= "/SERVLETreadFromDB?iden="+this.iden_vers+"&progr="+this.progr;
	}


	public String gestione() 
	{
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();
		new classTabExtFiles();

		try 
		{
			this.readDati();
			if (!this.db.equals("POLARIS"))
				if (!"PIANO_TERAPEUTICO".equals(this.funzione)){
						if ("".equalsIgnoreCase(this.funzione)){
							this.request= this.AbsPath + ServletName + this.iden_vers;							
						}else{
							this.request= this.AbsPath + ServletName + this.iden_vers + "&funzione="+this.funzione;
						}
					}
				else{
					this.request= this.AbsPath + ServletNamePT;
				}
			else{
				this.request	= this.AbsPath + this.ServletNamePo;
			}
				
		}
		catch (SqlQueryException ex) 
		{
			sOut = ex.getMessage();
			this.request = "noRef"+"\n"+ex.getMessage();
		}
		catch (SQLException ex)
		{
			sOut = ex.getMessage();
			this.request = "noRef"+"\n"+ex.getMessage();
		}
		try
		{	
			cDoc.appendHead(this.createHead());
			
			classTabHeaderFooter HeadSection = new classTabHeaderFooter ("Lettera");
			HeadSection.addColumn("classButtonHeader", new classDivButton("Chiudi", "pulsante", "javascript:self.close();", "C", "").toString());

			cBody.addElement (HeadSection.toString());
			cBody.addElement("<script type=\"text/javascript\">initMainObject('"+request+"');</script>");

			cDoc.setBody(cBody);
			sOut = cDoc.toString();
		}
		catch (SqlQueryException ex)
		{
			sOut = ex.getMessage();
		}
		catch (SQLException ex)
		{
			sOut = ex.getMessage();
		}
		return sOut;
	}


	private classHeadHtmlObject createHead()  throws SQLException, SqlQueryException 
	{
		classHeadHtmlObject cHead = new classHeadHtmlObject();
    	cHead.addElement(classTabExtFiles.getIncludeString(this.logged_user, "", this.getClass().getName(), this.sContxt));
    	return cHead;
	}

}