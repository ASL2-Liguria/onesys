var NS_MENU_ANAGRAFICA = {

    IsRemota:function(rec) {
        if(LIB.isValid(rec[0].URL_REMOTA))return true;
        else  return false;
    },

    inserisciRicovero : function(rec) {
    	NS_HOME_ADT_FUNZIONI_CONTATTO.inserisiciRicovero(rec);
    },

    inserisciPrericovero : function(rec) {
    	//home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=INS_PRERICOVERO&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA+'&STATO_PAGINA=I&TIPO=WK_PAZIENTI',id:'INS_PRERICOVERO',fullscreen:true});
        var url='page?KEY_LEGAME=INS_PRERICOVERO&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA+'&STATO_PAGINA=I&TIPO=WK_PAZIENTI';
        NS_HOME_ADT_FUNZIONI_CONTATTO.checkListaAttesa(rec,url,'INS_PRERICOVERO','PRERICOVERO');
    },

    inserisciCartellaStorica : function(rec) {
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=CARTELLA_STORICA&IDEN_ANAGRAFICA='+rec[0].IDEN_ANAGRAFICA+'&STATO_PAGINA=I',id:'CARTELLA_STORICA',fullscreen:true});
    },

    inserisciDSA : function(rec) {
    	home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=GESTIONE_DSA&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA,id:'GestioneDSA',fullscreen:true});
    },


   inserisciInListAttesa : function(rec) {
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=LISTA_ATTESA_SCELTA&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA+'&STATO_PAGINA=T',id:'ListaAttesa',fullscreen:true});
    },

    inserisciPaziente : function(rec) {
    	home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=I',id:'insAnag',fullscreen:true});
    },

    modificaPaziente : function(rec) {
    	home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=E&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA,id:'insAnag',fullscreen:true});
    },

    inserisciPazienteSconosciuto : function(rec) {
    	home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=S',id:'insAnag',fullscreen:true});
    },

    InserisciEsame:function(rec){
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ESAME&STATO_ESAME=30&IDEN_ANAGRAFICA='+rec[0].IDEN_ANAGRAFICA,id:'SchedaEsamePage',fullscreen:true});
    },

    PrenotaEsame:function(rec){
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ESAME&IDEN_ANAGRAFICA='+rec[0].IDEN_ANAGRAFICA+'&STATO_ESAME=10',id:'SchedaEsamePage',fullscreen:true});
    },

    ElaboraRemoto:function(rec,cbk){
        var $this = this;
        $.support.cors = true;
        $.ajax({
            url: rec[0].URL_REMOTA,
            dataType : "json",
            type : "POST" ,
            success : function(r) {
                if(r.result === "OK" )
                {
                    rec[0].IDEN_ANAGRAFICA = r.message;
                    cbk.call($this, rec);
                }
                else
                {
                    home.NOTIFICA.error({
                        message: r.message,
                        title: "Errore Anagrafica Remota"
                    });
                }
            },
            error: function (r)
            {
                home.NOTIFICA.error({
                    message: r.message,
                    title: "Errore Anagrafica Remota"
                });
            }
        });
    },

    stampaStoricoRicoveri : function(idenAnagrafica){
        var _par = {};
        _par.PRINT_DIRECTORY = 'STORICO_RICOVERI';
        _par.PRINT_REPORT = 'STORICO_RICOVERI_PZ';
        _par.PRINT_PROMPT = "&promptIDEN_ANAGRAFICA=" + idenAnagrafica;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    }
};