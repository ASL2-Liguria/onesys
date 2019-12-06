/**
 * Created by matteo.pipitone on 14/04/2015.
 */

var NS_ANAGRAFICA_SALVATAGGIO = {
    IDEN_ANAGRAFICA : null,
    jsonDati : null,
    beforeSave : function (){return true},
    //differenzio callback da successSave in modo tale da tenerli divisi, successave sempre lo stesso, callBack diverse che lo richiamano
    callback : null,
    successSave : function (){return true},
    codiceFiscale : null,
    paz_sconosciuto:null,


    registra: function (json) {
        NS_ANAGRAFICA_SALVATAGGIO.jsonDati = json;
        logger.debug(NS_ANAGRAFICA_SALVATAGGIO.beforeSave);
        logger.debug(NS_ANAGRAFICA_SALVATAGGIO.callback);
        logger.debug(NS_ANAGRAFICA_SALVATAGGIO.successSave);
        logger.debug('JSON -> ' + JSON.stringify(json));
        /**
         *    json.metodo,
         json.codice_fiscale,
         json.sesso,
         json.data_nascita,
         json.cognome,
         json.nome,
         json.idRis,
         json.comune_nascita,
         json.indirizzo_residenza,
         json.civico_residenza,
         json.comune_residenza,
         json.provincia_residenza,
         json.cap_residenza,
         json.indirizzo_domicilio,
         json.civico_domicilio,
         json.comune_domicilio,
         json.provincia_domicilio,
         json.cap_domicilio,
         json.cod_reg_res,
         json.cod_reg,
         json.cod_asl_res,
         json.cod_reg_dom,
         json.cod_asl_dom,
         json.medico_base,
         json.celllulare,
         json.mail,
         json.stato_civile,
         json.livello_istruzione,
         json.professione,
         json.cittadinanza,
         json.stp,
         json.scadenzaStp ,
         json.eni,
         json.scadenzaENI,
         json.url_template
         */


        if(true != NS_ANAGRAFICA_SALVATAGGIO.beforeSave()) {
            home.NS_LOADING.hideLoading();
            logger.error("beforeSave false");
            return false;
        }
        NS_LOADING.showLoading({"timeout": "0", "testo": "SALVATAGGIO ANAGRAFICA", "loadingclick": function () {
            home.NS_LOADING.hideLoading();
        }});


        $.get( json.url_template, function (value) {

            var metodo;
            //se c'� l'idRis metodo = 'MODIFICA'.
            if(typeof json.idRis != 'undefined' && json.idRis != '' && json.idRis != null){
                metodo = 'MODIFICA';

            }else{
                metodo = 'INSERIMENTO';
            }

            logger.debug("METODO ->" +metodo);

            var data = [
                {
                    "metodo"           : metodo,
                    "codiceFiscale"    : json.codice_fiscale,
                    "sesso"            : json.sesso,
                    "data"             : json.data_nascita,
                    "cognome"          : json.cognome.toUpperCase(),
                    "nome"             : json.nome.toUpperCase(),
                    "idRis"            : json.idRis,
                    "comuneNascita"    : json.comune_nascita,
                    "indirizzoRes"     : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.indirizzo_residenza.toUpperCase(),metodo),
                    "civicoRes"        : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.civico_residenza,metodo),
                    "comuneRes"        : json.comune_residenza,
                    "provinciaRes"     : json.provincia_residenza,
                    "capRes"           : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.cap_residenza,metodo),
                    "indirizzoDom"     : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.indirizzo_domicilio.toUpperCase(),metodo),
                    "civicoDom"        : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.civicoDomicilio,metodo),
                    "comuneDom"        : json.comune_domicilio,
                    "provinciaDom"     : json.provincia_domicilio,
                    "capDom"           : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.cap_domicilio,metodo),
                    "codRegRes"        : json.cod_reg_res,
                    "codReg"           : json.cod_reg,
                    "codUsl"           : json.cod_asl_res,
                    "codRegDom"        : json.cod_reg_dom,
                    "cuslDom"          : json.cod_asl_dom,
                    "medicoBase"       : json.medico_base,
                    "cellulare"        : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.cellulare,metodo),
                    "email"            : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.mail,metodo),
                    "statoCivile"      : json.stato_civile,
                    "livelloIstruzione": json.livello_istruzione,
                    "professione"      : json.professione,
                    "cittadinanza"     : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.cittadinanza,metodo),
                    "telefonoRes"      : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.telefono_residenza,metodo),
                    "numeroTesseraSanitaria" : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.tessera_sanitaria,metodo),
                    "scadenzaTesseraSanitaria" : NS_ANAGRAFICA_SALVATAGGIO.setCampoNULL(json.tessera_sanitaria_scadenza,metodo),
                    "identificativoRemoto" : json.identificativoRemoto

                }
            ];

            var xml = $.templates(value).render(data);

            if(( NS_ANAGRAFICA_SALVATAGGIO.codice_fiscale != json.codice_fiscale) && (NS_ANAGRAFICA_SALVATAGGIO.paz_sconosciuto != 'S'|| NS_ANAGRAFICA_SALVATAGGIO.paz_sconosciuto == null )  && json.identificativoRemoto == ''  ){
                home.NS_LOADING.hideLoading();

                $.dialog("Attenzione codice fiscale previsto = " + NS_ANAGRAFICA_SALVATAGGIO.codice_fiscale + " e codice fiscale presente = " + json.codice_fiscale + ' Procedere comunque?' , {
                    id: "DialogCodicefiscale",
                    title: "Avvertimento codice fiscale",
                    width: 800,
                    showBtnClose: true,
                    movable: true,
                    buttons: [
                        {
                            label: "No", action: function (ctx) {
                            ctx.data.close();
                        }
                        },
                        {
                            label: "Si", action: function (ctx) {

                            ctx.data.close();

                            NS_LOADING.showLoading({"timeout": "0", "testo": "SALVATAGGIO ANAGRAFICA", "loadingclick": function () {
                                home.NS_LOADING.hideLoading();
                            }});
                            registraDB();

                        }
                        }
                    ]
                });

            }else{
                registraDB();
            }
            function registraDB() {
                $.NS_DB.getTool({setup_default: {datasource: 'WHALE'}}).call_procedure({
                    id       : 'ANAGRAFICA_FROM_FENIX.CALL_ANAG_START_FROM_FENIX',
                    //ANAGRAFICA_FROM_FENIX_NEW
                    parameter: {
                        "vXML"        : {t: 'C', v: xml  },
                        p_result      : { t: 'V', d: 'O' },
                        'STP'         : {t: 'V', v: json.stp},
                        'SCADENZA_STP': {t: 'V', v: json.scadenzaStp},
                        'ENI'         : {t: 'V', v: json.eni},
                        'SCADENZA_ENI': {t: 'V', v: json.scadenzaENI},
                        'GIUBILEO'         : {t: 'V', v: json.giubileo},
                        'SCADENZA_GIUBILEO': {t: 'V', v: json.scadenzaGiubileo}
                    }
                })
                    .done(function (data) {

                        //alert(data.p_result);
                        var xmlResponse = $.parseXML(data.p_result);
                        var $xmlResponse = $(xmlResponse);
                        var warn = $xmlResponse.find("WARNING").has("DESCRIZIONE").text();
                        var idRis = $xmlResponse.find("ID_RIS").text();
                        var error = $xmlResponse.find("ERRORE").find("DESCRIZIONE").text();

                        if(NS_ANAGRAFICA_SALVATAGGIO.hasAValue(error)) {
                            logger.error('Error -> ' + error);
                            home.NS_LOADING.hideLoading();
                            home.NOTIFICA.error({message: "Attenzione errore nell'inserimento/modifica", title: "Error"});

                        } else {
                            if(NS_ANAGRAFICA_SALVATAGGIO.hasAValue(warn)){
                                logger.error('Err -> ' + warn);
                                home.NOTIFICA.warning({ message: warn, title: "Attenzione"});
                            }

                            if(NS_ANAGRAFICA_SALVATAGGIO.hasAValue(idRis)) {
                                home.NOTIFICA.success({message: "Paziente inserito/modificato in anagrafica", timeout: 4, title: 'Success'});
                                //imposto l'iden anagrafica della pagina
                                NS_ANAGRAFICA_SALVATAGGIO.IDEN_ANAGRAFICA = idRis;

                                if(typeof NS_ANAGRAFICA_SALVATAGGIO.callback == 'function'){
                                    NS_ANAGRAFICA_SALVATAGGIO.callback();
                                }else{
                                    NS_ANAGRAFICA_SALVATAGGIO.successSave();

                                }

                            } else {
                                logger.error("NS_ANAGRAFICA_SALVATAGGIO.registra NS_DB.done idRis is null: " + idRis);
                                home.NS_LOADING.hideLoading();
                            }
                        }
                    })
                    .fail(function (jqXHR) {
                        home.NS_LOADING.hideLoading();
                        logger.error(JSON.stringify(jqXHR));
                        home.NOTIFICA.error({message: "Errore salvataggio anagrafica contattare l'assistenza", title: "Error"});
                    });
            }


        });


    },
    //non utilizzato
    getJson :function (json) {
        $.get("js/PS/SchedaAnagrafica/XMLAnagrafica.txt", function (value) {
            /**
             *    json.metodo,
             json.codice_fiscale,
             json.sesso,
             json.data_nascita,
             json.cognome,
             json.nome,
             json.idRis,
             json.comune_nascita,
             json.indirizzo_residenza,
             json.civico_residenza,
             json.comune_residenza,
             json.provincia_residenza,
             json.cap_residenza,
             json.indirizzo_domicilio,
             json.civico_domicilio,
             json.comune_domicilio,
             json.provincia_domicilio,
             json.cap_domicilio,
             json.cod_reg_res,
             json.cod_reg,
             json.cod_asl_res,
             json.cod_reg_dom,
             json.cod_asl_dom,
             json.medico_base,
             json.celllulare,
             json.mail,
             json.stato_civile,
             json.livello_istruzione,
             json.professione,
             json.cittadinanza
             */

            //se c'� l'idRis metodo = 'MODIFICA'.
            if(typeof json.idRis != 'undefined' && json.idRis != '' && json.idRis != null){
                json.metodo = 'MODIFICA';
            }else{
                json.metodo = 'INSERIMENTO';
            }

            var data = [
                {
                    "metodo"           : json.metodo,
                    "codiceFiscale"    : json.codice_fiscale,
                    "sesso"            : json.sesso,
                    "data"             : json.data_nascita,
                    "cognome"          : json.cognome,
                    "nome"             : json.nome,
                    "idRis"            : json.idRis,
                    "comuneNascita"    : json.comune_nascita,
                    "indirizzoRes"     : json.indirizzo_residenza,
                    "civicoRes"        : json.civico_residenza,
                    "comuneRes"        : json.comune_residenza,
                    "provinciaRes"     : json.provincia_residenza,
                    "capRes"           : json.cap_residenza,
                    "indirizzoDom"     : json.indirizzo_domicilio,
                    "civicoDom"        : json.civicoDomicilio,
                    "comuneDom"        : json.comune_domicilio,
                    "provinciaDom"     : json.provincia_domicilio,
                    "capDom"           : json.cap_domicilio,
                    "codRegRes"        : json.cod_reg_res,
                    "codReg"           : json.cod_reg,
                    "codUsl"           : json.cod_asl_res,
                    "codRegDom"        : json.cod_reg_dom,
                    "cuslDom"          : json.cod_asl_dom,
                    "medicoBase"       : json.medico_base,
                    "cellulare"        : json.cellulare,
                    "email"            : json.mail,
                    "statoCivile"      : json.stato_civile,
                    "livelloIstruzione": json.livello_istruzione,
                    "professione"      : json.professione,
                    "cittadinanza"     : json.cittadinanza
                }
            ];

            return  $.templates(value).render(data);
        });
    },
    hasAValue : function(value){
        return (("" !== value)&&(undefined !== value)&&(null !== value));
    },
    registraDatiAnagraficiContattoFromIDEN : function (idenContatto, jsonDati) {
        var sito =$("#SITO").val().toLowerCase();

        var jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden(idenContatto, {contattiAssistenziali: 1, contattiGiuridici: 1, assigningAuthorityArea:  sito});
        NS_ANAGRAFICA_SALVATAGGIO.registraDatiAnagraficiContattoFromJSON(jsonContatto,jsonDati, sito );
    },
    registraDatiAnagraficiContattoFromJSON : function (jsonContatto, jsonDati , sito, showMessage ) {
         if(typeof sito == 'undefined' || sito == null){
             sito = $("#SITO").val().toLowerCase();
         }
        showMessage = typeof(showMessage)  !== 'undefined' || showMessage == null ? showMessage:'S';
        /**
         *    json.metodo,
         json.codice_fiscale,
         json.sesso,
         json.data_nascita,
         json.cognome,
         json.nome,
         json.idRis,
         json.comune_nascita,
         json.indirizzo_residenza,
         json.civico_residenza,
         json.comune_residenza,
         json.provincia_residenza,
         json.cap_residenza,
         json.indirizzo_domicilio,
         json.civico_domicilio,
         json.comune_domicilio,
         json.provincia_domicilio,
         json.cap_domicilio,
         json.cod_reg_res,
         json.cod_reg,
         json.cod_asl_res,
         json.cod_reg_dom,
         json.cod_asl_dom,
         json.medico_base,
         json.celllulare,
         json.mail,
         json.stato_civile,
         json.livello_istruzione,
         json.professione,
         json.cittadinanza,
         json.stp,
         json.scadenzaStp ,
         json.eni,
         json.scadenzaENI
         json.tessera_sanitaria
         json.tessera_sanitaria_scadenza
         json.telefono_residenza
         */
        /*alert(jsonContatto );
        alert(jsonDati);  */
        var p = {"contatto" : NS_ANAGRAFICA_SALVATAGGIO.setMetadatiAnagrafica(jsonContatto, jsonDati), "hl7Event" : "A08", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Modifica Ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Modifica Ricovero"}, "cbkSuccess" : function () {
            home.NS_LOADING.hideLoading();

            if(showMessage == 'S') {
                home.$.dialog('I dati anagrafici sono stati aggiornati sulle seguenti cartelle : ' + NS_CONTATTO_METHODS.contatto.codice.codice + ' aperta il ' + moment(NS_CONTATTO_METHODS.contatto.dataInizio, 'YYYYMMDDhh:mm').format('hh:mm DD/MM/YYYY') + ' da ' +  NS_CONTATTO_METHODS.contatto.contattiGiuridici[0].cdc.descrizione  ,
                    {title: "Attenzione",
                        buttons: [
                            {label: "OK", action: function () {
                                home.$.dialog.hide();
                                if(typeof NS_ANAGRAFICA_SALVATAGGIO == 'undefined'){
                                    try {
                                        logger.error("NS_ANAGRAFICA_SALVATAGGIO � undefined, provo a eseguire  home.NS_ANAGRAFICA_SALVATAGGIO");
                                        home.NS_ANAGRAFICA_SALVATAGGIO.successSave();
                                    }catch(e){
                                        logger.error("home.NS_ANAGRAFICA_SALVATAGGIO � undefined!");
                                        home.$.dialog.hide();
                                        home.NOTIFICA.error({message: "Attenzione errore", title: "Error"});
                                    }
                                }else{
                                    NS_ANAGRAFICA_SALVATAGGIO.successSave();
                                }

                            }}
                        ]
                    });
            } else{
               // alert("eseguo -> " + NS_ANAGRAFICA_SALVATAGGIO.successSave );
                NS_ANAGRAFICA_SALVATAGGIO.successSave();

            }



        }
            , "scope"
        :sito+'/'};

        NS_CONTATTO_METHODS.updatePatientInformation(p);
    },
    setMetadatiAnagrafica:function(_json, jsonDati){
        logger.debug( " setMetadatiAnagrafica jsonContatto -> " +JSON.stringify(_json));
        logger.debug( " setMetadatiAnagrafica jsonDati -> " + JSON.stringify(jsonDati));
        /*
         jsonDati.cognome;
         jsonDati.nome;
         jsonDati.sesso;
         jsonDati.data_nascita;
         jsonDati.comune_nascita;
         jsonDati.codice_fiscale;
         jsonDati.stp;
         jsonDati.scadenzaSTP;
         jsonDati.eni;
         jsonDati.scadenzaENI;
         jsonDati.stato_civile
         jsonDati.livello_istruzione
         jsonDati.tessera_sanitaria
         jsonDati.tessera_sanitaria_scadenza
         jsonDati.comune_residenza
         jsonDati.cod_reg_res
         jsonDati.cod_asl_res
         jsonDati.cap_residenza
         jsonDati.provincia_residenza
         jsonDati.indirizzo_residenza
         jsonDati.telefono_residenza;
         jsonDati.domicilio_cap;
         jsonDati.domicilio_indirizzo;
         jsonDati.cittadinanza = [{codice:codice , descrizione:descrizione},{codice:codice , descrizione:descrizione}]
        */
        var stp = (typeof jsonDati.stp != 'undefined' && jsonDati.stp != '') ?  jsonDati.stp : null;
        if(stp != null  && jsonDati.stp.length !== 16){
            stp = null;
        }
        var eni = (typeof jsonDati.eni != 'undefined' && jsonDati.eni != '') ?  jsonDati.eni : null;
        if(eni != null  && jsonDati.eni.length !== 16){
            eni = null;
        }
        var giubileo = (typeof jsonDati.giubileo != 'undefined' && jsonDati.giubileo != '') ?  jsonDati.giubileo : null;
        if(giubileo != null  && jsonDati.giubileo.length !== 16){
            giubileo = null;
        }
        _json.mapMetadatiString['ANAG_COGNOME'] =  jsonDati.cognome.toUpperCase();
        _json.mapMetadatiString['ANAG_NOME'] = jsonDati.nome.toUpperCase();
        _json.mapMetadatiString['ANAG_SESSO'] = jsonDati.sesso;
        _json.mapMetadatiString['ANAG_DATA_NASCITA'] = jsonDati.data_nascita;
        _json.mapMetadatiString['ANAG_COMUNE_NASC'] = jsonDati.comune_nascita;
        _json.mapMetadatiString['ANAG_COD_FISC'] = jsonDati.codice_fiscale;
        _json.mapMetadatiString['ANAG_TESSERA_SANITARIA'] = jsonDati.tessera_sanitaria;
        _json.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA'] = jsonDati.tessera_sanitaria_scadenza;
        _json.mapMetadatiString['STP'] = stp;
        _json.mapMetadatiString['SCADENZA_STP'] = jsonDati.scadenzaStp;
        _json.mapMetadatiString['ENI'] = eni;
        _json.mapMetadatiString['SCADENZA_ENI'] = jsonDati.scadenzaENI;
        _json.mapMetadatiString['GIUBILEO'] = giubileo;
        _json.mapMetadatiString['SCADENZA_GIUBILEO'] = jsonDati.scadenzaGiubileo;
        _json.mapMetadatiCodifiche['STATO_CIVILE']= {codice:null,id: jsonDati.stato_civile };
        _json.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TITOLO_STUDIO']= {codice:null,id: jsonDati.livello_istruzione};

        // residenza
        _json.mapMetadatiString['ANAG_RES_CODICE_ISTAT'] =jsonDati.comune_residenza;
        _json.mapMetadatiString['ANAG_RES_REGIONE'] =jsonDati.cod_reg_res;
        _json.mapMetadatiString['ANAG_RES_ASL'] =jsonDati.cod_asl_res;
        _json.mapMetadatiString['ANAG_RES_CAP'] =jsonDati.cap_residenza;
        _json.mapMetadatiString['ANAG_RES_PROV'] =jsonDati.provincia_residenza;
        _json.mapMetadatiString['ANAG_RES_INDIRIZZO'] =jsonDati.indirizzo_residenza;
        _json.mapMetadatiString['ANAG_TELEFONO'] =jsonDati.telefono_residenza;

        //domicilio
        _json.mapMetadatiString['ANAG_DOM_INDIRIZZO'] = jsonDati.domicilio_indirizzo;
        _json.mapMetadatiString['ANAG_COD_REG'] = jsonDati.cod_reg;
        _json.mapMetadatiString['ANAG_DOM_CAP'] = jsonDati.domicilio_cap;

        $.each(jsonDati.cittadinanza, function (k,v) {
            if(k == 0){
                _json.mapMetadatiString['ANAG_CITTADINANZA_ID'] = v.codice;
                _json.mapMetadatiString['ANAG_CITTADINANZA_DESCR'] = v.descrizione;
            }else{
                _json.mapMetadatiString['ANAG_CITTADINANZA_'+k+'_ID'] = v.codice != '' ?  v.codice : null;
                _json.mapMetadatiString['ANAG_CITTADINANZA_'+k+'_DESCR'] = v.descrizione != '' ?  v.descrizione : null;
            }

        });


        return _json;
    },
    setCampoNULL : function (value,metodo){
        if(value == '' && metodo === 'MODIFICA'){return 'NULL';}else{return value;}
    },
    /**
     * params
     * idenContatto
     * [sito] : default 'PS'
     * return JSON
     * */
    getJsonDatiFromIdenContatto : function (idenContatto,sito) {
        if(idenContatto == null || typeof idenContatto == 'undefined'){
            alert(idenContatto  + ' Non definito o null' );
            return {"message": 'valorizzare correttamente l\' idenContatto -> '}
        }
        var jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden(idenContatto, {contattiAssistenziali: 1, contattiGiuridici: 1, assigningAuthorityArea:  sito});
        return NS_ANAGRAFICA_SALVATAGGIO.getJsonDatiFromJsonMetadati(jsonContatto)
    },

    getJsonDatiFromJsonMetadati : function (jsonContatto) {


        var json =  {
            codice_fiscale     : jsonContatto.mapMetadatiString['ANAG_COD_FISC'],
            cognome            : jsonContatto.mapMetadatiString['ANAG_COGNOME'],
            sesso              : jsonContatto.mapMetadatiString['ANAG_SESSO'],
            data_nascita       : jsonContatto.mapMetadatiString['ANAG_DATA_NASCITA'],
            nome               : jsonContatto.mapMetadatiString['ANAG_NOME'],
            comune_nascita     : jsonContatto.mapMetadatiString['ANAG_COMUNE_NASC'],
            indirizzo_residenza: jsonContatto.mapMetadatiString['ANAG_RES_INDIRIZZO'],
            comune_residenza   : jsonContatto.mapMetadatiString['ANAG_RES_CODICE_ISTAT'],
            provincia_residenza: jsonContatto.mapMetadatiString['ANAG_RES_PROV'],
            cap_residenza      : jsonContatto.mapMetadatiString['ANAG_RES_CAP'],
            indirizzo_domicilio: jsonContatto.mapMetadatiString['ANAG_DOM_INDIRIZZO'],
            cap_domicilio      : jsonContatto.mapMetadatiString['ANAG_DOM_CAP'],
            cod_reg_res        : jsonContatto.mapMetadatiString['ANAG_RES_REGIONE'],
            cod_reg            : jsonContatto.mapMetadatiString['ANAG_COD_REG'],
            cod_asl_res        : jsonContatto.mapMetadatiString['ANAG_RES_ASL'],
            cod_reg_dom        : jsonContatto.mapMetadatiString['ANAG_RES_ASL'],
            stato_civile       : jsonContatto.mapMetadatiCodifiche['STATO_CIVILE'].id ,
            livello_istruzione : jsonContatto.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TITOLO_STUDIO'].id,
            stp                : jsonContatto.mapMetadatiString['STP'],
            scadenzaStp        : jsonContatto.mapMetadatiString['SCADENZA_STP'],
            eni                : jsonContatto.mapMetadatiString['ENI'],
            scadenzaENI        : jsonContatto.mapMetadatiString['SCADENZA_ENI'],
            tessera_sanitaria  : jsonContatto.mapMetadatiString['ANAG_TESSERA_SANITARIA'],
            tessera_sanitaria_scadenza : jsonContatto.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA'],
            telefono_residenza : jsonContatto.mapMetadatiString['ANAG_TELEFONO'],
            cittadinanza : {}

        };
        var cittadinanza = {};
        $.extend(cittadinanza, {codice:jsonDati.mapMetadatiString['ANAG_CITTADINANZA_ID'] , descrizione:jsonDati.mapMetadatiString['ANAG_CITTADINANZA_DESCR']});
        for (var i = 0; i<3; i++){
            if((jsonDati.mapMetadatiString['ANAG_CITTADINANZA_'+i+'_ID']) != ''){
                $.extend(cittadinanza, {codice:jsonDati.mapMetadatiString['ANAG_CITTADINANZA_'+i+'_ID'] , descrizione:jsonDati.mapMetadatiString['ANAG_CITTADINANZA_'+i+'_DESCR']});
            }

        }
        $.extend(json.cittadinanza,cittadinanza);

        return json;
    },
    getJsonDatiFromJsonContatto : function (jsonContatto) {

        var jSonAnag = jsonContatto.anagrafica;

        var json =  {
            codice_fiscale     : jSonAnag.codiceFiscale,
            cognome            : jSonAnag.cognome,
            sesso              : jSonAnag.sesso,
            data_nascita       : jSonAnag.dataNascita.substring(0,8),
            nome               : jSonAnag.nome,
            comune_nascita     : jSonAnag.comuneNascita.id,
            provincia_domicilio: jSonAnag.comuneDomicilio.provincia.descrizione,
            indirizzo_residenza: jSonAnag.comuneResidenza.indirizzo,
            comune_residenza   : jSonAnag.comuneResidenza.id,
            provincia_residenza: jSonAnag.comuneResidenza.id.codice,
            cap_residenza      : jSonAnag.comuneResidenza.cap,
            indirizzo_domicilio: jSonAnag.comuneDomicilio.indirizzo,
            cap_domicilio      : jSonAnag.comuneDomicilio.cap,
            cod_reg_res        : jSonAnag.comuneResidenza.regione.codice,
            cod_reg            : jsonContatto.mapMetadatiString['ANAG_COD_REG'],
            cod_asl_res        : jSonAnag.comuneResidenza.asl.codice,
            cod_reg_dom        : jSonAnag.comuneDomicilio.asl.codice,
            stato_civile       : jSonAnag.statoCivile.id ,
            livello_istruzione : jSonAnag.titoloStudio.id,
            stp                : jSonAnag.stp.codice,
            scadenzaStp        : jSonAnag.stp.dataScadenza,
            eni                : jSonAnag.eni.codice,
            scadenzaENI        : jSonAnag.eni.dataScadenza,
            tessera_sanitaria  : jSonAnag.tesseraSanitaria,
            tessera_sanitaria_scadenza : jSonAnag.tesseraSanitariaScadenza,
            telefono_residenza : jSonAnag.telefono,
            cittadinanza : {}

        };
        var cittadinanza = {};
        $.each(jSonAnag.cittadinanze, function(i){
            $.extend(cittadinanza, {codice:jSonAnag.cittadinanze[i].id , descrizione:null});

        });

        $.extend(json.cittadinanza,cittadinanza);

        return json;
    },
    getJsonDatiFromAnag : function (idenContatto) {
        if(idenContatto == null || typeof idenContatto == 'undefined'){
            alert(idenContatto  + ' Non definito o null' );
            return {"message": 'valorizzare correttamente l\' idenContatto -> '}
        }
        var jsonContatto = NS_DATI_PAZIENTE.getDatiContattobyIden(idenContatto, {contattiAssistenziali: 1, contattiGiuridici: 1, assigningAuthorityArea:  sito});
        return NS_ANAGRAFICA_SALVATAGGIO.getJsonDatiFromJsonContatto(jsonContatto);
    }

};
