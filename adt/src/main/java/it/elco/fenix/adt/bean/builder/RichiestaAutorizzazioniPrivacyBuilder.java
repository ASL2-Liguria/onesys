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
package it.elco.fenix.adt.bean.builder;

import it.elco.caronte.factory.utils.CaronteFactory;
import it.elco.json.Json;
import it.elco.privacy.anagrafica.Assistito;
import it.elco.privacy.autorizzazioni.RichiestaAutorizzazione;
import it.elco.privacy.autorizzazioni.RichiestaAutorizzazioneFactory;
import it.elco.privacy.builders.BeanBuilder;
import it.elco.privacy.exceptions.BeanBuilderException;
import it.elco.privacy.exceptions.RichiestaAutorizzazioniException;

import java.io.IOException;
import java.util.Map;
import java.util.Properties;

import org.apache.log4j.Logger;

/**
 *
 * @author alessandro.arrighi
 */
public class RichiestaAutorizzazioniPrivacyBuilder implements BeanBuilder<RichiestaAutorizzazione>{

    private BeanBuilder<Assistito> assistitoBuilder;
    private final transient Logger logger = Logger.getLogger(getClass());
    
    private RichiestaAutorizzazioniPrivacyBuilder(){        
    }
    
    public RichiestaAutorizzazioniPrivacyBuilder(BeanBuilder<Assistito> assistitoBuilder){
        this.assistitoBuilder = assistitoBuilder;
    }
    
    @Override
    public RichiestaAutorizzazione build(Map<String, Object> data) throws BeanBuilderException {
        
    	try{
    		logger.debug(Json.stringify(data));
    	}catch (IOException e) {
        	logger.warn(e.getMessage(), e);
		}
    	
        try {
        	Properties props = new Properties();        	
        	props.load(this.getClass().getResourceAsStream("/config/properties/privacy.properties"));
        	
            Assistito assistito = assistitoBuilder.build(data);
            CaronteFactory.getApplicationContext();
            RichiestaAutorizzazione richiesta = RichiestaAutorizzazioneFactory.make(assistito,(String) data.get("user"), props);

            if(data.get("emergenzaMedica") != null){
                richiesta.setEmergenzaMedica("true".equals(data.get("emergenzaMedica")) || "1".equals(data.get("emergenzaMedica")));
            }
            
            return richiesta;
        } catch (IOException | RichiestaAutorizzazioniException ex) {
            throw new BeanBuilderException(ex);
        } 
    }
    
}