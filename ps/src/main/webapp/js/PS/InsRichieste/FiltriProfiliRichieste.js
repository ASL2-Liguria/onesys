var NS_PROFILI_RICHIESTE = {
    /**
     * Alla selezione dell'erogatore, se salvati, creo dei pulsanti con
     * i profili preferiti da tab_esa_gruppi con SITO='OE_PROFILO'.
     * */
    loadButProfili: function (destinatario, cod_cdc, urgenza) {
        home.NS_CONSOLEJS.addLogger({name: 'NS_PROFILI_RICHIESTE', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_PROFILI_RICHIESTE'];

        $("#spanButProfili").empty();
        var params = {
            destinatario: destinatario,
            sito_gruppo: "OE_PROFILO",
            cod_cdc: cod_cdc,
            urgenza : String(urgenza)
        };

        var parametri = {
            "datasource": "WHALE",
            "id": "OE.BUT_PROFILO",
            "params": params,
            "callbackOK": callbackOk
        };
        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            var resp = data.result;
            if (resp == "" || resp == null || typeof resp == "undefined") {
                logger.warn("loadButProfili non riuscito con destinatario : " + params.destinatario + " sito_gruppo : " +
                    params.sito_gruppo + " cod_cdc : " + params.cod_cdc + "\n " + JSON.stringify(resp));
            } else {
                var count = 0;
                $.each(resp, function () {
                    var button;
                    if (MAIN_INS_RICHIESTE.isIE) {
                        button = document.createElement("input");
                        button.innerText = resp[count].DESCR;
                    } else {
                        button = document.createElement("button");
                        button.innerHTML = resp[count].DESCR;
                    }
                    button.type = "button";
                    button.id = "butPref" + count;
                    button.className = "btn OEPROFILO";
                    button.setAttribute("data-cod_cdc", resp[count].DESTINATARIO);
                    button.setAttribute("data-coddec", resp[count].COD_DEC);
                    button.setAttribute("data-codgruppo", resp[count].COD_GRUPPO);
                    button.setAttribute("data-urgenza", resp[count].URGENZA);
                    button.setAttribute("onclick", 'NS_PROFILI_RICHIESTE.loadProfili("' + resp[count].COD_GRUPPO + '","OE_PROFILO","' + params.cod_cdc + '","' + resp[count].DESTINATARIO + '","' + resp[count].URGENZA + '");');
                    $("#spanButProfili").append(button);

                    count++;
                });
                $("#divProfili").show();
            }
        }

    },
    /**
     * Creo, al load della pagina, dei pulsanti per ogni profilo multidisciplinare
     * salvato su tab_esa_gruppi con SITO='OE_PROFILO_MULTI'.
     * */
    loadButProfiliMulti: function () {
        home.NS_CONSOLEJS.addLogger({name: 'NS_PROFILI_RICHIESTE', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_PROFILI_RICHIESTE'];

        $("#divProfiliMulti").empty();

        var params = {
            sito_gruppo: "OE_PROFILO_MULTI",
            cod_cdc: $("#COD_CDC_PS").val()
        };

        var parametri = {
            "datasource": "WHALE",
            "id": "OE.BUT_PROFILI_MULTI",
            "params": params,
            "callbackOK": callbackOk
        };
        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            var resp = data.result;
            if (resp == "" || resp == null || typeof resp == "undefined") {
                logger.warn("loadButProfiliMulti non riuscito per " + " sito_gruppo : " +
                    params.sito_gruppo + " cod_cdc : " + params.cod_cdc + "\n resp : " + JSON.stringify(resp));
            } else {
                var count = 0;
                $.each(resp, function () {
                    var button;

                    if (MAIN_INS_RICHIESTE.isIE) {
                        button = document.createElement("input");
                        button.innerText = resp[count].DESCR;
                    } else {
                        button = document.createElement("button");
                        button.innerHTML = resp[count].DESCR;
                    }
                    button.type = "button";
                    button.id = "butProfMulti" + count;
                    button.className = "btn OEPROFILOMULTI";
                    button.setAttribute("data-codgruppo", resp[count].COD_GRUPPO);
                    button.setAttribute("onclick", 'NS_PROFILI_RICHIESTE.loadProfiliMulti("' + resp[count].COD_GRUPPO + '", "OE_PROFILO_MULTI","' + resp[count].REPARTO + '")');
                    $("#divProfiliMulti").append(button);
                    count++;
                });
                $("#divProfiliMulti").show();
            }
        }
    },
    /**
     * Al click dei pulsanti Profili riempe il combolist con il gruppo
     * di prestazioni predefinite caricate da tab_esa_gruppi.
     */
    loadProfili: function (codice_gruppo, sito_gruppo, cdc_richiedente, cdc_destinatario, urgenza) {

        home.NS_CONSOLEJS.addLogger({name: 'NS_PROFILI_RICHIESTE', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_PROFILI_RICHIESTE'];

        var params = {
            cod_gruppo: codice_gruppo,
            sito_gruppo: sito_gruppo,
            reparto_richiedente: cdc_richiedente,
            reparto_destinartario: cdc_destinatario,
            urgenza : urgenza
        };
        var parametri = {
            "datasource": "WHALE",
            "id": "OE.PROFILO",
            "params": params,
            "callbackOK": callbackOk
        };
        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            var resp = data.result;
            if (resp == "" || resp == null || typeof resp == "undefined") {
                logger.warn("loadProfili non riuscito per \ncodGGruppo : " + params.cod_gruppo + " sitoGruppo : " +
                    params.sito_gruppo + " reparto_richiedente : " + params.reparto_richiedente +
                    " reparto_destinartario : " + params.reparto_destinartario);
            } else {

                var count = 0;
                $.each(resp, function () {
                    if (sito_gruppo == "OE_DEFAULT" && (home.baseUser.TIPO_PERSONALE==="I" || home.baseUser.TIPO_PERSONALE==="OST")) {

                        if(NS_PREFERITI_RICHIESTE.checkEsamiInseriti(resp[count].COD_ESA))
                        {
                            MAIN_INS_RICHIESTE.ComboList.controlloComboList(resp[count].IDEN, resp[count].URGENZA, resp[count].METODICA, resp[count].DESTINATARIO, resp[count].DESCR, resp[count].DESCR_REPARTO, resp[count].COD_DEC, resp[count].COD_ESA);
                        }
                        count++;
                    }
                    else {

                        var param = {
                            COD_DEC: resp[count].COD_DEC,
                            COD_ESA: resp[count].COD_ESA,
                            COD_CDC : resp[count].COD_CDC,
                            ESAME: resp[count].DESCR,
                            DESCR_REPARTO: resp[count].DESCR_REPARTO,
                            DESTINATARIO: resp[count].DESTINATARIO,
                            IDEN: resp[count].IDEN,
                            METODICA: resp[count].METODICA,
                            URGENZA: resp[count].URGENZA
                        };

                        if(NS_PREFERITI_RICHIESTE.checkEsamiInseriti(resp[count].COD_ESA)){
                            MAIN_INS_RICHIESTE.aggiungiPrestazione(param);
                        }
                        count++;
                    }

                });
            }
        }
    },
    /**
     * Carica i profili multidisciplinari
     * @param codice_gruppo
     * @param sito_gruppo
     * @param cdc_richiedente
     */
    loadProfiliMulti: function (codice_gruppo, sito_gruppo, cdc_richiedente) {

        home.NS_CONSOLEJS.addLogger({name: 'NS_PROFILI_RICHIESTE', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_PROFILI_RICHIESTE'];

        var params = {
            cod_gruppo: codice_gruppo,
            sito_gruppo: sito_gruppo,
            reparto_richiedente: cdc_richiedente
        };
        var parametri = {
            "datasource": "WHALE",
            "id": "OE.PROFILO_MULTI",
            "params": params,
            "callbackOK": callbackOk
        };
        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            var resp = data.result;
            if (resp == "" || resp == null || typeof resp == "undefined") {

                logger.warn("loadProfiliMulti non riuscito per \ncodGGruppo : "+params.cod_gruppo+" sitoGruppo : "+
                    params.sito_gruppo+" reparto_richiedente : "+params.reparto_richiedente);

            } else {
                var count = 0;
                $.each(resp, function () {

                    var param = {
                        COD_DEC: resp[count].COD_DEC,
                        COD_ESA: resp[count].COD_ESA,
                        ESAME: resp[count].DESCR,
                        DESCR_REPARTO: resp[count].DESCR_REPARTO,
                        DESTINATARIO: resp[count].DESTINATARIO,
                        IDEN: resp[count].IDEN,
                        METODICA: resp[count].METODICA,
                        URGENZA: resp[count].URGENZA
                    };

                    MAIN_INS_RICHIESTE.aggiungiPrestazione(param);
                    count++;

                });
            }
        }

    }
};

var NS_FILTRI_RICHIESTE = {

    /**
     * Alla selezione dell'erogatore, se salvati, vengono creati dei pulsanti con i filtri predefiniti tramite metodica o corpo.
     * I vari filtri sono salvati su tab_esa_gruppi con SITO='OE_FILTRO'.
     * Clickando su ciascun pulsante viene ricaricata la WK con il filtro scelto.
     * @param destinatario
     * @param tipo
     * @param urgenza
     */
    loadButFiltri: function (destinatario, tipo,urgenza) {

        home.NS_CONSOLEJS.addLogger({name: 'NS_FILTRI_RICHIESTE', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_FILTRI_RICHIESTE'];

        $("#spanButFiltri").empty();

        var params = {
            destinatario: destinatario,
            urgenza : (urgenza).toString(),
            sito_gruppo: "OE_FILTRO",
            cod_cdc: $("#COD_CDC_PS").val(),
            cod_gruppo: null
        };

        var parametri = {
            "datasource": "WHALE",
            "id": "OE.BUT_FILTRO",
            "params": params,
            "callbackOK": callbackOk
        };

        /* Solo nella fase di TRIAGE filtro le sole prestazioni di TRIAGE */
        var wkApertura = $("#WK_APERTURA").val();
        if( (wkApertura==="LISTA_ATTESA") || (wkApertura==="ANAGRAFICA") ){params.cod_gruppo = home.baseGlobal.CODICE_GRUPPO_PRESTAZIONI_TRIAGE;}

        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            var resp = data.result;
            if (resp == "" || resp == null || typeof resp == "undefined") {
                logger.warn("loadButFiltri non riuscito : nessun destinatario in tab_esa_gruppi per " +
                    params.destinatario + " sito_gruppo : " + params.sito_gruppo + " cod_cdc : " + params.cod_cdc +
                    " urgenza : "+ params.urgenza+"\n resp : " + JSON.stringify(resp));
            } else {
                var count = 0;
                $.each(resp, function () {
                    var button;
                    if (MAIN_INS_RICHIESTE.isIE) {
                        button = document.createElement("input");
                        button.innerText = resp[count].DESCR;
                    } else {
                        button = document.createElement("button");
                        button.innerHTML = resp[count].DESCR;
                    }
                    button.type = "button";
                    button.id = "butFiltri" + count;
                    button.className = "btn OEFILTRO";
                    button.setAttribute("data-codgruppo", resp[count].COD_GRUPPO);
                    button.setAttribute("data-urgenza", resp[count].URGENZA);
                    button.setAttribute("onclick", " MAIN_INS_RICHIESTE.corpo = '" + resp[count].COD_GRUPPO + "'; NS_WK_RICHIESTE.gestioneWk('" + tipo + "', '')");
                    $("#spanButFiltri").append(button);
                    count++;
                });
                $("#divFiltri").show();
            }
        }
    }
};

var NS_PREFERITI_RICHIESTE = {

    /**
     * A seconda del problema principale, al caricamento metto
     * degli esami già caricati nel combo list.
     * */
    problemaPrincipale: function () {
        var problema = $("#hProblemaPrinc").val();
        var repartoAttuale = $("#COD_CDC_PS").val();

        NS_PREFERITI_RICHIESTE.loadEsamiInseriti( function(){
            NS_PROFILI_RICHIESTE.loadProfili(problema, "OE_DEFAULT", repartoAttuale, repartoAttuale,MAIN_INS_RICHIESTE.urgenza);
        });

    },

    /**
     * Carica le prestazioni già effettuate dal paziente
     * @param callback
     */
    loadEsamiInseriti : function(callback){

        var db = $.NS_DB.getTool({setup_default:{datasource:'PS',async:false}});

        var params = {
            "iden_contatto" : {v: $("#IDEN_CONTATTO").val(), t: "N"}
        };

        var xhr = db.select({
            id: "WORKLIST.PRESTAZIONI_INTERNE_ATTIVE",
            parameter: params
        });

        xhr.done(function (data) {

            if (data.result.length === 0) {
                logger.warn("nessun esame inserito");

            } else {

                var esamiCaricati = "";

                $.each(data.result , function(k,v){
                    esamiCaricati += v.CODICE_DECODIFICA+"|";
                });

                esamiCaricati = esamiCaricati.split("|");
                esamiCaricati = esamiCaricati.slice(0,esamiCaricati.length-1);

                MAIN_INS_RICHIESTE.esamiCaricati= esamiCaricati;
            }
            callback();

        });

        xhr.fail(function (jqXHR) {
            logger.error("Errore in checkEsamiInseriti, jqXHR " +  JSON.stringify(jqXHR));
        });
    },

    /**
     * confronta gli esami già effettuati con quelli in entrata
     * @param codEsame
     * @returns {boolean}
     */
    checkEsamiInseriti : function(codEsame){
        var control = true;

        if(MAIN_INS_RICHIESTE.esamiCaricati.length > 0){
            $.each(MAIN_INS_RICHIESTE.esamiCaricati, function(k,v){
                if(v===codEsame){
                    control = false;
                }
            });
        }

        return control;

    }

    /**
     * Creo dei pulsanti preferiti per le consulenze, ad ogni button è associato un reparto :
     * pigiandolo si fà ricaricare la wk con il reparto scelto.
     * */
    /*loadButConsulenze: function () {

        home.NS_CONSOLEJS.addLogger({name: 'NS_PREFERITI_RICHIESTE', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_PREFERITI_RICHIESTE'];

        $("#spanButPrefCons").empty();

        var params = {
            cod_gruppo: "OE_CONSULENZE",
            sito_gruppo: "OE_REPARTI",
            cod_cdc: $("#COD_CDC_PS").val()
        };
        var parametri = {
            "datasource": "WHALE",
            "id": "OE.REPARTI_CONSULENZE_PREF",
            "params": params,
            "callbackOK": callbackOk
        };
        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            var resp = data.result;
            if (resp == "" || resp == null || typeof resp == "undefined") {
                logger.warn("loadButConsulenze non riuscito" + params.destinatario + " sito_gruppo : " + params.sito_gruppo +
                    " cod_cdc : " + params.cod_cdc + "\nresp : " + JSON.stringify(resp));
            } else {
                var count = 0;
                $.each(resp, function () {
                    var button;
                    if (MAIN_INS_RICHIESTE.isIE) {
                        button = document.createElement("input");
                        button.innerText = resp[count].DESCR_REPARTO;
                    } else {
                        button = document.createElement("button");
                        button.innerHTML = resp[count].DESCR_REPARTO;
                    }
                    button.type = "button";
                    button.id = "butPrefCons" + count;
                    button.className = "btn OECONSULENZE";
                    button.setAttribute("data-cod_cdc", resp[count].DESTINATARIO);
                    button.setAttribute("data-coddec", resp[count].COD_DEC);
                    button.setAttribute("onclick", "MAIN_INS_RICHIESTE.metodica = null; MAIN_INS_RICHIESTE.reparto ='" + resp[count].DESTINATARIO + "'; NS_WK_RICHIESTE.gestioneWk('C', ''); ");

                    $("#spanButPrefCons").append(button);
                    count++;
                });
                $("#divRepartoCons, #divPreferitiCons").show();
            }
        }

    }*/
};
