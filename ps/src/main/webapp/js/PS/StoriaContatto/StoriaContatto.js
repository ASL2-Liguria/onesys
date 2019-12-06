/**
 * Created by matteo.pipitone on 09/03/2015.
 */

$(function() {
    STORIA_CONTATTO.init();
    STORIA_CONTATTO.setEvents();
});

var STORIA_CONTATTO = {

    dimensioneWk:null,

    init : function(){

        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        STORIA_CONTATTO.calcolaDimensioneWk();
        STORIA_CONTATTO.initWkEventiPrec();
        if( top.name == 'schedaRicovero'){
            var contentTabs = parseInt($("div.contentTabs").height());
            $(".contentTabs").css({height:contentTabs - 100});

        };
    },
    setEvents : function(){

    },
    calcolaDimensioneWk : function(){
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        STORIA_CONTATTO.dimensioneWk = contentTabs  - margine;
    },
    initWkEventiPrec : function() {
        if (!STORIA_CONTATTO.WkStoriaPaz) {
            $("div#divWkStoriaContatto").height(STORIA_CONTATTO.dimensioneWk);
            STORIA_CONTATTO.WkStoriaPaz = new WK({
                id : "STORIA_CONTATTO",
                container : "divWkStoriaContatto",
                aBind : ['iden_contatto'],
                aVal : [$("#IDEN_CONTATTO").val()]
            });
            STORIA_CONTATTO.WkStoriaPaz.loadWk();
        }
    }
};