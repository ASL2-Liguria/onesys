
var NS_VERBALE_JSON ={


    initVerbaleJson : function(callback){

        NS_CONTATTO_METHODS.getContattoById($("#IDEN_CONTATTO").val(),
            { "cbkSuccess" : function(){

                _JSON_CONTATTO = NS_CONTATTO_METHODS.contatto;
                _JSON_RICOVERO_EMPTY = NS_CONTATTO_METHODS.getContattoEmpty({assigningAuthorityArea : "adt", cbkSuccess : function(){ }});

                var contattoRicovero = $("#hIdenRicovero").val();

                if (home.NS_FUNZIONI_PS.hasAValue(contattoRicovero)) {

                    NS_CONTATTO_METHODS.getContattoById(contattoRicovero,
                        { "cbkSuccess" : function(){
                            _JSON_RICOVERO = NS_CONTATTO_METHODS.contatto;
                            callback();
                        }}
                    );

                } else {

                    callback();

                }
            }
        });
    },
    /**
     * getCodiciICD : Restituisce la struttura mapCodiciID da aggiungere al contatto per la dimissione.
     * @returns {{mapCodiciICD: Array}}
     */
    getCodiciICD: function () {

        var jsonICD = {mapCodiciICD: []};

        function getCodifica(codifica) {

            return {
                "evento": {
                    "id": null,
                    "codice": "A01"
                },
                "id": null,
                "codice": codifica.codice,
                "descrizione": codifica.descrizione,
                "ordine": codifica.ordine,
                "data": NS_VERBALE_CONTROLLI.hasAValue(codifica.data) ? codifica.data.length > 0 ? codifica.data : null : null
            };
        }

        $("td.tdICD9").each(function (i) {

            var codifica = $("#txtDiagnosiICD9" + parseInt(i + 1));
            var codice = $("#h-txtDiagnosiICD9" + parseInt(i + 1)).val();

            if (i == 0) {
                jsonICD.mapCodiciICD.push({key: "DIAGNOSI", value: []});
            }

            if (codifica.val() != '' && typeof codifica.val() != 'undefined') {
                jsonICD.mapCodiciICD[jsonICD.mapCodiciICD.length - 1].value.push(getCodifica(
                    {
                        "codice": codice,
                        "descrizione": codifica.val(),
                        "data": null,
                        "ordine": i
                    }));
            }
        });

        return jsonICD;
    },
    /**
     * getJsonDimissioni : Completo il json delle dimissioni con le informazioni che mi servono se non glielo passo prende di default qwuello iniziale
     * @param json
     * @param pUpdateDatiDimissione
     * @param dataFine
     * @param esitoSostitutivo
     * @param idenEsitoSostitutivo
     * @returns {*}
     */
    getJsonDimissioni: function (json, pUpdateDatiDimissione, dataFine, esitoSostitutivo, idenEsitoSostitutivo) {

        var esitoObi = $("#h-radOBI").val(),
            jsonDischarge = NS_VERBALE_CONTROLLI.hasAValue(json) ? json : _JSON_CONTATTO,
            esito = NS_VERBALE_CONTROLLI.hasAValue(esitoSostitutivo) ? esitoSostitutivo : $("#hEsito").val(),
            _update_dati_dimissione = NS_VERBALE_CONTROLLI.hasAValue(pUpdateDatiDimissione) ? pUpdateDatiDimissione : true,
            idenEsito = NS_VERBALE_CONTROLLI.hasAValue(idenEsitoSostitutivo) ? idenEsitoSostitutivo : $("#hEsitoIden").val();

        var sommaTraumatismi = (Number(NS_VERBALE.messEquitalia.TRAUMATISMO1) + Number(NS_VERBALE.messEquitalia.TRAUMATISMO2) +
        Number(NS_VERBALE.messEquitalia.TRAUMATISMO3) + Number(NS_VERBALE.messEquitalia.TRAUMATISMO4) + Number(NS_VERBALE.messEquitalia.TRAUMATISMO5));

        jsonDischarge.uteModifica.id = home.baseUser.IDEN_PER;
        jsonDischarge.importoDRG = Number(NS_VERBALE.messEquitalia.PREZZO_TOT);
        jsonDischarge.urgenza.id = NS_VERBALE.messEquitalia.URGENZA_MED;

        jsonDischarge.mapMetadatiString['IMPORTO_ST'] = (NS_VERBALE.messEquitalia.PREZZO_TOT).replace(".", ",");
        jsonDischarge.mapMetadatiString['IMPORTO_EQUITALIA'] = (NS_VERBALE.messEquitalia.PREZZO_TOT_SOGLIA).replace(".", ",");
        jsonDischarge.mapMetadatiString['IMPORTO_DISTINTA'] = (NS_VERBALE.messEquitalia.PREZZO_DISTINTA).replace(".", ",");
        jsonDischarge.mapMetadatiString['ESENTE_TOTALE'] = (Number(NS_VERBALE.messEquitalia.ESENTE) > 0) ? "S" : "N" ;
        jsonDischarge.mapMetadatiString['TRAUMATISMO'] = (sommaTraumatismi > 0) ? "S" : "N";

        jsonDischarge.mapMetadatiCodifiche['ESITO_DA_PS'] = {id: null, codice: esito};
        jsonDischarge.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id: idenEsito, codice: esito};

        jsonDischarge.contattiGiuridici[jsonDischarge.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
        jsonDischarge.contattiAssistenziali[jsonDischarge.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;

        jsonDischarge.mapCodiciICD = NS_VERBALE_CONTROLLI.hasAValue($("#h-txtDiagnosiICD9").val()) ? NS_VERBALE_JSON.getCodiciICD() : {};

        if(esito == "2" || (esito == "6" && esitoObi == "2")){
            jsonDischarge.mapMetadatiString['NOTE_BRACCIALETTO_RICOVERO'] = $("#taNoteBraccialettoRicovero").val();
        }

        if (_update_dati_dimissione) {
            jsonDischarge.uteDimissione.id = home.baseUser.IDEN_PER;
            jsonDischarge.dataFine = (NS_VERBALE_CONTROLLI.hasAValue(dataFine)) ? dataFine : moment().format('YYYYMMDD') + moment().format('HH:mm') ;
        }

        return jsonDischarge
    },
    /**
     * getJsonRicoveroADT : crea il json per il ricovero in ADT
     * @param dataIns
     * @returns {_JSON_RICOVERO_EMPTY|*}
     */
    getJsonRicoveroADT: function (dataIns) {

        var jsonAdmit = _JSON_RICOVERO_EMPTY,
            tipoRicovero = $("#cmbTipoRico").val(),
            noteBraccialetto = $("#taNoteBraccialettoRicovero").val(),
            txtDiagnosiICD9 = $("#h-txtDiagnosiICD9"),
            data = NS_VERBALE_CONTROLLI.hasAValue(dataIns) ? dataIns : $("#h-txtDataRicovero").val() + $("#txtOraRicovero").val();

        jsonAdmit.parent = {
            id     : _JSON_CONTATTO.id,
            codice : {
                assigningAuthority : "FENIX",
                assigningAuthorityArea : "PS"
            }
        };

        jsonAdmit.parent = _JSON_CONTATTO;
        jsonAdmit.anagrafica.id = NS_VERBALE.iden_anag;
        jsonAdmit.codice.assigningAuthority = "FENIX";
        jsonAdmit.codice.assigningAuthorityArea = "ADT";
        jsonAdmit.dataInizio = data;
        jsonAdmit.uteInserimento.id = home.baseUser.IDEN_PER;
        jsonAdmit.uteAccettazione.id = home.baseUser.IDEN_PER;
        jsonAdmit.regime.codice = "1";//sempre ordinario altrimenti=> $("#cmbRegimeRico").val();
        jsonAdmit.motivo.id = "52";
        jsonAdmit.tipo.codice = tipoRicovero;
        jsonAdmit.stato.codice = "ADMITTED";
        jsonAdmit.mapCodiciICD = NS_VERBALE_CONTROLLI.hasAValue(txtDiagnosiICD9.val()) ? NS_VERBALE_JSON.getCodiciICD() : {};

        jsonAdmit.mapMetadatiString['NEONATO'] = false;
        jsonAdmit.mapMetadatiString['DIAGNOSI_ACCETTAZIONE'] = $("#taDiagnosiICD9").val();
        jsonAdmit.mapMetadatiString['PESO_NEONATO'] = null;
        jsonAdmit.mapMetadatiString['DEA_STR'] = _JSON_CONTATTO.codice.struttura;
        jsonAdmit.mapMetadatiString['DEA_ANNO'] = _JSON_CONTATTO.codice.anno;
        jsonAdmit.mapMetadatiString['DEA_NUMR'] = _JSON_CONTATTO.codice.cartella;
        jsonAdmit.mapMetadatiString['DEA_DATA_CHIUSURA'] = data;
        jsonAdmit.mapMetadatiString['DEA_DATA_INGRESSO'] = _JSON_CONTATTO.dataInizio;
        jsonAdmit.mapMetadatiString['ANAG_RES_INDIRIZZO'] = _JSON_CONTATTO.mapMetadatiString['ANAG_RES_INDIRIZZO'];
        jsonAdmit.mapMetadatiString['ANAG_RES_ASL'] = _JSON_CONTATTO.mapMetadatiString['ANAG_RES_ASL'];
        jsonAdmit.mapMetadatiString['ANAG_DOM_INDIRIZZO'] =_JSON_CONTATTO.mapMetadatiString['ANAG_DOM_INDIRIZZO'];
        jsonAdmit.mapMetadatiString['ANAG_RES_REGIONE'] = _JSON_CONTATTO.mapMetadatiString['ANAG_RES_REGIONE'];
        jsonAdmit.mapMetadatiString['ANAG_CITTADINANZA_ID'] = _JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_ID'];
        jsonAdmit.mapMetadatiString['ANAG_CITTADINANZA_DESCR'] = _JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_DESCR'];
        jsonAdmit.mapMetadatiString['ANAG_RES_CODICE_ISTAT'] = _JSON_CONTATTO.mapMetadatiString['ANAG_RES_CODICE_ISTAT'];
        jsonAdmit.mapMetadatiString['ANAG_DOM_CAP'] = _JSON_CONTATTO.mapMetadatiString['ANAG_DOM_CAP'];
        jsonAdmit.mapMetadatiString['ANAG_RES_CAP'] = _JSON_CONTATTO.mapMetadatiString['ANAG_RES_CAP'];
        jsonAdmit.mapMetadatiString['ANAG_COGNOME'] = _JSON_CONTATTO.mapMetadatiString['ANAG_COGNOME'];
        jsonAdmit.mapMetadatiString['ANAG_NOME'] = _JSON_CONTATTO.mapMetadatiString['ANAG_NOME'];
        jsonAdmit.mapMetadatiString['ANAG_SESSO'] = _JSON_CONTATTO.mapMetadatiString['ANAG_SESSO'];
        jsonAdmit.mapMetadatiString['ANAG_DATA_NASCITA'] = _JSON_CONTATTO.mapMetadatiString['ANAG_DATA_NASCITA'];
        jsonAdmit.mapMetadatiString['ANAG_COMUNE_NASC'] = _JSON_CONTATTO.mapMetadatiString['ANAG_COMUNE_NASC'];
        jsonAdmit.mapMetadatiString['ANAG_COD_FISC'] = _JSON_CONTATTO.mapMetadatiString['ANAG_COD_FISC'];
        jsonAdmit.mapMetadatiString['ANAG_TESSERA_SANITARIA'] = _JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA'];
        jsonAdmit.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA'] = _JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA'];
        jsonAdmit.mapMetadatiString['ANAG_RES_PROV'] = _JSON_CONTATTO.mapMetadatiString['ANAG_RES_PROV'];
        jsonAdmit.mapMetadatiString['ANAG_TELEFONO'] = _JSON_CONTATTO.mapMetadatiString['ANAG_TELEFONO'];

        if (NS_VERBALE_CONTROLLI.hasAValue(noteBraccialetto)){
            jsonAdmit.mapMetadatiString['NOTE_BRACCIALETTO_RICOVERO'] = noteBraccialetto ;
        }

        jsonAdmit.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TIPO_NEONATO'] = {id: null, codice: null};
        jsonAdmit.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TITOLO_STUDIO'] = {id: _JSON_CONTATTO.mapMetadatiCodifiche.ADT_ACC_RICOVERO_TITOLO_STUDIO.id, codice: null};
        jsonAdmit.mapMetadatiCodifiche['STATO_CIVILE'] = {id: _JSON_CONTATTO.mapMetadatiCodifiche.STATO_CIVILE.id, codice: null};
        jsonAdmit.mapMetadatiCodifiche['ADT_ACC_RICOVERO_PROVENIENZA'] = {id: null, codice: '1'};//Senza proposta medica
        jsonAdmit.mapMetadatiCodifiche['ADT_ACC_RICOVERO_ONERE'] = {id: null, codice: $("#cmbOnere").val()};
        jsonAdmit.mapMetadatiCodifiche['ADT_ACC_RICOVERO_SUB_ONERE'] = {id: null, codice: $("#cmbSubOnere").val()};
        jsonAdmit.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TICKET'] = {id: null, codice: "1"};
        jsonAdmit.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TIPO_MEDICO_PRESC'] = {id: null, codice: "PS"};
        jsonAdmit.mapMetadatiCodifiche['TRAUMATISMI'] = {id: null, codice: $("#cmbTraumatismo").val() };
        jsonAdmit.mapMetadatiCodifiche['CATEGORIA_CAUSA_ESTERNA'] = {id: $("#h-txtCategoriaCausaEsterna").val(), codice: null};
        jsonAdmit.mapMetadatiCodifiche['CAUSA_ESTERNA'] = {id: $("#cmbCausaEsterna").find("option:selected").val(), codice: null};

        jsonAdmit.contattiGiuridici[0].provenienza.id = $("#h-txtrepRicovero").val();
        jsonAdmit.contattiGiuridici[0].regime.codice = "1";//sempre ordinario
        jsonAdmit.contattiGiuridici[0].tipo.codice = tipoRicovero;
        jsonAdmit.contattiGiuridici[0].stato.codice = "ADMITTED";
        jsonAdmit.contattiGiuridici[0].dataInizio = data;
        jsonAdmit.contattiGiuridici[0].uteInserimento.id = home.baseUser.IDEN_PER;

        jsonAdmit.contattiAssistenziali[0].provenienza.id = $("#h-txtrepAssistenza").val();
        jsonAdmit.contattiAssistenziali[0].stato.codice = "ADMITTED";
        jsonAdmit.contattiAssistenziali[0].dataInizio = data;
        jsonAdmit.contattiAssistenziali[0].uteInserimento.id = home.baseUser.IDEN_PER;

        return jsonAdmit;
    },
    /**
     * getjsonUpdateADT : costruisce il json per l'update del ricovero
     * @param dataIns
     * @returns {*}
     */
    getjsonUpdateADT: function (dataIns) {

        var jsonAdmit = _JSON_RICOVERO,
            noteBraccialetto = $("#taNoteBraccialettoRicovero").val();

        jsonAdmit.parent = {
            id     : _JSON_CONTATTO.id,
            codice : {
                assigningAuthority : "FENIX",
                assigningAuthorityArea : "PS"
            }
        };

        jsonAdmit.parent = _JSON_CONTATTO;
        jsonAdmit.uteModifica.id = home.baseUser.IDEN_PER;

        jsonAdmit.mapMetadatiString['DIAGNOSI_ACCETTAZIONE'] = $("#taDiagnosiICD9").val();

        jsonAdmit.mapMetadatiCodifiche['ADT_ACC_RICOVERO_ONERE'] = {id: null, codice: $("#cmbOnere").val()};
        jsonAdmit.mapMetadatiCodifiche['ADT_ACC_RICOVERO_SUB_ONERE'] = {id: null, codice: $("#cmbSubOnere").val()};
        jsonAdmit.mapMetadatiCodifiche['TRAUMATISMI'] = {id: null, codice: $("#cmbTraumatismo").val() };
        jsonAdmit.mapMetadatiCodifiche['CATEGORIA_CAUSA_ESTERNA'] = {id: $("#h-txtCategoriaCausaEsterna").val(), codice: null};
        jsonAdmit.mapMetadatiCodifiche['CAUSA_ESTERNA'] = {id: $("#cmbCausaEsterna").find("option:selected").val(), codice: null};

        jsonAdmit.contattiGiuridici[0].provenienza = {id: $("#h-txtrepRicovero").val(), codice: null};
        jsonAdmit.contattiGiuridici[0].tipo.codice = $("#cmbTipoRico").val();
        jsonAdmit.contattiGiuridici[0].uteModifica.id = home.baseUser.IDEN_PER;

        jsonAdmit.contattiAssistenziali[0].provenienza = {id: $("#h-txtrepAssistenza").val(), codice: null};
        jsonAdmit.contattiAssistenziali[0].uteModifica.id = home.baseUser.IDEN_PER;

        if(NS_VERBALE_CONTROLLI.hasAValue(noteBraccialetto)){
            jsonAdmit.mapMetadatiString['NOTE_BRACCIALETTO_RICOVERO'] = NS_VERBALE_CONTROLLI.hasAValue(noteBraccialetto) ? noteBraccialetto : "";
        }

        if(NS_VERBALE_CONTROLLI.hasAValue(dataIns)) {
            jsonAdmit.dataInizio = dataIns;
            jsonAdmit.mapMetadatiString['DEA_DATA_CHIUSURA'] = dataIns;
            jsonAdmit.contattiGiuridici[0].dataInizio = dataIns;
            jsonAdmit.contattiAssistenziali[0].dataInizio = dataIns;
        }

        return jsonAdmit;
    }
};