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
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package it.elco.whale.actions.scopes.Esami;

import generic.statements.StatementFromFile;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;

/**
 *
 * @author francescog
 */
public class EseguiEsamePrenotato extends Action {

    @NotNull
    private StatementFromFile sff;
    
    @NotNull
    private String iden_esame,iden_per,data_esecuzione,ora_esecuzione;
    
    public EseguiEsamePrenotato(){
        super();
    }
    
    @Setter(key="sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key="iden_esame")
    public void setIdenEsame(String iden_esame) {
        this.iden_esame = iden_esame;
    }

    @Setter(key="iden_per")
    public void setIdenPer(String iden_per) {
        this.iden_per = iden_per;
    }

    @Setter(key="data_esecuzione")
    public void setDataEsecuzione(String data_esecuzione) {
        this.data_esecuzione = data_esecuzione;
    }

    @Setter(key="ora_esecuzione")
    public void setOraEsecuzione(String ora_esecuzione) {
        this.ora_esecuzione = ora_esecuzione;
    }
    

    @Override
    public ActionResponse execute() throws Throwable {

        String[] status = this.sff.executeStatement("PST_Prenotazione.xml", "accettaEsame", new String[]{
                    this.iden_esame,
                    this.iden_per,
                    this.data_esecuzione,
                    this.ora_esecuzione
                }, 0);

        if (status[0].equals("KO")) {
            throw new Exception(status[1]);
        }

        status = this.sff.executeStatement("PST_Prenotazione.xml", "eseguiEsame", new String[]{
                    this.iden_esame,
                    this.iden_per,
                    this.data_esecuzione,
                    this.ora_esecuzione
                }, 0);

        if (status[0].equals("KO")) {
            throw new Exception(status[1]);
        }

        return new ActionResponse(true);

    }

}
