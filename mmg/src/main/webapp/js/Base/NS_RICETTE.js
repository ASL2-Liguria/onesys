
var RICETTA_RIS = {
    init:function(){
        /* $("#butCreaRicetta").show();*/
    },
    beforeGetDema:function(param){
        if(typeof param.nre =='undefined' || param.nre == ""){
            NOTIFICA.error({
                message: "NRE non specificato",
                title: "Error!",
                width: 300
            });
            return false;
        }
        if(typeof param.codice_fiscale =='undefined' || param.codice_fiscale == ""){
            NOTIFICA.error({
                message: "Codice Fiscale non specificato",
                title: "Error!",
                width: 300
            });
            return false;
        }

        return true;
    },
    okAggiornaDema:function(resp){
        home.NS_LOADING.hideLoading();
        var _msg ="Dematerializzata: Aggiornata!";
        NOTIFICA.success({
            message: _msg,
            title: "Success!",
            width: 300
        });
    },
    koAggiornaDema:function(resp){
        home.NS_LOADING.hideLoading();
        var _msg ="Dematerializzata: Aggiornamento Fallito!";
        NOTIFICA.error({
            message: _msg,
            title: "Error!",
            width: 300
        });
    },
    warnAggiornaDema:function(params){
        var _msg ="Dematerializzata Bloccata: Effettuare il non erogato Oppure Creare una ricetta Aggiuntiva!";
        NOTIFICA.warning({
            message: _msg,
            title: "Error!",
            width: 300
        });
    },
    okCreaRicettaRossa:function(resp){
        home.NS_LOADING.hideLoading();
        var _msg ="Ricetta Rossa creata!";
        NOTIFICA.success({
            message: _msg,
            title: "Success!",
            width: 300
        });
    },
    koCreaRicettaRossa:function(resp){
        home.NS_LOADING.hideLoading();
        var _msg ="Ricetta Rossa fallita!";
        NOTIFICA.error({
            message: _msg,
            title: "Error!",
            width: 300
        });
    },
    setDati:function(dati){
        this.dati = dati;
        NS_GESTIONE_RICETTE.LOGGER.debug("Dati settati Default: "+JSON.stringify(this.dati));
    },
    okCreaDema:function(params){
        home.NS_LOADING.hideLoading();
        NOTIFICA.success({
            message: "Dematerializzata Creata con Sucesso!",
            title: "Success!",
            width: 200
        });
        $("#butCreaRicetta").hide();
    },
    koCreaDema:function(params){
        home.NS_LOADING.hideLoading();
        var _msg ="Dematerializzata Fallita!";
        if(typeof params.message!='undefined'){
            _msg=params.message;
        }
        NOTIFICA.error({
            message: _msg,
            title: "Error!",
            width: 200
        });
    },
    checkCreaDema:function(params){
        var $this=this;
        var bol = true;

        if($this.getDati("provenienza")==""){
            bol = false;
        }

        if($this.getDati("tipo_provenienza") !="ESTERNO"){
            bol = false;
        }
        NS_GESTIONE_RICETTE.LOGGER.debug("checkCreaDema : "  + bol);
        return bol;
    },
    getDatiCreaDema:function(){

        var $this = this;
        var obj = new Object();
        obj.iden_anagrafica= $this.getDati("iden_anagrafica");
        obj.codice_fiscale_medico=$this.getDati("codice_fiscale_medico");
        obj.quesito= $this.getDati("quesito");
        obj.esenzioni=[];
        obj.esenzioni = $this.getDati("esenzioni");
        obj.prestazioni=[];
        obj.prestazioni = $this.getDati("prestazioni");
        obj = [obj];
        NS_GESTIONE_RICETTE.LOGGER.debug("RIS - getDatiCreaDema()" + JSON.stringify(obj));
        return JSON.stringify(obj);
        /*{"iden_anagrafica":"12345","codice_medico":"ABCD12","codice_esenzione_1":"C01", "codice_esenzione_2":"L01","prestazioni":[{"codice_prestazione":"ABCD"},{"codice_prestazione":"ERT"}],"esenzioni":[{"codice_esenzione":"C01"},{"codice_esenzione":"E01"}]}*/
    },
    addImpegnativa : function (resp){
        NS_GESTIONE_RICETTE.LOGGER.debug("addImpegnativa() - Elaborazione");
        var $this = this;
        var obj = eval ("(" + resp + ")");
        var id_impegnativa = obj.iden_impegnativa;
        var esito=obj.esito;

        if(esito =="OK"){
            NS_GESTIONE_RICETTE.LOGGER.debug("addImpegnativa() - Esito : " + esito);

            $.Map.each(home.SCHEDA_ESAME.exams._DATI,function(k1,v1){
                if(typeof v1.dati.id_esame_dettaglio =='undefined'){
                    /*flag_ricetta=true;
                     params.prestazioni.push({"codice_prestazione":v1.dati.iden});*/
                    NS_GESTIONE_RICETTE.LOGGER.debug("addImpegnativa() - Added");
                    v1.dati.impegnativa.iden = id_impegnativa;
                }
            });
            return true;
        }else{
            return false;
        }

    },
    isDema:function(params){
        if(params.TIPO_RICETTA =="NRE"){
            return true;
        }else{
            return false;
        }
    },
    beforeAggiornaDema:function(params){
        var $this = this;
        return $this.isDema(params);
    },
    aggiornaDemaCancellazione:function(params){

    },
    aggiornaDemaEsecuzione:function(params,rec,utente){
        home.NS_ESAMI.doEsegui2(rec,utente);
    },
    aggiornaDema:function(params,rec,utente){
        var $this = this;
        var _service="";
        var _data;
        switch(params.TIPO_OPERAZIONE){
            case "U":{
                var _obj = new Object();
                _service="BLOCCO_RICETTA";
                _obj.IDEN_ESAME_DETTAGLIO=typeof params.IDEN_DETTAGLIO =="undefined"?"":params.IDEN_DETTAGLIO;
                _obj.IDEN_ESAME_TESTATA=typeof params.IDEN_TESTATA=="undefined"?"":params.IDEN_TESTATA;
                _obj.TIPO_OPERAZIONE=params.TIPO_OPERAZIONE;
                var elem = new Object();
                elem["elem"]=_obj;
                elem["operazione"]="U";
                _data = JSON.stringify([elem]);
            }

        }

        $.support.cors = true;
        $.ajax({
            url:baseGlobal.URL_DEMA_FENIX_MIDDLEWARE +"/BLOCCO_RICETTA",
            type:"POST",
            data:{"value":_data} ,
            success: function( rsp ){
                var v_xml1="";
                try{
                    v_xml1= (new XMLSerializer()).serializeToString(rsp);
                }catch(e){
                    if (typeof rsp.xml =='undefined'){
                        v_xml1=rsp;
                    }else{
                        v_xml1 = rsp.xml;
                    }

                }
                $.ajax({
                    url:"http://127.0.0.1:8000",
                    type:"POST",
                    data:v_xml1,
                    dataType:"xml",
                    contentType:"application/xml",
                    success: function ( resp ){
                        var v_xml;
                        try{
                            v_xml= (new XMLSerializer()).serializeToString(resp);
                        }catch(e){
                            if (typeof resp.xml =='undefined'){
                                v_xml=resp;
                            }else{
                                v_xml = resp.xml;
                            }
                        }
                        var _obj2 = new Object();
                        _obj2["elem"] = {"xmlResponse":v_xml};
                        _obj2["operazione"] = "R";
                        var _data = JSON.stringify([_obj2]);

                        $.ajax({
                            url:baseGlobal.URL_DEMA_FENIX_MIDDLEWARE +"/BLOCCO_RICETTA",
                            type:"POST",
                            data:{"value":_data},
                            success: function( resp ){

                                var obj = eval ("(" + resp + ")");
                                if(obj.esito =="OK"){
                                    home.NS_ESAMI.doEsegui2(rec,utente);
                                    $this.okAggiornaDema(resp);
                                }else if(obj.esito =="TT"){

                                    var _obj = new Object();
                                    _service="BLOCCO_RICETTA";
                                    _obj.IDEN_ESAME_DETTAGLIO=typeof params.IDEN_DETTAGLIO =="undefined"?"":params.IDEN_DETTAGLIO;
                                    _obj.IDEN_ESAME_TESTATA=typeof params.IDEN_TESTATA=="undefined"?"":params.IDEN_TESTATA;
                                    _obj.TIPO_OPERAZIONE='T';
                                    var _obj2 = new Object();
                                    _obj2["operazione"] = "T";
                                    _obj2["elem"] =_obj;
                                    var _data = JSON.stringify([_obj2]);
                                    $.ajax({
                                        url:baseGlobal.URL_DEMA_FENIX_MIDDLEWARE +"/BLOCCO_RICETTA",
                                        type:"POST",
                                        data:{"value":_data},
                                        success:function(resp){
                                            home.NS_ESAMI.doEsegui2(rec,utente);
                                        },error:function(resp){
                                            $this.koAggiornaDema();
                                        }
                                    });
                                    $this.okAggiornaDema(resp);

                                }else{
                                    var _obj = new Object();
                                    _service="BLOCCO_RICETTA";
                                    _obj.IDEN_ESAME_DETTAGLIO=typeof params.IDEN_DETTAGLIO =="undefined"?"":params.IDEN_DETTAGLIO;
                                    _obj.IDEN_ESAME_TESTATA=typeof params.IDEN_TESTATA=="undefined"?"":params.IDEN_TESTATA;
                                    _obj.TIPO_OPERAZIONE='K';
                                    var _obj2 = new Object();
                                    _obj2["operazione"] = "K";
                                    _obj2["elem"] =_obj;
                                    var _data = JSON.stringify([_obj2]);
                                    $.ajax({
                                        url:baseGlobal.URL_DEMA_FENIX_MIDDLEWARE +"/BLOCCO_RICETTA",
                                        type:"POST",
                                        data:{"value":_data},
                                        success:function(resp){
                                            var _msg ="Dematerializzata Bloccata: Effettuare il non erogato oppure creare un'aggiuntiva!";
                                            $this.warnAggiornaDema(resp);
                                        },error:function(resp){
                                            $this.koAggiornaDema(resp);
                                        }
                                    });
                                }
                            },
                            error: function( resp ){
                                $this.koAggiornaDema(resp);
                            }
                        });
                    },
                    error: function ( resp ){
                        var _obj = new Object();
                        _service="BLOCCO_RICETTA";
                        _obj.IDEN_ESAME_DETTAGLIO=typeof params.IDEN_DETTAGLIO =="undefined"?"":params.IDEN_DETTAGLIO;
                        _obj.IDEN_ESAME_TESTATA=typeof params.IDEN_TESTATA=="undefined"?"":params.IDEN_TESTATA;
                        _obj.TIPO_OPERAZIONE='T';
                        var _obj2 = new Object();
                        _obj2["operazione"] = "T";
                        _obj2["elem"] =_obj;
                        var _data = JSON.stringify([_obj2]);
                        $.ajax({
                            url:baseGlobal.URL_DEMA_FENIX_MIDDLEWARE +"/BLOCCO_RICETTA",
                            type:"POST",
                            data:{"value":_data},
                            success:function(resp){
                                home.NS_ESAMI.doEsegui2(rec,utente);
                            },error:function(resp){
                                $this.koAggiornaDema(resp);
                            }
                        });
                        $this.koAggiornaDema(resp);
                    }

                });
            },
            error: function( resp ){
                $this.koAggiornaDema(resp);
            }
        });
    }
}

var _RICETTA_ADS = {
    init:function(){
    },
    setDati:function(dati){
        this.dati = dati;
        NS_GESTIONE_RICETTE.LOGGER.debug("Dati settati ADS: "+JSON.stringify(this.dati));
    },
    setEvents:function(){
        var $this = this;
    },
    apriPRR:function(idStruttura,idPresidio,IdenTestata,IdenDettaglio){
        var p = {"pIdenTestata":IdenTestata,"pIdenDettaglio":IdenDettaglio,"vCodiceFiscaleMed":home.baseUser.CODICE_FISCALE,"idStruttura":idStruttura,"idPresidio":idPresidio};
        toolKitDB.executeFunctionDatasource("GESTIONE_RIS_IMPEGNATIVE.APRIPRRADS","POLARIS_DATI",p,function(r){
            var status = r.p_result.split('$')[0];
            var msg = r.p_result.split('$')[1];
            if(status == 'OK')
            {
                var v_js = $.parseJSON(msg);
                $("#prr").attr("action",v_js.url);
                $("#prr").append($(document.createElement("input")).attr({"type":"text","name":"ASSISTITO","value":v_js.id}));
                $("#prr").append($(document.createElement("input")).attr({"type":"text","name":"EVENTO","value":v_js.evento}));
                $("#prr").append($(document.createElement("input")).attr({"type":"text","name":"CODICE_FISCALE","value":v_js.codice_fiscale}));
                $("#prr").append($(document.createElement("input")).attr({"type":"text","name":"HASH","value":v_js.token}));
                $("#prr").append($(document.createElement("input")).attr({"type":"text","name":"DATA","value":v_js.data}));
                $("#prr").submit();
                $.dialog.hide();
            }
            else
            {
                alert(status);
            }

        });
    },
    aggiornaDemaCancellazione:function(params){
    },
    aggiornaDemaEsecuzione:function(params,rec,utente){
        var $this = this;
        $this.aggiornaDema(params,rec,utente);
    },
    apriContextPage:function(params){
        var $this = this;
        var param = {"iden_per" : home.baseUser.IDEN_PER};
        toolKitDB.getResult("WORKLIST.USER_CDC_ASSOCIATI",param,null,function(resp){
                var $form = $(document.createElement("form")).attr({"id":"prr","name":"prr","target":"_blank","action":"","method":"post"});
                var listaCDC = $(document.createElement('ul')).attr({
                    "class": "UlList", "id": "listaCDC"
                });
                $.each(resp,function(idx,el){

                    $(document.createElement('li')).attr({"id": el.IDEN,"struttura":el.ID_STRUTTURA,"presidio":el.ID_PRESIDIO}).html(el.DESCRIZIONE)
                        .on('click', function ()
                        {
                            $this.apriPRR(el.ID_STRUTTURA, el.ID_PRESIDIO,params[0].IDEN_TESTATA,params[0].IDEN_DETTAGLIO );
                        })
                        .appendTo(listaCDC);

                });
                $form.append(listaCDC);
                $.dialog($form,
                    {
                        title: "Scelta Presidio",
                        showBtnClose: false,
                        buttons: [
                            {"label": "Annulla", "action": function ()
                            {
                                $.dialog.hide();
                                return false;
                            }}
                        ],
                        width: 300
                    }
                );
        });
    },
    creaDemaWK:function(params){
      var $this = this;$this.apriContextPage(params);
    },
    creaDema:function(params){
        var $this = this;

        /*if($this.dati == null){
            $this.apriContextPage(params);
            return;
        } */

        if(!$this.checkCreaDema(params)){
            var err={};
            err.message="Dematerializzata Non Prevista!";
            $this.koCreaDema(err);
            return;
        }
        if(!$this.beforeCreaDema(params)){return;}
        $.support.cors = true;
        $.ajax({
            url: baseGlobal.URL_DEMA_FENIX_MIDDLEWARE +"/GET_INPUT_XML",
            type: "POST",
            data: {"value":$this.getDatiCreaDema(params)},
            cache: false,
            async:false,
            success: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("creaDema XML Creato: " + resp);
                $this.callSessionExternal(resp);
            },
            error: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("XMLINPUT Error - " + resp);
                $this.koCreaDema({message:'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    },
    callSessionExternal:function(resp){
        NS_GESTIONE_RICETTE.LOGGER.debug("callSessionExternal() " + resp);
        var $this = this;
        $.support.cors = true;
        $.ajax({
            url: "http://10.67.2.11:8080/sa4prrWS/sa4prrService",
            type: "POST",
            data: resp,
            cache: false,
            contentType:"text/xml",
            async:false,
            processData:false,
            success: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("callSessioneExternal() OK; " + resp);
                $this.elabResponse(resp);
            },
            error: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("callSessioneExternal() - error " + JSON.stringify(resp));
                $this.koCreaDema({message:'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    },
    elabResponse:function(resp){
        NS_GESTIONE_RICETTE.LOGGER.debug("elabResponse(); resp" + resp);
        var xml;
        try{
            xml = (new XMLSerializer()).serializeToString(resp);
        }catch(E){
            xml = resp.xml;
        }
        var elem = new Object();
        elem["xmlResponse"] = xml;
        var response = JSON.stringify([elem]);
        /*var xml = resp;*/
        NS_GESTIONE_RICETTE.LOGGER.debug("elabResponse() XML;" + xml);
        var $this = this;
        $.support.cors = true;
        $.ajax({
            url: baseGlobal.URL_DEMA_FENIX_MIDDLEWARE + "/OUTPUT",
            type: "POST",
            data: {"value":response},
            cache: false,
            async:false,
            success: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("elabResponse() OK; " + resp);
                $this.callExternalService(resp);
            },
            error: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("elabResponse() - error " + resp);
                $this.koCreaDema({message:'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    },
    idSessionePrescrittiva:null,
    callExternalService:function(resp){
        var $this = this;
        var obj = eval ("(" + resp + ")");
        NS_GESTIONE_RICETTE.LOGGER.debug("callExternalService() " + JSON.stringify(obj));
        $this.idSessionePrescrittiva = obj.idSessionePrescrittiva;
        var data="RICETTA_CARRELLO_ID="+obj.idSessionePrescrittiva+"&CODICE_FISCALE="+$this.getDati("codice_fiscale_medico");
        //home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=DEMA_EXTERNAL_PAGE&data='+data,id:'SchedaDemaExternal',fullscreen:true});
        window.open("http://10.67.2.11:8080/sa4prr/common/PrrPortalPre.do?"+data);
    },
    getDema:function(params){
        var $this = this;
        var v_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.finmatica.it/schema"><soapenv:Header/><soapenv:Body><sch:Request><sch:Message><![CDATA['
        v_xml += '<esitoPrescrizioneRequest><prescrizioneRegistrata><idSessionePrescrittiva>'+$this.idSessionePrescrittiva+'</idSessionePrescrittiva></prescrizioneRegistrata></esitoPrescrizioneRequest>]]>';
        v_xml += '</sch:Message><sch:Creator>ELCO</sch:Creator></sch:Request></soapenv:Body></soapenv:Envelope>';

        $.ajax({
            url: "http://10.67.2.11:8080/sa4prrWS/sa4prrService",
            type: "POST",
            data: v_xml,
            cache: false,
            contentType:"text/xml",
            async:false,
            processData:false,
            success: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("getSessione() OK; " + resp);
                $this.elabEsito(resp);
            },
            error: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("getSessione() - error " + JSON.stringify(resp));
                $this.koCreaDema({message:'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    },
    elabEsito:function(resp){
        var $this = this;
        var xml;
        try{
            xml = (new XMLSerializer()).serializeToString(resp);
        }catch(E){
            xml = resp.xml;
        }
        var elem = new Object();
        elem["xmlResponse"] = xml;
        var response = JSON.stringify([elem]);
        NS_GESTIONE_RICETTE.LOGGER.debug("elabEsito() JSON " + response);

        $.support.cors = true;
        $.ajax({
            url: baseGlobal.URL_DEMA_FENIX_MIDDLEWARE + "/OUTPUT_ESITO",
            type: "POST",
            data: {"value":response},
            cache: false,
            async:false,
            success: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("elabEsito() OK; " + resp);
                /*var add = $this.addImpegnativa(resp);*/
                var add = home.SE_RICETTA.addImpegnativa(resp);
                if(add){
                    $this.okCreaDema();
                }else{
                    $this.koCreaDema({message:'Errore Scarico! Dematerializzata non riuscita'});
                }

            },
            error: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("elabEsito() - error " + resp);
                $this.koCreaDema({message:'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });

    }
}

var _RICETTA_SIRE ={
    init:function(){
    },
    getDema:function(param){
        var $this = this;
        if(!$this.beforeGetDema(param)){
             return;
        }
        var _url = home.baseGlobal.URL_DEMA_HL7_MIDDLEWARE + "/dema/services/scarico?NRE="+param.nre+"&CODICE_FISCALE_PAZIENTE="+param.codice_fiscale+"&CODICE_FISCALE_OPERATORE="+home.baseUser.CODICE_FISCALE
        +"&CODOP="+home.baseUser.CODICE_DECODIFICA+"&CODICE_AUSL_OPERATORE=010211&TIPORICHIESTA="+param.tipo_richiesta+"&RECUPERODATI_OSC=&COD_PRESCRIZIONE_REGIONALE=&CODICE_STRUTTURA="+param.codice_struttura;    //001062     000334

        var fxcall =  eval("("+ param.fx+")");
        $.support.cors = true;
        $.ajax({
            url:_url ,
            success:function(resp){
                $this.okGetDema(resp);
                fxcall(resp);
            },
            error: function(resp){
                $this.koGetDema(resp);
                fxcall(resp);
            }
        });
    },
    okGetDema:function(resp){
        NS_GESTIONE_RICETTE.LOGGER.debug("SIRE ok!: "+JSON.stringify(resp));
        var _msg ="Dematerializzata Scaricata!";
        home.NOTIFICA.success({
            message: _msg,
            title: "Success!",
            width: 300
        });
    },
    koGetDema:function(resp){
        NS_GESTIONE_RICETTE.LOGGER.error("SIRE ko!: "+JSON.stringify(resp));
        var _msg ="Scarico Fallito!";
        if(typeof resp!='undefined'){
            _msg=JSON.stringify(resp);
        }
        home.NOTIFICA.error({
            message: _msg,
            title: "Error!",
            timeout:5,
            width: 500
        });
    },
    setDati:function(dati){
        this.dati = dati;
        NS_GESTIONE_RICETTE.LOGGER.debug("Dati settati SIRE: "+JSON.stringify(this.dati));
    },
    setEvents:function(){
        var $this = this;
    },
    creaDema:function(params){
        var $this = this;
        NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - creaDema() url: " +  baseGlobal.URL_DEMA_FENIX_MIDDLEWARE +"/GET_INPUT_XML");
        if(!$this.checkCreaDema(params)){
            var err={};
            err.message="Dematerializzata Non Prevista!";
            $this.koCreaDema(err);
            return;
        }
        if(!$this.beforeCreaDema(params)){return;}
        $.support.cors = true;
        $.ajax({
            url: baseGlobal.URL_DEMA_FENIX_MIDDLEWARE +"/GET_INPUT_XML",
            type: "POST",
            data: {"value":$this.getDatiCreaDema(params)},
            cache: false,
            async:false,
            /*dataType: "json",*/
            success: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - Xml Input Creato: " + resp);
                $this.callSessionExternal(resp);
            },
            error: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - Xml Input Error - " + resp);
                $this.koCreaDema({message:'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    },
    callSessionExternal:function(resp){
        var $this = this;
        /*chiamare servizio per aver l'id session*/
        $this.elabResponse(resp);
    },
    elabResponse:function(resp){
        var xml;
        try{
            xml = (new XMLSerializer()).serializeToString(resp);
        }catch(E){
            xml = resp.xml;
        }
        NS_GESTIONE_RICETTE.LOGGER.debug("elabResponse();" + xml);
        var $this = this;
        $.support.cors = true;
        $.ajax({
            url: baseGlobal.URL_DEMA_FENIX_MIDDLEWARE + "/OUTPUT",
            type: "POST",
            data: {"xmlResponse":xml},
            cache: false,
            async:false,
            success: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - elabResponse(): OK");
                $this.callExternalService(resp);
            },
            error: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - elabResponse(): Error");
                $this.koCreaDema({message:'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    },
    callExternalService:function(resp){
        var $this = this;
        var _url=resp.URL_POST;
        $.ajax({
            url: _url,
            type: "POST",
            /*data: data,*/
            cache: false,
            async:false,
            contentType:"application/form",
            success: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("CallExternal - success " + resp);
                $this.okCreaDema(resp);
            },
            error: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("CallExternal - error " + resp);
                $this.koCreaDema({message:'Errore duranta la chiamata al software di PRESCRIZIONE.'});
            }
        });
    },
    getDatiCreaDema:function(){

        var $this = this;
        var obj = new Object();
        obj.iden_anagrafica=$this.getDati("iden_anagrafica");
        obj.codice_medico=$this.getDati("codice_medico");
        obj.esenzioni=[];
        $.each($this.getDati("esenzioni"),function(k,v){
            obj["codice_esenzione_" + k] = v.codice_esenzione;
        });
        obj.esenzioni.push($this.getDati("esenzioni"));
        obj.prestazioni=[];
        obj.prestazioni.push($this.getDati("prestazioni"));
        obj = [obj];
        NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - getDatiCreaDema()" + JSON.stringify(obj));
        return JSON.stringify(obj);
        /*{"iden_anagrafica":"12345","codice_medico":"ABCD12","codice_esenzione_1":"C01", "codice_esenzione_2":"L01","prestazioni":[{"codice_prestazione":"ABCD"},{"codice_prestazione":"ERT"}],"esenzioni":[{"codice_esenzione":"C01"},{"codice_esenzione":"E01"}]}*/
    },
    aggiornaDemaCancellazione:function(params){
        var $this = this;
        $this.aggiornaDema(params);
    },
    aggiornaDema:function(param){
        var $this = this;
        //if(!$this.beforeAggiornaDema(param)){
        //    return;
        //}
        var v_operazione = param.operazione =="I"?"5":param.operazione =="U"?"2":param.operazione =="D"?"3":"";
        var v_cod_struttura= param.codice_struttura;
        var _url =         home.baseGlobal.URL_DEMA_HL7_MIDDLEWARE + "/dema/services/scarico?NRE="+param.nre+"&CODICE_FISCALE_PAZIENTE="+param.codice_fiscale_paziente+"&CODICE_FISCALE_OPERATORE="+home.baseUser.CODICE_FISCALE
        +"&CODOP="+home.baseUser.CODICE_DECODIFICA+"&CODICE_AUSL_OPERATORE=010211&TIPORICHIESTA="+v_operazione+"&RECUPERODATI_OSC=&COD_PRESCRIZIONE_REGIONALE=&CODICE_STRUTTURA="+v_cod_struttura;    //001062     000334

        NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - aggiornaDema() - updating : "+ JSON.stringify(param));

        $.support.cors = true;
        $.ajax({
            url:_url ,
            success:function(resp){
                $this.okDemaUpdate(resp,param);
                NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - aggiornaDema() - success");
                //fxcall(resp);
            },
            error: function(resp){
                NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - aggiornaDema() - error");
                $this.koAggiornaDema(resp,v_operazione);
                //fxcall(resp);
            }
        });
    },
    okDemaUpdate:function(resp,param){
        var $this = this;
        NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - okDemaUpdate()");
        $this.okAggiornaDema(resp);
        if(param.operazione == "U"){
            var pr = {pNumeroImpegnativa:param.nre,pStato:"S"};
            toolKitDB.executeFunction("GESTIONE_RIS_IMPEGNATIVE.UPDATE_IMPEGNATIVA_STATUS",pr,function(response){
                NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - okDemaUpdate() - DB");
                home.SE_RICETTA.okAggiornaDema(resp);
            });
        }
        if(param.operazione =="D"){
            var pr = {pNumeroImpegnativa:param.nre,pStato:"D"};
            toolKitDB.executeFunction("GESTIONE_RIS_IMPEGNATIVE.UPDATE_IMPEGNATIVA_STATUS",pr,function(response){
                NS_GESTIONE_RICETTE.LOGGER.debug("SIRE - okDemaUpdate() - DB");
            });
        }
    }

}

var _RICETTA_SOLE={
}

var _RICETTA_SANTER={
    init:function(){
    },
    setDati:function(dati){
        this.dati = dati;
        NS_GESTIONE_RICETTE.LOGGER.debug("Dati settati SANTER: "+JSON.stringify(this.dati));
    },
    aggiornaDemaCancellazione:function(params){},
    aggiornaDemaEsecuzione:function(params,rec,utente){
        var $this = this;
        $this.aggiornaDema(params,rec,utente);
    },
    setEvents:function(){
        var $this = this;
    },
    creaDema:function(params) {
        var $this = this;
        if (!$this.checkCreaDema(params)) {
            var err = {};
            err.message = "Dematerializzata Non Prevista!";
            $this.koCreaDema(err);
            return;
        }
        if (!$this.beforeCreaDema(params)) {
            return;
        }
        $.support.cors = true;
        $.ajax({
            url: baseGlobal.URL_DEMA_FENIX_MIDDLEWARE + "/GET_INPUT_XML",
            type: "POST",
            data: {"value": $this.getDatiCreaDema(params)},
            cache: false,
            dataType: "text",
            crossDomain:true,
            success: function (resp) {
                NS_GESTIONE_RICETTE.LOGGER.debug("creaDema XML Creato: " + resp);
                $this.callSessionExternal(resp);
            },
            error: function (resp) {
                NS_GESTIONE_RICETTE.LOGGER.debug("XMLINPUT Error - " + resp);
                $this.koCreaDema({message: 'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    },
    callSessionExternal:function(params){
        var $this = this;
        $.support.cors = true;
        $.ajax({
            url: "http://localhost:8047" ,
            data:params,
            cache: false,
            async: false,
            type: "POST",
            contentType:"text/xml",
            success: function(resp){
                $this.elabEsito(resp);
            },
            error:function(resp){
                NS_GESTIONE_RICETTE.LOGGER.debug("XMLINPUT Error - " + resp);
                $this.koCreaDema({message: 'Errore comunicazione con SANTER.'});
            }
        });
    },
    elabEsito:function(params){
        var xml = (new XMLSerializer()).serializeToString(resp);
        NS_GESTIONE_RICETTE.LOGGER.debug("elabEsito();" + xml);
        var $this = this;
        $.support.cors = true;
        $.ajax({
            url: baseGlobal.URL_DEMA_FENIX_MIDDLEWARE + "/OUTPUT_ESITO",
            type: "POST",
            data: {"xmlResponse":xml},
            cache: false,
            async:false,
            success: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("elabEsito() OK; " + resp);
                var add = $this.addImpegnativa(resp);
                if(add){
                    $this.okCreaDema();
                }else{
                    $this.koCreaDema({message:'Errore Scarico! Dematerializzata non riuscita'});
                }
            },
            error: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("SANTER - elabResponse(): Error");
                $this.koCreaDema({message:'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    }
}

var _RICETTA_GPI={
    GPI_ORGANIZATIONID:"CAM",
    GPI_PERSONID:"2597225",
    GPI_UNITID:"1M100262602",
    GPI_SITEID:"01M",
    GPI_USERNAME:baseUser.USERNAME,
    GPI_PASSWORD:"7C222FB2927D828AF22F592134E8932480637C0D",
    GPI_CALLER :"FENIX",
    GPI_MODULE :"CPOE",
    GPI_ACTION  :"medicalprescription",
    creaDema:function(rec){
        var $this = this;
        $this.allineaDati(rec);
    },
    allineaDati:function(rec){
        var $this = this;
        var pIdenTestate=[];
        $.each(rec,function(k,v){
            pIdenTestate.push(v.IDEN_TESTATA);
        });

        var param= {'pIdenEsamiTestata':pIdenTestate.toString()};
        NS_GESTIONE_RICETTE.LOGGER.info("Chiamata GESTIONE_RIS_IMPEGNATIVE.get_dettagli_from_testata con parametri: " + JSON.stringify(param));

        toolKitDB.executeFunction('GESTIONE_RIS_IMPEGNATIVE.get_dettagli_from_testata', param, function( response )
        {
            NS_GESTIONE_RICETTE.LOGGER.debug('Risposta GESTIONE_RIS_IMPEGNATIVE.get_dettagli_from_testata: ' + response.p_result);
            var status	= response.p_result.split('$')[0];
            var msg		= response.p_result.split('$')[1];

            if( status == 'OK' ){
                $this.callMiddleware(rec,$.parseJSON(msg));
            }
            else
                home.NOTIFICA.error( { message : msg, title : 'Errore!' } )

        });
    },
    callMiddleware:function(rec,dati_esami){
        var $this = this;

        var par = new Object();
        par.ORGANIZATIONID = _RICETTA_GPI.GPI_ORGANIZATIONID;
        par.PERSONID = rec[0].ID_ANAGRAFICA_CENTRALE;
        par.UNITID = _RICETTA_GPI.GPI_UNITID;
        par.SITEID = _RICETTA_GPI.GPI_SITEID;
        var token= new Object();
        token.USERNAME = _RICETTA_GPI.GPI_USERNAME;
        token.PASSWORD = _RICETTA_GPI.GPI_PASSWORD;
        token.CALLER = _RICETTA_GPI.GPI_CALLER
        token.MODULE = _RICETTA_GPI.GPI_MODULE
        token.ACTION = _RICETTA_GPI.GPI_ACTION;
        token.PARAMS = par;
        token.CODICI_PRESTAZIONI = dati_esami.cod_nomenclatori.split(",");

        var obj = new Object();
        obj.TOKEN_REQUEST=token;
        NS_GESTIONE_RICETTE.LOGGER.debug("GPI - callMiddleware con parametri: " + JSON.stringify(obj));


        $.ajax({
            url: "http://10.69.24.219:7001/ePrescriptionOpera/Login",
            type: "POST",
            data: JSON.stringify(obj),
            cache: false,
            async:false,
            contentType:"text/plain",
            success: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("ePrescriptionOpera/Login: " + resp);
                var status	= resp.split('$')[0];
                var msg		= resp.split('$')[1];
                if(status == 'OK')
                {
                    var params={"pIdensEsamiDettaglio":dati_esami.iden_dettagli,"pToken":msg.toString(),"pUtente":home.baseUser.USERNAME};
                    NS_GESTIONE_RICETTE.LOGGER.info("Chiamata GESTIONE_RIS_IMPEGNATIVE.update_impegnativa_gpi con parametri: " + JSON.stringify(params));
                    toolKitDB.executeFunction('GESTIONE_RIS_IMPEGNATIVE.update_impegnativa_gpi', params, function( response )
                    {

                        var status	= response.p_result.split('$')[0];


                        if( status == 'OK' ){
                            //window.open("http://srvmvihopapp2.asl16.sys/hopera/openmodule?token=" + msg)
                            window.open("http://10.69.26.69/hopera/openmodule?token=" + msg);
                        }
                        else
                            home.NOTIFICA.error( { message : msg, title : 'Errore!' } )

                    });
                }
                else
                {
                    NS_GESTIONE_RICETTE.LOGGER.error("GPI - ePrescriptionOpera: Error");
                    $this.koCreaDema({message:msg});
                }
            },
            error: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.error("GPI - ePrescriptionOpera: Error");
                $this.koCreaDema({message:'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    },

    getDatiCreaDema:function(rec){

        /*var $this = this;
         var par = new Object();
         par.ORGANIZATIONID = _RICETTA_GPI.GPI_ORGANIZATIONID;
         par.PERSONID = rec[0].ID_ANAGRAFICA_CENTRALE;
         par.UNITID = _RICETTA_GPI.GPI_UNITID;
         par.SITEID = _RICETTA_GPI.GPI_SITEID;
         var token= new Object();
         token.USERNAME = _RICETTA_GPI.GPI_USERNAME;
         token.PASSWORD = _RICETTA_GPI.GPI_PASSWORD;
         token.CALLER = _RICETTA_GPI.GPI_CALLER
         token.MODULE = _RICETTA_GPI.GPI_MODULE
         token.ACTION = _RICETTA_GPI.GPI_ACTION;
         token.PARAMS = par;
         token.CODICI_PRESTAZIONI =

         //token.CODICI_PRESTAZIONI.push(param[i].CODICE_NOMENCLATORE);

         var obj = new Object();
         obj.TOKEN_REQUEST=token;
         NS_GESTIONE_RICETTE.LOGGER.debug("GPI - getDatiCreaDema()" + JSON.stringify(obj));
         return JSON.stringify(obj);*/
        /*{"iden_anagrafica":"12345","codice_medico":"ABCD12","codice_esenzione_1":"C01", "codice_esenzione_2":"L01","prestazioni":[{"codice_prestazione":"ABCD"},{"codice_prestazione":"ERT"}],"esenzioni":[{"codice_esenzione":"C01"},{"codice_esenzione":"E01"}]}*/
    }
}

var _RICETTA_NOEMA = {
    TOKEN:null,
    checkCreaDema:function(params){
        return true;
    },
    creaDema:function(params){
        var $this = this;
        if (!$this.checkCreaDema(params)) {
            var err = {};
            err.message = "Dematerializzata Non Prevista!";
            $this.koCreaDema(err);
            return;
        }
        if (!$this.beforeCreaDema(params)) {
            return;
        }
        $.support.cors = true;
        $.ajax({
            url: baseGlobal.URL_DEMA_HL7_MIDDLEWARE + "/GET_INPUT_XML/SINGLE",
            type: "POST",
            data: $this.getDatiCreaDema(params),
            cache: false,
            dataType: "application/json",
            crossDomain:true,
            success: function (resp) {
                NS_GESTIONE_RICETTE.LOGGER.debug("creaDema XML Creato: " + resp);
                $this.callExternalService(resp);
            },
            error: function (resp) {
                NS_GESTIONE_RICETTE.LOGGER.debug("XMLINPUT Error - " + resp);
                $this.koCreaDema({message: 'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    },
    callExternalService:function(resp){
        var $this = this;
        var obj = eval ("(" + resp + ")");
        NS_GESTIONE_RICETTE.LOGGER.debug("callExternalService() " + JSON.stringify(obj));
        $this.TOKEN = obj.TOKEN;
        var data="token="+$this.TOKEN+"&codice_fiscale="+$this.getDati("codice_fiscale_medico")+"&username="+home.baseUser.USERNAME + "&doctorId="+home.baseUser.CODICE_DECODIFICA;
        window.open("http://server:port/community-prescription-frontend-html5/index.html?"+data);
    },
    getDema:function(params){
        var $this = this;
        var v_json = {'STATUS':'OK','TOKEN':$this.TOKEN,'IDEN_MEDICO':home.baseUser.IDEN_PER};

        $.ajax({
            url: baseGlobal.URL_DEMA_HL7_MIDDLEWARE + "/GET_INPUT_XML/SINGLE",
            type: "POST",
            data: v_json,
            cache: false,
            contentType:"application/json",
            async:false,
            processData:false,
            success: function (resp)
            {
                var v_iden_impegnativa = resp;
                var esito ="OK";
                var velem = {'iden_impegnativa':v_iden_impegnativa,'esito':v_esito};
                var add = home.SE_RICETTA.addImpegnativa(velem);
                if(add){
                    $this.okCreaDema();
                }else{
                    $this.koCreaDema({message:'Errore Scarico! Dematerializzata non riuscita'});
                }
            },
            error: function (resp)
            {
                NS_GESTIONE_RICETTE.LOGGER.debug("getSessione() - error " + JSON.stringify(resp));
                $this.koCreaDema({message:'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    },
    creaRicetteMultiple:function(rec){
        var $this = this;
        var _arr =[];
        $.each(rec,function(k,v){
            var _obj = new Object();
            _obj.iden_anagrafica = v[k].IDEN_ANAGRAFICA;
            _obj.iden_testata = v[k].IDEN_TESTATA;
            _obj.codice_fiscale_medico = home.baseUser.CODICE_FISCALE;
            _obj.esenzioni= v[k].ESENZIONI.split(",");
            _obj.prestazioni=v[k].IDEN_NOMENCLATORE.split(",");
            _arr.push(_obj);
        });
        $.support.cors = true;
        $.ajax({
            url: baseGlobal.URL_DEMA_HL7_MIDDLEWARE + "/GET_INPUT_XML/MULTI",
            type: "POST",
            data: _arr,
            cache: false,
            dataType: "application/json",
            crossDomain:true,
            success: function (resp) {
                $this.callExternalService(resp);
                home.DIALOG.showDownloadDema();
            },
            error: function (resp) {
                NS_GESTIONE_RICETTE.LOGGER.debug("XMLINPUT Error - " + resp);
                $this.koCreaDema({message: 'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });
    },
    getDemaMultipla:function(){
        var $this = this;
        if($this.TOKEN == "" || $this.TOKEN == null){
            $this.koGetDema({msg:""});
        }
        var v_json = {'STATUS':'OK','TOKEN':$this.TOKEN,'IDEN_MEDICO':home.baseUser.IDEN_PER};
        $.ajax({
            url: baseGlobal.URL_DEMA_HL7_MIDDLEWARE + "/GET_INPUT_XML/MULTI",
            type: "POST",
            data: v_json,
            cache: false,
            contentType:"application/json",
            async:false,
            processData:false,
            success: function (resp)
            {
                $.each(resp,function(k,v){
                       //row success
                    $this.TOKEN = null;
                });
            },
            error: function (resp)
            {
                $this.koCreaDema({message:'Errore comunicazione con il MIDDLEWARE FENIX.'});
            }
        });

    }
}

var RICETTA_ADS = $.extend({},RICETTA_RIS,_RICETTA_ADS);
var RICETTA_GPI = $.extend({},RICETTA_RIS,_RICETTA_GPI);
var RICETTA_SIRE = $.extend({},RICETTA_RIS,_RICETTA_SIRE);
var RICETTA_SOLE = $.extend({},RICETTA_RIS,_RICETTA_SOLE);
var RICETTA_SANTER = $.extend({},RICETTA_RIS,_RICETTA_SANTER);
var RICETTA_NOEMA = $.extend({},RICETTA_RIS,_RICETTA_NOEMA);
