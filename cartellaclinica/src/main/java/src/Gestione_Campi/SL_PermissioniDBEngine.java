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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import core.Global;
/**
 *
 * @author  fabioc
 */
public class SL_PermissioniDBEngine {
    private String Risultato="";
    /** Creates a new instance of SL_RegistraDBEngine */
    public SL_PermissioniDBEngine(HttpServletRequest myInputRequest, CLogError log) {
    HttpSession mySession = myInputRequest.getSession(false);
    baseUser logged_user = Global.getUser(mySession);
    String Scheda=myInputRequest.getParameter("Hscheda");
    String  Campo=myInputRequest.getParameter("Hcampo");
    String  Utente=myInputRequest.getParameter("Hutente");
    String  Permissione=myInputRequest.getParameter("Hperm");
    String  Azione=myInputRequest.getParameter("Hazione");
    String  Id_campo="";
    String  Id_scheda="";
    
    if (Azione.equalsIgnoreCase("mod"))
    { 
        try{
        CVW_Gest_Rel_Data risData= new CVW_Gest_Rel_Data ();
        CVW_Gest_Rel cerca= new CVW_Gest_Rel(logged_user.db.getWebConnection());
        cerca.loadData("scheda='"+Scheda+"' and campo='"+Campo+"' and utente='"+Utente+"'");
        risData=cerca.getData(0);
        if (risData==null)
        {
        cerca.loadData("(scheda='"+Scheda+"' and campo='"+Campo+"')");
        risData=cerca.getData(0);
        Id_campo=risData.m_view_Idencampo;
        Id_scheda=risData.m_view_Idenscheda;
        
        src.Gestione_Campi.CGes_campo_relazione creaRelazione = new CGes_campo_relazione (logged_user.db.getWebConnection());
        creaRelazione.executeQuery("insert into Ges_campo_relazione (utente,stato,iden_scheda,iden_campo) values('"+Utente+"',"+Permissione+","+Id_scheda+","+Id_campo+")");
        Risultato="Inserimento della permissione per utente " + Utente;
        }
        else{    
        Id_campo=risData.m_view_Idencampo;
        Id_scheda=risData.m_view_Idenscheda;
        CGes_campo_relazione aggiornaRelazione = new CGes_campo_relazione (logged_user.db.getWebConnection());
        
        aggiornaRelazione.executeQuery("update Ges_campo_relazione set utente='"+Utente+"',stato='"+Permissione+"' where iden_scheda="+Id_scheda+" and iden_campo="+Id_campo+" and (utente='' or utente=null or utente='"+Utente+"')");
        Risultato="Modifica Eseguita";}
        } catch (Exception e) {log.writeLog("Errore nell'eseguire la modifica"+ e.getMessage(),CLogError.LOG_ERROR);
        }
    }
    if (Azione.equalsIgnoreCase("canc"))
    { 
        try{
        CVW_Gest_Rel_Data risData= new CVW_Gest_Rel_Data ();
        CVW_Gest_Rel cerca= new CVW_Gest_Rel(logged_user.db.getWebConnection());
        cerca.loadData("scheda='"+Scheda+"' and campo='"+Campo+"' and utente='"+Utente+"'");
        risData=cerca.getData(0);
        if (risData==null)
        {Risultato="Relazione non presente Impossibile Cancellarla";}
        else{  
        Id_campo=risData.m_view_Idencampo;
        Id_scheda=risData.m_view_Idenscheda;
        CGes_campo_relazione aggiornaRelazione = new CGes_campo_relazione (logged_user.db.getWebConnection());
        aggiornaRelazione.executeQuery("delete from Ges_campo_relazione where iden_scheda="+Id_scheda+" and iden_campo="+Id_campo+" and  utente='"+Utente+"'");
        Risultato="Cancellazione Eseguita";}
        } catch (Exception e) {log.writeLog("Errore nell'eseguire la cancellzaione"+ e.getMessage(),CLogError.LOG_ERROR);}
    }
    
    
  }
    
 public String creaPaginaHtml(){
        return Risultato;
    }
}
