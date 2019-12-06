/**
 * Created by alberto.mina on 05/05/2015.
 */

$(document).ready(function(){

    NS_CODICI_MISSIONE.init();
    NS_CODICI_MISSIONE.setEvents();

});

var NS_CODICI_MISSIONE = {

    iden_contatto: null,
    dimensioneWk: null,
    init: function(){
        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        $('td.tdLbl').css('width','96px');
        //$(".txtNome").find("input").val(home.CARTELLA.NS_INFO_PAZIENTE.jsonAnagrafica.NOME);
        //$(".txtCognome").find('input').val(home.CARTELLA.NS_INFO_PAZIENTE.jsonAnagrafica.COGNOME);
        $("#txtOraMissione").val(moment().format('HH:mm'))
        //$('#butApplica').css({'position':'absolute','right':'2%'});


        NS_CODICI_MISSIONE.calcolaDimensioneWk();
        NS_CODICI_MISSIONE.caricaWkCodiciMissione();
        NS_CODICI_MISSIONE.iden_contatto = $('#IDEN_CONTATTO').val();

    },

    setEvents: function(){
        $('.butInserisci').on('click', function(){ NS_CODICI_MISSIONE.apriSchedaPotesta()});

        $("#lblResetCampi").click(function () {
            NS_CODICI_MISSIONE.resetFiltriAnag();
            NS_CODICI_MISSIONE.startWorklist();
        });

        $('#butApplica').on('click', function(){

            NS_CODICI_MISSIONE.startWorklist();
        })

        $("input").on('keypress', function(e){
            if(e.keyCode == 13 ) {
                NS_CODICI_MISSIONE.startWorklist();
            }
        })
        $(".txtCognome, .txtNome, .txtCodiceFiscale").on('change', function(){
            var c = $(this).find('input').val().toUpperCase();
            $(this).find('input').val(c);
        })
    },

    resetFiltriAnag : function(){

        $(".txtCognome, .txtNome, .txtCodiceFiscale, .dateData, .h-dateData").find('input').val("");
        $(".CBpulsSel").attr("class","CBpuls CBcolorDefault");

    },

    startWorklist: function () {
        NS_CODICI_MISSIONE.caricaWkCodiciMissione();
    },

    caricaWkCodiciMissione: function () {

        $("div#divWk").height("250px");


        var dataMissione = $("#h-dataMissione").val();
        var oraMissione = $("#txtOraMissione").val();
        var codiceAmbulanza = $("#CodiceAmbulanza").val();

        if(oraMissione !== ""){
            oraMissione = oraMissione.replace(":","");
        }

        var data = dataMissione + oraMissione;
        var idenContatto = $("#IDEN_CONTATTO").val();

        if(oraMissione == "" || dataMissione == ""){
            home.NOTIFICA.warning({title:"Attenzione", message:"Valorizzare Data e Ora"});
        }

        else{
            $('#divWk').height(NS_CODICI_MISSIONE.dimensioneWk);
            NS_CODICI_MISSIONE.wk_codici_missione = new WK({
                id: "WORKLIST_CODICI_MISSIONE",
                container: "divWk",
                loadData: true,
                aBind: ["data","idenContatto","codiceAmbulanza"],
                aVal: [data,idenContatto,codiceAmbulanza]
            });
            NS_CODICI_MISSIONE.wk_codici_missione.loadWk();
        }




    },




    calcolaDimensioneWk: function () {
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        NS_CODICI_MISSIONE.dimensioneWk = contentTabs - margine - 70;
    },


    valorizeCodiciMissione : function(rec){
        
        var associazioneMissione = new home.AssociazioneMissione();
        
        associazioneMissione.iden = rec.IDEN;
        associazioneMissione.urgenza.codice = rec.URGENZA_CODICE;
        associazioneMissione.urgenza.descrizione = rec.URGENZA;
        associazioneMissione.codiceAmulanza = rec.CODICE_AMBU;
        associazioneMissione.setCodiceMissione(rec.CODICE_MISSIONE); 

        parent.$("#iScheda-1").contents().find("#iContent")[0].contentWindow.NS_DATI_AMMINISTRATIVI.valorizzaDatiMissione(associazioneMissione);

        NS_FENIX_SCHEDA.chiudi();
    },

    processGreyed : function(data, wk, td){

        if(data.IDEN_CONTATTO !== null){


            $(wk).closest("tr").find("td").css('color','grey');
            if(data.PRATICA !== null){
                td.text(data.PRATICA).css('color','grey');
            }

        }
        else{
            if(data.PRATICA !== null) {
                td.text(data.PRATICA);
            }
        }


    }



}