/**
 * Created by carlo.gagliolo on 20/07/2015.
 */
$(document).ready(function() {
    home.NS_WORKSTATION_PS = NS_WORKSTATION_PS;
});


var NS_WORKSTATION_PS ={

    /**
     * se logga lo stesso utente nascondo il div del velo nero,
     * se logga un utente diverso lo faccio tornare alla pagina principale e ricarico i baseUser lato server.
     * per adesso ho solo l'iden per e mi vado a prendere sul db l'username
     * @todo fare tornare l'username dalla procedura di salvataggio
     * @param ctx
     * @param newIdenPer
     */
    callBackSbloccaWorkstation: function (ctx, newIdenPer) {

        //aggiorno il parametro timestamp per evitare che la pagina venga recuperata dalla cache
        var url = home.document.location.href.match("(.*\&time=)")[1]+ new Date().getTime();

        if(ctx === 'SMARTCARD'){
            // newIdenPer in questo caso è same_user, è true quando l'utente è deverso e false quando l'utente è uguale
            if(newIdenPer){

                //var url = home.document.location.href.match("(.*\&time=)")[1]+ new Date().getTime();

                if (typeof home.PANEL !== 'undefined' && home.PANEL !== null) {

                    home.PANEL.chiudi(function(){
                        home.dwrBaseFactory.reloadPermission("PS", "1", function(){
                            home.document.location.replace(url);
                        })                        
                    });

                }
                //ricaricare main page. Ricarica il menu ma non ricarica le voci in basso.
               home.dwrBaseFactory.reloadPermission("PS", "1", function(){
                    home.document.location.replace(url/*home.document.location*/);
                });  
            }
        }else if (newIdenPer !== home.baseUser.IDEN_PER){

            var db = $.NS_DB.getTool({setup_default: {datasource: 'PS', async: false}});
            var xhr = db.select({
                id: "PS.Q_GET_USERNAME",
                parameter: {iden_per: newIdenPer}
            });
            xhr.done(function (data) {

                if (data.result.length === 1) {
                    //invoco DWR che ricarica baseUser. Alla callback eseguo le seguenti funzioni param Username, sito, versione, callback
                    home.dwrBaseFactory.reloadUser(data.result[0].USERNAME, 'PS', '1', function (resp) {
                        //console.log(resp);

                        home.baseUser = JSON.parse(resp);
                        //cambio le informazioni in basso
                        home.NS_FENIX_TOP.setInfoUser();

                        //se sono nella consolle la chiudo;
                        if (typeof home.PANEL !== 'undefined' && home.PANEL !== null) {

                            chiudiPanel(function () {
                                home.dwrBaseFactory.reloadPermission("PS", "1", function(){
                                    home.document.location.replace(url);
                                });
                            });

                        }else{
                            home.dwrBaseFactory.reloadPermission("PS", "1", function(){
                                home.document.location.replace(url);
                            });
                        }
                    });
                } else {
                    home.NOTIFICA.error({message: "Errore nel get dell'username : trovati più utenti associati ad un iden personale", title: "Error"});
                    return home.$("#divBlock").remove();
                }
            });
            xhr.fail(function (jqXHR, textStatus, errorThrown) {
                home.NOTIFICA.error({message: "Errore nel get dell'username", title: "Error"});
                logger.error('CallBackSbloccaWorkstation Error -> ' + JSON.stringify(jqXHR));
                logger.error(JSON.stringify(errorThrown));
            });
        }

        //rimuovo il velo nero
        home.$("#divBlock").remove();
        function chiudiPanel (callback) {
            var paramSblocca = {
                idenContatto  : home.NS_FENIX_PS.IDEN_CONTATTO_LOCKED,
                callbackOK :   function () { home.PANEL.chiudi(callback) }
            };

            NS_UNLOCK.sbloccaCartella(paramSblocca);
        }
    },
    /**
     * override della funzione di logout della smartcard in quanto su PS si dovra utilizzare un comportamento diverso
     * */
    logoutSmartCard : function () {

        if (typeof home.PANEL !== 'undefined' && home.PANEL !== null) {
            home.NS_FENIX_PS.IDEN_CONTATTO_LOCKED = $("#IDEN_CONTATTO").val();
        }

        //Blocca la workstation invece di chiudere tutto
        home.NS_FENIX_MINI_MENU.bloccaWorkstation(NS_WORKSTATION_PS.callBackSbloccaWorkstation);
    },

    loginSmartCardSbloccaWK : function (sameUser){

        NS_WORKSTATION_PS.callBackSbloccaWorkstation('SMARTCARD',sameUser);
    },

    callAfterLogout : function () {
        /*prima di fare la logout sblocco tutte le cartelle del mio username*/
        NS_UNLOCK.sbloccaCartella({usernameLocked:home.baseUser.USERNAME});
    }

};
