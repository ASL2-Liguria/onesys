$(function () {
    CONSULENZE.init();
    CONSULENZE.setEvents();
});

var CONSULENZE = {

    dimensioneWk: null,
    intervalToCheck: '',
    thisUser : home.baseUser.IDEN_PER,

    init: function () {
        home.SCLogout = function () {
            home.NS_WORKSTATION_PS.logoutSmartCard();
        };
        home.NS_FENIX_TOP.callAfterLogout = function () {
            home.NS_WORKSTATION_PS.callAfterLogout();
        };
        home.NS_SMARTCARD.afterLogin = function () {
            var newUser = home.baseUser.IDEN_PER,
                controllo = false;

            if(CONSULENZE.thisUser != newUser){ controllo = true; }

            home.NS_WORKSTATION_PS.loginSmartCardSbloccaWK(controllo);
        };

        CONSULENZE.calcolaDimensioneWk();
        CONSULENZE.initWkConsulenze();

        home.NS_WK_PS = {};
        home.NS_WK_PS.caricaWk = CONSULENZE.caricaWk;
    },

    setEvents: function () {

    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== typeof value) && ("undefined" !== value) && ("null" !== value));
    },

    calcolaDimensioneWk: function () {
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        CONSULENZE.dimensioneWk = contentTabs - margine;
    },

    initWkConsulenze: function () {

        CONSULENZE.WkConsulenze = new WK({
            id: "PS_WK_CONSULENZE",
            container: "divWk",
            aBind: ['username', 'cognome', 'nome'],
            aVal: [home.baseUser.USERNAME, $('#txtCognomeConsulenze').val(), $('#txtNomeConsulenze').val()]
        });
        CONSULENZE.WkConsulenze.loadWk();
    },

    caricaWk: function () {
        CONSULENZE.WkConsulenze.loadWk();
    },

    checkExistConsolleRefertazione: function (win) {
        if (win.closed) {
            CONSULENZE.initWkConsulenze();
            clearInterval(CONSULENZE.intervalToCheck);
        }
    },

    setFunzioni : function (data, wk) {

        var div = $(document.createElement("div"));

        var apriRefertaConsulenza = $(document.createElement("a"))
            .attr("href", "javascript:CONSULENZE.apriRefertaConsulenza('" + data.IDEN_RICHIESTA + "','"+ data.COD_CDC_DESTINATARIO +
                "','"+ data.COD_CDC_RICHIEDENTE +"','"+ data.NUMERO_PRATICA +"')")
            .html("<i class=' icon-pencil' title='Referta consulenza'>");
        div.append(apriRefertaConsulenza);

        var apriCartellaPS = $(document.createElement("a"))
            .attr("href", "javascript:CONSULENZE.apriCartellaPS({nosologico:'" + data.NUMERO_PRATICA +
                "',iden_anagrafica:'" + data.IDEN_ANAG + "'})")
            .html("<i class=' icon-search' title='Apri Cartella'>");
        div.append(apriCartellaPS);

        return div;
    },

    apriCartellaPS: function (par) {

        var parametri = {
            "datasource": "PS",
            id: "CONTATTO.Q_DATI_CONSULENZA_PRONTO",
            "params": par,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            rec = data.result;
            var url = 'page?KEY_LEGAME=CARTELLA&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA + '&IDEN_CONTATTO=' +
                rec[0].IDEN_CONTATTO + '&IDEN_PROVENIENZA=' + rec[0].IDEN_PROVENIENZA + '&IDEN_CDC_PS=' + rec[0].IDEN_CDC +
                '&CODICE_FISCALE=' + rec[0].CODICE_FISCALE + '&IDEN_LISTA=' + rec[0].IDEN_LISTA +
                '&TEMPLATE=LISTA_ATTESA/ListaAttesaFooter.ftl&WK_APERTURA=LISTA_CHIUSI&MENU_APERTURA=APRI_CARTELLA' +
                '&STATO_PAGINA=R&AVVISO=CONSULENZE';
            home.NS_FENIX_TOP.apriPagina({url: url, fullscreen: true});

        }
    },

    apriRefertaConsulenza: function (idenTestata, codCdcDestinatario, codCdcRichiedente, numeroPratica) {
        var user = home.baseUser.USERNAME,
            pwd = home.baseUser.PASSWORD;

        var win = CONSULENZE.apriRefertazioneWhale(idenTestata, user, codCdcDestinatario, codCdcRichiedente, numeroPratica);

        /*var url = home.baseGlobal.URL_CARTELLA + 'whale/autoLogin?utente=' + user + '&postazione=' +
            home.AppStampa.GetCanonicalHostname().toUpperCase() + '&pagina=REFERTA_CONSULENZE&opener=PS&idenTestata=' +
            idenTestata + '&abilitaFirma=S';

        var win = window.open(url, null, "fullscreen=yes");*/

        var a = function (win) {
            //console.log('out ' + typeof win);
            return function () {
                //console.log('in ' + typeof win);
                CONSULENZE.checkExistConsolleRefertazione(win);
            }
        };

        CONSULENZE.intervalToCheck = window.setInterval(a(win), 500);
    },

    apriRefertazioneWhale: function(idenTestata, user, codCdcDestinatario, codCdcRichiedente, numeroPratica){

        var key;
        var urlRefertazioneCdc = home.baseGlobal["OE.CONSULENZE.URLREFERTAZIONE.from."+ codCdcRichiedente +".to." + codCdcDestinatario];
        var urlRefertazioneStd = home.baseGlobal["OE.CONSULENZE.URLREFERTAZIONE"];

        //se esiste una configurazione specifica di reparto uso quella
        if(CONSULENZE.hasAValue(urlRefertazioneCdc))
        {
            key = urlRefertazioneCdc;
        }
        else
        {
            //se esiste una configurazione generica uso quella
            if(urlRefertazioneStd)
            {
                key = urlRefertazioneStd;
            }
            else
            {
                //se non ho trovato nulla di confiurato uso quello che, ad oggi, risulta il comportamento base
                key = "getUrlSchedaWhale";
            }
        }

        var url= CONSULENZE.refertazione[key](idenTestata, user, numeroPratica);

        return window.open(url, null, "fullscreen=yes");
    },

    refertazione : {

        getUrlSchedaWhale : function(idenTestata, user, numeroPratica){
            return home.baseGlobal.URL_CARTELLA+"whale/autoLogin?utente="+user+"&postazione="+home.AppStampa.GetCanonicalHostname().toUpperCase()+
                "&pagina=REFERTA_CONSULENZE&opener=PS&idenTestata="+idenTestata + '&abilitaFirma=S';
        },

        getUrlSchedaMetal : function(idenTestata,user, numeroPratica){
            return home.baseGlobal.URL_CARTELLA+"whale/autoLogin?utente="+user+"&postazione="+home.AppStampa.GetCanonicalHostname().toUpperCase()+
                "&opener=UNISYS&pagina=CARTELLAPAZIENTEMETAL&MODALITA_ACCESSO=METAL&ricovero="+numeroPratica+"&funzione=progettoMetal()";
        }

    }

};