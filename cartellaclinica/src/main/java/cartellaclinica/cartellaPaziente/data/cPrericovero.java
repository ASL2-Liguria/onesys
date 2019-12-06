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
public class cPrericovero extends cEvento{

    public cPrericovero(){}

    public cPrericovero(StatementFromFile sff,String pIdenPrericovero, String pWebuser, String pModalitaAccesso) throws SQLException, NoDataFoundException, Exception {
        super(sff,pIdenPrericovero,pWebuser,pModalitaAccesso);
        this.clean();
    }

    private void clean(){
        this.getValues().remove("LINK_ACCESSO");
        this.getValues().remove("IDEN_PRERICOVERO");
        this.getValues().remove("IDEN_RICOVERO");
        this.getValues().remove("PRESENZA_PRERICOVERI");
        this.getValues().remove("PRESENZA_OBI");
        this.getValues().remove("COD_CDC_APPOGGIO");
        this.getValues().remove("CODICE_MODALITA_CARTELLA");
        this.getValues().remove("ACCESSO");
        this.getValues().remove("DIMESSO");
        this.getValues().remove("CODICE_DIMISSIONE");
    }
}
