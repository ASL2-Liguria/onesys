
/**
 * Created by matteo.pipitone on 11/03/2015.
 */
$(document).ready(function(){
    ANDAMENTO_TRIAGE.init();
    ANDAMENTO_TRIAGE.setEvents();
});

var ANDAMENTO_TRIAGE = {

    dimensioneWk: null,

    init:function(){

        $('#lblTitolo').text('Andamento Triage');

        if(LIB.isValid(home) && LIB.isValid(home.PANEL) &&  LIB.isValid(home.PANEL.NS_REFERTO)&&  LIB.isValid(home.PANEL.NS_REFERTO.SALVA_SCHEDA)){
            home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        }
        if($("#READONLY").val()==="S"){
            $("div.contentTabs").css({"background":"#CACACC"});
        }

        ANDAMENTO_TRIAGE.calcolaDimensioneWk(function(){
            ANDAMENTO_TRIAGE.initWkTriage();
            ANDAMENTO_TRIAGE.initWkRivalutazioni();
            ANDAMENTO_TRIAGE.initWkAnamnesi();
        });
    },

    setEvents : function () {

    },

    calcolaDimensioneWk : function(callback){
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 70;
        ANDAMENTO_TRIAGE.dimensioneWk = (contentTabs  - margine)/3;

        callback();
    },

    initWkTriage : function(){
        var params = {
            container: "divWkTriage",
            id: 'PS_WK_LISTA_ATTESA_TRIAGE',
            aBind: ['iden_contatto' ],
            aVal: [$("#IDEN_CONTATTO").val()]
        };
        $("div#divWkTriage").height(80);
        ANDAMENTO_TRIAGE.wkTriage = new WK(params);
        ANDAMENTO_TRIAGE.wkTriage.loadWk();
    },

    initWkRivalutazioni: function () {
        var params = {
            container: "divWkRiepilogoTriage",
            id: 'PS_WK_LISTA_ATTESA_RIEPILOGO',
            aBind: ['iden_contatto' ],
            aVal: [$("#IDEN_CONTATTO").val()]
        };
        $("div#divWkRiepilogoTriage").height(ANDAMENTO_TRIAGE.dimensioneWk);
        ANDAMENTO_TRIAGE.wkRiepilogo = new WK(params);
        ANDAMENTO_TRIAGE.wkRiepilogo.loadWk();
    },

    initWkAnamnesi : function() {
        if (!ANDAMENTO_TRIAGE.WkRivalutazioni) {
            $("div#divWkAnamnesi").height(ANDAMENTO_TRIAGE.dimensioneWk);
            ANDAMENTO_TRIAGE.WkRivalutazioni = new WK({
                id : "PS_VERSIONI_ANAMNESI",
                container : "divWkAnamnesi",
                aBind : ['iden_contatto'],
                aVal : [$("#IDEN_CONTATTO").val()]
            });
            ANDAMENTO_TRIAGE.WkRivalutazioni.loadWk();
        }else{
            ANDAMENTO_TRIAGE.WkRivalutazioni.refresh();
        }
    }

};