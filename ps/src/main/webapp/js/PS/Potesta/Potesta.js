/**
 * Created by alberto.mina on 05/05/2015.
 */

$(document).ready(function(){

    NS_POTESTA.init();
    NS_POTESTA.setEvents();

});

var NS_POTESTA = {

    iden_contatto: null,
    dimensioneWk: null,
    init: function(){
        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        $('td.tdLbl').css('width','96px');
        $('#butApplica').css({'position':'absolute','right':'2%'});
        $('#lblResetCampi').css({'position':'absolute','right':'12%'});
        $('td.tdLbl').css('width','96px');
        NS_POTESTA.calcolaDimensioneWk();
        NS_POTESTA.caricaWkPotesta();
        NS_POTESTA.iden_contatto = $('#IDEN_CONTATTO').val();
    },

    setEvents: function(){
        $('.butInserisci').on('click', function(){ NS_POTESTA.apriSchedaPotesta()});

        $("#lblResetCampi").click(function () {
            NS_POTESTA.resetFiltriAnag();
            NS_POTESTA.startWorklist();
        });

        $('#butApplica').on('click', function(){

            NS_POTESTA.startWorklist();
        })

        $(".txtCognome, .txtNome, .txtCodiceFiscale, .dateData, .h-dateData").on('keypress', function(e){
            if(e.keyCode == 13 ) {
                NS_POTESTA.startWorklist();
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
        NS_POTESTA.caricaWkPotesta();
    },

    caricaWkPotesta: function () {

        $("div#divWk").height("250px");

        var cognome = $(".txtCognome").find('input').val().toUpperCase();
        var nome = $(".txtNome").find('input').val().toUpperCase();
        var codicefiscale = $(".txtCodiceFiscale").find('input').val().toUpperCase();
        var data_nascita = $("#h-dateData").val();

        if(cognome == '' && nome == '' && codicefiscale == '' && data_nascita == ''){
            $('#divWk').height(NS_POTESTA.dimensioneWk);
            
            NS_POTESTA.wk_anagrafica = new WK({
                id: "WK_POTESTA",
                container: "divWk",
                loadData : false,
                aBind: ["nome","cognome","codice_fiscale","data_nascita"],
                aVal: [nome,cognome,codicefiscale,data_nascita]
            });
            NS_POTESTA.wk_anagrafica.loadWk();
        }
        else {
            $('#divWk').height(NS_POTESTA.dimensioneWk);
            NS_POTESTA.wk_anagrafica = new WK({
                id: "WK_POTESTA",
                container: "divWk",
                loadData: true,
                aBind: ["nome", "cognome", "codice_fiscale", "data_nascita"],
                aVal: [nome, cognome, codicefiscale, data_nascita]
            });
            NS_POTESTA.wk_anagrafica.loadWk();
        }
    },

    apriSchedaPotesta: function(){
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_POTESTA&STATO_PAGINA=E&WK_APERTURA=CONSOLE&IDEN_CONTATTO='+NS_POTESTA.iden_contatto,fullscreen:true});
    },


    calcolaDimensioneWk: function () {
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        NS_POTESTA.dimensioneWk = contentTabs - margine - 70;
    }



}