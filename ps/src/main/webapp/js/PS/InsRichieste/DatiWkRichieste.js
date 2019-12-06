var NS_WK_RICHIESTE = {
    /**
     * Gestione della Worklist. All'apertura lo switch và nel default e carica la WK vuota.
     * Negli altri casi la WK viene solo refreshata passandogli nuovi parametri, a seconda del tipo_richiesta.
     * @param tipoRichiesta
     * @param descr
     */
    gestioneWk : function(tipoRichiesta, descr) {

        var filtroText =  $("#txtFiltroText");
        var wkApertura = $("#WK_APERTURA").val();

        /* Solo nella fase di TRIAGE filtro le sole prestazioni di TRIAGE */
        if((wkApertura==="LISTA_ATTESA") || (wkApertura==="ANAGRAFICA")){MAIN_INS_RICHIESTE.corpo = home.baseGlobal.CODICE_GRUPPO_PRESTAZIONI_TRIAGE;}

        if(!MAIN_INS_RICHIESTE.hasAValue(MAIN_INS_RICHIESTE.descr) && !MAIN_INS_RICHIESTE.hasAValue(descr)){ descr = filtroText.val(); }

        descr = (descr).toUpperCase();

        filtroText.val(descr);

        descr = descr + "%25";

        MAIN_INS_RICHIESTE.descr = descr;

        switch (tipoRichiesta) {
            /*Casi WK dei vari reparti*/
            case "R" :
                NS_WK_RICHIESTE.wk.filter({
                    aBind : [ "idenScheda", "tipoRichiesta", "cdcSorgente", "cdcDestinatario", "urgenza", "descr" ,"corpo"],
                    aVal : [ MAIN_INS_RICHIESTE.idenScheda, MAIN_INS_RICHIESTE.tipoRichiesta, MAIN_INS_RICHIESTE.reparto_attuale, MAIN_INS_RICHIESTE.rep_destinazione, MAIN_INS_RICHIESTE.urgenza,	MAIN_INS_RICHIESTE.descr, MAIN_INS_RICHIESTE.corpo ]
                });
                break;
            /*Caso WK prestazioni interne PS*/
            case "I" :
                NS_WK_RICHIESTE.wk.filter({
                    aBind : [ "idenScheda", "tipoRichiesta", "cdcSorgente", "cdcDestinatario", "urgenza", "descr" ,"corpo"],
                    aVal : [ MAIN_INS_RICHIESTE.idenScheda, MAIN_INS_RICHIESTE.tipoRichiesta, MAIN_INS_RICHIESTE.reparto_attuale, MAIN_INS_RICHIESTE.rep_destinazione, MAIN_INS_RICHIESTE.urgenza, MAIN_INS_RICHIESTE.descr, MAIN_INS_RICHIESTE.corpo ]
                });
                break;
            /*Caso WK consulenze*/
            case "C" :
                NS_WK_RICHIESTE.wk.filter({
                    aBind : [ "idenScheda", "tipoRichiesta", "cdcSorgente", "cdcDestinatario", "urgenza", "descr" ,"corpo"],
                    aVal : [MAIN_INS_RICHIESTE.idenScheda, MAIN_INS_RICHIESTE.tipoRichiesta,MAIN_INS_RICHIESTE.reparto_attuale, MAIN_INS_RICHIESTE.reparto, MAIN_INS_RICHIESTE.urgenza, MAIN_INS_RICHIESTE.descr, MAIN_INS_RICHIESTE.corpo]
                });
                break;
            /*All'apertura di default crea la WK vuota*/
            default:
                $("div#divWk").height("180px");
                NS_WK_RICHIESTE.wk = new WK({
                    id : "INS_PRESTAZIONI",
                    container : "divWk",
                    aBind : [ "idenScheda", "tipoRichiesta", "cdcSorgente", "cdcDestinatario", "urgenza", "descr" ,"corpo"],
                    aVal : ["", MAIN_INS_RICHIESTE.tipoRichiesta,MAIN_INS_RICHIESTE.reparto_attuale, MAIN_INS_RICHIESTE.rep_destinazione, MAIN_INS_RICHIESTE.urgenza, MAIN_INS_RICHIESTE.descr, MAIN_INS_RICHIESTE.corpo]
                });
                NS_WK_RICHIESTE.wk.loadWk();
                break;
        }

        MAIN_INS_RICHIESTE.descr="";
    },

    initialSettings: function(){
        var radRichieste = $("#radRichieste"),
            radRichSel = radRichieste.find("div[data-cod_cdc='"+MAIN_INS_RICHIESTE.reparto_attuale+"']");

        radRichieste.children("div").removeClass("RBpulsSel");
        radRichSel.addClass("RBpulsSel");
        radRichieste.trigger("click");

        $("#h-radRichieste").val(radRichSel.attr("data-value"));

        MAIN_INS_RICHIESTE.rep_destinazione = radRichSel.attr("data-cod_cdc");
        MAIN_INS_RICHIESTE.tipoRichiesta = radRichSel.attr("data-tipo");
        MAIN_INS_RICHIESTE.metodica = "%25";

        MAIN_INS_RICHIESTE.corpo = null;


        NS_WK_RICHIESTE.gestioneWk("", "");

        $("#UrgenzaRichieste").find("div.RBpuls").show();
    },

    setUrgenza : function(codiceColore){

        var urgenza="";

        switch (codiceColore) {

            case 'BIANCO':
                urgenza="0";
                break;
            case 'VERDE':
            case 'AZZURRO':
            case 'MAGENTA':
                urgenza="1";
                break;
            case 'ROSSO':
                urgenza="3";
                break;
            case 'NERO':
                urgenza="4";
                break;
            case 'GIALLO':
            default :
                urgenza="2";
                break;
        }

        var radUrgenzaRichieste =$("#UrgenzaRichieste");
        radUrgenzaRichieste.find("input[type=hidden]").val(urgenza);
        radUrgenzaRichieste.find("div[data-value="+urgenza+"]").addClass("RBpulsSel");

        return urgenza;
    }


};


/**
 * NS per l'inserimento e il caricamento delle variabili
 * da utilizzare nel messaggio da mandare al sender Hl7.
 * */
NS_DATI_RICHIESTE = {

    setAssigningAuthorityMittente: function (value) {
        NS_DATI_RICHIESTE.AssigningAuthorityMittente = value;
    },
    getAssigningAuthorityMittente: function () {
        return NS_DATI_RICHIESTE.AssigningAuthorityMittente;
    },
    setRepartoMittente: function (value) {
        NS_DATI_RICHIESTE.RepartoMittente = value;
    },
    getRepartoMittente: function () {
        return NS_DATI_RICHIESTE.RepartoMittente;
    },
    setAssigningAuthorityDestinatario: function (value) {
        NS_DATI_RICHIESTE.AssigningAuthorityDestinatario = value;
    },
    getAssigningAuthorityDestinatario: function () {
        return NS_DATI_RICHIESTE.AssigningAuthorityDestinatario;
    },
    setVersione: function (value) {
        NS_DATI_RICHIESTE.Versione = value;
    },
    getVersione: function () {
        return NS_DATI_RICHIESTE.Versione;
    },
    setIdenAnag: function (value) {
        NS_DATI_RICHIESTE.IdenAnag = value;
    },
    getIdenAnag: function () {
        return NS_DATI_RICHIESTE.IdenAnag;
    },
    setCodiceFiscale: function (value) {
        NS_DATI_RICHIESTE.CodiceFiscale = value;
    },
    getCodiceFiscale: function () {
        return NS_DATI_RICHIESTE.CodiceFiscale;
    },
    setNome: function (value) {
        NS_DATI_RICHIESTE.Nome = value;
    },
    getNome: function () {
        return NS_DATI_RICHIESTE.Nome;
    },
    setCognome: function (value) {
        NS_DATI_RICHIESTE.Cognome = value;
    },
    getCognome: function () {
        return NS_DATI_RICHIESTE.Cognome;
    },
    setDataNascita: function (value) {
        NS_DATI_RICHIESTE.DataNascita = value;
    },
    getDataNascita: function () {
        return NS_DATI_RICHIESTE.DataNascita;
    },
    setSesso: function (value) {
        NS_DATI_RICHIESTE.Sesso = value;
    },
    getSesso: function () {
        return NS_DATI_RICHIESTE.Sesso;
    },
    setIdenProvenienza: function (value) {
        NS_DATI_RICHIESTE.IdenProvenienza = value;
    },
    getIdenProvenienza: function () {
        return NS_DATI_RICHIESTE.IdenProvenienza;
    },
    setNumNosologico: function (value) {
        NS_DATI_RICHIESTE.NumNosologico = value;
    },
    getNumNosologico: function () {
        return NS_DATI_RICHIESTE.NumNosologico;
    },
    setUrgenza: function (value) {
        NS_DATI_RICHIESTE.Urgenza = value;
    },
    getUrgenza: function () {
        return NS_DATI_RICHIESTE.Urgenza;
    },
    setUserIdenPer: function (value) {
        NS_DATI_RICHIESTE.UserIdenPer = value;
    },
    getUserIdenPer: function () {
        return NS_DATI_RICHIESTE.UserIdenPer;
    },
    setDataOraMessaggio: function () {
        NS_DATI_RICHIESTE.DataOraMessaggio = moment().format("YYYYMMDDHHmmss") + ".000";
    },
    getDataOraMessaggio: function () {
        return NS_DATI_RICHIESTE.DataOraMessaggio;
    },
    setDataOraRegOrdine: function (value) {
        NS_DATI_RICHIESTE.DataOraRegOrdine = value;
    },
    getDataOraRegOrdine: function () {
        return NS_DATI_RICHIESTE.DataOraRegOrdine;
    },
    setNumOrdine: function () {
        NS_DATI_RICHIESTE.NumOrdine = (moment().format("YYYYMMDDHHmmss")).toString();
    },
    getNumOrdine: function () {
        return NS_DATI_RICHIESTE.NumOrdine;
    },
    setNumRichiesta: function () {
        NS_DATI_RICHIESTE.NumRichiesta = (moment().format("YYYYMMDDHHmmss") + 1).toString();
    },
    getNumRichiesta: function () {
        return NS_DATI_RICHIESTE.NumRichiesta;
    },
    getTipoRichiesta: function(){
        var tipo = MAIN_INS_RICHIESTE.tipoRichiesta;
        var result = '';
        if (tipo == 'P'){
            result = 'SC';
        }
        else if(tipo == 'A'){
            result = 'IP';
        }

        return result;
    }

};
