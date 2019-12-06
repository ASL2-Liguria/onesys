/**
 * User: carlog
 *
 * Date: 11/03/14
 */

jQuery(document).ready(function () {

    NS_MOD_ADR.init();
    NS_MOD_ADR.setEvents();

});

var NS_MOD_ADR = {
    firma : false,
    idenScheda : null,

    init: function(){
        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params;};
        NS_FENIX_SCHEDA.successSave = NS_MOD_ADR.successSave;
        NS_MOD_ADR.detectStatoPagina();
        NS_MOD_ADR.checkStatoFirma($("#hStatoScheda").val());
        NS_MOD_ADR.showHideCampi();
        home.NS_FENIX_PS.IDEN_SCHEDA = jsonData.hIDEN;
        //$("#radDecesso, #txtDataDecesso, #txtDataRisoluzione, #lblDataRisoluzione, #lblDecesso, #lblDataDecesso").hide();
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
            NS_MOD_ADR.Firma = true;
            home.NS_LOADING.showLoading({"timeout": "0", "testo": "FIRMA", "loadingclick": function () {home.NS_LOADING.hideLoading();}});
            NS_FENIX_SCHEDA.registra();

        });

        $("#radEsito").on("click", function(){NS_MOD_ADR.showHideCampi()})
    },

    showHideCampi: function(){
       var clicked = $("#h-radEsito");
       var dataDecesso = $("#txtDataDecesso");
       var lblDataDecesso = $("#lblDataDecesso");
       var radDecesso = $("#radDecesso");
       var lblradDecesso = $("#lblDecesso");
       var dataRisoluzione = $("#txtDataRisoluzione");
       var lblDataRisoluzione = $("#lblDataRisoluzione");

       if(clicked.val() == "DECESSO"){
           dataDecesso.show();
           radDecesso.show();
           lblDataDecesso.show();
           lblradDecesso.show();

           if(dataRisoluzione.is(":visible")){
               dataRisoluzione.val("").hide();
               lblDataRisoluzione.hide();
           }

       }
       else if(clicked.val() == "COMPLETA_ADR"){
           dataRisoluzione.show();
           lblDataRisoluzione.show();

           if(dataDecesso.is(":visible")){
               dataDecesso.val("").hide();
               lblDataDecesso.hide();
               radDecesso.hide();
               lblradDecesso.hide();
           }

       }
        else{
           dataRisoluzione.val("").hide();
           lblDataRisoluzione.hide();
           dataDecesso.val("").hide();
           lblDataDecesso.hide();
           radDecesso.hide();
           lblradDecesso.hide();
       }
    },

    successSave: function (message) {

        NS_FIRMA_MODULI.setIdenScheda(message);

        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");

        if (NS_MOD_ADR.Firma == true)
        {
            NS_REGISTRAZIONE_FIRMA.firma();
        }
       /* else
        {
            NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_ADR = 'E';});
        }   */
    }
};


var NS_REGISTRAZIONE_FIRMA =
{
    firma : function (p) {

        $("#butSalva, #butFirma").off("click");

        NS_FIRMA_MODULI.setIdenContatto($("#IDEN_CONTATTO").val());
        NS_FIRMA_MODULI.setStatoVerbale(jsonData.hStatoScheda);
        NS_FIRMA_MODULI.setDocumento("MODULO_ADR");
        NS_FIRMA_MODULI.setReport("MODULO_ADR");
        NS_FIRMA_MODULI.setCallback(function(){
            //NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){});
            if (typeof home.CARTELLA !== 'undefined') {
                home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_ADR = 'E';
            }
            home.NS_LOADING.hideLoading();
        });
        NS_FIRMA_MODULI.setListaChiusi($("#LISTA_CHIUSI").val());

        if(typeof p != 'undefined'){
            NS_FIRMA_MODULI.firmaGenericaModuli(p);
        }else{
            NS_FIRMA_MODULI.firmaGenericaModuli();
        }
    }

};