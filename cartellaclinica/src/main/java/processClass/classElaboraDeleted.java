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
 * classElaboraDeleted.java
 *
 * Created on 16 agosto 2006, 12.29
 */

package processClass;

import imago.http.classImgHtmlObject;
import imagoView.ImagoViewException;

/**
 *
 * @author  elenad
 */
public class classElaboraDeleted implements imagoCreateWk.IprocessDataTable {
    private String cancellato = null;
    private int deleted = 0;
    /** Creates a new instance of classElaboraDeleted */
    public classElaboraDeleted() {
    }
    
    public imago.http.classColDataTable processColumn(imago.http.classColDataTable oggetto) {
        if(this.cancellato != null && this.cancellato.equalsIgnoreCase("S"))
            this.deleted = 1;
        else
            this.deleted = 0;
        
        switch (this.deleted) {
            case 0:
//                oggetto.addAttribute("class", "bianco");
                classImgHtmlObject img = new classImgHtmlObject("imagexPix/spunta.gif", "", 0);
                oggetto.addAttribute("title", "Non Cancellato");
                oggetto.appendSome(img);
                break;
            case 1:
//                oggetto.addAttribute("class", "rosso");
                classImgHtmlObject img_canc = new classImgHtmlObject("imagexPix/annulla.gif", "", 0);
                oggetto.addAttribute("title", "Cancellato");
                oggetto.appendSome(img_canc);
                break;
            default:
//              oggetto.addAttribute("class", "bianco");
                classImgHtmlObject img_def = new classImgHtmlObject("imagexPix/spunta.gif", "", 0);
                oggetto.addAttribute("title", "Non Cancellato");
                oggetto.appendSome(img_def);
                break;
        }
        return oggetto;
    }
    
    public String processData(imagoView.Iview iview) {
        try{
            cancellato = iview.getField("DELETED").toString();
        }
        catch(ImagoViewException ex) {
            this.deleted = 0 ;
        }
        return "&nbsp;";
    }
    
    public String processData(String str) {
        return "&nbsp;";
    }
    
}
