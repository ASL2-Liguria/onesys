/**
 * Created by matteo.pipitone on 17/04/2015.
 * file che racchiude tutte le where per fare vedere i menu nelle wk
 * nell'xml bisogna mettere la chiamata ad una funzione racchiusa in questo file
 * in modo tale che se bisogna fare qualche modifica non bisogna cancellare tutti i menu ma basta cancellare la cache
 * inoltre rende i file dei menu più leggibili
 */

var WHERE_MENU_GENERALE = {

    /**
     * controlla che sia selezionato almeno un record
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    CHECK_LENGTH : function(rec){
        return (rec.length !== 0);
    },
    /**
     * controlla che sia selezionato solo un record
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    CHECK_LENGTH_ONE : function(rec){
        return (rec.length === 1);
    },
    /*
     * viene identificato se un paziente non è SCONOSCIUTO
     * @param {type} rec
     * @returns {Boolean}
     */
    PAZIENTE_CONOSCIUTO : function(rec){
        return (rec[0].COGNOME !== "SCONOSCIUTO" && rec.length === 1);
    },
    /*
     * viene identificato se un paziente è SCONOSCIUTO
     * @param {type} rec
     * @returns {Boolean}
     */
    PAZIENTE_SCONOSCIUTO : function(rec) {
        return (rec[0].COGNOME === "SCONOSCIUTO" && rec.length === 1);
    },
    /**
     * controllo se utente medico
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PERSONALE_MEDICO :function(rec){
        return (home.baseUser.TIPO_PERSONALE === "M" && rec.length === 1);
    },
    /**
     * controllo se utente infermiere
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PERSONALE_INFERMIERE :function(rec){
        return ((home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === 'OST') && rec.length === 1);
    },
    /**
     * controllo se utente amministrativo
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PERSONALE_AMMINISTRATIVO :function(rec){
        return (home.baseUser.TIPO_PERSONALE === "A" && rec.length === 1);
    },
    /**
     * controllo su utente DEBUGGER
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PERSONALE_DEBUGGER : function(rec){
        return (home.basePermission.hasOwnProperty('DEBUGGER') && rec.length === 1);
    }
};

var WHERE_MENU_LISTA_APERTI = {
    /**
     * gestione cartella di PS
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    APRI_CARTELLA_OBI:function(rec){


        return (   (
            (
                (home.baseUser.TIPO_PERSONALE == 'M') &&
                (rec[0].ID_UTE_RIFERIMENTO == home.baseUser.IDEN_PER)
                ) || (home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST"))
            && rec.length == 1 && rec[0].REGIME == 'OBI');
    },

    /**
     * gestione cartella di PS
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    APRI_CARTELLA:function(rec){
        return ( (
            (
                (home.baseUser.TIPO_PERSONALE == 'M') &&
                (rec[0].ID_UTE_RIFERIMENTO == home.baseUser.IDEN_PER)
            ) ||  (home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST"))
            && rec.length == 1
            && rec[0].REGIME != 'OBI');
    },

    /**
     * @return {boolean}
     */
    APRI_CARTELLA_READONLY:function(rec){
        return (
        ( home.baseUser.TIPO_PERSONALE == 'M' ||  home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST")
        && rec.length == 1
        );
    },


    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PRESA_IN_CARICO : function(rec) {
        /*for(var i = 0; rec.length > i; i++) {
            if(rec[i].ID_UTE_RIFERIMENTO == home.baseUser.IDEN_PER && rec.length > 1) {
                home.NOTIFICA.warning({title: "Attenzione", message: "Paziente " + rec[i].PAZIENTE + " gia' a suo carico", timeout: 5});
            }
        }  */
        if(rec.length == 1){
            return (rec[0].ID_UTE_RIFERIMENTO != home.baseUser.IDEN_PER && home.baseUser.TIPO_PERSONALE == 'M');
        }else{
            return (home.baseUser.TIPO_PERSONALE == 'M');
        }
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    CANCEL_PRESA_IN_CARICO : function (rec) {
        return (
            home.baseUser.TIPO_PERSONALE == 'M' &&
            rec[0].ID_UTE_RIFERIMENTO == home.baseUser.IDEN_PER &&
            rec.length == 1 &&
            rec[0].REGIME != 'OBI' &&
            (
                rec[0].PRIMA_PRESA_IN_CARICO_MEDICA==="S" && rec[0].CODICE == null ||
                rec[0].PRIMA_PRESA_IN_CARICO_MEDICA==="N"
            )

        );
    },
    /**
     * @return {boolean}
     */
    CANCELLA_AMM : function (rec) {
        return (rec.length === 1) && rec[0].REGIME != 'OBI'  && (home.baseUser.TIPO_PERSONALE === "M" || home.baseUser.TIPO_PERSONALE === "A");
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PASSAGGIO_DI_CONSEGNE : function (rec) {

        /*for(var i = 0; rec.length > i; i++) {
            if(rec[i].ID_UTE_RIFERIMENTO != home.baseUser.IDEN_PER && rec.length > 1) {
                home.NOTIFICA.warning({title: "Attenzione", message: "Paziente " + rec[i].PAZIENTE + " Non a suo carico", timeout: 5});
            }
        } */
        if(rec.length == 1){
            return (rec[0].ID_UTE_RIFERIMENTO == home.baseUser.IDEN_PER && home.baseUser.TIPO_PERSONALE == 'M');
        }else{
            return (home.baseUser.TIPO_PERSONALE == 'M');
        }
    } ,
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PASSAGGIO_DI_CONSEGNE_INF : function (rec) {

        /*for(var i = 0; rec.length > i; i++) {
         if(rec[i].ID_UTE_RIFERIMENTO != home.baseUser.IDEN_PER && rec.length > 1) {
         home.NOTIFICA.warning({title: "Attenzione", message: "Paziente " + rec[i].PAZIENTE + " Non a suo carico", timeout: 5});
         }
         } */
        if(rec.length == 1){
            return (rec[0].ID_UTE_RIFERIMENTO_INFERMIERE == home.baseUser.IDEN_PER && (home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST"));
        }else{
            return (home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST");
        }
    },
    /**
     * @return {boolean}
     */
    PRESA_IN_CARICO_INF :function(rec){
        if(rec.length == 1){
            return (rec[0].ID_UTE_RIFERIMENTO_INFERMIERE != home.baseUser.IDEN_PER && (home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST"));
        }else{
            return (home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST");
        }
    },
    /**
     * @return {boolean}
     */
    SEGNALA_OBI : function (rec) {
        //((urgenza!="NERO") && (tipoPersonale==="M") && (statoLista==="RIMOSSO") && (statoContatto=="ADMITTED")) || ( (statoContatto=="DISCHARGED") && (home.basePermission.hasOwnProperty('SUPERUSER')) ) || ( (home.baseUser.IDEN_PER==hUtenteDimissione) && (hOreDiffChiusura<12) && (statoContatto==="DISCHARGED") )
        return rec.length === 1 && rec[0].REGIME != 'OBI' && rec[0].CODICE!="NERO" && home.baseUser.TIPO_PERSONALE==="M" && (home.basePermission.hasOwnProperty('SUPERUSER') || (home.baseUser.IDEN_PER==rec[0].ID_UTE_RIFERIMENTO));
    },
    /**
     * @return {boolean}
     */
    SCELTA_ESITO : function(rec){
        return home.baseUser.TIPO_PERSONALE === "M" && rec.length === 1 && rec[0].REGIME != 'OBI' && rec[0].ID_UTE_RIFERIMENTO == home.baseUser.IDEN_PER;
    },
    /**
     * @return {boolean}
     */
    SCELTA_ESITO_OBI : function(rec){
        return home.baseUser.TIPO_PERSONALE === "M" && rec.length === 1 && rec[0].REGIME == 'OBI' && (home.basePermission.hasOwnProperty('SUPERUSER') || (home.baseUser.IDEN_PER==rec[0].ID_UTE_RIFERIMENTO));
    },
    /**
     * @return {boolean}
     */
    ANNULLA_OBI : function (rec) {
        return home.baseUser.TIPO_PERSONALE === "M" && rec.length === 1 && rec[0].REGIME == 'OBI' && (home.basePermission.hasOwnProperty('SUPERUSER') || (home.baseUser.IDEN_PER==rec[0].ID_UTE_RIFERIMENTO))  && (rec[0].DIFF <= 6) ;

    }

};

var WHERE_MENU_LISTA_ATTESA = {
    /**
     * Controllo per il triage se non vi è ancora l'urgenza
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    TRIAGE : function(rec){
       return ( (home.baseUser.TIPO_PERSONALE === "M" || home.baseUser.TIPO_PERSONALE === "OST" || home.baseUser.TIPO_PERSONALE === "I") && rec[0].STATO_LISTA_ATTESA=="INSERITO" && rec[0].PROGRESSIVO==0 && rec.length === 1 && (rec[0].URGENZA === null || rec[0].URGENZA === "null" || rec[0].URGENZA ==="" || typeof rec[0].URGENZA === "undefined" || rec[0].URGENZA === "undefined") );
    },
    /**
     * se è già stata salvata almeno un urgenza
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    COMPLETA_TRIAGE : function(rec){
        return ( (home.baseUser.TIPO_PERSONALE === "M" || home.baseUser.TIPO_PERSONALE === "OST" || home.baseUser.TIPO_PERSONALE === "I") && rec[0].STATO_LISTA_ATTESA=="INSERITO" && rec[0].PROGRESSIVO==0 && rec.length === 1 && (rec[0].URGENZA !== null && rec[0].URGENZA !== "null" && rec[0].URGENZA !=="" && typeof rec[0].URGENZA !== "undefined" && rec[0].URGENZA !== "undefined") );
    },
    /**
     * completare la rivalutazione rimasta incompleta
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    COMPLETA_RIVALUTAZIONE : function(rec){
        return ( (home.baseUser.TIPO_PERSONALE === "M" || home.baseUser.TIPO_PERSONALE === "OST" || home.baseUser.TIPO_PERSONALE === "I") && rec[0].STATO_LISTA_ATTESA=="INSERITO" && rec[0].PROGRESSIVO > 0 && rec.length === 1);
    },
    /**
     * Controllo per la rivalutazione
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    RIVALUTA_TRIAGE : function(rec){
        return ( (home.baseUser.TIPO_PERSONALE === "M" || home.baseUser.TIPO_PERSONALE === "OST" || home.baseUser.TIPO_PERSONALE === "I") && rec[0].STATO_LISTA_ATTESA==="COMPLETO" && rec.length === 1);
    },
    /**
     * Possibilità di modificare il primo triage
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    MANUTENZIONE_TRIAGE : function(rec){
        return ( (home.baseUser.TIPO_PERSONALE === "M" || home.baseUser.TIPO_PERSONALE === "OST" || home.baseUser.TIPO_PERSONALE === "I") && (rec[0].STATO_LISTA_ATTESA==="COMPLETO")  && rec[0].PROGRESSIVO == 0 && (home.baseUser.IDEN_PER==rec[0].UTE_INS_LISTA) && (rec[0].IDEN_LISTA!="null" && typeof rec[0].IDEN_LISTA!='undefined' && rec[0].IDEN_LISTA!='' && rec[0].IDEN_LISTA!=null) && rec.length === 1);
    },
    /**
     * Possibilità di modificare le rivalutazioni
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    MANUTENZIONE_RIVALUTAZIONE : function(rec){
        return ( (home.baseUser.TIPO_PERSONALE === "M" || home.baseUser.TIPO_PERSONALE === "OST" || home.baseUser.TIPO_PERSONALE === "I") && (rec[0].STATO_LISTA_ATTESA==="COMPLETO")  && rec[0].PROGRESSIVO > 0 && (home.baseUser.IDEN_PER==rec[0].UTE_INS_LISTA) && (rec[0].IDEN_LISTA!="null" && typeof rec[0].IDEN_LISTA!='undefined' && rec[0].IDEN_LISTA!='' && rec[0].IDEN_LISTA!=null) && rec.length === 1);
    },
    /**
     * presa in carico medica
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PRESA_IN_CARICO : function(rec){
        return (home.baseUser.TIPO_PERSONALE === "M" && (rec[0].STATO_LISTA_ATTESA==="COMPLETO") && rec.length === 1);
    },
    /**
     * controllo sulle funzioni di stampa
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    STAMPA_COMPLETO : function(rec){
        return (rec[0].STATO_LISTA_ATTESA==="COMPLETO" && rec.length === 1);
    },

    STAMPA_NUMERO : function(rec){
        var NO_STAMPA_NUMERO_CHIAMATA = $.parseJSON(home.baseGlobal.NO_STAMPA_NUMERO_CHIAMATA);

        var idenCdc = rec[0].IDEN_CDC;

        return (rec[0].STATO_LISTA_ATTESA==="COMPLETO" && rec.length === 1) && ( (NO_STAMPA_NUMERO_CHIAMATA[idenCdc] == 'S' || typeof NO_STAMPA_NUMERO_CHIAMATA[idenCdc] == 'undefined') ) ;
    },

    STAMPA_PRIVACY : function(rec){
        var NO_STAMPA_PRIVACY = $.parseJSON(home.baseGlobal.NO_STAMPA_PRIVACY);

        var idenCdc = rec[0].IDEN_CDC;
        return (rec[0].STATO_LISTA_ATTESA==="COMPLETO" && rec.length === 1) && ( (NO_STAMPA_PRIVACY[idenCdc] == 'S' || typeof NO_STAMPA_PRIVACY[idenCdc] == 'undefined') ) ;
    },
    /**
     * possibilità di segnalare l'allontanato durante l'iter diagnostico
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    SEGNALA_ALLONTANATO : function(rec){
        return ( (home.baseUser.TIPO_PERSONALE == "M" || home.baseUser.TIPO_PERSONALE == "I") && (rec.length === 1) && (rec[0].URGENZA !== null && rec[0].URGENZA !== "null" && rec[0].URGENZA !=="" && typeof rec[0].URGENZA !== "undefined" && rec[0].URGENZA !== "undefined"));
    },
    /**
     * @return {boolean}
     * @param rec
     */
    PRESA_IN_CARICO_INF : function (rec) {
        if(rec.length == 1){
            return (rec[0].ID_UTENTE_RESPONSABILE != home.baseUser.IDEN_PER && (home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST"));
        }else{
            return(home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST");
        }

    },
    /**
     * @return {boolean}
     */
    PASSAGGIO_DI_CONSEGNE_INF :function(rec){
        if(rec.length == 1){
            return (rec[0].ID_UTENTE_RESPONSABILE == home.baseUser.IDEN_PER && (home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST"));
        }else{
            return (home.baseUser.TIPO_PERSONALE === "I" || home.baseUser.TIPO_PERSONALE === "OST");
        }
    }
};

var WHERE_MENU_LISTA_OBI = {
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    ELIMINA_ESITO : function(rec){
        return ( ((home.baseUser.TIPO_PERSONALE === "M") && (rec[0].ID_UTE_RIFERIMENTO == home.baseUser.IDEN_PER) && (rec[0].DIFF <= 6)  )  ) || (home.basePermission.hasOwnProperty("SUPERUSER")) ;
        /*(rec.length == 1) && (home.baseUser.TIPO_PERSONALE === 'M') && (home.basePermission.hasOwnProperty('SUPERUSER') || ( (rec[0].UTENTE_DIMISSIONE == home.baseUser.IDEN_PER) && (rec[0].DIFF <= 12)*/
    },
    /**
     * @return {boolean}
     */
    SCELTA_ESITO : function (rec){
        return (rec.length == 1 && rec[0].ID_UTE_RIFERIMENTO == home.baseUser.IDEN_PER && home.baseUser.TIPO_PERSONALE == 'M');
    }
};

var WHERE_MENU_GESTIONE_ESITO = {

    /**
     * @return {boolean}
     */
    APRI_CARTELLA:function (rec){
        return (
            rec.length == 1 &&
            (
                home.baseUser.TIPO_PERSONALE === 'M' ||
                home.baseUser.TIPO_PERSONALE === 'I' ||
                home.baseUser.TIPO_PERSONALE === "OST"
            ) &&
                (
                    ( home.basePermission.hasOwnProperty('SUPERUSER') ) ||
                    (
                        (rec[0].UTENTE_DIMISSIONE == home.baseUser.IDEN_PER && rec[0].UTENTE_DIMISSIONE != null) &&
                        (rec[0].DIFF <= 24 && rec[0].DIFF != null )
                        /*&&
                            (
                                (rec[0].ID_ESITO == '2') || (rec[0].ID_ESITO_OBI == '2')
                            )  */
                    )

                )
            );

    },
    /**
     *
     * @returns {boolean}
     */
    MANUTENZIONE_CARTELLA : function(rec){
        return (rec.length == 1 && home.baseUser.TIPO_PERSONALE === "M" &&
            (
                ( home.basePermission.hasOwnProperty("SUPERUSER") )
                ||
                ((rec[0].UTENTE_DIMISSIONE == home.baseUser.IDEN_PER && rec[0].UTENTE_DIMISSIONE != null) && (rec[0].DIFF <= home.baseGlobal["cartella.tempo_manutenzione.cartella_chiusa"] && rec[0].DIFF != null ))
            )

        );
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    ASS_PAZ_SCONOSCIUTO : function(rec){
        return ( (rec.length == 1) && (rec[0].COGNOME === 'SCONOSCIUTO') && (home.basePermission.hasOwnProperty('SUPERUSER') || ((home.baseUser.TIPO_PERSONALE === 'M') && (rec[0].UTENTE_DIMISSIONE == home.baseUser.IDEN_PER) && (rec[0].DIFF <= home.baseGlobal["cartella.tempo_modifica.cartella_chiusa"]) && rec[0].UTENTE_DIMISSIONE != null)) );
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    RIASSOCIA_PAZIENTE : function(rec){
        return ( (rec.length == 1) && (rec[0].COGNOME !== 'SCONOSCIUTO') && (home.basePermission.hasOwnProperty('SUPERUSER') || ((home.baseUser.TIPO_PERSONALE === 'M') && (rec[0].UTENTE_DIMISSIONE == home.baseUser.IDEN_PER) && (rec[0].DIFF <= home.baseGlobal["cartella.tempo_modifica.cartella_chiusa"])&& rec[0].UTENTE_DIMISSIONE != null)) );

    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    ELIMINA_DIMISSIONE : function(rec){
        return (rec.length == 1 && (home.basePermission.hasOwnProperty('SUPERUSER') || ((home.baseUser.TIPO_PERSONALE === 'M') && (rec[0].UTENTE_DIMISSIONE == home.baseUser.IDEN_PER) && (rec[0].DIFF <= home.baseGlobal["cartella.tempo_modifica.cartella_chiusa"]) && rec[0].UTENTE_DIMISSIONE != null)));
    },
    /**
     * @return {boolean}
     */
    APRI_CARTELLA_READONLY : function (rec) {
        return (rec.length == 1);
    },
    INVIA_CARTELLA : function (rec) {
        return (rec.length !== 0  && rec[0].UTENTE_DIMISSIONE != null);
    }

};

var WHERE_MENU_MALATTIE_RARE = {
   modifica : function (rec){
       return  rec.length == 1 ;
   }
};