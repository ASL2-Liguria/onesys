/*******************************************************************************************************************
 *  author : carlog
 *                                            FUNZIONI DI CONTROLLO                                                *
 *******************************************************************************************************************/

var NS_VERBALE_CONTROLLI = {

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== typeof value) && ("null" !== value));
    },

    isReadOnly : function(){
        return($("#READONLY").val() === "S");
    },

    isRepartoUrgenza : function () {
        var reparto = $("#h-txtrepRicovero").val();
        if (!NS_VERBALE_CONTROLLI.hasAValue(reparto)) logger.error("isRepartoUrgenza : reparto is undefined");
        return ((reparto == home.baseGlobal.MED_URGENZA_PIETRA) || (reparto == home.baseGlobal.MED_URGENZA_SAVONA));
    },

    isRicoverato : function () {
        var idenRicovero = $("#hIdenRicovero").val();
        if (!NS_VERBALE_CONTROLLI.hasAValue(idenRicovero)) logger.warn("isRicoverato : idenRicovero is undefined");
        return (NS_VERBALE_CONTROLLI.hasAValue(idenRicovero));
    },

    isContattoDischarged : function () {
        if (!NS_VERBALE_CONTROLLI.hasAValue(NS_VERBALE.stato_contatto))  logger.error("isContattoDischarged : stato contatto is undefined");
        return ("DISCHARGED" === NS_VERBALE.stato_contatto);
    },

    isContattoAdmitted : function () {
        if (!NS_VERBALE_CONTROLLI.hasAValue(NS_VERBALE.stato_contatto))  logger.error("isContattoDischarged : stato contatto is undefined");
        return ("ADMITTED" === NS_VERBALE.stato_contatto);
    },

    isRegimeOBI : function () {
        if (!NS_VERBALE_CONTROLLI.hasAValue(NS_VERBALE.regime_contatto))  logger.error("isRegimeOBI : regimeContatto is undefined");
        return ("OBI" === NS_VERBALE.regime_contatto);
    },

    isAllontanato : function(){
        var statoLista = _JSON_CONTATTO.posizioniListaAttesa[_JSON_CONTATTO.posizioniListaAttesa.length - 1].stato.codice;
        return ( ("INSERITO" === statoLista) || ("COMPLETO" === statoLista) );
    },

    isMantieniOBINO : function(){
        var mantieniOBI = $("#h-radMantieniOBI").val();
        if(!NS_VERBALE_CONTROLLI.hasAValue(mantieniOBI)) { logger.error("isMantieniOBINO : radMantieniOBI is undefined"); }
        return (NS_VERBALE_CONTROLLI.isRepartoUrgenza() && NS_VERBALE.regime_contatto === "OBI" && mantieniOBI === "N");
    },

    isANumber : function (value) {
        return ( (!isNaN(value)) && (NS_VERBALE_CONTROLLI.hasAValue(value)) );
    },

    isTrauma : function () {
        var esito = $("#hEsito").val();
        return ($("#hProblemaPrinc").val() == "10" && (esito != "7" && esito != "8" && esito != "4" && esito != "5"));
    },

    isCartella : function () {
        return (LIB.isValid(home) && LIB.isValid(home.PANEL) && LIB.isValid(home.CARTELLA));
    },

    isSuperUser : function (){
        return (home.basePermission.hasOwnProperty('SUPERUSER'));
    },

    isSameUser : function(){
        return (home.baseUser.IDEN_PER == _JSON_CONTATTO.uteDimissione.id );
    },

    limiteOraChiusura : function(){
        return ( ($("#hOraDiffChiusura").val()) < home.baseGlobal["cartella.tempo_manutenzione.cartella_chiusa"] );
    },

    isSameReparti : function(giu1,giu2,ass1,ass2){
        return ((giu1===giu2) && (ass1===ass2));
    },
    //se solo un reparto è di urgenza allora torna true
    hasAMedicinaUrgenza : function(reparto1,reparto2,reparto3,reparto4){
        return (home.NS_FUNZIONI_PS.isRepartoUrgenza(reparto1) || home.NS_FUNZIONI_PS.isRepartoUrgenza(reparto2) || home.NS_FUNZIONI_PS.isRepartoUrgenza(reparto3) || home.NS_FUNZIONI_PS.isRepartoUrgenza(reparto4));
    },

    checkBeforeSave : function(){
        //lo stato dell'esame obiettivo viene preso dalla cartella ma quando la pagina viene aperta in autologin da whale essa non è presente
        //allora se esiste l'urgenza dell'esame obiettivo allora esiste anche la scheda e qundi gli imposto lo stato della pagina a E
        var statoEsameObiettivo = NS_VERBALE_CONTROLLI.isCartella() ? home.CARTELLA.jsonData.H_STATO_PAGINA.ESAME_OBIETTIVO : NS_VERBALE_CONTROLLI.hasAValue($("#hUrgenzaEsame").val()) ? "E" : "I" ;
        var controllo = false;
        var hEsitoIden =  $("#hEsitoIden").val();
        var id = $("#radSceltaEsito").find("div[data-value='"+$("#hEsito").val()+"']").data("id");

        if(!NS_VERBALE_CONTROLLI.hasAValue(hEsitoIden)){  $("#hEsitoIden").val(id); }

        if(NS_VERBALE_CONTROLLI.isAllontanato()){
            controllo = true;
        } else if(statoEsameObiettivo === "E"){
            controllo = true;
        } else{
            home.NS_LOADING.hideLoading();
            $.dialog("E' necessario scrivere una valutazione prima di scegliere l'esito",
                {title: "Attenzione",
                    buttons: [{label:"OK", action: function (){$.dialog.hide();}}]
                }
            );
        }

        return controllo;
    },

    /**
     * Carica l'urgenza da lista_attesa come e' stata precedentemente salvata nella scheda di codice_colore.
     * Se pero e' gia stata salvata almeno una scheda di esame_obiettivo, allora carica quell'urgenza.
     */
    controlloColore : function (esito) {
        var urgenzaEsame = $("#hUrgenzaEsame").val(),
            urgenzaVerbale = $("#hUrgenzaVerbale").val(),
            urgenzaTriage = _JSON_CONTATTO.posizioniListaAttesa[_JSON_CONTATTO.posizioniListaAttesa.length - 1].urgenza.id,
            urgenzaAttuale = "",
            divUrgenza = $("#UrgenzaPs");

        if (NS_VERBALE_CONTROLLI.hasAValue(urgenzaVerbale)) {
            urgenzaAttuale = urgenzaVerbale;
        } else {
            if (NS_VERBALE_CONTROLLI.hasAValue(urgenzaEsame)) {
                urgenzaAttuale = urgenzaEsame;
            } else {
                urgenzaAttuale = urgenzaTriage;
            }
        }

        if (esito === "8") {
            if(urgenzaEsame ==="CBcolorBlack"){urgenzaAttuale = divUrgenza.find("div.CBcolorBlack").data("value");}
            else{urgenzaAttuale = urgenzaEsame;}
        }

        /* Se l'urgenza dell'esame obiettivo era un azzurro o un magenta al suo posto ci metto un verde */
        if (NS_VERBALE_CONTROLLI.hasAValue(home.baseGlobal.COLORI_EQUIVALENTI)) {
            var a = JSON.parse(home.baseGlobal.COLORI_EQUIVALENTI);

            for (var i = 0; i < a.length; i++) {
                if (urgenzaAttuale == a[i]) {
                    urgenzaAttuale = home.baseGlobal.COLORE_DEFAULT;
                }
            }
        }

        $("#h-UrgenzaPs").val(urgenzaAttuale);
        $("#UrgenzaPs_" + urgenzaAttuale).addClass("RBpulsSel");
    },

    checkEsenzioni: function (json) {
        var params = {
            "P_IDEN_ANAG": {v: json.iden_anag, t: "N"},
            "P_COD_ESENZIONE": {v: json.cod_esenzione, t: "V"},
            "P_MOTIVO": {v: json.motivo, t: "V"},
            "SOUT": {d: "O"},
            "P_GIORNI_PROGNOSI": {v: json.giorni_prognosi, t: "N"}
        };

        var parametri = {
            "datasource": "WHALE",
            id: "GEST_ESENZIONI.ESENZIONI_INFORTUNIO",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk(data) {
            logger.info("Il paziente con iden_anag " + json.iden_anag + " ha " + data.SOUT);
            json.callback();
        }
    },

    /**
     * controllo sul valore della diagnosi ICD9 nei casi di esito ricovero, usato da ADT_DiagnosiICD9.xml
     * @param value
     */
    checkDiagnosi: function (value) {
        var codice = parseFloat(value.CODICE),
            esitoOBI = $("#h-radOBI").val(),
            esito = $("#h-radSceltaEsito").val(),
            campiTraumatismi = $("#cmbTraumatismo, #txtCategoriaCausaEsterna, #cmbCausaEsterna");

        if (( ( (codice > 800) && (codice < 904) ) || ( (codice > 910) && (codice < 994) ) ) && ( esito == "2" || (esitoOBI == "2") )) {
            NS_VERBALE.validator._attachStatus(campiTraumatismi, {"status": "required"});
        } else {
            if (!NS_VERBALE_CONTROLLI.isTrauma()) {NS_VERBALE.validator.removeStatus(campiTraumatismi, {"status": ""}); }
        }
    },
    /**
     * Controllo sul combo dei traumatismi, se valorizzato diventano obbligatori altri campi ad esso collegati
     */
    checkTraumatismi: function () {
        var traumatismo = $("#cmbTraumatismo").find("option:selected").val(),
            esitoOBI = $("#h-radOBI").val(),
            esito = $("#h-radSceltaEsito").val(),
            campiTraumatismi = $("#cmbTraumatismo, #txtCategoriaCausaEsterna, #cmbCausaEsterna");

        if (NS_VERBALE_CONTROLLI.hasAValue(traumatismo) && (esito == "2" || (esitoOBI == "2"))) {
            NS_VERBALE.validator._attachStatus(campiTraumatismi, {"status": "required"});
        }
        else {
            NS_VERBALE.validator.removeStatus(campiTraumatismi, {"status": ""});
        }

    },
    /**
     *
     */
    checkGiorniPrognosi: function (valoreRadio) {
        var giorniPrognosi = $("#txtDayPrognosi"),
            lblGiorniPrognosi = $("#lblDayPrognosi");

        if (valoreRadio === "1") {
            giorniPrognosi.hide();
            lblGiorniPrognosi.hide();
            if (NS_VERBALE_CONTROLLI.isTrauma()) {
                NS_VERBALE.validator.removeStatus(giorniPrognosi);
            }
        }
        else {
            giorniPrognosi.show();
            lblGiorniPrognosi.show();
            if (NS_VERBALE_CONTROLLI.isTrauma()) {
                NS_VERBALE.validator._attachStatus(giorniPrognosi, {"status": "required"});
            }
        }
    },

    checkSvuotaCampi : function (){
        if($("#hEsito").val() === "6") {
            {NS_VERBALE_EVENTI.svuotaCampiVerbale($("#h-radOBI").val());}
        } else {
            NS_VERBALE_EVENTI.svuotaCampiVerbale($("#h-radSceltaEsito").val());
        }
    },
    /**
     * Se richiesta la catena di custodia alert per ricordarsi di richiedere gli esami
     */
    controlloCatenaCustodia: function () {

        if ((NS_VERBALE_CONTROLLI.hasAValue($("#hCatena").val())) && (NS_VERBALE_CONTROLLI.isCartella()) && (home.PANEL.catenaCustodia !== "S")  && (!NS_VERBALE_CONTROLLI.hasAValue(_JSON_CONTATTO.mapMetadatiString.ESAMI_FORENSI)) ) {
            NS_VERBALE.headerTab.append("<span style='color: rgb(255, 255, 0);' id='lblAlertAlcol'>ATTENZIONE : INSERIRE ESAMI TOSSICOLOGICI E/O ALCOOLEMICI</span>");
            $("#lblAlertAlcol").css({'position': 'absolute', 'right': '10px'});
        }
    },
    /**
     * Controllo se ho stampato dei report, altrimenti alla fine del salvataggio apro
     * forzatamente la pagina moduli per indurre l'utente a stamparli
     * */
    controlloStampa: function () {

        $(".butSalvaBozza,.butSalvaVerbale,.butFirma").off("click");

        if (NS_VERBALE_CONTROLLI.isCartella() && !NS_VERBALE_CONTROLLI.hasAValue(home.PANEL.stampa)) {
            home.PANEL.NS_REFERTO.apriModulistica();
            home.PANEL.NS_FUNZIONI.tDxAcc.accordion({active: 1});
        }
        else if (!NS_VERBALE_CONTROLLI.isCartella()) {
            var url = "page?KEY_LEGAME=MODULISTICA&IDEN_CONTATTO=" + $("#IDEN_CONTATTO").val() + "&IDEN_PROVENIENZA=" +
                $("#IDEN_PROVENIENZA").val() + "&IDEN_CDC=" + $("#IDEN_CDC_PS").val() +
                "&READONLY=N&LISTA_CHIUSI=S&TEMPLATE=MODULI/CheckModuli.ftl&AUTOLOGIN=S";
            url = url + '&USER_PS=' + home.baseUser.USERNAME + '&time=' + new Date().getTime();
            parent.$(".iScheda")[0].src = url;
        }
    },

    controlloDecesso : function(){
        var esito = $("#hEsito").val();
        var esitoOBI = $("#h-radOBI").val();
        var dataMorte = $("#hDataMorte").val();
        /* Segnalo decesso se esito deceduto */
        if(esito === "7") {
            home.NS_SEGNALA_DECESSO.segnalaDecesso({"iden_anag" : _JSON_CONTATTO.anagrafica.id, "data_decesso" : $("#h-txtDataDecesso").val(), "callback" : function(){return true;}});
            home.NS_LOADING.hideLoading();
        }
        /* Segnalo decesso in OBI */
        else if(esito === "6" && esitoOBI === "7") {
            home.NS_SEGNALA_DECESSO.segnalaDecesso({"iden_anag" : _JSON_CONTATTO.anagrafica.id, "data_decesso" : $("#h-txtDataDecesso").val(), "callback" : function(){return true;}});
            home.NS_LOADING.hideLoading();
        }
        /* Anulla decesso  */
        else if(NS_VERBALE_CONTROLLI.hasAValue(dataMorte) ) {
            home.NS_ANNULLA_DECESSO.annullaSegnalaDecesso({"iden_anag" : _JSON_CONTATTO.anagrafica.id, "callback" : function(){return true;}});

            if(esito === "4"){
                home.NS_WK_PS.caricaWk();
                if(NS_VERBALE_CONTROLLI.isCartella()){home.PANEL.chiudi();}
                home.NS_LOADING.hideLoading();
            }
        }
    },
    /**
     * controlloDatiRicovero : controllo sui dati del update ricovero
     * @param callback
     */
    controlloDatiRicovero : function (callback) {

        var codiceRicovero = _JSON_RICOVERO.codice.codice,
            repartoGiuIniziale = NS_VERBALE.reparto_giuridico_iniziale,
            repartoAssIniziale = NS_VERBALE.reparto_assistenziale_iniziale,
            repartoGiuAttuale = $("#h-txtrepRicovero").val(),
            repartoAssAttuale = $("#h-txtrepAssistenza").val();

        home.NS_FUNZIONI_PS.hasDatiAccesso(codiceRicovero, function(){

            //ha dei dati legati al ricovero

            if(NS_VERBALE_CONTROLLI.isSameReparti(repartoGiuIniziale,repartoGiuAttuale,repartoAssIniziale,repartoAssAttuale)){
                //reparti non cambiati
                logger.info("controlloDatiRicovero : ha dati legati al ricovero ma non sono cambiati i reparti");
                callback();
            }
            else{
                //reparti cambiati
                if(NS_VERBALE_CONTROLLI.hasAMedicinaUrgenza(repartoGiuIniziale,repartoGiuAttuale,repartoAssIniziale,repartoAssAttuale)){
                    //vi e' una medicina d'urgenza
                    home.NS_LOADING.hideLoading();
                    //uno dei due reparti is medicina urgenza
                    $.dialog("Proseguendo si perderanno tutti i dati relativi al ricovero in Medicina di Urgenza. \nSi vuole procedere? ",{
                        title: "Attenzione",
                        buttons: [
                            {label: "NO", action: function () {
                                $.dialog.hide();
                            }},
                            {label: "SI", action: function () {
                                $.dialog.hide();
                                //ha dati ma e' un urgenza e posso cambiare pur perdendo i dati
                                NS_LOADING.showLoading({"timeout": "0","testo": "SALVATAGGIO VERBALE","loadingclick": function (){return false;}});
                                callback();
                            }}
                        ]
                    });
                }
                else {
                    //nessun reparto di medicina urgenza
                    home.NS_LOADING.hideLoading();
                    home.NOTIFICA.warning({"timeout": "0", "message": "Sono presenti dei dati legati al ricovero " + codiceRicovero + "\nImpossibile cancellare o modificare il ricovero", "title" : "Error"});
                    return false;
                }
            }

        } ,function(){
            //non ha dati legati al ricovero
            callback();
        });
    }

};