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
package cartellaclinica.cartellaPaziente.data;

import generic.statements.StatementFromFile;
import generic.statements.Exception.NoDataFoundException;

import java.sql.SQLException;

import cartellaclinica.cartellaPaziente.data.base.cEvento;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author Fra
 * @version 1.0
 */
public class cAccesso extends cEvento{

    private cReparto Reparto,RepartoAppoggio = null;

    public cAccesso(){
        super();
        Reparto = new cReparto();
        RepartoAppoggio = new cReparto();
    }

    public cAccesso(StatementFromFile sff,String pIdenVisita) throws SQLException, NoDataFoundException, Exception {
        this(sff,pIdenVisita,null,null);
    }
    
    public cAccesso(StatementFromFile sff,String pIdenVisita,String pWebuser, String pModalitaAccesso) throws SQLException, NoDataFoundException, Exception {
        super(sff,pIdenVisita,pWebuser,pModalitaAccesso);
        this.setReparti(sff);
        this.clean();

    }

    public cAccesso(StatementFromFile sff,cEvento pEvento) throws NoDataFoundException, SQLException, Exception {
        this.setValues(pEvento.getValues());
        this.setReparti(sff);
        this.clean();
    }

    private void clean(){
        this.getValues().remove("LINK_ACCESSO");
        this.getValues().remove("IDEN_PRERICOVERO");
        this.getValues().remove("PRESENZA_PRERICOVERI");
        this.getValues().remove("NUM_NOSOLOGICO");
        this.getValues().remove("ACCESSO");
        this.getValues().remove("DEA_STR");
        this.getValues().remove("DEA_ANNO");
        this.getValues().remove("DEA_CARTELLA");
        this.getValues().remove("DEA_DATA_INGRESSO");
        this.getValues().remove("DEA_ORA_INGRESSO");
        this.getValues().remove("DEA_DATA_CHIUSURA");
        this.getValues().remove("DEA_ORA_CHIUSURA");
        this.getValues().remove("IDEN_RIFERIMENTO");
    }

    private void setReparti(StatementFromFile sff) throws NoDataFoundException, SQLException, Exception {
        if(!this.getValue("COD_CDC").equals(""))
            this.Reparto = new cReparto(sff,this.getValue("COD_CDC"));
        else
            this.Reparto = new cReparto();

        if(!this.getValue("COD_CDC_APPOGGIO").equals(""))
            this.RepartoAppoggio = new cReparto(sff,this.getValue("COD_CDC_APPOGGIO"));
        else
            this.RepartoAppoggio = new cReparto();
    }

    public String getIdenRicovero(){
        return this.getValue("IDEN_RICOVERO");
    }
    public String getModalitaCartella(){
        return this.getValue("CODICE_MODALITA_CARTELLA");
    }
    public cReparto getReparto(){
        return this.Reparto;
    }
    public cReparto getRepartoAppoggio(){
        return this.RepartoAppoggio;
    }
}
