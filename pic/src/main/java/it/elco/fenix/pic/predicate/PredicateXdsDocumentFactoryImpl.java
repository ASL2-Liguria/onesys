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
package it.elco.fenix.pic.predicate;

import com.google.common.base.Predicate;
import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.core.actions.LoadPropertiesFile;
import it.elco.database.DataSourceManager;
import it.elco.listener.ElcoContextInfo;
import it.elco.privacy.PrivacyConfigurations;
import it.elco.privacy.RichiestaAutorizzazioniException;
import it.elco.privacy.autorizzazioni.RichiestaAutorizzazione;
import it.elco.privacy.beans.BeanBuilder;
import it.elco.privacy.beans.BeanBuilderException;
import it.elco.privacy.beans.XdsDocument;
import it.elco.privacy.predicates.PredicateFactoryImpl;
import it.elco.worklist.predicate.PredicateException;
import it.elco.worklist.predicate.PredicateFactory;
import java.io.IOException;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author francescog
 *
 * Implementazione di PredicateFactory per filtrare i documenti del repository
 * tramite i criteri della privacy
 */
public class PredicateXdsDocumentFactoryImpl implements PredicateFactory {

    private final BeanBuilder<RichiestaAutorizzazione> richiestaAutorizzazioneBuilder;
    private final BeanBuilder<XdsDocument> xdsDocumentBuilder;
    private final String configurationPath;

    Logger log = LoggerFactory.getLogger(getClass());

    /**
     *
     * @param richiestaAutorizzazioneBuilder: builder per costruire l'oggetto
     * it.elco.privacy.RichiestaAutorizzazione tramite una Map
     * @param xdsDocumentBuilder: builder per costruire l'oggetto
     * it.elco.privacy.beans.XdsDocumenttramite una Map
     */
    public PredicateXdsDocumentFactoryImpl(BeanBuilder<RichiestaAutorizzazione> richiestaAutorizzazioneBuilder, BeanBuilder<XdsDocument> xdsDocumentBuilder) {
        this(richiestaAutorizzazioneBuilder, xdsDocumentBuilder, null);
    }

    /**
     *
     * @param richiestaAutorizzazioneBuilder: builder per costruire l'oggetto
     * it.elco.privacy.RichiestaAutorizzazione tramite una Map
     * @param xdsDocumentBuilder: builder per costruire l'oggetto
     * it.elco.privacy.beans.XdsDocumenttramite una Map
     * @param configurationPath: percorso relativo a
     * &lt;context-path&gt;/WEB-INF contenente il file di configurazione della
     * privacy
     */
    public PredicateXdsDocumentFactoryImpl(BeanBuilder<RichiestaAutorizzazione> richiestaAutorizzazioneBuilder, BeanBuilder<XdsDocument> xdsDocumentBuilder, String configurationPath) {
        this.richiestaAutorizzazioneBuilder = richiestaAutorizzazioneBuilder;
        this.xdsDocumentBuilder = xdsDocumentBuilder;
        this.configurationPath = configurationPath;
    }

    @Override
    public Predicate getPredicate(Map<String, Object> queryParameters) throws PredicateException {
        try {
            setDataSources();

            if (configurationPath != null) {
                PrivacyConfigurations.init(new LoadPropertiesFile(ElcoContextInfo.getContextPath() + configurationPath).execute());
            }

            return new PredicateFactoryImpl<>(XdsDocument.class).getPredicate(richiestaAutorizzazioneBuilder.build(queryParameters), xdsDocumentBuilder);
        } catch (BeanBuilderException | RichiestaAutorizzazioniException | IOException ex) {
            throw new PredicateException(ex);
        }
    }

    private void setDataSources() {
        if (!DataSourceManager.hasDataSource("PIC")) {
            try {
                DataSourceManager.setDataSource("PIC", CaronteFactory.getFactory().createDataSource("PORTALE_PIC"));
            } catch (Exception e) {
                log.error(e.getLocalizedMessage());
            }
        }
        if (!DataSourceManager.hasDataSource("WHALE")) {
            try {
                DataSourceManager.setDataSource("WHALE", CaronteFactory.getFactory().createDataSource("WHALE"));
            } catch (Exception e) {
                log.error(e.getLocalizedMessage());
            }
        }
        if (!DataSourceManager.hasDataSource("POLARIS")) {
            try {
                DataSourceManager.setDataSource("POLARIS", CaronteFactory.getFactory().createDataSource("POLARIS"));
            } catch (Exception e) {
                log.error(e.getLocalizedMessage());
            }
        }
        if (!DataSourceManager.hasDataSource("AMBULATORIO")) {
            try {
                DataSourceManager.setDataSource("AMBULATORIO", CaronteFactory.getFactory().createDataSource("AMBULATORIO"));
            } catch (Exception e) {
                log.error(e.getLocalizedMessage());
            }
        }
        if (!DataSourceManager.hasDataSource("ADT")) {
            try {
                DataSourceManager.setDataSource("ADT", CaronteFactory.getFactory().createDataSource("ADT"));
            } catch (Exception e) {
                log.error(e.getLocalizedMessage());
            }
        }
    }

}
