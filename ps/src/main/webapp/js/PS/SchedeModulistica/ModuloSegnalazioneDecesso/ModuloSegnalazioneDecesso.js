/**
 * User: carlog
 *
 * Date: 11/03/14
 */

jQuery(document).ready(function () {

    NS_MOD_SEGNALAZIONE_DECESSO.init();
    NS_MOD_SEGNALAZIONE_DECESSO.setEvents();

});

var NS_MOD_SEGNALAZIONE_DECESSO = {
    firma : false,
    idenScheda : null,

    init: function(){
        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params;};
        NS_FENIX_SCHEDA.successSave = NS_MOD_SEGNALAZIONE_DECESSO.successSave;
        $('#radSegnalazione').find('div').width(300);
        NS_MOD_SEGNALAZIONE_DECESSO.detectStatoPagina();
        NS_MOD_SEGNALAZIONE_DECESSO.checkStatoFirma($("#hStatoScheda").val());
        home.NS_FENIX_PS.IDEN_SCHEDA = jsonData.hIDEN;
    },

    detectStatoPagina: function(){
        if($("#STATO_PAGINA").val() == "E"){
            $("div.headerTabs").html("<h2 style='color: rgb(255, 255, 0);' id='lblAlertModifica'>MODIFICA</h2>");
        }
    },

    checkStatoFirma : function(stato){

        $("#IS_DA_FIRMARE").val(stato == "F" ? "S" : "N");

        logger.debug("IS_DA_FIRMARE -> " + $("#IS_DA_FIRMARE").val());

        if(stato === "F"){
            $(".butSalva").hide();
        }
    },

    setEvents: function(){
        $(".butFirma").on("click", function () {
            NS_MOD_SEGNALAZIONE_DECESSO.firma = true;
            home.NS_LOADING.showLoading({"timeout": "0", "testo": "FIRMA", "loadingclick": function () {home.NS_LOADING.hideLoading();}});
            NS_FENIX_SCHEDA.registra();

        });
    },

    successSave: function (message) {

        NS_FIRMA_MODULI.setIdenScheda(message);

        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");

        if (NS_MOD_SEGNALAZIONE_DECESSO.firma == true)
        {
            NS_REGISTRAZIONE_FIRMA.firma();
        }
       /* else
        {
            NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_SEGNALAZIONE_DECESSO = 'E';});
        }*/
    }
};


var NS_REGISTRAZIONE_FIRMA =
{
    firma : function (p) {

        $("#butSalva, #butFirma").off("click");

        NS_FIRMA_MODULI.setIdenContatto($("#IDEN_CONTATTO").val());
        NS_FIRMA_MODULI.setStatoVerbale(jsonData.hStatoScheda);
        NS_FIRMA_MODULI.setDocumento("MODULO_SEGNALAZIONE_DECESSO");
        NS_FIRMA_MODULI.setReport("MODULO_SEGNALAZIONE_DECESSO");
        NS_FIRMA_MODULI.setCallback(function(){
            //NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){});
            if (typeof home.CARTELLA !== 'undefined') {
                home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_SEGNALAZIONE_DECESSO = 'E';
            }
            home.NS_LOADING.hideLoading();});
        NS_FIRMA_MODULI.setListaChiusi($("#LISTA_CHIUSI").val());

        if(typeof p != 'undefined'){
            NS_FIRMA_MODULI.firmaGenericaModuli(p);
        }else{
            NS_FIRMA_MODULI.firmaGenericaModuli();
        }
    }

};