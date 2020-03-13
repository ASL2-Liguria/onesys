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

import it.elco.core.converters.CalendarFactory;
import it.elco.core.converters.Patterns;
import it.elco.privacy.PrivacyConfigurations;
import it.elco.privacy.beans.BeanBuilder;
import it.elco.privacy.beans.BeanBuilderException;
import it.elco.privacy.beans.Evento;
import it.elco.privacy.beans.Reparto;
import it.elco.privacy.beans.XdsDocument;
import it.elco.privacy.beans.ConsensiDato.ConsentStatus;

import java.text.ParseException;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
/**
 *
 * @author francescog
 */
public class XdsDocumentBuilder implements BeanBuilder<XdsDocument> {

    @Override
    public XdsDocument build(Map<String, Object> data) throws BeanBuilderException {
        try {
            XdsDocument document = new XdsDocument((String) data.get("ID"), CalendarFactory.fromString((String) data.get("CREATIONTIME"), Patterns.ISO + " " + Patterns.HH_MI));

            if (StringUtils.isNotBlank((String) data.get("NOSOLOGICO"))) {
                document.setEvento(new Evento((String) data.get("NOSOLOGICO"), CalendarFactory.fromString((String) data.get("CREATIONTIME"), Patterns.ISO + " " + Patterns.HH_MI)));
            }

            if (StringUtils.isNotBlank((String) data.get("DSE_ALIMENTAZIONE"))) {
                document.putConsenso(PrivacyConfigurations.getModuloEventoDSEAlimentazione(), ConsentStatus.valueOf((String) data.get("DSE_ALIMENTAZIONE")));
            }

            if (StringUtils.isNotBlank((String) data.get("DSE_OSCURAMENTO"))) {
                document.putConsenso(PrivacyConfigurations.getModuloEventoDSEOscuramento(), ConsentStatus.valueOf((String) data.get("DSE_OSCURAMENTO")));
            }

            if (StringUtils.isNotBlank((String) data.get("FSE_ALIMENTAZIONE"))) {
                document.putConsenso(PrivacyConfigurations.getModuloEventoFSEAlimentazione(), ConsentStatus.valueOf((String) data.get("FSE_ALIMENTAZIONE")));
            }

            if (StringUtils.isNotBlank((String) data.get("FSE_OSCURAMENTO"))) {
                document.putConsenso(PrivacyConfigurations.getModuloEventoFSEOscuramento(), ConsentStatus.valueOf((String) data.get("FSE_OSCURAMENTO")));
            }

            if (StringUtils.isNotBlank((String) data.get("REDATTORE"))) {
                document.setRedattore(new Reparto((String) data.get("REDATTORE")));
            }

            if (StringUtils.isNotBlank((String) data.get("RICHIEDENTE"))) {
                document.setRichiedente(new Reparto((String) data.get("RICHIEDENTE")));
            }

            if (StringUtils.isNotBlank((String) data.get("TITOLARE_TRATTAMENTO"))) {
                document.setTitolare((String) data.get("TITOLARE_TRATTAMENTO"));
            }

            return document;
        } catch (ParseException ex) {
            throw new BeanBuilderException(ex);
        }
    }
}
