$(document).ready(function () {
    NS_FENIX_SCHEDULER.init();
    NS_FENIX_SCHEDULER.setEvents();
    home.NS_LOADING.hideLoading();
});

var NS_FENIX_SCHEDULER = {

    s: null,
    sContent: null,

    init: function () {
        NS_FENIX_SCHEDULER.s = $('.scheduler');
        NS_FENIX_SCHEDULER.sContent = NS_FENIX_SCHEDULER.s.find('.sContent');
        NS_FENIX_SCHEDULER.adattaLayout();
    },

    setEvents: function () {
        NS_FENIX.setEvents();

        $(".butChiudi").on("click", NS_FENIX_SCHEDULER.chiudi);
        $(".butAggiorna").on("click", NS_FENIX_SCHEDULER.aggiorna);
    },

    adattaLayout: function () {
        var hWin = LIB.getHeight();
        var body = $('body');
        var paddingBody = body.pixels("paddingTop") + body.pixels("paddingBottom");
        var hContent = hWin - NS_FENIX_SCHEDULER.s.find('.sHeader').outerHeight() - NS_FENIX_SCHEDULER.s.find('.sFooter').outerHeight() - paddingBody;

        NS_FENIX_SCHEDULER.sContent.height(hContent);
    },

    beforeClose: function () {
        return true;
    },
    chiudi: function () {
        NS_FENIX_SCHEDULER.beforeClose();
        var n_scheda = $("#N_SCHEDA").val();
        home.NS_FENIX_TOP.chiudiScheda({"n_scheda": n_scheda});
    },

    aggiorna: function (){
        $('.dhx_cal_tab.active').trigger('click');
    }
}