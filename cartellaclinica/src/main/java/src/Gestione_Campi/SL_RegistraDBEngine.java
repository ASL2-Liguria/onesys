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
 * SL_RegistraDBEngine.java
 *
 * Created on 12 settembre 2006, 16.01
 */

package src.Gestione_Campi;
import imago.a_sql.CLogError;
import imago.http.baseClass.baseUser;

import javax.servlet.http.HttpServletRequest;

import core.Global;
/**
 *
 * @author  fabioc
 */
public class SL_RegistraDBEngine {
    private String Risultato="";
    /** Creates a new instance of SL_RegistraDBEngine */
    public SL_RegistraDBEngine(HttpServletRequest myInputRequest, CLogError log) {
    String Imposta=myInputRequest.getParameter("HImposta");
    baseUser LoggedUser=null;
    LoggedUser=Global.getUser(myInputRequest.getSession());
    String qy="";
   
    if (Imposta.equalsIgnoreCase("AggiungiCampo"))
    {
        try{
        String Campo= myInputRequest.getParameter("HCampo").trim();
        String Campo_c= myInputRequest.getParameter("HCampocheck").trim();
        String Valore= myInputRequest.getParameter("HValore").trim();
        String Descrizone= myInputRequest.getParameter("HDescrizione").trim();
        qy="insert into Ges_campo_dettaglio (campo,campo_check,descrizione,valore) values ('"+Campo+"','"+Campo_c+"','"+Descrizone+"','"+Valore+"')";
        //System.out.println(qy);
        CGes_campo_dettaglio esecu=new CGes_campo_dettaglio(LoggedUser.db.getWebConnection());
        esecu.executeQuery(qy);
        Risultato="Inserimento Eseguito";
        }
        catch (Exception e) {log.writeLog("Errore eseguendo l'inserimento di un campo"+e.getMessage(),CLogError.LOG_ERROR);} 
    }
     
    if (Imposta.equalsIgnoreCase("ModificaCampo"))
    {   try{
        String Condizione="s";
        String wherecondition="";
        String Campo= myInputRequest.getParameter("HCampo").trim();
        if (Campo==null) 
        { Condizione="n";
            wherecondition="";}
        else 
        {wherecondition="where campo='"+Campo+"' ";
        }
        String Campo_c= myInputRequest.getParameter("HCampocheck").trim();
         if (Campo_c==null || Campo_c.equalsIgnoreCase(""))
        {   Campo_c="";}
        String Valore= myInputRequest.getParameter("HValore").trim();
         if (Valore==null || Valore.equalsIgnoreCase(""))
        {   Valore="";}
        String Descrizone= myInputRequest.getParameter("HDescrizione").trim();
        if (Descrizone==null || Descrizone.equalsIgnoreCase(""))
        {   Descrizone="";}
        if (Condizione.equalsIgnoreCase("s"))
        {qy="update Ges_campo_dettaglio set campo='"+Campo+"',campo_check='"+Campo_c+"',descrizione='"+Descrizone+"',valore='"+Valore+"' "+wherecondition;}
        
        //System.out.println(qy);
        CGes_campo_dettaglio esecu=new CGes_campo_dettaglio(LoggedUser.db.getWebConnection());
        esecu.executeQuery(qy);
        Risultato="Update Eseguito";
        } catch (Exception e) {log.writeLog("Errore eseguendo l'update di un campo"+e.getMessage(),CLogError.LOG_ERROR);}
    }
    if (Imposta.equalsIgnoreCase("CancellaCampo"))
    {
        try{
        String Campo= myInputRequest.getParameter("HScheda").trim();
        qy="delete from Ges_campo_dettaglio where campo='"+Campo+"'";
        //System.out.println(qy);
        CVW_Gest_Rel prova= new CVW_Gest_Rel(LoggedUser.db.getWebConnection());
        prova.loadData(" campo='"+Campo+"'");
        if (!prova.getData().isEmpty())
            Risultato ="Impossibile eseguire il cancellamento il campo è ancora associato a qualche scheda";
        else{
        CGes_campo_dettaglio esecu=new CGes_campo_dettaglio(LoggedUser.db.getWebConnection());
        esecu.executeQuery(qy);
        Risultato="Cancellazione Eseguita";}
        }
        catch (Exception e) {log.writeLog("Errore eseguendo la cancellazione di un campo"+e.getMessage(),CLogError.LOG_ERROR);} 
    }
     if (Imposta.equalsIgnoreCase("AggiungiScheda"))
    {
        try{
        String Scheda= myInputRequest.getParameter("HScheda").trim();
        String Descrizone= myInputRequest.getParameter("HDescrizione").trim();
        qy="insert into Ges_campo_scheda (scheda,descrizione) values ('"+Scheda+"','"+Descrizone+"')";
        //System.out.println(qy);
        CGes_campo_scheda esecu=new CGes_campo_scheda(LoggedUser.db.getWebConnection());
        esecu.executeQuery(qy);
        Risultato="Inserimento Eseguito";
        }
        catch (Exception e) {log.writeLog("Errore eseguendo l'inserimento di una scheda"+e.getMessage(),CLogError.LOG_ERROR);} 
    }
     
    if (Imposta.equalsIgnoreCase("ModificaScheda"))
    {   try{
        String Condizione="s";
        String wherecondition="";
        String Scheda= myInputRequest.getParameter("HScheda").trim();
        if (Scheda==null) 
        { Condizione="n";
            wherecondition="";}
        else 
        {wherecondition="where scheda='"+Scheda+"' ";
        }
       String Descrizone= myInputRequest.getParameter("HDescrizione").trim();
        if (Descrizone==null || Descrizone.equalsIgnoreCase(""))
        {   Descrizone="";}
       if (Condizione .equalsIgnoreCase("s"))
       {qy="update Ges_campo_SCHEDA set scheda='"+Scheda+"',descrizione='"+Descrizone+"' "+wherecondition;}
        
        //System.out.println(qy);
        CGes_campo_dettaglio esecu=new CGes_campo_dettaglio(LoggedUser.db.getWebConnection());
        esecu.executeQuery(qy);
        Risultato="Modifica Eseguita";
        } catch (Exception e) {log.writeLog("Errore eseguendo l'update di una scheda"+e.getMessage(),CLogError.LOG_ERROR);}
    
    
    }
     if (Imposta.equalsIgnoreCase("CancellaScheda"))
    {
        try{
        String Scheda= myInputRequest.getParameter("HScheda").trim();
        qy="delete from Ges_campo_SCHEDA where scheda='"+Scheda+"'";
        //System.out.println(qy);
        CVW_Gest_Rel prova= new CVW_Gest_Rel(LoggedUser.db.getWebConnection());
        prova.loadData(" scheda='"+Scheda+"'");
        if (!prova.getData().isEmpty())
            Risultato ="Impossibile eseguire il cancellamento la scheda ha ancora campi associati";
        else{
        CGes_campo_scheda esecu=new CGes_campo_scheda(LoggedUser.db.getWebConnection());
        esecu.executeQuery(qy);
        Risultato="Cancellazione Eseguita";}
        }
        catch (Exception e) {log.writeLog("Errore eseguendo a cancellazione di una scheda"+e.getMessage(),CLogError.LOG_ERROR);} 
    }
    
    }
    
 public String creaPaginaHtml(){
        return Risultato;
    }
}
