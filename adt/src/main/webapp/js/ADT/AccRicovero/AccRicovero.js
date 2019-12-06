/* global _STATO_PAGINA, NS_FENIX_SCHEDA, _JSON_CONTATTO, moment, NS_REPARTI, V_ADT_ACC_RICOVERO, home, traduzione, _JSON_ANAGRAFICA, NS_ACC_RICOVERO_CHECK, NS_ACCESSI_DH, NS_ACC_RICOVERO_SALVATAGGI */

/**
 * User: graziav, alessandroa, matteop
 *
 * 20140217 - alessandro.arrighi - Gestione Codifiche ICD da JSON contatto senza query.
 * 20140221 - alessandro.arrighi - Modifica Inserimento Ricovero da Prericovero.
 * 20140313 - alessandro.arrighi - Gestione Metadati Tramite Map.
 * 20140401 - alessandro.arrighi - Modifica Gestione Metadati Codificati e NON.
 * 20140408 - alessandro.arrighi - Gestione Priorita Diagnosi.
 * 20140730 - alessandro.arrighi - Ottimizzazione Funzioni + Stesura Commenti + Aggiunto File per Gestione Reparti (AccRicoveroGestioneReparti.js)
 * 20140731 - alessandro.arrighi - Ottimizzazione Caricamento Pagina da JSON.
 * 20141029 - alessandro.arrighi - Obbligo Perenne Campo Tipo Ricovero tranne che per Neonato.
 * 20141212 - alessandro.arrighi - Divisione File e Creazione di AccRicoveroSalvataggi.js
 * 20141215 - alessandro.arrighi - Sostituzione invocazione toolkitDB con NS_DB
 */

var NS_ACC_RICOVERO = {
    flgNeonato: false,
    lista: false,
    newSTP: false,
    newENI: false,
    altroOnere: "9",
    SSN: "1",
    ricoveroPROG: new Array("1", "4"),
    ggNeonato: 3,
    ggDimissione: 30,
    init: function () {


        NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ADT_ACC_RICOVERO"});
        NS_ACC_RICOVERO.getNotaBraccialetto();
        NS_REGIME_TIPO_MOTIVO_RICOVERO.valorizeTree();
        NS_ACC_RICOVERO.overrideRegistra();
        NS_ACC_RICOVERO.Events.setEvents();
        NS_ACC_RICOVERO.Events.definisciComportamento();

    },
    aggiornaPagina: function () {

        NS_ACC_RICOVERO.flgNeonato = _JSON_CONTATTO.mapMetadatiString['NEONATO'] == 'S' || _JSON_CONTATTO.mapMetadatiString['NEONATO'] == 'true' ? true : false;

        /*if (typeof _JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TITOLO_STUDIO'] !== "undefined")
         {
         $("#cmbTitoloStudio").val(_JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TITOLO_STUDIO'].id);
         } */

        $("#txtNumNosologico").val(_JSON_CONTATTO.codice.codice);
        $("#h-txtDataRico").val(moment(_JSON_CONTATTO.dataInizio, 'YYYYMMDDHH:mm').format('YYYYMMDD'));

        $("#txtDataRico").val(moment(_JSON_CONTATTO.dataInizio, 'YYYYMMDDHH:mm').format('DD/MM/YYYY'));
        $("#txtOraRico").val(moment(_JSON_CONTATTO.dataInizio, 'YYYYMMDDHH:mm').format('HH:mm'));

        $("#cmbRegime").val(_JSON_CONTATTO.regime.codice);

        NS_REGIME_TIPO_MOTIVO_RICOVERO.setTipoMotivoFromRegime(_JSON_CONTATTO.regime.codice);

        $("#cmbTipoRico").val(_JSON_CONTATTO.tipo.codice);
        $("#cmbMotivoRico").val(_JSON_CONTATTO.motivo.codice);

        // Valorizzo la Combo dei Reparti Giuridici In base al Regime del Contatto
        NS_REPARTI.Giuridici.setReparto(_JSON_CONTATTO.regime.codice, function () {

            // Valorizzo il Reparto GIURIDICO senza toccare il reparto ASSISTENZIALE
            NS_REPARTI.Giuridici.loadReparto(_JSON_CONTATTO.contattiGiuridici[0].provenienza.id, function () {

                $('#acMadreCartella').data('acList').changeBindValue({"iden_cdc": $("#cmbRepartoRico option:selected").attr("data-iden_cdc")});
                $("#txtMadreCartella").data("autocomplete").changeBindValue({"iden_cdc": $("#cmbRepartoRico option:selected").attr("data-iden_cdc")});

                // Valorizzo la COMBO dei reparti ASSISTENZIALI senza settarne il valore
                NS_REPARTI.Assistenziali.loadReparti($("#cmbRepartoRico option:selected").attr('data-codice_struttura'));
            });

        });

        $("#acMedicoAcc").data('acList').returnSelected({DESCR: _JSON_CONTATTO.uteAccettazione.descrizione, VALUE: _JSON_CONTATTO.uteAccettazione.id});

        $("input[name='cmbLivelloUrg']").val(_JSON_CONTATTO.urgenza.codice);
        $("#h-cmbLivelloUrg").val(_JSON_CONTATTO.urgenza.codice);
        $("#cmbLivelloUrg_" + _JSON_CONTATTO.urgenza.codice).addClass("CBpulsSel");
        $("#cmbProvenienza").val(_JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_PROVENIENZA'].id);
        if (NS_ACC_RICOVERO.checkOnere({codice: _JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_ONERE'].codice})) {
            $("#cmbOnere").val(_JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_ONERE'].id);
        }

        $("#cmbSubOnere").val(_JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_SUB_ONERE'].id);

        if (_JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_ONERE'].codice != NS_ACC_RICOVERO.altroOnere) {
            NS_ACC_RICOVERO.Utils.disableField("cmbSubOnere");
        }
        else
        {
            NS_ACC_RICOVERO.Utils.enableField("cmbSubOnere");
            V_ADT_ACC_RICOVERO.elements.cmbSubOnere.status = "required";
            NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ADT_ACC_RICOVERO"});
        }

        $("#txtDiagnosiAcc").val(_JSON_CONTATTO.mapMetadatiString['DIAGNOSI_ACCETTAZIONE']);
        if (_JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TICKET'] != undefined) {
            $("#cmbTicket").val(_JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TICKET'].id);
        }
        if (_JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TIPO_NEONATO'] != undefined) {
            $("#cmbTipoNeonato").val(_JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TIPO_NEONATO'].id);
        }
        $("#cmbTipoMedicoPresc").val(_JSON_CONTATTO.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TIPO_MEDICO_PRESC'].id);
        $("#txtPesoNascita").val(_JSON_CONTATTO.mapMetadatiString['PESO_NEONATO']);

        var TRAUMATISMI = typeof _JSON_CONTATTO.mapMetadatiCodifiche['TRAUMATISMI'] == 'undefined' ? '' : _JSON_CONTATTO.mapMetadatiCodifiche['TRAUMATISMI'];

        if (typeof TRAUMATISMI.id != 'undefined' && TRAUMATISMI.id != '' && TRAUMATISMI.id) {
            $("#cmbTrauma").val(TRAUMATISMI.id);
            V_ADT_ACC_RICOVERO.elements.txtCategoriaCausaEsterna.status = "required";
            V_ADT_ACC_RICOVERO.elements.cmbCausaEsterna.status = "required";
            NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ADT_ACC_RICOVERO"});
        }
        NS_REGIME_TIPO_MOTIVO_RICOVERO.setDataPrenotazioneFromTipoRegime();

        // Gestione a Cascata di CATEGORIA CAUSA ESTERNA e CAUSA ESTERNA
        var CATEGORIA_CAUSA_ESTERNA = typeof _JSON_CONTATTO.mapMetadatiCodifiche['CATEGORIA_CAUSA_ESTERNA'] == 'undefined' ? '' : _JSON_CONTATTO.mapMetadatiCodifiche['CATEGORIA_CAUSA_ESTERNA'];
        if (CATEGORIA_CAUSA_ESTERNA.id != null && CATEGORIA_CAUSA_ESTERNA.id != "")
        {
            var db = $.NS_DB.getTool({setup_default: {datasource: 'ADT'}});

            var xhr = db.select(
                    {
                        id: "SDJ.Q_RECORD_TIPI",
                        parameter: {"IDEN": {t: 'N', v: _JSON_CONTATTO.mapMetadatiCodifiche['CATEGORIA_CAUSA_ESTERNA'].id}}
                    });

            xhr.done(function (data, textStatus, jqXHR) {

                $("#h-txtCategoriaCausaEsterna").val(data.result[0].IDEN);
                $("#txtCategoriaCausaEsterna").attr("data-c-value", data.result[0].IDEN);
                $("#txtCategoriaCausaEsterna").val(data.result[0].DESCRIZIONE);

                NS_ACC_RICOVERO.Events.valorizeComboCausaEsterna(function () {
                    $("#cmbCausaEsterna").val(_JSON_CONTATTO.mapMetadatiCodifiche['CAUSA_ESTERNA'].id);
                });

            });
        }

        if (_JSON_CONTATTO.codiciICD != null) {
            NS_ACC_RICOVERO.Diagnosi.setDiagnosi();
        }

        if (_JSON_CONTATTO.mapMetadatiString['DATA_PRENOTAZIONE'] != undefined && _JSON_CONTATTO.mapMetadatiString['DATA_PRENOTAZIONE'] !== "") {
            $("#h-txtDataPren").val(moment(_JSON_CONTATTO.mapMetadatiString['DATA_PRENOTAZIONE'], 'YYYYMMDDHH:mm').format('YYYYMMDD'));
            $("#txtDataPren").val(moment(_JSON_CONTATTO.mapMetadatiString['DATA_PRENOTAZIONE'], 'YYYYMMDDHH:mm').format('DD/MM/YYYY'));
        }

        if (_JSON_CONTATTO.regime.codice === NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeDH)
        {
            var dataFineAccesso = _JSON_CONTATTO.contattiAssistenziali[0].dataFine;

            if (dataFineAccesso)
            {
                $("#h-txtDataFineAccesso").val(moment(dataFineAccesso, 'YYYYMMDDHH:mm').format('YYYYMMDD'));
                $("#txtDataFineAccesso").val(moment(dataFineAccesso, 'YYYYMMDDHH:mm').format('DD/MM/YYYY'));
                $("#txtOraFineAccesso").val(moment(dataFineAccesso, 'YYYYMMDDHH:mm').format('HH:mm'));
            }
        }

        if(_JSON_CONTATTO.mapMetadatiCodifiche['LATERALITA'] ){
            $("#h-radLateralita").val(_JSON_CONTATTO.mapMetadatiCodifiche['LATERALITA'].id);
            $("#radLateralita_"+_JSON_CONTATTO.mapMetadatiCodifiche['LATERALITA'].id).addClass("RBpulsSel");
        }

    },
    Setter: {
        setButtonScheda: function () {
            //devo preoccuparmi di mostrare i bottoni perch� sono gi� tutti nascosti
            var _isUserBackoffice = home.basePermission.hasOwnProperty('BACKOFFICE');
            var _isProvenienzaPS = typeof _JSON_CONTATTO.mapMetadatiString["DEA_ANNO"] !== "undefined";
            var buttonApriCartella = $(".butApriCartella");
            var buttonSalva = $(".butSalva");
            $(".butChiudi").show();

            logger.debug("Set Button Scheda ACCETTAZIONE RICOVERO - _isUserBackoffice -> " + _isUserBackoffice + ", _isProvenienzaPS -> " + _isProvenienzaPS);

            // Button in alto a destra per il print degli errori della pagina
            $("#butPrintVideata").remove();
            $(".headerTabs").append($("<button></button>").attr("id", "butPrintVideata").attr("class", "btn").html(traduzione.butPrintVideata).css({"position": "absolute", "right": "2%"}).on("mousedown", function () {
                window.print();
            }));
            $("#lblTitolo").css({"width": "80%", "display": "inline"});



            if (_STATO_PAGINA !== "I")
            {
                buttonApriCartella.show();
                buttonApriCartella.off("click").on("click", function () {
                    var url = home.baseGlobal.URL_CARTELLA + "/autoLogin?utente=" + home.baseUser.USERNAME;
                    url = url + "&postazione=" + home.AppStampa.GetCanonicalHostname().toUpperCase();
                    url = url + "&pagina=CARTELLAPAZIENTEADT";
                    url = url + "&ricovero=" + _JSON_CONTATTO.codice.codice;
                    url = url + "&funzione=apriVuota()";

                    logger.debug("NS_PRERICOVERO.getUrlCartellaPaziente - url -> " + url);

                    // L'opener deve essere home in quanto dopo l'apertura della cartella la agina di inserimento viene chiusa
                    // e su whale serve il riferimento a opener
                    home.window.open(url, "_blank", "fullscreen=yes");
                });
            }

            if (!(_STATO_PAGINA === 'L' && !home.basePermission.hasOwnProperty('BACKOFFICE'))) {
                buttonSalva.show();
            }
        },
        setIntestazione: function () {
            $('#lblTitolo').html(_JSON_ANAGRAFICA.cognome + ' ' + _JSON_ANAGRAFICA.nome + ' - ' + _JSON_ANAGRAFICA.sesso + ' - ' + moment(_JSON_ANAGRAFICA.dataNascita, 'YYYYMMDDHH:mm').format('DD/MM/YYYY') + ' - ' + _JSON_ANAGRAFICA.codiceFiscale);
        },
        setSezioneAnagrafica: function () {

            $('#txtCognome').val(_JSON_ANAGRAFICA.cognome);
            $('#txtNome').val(_JSON_ANAGRAFICA.nome);
            $('#txtDataNasc').val(moment(_JSON_ANAGRAFICA.dataNascita, 'YYYYMMDDHH:mm').format('DD/MM/YYYY'));
            $('#txtSesso').val(_JSON_ANAGRAFICA.sesso);
            $('#txtCodFisc').val(_JSON_ANAGRAFICA.codiceFiscale);

            if ($("#ANAG_PINNATA").val() == "S") {

                $('#txtAnagCognome').attr("readonly", "readonly");
                $('#txtAnagNome').attr("readonly", "readonly");
                $('#txtAnagDataNasc').attr("readonly", "readonly");
                $('#radAnagSesso').find('div').off("click");
                $('#txtAnagCodFisc').attr("readonly", "readonly");
                $('#txtLuogoNasc').attr("readonly", "readonly");
                $("#lblLuogoNasc").off("click");
                $("#txtAnagDataNasc").next().off("click");
            }
        },
        setPazienteSconosciuto: function () {

            if (_JSON_ANAGRAFICA.cognome === "SCONOSCIUTO" && _STATO_PAGINA === "I")
            {
                $("#cmbRegime").val('1').attr("disabled", "disabled").trigger("change");
                $("#cmbTipoRico").val('2');
            }
            else if (_JSON_ANAGRAFICA.cognome === "SCONOSCIUTO")
            {
                $("#cmbRegime").val('1').attr("disabled", "disabled");
            }
        }

    },
    Utils: {
        disableField: function (id) {

            var obj = $("#" + id);
            obj.attr("disabled", "disabled");

            if (obj.attr("autocomplete")) {
                obj.closest("TD").prev().find("span").off("click");
            }
        },
        enableField: function (id) {
            $("#" + id).removeAttr("disabled");
        },
        DisableDatiRicovero: function () {

            NS_ACC_RICOVERO.Utils.disableField('cmbRegime');
            NS_ACC_RICOVERO.Utils.disableField('cmbRepartoRico');
            NS_ACC_RICOVERO.Utils.disableField('cmbRepartoAss');
            NS_ACC_RICOVERO.Utils.disableField('cmbTipoRico');
            NS_ACC_RICOVERO.Utils.disableField('txtDataRico');
            NS_ACC_RICOVERO.Utils.disableField('txtOraRico');
            NS_ACC_RICOVERO.Utils.disableField('cmbMotivoRico');
            NS_ACC_RICOVERO.Utils.disableField('cmbProvenienza');
            NS_ACC_RICOVERO.Utils.disableField('cmbTipoMedicoPresc');
            NS_ACC_RICOVERO.Utils.disableField('txtMedicoAcc');
            NS_ACC_RICOVERO.Utils.disableField('cmbOnere');
            NS_ACC_RICOVERO.Utils.disableField('cmbSubOnere');
            NS_ACC_RICOVERO.Utils.disableField('cmbTicket');
            NS_ACC_RICOVERO.Utils.disableField('txtDiagnosiAcc');
            NS_ACC_RICOVERO.Utils.disableField('txtDiagnosiICD9');
            NS_ACC_RICOVERO.Utils.disableField('cmbTrauma');
            NS_ACC_RICOVERO.Utils.disableField('txtCategoriaCausaEsterna');
            NS_ACC_RICOVERO.Utils.disableField('cmbCausaEsterna');
            NS_ACC_RICOVERO.Utils.disableField('txtDataPren');
            //NS_ACC_RICOVERO.Utils.disableField('cmbTitoloStudio');
            $("#cmbLivelloUrg").data("CheckBox").disable();
        }
    },
    Events: {
        HL7Event: null,
        ICDEvent: 'A01',
        setEvents: function () {
            // Setto Il Logger della CONSOLE JS
            home.NS_CONSOLEJS.addLogger({name: 'TabAccettazioneRicovero', console: 0});
            window.logger = home.NS_CONSOLEJS.loggers['TabAccettazioneRicovero'];

            // Al Cambiamento del Regime Valorizzo le combo del tipo, del motivo, dei reparti giuridici
            $("#cmbRegime").off("change").on("change", function () {
                var regime = $(this).find("option:selected").val();
                NS_REGIME_TIPO_MOTIVO_RICOVERO.setTipoMotivoFromRegime(regime);
                NS_REGIME_TIPO_MOTIVO_RICOVERO.setDataPrenotazioneFromTipoRegime(regime);
                NS_REPARTI.Giuridici.setReparto(regime);
                _JSON_CONTATTO.setRegime(regime);

            });

            $("#cmbTipoRico").change(function () {


                var tipo = $(this).find("option:selected").val();

                if (tipo == "O") {
                    $("#cmbMotivoRico_O").attr("selected", "selected");
                    $("#cmbMotivoRico").attr("disabled", "disabled");
                }
                else if (tipo == "S") {
                    $("#cmbMotivoRico_S").attr("selected", "selected");
                    $("#cmbMotivoRico").attr("disabled", "disabled");
                }
                else {
                    var cmbMotivo = $("#cmbMotivoRico");
                    cmbMotivo.removeAttr("disabled");

                }

                _JSON_CONTATTO.setTipo(tipo);

                NS_REGIME_TIPO_MOTIVO_RICOVERO.setDataPrenotazioneFromTipoRegime();
                NS_ACC_RICOVERO.controlliDataFinePrimoaccesso();
            });

            // Ridefinizione per manipolazione urgenza
            // Se selezionata due volte consecutive la stessa urgenza viene deselezionata l'opzione scelta
            $("#cmbLivelloUrg > div").off("click").on("click", function () {

                var _old_value = $("#h-cmbLivelloUrg").val();
                var _new_value = $(this).attr("data-value");

                if ($(this).parent().hasClass("CBdisabled"))
                {
                    return;
                }

                if (_new_value !== _old_value)
                {
                    $("#h-cmbLivelloUrg").val($(this).attr("data-value"));
                    $(this).parent().find("div").removeClass("CBpulsSel");
                    $(this).addClass("CBpulsSel");
                }
                else
                {
                    $("#h-cmbLivelloUrg").val(null);
                    $(this).parent().find("div").removeClass("CBpulsSel");
                }

            });

            // Quando Viene Cambiato il Reparto Giuridico Scatta Evento sui Reparti Assistenziali
            $("#cmbRepartoRico").change(function () {
                $('#acMadreCartella').data('acList').changeBindValue({"iden_cdc": $("#cmbRepartoRico option:selected").attr("data-iden_cdc")});
                $('#txtMadreCartella').data('autocomplete').changeBindValue({"iden_cdc": $("#cmbRepartoRico option:selected").attr("data-iden_cdc")});
                NS_REPARTI.Assistenziali.setReparto();
            });

            $("#txtDataRico").change(function () {
                NS_ACC_RICOVERO_CHECK.isNeonato(NS_ACC_RICOVERO.ggNeonato);
            }).blur(function () {
                NS_ACC_RICOVERO_CHECK.isNeonato(NS_ACC_RICOVERO.ggNeonato);
            });

            // Il sub-onere puo' essere valorizzato solo con Onere "ALTRO"
            $("#cmbOnere").change(function () {
                var codice = $("#cmbOnere option:selected").attr("data-codice");
                if (codice == NS_ACC_RICOVERO.altroOnere) {
                    NS_ACC_RICOVERO.Utils.enableField("cmbSubOnere");
                } else {
                    $("#cmbSubOnere").val("").attr("disabled", true);
                }


                //se onere � ssn controllo che la regione di residenza non sia 999
                if (!NS_ACC_RICOVERO.checkOnere({'codice': $(this).attr("data-codice")})) {
                    $(this).val("");
                    home.NOTIFICA.error({title: "Attenzione", message: "Attenzione in caso di asl estera non si puo' selezionare come onere Servizio Sanitario Nazionale", timeout: 0});

                }
            });

            $("#cmbMotivoRico").change(function () {

                var motivo = $(this).find("option:selected").val();

                if (motivo == "O") {
                    $("#cmbTipoRico_O").attr("selected", "selected");
                    $("#cmbTipoRico").attr("disabled", "disabled");
                } else if (motivo == "S") {
                    $("#cmbTipoRico_S").attr("selected", "selected");
                    $("#cmbTipoRico").attr("disabled", "disabled");
                } else {
                    var cmbTipo = $("#cmbTipoRico");
                    cmbTipo.removeAttr("disabled");
                }

                NS_REGIME_TIPO_MOTIVO_RICOVERO.setDataPrenotazioneFromTipoRegime();

                if ($("#cmbRegime option:selected").val() == NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeDH) {
                    NS_ACCESSI_DH.hideShowDatiPrimoAccessoDh(true);
                }
            });


            $(".butStampaSTP").on("click", function () {
                _par = {"PRINT_DIRECTORY": "ANAGRAFICA", "PRINT_REPORT": "STP", "PRINT_PROMPT": "&promptIDEN_ANAGRAFICA=" + $("#IDEN_ANAG").val()};
                home.NS_FENIX_PRINT.caricaDocumento(_par);
                _par['beforeApri'] = home.NS_FENIX_PRINT.initStampa;
                home.NS_FENIX_PRINT.apri(_par);
            });
            $(".butStampaENI").on("click", function () {
                _par = {"PRINT_DIRECTORY": "ANAGRAFICA", "PRINT_REPORT": "CODICE_ENI", "PRINT_PROMPT": "&promptIDEN_ANAGRAFICA=" + $("#IDEN_ANAG").val()};
                home.NS_FENIX_PRINT.caricaDocumento(_par);
                _par['beforeApri'] = home.NS_FENIX_PRINT.initStampa;
                home.NS_FENIX_PRINT.apri(_par);
            });
            $(".butStampaTesseraENI").on("click", function () {
                _par = {"PRINT_DIRECTORY": "ANAGRAFICA", "PRINT_REPORT": "tesseraENI", "PRINT_PROMPT": "&promptIDEN_ANAGRAFICA=" + $("#IDEN_ANAG").val()};
                home.NS_FENIX_PRINT.caricaDocumento(_par);
                _par['beforeApri'] = home.NS_FENIX_PRINT.initStampa;
                home.NS_FENIX_PRINT.apri(_par);
            });

            $("#txtPesoNascita").off().on("blur", function () {

                NS_ACC_RICOVERO_CHECK.checkPesoNeonato($(this));

            });


            var dataRicovero = $("#txtDataRico").val() == '' ? moment() : moment($("#txtDataRico").val(), 'DD/MM/YYYY');

            var dataRico5anni = moment(dataRicovero).add(-5, 'year').format("DD/MM/YYYY");
            var dataRico1giorno = moment(dataRicovero).add(-1, 'day').format("DD/MM/YYYY");
            /*alert(dataRico5anni);
             alert(dataRico1giorno);     */

            $("#txtDataPren").Zebra_DatePicker({
                direction: [dataRico5anni, dataRico1giorno],
                start_date: dataRico1giorno
                        //,disabled_dates : ['* * '+data.ANNO]
			});
			if(_STATO_PAGINA == "I"){
				$("#txtDataPren").val(dataRico1giorno);
				$("#h-txtDataPren").val(moment(dataRicovero).add(-1,'day').format("YYYYMMDD"))
			};


            $("#txtDataPren").on({blur: function () {
                    var dataPren = Number($("#h-txtDataPren").val()) + 1;

                    if (this.value !== '' && !NS_ACC_RICOVERO_CHECK.checkDataPren(String(dataPren), $("#txtDataRico").val())) {
                        home.NOTIFICA.error({title: "Attenzione", message: "La data di prenotazione deve essere inferiore alla data di inizio ricovero e maggiore del " + moment().add(-5, 'year').format("DD/MM/YYYY"), timeout: 0});
                        this.value = "";
                    }
                }});


            $("#txtDataFineAccesso, #txtOraFineAccesso").on("change", function () {
                NS_ACC_RICOVERO.controlliDataFinePrimoaccesso();

            });

        },
        definisciComportamento: function () {

            logger.debug("Definisci Conportamento : _STATO_PAGINA ->  " + _STATO_PAGINA + ", Anagrafica -> " + _JSON_ANAGRAFICA.id);

            NS_ACC_RICOVERO.Setter.setIntestazione();
            NS_ACC_RICOVERO.Setter.setSezioneAnagrafica();


            switch (_STATO_PAGINA)
            {
                case "E" :
                    NS_ACC_RICOVERO.Events.HL7Event = 'A08';
                    NS_ACC_RICOVERO_CHECK.checkDatiCartella();
                   // NS_ACC_RICOVERO.setReadonlyDatiPrimoAccesso();
                    NS_ACC_RICOVERO.aggiornaPagina();
                    break;
                case "L" :
                    NS_ACC_RICOVERO.aggiornaPagina();
                    NS_ACC_RICOVERO.setReadonlyDatiPrimoAccesso();
                    break;

                case "I" :
                    NS_ACC_RICOVERO.Events.HL7Event = 'A01';
                    $("#txtDataRico").val(moment().format('DD/MM/YYYY'));
                    $("#h-txtDataRico").val(moment().format('YYYYMMDD'));
                    $("#txtOraRico").val(moment().format('HH:mm'));
                    $("#H-txtOraRico").val(moment().format('HH:mm'));

                    if (home.baseUser.TIPO_PERSONALE == 'M')
                    {
                        $("#h-txtMedicoAcc").val(home.baseUser.IDEN_PER);
                        $("#txtMedicoAcc").val(home.baseUser.DESCRIZIONE);
                    }

                    NS_ACC_RICOVERO_CHECK.hasContattiAperti();
                    NS_ACCESSI_DH.hideShowDatiPrimoAccessoDh(false);
            }

            NS_ACC_RICOVERO.Setter.setPazienteSconosciuto();
            NS_ACC_RICOVERO_CHECK.setAutorizzazioni();

            if (typeof $('#IDEN_LISTA').val() != 'undefined') {
                NS_ACC_RICOVERO.Events.setDataUrgenzaFromLista();
            }

        },
        setDataUrgenzaFromLista: function () {

            var db = $.NS_DB.getTool({setup_default: {datasource: 'ADT'}});

            db.call_procedure(
                    {
                        id: 'FX$PCK_LISTA_ATTESA_PZ.GET_INFO',
                        parameter:
                                {
                                    P_IDEN_LISTA: $('#IDEN_LISTA').val(),
                                    P_PRIORITA_CODICE: {t: 'V', d: 'O'},
                                    P_CDC: {t: 'N', d: 'O'},
                                    P_PROVENIENZA: {t: 'N', d: 'O'},
                                    P_DATA_PRENOTAZIONE: {t: 'V', d: 'O'}
                                },
                        success: function (data) {

                            $("#txtDataPren").val(moment(data["P_DATA_PRENOTAZIONE"], 'YYYYMMDDHH:mm').format("DD/MM/YYYY"));
                            $("#h-txtDataPren").val(moment(data["P_DATA_PRENOTAZIONE"], 'YYYYMMDDHH:mm').format("YYYYMMDD"));
                            $("#h-cmbLivelloUrg").val(data["P_PRIORITA_CODICE"]);
                            $("#cmbLivelloUrg_" + data["P_PRIORITA_CODICE"]).addClass("CBpulsSel");
                            $("#cmbRepartoRico").val(data["P_PROVENIENZA"]);

                            NS_REPARTI.Assistenziali.setReparto();
                        }
                    }
            );
        },
        valorizeComboCausaEsterna: function (callback) {

            var db = $.NS_DB.getTool({setup_default: {datasource: 'ADT'}});

            var xhr = db.select(
                    {
                        id: "ADT.Q_CAUSA_ESTERNA",
                        parameter: {"codCategoria": {t: 'V', v: $("#txtCategoriaCausaEsterna").attr("data-c-value")}}
                    });

            xhr.done(function (data, textStatus, jqXHR) {

                $("#cmbCausaEsterna").empty();
                $("#cmbCausaEsterna").append("<option value=''></option>");

                $.each(data.result, function (i, v) {
                    $("#cmbCausaEsterna").append("<option value='" + v.VALUE + "'>" + v.DESCR + "</option>");
                });

                if (typeof callback === "function")
                {
                    callback();
                }

            });


        }
    },
    Diagnosi: {
        setDiagnosi: function () {

            for (var i = 0; i < _JSON_CONTATTO.codiciICD.mapCodiciICD.length; i++) {

                if (_JSON_CONTATTO.codiciICD.mapCodiciICD[i].key == 'DIAGNOSI')
                {
                    for (var j = 0; j < _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value.length; j++)
                    {
                        if (_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].evento.codice == NS_ACC_RICOVERO.Events.ICDEvent)
                        {
                            $("#acDiagnosiICD9").data('acList').returnSelected({DESCR: _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].codice + ' - ' + _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].descrizione, VALUE: _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].codice});
                        }
                    }
                }
            }

        },
        getDiagnosi: function () {

            var jsonDia = _JSON_CONTATTO.codiciICD;
            var hasDiagnosi = false;

            for (var i = 0; i < jsonDia.mapCodiciICD.length; i++)
            {
                if (jsonDia.mapCodiciICD[i].key == 'DIAGNOSI')
                {
                    hasDiagnosi = true;
                    break;
                }
            }
            var idxDiagnosi = i;
            if (hasDiagnosi)
            {
                // Controllo Abbia Una Disgnosi in Accettazione
                for (var j = 0; j < jsonDia.mapCodiciICD[idxDiagnosi].value.length; j++)
                {
                    if (jsonDia.mapCodiciICD[idxDiagnosi].value[j].evento.codice == NS_ACC_RICOVERO.Events.ICDEvent)
                    {
                        jsonDia.mapCodiciICD[idxDiagnosi].value.splice(j, 1);
                    }
                }

                jsonDia.mapCodiciICD[i].value.push(
                        {
                            "descrizione": $("#txtDiagnosiICD9").val(),
                            "evento": {
                                "id": null,
                                "codice": NS_ACC_RICOVERO.Events.ICDEvent
                            },
                            "data": null,
                            "id": null,
                            "codice": $("#txtDiagnosiICD9").attr("data-c-codice"),
                            "ordine": 0
                        }
                );
            }
            else
            {
                jsonDia.mapCodiciICD.push(
                        {
                            "key": "DIAGNOSI",
                            "value":
                                    [
                                        {
                                            "descrizione": $("#txtDiagnosiICD9").val(),
                                            "evento": {
                                                "id": null,
                                                "codice": NS_ACC_RICOVERO.Events.ICDEvent
                                            },
                                            "data": null,
                                            "id": null,
                                            "codice": $("#txtDiagnosiICD9").attr("data-c-codice"),
                                            "ordine": 0
                                        }
                                    ]
                        }
                );
            }

            return jsonDia;
        }
    },
    overrideRegistra: function () {
        if (_STATO_PAGINA === "I")
        {
            var _tipo_apertura = $("#TIPO").val();

            logger.info("Override Funzione Registra - Stato Pagina INSERIMENTO - Tipo Apertura -> " + _tipo_apertura);

            switch (_tipo_apertura)
            {
                case "DAPRE" :
                    NS_FENIX_SCHEDA.registra = NS_ACC_RICOVERO_SALVATAGGI.registraDaPrericovero;
                    break;
                case "WKPAZ" :
                    NS_FENIX_SCHEDA.registra = NS_ACC_RICOVERO_SALVATAGGI.registraInserimento;
                    break;
                case "LISTA" :
                    NS_ACC_RICOVERO.lista = true;
                    NS_FENIX_SCHEDA.registra = NS_ACC_RICOVERO_SALVATAGGI.registraInserimento;
                    break;
                default :
                    NS_FENIX_SCHEDA.registra = NS_ACC_RICOVERO_SALVATAGGI.registraInserimento;
                    break;
            }
        }

        if (_STATO_PAGINA !== "I")
        {
            logger.info("Override Funzione Registra - Stato Pagina MODIFICA - Tipo Apertura NON DEFINITO");
            NS_FENIX_SCHEDA.registra = NS_ACC_RICOVERO_SALVATAGGI.registraModifica;
        }

    },
    getNotaBraccialetto: function () {
        var iden_contatto = $("#IDEN_CONTATTO").val();


        var db = $.NS_DB.getTool({setup_default: {datasource: 'ADT'}});

        var xhr = db.select(
                {
                    id: "ADT.Q_NOTE_BRACCIALETTO_RICOVERO",
                    parameter: {"idenContatto": {t: 'N', v: iden_contatto}}
                });

        xhr.done(function (data, textStatus, jqXHR) {

            if (data.result.NOTA_BRACCIALETTO !== '' && typeof data.result.NOTA_BRACCIALETTO !== "undefined") {
                $("#taNoteBraccialettoRicovero").val(data.result[0].NOTA_BRACCIALETTO);
            }


        });

    },
    /***
     *
     * @param json
     * @return {boolean}
     */
    checkOnere: function (json) {
        json = typeof json == 'undefined' ? json = {} : json;
        var codice = typeof json.codice != 'undefined' ? json.codice : $("#cmbOnere").find("option:selected").attr("data-codice");
        var esteri = new RegExp("^[9-9]{3}");
        var codiceRegione = typeof json.codiceRegioneRes != 'undefined' ? json.codiceRegioneRes : $("#txtComuneRes").attr("data-c-codice_regione");

        //se onere � ssn controllo che la regione di residenza non sia 999
        return !(codice == NS_ACC_RICOVERO.SSN && esteri.test(codiceRegione));

    },
    setReadonlyDatiPrimoAccesso: function () {
        $("#txtDataFineAccesso, #txtOraFineAccesso").attr("readonly", "readonly");
    },
    controlliDataFinePrimoaccesso: function () {

        //console.log("Change txtDataFineAccesso  - txtOraFineAccesso ");
        //effettuo i controlli se entrambi i campi sono valorizzati
        var hDataFineAccesso = $("#h-txtDataFineAccesso").val();
        var hDataInizio = $("#h-txtDataRico").val();
        var $OraFineAccesso = $("#txtOraFineAccesso");
        var OraFineAccesso = $OraFineAccesso.val() == '' ? '23:59' : $OraFineAccesso.val();
        var oraInizio = $("#txtOraRico").val();
        if (hDataFineAccesso != '') {
            try {

                _JSON_CONTATTO.setDataInizio(hDataInizio + oraInizio);

                _JSON_CONTATTO.getAccessoAssistenziale(0).setDataInizio(hDataInizio + oraInizio);

                _JSON_CONTATTO.getAccessoAssistenziale(0).setDataFine(hDataFineAccesso + OraFineAccesso);

            } catch (e) {

                logger.error(e.code + ' - ' + e.message);
                if (typeof e.code != 'undefined') {
                    home.NOTIFICA.error({title: "Attenzione", message: e.message, timeout: 0});
                    $("#h-txtDataFineAccesso, #txtDataFineAccesso, #txtOraFineAccesso").val("");
                }

            }
        }

    }
};


var NS_REGIME_TIPO_MOTIVO_RICOVERO = {
    regimeOrdinario: "1",
    regimeDH: "2",
    Tree:
            {
                tipologiaRicovero: {
                    "1": [],
                    "2": []
                },
                motivoRicovero: {
                    "1": [],
                    "2": []
                }
            },
    /**
     * Valorizza un JSON a partire dai dati caricati nelle combo.
     * Il JSON viene poi utilizzato per la valorizzazione delle combo del tipo del motivo al change del motivo.
     */

    valorizeTree: function () {
        $("#cmbTipoRico optgroup").each(function (idx, value)
        {
            var regimeOptgroup = $(value).attr('label') == "ORD" ? "1" : "2";
            if (NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.tipologiaRicovero[regimeOptgroup].length == 0) {
                $(this).find("option").each(function (idx, value)
                {
                    // alert("Regime: "+ regimeOptgroup + "\nValue: " + $(value).val() + "\nText: " + $(value).text());
                    NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.tipologiaRicovero[regimeOptgroup].push(
                            {id: "cmbTipoRico_" + $(value).val(), value: $(value).val(), text: $(value).text()}
                    );
                });
            }
        });

        $("#cmbMotivoRico optgroup").each(function (idx, value)
        {
            var regimeOptgroup = $(value).attr('label') == "ORD" ? "1" : "2";
            if (NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.motivoRicovero[regimeOptgroup].length == 0) {
                $(this).find("option").each(function (idx, value)
                {
                    // alert("Regime: "+ regimeOptgroup + "\nValue: " + $(value).val() + "\nText: " + $(value).text());
                    NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.motivoRicovero[regimeOptgroup].push(
                            {id: "cmbMotivoRico_" + $(value).val(), value: $(value).val(), text: $(value).text()}
                    );
                });
            }

        });

    },
    setTipoMotivoFromRegime: function (r)
    {
        var regime = typeof r == 'undefined' ? $("#cmbRegime option:selected").val() : r;

        // Gestione Tipologia Ricovero da Regime solo se non gia' valorizzato
        $("#cmbTipoRico optgroup").remove();
        $("#cmbTipoRico").append($("<optgroup></optgroup>").attr("label", regime == "1" ? "Ordinario" : "Day Hospital")).removeAttr("disabled");

        for (var i = 0; i < NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.tipologiaRicovero[regime].length; i++)
        {
            var opt = NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.tipologiaRicovero[regime][i];
            $("#cmbTipoRico optgroup").append($("<option></option>").attr("id", opt.id).val(opt.value).text(opt.text));
        }

        // Gestione Motivo Ricovero da Regime solo se non gia' valorizzato
        $("#cmbMotivoRico optgroup").remove();
        $("#cmbMotivoRico").append($("<optgroup></optgroup>").attr("label", regime == "1" ? "Ordinario" : "Day Hospital")).removeAttr("disabled");

        for (var j = 0; j < NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.motivoRicovero[regime].length; j++)
        {
            var opt = NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.motivoRicovero[regime][j];
            $("#cmbMotivoRico optgroup").append($("<option></option>").attr("id", opt.id).val(opt.value).text(opt.text));
        }

        // Se Regime DH Mostro la sezione dedicata
        NS_ACCESSI_DH.hideShowDatiPrimoAccessoDh(regime == NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeDH ? true : false);

    },
    setDataPrenotazioneFromTipoRegime: function (regime) {
        var _regime = "";
        if (typeof regime == 'undefined') {
            _regime = $("#cmbRegime").find("option:selected").val();
        } else {
            _regime = regime;
        }
        var _tipo = $("#cmbTipoRico option:selected").val();

        if (_tipo == null || _tipo === "") {
            return;
        }

        if (_regime == NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeDH || (_regime == NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeOrdinario && $.inArray(_tipo, NS_ACC_RICOVERO.ricoveroPROG) >= 0))
        {
            // Ricovero programmato
            $("#cmbLivelloUrg").data("CheckBox").enable();
            NS_ACC_RICOVERO.Utils.enableField('txtDataPren');

				if(NS_ACC_RICOVERO.flgNeonato){
					V_ADT_ACC_RICOVERO.elements.txtDataPren.status = "";
					V_ADT_ACC_RICOVERO.elements['h-cmbLivelloUrg'].status = '';
				}
				else{
					V_ADT_ACC_RICOVERO.elements.txtDataPren.status = "required";
					V_ADT_ACC_RICOVERO.elements['h-cmbLivelloUrg'].status = 'required';
				}


	        }
        else if (_regime == NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeOrdinario && _tipo === "2")
        {
            // Ricovero Urgente

			V_ADT_ACC_RICOVERO.elements.txtDataPren.status = "";
			V_ADT_ACC_RICOVERO.elements['h-cmbLivelloUrg'].status = '';


            NS_ACC_RICOVERO.Utils.disableField('txtDataPren');
            $("#cmbLivelloUrg").data("CheckBox").deselectAll();
            $("#cmbLivelloUrg").data("CheckBox").disable();
            $("#txtDataPren, #h-txtDataPren").val("");
        }
        else
        {
            // Tutti gli altri casi
            V_ADT_ACC_RICOVERO.elements.txtDataPren.status = "";
            NS_ACC_RICOVERO.Utils.disableField('txtDataPren');

            V_ADT_ACC_RICOVERO.elements['h-cmbLivelloUrg'].status = "";
            $("#txtDataPren, #h-txtDataPren, #h-cmbLivelloUrg").val("");

            $("#cmbLivelloUrg").data("CheckBox").disable();
            $("#cmbLivelloUrg").data("CheckBox").deselectAll();
        }

        NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ADT_ACC_RICOVERO"});
    }


};