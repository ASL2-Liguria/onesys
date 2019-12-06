/**
 * User: carlog
 *
 * Date: 11/03/14
 */

jQuery(document).ready(function () {

    NS_MOD_TRASPORTO_GRATIS_AMBULANZA.init();
    NS_MOD_TRASPORTO_GRATIS_AMBULANZA.setEvents();

});

var NS_MOD_TRASPORTO_GRATIS_AMBULANZA = {
    firma : false,
    idenScheda : null,
    campoSpecifica: null,
    lblSpecifica: null,

    init: function(){
        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params;};
        NS_FENIX_SCHEDA.successSave = NS_MOD_TRASPORTO_GRATIS_AMBULANZA.successSave;
        NS_MOD_TRASPORTO_GRATIS_AMBULANZA.detectStatoPagina();
        NS_MOD_TRASPORTO_GRATIS_AMBULANZA.checkStatoFirma($("#hStatoScheda").val());
        home.NS_FENIX_PS.IDEN_SCHEDA = jsonData.hIDEN;
        //NS_MOD_TRASPORTO_GRATIS_AMBULANZA.campoSpecifica = $("#lblSpecifica").next(".tdText").css("width","100%");
        //NS_MOD_TRASPORTO_GRATIS_AMBULANZA.lblSpecifica = $("#lblSpecifica");

        //$("#lblSpecifica").next(".tdText").remove();
        //$("#lblSpecifica").remove();

       /* if($("#STATO_PAGINA").val() == "E"){
            NS_MOD_TRASPORTO_GRATIS_AMBULANZA.setSpecifica($("#radMotivo"));
        }*/
    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== typeof value) && ("null" !== value));
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
            NS_MOD_TRASPORTO_GRATIS_AMBULANZA.firma = true;
            home.NS_LOADING.showLoading({"timeout": "0", "testo": "FIRMA", "loadingclick": function () {home.NS_LOADING.hideLoading();}});
            NS_FENIX_SCHEDA.registra();
        });

       // $("#radMotivo").on("click", function(){NS_MOD_TRASPORTO_GRATIS_AMBULANZA.setSpecifica($(this))});


    },


  /*  setSpecifica: function(radio){
        radio.find(".RBpulsSel").after(NS_MOD_TRASPORTO_GRATIS_AMBULANZA.lblSpecifica)
        $("#lblSpecifica").after(NS_MOD_TRASPORTO_GRATIS_AMBULANZA.campoSpecifica)
        $("#txtSpecifica").focus();
        if(radio.find(".RBpulsSel").length == 0){
            $("#lblSpecifica").next('.tdText').remove();
            $("#lblSpecifica").remove();
        }
    },*/

    successSave : function (message) {

        NS_FIRMA_MODULI.setIdenScheda(message);

        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");

        if (NS_MOD_TRASPORTO_GRATIS_AMBULANZA.firma == true)
        {
            NS_REGISTRAZIONE_FIRMA.firma();
        }
        /*else{
            NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val());
        } */
    }
};


var NS_REGISTRAZIONE_FIRMA =
{
    firma : function (p) {

        $("#butSalva, #butFirma").off("click");

        NS_FIRMA_MODULI.setIdenContatto($("#IDEN_CONTATTO").val());
        NS_FIRMA_MODULI.setStatoVerbale(jsonData.hStatoScheda);
        NS_FIRMA_MODULI.setDocumento("MODULO_TRASPORTO_GRATIS_AMBULANZA");
        NS_FIRMA_MODULI.setReport("MODULO_TRASPORTO_GRATIS_AMBULANZA");
        NS_FIRMA_MODULI.setCallback(function(){
            //NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){});
            if (typeof home.CARTELLA !== 'undefined') {
                home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_TRASPORTO_GRATIS_AMBULANZA = 'E';
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