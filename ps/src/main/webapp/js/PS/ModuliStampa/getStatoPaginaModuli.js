/**
 * Created by alberto.mina on 04/08/2015.
 */
var GET_STATO_PAGINA_MODULI = {




    /** RECUPERO STATO PAGINA PRIMA DI APRIRE LA SCHEDA**/

    getStatoPagina: function(scheda,query){
        var db = $.NS_DB.getTool();
        var dbParams = {
            "iden_contatto": {v: $('#IDEN_CONTATTO').val(), t: "N" }
        };

        var xhr = db.select({
            datasource: "PS",
            id: query,
            parameter: dbParams
        });

        xhr.done(function (response) {
            if (response) {
                NS_MODULI.stato_pagina = JSON.parse(response.result[0].JSON_STATO_PAGINA)[scheda];

                home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME='+ scheda +'&IDEN_CONTATTO=' +
                    NS_MODULI.iden_contatto + '&IDEN_PROVENIENZA=' + NS_MODULI.iden_provenienza + '&SCHEDA='+ scheda +
                    '&STATO_PAGINA='+ NS_MODULI.stato_pagina +'&READONLY='+NS_MODULI.inailRead+"&LISTA_CHIUSI="+ $("#LISTA_CHIUSI").val()
                    ,fullscreen:true})
            } else {
                logger.error("ERRORE QUERY");
            }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("ERRORE CONNESSIONE");
        });
    }



};