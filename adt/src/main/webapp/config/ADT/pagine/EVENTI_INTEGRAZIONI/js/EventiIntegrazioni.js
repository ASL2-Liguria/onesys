/***********************************************************************************************************************
 * Autore : carlog
 * Data : 20/05/2016
 * Uso : gestione pagina EVENTI_INTEGRAZIONI
 **********************************************************************************************************************/

jQuery(document).ready(function () {

    NS_EVENTI_INTEGRAZIONI.init();

});

var NS_EVENTI_INTEGRAZIONI = {

    tab_sel : null,
    wk_eventi : null,

    init : function () {
        NS_EVENTI_INTEGRAZIONI.caricaWkEventi();
    },
    /**
     * caricaWkEventi : WK della tabella ADT.EVENTI_INTEGRAZIONI
     */
    caricaWkEventi : function(){

        var stato = $("#h-radTipoEvento").val(),
            da_data = $("#h-txtDaDataEventiIntegrazioni").val(),
            a_data = $("#h-txtADataEventiIntegrazioni").val();

        NS_EVENTI_INTEGRAZIONI.wk_eventi= new WK({
            id : "WK_EVENTI_INTEGRAZIONI",
            container : "divWk",
            aBind : ["stato","da_data","a_data"],
            aVal : [stato,da_data,a_data],
            loadData : false
        });

        NS_EVENTI_INTEGRAZIONI.wk_eventi.loadWk();
    },
    /**
     * riprocessaEvento : chiama il proxy di fenix e rimanda il json del contatto con il metodo richiesto
     * @param json
     */
    riprocessaEvento : function(json){

        home.NS_LOADING.showLoading({"timeout" : 0});

        var request = $.ajax({
            type : "POST",
            url: "proxy",
            cache: false,
            data: {
                "PARAM" : json.json,
                "CALL" : json.url,
                "METHOD" :"POST"
            }
        });

        request.done( function( msg ) {

            var messaggio = JSON.parse(msg);

            NS_EVENTI_INTEGRAZIONI.controlloProcessaEvento({
                "idenEvento"   : json.idenEvento,
                "idenContatto" : json.idenContatto,
                "success"      : messaggio.success,
                "messaggio"    : messaggio.message,
                "sito"         : json.sito
            });
        });

        request.fail( function( jqXHR, textStatus ) {
            home.NS_LOADING.hideLoading();
            home.NOTIFICA.error({ title: "Attenzione", message: " Evento NON riprocessato ", timeout : 0});
            logger.error(" Riprocesso dell evento " + idenEvento + " in errore \n" + JSON.stringify(jqXHR) + "\n" + JSON.stringify(textStatus));
        });
    },
    /**
     * controlloProcessaEvento : controlla se la chiamata è andata a buon fine, se si chiama l'aggiornamento della tabella
     * @param json
     */
    controlloProcessaEvento : function(json){

        if(json.success){

            logger.info(" Evento " + json.idenEvento + " riprocessato con successo \n" + json.messaggio );

            NS_EVENTI_INTEGRAZIONI.setElaborato({
                "idenEvento"   : json.idenEvento,
                "idenContatto" : json.idenContatto,
                "sito"         : json.sito,
                "callback"     : function(){
                    home.NS_LOADING.hideLoading();
                    NS_EVENTI_INTEGRAZIONI.wk_eventi.refresh();
                    home.NOTIFICA.success({message: "Evento riprocessato con successo", timeout: 2, title: "Success"});
                }
            });
        } else {
            logger.error(" Evento " + json.idenEvento + " in errore \n" + json.messaggio );
            home.NOTIFICA.error({ title: "Attenzione", message: "Riprocessa evento in errore", timeout : 0});
            home.NS_LOADING.hideLoading();
        }
    },
    /**
     * setElaborato : funzione che chiama il package PCK_EVENTI_INTEGRAZIONI.ELABORA_EVENTO
     * @param json
     */
    setElaborato : function(json){

        var db = $.NS_DB.getTool({
            setup_default : {datasource: "ADT"}
        });

        var xhr = db.call_procedure({
            id: "PCK_EVENTI_INTEGRAZIONI.ELABORA_EVENTO",
            parameter:
            {
                P_IDEN          : { "t": "N", "v": json.idenEvento },
                P_IDEN_CONTATTO : { "t": "N", "v": json.idenContatto },
                P_SITO          : { "t": "V", "v": json.sito },
                P_STATO         : { "t": "V", "v": "1"}
            }
        });

        xhr.done(function ( data ) {
            logger.info(" Evento " + json.idenEvento + " set elaborato \n" + JSON.stringify(data) );
            if(typeof json.callback === "function") { json.callback(); }
        });

        xhr.fail( function( jqXHR, textStatus ) {
            home.NS_LOADING.hideLoading();
            logger.error(" Riprocesso dell evento " + json.idenEvento + " in errore \n" + JSON.stringify(jqXHR) + "\n" + JSON.stringify(textStatus));
        });
    },
    /**
     * creaDivRiprocessa : crea un pulsante per riprocessare l'evento
     * @param data
     * @returns {*|jQuery|HTMLElement}
     */
    creaDivRiprocessa : function(data){

        if(data.STATO === "2") {
            var div = $(document.createElement("div"));

            var apriCustodia = $(document.createElement("a"))
                .attr("onclick", "NS_EVENTI_INTEGRAZIONI.riprocessaEvento({'idenEvento' : '"
                + data.IDEN
                + "','idenContatto':'" + data.IDEN_CONTATTO
                + "','url':'" + data.URL
                + "','json':'" + data.JSON
                + "','sito':'" + data.SITO
                + "'})")
                .html("<i class=' icon-cw' title='Riprocessa Evento'>");

            div.append(apriCustodia);

            return div
        }
    }
};