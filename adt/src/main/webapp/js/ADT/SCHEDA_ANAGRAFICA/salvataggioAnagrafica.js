/**
 * Created by matteo.pipitone on 26/01/2016.
 */

var NS_ANAGRAFICA_SALVATAGGIO = {
    controllo_codice_fiscale_dupl : function (codFisc) {

        var db = $.NS_DB.getTool({setup_default: {datasource: 'WHALE'}});

        var params = {"COD_FISC": codFisc};

        var xhr = db.select(
            {
                id       : 'DATI.CHECKEXISTANAG',
                parameter: params
            });

        //controlla se in anagrafica c'è già un codice fiscale uguale

        xhr.done(function (data, textStatus, jqXHR) {

            if(data.result[0].HASCODFISC == 0) {
                return true;
            } else {
                return false;

            }
        });
    },
    controllo_codice_fiscale_trpl : function (codFisc) {

        var db = $.NS_DB.getTool({setup_default: {datasource: 'WHALE'}});

        var params = {"COD_FISC": codFisc};

        var xhr = db.select(
            {
                id       : 'DATI.CHECKEXISTANAG',
                parameter: params
            });

        //controlla se in anagrafica c'è già un codice fiscale uguale

        xhr.done(function (data, textStatus, jqXHR) {

            if(data.result[0].HASCODFISC <= 1) {
                return true;
            } else {
                return false;

            }
        });
    }
} ;