/**
 * Created by matteo.pipitone on 06/11/2014.
 * js che gestisce le liste d'attesa e chiamata
 */
var _stato_pagina;
$(document).ready(function(){

    top.NS_CONSOLEJS.addLogger({name:'GESTIONE_LISTA_ATTESA',console:0});
    window.logger = top.NS_CONSOLEJS.loggers['GESTIONE_LISTA_ATTESA'];
    NS_GESTIONE_LISTA_ATTESA.init();
    NS_GESTIONE_LISTA_ATTESA.setEvents();
    NS_FENIX_SCHEDA.registra = NS_GESTIONE_LISTA_ATTESA.registra;

});

 var NS_GESTIONE_LISTA_ATTESA = {

     init:function(){
         _stato_pagina = $("#STATO_PAGINA").val();

         if(_stato_pagina == 'E'){
             NS_GESTIONE_LISTA_ATTESA.valorizeReparti();
             NS_GESTIONE_LISTA_ATTESA.valorizeRepartiPRE();
         }

     },
     setEvents:function(){

     },

     registra:function(){

         var ID_WK = $("#txtIdWk").val();
         var CODICE_ORMA = $("#txtCodiceOrma").val();
         var LISTA_CHIAMATA = $("#h-radSiNoListaChiamata").val();
         var ID_TEMPLATE = $("#txtIdTemplate").val();
         var ABILITA_RICOVERO = $("#h-radSiNoRicovero").val();
         var NUMERO_PAZIENTI = $("#txtNumeroPazienti").val();
         var pArrayCdcPrericovero = NS_GESTIONE_LISTA_ATTESA.getRepartiPRE();
         var DESCR = $("#txtNome").val();
         var CDC =  NS_GESTIONE_LISTA_ATTESA.getReparti();

         var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
         var  params =    {
             pIdWk                      : {t: 'V', v: ID_WK, d: 'I'},
             pCODICE                    : {t: 'V', v: CODICE_ORMA, d: 'I'},
             pLISTA_CHIAMATA            : {t: 'V', v: LISTA_CHIAMATA, d: 'I'},
             pABILITA_RICOVERO          : {t: 'V', v: ABILITA_RICOVERO, d: 'I'},
             pNUMERO_PAZIENTI           : {t: 'N', v: parseInt(NUMERO_PAZIENTI), d: 'I'},
             pASSIGNING_AUTHORITY_AREA  : {t: 'V', v: "ADT", d: 'I'},
             pArrayCdcPrericovero       : {t: 'A', v: pArrayCdcPrericovero, d: 'I'},
             PDESCR                     : {t: 'V', v: DESCR, d: 'I'},
             pIdenTemplate              : {t: 'V', v: ID_TEMPLATE, d: 'I'},
             pArrayIdenCDC              : {t: 'A', v: CDC, d: 'I'},
             p_result                   : {t:'V',d:'O'}
         };
//         alert(params);
         if(_stato_pagina == 'I'){
             //registro l'inserimento
             //CHIAMARE QUESTA QUERY E VALORIZZARE GLI AUTOCOMPLETE || Q_LISTA_ELENCO_CDC || E ANCHE TUTTI I DATI FONDAMENTALI DELLA PAGINA;

             var xhr =  db.call_procedure(
                 {
                     id       : 'LISTA_ATTESA_GESTIONE.ADDLIST',
                     parameter:  params
                 });


         }else{
             /*bisogna fare l'update di tutti i paramentri possibili*/
             params.PIDENLISTA = {t: 'N', v: parseInt($("#IDEN").val()), d: 'I'};
             //alert(params);
             var xhr =  db.call_procedure(
                 {
                     id       : 'LISTA_ATTESA_GESTIONE.EDITLIST',
                     parameter:  params
                 });

         }

         xhr.done(function (data, textStatus, jqXHR) {
             var resp = data.p_result.split('|');

             if(resp[0] == 'OK'){
                 logger.info(JSON.stringify(data));
                 home.NOTIFICA.success({message: "Salvataggio effettuato correttamente", timeout: 3, title: 'Success'});
                 home.NS_HOME_AMM.caricaWkListaAttesa();
                 NS_FENIX_SCHEDA.chiudi({refresh:true});
             }else{
                 logger.error(JSON.stringify(data));
                 alert('Errore guardare la console');
             };
         });

         xhr.fail(function (response) {
             logger.error(JSON.stringify(response));
             home.NOTIFICA.error({ title: "Attenzione", message: 'Errore GUARDARE LA CONSOLLE' });
         });
     },
     getReparti : function(){
         /*
         * funzione che ritorna l'array di reparti da associare alla lista
         */
             var reparti = [];

             $('.repartiLista tbody').each(function(i){
                 var reparto = $('#Reparto'+i).attr("data-c-value");

                 if(reparto != 'undefined' && typeof  reparto != 'undefined' && $('#Reparto'+i).val() != ''){
                     reparti.push(reparto);
                 }
             });

         return reparti;
     },
     getRepartiPRE:function(){
         /*
          * funzione che ritorna l'array di reparti che possono fare il prericovero per quella determinata lista
          */
         var arrayCDCPre = [];

         $('.repartiPre tbody').each(function(i){
             var CDCPre = $('#cdcPre'+i).attr("data-c-value");

             if(CDCPre != 'undefined' && typeof  CDCPre != 'undefined' && $('#cdcPre'+i).val() != ''){
                 arrayCDCPre.push(CDCPre);
             }
         });

         return arrayCDCPre;
     },
     valorizeReparti:function(){
         /*
         * funzione che prende l'array di iden e descr lo splitta e valorizza gli autocomplete
         */

         var descrs =  jsonData.descr_cdc.split(',');
         var idens =  jsonData.iden_cdc.split(',');

         for(var i = 0; i<idens.length; i++){
             var reparto = 'Reparto'+(i+1);
             $('#'+reparto).val(descrs[i]).attr('data-c-value',idens[i]);
             $('#h-'+reparto).val(descrs[i]).attr('data-c-value',idens[i]);
         }
     },
     valorizeRepartiPRE:function(){
         /*
          * funzione che prende l'array di iden e descr lo splitta e valorizza gli autocomplete
          */
         var descrs =  jsonData.descr_cdc_pre.split(',');
         var idens =  jsonData.iden_cdc_pre.split(',');

         for(var i = 0; i<idens.length; i++){
             var reparto = 'cdcPre'+(i+1);
             $('#'+reparto).val(descrs[i]).attr('data-c-value',idens[i]);
             $('#h-'+reparto).val(descrs[i]).attr('data-c-value',idens[i]);
         }
     }

};
