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
package src.Gestione_Campi;

import imago.http.baseClass.baseUser;

import org.directwebremoting.WebContextFactory;

import core.Global;
/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: </p>
 *
 * <p>Company: </p>
 *
 * @author Fabio
 * @version 1.0
 */
public class UpdatePermissioni {
   public UpdatePermissioni()  {

    }
    public String UpdatePermDB (String var) {
    String Error="";
        try {
                String[] Dati=var.split("[*]");
                String Scheda=Dati[1];
                String Campo=Dati[2];
                String Utente=Dati[3];
                String Permissione=Dati[4];
                baseUser logged_user = Global.getUser(WebContextFactory.get().getSession(false));
                  CVW_Gest_Rel_Data risData= new CVW_Gest_Rel_Data ();
                  CVW_Gest_Rel cerca= new CVW_Gest_Rel(logged_user.db.getWebConnection());
                  if (Utente.equalsIgnoreCase("") || Utente==null)
                     {cerca.loadData("scheda='"+Scheda+"' and campo='"+Campo+"' and (utente is null or utente='')");}
                  else
                     {cerca.loadData("scheda='"+Scheda+"' and campo='"+Campo+"' and utente='"+Utente+"'");}
              risData=cerca.getData(0);
              if (risData==null)
              {Error="Relazione Non Presente Per Questo Utente Inserirla?";
              }
              else
              {

        CGes_campo_relazione aggiornaRelazione = new CGes_campo_relazione (logged_user.db.getWebConnection());
        if (Utente.equalsIgnoreCase("") || Utente==null)
        {aggiornaRelazione.executeQuery("update Ges_campo_relazione set stato='"+Permissione+"' where iden_scheda="+risData.m_view_Idenscheda+" and iden_campo="+risData.m_view_Idencampo+" and Utente is null");
         Error="OK";}
        else
        {aggiornaRelazione.executeQuery("update Ges_campo_relazione set utente='"+Utente+"',stato='"+Permissione+"' where iden_scheda="+risData.m_view_Idenscheda+" and iden_campo="+risData.m_view_Idencampo+" and (utente='' or utente=null or utente='"+Utente+"')");}
     Error="OK";
    }


        }
                catch (Exception ex)
            { Error= ex.getMessage();

            }
    return Error;
}
public String InsertPermDB (String var) {
   String Error="";
       try {
               String[] Dati=var.split("[*]");
               String Scheda=Dati[1];
               String Campo=Dati[2];
               String Utente=Dati[3];
               String Permissione=Dati[4];
               baseUser logged_user = Global.getUser(WebContextFactory.get().getSession(false));




       CVW_Gest_Rel cerca = new CVW_Gest_Rel (logged_user.db.getWebConnection());
       cerca.loadData("scheda='"+Scheda+"' and campo='"+Campo+"'");
       CGes_campo_relazione aggiornaRelazione = new CGes_campo_relazione (logged_user.db.getWebConnection());
       if (Utente.equalsIgnoreCase("") || Utente==null)
       {aggiornaRelazione.executeQuery("INSERT INTO IMAGOWEB.GES_CAMPO_RELAZIONE (IDEN_SCHEDA, IDEN_CAMPO,  STATO) VALUES ("+cerca.getData(0).m_view_Idenscheda+","+cerca.getData(0).m_view_Idencampo+","+Permissione+" )");
}
       else
       {aggiornaRelazione.executeQuery("INSERT INTO IMAGOWEB.GES_CAMPO_RELAZIONE (IDEN_SCHEDA, IDEN_CAMPO,UTENTE,STATO) VALUES ("+cerca.getData(0).m_view_Idenscheda+","+cerca.getData(0).m_view_Idencampo+",'"+Utente+"',"+Permissione+" )");}

       Error="Inserita nuova relazione";

   }
               catch (Exception ex)
           { Error= ex.getMessage();

           }
   return Error;
}

    public String DeletePermDB (String var) {
   String Error="";
       try {
               String[] Dati=var.split("[*]");
               String Scheda=Dati[1];
               String Campo=Dati[2];
               String Utente=Dati[3];
               baseUser logged_user = Global.getUser(WebContextFactory.get().getSession(false));




       CVW_Gest_Rel cerca = new CVW_Gest_Rel (logged_user.db.getWebConnection());

       if (Utente.equalsIgnoreCase("") || Utente==null)
       {
           cerca.loadData("scheda='"+Scheda+"' and campo='"+Campo+"'");
           CGes_campo_relazione aggiornaRelazione = new CGes_campo_relazione (logged_user.db.getWebConnection());
           aggiornaRelazione.executeQuery("DELETE FROM IMAGOWEB.GES_CAMPO_RELAZIONE WHERE iden_scheda='"+cerca.getData(0).m_view_Idenscheda+"' and iden_campo='"+cerca.getData(0).m_view_Idencampo+"'");
           Error="ELIMINATA LA RELAZIONE PER TUTTI GLI UTENTI";
       }
       else
       {
           cerca.loadData("scheda='"+Scheda+"' and campo='"+Campo+"'");
           CGes_campo_relazione aggiornaRelazione = new CGes_campo_relazione (logged_user.db.getWebConnection());
           aggiornaRelazione.executeQuery("DELETE FROM IMAGOWEB.GES_CAMPO_RELAZIONE WHERE iden_scheda='"+cerca.getData(0).m_view_Idenscheda+"' and iden_campo='"+cerca.getData(0).m_view_Idencampo+"' AND UTENTE='"+Utente+"'");
           Error="ELIMINATA LA RELAZIONE PER L'UTENTE"+Utente;
       }



   }
               catch (Exception ex)
           { Error= ex.getMessage();

           }
   return Error;
}

}
