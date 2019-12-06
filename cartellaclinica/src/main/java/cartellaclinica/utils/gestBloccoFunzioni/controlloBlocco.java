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
package cartellaclinica.utils.gestBloccoFunzioni;

import imago.http.baseClass.basePC;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

import java.sql.CallableStatement;
import java.sql.Types;

import javax.servlet.http.HttpSession;

import core.Global;

public class controlloBlocco {

    private boolean recordBloccato;
    private String message;
    private String tipoOperazione;
    private String function;
    private String tabella;
    private int id;
    private String sessionId;
    private baseUser bUtente;
    private basePC bPc;
    protected ElcoLoggerInterface			logger	 = null;
    public final String CONTROLLO ="CONTROLLO";
    public final String SBLOCCO ="SBLOCCO";

    public controlloBlocco(HttpSession sess,String tabella,String funzione,int iden)  {
        this.bUtente=Global.getUser(sess);
        this.bPc = (basePC) sess.getAttribute("parametri_pc");

        this.function = funzione;
        this.tabella = tabella;
        this.id = iden;

        this.sessionId = sess.getId();
        this.logger			= new ElcoLoggerImpl(this.getClass().getName()+".class");

    }
    private void callSp(String tipo){
        CallableStatement cs = null;
               try {
                   cs = bUtente.db.getDataConnection().prepareCall("{call SP_GEST_BLOCCO_FUNZIONI(?,?,?,?,?,?,?,?,?,?)}");
                   cs.setString(1,tipo);
                   cs.setString(2,tabella);
                   cs.setString(3,function);
                   cs.setInt(4,id);
                   cs.setInt(5,bUtente.iden_per);
                   cs.setString(6,sessionId);
                   cs.setString(7,bPc.ip);
                   cs.setString(8,bPc.nome_host);
                   this.logger.info("ControlloBlocco - tipo:"+tipo+"/tabella:"+tabella+"/function:"+function+"/id:" +
                   		""+id+"/bUtente.iden_per:"+bUtente.iden_per+"/sessionId:"+sessionId+"/bPc.ip:"+bPc.ip+"" +
                   				"/bPc.nome_host"+bPc.nome_host);
                   cs.registerOutParameter(9,Types.VARCHAR);
                   cs.registerOutParameter(10,Types.VARCHAR);

                   cs.execute();
                   this.recordBloccato = cs.getString(9).equals("S");
                   this.message =cs.getString(10);
                   this.logger.info("getString - 9:"+cs.getString(9)+"10:"+cs.getString(10));
                   
                   cs.close();
               } catch (Exception ex) {
                   this.message = ex.getMessage();
                   this.recordBloccato=true;
        }
    }
    public boolean isLocked(){
        this.callSp(this.CONTROLLO);
        return this.recordBloccato;
    }
    public boolean unLock(){
        this.callSp(this.SBLOCCO);
        return !this.recordBloccato;
    }
    public String getMessage(){
        return this.message;
    }
}
