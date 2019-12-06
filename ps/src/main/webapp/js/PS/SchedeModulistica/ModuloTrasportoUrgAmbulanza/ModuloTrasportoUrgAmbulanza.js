/**
 * User: carlog
 *
 * Date: 11/03/14
 */

jQuery(document).ready(function () {

    NS_MOD_TRASPORTO_URG_AMBULANZA.init();
    NS_MOD_TRASPORTO_URG_AMBULANZA.setEvents();

});

var NS_MOD_TRASPORTO_URG_AMBULANZA = {
    firma : false,
    idenScheda : null,
    campoSpecifica: null,
    lblSpecifica: null,

    init: function(){
        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params;};
        NS_FENIX_SCHEDA.successSave = NS_MOD_TRASPORTO_URG_AMBULANZA.successSave;
        NS_FENIX_SCHEDA.beforeSave = NS_MOD_TRASPORTO_URG_AMBULANZA.beforeSave;
        NS_MOD_TRASPORTO_URG_AMBULANZA.detectStatoPagina();
        NS_MOD_TRASPORTO_URG_AMBULANZA.checkStatoFirma($("#hStatoScheda").val());
        NS_MOD_TRASPORTO_URG_AMBULANZA.buildTable();
        NS_MOD_TRASPORTO_URG_AMBULANZA.valorizzaCampi();

        home.NS_FENIX_PS.IDEN_SCHEDA = jsonData.hIDEN;


    },

    buildTable: function(){
        var table =
            $(document.createElement("table")).css("width","100%").attr({"id": "TempoCVCPrevisto", "class": "tabledialog"})
                .append($(document.createElement("tr")).attr("id", "TempoPrevisto")
                    .append($(document.createElement("th")).attr("colspan","5").text("TEMPO DEL CVC PREVISTO (Normativa Digs 46/97)"))

                //.append($(document.createElement("th")).text("Note"))
            ).append($(document.createElement("tr")).attr("id", "chetoni")
                    .append($(document.createElement("td")).text("GLASGOW COMA SCALE").append("<br>")
                    .append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0, "data-col-save":"taGlasgow", "name":"taGlasgow", "id":"taGlasgow", "onclick": ""})))
                    .append($(document.createElement("td")).text("PROTESI RESPIRATORIA").append("<br>")
                    .append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0, "data-col-save":"taProtesi", "name":"taProtesi", "id":"taProtesi", "onclick": ""})))
                    .append($(document.createElement("td")).text("SEDATO").append("<br>")
                    .append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0,"data-col-save":"taSedato", "name":"taSedato", "id":"taSedato", "onclick": ""})))
                    .append($(document.createElement("td")).text("CURARIZZATO").append("<br>")
                    .append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0, "data-col-save":"taCurarizzato", "name":"taCurarizzato", "id":"taCurarizzato", "onclick": ""})))
                //.append($(document.createElement("td")).append($(document.createElement("input")).attr({"type":"text"})))
            ).append($(document.createElement("tr")).attr("id", "chetoni")
                    .append($(document.createElement("td")).text("SATURAZIONE").append("<br>")
                    .append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0, "data-col-save":"taSaturazione", "name":"taSaturazione", "id":"taSaturazione",  "onclick": ""})))
                    .append($(document.createElement("td")).text("FREQUENZA CARDIACA").append("<br>")
                    .append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0, "data-col-save":"taFreqCardiaca", "name":"taFreqCardiaca", "id":"taFreqCardiaca", "onclick": ""})))
                    .append($(document.createElement("td")).text("FREQ. RESPIRATORIA").append("<br>")
                    .append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0,"data-col-save":"taFreqResp", "name":"taFreqResp", "id":"taFreqResp",  "onclick": ""})))
                    .append($(document.createElement("td")).text("PRESS. ARTERIOSA").append("<br>")
                    .append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0, "data-col-save":"taPressArteriosa", "name":"taPressArteriosa", "id":"taPressArteriosa", "onclick": ""})))
            ).append($(document.createElement("tr")).attr("id", "emazie")
                    .append($(document.createElement("td")).text("VENTILAZIONE SPONTANEA").append("<br>")
                    .append("Si")
                    .append($(document.createElement("input")).attr({"type": "radio","name":"radVentilazioneSpontanea","value":"Si", "class":"radTable", "id":"radVentilazioneSpontanea_SI", "data-value": 0, "data-col-save":"hVentilazioneSpontanea","onclick": ""}))
                    .append("No")
                    .append($(document.createElement("input")).attr({"type": "radio","name":"radVentilazioneSpontanea","value":"No", "class":"radTable",  "id":"radVentilazioneSpontanea_NO","data-value": 0, "data-col-save":"hVentilazioneSpontanea", "onclick": ""})))
                    .append($(document.createElement("td")).text("VENTILAZIONE MECCANICA").append("<br>")
                    .append("Si")
                    .append($(document.createElement("input")).attr({"type": "radio","name":"radVentilazioneMeccanica","value":"Si", "class":"radTable", "id":"radVentilazioneMeccanica_SI", "data-value": 0, "data-col-save":"hVentilazioneMeccanica", "onclick": ""}))
                    .append("No")
                    .append($(document.createElement("input")).attr({"type": "radio","name":"radVentilazioneMeccanica","value":"No", "class":"radTable", "data-value": 0, "id":"radVentilazioneMeccanica_NO", "data-col-save":"hVentilazioneMeccanica", "onclick": ""})))
                    .append($(document.createElement("td")).text("PERFUSIONE(QUANTITA'/TIPO)").append("<br>")
                    .append("Si")
                    .append($(document.createElement("input")).attr({"type": "radio","name":"radPerfusione","value":"Si", "class":"radTable", "data-value": 0, "id":"radPerfusione_SI", "data-col-save":"hPerfusione", "onclick": ""}))
                    .append("No")
                    .append($(document.createElement("input")).attr({"type": "radio","name":"radPerfusione","value":"No", "class":"radTable", "data-value": 0, "id":"radPerfusione_NO", "data-col-save":"hPerfusione", "onclick": ""})))
                    .append($(document.createElement("td"))
                    .append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0, "data-col-save":"hPerfusioneCampo",  "name":"taPerfusioneCampo", "id":"taPerfusioneCampo", "onclick": ""})))
                //.append($(document.createElement("td")).append($(document.createElement("input")).attr({"type":"text"})))
            ).append($(document.createElement("tr")).attr("id", "emazie")
                    .append($(document.createElement("td")).attr("colspan","2").text("FARMACI IN CORSO").append("<br>")
                        .append("Si")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radFarmaci","value":"Si", "class":"radTable", "id":"radFarmaci_SI", "data-value": 0, "data-col-save":"hFarmaciInCorso", "onclick": ""}))
                        .append("No")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radFarmaci","value":"No", "class":"radTable",  "id":"radFarmaci_NO", "data-value": 0, "data-col-save":"hFarmaciInCorso", "onclick": ""}))
                        .append("<br>").append("Quali  ").append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0, "data-col-save":"taFarmaci", "name":"taFarmaci", "id":"taFarmaci", "onclick": ""})))
                        .append($(document.createElement("td")).attr("colspan","2").text("EMODERIVATI IN CORSO").append("<br>")
                        .append("Si")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radEmoderivati","value":"Si", "class":"radTable", "id":"radEmoderivati_SI", "data-value": 0, "data-col-save":"hEmoderivatiInCorso", "onclick": ""}))
                        .append("No")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radEmoderivati","value":"No", "class":"radTable", "id":"radEmoderivati_NO", "data-value": 0, "data-col-save":"hEmoderivatiInCorso", "onclick": ""}))
                        .append("<br>").append("Quali  ").append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0, "data-col-save":"taEmoderivati", "name":"taEmoderivati", "id":"taEmoderivati", "onclick": ""})))
            ).append($(document.createElement("tr")).attr("id", "emazie")
                    .append($(document.createElement("td")).text("ACC. VENOSO PERIFERICO").append("<br>")
                        .append("Si")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radVenosoPeriferico","value":"Si", "class":"radTable", "id":"radVenosoPeriferico_SI", "data-value": 0, "data-col-save":"hAccVenosoPeriferico", "onclick": ""}))
                        .append("No")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radVenosoPeriferico","value":"No", "class":"radTable", "id":"radVenosoPeriferico_NO", "data-value": 0, "data-col-save":"hAccVenosoPeriferico", "onclick": ""})))
                    .append($(document.createElement("td")).text("ACC. VENOSO CENTRALE").append("<br>")
                        .append("Si")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radVenosoCentrale","value":"Si", "class":"radTable", "id":"radVenosoCentrale_SI", "data-value": 0, "data-col-save":"hAccVenosoCentrale", "onclick": ""}))
                        .append("No")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radVenosoCentrale","value":"No", "class":"radTable", "id":"radVenosoCentrale_NO", "data-value": 0, "data-col-save":"hAccVenosoCentrale", "onclick": ""})))
                    .append($(document.createElement("td")).text("DRENAGGIO TORACICO").append("<br>")
                        .append("Si")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radDrenaggioToracico","value":"Si", "class":"radTable", "id":"radDrenaggioToracico_SI", "data-value": 0, "data-col-save":"hDrenaggioToracico", "onclick": ""}))
                        .append("No")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radDrenaggioToracico","value":"No", "class":"radTable", "id":"radDrenaggioToracico_NO", "data-value": 0, "data-col-save":"hDrenaggioToracico", "onclick": ""})))
                    .append($(document.createElement("td")).text("IMMOBILIZZAZIONE").append("<br>")
                        .append("Si")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radImmobilizzazione","value":"Si", "class":"radTable", "id":"radImmobilizzazione_SI", "data-value": 0, "data-col-save":"hImmobilizzazione", "onclick": ""}))
                        .append("No")
                        .append($(document.createElement("input")).attr({"type": "radio","name":"radImmobilizzazione","value":"No", "class":"radTable", "id":"radImmobilizzazione_NO", "data-value": 0, "data-col-save":"hImmobilizzazione", "onclick": ""})))
            ).append($(document.createElement("tr")).attr("id", "proteine")
                    .append($(document.createElement("td")).attr("colspan","2").text("DOCUMENTAZIONE ALLEGATA").append("<br>")
                    .append($(document.createElement("input")).attr({"type": "checkbox","class":"chkTable",  "data-value": "ESAMI EMATOCHIMICI", "data-col-save":"hDocumentazioneAllegata", "onclick": ""})).append("ESAMI EMATOCHIMICI")
                    .append($(document.createElement("input")).attr({"type": "checkbox","class":"chkTable",  "data-value": "TC", "data-col-save":"hDocumentazioneAllegata", "onclick": ""})).append("TC").append("<br>")
                    .append($(document.createElement("input")).attr({"type": "checkbox","class":"chkTable",  "data-value": "ECOGRAFIA", "data-col-save":"hDocumentazioneAllegata", "onclick": ""})).append("ECOGRAFIA")
                    .append($(document.createElement("input")).attr({"type": "checkbox","class":"chkTable",  "data-value": "RX", "data-col-save":"hDocumentazioneAllegata", "onclick": ""})).append("RX").append('<br>')
                    .append("ALTRO").append($(document.createElement("input")).attr({"type": "text","class":"txtTable",  "data-value": 0,"name":"txtDocumentazioneAltro", "id":"txtDocumentazioneAltro", "onclick": ""})))
                    .append($(document.createElement("td")).attr("colspan","2")
                        .append("NOTE").append("<br>").append($(document.createElement("textarea")).attr({"class":"taTable", "data-value": 0, "data-col-save":"taNote", "name":"taNote", "id":"taNote", "onclick": ""})))

                //.append($(document.createElement("td")).append($(document.createElement("input")).attr({"type":"text"})))
            );



            table.find('td').css({"border":"1px solid black","padding":"10px"});
            table.find('th').css({"border":"1px solid black","padding":"10px"});
            $(".chkTable").css("align","right");
            $("#fldCondizioni").append(table)


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
            NS_MOD_TRASPORTO_URG_AMBULANZA.firma = true;
            home.NS_LOADING.showLoading({"timeout": "0", "testo": "FIRMA", "loadingclick": function () {home.NS_LOADING.hideLoading();}});
            NS_FENIX_SCHEDA.registra();

        });




    },

    valorizzaCampi: function(){
        $("#taGlasgow").val(""+$("#hGlasgow").val()+"");
        $("#taPerfusioneCampo").val(""+$("#hPerfusioneCampo").val()+"");
        $("#taProtesi").val(""+$("#hProtesi").val()+"");
        $("#taSedato").val(""+$("#hSedato").val()+"");
        $("#taCurarizzato").val(""+$("#hCurarizzato").val()+"");
        $("#taSaturazione").val(""+$("#hSaturazione").val()+"");
        $("#taFreqCardiaca").val(""+$("#hFreqCardiaca").val()+"");
        $("#taFreqResp").val(""+$("#hFreqResp").val()+"");
        $("#taPressArteriosa").val(""+$("#hPressArteriosa").val()+"");
        $("#taFarmaci").val(""+$("#hFarmaci").val()+"");
        $("#taEmoderivati").val(""+$("#hEmoderivati").val()+"");
        $("#txtDocumentazioneAltro").val(""+$("#hDocumentazioneAltro").val()+"");
        $("#taNote").val(""+$("#hNote").val()+"");

        $("#radVentilazioneSpontanea_"+$("#hVentilazioneSpontanea").val()).attr("checked","checked");
        $("#radVentilazioneMeccanica_"+$("#hVentilazioneMeccanica").val()).attr("checked","checked");
        $("#radPerfusione_"+$("#hPerfusione").val()).attr("checked","checked");
        $("#radFarmaci_"+$("#hFarmaciInCorso").val()).attr("checked","checked");
        $("#radEmoderivati_"+$("#hEmoderivatiInCorso").val()).attr("checked","checked");
        $("#radVenosoPeriferico_"+$("#hAccVenosoPeriferico").val()).attr("checked","checked");
        $("#radVenosoCentrale_"+$("#hAccVenosoCentrale").val()).attr("checked","checked");
        $("#radDrenaggioToracico_"+$("#hDrenaggioToracico").val()).attr("checked","checked");
        $("#radImmobilizzazione_"+$("#hImmobilizzazione").val()).attr("checked","checked");

        var documentazione = $("#hDocumentazioneAllegata").val().split(",");
        for (var i=0; i < documentazione.length ; i++){
            $('input[data-value="'+documentazione[i]+'"]').attr("checked","checked")
        }

    },



    beforeSave: function(){

      var campoGlasgow = $("#taGlasgow");
      var campoProtesi = $("#taProtesi");
      var campoSedato = $("#taSedato");
      var campoCurarizzato = $("#taCurarizzato");
      var campoSaturazione = $("#taSaturazione");
      var campoFreqCardiaca = $("#taFreqCardiaca");
      var campoFreqResp = $("#taFreqResp");
      var campoPressArteriosa = $("#taPressArteriosa");
      var campoNote = $("#taNote");
      var campoPerfusione = $("#taPerfusioneCampo");
      var campoFarmaci = $("#taFarmaci");
      var campoEmoderivati = $("#taEmoderivati");


      var documentazioneAllegata = [];
      $("#hVentilazioneSpontanea").val(""+$('input[name="radVentilazioneSpontanea"]:radio:checked').val()+"");
      $("#hVentilazioneMeccanica").val(""+$('input[name="radVentilazioneMeccanica"]:radio:checked').val()+"");
      $("#hPerfusione").val(""+$('input[name="radPerfusione"]:radio:checked').val()+"");
      $("#hFarmaciInCorso").val(""+$('input[name="radFarmaci"]:radio:checked').val()+"");
      $("#hEmoderivatiInCorso").val(""+$('input[name="radEmoderivati"]:radio:checked').val()+"");
      $("#hAccVenosoPeriferico").val(""+$('input[name="radVenosoPeriferico"]:radio:checked').val()+"");
      $("#hAccVenosoCentrale").val(""+$('input[name="radVenosoCentrale"]:radio:checked').val()+"");
      $("#hDrenaggioToracico").val(""+$('input[name="radDrenaggioToracico"]:radio:checked').val()+"");
      $("#hImmobilizzazione").val(""+$('input[name="radImmobilizzazione"]:radio:checked').val()+"");


        $(".chkTable:checked").each(function(){
            documentazioneAllegata.push( $(this).data("value"));

        });

        $("#hDocumentazioneAllegata").val(""+documentazioneAllegata.join(",")+"");
        $("#hDocumentazioneAltro").val(""+$("#txtDocumentazioneAltro").val().toUpperCase()+"");
        campoGlasgow.val(""+campoGlasgow.val().toUpperCase()+"");
        campoProtesi.val(""+campoProtesi.val().toUpperCase()+"");
        campoSedato.val(""+campoSedato.val().toUpperCase()+"");
        campoCurarizzato.val(""+campoCurarizzato.val().toUpperCase()+"");
        campoSaturazione.val(""+campoSaturazione.val().toUpperCase()+"");
        campoFreqCardiaca.val(""+campoFreqCardiaca.val().toUpperCase()+"");
        campoFreqResp.val(""+campoFreqResp.val().toUpperCase()+"");
        campoPressArteriosa.val(""+campoPressArteriosa.val().toUpperCase()+"");
        campoNote.val(""+campoNote.val().toUpperCase()+"");
        campoPerfusione.val(""+campoPerfusione.val().toUpperCase()+"");
        campoFarmaci.val(""+campoFarmaci.val().toUpperCase()+"");
        campoEmoderivati.val(""+campoEmoderivati.val().toUpperCase()+"");
        return true;
    },

    successSave: function (message) {

        NS_FIRMA_MODULI.setIdenScheda(message);

        $("div.headerTabs").html("<h2 style='color: rgb(0, 255, 0);' id='lblAlertCompleto'>COMPLETATO</h2>");

        if (NS_MOD_TRASPORTO_URG_AMBULANZA.firma == true)
        {
            NS_REGISTRAZIONE_FIRMA.firma();
        }
       /* else
        {
            NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_TRASPORTO_URG_AMBULANZA = 'E';});
        }
        */
    }
};


var NS_REGISTRAZIONE_FIRMA =
{
    firma : function (p) {

        $("#butSalva, #butFirma").off("click");

        NS_FIRMA_MODULI.setIdenContatto($("#IDEN_CONTATTO").val());
        NS_FIRMA_MODULI.setStatoVerbale(jsonData.hStatoScheda);
        NS_FIRMA_MODULI.setDocumento("MODULO_TRASPORTO_URG_AMBULANZA");
        NS_FIRMA_MODULI.setReport("MODULO_TRASPORTO_URG_AMBULANZA");
        NS_FIRMA_MODULI.setCallback(function(){
            //NS_MODULISTICA_FUNZIONI_COMUNI.refreshModulistica($("#LISTA_CHIUSI").val(), true, function(){});
            if (typeof home.CARTELLA !== 'undefined') {
                home.CARTELLA.jsonData.H_STATO_PAGINA.MODULO_TRASPORTO_URG_AMBULANZA = 'E';
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