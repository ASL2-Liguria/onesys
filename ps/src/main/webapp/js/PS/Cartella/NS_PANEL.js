/* global FNC_MENU_LISTA_APERTI */

var dim;
var NS_PANEL = {
    codiceContatto: $("#hNumeroPratica").val(),
    catenaCustodia: $("#hEsamiForensi").val(), //verifica sull'avvenuta stampa del relativo modulo
    stampa: "", //verifica sull'avvenuta stampa dei moduli
    verbale: null, //verifica sull'avvenuto esito finale dal PS
    urgenza: null, //ultima urgenza salvata
    esito : jsonData.ESITO, //prendo l'esito quando carico

    //	Riferimenti agli oggetti jQuery creati nell'init()
    ref: {
        body: null,
        header: null,
        sx: null,
        dx: null,
        center: null,
        content: null,
        bottom: null
    },

    init: function () {
        NS_FENIX.init();

        home.NS_CONSOLEJS.addLogger({name: 'NS_PANEL', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_PANEL'];

        NS_PANEL.ref.body = $("body");
        NS_PANEL.ref.header = $("#tHeader");

        NS_PANEL.ref.center = $("#center");

        NS_PANEL.ref.sx = $("#tSx");
        NS_PANEL.setPanel.sx(NS_PANEL.ref.sx.data('ns'));

        NS_PANEL.ref.dx = $("#tDx");
        NS_PANEL.setPanel.dx(NS_PANEL.ref.dx.data('ns'));

        NS_PANEL.ref.content = $("#tContent");
        NS_PANEL.setPanel.content(NS_PANEL.ref.content.data('ns'));

        NS_PANEL.ref.bottom = $("#tBottom");
        NS_PANEL.setPanel.bottom(NS_PANEL.ref.bottom.data('ns'));

        NS_PANEL.initDimensioni();
        NS_PANEL.dimensionaPannelli();
        NS_PANEL.resize.attiva();
        //NS_PANEL.setEta();

        home.PANEL = this;
        //
    },
    illuminaAvvertenze: function(idenAnag){
        var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE',async:false}});

        var params ={"idenAnag" : {'v':Number(idenAnag), 't':'N'}};

        var xhr = db.select({
            id       : "CCE.Q_DATI_AVVERTENZE",
            parameter: params
        });

        xhr.done(function (data) {
            logger.debug("illuminaAvvertenze: "+JSON.stringify(data));
            if(data.result.length > 0) {
              $("#btnAvvertenze").find("i").addClass("Illumina");
            }
        });

        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            home.NOTIFICA.error({message: "Errore nel get Q_DATI_AVVERTENZE", title: "Error"});
            logger.error("getAvvertenzeFromWhale Error -> "+JSON.stringify(jqXHR)+" - "+JSON.stringify(textStatus)+" - "+JSON.stringify(errorThrown));
        });
    },
    illuminaMalattieRare : function (iden_anag) {

        var par = {
            datasource:'MMG',
            id : 'DATI.Q_HAS_MALATTIA_RARA',
            params : {iden_anag : {t:'N', v:iden_anag}},
            callbackOK : callbackOK
        };
        NS_CALL_DB.SELECT(par);
        function callbackOK(data){
            if(data.result.length > 0) {
                $("#btnMalRare").find("i").addClass("Illumina");

            }
        }
    },
    illuminaOrganismiMultiResistenti : function (iden_anag) {
        var par = {
            datasource:'WHALE',
            id : 'CCE.Q_GET_ORGANISMI',
            params : {idenAnag : {t:'N', v:iden_anag}},
            callbackOK : callbackOK
        };
        NS_CALL_DB.SELECT(par);

        function callbackOK(data){
            if(data.result.length > 0) {
                $("#btnOrganismiMultiresistenti").find("i").addClass("Illumina");
            }
        }

    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== typeof value) && ("undefined" !== value) && ("null" !== value));
    },

    setEvents: function () {
        NS_FENIX.setEvents();
        $("#btnEspandi").on("click", NS_PANEL.espandiLayout);
        $("#btnRipristina").on("click", NS_PANEL.ripristinaLayout);
        $("#btnChiudi").on("click", NS_PANEL.beforeChiudi);
        $("#btnBlocca").on("click", function () {
            if (typeof home.PANEL != 'undefined' && home.PANEL != null) {
                home.NS_FENIX_PS.IDEN_CONTATTO_LOCKED = $("#IDEN_CONTATTO").val();
            }

            home.NS_FENIX_MINI_MENU.bloccaWorkstation(home.NS_WORKSTATION_PS.callBackSbloccaWorkstation)
        });
        $("#btnAvvertenze").on("click", function (e) {
            DIALOG_PS.createDialogAvvertenze($("#IDEN_ANAG").val(), e)
        });
        $("#btnMalRare").on("click", function (e) {
            NS_PANEL.apriMalattieRare();
        });
        $("#btnOrganismiMultiresistenti").on("click", function(e){
            DIALOG_PS.createDialogOrganismiMultiresistenti($("#IDEN_ANAG").val(), e)
        });

    },
    /**
     * Controllo alcuni parametri per saper quando avisare l'utente della necessita' di stampare i moduli
     */
    beforeChiudi: function () {
        var statoPagina = $("#STATO_PAGINA").val();
        var idenContatto = $("#IDEN_CONTATTO").val();

        if ((statoPagina === "E") && (NS_PANEL.verbale === "OK") && (!NS_PANEL.hasAValue(NS_PANEL.stampa)) && $("iframe").contents().find(".CBpulsSel").length > 0 ) {

            $.dialog("Non e' stato stampato alcun modulo \n Stampare i moduli dovuti prima di uscire.",
                {title: "Attenzione",
                    buttons: [
                        {label: "OK", action: function () {
                            $.dialog.hide();
                        }}
                        /*{label: "Chiudi senza stampare", action: function () {
                            $.dialog.hide();
                            NS_PANEL.controlloChiusura();
                        }}*/
                    ]
                }
            );
        } /*else if (home.CARTELLA.NS_REFERTO.wk_apertura == "LISTA_APERTI" && home.CARTELLA.jsonData.H_STATO_PAGINA.ESAME_OBIETTIVO == "I" && statoPagina !== "R" && home.baseUser.TIPO_PERSONALE == "M" ) {

            $.dialog("Attenzione: Valutazione medica non compilata. Chiudendo la cartella verra' annullata la presa in carico. Procedere?",
                {title: "Attenzione",
                    buttons: [
                        {label: "NO", action: function () {
                            $.dialog.hide();
                        }},
                        {label: "SI", action: function () {
                            var cbk = function(){
                                
                                NS_PANEL.chiudi();
                               
                            };
                            FNC_MENU_LISTA_APERTI.cancelPresaInCarico(idenContatto,cbk );
                        }}

                    ]
                }
            );
        }*/ else {
            NS_PANEL.controlloChiusura();
        }
    },
    /**
     * controlla i parametri del contatto prima della chiusura della console
     */
    controlloChiusura: function () {

        var iden_contatto = $("#IDEN_CONTATTO").val();
        var tipoPersonale = home.baseUser.TIPO_PERSONALE;
        var statoPagina = $("#STATO_PAGINA").val();

        var dbParams = {iden_contatto: {v: Number(iden_contatto), t: "N"}};


        NS_CALL_DB.SELECT({
            datasource : 'PS',
            id: "PS.Q_CONTROL_RECORD",
            params : dbParams,
            callbackOK : callbackOK
        });
        function callbackOK(response) {
            var iden_lista = response.result[0].IDEN_LISTA;
            var statoContatto = response.result[0].STATO;
            var statoLista =  response.result[0].STATO_LISTA;
            var progressivo = response.result[0].PROGRESSIVO;
            var urgenza = response.result[0].URGENZA;
            var idenListaPrecedente = response.result[0].IDEN_PRECEDENTE;


            if((NS_PANEL.hasAValue(iden_lista) && statoLista === "INSERITO" && progressivo > 0 && NS_PANEL.hasAValue(urgenza) && statoPagina !== "R"))
            {
                $.dialog("RIVALUTAZIONE NON COMPLETATA",
                    {title: "ATTENZIONE",
                        buttons: [
                            {label: "TORNA ALLA RIVALUTAZIONE", action: function () {
                                //home.PANEL.NS_REFERTO.apriCodiceColore();
                                $.dialog.hide();
                            }},
                            {label: "ELIMINA RIVALUTAZIONE ATTUALE", action: function () {
                                $.dialog.hide();
                                NS_TRIAGE_METHODS.rimuovi({
                                    "iden_lista"  : iden_lista,
                                    "iden_precedente" : idenListaPrecedente,
                                    "callback" : function(){
                                        NS_PANEL.chiudi();
                                    }
                                });
                            }}
                        ]
                    }
                );
            }
            else if (statoPagina == "R" || (NS_PANEL.hasAValue(iden_lista) && (statoLista === "COMPLETO" || statoLista === "CHIUSO")) || (tipoPersonale == "A") || (statoContatto==="DISCHARGED"))
            {
                return NS_PANEL.chiudi();
            }
            else
            {
                $.dialog("TRIAGE NON COMPLETATO.",
                    {title: "ATTENZIONE",
                        buttons: [
                            {label: "OK", action: function () {
                                $.dialog.hide();
                            }}
                        ]
                    }
                );
            }
        }
    },
    /**
     * chiusura della console
     */
    chiudi: function (callback) {

        var params = {
            idenContatto : $("#IDEN_CONTATTO").val(),
            usernameLocked : home.baseUser.USERNAME,
            callbackOK : callbackOK
        };

        function callbackOK(){

            var n_scheda = Number($("#N_SCHEDA").val());
            var n_totale_schede_aperte = home.$('.iScheda').length;
            var n_schede_da_chiudere = (n_totale_schede_aperte - n_scheda);

            if(typeof callback == 'function')
            {
                callback();
            }
            else if((home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === 'OST') && ($("#WK_APERTURA").val() === "ANAGRAFICA"))
            {
                home.NS_WK_PS.startWorklist();
            }
            else
            {
                home.NS_WK_PS.caricaWk();
            }

            if($("#STATO_PAGINA").val() === "R") {
                parent.$(".iScheda")[0].contentWindow.location.reload();
            }

            if (n_schede_da_chiudere > 0) {
                for (var n = n_schede_da_chiudere; n >= n_scheda; n--) {
                    home.NS_FENIX_TOP.chiudiScheda({"n_scheda": (n + 1)});
                }
            }

            home.PANEL = null;
            home.NS_WK_PS.refresh_wk = true;
            home.NS_FENIX_TOP.chiudiScheda({"n_scheda": n_scheda});

        }

        NS_UNLOCK.sbloccaCartella(params);

    },

    initDimensioni: function () {
        var PANEL_DIM = "{hBottom:150,wSx:190,wDx:190}";

        if (PANEL_DIM !== null) {
            eval("dim = " + PANEL_DIM);
        }
        else {
            eval("dim = " + home.baseGlobal.DEFAULT_CONSOLE_DIM);
        }
    },
    /**
     * Dimensiona i pannelli secondo i valori salvati
     */
    dimensionaPannelli: function () {
        var hCenter = NS_PANEL.ref.body.height() - NS_PANEL.ref.header.outerHeight() - dim.hBottom;
        var wCenter = NS_PANEL.ref.body.width() - dim.wSx - dim.wDx;

        NS_PANEL.ref.sx.width(dim.wSx).height(hCenter);
        NS_PANEL.ref.dx.width(dim.wDx).height(hCenter);
        NS_PANEL.ref.content.width(wCenter).height(hCenter).css("left", dim.wSx);

        NS_PANEL.ref.bottom.css("top", NS_PANEL.ref.body.height() - dim.hBottom);
        NS_PANEL.ref.bottom.height(dim.hBottom);
    },

    setPanel: {
        sx: function (key_ns) {
            NS_PANEL.resize.sx = NS_PANEL.setPanel.getResizeFunction(key_ns);
        },
        dx: function (key_ns) {
            NS_PANEL.resize.dx = NS_PANEL.setPanel.getResizeFunction(key_ns);
        },
        bottom: function (key_ns) {
            NS_PANEL.resize.bottom = NS_PANEL.setPanel.getResizeFunction(key_ns);
        },
        content: function (key_ns) {
            NS_PANEL.resize.content = NS_PANEL.setPanel.getResizeFunction(key_ns);
        },
        getResizeFunction: function (key_ns) {
            eval("var ns=" + key_ns + ";");
            if (ns == null) {
                return alert('ns null');
            }
            if (typeof ns.resize != 'function') {
                return alert('nonpuofunzionare');
            }
            return ns.resize;
        }
    },

    resize: {

        attiva: function () {

            NS_PANEL.ref.sx.resizable({ iframeFix: true, minWidth: 6, maxWidth: 400, handles: "e", ghost: false, start: function (event, ui) {
                $('<div class="ui-resizable-iframeFix" style="background: #fff;"></div>')
                    .css({
                        width: '100%', height: '100%',
                        position: "absolute", opacity: "0.001", zIndex: 1000
                    })
                    .appendTo("body");
            },
                stop: function (event, ui) {
                    $('.ui-resizable-iframeFix').remove();
                }});
            NS_PANEL.ref.dx.resizable({ iframeFix: true, minWidth: 28, maxWidth: 400, handles: "w", ghost: true, start: function (event, ui) {
                $('<div class="ui-resizable-iframeFix" style="background: #fff;"></div>')
                    .css({
                        width: '100%', height: '100%',
                        position: "absolute", opacity: "0.001", zIndex: 1000
                    })
                    .appendTo("body");
            },
                stop: function (event, ui) {
                    $('.ui-resizable-iframeFix').remove();
                }});
            NS_PANEL.ref.bottom.resizable({ iframeFix: true, helper: "ui-resizable-helper", minHeight: 6, maxHeight: 400, handles: "n", ghost: false, start: function (event, ui) {
                $('<div class="ui-resizable-iframeFix" style="background: #fff;"></div>')
                    .css({
                        width: '100%', height: '100%',
                        position: "absolute", opacity: "0.001", zIndex: 1000
                    })
                    .appendTo("body");
            },
                stop: function (event, ui) {
                    $('.ui-resizable-iframeFix').remove();
                }});

            //	Al ridimensionamento, salvo le dimensioni e adatto il riquadro centrale
            NS_PANEL.ref.sx.on("resizestop", function (event, ui) {
                dim.wSx = ui.size.width;
                NS_PANEL.dimensionaPannelli();

                NS_PANEL.resize.sx();
                NS_PANEL.resize.content();

                //NS_PANEL.salvaDimensioni();
            });

            NS_PANEL.ref.dx.on("resizestop", function (event, ui) {
                dim.wDx = ui.size.width;
                NS_PANEL.dimensionaPannelli();

                NS_PANEL.resize.dx();
                NS_PANEL.resize.content();

                //NS_PANEL.salvaDimensioni();
            });

            NS_PANEL.ref.bottom.on("resizestop", function (event, ui) {
                dim.hBottom = ui.size.height;
                NS_PANEL.dimensionaPannelli();

                NS_PANEL.resize.sx();
                NS_PANEL.resize.dx();
                NS_PANEL.resize.content();
                NS_PANEL.resize.bottom();

                //NS_PANEL.salvaDimensioni();
            });
        },

        sx: function (event, ui) {
        },
        dx: function (event, ui) {
        },
        content: function (event, ui) {
        },
        bottom: function (event, ui) {
        }
    },
    /**
     * salvo le dimensioni attuali
     */
    /*salvaDimensioni: function () {
     var save = '{hBottom:' + dim.hBottom + ',wSx:' + dim.wSx + ',wDx:' + dim.wDx + '}';
     var param = { "p_dim": save, "p_username": home.baseUser.USERNAME };

     toolKitDB.executeFunctionDatasource("SALVA_DIMENSIONI_PANEL", "CONFIG_WEB", param,
     {
     callback: function (response)
     {
     home.baseUser.CONSOLE_DIM = save;
     },
     timeout: 2000,
     errorHandler: function (response)
     {

     }
     });
     },*/
    /**
     * espando i riquadri e disattivo il ridimensionamento
     */
    espandiLayout: function () {
        var hCenter = NS_PANEL.ref.body.height() - NS_PANEL.ref.header.outerHeight() - 3;
        var wCenter = NS_PANEL.ref.body.width() - 31;
        NS_PANEL.ref.sx.width(3).height(hCenter);
        NS_PANEL.ref.dx.width(28).height(hCenter);
        NS_PANEL.ref.content.width(wCenter).height(hCenter).css("left", 3);
        NS_PANEL.ref.bottom.height(3);

        NS_PANEL.ref.bottom.css("top", NS_PANEL.ref.body.height() - 3);

        //  Richiama la funzione per ridimensionare il contenuto
        NS_PANEL.resize.content();
        NS_PANEL.resize.dx();
        NS_PANEL.resize.sx();
        NS_PANEL.resize.bottom();

        NS_PANEL.disattivaResize();
        NS_PANEL.attivaButRipristina();
    },

    ripristinaLayout: function () {
        NS_PANEL.dimensionaPannelli();
        NS_PANEL.attivaResize();
        NS_PANEL.attivaButEspandi();

        NS_PANEL.resize.content();
        NS_PANEL.resize.dx();
        NS_PANEL.resize.sx();
        NS_PANEL.resize.bottom();
    },
    /**
     *    attivo il ridimensionamento
     */
    attivaResize: function () {
        NS_PANEL.ref.bottom.resizable("enable");
        NS_PANEL.ref.sx.resizable("enable");
        NS_PANEL.ref.dx.resizable("enable");
    },
    /**
     * disattivo il ridimensionamento
     */
    disattivaResize: function () {
        NS_PANEL.ref.bottom.resizable("disable");
        NS_PANEL.ref.sx.resizable("disable");
        NS_PANEL.ref.dx.resizable("disable");
    },
    /**
     * abilito il pulsante di espansione e nascondo il pulsante di ripristino
     */
    attivaButEspandi: function () {
        $("#btnEspandi").show();
        $("#btnRipristina").hide();
    },
    /**
     * abilito il pulsante di ripristino e nascondo il pulsante di espansione
     */
    attivaButRipristina: function () {
        $("#btnEspandi").hide();
        $("#btnRipristina").show();
    },
    apriMalattieRare : function () {
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=MALATTIE_RARE&STATO_PAGINA=E&IDEN_ANAG='+
        NS_REFERTO.iden_anagrafica+"&READONLY="+NS_REFERTO.readOnly,id:'dettAnag',fullscreen:true});
    },
    apriOrganismi : function (){
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=ORGANISMI_MULTIRESISTENTI&STATO_PAGINA=I&IDEN_ANAG='+
        NS_REFERTO.iden_anagrafica+"&READONLY="+NS_REFERTO.readOnly,id:'dettAnag',fullscreen:true});
    }

};