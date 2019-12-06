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
package it.elco.whale.actions.scopes.Richieste;

import generic.statements.StatementFromFile;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;
import it.elco.whale.actions.scopes.Scripting.ExecuteGroovy;
import java.sql.ResultSet;
import java.util.HashMap;

/**
 *
 * @author
 * francescog
 */
public class Esegui extends Action {

    private StatementFromFile sff;
    @NotNull
    private String iden_richiesta, iden_per;
    private String cdc_sorgente = null, cdc_destinatario = null, tipologia_richiesta = null, metodica = null, data = null, ora = null, cognome = null, nome = null;

    @Setter(key = "sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key = "iden_richiesta")
    public void setIdenRichiesta(String iden_richiesta) {
        this.iden_richiesta = iden_richiesta;
    }

    @Setter(key = "iden_per")
    public void setIdenPer(String iden_per) {
        this.iden_per = iden_per;
    }

    @Setter(key = "data")
    public void setData(String data) {
        this.data = data;
    }

    @Setter(key = "ora")
    public void setOra(String ora) {
        this.ora = ora;
    }

    @Setter(key = "cdc_sorgente")
    public void setCdcSorgente(String cdc_sorgente) {
        this.cdc_sorgente = cdc_sorgente;
    }

    @Setter(key = "cdc_destinatario")
    public void setCdcDestinatario(String cdc_destinatario) {
        this.cdc_destinatario = cdc_destinatario;
    }

    @Setter(key = "tipologia_richiesta")
    public void setTipologiaRichiesta(String tipologia_richiesta) {
        this.tipologia_richiesta = tipologia_richiesta;
    }

    @Setter(key = "metodica")
    public void setMetodica(String metodica) {
        this.tipologia_richiesta = metodica;
    }

    @Setter(key = "cognome")
    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    @Setter(key = "nome")
    public void setNome(String nome) {
        this.nome = nome;
    }

    @Override
    public ActionResponse execute() throws Throwable {

        if (cdc_sorgente == null || cdc_destinatario == null || tipologia_richiesta == null || metodica == null) {

            ResultSet rs = this.sff.executeQuery("OE_Richiesta.xml", "getRichiesta", new String[]{this.iden_richiesta});

            if (rs.next()) {
                setCdcSorgente(rs.getString("REPARTO"));
                setCdcDestinatario(rs.getString("CDC"));
                setTipologiaRichiesta(rs.getString("TIPOLOGIA_RICHIESTA"));
                setMetodica(rs.getString("METODICA"));
                setNome(rs.getString("NOME"));
                setCognome(rs.getString("COGN"));
            } else {
                return new ActionResponse(false, "Impossibile recuperare i dati relativi alla richiesta con iden \"" + this.iden_richiesta + "\"");
            }

        }

        String[] outs = this.sff.executeStatement("configurazioni.xml", "getValueCdc", new String[]{this.cdc_sorgente, "OE_BEFORE_EXECUTION"}, 1);

        if (outs[0].equals("KO")) {
            return new ActionResponse(false, outs[1]);
        }

        String script_path = outs[2];

        String message = null;

        if (script_path != null) {

            HashMap<String, Object> script_parameters = new HashMap<String, Object>();
            script_parameters.put("iden_richiesta", iden_richiesta);
            script_parameters.put("iden_per", iden_per);
            script_parameters.put("cdc_sorgente", cdc_sorgente);
            script_parameters.put("cdc_destinatario", cdc_destinatario);
            script_parameters.put("tipologia_richiesta", tipologia_richiesta);
            script_parameters.put("metodica", metodica);
            script_parameters.put("nome", nome);
            script_parameters.put("cognome", cognome);

            ActionResponse response = ExecuteGroovy.execute(script_path, script_parameters);

            if (response.getSuccess() == false) {
                return response;
            }

            if (response.getOutParameter("out_success").equals(false)) {
                return new ActionResponse(false, response.getOutParameterString("out_message"));
            }

            message = response.getOutParameterString("out_message");

        }

        outs = this.sff.executeStatement("OE_Richiesta.xml", "esegui", new String[]{this.iden_richiesta, this.iden_per, this.data, this.ora}, 0);

        if (outs[0].equals("KO")) {
            return new ActionResponse(false, outs[1]);
        }


        return new ActionResponse(true, message);

    }

    public static ActionResponse execute(StatementFromFile sff, String iden_richiesta, String iden_per, String data, String ora, String cdc_sorgente, String cdc_destinatario, String tipologia_richiesta, String metodica) throws Throwable {
        Esegui action = new Esegui();

        action.setStatementFromFile(sff);
        action.setIdenRichiesta(iden_richiesta);
        action.setIdenPer(iden_per);
        action.setData(data);
        action.setOra(ora);
        action.setCdcSorgente(cdc_sorgente);
        action.setCdcDestinatario(cdc_destinatario);
        action.setTipologiaRichiesta(tipologia_richiesta);
        action.setMetodica(metodica);

        return action.execute();
    }

    public static ActionResponse execute(StatementFromFile sff, String iden_richiesta, String iden_per, String data, String ora) throws Throwable {
        return execute(sff, iden_richiesta, iden_per, data, ora, null, null, null, null);
    }
}
