/* global NS_FENIX_SCHEDA, home, NS_GESTIONE_DSA, moment, toolKitDB, dwr, LIB */

/**
 * Autore : Carlog
 * Aggiunge la possibilit� di vedere le info esame(dove ci sono i record di dettaglio richiesta).
 * Permette di dare il prelevato e stampare le etichette di laboratorio.
 */
$(function () {
    RICHIESTE.init();
    RICHIESTE.setEvents();
});

var RICHIESTE = {
    init: function () {
        NS_FENIX_SCHEDA.customizeParam = function (params) {
            params.extern = true;
            return params;
        };

    },
    setEvents: function () {

    },
    /**
     * Funzione che crea le finistre di dialogo per la WK dove ci sono le info
     * dettaglio richieste.
     */
    processInfoDialog: function (data, wk, td, params) {

        var default_params = {
            query: "WORKLIST.WK_ESAMI_INFO_DIALOG",
            datasource: "WHALE",
            params_where: {
                "iden_richiesta": {"v": data.IDEN, t: 'V'}
            },
            order: null,
            title: "Dettaglio esami richiesti",
            width_info: "450px"
        };
        params = $.extend(true, default_params, params);
        var $icon = $(document.createElement('i')).attr({
            "class": "icon-info-circled",
            "title": params.title,
            "id": "infoEsami"
        });

        $icon.on("click", function (e) {
            if (params.query !== "") {

                var db = $.NS_DB.getTool({setup_default: {datasource: params.datasource, async: false}});
                var xhr = db.select({
                    id: params.query,
                    parameter: params.params_where
                });
                xhr.done(function (data, textStatus, jqXHR) {

                    var html = "<table>";
                    html += "<tr><th style='font-weight:900;'>Prestazioni</th></tr>";
                    $.each(data.result, function (k, v) {
                        html += "<tr><td style='padding:5px;'>" + v.DESCR + "</td></tr>";
                    });
                    html += "</table>";

                    $.infoDialog({
                        event: e,
                        classPopup: "",
                        headerContent: params.title,
                        content: html,
                        width: params.width_info,
                        dataJSON: false,
                        classText: "infoDialogTextMini"
                    });

                });
                xhr.fail(function (jqXHR, textStatus, errorThrown) {
                    logger.error("ESAMI INFO DIALOG IN ERRORE jqXHR -> " + JSON.stringify(jqXHR));
                    home.NOTIFICA.error({message: "Errore nella generazione della worklist", title: "Error"});
                });

            }

        });
        return $icon;
    },

    /**
     * Funzione per stampa modulo richiesta di cardiologia
     *
     * @param IDEN_CONTATTO
     */
    printModuloRichiestaCardiologia : function(idenTestata,destinatario){
        var _par = {};
        _par.PRINT_DIRECTORY = 'DSA/' + destinatario;
        _par.PRINT_REPORT = 'VERSIONE_1';
        _par.PRINT_PROMPT = "&promptpidenTestata=" + idenTestata;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    /**
     * Funzione che crea le icone nella colonna funzioni della WK e sul click f�
     * partire le funzioni apposta.
     */
    setFunzioni: function (data, wk) {
        /*
         * data=>{"DESCR_CDC": "RADIOLOGIA PIETRA LIGURE", "QUESITO": null,
         * "N_ROW": 1, "MED_RICH": "TEST DR TEST", "ORA_RICHIESTA": "15:47",
         * "IDEN_RICHIESTA": 182900, "CDC": "RADIO", "METODICA": "2",
         * "DATA_RICHIESTA": "12/05/2014", "DESCR": "BIOPSIA ECOGUIDATA
         * MAMMARIA", "TIPOLOGIA_RICHIESTA": "0" }
         */
        // solo se � di laboratorio compare l'etichetta
        if ((data.METODICA === 'L') || (data.METODICA === 'A') || (data.METODICA === '0')) {
            return function () {
                if ((data.METODICA === 'L') || (data.METODICA === 'A')) {
                    var a1 = $(document.createElement('a')).attr(
                            'onclick',
                            "RICHIESTE.dwrPrelievo('" + data.IDEN
                            + "','" + data.METODICA + "','" + data.DATA_PROPOSTA + "','" + data.PRELIEVO_EFFETTUATO + "')");
                    if (data.PRELIEVO_EFFETTUATO === 'N') {
                        a1.html(
                                "<i class=' icon-ok' title='Prelievo da effettuare'>");
                    }
                }
                var a2 = $(document.createElement('a')).attr('onclick',
                        "RICHIESTE.stampaEtichetta(" + data.IDEN + "," + data.ID_RICHIESTA + ",'" + data.METODICA + "')").html(
                        "<i class=' icon-print' title='Etichette'>");
                $(this).append(a1);
                $(this).append(a2);
            };
        }
    },
    /**
     * Funzione che lancia la procedura per settare il prelevato a S
     *
     *
     */
    dwrPrelievo: function (iden_richiesta, metodica, data_proposta, prelievo_effettuato) {
        //alert(iden_richiesta+'\n'+metodica+'\n'+data_proposta+'\n'+prelievo_effettuato);
        if (prelievo_effettuato === 'S') {
            home.NOTIFICA.error({message: "Prelievo già effettuato", title: "Error"});
            return;
        }
        if ((metodica === 'L') || (metodica === 'A')) {
            var dataOdierna = moment().format('DD/MM/YYYY');
            if (dataOdierna != data_proposta) {
                var avviso = "Attenzione: per proseguire con il prelievo, la data proposta verra' aggiornata alla data odierna. LE ETICHETTE DOVRANNO ESSERE RISTAMPATE!";
                $.dialog(avviso, {
                    buttons: [
                        {
                            label: "Annulla", action: function (ctx) {
                                $.dialog.hide();
                            }
                        },
                        {
                            label: "Prosegui", action: function (ctx) {
                                $.dialog.hide();
                                RICHIESTE.modificaDataProposta(iden_richiesta, null, null, true);
                            }
                        }
                    ],
                    title: "Gestione prelevato",
                    height: 50,
                    width: 500
                });
            }
            else
                RICHIESTE.eseguiPrelievo(iden_richiesta);
        }
    },
    modificaDataProposta: function (iden_richiesta, dataProp, oraProp, flagPrelievo) {
        //alert(iden_richiesta+'\n'+dataProp+'\n'+oraProp);
        var db = $.NS_DB.getTool({setup_default: {datasource: 'WHALE', async: false}});
        $.NS_DB.setup_ajax.async = false;
        var xhr = db.call_procedure(
                {
                    id: 'INFOWEB.OE_RICHIESTE.SETDATAORA',
                    parameter: {
                        "pIdenRichiesta": {v: iden_richiesta, t: 'N'},
                        "pData": (dataProp === null) ? moment().format("YYYYMMDD") : dataProp,
                        "pOra": (oraProp === null) ? moment().format("HH:mm") : oraProp,
                        "pIdenPer": home.baseUser.IDEN_PER
                    }
                });
        xhr.done(function (data, textStatus, jqXHR) {
            if (flagPrelievo) {
                RICHIESTE.eseguiPrelievo(iden_richiesta);
            }
            else {
                NS_GESTIONE_DSA.wkRichieste.loadWk();
                home.NOTIFICA.success({message: "Modifica data ora proposta eseguiti", title: "Success"});
            }
        });
        xhr.fail(function (data) {
            logger.error(JSON.stringify(data));
            home.NOTIFICA.error({message: "Attenzione errore nella modifica data ora proposta", title: "Error"});
        });
        $.NS_DB.setup_ajax.async = true;

    },
    RichiediModificaDataProposta: function (iden_richiesta) {
        var ta = $("<table>" +
                "<tr><td><div id='gestioneModificaDataProposta'></div></td></tr>" +
                "<tr><td id='tdOraProposta' class='tdText oracontrol w60px'><span>Ora </span><input type='hidden' id='h-txtDataProposta'/><input type='text' id='txtOraProposta' class='tdObb' /></td></tr>" +
                "</table>");
        $.dialog(ta, {
            buttons: [
                {label: "Annulla", action: function (ctx) {
                        $.dialog.hide();
                    }},
                {label: "Prosegui", action: function () {
                        $.dialog.hide();
                        RICHIESTE.modificaDataProposta(iden_richiesta, $("#h-txtDataProposta").val(), $('#txtOraProposta').val(), false);
                    }}
            ],
            title: "Modifica data proposta",
            height: 300,
            width: 250
        });
        ta.Zebra_DatePicker({always_visible: $("#gestioneModificaDataProposta"), direction: true, onSelect: function (data, dataIso) {
                $("#h-txtDataProposta").val(dataIso);
            }});
        $('#txtOraProposta').live().setMask("29:59").keypress(function () {
            var currentMask = $(this).data('mask').mask;
            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
            if (newMask !== currentMask) {
                $(this).setMask(newMask);
            }
        }).val(moment().format('HH:mm'));
        $("#gestioneModificaDataProposta div.Zebra_DatePicker").css({"position": "relative"});
        $("#tdOraProposta").css({"padding-top": "5px"});
        $("#h-txtDataProposta").val(moment().format('YYYYMMDD'));  // default oggi
    },
    eseguiPrelievo: function (iden_richiesta) {

        var param = {
            "iIdenTestata": String(iden_richiesta),
            "iUtente": Number($("#USER_IDEN_PER").val())
        };
        var parametersOut = {"p_result": "outIdenTestata"};
        toolKitDB.executeProcedureDatasourceOut("INFOWEB.OE_RICHIESTE.SP_LABO_PRELIEVO",
                "WHALE", param, parametersOut, function (resp) {
                    if (resp.outIdenTestata === null) {
                        home.NOTIFICA.success({
                            message: 'Prelievo effettuato',
                            timeout: 2,
                            title: 'Success'
                        });
                        NS_GESTIONE_DSA.wkRichieste.loadWk();

                    } else {
                        home.NOTIFICA.error({
                            message: resp.outIdenTestata,
                            title: "Error"
                        });
                        if (resp.outIdenTestata.indexOf('DIURESI') >= 0) {
                            // viene richiesta la diuresi
                            var ta = $("<table>" +
                                    "<tr><td id='lblDiuresi'>ml\/24h</td><td><input id='txtDiuresi' style='width:80px' value=''></input></td></tr>" +
                                    "</table>");
                            $.dialog(ta, {
                                buttons: [
                                    {label: "Annulla", action: function (ctx) {
                                            $.dialog.hide();
                                        }},
                                    {label: "Prosegui", action: function () {
                                            $.dialog.hide();
                                            RICHIESTE.updateDiuresi(iden_richiesta, $("#txtDiuresi").val());
                                        }}
                                ],
                                title: "Necessario inserimento DIURESI",
                                height: 90,
                                width: 230
                            });
                        }
                    }
                });
        dwr.engine.setAsync(true);
    },
    updateDiuresi: function (idenRichiesta, valDiuresi) {
        var db = $.NS_DB.getTool({setup_default: {datasource: 'WHALE'}});
        $.NS_DB.setup_ajax.async = false;
        var xhr = db.call_procedure(
                {
                    id: 'ADT_SET_DIURESI',
                    parameter:
                            {
                                'pDiuresi': {v: valDiuresi, t: 'V'},
                                'pIdenRichiesta': {v: idenRichiesta, t: 'N'},
                                'pRes': {t: 'V', d: 'O'}
                            }

                });
        xhr.done(function (data, textStatus, jqXHR) {
            //alert(data.p_result);
            home.NOTIFICA.success({message: 'Update valore diuresi eseguito!', timeout: 3, title: 'Success'});

        });

        xhr.fail(function (data) {
            logger.error(JSON.stringify(data));
            home.NOTIFICA.error({message: "Attenzione errore in update valoe diuresi", title: "Error"});
        });
        $.NS_DB.setup_ajax.async = true;
    },
    /**
     * Funzione che stampa le etichette sul click
     *
     */
    stampaEtichetta: function (idenRichiesta, idenRichiesta2, metodica) {
        var par = {};
        if (idenRichiesta2 === null && metodica !== '0') {
            home.NOTIFICA.error({
                message: "Richiesta non elaborata da Laboratorio. Stampa etichette non ancora possibile",
                title: "Error"
            });
            return;
        }

        try{
            par.STAMPANTE = home.basePC.STAMPANTE_ETICHETTE;
            par.CONFIG = '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[50.0,30.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}';
            par.URL = LIB.getParamGlobal(["cce.oe.etichettaLaboratorio.url", "cce.url"], "ADT") + "/ServletStampe?report=ASL2/LABO_ETI_WHALE.rpt&prompt" + escape("<pRichieste>") + "=" + idenRichiesta;
            logger.debug("Stampa : parametri" + JSON.stringify(par));
            home.NS_FENIX_PRINT.caricaDocumento(par);
            home.NS_FENIX_PRINT.stampa(par);
        }catch(e){
            logger.error(e);
            home.NOTIFICA.error({message: e, timeout: 0, title: "Erroro di configurazione"});
        }
    }
};

var NS_ACCESSI_DSA = {
    /**
     * Funzione che crea le finistre di dialogo per la WK dove ci sono le info
     * dettaglio accessi.
     */
    processInfoDialog: function (data, wk, td, params) {

        //alert("data : \n" + JSON.stringify(data));
        var default_params = {
            query: "WORKLIST.WK_PREST_ACCESSO_INFO_DIALOG",
            datasource: "ADT",
            params_where: {
                "progressivo": {"v": NS_GESTIONE_DSA.tipologia, "t": "V"},
                "idenContatto": {"v": data.IDEN_CONTATTO, "t": "N"},
                "data_accesso": {"v": moment(data.DATA_INI, 'DD/MM/YYYY HH:mm').format('YYYYMMDD'), t: 'V'}
            },
            order: null,
            title: "Prestazioni relative all'accesso del " + moment(data.DATA_INI, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY'),
            width_info: "450px"
        };
        //alert("default_params : \n" + JSON.stringify(default_params));
        params = $.extend(true, default_params, params);
        var $icon = $(document.createElement('i')).attr({
            "class": "icon-info-circled",
            "title": params.title,
            "id": "info"
        });

        $icon.on("click", function (e) {
            if (params.query !== "") {

                var db = $.NS_DB.getTool({setup_default: {datasource: params.datasource, async: false}});
                var xhr = db.select({
                    id: params.query,
                    parameter: params.params_where
                });
                xhr.done(function (data, textStatus, jqXHR) {

                    var html = "<table>";
                    html += "<tr><th style='font-weight:900;'>Prestazioni</th></tr>";
                    $.each(data.result, function (k, v) {
                        html += "<tr><td style='padding:5px;'>" + v.PRESTAZIONE + "</td></tr>";
                    });
                    html += "</table>";

                    $.infoDialog({
                        event: e,
                        classPopup: "",
                        headerContent: params.title,
                        content: html,
                        width: params.width_info,
                        dataJSON: false,
                        classText: "infoDialogTextMini"
                    });

                });
                xhr.fail(function (jqXHR, textStatus, errorThrown) {
                    logger.error("PRESTAZIONI ACCESSO INFO DIALOG IN ERRORE jqXHR -> " + JSON.stringify(jqXHR));
                    home.NOTIFICA.error({message: "Errore nella generazione della worklist", title: "Error"});
                });

            }

        });
        return $icon;
    }
};
