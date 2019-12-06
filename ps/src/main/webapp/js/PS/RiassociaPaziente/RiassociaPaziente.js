/**
 * User: matteopi
 * Date: 10/02/14
 * Time: 16.28
 * update: carlog on 26/002/2015
 */

jQuery(document).ready(function () {

    NS_RIASSOCIA_PAZ.init();
    NS_RIASSOCIA_PAZ.event();
});

var NS_RIASSOCIA_PAZ = {
    wk_anagrafica: null,
    ricCognome: null,
    ricNome: null,

    init: function () {
        home.NS_RIASSOCIA_PAZ = this;
        home.NS_FENIX_PS.ricCognome = '';
        home.NS_FENIX_PS.ricNome = '';
        $("div.headerTabs").html("<h2 style='color: rgb(255, 255, 0);' id='lblPaziente'>PAZIENTE DA RIASSOCIARE :  "+$("#PAZIENTE").val()+"</h2>");

        $("#butApplica").css({"float": "right"}).on("click", function () {
            NS_RIASSOCIA_PAZ.setToUpper();
            NS_RIASSOCIA_PAZ.startWkAnagrafica();
        });

        $(document).keypress(function(e) {
            if(e.which == 13) {
                NS_RIASSOCIA_PAZ.setToUpper();
                NS_RIASSOCIA_PAZ.startWkAnagrafica();
            }
        });

    },

    event: function () {
        NS_FENIX_TAG_LIST.setEvents();
        $('.butInserisci').on('click',function(){
            NS_RIASSOCIA_PAZ.setNomeCognome();
            NS_RIASSOCIA_PAZ.insPaziente();
        })
    },

    setToUpper : function(){
        document.getElementById("nome").value = document.getElementById("nome").value.toUpperCase();
        document.getElementById("cognome").value = document.getElementById("cognome").value.toUpperCase();
        document.getElementById("codicefiscale").value = document.getElementById("codicefiscale").value.toUpperCase();
    },

    startWkAnagrafica: function () {
        var nome = $("#nome").val();
        var cognome = $("#cognome").val();
        var codicefiscale = $("#codicefiscale").val();

        NS_RIASSOCIA_PAZ.wk_anagrafica = new WK({
            id: "PS_WK_RIASSOCIA_PAZ",
            container: "divWkAnagrafica",
            aBind: ["nome","cognome","codice_fiscale"],
            aVal: [nome, cognome,codicefiscale]
        });
        $("#divWkAnagrafica").height("500px");
        NS_RIASSOCIA_PAZ.wk_anagrafica.loadWk();
        $(".clsWkScroll, .clsWk").css({"height": "300px"});
    },

    insPaziente: function(){
        home.NS_FENIX_TOP.apriPagina({
            url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=I',id:'insAnag',fullscreen:true});

    },

    setNomeCognome: function(){
        home.NS_FENIX_PS.ricCognome = $('.txtCognome').find('input').val();
        home.NS_FENIX_PS.ricNome = $('.txtNome').find('input').val();
    },


    chiudiScheda: function () {
        NS_FENIX_SCHEDA.chiudi();
    }
};


