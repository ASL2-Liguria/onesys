
$(function () {
    RICHIESTE.init();
    RICHIESTE.setEvents();
});

var RICHIESTE = {

    dimensioneWk: null,
    contatto : NS_DATI_PAZIENTE.getDatiContattobyIden($("#IDEN_CONTATTO").val(), {assigningAuthorityArea:'ps'}),

    init: function () {
        NS_FENIX_SCHEDA.customizeParam = function (params) {
            params.extern = true;
            return params;
        };
        if(LIB.isValid(home)){
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }

        if($("#READONLY").val() === "S"){$("div.contentTabs").css({"background":"#CACACC"})}

        RICHIESTE.calcolaDimensioneWk();
        RICHIESTE.initWkRichieste();
        var catena = $("#hCatena").val();

        if ((catena !== "") && (home.PANEL.catenaCustodia !== "S") && RICHIESTE.contatto.mapMetadatiString.ESAMI_FORENSI !== "S") {
            $("#lblTitolo").append("<span style='color: rgb(255, 255, 0);' id='lblAlertAlcol'>ATTENZIONE : INSERIRE ESAMI TOSSICOLOGICI E/O ALCOOLEMICI</span>");
            $('#lblAlertAlcol').css({'position': 'absolute', 'right': '10px'});
        }
    },

    setEvents: function () {

    },

    calcolaDimensioneWk: function () {
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        RICHIESTE.dimensioneWk = contentTabs - margine;
    },

    initWkRichieste: function () {
        if (!RICHIESTE.wkRichieste) {
            $("div#wkRichieste").height(RICHIESTE.dimensioneWk);
            RICHIESTE.wkRichieste = new WK({
                id: "RICHIESTE",
                container: "wkRichieste",
                aBind: [ 'codice' ],
                aVal: [ $("#hCodiceContatto").val() ]
            });
            RICHIESTE.wkRichieste.loadWk();
        }
    },
    /**
     * Funzione che crea le finistre di dialogo per la WK dove ci sono le info
     * dettaglio richieste.
     */
    processInfoDialog: function (data, wk, td, params) {
        var default_params = {
            query: "WORKLIST.PRESTAZIONI_INFO_DIALOG",
            datasource: "WHALE",
            params_where: {
                "codice": {"v": $("#hCodiceContatto").val()},
                "cod_cdc": {"v": data.CDC},
                "iden_richiesta": {"v":data.IDEN_RICHIESTA, t:'V'}
            },
            order: null,
            title: traduzione.titDettPrest,
            width_info: "450px"
        };

        params = $.extend(true, default_params, params);
        var $icon = $(document.createElement('i')).attr({
            "class": "icon-info-circled",
            "title": params.title,
            "id": "info"
        });

        $icon.on("click", function (e) {
            if(params.query != "") {

                var db = $.NS_DB.getTool({setup_default: {datasource: params.datasource, async: false}});
                var xhr = db.select({
                    id       : params.query,
                    parameter: params.params_where
                });
                xhr.done(function (data) {

                    var html = "<table>";
                    html += "<tr><th style='font-weight:900;'>" + traduzione.thDescrizione + "</th></tr>";
                    $.each(data.result, function (k, v) {
                        html += "<tr><td style='padding:5px;'>" + v.DESCR + "</td></tr>";
                    });
                    html += "</table>";

                    $.infoDialog({
                        event        : e,
                        classPopup   : "",
                        headerContent: params.title,
                        content      : html,
                        width        : params.width_info,
                        dataJSON     : false,
                        classText    : "infoDialogTextMini"
                    });

                });
                xhr.fail(function (jqXHR) {
                    logger.error("PRESTAZIONI INFO DIALOG IN ERRORE jqXHR -> " + JSON.stringify(jqXHR));
                    home.NOTIFICA.error({message: "Errore nella generazione della worklist",title: "Error"});
                });

            }

        });
        return $icon;
    },
    /**
     * Funzione che crea le icone nella colonna funzioni della WK
     * @param data
     * @param wk
     * @returns {Function}
     */
    setFunzioni: function (data, wk) {
        var readOnly = $("#READONLY").val();

        if(!data) logger.error("RICHIESTE.setFunzioni : data is undefined");
        if(!wk) logger.error("RICHIESTE.setFunzioni : wk is undefined");
        if(!readOnly) logger.error("RICHIESTE.setFunzioni : readOnly is undefined");

        var metodica = data.METODICA;
        var div = $(document.createElement("div"));

        if( readOnly !== "S") {

            switch (metodica) {
                /*  LABORATORIO & FORENSI */
                case "L":
                case "A":
                case "F":
                    var dwrPrelievo = $(document.createElement("a"))
                        .attr("onclick","RICHIESTE.dwrPrelievo('"
                        + data.DATA_RICHIESTA
                        + "','" + data.STATO_RICHIESTA
                        + "','" + data.TIPOLOGIA_RICHIESTA
                        + "','" + data.PRELIEVO_EFFETTUATO
                        + "','" + data.ID_RICHIESTA_2
                        + "','" + data.IDEN_RICHIESTA
                        + "','stringanulla"
                        + "','" + metodica
                        + "')")
                        .html("<i class=' icon-ok icoFarm' title='Prelievo'>");

                    if (data.PRELIEVO_EFFETTUATO == "N" && RICHIESTE.contatto.stato.codice != 'DISCHARGED' && data.STATO_RICHIESTA != "X"){div.append(dwrPrelievo);}

                    var stampaEtichetta = $(document.createElement("a"))
                        .attr("onclick","RICHIESTE.stampaEtichetta('"
                        + data.DATA_RICHIESTA
                        + "','" + data.STATO_RICHIESTA
                        + "','" + data.TIPOLOGIA_RICHIESTA
                        + "','" + data.PRELIEVO_EFFETTUATO
                        + "'," + data.IDEN_RICHIESTA
                        + "," + data.ID_RICHIESTA_2
                        + ",'" + metodica + "')")
                        .html("<i class=' icon-menu icoFarm' title='Etichette'>");


                    var apriCustodia = $(document.createElement("a"))
                        .attr("onclick", "RICHIESTE.apriCustodia('"
                        + data.IDEN_RICHIESTA
                        + "','"+ data.PRELIEVO_EFFETTUATO
                        + "','"+ data.DATA_RICHIESTA
                        + "','" + data.STATO_RICHIESTA
                        + "','" + data.TIPOLOGIA_RICHIESTA
                        + "','" + data.PRELIEVO_EFFETTUATO
                        + "','" + data.ID_RICHIESTA_2
                        + "','stringanulla"
                        + "','" + metodica
                        +"')")
                        .html("<i class=' icon-docs' title='Completa Richiesta'>");


                    if ((data.STATO_RICHIESTA == "I" || data.STATO_RICHIESTA == "E") && metodica != "F") {div.append(stampaEtichetta);}

                    if (metodica == "F" && data.STATO_RICHIESTA != "X") {
                        div.append(stampaEtichetta);
                        if(home.baseUser.TIPO_PERSONALE == 'A' || home.baseUser.TIPO_PERSONALE == 'M' ) {
                            div.append(apriCustodia);
                        }
                    }

                    var getUrlInfoDatiLabo = $(document.createElement("a"))
                        .attr("href","javascript:RICHIESTE.getUrlInfoDatiLabo('" + data.IDEN_RICHIESTA + "','"+data.NUM_NOSOLOGICO+"')")
                        .html("<i class=' icon-info-circled' title='Dati Laboratorio'>");

                    if (data.STATO_RICHIESTA == "A" || data.STATO_RICHIESTA == "E" || data.STATO_RICHIESTA == "R" || data.STATO_RICHIESTA == "P") {div.append(getUrlInfoDatiLabo);}

                    break;

                /* TRASFUSIONALI */
                case "T":

                    var dwrPrelievo = $(document.createElement("a"))
                        .attr("onclick","RICHIESTE.dwrPrelievo('"
                        + data.DATA_RICHIESTA
                        + "','" + data.STATO_RICHIESTA
                        + "','" + data.TIPOLOGIA_RICHIESTA
                        + "','" + data.PRELIEVO_EFFETTUATO
                        + "','" + data.ID_RICHIESTA_2
                        + "','" + data.IDEN_RICHIESTA
                        + "','stringanulla"
                        + "','" + metodica
                        + "')")
                        .html("<i class=' icon-ok icoFarm' title='Prelievo'>");

                    if (data.PRELIEVO_EFFETTUATO == "N" && RICHIESTE.contatto.stato.codice != 'DISCHARGED' && data.STATO_RICHIESTA != "X" ){div.append(dwrPrelievo);}

                    var stampaEtichetta = $(document.createElement("a"))
                        .attr("onclick","RICHIESTE.stampaEtichetta('"
                        + data.DATA_RICHIESTA
                        + "','" + data.STATO_RICHIESTA
                        + "','" + data.TIPOLOGIA_RICHIESTA
                        + "','" + data.PRELIEVO_EFFETTUATO
                        + "'," + data.IDEN_RICHIESTA
                        + "," + data.ID_RICHIESTA_2
                        + ",'" + metodica + "')")
                        .html("<i class=' icon-menu icoFarm' title='Etichette'>");

                    if (data.STATO_RICHIESTA == "I" || data.STATO_RICHIESTA == "E") {div.append(stampaEtichetta);}

                case "t":
                    if (data.STATO_RICHIESTA == "I") {
                        if(home.baseUser.TIPO_PERSONALE == 'A' || home.baseUser.TIPO_PERSONALE == 'M' ) {
                            var apriRichiesta = $(document.createElement("a"))
                                .attr("onclick", "RICHIESTE.apriRichiesta(" + data.IDEN_ANAG + ", " + data.IDEN_RICHIESTA + ", false)")
                                .html("<i class=' icon-docs' title='Completa Richiesta'>");
                            div.append(apriRichiesta);
                        }
                    }
                    break;

                /* MEZZO DI CONTRASTO */
                /*
                 case 'V':
                 case '1':
                 case '3':
                 case '5':
                 case 'X':
                 case '4':
                 case '2':
                 if(data.IDEN_RICHIESTA){
                 RICHIESTE.checkMezzoDiContrasto({
                 idenRichiesta : data.IDEN_RICHIESTA,
                 callback : function(){
                 var aMezzoContrasto = $(document.createElement("a"))
                 .attr("href","javascript:RICHIESTE.stampaMezzoContrasto('"+$("#IDEN_CONTATTO").val()+"')")
                 .html("<i class=' icon-print' title='Stampa richiesta consulenza'>");
                 div.append(aMezzoContrasto);
                 }
                 });
                 }
                 break;
                 */
                case 'H':

                    var stampaRichiestaConsulenza = $(document.createElement("a"))
                        .attr("href","javascript:RICHIESTE.stampaRefertoConsulenza('" + data.ID_DETTAGLIO + "')")
                        .html("<i class=' icon-print' title='Stampa referto consulenza'>");
                    div.append(stampaRichiestaConsulenza);
                    break;

                default:
                    logger.error("Metodica non gestita -> " + metodica);
                    break;
            }

            if (data.STATO_RICHIESTA == "R")
            {

                var boolean = false;

                if(data.TIPOLOGIA_RICHIESTA == 5 &&  !LIB.isValid(data.URL_DOCUMENTO) && data.URL_DOCUMENTO != "" ){
                    if(data.STATO_REFERTO == 0){
                        boolean = true;
                    }
                    data.URL_DOCUMENTO = home.baseGlobal.URL_CONSULENZA+'whale/ServletStampe?report=ASL2/CONSULENZE/VERSIONE_0.RPT&prompt<pIdenTR>='+data.IDEN_RICHIESTA
                }
                else{
                    boolean = true;
                }

                if(data.URL_DOCUMENTO != null && data.URL_DOCUMENTO != '' && data.URL_DOCUMENTO != 'undefined') {
                    var apridocumento = $(document.createElement("a"))
                        .attr("href", "javascript:RICHIESTE.controlloURLDocumento({URL:'" + data.URL_DOCUMENTO + "'},"+boolean+")")
                        .html("<i class=' icon-search' title='Apri documento'>");
                    div.append(apridocumento);
                }
            }

            if (data.TIPOLOGIA_RICHIESTA == 5 && (data.STATO_RICHIESTA == 'I' || data.STATO_RICHIESTA == 'R' || data.STATO_RICHIESTA == 'A'))
            {
                if(data.STATO_RICHIESTA == 'I'){

                    var stampaRichiestaConsulenza = $(document.createElement("a"))
                        .attr("href","javascript:RICHIESTE.stampaRichiestaConsulenza('" + data.IDEN_RICHIESTA + "')")
                        .html("<i class=' icon-print' title='Stampa richiesta consulenza'>");
                    div.append(stampaRichiestaConsulenza);

                }

                /*var apriRefertaConsulenza = $(document.createElement("a"))
                 .attr("href","javascript:RICHIESTE.apriRefertaConsulenza('" + data.IDEN_RICHIESTA + "','"+data.CDC+"')")
                 .html("<i class=' icon-pencil' title='Referta consulenza'>");
                 div.append(apriRefertaConsulenza);*/


            }

            if (data.TIPOLOGIA_RICHIESTA == 9)
            {
                var stampaRichiestaConsulenza = $(document.createElement("a"))
                    .attr("href","javascript:RICHIESTE.stampaRichiestaConsulenzaAmb('" + data.IDEN_RICHIESTA + "')")
                    .html("<i class=' icon-print' title='Stampa richiesta consulenza ambulatorio'>");
                div.append(stampaRichiestaConsulenza);
            }

            if(data.TIPOLOGIA_RICHIESTA == 1){
                var stampaRichiestaRadiologia = $(document.createElement("a"))
                    .attr("href","javascript:RICHIESTE.stampaRichiestaRadiologia('" + data.IDEN_RICHIESTA + "','"+data.CDC+"')")
                    .html("<i class=' icon-print' title='Stampa Richiesta Radiologia'>");
                div.append(stampaRichiestaRadiologia);

                if(data.STATO_RICHIESTA == "R" || data.STATO_RICHIESTA == "E"){
                    if(data.STATO_RICHIESTA == "E"){
                        var apriImmaginiPacs = $(document.createElement("a"))
                            .attr("href",'javascript:RICHIESTE.apriImmaginiPacsEseguito({accessionNumber:"' + data.ACCESSION_NUMBER + '", patientId:"' + data.PATIENT_ID + '"},"'+data.CDC+'")')
                            .html("<i class=' icon-folder-open' title='Apri immagini pacs'>");
                    }
                    else{
                        var apriImmaginiPacs = $(document.createElement("a"))
                            .attr("href",'javascript:RICHIESTE.apriImmaginiPacs({accessionNumber:"' + data.ACCESSION_NUMBER + '", patientId:"' + data.PATIENT_ID + '"},"'+data.CDC+'")')
                            .html("<i class=' icon-folder-open' title='Apri immagini pacs'>");
                    }
                    if (data.ACCESSION_NUMBER != '' && data.ACCESSION_NUMBER != null) {
                        div.append(apriImmaginiPacs);
                    }
                }
            }


            return div;
        }

        else {



            switch (metodica) {

                case "L":
                case "F":
                case "A":




                    var getUrlInfoDatiLabo = $(document.createElement("a"))
                        .attr("href","javascript:RICHIESTE.getUrlInfoDatiLabo('" + data.IDEN_RICHIESTA + "','"+data.NUM_NOSOLOGICO+"')")
                        .html("<i class=' icon-info-circled' title='Dati Laboratorio'>");

                    if (data.STATO_RICHIESTA != "I") {div.append(getUrlInfoDatiLabo);}

                    break;


                case "T":
                case "t":
                    if (data.STATO_RICHIESTA == "I") {
                        if(home.baseUser.TIPO_PERSONALE == 'A' || home.baseUser.TIPO_PERSONALE == 'M' ) {
                            var apriRichiesta = $(document.createElement("a"))
                                .attr("onclick", "RICHIESTE.apriRichiesta(" + data.IDEN_ANAG + ", " + data.IDEN_RICHIESTA + ", false)")
                                .html("<i class=' icon-docs' title='Completa Richiesta'>");
                            div.append(apriRichiesta);
                        }
                    }
                    break;

                case 'H':

                    var stampaRichiestaConsulenza = $(document.createElement("a"))
                        .attr("href","javascript:RICHIESTE.stampaRefertoConsulenza('" + data.ID_DETTAGLIO + "')")
                        .html("<i class=' icon-print' title='Stampa referto consulenza'>");
                    div.append(stampaRichiestaConsulenza);
                    break;

                default:

                    break;
            }



            if (data.STATO_RICHIESTA == "R")
            {

                var boolean = false;

                if(data.TIPOLOGIA_RICHIESTA == 5 &&  !LIB.isValid(data.URL_DOCUMENTO) && data.URL_DOCUMENTO != "" ){
                    if(data.STATO_REFERTO == 0){
                        boolean = true;
                    }
                    data.URL_DOCUMENTO = home.baseGlobal.URL_CONSULENZA+'whale/ServletStampe?report=ASL2/CONSULENZE/VERSIONE_0.RPT&prompt<pIdenTR>='+data.IDEN_RICHIESTA
                }
                else{
                    boolean = true;
                }

                if(data.URL_DOCUMENTO != null && data.URL_DOCUMENTO != '' && data.URL_DOCUMENTO != 'undefined') {
                    var apridocumento = $(document.createElement("a"))
                        .attr("href", "javascript:RICHIESTE.controlloURLDocumento({URL:'" + data.URL_DOCUMENTO + "'},"+boolean+")")
                        .html("<i class=' icon-search' title='Apri documento'>");
                    div.append(apridocumento);
                }



            }



            if (data.TIPOLOGIA_RICHIESTA == 5 && (data.STATO_RICHIESTA == 'I' || data.STATO_RICHIESTA == 'R' || data.STATO_RICHIESTA == 'A'))
            {
                if(data.STATO_RICHIESTA == 'I'){

                    var stampaRichiestaConsulenza = $(document.createElement("a"))
                        .attr("href","javascript:RICHIESTE.stampaRichiestaConsulenza('" + data.IDEN_RICHIESTA + "')")
                        .html("<i class=' icon-print' title='Stampa richiesta consulenza'>");
                    div.append(stampaRichiestaConsulenza);

                }

            }



            if (data.TIPOLOGIA_RICHIESTA == 9)
            {
                var stampaRichiestaConsulenza = $(document.createElement("a"))
                    .attr("href","javascript:RICHIESTE.stampaRichiestaConsulenzaAmb('" + data.IDEN_RICHIESTA + "')")
                    .html("<i class=' icon-print' title='Stampa richiesta consulenza ambulatorio'>");
                div.append(stampaRichiestaConsulenza);
            }


            if(data.TIPOLOGIA_RICHIESTA == 1){
                var stampaRichiestaRadiologia = $(document.createElement("a"))
                    .attr("href","javascript:RICHIESTE.stampaRichiestaRadiologia('" + data.IDEN_RICHIESTA + "')")
                    .html("<i class=' icon-print' title='Stampa Richiesta Radiologia'>");
                div.append(stampaRichiestaRadiologia);

                if(data.STATO_RICHIESTA == "R" || data.STATO_RICHIESTA == "E"){
                    if(data.STATO_RICHIESTA == "E"){
                        var apriImmaginiPacs = $(document.createElement("a"))
                            .attr("href",'javascript:RICHIESTE.apriImmaginiPacsEseguito({accessionNumber:"' + data.ACCESSION_NUMBER + '", patientId:"' + data.PATIENT_ID + '"},"'+data.CDC+'")')
                            .html("<i class=' icon-folder-open' title='Apri immagini pacs'>");
                    }
                    else{
                        var apriImmaginiPacs = $(document.createElement("a"))
                            .attr("href",'javascript:RICHIESTE.apriImmaginiPacs({accessionNumber:"' + data.ACCESSION_NUMBER + '", patientId:"' + data.PATIENT_ID + '"},"'+data.CDC+'")')
                            .html("<i class=' icon-folder-open' title='Apri immagini pacs'>");
                    }
                    if (data.ACCESSION_NUMBER != '' && data.ACCESSION_NUMBER != null) {
                        div.append(apriImmaginiPacs);
                    }
                }
            }

            return div;
        }
    },

    getUrlInfoDatiLabo:function(iden_richiesta, num_nosologico){
        /*var url = "servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&ricovero="+
         jsonData.hCodiceContatto+"&funzione=apriDatiLaboratorio({idenRichiesta:'"+iden_richiesta+"',reparto:'"+
         home.baseUserLocation.cod_cdc+"'})&ModalitaAccesso=REPARTO&provChiamata=CARTELLA";
         url = NS_APPLICATIONS.switchTo('WHALE', url);*/
        //il numero nosologico bisogna prenderlo dalla worklist. per gli obi su cartella il numero è OBI-8-2016-xxxx e non quello di PS

        var num_nos = typeof num_nosologico == 'undefined'? jsonData.hCodiceContatto : num_nosologico ;

        var url =  home.baseGlobal.URL_CARTELLA+"whale/autoLogin?utente=" +
            home.baseUser.USERNAME +
            "&postazione=" + home.AppStampa.GetCanonicalHostname().toUpperCase() +
            "&pagina=CARTELLAPAZIENTEADT&ricovero="+num_nos+"&funzione=apriDatiLaboratorio({idenRichiesta:'"+
            iden_richiesta+"',reparto:'"+home.baseUserLocation.cod_cdc+"'});&ModalitaAccesso=REPARTO&provChiamata=CARTELLA&&ARRIVATO_DA=PS";

        window.open(url,"schedaRicovero","fullscreen=yes");
    },

    /**
     * controlloURLDocumento : controlla se vengono passate una o piu url concatenate
     * @param param
     * @param checkRepository
     */
    controlloURLDocumento : function(param, checkRepository){

        if(!home.NS_FUNZIONI_PS.hasAValue(param)) {
            logger.error("RICHIESTE.controlloURLDocumento : url non defnito");
            return false;
        }

        var arrayUrl = String(param["URL"]).split("|");

        var tableInfoDialog = $(document.createElement("table")).attr({"id": "tblSelezione", "class": "tabledialog"});

        if(arrayUrl.length === 1){

            RICHIESTE.apridocumento(param , checkRepository);

        } else {

            for(var i = 0; i < arrayUrl.length; i++){
                if(home.NS_FUNZIONI_PS.hasAValue(arrayUrl[i])){

                    tableInfoDialog.append($(document.createElement("tr")).attr("id", "tr_" + i)
                            .append($(document.createElement("td")).text("DOCUMENTO "+ Number(i+1)))
                            .css({"text-decoration":"underline","font-weight":"bold"})
                            .append($(document.createElement("td")).attr("class", "tdRadio")
                                .append($(document.createElement("input")).attr({"type": "radio", "name": "selezionaDocumento",
                                    "value": arrayUrl[i]})
                            ))
                    );
                }
            }

            $.dialog(tableInfoDialog, {
                id: "Dialog_seleziona_URL",
                title: "Seleziona Documento",
                width: 500,
                showBtnClose: true,
                movable: true,
                buttons: [
                    {label: "Ok", action: function () {
                        var radioChecked = $("td.tdRadio").find("input:checked");
                        if (radioChecked.val() != null) {
                            param = JSON.parse('{"URL":"'+radioChecked.val()+'"}');
                            $.dialog.hide();
                            RICHIESTE.apridocumento(param , checkRepository);
                        }
                    }},
                    {label: "Chiudi", action: function () {
                        $.dialog.hide();
                    }}
                ]
            });
        }

    },
    /**
     * apridocumento : apre il referto selezionato
     * @param param
     * @param checkRepository
     */
    apridocumento : function(param, checkRepository){

        if(!checkRepository){
            $.dialog("La consulenza e' stata firmata digitalmente ma il suo esito non e' ancora disponibile sull'archivio documentale\n. Ne verra' aperta una rappresentazione non firmata", {
                id: "DialogApriReferto",
                title: "Apertura referto",
                width: 250,
                showBtnClose: true,
                movable: true,
                buttons: [
                    {label: "Si", action: function (ctx) {

                        home.NS_FENIX_PRINT.caricaDocumento(param);
                        param['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;
                        home.NS_FENIX_PRINT.apri(param);
                        $.dialog.hide();
                    }},
                    {label: "No", action: function (ctx) {

                        ctx.data.close();
                        $.dialog.hide();
                    }
                    }
                ]
            });
        }
        else{
            home.NS_FENIX_PRINT.caricaDocumento(param);
            param['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;
            home.NS_FENIX_PRINT.apri(param);
        }

    },

    apriImmaginiPacs:function(param, CDC){
        var url = home.baseGlobal["pacs.url"] +'&server_name='+ home.baseGlobal["pacs.server_name."+CDC+""]+'&accession_number='+param.accessionNumber + "&patient_id=" + param.patientId;
        window.open(url,"schedaImmaginiPacs","fullscreen=yes");
    },

    apriImmaginiPacsEseguito:function(param, CDC){
        var url = home.baseGlobal["pacs.url"] +'&server_name='+ home.baseGlobal["pacs.server_name."+CDC+""]+'&accession_number='+param.accessionNumber + "&patient_id=" + param.patientId;
        var text = "Le immagini che si stanno consultando risultano in stato provvisorio in quanto non &#233; ancora presente un referto firmato digitalmente per questa richiesta";
        $.dialog(text, {
            id: "DiaologImmaginiEseguito",
            title: "Attenzione",
            width: "auto",
            showBtnClose: true,
            movable: true,
            buttons: [
                {label: "Apri", action: function (ctx) {
                    window.open(url,"schedaImmaginiPacs","fullscreen=yes");
                    $.dialog.hide();
                }},
                {label: "Chiudi", action: function (ctx) {

                    ctx.data.close();
                    $.dialog.hide();
                }
                }
            ]
        });


    },

    apriCustodia: function(iden_richiesta,prelievo_effettuato,data_richiesta,stato_richiesta,tipologia_richiesta,id_richiesta2,callback,metodica){



        if(home.baseUser.TIPO_PERSONALE == 'A' || home.baseUser.TIPO_PERSONALE == 'M' ) {
            if(prelievo_effettuato == "S"){
                home.NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=SCHEDA_CATENA_CUSTODIA&STATO_PAGINA='+parent.jsonData.H_STATO_PAGINA.CUSTODIA+'&SCHEDA=CUSTODIA&IDEN_CONTATTO=' + $('#IDEN_CONTATTO').val() + '&IDEN_RICHIESTA='+iden_richiesta, fullscreen: true})
            }
            else{

                $.dialog("Non e' stato effettuato il prelievo. Si desidera effetture il prelievo ?", {
                    id: "DiaologImmaginiEseguito",
                    title: "Attenzione",
                    width: "auto",
                    showBtnClose: true,
                    movable: true,
                    buttons: [
                        {label: "Effettua prelievo", action: function (ctx) {
                            callback = home.NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=SCHEDA_CATENA_CUSTODIA&STATO_PAGINA='+parent.jsonData.H_STATO_PAGINA.CUSTODIA+'&SCHEDA=CUSTODIA&IDEN_CONTATTO=' + $('#IDEN_CONTATTO').val() + '&IDEN_RICHIESTA='+iden_richiesta, fullscreen: true});
                            RICHIESTE.dwrPrelievo(data_richiesta, stato_richiesta,tipologia_richiesta,prelievo_effettuato,id_richiesta2, iden_richiesta, callback, metodica)
                            $.dialog.hide();
                        }},
                        {label: "Chiudi", action: function (ctx) {
                            ctx.data.close();
                            $.dialog.hide();
                        }
                        }
                    ]
                });

            }

        }
        else{
            home.NOTIFICA.warning({message: "Impossibile aprire la scheda di compilazione se non si e' un utente di tipo MEDICO", title: 'Attenzione!'});
        }
    },

    /*apriRefertaConsulenza: function(idenTestata,cdc){
     var table =
     $(document.createElement("table")).attr({"id": "AnamnesiPrecedenti", "class": "tabledialog"})
     .append($(document.createElement("tr")).attr("id", "titoli")
     .append($(document.createElement("td")).text("Username").css({"text-align": "center", "font-weight": "bold"}))
     .append($(document.createElement("td")).append($(document.createElement("input")).attr('id','USER')))

     );
     table.append(
     $(document.createElement("tr")).attr("id", "testi")
     .append($(document.createElement("td")).text('Password').css({"text-align": "justify"}))
     .append($(document.createElement("td")).append($(document.createElement("input")).attr('id','PWD').attr('type','password')))

     );

     $.dialog(table, {
     id: "DialogRefertaConsulenza",
     title: "Apertura refertazione consulenza",
     width: 250,
     showBtnClose: true,
     movable: true,
     buttons: [
     {label: "Accedi", action: function (ctx) {
     var user = $('#USER').val()
     var pwd = $('#PWD').val();
     //var url =home.baseGlobal.URL_CARTELLA + 'whale/autoLogin?utente='+user+'&postazione='+home.basePC.IP+'&pagina=REFERTA_CONSULENZE&opener=PS&idenTestata='+idenTestata+'&idRemoto=TSTNRC88B03F839V&PWD='+pwd;
     //RICHIESTE.checkUser(user)
     var url =home.baseGlobal.URL_CARTELLA + 'whale/autoLogin?utente='+user+'&postazione='+home.AppStampa.GetCanonicalHostname().toUpperCase()+'&pagina=REFERTA_CONSULENZE&opener=PS&idenTestata='+idenTestata+'&idRemoto=TSTNRC88B03F839V&PWD='+pwd;

     var params = {
     user : {t:"V", v:user},
     repartoDestinatario : {t:"V", v:cdc}
     };

     var parametri = {
     "datasource": "WHALE",
     id: "OE.CHECK_USER_REFERTA",
     "params": params,
     "callbackOK": callbackOk
     };

     NS_CALL_DB.SELECT(parametri);

     function callbackOk(data) {
     if(data.result.length == 0){
     home.NOTIFICA.error({message: "Utente non abilitato", title: "Error", timeout: 6, width: 220});
     return false;
     }
     else{
     window.open(url,null,"fullscreen=yes");
     }
     }



     $.dialog.hide();
     }},
     {label: "Chiudi", action: function (ctx) {

     ctx.data.close();
     $.dialog.hide();
     }
     }
     ]
     });
     },*/

    /**  Apre la scheda richiesta di whale
     * @param {type} idenAnag : radsql.anag.iden
     * @param {type} idenRichiesta : infoweb.testata_richieste.iden
     * @param {type} readonly : default false
     * @returns {undefined}
     */
    apriRichiesta : function(idenAnag, idenRichiesta, readonly){
//        var url = "servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&iden_anag="+idenAnag+"&funzione=apriRichiesta(" + idenRichiesta + ", '" + (readonly?"N":"S") + "');&ModalitaAccesso=REPARTO&provChiamata=CARTELLA";
//        url = NS_APPLICATIONS.switchTo('WHALE', url);
        var url =   home.baseGlobal.URL_CARTELLA + 'whale/autoLogin?utente=' +
            home.baseUser.USERNAME +
            '&postazione=' + home.AppStampa.GetCanonicalHostname().toUpperCase() +
            '&pagina=CARTELLAPAZIENTEADT&iden_anag='+idenAnag+"&ricovero="+jsonData.hCodiceContatto+"&funzione=apriRichiesta(" + idenRichiesta + ", '" + (readonly?"N":"S") + "');&ModalitaAccesso=REPARTO&provChiamata=CARTELLA&&ARRIVATO_DA=PS";
        window.open(url,"schedaRicovero","fullscreen=yes");

    },
    /**
     * funzione richiamata per stampare la richiesta di consulenza
     * @param idenRichiesta
     * @param stampa
     */
    stampaRichiestaConsulenza:function(idenRichiesta, stampa){
        home.NS_STAMPE_PS.stampaRichiestaConsulenza(idenRichiesta, stampa);
    },

    stampaRichiestaConsulenzaAmb: function(idenRichiesta, stampa){
        home.NS_STAMPE_PS.stampaRichiestaConsulenzaAmb(idenRichiesta, stampa);
    },

    stampaRefertoConsulenza:function(idDettaglio, stampa){
        window.open( home.baseGlobal.URL_CARTELLA + '/ambulatorio_non_strumentale/elabStampa?stampaFunzioneStampa=RICEVUTA_PRENO_STD&stampaSelection={'+idDettaglio+'} in ['+idDettaglio+']&stampaAnteprima=N&stampaIdenEsame='+idDettaglio+'&stampaReparto=AMB_ORT_SV')
    },
    stampaRichiestaRadiologia:function(idTestata, struttura,stampa){
        home.NS_STAMPE_PS.stampaRichiestaRadiologia(struttura,idTestata, "N");
    },

    /**
     * Funzione che lancia la procedura per settare il prelevato a S
     *
     * Elenco dei controlli da fare :
     * controllo sulla data -> deve essere uguale a oggi
     * Stato della richiesta e a seconda della tipologia di richiesta cambia lo stato
     * sulla tipologia della richiesta
     * se il prelievo era stato già effettuato o no
     * se l'id_richiesta 2 è popolato nel caso in cui abbiamo la richiesta di laboratorio
     */
    dwrPrelievo: function (dataRichiesta, statoRichiesta,tipoRichiesta,prelievoEffettuato,idRichiesta2, idenRichiesta, callBack, metodica) {
        if(typeof callBack != 'function'){
            callBack = RICHIESTE.wkRichieste.loadWk();
        }
        logger.debug( 'parametri dwrPrelievo  = ' + dataRichiesta + ' - ' + statoRichiesta  + ' - ' + tipoRichiesta+ ' - ' + prelievoEffettuato+ ' - ' +idRichiesta2);

        // controllo sulla data
        if((moment(dataRichiesta, "DD/MM/YYYY").diff(moment()))/(1000*60*60*24) < 1){
            // controllo sullo stato della richiesta -> deve essere I o tipoRichiesta = 3 & stato richiesta = 'P'
            if(statoRichiesta=='I' || (statoRichiesta=='P' && tipoRichiesta=='3')){
                //  sulla tipologia della richiesta
                if(tipoRichiesta=='0' || tipoRichiesta=='3'){
                    //  se il prelievo era stato già effettuato o no
                    if(prelievoEffettuato=='N'){

                        if (idRichiesta2!=''  &&  tipoRichiesta=='0'){

                            var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE',async:false}});
                            //  PROCEDURE SP_LABO_PRELIEVO (iIdenTestata IN VARCHAR2 , iUtente IN number, outIdenTestata OUT VARCHAR2);

                            var param = {
                                "iIdenTestata": String(idenRichiesta),
                                "iUtente": Number(home.baseUser.IDEN_PER),
                                "outIdenTestata" : {d:'O',t:'V'}
                            };
                            logger.debug( 'parametri passati alla procedura infoweb.SP_PS_LABO_PRELIEVO ='+  JSON.stringify(param));

                            var xhr = db.call_procedure({
                                id: "infoweb.SP_PS_LABO_PRELIEVO",
                                parameter: param
                            });

                            xhr.done(function (data) {

                                if (data.outIdenTestata == null) {
                                    home.NOTIFICA.success({
                                        message: 'Prelievo effettuato',
                                        timeout: 2,
                                        title: 'Success'
                                    });
                                    callBack();
                                } else {
                                    logger.error(JSON.stringify(data));
                                    home.NOTIFICA.error({
                                        message: data.outIdenTestata,
                                        title: "Error"
                                    });
                                }
                            });
                            xhr.fail(function (jqXHR) {
                                logger.error('xhr fail ' + JSON.stringify(jqXHR));
                                home.NOTIFICA.error({
                                    message: 'Errore nel prelevato',
                                    title: "Error"
                                });
                            });

                        }else{
                            logger.debug("idRichiesta2 = " + idRichiesta2 + ' tipoRichiesta = ' + tipoRichiesta);
                            home.NOTIFICA.error({message: 'Prelevato non effettuato ',title: "Error"});
                        }
                    }else{
                        logger.debug("Prelievo già effettuato");
                        home.NOTIFICA.error({message: "Prelievo gia' effettuato ",title: "Error"});
                    }
                } else{
                    logger.debug("tipo richiesta " + tipoRichiesta);
                    home.NOTIFICA.error({message: 'Prelevato non effettuato ',title: "Error"});
                }
            }else{
                logger.debug("Stato richiesta = "+ statoRichiesta +' E tipo richiesta = '+  tipoRichiesta);
                home.NOTIFICA.error({message: 'Prelevato non effettuato ',title: "Error"});
            }
        }else{
            home.NOTIFICA.error({message: 'Richiesta effettuata da più di un giorno ',title: "Error"});
            logger.debug('Differenza tra data richiesta e oggi =  '+ (moment(dataRichiesta, "DD/MM/YYYY").diff(moment()))/(1000*60*60*24));
        }
    },
    /**
     * Funzione che stampa le etichette sul click
     *
     * url da chiamare
     * http://10.99.1.129:8082/whale/ServletStampe?report=ASL2/LABO_ETI_WHALE.rpt&prompt<pRichieste>=831516
     */
    stampaEtichetta: function (DATA_RICHIESTA, STATO_RICHIESTA, TIPOLOGIA_RICHIESTA,PRELIEVO_EFFETTUATO, idenRichiesta,idenRichiesta2, metodica) {
        var par = {};

        function stampaEtichetta(){

            //stampante presente sulla tabella PC.
            if(typeof home.basePC.STAMPANTE_ETICHETTE == 'undefined'){
                logger.error("INSERIRE SU config_web.PC cercando per ip = nomeHost");
                return home.NOTIFICA.error({message: "Errore : Nessuna stampante etichetta assegnata a questo PC contattare l'assistenza",title: "Error"});
            }else{
                par.STAMPANTE = home.basePC.STAMPANTE_ETICHETTE;
            }

            par.CONFIG='{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[50,30,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}';
            par.URL = home.baseGlobal.URL_STAMPA_ETICHETTE+"&promptpRichieste="+idenRichiesta+"&timestamp=" + new Date().getTime();
            par.okCaricaDocumento = function() {home.NS_FENIX_PRINT.stampa(par);};

            logger.debug("Stampa : parametri" + JSON.stringify(par));

            home.NS_FENIX_PRINT.caricaDocumento(par);
            RICHIESTE.wkRichieste.loadWk();
        }

        /**Se ancora non è stato dato il prelevato va dato il prelevato e successivamente la stampa dell'etichetta*/
        if (PRELIEVO_EFFETTUATO == 'N' && RICHIESTE.contatto.stato.codice != 'DISCHARGED'){
            RICHIESTE.dwrPrelievo(DATA_RICHIESTA, STATO_RICHIESTA,TIPOLOGIA_RICHIESTA, PRELIEVO_EFFETTUATO,idenRichiesta2, idenRichiesta ,stampaEtichetta ,metodica);
        }else
        {
            stampaEtichetta();
        }

    },
    /**
     * Funzione che Elimina la Richiesta direttamente dalla WK Richieste
     * @param rec
     */
    eliminaRichiesta : function(rec){

        $.dialog("Si desidera Eliminare la Richiesta e le eventuali prestazioni correlate?", {
            title: "Attenzione",
            buttons: [
                {label: "NO", action: function () {
                    $.dialog.hide();
                }},
                {label: "SI", action: function () {
                    RICHIESTE.callSPAnnullaRichiesta({
                        iden_richiesta : rec.IDEN_RICHIESTA,
                        callback : function(){
                            RICHIESTE.EliminaPrestazioneAssociata({
                                iden_richiesta : rec.IDEN_RICHIESTA,
                                callback : function(){
                                    document.location.replace(document.location);
                                }
                            });
                        }
                    });
                    $.dialog.hide();
                }}
            ]
        });
    },

    callSPAnnullaRichiesta : function(json){

        var params = {
            "p_id_richiesta": {"v": json.iden_richiesta, "t":"N"},
            "p_motivo":  "",
            "p_iden_per": home.baseUser.IDEN_PER,
            "sOut" : {"d":'O',"t":'V'}
        };

        var parametri = {
            "datasource": "WHALE",
            id: "INFOWEB.OE_RICHIESTE.SP_ANNULLA_RICHIESTA",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk(data) {
            if (data.sOut == "OK")
            {
                home.NOTIFICA.success({message: "Richiesta annulata con successo",timeout: 2,title: 'Success'});
                json.callback();
            }
            else
            {
                logger.error(JSON.stringify(data));
                home.NOTIFICA.error({message: "Eliminazione non riuscita " + data.sOut,title: "Error"});
            }
        }
    },

    EliminaPrestazioneAssociata : function(json){

        var params = {
            "pIdenUtente"           : {t:"N", v: home.baseUser.IDEN_PER},
            "pIdenTestataRichieste" : {t:"N", v: json.iden_richiesta}
        };

        var parametri = {
            "datasource": "PS",
            id: "ELIMINA_PRESTAZIONE_ASSOCIATA",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk(data) {
            logger.info("CODICI ESTERNI : " +JSON.stringify(data));
            json.callback();
        }
    },

    checkMezzoDiContrasto : function(json){

        var params = {
            iden_richiesta : {t:"N", v:json.idenRichiesta}
        };

        var parametri = {
            "datasource": "WHALE",
            id: "OE.MEZZO_DI_CONTRASTO",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            if(data.result[0].MDC_SINO > 0){
                json.callback();
            }
        }
    },

    checkPrenotazioneDiretta : function(json){
        var params = {
            iden_richiesta : {t:"N", v:json.idenRichiesta}
        };

        var parametri = {
            "datasource": "WHALE",
            id: "OE.PRENOTA_SI_NO",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            if(data.result[0].PRENOTA_SI > 0){
                json.callback();
            }
        }
    },


    stampaMezzoContrasto : function(idenContatto){

        var afterStampa = function(){home.NS_STAMPE_PS.setDataStampa(idenContatto,"INFO_ESAMI_RADIO_MEZZO_CONTRASTO",home.baseUser.IDEN_PER);};
        home.NS_STAMPE_PS.stampaMezzoContrasto(idenContatto, 'S', afterStampa );

    }
};