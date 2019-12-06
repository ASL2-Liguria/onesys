/* global home, NS_FENIX_SCHEDA, moment, DATE, traduzione, LIB, NS_CALL_DB */

$(document).ready(function () {
    NS_DATI_AMMINISTRATIVI.init();
    NS_DATI_AMMINISTRATIVI.event();

    if("I" === $("#STATO_PAGINA").val() && home.NS_FENIX_TOP.associazioneMissione){
        NS_DATI_AMMINISTRATIVI.valorizzaDatiMissione(home.NS_FENIX_TOP.associazioneMissione);
        home.NS_FENIX_TOP.associazioneMissione.reset();
    }

});

var NS_DATI_AMMINISTRATIVI = {
    registra_ :  NS_FENIX_SCHEDA.registra,
    validator : null,

    init: function () {
        home.NS_CONSOLEJS.addLogger({name: 'NS_DATI_AMMINISTRATIVI', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_DATI_AMMINISTRATIVI'];

        NS_DATI_AMMINISTRATIVI.overrideFunction();

        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";

        $("textarea").autosize();

        NS_DATI_AMMINISTRATIVI.setDatePicker();

        NS_DATI_AMMINISTRATIVI.detectStatoPagina();
        NS_DATI_AMMINISTRATIVI.detectBaseUser();
        NS_FENIX_SCHEDA.koSalva =   NS_DATI_AMMINISTRATIVI.koSalva;
        NS_FENIX_SCHEDA.registra =  NS_DATI_AMMINISTRATIVI.registra;

        if(home.baseGlobal.BUTTON_WK_CODICI_MISSIONE === "S"){

            var butCodiciMissione = $(document.createElement("button"))
                .html("<i class=' icon-docs' title='Lista Codici Missione'>").text("Associa missione")
                .on("click", NS_DATI_AMMINISTRATIVI.apriWkCodiciMissione);

            var butDisassociaMissione = $(document.createElement("button"))
                .html("<i class=' icon-docs' title='Disassocia Codici Missione'>").text("Disassocia missione")
                .on("click", NS_DATI_AMMINISTRATIVI.disassociaMissione);

            $(".contentTabs")
                    .append(butCodiciMissione)
                    .append(butDisassociaMissione);
        }

    },

    overrideFunction : function(){
        NS_DATI_AMMINISTRATIVI.validator =NS_FENIX_SCHEDA.addFieldsValidator({config: "V_PS_DATI_AMMINISTRATIVI"});

        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true;return params;};
        NS_FENIX_SCHEDA.beforeSave = NS_DATI_AMMINISTRATIVI.beforeSave;
        NS_FENIX_SCHEDA.successSave = NS_DATI_AMMINISTRATIVI.successSave;

    },

    detectStatoPagina: function () {
        var stato_pagina = $("#STATO_PAGINA").val();
        var motivoIngresso = $("#cmbMotivoIngresso");
        var oraIngresso = $("#txtOraIngresso");
        var dataIngresso = $("#txtDataIngresso");
        //var butSalva = $("button.butSalva");
        dataIngresso.attr("readonly","readonly");
        oraIngresso.attr("readonly","readonly");
        dataIngresso.off("click");
        dataIngresso.parent().find(".Zebra_DatePicker_Icon ").off("click");

        if($("#READONLY").val() === "S"){$("div.contentTabs").css({"background":"#CACACC"});}

        switch(stato_pagina){
            case "I":
                $("#cmbCodIdentificativo").find("option[value="+home.baseGlobal.CODICE_CENTRALE_OPERATIVA+" ]").attr('selected', true);
                $("#txtAnno").val(moment().format("YYYY"));
                oraIngresso.val(moment().format("HH:mm"));

                NS_DATI_AMMINISTRATIVI.valorizeOnere(home.PANEL.NS_INFO_PAZIENTE.getJsonAnagrafica().IDEN_COMUNE_RESIDENZA);
                break;

            case "E":
                var wkApertura = $("#WK_APERTURA").val();
                if( (wkApertura !== 'LISTA_CHIUSI' || $("#READONLY").val() === "N") ){
                    $("#lblTitolo").append("<span style='color: rgb(255, 255, 0);' id='lblAlertModifica'>MODIFICA</span>");
                    $('#lblAlertModifica').css({'position': 'absolute', 'right': '10px'});
                    $("#cmbMezzoArrivo").trigger("change");
                    $("#cmbModArrivo").trigger("change");
                    motivoIngresso.trigger("change");
                    //NS_DATI_AMMINISTRATIVI.gestAutoritaGiu(motivoIngresso.val());
                    //NS_DATI_AMMINISTRATIVI.gestMotivoIngresso(motivoIngresso.val());
                }

                break;
            default:
                logger.error("detectStatoPagina\n nessun stato pagina valido : " + stato_pagina);
                break;
        }
    },

    detectBaseUser: function () {
        var butSalva = $("button.butSalva");
        var TipoPersonale = home.baseUser.TIPO_PERSONALE;
        var statoContatto = $("#hStatoContatto").val();
        var utenteDimissione = $("#hUtenteDimissione").val();
        var diff_ora_chiusura = $("#hOreDiffChiusura").val();
        //da lista aperti non si possono + modificare i dati amministrativi
        var wkApertura = $("#WK_APERTURA").val();

        //if( wkApertura == 'LISTA_CHIUSI' || wkApertura == 'LISTA_OBI' || ($("#READONLY").val()==="S" && (wkApertura == 'LISTA_CHIUSI' || wkApertura == 'LISTA_OBI'))){
        if( (wkApertura === 'LISTA_CHIUSI' || wkApertura === 'LISTA_OBI' || ($("#READONLY").val()==="S" && (wkApertura === 'LISTA_CHIUSI' || wkApertura === 'LISTA_OBI'))) && (!home.basePermission.hasOwnProperty("SUPERUSER") || (wkApertura === "LISTA_CHIUSI" && $("#READONLY").val() === "S"))){
            butSalva.hide();
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
            $("input, textarea").attr("readonly","readonly");
            $("select").attr("disabled","disabled");
            $(".CBpuls, button,  span").off("click");
            $(".tdLbl").removeClass("clickToOggi").off().unbind().removeAttr("id");
            $(".tdData").find("script").remove();

        }
        else if(wkApertura === 'LISTA_APERTI') {


            if ((parent.$("#UTENTE_RESPONSABILE").val()  !== home.baseUser.IDEN_PER)) {

                butSalva.hide();
                home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
                $("input, textarea").attr("readonly", "readonly");
                $("select").attr("disabled", "disabled");
                $(".CBpuls, button,  span").off("click");
                $(".tdLbl").removeClass("clickToOggi").off().unbind().removeAttr("id");
                $(".tdData").find("script").remove();
            }
        }

        else{

            switch (TipoPersonale) {
                case 'OST':
                case 'A':
                case 'I':
                    if(statoContatto==="DISCHARGED"){
                        butSalva.hide();
                    }else{
                        $("body").on("click", function () {home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";});
                    }
                    break;

                case 'M':
                    if (statoContatto==="ADMITTED") {
                        $("body").on("click", function() {
                            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";
                        });
                    }
                    else if( (statoContatto==="DISCHARGED") && ((home.baseUser.IDEN_PER==utenteDimissione) && (diff_ora_chiusura<home.baseGlobal["cartella.tempo_manutenzione.cartella_chiusa"])) || (home.basePermission.hasOwnProperty("SUPERUSER")))
                    {
                        $("body").on("click", function() {
                            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";
                        });
                    }
                    else
                    {
                        butSalva.hide();
                    }
                    break;
                default:
                    logger.error("NS_TRIAGE.detectBaseUser : baseuser is undefined or have a wrong value = " + TipoPersonale);
                    break;
            }
        }


    },

    event: function () {
        $("#txtAnno, #txtProgressivoMissione").on("blur", NS_DATI_AMMINISTRATIVI.valorizeCodice118);

        $("#txtProgressivoMissione").on("change", NS_DATI_AMMINISTRATIVI.valorizeCodice118).on("paste", NS_DATI_AMMINISTRATIVI.valorizeCodice118);

        $("#cmbMotivoIngresso").on("change", function () {NS_DATI_AMMINISTRATIVI.gestAutoritaGiu(this.value);});

        //$("form").on("click", function () {home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";});

        $("#txtOraEvento").on("blur change",NS_DATI_AMMINISTRATIVI.cheOraEvento);

        $("#txtDataEvento").on("blur change",NS_DATI_AMMINISTRATIVI.checkDataEvento);

        $("#lblDataEvento").on("click",NS_DATI_AMMINISTRATIVI.gestDataEvento);

        $("#chkAltraCentrale_ALTRA_CENTRALE").on("click", function () {
            var isChecked = $(this).hasClass("CBpulsSel");
            NS_DATI_AMMINISTRATIVI.svuotaTendina(isChecked);
        });


    },
    /**
     * Dal codice che inserisce l'infermiere in txtProgressivoMissione si aggiunge l'anno e tutti gli zeri che servono
     * per aver un numero di 16 cifre
     */
    valorizeCodice118: function () {
        var anno = document.getElementById('txtAnno').value;
        var codiceMissione = document.getElementById('txtProgressivoMissione').value;
        var lungComplementare = 12 - codiceMissione.length; //12 meno il codice che inserisco
        var i = 0;
        var codice_completo = anno;

        while (lungComplementare > i) {
            codice_completo += 0;
            i++;
        }
        codice_completo += codiceMissione;
        if (codice_completo.length === 16) {
            document.getElementById('txtCodiceMissione').value = codice_completo;
        } else {
            logger.error("codice completo missione 118 non di 16 caratteri");
        }
    },
    /**
     * Valorizzo Onere solo per pazienti del Servizio Sanitario Nazionale
     * @param idenComuneResidenza
     */
    valorizeOnere : function(idenComuneResidenza){

        var codRegioneResidenza = idenComuneResidenza.substring(0,3);

        if(codRegioneResidenza === "999"){
            //paziente straniero
            $("#cmbOnere").find("option[value='1']").remove();
        }else{
            //paziente del SSN
            $("#cmbOnere").val("1");
        }
    },

    gestDataEvento: function(){
        var dataEvento = $('#lblDataEvento');
        dataEvento.addClass("clickToOggi");
        var datapicker = $("#txtDataEvento").data('Zebra_DatePicker');
        datapicker.setDataIso(DATE.getOggiYMD());
        NS_DATI_AMMINISTRATIVI.checkDataEvento();
    },
    /**
     * controlli pre-salvataggio
     * @returns {boolean}
     */
    beforeSave: function () {

        var mezzoArrivo = $("#cmbMezzoArrivo").val();
        var cod_dec_centrale_operativa = $("#hCodDecCentraleOperativa").val();

        if (($("#cmbModArrivo").val() === cod_dec_centrale_operativa) && (mezzoArrivo === "01" || mezzoArrivo === "06") && ($("#txtCodiceMissione").val().length !== 16)) {
            home.NOTIFICA.error({message: "Errore, il progressivo missione deve essere 12 caratteri", title: "Campo obbligatorio"});
            return false;
        }else{
            return true;
        }
    },



    checkDataEvento: function(){

        /** Recupero i valori che mi servono per effettuare i controlli **/
        var CampoDataEvento = $("#txtDataEvento");
        var CampoOraEvento = $('#txtOraEvento');
        var dataIngresso = $('#h-txtDataIngresso').val();
        var dataEvento = $('#h-txtDataEvento').val();

        /** Effettuo i controlli **/

        /** Controllo effettuato quando data evento è obbligatoria **/
        if (CampoDataEvento.val() !== '' && (CampoDataEvento.hasClass('tdObb') || CampoDataEvento.hasClass('tdError')))
        {

            if (( dataEvento < 19000000 || dataEvento > dataIngresso) && dataEvento !== 0){
                home.NOTIFICA.error({message: "Data selezionata non corretta", title: "Error"});
                NS_DATI_AMMINISTRATIVI.alertData(CampoDataEvento);
                $('.butSalva').hide();
            }
            else{
                if( CampoOraEvento.val() !== ''){
                    NS_DATI_AMMINISTRATIVI.cheOraEvento();
                }
                CampoDataEvento.removeClass("tdError");
                CampoDataEvento.addClass("tdObb");
                $('.butSalva').show();
            }
        }

        /** Controllo effettuato quando data evento non è obbligatoria **/
        else if(!(CampoDataEvento.hasClass('tdObb')) )
        {
            if(CampoDataEvento.val() === '' && CampoOraEvento.val() !== '')
            {
                home.NOTIFICA.error({message: "Inserire data", title: "Error"});
                NS_DATI_AMMINISTRATIVI.alertData(CampoDataEvento);
                $('.butSalva').hide();
            }

            else if(CampoDataEvento.val() !== ''  && (dataEvento < 19000000 || dataEvento > dataIngresso))
            {

                home.NOTIFICA.error({message: "Inserire data", title: "Error"});
                NS_DATI_AMMINISTRATIVI.alertData(CampoDataEvento);
                $('.butSalva').hide();
            }

            else
            {
                if( CampoOraEvento.val() !== ''){
                    NS_DATI_AMMINISTRATIVI.cheOraEvento();
                }

                //$('.butSalva').show();
            }

        }
    },

    cheOraEvento: function(){

        /** Recupero i valori che mi servono per effettuare i controlli **/
        var CampoDataEvento = $("#txtDataEvento");
        var CampoOraEvento = $('#txtOraEvento');
        var dataIngresso = $('#h-txtDataIngresso').val();
        var dataEvento = $('#h-txtDataEvento').val();

        var oraEventoHH = $('#txtOraEvento').val().substring(0,2);
        var oraEventoMM = $('#txtOraEvento').val().substring(3,5);
        var oraEvento = Number(oraEventoHH + oraEventoMM);

        var oraIngressoHH = $('#txtOraIngresso').val().substring(0,2);
        var oraIngressoMM = $('#txtOraIngresso').val().substring(3,5);
        var oraIngresso = Number(oraIngressoHH + oraIngressoMM);


        /** Effettuo i controlli **/

        /** Controllo effettuato quando ora evento è obbligatoria **/

        if (CampoOraEvento.hasClass('tdObb') || CampoOraEvento.hasClass('tdError')) {

            /*if (oraEvento == '') {

             home.NOTIFICA.error({message: "Inserire ora", title: "Error"});
             NS_DATI_AMMINISTRATIVI.alertOra(CampoOraEvento);
             $('.butSalva').hide();
             }*/

            if ( (CampoOraEvento.val().length < 5 && CampoOraEvento.val().length !== 0 )){

                if(CampoOraEvento.val().length === 2){
                    var value = CampoOraEvento.val();
                    CampoOraEvento.val(value + ':00');
                }
                else{
                    home.NOTIFICA.error({message: "Inserire ora", title: "Error"});
                    NS_DATI_AMMINISTRATIVI.alertOra(CampoOraEvento);
                    $('.butSalva').hide();
                }
            }
            else if
                ((dataEvento === dataIngresso) && (oraEvento > oraIngresso) ) {
                home.NOTIFICA.error({message: "Ora selezionata non corretta", title: "Error"});
                NS_DATI_AMMINISTRATIVI.alertOra(CampoOraEvento);
                $('.butSalva').hide();
            }
            else if (oraEvento <= oraIngresso || (CampoOraEvento.val().length < 5 && CampoOraEvento.val().length !== 0 )) {
                CampoOraEvento.removeClass("tdError");
                CampoOraEvento.addClass("tdObb");
                $('.butSalva').show();

            }

            else {
                CampoOraEvento.removeClass("tdError");
                CampoOraEvento.addClass("tdObb");
                $('.butSalva').show();
            }

        }

        else if (!CampoOraEvento.hasClass('tdObb')) {

            if((CampoOraEvento.val().length < 5 && CampoOraEvento.val().length !== 0 )){
                if(CampoOraEvento.val().length === 2){
                    var value = CampoOraEvento.val();
                    CampoOraEvento.val(value + ':00');
                }
                else{
                    home.NOTIFICA.error({message: "Inserire ora", title: "Error"});
                    NS_DATI_AMMINISTRATIVI.alertOra(CampoOraEvento);
                    $('.butSalva').hide();
                }

            }

            else if (CampoDataEvento.val() !== ''   && (dataEvento === dataIngresso) && (oraEvento > oraIngresso) ) {

                home.NOTIFICA.error({message: "Inserire ora", title: "Error"});
                NS_DATI_AMMINISTRATIVI.alertOra(CampoOraEvento);
                $('.butSalva').hide();
            }
            else {
                CampoOraEvento.removeClass("tdError");
                $('.butSalva').show();


            }


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

    /**
     * gestisce i cambiamenti del motivo ingresso, da cui dipende l'obbligatorieta' di altri parametri
     * @param value
     */
    /*gestMotivoIngresso: function (value) {
     var autoritaIntervenuta = $("#radIntAutoritaGiu_S");
     //var catenaCustodia = $("#chkCatena_CATENA_CUSTODIA");
     //var hCatena = $("#h-chkCatena");

     //h-chkIntAutoritaGiu
     var hAutorita = $("#h-radIntAutoritaGiu");
     switch (parseInt(value)) {
     case 5:   //incidente stradale
     case 16:  //incidente stradale + infortunio sul lavoro
     autoritaIntervenuta.addClass("RBpulsSel");
     //catenaCustodia.addClass("CBpulsSel");
     //hCatena.val("CATENA_CUSTODIA");
     hAutorita.val("S");
     break;
     default:
     autoritaIntervenuta.removeClass("RBpulsSel");
     //catenaCustodia.removeClass("CBpulsSel");
     //hCatena.val("");
     hAutorita.val("");
     break;
     }
     NS_DATI_AMMINISTRATIVI.gestAutoritaGiu(value);
     },*/

    setTraumaUstione: function(value){

        if( value === '16' || value === '02'){

            $("#cmbProbPrinc").find("option[value='10']").attr("selected","selected");
        }
        else{
            $("#cmbProbPrinc").find("option").removeAttr("selected");
        }
    },

    gestAutoritaGiu : function (value) {
        /*
         VIOLENZA ALTRUI	04
         INCIDENTE STRADALE	05
         INCIDENTE STRADALE+INFORTUNIO SUL LAVORO	16
         */

        var chkAutoritaGiu =  $('#chkIntAutoritaGiu');

        if((value === '04'||value === '05'||value === '16'||value==='07'||value==='13' )&& !chkAutoritaGiu.find('div').hasClass('CBpulsSel'))
        {
            chkAutoritaGiu.find('div').trigger("click");
        }
        else if((!(value === '04'||value === '05'||value === '16'||value==='07'||value==='13' ) && chkAutoritaGiu.find('div').hasClass('CBpulsSel')))
        {
            chkAutoritaGiu.find('div').trigger("click");

            if($('#cmbAutorita').hasClass('tdObb')){
                $('#cmbAutorita').removeClass('tdObb');
            }
        }
        else if((value === '04'||value === '05'||value === '16'||value==='07'||value==='13' )&& chkAutoritaGiu.find('div').hasClass('CBpulsSel'))
        {
            $('#cmbAutorita').addClass('tdObb');
        }

        NS_DATI_AMMINISTRATIVI.setTraumaUstione(value);



    },

    setDatePicker : function(){
        var dataIngresso = $('#txtDataIngresso').val();
        $('#txtDataEvento').Zebra_DatePicker({
            startWithToday:false,
            readonly_element: false,
            format : 'd/m/Y',
            direction: ['01/01/1970',dataIngresso],
            start_date: dataIngresso

        });
    },
    /**
     * Al salvataggio andato a buon fine appare una scritta per avvisare l'utente
     * @param {Objcet} message
     */
    successSave: function (message) {
        logger.info(JSON.stringify(message));

        var completato = $("#lblAlertCompleto");

        if (completato.length > 0){
            completato.remove();
        }
        $('#lblAlertModifica').remove();
        $("#lblTitolo").append("<span style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</span>");
        completato.css({'position': 'absolute', 'right': '10px'});

        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";

        home.CARTELLA.jsonData.H_STATO_PAGINA.INTERVISTA = 'E';

        home.CARTELLA.NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.dataIngresso = $('#h-txtDataIngresso').val() + $("#txtOraIngresso").val().replace(':','');
        home.CARTELLA.NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.problemaPrincipale = $("#cmbProbPrinc").find("option:selected").val();

        home.CARTELLA.NS_INFO_ESAME.showInfoEsame();

    } ,
    koSalva : function (params, response){


        if(response.message)
        {
            home.NOTIFICA.error({message: response.message, title: traduzione.errorTitleSave});
            logger.error("errorHandler -> " + response.message);
        }
        else
        {
            home.NOTIFICA.error({message: response, title: traduzione.errorTitleSave});
            logger.error("errorHandler -> " + response);
        }

        LIB.checkParameter(params,'errorSave',NS_FENIX_SCHEDA.errorSave);
        params.errorSave(response);

        LIB.checkParameter(params,'afterSave',NS_FENIX_SCHEDA.afterSave);
        if(!params.afterSave()) logger.error("NS_FENIX_SCHEDA.afterSave");

        NS_FENIX_SCHEDA.setRegistraEvent();
    },
    registra:function () {
        var parametri = {
            datasource : 'PS',
            id : 'PS.Q_PROGRESSIVO_MISSIONE',
            params : {
                iden_contatto : {v : $("#IDEN_CONTATTO").val()},
                codice_missione : { v: $("#txtCodiceMissione").val()}
            },
            callbackOK : callbackOk
        };

        NS_CALL_DB.SELECT(parametri);

        function callbackOk(resp) {

            var conto = parseInt(resp.result[0].CONTO);

            if(conto >= 3)
            {
                home.NOTIFICA.error( {message: "Attenzione sono gia' presenti 3 progressivi missione uguali a quello inserito" , title : 'Error', timeout : 7});
            }
            else if (conto === 2 )
            {
                home.DIALOG.si_no({
                    title: "Progressivo Missione",
                    msg:"Sono gia' presenti 2 progressivi missione uguali. Si desidera procedere?",
                    cbkNo:function(){  },
                    cbkSi: function(){
                        NS_DATI_AMMINISTRATIVI.registra_();

                    }
                });
            }
            else if (conto === 1 )
            {
                home.DIALOG.si_no({
                    title: "Progressivo Missione",
                    msg:"E' gia' presente un progressivo missione uguale. Si desidera procedere?",
                    cbkNo:function(){  },
                    cbkSi: function(){
                        NS_DATI_AMMINISTRATIVI.registra_();

                    }
                });
            }
            else if (conto === 0 )
            {
                NS_DATI_AMMINISTRATIVI.registra_();

            }

        }

    },

    apriWkCodiciMissione : function(){
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=WK_CODICI_MISSIONE&STATO_PAGINA=E&IDEN_CONTATTO=' + $("#IDEN_CONTATTO").val() +'&ID_WK=WK_CODICI_MISSIONE' ,fullscreen:true});
    },

    svuotaTendina : function (isChecked){
        var $cmbCodIdentificativo =$("#cmbCodIdentificativo");
        var cmbMezzoArrivo = $("#cmbMezzoArrivo").find("option:selected").val();
        //se è checkato rimuovi tutto
        if(isChecked){
            $cmbCodIdentificativo.find("option:selected").removeAttr("selected");
            $cmbCodIdentificativo.removeClass("tdObb");
            NS_DATI_AMMINISTRATIVI.validator.removeStatus($cmbCodIdentificativo);
        }else{

            if(cmbMezzoArrivo === '01' || cmbMezzoArrivo === '04' || cmbMezzoArrivo === '06'){
                $cmbCodIdentificativo.addClass("tdObb");
                NS_DATI_AMMINISTRATIVI.validator._attachStatus($cmbCodIdentificativo, {"status": "required"});

            }
        }

    },

    valorizzaDatiMissione : function(associazioneMissione){
        var cmbModArrivo = $("#cmbModArrivo");
        var cmbMezzoArrivo = $("#cmbMezzoArrivo");

        if("" === cmbModArrivo.val()){
            //valorizzo con "CENTRALE OPERATIVA 118"
            cmbModArrivo.find("option[value='13']").prop('selected', true);
            cmbModArrivo.trigger("change");
        }

        if("" === cmbMezzoArrivo.val()){
            //valorizzo con "AMBULANZAs 118"
            cmbMezzoArrivo.find("option[value='01']").prop('selected', true);
            cmbMezzoArrivo.trigger("change");
        }

        $("#hIdenMissione").val(associazioneMissione.iden);
        $("#cmbTriageAcc").find("option[data-class='" + associazioneMissione.urgenza.codice+"']").prop('selected', true);
        $("#txtAnno").val(associazioneMissione.codiceMissione.anno);
        $("#txtProgressivoMissione").val(associazioneMissione.codiceMissione.progressivo);
        NS_DATI_AMMINISTRATIVI.valorizeCodice118();
    },

    /**
     * Disassocia la missione precedentemente selezionata
     * @returns {undefined}
     */
    disassociaMissione:function(){
        $("#hIdenMissione").val("");
        $("#cmbTriageAcc").find("option:selected").prop('selected', false);
        $("#cmbCodIdentificativo").find("option:selected").prop('selected', false);
        $("#txtAnno").val("");
        $("#txtProgressivoMissione").val("");
        $("#txtCodiceMissione").val("");
    }

};
