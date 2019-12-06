var NS_REGISTRA_VERBALE = {

    serverName : 'http://'+ document.location.host + document.location.pathname.match(/\/.*\//),

    /**
     * Determina il tipo di registrazione a seconda dell'esito scelto  gli esiti possibili sono :
     * OBI('6'), Ricovero('2'), Dimissione('1','3','4','5','7','8','9','A')
     * @param esito
     * @param callback
     */
    gestioneEsito : function (esito, callback) {

        var regime = NS_VERBALE.regime_contatto;
        var stato = NS_VERBALE.stato_contatto;

        logger.debug("Esito : IS_DA_FIRMARE -> " + $("#IS_DA_FIRMARE").val());

        if (NS_VERBALE_CONTROLLI.hasAValue(esito)) {
            switch (esito) {
                //Ricovero
                case "2":
                    if(NS_VERBALE_CONTROLLI.isContattoAdmitted()) {

                        NS_REGISTRA_VERBALE.getRegimeRicoveroADT(function () {

                            if(NS_VERBALE_CONTROLLI.isRegimeOBI() && NS_VERBALE_CONTROLLI.isMantieniOBINO()){

                                NS_ESITI.RicoveroOBIRimosso( function(){ callback(); } );

                            } else {

                                NS_ESITI.registraRicovero(regime, stato, function () {callback();});

                            }
                        });
                    }
                    else if (NS_VERBALE_CONTROLLI.isRicoverato()) {

                        if(NS_VERBALE_CONTROLLI.isRegimeOBI() && NS_VERBALE_CONTROLLI.isMantieniOBINO()){

                            NS_ESITI.updateOBIRimosso(function(){ callback(); });

                        } else {

                            NS_ESITI.updateRicovero(function(){ callback(); });
                        }
                    }
                    else {

                        NS_REGISTRA_VERBALE.getRegimeRicoveroADT(function(){

                            if(NS_VERBALE_CONTROLLI.isRegimeOBI() &&NS_VERBALE_CONTROLLI.isMantieniOBINO()){

                                NS_ESITI.RicoveroOBIRimossoUpdate(function(){ callback(); })

                            } else {

                                NS_ESITI.registraRicovero(regime, stato, function () {callback();});
                            }
                        });
                    }
                    break;
                //OBI
                case "6":
                    NS_REGISTRA_VERBALE.gestioneEsito($("#h-radOBI").val(),callback);
                    break;
                //Dimissione
                case "1" : case "3": case"4": case"5": case"7": case"8": case"9": case"A":
                    if (NS_VERBALE_CONTROLLI.isContattoAdmitted()) {
                        logger.info("Esito : dimetto il paziente");
                        NS_ESITI.registraDimissione(regime,function () {
                            callback();
                        });
                    }
                    else if (NS_VERBALE_CONTROLLI.isRicoverato()) {
                        logger.info("Esito : esito precedente ricoverato, cancello il ricovero e aggiorno il contatto PS");
                        NS_ESITI.cancelAdmit(function () {
                            callback();
                        });
                    }
                    else {
                        logger.info("Esito : esito dimesso update del contatto PS");
                        NS_ESITI.updateDimissioni(function () {
                            callback();
                        });
                    }
                    break;

                default:
                    logger.error("Esito : esito non contemplato " +esito);
                break;
            }
        }
        else {
            logger.error("Esito : Non e' stato scelto alcun esito");
            NS_VERBALE.dialogOK("Esito non selezionato","Attenzione");
            home.NS_LOADING.hideLoading();
        }
    },
    /**
     * Gestisce i ricoveri passati aperti del paziente se DH li elimina
     * @param callbackSuccess
     */
    getRegimeRicoveroADT : function(callbackSuccess){

        home.NS_LOADING.hideLoading();

        var db = $.NS_DB.getTool();
        var dbParams = {"iden_anag": {v: NS_VERBALE.iden_anag, t: "N"}};
        var xhr = db.select({
            datasource: "PS",
            id: "PS.Q_RICERCA_RICOVERI_ADT",
            parameter: dbParams
        });
        xhr.done(function (response) {

            home.NS_LOADING.hideLoading();

            /* Se presenti e intenzionati i DH vengono CHIUSI! */
            if (response.result.length > 0)
            {
                var dhAperto = false;
                var tableRic="<table style='width:450px;' ><caption style='font-weight: bold;'>Ricoveri aperti</caption>" +
                    "<tr><th style='font-weight: bold;'>Nosologico</th><th style='font-weight: bold;'>Regime</th>" +
                    "<th style='font-weight: bold;'>Reparto</th><th style='font-weight: bold;'>Data</th></tr>";

                for (var i=0; i<response.result.length; i++)
                {
                    tableRic += "<tr><td style='border:1px solid black; text-align: center;'>" + response.result[i].NOSOLOGICO + "</td>";
                    tableRic += "<td style='border:1px solid black; text-align: center;'>" + response.result[i].REGIME_DESCR + "</td>";
                    tableRic += "<td style='border:1px solid black; text-align: center;'>" + response.result[i].REPARTO + "</td>";
                    tableRic += "<td style='border:1px solid black; text-align: center;'>" + response.result[i].DATA_INIZIO + "</td></tr>";

                    if (response.result[i].REGIME == '2') {
                        dhAperto = true;
                    }
                }

                tableRic += "</table>";

                if (dhAperto) {
                    tableRic += "<p style='font-weight: bold;'>Se si sceglie di proseguire, il ricovero DH verra' chiuso</p>";
                }

                $.dialog(tableRic, {
                    buttons :
                        [
                            {
                                label: "Annulla", action: function (){$.dialog.hide();}
                            },
                            {
                                label: "Prosegui", action: function (){
                                $.dialog.hide();
                                /* ciclo per tutti i ricoveri aperti del paziente */
                                for (i=0; i < response.result.length; i++)
                                {
                                    /* se vi sono dei DH aperti vengono chiusi */
                                    if (response.result[i].REGIME === "2")
                                    {

                                        // var jsonContatto = NS_CONTATTO_METHODS.getContattoById(response.result[i].IDEN_CONTATTO);

                                        var jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden(response.result[i].IDEN_CONTATTO, {assigningAuthorityArea: 'adt'});

                                        // jsonContatto.uteDimissione.id = home.baseUser.IDEN_PER;
                                        jsonContatto.uteModifica.id = home.baseUser.IDEN_PER;
                                        jsonContatto.dataFine = jsonContatto.contattiAssistenziali[jsonContatto.contattiAssistenziali.length - 1].dataFine;
                                        jsonContatto.mapMetadatiString['CHIUSURA_FORZATA'] = 'S';
                                        jsonContatto.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id : null,codice : '7'};
                                        jsonContatto.contattiGiuridici[jsonContatto.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
                                        jsonContatto.contattiAssistenziali[jsonContatto.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;

                                        var pA03 = {"contatto" : jsonContatto, "updateBefore" : true, "hl7Event" : "A03 Chiusura Forzata", "notifica" : {"show" : "S", "timeout" : 3, "message" : "Dimissione Forzata Ricovero DH Avvenuta con Successo", "errorMessage" : "Errore Durante la Dimissione Forzata Ricovero DH"}, "cbkSuccess" : function(){}};

                                        pA03.cbkSuccess = callbackSuccess;

                                        NS_CONTATTO_METHODS.dischargeVisit(pA03);
                                    }
                                }
                                /* se esiastono solo ricoveri ordinari procedo comunque */
                                if(!dhAperto){
                                    callbackSuccess();
                                }

                            }
                            }
                        ],
                    title : "Ricoveri sovrapposti",
                    height:200,
                    width:500
                });
            }
            /* non vi sono ricoveri aperti per il paziente */
            else
            {
                callbackSuccess();
            }

        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("NS_VERBALE.getRegimeRicoveroADT  \n" + JSON.stringify(jqXHR) +
            "\n" + JSON.stringify(textStatus) + "\n" + JSON.stringify(errorThrown));
            home.NS_LOADING.hideLoading();
        });

    },

    dialogCopie: function(){
        NS_VERBALE.dialogOK( 'Inserire numero copie: <input type="text" id="numeroCopie"/>',"",function(){
            NS_VERBALE_CONTROLLI.controlloStampa();
            NS_VERBALE_CONTROLLI.controlloDecesso();
            home.NS_LOADING.hideLoading();
            NS_REGISTRAZIONE_FIRMA.firma('{"N_COPIE":"' + $("#numeroCopie").val() + '"}',undefined,NS_REGISTRA_VERBALE.serverName);
        });
    },

    successBozza : function(message) {

        if(NS_VERBALE_CONTROLLI.isCartella()){
            home.PANEL.verbale = "OK";
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
            home.CARTELLA.jsonData.H_STATO_PAGINA.VERBALE = 'E';
            home.NS_CARTELLA.showUrgenza("", "", $("#UrgenzaPs").find("div.RBpulsSel").attr("title"));
        }

        NS_VERBALE.stampa = true;
        $("#STATO_PAGINA").val("E");
        message  = message.replace(/\s+/g, '');
        NS_VERBALE.idenSchedaVerbale = parseInt(message);
        NS_VERBALE.setIntestazioni({"fase":"SUCCESS"});

        home.NS_LOADING.hideLoading();

    },

    successSave: function (message,button) {
        var esito = $("#hEsito").val();

        if (typeof message == "undefined") logger.error("message non e' definito : " + message);

        if(NS_VERBALE_CONTROLLI.isCartella()){
            home.PANEL.verbale = "OK";
            home.NS_CARTELLA.setSemaphoreOnSave();
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
            home.PANEL.NS_FUNZIONI.showHideVerbale(true);
            home.CARTELLA.jsonData.H_STATO_PAGINA.VERBALE = 'E';
            home.NS_CARTELLA.showUrgenza("", "", $("#UrgenzaPs").find("div.RBpulsSel").attr("title"));
        }

        NS_VERBALE.stampa = true;
        message  = message.replace(/\s+/g, '');
        NS_VERBALE.idenSchedaVerbale = parseInt(message);

        NS_VERBALE.setIntestazioni({"fase":"SUCCESS"});



        if(home.baseUser.TIPO_PERSONALE == "M" && button.attr("class") == "btn butFirma" && esito !== "4" ) {

            home.NS_LOADING.hideLoading();

            $.dialog("Si desidera cambiare il numero delle copie da stampare?", {
                title: "Attenzione",
                buttons: [
                    {label: "Si", action: function () {
                        $.dialog.hide();
                        NS_REGISTRA_VERBALE.dialogCopie();
                        //dovrebbe solo salvare i cambiamenti dei campi qui
                    }},
                    {label: "No", action: function () {

                        NS_VERBALE_CONTROLLI.controlloStampa();

                        NS_VERBALE_CONTROLLI.controlloDecesso();

                        if(NS_VERBALE_CONTROLLI.isCartella()){home.PANEL.esito = esito;}

                        home.NS_LOADING.hideLoading();

                        if (NS_VERBALE.Firma == true && esito === "4") {
                            NS_REGISTRAZIONE_FIRMA.firma('{"N_COPIE":"1"}',undefined,NS_REGISTRA_VERBALE.serverName);
                        }
                        else if (NS_VERBALE.Firma == true) {
                            NS_REGISTRAZIONE_FIRMA.firma('{"N_COPIE":"2"}',undefined,NS_REGISTRA_VERBALE.serverName);
                        }
                        //dovrebbe solo salvare i cambiamenti dei campi qui
                        $.dialog.hide();
                    }}
                ]
            });
        } else {

            /* se allontanato stampo solo una copia */
            NS_VERBALE_CONTROLLI.controlloStampa();

            NS_VERBALE_CONTROLLI.controlloDecesso();

            if(NS_VERBALE_CONTROLLI.isCartella()){home.PANEL.esito = esito;}

            home.NS_LOADING.hideLoading();

            if (NS_VERBALE.Firma == true && esito === "4") {
                NS_REGISTRAZIONE_FIRMA.firma('{"N_COPIE":"1"}',undefined,NS_REGISTRA_VERBALE.serverName);
            }
            else if (NS_VERBALE.Firma == true) {
                NS_REGISTRAZIONE_FIRMA.firma('{"N_COPIE":"2"}',undefined,NS_REGISTRA_VERBALE.serverName);
            }
        }
    }
};

var NS_REGISTRAZIONE_FIRMA =
{
    firma : function (pConfig,p,serverName) {

        home.NS_FENIX_PRINT.caricaDocumento({"PRINT_REPORT":"BLANK", "PRINT_DIRECTORY": "1", "PRINT_PROMPT": "&promptpMessage=" + escape("CARICAMENTO ANTEPRIMA VERBALE")});
        home.FIRMA = $.extend({},home.FIRMA, home.FIRMA_PS);

        if (typeof p == 'undefined'){

            /*
             var prompts = "&promptpIdenContatto=" + _JSON_CONTATTO.id + '&promptpBozza=N&promptpFirma=S' + '&promptpStatoVerbale=';
             prompts += jsonData.hStatoVerbale === "F" ? "E" : "R";
             */
            var stato_verbale =   jsonData.hStatoVerbale  === "F" ? "E" : "R";
            var firma = 'S';
            var url = serverName +  "jsp/PS/verbale.jsp?idenContatto="+  _JSON_CONTATTO.id + '&sito=PS&firma='+firma + '&stato='+ stato_verbale+'&bozza=N';
            logger.debug(url);

            p = {
                "STAMPA" : {URL:url},
                "FIRMA" : {}
            };
        }

        p['FIRMA'].FIRMA_COMPLETA = false;
        p['FIRMA'].PRIMA_FIRMA = jsonData.hStatoVerbale != "F";
        p['FIRMA'].IDEN_VERSIONE =  NS_VERBALE.idenSchedaVerbale;
        p['FIRMA'].IDEN_VERSIONE_PRECEDENTE = null; // iden parent della scheda xml attuale
        p['FIRMA'].TIPO_DOCUMENTO =  "VERBALE_PS";
        p['FIRMA'].TABELLA =  "PRONTO_SOCCORSO.PS_SCHEDE_XML";
        p['FIRMA'].KEY_CONNECTION = "PS";
        //p['FIRMA'].CALLBACK = function(){NS_FENIX_SCHEDA.chiudi({'refresh' : true});};

        logger.debug("Firma Verbale PS - NS_REGISTRAZIONE_FIRMA.firma - p -> " + JSON.stringify(p));

        home.NS_FENIX_PRINT.config = $.extend({},p,JSON.parse(home.baseGlobal["PRINT_VERBALE"]));

        if (typeof pConfig !== "undefined") {
            home.NS_FENIX_PRINT.config = $.extend({},home.NS_FENIX_PRINT.config,JSON.parse(pConfig));
        }

        logger.debug("home.NS_FENIX_PRINT.config -> " + JSON.stringify(home.NS_FENIX_PRINT.config));

        home.FIRMA.initFirma(p);
    }

};