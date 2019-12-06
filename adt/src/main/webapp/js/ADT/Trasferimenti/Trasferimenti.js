/**
 * User: matteopi, alessandroa
 * Date: 26/07/13
 * Time: 14.25
 *
 * 20140522 - alessandro.arrighi - Gestione Chiamata Controller tramite POST.<br />
 * 20140721 - alessandro.arrighi - Rimozione Controllo Richiesta Trasferimento tramite Procedura ma JSON.<br />
 * 20140804 - alessandro.arrighi - Ottimizzazione Funzioni + Generalizzazione variabile jsonContatto in _JSON_CONTATTO + Stesura Commenti.<br />
 * 20141110 - alessandro.arrighi - Rimozione Ora di default per inizio trasferimento e trasporto in ambulanza.
 */

var NS_RICH_TRASF_GIURIDICO = {
    ambulanza: 'N',
    fenixDestinatario: null,
	_JSON_ASSISTENZIALE_NEW : null,
	_JSON_GIURIDICO_NEW : null,

    init: function () {

        NS_RICH_TRASF_GIURIDICO.Events.setEvents();
        NS_RICH_TRASF_GIURIDICO.overrideRegistra();
        NS_RICH_TRASF_GIURIDICO.Setter.valorizzaPagina();

        NS_WK_TRASFERIMENTI.init();

        NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ADT_TRASF_GIU"});

		//all'init della pagina creo i cloni dei segmenti almeno posso iniziare a farci i controlli prima
		NS_RICH_TRASF_GIURIDICO._JSON_ASSISTENZIALE_NEW = _JSON_CONTATTO.getLastAccessoAssistenziale().clone();
		NS_RICH_TRASF_GIURIDICO._JSON_GIURIDICO_NEW = _JSON_CONTATTO.getLastAccessoGiuridico().clone();
    },
    overrideRegistra: function (p) {
        NS_FENIX_SCHEDA.registra = NS_RICH_TRASF_GIURIDICO.registra;
    },
    Events: {
        setEvents: function () {

            // Setto Il Logger della CONSOLE JS
            home.NS_CONSOLEJS.addLogger({name: 'TabTrasferimentoRicovero', console: 0});
            window.logger = home.NS_CONSOLEJS.loggers['TabTrasferimentoRicovero'];

            NS_RICH_TRASF_GIURIDICO.Setter.setIntestazione();
            NS_RICH_TRASF_GIURIDICO.Setter.setButtonScheda();
            NS_RICH_TRASF_GIURIDICO.Events.setDataOraPartenzaAmbulanza();

            $("#acRepGiu").data("acList").changeBindValue({"iden_contatto": $('#IDEN_CONTATTO').val()});
            $("#repartoGiuridico").data("autocomplete").changeBindValue({"iden_contatto": $('#IDEN_CONTATTO').val()});
            $("#butRepartoAttuale").on("click", function () {
                NS_RICH_TRASF_GIURIDICO.setRepartoGiuridicoAttuale();
            });
            $("#h-radTrasfAmbulanza").on("change", function (obj) {
                NS_RICH_TRASF_GIURIDICO.Events.setDataOraPartenzaAmbulanza($(this).val());
            });

			$("#dateData").on("change blur", function () {
				NS_RICH_TRASF_GIURIDICO.checkDataTrasferimento();
			});
			$("#txtOraInizio").on("change blur", function () {
				NS_RICH_TRASF_GIURIDICO.checkOraTrasferimento();
			})
    		
        },
        setDataOraPartenzaAmbulanza: function (ambulanza) {

            NS_RICH_TRASF_GIURIDICO.ambulanza = ambulanza;

            if (NS_RICH_TRASF_GIURIDICO.ambulanza === 'S')
            {
                V_ADT_TRASF_GIU.elements['txtDataPartenzaAmbulanza'].status = "required";
                V_ADT_TRASF_GIU.elements['txtOraPartenzaAmbulanza'].status = "required";
                $('#txtDataPartenzaAmbulanza').closest('TR').show();
            }
            else
            {
                V_ADT_TRASF_GIU.elements['txtDataPartenzaAmbulanza'].status = null;
                V_ADT_TRASF_GIU.elements['txtOraPartenzaAmbulanza'].status = null;
                $('#txtDataPartenzaAmbulanza').closest('TR').hide();
            }

            NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ADT_TRASF_GIU"});
        }

    },
	checkDataTrasferimento :function () {
		NS_RICH_TRASF_GIURIDICO.setDataInizio($("#dateData"));

	},
	checkOraTrasferimento : function () {
		NS_RICH_TRASF_GIURIDICO.setDataInizio($("#txtOraInizio"));
	},
	setDataInizio : function (selector){
		var data = $("#dateData");
		var hdata = $("#h-dateData");
		var ora = $("#txtOraInizio");
		if(data.val() != '' && ora.val() != '' && hdata.val() != ''){
			try {
				NS_RICH_TRASF_GIURIDICO._JSON_ASSISTENZIALE_NEW.setDataInizio(hdata.val()+ora.val());

			}catch (e){
				logger.error(e.code  + ' - '+ e.message );
				if(typeof e.code != 'undefined' ){
					home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
					selector.val("");
				}
			}
		}
	},
    
    /**
     * Funzione che si occupa dell'inserimento del segmento giuridico e/o assistenziale.
     * Occorre tenere presente:
     * 	Se il trasferimento avviene con il trasporto in ambulanza viene inserito in stato REQUESTED
     * 	Se il trasferimento avviene senza il trasporto in ambulanza viene inserito in stato ADMITTED
     * 	Se il nuovo segmento giuridico del trasferimento e' identico al precedente verra' eseguito solo un trasferimento assistenziale
     *
     */
    registra: function () {
		try {

        logger.debug("Trasferimento - Registrazione - Contatto -> " + _JSON_CONTATTO.id + ", Stato Pagina -> " + _STATO_PAGINA);

        var isRichiesta = $("#h-radTrasfAmbulanza").val() === "S" ? true : false;
        var _dataInizio = moment($("#h-dateData").val() + $("#txtOraInizio").val(), "YYYYMMDDHH:mm");

        var p = {
            "contatto": _JSON_CONTATTO,
            "hl7Event": "A02",
            "tipoTrasferimento": null,
            "notifica": {
                "show": "S",
                "timeout": 3,
                "message": isRichiesta ? "Richiesta di Trasferimento Effettuata con Successo" : "Trasferimento Avvenuto con Successo",
                "errorMessage": isRichiesta ? "Errore Durante Richiesta di Trasferimento" : "Errore Durante Trasferimento"
            },
            "cbkSuccess": function () {
            }
        };

        if (!NS_FENIX_SCHEDA.validateFields()) {
            return false;
        }

    	var _json_assistenziale = NS_RICH_TRASF_GIURIDICO._JSON_ASSISTENZIALE_NEW;
        var _json_giuridico = NS_RICH_TRASF_GIURIDICO._JSON_GIURIDICO_NEW;


        _json_assistenziale.precedente = {id: _json_assistenziale.id};
        _json_assistenziale.id = null;
        _json_assistenziale.uteInserimento = {id: home.baseUser.IDEN};

        _json_giuridico.precedente = {id: _json_giuridico.id};
        _json_giuridico.id = null;
        _json_giuridico.uteInserimento = {id: home.baseUser.IDEN};


        // Se richiesta e il destinatario è partito con ADT valorizzo la struttura del contatto assistenziale con i dati relativi al trasporto in ambulanza
        if (isRichiesta)
        {
            var _dataAmbulanza = moment($('#h-txtDataPartenzaAmbulanza').val() + $('#txtOraPartenzaAmbulanza').val(), "YYYYMMDDHH:mm");

            // Ciclo i Segmenti Assistenziali per verificare se e' gia' stata fatta una richiesta di trasferimento
            for (var j = 0; j < _JSON_CONTATTO.contattiAssistenziali.length; j++)
            {
                if (!(_dataAmbulanza.isAfter(moment(_JSON_CONTATTO.contattiAssistenziali[j].dataInizio, "YYYYMMDDHH:mm")))) {

                    if (j > 0) {
                        var _message = "La data di partenza dell'ambulanza " + _dataAmbulanza.format("DD/MM/YYYY HH:mm") + " deve essere superiore alla data del trasferimento precedente " + moment(_JSON_CONTATTO.contattiAssistenziali[j].dataInizio, "YYYYMMDDHH:mm").format("DD/MM/YYYY HH:mm");
                    } else if (j == 0) {
                        var _message = "La data di partenza dell'ambulanza " + _dataAmbulanza.format("DD/MM/YYYY HH:mm") + " deve essere superiore alla data di inizio ricovero " + moment(_JSON_CONTATTO.contattiAssistenziali[j].dataInizio, "YYYYMMDDHH:mm").format("DD/MM/YYYY HH:mm");
                    }

                    home.NOTIFICA.error({message: _message, timeout: 8, title: "Error"});

                    return logger.error(_message);
                }
            }

            _json_assistenziale.stato = {id: null, codice: "REQUESTED"};
            _json_assistenziale.attivo = false;
            _json_assistenziale.mapMetadatiString['AMBULANZA'] = "S";
            _json_assistenziale.mapMetadatiString['DATA_PARTENZA_AMBULANZA'] = $('#h-txtDataPartenzaAmbulanza').val() + $('#txtOraPartenzaAmbulanza').val();
            _json_assistenziale.mapMetadatiString['DATA_ARRIVO_AMBULANZA'] = null;

            _json_giuridico.stato = {id: null, codice: "REQUESTED"};
            _json_giuridico.attivo = false;
        }
        else
        {
            _json_assistenziale.stato = {id: null, codice: "ADMITTED"};
            _json_assistenziale.attivo = true;
            _json_assistenziale.mapMetadatiString['AMBULANZA'] = "N";
            _json_assistenziale.mapMetadatiString['DATA_PARTENZA_AMBULANZA'] = null;
            _json_assistenziale.mapMetadatiString['DATA_ARRIVO_AMBULANZA'] = null;

            _json_giuridico.stato = {id: null, codice: "ADMITTED"};
            _json_giuridico.attivo = true;
        }

        var cmbRepartoGiuridico = $('#h-repartoGiuridico').val();
        var cmbRepartoAssistenziale = $('#h-repartoAssistenziale').val();

        if (cmbRepartoGiuridico == null || cmbRepartoGiuridico == "")
        {
            return home.NOTIFICA.warning({message: "Attenzione. Popolare Correttamente il Reparto Giuridico", title: "Warning"});
        }

        if (cmbRepartoAssistenziale == null || cmbRepartoAssistenziale == "")
        {
            return home.NOTIFICA.warning({message: "Attenzione. Popolare Correttamente il Reparto Assistenziale", title: "Warning"});
        }

        _json_assistenziale.codiciEsterni = {"codice1": null, "codice2": null, "codice3": null, "contatto": null};
        _json_giuridico.codiciEsterni = {"codice1": null, "codice2": null, "codice3": null, "contatto": null};

        if (_json_giuridico.provenienza.id == cmbRepartoGiuridico
                && _json_assistenziale.provenienza.id == cmbRepartoAssistenziale) {
            return home.NOTIFICA.error({message: 'Attenzione: i reparti non sono cambiati, trasferimento non valido', title: "Error"});
        }
        else if (
                _json_giuridico.provenienza.id == cmbRepartoGiuridico
                && !(_json_assistenziale.provenienza.id == cmbRepartoAssistenziale)
                )
        {
            // Trasferimento Assistenziale
            _json_assistenziale.note = "TRASFERIMENTO ASSISTENZIALE DA " + _json_assistenziale.provenienza.id + " a " + cmbRepartoAssistenziale;
            _json_assistenziale.setDataInizio(_dataInizio.format("YYYYMMDDHH:mm")) ;
            _json_assistenziale.provenienza = {id: cmbRepartoAssistenziale, codice: null, idCentroDiCosto: null};
            _json_assistenziale.precedente = {id :_JSON_CONTATTO.getLastAccessoAssistenziale().id};
            _json_assistenziale.contattoGiuridico.id = _json_giuridico.id;

            _JSON_CONTATTO.contattiAssistenziali.push(_json_assistenziale);

            p.tipoTrasferimento = "A";
        }
        else
        {
            // Trasferimento GIURIDICO e ASSISTENZIALE
            _json_assistenziale.note = "TRASFERIMENTO ASSISTENZIALE DA " + _json_assistenziale.provenienza.id + " a " + cmbRepartoAssistenziale;
			_json_assistenziale.setDataInizio(_dataInizio.format("YYYYMMDDHH:mm")) ;
            _json_assistenziale.provenienza = {id: cmbRepartoAssistenziale, codice: null, idCentroDiCosto: null};
            _json_assistenziale.precedente = {id :  _JSON_CONTATTO.getLastAccessoAssistenziale().id};

            _json_giuridico.note = "TRASFERIMENTO GIURIDICO DA " + _json_giuridico.provenienza.id + " a " + cmbRepartoGiuridico;
			_json_giuridico.setDataInizio(_dataInizio.format("YYYYMMDDHH:mm")) ;
            _json_giuridico.provenienza = {id: cmbRepartoGiuridico, codice: null, idCentroDiCosto: null};
            _json_giuridico.precedente = {id :  _JSON_CONTATTO.getLastAccessoGiuridico().id};

            _JSON_CONTATTO.contattiAssistenziali.push(_json_assistenziale);
            _JSON_CONTATTO.contattiGiuridici.push(_json_giuridico);

            p.tipoTrasferimento = "GA";
        }

        p.cbkSuccess = function () {

            if (_STATO_PAGINA == "E")
            {
                _JSON_CONTATTO = NS_CONTATTO_METHODS.contatto;

                NS_WK_TRASFERIMENTI.wkTrasferimenti.refresh();
                NS_RICH_TRASF_GIURIDICO.Setter.valorizzaPagina();
            }
            else
            {
                NS_FENIX_SCHEDA.chiudi({'refresh': true});
            }
        };

        p.cbkError = function (data) {

            if (p.tipoTrasferimento.lastIndexOf("G") >= 0) {
                _JSON_CONTATTO.contattiAssistenziali.splice(_JSON_CONTATTO.contattiAssistenziali.length - 1, 1);
                _JSON_CONTATTO.contattiGiuridici.splice(_JSON_CONTATTO.contattiGiuridici.length - 1, 1);
            } else if (p.tipoTrasferimento.lastIndexOf("A") >= 0) {
                _JSON_CONTATTO.contattiAssistenziali.splice(_JSON_CONTATTO.contattiAssistenziali.length - 1, 1);
            }

            var str = JSON.stringify(data);
            var patt = new RegExp("ORA-20111");
            var res = patt.test(str);

            if (res) {
                return home.NOTIFICA.error({message: "Paziente gi&agrave; trasferito.", timeout: 0, title: "Error"});
            }

        };

        if (!isRichiesta)
        {
            NS_CONTATTO_METHODS.transferPatient(p);
        }
        else
        {
            NS_CONTATTO_METHODS.pendingTransfer(p);
        }

		}catch(e){
			logger.error(e.code  + ' - '+ e.message );
			if(typeof e.code != 'undefined' ){
				home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
			}
		}

	},
    Setter: {
        setButtonScheda: function () {
            //tutti i bottoni sono nascosti devo solo preoccurarmi di farli vedere

            $('.butChiudi').show();

            if (!(_STATO_PAGINA == 'L' || _JSON_CONTATTO.stato.codice == 'DISCHARGED')) {
                $(".butSalva").show();
            }

        },
        /**
         * Funzione che si occupa della valorizzazione della pagina a partire dal JSON del Contatto. <br />
         * Questo permette di NON utilizzare la query della pagina per valorizzare la pagina in modifica quindi evitare un query (non leggera).
         *
         * @author alessandroa
         */

        valorizzaPagina: function () {

            logger.debug("Trasferimento - Contatto -> " + _JSON_CONTATTO.codice.codice + ", Stato Pagina -> " + _STATO_PAGINA);

            $('#txtCartellaAcc').val(_JSON_CONTATTO.codice.codice);
            $('#txtDataRicoveroAcc').val(moment(_JSON_CONTATTO.dataInizio, 'YYYYMMDDHH:mm').format('DD/MM/YYYY'));
            $('#txtOraRicoveroAcc').val(moment(_JSON_CONTATTO.dataInizio, 'YYYYMMDDHH:mm').format('HH:mm'));
            $('#txtRepartoAcc1').val(_JSON_CONTATTO.contattiGiuridici[0].provenienza.descrizione);

            // Ciclo i segmenti giuridici per essere sicuro di prendere quello attivo
            for (var x = _JSON_CONTATTO.contattiGiuridici.length - 1; x >= 0; x--)
            {
                if (_JSON_CONTATTO.contattiGiuridici[x].attivo)
                {
                    $('#txtRepartoAttGiu').val(_JSON_CONTATTO.contattiGiuridici[x].provenienza.descrizione);
                }
            }

            // Ciclo i segmenti assistenziali per essere sicuro di prendere quello attivo
            for (var y = _JSON_CONTATTO.contattiAssistenziali.length - 1; y >= 0; y--)
            {
                if (_JSON_CONTATTO.contattiAssistenziali[y].attivo)
                {
                    $('#txtRepartoAttAss').val(_JSON_CONTATTO.contattiAssistenziali[y].provenienza.descrizione);
                }
            }

        },
        setIntestazione: function () {

            $('#lblTitolo').html(_JSON_ANAGRAFICA.cognome + ' ' + _JSON_ANAGRAFICA.nome + ' - ' + _JSON_ANAGRAFICA.sesso + ' - ' + moment(_JSON_ANAGRAFICA.dataNascita, 'YYYYMMDDHH:mm').format('DD/MM/YYYY') + ' - ' + _JSON_ANAGRAFICA.codiceFiscale);

            // Button in alto a sinistra per il print degli errori della pagina
            $("#butPrintVideata").remove();
            $(".headerTabs").append($("<button></button>").attr("id", "butPrintVideata").attr("class", "btn").html(traduzione.butPrintVideata).css({"float": "right"}).on("mousedown", function () {
                window.print();
            }));
            $("#lblTitolo").css({"width": "80%", "display": "inline"});
        }

    },
    processDiffMinuti: function (data, wk) {

        if (data.DIFF_MINUTI != null)
        {
            var minutiTotali = data.DIFF_MINUTI;
            var ore = Math.floor(minutiTotali / 60);
            var minuti = minutiTotali - ore * 60;
            var oreMinuti = 'ore ' + ore.toString() + ' e ' + minuti.toString() + ' minuti';
            return oreMinuti;
        }
        else {
            return null;
        }
        ;
    },
    setRepartoGiuridicoAttuale: function () {

        // Ciclo i segmenti giuridici per essere sicuro di prendere quello attivo
        for (var x = _JSON_CONTATTO.contattiGiuridici.length - 1; x >= 0; x--)
        {
            if (_JSON_CONTATTO.contattiGiuridici[x].attivo) {
                $("#repartoGiuridico").val(_JSON_CONTATTO.contattiGiuridici[x].provenienza.descrizione);
                $("#repartoGiuridico").attr("data-c-value", _JSON_CONTATTO.contattiGiuridici[x].provenienza.id);
                $("#h-repartoGiuridico").val(_JSON_CONTATTO.contattiGiuridici[x].provenienza.id);
            }
        }

        $('#acRepAss').data('acList').changeBindValue({"iden_provenienza": $('#h-repartoGiuridico').val()});
        $('#repartoAssistenziale').data("autocomplete").changeBindValue({"iden_provenienza": $('#h-repartoGiuridico').val()});
    }
};

var NS_WK_TRASFERIMENTI = {
    wkTrasferimenti: null,
    init: function () {

        if (!NS_WK_TRASFERIMENTI.wkTrasferimenti)
        {
            var params = {
                container: "divWkTrasferimenti",
                id: 'WK_TRASFERIMENTI_PAZIENTE',
                aBind: ['IDEN_CONTATTO'],
                aVal: [_IDEN_CONTATTO],
                load_callback: NS_WK_TRASFERIMENTI.CallBack.after
            };
            $("div#divWkTrasferimenti").height("400px");
            NS_WK_TRASFERIMENTI.wkTrasferimenti = new WK(params);
            NS_WK_TRASFERIMENTI.wkTrasferimenti.loadWk();

        }
    },
    processRichiestaTrasferimento: function (data, wk, td) {

        if (data.STATO_CODICE === "REQUESTED") {
            $(wk).closest("tr").addClass("rowRichiestaTrasferimento");
        }

        return data.CODICE_STATO;
    },
    /**
     * Metodo per la cancellazione del trasferimento richiesto tramite ambulanza.
     *
     * @author alessandro.arrighi
     */
    richiediAnnullamentoRichiestaTrasferimento: function (idenContatto) {

        var _json_contatto = _JSON_CONTATTO;

        _json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
        _json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;

        home.DIALOG.si_no({
            title: "Cancellazione Richiesta di Trasferimento ",
            msg: "Si conferma l'operazione di ANNULLAMENTO della richiesta di trasferimento selezionata?",
            cbkNo: function () {
                return;
            },
            cbkSi: function ()
            {
                var pCancelPendingTransfer =
                        {
                            "contatto": _json_contatto,
                            "hl7Event": "ANNULLA RICHIESTA TRASFERIMENTO",
                            "tipoTrasferimento": _json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].stato.codice === "REQUESTED" ? "G" : "A",
                            "notifica": {
                                "show": "S",
                                "timeout": 3,
                                "message": "Cancellazione Richiesta di Trasferimento Avvenuta con Successo", "errorMessage": "Errore Durante Cancellazione Richiesta di Trasferimento"
                            },
                            "cbkSuccess": function () {
                                NS_WK_TRASFERIMENTI.wkTrasferimenti.refresh();
                                _JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(idenContatto);
                            }
                        };
                NS_CONTATTO_METHODS.cancelPendingTransfer(pCancelPendingTransfer);
            }
        });

    },
    richiediAnnullamentoTrasferimento: function (idenContatto, idenSegmentoCartella) {

        logger.debug("Cancellazione Trasferimento - Contatto -> " + idenContatto + ", Riferimento Contatto Assistenziale Cartella -> " + idenSegmentoCartella);

        var _json_contatto = NS_CONTATTO_METHODS.getContattoById(idenContatto);
        _json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
        _json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;

        if (typeof idenSegmentoCartella == "undefined" || idenSegmentoCartella == null)
        {
            return home.NOTIFICA.error({message: "Riferimento del Trasferimento a Cartella Clinica NON Valido. Impossibile Cancellare il Trasferimento", timeout: 0, title: "Error"});
        }

        var db = $.NS_DB.getTool({setup_default: {datasource: 'WHALE'}});

        var xhr = db.select(
                {
                    id: 'DATI.CHECKDATIACCESSO',
                    parameter: {"IDEN": {t: 'N', v: idenSegmentoCartella}}
                });

        xhr.done(function (data, textStatus, jqXHR) {

            logger.debug("Cancellazione Trasferimento - Quesry DATI.CHECKDATIACCESSO Eseguita con Successo - Result -> " + JSON.stringify(data));

            if (data.result[0].NUM === "0")
            {
                logger.debug("Cancellazione Trasferimento - Assenza di dati in Cartella Clinica - Procedo con cancellazione");

                var _lastContattoGiuridico = _JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length - 1].id;
                var pCancelTransferPatient = {
                    "contatto": _JSON_CONTATTO,
                    "hl7Event": "A12",
                    "tipoTrasferimento": "GA",
                    "notifica": {"show": "S", "timeout": 3, "message": "Cancellazione Trasferimento Avvenuta con Successo", "errorMessage": "Errore Durante Cancellazione Trasferimento"},
                    "cbkSuccess": function ()
                    {
                        NS_WK_TRASFERIMENTI.wkTrasferimenti.refresh();
                        _JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(idenContatto);
                        NS_RICH_TRASF_GIURIDICO.Setter.valorizzaPagina();
                    }
                };

                // Controllo se l'assistenziale candidato corrisponde a un trasferimento assistenziale o giuridico
                if (_lastContattoGiuridico === _JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length - 2].contattoGiuridico.id)
                {
                    pCancelTransferPatient.tipoTrasferimento = "A";
                }

                _JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
                _JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length - 1].note = "Trasferimento Giuridico Annullato in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.IDEN_PER;

                _JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
                _JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length - 1].note = "Trasferimento Assistenziale Annullato in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.IDEN_PER;

                home.DIALOG.si_no({
                    title: "Cancellazione Trasferimento",
                    msg: "Si conferma l'operazione di ANNULLAMENTO del trasferimento selezionato?",
                    cbkNo: function () {
                        return;
                    },
                    cbkSi: function () {
                        NS_CONTATTO_METHODS.cancelTransferPatient(pCancelTransferPatient);
                    }
                });

            }
            else
            {
                return home.NOTIFICA.error({message: "Attenzione Presenti Dati in Cartella Clinica. Impossibile Annullare il Trasferimento", timeout: 0, title: "Error"});
            }

        });

        xhr.fail(function (response) {
            logger.error("Cancellazione Trasferimento  - XHR Error -> " + JSON.stringify(response));
            home.NOTIFICA.error({message: "Errore nella Determinazione dell Presenza di Dati in Cartella Clinica", timeout: 0, title: "Error"});
        });

    },
    isLastTrasferimento: function (idenContattoAssistenziale) {

        var _lastContattoAssistenziale = _JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length - 1].id;
        var _nTrasferimenti = _JSON_CONTATTO.contattiAssistenziali.length;

        if (idenContattoAssistenziale === _lastContattoAssistenziale && _nTrasferimenti > 1)
        {
            return true;
        }
        else
        {
            return false;
        }

    },
    CallBack: {
        after: function () {

            var wkt = NS_WK_TRASFERIMENTI.wkTrasferimenti.getRows();

            // Ad ogni eventuale refresh della WK rivalorizzo i reparti della pagina
            for (var x = wkt.length - 1; x >= 0; x--)
            {
                if (wkt[x].CODICE_STATO === "ADMITTED")
                {
                    $("#txtRepartoAttGiu").val(wkt[x].PROVENIENZA_GIU);
                    $("#txtRepartoAttAss").val(wkt[x].PROVENIENZA_ASS);
                }
            }

        },
        before: null
    }
};