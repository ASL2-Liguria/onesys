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
 * FormNascosta.java
 *
 * Created on 14 agosto 2006, 9.51
 */

package src.Stampa_Tab;
import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classTypeInputHtmlObject;
/**
 *
 * @author  fabioc
 */
public class FormNascosta {
    
    /** Creates a new instance of FormNascosta */
    public FormNascosta() {
    }

    
    public void CreaFormNascosta (classFormHtmlObject formNascosta)   {
    try { 
    classInputHtmlObject stampaTabCDC= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"stampaReparto","","");
        formNascosta.appendSome(stampaTabCDC.toString());
    classInputHtmlObject stampaTabSel= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"stampaFunzioneStampa","","");
        formNascosta.appendSome(stampaTabSel.toString());
    classInputHtmlObject stampaTabOrdin= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"stampaTabOrdin","","");
        formNascosta.appendSome(stampaTabOrdin.toString());
    classInputHtmlObject stampaTabTipoOrdin= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"stampaTabTipoOrdin","","");
        formNascosta.appendSome(stampaTabTipoOrdin.toString());
    classInputHtmlObject stampaTabAtti= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"stampaTabAtti","","");
        formNascosta.appendSome(stampaTabAtti.toString());
    classInputHtmlObject stampaTabN_cop= new classInputHtmlObject(classTypeInputHtmlObject.typeHIDDEN,"stampaTabN_cop","","");
        formNascosta.appendSome(stampaTabN_cop.toString());
   
        }
    catch (Exception e)
        {//System.out.println(e);
                  
            }
    
}
}
