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
package processClass;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;
import java.util.List;

import imago.http.classDivHtmlObject;
import imagoCreateWk.IprocessDataTable;
import imagoView.ImagoViewException;
import imagoView.Iview;
import javax.servlet.http.HttpSession;
import refertazioneConsulenze.pckObject.iRefLetObject;
import refertazioneConsulenze.pckObject.pckObjectXml;

/**
 * User: linob
 * Date: 30/05/13
 */
public class classElaboraRefertoVisitaAn implements IprocessDataTable {

    private imagoView.Iview infoWkRefertoPrecSez =null;
    boolean rep_appoggio=true;
    HttpSession session = null;
    
    @Override
    public String processData(Iview interfacciaVista) {
    	infoWkRefertoPrecSez = interfacciaVista ;
        session = infoWkRefertoPrecSez.getBaseInfo().getSessione();  
        return "";
    }

    @Override
    public String processData(String oggetto) {

        return oggetto;
    }

    @Override
    public imago.http.classColDataTable processColumn(imago.http.classColDataTable oggetto) {
        iRefLetObject pcx = null;
    	try{   		
    		if("0".equalsIgnoreCase(chkNull(infoWkRefertoPrecSez.getField("NUMERORIGHE")))){
                pcx = new pckObjectXml(session,infoWkRefertoPrecSez.getField("TESTO_HTML"),infoWkRefertoPrecSez.getField("ID_ELEMENTO"),infoWkRefertoPrecSez.getField("LABELAREA"),infoWkRefertoPrecSez.getField("ORDINAMENTO"));
                oggetto.appendSome(pcx.toHtml(infoWkRefertoPrecSez.getField("TESTO_HTML")));
                        }else{
            	oggetto.appendSome(infoWkRefertoPrecSez.getField("TESTO_HTML"));
            }

        }catch (Exception e){
            e.printStackTrace();
        }
        return oggetto;  //To change body of implemented methods use File | Settings | File Templates.
    }

    private String chkNull(String in){if(in==null)return null;else return in;}
    	
}
