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

/**
 * User: linob
 * Date: 30/05/13
 */
public class classElaboraLetto implements IprocessDataTable {

    private imagoView.Iview infoWkRicoverati =null;
    boolean rep_appoggio=true;
    
    @Override
    public String processData(Iview interfacciaVista) {
    	infoWkRicoverati = interfacciaVista ;
        return "";
    }

    @Override
    public String processData(String oggetto) {

        return oggetto;
    }

    @Override
    public imago.http.classColDataTable processColumn(imago.http.classColDataTable oggetto) {
    	classDivHtmlObject div = new classDivHtmlObject("btnAllettamento");
    	try{   		
    		if(chkNull(infoWkRicoverati.getField("LETTO")).equalsIgnoreCase("")){
            	if (
            			chkNull(infoWkRicoverati.getField("TIPO_RICOVERO")).equalsIgnoreCase("PRE") ||
                		chkNull(infoWkRicoverati.getField("TIPO_RICOVERO")).equalsIgnoreCase("PRE-DS") ||
                		chkNull(infoWkRicoverati.getField("TIPO_RICOVERO")).equalsIgnoreCase("PRE-DH") ||
                		chkNull(infoWkRicoverati.getField("TIPO_RICOVERO")).equalsIgnoreCase("PRE-VPO") ||
                		chkNull(infoWkRicoverati.getField("CODICE_DIMISSIONE")).equalsIgnoreCase("TRS") ||
                		chkNull(infoWkRicoverati.getField ( "DIMESSO_DB" )).equals("S")||
                		!checkRepartoAppoggio()
                	)
                	{	
                		oggetto.appendSome("");
                	}else{
                		div.addAttribute("class","pulsWkRicoveratiAllettamentoLibero");
                		div.addAttribute("title","Premere per allettare");
                		oggetto.appendSome(div);
                	}
    		}else{
    			if(infoWkRicoverati.getField("LETTO_ALLERTA").equalsIgnoreCase("S")){
    				 oggetto.addAttribute("class","red");
    			}
            	oggetto.appendSome(infoWkRicoverati.getField("LETTO"));
            }

        }catch (Exception e){
            e.printStackTrace();
        }
        return oggetto;  //To change body of implemented methods use File | Settings | File Templates.
    }

    private String chkNull(String in){if(in==null)return null;else return in;}
    
    private boolean checkRepartoAppoggio(){
    	try {
			if (!chkNull(infoWkRicoverati.getField ( "REPARTO_APPOGGIO" )).equals("")){
				List filtro = Arrays.asList(infoWkRicoverati.getBaseInfo().getUser().filtro_reparti_wk.split(","));
				//se il reparto_appoggio è fra quelli che ho nel filtro della wk ritorna ture, se no ritorna false
				if (filtro.contains("'"+infoWkRicoverati.getField("REPARTO_APPOGGIO")+"'"))
					rep_appoggio=true;
				else
					rep_appoggio=false;
			}
		} catch (ImagoViewException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	return rep_appoggio;
    }
    	
}
