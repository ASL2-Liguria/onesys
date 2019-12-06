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


public class CVW_Gest_Rel_Data {
    public String m_view_campo;
    public String m_view_campo_check;
    public String m_view_campo_check_descr;
    public String m_view_scheda;
    public String m_view_utente;
    public String m_view_stato;
    public String m_view_permissioni;
    public String m_view_Idencampo;
     public String m_view_Idenscheda;
     public String m_view_Descrizione;
     public String m_view_Valore;
     public int m_view_Iden_relazione;
    /** Creates a new instance of CVW_Gest_Rel_Data */
    public CVW_Gest_Rel_Data() {
        this.m_view_campo=new String("");
         this.m_view_campo_check=new String("");
          this.m_view_campo_check_descr=new String("");
        this.m_view_scheda=new String("");
        this.m_view_permissioni=new String("");
        this.m_view_stato=new String("");
        this.m_view_utente=new String("");
        this.m_view_Idencampo=new String("");
        this.m_view_Idenscheda=new String("");
        this.m_view_Descrizione=new String("");
          this.m_view_Valore=new String("");
         this.m_view_Iden_relazione=0;
    }

}
