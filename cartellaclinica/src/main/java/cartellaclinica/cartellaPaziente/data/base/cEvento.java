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
package cartellaclinica.cartellaPaziente.data.base;

import generic.statements.StatementFromFile;
import generic.statements.Exception.NoDataFoundException;

import java.sql.SQLException;

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
public class cEvento extends cAbstract{

    protected cEvento(){
        super();
    }

    public cEvento(StatementFromFile sff,String pIdenEvento) throws SQLException, NoDataFoundException, Exception {
        this(sff,pIdenEvento,null,null);
    }
    
    public cEvento(StatementFromFile sff,String pIdenEvento , String pWebuser, String pModalitaAccesso) throws SQLException, NoDataFoundException, Exception {
        super(sff,"getEvento",new String[]{pWebuser,pModalitaAccesso,pIdenEvento});
    }

    public String getIden(){
        return this.getValue("IDEN");
    }
    public String getAccesso(){
        return this.getValue("ACCESSO");
    }
    public String getIdenAnag(){
        return this.getValue("IDEN_ANAG");
    }
    public String getCodice(){
        return this.getValue("NUM_NOSOLOGICO");
    }
    public String getTipologia(){
        return this.getValue("TIPOLOGIA");
    }
    public String getDataInizio(){
        return this.getValue("DATA_ORA_INIZIO");
    }
    public String getDataInizioISO(){
        String vDataInizio = this.getDataInizio();
        return (vDataInizio.equals("") ? "" : vDataInizio.substring(6,8) + "/" + vDataInizio.substring(4,6) + "/" + vDataInizio.substring(0,4));
    }
    public String getDataFine(){
        return this.getValue("DATA_ORA_FINE");
    }
    public String getDataFineISO(){
        String vDataFine = this.getDataFine();
        return (vDataFine.equals("") ? "" : vDataFine.substring(6,8) + "/" + vDataFine.substring(4,6) + "/" + vDataFine.substring(0,4));
    }
    public String getDimesso(){
        return this.getValue("DIMESSO");
    }
    public String getDurata(){
        return this.getValue("DURATA");
    }

}
