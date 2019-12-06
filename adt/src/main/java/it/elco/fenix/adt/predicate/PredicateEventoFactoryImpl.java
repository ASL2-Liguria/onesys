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
package it.elco.fenix.adt.predicate;

import com.google.common.base.Predicate;

import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.database.DataSourceManager;
import it.elco.privacy.autorizzazioni.RichiestaAutorizzazione;
import it.elco.privacy.beans.Evento;
import it.elco.privacy.builders.BeanBuilder;
import it.elco.privacy.builders.ElementBuilder;
import it.elco.privacy.exceptions.BeanBuilderException;
import it.elco.privacy.exceptions.RichiestaAutorizzazioniException;
import it.elco.worklist.predicate.PredicateException;
import it.elco.worklist.predicate.PredicateFactory;

import java.util.Map;

import javax.sql.DataSource;

/**
 *
 * @author alessandro.arrighi
 * 
 * Implementazione di PredicateFactory per filtrare i documenti del repository tramite i criteri della privacy
 */
public class PredicateEventoFactoryImpl implements PredicateFactory{

    private final BeanBuilder<RichiestaAutorizzazione> richiestaAutorizzazioneBuilder;
    private final ElementBuilder<Evento> eventoBuilder;    
    
    /**
     * 
     * @param richiestaAutorizzazioneBuilder: builder per costruire l'oggetto it.elco.privacy.RichiestaAutorizzazione tramite una Map
     * @param xdsDocumentBuilder: builder per costruire l'oggetto it.elco.privacy.beans.Evento tramite una Map
     */
    public PredicateEventoFactoryImpl(BeanBuilder<RichiestaAutorizzazione> richiestaAutorizzazioneBuilder, ElementBuilder<Evento> eventoBuilder){
        this.richiestaAutorizzazioneBuilder = richiestaAutorizzazioneBuilder;
        this.eventoBuilder = eventoBuilder; 
    }
    
    @Override
    public Predicate getPredicate(Map<String, Object> queryParameters) throws PredicateException {
        try {
            setDataSources();
            return new it.elco.privacy.predicates.evento.PredicateEventoFactoryImpl().getPredicate(richiestaAutorizzazioneBuilder.build(queryParameters), eventoBuilder);
        } catch (BeanBuilderException ex) {
            throw new PredicateException(ex);
        } catch (RichiestaAutorizzazioniException ex){
            throw new PredicateException(ex);
        }
    }
    
    private void setDataSources(){
        if(!DataSourceManager.hasDataSource("PIC")){
            DataSourceManager.setDataSource("PIC", CaronteFactory.getFactory().createDataSource("PORTALE_PIC"));
        }
        if(!DataSourceManager.hasDataSource("WHALE")){
            DataSourceManager.setDataSource("WHALE", CaronteFactory.getFactory().createDataSource("WHALE"));
        }
    }
    
}