/**
 * Created by matteo.pipitone on 11/08/2015.
 */
$(function() {
    MALATTIE_RARE.init();
    MALATTIE_RARE.setEvents();
    NS_FENIX_SCHEDA.registra =   MALATTIE_RARE.registra;
});

var MALATTIE_RARE = {

    wk_malattie_rare : null,
    iden_problema_sel : null,

    init: function () {
        home.MALATTIE_RARE = window;
        home.NS_CONSOLEJS.addLogger({name: 'MALATTIE_RARE', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['MALATTIE_RARE'];
        MALATTIE_RARE.caricaWK();
    },
    setEvents : function () {

    },
    caricaWK : function () {

        $("div#divWkMalattieRare").height(parseInt($(".contentTabs").height() - 70));
        var idenAnag = $("#IDEN_ANAG").val();
        MALATTIE_RARE.wk_malattie_rare = new WK({
            id: "MALATTIE_RARE",
            container: "divWkMalattieRare",
            loadData : true,
            aBind: ["iden_anag"],
            aVal: [idenAnag]
        });
        MALATTIE_RARE.wk_malattie_rare.loadWk();
    },
    caricaWkDiari : function (rec) {
        logger.debug("Iden Problema ->" +  rec.IDEN);
        MALATTIE_RARE.iden_problema_sel = rec.IDEN;
        var w = $.managerWhere();
        w.set('',
            new Array("iden_problema"),
            new Array(rec.IDEN.toString())
        );
        return w;
    },
    inserisciNotaDiario : function(rec){
        // se è IE bisogna lavorare diversamente la dimensione della textarea.
        var textarea = $(document.createElement("textarea")).attr("id","Nota");
        if(home.NS_FENIX_PS.isIE == true){
            textarea.attr({rows:"15", cols:"60"});
        }else{
            textarea.css({"width":"100%", height:"100%"});
        }


        var table = $("<table></table>").css({width: "100%",height: "100%"})
            .append($(document.createElement("tr"))
                .append($(document.createElement("th")).text("Nota"))
                .append($(document.createElement("td"))
                        .append(textarea)
                )
        );

        $.dialog(table,{
            title: "Inserisci Nota",
            width : 600,
            height : 300,
            buttons: [
                {label: "Salva", action: function () {

                    MALATTIE_RARE.registra({
                        operazione:'INS',
                        testo : $("#Nota").val()
                    });
                    $.dialog.hide();
                }},
                {label: "Chiudi", action: function () {
                    $.dialog.hide();
                }}
            ]
        });

    },
    modificaNotaDiario : function (rec){
        // se è IE bisogna lavorare diversamente la dimensione della textarea.
        var textarea = $(document.createElement("textarea")).attr("id","Nota").text(rec[0].NOTE);
        if(home.NS_FENIX_PS.isIE == true){
            textarea.attr({rows:"15", cols:"60"});
        }else{
            textarea.css({"width":"100%", height:"100%"});
        }
        var table = $("<table></table>").css({width: "100%",height: "100%"})
            .append($(document.createElement("tr"))
                .append($(document.createElement("th")).text("Nota"))
                .append($(document.createElement("td"))
                    .append(textarea)
                )

        );

        $.dialog(table,{
            title: "Modifica Nota",
            width : 600,
            height : 300,
            buttons: [
                {label: "Salva", action: function () {

                    MALATTIE_RARE.registra({
                        operazione:'EDIT',
                        iden_nota : rec[0].IDEN,
                        testo : $("#Nota").val()
                    });
                    $.dialog.hide()
                }},
                {label: "Chiudi", action: function () {
                    $.dialog.hide();
                }}
            ]

        });
    },
    deleteNotaDiario : function (rec) {
        //[{"N_ROW":1,"NOTE":"sempre ricoverata in casa di cura presentazione","IDEN_PROBLEMA":295482,"UTE_INS":21143,"IDEN":346182}][TYPEOF] : string
        home.DIALOG.si_no({
            title: "Cancellazione Nota",
            msg:"Attenzione: sicuri di cancellare la nota?",
            cbkNo:function(){ $.dialog.hide(); },
            cbkSi: function(){
                cbkSi();
            }
        });
        function cbkSi () {
            var par = {
                PIDENANAG : {t:'N', v: $("#IDEN_ANAG").val()},
                PIDENMED : {t:'N', v: home.baseUser.IDEN_PER},
                PIDENACCESSO : {t:'N', v: null},
                PIDENPROBLEMA : {t:'N', v: rec[0].IDEN_PROBLEMA},
                P_DATA : {t:'V', v: moment().format('YYYYMMDD')},
                P_NOTEDIARIO : {t:'C', v: rec[0].NOTE },
                PUTENTE : {t:'N', v: home.baseUser.IDEN_PER},
                P_IDEN_NOTA : {t:'N', v:rec[0].IDEN}

            };

            var parametri =
            {
                parametri : par, cbkOK : function (resp) {
                if(resp.V_RETURN_DIARIO.split("$")[0] == 'OK'){

                    var sub = $('#divWkMalattieRare').worklist();
                    var subWk = sub.sub_worklist.get();
                    if(!subWk)
                    {
                        sub.data.load();
                    }
                    else
                    {
                        subWk.data.load();
                    }

                }else{
                    logger.error(JSON.stringifY(resp));
                    home.NOTIFICA.error({message: "Errore nel salvataggio della nota", title: "Error", timeout: 5});
                }
            }
            };
            NS_MALATTIE_RARE.delNota(parametri);
        }


    },
    registra: function (params) {
        /***
         *
         * operazione : <INS/EDIT>
         * iden_nota  : <iden della nota da modificare>
         * testo : text
         */

        var par = {
            PIDENANAG : {t:'N', v: $("#IDEN_ANAG").val()},
            PIDENMED : {t:'N', v: home.baseUser.IDEN_PER},
            PUTENTE : {t:'N', v: home.baseUser.IDEN_PER},
            PIDENACCESSO : {t:'N', v: null },
            PIDENPROBLEMA : {t:'N', v: MALATTIE_RARE.iden_problema_sel},
            P_DATA : {t:'V', v: moment().format('YYYYMMDD')},
            P_NOTEDIARIO : {t:'C', v: params.testo },
            p_sito : {t:'V', v: 'PS'}

        };

        var parametri =
        {
            parametri : par, cbkOK : function (resp){

                if(resp.V_RETURN_DIARIO.split("$")[0] == 'OK'){

                    var sub = $('#divWkMalattieRare').worklist();
                    var subWk = sub.sub_worklist.get();
                    if(!subWk)
                    {
                        sub.data.load();
                    }
                    else
                    {
                        subWk.data.load();
                    }

                }else{
                    logger.error(JSON.stringifY(resp));
                    home.NOTIFICA.error({message: "Errore nel salvataggio della nota", title: "Error", timeout: 5});
                }

            }
        };
        if(params.operazione == 'EDIT' ){
            //MODIFICA
            $.extend(parametri.parametri, {P_IDEN_NOTA: {t:'N', v:params.iden_nota }});
            NS_MALATTIE_RARE.editNota(parametri)
        }else if(params.operazione == 'INS'){
            //INSERIMENTO

            NS_MALATTIE_RARE.insNota(parametri)
        }
        else{
            alert("OPERAZIONE NON IMPLEMENTATA -> " + params.operazione);
        }
    }

};