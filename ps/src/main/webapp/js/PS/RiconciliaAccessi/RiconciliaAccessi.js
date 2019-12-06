/**
 * Created by carlog on 23/09/14.
 * Preso da RIS e modificato
 *
 */
$("document").ready(function () {
    //NS_RIC_ACCESSI.pageBehavior();
    NS_RIC_ACCESSI.init();
    NS_RIC_ACCESSI.setEvents();
});


var NS_RIC_ACCESSI = {

    objWk: null,
    response: [],

    /*pageBehavior: function () {
        var wkApertura = $("#WK_APERTURA").val();

        if (wkApertura === "ANAGRAFICA") {
            $("#txtCognome").val("" + $("#COGNOME").val() + "");
            $("#txtNome").val("" + $("#NOME").val() + "");
        }
    },*/

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value));
    },

    init: function () {
        this.addattaLayout();
        this.caricaWk();
    },
    /**
     * Calcola le dimensioni degli elementi nella pagina WK_APERTURA
     */
    addattaLayout: function () {
        var $body = $('body');
        var h_pagina = home.$('#iContent').height() - $body.padding().top - $body.padding().bottom - 5;
        var h_paz = $("#SchedaPazientiSelezionati").outerHeight();
        var h_filtri = $("#filtri").outerHeight();
        $("#divWk").css({'height': (h_pagina - (h_paz + h_filtri))});
    },

    caricaWk: function () {
        var params = {
            "id": "RICONCILIA_ACCESSI",
            "container": "divWk",
            "loadData": true,
            "aBind": ["nome", "cognome", "data_nascita"],
            "aVal": ["", "", ""]
        };
        this.objWk = new WK(params);
        this.objWk.loadWk();
    },

    setEvents: function () {
        $(".butInvertiSorgDest").on("click", function () {
            NS_RIC_ACCESSI.InvertiSorgenteDestinatario($("#fldPazSorgente"), $("#fldPazDestinatario"));
        });
        //nasconde o visualizza la Wk se clicco sul tab
        $("#li-filtroRicercaPaz").on("click", function () {
            $("#divWk").toggle();
        });
        $(".butRiconciliaPaz").on("click", function () {
            NS_RIC_ACCESSI.riconciliaPaziente();
        });
        $(".butSpostaAccessi").on("click", function () {
            NS_RIC_ACCESSI.spostaAccessi();
        });
    },
    /**
     * Inverte i dati dei due paz
     * @param sorg
     * @param dest
     * @constructor
     */
    InvertiSorgenteDestinatario: function (sorg, dest) {
        if ($("input", sorg).length == $("input", dest).length) {
            $.each($("input", sorg), function (k, v) {
                var $this = $(this);
                var Idest = $("input:eq(" + k + ")", dest);
                var v_dest = Idest.val();
                Idest.val($this.val());
                $this.val(v_dest);
                logger.debug("InvertiSorgenteDestinatario" + v);
            });
        }
        else {
            logger.error("Gli input sorgenti e destinatari non hanno lo stesso numero");
        }
        NS_RIC_ACCESSI.getAccessi($("#PazSorgIdenAnag").val());
    },

    /**
     * Menu WK carica dati paz sorgente
     * @param dati
     */
    caricaPazSorgente: function (dati) {
        $("#PazSorgIdenAnag").val(dati.IDEN_ANAG);
        $("#txtPazSorgId").val(dati.IDEN_ANAG);
        $("#txtPazSorgNome").val(dati.NOME);
        $("#txtPazSorgCognome").val(dati.COGNOME);
        $("#txtPazSorgDataNasc").val(dati.DATA_NASCITA);
        $("#txtPazSorgCodFisc").val(dati.CODICE_FISCALE);

        NS_RIC_ACCESSI.getAccessi(dati.IDEN_ANAG);
    },
    /**
     * Menu WK carica dati paz destinatario
     * @param dati
     */
    caricaPazDestinatario: function (dati) {
        $("#PazDestIdenAnag").val(dati.IDEN_ANAG);
        $("#txtPazDestId").val(dati.IDEN_ANAG);
        $("#txtPazDestNome").val(dati.NOME);
        $("#txtPazDestCognome").val(dati.COGNOME);
        $("#txtPazDestDataNasc").val(dati.DATA_NASCITA);
        $("#txtPazDestCodFisc").val(dati.CODICE_FISCALE)

    },

    getAccessi: function (iden_anag) {
        var db = $.NS_DB.getTool();
        var dbParams = {"iden_anagrafica": {v: iden_anag, t: "N"}};
        var xhr = db.select({
            datasource: "PS",
            id: "PS.ACCESSI",
            parameter: dbParams
        });
        xhr.done(function (response) {
            if (NS_RIC_ACCESSI.hasAValue(response.result)) {
                NS_RIC_ACCESSI.result = response.result;
                NS_RIC_ACCESSI.caricaAccessi(NS_RIC_ACCESSI.result, $("#ComboIn"));
            }
            else {
                logger.error("NS_RIC_ACCESSI.getAccessi : response has not a value");
            }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error('getAccessi() ' + JSON.stringify(jqXHR) + "\n" + JSON.stringify(textStatus) + "\n" + JSON.stringify(errorThrown));
        });
    },

    caricaAccessi: function (accesso, list) {
        list.empty();
        if (NS_RIC_ACCESSI.hasAValue(accesso)) {
            $.each(accesso, function (index, value) {
                list.append(creaOption(value));
            });
        }
        else {
            logger.error("caricaAccessi : nessun accesso associato all'anag");
        }

        function creaOption(value) {
            var opt = $("<option>");
            $.each(value, function (k, v) {
                opt.attr("data-" + k, v);
            });
            opt.val(opt.attr("data-value"));
            opt.html("Accesso N: " + opt.attr("data-iden_contatto") +
                " Codice: " + opt.attr("data-codice") +
                " Data: " + opt.attr("data-data_inizio"));
            return opt;
        }
    },

    riconciliaPaziente: function () {
        var PazSorgIdenAnag = $("#PazSorgIdenAnag").val();
        var PazDestIdenAnag = $("#PazDestIdenAnag").val();
        var cognomePazSorgente = String($("#txtPazSorgCognome").val());

        if ((NS_RIC_ACCESSI.hasAValue(PazSorgIdenAnag)) && (NS_RIC_ACCESSI.hasAValue(PazDestIdenAnag)) && (cognomePazSorgente === "SCONOSCIUTO")) {
            $.dialog("Verranno spostati tutti gli accessi e cancellato il paziente sconosciuto.\n Procedere?",
                {title: "Attenzione",
                    buttons: [
                        {label: "Si", action: function () {
                            $.dialog.hide();
                            $("option", "#ComboIn").each(function (k, v) {
                                var iden_contatto = $(v).data("iden_contatto");
                                NS_RIC_ACCESSI.moveVisit(Number(PazDestIdenAnag), Number(iden_contatto));
                            });
                            /**@TODO : cancellare il paziente dall'anagrafica*/
                        }},
                        {label: "No", action: function () {
                            $.dialog.hide();
                        }}
                    ]
                }
            );
        }
        else if ((NS_RIC_ACCESSI.hasAValue(PazSorgIdenAnag)) && (NS_RIC_ACCESSI.hasAValue(PazDestIdenAnag)) && (cognomePazSorgente !== "SCONOSCIUTO")) {
            $.dialog("Verranno spostati tutti gli accessi.\n Procedere?",
                {title: "Attenzione",
                    buttons: [
                        {label: "Si", action: function () {
                            $.dialog.hide();
                            $("option", "#ComboIn").each(function (k, v) {
                                var iden_contatto = $(v).data("iden_contatto");
                                NS_RIC_ACCESSI.moveVisit(Number(PazDestIdenAnag), Number(iden_contatto));
                            });
                        }},
                        {label: "No", action: function () {
                            $.dialog.hide();
                        }}
                    ]
                }
            );
        }
        else {
            home.NOTIFICA.warning({title: "Attenzione", message: "Paziente Sorgente e Destinatario Obbligatori", timeout: 5});
        }
    },

    spostaAccessi: function () {
        var PazSorgIdenAnag = $("#PazSorgIdenAnag").val();
        var PazDestIdenAnag = $("#PazDestIdenAnag").val();

        if (!NS_RIC_ACCESSI.hasAValue(PazSorgIdenAnag) || !NS_RIC_ACCESSI.hasAValue(PazDestIdenAnag)) {
            home.NOTIFICA.warning({title: "Attenzione", message: "Paziente Sorgente e Destinatario Obbligatori", timeout: 5});
        }
        if ($("option", "#ComboIn").length === 0) {
            home.NOTIFICA.warning({title: "Attenzione", message: "Paziente Sorgente non ha accessi associati", timeout: 5});
        }
        else {
            $("option", "#ComboOut").each(function (k, v) {
                var iden_contatto = $(v).data("iden_contatto");
                return NS_RIC_ACCESSI.moveVisit(PazDestIdenAnag, iden_contatto);
            });
        }
    },

    moveVisit: function (PazDestIdenAnag, idenContatto) {
        var jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden(idenContatto,{assigningAuthorityArea:'ps'});
        var jsonAnag =  NS_ANAGRAFICA.Getter.getAnagraficaById(idenAnag);

        CONTROLLER_PS.MoveVisit({
            jsonContatto : jsonContatto,
            jsonAnag : jsonAnag,
            callback : function(){
                location.reload();
            }
        });
    }

};






