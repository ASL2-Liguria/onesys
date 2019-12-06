/**
 * User: matteopi + carlog
 * Date: 12/11/13
 * Time: 16.38
 */

jQuery(document).ready(function () {
    NS_FENIX_PS.init();
    NS_FENIX_PS.event();

});

var NS_FENIX_PS = {

    tab_sel: null,
    tableInfoDialog: null,
    tableinfoAnag: null,
    isIE: true,
    jSonPazientiDaPrendereInCarico : null,
    ricCognome: null,
    ricNome: null,


    init: function () {

        $("#tableCodiciMissione").hide();
        $("#wkMissione").hide();
        $("#divWkCodiciMissione").hide();

        home.NS_CONSOLEJS.addLogger({name: 'HomePS', console: 0});
        window.logger = home.NS_CONSOLEJS.loggers['HomePS'];
        home.NS_FENIX_PS = this;
        home.DIALOG_PS = DIALOG_PS;
        NS_FENIX_PS.isIE = !!document.documentMode;
        NS_FENIX_PS.selezionaPS();
        NS_FENIX_PS.getTipoPersonale(home.baseUser.TIPO_PERSONALE);
        home.SCLogout = function(){ home.NS_WORKSTATION_PS.logoutSmartCard(); };
        home.NS_FENIX_TOP.callAfterLogout = function(){ home.NS_WORKSTATION_PS.callAfterLogout(); };
        home.NS_FENIX_PS.ricCognome = '';
        home.NS_FENIX_PS.ricNome = '';
        home.NS_SMARTCARD.afterLogin = function(sameUser){NS_WORKSTATION_PS.loginSmartCardSbloccaWK(sameUser); };
        NS_UNLOCK.sbloccaCartella({usernameLocked:home.baseUser.USERNAME});
        NS_FENIX_PS.caricaJsonModuli();

        home.NS_FENIX_PRINT.okCaricaDocumento = function () {
            home.$("#fldInfoDocumento").hide();
            home.$("#fldFunzioniFirma").hide();
            home.$("#fldFunzioniSISS").hide();
            home.$("#fldFunzioniValida").hide();
            home.$("#fldFunzioniStampa").show();
            home.$("#fldFunzioniRitornaWk").hide();
        }

    },

    event: function () {
        $('#tabs-Worklist').children().click(function () {
            NS_FENIX_PS.tab_sel = $(this).attr('data-tab');
            NS_WK_PS.caricaWk();
        });
        $("div#filtroAperti input, div#filtroOBI input").off("keypress").on("keypress", function (e)
        {
            if (e.keyCode == 13)
            {
                $("input", "div#filtroAnagrafica").each(function(){$(this).val($(this).val().toUpperCase());});

                if(!NS_FENIX_WK.beforeApplica())
                {
                    NS_FENIX_WK.setApplicaEvent();
                    return false;
                }
                NS_FENIX_FILTRI.applicaFiltri(NS_FENIX_WK.params);
            }
        });

    },

    getTipoPersonale: function (tipoPersonale) {
        var tabWorklist = $("#tabs-Worklist");

        switch (tipoPersonale) {
            case 'A':
                $("#li-filtroAnagrafica").trigger("click");
                NS_WK_PS.caricaWkAnagrafica();
                NS_FENIX_PS.tab_sel = tabWorklist.find("li.tabActive").data("tab");
                break;
            case 'I':
            case 'OST':
            case 'M':
                $("#li-filtroAttesa").trigger("click");
                NS_WK_PS.caricaWkListaAttesa();
                NS_FENIX_PS.tab_sel = tabWorklist.find("li.tabActive").data("tab");

                break;
            default :
                logger.error("tipo personale non riconosciuto : " + tipoPersonale);
                break;
        }
        NS_FENIX_FILTRI.leggiFiltriDaSalvare();

    },

    hasAValue: function (value) {
        return (("" !== value) && (undefined !== value) && (null !== value) && ("null" !== value) && (typeof undefined !== value) && ("undefined" !== value));
    },

    setNomeCognome: function(){
        NS_FENIX_PS.ricCognome = $('#txtCognomeAnag').val();
        NS_FENIX_PS.ricNome = $('#txtNomeAnag').val();
    },

    /**
     * Inserisco il paziente in contatti e nei segmenti giuridico e assistenziale
     * @param iden_anag
     * @param cod_fiscale
     */
    inserisciContatto : function (iden_anag, cod_fiscale) {

        var _JSON_ANAGRAFICA = NS_ANAGRAFICA.Getter.getAnagraficaById(iden_anag);
        var _PZ_SCONOSIUTO = _JSON_ANAGRAFICA.cognome === 'SCONOSCIUTO';
        if(_JSON_ANAGRAFICA.length == 0)
        {
            logger.error("lanciare la seguente url nel browser anagrafica/GetAnagraficaById/string/"+iden_anag);
            return home.NOTIFICA.error({message: "Errore nel recepire i dati anagrafici, contattare l'assistenza", title: "Error", timeout: 5});
        }
        var _CHK_ANAGRAFICA = checkDatiFondamentali(_JSON_ANAGRAFICA, _PZ_SCONOSIUTO);


        NS_FENIX_PS.checkContattiApertiPS({
            iden_anag : iden_anag,
            callback : function(){
                NS_FENIX_PS.checkRicoveriADT({
                    iden_anag : iden_anag,
                    callback : function(){
                        if (_CHK_ANAGRAFICA.length > 0)
                        {
                            logger.error("Inserimento Ricovero - Check Anagrafica - Anagrafica NON Completa - Campi da Valorizzare -> " + _CHK_ANAGRAFICA);

                            home.DIALOG.si_no({
                                title: "Inserimento Ricovero - Anagrafica Incompleta",
                                msg:"Anagrafica INCOMPLETA! Per continuare Occorre valorizzare i campi: " + _CHK_ANAGRAFICA + ". Proseguire con la modifica dell\'anagrafica?",
                                cbkNo:function(){  },
                                cbkSi: function(){
                                    home.NS_FENIX_TOP.apriPagina({
                                            url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=E&IDEN_ANAG='+iden_anag,id:'insAnag',fullscreen:true}
                                    )

                                }
                            });
                        }
                        else{
                            inserisci(iden_anag);
                        }
                    }
                })
            }
        });

        function inserisci(iden_anag){

            var jsonQuery = {
                datasource : 'PS',
                id :"PS.Q_DATI_ANAGRAFICA_CONTATTO",
                params : {iden_anagrafica : {t:'N', v:Number(iden_anag)} },
                callbackOK : insertContatto
            };
            NS_CALL_DB.SELECT(jsonQuery);

            function insertContatto (data ) {
                if (!NS_FENIX_PS.hasAValue(iden_anag)) logger.error("inserisciContatto : iden_anag is not defined ");
                if (!NS_FENIX_PS.hasAValue(cod_fiscale)) logger.error("inserisciContatto : cod_fiscale is not defined");

                var jsonContatto = NS_DATI_PAZIENTE.getContattoEmpty({assigningAuthorityArea: 'ps'});
                var idProvenienza = home.baseUserLocation.iden_provenienza;
                var idenPer = home.baseUser.IDEN_PER;
                var dataOraAttuali = moment().format('YYYYMMDDHH:mm');

                jsonContatto.codice.assigningAuthorityArea = 'PS';
                jsonContatto.anagrafica.id = iden_anag;
                jsonContatto.tipo.codice = '2';
                jsonContatto.regime.codice = 'PS';
                jsonContatto.stato.codice = 'ADMITTED';
                jsonContatto.dataInizio = dataOraAttuali;
                jsonContatto.uteInserimento.id = idenPer;
                jsonContatto.codice.assigningAuthorityArea = 'PS';

                jsonContatto.contattiGiuridici[0].provenienza.id = idProvenienza;
                jsonContatto.contattiGiuridici[0].stato.codice = 'ADMITTED';
                jsonContatto.contattiGiuridici[0].dataInizio = dataOraAttuali;
                jsonContatto.contattiGiuridici[0].regime.codice = "PS";
                jsonContatto.contattiGiuridici[0].uteInserimento.id = idenPer;

                jsonContatto.contattiAssistenziali[0].provenienza.id = idProvenienza;
                jsonContatto.contattiAssistenziali[0].stato.codice = 'ADMITTED';
                jsonContatto.contattiAssistenziali[0].dataInizio = dataOraAttuali;
                jsonContatto.contattiAssistenziali[0].deleted = false;

                if(home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST'){
                    jsonContatto.contattiAssistenziali[0].mapMetadatiString['UTENTE_RESPONSABILE_INFERMIERE'] = idenPer;
                }else if (home.baseUser.TIPO_PERSONALE == 'M'){
                    jsonContatto.contattiAssistenziali[0].mapMetadatiString['UTENTE_RESPONSABILE_MEDICO'] = idenPer;
                }else if(home.baseUser.TIPO_PERSONALE == 'A'){
                    jsonContatto.contattiAssistenziali[0].mapMetadatiString['UTENTE_RESPONSABILE_AMMINISTRATIVO'] = idenPer;
                }

                jsonContatto.contattiAssistenziali[0].mapMetadatiString['PRIMA_PRESA_IN_CARICO_MEDICA'] =  'N';

                if(data.result.length > 0){
                    var result = data.result[0];
                    var cittadinanza = [];
                    var dati = result.CITTADINANZA;
                    dati = '<DATI>'+dati+'</DATI>';
                    var re= /<ITEM DESCR="([A-Z]*)">([0-9]*)<\/ITEM>/g;


                    while (match = re.exec(dati)) {
                        /*alert(match[1]);
                         alert(match[2]);*/
                        var descr = match[1];
                        var val =  match[2];
                        cittadinanza.push({codice : val , descrizione:descr})
                    }

                    var jsonDati = {
                        codice_fiscale : result.CODICE_FISCALE,
                        sesso          : result.SESSO,
                        data_nascita   : result.DATA_NASCITA,
                        cognome        : result.COGNOME,
                        nome           : result.NOME,
                        idRis          : result.IDEN,
                        comune_nascita : result.IDEN_COMUNE_NASCITA,
                        telefono_residenza : result.RES_TELEFONO,
                        indirizzo_residenza : result.RES_INDIRIZZO,
                        comune_residenza :  result.IDEN_COMUNE_RESIDENZA,
                        provincia_residenza :  result.RES_PROVINCIA,
                        cap_residenza :    result.RES_CAP,
                        stp            :   result.COD_STP,
                        scadenzaSTP    :   result.DATA_SCADENZA_STP,
                        eni            :   result.COD_ENI,
                        scadenzaENI    :   result.DATA_SCADENZA_ENI,
                        stato_civile   :   result.IDEN_STATO_CIVILE,
                        livello_istruzione : result.IDEN_LIVELLO_ISTRUZIONE,
                        tessera_sanitaria  : result.TESSERA_SANITARIA,
                        tessera_sanitaria_scadenza : result.TESSERA_DATA_SCAD,
                        cod_reg_res    :   result.RES_COD_REGIONE,
                        cod_asl_res    :   result.ASL_RESIDENZA,
                        cittadinanza   :   cittadinanza
                    };

                    jsonContatto = NS_ANAGRAFICA_SALVATAGGIO.setMetadatiAnagrafica(jsonContatto, jsonDati);

                    var posizione = {};
                    posizione.anagrafica = jsonContatto.anagrafica;
                    posizione.assigningAuthority = jsonContatto.codice.assigningAuthority;
                    posizione.assigningAuthorityArea = jsonContatto.codice.assigningAuthorityArea;
                    posizione.stato = {id : null, codice : "INSERITO"};
                    posizione.attivo = true;
                    posizione.deleted = false;
                    posizione.dataPrenotazione = jsonContatto.dataInizio;
                    posizione.provenienza = jsonContatto.contattiGiuridici[0].provenienza;
                    posizione.utenteInserimento = jsonContatto.uteInserimento;

                    jsonContatto.posizioniListaAttesa = [posizione];

                    var p = {
                        "contatto": jsonContatto,
                        "hl7Event": "A01",
                        "scope" : "ps/",
                        "notifica": {"show": "S", "message": "Inserimento Avvenuto Correttamente", "errorMessage": "Impossibile inserire il contatto, Paziente gia presente", "timeout": 3},
                        "cbkSuccess": function (){

                            var rec = [{
                                IDEN_ANAG : jsonContatto.anagrafica.id,
                                IDEN_CONTATTO : NS_CONTATTO_METHODS.contatto.id,
                                IDEN_PROVENIENZA : home.baseUserLocation.iden_provenienza,
                                CODICE_FISCALE : NS_CONTATTO_METHODS.contatto.anagrafica.codiceFiscale,
                                IDEN_CDC : home.baseUserLocation.iden,
                                STRUTTURA : home.baseUserLocation.struttura,
                                IDEN_LISTA: NS_CONTATTO_METHODS.contatto.posizioniListaAttesa[0].id
                            }];

                            FNC_MENU_GENERICS.apricartella(rec, 'ANAGRAFICA')
                        },
                        "cbkError": function () { home.NS_LOADING.hideLoading(); }

                    };

                    NS_CONTATTO_METHODS.admitVisitNotification(p);
                }
            }

        }

    },

    checkRicoveriADT : function(json){
        var db = $.NS_DB.getTool();
        var dbParams = {"iden_anag": {v: json.iden_anag, t: "N"}};
        var xhr = db.select({
            datasource: "PS",
            id: "PS.Q_RICERCA_RICOVERI_ADT",
            parameter: dbParams
        });
        xhr.done(function (response) {
            if (response.result.length > 0)
            {
                var tableRic="<table style='width:450px;' ><caption style='font-weight: bold;'>Ricoveri aperti</caption>" +
                    "<tr><th style='font-weight: bold;'>Nosologico</th><th style='font-weight: bold;'>Regime</th>" +
                    "<th style='font-weight: bold;'>Reparto</th><th style='font-weight: bold;'>Data</th></tr>";

                for (var i=0; i<response.result.length; i++)
                {
                    tableRic += "<tr></tr><td style='border:1px solid black; text-align: center;'>" + response.result[i].NOSOLOGICO + "</td>";
                    tableRic += "<td style='border:1px solid black; text-align: center;'>" + response.result[i].REGIME_DESCR + "</td>";
                    tableRic += "<td style='border:1px solid black; text-align: center;'>" + response.result[i].REPARTO + "</td>";
                    tableRic += "<td style='border:1px solid black; text-align: center;'>" + response.result[i].DATA_INIZIO + "</td></tr>";
                }

                tableRic += "</table>";

                $.dialog(tableRic,{title : "Ricoveri sovrapposti",
                    height:200,
                    width:500,
                    buttons :[
                        {label: "Annulla", action: function (){
                            $.dialog.hide();
                        }},
                        {label: "Prosegui", action: function (){
                            $.dialog.hide();
                            json.callback();
                        }}
                    ]
                });
            }
            else
            {
                logger.info("Il paziente non ha ricoveri aperti in ADT");
                json.callback();
            }

        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("TAB_HOME.getRegimeRicoveroADT  \n" + JSON.stringify(jqXHR) +
                "\n" + JSON.stringify(textStatus) + "\n" + JSON.stringify(errorThrown));
        });
    },

    checkContattiApertiPS : function(json){
        var params = {
            "iden_anag": {v: json.iden_anag, t: "N"}
        };

        var parametri = {
            "datasource": "PS",
            id: "PS.Q_RICERCA_RICOVERI_PS",
            "params": params,
            "callbackOK": callbackOk
        };

        NS_CALL_DB.SELECT(parametri);

        function callbackOk(data) {
            if(data.result.length > 0 ){
                home.NOTIFICA.error({message: "Il contatto selezionato &egrave; gi&agrave; in Pronto Soccorso", title: "Error", timeout: 5});
            }else{
                logger.info("Il paziente con iden_anag " + json.iden_anag + " non ha accessi aperti in Pronto Soccorso");
                json.callback()
            }
        }
    },

    /**
     * Update di alcuni campi su contatti(Urgenza), contAss(infermiere, medico) e rimuove il contatto dalla lista d'attesa
     * @param iden_anag
     * @param iden_contatto
     * @param iden_provenienza
     * @param codice_fiscale
     * @param iden_lista
     * @param urgenza
     * @param idInfermiere
     * @param iden_cdc
     * @param contgiu_cdc
     * @param contgiu_prov
     * @param cartella
     */
    presaInCarico: function (iden_anag, iden_contatto, iden_provenienza, codice_fiscale, iden_lista, urgenza, idInfermiere, iden_cdc, contgiu_cdc, contgiu_prov, cartella) {

        if (!NS_FENIX_PS.hasAValue(iden_anag)) logger.error("presaInCarico : iden_anag is not defined");
        if (!NS_FENIX_PS.hasAValue(iden_contatto)) logger.error("presaInCarico : iden_contatto is not defined");
        if (!NS_FENIX_PS.hasAValue(iden_provenienza)) logger.error("presaInCarico : iden_provenienza is not defined");
        if (!NS_FENIX_PS.hasAValue(iden_lista)) logger.error("presaInCarico : iden_lista is not defined");
        if (!NS_FENIX_PS.hasAValue(urgenza)) logger.error("presaInCarico : urgenza is not defined");
        if (!NS_FENIX_PS.hasAValue(idInfermiere)) logger.warn("presaInCarico : idInfermiere is not defined");
        if (!NS_FENIX_PS.hasAValue(iden_cdc)) logger.error("presaInCarico : iden_cdc is not defined");
        if (!NS_FENIX_PS.hasAValue(contgiu_cdc)) logger.error("presaInCarico : contgiu_cdc is not defined");
        if (!NS_FENIX_PS.hasAValue(contgiu_prov)) logger.error("presaInCarico : contgiu_prov is not defined");

        var paramCheckCartella = {
            idenContatto : iden_contatto,
            callbackOK : callbackOK,
            callbackKO : callbackKO
        };
        function callbackOK (resp) {

                NS_TRIAGE_METHODS.checkStatoLista({
                    "iden_contatto" : iden_contatto,
                    "stato_controllo" : "COMPLETO",
                    "callback"  : function(param) {

                        var json = NS_DATI_PAZIENTE.getDatiContattobyIden(iden_contatto, {assigningAuthorityArea: 'ps'});
                        var contattoAssNew = {};
                        iden_lista = param.IDEN_LISTA;

                        $.extend(contattoAssNew, json.contattiAssistenziali[json.contattiAssistenziali.length - 1]);

                        for (var i = 0; i < json.contattiAssistenziali.length; i++) {
                            if (json.contattiAssistenziali[i].mapMetadatiString["PRIMA_PRESA_IN_CARICO_MEDICA"] === "S") {
                                home.NOTIFICA.error({message: "Il contatto selezionato &egrave; gi&agrave; stato preso in carico", title: "Error", timeout: 5});
                                logger.debug("Presa in carico S , iden_contatto_assistenziale -> " + json.contattiAssistenziali[i].id);
                                return  home.NS_WK_PS.caricaWk();
                            }
                        }

                        contattoAssNew.id = null;
                        contattoAssNew.dataInizio = moment().format('YYYYMMDDHH:mm');
                        json.contattiAssistenziali[json.contattiAssistenziali.length - 1].dataFine = moment().format('YYYYMMDDHH:mm');

                        contattoAssNew.mapMetadatiString['UTENTE_RESPONSABILE_MEDICO'] = home.baseUser.IDEN_PER;
                        contattoAssNew.mapMetadatiString['INFERMIERE_PRESENTE'] = idInfermiere;
                        contattoAssNew.mapMetadatiString['PRIMA_PRESA_IN_CARICO_MEDICA'] = 'S';
                        contattoAssNew.precedente = {"id": json.contattiAssistenziali[json.contattiAssistenziali.length - 1].id };

                        contattoAssNew.uteModifica.id = home.baseUser.IDEN_PER;
                        contattoAssNew.uteInserimento.id = home.baseUser.IDEN_PER;
                        contattoAssNew.note = "Presa in carico di " + home.baseUser.IDEN_PER;
                        json.contattiAssistenziali.push(contattoAssNew);

                        var posizione = json.posizioniListaAttesa[json.posizioniListaAttesa.length - 1];

                        posizione.stato = {id : null, codice : "CHIUSO"};
                        posizione.utenteModifica = contattoAssNew.uteInserimento;
                        posizione.utenteModifica.id = home.baseUser.IDEN_PER;

                        var pPresaInCarico = {"contatto" : json, "scope" : "ps/", servlet : "PresaInCaricoMedica", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Presa in Carico Medica Avvenuta con Successo", "errorMessage" : "Errore Durante Presa in Carico Medica"}, "hl7Event" : "PRESA_IN_CARICO_MEDICA", "cbkSuccess" : function(){
                            var rec = [
                            {
                                IDEN_ANAG: iden_anag,
                                IDEN_CONTATTO: iden_contatto,
                                IDEN_PROVENIENZA: iden_provenienza,
                                CODICE_FISCALE: codice_fiscale,
                                IDEN_CDC: iden_cdc,
                                IDEN_LISTA: iden_lista,
                                CONTGIU_CDC: contgiu_cdc,
                                CONTGIU_PROV: contgiu_prov
                            }];
                            FNC_MENU_GENERICS.apricartella(rec, 'PRESA_IN_CARICO_LISTA_APERTI');
                        }};

                        NS_CONTATTO_METHODS.contatto = pPresaInCarico.contatto;
                        NS_CONTATTO_METHODS.executeAJAX(pPresaInCarico);
                    }
                });

        }
        function callbackKO (err){
            var usernameLock = new RegExp(":(.*)").exec(err)[1];

            home.NOTIFICA.warning({message:"Pratica "+ cartella +" bloccata da " + usernameLock + " , impossibile eseguire l'operazione ", title: "Attenzione", timeout: 7});
        }
        NS_LOCK.bloccaCartella(paramCheckCartella);

    },

    elaborazioniSuPiuContatti : function (idenPer, idenInfermiere, type, param) {
        if (typeof param == 'undefined'){
            param = null;
        }
        /** type può essere
         * PRESA_IN_CARICO
         * PASSAGGIO_DI_CONSEGNE
         * PASSAGGIO_DI_CONSEGNE_LISTA_APERTI
         * PRESA_IN_CARICO_LISTA_APERTI
         * */


        $.each(home.NS_FENIX_PS.jSonPazienti, function (k,v) {

            /*se il type è 'PRESA_IN_CARICO' l'utente di riferimento deve essere diverso da quello che fa lapresa in carico
            * invece se il type è 'PASSAGGIO_DI_CONSEGNE' l'utente di riferimento deve essere lo stesso dell'utente loggato*/

            var paramcheckCartella = {
                idenContatto : v.IDEN_CONTATTO,
                callbackOK : callbackOK,
                callbackKO : callbackKO
            };

            NS_LOCK.bloccaCartella(paramcheckCartella);
            function callbackOK (resp){

                    logger.debug(v.ID_UTENTE_RESPONSABILE + '\n' +  v.ID_UTE_RIFERIMENTO_INFERMIERE);
                    if (
                    //se l'utente responsabile è diverso dall'utente attuale ed è un presa in carico
                            ((NS_FENIX_PS.hasAValue(v.IDEN_CONTATTO)) && v.ID_UTENTE_RESPONSABILE != home.baseUser.IDEN_PER && type == 'PRESA_IN_CARICO') ||
                    // o se l'utente responsabile è uguale ed è un passaggio di consegne
                            ((NS_FENIX_PS.hasAValue(v.IDEN_CONTATTO)) && v.ID_UTENTE_RESPONSABILE == home.baseUser.IDEN_PER && type == 'PASSAGGIO_DI_CONSEGNE') ||
                    // o se è un passaggio di consegne in lista aperti o passaggio di consegne lista obi e se è un medico e se l'utente responsabile è uguale
                            ((NS_FENIX_PS.hasAValue(v.IDEN_CONTATTO)) &&
                                (type == 'PASSAGGIO_DI_CONSEGNE_LISTA_APERTI' ||  type == 'PASSAGGIO_DI_CONSEGNE_LISTA_OBI' )&&
                                (
                                    (
                                        (home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST') &&
                                        home.baseUser.IDEN_PER == v.ID_UTE_RIFERIMENTO_INFERMIERE
                                    )
                                    ||
                                    (
                                        home.baseUser.TIPO_PERSONALE == 'M' && home.baseUser.IDEN_PER == v.ID_UTE_RIFERIMENTO
                                    )
                                )
                            ) ||
                            (
                                (NS_FENIX_PS.hasAValue(v.IDEN_CONTATTO)) &&
                                (type == 'PRESA_IN_CARICO_LISTA_APERTI'|| type == 'PRESA_IN_CARICO_LISTA_OBI' ) &&
                                (
                                    (
                                        (home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST')  &&
                                        home.baseUser.IDEN_PER != v.ID_UTE_RIFERIMENTO_INFERMIERE
                                    )
                                    ||
                                    (
                                        home.baseUser.TIPO_PERSONALE == 'M' && home.baseUser.IDEN_PER != v.ID_UTE_RIFERIMENTO
                                    )
                                )
                            )
                        )
                    {

                        var params = {contattiGiuridici: 1, contattiAssistenziali: 1, assigningAuthorityArea: 'ps'};
                        var json = NS_DATI_PAZIENTE.getDatiContattobyIden(v.IDEN_CONTATTO, params);
                        var newContAss = {};
                        var tipotrasf = 'A';

                        var utente_riferimento  ;
                        if(home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST'){
                            utente_riferimento = json.contattiAssistenziali[json.contattiAssistenziali.length -1].mapMetadatiString['UTENTE_RESPONSABILE_INFERMIERE']!= ''? json.contattiAssistenziali[json.contattiAssistenziali.length -1].mapMetadatiString['UTENTE_RESPONSABILE_INFERMIERE']:json.contattiAssistenziali[json.contattiAssistenziali.length -1].mapMetadatiString['UTENTE_RESPONSABILE_MEDICO'];
                        }else{
                            utente_riferimento =json.contattiAssistenziali[json.contattiAssistenziali.length -1].mapMetadatiString['UTENTE_RESPONSABILE_MEDICO'];
                        }

                        if(NS_FENIX_PS.hasAValue(param) && NS_FENIX_PS.hasAValue(param.ubicazione)){
                            json.mapMetadatiString['UBICAZIONE'] = param.ubicazione;
                        }

                        $.extend(newContAss,json.contattiAssistenziali[json.contattiAssistenziali.length -1]);

                        if(type == 'PRESA_IN_CARICO' || type == 'PRESA_IN_CARICO_LISTA_APERTI'|| type == 'PRESA_IN_CARICO_LISTA_OBI'){
                            newContAss.note = "paziente di " + utente_riferimento + " preso in carico da " + idenPer;
                        }else  if(type == 'PASSAGGIO_DI_CONSEGNE' || type == 'PASSAGGIO_DI_CONSEGNE_LISTA_APERTI'|| type == 'PASSAGGIO_DI_CONSEGNE_LISTA_OBI'){
                            newContAss.note = "type = "+type+" -> paziente passato da "+ utente_riferimento  + " a "  + idenPer;
                        }
                        else{
                            newContAss.note = "Caso non contemplato -> " + type;
                        }

                        newContAss.id = null;
                        newContAss.uteModifica.id = home.baseUser.IDEN_PER;
                        newContAss.uteInserimento.id = home.baseUser.IDEN_PER;
                        newContAss.precedente = {"id": json.contattiAssistenziali[json.contattiAssistenziali.length - 1].id};
                        newContAss.dataInizio = moment().format('YYYYMMDDHH:mm');
                        json.contattiAssistenziali[json.contattiAssistenziali.length -1].dataFine = moment().format('YYYYMMDDHH:mm');
                        newContAss.mapMetadatiString['PRIMA_PRESA_IN_CARICO_MEDICA'] =  'N';

                        if(home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST'){

                            newContAss.mapMetadatiString['UTENTE_RESPONSABILE_INFERMIERE'] =  idenPer;

                            if(type == 'PRESA_IN_CARICO' || type == 'PASSAGGIO_DI_CONSEGNE'){
                                newContAss.mapMetadatiString['UTENTE_RESPONSABILE_MEDICO'] = null;
                            }

                        }else if (home.baseUser.TIPO_PERSONALE == 'M' ){

                            newContAss.mapMetadatiString['UTENTE_RESPONSABILE_MEDICO'] = idenPer;
                            newContAss.mapMetadatiString['UTENTE_RESPONSABILE_INFERMIERE'] = idenInfermiere;
                            if (type == 'PRESA_IN_CARICO' || type == 'PASSAGGIO_DI_CONSEGNE'){
                                newContAss.mapMetadatiString['UTENTE_RESPONSABILE_INFERMIERE'] = null;
                            }

                        }else{

                            logger.debug("Caso Non previsto");
                        }
                        logger.debug('parametri ->' + JSON.stringify(param) + ' type -> ' + type );

                        if(param != null && type == 'PASSAGGIO_DI_CONSEGNE_LISTA_APERTI' && param.iden_cdc != '' && param.ubicazione != '' ){

                            var iden_cdc = param.iden_cdc;
                           // var iden_provenienza = param.iden_provenienza;

                            newContAss.provenienza = { id: null , idCentroDiCosto: iden_cdc, codice: null};
                            newContAss.cdc = { id: null, idCentroDiCosto: null, codice: null};
                            newContAss.precedente = {"id": json.contattiAssistenziali[json.contattiAssistenziali.length - 1].id};

                            logger.debug('iden_cdc dell\'ultimo segmento giuridico -> ' + json.contattiGiuridici[json.contattiGiuridici.length - 1].cdc.idCentroDiCosto + ' iden cdc =  ' + iden_cdc);
                            if(json.contattiGiuridici[json.contattiGiuridici.length - 1].cdc.idCentroDiCosto != iden_cdc) {

                                var contattoGiuNew = {};
                                $.extend(contattoGiuNew, json.contattiGiuridici[json.contattiGiuridici.length - 1]);

                                contattoGiuNew.provenienza = { id: null , idCentroDiCosto: iden_cdc, codice: null};
                                contattoGiuNew.cdc = { id: null, idCentroDiCosto: null, codice: null};
                                contattoGiuNew.precedente = {"id": json.contattiGiuridici[json.contattiGiuridici.length - 1].id};
                                contattoGiuNew.dataInizio = moment().format('YYYYMMDDHH:mm');
                                json.contattiGiuridici[json.contattiGiuridici.length -1].dataFine = moment().format('YYYYMMDDHH:mm');
                                contattoGiuNew.id = null;
                                contattoGiuNew.uteInserimento.id = home.baseUser.IDEN_PER;
                                contattoGiuNew.note = 'Passagio di consegne con trasferimento giuridico';

                                tipotrasf = 'GA';

                                logger.debug("PUSH new contatto giuridico in contatto e tipo trasf" + tipotrasf);
                                json.contattiGiuridici.push(contattoGiuNew);
                            }

                        }

                        json.contattiAssistenziali.push(newContAss);

                        var servlet = "PassaggioDiConsegnaAssistenziale";

                        if (tipotrasf  === "GA"){
                            json.contattiAssistenziali[json.contattiAssistenziali.length -1].mapMetadatiString['AREAPS'] = param.iden_area;
                            //json.mapMetadatiString['UBICAZIONE'] = param.ubicazione;
                            servlet = "PassaggioDiConsegnaGiuridico";

                        }

                        var p = {
                            "servlet" : servlet,
                            "contatto" : json,
                            "hl7Event" : "ELABORAZIONE_CONTATTI",
                            "notifica" : {"show" : "N", "timeout" : 3 ,"message" : "Passaggio di Consegne Avvenuto con Successo", "errorMessage" : "Errore Durante Passaggio di Consegne"},
                            "cbkSuccess" : function () {

                                if(home.NS_FENIX_PS.jSonPazienti.length  == 1 && home.baseUser.TIPO_PERSONALE == 'M' && (type == 'PRESA_IN_CARICO_LISTA_APERTI' || type == 'PRESA_IN_CARICO'|| type == 'PRESA_IN_CARICO_LISTA_OBI')){

                                    var rec = [{
                                        IDEN_ANAG :NS_CONTATTO_METHODS.contatto.anagrafica.id,
                                        IDEN_CONTATTO :NS_CONTATTO_METHODS.contatto.id,
                                        IDEN_PROVENIENZA :home.baseUserLocation.iden_provenienza,
                                        CODICE_FISCALE : NS_CONTATTO_METHODS.contatto.anagrafica.codiceFiscale,
                                        IDEN_CDC :home.baseUserLocation.iden,
                                        STRUTTURA : home.baseUserLocation.struttura,
                                        IDEN_LISTA: ''
                                    }];

                                    if(type == 'PRESA_IN_CARICO_LISTA_OBI'){
                                        FNC_MENU_GENERICS.apricartella(rec, 'LISTA_OBI');
                                    }else{
                                        FNC_MENU_GENERICS.apricartella(rec, 'ELABORAZIONE_PIU_CONT');
                                    }

                                }else{

                                    if(type == 'PASSAGGIO_DI_CONSEGNE' || type == 'PASSAGGIO_DI_CONSEGNE_LISTA_APERTI'){
                                        home.NOTIFICA.success({message: "Passaggio di consegne effettuato correttamente ", timeout: 3, title: 'Success'});
                                    }else{
                                        home.NOTIFICA.success({message: "Presa in carico effettuata correttamente ", timeout: 3, title: 'Success'});
                                    }

                                    if(home.NS_FENIX_PS.jSonPazienti.length == (Number(k) + 1) ) {
                                        setTimeout(home.NS_WK_PS.caricaWk,300);
                                    }

                                }

                            }, "scope" :'ps/'
                        };

                        NS_CONTATTO_METHODS.contatto = p.contatto;
                        NS_CONTATTO_METHODS.executeAJAX(p);

                    } else {
                        if(home.NS_FENIX_PS.jSonPazienti.length == (Number(k) + 1) ) {
                            setTimeout(home.NS_WK_PS.caricaWk,300);
                        }
                        logger.error("tab home PS caso non previsto elaborazioniSuPiuContatti");
                    }



            }
            function callbackKO(err){
                var usernameLock = new RegExp(":(.*)").exec(err)[1];

                home.NOTIFICA.warning({message: "Pratica  "+ v.CARTELLA+ " bloccata da " + usernameLock + " , impossibile eseguire l'operazione ", title: "Attenzione", timeout: 7});
            }


        });
    },
     /**
     * Associa l'iden contatto ad un altro Paziente(iden_anag)
     * @param idenAnag
     * @param idenContatto
     * @param cognome
     * @param idenRicovero
     * @param codiceRicovero
     * @param iden_cdc
     * @param iden_pro
     * @param iden_lista
     * @param stato
     * @param chiuso
     * @param callback
     */
    associa: function (idenAnag, idenContatto, cognome, idenRicovero, codiceRicovero, iden_cdc, iden_pro, iden_lista, stato, chiuso,callback) {

        if (NS_FENIX_PS.hasAValue(idenContatto)) {
            var jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden(idenContatto, {assigningAuthorityArea: 'ps'});
        } else {
            logger.error("Iden contatto is undefined");
        }
        if (NS_FENIX_PS.hasAValue(idenAnag)) {
            var jsonAnag = NS_ANAGRAFICA.Getter.getAnagraficaById(idenAnag);
        } else {
            logger.error("IdenAnag is undefined");
        }

        var _JSON_ANAGRAFICA = NS_ANAGRAFICA.Getter.getAnagraficaById(idenAnag);
        var _PZ_SCONOSIUTO = cognome === 'SCONOSCIUTO';
        var _CHK_ANAGRAFICA = checkDatiFondamentali(_JSON_ANAGRAFICA, _PZ_SCONOSIUTO);



        if (cognome == "SCONOSCIUTO") {

            callback = function () {

                if(chiuso == 'S' && stato == 'DISCHARGED'){
                   var url =  'page?KEY_LEGAME=CARTELLA&IDEN_ANAG='+ idenAnag+'&IDEN_CONTATTO='+
                    idenContatto + '&IDEN_PROVENIENZA='+iden_pro+'&IDEN_CDC_PS='+iden_cdc+
                    '&IDEN_LISTA='+iden_lista+'&TEMPLATE=LISTA_ATTESA/ListaAttesaFooter.ftl&MENU_APERTURA=RIASSOCIA_CHIUSO';
                    home.NS_FENIX_TOP.apriPagina({url:url, fullscreen:true});

                }
                else{
                    home.NS_WK_PS.caricaWk();
                    home.NS_RIASSOCIA_PAZ.chiudiScheda();
                }
                //location.reload();

                /** @TODO : bisogna poi cancellare il paziente sconosciuto dall'anagrafica */
            }
        } else {
            if(typeof callback !== 'function') {
                callback = function () {
                    if(chiuso == 'S' && stato == "DISCHARGED"){
                        //var url =  'page?KEY_LEGAME=CARTELLA&IDEN_ANAG='+ idenAnag+'&IDEN_CONTATTO='+
                        //    idenContatto + '&IDEN_PROVENIENZA='+iden_pro+'&IDEN_CDC_PS='+iden_cdc+
                        //    '&IDEN_LISTA='+iden_lista+'&TEMPLATE=LISTA_ATTESA/ListaAttesaFooter.ftl&MENU_APERTURA=RIASSOCIA_CHIUSO';
                        //home.NS_FENIX_TOP.apriPagina({url:url, fullscreen:true});

                        NS_FENIX_PS.saveVerbale(idenContatto);

                    }
                    else{
                        home.NS_WK_PS.caricaWk();
                        home.NS_RIASSOCIA_PAZ.chiudiScheda();
                    }
                    //location.reload();

                }
            }
        }

         /*Anagrafica NON completa*/
         if (_CHK_ANAGRAFICA.length > 0)
         {
             logger.error("Inserimento Ricovero - Check Anagrafica - Anagrafica NON Completa - Campi da Valorizzare -> " + _CHK_ANAGRAFICA);
             home.DIALOG.si_no({
                 title: "Inserimento Ricovero - Anagrafica Incompleta",
                 msg:"Anagrafica INCOMPLETA! Per continuare Occorre valorizzare i campi: " + _CHK_ANAGRAFICA + ". Proseguire con la modifica dell\'anagrafica?",
                 cbkNo:function(){  },
                 cbkSi: function(){
                     home.NS_FENIX_TOP.apriPagina({
                             url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=E&IDEN_ANAG='+idenAnag+'&IDEN_CONTATTO='+idenContatto+'&IDEN_RICOVERO='+idenRicovero+'&IDEN_CDC='+iden_cdc+'&CODICE_RICOVERO='+codiceRicovero+'&IDEN_PRO='+iden_pro+'&IDEN_LISTA='+iden_lista+'&STATO='+stato+'&CHIUSO='+chiuso,id:'insAnag',fullscreen:true}
                     )

                 }
             });
         }
         /*Anagrafica completa*/
         else
         {
            /**Se c'e anche un contatto di ricovero debbo fare il movfe visit anche di esso */
            var db = $.NS_DB.getTool();
            var dbParams = {
                "iden_anagrafica": {v: idenAnag, t: "N"}
            };
            var xhr = db.select({
                datasource: "PS",
                id: "PS.CHK_CONTATTO_ADMITTED",
                parameter: dbParams
            });
            xhr.done(function (response) {

                if (response.result[0]["COUNT(IDEN)"] == 0 || home.NS_FENIX_PS.tab_sel === "GestioneEsito") {

                    if (NS_FENIX_PS.hasAValue(idenRicovero)) {

                        var jsonContattoRicovero = NS_DATI_PAZIENTE.getDatiContattobyIden(idenRicovero, {assigningAuthorityArea: 'adt'});

                        CONTROLLER_PS.MoveVisit({
                            jsonContatto: jsonContatto,
                            jsonAnag: jsonAnag,
                            callback: function () {
                                CONTROLLER_ADT.MoveVisit({
                                    jsonContatto: jsonContattoRicovero,
                                    jsonAnag: jsonAnag,
                                    callback: function () {
                                        callback();
                                    }
                                });
                            }
                        });
                    } else {
                        CONTROLLER_PS.MoveVisit({
                            jsonContatto: jsonContatto,
                            jsonAnag: jsonAnag,
                            callback: function () {
                                callback();
                            }
                        });
                    }
                } else {
                    home.NOTIFICA.error({message: "Il contatto selezionato &egrave; gi&agrave; in lista", title: "Error", timeout: 5});
                }
            });
            xhr.fail(function (data) {
                logger.error(JSON.stringify(data));
            })
         }
    },
    /**
     * Mette deleted='S' al record selezionato di PS_SCHEDE_XML
     * @param json ={iden: 01 , callback : function}
     */
    deleteRivalutazione: function (json) {
        var db = $.NS_DB.getTool();
        var dbParams = {
            "pIdenScheda": {v: json.iden, t: "N"},
            "p_result": {"d": 'O'}
        };

        if(!NS_FENIX_PS.hasAValue(json.deleted)) json.deleted=false;

        var xhr;

        if(json.deleted){
             xhr = db.call_procedure({
                datasource: "PS",
                id: "GEST_PS_SCHEDE_XML_TEST.DELETEROW",
                parameter: dbParams
            });
        }else{
             xhr = db.call_procedure({
                datasource: "PS",
                id: "GEST_PS_SCHEDE_XML_TEST.DISABLEROW",
                parameter: dbParams
            });
        }

        xhr.done(function (response) {
            var resp = response.p_result.split("|");
            if (resp[0] == 'OK') {
                //home.NOTIFICA.success({message: "Rimozione Avvenuta della scheda : ", timeout: 5, title: 'Success'});
                logger.info("deleteRivalutazione eseguita per iden scheda : " + resp[1]);
                json.callback();
            } else {
                //home.NOTIFICA.error({message: "Attenzione errore nella rimozione : " + resp[1], title: "Error"});
                logger.error("deleteRivalutazione" + resp[1]);
            }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("TAB_HOME_PS.deleteRivalutazione \n" + JSON.stringify(jqXHR) + "\n" + JSON.stringify(textStatus) +
                "\n" + JSON.stringify(errorThrown));
        });
    },
    /**
     * Cerco i PS associati all'utente, se sono piu d'uno creo un infoDialog per permettere la scelta.
     */
    selezionaPS: function () {


        var jsonParams = {
            datasource : 'PS',
            id :"",
            params : {},
            callbackOK : callbackOk
        };

        if (LIB.isValid(home) && LIB.isValid(home.basePC) && LIB.isValid(home.basePC.PS) && LIB.isValid(home.basePC.PS.TRIAGE_DEFAULT))
        {

            jsonParams.id = "CONTATTO.Q_DATI_CDC_PRONTO_SOCCORSO";
            jsonParams.params = { "iden_per": {"v": home.baseUser.IDEN_PER}, "cod_cdc": {"v": home.basePC.PS.TRIAGE_DEFAULT} };
        }
        else
        {
            jsonParams.id = "CONTATTO.Q_CDC_PRONTO_SOCCORSO";
            jsonParams.params = { "iden_per": {"v": home.baseUser.IDEN_PER} };

            logger.error("POSTAZIONE NON TROVATA SU PARAMETRI");

        }

        NS_FENIX_PS.tableInfoDialog = $(document.createElement("table")).attr({"id": "tblSelezione", "class": "tabledialog"});



        NS_CALL_DB.SELECT(jsonParams);

        function callbackOk (data){
            var resp = data.result;

            if (resp.length == 1) {
                $("#hIdenPs").val(resp[0].VALUE);
                $("#hStruttura").val(resp[0].STRUTTURA);
                $("#hIdenProvenienza").val(resp[0].IDEN_PROVENIENZA);

                home.baseUserLocation = {
                    "iden": resp[0].VALUE,
                    "descrizione": resp[0].DESCRIZIONE,
                    "cod_cdc": resp[0].COD_CDC,
                    "codice": resp[0].CDC_COD_DEC,
                    "struttura": resp[0].STRUTTURA,
                    "codice_struttura": resp[0].CODICE_STRUTTURA,
                    "iden_provenienza": resp[0].IDEN_PROVENIENZA,
                    "sub_codice_sezione": resp[0].SUB_CODICE_SEZIONE,
                    "sub_codice_struttura": resp[0].SUB_CODICE_STRUTTURA,
                    "codice_sts11": resp[0].CODICE_STS11,
                    "abilita_triage": resp[0].ABILITA_TRIAGE
                };

                NS_FENIX_PS.caricaJsonModuli(resp[0].VALUE);
                logger.info("Pronto soccorso scelto=" + resp[0].COD_CDC);
                NS_WK_PS.caricaWk();
            }
            else
            {
                $.each(resp, function (chiave, valore) {
                    NS_FENIX_PS.tableInfoDialog.append(
                        $(document.createElement("tr")).attr("id", "tr" + chiave)
                            .append($(document.createElement("td")).text(valore.DESCR))
                            .append($(document.createElement("td")).attr("class", "tdRadio")
                                .append($(document.createElement("input")).attr({"type": "radio", "name": "selezionePS",
                                    "value": valore.VALUE, "data-struttura": valore.STRUTTURA,
                                    "data-provenienza": valore.IDEN_PROVENIENZA, "data-codstruttura": valore.CODICE_STRUTTURA,
                                    "data-descr": valore.DESCR, "data-codcdc": valore.COD_CDC, "data-coddec": valore.CDC_COD_DEC,
                                    "data-subcodsezione": valore.SUB_CODICE_SEZIONE, "data-subcodstruttura": valore.SUB_CODICE_STRUTTURA,
                                    "data-codsts11": valore.CODICE_STS11, "data-triage": valore.ABILITA_TRIAGE})
                            )
                        )
                    );
                });
                $.dialog(NS_FENIX_PS.tableInfoDialog, {
                    id: "Dialog_selezionaPS",
                    title: "Seleziona Pronto Soccorso",
                    width: 500,
                    showBtnClose: true,
                    movable: true,
                    buttons: [
                        {label: "Ok", action: function (ctx) {
                            var radioChecked = $("td.tdRadio input:checked");
                            $("#hIdenPs").val(radioChecked.val());
                            $("#hStruttura").val(radioChecked.data("struttura"));
                            $("#hIdenProvenienza").val(radioChecked.data("provenienza"));

                            home.baseUserLocation = {
                                "iden": radioChecked.val(),
                                "descrizione": radioChecked.data("descr"),
                                "cod_cdc": radioChecked.data("codcdc"),
                                "codice": radioChecked.data("coddec"),
                                "struttura": radioChecked.data("struttura"),
                                "codice_struttura": radioChecked.data("codstruttura"),
                                "iden_provenienza": radioChecked.data("provenienza"),
                                "sub_codice_sezione": radioChecked.data("subcodsezione"),
                                "sub_codice_struttura": radioChecked.data("subcodstruttura"),
                                "codice_sts11": radioChecked.data("codsts11"),
                                "abilita_triage": radioChecked.data("triage")
                            };

                            if (radioChecked.val() != null) {
                                logger.info("Pronto soccorso scelto=" + home.baseUserLocation.cod_cdc);
                                NS_FENIX_PS.caricaJsonModuli(radioChecked.val());
                                NS_WK_PS.caricaWkListaAttesa();
                                NS_WK_PS.caricaWk();
                                ctx.data.close();
                            } else {
                                alert("Selezionare un pronto soccorso");
                            }
                        }}
                    ]
                });
            }
        }
    },
    caricaJsonModuli : function (iden) {
        home.NS_FUNZIONI_PS.caricaJsonModuli(iden);

    },

    saveVerbale : function (iden_contatto) {

        var db = $.NS_DB.getTool();
        var dbParams = {
            "PIDENCONTATTO": {v: iden_contatto, t: "N"},
            "PSTATO": {t: "V", d: "O"},
            "PIDENSCHEDA": {t: "N", d: "O"}
        };
        var xhr = db.call_procedure({
            datasource: "PS",
            id: "GEST_VERBALE_RIASSOCIA",
            parameter: dbParams
        });

        xhr.done(function (response) {

            if (response) {
                var stato = response.PSTATO;

                var idenScheda = response.PIDENSCHEDA;
                NS_FENIX_PS.firmaVerbale(iden_contatto,idenScheda ,stato, '{"N_COPIE":"1"}');
            } else {
                logger.error("GEST_VERBALE_RIASSOCIA" + JSON.stringify(response));
                false;
            }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error("GEST_VERBALE_RIASSOCIA \n" + JSON.stringify(jqXHR)+"\n"+JSON.stringify(textStatus)+
                "\n" + JSON.stringify(errorThrown));
            return false;
        });

    },


    firmaVerbale: function(iden_contatto,iden_scheda,stato,pConfig,p){

        var statoPrecedente = '';


        home.NS_FENIX_PRINT.caricaDocumento({"PRINT_REPORT":"BLANK", "PRINT_DIRECTORY": "1", "PRINT_PROMPT": "&promptpMessage=" + escape("CARICAMENTO ANTEPRIMA VERBALE")});

        home.FIRMA = $.extend({},home.FIRMA, home.FIRMA_PS);

        var prompts = "&promptpIdenContatto=" + iden_contatto + '&promptpBozza=N&promptpFirma=S' + '&promptpStatoVerbale=';
        prompts += stato;

        p = {
            "STAMPA" : {"PRINT_REPORT":"VERBALE_PS", "PRINT_DIRECTORY": "1", "PRINT_PROMPT": prompts},
            "FIRMA" : {}
        };

        p['FIRMA'].FIRMA_COMPLETA = false;
        p['FIRMA'].PRIMA_FIRMA = stato == 'F' ? false : true;//jsonData.hStatoVerbale == "F" ? false : true;
        p['FIRMA'].IDEN_VERSIONE =  iden_scheda;
        p['FIRMA'].IDEN_VERSIONE_PRECEDENTE = null; // iden parent della scheda xml attuale
        p['FIRMA'].TIPO_DOCUMENTO =  "VERBALE_PS";
        p['FIRMA'].TABELLA =  "PRONTO_SOCCORSO.PS_SCHEDE_XML";
        p['FIRMA'].KEY_CONNECTION = "PS";
        //p['FIRMA'].CALLBACK = function(){NS_FENIX_SCHEDA.chiudi({'refresh' : true});};



        logger.debug("Firma Verbale PS - NS_REGISTRAZIONE_FIRMA.firma - p -> " + JSON.stringify(p));

        home.NS_FENIX_PRINT.config = $.extend({},p,JSON.parse(home.baseGlobal["PRINT_VERBALE"]));



        if (typeof pConfig !== "undefined") {
            home.NS_FENIX_PRINT.config = $.extend({},home.NS_FENIX_PRINT.config,JSON.parse(pConfig));
        }

        logger.debug("home.NS_FENIX_PRINT.config -> " + JSON.stringify(home.NS_FENIX_PRINT.config));

        home.FIRMA.initFirma(p);

        home.NS_WK_PS.caricaWk();
        home.NS_RIASSOCIA_PAZ.chiudiScheda();
    },

    apriPrestazioniGiornaliere : function(){

        var table = $(document.createElement("table")).attr({"id": "ListaPrestazioni", "class": "tabledialog"})
            .append($(document.createElement("tr")).attr("id", "titoli")
                .append($(document.createElement("td")).text("Da data").css({"text-align": "center", "font-weight": "bold"}))
                .append($(document.createElement("td")).addClass("tdData").append($(document.createElement("input")).attr('id','daData').attr("valore","").attr('type','text').attr("class","datepicker").attr("readonly","readonly")



                ))
        );
        table.append(
            $(document.createElement("tr")).attr("id", "testi")
                .append($(document.createElement("td")).text('A data').css({"text-align": "justify", "font-weight": "bold"}))
                .append($(document.createElement("td")).addClass("tdData").append($(document.createElement("input")).attr('id','aData').attr("valore","").attr('type','text').attr("class","datepicker").attr("readonly","readonly")))

        );



        $.dialog(table,

            {title: "Prestazioni Giornaliere",
                buttons: [
                    {label: "Ok", action: function () {


                        NS_LOADING.showLoading();
                        var param = {
                            "PRINT_REPORT": "LISTA_PRESTAZIONI_GIORNALIERA",
                            "PRINT_DIRECTORY": "1",
                            "PRINT_PROMPT": "&promptpDataFine=" + $("#aData").attr("valore") + "&promptpDataInizio="+$("#daData").attr("valore")+"&promptpUsername="+home.baseUser.USERNAME,
                            "afterStampa": function (){ if (afterStampa) {afterStampa(); } }

                        };

                        home.NS_FENIX_PRINT.caricaDocumento(param);
                        $.dialog.hide();
                        param['beforeApri'] = home.NS_FENIX_PRINT.initStampa;


                        home.NS_FENIX_PRINT.apri(param);
                        NS_LOADING.hideLoading();

                    }},
                    {label: "Chiudi", action: function () {
                        $.dialog.hide();

                    }}
                ]
            }
        );

        NS_FENIX_PS.setDatePickerPrestazioni();

    },

    setDatePickerPrestazioni : function() {

        window.setTimeout(function(){

            //DATEPICKER campo A DATA

            $("#aData").Zebra_DatePicker({
                startWithToday: false,
                readonly_element: false,
                format: 'd/m/Y',
                inside: true,
                onSelect: function (data) {
                    data = moment(data, "DD/MM/YYYY").format("YYYYMMDD");

                    $("#aData").attr("valore", "" + data + "");
                }

            });

            //DATEPICKER campo DA DATA

            $("#daData").Zebra_DatePicker({
                startWithToday: false,
                readonly_element: false,
                format: 'd/m/Y',
                inside: true,
                onSelect: function (data) {
                    data = moment(data, "DD/MM/YYYY").format("YYYYMMDD");

                    $("#daData").attr("valore", "" + data + "");
                }

            });

            $("#aData, #daData").val("");

        }, 100);
    }
};