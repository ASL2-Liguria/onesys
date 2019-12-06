var NS_VERBALE_EVENTI = {


    setEvents: function () {

        NS_VERBALE_EVENTI.setRegistraEvent();

        $("#radSceltaEsito").on("click", function () {

            var _this = $(this);
            var _value = $(this).find("input[type=hidden]").val();
            var _id = _this.find("div[data-value='"+_value+"']").data("id");

            if(NS_VERBALE_CONTROLLI.hasAValue(_value)){
                $("#hEsitoIden").val(_id);
                $("#hEsito").val(_value);

                NS_VERBALE_CONTROLLI.checkTraumatismi();
                NS_VERBALE.controlloEsito(_value);
            } else {
                NS_VERBALE.divRicovero.hide();
                NS_VERBALE.divTrasferimento.hide();
                NS_VERBALE.divOBI.hide();
                NS_VERBALE.divDecesso.hide();
            }

        });

        $("#radOBI").on("click", function () {
            NS_VERBALE_CONTROLLI.checkTraumatismi();
            NS_VERBALE.controlloEsito($(this).find("input[type=hidden]").val());
        });

        $("#radPrognosi").on("click", function () {
            NS_VERBALE_CONTROLLI.checkGiorniPrognosi($(this).find("input[type=hidden]").val());
        });

        $("#radMantieniOBI").on("click", function () {
            NS_VERBALE_EVENTI.gestioneMantieniOBI($(this).find("input[type='hidden']").val());
        });

        $("#cmbTraumatismo").on("change", function () {
            NS_VERBALE_CONTROLLI.checkTraumatismi();
        });

        $("#txtDayPrognosi").on("change", function () {
            if (NS_VERBALE_CONTROLLI.isANumber($(this).val())) {
                $(this).removeClass("tdError");
            } else {
                $(this).addClass("tdError");
                $(this).val("");
                NS_VERBALE.dialogOK("Inserire i giorni in formato numerico","Attenzione");
            }
        });

        $("#txtCategoriaCausaEsterna").on("change", function () {
            NS_VERBALE_EVENTI.valorizeCausaEsterna();
        });

        $("#txtOraDecesso").on("blur", function () {
            var _this = $(this);
            var myDate = $("#h-txtDataDecesso").val();
            var myHour = _this.val();
            var myDay = (myDate + myHour);
            var adesso = moment().format("YYYYMMDDHHmm");
            var aperturaCartella = _JSON_CONTATTO.dataInizio;
            var diffMax = moment(adesso, "YYYYMMDDHH:mm").diff(moment(aperturaCartella, "YYYYMMDDHH:mm"));
            diffMax = moment.duration(diffMax);

            var diffAttuale = moment(myDay, "YYYYMMDDHH:mm").diff(moment(aperturaCartella, "YYYYMMDDHH:mm"));
            diffAttuale = moment.duration(diffAttuale);

            if (diffAttuale > 0 && diffAttuale <= diffMax) {
                _this.removeClass("tdError");
            } else {
                $.dialog("Ora inserita non corretta",
                    {
                        title: "Attenzione",
                        buttons: [
                            {
                                label: "OK", action: function () {
                                _this.val("");
                                _this.removeClass("tdObb");
                                _this.addClass("tdError");
                                $.dialog.hide();
                            }
                            }
                        ]
                    }
                );
            }
        });

        $(document).on("mousedown", "#taPrognosi", function (e) {
            if (!NS_VERBALE_CONTROLLI.isReadOnly() && NS_VERBALE_CONTROLLI.isCartella()) {
                NS_VERBALE.contextMenu($(this), e);
            }
        });

        $("#taPrognosi").on("mouseover", function () {
            if (!NS_VERBALE_CONTROLLI.isReadOnly() && NS_VERBALE_CONTROLLI.isCartella()) {
                $(this).tooltipster({
                    content: "Premi il tasto destro per inserire le frasi standard",
                    delay: 100
                })
            }
        });


    },

    setRegistraEvent: function(){

        $(".butLoading").removeClass("butLoading");

        $(".butSalvaBozza").off("click").one("click", function () {

            NS_VERBALE.Firma = false;
            NS_VERBALE_EVENTI.resetOneClick($(this),1500);

            home.NS_LOADING.showLoading({"timeout": "2","testo":"SALVATAGGIO BOZZA VERBALE","loadingclick":function(){}});

            NS_VERBALE_CONTROLLI.checkSvuotaCampi();
            NS_VERBALE._registra_bozza();
        });

        $(".butSalvaVerbale").off("click").one("click", function () {
            NS_VERBALE_EVENTI.callSalvataggio(false, $(this));
        });

        $(".butFirma").off("click").one("click", function () {
            NS_VERBALE_EVENTI.callSalvataggio(true, $(this));
        });

    },

    resetOneClick : function(button,delay){

        button.addClass("butLoading");

        setTimeout("NS_VERBALE_EVENTI.setRegistraEvent();", delay);
    },

    callSalvataggio : function(firma, button) {
        NS_VERBALE.Firma = firma;

        NS_VERBALE_EVENTI.resetOneClick(button,3000);

        NS_VERBALE_CONTROLLI.checkSvuotaCampi();

        if(NS_VERBALE_CONTROLLI.isRicoverato()) {

            NS_VERBALE_CONTROLLI.controlloDatiRicovero(function() {
                    NS_VERBALE_EVENTI.preSalvataggio(button);
                }
            );

        } else {
            NS_VERBALE_EVENTI.preSalvataggio(button)
        }
    },

    preSalvataggio : function(button){

        if (NS_VERBALE_CONTROLLI.checkBeforeSave() && NS_FENIX_SCHEDA.validateFields()) {

            home.NS_LOADING.showLoading({"timeout": "5", "testo": "SALVATAGGIO VERBALE", "loadingclick": function () {}});

            NS_VERBALE_CONTROLLI.checkEsenzioni({
                "iden_anag": NS_VERBALE.iden_anag,
                "giorni_prognosi": Number($("#txtDayPrognosi").val()),
                "cod_esenzione": "L04",
                "motivo": $("#hMotivoIngresso").val(),
                "callback": function () {
                    NS_VERBALE_EVENTI.calcolaEquitalia(function () {
                        NS_VERBALE._registra(button);
                    })
                }
            });
        }
    },

    formEvent : function(){
        $("form").on("click", function () {
            if (NS_VERBALE_CONTROLLI.isCartella()) {
                home.PANEL.NS_REFERTO.SALVA_SCHEDA = "R";
            }
        });
    },

    setReadOnly: function () {
        $("input, textarea").attr("readonly", "readonly");
        $("select").attr("disabled", "disabled");
        $("div.RadioBox").off("click").attr("disabled", "disabled");
        $("td.tdRadio").off("click").attr("disabled", "disabled");
        $(".RBpuls, .CBpuls, button,  span").off("click");
        $(".tdLbl").removeClass("clickToOggi").off().unbind().removeAttr("id");
        $(".tdData").find("script").remove();
        $("button.butSalvaVerbale, button.butFirma, button.butSalvaBozza").hide();
        $("div.contentTabs").css({"background": "#CACACC"});
    },
    /**
     * Disabilita i Date e i relativi plug-in
     */
    disableDate : function () {
        var tdData = $("td.tdData");
        tdData.find("input[type=text]").attr("readonly", "readonly");
        tdData.find(".Zebra_DatePicker_Icon ").hide();
    },
    /**
     * Svuota gli input della scheda per ogni esito tranne quello scelto
     * @param esitoAttuale
     */
    svuotaCampiVerbale: function (esitoAttuale) {
        var divDaPulire;
        switch (esitoAttuale) {
            case "2":
                divDaPulire = $("#divDecesso,#divTrasferimento");
                break;

            case "3":
                divDaPulire = $("#divDecesso,#divRicovero");
                break;

            case "7":
            case "8":
                divDaPulire = $("#divTrasferimento,#divRicovero");
                break;

            default:
                divDaPulire = $("#divDecesso,#divTrasferimento,#divRicovero");
                break;
        }

        $(':input', divDaPulire).each(function () {
            var type = this.type;
            var tag = this.tagName.toLowerCase();
            if (type == 'text' || type == 'hidden' || tag == 'textarea') {this.value = "";}
            else if (type == 'checkbox' || type == 'radio') {this.checked = false;}
            else if (tag == 'select') {this.selectedIndex = -1;}
        });
        divDaPulire.find("div.RBpuls").removeClass("RBpulsSel");
    },

    calcolaEquitalia: function (callback) {
        var db = $.NS_DB.getTool({setup_default: {datasource: 'PS', async: false}});

        var xhr = db.select({
            id: "PS.Q_EQUITALIA",
            parameter: {
                "iden_contatto": $("#IDEN_CONTATTO").val(),
                "diagnosi1": $("#h-txtDiagnosiICD91").val(),
                "diagnosi2": $("#h-txtDiagnosiICD92").val(),
                "diagnosi3": $("#h-txtDiagnosiICD93").val(),
                "diagnosi4": $("#h-txtDiagnosiICD94").val(),
                "diagnosi5": $("#h-txtDiagnosiICD95").val()
            }
        });

        xhr.done(function (data) {

            NS_VERBALE.messEquitalia = data.result[0];
            logger.debug("calcolaEquitalia " + JSON.stringify(data.result));
            callback();

        });

        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("calcolaEquitalia " + JSON.stringify(jqXHR) + "\n" + JSON.stringify(errorThrown) +
            "\n" + JSON.stringify(textStatus));
        });
    },

    gestioneMantieniOBI: function (valore) {

        var dataRicoveroH = $("#h-txtDataRicovero"),
            dataRicovero = $("#txtDataRicovero"),
            oraRicovero = $("#txtOraRicovero");

        var dataRicOBI = (moment(NS_VERBALE.data_inizio_obi, "YYYYMMDDHH:mm")).format("YYYYMMDD"),
            oraRicOBI = (moment(NS_VERBALE.data_inizio_obi, "YYYYMMDDHH:mm")).format("HH:mm"),
            dataRicOBIISO = (moment(NS_VERBALE.data_inizio_obi, "YYYYMMDDHH:mm")).format("DD/MM/YYYY");

        if (valore === "S") {
            oraRicovero.val(moment().format("HH:mm"));
            dataRicoveroH.val(moment().format("YYYYMMDD"));
            dataRicovero.val(moment().format("DD/MM/YYYY"));
        }
        else if (valore === "N") {
            oraRicovero.val(oraRicOBI);
            dataRicoveroH.val(dataRicOBI);
            dataRicovero.val(dataRicOBIISO);
        }
    },
    /**
     * se e' un trauma giorni prognosi deve essere obbligatorio
     * se motivo di ingresso e' un morso di cane(15) giorni prognosi deve essere obbligatorio
     * solo negli esiti indicati e' obbligatorio
     */
    validateGiorniPrognosi: function () {
        var esito = $("#hEsito").val(),
            esitoObi = $("#h-radOBI").val(),
            giorniPrognosi = $("#txtDayPrognosi"),
            motivoIngresso = $("#hMotivoIngresso").val(),
            valoreRadio = $("#radPrognosi").find("input[type=hidden]").val();

        NS_VERBALE.validator.removeStatus(giorniPrognosi);

        if ((NS_VERBALE_CONTROLLI.isTrauma() || motivoIngresso == "15") && (esito == "A" || esito == "1" || esito == "2" || esito == "3" )) {
            NS_VERBALE.validator._attachStatus(giorniPrognosi, {"status": "required"});
        }
        if ((NS_VERBALE_CONTROLLI.isTrauma() || motivoIngresso == "15") && (esito == "6") && (esitoObi == "A" || esitoObi == "1" || esitoObi == "2" || esitoObi == "3")) {
            NS_VERBALE.validator._attachStatus(giorniPrognosi, {"status": "required"});
        }
        if (valoreRadio === "1") {
            NS_VERBALE.validator.removeStatus(giorniPrognosi);
        }
    },
    /**
     * Valorizza il campo Diagnosi1
     */
    valorizeDiagnosi: function (jsonDiagnosi) {
        $("#txtDiagnosiICD91").val(jsonDiagnosi.DESCRIZIONE)
            .attr("data-c-descr", jsonDiagnosi.DESCRIZIONE)
            .attr("data-c-value", jsonDiagnosi.CODICE)
            .attr("data-c-cod_dec", jsonDiagnosi.COD_DEC)
            .attr("data-c-codice", jsonDiagnosi.CODICE);
        $("#h-txtDiagnosiICD91").val(jsonDiagnosi.CODICE);
    },
    /**
     * carica di default l'utente attuale medico
     */
    valorizeMedicoRef: function () {
        $("#txtMedicoRef").val(home.baseUser.DESCRIZIONE)
            .attr("data-c-descr", home.baseUser.DESCRIZIONE)
            .attr("data-c-value", home.baseUser.IDEN_PER);
        $("#h-txtMedicoRef").val(home.baseUser.IDEN_PER);
    },
    /**
     * Funzione che valorizza in automatico il l'autocomplete del reparto assistenziale,
     * viene chiamata da RepartiGiuridiciRicovero.xml
     * @param data
     */
    valorizeRepartiRicovero: function (data) {

        var repRicovero = $("#txtrepRicovero"),
            repAssistenza = $("#txtrepAssistenza");

        repAssistenza.val(repRicovero.val())
            .attr("data-c-codice_decodifica", data.CODICE_DECODIFICA)
            .attr("data-c-descr", data.DESCR)
            .attr("data-c-value", data.VALUE);
        $("#h-txtrepAssistenza").val(data.VALUE);

        /* se obi e ricovero e il reparto e' di urgenza */
        NS_VERBALE.showHideMantieniOBI();
    },
    /**
     * valorizza l'autocomplete CategoriaCausaEsterna.xml a seconda del traumatismo scelto
     */
    valorizeCausaEsterna: function () {
        var codCategoria = $("#txtCategoriaCausaEsterna").attr("data-c-value");
        var db = $.NS_DB.getTool();
        var dbParams = {"codCategoria": {v: codCategoria, t: "V"}};
        var xhr = db.select({
            datasource: "PS",
            id: "PS.Q_CAUSA_ESTERNA",
            parameter: dbParams
        });
        xhr.done(function (response) {
            if (response) {
                var cmbCausaEsterna = $("#cmbCausaEsterna");
                cmbCausaEsterna.empty();
                cmbCausaEsterna.append("<option value='' id='" + cmbCausaEsterna.attr("id") + "_" + "' ></option>");
                $.each(response.result, function (i, v) {
                    cmbCausaEsterna.append("<option id='" + cmbCausaEsterna.attr("id") + "_" + i + "' data-value='" + v.VALUE +
                    "' value='" + v.VALUE + "' data-descr='" + v.DESCR + "'>" + v.DESCR + "</option>");
                });
            } else {
                logger.error("NS_VERBALE_EVENTI.valorizeCausaEsterna no response");
            }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("NS_VERBALE_EVENTI.valorizeCausaEsterna \n" + JSON.stringify(jqXHR) +
            "\n" + JSON.stringify(textStatus) + "\n" + JSON.stringify(errorThrown));
        });
    },
    /**
     * valorizeOnere : valorizza dinamicamente il combo a seconda della categoria causa esterna
     */
    valorizeOnere: function () {
        var comboOnere = $("#cmbOnere");

        if (NS_VERBALE_CONTROLLI.hasAValue(NS_VERBALE.onereIngresso) && NS_VERBALE_CONTROLLI.isContattoAdmitted()) {
            comboOnere.find("option[value=" + NS_VERBALE.onereIngresso + "]").attr("selected", true);
        }
        else if (!NS_VERBALE_CONTROLLI.hasAValue(comboOnere.val())){
            comboOnere.find("option[value=1]").attr("selected", true);
        }

        if (NS_VERBALE_CONTROLLI.hasAValue(NS_VERBALE.subOnereIngresso)) {
            $("#cmbSubOnere").find("option[value=" + NS_VERBALE.subOnereIngresso + "]").attr("selected", true);
        }
    }
};