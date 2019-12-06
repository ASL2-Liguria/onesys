/* global data, home, NS_FIRMA_MODULI, NS_CALL_DB, jsonData, NS_INPS */

/**
 * Carlog
 *
 * All'apertura della scheda lancia una procedura
 * che popola il check selezionando in automatico i check
 * a seconda dei dati inseriti nelle altre schede
 * */
$(function() {
    NS_MODULI.init();
    NS_MODULI.setEvents();
});

var NS_MODULI = {
    xmlInput : null,
    modSave : null,
    inailRead: null,
    iden_contatto: $('#IDEN_CONTATTO').val(),
    iden_provenienza: $('#IDEN_PROVENIENZA').val(),
    stato_pagina: null,


    init : function() {

        //NS_BUILD_MODULISTICA.buildPage();

        home.NS_CONSOLEJS.addLogger({name: 'Modulistica', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['Modulistica'];
        home.SCHEDA_MODULI = window;
        $('.tdText').find('input').attr('readonly','readonly');
        NS_MODULI.inailRead = 'N';
        //NS_MODULI.setTdWarning();
        //SET_FUNZIONI_MODULI.setFunctions();

        $('.txtWarn').each(function(){
            $(this).closest('td').css('width','10px');
        });

        $(".txtDataInvioVuota").hide();

        NS_FENIX_SCHEDA.customizeParam = function(params){ params.extern=true; return params; };

        if($('#LISTA_CHIUSI').val() == 'N'){
            $('.butChiudi').hide();
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }


        if($("#READONLY").val()==="S")
        {
            $("button.butStampa").hide();
            //$(".fnc").hide();
            $(".tdCheck").find('div').off('click');
            $("div.contentTabs").css({"background":"#CACACC"});
            //return;
            NS_MODULI.inailRead = 'S';
        }

        if($("#AUTOLOGIN").val()==="S"){
            $("button.butChiudi").hide();
            NS_MODULI.caricaJsonModuli($("#IDEN_CDC").val());
        }

        NS_MODULI.xmlInput = NS_MODULI.generaXmlInput();

        NS_MODULI.generaXmlOutput();

    },
    setEvents : function() {

        $(".butStampa").on("click", NS_MODULI.stampaModuli);

    },
    /**
     * funzione che crea un xml dove il KEY_CAMPO è uguale agli
     * id dei pulsanti del check
     * */
    generaXmlInput : function(){
        // prendo i valori di tutti i check
        var tuttiModuli = NS_MODULI.getValoreModuli();
        //inizializzo l'xml
        var xml = "<?xml version='1.0' encoding='ISO-8859-1'?>" +
            "<PAGINA><INFO><PAGINA/><IDENTIFICATIVO/></INFO><CAMPI>";
        //riempo l'xml con tutte le scelte del check
        for (var i=0; i<tuttiModuli.length; i++) {
            xml += '<CAMPO KEY_CAMPO="' + tuttiModuli[i] + '" VALUE="" DATA=""  DATA_INVIO="" WARN="" LEVEL="" MESSAGE=""/>';
        }
        xml += "</CAMPI></PAGINA>";

        //lo passo col return
       // console.log("generaXmlInput -> " + xml);
        return xml;
    },
    /**
     * Funzione che prende l'xml generato lo manda alla procedura
     * RPT_POPOLA_XML_MODULI che lo ritorna valorizzato
     * */
    generaXmlOutput : function(){

        var db = $.NS_DB.getTool({setup_default:{datasource:'PS',async:false    }});
        var parametri  = {
            'pIdenContatto' : {v: NS_MODULI.iden_contatto, t:'V'},
            'pXml' : {v: NS_MODULI.xmlInput, t:'V'},
            'p_result' : {d:'O'},
            'p_message' : {d:'O'}
        };
        var xhr = db.call_procedure({
            id: "RPT_POPOLA_XML_MODULI",
            parameter: parametri
        });
        xhr.done(function (data) {

            if(data.p_result !== ''){
                NS_MODULI.selezionaCheck(data.p_message);
            }else{
                home.NOTIFICA.error({message: "Attenzione errore nella creazione dell'xml", title: "Error"});
                logger.error("errore nella procedura RPT_POPOLA_XML_MODULI params = " + parametri.pXml + "\n" +parametri.pIdenContatto );
            }
        });
        xhr.fail(function (jqXHR) {
            home.NOTIFICA.error({message: "Attenzione errore nella creazione dell'xml", title: "Error"});
            logger.error("Errore in RPT_POPOLA_XML_MODULI jqXHR " +  JSON.stringify(jqXHR));
        });

    },

    setTdWarning: function(){
        $(".tdText").each(function(){
            //var attr = $(this).attr('class').split(' ').pop();

        })
    },
    /**
     * Funzione che prende l'xml generato lo analizza
     * per determinare quali campi sono valorizzati,
     * in base a ciò seleziona i check che hanno un valore.
     * Poi inserisce nell'input nascosto
     * i valori dei check selezionati.
     * */
    selezionaCheck: function (xml) {

        //parso l'xml per alvorarlo con il jquery
        var xmlDoc = $.parseXML( xml );
       //console.log('xmlOut -> '  + xml);
        NS_MODULI.xmlSave = xml;
        var $xml = $( xmlDoc );
        //prendo tutti gli id dei check
        var tuttiModuli = NS_MODULI.getValoreModuli();

        var $errors = $('.spanError');
        if($errors.length > 0 ){
            $errors.empty();
        }
        var $warnings = $('.spanWarning');
        if($warnings.length > 0 ){
            $warnings.empty();
        }
        var $delete = $('.spanDelete');
        if($delete.length > 0 ){
            $delete.empty();
        }


        var valChkMod = "";
        var $div;
        var a4;
        for(var i=0; i<tuttiModuli.length; i++){
            //alert(tuttiModuli[i]);
            $div =  $('div[data-key_scheda="'+tuttiModuli[i]+'"]');

            var valoreCheckXml = $($xml).find("CAMPO[KEY_CAMPO='"+ tuttiModuli[i] + "']").attr("VALUE");
            var DataCheckXml = $($xml).find("CAMPO[KEY_CAMPO='"+ tuttiModuli[i] + "']").attr("DATA");
            var DataInvioXml = $($xml).find("CAMPO[KEY_CAMPO='"+ tuttiModuli[i] + "']").attr("DATA_INVIO");
            var message = $($xml).find("CAMPO[KEY_CAMPO='"+ tuttiModuli[i] + "']").attr("MESSAGE");
            var level = $($xml).find("CAMPO[KEY_CAMPO='"+ tuttiModuli[i] + "']").attr("LEVEL");
            //var Warn = $($xml).find("CAMPO[KEY_CAMPO='"+ tuttiModuli[i] + "']").attr("WARN");

            if(valoreCheckXml==='S' && DataCheckXml===""){
                //aggiunge il valore = all'id che vogliamo selezionato
                valChkMod += tuttiModuli[i]+ ",";
                // e agginge la classe selezionato a tale id
                $div.addClass("CBpulsSel");
                /*se livello è bloccato ma il valore è S viene checkato ma non viene stampato finchè non si compila la scheda*/
                if(level === 'LOCK'){
                    $div.removeClass("CBcolorDefault").addClass("CBdisabled");
                }

            }



            if(DataCheckXml !== ''){
                $("." + tuttiModuli[i] ).find('input').val(DataCheckXml);
            }

            if(DataInvioXml !== ''){
                $(".INVIO_" + tuttiModuli[i] ).find('input').val(DataInvioXml);
            }
            /*
             * se non è bloccata e se è cancellabile appendo il div deleted
             */

            if($div.data("cancellabile") === "S" && level === 'SPECIFIC_ERROR' ){
                var icon = $(document.createElement('a')).attr('onclick',
                    ""+$div.data("fnc_cancella")+"").html(
                    "<i class='icon-cancel' title='Elimina Modulo'>");

                $div.closest("tr").find(".tdFunzioni").find(".spanDelete").empty().append(icon);
            }


            switch (level) {
                case 'WARNING':
                    a4 = $(document.createElement('a')).attr('class','warnMessage').html("<i class=' icon-attention' title='Completa Richiesta'>");
                    $div.closest("tr").find(".tdFunzioni").find(".spanWarning").empty().attr("value",message).append(a4);
                    break;
                case 'LOCK' :
                    a4 = $(document.createElement('a')).attr('class','warnMessage').html("<i class=' icon-attention' title='Completa Richiesta'>");
                    $div.off('click').closest("tr").find(".tdFunzioni").find(".spanWarning").empty().attr("value",message).append(a4);
                    break;
                case 'SPECIFIC_ERROR':
                case 'ERROR' :
                    a4 = $(document.createElement('a')).attr('class','errorMessage').html("<i class=' icon-cancel-circled' title='Impossibile stampare'>");
                    $div.off('click');
                    $div = $div.closest("tr").find(".tdFunzioni");
                    $div.find(".spanError").empty().attr("value",message).append(a4);
                    $div.find(".spanOpen").empty();
                    break;


            };


            if($div.data("compilabile") === "S"){
                var icon = $(document.createElement('a')).attr('onclick',
                    ""+$div.data("funzione")+"").html(
                    "<i class='icon-docs' title='Compila Modulo'>");

                $div.closest("tr").find(".tdFunzioni").find(".spanOpen").empty().append(icon);
            }else if($div.data("compilabile") === "F"){
                var icon = $(document.createElement('a')).attr('onclick',
                    ""+$div.data("funzione")+"").html(
                    "<i class='icon-pencil' title='Firma Modulo'>");

                $div.closest("tr").find(".tdFunzioni").find(".spanOpen").empty().append(icon);
            }




        }

        $('.spanWarning').each(function(){

            $(this).on('click',function(e,message){
                message = $(this).attr('value');

                NS_MODULI.appendMessage(message,e);
            })
        });
        $('.spanError').each(function () {
            $(this).on('click',function(e,message){
                message = $(this).attr('value');
                message = message.split(";").join("\n");//message.replace(/([*;])/g,"<br/>");

                NS_MODULI.appendMessage(message,e);
            })
        });

        //tolgo l'ultima virgola se no mi fà casino
        valChkMod = valChkMod.substring(0,valChkMod.length-1);
        //setto l'input nascosto con i valori dei check selezionati
        $("#h-chkModuli").val(""+valChkMod+"");
    },


    /**
     * Funzione che prende i due array generati:
     * quello di tutti i check e quello con
     * solo i check selezionati, dopodichè creo un
     * url con i prompt per ogni check
     * (perchè su 3.10 c'è un referto : OMNIA_REPORT_PS
     * contenente un subReport per ogni voce del check)
     * che valorizzerò con S o N a seconda dei check
     * selezionati.
     * Alla fine verranno stampati tutti i record selezionati
     * dal check.
     * */
    appendMessage: function(message,e){
        var tableWarning = $(document.createElement("table"));
        var tr1 = $(document.createElement("tr"));
        tr1.append($(document.createElement("td")).text(message)).css("white-space","pre-line");

        tableWarning.append(tr1);


        NS_MODULI.creatInfoDialog("Attenzione",tableWarning,200,e);
    },

    creatInfoDialog : function(header,table,width,e){
        $.infoDialog({
            event: e,
            classPopup: "",
            headerContent: header,
            content:table,
            width: width,
            dataJSON: false,
            classText: "infoDialogTextMini"
        });
    },

    stampaModuli : function() {

        //SE c'è ceckato il modulo di referto autorità giudiziara guardo se è presente il numero referto se non è presente lo genero.
        var check_aut = $("#chkModAutorita_AUTORITA_GIUDIZIARIA_COMPETENTE");
        if(check_aut.hasClass("CBpulsSel") && !(check_aut.hasClass('CBdisabled'))){
            NS_MODULI.checkNumeroAutorita(stampa);
        }else{
            stampa();
        }

        function stampa () {
            var url_prompt;
            var entrato = false;
            $(".CBpulsSel").each(function(k,v){
                entrato = true;
                if( !$(this).hasClass("CBdisabled") ){
                    var utente = home.baseUser.IDEN_PER;
                    var tipo = $(this).data('tipo');
                    var key_Scheda = $(this).data('key_scheda');
                    var jsonModulo = home.baseUserModuli[tipo][key_Scheda];
                    url_prompt = eval(jsonModulo.GENERA_URL_PROMPT);

                    var par ={
                        'PRINT_REPORT' : jsonModulo.NOME_REPORT,
                        'PRINT_DIRECTORY' : '1',
                        "PRINT_PROMPT" : url_prompt
                    };

                    par.N_COPIE = jsonModulo.N_COPIE;
                    NS_MODULI.setDataStampa(jsonModulo.KEY_SCHEDA,par,utente);
                }
            });

            if(!entrato) {
                  $.dialog("Nessun modulo e' stato selezionato. \n E' possibile che uno o piu' moduli necessitano di essere compilati prima della stampa.",
                    {title: "Attenzione",
                        buttons: [
                            {
                                label: "OK", action: function () {
                                $.dialog.hide();
                            }
                        }
                        ]
                    }
                );

            }
            /**
             * Valorizzo la variabile globale stampa per sapere se e cosa ho già
             * stampato.
             * @todo non capisco a cosa serva, chiedere ad alberto.
             * */
            if(typeof home.PANEL !== "undefined" && home.PANEL !== null && home.PANEL !== '' && $(".CBdisabled").length == 0){
                home.PANEL.stampa = url_prompt;
            }

            if(url_prompt.indexOf("&promptpCATENA_CONSENSO='S'") > -1){
                home.PANEL.catenaCustodia = "S";
            }
        }

    },

    getValoreModuli : function() {

        var jsonArray = [];
        $('.tdModulo').each(function() {
            if(!$(this).hasClass('CBdisabled')){
                var $div = $(this).find('div');
                jsonArray.push($div.data('key_scheda'));
            }

        });
        return jsonArray;


/*
        // qui getJsonArray mi ritorna un json key:val
        var jsonModuli = NS_MODULI.JsonArr();

        var tuttiModuli;
        var keyModuli = "";
        // lo ciclo per ottenere solo i valori key e metterli in un array
        for ( var obj in jsonModuli) {
            if (jsonModuli.hasOwnProperty(obj)) {

                for ( var prop in jsonModuli[obj]) {
                    if (jsonModuli[obj].hasOwnProperty(prop)) {

                        if (prop === 'value') {

                            keyModuli += jsonModuli[obj][prop] + ",";
                        }
                    }

                }
            }
        }

        // creo l'array di tutti i valori del check
        // tolgo l'ultimo carattere ","
        keyModuli = keyModuli.substring(0, keyModuli.length - 1);

        // split e creo un array
        tuttiModuli = keyModuli.split(",");


        return tuttiModuli;
*/
    },



    apriInail: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('INAIL','CONTATTO.Q_STATO_PAGINA_MODULI');

    },

    apriInps : function(){
        var db = $.NS_DB.getTool();
        var dbParams = {
            "iden_contatto": {v: $('#IDEN_CONTATTO').val(), t: "N" }
        };

        var xhr = db.select({
            datasource: "MMG",
            id: 'DATI.EXIST_PAGINA_INPS',
            parameter: dbParams
        });

        xhr.done(function (response) {
            var res = response.result;

            home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=INPS&IDEN_CONTATTO=' +
                NS_MODULI.iden_contatto + '&IDEN_PROVENIENZA=' + NS_MODULI.iden_provenienza + '&SCHEDA=INPS' +
                '&STATO_PAGINA='+ res[0].STATO_PAGINA +'&READONLY='+NS_MODULI.inailRead+"&LISTA_CHIUSI="+ $("#LISTA_CHIUSI").val()
                ,fullscreen:true});

        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error(JSON.stringify(jqXHR));
            home.NOTIFICA.error({message: "Errore nel recepire i dati della pagina", title: "Error"});

        });

    },

    apriSegnalazioneDecesso: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_SEGNALAZIONE_DECESSO','CONTATTO.Q_STATO_PAGINA_MODULI');

    },

    apriSegnalazioneGiuntoCadavere: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_SEGNALAZIONE_GIUNTOCADAVERE','CONTATTO.Q_STATO_PAGINA_MODULI');

    },

    apriConstatazioneDecesso: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_CONSTATAZIONE_DECESSO','CONTATTO.Q_STATO_PAGINA_MODULI');

    },

    apriConstatazioneGiuntoCadavere: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_CONSTATAZIONE_GIUNTOCADAVERE','CONTATTO.Q_STATO_PAGINA_MODULI');

    },

    apriDenunciaMorsoAnimale: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_DENUNCIA_MORSO_ANIMALE','CONTATTO.Q_STATO_PAGINA_MODULI');

    },


    apriRelazioneEsternaCadavere: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_RELAZIONE_ESTERNA_CADAVERE','CONTATTO.Q_STATO_PAGINA_MODULI');
    },

    apriIncidenteIntraospedaliero: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_INCIDENTE_INTRAOSPEDALIERO','CONTATTO.Q_STATO_PAGINA_MODULI');
    },

    apriMalattieInfettive: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_MALATTIE_INFETTIVE','CONTATTO.Q_STATO_PAGINA_MODULI');

    },

    apriTrasportoGratisAmbulanza: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_TRASPORTO_GRATIS_AMBULANZA','CONTATTO.Q_STATO_PAGINA_MODULI');
    },

    apriTrasportoSanitarioEmergenza: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_TRASPORTO_SANITARIO_EMERGENZA','CONTATTO.Q_STATO_PAGINA_MODULI');
    },

    apriPosizionamentoCVC: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_RICHIESTA_POSIZIONAMENTO_CVC','CONTATTO.Q_STATO_PAGINA_MODULI');

    },

    apriAdr: function(){
        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_ADR','CONTATTO.Q_STATO_PAGINA_MODULI');
    },

    apriTrasportoUrgenteElicottero: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_TRASPORTO_URG_ELICOTTERO','CONTATTO.Q_STATO_PAGINA_MODULI');

    },

    apriTrasportoUrgenteAmbulanza: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_TRASPORTO_URG_AMBULANZA','CONTATTO.Q_STATO_PAGINA_MODULI');

    },

    apriPropostaTSO: function(){

        GET_STATO_PAGINA_MODULI.getStatoPagina('MODULO_PROPOSTA_TSO','CONTATTO.Q_STATO_PAGINA_MODULI');
    },



    salvaAutorita: function () {
        NS_MODULI.checkNumeroAutorita(registraAutorita);

        function registraAutorita(){

            var db = $.NS_DB.getTool();
            var dbParams = {
                "pIdenPer": {v: Number(home.baseUser.IDEN_PER), t: "N" },
                "pIdenContatto": {v: Number($("#IDEN_CONTATTO").val()), t: "N"},
                "pUsername":{v: home.baseUser.USERNAME, t: "V"},
                "pMessage":{d: "O", t: "V"}

            };

            var xhr = db.call_procedure({
                datasource: "PS",
                id: "GEST_PS_SCHEDE_XML_TEST.SALVA_SCHEDA_AUTORITA",
                parameter: dbParams
            });
            xhr.done(function (response) {
                if (response) {

                    NS_MODULI.firmaAutorita(response.pMessage);
                } else {
                    logger.error("ERRORE PROCEDURA");
                }
            });
            xhr.fail(function (jqXHR) {
                logger.error("ERRORE CONNESSIONE");
                logger.error(JSON.stringify(jqXHR));
            });

        }
    },


    salvaCertificatoRicovero: function () {


        var db = $.NS_DB.getTool();
        var dbParams = {
            "pIdenPer": {v: Number(home.baseUser.IDEN_PER), t: "N" },
            "pIdenContatto": {v: Number($("#IDEN_CONTATTO").val()), t: "N"},
            "pUsername":{v: home.baseUser.USERNAME, t: "V"},
            "pMessage":{d: "O", t: "V"}

        };

        var xhr = db.call_procedure({
            datasource: "PS",
            id: "GEST_PS_SCHEDE_XML_TEST.SALVA_SCHEDA_CERTIFICATO",
            parameter: dbParams
        });
        xhr.done(function (response) {
            if (response) {

                NS_MODULI.firmaCertificatoRicovero(response.pMessage);
            } else {
                logger.error("ERRORE PROCEDURA");
            }
        });
        xhr.fail(function (jqXHR) {
            logger.error("ERRORE CONNESSIONE");
            logger.error(JSON.stringify(jqXHR));
        });


    },

    salvaCertificatoRicoveroSD: function () {


        var db = $.NS_DB.getTool();
        var dbParams = {
            "pIdenPer": {v: Number(home.baseUser.IDEN_PER), t: "N" },
            "pIdenContatto": {v: Number($("#IDEN_CONTATTO").val()), t: "N"},
            "pUsername":{v: home.baseUser.USERNAME, t: "V"},
            "pMessage":{d: "O", t: "V"}

        };

        var xhr = db.call_procedure({
            datasource: "PS",
            id: "GEST_PS_SCHEDE_XML_TEST.SALVA_SCHEDA_CERTIFICATO_SD",
            parameter: dbParams
        });
        xhr.done(function (response) {
            if (response) {

                NS_MODULI.firmaCertificatoRicoveroSD(response.pMessage);
            } else {
                logger.error("ERRORE PROCEDURA");
            }
        });
        xhr.fail(function (jqXHR) {
            logger.error("ERRORE CONNESSIONE");
            logger.error(JSON.stringify(jqXHR));
        });


    },


    checkNumeroAutorita: function(cb){
        var jsonQuery = {
            datasource : 'PS',
            id :"CHECKANDCREATENUMREFAUTOGIU",
            params : {pIdenContatto : {t:'N', v: NS_MODULI.iden_contatto} },
            callbackOK : callback
        };
        NS_CALL_DB.FUNCTION(jsonQuery);

        function callback(resp) {

            if(resp.p_result === 'OK'){
                cb();
            }

        }
    },

    firmaAutorita: function(iden,p){

        //home.FIRMA = $.extend({},home.FIRMA, home.FIRME_PS["MODULI"]);

        var _idenContatto  = $("#IDEN_CONTATTO").val();

        NS_FIRMA_MODULI.setReport("AUTORITA_GIUDIZIARIA_COMPETENTE");
        NS_FIRMA_MODULI.setIdenContatto(_idenContatto);
        NS_FIRMA_MODULI.setStatoVerbale("R");
        NS_FIRMA_MODULI.setDocumento("AUTORITA_GIUDIZIARIA_COMPETENTE");
        NS_FIRMA_MODULI.setIdenScheda(iden);
        NS_FIRMA_MODULI.setCallback(function(){

           // home.NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), false, function(){
            //    home.NS_LOADING.hideLoading();

        });
        NS_FIRMA_MODULI.setListaChiusi($("#LISTA_CHIUSI").val());

        if (typeof p === 'undefined'){
            var prompts = "&promptpIdenContatto=" + _idenContatto + '&promptpFirma=S'+ '&promptpStatoVerbale=';
            prompts += jsonData.hStatoVerbale === "F" ? "E" : "R";
            p = {
                "STAMPA" : {"PRINT_REPORT":NS_FIRMA_MODULI.getReport(), "PRINT_DIRECTORY": "1", "PRINT_PROMPT": prompts, N_COPIE :  home.baseUserModuliReport.AUTORITA_GIUDIZIARIA_COMPETENTE.N_COPIE_F},
                "FIRMA" : {}
            };
        }

        $.extend(  home.NS_FENIX_PRINT.config, p.STAMPA );

        if(typeof p != 'undefined'){
            NS_FIRMA_MODULI.firmaGenericaModuli(p);
        }else{
            NS_FIRMA_MODULI.firmaGenericaModuli();
        }
    },

    firmaCertificatoRicovero: function(iden,p){
        var _idenContatto  = $("#IDEN_CONTATTO").val();

        //home.FIRMA = $.extend({},home.FIRMA, home.FIRME_PS["MODULI"]);

        NS_FIRMA_MODULI.setReport("CERTIFICATO_RICOVERO");
        NS_FIRMA_MODULI.setIdenContatto(_idenContatto);
        NS_FIRMA_MODULI.setStatoVerbale("R");
        NS_FIRMA_MODULI.setDocumento("CERTIFICATO_RICOVERO");
        NS_FIRMA_MODULI.setIdenScheda(iden);
        NS_FIRMA_MODULI.setCallback(function(){

         //   home.NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){ home.NS_LOADING.hideLoading();});

        });
        NS_FIRMA_MODULI.setListaChiusi($("#LISTA_CHIUSI").val());


        if(typeof p != 'undefined'){
            NS_FIRMA_MODULI.firmaGenericaModuli(p);
        }else{
            NS_FIRMA_MODULI.firmaGenericaModuli();
        }

    },

    firmaCertificatoRicoveroSD: function(iden,p){
        var _idenContatto  = $("#IDEN_CONTATTO").val();

        //home.FIRMA = $.extend({},home.FIRMA, home.FIRME_PS["MODULI"]);

        NS_FIRMA_MODULI.setReport("CERTIFICATO_RICOVERO_SD");
        NS_FIRMA_MODULI.setIdenContatto(_idenContatto);
        NS_FIRMA_MODULI.setStatoVerbale("R");
        NS_FIRMA_MODULI.setDocumento("CERTIFICATO_RICOVERO_SD");
        NS_FIRMA_MODULI.setIdenScheda(iden);
        NS_FIRMA_MODULI.setCallback(function(){

            //   home.NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){ home.NS_LOADING.hideLoading();});

        });
        NS_FIRMA_MODULI.setListaChiusi($("#LISTA_CHIUSI").val());


        if(typeof p != 'undefined'){
            NS_FIRMA_MODULI.firmaGenericaModuli(p);
        }else{
            NS_FIRMA_MODULI.firmaGenericaModuli();
        }

    },



    setDataStampa: function(moduloStampa, par, utente){

        // moduliStampa = moduliStampa + ',DEFAULT';

        var db = $.NS_DB.getTool();
        var  param;
        var dbParams = {
            "pModuli": {v: String(moduloStampa), t: "V" },
            "pIdenContatto": {v: Number($("#IDEN_CONTATTO").val()), t: "N"},
            "pUtente":{v: Number(utente), t: "N"},
            "pStato":{d: "O", t : "V"},
            "pIdenScheda":{d: "O", t : "N"}

        };

        var xhr = db.call_procedure({
            datasource: "PS",
            id: "SET_DATA_STAMPA_SINGOLO",
            parameter: dbParams
        });
        xhr.done(function (response) {
            if (response) {
                home.NS_FENIX_PRINT.caricaDocumento({"PRINT_REPORT":"BLANK", "PRINT_DIRECTORY": "1", "PRINT_PROMPT": "&promptpMessage=" + escape("CARICAMENTO ANTEPRIMA MODULO")});

                if(response.pStato === "F"){
                    par["PRINT_PROMPT"] += "&promptpStatoModulo=E";

                    param = {
                        "STAMPA_IMMEDIATA" : "S",
                        "afterStampa" : function (){home.NS_FENIX_PRINT.config = null;},
                        "beforeApri" : home.NS_FENIX_PRINT.initStampa
                    };

                    param = $.extend(par, param);

                    home.NS_STAMPE_PS.apriDocumentoFirmato(param, response.pIdenScheda, "PS.VISUALIZZA_PDF_SCHEDA", "PS");
                    NS_MODULI.generaXmlInput();
                    NS_MODULI.generaXmlOutput();
                }
                else{
                    par["PRINT_PROMPT"] += "&promptpStatoModulo=R";
                    home.NS_FENIX_PRINT.caricaDocumento(par);
                    // home.NS_FENIX_PRINT.apri(par);
                    home.NS_FENIX_PRINT.stampa(par);
                    NS_MODULI.generaXmlInput();
                    NS_MODULI.generaXmlOutput();
                }

            } else {
                logger.error("ERRORE PROCEDURA");
            }
        });
        xhr.fail(function (jqXHR) {
            logger.error("ERRORE CONNESSIONE " + jqXHR );
        });
    },
    /**
     * creo il json dei moduli quando sono in autologin da whale
     * @param iden
     */
    caricaJsonModuli : function (iden) {
        //alert("Utilizzato caricaJsonModuli di modulistampa convertire con tabhomeps");
       // home.NS_FENIX_PS.caricaJsonModuli(iden);
        var baseUserModuli = {},
            baseUserModuliReport = {};

        function callbackok (resp) {

            var result = resp.result;

            $.each(result, function (k,v){
                if(typeof baseUserModuli[result[k].TIPO] === 'undefined'){
                    baseUserModuli[result[k].TIPO] = {};
                }
                baseUserModuli[result[k].TIPO][result[k].KEY_SCHEDA] =  $.extend(baseUserModuli[result[k].TIPO][result[k].KEY_SCHEDA], result[k]);
                baseUserModuliReport[result[k].NOME_REPORT] = result[k];
            });

            home.baseUserModuli = baseUserModuli;
            home.baseUserModuliReport = baseUserModuliReport;
        }

        var par = {
            datasource : 'PS',
            id : 'CONTATTO.Q_CDC_MODULI',
            params : {IDEN_CDC : {t:'N', v:iden} },
            callbackOK : callbackok
        };

        NS_CALL_DB.SELECT(par);
    },

    generaUrlGenerics : function () {
        return "&promptpIdenContatto=" + NS_MODULI.iden_contatto + "&promptpFirma=N";
    },
    generaUrlINPS : function () {
        return "&promptpIdCertificato=" + jsonData.iden_certificato + "&promptpPagina=1";
    },
    annullaModuloINPS : function (){
        /*
         * la differenza tra iden evento e iden certificato sta nel fatto che quando registro il certificato e poi torno nella modulistica ho solo l'iden evento
         * quindi per evitare di fare una query eseguo la procedura creata appostiamente per questo caso, alla riapertura della scheda no l'iden della scheda quindi non serve avere l'iden dell'evento
         *
         *
         */
        var idenEvento = jsonData.iden_evento ;
        var idenCertificato = jsonData.iden_certificato;
        var iden_anagrafica = home.CARTELLA.NS_INFO_PAZIENTE.jsonAnagrafica.IDEN;
        var Ute_ins = home.baseUser.IDEN_PER;
        if((idenCertificato !== '' && idenCertificato !== null && idenCertificato) || (idenEvento !== '' && idenEvento !== null && idenEvento )){
            NS_INPS.annullaCertificato({
                idenCertificato : Number(idenCertificato),
                idenEvento : Number(idenEvento),
                idenAnag : Number(iden_anagrafica),
                uteIns : Number(Ute_ins),
                callbacksuccess : function(){
                    NS_MODULI.xmlInput = NS_MODULI.generaXmlInput();
                    NS_MODULI.generaXmlOutput();
                    $.dialog.hide();
                }
            });

        }else{
            home.NOTIFICA.error({message: "Salvare prima la scheda di certificato malattia", title: "Error"});
        }


    }


};