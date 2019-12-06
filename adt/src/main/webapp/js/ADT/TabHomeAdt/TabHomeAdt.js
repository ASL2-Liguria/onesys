/**
 * User: alessandro.arrighi, matteo.pipitone
 * Date: 11/07/13
 * Time: 11.22
 *
 * 20140522 - Gestione Chiamata Controller tramite POST
 * 20140620 - Rimozione Funzioni obsolete removeListaAttesa e controllaTrasferimento
 * 20150206 - Richiesta motivo cancellazione ricovero dimesso e check dati in cartella
 * 20150326 - Divisione File e Ottimizzazione WK
 */

jQuery(document).ready(function () {
    NS_HOME_ADT.init();
    NS_HOME_ADT.setEvents();

});

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

var NS_HOME_ADT = {

    tab : null,
    tab_sel : null,

    init : function () {

    	home.HOME_ADT = NS_HOME_ADT;

        if($("#TAB_SEL").val() != null && $("#TAB_SEL").val() != '' ){
            home.tabAttivo=  $("#TAB_SEL").val();
        }
        // calcolo l'altezza
        $("#divWk").css({'height':document.body.offsetHeight  - $("#filtri").height() - 15 });

        // Modifico Layout Button Mini Menu
        top.$('div#miniMenu a').css({"width":"auto","padding":"0 5px 0 20px","text-decoration":"none","color":"#FFF","line-height":"18px","margin-left":"10px","display":"inline-block"});
        top.$('a#linkClose').html('Torna Menu');
        top.$('a#linkCambiaLogin').html('Cambia Login');
        top.$('a#linkPrintMonitor').html('Stampa Videata');

        NS_FENIX_TAG_LIST.beforeApplica = NS_HOME_ADT.beforeApplicaAfterTag;
        NS_FENIX_WK.beforeApplica = NS_HOME_ADT_WK.beforeApplica;

        NS_HOME_ADT.tab_sel = "filtroPazienti";
        NS_HOME_ADT_WK.caricaWkPazienti();

        if(typeof home.tabAttivo != 'undefined'){
            //carica filtro
            $('#tabs-Worklist li#'+home.tabAttivo).trigger("click");
            //carica wk
            NS_HOME_ADT.tab_sel = $('#tabs-Worklist li#'+home.tabAttivo).attr('data-tab');
            NS_HOME_ADT_WK.caricaWk();
        };
        NS_HOME_ADT.initLogger();

    	$("#lblResetCampi").click(function () {
    		$("#txtCognome").val("");
    		$("#txtNome").val("");
    		$("#h-dateData").val("");
    		$("#dateData").val("");
    		$("#txtCodFisc").val("");
    	});

    },

    setEvents : function () {

        $('#tabs-Worklist').children().click(function(){
            NS_HOME_ADT.tab_sel = $(this).attr('data-tab');
            NS_HOME_ADT_WK.caricaWk();
        });

        // Allineo il comportamento del tasto invio su un filtro a quello del tasto applica
    	// Vedi NS_FENIX_WK.setInputEnterEvent e NS_FENIX_WK.setApplicaEvent
    	$("div#filtroPazienti input, div#filtroWkDimessi, div#filtroDimissioniSDO input").off("keypress").on("keypress", function (e)
		{
			if (e.keyCode == 13)
			{
				$("input", "div#filtroPazienti").each(function(){$(this).val($(this).val().toUpperCase());});

				if(!NS_FENIX_WK.beforeApplica())
				{
					NS_FENIX_WK.setApplicaEvent();
					return false;
				}
				NS_FENIX_FILTRI.applicaFiltri(NS_FENIX_WK.params);
			}
		});

    },

    riepiligoaccessidhHome : function(rec){
    	home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=RIEPILOGO_ACCESSI_DH&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA+'&IDEN_CONTATTO='+rec[0].IDEN_CONTATTO+'&STATO_PAGINA=R',fullscreen:true});
    },

    /**
     * Se Modifico Alcuni Filtri la pagina deve essere ricaricata al fine di ripopolare i filtri dipendenti.
     * Es. Se Modifico il regime devo ricaricare il filtro del tipo ricovero.
     */
    beforeApplicaAfterTag:function(idTag,params)
    {
        var refresh = idTag.match('REFRESH');
        //alert(idTag);
        if (refresh != null) {
            params.reload = true;
        }
        home.tabAttivo =  $('li.tabActive').attr("id");

        return params;
    },

    getUrlCartellaPaziente:function(codice_contatto){
    	//      var url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&ricovero='+codice_contatto;
    	// var url =   home.baseGlobal.URL_CARTELLA + '/autoLogin?utente='+home.baseUser.USERNAME+'&postazione='+home.basePC.IP+'&pagina=CARTELLAPAZIENTEADT&ricovero='+codice_contatto;
    	var url =   home.baseGlobal.URL_CARTELLA + '/autoLogin?utente=' + home.baseUser.USERNAME + '&postazione=' + home.AppStampa.GetCanonicalHostname().toUpperCase() + '&pagina=CARTELLAPAZIENTEADT&ricovero='+codice_contatto;

    	logger.debug("NS_HOME_ADT.getUrlCartellaPaziente - NOSOLOGICO -> " +  codice_contatto + ', URL -> ' + url);

    	url += home.baseUser.TIPO_PERSONALE === "M" ? "&funzione=apriDatiGenerali()" : "&funzione=apriAnamnesi()";
		url += "&ModalitaAccesso=REPARTO";
    	//url = NS_APPLICATIONS.switchTo('WHALE', url);
    	window.open(url, "_blank", "fullscreen=yes");
    },


    initLogger : function(){
        top.NS_CONSOLEJS.addLogger({name:'HOME_ADT',console:0});
        window.logger = top.NS_CONSOLEJS.loggers['HOME_ADT'];
    },

    apriConsensoPrivacy : function(params){

        var jsonAnagrafica = NS_ANAGRAFICA.Getter.getAnagraficaById(params.rec.IDEN_ANAGRAFICA);
        var paramsPic = {
            anagrafica : params.rec.IDEN_ANAGRAFICA,
            cognome : jsonAnagrafica.cognome,
            nome : jsonAnagrafica.nome,
            sesso : jsonAnagrafica.sesso,
            codice_fiscale : jsonAnagrafica.codiceFiscale,
            comuneNascita : jsonAnagrafica.comuneNascita,
            callback : NS_HOME_ADT_WK.caricaWk
        };

        paramsPic.tipoConsenso = params.origine=='ANAGRAFICA'?'INSERIMENTO_CONSENSO_UNICO':'INSERIMENTO_CONSENSO_EVENTO';

        if(params.origine == 'ANAGRAFICA'){
            paramsPic.action =  params.rec.PRIVACY_CONSENSO_UNICO == 'NP' ? 'INSERISCI' : 'VISUALIZZA';
        }else{
            paramsPic.action =  params.rec.PRIVACY_CONSENSO_EVENTO == 'NP' ? 'INSERISCI' : 'VISUALIZZA';
        }

        paramsPic.data_nascita = moment(jsonAnagrafica.dataNascita, 'YYYYMMDDHH:mm').format('YYYYMMDD') == 'undefined' ? '' : moment(jsonAnagrafica.dataNascita, 'YYYYMMDDHH:mm').format('YYYYMMDD');
        paramsPic.codice = params.origine=='ANAGRAFICA'?'': params.rec.IDEN_CONTATTO;
        home.NS_PRIVACY.openPick(paramsPic);
    },

    setStatoCartelle : function(rec,codiceStato,codiceStatoDa){

    	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
    	var aIdenContatti = new Array(rec.length);
    	var aIdenCdc = new Array(rec.length);

    	for (var i = 0; i < rec.length; i++)
    	{
    		aIdenContatti[i] = rec[i].IDEN_CONTATTO;
    		aIdenCdc[i] = rec[i].IDEN_CDC;
    	}

    	// set cartelle complete
		var parametri = {
				pStato:codiceStato,
				aIdenContatti:{v: aIdenContatti, t:'A'},
				pIdenPer:{v:home.baseUser.IDEN_PER,t:'N'},
				aArchivi:{v:aIdenCdc, t:'A'},
				pData:{v:moment().format('DD/MM/YYYY HH:mm'),t:'V'},
				p_result:{t:'V',d:'O'}
			};
		db.call_procedure(
				{
					id: 'ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle',
					parameter : parametri,
					success: function(data){
						home.NOTIFICA.success({message: 'Movimento cartelle eseguito correttamente', timeout: 2, title: 'Success'});
						NS_HOME_ADT_WK.wkDimissioniSDO.refresh();
						}
					});
    },

    setStatoCartelleCompleteInviate : function(rec)
    {
    	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
    	var aIdenContatti = new Array(rec.length);
    	var aIdenCdc = new Array(rec.length);

    	for (var i=0; i<rec.length; i++)
    	{
    		aIdenContatti[i] = rec[i].IDEN_CONTATTO;
    		aIdenCdc[i] = rec[i].IDEN_CDC;
    	}

    	// set cartelle complete
		var parametri = {
			pStato : '01',
			aIdenContatti : {v: aIdenContatti, t : 'A'},
			pIdenPer : {v : home.baseUser.IDEN_PER, t : 'N'},
			aArchivi : { v : aIdenCdc, t : 'A'},
			pData : {v : moment().format('DD/MM/YYYY HH:mm'), t : 'V'},
			p_result : { t : 'V', d : 'O'}
		};
		db.call_procedure(
		{
			id: 'ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle',
			parameter : parametri,
			success: function(data){
				// set cartelle inviate in archivio
				var parametri = {
					pStato : '02',
					aIdenContatti : {v: aIdenContatti, t : 'A'},
					pIdenPer : {v : home.baseUser.IDEN_PER,t : 'N'},
					aArchivi : {v : aIdenCdc, t : 'A'},
					pData : {v : moment().format('DD/MM/YYYY HH:mm'), t : 'V'},
					p_result : {t : 'V', d : 'O'}
				};

				db.call_procedure(
				{
					id: 'ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle',
					parameter : parametri,
					success : function(data){
						home.NOTIFICA.success({message: 'Movimento cartelle eseguito correttamente', timeout: 2, title: 'Success'});
						NS_HOME_ADT_WK.wkDimissioniSDO.refresh();
					}
				});
			}
		});

    },

    grantFromDateRange : function(p){
        var now = moment();
        var dataFine = moment(p.DATA_RIFERIMENTO, "YYYYMMDDHH:mm");

        return now.diff(dataFine, 'hours', true) < p.ORE;
    },

    testContattiAperti : function(rec){

        var _JSON_CONTATTO = null;
        var _JSON_ANAGRAFICA = NS_ANAGRAFICA.Getter.getAnagraficaById(rec[0].IDEN_ANAGRAFICA);
        var _PZ_SCONOSIUTO = _JSON_ANAGRAFICA.cognome === 'SCONOSCIUTO' ? "S" : "N";

        /*
        var _CHK_ANAGRAFICA = NS_ANAGRAFICA.Check.checkDatiFondamentali(_JSON_ANAGRAFICA, _PZ_SCONOSIUTO === 'S' ? true : false);

        if (_CHK_ANAGRAFICA.length > 0)
        {
        	// home.NOTIFICA.warning({message : "Anagrafica NON Completa! per continuare Occorre valorizzare i campi: " + _CHK_ANAGRAFICA, timeout: 6, title : "Inserimento Ricovero" });
        	logger.error("Inserimento Ricovero - Check Anagrafica - Anagrafica NON Completa - Campi da Valorizzare -> " + _CHK_ANAGRAFICA)

        	home.DIALOG.si_no({
        		title: "Inserimento Ricovero - Anagrafica Incompleta",
        		msg:"Anagrafica INCOMPLETA! Per continuare Occorre valorizzare i campi: " + _CHK_ANAGRAFICA + ". Proseguire con la modifica dell\'anagrafica?",
        		cbkNo:function(){ return; },
        		cbkSi: function(){ home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=' + _PZ_SCONOSIUTO + '&STATO_PAGINA=E&CHECK_PRE_RICOVERO=S&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA,id:'insAnag',fullscreen:true}); }
        	});

        	return;
        }
        */
        var param = {"idenAnag" : _JSON_ANAGRAFICA.id};
        dwr.engine.setAsync(false);

        // Verifia della presenza di contatti aperti
        // Se presenti e intenzionati i DH vengono CHIUSI!
        toolKitDB.getResultDatasource("ADT.Q_CONTATTI_APERTI","ADT",param,null,function(resp)
        {
            if (resp.length>0)
            {
                var dhAperto = false;
                var tableRic="<table border='2' style='width:450px' ><caption>Ricoveri aperti</caption><tr><th>Nosologico</th><th>Regime</th><th>Reparto</th><th>Data</th></tr><tr>";

                for (var i=0; i<resp.length; i++)
                {
                    tableRic += "<td>" + resp[i].NOSOLOGICO + "</td>";
                    tableRic += "<td>" + resp[i].REGIME + "</td>";
                    tableRic += "<td>" + resp[i].REPARTO + "</td>";
                    tableRic += "<td>" + resp[i].DATA_INIZIO + "</td>";

                    if (resp[i].REGIME == '2') {
                        dhAperto = true;
                    }
                }

                tableRic += "</table>";

                if (dhAperto) {
                    tableRic += "<p>Se si sceglie di proseguire, il ricovero DH verra' chiuso in data odierna</p>";
                }

                $.dialog(tableRic, {
                    buttons :
                    [
                        {
                        	label: "Annulla", action: function (ctx){ $.dialog.hide(); }
                        },
                        {
                        	label: "Prosegui", action: function (ctx){

	                            $.dialog.hide();

	                            // Chiusura Forzata DH
	                            for (i=0; i<resp.length; i++)
	                            {
	                                if (resp[i].REGIME=='2')
	                                {
	                                    _JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(resp[i].IDEN_CONTATTO);
	                                    _JSON_CONTATTO.uteDimissione.id = home.baseUser.IDEN_PER;
	                                    _JSON_CONTATTO.dataFine = moment().format('YYYYMMDD') + moment().format('HH:mm');
	                                    _JSON_CONTATTO.mapMetadatiString['CHIUSURA_FORZATA'] = 'S';
	                                    _JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id : null,codice : '7'};
	                                    _JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
	                                    _JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;

	                                    var pA03 = {"contatto" : _JSON_CONTATTO, "updateBefore" : true, "hl7Event" : "A03 Chiusura Forzata", "notifica" : {"show" : "S", "timeout" : 3, "message" : "Dimissione Forzata Ricovero DH Avvenuta con Successo", "errorMessage" : "Errore Durante la Dimissione Forzata Ricovero DH"}, "cbkSuccess" : function(){}};

	                                    pA03.cbkSuccess = function(){
	                                    	top.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=ACC_RICOVERO&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA + '&TIPO=WKPAZ' + '&IDEN_CONTATTO=0&STATO_PAGINA=I&CONTATTI_APERTI=S&CHIUSURA_FORZATA=S', id:'AccRicovero',fullscreen:true});
	                                    };

	                                	NS_CONTATTO_METHODS.dischargeVisit(pA03);
	                                }
	                            }

	                            home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=ACC_RICOVERO&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA + '&TIPO=WKPAZ' + '&IDEN_CONTATTO=0&STATO_PAGINA=I&CONTATTI_APERTI=S&CHIUSURA_FORZATA=S', id:'AccRicovero',fullscreen:true});

                        	}
                        }
                    ],
                    title : "Ricoveri sovrapposti",
                    height:200,
                    width:500
                });
            }
            else
            {
                home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=ACC_RICOVERO&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA +'&TIPO=WKPAZ'+'&IDEN_CONTATTO=0&CONTATTI_APERTI=N&STATO_PAGINA=I', id:'AccRicovero', fullscreen:true});
            }
        });
        dwr.engine.setAsync(true);

    },

    printRiepilogoPermessi : function(){
        var _par = {};
        _par.PRINT_DIRECTORY = 'RICERCA_RICOVERATI';
        _par.PRINT_REPORT = 'PAZIENTI_IN_PERMESSO';
        _par.PRINT_PROMPT = "&promptpUsername=" + home.baseUser.USERNAME;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    printAccessiDH:function(IDEN_CONTATTO){
    	var _par = {};
        _par.PRINT_DIRECTORY = 'DH';
        _par.PRINT_REPORT = 'RIEPILOGO_ACCESSI_DH';
        _par.PRINT_PROMPT = "&promptpIdenContatto=" + IDEN_CONTATTO;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    printRiepilogoPermessiPaziente : function(idenContatto){
    	var _par = {};
    	_par.PRINT_DIRECTORY = 'RICERCA_RICOVERATI';
    	_par.PRINT_REPORT = 'PERMESSI_SINGOLO_PZ';
    	_par.PRINT_PROMPT = "&promptpIdenContatto=" + idenContatto;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    printCertificatoRicovero : function(IDEN_CONTATTO){
        var _par = {};
        _par.PRINT_DIRECTORY = 'CERTIFICATI';
        _par.PRINT_REPORT = 'CERTIFICATORICOVERO';
        _par.PRINT_PROMPT = "&promptIDEN_CONTATTO=" + IDEN_CONTATTO;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    printCertificatoDimi : function(IDEN_CONTATTO,DIAGNOSI){
        var _par = {};
        _par.PRINT_DIRECTORY = 'CERTIFICATI';
        _par.PRINT_REPORT = 'CERTIFICATODIMISSIONE';
        _par.PRINT_PROMPT = "&promptIDEN_CONTATTO=" + IDEN_CONTATTO+ "&promptDIAGNOSI="+DIAGNOSI;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    printVerbaleRicovero : function(IDEN_CONTATTO){
        var _par = {};
        _par.PRINT_DIRECTORY = 'RICERCA_RICOVERATI';
        _par.PRINT_REPORT = 'VERBALERICOVERO';
        _par.PRINT_PROMPT = "&promptIDEN_CONTATTO=" + IDEN_CONTATTO;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    printCartelleInviateOggi : function(rec){
        var _par = {};
        _par.PRINT_DIRECTORY = 'ARCHIVIOCARTELLA';
        _par.PRINT_REPORT = 'STAMPA_INVIATI_ARCHIVIO';
        _par.PRINT_PROMPT = "&promptWEBUSER=" + home.baseUser.USERNAME;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    printCartelleInReparto : function(rec){
        var _par = {};
        _par.PRINT_DIRECTORY = 'ARCHIVIOCARTELLA';
        _par.PRINT_REPORT = 'STAMPA_PRESENTI_IN_REPARTO';
        _par.PRINT_PROMPT = "&promptWEBUSER=" + home.baseUser.USERNAME;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    printFrontespizio : function(IDEN_CONTATTO){
        var _par = {};
        _par.PRINT_DIRECTORY = 'RICERCA_RICOVERATI';
        _par.PRINT_REPORT = 'Frontespizio';
        _par.PRINT_PROMPT = "&promptIDEN_CONTATTO=" + IDEN_CONTATTO;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    printBraccialettoRicovero : function(IDEN_CONTATTO){
        var _par = {};
        _par.STAMPANTE = home.basePC.STAMPANTE_BRACCIALETTO;
        _par.CONFIG = '{"methods": [{"autoRotateandCenter":[true]},{"setPageSize":[8]},{"setCustomPageDimension":[25.4,279.0,4]},{"setPageMargins":[[0.1,0.1,0.1,0.1],4]}]}',
        _par.PRINT_DIRECTORY = 'RICERCA_RICOVERATI';
        _par.PRINT_REPORT = 'BRACCIALETTO_RICOVERO';
        _par.PRINT_PROMPT = "&promptpIdenContatto=" + IDEN_CONTATTO;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    /**
     * Wk Accessi Giuridici Dimessi.
     * Se il contatto e' stato dimesso forzatamente la colonna si colora di rosso.
     *
     * @param data
     * @param td
     */
    processStatoContatto : function(data, td)
    {
        var chiusuraForzata = data.CHIUSURA_FORZATA ;

        if (chiusuraForzata == 'S') {
            td.css({'background-color':'#FF0000'});
        }

        return destinazione;
    },

    /**
     * Wk Ricoverati.
     * Se accessi DH aperti per il contatto coloro di rosso la colonna N_ACCESSI.
     *
     * @param data
     * @param td
     */
    processAccessiAperti : function(data, td)
    {
        var accessiAperti = data.N_ACCESSI_APERTI ;

        if (accessiAperti > 0) {
            td.css({'background-color':'#FF0000'});
        }

        return data.N_ACCESSI_APERTI;
    },

    /**
     * Wk Accessi Giuridici, Assistenziale ed Entrambi.
     * Se il paziente � assente cambio lo sfondo della colonna STATO.
     *
     * @param data
     * @param td
     */
    processStatoPermesso : function(data, td){

        var chiusuraForzata = data.IS_ABSENT ;

        if (chiusuraForzata == 'S') {
            td.css({'background-color':'#FF8000'});
            td.attr("title","Assente");
        }

        return data.STATO;

    },

    processSetDestinazioneListaAttesa : function(data, td)
    {
        var destinazione = data.DESTINAZIONE ;

        if (destinazione == 'RICOVERO')
            td.css({'background-color':'#56BB27'});
        else if(destinazione == 'PRERICOVERO')
            td.css({'background-color':'#FFA600'});

        return destinazione;

    },

    processStatoSdo : function(data,td)
    {
        if (data.SDO_COMPLETA=='S')
        {
            td.css({'background-color':'#90EE90'});
        }
        return STATO_SDO;
    },

    processAnagraficaReadOnly : function(data,td)
    {
    	var readonly = data.READONLY;
    	if (readonly=='S'){
            td.css({'background-color':'#FF0000'});
        }
        return readonly;
    },

    processAnagraficaDataMorte : function(data,td){

    	var dataMorte = data.DATA_MORTE;

    	if (dataMorte!=null){
            td.css({'background-color':'#3e4045'});
            td.css({'color':'white'});
            data.NOME=data.NOME+" (Deceduto)";
        }
        return data.NOME;
    },

    processApriCartella : function(data, wk)
    {
    	var url = '';

    	if(data.CODICE != null)
    	{
    		url ="javascript:NS_HOME_ADT.getUrlCartellaPaziente('"+data.CODICE+"')";
    	}

    	return $(document.createElement('a')).attr('href', url).html("<i class='icon-folder-open icoPaz' title='Apri cartella paziente'>");
    },

    processDataSollecito : function(data, td){

    	if (data.DATA_SOLLECITO != null && data.DATA_SOLLECITO != "" && typeof data.DATA_SOLLECITO != 'undefined')
    	{
    		data.DATA_SOLLECITO = moment(data.DATA_SOLLECITO, "YYYYMMDDHH:mm").format("DD/MM/YYYY HH:mm");
    		td.attr("title", data.DATA_SOLLECITO);
    		td.css({"color" : "red"});
    	}

    	return data.DATA_SOLLECITO;
    },

    processDatiAssistito : function(data, td){

    	var $a = $(document.createElement('a'));
    	var accessiAperti = data.N_ACCESSI_APERTI ;

    	if (data.DATA_MORTE != null && data.DATA_MORTE != "")
    	{
    		td.css({"background-color" : "#3e4045", "color" : "white"});
    		$a.css({"color" : "white", "text-decoration" : "none"});
            data.ASSISTITO += " (Deceduto)";
        }
    	else if (accessiAperti > 0) {
            td.css({'background-color':'#FF0000'});
        }

    	$a.text(data.ASSISTITO);
        $a.on('click',function(){ home.NS_FENIX_TOP.apriPagina({'url':'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=E&IDEN_ANAG='+ data.IDEN_ANAGRAFICA,'id':'datiAnag','fullscreen':true});});

        return $a;
    },

    processDatiAnag : function (IDEN_ANAG, ASSISTITO) {

    	var $a = $(document.createElement('a')).text(ASSISTITO);

        $a.on('click',function(){ home.NS_FENIX_TOP.apriPagina({'url':'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=E&IDEN_ANAG='+ IDEN_ANAG,'id':'datiAnag','fullscreen':true});});

        return $a;
    },

    processClassPrivacyEvento:function(data, wk){

        if(home.baseGlobal.ATTIVA_PRIVACY == 'S')
        {
            switch (data.PRIVACY_CONSENSO_UNICO)
            {
                case 'NP':
                    switch(data.PRIVACY_CONSENSO_EVENTO){
                        case 'NP':
                            return  $(document.createElement("span")).addClass("EventoAssentePazienteAssente").attr({"title":"Consenso unico e consenso Evento NON presenti"});
                            break;
                        case 'S':
                            return  $(document.createElement("span")).addClass("EventoOKPazienteAssente").attr({"title":"Consenso unico non presente, l'evento risulta NON oscurato "});
                            break;
                        case 'N':
                            return  $(document.createElement("span")).addClass("EventoKOPazienteAssente").attr({"title":"Consenso unico non presente, l'evento risulta oscurato"});
                            break;
                    }
                    break;

                case 'S':
                    switch(data.PRIVACY_CONSENSO_EVENTO){
                        case 'NP':
                            return  $(document.createElement("span")).addClass("EventoAssentePazienteOK").attr({"title":"Il paziente acconsente alla gestione completa dai propri dati personali, l'evento risulta NON presente"});
                            break;
                        case 'S':
                            return  $(document.createElement("span")).addClass("EventoKOPazienteOK").attr({"title":"Il paziente acconsente alla gestione completa dai propri dati personali, l'evento risulta NON oscurato"});
                            break;
                        case 'N':
                            return  $(document.createElement("span")).addClass("EventoKOPazienteOK").attr({"title":"Il paziente acconsente alla gestione completa dai propri dati personali, l'evento risulta  oscurato"});
                            break;
                        }
                    break;

                case 'N':
                    switch(data.PRIVACY_CONSENSO_EVENTO){
                        case 'NP':
                            return  $(document.createElement("span")).addClass("EventoAssentePazienteKO").attr({"title":"Il paziente NON acconsente alla gestione completa dai propri dati personali, l'evento risulta NON presente"});;
                            break;
                        case 'S':
                            return  $(document.createElement("span")).addClass("EventoOKPazienteKO").attr({"title":"Il paziente NON acconsente alla gestione completa dai propri dati personali, l'evento risulta NON oscurato"});;
                            break;
                        case 'N':
                            return  $(document.createElement("span")).addClass("EventoKOPazienteKO").attr({"title":"Il paziente NON acconsente alla gestione completa dai propri dati personali, l'evento risulta oscurato"});;
                            break;
                    }
                    break;

                default :
                    return  $(document.createElement("span")).addClass("EventoKOPazienteOK");
                    break;

            }
        }
    },

    processClassPrivacyUnico : function(data, wk)
    {
        if(home.baseGlobal.ATTIVA_PRIVACY == 'S')
        {
            switch(data.PRIVACY_CONSENSO_UNICO)
            {
                case 'NP':
                    return  $(document.createElement("span")).addClass("consensoPazienteAssente").attr({"title":"Consenso Unico Non Presente"});
                    break;
                case 'S':
                    return  $(document.createElement("span")).addClass("consensoPazienteOK").attr({"title":"Il paziente acconsente alla gestione completa dai propri dati personali"});
                    break;
                case 'N':
                    return  $(document.createElement("span")).addClass("consensoPazienteKO").attr({"title":"Il paziente NON acconsente alla gestione completa dai propri dati personali"});
                    break;
                default :
                    return  $(document.createElement("span")).addClass("consensoPazienteAssente");
                    break;

            }
        }
    }

};

