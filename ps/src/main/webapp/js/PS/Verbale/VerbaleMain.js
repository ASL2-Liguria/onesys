/**
 * AlessandroA + CarloG
 * Schema degli esiti:
 * ESITI ---> DIMISSIONE
 *         ---> RICOVERO
 *         ---> OBI ---> DIMISSIONE dopo OBI
 *                  ---> RICOVERO dopo OBI
 * */

var _JSON_CONTATTO = "";
var _JSON_RICOVERO = "";
var _JSON_RICOVERO_EMPTY = "";

$(function () {

    NS_VERBALE_JSON.initVerbaleJson( function(){ NS_VERBALE.init(); } );

});

var NS_VERBALE = {

    _registra: function (button) {
        $("#IS_DA_FIRMARE").val(jsonData.hStatoVerbale === "F" ? "S" : "N");

        NS_FENIX_SCHEDA.registra({
            //valida : true,
            successSave: function (message) {
                NS_VERBALE.idenSchedaVerbale = parseInt(message);
                NS_VERBALE._success_save(message, button);
            }
        })
    },

    _registra_bozza: function () {
        $("#IS_DA_FIRMARE").val(jsonData.hStatoVerbale === "F" ? "S" : "N");

        NS_FENIX_SCHEDA.registra({
            valida : false,
            successSave: function (message) {
                NS_VERBALE.idenSchedaVerbale = parseInt(message);
                NS_VERBALE._success_save_bozza(message);
            }
        })
    },

    _success_save: function (message, button) {

        NS_REGISTRA_VERBALE.gestioneEsito( $("#hEsito").val() , function () {
            NS_REGISTRA_VERBALE.successSave(message, button)
        });
    },

    _success_save_bozza: function (message) {
        NS_REGISTRA_VERBALE.successBozza(message);
    },

    stampa : false,
    Firma : false,
    headerTab : $("#lblTitolo"),
    idenSchedaVerbale : $("#hIdenSchedaVerbale").val(),
    onereIngresso : $("#hOnereIngresso").val(),
    subOnereIngresso : $("#hSubOnereIngresso").val(),
    iden_anag : "",
    stato_contatto : "",
    data_inizio_obi : "",
    regime_contatto : "",
    iden_provenienza : jsonData.iden_provenienza,
    validator : NS_FENIX_SCHEDA.addFieldsValidator({config: "V_PS_VERBALE"}),
    messEquitalia : [],
    jsonDatiAgg : null,
    contattoDataFine : null,
    contattoDataInizio : null,
    divRicovero : $("#divRicovero"),
    divTrasferimento : $("#divTrasferimento"),
    divOBI : $("#divOBI"),
    divDecesso : $("#divDecesso"),
    reparto_giuridico_iniziale : $("#h-txtrepRicovero").val(),
    reparto_assistenziale_iniziale : $("#h-txtrepAssistenza").val(),

    init : function () {

        home.NS_CONSOLEJS.addLogger({name: "MainVerbale", console: 0});
        window.logger = home.NS_CONSOLEJS.loggers["MainVerbale"];

        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params; };

        NS_VERBALE.iden_anag =_JSON_CONTATTO.anagrafica.id;
        NS_VERBALE.stato_contatto = _JSON_CONTATTO.stato.codice;
        NS_VERBALE.data_inizio_obi =_JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length - 1].dataInizio;
        NS_VERBALE.regime_contatto =_JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length - 1].regime.codice;

        if (NS_VERBALE_CONTROLLI.isCartella()) {
            home.PANEL.NS_VERBALE = NS_VERBALE;
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }

        NS_VERBALE.setIntestazioni({"fase":"OPEN"});
        NS_VERBALE_CONTROLLI.controlloColore();
        NS_VERBALE_EVENTI.disableDate();

        logger.info("apertura per contatto=" + $("#IDEN_CONTATTO").val() + " regime=" + NS_VERBALE.regime_contatto + " stato=" +
        NS_VERBALE.stato_contatto + " esito=" + $("#hEsito").val() + " utente dimettente=" + _JSON_CONTATTO.uteDimissione.id +
        " iden contatto ricovero=" + $("#hIdenRicovero").val());

        NS_VERBALE.detectStatoPagina();

        NS_VERBALE.datiRicovero();
    },
    /**
     * determina il comportamento della pagina al caricamento
     */
    detectStatoPagina : function(){

        if (NS_VERBALE_CONTROLLI.isReadOnly()) {
            NS_VERBALE.showHideElementi($("#hEsito").val());
            NS_VERBALE_EVENTI.setReadOnly();
        }
        else if(NS_VERBALE_CONTROLLI.isRegimeOBI()){
            $("#hEsito").val("6");
            $("#hEsitoIden").val(home.baseGlobal.IDEN_ESITO_OBI);
            NS_VERBALE.detectBaseUser();
            NS_VERBALE.showHideElementi("6");
            NS_VERBALE_EVENTI.setEvents();
        }
        else if( $("#STATO_PAGINA").val() === "E") {
            NS_VERBALE.detectBaseUser();
            NS_VERBALE.controlloEsito($("#hEsito").val());
            NS_VERBALE_EVENTI.setEvents();
        }
        else {
            $("#taEpicrisi").closest("tr").hide();
            $("#UrgenzaPs").find("div.CBcolorBlack").hide();
            NS_VERBALE_CONTROLLI.controlloCatenaCustodia();
            NS_VERBALE_EVENTI.setEvents();
            NS_VERBALE.detectBaseUser();

            if(NS_VERBALE_CONTROLLI.isAllontanato()){
                NS_VERBALE.dialogOK("L'unico esito selezionabile e' l'allontanato.","Attezione");
                $("#radSceltaEsito_4").trigger("click");
            }

            if(_JSON_CONTATTO.urgenza.codice === "CBcolorBlack"){
                NS_VERBALE.dialogOK("L'unico esito selezionabile e' il giunto cadavere.","Attenzione");
                NS_VERBALE_CONTROLLI.controlloColore("8");
                $("#radSceltaEsito_8").trigger("click");
            }
        }
    },

    /**
     * Determina il comportamento della pagina a secomnda del tipo utente
     */
    detectBaseUser: function () {

        var butBozza = $("button.butSalvaBozza"),
            butSalva = $("button.butSalvaVerbale"),
            butFirma = $("button.butFirma"),
            TipoPersonale = home.baseUser.TIPO_PERSONALE;

        butBozza.hide();
        butSalva.hide();
        butFirma.hide();

        switch (TipoPersonale) {
            case "I"  :
            case "OST":
                if (NS_VERBALE_CONTROLLI.isAllontanato()) {
                    butSalva.show();
                    NS_VERBALE_EVENTI.formEvent();
                }
                break;

            case "M" :
                if ((NS_VERBALE_CONTROLLI.isContattoAdmitted())) {
                    butBozza.show();
                    butSalva.show();
                    butFirma.show();

                    NS_VERBALE_EVENTI.formEvent();

                    if (NS_VERBALE_CONTROLLI.isAllontanato()) { butBozza.hide(); }
                    if($("#STATO_PAGINA").val() === "I"){ NS_VERBALE_EVENTI.valorizeMedicoRef(); }
                }
                else if ((NS_VERBALE_CONTROLLI.isSameUser() && (NS_VERBALE_CONTROLLI.limiteOraChiusura())) || (NS_VERBALE_CONTROLLI.isSuperUser())) {
                    NS_VERBALE.dialogSINO("E' gia' presente un Verbale per questo paziente, lo si vuole modificare ?","Attenzione",
                        function(){
                            if (jsonData.hStatoVerbale === "F") {
                                butFirma.show();
                            } else{
                                butFirma.show(); butSalva.show(); } NS_VERBALE_EVENTI.formEvent();
                        },
                        function(){
                            $("#READONLY").val("S");
                            NS_VERBALE_EVENTI.setReadOnly();
                        }
                    );
                }
                else {
                    NS_VERBALE.dialogOK("Impossibile salvare il verbale: superato il limite delle "+home.baseGlobal["cartella.tempo_manutenzione.cartella_chiusa"]+" ore dopo il primo salvataggio, oppure un utente diverso dal primo sta tentanto di salvare la scheda.","Attezione");
                }
                break;

            default:
                NS_VERBALE.dialogOK("L'utente attuale ("+TipoPersonale+") non puo salvare il verbale","Attezione");
                break;
        }
    },
    /**
     * ControlloEsito : effettua i dovuti controlli per controllare quali esiti sono selezionabili
     */
    controlloEsito : function(esito){

        var statoContatto = NS_VERBALE.stato_contatto;

        /* in questi casi si può solo selezionare l'esito allontanato come da specifiche */
        if (NS_VERBALE_CONTROLLI.isAllontanato()) {

            if(esito === "4") {
                NS_VERBALE.showHideElementi(esito);
            } else {
                NS_VERBALE.dialogOK("L'unico esito selezionabile e' l'allontanato.","Attezione");
                NS_VERBALE.cleanRadSceltaEsito();
                $("#radSceltaEsito_4").trigger("click");
            }

            if (NS_VERBALE_CONTROLLI.isCartella()){ home.PANEL.NS_REFERTO.SALVA_SCHEDA = "R"; }
        }
        /* nel caso del giunto cadavere solo il dottore può dimettere e salvare il verbale */
        else  if(_JSON_CONTATTO.urgenza.codice === "CBcolorBlack") {

            if(esito === "8") {
                NS_VERBALE.showHideElementi(esito);
            } else {
                NS_VERBALE.dialogOK("L'unico esito selezionabile e' il giunto cadavere.","Attenzione");
                $("#rowTemplate").hide();
                NS_VERBALE.cleanRadSceltaEsito();
                $("#radSceltaEsito_8").trigger("click");
            }
        }
        // chiusura standard o modifica del verbale a contatto chiuso con super user o stesso utente entro 12 ore
        else if( (statoContatto === "ADMITTED") || ( (statoContatto === "DISCHARGED") && (NS_VERBALE_CONTROLLI.isSuperUser() || (NS_VERBALE_CONTROLLI.isSameUser() && NS_VERBALE_CONTROLLI.limiteOraChiusura())))) {
            if((NS_VERBALE_CONTROLLI.hasAValue(esito)) && (esito != "4") && (esito != "8")) {
                NS_VERBALE.showHideElementi(esito);
            } else if(esito === "4") {
                NS_VERBALE.dialogOK("Non e' possibile segnalare l'esito allontanato a questo punto dell'iter ","Attenzione");
                NS_VERBALE.cleanRadSceltaEsito();
            } else if(esito === "8") {
                NS_VERBALE.dialogOK("Non e'possibile segnalare il giunto cadavere a questo punto dell'iter ","Attenzione");
                NS_VERBALE.cleanRadSceltaEsito();
            }
        }
        else {
            $("#radSceltaEsito").on("click", function() {
                NS_VERBALE.dialogOK("L'utente attuale non puo salvare l'esito", "Attenzione");
            });
        }
    },

    cleanRadSceltaEsito : function(val){

        if(NS_VERBALE_CONTROLLI.hasAValue(val)){
            $("#radSceltaEsito").find("div").removeClass("RBpulsSel");
            $("#radSceltaEsito_"+val).find("div").addClass("RBpulsSel");
        } else {
            val = "";
            $("#radSceltaEsito").find("div").removeClass("RBpulsSel");
        }

        $("#h-radSceltaEsito").val(val);
        $("#hEsito").val(val);
    },
    /**
     * Mostra elementi opzionali a seconda della selezione fatta in esito
     * @param esito
     */
    showHideElementi : function (esito) {

        var radOBI = $("#h-radOBI"),
            pulsanti = $("div.RBpuls"),
            epicrisi = $("#taEpicrisi"),
            hEsito = $("#hEsito").val(),
            divUrgenza = $("#UrgenzaPs"),
            lblDataDim = $("#lblDataDim"),
            oraRicovero = $("#txtOraRicovero"),
            mantieniObi = $("#radMantieniOBI"),
            diagnosi1 = $("#h-txtDiagnosiICD91"),
            stato_pagina = $("#STATO_PAGINA").val(),
            taPrognosi = $("#taPrognosi").closest("tr"),
            oraTrasferimento = $("#txtOraTrasferimento"),
            diagnosi = $("#txtDiagnosiICD91, #h-txtDiagnosiICD91"),
            campiDecesso = $("#txtDataDecesso, #txtOraDecesso, #txtComuneDec"),
            prognosi = $("#lblPrognosi, #radPrognosi"),
            giorniPrognosi =  $("#txtDayPrognosi, #lblDayPrognosi"),
            campiRicovero = $("#txtDataRicovero, #txtOraRicovero, #txtrepRicovero, #txtrepAssistenza, #cmbTipoRico"),
            campiTrasferimento = $("#txtDataTrasferimento, #txtOraTrasferimento, #cmbTrasferimento, #cmbMotivoTrasf, #cmbMezzoTrasporto");


        $("#divRicovero, #divTrasferimento, #divOBI, #divDecesso").hide();

        if(hEsito === "6"){NS_VERBALE.divOBI.show();}
        if(hEsito === "8"){ $("#rowTemplate").hide(); } else { $("#rowTemplate").show(); }

        divUrgenza.find("div.CBcolorBlack").hide();
        lblDataDim.closest("tr").hide();
        epicrisi.css({"height": 170});
        epicrisi.closest("tr").hide();
        mantieniObi.closest("tr").hide();
        prognosi.hide();
        giorniPrognosi.hide();

        NS_VERBALE.validator.removeStatus(campiRicovero);
        NS_VERBALE.validator.removeStatus(campiTrasferimento);
        NS_VERBALE.validator.removeStatus(campiDecesso);

        NS_VERBALE.validator._attachStatus(diagnosi, {"status": "required"});

        NS_VERBALE_EVENTI.validateGiorniPrognosi();

        NS_VERBALE.setDataOra(esito);

        switch (esito) {

            case "A":
            case "1":
                NS_VERBALE.setIntestazioni({"fase":"ESITO","testo":"Verbale di Dimissione"});
                lblDataDim.closest("tr").show();
                taPrognosi.show();
                giorniPrognosi.show();
                NS_VERBALE_EVENTI.validateGiorniPrognosi();
                break;

            case "2" :
                NS_VERBALE.setIntestazioni({"fase":"ESITO","testo":"Verbale di ricovero"});
                prognosi.show();
                taPrognosi.show();
                giorniPrognosi.show();
                diagnosi1.trigger("change");
                NS_VERBALE_CONTROLLI.checkDiagnosi({"CODICE": diagnosi1.val()});
                NS_VERBALE.divRicovero.show();
                NS_VERBALE.validator._attachStatus(campiRicovero, {"status": "required"});
                $("#cmbTipoRico").find("option[value=2]").attr("selected", true);
                NS_VERBALE_EVENTI.valorizeOnere();
                oraRicovero.attr("readonly", "readonly").off("click");
                NS_VERBALE_EVENTI.validateGiorniPrognosi();

                if ($("#hProblemaPrinc").val() === "10") {
                    var campiTraumatismi = $("#cmbTraumatismo, #txtCategoriaCausaEsterna, #cmbCausaEsterna");
                    NS_VERBALE.validator._attachStatus(campiTraumatismi, {"status": "required"});
                }

                if(stato_pagina === "E"){
                    $("#txtDiagnosiICD91").trigger("change");
                    var cmbCausaEsterna = $("#cmbCausaEsterna"),
                        causaEsternaVal = $("#hCausaEsternaVal"),
                        causaEsternaDescr = $("#hCausaEsternaDescr");
                    cmbCausaEsterna.val(causaEsternaVal.val())
                        .append("<option id='" + cmbCausaEsterna.attr("id") + "_0' data-value='" + causaEsternaVal.val() + "' value='" +
                        causaEsternaVal.val() + "' data-descr='" + causaEsternaDescr.val() + "'>" + causaEsternaDescr.val() + "</option>");
                }

                if(hEsito === "6"){ epicrisi.closest("tr").show(); NS_VERBALE.showHideMantieniOBI(); }

                NS_VERBALE_CONTROLLI.checkTraumatismi();

                break;

            case "3" :
                NS_VERBALE.setIntestazioni({"fase":"ESITO","testo":"Verbale di trasferimento"});
                taPrognosi.hide();
                prognosi.show();
                giorniPrognosi.show();
                NS_VERBALE.divTrasferimento.show();
                NS_VERBALE.validator._attachStatus(campiTrasferimento, {"status": "required"});
                oraTrasferimento.attr("readonly", "readonly").off("click");
                NS_VERBALE_EVENTI.validateGiorniPrognosi();
                if(hEsito === "6"){ epicrisi.closest("tr").show(); }
                break;

            case "4" :
                NS_VERBALE.setIntestazioni({"fase":"ESITO","testo":"Verbale di Allontanato"});
                lblDataDim.closest("tr").show();
                NS_VERBALE.validator.removeStatus(diagnosi);
                break;

            case "5":
                NS_VERBALE.setIntestazioni({"fase":"ESITO","testo":"Verbale di Abbandono Spontaneo (durante iter)"});
                taPrognosi.hide();
                lblDataDim.closest("tr").show();
                NS_VERBALE.validator.removeStatus(diagnosi);
                break;

            case "6" :
                $("#colDimissioni").hide();
                NS_VERBALE.setIntestazioni({"fase":"ESITO","testo":"Verbale di OBI"});
                prognosi.show();
                NS_VERBALE.validator._attachStatus(radOBI, {"status": "required"});
                NS_VERBALE.validator.removeStatus($("#h-radSceltaEsito"));
                NS_VERBALE.divOBI.show();
                if(NS_VERBALE_CONTROLLI.hasAValue(radOBI.val())){NS_VERBALE.showHideElementi(radOBI.val());}
                break;

            case "7" :
                NS_VERBALE.setIntestazioni({"fase":"ESITO","testo":"Verbale di decesso"});
                divUrgenza.find("div.CBcolorBlack").show();
                taPrognosi.hide();
                pulsanti.attr("readonly", "readonly");
                NS_VERBALE.divDecesso.show();
                NS_VERBALE.validator._attachStatus(campiDecesso, {"status": "required"});
                if(stato_pagina === "I"){$("#txtComuneDec").val($("#hComuneEvento").val()); $("#h-txtComuneDec").val($("#hComuneEventoVal").val());}
                break;

            case "8":
                NS_VERBALE.setIntestazioni({"fase":"ESITO","testo":"Verbale di Giunto Cadavere"});
                $("#txtDataDecesso, #txtOraDecesso, #txtComuneDec, #txtDiagnosiICD92, #txtDiagnosiICD93, #txtDiagnosiICD94, #txtDiagnosiICD95").parent().parent().hide();
                NS_VERBALE.divDecesso.show();
                divUrgenza.find("div.CBcolorBlack").show();
                taPrognosi.hide();
                pulsanti.attr("readonly", "readonly");
                lblDataDim.closest("tr").show();
                NS_VERBALE_EVENTI.valorizeDiagnosi($.parseJSON(home.baseGlobal.DIAGNOSI_GIUNTO_CADAVERE));
                break;

            case "9":
                NS_VERBALE.setIntestazioni({"fase":"ESITO","testo":"Verbale di Rifiuto Ricovero"});
                lblDataDim.closest("tr").show();
                break;

            default :
                if ($("#READONLY").val() !== "S") {
                    logger.error("Esito: "+esito+", non valido o non definito");
                }
                break;
        }
    },

    setDataOra : function(esito){

        var dataISO = "", dataDescr ="", oraDescr="";

        switch (esito) {
            case "2":
                dataISO = $("#h-txtDataRicovero");
                dataDescr = $("#txtDataRicovero");
                oraDescr = $("#txtOraRicovero");
                break;
            case "3":
                dataISO = $("#h-txtDataTrasferimento");
                dataDescr = $("#txtDataTrasferimento");
                oraDescr = $("#txtOraTrasferimento");
                break;
            case "7":
                dataISO = $("#h-txtDataDecesso");
                dataDescr = $("#txtDataDecesso");
                oraDescr = null;
                break;
            default:
                dataISO = $("#h-txtDataDim");
                dataDescr = $("#txtDataDim");
                oraDescr = null;
                break;
        }

        if ( NS_VERBALE_CONTROLLI.isContattoAdmitted()) {

            dataDescr.val(moment().format("DD/MM/YYYY"));
            dataISO.val(moment().format("YYYYMMDD"));
            if(NS_VERBALE_CONTROLLI.hasAValue(oraDescr)){ oraDescr.val(moment().format("HH:mm")); }

        } else {

            dataDescr.val(moment(_JSON_CONTATTO.dataFine.substr(0, 8), "YYYYMMDD").format("DD/MM/YYYY"));
            dataISO.val(_JSON_CONTATTO.dataFine.substr(0, 8));
            if(NS_VERBALE_CONTROLLI.hasAValue(oraDescr)){ oraDescr.val(_JSON_CONTATTO.dataFine.substr(8, 13)); }

        }
    },

    setIntestazioni : function(p){

        NS_VERBALE.headerTab.empty();

        if($("#READONLY").val() === "S"){
            NS_VERBALE.headerTab.html("<span id='lblAlertReadOnly'>SOLA LETTURA</span>");
        }
        else if($("#STATO_PAGINA").val() === "E") {
            NS_VERBALE.headerTab.html("<span id='lblAlertModifica'>MODIFICA</span>");
            $("#lblAlertModifica").css({"position":"absolute","right":"10px","color":"#yellow"});
        }
        else if (p.fase === "SUCESS"){
            NS_VERBALE.headerTab.html("<span style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</span>");
            $("#lblAlertCompleto").css({"position":"absolute","right":"10px","color":"green"});
        }else if (p.fase === "ESITO"){
            NS_VERBALE.headerTab.html("<span id='lblAlertEsito'>"+ p.testo+"</span>");
        }else{
            // non stampo nulla
        }
    },

    showHideMantieniOBI: function () {
        var mantieniOBI = $("#radMantieniOBI"),
            hMantieniOBI = $("#h-radMantieniOBI"),
            sceltaOBI = home.baseGlobal["obi.mantieni"],
            sceltaOBIReparto = home.baseGlobal["obi.mantieni." + jsonData.cod_cdc + ""];

        if (NS_VERBALE_CONTROLLI.isRepartoUrgenza() && $("#hEsito").val() === "6" && $("#h-radOBI").val() === "2") {

            mantieniOBI.closest("tr").show();

            if(!NS_VERBALE_CONTROLLI.hasAValue(hMantieniOBI.val())){
                if (NS_VERBALE_CONTROLLI.hasAValue(sceltaOBIReparto)) {
                    $("#radMantieniOBI_" + sceltaOBIReparto).addClass("RBpulsSel");
                    hMantieniOBI.val(sceltaOBIReparto);
                    NS_VERBALE_EVENTI.gestioneMantieniOBI(sceltaOBIReparto);
                } else {
                    $("#radMantieniOBI_" + sceltaOBI).addClass("RBpulsSel");
                    hMantieniOBI.val(sceltaOBI);
                    NS_VERBALE_EVENTI.gestioneMantieniOBI(sceltaOBI);
                }
            }
        } else {
            mantieniOBI.closest("tr").hide();
        }
    },
    contextMenu: function (_this, e) {
        var menu = _this.contextMenu(FRASI_STD_MENU);
        var ev = {
            "elemento": _this.attr("id"),
            "pagina": $("#KEY_LEGAME").val()
        };
        if (e.button === 2) {
            menu.open(e, ev);
        }
    },
    dialogOK : function(text,title,callback){
        $.dialog(text,{
            title: title,
            buttons: [
                {label: "OK", action: function () {
                    if(typeof callback === "function"){callback();}
                    $.dialog.hide();
                }}
            ]
        });
    },
    dialogSINO : function(text,title,callbackSI,callbackNO){
        $.dialog(text,{
            title: title,
            buttons: [
                {label: "NO", action: function () {
                    if(typeof callbackNO === "function"){callbackNO();}
                    $.dialog.hide();
                }},
                {label: "SI", action: function () {
                    if(typeof callbackSI === "function"){callbackSI();}
                    $.dialog.hide();
                }}
            ]
        });
    },
    /**
     * datiRicovero : carica i dati del ricovero dalla scheda se si salva la bozza
     */
    datiRicovero : function(){
        var esito = $("#hEsito").val();
        var esitoObi = $("#h-radOBI").val();

        if(NS_VERBALE_CONTROLLI.isContattoAdmitted() && NS_VERBALE_CONTROLLI.hasAValue(NS_VERBALE.idenSchedaVerbale) && (esito==="2" || (esito === "6" && esitoObi === "2"))){

            $("#txtrepRicovero").val(jsonData.XMLtxtrepRicovero);
            $("#txtrepAssistenza").val(jsonData.XMLtxtrepAssistenza);
            $("#h-txtrepRicovero").val(jsonData.XMLhtxtrepRicovero);
            $("#h-txtrepAssistenza").val(jsonData.XMLhtxtrepAssistenza);
            $("#taNoteBraccialettoRicovero").val(jsonData.XMLtaNoteBraccialettoRicovero);
            $("#cmbTipoRico").val(jsonData.XMLcmbTipoRico);
            $("#cmbOnere").val(jsonData.XMLcmbOnere);
            $("#cmbSubOnere").val(jsonData.XMLcmbSubOnere);
            $("#cmbTraumatismo").val(jsonData.XMLcmbTraumatismo).trigger("change");
            $("#txtCategoriaCausaEsterna").val(jsonData.XMLtxtCategoriaCausaEsterna).trigger("change");
            $("#h-txtCategoriaCausaEsterna").val(jsonData.XMLhtxtCategoriaCausaEsterna);
            $("#cmbCausaEsterna").find("option[value=" + jsonData.XMLcmbCausaEsternaVal + "]").attr("selected",true);
        }
    }
};