/**
 * Carlog
 * 
 * Apre le wk prestaioni interne PS e prestazioni di altri eorgatori.
 */
$(function() {
	PRESTAZIONI.init();
});
var PRESTAZIONI = {

    dimensioneWk : null,
    jsonContatto : null,
    statoContatto : null,
    cdcAssociatiUtente : "",

	init : function() {

        home.NS_CONSOLEJS.addLogger({name: 'Prestazioni', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['Prestazioni'];

		NS_FENIX_SCHEDA.customizeParam = function(params) {params.extern = true; return params; };

        if(LIB.isValid(home)){home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";}

        if($("#READONLY").val() === "S"){$("div.contentTabs").css({"background":"#CACACC"})}

            PRESTAZIONI.calcolaDimensioneWk(function(){
                PRESTAZIONI.initWkPrestazioniPS();
                //PRESTAZIONI.initWkPrestazioni();
            });
            PRESTAZIONI.jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden($('#IDEN_CONTATTO').val(), {assigningAuthorityArea: 'ps'});

	},

    hasAValue: function (value) {
        return (("" !== value) && (null !== value) && ("null" !== value) && (undefined !== value)  && ("undefined" !== value) && ("undefined" !== typeof value));
    },

    calcolaDimensioneWk : function(callback){

        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 110;

        PRESTAZIONI.dimensioneWk = (contentTabs  - margine);

        if(PRESTAZIONI.hasAValue(PRESTAZIONI.dimensioneWk)){
            callback();
        }else{
            logger.error("Errore nel calcolo della dimensione WK");
        }

    },

	initWkPrestazioniPS : function() {
		if (!PRESTAZIONI.wkPrestazioniPS) {
			$("div#wkPrestazioniPS").height(PRESTAZIONI.dimensioneWk);
			PRESTAZIONI.wkPrestazioniPS = new WK({
				id : "PRESTAZIONI_PS",
				container : "wkPrestazioniPS",
				aBind : [ 'iden_contatto' ],
				aVal : [ $("#IDEN_CONTATTO").val() ]
			});
			PRESTAZIONI.wkPrestazioniPS.loadWk();
		} else {
			PRESTAZIONI.wkPrestazioniPS.refresh();
		}
	},

    eliminaPrestazioni : function(idenTestata, idenDettaglio,  idenCdc, idenNomenclatore, prestazione) {

        var statoContatto = PRESTAZIONI.jsonContatto.stato.codice,
            esamiObbligatori = JSON.parse(home.baseGlobal.IDEN_ESA_OBBLIGATORI),
            controllo = false;



        for(var i=0; i<esamiObbligatori.ESAMI.length; i++){
            if(esamiObbligatori.ESAMI[i].IDEN_ESA==idenNomenclatore){ controllo=true; }
        }


        if(statoContatto === "DISCHARGED")
        {
            PRESTAZIONI.alertChiuso();
        }
        else if(controllo)
        {
            PRESTAZIONI.alertEsameObbligatorio();
        }
        else
        {
            PRESTAZIONI.alertEliminazione(prestazione, function(){
                PRESTAZIONI.getRichiestaAssociata({
                    "pIdenEsamiDettaglio" : idenDettaglio,
                    "pIdenContatto"         : $("#IDEN_CONTATTO").val(),
                    "callback"          : function(idenTestataRichieste){
                        if(idenTestataRichieste>0){
                            PRESTAZIONI.callSPAnnullaRichiesta({
                                "iden_richiesta" : idenTestataRichieste,
                                "callback" : function(){
                                    PRESTAZIONI.callCancellaEsami(null, idenDettaglio, function(){
                                        document.location.replace(document.location);
                                    });
                                }
                            });
                        }else{
                            PRESTAZIONI.callCancellaEsami(null, idenDettaglio, function(){
                                document.location.replace(document.location);
                            });
                        }

                    }

                });
            });
        }

    },

    getRichiestaAssociata : function(json){

        /**
         * pIdenEsamiTestata IN NUMBER,
         pMotivo IN VARCHAR2,
         pIdenUser IN NUMBER*/

        var params = {
            "pIdenEsamiDettaglio" : {t:"N" , v: json.pIdenEsamiDettaglio},
            "pIdenContatto"         : {t:"N" , v: json.pIdenContatto}
        };

        var parametri = {
            "datasource": "PS",
            id: "GET_RICHIESTA_ASSOCIATA",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.FUNCTION(parametri);

        function callbackOk(data) {
            logger.info("CODICI ESTERNI : " +JSON.stringify(data));
            var idenTestataRichieste = data.p_result;
            json.callback(idenTestataRichieste);
        }
    },

    callSPAnnullaRichiesta : function(json){
        var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE',async:false}});

        var param = {
            "p_id_richiesta": {"v": json.iden_richiesta, "t":"N"},
            "p_motivo":  "",
            "p_iden_per": home.baseUser.IDEN_PER,
            "sOut" : {"d":'O',"t":'V'}
        };

        logger.debug( 'parametri passati alla procedura INFOWEB.OE_RICHIESTE.SP_ANNULLA_RICHIESTA ='+  JSON.stringify(param));

        var xhr = db.call_procedure({
            id: "INFOWEB.OE_RICHIESTE.SP_ANNULLA_RICHIESTA",
            parameter: param
        });

        xhr.done(function (data) {

            if (data.sOut == "OK") {

                home.NOTIFICA.success({message: "Richiesta annulata con successo",timeout: 2,title: 'Success'});

                json.callback();

            } else {
                logger.error(JSON.stringify(data));
                home.NOTIFICA.error({message: "Eliminazione non riuscita " + data.sOut,title: "Error"});
            }
        });

        xhr.fail(function (jqXHR) {
            logger.error("xhr fail " + JSON.stringify(jqXHR));
            home.NOTIFICA.error({message: "Eliminazione non riuscita",title: "Error"});
        });
    },

    alertChiuso : function(){
        $.dialog("Non si possono eliminare gli esami a contatto chiuso", {
            title: "Attenzione",
            buttons: [
                {label: "OK", action: function () {
                    $.dialog.hide();
                }}
            ]
        });
    },

    alertEsameObbligatorio : function(){
        $.dialog("Prestazione obbligatoria, non puo essere cancellata", {
            title: "Attenzione",
            buttons: [
                {label: "OK", action: function () {
                    $.dialog.hide();
                }}
            ]
        });
    },

    alertEliminazione : function(prestazione,callback){
        $.dialog("Si desidera Eliminare l'esame : "+prestazione+" e le eventuali richieste associate?", {
            title: "Attenzione",
            buttons: [

                {label: "NO", action: function () {
                    $.dialog.hide();
                }},

                {label: "SI", action: function () {
                    $.dialog.hide();
                    callback();
                }}
            ]
        });
    },

    callCancellaEsami : function(idenTestata, idenDettaglio,callback){

        var db = $.NS_DB.getTool({setup_default:{datasource:"PS",async:false}});
        /* Se voglio solo cancellare un esame gli passo solo l'iden dettaglio */
        var parametri = {
            pIdenTestata:{t:"V", v: null},
            pIdenDettaglio : {t:"V", v:idenDettaglio},
            pIdenUteInviante : {t:"N", v:home.baseUser.IDEN_PER}
        };

        var xhr = db.call_function({
            id: "PRESTAZIONI.FNC_CANCELLA_ESAMI",
            parameter: parametri
        });

        xhr.done(function (data, textStatus, jqXHR) {
            var risp = data.p_result.split("$");

            if (risp[0] == 'OK'){
                logger.info("Prestazione cancellata correttamente : " + JSON.stringify(data));
                home.NOTIFICA.success({message: "Esame cancellato correttamente", timeout: 3, title: "Success"});
                callback();
            }else{
                logger.error("Errore nella chiamata a PRESTAZIONI.FNC_CANCELLA_ESAMI \n" + risp[1] +
                    JSON.stringify(textStatus) + "\n"+ JSON.stringify(jqXHR));
                home.NOTIFICA.error({message: "Errore nella cancellazione dell'esame", title: "Error", timeout: 5});
            }
        });

        xhr.fail(function (jqXHR, textStatus) {
            logger.error("Errore nella chiamata a PRESTAZIONI.FNC_CANCELLA_ESAMI \n" +
                JSON.stringify(textStatus) + "\n"+ JSON.stringify(jqXHR));
            home.NOTIFICA.error({message: "Errore nella cancellazione dell'esame", title: "Error", timeout: 5});
        });
    }

    /*getCdcUtente : function(idenCdc, callback){

        var params = {
            utente : {t:"V", v:home.baseUser.USERNAME},
            iden_cdc : {t:"N", v:idenCdc}
        };

        var parametri = {
            "datasource": "PS",
            id: "PS.Q_CDC_UTENTI",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            if(data.result[0].hasOwnProperty("REPARTO")){
                logger.info("Prestazione di un CDC associato all'utente, quindi esso puo cancellarla");
                callback();
            }else{
                logger.warn("CDC non associato all'utente, non puo essere cancellata");
                PRESTAZIONI.alertCdcNonAssociato();
            }
        }
    }*/
    /*	initWkPrestazioni : function() {
		if (!PRESTAZIONI.wkPrestazioni) {
			$("div#wkPrestazioni").height(PRESTAZIONI.dimensioneWk);
			PRESTAZIONI.wkPrestazioni = new WK({
				id : "PRESTAZIONI",
				container : "wkPrestazioni",
				aBind : [ 'codice' ],
				aVal : [ $("#CODICE").val() ]
			});
			PRESTAZIONI.wkPrestazioni.loadWk();
		} else {
			PRESTAZIONI.wkPrestazioni.refresh();
		}
	}*/
};