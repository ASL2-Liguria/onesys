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
package cartellaclinica.cartellaPaziente.Visualizzatore.sceltaValoriHtml;

import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imagoUtils.classJsObject;
import imago_jack.imago_function.obj.functionObj;

import java.sql.SQLException;

import javax.servlet.ServletContext;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import cartellaclinica.cartellaPaziente.Visualizzatore.sceltaValori.sceltaValori;

public class sceltaValoriHtml
{
	ServletContext cContext;
	 private ElcoLoggerInterface logInterface =  new ElcoLoggerImpl(sceltaValoriHtml.class);
	
    public sceltaValoriHtml(ServletContext cont)
    {
    cContext = cont;
       
    }

    public String draw(functionObj fObj, sceltaValori dati,classHeadHtmlObject cHead)
    {
        String              sRet    = new String("");
        Document            cDoc    = new Document();
        Body                cBody   = new Body();
        classFormHtmlObject cForm   = new classFormHtmlObject("scelta", "", "POST", "");
    //    cSceltaHtmlInt      cInt    = new cSceltaHtmlInt();
        sceltaValoriHtmlTestata  cTest   = new sceltaValoriHtmlTestata();
        sceltaValoriHtmlElenco   cElenco = new sceltaValoriHtmlElenco(fObj,cContext);
        sceltaValoriHtmlFoot     cFoot   = new sceltaValoriHtmlFoot();

        try
        {
    //         cDoc.setHead(cInt.draw(fObj));
              cDoc.setHead(cHead);
            cForm.appendSome(cTest.draw(dati));
            cForm.appendSome(cElenco.draw(dati));
            cForm.appendSome(cFoot.draw(dati));
            cBody.addElement(cForm.toString());
    //        cBody.addElement("\n<SCRIPT>\n\ttutto_schermo();\n\tfillLabels(arrayLabelName,arrayLabelValue);\n</SCRIPT>\n");
            
            classJsObject.setNullContextMenuEvent(cBody, fObj.bUtente);

            cDoc.setBody(cBody);
            sRet = cDoc.toString();
        }
        catch(SQLException ex)
        {
            sRet = ex.getMessage();
            logInterface.error(ex.getMessage(), ex);
        }
        catch(SqlQueryException ex)
        {
            sRet = ex.getMessage();
            logInterface.error(ex.getMessage(), ex);
        }
        catch(Exception ex)
        {
            sRet = ex.getMessage();
            logInterface.error(ex.getMessage(), ex);
        }

        return sRet;
    }
    

   
    
}
