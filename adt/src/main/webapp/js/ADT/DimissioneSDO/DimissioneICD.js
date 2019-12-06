var NS_DIMISSIONE_ICD = {

    ICDEvent : 'A03',

    /**
     * Restituisce la struttura mapCodiciID da aggiungere al contatto per la dimissione.
     */
    getCodiciICD : function(){

        var jsonICD = 	_JSON_CONTATTO.codiciICD;
        var hasDiagnosi = false;
        var hasInterventi = false;

        function getCodifica(codifica){

            /*if (codifica.codice == null || codifica.codice == "")
             {
             NS_DIMISSIONE_SDO.ICDSuccess = false;
             logger.error("Codifica ICD9 " + codifica.descrizione + " NON Valorizzata Correttamente - " + JSON.stringify(codifica));
             return home.NOTIFICA.error({message : "Codifica ICD9 " + codifica.descrizione + " NON Valorizzata Correttamente. Riprovare Aprendo la Finestra Dedicata", timeout : 12, title : "Error"});
             }*/

            return {
                "evento" : {
                    "id" : null,
                    "codice" : NS_DIMISSIONE_ICD.ICDEvent
                },
                "id" : null,
                "codice" : codifica.codice,
                "descrizione" : codifica.descrizione,
                "ordine" : codifica.ordine,
                "data" :  codifica.data.length > 0 ? codifica.data : null,
                "DSEtaPediatrica" : codifica.DSEtaPediatrica,
                "DS" : codifica.DS,
                "compatibilitaEta" : codifica.compatibilitaEta,
                "compatibilitaSesso" : codifica.compatibilitaSesso,
                "salaOperatoria" : codifica.salaOperatoria

            };

        };

        // Controllo se ci sono DIAGNOSI (NON di dimissione) nella struttura del JSON
        for (var i = 0; i < jsonICD.mapCodiciICD.length; i++)
        {
            if (jsonICD.mapCodiciICD[i].key == 'DIAGNOSI')
            {
                // Svuoto la Collection per Ricostruirla con le codifiche effettivamente selezionate nella pagina
                for (var y = 0; y < jsonICD.mapCodiciICD[i].value.length; y++)
                {
                    // alert(JSON.stringify(jsonICD.mapCodiciICD[i].value) + jsonICD.mapCodiciICD[i].value[y].evento.codice + ' *** ' +  NS_DIMISSIONE_ICD.ICDEvent + '\nlength: ' + jsonICD.mapCodiciICD[j].value.length)
                    if (jsonICD.mapCodiciICD[i].value[y].evento.codice == NS_DIMISSIONE_ICD.ICDEvent)
                    {
                        jsonICD.mapCodiciICD[i].value.splice(y,1);
                        // Diminuisco il contatore in quanto la lunghezza della collection delle codifiche e' diminuita
                        y--;
                    }
                }
                hasDiagnosi = true;
                break;
            }
        }

        // Set Struttura Diagnosi Solo se NON salvata PRIMA e la principale e' settata
        if (!hasDiagnosi)
        {
            jsonICD.mapCodiciICD.push({key : "DIAGNOSI", value : []});
        }

        // Inizio la valorizzazione delle diagnosi
        var idxDiagnosi = null;

        for (var x = 0; x < jsonICD.mapCodiciICD.length; x++)
        {
            if (jsonICD.mapCodiciICD[x].key == 'DIAGNOSI') {
                idxDiagnosi = x;
            }
        }

        $("#fldDiagnosi table.campi > tbody > tr").each(function(i){

            var codifica = $(this).find("input[id^='DiagnosiICD9']");

            if (codifica.val() !== "" && codifica.val() !== null)
            {
                jsonICD.mapCodiciICD[idxDiagnosi].value.push(getCodifica(
                    {
                        "codice" : codifica.attr('data-c-value'),
                        "descrizione" : codifica.attr('data-c-descrizione'), // codifica.val(),
                        "compatibilitaEta" : codifica.attr("data-c-comp_eta"),
                        "compatibilitaSesso" : codifica.attr("data-c-comp_sesso"),
                        "data" : "",
                        "ordine" : i
                    }));
            }

        });

        // Controllo Se Ci sono INTERVENTI Nella Struttura del JSON
        for (var j = 0; j < jsonICD.mapCodiciICD.length; j++)
        {
            if (jsonICD.mapCodiciICD[j].key == 'PROCEDURE')
            {
                // Svuoto la Collection per Ricostruirla con le codifiche effettivamente selezionate nella pagina
                for (var z = 0; z < jsonICD.mapCodiciICD[j].value.length; z++)
                {
                    // Diminuisco il contatore in quanto la lunghezza della collection delle codifiche e' diminuita
                    jsonICD.mapCodiciICD[j].value.splice(z,1);
                    z--;
                }
                hasInterventi = true;
                break;
            }
        }

        // Set Struttura INTERVENTI Solo se NON salvata Prima e la principale e' presente
        if (!hasInterventi)
        {
            jsonICD.mapCodiciICD.push({key : "PROCEDURE", value : []});
        }

        // Attacco Con la valorizzazione delle diagnosi solo se la principale e' presente
        var idxInterventi = null;

        for (var z = 0; z < jsonICD.mapCodiciICD.length; z++)
        {
            if (jsonICD.mapCodiciICD[z].key == 'PROCEDURE'){
                idxInterventi = z;
            }
        }

        $("#fldInterventi table.campi > tbody > tr").each(function(i){

            var codifica = $(this).find("input[id^='InterventiICD9']");

            if (codifica.val() !== "" && codifica.val() !== null) {
                jsonICD.mapCodiciICD[idxInterventi].value.push(getCodifica(
                    {
                        "codice" : codifica.attr("data-c-value"),
                        "descrizione" : codifica.attr('data-c-descrizione'), //codifica.val(),
                        "compatibilitaEta" : codifica.attr("data-c-comp_eta"),
                        "compatibilitaSesso" : codifica.attr("data-c-comp_sesso"),
                        "DSEtaPediatrica" : codifica.attr("data-c-intervento_ds_eta_ped"),
                        "DS" : codifica.attr("data-c-intervento_ds"),
                        "salaOperatoria" : codifica.attr("data-c-intervento_sala_ope"),
                        "data" : $(this).find("input[id^='h-txtDataInterventiICD9']").val(),
                        "ordine" : i
                    }));
            }
        });

        return jsonICD;
    },

    /**
     * Valorizza i codici ICD9 nella pagina a partire dal JSON del contatto.
     * Nasconde gli input inutilizzati con un selettore e non la funzione hideDignosi/hideInterventi.
     */
    valorizeDiagnosiInterventi : function(pType) {

        var ICD = _JSON_CONTATTO.codiciICD;
        var diagnosi = [];
        var procedure = [];
        var codifica;

        logger.debug("Valorizzazione codici ICD9 SDO - Type -> " + pType + ", Codici ICD -> " + JSON.stringify(ICD));

        var i = 0; // Indice Conteggio Generale
        var j = 0; // Indice Conteggio Esclusivo ICD EVENTO A03

        var aType = [];

        if (pType == "E") {
            aType.push("DIAGNOSI","PROCEDURE");
        }

        if (pType == "P") {
            aType.push("PROCEDURE");
        }

        if (pType == "D") {
            aType.push("DIAGNOSI");
        }

        logger.debug("Valorizzazione codici ICD9 SDO - aType -> " + aType);

        for (i = 0; i < ICD.mapCodiciICD.length; i++) {


            if (ICD.mapCodiciICD[i].key == "PROCEDURE" && aType.indexOf("PROCEDURE") >= 0) {
                procedure = ICD.mapCodiciICD[i].value;
            }


            if (ICD.mapCodiciICD[i].key == "DIAGNOSI" && aType.indexOf("DIAGNOSI") >= 0) {
                diagnosi = ICD.mapCodiciICD[i].value;
            }
        }

        logger.debug("Valorizzazione codici ICD9 SDO - Valorizzare Diagnosi -> " + (aType.indexOf("DIAGNOSI") >= 0) + ", Oggetto Diagnosi -> " + JSON.stringify(diagnosi));

        if (aType.indexOf("DIAGNOSI") >= 0){

            logger.debug("Valorizzazione codici ICD9 SDO - Inizio valorizzazione Diagnosi ");

            // In prima battuta rendo Visibili tutti i TR relativi ai Codici ICD (Diegnosi e Interventi)
            $("input[id^='DiagnosiICD9']").each(function () {
                $(this).closest('tr').show();
                $(this).closest('tr').find("input").val("");
            });

            // processo DIAGNOSI escludendo quelle di ACCETTAZIONE
            for (i = 0; i < diagnosi.length; i++)
            {
                if (diagnosi[i]['evento'].codice == NS_DIMISSIONE_ICD.ICDEvent) {
                    codifica = diagnosi[i];

                    logger.debug("Valorizzazione codici ICD9 SDO - Diagnosi Codifica -> " + JSON.stringify(codifica));

                    $('#DiagnosiICD9' + (codifica['ordine'])).val(codifica.codice + ' - ' + codifica.descrizione).attr('data-c-value', codifica.codice).attr('data-c-codice', codifica.codice).attr('data-c-descr', codifica.descrizione).attr('data-c-descrizione', codifica.descrizione).attr('data-c-comp_sesso', codifica.compatibilitaSesso).attr('data-c-comp_sesso', codifica.compatibilitaSesso);
                    $('#h-DiagnosiICD9' + (codifica['ordine'])).val(codifica.codice);
                    j++;
                } else {
                    continue;
                }
            }

            // La Collection delle DIAGNOSI Contiene anche quelle relative alle diagnosi di ACCETTAZIONE.
            // la Variabile j corrisponde al numero effettivo di codici ICD con evento A03
            i = j;

            // Se DISPONGO di Codici ICD9 nascondo solo quelli successivi a quelli effettivi (indice j)
            // Se NON DISPONGO di Codici ICD9 Nascondo Solo Quelli relativi alle Diagnosi Secondarie
            if (j > 0) {

                for (var count = j + 1; count < 10; count++) {
                    $('#h-DiagnosiICD9' + count).val("");
                    $('#DiagnosiICD9' + count).attr({'data-c-value': "", 'data-c-codice': "", 'data-c-descr': ""}).closest('tr').hide();
                }

            } else {

                $("#fldDiagnosi input[id^='h-DiagnosiICD9']").each(function () {
                    var idxDiagnosi = parseInt($(this).attr('id').substr($(this).attr('id').length - 1, $(this).attr('id').length));
                    if (idxDiagnosi > j) {
                        $('#h-DiagnosiICD9' + idxDiagnosi).val("");
                        $('#DiagnosiICD9' + idxDiagnosi).attr({'data-c-value': "", 'data-c-codice': "", 'data-c-descr': ""}).closest('tr').hide();
                        $(this).closest('tr').hide();
                    }
                });
            }

            NS_DIMISSIONE_ICD.setButtonOrdinamentoManuale("D");
        }

        logger.debug("Valorizzazione codici ICD9 SDO - Valorizzare Procedure -> " + (aType.indexOf("PROCEDURE") >= 0) + ", Oggetto Procedure -> " + JSON.stringify(procedure));

        // Processo PROCEDURE
        if (aType.indexOf("PROCEDURE") >= 0) {

            logger.debug("Valorizzazione codici ICD9 SDO - Inizio valorizzazione Interventi");

            // In prima battuta rendo Visibili tutti i TR relativi ai Codici ICD (Diegnosi e Interventi)
            $("input[id^='InterventiICD9']").each(function () {
                $(this).closest('tr').show();
                $(this).closest('tr').find("input").val("");
            });

            for (i = 0; i < procedure.length; i++) {
                codifica = procedure[i];

                logger.debug("Valorizzazione codici ICD9 SDO - Intervento Codifica -> " + JSON.stringify(codifica));

                $('#InterventiICD9' + codifica['ordine']).val(codifica.codice + ' - ' + codifica.descrizione).attr({'data-c-value': codifica.codice,'data-c-codice': codifica.codice, 'data-c-descr' : codifica.descrizione, 'data-c-descrizione' : codifica.descrizione, 'data-c-comp_eta': codifica.compatibilitaEta,'data-c-comp_sesso': codifica.compatibilitaSesso,'data-c-intervento_ds': codifica.DS,'data-c-intervento_ds_eta_ped': codifica.DSEtaPediatrica,'data-c-intervento_sala_ope': codifica.salaOperatoria});
                $('#h-InterventiICD9' + codifica['ordine']).val(codifica.codice).attr('data-c-value', codifica.codice);

                if (typeof codifica.data == 'string' && codifica.data != "" && codifica.data != null) {
                    $("#h-txtDataInterventiICD9" + codifica['ordine']).val(codifica.data.substring(0, 8));
                    $("#txtDataInterventiICD9" + codifica['ordine']).val(moment(codifica.data, 'YYYYMMDDHH:mm').format('DD/MM/YYYY'));
                }
            }

            // Come per DIAGNOSI
            // Se DISPONGO di Codici ICD9 nascondo solo quelli successivi a quelli effettivi (indice i)
            // Se NON DISPONGO di Codici ICD9 Nascondo Solo Quelli relativi alle Diagnosi Secondarie
            if (i > 0) {
                for (var count = i + 1; count < 10; count++) {
                    $('#h-InterventiICD9' + count).val("");
                    $('#InterventiICD9' + count).attr({"value": "",'data-c-value': "",'data-c-codice': "",'data-c-descr': ""}).closest('tr').hide();
                }
            } else {
                // Nascondo Tutti Gli Interventi Secondari
                $("#fldInterventi input[id^='h-InterventiICD9']").each(function () {
                    var idxInterventi = parseInt($(this).attr('id').substr($(this).attr('id').length - 1, $(this).attr('id').length));
                    if (idxInterventi > i) {
                        $('#h-InterventiICD9' + idxInterventi).val("");
                        $('#InterventiICD9' + idxInterventi).attr({"value": "",'data-c-value': "",'data-c-codice': "",'data-c-descr': ""}).closest('tr').hide();
                        $(this).closest('tr').hide();
                    }
                });
            }

            NS_DIMISSIONE_ICD.setDataInterventoObbligatoria();
            NS_DIMISSIONE_ICD.setButtonOrdinamentoManuale("I");
        }

        $("#fldDiagnosi > table.campi > tbody > tr").each(function(){

            if (!$(this).next().is(":visible"))
            {
                $(this).find("button.btnOrdineDiagnosiICDDOWN").css({"visibility":"hidden"});
                return false;
            }

        });

        $("#fldInterventi > table.campi > tbody > tr").each(function(){
            if (!$(this).next().is(":visible"))
            {
                $(this).find("button.btnOrdineInterventoICDDOWN").css({"visibility":"hidden"});
                return false;
            }
        });

        NS_DIMISSIONE_ICD.setOrdinamentoManuale();
        NS_DIMISSIONE_ICD.setObbligoTraumatismi();
    },

    hideSetICD : function(p){

        if (p.type == "D"){
            $("#fldDiagnosi input[id^='h-DiagnosiICD9']").each(function (idx) {
                var idxDiagnosi = parseInt($(this).attr('id').substr($(this).attr('id').length - 1, $(this).attr('id').length));
                if (idxDiagnosi > 0) {
                    $(this).closest('tr').hide();
                }
            });
        }
        else if (p.type == "P")
        {
            $("#fldInterventi input[id^='h-InterventiICD9']").each(function (idx) {
                var idxInterventi = parseInt($(this).attr('id').substr($(this).attr('id').length - 1, $(this).attr('id').length));
                if (idxInterventi > 0) {
                    $(this).closest('tr').hide();
                }
            });
        }
        else if (p.type == "E")
        {
            $("#fldDiagnosi input[id^='h-DiagnosiICD9']").each(function (idx) {
                var idxDiagnosi = parseInt($(this).attr('id').substr($(this).attr('id').length - 1, $(this).attr('id').length));
                if (idxDiagnosi > 0) {
                    $(this).closest('tr').hide();
                }
            });

            $("#fldInterventi input[id^='h-InterventiICD9']").each(function (idx) {
                var idxInterventi = parseInt($(this).attr('id').substr($(this).attr('id').length - 1, $(this).attr('id').length));
                if (idxInterventi > 0) {
                    $(this).closest('tr').hide();
                }
            });
        }
    },

    completaCampiDiagnosi : function(codDia,indice){

        var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
        var xhr =  db.select(
            {
                id: 'AUTOCOMPLETE.Q_COMPLETA_CAMPI_DIAGNOSI',
                parameter : {"codDia":   {t: 'V', v: codDia}}
            });
        xhr.done(function (data, textStatus, jqXHR) {
            var compEta = data.result[0].COMP_ETA;
            var compSesso = data.result[0].COMP_SESSO;
            $("#DiagnosiICD9" + indice).attr('data-c-comp_eta',compEta);
            $("#DiagnosiICD9" + indice).attr('data-c-comp_sesso',compSesso);
        });

        xhr.fail(function (response) {
            logger.error("ERROR Q_COMPLETA_CAMPI_DIAGNOSI - NS_DIMISSIONE_SDO.completaCampiDiaInt " + JSON.stringify(response));
            home.NOTIFICA.error({ title: "Attenzione", width:220, message: 'Errore nel completamento campi ausiliari Diagnosi' });
        });
    },

    completaCampiInterventi:function(codInt,indice){

        var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
        var xhr =  db.select(
            {
                id: 'AUTOCOMPLETE.Q_COMPLETA_CAMPI_INTERVENTO',
                parameter : {"codInt":   {t: 'V', v: codInt}}
            });
        xhr.done(function (data, textStatus, jqXHR) {
            var compEta = data.result[0].COMP_ETA;
            var compSesso = data.result[0].COMP_SESSO;
            var intDs = data.result[0].INTERVENTO_DS;
            var intDsEtaped = data.result[0].INTERVENTO_DS_ETA_PED;
            var intSalaOpe = data.result[0].INTERVENTO_SALA_OPE;

            $("#InterventiICD9"+indice).attr('data-c-comp_eta',compEta);
            $("#InterventiICD9"+indice).attr('data-c-comp_sesso',compSesso);
            $("#InterventiICD9"+indice).attr('data-c-intervento_ds',intDs);
            $("#InterventiICD9"+indice).attr('data-c-intervento_ds_eta_ped',intDsEtaped);
            $("#InterventiICD9"+indice).attr('data-c-intervento_sala_ope',intSalaOpe);
        });

        xhr.fail(function (response) {
            logger.error("ERROR Q_COMPLETA_CAMPI_INTERVENTO - NS_DIMISSIONE_SDO.completaCampiDiagnosiInterventi " + JSON.stringify(response));
            home.NOTIFICA.error({ title: "Attenzione", width:220, message: 'Errore nel completamento campi ausiliari Interventi' });
        });
    },

    completaCampiDiagnosiInterventi: function(){

        for (var i = 0; i < 7; i++) {
            if ($("#DiagnosiICD9"+i).val()!=''){
                NS_DIMISSIONE_ICD.completaCampiDiagnosi($("#DiagnosiICD9" + i).attr('data-c-codice'), i);
            }
        }

        for (i=0; i<7; i++){
            if ($("#InterventiICD9"+i).val()!=''){
                NS_DIMISSIONE_ICD.completaCampiInterventi($("#InterventiICD9" + i).attr('data-c-codice'), i);
            }
        }
    },

    /**
     * Imposta obbligo per data intervento se quest ultimo e' valorizzato.
     */
    setDataInterventoObbligatoria : function(){

        $(".interventi").each(function(){

            if($(this).closest("tr").is(":visible"))
            {
                var id =  $(this).closest("tr").find('td.tdData input[type="text"]').attr("id").toString();

                if ($(this).find('input[type="text"]').val() !== "")
                {
                    V_ADT_DIMI.elements[id] = {
                        status : "required",
                        name : "Data Intervento",
                        tab :"tabDimissione"
                    };
                }
                else
                {
                    V_ADT_DIMI.elements[id] = {
                        status : "",
                        name : "Data Intervento",
                        tab :"tabDimissione"
                    };
                    $("#" + id).val("");
                    $("#h-" + id).val("");
                }
            }
        });
        NS_FENIX_SCHEDA.addFieldsValidator({config : "V_ADT_DIMI"});
    },

    setCodiciICDfromCCE: function (callback) {

        var db = $.NS_DB.getTool({setup_default: {datasource: 'WHALE'}});

        var xhr = db.select(
        {
            id: 'DATI.Q_CODICI_ICD',
            parameter: {"NOSOLOGICO": {t: 'V', v: _JSON_CONTATTO.codice.codice}}
        });

        xhr.done(function (data, textStatus, jqXHR) {

            var mapCodiciICD = [
                { key : "DIAGNOSI", value:[] },
                { key : "PROCEDURE", value:[] }
            ];

            contatoreDiagnosi = 0;
            contatoreProcedura = 0;

            for (var i = 0; i < data.result.length; i++) {

                elm = data.result[i];

                switch(elm.TIPO){
                    case "DIAGNOSI":
                        mapCodiciICD[0].value.push(getItem(contatoreDiagnosi, elm.CODICE, elm.DESCRIZIONE, elm.DATA, elm.COMP_SESSO, elm.COMP_ETA, elm.DS, elm.DS_PEDIATRICO, elm.SALA_OPERATORIA));
                        contatoreDiagnosi++;
                        break;
                    case "PROCEDURE":
                        mapCodiciICD[1].value.push(getItem(contatoreProcedura,elm.CODICE, elm.DESCRIZIONE, elm.DATA, elm.COMP_SESSO, elm.COMP_ETA, elm.DS, elm.DS_PEDIATRICO, elm.SALA_OPERATORIA));
                        contatoreProcedura++;
                        break;
                }

            }

            callback(mapCodiciICD);

            function getItem(ordine, codice, descrizione, data, compSesso, compEta, DS, DSPediatrico, salaOperatoria) {
                return {
                    "descrizione": descrizione,
                    "evento": {
                        "descrizione": null,
                        "id": null,
                        "codice": "A03"
                    },
                    "ordine": ordine,
                    "id": null,
                    "codice": codice,
                    "data" :  data.length > 0 ? data : null,
                    "DSEtaPediatrica" : DSPediatrico,
                    "DS" : DS,
                    "compatibilitaEta" : compEta,
                    "compatibilitaSesso" : compSesso,
                    "salaOperatoria" : salaOperatoria
                };
            };

        });

        xhr.fail(function (response) {
            logger.error(JSON.stringify(response));
            home.NOTIFICA.warning({title: "Attenzione", message: 'Errore recuperando le diagnosi/procedure dalla cartella clinica', timeout: 6});
        });
    },

    setOrdinamentoManuale : function(){

        $(".btnOrdineDiagnosiICDUP").on("click",function(){
            var row = $(this).closest('tr');
            row.prev().insertAfter(row);
            NS_DIMISSIONE_ICD.setButtonOrdinamentoManuale("D");
        });

        $(".btnOrdineDiagnosiICDDOWN").on("click",function(){
            var row = $(this).closest('tr');
            row.next().insertBefore(row);
            NS_DIMISSIONE_ICD.setButtonOrdinamentoManuale("D");
        });

        $(".btnOrdineInterventoICDUP").on("click",function(){
            var row = $(this).closest('tr');
            row.prev().insertAfter(row);
            NS_DIMISSIONE_ICD.setButtonOrdinamentoManuale("I");
        });

        $(".btnOrdineInterventoICDDOWN").on("click",function(){
            var row = $(this).closest('tr');
            row.next().insertBefore(row);
            NS_DIMISSIONE_ICD.setButtonOrdinamentoManuale("I");
        });
    },

    processDiagnosi : function(data){

        logger.debug("Process Diagnosi AUTOCOMPLETE - Data -> " + JSON.stringify(data));

        var _this = $('#fldDiagnosi').find('input[data-c-value="' + data.VALUE + '"]').last();
        var idx = parseInt(_this.attr('id').substr(_this.attr('id').length - 1, _this.attr('id').length));

        if (_this.length > 1 ) {
            return home.NOTIFICA.error({message: "Diagnosi " + data.VALUE + " ripetuta", timeout: 6, width: 220, title: "Errore SDO"});
        }

        var _diagnosi = {
            "codice" : _this.attr('data-c-value'),
            "descrizione" : _this.val(),
            "compatibilitaEta" : _this.attr("data-c-comp_eta"),
            "compatibilitaSesso" : _this.attr("data-c-comp_sesso"),
            "data" : null,
            "ordine" : idx
        };

        logger.debug("Process Diagnosi AUTOCOMPLETE - Oggetto Diagnosi -> " + JSON.stringify(_diagnosi));

        objResponse = NS_DIMISSIONE_ICD_CHECK.checkICDComplatibilitaSesso(_diagnosi,_JSON_CONTATTO.anagrafica.sesso);

        if (!objResponse.success) {
            home.NOTIFICA.warning({message : objResponse.message, timeout : 6, width : 220, title : "Anomalia NON Bloccante SDO"});
        }

        logger.info("Process Diagnosi AUTOCOMPLETE - Superato Controllo Compatibilita Sesso");

        // Controllo ICD parto solo per la diagnosi principale
        if (idx == 0) {
            objResponse = NS_DIMISSIONE_ICD_CHECK.checkDiagnosiParto(_diagnosi.codice);

            if (!objResponse.success) {
                return home.NOTIFICA.error({message: objResponse.message, timeout: 6, width: 220, title: "Errore SDO"});
            }

            logger.info("Process Diagnosi AUTOCOMPLETE - Superato Controllo Diagnosi Parto per Diagnosi Principale");
        }

        objResponse = NS_DIMISSIONE_ICD_CHECK.checkDiagnosiTrauma(_diagnosi.codice);

        if (!objResponse.success) {
            return home.NOTIFICA.error({message : objResponse.message, timeout : 6, width : 220, title : "Errore SDO"});
        }

        logger.info("Process Diagnosi AUTOCOMPLETE - Superato ULTIMO Controllo Diagnosi Trauma");

        $('#DiagnosiICD9' + parseInt(idx + 1)).closest('tr').show();

        NS_DIMISSIONE_ICD.setButtonOrdinamentoManuale("D");

    },

    processIntervento : function(data){

        logger.debug("Process Intervento AUTOCOMPLETE - Data -> " + JSON.stringify(data));

        var _objResponse = {"success" : true, "message" : ""};
        var _this = $('#fldInterventi').find('input[data-c-value="' + data.VALUE + '"]').last();
        var idx = parseInt(_this.attr('id').substr(_this.attr('id').length - 1, _this.attr('id').length));

        var _intervento = {
            "codice" : _this.attr("data-c-value"),
            "descrizione" : _this.val(),
            "compatibilitaEta" : _this.attr("data-c-comp_eta"),
            "compatibilitaSesso" : _this.attr("data-c-comp_sesso"),
            "DSEtaPediatrica" : _this.attr("data-c-intervento_ds_eta_ped"),
            "DS" : _this.attr("data-c-intervento_ds"),
            "salaOperatoria" : _this.attr("data-c-intervento_sala_ope"),
            "data" : $(this).find("input[id^='h-txtDataInterventiICD9']").val(),
            "ordine" : idx
        };

        logger.debug("Process Intervento AUTOCOMPLETE - Oggetto Diagnosi -> " + JSON.stringify(_intervento));

        objResponse = NS_DIMISSIONE_ICD_CHECK.checkICDComplatibilitaSesso(_intervento,_JSON_CONTATTO.anagrafica.sesso);

        if (!objResponse.success) {
            home.NOTIFICA.warning({message : objResponse.message, timeout : 6, width : 220, title : "Anomalia NON Bloccante SDO"});
        }

        logger.info("Process Intervento AUTOCOMPLETE - Superato Controllo Compatibilita Sesso");

        if (_JSON_CONTATTO.tipo.codice == 'S' || _JSON_CONTATTO.tipo.codice == 'O') {

            objResponse = NS_DIMISSIONE_ICD_CHECK.checkICDInterventoDS(_intervento);

            if (!objResponse.success) {
                home.NOTIFICA.warning({message : objResponse.message, timeout : 6, width : 220, title : "Anomalia NON Bloccante SDO"});
            }

            logger.info("Process Intervento AUTOCOMPLETE - Superato Controllo Intervento DS Solo per contatti con tipo O oppure S");
        }

        $('#InterventiICD9' + parseInt(idx + 1)).closest('tr').show();

        NS_DIMISSIONE_ICD.setDataInterventoObbligatoria();
        NS_DIMISSIONE_ICD.setButtonOrdinamentoManuale("I");
    },

    setButtonOrdinamentoManuale : function(tipo)
    {
        if (tipo === "D")
        {
            // Mostro tutti i button
            $(".btnOrdineDiagnosiICDDOWN, .btnOrdineDiagnosiICDUP").css({"visibility":"visible"});
            // Cambio label a tutte le autocomplete
            $("#fldDiagnosi > table.campi > tbody > tr td.tdACList > span").html("Diagnosi");
            // Nascondo ultimo button DOWN
            $("#fldDiagnosi > table.campi > tbody > tr").each(function(){
                if (!$(this).next().is(":visible")) {
                    $(this).find("button.btnOrdineDiagnosiICDDOWN").css({"visibility":"hidden"}); return false;
                }
            });
            // Nascondo primo button UP
            $("#fldDiagnosi > table.campi > tbody > tr").first().find("button.btnOrdineDiagnosiICDUP").css({"visibility":"hidden"});
            // Imposto la label Diagnosi Principale
            $("#fldDiagnosi > table.campi > tbody > tr").first().find("td.tdACList > span").html("Diagnosi Principale");
        }
        else if (tipo === "I")
        {
            // Mostro tutti i button
            $(".btnOrdineInterventoICDDOWN, .btnOrdineInterventoICDUP").css({"visibility":"visible"});
            // Cambio label a tutte le autocomplete
            $("#fldInterventi > table.campi > tbody > tr td.tdACList > span").html("Intervento");
            // Nascondo ultimo button DOWN
            $("#fldInterventi > table.campi > tbody > tr").each(function(){
                if (!$(this).next().is(":visible")) {
                    $(this).find("button.btnOrdineInterventoICDDOWN").css({"visibility":"hidden"}); return false;
                }
            });
            // Nascondo primo button UP
            $("#fldInterventi > table.campi > tbody > tr").first().find("button.btnOrdineInterventoICDUP").css({"visibility":"hidden"});
            // Imposto la label Intervento Principale
            $("#fldInterventi > table.campi > tbody > tr").first().find("td.tdACList > span").html("Intervento Principale");
        }

    },

    setObbligoTraumatismi : function(){

        var _codice_diagnosi = null;
        var _codice_gruppo = null;

        // Resetto variabile che indica se ci sono diagnosi di traumatismo
        NS_DIMISSIONE_SDO.hasDiagnosiTraumatica = false;

        for (var i = 0; i <= 7; i++)
        {
            $('#DiagnosiICD9' + i).each(function(){

                _codice_diagnosi = $(this).attr("data-c-value");

                if (typeof _codice_diagnosi != 'undefined')
                {
                    _codice_gruppo = _codice_diagnosi.substring(0, _codice_diagnosi.indexOf('.'));
                    if ((_codice_gruppo >= 910 && _codice_gruppo <= 994) || (_codice_gruppo >= 800 && _codice_gruppo <= 904)) {
                        NS_DIMISSIONE_SDO.hasDiagnosiTraumatica = true;
                    }
                }
            });

        }

        if (NS_DIMISSIONE_SDO.hasDiagnosiTraumatica)
        {
            V_ADT_DIMI.elements["cmbTraumatismiDimissione"].status = "required";
            V_ADT_DIMI.elements["txtCategoriaCausaEsternaDimissione"].status = "required";
            V_ADT_DIMI.elements["cmbCausaEsternaDimissione"].status = "required";
        }
        else if (NS_DIMISSIONE_SDO.hasTraumatismi())
        {
            V_ADT_DIMI.elements["cmbTraumatismiDimissione"].status = "required";
            V_ADT_DIMI.elements["txtCategoriaCausaEsternaDimissione"].status = "required";
            V_ADT_DIMI.elements["cmbCausaEsternaDimissione"].status = "required";
        }
        else
        {
            V_ADT_DIMI.elements["cmbTraumatismiDimissione"].status = "";
            V_ADT_DIMI.elements["txtCategoriaCausaEsternaDimissione"].status = "";
            V_ADT_DIMI.elements["cmbCausaEsternaDimissione"].status = "";
        }

        NS_FENIX_SCHEDA.addFieldsValidator({config : "V_ADT_DIMI"});
    }
};

var  NS_DIMISSIONE_ICD_CHECK = {

    checkICDComplatibilitaSesso : function(codifica,sesso){

        var objResponse = {"success" : true, "message" : ""};

        logger.debug("Verifica Appropriatezza Singola - Compatibilita Sesso - Codifica -> " + JSON.stringify(codifica));

        if (codifica.compatibilitaSesso != null && codifica.compatibilitaSesso != "" && codifica.compatibilitaSesso != sesso) {
            objResponse.success = false;
            objResponse.message = "Errore di incompatibilit&agrave; sesso per il codice " + codifica.codice;
        }

        return objResponse;
    },

    checkICDInterventoDS : function(codifica){

        var objResponse = {"success" : true, "message" : ""};

        logger.debug("Verifica Appropriatezza Singola - Intervento DS - Codifica -> " + JSON.stringify(codifica));

        var isInterventoDS = codifica.DS == "S" ? true : false;
        var isInterventoDSPediatrico = codifica.DSEtaPediatrica == "S" ? true : false;
        var isPazientePediatrico = moment($("#txtDataDimi").val(),"YYYYMMDDHH:mm").diff(moment(_JSON_CONTATTO.anagrafica.dataNascita, "YYYYMMDD"), 'years') <= 18 ? true : false;

        logger.debug("Verifica Appropriatezza Singola - Intervento DS - Is Intervento DS -> " + isInterventoDS + ", Intervento Pediatrico -> " + isInterventoDSPediatrico + ", Paziente Pediatrico -> " + isPazientePediatrico);

        if (isInterventoDS && isInterventoDSPediatrico && !isPazientePediatrico) {
            hasErrorInterventoDS = true;
            objResponse.success = false;
        }

        return objResponse;
    },

    checkDiagnosiParto : function(codice){

        var objResponse = {"success" : true, "message" : ""};
        var specialita = NS_CHECK_A03.getSpecialitaCDCDimissione();
        var codice_gruppo = codice.substring(0, codice.indexOf('.'));
        var aSpecialitaParto = eval(home.baseGlobal["sdo.specialita.parto"]);
        var aDiagnosiParto = eval(home.baseGlobal["sdo.diagnosi.parto"]);

        if (typeof codice!=="undefined")
        {
            if (codice_gruppo in aDiagnosiParto && !(aSpecialitaParto.indexOf(specialita))) {
                objResponse.success = false;
                objResponse.message = "Diagnosi principale " + codice + "ammessa solo per specialita 37 o 67 ";
            }
        }

        return objResponse;
    },

    checkDiagnosiTrauma : function(codice){

        var objResponse = {"success" : true, "message" : ""};

        if (!NS_DIMISSIONE_SDO.hasTraumatismi())
        {
            if (typeof codice_diagnosi !== "undefined")
            {
                var codice_gruppo = codice.substring(0,codice.indexOf('.'));

                if ((codice_gruppo >= 910 && codice_gruppo <= 994) || (codice_gruppo >= 800 && codice_gruppo <= 904)){
                    objResponse.success = false;
                    objResponse.message = "Attenzione! diagnosi di Trauma senza segnalazione traumatismo";
                }
            }
        }

        NS_DIMISSIONE_ICD.setObbligoTraumatismi();

        return objResponse;
    }

};