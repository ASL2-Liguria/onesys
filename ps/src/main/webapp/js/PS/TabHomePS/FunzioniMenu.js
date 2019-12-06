/* global NS_WK_PS */

/**
/**
 * Created by matteo.pipitone on 06/05/2015.
 */

var FNC_MENU_LISTA_ANAGRAFICA = {
     apriDettaglioAnagrafica:function(rec){
         FNC_MENU_GENERICS.apriSchedaAnagrafica(rec,'LISTA_ANAGRAFICA');
     },
    triage:function(rec){
        NS_FENIX_PS.inserisciContatto(rec[0].IDEN_ANAG,rec[0].CODICE_FISCALE);
    },
    insPaziente:function(){
        NS_FENIX_PS.setNomeCognome();
        home.NS_FENIX_TOP.apriPagina({
            url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=I',id:'insAnag',fullscreen:true})
    },
    insPazienteSconosciuto:function(){
        home.NS_FENIX_TOP.apriPagina({
                url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=S&STATO_PAGINA=I',id:'insAnag',fullscreen:true}
        );
    },
    storicoPaziente:function(rec){
        home.NS_FENIX_TOP.apriPagina({
                url:'page?KEY_LEGAME=STORICO_ANAGRAFICA&IDEN_ANAG='+rec[0].IDEN_ANAG,id:'insAnag',fullscreen:true}
        )
    },
    allineaAAC : function (rec) {
        var parametri = {
            datasource: 'WHALE',
            id: 'ALLINEA_ANAG_VS_AAC',
            params: {
                p_iden_anag: {v: Number(rec[0].IDEN_ANAG), t:'N'}
            },
            callbackOK: callbackOk
        };
        function callbackOk (){
            home.NOTIFICA.success({message: 'Anagrafica allineata correttamente', timeout: 2, title: 'Success'});
        }
        NS_CALL_DB.PROCEDURE(parametri);

    }
};
var FNC_MENU_LISTA_ATTESA = {

    apriCartellaAmministrativo : function (rec){
       FNC_MENU_GENERICS.apricartella(rec,'APRI_CARTELLA_AMMINISTRATIVO');
    },
    rivalutaTriage : function (rec){

        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto:  rec[0].IDEN_CONTATTO,

            callback: function () {
                NS_TRIAGE_METHODS.rivaluta({
                    "utente_inserimento": home.baseUser.IDEN_PER,
                    "iden_anagrafica": rec[0].IDEN_ANAG,
                    "iden_cdc": rec[0].IDEN_CDC,
                    "iden_contatto": rec[0].IDEN_CONTATTO,
                    "progressivo": Number(rec[0].PROGRESSIVO + 1),
                    "iden_precedente": rec[0].IDEN_LISTA,
                    "stato_lista": rec[0].STATO_LISTA_ATTESA,
                    "iden_lista": rec[0].IDEN_LISTA,
                    "urgenza" : rec[0].URGENZA,
                    "callback": function (data) {
                        rec[0].IDEN_LISTA = data.P_IDEN;
                        FNC_MENU_GENERICS.apricartella(rec, 'RIVALUTA_TRIAGE');
                    }
                });
            }


        },rec);

    },
    valutaTriage : function(rec){
        FNC_MENU_GENERICS.apricartella(rec,'VALUTA_TRIAGE');

    },
    completaRivalutazione : function(rec){
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto:  rec[0].IDEN_CONTATTO,
            callback: function () {
                NS_TRIAGE_METHODS.checkStatoLista({
                    "iden_contatto": rec[0].IDEN_CONTATTO,
                    "stato_controllo": "INSERITO",
                    "callback": function () {
                        FNC_MENU_GENERICS.apricartella(rec, 'COMPLETA_RIVALUTAZIONE');
                    }
                });
            }

        },rec);
    },
    /**
     * funzione che toglie il completato dal triage e permette di reinserire il codice triage e gli altri parametri
     * @param idenListaAttesa
     * @param idenAnag
     * @param idenContatto
     * @param idenProvenienza
     * @param idenCdc
     * @param contGiuCdc
     * @param contGiuProv
     * @param urgenza
     */
    manutenzioneTriage: function (idenListaAttesa, idenAnag, idenContatto, idenProvenienza, idenCdc, contGiuCdc, contGiuProv, urgenza) {

        var rec = [{
            IDEN_ANAG :idenAnag,
            IDEN_CONTATTO :idenContatto,
            IDEN_PROVENIENZA :idenProvenienza,
            CODICE_FISCALE : '',
            IDEN_CDC :idenCdc,
            STRUTTURA : home.baseUserLocation.struttura,
            IDEN_LISTA: idenListaAttesa,
            CONTGIU_CDC : contGiuCdc,
            CONTGIU_PROV : contGiuProv
        }];



        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: idenContatto,
            callback: function () {

                NS_TRIAGE_METHODS.manutenzione({
                    "iden_lista": idenListaAttesa,
                    "iden_anagrafica": idenAnag,
                    "iden_contatto": idenContatto,
                    "iden_cdc": idenCdc,
                    "urgenza" : urgenza,
                    "callback": function () {
                       FNC_MENU_GENERICS.apricartella(rec, 'MANUTENZIONE_TRIAGE');
                    }
                });
            }
        },rec);
    },

    manutenzioneRivalutazione : function (idenListaAttesa, idenAnag, idenContatto, idenProvenienza, idenCdc, contGiuCdc, contGiuProv,urgenza) {

        var rec = [{
            IDEN_ANAG :idenAnag,
            IDEN_CONTATTO :idenContatto,
            IDEN_PROVENIENZA :idenProvenienza,
            CODICE_FISCALE : '',
            IDEN_CDC :idenCdc,
            STRUTTURA : home.baseUserLocation.struttura,
            IDEN_LISTA: idenListaAttesa,
            CONTGIU_CDC : contGiuCdc,
            CONTGIU_PROV : contGiuProv
        }];

        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: idenContatto,
            callback: function () {
               NS_TRIAGE_METHODS.manutenzione({
                    "iden_lista" : idenListaAttesa,
                    "iden_anagrafica" : idenAnag,
                    "iden_contatto" : idenContatto,
                    "iden_cdc" : idenCdc,
                    "urgenza" : urgenza,
                    "callback" : function(){

                        FNC_MENU_GENERICS.apricartella(rec, 'MANUTENZIONE_RIVALUTAZIONE');
                    }
               });
            }
        },rec);
    },

    presaInCarico : function (rec){
        var jsonSceltaInf = $.parseJSON(home.baseGlobal.SCELTA_INF_OPZIONALE),
            optSceltaInf = jsonSceltaInf[''+home.baseUserLocation.sub_codice_sezione+''];

        if (!home.NS_FENIX_PS.hasAValue(optSceltaInf)) logger.error("FNC_MENU_LISTA_ATTESA.presaInCarico : optSceltaInf is not defined");
        if (!home.NS_FENIX_PS.hasAValue(rec)) logger.error("FNC_MENU_LISTA_ATTESA.presaInCarico : rec is not defined");

        if(optSceltaInf==="S"){
            home.NS_FENIX_TOP.apriPagina({
                url:'page?KEY_LEGAME=SCELTA_INF&STATO_PAGINA=I&IDEN_ANAG='+rec[0].IDEN_ANAG+'&IDEN_CONTATTO='+
                rec[0].IDEN_CONTATTO+'&IDEN_PROVENIENZA='+rec[0].IDEN_PROVENIENZA+'&CODICE_FISCALE='+
                rec[0].CODICE_FISCALE+'&IDEN_LISTA='+rec[0].IDEN_LISTA+'&URGENZA='+rec[0].URGENZA+'&IDEN_CDC_PS='+
                rec[0].IDEN_CDC+'&CONTGIU_CDC='+rec[0].CONTGIU_CDC+'&CONTGIU_PROV='+rec[0].CONTGIU_PROV + "&CARTELLA="+rec[0].CARTELLA
                +'&MENU_APERTURA=PRESA_IN_CARICO',id:'scelta_inf',fullscreen:true});
        }
        if(optSceltaInf==="N"){
            home.NS_FENIX_PS.presaInCarico(rec[0].IDEN_ANAG, rec[0].IDEN_CONTATTO,rec[0].IDEN_PROVENIENZA,
                rec[0].CODICE_FISCALE, rec[0].IDEN_LISTA, rec[0].URGENZA, null,
                rec[0].IDEN_CDC, rec[0].CONTGIU_CDC, rec[0].CONTGIU_PROV, rec[0].CARTELLA);
        }

    },
    presaInCaricoInf : function (rec, type){
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                logger.debug("presaInCaricoInf con type -> " + type);
                home.NS_FENIX_PS.jSonPazienti = rec;
                home.NS_FENIX_PS.elaborazioniSuPiuContatti(home.baseUser.IDEN_PER, home.baseUser.IDEN_PER, type );
            }
        });
    },
    /**
     * @param rec
     * @param type
     * */
    passaggioDiConsegneInf:function(rec, type){
        logger.debug("passaggioDiConsegneInf con type ->" + type);
        home.NS_FENIX_PS.jSonPazienti = rec;
        home.NS_FENIX_TOP.apriPagina({
            url:'page?KEY_LEGAME=SCELTA_INF&STATO_PAGINA=I&TYPE='+type+'&IDEN_CDC_PS='+ rec[0].IDEN_CDC ,id:'scelta_inf',
            fullscreen:true
        })
    },
    associaPazSconosciuto : function (rec){
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                FNC_MENU_GENERICS.associaPazienteSconosciuto(rec,'');
            } ,
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        });
    },
    riassociaPaziente : function (rec){
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                FNC_MENU_GENERICS.associaPazienteSconosciuto(rec,'RIASSOCIA');
            },
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                home.NOTIFICA.error({message: 'Cartella gia\' bloccata da '+usernameLock , title: 'Error'});
            }
        },rec);
    },
    apriSchedaAnagrafica : function (rec) {
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                FNC_MENU_GENERICS.apriSchedaAnagrafica(rec,'LISTA_ATTESA');
            },
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        });
    },
    apriIpatient:function(rec){
        var user = home.baseUser.USERNAME;
        var idRemoto = rec[0].CODICE_FISCALE;
        var idenAnagrafica = rec[0].CODICE_FISCALE;
        var url = home.baseGlobal.URL_CARTELLA  + 'whale/autoLogin?utente='+user+'&postazione='+home.basePC.IP+'&pagina=I-PATIENT-PS&opener=MMG&ID_PAZIENTE='+idRemoto+'&IDEN_ANAG='+idenAnagrafica;
        window.open(url,"iPatient","fullscreen=yes");

    },
    segnalaAllontanato:function(rec){

        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                 FNC_MENU_GENERICS.apricartella(rec,'SEGNALA_ALLONTANATO');
            },
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        });

    },

    cancelAmministrativo:function(idenContatto, paziente, callback){

        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: idenContatto,
            callback: function () {
                FNC_MENU_GENERICS.cancelAmministrativo(idenContatto, paziente, callback);
            },
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        });
    },
    apriCartellaDebugger : function (rec) {
        var url =  'page?KEY_LEGAME=CARTELLA&IDEN_ANAG='+ rec[0].IDEN_ANAG+'&IDEN_CONTATTO='+
            rec[0].IDEN_CONTATTO + '&IDEN_PROVENIENZA='+rec[0].IDEN_PROVENIENZA+'&IDEN_CDC_PS='+rec[0].IDEN_CDC+
            '&CODICE_FISCALE='+ rec[0].CODICE_FISCALE+'&IDEN_LISTA='+rec[0].IDEN_LISTA+'&TEMPLATE=LISTA_ATTESA/ListaAttesaFooter.ftl';
        url +='&WK_APERTURA=LISTA_ATTESA'+'&MENU_APERTURA=APRI_CARTELLA&STATO_PAGINA=R';
        home.NS_FENIX_TOP.apriPagina({url:url, fullscreen:true});
    }

};
var FNC_MENU_LISTA_APERTI = {

    cancelPresaInCarico: function (iden_contatto,cbk) {

        var parcbk = typeof cbk === 'function' ?  cbk : function(){NS_WK_PS.caricaWk();};

        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto : iden_contatto,
            callback : function(){

                var json = NS_DATI_PAZIENTE.getDatiContattobyIden(iden_contatto, {assigningAuthorityArea: 'ps'});

                //Controllo se il paziente ha una valutazione medica già salvata
                if(json.contattiAssistenziali[json.contattiAssistenziali.length -1].mapMetadatiString["PRIMA_PRESA_IN_CARICO_MEDICA"] =="S"){

                    // solo se è la prima presa in carico  faccio il controllo sulla valutazione medica
                    var jsonQuery = {
                        datasource : 'PS',
                        id :"PS.Q_CHECK_ESAME_OBIETTIVO",
                        params : {iden_contatto : {t:'N', v:Number(iden_contatto)} },
                        callbackOK : function(resp){

                            if(typeof resp.result[0].CONTO !== "undefined" && resp.result[0].CONTO !== null){
                                var check = Number(resp.result[0].CONTO);
                            }

                            if(check === 0) {
                                cbk();
                            }
                            else if (check > 0){
                                $.dialog("Impossibile cancellare la Presa in carico medica. Il paziente e' gia' stato valutato", {
                                    title: "Attenzione",
                                    buttons: [
                                        {
                                            label: "OK", action: function () {
                                            $.dialog.hide();
                                        }
                                        }]
                                });

                            }
                        }
                    };
                    NS_CALL_DB.SELECT(jsonQuery);
                }else{
                    cbk();
                }
                function cbk(){
                    $.dialog("Si desidera effettuare la cancellazione della presa in carico ?", {
                        title: "Attenzione",
                        buttons: [
                            {
                                label: "NO", action: function () {
                                $.dialog.hide();
                            }
                            },
                            {
                                label: "SI", action: function () {

                                NS_TRIAGE_METHODS.checkStatoLista({
                                    "iden_contatto": iden_contatto,
                                    "stato_controllo": "CHIUSO",
                                    "callback": function () {

                                        json.posizioniListaAttesa[json.posizioniListaAttesa.length - 1].stato = {
                                            id: null,
                                            codice: "COMPLETO",
                                            descrizione: null
                                        };
                                        json.posizioniListaAttesa[json.posizioniListaAttesa.length - 1].utenteModifica.id = home.baseUser.IDEN_PER;

                                        var p = {
                                            "servlet": "CancelPresaInCaricoMedica",
                                            "contatto": json,
                                            "hl7Event": "CANCEL PRESA IN CARICO",
                                            "notifica": {
                                                "show": "N",
                                                "timeout": 3,
                                                "message": "Completamento Triage Avvenuto con Successo",
                                                "errorMessage": "Errore Durante Completamento Triage"
                                            },
                                            "cbkSuccess": function () {

                                                $.dialog.hide();
                                                parcbk();
                                            },
                                            "scope": 'ps/'
                                        };

                                        NS_CONTATTO_METHODS.contatto = p.contatto;
                                        NS_CONTATTO_METHODS.executeAJAX(p);

                                    }
                                });

                            }
                            }
                        ]
                    });
                }

            },
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        });
    },
    sceltaEsito : function(rec){
        FNC_MENU_GENERICS.apricartella(rec,'SCELTA_ESITO');
    },
    apriSchedaAnagrafica : function (rec) {
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                FNC_MENU_GENERICS.apriSchedaAnagrafica(rec,'LISTA_APERTI');
            } ,
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        },rec);
    },
    riassociaPaziente : function (rec) {
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                FNC_MENU_GENERICS.associaPazienteSconosciuto(rec,'RIASSOCIA');
            },
            callbackKo : function(err){
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        },rec)
    },
    associaPazienteSconosciuto : function(rec){
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                FNC_MENU_GENERICS.associaPazienteSconosciuto(rec,'');
            },
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        })
    },
    /**
     * @param rec
     * @param type
     * */
    passaggioConsegnePagina:function(rec, type){
        logger.debug("passaggioConsegnePagina con type ->" + type);
        home.NS_FENIX_PS.jSonPazienti = rec;
        home.NS_FENIX_TOP.apriPagina({
            url:'page?KEY_LEGAME=SCELTA_MEDICO&STATO_PAGINA=I&TYPE='+type+'&IDEN_CDC_PS='+ rec[0].IDEN_CDC ,id:'scelta_inf',
            fullscreen:true
        })
    },

    presaInCaricoPagina : function (rec, type) {
        logger.debug("presaInCaricoPagina con type ->  " + type);
        home.NS_FENIX_PS.jSonPazienti = rec;

        var jsonSceltaInf = $.parseJSON(home.baseGlobal.SCELTA_INF_OPZIONALE),
            optSceltaInf = jsonSceltaInf[''+home.baseUserLocation.sub_codice_sezione+''];

        if (!home.NS_FENIX_PS.hasAValue(optSceltaInf)) logger.error("FNC_MENU_LISTA_APERTI.presaInCaricoPagina : optSceltaInf is not defined");
        if (!home.NS_FENIX_PS.hasAValue(rec)) logger.error("FNC_MENU_LISTA_APERTI.presaInCaricoPagina : rec is not defined");

        if(optSceltaInf==="S"){
            home.NS_FENIX_TOP.apriPagina({
                url:'page?KEY_LEGAME=SCELTA_INF&STATO_PAGINA=I&TYPE='+type+'&IDEN_CDC_PS='+ rec[0].IDEN_CDC ,id:'scelta_inf',
                fullscreen:true
            });
        }
        if(optSceltaInf==="N"){
            home.NS_FENIX_PS.elaborazioniSuPiuContatti(home.baseUser.IDEN_PER,null,type,null);
        }
    },

   apriCartella:function(rec){

       var callback =  function (_rec) {FNC_MENU_GENERICS.apricartella(_rec,'LISTA_APERTI')};

       FNC_MENU_GENERICS.checkMedicoResponsabile({
           IDEN_CONTATTO : rec[0].IDEN_CONTATTO,
           callbackOK :  function(){callback(rec);}
       });


   },
    apriCartellaDebugger : function (rec) {
        var url =  'page?KEY_LEGAME=CARTELLA&IDEN_ANAG='+ rec[0].IDEN_ANAG+'&IDEN_CONTATTO='+
            rec[0].IDEN_CONTATTO + '&IDEN_PROVENIENZA='+rec[0].IDEN_PROVENIENZA+'&IDEN_CDC_PS='+rec[0].IDEN_CDC+
            '&CODICE_FISCALE='+ rec[0].CODICE_FISCALE+'&IDEN_LISTA='+rec[0].IDEN_LISTA+'&TEMPLATE=LISTA_ATTESA/ListaAttesaFooter.ftl';
        url +='&WK_APERTURA=LISTA_APERTI'+'&MENU_APERTURA=APRI_CARTELLA&STATO_PAGINA=R&UTENTE_RESPONSABILE='+rec[0].ID_UTE_RIFERIMENTO;
        home.NS_FENIX_TOP.apriPagina({url:url, fullscreen:true});
    },
    cancelAmministrativo:function(idenContatto, paziente, callback){
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: idenContatto,
            callback: function () {
                FNC_MENU_GENERICS.cancelAmministrativo(idenContatto, paziente, callback);
            },
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        })
    },
    segnalaOBI : function (rec) {

        var paramsBloccaCartella = {
            idenContatto :  rec[0].IDEN_CONTATTO,
            callbackOK :  function(){

                home.NS_WK_PS.refresh_wk = false;

                var url = 'page?KEY_LEGAME=INS_OBI&IDEN_CONTATTO=' +    rec[0].IDEN_CONTATTO +
                    '&USERNAME='+home.baseUser.USERNAME
                    +'&CODICE_STRUTTURA_CDC_SEL='+home.baseUserLocation.codice_struttura
                    +'&SUB_CODICE_STRUTTURA='+home.baseUserLocation.sub_codice_struttura
                    +'&DATA_INGRESSO=' +rec[0].DATA_INGRESSO+ '&DATA_INIZIO='+rec[0].DATA_INIZIO_ASS;

                home.NS_FENIX_TOP.apriPagina({url:url,id:'INS_OBI', fullscreen:true});

            },
            callbackKO : function(err){
                logger.error(err);
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        };
        NS_LOCK.bloccaCartella(paramsBloccaCartella);
    },
    annullaOBI : function (rec) {
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                OBI.Annulla(rec);
            },
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        })
    },

    apriCartellaReadOnly:function(rec){
        FNC_MENU_GENERICS.apricartella(rec,'LISTA_APERTI_READONLY');
    }
};
var FNC_MENU_LISTA_OBI = {
    apriCartella:function(rec){

        var callback =  function (_rec) {FNC_MENU_GENERICS.apricartella(_rec,'LISTA_OBI')};

        FNC_MENU_GENERICS.checkMedicoResponsabile({
            IDEN_CONTATTO : rec[0].IDEN_CONTATTO,
            callbackOK :  function(){ callback(rec);}
        });

    },
    associaPazienteSconosciuto:function(rec){
        FNC_MENU_GENERICS.associaPazienteSconosciuto(rec,'')
    },
    riassociaPazienteSconosciuto:function(rec){
        FNC_MENU_GENERICS.associaPazienteSconosciuto(rec,'RIASSOCIA');
    },
    apriSchedaAnagrafica : function (rec) {
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                FNC_MENU_GENERICS.apriSchedaAnagrafica(rec,'LISTA_OBI');
            } ,
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        },rec);
    },
    modificaEsito:function(rec){
        FNC_MENU_GENERICS.apricartella(rec, 'MODIFICA_ESITO');
    },
    sceltaEsitoOBI:function(rec){
        FNC_MENU_GENERICS.apricartella(rec,'SCELTA_ESITO_OBI');
    },
    eliminaEsitoPS:function(idenContatto, idenContattoRicovero, idenSchedaVerbale, callback){

        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: idenContatto,
            callback: function () {
                FNC_MENU_GENERICS.eliminaEsitoPS(idenContatto, idenContattoRicovero, idenSchedaVerbale, callback);
            },
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        });
    }


};

var FNC_MENU_GESTIONE_ESITO = {
    apriCartella:function(rec) {
        FNC_MENU_GENERICS.apricartella(rec, 'LISTA_CHIUSI');
    },
    apriCartellaReadOnly:function(rec){
        FNC_MENU_GENERICS.apricartella(rec,'GESTIONE_ESITO_READONLY');
    },
    apriSchedaAnagrafica : function(rec){
        FNC_MENU_GENERICS.apriSchedaAnagrafica(rec, 'LISTA_CHIUSI');
    },
    associaPazienteSconosciuto : function (rec) {
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {

                if(rec[0].STATO_CONTATTO == "DISCHARGED"){
                    FNC_MENU_GENERICS.associaPazienteSconosciuto(rec, 'RIASSOCIA_CHIUSO');
                }
                else{
                    FNC_MENU_GENERICS.associaPazienteSconosciuto(rec, 'RIASSOCIA');
                }

            }
        })
    },
    riassociaPazienteSconosciuto : function (rec){
        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                FNC_MENU_GENERICS.associaPazienteSconosciuto(rec,'RIASSOCIA_CHIUSO');
            } ,
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        })
    },

    setCartellaCompletaEInviata : function (rec) {

        var aIdenContatti = new Array(rec.length);
        var aIdenCdc = new Array(rec.length);

        var cartellaCompleta = '01';
        var cartellaInviataInArchivio = '02';

        var db = $.NS_DB.getTool({setup_default: {datasource: 'ADT'}});


        for (var i = 0; i < rec.length; i++) {
            aIdenContatti[i] = rec[i].IDEN_CONTATTO;
            aIdenCdc[i] = rec[i].IDEN_CDC;
        }

        var parametri = {
            pStato: {v: cartellaCompleta, t: 'V'},
            aIdenContatti: {v: aIdenContatti, t: 'A'},
            pIdenPer: {v: home.baseUser.IDEN_PER, t: 'N'},
            aArchivi: {v: aIdenCdc, t: 'A'},
            pData: {v: moment().format('DD/MM/YYYY HH:mm'), t: 'V'},
            p_result: {t: 'V', d: 'O'}
        };

        logger.debug(JSON.stringify(parametri));
        db.call_procedure(
            {
                id: 'ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle',
                parameter: parametri,
                success: function () {
                    parametri.pStato = {v: cartellaInviataInArchivio, t: 'V'};
                    db.call_procedure(
                        {
                            id: 'ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle',
                            parameter: parametri,
                            success: function (data) {
                                home.NOTIFICA.success({message: 'Movimento cartelle eseguito correttamente', timeout: 2, title: 'Success'});
                                logger.info("movimenti cartella " + JSON.stringify(data));
                            },
                            fail: function (data) {
                                logger.error("ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle " + JSON.stringify(data) + ' PARAMETRI = ' + JSON.stringify(parametri));
                                home.NOTIFICA.error({message: 'Movimento cartelle andato in errrore', title: 'Error'});
                            }
                        });
                },
                fail: function (data) {
                    logger.error("ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle " + JSON.stringify(data) + ' PARAMETRI = ' + JSON.stringify(parametri));
                    home.NOTIFICA.error({message: 'Movimento cartelle andato in errrore', title: 'Error'});
                }
            });

    },
    /**
     * Funzione che elimina tutti gli esiti dal contatto
     * @param idenContatto
     * @param idenContattoRicovero
     * @param idenSchedaVerbale
     * @param codiceRicovero
     * @param callback
     */
    eliminaEsitoPS: function (idenContatto, idenContattoRicovero, idenSchedaVerbale, callback) {

        FNC_MENU_GENERICS.eliminaEsitoPS(idenContatto, idenContattoRicovero, idenSchedaVerbale, callback);

    },
    /**
     * Contorlla l'esito precedente del paziente, se era deceduto toglie la data morte
     * @param rec
     */
    controlloDeceduto: function(rec){

        FNC_MENU_GENERICS.controlloCartella({
            iden_contatto: rec[0].IDEN_CONTATTO,
            callback: function () {
                if(rec[0].COD_ESITO == "7" || rec[0].COD_ESITO_OBI == "7")
                {
                    FNC_MENU_GESTIONE_ESITO.eliminaEsitoPS(rec[0].IDEN_CONTATTO,rec[0].IDEN_CONTATTO_RICOVERO,rec[0].IDEN_SCHEDA_VERBALE, function(){home.NS_ANNULLA_DECESSO.annullaSegnalaDecessoMenu(rec)});
                }
                else
                {
                    FNC_MENU_GESTIONE_ESITO.eliminaEsitoPS(rec[0].IDEN_CONTATTO,rec[0].IDEN_CONTATTO_RICOVERO,rec[0].IDEN_SCHEDA_VERBALE, NS_WK_PS.caricaWk);
                }
            },
            callbackKo : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                NS_LOCK.notificaLock(usernameLock);
            }
        })
    },

    stampaVerbale: function(rec){
        if(rec[0].STATO_CONTATTO == "DISCHARGED" || rec[0].STATO_CONTATTO == "NULLIFIED") {
            home.NS_STAMPE_PS.stampaVerbale(rec[0].IDEN_CONTATTO, "N", null, '{"N_COPIE":"1"}', rec[0].STATO);
        }
        else{
            $.dialog("impossibile stampare verbale, cartella aperta", {
                title: "Attenzione",
                buttons: [
                    {label: "OK", action: function (ctx) {

                        //dovrebbe solo salvare i cambiamenti dei campi qui
                        $.dialog.hide();
                    }}
                ]
            });
        }
    },
    apriModulistica :  function(rec){
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=MODULISTICA&IDEN_CONTATTO=' + rec[0].IDEN_CONTATTO	+ '&IDEN_PROVENIENZA=' + rec[0].IDEN_PROVENIENZA+'&READONLY=N&LISTA_CHIUSI=S&TEMPLATE=MODULI/CheckModuli.ftl&IDEN_CDC='+rec[0].IDEN_CDC,fullscreen:true});
    }

};

var FNC_MENU_CODICI_MISSIONE = {

    /**
     * Attiva la modalità "associazione" per l'inserimento della pratica di PS partendo dalla missione della centrale operativa di emergenza
     *
     * @param {type} rec
     * @returns {void}
     */
    associaPaziente:function(rec) {

        rec = rec[0];

        var associazioneMissione = new home.AssociazioneMissione(function(){home.NS_FENIX_TOP.associazioneMissione = null;});

        associazioneMissione.iden = rec.IDEN;
        associazioneMissione.urgenza.codice = rec.URGENZA_CODICE;
        associazioneMissione.urgenza.descrizione = rec.URGENZA;
        associazioneMissione.codiceAmulanza = rec.CODICE_AMBU;
        associazioneMissione.setCodiceMissione(rec.CODICE_MISSIONE);

        home.NS_FENIX_TOP.associazioneMissione = associazioneMissione;

        $('#Worklist > .footerTabs').prepend(home.NS_FENIX_TOP.associazioneMissione.getWidget(window));
        $('#li-filtroAnagrafica').trigger('click');
    }
};

var FNC_MENU_GENERICS = {
    cancelAmministrativo: function (idenContatto, paziente, callback) {
        if (!NS_FENIX_PS.hasAValue(idenContatto)) {
            logger.error("cancelAmministrativo : idenContatto is undefined");
        } else {
            var jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden(idenContatto, {assigningAuthorityArea: 'ps'});
        }

        jsonContatto.uteModifica.id = home.baseUser.IDEN_PER;

        if (!NS_FENIX_PS.hasAValue(paziente)) logger.error("cancelAmministrativo : paziente is undefined");

        $.dialog("Si desidera eliminare il contatto di Pronto Soccorso per il paziente : " + paziente + " ?", {
            title: "Attenzione",
            buttons: [
                {label: "NO", action: function () {
                    //dovrebbe solo salvare i cambiamenti dei campi qui
                    $.dialog.hide();
                }},
                {label: "SI", action: function () {
                    $.dialog.hide();
                    CONTROLLER_PS.CancelAdmission({
                        jsonContatto: jsonContatto,
                        callback: function(){
                            callback();
                        }
                    });
                }}

            ]
        });

    },
    //aggiunto parametro blocca di default S nel senso che se nn viene passato blocca sempre
    apricartella:function(rec, type){
        logger.debug(JSON.stringify(rec));
        logger.debug("IDEN_ANAG ->" + rec[0].IDEN_ANAG + ' IDEN_CONTATTO ->'+rec[0].IDEN_CONTATTO + ' IDEN_PROVENIENZA ->' +rec[0].IDEN_PROVENIENZA  + ' CODICE FISCALE ->' +rec[0].CODICE_FISCALE  + 'IDEN_LISTA -> '+rec[0].IDEN_LISTA );
        var url =  'page?KEY_LEGAME=CARTELLA&IDEN_ANAG='+ rec[0].IDEN_ANAG+'&IDEN_CONTATTO='+
            rec[0].IDEN_CONTATTO + '&IDEN_PROVENIENZA='+rec[0].IDEN_PROVENIENZA+'&IDEN_CDC_PS='+rec[0].IDEN_CDC+
            '&CODICE_FISCALE='+ rec[0].CODICE_FISCALE+'&IDEN_LISTA='+rec[0].IDEN_LISTA+'&TEMPLATE=LISTA_ATTESA/ListaAttesaFooter.ftl';


        switch (type) {
            case 'MANUTENZIONE_TRIAGE' :
                url +='STATO_PAGINA=E&SCHEDA=INTERVISTA&CONTGIU_CDC=' + rec[0].CONTGIU_CDC + '&WK_APERTURA=LISTA_ATTESA&CONTGIU_PROV=' + rec[0].CONTGIU_PROV + '&MENU_APERTURA=MANUTENZIONE_TRIAGE';
                break;
            case 'MANUTENZIONE_RIVALUTAZIONE' :
                url +='STATO_PAGINA=E&SCHEDA=INTERVISTA&CONTGIU_CDC=' + rec[0].CONTGIU_CDC + '&WK_APERTURA=LISTA_ATTESA&CONTGIU_PROV=' + rec[0].CONTGIU_PROV + '&MENU_APERTURA=MANUTENZIONE_RIVALUTAZIONE&TEMPO_PREVISTO='+rec[0].DIFF_MODIFICA+'&COLORE='+rec[0].CODICE;
                break;
            case  'ELABORAZIONE_PIU_CONT' :
                url += '&WK_APERTURA=LISTA_APERTI&STATO_PAGINA=I&UTENTE_RESPONSABILE='+home.baseUser.IDEN_PER;
                break;
            case 'PRESA_IN_CARICO_LISTA_APERTI':
                url += '&WK_APERTURA=LISTA_APERTI&CONTGIU_CDC=' + rec[0].CONTGIU_CDC + '&CONTGIU_PROV=' + rec[0].CONTGIU_PROV + '&STATO_PAGINA=E&UTENTE_RESPONSABILE='+home.baseUser.IDEN_PER;
                break;
            case 'ANAGRAFICA':
                url += '&STRUTTURA=' + rec[0].STRUTTURA + '&WK_APERTURA=ANAGRAFICA&STATO_PAGINA=I&MENU_APERTURA=ANAGRAFICA';
                break;
            case 'SCELTA_ESITO_OBI':
                 url += '&WK_APERTURA=LISTA_OBI&MENU_APERTURA=SCELTA_ESITO_OBI&STATO_PAGINA=E';
                break;
            case 'MODIFICA_ESITO' :
                url+='&WK_APERTURA=LISTA_OBI&MENU_APERTURA=MODIFICA_ESITO&STATO_PAGINA=E';
                break;
            case 'LISTA_OBI':
                url+='&WK_APERTURA=LISTA_OBI&STATO_PAGINA=E';
                break;
            case 'APRI_CARTELLA_AMMINISTRATIVO' :
                url +='SCHEDA=INTERVISTA&CONTGIU_CDC='+rec[0].CONTGIU_CDC+'&CONTGIU_PROV='+rec[0].CONTGIU_PROV+'&WK_APERTURA=LISTA_ATTESA'+'&MENU_APERTURA=APRI_CARTELLA&STATO_PAGINA=E';
                break;
            case 'RIVALUTA_TRIAGE':
                url +='&SCHEDA=INTERVISTA&CONTGIU_CDC='+rec[0].CONTGIU_CDC+'&WK_APERTURA=LISTA_ATTESA&CONTGIU_PROV='+rec[0].CONTGIU_PROV+'&MENU_APERTURA=RIVALUTA_TRIAGE&STATO_PAGINA=E&TEMPO_PREVISTO='+rec[0].DIFF_MODIFICA+'&COLORE='+rec[0].CODICE;
                break;
            case 'COMPLETA_RIVALUTAZIONE':
                url +='&SCHEDA=INTERVISTA&CONTGIU_CDC='+rec[0].CONTGIU_CDC+'&WK_APERTURA=LISTA_ATTESA&CONTGIU_PROV='+rec[0].CONTGIU_PROV+'&MENU_APERTURA=COMPLETA_RIVALUTAZIONE&STATO_PAGINA=E';
                break;
            case 'VALUTA_TRIAGE':
                url += '&SCHEDA=INTERVISTA&CONTGIU_CDC='+rec[0].CONTGIU_CDC+'&WK_APERTURA=LISTA_ATTESA&CONTGIU_PROV='+rec[0].CONTGIU_PROV+'&MENU_APERTURA=VALUTA_TRIAGE&STATO_PAGINA=E';
                break;
            case 'SEGNALA_ALLONTANATO':
                url += '&SCHEDA=INTERVISTA&CONTGIU_CDC='+rec[0].CONTGIU_CDC+'&CONTGIU_PROV='+rec[0].CONTGIU_PROV+
                    '&WK_APERTURA=LISTA_ATTESA'+'&MENU_APERTURA=SEGNALA_ALLONTANATO&STATO_PAGINA=E';
                break;
            case 'SCELTA_ESITO' :
                url += '&WK_APERTURA=LISTA_APERTI&MENU_APERTURA=SCELTA_ESITO&STATO_PAGINA=E';
                break;
            case 'LISTA_APERTI':
                url +='&WK_APERTURA=LISTA_APERTI'+'&MENU_APERTURA=APRI_CARTELLA&STATO_PAGINA=E&UTENTE_RESPONSABILE='+rec[0].ID_UTE_RIFERIMENTO;
                break;
            case 'LISTA_APERTI_READONLY':
                url +='&WK_APERTURA=LISTA_APERTI'+'&MENU_APERTURA=APRI_CARTELLA&STATO_PAGINA=R&AVVISO=CONSULENZE&UTENTE_RESPONSABILE='+rec[0].ID_UTE_RIFERIMENTO;
                break;
            case 'LISTA_CHIUSI' :
                url +='&WK_APERTURA=LISTA_CHIUSI&STATO_PAGINA=E&MENU_APERTURA=MANUTENZIONE_CARTELLA';
                break;
            case 'LISTA_CHIUSI_READONLY':
                url +='&WK_APERTURA=LISTA_CHIUSI&MENU_APERTURA=APRI_CARTELLA&STATO_PAGINA=R';
                break;
            case 'GESTIONE_ESITO_READONLY':
                url +='&WK_APERTURA=LISTA_CHIUSI&MENU_APERTURA=APRI_CARTELLA&STATO_PAGINA=R';
                break;



            //LISTA_APERTI_READONLY
        }

        var paramsBloccaCartella = {
            idenContatto :  rec[0].IDEN_CONTATTO,
            callbackOK :  function(){
                home.NS_WK_PS.refresh_wk = false;
                home.NS_FENIX_TOP.apriPagina({url:url, fullscreen:true});
            },
            callbackKO : function (err) {
                var usernameLock = new RegExp(":(.*)").exec(err)[1];
                url += "&AVVISO=CONSULENZE";

                if(url.indexOf("STATO_PAGINA=E") != -1){
                    url = url.replace("STATO_PAGINA=E","STATO_PAGINA=R");
                }else{
                    home.NS_WK_PS.refresh_wk = false;
                    home.NS_FENIX_TOP.apriPagina({url:url, fullscreen:true});
                    return;
                }

                /*se è bloccato confirm */
                $.dialog("La cartella e' aperta da " + usernameLock + ". Si vuole aprire in modalita' Consultazione?",{//$.dialog("Attenzione la cartella e' aperta da " + resp.personale,{
                    title: "Attenzione",
                    buttons: [
                        {
                            label: "SI", action: function () {
                            $.dialog.hide();
                            home.NS_WK_PS.refresh_wk = false;
                            home.NS_FENIX_TOP.apriPagina({url:url, fullscreen:true});
                        }
                        },
                        {
                            label: "NO", action: function () {
                            $.dialog.hide();
                        }
                        }
                    ]
                });
            }
        };
        NS_LOCK.bloccaCartella(paramsBloccaCartella);




    },
    apriSchedaAnagrafica:function(rec, type){
        var url = 'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=E&IDEN_ANAG='+ rec[0].IDEN_ANAG;
        switch (type) {
            case 'LISTA_ATTESA' :
                url += '&WK_APERTURA=LISTA_ATTESA';
                break;
            case 'LISTA_APERTI':
                url +='&WK_APERTURA=LISTA_APERTI';
                break;
            case 'LISTA_CHIUSI' :
                url +='&WK_APERTURA=LISTA_CHIUSI';
                break;
            case 'LISTA_OBI':
                url += '&WK_APERTURA=LISTA_OBI';
                break;

        }

        home.NS_FENIX_TOP.apriPagina({url:url, id:'insAnag',fullscreen:true});
    },
    associaPazienteSconosciuto:function(rec,type){
        //rec.IDEN_CONTATTO
        var paramLockCartella = {
            idenContatto : rec[0].IDEN_CONTATTO,
            callbackOK : callbackOK,
            callbackKO : callbackKO
        };
        function callbackOK (resp) {
                var url = 'page?KEY_LEGAME=RIASSOCIA_PAZIENTE&IDEN_CONTATTO=' + rec[0].IDEN_CONTATTO + '&PAZIENTE=' + rec[0].PAZIENTE;

                switch (type) {

                    case 'RIASSOCIA':
                        url += '&CHIUSO=N&IDEN_RICOVERO=&CODICE_RICOVERO=';
                        break;
                    case 'RIASSOCIA_CHIUSO':
                        url += '&IDEN_RICOVERO=' + rec[0].IDEN_CONTATTO_RICOVERO + '&CODICE_RICOVERO=' + rec[0].CODICE_RICOVERO + '&CHIUSO=S&IDEN_LISTA='+rec[0].IDEN_LISTA+'&IDEN_CDC='+rec[0].IDEN_CDC+'&IDEN_PROVENIENZA='+rec[0].IDEN_PROVENIENZA+'&STATO_CONTATTO='+rec[0].STATO_CONTATTO;
                        break;

                }
                home.NS_FENIX_TOP.apriPagina({url: url, id: 'assPazSconosciuto', fullscreen: true});

        }
        function callbackKO (err){
            var usernameLock = new RegExp(":(.*)").exec(err)[1];

            NS_LOCK.notificaLock(usernameLock);
        }
        NS_LOCK.bloccaCartella(paramLockCartella);

    },
    eliminaEsitoPS : function(idenContatto, idenContattoRicovero, idenSchedaVerbale, callback){

        NS_ELIMINA_ESITI.callEliminaEsitoPS(idenContatto, idenContattoRicovero, idenSchedaVerbale, callback);

    },
    checkMedicoResponsabile : function (params){
        if(home.baseUser.TIPO_PERSONALE == 'M'){

            function callBackOk (resp){

                if(resp.result[0].IDEN_PER != home.baseUser.IDEN_PER){
                    home.NOTIFICA.error({message: 'impossibile aprire la cartella, cartella presa in carico da un\'altro medico', title: 'Error'});
                    NS_WK_PS.caricaWk();
                }else{
                    params.callbackOK(params);
                }

            }

            var parametri = ({
                id:"PS.Q_CHECK_MEDICO_RESP",
                datasource : 'PS',
                params : {IDEN_CONTATTO : {t:'N', v:params.IDEN_CONTATTO}},
                callbackOK : callBackOk
            });

            NS_CALL_DB.SELECT(parametri);

        }else{
            params.callbackOK();
        }
    },

    controlloCartella : function(json,rec) {

        var paramBloccaCartella = {
            idenContatto: json.iden_contatto,
            callbackOK  : callbackOK,
            callbackKO  : callbackKO
        };

        function callbackOK(resp) {
                json.callback();
        }
        //anche se è bloccata richiamo la funzione che fa il controllo e chiede se si vuole aprire in consultazione
        function callbackKO(err){
            //var usernameLock = new RegExp(":(.*)").exec(err)[1];
            if(typeof json.callbackKo == 'function'){
                json.callbackKo(err);
            }else{
                FNC_MENU_GENERICS.apricartella(rec, 'LISTA_APERTI_READONLY');
            }

        }

        NS_LOCK.bloccaCartella(paramBloccaCartella);
    }

};