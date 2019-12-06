/**
 * Created by matteo.pipitone on 03/06/2015.
 */

var OBI = {
    /** funzione che inserisce l'obi
     params {
         IDEN_UBICAZIONE : <IDEN>
         IDEN_PROVENIENZA : <IDEN>
         IDEN_CONTATTO : <IDEN>
         CODICE_ICD9 : CODICE
         DATA_INS : <DATA>
         callback : function {}
     }
     */
    Inserisci: function (params) {

        logger.debug("OBI.Inserisci params ->" + JSON.stringify(params));
        var jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden(params.IDEN_CONTATTO, {assigningAuthorityArea: 'ps'});

        var idePerDestinatario = home.baseUser.IDEN_PER,
            idenProvDestinatario = params.IDEN_PROVENIENZA,
            lastContattoGiu = {},
            lastContattoAss = {};

        $.extend(lastContattoAss, jsonContatto.contattiAssistenziali[jsonContatto.contattiAssistenziali.length - 1]);
        $.extend(lastContattoGiu, jsonContatto.contattiGiuridici[jsonContatto.contattiGiuridici.length - 1]);
        lastContattoGiu.id = null;
        lastContattoAss.id = null;
        jsonContatto.mapMetadatiString['UBICAZIONE'] = params.IDEN_UBICAZIONE;

        lastContattoGiu.provenienza.id = idenProvDestinatario;
        lastContattoGiu.dataInizio = params.DATA_INIZIO;
        //lastContattoGiu.dataInserimento = moment().format("YYYYMMDDHH:mm");//params.DATA_INS;
        lastContattoGiu.uteInserimento.id = idePerDestinatario;
        lastContattoGiu.stato.codice = 'ADMITTED';
        lastContattoGiu.uteModifica.id = idePerDestinatario;
        lastContattoGiu.precedente = {"id": jsonContatto.contattiGiuridici[jsonContatto.contattiGiuridici.length - 1].id};
        lastContattoGiu.regime = { id: null, codice: 'OBI'};
        lastContattoGiu.mapMetadatiString['DIAGOSI_ICD9_OBI'] = params.CODICE_ICD9;

        lastContattoAss.provenienza.id = idenProvDestinatario;
        lastContattoAss.dataInizio = params.DATA_INIZIO;
        //lastContattoAss.dataInserimento = moment().format("YYYYMMDDHH:mm");
        lastContattoAss.stato.codice = 'ADMITTED';
        lastContattoAss.uteInserimento.id = idePerDestinatario;
        lastContattoAss.uteModifica.id = idePerDestinatario;
        lastContattoAss.precedente = {"id": jsonContatto.contattiAssistenziali[jsonContatto.contattiAssistenziali.length - 1].id};
        lastContattoAss.mapMetadatiString['UTENTE_RESPONSABILE_MEDICO'] = idePerDestinatario;
        lastContattoAss.mapMetadatiString['PRIMA_PRESA_IN_CARICO_MEDICA'] = 'N';
        lastContattoAss.note = 'Inserimento OBI con utente responsabile ' + idePerDestinatario + ' in ubicazione =' + params.IDEN_UBICAZIONE;

        jsonContatto.contattiAssistenziali.push(lastContattoAss);
        jsonContatto.contattiGiuridici.push(lastContattoGiu);

        var parameters = {
            "P_IDEN_CONTATTO": {t: "N", v: params.IDEN_CONTATTO },
            "P_KEY_LIST": {v: ['UBICAZIONE'], t: 'A'},
            "P_VALUE_LIST": {v: [params.IDEN_UBICAZIONE], t: 'A'},
            "P_TYPE_LIST": {v: ['S'], t: 'A'}
        };

        var parametri = {
            "datasource": "PS",
            id: "ADT$ADT_CONTATTI.UPDATE_METADATI_CONTATTO",
            "params": parameters,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk() {

            var p = {
                "contatto": jsonContatto,
                "scope": "ps/",
                "servlet": "SegnalaObi",
                "notifica": {"show": "S", "timeout": 3, "message": "Segnala OBI Avvenuta con Successo",
                    "errorMessage": "Errore Durante Segnala OBI"},
                "hl7Event": "SEGNALA_OBI",
                "cbkSuccess": function () {

                    var parametriPrestazione = {
                        callback: function(){params.callback();},
                        iden_anag: jsonContatto.anagrafica.id,
                        iden_contatto: params.IDEN_CONTATTO,
                        iden_provenienza: params.IDEN_PROVENIENZA
                    };

                    OBI.inserisciPrestazioneOBI(parametriPrestazione);
                }
            };

            NS_CONTATTO_METHODS.contatto = p.contatto;
            NS_CONTATTO_METHODS.executeAJAX(p);
        }
    },
    /**
     * Annulla
     * @param rec
     * @constructor
     */
    Annulla: function (rec) {
        //idenContatto, idenContattoRicovero, idenSchedaVerbale, idenSchedaEsito, codiceRicovero, callback)
        FNC_MENU_GENERICS.eliminaEsitoPS(rec[0].IDEN_CONTATTO, null, null, function () {
            $.dialog.hide();
            NS_WK_PS.caricaWk();
        });
    },
    /**
     * param.IDEN_TESTATA_OBI
     * */
    haveAOBI : function (idenObi) {
        return (LIB.isValid(idenObi) && (idenObi > 0));
    },
    /**
     *  Inserisce prestazione OBI in esami testata di polari dati
     */
    inserisciPrestazioneOBI : function (params) {
        // OBI: CODICE_DECODIFICA=C01878600 , IDEN=23462
        /*
         * iden_anag : iden_anag
         * iden_contatto : iden_contatto
         * iden_provenienza : iden_provenienza
         * callback
         * */
        /**
         * matteo.pipitone
         * cambiato il salvataggio della richiesta -> migrata la crazione dell'xml a  PRONTO_SOCCORSO.PRESTAZIONI.FNC_RICHIEDI_ESAMI
         * in caso di errori guardare i log sul db
         * */
        var db = $.NS_DB.getTool({setup_default: {datasource: 'PS', async: false}});
        var keyLegame = 'OBI';
        var parametri = {
            pIdenPer: {t: 'N', v: home.baseUser.IDEN_PER},
            pUsername: {t: 'V', v: home.baseUser.USERNAME},
            pIdenAnagrafica: {t: 'N', v: params.iden_anag},
            pDataEsame: {t: 'V', v: moment().format('YYYYMMDD')},
            pOraEsame: {t: 'V', v: moment().format('HH:mm')},
            pIdenCdc: {t: 'N', v: home.baseUserLocation.iden },
            pIdenNomenclatore: {t: 'V', v: home.baseGlobal.OBI_IDEN_ESA},
            pStatoEsame: {t: 'N', v: 50},
            pIdenProvenienza: {t: 'N', v: params.iden_provenienza},
            pIdenContatto: {t: 'N', v: params.iden_contatto},
            pKeyLegame: {t: 'V', v: keyLegame},
            pStatoPagina: {t: 'V', v: 'I'},
            pScheda: {t: 'V', v: keyLegame}
        };

        var xhr = db.call_function({
            id: "PRESTAZIONI.FNC_RICHIEDI_ESAMI",
            parameter: parametri
        });

        xhr.done(function (data, textStatus, jqXHR) {
            var resp = data.p_result.substr(0, 2);
            if (resp == 'OK') {
                logger.info("Richiesta di OBI inviata correttamente : " + JSON.stringify(data));
                home.NOTIFICA.success({message: "Richieste inviate correttamente" + data.p_result, timeout: 3, title: 'Success'});
                params.callback();
            } else {
                var risp = data.p_result.split("$");
                logger.error(JSON.stringify(parametri));
                logger.error("resp  KO  : Errore nella chiamata a PRESTAZIONI.FNC_RICHIEDI_ESAMI \n" + risp[1] +
                    JSON.stringify(textStatus) + "\n" + JSON.stringify(jqXHR));
                home.NOTIFICA.error({message: "Errore nell'inserimento Prestazione", title: "Error", timeout: 5});
                return false;
            }
        });

        xhr.fail(function (jqXHR, textStatus) {
            logger.error(parametri);
            logger.error("resp  KO  : Errore nella chiamata a PRESTAZIONI.FNC_RICHIEDI_ESAMI \n" + risp[1] +
                JSON.stringify(textStatus) + "\n" + JSON.stringify(jqXHR));
            home.NOTIFICA.error({message: "Errore nell'inserimento Prestazione", title: "Error", timeout: 5});
            return false;
        });
    }
};
