/**
 * carlog
 */
$(function () {
    NS_INS_DIARI.detectStatoPagina();
    NS_INS_DIARI.detectBaseUser();
    NS_INS_DIARI.init();
    NS_INS_DIARI.event();
});

var NS_INS_DIARI = {

    tipoWk: parent.$("#WK_APERTURA").val(),
    tipoPersonale: home.baseUser.TIPO_PERSONALE,


    detectStatoPagina: function () {
        var STATO_PAGINA = $("#STATO_PAGINA").val();

        if (STATO_PAGINA == 'I') {
            $("#txtOraIns").val(moment().format("HH:mm"));

            NS_FENIX_SCHEDA.afterSave = function () {
                if(LIB.isValid(home) && LIB.isValid(home.NS_LOADING) &&  LIB.isValid(home.NS_LOADING.showLoading)) {
                    home.NS_LOADING.showLoading({"timeout":"0","testo" : "SALVATAGGIO", "loadingclick" : function(){home.NS_LOADING.hideLoading();}});
                }

                try {
                    if($('#TIPO_PERSONALE').val() == 'M') {
                        home.PANEL.NS_REFERTO.apriDiari(function () {
                            home.NS_LOADING.hideLoading();
                        });
                    }
                    else{
                        home.PANEL.NS_REFERTO.apriDiariInf(function () {
                            home.NS_LOADING.hideLoading();
                        });
                    }
                }catch(e){
                     logger.error(JSON.stringify(e));
                    home.NS_LOADING.hideLoading();
                }



            };
        } else if (STATO_PAGINA == 'E') {
            NS_FENIX_SCHEDA.registra = NS_INS_DIARI.modificaDiari;
            $("div.headerTabs").html("<h2 style='color: rgb(255, 255, 0);' id='lblAlertModifica'>MODIFICA</h2>");
        } else {
            logger.error("NS_INS_DIARI stato pagina non definito : " + STATO_PAGINA);
        }
    },

    detectBaseUser: function () {
        var butSalva = $("button.butSalva");
        var TipoPersonale = $("#TIPO_PERSONALE").val();//home.baseUser.TIPO_PERSONALE;

        switch (TipoPersonale) {
            case 'OST':
            case 'A':
            case 'I':
                if($('#KEY_LEGAME').val() !== 'INS_DIARI_INF' || NS_INS_DIARI.tipoWk == 'LISTA_CHIUSI') {
                    butSalva.hide();
                }
                break;
            case 'M':
                butSalva.show();
                $("#rowDiario").on("click", function () {

                    if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                        if(!(NS_INS_DIARI.tipoWk == 'LISTA_APERTI' && NS_INS_DIARI.tipoPersonale == 'M' && $('#hUteRiferimento').val() != home.baseUser.IDEN_PER)) {
                            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";
                        }
                    }
                });
                break;
            default:
                logger.error("baseuser non valorizzato correttamente : " + TipoPersonale);
                break;
        }
    },

    init: function () {
        if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }
        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params; };
        NS_FENIX_SCHEDA.successSave = NS_INS_DIARI.successSave;
        NS_FENIX_SCHEDA.beforeSave = NS_INS_DIARI.beforeSave;
        NS_INS_DIARI.calcolaDimensione();

        $("#hIdenContatto").val($("#IDEN_CONTATTO").val());
        $("#hUteIns").val($("#IDEN_PER").val());
        //$("#taNoteDiari").autosize();

        if( top.name == 'schedaRicovero'){
            var contentTabs = parseInt($("div.contentTabs").height());
            $(".contentTabs").css({height: contentTabs -100}); //contentTabs -100
        }

        NS_INS_DIARI.salvaHide($('#hUteRiferimento').val(),NS_INS_DIARI.tipoWk,NS_INS_DIARI.tipoPersonale);

    },

    event: function () {
        $("#txtOraIns").on("change",function(){

           /* if (e.relatedTarget.className != 'Zebra_DatePicker_Icon Zebra_DatePicker_Icon_Inside')
            {   */
                var data = $("#h-txtDataIns").val();

                var dataAttuale = moment().format('YYYYMMDD') + moment().format('HHmm');

                if ($(this).val().length < 5 && $(this).val().length !== 0){
                        if($(this).val().length == 2){
                        var value = $(this).val();
                        $(this).val(value + ':00');

                    }
                    else{
                        NS_INS_DIARI.alertMessage($(this), 'Ora inserimento non corretta');
                        $('.butSalva').hide();
                    }
                }

                //se la data è registrata e l'ora è registrata nei dati amministrativi e la data è valorizzata
                if(jsonData.data_ingresso!= '' && jsonData.ora_ingresso!= '' && data != ''){
                    var oraIngressonumber = jsonData.ora_ingresso.replace(':','');


                    if(oraIngressonumber.length == '3'){
                        oraIngressonumber = '0'+oraIngressonumber;
                    }
                    var oranumber = $("#txtOraIns").val().replace(':','');



                    if((jsonData.data_ingresso+oraIngressonumber) > (data+oranumber)){
                        NS_INS_DIARI.alertMessage($(this), 'Ora inserimento precedente l\'ora di accesso');
                        $('.butSalva').hide();
                    }
                    else if((Number(dataAttuale) < Number(data+oranumber))){
                        NS_INS_DIARI.alertMessage($(this), 'Ora inserimento successiva l\'ora attuale');
                        $('.butSalva').hide();
                    }
                    else{
                        $(this).removeClass("tdError");
                        $("#txtDataIns").removeClass("tdError");
                        $('.butSalva').show();
                    }
                }
//            }

        });
        $("#txtDataIns").on("change",function(){

            var data = $("#h-txtDataIns").val();
            var ora = $("#txtOraIns").val().replace(':','');
            var oraIngressonumber = jsonData.ora_ingresso.replace(':','');
            if(oraIngressonumber.length == '3'){
                oraIngressonumber = '0'+oraIngressonumber;
            }


             if(ora != '' && jsonData.data_ingresso != '' &&  data != '' && (data+ora)  < (jsonData.data_ingresso +oraIngressonumber)){
                NS_INS_DIARI.alertMessage($(this), 'Data inserimento precedente la data di accesso');
                $('.butSalva').hide();
            }else if (jsonData.data_ingresso != '' &&  data != '' && data < jsonData.data_ingresso) {
                NS_INS_DIARI.alertMessage($(this), 'Data inserimento precedente la data di accesso');
                $('.butSalva').hide();
            }
            else if (ora != '' && jsonData.data_ingresso != '' &&  data != '' && (data+ora)  > (moment().format('YYYYMMDDHHmm'))) {
                    NS_INS_DIARI.alertMessage($(this), 'Data inserimento successiva la data di accesso');
                    $('.butSalva').hide();
            }else{
                $(this).removeClass("tdError");
                $("#txtOraIns").removeClass("tdError");
                $('.butSalva').show();
            }
        });

    },


    modificaDiari: function () {

        if(NS_INS_DIARI.beforeSave() == true){
            if(LIB.isValid(home) && LIB.isValid(home.NS_LOADING)&& LIB.isValid(home.NS_LOADING.showLoading)&& LIB.isValid(home.NS_LOADING.hideLoading)) {

                home.NS_LOADING.showLoading({"timeout": "0", "testo": "SALVATAGGIO", "loadingclick": function () {
                    home.NS_LOADING.hideLoading();
                }});
            }
            var db = $.NS_DB.getTool();

            var dbParams = {
                "pIdenDiario" : { v: Number($("#IDEN_DIARIO").val()), t: "N" },
                "pIdenContatto" : { v: Number($("#IDEN_CONTATTO").val()), t: "N" },
                "pUteMod" : { v: Number($("#IDEN_PER").val()), t: "N" },
                "pNote" : { v: $("#taNoteDiari").val(), t: "V" },
                "pGiornoMod" : { v: $("#txtDataIns").val(), t: "V" },
                "pOraMod" : { v: $("#txtOraIns").val(), t: "V" }     //
            };
            var xhr = db.call_function({
                datasource: "PS",
                id: "PS_SALVATAGGI.FNC_MODIFICA_DIARI",
                parameter: dbParams
            });

            xhr.done(function (response) {
                if(response){
                    if(LIB.isValid(home) && LIB.isValid(home.NOTIFICA)){
                        home.NOTIFICA.success({message: "Modifica Avvenuta", timeout: 3, title: 'Success'});
                    }
                    if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
                    }
                    try{
                        if(home.baseUser.TIPO_PERSONALE == 'M') {
                            home.PANEL.NS_REFERTO.apriDiari(function () {
                                home.NS_LOADING.hideLoading();
                            });
                        }
                        else if(home.baseUser.TIPO_PERSONALE == 'I') {
                            home.PANEL.NS_REFERTO.apriDiariInf(function () {
                                home.NS_LOADING.hideLoading();
                            });
                        }

                    }catch(e){
                        NS_INS_DIARI.apriDiarioSchedaRicovero();
                        home.NS_LOADING.hideLoading();
                        logger.error(JSON.stringify(e));
                    }
                }
            });
            xhr.fail(function (jqXHR, textStatus, errorThrown) {
                logger.error(JSON.stringify(dbParams));
                if(LIB.isValid(home) && LIB.isValid(home.NOTIFICA)){
                    home.NOTIFICA.error({message: "Attenzione errore nella modifica \n" + errorThrown, title: "Error"});

                }
                logger.error(JSON.stringify(jqXHR)+"\n"+JSON.stringify(textStatus)+"\n"+JSON.stringify(errorThrown)+"\n");
            });
        }else{
            return false;
        }

    },

    calcolaDimensione: function () {
        var contentTabs = parseInt($("div.contentTabs").height());
        var dimensione = contentTabs / 2;
        $("#taNoteDiari").height(dimensione);
    },

    successSave: function () {
        if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }
        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");
        NS_INS_DIARI.apriDiarioSchedaRicovero();
    },
    apriDiarioSchedaRicovero:function(){
        if( top.name == 'schedaRicovero') {
            try {

                var url = "http://localhost:8081/Fenix/Autologin?";
                url += 'username=carlops' + // home.baseUser.USERNAME +
                    '&scheda=DIARI' +
                    '%26IDEN_ANAG=' + $("#IDEN_ANAG").val() +
                    '%26IDEN_CONTATTO=' + $("#IDEN_CONTATTO").val() +
                    '%26nomeHost=' + home.AppStampa.GetCanonicalHostname().toUpperCase() +
                    '%26NO_APPLET=N' +
                    '%26IDEN_PROVENIENZA=' + $("#IDEN_PROVENIENZA").val() +
                    '%26IDEN_PER=' + $("#USER_IDEN_PER").val() +
                    '%26USERNAME=' + $("#USERNAME").val() +
                    '%26TIPO_PERSONALE=' + home.baseUser.TIPO_PERSONALE +
                    '%26SCHEDA=DIARI';

                document.location.replace(url);

            } catch (e) {
                logger.error(e);
            }
        }
    },

    salvaHide: function(uteRif, tipoWk, tipoPersonale){
        var butSalva = $("button.butSalva");

        if(tipoWk == 'LISTA_APERTI' && tipoPersonale == 'M' && uteRif != home.baseUser.IDEN_PER){
            butSalva.hide();
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }
    },
    alertMessage: function (t, message) {
        $.dialog(message,
            {title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {

                        t.addClass("tdError");
                        t.focus();
                        $.dialog.hide();
                    }}
                ]
            }
        );
    },
    beforeSave : function () {

        var controllo = /\S/.test($("#taNoteDiari").val());

        if($(".tdError").length != 0 ){
            home.NOTIFICA.error({message: "Attenzione  ci sono dei campi Errati", title: "Errore"});
            return false;
        }
        else if(!controllo) {
            home.NOTIFICA.error({message: "Il campo Note non puo essere vuoto", title: "Error"});
            if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
            }
            return false;
        }
        else {
            return true;
        }

    }
};