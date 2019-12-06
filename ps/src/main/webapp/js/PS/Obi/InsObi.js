/**
 * Created by matteo.pipitone on 02/07/2015.
 */

jQuery(document).ready(function () {
    NS_INS_OBI.init();
    NS_INS_OBI.setEvents();

});

var NS_INS_OBI = {

    init: function () {
        NS_FENIX_SCHEDA.registra = NS_INS_OBI.registra;
        NS_FENIX_SCHEDA.addFieldsValidator({config: "V_INS_OBI"});
        NS_INS_OBI.setCalendar();
    },

    setEvents: function () {

        NS_INS_OBI.setRegistraEvent();

        $(".contentTabs").css({"height": "300px"});
        // $("#cmbAree").on("change", function(){
        NS_INS_OBI.valorizeUbicazione();
        // });
        $("#txtOraInsOBI").val(moment().format('HH:mm'));

        $(".butChiudi").off("click").on("click", NS_INS_OBI.chiudi);

        $('#txtDataInsObi').on("blur change", function () {
            var _this = $(this);
            NS_INS_OBI.controlloData(_this);
        });

        $('td.oracontrol input')
            .css({"width": "60px !important"})
            .live()
            .setMask("29:59")
            .on("blur", function () {
                var _this = $(this);
                NS_INS_OBI.controlloOra(_this);
            })
            .keypress(function () {
                var currentMask = $(this).data('mask').mask;
                var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
                if (newMask != currentMask) {
                    $(this).setMask(newMask);
                }
            });
    },

    setRegistraEvent : function(){

        $(".butLoading").removeClass("butLoading");

        $(".butSalva").off("click").one("click", function(){

            $(this).addClass("butLoading");

            setTimeout("NS_INS_OBI.setRegistraEvent();", 3000);

            NS_INS_OBI.controlValutazione(
                function(){
                    NS_INS_OBI.registra();
                }
            );
        });

    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== typeof value) && ("null" !== value) && ("undefined" !== value));
    },

    controlValutazione : function(callback){

        var jsonQuery = {
            datasource: "PS",
            id: "PS.Q_CHECK_ESAME_OBIETTIVO",
            params: {iden_contatto: {t: "N", v: Number($("#IDEN_CONTATTO").val())}},

            callbackOK: function (resp) {

                var conto = Number(resp.result[0].CONTO);

                if(conto > 0){
                    callback(resp);
                } else {
                    $.dialog("E' necessario scrivere una valutazione medica prima di inserire l'OBI",
                        {title: "Attenzione",
                            buttons: [{label:"OK", action: function (){$.dialog.hide();}}]
                        }
                    );
                }
            }
        };


        NS_CALL_DB.SELECT(jsonQuery);

    },

    controlloData: function (_this) {
        var dataAperturaCartella = $("#DATA_INIZIO").val();//segmento_ultimo_assistenziaLE.data_inizio
        var adesso = moment().format("YYYYMMDDHHmm");
        var dataDigit = _this.parent().find("input[type='hidden']").val();

        var diffMax = moment(adesso, "YYYYMMDD").diff(moment(dataAperturaCartella, "YYYYMMDD"));
        diffMax = moment.duration(diffMax);

        if (!NS_INS_OBI.hasAValue(dataDigit)) {
            NS_INS_OBI.alertDdataOra(_this, "Data");
        } else {
            var diffAttuale = moment(dataDigit, "YYYYMMDD").diff(moment(dataAperturaCartella, "YYYYMMDD"));
            diffAttuale = moment.duration(diffAttuale);

            if (diffAttuale >= 0 && diffAttuale <= diffMax) {
                _this.removeClass("tdError");
                _this.addClass("tdObb");
                NS_INS_OBI.controlloOra($('td.oracontrol input'));
            } else {
                NS_INS_OBI.alertDdataOra(_this, "Data");

            }
        }
    },

    controlloOra: function (_this) {
        if (_this.val().length < 5 && _this.val().length !== 0) {
            if (_this.val().length == 2) {
                var value = _this.val();
                _this.val(value + ':00');
            }
            else {
                NS_INS_OBI.alertDdataOra(_this, 'Ora inserimento non corretta');
                $('.butSalva').hide();
            }
        }

        var dataDigit = $('#h-txtDataInsObi').val();

        if (!NS_INS_OBI.hasAValue(dataDigit)) {
            _this.parent().prev().find("input[type=hidden]").focus()
        }

        var oraDigit = _this.val();

        var ora = oraDigit.split(":");
        oraDigit = ora[0] + ora[1];
        var giornoDigit = dataDigit + oraDigit;

        var dataAperturaCartella = $("#DATA_INIZIO").val();
        var adesso = moment().format("YYYYMMDDHHmm");

        var diffMax = moment(adesso, "YYYYMMDDHHmm").diff(moment(dataAperturaCartella, "YYYYMMDDHHmm"));
        diffMax = moment.duration(diffMax);

        var diffAttuale = moment(giornoDigit, "YYYYMMDDHHmm").diff(moment(dataAperturaCartella, "YYYYMMDDHHmm"));
        diffAttuale = moment.duration(diffAttuale);

        if (_this.val().length !== 5 || diffAttuale < 0 || diffAttuale > diffMax) {
            NS_INS_OBI.alertDdataOra(_this, "Ora");
        } else {
            _this.removeClass("tdError");
            _this.addClass("tdObb");
        }

    },

    alertDdataOra: function (_this, messaggio) {
        $.dialog(messaggio + " inserita non corretta",
            {title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {
                        _this.val("");
                        _this.removeClass("tdObb");
                        _this.addClass("tdError");
                        $.dialog.hide();
                    }}
                ]
            });
    },

    registra: function () {
        var codiceIcd9 = $("#h-txtDiagnosiICD9OBI").val(),
            note = $("#taDiagnosiTestOBI").val(),
            cmbUbicazione = $("#cmbUbicazione");

        var iden_ubicazione = cmbUbicazione.find("option:selected").data("iden_ubi");
        var iden_provenienza = cmbUbicazione.find("option:selected").data("iden_prov");
        //var area_ps =  cmbUbicazione.find("option:selected").data("iden_area");

        if (!NS_FENIX_SCHEDA.validateFields()) {
            return false;
        }

        if (!NS_INS_OBI.hasAValue(codiceIcd9)) {
            home.NOTIFICA.error({message: "Attenzione, si prega di ricompilare il campo diagnosi", title: "Error", timeout: 5});
            return false;
        }

        logger.debug("IDEN_PROVENIENZA = " + iden_provenienza + " IDEN_UBICAZIONE = " + iden_ubicazione);

        var dataInsA = moment().format('YYYYMMDDHH:mm'),
            dataInsB = moment().format("YYYYMMDD HH:mm:ss"),
            dataDigit = $('#h-txtDataInsObi').val(),
            oraDigit = $('#txtOraInsOBI').val(),
            dataOraDigit;

        dataOraDigit = dataDigit + oraDigit;

        OBI.Inserisci(
            {
                IDEN_UBICAZIONE: iden_ubicazione,
                IDEN_PROVENIENZA: iden_provenienza,
                IDEN_CONTATTO: $("#IDEN_CONTATTO").val(),
                CODICE_ICD9: codiceIcd9,
                DATA_INS: dataInsA,
                DATA_INIZIO: dataOraDigit,
                //AREA_PS: area_ps,
                NOTE: note,
                callback: function () {
                    //bisogna inserire le note nei diari ma solo se valorizzato.
                    if (!NS_INS_OBI.hasAValue(note)) {
                        NS_INS_OBI.chiudi();
                        return;
                    }

                    var parameters = {
                        "pIdenContatto": {t: "N", v: Number($("#IDEN_CONTATTO").val()) },
                        "pTesto": {v: note, t: 'V'},
                        "pDataIns": {v: dataInsB, t: 'T'},
                        "pTipoPer": {v: home.baseUser.TIPO_PERSONALE, t: 'V'},
                        "pUteIns": {v: Number(home.baseUser.IDEN_PER), t: 'N'},
                        "pIdenDiarioWhale": {v: null, t: 'N'},
                        "pOut": {t: "V", d: "O"},
                        "pOutMessaggio": {t: "V", d: "O"}
                    };

                    var parametri = {
                        "datasource": "PS",
                        id: "PS_DIARI.insertDiari",
                        "params": parameters,
                        "callbackOK": callbackOk
                    };

                    NS_CALL_DB.PROCEDURE(parametri);

                    function callbackOk() {
                        logger.info('Procedura salva diario obi eseguita');
                    }

                    NS_INS_OBI.chiudi();
                }
            }
        );

    },

    chiudi: function () {
        var paramSbloccaCartella = {
            idenContatto: $("#IDEN_CONTATTO").val(),
            usernameLocked: home.baseUser.USERNAME,
            callbackOK: function () {
                home.NS_WK_PS.refresh_wk = true;
                var n_scheda = $("#N_SCHEDA").val();
                home.NS_WK_PS.caricaWk();
                home.NS_FENIX_TOP.chiudiScheda({"n_scheda": n_scheda});

            }
        };
        NS_UNLOCK.sbloccaCartella(paramSbloccaCartella);
    },

    setCalendar: function () {
        var data_ingresso = $("#DATA_INGRESSO").val(),
            dataIns = $("#txtDataInsObi");

        if (data_ingresso == moment().format('DD/MM/YYYY')) {
            dataIns.Zebra_DatePicker({
                format: 'd/m/Y',
                direction: [true , 0],
                startWithToday: false,
                start_date: moment().format('DD/MM/YYYY')
            });

        }
        else {
            dataIns.Zebra_DatePicker({
                format: 'd/m/Y',
                direction: [data_ingresso , moment().format('DD/MM/YYYY')],
                startWithToday: true,
                start_date: moment().format('DD/MM/YYYY'),
                onSelect: function (data, dataIso) {
                    $("#h-txtDataOBI").val(dataIso);
                }
            });
        }
    },
    valorizeUbicazione: function () {
        var iden = home.baseUserLocation.iden;//744; //$("#cmbAree").find("option:selected").data("iden_cdc");
        var db = $.NS_DB.getTool();
        //var dbParams = {"iden_cdc": {v: id, t: "N"}};

        var xhr = db.select({
            datasource: "PS",
            id: "PS.Q_AREE_INS_OBI",
            parameter: ""
        });

        xhr.done(function (response) {

            /** Svuoto il combo Ubicazione**/
            var ubicazione = $("#cmbUbicazione");
            ubicazione.find("option").remove();

            /** Recupero il Json e per ogni area presente al suo interno creo un option da mettere nel combo **/
            var data = JSON.parse(response.result[0].VALORE);
            var key, count = 0;
            for (key in data[iden]) {
                if (data[iden].hasOwnProperty(key)) {
                    count++;
                    var opt = document.createElement('option');
                    opt.value = data[iden][count - 1].COD_CDC;
                    //opt.setAttribute('data-cod_cdc', data[iden][count - 1].COD_CDC);
                    opt.setAttribute('data-iden_ubi', data[iden][count - 1].IDEN_UBI);
                    opt.setAttribute('data-iden_prov', home.baseUserLocation.iden_provenienza);
                    //opt.setAttribute('data-iden_area', data[iden][count - 1].IDEN_AREA);
                    var isFirefox = typeof InstallTrigger !== 'undefined';
                    if (isFirefox) {
                        opt.textContent = data[iden][count - 1].AREA;
                    }
                    else {
                        opt.innerText = data[iden][count - 1].AREA;
                    }
                    document.getElementById('cmbUbicazione').appendChild(opt);
                }
            }
        });


        /* var xhr = db.select({
         datasource: "PS",
         id        : "PS.Q_UBICAZIONE",
         parameter : dbParams
         });

         xhr.done(function (response) {
         var ubicazione = $("#cmbUbicazione");

         ubicazione.find("option").remove();

         var option = document.createElement("option");
         document.getElementById('cmbUbicazione').appendChild(option);

         for(var i = 0; i < response.result.length; i++) {
         var opt = document.createElement('option');
         opt.setAttribute('data-descr', response.result[i].DESCR);
         opt.setAttribute('data-value', response.result[i].VALUE);
         opt.setAttribute('data-codice_decodifica', response.result[i].CODICE_DECODIFICA);
         opt.value = response.result[i].VALUE;
         opt.setAttribute('id', 'cmbUbicazione_' + response.result[i].VALUE);
         var isFirefox = typeof InstallTrigger !== 'undefined';
         if(isFirefox) {
         opt.textContent = response.result[i].DESCR;
         }
         else {
         opt.innerText = response.result[i].DESCR;
         }

         document.getElementById('cmbUbicazione').appendChild(opt);


         }


         });*/
    }
};