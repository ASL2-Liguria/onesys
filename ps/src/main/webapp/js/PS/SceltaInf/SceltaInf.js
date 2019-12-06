/**
 * author: Matteop+Carlog
 * Js del pop-up della scelta ifernuieristica
 * gestisce la presa in carico medica
 * Gestisce anche il passaggio di consegne infermieristico
 * in URL dovrebbe esserci un parametro type le varie opzioni sono (per adesso)
 * PASSAGGIO_DI_CONSEGNE_LISTA_APERTI
 * PRESA_IN_CARICO
 *
 * */
$(function() {
    SCELTA_INF.init();
    SCELTA_INF.setEvents();
    NS_FENIX_SCHEDA.registra = SCELTA_INF.registra;
});

var SCELTA_INF = {

    init : function() {
        if(home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST'){
            NS_FENIX_SCHEDA.addFieldsValidator({config: "V_SCELTA_INF"});
        }
        $(".contentTabs").css({"height":"300px"});
        $("#ptTimeSelectCntr").hide();
        $('#acSceltaInf').data('acList').changeBindValue({"iden_cdc": Number(home.baseUserLocation.iden)});

    },
    setEvents : function() {

    },
    registra:function(){
        if(NS_FENIX_SCHEDA.validateFields()){
            var idenContattto = $("#IDEN_CONTATTO");
            var sceltaInf = $("#h-txtSceltaInf");
            var tabSel = home.NS_FENIX_PS.tab_sel;
            var type = $("#TYPE").val();

            switch (tabSel){
                case 'filtroAttesa':
                    if(home.baseUser.TIPO_PERSONALE == 'M'){
                        home.NS_FENIX_PS.presaInCarico($('#IDEN_ANAG').val(), idenContattto.val(),$("#IDEN_PROVENIENZA").val(),
                            $("#CODICE_FISCALE").val(), $("#IDEN_LISTA").val(), $('#URGENZA').val(),sceltaInf.val(),
                            $("#IDEN_CDC_PS").val(),$("#CONTGIU_CDC").val(),$("#CONTGIU_PROV").val(), $("#CARTELLA").val());
                    }else{
                        home.NS_WK_PS.passaggioDiConsegne(sceltaInf.val(), null, type);
                    }

                    break;
                case 'filtroAperti':

                     if (type == 'PASSAGGIO_DI_CONSEGNE_LISTA_APERTI') {
                         home.NS_WK_PS.passaggioDiConsegne(sceltaInf.val(), null, type);
                     } else{
                         home.NS_WK_PS.presaInCaricoMedico(sceltaInf.val(), type);

                     }
                    break;
                case 'filtroOBI':
                    if (type == 'PASSAGGIO_DI_CONSEGNE_LISTA_OBI') {
                        home.NS_WK_PS.passaggioDiConsegne(sceltaInf.val(), null, type);
                    } else{
                        home.NS_WK_PS.presaInCaricoMedico(sceltaInf.val(), type);

                    }
                    break;
                default :
                    logger.warn("SCELTA_INF.registra : tab_sel is not defined or unknown = "+ tabSel);
                    break;
            }
            return NS_FENIX_SCHEDA.chiudi();
        }
    }
};