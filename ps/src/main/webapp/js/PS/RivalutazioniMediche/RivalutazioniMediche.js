/**
 * Created by matteo.pipitone on 11/03/2015.
 */
$(document).ready(function(){
    NS_RIVALUTAZIONI_MEDICHE.init();
    NS_RIVALUTAZIONI_MEDICHE.setEvents();

});

var NS_RIVALUTAZIONI_MEDICHE = {

    dimensioniWk : null,

    init:function(){

        if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }

        if($("#READONLY").val() === "S"){$("div.contentTabs").css({"background":"#CACACC"})}

        NS_RIVALUTAZIONI_MEDICHE.calcolaDimensioneWk(function(){
            NS_RIVALUTAZIONI_MEDICHE.initWkPrimaValutazione();
            NS_RIVALUTAZIONI_MEDICHE.initWkRivalutazioni();
        });



    },

    setEvents : function () {

    },

    calcolaDimensioneWk: function (callback) {
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 120;
        NS_RIVALUTAZIONI_MEDICHE.dimensioniWk = parseInt(contentTabs - margine)/2;

        callback();
    },

    initWkPrimaValutazione : function(){

        $("div#divWkPrimaValutazione").height(NS_RIVALUTAZIONI_MEDICHE.dimensioniWk);
        NS_RIVALUTAZIONI_MEDICHE.WkPrimaValutazione = new WK({
            id: "PS_PRIMA_VALUTAZIONE_MEDICA",
            container: "divWkPrimaValutazione",
            aBind: ['IDEN_CONTATTO'],
            aVal: [$("#IDEN_CONTATTO").val()]

        });
        NS_RIVALUTAZIONI_MEDICHE.WkPrimaValutazione.loadWk();

    },

    initWkRivalutazioni: function () {
        $("div#divWkRivalutazioniMediche").height(NS_RIVALUTAZIONI_MEDICHE.dimensioniWk);
        NS_RIVALUTAZIONI_MEDICHE.WkRivalutazioni = new WK({
            id: "PS_VERSIONI_ESAME_OBIETTIVO",
            container: "divWkRivalutazioniMediche",
            aBind: ['IDEN_CONTATTO'],
            aVal: [$("#IDEN_CONTATTO").val()]

        });
        NS_RIVALUTAZIONI_MEDICHE.WkRivalutazioni.loadWk();
    },
    showText : function (testo) {
        //var text = testo.replace("<br>","");

        $.dialog(testo, {
            id: "testo_val_mediche",
            title: "Valutazione Medica",
            showBtnClose: true,
            movable: true
        });
    }


};