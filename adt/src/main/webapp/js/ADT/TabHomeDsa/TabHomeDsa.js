/* global home, NS_FENIX_TAG_LIST, moment, NS_CONTATTO_METHODS, LIB */

/**
 * User: graziav
 * Date: 19/08/2014
 * Time: 12.20
 *
 * 20150217 - alessandro.arrighi - implementazione funzione stampa etichetta paziente.
 */

jQuery(document).ready(function () {

    NS_HOME_DSA.init();
    NS_HOME_DSA.event();
});

var NS_HOME_DSA = {
    wkDsaAperti: null,
    wkDsaChiusi: null,
    wkDsaOE: null,
    GG_DSA_ALERT: 20,
    GG_DSA: 30,
    ACCESSI_DSA: 3,
    init: function () {

        home.HOME_DSA = this;

        // Altezza WK
        $("#divWk").css({'height': document.body.offsetHeight - $("#filtri").height() - 10});

        NS_HOME_DSA.caricaWkDsaAperti();

        NS_FENIX_TAG_LIST.beforeApplica = NS_HOME_DSA.beforeApplicaAfterTag;

        if (typeof home.tabAttivo !== 'undefined'){
            //carica filtro
            $('#tabs-Worklist li#' + home.tabAttivo).trigger("click");
            //carica wk
            NS_HOME_DSA.tab_sel = $('#tabs-Worklist li#' + home.tabAttivo).attr('data-tab');
            NS_HOME_DSA.caricaWk();
        }

        NS_HOME_DSA.initLogger();
        $("#txtAData").val(moment().format('DD/MM/YYYY'));
        $("#h-txtAData").val(moment().format('YYYYMMDD'));
    },
    beforeApplicaAfterTag: function (params){
        // A seconda del TAG devo ricaricare la pagina per la ridefinizione dei fitri
        if (params.refreshPage === 'S'){
            home.tabAttivo = $('li.tabActive').attr("id");
            params.reload = true;
        }
        return params;
    },
    caricaWk: function () {

        switch (NS_HOME_DSA.tab_sel) {
            case 'filtroDsaChiusi':
                NS_HOME_DSA.caricaWkDsaChiusi();
                break;
            case 'filtroDsaAperti':
                NS_HOME_DSA.caricaWkDsaAperti();
                break;
            case 'filtroRichiesteDsa':
                NS_HOME_DSA.caricaWkRichiesteDsa();
                break;
            default :
                logger.error('ATTENZIONE TABULATORE NON RICONOSCIUTO');
                return;
        }
    },
    caricaWkDsaAperti: function () {

        var nome = ($('#txtNome').val() === '') ? '%25' : $('#txtNome').val();
        var cognome = ($('#txtCognome').val() === '') ? '%25' : $('#txtCognome').val();
        var cartella = $('#txtCartella').val();

        NS_HOME_DSA.wkDsaAperti = new WK({
            id: "ADT_WK_DSA_APERTI",
            container: "divWk",
            aBind: ["username", "nome", "cognome", "cartella"],
            aVal: [$('#USERNAME').val(), nome, cognome, cartella],
            loadData: true
        });

        NS_HOME_DSA.wkDsaAperti.loadWk();
    },
    caricaWkDsaChiusi: function () {
        var nome = ($('#txtNomeC').val() === '') ? '%25' : $('#txtNomeC').val();
        var cognome = ($('#txtCognomeC').val() === '') ? '%25' : $('#txtCognomeC').val();
        var cartella = ($('#txtCartellaC').val() === '') ? '%25' : $('#txtCartellaC').val();

        NS_HOME_DSA.wkDsaChiusi = new WK({
            id: "ADT_WK_DSA_CHIUSI",
            container: "divWk",
            aBind: ["username", "nome", "cognome", "cartella"],
            aVal: [$('#USERNAME').val(), nome, cognome, cartella],
            loadData: true
        });

        NS_HOME_DSA.wkDsaChiusi.loadWk();
    },
    caricaWkRichiesteDsa: function () {

        NS_HOME_DSA.wkDsaOE = new WK({
            id: "ADT_WK_RICHIESTE_DSA_APERTI",
            container: "divWk",
            aBind: ["username"],
            aVal: [$('#USERNAME').val()]
        });

        NS_HOME_DSA.wkDsaOE.loadWk();
    },
    getUrlCartellaPaziente: function (codice_contatto) {

        //var url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&ricovero='+codice_contatto;
        try{
            var url = LIB.getParamGlobal(["cce.cartella.url", "cce.url"], "ADT") + '/autoLogin?utente=' + home.baseUser.USERNAME + '&postazione=' + home.AppStampa.GetCanonicalHostname().toUpperCase() + '&pagina=CARTELLAPAZIENTEADT&ricovero=' + codice_contatto + '&funzione=apriVuota()';
            logger.debug("Apertura Cartella Dsa - TabHomeDsa.getUrlCartellaPaziente - url -> " + url);

            //url = NS_APPLICATIONS.switchTo('WHALE', url);

            window.open(url, "_blank", "fullscreen=yes");
        }catch(e){
            logger.error(e);
            home.NOTIFICA.error({message: e, timeout: 0, title: "Erroro di configurazione"});
        }
    },
    event: function () {

        $('#tabs-Worklist').children().click(function () {
            NS_HOME_DSA.tab_sel = $(this).attr('data-tab');
            NS_HOME_DSA.caricaWk();
        });
    },
    printEtichettaPaziente: function (idenAnagrafica) {

        var par = {};

        par.PRINT_DIRECTORY = 'ANAGRAFICA';
        par.PRINT_REPORT = "ETICHETTA_PAZIENTE";
        par.PRINT_PROMPT = "&promptpIdenAnagrafica=" + idenAnagrafica;
        par.STAMPANTE = home.basePC.STAMPANTE_ETICHETTE;
        par.CONFIG = '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[50,30,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}';
        logger.debug("Stampa Etichetta Anagrafica - parametri: " + JSON.stringify(par));

        home.NS_FENIX_PRINT.caricaDocumento(par);
        home.NS_FENIX_PRINT.stampa(par);
    },
    initLogger: function () {
        home.NS_CONSOLEJS.addLogger({name: 'HOME_DSA', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['HOME_DSA'];
    },
    annullaDSA: function (idenContatto, codice) {
        var tbl = "<table border='2' style='width:450px;font-size:14px;'>";

        tbl += "<tr>";
        tbl += "<td>Motivo annullamento</td><td colspan='2'><textarea id='txtMotivoCancellazione' style='width:250px;height:60px;'></textarea></td>";
        tbl += "</tr>";
        tbl += "</table>";


        $.dialog(tbl, {
            buttons: [
                {
                    label: "Annulla", action: function (ctx) {
                        $.dialog.hide();
                    }
                },
                {
                    label: "Prosegui", action: function (ctx)
                    {
                        $.dialog.hide();

                        var _json_contatto = NS_CONTATTO_METHODS.getContattoById(idenContatto);
                        _json_contatto.uteModifica.id = home.baseUser.IDEN_PER;
                        _json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
                        _json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
                        _json_contatto.mapMetadatiString['MOTIVO_CANCELLAZIONE_RICOVERO'] = $('#txtMotivoCancellazione').val();

                        logger.debug("Annullamento DSA - Inizio Annullamento DSA ID -> " + _json_contatto.id + ", UTE MODIFICA -> " + _json_contatto.uteModifica.id + ", MOTIVO -> " + _json_contatto.mapMetadatiString['MOTIVO_CANCELLAZIONE_RICOVERO']);

                        if (_json_contatto.stato.codice === "ADMITTED"){
                            var pCancel = {"contatto": _json_contatto, hl7Event: "A11", "updateBefore": true, "notifica": {"show": "S", "timeout": 3, "message": "Cancellazione DSA avvenuta Con Successo", "errorMessage": "Errore Durante la Cancellazione DSA"}, "cbkSuccess": function () {
                                    $.dialog.hide();
                                    NS_HOME_DSA.wkDsaAperti.refresh();
                                }, "cbkError": function () {
                                }};
                            NS_CONTATTO_METHODS.cancelAdmission(pCancel);
                        } else {
                            _json_contatto.uteModifica.id = home.baseUser.IDEN_PER;
                            _json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
                            _json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
                            var pCancelDischarge = {
                                "contatto": _json_contatto,
                                "notifica": "S",
                                "cbkSuccess": function () {
                                    var _json_contattoRiaperto = NS_CONTATTO_METHODS.getContattoById(idenContatto);
                                    _json_contattoRiaperto.mapMetadatiString['MOTIVO_CANCELLAZIONE_RICOVERO'] = $('#txtMotivoCancellazione').val();

                                    var pCancelAdmission = {"contatto": _json_contattoRiaperto, "updateBefore": true, "notifica": {"show": "S", "timeout": 3, "message": "Cancellazione DSA chiuso Avvenuta con Successo", "errorMessage": "Errore Durante Cancellazione DSA!"}, "cbkSuccess": function () {
                                            $.dialog.hide();
                                            NS_HOME_DSA.wkDsaChiusi.refresh();
                                        }, "cbkError": function () {
                                        }};
                                    NS_CONTATTO_METHODS.cancelAdmission(pCancelAdmission);
                                },
                                "cbkError": function () {
                                }
                            };
                            NS_CONTATTO_METHODS.cancelDischarge(pCancelDischarge);
                        }

                    }
                }
            ],
            title: "Annullamento DSA " + codice + " - Motivo",
            height: 125,
            width: 500
        });
    }
};

