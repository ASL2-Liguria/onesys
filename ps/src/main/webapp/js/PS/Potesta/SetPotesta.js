/**
 * Created by alberto.mina on 06/05/2015.
 */


var NS_SET_POTESTA = {

    IDEN_ANAGRAFICA : null,
    jsonDati : null,
    beforeSave : function (){return true},
    //differenzio callback da successSave in modo tale da tenerli divisi, successave sempre lo stesso, callBack diverse che lo richiamano
    callback : null,
    successSave : function (){return true},
    codiceFiscale : null,
    paz_sconosciuto:null,


    setPotesta : function(iden_gen, gen){

        var params = {
            "P_IDEN_CONTATTO" : {t:"N", v:$("#IDEN_CONTATTO").val()},
            "P_KEY_LIST" : {v:['IDEN_GENITORE','GENITORE'],t:'A'},
            "P_VALUE_LIST" : {v:[iden_gen, gen],t:'A'},
            "P_TYPE_LIST" : {v:['S','S'],t:'A'}
        };

        var parametri = {
            "datasource": "PS",
            id: "ADT$ADT_CONTATTI.UPDATE_METADATI_CONTATTO",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.PROCEDURE(parametri);

        function callbackOk(data) {
            logger.info(JSON.stringify(data));
            NS_SET_POTESTA.getGenitore();
            home.NOTIFICA.success({message: "Genitorialita' associata con successo", title: 'Success!'});

        }
    },

    setPotestaWk : function(obj){

        var iden_gen = obj[0].IDEN_ANAG;
        

        if ( iden_gen != home.CARTELLA.NS_INFO_PAZIENTE.jsonAnagrafica.IDEN) {

            var gen = obj[0].NOME + ' ' + obj[0].COGNOME;

            var params = {
                "P_IDEN_CONTATTO": {t: "N", v: $("#IDEN_CONTATTO").val()},
                "P_KEY_LIST": {v: ['IDEN_GENITORE', 'GENITORE'], t: 'A'},
                "P_VALUE_LIST": {v: [iden_gen, gen], t: 'A'},
                "P_TYPE_LIST": {v: ['S', 'S'], t: 'A'}
            };

            var parametri = {
                "datasource": "PS",
                id: "ADT$ADT_CONTATTI.UPDATE_METADATI_CONTATTO",
                "params": params,
                "callbackOK": callbackOk
            };

            NS_CALL_DB.PROCEDURE(parametri);

            function callbackOk(data) {
                logger.info(JSON.stringify(data));

                NS_SET_POTESTA.getGenitore();
                home.NOTIFICA.success({message: "Genitorialita' associata con successo", title: 'Success!'});
            }
        }
        else{
            home.NOTIFICA.error({message: 'Impossibile assegnare il paziente stesso ', title: 'Errore!'});
            return false;
        }
    },

    getGenitore : function(){
        var db = $.NS_DB.getTool();
        var dbParams = {"iden_contatto": {v: Number($("#IDEN_CONTATTO").val()), t: "N"}};
        var xhr = db.select({
            datasource: "PS",
            id: "PS.Q_PS_POTESTA",
            parameter: dbParams
        });
        xhr.done(function (response) {

            $.each(response.result, function (chiave, valore) {
                home.NS_CARTELLA.tutore = valore.GENITORE;
            });

        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("INAIL.caricaTerapie \n" + JSON.stringify(jqXHR) + "\n" + JSON.stringify(textStatus) + "\n" + JSON.stringify(errorThrown));
        });
    }



}