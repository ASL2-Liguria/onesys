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
/**
 *
 */
package jsRemote;

import imago.http.baseClass.baseUser;
import imago.sql.TableDelete;
import imago.sql.TableInsert;
import imago.sql.TableUpdate;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;

import core.Global;

/**
 * @author elenad
 *
 */
public class CJsFiltroStato{
   /**
    *
    */
   public CJsFiltroStato(){

   }

   /**
    *
    * @param valori_filtro_stato String
    * @return String
    */
   public String insert(String valori_filtro_stato){
      String errore = "";
      String stato[] = valori_filtro_stato.split("[*]");

      HttpSession session = (WebContextFactory.get()).getSession(false);

      if(session == null){
         return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
      }

      baseUser logged_user = Global.getUser(session);

      try{
         TableInsert insert = new TableInsert();
         String ins = "INSERT INTO RADSQL.TAB_FILTRI_STATO (";
         ins += "WHERE_COND_FILTRO, NOME_FILTRO, VALORE_FILTRO, WEBUSER) ";
         ins += "VALUES ('(";
         ins += stato[0] + ")', '";
         ins += stato[1] + "', '";
         ins += stato[2] + "', '";
         ins += logged_user.login;
         ins += "')";

         insert.insertQuery(logged_user.db.getDataConnection(), ins);
         insert.close();
      }
      catch(Exception e){
         errore = "jsRemote.CJsFiltroStato.insert(): " + e.getMessage();
      }
      return errore;
   }


   /*
    * Metodo che effettua l'update di un filtro.
    * Verrà modificata la tabella TAB_FILTRI_STATO.
    * @param valori_filtro_stato contiene:
    * 					where_cond_filtro *
    * 					nome_filtro       *
    * 					valore_filtro     *
    * 					iden.
    * */
   public String update(String valori_filtro_stato){
      String errore = "";
      String stato[] = valori_filtro_stato.split("[*]");

      HttpSession session = (WebContextFactory.get()).getSession(false);

      if(session == null){
         return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
      }

      baseUser logged_user = Global.getUser(session);

      try{
         TableUpdate update = new TableUpdate();
         String upd = "UPDATE TAB_FILTRI_STATO SET ";
         upd += "where_cond_filtro = '(" + stato[0] + ")', ";
         upd += "valore_filtro = '" + stato[2] + "', ";
         upd += "nome_filtro = '" + stato[1].replaceAll("[']", "\\\\'") + "' ";
         upd += "where iden = " + stato[3];
         update.updateQuery(logged_user.db.getDataConnection(), upd);
         update.close();
      }
      catch(Exception e){
         errore = "jsRemote.CJsFiltroStato.update(): " + e.getMessage();
      }
      return errore;
   }


   /*
    * Metodo che effettua la cancellazione fisica di n filtri appartenenti all'utente
    * loggato.
    * */
   public String cancellazione(String tabFiltriStato_iden){
      String iden[] = null;
      String tab_filtri_stato_iden = new String("");
      try{
         iden = tabFiltriStato_iden.split("[*]");
         for(int i = 0; i < iden.length - 1; i++) {
            tab_filtri_stato_iden += iden[i] + ",";
         }
         tab_filtri_stato_iden += iden[iden.length - 1];
      }
      catch(Exception e){
         tab_filtri_stato_iden = tabFiltriStato_iden;

      }
      String errore = new String("");

      HttpSession session = (WebContextFactory.get()).getSession(false);

      if(session == null){
         return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
      }

      baseUser logged_user = Global.getUser(session);

      TableDelete delete = new TableDelete();
      try{
         String del = "DELETE FROM TAB_FILTRI_STATO WHERE IDEN in ( " + tab_filtri_stato_iden + ")";
         delete.deleteQuery(logged_user.db.getDataConnection(), del);
         delete.close();
      }
      catch(Exception e){
         errore = "jsRemote.CJsFiltroStato.delete(): " + e.getMessage();
      }
      return errore;
   }


   /*
    * Metodo che effettua l'abilitazione/disabilitazione dei filtri dell'utente
    * Consiste nell'effettuare un'update sulla tabella TAB_FILTRI_STATO modificando
    * il campo ABILITATO = 'N' se il filtro selezionato era disabilitato; ABILITATO = 'S'
    * se il filtro era abilitato.
    * @param 	tabFiltriStato_iden = TAB_FILTRI_STATO.iden selezionati dalla worklist di scelta dei
    * 								  filtri.
    * 			il primo parametro indica gli iden dei FILTRI DA ABILITARE(abilitato = 'S')
    * 			il secondo parametro contiene gli iden dei FILTRI DA DISABILITARE (abilitato = 'N')
    * */
   public String abilita_disabilita(String iden_abilitati_disabilitati){
      String errore = new String("");
      String iden_ab_disab[] = null;
      String iden_da_abilitare = null;
      String iden_da_disabilitare = null;
      try{
         iden_ab_disab = iden_abilitati_disabilitati.split("[@]");
         try{
            iden_da_abilitare = iden_ab_disab[0];
         }
         catch(Exception e){
            iden_da_abilitare = null;
         }
         try{
            iden_da_disabilitare = iden_ab_disab[1];
         }
         catch(Exception e){
            iden_da_disabilitare = null;
         }
      }
      catch(Exception e){
         errore = "jsRemote.CJsFiltroStato.abilita_disabilita(): " + e.getMessage();
      }

      HttpSession session = (WebContextFactory.get()).getSession(false);

      if(session == null){
         return "Attenzione: sessione scaduta.Effettuare nuovamente il login all'applicativo";
      }

      baseUser logged_user = Global.getUser(session);

      TableUpdate update = null;
      String upd = null;
      try{
         if(iden_da_disabilitare != null && !iden_da_disabilitare.equalsIgnoreCase("")){
            update = new TableUpdate();
            upd = "UPDATE TAB_FILTRI_STATO SET ABILITATO = 'N' ";
            upd += "WHERE IDEN IN (" + elenco_iden(iden_da_disabilitare) + ")";
            update.updateQuery(logged_user.db.getDataConnection(), upd);
            update.close();
         }
         if(iden_da_abilitare != null && !iden_da_abilitare.equalsIgnoreCase("")){
            update = new TableUpdate();
            upd = "UPDATE TAB_FILTRI_STATO SET ABILITATO = 'S' ";
            upd += "WHERE IDEN IN (" + elenco_iden(iden_da_abilitare) + ")";
            update.updateQuery(logged_user.db.getDataConnection(), upd);
            update.close();
         }
      }
      catch(Exception e){
         errore = "jsRemote.CJsFiltroStato.abilita_disabilita('update'): " + e.getMessage();
      }
      return errore;

   }


   /**
    *
    * @param iden String
    * @return String
    */
   private String elenco_iden(String iden){
      String elenco_iden[] = null;
      String iden_where_cond = new String("");
      try{
         elenco_iden = iden.split("[*]");
         for(int i = 0; i < elenco_iden.length - 1; i++) {
            iden_where_cond += elenco_iden[i] + ",";
         }
         iden_where_cond += elenco_iden[elenco_iden.length - 1];
      }
      catch(Exception e){
         iden_where_cond = iden;
      }
      return iden_where_cond;
   }

}
