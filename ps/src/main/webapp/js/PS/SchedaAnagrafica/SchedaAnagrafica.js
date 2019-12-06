/**
 * User: matteopi
 * Date: 04/02/14
 * Time: 11.42
 */
jQuery(document).ready(function () {
    //tolto in quanto vuoto e va in conflitto con l'avviso per l'anagrafica certificata e l'associazione col codice missione
    $('#lblTitolo').remove();
    
    NS_ANAGRAFICA.detectStatoPagina();
    NS_ANAGRAFICA.detectPazRiconosciuto();
    NS_ANAGRAFICA.init();
    NS_ANAGRAFICA.event();
    NS_FENIX_SCHEDA.registra = NS_ANAGRAFICA.registra;
    NS_ANAGRAFICA_SALVATAGGIO.beforeSave = NS_ANAGRAFICA.beforeSave;
    /*NS_FENIX_SCHEDA.successSave = NS_ANAGRAFICA.successSave;*/
    NS_ANAGRAFICA_SALVATAGGIO.successSave = NS_ANAGRAFICA.successSave;
});

var NS_ANAGRAFICA = {

    stato_pagina : $("#STATO_PAGINA").val(),
    paz_sconosciuto : $("#PAZ_SCONOSCIUTO").val(),
    iden_anagrafica : $("#IDEN_ANAG").val(),
    wk_apertura : $("#WK_APERTURA").val(),
    buttonTriage : $("button.butTriage"),
    codice_fiscale : null,
    countEni : 0,
    countSTP : 0,
    countGiu : 0,
    btSalvaApri : $('.butSalvaApri').is(':visible'),
    btSalva : $('.butSalva').is(':visible'),
    isRiassocia: null,
    _JSON_CONTATTO :null,

    detectStatoPagina : function(){
        if((NS_ANAGRAFICA.stato_pagina==='E') &&(NS_ANAGRAFICA.paz_sconosciuto==='N')&&(!NS_ANAGRAFICA.hasAValue(NS_ANAGRAFICA.wk_apertura))) {
            NS_ANAGRAFICA.buttonTriage.on("click" , function(){ NS_ANAGRAFICA.apriTriage(); });
        }else if (NS_ANAGRAFICA.stato_pagina==='I' && NS_ANAGRAFICA.paz_sconosciuto !== 'S'){
            $('#txtCognome').val(home.NS_FENIX_PS.ricCognome.toUpperCase());
            $('#txtNome').val(home.NS_FENIX_PS.ricNome.toUpperCase());

        }
        else{
            NS_ANAGRAFICA.buttonTriage.hide();
        }
        //apertura da anagrafica
        if(typeof NS_ANAGRAFICA.wk_apertura  != 'undefined'){
            $(".butSalvaApri").hide();
            $('.butSalvaRiassocia').hide();
            NS_ANAGRAFICA.btSalvaApri = false;

        }

        else{
            $(".butTriage").hide();
            $(".butSalva").hide();
            $('.butSalvaRiassocia').hide();
            NS_ANAGRAFICA.btSalva = false;
        }
        if($("#READONLY").val()==="S"){
            $("input, textarea").attr("readonly","readonly");
            $("select").attr("disabled","disabled");
            $(".CBpuls, button,  span").off("click");
            $(".tdLbl").removeClass("clickToOggi").off().unbind().removeAttr("id");
            $(".tdData").find("script").remove();
            $("button.butSalva, button.butSalvaApri, button.butTriage").hide();
            $("div.RBpuls").off("click").attr("readonly","readonly");
            $('.butSalvaRiassocia').show();

        }

    },

    detectPazRiconosciuto : function(){
        var riconosciuto = $("#hRiconosciuto").val();

        if(NS_ANAGRAFICA.hasAValue(riconosciuto) && jsonData.readonly == 'N'){
            $("div.headerTabs").append("<label style='color: rgb(255, 255, 0);font-size:18px' id='lblAvviso'>Paziente riconosciuto dalla regione</label>");
            $("#txtNome, #txtCognome, #txtDataNasc, #txtCodFisc, #txtLuogoNasc").attr("disabled","disabled");
            $("#radSesso").data("RadioBox").disable();
            $("#lblLuogoNasc").off("click");
            $("#txtCognome, #txtNome, #txtDataNasc, #h-radSesso, #txtLuogoNasc").off("change");

        }
    },

    hasAValue : function(value){
        return (("" !== value)&&(undefined !== value)&&(null !== value));
    },

    init : function () {
        
        if(home.NS_FENIX_TOP.associazioneMissione){
            $('.headerTabs').prepend(home.NS_FENIX_TOP.associazioneMissione.getWidget(window));
        }
        
        //NS_ANAGRAFICA.setCssTab();
        NS_ANAGRAFICA.hideCodSTP();
        NS_ANAGRAFICA.hideCodENI();
        NS_ANAGRAFICA.hideCodGIU();
        /*
        if(NS_ANAGRAFICA.paz_sconosciuto==='S'){
            V_PS_ANAGRAFICA.elements["txtDataNasc"] = {};
        }
*/
        if(NS_ANAGRAFICA.paz_sconosciuto == 'S'){
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA_SCONOSCIUTO"});
        }
        else{
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA"});
        }

        if(NS_ANAGRAFICA.paz_sconosciuto==='S'){NS_ANAGRAFICA.prepareToPazUnknow()}
        NS_ANAGRAFICA.addPlusButton();
        if(NS_ANAGRAFICA.paz_sconosciuto!=='S'){NS_ANAGRAFICA.codice_fiscale = NS_ANAGRAFICA.getCodiceFiscale()}
        NS_ANAGRAFICA_SALVATAGGIO.codice_fiscale = NS_ANAGRAFICA.codice_fiscale;
        NS_ANAGRAFICA_SALVATAGGIO.paz_sconosciuto = NS_ANAGRAFICA.paz_sconosciuto;
        NS_ANAGRAFICA.initObbligoResidenza();
        NS_ANAGRAFICA_SALVATAGGIO.IDEN_ANAGRAFICA = $("#IDEN_ANAG").val();

        $("#txtDataNasc").parent().find(".Zebra_DatePicker_Icon").hide();
        $("#txtDataMorte").attr("readonly","readonly").parent().find(".Zebra_DatePicker_Icon").hide();
        NS_ANAGRAFICA.hideDataMorte();
        NS_ANAGRAFICA.checkDecesso();



        logger.error('WK_APERTURA ->  ' + NS_ANAGRAFICA.wk_apertura);
        if(NS_ANAGRAFICA.wk_apertura == 'CONSOLE'){
            NS_ANAGRAFICA._JSON_CONTATTO =  NS_DATI_PAZIENTE.getDatiContattobyIden($("#IDEN_CONTATTO").val(), {assigningAuthorityArea: 'ps'});
            NS_ANAGRAFICA.valorizeDatiFormMetadati();
        }
        else if (NS_ANAGRAFICA.wk_apertura === 'CARTELLE_INAIL'){
            NS_ANAGRAFICA._JSON_CONTATTO =  NS_DATI_PAZIENTE.getDatiContattobyIden($("#IDEN_CONTATTO").val(), {assigningAuthorityArea: 'ps'});
            NS_ANAGRAFICA.valorizeDatiFormMetadati();
            $(".butTriage").remove();
            $(".butSalva").remove();
            $('.butSalvaRiassocia').remove();
            NS_ANAGRAFICA.btSalva = false;
        }
        else{

            if(NS_ANAGRAFICA.wk_apertura==="VERBALE" && (NS_ANAGRAFICA.paz_sconosciuto!=="S")){
                NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA"})._attachStatus($("#txtStatoCivile, #txtTitoloStudio"), {"status": "required"});

                $.dialog("Per il ricovero sono obbligatori anche i campi titolo di studio e stato civile.", {
                    title: "Attenzione",
                    buttons: [
                        {label: "OK", action: function () {
                            $.dialog.hide();
                        }}
                    ]
                });
            }

            var keyParentFrame = parent.$(".iScheda")[0].contentWindow.$('#KEY_LEGAME').val();
            if (keyParentFrame == 'RIASSOCIA_PAZIENTE'){
                $('.butSalvaApri').hide();
                $('.butSalva').hide();
                $('.butSalvaRiassocia').show();
                NS_ANAGRAFICA.isRiassocia = true;

            }
            NS_ANAGRAFICA.valorizeCittadinanza();
            NS_ANAGRAFICA.valorizeDatiResidenzaInit()
        }

    },

    event: function () {
        $("button.butChiudi").on("click" , function(){ NS_ANAGRAFICA.close(); });
        $(document).on("click",".plus", function (/*e*/) {
            //e.preventDefault();  // if you want to prevent default form submission
            NS_ANAGRAFICA.hideCittadinanza();
        });
        $("#lblCodFisc").on("click", NS_ANAGRAFICA.gestisciCodiceFiscale).css({"cursor":"pointer","text-decoration":"underline", "hover":"color:blueviolet"});
        $('#txtDataNasc').on("blur", function() {
            var clicked = '';
            NS_ANAGRAFICA.checkData(clicked);


        })

        //$('#txtComuneRes').on("blur", function(){NS_ANAGRAFICA.getAslResidenza();});
        $(".butSalvaApri").on("click", function() {
            NS_ANAGRAFICA_SALVATAGGIO.successSave = NS_ANAGRAFICA.apriTriage;
            NS_ANAGRAFICA.registra();
            });

        $('.butSalvaRiassocia').on('click', function(){
            NS_ANAGRAFICA.registra();
        });

        $("#txtCognome, #txtNome, #txtDataNasc, #h-radSesso, #txtLuogoNasc").on("blur change", function(){
                if(NS_ANAGRAFICA.paz_sconosciuto!=='S'){
                    NS_ANAGRAFICA.gestModificaCodFisc();
                }
        });

        //$('.AUTOCOMPLETECITTADINANZA').on('change', NS_ANAGRAFICA.checkCittadinanza);

        $("#txtcodSTP, #txtcodENI, #txtcodGIU").on("blur",function(e){
            $(this).val($(this).val().toUpperCase());
            NS_ANAGRAFICA.checkENISTP($(this),e)
        });

        $("#txtCAPRes, #txtCAPDom").on('change', function(){NS_ANAGRAFICA.checkCap($(this))});

        //$('#txtCitt0').on('change blur', function(){NS_ANAGRAFICA.checkTelefonoObb()});

    },

    valorizeDatiResidenzaInit: function(){
        var comuneRes = $('#txtComuneRes').val();
      //  var provRes = $("#txtProvRes").val();
        var capRes = $("#txtCAPRes").val();
        var codRegRes = $("#txtCodRegRes").val();
        var ASLResidenza = $("#txtASLResidenza").val();
        var hASLResidenza = $("#h-txtASLResidenza").val();
        if(comuneRes !== '' && (capRes === ''|| codRegRes === '' || ASLResidenza === '' || hASLResidenza === '')) {

            function callbackOk(data) {
                if (data.result[0]) {
                    data = data.result[0];
                    NS_ANAGRAFICA.getCapRegioneProvincia(data, 'RESIDENZA');

                }
            }

            var params = {
                descr: {t: "V", v: comuneRes}
            };

            var parametri = {
                "datasource": "PS",
                id: "AUTOCOMPLETE.AC_ANAG_COMUNE",
                "params": params,
                "callbackOK": callbackOk
            };

            NS_CALL_DB.SELECT(parametri);

        }
    },

    addPlusButton:function(){
        $('.divPlus').each(function(){
            $(this).append(document.createElement('a')).html("<i class='icon-plus-squared plus' title='Aggiungi cittadinanza'>");
        });
    },

    hideDataMorte: function(){
        var dataMorte = $('#txtDataMorte');

        if(dataMorte.val() === ''){
            dataMorte.hide();
            $('#lblDataMorte').hide();
        }


    },

    checkDecesso:function(){
        var campoDataMorte = $('#txtDataMorte');

        if(campoDataMorte.is(':visible')) {
            NS_ANAGRAFICA.buttonTriage.hide();
            $('.butSalvaApri').hide();
            $('.butSalva').show();
        }
    },

    /*checkTelefonoObb: function(){
        var citt = $('#txtCitt0').val();

        if ( citt !== 'ITALIA' ){
            V_PS_ANAGRAFICA.elements["txtTelRes"].status = null;
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA"});
        }
        else{
            V_PS_ANAGRAFICA.elements["txtTelRes"].status = 'required';
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA"});
        }

    },*/
    prepareToPazUnknow:function(){
        $("#txtTitoloAnag," +
            "#txtCognome, " +
            "#txtNome," +
            "#txtDataNasc," +
            "#txtLuogoNasc, " +
            "#txtCodFisc, " +
            "#txtIDpaz," +
            "#txtStatoCivile," +
            "#txtTitoloStudio," +
            "#txtCodReg," +
            "#txtCitt," +
            "#txtMedBase," +
            "#txtUSLAss," +
            "#txtProf," +
            "#txtMail," +
            "#txtDataDec").attr("disabled","disabled");
    },

    checkENISTP:function(_this,e){
        var text = _this.val();

        var patt = "";
        if (_this.attr("id") == 'txtcodSTP'){
            patt = new RegExp("^STP[0-9]{13}$");
        }else if (_this.attr("id") == 'txtcodENI'){
            patt = new RegExp("^ENI[0-9]{13}$");
        }else if (_this.attr("id") == 'txtcodGIU'){
            patt = new RegExp("^GIU[0-9]{13}$");
        }

        if(text.length == 0 || patt.test(text) ) {
            _this.removeClass("tdError");
            _this.addClass("tdObb");
            if(!NS_ANAGRAFICA.btSalvaApri) {
                $('.butSalvaApri').show();
                NS_ANAGRAFICA.btSalvaApri = true;
            }
            if(!NS_ANAGRAFICA.btSalva) {
                $('.butSalva').show();
                NS_ANAGRAFICA.btSalva = true;
            }
           // NS_ANAGRAFICA.detectStatoPagina();

        }else{

            _this.focus();
            _this.addClass("tdError");
            _this.removeClass("tdObb");
            home.NOTIFICA.error({message: "Errore nel codice inserito, verificare prego", title: "Error"});
            if(NS_ANAGRAFICA.btSalvaApri) {
                $('.butSalvaApri').hide();
                NS_ANAGRAFICA.btSalvaApri = false;

            }
            if(NS_ANAGRAFICA.btSalva) {

                $('.butSalva').hide();
                NS_ANAGRAFICA.btSalva = false;
            }
            e.preventDefault();
            e.stopPropagation();
        }

    },
    checkCittadinanza: function(){
        var check = '';

        $('.AUTOCOMPLETECITTADINANZA input:visible').each(function(){

            if($(this).attr('data-c-value') == '651'){check='S'}
        });

        if(check != 'S'){

            V_PS_ANAGRAFICA.elements["txtIndRes"].status = null;
            V_PS_ANAGRAFICA.elements["txtCAPRes"].status = null;
            V_PS_ANAGRAFICA.elements["txtCodRegRes"].status = null;
      //      V_PS_ANAGRAFICA.elements["txtASLResidenza"].status = null;

        }
        else if(check == 'S'){

            V_PS_ANAGRAFICA.elements["txtIndRes"].status = 'required';
            V_PS_ANAGRAFICA.elements["txtCAPRes"].status = 'required';
            V_PS_ANAGRAFICA.elements["txtCodRegRes"].status = 'required';
       //     V_PS_ANAGRAFICA.elements["txtASLResidenza"].status = 'required';

        }

        if(NS_ANAGRAFICA.paz_sconosciuto == 'S'){
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA_SCONOSCIUTO"});
        }
        else{
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA"});
        }
    },


    checkData : function(){


            var today = moment().format("YYYYMMDD");
            var campoDataNasc = $("#txtDataNasc");
            var dataNasc = $('#h-txtDataNasc');
            var tDate = moment(dataNasc.val(),"YYYYMMDD").format("YYYYMMDD");


            if (tDate < 19000101 && tDate != '' || tDate > today ) {
                home.NOTIFICA.error({message: "Data selezionata non corretta", title: "Error"});
                $('.butSalva').hide();
                dataNasc.val("");
                NS_ANAGRAFICA.alertData(campoDataNasc);

            }

            else {
                campoDataNasc.removeClass("tdError");
                campoDataNasc.addClass("tdObb");

                var keyParentFrame = parent.$(".iScheda")[0].contentWindow.$('#KEY_LEGAME').val();
                if (keyParentFrame !== 'RIASSOCIA_PAZIENTE'){
                    $('.butSalva').show();
                }


            }

    },


    checkCap : function(el){
      if( (el.val().length !== 5 && el.val().length !== 0) || (isNaN(el.val() ))){
          NS_ANAGRAFICA.alertCap(el);
      }
       else{
          el.removeClass('tdError');
      }
    },

    alertData: function (t) {
        $.dialog("Data inserita non corretta",
            {title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {

                        t.val("");
                        t.removeClass("tdObb");
                        t.addClass("tdError");
                        $.dialog.hide();
                    }}
                ]
            }
        );
    },

    alertCap: function (t) {
        $.dialog("Cap inserito non corretto",
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


    beforeSave:function(){

        var codice_fiscale = $("#txtCodFisc").val();

        if(!NS_FENIX_SCHEDA.validateFields()){
            return false;
        } else   if(!(ns_controllo_cod_fisc.verificaCodiceFiscaleDefinitivo(codice_fiscale)) && NS_ANAGRAFICA.paz_sconosciuto != 'S'){
            home.NOTIFICA.error({message: "Attenzione errore di sintassi nel codice fiscale", title: "Error"});
            return false;
        }

        var arCampiMalCompilatiTEXT = [];
        var arCampiMalCompilatiID = [];

        if (NS_ANAGRAFICA_SALVATAGGIO.jsonDati.stato_civile.length < 1) {
            arCampiMalCompilatiTEXT.push("Stato Civile");
            arCampiMalCompilatiID.push("txtStatoCivile");
        }

        if (NS_ANAGRAFICA_SALVATAGGIO.jsonDati.comune_residenza.length < 1) {
            arCampiMalCompilatiTEXT.push("Comune Residenza");
            arCampiMalCompilatiID.push("txtComuneRes");
        }

        if (NS_ANAGRAFICA_SALVATAGGIO.jsonDati.livello_istruzione.length < 1) {
            arCampiMalCompilatiTEXT.push("Livello Istruzione");
            arCampiMalCompilatiID.push("txtTitoloStudio");
        }

        if (NS_ANAGRAFICA_SALVATAGGIO.jsonDati.comune_nascita.length < 1) {
            arCampiMalCompilatiTEXT.push("Comune Nascita");
            arCampiMalCompilatiID.push("txtLuogoNasc");
        }

        if (arCampiMalCompilatiTEXT.length > 0 &&  NS_ANAGRAFICA.paz_sconosciuto!=='S'){

            for (var i = 0; i < arCampiMalCompilatiID.length; i++){
                $("#" + arCampiMalCompilatiID[i]).closest("TD").addClass("tdError");
            }
            home.NOTIFICA.error({message: "Errore nella lettura dei campi da salvare. Ricompilare i campi: " + arCampiMalCompilatiTEXT, title: "Error"});

            return false;
        }

        return true;
    },

    /**
     * Funzione per il salvataggio dei dati anagrafici
     */
    registra:function(){

            var cognome = $('#txtCognome').val();
            var nome = $('#txtNome').val();
            var data =   $("#h-txtDataNasc");
            data =  NS_ANAGRAFICA.hasAValue(data.val()) ? data.val() : moment().format('YYYYMMDD');
            var sesso = $("#h-radSesso").val();
            var comune_nascita = $("#h-txtLuogoNasc").val();
            var codice_fiscale = $("#txtCodFisc").val();
            var idRis = NS_ANAGRAFICA_SALVATAGGIO.IDEN_ANAGRAFICA;
            var indirizzoResidenza = $("#txtIndRes").val();
            var civicoResidenza = $("#txtCivRes").val();
            var comuneResidenza = $("#h-txtComuneRes").val();
            var provinciaResidenza = $("#txtProvRes").val(); 
            var capResidenza = $("#txtCAPRes").val();
            var indirizzoDomicilio = $("#txtIndDom").val();
            var civicoDomicilio = $("#txtCivDom").val();
            var comuneDomicilio = $("#h-txtComuneDom").val();
            var provinciaDomicilio = $("#txtProvDom").val();
            var capDomicilio = $("#txtCAPDom").val();
            var codRegRes = $("#txtCodRegRes").val();
            var codReg = $("#txtCodReg").val();
            var cusl_res = $("#h-txtASLResidenza").val();
            var codRegDom = $("#txtCodRegDom").val();
            var CUSL_DOM = $("#h-txtASLDomicilio").val();
            var medicoBase = $("#h-txtMedBase").val();
            var cellulare = $("#txtCellPaz").val();
            var mail = $("#txtMail").val();
            var statoCivile = $("#h-txtStatoCivile").val();
            var livelloIstruzione = $("#h-txtTitoloStudio").val();
            var professione = $("#h-txtProf").val();
            var cittadinanza = [];

            $(".AUTOCOMPLETECITTADINANZA").each(function () {
                var inputText = $(this).find('input[type="text"]');
                var value = inputText.val();
                var codice =   inputText.attr("data-c-value");

                if(value != '' && codice != '' &&  value != 'undefined' && codice != 'undefined') {
                    cittadinanza.push ({"codice" : codice , "descrizione":value })
                }
            });
            var txtSTP = $("#txtcodSTP");
            var txtENI = $("#txtcodENI");
            var txtGIU = $("#txtcodGIU");
            var stp = txtSTP.val() != '' ? txtSTP.val() : null ;
            var scadenzaSTP = $("#h-txtscadcodSTP").val();
            var scadenzaENI =  $("#h-txtscadcodENI").val();
            var eni = txtENI.val()  != '' ? txtENI.val() : null;
            var giubileo =  txtGIU.val() != '' ? txtGIU.val() : null ;
            var scadenzaGiubileo = $("#h-txtscadcodGIU").val();
            var tesseraSanitaria = $("#txtTesseraSanitaria").val();
            var scadTesseraSanitaria = $("#h-txtScadTesseraSanitaria").val();
            var telResidenza = $("#txtTelRes").val();

            var json = {
                codice_fiscale     : codice_fiscale,
                cognome            : cognome,
                sesso              : sesso,
                data_nascita       : data,
                nome               : nome,
                comune_nascita     : comune_nascita,
                indirizzo_residenza: indirizzoResidenza,
                civico_residenza   : civicoResidenza,
                comune_residenza   : comuneResidenza,
                provincia_residenza: provinciaResidenza,
                cap_residenza      : capResidenza,
                indirizzo_domicilio: indirizzoDomicilio,
                civicoDomicilio    : civicoDomicilio,
                comune_domicilio   : comuneDomicilio,
                provincia_domicilio: provinciaDomicilio,
                cap_domicilio      : capDomicilio,
                cod_reg_res        : codRegRes,
                cod_reg            : codReg,
                cod_asl_res        : cusl_res,
                cod_reg_dom        : codRegDom,
                cod_asl_dom        : CUSL_DOM,
                medico_base        : medicoBase,
                cellulare          : cellulare,
                mail               : mail,
                stato_civile       : statoCivile,
                livello_istruzione : livelloIstruzione,
                professione        : professione,
                cittadinanza       : cittadinanza,
                stp                : stp,
                scadenzaStp        : scadenzaSTP,
                eni                : eni,
                scadenzaENI        : scadenzaENI,
                giubileo           : giubileo,
                scadenzaGiubileo   : scadenzaGiubileo,
                tessera_sanitaria  : tesseraSanitaria,
                tessera_sanitaria_scadenza : scadTesseraSanitaria,
                telefono_residenza : telResidenza,
                url_template       : 'js/PS/SchedaAnagrafica/XMLAnagrafica.txt'

            };
            var pinAAC = $("#hRiconosciuto").val();
            if(pinAAC != '' && pinAAC != null){
                json.identificativoRemoto = pinAAC;
            }else{
                json.identificativoRemoto = '';
            }
            if(idRis != '' && idRis != null){
               json.idRis = idRis;
            }else{
                json.idRis = "";
            }


            NS_ANAGRAFICA_SALVATAGGIO.callback = function () {
                    if(NS_ANAGRAFICA.wk_apertura=='CONSOLE'){

                        NS_ANAGRAFICA_SALVATAGGIO.registraDatiAnagraficiContattoFromIDEN(Number($("#IDEN_CONTATTO").val()),NS_ANAGRAFICA_SALVATAGGIO.jsonDati);

                    }else{

                        function callbackOk(data){

                            var result = data.result[0];
                            //  alert(result);

                            if( data.result.length > 0){

                                NS_ANAGRAFICA_SALVATAGGIO.registraDatiAnagraficiContattoFromIDEN(Number(result.IDEN),NS_ANAGRAFICA_SALVATAGGIO.jsonDati);

                            } else{
                                NS_ANAGRAFICA_SALVATAGGIO.successSave();
                            }

                        }

                        var jsonParams = {
                            datasource : 'PS',
                            id :"PS.Q_CHECK_RICOVERO",
                            params : {iden_anagrafica : {t:'N', v: Number(NS_ANAGRAFICA_SALVATAGGIO.IDEN_ANAGRAFICA)} },
                            callbackOK : callbackOk
                        };

                        NS_CALL_DB.SELECT(jsonParams);


                }
            };
            if(NS_ANAGRAFICA.wk_apertura=='CONSOLE' && NS_ANAGRAFICA._JSON_CONTATTO.stato.codice == 'DISCHARGED' ){
                NS_ANAGRAFICA_SALVATAGGIO.registraDatiAnagraficiContattoFromJSON(NS_ANAGRAFICA._JSON_CONTATTO,json);
            }else{
                if(NS_ANAGRAFICA.stato_pagina == 'I'){
                    //controlla se in anagrafica c'è già un codice fiscale uguale
                    var parametri = {
                        datasource : 'WHALE',
                        params : {"COD_FISC": codice_fiscale},
                        callbackOK : callbackOk,
                        "id":"CCE.CHECKEXISTANAG"
                    };
                    /* datasource : <datasource>
                     *   id : <id della query da fare>
                     *   params : <parametri da passare alla query>
                     *   callbackOK : <funzione da eseguire alla fine della query>
                     *   callbackKO : <funzione da eseguire in caso di errore>
                     *   callbackAlways : <Funzione da eseguire in ogni caso>
                     *   type : <SELECT, FUNCTION, PROCEDURE>*/
                    NS_CALL_DB.SELECT(parametri);

                    function callbackOk (resp){

                        if(resp.result[0].HASCODFISC == 0) {
                            NS_ANAGRAFICA_SALVATAGGIO.registra(json)
                        }else{
                            home.NOTIFICA.error({message: "Attenzione codice fiscale gia' presente in anagrafica", title: "Error"});
                        }

                    }
                }else{
                    NS_ANAGRAFICA_SALVATAGGIO.registra(json)
                }
            }



    },

    successSave : function(){
        home.NS_LOADING.hideLoading();
        var keyParentFrame = parent.$(".iScheda")[0].contentWindow.$('#KEY_LEGAME').val();
        var ParentFrame = parent.$(".iScheda")[0].contentWindow;

        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblCompletato'>SALVATAGGIO COMPLETATO</h2>");

        home.NS_WK_PS.caricaWk();

        if(NS_ANAGRAFICA.isRiassocia){
            /** PRENDO I VALORI DALLA SCHEDA SOTTO IN MODO DA POTER CHIAMARE LA FUNZIONE**/
            var iden_contatto = ParentFrame.$('#IDEN_CONTATTO').val();
            var iden_ricovero = ParentFrame.$('#IDEN_RICOVERO').val();
            var codice_ricovero = ParentFrame.$('#CODICE_RICOVERO').val();

            var iden_pro = ParentFrame.$('#IDEN_PRO').val();
            var iden_cdc = ParentFrame.$('#IDEN_CDC').val();
            var iden_lista = ParentFrame.$('#IDEN_LISTA').val();
            var stato = ParentFrame.$('#STATO_CONTATTO').val();
            var chiuso = ParentFrame.$('#CHIUSO').val();
            var cognome = $("#txtCognome").val();
            //alert(iden_contatto + "\n" + iden_ricovero + "\n" + codice_ricovero + "\n" + iden_pro + "\n" + iden_lista + "\n" + stato + "\n" + chiuso + "\n" + iden_cdc + "\n" + cognome);

            if(NS_ANAGRAFICA.hasAValue(iden_contatto) /*&& NS_ANAGRAFICA.hasAValue(iden_ricovero) && NS_ANAGRAFICA.hasAValue(codice_ricovero)*/)
            {
                home.NS_FENIX_PS.associa(NS_ANAGRAFICA_SALVATAGGIO.IDEN_ANAGRAFICA,iden_contatto, cognome,iden_ricovero, codice_ricovero,iden_cdc,iden_pro,iden_lista,stato,chiuso);
                NS_FENIX_SCHEDA.chiudi();
            }
            else {
                logger.error("iden_contatto="+ iden_contatto + "\niden_ricovero=" + iden_ricovero + "\ncodice_ricovero=" + codice_ricovero);
            }

        }

        if(NS_ANAGRAFICA.stato_pagina == 'E'){
            NS_FENIX_SCHEDA.chiudi();
        }

        if(!NS_ANAGRAFICA.hasAValue(NS_ANAGRAFICA.wk_apertura)&& keyParentFrame !== 'RIASSOCIA_PAZIENTE'){
            NS_ANAGRAFICA.buttonTriage.show();
            NS_ANAGRAFICA.buttonTriage.on("click" , function(){ NS_ANAGRAFICA.apriTriage(); });
        }



    },

    /*setCssTab:function(){
     $("#li-tabCodiciEsterni, #li-tabEsami, #li-tabIndirizzi").hide();
     $("#li-tabAnamnesi").css({"border-top-right-radius" : "6px"});
     },*/

    /**
     * Funzione che mostra/nasconde i campi el STP (straniero temporaneamente presente)
     * E  inserisce codice e data di scadenza
     * */
    hideCodSTP:function(checkEni){
        var hasSTP = $("#h-radSTP").val();
        var hasENI = $("#h-radENI");
        var hasGIU = $("#h-radGIU");


        var txtSTP = $("#txtcodSTP");
        var txtScadSTP = $("#txtscadcodSTP");

    if(typeof checkEni != 'undefined' && checkEni == true && (hasENI.val() == 'S' || hasGIU.val()== 'S' ) && NS_ANAGRAFICA.countSTP != 0)
        {
            hasENI.val("N");
            hasGIU.val("N");
            $("#radENI_N, #radGIU_N").addClass("RBpulsSel");
            $("#radENI_S, #radGIU_S").removeClass("RBpulsSel");
            NS_ANAGRAFICA.hideCodENI();
            NS_ANAGRAFICA.hideCodGIU();

        }  else{
            NS_ANAGRAFICA.countSTP = 1;

        }

        if(hasSTP === 'S'){
            txtSTP.closest("tr").show();
            txtScadSTP.closest("tr").show();
            V_PS_ANAGRAFICA.elements["txtcodSTP"].status = 'required';
            V_PS_ANAGRAFICA.elements["txtscadcodSTP"].status = 'required';
        }else{
            txtSTP.val('').closest("tr").hide();
            txtScadSTP.val('').closest("tr").hide();
            V_PS_ANAGRAFICA.elements["txtcodSTP"].status = null;
            V_PS_ANAGRAFICA.elements["txtscadcodSTP"].status = null;
        }
        if(NS_ANAGRAFICA.paz_sconosciuto == 'S'){
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA_SCONOSCIUTO"});
        }
        else{
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA"});
        }


    },
    hideCodENI:function(checkStp){
        var hasENI = $("#h-radENI").val();
        var hasSTP = $("#h-radSTP");
        var hasGIU = $("#h-radGIU");

        if(typeof checkStp != 'undefined' && checkStp == true &&( hasSTP.val() == 'S' || hasGIU.val()== 'S' )  && NS_ANAGRAFICA.countEni != 0  ) {
            hasSTP.val("N");
            hasGIU.val("N");
            $("#radSTP_N, #radGIU_N").addClass("RBpulsSel");
            $("#radSTP_S, #radGIU_S").removeClass("RBpulsSel");
            NS_ANAGRAFICA.hideCodSTP();
            NS_ANAGRAFICA.hideCodGIU();

        }else{
            NS_ANAGRAFICA.countEni = 1;
        }

        var txtENI = $("#txtcodENI");
        var txtScadENI = $("#txtscadcodENI");
        if(hasENI === 'S'){
            txtENI.closest("tr").show();
            txtScadENI.closest("tr").show();
            V_PS_ANAGRAFICA.elements["txtcodENI"].status = 'required';
            V_PS_ANAGRAFICA.elements["txtscadcodENI"].status = 'required';
        }else{
            txtENI.val('').closest("tr").hide();
            txtScadENI.val('').closest("tr").hide();
            V_PS_ANAGRAFICA.elements["txtcodENI"].status = null;
            V_PS_ANAGRAFICA.elements["txtscadcodENI"].status = null;
        }
        if(NS_ANAGRAFICA.paz_sconosciuto == 'S'){
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA_SCONOSCIUTO"});
        }
        else{
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA"});
        }


    },
    hideCodGIU : function(checkOthers){
        var hasENI = $("#h-radENI");
        var hasSTP = $("#h-radSTP");
        var hasGIU = $("#h-radGIU");

        if(typeof checkOthers != 'undefined' && checkOthers == true && ( hasSTP.val() == 'S' || hasENI.val()== 'S' ) && NS_ANAGRAFICA.countGiu != 0  ) {
            hasSTP.val("N");
            hasENI.val("N");
            $("#radSTP_N, #radENI_N").addClass("RBpulsSel");
            $("#radSTP_S, #radENI_S").removeClass("RBpulsSel");
            NS_ANAGRAFICA.hideCodSTP();
            NS_ANAGRAFICA.hideCodENI();

        }

        else{

            NS_ANAGRAFICA.countGiu = 1;
        }

        var txtGIU = $("#txtcodGIU");
        var txtScadGIU = $("#txtscadcodGIU");
        if(hasGIU.val() === 'S'){
            txtGIU.closest("tr").show();
            txtScadGIU.closest("tr").show();
            V_PS_ANAGRAFICA.elements["txtcodGIU"].status = 'required';
            V_PS_ANAGRAFICA.elements["txtscadcodGIU"].status = 'required';
        }else{
            txtGIU.val('').closest("tr").hide();
            txtScadGIU.val('').closest("tr").hide();
            V_PS_ANAGRAFICA.elements["txtcodGIU"].status = null;
            V_PS_ANAGRAFICA.elements["txtscadcodGIU"].status = null;
        }
        if(NS_ANAGRAFICA.paz_sconosciuto == 'S'){
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA_SCONOSCIUTO"});
        }
        else{
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA"});
        }

    },
    /**
     * Clicckando sul pulsante di TRIAGE si chiude la pagina anagrafica
     * e si apre la cartella di triage, ridefinendo la funzione before close
     * */
    apriTriage : function(){
        home.NS_LOADING.hideLoading();
        NS_FENIX_SCHEDA.beforeClose = NS_ANAGRAFICA.beforeClose;
        NS_FENIX_SCHEDA.chiudi();
    },

    beforeClose : function(){
        var idenAnag =  NS_ANAGRAFICA.iden_anagrafica == null || NS_ANAGRAFICA.iden_anagrafica == '' ? NS_ANAGRAFICA_SALVATAGGIO.IDEN_ANAGRAFICA : NS_ANAGRAFICA.iden_anagrafica;
        logger.debug('iden_anag -> ' + idenAnag);
        home.NS_FENIX_PS.inserisciContatto(idenAnag, $("#txtCodFisc").val());
        return true;
    },

    /**
     * Ridefinisco il comportamento normale per la chiusura standard
     * */
    close:function(){
        NS_FENIX_SCHEDA.beforeClose = function(){return true;};
        NS_FENIX_SCHEDA.chiudi();
    },
    hideCittadinanza:function(){
        var bool = false;
        $(".AUTOCOMPLETECITTADINANZA").each(function(i){
            var td = $(this);
            var tr = td.closest("tr");
            var value = td.find('input[type="text"]').val();
            if(i != 0 && bool){
                tr.hide();
            }else if(value == ''){
                bool = true;
                tr.show();
            }else {
                tr.show();
            }
        })
    },
    hideCittadinanzaInit:function(){

        var bool = false;
        $(".AUTOCOMPLETECITTADINANZA").each(function(i){
            var td = $(this);
            var tr = td.closest("tr");
            var value = td.find('input[type="text"]').val();
            if(i != 0 && bool){
                tr.hide();
            }else if(value == '' && i != 0){
                bool = true;
                tr.hide();
            }else {
                tr.show();
            }
        })
    },
    valorizeCittadinanza:function(){
        var dati = jsonData.cittadinanza;
        dati = '<DATI>'+dati+'</DATI>';
        var re= /<ITEM DESCR="([A-Z ']*)">([0-9]*)<\/ITEM>/g;

        var i = 0;
        var match;
        while (match = re.exec(dati)) {

            var descr = match[1];
            var val = match[2];

            $("#txtCitt" + i).val(descr).attr({"data-c-value": val, "data-c-descr": descr});
            $("#h-txtCitt" + i).val(val);

            i++;
        }

        NS_ANAGRAFICA.hideCittadinanzaInit();

    },
    getCapRegioneProvincia : function(data,type){

        switch (type) {
            case 'DOMICILIO':
                NS_ANAGRAFICA.valorizeCapRegioneProvinciaDomicilio(data);
                break;
            case 'RESIDENZA' :
                NS_ANAGRAFICA.valorizeCapProvinciaResidenza(data);
                break;
            default :
                logger.error("Tipo di dato non riconosciuto schedaanagrafica.js");
                break;
        }
    },
    valorizeCapRegioneProvinciaDomicilio:function(data){
        $("#txtCodRegDom").val(data.CODICE_REGIONE);
        $("#txtCAPDom").val(data.CAP);
        $("#txtProvDom").val(data.CODICE_PROVINCIA);
        if(data.CODICE_USL != null && data.CODICE_USL != ''){
            //$("#acASLDomicilio").data('acList').returnSelected({DESCR:data.DESCR_ASL,VALUE:data.CODICE_USL});
            $("#txtASLDomicilio").val(data.DESCR_ASL);
            $("#h-txtASLDomicilio").val(data.CODICE_USL);
        }else{
            //$("#acASLDomicilio").data('acList').returnSelected({DESCR:'',VALUE:''});
            $("#txtASLDomicilio").val("");
            $("#h-txtASLDomicilio").val("");

        }
    },
    valorizeCapProvinciaResidenza:function(data){
        if((data.CAP == '' || data.CAP == null)  && data.CODICE_PROVINCIA== 'EE' && data.CODICE_REGIONE == '999') {
            $("#txtCAPRes").val('00000');
            V_PS_ANAGRAFICA.elements["txtIndRes"].status = null;
            V_PS_ANAGRAFICA.elements["txtCAPRes"].status = null;
            V_PS_ANAGRAFICA.elements["txtCodRegRes"].status = null;

        }else{
            $("#txtCAPRes").val(data.CAP);
            V_PS_ANAGRAFICA.elements["txtIndRes"].status = 'required';
            V_PS_ANAGRAFICA.elements["txtCAPRes"].status = 'required';
            V_PS_ANAGRAFICA.elements["txtCodRegRes"].status = 'required';
        }
        if(NS_ANAGRAFICA.paz_sconosciuto == 'S'){
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA_SCONOSCIUTO"});
        }
        else{
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA"});
        }


        $("#txtProvRes").val(data.CODICE_PROVINCIA);
        $("#txtCodRegRes").val(data.CODICE_REGIONE);

        if(data.CODICE_USL != null && data.CODICE_USL != ''){
            //$("#acASLResidenza").data('acList').returnSelected({DESCR:data.DESCR_ASL,VALUE:data.CODICE_USL});
            $("#txtASLResidenza").val(data.DESCR_ASL);
            $("#h-txtASLResidenza").val(data.CODICE_USL);
        }else{
            //$("#acASLResidenza").data('acList').returnSelected({DESCR:'',VALUE:''});
            $("#txtASLResidenza").val("");
            $("#h-txtASLResidenza").val("");
        }


    },
    gestisciCodiceFiscale:function(){

        $("#txtCodFisc").val(NS_ANAGRAFICA.getCodiceFiscale);

    },
    getCodiceFiscale:function(){

        var cognome = document.getElementById('txtCognome').value;
        var nome = document.getElementById('txtNome').value;
        var datanascita = document.getElementById('txtDataNasc').value;
        var sesso = document.getElementById('h-radSesso').value;
        var comNascita = $('#hCodComNasc').val();
        var codluogonascita =$("#txtLuogoNasc").val()==''?'':comNascita;

        if(comNascita == '')
        {
            //in caso di nuovo paziente hdcomnas risulta nullo, recupero valore da tag generato
            codluogonascita = $('#txtLuogoNasc').attr("data-c-codice_comune");
        }
        //alert(cognome + '\n' + nome +'\n' + datanascita + '\n' + sesso  +'\n'+ codluogonascita);

       // if (cognome == '' || nome == '' || datanascita == '' || sesso == '' || codluogonascita == '')	return;

        var cod_fisc = ns_controllo_cod_fisc.calcola_cfs(cognome, nome, datanascita, sesso, codluogonascita);
        NS_ANAGRAFICA.codice_fiscale = cod_fisc;
        NS_ANAGRAFICA_SALVATAGGIO.codice_fiscale = NS_ANAGRAFICA.codice_fiscale;

        return cod_fisc;

    },
    gestModificaCodFisc:function(){

        NS_ANAGRAFICA.gestisciCodiceFiscale();

    },

    initObbligoResidenza: function(){

        if(jsonData.ProvRes== 'EE' && jsonData.CodiceRegionaleRes == '999') {
            $("#txtCAPRes").val('00000');
            V_PS_ANAGRAFICA.elements["txtIndRes"].status = null;
            V_PS_ANAGRAFICA.elements["txtCAPRes"].status = null;
            V_PS_ANAGRAFICA.elements["txtCodRegRes"].status = null;

        }
        if(NS_ANAGRAFICA.paz_sconosciuto == 'S'){
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA_SCONOSCIUTO"});
        }
        else{
            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA"});
        }

    },
    valorizeDatiFormMetadati : function () {

        var nome = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_NOME'];
        var cognome = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_COGNOME'];
        var indirizzo = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_RES_INDIRIZZO'];
        var provincia = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_RES_PROV'];
        var sesso = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_SESSO'];
        var tesseraSanitaria = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA'];
        var tesseraSanitariaScad = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA'];
        var eni = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ENI'];
        var eniScad = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['SCADENZA_ENI'];
        var giubileo = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['GIUBILEO'];
        var giubileoScad = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['SCADENZA_GIUBILEO'];
        var stp = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['STP'];
        var stpScad = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['SCADENZA_STP'];
        var regioneResidenza = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_RES_REGIONE'];
        var codiceFiscale = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_COD_FISC'];
        var Telefono = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_TELEFONO'];
        var dataNascita = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_DATA_NASCITA'];
        //var codiceIstat = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_RES_CODICE_ISTAT'];
        var capResidenza = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_RES_CAP'];
        var cittadinanza = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_ID'];
        var cittadinanzaDescr = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_DESCR'];
        var cittadinanza1id = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_1_ID'];
        var cittadinanza1descr = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_1_DESCR'];
        var cittadinanza2id = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_2_ID'];
        var cittadinanza2descr = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_2_DESCR'];
        var cittadinanza3id = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_3_ID'];
        var cittadinanza3descr = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_3_DESCR'];
        var cod_reg = NS_ANAGRAFICA._JSON_CONTATTO.mapMetadatiString['ANAG_COD_REG'];
        $("#txtNome").val(nome);
        $("#txtCognome").val(cognome);
        $("#h-txtDataNasc").val(dataNascita);
        $("#txtDataNasc").val(moment(dataNascita,'YYYYMMDD').format('DD/MM/YYYY'));
        $("#h-radSesso").val(sesso);
        if(sesso == 'M'){
            $("#radSesso_M").addClass("RBpulsSel");
        }else if(sesso == 'F'){
            $("#radSesso_F").addClass("RBpulsSel");
        }

        $("#txtCodFisc").val(codiceFiscale);

        if(stp != '' && stpScad != '' ){
            $("#radSTP_S").trigger("click");
            $("#txtcodSTP").val(stp);
            $("#h-txtscadcodSTP").val(stpScad);
            $("#txtscadcodSTP").val(moment(stpScad,'YYYYMMDD').format('DD/MM/YYYY'));
        }
        if(eni != '' && eniScad != '' ){
            $("#radENI_S").trigger("click");
            $("#txtcodENI").val(eni).closest("tr").show();
            $("#h-txtscadcodENI").val(eniScad);
            $("#txtscadcodENI").val(moment(eniScad,'YYYYMMDD').format('DD/MM/YYYY')).closest("tr").show();
        }
        if(giubileo != '' && giubileoScad != '' ){
            $("#radGIU_S").trigger("click");
            $("#txtcodGIU").val(giubileo).closest("tr").show();
            $("#h-txtscadcodGIU").val(giubileoScad);
            $("#txtscadcodGIU").val(moment(giubileoScad,'YYYYMMDD').format('DD/MM/YYYY')).closest("tr").show();
        }

        $("#txtCodReg").val(cod_reg);
        $("#txtCodRegRes").val(regioneResidenza);
        $("#acCittadinanza0").data('acList').returnSelected({VALUE:cittadinanza , DESCR:cittadinanzaDescr});
        $("#acCittadinanza1").data('acList').returnSelected({VALUE:cittadinanza1id ,DESCR:cittadinanza1descr});
        $("#acCittadinanza2").data('acList').returnSelected({VALUE:cittadinanza2id ,DESCR:cittadinanza2descr});
        $("#acCittadinanza3").data('acList').returnSelected({VALUE:cittadinanza3id ,DESCR:cittadinanza3descr});
        NS_ANAGRAFICA.hideCittadinanzaInit();
        $("#txtTesseraSanitaria").val(tesseraSanitaria);
        $("#txtScadTesseraSanitaria").val(tesseraSanitariaScad);
        $("#txtIndRes").val(indirizzo);
        $("#txtTelRes").val(Telefono);
        $("#txtCAPRes").val(capResidenza);
        $("#txtProvRes").val(provincia);


        NS_ANAGRAFICA_SALVATAGGIO.codice_fiscale =  NS_ANAGRAFICA.getCodiceFiscale()

    }

};