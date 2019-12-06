var NS_GESTIONE_RICETTE = {
    LOGGER:null,
    init: function () {
        NS_CONSOLEJS.addLogger({name:"RICETTA",console:0});
        this.LOGGER = NS_CONSOLEJS.loggers["RICETTA"];
    },
    setEvents:function(){
    },
    obj: {
        dati:null,
        setDati:function(dati){
            this.dati = dati;
            NS_GESTIONE_RICETTE.LOGGER.debug("Dati settati: "+JSON.stringify(this.dati));
        },
        getDati:function(nome){return (this.dati[nome])?this.dati[nome]:"";},
        creaDema:function(param){},
        beforeCreaDema:function(param){return true;},
        elabResponse:function(param){},
        elabEsito:function(param){},
        getDatiCreaDema:function(param){},
        okCreaDema:function(resp){},
        koCreaDema:function(){},
        getDema:function(param){},
        okGetDema:function(param){},
        koGetDema:function(resp){},
        beforeAggiornaDema:function(param){},
        aggiornaDemaEsecuzione:function(params,rec,utente){},
        aggiornaDemaCancellazione:function(params){},
        aggiornaDema:function(param){},/*OPERAZIONE : I (Inserimento) , U (Aggiornamento), D (Cancellazione)*/
        okAggiornaDema:function(param){},
        koAggiornaDema:function(param){},
        warnAggiornaDema:function(param){},
        creaRicettaRossa:function(param){},
        beforeCreaRicettaRossa:function(param){},
        okCreaRicettaRossa:function(param){},
        koCreaRicettaRossa:function(param){},
        getRicettaRossa:function(param){},
        okGetRicettaRossa:function(param){},
        koGetRicettaRossa:function(param){},
        callExternalService:function(param){},
        callSessionExternal:function(param){},
        beforeGetDema:function(param){},
        isDema:function(param){return false;},
        creaRicetteMultiple:function(params){}
    },
    getInstance:function(objExtension){
        if(objExtension){
            var _objExtension = (typeof(objExtension)=="string")?eval(objExtension):objExtension;
            NS_GESTIONE_RICETTE.LOGGER.debug("getInstance : " + objExtension);
            return $.extend(NS_GESTIONE_RICETTE.obj, _objExtension);
        }else{
            return $.extend({}, NS_GESTIONE_RICETTE.obj);
        }
    }
}