var NS_MENU_PRINCIPALE = {

    clickRow: function(rec,row)
    {
        $(row).selectedLine('IDEN_ANAGRAFICA', 'clsSel');
    },
    dblclickRow: function(rec,e,wk,row)
    {
        window.getSelection().collapseToStart();
        var url = "page?KEY_LEGAME=INFO_REFERTO_DETTAGLIO&IDEN_TESTATA=" + rec.IDEN_TESTATA + "&IDEN_DETTAGLIO=" + rec.IDEN_DETTAGLIO+'&IDEN_ANAGRAFICA='+rec.IDEN_ANAGRAFICA;
        $(this).openDetailPage(rec,wk,url,e);
    },
    stampaEtichetta: function (rec,id_numericInput)
    {   var n_copie=$("#"+id_numericInput).data("numericInput")[0].getValue();
        home.NS_FENIX_STAMPE_SPECIALI.stampaEtichetta({IDEN_TESTATA : rec[0].IDEN_TESTATA,IDEN_CDC : rec[0].IDEN_CDC,STAMPANTE:home.basePC.STAMPANTE_ETICHETTE,N_COPIE:n_copie} );
    },
    stampaEtichettaIndirizzo:function(rec,id_numericInput)
    {
        var n_copie=$("#"+id_numericInput).data("numericInput")[0].getValue();
        home.NS_FENIX_STAMPE_SPECIALI.stampaEtichettaIndirizzo({IDEN_TESTATA : rec[0].IDEN_TESTATA,IDEN_CDC : rec[0].IDEN_CDC,STAMPANTE:home.basePC.STAMPANTE_ETICHETTE,N_COPIE:n_copie} );
    },
    stampaRichiesta: function (rec,id_numericInput)
    {
        var n_copie=$("#"+id_numericInput).data("numericInput")[0].getValue();
        home.NS_FENIX_STAMPE_SPECIALI.stampaRichiesta({IDEN_TESTATA : rec[0].IDEN_TESTATA,IDEN_CDC : rec[0].IDEN_CDC,STAMPANTE:home.basePC.STAMPANTE_REFERTI,N_COPIE:n_copie} );
    },
    stampaIstruzioni: function (rec)
    {
        home.NS_FENIX_STAMPE_SPECIALI.stampaIstruzioni({IDEN_TESTATA : rec[0].IDEN_TESTATA,IDEN_CDC : rec[0].IDEN_CDC});
    },
    stampaReferto: function (rec,id_numericInput)
    {
        var n_copie=$("#"+id_numericInput).data("numericInput")[0].getValue();
        home.NS_FENIX_STAMPE_SPECIALI.stampaReferto({IDEN_REFERTO : rec[0].IDEN_REFERTO,N_COPIE:n_copie});
    },
    anteprimaReferto: function (rec)
    {
        home.NS_FENIX_STAMPE_SPECIALI.stampaReferto({IDEN_REFERTO : rec[0].IDEN_REFERTO,anteprima:"S"});
    },
    stampaListaWk: function (rec,id_numericInput)
    {   var n_copie = $("#"+id_numericInput).data("numericInput")[0].getValue();
        home.NS_FENIX_STAMPE_SPECIALI.stampaListaWk({IDEN_CDC:rec[0].IDEN_CDC,N_COPIE:n_copie});
    }  ,
    stampaConsenso:function(rec,report)
    {
        home.NS_FENIX_STAMPE_SPECIALI.stampaConsenso(rec[0],report);
    },
    referta: function (rec)
    {
        FUNZIONI_WK_REFERTAZIONE.apriConsole(rec);
    },
    annullaReferto:function(rec)
    {
        var param={'p_iden_referto':rec[0].IDEN_REFERTO,'p_iden_per':home.baseUser.IDEN_PER};
        dwr.engine.setAsync(false);
        toolKitDB.executeFunction('GESTIONE_RIS_REFERTI.ANNULLA_REFERTO', param, function( response )
        {

            var status	= response.p_result.split('$')[0];
            var msg		= response.p_result.split('$')[1];

            if( status == 'OK' ){
                if(LIB.isValid(WORKLIST))WORKLIST.refreshWk();
                home.NOTIFICA.success( { message : traduzione.successRefertoAnnullato, title : 'Successo!' } )
            }
            else
                home.NOTIFICA.error( { message : msg, title : 'Errore!' } )



        });
        dwr.engine.setAsync(true);
    },
    apriSchedaAnagrafica: function (rec)
    {
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA,id:'SchedaAnagraficaPage',fullscreen:true});
    },
    apriSchedaAnagraficaEsami: function (rec)
    {
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&VIS_ESAMI=true&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA,id:'SchedaAnagraficaPage',fullscreen:true});
    },
    inserisciEsame: function(rec)
    {
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ESAME&STATO_ESAME=30&TAB_ATTIVO=tabDatiPrincipali&IDEN_ANAGRAFICA='+rec[0].IDEN_ANAGRAFICA,id:'SchedaEsamePage',fullscreen:true });
    },
    modificaNomenclatoreEsame:function(rec)
    {
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCELTA_ESAME&MODIFICA_NOMENCLATORE_ESAME=S&IDEN_ESAME_DETTAGLIO='+rec[0].IDEN_DETTAGLIO +'&IDEN_EROGANTE=' + rec[0].IDEN_AREA,id:'SceltaEsamePage',fullscreen:true });
    },
    prenotaEsame: function(rec)
    {
        if(LIB.ToF(home.baseGlobal.AVVISO_ESAMI_PRENOTATI))
            home.DIALOG.prenotazioniPaziente({'iden_anagrafica':rec[0].IDEN_ANAGRAFICA,'da_data':DATE.getOggiYMD()});
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ESAME&IDEN_ANAGRAFICA='+rec[0].IDEN_ANAGRAFICA+'&STATO_ESAME=10',id:'SchedaEsamePage',fullscreen:true});
    },
    accettaEsame: function(rec)
    {
        if(rec[0].ESAME_DETTAGLIO_STATO == "2"){
            home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ESAME&STATO_ESAME=30&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA+'&IDEN_TESTATA='+rec[0].IDEN_TESTATA,id:'SchedaEsamePage',fullscreen:true});
        }else{
            NS_ESAMI.accetta(rec);
        }
    },
    eseguiEsame: function(rec)
    {
        /*if(typeof home.baseUser.ESEGUI_UTENTE_PASSWORD != 'undefined' && home.baseUser.ESEGUI_UTENTE_PASSWORD =='S' ){
         NS_ESAMI.esegui_utente_password(rec);
         }else{*/
        NS_ESAMI.esegui(rec);
    },
    annullaEsecuzioneEsame: function(rec)
    {
        NS_ESAMI.annulla_esecuzione(rec);
    },
    annullaAccettazioneEsame: function(rec)
    {
        NS_ESAMI.annulla_accettazione(rec);
    },
    cancellaEsame: function(rec)
    {
        NS_ESAMI.cancella_esame(rec);
    },
    segreteria: function(rec)
    {
        var idens_testata = [];
        for(var i=0;i< rec.length;i++)
        {
            idens_testata.push(rec[i].IDEN_TESTATA)
        }
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_SEGRETERIA&IDEN_ANAGRAFICA='+rec[0].IDEN_ANAGRAFICA+'&IDEN_TESTATA='+idens_testata.toString(),id:'SchedaSegreteria',fullscreen:true});
    },
    worklistDocumenti: function(rec)
    {
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=WORKLIST_DOCUMENTI&IDEN_TESTATA=' + rec[0].IDEN_TESTATA + '&IDEN_REFERTO=' + rec[0].IDEN_REFERTO + '&IDEN_ANAGRAFICA=' + +rec[0].IDEN_ANAGRAFICA ,id:'WK_DOCUMENTI',fullscreen:true});
    },
    allegaDocumenti: function(rec)
    {
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_DOCUMENTI_ALLEGATI&IDEN_TESTATA=' + rec[0].IDEN_TESTATA + '&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA ,id:'WK_DOCUMENTI',fullscreen:true});
    },
    apriBackup: function(rec){
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_BACKUP&IDEN_TESTATA=' + rec[0].IDEN_TESTATA + '&IDEN_ANAGRAFICA=' + rec[0].IDEN_ANAGRAFICA +'&IDEN_DETTAGLIO='+rec[0].IDEN_DETTAGLIO ,id:'SCHEDA_BACKUP',fullscreen:true});
    },
    screeningPrimiLivelli : function(rec){
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCREENING_PRIMI_LIVELLI&IDEN_TESTATA=' + rec[0].IDEN_TESTATA + '&IDEN_ANAGRAFICA=' + rec[0].IDEN_ANAGRAFICA +'&IDEN_DETTAGLIO='+rec[0].IDEN_DETTAGLIO ,id:'SCREENING_PRIMI_LIVELLI',fullscreen:true});
    },
    nonErogato:function(rec){
        if(LIB.isValid(home.baseGlobal.RICHIEDI_PASSWORD_NON_EROGATO) && LIB.ToF(home.baseGlobal.RICHIEDI_PASSWORD_NON_EROGATO))
        {
            home.DIALOG.autenticazione(
                {
                    "loadUser": true,
                    "callback": function(ctx)
                    {
                        home.DIALOG.nonErogazioneEsame({rows:rec});
                    }
                });
        }
        else
        {
            home.DIALOG.nonErogazioneEsame({rows:rec});
        }
    },
    annullaNonErogato:function(rec){
        var pIdenTestata = [];
        var pIdenDettaglio=[];
        var pIdenPerUtente = home.baseUser.IDEN_PER;

        $.each(rec,function(k,v){
            $.each(v,function(k1,v1){
                if(k1 == "IDEN_TESTATA" || k1 == "IDEN_ESAME_TESTATA"){
                    pIdenTestata.push(v1);
                }
                if(k1=="IDEN_DETTAGLIO" || k1=="IDEN_ESAME_DETTAGLIO" ){
                    pIdenDettaglio.push(v1);
                }
            });
        });



        var params={"pIdenTestata":pIdenTestata.toString(),"pIdenDettaglio":pIdenDettaglio.toString(),"pUtente":pIdenPerUtente};
        dwr.engine.setAsync(false);
        toolKitDB.executeFunction("GESTIONE_RIS_ESAMI.ANNULLA_NON_EROGAZIONE_ESAME",params,function(response){

            var resp = response.p_result.split("$")[0];
            var msg = response.p_result.split("$")[1];

            switch (resp)
            {
                case "OK":
                    NOTIFICA.success({
                        message: 'Esame ripristinato.',
                        title: "Success!",
                        timeout: 3,
                        width: 300
                    });

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

            home.NS_AGGIORNA.aggiorna();
        });
        dwr.engine.setAsync(true);
    },
    whereNonErogato:function(rec){
        return (rec[0].ESAME_DETTAGLIO_STATO < 44);
    },
    whereAnnullaNonErogato:function(rec){
        for(var i=0;i<rec.length;i++)
        {
           if(rec[0].ESAME_DETTAGLIO_STATO != 45)return false;
        }
        return true;
    },
    whereDatiEsecuzione : function(rec){
        var vPagato = rec[0].PAGATO;
        if(vPagato!= null && vPagato.indexOf("^") > -1){
            if(vPagato.split("^")[0]=="K")
            {
                return false
            }
        }
        if(typeof rec[0].IDEN_CONTATTO != 'undefined'){
            if(rec[0].IDEN_CONTATTO != null && rec[0].IDEN_CONTATTO != ""){

                return true;

            }else{
                return false;
            }
        }else{
            return true;
        }
    },
    datiEsecuzione  : function (rec)
    {
        return NS_ESAMI.datiEsecuzione(rec);
    },
    whereInviaTarmed: function (rec)
    {
        return (rec[0].ESAME_DETTAGLIO_STATO > 49);
    },
    inviaTarmed : function( rec )
    {
        if(rec[0]['TIPO_PROVENIENZA']=='I' && typeof home.basePermission.ADMIN_TARMED == 'undefined' )
        {
            home.NOTIFICA.error( { message : 'Impossibile inviare in fatturazione Immediata Esami per pazienti Degenti', title : 'Attenzione' } )
            return;
        }
        var vPagato = rec[0]['PAGATO'];
        var already_fatturato=false;
        if(vPagato != null)
        {

            if(vPagato.indexOf("^") > -1)
            {

                if(vPagato.split("^")[0]=="S" || vPagato.split("^")[0]=="K"){
                    already_fatturato=true
                }
            }
        }
        if(already_fatturato)
        {
            if(typeof home.basePermission.ADMIN_TARMED == 'undefined')
                home.NOTIFICA.error( { message : 'Impossibile reinviare un esame mandato correttamente in fatturazione o marcato come da non fatturare. Contattare amministratore di sistema', title : 'Errore!' } )
            else
            {
                var forzaFatturazione = confirm('Si sta mandando in fatturazione un esame gi� inviato correttamente o marcato come da non fatturare. Continuare?')
                if(!forzaFatturazione)
                    return;
            }

        }

        var parameters =
        {
            'pIden' :  rec[0]['IDEN_TESTATA']  ,
            'pNome' : 'ESAMI_TESTATA',
            'pTipo' : '51',
            'pDescrizione' : 'Inserimento Tarmed Forzata'
        };

        dwr.engine.setAsync(false);
        toolKitDB.executeFunction('INSERISCI_EVENTO_TARMED', parameters, function( response )
        {

            var status	= response.p_result.split('$')[0];
            var msg		= response.p_result.split('$')[1];

            if( status == 'OK' )
                home.NOTIFICA.success( { message : 'Evento Accodato Correttamente', title : 'Successo!' } )
            else
                home.NOTIFICA.error( { message : msg, title : 'Errore!' } )



        });
        dwr.engine.setAsync(true);

    },


    eseguiInsermentoTarmed:function(rec){
        var parameters =
        {
            'pIden' :  rec[0]['IDEN_TESTATA']  ,
            'pNome' : 'ESAMI_TESTATA',
            'pTipo' : '51',
            'pDescrizione' : 'Inserimento Tarmed Forzata'
        };

        dwr.engine.setAsync(false);
        toolKitDB.executeFunction('INSERISCI_EVENTO_TARMED', parameters, function( response )
        {

            var status	= response.p_result.split('$')[0];
            var msg		= response.p_result.split('$')[1];

            if( status == 'OK' )
                home.NOTIFICA.success( { message : 'Evento Accodato Correttamente', title : 'Successo!' } )
            else
                home.NOTIFICA.error( { message : msg, title : 'Errore!' } )



        });
        dwr.engine.setAsync(true);

    },
    sincronizzaCsh : function(rec)
    {
        var id_dicom = LIB.getJoined(rec,"ID_DICOM");
        var iden_sala = LIB.getJoined(rec,"IDEN_SALA");

        home.pacs.showstudy(id_dicom, '', iden_sala, '');

        //toolKitDB.getResultDatasource("INTEGRAZIONI.TEST","INTEGRAZIONI",{},"",function(response){alert(JSON.stringify(response))});
    },
    creaProcessSceltaCopie:function(num_copie,id_scelta)
    {

        var $div= $("<div>").addClass("numericInput cmProcessPrintCopies").attr("id",id_scelta)
            .append($("<i>").addClass("icon-minus"))
            .append($("<input>").attr("type","text").attr("value",num_copie))
            .append($("<i>").addClass("icon-plus"));
        $div.numericInput();
        return $div;
    },
    whereAnteprimaReferto: function (rec)
    {
        return (rec[0].ESAME_DETTAGLIO_STATO > 110);
    },
    whereStampaReferto: function (rec)
    {
        return (rec[0].ESAME_DETTAGLIO_STATO > 110);
    },
    whereReferta: function (rec)
    {
        if(rec.length == 0)
        {
            return false;
        }
        for(var i=0;i<rec.length;i++)
        {
            if(rec[i].ESAME_DETTAGLIO_STATO == 45)return false; //non erogato
        }
        return LIB.ToF(home.basePermission.REFERTAZIONE.REFERTA);
    },
    whereAnnullaReferto:function(rec)
    {
        if(rec.length !=1 || rec[0].ESAME_DETTAGLIO_STATO != 120) return false;
        return LIB.ToF(home.basePermission.REFERTAZIONE.ANNULLA_REFERTO);
    },
    whereSchedaAnagrafica : function (rec)
    {
        return (rec.length != 0);
    },
    whereSchedaAnagraficaEsami : function (rec)
    {
        return (rec.length != 0);
    },
    whereInserisciEsame : function (rec)
    {
        if(rec.length == 0){return false;}
        return LIB.ToF(home.basePermission.ESAMI.INSERISCI);

    },
    wherePrenotaEsame: function (rec)
    {
        if(rec.length == 0){return false;}
        return LIB.ToF(home.basePermission.ESAMI.PRENOTA);
    },
    whereAccettaEsame: function (rec)
    {
        return (rec[0].ESAME_DETTAGLIO_STATO>=2 && rec[0].ESAME_DETTAGLIO_STATO < 30);
    },
    whereEseguiEsame: function (rec)
    {
        return (rec[0].ESAME_DETTAGLIO_STATO > 20 && rec[0].ESAME_DETTAGLIO_STATO < 50 && LIB.ToF(home.basePermission.ESECUZIONE.ESEGUI));
    },
    whereEseguiEsameInizio: function (rec)
    {
        return (rec[0].ESAME_DETTAGLIO_STATO > 20 && rec[0].ESAME_DETTAGLIO_STATO < 40 && LIB.ToF(home.basePermission.ESECUZIONE.ESEGUI));
    },
    whereEseguiEsameFine: function (rec)
    {
        return (rec[0].ESAME_DETTAGLIO_STATO > 30 && rec[0].ESAME_DETTAGLIO_STATO < 50 && LIB.ToF(home.basePermission.ESECUZIONE.ESEGUI));
    },
    whereAnnullaEseguiEsame: function (rec)
    {
        return(rec[0].ESAME_DETTAGLIO_STATO > 30 && rec[0].ESAME_DETTAGLIO_STATO < 100 && LIB.ToF(home.basePermission.ESECUZIONE.ANNULLA_ESEGUI));
    },
    whereAnnullaAccettaEsame: function (rec)
    {
        return(rec[0].ESAME_DETTAGLIO_STATO == 30);
    },
    whereCancellaEsame: function (rec)
    {
        /* solo per GASLINI
        if(LIB.ToF(home.basePermission.ESAMI.CANCELLA) && rec[0].ESAME_DETTAGLIO_STATO <= 30){
            var gruppo_permessi = LIB.getParamUserGlobal('GRUPPO_PERMESSI','');
            if (/SUPER_ADMIN/i.test(gruppo_permessi)){
                return true;
            }

            if (home.baseUser.TIPO_PERSONALE == 'M' && rec[0].ESAME_DETTAGLIO_STATO == 10)
                return false;
            else
                return true;
        }
        else
            return false;*/

        return (LIB.ToF(home.basePermission.ESAMI.CANCELLA) && rec[0].ESAME_DETTAGLIO_STATO <= 30);
    },
    whereSegreteria: function (rec)
    {
        if(rec.length == 0){return false;}
        for(var i=0;i<rec.length;i++)
        {
            if(rec[i].ESAME_DETTAGLIO_STATO < 50)return false;
        }
        return true;
    },
    whereWorklistDocumenti: function (rec)
    {
        return (rec.length != 0);
    },
    whereAllegaDocumenti: function (rec)
    {
        return (rec.length != 0);
    },
    whereSincronizzaStudi: function (rec)
    {
        return true;//(LIB.isValid(home.basePC.NAMESPACE_PACS) && home.basePC.NAMESPACE_PACS=='CSH');

    }   ,
    Consenso : function (rec,Type)
    {
        //console.log(rec[0]);
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=CONSENSO_COMPED&IDEN_DETTAGLIO=' + rec[0].IDEN_DETTAGLIO + '&TYPE=' +Type+'&IDEN_CDC=' + rec[0].IDEN_CDC ,id:'SCHEDA_RICHIESTA_MODIFICA',fullscreen:true});
    },
    associaMedicoRefertante  : function (rec)
    {
        var iden_esami_selezionati="";
        var p=new Object();
        p.IDEN_TESTATA=rec[0].IDEN_TESTATA;
        p.IDEN_DETTAGLIO=rec[0].IDEN_DETTAGLIO;
        p.IDEN_CDC=rec[0].IDEN_CDC;
        p.CBK_OK_PROCEDURA="FNC_UPDATE_MEDICO_REFERTANTE"
        p.query="WORKLIST.CMB_MEDICI_REFERTANTI_CDC";
        p.title="Assegna Medico Refertante";
        for (var r=0;r<rec.length;r++)
        {
            if(iden_esami_selezionati!="")
                iden_esami_selezionati+=",";
            iden_esami_selezionati+= rec[r].IDEN_DETTAGLIO;
        }
        p.PARAM_BCK={"iden_esami_selezionati":iden_esami_selezionati,"iden_operatore_collegato":home.baseUser.IDEN_PER} ;
       home.DIALOG.sceltaOperatore(p);
    },
    whereassociaMedicoRefertante  : function (rec){
         for (var r=0;r<rec.length;r++)
         {
            if(rec[r].ESAME_DETTAGLIO_STATO>=120)return false;
         }
        return true;
    },
    wheresetNonFatturare  : function (rec){
        if(rec.length != 1)
        {
            return false;
        }
        if(typeof home.basePermission.ADMIN_TARMED == 'undefined')
        {
            return false;
        }
        var vPagato = rec[0].PAGATO;
        if(vPagato!= null && vPagato.indexOf("^") > -1){
            if(vPagato.split("^")[0]=="S")
            {
                return false
            }
        }
        return true;
    },
    setNonFatturare    : function (rec){
        var stato="N";
        var vPagato = rec[0].PAGATO;
        if(vPagato!= null && vPagato.indexOf("^") > -1){
            if(vPagato.split("^")[0]=="K")
            {
                stato="S";
            }
        }
        NS_ESAMI.setNonFatturare(rec[0].IDEN_TESTATA,stato)
    },

    associaNumeroCaso: function(params)
    {
        alert('Bisogna scrivere la procedura, qui NS_SCRIPT_WK');
        //console.log(params);
        return true;
        var db = $.NS_DB.getTool();
        /*var xhr = db.call_function(
         {
         datasource: 'POLARIS_DATI',
         id: 'GESTIONE_RIS_PRENOTA.SOSPENDI_AGENDA',
         parameter: params.params
         }); */

        xhr.done(function (response) {

            var status = response.p_result.split('$')[0];

            if (status == 'OK') {
                home.NOTIFICA.success({ message: 'Associazione eseguita correttaemente', title: 'Successo!' });
            }
            else {
                home.NOTIFICA.error({ message: 'Errore nella procedura di associazione', title: 'Errore!' });
            }

            if (LIB.isValid(myp.dialogContext)) {
                myp.dialogContext.data.close();
            }

            NS_FENIX.aggiorna();
        });

        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            //FUNZIONI_PRENOTAZIONE.logger.error('Errore FUNZIONI_PRENOTAZIONE.dbSospendi: ' + errorThrown);
            home.NOTIFICA.error({ message: 'Errore', title: 'Errore!' });
        });
        return true;
    }



}

var NS_MENU_ANAGRAFICA = {
    cancellaAnagrafica:function(rec){
      home.DIALOG.autenticazione(
      {
          "loadUser": true,
          "callback": function(ctx)
        {
            NS_MENU_ANAGRAFICA.doCancellaAnagrafica(rec);
        }
        }
      )
    },
    doCancellaAnagrafica:function(rec){

        var dbParams={
            p_iden_anag:{v:rec[0].IDEN,t:'N'},
            p_utente:{v:home.baseUser.IDEN_PER,t:'N'}
        }
        var db = $.NS_DB.getTool();
        var xhr = db.call_function(
            {
                datasource: 'POLARIS_DATI',
                id: 'DELETE_ANAGRAFICA',
                parameter: dbParams
            });

        xhr.done(function (response) {
            if(response.p_result.split("$")[0]=="OK")
            {
                NOTIFICA.success({"title":"Success!","message":traduzione.msgOkDeleteAnagrafica});
                NS_FENIX_WK.aggiornaWk();
            }
            else{
                var msg = response.p_result.split("$")[1];
                var error_msg = (LIB.isValid(traduzione[msg]))?traduzione[msg]:traduzione.msgKoDeleteAnagrafica;
                NOTIFICA.error({"title":"Error!","message":error_msg});
                home.logger.error('Errore cancellaAnagrafica : ' + msg);
            }
        });

        xhr.fail(function (jqXHR, textStatus, errorThrown){
            NOTIFICA.error({"title":"Error!","message":traduzione.msgKoDeleteAnagrafica});
            home.logger.error('Errore cancellaAnagrafica : ' + errorThrown);

        });

    },
    whereCancellaAnagrafica:function(rec){
        if(rec.length !=1 || NS_MENU_ANAGRAFICA.IsRemota(rec))return false;

        if(LIB.isValid(home.basePermission.ANAGRAFICA) && !LIB.ToF(home.basePermission.ANAGRAFICA.CANCELLA))
            return false;

        return true;
    } ,
    whereModificaAnagrafica:function(rec){
        if(rec.length !=1 || NS_MENU_ANAGRAFICA.IsRemota(rec))return false;

        return true;
    } ,
    IsRemota:function(rec){
        if(LIB.isValid(rec[0].URL_REMOTA))return true;
        else  return false;
    } ,
    InserisciEsame:function(rec){
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ESAME&STATO_ESAME=30&IDEN_ANAGRAFICA='+rec[0].IDEN_ANAGRAFICA,id:'SchedaEsamePage',fullscreen:true});
    },
    PrenotaEsame:function(rec){
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ESAME&IDEN_ANAGRAFICA='+rec[0].IDEN_ANAGRAFICA+'&STATO_ESAME=10',id:'SchedaEsamePage',fullscreen:true});
    },
    ElaboraRemoto:function(rec,cbk){
        var $this = this;
        $.support.cors = true;
        $.ajax({
            url: rec[0].URL_REMOTA,
            dataType : "json",
            type : "POST" ,
            success:function(r){
                if( r.result === "OK" )
                {
                    rec[0].IDEN_ANAGRAFICA= r.message;
                    cbk.call($this, rec);
                }
                else
                {
                    home.NOTIFICA.error({
                        message: r.message,
                        title: "Errore Anagrafica Remota"
                    });
                }
            },
            error: function (r)
            {
                home.NOTIFICA.error({
                    message: r.message,
                    title: "Errore Anagrafica Remota"
                });
            }
        });
    },

    ApriDettaglio :function(obj,n, data, wk){


        if(NS_MENU_ANAGRAFICA.IsRemota([data]))
        {
            return obj.openDetailRow(0, data, wk,NS_MENU_ANAGRAFICA.banane);
        }
        else
        {
            return obj.openDetailRow(0, data, wk,'pupp');
        }
    },

    banane: function(obj,n,rec,wk)
    {

        var $this = this;
        $.support.cors = true;
        $.ajax({
            url: rec.URL_REMOTA,
            dataType : "json",
            type : "POST" ,
            async: false,
            success:function(r){
                if( r.result === "OK" )
                {
                    rec.IDEN_ANAGRAFICA= r.message;
                    return obj.cbkOpen(n,rec,wk);
                }
                else
                {
                    home.NOTIFICA.error({
                        message: r.message,
                        title: "Errore Anagrafica Remota"
                    });
                }
            },
            error: function (r)
            {
                home.NOTIFICA.error({
                    message: r.message,
                    title: "Errore Anagrafica Remota"
                });
            }
        });


    }
}

var NS_MENU_RICHIESTE_MODIFICA = {

    richiediModificaAnag: function(rec,row)
    {
        var params = '&IDEN_ANAGRAFICA=' +rec[0].IDEN_ANAGRAFICA;
        params += '&TIPO_RICHIESTA=ANAGRAFICA';
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_RICHIESTA_MODIFICA' + params ,id:'SCHEDA_RICHIESTA_MODIFICA',fullscreen:true});
    },

    whereModificaAnag: function(rec,row)
    {
        return rec.length == 1;
    },

    richiediModificaDettaglio: function(rec,row)
    {
        var params = '&IDEN_DETTAGLIO=' + rec[0].IDEN_DETTAGLIO + '&IDEN_ANAGRAFICA=' +rec[0].IDEN_ANAGRAFICA;
        params += '&TIPO_RICHIESTA=DETTAGLIO';
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_RICHIESTA_MODIFICA' + params ,id:'SCHEDA_RICHIESTA_MODIFICA',fullscreen:true});
    },

    whereModificaDettaglio: function(rec,row)
    {
        return rec.length == 1;
    },

    richiediModificaTestata: function(rec,row)
    {
        var params = '&IDEN_TESTATA=' + rec[0].IDEN_TESTATA+ '&IDEN_ANAGRAFICA=' +rec[0].IDEN_ANAGRAFICA;
        params += '&TIPO_RICHIESTA=TESTATA';
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_RICHIESTA_MODIFICA' + params ,id:'SCHEDA_RICHIESTA_MODIFICA',fullscreen:true});
    },

    whereModificaTestata: function(rec,row)
    {
        return rec.length == 1;
    },

    richiediModificaReferto: function(rec,row)
    {
        var params = '&IDEN_TESTATA=' + rec[0].IDEN_TESTATA+ '&IDEN_REFERTO=' + rec[0].IDEN_REFERTO + '&IDEN_ANAGRAFICA=' +rec[0].IDEN_ANAGRAFICA;
        params += '&TIPO_RICHIESTA=REFERTO';
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_RICHIESTA_MODIFICA' + params ,id:'SCHEDA_RICHIESTA_MODIFICA',fullscreen:true});
    },

    whereModificaReferto: function(rec,row)
    {
        return rec.length == 1 && rec[0].IDEN_REFERTO;
    },

    whereGeneric: function(rec,row)
    {
        var p = (LIB.getParameter(home.basePermission, 'RICHIESTE_MODIFICA') == null) ? {"notifiche":"N","inserimento":"S","esecuzione":"N"} : LIB.getParameter(home.basePermission, 'RICHIESTE_MODIFICA');
        var x = false;
        try{
            x = (p.inserimento == 'S') && (rec.length == 1);
        }
        catch(e)
        {
            x = false;
        }
        return x;
    }
}

var NS_WK_SYSTEM_ADMIN = {

    clickRow: function(rec,row)
    {
        $(row).selectedLine('IDEN', 'clsSel');
    },

    processTipoRichiesta: function(data,wk)
    {
        var params = '&IDEN_RICHIESTA=' + data.IDEN;
        params += '&TIPO_RICHIESTA=' + data.TIPO;
        params += '&READONLY=S';
        var url = "javascript:home.NS_FENIX_TOP.apriPagina({\"url\":\"page?KEY_LEGAME=SCHEDA_RICHIESTA_MODIFICA" + params + "\",\"id\":\"SCHEDA_RICHIESTA_MODIFICA\",\"fullscreen\":true})";

        return $(document.createElement('a')).attr('href',url).html(data.TIPO_RICHIESTA);
    },

    whereApriScheda: function(rec, row)
    {
        return true;
    },

    apriScheda: function(rec, row)
    {
        var params = '&IDEN_RICHIESTA=' + rec[0].IDEN;
        params += '&TIPO_RICHIESTA=' + rec[0].TIPO;
        params += '&READONLY=S';
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_RICHIESTA_MODIFICA' + params ,id:'SCHEDA_RICHIESTA_MODIFICA',fullscreen:true});
    },

    whereModifica: function(rec, row)
    {
        return rec.length == 1 && (((rec[0].STATO == 'I') || (rec[0].STATO == 'W')) && (rec[0].IDEN_RICHIEDENTE == home.baseUser.IDEN_PER));
    },

    modifica: function(rec, row)
    {
        var params = '&IDEN_RICHIESTA=' + rec[0].IDEN;

        if(LIB.isValid(rec[0].IDEN_ANAGRAFICA)) params += '&IDEN_ANAGRAFICA=' +rec[0].IDEN_ANAGRAFICA;
        if(LIB.isValid(rec[0].IDEN_DETTAGLIO)) params += '&IDEN_DETTAGLIO=' + rec[0].IDEN_DETTAGLIO;
        if(LIB.isValid(rec[0].IDEN_TESTATA)) params += '&IDEN_TESTATA=' + rec[0].IDEN_TESTATA;
        if(LIB.isValid(rec[0].IDEN_REFERTO)) params += '&IDEN_REFERTO=' + rec[0].IDEN_REFERTO;

        params += '&TIPO_RICHIESTA=' + rec[0].TIPO;
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_RICHIESTA_MODIFICA' + params ,id:'SCHEDA_RICHIESTA_MODIFICA',fullscreen:true});
    },

    whereEsegui: function(rec, row)
    {
        var p = (LIB.getParameter(home.basePermission, 'RICHIESTE_MODIFICA') == null) ? {"notifiche":"N","inserimento":"N","esecuzione":"N"} : LIB.getParameter(home.basePermission, 'RICHIESTE_MODIFICA');
        return rec.length == 1 && ((p.esecuzione == 'S') && ((rec[0].STATO == 'I') || (rec[0].STATO == 'W')));
    },

    esegui: function(rec, row)
    {
        home.DIALOG.autenticazione(
            {
                "loadUser": true,
                "callback": function(ctx)
                {
                    var param = {
                        "p_iden_richiesta": rec[0].IDEN,
                        "p_username": ctx.getContent().find('#txtUsr').val()
                    };

                    toolKitDB.executeFunction("GESTIONE_RICHIESTE_MODIFICA.ESEGUI", param,
                        {
                            callback: function (response)
                            {
                                if(response.p_result.toString().substr(0,2) == 'KO')
                                {
                                    throw response.p_result.split('$')[1];
                                }

                                home.NOTIFICA.success({
                                    message: traduzione.okEsecuzione,
                                    timeout: 3
                                });



                                NS_FENIX.aggiorna();
                            },
                            timeout: 3000,
                            errorHandler: function (response)
                            {
                                var err = (response.toString().substr(0,11) == 'traduzione.') ? eval (response) : response;

                                home.NOTIFICA.error({
                                    message: err,
                                    title: "Error!",
                                    timeout: 3
                                });

                                //home.logger.error("NS_WK_SYSTEM_ADMIN.esegui - " + err);
                            }
                        });
                }
            });
    },

    whereValida: function(rec, row)
    {
        return rec.length == 1 && ((rec[0].STATO == 'E') && (rec[0].IDEN_RICHIEDENTE == home.baseUser.IDEN_PER));
    },

    valida: function(rec, row)
    {
        home.DIALOG.autenticazione(
            {
                "loadUser": true,
                "callback": function(ctx)
                {
                    var param = {
                        "p_iden_richiesta": rec[0].IDEN,
                        "p_username": ctx.getContent().find('#txtUsr').val()
                    };

                    toolKitDB.executeFunction("GESTIONE_RICHIESTE_MODIFICA.VALIDA", param,
                        {
                            callback: function (response)
                            {
                                if(response.p_result.toString().substr(0,2) == 'KO')
                                {
                                    throw response.p_result.split('$')[1];
                                }

                                home.NOTIFICA.success({
                                    message: traduzione.okValida,
                                    timeout: 3
                                });

                                NS_FENIX.aggiorna();
                            },
                            timeout: 3000,
                            errorHandler: function (response)
                            {
                                var err = (response.toString().substr(0,11) == 'traduzione.') ? eval (response) : response;

                                home.NOTIFICA.error({
                                    message: err,
                                    title: "Error!",
                                    timeout: 3
                                });

                                //home.logger.error("NS_WK_SYSTEM_ADMIN.valida - " + err);
                            }
                        });
                }
            });
    },

    whereNonValida: function(rec, row)
    {
        return rec.length == 1 && ((rec[0].STATO == 'E') && (rec[0].IDEN_RICHIEDENTE == home.baseUser.IDEN_PER));
    },

    nonValida: function(rec, row)
    {
        home.DIALOG.autenticazione(
            {
                "loadUser": true,
                "callback": function(ctx)
                {
                    var param = {
                        "p_iden_richiesta": rec[0].IDEN,
                        "p_username": ctx.getContent().find('#txtUsr').val()
                    };

                    toolKitDB.executeFunction("GESTIONE_RICHIESTE_MODIFICA.INVALIDA", param,
                        {
                            callback: function (response)
                            {
                                if(response.p_result.toString().substr(0,2) == 'KO')
                                {
                                    throw response.p_result.split('$')[1];
                                }

                                home.NOTIFICA.success({
                                    message: traduzione.okNonValida,
                                    timeout: 3
                                });

                                NS_FENIX.aggiorna();
                            },
                            timeout: 3000,
                            errorHandler: function (response)
                            {
                                var err = (response.toString().substr(0,11) == 'traduzione.') ? eval (response) : response;

                                home.NOTIFICA.error({
                                    message: err,
                                    title: "Error!",
                                    timeout: 3
                                });

                                //home.logger.error("NS_WK_SYSTEM_ADMIN.nonValida - " + err);
                            }
                        });
                }
            });
    },

    whereAnnulla: function(rec, row)
    {
        var p = (LIB.getParameter(home.basePermission, 'RICHIESTE_MODIFICA') == null) ? {"notifiche":"N","inserimento":"N","esecuzione":"N"} : LIB.getParameter(home.basePermission, 'RICHIESTE_MODIFICA');
        return rec.length == 1 && (((rec[0].STATO == 'I') || (rec[0].STATO == 'W')) && ((rec[0].IDEN_RICHIEDENTE == home.baseUser.IDEN_PER) || (p.esecuzione == 'S')));
    },

    annulla: function(rec, row)
    {
        home.DIALOG.autenticazione(
            {
                "loadUser": true,
                "callback": function(ctx)
                {
                    var param = {
                        "p_iden_richiesta": rec[0].IDEN,
                        "p_username": ctx.getContent().find('#txtUsr').val()
                    };

                    toolKitDB.executeFunction("GESTIONE_RICHIESTE_MODIFICA.ANNULLA", param,
                        {
                            callback: function (response)
                            {
                                if(response.p_result.toString().substr(0,2) == 'KO')
                                {
                                    throw response.p_result.split('$')[1];
                                }

                                home.NOTIFICA.success({
                                    message: traduzione.okValida,
                                    timeout: 3
                                });

                                NS_FENIX.aggiorna();
                            },
                            timeout: 3000,
                            errorHandler: function (response)
                            {
                                var err = (response.toString().substr(0,11) == 'traduzione.') ? eval (response) : response;

                                home.NOTIFICA.error({
                                    message: err,
                                    title: "Error!",
                                    timeout: 3
                                });

                                //home.logger.error("NS_WK_SYSTEM_ADMIN.valida - " + err);
                            }
                        });
                }
            });
    }
}

var NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA ={
    allegaDocumenti:function(rec){
        home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_DOCUMENTI_ALLEGATI&IDEN_TESTATA=' + rec[0].IDEN_ESAME_TESTATA + '&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA ,id:'WK_DOCUMENTI',fullscreen:true});
    },
    whereAllegaDocumenti:function(rec){
        if( typeof rec[0].IDEN_ANAGRAFICA !='undefined' && rec[0].IDEN_ANAGRAFICA != "" && rec[0].IDEN_ANAGRAFICA != null){
            return true;
        }else{
            return false;
        }
    },

    wherePrenota: function(rec)
	{
		return ( rec.length == 1 && moment().format('YYYYMMDD') <= rec[0]['DATA'] && rec[0]['STATO'] != 'S' );
	},

    prenota: function( row, tipoPrenotazione )                                                                          // PRENOTAZIONE
    {
        var parameters =
        {
            pUser :                 home.baseUser.USERNAME,
            pIp:                    home.basePC.IP,
            pIdNomenclatori:        '',
            pIdErogante:            row[0]['IDEN_EROGANTE'],
            pData:                  row[0]['DATA'],
            pOraInizio:             row[0]['ORA_INIZIO'],
            pTipo:                  tipoPrenotazione.toUpperCase(),
            pIdRegistro:            row[0]['IDEN_REGISTRO'],
            pIdFasciaOraria:        row[0]['IDEN_FASCIA_ORARIA'],
            pIdDettaglioRegistro:   row[0]['IDEN_REGISTRO_DETTAGLIO']
        }

        NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.prenotaOccupaAgenda( parameters );
    },

    // OCCUPA L'AGENDA E CHIAMA LA SCHEDA ESAME
	prenotaOccupaAgenda: function( parameters )
	{
        toolKitPrenotazione.occupa_agenda( parameters, 'GESTIONE_RIS_PRENOTA.OCCUPA_AGENDA', '',
			{
				callback: function( response )
				{
                    CP.logger.debug('Callback occupa_agenda(): '+ JSON.stringify( response ) +' chiamata con i parametri: '+ JSON.stringify( parameters )  );

                    var status                  = response.split('$')[0];
                    var iden_agenda_dettaglio   = ( status == 'OK' ) ? ( response.split('$')[1] ).split(';')[0] : false;
                    var ora_agenda              = ( status == 'OK' ) ? ( response.split('$')[1] ).split(';')[1] : false;

                    if( !iden_agenda_dettaglio )
                        home.NOTIFICA.error({ message : traduzione.errIdenRiga, title : 'Errore!' });
                    else
                        home.NS_FENIX_TOP.apriPagina({ 'url' : 'page?KEY_LEGAME=SCHEDA_ESAME&IDEN_AGENDA_DETTAGLIO='+ iden_agenda_dettaglio +'&ORA_AGENDA='+ ora_agenda +'&DATA_AGENDA='+ parameters.pData +'&IDEN_EROGANTE='+ parameters.pIdErogante +'&IDEN_REGISTRO='+ parameters.pIdRegistro +'&IDEN_FASCIA_ORARIA='+ parameters.pIdFasciaOraria +'&TIPO='+ parameters.pTipo +'&STATO_ESAME=10&TAB_ATTIVO=tabRicercaPaziente&FROM=CONSULTA_PRENOTAZIONE' , 'fullscreen' : true });
				},

				errorHandler: function(errorString, exception)
				{
					CP.logger.error('Errore nella chiamata a occupa_agenda(). '+ errorString +' - '+ exception );
				}
			});
	},

	whereTaglia: function(rec)
	{
		var ret = ( rec.length > 0 ) ? true : false;

		for( var i = 0; i < rec.length; i++ )
			if( ! LIB.isValid( rec[i]['IDEN_ESAME_TESTATA'] ) )
				ret = false;

		return ret;
	},

    taglia: function( row )                                                                                             // TAGLIA LA RIGA SELEZIONATA E CHIAMA LOCK ROW
    {
        var parameters =
        {
            p_table:        'ESAMI_TESTATA',
            p_iden:         new Array(),
            p_username:     home.baseUser.USERNAME,
            p_ip:           home.basePC.IP,
            p_message:      ''
        }

        home.NS_FENIX_TOP.currentRowConsultaPrenotazione = row;

        this.addRowsIcons( row, CP.classes.rowCut, 'icon-scissors' );

        for( var i = 0; i < row.length; i++ )
            parameters.p_iden.push( row[i]['IDEN_ESAME_TESTATA'] );

        parameters.p_iden = parameters.p_iden.join(',').toString();

        LOCKS.lock_rows(parameters, function ()
        {
            NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.tagliaLockRowCbk(row);
        });
    },

    tagliaLockRowCbk: function(row)
    {
        if(! CP.locked )
            home.NOTIFICA.error({ message : traduzione.errLockRow, title : 'Errore!' });
        else
            this.addRowsIcons( row, CP.classes.rowCut, 'icon-scissors' );
    },

    whereCopia: function(rec)
    {
        return (rec.length != 0);
    },

    copia: function( row )
    {
        home.NS_FENIX_TOP.currentRowConsultaPrenotazione = row;

        this.addRowsIcons( row, CP.classes.rowCopied, 'icon-docs' );
    },

    whereIncolla: function( rec )
    {
        return ( LIB.isValid( home.NS_FENIX_TOP.currentRowConsultaPrenotazione ) && home.NS_FENIX_TOP.currentRowConsultaPrenotazione.length > 0 );
    },

    incolla: function( row )
        // APRE IL PLUGIN RESUME PASSANDO I DATI RELATIVI ALLE RIGHE TAGLIATE E PERMETTE DI SCEGLIERE QUALE INCOLLARE NELLA RIGA SELEZIONATA
    {
        var currentRow  = home.NS_FENIX_TOP.currentRowConsultaPrenotazione;
        var content     = new Array();
        var htmlString	= '';

        for( var i = 0; i < currentRow.length; i++ )
        {
            var data	= DATE.format( { date : currentRow[i]['DATA'], format : 'YYYYMMDD', format_out : 'DD/MM/YYYY' });

            htmlString	 = '<i class="icon-docs"></i>';
            htmlString	+= '<div class="date">'+			currentRow[i]['ORA'] +' '+ data			+'</div>';
            htmlString	+= '<div class="patient">'+ 		currentRow[i]['PAZIENTE'] 				+'</div>';
            htmlString	+= '<div class="exam">'+ 			currentRow[i]['DESCRIZIONE_ESAME'] 		+'</div>';
            htmlString	+= '<input type="hidden" value="'+ 	currentRow[i]['IDEN_ESAME_TESTATA'] 	+'">';
            content.push( htmlString );
        }

        if( typeof CP.resume !== 'object' )
        {
            CP.resume =
                $('#contentGrid').Resume(
                    {
                        title:		'Scegliere l\'esame da incollare',
                        width:      '800',
                        top:        'auto',
                        left:       'auto',
                        content:    content,
                        click:      function( row ){ NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.resumeClick( row ); },
                        addIcon:    $('.rowGrid > .headRowGrid', '.headerGrid'),
                        iconClass:  'icon-clipboard'
                    });
        }
        else
        {
            CP.resume.reloadContent( content );
            CP.resume.show();
        }
    },

    whereCancella: function(rec)
    {
        return (rec.length == 1) && (rec[0].IDEN_ESAME_DETTAGLIO);
    },

    cancella: function (row)
    {
        this.addRowsIcons(row, CP.classes.rowDeleted, 'icon-trash');
        home.DIALOG.autenticazione(
            {
                'loadUserReadonly': true,
                'callback': function (ctx)
                {
                    if (LIB.isValid(ctx) && LIB.isValid(ctx.data))
                    {
                        ctx.data.close();
                    }

                    home.DIALOG.cancellazioneEsame({ 'rows': row, 'callback': function (ctx)
                    {
                        ctx.data.close();
                        NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.refreshWorklist();
                    }});
                }
            });
    },

    whereSospendi: function (rec)
    {
        var ret = true;

        for (var i = 0; i < rec.length; i++)
            if (rec[i]['STATO'] == 'S' || LIB.isValid(rec[i]['IDEN_ESAME_TESTATA']))
            {
                return false;
            }

        return ret;
    },

    sospendi: function (row)
    {
        // PACKAGE
        var pkg = 'GESTIONE_RIS_PRENOTA';
        // Funzione del package da utilizzare, viene impostata
        var fnc = '';
        var params = {};

        if (row.length > 1)
        {
            var note = LIB.getJoined(row, 'NOTE');
            note = note.replace(/,/g, '');

            if (note)
            {
                home.NOTIFICA.warning({ message: traduzione.warnPresentiNote, title: traduzione.lblAttenzione});
                return false;
            }

            //sospensione multipla
            params =
            {
                pUser: home.baseUser.USERNAME,
                pIp: home.basePC.IP,
                pIdErogante: LIB.getJoined(row, 'IDEN_EROGANTE'),
                pData: row[0]['DATA'],
                pOraInizio: LIB.getJoined(row, 'ORA_INIZIO'),
                pOraFine: LIB.getJoined(row, 'ORA_FINE'),
                pIdRegistro: LIB.getJoined(row, 'IDEN_REGISTRO'),
                pIdFasciaOraria: LIB.getJoined(row, 'IDEN_FASCIA_ORARIA'),
                pIdDettaglioRegistro: LIB.getJoined(row, 'IDEN_REGISTRO_DETTAGLIO'),
                pNote: ''
            }

            fnc = 'SOSPENDI_AGENDA';
        }
        else
        {
            var nota = row[0]['NOTE'];

            if (nota  != '')
            {
                fnc = 'CONVERTI_NOTE_IN_SOSPENSIONE';

                params =
                {
                    pUser: home.baseUser.USERNAME,
                    pIp: home.basePC.IP,
                    pIdDettaglioRegistro: row[0]['IDEN_REGISTRO_DETTAGLIO'],
                    pNote: nota
                }
            }
            else
            {
                fnc = 'SOSPENDI_AGENDA';

                params =
                {
                    pUser: home.baseUser.USERNAME,
                    pIp: home.basePC.IP,
                    pIdErogante: row[0]['IDEN_EROGANTE'],
                    pData: row[0]['DATA'],
                    pOraInizio: row[0]['ORA_INIZIO'],
                    pOraFine: row[0]['ORA_FINE'],
                    pIdRegistro: row[0]['IDEN_REGISTRO'],
                    pIdFasciaOraria: row[0]['IDEN_FASCIA_ORARIA'],
                    pIdDettaglioRegistro: row[0]['IDEN_REGISTRO_DETTAGLIO'],
                    pNote: nota
                }
            }
        }

        var textarea = $('<textarea>', { 'id': 'noteDialog', 'class': 'liquid' }).html(params.pNote);
        //alert(params);return;

        $.dialog(textarea, {
            'id': 'dialogNote',
            'width': 500,
            'height': 250,
            'title': 'Indicare il motivo della sospensione per il giorno: ' + DATE.format({ date: row[0]['DATA'], format: 'YYYYMMDD', format_out: 'DD/MM/YYYY' }),
            'showBtnClose': false,
            'buttons': [
                {
                    'label': 'Salva',
                    'action': function (context)
                    {
                        var nota = $('#noteDialog').val();

                        if (nota != '')
                        {
                            params.pNote = nota;

                            var myParams = {
                                "pkg": pkg,
                                "fnc": fnc,
                                "params": params,
                                "context": context
                            };

                            CP.logger.debug('Sospensione in corso con funzione ' + pkg + '.' + fnc + ' con parametri: ' + JSON.stringify(params));
                            //return;

                            NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.dwrSospendi(myParams);
                        }
                        else
                        {
                            home.NOTIFICA.warning({ message: traduzione.errNoteEmpty, title: traduzione.lblAttenzione });
                        }
                    }
                },
                {
                    'label': 'Chiudi',
                    'action': function (context)
                    {
                        context.data.close();
                    }
                }
            ]
        });
    },

    dwrSospendi: function(myParams)
    {
        var funzioneSospensione = myParams.pkg + '.' + myParams.fnc;

        toolKitPrenotazione.sospendi(myParams.params, funzioneSospensione, '',
            {
                callback: function (response)
                {
                    CP.logger.debug('Callback sospendi_agenda(): ' + JSON.stringify(response) + ' chiamata con i parametri: ' + JSON.stringify(myParams.params));

                    NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.dwrSospendiCbk(response, myParams.context);
                },
                errorHandler: function (errorString, exception)
                {
                    CP.logger.error('Errore nella chiamata a sospendi_agenda(). ' + errorString + ' - ' + exception);
                }
            });
    },

    dwrSospendiCbk: function(response, context)
    {
        var status = response.split('$')[0];

        if (status == 'OK')
        {
            home.NOTIFICA.success({ message: traduzione.successSave, title: 'Successo!' });
        }
        else
        {
            home.NOTIFICA.error({ message: traduzione.errNote, title: 'Errore!' });
        }

        NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.refreshWorklist(context);
    },

    whereNote: function(rec)
    {
        return (rec.length == 1) && (rec[0]['STATO'] != 'S') ;
    },

    note: function( row )
    {
        var parameters =
        {
            pUser: home.baseUser.USERNAME,
            pIp: home.basePC.IP,
            pIdErogante: row[0]['IDEN_EROGANTE'],
            pData: row[0]['DATA'],
            pOraInizio: row[0]['ORA_INIZIO'],
            pOraFine: row[0]['ORA_FINE'],
            pIdRegistro: row[0]['IDEN_REGISTRO'],
            pIdFasciaOraria: row[0]['IDEN_FASCIA_ORARIA'],
            pIdDettaglioRegistro: row[0]['IDEN_REGISTRO_DETTAGLIO'],
            pNote: row[0]['NOTE']
        }

        var textarea    = $('<textarea>', { 'id' : 'noteDialog', 'class' : 'liquid' }).html(parameters.pNote);

        $.dialog(textarea, {
            'id':               'dialogNote',
            'width':            500,
            'height':           250,
            'title':            'Inserimento nota per il giorno: ' + DATE.format( { date : row[0]['DATA'], format : 'YYYYMMDD', format_out : 'DD/MM/YYYY' }),
            'showBtnClose':     false,
            'buttons':
                [
                    {
                        'label' : 'Salva',
                        'action' : function(context)
                        {
                            var nota = $('#noteDialog').val();

                            if (nota != '')
                            {
                                parameters.pNote = nota;
                                NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.dwrNote(parameters, context);
                            }
                            else
                            {
                                home.NOTIFICA.warning({ message : traduzione.errNoteEmpty, title : 'Attenzione!' });
                            }
                        }
                    },
                    {
                        'label' : 'Chiudi',
                        'action' : function(context)
                        {
                            NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.refreshWorklist( context );
                        }
                    }
                ]
        });
    },

    dwrNote: function(parameters, context)
    {
        toolKitPrenotazione.note( parameters, 'GESTIONE_RIS_PRENOTA.NOTE_AGENDA', '',
            {
                callback: function( response )
                {
                    CP.logger.debug('Callback note_agenda(): '+ JSON.stringify( response ) +' chiamata con i parametri: '+ JSON.stringify( parameters )  );

                    var status = response.split('$')[0];
                    if( status == 'OK' )
                        home.NOTIFICA.success({ message : traduzione.successSave, title : 'Successo!' });
                    else
                        home.NOTIFICA.error({ message : traduzione.errNote, title : 'Errore!' });

                    NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.refreshWorklist(context);
                },
                errorHandler: function(errorString, exception)
                {
                    CP.logger.error('Errore nella chiamata a note_agenda(). '+ errorString +' - '+ exception );
                }
            });
    },

    whereAnnullaNote: function(rec)
    {
        return ( rec.length == 1 && rec[0]['STATO'] == 'N' );
    },

    annullaNote: function (row)
    {
        var params = {
            "row": row, cbkSi: NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.annullaNoteCbk
        }
        home.DIALOG.si_no(params);
    },

    annullaNoteCbk: function (p)
    {
        var row = p.row;
        var parameters =
        {
            pUser: home.baseUser.USERNAME,
            pIp: home.basePC.IP,
            pIdDettaglioRegistro: row[0]['IDEN_REGISTRO_DETTAGLIO']
        };

        toolKitPrenotazione.cancella_note( parameters, 'GESTIONE_RIS_PRENOTA.ANNULLA_NOTE_AGENDA', '',
            {
                callback: function(response)
                {
                    CP.logger.debug('Callback cancella_note(): '+ JSON.stringify( response ) +' chiamata con i parametri: '+ JSON.stringify( parameters )  );

                    var status = response.split('$')[0];
                    if( status == 'OK' )
                        home.NOTIFICA.success({ message : traduzione.successSave, title : 'Successo!' });
                    else
                        home.NOTIFICA.error({ message : traduzione.errCancellaNote, title : 'Errore!' });

                    NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.refreshWorklist();
                },
                errorHandler: function(errorString, exception)
                {
                    CP.logger.error('Errore nella chiamata a cancella_note(). '+ errorString +' - '+ exception );
                }
            });
    },

    whereAnnullaSospendiAgenda: function(rec)
    {
        return ( rec.length == 1 && rec[0]['STATO'] == 'S' );
    },

    annullaSospendiAgenda: function (row)
    {
        var params = {
            "row": row
            ,cbkSi: NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.annullaSospendiAgendaCbk
        }
        home.DIALOG.si_no(params);
    },

    annullaSospendiAgendaCbk: function (p)
    {
        // PACKAGE
        var pkg = 'GESTIONE_RIS_PRENOTA';
        // Funzione del package da utilizzare, viene impostata
        var fnc = '';

        var row = p.row;
        var parameters =
        {
            pUser: home.baseUser.USERNAME,
            pIp: home.basePC.IP,
            pIdDettaglioRegistro: row[0]['IDEN_REGISTRO_DETTAGLIO'],
            pNote: row[0]['NOTE']
        };

        if(parameters.pNote != '')
        {
            fnc = 'CONVERTI_SOSPENSIONE_IN_NOTE';
        }
        else
        {
            delete parameters.pNote;
            fnc = 'ANNULLA_SOSPENDI_AGENDA';
        }

        var funzione = pkg + '.' + fnc;
        toolKitPrenotazione.cancella_sospensione(parameters, funzione, '',
            {
                callback: function (response)
                {
                    CP.logger.debug('Callback cancella_sospensione(): ' + JSON.stringify(response) + ' chiamata con i parametri: ' + JSON.stringify(parameters) + ' e funzione ' + funzione);

                    var status = response.split('$')[0];
                    if (status == 'OK')
                    {
                        home.NOTIFICA.success({ message: traduzione.successSave, title: 'Successo!' });
                    }
                    else
                    {
                        home.NOTIFICA.error({ message: traduzione.errCancellaNote, title: 'Errore!' });
                    }

                    SCH_DETTAGLIO.aggiorna();
                },
                errorHandler: function (errorString, exception)
                {
                    CP.logger.error('Errore nella chiamata a cancella_sospensione(). ' + errorString + ' - ' + exception);
                }
            });
    },

	liberaAgenda: function( idDettaglio )
	{
        var parameters =
        {
            pUser: home.baseUser.USERNAME,
            pIp: home.basePC.IP,
            pIdDettaglio: ( LIB.isValid(idDettaglio) ) ? idDettaglio : null
        }

        toolKitDB.executeProcedure( 'LIBERA_AGENDA', parameters,
            {
                callback: function( response )
                {
                    CP.logger.debug('Callback libera_agenda(): '+ JSON.stringify( response ) +' chiamata con i parametri: '+ JSON.stringify(parameters));
                },

                errorHandler: function(errorString, exception)
                {
                    CP.logger.error('Errore nella chiamata a libera_agenda(). '+ errorString +' - '+ exception );
                }
            });
    },

    resumeClick: function(row)
        // FUNZIONE RICHIAMATA AL CLICK SU UNA RIGA DEL RESUME. CHIAMA LA FUNZIONE INCOLLA.
    {
        var iden_esame_testata		= row.find(':hidden').val();
        var wkRow					= CPWK.objWk.getArrayRecord();
        var index					= row.index();
        var parameters              =
        {
            pUser :                 home.baseUser.USERNAME,
            pIp:                    home.basePC.IP,
            pIdTestata:             iden_esame_testata,
            pIdErogante:            wkRow[index]['IDEN_EROGANTE'],
            pData:                  wkRow[index]['DATA'],
            pOraInizio:             wkRow[index]['ORA_INIZIO'],
            pTipoOperazione:        'T',
            pIdRegistro:            wkRow[index]['IDEN_REGISTRO'],
            pIdFasciaOraria:        wkRow[index]['IDEN_FASCIA_ORARIA']
        }

        toolKitPrenotazione.incolla(parameters, '', '',
            {
                callback: function( response )
                {
                    CP.logger.debug('Callback incolla(): '+ JSON.stringify( response ) +' chiamata con i parametri: '+ JSON.stringify( parameters )  );

                    var status  	= response.split('$')[0];
                    var resume  	= row.closest('#resume');
                    var currentRow	= home.NS_FENIX_TOP.currentRowConsultaPrenotazione;

                    if( status == 'OK' )
                    {
                        resume.find('li:has(:hidden[value=\''+ parameters.pIdTestata +'\'])').each(function()
                        {
                            resume.data('Resume').removeRow( $(this).index() );
                        });

                        for( var i = 0; i < currentRow.length; i++ )
                            if( currentRow[i]['IDEN_TESTATA'] == parameters.pIdTestata )
                                home.NS_FENIX_TOP.currentRowConsultaPrenotazione.splice( i , 1 );

                        NS_MENU_CONSULTA_PRENOTAZIONE_GIORNALIERA.refreshWorklist();
                    }
                    else
                    {
                        home.NOTIFICA.error({ message : response.split('$')[1] , title : 'Errore!' });
                    }
                },

                errorHandler: function(errorString, exception)
                {
                    CP.logger.error('Errore nella chiamata a incolla(). '+ errorString +' - '+ exception );
                }
            });
    },

    refreshWorklist: function (context)
    {
        if( LIB.isValid( CP.resume ) )
            CP.resume.hide();

        if( LIB.isValid( context ) )
            context.data.close();

        try
        {
            typeof home.DSG != 'undefined'
                && home.DSG != null
                && typeof home.DSG.refreshGrid == 'function'
            && home.DSG.refreshGrid();

            typeof home.DSALA != 'undefined'
                && home.DSALA != null
                && typeof home.DSALA.refreshGrid == 'function'
            && home.DSALA.refreshGrid();

            typeof home.CPWK != 'undefined'
                && home.CPWK != null
                && typeof home.CPWK.refreshWk == 'function'
            && home.CPWK.refreshWk();
        }
        catch(e)
        {
            CP.logger.error('Errore durante l\'aggiornamento delle worklist(). ' + e.message);
        }
    }
}

var NS_INDIRIZZI = {

    clickRow: function(rec,row)
    {
        $(row).selectedLine('IDEN', 'clsSel');
    }
}

var NS_MENU_AREE ={

    idenErogante: 		new Array(),
    idenNomenclatore: 	new Array(),

    whereInserisci: function( rec )
    {

        return true;

    },

    inserisci: function( rec )
    {
        if(LIB.isValid(GESTIONE_TABELLE))
        {
            var idenSala = GESTIONE_TABELLE.wk.getArrayRecord()[0]['IDEN'];
            home.NS_FENIX_TOP.apriPagina( { url : 'page?KEY_LEGAME=SCHEDA_AREA&TIPO=AREA&IDEN_PADRE='+ idenSala, id : 'Scheda_Area', fullscreen : true });
        }



    },

    whereModifica: function( rec )
    {

        return rec.length == 1;

    },

    modifica: function( rec )
    {

        home.NS_FENIX_TOP.apriPagina( { url : 'page?KEY_LEGAME=SCHEDA_AREA&TIPO=AREA&IDEN=' + rec[0]['IDEN'] +'&IDEN_PADRE='+ rec[0]['IDEN_SALA'], id : 'Scheda_Area', fullscreen : true } );

    },

    whereAssociaEsami: function( rec )
    {

        return rec.length == 1;

    },

    associaEsami: function( rec )
    {

        home.NS_FENIX_TOP.apriPagina( { url : 'page?KEY_LEGAME=ASSOCIAZIONE_AREA_ESAME&IDEN=' + rec[0].IDEN, id : 'Associazione_Area_Esame', fullscreen : true } );

    },

    whereCopiaAssociazioni: function( rec )
    {

        return rec.length == 1;

    },

    copiaAssociazioni: function( rec )
    {

        var parameters =
        {
            'iden_erogante' : rec[0]['IDEN']
        };

        NS_MENU_AREE.idenNomenclatore = new Array();

        dwr.engine.setAsync(false);
        toolKitDB.getResult('DATI.GRUPPO_ASSOCIAZIONE', parameters, '', function( response )
        {

            for( var i = 0; i < response.length; i++ )
            {

                NS_MENU_AREE.idenNomenclatore.push( response[i]['IDEN'] );

            }

        });
        dwr.engine.setAsync(true);

    },

    whereIncollaAssociazioni: function( rec )
    {

        return ( rec.length > 0 && NS_MENU_AREE.idenNomenclatore.length > 0 );

    },

    incollaAssociazioni: function( rec )
    {

        var parameters =
        {
            'pIdenErogante' : 		'',
            'pIdenNomenclatore' : 	''
        }

        for( var i = 0; i < rec.length; i++ )
        {

            NS_MENU_AREE.idenErogante.push( rec[i]['IDEN'] );

        }

        parameters.pIdenErogante		= NS_MENU_AREE.idenErogante.join(',');
        parameters.pIdenNomenclatore	= NS_MENU_AREE.idenNomenclatore.join(',');

        dwr.engine.setAsync(false);
        toolKitDB.executeFunction('DUPLICA_ASSOCIAZIONE_ESAME', parameters, function( response )
        {

            var status	= response['p_result'].toString().split('$')[0];
            var message	= response['p_result'].toString().split('$')[1];

            if( status == 'OK' )
                home.NOTIFICA.success({ message : message , title : 'Successo!' });
            else
                home.NOTIFICA.error({ message : message, title : 'Errore!' });


            NS_MENU_AREE.idenErogante 		= new Array();
            NS_MENU_AREE.idenNomenclatore	= new Array();

        });
        dwr.engine.setAsync(true);

    },

    whereAssociaAgenda: function( rec )
    {

        return rec.length == 1;

    },

    associaAgenda: function( rec )
    {

        home.NS_FENIX_TOP.apriPagina( { url : 'page?KEY_LEGAME=ASSOCIAZIONE_AREA_AGENDA&IDEN=' + rec[0].IDEN, id : 'Associazione_Area_Agenda', fullscreen : true } );

    }

}

var NS_MENU_RIPRISTINO_CANCELLATI ={

    whereRipristinaAnagrafica: function( rec )
    {

        return ( rec.length == 1 && typeof rec[0]['IDEN_TESTATA'] === 'undefined' );

    },

    ripristinaAnagrafica: function( rec )
    {

        var parameters =
        {
            'p_idenAnagrafica' : rec[0]['IDEN_ANAGRAFICA']
        };

        dwr.engine.setAsync(false);
        toolKitDB.executeFunction('RIPRISTINA_ANAGRAFICA', parameters, function( response )
        {

            var status	= response.p_result.split('$')[0];
            var msg		= response.p_result.split('$')[1];

            if( status == 'OK' )
                home.NOTIFICA.success( { message : msg, title : 'Successo!' } )
            else
                home.NOTIFICA.error( { message : msg, title : 'Errore!' } )

            WORKLIST_RIPRISTINO_CANCELLATI.aggiorna();

        });
        dwr.engine.setAsync(true);

    },

    whereRipristinaEsame: function( rec )
    {

        var ret = true;

        for( var i = 0; i < rec.length; i++ )
            if( typeof rec[i]['IDEN_TESTATA'] === 'undefined' )
                ret = false;

        return ret;

    },

    ripristinaEsame: function( rec )
    {
        var idenEsameDettaglio	= new Array();
        var parameters			=
        {
            "pIdentestata":"",
            "pIdendettaglio":"",
             "pUtente":""
          };

        for( var i = 0; i < rec.length; i++ )
            idenEsameDettaglio.push( rec[i]['IDEN_DETTAGLIO'] );

        parameters.pIdendettaglio = idenEsameDettaglio.join(',');
        parameters.pUtente=home.baseUser.IDEN_PER

        dwr.engine.setAsync(false);
        toolKitDB.executeFunction('GESTIONE_RIS_ESAMI.RIPRISTINA_ESAME_CANCELLATO', parameters, function( response )
        {

            var status	= response.p_result.split('$')[0];
            var msg		= response.p_result.split('$')[1];

            if( status == 'OK' )
                home.NOTIFICA.success( { message : msg, title : 'Successo!' } )
            else
                home.NOTIFICA.error( { message : msg, title : 'Errore!' } )

            WORKLIST_RIPRISTINO_CANCELLATI.aggiorna();

        });
        dwr.engine.setAsync(true);
    }
}

var NS_RIC_NOSOLOGICO ={
    whereInserisciEsameNosologico: function (rec)
    {
        return (rec[0].CODICE_DECODIFICA == 'ADMITTED');
    },

    prenotaEsameNosologico: function (rec)
    {
        home.NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=SCHEDA_ESAME&IDEN_ANAGRAFICA=' + rec[0].IDEN_ANAGRAFICA + '&STATO_ESAME=10&IDEN_CONTATTO=' + rec[0].IDEN_CONTATTO + '&IDEN_CONTATTO_GIURIDICO=' + rec[0].IDEN_CONTATTO_GIURIDICO, id: 'SchedaEsamePage', fullscreen: true});
    },

    inserisciEsameNosologico: function (rec)
    {
        home.NS_FENIX_TOP.apriPagina({url: 'page?KEY_LEGAME=SCHEDA_ESAME&STATO_ESAME=30&IDEN_ANAGRAFICA=' + rec[0].IDEN_ANAGRAFICA + '&IDEN_CONTATTO=' + rec[0].IDEN_CONTATTO + '&IDEN_CONTATTO_GIURIDICO=' + rec[0].IDEN_CONTATTO_GIURIDICO, id: 'SchedaEsamePage', fullscreen: true});
    }
}

var NS_WK_IRD_DOCUMENTI_ALLEGATI ={
    apriDocumentoAllegato: function (url, mime_type, nome_file)
    {
        if (mime_type == 'application/pdf')
        {
            home.NS_FENIX_PRINT.anteprima({"URL": home.baseGlobal.PERCORSO_FILE_SERVER_DOCUMENTI + url });
        }
        else if (mime_type == 'audio/wav')
        {

            if (LIB.isValid(home.SPEECHMAGIC))
            {
                home.SPEECHMAGIC.loadAudio(url);
            }
            else
            {
                window.open(home.baseGlobal.PERCORSO_FILE_SERVER_DOCUMENTI + url + "&MIME_TYPE=" + mime_type + "&NOME_FILE=" + nome_file);
            }
        }
        else
        {
            window.open(home.baseGlobal.PERCORSO_FILE_SERVER_DOCUMENTI + url + "&MIME_TYPE=" + mime_type + "&NOME_FILE=" + nome_file);
        }
    }
}

var NS_MENU_RICHIESTE ={
    whereAccettaRichiesta: function (rec)
    {
        if(rec[0].STATO_TESTATA !="I")return false;
        return LIB.ToF(home.basePermission.RICHIESTE.ACCETTA);
    },
    wherePrenotaRichiesta: function (rec)
    {
        if(rec[0].STATO_TESTATA !="I")return false;
        return LIB.ToF(home.basePermission.RICHIESTE.PRENOTA);
    },
    whereAnullaRichiesta: function (rec)
    {
        if(rec[0].STATO_TESTATA !="I")return false;
        return LIB.ToF(home.basePermission.RICHIESTE.ANNULLA);
    },
    annullaRichiesta: function (rec)
    {
        if(LIB.ToF(home.baseGlobal.ANNULLA_RICHIESTA_PSW)) {
          home.DIALOG.autenticazione({
              loadUser:true,
              callback: function(){home.DIALOG.annullaRichiesta({"rows": rec});}
          });
        }else{
            home.DIALOG.annullaRichiesta({"rows": rec});
        }
    } ,
    stampaRichiesta: function (rec)
    {
        home.NS_FENIX_STAMPE_SPECIALI.stampaRichiesta({IDEN_TESTATA : rec[0].IDEN_TESTATA,IDEN_CDC : rec[0].IDEN_CDC} );
    },
    stampaListaWkRichieste: function (rec)
    {
        home.NS_FENIX_STAMPE_SPECIALI.stampaListaWkRichieste({IDEN_CDC:rec[0].IDEN_CDC});
    }

}

var NS_MENU_MASTERIZZAZIONI={
    masterizza:function(rec){
        //bla bla bla
    },
    rimasterizza:function(rec)
    {
        for(var i=0;i<rec.length;i++)
        {
            var p={
                'p_iden':rec[i].IDEN,
                'p_iden_robot':rec[i].ID_ROBOT,
                'p_priority':rec[i].PRIORITY,
                'p_copy_number':rec[i].COPIES_NUMBER,
                'p_utente_ins':home.baseUser.IDEN_PER
            };
            home.NS_MASTERIZZATORI.inserisciEventoMasterizzazione('RIMASTERIZZA',p,NS_MENU_MASTERIZZAZIONI.okMasterizza,NS_MENU_MASTERIZZAZIONI.koMasterizza);
        }

    },
    rimasterizzaScelta:function(rec){

        var container =$("<div>");
        var $priorita = RADIO.crea({'id':'radPriorita','elements':[{'val':1,'descr':traduzione.lblBassa},{'val':5,'descr':traduzione.lblNormale},{'val':10,'descr':traduzione.lblAlta}]},{'idxDefault':1});
        var priorita = $priorita.data("RadioBox");
        var $num_copie= $("<div>").addClass("numericInput").attr("id","numDischi")
            .append($("<i>").addClass("icon-minus"))
            .append($("<input>").attr("type","text").attr("value",1))
            .append($("<i>").addClass("icon-plus"));
        var num_copie = $num_copie.numericInput({"minVal":1});
        container.append($("<span>").text(traduzione.lblPriorita+":"));
        container.append($priorita);
        container.append($("<span>").text(traduzione.lblNCopie+":"));
        container.append($num_copie);
        container.append($("<span>").text(traduzione.lblRobot+":"));
        var $robo_list=$("<ul>").addClass("selectableList");
        container.append($robo_list);

        dwr.engine.setAsync(false);
        toolKitDB.getResultDatasource("SELECT.ROBOT_DISPONIBILI","MASTERIZZATORI",{"username":home.baseUser.USERNAME},null,function(response){
            $.each(response,function(k,v){
                $robo_list.append($("<li>").attr("data-id", v.VALUE).text(v.DESCR));
            });

        });
        dwr.engine.setAsync(true);

        var dial=$.dialog(container,{"showBtnClose":false,
            "width":400,
            "showMask":false,
            "showIconClose":true,
            "title":traduzione.lblOpzioniMasterizzazione,
            "buttons":[
                {"label":traduzione.butAnnulla,"action":function(ctx){dial.close();}}
            ]
        });
        $robo_list.on("click","li",function(){
            var m_row = new $.Map();
            for (var i=0; i<rec.length;i++)
            {
                    m_row.addData(rec[i].IDEN,'IDEN');
            }

            var p={
                'p_iden_robot':$(this).attr("data-id"),
                'p_priority':(priorita.val()==="")?5:priorita.val(),
                'p_copy_number':num_copie[0].getValue(),
                'p_utente_ins':home.baseUser.IDEN_PER,
                'p_tipo_inserimento':'M'
            };
            $.Map.each(m_row,function(k,v){
                p['p_iden'] = k;
                home.NS_MASTERIZZATORI.inserisciEventoMasterizzazione('RIMASTERIZZA',p,NS_MENU_MASTERIZZAZIONI.okMasterizza,NS_MENU_MASTERIZZAZIONI.koMasterizza);
            });

            dial.close();
        });


    },
    masterizzaScelta:function(rec,storico)
    {
        var container =$("<div>");
        var $priorita = RADIO.crea({'id':'radPriorita','elements':[{'val':1,'descr':traduzione.lblBassa},{'val':5,'descr':traduzione.lblNormale},{'val':10,'descr':traduzione.lblAlta}]},{'idxDefault':1});
        var priorita = $priorita.data("RadioBox");
        var $num_copie= $("<div>").addClass("numericInput").attr("id","numDischi")
            .append($("<i>").addClass("icon-minus"))
            .append($("<input>").attr("type","text").attr("value",1))
            .append($("<i>").addClass("icon-plus"));
        var num_copie = $num_copie.numericInput({"minVal":1});
        container.append($("<span>").text(traduzione.lblPriorita+":"));
        container.append($priorita);
        container.append($("<span>").text(traduzione.lblNCopie+":"));
        container.append($num_copie);
        container.append($("<span>").text(traduzione.lblRobot+":"));
        var $robo_list=$("<ul>").addClass("selectableList");
        container.append($robo_list);

        dwr.engine.setAsync(false);
        toolKitDB.getResultDatasource("SELECT.ROBOT_DISPONIBILI","MASTERIZZATORI",{"username":home.baseUser.USERNAME},null,function(response){
            $.each(response,function(k,v){
                $robo_list.append($("<li>").attr("data-id", v.VALUE).text(v.DESCR));
            });

        });
        dwr.engine.setAsync(true);

        var dial=$.dialog(container,{"showBtnClose":false,
            "width":400,
            "showMask":false,
            "showIconClose":true,
            "title":traduzione.lblOpzioniMasterizzazione,
            "buttons":[
                {"label":traduzione.butAnnulla,"action":function(ctx){dial.close();}}
            ]
        });
        $robo_list.on("click","li",function(){
            var m_row = new $.Map();
            for (var i=0; i<rec.length;i++)
            {
                if(storico){
                    m_row.addData(rec[i].IDEN_ANAGRAFICA,'STORICO_PAZIENTE');
                }
                else{
                    if(rec[i].IDEN_REFERTO != null)m_row.addData(rec[i].IDEN_REFERTO,'REFERTO');
                    else if(rec[i].IDEN_TESTATA != null)m_row.addData(rec[i].IDEN_TESTATA,'TESTATA');
                }

            }

            var p={
                'p_iden_robot':$(this).attr("data-id"),
                'p_priority':(priorita.val()==="")?5:priorita.val(),
                'p_copy_number':num_copie[0].getValue(),
                'p_utente_ins':home.baseUser.IDEN_PER,
                'p_tipo_inserimento':'M'
            };
            $.Map.each(m_row,function(k,v){
                p['p_iden'] = k;
                p['p_iden_type'] = v;
                home.NS_MASTERIZZATORI.inserisciEventoMasterizzazione('MASTERIZZA',p,NS_MENU_MASTERIZZAZIONI.okMasterizza,NS_MENU_MASTERIZZAZIONI.koMasterizza);
            });

            dial.close();
        });


    },
    annullaMast:function(rec){
        var p={
            'p_iden':rec[0].IDEN,
            'p_utente_ins':home.baseUser.IDEN_PER
        }
        home.NS_MASTERIZZATORI.inserisciEventoMasterizzazione('ANNULLA_MASTERIZZAZIONE',p,NS_MENU_MASTERIZZAZIONI.okMasterizza,NS_MENU_MASTERIZZAZIONI.koMasterizza);

    },
    consegna:function(rec){
        var p={
            'p_iden':rec[0].IDEN,
            'p_utente_ins':home.baseUser.IDEN_PER
        }
        home.NS_MASTERIZZATORI.inserisciEventoMasterizzazione('CONSEGNA_CD',p,NS_MENU_MASTERIZZAZIONI.okMasterizza,NS_MENU_MASTERIZZAZIONI.koMasterizza);
    },
    whereAnnullaMast:function(rec)
    {
        for (var i = 0; i < rec.length; i++)
        {
            if (rec[i].STATUS != 0)
            {
                return false;
            }
        }
        return true;
    },
    whereRimasterizza:function(rec){
        for (var i = 0; i < rec.length; i++)
        {
            if (rec[i].STATUS < 50)
            {
                return false;
            }
        }
        return true;
    },
    whereConsegna:function(rec)
    {
        if(rec.length==0)return false;
        for (var i = 0; i < rec.length; i++)
        {
            if (rec[i].STATUS != 50)
            {
                return false;
            }
        }
        return true;

    },
    whereMasterizza:function(rec)
    {
        if(rec.length==0)return false;
        for (var i = 0; i < rec.length; i++)
        {
            /*if (rec[i].ESAME_DETTAGLIO_STATO < 110)  //SOLO REFERTATI
            {
                return false;
            }  */
            if (rec[i].ESAME_DETTAGLIO_STATO <=30)  //ANKE ESEGUITI
            {
                return false;
            }
        }
        return true;

    },
    okMasterizza:function(msg){
        home.NOTIFICA.success({title:"Masterizzazione",message:"Evento Inserito Correttamente",timeout:8});
        NS_FENIX_WK.aggiornaWk();
    },
    koMasterizza:function(msg){
        home.NOTIFICA.error({title:"Masterizzazione",message:"Errore inserimento evento",timeout:8});
        console.error('koMasterizza: %s',msg);
        NS_FENIX_WK.aggiornaWk();
    }

}
/*TODO Separare per le varie wk dei doc Allegati*/
var NS_WORKLIST_DOCUMENTI_ALLEGATI={
    cancella:function(rec){
        var param = {
            pIden:rec[0].IDEN ,
            pUser:home.baseUser.IDEN_PER
        }

        toolKitDB.executeFunction('DELETE_DOCUMENTI_ALLEGATI',param,function(response){
            var status = response.p_result.split("$")[0];
            var msg = response.p_result.split("$")[1];
            if(status =="OK")
            {
                $.support.cors = true;
                $.ajax({
                    url: home.baseGlobal.PERCORSO_FILE_SERVER_DELETE_ALLEGATI,
                    data: {"URL_DOCUMENTO":rec[0].URL_DOCUMENTO},
                    dataType : "json",
                    type : "POST"
                }).done(function(r) {
                        if( r.status === "OK" )
                        {
                            home.NOTIFICA.success({
                                message: r.message,
                                title: "Success!"
                            });
                        }
                        else
                        {
                            home.NOTIFICA.error({
                                message: r.message,
                                title: "Errore"
                            });
                        }
                    });
                NS_IRD.wkDoc.refresh();
            }
            else
            {
                home.NOTIFICA.error({
                    message: msg,
                    title: "Errore"
                });
            }

        });




    },
    whereCancella:function(rec)
    {
        return (rec.length==1);
    }
};
/*var NS_WORKLIST_DOCUMENTI_ALLEGATI=
{
    cancella:function(rec){
        var param = {
            pIden:rec[0].IDEN ,
            pUser:home.baseUser.IDEN_PER
        }

        toolKitDB.executeFunction('DELETE_DOCUMENTI_ALLEGATI',param,function(response){
            var status = response.p_result.split("$")[0];
            var msg = response.p_result.split("$")[1];
            if(status =="OK")
            {
                $.support.cors = true;
                $.ajax({
                    url: home.baseGlobal.PERCORSO_FILE_SERVER_DELETE_ALLEGATI,
                    data: {"URL_DOCUMENTO":rec[0].URL_DOCUMENTO},
                    dataType : "json",
                    type : "POST"
                }).done(function(r) {
                    if( r.status === "OK" )
                    {
                        home.NOTIFICA.success({
                            message: r.message,
                            title: "Success!"
                        });
                    }
                    else
                    {
                        home.NOTIFICA.error({
                            message: r.message,
                            title: "Errore"
                        });
                    }
                });
                NS_IRD.wkDoc.refresh();
            }
            else
            {
                home.NOTIFICA.error({
                    message: msg,
                    title: "Errore"
                });
            }

        });




    },
    whereCancella:function(rec)
    {
        return (rec.length==1);
    }
}; */


var NS_WK_VALID_MULTIPLA =
{
    clickRow: function(rec,row)
    {
        $(row).selectedLine('NULLA', 'clsSel');
    },

    isSelected: false,

    selectAllRows: function(rec)
    {
        if(!this.isSelected){
            $('#divWk').find('.antiscroll-inner').find('tr').not('.clsSel').trigger('click');
            this.isSelected = true;
        }else{
            $('#divWk').find('.antiscroll-inner').find('tr.clsSel').trigger('click');
            this.isSelected = false;
        }
    },

    whereSelectAllRows: function(rec)
    {
        return true;
    },

    referta: function (rec)
    {
        FUNZIONI_WK_REFERTAZIONE.apriConsole(rec);
    },

    whereReferta: function (rec)
    {
        if(rec.length == 1){
            return LIB.ToF(home.basePermission.REFERTAZIONE.REFERTA);
        }
    },

    valida: function(rec)
    {
        //TODO: validazione
        //alert("TODO");
    },

    whereValida: function(rec)
    {
        return true;
    }
}


var NS_PAZIENTE_PRENOTAZIONE  =
{
    setIdenAnagrafica:function(rec)
    {
        var parameters =
        {
            'iden_anagrafica' :  rec[0]['IDEN']

        };
            toolKitDB.getResult('DATI.CONTROLLO_PRENOTAZIONE_PAZIENTE', parameters, '', function( response )
            {

                for( var i = 0; i < response.length; i++ )
                {
                    home.NOTIFICA.warning( { message :"Il paziente " + response[i].PAZIENTE + " presenta l'esame " + response[i].DESCRIZIONE + " prenotato per il " + response[i].DATA_ESAME + " alle ore" + response[i].ORA_ESAME, title : 'Prenotazioni Presenti!' ,timeout: 5} )

                }
                SE.UTILS.setIdenAnagrafica(rec[0].IDEN);SE.EVENTI.idenAnagrafica_onChange(rec);

            });
    }
}
