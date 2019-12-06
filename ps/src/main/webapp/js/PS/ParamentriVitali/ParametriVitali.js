/**
 * User: matteopi
 * Date: 09/12/13
 * Time: 11.32
 * Modify : carlog
 */

jQuery(document).ready(function () {
    PARAMETRI_VITALI.init();
    PARAMETRI_VITALI.event();
    PARAMETRI_VITALI.initScalaVas();

});

var PARAMETRI_VITALI = {

//    jsonContatto : NS_DATI_PAZIENTE.getDatiContattobyIden($('#IDEN_CONTATTO').val(), {assigningAuthorityArea: 'ps'}),
    salva : null,

    init: function () {
        PARAMETRI_VITALI.salva = NS_FENIX_SCHEDA.registra;

        home.NS_CONSOLEJS.addLogger({name: 'paramVitali', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['paramVitali'];


        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        home.PARAMETRI_VITALI = this;


        PARAMETRI_VITALI.detectBaseUser();
        PARAMETRI_VITALI.overridEfunction();

        $("#txtRTS").attr("readonly", "readonly");
        $("#taParamNote").autosize();
        $("#idenSalaDefault").val(eval('home.baseGlobal.SALA_DEFAULT_' + $("#COD_CDC_PS").val()));

        /*if(jsonData.VAS_OBBLIGATORIA == 'S'){
            NS_FENIX_SCHEDA.addFieldsValidator({config: "V_PARAMETRI_VITALI"});

        } */
        NS_FENIX_SCHEDA.registra = PARAMETRI_VITALI.registra;

    },

    event: function () {
        $("input[type='text']").not(".clsNotControl").on("change", function(){PARAMETRI_VITALI.controlParametro($(this));});

        $("#divScalaVasImmagini").find("span").on("click", function ()
        {
            var value = PARAMETRI_VITALI.convertIdToValue(this.id);
            PARAMETRI_VITALI.setValueSlider(value)
        });

        $("#txtPressArtMax, #txtPressArtMin").on("change", function (){PARAMETRI_VITALI.controlloPressione();});

        $("#txtFrequResp").on("change", function(){PARAMETRI_VITALI.controlloFreqRespiratoria($(this));});

        $("#txtSPO2").on("change", function(){PARAMETRI_VITALI.controlloSaturazione($(this));});

        $("#txtTemperatura").on("change", function(){PARAMETRI_VITALI.controlloTemperatura($(this));});

        $("#txtGlasgow").on("change",function(){PARAMETRI_VITALI.controlGlasgow($(this))});

        $('#txtFrequCard').on("change", function(){PARAMETRI_VITALI.controlloFreqCardiaca()});

        $("#lblGlasgow").on("click", function(){
            var eta = "";

            if(!PARAMETRI_VITALI.differenzaDate()){
                DIALOG_PS.scalaGlasgow(eta);
            } else {
                eta = PARAMETRI_VITALI.differenzaDate();
                DIALOG_PS.scalaGlasgow(eta);
            }
        });

        $("#lblStickUri").on("click", DIALOG_PS.stickUrinario);
        $("#lblRTS").on("click", DIALOG_PS.legendaRTS);
        $('#cambiaScala').live('click', function(){
            DIALOG_PS.cambiaScala(function(){

                if($('#aperturaP').is(':hidden')) {
                    $('#tdLegenda').text('LEGENDA GLASGOW')
                }
                else{
                    $('#tdLegenda').text('LEGENDA GLASGOW PEDIATRICA')
                }
            })
        });

        //solo se il problema principale è trauma o ustione valorizzare in automatico la RTS
        /*if(home.CARTELLA.NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.problemaPrincipale == '10') {
            $("#txtPressArtMin, #txtFrequResp, #txtGlasgow").on("change", PARAMETRI_VITALI.calcolateRTS);
        } */

    },

    dataAttuale: function(){

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        today = (mm + '/' + dd + '/' + yyyy);
        return today;
    },

    getDataNascita: function(){
        var yyyy = parent.NS_INFO_PAZIENTE.jsonAnagrafica.DATA_NASCITA.substr(0,4);
        var mm = parent.NS_INFO_PAZIENTE.jsonAnagrafica.DATA_NASCITA.substr(4,2);
        var dd = parent.NS_INFO_PAZIENTE.jsonAnagrafica.DATA_NASCITA.substr(6,2);

        return (mm + '/' + dd + '/' + yyyy);
    },

    differenzaDate: function(){

        var date1 = null;
        if (PARAMETRI_VITALI.getDataNascita() != ''){
            date1 =  new Date(PARAMETRI_VITALI.getDataNascita());
        }
        else{
            //date1 = null;
            return false;
        }

        var date2 = new Date(PARAMETRI_VITALI.dataAttuale());
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());

        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    },

    initScalaVas: function () {
        var SliderScalaVas = $("#divSliderScalaVas");

        SliderScalaVas.css({width: '600px'}).slider(
            {
                max: 10,
                change: function (event, ui) {
                    PARAMETRI_VITALI.setColor(ui.value, $(this));
                    PARAMETRI_VITALI.setBorderImmage(ui.value);
                    $("#hScalaVas").val(ui.value);
                },
                slide: function (event, ui) {
                    PARAMETRI_VITALI.setColor(ui.value, $(this));
                    PARAMETRI_VITALI.setBorderImmage(ui.value);
                    $(this).find('a').attr("title", ui.value);
                    $("#lblScalaVas").find("legend").text('Scala VAS ' + ui.value);
                },
                animate: "fast"
            });

        var distance = (SliderScalaVas.width() - (90 * 6) - 12) / 5;
        $("#divScalaVasImmagini").width(SliderScalaVas.width());
        $(".imgMargin").css({"margin-left": distance + 'px'});
        $(".ultimoSpan").css({"display": "inline-block", "float": "right"});
    },

    detectBaseUser: function() {
        var butSalva = $("button.butSalva");
        var TipoPersonale = home.baseUser.TIPO_PERSONALE;
        var stato_contatto =  jsonData.STATO_CONTATTO;

        switch (TipoPersonale) {
            case 'A':
                butSalva.hide();
                break;
            case 'I':
            case 'OST':
                if(home.CARTELLA.NS_REFERTO.wk_apertura == 'LISTA_CHIUSI'){
                    $('.butSalva').remove();
                }
            case 'M':
                if(stato_contatto=="DISCHARGED")
                {
                    butSalva.hide();
                }
                else if(stato_contatto=="ADMITTED")
                {
                    PARAMETRI_VITALI.showSalva();
                    $("form").find("div.contentTabs").on("click", function (){home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";});
                }
                break;
            default:
                logger.error("baseuser non valorizzato correttamente : " + TipoPersonale);
                break;
        }
    },

    overridEfunction : function(){
        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true;return params;};
        NS_FENIX_SCHEDA.beforeSave = PARAMETRI_VITALI.beforeSave;
        NS_FENIX_SCHEDA.successSave = PARAMETRI_VITALI.successSave;
    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== value) && ("null" !== value) && (typeof undefined !== value));
    },

    isANumber : function(value){
        return ( (!isNaN(value)) && (PARAMETRI_VITALI.hasAValue(value)) )
    },

    controlParametro: function(_this){
        var valore= _this.val();
        valore = valore.replace(/ /g, "");
        var butSalva = $("button.butSalva");

        if( (!isNaN(valore)) && (valore.length<=3)){
            _this.removeClass("tdError");
            _this.val(valore);
            PARAMETRI_VITALI.showSalva();
            return true;
        }else{
            butSalva.hide();
            _this.addClass("tdError");
            PARAMETRI_VITALI.alertUndefined(_this);
            return false;
        }
    },
    /**
     * Controlla che la pressione max sia superiore alla min, altrimenti torna false
     * @returns {boolean}
     */
    controlloPressione: function () {
        var pmax = $("#txtPressArtMax");
        var pmin = $("#txtPressArtMin");
        var controllo = false;
        var butSalva = $("button.butSalva");

        if (!NS_CONTROLLI.controlloPressione(pmax.val(), pmin.val())) {
            pmin.addClass("tdError");
            pmax.addClass("tdError");
            PARAMETRI_VITALI.alertPressione(pmax,pmin );
            butSalva.hide();
            controllo = false;
        } else {
            pmin.removeClass("tdError");
            pmax.removeClass("tdError");
            PARAMETRI_VITALI.showSalva();
            controllo = true;
        }
        if(home.CARTELLA.NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.problemaPrincipale == '10') {
            PARAMETRI_VITALI.calcolateRTS();
        }

        return controllo;
    },

    controlloFreqCardiaca: function(){
        var freq = $('#txtFrequCard');

        if(!NS_CONTROLLI.controlloFreqCardiaca(freq.val())){
            freq.addClass('tdError');
            PARAMETRI_VITALI.alertFreqCardiaca(freq);
        }
    },
    /**
     * controlla che la freq respiratoria sia di max 2 cifre
     * @param _this
     * @returns {boolean}
     */
    controlloFreqRespiratoria : function(_this){

        var value = _this.val();
        var butSalva = $("button.butSalva");

        if(NS_CONTROLLI.controlloFreqRespiratoria(value)){
            _this.removeClass("tdError");

            if(home.CARTELLA.NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.problemaPrincipale == '10') {
                PARAMETRI_VITALI.calcolateRTS();
            }

            PARAMETRI_VITALI.showSalva();
            return true;
        }else{
            butSalva.hide();
            _this.addClass("tdError");
            PARAMETRI_VITALI.alertUndefined(_this);
            return false;
        }
    },
    /**
     * controlla che la saturazione sia compresa tra 0-100
     * @param _this
     * @returns {boolean}
     */
    controlloSaturazione : function(_this){

        var butSalva = $("button.butSalva");
        var value = _this.val();


        if(NS_CONTROLLI.controlloSaturazione(value)){
            _this.removeClass("tdError");
            _this.val(value);
            PARAMETRI_VITALI.showSalva();
            return true;
        }else{
            butSalva.hide();
            _this.addClass("tdError");
            PARAMETRI_VITALI.alertUndefined(_this);
            return false;
        }
    },
    /**
     * controllo che la temperatura sia nei parametri normali da 33° a 42° C
     * @param t
     */
    controlloTemperatura : function(t){

        var butSalva = $("button.butSalva");
        var temperatura = t.val();


        if( NS_CONTROLLI.controlloTemperatura(temperatura) ){
            t.removeClass("tdError");
            t.val(temperatura);
            PARAMETRI_VITALI.showSalva();
        }else{
            butSalva.hide();
            t.addClass('tdError');
            PARAMETRI_VITALI.alertTemperatura(t);
        }

    },
    controlGlasgow:function(_this){
        var butSalva = $("button.butSalva");
          if(NS_CONTROLLI.controlParametro(_this.val()),15){
              _this.removeClass("tdError");
              PARAMETRI_VITALI.showSalva();
              if(home.CARTELLA.NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.problemaPrincipale == '10') {
                  PARAMETRI_VITALI.calcolateRTS();
              }
          }else{
              _this.val("");
              _this.addClass("tdError");
              butSalva.hide();
              PARAMETRI_VITALI.alertUndefined(_this);
          }
    },
    alertFreqCardiaca: function (pos) {
        $.dialog('Frequenza cardiaca errata',
            {title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {
                        //var txtPressArtMin = $("#txtPressArtMin");
                        pos.val("");

                        pos.focus();
                        $.dialog.hide();
                    }}
                ]
            }
        );
    },
    /**
     * allerta sulla tmeperatura
     * @param t
     */
    alertTemperatura: function (t) {
        $.dialog("E' stata inserita una temperatura non corretta",
            {title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {
                        t.val("");

                        $.dialog.hide();
                    }}
                ]
            }
        );
    },
    /**
     * allerta sulla pressione
     */
    alertPressione: function (pMax, pMin) {
        $.dialog("E' stata inserita una pressione Errata, verificare i dati inseriti",
            {title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {



                        $.dialog.hide();
                    }}
                ]
            }
        );
    },
    /**
     * allerta generico sui parametri
     * @param _this
     */
    alertUndefined: function(_this){
        $.dialog("Parametri non corretti nell'inserimento parametri vitali",
            {title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {

                        $.dialog.hide();
                    }}
                ]
            }
        );
    },

    /**
     * Controlla prima di salvare la correttezza di alcuni parametri
     * @returns {boolean}
     */
    beforeSave : function () {

        var test = "";
        var tabdati = $("#dati");

        tabdati.find("input").not("#idenEsaStickGlicemico,#idenEsaStaturazione,#idenCDC,#idenSalaDefault,#idenEsaPressione").each(function(){
            test += $(this).val();
        });

        tabdati.find("textarea").each(function(){
            test += $(this).val();
        });

        if(test.length > 0){
            return true;
        }else{
            home.NOTIFICA.error({message: "Nessun valore inserito. Salvataggio non effettuato", title: "Error"});
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
            return false;
        }
    },
    /**
     * funzione lanciata dopo il successo del salvataggio
     */
    successSave : function () {
        NS_LOADING.showLoading();

        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";

        setTimeout(function() {
            home.CARTELLA_INFO.initWkPrecedenti();
            document.location.replace(document.location);
            NS_LOADING.hideLoading();
        }, 1000)
    },
    /**
     * Imposta il colore di sfondo della scala VAS
     * @param value
     * @param obj
     */
    setColor: function (value, obj) {
        var $obj = $(obj);
        $obj.css({"background-color": PARAMETRI_VITALI.getColor(value)});
    },
    /**
     * Setta il variare delle sfumature di rosso della scala VAS
     * @param value
     * @returns {*}
     */
    getColor: function (value) {
        var color;
        switch (value) {
            case 10:
                color = "#FF1919";
                break;
            case 9:
            case 8:
                color = "#FF5252";
                break;
            case 7:
            case 6:
                color = "#FF8080";
                break;
            case 5:
            case 4:
                color = "#FF9999";
                break;
            case 3:
            case 2:
                color = "#FFBDBD";
                break;
            case 1:
            case 0:
                color = "#FFE0E0";
                break;
            default:
                color = 'white';
                break;
        }
        return color;
    },
    /**
     *
     * @param value
     */
    setBorderImmage: function (value) {
        $("#divScalaVasImmagini").find("span").css({"border-bottom": 'transparent'});
        $("#" + PARAMETRI_VITALI.convertValueToId(value)).css({'border-bottom': '2px solid ' + PARAMETRI_VITALI.getColor(value)});
    },
    /**
     *
     * @param value
     */
    setValueSlider: function (value) {
        $("#divSliderScalaVas").slider("value", value);
    },
    /**
     * prende l'id dello span e setta il valore della scala
     * @param id
     * @returns {*}
     */
    convertIdToValue: function (id) {
        var value;
        switch (id) {
            case 'divImg1':
                value = 0;
                break;
            case 'divImg2':
                value = 2;
                break;
            case 'divImg3':
                value = 4;
                break;
            case 'divImg4':
                value = 6;
                break;
            case 'divImg5':
                value = 8;
                break;
            case 'divImg6':
                value = 10;
                break;
            default:
                value = 0;
                break;
        }
        $("#lblScalaVas").find("legend").text('Scala VAS ' + value);
        return value;
    },
    /**
     *
     * @param value
     * @returns {*}
     */
    convertValueToId: function (value) {
        var id;
        switch (value) {
            case 0 :
            case 1 :
                id = 'divImg1';
                break;
            case 2:
            case 3:
                id = "divImg2";
                break;
            case 4:
            case 5:
                id = "divImg3";
                break;
            case 6:
            case 7:
                id = "divImg4";
                break;
            case 8:
            case 9:
                id = "divImg5";
                break;
            case 10:
                id = "divImg6";
                break;
            default:
                id = "divImg1";
                break;
        }
        return id;
    },
    /**
     * Calcola il risultato della Scala Glasgow
     * @constructor
     */
    WriteResult: function () {
        var result = 0;
        $.each($("#motoria").find("td"), function () {
            if ($(this).find("input").is(":checked")) {
                result = result + parseInt($(this).find("input").attr("data-value"));
            }
        });
        $.each($("#verbale").find("td"), function () {
            if ($(this).find("input").is(":checked")) {
                result = result + parseInt($(this).find("input").attr("data-value"));
            }
        });
        $.each($("#aperturaocchi").find("td"), function () {
            if ($(this).find("input").is(":checked")) {
                result = result + parseInt($(this).find("input").attr("data-value"));
            }
        });
        $("#totale").text(result);
        $("button.butSalva").show();
        $("#txtGlasgow").removeClass("tdError");
    },
    /**
     * Solo un check valorizzato per volta
     * @param data
     * @param id
     */
    checkOnlyOne: function (data, id) {
        $("#" + id + " td").each(function () {
            if ($(this).find("input").is(":checked")) {
                $(this).find("input").removeAttr("checked");
            }
            if ($(this).find("input").attr("data-value") == data) {
                $(this).find("input").attr("checked", "checked");
            }
        });
        PARAMETRI_VITALI.WriteResult();
    },
    /**
     * Calcola punteggio del Revised trauma Score
     */
    calcolateRTS: function () {


        var valueGlasgow = PARAMETRI_VITALI.RTS.convertGlasgow($("#txtGlasgow").val());
        var valueSystolic = PARAMETRI_VITALI.RTS.convertSystolic($("#txtPressArtMin").val());
        var valueRespiratory = PARAMETRI_VITALI.RTS.convertRespRate($("#txtFrequResp").val());

        if( (valueGlasgow>0) && (valueSystolic>0) && (valueRespiratory>0) ) {
            var result = (valueGlasgow + valueSystolic + valueRespiratory) / 3;

            $("#txtRTS").val(Math.round(result));
        } else {
            $("#txtRTS").val("");
        }

    },

    RTS: {
        /**
             la scala di glasgow ha queste conversioni
             valore 15-13 => 4
             valore 12-9 => 3
             valore 8-6 => 2
             valore 5-4 => 1
             valore 3-0 => 0

         * @param value
         * @returns {number}
         */
        convertGlasgow: function (value) {
            var valore = 0;
            switch (true) {
                case (value >= 13 && value <= 15):
                    valore = 4;
                    break;
                case (value >= 9 && value <= 12):
                    valore = 3;
                    break;
                case (value >= 6 && value <= 8):
                    valore = 2;
                    break;
                case (value == 4 || value == 5):
                    valore = 1;
                    break;
                case value == 3:
                    break;
            }
            return valore;
        },
        /**
             la pressione sistolica ha le seguenti conversioni
             >89 = 4
             76-89 = 3
             50-75 = 2
             1-49 = 1
             0 = 0

         * @param value
         * @returns {number}
         */
        convertSystolic: function (value) {
            var valore = 0;
            switch (true) {
                case value >= 89:
                    valore = 4;
                    break;
                case (value < 89 && value >= 76):
                    valore = 3;
                    break;
                case (value < 76 && value >= 50):
                    valore = 2;
                    break;
                case  (value < 49 && value >= 1):
                    valore = 1;
                    break;
                case value == 0:
                    break;
            }
            return valore;
        },
        /**
             la scala frequenza di respirazione ha le seguenti conversioni

             10-29 = 4
             >29 = 3
             6-9 = 2
             1-5 = 1
             0 = 0

         * @param value
         * @returns {number}
         */
        convertRespRate: function (value) {
            var valore = 0;
            switch (true) {
                case (value >= 10 && value <= 29):
                    valore = 4;
                    break;
                case (value > 29):
                    valore = 3;
                    break;
                case(value <= 9 && value >= 6):
                    valore = 2;
                    break;
                case (value <= 5 && value >= 1):
                    valore = 1;
                    break;
                case value == 0 :
                    break;
            }
            return valore;
        }
    } ,
    showSalva : function (){
        if($(".tdError").length == 0)   {
            $("button.butSalva").show();
        }
    },
    registra : function () {

        //checkCompletaTriage(:iden_contatto)
        var param = {
            datasource : 'PS',
            id : 'checkVas',
            params : {pIdenContatto : {v: Number($("#IDEN_CONTATTO").val()) , t : 'N'}},
            callbackOK : callbackOk
        };

        function callbackOk (data) {

            var result = data.p_result.split('|');

            if(result[0] == 'OK'){
                var pressMax =  $("#txtPressArtMax").val();
                var pressMin =  $("#txtPressArtMin").val();
                if ( pressMax != '' && pressMin == ''){
                    home.NOTIFICA.error({message: 'Inserire la pressione minima', title: "Error"});
                    return false;
                }else{
                    PARAMETRI_VITALI.salva();
                }
            }else{
                if($("#hScalaVas").val() == ''){
                    home.NOTIFICA.error({message: result[1], title: "Error"});
                    return false;
                }else{
                    PARAMETRI_VITALI.salva();
                }
            }
        }

        NS_CALL_DB.FUNCTION(param)
    }
};