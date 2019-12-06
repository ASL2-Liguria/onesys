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
package FirmaDigitaleGenerica;

import imago.http.ImagoHttpException;
import imago.http.classDivButton;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classLabelHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.util.CTabForm;
import imago.util.CVarContextSession;
import imagoAldoUtil.classTabExtFiles;
import imagoUtils.classJsObject;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.Enumeration;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

public class FirmaPdfEngineGenerica {
    public HttpSession SessioneMy = null;
    public ServletContext ContextMy = null;
    public HttpServletRequest RequestMy = null;
    public ElcoLoggerImpl LogMy = null;
    public HttpServletResponse ResponseMy = null;
    public baseUser UserMy = null;
    public basePC PcMy = null;
    public baseGlobal GlobalMy = null;
    public Document DocMy = null;

    public FirmaPdfEngineGenerica(HttpSession myInputSessione,  ServletContext myInputContext, HttpServletRequest myInputRequest, HttpServletResponse myInputResponse) {
        try {
            this.ContextMy = myInputContext;
            this.RequestMy = myInputRequest;
            this.ResponseMy = myInputResponse;
            this.SessioneMy = myInputSessione;
            CVarContextSession var_cs = new CVarContextSession(this.SessioneMy, this.ContextMy);
            this.UserMy = var_cs.getBaseUser();
            this.PcMy = var_cs.getBasePC();
            this.GlobalMy = var_cs.getBaseGlobal();
        } catch (ImagoHttpException localImagoHttpException) {
        }
    }

    public void elabora() throws Exception {
        creaDocumentoHtml();
    }

    public String getHtml() {
        return this.DocMy.toString();
    }

    public void creaDocumentoHtml() throws Exception{
        this.DocMy = new Document();
        this.DocMy.setHead(addHead());
        this.DocMy.setBody(creaBody());
    }

    public Body creaBody() throws Exception{


        Body testo = new Body();
        try {
            testo.addElement(campi_hidden());
            

        } catch (ImagoHttpException e) {
            e.printStackTrace();
        }
        testo.addElement(addTopJScode());

        testo.addElement(getFormConfigurazione().toString());

        classLabelHtmlObject label_titolo = new classLabelHtmlObject("", "",    "titolo");
        classTabHeaderFooter header = new classTabHeaderFooter(label_titolo);
        classDivButton pulsanteChiudi = new classDivButton("", "pulsante","javascript:closeAnteprima();", "btChiudi", "");
        header.addColumn("classButtonHeader", pulsanteChiudi.toString());
        testo.addElement(header.toString());
        testo.setOnLoad("fillLabels(arrayLabelName,arrayLabelValue);tutto_schermo();");

        //testo.addElement(addTopJScode());
        
        testo.addElement("<SCRIPT>InizializzaFirma();</SCRIPT>");  
        testo.addElement("<form name=\'frmReturnToWk\' action=\'javascript:tornaIndietro();\' >");
        testo.addElement("<input type=\'hidden\' name=\'iden_per\' value="+this.UserMy.iden_per+">");
        testo.addElement("</input>");
        testo.addElement("<input type=\'hidden\' name=\'cod_fisc\' value="+this.UserMy.cod_fisc+">");
        testo.addElement("</input>");
        testo.addElement("</form>");
                
        return testo;
    }

    public classHeadHtmlObject addHead() {
        classHeadHtmlObject testata = new classHeadHtmlObject();
        try {

            classJsObject label_js = new classJsObject();
            String jsLabel = null;
            jsLabel = label_js.getArrayLabel(super.getClass().getName(),this.UserMy);
            testata.addElement(jsLabel);
            testata.addElement(classTabExtFiles.getIncludeString(this.UserMy.db.getWebConnection(), "", "Default", this.UserMy.lingua));
            testata.addElement(classTabExtFiles.getIncludeString(this.UserMy.db.getWebConnection(), "", super.getClass().getName(),this.UserMy.lingua));
            testata.addElement(classJsObject.javaClass2jsClass(this.UserMy) + "<script>initbaseUser();</script>");
            testata.addElement(classJsObject.javaClass2jsClass(this.PcMy) +"<script>initbasePC();</script>");
            testata.addElement(classJsObject.javaClass2jsClass(this.GlobalMy) +"<script>initbaseGlobal();</script>");
        } catch (Exception ex) {
            return null;
        }

        return testata;
    }

/* Aggiunta dei parametri presi dalla request per il salvataggio*/
    public String addTopJScode() {
        int i = 0;
        Enumeration paramNames = null;
        String ReuestVar = "";
        i = this.RequestMy.getParameterMap().size();
        if (i > 0) {
            paramNames = this.RequestMy.getParameterNames();

            while (paramNames.hasMoreElements()) {
                String parm = (String) paramNames.nextElement();
                /*if(parm.equals("xml")){
                    ReuestVar += "var xml=new ActiveXObject(\"Microsoft.XMLDOM\");\n";
                    ReuestVar += "xml.async=\"false\";\n";
                    ReuestVar += "xml.loadXML('"+ this.RequestMy.getParameter(parm) +"');\n";
                }
                  else*/
                    ReuestVar = ReuestVar + "var " + parm + " = '" +  this.RequestMy.getParameter(parm) + "'\r\n";
            }
        }

        ReuestVar = "\r\n<SCRIPT>\r\n" + ReuestVar + "</SCRIPT>\r\n";
        return ReuestVar;
    }

/* Creazione del form id_aggiorna dalla tabella IMAGOWEB.TAB_FORM*/    
    private String campi_hidden() throws ImagoHttpException {
        CTabForm tab_form = null;
        String form = "";
        try {
            tab_form = new CTabForm(this.UserMy, super.getClass().getName());
            form = tab_form.get();
        } catch (Exception e) {
            throw new ImagoHttpException(super.getClass().getName() +                    ".campi_hidden(): tipo_wk = WK_RICHIESTE --- " +                                         e.getMessage());
        }
        return form;
    }
    
    private classFormHtmlObject getFormConfigurazione() throws Exception{
        classFormHtmlObject cForm = new classFormHtmlObject("formConfigurazioneFirma","javascript:tornaIndietroBtn();","","");
        ResultSet rs;
        ResultSetMetaData rsmd;
        PreparedStatement ps;
        ps = UserMy.db.getWebConnection().prepareCall("select * from CC_CONFIGURAZIONE_FIRME where TYPE_PROCEDURE=? and REPARTO=?");
        ps.setString(1, RequestMy.getParameter("typeFirma"));
        ps.setString(2, SetReparto(RequestMy.getParameter("typeFirma")));        	
        rs = ps.executeQuery();
        if (rs.next()) {
            rsmd = rs.getMetaData();
            for (int i = 1; i <= rsmd.getColumnCount(); i++)
                cForm.appendSome(new classInputHtmlObject("hidden",rsmd.getColumnName(i), chkNull(rs.getString(rsmd.getColumnName(i)))));
        }

        cForm.appendSome(new classInputHtmlObject("hidden","webScheme", RequestMy.getScheme()));
        cForm.appendSome(new classInputHtmlObject("hidden","webServerName", RequestMy.getServerName()));
        cForm.appendSome(new classInputHtmlObject("hidden","webServerPort",String.valueOf(RequestMy.getServerPort())));
        cForm.appendSome(new classInputHtmlObject("hidden","webContextPath", RequestMy.getContextPath()));


        return cForm;
    }


    
    private String SetReparto(String funzione)
    {
    	String rep = new String("");
        /**
         * Da rendere configurabile
         */
    	if ("CONSULENZE_REFERTAZIONE".equals(funzione))
    	{/*nella refertazione di una consulenza, devo andare a considerare il reparto destinatario e non quello che esegu la consulenza*/
    		rep = RequestMy.getParameter("repartoDest");    		
    	}
    	else
    	{/*devo considerare la configurazione per il reparto che esegu la lettera*/
    		rep = RequestMy.getParameter("reparto");
    	} 
    	return rep;
    } 


    
    
    private String chkNull(String in){
        if (in==null)
            return "";
        else
            return in;
    }
}


