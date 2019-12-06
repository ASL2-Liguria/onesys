/**
 * User: carlog
 *
 * Date: 11/03/14
 */

jQuery(document).ready(function () {

    NS_MOD_DENUNCIA_MORSO_ANIMALE.init();
    NS_MOD_DENUNCIA_MORSO_ANIMALE.setEvents();

});

var NS_MOD_DENUNCIA_MORSO_ANIMALE = {

    firma : false,
    idenScheda : null,

    init: function(){
        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params;};
        NS_FENIX_SCHEDA.successSave = NS_MOD_DENUNCIA_MORSO_ANIMALE.successSave;
        NS_MOD_DENUNCIA_MORSO_ANIMALE.detectStatoPagina();
        NS_MOD_DENUNCIA_MORSO_ANIMALE.checkStatoFirma($("#hStatoScheda").val())
        home.NS_FENIX_PS.IDEN_SCHEDA = jsonData.hIDEN;
        NS_MOD_DENUNCIA_MORSO_ANIMALE.detectBaseUser();
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
            NS_MOD_DENUNCIA_MORSO_ANIMALE.firma = true;
            home.NS_LOADING.showLoading({"timeout": "0", "testo": "FIRMA", "loadingclick": function () {home.NS_LOADING.hideLoading();}});
            NS_FENIX_SCHEDA.registra();

        });
    },

    successSave: function (message) {

        NS_FIRMA_MODULI.setIdenScheda(message);

        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");

        if (NS_MOD_DENUNCIA_MORSO_ANIMALE.firma == true)
        {
            NS_REGISTRAZIONE_FIRMA.firma();
        }
        /*else
        {
            NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){});
        }
          */

    },
    detectBaseUser: function () {
        var butSalva = $("button.butSalva, button.butFirma");
        var TipoPersonale = home.baseUser.TIPO_PERSONALE;
        //var form = $("form");

        switch (TipoPersonale) {
            case 'A':
                butSalva.hide();
                NS_MOD_DENUNCIA_MORSO_ANIMALE.disattivaTutto();
                break;
            case 'I':
            case 'OST':
                NS_MOD_DENUNCIA_MORSO_ANIMALE.disattivaTutto();
                butSalva.hide();
                break;
            case 'M':
                butSalva.show();

                break;
            default:
                logger.error("baseuser non valorizzato correttamente : " + TipoPersonale);
                break;
        }
    },
    disattivaTutto : function (){
        $("textarea").attr("readonly","readonly");
        $("input").attr({"readonly":"readonly","disabled":"disabled"});
        $("select").attr("disabled","disabled");
        $(".tdACList").find('span').off('click');
        $("div.RBpuls").off("click").attr("readonly","readonly");
        $("div.contentTabs").css({"background": "#CACACC"});
    }

};

var NS_REGISTRAZIONE_FIRMA =
{
    firma : function (p) {


        $("#butSalva, #butFirma").off("click");

        NS_FIRMA_MODULI.setIdenContatto($("#IDEN_CONTATTO").val());
        NS_FIRMA_MODULI.setStatoVerbale(jsonData.hStatoScheda);
        NS_FIRMA_MODULI.setDocumento("MODULO_DENUNCIA_MORSO_ANIMALE");
        NS_FIRMA_MODULI.setReport("MODULO_DENUNCIA_MORSO_ANIMALE");
        NS_FIRMA_MODULI.setCallback(function(){
            //NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_DENUNCIA_MORSO_ANIMALE = 'E';});
            if (typeof home.CARTELLA !== 'undefined') {
                home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_DENUNCIA_MORSO_ANIMALE = 'E';
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