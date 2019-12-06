$(document).ready(function () {
    home.NS_STAMPE_PS = NS_STAMPE_PS;
});

var NS_STAMPE_PS = {

    stampaBraccialetto: function (idenContatto, stampa, afterStampa) {

        home.NS_FENIX_PRINT.afterStampa = function () {};

        var param = {
            "PRINT_REPORT": "BRACCIALETTO",
            "PRINT_DIRECTORY": "1",
            "PRINT_PROMPT": "&promptpIdenContatto=" + idenContatto,
            "STAMPANTE": home.basePC.STAMPANTE_BRACCIALETTO, // "ZDesigner HC100 300 dpi",
            "CONFIG": '{"methods": [{"autoRotateandCenter":[true]},{"setPageSize":[8]},{"setCustomPageDimension":[25.4,279.0,4]},{"setPageMargins":[[0.1,0.1,0.1,0.1],4]}]}',
            "afterStampa": function (){ if (afterStampa) {afterStampa(); } }
        };

        home.NS_FENIX_PRINT.caricaDocumento(param);

        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;

        if (stampa === "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }
    },

    stampaCatenaCustodia: function (idenContatto, stampa, afterStampa) {

        home.NS_FENIX_PRINT.afterStampa = function () {};

        var param = {
            "PRINT_REPORT": "CATENA_CONSENSO",
            "PRINT_DIRECTORY": "1",
            "PRINT_PROMPT": "&promptpIdenContatto=" + idenContatto + '&promptpFirma=N',
            "afterStampa": function (){ if (afterStampa){afterStampa();} }
        };

        home.NS_FENIX_PRINT.caricaDocumento(param);
        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;

        if (stampa === "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }
    },

    stampaDiari: function (idenContatto, stampa, afterStampa) {

        home.NS_FENIX_PRINT.afterStampa = function (){};

        /* var reportDiario = null;
         var tab = home.NS_FENIX_PS.tab_sel;
         if (tab == 'filtroOBI'){
         reportDiario = "DIARIO_CLINICO_OBI";
         }
         else{
         reportDiario = "DIARIO_CLINICO";

         logger.error("Stampa diario non implementata per questa wk apertura -> " + wkApertura);
         return home.NOTIFICA.error({message: "Errore nella stampa dei diari, guardare nella console", title: "Error", timeout: 5});

         }*/

        var param = {
            "PRINT_REPORT": "DIARIO_CLINICO",
            "PRINT_DIRECTORY": "1",
            "PRINT_PROMPT": "&promptpIdenContatto=" + idenContatto,
            "afterStampa": function (){ if (afterStampa){afterStampa();} }
        };

        home.NS_FENIX_PRINT.caricaDocumento(param);
        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;

        if (stampa === "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }
    },

    stampaNumero: function (idenContatto, stampa, afterStampa) {

        home.NS_FENIX_PRINT.afterStampa = function () {
        };

        var param = {
            "PRINT_REPORT": "NUMERO_CHIAMATA",
            "PRINT_DIRECTORY": "1",
            "PRINT_PROMPT": "&promptiden_contatto=" + idenContatto,
            "afterStampa": function (){ if (afterStampa){afterStampa();} }
        };

        home.NS_FENIX_PRINT.caricaDocumento(param);
        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;


        if (stampa == "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }
    },

    stampaMezzoContrasto: function (idenContatto, stampa, afterStampa) {

        home.NS_FENIX_PRINT.afterStampa = function () {
        };

        var param = {
            "PRINT_REPORT": "INFO_ESAMI_RADIO_MEZZO_CONTRASTO",
            "PRINT_DIRECTORY": "1",
            "PRINT_PROMPT": "&promptpIdenContatto=" + idenContatto,
            "afterStampa": function (){ if (afterStampa){afterStampa();} }
        };

        home.NS_FENIX_PRINT.caricaDocumento(param);
        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;

        if (stampa == "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }
    },

    stampaRichiestaConsulenza: function (idenRichiesta, stampa, afterStampa) {
        var param = {
            "PRINT_REPORT": "CONSULENZE",
            "PRINT_DIRECTORY": "1",
            "PRINT_PROMPT": "&promptpIdenTR=" + idenRichiesta,
            "afterStampa": function (){ if (afterStampa){afterStampa();} }
        };

        home.NS_FENIX_PRINT.caricaDocumento(param);
        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;

        if (stampa == "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }
    },

    stampaRichiestaConsulenzaAmb: function (idenRichiesta, stampa, afterStampa) {
        var param = {
            "PRINT_REPORT": "CONSULENZE_VA",
            "PRINT_DIRECTORY": "1",
            "PRINT_PROMPT": "&promptpIdenTR=" + idenRichiesta,
            "afterStampa": function (){ if (afterStampa){afterStampa();} }
        };

        home.NS_FENIX_PRINT.caricaDocumento(param);
        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;

        if (stampa == "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }
    },


    stampaRichiestaRadiologia: function (struttura, idenRichiesta, stampa, afterStampa) {
        var param = {
            "PRINT_REPORT": "MODULO_RICHIESTA",
            "PRINT_DIRECTORY": "1/ORDER_ENTRY/"+struttura,
            "PRINT_PROMPT": "&promptpIdenTestata=" + idenRichiesta,
            "afterStampa": function (){ if (afterStampa){afterStampa();} }
        };

        home.NS_FENIX_PRINT.caricaDocumento(param);
        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;

        if (stampa == "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }

    },
    stampaPrivacy: function (idenContatto, stampa, afterStampa) {

        home.NS_FENIX_PRINT.afterStampa = function () {
        };

        var param = {
            "PRINT_REPORT": "CONSENSO_PRIVACY",
            "PRINT_DIRECTORY": "1",
            "PRINT_PROMPT": "&promptpIdenContatto=" + idenContatto,
            "afterStampa": function (){ if (afterStampa){afterStampa();} }

        };

        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;
        home.NS_FENIX_PRINT.caricaDocumento(param);

        if (stampa == "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }
    },

    stampaDiarioOBI: function (idenContatto, stampa, afterStampa) {

        home.NS_FENIX_PRINT.afterStampa = function () {
        };

        var param = {
            "PRINT_REPORT": "DIARI_CLINICO_PS_OBI",
            "PRINT_DIRECTORY": "1",
            "PRINT_PROMPT": "&promptpIdenContatto=" + idenContatto,
            "afterStampa": function (){ if (afterStampa){afterStampa();} }

        };

        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;
        home.NS_FENIX_PRINT.caricaDocumento(param);

        if (stampa == "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }
    },

    stampaTriage: function (idenContatto, stampa, afterStampa, afterChiudi) {

        var param = {
            "PRINT_REPORT": "VERBALE_TRIAGE",
            "PRINT_DIRECTORY": "1",
            "PRINT_PROMPT": "&promptpIdenContatto=" + idenContatto,
            "afterChiudi": function () { if (afterChiudi) {afterChiudi(); } },
            "afterStampa": function () { if (afterStampa) {afterStampa(); } }
        };

        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.config = param;

        home.NS_FENIX_PRINT.caricaDocumento(param);

        if (stampa === "S") {
            home.NS_FENIX_PRINT.stampa(param);
        }
        else {
            home.NS_FENIX_PRINT.apri(param);
        }
    },


    stampaVerbale: function (idenContatto, stampa, afterStampa, pConfig, pStato) {

        logger.debug("stampaVerbale - idenContatto -> " + idenContatto + "; stampa-> " + stampa + "; afterStampa -> " + afterStampa + "; pConfig -> " + pConfig + "; pStato-> " + pStato);
        var stato = typeof pStato == "undefined" ? null : pStato;
        var firma = stato == 'F' ? 'S' : 'N';

        var url = 'http://'+ document.location.host + document.location.pathname.match(/\/.*\//) +  "jsp/PS/verbale.jsp?idenContatto="+ idenContatto + '&sito=PS&firma='+firma + '&stato='+stato+'&bozza=N';
        logger.debug(url);

        var _par = {URL:url};
        home.NS_FENIX_PRINT.caricaDocumento(_par);

        // Merge configurazioni di PARAMETRI con quelle invocate nel contesto
        if (typeof pConfig !== "undefined") {
            home.NS_FENIX_PRINT.config = $.extend({}, home.NS_FENIX_PRINT.config, JSON.parse(pConfig));
        }

        var param = {
            "STAMPA_IMMEDIATA": stampa,
            "afterStampa": function () {
                home.NS_FENIX_PRINT.config = null;
            },
            "beforeApri": home.NS_FENIX_PRINT.initStampa
        };

        if (stampa === "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }

    },

    /**
     * Setta la data di stampa che poi verrà letta dalla pagina MODULISITCA anche per i moduli che vengono stampati al di fuori
     * @param idenContatto
     * @param moduliStampa
     * @param utente
     * @param callback
     */
    setDataStampa: function (idenContatto, moduliStampa, utente, callback) {

        moduliStampa = moduliStampa + ',DEFAULT';
        var db = $.NS_DB.getTool();

        var dbParams = {
            "pModuli": {v: String(moduliStampa), t: "V" },
            "pIdenContatto": {v: idenContatto, t: "N"},
            "pUtente": {v: Number(utente), t: "N"}
        };

        var xhr = db.call_procedure({
            datasource: "PS",
            id: "SET_DATA_STAMPA",
            parameter: dbParams
        });

        xhr.done(function (response) {
            if (response) {
                logger.info("dataStampa Riuscita");
                if (callback) {
                    callback();
                }
            } else {
                logger.error("ERRORE PROCEDURA");
            }
        });

        xhr.fail(function (jqXHR) {
            logger.error("ERRORE CONNESSIONE" + JSON.stringify(jqXHR));
        });
    },

    apriDocumentoFirmato: function (pParam, pIdenDocumento, pQuery, pDatasource) {

        pParam["URL"] = home.NS_FENIX_TOP.getAbsolutePathServer() + 'showDocumentoAllegato?IDEN=' + pIdenDocumento +
            "&QUERY=" + pQuery + "&DATASOURCE=" + pDatasource;
        pParam['beforeApri'] = home.NS_FENIX_PRINT.initStampa;

        logger.debug("Pre anteprima doc firmato : params -> " + JSON.stringify(pParam));
        logger.debug("numero stampe : " + home.NS_FENIX_PRINT.config);

        home.NS_FENIX_PRINT.caricaDocumento(pParam);

        if (pParam["STAMPA_IMMEDIATA"] === "S") {
            home.NS_FENIX_PRINT.stampa(pParam);
        } else {
            home.NS_FENIX_PRINT.apri(pParam);
        }
    }
};