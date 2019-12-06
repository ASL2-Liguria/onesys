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
package cartellaclinica.lettera.pckInfo;

import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;
import imago.sql.SqlQueryException;
import imagoAldoUtil.classTabExtFiles;
import imago_jack.imago_function.db.functionDB;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Enumeration;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class cTestiStandard extends baseAttributeEngine implements ILetteraInfo  {

    HttpServletRequest Request;
    HttpSession Session;
    functionDB fDB;
	classFormHtmlObject cForm;
	classInputHtmlObject cInput;
	 classDivHtmlObject cDiv;

    public cTestiStandard() {}

    public void setRequest(HttpServletRequest req,HttpSession p_sess,functionDB p_fDB){
        this.Request = req;
        this.Session = p_sess;
        this.fDB = p_fDB;

    }
    public String getHtml() throws SQLException, SqlQueryException {

        String resp="";
        
        resp+=this.getForm();

        resp+="<div id=divRicerca class=ricerca>"+this.getDivRicerca()+"</div>\n";

        resp+="<div id=divRisultati class=risultati>"+this.getDivRisultati()+"</div>\n";

        resp+="<div id=divTestoEdit class=testo>"+this.getDivTestoEdit()+"</div>\n";

        resp+="<div id=divTestoShow class=testo>"+this.getDivTestoShow()+"</div>\n";

        resp+=this.getSpecificLink();

        return resp;
    }
    
    public String getHtmlPlugIn() throws SQLException, SqlQueryException {

        String resp="";
        
        resp+=this.getFormPlugIn();

        resp+="<div id=divRicerca class=ricerca>"+this.getDivRicerca()+"</div>\n";

        resp+="<div id=divRisultati class=risultati>"+this.getDivRisultati()+"</div>\n";

        resp+="<div id=divTestoEdit class=testo>"+this.getDivTestoEdit()+"</div>\n";

        resp+="<div id=divTestoShow class=testo>"+this.getDivTestoShow()+"</div>\n";

        return resp;
    }

    private String getDivRicerca(){
        String resp="";

        resp+="<div class=SubTitleSection><label  id=lblRicerca class=labelRicerca>Ricerca</label>\n";
        resp+="<input name=txtRicerca class=textRic value=\"\"/>\n";
        resp += "<input type=radio id=radioDescr name=radioRicerca /><label for=chkPersonali>Descrizione</label>\n";
        resp += "<input type=radio id=radioCod name=radioRicerca /><label for=chkReparto>Codice</label>\n</div>" +
        		"";

        resp+="<div id=divFiltroRicerca>\n";
            resp += "<input type=checkbox id=chkPersonali checked/><label for=chkPersonali>Personali</label>\n";
            resp += "<input type=checkbox id=chkReparto checked/><label for=chkReparto>Di reparto</label>\n";
            resp += "<input type=checkbox id=chkFunzione checked/><label for=chkFunzione>Di funzione</label>\n";
        resp+="</div>\n";

        return "<form name=frmRicerca>\n"+ resp+"</form>\n";
    }
    
    private String getDivRisultati(){
        String resp="";
        return resp;
    }
    
    private String getDivTestoEdit(){
        
    	String resp="";

        resp+="<span class=SubTitleSectionSTD id=lblEditTesto></span>\n";

        resp+= "<form name=frmEdit>\n";

        resp+="<div>\n";
            resp += "<span class=header>CODICE</span>";
            resp += "<input  name=txtCodiceEdit value=\"\"/>\n";
            resp += "<input type=checkbox id=chkEditPersonale checked/><label for=chkEditPersonale>Personale</label>\n";
            resp += "<input type=hidden id=hTipo value=\"\"/>\n";

        resp+="</div>\n";

        resp+="</form>\n";

        resp+="<textarea id=txtEditTestoStd rows=5></textarea>";

        return resp;
    }
    
    private String getDivTestoShow(){
        
    	String resp="";

        resp+="<span class=SubTitleSectionSTD>Visualizza</span>\n";

        resp+="<div>\n";
            resp += "<span class=header>CODICE</span>";
            resp += "<input  name=txtCodiceShow id=txtCodiceShow value=\"\"/>\n";
        resp+="</div>\n";


        resp+="<div id=txtShowTestoStd class=testoShow ></div>";

        return resp;
    }
    private String getSpecificLink() throws SqlQueryException, SQLException {
        return classTabExtFiles.getIncludeString(fDB.getConnectWeb(), "TAB_EXT_FILES", this.getClass().getName(), "");
    }
    
    
    private String getForm(){
	    
    	String resp="";
	    String key;
	    String value;
	    cForm = new classFormHtmlObject("frmExternTesti","","");
	    Enumeration en = Request.getParameterNames();
	    
	    while (en.hasMoreElements()){
	    	
	        key = (String) en.nextElement();
	        value = (String) Request.getParameter(key);
	        cInput = new classInputHtmlObject("hidden", key, value);
	        cForm.appendSome(cInput);
	    }  
	    
	    resp=cForm.toString();
	    
	    return resp;
    }  
    
    private String getFormPlugIn(){
        
    	String resp="";
        String key;
        String value;
        cForm = new classFormHtmlObject("frm","","");
        cForm.addAttribute("id", "frm");
        resp=cForm.toString();
        return resp;
    }  

    public void getDiv(String divId) throws SqlQueryException, SQLException{
	    this.cDiv.addAttribute("id", divId);	
	    this.cDiv.appendSome(this.getHtmlPlugIn());	
	}
	    
	public Object get_attribute_engine(){
	        return this.cDiv;
	}
	
	public void init(ServletContext context, HttpServletRequest request){
	    	
	        super.set_percorso_engine(PATH_ENGINE.GROUP_LAYER);
	        this.cDiv = new classDivHtmlObject("divTestiStd");
	}
	    
	public void getValueContainer(String arg0) {}
}
