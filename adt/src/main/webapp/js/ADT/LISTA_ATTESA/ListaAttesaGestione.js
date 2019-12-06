/**
 * User: alessandro.arrighi
 *
 * 20140417	- alessandro.arrighi	- Gestione Lista Attesa Interamente con Template
 * 20140508 - alessandro.arrighi	- Gestione Motivo Priorita in base al Livello
 * 20141106 - alessandro.arrighi	- Spacchettamento PCK Gestione Liste Attesa
 * 20141128 - matteo.pipitone       - Modificata la gestione del validator
 * 20150611 - alessandro.arrighi	- Adeguamento package LISTA_ATTESA_PAZIENTI tramite sinonimo FX$PCK_LISTA_ATTESA_PAZIENTI
 */

var _METDATI_TEMPLATE; 	// Variabile che indica i campi che corrispondono a metadati della lista
var _JSON_METADATI;		// variabile che contiene i metadati in modifica nel campo JSON_METADATI

var NS_LISTA_ATTESA = {

    idenInserito : null,

	init : function () {

    	home.NS_CONSOLEJS.addLogger({name:'NS_LISTA_ATTESA',console:0});
        window.logger = home.NS_CONSOLEJS.loggers['NS_LISTA_ATTESA'];

        NS_LISTA_ATTESA.definisciComportamento();
        //configurazione validator
        NS_LISTA_ATTESA.Events.obbligaMedicoProponente();
        NS_LISTA_ATTESA.Events.obbligaInterventoICD();
        NS_LISTA_ATTESA.Events.obbligaDiagnosiICD();
        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_LISTA_ATTESA_WRAPPER"});
    },

    Events: {

    	setEvents : function () {

    		if (_STATO_PAGINA === 'I')
    		{
	    		$("#txtDataPrenotazione").val(moment().format('DD/MM/YYYY'));
	            $("#txtOraPrenotazione").val(moment().format('HH:mm'));
	    		$('#IdInfoModifiche').hide();
	    		$(".butSalvaListaEPrericovero").on("click", function(){NS_FENIX_SCHEDA.registra({"prericovero" : true});});
	    	}
    		else
    		{
    			$(".butSalvaListaEPrericovero").hide();
    		}

            NS_LISTA_ATTESA.Events.customizeClosing();
    	},

    	obbligaInterventoICD : function(){
            if (typeof $('#txtInterventoICD').val() !== 'undefined') {
                V_LISTA_ATTESA_WRAPPER.elements.txtInterventoICD.status = 'required';
            }

        },

        obbligaDiagnosiICD : function(){
            if (typeof $('#txtDiagnosiICD').val() !== 'undefined') {
                V_LISTA_ATTESA_WRAPPER.elements.txtDiagnosiICD.status = 'required';
            }

        },

        obbligaMedicoProponente:function(){
           	if(home.baseUser.TIPO_PERSONALE == 'M'){
            	V_LISTA_ATTESA_WRAPPER.elements.txtMedicoProponente.status = 'required';
           	}

			if (_STATO_PAGINA == "I"){

				if(home.baseUser.TIPO_PERSONALE == 'M'){
					$("#acMedicoProponente").data('acList').returnSelected({DESCR:home.baseUser.DESCRIZIONE,VALUE:home.baseUser.IDEN_PER});
				}

			}
        },

    	/**
    	 * Funzione che in base all'urgenza selezionata PRECOMPILA la data di previsione adeguate.
    	 *
    	 * @author alessandro.arrighi
    	 */
    	setRangeDataPrevista : function(){

	    		var $urgenza = $('#cmbUrgenza_' + $('#h-cmbUrgenza').val()).attr('data-codice');
	    		var dataPrenotazione = moment($('#txtDataPrenotazione').val(),'DD/MM/YYYY');

	    		if (dataPrenotazione == '' || $urgenza == ''){
	    			return;
	    		}

	    		// Imposto la data di partenza Prevista in quanto non cambia MAI.
	    		// Quella che cambia in base all'urgenza è la Data Massima Prevista.
	    		var dataDaPrevisione = dataPrenotazione <  moment() ? moment() : dataPrenotazione;
	    		var dataAPrevisione = dataPrenotazione;

	    		switch ($urgenza)
	    		{
	    		case 'A' :
	    			dataAPrevisione.add('days',30);
	    			break;
	    		case 'B' :
	    			dataAPrevisione.add('days', 60);
	    			break;
	    		case 'C' :
	    			dataAPrevisione.add('days',180);
	    			break;
	    		case 'D' :
	    			dataAPrevisione.add('days',365);
	    			break;
	    		}

	    		$('#txtDaDataPrevisione').val(dataDaPrevisione.format('DD/MM/YYYY'));
	    		$('#h-txtDaDataPrevisione').val(dataDaPrevisione.format('YYYYMMDD'));

	    		$('#txtADataPrevisione').val(dataAPrevisione.format('DD/MM/YYYY'));
	    		$('#h-txtADataPrevisione').val(dataAPrevisione.format('YYYYMMDD'));

    	},

    	/**
    	 * Funzione che mostra il motivo dell'inserimento a seconda dell'urgenza.
    	 * Le prime due Urgenze rendono il motivo OBBLIGATORIO.
    	 *
    	 * @author alessandro.arrighi
    	 */
    	showMotivoFromPriorita : function(){

    		$('#cmbUrgenza .CBpuls').on('click', function(){

    			var codUrg = $(this).attr('data-codice');
    			var obj = $('#txtMotivoPriorita').closest('TD');
    			obj.find('#txtMotivoPriorita').toggleClass('tdObb');

    			if (codUrg == 'A' || codUrg == 'B') {
    				obj.show(); obj.prev().show(); obj.find('#txtMotivoPriorita').addClass('tdObb');
    				V_LISTA_ATTESA_WRAPPER.elements.txtMotivoPriorita.status = 'required';
    			} else {
    				obj.hide(); obj.prev().hide(); obj.find('#txtMotivoPriorita').removeClass('tdObb');
    				V_LISTA_ATTESA_WRAPPER.elements.txtMotivoPriorita.status = '';
    			}

    			NS_FENIX_SCHEDA.addFieldsValidator({config:"V_LISTA_ATTESA_WRAPPER"});

    		});

    		if (_STATO_PAGINA != 'I')
    		{
    			var codUrg = $('.CBpuls[data-value="' +  $('#h-cmbUrgenza').val() + '"]').attr('data-codice');
    			var obj = $('#txtMotivoPriorita').closest('TD');

    			if (codUrg == 'A' || codUrg == 'B')
    			{
    				obj.show(); obj.prev().show(); obj.find('#txtMotivoPriorita').addClass('tdObb');
    				V_LISTA_ATTESA_WRAPPER.elements.txtMotivoPriorita.status = 'required';
    			}
    			else
    			{
    				obj.hide(); obj.prev().hide(); obj.find('#txtMotivoPriorita').removeClass('tdObb');
    				V_LISTA_ATTESA_WRAPPER.elements.txtMotivoPriorita.status = '';
    			}

    			NS_FENIX_SCHEDA.addFieldsValidator({config:"V_LISTA_ATTESA_WRAPPER"});
    		}
    		else
    		{
    			var obj = $('#txtMotivoPriorita').closest('TD');
    			obj.hide(); obj.prev().hide();
    		}

    	},

    	/**
    	 * A Seconda dello stato della pagina definisco la funzione di chiusura.
    	 * In Inserimento devo chiurdere anche la parte relativa alla scelta della Lista
    	 *
    	 * @author alessandro.arrighi
    	 */
    	customizeClosing : function(){

    		if (_STATO_PAGINA == 'I')
    		{
    			NS_FENIX_SCHEDA.chiudi = parent.NS_FENIX_SCHEDA.chiudi;

	    		$('.butChiudi').on('click', function(){NS_FENIX_SCHEDA.chiudi({'refresh' : true});});
    		} else
    		{
	    		$('.butChiudi').on('click', function(){NS_FENIX_SCHEDA.chiudi({'refresh' : true});});
    		}
    	}
    },

    Style : {

    	setGenericStyle : function(){

    		if (_STATO_PAGINA == 'I')
    		{
    			$('#tabs-LISTA_ATTESA_WRAPPER').hide();
    			$('#txtNoteModifica').closest('TD').hide();
    			$('#txtNoteModifica').closest('TD').prev().hide();
    			NS_LISTA_ATTESA.Style.hidePadding();
				var h = window.parent.$("#iframeListaAttesa").height();

				$('#page').css({'height': h});
				$('.contentTabs').css({'height': h - 50});
				$('.acList .contentDiv').css({'height' : 375});
    		}

    		$(".butSalvaListaEPrericovero").text('Salva/Ins. Prericovero');

    	},

    	hidePadding : function(){
    		// AZZERO il PADDING per incastonare la pagina in un iframe senza avere il margine nero
    		$('#page').css({'padding': 0});
    	}
    },

    definisciComportamento : function(){

    	NS_LISTA_ATTESA.Style.setGenericStyle();
    	NS_LISTA_ATTESA.Setter.setIntestazione();
    	NS_LISTA_ATTESA.Events.showMotivoFromPriorita();

    	$('#cmbUrgenza .CBpuls').on('click', NS_LISTA_ATTESA.Events.setRangeDataPrevista);

    	logger.debug("Caricamento Pagina - NS_LISTA_ATTESA.definisiciComportamento - STATO_PAGINA -> " + _STATO_PAGINA);

    	if (_STATO_PAGINA == 'E')
    	{
    		NS_LISTA_ATTESA_MODIFICA.getValoriIniziali();
            NS_LISTA_ATTESA_MODIFICA.init();
            NS_FENIX_SCHEDA.registra = NS_LISTA_ATTESA_MODIFICA.Registra.registra;
        }
    	else if (_STATO_PAGINA == 'I')
    	{
            NS_LISTA_ATTESA.Events.setEvents();
            NS_LISTA_ATTESA.Setter.setButtonScheda();
            NS_FENIX_SCHEDA.registra = NS_LISTA_ATTESA.registra;
        }

    },

    registra : function(p){

    	if (typeof p === "undefined") {
    		p = {"prericovero" : false};
    	}

    	var listMetadatiKey = [];
    	var listMetadatiValue = [];

    	if (!NS_FENIX_SCHEDA.validateFields())
        {
        	return false;
        }

    	for (var i = 0; i < _METDATI_TEMPLATE.length; i++)
    	{
			if(_METDATI_TEMPLATE[i].TYPE == "AUTOCOMPLETE"){
				listMetadatiKey.push(_METDATI_TEMPLATE[i].KEY);
				listMetadatiValue.push("");
			}
			else{
				var _value = $('#' + _METDATI_TEMPLATE[i].KEY).val();
				listMetadatiKey.push(_METDATI_TEMPLATE[i].KEY);
				listMetadatiValue.push(_value == null ? "" : escape(_value));
			}

			if (_METDATI_TEMPLATE[i].HIDDEN_FIELD != "")
			{
				var _value_hidden = $('#' + _METDATI_TEMPLATE[i].HIDDEN_FIELD).val();
				listMetadatiKey.push(_METDATI_TEMPLATE[i].HIDDEN_FIELD);
				listMetadatiValue.push(_value_hidden == null ? "" : _value_hidden);
			}
    	}

    	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

        var parametriLista = {
        		P_IDEN_ANAGRAFICA : {v : $('#IDEN_ANAGRAFICA').val(), t : "N"},
        		P_DATA_PRENOTAZIONE : {v : moment($('#txtDataPrenotazione').val() + $('#txtOraPrenotazione').val() + ":00","DD/MM/YYYYHH:mm:ss").format("YYYYMMDD HH:mm:ss"), t : "T"},
        		P_URGENZA : {v : $('#h-cmbUrgenza').val() , t : "N"},
        		P_CDC : {v : $('#h-txtRepartoDegenza').val() , t : "N"},
        		P_ID_LISTA : {v : $('#ID_LISTA').val(), t : "N"},
        		P_NOTE : {v : $('#txtNote').val(), t : "V"},
        		P_KEY_METADATI : {v : listMetadatiKey, t : "A"},
        		P_VALUE_METADATI : {v : listMetadatiValue, t : "A"},
        		P_UTENTE_INSERIMENTO : {v : home.baseUser.IDEN_PER, t : "N"},
        		P_IDEN : {t : 'N', d : 'O'}
		};

        // Gestisco la valorizzazione del Medico Proponente (NON Obbligatoria)
        if ($("#h-txtMedicoProponente").val() !== "" && $("#h-txtMedicoProponente").val() != null){
        	parametriLista.P_MEDICO_PROPONENTE = {v : $("#h-txtMedicoProponente").val(), t : "N"};
    	}

        logger.debug("Inserimento PZ Lista Attesa - NS_LISTA_ATTESA.registra - parametriLista -> " + JSON.stringify(parametriLista));

		var xhr = db.call_procedure(
		{
			id: "FX$PCK_LISTA_ATTESA_PAZIENTI.INSERISCI",
			parameter : parametriLista
		});

		xhr.done(function (data, textStatus, jqXHR)
		{
			NS_LISTA_ATTESA.idenInserito = data['P_IDEN'];

			home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});

			if (p.prericovero) {
        		NS_LISTA_ATTESA.inserisciPrericovero();
        	} else  {
				NS_FENIX_SCHEDA.chiudi({'refresh' : true});
        	}

		});

		xhr.fail(function (response) {
			logger.error("Inserimento PZ Lista Attesa ERROR - NS_LISTA_ATTESA.registra - Inserimento PZ in ERRORE!");
			home.NOTIFICA.error({message: JSON.stringify(response), timeout: 5, title: "Error"});
			NS_FENIX_SCHEDA.chiudi({'refresh' : true});
		});

    },

    inserisciPrericovero : function(){

    	var _data_inizio = moment($('#txtDataPrenotazione').val(),"DD/MM/YYYY").format("YYYYMMDD") + $('#txtOraPrenotazione').val();
    	var _cdc = {"id" : null, "idCentroDiCosto" : $("#h-txtRepartoDegenza").val(), "codice" : null, "descrizione" : null};
    	var _json_contatto = NS_CONTATTO_METHODS.getContattoEmpty();

    	// Il regime di ricovero viene dall'attributo data-parametri della combo (TIPI.PARAMETRI)
    	// Il tipo ha in entrambi i casi codice 4 come nell'interfaccia specifica (Ricovero programmato con pre-ospedalizzazione)

    	_json_contatto.anagrafica.id = $('#IDEN_ANAGRAFICA').val();
        _json_contatto.urgenza = {codice :  $('#cmbUrgenza div.CBpulsSel').attr("data-codice"), id : null};
        _json_contatto.dataInizio = _data_inizio;
        _json_contatto.codice.assigningAuthorityArea = 'ADT';
        _json_contatto.stato = {id : null, codice : 'ADMITTED'};
        _json_contatto.tipo = {id : null, codice : $("#cmbRegimeRicovero option:selected").attr("data-parametri")};
        _json_contatto.regime = {id : null, codice : "3"};
        _json_contatto.uteAccettazione.id = home.baseUser.IDEN_PER;

        _json_contatto.contattiGiuridici[0].provenienza = _cdc;
        _json_contatto.contattiGiuridici[0].dataInizio = _data_inizio;
        _json_contatto.contattiGiuridici[0].regime = {id : null, codice : "3"};
        _json_contatto.contattiGiuridici[0].tipo = {id : null, codice : $("#cmbRegimeRicovero option:selected").attr("data-parametri")};
		_json_contatto.contattiGiuridici[0].stato = {id : null, codice : 'ADMITTED'};
        _json_contatto.contattiAssistenziali[0].uteInserimento.id = home.baseUser.IDEN_PER;

        _json_contatto.contattiAssistenziali[0].provenienza = _cdc;
        _json_contatto.contattiAssistenziali[0].dataInizio = _data_inizio;
        _json_contatto.contattiAssistenziali[0].stato = {id : null, codice : 'ADMITTED'};
        _json_contatto.contattiAssistenziali[0].uteInserimento.id = home.baseUser.IDEN_PER;

        var p = {"contatto" : _json_contatto, "hl7Event" : "A05", "notifica" : {"show" : "S", "message" : "Inserimento Pre-ricovero Avvenuto Correttamente", "errorMessage" : "Errore Durante Inserimento Pre-ricovero", "timeout" : 3}, "cbkSuccess" : function(){_json_contatto = NS_CONTATTO_METHODS.contatto; NS_LISTA_ATTESA.modificaPosizioneLista(_json_contatto);}};

		NS_CONTATTO_METHODS.preAdmitVisitNotification(p);

    },

    modificaPosizioneLista : function(_json_contatto){

    	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

        var parametri = {
        		P_IDEN : {v : NS_LISTA_ATTESA.idenInserito, t : "N"},
        		P_STATO : {v : _json_contatto.regime.codice === "3" ? "ESITO_PRERICOVERO" : "ESITO_RICOVERO", t : "V"},
        		P_IDEN_CONTATTO : {v : _json_contatto.id, t : "N"},
        		P_UTENTE_MODIFICA : {v : home.baseUser.IDEN_PER, t : "N"}
		};

        logger.debug("Esito PZ Lista Attesa - NS_LISTA_ATTESA.modificaPosizioneLista - parametri: " + JSON.stringify(parametri));

		var xhr = db.call_procedure(
		{
			id: "FX$PCK_LISTA_ATTESA_PAZIENTI.MODIFICA",
			parameter : parametri
		});

		xhr.done(function (data, textStatus, jqXHR)
		{
			NS_LISTA_ATTESA.apriCartellaPrericovero({"codice" : _json_contatto.codice.codice, "callback" : function(){ setTimeout(function(){ NS_FENIX_SCHEDA.chiudi({'refresh' : true}); }, 2000); }});
		});

		xhr.fail(function (response) {
			logger.error("Esito PZ Lista Attesa ERROR XHR - NS_LISTA_ATTESA.modificaPosizioneLista - Error: " + JSON.stringify(response));
			home.NOTIFICA.error({message: "Errore durante impostazione esito paziente da Lista di Attesa", timeout: 0, title: "Error"});
		});

    },

	apriCartellaPrericovero : function(p) {

		// var url ='servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&ricovero=' +  p.codice + '&funzione=apriVuota()';
		// url = NS_APPLICATIONS.switchTo('WHALE', url);

		url = home.baseGlobal.URL_CARTELLA + "/autoLogin?utente=" + home.baseUser.USERNAME;
		url += "&postazione=" + home.AppStampa.GetCanonicalHostname().toUpperCase();
		url += "&pagina=CARTELLAPAZIENTEADT";
		url += "&ricovero=" + p.codice;
		url += "&funzione=apriVuota()";

		logger.debug("Apertura Cartella Prericovero - NS_LISTA_ATTESA.apriCartellaPrericovero - url -> " + url);

		// L'opener deve essere home in quanto dopo l'apertura della cartella la agina di inserimento viene chiusa
		// e su whale serve il riferimento a opener
		home.window.open(url, "_blank", "fullscreen=yes");

		if (typeof p.callback !== "undefined") {
			p.callback();
		}

    },

    Setter : {

    	setIntestazione : function() {

			$('#lblTitolo').html($('#COGNOME').val() + ' - ' + $('#NOME').val() + ' - ' + $('#DATA_NASCITA').val() + ' - ' + $('#CODICE_FISCALE').val() + ' - ET&Agrave; ' + $('#ETA').val());

			// Button in alto a sinistra per il print degli errori della pagina
			$("#butPrintVideata").remove();
			$("#lblTitolo").css({"width":"80%","display":"inline"});
			$("#lblTitolo").parent().append($("<button></button>").attr("id","butPrintVideata").attr("class","btn").html(traduzione.butPrintVideata).css({"float":"right"}).on("mousedown",function(){window.print();}));
		},

    	setButtonScheda : function(){

    		var list = $('#BUTTONS').val().split(',');

    		$(".footerTabs > div.buttons button.btn").hide();

    		for (var i = 0; i < list.length; i++)
    		{
    			$("." + list[i]).show();
    		}

    	}
    }
};

var NS_LISTA_ATTESA_MODIFICA = {

    valoriIniziali : {
    	metadati : {},
    	lista : null,
    	urgenza : null,
    	note : null,
    	noteModifica : null,
    	dataOraPrenotazione : null
    },

    /**
     * Funzione che al caricamento della pagina si occupa di recuperare i dati iniziali per effettuarne il controllo alla registrazione e valutare cosa è cambiato.
     * Prima della registrazione se qualcosa è cambiato viene richiesto un motivo per la modifica.
     *
     * @author alessandro.arrighi
     */

    getValoriIniziali : function(){

    	NS_LISTA_ATTESA_MODIFICA.valoriIniziali.metadati = JSON.parse($('#JSON_METADATI').val());
        NS_LISTA_ATTESA_MODIFICA.valoriIniziali.lista = $('#ID_LISTA').val();
        NS_LISTA_ATTESA_MODIFICA.valoriIniziali.note = $('#txtNote').val();
        NS_LISTA_ATTESA_MODIFICA.valoriIniziali.noteModifica = $('#txtNoteModifica').val();
        NS_LISTA_ATTESA_MODIFICA.valoriIniziali.urgenza = $('#h-cmbUrgenza').val();
        NS_LISTA_ATTESA_MODIFICA.valoriIniziali.dataOraPrenotazione = $('#txtDataPrenotazione').val() + $('#txtOraPrenotazione').val();

        logger.debug("Apertura PZ Lista Attesa - NS_LISTA_ATTESA_MODIFICA.getValoriIniziali - " + "NS_LISTA_ATTESA_MODIFICA.valoriIniziali.metadati -> " + JSON.stringify(NS_LISTA_ATTESA_MODIFICA.valoriIniziali.metadati) +
        		", NS_LISTA_ATTESA_MODIFICA.valoriIniziali.lista -> " + NS_LISTA_ATTESA_MODIFICA.valoriIniziali.lista +
        		", NS_LISTA_ATTESA_MODIFICA.valoriIniziali.note -> " + NS_LISTA_ATTESA_MODIFICA.valoriIniziali.note +
        		", NS_LISTA_ATTESA_MODIFICA.valoriIniziali.noteModifica -> " + NS_LISTA_ATTESA_MODIFICA.valoriIniziali.noteModifica +
        		", NS_LISTA_ATTESA_MODIFICA.valoriIniziali.urgenza -> " + NS_LISTA_ATTESA_MODIFICA.valoriIniziali.urgenza +
        		", NS_LISTA_ATTESA_MODIFICA.valoriIniziali.dataOraPrenotazione -> " + NS_LISTA_ATTESA_MODIFICA.valoriIniziali.dataOraPrenotazione);
    },

    init:function(){

        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_LISTA_ATTESA_WRAPPER"});
        NS_LISTA_ATTESA_MODIFICA.Events.caricaDati();
        NS_LISTA_ATTESA.Events.customizeClosing();
        NS_LISTA_ATTESA.Events.setEvents();
    },

    Events : {

    	/**
    	 * Se modifico delle Informazioni della lista di attesa devo inserire un motivo.
    	 * Prima della registrazione verifico che siano stati modificati dei campi.
    	 * Se modificati blocco la registrazione e rendo obbligatorio il campo.
    	 *
    	 * @author alessandro.arrighi
    	 */

    	obbligaNoteModifica : function(){
			V_LISTA_ATTESA_WRAPPER.elements.txtNoteModifica.status = 'required';
			NS_FENIX_SCHEDA.addFieldsValidator({config:"V_LISTA_ATTESA_WRAPPER"});
    	},

    	caricaDati : function(){

    		function getObjectMetadato(collection, key)
    		{
    			for (var y = 0; y < collection.length; y++)
    			{
    				if (collection[y].KEY == key)
    				{
    					return collection[y];
    				}
    			}
    		}

    		_JSON_METADATI = JSON.parse($('#JSON_METADATI').val());

    		logger.debug("Apertura PZ Lista Attesa - NS_LISTA_ATTESA_MODIFICA.caricaDati - _JSON_METADATI -> " + JSON.stringify(_JSON_METADATI));
    		logger.debug("Apertura PZ Lista Attesa - NS_LISTA_ATTESA_MODIFICA.caricaDati - _METDATI_TEMPLATE -> " + JSON.stringify(_METDATI_TEMPLATE));

    		// Ciclo Tutti I Metadati Salvati
    		for (var i = 0; i < _JSON_METADATI.length; i++)
    		{
    			// Valorizzo Un Oggetto Per Il Metadato Salvato (_JSON_METADATI[i]) e Per la sua Configurazione (_METDATI_TEMPLATE[idx])
    			var _objMetadato = _JSON_METADATI[i];
    			var _objConfMetadato = getObjectMetadato(_METDATI_TEMPLATE, _objMetadato.KEY);
    			// alert(JSON.stringify(_objConfMetadato ) + "\n key -> " + _objMetadato.KEY)

    			// Processo I Metadati Salvati Eccetto i Campi Nascosti che vengono Processati come HIDDEN FIELD dei campi visibili
    			if (typeof _objConfMetadato != 'undefined')
    			{
    				logger.debug("Apertura PZ Lista Attesa - NS_LISTA_ATTESA_MODIFICA.caricaDati - Processa METADATO " + JSON.stringify(_objConfMetadato));

					switch (_objConfMetadato.TYPE)
					{
						case 'DATE' :
							// Valorizzo Un oggetto relativo al Campo NASCOSTO salvato in METADATI
							var _objHiddenField = getObjectMetadato(_JSON_METADATI, _objConfMetadato.HIDDEN_FIELD);
							$('#' + _objConfMetadato.HIDDEN_FIELD).val(_objHiddenField.VALUE);
							$('#' + _objMetadato.KEY).val(_objMetadato.VALUE);
							break;

						case 'RADIO' :
							// Valorizzo Un oggetto relativo al Campo NASCOSTO salvato in METADATI
							var _objHiddenField = getObjectMetadato(_JSON_METADATI, _objConfMetadato.HIDDEN_FIELD);
							$('#' + _objConfMetadato.HIDDEN_FIELD).val(_objHiddenField.VALUE);
							$('#' + _objMetadato.KEY + ' [data-value="'+ _objHiddenField.VALUE +'"]').addClass('RBpulsSel');
							break;

						case 'CHECK' :
							// Valorizzo Un oggetto relativo al Campo NASCOSTO salvato in METADATI
							var _objHiddenField = getObjectMetadato(_JSON_METADATI, _objConfMetadato.HIDDEN_FIELD);
							$('#' + _objConfMetadato.HIDDEN_FIELD).val(_objHiddenField.VALUE);
							// Gestione Selezione Multipla Checkbox
							// I CHK sono prodotti da un unica select per cui il valore dei selezionati viene salvato nello stesso campo nascosto
							// Per cui occorre splittare per "," il valore del campo nascosto e valorizzare i rispettivi Chek
							for (var y = 0; y < _objHiddenField.VALUE.split(',').length; y++){
								$('#' + _objMetadato.KEY + ' [data-value="'+ _objHiddenField.VALUE.split(',')[y] +'"]').addClass('CBpulsSel');
							}
							break;

						case 'AUTOCOMPLETE' :
							var _objHiddenField = getObjectMetadato(_JSON_METADATI, _objConfMetadato.HIDDEN_FIELD);
							// alert('OBJ : \n' + JSON.stringify(_objMetadato)+' \n FIELD : \n' + JSON.stringify(_objHiddenField) + '\n CONF: \n' + JSON.stringify(_objConfMetadato));
							$('#' + _objMetadato.KEY).closest("TD").prev().find("div.acList").data('acList').returnSelected({VALUE : _objHiddenField.VALUE, DESCR : jsonData[""+_objMetadato.KEY+""]});
							break;

						default :
							// alert(_objMetadato.KEY + '\n' + _objMetadato.VALUE);
							$('#' + _objMetadato.KEY).val(_objMetadato.VALUE);
					}
    			}
    		}
    	}
    },

    Registra : {

    	preSalvataggio : function(){

            // Controllo se Sono Camiati dei Valori
            var arCampiModificati = new Array();

            function getObjectMetadato(collection, key)
    		{
    			for (var y = 0; y < collection.length; y++)
    			{
    				if (collection[y].KEY == key)
    				{
    					return collection[y];
    				}
    			}

    			// Se arrivo qui significa che il metadato non era tra quelli salvati.
				// Non lo analizzo per la modifica
				return false;
    		}

            // I campi seguenti necessitano un controllo a parte in quanto non sono metadati
            // Controllo Modifica URGENZA
        	if ($('#h-cmbUrgenza').val() != NS_LISTA_ATTESA_MODIFICA.valoriIniziali.urgenza){
        		arCampiModificati.push('Priorita\'');
        	}

        	// Controllo Modifica NOTE
        	if ($('#txtNote').val() != NS_LISTA_ATTESA_MODIFICA.valoriIniziali.note){
        		arCampiModificati.push('Note');
        	}

        	// Controllo Modifica ID LISTA
        	if ($('#ID_LISTA').val() != NS_LISTA_ATTESA_MODIFICA.valoriIniziali.lista){
        		arCampiModificati.push('Id Lista');
        	}

        	// Controllo Modifica DATA e ORA PRENOTAZIONE
        	if (($('#txtDataPrenotazione').val() + $('#txtOraPrenotazione').val()) != NS_LISTA_ATTESA_MODIFICA.valoriIniziali.dataOraPrenotazione){
        		arCampiModificati.push('Data e Ora Prenotazione');
        	}

            for (var i = 0; i < _METDATI_TEMPLATE.length; i++)
        	{
            	// Per Ogni Metadato Cerco Il corrispondente tra i valori Iniziali.
            	var _value_aggiornato = $('#' + _METDATI_TEMPLATE[i].KEY).val();
            	var _value_iniziale = getObjectMetadato(NS_LISTA_ATTESA_MODIFICA.valoriIniziali.metadati, _METDATI_TEMPLATE[i].KEY);

            	// Se metadato false significa che non era tra quelli precedentemente salvati.
            	// Pertanto continuo il processo di controllo escludendo.
            	if (!_value_iniziale){
            		continue;
            	}

            	// Se Il campo in questione detiene il valore in un campo nascosto il valore di riferimento e di confronto con quello iniziale e' quello nascosto
            	if (_METDATI_TEMPLATE[i].HIDDEN_FIELD !== '' && _METDATI_TEMPLATE[i].HIDDEN_FIELD !== null){
            		_value_aggiornato = $('#' + _METDATI_TEMPLATE[i].HIDDEN_FIELD).val();
            		_value_iniziale = getObjectMetadato(NS_LISTA_ATTESA_MODIFICA.valoriIniziali.metadati, _METDATI_TEMPLATE[i].HIDDEN_FIELD);
            	}

        		// alert(_METDATI_TEMPLATE[i].KEY  + '@' + _METDATI_TEMPLATE[i].HIDDEN_FIELD + '\naggiornato: ' + _value_aggiornato + '\niniziale: ' + _value_iniziale.VALUE + '\nuguaglianza: ');
        		if (_value_aggiornato != _value_iniziale.VALUE){
        			arCampiModificati.push(_METDATI_TEMPLATE[i].LABEL);
        		}
        	}

            // Se Sono Stati Modificati dei campi Controllo che sia stato modificato anche la sezione di Info Modifiche
            if (arCampiModificati.length > 0)
            {
            	if ($('#txtNoteModifica').val() == NS_LISTA_ATTESA_MODIFICA.valoriIniziali.noteModifica)
            	{
            		home.NOTIFICA.error({message: 'Inserire Informazione per Modifica di: ' + arCampiModificati, timeout: 5, title: "Error"});
            		NS_LISTA_ATTESA_MODIFICA.Events.obbligaNoteModifica();
            		return false;
            	}
            	return true;
            }

            return true;
        },

        registra : function(p) {

        	if (typeof p == "undefined") {
        		p = {"prericovero" : false};
        	}

            if (!NS_LISTA_ATTESA_MODIFICA.Registra.preSalvataggio()) {
                return;
            }

            var listMetadatiKey = [];
        	var listMetadatiValue = [];

            if (NS_FENIX_SCHEDA.validateFields())
            {
            	for (var i = 0; i < _METDATI_TEMPLATE.length; i++)
            	{

					if(_METDATI_TEMPLATE[i].TYPE == "AUTOCOMPLETE"){

						listMetadatiKey.push(_METDATI_TEMPLATE[i].KEY);
						listMetadatiValue.push("");
					}
					else{
						var _value = $('#' + _METDATI_TEMPLATE[i].KEY).val();
						listMetadatiKey.push(_METDATI_TEMPLATE[i].KEY);
						listMetadatiValue.push(_value == null ? "" : _value);
					}


            		if (_METDATI_TEMPLATE[i].HIDDEN_FIELD !== "")
            		{
            			var _value_hidden = $('#' + _METDATI_TEMPLATE[i].HIDDEN_FIELD).val();
            			listMetadatiKey.push(_METDATI_TEMPLATE[i].HIDDEN_FIELD);
                		listMetadatiValue.push(_value_hidden == null ? "" : _value_hidden);
            		}
            	}

            	// alert("VAL: " + JSON.stringify(listMetadatiValue) + '\n LBL: ' + JSON.stringify(listMetadatiKey));

                var parametriLista = {
                		P_IDEN : {v : $('#IDEN_LISTA').val(), t : 'N'},
                		P_IDEN_ANAGRAFICA : {v : $('#IDEN_ANAGRAFICA').val(), t : 'N'},
                		P_DATA_PRENOTAZIONE : {v : moment($('#txtDataPrenotazione').val() + $('#txtOraPrenotazione').val() + ":00","DD/MM/YYYY HH:mm:ss").format("YYYYMMDD HH:mm:ss") , t : 'T'},
                		P_STATO : {v : $('#STATO').val(), t : 'N'},
                		P_URGENZA : {v : $('#h-cmbUrgenza').val() , t : 'N'},
                		P_CDC : {v : $('#h-txtRepartoDegenza').val() , t : 'N'},
                		P_NOTE : {v : $('#txtNote').val(), t : 'V'},
                		P_NOTE_MODIFICA : {v : $('#txtNoteModifica').val(), t : 'V'},
                		P_LISTA : {v : $('#ID_LISTA').val(), t : 'N'},
                		P_KEY_METADATI : {v : listMetadatiKey, t : 'A'},
                		P_VALUE_METADATI : {v : listMetadatiValue, t : 'A'},
                		P_UTENTE_MODIFICA : {v : home.baseUser.IDEN_PER, t : 'N'}
    			};

                if ($('#IDEN_CONTATTO').val() != '' && $('#IDEN_CONTATTO').val() != null)
                {
                	parametriLista.P_IDEN_CONTATTO = {P_IDEN_CONTATTO : {v : $('#IDEN_CONTATTO').val(), t : 'N'}};
                }

                logger.debug("Modifica PZ Lista Attesa - NS_LISTA_ATTESA_MODIFICA.Registra.registra - parametri -> " + JSON.stringify(parametriLista));

                var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

                var xhr =  db.call_procedure(
    			{
    				id: 'FX$PCK_LISTA_ATTESA_PAZIENTI.MODIFICA',
    				parameter : parametriLista
    			});


                xhr.done(function (data, textStatus, jqXHR) {
                	home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});
                });

                xhr.fail(function (response) {
                	home.NOTIFICA.error({message: JSON.stringify(response), timeout: 5, title: "Error"});
                	logger.ERROR("Modifica PZ Lista Attesa - NS_LISTA_ATTESA_MODIFICA.Registra.registra - parametri -> " + JSON.stringify(parametriLista) + " - Error -> " + JSON.stringify(response));
                });


            }

        }

    },

    Utils : {

        disableField : function(id){
            $('#'+id).attr("disabled","disabled");
        }
    }
};

var NS_LISTA_ATTESA_ATTIVITA = {

    init : function(){

    	NS_LISTA_ATTESA_ATTIVITA.Registra.overrideRegistra();
		NS_LISTA_ATTESA_ATTIVITA.Events.initWkAttivita();
		NS_LISTA_ATTESA.Events.customizeClosing();
        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_LISTA_ATTESA_ATTIVITA"});

		$("#acUteAttivita").data('acList').returnSelected({DESCR:home.baseUser.DESCRIZIONE,VALUE:home.baseUser.IDEN_PER});
    },

    Events : {

        setEvents : function(){
            NS_LISTA_ATTESA_ATTIVITA.Utils.setTime('txtOraAttivita');
        },

		initWkAttivita : function() {
            var iden_lista_attesa = document.getElementById("IDEN_LISTA").value;

            var params = {
            	container : "divWkAttivita",
            	id : 'WK_LISTA_ATTESA_ATTIVITA',
                aBind : ['IDEN_LISTA_ATTESA'],
                aVal : [iden_lista_attesa]
            };

			$("div#divWkAttivita").height("200px");
			NS_LISTA_ATTESA_ATTIVITA.wkAttivita = new WK(params);
			NS_LISTA_ATTESA_ATTIVITA.wkAttivita.loadWk();
        }
    },

    Registra : {

        overrideRegistra : function() {
			NS_FENIX_SCHEDA.registra = NS_LISTA_ATTESA_ATTIVITA.Registra.registra;
        },

        registra : function(){

        	if (NS_FENIX_SCHEDA.validateFields())
            {
        		var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

           		var parameters =
                {
                    'P_IDEN_LISTA' : {t: 'N', v: $('#IDEN_LISTA').val(), d:'I'} ,
                    'P_DATA_ATTIVITA' : {t: 'V', v: $('#h-txtDataAttivita').val() +  $('#txtOraAttivita').val(), d:'I'},
                    'P_TIPO_ATTIVITA' : {t: 'N', v: $('#cmbAttivita option:selected').val(), d:'I'},
                    'P_UTENTE_INSERIMENTO' : {t: 'N', v: $('#h-txtUteAttivita').val(), d:'I'},
                    'P_NOTE' : {t: 'V', v: $('#txtNoteAttivita').val(), d:'I'},
    				'P_IDEN_ATTIVITA' : {t:'N',d:'O'}
                };

                var xhr =  db.call_procedure(
                {
                    id: 'FX$PCK_LISTA_ATTESA_PAZIENTI.INSERISCI_ATTIVITA',
                    parameter : parameters
                });

                xhr.done(function (data, textStatus, jqXHR) {

                    home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});
                    NS_LISTA_ATTESA_ATTIVITA.Events.initWkAttivita();

                });

                xhr.fail(function (response) {
                	home.NOTIFICA.error({message: "Attenzione Errore durante Inserimento Attivit&agrave;", timeout : 6, title: "Error"});
                	logger.error("Error Inserimento Attivita - NS_LISTA_ATTESA_ATTIVITA.registra - LISTA_ATTESA_PAZIENTI.INSERISCI_ATTIVITA -> : " +response);
                });

	        }
        }
    },

    Utils : {

        setTime : function(id){
            var now = new Date();
            var our = '0'+now.getHours(); our = our.substr(our.length-2,2);
            var min = '0'+now.getMinutes(); min = min.substr(min.length-2,2);

            $('#' + id).val(our + ':' + min);
        }
    }
};

var NS_LISTA_ATTESA_RIEPILOGO =
{
    init : function(){
        NS_LISTA_ATTESA_RIEPILOGO.initWkRIepiologo();
    },

    initWkRIepiologo : function(){
        var iden_lista_attesa = document.getElementById("IDEN_LISTA").value;

        var params = {
            container : "divWkRiepilogo",
            id : 'WK_LISTA_ATTESA_RIEPILOGO',
            aBind : ['IDEN_LISTA'],
            aVal : [iden_lista_attesa]
        };

        $("div#divWkRiepilogo").height("200px");
        NS_LISTA_ATTESA_RIEPILOGO.wkRiepilogo = new WK(params);
        NS_LISTA_ATTESA_RIEPILOGO.wkRiepilogo.loadWk();
    }

};