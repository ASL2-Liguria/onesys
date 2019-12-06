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
package it.elco.whale.actions.scopes.Richieste;

import generic.statements.StatementFromFile;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;
import it.elco.whale.actions.scopes.Esami.DecodeIdenAnagIdenPro;
import it.elco.whale.actions.scopes.Esami.SendXmlEsamiRequest;
import it.elco.whale.actions.scopes.Esami.beans.Prestazione;
import it.elco.whale.actions.scopes.Esami.beans.Response;
import it.elco.whale.actions.scopes.Esami.beans.Richiesta;

import java.util.ArrayList;

/**
 * User: matteopi
 * Date: 22/03/13
 * Time: 11.01
 */
public class ModificaPrestazioneAssociata extends Action {

    @NotNull
    private StatementFromFile sff;

    @NotNull

    private String iden_richiesta,data,ora,iden_anag,cod_pro,cod_area;

    @Setter(key="sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key="iden_richiesta")
    public void setIdenRichiesta(String iden_richiesta) {
        this.iden_richiesta = iden_richiesta;
    }

    @Setter(key="data")
    public void setData(String data) {
        this.data = data;
    }

    @Setter(key="ora")
    public void setOra(String ora) {
        this.ora = ora;
    }

    @Setter(key="iden_anag")
    public void setIdenAnag(String iden_anag) {
        this.iden_anag = iden_anag;
    }

    @Setter(key="cod_pro")
    public void setCodPro(String cod_pro) {
        this.cod_pro = cod_pro;
    }

    @Setter(key="cod_area")
    public void setCodArea(String cod_area) {
        this.cod_area = cod_area;
    }

    @Override
    public ActionResponse execute() throws Throwable {

        DecodeIdenAnagIdenPro.DecodeIdenAnagIdenProResponse decoded = DecodeIdenAnagIdenPro.execute(this.sff, this.iden_anag, this.cod_pro);

        ArrayList<Richiesta> richieste = new ArrayList<Richiesta>();

        Richiesta richiesta = new Richiesta();

        richiesta.setIdRisPaziente(decoded.getIdRis());
        richiesta.setCodProv(this.cod_pro);

        richiesta.setTipo("P");
        richiesta.setIdentificativoEsterno("1", this.iden_richiesta);

        Prestazione prestazione = new Prestazione();
        prestazione.setCodArea(this.cod_area);
        prestazione.setDataApp(this.data);
        prestazione.setOraApp(this.ora);

        richiesta.addPrestazione(prestazione);

        richieste.add(richiesta);

        Response response = SendXmlEsamiRequest.execute(sff, SendXmlEsamiRequest.MetodoValues.Modifica, richieste).getStructuredResponse();

        String codice_errore = response.getPrestazioni().get(0).getCodiceErrore();

        if(response.getPrestazioni().isEmpty() || codice_errore.equals("-20113") || codice_errore.equals("")){
            return new ActionResponse(true);
        }else{
            return new ActionResponse(false, response.getPrestazioni().get(0).getDescrizioneErrore());
        }
    }



}
