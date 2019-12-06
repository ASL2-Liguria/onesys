NS_FENIX_SCHEDA.beforeClose = function(){
    if($("#EXIT_ALL").val() == 'S'){
        home.NS_FENIX_TOP.logout();
    }else{
        return true;
    }
};
$(document).on("mousedown", "textarea.STD", function (e) {
    NS_FENIX_SCHEDA_ADT.contextMenu($(this),e);
});
$(document).ready(function(){
   NS_FENIX_SCHEDA_ADT.init();
});
var NS_FENIX_SCHEDA_ADT = {
    init:function(){
        NS_FENIX_SCHEDA_ADT.initTextarea()
    },

    /**
     * menu contesuale frasi standard per ogni textarea
     * @param _this
     * @param e
     */
    contextMenu: function(_this,e){
        var menu = _this.contextMenu(FRASI_STD_MENU);
        var ev = {
            "elemento": _this.attr("id"),
            "pagina": $("#KEY_LEGAME").val()
        };
        if (e.button === 2) {
            menu.open(e, ev);
        }
    },
    /**
     * Autosize e tooltip per le textarea
     */
    initTextarea: function () {
        var textarea = $("textarea.STD");
        textarea.autosize();
        textarea.attr("title", "Premi il tasto destro per inserire le frasi standard");
        textarea.tooltip({
            position: {
                my: "center bottom-20",
                at: "center top",
                using: function (position, feedback) {
                    $(this).css(position);
                    $("<div>")
                        .addClass("arrow")
                        .addClass(feedback.vertical)
                        .addClass(feedback.horizontal)
                        .appendTo(this);
                }
            }
        });
    }
};
var FRASI_STD_MENU = {

    "menu": {
        "id": "MENU_FRASI_STD",
        "structure": {
            "list": [
                {
                    "id": "apriFrasiStdRefertazione",
                    "concealing": "true",
                    "link": function (rec) {
                        home.NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=FRASI_STD_REFERTAZIONE&ELEMENTO_SELEZIONATO='
                            + rec.elemento+'&PAGINA_APERTURA='+rec.pagina, id: 'FrasiStdRefertazione', fullscreen: true});
                    },
                    "enable": "S",
                    "url_image": "./img/CMenu/modifica.png",
                    "where": function (rec) { return (rec!==undefined); },
                    "output": "traduzione.lblInsFrasiStd",
                    "separator": "false"
                }
            ]
        },
        "title": "traduzione.lblMenu",
        "status": true
    }

};