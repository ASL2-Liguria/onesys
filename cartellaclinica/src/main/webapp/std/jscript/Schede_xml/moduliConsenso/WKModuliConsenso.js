var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
});

var NS_WK_MODULI_CONSENSO = {
    
    cancellaModulo : function() {
        var pBinds      = new Array();
        var iden_modulo = stringa_codici(array_iden);

        if (iden_modulo == '') {
            alert('ATTENZION: effettuare una selezione');
            return;
        }

        pBinds.push(iden_modulo);

        WindowCartella.dwr.engine.setAsync(false);
        WindowCartella.dwrUtility.executeStatement('moduliConsenso.xml', 'cancellaModulo', pBinds, 0, callBack);
        WindowCartella.dwr.engine.setAsync(true);

        function callBack(resp) {
            if (resp[0] == 'KO') {
                alert(resp[1]);
            } else {
                document.location.reload();
            }
        }
    },
            
    modificaModulo : function() {
        if (stringa_codici(array_iden_visita) == '') {
            return alert('ATTENZIONE: effettuare una selezione');
        }

        var paramUrl = {
            key_id                      : stringa_codici(array_iden),
            iden_visita                 : stringa_codici(array_iden_visita),
            iden_visita_registrazione   : stringa_codici(array_iden_visita_registrazione),
            iden_anag                   : WindowCartella.getForm(document).iden_anag,
            tipo                        : stringa_codici(array_tipo),
            revoca                      : 'N',
            readonly                    : false
        };

        parent.NS_MODULI_CONSENSO.apriModulo(paramUrl);
    },
            
    revocaModulo : function() {
        if (stringa_codici(array_iden_visita) == '') {
            return alert('ATTENZIONE: effettuare una selezione');
        }
        if (stringa_codici(array_tipo)=='RICHIESTA_ESENZIONI'){
        	return alert('Operazione non consentita');
        }

        
        var paramUrl = {
            key_id                      : stringa_codici(array_iden),
            iden_visita                 : stringa_codici(array_iden_visita),
            iden_visita_registrazione   : stringa_codici(array_iden_visita_registrazione),
            iden_anag                   : parent.EXTERN.IDEN_ANAG.value,
            tipo                        : stringa_codici(array_tipo),
            revoca                      : 'S',
            readonly                    : false
        };

        parent.NS_MODULI_CONSENSO.apriModulo(paramUrl);
    },
            
    visualizzaModulo: function() {
        if (stringa_codici(array_iden_visita) == '') {
            return alert('ATTENZION: effettuare una selezione');
        }

        var paramUrl = {
            key_id                      : stringa_codici(array_iden),
            iden_visita                 : stringa_codici(array_iden_visita),
            iden_visita_registrazione   : stringa_codici(array_iden_visita_registrazione),
            iden_anag                   : parent.EXTERN.IDEN_ANAG.value,
            tipo                        : stringa_codici(array_tipo),
            revoca                      : 'N',
            readonly                    : true
        };

        parent.NS_MODULI_CONSENSO.apriModulo(paramUrl);
    },
            
    stampaModulo: function() {
        var funzione    = stringa_codici(array_tipo);
        var iden	    = stringa_codici(array_iden);
        var anteprima   = 'S';
        var reparto     = WindowCartella.getAccesso("COD_CDC");
        var sf          = '&prompt<pVisita>=' + WindowCartella.getRicovero("IDEN")+'&prompt<pIden>='+iden;

        if (funzione == '') {
            return alert('Attenzione: effettuare una selezione');
        }

        WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
    }

};


