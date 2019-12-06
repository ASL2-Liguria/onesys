/**
 * gestione dei dati del paziente all'interno della cartella
 * @type {{jsonAnagrafica: null, jsonContatto: null, jsonListaAttesa: null, initJsonAnagrafica: initJsonAnagrafica, setJsonAnagrafica: setJsonAnagrafica, getJsonAnagrafica: getJsonAnagrafica, setJsonContatto: setJsonContatto, getJsonContatto: getJsonContatto, setJsonListaAttesa: setJsonListaAttesa, getJsonListaAttesa: getJsonListaAttesa}}
 * jsonLocazione = {"IDEN_PROVENIENZA":"1066","TIPO_PROVENIENZA":"P","COD_CDC":"PS_SV","CODICE_CUP":"5106","SITO":"ASL2","COD_DEC_PROV":"900770","COD_DEC_CDC":"900770","STRUTTURA":"SAVONA","SUB_CODICE_STRUTTURA":"04","SUB_CODICE_SEZIONE":"5106","DESCRIZIONE":"PRONTO SOCCORSO SAVONA","CODICE_STS11":"400001","IDEN":"744","CODICE_SEZIONE":"","ABILITA_TRIAGE":"S"}
 * jsonAnagrafica = {"IDEN_COMUNE_NASCITA":"009056","PESO":"","IDEN_PROFESSIONE":"","TESSERA_BENEFICIARIO":"","DOM_TELEFONO":"","COD_COM_NASCITA":"I480","ALTEZZA":"","TESSERA_DATA_SCAD":"","SESSO":"F","RES_INDIRIZZO":"VIA LEONARDO DA VINCI 10/13","NAZIONE":"","USL_DOMICILIO":"","DOM_COD_REGIONE":"","DOM_NUMERO_CIVICO":"","MEDICO_BASE":"","DOM_INDIRIZZO":"","RICONOSCIUTO":"","IDEN":"763264","RES_TELEFONO":"0192302290","DATE_INSERIMENTO":"2014-07-07 16:39:14.0","IDEN_MEDICO_BASE":"","IDEN_NAZIONE":"","DATA_MORTE":"","DESCR_ISTRUZIONE":"","NOTE":"","IDEN_PRF":"","ANAMNESI":"","DATA_SCADENZA_STP":"","DOM_CAP":"","IDEN_STATO_CIVILE":"","CODICE_FISCALE":"RPALSN90D51I480P","IDEN_LIVELLO_ISTRUZIONE":"","STP":"N","RES_USL":"","COD_REG_RESIDENZA":"070","USL_NASCITA":"102","COD_STP":"","COMUNE_RESIDENZA":"SAVONA","DOM_PRESSO":"","IDEN_COMUNE_RESIDENZA":"009056","IDEN_COMUNE_DOMICILIO":"","PRIVACY_PAZIENTE":"","RES_COD_REGIONE":"","IDEN_UTENTE_DELETED":"","NOME":"ALESSANDRA","COD_REG_DOMICILIO":"","CITTADINANZA":"","IDEN_UTENTE_INSERIMENTO":"","COD_COM_DOMICILIO":"","COD_COM_RESIDENZA":"I480","LIVELLO_ISTRUZIONE":"","READONLY":"N","EMAIL":"","CERTIFICATO":"","DOM_PROVINCIA":"","DELETED":"N","DATE_MODIFICA":"","PROFESSIONE":"","TESSERA_REGIONE":"","FLAG_CONSENSO":"N","NUMERO_GIORNALIERO":"0","IDEN_UTENTE_MODIFICA":"","RES_NUMERO_CIVICO":"","COGNOME":"ARPI","RES_CELLULARE":"","TESSERA_SANITARIA":"","COMUNE_NASCITA":"SAVONA","COMUNE_DOMICILIO":"","COD_REG_NASCITA":"070","COD_NAZIONE":"","USL_RESIDENZA":"102","RES_CAP":"17100","DATA_NASCITA":"19900411","STATO_CIVILE":"","RES_PROVINCIA":"SV","DOM_USL":""}
 * jsonListaAttesa = {"CDC_COD_CDC": "PS_SV","CDC_IDEN": "744","CDC_STRUTTURA": "SAVONA","DATA_FINE": "","DATA_INSERIMENTO": "2014-12-23 09:59:01.0","DATA_MODIFICA": "2015-01-08 12:26:02.0","DATA_PRENOTAZIONE": "2014-12-23 09:59:01.0","DATA_RICHIESTA": "","DELETED": "N","IDEN": "4692","IDEN_ANAGRAFICA": "763264","IDEN_CONTATTO": "92734","IDEN_LISTA": "205337","IDEN_PROVENIENZA": "1066","MEDICO_PROPONENTE": "","NOTE": "prova","NOTE_MODIFICA": "","STATO": "4302","STATO_DESCR": "RIMOSSO","URGENZA": "853","URGENZA_DESCR": "ROSSO","UTENTE_INSERIMENTO": "28160","UTENTE_MODIFICA": "28340"}
 */

var NS_INFO_PAZIENTE={

    jsonAnagrafica: null,
    jsonContatto : null,
    jsonListaAttesa : null,
    jsonLocazione : null,


    /**
     * Inizializza il Json con le informazioni anagrafiche
     * @param idenAnag
     */
    initJsonAnagrafica : function(idenAnag){
        home.NS_CONSOLEJS.addLogger({name: 'initJsonAnagrafica', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['initJsonAnagrafica'];

        if(idenAnag==null || idenAnag=="" || typeof idenAnag =="undefined"){
            logger.error("NS_INFO_PAZIENTE.initJsonAnagrafica idenAnag is undefined");
        }

        var db = $.NS_DB.getTool();
        var dbParams = {
            "iden_anagrafica": {v: idenAnag, t: "N"}
        };
        var xhr = db.select({
            datasource: "PS",
            id: "PS.Q_SCHEDA_ANAGRAFICA",
            parameter: dbParams
        });
        xhr.done(function (response) {
            if (response) {
                NS_INFO_PAZIENTE.setJsonAnagrafica(response.result[0]);
                logger.info("caricato JsonAnagrafica per iden_anag : " + response.result[0].IDEN);
                NS_INFO_ESAME.hidePotesta();
                NS_INFO_ESAME.hideDivAnagrafica();

            } else {
                logger.error("NS_INFO_PAZIENTE.initJsonAnagrafica " );
            }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("NS_INFO_PAZIENTE.initJsonAnagrafica \n" + JSON.stringify(jqXHR) + "\n" +
                JSON.stringify(textStatus) + "\n" + JSON.stringify(errorThrown));

        });
    },
    /**
     * inizializza il Json del contatto
     * @param idenContatto
     */
    initJsonContatto : function(idenContatto){
        NS_INFO_PAZIENTE.setJsonContatto(NS_DATI_PAZIENTE.getDatiContattobyIden(idenContatto, {assigningAuthorityArea:'ps'}));
    },
    /**
     * inizializza il json con le informazione della lista d'attesa
     * @param idenLista
     * @param callback
     */
    initJsonListaAttesa : function(idenLista,callback){
        home.NS_CONSOLEJS.addLogger({name: 'initJsonListaAttesa', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['initJsonListaAttesa'];

        if((idenLista==null) || (idenLista=="") || (typeof idenLista =="undefined") || (idenLista==undefined) || (idenLista=="null")){
            logger.warn("NS_INFO_PAZIENTE.initJsonListaAttesa idenLista is undefined");
        }else{
            var db = $.NS_DB.getTool();
            var dbParams = {
                "iden_lista": {v: idenLista, t: "N"}
            };
            var xhr = db.select({
                datasource: "PS",
                id: "PS.Q_LISTA_ATTESA",
                parameter: dbParams
            });
            xhr.done(function (response) {
                if (response) {
                    NS_INFO_PAZIENTE.setJsonListaAttesa(response.result[0]);
                    logger.info("caricato JsonListaAttesa per iden_lista : " + response.result[0].IDEN);
                    if(callback){callback();}
                } else {
                    logger.error("NS_INFO_PAZIENTE.initJsonListaAttesa " );
                }
            });
            xhr.fail(function (jqXHR, textStatus, errorThrown) {
                logger.error("NS_INFO_PAZIENTE.initJsonListaAttesa \n" + JSON.stringify(jqXHR) + "\n" +
                    JSON.stringify(textStatus) + "\n" + JSON.stringify(errorThrown));

            });
        }
    },
    /**
     * inizializza il Json con le informazioni di centri di costo e provenienza
     */
    initJsonLocazione : function(iden_contatto,callback){
        home.NS_CONSOLEJS.addLogger({name: 'initJsonLocazione', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['initJsonLocazione'];



        if((iden_contatto==null) || (iden_contatto=="") || (typeof iden_contatto =="undefined") || (iden_contatto==undefined) || (iden_contatto=="null")){
            logger.error("NS_INFO_PAZIENTE.initJsonLocazione iden_contatto is undefined");
        }else{
            var db = $.NS_DB.getTool();
            var dbParams = {
                "iden_contatto": {v: iden_contatto, t: "N"}
            };
            var xhr = db.select({
                datasource: "PS",
                id: "PS.Q_LOCAZIONE",
                parameter: dbParams
            });
            xhr.done(function (response) {
                if (response) {
                    NS_INFO_PAZIENTE.setJsonLocazione(response.result[0]);
                    logger.info("caricato jsonLocazione per iden_cdc : " + response.result[0].IDEN);
                    if(callback){callback();}
                } else {
                    logger.error("NS_INFO_PAZIENTE.initJsonLocazione " );
                }
            });
            xhr.fail(function (jqXHR, textStatus, errorThrown) {
                logger.error("NS_INFO_PAZIENTE.initJsonLocazione \n" + JSON.stringify(jqXHR) + "\n" +
                    JSON.stringify(textStatus) + "\n" + JSON.stringify(errorThrown));

            });
        }
    },
    /**
     * selezione quale idn Cdc sia attivo
     * @returns {*}
     */
    selectIdenCdc : function(){
        var idenCdcLista = $("#IDEN_CDC_PS").val();
        var idenCdcContGiu =  $("#CONTGIU_CDC").val();
        if((idenCdcLista==null) || (idenCdcLista=="") || (typeof idenCdcLista=="undefined") || (idenCdcLista==undefined) || (idenCdcLista=="null") ){
           return idenCdcContGiu;
        }else{
            return idenCdcLista;
        }
    },
    selectIdenProv : function(){
        var listaAttesaProv = $("#IDEN_PROVENIENZA").val();
        var contGiuProv =  $("#CONTGIU_PROV").val();

        if(listaAttesaProv!="" && listaAttesaProv!="null" && typeof listaAttesaProv!="undefined" && listaAttesaProv!=null){
            return listaAttesaProv;
        }else{
            return contGiuProv;
        }
    },
    /**
     * Metodi Getter e Setter per i vari Json
     */

    setJsonAnagrafica : function(value){
        NS_INFO_PAZIENTE.jsonAnagrafica = value;

    },

    getJsonAnagrafica : function(){
        return NS_INFO_PAZIENTE.jsonAnagrafica;
    },

    setJsonContatto : function(value){
        NS_INFO_PAZIENTE.jsonContatto = value;
    },

    getJsonContatto : function(){
        return NS_INFO_PAZIENTE.jsonContatto;
    },

    setJsonListaAttesa : function(value){
        NS_INFO_PAZIENTE.jsonListaAttesa = value;
    },

    getJsonListaAttesa : function(){
        return NS_INFO_PAZIENTE.jsonListaAttesa
    },

    setJsonLocazione : function(value){
        NS_INFO_PAZIENTE.jsonLocazione = value;
    },

    getJsonLocazione : function(){
        return NS_INFO_PAZIENTE.jsonLocazione
    },
    DATI_AMMINISTRATIVI : {
        dataIngresso : jsonData.DATA_INGRESSO,
        problemaPrincipale :jsonData.PROBLEMA_PRINCIPALE
    },
    initJsonModuli : function(iden_cdc){
        var iden = iden_cdc !== '' && typeof iden_cdc !== 'undefined' ? iden_cdc : NS_INFO_PAZIENTE.jsonLocazione.IDEN;
        if(typeof iden === 'undefined' || iden === '' ){

            alert("initJsonModuli con iden cdc null");

        }else{
            home.NS_FUNZIONI_PS.caricaJsonModuli(iden);
        }

    }

};