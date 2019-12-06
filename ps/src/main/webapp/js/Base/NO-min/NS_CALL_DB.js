/**
 * Created by matteo.pipitone on 02/02/2015.
 */

$(document).ready(function ()
{
    NS_CONSOLEJS.addLogger({name: 'NS_CALL_DB', console: 0});
    home.NS_CALL_DB = NS_CALL_DB;
});


var NS_CALL_DB = {
    ALL : function(params){
        /**
         * params = {
        *   datasource : <datasource>
        *   id : <id della query da fare>
        *   params : <parametri da passare alla query>
        *   callbackOK : <funzione da eseguire alla fine della query>
        *   callbackKO : <funzione da eseguire in caso di errore>
        *   callbackAlways : <Funzione da eseguire in ogni caso>
        *   type : <SELECT, FUNCTION, PROCEDURE>
        *   }
        * */
        logger.debug("NS_CALL_DB.ALL con parametri = " + JSON.stringify(params));
        var db = $.NS_DB.getTool({setup_default:{datasource:params.datasource,async:false}});
        var xhr;
        switch (params.type) {
            case 'SELECT':
                xhr = db.select({
                    id: params.id,
                    parameter: params.params
                });
                break;
            case 'FUNCTION':
                xhr = db.call_function({
                    id: params.id,
                    parameter: params.params
                });
                break;
            case 'PROCEDURE':
                xhr = db.call_procedure({
                    id: params.id,
                    parameter: params.params
                });
                break;
            case 'BLOCK_ANONYMOUS':
                xhr = db.call_block_anonymous({
                    id: params.id,
                    parameter: params.params
                });
                break;
        }

        xhr.done(function (data) {
            if(data == "" || data == null || typeof data == "undefined") {
                logger.error("xhr.done errore nella chiamta " + params.id + 'DATA ' + JSON.stringify(data));
                home.NOTIFICA.error({message: "Attenzione errore nella chiamata " + params.id , title: "Error"});
            } else {
                if( typeof params.callbackOK == 'function'){
                    params.callbackOK(data);
                }else{
                    logger.debug("xhr.done Chiamata andata a buon fine ma senza callbackOK()")
                }

            }
        });
        xhr.fail(function (jqXHR) {
            if( typeof params.callbackKO == 'function'){
                params.callbackKO(jqXHR);
            }else{
                home.NOTIFICA.error({message: "Attenzione errore nella chiamata " + params.id , title: "Error"});
                logger.error("xhr.fail Errore in " + params.id + " jqXHR " +  JSON.stringify(jqXHR));
            }
        });
        xhr.always(function (jqXHR) {
            if(typeof params.callbackAlways == 'function') {
                params.callbackAlways(jqXHR);
            }
        });
    },
    SELECT : function (params) {
        params.type = 'SELECT';
        NS_CALL_DB.ALL(params);
    },
    PROCEDURE : function (params) {
        params.type = 'PROCEDURE';
        NS_CALL_DB.ALL(params);
    },
    FUNCTION : function (params) {
        params.type = 'FUNCTION';
        NS_CALL_DB.ALL(params);
    },
    BLOCK_ANONYMOUS : function(params){
        params.type = 'BLOCK_ANONYMOUS';
        NS_CALL_DB.ALL(params);
    }
};