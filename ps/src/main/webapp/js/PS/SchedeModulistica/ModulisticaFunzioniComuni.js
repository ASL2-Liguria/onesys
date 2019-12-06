var NS_MODULISTICA_FUNZIONI_COMUNI = {

    refreshModulistica : function(apertoDaGestioneEsito, chiudiDopo, funzioniCartella){

        chiudiDopo = typeof chiudiDopo === 'undefined' ? true : chiudiDopo;

        try {
            /* Aperto da Dentro la cartella */
            if (apertoDaGestioneEsito==="N")
            {
                if(typeof funzioniCartella == 'function'){ funzioniCartella(); }
                home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
                home.CARTELLA.NS_REFERTO.apriModulistica();
                if(chiudiDopo) NS_FENIX_SCHEDA.chiudi();
            }
            /* Aperto da gestione esito */
            else if (apertoDaGestioneEsito==="S")
            {

                home.$("#iScheda-1")[0].contentWindow.document.location.replace(home.$("#iScheda-1")[0].contentWindow.document.location);
                //home.$("#iScheda-1")[0].contentWindow.document.location.reload()
                if(chiudiDopo) NS_FENIX_SCHEDA.chiudi();
            }
            else{
                logger.error("NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica : Parametro ApertoDaGestioneEsito non valorizzato correttamente");
            }
        }
        catch(e){
            logger.debug(e);
        }
    } ,

    setDataStampaDB: function(moduloStampa, params){

        // moduliStampa = moduliStampa + ',DEFAULT';

        var dbParams = {
            "pModuli": {v: String(moduloStampa), t: "V" },
            "pIdenContatto": {v: Number(params.idenContatto), t: "N"},
            "pUtente":{v: Number(params.utente), t: "N"},
            "pStato":{d: "O", t : "V"},
            "pIdenScheda":{d: "O", t : "N"}

        };

        var par =
        {
            datasource: "PS",
            id: "SET_DATA_STAMPA_SINGOLO",
            params: dbParams,
            callbackOK : callbackOk
        }

        function callbackOk () {
            if (typeof params.callback == "function") {
                params.callback(params.parCallback);
            }
        }
        NS_CALL_DB.PROCEDURE(par);
    },
    /**
     * @param par JSON
     * expected JSON.IDEN_SCHEDA
     * opzionale JSON.callback
     * */
    insertDataInvio : function (par) {
        var callback = function(){};
        if(typeof par.callback == 'function'){
            callback =  par.callback;
        }

        var parameters = {
            datasource : 'PS',
            id : 'PS.INSERISCI_EVENTO_INVIO_MODULO',
            params : {IDEN_SCHEDA : par.IDEN_SCHEDA},
            callbackOK :callback
        };

        home.NS_CALL_DB.BLOCK_ANONYMOUS(parameters);
    }

};

/**
 * Created by matteo.pipitone on 20/10/2015.
 */

var NS_FIRMA_MODULI = {

    IDEN_CONTATTO : null,
    REPORT : null,
    STATO_VERBALE: null,
    IDEN_SCHEDA:null,
    DOCUMENTO: null,
    NS_LISTA_CHIUSI : $("#LISTA_CHIUSI").val(),
    callback : null,
    /**
     * p
     * {
     *    "STAMPA" : {"PRINT_REPORT":NS_FIRMA_MODULI.getReport(), "PRINT_DIRECTORY": "1", "PRINT_PROMPT": prompts},
     *    "FIRMA" : {}
     * }*/
    firmaGenericaModuli : function (p){
        //  NS_FIRMA_MODULI.setIdenContatto($("#IDEN_CONTATTO").val());
        //default parameters

        home.NS_FENIX_PRINT.config = {};


        home.FIRMA = $.extend({},home.FIRMA, home.FIRME_PS["MODULI"]);

        //alert(NS_FIRMA_MODULI.getStatoVerbale());
        //alert(NS_FIRMA_MODULI.getIdenContatto());
        //alert(NS_FIRMA_MODULI.getReport());
        //alert(NS_FIRMA_MODULI.getIdenScheda());
        //alert(NS_FIRMA_MODULI.getDocumento());
        //alert(NS_FIRMA_MODULI.getListaChiusi());

        /*
        if (typeof pConfig !== "undefined") {
            home.NS_FENIX_PRINT.config = $.extend({},home.NS_FENIX_PRINT.config,JSON.parse(p));
        }
        */

        if (typeof p == 'undefined'){

            logger.debug(JSON.stringify(home.FIRMA_PS));

            var prompts = "&promptpIdenContatto=" + NS_FIRMA_MODULI.getIdenContatto() + '&promptpFirma=S'+ '&promptpStatoVerbale=';
            prompts += NS_FIRMA_MODULI.getStatoVerbale() === "F" ? "E" : "R";
            prompts += "&promptpStatoModulo=";
            prompts += NS_FIRMA_MODULI.getStatoVerbale() === "F" ? "E" : "R";

            p = {
                "STAMPA" : {"PRINT_REPORT":NS_FIRMA_MODULI.getReport(), "PRINT_DIRECTORY": "1", "PRINT_PROMPT": prompts},
                "FIRMA" : {}
            };
        }else{
            logger.debug(JSON.stringify(p));
            home.NS_FENIX_PRINT.config = $.extend({},home.NS_FENIX_PRINT.config,p);

        }

        p['STAMPA'].afterStampa = function(){
            logger.debug("afterStampa - Init");
            NS_MODULISTICA_FUNZIONI_COMUNI.setDataStampaDB(
                NS_FIRMA_MODULI.getDocumento(),
                {
                    "idenContatto":NS_FIRMA_MODULI.getIdenContatto(),
                    "callback":function(){},
                    "parCallback":{},
                    "utente":home.baseUser.IDEN_PER
                }
            );
        };

        p['FIRMA'].FIRMA_COMPLETA = false;
        p['FIRMA'].PRIMA_FIRMA = true;
        p['FIRMA'].IDEN_VERSIONE =  NS_FIRMA_MODULI.getIdenScheda();
        p['FIRMA'].IDEN_VERSIONE_PRECEDENTE = null;
        p['FIRMA'].TIPO_DOCUMENTO =  NS_FIRMA_MODULI.getDocumento();
        p['FIRMA'].TABELLA =  "PRONTO_SOCCORSO.PS_SCHEDE_XML";
        p['FIRMA'].KEY_CONNECTION = "PS";
        p['FIRMA'].CALLBACK = function(){
            NS_FIRMA_MODULI.getCallback()();
        };

		logger.debug("test prima di aprire firma");
		logger.debug("typeof p['STAMPA'].afterStampa -> " + typeof p['STAMPA'].afterStampa);

        if(home.NS_FIRMA_MODULI.STATO_VERBALE == 'F'){
            logger.debug("Imposto show invia = 'S' ");
            home.FIRMA['showInvia'] = 'S';
        }

        home.FIRMA.initFirma(p);


    },

    setIdenContatto : function (idenContatto){
        home.NS_FIRMA_MODULI.IDEN_CONTATTO = idenContatto;
    },
    getIdenContatto : function (){
        return home.NS_FIRMA_MODULI.IDEN_CONTATTO;
    },
    setReport : function (report){
        home.NS_FIRMA_MODULI.REPORT = report;
    },
    getReport : function (){
        return home.NS_FIRMA_MODULI.REPORT;
    },
    setStatoVerbale : function (statoVerbale){
        home.NS_FIRMA_MODULI.STATO_VERBALE = statoVerbale;
    },
    getStatoVerbale : function (){
        return home.NS_FIRMA_MODULI.STATO_VERBALE;
    },
    setIdenScheda : function (idenScheda){
        home.NS_FIRMA_MODULI.IDEN_SCHEDA = idenScheda;
    },
    getIdenScheda : function (){
        return home.NS_FIRMA_MODULI.IDEN_SCHEDA;
    },
    setDocumento : function (documento){
        home.NS_FIRMA_MODULI.DOCUMENTO = documento;
    },
    getDocumento : function (){
        return home.NS_FIRMA_MODULI.DOCUMENTO;
    },
    setListaChiusi : function (listaChiusi){
        home.NS_FIRMA_MODULI.NS_LISTA_CHIUSI = listaChiusi;
    },
    getListaChiusi : function (){
        return home.NS_FIRMA_MODULI.NS_LISTA_CHIUSI;
    },
    setCallback : function (callback){
        home.NS_FIRMA_MODULI.callback = callback;
    },
    getCallback : function (){
        return home.NS_FIRMA_MODULI.callback;
    }

};

home.NS_FIRMA_MODULI = NS_FIRMA_MODULI;
home.NS_MODULISTICA_FUNZIONI_COMUNI = NS_MODULISTICA_FUNZIONI_COMUNI;
