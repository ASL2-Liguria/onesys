$(function () {
    SCADENZARIO_MEDICO.init();
});

var SCADENZARIO_MEDICO = {
    objWk: null,
    init: function () {
        home.SCADENZARIO_MEDICO = this;
        SCADENZARIO_MEDICO.setLayout();
        SCADENZARIO_MEDICO.initWk();
        SCADENZARIO_MEDICO.setEvents();
    },
    initWk: function () {
        var h = $('.contentTabs').innerHeight() - $("#fldFiltri").outerHeight(true) - 20;
        $("#divWk").height(h);
        $("#divWk").width("969px");
        this.refreshWk();
    },
    refreshWk: function () {
        this.objWk = new WK({
            "id": "SCADENZARIO_MEDICO",
            "aBind": ["iden_med", "attivo"],
            "aVal": [home.baseUser.IDEN_PER, radAttivo.val() == "S" ? "%25" : "S"]
        });
        this.objWk.loadWk();
    },
    setEvents: function () {
        $("#radAttivo").on("click", function () {
            SCADENZARIO_MEDICO.objWk.filter({
                "aBind": ["iden_med", "attivo"],
                "aVal": [home.baseUser.IDEN_PER, radAttivo.val() == "S" ? "%25" : "S"]
            });
        });
        $(".butInserisci").on("click", function () {
            SCADENZARIO_MEDICO.inserisci();
        });
    },
    setLayout: function () {
        $("body").css("width", "1024px");
    },
    inserisci: function () {
        home.NS_MMG.apri("SCADENZA");
    },
    modifica: function (row) {
        if (typeof row[0] != "undefined") {
            row = row[0];
        }
        if (row.TIPO == 'comune')
            return home.NOTIFICA.info({'title': 'Avvertenza', 'message': "Impossibile modificare una scadenza comune"});
        else
            home.NS_MMG.apri("SCADENZA", "&IDEN=" + row.IDEN);
    },
    attivazione: function (row, attivo) {
        if (typeof row[0] != "undefined") {
            row = row[0];
        }
        home.$.NS_DB.getTool({_logger: home.logger}).call_block_anonymous({
            datasource: "MMG_DATI",
            id: 'MMG_DATI.SCADENZARIO_MEDICO_ATTIVAZIONE',
            parameter: {
                "n_iden": {v: row.IDEN, t: 'N'},
                "v_attivo": {v: attivo, t: 'V'}
            }
        }).done(function (response) {
            SCADENZARIO_MEDICO.refreshWk();
        });
    },
    processScadenza: function (data, wk) {
        var vAnni, vMesi, vGiorni;

        vAnni = Math.floor(data.SCADENZA_GIORNI / 365);
        vMesi = Math.floor((data.SCADENZA_GIORNI % 365) / 30);
        vGiorni = (data.SCADENZA_GIORNI % 365) % 30;

        return (vAnni > 0 ? vAnni + "A " : '') + (vMesi > 0 ? vMesi + "M " : '') + vGiorni + "G";
    },
    whereModifica: function (row) {
        return row.length == 1 && row[0].TIPO == "personale";
    },
    whereDisattiva: function (row) {
        return row.length == 1 && row[0].TIPO == "personale" && row[0].ATTIVO == "S";
    },
    whereRiattiva: function (row) {
        return row.length == 1 && row[0].TIPO == "personale" && row[0].ATTIVO == "N";
    }
};