var FIRMA_RIS=
{
    init:function(){},
    setDati:function(dati){
        this.dati = dati;
        NS_FENIX_FIRMA.LOGGER.debug("Dati settati: "+JSON.stringify(this.dati));
    },
    initFirma:function(params){
        $("#fldFunzioniFirma").show();
        $("#fldFunzioniFirmaRemota").hide();
        $("#fldFunzioniSISS").hide();
        $("#fldFunzioniFirmaGrafometrica").hide();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniStampa").hide();
        $("#fldFunzioniRitornaWk").hide();
        if(this.dati.progressivo == 0){
            $('#butFirmaAnnullativo').hide();
        }
        return true;
    },
    initValida:function(params){
        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniFirmaRemota").hide();
        $("#fldFunzioniValida").show();
        $("#fldFunzioniStampa").hide();
        $("#fldFunzioniRitornaWk").hide();
        $("#fldFunzioniSISS").hide();
        $("#fldFunzioniFirmaGrafometrica").hide();
        if(LIB.isValid(home.baseUser.DEFINITIVO_SENZA_PWD) && home.baseUser.DEFINITIVO_SENZA_PWD=='S')
        {
            $("#lblPassword").hide();
            $("#txtPassword").hide();
        }
        if(LIB.isValid(home.NS_VALID_MULTIPLA) && home.NS_VALID_MULTIPLA.multiPin!=null)
        {
            $("#txtPassword").val(home.NS_VALID_MULTIPLA.multiPin);
        }
        return true;
    },
    initAnteprima:function(){
        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniFirmaRemota").hide();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniStampa").show();
        $("#fldFunzioniRitornaWk").hide();
        $("#fldFunzioniSISS").hide();
        $("#fldFunzioniFirmaGrafometrica").hide();
        return true;
    },
    beforeValida:function(param){return true;},
    valida:function (param){
        var $this = this;
        if(!this.beforeValida(param)){NS_FENIX_FIRMA.LOGGER.warn("beforeValida return false");return false;}

        if(LIB.isValid(home.baseUser.DEFINITIVO_SENZA_PWD) && LIB.ToF(home.baseUser.DEFINITIVO_SENZA_PWD))
        {
            $this.archiviaDocumento();
        }
        else
        {
            var param = { "p_utente": baseUser.USERNAME, "p_pwd": $this.getPsw() };
            toolKitDB.checkUserPsw("SP_CHECK_USER_PSW", "CONFIG_WEB", param, function (response)
            {

                if (LIB.isValid(response.p_result))
                {
                    var resp = response.p_result.toString().split("$")[0];
                    var msg = response.p_result.toString().split("$")[1];

                    switch (resp)
                    {
                        case "OK":
                            if(LIB.isValid(home.NS_VALID_MULTIPLA))
                            {
                                home.NS_VALID_MULTIPLA.multiPin  = $("#txtPassword").val();
                            }
                            $this.archiviaDocumento();
                            break;
                        default:
                            NOTIFICA.error({
                                message: msg,
                                title: "Error!",
                                timeout: 3,
                                width: 300
                            });

                            break;
                    }
                }
                else
                {
                    NS_FENIX_FIRMA.LOGGER.error("valida - checkUserPsw error: " + response);
                    $this.koValida(response);
                }
            });
        }
    },
    okValida:function(resp){},
    koValida:function(resp){},
    beforeFirma:function(param){
        var idFromSmartcard = appletFenix.getSmartCardID();

        if(baseUser.ID_SMART_CARD != idFromSmartcard)
        {
            NOTIFICA.error({
                message: "Smart Card non associata all'utente loggato. Verificare!",
                title: "Error!",
                timeout: 3,
                width: 200
            });
            return false;
        }
        if(baseUser.IDEN_PER != home.CONSOLE.ref.sx.find('#h-txtPrimoMedico').val())
        {
            NOTIFICA.error({
                message: "Medico Refertanta diverso dall'utente loggato. Verificare",
                title: "Error!",
                timeout: 3,
                width: 200
            });
            return false;
        }

        return true;
    },
    firma: function (param) {
        if(!this.beforeFirma(param)){NS_FENIX_FIRMA.LOGGER.warn("beforeFirma return false");return false;}
        var resp = appletFenix.firma(param['pin']);
        if(resp.status =='OK'){
            this.okFirma(resp);
        }else{
            this.koFirma(resp);
        }
    },
    okFirma:function(resp){
        NS_FENIX_FIRMA.LOGGER.info('okFirma : Documento firmato correttamente.');
        this.archiviaDocumento(resp);
    },
    koFirma:function(resp){
        NS_FENIX_FIRMA.LOGGER.error('koFirma : '+resp.message);
        NOTIFICA.error({
            message: resp.message,
            title: "Error!",
            timeout: 3,
            width: 300
        });
    },
    firmaAnnullativa:function(param){
        var params = {
            "iden_referto": this.getDati("iden_referto"),
            "iden_cdc": this.getDati("iden_cdc"),
            "iden_versione_referto": this.getDati("iden_versione_referto"),
            "progressivo": this.getDati("progressivo")
        };
        params["PRINT_DIRECTORY"]= params.iden_cdc;
        params["PRINT_REPORT"]= "REFERTO_ANNULLATIVO";
        params["PRINT_SF"]= "{REFERTI_VERSIONE.IDEN}=" +params.iden_versione_referto;
        params["OPERAZIONE"]= "D";
        NS_FENIX_FIRMA.LOGGER.info("Settata URL annullativo");
        this.dati["OPERAZIONE"]="A";
        home.NS_FENIX_PRINT.caricaDocumento(params);
        this.firma(param);
    },
    getDatiArchivia:function(resp){
        var $this = this;
        var jsonArchivia = {};
        jsonArchivia.sito = NS_FENIX_TOP.sito;
        jsonArchivia.cdc = $this.getDati('iden_cdc');
        /*jsonArchivia.hashFile = NS_FENIX_PRINT.appletFenix.getDocumentMd5(); */
        jsonArchivia.nomeFile = $this.getDati('iden_versione_referto');
        jsonArchivia.nomeFile += ($this.getDati('OPERAZIONE')=="D" || $this.getDati('OPERAZIONE')=="A")?$this.P7M_EXT:$this.PDF_EXT;
        NS_FENIX_FIRMA.LOGGER.debug("archiviaDocumento con parametri: " + JSON.stringify(jsonArchivia));
        jsonArchivia.fileBase64 = appletFenix.getDocumentBase64();
        return jsonArchivia;
    },
    archiviaDocumento: function (resp) {
        var $this = this;
        $.support.cors = true;
        $.ajax({
            url: baseGlobal.PERCORSO_FILE_SERVER_UPLOAD_REFERTI,
            type: "POST",
            data: $this.getDatiArchivia(resp),
            cache: false,
            dataType: "json",
            success: function (resp)
            {
                (resp.status == "OK")?$this.okArchiviaDocumento(resp):$this.koArchiviaDocumento(resp);
            },
            error: function ()
            {
                $this.koArchiviaDocumento({message:'Errore comunicazione con FileServer.'});
            }
        });
    },
    okArchiviaDocumento:function(resp){
        NS_FENIX_FIRMA.LOGGER.info("okArchiviaDocumento : Documento archiviato correttamente.");
        this.attivaVersione(resp);
    },
    koArchiviaDocumento:function(resp){
        logger.error("koArchiviaDocumento : " + resp.message);
        NOTIFICA.error({
            message: "Errore di Archiviazione",
            title: "Error!",
            timeout: 0,
            width: 300
        })
    },

    getDatiAttivaVersione:function(resp){
        var $this = this;
        var p = {
            pHash        : '',
            pIdenRef     : $this.getDati('iden_referto'),
            pProgr       : $this.getDati('progressivo'),
            inIdenVR     : $this.getDati('iden_versione_referto'),
            inUrlReferto : resp.message,
            intipo_firma : $this.getDati('OPERAZIONE'),
            pDatiAggiuntivi:$this.getDati('DATI_AGGIUNTIVI')
        };
        return p;
    },
    attivaVersione: function (resp) {
        var $this = this;
        var p =  $this.getDatiAttivaVersione(resp);
        var dbParams={
            pHash        : {v: p.pHash,t:'V'},
            pIdenRef     : {v: p.pIdenRef,t:'N'},
            pProgr       : {v: p.pProgr,t:'N'},
            inIdenVR     : {v: p.inIdenVR,t:'N'},
            inUrlReferto : {v: p.inUrlReferto,t:'V'},
            intipo_firma : {v: p.intipo_firma,t:'V'},
            pDatiAggiuntivi:{v: p.pDatiAggiuntivi,t:'V'}

        }
        var db = $.NS_DB.getTool();
        var xhr = db.call_function(
            {
                datasource: 'POLARIS_DATI',
                id: 'GESTIONE_RIS_REFERTI.ATTIVA_VERSIONE_REFERTO',
                parameter: dbParams
            });

        xhr.done(function (response) {
            var resp = response.p_result.toString().split("$")[0];
            NS_FENIX_FIRMA.LOGGER.debug("attivaVersione per iden " + p.inIdenVR + " : " + JSON.stringify(response));
            if(resp == 'OK')
            {
                $("#fldFunzioniFirma").hide();
                $("#fldFunzioniFirmaRemota").hide();
                $("#fldFunzioniValida").hide();
                $("#fldFunzioniStampa").show();
                $("#fldFunzioniRitornaWk").show();
                $this.okAttivaVersione(response);
            }
            else
            {
                $this.koAttivaVersione(response);
            }
        });

        xhr.fail(function (jqXHR, textStatus, errorThrown){
            NS_FENIX_FIRMA.LOGGER.error('attivaVersione : '+errorThrown + ' - '+ jqXHR.responseText );

        });
    },
    okAttivaVersione:function(response){
        NS_FENIX_FIRMA.LOGGER.debug("okAttivaVersione: "+response.p_result);
        NOTIFICA.success({
            message: "Documento salvato correttamente",
            title: "Success!",
            width: 200
        });
    },
    koAttivaVersione:function(response){
        NS_FENIX_FIRMA.LOGGER.error("koAttivaVersione: "+response.p_result);
        NOTIFICA.error({
            message: "Documento non attivato",
            title: "Error!",
            width: 200
        });
    }

};
var _FIRMA_MULTIPLA_RIS = {
    recordSel:[],
    pin:null,
    progressivo:-1,
    fnc_ok:null,
    fnc_ko:null,
    start:function(rec,fnc_ok,fnc_ko){
        this.progressivo = -1;
        this.recordSel = rec;
        this.fnc_ok = fnc_ok;
        this.fnc_ko = fnc_ko;
        NS_FENIX_FIRMA.LOGGER.info("start : " + this.recordSel.length + " documento/i selezionato/i");
        this.getPin();
    },
    getPin:function(){
        var $this = this;
        DIALOG.pin(
            {
                okFunction:function(dial,data){
                    $this.pin = data[0].value;
                    if($this.recordSel.length){
                        NS_LOADING.showLoading({testo:'Firma Multipla in corso..',timeout: 0});
                        $this.next();
                    }
                }
            });
    },
    beforeFirma:function(param){
        var idFromSmartcard = appletFenix.getSmartCardID();

        if(baseUser.ID_SMART_CARD != idFromSmartcard)
        {
            NOTIFICA.error({
                message: "Smart Card non associata all'utente loggato. Verificare!",
                title: "Error!",
                timeout: 3,
                width: 200
            });
            NS_LOADING.hideLoading();
            return false;
        }

        return true;
    },
    koFirma:function(resp){
        NS_FENIX_FIRMA.LOGGER.error('koFirma : '+resp.message);
        if(resp.status == "FF"){

            NS_LOADING.hideLoading();
            this.getPin();
        }else{
            NOTIFICA.error({
                message: resp.message,
                title: "Error!",
                timeout: 3,
                width: 300
            });
            this.fnc_ko(this.getDati("iden_referto"));
            this.next();
        }

    },
    aggiungiVersione:function(rec){
        var $this = this;
        var params={"p_iden_referto":rec.IDEN_REFERTO,"p_tipo_versione":"D"};
        toolKitDB.executeFunctionSitoVersione("GESTIONE_RIS_REFERTI.INSERISCI_PRIMA_VERSIONE",params,
            {
                callback:function(response)
                {
                    var params = new Object();
                    params["PRINT_DIRECTORY"] = rec.IDEN_CDC;
                    params["PRINT_REPORT"] = "REFERTO_FIRMA";
                    params["PRINT_SF"] = "{REFERTI_VERSIONE.IDEN}=" +response.p_result.split("$")[0];
                    params["OPERAZIONE"] = "D";
                    params["progressivo"] =  response.p_result.split("$")[1];
                    params["iden_cdc"] = rec.IDEN_CDC;
                    params["iden_versione_referto"] = response.p_result.split("$")[0];
                    params["iden_referto"] = rec.IDEN_REFERTO;
                    $this.setDati(params);
                    params['okCaricaDocumento'] = function(){
                        $this.firma({pin:$this.pin});
                    };
                    params['koCaricaDocumento'] = function(){
                        NS_FENIX_FIRMA.LOGGER.error("koCaricaDocumento: controllare report");
                        NOTIFICA.error({
                            message: "Documento non presente",
                            title: "Error!",
                            timeout: 3,
                            width: 300
                        });
                        $this.fnc_ko($this.getDati("iden_referto"));
                        $this.next();
                    };
                    NS_FENIX_PRINT.caricaDocumento(params);

                },
                errorHandler: function(errorString, exception)
                {
                    NS_FENIX_FIRMA.LOGGER.error("Ritorno GESTIONE_RIS_REFERTI.INSERISCI_PRIMA_VERSIONE con parametri: " + JSON.stringify(params) + " errore :" + errorString);
                }
            });
    },
    next:function(){
        var $this = this;
        this.progressivo += 1;
        if(this.recordSel.length > this.progressivo){
            NS_FENIX_FIRMA.LOGGER.info("next: " + (this.progressivo+1) + "/" + this.recordSel.length);
            this.aggiungiVersione($this.recordSel[$this.progressivo]);
        }else{
            this.end();
        }

    },
    end:function(){
        NS_FENIX_FIRMA.LOGGER.info("end");
        NS_LOADING.hideLoading();
    },
    okAttivaVersione:function(resp){
        NS_FENIX_FIRMA.LOGGER.info("okAttivaVersione: " + JSON.stringify(resp) );
        this.fnc_ok(this.getDati("iden_referto"));
        this.next();
    },
    koAttivaVersione:function(resp){
        NS_FENIX_FIRMA.LOGGER.error("koAttivaVersione: "+JSON.stringify(resp));
        this.fnc_ko(this.getDati("iden_referto"));
        this.next();
    }
};

var FIRMA_MULTIPLA_RIS = $.extend({},FIRMA_RIS,_FIRMA_MULTIPLA_RIS);

var _FIRMA_SANTER = {
    flag_utente:false,
    setDati:function(dati){
        this.dati = dati;
        NS_FENIX_FIRMA.LOGGER.debug("Dati settati santer : "+JSON.stringify(this.dati));
    },
    initFirma:function(params){
        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniFirmaRemota").hide();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniFirmaGrafometrica").hide();
        var $this = this;
        $this.flag_utente = false;
        NS_FENIX_FIRMA.LOGGER.info("initFirma SANTER");
        /*var xml = "<MIA.operatore><appl>IMAGO</appl></MIA.operatore>";*/


        var xml=baseGlobal["firmaSANTER.OTTIENI_CREDENZIALI"];


        var resp = appletFenix.postCall(baseGlobal.URL_FIRMA_LOCALE,"application/xml",xml);
        if(resp !="KO"){
            $this.getResponseSmartCard(resp);

        }else{
            $this.koFirma({message:'Errore comunicazione con il SISSWAY. RIPROVARE.'});

        }
        return true;
    },
    beforeFirma:function(params){
        return true;
    },
    openFirma:function(_flag_cf){
        var $this = this;

        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniFirmaRemota").hide();
        $("#fldFunzioniSISS").show();
        $("#fldFunzioniFirmaGrafometrica").hide();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniStampa").hide();
        $("#fldFunzioniRitornaWk").hide();

        var p = {
            "iden_referto" : $this.getDati("iden_referto"),
            "progressivo" : $this.getDati("progressivo")
        };

        toolKitDB.getResult("DATI.GET_MAX_VERSIONE_FIRMATA",p,"",
            {
                callback: function (response)
                {
                    NS_FENIX_FIRMA.LOGGER.info("response " + JSON.stringify(response));
                    if(response[0].NUMERO == null){
                        $("#butFirmaStandard").closest("tr").show();
                        $("#butFirmaSostitutivo").closest("tr").hide();
                        $("#butFirmaAnnullativo").closest("tr").hide();
                        $("#butFirmaIntegrativo").closest("tr").hide();
                        FIRMA.firma("01");
                    }else{
                        $("#butFirmaStandard").closest("tr").hide();
                        $("#butFirmaSostitutivo").closest("tr").show();
                        $("#butFirmaAnnullativo").closest("tr").show();
                        $("#butFirmaIntegrativo").closest("tr").hide();
                    }
                },
                timeout: 5000,
                errorHandler: function (response)
                {
                    NS_FENIX_FIRMA.LOGGER.debug("Errore max versione_firmata: "+JSON.stringify(response));
                }
            });


    },
    getResponseSmartCard:function(resp){
        var $this = this;
        NS_FENIX_FIRMA.LOGGER.warn("Serializzo " + resp);
        /*var xml = (new XMLSerializer()).serializeToString(resp);*/
        var _respxml= {"xmlResponse":resp};
        var dataToSend = JSON.stringify(_respxml);

        NS_FENIX_FIRMA.LOGGER.warn("Serializzato " + resp);
        $.support.cors = true;
        $.ajax({
            url:baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE + home.baseGlobal["firmaSISS.URL_RESPONSE_CREDENZIALI"]+"?USER="+home.baseUser.USERNAME,
            data:dataToSend,
            contentType:"application/json",
            type: "POST",
            cache: false,
            crossDomain:true,
            success: function (resp)
            {
                var obj = eval ("(" + resp + ")");
                NS_FENIX_FIRMA.LOGGER.debug("Middleware Fenix Risposta con successo. CF = " + obj.codice_fiscale);
                if(obj.codice_fiscale == home.baseUser.CODICE_FISCALE){
                    $this.openFirma(true);
                }else if(typeof obj.codice_fiscale == 'undefined'){
                    $this.koFirma({message:'Errore! Impossibile leggere la carta SISS!'});
                }else{
                    $this.koFirma({message:'Errore! CODICE FISCALE non coerente con l\'utente loggato'});
                }
            },
            error: function (resp)
            {

                NS_FENIX_FIRMA.LOGGER.debug("Dati resp error middleware input: "+JSON.stringify(resp))
                $this.koFirma({message:'Errore comunicazione con il MIDDLWEARE FENIX.'});
            }
        });
    },
    firma:function(_type){
        home.NS_LOADING.showLoading({timeout: 0});
        NS_FENIX_FIRMA.LOGGER.warn("firma SANTER type :"+_type);
        var $this = this;

        if(_type=="04"){
            var params = {
                "iden_referto": $this.getDati("iden_referto"),
                "iden_cdc": $this.getDati("iden_cdc"),
                "iden_versione_referto": $this.getDati("iden_versione_referto"),
                "progressivo": $this.getDati("progressivo")
            };
            params["PRINT_DIRECTORY"]= params.iden_cdc;
            params["PRINT_REPORT"]= "REFERTO_ANNULLATIVO";
            params["PRINT_SF"]= "{REFERTI_VERSIONE.IDEN}=" +params.iden_versione_referto;
            params["OPERAZIONE"]= "D";
            NS_FENIX_FIRMA.LOGGER.info("Settata URL annullativo");
            $this.dati["OPERAZIONE"]="A";
            home.NS_FENIX_PRINT.caricaDocumento(params);
        }

        if(!$this.beforeFirma()){NS_FENIX_FIRMA.LOGGER.warn("beforeFirma return false");return false;}
        $this.getXmlFirma(_type);
    },
    getXmlFirma:function(_type){
        var $this = this ;
        var _pdf = appletFenix.getDocumentBase64();
        var $obMw = [{"iden_ref":$this.getDati("iden_referto"),"progressivo":$this.getDati("progressivo"),"type_firma":_type,"pdf":_pdf,cf_medico:baseUser.CODICE_FISCALE}];

        var dataToSend= JSON.stringify($obMw);
        NS_FENIX_FIRMA.LOGGER.debug("Dati to send middleware: "+dataToSend);

        $.support.cors = true;
        $.ajax({

            url:baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+ "/FIRMA/GET_INPUT_XML?USER="+home.baseUser.USERNAME,
            data:dataToSend,
            contentType:"text/plain",
            type: "POST",
            cache: false,
            dataType: "text",
            crossDomain:true,
            success: function (resp)
            {

                NS_FENIX_FIRMA.LOGGER.debug("Middleware Fenix Risposta con successo. ");
                $this.callFirma(resp);/*:$this.koFirma(resp);*/

            },
            error: function (resp)
            {

                NS_FENIX_FIRMA.LOGGER.debug("Dati resp error middleware input: "+JSON.stringify(resp))
                $this.koFirma({message:'Errore comunicazione con il MIDDLWEARE FENIX.'});
            }
        });
    },
    callFirma:function(resp){

        var $this = this;
        NS_FENIX_FIRMA.LOGGER.warn("Before parsing xml SANTER/SISS.") ;
        /*var xml = $.parseXML(resp);*/
        var xml= resp;
        jQuery.support.cors = true;
        var resp = appletFenix.postCall(baseGlobal.URL_FIRMA_LOCALE,"application/xml",xml);
        if(resp !="KO"){
            $this.getResponseFirma(resp);
        }else{
            $this.koFirma({message:'Errore comunicazione con il SISS/SISSWAY. RIPROVARE.'});
        }
    },
    getResponseFirma:function(resp){
        var $this = this;
        /*var xml = (new XMLSerializer()).serializeToString(resp);*/
        var xml=resp;
        var _respxml= [{"xmlResponse":xml}];
        var dataToSend = JSON.stringify(_respxml);
        NS_FENIX_FIRMA.LOGGER.debug("Chiamo MIDDLEWARE FENIX per output.");


        $.ajax({
            url: baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+"/FIRMA/OUTPUT_XML?USER="+home.baseUser.USERNAME,
            type: "POST",
            data: dataToSend,
            cache: false,
            /*dataType: "application/json",*/
            contentType: "json",
            success: function (resp)
            {
                NS_FENIX_FIRMA.LOGGER.debug("Dati resp middleware FENIX succcess.");
                $this.okFirma(resp);
            },
            error: function (resp)
            {
                NS_FENIX_FIRMA.LOGGER.debug("Dati resp middleware RESPONSE PARSING ERROR: "+JSON.stringify(resp) );
                $this.koFirma({message:'Errore comunicazione con il MIDDLWEARE FENIX.'});
            }
        });

    },
    okFirma:function(resp){
        var obj = eval ("(" + resp + ")");
        var $this = this;

        if(obj.ESITO="OK"){
            if(obj.DOCUMENTI.length != 0){
                $.each(obj.DOCUMENTI,function(k,v){
                    if(v.esitoOperazione == "OK"){

                        var _obj = {"HASH_DOCUMENTO":v.hashDocumento,"ALGORITMO_HASH": v.algoritmoHash,"SIZE_DOCUMENTO": v.sizeDocumento,"CONTENUTO_DAO": v.contenutoDao,"LINK_DOCUMENTO_PDF":v.linkDocumentoPDF};
                        $this.dati["DATI_AGGIUNTIVI"] = JSON.stringify(_obj);
                        $this.dati["iden_referto"] = v.iden_referto;
                        $this.dati["iden_cdc"] = v.iden_cdc;
                        $this.dati["progressivo"] = v.progressivo;
                        $this.dati["iden_versione_referto"] = v.iden_versione_referto;
                        $this.archiviaDocumento(v);

                    }else{
                        NS_FENIX_FIRMA.LOGGER.debug("okFirma(): ESITO KO");
                        var v_descr="";
                        if(typeof v.codiceErrore =='undefined'){
                            v_descr = v.esitoOperazione;
                        }else{
                            v_descr = v.codiceErrore + " " + v.descrizioneErrore;
                        }
                        $this.koFirma({message:'Errore! ' + v_descr});
                    }
                });
            }else{
                $this.koFirma({message:'Operazione Fallita Durante la Richiesta.' });
            }

        }else{
            $this.koFirma({message:'Operazione Fallita.'});
        }


    },
    koFirma:function(params){
        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniSISS").hide();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniStampa").hide();
        $("#fldFunzioniRitornaWk").show();
        home.NS_LOADING.hideLoading();
        if(typeof params.message=='undefined'){
            NOTIFICA.error({
                message: "Firma Fallita!",
                title: "Error!",
                width: 200
            });
        }else{
            NOTIFICA.error({
                message: params.message,
                title: "Error!",
                width: 200
            });
        }

    },
    archiviaDocumento: function (resp) {
        var $this = this;
        $.support.cors = true;
        $.ajax({
            url: baseGlobal.PERCORSO_FILE_SERVER_UPLOAD_REFERTI,
            type: "POST",
            data: $this.getDatiArchivia(resp),
            cache: false,
            async: false,
            dataType: "json",
            success: function (resp)
            {
                (resp.status == "OK")?$this.okArchiviaDocumento(resp):$this.koArchiviaDocumento(resp);
            },
            error: function ()
            {
                $this.koArchiviaDocumento({message:'Errore comunicazione con FileServer.'});
            }
        });
    },
    getDatiArchivia:function(resp){
        home.NS_LOADING.hideLoading();
        $("#butFirmaStandard").closest("tr").hide();
        var $this = this;
        var jsonArchivia = {};
        jsonArchivia.sito = NS_FENIX_TOP.sito;
        jsonArchivia.cdc = $this.getDati('iden_cdc');

        NS_FENIX_FIRMA.LOGGER.debug("getDatiArchivia();");
        /*jsonArchivia.hashFile = NS_FENIX_PRINT.appletFenix.getDocumentMd5(); */
        /*jsonArchivia.nomeFile = $this.getDati('iden_versione_referto') + '.pdf';*/

        if($this.getDati('OPERAZIONE') == "L"){
            jsonArchivia.fileBase64 = appletFenix.getDocumentBase64();
            jsonArchivia.nomeFile=$this.getDati('iden_versione_referto') + '.pdf';
        }else{
            NS_FENIX_FIRMA.LOGGER.debug("Setting del documento ottento");
            jsonArchivia.fileBase64 = resp.contenuto;
            jsonArchivia.nomeFile=resp.iden_versione_referto +'.pdf';
        }


        NS_FENIX_FIRMA.LOGGER.debug("archiviaDocumento SANTER con parametri: " + JSON.stringify(jsonArchivia));
        return jsonArchivia;
    },
    getDatiAttivaVersione:function(resp){
        var $this = this;
        NS_FENIX_FIRMA.LOGGER.debug("attivaVersione SANTER con parametri: " + JSON.stringify(resp));
        var p = {
            pHash        : '',
            pIdenRef     : $this.getDati('iden_referto'),
            pProgr       : $this.getDati('progressivo'),
            inIdenVR     : $this.getDati('iden_versione_referto'),
            inUrlReferto : resp.message,
            intipo_firma : $this.getDati('OPERAZIONE'),
            pDatiAggiuntivi:$this.getDati('DATI_AGGIUNTIVI')
        };
        NS_FENIX_FIRMA.LOGGER.debug("getDatiAttivaVersione() SANTER con parametri: " + JSON.stringify(p));
        return p;
    },
    openOscuramenti:function(){
        var $this = this;
        if(!($("#fldOscura").length)) {
            var autorizzazione=   CHECK.crea({
                id: "Autorizzazione",
                elements: [{val: "S", descr: traduzione.oscuramentoAutorizzazione}]
            }, {ctrl: false, width: "100%"})
            var OscuramentoCittadino=CHECK.crea({
                id: "oscuramentoCittadino",
                elements: [{val: "50", descr: traduzione.oscuramentoCittadino}]
            }, {ctrl: false, width: "100%"})
            var Oscura = CHECK.crea({
                id: "oscuramento",
                elements: [{val: "10", descr: traduzione.oscuramentoTossicoDipendenza}, {val: "20", descr: traduzione.oscuramentoHIV}, {val: "30", descr: traduzione.oscuramentoViolenze}, {val: "40", descr: traduzione.oscuramentoGravidanza}]
            }, {ctrl: false, width: "100%"})
            var NoteRepe   =$("<textarea>").attr("id","noteRepe").attr("placeholder",traduzione.noteReperibilita).css({width:"100%"})

            var buttonSalva =$("<button>").attr("id","btnSave").text(traduzione.butSave).on("click",function(){
                var valoreOscuramento = $("#oscuramento").data("CheckBox").val();
                var valoreOscuramentoVolontario = $("#oscuramentoCittadino").data("CheckBox").val();
                var valoreAutrizzazione = $("#Autorizzazione").data("CheckBox").val();
                var param=new Object()
                param.p_iden_referto   = $this.getDati('iden_referto');
                param.p_autorizzazione=  valoreAutrizzazione.indexOf('S')>-1?'S':'N';
                param.p_note     = $("#noteRepe").val();
                param.p_cittadino   =valoreOscuramentoVolontario.indexOf('50')>-1?'S':'N';
                param.p_tossico    =  valoreOscuramento.indexOf('10')>-1?'S':'N';
                param.p_HIV        =  valoreOscuramento.indexOf('20')>-1?'S':'N';
                param.p_violenze   =  valoreOscuramento.indexOf('30')>-1?'S':'N';
                param.p_gravidanza =  valoreOscuramento.indexOf('40')>-1?'S':'N';
                toolKitDB.executeFunctionDatasource("GESTIONE_RIS_REFERTI.INSERT_UPDATE_OSCURAMENTO", "POLARIS_DATI", param,
                    {

                        callback: function (response) {
                            if(response.p_result=='OK')
                            {
                                NOTIFICA.success({
                                    message: "Oscuramenti Salvati Correttamente",
                                    title: "Success!",
                                    timeout: 3,
                                    width: 300
                                });

                            }
                            else{
                                NOTIFICA.error({
                                    message: "Errore salvataggio",
                                    title: "Error!",
                                    timeout: 3,
                                    width: 300
                                });

                            }
                            $("#fldOscura").remove();
                            $("#tastiFunzione").show()
                        },
                        timeout: 2000,
                        errorHandler: function (response) {
                            NOTIFICA.error({
                                message: "Errore salvataggio",
                                title: "Error!",
                                timeout: 3,
                                width: 300
                            });
                        }
                    });
                ;
            })
            toolKitDB.getResult("DATI.CARICA_OSCURAMENTI", {"iden_referto": $this.getDati('iden_referto')},null,
                {
                    callback: function (response) {
                        if(response.length)
                        {
                            $("#noteRepe").val(response[0].NOTE_REPERIBILITA)
                            $("#Autorizzazione").data("CheckBox").selectByValue(response[0].AUTORIZZAZIONE_CONSULTAZIONE)
                            $("#oscuramento").data("CheckBox").selectByValue(response[0].TOSSICODIPENDENZA=='S'?"10":"");
                            $("#oscuramento").data("CheckBox").selectByValue(response[0].HIV=='S'?"20":"");
                            $("#oscuramento").data("CheckBox").selectByValue(response[0].VIOLENZE_SUBITE=='S'?"30":"");
                            $("#oscuramento").data("CheckBox").selectByValue(response[0].INTERR_VOLONTARIA_GRAVIDANZA=='S'?"40":"");
                            $("#oscuramentoCittadino").data("CheckBox").selectByValue(response[0].OSCURAMENTO_VOLONTARIO=='S'?"50":"");
                        }
                        $("#oscuramentoCittadino").data("CheckBox").disable();
                    },
                    timeout: 2000,
                    errorHandler: function (response) {

                    }
                });

            var buttonChiudi =$("<button>").attr("id","btnClose").text(traduzione.butChiudi).on("click",function(){
                $("#fldOscura").remove();
                $("#tastiFunzione").show();
            })
            $("#infoDocumento").append($("<fieldset>").attr("id", "fldOscura").addClass("fldCampi").append("<legend>"+traduzione.fldOscuramenti+ "</legend>").append(autorizzazione,OscuramentoCittadino,Oscura,NoteRepe,buttonSalva,buttonChiudi));

            $("#tastiFunzione").hide();
        }
        else
        {

            $("#fldOscura").remove();
            $("#tastiFunzione").show();
        }
    }
}

var FIRMA_SANTER = $.extend({},FIRMA_RIS,_FIRMA_SANTER);


var _FIRMA_REMOTA_MEDAS={
    /*Scryba Sign 2.1*/
    init:function(){
        var $this = this;


    },
    initFirma:function(params){
        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniFirmaRemota").show();
        $("#fldFunzioniSISS").hide();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniStampa").hide();
        $("#fldFunzioniRitornaWk").hide();
        return true;
    },
    firma:function(param){
        this.openSignSession(param);
    },
    getOTP:function(){
        var $otp = $("#txtOTP");
        return ($otp.length)?$otp.val(): "";
    },
    getPsw:function(){
        var $pws = $("#txtPasswordRemota");
        return ($pws.length)?$pws.val(): "";
    },
    getUserInfo:function(param){
        var uInfo =
        {
            User:
            {
                Username:"00000038",/*baseUser.USERNAME/baseUser.CODICE_FISCALE,*/
                FirstName:"",
                LastName:"",
                SSN:"cprfba82p26i480w",//baseUser.CODICE_FISCALE,
                BirthDate:""
            },
            Credentials:
            {
                Password:param['password'],
                OTP:param['OTP']
            }
        };
        return uInfo;
    },
    openSignSession:function(param){
        var $this = this;
        $.ajax({
            url: baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+"/OPEN_SIGN_SESSION",
            type: "POST",
            data: $this.getUserInfo(param),
            cache: false,
            crossDomain:true,
            success: function (resp)
            {
                if(!resp['ErrMessage'].Code)
                {
                    $this.signDoc(resp['SessionID']);
                }
                else
                {
                    NOTIFICA.error({
                        message: resp['ErrMessage'].Message,
                        title: "Error!",
                        timeout: 3,
                        width: 300
                    });
                    NS_FENIX_FIRMA.LOGGER.error("openSignSession: ErrMessage "+resp['ErrMessage'].Message);
                }
            },
            error: function (resp)
            {
                NOTIFICA.error({
                    message: resp,
                    title: "Error!",
                    timeout: 3,
                    width: 300
                });
                NS_FENIX_FIRMA.LOGGER.error("openSignSession: Errore comunicazione con il MIDDLWEARE FENIX.")
            }
        });
    },
    signDoc:function(sessionID){
        var $this = this;
        var fInfo =
        {
            SessionID:sessionID,
            Document:
            {


                DocBin:appletFenix.getDocumentBase64() ,
                DocType:"TEST1"


            },
            SignProperties:
            {
                SignMode:"CADES",

                ProcessID:"TEST"
            }
        };
        $.ajax({
            url: baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+"/SIGN_DOC",
            type: "POST",

            data: fInfo,

            cache: false,
            crossDomain:true,
            success: function (resp)
            {
                if(!resp['ErrMessage'].Code)
                {
                    $this.okFirma(resp);
                }
                else
                {
                    NOTIFICA.error({
                        message: resp['ErrMessage'].Message,
                        title: "Error!",
                        timeout: 3,
                        width: 300
                    });
                    NS_FENIX_FIRMA.LOGGER.error("signDoc: ErrMessage "+resp['ErrMessage'].Message);

                }
            },
            error: function (resp)
            {
                NOTIFICA.error({
                    message: resp,
                    title: "Error!",
                    timeout: 3,
                    width: 300
                });
                NS_FENIX_FIRMA.LOGGER.error("signDoc: Errore comunicazione con il MIDDLWEARE FENIX.")
            }
        });
    },
    closeSignSession:function(){

    },
    despatchOTP:function(param){
        var $this = this;
        var uInfo =
        {
            "User":
            {
                Username:"00000038",/*baseUser.USERNAME/baseUser.CODICE_FISCALE,*/
                "FirstName":"",
                "LastName":"",
                "SSN":"",
                "BirthDate":""
            },
            "Credentials":
            {
                "Password":"supporto123"/*param['password'].toString()*/,
                "Type":"SMS"
            }
        };
        NS_FENIX_FIRMA.LOGGER.debug("despatchOTP con parametri: " + JSON.stringify(uInfo));
        $.support.cors = true;
        $.ajax({
            url: baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+"/RICHIESTA_OTP?sessionSupport=true",
            type: "POST",
            send_data_form: false,
            data: uInfo,
            cache: false,
            crossDomain:true,
            success: function (resp)
            {
                if(!resp['ErrMessage'].Code)
                {
                    NOTIFICA.success({
                        message: "Richiesta OTP Accodata Correttamente",
                        title: "Richiesta OTP!",
                        timeout: 3,
                        width: 300
                    });
                }
                else
                {
                    NOTIFICA.error({
                        message: resp['ErrMessage'].Message,
                        title: "Error!",
                        timeout: 3,
                        width: 300
                    });
                    NS_FENIX_FIRMA.LOGGER.error("despatchOTP: ErrMessage "+resp['ErrMessage'].Message);
                }
            },
            error: function (resp)
            {
                NOTIFICA.error({
                    message:resp,
                    title: "Error!",
                    timeout: 3,
                    width: 300
                });
                NS_FENIX_FIRMA.LOGGER.error("despatchOTP: Errore comunicazione con il MIDDLWEARE FENIX.")
            }
        });
    },
    getDatiArchivia:function(resp){
        var $this = this;
        var jsonArchivia = {};
        jsonArchivia.sito = NS_FENIX_TOP.sito;
        jsonArchivia.cdc = $this.getDati('iden_cdc');
        /*jsonArchivia.hashFile = NS_FENIX_PRINT.appletFenix.getDocumentMd5(); */
        jsonArchivia.nomeFile = $this.getDati('iden_versione_referto') + '.pdf';
        NS_FENIX_FIRMA.LOGGER.debug("archiviaDocumento con parametri: " + JSON.stringify(jsonArchivia));
        /*jsonArchivia.fileBase64 = appletFenix.getDocumentBase64();*/
        jsonArchivia.fileBase64 = resp['SignedDocBin'];
        jsonArchivia.sessionId = resp['SessionID'];
        return jsonArchivia;
    }
};

var FIRMA_REMOTA_MEDAS = $.extend({},FIRMA_RIS,_FIRMA_REMOTA_MEDAS);

var _FIRMA_SISS = {
    flag_utente:false,
    setDati:function(dati){
        this.dati = dati;
        NS_FENIX_FIRMA.LOGGER.debug("Dati settati SISS : "+JSON.stringify(this.dati));
    },
    initFirma:function(params){
        var $this = this;
        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniFirmaRemota").hide();
        $("#fldFunzioniFirmaGrafometrica").hide();
        $this.ottieniCredenziali();
        return true;
    },
    ottieniCredenziali:function(rec){
        var $this=this;
        var xml = home.baseGlobal["firmaSISS.OTTIENI_CREDENZIALI"];
        $.support.cors = true;
        NS_FENIX_FIRMA.LOGGER.debug("ottieniCredenziali(). ajax." );
        $.ajax({
            url:"http://127.0.0.1:8000",
            data:xml,
            type: "POST",
            contentType:"application/xml",
            processData:false,
            success: function (resp)
            {
                NS_FENIX_FIRMA.LOGGER.debug("ottieniCredenziali() success! "+resp);
                $this.responseCredenziali(resp,rec);
            },
            error: function (resp)
            {
                NS_FENIX_FIRMA.LOGGER.debug("ottieniCredenziali() error! "+JSON.stringify(resp))
                var resp2 = appletFenix.postCall("http://127.0.0.1:8000","application/xml",xml);
                NS_FENIX_FIRMA.LOGGER.debug("Risposta da applet : " + resp2 );
                if(resp2 !="KO"){
                    $this.responseCredenziali(resp2);
                }else{
                    $this.koFirma({message:'Errore comunicazione con il SISSWAY. RIPROVARE.'});
                }
            }
        });
    },
    responseCredenziali:function(resp,rec){
        //var xml = resp;
        NS_FENIX_FIRMA.LOGGER.debug("responseCredenziali(); Ottenuta risposta. ");
        var v_xml;
        try{
            v_xml = (new XMLSerializer()).serializeToString(resp);
            NS_FENIX_FIRMA.LOGGER.debug("serializeToString : ok ");
        }catch(E){
            if (typeof resp.xml == 'undefined'){
                NS_FENIX_FIRMA.LOGGER.debug("resp.xml undefined" + resp);
                v_xml = resp;
            }else{
                NS_FENIX_FIRMA.LOGGER.debug("resp.xml not undefined " + resp.xml );
                v_xml = resp.xml;
            }
        }
        var ar = [];
        var elem= new Object();
        elem["xmlResponse"] = v_xml;
        ar.push(elem);
        ar.push({"xml":"load"});
        var _data = JSON.stringify(ar);

        NS_FENIX_FIRMA.LOGGER.debug("responseCredenziali() - " + JSON.stringify(_data));
        $.support.cors = true;
        var $this = this;
        $.ajax({
            url:home.baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+ "/SISS/LEGGI_OPERATORE_SISS?USER="+home.baseUser.USERNAME,
            data:{"value":_data},
            type: "POST",
            crossDomain:true,
            success: function (resp)
            {
                NS_FENIX_FIRMA.LOGGER.debug("Middleware Fenix Risposta con successo. CF = " + resp.codice_fiscale);
                if(resp.codice_fiscale == home.baseUser.CODICE_FISCALE){
                    $this.openFirma(true);
                }else if(typeof resp.codice_fiscale =='undefined'){
                    $this.koFirma({message:'Errore! Verificare carta SISS!'});
                }else{
                    $this.koFirma({message:'Errore! CODICE FISCALE non coerente con l\'utente loggato'});
                }
            },
            error: function (resp)
            {
                NS_FENIX_FIRMA.LOGGER.debug("responseCredenziali() error! "+JSON.stringify(resp))
                var resp2 = appletFenix.postCall(home.baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+ "/SISS/LEGGI_OPERATORE_SISS?USER="+home.baseUser.USERNAME,"application/x-www-form-urlencoded; charset=UTF-8",_data);

                if(resp2 !="KO"){
                    if(resp2.codice_fiscale == home.baseUser.CODICE_FISCALE){
                        $this.openFirma(true);
                    }else if(typeof resp2.codice_fiscale =='undefined'){
                        $this.koFirma({message:'Errore! Verificare carta SISS!'});
                    }else{
                        $this.koFirma({message:'Errore! CODICE FISCALE non coerente con l\'utente loggato'});
                    }
                }else{
                    $this.koFirma({message:'Errore comunicazione con il SISS.'});
                }

            }
        });
    },
    beforeFirma:function(params){
        return true;
    },
    openFirma:function(_flag_cf){
        var $this = this;

        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniSISS").show();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniStampa").hide();
        $("#fldFunzioniRitornaWk").hide();

        var p = {
            "iden_referto" : $this.getDati("iden_referto"),
            "progressivo" : $this.getDati("progressivo")
        };

        toolKitDB.getResult("DATI.GET_MAX_VERSIONE_FIRMATA",p,"",
            {
                callback: function (response)
                {
                    NS_FENIX_FIRMA.LOGGER.info("openFirma(): " + JSON.stringify(response));
                    if(response[0].NUMERO == null){
                        $("#butFirmaStandard").closest("tr").show();
                        $("#butFirmaSostitutivo").closest("tr").hide();
                        $("#butFirmaAnnullativo").closest("tr").hide();
                        $("#butFirmaIntegrativo").closest("tr").hide();
                        /*FIRMA.firma("01");*/
                    }else{
                        $("#butFirmaStandard").closest("tr").hide();
                        $("#butFirmaSostitutivo").closest("tr").show();
                        $("#butFirmaAnnullativo").closest("tr").show();
                        $("#butFirmaIntegrativo").closest("tr").hide();
                    }
                },
                timeout: 5000,
                errorHandler: function (response)
                {
                    NS_FENIX_FIRMA.LOGGER.debug("Errore max versione_firmata: "+JSON.stringify(response));
                }
            });


    },
    firma:function(_type){
        var $this = this;
        home.NS_LOADING.showLoading({timeout: 0});
        NS_FENIX_FIRMA.LOGGER.warn("firma SISS type :"+_type);
        var $this = this;
        $this.objRichiedi=[];
        $this.objPredisponi=[];
        $this.objOttieni=[];
        $this.objStampa=[];
        if(_type=="04"){
            var params = {
                "iden_referto": $this.getDati("iden_referto"),
                "iden_cdc": $this.getDati("iden_cdc"),
                "iden_versione_referto": $this.getDati("iden_versione_referto"),
                "progressivo": $this.getDati("progressivo")
            };
            params["PRINT_DIRECTORY"]= params.iden_cdc;
            params["PRINT_REPORT"]= "REFERTO_ANNULLATIVO";
            params["PRINT_SF"]= "{REFERTI_VERSIONE.IDEN}=" +params.iden_versione_referto;
            params["OPERAZIONE"]= "D";
            NS_FENIX_FIRMA.LOGGER.info("Settata URL annullativo");
            $this.dati["OPERAZIONE"]="A";
            home.NS_FENIX_PRINT.caricaDocumento(params);
        }

        if(!$this.beforeFirma()){NS_FENIX_FIRMA.LOGGER.warn("beforeFirma return false");return false;}
        $this.getXmlFirma(_type); // async
        NS_FENIX_FIRMA.LOGGER.warn("Richiedo FIRMA : $this.objPredisponi " + $this.objPredisponi);
        $.each($this.objPredisponi,function(k,v){//richiedo documento
            if($this.objPredisponi.length ==1){
                if(v.DAO!=""){
                    NS_FENIX_FIRMA.LOGGER.warn("DAO!");
                    $this.richiediDocumento(v,1,0,v.iden_ref+"_"+ v.progressivo, v.pdf,"PDF");
                    $this.richiediDocumento(v,0,1,v.iden_ref+"_"+ v.progressivo+"_DAO", v.DAO,"TESTO");
                }else{
                    NS_FENIX_FIRMA.LOGGER.warn("DAO Assente.");
                    $this.richiediDocumento(v,1,1,v.iden_ref+"_"+ v.progressivo, v.pdf,"PDF");
                }
            }else{
                $this.richiediDocumento(v,1,k,v.iden_ref+"_"+ v.progressivo, v.pdf);
            }
        });

        $.each($this.objRichiedi,function(k,v){//ottengo documento

            if($this.objRichiedi.length > 1){
                if(k==0){
                    NS_FENIX_FIRMA.LOGGER.warn("k=0 " + v.IDENTIFICATIVO_DOCUMENTO);
                    $this.ottieniDocumento(v,1,0,v.IDENTIFICATIVO_DOCUMENTO);
                }else if(k==1){
                    NS_FENIX_FIRMA.LOGGER.warn("k=1 " + v.IDENTIFICATIVO_DOCUMENTO);
                    $this.ottieniDocumento(v,0,1,v.IDENTIFICATIVO_DOCUMENTO);
                }
            }else{
                $this.ottieniDocumento(v,1,1,v.IDENTIFICATIVO_DOCUMENTO);
            }

        });

        $.each($this.objPredisponi,function(k,v){
            NS_FENIX_FIRMA.LOGGER.warn("Fine del processo. Preparo per il FileServer.");
            var object={};
            var _obj= new Object();

            _obj = {"HASH_DOCUMENTO":v.hashDocumento,"ALGORITMO_HASH": v.algoritmoHash,"SIZE_DOCUMENTO": v.sizeDocumento,"CONTENUTO_DAO": v.conenuto,"LINK_DOCUMENTO_PDF":"","VERSIONE_XSLT":v.versioneXSLT};
            $.each($this.objOttieni,function(k1,v1){
                if(v1.iden_referto == v.iden_ref){
                    if(v1.DAO=="S"){
                        _obj["CONTENUTO_DAO"] = v1.contenuto;
                        NS_FENIX_FIRMA.LOGGER.warn("DAO x v.iden_ref: " + v.iden_ref);
                    }else{
                        NS_FENIX_FIRMA.LOGGER.warn("Documento FIRMATO x v.iden_ref : " + v.iden_ref);
                        object.contenuto = v1.contenuto;
                        object.iden_versione_referto = v1.iden_versione_referto;
                        $this.dati["iden_referto"] = v1.iden_referto;
                        $this.dati["iden_cdc"] = v1.iden_cdc;
                        $this.dati["progressivo"] = v1.progressivo;
                        $this.dati["iden_versione_referto"] = v1.iden_versione_referto;
                    }
                }
            });
            $this.dati["DATI_AGGIUNTIVI"] = JSON.stringify(_obj);
            NS_FENIX_FIRMA.LOGGER.warn("Chiamo Archiviazione.");
            $this.archiviaDocumento(object);
        });

    },
    objPredisponi:[],
    objRichiedi:[],
    objOttieni:[],
    objStampa:[],
    getXmlFirma:function(_type){
        var $this = this ;
        var _pdf = appletFenix.getDocumentBase64();
        var $obMw = [{"iden_ref":$this.getDati("iden_referto"),"progressivo":$this.getDati("progressivo"),"type_firma":_type,"pdf":_pdf,cf_medico:baseUser.CODICE_FISCALE,"inizio_lotto":"1","fine_lotto":"1"}];
        var dataToSend= JSON.stringify([$obMw]);
        NS_FENIX_FIRMA.LOGGER.debug("Dati to send middleware: "+dataToSend);

        var resp = appletFenix.postCall(home.baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+ "/FIRMA/GET_INPUT_XML?USER="+home.baseUser.USERNAME,"application/xml; charset=UTF-8",dataToSend);
        NS_FENIX_FIRMA.LOGGER.debug("ciclo resp.DOCUMENTI. ESITO : " + JSON.stringify(resp));
        if(resp !="KO"){
            var predisponi=function(_data){
                NS_FENIX_FIRMA.LOGGER.debug("predisponi()");
                var predisp = appletFenix.postCall("http://127.0.0.1:8000","application/xml",_data);
                if(predisp!="KO"){
                    var checkPredisponi=function(data){
                        NS_FENIX_FIRMA.LOGGER.debug("checkPredisponi()");
                        var elem = new Object();
                        elem["xmlResponse"]=data;
                        elem["operazione"]="P";
                        var v_data = JSON.stringify([elem]);
                        var checkPred = appletFenix.postCall(home.baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+ "/FIRMA/OUTPUT_XML?USER="+home.baseUser.USERNAME,"application/x-www-form-urlencoded; charset=UTF-8",v_data);
                        if(checkPred!="KO") {
                            var obj=checkPred;
                            try{
                                obj = eval("(" + checkPred + ")");
                            }catch(e){
                                obj =checkPred;
                            }
                            var _OBJ = new Object();
                            if (obj.ESITO == "OK") {
                                //$this.richiediDocumento($obMw);
                                obj.iden_ref = $obMw[0].iden_ref;
                                obj.progressivo = $obMw[0].progressivo;
                                obj.pdf = $obMw[0].pdf;
                                obj.type_firma = $obMw[0].type_firma;
                                _OBJ = obj;
                                $this.objPredisponi.push(_OBJ);
                            }else {
                                $this.koFirma({message: 'Errore Autorizzazione'});
                            }
                        }else{
                            $this.koFirma({message:'Errore comunicazione con il SISS'});
                        }
                    }
                    checkPredisponi(predisp);
                }else{
                    $this.koFirma({message:'Errore comunicazione con il SISS'});
                }
            }
            predisponi(resp);
        }else{
            $this.koFirma({message:'Errore comunicazione con il SISSWAY. RIPROVARE.'});
        }
    },
    richiediDocumento:function($obj,inizioLotto,FineLotto,identificativo,pdf,tipoDocumento){
        var $this = this;
        NS_FENIX_FIRMA.LOGGER.debug("richiediDocumento() - " + identificativo);
        var _data = home.baseGlobal["firmaSISS.XML_INIT"]+home.baseGlobal["firmaSISS.richiediFirmaDocumento.INIT"];
        _data += "<inizioLotto>"+inizioLotto+"</inizioLotto><fineLotto>"+FineLotto+"</fineLotto>";
        //_data += "<documento><identificativoDocumento>"+ v.iden_ref+"_"+ v.progressivo+"</identificativoDocumento>";
        _data += "<documento><identificativoDocumento>"+identificativo+"</identificativoDocumento>";
        _data += "<tipoDocumento>"+tipoDocumento+"</tipoDocumento>";
        _data += "<tipoFirma>LEGALE_OPERATORE</tipoFirma>";
        _data += "<contenuto>"+ pdf+"</contenuto></documento>";
        _data += home.baseGlobal["firmaSISS.richiediFirmaDocumento.END"];
        var rich = appletFenix.postCall("http://127.0.0.1:8000","application/xml",_data);
        if(rich!="KO"){
            var elem = new Object();
            elem["xmlResponse"]=rich;
            elem["operazione"]="R";
            var v_data = JSON.stringify([elem]);
            var checkrich = appletFenix.postCall(home.baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+ "/FIRMA/OUTPUT_XML?USER="+home.baseUser.USERNAME,"application/x-www-form-urlencoded; charset=UTF-8",v_data);
            if(checkrich !="KO"){
                var obj=checkrich;
                try{
                    obj = eval("(" + checkrich + ")");
                }catch(e){
                    obj =checkrich;
                }
                var newObj = new Object();
                newObj.IDENTIFICATIVO_DOCUMENTO = obj.IDENTIFICATIVO_DOCUMENTO;
                $this.objRichiedi.push(newObj);
                NS_FENIX_FIRMA.LOGGER.debug("objRichiedi.push : " + JSON.stringify($this.objRichiedi));
            }else{
                $this.koFirma({message:'Errore Richiedi Documento. '});
            }
        }else{
            $this.koFirma({message:'Errore Richiedi Documento. '});
        }
    },
    ottieniDocumento:function($obj,inizioLotto,FineLotto,identificativo){
        var $this = this;
        NS_FENIX_FIRMA.LOGGER.debug("ottieniDocumento()" + identificativo);

        var _data = home.baseGlobal["firmaSISS.XML_INIT"]+home.baseGlobal["firmaSISS.ottieniDocumentoFirmato.INIT"];
        _data += "<inizioLotto>"+inizioLotto+"</inizioLotto><fineLotto>"+FineLotto+"</fineLotto>";
        //_data += "<documento><identificativoDocumento>"+ v.iden_ref+"_"+ v.progressivo+"</identificativoDocumento></documento>";
        _data += "<documento><identificativoDocumento>"+ identificativo +"</identificativoDocumento></documento>";
        _data += home.baseGlobal["firmaSISS.ottieniDocumentoFirmato.END"];
        var ott = appletFenix.postCall("http://127.0.0.1:8000","application/xml",_data);
        if(ott!="KO"){
            var elem = new Object();
            elem["xmlResponse"]=ott;
            elem["operazione"]="O";
            var v_data = JSON.stringify([elem]);
            var CHKott = appletFenix.postCall(home.baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+ "/FIRMA/OUTPUT_XML?USER="+home.baseUser.USERNAME,"application/x-www-form-urlencoded; charset=UTF-8",v_data);
            var obj=CHKott;

            try{
                obj = eval("(" + CHKott + ")");
            }catch(e){
                obj =CHKott;

            }
            if(obj.ESITO == "OK"){
                var _OBJ = new Object();

                _OBJ = obj;
                $this.objOttieni.push(_OBJ);

            }else{
                $this.koFirma({message:'Errore Ottieni Documento. ' + obj.ERRORE});
            }
        }

    }
}

/*var FIRMA_SISS = $.extend({},FIRMA_RIS,_FIRMA_SISS);*/
var FIRMA_SISS = $.extend({},FIRMA_SANTER,_FIRMA_SISS);

var _FIRMA_MULTIPLA_SISS = {
    start:function(rec,fnc_ok,fnc_ko){
        var $this = this;
        NS_FENIX_FIRMA.LOGGER.info("start : " + rec.length + " documento/i selezionato/i");
        $this.checkUser(rec);
    },
    fnc_ok:function(id_referto){
        NS_VALID_MULTIPLA.setRowSuccess(id_referto);
    },
    fnc_ko:function(id_referto){
        NS_VALID_MULTIPLA.setRowError(id_referto);
    },
    checkUser:function(rec){
        var $this = this;
        $this.ottieniCredenziali(rec);
    },
    responseCredenziali:function(resp,rec){
        //var xml = resp;
        NS_FENIX_FIRMA.LOGGER.debug("responseCredenziali(); Ottenuta risposta. ");
        var v_xml;
        try{
            v_xml = (new XMLSerializer()).serializeToString(resp);
        }catch(E){
            v_xml = resp.xml;
        }
        var ar = [];
        var elem= new Object();
        elem["xmlResponse"] = v_xml;
        ar.push(elem);
        ar.push({"xml":"load"})
        var _data = JSON.stringify(ar);

        NS_FENIX_FIRMA.LOGGER.debug("responseCredenziali() - " + JSON.stringify(_data));
        $.support.cors = true;
        var $this = this;
        $.ajax({
            url:home.baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+ "/SISS/LEGGI_OPERATORE_SISS",
            data:{"value":_data},
            type: "POST",
            crossDomain:true,
            success: function (resp)
            {
                NS_FENIX_FIRMA.LOGGER.debug("Middleware Fenix Risposta con successo. CF = " + resp.codice_fiscale);
                if(resp.codice_fiscale == home.baseUser.CODICE_FISCALE){
                    $this.firma(rec);
                }else if(typeof resp.codice_fiscale =='undefined'){
                    $this.koFirma({message:'Errore! Verificare carta SISS!'});
                }else{
                    $this.koFirma({message:'Errore! CODICE FISCALE non coerente con l\'utente loggato'});
                }
            },
            error: function (resp)
            {
                NS_FENIX_FIRMA.LOGGER.debug("responseCredenziali() error! "+JSON.stringify(resp))
                var resp2 = appletFenix.postCall(home.baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+ "/SISS/LEGGI_OPERATORE_SISS?USER="+home.baseUser.USERNAME,"application/x-www-form-urlencoded; charset=UTF-8",_data);

                if(resp2 !="KO"){
                    if(resp2.codice_fiscale == home.baseUser.CODICE_FISCALE){
                        $this.firma(rec);
                    }else if(typeof resp2.codice_fiscale =='undefined'){
                        $this.koFirma({message:'Errore! Verificare carta SISS!'});
                    }else{
                        $this.koFirma({message:'Errore! CODICE FISCALE non coerente con l\'utente loggato'});
                    }
                }else{
                    $this.koFirma({message:'Errore comunicazione con il SISS.'});
                }

            }
        });
    }
    ,
    firma:function(_records){
        var $this = this;
        home.NS_LOADING.showLoading({timeout: 0});
        $this.contatore =0;
        $this.arrOGGETTO=[];
        $this.recordSel= _records;
        $this.objRichiedi=[];
        $this.objPredisponi=[];
        $this.objOttieni=[];
        $this.objStampa=[];
        if(!$this.beforeFirma()){NS_FENIX_FIRMA.LOGGER.warn("beforeFirma return false");return false;}
        for (i=0; i <  $this.recordSel.length; i++){
            logger.debug("SISS Multipla : aggiungo versione " + $this.recordSel[i]);
            $this.aggiungiVersione($this.recordSel[i]);
        }
        NS_FENIX_FIRMA.LOGGER.warn("Richiedo FIRMA : $this.objPredisponi " + $this.objPredisponi);
        if($this.objPredisponi.length == 0 ){
            $this.koFirma({message:'Errore l\'elaborazione dei referti. [FENIX]'});
        }
        $.each($this.objPredisponi,function(k,v){//richiedo documento
            NS_FENIX_FIRMA.LOGGER.warn("PREDISPONI : " + $this.objPredisponi.length + " ,k : " + k);
            if($this.objPredisponi.length ==1){
                $this.richiediDocumento(v,1,1,v.iden_ref+"_"+ v.progressivo, v.pdf,"PDF");
            }else{
                if(k == 0){
                    $this.richiediDocumento(v,1,0,v.iden_ref+"_"+ v.progressivo, v.pdf,"PDF");
                }else if(k == ($this.objPredisponi.length -1)){
                    $this.richiediDocumento(v,0,1,v.iden_ref+"_"+ v.progressivo, v.pdf,"PDF");
                }else{
                    $this.richiediDocumento(v,0,0,v.iden_ref+"_"+ v.progressivo, v.pdf,"PDF");
                }
            }
        });

        $.each($this.objRichiedi,function(k,v){//ottengo documento
            if($this.objRichiedi.length > 1){
                if(k==0){
                    NS_FENIX_FIRMA.LOGGER.warn(v.IDENTIFICATIVO_DOCUMENTO);
                    $this.ottieniDocumento(v,1,0,v.IDENTIFICATIVO_DOCUMENTO);
                }else if(k==($this.objRichiedi.length -1)){
                    NS_FENIX_FIRMA.LOGGER.warn(v.IDENTIFICATIVO_DOCUMENTO);
                    $this.ottieniDocumento(v,0,1,v.IDENTIFICATIVO_DOCUMENTO);
                }else{
                    NS_FENIX_FIRMA.LOGGER.warn(v.IDENTIFICATIVO_DOCUMENTO);
                    $this.ottieniDocumento(v,0,0,v.IDENTIFICATIVO_DOCUMENTO);
                }
            }else{
                $this.ottieniDocumento(v,1,1,v.IDENTIFICATIVO_DOCUMENTO);
            }

        });

        $.each($this.objPredisponi,function(k,v){
            NS_FENIX_FIRMA.LOGGER.warn("Fine del processo. Preparo per il FileServer.");
            var object={};
            var _obj= new Object();

            _obj = {"HASH_DOCUMENTO":v.hashDocumento,"ALGORITMO_HASH": v.algoritmoHash,"SIZE_DOCUMENTO": v.sizeDocumento,"CONTENUTO_DAO": v.conenuto,"LINK_DOCUMENTO_PDF":"","VERSIONE_XSLT":v.versioneXSLT};
            $.each($this.objOttieni,function(k1,v1){
                if(v1.iden_referto == v.iden_ref){
                    if(v1.DAO=="S"){
                        _obj["CONTENUTO_DAO"] = v1.contenuto;
                        NS_FENIX_FIRMA.LOGGER.warn("DAO x v.iden_ref: " + v.iden_ref);
                    }else{
                        NS_FENIX_FIRMA.LOGGER.warn("Documento FIRMATO x v.iden_ref : " + v.iden_ref);
                        object.contenuto = v1.contenuto;
                        object.iden_versione_referto = v1.iden_versione_referto;
                        $this.dati["iden_referto"] = v1.iden_referto;
                        $this.dati["iden_cdc"] = v1.iden_cdc;
                        $this.dati["progressivo"] = v1.progressivo;
                        $this.dati["iden_versione_referto"] = v1.iden_versione_referto;
                    }
                }
            });
            $this.dati["DATI_AGGIUNTIVI"] = JSON.stringify(_obj);
            NS_FENIX_FIRMA.LOGGER.warn("Chiamo Archiviazione.");
            $this.archiviaDocumento(object);
        });
    },
    aggiungiVersione:function(rec){
        var $this =this;
        var params={"p_iden_referto":rec.IDEN_REFERTO,"p_tipo_versione":"D"};
        logger.debug("SISS aggiungiVersione() " + JSON.stringify(params));
        dwr.engine.setAsync(false);
        toolKitDB.executeFunctionSitoVersione("GESTIONE_RIS_REFERTI.INSERISCI_PRIMA_VERSIONE",params,
            {
                callback:function(response)
                {

                    logger.debug("SISS aggiungiVersione() callback : " + JSON.stringify(response));
                    var param = new Object();
                    param["PRINT_DIRECTORY"]= rec.IDEN_CDC;
                    param["PRINT_REPORT"]= "REFERTO_FIRMA";
                    param["PRINT_SF"]= "{REFERTI_VERSIONE.IDEN}=" +response.p_result.split("$")[0];
                    param["OPERAZIONE"]= "D";
                    param["PROGRESSIVO"] =  response.p_result.split("$")[1];
                    logger.debug("Ritorno GESTIONE_RIS_REFERTI.INSERISCI_PRIMA_VERSIONE " + JSON.stringify(response) + " con parametri: " + JSON.stringify(params));
                    home.NS_FENIX_PRINT.caricaDocumento(param);

                    var _dati = {
                        "iden_ref" : rec.IDEN_REFERTO,
                        "iden_referto" : rec.IDEN_REFERTO,
                        "type_firma" : "01",
                        "cod_fisc": home.baseUser.CODICE_FISCALE,
                        "pdf": home.baseUser.CODICE_FISCALE,
                        "progressivo" : response.p_result.split("$")[1],
                        "iden_versione_referto" : response.p_result.split("$")[0],
                        "PRINT_DIRECTORY" : rec.IDEN_CDC,
                        "PRINT_REPORT" : "REFERTO_FIRMA",
                        "PRINT_SF" : "{REFERTI_VERSIONE.IDEN}=" + response.p_result.split("$")[0],
                        "OPERAZIONE" : "D"
                    };
                    $this.dati = _dati;
                    logger.debug("SISS aggiungiVersione() home.FIRMA.dati : " + JSON.stringify(_dati));
                    $this.getXmlFirma("01"); // async

                },
                errorHandler: function(errorString, exception)
                {
                    logger.debug("Ritorno GESTIONE_RIS_REFERTI.INSERISCI_PRIMA_VERSIONE con parametri: " + JSON.stringify(params) + " errorHandler :" + errorString);
                }

            });
        dwr.engine.setAsync(true);

    },
    okAttivaVersione:function(resp){
        var $this = this;
        $this.contatore = $this.contatore +1;
        NS_FENIX_FIRMA.LOGGER.info("okAttivaVersione: "+JSON.stringify(resp));   //da rivedere la gestione della stampa
        $this.fnc_ok(resp.p_result.split("$")[1]);
        $this.objStampa.push(resp.p_result.split("$")[1]);
        if ($this.objPredisponi.length == $this.contatore ){
            if(NS_VALID_MULTIPLA.print_after_sign){
                $this.stampaReferti();
            }
        }
    },
    koAttivaVersione:function(resp){
        var $this = this;
        NS_FENIX_FIRMA.LOGGER.error("koAttivaVersione: "+JSON.stringify(resp));
        $this.fnc_ko(resp.p_result.split("$")[1]);
    },
    stampaReferti:function(){
        var $this = this;
        var dataToSend=[{"type":"REF","value":$this.objStampa.toString()}];
        $.support.cors = true;
        var param = {"anteprima":"S","URL":home.baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+"/DOCUMENTI?PARAM="+JSON.stringify(dataToSend)+"&USER="+home.baseUser.USERNAME+"&t="+moment().unix() ,
                    "okCaricaDocumento":function(param){
                                param['beforeApri'] =  NS_FENIX_PRINT.initStampa;
                                NS_FENIX_PRINT.apri(param);
                    }
        }
        home.NS_FENIX_PRINT.caricaDocumento(param);
    }
};

var FIRMA_MULTIPLA_SISS = $.extend({},FIRMA_SISS,_FIRMA_MULTIPLA_SISS);

var FIRMA_MULTIPLA_SANTER = {
    contatore:null,
    recordSel:null,
    arrOGGETTO:[],
    firma:function(n_records){
        home.NS_LOADING.showLoading({timeout: 0});
        FIRMA_MULTIPLA_SANTER.contatore =0;
        FIRMA_MULTIPLA_SANTER.arrOGGETTO=[];
        FIRMA_MULTIPLA_SANTER.recordSel= n_records;
        FIRMA_MULTIPLA_SANTER.aggiungiVersione(FIRMA_MULTIPLA_SANTER.recordSel[0]);
    },
    aggiungiVersione:function(rec){
        var params={"p_iden_referto":rec.IDEN_REFERTO,"p_tipo_versione":"D"};
        logger.debug(JSON.stringify(params));
        toolKitDB.executeFunctionSitoVersione("GESTIONE_RIS_REFERTI.INSERISCI_PRIMA_VERSIONE",params,
            {
                callback:function(response)
                {
                    logger.debug("Ritorno GESTIONE_RIS_REFERTI.INSERISCI_PRIMA_VERSIONE " + JSON.stringify(response) + " con parametri: " + JSON.stringify(params));
                    var params = new Object();
                    params["PRINT_DIRECTORY"]= rec.IDEN_CDC;
                    params["PRINT_REPORT"]= "REFERTO_FIRMA";
                    params["PRINT_SF"]= "{REFERTI_VERSIONE.IDEN}=" +response.p_result.split("$")[0];
                    params["OPERAZIONE"]= "D";
                    params["PROGRESSIVO"] =  response.p_result.split("$")[1];
                    home.NS_FENIX_PRINT.caricaDocumento(params);

                    var jsonobj = new Object();
                    jsonobj.iden_ref = rec.IDEN_REFERTO;
                    jsonobj.type_firma="01";
                    jsonobj.cod_fisc=home.baseUser.CODICE_FISCALE;
                    var iden_versione_referto = response.p_result.split("$")[0];

                    jsonobj.pdf = home.appletFenix.getDocumentBase64();
                    jsonobj.progressivo = response.p_result.split("$")[1];
                    FIRMA_MULTIPLA_SANTER.arrOGGETTO.push(jsonobj);
                    FIRMA_MULTIPLA_SANTER.contatore ++;
                    if(FIRMA_MULTIPLA_SANTER.contatore == FIRMA_MULTIPLA_SANTER.recordSel.length ){
                        FIRMA_MULTIPLA_SANTER.getXml(FIRMA_MULTIPLA_SANTER.arrOGGETTO);
                    }else{
                        FIRMA_MULTIPLA_SANTER.aggiungiVersione(FIRMA_MULTIPLA_SANTER.recordSel[FIRMA_MULTIPLA_SANTER.contatore] );
                    }
                },

                errorHandler: function(errorString, exception)
                {
                    logger.debug("Ritorno GESTIONE_RIS_REFERTI.INSERISCI_PRIMA_VERSIONE con parametri: " + JSON.stringify(params) + " errore :" + errorString);
                }

            });

    },
    getXml:function(_json) {
        var dataToSend= JSON.stringify(_json);
        logger.debug(JSON.stringify(dataToSend));
        $.support.cors = true;
        $.ajax({
            url:home.baseGlobal.URL_FIRMA_FENIX_MIDDLEWARE+ "/FIRMA/GET_INPUT_XML",
            data:dataToSend,
            contentType:"text/plain",
            type: "POST",
            cache: false,
            dataType: "text",
            timeout:1000000,
            crossDomain:true,
            success: function (resp)
            {
                logger.debug("Middleware Fenix Risposta con successo" );
                if(!LIB.isValid(home.FIRMA.dati)){
                    home.FIRMA.dati = {"OPERAZIONE":"D"};
                }
                //Pericoloso come i cross di Johnathan
                if(home.FIRMA.dati["OPERAZIONE"] == "L"){
                    home.FIRMA.dati["OPERAZIONE"] = "D";
                }
                home.FIRMA.okAttivaVersione=function(resp){
                    logger.debug("OK ATTIVA VERSIONE OVERRIDE"  + JSON.stringify(resp) );
                    var iden_referto = resp.p_result.split("$")[1];
                    try{
                        $("[data-id='id"+iden_referto+"']").html("OK");
                    }catch(e){
                    }
                }
                home.FIRMA.callFirma(resp);/*:$this.koFirma(resp);*/

            },
            error: function (resp)
            {

                logger.debug("Dati resp error middleware input: "+JSON.stringify(resp))
                home.FIRMA.koFirma({message:'Errore comunicazione con il MIDDLWEARE FENIX.'});
            }
        });
    }
}

var NS_FIRMA_GRAFOMETRICA = {
    init:function(params){
        $("#fldFunzioniFirma").hide();
        $("#fldFunzioniFirmaRemota").hide();
        $("#fldFunzioniSISS").hide();
        $("#fldFunzioniValida").hide();
        $("#fldFunzioniStampa").hide();
        $("#fldFunzioniRitornaWk").hide();
        $('#butFirmaAnnullativo').hide();

        $("#fldFunzioniFirmaGrafometrica").show();
        return true;
    },
    setEvents: function(){
        var bt = $("#butFirmaGrafometrica");
        bt.off("click");
        bt.on("click", function(e){
            $(this).prop("disabled", true);
            $(this).text("Attendere....");
            home.NS_SCHEDA_CONSENSO_ELCOMAKER.firmaGrafometrica();
        });
    },
    restoreButtons: function(){
        var bt = $("#butFirmaGrafometrica");
        bt.prop("disabled", false);
        bt.text("Firma");
    }

}