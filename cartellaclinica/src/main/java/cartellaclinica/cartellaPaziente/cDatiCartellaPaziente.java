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
package cartellaclinica.cartellaPaziente;

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

import generic.statements.StatementFromFile;
import generic.statements.Exception.NoDataFoundException;
import imago.http.baseClass.baseUser;

import java.sql.SQLException;

import javax.servlet.http.HttpSession;

import cartellaclinica.cartellaPaziente.data.cAccesso;
import cartellaclinica.cartellaPaziente.data.cModalita;
import cartellaclinica.cartellaPaziente.data.cPaziente;
import cartellaclinica.cartellaPaziente.data.cPrericovero;
import cartellaclinica.cartellaPaziente.data.cReparto;
import cartellaclinica.cartellaPaziente.data.cRicovero;
import cartellaclinica.cartellaPaziente.data.base.cEvento;
import core.Global;

public class cDatiCartellaPaziente {

    private StatementFromFile vSFF;

    private cPrericovero Prericovero = null;
    private cRicovero Ricovero = null;
    private cAccesso Accesso = null;

    private cPaziente Paziente = null;
    private cReparto Reparto = null;

    private cModalita Modalita = null;

    private cDatiCartellaPaziente(HttpSession pSession) throws Exception{
        this.vSFF = new StatementFromFile(pSession);
    }

    public cDatiCartellaPaziente(HttpSession pSession,String pIdenVisita,String pIdenRicovero,String pIdenAnag,String pReparto) throws Exception {
        this(pSession, (pIdenVisita.equals("") ? pIdenRicovero : pIdenVisita) ,pIdenAnag,pReparto);
    }

    public cDatiCartellaPaziente(HttpSession pSession,String pIdenEvento,String pIdenAnag,String pReparto) throws NoDataFoundException, SQLException, Exception {

        this(pSession);

        baseUser bUser = Global.getUser(pSession);

        if(!pIdenEvento.equals("")){
            cEvento vEvento = new cEvento(this.vSFF, pIdenEvento, bUser.login, bUser.modalita_accesso);
            switch (Integer.valueOf(vEvento.getAccesso())) {
            case 0:
                Ricovero = new cRicovero(vEvento);
                Accesso = new cAccesso(this.vSFF, Ricovero.getLinkAccesso(), bUser.login, bUser.modalita_accesso);
                break;
            case 1:
                Accesso = new cAccesso(this.vSFF, vEvento);
                Ricovero = new cRicovero(this.vSFF, Accesso.getIdenRicovero(), bUser.login, bUser.modalita_accesso);
                break;
            }

            Modalita = new cModalita(this.vSFF, Accesso.getReparto().getCodCdc(), Accesso.getModalitaCartella());
            Reparto = Accesso.getReparto();

            if (!Ricovero.getIdenPrericovero().equals("")) {
                Prericovero = new cPrericovero(this.vSFF, Ricovero.getIdenPrericovero(), bUser.login, bUser.modalita_accesso);
            }
            else {
                Prericovero = new cPrericovero();
            }

            Paziente = new cPaziente(this.vSFF, Accesso.getIdenAnag());

        }else{
            
            if(!pIdenAnag.equals("")) {            
                Paziente = new cPaziente(this.vSFF, pIdenAnag);
            }
            else {
                Paziente = new cPaziente();
            }
           
            if(!pReparto.equals("")) {
                Reparto = new cReparto(this.vSFF,pReparto);
            }
            else {
                Reparto = new cReparto();
            }            
            
            Accesso = new cAccesso();
            Ricovero = new cRicovero();
            Prericovero = new cPrericovero();
            Modalita = new cModalita();
        }

    }

    public void close(){
        this.vSFF.close();
    }

    public cPaziente getPaziente(){
        return this.Paziente;
    }

    public cReparto getReparto(){
        return this.Reparto;
    }

    public cAccesso getAccesso(){
        return this.Accesso;
    }

    public cRicovero getRicovero(){
        return this.Ricovero;
    }

    public cPrericovero getPrericovero(){
        return this.Prericovero;
    }

    public cModalita getModalita(){
        return this.Modalita;
    }

}
