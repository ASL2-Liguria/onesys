
var NS_FUNZIONI_PS = {
    /**
     * hasAValue : ritorna true se possiede un valore
     * @param value
     * @returns {boolean}
     */
    hasAValue : function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("null" !== value) && (typeof undefined !== value) && ("undefined" !== value));
    },
    /**
     * isANumber : ritorna true se il valore passato e' di tipo number
     * @param value
     * @returns {boolean|*}
     */
    isANumber : function (value) {
        return ( (!isNaN(value)) && (NS_FUNZIONI_PS.hasAValue(value)) );
    },
    /**
     * checkdatiaccesso : controlla se sono presenti dei dati associati al nosologico
     * @param codiceContatto
     * @param callbackOK
     * @param callbackKO
     */
    hasDatiAccesso : function (codiceContatto,callbackOK, callbackKO) {

        var numeroRisposta = "";
        var db = $.NS_DB.getTool({setup_default: {datasource: "WHALE", async: false}});

        var xhr = db.select({
            id: "CCE.CHECKDATICARTELLA",
            parameter: { "NOSOLOGICO": codiceContatto }
        });

        xhr.done(function (resp) {
            //esempio resp = {"result":[{"NUM":"0"}]}
            numeroRisposta = Number(resp.result[0].NUM);

            if (NS_FUNZIONI_PS.isANumber(numeroRisposta) && (0 < numeroRisposta)) {

                logger.debug("checkdatiaccesso : ii contatto ha dei dati associati ");
                if(typeof callbackOK === "function"){callbackOK(numeroRisposta);}
            }
            else {
                logger.error("checkdatiaccesso : nessun dato presente");
                if(typeof callbackKO === "function"){callbackKO(numeroRisposta);}
            }

        });

        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("checkdatiaccesso : " + JSON.stringify(jqXHR) + "\n" + JSON.stringify(errorThrown) + "\n" + JSON.stringify(textStatus));
            if(typeof callbackKO === "function"){callbackKO(numeroRisposta);}
        });

    },
    /**
     * isRepartoUrgenza : controlla se il reparto passato fa parte dei reparti medicina d'urgenza impostati su
     * CONFIG_WEB.PARAMETRI con nome=reparti.medicina_urgenza
     * @param reparto
     * @returns {boolean}
     */
    isRepartoUrgenza : function (reparto) {

        var controllo = false,
            arrayRepartiUrg = $.parseJSON(home.baseGlobal["reparti.medicina_urgenza"]);

        reparto = Number(reparto);

        if (NS_FUNZIONI_PS.isANumber(reparto) && NS_FUNZIONI_PS.hasAValue(arrayRepartiUrg)) {

            for(var i=0; i<arrayRepartiUrg.length && controllo===false; i++) {

                var RepartoUrg = Number(arrayRepartiUrg[i]);

                if (NS_FUNZIONI_PS.isANumber(RepartoUrg) && (RepartoUrg === reparto) ) { controllo=true; }

            }

        } else {
            logger.error("isRepartoUrgenza : Errore\n reparto="+reparto+"\n arrayRepartiUrg="+arrayRepartiUrg);
        }

        logger.debug("isRepartoUrgenza : "+reparto + " reparto urgenza = " + controllo);

        return controllo;
    },
    caricaJsonModuli : function (iden) {
        //funzione che crea il json dei moduli

        var baseUserModuli = {};
        var baseUserModuliReport = {};
        function callbackok (resp) {

            var result = resp.result;
            $.each(result, function (k,v){
                if(typeof baseUserModuli[result[k].TIPO] == 'undefined'){
                    baseUserModuli[result[k].TIPO] = {};
                }
                baseUserModuli[result[k].TIPO][result[k].KEY_SCHEDA] =  $.extend(baseUserModuli[result[k].TIPO][result[k].KEY_SCHEDA], result[k]);
                baseUserModuliReport[result[k].NOME_REPORT] = result[k];
            });

            home.baseUserModuli = baseUserModuli;
            home.baseUserModuliReport = baseUserModuliReport;
            logger.debug("JSON moduli caricato correttamente per cdc -> " +iden);

        }

        var par = {
            datasource : 'PS',
            id : 'CONTATTO.Q_CDC_MODULI',
            params : {IDEN_CDC : {t:'N', v:iden} },
            callbackOK : callbackok
        };

        NS_CALL_DB.SELECT(par);


    }

};
home.NS_FUNZIONI_PS = NS_FUNZIONI_PS;