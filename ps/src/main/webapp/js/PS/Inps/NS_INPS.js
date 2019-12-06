/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * author : matteo.pipitone
 * 
 */

/* global NS_CALL_DB, NS_LOADING, home */

/**
 * core di funzioni dell'inps 
 **/
var NS_INPS = {
    /**
     * funzione di salvataggio dati medici 
     * par {
     * param_medico : {},
     * callbackKO: function,
     * }*/
    saveInfoMedico : function (par) {
        var parameters = {
            datasource: 'MMG',
            id: 'SP_SAVE_INFO_MEDICO',
            params: par.param_medico,
            callbackOK : functionOk
        };

        function functionOk(resp) {
            var result = resp.p_Result;
            $.dialog.hide();
            if(result.split('$')[0] !== 'OK'){   
                home.NOTIFICA.error({message: "Errore nel salvataggio dati",title: "Errore"});                        
                logger.error(resp);
                if(typeof par.callbackKO !== 'undefined'){
                    par.callbackKO(result);
                }
            }else{
               if(typeof par.callbackOK !== 'undefined'){
                    par.callbackOK(result);
                } 
            }      
        };
        NS_CALL_DB.PROCEDURE(parameters);
    },
    /**
     * funzione che restituisce i dati del medico passandogli l'iden_per
     * par {
     *  iden_per:number
     *  callback
     * }*/
     getDatiMedico : function(jsonDati){
        logger.debug("richiamata getDatiMedico con parametri " + JSON.stringify(par));
        var par = {
            datasource : 'MMG',
            id : 'DATI.Q_DATI_INPS_MEDICO',
            params : {iden_per : {t:'N', v:jsonDati.iden_per}},
            callbackOK : callbackOk
        };
        function callbackOk(resp){
            var res = resp.result;
            var responseLength = res.length;                        
            if(responseLength > 0 ){
                if(typeof  jsonDati.callback !== 'undefined'){
                    jsonDati.callback(res);               
                }else{                    
                    logger.debug("DATI MEDICO IMPORTATI CORRETTAMENTE")
                }
            }else{
                logger.error("DATI MEDICO PORTALE INPS NON TROVATI");
            }
        }
         
        NS_CALL_DB.SELECT(par);
    },
    /**
     * funzione per eseguire il login sul portale dell'inps
        par{
            * URL
            * COD_FISC
            * COD_ASL
            * COD_REG
            * PIN
            * USERNAME
            * PWD
            * callBackNotOK
            * callBackOK
            * callBackKO
        }* 
    * 
    */
    eseguiLogin : function (par){
        /**
        
         * */
        var url_proxy = 'proxy?CALL='+par.URL+'&METHOD=GET&PARAM=codFiscPaz='+par.COD_FISC 
        +'::codAsl='+par.COD_ASL +'::codReg='+par.COD_REG+ '::pinCode='+par.PIN+'::userName='+par.USERNAME+'::userPwd='+par.PWD;

        logger.debug('URL di esegui login ->' + url_proxy);
        
        $.support.cors = true;

        NS_LOADING.showLoading({"testo" : "Login in corso", "timeout": 30});

        $.ajax({
            type: "GET",
            url: url_proxy,            
            dataType: "text",
            success: function (resp) {
                resp = resp.replace("\n","");
                resp = resp.replace("\r","");                                               
                logger.debug("RESP LOGIN INPS ->" + resp);
                $.support.cors = false;
                NS_LOADING.hideLoading();
                if (resp !== "OK") {                   

                    var n = resp.indexOf("Credenziali invalide");
                    if(n > 0 ) {
                        home.NOTIFICA.warning({
                            message: 'Credenziali invalide',
                            title: "Errore Login",
                            timeout : 0
                        });
                    }else{
                        home.NOTIFICA.warning({
                            message: 'Errore tentativo di login\n' + resp,
                            title: "Errore Login"
                        });
                    }
                   
                    if(typeof par.callBackNotOK !== 'undefined'){
                        par.callBackNotOK(resp);    
                    }
                    
                    //INPS.dialogSalvataggioDati('loginKO',param_medico);                        

                } else {                    
                    if(typeof par.callBackKO !== 'undefined'){
                        par.callBackOK(resp);    
                    }                                                         
                }

            },               
            error: function (response) {
                NS_LOADING.hideLoading();
                $.support.cors = false;
                home.NOTIFICA.error({
                        message: response.statusText,
                        title: "Errore"
                });
                if(typeof par.callBackKO !== 'undefined'){
                    par.callBackKO(response);    
                }
                
            }
        });
    },
    /**
     * funzione che permette l'invioo dei certificati di malattia 
     * jsonParametri {
     * idenEvento : number
     * Stato : ins/del
     * urlInps : String
     * callback : function
     * callbackKO : function
     * }*/
    inviaCertificatoMalattia : function(jsonParametri){
        
        var StatoDef = typeof jsonParametri.Stato === 'undefined'? 'ins':'del';
        
        var url = typeof jsonParametri.urlInps === 'undefined'? home.baseGlobal.URL_VERIFICA_INVIO_INPS + jsonParametri.idenEvento : jsonParametri.urlInps;
        var mess = '';
        if (StatoDef === 'ins') {
                mess = "Invio a INPS eseguito correttamente";
        } else {
                mess = "Cancellazione eseguita correttamente";
        }
        
        logger.debug("URL -> " + url );
        
        var url_proxy = 'proxy?CALL='+url+'&METHOD=POST&PARAM=IdenEvento='+jsonParametri.idenEvento;       

        NS_LOADING.showLoading({"testo" : "Invio certificato"});
        $.support.cors = true;
        $.ajax({
                type: "POST",
                url: url_proxy,
                dataType: "text",
                success: function (resp) {
                   // var esito = resp.split('*')[0];
                    $.support.cors = false;
                    NS_LOADING.hideLoading();
 
                    resp = resp.replace("\n","");
                    resp = resp.replace("\r","");
                    
                    logger.debug('Response invio certificato malattia -> ' + resp);
                    
                    if (resp === 'OK')
                    {

                        if (StatoDef === 'del') {
                            
                            home.NOTIFICA.info({
                                message: "Annullamento: eseguito correttamente",
                                title: "Annullamento certificato",
                                timeout: 0
                            });
                        }else{
                            home.NOTIFICA.success({
                                message: mess,
                                title: "Successo"
                        });
                        }
                     
                        if(typeof jsonParametri.callback === 'function'){
                                                       
                            jsonParametri.callback();
                        }
                        

                    }else{
                        logger.error(resp);
                        home.NOTIFICA.error({
                            message: resp.split('*')[0],
                            title: "Errore invio certificato a INPS",
                            timeout: 8
                        });
                        if(typeof jsonParametri.callbackKO === 'function'){
                            jsonParametri.callbackKO()
                        }
                    }
                },
                error: function (response)
                {
                    $.support.cors = false;
                    NS_LOADING.hideLoading();

                    logger.debug(JSON.stringify(response));

                    home.NOTIFICA.error({
                            message: response.statusText,
                            title: "Errore"
                    });
                    if(typeof jsonParametri.callbackKO === 'function'){
                        jsonParametri.callbackKO()
                    }
                        
                }
        });
        
    },
    /***
     * 
     * @param {type} jsonParametri
     * {
     * idenEvento : number
     * idenCertificato : number,
     * idenAnag : number,
     * uteIns : number,
     * callbacksuccess
     * }
     * @returns {undefined}
     */
    
    annullaCertificato: function (jsonParametri) {        
        logger.debug('Parametri passatti ad annullaCertificato = ' + JSON.stringify(jsonParametri));
        var iden;
        var procedure;
        if(typeof jsonParametri.idenEvento !== 'undefined' && jsonParametri.idenEvento !== 0){
            iden = jsonParametri.idenEvento;
            procedure = 'SP_CERTIFICATO_ANNULLA_PS';
        }else{
            iden = jsonParametri.idenCertificato;
            procedure = 'SP_CERTIFICATO_ANNULLA';

        }
        var descr = "Il certificato selezionato verra' cancellato. Procedere?";
        var buttons = [{label: "NO", action: function () {                        
                    $.dialog.hide();                        
                }},
                {label: "SI", action: function () {

                    var parameter = {
                            pIden: {v: iden, t: 'N'},
                            pAnag: {v: jsonParametri.idenAnag, t: 'N'},
                            pUte: {v: jsonParametri.uteIns, t: 'N'},
                            p_result: {t: 'V', d: 'O'}
                    }

                    function callback (resp) { 

                        var res = resp.p_result;
                        var idenEvento = res.split('$')[1];
                        if(res !== '' && res.split('$')[0] === 'OK'){
                                                        
                            NS_INPS.inviaCertificatoMalattia(
                                  {
                                      idenEvento:idenEvento,
                                      Stato : 'del',
                                      callback :jsonParametri.callbacksuccess || function(){} 
                                  }
                              );

                        }else{
                            home.NOTIFICA.error({message: "Errore nell'annullamento dell'invio",title: "Errore"});                        
                            logger.error(resp);
                        }                             
                    }  
                    var par = {
                            datasource: 'MMG',
                            id: procedure,
                            params : parameter ,
                            callbackOK : callback
                        };
                                        
                    NS_CALL_DB.PROCEDURE(par);
 
                }}];
            
        $.dialog(descr,{
                    title: "Attenzione",
                    buttons: buttons
        });
       
    },
    
};