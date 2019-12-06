var NS_ELIMINA_ESITI = {

    /**
     * callEliminaEsitoPS : funzione che carica i json utilizzati e li passa alla funzione per l'eliminazione dell'esito
     * @param idenContatto
     * @param idenContattoRicovero
     * @param idenSchedaVerbale
     * @param callback
     * @returns {boolean}
     */
    callEliminaEsitoPS : function(idenContatto, idenContattoRicovero, idenSchedaVerbale, callback) {

        home.NS_CONSOLEJS.addLogger({name: "EliminaEsito", console: 0});
        window.logger = home.NS_CONSOLEJS.loggers["EliminaEsito"];

        var jsonContatto, jsonContattoRicovero;

        if (home.NS_FUNZIONI_PS.hasAValue(idenContatto)) {
            NS_CONTATTO_METHODS.getContattoById(idenContatto,
                {
                    "cbkSuccess": function () {
                        jsonContatto = NS_CONTATTO_METHODS.contatto;
                        if (home.NS_FUNZIONI_PS.hasAValue(idenContattoRicovero)) {
                            NS_CONTATTO_METHODS.getContattoById(idenContattoRicovero,
                                {
                                    "cbkSuccess": function () {
                                        jsonContattoRicovero = NS_CONTATTO_METHODS.contatto;
                                        NS_ELIMINA_ESITI.eliminaEsitoPS(jsonContatto,jsonContattoRicovero,idenSchedaVerbale,callback);
                                    }

                                });
                        } else {
                            NS_ELIMINA_ESITI.eliminaEsitoPS(jsonContatto,null,idenSchedaVerbale,callback);
                        }

                    }
                }
            );
        } else {
            home.NOTIFICA.error({message: "Contatto non definito \nImpossibile cancellare", title: "Error", timeout: 0});
            return false;
        }
    },
    /**
     * eliminaEsitoPS : elimina i diversi tipi di esito
     * @param jsonContatto
     * @param jsonContattoRicovero
     * @param idenSchedaVerbale
     * @param callback
     */
    eliminaEsitoPS : function(jsonContatto, jsonContattoRicovero, idenSchedaVerbale, callback){

        var idenContattoRicovero, codiceRicovero , text, repartoRicoveroGiu, repartoRicoveroAss,
            statoContatto= jsonContatto.stato.codice,
            regimeContatto = jsonContatto.contattiGiuridici[jsonContatto.contattiGiuridici.length - 1].regime.codice,
            selectUbicazione = $("#selectUbicazione");

        if (home.NS_FUNZIONI_PS.hasAValue(jsonContattoRicovero)) {
            idenContattoRicovero = jsonContattoRicovero.id;
            codiceRicovero = jsonContattoRicovero.codice.codice;
            repartoRicoveroGiu = jsonContattoRicovero.contattiGiuridici[jsonContattoRicovero.contattiGiuridici.length - 1].provenienza.id;
            repartoRicoveroAss = jsonContattoRicovero.contattiAssistenziali[jsonContattoRicovero.contattiAssistenziali.length - 1].provenienza.id;

        }

        if(regimeContatto === "OBI" && statoContatto === "ADMITTED") {

            text = $('<p>Scegliere Ubicazione</p><select id="selectUbicazione"></select>');

            var parametri = {
                "datasource": "PS",
                "id": "PS.Q_UBICAZIONE",
                "params": {
                    "iden_cdc": {v: Number(home.baseUserLocation.iden)}
                },
                "callbackOK": function (resp) {
                    var opt = "";
                    for (var i = 0; i < resp.result.length; i++) {
                        opt = $('<option data-iden_cdc="' + resp.result[i].VALUE + '">' + resp.result[i].DESCR + '</option>');
                        $("#selectUbicazione").append(opt);
                    }
                    selectUbicazione.css("width", "100%").css("width", "auto");
                }
            };

            NS_CALL_DB.SELECT(parametri);

        } else {

            text = "Si desidera eliminare l'esito di Pronto Soccorso per il paziente : " + jsonContatto.anagrafica.cognome + " " + jsonContatto.anagrafica.nome + " ?";
        }

        $.dialog(text, {
            title: "Attenzione",
            buttons: [
                {label: "NO", action: function () {
                    $.dialog.hide();
                }},
                {label: "SI", action: function () {
                    $.dialog.hide();

                    selectUbicazione = $("#selectUbicazione");

                    if ( selectUbicazione.length ){ var ubicazione = selectUbicazione.find("option:selected").data("iden_cdc"); }

                    //paziente aperto con esito OBI
                    if ((statoContatto === "ADMITTED")) {

                        if(regimeContatto === "OBI" && home.NS_FUNZIONI_PS.hasAValue(ubicazione)){

                            jsonContatto.mapMetadatiString["UBICAZIONE"] = String(ubicazione);

                            NS_ELIMINA_ESITI.eliminaEsitoOBI(jsonContatto, String(ubicazione), callback);
                        } else {
                            logger.error("Errore eliminaEsitoPS : ubicazione="+ubicazione + ", regimeContatto="+regimeContatto);
                        }

                    //paziente chiuso con esito ricovero
                    } else if ( (home.NS_FUNZIONI_PS.hasAValue(idenContattoRicovero)) ) {

                        home.NS_FUNZIONI_PS.hasDatiAccesso(codiceRicovero, function(){
                            //ha dei dati
                            if(home.NS_FUNZIONI_PS.isRepartoUrgenza(repartoRicoveroGiu) || home.NS_FUNZIONI_PS.isRepartoUrgenza(repartoRicoveroAss)) {

                                home.NS_LOADING.hideLoading();
                                //uno dei due reparti is medicina urgenza
                                $.dialog("Proseguendo si perderanno tutti i dati relativi al ricovero in Medicina di Urgenza. \nSi vuole procedere? ",{
                                    title: "Attenzione",
                                    buttons: [
                                        {label: "NO", action: function () {
                                            $.dialog.hide();
                                        }},
                                        {label: "SI", action: function () {
                                            $.dialog.hide();
                                            //ha dati ma e' un urgenza e posso cancellare pur perdendo i dati
                                            NS_ELIMINA_ESITI.eliminaEsitoRicovero(jsonContatto, jsonContattoRicovero, regimeContatto, idenSchedaVerbale, callback);
                                        }}
                                    ]
                                });

                            } else {
                                // ha dati e non è urgenza non posso cancellare
                                home.NOTIFICA.warning({timeout:0, message: "Sono presenti dei dati legati al ricovero. \nImpossibile cancellare", title: "Error"});
                                home.NS_LOADING.hideLoading();
                            }
                        //nessun dato
                        }, function(){
                            NS_ELIMINA_ESITI.eliminaEsitoRicovero(jsonContatto, jsonContattoRicovero, regimeContatto, idenSchedaVerbale, callback);
                        });

                    //paziente chiuso con esito dimesso
                    } else {
                        NS_ELIMINA_ESITI.eliminaEsitoDimissione(jsonContatto, idenSchedaVerbale, regimeContatto, callback);
                    }
                }}
            ]
        });
    },
    /**
     * eliminaEsitoDimissione : elimina gli esiti dimissione
     * @param jsonContatto
     * @param idenSchedaVerbale
     * @param regimeContatto
     * @param callback
     */
    eliminaEsitoDimissione : function(jsonContatto, idenSchedaVerbale, regimeContatto, callback) {

        home.NS_LOADING.showLoading({"timeout": 2, "testo": "ELIMINAZIONE", "loadingclick": function () { /*home.NS_LOADING.hideLoading();*/ }});

        if(regimeContatto === "OBI"){

            logger.info("eliminaEsitoPS : elimina la chiusura OBI");

            var pAnnullaChiusuraObi = {
                "contatto" : jsonContatto,
                "scope" : "ps/", servlet : "AnnullaChiusuraObi",
                "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Annulla Chiusura OBI Avvenuta con Successo",
                    "errorMessage" : "Errore Durante Annulla Chiusura OBI"}, "hl7Event" : "ELIMINA_OBI",
                "cbkSuccess" : function() {
                    NS_ELIMINA_ESITI.deleteEsito({
                        iden: idenSchedaVerbale,
                        callback: function () {
                            home.NS_LOADING.hideLoading();
                            if(typeof callback === "function"){callback();}
                        }
                    });
                }
            };
            NS_CONTATTO_METHODS.contatto = pAnnullaChiusuraObi.contatto;
            NS_CONTATTO_METHODS.executeAJAX(pAnnullaChiusuraObi);

        } else {

            logger.info("eliminaEsitoPS : si elimina solo la dimissione");

            CONTROLLER_PS.CancelDischarge({
                jsonContatto: jsonContatto,
                callback: function () {
                    NS_ELIMINA_ESITI.deleteEsito({
                        iden: idenSchedaVerbale,
                        callback: function () {
                            home.NS_LOADING.hideLoading();
                            if(typeof callback === "function"){callback();}
                        }
                    });
                }
            });
        }
    },
    /**
     * eliminaRicovero : elimina i ricoveri a seconda del regime
     * @param jsonContatto
     * @param jsonContattoRicovero
     * @param regimeContatto
     * @param idenSchedaVerbale
     * @param callback
     */
    eliminaEsitoRicovero : function(jsonContatto, jsonContattoRicovero, regimeContatto, idenSchedaVerbale, callback) {

        home.NS_LOADING.showLoading({"timeout": 2, "testo": "ELIMINAZIONE", "loadingclick": function () { /*home.NS_LOADING.hideLoading();*/ }});

        if(regimeContatto === "OBI"){

            logger.info("eliminaEsitoPS : elimino ricovero in ADT e la chiusura OBI");

            CONTROLLER_ADT.CancelAdmission({
                jsonContatto: jsonContattoRicovero,
                callback: function () {
                    var pAnnullaChiusuraObi = {
                        "contatto" : jsonContatto,
                        "scope" : "ps/",
                        "servlet" : "AnnullaChiusuraObi",
                        "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Annulla Chiusura OBI Avvenuta con Successo",
                            "errorMessage" : "Errore Durante Annulla Chiusura OBI"}, "hl7Event" : "ANNULLA_CHIUSURA_OBI",
                        "cbkSuccess" : function(){
                            NS_ELIMINA_ESITI.deleteEsito({
                                "iden": idenSchedaVerbale,
                                callback: function () {
                                    home.NS_LOADING.hideLoading();
                                    if(typeof callback === "function"){callback();}
                                }
                            });
                        }};

                    NS_CONTATTO_METHODS.contatto = pAnnullaChiusuraObi.contatto;
                    NS_CONTATTO_METHODS.executeAJAX(pAnnullaChiusuraObi);
                }
            });
        }
        else {

            logger.info("eliminaEsitoPS : elimino il ricovero in ADT e la dimissione da PS");

            CONTROLLER_ADT.CancelAdmission({
                jsonContatto: jsonContattoRicovero,
                callback: function () {
                    CONTROLLER_PS.CancelDischarge({
                        jsonContatto: jsonContatto,
                        callback: function () {
                            NS_ELIMINA_ESITI.deleteEsito({
                                iden: idenSchedaVerbale,
                                callback: function () {
                                    home.NS_LOADING.hideLoading();
                                    if(typeof callback === "function"){callback();}
                                }
                            })
                        }
                    })
                }
            });
        }
    },
    /**
     * eliminaEsitoOBI : cancella il trasferimento giuridic con regime OBI e riporta il paziente in un ubicazione non OBI
     * @param jsonContatto
     * @param ubicazione
     * @param callback
     */
    eliminaEsitoOBI : function (jsonContatto, ubicazione, callback) {

        home.NS_LOADING.showLoading({"timeout": 2, "testo": "ELIMINAZIONE", "loadingclick": function () { /*home.NS_LOADING.hideLoading();*/ }});

        logger.info("eliminaEsitoPS : Nessun ricovero o dimissione ancora effettuati sul paziente, elimino solo OBI");

        var  idenContatto = jsonContatto.id;

        var pEliminaObi = {
            "contatto" : jsonContatto,
            "scope" : "ps/",
            "servlet" : "EliminaObi",
            "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Eliminazione OBI Avvenuta con Successo",
                "errorMessage" : "Errore Durante Eliminazione OBI"}, "hl7Event" : "ELIMINA_OBI",
            "cbkSuccess" : function(){
                NS_ELIMINA_ESITI.eliminaPrestazioneOBI({
                    "iden_contatto": idenContatto,
                    "iden_per": home.baseUser.IDEN_PER,
                    "callback": function () {
                        var parameters = {
                            "P_IDEN_CONTATTO" : {t:"N", v:idenContatto },
                            "P_KEY_LIST"      : {v:["UBICAZIONE"], t:"A"},
                            "P_VALUE_LIST"    : {v:[ubicazione], t:"A"},
                            "P_TYPE_LIST"     : {v:["S"], t:"A"}
                        };
                        var parametri = {
                            "datasource": "PS",
                            "id": "ADT$ADT_CONTATTI.UPDATE_METADATI_CONTATTO",
                            "params": parameters,
                            "callbackOK": function() {
                                home.NS_LOADING.hideLoading();
                                if(typeof callback === "function"){callback();}
                            }
                        };
                        NS_CALL_DB.PROCEDURE(parametri);
                    }
                });
            }
        };
        NS_CONTATTO_METHODS.contatto = pEliminaObi.contatto;
        NS_CONTATTO_METHODS.executeAJAX(pEliminaObi);
    },
    /**
     * deleteEsito : svuota il campo esito nell'xml del verbale
     * @param json ={iden: 01 , callback : function}
     */
    deleteEsito : function (json) {

        var db = $.NS_DB.getTool();

        var dbParams = {
            "pidenSchedaVerbale" : {"v": json.iden, "t": "N"},
            "pResult"    : {"d": "O"}
        };

        var xhr= db.call_procedure({
            datasource: "PS",
            id: "SP_ELIMINA_ESITO",
            parameter: dbParams
        });

        xhr.done(function (response) {
            logger.info("deleteEsito eseguita con successo : " + JSON.stringify(response));
            if(typeof json.callback === "function"){json.callback();}
        });

        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("Errore nella chiamata a deleteEsito : \n" + JSON.stringify(jqXHR) + "\n" +
            JSON.stringify(textStatus) + "\n" + JSON.stringify(errorThrown));
        });
    },
    /**
     * eliminaOBI : elimina la prestazione di OBI
     * @param json
     */
    eliminaPrestazioneOBI : function (json) {

        var db = $.NS_DB.getTool();

        var dbParams = {
            "pIdenContatto": {v: json.iden_contatto, t: "N"},
            "pUteIns": {v: json.iden_per, t: "N"},
            "p_result": {"d": "O", t: "V"}
        };

        var xhr = db.call_procedure({
            datasource: "PS",
            id: "SP_ELIMINA_OBI",
            parameter: dbParams
        });

        xhr.done(function (response) {
            var resp = response.p_result.split("$");

            if (resp[0] == "OK") {
                logger.info("eliminaPrestazioneOBI : cancellazione effettuata correttamente, " + resp[1]);
                if(typeof json.callback === "function"){json.callback();}
            }
            else if (resp[0] == "OKNOOBI") {
                logger.info("eliminaPrestazioneOBI : nessuna prestazione di Obi associata, " + resp[1]);
                if(typeof json.callback === "function"){json.callback();}
            }
            else {
                home.NOTIFICA.error({message: "eliminaPrestazioneOBI \n" + resp[1], title: "Error"});
                logger.error("eliminaPrestazioneOBI " + JSON.stringify(response));
            }

        });

        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("Errore nella chiamata eliminaPrestazioneOBI :  \n" + JSON.stringify(jqXHR) + "\n" +
            JSON.stringify(textStatus) + "\n" + JSON.stringify(errorThrown));
        });
    }

};