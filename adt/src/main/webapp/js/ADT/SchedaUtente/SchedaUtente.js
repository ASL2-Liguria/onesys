var _stato_pagina;
$("document").ready(function(){
    NS_UTENTE.init();
    NS_UTENTE.setEvents();
    NS_FENIX_SCHEDA.registra=NS_UTENTE.registra;
    _stato_pagina = $("#STATO_PAGINA").val();
});

var NS_UTENTE = {
    $extern:null,
    init:function(){
        top.NS_CONSOLEJS.addLogger({name:'schedaUtente',console:0});
        window.logger = top.NS_CONSOLEJS.loggers['schedaUtente'];
//        NS_FENIX_SCHEDA.addFieldsValidator({config: 'V_UTENTI'});
        NS_FENIX_SCHEDA.customizeParam = myCustomizeParam;
        $("#ComboInGruppiCDC").css({height:'200px'});
        $("#ComboOutGruppiCDC").css({height:'200px'});

        function myCustomizeParam(param)
        {
            param.extern = false;
            param.close = true;
            param.refresh = true;
            return param;
        }

        NS_UTENTE.$extern = $("#EXTERN");
    },

    setEvents:function(){
        $("#h-radmedinf").on("change",function(){
            $('#acUteAttivita').data('acList').changeBindValue({"tipo_personale":$('#h-radmedinf').val()});
        });


    },
    registra:function(){
        var username, psw, utente, tipo_utente,  lingua, contextmenu, poceduraADT, proceduraWHALE, cdc ='',gruppi = '';
        username = $("#txtUsername").val();
        psw = $("#txtpassword").val();
        utente = $("#h-txtUte").val();
        tipo_utente = $("#h-radmedinf").val();
        $("#ComboOutGruppiUtente option").each(function(i)
        {
            if(i==0){
                gruppi = this.value;}else{
                gruppi = gruppi +"."  + this.value;
            }

        });
        lingua = $("#cmbLingua").find("option:selected").val();
        contextmenu = $("#h-radContext_Menu_Default").val();
        $("#ComboOutGruppiCDC option").each(function(i){
            if(i==0){cdc = this.value;}else{
                cdc = cdc+ "|"+  this.value;
            }
        });

        var dbADT = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
        var dbWHALE = $.NS_DB.getTool({setup_default:{datasource:'WHALE'}});
        var parametri = {
            "pWebUser":username,
            "pPassw":psw,
            "pIdenPer":utente,
            "pMenuGruppo":gruppi,
            "pContextMenu":contextmenu,
            "pCodiceSmartCart":"",
            "pLingua":lingua,
			"pSito" : "ADT"
        };
        var paramsWhale =
        {
            pWebUser:username,
            pPassw:psw,
            pTipo:tipo_utente,
            pIdenPer:utente,
            pCodOpe:"",
            pLivello:"0",
            pReparti:cdc,
            pCodiceSmartCart:""

        };
        if (_stato_pagina == 'I'){
            proceduraWHALE = 'CREATEUSERFORADT';
            poceduraADT = 'CREATEUSERFENIX_TEST';
        }else{
            proceduraWHALE =  'UpdateUserForADT';
            poceduraADT = 'UPDATEUSERFENIX_TEST';
            parametri.pWebUserOld =  jsonData.Username;
            paramsWhale.pWebUserOld = jsonData.Username;
            /*jsondata*/

            //salvataggio in update
            //updateUserFenix (pWebUserOld , pWebUser ,pPassw , pIdenPer , pMenuGruppo , pContextMenu )
            //UpdateUserForADT (pWebUserOld , pWebUser , pPassw , pTipo , pIdenPer , pCodOpe , pLivello ,pReparti , pCodiceSmartCart)
        }

        var xhr = dbADT.call_function(
            {
                id: poceduraADT,
                parameter : parametri

            });
        xhr.done(function (data, textStatus, jqXHR) {
            if(data.p_result.toString()== 'OK'){
                //creiamo l'utente anche su whale

                var xhrWhale = dbWHALE.call_function({
                    id: proceduraWHALE,
                    parameter : paramsWhale
                });
                xhrWhale.done(function(data, textStatus, jqXHR){
					home.NOTIFICA.success({message: "Utente creato/aggiornato correttamente", timeout:3, title: "Success"});
                });
                xhrWhale.fail(function(jqXHR, textStatus, errorThrown){
                    home.NOTIFICA.error({message: "Errore nella creazione utenti", timeout:0, title: "Error"});
                    logger.error("CREATEUSERFORADT IN ERRORE = " +JSON.stringify(jqXHR));
                });

            }else{
                home.NOTIFICA.error({message: "Errore nella creazione utenti", timeout:0, title: "Error"});

                logger.error("CREATEUSERFENIX IN ERRORE = " + data.p_result.toString());
            }
            //home.NOTIFICA.success({message: 'Salvataggio dati clinici primo accesso eseguito!', timeout: 1, title: 'Success', width : 220});

        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            logger.error( "chiamata a CREATEUSERFENIX in errore " + JSON.stringify(jqXHR));
            home.NOTIFICA.error({message: "Errore nella creazione utente", timeout:0, title: "Error"});

        });

    }

}
