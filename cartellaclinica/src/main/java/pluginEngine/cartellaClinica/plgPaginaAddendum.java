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
    File: plgListaAttivita.java
    Autore: Jack
*/

package pluginEngine.cartellaClinica;

import generatoreEngine.components.html.htmlDiv;
import generatoreEngine.html.engine_html.components.htmlTable;
import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import generic.statements.StatementFromFile;
import imago.http.classDivHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago.sql.Utils;
import imago_jack.imago_function.config.functionConfig;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;
import java.sql.PreparedStatement;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class plgPaginaAddendum extends baseAttributeEngine
{
	   
	 private classDivHtmlObject cDiv     = null;
    private ServletContext     contxt  = null;
    private HttpServletRequest req     = null;
    private functionObj        fObj    = null;
    private functionStr        fStr    = null;
    private functionDB         fDB     = null;
    private functionConfig     fCfg    = null;
    public ElcoLoggerInterface log = new ElcoLoggerImpl(this.getClass());
    String sOut;

    public plgPaginaAddendum()
    {
        super();
        super.set_percorso_engine(PATH_ENGINE.DIV);
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        this.contxt  = context;
        this.req     = request;
        this.fObj    = new functionObj(this.contxt, this.req);
        this.fStr    = new functionStr();
        this.fDB     = new functionDB(this.fObj);
        this.fCfg    = new functionConfig(this.fObj);
        this.cDiv     = new classDivHtmlObject();
        
        super.set_percorso_engine(PATH_ENGINE.GROUP_LAYER);
       
    }

    public Object get_attribute_engine()
    {
    return cDiv;
    }

    public void getValueContainer(String nome)
    {
    }

    public void draw(String pagina, String idenRif)
    {
    	sOut = new String("");
		String oldCampo="";
		StatementFromFile sff=null;
		
		try {
			
			sff= new StatementFromFile(this.fDB.getSession());
			ResultSet rs= sff.executeQuery("paginaAddendum.xml","getDati",new String[]{pagina,idenRif,pagina});
	
			while (rs.next())
			{
			if(oldCampo.equals("") || !rs.getString("CAMPO").equals(oldCampo)){
				if(!oldCampo.equals("")){
					sOut+="</TABLE>";
				}
				sOut+="<DIV class=\"divLabel\" id=\"div"+rs.getString("CAMPO")+"\">"+chkNull(rs.getString("LABEL_CAMPO"))+"</DIV>";
				sOut+="<TABLE class=classDataEntryTable>";
			}
			
			sOut+="<TR iden=\""+chkNull(rs.getString("IDEN"))+"\"  uteIns=\""+chkNull(rs.getString("UTE_INS"))+"\">";
			sOut+="<TD class=classTdLabel><LABEL name=\"lblElimina\" class=\"butt_elimina\">Elimina</LABEL></TD>";
			sOut+="<TD class=classTdField><TEXTAREA style=\"WIDTH: 100%\" id=\""+chkNull(rs.getString("CAMPO"))+"0"+chkNull(rs.getString("PROGR"))+"\" name=\""+chkNull(rs.getString("CAMPO"))+"0"+chkNull(rs.getString("PROGR"))+"\">"+chkNull(rs.getString("VALORE"))+"</TEXTAREA></TD>";
			sOut+="<TD class=classTdLabel><LABEL name=\"lblUteIns\">Utente inserimento: "+chkNull(rs.getString("UTE_INS_DESCR"))+"</LABEL></TD>";
			sOut+="<TD class=classTdLabel><LABEL name=\"lblDataIns\">Data inserimento: "+chkNull(rs.getString("DATA_INS"))+"</LABEL></TD>";
			sOut+="</TR>";
			oldCampo=rs.getString("CAMPO");
			}
			sOut+="</TABLE>";

								
		} catch (Exception ex) {
			log.error(ex);
			sOut = ex.getMessage();
		}
		finally{
			sff.close();
		}
		
		this.cDiv.appendSome(sOut);
    
    
    }

	 protected final String chkNull(String in){return(in==null? "":in);}
}
