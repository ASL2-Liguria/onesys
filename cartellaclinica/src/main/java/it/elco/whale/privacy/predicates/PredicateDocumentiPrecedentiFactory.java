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
package it.elco.whale.privacy.predicates;

import it.elco.privacy.TipologiaAccesso;
import it.elco.privacy.anagrafica.Assistito;
import it.elco.privacy.autorizzazioni.RichiestaAutorizzazione;
import it.elco.privacy.beans.Evento;
import it.elco.privacy.beans.XdsDocument;
import it.elco.privacy.builders.ElementBuilder;
import it.elco.privacy.predicates.PredicateElement;
import it.elco.privacy.predicates.xdsdocument.PredicateXdsDocumentFactoryImpl;
import it.elco.whale.privacy.RichiestaAutorizzazioneFactoryWhale;

import java.util.Map;

import com.google.common.base.Predicate;

/**
 *
 * @author francescog
 */
public class PredicateDocumentiPrecedentiFactory implements PredicateFactory {

    public PredicateDocumentiPrecedentiFactory() {}

    @Override
    public Predicate getPredicate(Map<String, Object> parameters) throws Exception {

        Assistito assistito = new Assistito("WHALE", (String) parameters.get("iden_anag"));

        assistito.setNome((String) parameters.get("nome"));
        assistito.setCognome((String) parameters.get("cognome"));
        assistito.setSesso((String) parameters.get("sesso"));
        assistito.setDataNascita((String) parameters.get("data_nascita"));
        assistito.setComuneNascita((String) parameters.get("comune_nascita"));
        assistito.setCodiceFiscale((String) parameters.get("codice_fiscale"));
        RichiestaAutorizzazione richiesta = RichiestaAutorizzazioneFactoryWhale.makeRichiestaAutorizzazione(assistito,(String) parameters.get("codice_utente"));
        richiesta.setEmergenzaMedica("TRUE".equalsIgnoreCase((String) parameters.get("emergenza_medica")));
        richiesta.setTipologiaAccesso(checkTipologiaAccesso((String) parameters.get("tipologia_accesso")), new Evento(parameters.get("evento_corrente")==null?"":(String)parameters.get("evento_corrente")));
        ElementBuilder<XdsDocument> builder = (ElementBuilder<XdsDocument>) Class.forName((String) parameters.get("builderClass")).newInstance();
        
        PredicateElement<XdsDocument> predicate = new PredicateXdsDocumentFactoryImpl().getPredicate(richiesta, builder);
        
        return predicate;
    }
    
    private TipologiaAccesso checkTipologiaAccesso(String tipologiaAccesso){
    	if ("REPERIBILITA".equalsIgnoreCase(tipologiaAccesso)){
    		return TipologiaAccesso.REPERIBILITA;
    	}else if ("EMERGENZA".equalsIgnoreCase(tipologiaAccesso)){
    		return TipologiaAccesso.EMERGENZA;
    	}else if ("SOSTITUZIONE_INFERMIERISTICA".equalsIgnoreCase(tipologiaAccesso)){
    		return TipologiaAccesso.SOSTITUZIONEINFERMIERISTICA;
    	}else{
    		return TipologiaAccesso.STANDARD;
    	}
    }
}
