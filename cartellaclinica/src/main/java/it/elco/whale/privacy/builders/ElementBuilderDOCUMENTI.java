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
import it.elco.database.actions.CloseResultSet;
import it.elco.privacy.beans.Evento;
import it.elco.privacy.beans.Oscuramento;
import it.elco.privacy.beans.Oscuramento.MotivazioneOscuramento;
import it.elco.privacy.beans.XdsDocument;
import it.elco.privacy.exceptions.BeanBuilderException;
import it.elco.privacy.reparti.Reparto;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.Map;

/**
 * 
 * @author marcoulr <marco.ubertonelarocca at elco.it>
 */
public class ElementBuilderDOCUMENTI implements
		it.elco.privacy.builders.ElementBuilder<XdsDocument> {

	@Override
	public XdsDocument build(Map<String, Object> data) throws BeanBuilderException {
		
		XdsDocument document =null;
		try {
			document = new XdsDocument((String) data.get("ID"));

			/*
			 * Calendar creationTime = new GregorianCalendar();
			 * creationTime.setTimeInMillis(((Timestamp)
			 * data.get("CREATIONTIME")).getTime());
			 * document.setData(creationTime);
			 */

			document.setData(CalendarFactory.fromString(
					(String) data.get("CREATIONTIME"), Patterns.ISO + " "
							+ Patterns.HH_MI));

			if (data.get("NOSOLOGICO") != null) {
				document.setEvento(new Evento((String) data.get("NOSOLOGICO")));
			}

			Oscuramento oscuramento = null;
			oscuramento = new Oscuramento(data.get("OSCURAMENTO") == null ? Oscuramento.LivelloOscuramento.V.name() : (String) data.get("OSCURAMENTO"));

			if (data.get("MOTIVAZIONI_OSCURAMENTO") != null) {
				ResultSet rs = (ResultSet) data.get("MOTIVAZIONI_OSCURAMENTO");
				while (rs.next()) {
					oscuramento.addMotivazioneOscuramento(new MotivazioneOscuramento(rs.getString("VALUE")));
				}
				new CloseResultSet(rs).execute();
			}
			
			document.setOscuramento(oscuramento);			
			
			if (data.get("REDATTORE") != null) {
				document.setRedattore(new Reparto((String) data.get("REDATTORE")));
			}

			if (data.get("RICHIEDENTE") != null) {
				document.setRichiedente(new Reparto((String) data.get("RICHIEDENTE")));
			}

		} catch (ParseException ex) {
			throw new BeanBuilderException(ex);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return document;
	}

	@Override
	public String getKeyMotivazioneVisualizzazione() {
		return "MOTIVAZIONE_VISUALIZZAZIONE";
	}

	@Override
	public String getKeyIdElemento() {
		return "ID";
	}

}
