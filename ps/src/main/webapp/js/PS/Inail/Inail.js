/**
 * User: carlog
 *
 * Date: 11/03/14
 */

jQuery(document).ready(function () {
    NS_INAIL.detectBaseUser();
    NS_INAIL.setEvents();
    NS_INAIL.init();


});

var NS_INAIL = {

    esamiCure: null,

    validator:  NS_FENIX_SCHEDA.addFieldsValidator({config: "V_PS_INAIL"}),

    detectBaseUser: function () {
        var butSalva = $("/*button.butSalva,*/button.butStampa");
        var TipoPersonale = home.baseUser.TIPO_PERSONALE;
        //var form = $("form");

        switch (TipoPersonale) {
            case 'A':
                butSalva.hide();
                break;
            case 'I':
            case 'OST':
                butSalva.hide();
                break;
            case 'M':
                butSalva.show();

                break;
            default:
                logger.error("baseuser non valorizzato correttamente : " + TipoPersonale);
                break;
        }
    },

    init: function () {
        if(home.PANEL != null) {
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }

        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params;};
        NS_FENIX_SCHEDA.successSave = NS_INAIL.successSave;

        NS_INAIL.detectStatoPagina();

        if( $("#READONLY").val()==="S" || home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST' || $("#hStatoContatto").val() =="ADMITTED")
        {
            $("#INAIL\\@butFirma").hide();
            $("textarea").attr("readonly","readonly");
            $("input").attr({"readonly":"readonly","disabled":"disabled"});
            $("select").attr("disabled","disabled");
            $(".tdACList").find('span').off('click');
            $("div.RBpuls").off("click").attr("readonly","readonly");
            if(!(home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST')) {
                $("div.contentTabs").css({"background": "#CACACC"});
            }
        }

        NS_INAIL.checkStatoFirma($("#hStatoScheda").val());

        home.NS_FENIX_PS.IDEN_SCHEDA = jsonData.hIDEN;

    },

    checkStatoFirma : function(stato){
        var isDaFirmare = $("#IS_DA_FIRMARE");

        isDaFirmare.val(stato == "F" ? "S" : "N");

        logger.debug("IS_DA_FIRMARE -> " + isDaFirmare.val());

        if(stato === "F"){
            // $(".butSalva").hide();
        }
    },

    setEvents: function () {
        $(".butStampa").on("click", NS_INAIL.stampaModuli);

        $(".butFirma").on("click", function () {
            NS_INAIL.firma = true;
            home.NS_LOADING.showLoading({"timeout": "0", "testo": "FIRMA", "loadingclick": function () {home.NS_LOADING.hideLoading();}});
            NS_FENIX_SCHEDA.registra();
        });

        $('#radPrognosi_0').on("click", function(){
            var $txtProgGiorni = $("#txtProgGiorni");
            if($(this).hasClass('RBpulsSel')){

                var dataRilascio = $('#txtDataRila').val();
                $txtProgGiorni.val("");
                if(typeof $txtProgGiorni.attr("readonly") !== "undefined" ){
                    $txtProgGiorni.removeAttr("readonly");
                }
                $("#txtDataFino").val("");
                $('#txtDataProg').val(dataRilascio);
            }
            else{
                NS_INAIL.setFinePrognosi();
            }

        });

        $('#radPrognosi_1').on("click", function(){
            var $txtProgGiorni = $("#txtProgGiorni");
            if($(this).hasClass('RBpulsSel')){
                if(typeof $txtProgGiorni.attr("readonly") !== "undefined" ){
                    $txtProgGiorni.removeAttr("readonly");
                }
                if($txtProgGiorni.val() == ""){
                    $txtProgGiorni.val($("#hGiorniPrognosi").val());
                }
                NS_INAIL.setInizioPrognosiRiservata();
            }
        });

        $('#radPrognosi_2, #radPrognosi_3').on("click", function(){
            $("#txtDataProg").val("");
            $("#txtProgGiorni").val("").attr("readonly","readonly");
            $("#txtDataFino").val("");

        });


        $("td.tdData").find("input[type=text]").on("blur change", function(){
            NS_INAIL.checkData($(this));
        });
        var $txtOraAbb = $('#txtOraAbb');
        $txtOraAbb.on('change', function(){NS_INAIL.checkOraAbbandono()});
        $txtOraAbb.on('blur', function(){NS_INAIL.checkOraAbbandono()});


        $("#txtProgGiorni").on("change", function(){
            if(NS_INAIL.isANumber($(this).val())){
                $(this).removeClass("tdError");
                NS_INAIL.setFinePrognosi();

            }else{
                $(this).addClass("tdError");
                $(this).val("");
                $.dialog("Inserire i giorni in formato numerico", {
                    title: "Attenzione",
                    buttons: [
                        {label: "OK", action: function () {
                            $.dialog.hide();
                        }}
                    ]
                });
            }
        });

        $('#radPostumiMala').on('click',function(){NS_INAIL.checkPostumi();});

        var $txtDataRila = $('#txtDataRila');
        $txtDataRila.on("blur", function(){
            NS_INAIL.setInizioPrognosiRiservata();

        });
        $txtDataRila.on("change", function(){
            NS_INAIL.setInizioPrognosiRiservata();

        });

    },

    checkPostumi: function(){
        if($('#h-radPostumiMala').val() !== 'S'){
            $('#taPostumiMala').hide();
        }
        else{
            $('#taPostumiMala').show();
        }
    },

    setFinePrognosi : function(){
        var dataRilascio = $('#txtDataRila').val();
        var giorniPrognosi = $("#txtProgGiorni").val();

        if(NS_INAIL.hasAValue(dataRilascio) && NS_INAIL.hasAValue(giorniPrognosi)){
            $("#txtDataProg").val(dataRilascio);
            var dataFine = moment.utc(moment(dataRilascio,"DD/MM/YYYY").add('days', Number(giorniPrognosi))).subtract(1, 'days').format("DD/MM/YYYY");
            $("#txtDataFino").val(dataFine);
        }
    },

    setInizioPrognosiRiservata : function(){
        var dataRilascio = $("#txtDataRila").val();


        if(NS_INAIL.hasAValue(dataRilascio)){
            $("#txtDataProg").val(dataRilascio);
        }

        NS_INAIL.setFinePrognosi();
    },

    detectStatoPagina : function(){
        var stato_pagina = $("#STATO_PAGINA").val();

        if(stato_pagina=="I")
        {
            NS_INAIL.selezioneDefault();
            NS_INAIL.caricaTerapie(function(){
                NS_INAIL.caricaPrestazioni(function(){
                    NS_INAIL.caricaAccertamenti(function(){
                        NS_INAIL.getAccertamenti();

                    });
                });
            });
        }
        else if(stato_pagina=="E")
        {
            if(home.baseUser.IDEN_PER == $('#hIdenPer').val() || home.basePermission.hasOwnProperty("SUPERUSER"))
            {
                $("div.headerTabs").html("<h2 style='color: rgb(255, 255, 0);' id='lblAlertModifica'>MODIFICA</h2>");
            }
            else
            {
                $("div.headerTabs").html("<h2 style='color: rgb(255, 255, 0);' id='lblAlertModifica'>DOCUMENTO FIRMATO DA ALTRO UTENTE</h2>");
                $("#INAIL\\@butFirma").hide();
                $("textarea").attr({"readonly":"readonly","disabled":"disabled"});
                $("input").attr({"readonly":"readonly","disabled":"disabled"});
                $("select").attr({"readonly":"readonly","disabled":"disabled"});
                $(".tdACList").find('span').off('click');
                $("div.RBpuls").off("click").attr({"readonly":"readonly","disabled":"disabled"});
            }

        }
    },

    successSave: function (message) {

        NS_INAIL.idenScheda = message;

        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");

        var _listaChiusi =  $("#LISTA_CHIUSI").val();
        if (_listaChiusi === 'S'){
            //siamo in gestione esito
            if (NS_INAIL.firma == true)
            {
                NS_REGISTRAZIONE_FIRMA.firma();
            }
            else{
                //home.NS_FENIX_TOP.chiudiScheda({"n_scheda":});
                home.NS_FENIX_TOP.apriPagina({
                    url:'page?KEY_LEGAME=MODULISTICA&IDEN_CONTATTO=' + $("#IDEN_CONTATTO").val()	+ '&IDEN_PROVENIENZA=' + $("#IDEN_PROVENIENZA").val() +'&READONLY=N&LISTA_CHIUSI=S',
                    fullscreen:true
                });

                home.$("#iScheda-1")[0].contentWindow.document.location.replace(home.$("#iScheda-1")[0].contentWindow.document.location);
                NS_FENIX_SCHEDA.chiudi();
            }

        }else if (_listaChiusi === 'N'){
            //siamo da dentro la cartella
            home.CARTELLA.jsonData.H_STATO_PAGINA.INAIL = 'E';
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
            if (NS_INAIL.firma == true)
            {
                NS_REGISTRAZIONE_FIRMA.firma();
            } else{
                home.CARTELLA.NS_REFERTO.apriModulistica();
            }
        }


    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== typeof value) && ("null" !== value));
    },

    isANumber : function(value){
        return ( (!isNaN(value)) && (NS_INAIL.hasAValue(value)) )
    },

    selezioneDefault: function () {
        var esitoVerbale = $("#hEsitoVerbale").val();
        var esitoObi = $("#hEsitoOBI").val();
        var prognosi = $("#h-radPrognosi");
        var dataEvento = $("#txtDataEvento");
        var dataAbbandono = $("#txtDataAbb");
        var $txtCivico = $('#txtCivico');
        var $radPrognosi_2 = $('#radPrognosi_2');
        var $hGiorniPrognosi = $("#hGiorniPrognosi");

        if(NS_INAIL.hasAValue(dataEvento.val())){
            dataEvento.attr("readonly","readonly");
            dataEvento.off("click");
            dataEvento.parent().find(".Zebra_DatePicker_Icon ").off("click");
        }

        prognosi.val(dataAbbandono.val());

        /**Industria di default*/
        $("#cmbSettoreLav").find("option[value='I' ]").attr('selected', true);

        if(esitoVerbale=="7" || esitoVerbale=="8" || esitoObi=="7" || esitoObi=="8"){
            prognosi.val("3");
            $("#radPrognosi_3").addClass("RBpulsSel");
        }else{
            prognosi.val("1");
            $("#radPrognosi_1").addClass("RBpulsSel");
        }

        if(esitoVerbale=="2" || esitoObi=="2"){
            $("#h-radRicovero").val("S");
            $("#radRicovero_S").addClass("RBpulsSel");
        }else{
            $("#h-radRicovero").val("N");
            $("#radRicovero_N").addClass("RBpulsSel");
        }

        $("#h-radPericoloV").val("N");
        $("#radPericoloV_N").addClass("RBpulsSel");
        $("#h-radInvalidPerma").val("N");
        $("#radInvalidPerma_N").addClass("RBpulsSel");
        $("#h-radRicaduta").val("N");
        $("#radRicaduta_N").addClass("RBpulsSel");

        var diagnosi = $("#hDiagnosi").val();
        var icdConcat = jsonData.hICD91 + "\n" + jsonData.hICD92 + "\n" + jsonData.hICD93 + "\n" + jsonData.hICD94 + "\n" + jsonData.hICD95;
        diagnosi = (NS_INAIL.hasAValue(diagnosi) ? diagnosi : icdConcat);
        $("#taDiagnosi").val(diagnosi);

        prognosi.trigger("change");
        NS_INAIL.setFinePrognosi();

        $('#radPostumiMala_N').trigger('click');
        NS_INAIL.checkPostumi();

        var civicoDom = $('#hDomCivico').val();
        var civicoRes = $('#hResCivico').val();

        if(NS_INAIL.hasAValue(civicoDom)){
            $txtCivico.val(civicoDom);
        }
        else{
            $txtCivico.val(civicoRes);
        }

        var indirizzoDom = $('#hDomIndirizzo').val();
        var indirizzoRes = $('#hResIndirizzo').val();

        if(NS_INAIL.hasAValue(civicoDom)){
            $('#txtIndirizzo').val(indirizzoDom);
        }
        else{
            $('#txtIndirizzo').val(indirizzoRes);
        }

        NS_INAIL.comuneRilascioDefault($("#hStrutturaPAziente").val());



        if($('#hRiservata').val() === '1'){

            var dataRilascio = $('#txtDataRila').val();
            $('#radPrognosi').children().each(function(){
                $(this).removeClass('RBpulsSel')
            });

            $('#txtProgGiorni').val("");
            $("#txtDataFino").val("");
            $('#txtDataProg').val(dataRilascio);
            $('#radPrognosi_0').trigger('click');
        }

        $txtCivico.attr('maxlength','5');

        if($('#STATO_PAGINA').val() == 'I'){
            $('#radTipologia_PRIMO').trigger('click');
        }

        if($radPrognosi_2.hasClass('RBpulsSel') ||$('#radPrognosi_3').hasClass('RBpulsSel')){
            $("#txtDataProg").val("");
            $("#txtProgGiorni").val("");
            $("#txtDataFino").val("");

        }

        if($hGiorniPrognosi.val() === "0" ){
            if(!$('#radPrognosi_0').hasClass('RBpulsSel')){
                $hGiorniPrognosi.val("");
                $radPrognosi_2.trigger("click");
                $("#txtDataProg").val("");
                $("#txtProgGiorni").val("");
                $("#txtDataFino").val("");
                $('#radPrognosi').find('div').off('click');
            }
            else{
                $hGiorniPrognosi.val("");
            }

        }
        else if($hGiorniPrognosi.val() === "" && $("#hRiservata").val() === "" && (esitoVerbale!="7" && esitoVerbale!="8" && esitoObi!="7" && esitoObi!="8") )
        {

            $('#radPrognosi').find('div').removeClass('RBpulsSel');
            $('#radPrognosi_2').trigger('click');
            prognosi.val("2");
            V_PS_INAIL.elements["h-radPrognosi"].status = "required";
            NS_FENIX_SCHEDA.addFieldsValidator({config: "V_PS_INAIL"});

        }



    },

    comuneRilascioDefault : function(struttura){

        if(NS_INAIL.hasAValue(struttura)){

            var obj = JSON.parse(home.baseGlobal.COMUNE_RILASCIO_INAIL);

            var value = obj[""+struttura+""][0].VALUE;
            var codice_regione = obj[""+struttura+""][0].CODICE_REGIONE;
            var codice_provincia =obj[""+struttura+""][0].CODICE_PROVINCIA;
            var descr = obj[""+struttura+""][0].COMUNE_RILASCIO;
            var cap =obj[""+struttura+""][0].CAP;

            var comune = $("#txtLuogoRil");



                comune.val(descr)
                    .attr("data-c-codice_regione", codice_regione)
                    .attr("data-c-codice_provincia", codice_provincia)
                    .attr("data-c-descr", descr)
                    .attr("data-c-value", value);
                $("#h-txtLuogoRil").val(value);
        }else{
            logger.info("struttura non valorizzata");
        }

    },

    stampaModuli: function () {
        logger.error("per ora non stampa");
        /*
         imposto la url di stampa
         var url_prompt = "";
         url_prompt += "&promptpIdenContatto=" + document.getElementById('IDEN_CONTATTO').value;
         chiamo la funzione di stampa
         home.NS_FENIX_PRINT.stampa({
         'PRINT_REPORT' : 'VERBALE_INAIL',
         'PRINT_CDC' : '1',
         "PRINT_PROMPT" : url_prompt
         });
         */

        /*dopo aver stampato scirve che il modulo è stato stampato*/
    },

    caricaTerapie: function (callback) {


        var par = {
            datasource : 'PS',
            id : "WORKLIST.TERAPIE_ASSOCIATE_ATTIVE",
            params : {"iden_contatto": {v: Number($("#IDEN_CONTATTO").val()), t: "N"}},
            callbackOK : function (response) {
                if (response) {
                    logger.info("Prestazioni terapie");
                    $.each(response.result, function (chiave, valore) {
                        $("#taEsamiSpec").append( (valore.FARMACI).toLowerCase() + " ");

                    });
                    if(typeof callback == 'function'){callback();}
                } else {
                    logger.error("INAIL.caricaTerapie no response");
                }
            }
        };
        NS_CALL_DB.SELECT(par);
    },

    caricaAccertamenti: function (callback) {

        var par = {
            datasource : "WHALE",
            id : "WORKLIST.ACCERTAMENTI_INAIL",
            params : {"codice": {v: $("#hCodice").val(), t: "V"}},
            callbackOK : function (response) {
                if (response) {
                    logger.info("Prestazioni accertamenti");

                    $.each(response.result, function (chiave, valore) {
                        $("#taRefertiAcc").append( (valore.DESCR).toLowerCase() + " ");
                    });
                    if(typeof callback === 'function'){callback();}

                } else {
                    logger.error("INAIL.caricaAccertamenti no response" );
                }
            }

        };
        NS_CALL_DB.SELECT(par);

    },

    caricaPrestazioni : function(callback){

        var par = {
            datasource : "PS",
            id : "WORKLIST.PRESTAZIONI_INTERNE_ATTIVE",
            params : {"iden_contatto": {v: Number($("#IDEN_CONTATTO").val()), t: "N"}},
            callbackOK : function (response) {
                if (response) {

                    logger.info("Prestazioni caricate");
                    $.each(response.result, function (chiave, valore) {
                        $("#taEsamiSpec").append( (valore.PRESTAZIONE).toLowerCase() + " ");
                    });
                    if(callback){callback();}
                } else {
                    logger.error("INAIL.caricaPrestazioni no response");
                }
            }

        };
        NS_CALL_DB.SELECT(par);

    },

    checkData: function(_this){


        var dataInserimento = _this.parent().find("input[type=hidden]").val();
        var campoOra = $('#txtOraAbb');

        var today = moment().format("YYYYMMDD");



        if(NS_INAIL.hasAValue(dataInserimento)){



            if ( dataInserimento <= 19000101 || (dataInserimento > today) && dataInserimento != '' ){
                home.NOTIFICA.error({message: "Data selezionata non corretta", title: "Error"});
                NS_INAIL.alertData(_this);
                //$('.butSalva').hide();

            }
            else{
                _this.removeClass("tdError");
                _this.addClass("tdObb");
                //if($("#IS_DA_FIRMARE") == 'N'){$('.butSalva').show();}
                if(campoOra.val() !== ''){
                    NS_INAIL.checkOraAbbandono(campoOra)
                }
            }
        }
        else {
            home.NOTIFICA.error({message: "Data selezionata non corretta", title: "Error"});
            NS_INAIL.alertData(_this);
            // $('.butSalva').hide();
        }

    },

    checkOraAbbandono: function(){

        var campoData = $('#txtDataAbb');
        var campoOra = $('#txtOraAbb');
        var dataInserimento =$('#h-txtDataAbb').val();
        var oraInserimento = Number(campoOra.val().replace(':',''));
        var today = moment().format("YYYYMMDD");
        var hours = moment().format("HHmm");

        if ( (campoOra.val().length < 5 && campoOra.val().length != 0 )){

            if(campoOra.val().length == 2){
                var value = campoOra.val();
                campoOra.val(value + ':00');
            }
            else{

                NS_INAIL.alertOra(campoOra);
                //$('.butSalva').hide();
            }
        }

        else if( campoData.val() !== '' && (dataInserimento == today) && (oraInserimento > hours) ){
            home.NOTIFICA.error({message: "Data selezionata non corretta", title: "Error"});
            NS_INAIL.alertOra(campoOra);
            //$('.butSalva').hide();
        }

        else {
            campoOra.removeClass('tdError');
            campoOra.addClass('tdObb');
            //if($("#IS_DA_FIRMARE") == 'N'){$('.butSalva').show();}
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
                        }
                        t.addClass("tdError");
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
                        }
                        t.addClass("tdError");
                        $.dialog.hide();
                    }}
                ]
            }
        );
    },

    getAccertamenti: function(){
        var esamiCure = $('#taEsamiSpec').val();
        var $taRefertiAcc = $('#taRefertiAcc');

        if($taRefertiAcc.val() == ''){
            $taRefertiAcc.val(esamiCure);
        }
    }

};



var NS_REGISTRAZIONE_FIRMA =
{
    firma : function (p) {

        var _idenContatto  = $("#IDEN_CONTATTO").val();

        NS_FIRMA_MODULI.setReport("INAIL");
        NS_FIRMA_MODULI.setIdenContatto(_idenContatto);
        NS_FIRMA_MODULI.setStatoVerbale(jsonData.hStatoScheda);
        NS_FIRMA_MODULI.setDocumento("INAIL");
        NS_FIRMA_MODULI.setIdenScheda( NS_INAIL.idenScheda);
        NS_FIRMA_MODULI.setCallback(function(){
            //NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){home.CARTELLA.jsonData.H_STATO_PAGINA.INAIL = 'E';});
            home.NS_LOADING.hideLoading();});
        NS_FIRMA_MODULI.setListaChiusi($("#LISTA_CHIUSI").val());

        if (typeof p == 'undefined'){
            var prompts = "&promptpIdenContatto=" + _idenContatto + '&promptpFirma=S'+ '&promptpStatoModulo=';
            prompts += jsonData.hStatoScheda === "F" ? "E" : "R";
            p = {
                "STAMPA" : {"PRINT_REPORT":NS_FIRMA_MODULI.getReport(), "PRINT_DIRECTORY": "1", "PRINT_PROMPT": prompts, N_COPIE : home.baseUserModuliReport.INAIL.N_COPIE_F},
                "FIRMA" : {}
            };
        }

        $.extend(  home.NS_FENIX_PRINT.config, p.STAMPA );

        $("#butSalva, #butFirma").off("click");

        if(typeof p != 'undefined'){
            NS_FIRMA_MODULI.firmaGenericaModuli(p);
        }else{
            NS_FIRMA_MODULI.firmaGenericaModuli();
        }
    }

};