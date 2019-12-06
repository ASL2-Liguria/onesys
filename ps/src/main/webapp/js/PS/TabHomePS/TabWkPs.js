/**
 * User: Matteopi + carloG
 * Date: 10/07/14
 * Usage: Funioni legate alle wk
 */
jQuery(document).ready(function () {
    NS_WK_PS.init();
    NS_WK_PS.setEvents();
    NS_WK_PS.altezzaDivWK = $("#divWk").height();

});

var NS_WK_PS = {

    wk_codici_missione: null,
    wk_anagrafica: null,
    wk_lista_attesa: null,
    wk_lista_aperti: null,
    wk_obi: null,
    wk_gestione_esito: null,
    wk_cancellati : null,
    refresh_wk : true,
    time_reload : null,
    altezzaDivWK: null,
    wkMissioniHidden : false,


    init: function () {
        home.NS_CONSOLEJS.addLogger({name: 'HomeWkPS', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['HomeWkPS'];
        home.NS_WK_PS = this;
        NS_FENIX_WK.beforeApplica  = NS_WK_PS.beforeApplica;
        NS_WK_PS.evidenziaFiltro();

        $(".tdData input").not("#dateData").attr("readonly","readonly");
        if(home.baseUser.TIPO_PERSONALE == "M" || home.baseUser.TIPO_PERSONALE == "OST" || home.baseUser.TIPO_PERSONALE == "A"){
            NS_WK_PS.wkMissioniHidden = true;
        }


    },

    setEvents: function () {

        $(".butApplicaMissione").on("click",function(){
           NS_WK_PS.caricaWkCodiciMissione();
        });

        $("#lblResetCampi").click(function () {
            NS_WK_PS.resetFiltriAnag();
            NS_WK_PS.startWorklist();
        });

        $("#lblResetCampiGestione").click(function () {
            NS_WK_PS.resetFiltriGestione();
            NS_WK_PS.caricaWkGestioneEsito('notdate');
        });

        $("#CodiceAmbulanza").off("keypress").on("keypress",function(e){
            if(e.keyCode=="13"){
                $("button.butApplicaMissione").trigger("click");
            }
        });

        $("#txtDaDataGestEsito, #txtADataGestEsito").on("change",function(){NS_WK_PS.gestDateGestioneEsito(this)});

        setTimeout(function(){
            NS_WK_PS.time_reload = typeof home.baseGlobal["WK.TIME_RELOAD." + home.baseUserLocation.cod_cdc] == 'undefined'?0:home.baseGlobal["WK.TIME_RELOAD." + home.baseUserLocation.cod_cdc];
            logger.debug("time reload="+NS_WK_PS.time_reload);
            setInterval(function(){
                NS_WK_PS.time_reload = typeof home.baseGlobal["WK.TIME_RELOAD." + home.baseUserLocation.cod_cdc] == 'undefined'?0:home.baseGlobal["WK.TIME_RELOAD." + home.baseUserLocation.cod_cdc];

                if((NS_FENIX_PS.tab_sel == 'filtroAperti'||NS_FENIX_PS.tab_sel == 'filtroAttesa' )&& home.NS_WK_PS.refresh_wk == true && !$(".contextMenu").isVisible() && NS_WK_PS.time_reload != 0){
                    logger.debug("Ricarico la wk " +NS_FENIX_PS.tab_sel);
                    home.NS_WK_PS.caricaWk(true);
                }
            }, parseInt(NS_WK_PS.time_reload));
        }, 10000);

        $("#txtCognomeGestioneEsito, #txtNomeGestioneEsito").on("change keyup", function(){NS_WK_PS.nomeCognomeOnlyGestione($(this))});
        $("#txtAnno, #txtCartella").on("change keyup", function(){NS_WK_PS.annoCartellaReadOnly($(this))});

        $(".butNascondi").on("click",function(){
            NS_WK_PS.hideWkMissione();
        });

        $(".butMostra").on("click",function(){
            NS_WK_PS.showWkMissione();
        })


    },

    resetFiltriAnag : function(){
        $("#txtCognomeAnag, #txtNomeAnag, #txtCodiceFiscale, #dateData, #h-dateData").val("");
        $(".CBpulsSel").attr("class","CBpuls CBcolorDefault");
        NS_FENIX_FILTRI.leggiFiltriDaSalvare();
    },

    resetFiltriGestione : function(){
        $("#txtCognomeGestioneEsito, #txtNomeGestioneEsito, #txtAnno, #txtCartella, #txtADataGestEsito, #h-txtADataGestEsito, #txtDaDataGestEsito, #h-txtDaDataGestEsito ").val("").removeAttr("disabled").css("background-color","white");
        NS_FENIX_FILTRI.leggiFiltriDaSalvare();
    },



    nomeCognomeOnlyGestione: function(campo){

        var campoAnno = $("#txtAnno");
        var campoCartella = $("#txtCartella");
        var campoNome = $("#txtNomeGestioneEsito");
        var campoCognome = $("#txtCognomeGestioneEsito");

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
        var campoNome = $("#txtNomeGestioneEsito");
        var campoCognome = $("#txtCognomeGestioneEsito");

        if (campo.val() !== "") {

            campoNome.val("").attr("disabled", "disabled").css("background-color","#D8D8D8");
            campoCognome.val("").attr("disabled", "disabled").css("background-color","#D8D8D8");
        }
        else if(campoAnno.val() == "" && campoCartella.val() == ""){

            campoNome.val("").removeAttr("disabled").css("background-color","white");
            campoCognome.val("").removeAttr("disabled").css("background-color","white");
        }

    },

    beforeApplica : function (param) {

        if(typeof param != 'undefined' && param != "undefined" && param!== "" && param !== null){
            return true;
        }
        else {

            switch (NS_FENIX_PS.tab_sel) {
                case("filtroAnagrafica"):

                    var obj = NS_WK_PS.definisciQueryWKAnagrafica();

                    logger.debug("Applica WK anagrafica -> " + JSON.stringify(obj));

                    if (obj.SUCCESS) {
                        $("#divWk").worklist().config.structure.id_query = obj.QUERY;

                        return true;
                    }
                    else {
                        return false;
                    }

                    break;
                case('GestioneEsito'):


                    NS_WK_PS.checkRange();


                    break;

                case('filtroCodiciMissione'):
                    NS_WK_PS.caricaWkCodiciMissione();
                    break;
                //logger.debug("Applica WK esito -> " + JSON.stringify(obj));

                /*if (obj.SUCCESS) {
                 return true;
                 } else {
                 return false;
                 }
                 break;*/
                /*
                 case ('filtroAperti'):
                 NS_WK_PS.caricaWkListaAperti();
                 return true;
                 break;
                 case ('filtroOBI'):
                 NS_WK_PS.caricaWkOBI();
                 return true;
                 break;
                 */
                default :

                    return true;


            }
        }
    },



    /**
     * A seconda del tab selezionato carica la Wk corrispondente
     * @param {boolean} mantieniFiltri : disabilita il reset dei filtri relativi alle wk
     * */
    caricaWk: function (mantieniFiltri) {

        switch (NS_FENIX_PS.tab_sel) {
            case 'filtroCodiciMissione':
                NS_WK_PS.initDataCodiciMissione(mantieniFiltri);
                NS_WK_PS.caricaWkCodiciMissione();
                break;
            case 'filtroAnagrafica':

                    NS_WK_PS.initTabListaAttesa();
                    if (!NS_WK_PS.wkMissioniHidden) {
                        NS_WK_PS.initTabListaAttesa();
                        NS_WK_PS.resetFiltriAnag();
                        NS_WK_PS.caricaWkAnagrafica();
                        NS_WK_PS.initDataCodiciMissione(mantieniFiltri);
                        NS_WK_PS.caricaWkCodiciMissione();
                        $(".butMostra").hide();
                    }
                    else {

                        NS_WK_PS.resetFiltriAnag();
                        NS_WK_PS.caricaWkAnagrafica();
                        NS_WK_PS.initDataCodiciMissione(mantieniFiltri);
                        NS_WK_PS.caricaWkCodiciMissione();
                        NS_WK_PS.hideWkMissione();
                    }


                break;
            case 'filtroAttesa' :


                    NS_WK_PS.initTabListaAttesa();
                    if (!NS_WK_PS.wkMissioniHidden) {
                        //NS_WK_PS.initTabListaAttesa();
                        NS_WK_PS.caricaWkListaAttesa();
                        NS_WK_PS.initDataCodiciMissione(mantieniFiltri);
                        NS_WK_PS.caricaWkCodiciMissione();
                        $(".butMostra").hide();
                    }
                    else {
                        NS_WK_PS.caricaWkListaAttesa();
                        NS_WK_PS.initDataCodiciMissione(mantieniFiltri);
                        NS_WK_PS.caricaWkCodiciMissione();
                        NS_WK_PS.hideWkMissione();
                    }
                    NS_FENIX_FILTRI.leggiFiltriDaSalvare();


                break;
            case 'filtroAperti':
                NS_WK_PS.initTabGeneric();
                NS_WK_PS.caricaWkListaAperti();
                NS_FENIX_FILTRI.leggiFiltriDaSalvare();
                break;
            case 'filtroOBI':
                NS_WK_PS.initTabGeneric();
                NS_WK_PS.caricaWkOBI();
                NS_FENIX_FILTRI.leggiFiltriDaSalvare();
                break;
            case 'filtroCancellati':
                NS_WK_PS.initTabGeneric();
                NS_WK_PS.caricaWkCancellati();
                NS_FENIX_FILTRI.leggiFiltriDaSalvare();
                break;
            case 'GestioneEsito':
                NS_WK_PS.initTabGeneric();
                NS_WK_PS.caricaWkGestioneEsito();
                NS_FENIX_FILTRI.leggiFiltriDaSalvare();

                break;
            default :
                logger.error('ATTENZIONE TABULATORE NON RICONOSCIUTO');
                break;
        }
    },

    startWorklist: function () {
        NS_WK_PS.caricaWkAnagrafica();
    },


    caricaWkAnagrafica: function (load) {

        var pLoad = LIB.isValid(load);
        var cognome = $("#txtCognomeAnag").val();
        var nome = $("#txtNomeAnag").val();
        var codicefiscale = $("#txtCodiceFiscale").val();
        var data_nascita = $("#h-dateData").val();


        NS_WK_PS.wk_anagrafica = new WK({
            id: "PS_WK_RIC_PAZ",
            container: "divWk",
            loadData : pLoad,
            aBind: ["nome","cognome","codice_fiscale","data_nascita"],
            aVal: [nome,cognome,codicefiscale,data_nascita]
        });
        NS_WK_PS.wk_anagrafica.loadWk();
    },

    definisciQueryWKAnagrafica : function(){

        var nome =  $("#txtNomeAnag");
        var cognome = $("#txtCognomeAnag");
        var codFiscale = $("#txtCodiceFiscale");
        var data_nascita = $("#h-dateData");

        var p =
        {
            "cognome" : cognome.val() == "" ? null  : cognome.val(),
            "nome" : nome.val() == "" ? null : nome.val(),
            "codice_fiscale": codFiscale.val().length == 16 ? codFiscale.val() :null,
            "data_nascita": data_nascita.val()== "" ? null : data_nascita.val(),
            "SUCCESS" : true,
            "QUERY" : ""
        };

        if (p.codice_fiscale != null )
        {
            p.QUERY = "WORKLIST.ANAGRAFICA_COD_FISC";
        }
        else if (p.data_nascita !== null)
        {
            p.QUERY = "WORKLIST.ANAGRAFICA_DATA_NASCITA";
        }
        else if ((p.cognome != null && p.cognome.length >= 2))
        {
            p.QUERY = "WORKLIST.ANAGRAFICA";
        }

        else
        {
            home.NOTIFICA.error({message: "Indicare il codice fiscale o la data di nascita o almeno i primi 2 caratteri del cognome", title: "Error"});
            p.SUCCESS = false;
        }

        return p;
    },

    caricaWkCodiciMissione: function () {




        var dataMissione = $("#h-dataMissione").val();
        var oraMissione = $("#txtOraMissione").val();
        var codiceAmbulanza = $("#CodiceAmbulanza").val();

        if(oraMissione !== ""){
            oraMissione = oraMissione.replace(":","");
        }


        var subCodiceStruttura = home.baseUserLocation.sub_codice_struttura;

        if(oraMissione == "" || dataMissione == ""){
            home.NOTIFICA.warning({title:"Attenzione", message:"Valorizzare Data e Ora"});
        }

        else{
            NS_WK_PS.wk_codici_missione = new WK({
                id: "WORKLIST_CODICI_MISSIONE_HOME",
                container: "divWkCodiciMissione",
                loadData: true,
                aBind: ["data","ora","codiceAmbulanza","subCodiceStruttura"],
                aVal: [dataMissione,oraMissione,codiceAmbulanza,subCodiceStruttura]
            });


            NS_WK_PS.wk_codici_missione.loadWk();

        }

    },


    caricaWkListaAttesa: function () {
        var nome = $("#txtNomeAttesa").val();
        var cognome = $("#txtCognomeAttesa").val();

        NS_WK_PS.wk_lista_attesa = new WK({
            id: "PS_WK_LISTA_ATTESA",
            container: "divWk",
            loadData : true,
            aBind: ["username","nome","cognome"],
            aVal: [home.baseUser.USERNAME, nome, cognome]
        });
        NS_WK_PS.wk_lista_attesa.loadWk();
    },

    caricaWkListaAperti: function () {
        var nome = $("#txtNomeAperti").val();
        var cognome = $("#txtCognomeAperti").val();
        var utente = $('#cmbUtenti').find('option:selected').attr('data-descr');
        if (utente == 'TUTTI'){
            utente = '';
        }


        NS_WK_PS.wk_lista_aperti = new WK({
            id: "PS_WK_LISTA_APERTI",
            container: "divWk",
            loadData : true,
            aBind: ["username","nome","cognome","utente"],
            aVal: [home.baseUser.USERNAME, nome, cognome,utente]
        });
        NS_WK_PS.wk_lista_aperti.loadWk();

    },
    caricaWkOBI: function () {
        var nome = $("#txtNomeOBI").val();
        var cognome = $("#txtCognomeOBI").val();
        var utente = $('#cmbUtentiOBI').find('option:selected').attr('data-descr');
        if (utente == 'TUTTI'){
            utente = '';
        }

        NS_WK_PS.wk_obi = new WK({
            id: "PS_WK_LISTA_OBI",
            container: "divWk",
            loadData : true,
            aBind: ["username","nome","cognome","utente"],
            aVal: [home.baseUser.USERNAME, nome, cognome, utente]
        });
        NS_WK_PS.wk_obi.loadWk();
    },

    caricaWkGestioneEsito: function(notDate){

        if(typeof notDate == 'undefined'){
            $("#txtDaDataGestEsito").val(moment().add(-home.baseGlobal.RANGE_GESTIONE_ESITO, 'days').format("DD/MM/YYYY"));
            $("#h-txtDaDataGestEsito").val(moment().add(-home.baseGlobal.RANGE_GESTIONE_ESITO, 'days').format("YYYYMMDD"));

            $("#txtADataGestEsito").val(moment().format("DD/MM/YYYY"));
            $("#h-txtADataGestEsito").val(moment().format("YYYYMMDD"));
        }



        NS_WK_PS.wk_gestione_esito = new WK({
            id: "PS_WK_GESTIONE_ESITO",
            container: "divWk",
            loadData : false,
            load_callback: function(){NS_WK_PS.resetFiltriGestione();}
        });


        NS_WK_PS.wk_gestione_esito.loadWk();

    },

    caricaWkCancellati: function(){
        var nome = $("#txtNomeCancellati").val();
        var cognome = $("#txtCognomeCancellati").val();
        var cartella =$("#txtCartellaCancellati").val();
        var anno = $("#txtAnnoCancellati").val();

        NS_WK_PS.wk_cancellati = new WK({
            id: "PS_WK_LISTA_CANCELLATI",
            container: "divWk",
            loadData : false,
            aBind: ["anno","nome","cognome","cartella"],
            aVal: [anno, nome, cognome, cartella]
        });
        NS_WK_PS.wk_cancellati.loadWk();
    },
    /**
     * Colora la riga delle Wk con il colore dell'urgenza
     * @param data
     * @param elemento
     * @param td
     */
    setColorUrgenza: function (data, elemento, td) {
        if(typeof data=="undefined" || data=="" || data==null) logger.error("setColorUrgenza : data is undefined");
        if(typeof elemento=="undefined" || elemento=="" || elemento==null) logger.error("setColorUrgenza : elemento is undefined");
        if(typeof td=="undefined" || td=="" || td==null) logger.error("setColorUrgenza : td is undefined");

        var codice;

        if((data.CODICE==null || data.CODICE=="" || typeof data.CODICE=="undefined"  || data.CODICE=="null"))
        {
            if(data.CODICE_ESAME_OBIETTIVO==null || data.CODICE_ESAME_OBIETTIVO=="" || typeof data.CODICE_ESAME_OBIETTIVO=="undefined" || data.CODICE=="null")
            {
                if(data.CODICE_LISTA==null || data.CODICE_LISTA=="" || typeof data.CODICE_LISTA=="undefined" || data.CODICE=="null")
                {
                    elemento.addClass("grigio");
                    //logger.info("setColorUrgenza: CODICE=GRIGIO per il paziente " + data.PAZIENTE);
                }else{
                    codice=data.CODICE_LISTA;
                    //logger.info("setColorUrgenza: CODICE=" + data.CODICE+ " CODESAMEOBIETTIVO=" + data.CODICE_ESAME_OBIETTIVO+" CODLISTA="+ data.CODICE_LISTA+" per il paziente " + data.PAZIENTE);
                }
            }else{
                codice=data.CODICE_ESAME_OBIETTIVO;
                //logger.info("setColorUrgenza: CODICE=" + data.CODICE + " CODESAMEOBIETTIVO=" + data.CODICE_ESAME_OBIETTIVO+" per il paziente " + data.PAZIENTE);
            }
        }else{
            codice=data.CODICE;
            //logger.info("setColorUrgenza: CODICE=" + data.CODICE +" per il paziente " + data.PAZIENTE);
        }

        switch (codice) {
            case 'ROSSO':
                elemento.addClass("red");
                td.append('<div style="font-weight:bold">' + data.PAZIENTE + '</div>');
                break;
            case 'GIALLO':
                elemento.addClass("yellow");
                td.append('<div style="font-weight:bold">' + data.PAZIENTE + '</div>');
                break;
            case 'VERDE':
                elemento.addClass("green");
                td.append('<div style="font-weight:bold">' + data.PAZIENTE + '</div>');
                break;
            case 'BIANCO':
                elemento.addClass("white");
                td.append('<div style="font-weight:bold">' + data.PAZIENTE + '</div>');
                break;
            case 'AZZURRO':
                elemento.addClass("blue");
                td.append('<div style="font-weight:bold">' + data.PAZIENTE + '</div>');
                break;
            case 'MAGENTA':
                elemento.addClass("magenta");
                td.append('<div style="font-weight:bold">' + data.PAZIENTE + '</div>');
                break;
            case 'NERO':
                elemento.addClass("nero");
                td.append('<div style="font-weight:bold">' + data.PAZIENTE + '</div>');
                break;
            default :
                elemento.addClass("grigio");
                td.append('<div style="font-weight:bold">' + data.PAZIENTE + '</div>');
                break;
        }
    },
    /**
     * Setta l'urgenza nella wk lista attesa e aggiunge il triangolo a seconda di quanto tempo e' passato dall'ulitma rivalutazione
     * */
    setColorUrgenzaWithTriangolo: function (data, elemento, td) {

        NS_WK_PS.setColorUrgenza(data, elemento, td);

        var diff = data.DIFF_MODIFICA;
        var codice = data.CODICE;



        if(typeof home.baseUserLocation !== "undefined"){
            var struttura = home.baseUserLocation.sub_codice_sezione;
        }
        else {
            var struttura = "";
        }


        var bianco = typeof home.baseGlobal["ps.triage.tempoRivalutazione.BIANCO." + struttura +""] !== "undefined" ? home.baseGlobal["ps.triage.tempoRivalutazione.BIANCO." + struttura +""] : home.baseGlobal["ps.triage.tempoRivalutazione.BIANCO"];
        var verde = typeof home.baseGlobal["ps.triage.tempoRivalutazione.VERDE." + struttura +""] !== "undefined" ? home.baseGlobal["ps.triage.tempoRivalutazione.VERDE." + struttura +""] : home.baseGlobal["ps.triage.tempoRivalutazione.VERDE"];
        var azzurro = typeof home.baseGlobal["ps.triage.tempoRivalutazione.AZZURRO." + struttura +""] !== "undefined" ? home.baseGlobal["ps.triage.tempoRivalutazione.AZZURRO." + struttura +""] : home.baseGlobal["ps.triage.tempoRivalutazione.AZZURRO"];
        var magenta = typeof home.baseGlobal["ps.triage.tempoRivalutazione.MAGENTA." + struttura +""] !== "undefined" ? home.baseGlobal["ps.triage.tempoRivalutazione.MAGENTA." + struttura +""] : home.baseGlobal["ps.triage.tempoRivalutazione.MAGENTA"];
        var giallo = typeof home.baseGlobal["ps.triage.tempoRivalutazione.GIALLO." + struttura +""] !== "undefined" ? home.baseGlobal["ps.triage.tempoRivalutazione.GIALLO." + struttura +""] : home.baseGlobal["ps.triage.tempoRivalutazione.GIALLO"];
        var rosso = typeof home.baseGlobal["ps.triage.tempoRivalutazione.ROSSO." + struttura +""] !== "undefined" ? home.baseGlobal["ps.triage.tempoRivalutazione.ROSSO." + struttura +""] : home.baseGlobal["ps.triage.tempoRivalutazione.ROSSO"];


        if(codice!="" || codice!=null){
            switch (codice) {
                case 'ROSSO':
                    if (diff > Number(rosso)) {
                        td.append('<div class="triangolo" title="Triage non rivalutato negli ultimi 15 minuti"></div>');
                    }
                    break;
                case 'GIALLO':
                    if (diff > Number(giallo)) {
                        td.append('<div class="triangolo" title="Triage non rivalutato negli ultimi 30 minuti"></div>');
                    }
                    break;
                case 'VERDE':
                    if (diff > Number(verde)) {
                        td.append('<div class="triangolo" title="Triage non rivalutato negli ultimi 60 minuti"></div>');
                    }
                    break;
                case 'AZZURRO':
                    if (diff > Number(azzurro)) {
                        td.append('<div class="triangolo" title="Triage non rivalutato negli ultimi 60 minuti"></div>');
                    }
                    break;
                case 'MAGENTA':
                    if (diff > Number(magenta)) {
                        td.append('<div class="triangolo" title="Triage non rivalutato negli ultimi 60 minuti"></div>');
                    }
                    break;
                case 'BIANCO':
                    break;
                default :
                    break;
            }
        }

    },

    setColorCertificata: function(data, elemento,td){

        if(data.CODICE_FISCALE === null){
            data.CODICE_FISCALE = '';
        }
        td.text(data.CODICE_FISCALE);
        if(data.CERTIFICATA === 'N') {

            td.css('color','grey');
            elemento.children().each(function(){
                if($(this).attr('data-header') !== 'INFO') {
                    $(this).find('div').css("color", "grey");
                }
            })
        }




    },

    /**
     * Colora di rosso i contatti da prendere in carico
     * @param data
     * @param td
     */
    setColorStato: function (data, td) {
        var stato = data.CONTASS_STATO;
        var titolo = "Trasferimento assistenziale richiesto da " + data.UTE_INS_ASS + ' verso ' + data.UTE_RIFERIMENTO;
        var testo = data.UTE_RIFERIMENTO == null ? '' : data.UTE_RIFERIMENTO;

        switch (stato) {
            case 'REQUESTED':
                //td.addClass("red");
                td.attr("title", titolo).text(testo);
                break;
            default :
                td.text(testo);
                break;
        }
    },
    /**
     * cambia la classe della riga selezionata a seconda del colore di sfondo
     */
    setColorSelRow : function(tr,multi, e) {
        //console.log(e);
        if(LIB.isValid(multi) && e.ctrlKey)
        {
            tr.selectedLine('*', 'trSpuntato');
        }else{
            $(".iCS").each(function () {
                $(this).removeClass("icon-ok")
            });
            tr.selectedLine('', 'trSpuntato');

        }

        tr.find(".iCS").toggleClass("icon-ok");
    },
    /**
     * processclass che setta la riga con lo sfondo grigio se � sospeso = 'S'
     * se � deleted la cancella con il css
     */
    setSospeso : function(data, wk, td){

        if(data.DELETED == 'S'){
            $(wk).closest("tr").addClass("deleted");
        }else if(data.SOSPESO == 'S'){
            $(wk).closest("tr").addClass("colorGrey");
        }

        return td.text(data.SOSPESO);

    },


    seeDeletedRichieste : function(data, wk, td){

        if(data.STATO_RICHIESTA == 'X') {
            $(wk).closest("tr").addClass("deleted");
            $(wk).closest("tr").find("td").css('color','grey');
        }

        return td.text(data.STATO_RICHIESTA);


    },

    seeDeleted : function(data, wk, td){

        if(data.DELETED == 'S') {
            $(wk).closest("tr").addClass("deleted");
            $(wk).closest("tr").find("td").css('color','grey');
        }

        return td.text(data.DELETED);


    },
    /**
     * @todo  non utilizzata x ora, w8 fixes stopImmediatePropagation from fenix
     */
    setProcessAvvertenza : function (data, wk, td) {
        //logger.debug(JSON.stringify(data));
        return td.append($(document.createElement('a')).attr('onclick', "home.DIALOG_PS.createDialogAvvertenze('"+data.IDEN_ANAG+"',window.event);").html("<i class='icon-info-circled' title='Visualizza avvertenze'>"));
    },


    evidenziaFiltro: function(){
        var optionSelected = $('#cmbUtenti').find('option:selected');
        var utente = optionSelected.attr('data-descr');
        var utenteOBI = optionSelected.attr('data-descr');
        var filtro;

        if(utente  == home.baseUser.DESCRIZIONE ){
            filtro = optionSelected.attr('data-descr',utente);
            filtro.css('background','yellow');


        }
        if(utenteOBI  == home.baseUser.DESCRIZIONE ){
            filtro = optionSelected.attr('data-descr',utente);
            filtro.css('background','yellow');

        }
    } ,

    /**
     * @param idenPer
     * @param idenInfermiere
     * @param type
     * */
    passaggioDiConsegne : function (idenPer, idenInfermiere, type, param) {
        if(typeof param == 'undefined'){
            param = null;
        }
        logger.debug("passaggioDiConsegne con type -> " + type + ' e param -> ' + JSON.stringify(param) );
        /*un domani ci chiederanno di mettere anche l'infermiere nella presa in carico quindi lo lascio mezzo implementato*/
        NS_FENIX_PS.elaborazioniSuPiuContatti(idenPer, null, type, param);
    },


    /**
     * L'utente medico loggato prende in carico il paziente
     * @param idenInfermiere
     * @param type
     */
    presaInCaricoMedico: function (idenInfermiere, type) {
        logger.debug("presaInCaricoMedico con type -> " + type);
        var idenPer =  home.baseUser.IDEN_PER;
        NS_FENIX_PS.elaborazioniSuPiuContatti(idenPer, idenInfermiere, type);

    },
    /**
     * Funzione che elabora il json di caratteri e ne ritorna l�informazione desiderata
     * @param data
     * @param td
     */
    getLetto : function(data,td){
        var letto = data.LETTO;
        var valore = JSON.parse(letto);
        $(td).text(valore.descr);
    },



    LoadOBI : function(){
        NS_WK_PS.caricaWkOBI();
        $("#li-filtroOBI").trigger("click").addClass("tabActive");
        NS_FENIX_PS.tab_sel = $("#tabs-Worklist").find("li.tabActive").data("tab");
        home.NS_LOADING.hideLoading();
    },

    /* loadFiltroMedico: function(el){
     var obj = [];
     $('td[data-header="MEDICO RESPONSABILE"]').each(function(){
     obj.push($(this).text());
     })
     obj = $.unique(obj);
     alert(obj);
     for ( var i = 0; i < obj.length; i++){
     el.find('option').each(function(){$(this).remove();});
     el.append('<option>'+(obj[i])+'</option>');
     }
     }*/


    checkRange: function(){
        var daData = $("#h-txtDaDataGestEsito").val();
        var aData = $("#h-txtADataGestEsito").val();
        var nome = $("#txtNomeGestioneEsito").val();// != '' ? $("#txtNomeGestioneEsito").val() : null;
        var cognome = $("#txtCognomeGestioneEsito").val();// != '' ? $("#txtCognomeGestioneEsito").val() : null;
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
                                NS_WK_PS.definisciQueryWKEsito();


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

                    NS_WK_PS.definisciQueryWKEsito();


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
                NS_WK_PS.definisciQueryWKEsito();


            }

        }


        else{
            NS_WK_PS.definisciQueryWKEsito();


        }







    },




    definisciQueryWKEsito : function(){

        var cognomeCampo = $("#txtCognomeGestioneEsito");
        var nomeCampo = $("#txtNomeGestioneEsito");
        var cartellaCampo =  $("#txtCartella");
        var annoCampo = $("#txtAnno");

        var nome = nomeCampo.val();// != '' ? $("#txtNomeGestioneEsito").val() : null;
        var cognome = cognomeCampo.val();// != '' ? $("#txtCognomeGestioneEsito").val() : null;
        var cartella = cartellaCampo.val();// != '' ? $("#txtCartella").val() : null;
        var anno = annoCampo.val() ;//!= '' ? $("#txtAnno").val() : null;
        var daData = $("#h-txtDaDataGestEsito").val();
        var aData = $("#h-txtADataGestEsito").val();

        if(daData != "" && aData != "") {
            var diffDate = moment(aData, "YYYYMMDD").diff(moment(daData, "YYYYMMDD"));
            diffDate = moment.duration(diffDate).asDays();
        }
        logger.debug("diff ->" + diffDate);
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
                p.QUERY = "WORKLIST.GESTIONE_ESITO_BY_CARTELLA";
            }else{
                p.QUERY = "WORKLIST.GESTIONE_ESITO_BY_CARTELLA_DATA";
            }
        }else if(nome != '' && cognome != '') {
            //valorizzato nome e cognome
            //svuoto anno cartella
            if(daData == "" && aData== ""){
                p.QUERY = "WORKLIST.GESTIONE_ESITO_BY_DATI_ANAGRAFICI";
            }else{
                p.QUERY = "WORKLIST.GESTIONE_ESITO_BY_DATI_ANAGRAFICI_DATA";
            }
        }else if(nome == '' && cognome == '' && cartella.length == 0 && daData != "" && aData != ""){
          if(diffDate = 1){
            p.QUERY = "WORKLIST.GESTIONE_ESITO_GIORNATA"
          }else{
            p.QUERY = "WORKLIST.GESTIONE_ESITO_DATA";
          }
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
                        NS_WK_PS.setQuery(p)

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
            NS_WK_PS.setQuery(p);
        }









    },


    setQuery: function(obj){
        logger.debug("Applica WK esito -> " + JSON.stringify(obj));

        if (obj.SUCCESS) {
            //return true;
            //NS_WK_PS.tab_sel = ""
            NS_FENIX_FILTRI.applicaFiltri()
        } else {
            return false;
        }
    },

    gestDateGestioneEsito:function (scope) {

        var daData = $("#txtDaDataGestEsito");
        var aData = $("#txtADataGestEsito");
        var HdaData = $("#h-txtDaDataGestEsito");
        var HaData = $("#h-txtADataGestEsito");
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

        if(scope.id == 'txtDaDataGestEsito'){
            /**
             * se modifico da data ci sono 4 casi
             * 1) se rientra nel range di 2 settimane dal campo A data non fare nulla
             * 2) se � futura a oggi metti oggi e messaggio d'avviso
             * 3) se � futura adata metti adata +2 settimane ma non superiore ad oggi
             * 4) se � fuori range dal campo a data imposto il campo a data a daData + 14 giorni
             * 5) se a data � vuoto lo valorizzo con 14 gg in +
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

        }else if(scope.id == 'txtADataGestEsito'){
            /**
             * se modifico adata ci sono 4 casi
             * 1) se rientra nel range di 2 settimane dal campo da data non fare nulla
             * 2) se � futura a oggi metti oggi e messaggio d'avviso
             * 3) se � prima di dadata metti dadata -2 settimane
             * 4) se � fuori range dal campo dadata imposto il campo dadata a  a Data - 14 giorni
             * 5) se da data � vuoto valorizzo con -14
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
            logger.error("Caso non previsto gestDateGestioneEsito -> " + scope.id)
        }
    },

    /**
     *
     * @param {type} resetFiltri : disabilita il reset dei filtri relativi alla wk
     * @returns {undefined}
     */
    initDataCodiciMissione : function(mantieniFiltri){
        if(!mantieniFiltri){
            $("#dataMissione").val(moment().format("DD/MM/YYYY"));
            $("#h-dataMissione").val(moment().format("YYYYMMDD"));
            $("#txtOraMissione").val(moment().format("HH:mm"));
        }
    },

    initTabListaAttesa : function(){
        var divWk = $("#divWk");
        var WkMissione = $("#WorklistMissione");
        var divWkMissione = $("#divWkCodiciMissione");
        var altezza = parseFloat(NS_WK_PS.altezzaDivWK * 0.6);
        divWk.height(altezza);
        WkMissione.show();
        divWkMissione.show();
        divWkMissione.height(NS_WK_PS.altezzaDivWK * 0.3);
        $("#tabs-WorklistMissione").height(2);
        var bar = WkMissione.find(".footerTabs");
        if(bar.find("span#headerMissioni").length == 0){
            WkMissione.find(".footerTabs").prepend("<span id='headerMissioni'><strong>MISSIONI IN ARRIVO</strong></span>");
        }

    },

    initTabGeneric : function(){
        var divWk = $("#divWk");
        var WkMissione = $("#WorklistMissione");
        var divWkMissione = $("#divWkCodiciMissione");
        divWkMissione.hide();
        WkMissione.hide();
        divWk.height(NS_WK_PS.altezzaDivWK);


        //divWkMissione.height(altezza);
        //$("#tabs-WorklistMissione").height(2);
    },

    hideWkMissione : function(){
        var divWk = $("#divWk");
        var WkMissioneHeight = $("#WorklistMissione > .contentTabs").height();
        var divWkMissione = $("#divWkCodiciMissione");


        divWkMissione.hide();
        $("#WorklistMissione > .contentTabs").hide();

        divWk.height(NS_WK_PS.altezzaDivWK - parseFloat(WkMissioneHeight));
        $(".butMostra").show();
        $(".butNascondi").hide();
        $(".butApplicaMissione").hide();
        NS_WK_PS.loadWkOnShowHide();
        NS_WK_PS.wkMissioniHidden = true;
    },

    showWkMissione : function(){
        var divWk = $("#divWk");
        var WkMissioneHeight = $("#WorklistMissione > .contentTabs").height();
        var divWkMissione = $("#divWkCodiciMissione");
        var altezza = parseFloat(NS_WK_PS.altezzaDivWK * 0.6);


        divWkMissione.show();
        $("#WorklistMissione > .contentTabs").show();
        divWkMissione.height(NS_WK_PS.altezzaDivWK * 0.3);
        divWk.height(altezza);
        $(".butMostra").hide();
        $(".butNascondi").show();
        $(".butApplicaMissione").show();
        NS_WK_PS.loadWkOnShowHide();
        NS_WK_PS.wkMissioniHidden = false;
        NS_WK_PS.initDataCodiciMissione(true);
        NS_WK_PS.caricaWkCodiciMissione();


    },

    loadWkOnShowHide : function(){

        switch(NS_FENIX_PS.tab_sel) {
            case "filtroAttesa":
                NS_WK_PS.caricaWkListaAttesa();
                break;
            case "filtroAnagrafica":
                NS_WK_PS.caricaWkAnagrafica();
                break;
        }
    }

};
