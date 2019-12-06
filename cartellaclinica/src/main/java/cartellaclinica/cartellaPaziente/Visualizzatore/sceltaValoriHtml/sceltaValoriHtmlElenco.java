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

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.html.functionHTML;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletContext;

import plugin.getPoolConnection;
import cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocumentLab.listDocumentLabEngine;
import cartellaclinica.cartellaPaziente.Visualizzatore.sceltaValori.sceltaValori;

public class sceltaValoriHtmlElenco extends functionHTML
{
    private functionObj fObj = null;
    private functionDB  fDB  = null;
    private functionStr fStr = null;
    Connection conn;
    ServletContext cContext;
    private ElcoLoggerInterface logInterface =  new ElcoLoggerImpl(listDocumentLabEngine.class);
    sceltaValori dati=null;
    getPoolConnection myPoolConnection = null;
    

    public sceltaValoriHtmlElenco(functionObj fo,ServletContext cont)
    {
        super();
        this.fObj = fo;
        this.fDB = new functionDB(fo);
        this.fStr = new functionStr();
        cContext = cont;
    }

    public String draw(sceltaValori datiIn) throws SqlQueryException, SQLException
    {
    	
    	dati=datiIn;
    	String resp= new String("");
    	
    	ResultSet rsIn   = null;
     
        if(dati.tipo.equalsIgnoreCase("filtroReparto")){
        try{	
        rsIn = fDB.openRs(dati.sql);
        resp =creaTabella(rsIn);
        }
        catch (Exception e) {	    	
	   logInterface.error(e.getMessage(), e); 	 
	       }	          
	        finally{	 
	   fDB.close(rsIn);
	   rsIn=null;
	        }
        }
	   
        else if (dati.tipo.equalsIgnoreCase("filtroTipDoc")){
        	
        	Statement stm = null;
        	
        	try{
	//		conn= new Connessione().getConnection(cContext);
        		 myPoolConnection=new getPoolConnection(cContext.getInitParameter("RegistryPoolName"),cContext.getInitParameter("RegistryUser"),cContext.getInitParameter("RegistryPwd"),cContext.getInitParameter("CryptType"));
 		      	conn= myPoolConnection.getConnection();
		
    	    stm = conn.prepareStatement("select", ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
    	    rsIn = stm.executeQuery(dati.sql);	
    	    resp = creaTabella(rsIn);
        	}
        	
        	catch (Exception e) {	    		
    			logInterface.error(e.getMessage(), e);
    		}
	          
	        finally{
	        	 try {
	    		
	    	//	new Connessione().chiudi(conn,cContext);
	        		 myPoolConnection.chiudi(conn);
	    		} catch (Exception e) {
	    		
	    			logInterface.error(e.getMessage(), e);
	    		}
	        	 
	        }  
      	
        }

        return resp;
      
    }
    

    public String creaTabella(ResultSet rs) throws SQLException{ 
    	
    	 String    sRet = new String("");
         int       i;
         int       r;
         
         this.init_table();
         this.init_riga();
         i = 1;
         r = 0;

         while(rs.next())
         {
     
        this.creaColonnaCheck("check_value", this.fStr.verifica_dato(rs.getString(1)), this.fStr.verifica_dato(rs.getString(2)), "", (dati.valore_check.indexOf("'" + this.fStr.verifica_dato(rs.getString(1)) + "'") >= 0));

      
             if(i >= dati.colonne)
             {
                 this.aggiungiRiga();
                 this.init_riga();
                 i=0;
                 r++;
             }
             i++;
         }
         if(i <= dati.colonne)
         {
             for(;i <= dati.colonne && r>0; i++)
             {
                 this.creaColonnaViewField("", "");
             }
             this.aggiungiRiga();
             this.init_riga();
             r++;
         }
         

         sRet = this.getTable().toString();
         
         return sRet;
    }
    
    
    
    
    
    
    
    
}
