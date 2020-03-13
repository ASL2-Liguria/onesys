$(document).ready(function() {
    try {
        NS_LOADING.showLoading();
        NS_MAIN_PAGE.init();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});

var NS_MAIN_PAGE = {
    init: function() {
        home.MAIN_PAGE = this;
        NS_MAIN_PAGE.gestAutoLogin(unescape(NS_MAIN_PAGE.getUrlParameter('KEY_SCHEDA')));
    },
    gestAutoLogin: function(pagina) {
        if (pagina) {
            var url = "page?KEY_LEGAME=" + pagina;
            var id = pagina;
            home.NS_FENIX_TOP.apriPagina({
                url: url,
                id: id,
                fullscreen: false
            });
            return true;
        } else {
            return false;
        }
    },
    getUrlParameter: function(name) {
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var tmpURL = window.location.href;
        var results = regex.exec(tmpURL);

        if (results == null) {
            return "";
        } else {
            return results[1];
        }
    }
};