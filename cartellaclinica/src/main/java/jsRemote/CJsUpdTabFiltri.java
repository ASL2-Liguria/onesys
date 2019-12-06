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
 * CJsUpdTabFiltri.java
 *
 * Created on 20 settembre 2006, 9.25
 */

package jsRemote;

import imago.RowsLock.CRows_Lock;
import imago.a_sql.CFiltri;
import imago.http.baseClass.baseUser;
import imago.util.CGestioneErrori;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import core.Global;


/**
 * Classe che effettua l'update sulla tabella dei FILTRI.
 * Il metodo pubblico updateFiltri viene richiamato dalla funzione js applica();
 * tale funzione è contenuta nel file std/jscript/worklist/Filtri/updTabFiltri.js
 *
 * @author  elenad
 */
public class CJsUpdTabFiltri{

   /**
    *
    */
   public CJsUpdTabFiltri(){
   }

   /**
    * Metodo che effettua l'update sulla tabella FILTRI
    *
    * @param elenco_valori_filtri contiene l'elenco dei valori dei campi contenuti nella pagina
    *                             dei filtri.Tali valori sono separati dal carattere '@'
    * @return un messaggio di errore se il metodo va in catch, una stringa vuota se l'update va
    *         a buon fine
    */
   public String updateFiltri(String elenco_valori_filtri){
      if(elenco_valori_filtri == null){
         return "Parametri nulli passati dai filtri";
      }

      String error = "";

      HttpSession session = (WebContextFactory.get()).getSession(false);

      baseUser logged_user = null;

      /*Problema della Sessione Scaduta*/
      if(session == null){
         return "sessione_scaduta";
      }
      else{
         logged_user = Global.getUser(session);
      }

      /*Effettuo la cancellazione dalla tabella ROWS_LOCK di eventuali record associati alla sessione
       dell'utente che si logga*/
      boolean canc_rows_lock = false;
      try{
         canc_rows_lock = CRows_Lock.delete_session(logged_user.db.getDataConnection(), WebContextFactory.get().getSession(false).getId());
      }
      catch(Exception e){
         return "jsRemote.CJsUpdTabFiltri: Errore nella cancellazione di record in tabella ROWS_LOCK";
      }
      if(!canc_rows_lock){
         return "jsRemote.CJsUpdTabFiltri: Cancellazione in tabella ROWS_LOCK non andata a buon fine";
      }

      String valore_filtri[] = elenco_valori_filtri.split("@");

      try{
         update_tab_filtri_char(logged_user, CFiltri.FLT_URGENZE, valore_filtri[0]);
      }
      catch(Exception e){
         error += "Errore nell'update sulla tabella filtri (filtro URGENZA): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
      }
      try{
         update_tab_filtri_char(logged_user, CFiltri.FLT_METODICA, valore_filtri[1]);
      }
      catch(Exception e){
         error += "Errore nell'update sulla tabella filtri (filtro METODICA): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
      }
      try{
         update_tab_filtri_char(logged_user, CFiltri.FLT_CDC, valore_filtri[2]);
      }
      catch(Exception e){
         error += "Errore nell'update sulla tabella filtri (filtro CDC): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
      }

      try{
         update_tab_filtri_char(logged_user, CFiltri.FLT_SALA, valore_filtri[4]);
      }
      catch(Exception e){
         error += "Errore nell'update sulla tabella filtri (filtro SALA): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
      }
      try{
         update_tab_filtri_data(logged_user, CFiltri.FLT_DADATAESAME, valore_filtri[6]);
      }
      catch(Exception e){
         error += "Errore nell'update sulla tabella filtri (filtro DA DATA ESAME): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
      }
      try{
         update_tab_filtri_data(logged_user, CFiltri.FLT_ADATAESAME, valore_filtri[7]);
      }
      catch(Exception e){
         error += "Errore nell'update sulla tabella filtri (filtro A DATA ESAME): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
      }

      try{
         update_tab_filtri_char(logged_user, CFiltri.FLT_STATOESAME, valore_filtri[8]);
      }
      catch(Exception e){
         //update_tab_filtri_char(logged_user, CFiltri.FLT_STATOESAME, "'S'*'NE'*'NR'*'NF'*'NRS'");
      }

      try{
         update_tab_filtri_int(logged_user, CFiltri.FLT_MEDICO, Integer.parseInt(valore_filtri[5]));
      }
      catch(Exception e){
         error += "Errore nell'update sulla tabella filtri (filtro MEDICO): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
      }

      return error;
   }


   public String update_filtri_medicina_nucleare(String elenco_valori_filtri){
      String error = "";
      String tipologia_esami = "";

      if(elenco_valori_filtri == null){
         return "Parametri nulli passati dai filtri della medicina nucleare";
      }

      HttpSession session = (WebContextFactory.get()).getSession(false);

      baseUser logged_user = null;

      /*Problema della Sessione Scaduta*/
      if(session == null){
         return "sessione_scaduta";
      }
      else{
         logged_user = Global.getUser(session);
      }

      String valore_filtri[] = elenco_valori_filtri.split("@");

      try{
         try{
            tipologia_esami = valore_filtri[0];
         }
         catch(Exception e){
            tipologia_esami = "";
         }

         update_tab_filtri_char(logged_user, CFiltri.MN_TIPOLOGIA_ESAMI, tipologia_esami);
      }
      catch(Exception e){
         error += "Errore nell'update sulla tabella filtri (filtro TIPOLOGIA ESAMI della WK di MEDICINA NUCLEARE): " + CGestioneErrori.GetStackTraceErrorAsString(e.getStackTrace());
      }

      return error;
   }

   /**
    * Metodo privato che effettua un update sulla tabella dei filtri per un campo che ha come valore
    * un intero.Tale metodo richiama la funzione FILTRI.update sul campo FILTRI.lastvalueint
    * @param logged_user utente loggato
    * @param filtri_tipo FILTRI.tipo
    * @param filtri_valore valore contenuto nella pagina dei filtri
    */
   private void update_tab_filtri_int(baseUser logged_user, int filtri_tipo, int filtri_valore){
      CFiltri filtri = new CFiltri(logged_user, Integer.parseInt((WebContextFactory.get()).getServletContext().getInitParameter("TIPODB")));
      filtri.update(logged_user.login, filtri_tipo, filtri_valore);
   }

   /**
    * Metodo privato che effettua un update sulla tabella dei filtri per un campo che ha come valore
    * una stringa.Tale metodo richiama la funzione FILTRI.update sul campo FILTRI.lastvaluechar
    * @param logged_user utente loggato
    * @param filtri_tipo FILTRI.tipo
    * @param filtri_valore valore contenuto nella pagina dei filtri
    */
   private void update_tab_filtri_char(baseUser logged_user, int filtri_tipo, String filtri_valore){
      CFiltri filtri = new CFiltri(logged_user, Integer.parseInt((WebContextFactory.get()).getServletContext().getInitParameter("TIPODB")));
      filtri.update(logged_user.login, filtri_tipo, filtri_valore);
   }

   /**
    * Metodo privato che effettua un update sulla tabella dei filtri per un campo che ha come valore
    * una data.Tale metodo richiama la funzione FILTRI.update sul campo FILTRI.lastvaluechar
    * @param logged_user utente loggato
    * @param filtri_tipo FILTRI.tipo
    * @param filtri_valore valore contenuto nel campo di testo da data e a data
    */
   private void update_tab_filtri_data(baseUser logged_user, int filtri_tipo, String filtri_valore){
      String data_for_db = filtri_valore.substring(6, 10) + filtri_valore.substring(3, 5) + filtri_valore.substring(0, 2);
      CFiltri filtri = new CFiltri(logged_user, Integer.parseInt((WebContextFactory.get()).getServletContext().getInitParameter("TIPODB")));
      filtri.update(logged_user.login, filtri_tipo, data_for_db);
   }
}
