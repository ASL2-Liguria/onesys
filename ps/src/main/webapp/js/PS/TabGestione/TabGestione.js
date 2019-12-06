/**
 * Created by matteo.pipitone on 19/05/2015.
 */

jQuery(document).ready(function () {
    NS_FENIX_GESTIONE.init();
    NS_FENIX_GESTIONE.event();
});

var NS_FENIX_GESTIONE = {
    tab_sel : null,
    wkCartelleLock : null,

    init : function () {
        home.NS_FENIX_GESTIONE = window;
        NS_FENIX_GESTIONE.caricaWkCartelle();
        NS_FENIX_WK.aggiornaWk  = NS_FENIX_GESTIONE.aggiornaWk;
    },
    event : function () {
        $('#tabs-Worklist').children().click(function () {
            NS_FENIX_GESTIONE.tab_sel = $(this).attr('data-tab');
            NS_FENIX_GESTIONE.caricaWk();
        });
    },
    caricaWkCartelle : function () {

        var nome = $("#txtNome").val();
        var cognome = $("#txtCognome").val();
        var cartella = $("#txtCartella").val();

        NS_FENIX_GESTIONE.wkCartelleLock = new WK({
            id: "PS_WK_RIC_CARTELLE_LOCK",
            container: "divWk",
            loadData : true,
            aBind: ["nome","cognome", "cartella"],
            aVal: [nome, cognome , cartella]
        });
        NS_FENIX_GESTIONE.wkCartelleLock.loadWk();
    },
    caricaWk:function(){
        switch (NS_FENIX_GESTIONE.tab_sel) {
            case 'filtroCartelle' :
                NS_FENIX_GESTIONE.caricaWkCartelle();
                break;
        }

    },
    aggiornaWk : function () {
        switch (NS_FENIX_GESTIONE.tab_sel) {
            case 'filtroCartelle' :
                var paramsWk = NS_FENIX_FILTRI.leggiFiltriDaBindare();
                var Bind=paramsWk.aBind;
                var Value=paramsWk.aVal;

                Bind.push("iden_cdc");
                Value.push(home.baseUserLocation.iden);

                NS_FENIX_GESTIONE.wkCartelleLock.filter({"aBind":paramsWk.aBind,"aVal":paramsWk.aVal});
                break;
        }


    }
};

var NS_MENU_GESTIONE = {
    sbloccaCartella:function (rec) {

        var params = {
            idenContatto : rec[0].TABELLA_IDEN,
            usernameLocked : rec[0].USERNAME_LOCK,
            callbackOK : function () {
                home.NOTIFICA.success({message: "Cartella sbloccata", title: "Success", timeout : 5});
                NS_FENIX_GESTIONE.tab_sel = 'filtroCartelle';
                NS_FENIX_GESTIONE.caricaWk();
            },
            callbackKO : function (resp) {
                logger.error(JSON.stringify(resp));
                home.NOTIFICA.error({message: "Errore in sblocca cartella", title: "Error", timeout : 5});

            }
        };
        NS_UNLOCK.sbloccaCartella(params);

    }
};