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

import generic.statements.StatementFromFile;
import it.elco.core.converters.CalendarFactory;
import it.elco.database.actions.CloseResultSet;
import it.elco.privacy.TipologiaAccesso;
import it.elco.privacy.anagrafica.Assistito;
import it.elco.privacy.autorizzazioni.RichiestaAutorizzazione;
import it.elco.privacy.beans.Evento;
import it.elco.privacy.beans.Oscuramento;
import it.elco.privacy.beans.Oscuramento.MotivazioneOscuramento;
import it.elco.privacy.beans.XdsDocument;
import it.elco.privacy.builders.ElementBuilder;
import it.elco.privacy.predicates.richiesta.PredicateRichiestaFactoryImpl;
import it.elco.privacy.reparti.Reparto;
import it.elco.whale.actions.scopes.Esami.beans.Richiesta;
import it.elco.whale.privacy.RichiestaAutorizzazioneFactoryWhale;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.common.base.Predicate;

/**
 *
 * @author francescog
 */
public class PredicateRichiesteFactory implements PredicateFactory {

    private List<XdsDocument> listDocument;

    public PredicateRichiesteFactory() {
    	listDocument = new ArrayList<XdsDocument>();
    }

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
        richiesta.setTipologiaAccesso(checkTipologiaAccesso((String)parameters.get("tipologia_accesso")), new Evento(parameters.get("evento_corrente")==null?"":(String)parameters.get("evento_corrente")));
        
//        setListDocument((String) parameters.get("id_remoto"), (String) parameters.get("codice_fiscale"), (StatementFromFile) parameters.get("sff"));
        setListDocument((String) parameters.get("id_remoto"), (String) parameters.get("codice_fiscale"), (StatementFromFile) parameters.get("sff"), (String) parameters.get("query"));

        Class clsBuilder = Class.forName((String) parameters.get("builderClass"));
        ElementBuilder<Richiesta> builder = (ElementBuilder<Richiesta>) clsBuilder.getDeclaredConstructor(new Class[]{List.class}).newInstance(getListDocument());

        Predicate predicate = new PredicateRichiestaFactoryImpl().getPredicate(richiesta, builder);

        return predicate;
    }

    public List<XdsDocument> getListDocument() {
        return listDocument;
    }

    public void setListDocument(String id1, String cf, StatementFromFile sff) {
        ResultSet rs = null;
        try {
            rs = sff.executeQuery("consensi.xml", "getListDocumentPatient", new String[]{id1, cf});
            while (rs.next()) {
                XdsDocument document = new XdsDocument(rs.getString("ID"));
                Calendar creationTime = new GregorianCalendar();
                document.setData(CalendarFactory.fromString("".equals(rs.getString("CREATIONTIME")) ? "1900-01-01 00:00:00" : rs.getString("CREATIONTIME")));
                document.setEvento(new Evento(rs.getString("NUM_NOSOLOGICO")));
                
                document.setRichiesta(rs.getString("ID_RICHIESTA"));
                
                Oscuramento oscuramento = null;
    			oscuramento = new Oscuramento(rs.getString("OSCURAMENTO") == null || "".equalsIgnoreCase(rs.getString("OSCURAMENTO")) ? Oscuramento.LivelloOscuramento.V.name() : (String) rs.getString("OSCURAMENTO"));                
                /*Per le successive colonne, Motivazioni oscuramento/Redattore/Richiedente controllo, prima controllo la loro presenza dentro al resultset*/              
                if (isThere(rs,"MOTIVAZIONI_OSCURAMENTO")){
        			if (rs.getObject("MOTIVAZIONI_OSCURAMENTO") != null ) {
        				ResultSet rs2 = (ResultSet) rs.getObject("MOTIVAZIONI_OSCURAMENTO");
        				while (rs2.next()) {
        					oscuramento.addMotivazioneOscuramento(new MotivazioneOscuramento(rs2.getString("VALUE")));
        				}
        				new CloseResultSet(rs2).execute();
        			}                	
                }
    			
                document.setOscuramento(oscuramento); 
                
    			if (isThere(rs,"REDATTORE")){
                    if (rs.getString("REDATTORE") != null || !"".equalsIgnoreCase(rs.getString("REDATTORE"))) {    			
        				document.setRedattore(new Reparto(rs.getString("REDATTORE")));
        			}    				
    			}

    			if (isThere(rs,"RICHIEDENTE")){
        			if (rs.getString("RICHIEDENTE") != null || !"".equalsIgnoreCase(rs.getString("RICHIEDENTE"))) {
        				document.setRichiedente(new Reparto(rs.getString("RICHIEDENTE")));
        			}    				
    			}
                
    			this.listDocument.add(document);
            }
			
        } catch (Exception ex) {
            Logger.getLogger(PredicateRichiesteFactory.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
            	new CloseResultSet(rs).execute();
            } catch (SQLException ex) {
                Logger.getLogger(PredicateRichiesteFactory.class.getName()).log(Level.SEVERE, null, ex);
            }
            sff.close();
        }
    }

    public void setListDocument(String id1, String cf, StatementFromFile sff, String query) {
        ResultSet rs = null;
        try {
            rs = sff.executeQuery("consensi.xml", query, new String[]{id1, cf});
            while (rs.next()) {
                XdsDocument document = new XdsDocument(rs.getString("ID"));
                Calendar creationTime = new GregorianCalendar();
                document.setData(CalendarFactory.fromString("".equals(rs.getString("CREATIONTIME")) ? "1900-01-01 00:00:00" : rs.getString("CREATIONTIME")));
                document.setEvento(new Evento(rs.getString("NUM_NOSOLOGICO")));
                document.setRichiesta(rs.getString("ID_RICHIESTA"));
                Oscuramento oscuramento = null;
                oscuramento = new Oscuramento(rs.getString("OSCURAMENTO") == null || "".equalsIgnoreCase(rs.getString("OSCURAMENTO")) ? Oscuramento.LivelloOscuramento.V.name() : (String) rs.getString("OSCURAMENTO"));
                /*Per le successive colonne, Motivazioni oscuramento/Redattore/Richiedente controllo, prima controllo la loro presenza dentro al resultset*/
                if (isThere(rs,"MOTIVAZIONI_OSCURAMENTO")){
        			if (rs.getObject("MOTIVAZIONI_OSCURAMENTO") != null ) {
        				ResultSet rs2 = (ResultSet) rs.getObject("MOTIVAZIONI_OSCURAMENTO");
        				while (rs2.next()) {
        					oscuramento.addMotivazioneOscuramento(new MotivazioneOscuramento(rs2.getString("VALUE")));
        				}
        				new CloseResultSet(rs2).execute();
        			}                	
                }

                document.setOscuramento(oscuramento); 
                
    			if (isThere(rs,"REDATTORE")){
                    if (rs.getString("REDATTORE") != null || !"".equalsIgnoreCase(rs.getString("REDATTORE"))) {    			
        				document.setRedattore(new Reparto(rs.getString("REDATTORE")));
        			}    				
    			}

    			if (isThere(rs,"RICHIEDENTE")){
        			if (rs.getString("RICHIEDENTE") != null || !"".equalsIgnoreCase(rs.getString("RICHIEDENTE"))) {
        				document.setRichiedente(new Reparto(rs.getString("RICHIEDENTE")));
        			}    				
    			}
                this.listDocument.add(document);
            }
        } catch (Exception ex) {
            Logger.getLogger(PredicateRichiesteFactory.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
            	new CloseResultSet(rs).execute();
            } catch (SQLException ex) {
                Logger.getLogger(PredicateRichiesteFactory.class.getName()).log(Level.SEVERE, null, ex);
            }
            sff.close();
        }
    }
    
    private boolean isThere(ResultSet rs, String column) throws SQLException
    {
    	ResultSetMetaData rsMetaData = rs.getMetaData();
    	int numberOfColumns = rsMetaData.getColumnCount();
    	boolean check = false;
    	// get the column names; column indexes start from 1
    	for (int i = 1; i < numberOfColumns + 1; i++) {
    	    String columnName = rsMetaData.getColumnName(i);
    	    // Get the name of the column's table name
    	    if (column.equals(columnName)) {
    	        check =  true;
    	    }
    	}
    	
    	return check;
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
