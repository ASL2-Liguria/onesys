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
 * SL_PermissioniDBEngine.java
 *
 * Created on 13 settembre 2006, 14.10
 */

package src.Gestione_Campi;
import imago.a_sql.CLogError;
import imago.http.baseClass.baseUser;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import core.Global;
/**
 *
 * @author  fabioc
 */
public class SL_AssociaDBEngine {
    private String Risultato="";
    /** Creates a new instance of SL_RegistraDBEngine */
    public SL_AssociaDBEngine(HttpServletRequest myInputRequest,CLogError log) {
    
    HttpSession mySession = myInputRequest.getSession(false);
    String newstr_campi_new=new String("");
    baseUser logged_user = Global.getUser(mySession);
    String str_campi=myInputRequest.getParameter("Hstr_campi");
    String  str_utenti=myInputRequest.getParameter("Hstr_utenti");
    String  str_scheda=myInputRequest.getParameter("Hstr_scheda");
    String  str_stato=myInputRequest.getParameter("Hstr_stato");
    String[][] da_verificare = new String[20][2];
    try{
        
    	newstr_campi_new=str_campi;
    	newstr_campi_new=newstr_campi_new.replace("[*]", "','");
    	CGes_campo_relazione relazio_gia = new CGes_campo_relazione(logged_user.db.getWebConnection());
        relazio_gia.loadData("iden_scheda="+str_scheda+" and iden_campo in ('"+newstr_campi_new+"')");
        CGes_campo_relazione_Data gia_presenti= new CGes_campo_relazione_Data ();
        ArrayList ArrGia=relazio_gia.getData();
        String [] ArrCampi=str_campi.split("[*]");
        int numCampi=ArrCampi.length;
        String [] ArrUte=str_utenti.split("[*]");
         boolean controllo=true;
        int numUte=ArrUte.length;
        for(int i=0; i<numCampi;i++)
        {for(int a=0; a<numUte;a++)
         {for(int b=0; b<ArrGia.size();b++)
          { gia_presenti=(CGes_campo_relazione_Data)ArrGia.get(a);
           controllo=true;  
          if (gia_presenti.m_idenCampo==Integer.parseInt(ArrCampi[i]))
               {if(gia_presenti.m_utente.equalsIgnoreCase(ArrUte[a]))
                     {da_verificare[a][0]=ArrCampi[i].toString();
                       da_verificare[a][1]=ArrUte[a];
                    controllo=false;}}}
           if (controllo)
           {CGes_campo_relazione inserimento = new CGes_campo_relazione(logged_user.db.getWebConnection());
               inserimento.executeQuery("insert into ges_campo_relazione (iden_campo,iden_scheda,utente,stato) values("+ArrCampi[i]+","+str_scheda+",'"+ArrUte[a]+"','"+str_stato+"')");
           }  
        }
        }
    
    } catch (Exception e) {
    log.writeLog("Errore nell'inserimento di una nuova relazione"+ e.getMessage(),CLogError.LOG_ERROR);}
    
   
    
  }
    
 public String creaPaginaHtml(){
        return Risultato;
    }
}
