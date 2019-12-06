$(document).ready(function () {
    SCHEDA_PARTI_ANATOMICHE.init();
    SCHEDA_PARTI_ANATOMICHE.setEvents();
});


var SCHEDA_PARTI_ANATOMICHE = {

    filter : null,

    init: function () {

        SCHEDA_PARTI_ANATOMICHE.initUrgenza();
    },

    setEvents: function () {

        $('.RadioBox').find('div.RBpuls').on('click', function(){
            SCHEDA_PARTI_ANATOMICHE.getListaEsami();
        });

        
        $(".butAnnulla").on("click", function () {

            if($("#ComboOut").find("option").length > 0)
            {
                $.dialog("Uscendo dalla scheda si perderanno tutti i dati. Si vuole procedere comunque?", {
                    title: "Attenzione",
                    buttons: [
                        {label: "NO", action: function () {
                            $.dialog.hide();
                        }},
                        {label: "SI", action: function () {
                            $.dialog.hide();
                            NS_FENIX_SCHEDA.chiudi({"refresh": false});
                        }}

                    ]
                });
            }
            else
            {
                NS_FENIX_SCHEDA.chiudi({"refresh": false});
            }
        });

        $(".butInserisci").on("click", function () {
            SCHEDA_PARTI_ANATOMICHE.inserisci();
        });

        $("#btnShowAll").on("click", function () {
            SCHEDA_PARTI_ANATOMICHE.rimuoviFiltri();
        });

        $("#btnRemoveAll").on("click", function () {
            $(".listTo").empty();
        });

        var searchEsa = $("#txtSearchEsa");

        searchEsa.on("keyEnter", function (e) {

            e.preventDefault();
            e.stopPropagation();

            var search = $(this).val();
            if (search != "") {
                NS_LISTBOX.search($("#ComboIn"), search, "descr");
            } else {
                NS_LISTBOX.backDefault($("#ComboIn"));
            }
        });

        searchEsa.focus();
    },

    initUrgenza : function(){

        var radUrgenza = $("#UrgenzaRichieste");
        var urgenzaPrincipale = $("#URGENZA").val();
        radUrgenza.find("input[type='hidden']").val(urgenzaPrincipale);
        radUrgenza.find("div[data-value='"+urgenzaPrincipale+"']").addClass("RBpulsSel");
    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== typeof value) && ("null" !== value));
    },

    getEsamiSelezionati: function () {
        var obj = [];

        function getDataAttributes(el) {
            var data = {};
            $.each(el.attributes, function (k, attr) {
                if (/^data-/.test(attr.name)) {
                    var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
                        return $1.toLowerCase();
                    });
                    data[camelCaseName.toLowerCase()] = attr.value;
                }
            });
            return data;
        }

        $("#ComboOut").find("option").each(function (k, v) {
            obj.push(getDataAttributes(v));
        });
        return obj;
    },

    getFiltri: function (callback) {

        SCHEDA_PARTI_ANATOMICHE.filter = {"PARTI_DEL_CORPO": $("#ImgOmino").mapster('get').toString(), "METODICHE": $('input[name="chkMetodiche"]').val()};
        var idenErogatore = $("#IDEN_EROGANTE");
        var inputCodCDC = $("input[name='COD_CDC_PS']");
        var inputDestinatario = $("input[name='DESTINATARIO']");
        var urgenza = $("#h-UrgenzaRichieste").val();
        //var urgenza = "2";//$("#URGENZA").val();

        if (SCHEDA_PARTI_ANATOMICHE.hasAValue(urgenza)) {
            SCHEDA_PARTI_ANATOMICHE.filter.URGENZA = urgenza;
        }

        if (idenErogatore.length > 0) {
            SCHEDA_PARTI_ANATOMICHE.filter.IDEN_EROGANTE = idenErogatore.val();
        }

        if (inputCodCDC.length) {
            SCHEDA_PARTI_ANATOMICHE.filter.COD_CDC_PS = inputCodCDC.val();
        }

        if (inputDestinatario.length) {
            SCHEDA_PARTI_ANATOMICHE.filter.DESTINATARIO = inputDestinatario.val();
        }

        if(!SCHEDA_PARTI_ANATOMICHE.hasAValue(SCHEDA_PARTI_ANATOMICHE.filter.METODICHE)){
            SCHEDA_PARTI_ANATOMICHE.filter.METODICHE = null;
        }


        callback();
    },

    rimuoviFiltri: function () {
        // $(".body_part").mapster('set',false);
        $(".body_part").mapster('deselect');
        $("#chkMetodiche").data("CheckBox").deselectAll();
        SCHEDA_PARTI_ANATOMICHE.pulisciFiltroText();
        SCHEDA_PARTI_ANATOMICHE.getListaEsami();
    },

    inserisci: function () {

        var esami = SCHEDA_PARTI_ANATOMICHE.getEsamiSelezionati();



        $.each(esami, function (k, v) {

            var param = {
                IDEN: v.iden,
                COD_DEC: v.cod_dec,
                ESAME: v.descr,
                COD_CDC: v.reparto_destinazione,
                COD_ESENZIONE: v.cod_esa,
                METODICA: v.metodica,
                EROGATORE: v.descr_reparto,
                URGENZA: v.urgenza,
                LATERALITA: "",
                IMPEGNATIVA: "",
                URGENZA_IMPEGNATIVA: "",
                DATA_IMPEGNATIVA: "",
                TIPO_IMPEGNATIVA: ""

            };
            home.MAIN_INS_RICHIESTE.aggiungiPrestazione(param);
        });
        NS_FENIX_SCHEDA.chiudi({"refresh": false});

    },

    getListaEsami: function () {
        SCHEDA_PARTI_ANATOMICHE.getFiltri(function(){SCHEDA_PARTI_ANATOMICHE.getEsamiRichiedibili();});

    },

    caricaEsami: function (list) {
        var comboIn = $("#ComboIn");
        $(".listFrom").empty();
        $.each(list, function (k, v) {
            $(".listFrom").append(createOption(v));
        });
        NS_LISTBOX.set_new_default(comboIn);

        NS_LISTBOX.search(comboIn, $("#txtSearchEsa").val(), "descr");

        function createOption(v) {
            var me = this;
            me.opt = $("<option>");
            $.each(v, function (k1, v1) {
                if (k1 == "DESCR") {
                    me.opt.attr("data-descr", v1);
                    me.opt.html(v1);
                } else if (k1 == "IDEN") {
                    me.opt.attr("data-iden", v1);
                    me.opt.val(v1);
                }
                else {
                    me.opt.attr("data-" + k1, v1);
                }
            });
            return me.opt;
        }
    },

    getEsamiRichiedibili: function () {

        var filtri = SCHEDA_PARTI_ANATOMICHE.filter;

        var partiCorpo = filtri.PARTI_DEL_CORPO;

        if(SCHEDA_PARTI_ANATOMICHE.hasAValue(partiCorpo)){
            partiCorpo = partiCorpo.replace(/,/g, '');
        }else{
            partiCorpo = null;
        }

        if(SCHEDA_PARTI_ANATOMICHE.hasAValue(filtri.URGENZA))
        {
            var db = $.NS_DB.getTool({setup_default: {datasource: 'WHALE', async: false}});
            var params = {
                "cdcSorgente": filtri.COD_CDC_PS,
                "cdcDestinatario": filtri.DESTINATARIO,
                "tipoRichiesta": $('#TIPO').val(),
                "urgenza": filtri.URGENZA,
                "descr": "%",
                "metodica": filtri.METODICHE,
                "corpo": partiCorpo
            };

            var xhr = db.select({
                id: "OE.SCHEDA_PARTI_ANATOMICHE_ESAMI",
                parameter: params
            });
            xhr.done(function (data) {

                if (data.result.length === 0) {
                    logger.error("SCHEDA_PARTI_ANATOMICHE_ESAMI error nessun ritorno");
                }
                else {
                    SCHEDA_PARTI_ANATOMICHE.caricaEsami(data.result);
                }

            });
            xhr.fail(function (jqXHR) {
                home.NOTIFICA.error({message: "Attenzione errore nella chiamata SCHEDA_PARTI_ANATOMICHE_ESAMI", title: "Error"});
                logger.error("SCHEDA_PARTI_ANATOMICHE_ESAMI jqXHR " + JSON.stringify(jqXHR));
            });
        }
        else
        {
            home.NOTIFICA.warning({message: "Selezionare Urgenza", title: "Attenzione"});
        }
    },


    /**
     * controllo per non inserire due volte lo stesso esame
     * @param obj_from option jquery
     * @returns {boolean}
     */
    beforeTransfert: function (obj_from,list_to) {
        var idenEsa = obj_from.data('iden');
        var urgenza = obj_from.data("urgenza");

       // obj_from.addClass("urgenza_"+urgenza);

        var boolean = true;

        $("#ComboOut").find("option").each(function (k, v) {
            if ($(v).data("iden") === idenEsa && $(v).data("urgenza") === urgenza) {boolean = false}
        });

        return boolean;
    },

    pulisciFiltroText : function(){
        $("#txtSearchEsa").val("");
    },

    cambiaCorpo : function(p){

        var corpo = $("#ImgOmino").mapster('get').toString();

        if(p.state=="select" && p.selected==true && SCHEDA_PARTI_ANATOMICHE.hasAValue(corpo)){
            SCHEDA_PARTI_ANATOMICHE.getListaEsami();
        }

    }
};