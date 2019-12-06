/***********************************************************************************************************************
 *                      Namespace dell'iframe CENTRALE dove vengono aperte le schede (div#tContent)                    *
 **********************************************************************************************************************/
var NS_REFERTO = {

    SALVA_SCHEDA : "N",
    iStruct : null,
    tipo_personale : home.baseUser.TIPO_PERSONALE,
    iden_anagrafica : $("#IDEN_ANAG").val(),
    iden_contatto : $("#IDEN_CONTATTO").val(),
    iden_lista : $("#IDEN_LISTA").val(),
    wk_apertura : $("#WK_APERTURA").val(),
    menu_apertura : $("#MENU_APERTURA").val(),
    stato_pagina : $("#STATO_PAGINA").val(),
    readOnly : null,
    iden_provenienza : null,
    iden_cdc : null,

    init : function() {
        NS_REFERTO.iStruct = $("#iContent", NS_PANEL.ref.content);
        NS_REFERTO.iden_cdc = NS_INFO_PAZIENTE.selectIdenCdc();
        NS_REFERTO.iden_provenienza = NS_INFO_PAZIENTE.selectIdenProv();
        if(NS_REFERTO.stato_pagina==="R"){NS_REFERTO.readOnly = "S";}else{NS_REFERTO.readOnly = "N";}
    },

    setEvents : function() {

    },

    hasAValue: function (value) {
        return (("" !== value) && ("undefined" !== value) && (null !== value) && ("null" !== value) && ("undefined" !== typeof value));
    },

    /**
     * Scelgo la scheda da caricare all'apertura della cartella
     */
    loadOnStartUp : function() {

        if(NS_REFERTO.tipo_personale=="A" || NS_REFERTO.stato_pagina==="R" || NS_INFO_PAZIENTE.DATI_AMMINISTRATIVI.dataIngresso == '' )
        {
            NS_REFERTO.apriDatiAmministrativi();
        }
        else if(NS_REFERTO.menu_apertura == 'RIASSOCIA_CHIUSO'){

            NS_REFERTO.apriVerbale();
        }

        else
        {
            switch(NS_REFERTO.wk_apertura)
            {
                case "LISTA_ATTESA":
                    if(NS_REFERTO.menu_apertura=="SEGNALA_ALLONTANATO"){
                        NS_REFERTO.apriVerbale();
                    }else if (NS_REFERTO.menu_apertura=="PRESA_IN_CARICO"){
                        NS_REFERTO.apriEsameObiettivo();
                    }else if (NS_REFERTO.menu_apertura=="MANUTENZIONE_TRIAGE"){
                        NS_REFERTO.apriDatiAmministrativi();
                    }

                    else{
                        NS_REFERTO.apriCodiceColore();
                    }
                    break;
                case "LISTA_APERTI":
                    if(NS_REFERTO.menu_apertura=="SCELTA_ESITO"){
                        NS_REFERTO.apriVerbale();
                    }else{
                        //se sono infermiere apri l'anamnesi infermieristica
                        if(home.baseUser.TIPO_PERSONALE == 'I' || home.baseUser.TIPO_PERSONALE == 'OST'){
                            NS_REFERTO.apriAnamnesi()
                        }else{
                            NS_REFERTO.apriEsameObiettivo();
                        }

                    }
                    break;
                case "LISTA_OBI":
                    if(NS_REFERTO.menu_apertura=="MODIFICA_ESITO" || NS_REFERTO.menu_apertura=="SCELTA_ESITO_OBI"){
                        NS_REFERTO.apriVerbale();
                    }else{
                        NS_REFERTO.apriDiari();
                    }
                    break;
                case "LISTA_CHIUSI":
                    NS_REFERTO.apriVerbale();
                    break;

                default:
                    NS_REFERTO.apriDatiAmministrativi();
                    break;
            }
        }

    },
    /**
     * Ridimensionamento senza ricarica della pagina
     */
    resize: function () {
        NS_REFERTO.iStruct.width(NS_PANEL.ref.content.width()).height(
            NS_PANEL.ref.content.height());
        if (NS_REFERTO.iStruct.attr("src"))
            home.NS_SCHEDE_CARTELLA.adattaLayout();
    },
    /**
     * Controlla il cambiamento di scheda caricata all'interno dell'iframe.
     * La variabile SALVA_SCHEDA viene messa di default a 'S' al caricamento di ogni scheda
     * Se si clicca sul form della scheda viene interpretato come modifica e messo a 'N'
     * cosi facendo se si cerca di lasciare la scheda un dialog ci chiedera' se salvare
     * prima di cambiare scheda. Al salvataggio effettuato viene reimpostata ='S'
     * @param urlKey
     * @param callback
     */
    controlloSRC : function(urlKey,callback){

        if(!urlKey) logger.error("NS_REFERTO urlKey non e' definito");
        /*se non ha time lo aggiungo*/
        if(urlKey.match(/time/g) == null){
            urlKey = urlKey + '&USER_PS='+home.baseUser.USERNAME+'&time='+ new Date().getTime();
        }

        var src = NS_REFERTO.iStruct.attr("src");
        var salvaScheda = NS_REFERTO.SALVA_SCHEDA;

        /* caso dell'apertura al caricamento l'src è vuoto */
        if(!NS_REFERTO.hasAValue(src))
        {
            NS_REFERTO.iStruct.attr("src", urlKey);
            if (callback) callback();
        }
        /* cerco di cambiare pagina dopo aver apportato modifiche ad una scheda */
        if( (NS_REFERTO.hasAValue(src)) && (urlKey != src) && (salvaScheda === "N") )
        {
            var page = $("div[name='NS_REFERTO']");
            var key_legame = page.find('iframe').contents().find('input#KEY_LEGAME').val();
            var tdError = page.find('iframe').contents().find('.tdError');

            if(key_legame === 'PARAM_VITALI'){

                if(tdError.length > 0){
                    return false;
                }
               //if(! home.PARAMETRI_VITALI.controlloTemperatura(home.PARAMETRI_VITALI.parametri.temperatura)){return false;}
            }

            $.dialog("Si desidera salvare la scheda prima di chiudere ?",{
                title: "Attenzione",
                buttons: [
                    {label: "NO", action: function () {
                        NS_REFERTO.iStruct.attr("src", urlKey);
                        $.dialog.hide();
                        if(callback) callback();
                    }},
                    {label: "SI", action: function () {

                        NS_REFERTO.iStruct[0].contentWindow.NS_FENIX_SCHEDA.registra({successSave : function(message){

                            // controllo il numero di parametri della funzione successSave, abbiamo deciso arbitrariamente
                            // che il primo parametro è il message di risposta del registra, il secondo è la callback per cambiare pagina
                            if( NS_REFERTO.iStruct[0].contentWindow.NS_FENIX_SCHEDA.successSave.length > 1){

                                NS_REFERTO.iStruct[0].contentWindow.NS_FENIX_SCHEDA.successSave(message, function(){
                                    NS_REFERTO.iStruct.attr("src", urlKey);
                                    if (callback){
                                        callback();
                                    }
                                });

                            }else{

                                NS_REFERTO.iStruct[0].contentWindow.NS_FENIX_SCHEDA.successSave(message);

                                NS_REFERTO.iStruct.attr("src", urlKey);
                                if (callback) callback();

                            }

                        }});
                        $.dialog.hide();
                    }}

                ]
            });
        }
        /* cerco di cambiare pagina dopo aver apportato modifiche ad una scheda */
        else if( (NS_REFERTO.hasAValue(src)) && (urlKey != src) && (salvaScheda === "R"))
        {
            $.dialog("Si e' sicuri di voler uscire dalla scheda ? I dati inseriti verranno cancellati.",{
                title: "Attenzione",
                buttons: [

                    {label: "NO", action: function () {
                        //NS_REFERTO.iStruct.attr("src", urlKey);
                        $.dialog.hide();
                        if(callback) callback();
                    }},
                    {label: "SI", action: function () {
                        //NS_REFERTO.iStruct[0].contentWindow.NS_FENIX_SCHEDA.chiudi();
                        NS_REFERTO.iStruct.attr("src", urlKey);
                        $.dialog.hide();
                        if(callback) callback();
                    }}
                ]
            });
        }
        /* cerco di cambiare pagina senza aver apportato modifiche o dopo aver salvato correttamente */
        else if( (NS_REFERTO.hasAValue(src)) && (urlKey != src) && (salvaScheda === "S"))
        {
            NS_REFERTO.iStruct.attr("src", urlKey);
            NS_REFERTO.SALVA_SCHEDA ='N';
            if(callback) callback();
        }
        /* non cambio l'src del frame */
        else
        {
            logger.debug("non cambio scheda perchè non hai modificato");
        }
    },
    apriAnamnesi : function(){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=ANAMNESI_INF&IDEN_CONTATTO='+NS_REFERTO.iden_contatto+
            '&SCHEDA=ANAMNESI&STATO_PAGINA=' +jsonData.H_STATO_PAGINA.ANAMNESI_INF+"&READONLY="+NS_REFERTO.readOnly);
    },
    apriAndamentoTriage : function () {
        var json =  home.PANEL.NS_INFO_PAZIENTE.getJsonListaAttesa();
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=ANDAMENTO_TRIAGE&IDEN_LISTA='+ NS_REFERTO.iden_lista+'&IDEN_CONTATTO='+
            NS_REFERTO.iden_contatto+"&READONLY="+NS_REFERTO.readOnly);
    },
    apriCodiceColore : function(){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=CODICE_COLORE&IDEN_CONTATTO='+NS_REFERTO.iden_contatto+'&IDEN_CDC_PS='+
            NS_REFERTO.iden_cdc+'&SCHEDA=CODICE_COLORE&IDEN_PER='+
            home.baseUser.IDEN_PER+'&TEMPLATE=CODICE_COLORE/CodiceColore.ftl&IDEN_LISTA='+ NS_REFERTO.iden_lista+
            '&CODICE_STRUTTURA_CDC_SEL='+home.baseUserLocation.codice_struttura+'&SUB_CODICE_STRUTTURA='+
            home.baseUserLocation.sub_codice_struttura + '&STATO_PAGINA='+jsonData.H_STATO_PAGINA.CODICE_COLORE+
            '&MENU_APERTURA='+NS_REFERTO.menu_apertura);
    },
    apriDatiAmministrativi : function() {
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=DATI_AMMINISTRATIVI&IDEN_CONTATTO='+
            NS_REFERTO.iden_contatto+'&SCHEDA=INTERVISTA'+'&TEMPLATE=CODICE_COLORE/CodiceColore.ftl&IDEN_LISTA='+
            NS_REFERTO.iden_lista +'&MENU_APERTURA='+NS_REFERTO.menu_apertura+ '&STATO_PAGINA=' +
            jsonData.H_STATO_PAGINA.INTERVISTA+"&WK_APERTURA="+$("#WK_APERTURA").val()+"&READONLY="+NS_REFERTO.readOnly);
    },
    apriDiari : function(callback){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=DIARI&IDEN_CONTATTO=' +
            NS_REFERTO.iden_contatto + '&IDEN_PROVENIENZA=' + NS_REFERTO.iden_provenienza+ '&TIPO_PERSONALE='+
            home.baseUser.TIPO_PERSONALE+"&READONLY="+NS_REFERTO.readOnly, callback);
    },
    apriDiariInf : function(callback){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=DIARI_INF&IDEN_CONTATTO=' +
            NS_REFERTO.iden_contatto + '&IDEN_PROVENIENZA=' + NS_REFERTO.iden_provenienza+ '&TIPO_PERSONALE='+
            home.baseUser.TIPO_PERSONALE+"&READONLY="+NS_REFERTO.readOnly, callback);
    },
    apriEsameObiettivo : function(){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=ESAME_OBIETTIVO&IDEN_CONTATTO='+NS_REFERTO.iden_contatto+
            '&SCHEDA=ESAME_OBIETTIVO'+'&TEMPLATE=CODICE_COLORE/CodiceColore.ftl&IDEN_LISTA='+NS_REFERTO.iden_lista +
            '&IDEN_CDC_PS='+NS_REFERTO.iden_cdc+'&IDEN_PROVENIENZA=' + NS_REFERTO.iden_provenienza +'&TIPO_PERSONALE='+
            home.baseUser.TIPO_PERSONALE + '&IDEN_PER='+home.baseUser.IDEN_PER +'&USERNAME='+home.baseUser.USERNAME +
            '&STATO_PAGINA=' + jsonData.H_STATO_PAGINA.ESAME_OBIETTIVO+"&READONLY="+NS_REFERTO.readOnly+"&COD_CDC="+
            home.PANEL.NS_INFO_PAZIENTE.getJsonLocazione().COD_CDC);
    },
    /*apriEsito : function(){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=ESITO&IDEN_CONTATTO='+ NS_REFERTO.iden_contatto+ '&IDEN_PROVENIENZA=' + NS_REFERTO.iden_provenienza+
            '&IDEN_CDC_PS='+NS_REFERTO.iden_cdc + '&SCHEDA=ESITO&WK_APERTURA='+$("#WK_APERTURA").val() + '&STATO_PAGINA='+jsonData.H_STATO_PAGINA.ESITO);
    },*/
    apriInail : function(){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=INAIL&IDEN_CONTATTO=' +
            NS_REFERTO.iden_contatto + '&IDEN_PROVENIENZA=' + NS_REFERTO.iden_provenienza + '&SCHEDA=INAIL&STATO_PAGINA='+jsonData.H_STATO_PAGINA.INAIL );
    },
    apriInsDiari : function() {
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=INS_DIARI&STATO_PAGINA=I&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto + '&IDEN_PROVENIENZA='
            + NS_REFERTO.iden_provenienza + '&TIPO_PERSONALE='+home.baseUser.TIPO_PERSONALE+ '&IDEN_PER='+home.baseUser.IDEN_PER);
    },
    apriInsDiariInf : function() {
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=INS_DIARI_INF&STATO_PAGINA=I&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto + '&IDEN_PROVENIENZA='
            + NS_REFERTO.iden_provenienza + '&TIPO_PERSONALE='+home.baseUser.TIPO_PERSONALE+ '&IDEN_PER='+home.baseUser.IDEN_PER);
    },
    apriInsRichieste : function() {
        var locazione = home.PANEL.NS_INFO_PAZIENTE.getJsonLocazione();
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=INS_RICHIESTE&IDEN_CONTATTO='+ NS_REFERTO.iden_contatto+ '&IDEN_PROVENIENZA=' + NS_REFERTO.iden_provenienza+
            '&IDEN_CDC_PS='+locazione.IDEN+'&COD_CDC_PS='+locazione.COD_CDC+'&TIPO_PERSONALE='+home.baseUser.TIPO_PERSONALE+
            "&WK_APERTURA="+$("#WK_APERTURA").val()+'&STATO_PAGINA=I&TEMPLATE=URGENZA_RICHIESTE/UrgenzaRichiesta.ftl');
    },
    apriInsTerapia : function(callback) {
        if(typeof callback == 'undefined'){
            callback = function(){}
        }
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=INS_TERAPIA&IDEN_CONTATTO='+ NS_REFERTO.iden_contatto+ '&IDEN_PROVENIENZA=' + NS_REFERTO.iden_provenienza + '&IDEN_CDC=' + NS_REFERTO.iden_cdc, callback);
    },
    apriModificaDiari : function(idenDiario) {
        if(!idenDiario) logger.error("NS_REFERTO.apriModificaDiari : idenDairio is not defined");
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=INS_DIARI&STATO_PAGINA=E'+
            '&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto + '&IDEN_PROVENIENZA=' + NS_REFERTO.iden_provenienza +'&IDEN_DIARIO='+idenDiario + '&TIPO_PERSONALE=' + home.baseUser.TIPO_PERSONALE + '&IDEN_PER='+home.baseUser.IDEN_PER);
    },
    apriModificaDiariInf : function(idenDiario) {
        if(!idenDiario) logger.error("NS_REFERTO.apriModificaDiari : idenDairio is not defined");
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=INS_DIARI_INF&STATO_PAGINA=E'+
            '&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto + '&IDEN_PROVENIENZA=' + NS_REFERTO.iden_provenienza +'&IDEN_DIARIO='+idenDiario + '&TIPO_PERSONALE=' + home.baseUser.TIPO_PERSONALE + '&IDEN_PER='+home.baseUser.IDEN_PER);
    },
    apriModulistica : function(){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=MODULISTICA&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto	+ '&IDEN_PROVENIENZA=' +
        NS_REFERTO.iden_provenienza+"&READONLY="+NS_REFERTO.readOnly+"&LISTA_CHIUSI=N&TEMPLATE=MODULI/CheckModuli.ftl&IDEN_CDC="+home.CARTELLA.NS_INFO_PAZIENTE.getJsonLocazione().IDEN);
    },
    apriParamVitali : function(){
        var locazione = NS_INFO_PAZIENTE.getJsonLocazione();
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=PARAM_VITALI&IDEN_CONTATTO='+NS_REFERTO.iden_contatto+'&IDEN_PROVENIENZA='+
            locazione.IDEN_PROVENIENZA+'&STATO_PAZIENTE='+$("#cmbStatoPaziente").val()+'&IDEN_CDC_PS='+ NS_REFERTO.iden_cdc
            +'&COD_CDC_PS='+locazione.COD_CDC);
    },
    apriPassaggioInf : function(){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=PASSAGGIO_INF&IDEN_CONTATTO='+NS_REFERTO.iden_contatto+'&IDEN_PROVENIENZA='+
            NS_REFERTO.iden_provenienza+'&CODICE_STRUTTURA_CDC_SEL='+home.baseUserLocation.codice_struttura+'&IDEN_CDC_PS='+
            NS_REFERTO.iden_cdc+'&SUB_CODICE_STRUTTURA='+home.baseUserLocation.sub_codice_struttura);
    },
    apriPrestazioni : function(){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=PRESTAZIONI&IDEN_PROVENIENZA=' + NS_REFERTO.iden_provenienza+
            '&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto+'&CODICE='+$("#hNumeroPratica").val()+"&READONLY="+NS_REFERTO.readOnly);
    },
    apriRichieste : function(){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=RICHIESTE&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto+"&READONLY="+NS_REFERTO.readOnly);
    },
    apriRivalutazioniMediche : function () {
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=RIVALUTAZIONI_MEDICHE&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto+"&READONLY="+NS_REFERTO.readOnly);
    },
    apriRivalutazioniMedichePassate : function () {
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=VAL_MEDICA_ACC_PASSATI&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto+"&READONLY="+NS_REFERTO.readOnly);
    },
    apriSchedaAnagrafica:function(){
        var sconosciuto = jsonData.COGNOME == "SCONOSCIUTO" ? "S":"N";
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO='+sconosciuto+'&STATO_PAGINA=E&WK_APERTURA=CONSOLE&IDEN_ANAG='+
            NS_REFERTO.iden_anagrafica+"&IDEN_CONTATTO=" + NS_REFERTO.iden_contatto + "&READONLY="+NS_REFERTO.readOnly,id:'dettAnag',fullscreen:true});
        //NS_REFERTO.controlloSRC('page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&WK_APERTURA=CONSOLE&STATO_PAGINA=E&IDEN_ANAG='+ N);
    },
    apriWkPotesta:function(){

        //home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=WK_POTESTA',fullscreen:true});
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=WK_POTESTA&WK_APERTURA=CONSOLE&STATO_PAGINA=E&IDEN_CONTATTO='+NS_REFERTO.iden_contatto);
    },
    apriStoriaContatto:function(){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=STORIA_CONTATTO&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto);
    },
    apriTerapie : function(callback){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=TERAPIA&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto + '&IDEN_PROVENIENZA=' +
            NS_REFERTO.iden_provenienza+"&READONLY="+NS_REFERTO.readOnly, callback);
    },
    apriTrasferimento : function(){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=PASSAGGIO_MEDICO&IDEN_CONTATTO='+NS_REFERTO.iden_contatto+'&IDEN_PROVENIENZA='+
            NS_REFERTO.iden_provenienza+'&CODICE_STRUTTURA_CDC_SEL='+home.baseUserLocation.codice_struttura+'&IDEN_CDC='+
            NS_REFERTO.iden_cdc+'&SUB_CODICE_STRUTTURA='+home.baseUserLocation.sub_codice_struttura);
    },
    apriVerbale : function(callback){
        NS_REFERTO.controlloSRC('page?KEY_LEGAME=VERBALE&IDEN_CONTATTO=' + NS_REFERTO.iden_contatto	+ '&IDEN_PROVENIENZA='+
            NS_REFERTO.iden_provenienza+ '&SCHEDA=VERBALE'+'&TEMPLATE=CODICE_COLORE/CodiceColore.ftl&IDEN_LISTA='+
            NS_REFERTO.iden_lista + '&STATO_PAGINA='+jsonData.H_STATO_PAGINA.VERBALE+ '&IDEN_CDC='+
            NS_REFERTO.iden_cdc+"&READONLY="+NS_REFERTO.readOnly, callback);
    }
};