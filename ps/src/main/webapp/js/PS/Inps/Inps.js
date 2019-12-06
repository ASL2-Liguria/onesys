/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * author matteo.pipitone
 */
/* global home, NS_LOADING, NS_CALL_DB, NS_FENIX_SCHEDA, jsonData, NS_INPS */
var _STATO_PAGINA;
$(document).ready(function(){
    INPS.init();
    INPS.setEvents();

});

var INPS = {
    INFO_PAZIENTE : null,
    init :function (){
        _STATO_PAGINA = $("#STATO_PAGINA").val();
        INPS.checkAperura();
        if(_STATO_PAGINA === 'I'){
            INPS.getDatiPagina();    
        }else if(_STATO_PAGINA === 'E'){
           $("#STATO_PAGINA").val("M"); //fatto per MMG, gestisce stato_pagina
        }
        $(".butSalva").hide();        
        INPS.tryLogin();
        INPS.setButtonScheda();
        NS_FENIX_SCHEDA.successSave = INPS.successSave;
        NS_FENIX_SCHEDA.customizeParam = function (params) {params.extern = true; return params;};
        NS_FENIX_SCHEDA.customizeJson = INPS.customizeJson;
        INPS.valorizeDataFinePrognosi();
        

    },
    setEvents : function(){
        
        $("#butLogin").on("click", function () {
            INPS.checkLogin();
        });
        $(".butStampa").on("click", INPS.stampa);
        $(".butChiudi").off("click").on("click", INPS.CHIUDI);
        $("#tabs-INPS li").on("click", INPS.setButtonScheda);
    },
    
    checkAperura : function () {
        if ( typeof home.CARTELLA === 'undefined' || typeof home.CARTELLA.NS_INFO_PAZIENTE === 'undefined' ){
            var iden_contatto = Number($("#IDEN_CONTATTO").val());           
            var contatto = NS_CONTATTO_METHODS.getContattoById(iden_contatto) ;
          
            //tapullo momentaneo
            var jsonAnag = {
                
                ASL_RESIDENZA_COD : contatto.anagrafica.comuneResidenza.asl.codice,
                RES_COD_REGIONE : contatto.anagrafica.comuneResidenza.asl.regione.codice,
                DOM_INDIRIZZO : contatto.anagrafica.comuneDomicilio.indirizzo,
                RES_INDIRIZZO : contatto.anagrafica.comuneResidenza.indirizzo, 
                COMUNE_DOMICILIO : contatto.anagrafica.comuneDomicilio.descrizione, 
                COMUNE_RESIDENZA : contatto.anagrafica.comuneResidenza.descrizione, 
                IDEN_COMUNE_RESIDENZA :  contatto.anagrafica.comuneResidenza.id,
                IDEN_COMUNE_DOMICILIO :  contatto.anagrafica.comuneDomicilio.id,
                DOM_CAP :   contatto.anagrafica.comuneDomicilio.cap,
                RES_CAP :   contatto.anagrafica.comuneResidenza.cap,
                DOM_PROVINCIA : contatto.anagrafica.comuneDomicilio.provincia.codice,
                RES_PROVINCIA : contatto.anagrafica.comuneResidenza.provincia.codice,
                COGNOME : contatto.anagrafica.cognome,
                NOME : contatto.anagrafica.nome,
                CODICE_FISCALE :    contatto.anagrafica.codiceFiscale,                 
                RES_NUMERO_CIVICO : '',                                             
                IDEN : contatto.anagrafica.id
            }
            //console.log(JSON.stringify(contatto.anagrafica));
            INPS.INFO_PAZIENTE= {jsonAnagrafica : jsonAnag , jsonContatto : contatto}
        }else{
            INPS.INFO_PAZIENTE = home.CARTELLA.NS_INFO_PAZIENTE;
             // console.log(JSON.stringify( home.CARTELLA.NS_INFO_PAZIENTE.jsonAnagrafica));
        }
    },
    checkLogin : function(){
             
        var codFiscPaz = $("#txtCodFisc").val();
        var codAsl = INPS.INFO_PAZIENTE.jsonAnagrafica.ASL_RESIDENZA_COD;
        var codReg = INPS.INFO_PAZIENTE.jsonAnagrafica.RES_COD_REGIONE;
        var pinCode = $("#txtPin").val();
        var userName = $("#txtUsername").val();
        var userPwd = $("#txtPwd").val();
        
//        var codFiscPaz = 'BAXBAX93B20H501T';        
//        var codAsl = '202';
//        var codReg = '130';
//        var pinCode = '1234567890';//$("#txtPin").val();
//        var userName = 'PROVAX00X00X000Y';//$("#txtUsername").val();        
//        var userPwd = 'Salve123'; 

        var ricordapwd = $("#h-RicordaPwd").val() === ''? 'N':'S';
        var ricordapin = $("#h-RicordaPin").val() === ''? 'N':'S';
            
        var param_medico = {
            P_USER: {v: Number(home.baseUser.IDEN_PER), t: 'N'},
            P_USERNAME: {v: userName, t: 'V'},
            P_PWD: {v:userPwd, t: 'V'},
            P_PINCODE: {v: pinCode, t: 'V'},
            P_RICORDA_PWD: {v: ricordapwd , t: 'V'},
            P_RICORDA_PINCODE: {v: ricordapin, t: 'V'},
            p_Result: {t: 'V', d: 'O'}
        };
        
        function callBackOKLOGIN(){
            $(".butSalva").show();
            var par = {
               param_medico : param_medico,
               callbackOK : function (resp){
                  home.NOTIFICA.success({message: "Login Eseguita Correttamente",title: "Login"});
                  $('li[data-tab="tabLogin"]').hide();
                  $('li[data-tab="tabDatiCertificato"]').css({"border-top-left-radius" : "6px"}).trigger("click");
               }
            };
            NS_INPS.saveInfoMedico(par);        
            
        }
        
        var parameters = {
            URL : home.baseGlobal.URL_VERIFICA_LOGIN_INPS+'?',
            COD_FISC : codFiscPaz,
            COD_ASL : codAsl,
            COD_REG : codReg,
            PIN : pinCode,
            USERNAME : userName,
            PWD : userPwd,
            callBackNotOK : function(){INPS.dialogSalvataggioDati('loginKO',param_medico)},
            callBackOK : callBackOKLOGIN,
            callBackKO : function(){INPS.dialogSalvataggioDati('servOff',param_medico)}
        }
        NS_INPS.eseguiLogin(parameters);
      
    },
    
    
    /**
     * funzione richiamata solo in stato_pagina = I
     * serve per valorizzare di default alcuni campi della pagina     
     * */
    getDatiPagina : function () {
        
        var nominativo_repe = $("#txtNominativoRepe");
        var indirizzo = $("#txtIndirizzo");
        var civico = $("#txtCivico");        
        var cap = $("#txtCAP");
        var Prov = $("#txtProvincia");
        var indirizzoRepe = $("#txtIndirizzoRepe");
        var codiceFiscale = $("#txtCodFisc");
        var indirizzoRep = INPS.INFO_PAZIENTE.jsonAnagrafica.DOM_INDIRIZZO !== '' ? INPS.INFO_PAZIENTE.jsonAnagrafica.DOM_INDIRIZZO : INPS.INFO_PAZIENTE.jsonAnagrafica.RES_INDIRIZZO;
        var comuneRepe = INPS.INFO_PAZIENTE.jsonAnagrafica.COMUNE_DOMICILIO !== '' ? INPS.INFO_PAZIENTE.jsonAnagrafica.COMUNE_DOMICILIO : INPS.INFO_PAZIENTE.jsonAnagrafica.COMUNE_RESIDENZA;
        var idenComuneRepe = INPS.INFO_PAZIENTE.jsonAnagrafica.IDEN_COMUNE_DOMICILIO !== '' ? INPS.INFO_PAZIENTE.jsonAnagrafica.IDEN_COMUNE_DOMICILIO : INPS.INFO_PAZIENTE.jsonAnagrafica.IDEN_COMUNE_RESIDENZA;
        var capRepe =  INPS.INFO_PAZIENTE.jsonAnagrafica.DOM_CAP !== '' ? INPS.INFO_PAZIENTE.jsonAnagrafica.DOM_CAP : INPS.INFO_PAZIENTE.jsonAnagrafica.RES_CAP;
        var provRepe = INPS.INFO_PAZIENTE.jsonAnagrafica.DOM_PROVINCIA !== '' ? INPS.INFO_PAZIENTE.jsonAnagrafica.DOM_PROVINCIA : INPS.INFO_PAZIENTE.jsonAnagrafica.RES_PROVINCIA;       
        
        nominativo_repe.val(INPS.INFO_PAZIENTE.jsonAnagrafica.COGNOME + ' ' + INPS.INFO_PAZIENTE.jsonAnagrafica.NOME); 
        
        indirizzoRepe.val(indirizzoRep);
        codiceFiscale.val( INPS.INFO_PAZIENTE.jsonAnagrafica.CODICE_FISCALE);                
        indirizzo.val(INPS.INFO_PAZIENTE.jsonAnagrafica.RES_INDIRIZZO);                
        civico.val(INPS.INFO_PAZIENTE.jsonAnagrafica.RES_NUMERO_CIVICO);       
        
        // IDEN_COMUNE_RESIDENZA
        
        $("#acComune").data('acList').returnSelected({DESCR:INPS.INFO_PAZIENTE.jsonAnagrafica.COMUNE_RESIDENZA, VALUE : INPS.INFO_PAZIENTE.jsonAnagrafica.IDEN_COMUNE_RESIDENZA});
        $("#acComuneRepe").data('acList').returnSelected({DESCR:comuneRepe, VALUE : idenComuneRepe});
        //$("#acDiagnosiICD9").data('acList').returnSelected({DESCR:jsonData.DESCR_DIAGNOSI_ICD9, VALUE : jsonData.IDEN_DIAGNOSI_ICD9});
        $("#txtCapRepe").val(capRepe);
        $("#txtProvinciaRepe").val(provRepe);
        cap.val(INPS.INFO_PAZIENTE.jsonAnagrafica.RES_CAP);
        Prov.val(INPS.INFO_PAZIENTE.jsonAnagrafica.RES_PROVINCIA);        
    },
    successSave : function (idenEvento)
    {
        jsonData.iden_evento = idenEvento;
        $("#STATO_PAGINA").val("E");
        NS_INPS.inviaCertificatoMalattia({idenEvento:idenEvento});
    },
    
    tryLogin : function (){
        
        var p = {
            iden_per : home.baseUser.IDEN_PER ,
            callback : function (resp) {
               $("#txtPin").val(resp[0].PINCODE);
               $("#txtUsername").val(resp[0].USERNAME);
               $("#txtPwd").val(resp[0].PWD);
               INPS.checkLogin();
            }
        };
        NS_INPS.getDatiMedico(p);
              
    },
    
   
    
    dialogSalvataggioDati : function (type,param_medico) {
        var descr;
        var jsonButton = [{label: "NO", action: function () {                        
                    $.dialog.hide();                        
                }},
                {label: "SI", action: function () {
                        var p = {
                            param_medico : param_medico
                        }
                        NS_INPS.saveInfoMedico(p)                                      
                    
                    }
                }];
        switch (type) {
            case 'servOff' : 
                descr = "Attenzione: servizio momentaneamente non disponibile. Riprovare successivamente.";
                jsonButton = [{label: "OK", action: function () {
                    $.dialog.hide();
                    NS_FENIX_SCHEDA.chiudi();
                }}];
                break;
            case 'loginKO' : 
                descr = "Errore durante il tentativo di login. Salvare comunque i dati di accesso inseriti?";
                break;
            default : 
                descr = "Salvare i dati di accesso inseriti?";
                break;
        };
        
        $.dialog(descr,{
            title: "Attenzione",
            buttons: jsonButton
        });
    },
    customizeJson : function (jsonSave) {     
 
        jsonSave.campo.push({col:"hInfoAccesso",id:"hInfoAccesso",IDEN_ANAG:INPS.INFO_PAZIENTE.jsonAnagrafica.IDEN,IDEN_ACCESSO : $("#IDEN_CONTATTO").val(), IDEN_PROBLEMA:'', val:home.CARTELLA.NS_INFO_PAZIENTE.jsonAnagrafica.IDEN});
        jsonSave.campo.push({col:"hInfoUtente",id:"hInfoUtente",IDEN_UTENTE :home.baseUser.IDEN_PER , val:home.baseUser.IDEN_PER});
        jsonSave.campo.push({col:"IDEN",id:"IDEN",val:jsonData.IDEN});
        jsonSave.campo.push({col:"IDEN_MED_PRESCR",id:"IDEN_MED_PRESCR",val:home.baseUser.IDEN_PER});        
        return jsonSave;
    },
    //funzione non utilizzata per adesso, sarebbe opportuno fare il controllo prima di stampare se è presente il certificato.
    stampa : function () { 
        var butSalva = $(".butSalva");
        if($("#STATO_PAGINA").val() === 'I' && butSalva.is(':visible') && butSalva.is(':not(:hidden)')){
            NS_FENIX_SCHEDA.registra();            
        }
        function callbackOk(resp){
            var result = resp.result;
            if(result.length > 0 && result[0].ID_CERTIFICATO !== '' ){
                var utente = home.baseUser.IDEN_PER;
                var tipo = 'INPS';
                var key_Scheda = $("#KEY_LEGAME").val();
                var jsonModulo = home.baseUserModuli[tipo][key_Scheda];
                var url_prompt = eval("home.SCHEDA_MODULI."+jsonModulo.GENERA_URL_PROMPT);
                var par =   {
                        'PRINT_REPORT' : jsonModulo.NOME_REPORT,
                        'PRINT_DIRECTORY' : '1',
                        "PRINT_PROMPT" : url_prompt,
                        "N_COPIE" : jsonModulo.N_COPIE
                    };


                if($("#STATO_PAGINA").val() === 'I'){
                    NS_FENIX_SCHEDA.registra();
                    setTimeout(function () {                                                     
                        home.SCHEDA_MODULI.NS_MODULI.setDataStampa(jsonModulo.KEY_SCHEDA,par,utente);                                                   
                    },1000);
                }else{                                                    
                    home.SCHEDA_MODULI.NS_MODULI.setDataStampa(jsonModulo.KEY_SCHEDA,par,utente); 
                }         
            }else{
                home.NOTIFICA.warning({
                    timeout : 0,
                    message : 'Numero certificato non presente',
                    title : "Attenzione"
                });
            }
                      
        }
         var parametri = {
            datasource : 'MMG',
            id : 'DATI.CHECK_ID_CERTIFICATO',
            params : {IDEN_CONTATTO: {t:'N', v: Number($("#IDEN_CONTATTO").val())}},
            callbackOK : callbackOk
        };
        NS_CALL_DB.SELECT(parametri);

    },
    valorizeDataFinePrognosi : function () {
        if(jsonData.giorni_prognosi !== ''){
            var txtDataTerminePrognosi = $("#txtDataTerminePrognosi");
            var htxtDataTerminePrognosi = $("#h-txtDataTerminePrognosi");
            var data_fine_prognosi = moment(htxtDataTerminePrognosi.val(),'YYYYMMDD');
            data_fine_prognosi = data_fine_prognosi.add(Number(jsonData.giorni_prognosi), 'days');

            htxtDataTerminePrognosi.val(data_fine_prognosi.format('YYYYMMDD'));
            txtDataTerminePrognosi.val(data_fine_prognosi.format('DD/MM/YYYY'));
        }
                
    },
    CHIUDI : function(){
  
        home.SCHEDA_MODULI.NS_MODULI.xmlInput = home.SCHEDA_MODULI.NS_MODULI.generaXmlInput();
        home.SCHEDA_MODULI.NS_MODULI.generaXmlOutput(); 
        //purtroppo non abbiamo l'iden certificato ma abbiamo l'iden dell'evento
        home.SCHEDA_MODULI.jsonData.iden_evento = jsonData.iden_evento;                 

        NS_FENIX_SCHEDA.chiudi();
    },
    /**
     * il bottone salva è gestito nella login
     * */
    setButtonScheda : function(){
        var tab_attivo = $(".tabActive").data("tab");                
        var butStampa = $(".butStampa");
        butStampa.hide();        
        switch(tab_attivo){
        case "tabDatiCertificato" :            
            butStampa.show();                          
            break;
        case "tabLavoratore":            
            butStampa.show();
            break;
        case "tabLogin" : 
            break;
        default :
            logger.error("callBackAutocomplete ->  tab non riconosciuto ->" + tab_attivo);
        }
    }
    
};
var NS_GENERICS = {
    
    callBackAutocomplete : function (ret){
        
        var tab_attivo = $(".tabActive").data("tab");        
         
        switch(tab_attivo){
        case "tabDatiCertificato" :            
            $("#txtCapRepe").val(ret.CAP);           
            $("#txtProvinciaRepe").val(ret.CODICE_PROVINCIA);                           
            break;
        case "tabLavoratore":            
            $("#txtCAP").val(ret.CAP);
            $("#txtProvincia").val(ret.CODICE_PROVINCIA);
            break;
        case "tabLogin" : 
            break;
        default :
            logger.error("callBackAutocomplete ->  tab non riconosciuto ->" + tab_attivo);
        }
    }
        
};

var NS_VERBALE = {
    checkDiagnosi : function (){
        //funzione fatta solo per compatibilità all'autocomplete
        return;
    }
    
};
        
        