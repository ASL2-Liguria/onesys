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
 * PulsanteStampa.java
 *
 * Created on 3 agosto 2006, 14.33
 */

package src.ListeLavoro;


import imago.http.classDivButton;
import imago.http.classFormHtmlObject;
import imago.http.classTabHeaderFooter;
import imago.http.baseClass.baseUser;

import javax.servlet.http.HttpServletRequest;

public class PulsanteStampa {
   public PulsanteStampa(baseUser logged_user,HttpServletRequest request){
    }
    /** Creates a new instance of PulsanteStampa */
    public void creaPuls(classFormHtmlObject form){
        classTabHeaderFooter footer = new classTabHeaderFooter(" ");
        footer.setClasses("classTabHeader","classTabFooterSx","classTabHeaderMiddle","classTabFooterDx");
        classDivButton button_sel = new classDivButton("", "pulsante", "javascript:creaAnteprima();","ante","");
        footer.addColumn("classButtonHeader", button_sel.toString());
        classDivButton button_close = new classDivButton("", "pulsante", "javascript:chiudi();","chiudi","");
        footer.addColumn("classButtonHeader", button_close.toString());
        classDivButton button_apri_chidi_frame = new classDivButton("", "pulsante", "javascript:apri_chiudiFrame();","chiudi_frame","");
    footer.addColumn("classButtonHeader", button_apri_chidi_frame.toString());
        form.appendSome(footer.toString());



    }

}
