var NS_CHECK_A03 = {

    contatto : null,
    success : false,
    message : [],
    specialita : null,
    dimissione : true,
    tipoPersonale : null,

    resetCheck : function(){
        NS_CHECK_A03.contatto = null;
        NS_CHECK_A03.success = false;
        NS_CHECK_A03.message = [];
    },

    /**
     * Riduco l'utilizzo delle variabili globali tramite l'invocazione di funzioni dedicate.
     * Se la specialita e' gia' stata determinata evito la query.
     *
     * @returns "codice specialita"
     */
    setSpecialitaCDCDimissione : function(p){

        logger.debug("Verifica Dati Contatto - Set Specialita Dimissione - Id Centro di Costo -> " + p.CDC !== null || p.CDC !== "" ? p.CDC : NS_CHECK_A03.contatto.contattiGiuridici[NS_CHECK_A03.contatto.contattiGiuridici.length - 1].provenienza.idCentroDiCosto);

        var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
        var xhr =  db.select(
        {
            id: 'ADT.Q_SPECIALITA_REPARTO',
            parameter : {'idenCdc' : {t: 'N', v: p.CDC !== null || p.CDC !== "" ? p.CDC : NS_CHECK_A03.contatto.contattiGiuridici[NS_CHECK_A03.contatto.contattiGiuridici.length - 1].provenienza.idCentroDiCosto}}
        });

        xhr.done(function (data) {
            logger.info("Verifica Dati Contatto - Set Specialita Dimissione - Result -> " + data.result[0].SPECIALITA);
            NS_CHECK_A03.specialita = data.result[0].SPECIALITA;

            if (typeof p.callback == "function") {
                p.callback();
            }
        });

        xhr.fail(function(response){
            logger.error("Verifica Dati Contatto - Set Specialita Dimissione - Error xhr -> " + response);
        })
    },

    getSpecialitaCDCDimissione :function(){

        logger.debug("Verifica Dati Contatto - Get Specialita Dimissione - NS_CHECK_A03.specialita -> " + NS_CHECK_A03.specialita);

        if (NS_CHECK_A03.specialita != null) {
            return NS_CHECK_A03.specialita;
        } else {
            logger.warn("Verifica Dati Contatto - Get Specialita Dimissione - Devo recuperare la specialita tramite SELECT");
            return NS_CHECK_A03.setSpecialitaCDCDimissione({callback : function(){ return NS_CHECK_A03.specialita}});
        }

    },

    hasTraumatismiDimissione : function(){

        var metadati = NS_CHECK_A03.contatto.mapMetadatiCodifiche;
        if (!metadati.hasOwnProperty('TRAUMATISMI_DIMISSIONE')){
            return false;
        }

        if ((metadati["TRAUMATISMI_DIMISSIONE"].id != null && metadati["TRAUMATISMI_DIMISSIONE"].id != "") ||
            (metadati["TRAUMATISMI_DIMISSIONE"].codice != null && metadati["TRAUMATISMI_DIMISSIONE"].codice != "")){
            return true;
        } else {
            return false;
        }
    },

    checkExistsDiagnosiPrincipale : function(){

        var objResponse = {"success" : true, "message" : []};
        var ICD = NS_CHECK_A03.contatto.codiciICD;

        var hasDiagnosiPrincipale = false;

        for (var i = 0; i < ICD.mapCodiciICD.length; i++)
        {
            if (ICD.mapCodiciICD[i].key == "DIAGNOSI")
            {
                for (var j = 0; j < ICD.mapCodiciICD[i].value.length; j++)
                {
                    logger.debug("Verifica Dati Contatto - Controllo Esistenza Diagnosi Principale - Identifico Diagnosi Principale " + JSON.stringify(ICD.mapCodiciICD[i].value[j]));

                    if (ICD.mapCodiciICD[i].value[j].ordine == 0) {
                        hasDiagnosiPrincipale = true;
                    }
                }
            }
        }

        if (!hasDiagnosiPrincipale) {
            objResponse.success = false;
            objResponse.message = "Attenzione! Manca la diagnosi principale";
        }

        return objResponse;
    },

    /**
     * Controllo standard per appropriatezza data di dimissione.
     * @returns {{success: boolean, message: Array}}
     */
    checkDataDimissione : function(){

        var objResponse = {"success" : true, "message" : []};
        var dtDimissione = moment(NS_CHECK_A03.contatto.dataFine,"YYYYMMDDHH:mm");
        var dtRicovero = moment(NS_CHECK_A03.contatto.dataInizio,"YYYYMMDDHH:mm");

        logger.debug("Verifica Dati Contatto - Controllo Data Dimissione - Data Dimissione -> " + dtDimissione.format("YYYYMMDDHH:mm") + ", Data Inizio -> " + dtRicovero.format("YYYYMMDDHH:mm"));

        if (dtRicovero.isAfter(dtDimissione)) {
            objResponse.success = false;
            objResponse.message.push("Attenzione! Data di dimissione precedente alla data di ricovero");
        } else if (dtRicovero.isSame(dtDimissione)) {
            objResponse.success = false;
            objResponse.message.push("Attenzione! Data di dimissione uguale alla data di ricovero");
        }

        if (NS_CHECK_A03.contatto.contattiAssistenziali.length > 1) {
            for (var i = 1; i < NS_CHECK_A03.contatto.contattiAssistenziali.length; i++) {
                if (dtDimissione.isBefore(moment(NS_CHECK_A03.contatto.contattiAssistenziali[i].dataInizio, "YYYYMMDDHH:mm"))) {
                    objResponse.success = false;
                    objResponse.message.push("Attenzione! Data di dimissione " + dtDimissione.format("DD/MM/YYYY HH:mm") + " precedente alla data di trasferimento " + moment(NS_CHECK_A03.contatto.contattiAssistenziali[i].dataInizio, "YYYYMMDDHH:mm").format("DD/MM/YYYY HH:mm"));
                } else if (dtDimissione.isSame(moment(NS_CHECK_A03.contatto.contattiAssistenziali[i].dataInizio, "YYYYMMDDHH:mm"))){
                    objResponse.success = false;
                    objResponse.message.push("Attenzione! Data di dimissione " + dtDimissione.format("DD/MM/YYYY HH:mm") + " uguale alla data di trasferimento " + moment(NS_CHECK_A03.contatto.contattiAssistenziali[i].dataInizio, "YYYYMMDDHH:mm").format("DD/MM/YYYY HH:mm"));
                }
            }
        }

        return objResponse
    },

    /**
     * Controllo standard coerenza tra specialita reparto e sesso paziente.
     * @returns {{success: boolean, message: string}}
     */
    checkDimissioneSpecialitaSesso : function(){

        var objResponse = {"success" : true, "message" : ""};
        var sessoAnagrafica = NS_CHECK_A03.contatto.anagrafica.sesso;
        var codiceSpecialitaFemminile = home.baseGlobal["sdo.specialita.sesso.femmina"];
        var specialita = NS_CHECK_A03.getSpecialitaCDCDimissione();

        logger.debug("Verifica Dati Contatto - Controllo Coerenza Specialita Sesso - Sesso Anagrafica -> " + sessoAnagrafica + ", Codice Specialita Femmina -> " + codiceSpecialitaFemminile);

        if (specialita === codiceSpecialitaFemminile && sessoAnagrafica === "M") {
            objResponse.success = false;
            objResponse.message = "Attenzione! Il sesso del paziente non &egrave; compatibile con la specilit&agrave; del reparto";
        }

        return objResponse;
    },

    /**
     * Controllo standard coerenza tra specialita reparto ed eta.
     * Viene controllata la coerenza tra eta del paziente e specialita del reparto.
     * @returns {{success: boolean, message: string}}
     */
    checkDimissioneSpecialitaEta : function(){

        var objResponse = {"success" : true, "message" : ""};
        var aSpecialitaPed = eval(home.baseGlobal["sdo.specialita.pediatria"]);
        var isPediatrico = moment(NS_CHECK_A03.contatto.dataFine,"YYYYMMDDHH:mm").diff(moment(NS_CHECK_A03.contatto.anagrafica.dataNascita,"YYYYMMDD"),'years') <= 18 ? true : false;
        var eta = moment(NS_CHECK_A03.contatto.dataFine,"YYYYMMDDHH:mm").diff(moment(NS_CHECK_A03.contatto.anagrafica.dataNascita,"YYYYMMDDHH:mm"),'years');
        var specialita = NS_CHECK_A03.getSpecialitaCDCDimissione();

        logger.debug("Verifica Dati Contatto - Controllo Coerenza Specialita Eta - Collection Specialita Pediatriche -> " + aSpecialitaPed + ", Paziente Pediatrico -> " + isPediatrico + ", Specialita -> " + specialita);

        if (aSpecialitaPed.indexOf(specialita) >= 0 && !isPediatrico) {
            objResponse.success = false;
            objResponse.message = "Et&agrave; paziente " + eta + " non congruente con disciplina reparto " + specialita;
        }

        return objResponse;
    },

    /**
     * In fase di registrazione veirifica la corretta valorizzazione dei codici ICD del contatto
     * @returns {{success: boolean, message: string}}
     */
    checkICDStruttura : function(){

        var objResponse = {"success" : true, "message" : ""};
        var ICD = NS_CHECK_A03.contatto.codiciICD;

        logger.debug("Verifica Dati Contatto - Controllo Coerenza Valorizzazione Struttura Codici ICD - Codici ICD -> " + JSON.stringify(ICD));

        for (var i = 0; i < ICD.length; i++)
        {
            for (var j = 0; j < ICD.mapCodiciICD[i]; j++)
            {
                var codifica = ICD.mapCodiciICD[i].value[j];
                if (codifica.codice == null || codifica.codice == ""){
                    objResponse.success = false;
                    objResponse.message = "Attenzione! La codifica ICD9 " + codifica.descrizione + " non risulta essere popolata correttamente";
                }
            }
        }

        return objResponse;
    },

    /**
     * Controllo sulla ripetizione delle diagnosi.
     * @returns {{success: boolean, message: string}}
     */
    checkICDRipetute : function(){

        var objResponse = {"success" : true, "message" : []};
        var ICD = NS_CHECK_A03.contatto.codiciICD;
        var aICDRipetute = [];

        logger.debug("Verifica Dati Contatto - Controllo Ripetizione Codici ICD - Codici ICD -> " + JSON.stringify(ICD));

        for (var x = 0; x < ICD.mapCodiciICD.length; x++) {

            if (ICD.mapCodiciICD[x].key == "DIAGNOSI"){

                for (var y = 0; y < ICD.mapCodiciICD[x].value.length; y++) {

                    if (ICD.mapCodiciICD[x].value[y].evento.codice == "A03") {

                        var codifica = ICD.mapCodiciICD[x].value[y];

                        if (ICD.mapCodiciICD[x].value[y].evento.codice == "A03")
                        {
                            if (aICDRipetute.indexOf(codifica.codice) >= 0) {
                                aICDRipetute.push(codifica.codice);
                                objResponse.success = false;
                                objResponse.message.push("Attenzione! La codifica ICD9 " + codifica.descrizione + " risulta essere duplicata");
                            }

                            aICDRipetute.push(codifica.codice);
                        }
                    }
                }
            }
        }
        return objResponse;
    },

    /**
     * Controllo coerenza codici ICD parto.
     * Questo controllo va effettuato solo sulla diagnosi principale.
     *
     * @returns {{success: boolean, message: string}}
     */
    checkICDParto : function(){

        var objResponse = {"success" : true, "message" : ""};
        var ICD = NS_CHECK_A03.contatto.codiciICD;
        var aSpecialitaParto = eval(home.baseGlobal["sdo.specialita.parto"]);
        var aDiagnosiParto = eval(home.baseGlobal["sdo.diagnosi.parto"]);
        var specialita = NS_CHECK_A03.getSpecialitaCDCDimissione();

        logger.debug("Verifica Dati Contatto - Controllo Coerenza Diagnosi ICD Parto - Codici ICD -> " + JSON.stringify(ICD));

        for (var i = 0; i < ICD.mapCodiciICD.length; i++)
        {
            if (ICD.mapCodiciICD[i].key == "DIAGNOSI"){

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Diagnosi ICD Parto - Diagnosi di Parto -> " + aDiagnosiParto + ", Specialita Reparto -> " + specialita + ", Specialita ammesse -> " + aSpecialitaParto);

                for (var j = 0; j < ICD.mapCodiciICD[i].value.length; j++)
                {
                    if (ICD.mapCodiciICD[i].value[j].ordine == 0) {
                        var gruppoDiagnosi = ICD.mapCodiciICD[i].value[j].codice.substring(0, ICD.mapCodiciICD[i].value[j].codice.indexOf('.'));

                        logger.debug("Verifica Dati Contatto - Controllo Coerenza Diagnosi ICD Parto - Gruppo Diagnosi -> " + gruppoDiagnosi);

                        if (gruppoDiagnosi >= aDiagnosiParto[0] && gruppoDiagnosi <= aDiagnosiParto[1] && !(aSpecialitaParto.indexOf(specialita) >= 0)) {
                            objResponse.success = false;
                            objResponse.message = "Diagnosi principale " + ICD.mapCodiciICD[i].value[j].codice + " ammessa solo per specialita 37 o 67 ";
                        }
                    }
                }
            }
        }

        return objResponse;
    },

    /**
     * Controllo la presenza di diagnosi di tra
     * @returns {{success: boolean, message: string}}
     */
    checkICDDiagnosiTrauma : function(){

        var objResponse = {"success" : true, "message" : ""};
        var ICD = NS_CHECK_A03.contatto.codiciICD;
        var hasTraumatismi = NS_CHECK_A03.hasTraumatismiDimissione();
        var hasDiagnosi = false;
        var hasDiagnosiTrauma = false;

        logger.debug("Verifica Dati Contatto - Controllo Coerenza ICD e Traumatismi - Codici ICD -> " + JSON.stringify(ICD));

        for (var i = 0; i < ICD.mapCodiciICD.length; i++)
        {
            if (ICD.mapCodiciICD[i].key == "DIAGNOSI")
            {
                for (var j = 0; j < ICD.mapCodiciICD[i].value.length; j++)
                {
                    if (ICD.mapCodiciICD[i].value[j].evento.codice == "A03")
                    {
                        var gruppoDiagnosi = ICD.mapCodiciICD[i].value[j].codice.substring(0, ICD.mapCodiciICD[i].value[j].codice.indexOf('.'));
                        hasDiagnosi = true;

                        logger.debug("Verifica Dati Contatto - Controllo Coerenza ICD e Traumatismi - Has Traumatismi -> " + hasTraumatismi + ", Diagnosi -> " + ICD.mapCodiciICD[i].value[j].codice + ", gruppo diagnosi -> " + gruppoDiagnosi);

                        if ((gruppoDiagnosi >= 910 && gruppoDiagnosi <= 994) || (gruppoDiagnosi >= 800 && gruppoDiagnosi <= 904)) {
                            hasDiagnosiTrauma = true;
                        }
                    }
                }
            }
        }

        logger.debug("Verifica Dati Contatto - Controllo Coerenza ICD e Traumatismi - Riepilogo - Tipo Personale -> " + NS_CHECK_A03.tipoPersonale + ", Has Diagnosi -> " + hasDiagnosi + ", Has Traumatismi -> " + hasTraumatismi + ", Has Diagnosi Trauma -> " + hasDiagnosiTrauma);

        if (NS_CHECK_A03.tipoPersonale == "M" && hasDiagnosi)
        {
            if (hasTraumatismi && !hasDiagnosiTrauma){
                objResponse.success = false; objResponse.message = "Attenzione! nessuna diagnosi di trauma in presenza di traumatismo";
            } else if (!hasTraumatismi && hasDiagnosiTrauma){
                objResponse.success = false; objResponse.message = "Attenzione! presenza diagnosi di trauma senza traumatismo";
            }
        }

        return objResponse;
    },

    /**
     * Controllo coerenza codici ICD ed eta.
     * La regola applicata viene sintetizzata dallo schema di seguito.
     *
     * B = Eta < 1
     * C = Eta 0-17'
     * E = Eta 0-34
     * D = Eta > 17
     * F = Eta > 35
     * H = Eta > 12
     * M = 12 < Eta < 55
     * ' ' = 0 < Eta < 124
     *
     * @returns {{success: boolean, message: string}}
     */
    checkICDComplatibilitaEta : function(){

        var objResponse = {"success" : true, "message" : ""};
        var ICD = NS_CHECK_A03.contatto.codiciICD;
        var eta = moment(NS_CHECK_A03.contatto.dataFine,"YYYYMMDDHH:mm").diff(moment(NS_CHECK_A03.contatto.anagrafica.dataNascita,"YYYYMMDDHH:mm"),'years');

        logger.debug("Verifica Dati Contatto - Controllo Coerenza Codici ICD Eta - Codici ICD -> " + JSON.stringify(ICD));

        for (var i = 0; i < ICD.mapCodiciICD.length; i++)
        {
            for (var j = 0; j < ICD.mapCodiciICD[i].value.length; j++)
            {
                var codifica = ICD.mapCodiciICD[i].value[j];

                if (codifica.compatibilitaEta != "" && codifica.compatibilitaEta != null)
                {
                    logger.debug("Verifica Dati Contatto - Controllo Coerenza Codici ICD Eta - Eta Paziente -> " + eta + ", Data Nascita -> " + NS_CHECK_A03.contatto.anagrafica.dataNascita + ", Compatibilita Eta Codifica -> " + codifica.compatibilitaEta);

                    if (!objResponse.success){
                        break;
                    }

                    switch (codifica.compatibilitaEta) {
                        case 'B': objResponse.success = (eta < 1); break;
                        case 'C': objResponse.success = (eta >= 0 && eta <= 17); break;
                        case 'E': objResponse.success = (eta >= 0 && eta <= 34); break;
                        case 'D': objResponse.success = (eta > 17); break;
                        case 'F': objResponse.success = (eta > 35); break;
                        case 'H': objResponse.success = (eta > 12); break;
                        case 'M': objResponse.success = (eta > 12 && eta < 55); break;
                    }

                    if (!objResponse.success){objResponse.message = "Errore di compatibilit&agrave; per et&agrave; per il codice " + codifica.codice;
                    }
                }
            }
        }

        return objResponse;
    },

    /**
     * Controllo coerenza codici ICD e sesso.
     * @returns {{success: boolean, message: string}}
     */
    checkICDComplatibilitaSesso : function(){

        var objResponse = {"success" : true, "message" : ""};
        var ICD = NS_CHECK_A03.contatto.codiciICD;
        var sessoAnagrafica = NS_CHECK_A03.contatto.anagrafica.sesso;

        logger.debug("Verifica Dati Contatto - Controllo Coerenza Codici ICD Sesso - Codici ICD -> " + JSON.stringify(ICD));

        for (var i = 0; i < ICD.mapCodiciICD.length; i++)
        {
            for (var j = 0; j < ICD.mapCodiciICD[i].value.length; j++) {

                var codifica = ICD.mapCodiciICD[i].value[j];

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Codici ICD Sesso - Compatibilita Sesso -> " + codifica.compatibilitaSesso + ", Sesso Anagrafica -> " + sessoAnagrafica);

                if (codifica.compatibilitaSesso != null && codifica.compatibilitaSesso != "" && codifica.compatibilitaSesso != sessoAnagrafica) {
                    objResponse.success = false;
                    objResponse.message = "Errore di incompatibilit&agrave; sesso per il codice " + ICD.mapCodiciICD[i].value[j].codice;
                    break;
                }
            }
        }

        return objResponse;
    },

    /**
     * Controllo, se regime DS o ODS, se l'intervento inserito è appropriato.
     * Importante! in input viene passata la collection degli input da ciclare.
     * Lo stato di success = FALSE viene restituito solo se viene inserito un inteervento DS pediatrico
     * per un paziente adulto.
     *
     * @returns {{success: boolean, message: string}}
     */
    checkICDInterventiDS : function(){

        var objResponse = {"success" : true, "message" : []};
        var ICD = NS_CHECK_A03.contatto.codiciICD;

        var hasInterventoDS = false;
        var hasErrorInterventoDS = false;
        var diagnosiPrincipale = {};

        if (NS_CHECK_A03.contatto.tipo.codice != "O" && NS_CHECK_A03.contatto.tipo.codice != "S"){
            return objResponse;
        }

        logger.debug("Verifica Dati Contatto - Controllo Appropriatezza Intervento DS - Codici ICD -> " + JSON.stringify(ICD));


        for (var i = 0; i < ICD.mapCodiciICD.length; i++)
        {
            if (ICD.mapCodiciICD[i].key == "PROCEDURE")
            {
                for (j = 0; j < ICD.mapCodiciICD[i].value.length; j++)
                {
                    var isInterventoDS = ICD.mapCodiciICD[i].value[j].DS == "S" ? true : false;
                    var isInterventoDSPediatrico = ICD.mapCodiciICD[i].value[j].DSEtaPediatrica == "S" ? true : false;
                    var isPazientePediatrico = moment(NS_CHECK_A03.contatto.dataFine,"YYYYMMDD").diff(moment(NS_CHECK_A03.contatto.anagrafica.dataNascita, "YYYYMMDD"), 'years') <= 18 ? true : false;

                    logger.debug("Verifica Dati Contatto - Controllo Appropriatezza Intervento DS - Coerenza Interventi DS Pediatrici - Errore Intervento DS " + hasErrorInterventoDS + "Paziente Pediatrico -> " + isPazientePediatrico + " Intervento DS -> " + isInterventoDS + ", Intervento DS Pediatrico -> " + isInterventoDSPediatrico);

                    hasInterventoDS = isInterventoDS ? true : hasInterventoDS;

                    if (isInterventoDS && isInterventoDSPediatrico && !isPazientePediatrico) {
                        hasErrorInterventoDS = true;
                        objResponse.success = false;
                        objResponse.message.push("Intervento di Day Surgery "+ ICD.mapCodiciICD[i].value[j].codice + " previsto in età pediatrica (<18 anni)");
                        break;
                    }
                }
            }
            else if (ICD.mapCodiciICD[i].key == "DIAGNOSI")
            {
                for (var j = 0; j < ICD.mapCodiciICD[i].value.length; j++)
                {
                    logger.debug("Verifica Dati Contatto - Controllo Appropriatezza Intervento DS - Coerenza Interventi DS Pediatrici - Identifico Diagnosi Principale " + JSON.stringify(ICD.mapCodiciICD[i].value[j]));

                    if (ICD.mapCodiciICD[i].value[j].ordine == 0) {
                        diagnosiPrincipale = ICD.mapCodiciICD[i].value[j];
                    }
                }
            }
        }

        var arDiagnosiNONEffettuate = eval(home.baseGlobal["sdo.diagnosi.intervento_non_effettuato"]);
        var isDiagnosiNONEffettuata = arDiagnosiNONEffettuate.indexOf(diagnosiPrincipale.codice) >= 0 ? true : false;

        for (var x = 0; x < arDiagnosiNONEffettuate.length; x++){
            isDiagnosiNONEffettuata = diagnosiPrincipale.codice == arDiagnosiNONEffettuate[x] ? true : isDiagnosiNONEffettuata;
        }

        logger.debug("Verifica Dati Contatto - Controllo Appropriatezza Intervento DS - Se NON presenti interventi di PS verifico che ci sia la diagnosi appropriata - Has Intervento DS -> " + hasInterventoDS + ", Diagnosi NON Effettuata -> " + isDiagnosiNONEffettuata);

        if (!hasInterventoDS && !isDiagnosiNONEffettuata) {
            objResponse.success = false;
            objResponse.message.push("Nessun intervento di Day Surgery presente. Per rendere la SDO completa occorre inserire un intervento di Day Surgery");
        }

        return objResponse;
    },

    /**
     * Controllo validita compilazione date interventi.
     * Importante! Gli interventi standard possono essere inseriti
     * con una data successiva fino a 30gg. Gli interventi di sala operatoria NO.
     * Importante! I ricoveri con pre-ospedalizzazione possono avere interventi
     * con data antecedente alla data di inizio ricovero.
     *
     * @returns {{success: boolean, message: string}}
     */
    checkICDDateInterventi : function(){

        var objResponse = {"success" : true, "message" : ""};
        var ICD = NS_CHECK_A03.contatto.codiciICD;
        var dataDimissione =  moment(NS_CHECK_A03.contatto.dataFine,'YYYYMMDD').add(30, 'days');
        var dataInzioRicovero = moment(NS_CHECK_A03.contatto.dataInizio.substr(0,8),'YYYYMMDD');

        for (var i = 0; i < ICD.mapCodiciICD.length; i++)
        {
            if (ICD.mapCodiciICD[i].key == "PROCEDURE")
            {
                logger.debug("Verifica Dati Contatto - Controllo Coerenza Date Interventi - Codici ICD -> " + JSON.stringify(ICD.mapCodiciICD[i]));

                for (var j = 0; j < ICD.mapCodiciICD[i].value.length; j++)
                {
                    var dataIntervento = moment(ICD.mapCodiciICD[i].value[j].data,'YYYYMMDD');

                    logger.debug("Verifica Dati Contatto - Controllo Coerenza Date Interventi - Data Intervento -> " + dataIntervento.format("YYYYMMDD") + ", Data Dimissione Adeguata -> " + dataDimissione.format("YYYYMMDD") + ", Data Inizio Ricovero -> " + dataInzioRicovero.format("YYYYMMDD") + ", Intervento di sala Operatoria -> " + ICD.mapCodiciICD[i].value[j].salaOperatoria);

                    if (NS_CHECK_A03.contatto.tipo.codice != "4" && dataIntervento < dataInzioRicovero)  // escludo il caso del ricovero con pre-ospedalizzazione
                    {
                        objResponse.success = false;
                        objResponse.message = "La data " + moment(ICD.mapCodiciICD[i].value[j].data,"YYYYMMDD").format("DD/MM/YYYY") + " dell\'intervento " + ICD.mapCodiciICD[i].value[j].codice + " e\' precedente alla data di inizio del ricovero";
                        break;
                    }

                    if (dataIntervento > dataDimissione){
                        objResponse.success = false;
                        objResponse.message = 'La data dell\'intervento ' + ICD.mapCodiciICD[i].value[j].codice + ' e\' maggiore della data di dimissione di oltre 30 giorni';
                        break;
                    }

                    var isFromSalaOperatoria = ICD.mapCodiciICD[i].value[j].salaOperatoria === "S" ? true: false;

                    if (isFromSalaOperatoria && dataIntervento >  moment(NS_CHECK_A03.contatto.dataFine,'YYYYMMDD')) {
                        objResponse.success = false;
                        objResponse.message = "Intervento di sala operatoria " + ICD.mapCodiciICD[i].value[j].codice + " non eseguibile oltre la data di dimissione";
                        break;
                    }
                }
            }
        }

        return objResponse;
    },

    /**
     * Controllo che il numero di accessi sia appropriato in base alla durata del ricovero.
     * Non devono essere presenti piu' accessi per lo stesso giorno.     *
     * @returns {{success: boolean, message: string}}
     */
    checkDHGiornate : function(){

        var objResponse = {"success" : true, "message" : ""};



        if (NS_CHECK_A03.contatto.tipo.codice == "S" || NS_CHECK_A03.contatto.tipo.codice == "O"){
            return objResponse;
        }

        var numeroAccessi = 0;
        var dataInizio= moment(NS_CHECK_A03.contatto.dataInizio,"YYYYMMDD");
        var dataFine = moment(NS_CHECK_A03.contatto.dataFine,"YYYYMMDD");

        for (var i = 0; i > NS_CHECK_A03.contatto.contattiAssistenziali.length; i++){
            numeroAccessi++;
        }

        if (dataFine.diff(dataInizio,"days") < numeroAccessi) {
            objResponse.success = false;
            objResponse.message = "Per il Day Hospital, il n. accessi deve essere minore o uguale al n. giornate del periodo di ricovero";
        }

        return objResponse;
    },

    checkDHAccessi :function(){

        var objResponse = {"success" : true, "message" : []};

        for (var i = 0; i > NS_CHECK_A03.contatto.contattiAssistenziali.length; i++)
        {
            var dataInizioRicovero = moment(NS_CHECK_A03.contatto.dataInizio,"YYYYMMDDHH:mm");
            var dataFineRicovero = moment(NS_CHECK_A03.contatto.dataFine,"YYYYMMDDHH:mm");
            var dataInizioAccesso = moment(NS_CHECK_A03.contatto.contattiAssistenziali[i].dataInizio,"YYYYMMDDHH:mm");
            var dataFineAccesso = moment(NS_CHECK_A03.contatto.contattiAssistenziali[i].dataFine,"YYYYMMDDHH:mm");

            if (dataInizioAccesso < dataInizioRicovero){
                objResponse.success = false;
                objResponse.message.push("L'accesso n. "+ (i + 1) + " aperto in data " + dataInizioAccesso.format("DD/MM/YYYY") + " risulta antecedente alla data di inizio ricovero " + dataInizioRicovero.format("DD/MM/YYYY"));
            }

            if (dataInizioAccesso > dataFineRicovero){
                objResponse.success = false;
                objResponse.message.push("L'accesso n. "+ (i + 1) + " aperto in data " + dataInizioAccesso.format("DD/MM/YYYY") + " risulta successivo alla data di fine del ricovero " + dataFineRicovero.format("DD/MM/YYYY"));
            }

            if (NS_CHECK_A03.contatto.tipo.codice !== "O") {
                var dtISOInizioAccesso = moment(dataInizioAccesso).format("YYYYMMDD");
                var dtISOFineAccesso = moment(dataFineAccesso).format("YYYYMMDD");
                if(dtISOInizioAccesso !== dtISOFineAccesso) {
                    objResponse.success = false;
                    objResponse.message.push("L'accesso n. " + (i + 1) + " aperto in data " + dataInizioAccesso.format("DD/MM/YYYY") + " risulta successivo alla data di fine del ricovero " + dataFineRicovero.format("DD/MM/YYYY"));
                }
            }

            if (NS_CHECK_A03.contatto.contattiAssistenziali[i].stato.codice == "ADMITTED") {
                objResponse.success = false;
                objResponse.message.push("L'accesso n. "+ (i + 1) + " aperto in data " + dataInizioAccesso.format("DD/MM/YYYY")+ " deve essere chiuso");
            }

        }

        return objResponse;
    },

    /**
     * Controllo data dimissione per ricovero ODS.
     * Il ricovero ODS deve avere la data dimissione
     * uguale al giorno successivo della data di accettazione
     *
     * @returns {{success: boolean, message: string}}
     */
    checkDataDimissioneODS : function(){

        var objResponse = {"success" : true, "message" : ""};
        var dataInizio = moment(NS_CHECK_A03.contatto.dataInizio,"YYYYMMDD");
        var dataFine = moment(NS_CHECK_A03.contatto.dataFine,"YYYYMMDD");
        var tipoDimissione = NS_CHECK_A03.contatto.mapMetadatiCodifiche.ADT_DIMISSIONE_TIPO.codice;

        if (NS_CHECK_A03.contatto.tipo.codice != "O"){
            return objResponse;
        }
        if(tipoDimissione == '5'|| tipoDimissione == '1' ){
            //alert(!(dataFine.diff(dataInizio, 'days') > 0 && Number(dataInizio.add(2, 'day').format('YYYYMMDD')) >= Number(dataFine.format('YYYYMMDD'))));
            if(!( Number(dataInizio.add(2, 'day').format('YYYYMMDD')) > Number(dataFine.format('YYYYMMDD')))){
                objResponse.success = false;
                objResponse.message = "La data di dimissione risulta successiva oltre un giorno alla data di accettazione.";
            }
        }else if(dataFine.diff(dataInizio, 'days') == 0){

            objResponse.success = false;
            objResponse.message = "La data di dimissione risulta essere la stessa della data di accettazione. Per il ricovero ODS la data di dimissione deve essere uguale al giorno successivo della data di inizio";

        }else if(!Number(dataInizio.add(2, 'day').format('YYYYMMDD')) > Number(dataFine.format('YYYYMMDD'))){

            objResponse.success = false;
            objResponse.message = "La data di dimissione risulta successiva oltre un giorno alla data di accettazione. Per il ricovero ODS la data di dimissione deve essere uguale al giorno successivo della data di inizio";
        }
        return objResponse;
    },
    checkDataDimissioneDS : function(){
        var objResponse = {"success" : true, "message" : ""};
        var dataInizio = moment(NS_CHECK_A03.contatto.dataInizio,"YYYYMMDDHH:mm");
        var dataFine = moment(NS_CHECK_A03.contatto.dataFine,"YYYYMMDDHH:mm");
        if (NS_CHECK_A03.contatto.tipo.codice != "S"){
            return objResponse;
        }

        if( dataFine.diff(dataInizio, 'days') > 0){
            objResponse.success = false;
            objResponse.message = "La data di dimissione risulta diversa dalla data di accettazione. Per il ricovero DS la data di dimissione deve essere uguale al giorno della data di inizio";

        }

        return objResponse;
    },
    checkDataDimissioneDH : function () {
        var objResponse = {"success" : true, "message" : ""};
        var dataInizio = moment(NS_CHECK_A03.contatto.dataInizio,"YYYYMMDDHH:mm");
        var dataFine = moment(NS_CHECK_A03.contatto.dataFine,"YYYYMMDDHH:mm");

        if(dataInizio.format('YYYY') != dataFine.format('YYYY')){
            objResponse.success = false;
            objResponse.message = "Attenzione! Data di dimissione deve essere nello stesso anno della data di apertura";
        }
        return objResponse;
    }

};

var NS_DIMISSIONE_TEMPLATE_CONTROLLI = {

    "SDO" : {
        "1": {
            /**
             * Implementazione spcifica dei controlli in fase di SDO per i ricoveri ordinari.
             * Importante! p.contatto deve essere il contatto che si vuole sottoporre al controllo.
             *
             * @param p
             * @returns {boolean}
             */
            run: function (p) {

                var objResponseSingle;
                var objResponseRun = {"success" : true, lock : false, "message" : ""};

                logger.info("Verifica Dati Contatto - Init");
                NS_CHECK_A03.resetCheck();
                NS_CHECK_A03.contatto = p.contatto;
                NS_CHECK_A03.tipoPersonale = p.tipoPersonale;

                logger.debug("Verifica Dati Contatto - Controllo Data Dimissione");
                objResponseSingle = NS_CHECK_A03.checkDataDimissione();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    for (var i = 0; i < objResponseSingle.message.length; i++){
                        NS_CHECK_A03.message.push(objResponseSingle.message[i]);
                    }
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Data Dimissione con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Esistenza Diagnosi Principale");
                objResponseSingle = NS_CHECK_A03.checkExistsDiagnosiPrincipale();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Esistenza Diagnosi Principale con esito " + objResponseSingle.success);

                // Controllo coerenza con specialita
                logger.debug("Verifica Dati Contatto - Controllo Coerenza Specialita Sesso");
                objResponseSingle = NS_CHECK_A03.checkDimissioneSpecialitaSesso();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Specialita Sesso con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Specialita Eta");
                objResponseSingle = NS_CHECK_A03.checkDimissioneSpecialitaEta();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Specialita Eta con esito " + objResponseSingle.success);

                // Controllo Diagnosi e Interventi
                logger.debug("Verifica Dati Contatto - Controllo Coerenza Codici ICD Eta");
                objResponseSingle = NS_CHECK_A03.checkICDComplatibilitaEta();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Codici ICD Eta con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Codici ICD Sesso");
                objResponseSingle = NS_CHECK_A03.checkICDComplatibilitaSesso();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Codici ICD Sesso con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Valorizzazione Struttura Codici ICD");
                objResponseSingle = NS_CHECK_A03.checkICDStruttura();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Valorizzazione Struttura Codici ICD con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Ripetizione Codici ICD");
                objResponseSingle = NS_CHECK_A03.checkICDRipetute();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    for (var i = 0; i < objResponseSingle.message.length; i++){
                        NS_CHECK_A03.message.push(objResponseSingle.message[i]);
                    }
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Ripetizione Codici ICD con esito " + objResponseSingle.success);

                // Nel controllo di coerenza delle diagnosi di truma devo bloccare o meno il salvataggio a seconda della SDO completa o meno
                logger.debug("Verifica Dati Contatto - Controllo Coerenza ICD e Traumatismi");
                objResponseSingle = NS_CHECK_A03.checkICDDiagnosiTrauma();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza ICD e Traumatismi " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Diagnosi ICD Parto");
                objResponseSingle = NS_CHECK_A03.checkICDParto();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Diagnosi ICD Parto" + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Date Interventi");
                objResponseSingle = NS_CHECK_A03.checkICDDateInterventi();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Date Interventi con esito " + objResponseSingle.success);


                logger.debug("Verifica Dati Contatto - Controllo Coerenza Dimissione e check SDO Completa");
                if (!NS_CHECK_A03.dimissione && NS_CHECK_A03.contatto.mapMetadatiString["SDO_COMPLETA"] == "S")
                {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push("Impossibile Aggiornare il Ricovero - La SDO non pu&ograve; essere completa in presenza di un Ricovero ancora aperto");
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Dimissione e check SDO Completa con esito " + objResponseSingle.success);

                if (!objResponseRun.success && objResponseRun.lock) {
                    logger.error("Verifica Dati Contatto - Errore Bloccante Durante Controllo Dimissione");
                } else if(!objResponseRun.success && !objResponseRun.lock) {
                    logger.warn("Verifica Dati Contatto - Errore NON Bloccante Durante Controllo Dimissione");
                } else if (objResponseRun.success && !objResponseRun.lock){
                    logger.info("Verifica Dati Contatto - Nessuna Anomalia Riscontrata Durante Controllo Dimissione");
                }

                if (NS_CHECK_A03.message.length > 0)
                {
                    for (var i = 0; i < NS_CHECK_A03.message.length; i++){
                        if (objResponseRun.lock) {
                            home.NOTIFICA.error({ message: NS_CHECK_A03.message[i], timeout : 10, width : 220, title: 'Errore SDO'});
                            logger.error("Verifica Dati Contatto - Errore Bloccante Dimissione - " + NS_CHECK_A03.message[i]);
                        }else{
                            home.NOTIFICA.warning({ message: NS_CHECK_A03.message[i], timeout : 10, width : 220, title: 'Anomalia NON Bloccante SDO' });
                        }
                    }
                }

                return objResponseRun;
            }
        },
        "2": {
            run: function (p) {

                var objResponseSingle;
                var objResponseRun = {"success" : true, lock : false, "message" : ""};

                logger.info("Verifica Dati Contatto - Init");
                NS_CHECK_A03.resetCheck();
                NS_CHECK_A03.contatto = p.contatto;

                logger.debug("Verifica Dati Contatto - Controllo Data Dimissione");
                objResponseSingle = NS_CHECK_A03.checkDataDimissione();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Data Dimissione con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Data Dimissione per ricovero DS");

                objResponseSingle = NS_CHECK_A03.checkDataDimissioneDH();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Data Dimissione con esito " + objResponseSingle.success);


                objResponseSingle = NS_CHECK_A03.checkDataDimissioneDS();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Data Dimissione per ricovero DS con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Data Dimissione per ricovero ODS");

                objResponseSingle = NS_CHECK_A03.checkDataDimissioneODS();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Data Dimissione per ricovero ODS con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Esistenza Diagnosi Principale");
                objResponseSingle = NS_CHECK_A03.checkExistsDiagnosiPrincipale();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Esistenza Diagnosi Principale con esito " + objResponseSingle.success);


                // Controllo coerenza con specialita
                logger.debug("Verifica Dati Contatto - Controllo Coerenza Specialita Sesso");
                objResponseSingle = NS_CHECK_A03.checkDimissioneSpecialitaSesso();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Specialita Sesso con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Specialita Eta");
                objResponseSingle = NS_CHECK_A03.checkDimissioneSpecialitaEta();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Specialita Eta con esito " + objResponseSingle.success);

                // Controllo Diagnosi e Interventi
                logger.debug("Verifica Dati Contatto - Controllo Coerenza Codici ICD Eta");
                objResponseSingle = NS_CHECK_A03.checkICDComplatibilitaEta();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Codici ICD Eta con esito " + objResponseSingle.success);

                // Controllo Diagnosi e Interventi
                logger.debug("Verifica Dati Contatto - Controllo Coerenza Accessi DH");
                objResponseSingle = NS_CHECK_A03.checkDHAccessi();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Accessi DH con esito " + objResponseSingle.success);

                // Controllo Diagnosi e Interventi
                logger.debug("Verifica Dati Contatto - Controllo Coerenza Giorni DH");
                objResponseSingle = NS_CHECK_A03.checkDHGiornate();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Giorni DH con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Codici ICD Sesso");
                objResponseSingle = NS_CHECK_A03.checkICDComplatibilitaSesso();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Codici ICD Sesso con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Valorizzazione Struttura Codici ICD");
                objResponseSingle = NS_CHECK_A03.checkICDStruttura();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Valorizzazione Struttura Codici ICD con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Ripetizione Codici ICD");
                objResponseSingle = NS_CHECK_A03.checkICDRipetute();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    for (var i = 0; i < objResponseSingle.message.length; i++){
                        NS_CHECK_A03.message.push(objResponseSingle.message[i]);
                    }
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Ripetizione Codici ICD con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza ICD e Traumatismi");
                objResponseSingle = NS_CHECK_A03.checkICDDiagnosiTrauma();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza ICD e Traumatismi " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Date Interventi");
                objResponseSingle = NS_CHECK_A03.checkICDDateInterventi();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    objResponseRun.lock = true;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Date Interventi con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Intervento DS");
                objResponseSingle = NS_CHECK_A03.checkICDInterventiDS();
                if (!objResponseSingle.success) {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push(objResponseSingle.message);
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Intervento DS con esito " + objResponseSingle.success);

                logger.debug("Verifica Dati Contatto - Controllo Coerenza Dimissione e check SDO Completa");
                if (!NS_CHECK_A03.dimissione && NS_CHECK_A03.contatto.mapMetadatiString["SDO_COMPLETA"] == "S")
                {
                    objResponseRun.success = false;
                    NS_CHECK_A03.message.push("Impossibile Aggiornare il Ricovero - La SDO non pu&ograve; essere completa in presenza di un Ricvoero ancora aperto");
                }
                logger.info("Verifica Dati Contatto - Superato Controllo Coerenza Dimissione e check SDO Completa con esito " + objResponseSingle.success);

                if (!objResponseRun.success && objResponseRun.lock) {
                    logger.error("Verifica Dati Contatto - Errore Bloccante Durante Controllo Dimissione");
                } else if(!objResponseRun.success && !objResponseRun.lock) {
                    logger.warn("Verifica Dati Contatto - Errore NON Bloccante Durante Controllo Dimissione");
                } else if (objResponseRun.success && !objResponseRun.lock){
                    logger.info("Verifica Dati Contatto - Nessuna Anomalia Riscontrata Durante Controllo Dimissione");
                }

                if (NS_CHECK_A03.message.length > 0)
                {
                    for (var i = 0; i < NS_CHECK_A03.message.length; i++){
                        if (objResponseRun.lock) {
                            home.NOTIFICA.error({ message: NS_CHECK_A03.message[i], timeout : 10, width : 220, title: 'Errore SDO'});
                            logger.error("Verifica Dati Contatto - Errore Bloccante Dimissione - " + NS_CHECK_A03.message[i]);
                        }else{
                            home.NOTIFICA.warning({ message: NS_CHECK_A03.message[i], timeout : 10, width : 220, title: "Anomalia NON Bloccante SDO"});
                        }
                    }
                }

                return objResponseRun;
            }
        }
    }
};