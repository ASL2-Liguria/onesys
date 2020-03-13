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

import it.elco.privacy.ModuloSoftware;
import it.elco.privacy.PrivacyConfigurations;
import it.elco.privacy.RichiestaAutorizzazioniException;
import it.elco.privacy.autorizzazioni.RichiestaAutorizzazione;
import it.elco.privacy.autorizzazioni.RichiestaAutorizzazioneFactory;
import it.elco.privacy.beans.Assistito;
import it.elco.privacy.beans.BeanBuilder;
import it.elco.privacy.beans.BeanBuilderException;
import it.elco.privacy.beans.Utente;
import java.util.Map;

/**
 *
 * @author francescog
 */
public class RichiestaAutorizzazioniPrivacyBuilder implements BeanBuilder<RichiestaAutorizzazione> {

    private BeanBuilder<Assistito> assistitoBuilder;

    private RichiestaAutorizzazioniPrivacyBuilder() {
    }

    public RichiestaAutorizzazioniPrivacyBuilder(BeanBuilder<Assistito> assistitoBuilder) {
        this.assistitoBuilder = assistitoBuilder;
    }

    @Override
    public RichiestaAutorizzazione build(Map<String, Object> data) throws BeanBuilderException {

        try {
            Assistito assistito = assistitoBuilder.build(data);
            RichiestaAutorizzazione richiesta = RichiestaAutorizzazioneFactory.make(assistito, new Utente(ModuloSoftware.CCE, (String) data.get("user")), PrivacyConfigurations.getProperties());

            if (data.get("emergenzaMedica") != null) {
                richiesta.setEmergenzaMedica("true".equals(data.get("emergenzaMedica")) || "1".equals(data.get("emergenzaMedica")));
            }

            return richiesta;
        } catch (RichiestaAutorizzazioniException ex) {
            throw new BeanBuilderException(ex);
        }
    }

}
