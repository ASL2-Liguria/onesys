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
 * classElaboraDataOra.java
 *
 * Created on 16 marzo 2011, 10.00
 */

package processClass;
import imagoCreateWk.IprocessDataTable;
import imagoView.ImagoViewException;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/** @author  fra */

public class classElaboraUbicazione implements IprocessDataTable {
    private imagoView.Iview infoVista =null;
    boolean rep_appoggio=false;

    public classElaboraUbicazione() { }

    /**
     * @param args the command line arguments
     */
//    public static void main(String[] args) {
//    }

    public imago.http.classColDataTable processColumn(imago.http.classColDataTable oggetto) {

        String repartoDescr="";
        String data_dim="";
        try
        {
      /*    if(!chkNull(infoVista.getField ( "REPARTO_APPOGGIO" )).equals("")){
                strTitle = "Apri Reparto: " + infoVista.getField("REPARTO_APPOGGIO");
                oggetto.appendSome(getDivLink("Reparto: " + infoVista.getField("REPARTO_APPOGGIO"),"REPARTO",strTitle));                           
            }
            if(!chkNull(infoVista.getField ( "STANZA" )).equals("")){
                strTitle = "Apri Stanza: " + infoVista.getField("STANZA");
                oggetto.appendSome(getDivLink("Stanza: " + infoVista.getField("STANZA"),"STANZA",strTitle));
            }
            if(!chkNull(infoVista.getField ( "LETTO" )).equals("")){
                strTitle = "Apri Letto: " + infoVista.getField("LETTO");
                oggetto.appendSome(getDivLink("Letto: " + infoVista.getField("LETTO"),"LETTO",strTitle));
            }
            oggetto.addAttribute ( "title" ,strTitle) ;*/

        	if (chkNull(infoVista.getField ( "CODICE_DIMISSIONE" )).equals("TRS")){
        		oggetto.appendSome("<div title='Paziente trasferito' onClick=\"INFOTRASFERIMENTO.open('"+infoVista.getField ( "NUMERO_NOSOLOGICO")+"');\" style=\"color:blue;text-decoration:underline;cursor:hand;margin-bottom:3px;\">TRASFERITO</div>");
         	    oggetto.addAttribute("class", "grigio");       		
        	}
        	
        	//else if(chkNull(infoVista.getField ( "DIMESSO_DB" )).equals("S") && chkNull(infoVista.getField ( "VISUALIZZA_IN_WORKLIST" )).equals("S")){
        	else if(chkNull(infoVista.getField ( "DIMESSO_DB" )).equals("S")){
        		String num_gg = chkNull(infoVista.getField ( "GG_DALLA_DIMISSIONE" ));
        		
        		if (infoVista.getField ( "DATA_FINE_RICOVERO") !=null){
        		         data_dim = infoVista.getField ( "DATA_FINE_RICOVERO").substring(6, 8) + "/" 
        				+ infoVista.getField ( "DATA_FINE_RICOVERO").substring(4, 6) + "/"
        				+ infoVista.getField ( "DATA_FINE_RICOVERO").substring(0, 4);
        		}
        		oggetto.appendSome("<div title='Paziente dimesso il "+ data_dim + "' \" style=\"color:black;margin-bottom:3px;\">DIMESSO DA "+ num_gg + " GG</div>");
         	    oggetto.addAttribute("class", "grigio");
        	}
        	
        	else if(!chkNull(infoVista.getField ( "REPARTO_APPOGGIO" )).equals("")){
        		
        		
        		    String filtro_reparti = infoVista.getBaseInfo().getUser().filtro_reparti_wk;
        	        String[] arrayReparti= filtro_reparti.split(",");
        	        for (int i = 0; i < arrayReparti.length; i++) {
        	        try {
        			if(arrayReparti[i].trim().equals("'"+infoVista.getField("REPARTO_APPOGGIO")+"'")){	
        			rep_appoggio=true;
        			}
        			} catch (ImagoViewException e) {
        				e.printStackTrace();
        			} 
        	        }
        		       		
        	//Se il reparto in appoggio e' uguale a quello selezionato nei filtri significa che e' ricoverato da me ed e' in appoggio da altri	
        		if (rep_appoggio==true){
        			repartoDescr=getDescrReparto(infoVista.getField("REPARTO_APPOGGIO"));
        	   oggetto.appendSome("<div title='Paziente in appoggio in: "+repartoDescr+"' \" style=\"color:black;margin-bottom:3px;\">" + repartoDescr + "</div>");
        	   oggetto.addAttribute("class", "giallo");
        		}
        		//un mio paziente ricoverato in appoggio presso altri.
        		else{
        			repartoDescr=getDescrReparto(infoVista.getField("REPARTO_APPOGGIO"));
        		       oggetto.appendSome("<div title='Paziente in appoggio in: "+repartoDescr+"' \" style=\"color:black;margin-bottom:3px;\">" + repartoDescr + "</div>");
        		       oggetto.addAttribute("class", "verde");	
        		       
        		}
        			
        		
        		
                                       
            }	
        	
 
        }
        catch ( ImagoViewException ex )
        {
            ex.printStackTrace();
        }
        return oggetto;
    }

    public String processData(imagoView.Iview interfacciaVista) {
        /*        String  strDataOra = "";

                 try{
            infoVista = interfacciaVista ;
            strDataOra = interfacciaVista.getField("IDEN_STANZA");
                 }
                 catch(imagoView.ImagoViewException ex){
            ;
                 }
                 return formattaDataOra(strDataOra);*/
        /*String ret="";
                 try {
            infoVista = interfacciaVista ;
            ret = interfacciaVista.getField("IDEN_STANZA");
                 } catch (ImagoViewException ex) {
            ret="";
                 }finally{*/
        infoVista = interfacciaVista ;
      
     //   }
    
    
        
  /*    Statement st=null;
        ResultSet rs=null;
        
        if (filtro_reparto.equals("")){
        String login=infoVista.getBaseInfo().getUser().login;
       
        try {
        	st=infoVista.getDataConnection().createStatement();
			rs=st.executeQuery("SELECT LASTVALUECHAR FROM FILTRI WHERE TIPO='2' AND USER_NAME='"+login+"'");
		if(rs.next()){
        filtro_reparto=rs.getString("LASTVALUECHAR");
		}
        } catch (SQLException e) {
			e.printStackTrace();
		}
        finally{
        	try {
				rs.close();
				st.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
        	
        }
        }
       */

        return "";
//        }
    }
    
    public String getDescrReparto(String pCodDec){  
    	
    	 Statement st=null;
         ResultSet rs=null;
         String out = null;
         

         try {
         	st=infoVista.getDataConnection().createStatement();
 			rs=st.executeQuery("SELECT DESCR FROM CENTRI_DI_COSTO WHERE COD_CDC='"+pCodDec+"'");
 		if(rs.next()){
         out=rs.getString("DESCR");
 		}
         } catch (SQLException e) {
 			e.printStackTrace();
 		}
         finally{
         	try {
 				rs.close();
 				st.close();
 			} catch (SQLException e) {
 				e.printStackTrace();
 			}
         }
		return out;
         }
    

    public String processData(String oggetto) {
        //return formattaDataOra(oggetto);
        return oggetto;
    }


    /*private String formattaDataOra(String value){
        String  strDataOra = "";


        strDataOra = value;
        if (value.length()>7){
            strDataOra = value.substring(6,8) + "/" + value.substring(4,6) + "/" + value.substring(0,4);
            if (value.trim().length()==14)
            strDataOra = strDataOra + value.substring(8,14) ;
        }

        return strDataOra;

    }*/
    private String chkNull(String in){if(in==null)return null;else return in;}
}
