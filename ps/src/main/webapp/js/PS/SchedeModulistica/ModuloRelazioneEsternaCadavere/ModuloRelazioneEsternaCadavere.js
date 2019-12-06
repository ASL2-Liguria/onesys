/**
 * User: carlog
 *
 * Date: 11/03/14
 */

jQuery(document).ready(function () {

    NS_MOD_RELAZIONE_ESTERNA_CADAVERE.init();
    NS_MOD_RELAZIONE_ESTERNA_CADAVERE.setEvents();

});

var NS_MOD_RELAZIONE_ESTERNA_CADAVERE = {
    firma : false,
    idenScheda : null,

    init: function(){
        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params;};
        NS_FENIX_SCHEDA.successSave = NS_MOD_RELAZIONE_ESTERNA_CADAVERE.successSave;
        NS_MOD_RELAZIONE_ESTERNA_CADAVERE.detectStatoPagina();
        NS_MOD_RELAZIONE_ESTERNA_CADAVERE.checkStatoFirma($("#hStatoScheda").val());
        NS_MOD_RELAZIONE_ESTERNA_CADAVERE.loadDefaults();
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
            NS_MOD_RELAZIONE_ESTERNA_CADAVERE.firma = true;
            home.NS_LOADING.showLoading({"timeout": "0", "testo": "FIRMA", "loadingclick": function () {home.NS_LOADING.hideLoading();}});
            NS_FENIX_SCHEDA.registra();

        });

        $("#radMezzo").on("click", function(){NS_MOD_RELAZIONE_ESTERNA_CADAVERE.showHideMezzo($(this))});
        $("#txtProvenienza").on("change keyup", function(){NS_MOD_RELAZIONE_ESTERNA_CADAVERE.showHideProvenienza($(this))});
    },

    loadDefaults: function(){
      var specifica = $("#txtSpecificare");
      var specificaProvenienza = $("#txtSpecificaProvenienza");



       if($("#radMezzo").find('div.RBpulsSel').length == 0){
           $("#lblSpecificare").hide();
           specifica.hide();
       }

       if($("#txtProvenienza").val() == ""){
           specificaProvenienza.hide();
           $("#lblSpecificaProvenienza").hide();
       }


    },

    showHideMezzo: function(elem){

        var count = null;

        elem.children().each(function(){
            if($(this).hasClass("RBpulsSel")){
                count ++;
            }
         });
        if(count > 0){
            $("#txtSpecificare").val("").show();
            $("#lblSpecificare").show();
        }
        else{
            $("#txtSpecificare").val("").hide();
            $("#lblSpecificare").hide();
        }

    },

    showHideProvenienza: function(elem){

       if (elem.val() !== "" && elem !== "undefined" && elem!== null){
           $("#txtSpecificaProvenienza").val("").show();
           $("#lblSpecificaProvenienza").show();
       }
       else{
           $("#txtSpecificaProvenienza").val("").hide();
           $("#lblSpecificaProvenienza").hide();
       }
    },

    successSave: function (message) {

        NS_FIRMA_MODULI.setIdenScheda(message);

        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");

        if (NS_MOD_RELAZIONE_ESTERNA_CADAVERE.firma == true)
        {
            NS_REGISTRAZIONE_FIRMA.firma();
        }
      /*  else
        {
            NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_RELAZIONE_ESTERNA_CADAVERE = 'E';});
        }*/

    }
};


var NS_REGISTRAZIONE_FIRMA =
{
    firma : function (p) {

        $("#butSalva, #butFirma").off("click");

        NS_FIRMA_MODULI.setIdenContatto($("#IDEN_CONTATTO").val());
        NS_FIRMA_MODULI.setStatoVerbale(jsonData.hStatoScheda);
        NS_FIRMA_MODULI.setDocumento("MODULO_RELAZIONE_ESTERNA_CADAVERE");
        NS_FIRMA_MODULI.setReport("MODULO_RELAZIONE_ESTERNA_CADAVERE");
        NS_FIRMA_MODULI.setCallback(function(){
            //NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){});
            if (typeof home.CARTELLA !== 'undefined') {
                home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_RELAZIONE_ESTERNA_CADAVERE = 'E';
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