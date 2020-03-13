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
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package it.elco.fenix.pic.bean.builder;

import it.elco.privacy.AnagraficaRiferimento;
import it.elco.privacy.beans.Assistito;
import it.elco.privacy.beans.BeanBuilder;
import it.elco.privacy.beans.BeanBuilderException;
import java.util.Map;

/**
 *
 * @author francescog
 */
public class AssistitoBuilder implements BeanBuilder<Assistito> {

    @Override
    public Assistito build(Map<String, Object> data) throws BeanBuilderException {
        Assistito assistito = new Assistito((String) data.get("assigningAuthority"), (String) data.get("patientId"));

        assistito.setCognome((String) data.get("cognome"));
        assistito.setNome((String) data.get("nome"));
        assistito.setSesso((String) data.get("sesso"));
        assistito.setDataNascita((String) data.get("dataNascita"));

        if (data.get("comuneNascita") != null) {
            assistito.setComuneNascita((String) data.get("comuneNascita"));
        }

        assistito.setCodiceFiscale((String) data.get("codiceFiscale"));

        if (data.get("ID_WHALE") != null) {
            assistito.setIdentificativoAnagrafica(AnagraficaRiferimento.WHALE.name(), (String) data.get("ID_WHALE"));
        }

        if (data.get("ID_AMBULATORIO") != null) {
            assistito.setIdentificativoAnagrafica(AnagraficaRiferimento.AMBULATORIO.name(), (String) data.get("ID_AMBULATORIO"));
        }

        if (data.get("ID_POLARIS") != null) {
            assistito.setIdentificativoAnagrafica(AnagraficaRiferimento.POLARIS.name(), (String) data.get("ID_POLARIS"));
        }

        if (data.get("ID_GALLERY") != null) {
            assistito.setIdentificativoAnagrafica(AnagraficaRiferimento.GALLERY.name(), (String) data.get("ID_GALLERY"));
        }

        return assistito;
    }

}
