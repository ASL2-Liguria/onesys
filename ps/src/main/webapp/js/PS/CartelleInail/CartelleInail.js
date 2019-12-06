$(function () {
    CARTELLE_INAIL.init();
    CARTELLE_INAIL.setEvents();
});

var CARTELLE_INAIL = {

    dimensioneWk: null,
    intervalToCheck: '',
    thisUser : home.baseUser.IDEN_PER,

    init: function () {

        NS_FENIX_WK.beforeApplica  = CARTELLE_INAIL.beforeApplica;

        home.SCLogout = function () {
            home.NS_WORKSTATION_PS.logoutSmartCard();
        };
        home.NS_FENIX_TOP.callAfterLogout = function () {
            home.NS_WORKSTATION_PS.callAfterLogout();
        };
        home.NS_SMARTCARD.afterLogin = function () {
            var newUser = home.baseUser.IDEN_PER,
                controllo = false;

            if(CARTELLE_INAIL.thisUser != newUser){ controllo = true; }

            home.NS_WORKSTATION_PS.loginSmartCardSbloccaWK(controllo);
        };


        CARTELLE_INAIL.calcolaDimensioneWk();
        CARTELLE_INAIL.initWkCartelleInail();

        home.CARTELLE_INAIL = {};
        home.CARTELLE_INAIL.caricaWk = CARTELLE_INAIL.caricaWk;
    },

    setEvents: function () {
        $("#txtCognomeCartelleInail, #txtNomeCartelleInail").on("change keyup", function(){CARTELLE_INAIL.nomeCognomeOnlyGestione($(this))});
        $("#txtAnno, #txtCartella").on("change keyup", function(){CARTELLE_INAIL.annoCartellaReadOnly($(this))});
        $("#txtDaDataCartelleInail, #txtADataCartelleInail").on("change",function(){CARTELLE_INAIL.gestDateCartelleInail(this)});

        $("#lblResetCampiCartelleInail").click(function () {
            CARTELLE_INAIL.resetFiltriCartelleInail();
            CARTELLE_INAIL.initWkCartelleInail('notdate');
        });
    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== typeof value) && ("undefined" !== value) && ("null" !== value));
    },

    calcolaDimensioneWk: function () {
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        CARTELLE_INAIL.dimensioneWk = contentTabs - margine;
    },

    initWkCartelleInail: function (notDate) {

        if(typeof notDate == 'undefined'){
            $("#txtDaDataGestEsito").val(moment().add(-home.baseGlobal.RANGE_GESTIONE_ESITO, 'days').format("DD/MM/YYYY"));
            $("#h-txtDaDataGestEsito").val(moment().add(-home.baseGlobal.RANGE_GESTIONE_ESITO, 'days').format("YYYYMMDD"));

            $("#txtADataGestEsito").val(moment().format("DD/MM/YYYY"));
            $("#h-txtADataGestEsito").val(moment().format("YYYYMMDD"));
        }


        CARTELLE_INAIL.WkCartelleInail = new WK({
            id: "PS_WK_CARTELLE_INAIL",
            container: "divWk",
            loadData: false
        });
        CARTELLE_INAIL.WkCartelleInail.loadWk();
    },

    caricaWk: function () {
        CARTELLE_INAIL.WkCartelleInail.loadWk();
    },

    checkExistConsolleRefertazione: function (win) {
        if (win.closed) {
            CARTELLE_INAIL.initWkConsulenze();
            clearInterval(CARTELLE_INAIL.intervalToCheck);
        }
    },

    setFunzioni : function (data, wk) {

        var div = $(document.createElement("div"));



        var apriCartellaPS = $(document.createElement("a"))
            .attr("href", "javascript:CONSULENZE.apriCartellaPS({nosologico:'" + data.NUMERO_PRATICA +
                "',iden_anagrafica:'" + data.IDEN_ANAG + "'})")
            .html("<i class=' icon-search' title='Apri Cartella'>");
        div.append(apriCartellaPS);

        return div;
    },

    apriCartellaPS: function (par) {

        var parametri = {
            "datasource": "PS",
            id: "CONTATTO.Q_DATI_CONSULENZA_PRONTO",
            "params": par,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            rec = data.result;
            var url = 'page?KEY_LEGAME=CARTELLA&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA + '&IDEN_CONTATTO=' +
                rec[0].IDEN_CONTATTO + '&IDEN_PROVENIENZA=' + rec[0].IDEN_PROVENIENZA + '&IDEN_CDC_PS=' + rec[0].IDEN_CDC +
                '&CODICE_FISCALE=' + rec[0].CODICE_FISCALE + '&IDEN_LISTA=' + rec[0].IDEN_LISTA +
                '&TEMPLATE=LISTA_ATTESA/ListaAttesaFooter.ftl&WK_APERTURA=LISTA_CHIUSI&MENU_APERTURA=APRI_CARTELLA' +
                '&STATO_PAGINA=R&AVVISO=CONSULENZE';
            home.NS_FENIX_TOP.apriPagina({url: url, fullscreen: true});

        }
    },



    beforeApplica : function (param) {


        if(typeof param != 'undefined' && param != "undefined" && param!== "" && param !== null){
            return true;
        }
        else {

                CARTELLE_INAIL.checkRange();
                return true;



        }
    },



    checkRange: function(){
        var daData = $("#h-txtDaDataCartelleInail").val();
        var aData = $("#h-txtADataCartelleInail").val();
        var nome = $("#txtNomeCartelleInail").val();// != '' ? $("#txtNomeGestioneEsito").val() : null;
        var cognome = $("#txtCognomeCartelleInail").val();// != '' ? $("#txtCognomeGestioneEsito").val() : null;
        var cartella =$("#txtCartella").val();// != '' ? $("#txtCartella").val() : null;
        var anno = $("#txtAnno").val() ;//!= '' ? $("#txtAnno").val() : null;
        var p = "";

        if (daData != "" && aData != ""){


            var diffDate = moment(aData,"YYYYMMDD").diff(moment(daData,"YYYYMMDD"));
            diffDate = moment.duration(diffDate).asDays();


            if(diffDate >= 2 && diffDate <= 15 && anno == "" && cartella == "" && nome == "" && cognome == ""){

                if(diffDate > 2){

                    var text= "Il caricamento della lista potrebbe richiedere un po' di tempo. Procedere comunque?"
                    $.dialog(text, {
                        id: "DiaologFiltroDate",
                        title: "Attenzione",
                        width: "auto",
                        showBtnClose: true,
                        movable: true,
                        buttons: [
                            {label: "Si", action: function (ctx) {
                                //NS_WK_PS.caricaWkGestioneEsito()
                                CARTELLE_INAIL.definisciQueryWKCartelleInail();


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

                else if (diffDate == 2) {

                    CARTELLE_INAIL.definisciQueryWKCartelleInail();


                }


            }

            else if (diffDate > 15){
                var text= "E' stato scelto un range troppo grande. La lista non verra' caricata"
                $.dialog(text, {
                    id: "DiaologFiltroDate",
                    title: "Attenzione",
                    width: "auto",
                    showBtnClose: true,
                    movable: true,
                    buttons: [
                        {label: "ok", action: function (ctx) {
                            ctx.data.close();
                            $.dialog.hide();
                        }}
                    ]
                });
            }

            else {
                CARTELLE_INAIL.definisciQueryWKCartelleInail();


            }

        }


        else{
            CARTELLE_INAIL.definisciQueryWKCartelleInail();


        }







    },



    definisciQueryWKCartelleInail : function(){

        var cognomeCampo = $("#txtCognomeCartelleInail");
        var nomeCampo = $("#txtNomeCartelleInail");
        var cartellaCampo =  $("#txtCartella");
        var annoCampo = $("#txtAnno");

        var nome = nomeCampo.val();// != '' ? $("#txtNomeGestioneEsito").val() : null;
        var cognome = cognomeCampo.val();// != '' ? $("#txtCognomeGestioneEsito").val() : null;
        var cartella = cartellaCampo.val();// != '' ? $("#txtCartella").val() : null;
        var anno = annoCampo.val() ;//!= '' ? $("#txtAnno").val() : null;
        var daData = $("#h-txtDaDataCartelleInail").val();
        var aData = $("#h-txtADataCartelleInail").val();

        if(daData != "" && aData != "") {
            var diffDate = moment(aData, "YYYYMMDD").diff(moment(daData, "YYYYMMDD"));
            diffDate = moment.duration(diffDate).asDays();
        }

        var p = { "SUCCESS" : true, "QUERY" : "" };

        if( nome == "" && cognome == "" && anno == "" && cartella == "" && daData == "" && aData== "" ){
            home.NOTIFICA.warning({message: 'Valorizzare almeno un filtro', title : 'Warning'});
            p.SUCCESS = false;
        }
        /*else if (nome == "" && cognome == "" && cartella == "" && anno != "" ){
         home.NOTIFICA.warning({message: 'Impossibile filtrare solo per anno. Valorizzare almeno un altro filtro', title:'Warning'});
         p.SUCCESS = false;
         }*/


        else if(daData != "" && aData== "" || daData == "" && aData != ""){
            home.NOTIFICA.warning({message: 'Valorizzare entrambi i filtri date', title:'Warning'});
            p.SUCCESS = false;
        }else if(nome != "" && cognome== "" || nome == "" && cognome != ""){
            home.NOTIFICA.warning({message: 'Valorizzare sia il nome che il cognome', title:'Warning'});
            p.SUCCESS = false;
        }


        if(cartella.length > 0){
            //cartella e/o anno valorizzati
            //svuoto nome cognome da data a data
            if(daData == "" && aData== ""){
                p.QUERY = "WORKLIST.CARTELLE_INAIL_BY_CARTELLA";
            }else{
                p.QUERY = "WORKLIST.CARTELLE_INAIL_BY_CARTELLA_DATA";
            }
        }else if(nome != '' && cognome != '') {
            //valorizzato nome e cognome
            //svuoto anno cartella
            if(daData == "" && aData== ""){
                p.QUERY = "WORKLIST.CARTELLE_INAIL_BY_DATI_ANAGRAFICI";
            }else{
                p.QUERY = "WORKLIST.CARTELLE_INAIL_BY_DATI_ANAGRAFICI_DATA";
            }
        }else if(nome == '' && cognome == '' && cartella.length == 0 && daData != "" && aData != ""){
            p.QUERY = "WORKLIST.CARTELLE_INAIL_DATA";
        }



        logger.debug("WK Esiti caricata con query -> " + p.QUERY);

        $("#divWk").worklist().config.structure.id_query = p.QUERY;


        if(cognome.length < 3 && cognome.length > 0 && nome != "" && cartella == "" && ((diffDate > 2 && aData != "" && aData != "") || (daData == "" && aData == "")) ){
            var text= "Inseriti solo due caratteri. Il caricamento della lista potrebbe richiedere un po' di tempo. Procedere comunque?"
            $.dialog(text, {
                id: "DiaologFiltroDate",
                title: "Attenzione",
                width: "auto",
                showBtnClose: true,
                movable: true,
                buttons: [
                    {label: "Si", action: function (ctx) {

                        p.SUCCESS = true;
                        CARTELLE_INAIL.setQuery(p)

                        $.dialog.hide();
                    }},
                    {label: "No", action: function (ctx) {
                        p.SUCCESS = false;
                        ctx.data.close();
                        $.dialog.hide();
                    }
                    }
                ]
            });
        }
        else{
            CARTELLE_INAIL.setQuery(p);
        }









    },


    apriAnagrafica: function(rec){
        var url = 'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=E&IDEN_ANAG='+ rec[0].IDEN_ANAG +'&IDEN_CONTATTO='+rec[0].IDEN_CONTATTO+'&WK_APERTURA=CARTELLE_INAIL';
        home.NS_FENIX_TOP.apriPagina({url:url, id:'insAnag',fullscreen:true});
    },





    setQuery: function(obj){
        logger.debug("Applica WK esito -> " + JSON.stringify(obj));

        if (obj.SUCCESS) {

            NS_FENIX_FILTRI.applicaFiltri()
        } else {
            return false;
        }
    },



    gestDateCartelleInail:function (scope) {


        var daData = $("#txtDaDataCartelleInail");
        var aData = $("#txtADataCartelleInail");
        var HdaData = $("#h-txtDaDataCartelleInail");
        var HaData = $("#h-txtADataCartelleInail");
        var aDataMoment = moment(HaData.val(), 'YYYYMMDD');
        var daDataMoment = moment(HdaData.val(), 'YYYYMMDD');
        var diffGestioneEsito = parseInt(home.baseGlobal.RANGE_GESTIONE_ESITO) ;

        try {
            var aDataMoment14 =  moment(HdaData.val(), 'YYYYMMDD').add(diffGestioneEsito, 'days');
            var daDataMoment14 =  moment(HaData.val(), 'YYYYMMDD').add(-diffGestioneEsito, 'days');
        }catch(e){
            logger.debug(e.message);
            return;
        }

        if(scope.id == 'txtDaDataCartelleInail'){
            /**
             * se modifico da data ci sono 4 casi
             * 1) se rientra nel range di 2 settimane dal campo A data non fare nulla
             * 2) se è futura a oggi metti oggi e messaggio d'avviso
             * 3) se è futura adata metti adata +2 settimane ma non superiore ad oggi
             * 4) se è fuori range dal campo a data imposto il campo a data a daData + 14 giorni
             * 5) se a data è vuoto lo valorizzo con 14 gg in +
             * */

            logger.debug("daDataMoment = " + daDataMoment.format("DD/MM/YYYY") + " aDataMoment = " + aDataMoment.format("DD/MM/YYYY"));

            if(aDataMoment.diff(daDataMoment, 'days') >= 0 && aDataMoment.diff(daDataMoment, 'days') <= diffGestioneEsito){
                logger.debug("Diff = " + aDataMoment.diff(daDataMoment, 'days'));

            }else if(HdaData.val() > moment().format("YYYYMMDD") ){
                logger.debug("daDataMoment = " + daDataMoment + " moment = " + moment());
                home.NOTIFICA.warning({message: 'Attenzione impossibile impostare una data futura', title : 'Warning'});
                daData.val(moment().format("DD/MM/YYYY"));
                HdaData.val(moment().format("YYYYMMDD"));
                aData.val(moment().format("DD/MM/YYYY"));
                HaData.val(moment().format("YYYYMMDD"));

            }else if(daDataMoment >= aDataMoment){
                logger.debug("daDataMoment = " + daDataMoment + " aDataMoment = " + aDataMoment);

                if(aDataMoment14 >= moment()){
                    aData.val(moment().format("DD/MM/YYYY"));
                    HaData.val(moment().format("YYYYMMDD"));

                }else{
                    aData.val(aDataMoment14.format("DD/MM/YYYY"));
                    HaData.val(aDataMoment14.format("YYYYMMDD"));
                }
            }else{
                logger.debug("ULTIMO IF CAMBIO A DATA -> " +aDataMoment14.format("DD/MM/YYYY"));
                aData.val(aDataMoment14.format("DD/MM/YYYY"));
                HaData.val(aDataMoment14.format("YYYYMMDD"));

            }

        }else if(scope.id == 'txtADataCartelleInail'){
            /**
             * se modifico adata ci sono 4 casi
             * 1) se rientra nel range di 2 settimane dal campo da data non fare nulla
             * 2) se è futura a oggi metti oggi e messaggio d'avviso
             * 3) se è prima di dadata metti dadata -2 settimane
             * 4) se è fuori range dal campo dadata imposto il campo dadata a  a Data - 14 giorni
             * 5) se da data è vuoto valorizzo con -14
             * */
            logger.debug("daDataMoment = " + daDataMoment.format("DD/MM/YYYY") + " aDataMoment = " + aDataMoment.format("DD/MM/YYYY"));

            if(aDataMoment.diff(daDataMoment, 'days') >= 0 && aDataMoment.diff(daDataMoment, 'days') <= diffGestioneEsito ){
                logger.debug("Diff = " + aDataMoment.diff(daDataMoment, 'days'));

            }else if(HaData.val() > moment().format("YYYYMMDD")){
                logger.debug("daDataMoment = " + daDataMoment + " moment = " + moment());
                home.NOTIFICA.warning({message: 'Attenzione impossibile impostare una data futura', title : 'Warning'});
                daData.val(daDataMoment14.format("DD/MM/YYYY"));
                HdaData.val(daDataMoment14.format("YYYYMMDD"));
                aData.val(moment().format("DD/MM/YYYY"));
                HaData.val(moment().format("YYYYMMDD"));
            }else {
                logger.debug("UTLIMO IF");
                daData.val(daDataMoment14.format("DD/MM/YYYY"));
                HdaData.val(daDataMoment14.format("YYYYMMDD"));
            }

        }else{
            logger.error("Caso non previsto gestDateCartelleInail -> " + scope.id)
        }
    },


    nomeCognomeOnlyGestione: function(campo){

        var campoAnno = $("#txtAnno");
        var campoCartella = $("#txtCartella");
        var campoNome = $("#txtNomeCartelleInail");
        var campoCognome = $("#txtCognomeCartelleInail");

        if (campo.val() !== "") {
            campoAnno.val("").attr("disabled", "disabled").css("background-color","#D8D8D8");
            campoCartella.val("").attr("disabled", "disabled").css("background-color","#D8D8D8");
        }
        else if(campoNome.val() == "" && campoCognome.val() == ""){

            campoAnno.val("").removeAttr("disabled").css("background-color","white");
            campoCartella.val("").removeAttr("disabled").css("background-color","white");
        }

    },

    annoCartellaReadOnly: function(campo) {

        var campoAnno = $("#txtAnno");
        var campoCartella = $("#txtCartella");
        var campoNome = $("#txtNomeCartelleInail");
        var campoCognome = $("#txtCognomeCartelleInail");

        if (campo.val() !== "") {

            campoNome.val("").attr("disabled", "disabled").css("background-color","#D8D8D8");
            campoCognome.val("").attr("disabled", "disabled").css("background-color","#D8D8D8");
        }
        else if(campoAnno.val() == "" && campoCartella.val() == ""){

            campoNome.val("").removeAttr("disabled").css("background-color","white");
            campoCognome.val("").removeAttr("disabled").css("background-color","white");
        }

    },

    resetFiltriCartelleInail : function(){



        $("#txtCognomeCartelleInail, #txtNomeCartelleInail, #txtAnno, #txtCartella, #txtADataCartelleInail, #h-txtADataCartelleInail, #txtDaDataCartelleInail, #h-txtDaDataCartelleInail ").val("").removeAttr("disabled").css("background-color","white");

    }










};


var CARTELLE_INAIL_STAMPE = {

    stampaVerbale: function (idenContatto, stampa, afterStampa, pConfig, pStato) {

        logger.debug("stampaVerbale - idenContatto -> " + idenContatto + "; stampa-> " + stampa + "; afterStampa -> " + afterStampa + "; pConfig -> " + pConfig + "; pStato-> " + pStato);
        var stato = typeof pStato == "undefined" ? null : pStato;
        var firma = stato == 'F' ? 'S' : 'N';

        var url = 'http://'+ document.location.host + document.location.pathname.match(/\/.*\//) +  "jsp/PS/verbale.jsp?idenContatto="+ idenContatto + '&sito=PS&firma='+firma + '&stato='+stato+'&bozza=N';
        logger.debug(url);

        var _par = {URL:url};
        home.NS_FENIX_PRINT.caricaDocumento(_par);



        // Merge configurazioni di PARAMETRI con quelle invocate nel contesto
        if (typeof pConfig !== "undefined") {
            home.NS_FENIX_PRINT.config = $.extend({}, home.NS_FENIX_PRINT.config, JSON.parse(pConfig));
        }




        var param = {
            "STAMPA_IMMEDIATA": stampa,
            "afterStampa": function () {
                home.NS_FENIX_PRINT.config = null;
            },
            "beforeApri": home.NS_FENIX_PRINT.initStampa
        };

        if (stampa === "S") {
            home.NS_FENIX_PRINT.stampa(param);
        } else {
            home.NS_FENIX_PRINT.apri(param);
        }






        },


    stampaInail: function (idenContatto, stampa, afterStampa, pConfig, pStato, pIdenTabella) {


        var stato = typeof pStato == "undefined" ? null : pStato;

        logger.debug("stampaVerbale - idenContatto -> " + idenContatto + "; stampa-> " + stampa + "; afterStampa -> " +
        afterStampa + "; pConfig -> " + pConfig + "; pStato-> " + pStato);

        // Carico un documento di anteprima per evitare di visualizzare un report vecchio in caso di errore
        home.NS_FENIX_PRINT.caricaDocumento({"PRINT_REPORT": "BLANK", "PRINT_DIRECTORY": "1", "PRINT_PROMPT": "&promptpMessage=" +
        escape("CARICAMENTO ANTEPRIMA INAIL")});

        var param = {
            "STAMPA_IMMEDIATA": stampa,
            "afterStampa": function () {
                home.NS_FENIX_PRINT.config = null;
            },
            "beforeApri": home.NS_FENIX_PRINT.initStampa
        };

        // Se verbale firmato lo apro dal PDF BASE64 salvato su DB
        if (stato == "F") {
            CARTELLE_INAIL_STAMPE.apriDocumentoFirmato(param, pIdenTabella, "PS.VISUALIZZA_PDF_SCHEDA", "PS");
        }
        else {
            // Se registrato genero l'aneprima dinamicamente
            param["PRINT_REPORT"] = "INAIL";
            param["PRINT_DIRECTORY"] = "1";
            param["PRINT_PROMPT"] = "&promptpIdenContatto=" + idenContatto + '&promptpFirma=N&promptpBozza=N' + '&promptpStatoModulo=' + stato;

            home.NS_FENIX_PRINT.caricaDocumento(param);

            if (param["STAMPA_IMMEDIATA"] === "S") {
                home.NS_FENIX_PRINT.stampa(param);
            } else {
                home.NS_FENIX_PRINT.apri(param);
            }
        }
    },


    apriDocumentoFirmato: function (pParam, pIdenDocumento, pQuery, pDatasource) {

        pParam["URL"] = home.NS_FENIX_TOP.getAbsolutePathServer() + 'showDocumentoAllegato?IDEN=' + pIdenDocumento +
        "&QUERY=" + pQuery + "&DATASOURCE=" + pDatasource;
        pParam['beforeApri'] = home.NS_FENIX_PRINT.initStampa;

        logger.debug("Pre anteprima doc firmato : params -> " + JSON.stringify(pParam));
        logger.debug("numero stampe : " + home.NS_FENIX_PRINT.config);

        home.NS_FENIX_PRINT.caricaDocumento(pParam);

        if (pParam["STAMPA_IMMEDIATA"] === "S") {
            home.NS_FENIX_PRINT.stampa(pParam);
        } else {
            home.NS_FENIX_PRINT.apri(pParam);
        }
    }
}