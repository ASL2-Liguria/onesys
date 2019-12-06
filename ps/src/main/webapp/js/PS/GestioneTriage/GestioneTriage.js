/**
 * Chiamate centralizzate per elaborazioni di Lista Attesa *
 */

var NS_TRIAGE_METHODS = {

    /**
     * Inserimento record su adt.Lista attesa
     * @param json
     */
    inserisci : function(json){

        var params  ={
            "P_IDEN_ANAGRAFICA"          : {v: Number(json.iden_anagrafica), t: "N"},
            "P_CDC"                      : {v: Number(json.iden_cdc), t: "N"},
            "P_ASSIGNING_AUTHORITY_AREA" : {v: "PS", t: "V"},
            "P_UTENTE_INSERIMENTO"       : {v: Number(json.utente_inserimento), t: "N"},
            "P_IDEN_CONTATTO"            : {v: Number(json.iden_contatto), t: "N"},
            "P_IDEN"                     : {t: "N", d: "O"}
        };

        if(json.urgenza!=null && json.urgenza!="" && typeof json.urgenza!="undefined"){
            params.P_URGENZA = {v: json.urgenza, t: "N"};
        }

        if(json.iden_precedente!=null && json.iden_precedente!="" && typeof json.iden_precedente!="undefined"){
            params.P_IDEN_PRECEDENTE = {v: json.iden_precedente, t: "N"};
        }

        if(json.progressivo!=null && json.progressivo!="" && typeof json.progressivo!="undefined"){
            params.P_PROGRESSIVO = {v: json.progressivo, t: "N"};
        }

        var parametri = {
            "datasource": "ADT",
            id: "LISTA_ATTESA_PZ_2.INSERISCI",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk(data) {
            json.callback(data);
        }
    },

    /**
     * Modificato lo stato in Lista Attesa
     * @param json
     */
    modificaStato : function(json){

        var params = {
            "P_IDEN"          : {v: json.iden_lista, t: "N"},
            "P_STATO"         : {v: json.stato_lista, t: "V"},
            "P_UTENTE_MODIFICA" : {v: home.baseUser.IDEN_PER, t: "N"}
        };

        if(json.iden_contatto!=null && json.iden_contatto!="" && typeof json.iden_contatto!="undefined"){
            params.P_IDEN_CONTATTO = {v: json.iden_contatto, t: "N"};
        }
        if(json.data_fine!=null && json.data_fine!="" && typeof json.data_fine!="undefined"){
            params.P_DATA_FINE = {v: json.data_fine, t: "N"};
        }

        var parametri = {
            "datasource": "ADT",
            id: "LISTA_ATTESA_PZ_2.MODIFICA",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk(data) {
            json.callback(data);
        }
    },

    /**
     * Controllo sul completamento dei dati della cartella per permettere il completamento del Triage
     * @param json
     */
    checkCompletaTriage : function(json){

        var params = {
            pIdenContatto : {t:'N', v : json.iden_contatto},
            pIsDaMotivare : {t:'V', v : home.CARTELLA.isDaMotivare == "undefined" ? "ND" : home.CARTELLA.isDaMotivare }
        };

        var parametri = {
            datasource : 'PS',
            id: 'CHECKCOMPLETATRIAGE',
            params : params,
            callbackOK : callbackOk
        };

        NS_CALL_DB.FUNCTION(parametri);

        function callbackOk(data){
            json.callback(data);
        }
    },

    /**
     * modifica lo stato del record di lista attesa con "COMPLETATO"
     * @param json
     */
    setCompletato : function(json){

        NS_TRIAGE_METHODS.checkStatoLista({
            "iden_contatto" : json.iden_contatto,
            "stato_controllo" : "INSERITO",
            "callback"  : function() {

                var params = {contattiGiuridici: 1, contattiAssistenziali: 1, assigningAuthorityArea: 'ps'};
                var contatto = NS_DATI_PAZIENTE.getDatiContattobyIden(Number(json.iden_contatto), params);
                var newContAss = $.extend(newContAss,contatto.contattiAssistenziali[contatto.contattiAssistenziali.length -1]);
                var newContGiu = $.extend(newContGiu, contatto.contattiGiuridici[contatto.contattiGiuridici.length -1]);
                var servlet = 'CompletaTriageAssistenziale';
                var jsonListaAttesa = home.PANEL.NS_INFO_PAZIENTE.getJsonListaAttesa();

                newContAss.id = null;
                newContGiu.id = null;

                newContAss.dataInizio = moment().format('YYYYMMDDHH:mm');
                // contatto.contattiAssistenziali[contatto.contattiAssistenziali.length -1].dataFine = moment().format('YYYYMMDDHH:mm');

                newContGiu.dataInizio = moment().format('YYYYMMDDHH:mm');
                // contatto.contattiGiuridici[contatto.contattiGiuridici.length -1].dataFine = moment().format('YYYYMMDDHH:mm');

                // newContAss.mapMetadatiString['UTENTE_TRIAGE'] = home.baseUser.IDEN_PER;
                newContAss.mapMetadatiString['PRIMA_PRESA_IN_CARICO_MEDICA'] =  'N';

                newContAss.uteInserimento.id = home.baseUser.IDEN_PER;
                newContAss.uteModifica.id = home.baseUser.IDEN_PER;

                if(home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST'){
                    newContAss.mapMetadatiString['UTENTE_RESPONSABILE_INFERMIERE'] = home.baseUser.IDEN_PER;
                    newContAss.mapMetadatiString['UTENTE_RESPONSABILE_MEDICO'] = null;
                }else if (home.baseUser.TIPO_PERSONALE == 'M'){
                    newContAss.mapMetadatiString['UTENTE_RESPONSABILE_MEDICO'] = home.baseUser.IDEN_PER;
                    newContAss.mapMetadatiString['UTENTE_RESPONSABILE_INFERMIERE'] = null;
                }

                newContAss.provenienza = { id : jsonListaAttesa.IDEN_PROVENIENZA, idCentroDiCosto : jsonListaAttesa.CDC_IDEN, codice : null};
                newContAss.cdc = { id : jsonListaAttesa.IDEN_PROVENIENZA, idCentroDiCosto : jsonListaAttesa.CDC_IDEN, codice : null};
                newContAss.precedente = {"id":contatto.contattiAssistenziali[contatto.contattiAssistenziali.length -1].id};

                if(contatto.contattiGiuridici[contatto.contattiGiuridici.length -1].provenienza.idCentroDiCosto != null && contatto.contattiGiuridici[contatto.contattiGiuridici.length -1].provenienza.idCentroDiCosto != jsonListaAttesa.CDC_IDEN){

                    newContGiu.provenienza = { id : jsonListaAttesa.IDEN_PROVENIENZA, idCentroDiCosto : jsonListaAttesa.CDC_IDEN, codice : null};
                    newContGiu.cdc = { id : null, idCentroDiCosto : null, codice : null};
                    newContGiu.uteModifica.id = home.baseUser.IDEN_PER;
                    newContGiu.uteInserimento.id = home.baseUser.IDEN_PER;
                    newContGiu.precedente = {"id":contatto.contattiGiuridici[contatto.contattiGiuridici.length -1].id};

                    contatto.contattiGiuridici.push(newContGiu);
                    var servlet = 'CompletaTriageGiuridico';
                }

                contatto.contattiAssistenziali.push(newContAss);

                var posizione = contatto.posizioniListaAttesa[contatto.posizioniListaAttesa.length - 1];

                posizione.stato = {id : null, codice : "COMPLETO"};
                posizione.utenteModifica = newContGiu.uteModifica;
                posizione.dataFine = moment().format("YYYYMMDDHH:mm");
                posizione.metadati.UTENTE_COMPLETAMENTO = home.baseUser.IDEN_PER;

                var p = {"servlet" : servlet , "contatto" : contatto, "hl7Event" : "COMLETA TRIAGE", "notifica" : {"show" : "N", "timeout" : 3 ,"message" : ">Completamento Triage Avvenuto con Successo", "errorMessage" : "Errore Durante Completamento Triage"}, "cbkSuccess" : function () { json.callback(); }, "scope" :'ps/'};

                NS_CONTATTO_METHODS.contatto = p.contatto;
                NS_CONTATTO_METHODS.executeAJAX(p);

                // NS_CONTATTO_METHODS.transferPatient(p);
            }
        });
    },

    /**
     * Chiude il record di lista attesa , sulla presa in carico medica
     * @param json
     */
    setChiuso : function(json){

        /*NS_TRIAGE_METHODS.checkStatoLista({
            "iden_contatto" : json.iden_contatto,
            "stato_controllo" : "COMPLETO",
            "callback"  : function() {*/

                var params = {
                    "P_IDEN": {v: json.iden_lista, t: "N"},
                    "P_STATO": {v: 'CHIUSO', t: "V"},
                    "P_DATA_FINE": {v: moment().format("YYYYMMDD HH:mm:ss"), t: "T"},
                    "P_UTENTE_MODIFICA": {v: home.baseUser.IDEN_PER, t: "N"}
                };

                var parametri = {
                    "datasource": "ADT",
                    id: "LISTA_ATTESA_PZ_2.MODIFICA",
                    "params": params,
                    "callbackOK": callbackOk
                };

                NS_CALL_DB.PROCEDURE(parametri);

                function callbackOk(data) {
                    json.callback(data);
                }
          /*  }
        });*/
    },
    /**
     * Operazione di Rivalutazione Triage
     * @param json
     */
    rivaluta : function(json){

        NS_TRIAGE_METHODS.checkStatoLista({
            "iden_contatto" : json.iden_contatto,
            "stato_controllo" : "COMPLETO",
            "callback"  : function(resp){
              
                    NS_TRIAGE_METHODS.inserisci({
                        "utente_inserimento" : json.utente_inserimento,
                        "iden_anagrafica" : json.iden_anagrafica,
                        "iden_cdc"        : json.iden_cdc,
                        "iden_contatto" : json.iden_contatto,
                        "progressivo" : Number(resp.PROGRESSIVO) +1,
                        "iden_precedente" : resp.IDEN_LISTA,
                        "urgenza" : resp.URGENZA,
                        "callback" : function(data){
                            json.callback(data);
                        }
                    });
                }
           // }
        });
    },

    /**
     * Manutenzione del record di Lista Attesa
     * @param json
     */
    manutenzione : function(json){

        NS_TRIAGE_METHODS.checkStatoLista({
            "iden_contatto" : json.iden_contatto,
            "stato_controllo" : "COMPLETO",
            "callback"  : function(rec){
                var params = {
                    "P_IDEN"            : {v: rec.IDEN_LISTA, t: "N"},
                    "P_STATO"           : {v: "INSERITO", t: "V"},
                    "P_UTENTE_MODIFICA" : {v: home.baseUser.IDEN_PER, t: "N"},
                    "P_IDEN_ANAGRAFICA" : {v: json.iden_anagrafica, t: "N"},
                    "P_CDC"             : {v: json.iden_cdc, t: "N"},
                    "P_URGENZA"         : {v: rec.URGENZA, t:"N"}
                };

                var parametri = {
                    "datasource": "ADT",
                    id: "LISTA_ATTESA_PZ_2.MODIFICA",
                    "params": params,
                    "callbackOK": callbackOk
                };

                NS_CALL_DB.PROCEDURE(parametri);

                function callbackOk(data){
                    json.callback(data);
                }
            }
        });
    },
    /**
     * Rimozione del record di lista attesa della rivalutazione
     * @param json
     */
    rimuovi : function(json){

        var params = {
            "P_IDEN"          : {v: json.iden_lista, t: "N"},
            "P_STATO"         : {v: "RIMOSSO", t: "V"},
            "P_UTENTE_MODIFICA" : {v: home.baseUser.IDEN_PER, t: "N"},
            "P_ATTIVO"  : {v: "N", t: "V"},
            "P_DELETED"  : {v: "S", t: "V"}
        };

        var parametri = {
            "datasource": "ADT",
            id: "LISTA_ATTESA_PZ_2.ANNULLA",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk(data){
            json.callback(data);
        }

        /*
        var params = {
            "P_IDEN"          : {v: json.iden_lista, t: "N"},
            "P_STATO"         : {v: "RIMOSSO", t: "V"},
            "P_UTENTE_MODIFICA" : {v: home.baseUser.IDEN_PER, t: "N"},
            "P_DATA_FINE" : {v: moment().format("YYYYMMDD HH:mm:ss"), t: "T"},
            "P_ATTIVO"  : {v: "N", t: "V"},
            "P_DELETED"  : {v: "S", t: "V"}
        };

        var parametri = {
            "datasource": "PS",
            id: "ADT$LISTA_ATTESA_PAZIENTI.MODIFICA",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk(){
            var params = {
                "P_IDEN"          : {v: json.iden_precedente, t: "N"},
                "P_STATO"         : {v: "COMPLETO", t: "V"},
                "P_UTENTE_MODIFICA" : {v: home.baseUser.IDEN_PER, t: "N"},
                "P_ATTIVO"  : {v: "S", t: "V"},
                "P_DELETED"  : {v: "N", t: "V"}
            };

            var parametri = {
                "datasource": "PS",
                id: "ADT$LISTA_ATTESA_PAZIENTI.MODIFICA",
                "params": params,
                "callbackOK": callbackOk
            };

            NS_CALL_DB.PROCEDURE(parametri);

            function callbackOk(data){
                json.callback(data);
            }
        }
        */
    },

    checkStatoLista : function(json){
        var db = $.NS_DB.getTool();
        var dbParams = {"iden_contatto": {v: json.iden_contatto, t: "N"}};
        var xhr = db.select({
            datasource: "PS",
            id: "PS.Q_CONTROL_RECORD",
            parameter: dbParams
        });
        xhr.done(function (response) {

            var resp = response.result[0];
            var stato = resp.STATO_LISTA;

            if (stato===json.stato_controllo){
                json.callback(resp);
                logger.info("checkStatoLista controllo stato OK "+ json.stato_controllo);
            } else {
                logger.error("checkStatoLista: Operazione non consentita per stato="+stato);
                home.NOTIFICA.error({message:"Impossibile eseguire l'operazione. ", title: "Attenzione", timeout: 3});
            }

        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("Operazione non consentita \n" + JSON.stringify(jqXHR) +
                "\n" + JSON.stringify(textStatus) + "\n" + JSON.stringify(errorThrown));
        });
    }
};