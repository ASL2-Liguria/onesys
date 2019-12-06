$(document).ready(function() {
    STORICO_ANAGRAFICA.init();
    STORICO_ANAGRAFICA.setEvents();
});

var STORICO_ANAGRAFICA = {

    dimensioneWk:null,

    init : function() {
        STORICO_ANAGRAFICA.calcolaDimensioneWk();
        STORICO_ANAGRAFICA.initWkStoria();
    },

    setEvents: function(){

    },

    calcolaDimensioneWk : function(){
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        STORICO_ANAGRAFICA.dimensioneWk = contentTabs  - margine;
    },

    initWkStoria : function(callback) {
        if (!STORICO_ANAGRAFICA.wkStoria) {
            var params = {
                container : "wkStoria",
                id : 'STORIA_PAZIENTE',
                aBind : [ 'iden_anagrafica', 'template' ],
                aVal : [ $("#IDEN_ANAG").val(), "LISTA_ATTESA/ListaAttesaFooter.ftl" ]
            };
            $("div#wkStoria").height(STORICO_ANAGRAFICA.dimensioneWk);
            STORICO_ANAGRAFICA.wkStoria = new WK(params);
            STORICO_ANAGRAFICA.wkStoria.loadWk();
            if(callback) callback();
        }else{
            STORICO_ANAGRAFICA.wkStoria.refresh();
            if(callback) callback();
        }
    },

    apriCartellaStorico:function(rec){

        home.NS_FENIX_TOP.apriPagina({
            url:'page?KEY_LEGAME=CARTELLA&STATO_PAGINA=R&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA+'&IDEN_CONTATTO='+
                rec[0].IDEN + '&IDEN_PROVENIENZA='+rec[0].IDEN_PROVENIENZA+ '&IDEN_CDC_PS='+rec[0].IDEN_CDC+
                /*'&CODICE_FISCALE='+ rec[0].CODICE_FISCALE+*/
                '&IDEN_LISTA='+rec[0].IDEN_LISTA+
                '&WK_APERTURA=LISTA_APERTI'+'&MENU_APERTURA=APRI_CARTELLA', fullscreen:true
        })
    }
}