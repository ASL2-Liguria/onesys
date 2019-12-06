/***********************************************************************************************************************
 *                       Namespace dell'iframe di SINISTRA dove ci sono g?i accordion (div#tSx)                        *
 **********************************************************************************************************************/
var NS_INFO_ESAME = {

    init : function() {

        home.NS_CONSOLEJS.addLogger({name: 'NS_INFO_ESAME', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_INFO_ESAME'];

        NS_INFO_ESAME.tSxAcc = $(".accordion", NS_PANEL.ref.sx);
        NS_INFO_ESAME.tSxAcc.accordion({
            active : 0,
            heightStyle : "fill",
            icons : {
                "header" : "ui-icon-plus",
                "headerSelected" : "ui-icon-minus"
            }
        });
        NS_INFO_ESAME.infoEsame = $("#infoEsame");

    },

    resize: function () {
        NS_INFO_ESAME.infoEsame.height(NS_PANEL.ref.sx.height());
        NS_INFO_ESAME.infoEsame.width(NS_PANEL.ref.sx.width());
        NS_INFO_ESAME.tSxAcc.accordion("refresh");
    },

    setEvents : function() {
        $("#divAnamnesi").on("click", function() {NS_REFERTO.apriAnamnesi();});
        $("#divCodiceColore").on("click", function() {NS_REFERTO.apriCodiceColore();});
        $("#divDatiAmmi").on("click", function() {NS_REFERTO.apriDatiAmministrativi();});
        $("#divAnagrafica").on("click", function() {NS_REFERTO.apriSchedaAnagrafica();});
        $("#divPotesta").on("click", function() {NS_REFERTO.apriWkPotesta();});
        $("#divEsameObiettivo").on("click", function() {NS_REFERTO.apriEsameObiettivo();});
        $("#divInail").on("click", function() {NS_REFERTO.apriInail();});
        $('#insDiario').on("click", function() {NS_REFERTO.apriInsDiari();});
        $('#insDiarioInf').on("click", function() {NS_REFERTO.apriInsDiariInf();});
        $('#divParamVitali').on("click", function() {NS_REFERTO.apriParamVitali();});
        $('#divParamVitaliM').on("click", function() {NS_REFERTO.apriParamVitali();});
        $('#insRichieste').on("click", function() {NS_REFERTO.apriInsRichieste();});
        $('#insRichiesteM').on("click", function() {NS_REFERTO.apriInsRichieste();});
        $('#insTerapie').on("click", function() {NS_REFERTO.apriInsTerapia();});
        $('#insTerapieM').on("click", function() {NS_REFERTO.apriInsTerapia();});
        $("#divVerbale").on("click", function() {NS_REFERTO.apriVerbale();});
        $("#divRivalutazioniMediche").on("click", function() {NS_REFERTO.apriRivalutazioniMediche();});
        $("#divRivalutazioniMedichePassate").on("click", function() {NS_REFERTO.apriRivalutazioniMedichePassate();});
        $("#divAndamentoTriage").on("click", function() {NS_REFERTO.apriAndamentoTriage();});
        $("#completaTriage").on("click", function () {NS_FUNZIONI.completaTriage();});
        $("#completaRivalutazione").on("click", function () {NS_FUNZIONI.completaTriage();});
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
        var yyyy = home.CARTELLA.NS_INFO_PAZIENTE.jsonAnagrafica.DATA_NASCITA.substr(0,4);
        var mm = home.CARTELLA.NS_INFO_PAZIENTE.jsonAnagrafica.DATA_NASCITA.substr(4,2);
        var dd = home.CARTELLA.NS_INFO_PAZIENTE.jsonAnagrafica.DATA_NASCITA.substr(6,2);

        return (mm + '/' + dd + '/' + yyyy);
    },

    differenzaDate: function(){

        var date1 = null;
        if (NS_INFO_ESAME.getDataNascita() != ''){
            date1 =  new Date(NS_INFO_ESAME.getDataNascita());
        }
        else{
            //date1 = null;
            return false;
        }

        var date2 = new Date(NS_INFO_ESAME.dataAttuale());
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());

        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    },

    hidePotesta: function(){

        var eta = NS_INFO_ESAME.differenzaDate();
        // if(eta > 730 ){
        var panel0 = $("#ui-accordion-infoEsame-panel-0").find("div.RIQ#divPotesta");
        panel0.hide();

        //  }
    },
    /**
     * funzione richiamata dopo la valorizazione del json anagrafica, se il paziente � sconosciuto si nasconde la scheda anagrafica
     * */
    hideDivAnagrafica : function(){

        if(NS_INFO_PAZIENTE.jsonAnagrafica.COGNOME === 'SCONOSCIUTO'){
            NS_INFO_ESAME.hideSchedaAnagrafica();
        }
    },
    
    hideSchedaAnagrafica : function(){
        $("#divAnagrafica").hide();
    },

    controlCompletaTriage : function(command){

        var buttons = $("#completaTriage,#completaRivalutazione");

        buttons.off("click");

        if(command === "OFF"){
            buttons.on("click",function(){
                $.dialog("E' necessario completare il salvataggio della scheda CODICE COLORE prima di completare il Triage",{
                    title: "ATTENZIONE",
                    buttons: [ {label: "OK", action: function () { $.dialog.hide(); }} ]
                });
            });
        } else {
            buttons.on("click", function () {NS_FUNZIONI.completaTriage();});
        }

    },

    comandSxPanel : function(panel,command,notElement){

        var panel_0 = $("#ui-accordion-infoEsame-panel-0").find("div.RIQ"),
            panel_1 = $("#ui-accordion-infoEsame-panel-1").find("div.RIQ"),
            panel_2 = $("#ui-accordion-infoEsame-panel-2").find("div.RIQ"),
            panel_3 = $("#ui-accordion-infoEsame-panel-3").find("div.RIQ");

        notElement = (typeof notElement !== "undefined") ? notElement : "";

        switch(panel){
            case "0":
                panel = panel_0;
                break;
            case "1":
                panel = panel_1;
                break;
            case "2":
                panel = panel_2;
                break;
            case "3":
                panel = panel_3;
                break;
        }

        switch(command){
            case "SHOW":
                panel.not(notElement).show();
                break;
            case "HIDE":
                panel.not(notElement).hide();
                break;
        }
    },
    /**
     *  Mostra o nasconde parti della cartella a seconda del tipoPersonale e della wkApertura
     */
    showInfoEsame : function() {
        var wkApertura = $("#WK_APERTURA").val();
        var menuApertura = $("#MENU_APERTURA").val();
        var tipoPersonale = home.baseUser.TIPO_PERSONALE;
        var stato_pagina = $("#STATO_PAGINA").val();
        var allPanel= "#ui-accordion-infoEsame-panel-1, #ui-accordion-infoEsame-panel-2, #ui-accordion-infoEsame-panel-3";
        var panel0 = $("#ui-accordion-infoEsame-panel-0").find("div.RIQ#divPotesta");
        var accordion1 = $("#ui-accordion-infoEsame-panel-1");
        var panel1 = accordion1.find("div.RIQ");
        var panel2 = $("#ui-accordion-infoEsame-panel-2").find("div.RIQ");
        var panel3 = $("#ui-accordion-infoEsame-panel-3").find("div.RIQ");
        var diarioInf =  accordion1.find("div.RIQ#insDiarioInf");
        var completaTriage = accordion1.find("div.RIQ#completaTriage");
        var completaRivalutazione = accordion1.find("div.RIQ#completaRivalutazione");


        /* cartella in sola lettura STATO_PAGINA="R" */
        if(stato_pagina==="R"){
            panel0.hide();
            panel1.not("#divAnamnesi").hide();
            panel2.not("#divEsameObiettivo").hide();
            panel3.not("#divVerbale").hide();
            NS_INFO_ESAME.tSxAcc.accordion({ active : 0 });

        } else {
            /* se nn hai i dati amministrativi salvati non puoi fare nient'altro */
            if(NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.dataIngresso == '') {

                $(allPanel).find("div.RIQ").hide();
                NS_INFO_ESAME.tSxAcc.accordion({ active : 0 });

            } else {
                switch(tipoPersonale){
                    // AMMINISTRATIVO
                    case"A":
                        $(allPanel).find("div.RIQ").hide();
                        NS_INFO_ESAME.tSxAcc.accordion({ active : 0 });
                        break;
                    // INFERMIERE, OSTETRICO
                    case"I":
                    case"OST":

                        panel2.hide();
                        panel3.hide();
                        panel1.show();

                        NS_INFO_ESAME.tSxAcc.accordion({ active : 1 });

                        if (wkApertura === "LISTA_APERTI") {

                            if(tipoPersonale === "OST") { panel1.not("#divAnamnesi, #insDiarioInf").hide(); }
                            if(tipoPersonale === "I") { panel1.not("#divAnamnesi, #insDiarioInf, #divParamVitali").hide(); }

                            if(($("#IDEN_CDC_PS").val() == home.baseGlobal["cartella.LISTA_APERTI.I.visualizza"])){
                                accordion1.find("div.RIQ#insRichieste").show();
                                if(tipoPersonale === "I") { accordion1.find("div.RIQ#divParamVitali").show(); }
                            }
                        }
                        if (wkApertura === "LISTA_ATTESA" || wkApertura === "ANAGRAFICA") {
                            diarioInf.hide();
                            completaRivalutazione.hide();

                            if(menuApertura=="RIVALUTA_TRIAGE" || menuApertura=="COMPLETA_RIVALUTAZIONE" || menuApertura=="MANUTENZIONE_RIVALUTAZIONE"){
                                completaRivalutazione.show();
                                completaTriage.hide();
                            }
                        }

                        else if (wkApertura === "LISTA_OBI") {
                            panel1.not("#divAnamnesi, #insRichieste, #divParamVitali, #insDiarioInf").hide();
                        }

                        if (wkApertura === "LISTA_CHIUSI") {
                            panel2.show();
                            $("#completaTriage, #completaRivalutazione").hide();
                        }
                        break;
                    // MEDICO
                    case "M":
                        if (wkApertura === "LISTA_ATTESA" || wkApertura === "ANAGRAFICA") {

                            panel2.hide();
                            panel1.show();
                            diarioInf.hide();

                            if(typeof jsonData.UrgenzaListaAttesa !== "undefined") {
                                panel3.show();
                            } else {
                                panel3.hide();
                            }

                            completaRivalutazione.hide();

                            if(menuApertura=="RIVALUTA_TRIAGE" || menuApertura=="COMPLETA_RIVALUTAZIONE" || menuApertura=="MANUTENZIONE_RIVALUTAZIONE"){
                                completaRivalutazione.show();
                                completaTriage.hide();
                            }

                            NS_INFO_ESAME.tSxAcc.accordion({ active: 1 });

                        } else if (wkApertura === "LISTA_CHIUSI") {

                            panel3.show();
                            panel2.show();
                            NS_INFO_ESAME.tSxAcc.accordion({ active: 3 });
                            // se sono SUPERUSER vedo CODICE COLORE
                            if(home.basePermission.hasOwnProperty('SUPERUSER')){
                                panel1.not("#divAnamnesi, #divCodiceColore").hide();
                            }
                            else{
                                panel1.not("#divAnamnesi").hide();
                            }

                        } else {

                            panel3.show();
                            panel2.show();
                            panel1.not("#divAnamnesi").hide();
                            NS_INFO_ESAME.tSxAcc.accordion({ active: 2 });

                            if(menuApertura === "SCELTA_ESITO" || menuApertura === "SCELTA_ESITO_OBI"){
                                NS_INFO_ESAME.tSxAcc.accordion({ active: 3 });
                            }
                        }

                        break;
                    default:
                        NS_INFO_ESAME.tSxAcc.accordion({ active : 0 });
                        break;
                }               
            }
        }

    }
};
/***********************************************************************************************************************
 *                                    Namespace dell'iframe di DESTRA del div#tDx                                      *
 **********************************************************************************************************************/
var NS_FUNZIONI = {

    dati_ambulatorio : {iden_pro : "",iden_anag : ""},

    init : function() {

        NS_FUNZIONI.tDxAcc = $(".accordion", NS_PANEL.ref.dx);
        NS_FUNZIONI.tDxAcc.accordion({
            heightStyle : "fill",
            icons : {
                "header" : "ui-icon-plus",
                "headerSelected" : "ui-icon-minus"
            }
        });
        NS_FUNZIONI.divFunzioni = $("#divFunzioni");
        NS_FUNZIONI.ulFunzioniBase = $("#ulFunzioniBase").UlFunc();
        NS_FUNZIONI.showFunzioni();
    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== typeof value) && ("undefined" !== value) && ("null" !== value));
    },

    showFunzioni : function(){
        var wkApertura = $("#WK_APERTURA").val();
        var tipoPersonale = home.baseUser.TIPO_PERSONALE;
        var allFunzPanel = $("#ui-accordion-divFunzioni-panel-0, #ui-accordion-divFunzioni-panel-1, #ui-accordion-divFunzioni-panel-2");
        var panel2 = $("#ui-accordion-divFunzioni-panel-2");
        var panelStampe = $("#ui-accordion-divFunzioni-panel-1");
        var NO_STAMPA_NUMERO_CHIAMATA = $.parseJSON(home.baseGlobal.NO_STAMPA_NUMERO_CHIAMATA);

        var idenCdc = $("#IDEN_CDC_PS").val();

        if(!tipoPersonale) logger.error("NS_FUNZIONI.showFunzioni : tipoPersonale is not defined");

        switch(tipoPersonale){
            case"A":
                panel2.find("div.RIQ").hide();
                panelStampe.find("div.RIQ").hide();
                break;

            case"I":
                 panel2.find("div.RIQ").not("#TrasportoNonUrgente").hide();
                break;

            case"OST":
                if(wkApertura== 'LISTA_CHIUSI'){
                    panel2.find("div.RIQ").not("#TrasportoNonUrgente").hide();
                }
                break;

            case"M":
                allFunzPanel.find("div.RIQ").show();
                break;

            default:

                break;
        }

        if (NO_STAMPA_NUMERO_CHIAMATA[idenCdc] == 'N' || typeof NO_STAMPA_NUMERO_CHIAMATA[idenCdc] != 'undefined') {
            panelStampe.find("div#anteprimaNumero").hide();
        }

    },

    showHideVerbale : function(controllo){
        var anteprima = $("#anteprima");
        if(controllo){
            anteprima.show();
        }else{
            anteprima.hide();
        }
    },

    setEvents : function() {

        /* posso stampare il verbale solo se il paziente e' dimesso */
        if(jsonData.statoContatto==="ADMITTED"){NS_FUNZIONI.showHideVerbale(false);}

        $("#anteprima").on("click", function() {NS_FUNZIONI.hasDocumentoFirmato($("#IDEN_CONTATTO").val());});
        $("#anteprimaTriage").on("click", function () {home.NS_STAMPE_PS.stampaTriage($("#IDEN_CONTATTO").val(), "N")});
        $("#datiStrutturati").on("click", function() {NS_FUNZIONI.apriDatiStrutt();});
        $("#divDiari").on("click", function() {NS_REFERTO.apriDiari();});
        $("#divDiariInf").on("click", function() {NS_REFERTO.apriDiariInf();});
        $("#iPatient").on("click", function() {NS_FUNZIONI.apriIpatient();});
        $("#divModulistica").on("click", function() {NS_REFERTO.apriModulistica();});
        $("#divPrestazioni").on("click", function() {NS_REFERTO.apriPrestazioni();});
        $("#divRichieste").on("click", function() {NS_REFERTO.apriRichieste();});
        $("#divTerapie").on("click", function() {NS_REFERTO.apriTerapie();});
        $("#Prenotazione").on("click", function() {NS_FUNZIONI.apriPrenotazione(true);});
        $("#PrenotazioneEsterna").on("click", function() {NS_FUNZIONI.apriPrenotazione(false);});
        $("#RicettaRossaFarmaci").on("click", function() {NS_FUNZIONI.apriRicettaRossaFarmaci();});
        $("#RicettaRossaPrestazioni").on("click", function() {NS_FUNZIONI.apriRicettaRossaPrestazioni();});
        $("#WorklistRicette").on("click", function() {NS_FUNZIONI.apriWorklistRicette();});
        $("#PianiTerapeutici").on("click", function() {NS_FUNZIONI.apriPianiTerapeutici();});
        $("#TrasportoNonUrgente").on("click", function() {NS_FUNZIONI.apriTrasportoNonUrgente();});
        $("#divStoriaContatto").on("click", function() {NS_REFERTO.apriStoriaContatto();});
        $("#apriDocumentiPaziente").on("click", function() {NS_FUNZIONI.apriDocumentiPaziente();});
        $("#divAnamnesiInfRiepilogo").on("click", function() {NS_REFERTO.apriAnamnesiInfRiepilogo();});
        $("#catenaCustodia").on("click", function() {home.NS_STAMPE_PS.stampaCatenaCustodia($('#IDEN_CONTATTO').val(),"N");});
        $("#DiariStampa").on("click", function() {home.NS_STAMPE_PS.stampaDiari($('#IDEN_CONTATTO').val(),"N");});
        $("#braccialetto").on("click", function() { home.NS_STAMPE_PS.stampaBraccialetto($('#IDEN_CONTATTO').val(),"N");});
        $('#anteprimaNumero').on("click", function() {home.NS_STAMPE_PS.stampaNumero($('#IDEN_CONTATTO').val(),"N");});
        $('#anteprimaPrivacy').on("click", function() {home.NS_STAMPE_PS.stampaPrivacy($('#IDEN_CONTATTO').val(),"N");});
        $('#anteprimaDiarioOBI').on("click", function() {home.NS_STAMPE_PS.stampaDiarioOBI($('#IDEN_CONTATTO').val(),"N");});
    },

    resize: function () {
        NS_FUNZIONI.divFunzioni.height(NS_PANEL.ref.dx.height());
        NS_FUNZIONI.divFunzioni.width(NS_PANEL.ref.dx.width());
        NS_FUNZIONI.tDxAcc.accordion("refresh");
    },

    hasDocumentoFirmato : function(_id_contatto){
        var db = $.NS_DB.getTool({setup_default: {datasource: 'PS', async : false}});

        var params = {
            "iden_contatto": {'v': Number(_id_contatto), 't': 'N'},
            "scheda": {'v': "VERBALE", 't': 'N'}
        };

        var xhr = db.select({
            id       : "PS.Q_HAS_DOCUMENTO_FIRMATO",
            parameter: params
        });

        xhr.done(function (data) {

            var result = data.result;

            logger.debug("PS.Q_HAS_DOCUMENTO_FIRMATO - RESULT -> " + JSON.stringify(data) + " esito="+home.PANEL.esito);

            if(home.PANEL.esito==="4"){
                if( result[0]["N_DOCUMENTI_FIRMATI"] == "0") {
                    home.NS_STAMPE_PS.stampaVerbale(_id_contatto,"N",null,'{"N_COPIE":"1"}',"R");
                }else{
                    home.NS_STAMPE_PS.stampaVerbale(_id_contatto,"N",null,'{"N_COPIE":"1"}',"F");
                }
            }else{
                if( result[0]["N_DOCUMENTI_FIRMATI"] == "0") {
                    home.NS_STAMPE_PS.stampaVerbale(_id_contatto,"N",null,'{"N_COPIE":"2"}',"R");
                }else{
                    home.NS_STAMPE_PS.stampaVerbale(_id_contatto,"N",null,'{"N_COPIE":"2"}',"F");
                }
            }



        });
    },

    completaTriage: function () {
        var iden_contatto = $("#IDEN_CONTATTO").val(),
            jsonLista =  home.PANEL.NS_INFO_PAZIENTE.getJsonListaAttesa();

        if(jsonLista.STATO_DESCR=='COMPLETO'){
            home.NS_STAMPE_PS.stampaTriage(iden_contatto, "N", function () {
                home.NS_WK_PS.resetFiltriAnag();
                home.NS_FENIX_PRINT.chiudi({});
                NS_PANEL.chiudi();
            });
        }else {
            NS_TRIAGE_METHODS.checkCompletaTriage({
                "iden_contatto": iden_contatto,
                "callback": function (data) {
                    var resp = data.p_result.split('|');
                    if (resp[0] == "KO") {
                        return home.NOTIFICA.error({message: resp[1], title: "Campo obbligatorio"});
                    }
                    else {
                        var jsonLista = home.PANEL.NS_INFO_PAZIENTE.getJsonListaAttesa();
                        if (!NS_FUNZIONI.hasAValue(jsonLista)) {
                            return home.NOTIFICA.error({message: 'Non e\' stato assegnato nessun codice colore', title: "Campo obbligatorio"});
                        }

                        NS_TRIAGE_METHODS.setCompletato({
                            "iden_contatto": iden_contatto,
                            "iden_lista": jsonLista.IDEN,
                            "callback": function () {

                                var idenContatto = $("#IDEN_CONTATTO").val(),
                                    menuApertura = $("#MENU_APERTURA").val(),
                                    jsonlista = home.PANEL.NS_INFO_PAZIENTE.getJsonListaAttesa(),
                                    NOT_PRINT_NUM_CHIAMATA = $.parseJSON(home.baseGlobal.NOT_PRINT_NUM_CHIAMATA);

                                // se è S o non cè quindi undefined devo stampare tutto
                                if (jsonlista.PROGRESSIVO == 0 && menuApertura !== "MANUTENZIONE_TRIAGE" &&
                                    (NOT_PRINT_NUM_CHIAMATA[jsonlista.CDC_IDEN] == 'S' || typeof NOT_PRINT_NUM_CHIAMATA[jsonlista.CDC_IDEN] == 'undefined'))
                                {
                                    home.NS_STAMPE_PS.stampaTriage(idenContatto, "N", function () {
                                        home.NS_STAMPE_PS.stampaNumero(idenContatto, "S", function () {
                                            home.NS_STAMPE_PS.stampaPrivacy(idenContatto, "S", function () {
                                                //home.PANEL.NS_INFO_PAZIENTE.initJsonListaAttesa(idenContatto, function () {
                                                    //home.NS_FENIX_PS.getTipoPersonale("A");
                                                    home.NS_FENIX_PRINT.chiudi({});
                                                    NS_PANEL.chiudi();
                                                    home.NS_WK_PS.resetFiltriAnag();
                                               // });
                                            });
                                        });
                                    }, function () {
                                        NS_PANEL.chiudi();
                                        home.NS_WK_PS.resetFiltriAnag();
                                    });
                                }
                                else if (jsonlista.PROGRESSIVO == 0 && menuApertura !== "MANUTENZIONE_TRIAGE" &&
                                    (NOT_PRINT_NUM_CHIAMATA[jsonlista.CDC_IDEN] == 'N' || typeof NOT_PRINT_NUM_CHIAMATA[jsonlista.CDC_IDEN] != 'undefined'))
                                {
                                    home.NS_STAMPE_PS.stampaTriage(idenContatto, "N", function () {
                                        home.NS_STAMPE_PS.stampaPrivacy(idenContatto, "S", function () {
                                           //home.PANEL.NS_INFO_PAZIENTE.initJsonListaAttesa(idenContatto, function () {
                                                //home.NS_FENIX_PS.getTipoPersonale("A");
                                                home.NS_FENIX_PRINT.chiudi({});
                                                NS_PANEL.chiudi();
                                                home.NS_WK_PS.resetFiltriAnag();
                                          // });
                                        });
                                    }, function () {
                                        NS_PANEL.chiudi();
                                        home.NS_WK_PS.resetFiltriAnag();
                                    });
                                }
                                else
                                {
                                    home.NS_STAMPE_PS.stampaTriage(idenContatto, "N", function () {
                                       //home.PANEL.NS_INFO_PAZIENTE.initJsonListaAttesa(idenContatto, function () {
                                            //home.NS_FENIX_PS.getTipoPersonale("A");
                                            home.NS_FENIX_PRINT.chiudi({});
                                            NS_PANEL.chiudi();
                                            home.NS_WK_PS.resetFiltriAnag();
                                       //});
                                    }, function () {
                                        NS_PANEL.chiudi();
                                        home.NS_WK_PS.resetFiltriAnag();
                                    });
                                }

                            }
                        });
                    }
                }
            });
        }

    },

    apriDatiStrutt : function() {
//		var whaleUrl = home.baseGlobal.URL_CARTELLA  + 'whale/';
        /*var whaleUrl = 'http://10.99.1.129:8081/whale/';
         whaleUrl += 'servletGeneric?class=cartellaclinica.cartellaPaziente.datiStrutturatiLabo.listDocumentLaboratorioFiltro&reparto=MMG';
         whaleUrl += '&nosologico='+jsonData.numeroPratica+'&elencoEsami=&numRichieste=5&idPatient='+jsonData.COD_EST_ANAG_ID1+'&DATA_NASC='+jsonData.hDataNascita;
         whaleUrl += '&daData=&aData=&provRisultati=&provChiamata=MMG&userLogin='+home.baseUser.USERNAME+'&idenAnag='+$("#IDEN_ANAG").val() + '&modalita=PAZIENTE';
         */
        var whaleUrl =   home.baseGlobal.URL_CARTELLA + 'whale/autoLogin?utente=' + home.baseUser.USERNAME + '&postazione=' + home.basePC.IP.toUpperCase() + '&pagina=CARTELLAPAZIENTEADT&ricovero='+jsonData.numeroPratica;
        whaleUrl += '&funzione=apriDatiLaboratorio()&ModalitaAccesso=REPARTO&provChiamata=CARTELLA&idPatient='+jsonData.COD_EST_ANAG_ID1;

        logger.debug("PS.apriDatiStrutt - NOSOLOGICO -> " +  jsonData.numeroPratica + ', URL -> ' + whaleUrl);

        /*var url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&ricovero='+$("#hNumeroPratica").val()+
         '&funzione=apriDatiLaboratorio()&ModalitaAccesso=REPARTO&provChiamata=CARTELLA';
         url = NS_APPLICATIONS.switchTo('WHALE', url);*/
        window.open(whaleUrl,"schedaRicovero","fullscreen=yes");
    },

    apriIpatient : function() {

        var user = home.baseUser.USERNAME;
        var idRemoto = $("#hCodEstAnagId1").val();
        var url = home.baseGlobal.URL_CARTELLA  + 'whale/autoLogin?utente='+user+'&postazione='+home.basePC.IP+'&pagina=I-PATIENT-PS&opener=MMG&ID_PAZIENTE='+idRemoto+'&IDEN_ANAG='+ $("#IDEN_ANAG").val();
        window.open(url,"iPatient","fullscreen=yes");

    },

    apriRicettaRossaFarmaci : function(){
        var user = home.baseUser.USERNAME;
        var idRemoto = $("#hCodEstAnagId1").val();
        //var url = 'Home?load=';
        //var urlEncoded = encodeURIComponent('servletGenerator?KEY_LEGAME=RICETTA_FARMACI&idRemoto='+idRemoto+'&utente='+user);
        var url = home.baseGlobal.URL_STAMPA_RICETTE  + 'RrPt/autoLogin?utente='+user+'&postazione='+home.AppStampa.GetCanonicalHostname().toUpperCase()+'&pagina=INSERIMENTO_RR_FARMACI_PS&opener=PS&idRemoto='+idRemoto;
        window.open(url,"PSRicetta","fullscreen=yes");
        //window.open(url,"schedaRicovero","fullscreen=yes");
    },
    apriRicettaRossaPrestazioni : function(){
        var user = home.baseUser.USERNAME;
        var idRemoto = $("#hCodEstAnagId1").val();
        //var url = 'Home?load=';
        //var urlEncoded = encodeURIComponent('servletGenerator?KEY_LEGAME=RICETTA_PRESTAZIONI&idRemoto='+idRemoto+'&utente='+user);
        var url = home.baseGlobal.URL_STAMPA_RICETTE +'RrPt/autoLogin?utente='+user+'&postazione='+home.AppStampa.GetCanonicalHostname().toUpperCase()+'&pagina=INSERIMENTO_RR_PRESTAZIONI_PS&opener=PS&idRemoto='+idRemoto;
        window.open(url,"PSRicetta","fullscreen=yes");
    },
    apriWorklistRicette : function(){
        var user = home.baseUser.USERNAME;
        var idRemoto = $("#hCodEstAnagId1").val();
        var url = home.baseGlobal.URL_STAMPA_RICETTE  + 'RrPt/autoLogin?utente='+user+'&postazione='+home.AppStampa.GetCanonicalHostname().toUpperCase()+'&pagina=WORKLIST_RICETTE&opener=PS&idRemoto='+idRemoto;
        window.open(url,"PSRicetta","fullscreen=yes");
    },
    apriPianiTerapeutici : function(){
        var user = home.baseUser.USERNAME;
        var idRemoto = $("#hCodEstAnagId1").val();
        var  tipo = "INSERIMENTO";
        var reparto = NS_INFO_PAZIENTE.getJsonLocazione();

        /*var url = "servletGenerator?KEY_LEGAME=GESTIONE_PIANI_TERAPEUTICI&TIPO="+tipo+"&idRemoto="+idRemoto+"&utente="+user+"&reparto="+reparto.COD_CDC;
         url = NS_APPLICATIONS.switchTo('RR_PT', url);
         */
        var url = home.baseGlobal.URL_STAMPA_RICETTE + 'RrPt/autoLogin?utente='+user+'&postazione='+home.AppStampa.GetCanonicalHostname().toUpperCase()+'&pagina=INSERIMENTO_PIANI_TERA_PS&opener=PS&idRemoto='+idRemoto+'&reparto='+home.baseUserLocation.cod_cdc+'&TIPO='+tipo;

        window.open(url,"PSRicetta","fullscreen=yes");
    },

    apriPrenotazione : function(interna){
        var tableInfoDialog = $(document.createElement("table")).attr({"id": "tblSelezione", "class": "tabledialog"});


        var params = {
          cod_cdc : home.CARTELLA.NS_INFO_PAZIENTE.jsonLocazione.COD_CDC
        };

        var parametri = {
            "datasource": "WHALE",
            "id": "OE.Q_AMBULATORI",
            "params": params,
            "callbackOK": callbackOk
        };
        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            var responseLength = data.result.length;

            for (var i = 0; i < responseLength; i++){

                var cod_dec = data.result[i].COD_DEC;

                var valore = data.result[i].VALUE;
                var descrizione = data.result[i].DESCR;

                tableInfoDialog.append($(document.createElement("tr")).attr("id", "tr" + valore)
                        .append($(document.createElement("td")).text(descrizione))
                        .append($(document.createElement("td")).attr("class", "tdRadio")
                            .append($(document.createElement("input")).attr({"type": "radio", "name": "selezioneAmbulatori",
                                "value": valore, "data-descr": descrizione,"data-codcdc": valore,"data-coddec": cod_dec})
                        )
                    )
                );

            }
        }


        $.dialog(tableInfoDialog, {
            id: "Dialog_selezionaPS",
            title: "Seleziona Pronto Soccorso",
            width: 500,
            showBtnClose: true,
            movable: true,
            buttons: [
                {label: "Ok", action: function () {
                    var radioChecked = $("td.tdRadio").find("input:checked");
                    if (radioChecked.val() != null) {
                        NS_FUNZIONI.inserisciPrestazioneSuReparto(radioChecked.val(),radioChecked.data("coddec"),interna);
                        $.dialog.hide();
                    }
                }},
                {label: "Chiudi", action: function () {
                    $.dialog.hide();
                }}
            ]
        });
    },

    apriPrenotazioneEsterna:function(){
        //per le prestazioni interne setto a null l'iden provenienza
        NS_FUNZIONI.apriPrenotazione(false);
    },

    apriTrasportoNonUrgente : function(){

        //"http://10.106.0.110:8088/PUBASSIST/LoginServlet?username=ELCO&password=ELCO2015&Login=LOGIN"
        /**
         http://10.106.0.110:8088/PUBASSIST/LoginServlet?
         username=ELCO&password=ELCO2015
         &Login=LOGIN
         &lastName=ALTIERI
         &firstName=SALVATORE
         &COD_FIS=LTRSSVT
         &COM_RES=98061
         &DATA_NAS=03081964
         &INDIR_RES=VIAURIVEI
         &DES_COMUNE_RES=TOIRANO
         &COMUNE_NAS=083048
         &DES_COMUNE_NAS=MESSINA
         &TELEFONO_PAZ=123456
         &COND_PAZ1=Seduto
         &NOTE=LOMBOSCIATALGIA
         &MED_PRESCR=MEDICOPS

         */
        var html = '<form id="mioForm" fullscreen="yes" method="POST" target="_blank" action="'+home.baseGlobal.URL_TRASPORTO_NON_URGENTE+'">' +

            '<input name="username" value="'+ (home.baseUser.USERNAME).toUpperCase() +'"/>' +
            '<input name="password" value="'+ jsonData.PSW_WREPAEU +'"/>' +
            '<input name="Login" value="LOGIN"/>' +
            '<input name="lastName" value="'+jsonData.COGNOME+'"/>' +
            '<input name="firstName" value="'+jsonData.NOME+'"/>' +
            '<input name="DATA_NAS" value="'+jsonData.DATA_NASCITA_CONV+'"/>' +    //DDMMYYYY
            '<input name="COMUNE_NAS" value="'+jsonData.COMUNENASCITAASSISTITO+'"/>' +   //IDEN_COMUNE
            '<input name="COD_FIS" value="'+jsonData.CODICE_FISCALE+'"/>' +
            '<input name="COM_RES" value="'+jsonData.COMUNERESIDENZAASSISTITO+'"/>' +   //IDEN_COMUNE_RESIDENZA
            '<input name="DES_COMUNE_RES" value="'+jsonData.DESCRCOMUNERESIDENZAASSISTITO+'"/>' +    //DES_COMUNE_RES
            '<input name="INDIR_RES" value="'+jsonData.RES_INDIRIZZO+'"/>' +
            '<input name="TELEFONO_PAZ" value="'+jsonData.RES_TELEFONO+'"/>' +
            '<input name="COND_PAZ1" value="'+jsonData.SATO_PAZIENTE_DECODED+'"/>' +        //SEDUTO O BARELLATO
            '<input name="NOTE" value="'+jsonData.DIAGNOSI_TESTUALE_VERBALE+'"/>' +
            '<input name="DES_COMUNE_NAS" value="'+jsonData.DESCRCOMUNENASCITAASSISTITO+'"/>' +
            '<input name="MED_PRESC" value="'+home.baseUser.DESCRIZIONE+'"/>' +
            '</form>';

        logger.debug(
                ' codiceUtente -> ' +home.baseUser.USERNAME +
                ' codiceStrutturaRichiedente -> ' + jsonData.CODICESTRUTTURARICHIEDENTE+
                ' cognomeAssistito -> ' + jsonData.COGNOME +
                ' nomeAssistito -> ' +   jsonData.NOME+
                ' dataNascitaAssistito -> ' +  jsonData.hDataNascita +
                ' sessoAssistito -> ' +  jsonData.Sesso +
                ' comuneNascitaAssistito -> ' + jsonData.COMUNENASCITAASSISTITO +
                ' codiceFiscaleAssistito -> ' +  jsonData.CODICE_FISCALE+
                ' comuneResidenzaAssistito -> ' +  jsonData.COMUNERESIDENZAASSISTITO +
                ' CODICE_FISCALE -> ' + jsonData.CODICE_FISCALE +
                ' comuneResidenzaAssistito -> ' + jsonData.RES_INDIRIZZO +
                ' telefonoAssistito -> '  +jsonData.RES_TELEFONO  +
                ' codiceStatoPaziente -> ' + jsonData.STATO_PAZIENTE  +
                ' DATA_DIMISSIONE ->' + jsonData.DATA_DIMISSIONE +
                ' ORA_DIMISSIONE ->' + jsonData.ORA_DIMISSIONE+
                ' DIAGNOSI_TESTUALE_VERBALE -> '  + jsonData.DIAGNOSI_TESTUALE_VERBALE
        );

        $('body').append($(html));
        $("#mioForm").submit().remove();


    },

    inserisciPrestazioneSuReparto : function(pCdcDestinatario,pCodDecDestinatario,interna){
        NS_FUNZIONI.inserisciPrestazione({
            cdc_destinatario : pCdcDestinatario,
            cod_dec_destinatario : pCodDecDestinatario,
            apri_scheda_esame : (interna ? "N" : "S") ,
            "interna" : interna
        });
    },

    inserisciPrestazione : function (param){
        param = typeof param == 'undefined' ? {} : param;

        NS_FUNZIONI.getIdentificativiAmbu({
            idenAnag : $("#IDEN_ANAG").val(),
            codDecDestinatario : param.cod_dec_destinatario,
            callback : function(param){
                return function(){
                    var url = NS_FUNZIONI.generaUrlAmbu(
                        param.cdc_destinatario
                        ,param.apri_scheda_esame
                        ,NS_FUNZIONI.dati_ambulatorio.iden_pro
                        ,NS_FUNZIONI.dati_ambulatorio.iden_anag
                        ,home.baseUserLocation.CDC_COD_DEC
                        ,param.interna);
                    window.open(url, "ambulatorio", "fullscreen=yes");
                }
            }(param)
        });
    },

    getIdentificativiAmbu : function(json){
        var db = $.NS_DB.getTool();
        var dbParams = {
            "IDEN_ANAG_WHALE": {v: json.idenAnag, t: "N"},
            "COD_DEC_WHALE": {v: home.CARTELLA.NS_INFO_PAZIENTE.jsonLocazione.COD_DEC_CDC/*home.baseUserLocation.codice*/, t: "V"},
            "IDENANAG_IDENPROPOLARIS":{"d":'O'}
        };
        var xhr = db.call_procedure({
            datasource: "WHALE",
            id: "GET_IDENTIFICATIVI_AMBULATORIO",
            parameter: dbParams
        });

        xhr.done(function (response) {
            var resp= response.IDENANAG_IDENPROPOLARIS.split("@");
            if (response) {
                NS_FUNZIONI.dati_ambulatorio.iden_pro=resp[1];
                NS_FUNZIONI.dati_ambulatorio.iden_anag=resp[0];
                logger.info("GET_IDENTIFICATIVI_AMBULATORIO : iden_pro: " + resp[1] + ", iden_anag: " + resp[0]);
                json.callback();
            } else {
                logger.error("GET_IDENTIFICATIVI_AMBULATORIO" + JSON.stringify(response));
                false;
            }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("GET_IDENTIFICATIVI_AMBULATORIO \n" + JSON.stringify(jqXHR)+"\n"+JSON.stringify(textStatus)+
                "\n" + JSON.stringify(errorThrown));
            return false;
        });
    },

    generaUrlAmbu : function(cdc_destinatario,apri_scheda_esame,iden_pro,iden_anag,cod_dec,interna){

        if (!interna) {
            iden_pro = home.baseGlobal.IDEN_PRO_AMBU_EST;
        }

        var url = 'autoLogin?USER='+home.baseUser.USERNAME+'&IP='+home.AppStampa.GetCanonicalHostname().toUpperCase() +'&KEY=PRENOTAZIONE_DA_PS&opener=UNISYS&IDEN_PRO='+iden_pro+'&IDEN_ANAG='+iden_anag+'&CDC_IDEN_PRO='+ cdc_destinatario + "@" + iden_pro;
        logger.info("url chiamata ambulatorio: "+home.baseGlobal.URL_CARTELLA +'ambulatorio_non_strumentale/'+ url);

        //return home.baseGlobal.URL_CARTELLA +'ambulatorio_non_strumentale/'+ url;

        var nested_url = "sceltaEsami"
            + "?tipo_registrazione=P"
            + "&Hiden_pro=" + iden_pro
            + "&Hcdc=" + cdc_destinatario + "@" + iden_pro
            + "&urgente=0"
            + "&cmd_extra=hideMan();setCaller('WHALE');"
            + "&next_servlet=prenotazioneInizio"
            + "&Hclose_js=chiudi_prenotazione();"
            + "&js_after_load=continua();"
            //+ "&extra_db=WHALE_CC<riferimenti iden_ricovero='" + pDati.iden_ricovero /*iden nosologico accesso =0*/
            //+ "' iden_visita='"+ pDati.iden_visita /*iden nosologico accesso =1*/ +"'/>"
            + "&extra_db=WHALE"
            + "&visualizza_metodica=N"
            + "&apri_scheda_esame="+(typeof apri_scheda_esame == "undefined" ? 'N' : apri_scheda_esame)
            + "&cod_dec_med_rich="+  home.baseUser.CODICE_DECODIFICA; //cod dec dell'utente loggato

        var url = "prenotazioneFrame"
            + "?Hiden_anag=" + iden_anag
            + "&servlet=" + encodeURIComponent(nested_url);

        logger.info("url chiamata ambulatorio: "+url);

        return NS_APPLICATIONS.switchTo('AMBULATORIO',url);
        //return home.baseGlobal.URL_CARTELLA +'ambulatorio_non_strumentale/'+ url;

    },

    apriDocumentiPaziente : function(){
        /*var url = 'autoLogin?utente='+$("#USERNAME").val()+'&postazione=' + home.AppStampa.GetCanonicalHostname().toUpperCase() +  '&pagina=CARTELLAPAZIENTEADT&iden_anag='+$("#IDEN_ANAG").val() +'&funzione=apriDocumentiPaziente()&reparto=&ModalitaAccesso=REPARTO&iden_evento=';
         url = NS_APPLICATIONS.switchTo('WHALE', url);*/
        var url = home.baseGlobal.URL_CARTELLA  + 'whale/autoLogin?utente='+$("#USERNAME").val()+'&postazione=' + home.AppStampa.GetCanonicalHostname().toUpperCase() +  '&pagina=CARTELLAPAZIENTEADT&iden_anag='+$("#IDEN_ANAG").val() +'&funzione=apriDocumentiPaziente()&reparto=&ModalitaAccesso=REPARTO&iden_evento=';

        window.open(url, "schedaRicovero", "fullscreen=yes");
    }

};