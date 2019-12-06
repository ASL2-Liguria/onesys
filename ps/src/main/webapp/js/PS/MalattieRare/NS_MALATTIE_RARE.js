/**
 * Created by matteo.pipitone on 11/08/2015.
 */

var NS_MALATTIE_RARE = {

    apriPaginaInserimento : function (idenAnag, stato_pagina, iden) {

        var url = 'page?KEY_LEGAME=INS_MALATTIE_RARE&STATO_PAGINA='+stato_pagina+'&IDEN_ANAG='+ idenAnag+"&READONLY="+$("#READONLY").val() +
            '&IDEN='+ (iden != 'undefined' ? iden : '');

        home.NS_FENIX_TOP.apriPagina(
            {
                url: url,
                id:'dettAnag',
                fullscreen:true
            }
        );
    },
    deleteMalattia : function (idenProblema) {

        var table = $("<table></table>").attr({"class": "tabledialog"})
            .append($(document.createElement("tr"))
                .append($(document.createElement("th")).text("Motivo Cancellazione"))
                .append($(document.createElement("tr"))
                    .append($(document.createElement("td"))
                        .append($(document.createElement("textarea")).attr("id","MotivoCancellazione"))
                )
            )
        );

        home.$.dialog(table,{
            title: "Elimina malattia rara",
            buttons: [
                {label: "Salva", action: function () {

                    deleteProblema();
                    home.$.dialog.hide()
                }},
                {label: "Chiudi", action: function () {
                    home.$.dialog.hide();
                }}
            ]
        });
        function deleteProblema () {

            var par = {

                datasource : 'MMG',
                id: 'SP_CLOSE_PROBLEMA',
                params: {
                    V_IDEN_PROBLEMA : {"t":'N', "v": idenProblema},
                    PUTENTE : {"t":'N', "v": home.baseUser.IDEN_PER},
                    PNOTECHIUSURA : {"t":'V', "v": $("#MotivoCancellazione").val()},
                    PDATACHIUSURA : {"t":'V', "v": moment().format("YYYYMMDD HH:mm:ss")},
                    PRILEVANTE: {"t":'V', "v": null},
                    V_OUT : {d:'O'}

                },
                callbackOK : function (resp){

                    if(resp.V_OUT.split('$')[0] == 'OK'){
                        home.NOTIFICA.success({message:"Cancellazione eseguita correttamente",timeout: 3});
                        home.MALATTIE_RARE.MALATTIE_RARE.caricaWK();
                    }
                }
            };

            NS_CALL_DB.PROCEDURE(par);
        }


    },
    insNota : function (params){
        /**
         PIDENANAG IN NUMBER,
         PIDENMED IN NUMBER,
         PUTENTE IN NUMBER,
         PIDENACCESSO IN NUMBER,

         PIDENPROBLEMA IN NUMBER,
         P_DATA IN VARCHAR2,
         P_NOTEDIARIO IN clob,
         P_IDEN_NOTA IN NUMBER := NULL,
         P_TIPO IN VARCHAR := NULL,
         V_RETURN_DIARIO OUT NOCOPY VARCHAR2
         */
        $.extend(params.parametri,{P_ACTION:'INS'});
        NS_MALATTIE_RARE.workOnNota(params);
    },
    editNota : function (params) {

        $.extend(params.parametri,{P_ACTION:'MOD'});

        NS_MALATTIE_RARE.workOnNota(params);
    },
    delNota : function (params) {

        $.extend(params.parametri,{P_ACTION:'DEL'});
        NS_MALATTIE_RARE.workOnNota(params);
    },
    workOnNota : function (params) {
        /**
         * parametri : {}
         * callback : <function()>
         * */
        $.extend(params.parametri, {"V_RETURN_DIARIO":{d:'O'}});
//        @todo sostituire SP_NOTE_DIARIO
        var par = {
            'datasource':'MMG',
            'id': 'SP_NOTE_DIARIO_2',
            'params' : params.parametri,
            'callbackOK':callBackOK
        };
        function callBackOK (resp) {

            if(params.cbkOK != 'undefined'){
                params.cbkOK(resp);
            }else{
                logger.debug(JSON.stringify(resp));
            }
        }
        NS_CALL_DB.PROCEDURE(par);

    }
};