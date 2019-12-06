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
 * CVW_Gest_Rel_Data.java
 *
 * Created on 12 settembre 2006, 10.09
 */

package src.Gestione_Campi;

/**
 *
 * @author  fabioc
 */
public class CGES_CAMPO_CHECK_Data {

    public int m_IDEN;
    public int m_IDEN_RELAZIONE;
    public int m_ORDINE;
    public String m_JS_EVENT;
    public String m_CAMPI_SET;
    public String m_RESULT_TRUE;
    public String m_RESULT_FALSE;
     public String m_QUERY_CHECK;
     public String m_CALL_JS_TRUE;
     public String m_CALL_JS_FALSE;
   public String m_CALL_JS_AFTER;
    public String m_CAMPI_GET;
    public String m_ATTIVO;

    /** Creates a new instance of CVW_Gest_Rel_Data */
    public CGES_CAMPO_CHECK_Data() {
         this.m_IDEN=0;
         this.m_IDEN_RELAZIONE=0;
         this.m_ORDINE=0;
           this.m_JS_EVENT=new String("");
         this.m_CAMPI_SET=new String("");
        this.m_RESULT_TRUE=new String("");
        this.m_RESULT_FALSE=new String("");
        this.m_QUERY_CHECK=new String("");
        this.m_CALL_JS_TRUE=new String("");
        this.m_CALL_JS_FALSE=new String("");
        this.m_CALL_JS_AFTER=new String("");
        this.m_CAMPI_GET=new String("");
         this.m_ATTIVO=new String("");
    }

}
