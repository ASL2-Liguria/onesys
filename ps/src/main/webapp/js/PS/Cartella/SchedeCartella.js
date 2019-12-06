$(function() {
    NS_FENIX_SCHEDA.adattaLayout = NS_SCHEDE_CARTELLA.adattaLayout;
    NS_SCHEDE_CARTELLA.init();
});

var NS_SCHEDE_CARTELLA= {
    content:null,

    init : function()
    {
        home.NS_CONSOLEJS.addLogger({name: 'NS_SCHEDE_CARTELLA', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_SCHEDE_CARTELLA'];

        home.NS_SCHEDE_CARTELLA = this;
    },
    setEvents : function()
    {

    },
    adattaLayout : function()
    {
        var hWin = LIB.getHeight();
        var body = $("body");
        var paddingBody = body.pixels("paddingTop") + body.pixels("paddingBottom") +2;

        NS_FENIX_SCHEDA.content.height(hWin /*- $(".ulTabs",".tabs").outerHeight()*/ - $(".headerTabs",".tabs").outerHeight() - paddingBody-20);
    }
};