var NS_DATI_PAZIENTE ={

    getDatiContatto:function(tipo, param, params){
        /*param è l'iden contatto/ codicevo vuoto
         * params invece è un json strutturato così
         * {
         *     [contattiGiuridici]: <numero dei contatti giuridici da tirare su>,
         *     [contattiAssistenziali]: <numero dei contatti assistenziali da tirare su>
         *     [assigningAuthorityArea]: <l'assigningAuthorityArea da mettere davanti alla chiamata alle servlet di default valorizzo adt>
         * }
         * se questo json è vuoto o nullo li tira su tutti
         * */

        NS_DATI_PAZIENTE.initLogger();

        var url;
        var dataContatto = {};

        //se non esiste lo valorizzo vuoto
        if(typeof params == 'undefined'|| params==null){
            params = {contattiGiuridici:'',contattiAssistenziali:'', assigningAuthorityArea : 'adt'};
        }

        //retrocompatibilità se non glielo passo di default ci metto adt
        if(typeof params.assigningAuthorityArea == 'undefined'){params.assigningAuthorityArea = 'adt';}

        logger.debug('contatto.js -> assigningAuthorityArea -> ' + params.assigningAuthorityArea);

        switch(tipo) {
            case 'CODICE' :
                url = params.assigningAuthorityArea + '/GetContattoByCodice/string/'+param;
                break;
            case 'IDEN_CONTATTO':
                url = params.assigningAuthorityArea + '/GetContattoById/string/'+param;
                break;
            case 'EMPTY':
                url = params.assigningAuthorityArea + '/GetContattoVoid/string/';
                break;
        }


        $.ajax({
            url: url + "?ts=" + new Date().getTime(),
            dataType:'json',
            cache : false,
            error:function(jqXHR, textStatus, errorThrown){
                logger.error(' jqXHR: ' + jqXHR + '\n textStatus: ' + textStatus + '\n errorThrown: ' + errorThrown);
				logger.error("contatto undefined provare questa url nel browser ->  "+ url);
                home.NOTIFICA.error({message: "Errore contattare l'assistenza", title: "Error"});
                return;
            },
            success:function(data){

                if (data.success){
                    dataContatto =  data.contatto;
                }else{
                    logger.error(JSON.stringify(data));
                    logger.error("contatto undefined provare questa url nel browser ->  "+ url);
                    return home.NOTIFICA.error({message: "Errore contattare l'assistenza", title: "Error"});
                }

            },
            async:   false

        });

        if(typeof dataContatto == 'undefined'){
            logger.error("contatto undefined provare questa url nel browser ->  "+ url);
            return home.NOTIFICA.error({message: "Errore contattare l'assistenza", title: "Error"});
        }
        //nel caso di presa in carico i segnmenti non ci sono ancora ritorno il contatto così com'è
        if(typeof dataContatto.contattiGiuridici=='undefined'|| typeof dataContatto.contattiAssistenziali == 'undefined'){
            return dataContatto;
        };

        //se è vuoto lo tiro su tutto
        if(typeof params.contattiGiuridici == 'undefined' || params.contattiGiuridici=='' ){params = {contattiGiuridici : dataContatto.contattiGiuridici.length}};
        if(typeof params.contattiAssistenziali == 'undefined' ||params.contattiAssistenziali==''){params = {contattiAssistenziali : dataContatto.contattiAssistenziali.length}};

        //ora ho params.contattiGiuridici & params.contattiAssistenziali valorizzati

        dataContatto.contattiGiuridici = dataContatto.contattiGiuridici.slice(dataContatto.contattiGiuridici.length - params.contattiGiuridici ,dataContatto.contattiGiuridici.length);
        dataContatto.contattiAssistenziali = dataContatto.contattiAssistenziali.slice(dataContatto.contattiAssistenziali.length - params.contattiAssistenziali ,dataContatto.contattiAssistenziali.length);

        return dataContatto;
    },

    getDatiContattobyIden:function(iden, params){
        //si aspetta l'iden di contatti
        return NS_DATI_PAZIENTE.getDatiContatto('IDEN_CONTATTO',iden, params);
    },
    getDatiContattoByCodice:function(codice, params){
        //si aspetta il numero nosologico o numero di cartella
        return NS_DATI_PAZIENTE.getDatiContatto('CODICE',codice, params);
    },

    getContattoEmpty:function(params){

        /*
         * params
         * [assigningAuthorityArea]:<valore>
         */

        if(typeof params == 'undefined'|| params==null){
            params = {contattiGiuridici:'',contattiAssistenziali:'', assigningAuthorityArea : 'adt'};
        }

        var json = NS_DATI_PAZIENTE.getDatiContatto('EMPTY', params);

        /* default settings */
        json.codice.assigningAuthority = 'FENIX';
        json.codice.assigningAuthorityArea = params.assigningAuthorityArea.toUpperCase();
        json.deleted= false;
        json.contattiGiuridici[0].uteInserimento.id = (typeof  document.getElementById('USER_IDEN_PER').value != 'undefined')? document.getElementById('USER_IDEN_PER').value: home.baseUser.IDEN_PER;
        json.contattiAssistenziali[0].uteInserimento.id = (typeof  document.getElementById('USER_IDEN_PER').value != 'undefined')? document.getElementById('USER_IDEN_PER').value: home.baseUser.IDEN_PER;

        return json;

    },
    getContattoGiuridicoEmpty:function(){
        return NS_DATI_PAZIENTE.getContattoEmpty().contattiGiuridici[0];
    },
    getContattoAssistenzialeEmpty:function(){
        return NS_DATI_PAZIENTE.getContattoEmpty().contattiAssistenziali[0];
    },
    getStructureA02Empty: function(){
        var json = NS_DATI_PAZIENTE.getContattoEmpty('EMPTY', null);
        return json;

    },
    updatePatientInformation:function(jsoncontatto){
        var resp={}
        $.ajax({
            url: 'adt/UpdatePatientInformation/json/'+JSON.stringify(jsoncontatto),
            dataType: 'json',
            error: function(data) {
                resp.status = false;
                resp.error = data.message;
            },
            success:function(data,status){
                if(data.success){
                    resp.status = true;
                }else{
                    resp.status = false;
                    resp.error = data.message;
                }
            }
        })
        return resp;
    } ,
    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value));
    },

    isPresoInCarico : function(jsonGiuridici,jsonAssistenziali){
        return ((0!==jsonGiuridici.length)||(0!==jsonAssistenziali.length))
    },
    initLogger : function()
    {
        home.NS_CONSOLEJS.addLogger({name:'NS_CONTATTO', console:0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_CONTATTO'];
    }



}

