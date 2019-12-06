/**
 * Created by matteo.pipitone on 11/08/2015.
 */
$(document).ready(function(){
    NS_INS_MALATTIE_RARE.init();
    NS_INS_MALATTIE_RARE.setEvent();
    NS_FENIX_SCHEDA.registra = NS_INS_MALATTIE_RARE.registra;

});

var NS_INS_MALATTIE_RARE =
{
    init: function (){
        NS_FENIX_SCHEDA.addFieldsValidator({config: "V_INS_MALATTIE_RARE"});
        $("body").height(400);
    },
    setEvent : function (){},
    registra:function () {

        if(!NS_FENIX_SCHEDA.validateFields()){
            return;
        }
        var iden_anag = $("#IDEN_ANAG").val();
        var terapie = $("#taTerapie").val();
        var note = $("#taDoseMinima").val();
        var txtSceltaMalattia = $("#txtSceltaMalattia");
        var cod_ICD9 =  $("#h-txtSceltaMalattia").val();
        var descr_IDC9 = txtSceltaMalattia.val();
        var par;
        if($("#STATO_PAGINA").val() == 'I'){
            par = {
                datasource : 'MMG',
                id: 'SP_INS_PROBLEMA',
                params: {
                    pIdenAccesso : {"t":'N', "v": null},
                    pIdenAnag : {"t":'N', "v":iden_anag },
                    PIDENMED : {"t":'N', "v": home.baseUser.IDEN_PER},
                    pUtente : {"t":'N', "v": home.baseUser.IDEN_PER},
                    pTipologiaProblema : {"t":'V', "v": null},
                    pCodICD : {t:"V", v:cod_ICD9},
                    pDescrICD : {t:"V", v:descr_IDC9},
                    pDescrizione : {"t":'V', "v":terapie},
                    pNote : {"t":'V', v:note},
                    pData : {"t":'V', "v": moment().format('YYYYMMDD')},
                    pRischio : {"t":'V', "v": null},
                    v_oscurato : {"t":'V', "v": "S"},
                    v_sito :  {"t":'V', "v": home.baseGlobal.SITO},
                    p_result : {d:'O'}

                },
                callbackOK : function (resp){
                    if(resp.p_result.split('$')[0] == 'OK'){
                        home.NOTIFICA.success({title : 'Success', message:"Salvataggio eseguito correttamente",timeout: 3});
                        home.MALATTIE_RARE.MALATTIE_RARE.caricaWK();
                        NS_FENIX_SCHEDA.chiudi();
                    }
                }
            };

        }else{
            /**
             * SP_UPDATE_PROBLEMA (
             pIdenProblema   in number,
             pData           in varchar2,
             pCodice         in varchar2,
             pDescr          in varchar2,
             pProblema       in varchar2,
             pNote           in varchar2,
             pIdenIcd        in number,
             pRischio        in varchar2,
             p_result        out nocopy varchar2)
             */
            par = {
                datasource : 'MMG',
                id: 'SP_UPDATE_PROBLEMA',
                params: {
                    pIdenProblema : {"t":'N', "v": $("#IDEN").val()},
                    pData : {"t":'V', "v": moment().format('YYYYMMDD')},
                    pCodice : {t:"V", v:cod_ICD9},
                    pDescr : {t:"V", v:descr_IDC9},
                    pProblema : {"t":'V', "v":terapie},
                    pNote : {"t":'V', v:note},
                    pIdenIcd : {"t":'N', "v": ""},
                    pRischio : {"t":'V', "v": null},
                    p_result : {d:'O'}

                },
                callbackOK : function (resp){
                    if(resp.p_result.split('$')[0] == 'OK'){
                        home.NOTIFICA.success({title : 'Success',message:"Salvataggio eseguito correttamente",timeout: 3});
                        home.MALATTIE_RARE.MALATTIE_RARE.caricaWK();
                        NS_FENIX_SCHEDA.chiudi();
                    }
                }
            };


        }

        NS_CALL_DB.PROCEDURE(par);
    },
    valorizeDescr : function (value) {
        var txtMalattieRare =   $("#txtMalattieRare");
        var note = txtMalattieRare.val();
        note +=  value;
        txtMalattieRare.val(note);

    }

};