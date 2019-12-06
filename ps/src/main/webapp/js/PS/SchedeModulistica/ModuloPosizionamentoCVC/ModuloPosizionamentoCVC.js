/**
 * User: carlog
 *
 * Date: 11/03/14
 */

jQuery(document).ready(function () {

    NS_MOD_POSIZIONAMENTO_CVC.init();
    NS_MOD_POSIZIONAMENTO_CVC.setEvents();

});

var NS_MOD_POSIZIONAMENTO_CVC = {
    firma : false,
    idenScheda : null,
    campoSpecifica: null,
    lblSpecifica: null,

    init: function(){
        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params;};
        NS_FENIX_SCHEDA.successSave = NS_MOD_POSIZIONAMENTO_CVC.successSave;
        NS_FENIX_SCHEDA.beforeSave = NS_MOD_POSIZIONAMENTO_CVC.beforeSave;
        NS_MOD_POSIZIONAMENTO_CVC.detectStatoPagina();
        NS_MOD_POSIZIONAMENTO_CVC.checkStatoFirma($("#hStatoScheda").val());
        NS_MOD_POSIZIONAMENTO_CVC.buildTable();
        NS_MOD_POSIZIONAMENTO_CVC.valorizzaCheck();
        NS_MOD_POSIZIONAMENTO_CVC.setCheck($("#TempoCVCPrevisto").find("input:checked").closest("tr"));
        home.NS_FENIX_PS.IDEN_SCHEDA = jsonData.hIDEN;
    },

    buildTable: function(){
        var table =
            $(document.createElement("table")).css("width","100%").attr({"id": "TempoCVCPrevisto", "class": "tabledialog"})
                .append($(document.createElement("tr")).attr("id", "TempoPrevisto")
                    .append($(document.createElement("th")).attr("colspan","5").text("TEMPO DEL CVC PREVISTO (Normativa Digs 46/97)"))

                //.append($(document.createElement("th")).text("Note"))
            ).append($(document.createElement("tr")).attr("id", "riga1")
                    .append($(document.createElement("td")).text("BREVE TERMINE (<= 4 settimane)")
                    .append($(document.createElement("input")).attr({"type": "checkbox", "name":"BREVE","class":"chkTermine", "data-value": 0, "onclick": ""})))
                    .append($(document.createElement("td")).text("MONOLUME")
                    .append($(document.createElement("input")).attr({"type": "checkbox", "name":"MONOLUME","class":"chkCol1", "data-value": 0, "onclick": ""})))
                    .append($(document.createElement("td")).text("BILUME")
                    .append($(document.createElement("input")).attr({"type": "checkbox", "name":"BILUME","class":"chkCol2", "data-value": 0, "onclick": ""})))
                    .append($(document.createElement("td")).text("MIDLINE catetere periferico (3 mesi)")
                    .append($(document.createElement("input")).attr({"type": "checkbox", "name":"MIDLINE","class":"chkCol3", "data-value": 0, "onclick": ""})))
                //.append($(document.createElement("td")).append($(document.createElement("input")).attr({"type":"text"})))
            ).append($(document.createElement("tr")).attr("id", "riga2")
                    .append($(document.createElement("td")).text("MEDIO TERMINE (>= 4 settimane)")
                    .append($(document.createElement("input")).attr({"type": "checkbox", "name":"MEDIO","class":"chkTermine", "data-value": 0, "onclick": ""})))
                    .append($(document.createElement("td")).text("PICC / PICC groshon")
                    .append($(document.createElement("input")).attr({"type": "checkbox", "name":"PICC","class":"chkCol1", "data-value": 0, "onclick": ""})))
                    .append($(document.createElement("td")).text("HOHN")
                    .append($(document.createElement("input")).attr({"type": "checkbox", "name":"HOHN","class":"chkCol2", "data-value": 0, "onclick": ""})))
                    .append($(document.createElement("td")).text("MIDLINE groshong catetere periferico (3 mesi)")
                    .append($(document.createElement("input")).attr({"type": "checkbox", "name":"MIDLINE_GROSHONG","class":"chkCol3", "data-value": 0, "onclick": ""})))
                //.append($(document.createElement("td")).append($(document.createElement("input")).attr({"type":"text"})))
            ).append($(document.createElement("tr")).attr("id", "riga3")
                    .append($(document.createElement("td")).text("LUNGO TERMINE (> 1 anno)")
                    .append($(document.createElement("input")).attr({"type": "checkbox","name":"LUNGO","class":"chkTermine",  "data-value": 0, "onclick": ""})))
                    .append($(document.createElement("td")).text("PORT "+"/ PORT basso")
                    .append($(document.createElement("input")).attr({"type": "checkbox", "name":"PORT","class":"chkCol1", "data-value": 0, "onclick": ""})))
                    .append($(document.createElement("td")).text("HICKMAN monolum")
                    .append($(document.createElement("input")).attr({"type": "checkbox", "name":"HICKMAN","class":"chkCol2", "data-value": 0, "onclick": ""})))
                    .append($(document.createElement("td")).text("GROSHONG bilume")
                    .append($(document.createElement("input")).attr({"type": "checkbox", "name":"GROSHONG","class":"chkCol3", "data-value": 0, "onclick": ""})))
                //.append($(document.createElement("td")).append($(document.createElement("input")).attr({"type":"text"})))
            );

            table.find('td').css({"border":"1px solid black","padding":"10px"});
            table.find('th').css({"border":"1px solid black","padding":"10px"});
            $(".chkTable").css("align","right");
            $("#fldTempoCVC").append(table)
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
            NS_MOD_POSIZIONAMENTO_CVC.firma = true;
            home.NS_LOADING.showLoading({"timeout": "0", "testo": "FIRMA", "loadingclick": function () {home.NS_LOADING.hideLoading();}});
            NS_FENIX_SCHEDA.registra();

        });

        $("#TempoCVCPrevisto").find("input").on("click", function(){
            NS_MOD_POSIZIONAMENTO_CVC.setCheck($(this).closest("tr"));
        })
    },

    setCheck: function(elem){

        var riga = elem.attr("id");

        if(elem.find("input:checked").length > 0)
        {
            $("#TempoCVCPrevisto").find("tr").not("#"+riga).find("input").attr("disabled","disabled")
        }
        else
        {
            $("#TempoCVCPrevisto").find("tr").not("#"+riga).find("input").removeAttr("disabled","disabled")
        }
    },

    valorizzaCheck: function(){

        var chkTermine = $("#hTermine").val();
        var chkCol1 = $("#hCol1").val();
        var chkCol2 = $("#hCol2").val();
        var chkCol3 = $("#hCol3").val();

        $('input[name="'+chkTermine+'"]').attr("checked","checked");
        $('input[name="'+chkCol1+'"]').attr("checked","checked");
        $('input[name="'+chkCol2+'"]').attr("checked","checked");
        $('input[name="'+chkCol3+'"]').attr("checked","checked");
    },



    beforeSave: function(){

        var chkTermine = $(".chkTermine:checked").attr("name");
        var chkCol1 = $(".chkCol1:checked").attr("name");
        var chkCol2 = $(".chkCol2:checked").attr("name");
        var chkCol3 = $(".chkCol3:checked").attr("name");

        if(typeof chkTermine !== 'undefined') {

            $("#hTermine").val("" + chkTermine + "");
        }

        if(typeof chkCol1 !== "undefined") {

            $("#hCol1").val("" + chkCol1 + "");
        }

        if(typeof chkCol2 !== "undefined") {

            $("#hCol2").val("" + chkCol2 + "");
        }

        if(typeof chkCol3 !== "undefined") {

            $("#hCol3").val("" + chkCol3 + "");
        }

        return true;

    },


    successSave: function (message) {

        NS_FIRMA_MODULI.setIdenScheda(message);

        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");

        if (NS_MOD_POSIZIONAMENTO_CVC.firma == true)
        {
            NS_REGISTRAZIONE_FIRMA.firma();
        }
      /*-  else
        {
            NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_RICHIESTA_POSIZIONAMENTO_CVC = 'E';});
        }*/
    }
};


var NS_REGISTRAZIONE_FIRMA =
{
    firma : function (p) {

        $("#butSalva, #butFirma").off("click");

        NS_FIRMA_MODULI.setIdenContatto($("#IDEN_CONTATTO").val());
        NS_FIRMA_MODULI.setStatoVerbale(jsonData.hStatoScheda);
        NS_FIRMA_MODULI.setDocumento("MODULO_RICHIESTA_POSIZIONAMENTO_CVC");
        NS_FIRMA_MODULI.setReport("MODULO_RICHIESTA_POSIZIONAMENTO_CVC");
        NS_FIRMA_MODULI.setCallback(function(){
            //NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){});
            if (typeof home.CARTELLA !== 'undefined') {
                home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_RICHIESTA_POSIZIONAMENTO_CVC = 'E';
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