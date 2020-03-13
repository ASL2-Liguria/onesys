/* global dwr, toolKitDB */

/**
 * Servizio per esporre alcune funzionalit� di PIC
 *
 * @param {Object} [dwr=window.dwr]
 * @param {Object} [toolKitDB=window.toolKitDB]
 * @returns {PicService}
 */
function PicService(dwr, toolKitDB){
    if(this === window){
        throw new Error("La funzione PicService � un costruttore per cui va invocata antecedendola con la keyword 'new'");
    }

    dwr = dwr || window.dwr;
    toolKitDB = toolKitDB || window.toolKitDB;

    this.search = {
        
    	consensus: function(patientId, tipo, titolare_trattamento) {
        	
        	if (titolare_trattamento === 'undefined' || titolare_trattamento == null || titolare_trattamento == ''){
        		titolare_trattamento = home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
        	}

            var resp = '';

            dwr.engine.setAsync(false);
            toolKitDB.getResultDatasource("MODULI_CONSENSO.RICERCA_CONSENSO", "PORTALE_PIC", {"patient_id": patientId, "tipo": tipo, "titolare_trattamento": titolare_trattamento}, null, function(response) {
                if (response.length !== 0) {
                    resp = response[0];
                }
            });
            dwr.engine.setAsync(true);

            return resp;
        },
        
        documentsForEvent: function(codiceFiscale, listaIdenEventi) {
            var resp = null;

            dwr.engine.setAsync(false);
            toolKitDB.getResultDatasource("MODULI_CONSENSO.RICERCA_DOCUMENTI_PER_EVENTO", "PORTALE_PIC", {"codice_fiscale": codiceFiscale, "lista_iden_eventi": listaIdenEventi}, null, function(response) {
                if (response.length !== 0) {
                    resp = response;
                }
            });
            dwr.engine.setAsync(true);

            return resp;
        },
        
        patient: function(patientId) {
            var resp = '';

            dwr.engine.setAsync(false);
            toolKitDB.getResultDatasource("FUNZIONI.RICERCA_PAZIENTE", "ANAGRAFICA", {"anagrafica": patientId}, null, function(response) {
                if (response.length !== 0) {
                    resp = response[0];
                }
            });
            dwr.engine.setAsync(true);

            return resp;
        },
        
        patient_from_cf: function(patientCF) {
            var resp = '';

            dwr.engine.setAsync(false);
            toolKitDB.getResultDatasource("FUNZIONI.RICERCA_PAZIENTE_FROM_CF", "ANAGRAFICA", {"codice_fiscale": patientCF}, null, function(response) {
                if (response.length !== 0) {
                    resp = response[0];
                }
            });
            dwr.engine.setAsync(true);

            return resp;
        },
        
        user: function(idenPer) {
            var resp = '';

            dwr.engine.setAsync(false);
            toolKitDB.getResultDatasource("FUNZIONI.RICERCA_UTENTE", "ANAGRAFICA", {"iden_per": idenPer}, null, function(response) {
                if (response.length !== 0) {
                    resp = response[0];
                }
            });
            dwr.engine.setAsync(true);

            return resp;
        },
        
        user_by_cod_dec: function(codDec) {
            var resp = '';

            dwr.engine.setAsync(false);
            toolKitDB.getResultDatasource("FUNZIONI.RICERCA_UTENTE_COD_DEC", "ANAGRAFICA", {"cod_dec": codDec}, null, function(response) {
                if (response.length !== 0) {
                    resp = response[0];
                }
            });
            dwr.engine.setAsync(true);

            return resp;
        },
        
        allegato: function(idenConsenso) {
            var resp = '';

            dwr.engine.setAsync(false);
            toolKitDB.getResultDatasource("MODULI_CONSENSO.RICERCA_ALLEGATO", "PORTALE_PIC", {"iden_consenso": idenConsenso}, null, function(response) {
                if (response.length !== 0) {
                    resp = response[0];
                }
            });
            dwr.engine.setAsync(true);

            return resp;
        },
        
        getReportConsenso: function(key_legame, tipo_report) {

        	var resp = null;

            dwr.engine.setAsync(false);
            toolKitDB.getResultDatasource("SDJ.Q_REPORT_CONSENSO", "PORTALE_PIC", {"key_legame": key_legame, "tipo_report": tipo_report}, null, function(response) {
                if (response.length !== 0) {
                    resp = response;
                }
            });
            dwr.engine.setAsync(true);

            return resp;
        }
    };

}
