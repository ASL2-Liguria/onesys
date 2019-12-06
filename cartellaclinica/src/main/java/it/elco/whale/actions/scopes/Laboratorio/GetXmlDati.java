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
package it.elco.whale.actions.scopes.Laboratorio;

import generic.statements.StatementFromFile;
import it.elco.database.DataSourceManager;
import it.elco.privacy.AnagraficaRiferimento;
import it.elco.privacy.PrivacyConfigurations;
import it.elco.privacy.anagrafica.Assistito;
import it.elco.privacy.anagrafica.DecodeAnagraficaWhale;
import it.elco.privacy.exceptions.IdentificazioneAssistitoException;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionParameter;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;
import it.elco.whale.actions.exceptions.ParametersInconsistencyException;
import it.elco.whale.actions.scopes.Database.GetDataSourceFromContext;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author francescog
 */
public class GetXmlDati extends Action {

    public class GetXmlDatiResponse extends ActionResponse {

        private GetXmlDatiResponse(Throwable t) {
            super(t);
        }

        private GetXmlDatiResponse(String document) {
            super(new ActionParameter("document", document));
        }

        public String getDocument() throws Throwable {
            return this.getOutParameterString("document");
        }

    }

    private enum Modalita {

        PAZIENTE, PAZIENTE_REPARTO, RICOVERO
    }

    private enum Branca {

        L, A
    }

    public GetXmlDati(){
        assistito = new Assistito();
    }
    
    @NotNull
    private StatementFromFile sff;

    @NotNull
    private Modalita modalita;
   
    private String idPatient;

    private String reparto, nosologico, elencoEsami, daData, aData, provenienza;
    private Branca branca;
    private Integer numRichieste;
    
    private final Assistito assistito;
    
    private boolean forzaVerificaAnagrafica = false;

    @Setter(key = "sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key = "modalita")
    public void setModalita(String modalita) {
        this.modalita = Modalita.valueOf(modalita);
    }

    @Setter(key = "idPatient")
    public void setIdPatient(String idPatient) {
        if(!"".equals(idPatient) && idPatient != null){
            this.idPatient = idPatient;
            assistito.setIdentificativoAnagrafica(AnagraficaRiferimento.GALLERY.name(), idPatient);
        }
    }

    @Setter(key = "reparto")
    public void setReparto(String reparto) {
        this.reparto = reparto;
    }

    @Setter(key = "nosologico")
    public void setNosologico(String nosologico) {
        this.nosologico = nosologico;
    }

    @Setter(key = "elencoEsami")
    public void setElencoEsami(String elencoEsami) {
        this.elencoEsami = elencoEsami;
    }

    @Setter(key = "daData")
    public void setDaData(String daData) {
        this.daData = daData;
    }

    @Setter(key = "aData")
    public void setaData(String aData) {
        this.aData = aData;
    }

    @Setter(key = "branca")
    public void setBranca(String branca) {
        this.branca = Branca.valueOf(branca);
    }

    @Setter(key = "provenienza")
    public void setProvenienza(String provenienza) {
        this.provenienza = provenienza;
    }

    @Setter(key = "numRichieste")
    public void setNumRichieste(Integer numRichieste) {
        this.numRichieste = numRichieste;
    }

    @Setter(key= "paziente")
    public void setPaziente(Map<String, Object> paziente){
        
        assistito.setNome((String) paziente.get("nome"));
        assistito.setCognome((String) paziente.get("cognome"));
        assistito.setSesso((String) paziente.get("sesso"));
        assistito.setDataNascita((String) paziente.get("dataNascita"));
        assistito.setComuneNascita((String) paziente.get("comuneNascita"));
        assistito.setCodiceFiscale((String) paziente.get("codiceFiscale"));
        
        final String keyIdentificativi = "identificativi";
        
        if(paziente.containsKey(keyIdentificativi)){
            Map<String, String> identificativi = (Map) paziente.get(keyIdentificativi);
            Iterator<String> it = identificativi.keySet().iterator();
            while(it.hasNext()){
                String key = it.next();
                assistito.setIdentificativoAnagrafica(key, identificativi.get(key));
            }
        }
    }
    
    @Setter(key="forzaVerificaAnagrafica")
    public void setForzaVerificaAnagrafica(Boolean forzaVerificaAnagrafica){
        this.forzaVerificaAnagrafica = forzaVerificaAnagrafica;
    }         
    
    @Override
    public GetXmlDatiResponse execute() {

        GetXmlDatiResponse response;

        try {
            checkCoerenzaParametri();

            String[] parameters = new String[12];

            parameters[0] = this.modalita.toString();
            parameters[1] = this.reparto;
            parameters[2] = this.nosologico;
            parameters[3] = this.idPatient;

            parameters[4] = null;
            parameters[5] = this.numRichieste == null ? null : String.valueOf(this.numRichieste);
            parameters[6] = null;
            parameters[7] = this.daData;

            parameters[8] = this.aData;
            parameters[9] = this.elencoEsami;
            parameters[10] = this.provenienza;
            parameters[11] = this.branca == null ? null : this.branca.toString();

            String[] results = this.sff.executeStatement("datiStrutturatiLabo.xml", "getXmlDati", parameters, 2);

            if ("OK".equals(results[0])) {

                if (results[3] != null && !"".equals(results[3])) {
                    throw new Exception(results[3]);
                } else {
                    response = new GetXmlDatiResponse(results[2]);
                }

            } else {
                throw new Exception(results[1]);
            }

        } catch (ParametersInconsistencyException ex) {
            Logger.getLogger(GetXmlDati.class.getName()).log(Level.SEVERE, null, ex);
            response = new GetXmlDatiResponse(ex);
        } catch (Exception ex) {
            Logger.getLogger(GetXmlDati.class.getName()).log(Level.SEVERE, null, ex);
            response = new GetXmlDatiResponse(ex);
        }

        return response;
    }

    /**
     * Verifica la presenza degli specifici parametri per la modalità di ricerca
     * richiesta
     *
     * @throws ParametersInconsistencyException
     */
    private void checkCoerenzaParametri() throws ParametersInconsistencyException {

        switch (this.modalita) {
            case PAZIENTE:
                checkCoerenzaPaziente();
                break;
            case PAZIENTE_REPARTO:
                checkCoerenzaPazienteReparto();
                break;
            case RICOVERO:
                checkCoerenzaRicovero();
                break;
        }

    }
    
    /**
     * Verifica la presenza delle date di riferimento. Se assenti imposta con la
     * data di nascita e la data odierna
     *
     * @throws ParametersInconsistencyException
     */
    private void checkCoerenzaPaziente() throws ParametersInconsistencyException {

        if(forzaVerificaAnagrafica || idPatient == null){
            decodificaPaziente();            
        }
               
        try {
            
            if(daData == null){
                daData = getDataNascita();
            }
                       
        } catch (SQLException ex) {            
            throw new ParametersInconsistencyException(ex);
        }
        
        if (daData == null) {
            daData = "19000101";
        }

        if (aData == null) {
            aData = getToday();
        }

    }
    
    private String getDataNascita() throws SQLException{
        
        String dataNascita = null;
        
        try {
            ResultSet rs = this.sff.executeQuery("ITG/DateRiferimento.xml", "getDataNascitaByIdRemoto", new String[]{idPatient});
            if (rs.next()) {
                dataNascita = rs.getString("DATA");
            }            
            rs.close();
            return dataNascita;
        } catch (Exception ex) {
            throw new SQLException(ex);
        }        
    }

    /**
     * Verifica la presenza delle date di riferimento. Se assenti valorizza con
     * la data di inizio ricovero e data di fine ricovero o data odierna
     * Verifica la presenza di 'nosologico'
     *
     * @throws ParametersInconsistencyException
     */
    private void checkCoerenzaPazienteReparto() throws ParametersInconsistencyException {

        if (this.aData == null) {
            this.aData = getToday();
        }

        if (this.reparto == null) {
            throw new ParametersInconsistencyException(getParametersInconsistencyMessage("reparto"));
        }
    }

    /**
     * Verifica la presenza delle date di riferimento. Se assenti valorizza con
     * la data di inizio ricovero e data di fine ricovero o data odierna
     * Verifica la presenza di 'reparto'
     *
     * @throws ParametersInconsistencyException
     */            
    private void checkCoerenzaRicovero() throws ParametersInconsistencyException {

        checkCoerenzaPaziente();

        if (this.nosologico == null) {
            throw new ParametersInconsistencyException(getParametersInconsistencyMessage("nosologico"));
        }
        
        if (this.daData == null || this.aData == null) {
            try {
                ResultSet rs = this.sff.executeQuery("ITG/DateRiferimento.xml", "getRangeRicoveroByNosologico", new String[]{this.nosologico});
                if (rs.next()) {
                    this.daData = this.daData == null ? rs.getString("DATA_RICOVERO") : this.daData;
                    this.aData = this.aData == null ? rs.getString("DATA_FINE_RICOVERO") : this.aData;
                }
                rs.close();
            } catch (Exception ex) {
                throw new ParametersInconsistencyException(ex);
            }
        }        
    }

    private String getParametersInconsistencyMessage(String nomeParametro) {
        return String.format("Il parametro \"%s\" deve essere valorizzato in modalità \"%s\"", nomeParametro, this.modalita.name());
    }

    private String getToday() {
        Date now = new Date();
        now.setTime(new GregorianCalendar().getTimeInMillis());
        return new SimpleDateFormat("yyyyMMdd").format(now);
    }

    private void decodificaPaziente() throws ParametersInconsistencyException {
        
        try {
            PrivacyConfigurations.init(new Properties());
            DataSourceManager.setDataSource("WHALE", new GetDataSourceFromContext("elcoPool_whale").execute().getDataSource());
            
            new DecodeAnagraficaWhale(assistito).execute();
            
            this.idPatient = assistito.getIdentificativoAnagrafica(AnagraficaRiferimento.GALLERY.name(), false);
            
        } catch (IdentificazioneAssistitoException ex) {            
            throw new ParametersInconsistencyException(ex.getMessage());
        } catch (SQLException ex) {
            throw new ParametersInconsistencyException(ex.getMessage());
        }
    }    
    
}
