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
package cartellaclinica.esameObiettivo;

import generatoreEngine.components.html.htmlBody;
import generatoreEngine.components.html.htmlDiv;
import generatoreEngine.components.html.htmlFieldSet;
import generatoreEngine.components.html.htmlIFrame;
import generatoreEngine.components.html.htmlLegend;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import generic.servletEngine;
import generic.statements.StatementFromFile;
import generic.utility.html.Tabulatore;

import java.sql.ResultSet;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author not attributable
 * @version 1.0
 */
public class wrapper extends servletEngine{


    public wrapper(ServletContext pCont,HttpServletRequest pReq) throws Exception {
           super(pCont, pReq);
    }

    @Override
    protected String getBody(){

        htmlBody body = new htmlBody();

        try {

            Tabulatore tab= new Tabulatore("")
                            .addTab("Generico",new htmlIFrame().addAttribute("name","GENERALE"))
                            .addButton("btnStampa","Stampa")
                            .addButton("btnRegistra","Registra");


            tab.addTab("Specialistico", this.getDivSpecialistico());

            tab.appendTabulatore(body);

        } catch (Exception ex) {
            log.error(ex);
            body.setTagValue(ex.getMessage());
        }
        
        return body.generateTagHtml();

    }

    private iHtmlTagBase getDivSpecialistico() throws Exception {
        StatementFromFile sff = this.getStatementFromFile();

        iHtmlTagBase div = new htmlDiv().setId("divEsamiSpecialistici");

        ResultSet rs = sff.executeQuery("esameObiettivo.xml","getEsamiSpecialistici",new String[]{param("IDEN_RICOVERO")});
        while(rs.next()){
            div.appendChild(new htmlFieldSet()
                            .appendChild(new htmlLegend().setTagValue(rs.getString("REPARTO")))
                            .appendChild(new htmlDiv()
                                         .appendChild(
                                                 new htmlIFrame()
                                                 .addAttribute("IDEN_VISITA",rs.getString("IDEN_VISITA"))
                                                 .addAttribute("KEY_LEGAME",rs.getString("KEY_LEGAME"))
                                                 .addAttribute("SITO",rs.getString("SITO"))
                                                 .addAttribute("VERSIONE",rs.getString("VERSIONE"))
                                         )
                            )
                    );

        }

        return div;
    }

    @Override
    protected String getBottomScript() {
        return "";
    }

	@Override
	protected String getTitle() {
		return "";
	}
}
