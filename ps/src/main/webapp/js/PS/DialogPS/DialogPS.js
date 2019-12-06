

var DIALOG_PS = {
    scalaGlasgow: function (eta) {
        /**
         * Carico i valori dei campi nascosti
         * Calcolo il totale
         * Creo la tabella dell'infoDialog
         * Valorizzo i check con i valori dei campi nascosti
         * Apro il Dialog
         * Salvo nei campi nascosti
         * */
        var motoria = $("#hmotoria").val();
        var verbale = $("#hverbale").val();
        var aperturaocchi = $("#haperturaocchi").val();
        var totale = 0;
        var cognome = parent.NS_INFO_PAZIENTE.jsonAnagrafica.COGNOME;
        if (motoria != '' || verbale != '' || aperturaocchi != '') {
            totale = parseInt(motoria) + parseInt(verbale) + parseInt(aperturaocchi);
        }

        var butCambiaScala = $(document.createElement("button")).attr('id','cambiaScala').text('cambia scala');
        var tdLegenda = $(document.createElement("td")).attr({"colspan": "6"}).attr('id','tdLegenda').text("LEGENDA GLASGOW").css({"text-align": "center", "font-weight": "bold"});

        /** Righe legenda Scala normale  **/
        var trAperturaOcchi = '';
        var trRispostaMotoria = '';
        var trRispostaVerbale = '';

        /** Righe legenda Scala pediatrica  **/
        var trAperturaOcchiP = '';
        var trRispostaMotoriaP = '';
        var trRispostaVerbaleP = '';


            trAperturaOcchi =
                $(document.createElement("tr"))
                    .attr('id','apertura')
                    .attr('class','legend')
                .append($(document.createElement("td")).text("Apertura occhi").css({"text-align": "center", "font-weight": "bold"}))
                .append($(document.createElement("td")).text("Nessuna risposta").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Al dolore").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("A stimoli verbali").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Spontanea").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("N/A").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("N/A").css({"text-align": "center"}));

            trRispostaMotoria = $(document.createElement("tr"))
                .attr('id','motoria')
                .attr('class','legend')
                .append($(document.createElement("td")).text("Risposta motoria").css({"text-align": "center", "font-weight": "bold"}))
                .append($(document.createElement("td")).text("Nessuna risposta").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Estende al dolore (decerebrato)").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Flette al dolore (decorticato)").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Ritira in risposta al dolore").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Localizza il dolore").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Obbedisce ai comandi").css({"text-align": "center"}));

            trRispostaVerbale = $(document.createElement("tr"))
                .attr('id','verbale')
                .attr('class','legend')
                .append($(document.createElement("td")).text("Risposta verbale").css({"text-align": "center", "font-weight": "bold"}))
                .append($(document.createElement("td")).text("Nessuna risposta").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Suoni incomprensibili").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Parole inappropriate").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Confusa").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Orientata").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("N/A").css({"text-align": "center"}));





            trAperturaOcchiP =
                $(document.createElement("tr"))
                    .attr('id','aperturaP')
                    .attr('class','legend')
                    .append($(document.createElement("td")).text("Apertura occhi").css({"text-align": "center", "font-weight": "bold"}))
                    .append($(document.createElement("td")).text("Nessunan risposta").css({"text-align": "center"}))
                    .append($(document.createElement("td")).text("Al dolore").css({"text-align": "center"}))
                    .append($(document.createElement("td")).text("A stimoli verbali - rumore").css({"text-align": "center"}))
                    .append($(document.createElement("td")).text("Spontanea").css({"text-align": "center"}))
                    .append($(document.createElement("td")).text("N/A").css({"text-align": "center"}))
                    .append($(document.createElement("td")).text("N/A").css({"text-align": "center"}));

            trRispostaMotoriaP = $(document.createElement("tr"))
                .attr('id','motoriaP')
                .attr('class','legend')
                .append($(document.createElement("td")).text("Risposta motoria").css({"text-align": "center", "font-weight": "bold"}))
                .append($(document.createElement("td")).text("Nessuna risposta").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Estende al dolore (decerebrato)").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Flette al dolore (decorticato)").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Ritira in risposta al dolore").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Ritira al contatto").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Muove spontaneamente").css({"text-align": "center"}));

            trRispostaVerbaleP = $(document.createElement("tr"))
                .attr('id','verbaleP')
                .attr('class','legend')
                .append($(document.createElement("td")).text("Risposta verbale").css({"text-align": "center", "font-weight": "bold"}))
                .append($(document.createElement("td")).text("Nessuna risposta").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Gemito al dolore").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Pianto al dolore").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Pianto irritabile").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("Adeguata").css({"text-align": "center"}))
                .append($(document.createElement("td")).text("N/A").css({"text-align": "center"}));









        var table = $(document.createElement("table")).attr({"id": "TableGlasgow", "class": "tabledialog"})
            .append($(document.createElement("tr"))
                .append($(document.createElement("th")).text("Rilevazioni"))
                .append($(document.createElement("th")).text("1"))
                .append($(document.createElement("th")).text("2"))
                .append($(document.createElement("th")).text("3"))
                .append($(document.createElement("th")).text("4"))
                .append($(document.createElement("th")).text("5"))
                .append($(document.createElement("th")).text("6"))
            ).append($(document.createElement("tr")).attr("id", "aperturaocchi")
                .append($(document.createElement("td")).text("Apertura Occhi"))
                .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 1, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(1,'aperturaocchi')"})))
                .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 2, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(2,'aperturaocchi')"})))
                .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 3, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(3,'aperturaocchi')"})))
                .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 4, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(4,'aperturaocchi')"})))
                .append($(document.createElement("td")))
                .append($(document.createElement("td")))
            ).append($(document.createElement("tr")).attr("id", "verbale")
                    .append($(document.createElement("td")).text("Verbale"))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 1, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(1,'verbale')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 2, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(2,'verbale')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 3, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(3,'verbale')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 4, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(4,'verbale')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 5, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(5,'verbale')"})))
                    .append($(document.createElement("td")))
            ).append($(document.createElement("tr")).attr("id", "motoria")
                .append($(document.createElement("td")).text("Motoria"))
                .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 1, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(1,'motoria')"})))
                .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 2, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(2,'motoria')"})))
                .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 3, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(3,'motoria')"})))
                .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 4, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(4,'motoria')"})))
                .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 5, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(5,'motoria')"})))
                .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 6, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(6,'motoria')"})))
            ).append(
                $(document.createElement("tr"))
                    .append($(document.createElement("td")).text("Totale"))
                    .append($(document.createElement("td")).attr("colspan", 5))
                    .append($(document.createElement("td")).append($(document.createElement("div")).attr("id", "totale").text(totale)))
            )
            .append(
                $(document.createElement("tr"))
                    .append(tdLegenda)
                    .append($(document.createElement("td")).append(butCambiaScala))
            )
            .append(
                $(document.createElement("tr"))
                    .append($(document.createElement("td")))
                    .append($(document.createElement("td")).text("1").css({"text-align": "center", "font-weight": "bold"}))
                    .append($(document.createElement("td")).text("2").css({"text-align": "center", "font-weight": "bold"}))
                    .append($(document.createElement("td")).text("3").css({"text-align": "center", "font-weight": "bold"}))
                    .append($(document.createElement("td")).text("4").css({"text-align": "center", "font-weight": "bold"}))
                    .append($(document.createElement("td")).text("5").css({"text-align": "center", "font-weight": "bold"}))
                    .append($(document.createElement("td")).text("6").css({"text-align": "center", "font-weight": "bold"}))
            )
            .append(trAperturaOcchi)
            .append(trRispostaVerbale)
            .append(trRispostaMotoria)
            .append(trAperturaOcchiP)
            .append(trRispostaVerbaleP)
            .append(trRispostaMotoriaP);


        if (eta >= 730 || eta == '' || cognome == 'SCONOSCIUTO'){

            trAperturaOcchiP.hide();
            trRispostaMotoriaP.hide();
            trRispostaVerbaleP.hide();
            tdLegenda.text('LEGENDA GLASGOW ');
            $('#cambiaScala').text('vai a scala pediatrica');

        }
        else if (eta < 730){
            trAperturaOcchi.hide();
            trRispostaMotoria.hide();
            trRispostaVerbale.hide();
            tdLegenda.text('LEGENDA GLASGOW PEDIATRICA')
        }

        if (motoria != '') {
            table.find("tr#motoria td").each(function () {
                if ($(this).find('input').attr("data-value") == motoria) {
                    $(this).find('input').attr("checked", "checked");
                }
            });
        }
        if (verbale != '') {
            table.find("tr#verbale td").each(function () {
                if ($(this).find('input').attr("data-value") == verbale) {
                    $(this).find('input').attr("checked", "checked");
                }
            });
        }
        if (aperturaocchi != '') {
            table.find("tr#aperturaocchi td").each(function () {
                if ($(this).find('input').attr("data-value") == aperturaocchi) {
                    $(this).find('input').attr("checked", "checked");
                }
            });
        }




        $.dialog(table, {
            id: "Dialog_scalaGlasgow",
            title: "Scala Glasgow",
            width: 700,
            showBtnClose: true,
            movable: true,
            buttons: [
                {label: "Salva", action: function (ctx) {
                    reportResult(ctx);
                }},
                {label: "Annulla", action: function (ctx) {
                    ctx.data.close();
                    $.dialog.hide();
                }}
            ]
        });






        function reportResult(ctx) {

            $("#hmotoria").val($("#motoria td input:checked").attr("data-value"));
            $("#hverbale").val($("#verbale td input:checked").attr("data-value"));
            $("#haperturaocchi").val($("#aperturaocchi td input:checked").attr("data-value"));
            $("#txtGlasgow").val($("#totale").text());
            home.PARAMETRI_VITALI.calcolateRTS();
            ctx.data.close();
            $.dialog.hide();
        }




    },








    cambiaScala: function(callback){

        $('#TableGlasgow').find('.legend').each(function(index, loopelement) {
           if ($(this).is(":visible")){
               $(this).hide();
           }
           else if ($(this).is(":hidden")){
               $(this).show();
           }
        });

        callback();


    },

    stickUrinario: function () {
        /**Salvo i dati nei campi nascosti
         * Creo la tabella nella finestra di dialog
         * Checco i check al caricamento se già salvato qualcosa
         * Lancio il Dialog
         * Salvo i dati in dei campi nascosti
         * Stampo il riassunto nel campo di testo*/

        var checkChetoni = $("#hchetoni").val();
        var checkEmazie = $("#hemazie").val();
        var checkProteine = $("#hproteine").val();
        var checkLeuocociti = $("#hleucociti").val();
        /*var noteChetoni = $("#hnotechetoni").val();
         var noteEmazie = $("#hnoteemazie").val();
         var noteProteine = $("#hnoteproteine").val();
         var noteLeucociti = $("#hnoteleucociti").val();*/
        var noteStickUrina = $("#hnoteStickUrina").val();

        var table =
            $(document.createElement("table")).attr({"id": "StickUrinario", "class": "tabledialog"})
                .append($(document.createElement("tr")).attr("id", "rilevazioni")
                    .append($(document.createElement("th")).text("Rilevazioni"))
                    .append($(document.createElement("th")).text("negativo"))
                    .append($(document.createElement("th")).text("+"))
                    .append($(document.createElement("th")).text("++"))
                    .append($(document.createElement("th")).text("+++"))
                    //.append($(document.createElement("th")).text("Note"))
                ).append($(document.createElement("tr")).attr("id", "chetoni")
                    .append($(document.createElement("td")).text("Chetoni"))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 0, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(0,'chetoni')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 1, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(1,'chetoni')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 2, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(2,'chetoni')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 3, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(3,'chetoni')"})))
                    //.append($(document.createElement("td")).append($(document.createElement("input")).attr({"type":"text"})))
                ).append($(document.createElement("tr")).attr("id", "emazie")
                    .append($(document.createElement("td")).text("Emazie"))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 0, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(0,'emazie')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 1, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(1,'emazie')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 2, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(2,'emazie')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 3, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(3,'emazie')"})))
                    //.append($(document.createElement("td")).append($(document.createElement("input")).attr({"type":"text"})))
                ).append($(document.createElement("tr")).attr("id", "proteine")
                    .append($(document.createElement("td")).text("Proteine"))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 0, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(0,'proteine')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 1, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(1,'proteine')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 2, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(2,'proteine')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 3, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(3,'proteine')"})))
                    //.append($(document.createElement("td")).append($(document.createElement("input")).attr({"type":"text"})))
                ).append($(document.createElement("tr")).attr("id", "leucociti")
                    .append($(document.createElement("td")).text("Leucociti "))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 0, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(0,'leucociti')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 1, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(1,'leucociti')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 2, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(2,'leucociti')"})))
                    .append($(document.createElement("td")).append($(document.createElement("input")).attr({"type": "checkbox", "data-value": 3, "onclick": "home.PARAMETRI_VITALI.checkOnlyOne(3,'leucociti')"})))
                    //.append($(document.createElement("td")).append($(document.createElement("input")).attr({"type":"text"})))
                ).append($(document.createElement("tr")).attr("id", "Note")
                    .append($(document.createElement("td")).text("Note"))
                    .append($(document.createElement("td")).attr({"colspan": "4"}).append($(document.createElement("textarea")))));

        checkValue('chetoni', table, checkChetoni);
        checkValue('emazie', table, checkEmazie);
        checkValue('proteine', table, checkProteine);
        checkValue('leucociti', table, checkLeuocociti);
        table.find('tr#Note td textarea').val(noteStickUrina);
        /*table.find('tr#chetoni td input[type="text"]').val(noteChetoni);
         table.find('tr#emazie td input[type="text"]').val(noteEmazie);
         table.find('tr#proteine td input[type="text"]').val(noteProteine);
         table.find('tr#leucociti td input[type="text"]').val(noteLeucociti);*/

        $.dialog(table, {
            id: "Dialog_stickuri",
            title: "Stick urinario",
            width: 550,
            showBtnClose: true,
            movable: true,
            buttons: [
                {label: "Salva", action: function (ctx) {
                    salvaDati(ctx);
                    riassuntoStick();
                }},
                {label: "Annulla", action: function (ctx) {
                    ctx.data.close();
                    riassuntoStick();
                    $.dialog.hide();
                }}
            ]
        });

        function checkValue(id, table, value) {
            if (value != '') {
                table.find("tr#" + id + " td").each(function () {
                    if ($(this).find('input').attr("data-value") == value) {
                        $(this).find('input').attr("checked", "checked");
                    }
                });
            }
        }

        function salvaDati(ctx) {
            $("#hchetoni").val($("#chetoni td input:checked").attr("data-value"));
            $("#hemazie").val($("#emazie td input:checked").attr("data-value"));
            $("#hproteine").val($("#proteine td input:checked").attr("data-value"));
            $("#hleucociti").val($("#leucociti td input:checked").attr("data-value"));
            $("#hnoteStickUrina").val($("#Note td textarea").val());
            /*$("#hnotechetoni").val($('#chetoni td input[type="text"]').val());
             $("#hnoteemazie").val($('#emazie td input[type="text"]').val());
             $("#hnoteproteine").val($('#proteine td input[type="text"]').val());
             $("#hnoteleucociti").val($('#leucociti td input[type="text"]').val());*/
            ctx.data.close();
            $.dialog.hide();
        }

        function riassuntoStick() {
            /**Alla chiusura della dialog stampa un riassunto*/
            var jsonValori = {
                "C": $("#hchetoni").val(),
                "E": $("#hemazie").val(),
                "P": $("#hproteine").val(),
                "L": $("#hleucociti").val()
            };
            var stringaOutput = "";

            $.each(jsonValori, function (chiave, valore) {
                stringaOutput += chiave+"=";
                for (var i = 0; i < valore; i++) {
                    stringaOutput += "+";
                }
                if(valore==0){ stringaOutput += "negativo" ; }

                stringaOutput += "  ";
            });

            $("#txtStickUri").val(stringaOutput);
        }

    },
     legendaRTS :function  () {
         var table =
             $(document.createElement("table")).attr({"id": "RTS_Legend", "class": "tabledialog"})
                 .append($(document.createElement("tr")).attr("id", "rilevazioni")
                     .append($(document.createElement("th")).text("Glasgow Coma Scale"))
                     .append($(document.createElement("th")).text("P A sistolica"))
                     .append($(document.createElement("th")).text("Frequenza respiratoria"))
                     .append($(document.createElement("th")).text("Punteggio"))
             ).append($(document.createElement("tr")).attr("id", "p4")
                     .append($(document.createElement("td")).text("13 - 15"))
                     .append($(document.createElement("td")).text("> 89"))
                     .append($(document.createElement("td")).text("10 - 29"))
                     .append($(document.createElement("td")).text("4"))
             ).append($(document.createElement("tr")).attr("id", "p3")
                     .append($(document.createElement("td")).text("9 - 12"))
                     .append($(document.createElement("td")).text("76 - 89"))
                     .append($(document.createElement("td")).text("> 29"))
                     .append($(document.createElement("td")).text("3"))
             ).append($(document.createElement("tr")).attr("id", "p2")
                     .append($(document.createElement("td")).text("6 - 8"))
                     .append($(document.createElement("td")).text("50 - 75"))
                     .append($(document.createElement("td")).text("6 - 9"))
                     .append($(document.createElement("td")).text("2"))
             ).append($(document.createElement("tr")).attr("id", "p1")
                     .append($(document.createElement("td")).text("4 - 5"))
                     .append($(document.createElement("td")).text("1 - 49"))
                     .append($(document.createElement("td")).text("1 - 5"))
                     .append($(document.createElement("td")).text("1"))

             ).append($(document.createElement("tr")).attr("id", "p0")
                 .append($(document.createElement("td")).text("3"))
                 .append($(document.createElement("td")).text("0"))
                 .append($(document.createElement("td")).text("0"))
                 .append($(document.createElement("td")).text("0")));

         $.dialog(table, {
             id          : "Dialog_RTS",
             title       : "RTS legenda",
             width       : 550,
             showBtnClose: true,
             movable     : true,
             buttons     : [
                 {label: "OK", action: function (ctx) {
                     ctx.data.close();
                     $.dialog.hide();
                 }
                 },
                 {label: "CALCOLA", action: function (ctx) {
                     PARAMETRI_VITALI.calcolateRTS();
                     ctx.data.close();
                     $.dialog.hide();
                 }
                 }
             ]
         });
     },

/**
     * Funzione che crea la finistra di dialogo per la WK dove ci sono le info
     * dettagliate sul paziente.
     */
    InfoAnag: function (data, wk, td, params) {
        var tableinfoAnag;
        var default_params = {
            query: "WORKLIST.INFO_ANAGRAFICA",
            datasource: "PS",
            params_where: {
                "iden_anag": {t:'N', v: data.IDEN_ANAG}
            },
            order: null,
            title: traduzione.lblDettaglioAnag,
            width_info: "600px"
        };
        params = $.extend(true, default_params, params);
        var $icon = $(document.createElement('i')).attr({
            "class": "icon-info-circled",
            "title": traduzione.lblDettaglioAnag,
            "id": traduzione.lblInfo
        });
        $icon.on("click", function (e) {
            if (params.query != "") {

                var db = $.NS_DB.getTool({setup_default:{datasource:params.datasource,async:false}});

                var xhr = db.select({
                    id: params.query,
                    parameter: params.params_where
                });

                xhr.done(function (data, textStatus, jqXHR) {
                    tableinfoAnag = $(document.createElement("table")).attr("id", "divInfoAnag");
                    $.each(data.result, function (k, v) {
                        //per le cittadinanze multiple
                        var cittadinanza = '';
                        $($.parseXML(v.CITTADINANZA)).find('ITEM').each(function(){
                            cittadinanza = cittadinanza + ' ' + $(this).attr("DESCR");
                        });

                        tableinfoAnag.append($(document.createElement("table")).attr("class", "tabledialog")
                                .append($(document.createElement("tr")).attr("class", "infoTitolo")
                                    .append($(document.createElement("td")).text(traduzione.lblCognomeWK))
                                    .append($(document.createElement("td")).text(traduzione.lblNomeWK))
                                    .append($(document.createElement("td")).text(traduzione.lblDataNascita))
                                    .append($(document.createElement("td")).text(traduzione.lblCodiceFiscaleWK))
                                    .append($(document.createElement("td")).text(traduzione.lblSesso))
                            )
                                .append($(document.createElement("tr")).attr("class", "infoDati")
                                    .append($(document.createElement("td")).text(LIB.isValid(v.COGNOME)?v.COGNOME:''))
                                    .append($(document.createElement("td")).text(LIB.isValid(v.NOME)?v.NOME:'' ))
                                    .append($(document.createElement("td")).text(LIB.isValid(v.DATA_NASCITA)?v.DATA_NASCITA:'' ))
                                    .append($(document.createElement("td")).text(LIB.isValid(v.CODICE_FISCALE)?v.CODICE_FISCALE:'' ))
                                    .append($(document.createElement("td")).text(LIB.isValid(v.SESSO)?v.SESSO:''))
                            )
                                .append($(document.createElement("tr")).attr("class", "infoTitolo")
                                    .append($(document.createElement("td")).text(traduzione.lblComuneNascita))
                                    .append($(document.createElement("td")).text(traduzione.lblComuneResidenza))
                                    .append($(document.createElement("td")).text(traduzione.lblResIndirizzo))
                                    .append($(document.createElement("td")).text(traduzione.lblResTelefono))
                                    .append($(document.createElement("td")).text(traduzione.lblCellulare))
                            )
                                .append($(document.createElement("tr")).attr("class", "infoDati")
                                    .append($(document.createElement("td")).text(LIB.isValid(v.COMUNE_NASCITA)?v.COMUNE_NASCITA:'' ))
                                    .append($(document.createElement("td")).text(LIB.isValid(v.COMUNE_RESIDENZA)?v.COMUNE_RESIDENZA:'' ))
                                    .append($(document.createElement("td")).text(LIB.isValid(v.RES_INDIRIZZO)?v.RES_INDIRIZZO:'' ))
                                    .append($(document.createElement("td")).text(LIB.isValid(v.RES_TELEFONO)?v.RES_TELEFONO:'' ))
                                    .append($(document.createElement("td")).text(LIB.isValid(v.RES_CELLULARE)?v.RES_CELLULARE:''))
                            )
                                .append($(document.createElement("tr")).attr("class", "infoTitolo")
                                    .append($(document.createElement("td")).text(traduzione.lblComuneDomicilio))
                                    .append($(document.createElement("td")).text(traduzione.lblDomIndirizzo))
                                    .append($(document.createElement("td")).text(traduzione.lblStatoCivile))
                                    .append($(document.createElement("td")).text(traduzione.lblNazione))
                                    .append($(document.createElement("td")).text(traduzione.lblCittadinanza))
                            )
                                .append($(document.createElement("tr")).attr("class", "infoDati")
                                    .append($(document.createElement("td")).text(LIB.isValid(v.COMUNE_DOMICILIO)?v.COMUNE_DOMICILIO:'' ))
                                    .append($(document.createElement("td")).text(LIB.isValid(v.DOM_INDIRIZZO)?v.DOM_INDIRIZZO:''))
                                    .append($(document.createElement("td")).text(LIB.isValid(v.STATO_CIVILE)?v.STATO_CIVILE:''))
                                    .append($(document.createElement("td")).text(LIB.isValid(v.NAZIONE)?v.NAZIONE:''))
                                    .append($(document.createElement("td")).text(LIB.isValid(cittadinanza)?cittadinanza:''))
                            )
                        )
                    });

                    $.infoDialog({
                        event: e,
                        classPopup: "",
                        headerContent: params.title,
                        content: tableinfoAnag,
                        width: params.width_info,
                        dataJSON: false,
                        classText: "infoDialogTextMini"
                    });
                });
                xhr.fail(function (jqXHR, textStatus, errorThrown) {
                   logger.error('Errore infoanag jqXHR -> ' + JSON.stringify(jqXHR));
                   home.NOTIFICA.error({message: "Errore nel recepire i dati anagrafici", title: "Error"});
                });


            }
        });
        return $icon;
    },
    dettaglioEsaObiettPrec: function(rec){
        var table =
            $(document.createElement("table")).attr({"id": "EsaObiettivoPrecedenti", "class": "tabledialog"})
                .append($(document.createElement("tr")).attr("id", "titoli")
                    .append($(document.createElement("th")).text("Esame Obiettivo").css({"text-align": "center", "font-weight": "bold"}))
            );
            table.append(
                $(document.createElement("tr")).attr("id", "testi")
                    .append($(document.createElement("td")).text(rec.ESAME_OBIETTIVO).css({"text-align": "justify"}))
            );
        $.dialog(table, {
            id: "DialogAnamEsaObiPrecedenti",
            title: "Esame Obiettivo Precedenti",
            width: 800,
            showBtnClose: true,
            movable: true,
            buttons: [
                {label: "Chiudi", action: function (ctx) {
                    ctx.data.close();
                    $.dialog.hide();
                }}
            ]
        });
    },
    dettaglioAnamnesiPrecedenti: function(rec){
        var table =
            $(document.createElement("table")).attr({"id": "AnamnesiPrecedenti", "class": "tabledialog"})
                .append($(document.createElement("tr")).attr("id", "titoli")
                    .append($(document.createElement("th")).text("Allergie").css({"text-align": "center", "font-weight": "bold"}))
                    .append($(document.createElement("th")).text("Terapie in corso").css({"text-align": "center", "font-weight": "bold"}))
                    .append($(document.createElement("th")).text("Malattie sofferte").css({"text-align": "center", "font-weight": "bold"}))
                    .append($(document.createElement("th")).text("Ultimo pasto assunto").css({"text-align": "center", "font-weight": "bold"}))
                    .append($(document.createElement("th")).text("Interventi chirurgici subiti").css({"text-align": "center", "font-weight": "bold"}))
            );
        table.append(
            $(document.createElement("tr")).attr("id", "testi")
                .append($(document.createElement("td")).text(rec.ALLERGIE).css({"text-align": "justify"}))
                .append($(document.createElement("td")).text(rec.TERAPIE).css({"text-align": "justify"}))
                .append($(document.createElement("td")).text(rec.MALATTIE).css({"text-align": "justify"}))
                .append($(document.createElement("td")).text(rec.ULTIMO_PASTO).css({"text-align": "justify"}))
                .append($(document.createElement("td")).text(rec.INTERVENTI).css({"text-align": "justify"}))
        );
        $.dialog(table, {
            id: "DialogAnamnesiPrecedenti",
            title: "Anamnesi Precedenti",
            width: 800,
            showBtnClose: true,
            movable: true,
            buttons: [
                {label: "Chiudi", action: function (ctx) {
                    ctx.data.close();
                    $.dialog.hide();
                }}
            ]
        });
    },
    createDialogAvvertenze : function(idenAnag,e){

        var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE',async:false}});

        var params ={"idenAnag" : {'v':Number(idenAnag), 't':'N'}};

        logger.debug(JSON.stringify(params));
        var xhr = db.select({
            id       : "CCE.Q_DATI_AVVERTENZE",
            parameter: params
        });

        xhr.done(function (data, textStatus, jqXHR) {
            logger.debug(JSON.stringify(data));

            var result = data.result;
            var tableinfoAvvertenze = $(document.createElement("table")).attr("class", "tabledialog");

            if(result != '' && typeof result != 'undefined'){
                tableinfoAvvertenze.append(
                    $(document.createElement("tr")).attr("class", "infoTitolo")
                        .append($(document.createElement("th")).text(traduzione.lblTipo))
                        .append($(document.createElement("th")).text(traduzione.lblDescrizione)));

                $.each(result, function (k, v)
                {
                    // logger.debug('TIPO = ' + v[count].TIPO + ' DEscrizione = ' + v[count].DESCRIZIONE+ ' DATA MODIFICA = ' +v[count].DATA_MODIFICA +' UTENTE MODIFICA = '+ v[count].DESCR_UTE_INS );
                    tableinfoAvvertenze.append(
                        $(document.createElement("tr")).attr("class", "infoDati")
                            .append($(document.createElement("td")).text(LIB.isValid(v.TIPO)? v.TIPO:''))
                            .append($(document.createElement("td")).text(LIB.isValid(v.DESCRIZIONE)?v.DESCRIZIONE:'' ))
                    )
                });
            } else {
                logger.debug("iden_anag = "+idenAnag+" result ->" + JSON.stringify(data));
                tableinfoAvvertenze.append(
                    $(document.createElement("tr")).attr("class", "infoDati")
                        .append($(document.createElement("td")).text("NESSUNA AVVERTENZA TROVATA"))
                );
            }

            $.infoDialog({
                event: e,
                classPopup: "",
                headerContent: "Info avvertenze",
                content: tableinfoAvvertenze,
                dataJSON: false,
                classText: "infoDialogTextMini"
            });

        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            home.NOTIFICA.error({message: "Errore nel get Q_DATI_AVVERTENZE", title: "Error"});
            logger.error( 'getAvvertenzeFromWhale Error -> ' + JSON.stringify(jqXHR));
        });

    },
    /**
     * funzione che crea il dialog per gli organismi multiresistenti
     * */
    createDialogOrganismiMultiresistenti:function(idenAnag,e){

        function functionOK(data){
            logger.debug(JSON.stringify(data));

            var result = data.result;
            var tableinfo = $(document.createElement("table")).attr("class", "tabledialog");

            if(result != '' && typeof result != 'undefined'){
                tableinfo.append(
                    $(document.createElement("tr")).attr("class", "infoTitolo")
                        .append($(document.createElement("th")).text("DESCRIZIONE"))
                        .append($(document.createElement("th")).text("POSITIVITA'"))
                        .append($(document.createElement("th")).text("DATA POSITIVITA'"))
                        .append($(document.createElement("th")).text("POS PREGRESSA"))
                        .append($(document.createElement("th")).text("DATA POS PREGRESSA")));

                $.each(result, function (k, v)
                {
                    // logger.debug('TIPO = ' + v[count].TIPO + ' DEscrizione = ' + v[count].DESCRIZIONE+ ' DATA MODIFICA = ' +v[count].DATA_MODIFICA +' UTENTE MODIFICA = '+ v[count].DESCR_UTE_INS );
                    tableinfo.append(
                        $(document.createElement("tr")).attr("class", "infoDati")
                            .append($(document.createElement("td")).text(LIB.isValid(v.DESCR)? v.DESCR:''))
                            .append($(document.createElement("td")).text(LIB.isValid(v.POSITIVITA)? v.POSITIVITA:''))
                            .append($(document.createElement("td")).text(LIB.isValid(v.DATA_POSITIVITA)?v.DATA_POSITIVITA:'' ))
                            .append($(document.createElement("td")).text(LIB.isValid(v.PROGRESSIVITA_PREGRESSA)?v.PROGRESSIVITA_PREGRESSA:'' ))
                            .append($(document.createElement("td")).text(LIB.isValid(v.DATA_P_PREGRESSA)?v.DATA_P_PREGRESSA:'' ))

                    )
                });
            } else {
                logger.debug("iden_anag = "+idenAnag+" result ->" + JSON.stringify(data));
                tableinfo.append(
                    $(document.createElement("tr")).attr("class", "infoDati")
                        .append($(document.createElement("td")).text("NESSUN ORGANISMO TROVATO"))
                );
            }

            $.infoDialog({
                event: e,
                classPopup: "",
                headerContent: "Info Organismi",
                content: tableinfo,
                dataJSON: false,
                classText: "infoDialogTextMini"
            });

        }

         var par = {
            datasource : 'WHALE',
            id : 'CCE.Q_GET_ORGANISMI',
            params : {"idenAnag" : {'v':Number(idenAnag), 't':'N'}},
            callbackOK : functionOK
        };

        NS_CALL_DB.SELECT(par);

    }

};
