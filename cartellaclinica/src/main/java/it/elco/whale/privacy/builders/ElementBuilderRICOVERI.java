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
package it.elco.whale.privacy.builders;

import it.elco.core.converters.CalendarFactory;
import it.elco.core.converters.Patterns;
import it.elco.privacy.beans.Evento;
import it.elco.privacy.exceptions.BeanBuilderException;
import it.elco.privacy.reparti.Reparto;

import java.text.ParseException;
import java.util.Map;

/**
 * Builder richiamato da:
 * - it.elco.whale.actions.scopes.Paziente.GetIPatientData.java
 * @author marcoulr <marco.ubertonelarocca at elco.it>
 */
public class ElementBuilderRICOVERI implements it.elco.privacy.builders.ElementBuilder<Evento> {  

    @Override
    public Evento build(Map map) throws BeanBuilderException {
        try {
            boolean existDataInizioEvento = map.containsKey("DATA_INIZIO_EVENTO") && (!"".equals((String) map.get("DATA_INIZIO_EVENTO")) && map.get("DATA_INIZIO_EVENTO") != null);
            boolean existPattern = map.containsKey("PATTERN");
            
            String dataInizioEvento = existDataInizioEvento ? (String) map.get("DATA_INIZIO_EVENTO") : "01/01/1900 00:00";
            String pattern = !existDataInizioEvento ? Patterns.DAY_MONTH_YEAR_HH_MI : !existPattern ? Patterns.ISO : (String) map.get("PATTERN");
            
            Evento evento = new Evento((String) map.get("NUM_NOSOLOGICO"));
            evento.setDataInizio(CalendarFactory.fromString(dataInizioEvento, pattern));
            evento.setRepartoAmmettente(new Reparto((String) map.get("REPARTO_AMMETTENTE")));

//            Evento evento = new Evento((String) map.get("NUM_NOSOLOGICO"));
//            
//            evento.setDataInizio(CalendarFactory.fromString("".equals((String) map.get("DATA_INIZIO_EVENTO")) ? "1900-01-01 00:00:00" : (String) map.get("DATA_INIZIO_EVENTO"), map.containsKey("PATTERN") ? (String) map.get("PATTERN") : Patterns.ISO));            
//            evento.setRepartoAmmettente(new Reparto((String) map.get("REPARTO_AMMETTENTE")));
            
            return evento;
        } catch (ParseException ex) {
            throw new BeanBuilderException(ex);
        }
    }

    @Override
    public String getKeyIdElemento() {
        return "NUM_NOSOLOGICO";
    }

    @Override
    public String getKeyMotivazioneVisualizzazione() {
        return "MOTIVAZIONE_VISUALIZZAZIONE";
    }
    
}
