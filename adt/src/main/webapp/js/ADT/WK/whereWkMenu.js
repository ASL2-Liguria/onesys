/**
 * Created by matteo.pipitone on 17/03/2016.
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
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PERSONALE_BACKOFFICE : function(rec){
        return (home.basePermision.hasOwnProperty("BACKOFFICE") && rec.length === 1);
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
var WHERE_STORICO_PAZIENTE = {
    /***
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    MODIFICA_RICOVERO : function (rec){
        return !!(rec[0].ASSIGNING_AUTHORITY_AREA == 'ADT' && (rec[0].REGIME_RICOVERO_CODICE == '1' || rec[0].REGIME_RICOVERO_CODICE == '2') && (home.basePermission.hasOwnProperty('BACKOFFICE') || rec[0].IS_CDC_GIURIDICO_UTENTE == 'S' || rec[0].IS_CDC_GIURIDICO_ATTUALE == 'S' ||rec[0].IS_CDC_ASSISTENZIALE_ATTUALE == 'S' ) );
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    MODIFICA_PRERICOVERO : function (rec) {
        return rec[0].REGIME_RICOVERO_CODICE == '3'  && rec[0].ASSIGNING_AUTHORITY_AREA == 'ADT' && (home.basePermission.hasOwnProperty('BACKOFFICE') || rec[0].IS_CDC_GIURIDICO_UTENTE == 'S');
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */

    PRINT_CERTIFICATO_RICOVERO : function (rec){
        return rec[0].ASSIGNING_AUTHORITY_AREA == 'ADT'  && rec[0].TIPO_RICOVERO_CODICE !== '5';
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PRINT_CERTIFICATO_DIMISSIONE : function (rec){
        return rec[0].ASSIGNING_AUTHORITY_AREA == 'ADT'  && rec[0].TIPO_RICOVERO_CODICE !== '5';
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PRINT_CERTIFICATO_DIMISSIONE_DIAGNOSI : function (rec){
        return home.baseUser.GRUPPO_PERMESSI.indexOf('GEST_CART') >= 0 && rec[0].ASSIGNING_AUTHORITY_AREA == 'ADT';
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    PRINT_VERBALE_RICOVERO : function (rec){
        return rec[0].TIPO_RICOVERO_CODICE != '5' && rec[0].ASSIGNING_AUTHORITY_AREA == 'ADT';

    }
};
var WHERE_LISTA_ATTESA = {
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */

    MODIFICA_LISTA_ATTESA : function(rec){
        return rec[0].STATO_CODICE !== "ANNULLATO" &&  rec[0].STATO_CODICE !== "ESITO_RICOVERO" && rec[0].STATO_CODICE !== "PROGRAMMATO";
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    LISTA_ATTESA_ANNULLA : function(rec){
        return rec[0].STATO_CODICE === "INSERITO"  || rec[0].STATO_CODICE === "RIVALUTAZIONE_PRERICOVERO" || rec[0].STATO_CODICE === "ESITO_PRERICOVERO";
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    INSERISCI_ATTIVITA : function (rec) {
        return  rec[0].STATO_CODICE === "INSERITO"  || rec[0].STATO_CODICE === "ESITO_PRERICOVERO" || rec[0].STATO_CODICE === "RIVALUTAZIONE_PRERICOVERO" || rec[0].STATO_CODICE === "PROGRAMMATO";
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    INSERISCI_PRERICOVERO : function (rec) {
        return (rec[0].STATO_CODICE === "INSERITO" && rec[0].ABILITA_RICOVERO === "S")  || rec[0].STATO_CODICE === "RIVALUTAZIONE_PRERICOVERO";
    },
    /**
     *
     * @param rec
     * @returns {boolean}
     * @constructor
     */
    INSERISCI_RICOVERO : function (rec) {
        return (rec[0].STATO_CODICE === "INSERITO" && rec[0].ABILITA_RICOVERO === "S") || rec[0].STATO_CODICE === "RIVALUTAZIONE_PRERICOVERO";
    }
};