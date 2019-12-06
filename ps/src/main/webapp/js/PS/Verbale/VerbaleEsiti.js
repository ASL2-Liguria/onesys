
var NS_ESITI = {

    /**
     * registraDimissione : Effettua Dimissione Contatto PS tramite Servlet PS
     * @param regime
     * @param callback
     */
    registraDimissione: function (regime, callback) {

        var jsonContatto = NS_VERBALE_JSON.getJsonDimissioni(null, true, null ,null ,null);

        if (regime === "OBI") {
            CONTROLLER_PS.UpdatePatientInformation({
                jsonContatto: jsonContatto,
                callback: function () {
                    var p = {"contatto": jsonContatto, "scope": "ps/", servlet: "ChiusuraObi",
                        "notifica": {"show": "S", "timeout": 3, "message": "Chiusura OBI Avvenuta con Successo",
                            "errorMessage": "Chiusura Durante Eliminazione OBI"}, "hl7Event": "CHIUSURA_OBI",
                        "cbkSuccess": function () {
                        }
                    };
                    p.cbkSuccess = function () {
                        callback();
                    };

                    NS_CONTATTO_METHODS.contatto = p.contatto;
                    NS_CONTATTO_METHODS.executeAJAX(p);
                }
            });
        }
        else {
            CONTROLLER_PS.UpdatePatientInformation({
                jsonContatto: jsonContatto,
                callback: function () {
                    CONTROLLER_PS.DischargeVisit({
                        jsonContatto: jsonContatto,
                        callback: function () {
                            callback();
                        }

                    })
                }
            })
        }
    },
    /**
     * Update del contatto dimesso in PS
     * @param callback
     */
    updateDimissioni: function (callback) {

        var jsonContatto = NS_VERBALE_JSON.getJsonDimissioni(null, false, null ,null ,null);

        CONTROLLER_PS.UpdatePatientInformation({
            jsonContatto: jsonContatto,
            callback: function () {
                callback();
            }
        })
    },
    /**
     * updateRicovero : doppio update, sia del contatto di PS che di ADT
     * @param callback
     */
    updateRicovero : function(callback){

        var jsonContatto = NS_VERBALE_JSON.getJsonDimissioni(null, false, null ,null ,null),
            jsonUpdtRicovero = NS_VERBALE_JSON.getjsonUpdateADT(null);

        logger.info("Esito : Update del ricovero in ADT e del contatto PS");

        CONTROLLER_PS.UpdatePatientInformation({
            jsonContatto: jsonContatto,
            callback: function () {
                CONTROLLER_ADT.UpdatePatientInformation({
                    jsonContatto: jsonUpdtRicovero,
                    callback: function () {
                        callback();
                    }
                });
            }
        });

    },
    /**
     * cancelAdmit : Cancella il ricovero di ADT se esso non possiede dati associati
     * @param callback
     */
    cancelAdmit : function (callback) {

        var jsonUpdtRicovero = NS_VERBALE_JSON.getjsonUpdateADT(null);

        CONTROLLER_ADT.CancelAdmission({
            jsonContatto: jsonUpdtRicovero,
            callback: function () {
                NS_ESITI.updateDimissioni(function () {
                    callback();
                });
            }
        });

    },
    /**
     * registraRicovero : Effettua Dimissione con servlet PS. Dopodiche effettua admitVisit con servlet ADT.
     * @param regime
     * @param statoPaziente
     * @param callback
     */
    registraRicovero: function (regime, statoPaziente, callback) {

        var jsonDischarge = "", jsonAdmit = "", p = "";

        if (statoPaziente === "DISCHARGED") {

            logger.info("Esito : paziente dimesso, cambio l'esito in ricovero");

            jsonDischarge = NS_VERBALE_JSON.getJsonDimissioni(null, false, null ,null ,null);
            jsonAdmit = NS_VERBALE_JSON.getJsonRicoveroADT(null);

            p = {
                "servlet" : "EsitoRicoveroDischarged", "scope" :'ps',
                "contatto" : {"A03":jsonDischarge,"A01":jsonAdmit},
                "hl7Event" : "Contatto PS Discharged con esito ricovero ADT",
                "notifica" : {"show" : "N", "timeout" : 3 ,"message" : "Esito Ricovero Avvenuto con Successo", "errorMessage" : "Errore Durante Esito Ricovero"},
                "cbkSuccess" : function () {NS_ESITI.inserisciMovimentoCartella({contatto : NS_CONTATTO_METHODS.contatto, callback : callback});}
            };

            NS_CONTATTO_METHODS.contatto = p.contatto;
            NS_CONTATTO_METHODS.executeAJAX(p);
        }
        else if (regime === "OBI") {

            logger.info("Esito : Chiudo l'obi e ricovero in ADT");

            jsonDischarge = NS_VERBALE_JSON.getJsonDimissioni(null, true, null ,null ,null);
            jsonAdmit = NS_VERBALE_JSON.getJsonRicoveroADT(null);

            p = {
                "servlet" : "EsitoRicoveroObi",
                "scope" :"ps",
                "contatto" : {"A03":jsonDischarge,"A01":jsonAdmit},
                "hl7Event" : "Contatto OBI con esito ricovero ADT",
                "notifica" : {"show" : "N", "timeout" : 3 ,"message" : "Esito Ricovero Obi Avvenuto con Successo", "errorMessage" : "Errore Durante Esito Ricovero Obi"},
                "cbkSuccess" : function () {NS_ESITI.inserisciMovimentoCartella({contatto : NS_CONTATTO_METHODS.contatto, callback : callback});}
            };

            NS_CONTATTO_METHODS.contatto = p.contatto;
            NS_CONTATTO_METHODS.executeAJAX(p);
        }
        else {

            logger.info("Esito : dimetto da PS e ricovero in ADT");

            jsonDischarge = NS_VERBALE_JSON.getJsonDimissioni(null, true, null ,null ,null);
            jsonAdmit = NS_VERBALE_JSON.getJsonRicoveroADT(null);

            p = {
                "servlet" : "EsitoRicovero",
                "scope" :"ps",
                "contatto" : {"A03":jsonDischarge,"A01":jsonAdmit},
                "hl7Event" : "Contatto PS esito ricovero ADT",
                "notifica" : {"show" : "N", "timeout" : 3 ,"message" : "Esito Ricovero Avvenuto con Successo", "errorMessage" : "Errore Esito Ricovero"},
                "cbkSuccess" : function () {NS_ESITI.inserisciMovimentoCartella({contatto : NS_CONTATTO_METHODS.contatto, callback : callback});}
            };

            NS_CONTATTO_METHODS.contatto = p.contatto;
            NS_CONTATTO_METHODS.executeAJAX(p);
        }
    },
    /**
     * RicoveroOBIRimosso : Paziente che dall'OBI viene ricoverato in urgenza con mantieni OBI NO.
     * Elimino l'OBI poi dimetto il paziete e lo ricovero in ADT.
     * @callback
     */
    RicoveroOBIRimosso : function(callback){
        var dataRicovero = $("#h-txtDataRicovero").val() + $("#txtOraRicovero").val(),
            jsonDischarge = NS_VERBALE_JSON.getJsonDimissioni(null, true, dataRicovero, "2", home.baseGlobal.IDEN_ESITO_RICOVERO),
            jsonAdmit = NS_VERBALE_JSON.getJsonRicoveroADT(dataRicovero);

        logger.info("Esito OBI : Annullo l'OBI poi dimetto il paziete e lo ricovero in ADT");

        var p = {
            "servlet" : "EsitoRicoveroObiRimosso",
            "scope" : "ps",
            "contatto" : {"A03":jsonDischarge,"A01":jsonAdmit},
            "hl7Event" : "Contatto OBI con esito ricovero in ADT con cancellazione OBI",
            "notifica" : {
                "show" : "N",
                "timeout" : 3 ,
                "message" : "Eliminazione OBI Avvenuta con Successo.<br />Inserimento Ricovero Avvenuto con Successo",
                "errorMessage" : "Errore durante Eliminazione OBI"
            },
            "cbkSuccess" : function () {
                NS_ESITI.inserisciMovimentoCartella({
                    "contatto" : NS_CONTATTO_METHODS.contatto,
                    "callback" : function(){ callback(); }
                });
            }
        };

        NS_CONTATTO_METHODS.contatto = p.contatto;
        NS_CONTATTO_METHODS.executeAJAX(p);
    },
    /**
     * RicoveroOBIRimossoUpdate : paziente gia' dimesso in OBI, cambio l'esito e loricovero con mantieni OBI NO.
     * Cancello la dimissione (non si possono annullare segmenti discharged ) e poi lancio l'EsitoRicoveroObiRimosso.
     * @param callback
     */
    RicoveroOBIRimossoUpdate : function(callback){
        var dataRicovero = $("#h-txtDataRicovero").val() + $("#txtOraRicovero").val(),
            jsonDischarge = NS_VERBALE_JSON.getJsonDimissioni(null, true, dataRicovero, "2", home.baseGlobal.IDEN_ESITO_RICOVERO),
            jsonAdmit = NS_VERBALE_JSON.getJsonRicoveroADT(dataRicovero);

        logger.info("Esito : Cancello la dimissione, poi annullo l'OBI, dimetto il paziete e lo ricovero in ADT");

        CONTROLLER_PS.CancelDischarge({
            "jsonContatto" : jsonDischarge,
            "callback"     : function () {
                var ObiRimosso = {
                    "scope" : "ps",
                    "servlet" : "EsitoRicoveroObiRimosso",
                    "contatto" : {"A03":jsonDischarge,"A01":jsonAdmit},
                    "hl7Event" : "Contatto OBI con esito ricovero in ADT con cancellazione OBI",
                    "notifica" : {
                        "show" : "N",
                        "timeout" : 3 ,
                        "message" : "Eliminazione OBI Avvenuta con Successo.<br />Inserimento Ricovero Avvenuto con Successo",
                        "errorMessage" : "Errore durante Eliminazione OBI"
                    },
                    "cbkSuccess" : function () {
                        NS_ESITI.inserisciMovimentoCartella({
                            "contatto" : NS_CONTATTO_METHODS.contatto,
                            "callback" : function(){ callback(); }
                        });
                    }
                };

                NS_CONTATTO_METHODS.contatto = ObiRimosso.contatto;
                NS_CONTATTO_METHODS.executeAJAX(ObiRimosso);
            }
        });
    },
    /**
     * updateOBIRimosso : in modifica un paziente ricoverato dopo OBI a cui viene cambiato il reparto e messo in un
     * reparto d'urgenza con il mantieni OBI NO.
     * Cancello la dimissione (non si possono annullare segmenti discharged ) e l'admit, poi lancio l'EsitoRicoveroObiRimosso.
     * @param callback
     */
    updateOBIRimosso : function(callback){
        var dataRicovero = $("#h-txtDataRicovero").val() + $("#txtOraRicovero").val(),
            jsonDischarge = NS_VERBALE_JSON.getJsonDimissioni(null, true, dataRicovero, "2", home.baseGlobal.IDEN_ESITO_RICOVERO),
            jsonVecchioRicovero = NS_VERBALE_JSON.getjsonUpdateADT(dataRicovero),
            jsonNuovoRicovero = NS_VERBALE_JSON.getJsonRicoveroADT(dataRicovero);

        logger.info("Esito : Cancello la dimissione e il ricovero, poi annullo l'OBI, dimetto il paziete e lo ricovero in ADT");

        CONTROLLER_ADT.CancelAdmission({
            "jsonContatto" : jsonVecchioRicovero,
            "callback"     : function () {
                CONTROLLER_PS.CancelDischarge({
                    "jsonContatto" : jsonDischarge,
                    "callback"     : function () {
                        var ObiRimosso = {
                            "scope" : "ps",
                            "servlet" : "EsitoRicoveroObiRimosso",
                            "contatto" : {"A03":jsonDischarge,"A01":jsonNuovoRicovero},
                            "hl7Event" : "Contatto OBI con esito ricovero in ADT con cancellazione OBI",
                            "notifica" : {
                                "show" : "N",
                                "timeout" : 3 ,
                                "message" : "Eliminazione OBI Avvenuta con Successo.<br />Inserimento Ricovero Avvenuto con Successo",
                                "errorMessage" : "Errore durante Eliminazione OBI"
                            },
                            "cbkSuccess" : function () {
                                NS_ESITI.inserisciMovimentoCartella({
                                    "contatto" : NS_CONTATTO_METHODS.contatto,
                                    "callback" : function(){ callback(); }
                                });
                            }
                        };

                        NS_CONTATTO_METHODS.contatto = ObiRimosso.contatto;
                        NS_CONTATTO_METHODS.executeAJAX(ObiRimosso);
                    }
                });
            }
        });
    },

    inserisciMovimentoCartella : function (parameters){
        var idenCdc = $("#txtrepRicovero").data("c-iden");
        var par = {
            datasource : 'ADT',
            params : {
                pStato : {v : '00', t : "V"},
                pIdenContatto : {v : parameters.contatto.id, t : "N"},
                pIdenPer : {v : parameters.contatto.uteInserimento.id, t : "N"},
                pArchivio : {v :  idenCdc, t : "N"},
                pData : {v : moment(parameters.contatto.dataInizio, 'YYYYMMDDHH:mm').format("DD/MM/YYYY HH:mm"), t : "V"},
                P_RESULT : {t : "V", d : "O"}
            },
            id : "ADT_MOVIMENTI_CARTELLA.insert_movimento_cartella" ,
            callbackOK : function (data) {
                if (data['P_RESULT'] == 'OK')
                {
                    if(typeof parameters.callback === 'function' ){
                        parameters.callback();
                    }else{
                        home.NOTIFICA.success({message: "Cartella Inserita Correttamente", title: "success", timeout : 4});
                    }

                }
                else
                {
                    logger.error("Set Stato Cartella INCOMPLETA - ERRORE PROCEDURA Durante Set Stato Cartella log ->" + JSON.stringify(data));
                    home.NOTIFICA.error({message: "Attenzione errore nella modifica di stato cartella", title: "Error"});
                }
            }

        };
        NS_CALL_DB.PROCEDURE(par);
    }

};