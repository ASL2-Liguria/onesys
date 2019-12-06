$(function() {
	NS_DIARI.init();
	NS_DIARI.setEvents();	
});

var NS_DIARI = {

    dimensioneWk:null,

    init : function(){
        if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }

        if($("#READONLY").val() === "S"){$("div.contentTabs").css({"background":"#CACACC"})}

        NS_DIARI.calcolaDimensioneWk();
        if($('#KEY_LEGAME').val() == 'DIARI'){
            NS_DIARI.initWkEventiPrec();
        }
        else{
            NS_DIARI.initWkEventiPrecInf();
        }
        if( top.name == 'schedaRicovero'){
            var contentTabs = parseInt($("div.contentTabs").height());
            $(".contentTabs").css({height:contentTabs - 100});

        }
    },
    setEvents : function(){

    },
    calcolaDimensioneWk : function(){
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        NS_DIARI.dimensioneWk = contentTabs  - margine;
    },
    initWkEventiPrec : function() {
        if (!NS_DIARI.WkEventiPrec) {
            $("div#divWkEventiPrec").height(NS_DIARI.dimensioneWk);
            NS_DIARI.WkEventiPrec = new WK({
                id : "PS_WK_DIARI",
                container : "divWkEventiPrec",
                aBind : ['iden_contatto'],
                aVal : [$("#IDEN_CONTATTO").val()]
            });
            NS_DIARI.WkEventiPrec.loadWk();
        }
    },
    initWkEventiPrecInf : function() {
        if (!NS_DIARI.WkEventiPrec) {

            $("div#divWkEventiPrecInf").height(NS_DIARI.dimensioneWk);
            NS_DIARI.WkEventiPrec = new WK({
                id : "PS_WK_DIARI_INF",
                container : "divWkEventiPrecInf",
                aBind : ['iden_contatto'],
                aVal : [$("#IDEN_CONTATTO").val()]
            });
            NS_DIARI.WkEventiPrec.loadWk();
        }
    },
    eliminaDiario : function (iden){


        function callbackOk () {
            document.location.replace(document.location);
        }

        var parametri = {
            "datasource": "PS",
            "id": "PS_SALVATAGGI.FNC_DELETE_DIARI",
            "params": {pIden : {v:iden, t:'N'},
                       pIdenPer : {v:Number(home.baseUser.IDEN_PER), t:'N'}},
            "callbackOK": callbackOk
        };

        NS_CALL_DB.FUNCTION(parametri);
    }
};