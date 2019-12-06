/**
 * Created by alberto.mina on 15/04/2015.
 */

$(document).ready(function(){
    CATENA_CUSTODIA.init();
    CATENA_CUSTODIA.setEvents();

});


var CATENA_CUSTODIA = {

    data : null,
    ora : null,
    firma : false,
    idenSchedaCatena : null,
    attributoCheck  : null,

    init: function(){



        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true;return params;};
        NS_FENIX_SCHEDA.successSave = CATENA_CUSTODIA.successSave;
        NS_FENIX_SCHEDA.beforeSave = CATENA_CUSTODIA.beforeSave;

        //V_CATENA_CUSTODIA.elements["txtDataPrelievo"].status = null;
        //V_CATENA_CUSTODIA.elements["txtOraPrelievo"].status = null;
        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_CATENA_CUSTODIA"});

        CATENA_CUSTODIA.checkStatoFirma($("#hStatoScheda").val());

        CATENA_CUSTODIA.getDataOraPrelievo($("#IDEN_RICHIESTA").val());
        //CATENA_CUSTODIA.nascondiDataOra();
        $('#txtFarmaciNotizie').width('500');

        $("#txtDataPrelievo, #txtOraPrelievo").attr("disabled","disabled");
        $("#txtDataPrelievo").next("button").remove()

        $('.CheckBox').children().css('text-align','left');

        //$('.clickToOggi').trigger('click');

        $('#chkConsenso_CONSENSO_SI').trigger('click');

        if( $('#STATO_PAGINA').val() == 'E'){
            CATENA_CUSTODIA.checkStatoUtente();
        }

        CATENA_CUSTODIA.attributoCheck = $('.tdCheck').find('div.CBpulsSel').attr('data-value');
        var elem = $('.tdCheck').find('div.CBpulsSel');
        CATENA_CUSTODIA.checkSelection(elem);
    },

    getDataOraPrelievo: function(idenRichiesta){
        var db = $.NS_DB.getTool();
        var dbParams = {
            "iden_richiesta": {v: Number(idenRichiesta), t: "N" }
        };

        var xhr = db.select({
            datasource: "WHALE",
            id: "OE.GET_DATA_ORA_PRELIEVO",
            parameter: dbParams
        });
        xhr.done(function (response) {
            if (response) {
                CATENA_CUSTODIA.data = response.result[0].DATA_PRELIEVO;
                CATENA_CUSTODIA.ora = response.result[0].ORA_PRELIEVO;

                $("#txtDataPrelievo").val(moment(CATENA_CUSTODIA.data,"YYYYMMDD").format("DD/MM/YYYY"));
                $("#h-txtDataPrelievo").val(CATENA_CUSTODIA.data);

                $("#txtOraPrelievo").val(CATENA_CUSTODIA.ora);

            } else {
                logger.error("ERRORE QUERY");
            }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("ERRORE CONNESSIONE");
        });
    },

    setEvents: function(){

        $('.CBpuls').on('click', function(){

            if($(this).attr('data-value') == 'CONSENSO_SI' && $(this).hasClass('CBpulsSel') ){

                CATENA_CUSTODIA.mostraDataOra();
            }
            else if(($(this).attr('data-value') == 'CONSENSO_SI' && ($(this).hasClass('CBpulsSel') == false) )){

                CATENA_CUSTODIA.nascondiDataOra();
            }
        });

        $(".butFirma").on("click", function () {
            CATENA_CUSTODIA.Firma = true;

            if(NS_FENIX_SCHEDA.validateFields() && CATENA_CUSTODIA.beforeSave())
            {

              //  home.NS_LOADING.showLoading({"timeout": "0", "testo": "FIRMA", "loadingclick": function () {home.NS_LOADING.hideLoading();}});
                NS_FENIX_SCHEDA.registra();
            }
        });

        //$('#txtDataPrelievo').on('change', function(){CATENA_CUSTODIA.checkData()});
        //$('#txtOraPrelievo').on('change', function(){CATENA_CUSTODIA.checkOra()});

        $('.tdCheck').find('div.CBpuls').on('click',function(){
            CATENA_CUSTODIA.attributoCheck = $(this).attr('data-value');
            CATENA_CUSTODIA.checkSelection($(this));
        });


    },


    checkStatoUtente: function(){

        var db = $.NS_DB.getTool();
        var dbParams = {
            "iden_contatto": {v: $('#IDEN_CONTATTO').val(), t: "N" }
        };

        var xhr = db.select({
            datasource: "PS",
            id: "PS.Q_UTENTE_CUSTODIA",
            parameter: dbParams
        });
        xhr.done(function (response) {
            if (response) {
                if(response.result[0].UTE_INS != home.baseUser.IDEN_PER){
                    $('input').attr('disabled','disabled');
                    $('#chkConsenso_CONSENSO_SI').removeClass('CBpulsSel');
                    $(".CBpuls,   span").off("click");
                    $('#txtOraPrelievo').closest('tr').hide();
                    $('#txtDataPrelievo').closest('tr').hide();
                    $('.butSalva').hide();
                    $("#lblTitolo").append("<span  style='color: rgb(255, 255, 0);position: relative;left: 70%;' id='lblAlertModifica'>COMPLETATO DA UN ALTRO UTENTE</span>");
                }

                if(response.result[0].STATO == 'F'){
                    $('.butSalva').remove();
                }
            } else {
                logger.error("ERRORE QUERY");
            }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("ERRORE CONNESSIONE");
        });


    },

    checkStatoFirma : function(stato){

        var daFirmare = $("#IS_DA_FIRMARE");

        daFirmare.val(stato == "F" ? "S" : "N");

        logger.debug("IS_DA_FIRMARE -> " + daFirmare.val());

        if(stato === "F"){
            $(".butSalva").hide();
        }
    },

    mostraDataOra: function(){
        $('#txtOraPrelievo').closest('tr').show();
        $('#txtDataPrelievo').closest('tr').show();
        V_CATENA_CUSTODIA.elements["txtDataPrelievo"].status = 'required';
        V_CATENA_CUSTODIA.elements["txtOraPrelievo"].status = 'required';
        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_CATENA_CUSTODIA"});
    },

    nascondiDataOra: function(){
        $('#txtOraPrelievo').closest('tr').hide();
        $('#txtDataPrelievo').closest('tr').hide();
        V_CATENA_CUSTODIA.elements["txtDataPrelievo"].status = null;
        V_CATENA_CUSTODIA.elements["txtOraPrelievo"].status = null;
        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_CATENA_CUSTODIA"});
    },

   /* checkData: function(){
      var dataRichiesta = Number(CATENA_CUSTODIA.data);
      var dataIngresso = Number(home.CARTELLA.NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.dataIngresso.substr(0,8));
      var campoData = $('#txtDataPrelievo');
      var data =  $('#h-txtDataPrelievo').val();


      if(campoData.val() !== '' && (data < dataIngresso || data > dataRichiesta ) ){
          CATENA_CUSTODIA.alertData(campoData);
          $('.butSalva').hide();
      }
      else{
          campoData.removeClass('tdError');
          campoData.addClass('tdObb');
          $('.butSalva').show();
          CATENA_CUSTODIA.checkOra();
      }




    },

    checkOra: function(){

        var campoOra = $('#txtOraPrelievo');
        var campoData = $('#txtDataPrelievo');
        var dataRichiesta = Number(CATENA_CUSTODIA.data);
        var oraRichiesta = Number(CATENA_CUSTODIA.ora.replace(':',''));
        var ora =  Number(campoOra.val().replace(':',''));
        var data =  Number($('#h-txtDataPrelievo').val());
        var dataIngresso = Number(home.CARTELLA.NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.dataIngresso.substr(0,8));
        var oraIngresso = Number(home.CARTELLA.NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.dataIngresso.substr(8,4));


        if(campoOra.val() !== '' && campoData.val() !== '' && data == dataRichiesta && ora > oraRichiesta ){
            CATENA_CUSTODIA.alertOra(campoOra);
            $('.butSalva').hide();
        }
        else if(campoOra.val() !== '' && campoData.val() !== '' && data == dataIngresso && ora < oraIngresso ){
            CATENA_CUSTODIA.alertOra(campoOra);
            $('.butSalva').hide();
        }

        else{
            campoOra.removeClass('tdError');
            campoOra.addClass('tdObb');
            $('.butSalva').show();


        }

    },

    alertData: function (t) {
        $.dialog("Data inserita non corretta",
            {title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {

                        t.val("");
                        if (t.hasClass('tdObb')) {
                            t.removeClass("tdObb");
                            t.addClass("tdError");
                        }


                        $.dialog.hide();
                    }}
                ]
            }
        );
    },

    alertOra: function (t) {
        $.dialog("Ora inserita non corretta",
            {title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {

                        t.val("");
                        if (t.hasClass('tdObb')) {
                            t.removeClass("tdObb");
                            t.addClass("tdError");
                        }


                        $.dialog.hide();
                    }}
                ]
            }
        );
    },
    */

    checkSelection: function(elem){
        var elemAttr = elem.attr('data-value');
        if(elemAttr !== 'DROGHE' && elemAttr !== 'ALCOLEMICO') {


            if (CATENA_CUSTODIA.attributoCheck == 'NON_IN_GRADO' && elem.hasClass('CBpulsSel')) {
                $('#chkConsenso_SALUTE').hide();

                if ($('#chkConsenso_CONSENSO_SI').hasClass('CBpulsSel')) {
                    $('#chkConsenso_CONSENSO_NO').hide();
                }
                else if ($('#chkConsenso_CONSENSO_NO').hasClass('CBpulsSel')) {
                    $('#chkConsenso_CONSENSO_SI').hide();
                }

            }
            else if (CATENA_CUSTODIA.attributoCheck == 'NON_IN_GRADO' && !(elem.hasClass('CBpulsSel'))) {
                $('#chkConsenso_SALUTE').show();

                if ($('#chkConsenso_CONSENSO_SI').hasClass('CBpulsSel')) {
                    $('#chkConsenso_CONSENSO_NO').show();
                }
                else if ($('#chkConsenso_CONSENSO_NO').hasClass('CBpulsSel')) {
                    $('#chkConsenso_CONSENSO_SI').show();
                }

            }
            else if (CATENA_CUSTODIA.attributoCheck !== 'NON_IN_GRADO' && !($('#chkConsenso_NON_IN_GRADO').hasClass('CBpulsSel')) && elem.hasClass('CBpulsSel')) {

                if (CATENA_CUSTODIA.attributoCheck == 'CONSENSO_SI' || CATENA_CUSTODIA.attributoCheck == 'CONSENSO_NO') {
                    $('.tdCheck').find('div.CBpuls').each(function () {
                        var elemAttr = $(this).attr('data-value');
                        if (elemAttr !== CATENA_CUSTODIA.attributoCheck && elemAttr !== 'ALCOLEMICO' && elemAttr !== 'DROGHE' && elemAttr !== 'NON_IN_GRADO') {
                            $(this).hide();
                        }

                    })

                }
                else {
                    $('.tdCheck').find('div.CBpuls').each(function () {
                        var elemAttr = $(this).attr('data-value');
                        if (elemAttr !== CATENA_CUSTODIA.attributoCheck && elemAttr !== 'ALCOLEMICO' && elemAttr !== 'DROGHE') {
                            $(this).hide();
                        }

                    })
                }
            }
            else if (CATENA_CUSTODIA.attributoCheck !== 'NON_IN_GRADO' && !($('#chkConsenso_NON_IN_GRADO').hasClass('CBpulsSel')) && !(elem.hasClass('CBpulsSel'))) {

                $('.tdCheck').find('div.CBpuls').each(function () {
                    var elemAttr = $(this).attr('data-value');
                    if (elemAttr !== CATENA_CUSTODIA.attributoCheck && elemAttr !== 'ALCOLEMICO' && elemAttr !== 'DROGHE') {
                        $(this).show();
                    }

                })
            }
            else if (CATENA_CUSTODIA.attributoCheck !== 'NON_IN_GRADO' && $('#chkConsenso_NON_IN_GRADO').hasClass('CBpulsSel')) {

                $('#chkConsenso_SALUTE').hide();

                if (CATENA_CUSTODIA.attributoCheck == 'CONSENSO_SI') {

                    if (elem.hasClass('CBpulsSel')) {
                        $('#chkConsenso_CONSENSO_NO').hide();
                        $('#chkConsenso_CONSENSO_SI').show();
                    }
                    else {
                        $('#chkConsenso_CONSENSO_NO').show();
                        $('#chkConsenso_CONSENSO_SI').show();
                    }

                }
                else if (CATENA_CUSTODIA.attributoCheck == 'CONSENSO_NO') {

                    if (elem.hasClass('CBpulsSel')) {
                        $('#chkConsenso_CONSENSO_NO').show();
                        $('#chkConsenso_CONSENSO_SI').hide();
                    }
                    else {
                        $('#chkConsenso_CONSENSO_NO').show();
                        $('#chkConsenso_CONSENSO_SI').show();
                    }
                }
            }


        }
    },

    beforeSave: function(){
        if($('#chkConsenso_NON_IN_GRADO').hasClass('CBpulsSel')){
            if ($('#chkConsenso_CONSENSO_SI').hasClass('CBpulsSel') || $('#chkConsenso_CONSENSO_NO').hasClass('CBpulsSel')){
                return true;
            }
            else{
                home.NOTIFICA.error({message: 'Selezionare Consenso o Non Consenso del paziente', title: 'Error!'});
                return false;
            }
        }
        else{
            return true;
        }



    },

    successSave: function(message){

        CATENA_CUSTODIA.idenSchedaCatena = message;

        home.CARTELLA.jsonData.H_STATO_PAGINA.CUSTODIA = 'E';





        if (CATENA_CUSTODIA.Firma == true)
        {
            NS_REGISTRAZIONE_FIRMA.firma();
        }
        else
        {
            setTimeout(function(){
                home.NS_STAMPE_PS.stampaCatenaCustodia($('#IDEN_CONTATTO').val(),"S");
            },1000);
        }

    }

};


var NS_REGISTRAZIONE_FIRMA =
{
    firma : function (p) {

        /*home.FIRMA = $.extend({},home.FIRMA, home.FIRME_PS["MODULI"]);
        home.FIRMA.okFirma = home.FIRME_PS.okFirma;*/
        home.FIRMA = $.extend({},home.FIRMA, home.FIRMA_PS);

        if (typeof p == 'undefined'){

            logger.debug(JSON.stringify(home.FIRMA_PS));
            //home.FIRMA = home.NS_FENIX_FIRMA.getInstance(home.FIRMA_PS);
            // home.NS_FENIX_FIRMA.getInstance(home.FIRME_ADT["SDO"]);


            var prompts = "&promptpIdenContatto=" + $("#IDEN_CONTATTO").val() + '&promptpFirma=S'+ '&promptpStatoVerbale=';
            prompts += jsonData.hStatoVerbale === "F" ? "E" : "R";
            p = {
                "STAMPA" : {"PRINT_REPORT":"CATENA_CONSENSO", "PRINT_DIRECTORY": "1", "PRINT_PROMPT": prompts},
                "FIRMA" : {}
            };

        }

        p['FIRMA'].FIRMA_COMPLETA = false;
        p['FIRMA'].PRIMA_FIRMA = true;
        p['FIRMA'].IDEN_VERSIONE =  CATENA_CUSTODIA.idenSchedaCatena;
        p['FIRMA'].IDEN_VERSIONE_PRECEDENTE = null;
        p['FIRMA'].TIPO_DOCUMENTO =  "CUSTODIA";
        p['FIRMA'].TABELLA =  "PRONTO_SOCCORSO.PS_SCHEDE_XML";
        p['FIRMA'].KEY_CONNECTION = "PS";
//        p['FIRMA'].CALLBACK = function(){NS_FENIX_SCHEDA.chiudi({'refresh' : true});};

        logger.debug("Firma - CATENA_CONSENSO.firma - p -> " + JSON.stringify(p));

        home.FIRMA.initFirma(p);
    }

};