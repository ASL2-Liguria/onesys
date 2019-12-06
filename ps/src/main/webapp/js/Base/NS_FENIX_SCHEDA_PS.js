/**
 * Created by carlo.gagliolo on 22/07/2015.
 * Funzione peculiari delle schede di PS
 */

/** @TODO Inserire tutte le funzioni utilizzate in tutte le pagine per esempio iniziare da setReadOnly */

$(document).ready(function()
{
    NS_FENIX_SCHEDA_PS.init();
    NS_FENIX_SCHEDA_PS.setEvents();
});

var NS_FENIX_SCHEDA_PS = {

    init : function(){
        NS_FENIX_SCHEDA.adattaLayout = NS_FENIX_SCHEDA_PS.adattaLayout;
    },

    setEvents : function(){

    },

    adattaLayout:function()
    {
        var hWin = LIB.getHeight();
        var body = $("body");
        var paddingBody = body.pixels("paddingTop") + body.pixels("paddingBottom");

        if($('.ulTabs li').length > 0){

            NS_FENIX_SCHEDA.content.height(hWin  - $(".ulTabs",".tabs").outerHeight() - $(".headerTabs", ".tabs").outerHeight() - $(".footerTabs", ".tabs").outerHeight() - paddingBody);
        }
        else {
            $('.ulTabs').hide();

            NS_FENIX_SCHEDA.content.height(hWin /* - $(".ulTabs",".tabs").outerHeight()*/ - $(".headerTabs", ".tabs").outerHeight() - $(".footerTabs", ".tabs").outerHeight() - paddingBody);
            var title = traduzione.lblTitolo;
            if($('#lblTitolo').length == 0) {
                $('.headerTabs h2').append('<span id="title">' + title + '</span>');
            }


        }

        /* TODO commentare la riga sopra e decommentare le righe sotto dopo aver sostituito TABULAZIONE.INIT con TABULAZIONE.ANTISCROLL in HTML_STRUTTURA per attivare l'antiscroll */
        /*NS_FENIX_SCHEDA.content.closest('.antiscroll-box').height(hWin - $(".ulTabs",".tabs").outerHeight() - $(".headerTabs",".tabs").outerHeight() - $(".footerTabs",".tabs").outerHeight() - paddingBody);
         NS_FENIX_SCHEDA.content.closest('.antiscroll-inner').height(hWin - $(".ulTabs",".tabs").outerHeight() - $(".headerTabs",".tabs").outerHeight() - $(".footerTabs",".tabs").outerHeight() - paddingBody);
         NS_FENIX_SCHEDA.content.closest('.antiscroll-wrap').antiscroll(); */
        var scrollParameters	=
        {
            'autoReinitialise':		false,
            'showArrows':			true,
            'mouseWheelSpeed':		50
        };

        NS_FENIX_SCHEDA.scrollParameters = scrollParameters;
        // NS_FENIX_SCHEDA.content.jScrollPane(scrollParameters);


    }

};