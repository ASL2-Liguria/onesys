/**
 * User: matteopi+carlog
 * Date: 09/01/14
 * Time: 11.37
 */

jQuery(document).ready(function () {
    NS_ESAME_OBIETTIVO.init();
    NS_ESAME_OBIETTIVO.event();

});

/**
 * matteo.pipitone 13/02
 * levati tutti i riferimenti a home, o comunque fatti i controlli necessari per il corretto funzionamento della pagina
 *
 * */
var NS_ESAME_OBIETTIVO = {

    statoPagina: $("#STATO_PAGINA").val(),
    WkRivalutazioni:null,
    stato_contatto: $("#hStatoContatto").val(),
    tipoWk: parent.$("#WK_APERTURA").val(),
    tipoPersonale: home.baseUser.TIPO_PERSONALE,
    progressivoPrecedente : null,


    init: function () {


        NS_FENIX_SCHEDA.leggiCampiDaSalvare = NS_ESAME_OBIETTIVO.leggiCampiDaSalvare;

        home.ESAME_OBIETTIVO = this;
        $('#title').text('valutazione medica');
        if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }
        NS_ESAME_OBIETTIVO.tipoPersonale = $('#TIPO_PERSONALE').val();

        if($("#READONLY").val()==="S" || ($("#hRegime").val() == "OBI" && !(home.basePermission.hasOwnProperty("SUPERUSER"))))
        {
            $("button.butSalva").hide();
            $("textarea").attr("readonly","readonly");
            $("div.RBpuls").off("click").attr("readonly","readonly");
            $("div.contentTabs").css({"background":"#CACACC"});
        }
        else
        {
            NS_ESAME_OBIETTIVO.detectStatoPagina();
            NS_ESAME_OBIETTIVO.detectBaseUser();

            if(home.CARTELLA && home.CARTELLA.$("#WK_APERTURA").val() != "LISTA_OBI" && $("#hRegime").val() != "OBI"){
                NS_ESAME_OBIETTIVO.gestisciAllergie();
            }
        }

        NS_ESAME_OBIETTIVO.colorControl();
        NS_ESAME_OBIETTIVO.setUrgenza();
        $("#txtEsameObiettivo").css({"border":"1px solid #555", "width":"100%","line-height":'14px'}).closest("td").removeClass("tdTextarea").addClass("tdTextareaSalva");
            //.height(NS_ESAME_OBIETTIVO.calcolaDimensioneText())

        NS_FENIX_SCHEDA.customizeParam = function (params) {
            params.extern = true;
            return params;
        };

        //NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ESAME_OBIETTIVO"});
        NS_FENIX_SCHEDA.beforeSave = NS_ESAME_OBIETTIVO.beforeSave;
        NS_FENIX_SCHEDA.successSave = NS_ESAME_OBIETTIVO.successSave;
        NS_ESAME_OBIETTIVO.creaAnamnesiAddendum();


        if( top.name == 'schedaRicovero'){
            var contentTabs = parseInt($("div.contentTabs").height());
            $(".contentTabs").css({height:contentTabs - 100});
        }

        NS_ESAME_OBIETTIVO.focusTxt();

        $("#txtAllergie").attr("readonly","readonly");

        NS_ESAME_OBIETTIVO.gestisciMalattieRare();
        NS_ESAME_OBIETTIVO.gestisciOrganismi();

    },

    event: function () {
        $("#li-tabDati").on("click", function(){
            NS_ESAME_OBIETTIVO.salvaShowHide("S",NS_ESAME_OBIETTIVO.tipoPersonale);
        });

        $("body").on("click", function () {
            if(!(NS_ESAME_OBIETTIVO.tipoWk == 'LISTA_APERTI' && NS_ESAME_OBIETTIVO.tipoPersonale == 'M' && $('#hUteRiferimento').val() != home.baseUser.IDEN_PER) && ($("#READONLY").val()!=="S" && $("#hRegime").val() != "OBI")){

                if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA) && $('#READONLY').val() !== 'S'){
                    home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";
                }
            }
        });

        $("#txtEsameObiettivo").on("change", function () {
            if(!(NS_ESAME_OBIETTIVO.tipoWk == 'LISTA_APERTI' && NS_ESAME_OBIETTIVO.tipoPersonale == 'M' && $('#hUteRiferimento').val() != home.baseUser.IDEN_PER )&& $("#READONLY").val() != 'S'){
                if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                    home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";
                }
            }
        });
    },

    focusTxt: function(){
        $('#txtEsameObiettivo').focus();
    },
    /**
     *
     * @returns {*}
     */
    leggiCampiDaSalvare : function () {

        var jsonSalvataggio = {};
        jsonSalvataggio.username = home.baseUser.USERNAME;
        jsonSalvataggio.iden_per = home.baseUser.IDEN_PER;
        jsonSalvataggio.proceduraSalvataggio = "GEST_PS_SCHEDE_XML_TEST.SALVA_ESAME_OBIETTIVO";
        jsonSalvataggio.connessioneSalvataggio = "PS";
        jsonSalvataggio.hStatoListaAttesa = $("#hStatoListaAttesa").val();
        jsonSalvataggio.hStatoContatto = $("#hStatoContatto").val();
        jsonSalvataggio.hUrgenzaLista = $("#hUrgenzaLista").val();
        var urgenza = $("#h-UrgenzaPs").val();
        var arrayCampi = [];
        if(NS_ESAME_OBIETTIVO.statoPagina != 'I'){

            $.each($(".tdTextareaSalva"), function (k,v) {
                var textarea = $(this).find("textarea");

                if(k == $(".tdTextareaSalva").length -1 ){
                    if(textarea.val() != '' ){
                        arrayCampi.push({
                            "KEY_CAMPO":"txtEsameObiettivo_addendum",
                            "progressivo":Number(NS_ESAME_OBIETTIVO.progressivoPrecedente) + 1 ,
                            "uteIns":home.baseUser.IDEN_PER,
                            "dataIns":moment().format('YYYYMMDDHH:mm:ss'),
                            "dataMod":"",
                            "val" : NS_ESAME_OBIETTIVO.replaceChar(textarea.val()),
                            "urgenza":urgenza
                        });
                    }
                    return false;

                }else{
                    var datamod = textarea.attr("data_mod")  != '' ? textarea.attr("data_mod")  : '';
                    if(textarea.hasClass("Edited")){
                        datamod = moment().format('YYYYMMDDHH:mm:ss');
                    }
                    arrayCampi.push({
                        "KEY_CAMPO":"txtEsameObiettivo_addendum",
                        "progressivo":textarea.attr("progressivo"),
                        "uteIns":textarea.attr("ute_ins"),
                        "dataIns":textarea.attr("data_ins"),
                        "dataMod":datamod,
                        val:NS_ESAME_OBIETTIVO.replaceChar(textarea.val()),
                        "urgenza":textarea.attr("urgenza")
                    });

                    NS_ESAME_OBIETTIVO.progressivoPrecedente =  textarea.attr("progressivo");
                }

            });
        }else{
            arrayCampi.push({
                "KEY_CAMPO":"txtEsameObiettivo_addendum",
                "progressivo":"0",
                "uteIns":home.baseUser.IDEN_PER,
                "dataIns":moment().format('YYYYMMDDHH:mm:ss'),
                "dataMod":"",
                val: NS_ESAME_OBIETTIVO.replaceChar($("#txtEsameObiettivo").val()),
                "urgenza":urgenza
            })
        }

        arrayCampi.push({
            "KEY_CAMPO":"h-UrgenzaPs",
            "val":urgenza,
            "DESCR":$(".RBpulsSel").attr("title")
        });
        var allergie = $("#txtAllergie");

        if(allergie.val() != ''){

            arrayCampi.push({
                "KEY_CAMPO":"Allergie",
                "val":allergie.val()
            });

        }


        $.each(arrayCampi, function (k,v) {
            logger.debug(JSON.stringify(v));
        });

        jsonSalvataggio.campo = arrayCampi;
        return jsonSalvataggio;
    },

    replaceChar : function(testo){
        testo = testo.replace(new RegExp("\u201c", "g"), '"').replace(new RegExp("\u201d", "g"), '"')
            .replace(new RegExp("\u2019", "g"), "'").replace(new RegExp("\u2018", "g"), "'");
        return testo;
    },

    /**
     * visualizza o nasconde il button salva a seconda del tipo utente
     * @param param
     * @param tipoPersonale
     */
    salvaShowHide : function(param,tipoPersonale){
        var butSalva = $("button.butSalva");

        if(param=="H"){
            butSalva.hide();
        }
        if(param=="S" && (tipoPersonale==="I" || tipoPersonale ==="M" || tipoPersonale==="OST")){
            butSalva.show();
        }
    },

    detectStatoPagina: function () {

        if (NS_ESAME_OBIETTIVO.statoPagina == 'E') {
            NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ESAME_OBIETTIVO"});
            $("div.headerTabs").html("<h2 style='color: rgb(255, 255, 0);' id='lblAlertModifica'>RIVALUTAZIONE</h2>");
        } else{
            V_ESAME_OBIETTIVO.elements.txtEsameObiettivo.status = 'required';
            NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ESAME_OBIETTIVO"});
        }
    },

    salvaHide: function(uteRif, tipoWk, tipoPersonale){
        var butSalva = $("button.butSalva");

        if(tipoWk == 'LISTA_APERTI' && tipoPersonale == 'M' && uteRif != home.baseUser.IDEN_PER){
            butSalva.hide();
        }
    },

    detectBaseUser: function () {

        switch (NS_ESAME_OBIETTIVO.tipoPersonale) {
            case 'OST':
            case 'A':
            case 'I':
                NS_ESAME_OBIETTIVO.salvaShowHide("H",NS_ESAME_OBIETTIVO.tipoPersonale);
                break;
            case 'M':
                NS_ESAME_OBIETTIVO.salvaShowHide("S",NS_ESAME_OBIETTIVO.tipoPersonale);
                $("#tabDati").on("click", function () {
                    if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "N";
                    }

                });
                break;
            default:
                logger.error("baseuser non valorizzato correttamente : " + NS_ESAME_OBIETTIVO.tipoPersonale);
                break;
        }
    },

    calcolaDimensioneText: function () {
        var contentTabs = parseInt($("div.contentTabs").height());
        return parseInt(contentTabs / 2);
    },

    calcolaDimensioneWk: function () {
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        return parseInt(contentTabs - margine);
    },

    hasAValue: function (value) {
        return (("" !== value) && ("undefined" !== value) && (null !== value) && ("null" !== value) && ("undefined" !== typeof value));
    },

    isMaggiorenne : function(){
        return (moment(moment().format("YYYYMMDD"),"YYYYMMDD").diff(moment( $("#hDataNascita").val(),"YYYYMMDD"),'years') > 18);
    },

    colorControl : function(){
        var divUrgenza = $("#UrgenzaPs"),
            cdcAttuale = $("#COD_CDC").val(),
            coloriArea = $.parseJSON(home.baseGlobal.CONFIGURAZIONE_COLORI_OPZIONALI)[""+cdcAttuale+""];

        if(NS_ESAME_OBIETTIVO.hasAValue(coloriArea)) {

            $.each(coloriArea, function (key, value) {
                if (value.ATTIVO == "S") {

                    switch (value.CONTROLLO) {
                        case"CONTROLLO_MAGGIORENNE":
                            if (NS_ESAME_OBIETTIVO.isMaggiorenne()) {
                                divUrgenza.find("div." + value.COD_COLORE).hide();
                            }
                            break;
                        case"CONTROLLO_SESSO":
                            if ($("#hSesso").val() === "M") {
                                divUrgenza.find("div." + value.COD_COLORE).hide();
                            }
                            break;
                        default:
                            //CONTROLLO = NESSUNO
                            break;
                    }
                }
                if (value.ATTIVO == "N") {
                    divUrgenza.find("div." + value.COD_COLORE).hide();
                }
            });
        }
        else
        {
            logger.error("Nessuna configurazione opzionale per questo CDC : " + cdcAttuale);
        }

    },

    /**
     * Carica l'urgenza da lista_attesa come è stata precedentemente salvata nella scheda di codice_colore.
     * Se però è già stata salvata almeno una scheda di esame_obiettivo, allora carica quell'urgenza lì.
     */
    setUrgenza: function () {
        var urgenzaListaAttesa = $("#hUrgenzaLista").val();
        //campo nascosto dove è salvato il valore dell'urgenza caricato dai precedenti salvataggi della scheda
        var urgenzaEsamePrecedente = $("#hUrgenzaEsame").val();
        var urgenzaAttuale = "";

        if ((urgenzaEsamePrecedente != "") && (urgenzaEsamePrecedente != null)) {
            urgenzaAttuale = urgenzaEsamePrecedente;
        } else {
            urgenzaAttuale = urgenzaListaAttesa;
        }

        $("#h-UrgenzaPs").val(urgenzaAttuale);
        $("#UrgenzaPs_" + urgenzaAttuale).addClass("RBpulsSel");
    },

    beforeSave : function(){
        var bool = true;
        var checkTesto = true;
        var statoListaAttesa = $("#hStatoListaAttesa").val();
        var statoContatto = $("#hStatoContatto").val();
        var utenteDimissione = $("#hUtenteDimissione").val();
        var diff_ora_chiusura = $("#hOreDiffChiusura").val();

        if( (statoContatto==="DISCHARGED") && (((home.baseUser.IDEN_PER==utenteDimissione) && (diff_ora_chiusura < home.baseGlobal["cartella.tempo_manutenzione.cartella_chiusa"])) || (home.basePermission.hasOwnProperty("SUPERUSER"))) )
        {
            return true;
        }
        if(statoContatto==="DISCHARGED" || (statoListaAttesa==="INSERITO" && statoListaAttesa==="COMPLETO"))
        {
            $.dialog("Non e' possibile effettuare la visita medica a questo punto dell'iter",{
                title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {
                        $.dialog.hide();
                        return false;
                    }}
                ]
            });
            bool =  false;
        }else{
            bool= true;
        }

        $(".Edited").each(function(){
            if(/\S/.test($(this).val())){

                bool= true;
                checkTesto = false;
            }
            else{
                home.NOTIFICA.warning({title:"Attenzione",message:"E' necessario scrivere una valutazione prima di salvare"});
                bool =  false;
                checkTesto = false;
            }

        })

        if(/\S/.test($("#txtEsameObiettivo").val()) && checkTesto){

            bool= true;

        }
        else{
            if(checkTesto){
                home.NOTIFICA.warning({title:"Attenzione",message:"E' necessario scrivere una valutazione prima di salvare"});
                bool =  false;
            }


        }


        return bool;
    },

    successSave : function (message,callback) {

        logger.info(message);

        if(LIB.isValid(home) && LIB.isValid(home.NS_LOADING) &&  LIB.isValid(home.NS_LOADING.showLoading)){
            home.NS_LOADING.showLoading({"timeout":"0","testo" : "SALVATAGGIO", "loadingclick" : function(){home.NS_LOADING.hideLoading();}});
        }

        var jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden($("#IDEN_CONTATTO").val(),{assigningAuthorityArea:'ps'});
        jsonContatto.urgenza.id = $("#h-UrgenzaPs").val();

        CONTROLLER_PS.UpdatePatientInformation({
            jsonContatto: jsonContatto,
            callback: function () {

				//se non presente è stato aperto in autologin per cui non è presente nessun contesto da aggiornare
				if(home.CARTELLA){
					home.CARTELLA.jsonData.H_STATO_PAGINA.ESAME_OBIETTIVO = 'E';
				}
                $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");

                if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
                        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
                }
                if(LIB.isValid(home) && LIB.isValid(home.NS_CARTELLA) &&  LIB.isValid(home.NS_CARTELLA.showUrgenza)){
                        home.NS_CARTELLA.showUrgenza("", ($("#UrgenzaPs").find("div.RBpulsSel").attr("title")), "");
                }
                if(LIB.isValid(home) && LIB.isValid(home.NS_LOADING)){
                        home.NS_LOADING.hideLoading();
                }

                if(callback) callback();

            }
        });

		if(home.NS_CARTELLA){
			home.NS_CARTELLA.setSemaphoreOnSave();
		}
    },

    creaAnamnesiAddendum : function () {

        if(NS_ESAME_OBIETTIVO.statoPagina != 'I'){

            var db = $.NS_DB.getTool({setup_default:{datasource:'PS',async:false}});
            var params = {
                         IDEN_CONTATTO : document.getElementById("IDEN_CONTATTO").value
                     };
            logger.debug(JSON.stringify(params));
            var xhr = db.select({
                id:"PS.Q_ELENCO_ANAMNESI",
                parameter :  params
            });

            xhr.done(function (data) {

                /**
                 *
                 * se l'iden_per dell'utente che ha fatto la registrazione è differente dall'iden_per dell'utente loggato creo un'altra textarea
                 * se l'utente di registrazione è diverso crea sempre e comunque una nuova textarea
                 *
                 * */

                var iden_per = $("#IDEN_PER").val();

                 $.each(data.result, function(k,v){
                        if( v.TESTO != ''){
                            var message = 'Registrata alle ' + v.DATA_INS + ' da ' + v.UTE_REGISTRAZIONE ;
                            if (v.DATA_MOD!='' && v.DATA_MOD!=null ){
                                message += ' e modificata alle ' + v.DATA_MOD;
                            }
                            var trGlobale = $(document.createElement("tr"));
                            var trIntestazione = $(document.createElement("tr"));
                            var tdInstestazione = $(document.createElement("td")).addClass("tdInfoUtenteRegistrazione" );
                            var p = $(document.createElement("p")).text(message);
                           // html = '<tr><td class="tdInfoUtenteRegistrazione"><p>'+message+' </p></td></tr>';
                            var tr = $(document.createElement("tr"));
                            var td = $(document.createElement("td")).addClass("tdTextareaSalva"); //gli ho levato la classe se no si prendeva le regole di mix.css
                            var textarea = $(document.createElement("textarea"));

                            textarea.attr({
                                "data-toupper":"N",
                                "rows":"10",
                                "name":"txtEsameObiettivo_"+k,
                                "id":"txtEsameObiettivo_"+k,
                                "progressivo": v.PROGRESSIVO,
                                "ute_ins": v.IDEN_PER,
                                "data_ins": v.DATE_INS_ISO,
                                "data_mod": v.DATE_MOD_ISO,
                                "urgenza" : v.URGENZA
                            }).text(v.TESTO).css({"border":"1px solid #555", "width":"100%","line-height":'14px'});


                            if(iden_per == v.IDEN_PER && home.CARTELLA && home.CARTELLA.NS_REFERTO.stato_pagina != 'R'){
                                textarea.addClass("txtEditable" );
                                textarea.attr("onchange","this.className = 'Edited'" )
                            }else{
                                textarea.addClass("txtReadOnly");
                                textarea.attr("readonly","readonly");
                            }

                            trIntestazione.append(tdInstestazione.append(p));
                            tr.append(td.append(textarea));
                            trGlobale.append(trIntestazione).append(tr);
                            $("#colEsameObiettivo").find("table").prepend(trGlobale.html());

                           // $("#txtEsameObiettivo_"+k).autosize();
                        }

                });
            });
            xhr.fail(function (jqXHR) {
                logger.error(JSON.stringify(jqXHR));
                if(LIB.isValid(home) && LIB.isValid(home.NOTIFICA)){
                    home.NOTIFICA.error({message: "Errore nel ricepire le rivalutazioni precedenti contattare l'assistenza", title: "Error", timeout: 5});
                }
            });
        }

    },
    gestisciAllergie : function (){

        var  fldEsameObiettivo =  $("#fldEsameObiettivo") ;

        if($("#READONLY").val()!=="S"){
            fldEsameObiettivo.append( NS_ESAME_OBIETTIVO.creaButtonImporta());
            fldEsameObiettivo.append( NS_ESAME_OBIETTIVO.creaButtoInserisci());
        }

        var allergie = $("#txtAllergie");
        if(allergie.val() == ''){
            allergie.closest("div#rowAllergie").hide();
        }

    },
    creaButtonImporta : function(){

        var button;
        button = document.createElement("button");
        button.innerHTML = "Importa Allergie";
        if(!document.all){// if (!home.NS_FENIX_PS.isIE) {
            button.type = "button";
        }

        button.id = "ImportaAllergie";
        button.className = "btn";
        button.style.display = "inline-block";
        $(button).on("click", function() {
            NS_ESAME_OBIETTIVO.importaAllergie();
        });

        return button;


    },
     importaAllergie : function(){
        var testo = '';
        var db = $.NS_DB.getTool({setup_default: {datasource: 'WHALE', async: false}});

        var params = {"idenAnag": {'v': Number(home.CARTELLA.$("#IDEN_ANAG").val()), 't': 'N'}};

        var xhr = db.select({
            id       : "CCE.Q_DATI_AVVERTENZE",
            parameter: params
        });

        xhr.done(function (data) {


            var result = data.result;
           // logger.debug(JSON.stringify(data));
            logger.debug('CCE.Q_DATI_AVVERTENZE result.ssize -> ' + result.length);
            if( result.length == 0) {
                home.NOTIFICA.info({message: 'Nessuna allergia trovata', timeout : 3, title : "Info"});
            }else{
                $.each(result, function (k, v) {

                    if(v.TIPO == 'ALLERGIA'){
                        testo += v.DESCRIZIONE + '\n';
                    }
                });
                var allergie = $("#txtAllergie");
                allergie.text(testo);
                allergie.closest("div#rowAllergie").show();
            }

        });

    },
    /**
     * @return HTMLElement
     * */
    creaButtoInserisci : function() {

        var button;
        button = document.createElement("button");
        button.innerHTML = "Inserisci Allergie";
        if(!document.all){//if (!home.NS_FENIX_PS.isIE) {
            button.type = "button";
        }

        button.id = "InserisciAllergie";
        button.className = "btn";
        button.style.display = "inline-block";
        $(button).on("click", function() {
            NS_ESAME_OBIETTIVO.apriPaginaInsAllergia();
        });

        return button;


    },
    gestisciMalattieRare : function () {
        var  fldEsameObiettivo =  $("#fldEsameObiettivo") ;

        if($("#READONLY").val()!=="S"){
            fldEsameObiettivo.append( NS_ESAME_OBIETTIVO.creaButtonMalattieRare());
        }
    },
    creaButtonMalattieRare : function(){
        var button;
        button = document.createElement("button");
        button.innerHTML = traduzione.lblMalattieRare;
        if(!document.all){//if (!home.NS_FENIX_PS.isIE) {
            button.type = "button";
        }

        button.id = "malRare";
        button.className = "btn";
        button.style.display = "inline-block";
        $(button).on("click", function() {
            NS_ESAME_OBIETTIVO.apriPaginaMalattieRare();
        });

        return button;
    },
    gestisciOrganismi : function () {
        var  fldEsameObiettivo =  $("#fldEsameObiettivo") ;

        if($("#READONLY").val()!=="S"){
            fldEsameObiettivo.append( NS_ESAME_OBIETTIVO.creaButtonOrganismi());
        }
    },
    creaButtonOrganismi : function(){
        var button;
        button = document.createElement("button");
        button.innerHTML = "Inserisci Organismo";
        if(!document.all){
            button.type = "button";
        }

        button.id = "organismiMultiresistenti";
        button.className = "btn";
        button.style.display = "inline-block";
        $(button).on("click", function() {
            NS_ESAME_OBIETTIVO.apriPaginaOrganismi();
        });

        return button;
    },
    apriPaginaMalattieRare : function(){
        home.PANEL.apriMalattieRare();
    },
    apriPaginaOrganismi : function (){
        home.PANEL.apriOrganismi();
    },

    apriPaginaInsAllergia : function () {
        home.NS_FENIX_TOP.apriPagina({
            url:'page?KEY_LEGAME=INS_ALLERGIE&STATO_PAGINA=I&IDEN_CONTATTO='+ $("#IDEN_CONTATTO").val(), fullscreen:true , id:'allergie'
        })
    }
};


