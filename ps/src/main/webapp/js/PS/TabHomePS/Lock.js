/**
 * Created by matteo.pipitone on 06/05/2015.
 */

var NS_LOCK = {
    bloccaCartella : function (params){
        /**
         * idenContatto : idenContatto da bloccare
         * callbackOK : funzione da chiamare in success
         * [callbackKO] : funzione da chiamare in caso di KO
         * */

        NS_LOCK.lock_rows({
                p_table:"CONTATTI",
                p_iden:{v:params.idenContatto,t:'V'},
                p_username: home.baseUser.USERNAME,
                p_ip: home.basePC.IP,
                p_sito: {v:$("#SITO").val(),t:'V'},
                p_abilita_multiplo : 'false',
                p_result: {d:"O", t:"V"},
                p_message: {d:"O", t:"V"}
            }
            ,function(resp){params.callbackOK(resp);}
            , function(err, exc){
                if(LIB.isValid(params.callbackKO)){
                    params.callbackKO(err);
                }else{
                    logger.error("Errore chiamata bloccaCartella => " + JSON.stringify(err) + exc );
                }
            }
        );

    },
    checkCartella : function(params){
        /**
         * idenContatto : iden contatto da fare il check
         * callbackOK : funzione da chiamare in success
         * [callbackKO] : funzione da chiamare in caso di KO
         * */
        var par = {
            datasource : 'PS',
            id : 'PS.Q_ROWS_LOCK',
            params : {iden_contatto : {v:params.idenContatto,t:'N'}},
            callbackOK : function (resp) {

                resp = resp.result;

                if (resp == "" || resp == null || typeof resp == "undefined") {
                    params.callbackOK({isLocked: false, username: null, data_lock: null , ip: null , personale: null});

                } else {

                    var result = {isLocked: false, username: null, data_lock: null, ip: null, personale: null};

                    $.each(resp, function (k , v) {

                        if(home.baseUser.IDEN_PER !== v.IDEN_PER){
                            result.isLocked = true;
                            result.username = v.USERNAME;
                            result.data_lock = v.DATA_LOCK_VARCHAR;
                            result.ip = v.IP;
                            result.personale = v.PERSONALE;
                        }

                    });

                    params.callbackOK(result);

                }
            },
            callbackKO:function (err){
                if(LIB.isValid(params.callbackKO)){
                    params.callbackKO(err);
                }else{
                    logger.error("Errore chiamata checkCartella => " + JSON.stringify(err)  );
                }
            }
        };
        NS_CALL_DB.SELECT(par);


    },
    mandaNotifica : function (params)  {
        /**
         *  user : username a chi mandare la notifica
         *  userOpener : username di chi ha aperto la scheda
         *  callbackOK : callbackDaChiamare in caso di success
         * */

        var url = home.baseGlobal.URL_BROKER+'/fenix/message/PS';
        var param ='JMSDeliveryMode=persistent::JMSTimeToLive=36000000::type=topic::action=NOTICE::timeout=10::user='+params.user+"::title=Attenzione";
        url = 'proxy?CALL='+url + '&PARAM='+param+'&METHOD=POST&DATA_TYPE=text/xml; charset=ISO-8859-1';
        /*+ "?ts=" + new Date().getTime() */
        logger.debug(url);

        $.ajax({
            url: url,
            dataType: 'text',
            data : 'Attenzione questa cartella &egrave; stata aperta da '+params.userOpener  ,
            type : "POST",
            async: false,
            error: function (jqXHR) {
                logger.error("Errore manda notifica" + JSON.stringify(jqXHR) );

            },
            success: function () {

                logger.debug("Notifica mandata");
                if(typeof params.callbackOK != 'undefined'){
                    params.callbackOK();
                }

            }
        });
    },
    notificaLock : function (username){
        home.NOTIFICA.warning({message: 'Attenzione, Cartella gia\' bloccata da '+username , title: 'Attenzione'});

    },
    lock_rows: function(params, callbackOK, callbackKO)
        /*
         params = {
         p_table : {v:'value',t:'V'},
         p_iden : {v:'value',t:'V'}, separati da virgola
         p_username :  {v:'value',t:'V'},
         p_ip : {v:'value',t:'V'},
         p_sito :  {v:'value',t:'V'},
         p_result : {d:'O',t:'V'}
         p_message :  {d:'O',t:'V'}
         }
         */
    {
        logger.debug(JSON.stringify(params));
        var db = $.NS_DB.getTool({setup_default:{datasource:'PS',async:false}});

        var xhr = db.call_procedure({
            id: "DO_LOCK_PS",
            parameter: params
        });

        xhr.done(
            function (data, textStatus, jqXHR) {
                logger.debug('lock_rows(): ' + JSON.stringify(data) + ' chiamata con i parametri: ' + JSON.stringify(params));

                var result = data.p_result;
                var message = data.p_message;

                if(result === 'OK')
                {
                    if (typeof callbackOK === "function") {
                        callbackOK(data);
                    }
                }
                else
                {
                    if (typeof callbackKO === "function") {
                        callbackKO(message);
                    }
                }
            });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("LOCK_ROWS in errore: " + JSON.stringify(jqXHR) + " con parametri: " + JSON.stringify(params));
            if (typeof callbackKO === "function") {
                callbackKO(jqXHR, textStatus, errorThrown);
            }
        });

    }

};

var NS_UNLOCK = {
    sbloccaCartella : function (params) {
        /**
         * idenContatto : value,
         * usernameLocked : value
         * callbackOK : function
         * [callbackKO] : function
         *
         */
        //alert("Sblocco la cartella del contatto " + params.idenContatto + " e con l'username  = " + params.usernameLocked);

        logger.debug("NS_UNLOCK.sbloccaCartella con params = " + JSON.stringify(params));
        if (typeof params.usernameLocked == 'undefined') {
            params.usernameLocked = null;
        }
        if (typeof params.idenContatto == 'undefined') {
            params.idenContatto = null;
        }

        LOCKS.unlock_rows(
            {
                p_table   : "CONTATTI",
                p_iden    : {v: params.idenContatto, t: 'V'},
                p_username: {v: params.usernameLocked , t: 'V'},
                p_ip      : {v: home.basePC.IP, t: 'V'},
                p_sito    : {v: $("#SITO").val(), t: 'V'},
                p_result  : {d: "O", t: "V"}
            }
            , function (resp) {
                if(typeof params.callbackOK!= 'undefined'){
                    params.callbackOK(resp);
                }
                else{
                    logger.debug("chiamata LOCKS.unlock_rows andata a buonfine " + JSON.stringify(resp) + ' con parametri ' +  JSON.stringify(params)  );
                }

            }
            , function (err, exc) {
                if(LIB.isValid(params.callbackKO)){
                    params.callbackKO(err);
                }else{
                    logger.error("Errore chiamata sbloccaCartella => " + JSON.stringify(err) + exc );
                }
            }
        );

    }
};


