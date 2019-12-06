var FIRMA_PS =
{
    setDati : function(dati){
        this.dati = dati;
        NS_FENIX_FIRMA.LOGGER.debug("Dati - " + JSON.stringify(this.dati));
    },

    getDati : function(nome){
        return (this.dati[nome]) ? this.dati[nome] : "";
    },

    initAnteprima : function()
    {
        logger.debug("FIRMA_PS.initAnteprima" );

        $("#fldInfoDocumento").hide();
        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniRitornaWk").hide();
        $("#fldFunzioniSISS").hide();
        $("#fldFunzioniModuli").hide();
        $("#fldFunzioniStampa").hide();

        return true;
    },

    initFirma : function(params)
    {
        logger.debug("FIRMA_PS.initFirma");
        var $this = this;

        $this.chiudiButton = NS_FENIX_PRINT.chiudi;
        NS_FENIX_PRINT.chiudi = $this.chiudi;
        NS_FENIX_PRINT.printParam = params.STAMPA;
        /*logger.debug(" NS_FENIX_PRINT.config -> " + params.STAMPA.afterStampa )
        NS_FENIX_PRINT.config = params.STAMPA;*/

        $this.setDati(params.FIRMA);


        home.NS_FENIX_PRINT.apri({'beforeApri':function(params){return true;}});
        home.NS_FENIX_PRINT.caricaDocumento(params.STAMPA);

        $("#txtPin").off().on('keypress',function(event) { if (event.keyCode == 13){ $("#butFirma").trigger("click");} }).focus();
        $("#butChiudi").off("click").on("click",function(){ $this.chiudi(); });

        this.initAnteprima();

        $("#fldFunzioniFirma").show();

        if (typeof $this.getDati("CALLBACK") == "function") {
            $this.getDati("CALLBACK")();
        }

        return true;
    },

    initValida : function(params){},
    beforeValida : function(param){return true;},
    beforeChiudi : function(){return true;},
    valida : function (param){},
    okValida : function(resp){},
    koValida : function(resp){},

    beforeFirma : function(param)
    {
        NS_LOADING.showLoading({"timeout" : 0});

        var idFromSmartcard = appletFenix.getSmartCardID();

        if(baseUser.ID_SMART_CARD != idFromSmartcard)
        {
            NS_LOADING.hideLoading();
            NOTIFICA.error({message: "Smart Card non associata all'utente loggato. Verificare!", title: "Error!", timeout: 3});
            return false;
        }

        return true;
    },

    firma : function (param)
    {
        NS_FENIX_FIRMA.LOGGER.debug("Inizio Processo di Firma - Time " + new Date().getTime());

        if(!this.beforeFirma(param)) {
            return false;
        }

        var resp = appletFenix.firma(param['pin']);

        resp.status === "OK" ? setTimeout(function(){FIRMA.okFirma(resp);},100) : this.koFirma(resp);
    },

    okFirma : function(resp)
    {
        logger.debug("FIRMA_PS.okFirma" );
        NS_FENIX_FIRMA.LOGGER.info("Documento Firmato con Successo - Time " + new Date().getTime());
        this.archiviaDocumento(resp);

    },

    koFirma : function(resp)
    {
        NS_LOADING.hideLoading();

        if (resp.status === "FF") {
            NOTIFICA.error({message: "Pin Errato!", title: "Error!", timeout: 3});
        } else {
            NS_FENIX_FIRMA.LOGGER.error("KO Firma - Errore Durante la Firma - message " + JSON.stringify(resp));
        }
    },

    getDatiArchivia:function(resp)
    {
        var jsonArchivia = {
            success : true,
            fileBase64 : appletFenix.getDocumentBase64()
        };

        jsonArchivia.success = LIB.isValid(jsonArchivia.fileBase64) ? true : false;

        return jsonArchivia;
    },

    archiviaDocumento: function (resp) {

        var $this = this;
        var jsonDocumento = $this.getDatiArchivia();

        NS_FENIX_FIRMA.LOGGER.debug("Archivia Documento - Init Processo - parametri " + JSON.stringify(resp) + " - Time " + new Date().getTime());

        if (!LIB.isValid(jsonDocumento.fileBase64)) {
            return home.NOTIFICA.error({message: "Errore Generazione Base 64 Pdf!", title: "Error", timeout: 6});
        }

        var parameters =
        {
            "P_KEY_TABELLA" : {t : "V", v : $this.getDati("TABELLA"), d : 'I'},
            "P_KEY_TABELLA_IDEN" : {t : "N", v : $this.getDati("IDEN_VERSIONE"), d : 'I'},
            "P_TIPO_DOCUMENTO" : {t : "V", v : $this.getDati("TIPO_DOCUMENTO"), d : 'I'},
            "P_URL_DOCUMENTO" : {t : 'V', v : "ND", d : 'I'},
            "P_PDF_BASE64" : {t : "C", v : jsonDocumento.fileBase64, d : 'I'},
            "P_RESULT" : {t : 'V', d : 'O'}
        };

        // La prima Firma NON ha alcun precedente da disattivare.
        // Devo gestire la casistica per non mandare in errore NS_DB
        if ($this.getDati("IDEN_VERSIONE") !== null) {
            parameters.P_IDEN_DISATTIVARE = {t : 'N' , v : $this.getDati("IDEN_VERSIONE_PRECEDENTE"), d : 'I'};
        }

        var db = home.$.NS_DB.getTool({setup_default:{datasource:'ADT'}});

        var xhr =  db.call_procedure(
            {
                id: 'FX$PCK_DOCUMENTI.INSERISCI_VERSIONE',
                parameter : parameters
            });

        xhr.done(function (data, textStatus, jqXHR) {

            var resp = JSON.parse(data['P_RESULT'].split('|')[1]);

            resp.success ? $this.okArchiviaDocumento(resp) : $this.koArchiviaDocumento(resp);
        });

        xhr.fail(function (response) {
            $this.koArchiviaDocumento(response);
        });

    },

    okArchiviaDocumento : function(resp)
    {
        NS_FENIX_FIRMA.LOGGER.info("OK Archivia Documento - Archiviazione Documento Avvenuta con Successo - Time " + new Date().getTime());
        this.attivaVersione(resp);
    },

    koArchiviaDocumento : function(resp)
    {
        NS_LOADING.hideLoading();
        NS_FENIX_FIRMA.LOGGER.error("KO Archivia Documento - Errore Durante Archiviazione Documento - message " + JSON.stringify(resp));
        NOTIFICA.error({message: "Errore Procedura Archiviazione Documento", title: "Error", timeout: 6});
    },

    getDatiAttivaVersione : function(resp){

        var $this = this;
        var p =
        {
            "P_KEY_TABELLA" : {t : "V", v : $this.getDati("TABELLA"), d : 'I'},
            "P_KEY_TABELLA_IDEN" : {t : "N", v : $this.getDati("IDEN_VERSIONE"), d : 'I'},
            "P_RESULT" : {t : 'V', d : 'O'}
        };

        return p;
    },

    attivaVersione: function (resp) {

        var $this = this;
        var p = $this.getDatiAttivaVersione(resp);
        var db = home.$.NS_DB.getTool({setup_default:{datasource:'ADT'}});

        NS_FENIX_FIRMA.LOGGER.debug("Inizio Processo di Attivazione Documento - parametri " + JSON.stringify(p) + " Time " + new Date().getTime());

        var xhr =  db.call_procedure(
            {
                id: 'FX$PCK_DOCUMENTI.ATTIVA_VERSIONE',
                parameter : p
            });

        xhr.done(function (data, textStatus, jqXHR) {
            var resp = JSON.parse(data['P_RESULT'].split('|')[1]);

            NS_FENIX_FIRMA.LOGGER.debug("attivaVersione per iden " + $this.getDati("IDEN_VERSIONE") + " della tabella " + $this.getDati("TABELLA") + " : " + JSON.stringify(data));

            resp.success ? $this.okAttivaVersione(resp) : $this.koAttivaVersione();
        });

        xhr.fail(function (response) {
            $this.koAttivaVersione();
        });

    },

    okAttivaVersione : function(resp)
    {
        this.dati.FIRMA_COMPLETA = true;

        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniRitornaWk").hide();
        $("#fldFunzioniStampa").show();

        $("#txtPin").val("");
        $("#txtPassword").val("");

        NS_LOADING.hideLoading();

        NS_FENIX_FIRMA.LOGGER.debug("Attivazione Documento Avvenuta con Successo - Time " + new Date().getTime());
        NOTIFICA.success({message: 'Firma Documento Avvenuta con Successo', timeout: 3, title: 'Success', width : 220});
    },

    koAttivaVersione : function()
    {
        NS_LOADING.hideLoading();
        NOTIFICA.error({message: "Errore Durante Attivazione Versione", title: "Error"});
    },

    chiudiAnteprima : function(cbk) {

        logger.debug("FIRMA_PS.chiudiAnteprima" );
        this.dati = {};

        $("#butChiudi").off("click").on("click", function (){NS_FENIX_PRINT.chiudi({}); });
        $("#fldFunzioniFirma").show();
        $('#fldFunzioniStampa').hide();

        $("#stampa").removeClass("visible").addClass("invisible");

        $("#txtPin").val("");
        $("#txtPassword").val("");

        if (typeof cbk == "function") {
            cbk();
        }

    },

    /**
     * Ridefinizione della funzione di chiusura della console di firma.
     * Verifica che la firma sia andata a buon fine e se si tratta della prima firma del documento.
     * Se l'anteprima non viene completata e stiamo firmado una versione successiva alla prima viene effettuato il rollback.
     */
    chiudi : function(){
        logger.debug("FIRMA_PS.chiudi" );

        var $this = this;
        if($this.beforeChiudi()){

            NS_FENIX_PRINT.chiudi = $this.chiudiButton;

            if (!$this.dati.FIRMA_COMPLETA && !$this.dati.PRIMA_FIRMA)
            {
                $this.rollback();
            }

            $this.chiudiAnteprima();
        }

    },

    /**
     * Wrapper temporaneo della funzione di chiusura dell'anteprima di stampa/firma.
     * Se firmo alla chiusura devo intercettare se la firma è completa o se si tratta della prima firma.
     */
    chiudiButton : function(){},

    /**
     * Funzione invocata in caso di errore durante il processo di firma o archiviazione.
     * Viene ridefinita ogni volta in base al documento che si intende firmare.
     */
    rollback : function(){}
};
var FIRME_PS = {
    showInvia : 'N',

    MODULI :
    {
        okFirma : function(resp){
            logger.debug("FIRME_PS.okFirma" );

            if( NS_FIRMA_MODULI["IDEN_SCHEDA"] != ''){
                home.NS_FENIX_PS.IDEN_SCHEDA = NS_FIRMA_MODULI["IDEN_SCHEDA"];

            }
            //home.NS_MODULISTICA_FUNZIONI_COMUNI.insertDataInvio = NS_MODULISTICA_FUNZIONI_COMUNI.insertDataInvio;


            if(home.baseUserModuliReport.hasOwnProperty(this.getDati("TIPO_DOCUMENTO")) && home.baseUserModuliReport[this.getDati("TIPO_DOCUMENTO")].DA_INVIARE == 'S'){
                $("#fldFunzioniModuli").show();

                home.$("#butChiudi").off("click").on("click",function(){
                    NOTIFICA.error({message: "Impossibile chiudere, inviare il modulo prima", title: "Error!", timeout: 3, width : 220});

                });
            }

            this.archiviaDocumento(resp);


        },
        beforeChiudi :  function (){
            logger.debug("FIRME_PS.beforeChiudi" );

            this.showInvia = 'N';
            $("#fldFunzioniModuli").hide();
            this.okFirma = function(resp){ this.archiviaDocumento(resp); };

            home.NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica(home.NS_FIRMA_MODULI.NS_LISTA_CHIUSI, false, function(){ home.NS_LOADING.hideLoading();});
            return true;
        } ,
        initAnteprima : function (p){
            logger.debug("FIRME_PS.initAnteprima" );

            $("#fldInfoDocumento").hide();
            $("#fldFunzioniValida").hide();
            $("#fldFunzioniRitornaWk").hide();
            $("#fldFunzioniSISS").hide();
            $("#fldFunzioniStampa").hide();

            $("#fldFunzioniFirma").show();


            logger.debug("MOSTRA BOTTONE INVIO -> "+ this.showInvia);

            if( this.showInvia == 'S' && home.baseUserModuliReport.hasOwnProperty(this.getDati("TIPO_DOCUMENTO")) && home.baseUserModuliReport[this.getDati("TIPO_DOCUMENTO")].DA_INVIARE == 'S'){
                $("#fldFunzioniModuli").show();
            } else{
                $("#fldFunzioniModuli").hide();
            }

            $("#butInvia").off("click").on("click", function(){

                NS_LOADING.showLoading({"timeout": "0", "testo": "INVIO MODULO", "loadingclick": function () {
                    NS_LOADING.hideLoading();
                }});

                logger.debug("INVIO MODULO CON IDEN_SCHEDA -> " + home.NS_FENIX_PS.IDEN_SCHEDA);

                if(home.NS_FENIX_PS.IDEN_SCHEDA == '' || typeof home.NS_FENIX_PS.IDEN_SCHEDA == 'undefined'){
                    home.NS_LOADING.hideLoading();

                    logger.error("home.NS_FENIX_PS.IDEN_SCHEDA è undefined o nullo");
                    home.NOTIFICA.error({message: "Errore nell'invio del documento", title: 'error',width : 220});
                    return;
                }
                home.FIRMA.insertDataInvio({
                    IDEN_SCHEDA: home.NS_FENIX_PS.IDEN_SCHEDA,
                    callback : function(){
                        $("#butChiudi").off("click").on("click",function(){ home.FIRMA.chiudi(); });

                        home.NOTIFICA.success({message: "Documento inviato correttamente", timeout: 4, title: 'Success',width : 220});
                        home.NS_LOADING.hideLoading();
                    }

                });

            });

            logger.debug("fine - initAnteprima");
            return true;
        },
        /**
         * @param par JSON
         * expected JSON.IDEN_SCHEDA
         * opzionale JSON.callback
         * */
        insertDataInvio : function (par) {
            logger.debug("NS_PS_PRINT.insertDataInvio");

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

    }
};