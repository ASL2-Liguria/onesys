var NS_DATI_CONTATTO_PS = {
    /**
     * param è l'iden_contatto o codice(nosologico), a seconda del tipo
     * params invece è un json strutturato così
     * {
     *     contattiGiuridici: <numero dei contatti giuridici da tirare su>,
     *     contattiAssistenziali: <numero dei contatti assistenziali da tirare su>
     * }
     * se questo json è vuoto o nullo li tira su tutti
     * @param tipo
     * @param param
     * @param params
     * @returns {*}
     */
    getDatiContatto: function (tipo, param, params) {

        home.NS_CONSOLEJS.addLogger({name: 'Triage', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['Triage'];

        var url;
        var dataContatto = {};

        if(!NS_DATI_CONTATTO_PS.hasAValue(param)) logger.error("NS_DATI_CONTATTO_PS.getDatiContatto param is undefined");

        if(!NS_DATI_CONTATTO_PS.hasAValue(params)) params = {contattiGiuridici: '', contattiAssistenziali: ''};

        switch (tipo) {
            case 'CODICE' :
                url = 'ps/GetContattoByCodice/string/' + param;
                break;
            case 'IDEN_CONTATTO':
                url = 'ps/GetContattoById/string/' + param;
                break;
            case 'EMPTY':
                url = 'ps/GetContattoVoid/string/';
                break;
            default:
                logger.warning("NS_DATI_CONTATTO_PS.getDatiContatto tipo is undefined or unknown: " + tipo);
                break
        }

        $.ajax({
            url: url + "?ts=" + new Date().getTime(),
            dataType: 'json',
            async: false,
            data:  'PS',
            error: function (data) {
                logger.error("NS_DATI_CONTATTO_PS.getDatiContatto" + JSON.stringify(data));

            },
            success: function (data) {
                if(NS_DATI_CONTATTO_PS.hasAValue(data)){
                    logger.info("NS_DATI_CONTATTO_PS.getDatiContatto success with contatto : "+JSON.stringify(data.contatto.id));
                    dataContatto = data.contatto;

                }else{
                    logger.error("NS_DATI_CONTATTO_PS.getDatiContatto: "+JSON.stringify(data));
                }
            }
        });


        if (!NS_DATI_CONTATTO_PS.isPresoInCarico(dataContatto.contattiGiuridici,dataContatto.contattiAssistenziali)){
            logger.warning("contatto : "+ dataContatto.iden +" non ancora preso in carico" );
            return dataContatto;
        }

        if (!NS_DATI_CONTATTO_PS.hasAValue(params.contattiGiuridici))
            params = {contattiGiuridici: dataContatto.contattiGiuridici.length}

        if (!NS_DATI_CONTATTO_PS.hasAValue(params.contattiAssistenziali))
            params = {contattiAssistenziali: dataContatto.contattiGiuridici.length}

        dataContatto.contattiGiuridici = dataContatto.contattiGiuridici.slice(dataContatto.contattiGiuridici.length - params.contattiGiuridici, dataContatto.contattiGiuridici.length);
        dataContatto.contattiAssistenziali = dataContatto.contattiAssistenziali.slice(dataContatto.contattiAssistenziali.length - params.contattiAssistenziali, dataContatto.contattiAssistenziali.length);

        return dataContatto;
    },
    /**
     * ritorna il json del contatto completo
     * @param iden => iden_contatto
     * @param params => segmenti
     * @returns {*}
     */
    getDatiContattobyIden: function (iden, params) {
        return NS_DATI_CONTATTO_PS.getDatiContatto('IDEN_CONTATTO', iden, params);
    },
    /**
     * ritorna il json del contatto completo
     * @param codice => codice (num_nosologico)
     * @param params => segmenti
     * @returns {*}
     */
    getDatiContattoByCodice: function (codice, params) {
        //si aspetta il numero nosologico o numero di cartella
        return NS_DATI_CONTATTO_PS.getDatiContatto('CODICE', codice, params);
    },
    /**
     * crea il json vuoto del contatto
     * @returns {*}
     */
    getContattoEmpty: function () {
        var json = NS_DATI_CONTATTO_PS.getDatiContatto('EMPTY', null);

        json.codice.assigningAuthority = 'FENIX';
        json.codice.assigningAuthorityArea = 'PS';
        json.deleted = false;

        return json;
    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value));
    },

    isPresoInCarico : function(jsonGiuridici,jsonAssistenziali){
        return ((0!==jsonGiuridici.length)||(0!==jsonAssistenziali.length))
    }

};

