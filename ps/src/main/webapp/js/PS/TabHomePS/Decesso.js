/**
 * Created by alberto.mina on 09/06/2015.
 */

$(document).ready(function(){
    NS_SEGNALA_DECESSO.init();
    NS_ANNULLA_DECESSO.init();
});


var NS_SEGNALA_DECESSO = {

    init: function(){
        home.NS_SEGNALA_DECESSO = this;
    },

    segnalaDecesso: function(json){

        var db = $.NS_DB.getTool();

        var iden_anag = Number(json.iden_anag);

        var dbParams = {
            "p_iden_anag"    :  { v : iden_anag, t : "N"},
            "p_data_decesso" :  { v : json.data_decesso, t : "V"},
            "p_result "      :  { t : "V", d : "O" }
        };

        var xhr = db.call_procedure({
            datasource: "WHALE",
            id: "ANAGRAFICA_FROM_FENIX.SEGNALA_DECESSO",
            parameter: dbParams
        });

        xhr.done(function (resp) {
            logger.info("data decesso segnalata per anagrafica: "+ iden_anag + " \n " +JSON.stringify(resp));
            if(typeof callback == "function"){json.callback();}
        });

        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("Errore segnalazione data decesso per anagrafica: "+ iden_anag + " \n " +
            JSON.stringify(jqXHR)+ " \n " +JSON.stringify(textStatus)+ " \n " +JSON.stringify(errorThrown));
        });
    }

};

var NS_ANNULLA_DECESSO = {

    init: function(){
      home.NS_ANNULLA_DECESSO = this;
    },

    annullaSegnalaDecesso: function(json){

        var db = $.NS_DB.getTool();

        var dbParams = {
            "p_iden_anag" : {v: Number(json.iden_anag), t: "N"},
            "p_result"    : { t: "V", d: "O" }
        };
        var xhr = db.call_procedure({
            datasource: "WHALE",
            id: "ANAGRAFICA_FROM_FENIX.ANNULLA_SEGNALA_DECESSO",
            parameter: dbParams
        });
        xhr.done(function (resp) {
            logger.info('data decesso annullata per anagrafica :'+ json.iden_anag + " \n " +JSON.stringify(resp));
            if(typeof json.callback == "function"){json.callback();}
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error('Errore annullamento data decesso per anagrafica :'+ json.iden_anag + " \n " +
            JSON.stringify(jqXHR)+ " \n " +JSON.stringify(textStatus)+ " \n " +JSON.stringify(errorThrown));
        });

    },

    annullaSegnalaDecessoMenu: function(rec,callback){

        var db = $.NS_DB.getTool();

        var dbParams = {
            "p_iden_anag" : {v: Number(rec[0].IDEN_ANAG), t: "N"},
            "p_result"    : { t: "V", d: "O" }
        };
        var xhr = db.call_procedure({
            datasource: "WHALE",
            id: "ANAGRAFICA_FROM_FENIX.ANNULLA_SEGNALA_DECESSO",
            parameter: dbParams
        });
        xhr.done(function (resp) {
            logger.info('data decesso annullata per anagrafica :'+rec[0].IDEN_ANAG + " \n " +JSON.stringify(resp));
            NS_WK_PS.caricaWk();
            if(typeof callback == "function"){callback();}
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error('Errore annullamento data decesso per anagrafica :'+rec[0].IDEN_ANAG + " \n " +
            JSON.stringify(jqXHR)+ " \n " +JSON.stringify(textStatus)+ " \n " +JSON.stringify(errorThrown));
        });

    }
};