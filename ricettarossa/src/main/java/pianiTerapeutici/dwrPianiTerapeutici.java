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
package pianiTerapeutici;

import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import it.elco.ricerca.PT_RicercaRemota;

import java.sql.Connection;
import java.util.HashMap;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

public class dwrPianiTerapeutici {


    Connection conn = null;
    baseUser User=null;
    private HttpSession Sess = null;
    private Connection connD = null;
    private ElcoLoggerInterface log=new ElcoLoggerImpl(this.getClass());

  

    public dwrPianiTerapeutici() throws SqlQueryException {
        init();
    }


    private void init() throws SqlQueryException {
        Sess = WebContextFactory.get().getSession();
        User = (baseUser) Sess.getAttribute("login");
        connD = User.db.getDataConnection();
    }

    public String[] getPT(String tipoRic, String[] param){
		String resp[]= new String[2];
        resp[0]="OK";
        resp[1]=this.Sess.getId();
        Class classe = null;
        try{
      	PT_RicercaRemota obj= new PT_RicercaRemota();
      	obj.setConnections(connD);
      	 obj.setUserSession(this.Sess.getId());
        if (tipoRic.equals("ricercaPerCodFiscAssData")){
        resp[1]=obj.ricercaPerCodFiscAssData(param[0],param[1],param[2]);	
        }
        else if (tipoRic.equals("ricercaPerCodFiscAss")){
        resp[1]=obj.ricercaPerCodFiscAss(param[0]);	
            }
        else if(tipoRic.equals("ricercaPerCodFiscPrescr")){
        resp[1]=obj.ricercaPerCodFiscPrescr(param[0]);	
        }
        else if(tipoRic.equals("ricercaPerNomCogn")){
        resp[1]=obj.ricercaPerNomCogn(param[0],param[1]);	
        }
        else if(tipoRic.equals("ricercaPerNumSAL")){
        resp[1]=obj.ricercaPerNumSAL(param[0]);
        }
        else if(tipoRic.equals("ricercaPerIdPT")){
        resp[1]=obj.ricercaPerIdPT(param[0]);
        }
        else{
        resp[0]="KO";	
        }
        
        if (resp[1].equals("0")){
        resp[0]="0";
        resp[1]=this.Sess.getId();
        }
      
      	
        	
        }catch(Exception e){
        	System.out.println(e);
        	log.error(e);
            resp[0]="KO";
        }

        return resp;

    }
    
   /* public String[] getPT(String[] arCampi,String[] arValori){
    	String resp[]= new String[2];
    	HashMap mapFiltri =new HashMap();
        resp[0]="OK";
        resp[1]=this.Sess.getId();
        Class classe = null;
        
        for(int i = 0;i< arCampi.length; i++){
        mapFiltri.put(arCampi[i],arValori[i]);
        }
    	
        try{
          	PT_RicercaRemota obj= new PT_RicercaRemota();
          	obj.setConnections(connD);
          	obj.setUserSession(this.Sess.getId());
            
//          	resp[1]=obj.ricercaTotale(mapFiltri);
            
            if (resp[1].equals("0")){
            resp[0]="0";
            resp[1]=this.Sess.getId();
            }
            	
            }catch(Exception e){
            	System.out.println(e);
            	log.error(e);
                resp[0]="KO";
            }

            return resp;
    	
    }*/
    
    public void cancellaMetadati(){
    	try{
    		PT_RicercaRemota obj= new PT_RicercaRemota();
    		obj.setConnections(connD);
    		obj.setUserSession(this.Sess.getId());
    		obj.RimuoviDati();

    	}catch(Exception e){
    		log.error(e);

    	}

    }
    

   
}
