/**
 * autore : Carlog
 * data : 02/10/2014
 * scopo : gestire la pagina delle frasi standard, cambiare filtri alla WK, inserire e modificare i record
 */

$(function () {
    FRASI_STD.init();
    FRASI_STD.setEvents();
});

var FRASI_STD = {

    elementoSelezionato : $("#ELEMENTO_SELEZIONATO").val(),
    paginaApertura : $("#PAGINA_APERTURA").val(),
    dimensioneWk : null,

    hasAValue : function(value){
        return (("" !== value)&&(undefined !== value)&&(null !== value));
    },

    init: function () {
        //home.FRASI_STD_REFERTAZIONE = window;
        $("input#txtGruppo").val($("input#GRUPPO").val()).addClass("mousetrap");
        $("input#txtCodDescr").addClass("mousetrap");
        FRASI_STD.calcolaDimensioneWk();
        FRASI_STD.initWkFrasi();
    },

    setEvents: function () {
        $(".butApplica").bind("click", function () {
            var rec = FRASI_STD.wkFrasi.getArrayRecord()[0];
            if (!FRASI_STD.hasAValue(rec)) {
                $.dialog("Selezionare una frase",
                    {title: "Attenzione", buttons: [ {label: "OK", action: function () { $.dialog.hide(); }} ] }
                );
                logger.error("FRASI_STD.setEvents Nessuna frase selezionata");
            }else{
                FRASI_STD.applica(rec.FRASE, FRASI_STD.paginaApertura);
            }
        });

        $(".btnCerca").bind("click", FRASI_STD.initWkFrasi);

        Mousetrap.bind('enter', FRASI_STD.initWkFrasi);
    },

    calcolaDimensioneWk : function(){
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 75;
        FRASI_STD.dimensioneWk = contentTabs  - margine;
    },
    /**
     * Gestione cambio tipo di filtro tramite button, e caricamento Wk
     */
    initWkFrasi: function () {
        var vGruppo = home.baseUserLocation.cod_cdc;
        var vCodice = "";
        var vDescr = "";
        var txtCodDescr = $("input#txtCodDescr").val();
        var radCodDescr = $("#radCodDescr").data("RadioBox").val();

        if (radCodDescr === "COD") {
            vCodice = txtCodDescr.toUpperCase() + "%25" ;
        } else if(radCodDescr==='DESCR') {
            vDescr = txtCodDescr.toUpperCase() + "%25";
        }else{
            logger.error("FRASI_STD_REFERTAZIONE.initWkFrasi : Radio non selezionato");
        }

        if (!FRASI_STD.wkFrasi) {
            FRASI_STD.wkFrasi = new WK({
                id: "FRASI_STD_REFERTAZIONE",
                container: "divWkFrasi",
                aBind: ["gruppo", "codice", "descrizione"],
                aVal: [vGruppo, vCodice, vDescr],
                loadData: true
            });
            $("div#divWkFrasi").height(FRASI_STD.dimensioneWk);
            FRASI_STD.wkFrasi.loadWk();
        }else{
            FRASI_STD.wkFrasi.filter({
                aBind: ["gruppo", "codice", "descrizione"],
                aVal: [vGruppo, vCodice, vDescr]
            });
        }
    },
    /**
     * Al doppio click inserisce la frase scelta nella textarea di origine
     * @param pFrase
     */
    applica: function (pFrase) {
        var obj = home.RIFERIMENTO_VERBALE.$.find('#' + FRASI_STD.elementoSelezionato);
        obj=$(obj);
        var testo = obj.val();

        if (FRASI_STD.hasAValue(testo)){
            obj.val(testo + " " + pFrase);
        }else{
            obj.val(pFrase);
        }
        NS_FENIX_SCHEDA.chiudi({});
    },
    /**
     * inserisce un nuovo record tabella FRASI_STD
     * @param rec
     */
    inserisciDettaglio: function () {
        home.RIFERIMENTO_FRASI_STD = window;
        home.NS_FENIX_TOP.apriPagina({
            url: 'page?KEY_LEGAME=FRASI_STD_INSERT&_STATO_PAGINA=I&GRUPPO=',
            id: 'frasi_std_inserimento',
            fullscreen: true
        });

    },
    /**
     * Modifica record presente tabella FRASI_STD
     * @param rec
     */
    modificaDettaglio: function (rec) {
        home.RIFERIMENTO_FRASI_STD = window;
        home.NS_FENIX_TOP.apriPagina({
            url: 'page?KEY_LEGAME=FRASI_STD_INSERT&_STATO_PAGINA=E&IDEN_FRASE='+ rec.IDEN,
            id: 'frasi_std_inserimento',
            fullscreen: true});
    }
};
