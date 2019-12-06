/**
 * Javascript in uso dalla pagina DIARI.
 * @author  gianlucab
 * @version 1.1
 * @since   2014-11-18
 */
var WindowCartella = null;
var baseReparti    = null;
var baseGlobal     = null;
var basePC         = null;
var baseUser       = null;
var config         = null;

$(document).ready(function() {
	try {
		NS_DIARIO_GENERICO.init();
		NS_DIARIO_GENERICO.setEvents();
	} catch(e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
	}
});

var NS_DIARIO_GENERICO = {};
(function() {
	/* Attributi privati */
	var _this = this;
	
	var arrayIden       = [];
	var arrayCdc        = [];
	var data_ini_rico   = "";
	var tipoDiario      = "";
	
	var arrIdPulsanti   = new Array();
	var configPulsanti  = {};
	var sqlFiltri       = {};
	
	hideFiltriRicerca();
	
	/**
	 * Inizializza il namespace.
	 */
	this.init = function(){
	    // Gestione dell'apertura della pagina da finestra modale o dal menu
	    if (typeof window.dialogArguments === 'object') {
	    	window.WindowCartella = window.dialogArguments.top.window;
	    } else {
	        window.WindowCartella = window;
	        while((window.WindowCartella.name != 'schedaRicovero' || window.WindowCartella.name != 'Home') && window.WindowCartella.parent != window.WindowCartella){
	            window.WindowCartella = window.WindowCartella.parent;
	        }
	    }
		
		window.baseReparti = WindowCartella.baseReparti;
		window.baseGlobal = WindowCartella.baseGlobal;
		window.basePC = WindowCartella.basePC;
		window.baseUser = WindowCartella.baseUser;
		
		$('#txtDaData').parent().parent().hide(); //FIXME
		
		// Progetto M.E.T.al
		window.idenSchedaMET = Number($("form[name=EXTERN] input[name=IDEN_SCHEDA_MET]").val()) || 0;
		
		var reparto = typeof WindowCartella.getAccesso === 'function' ?
			WindowCartella.getAccesso("COD_CDC") : // reparto del paziente selezionato
			""; // considerare i reparti attualmente filtrati come per la Ricerca Ricoverati
		
		// Carica le configurazioni per i controlli sulla modifica dei diari nella variabile globale 'config'
		eval(window.baseReparti.getValue(reparto,'DIARI_CONTROLLI_JS'));
		for (var key in config.tipi) {
			var alias = config.tipi[key].alias;
			if (typeof alias === 'string' && typeof config.tipi[alias] === 'object') {
				config.tipi[key] = config.tipi[alias];
			}
		}
		
		// Carica le configurazioni per i valori associati ai pulsanti nella variabile 'configPulsanti'
		eval('configPulsanti='+window.baseReparti.getValue(reparto,'DIARI.valori'));

		// Tabulatore sul footer (opzionale)
		WindowCartella.CartellaPaziente.footerPagina({wnd: window, bFooter: true, config: $('form[name=EXTERN] input[name=KEY_TABULATORE]').val()});
		
		// Aggiunge nuovi campi e attributi
		$('#txtTestoRicerca').css({width:"80%"}).parent().append($('<input/>', {type:"checkbox", id:"chkTestoRicerca", name:"chkTestoRicerca"})).append($('<label/>', {"for":"chkTestoRicerca"}).text('Cerca solo nel testo'));
		$("#chkTestoRicerca").attr("checked","checked");
		
		// Seleziona il diario in base all'utente loggato
		selezionaDiario();

		// Se siamo nella cartella di un paziente, imposta la data di inizio ricovero come limite superiore di filtro
		if (typeof WindowCartella.getForm === 'function') {
			var vDati = WindowCartella.getForm(document);
			// imposto data inizio ricovero e iden_visita per la visualizzazione dei diari
			switch (WindowCartella.FiltroCartella.getLivelloValue(vDati)) {
				case "IDEN_ANAG":
				case "ANAG_REPARTO":    data_ini_rico = WindowCartella.getPaziente("DATA");	break;
				case "NUM_NOSOLOGICO":  data_ini_rico = WindowCartella.getRicovero("DATA_INIZIO"); break;
				case "IDEN_VISITA":	    data_ini_rico = WindowCartella.getAccesso("DATA_INIZIO"); break;
			};
			
			switch (WindowCartella.FiltroCartella.getLivelloValue(vDati)) {
			case "IDEN_VISITA":
				if (typeof vDati.iden_visita === 'string' && vDati.iden_visita != "") arrayIden.push(vDati.iden_visita);
				break;
			case "NUM_NOSOLOGICO":			
				if (typeof vDati.iden_ricovero === 'string' && vDati.iden_ricovero != "") arrayIden.push(vDati.iden_ricovero);
				if (typeof vDati.iden_prericovero === 'string' && vDati.iden_prericovero != "") arrayIden.push(vDati.iden_prericovero);
				break;
			case "PS_RICOVERO":
				if (typeof vDati.iden_ricovero === 'string' && vDati.iden_ricovero != "") arrayIden.push(vDati.iden_ricovero);
				if (typeof vDati.iden_prericovero === 'string' && vDati.iden_prericovero != ""){
					arrayIden.push(vDati.iden_prericovero);
					if(WindowCartella.getRicovero("IDEN_PS")!=''){
						arrayIden.push(WindowCartella.getRicovero("IDEN_PS"));
					}	
				}
				break;
			}

			$("#txtDaData").val(clsDate.str2str(data_ini_rico,'YYYYMMDD','DD/MM/YYYY'));
			// imposto il numero nosologico per filtro
			/*$("#hNumNosologico").val(vDati.ricovero);*/
		}
		
		if (arrayIden.length == 0) {
			var reparto = $("form[name=EXTERN] input[name=REPARTO]").val();
			if (typeof reparto === 'string') {
				arrayCdc = new Array(reparto); //arrayCdc = reparto.split("|");
			}
		}
		
		// di default utilizza l'ultimo ordinamento selezionato
		sqlFiltri['_WK_ORDINA_CAMPO_DIARI'] = "";
		sqlFiltri['_WK_ORDINA_CAMPO_EPICRISI'] = "";
		
		_this.applicaFiltro();
		
		try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){};
	};
	
	/**
	 * Inizializza gli eventi.
	 */
	this.setEvents = function() {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.getElementById('txtDaData'));
		oDateMask.attach(document.getElementById('txtAData'));
		
		$("#txtDaData, #txtAData, #txtTestoRicerca").keypress(function(e) {
			if (e.keyCode == 13) {
				_this.applicaFiltro();
			}
		});
    	if(_STATO_PAGINA == 'I'){
    		var Ubicazione = WindowCartella.CartellaPaziente.getAccesso("Ubicazione");

        	if(Ubicazione == null){
        		Ubicazione.LETTO = '';
        	}

        	if(Ubicazione.LETTO){
        		$('#hLetto').val(Ubicazione.LETTO);
        	}
    	}
		setDatepicker();
	};
	
	/**
	 * Esegue la ricerca applicando i filtri selezionati.
	 */
	this.applicaFiltro = function() {
		// controllo campi
		// data inizio non può essere minore della data di inizio ricovero
		var daData = $('#txtDaData').val();
		if (daData != "") {
			var dFiltro = clsDate.str2date(daData,'DD/MM/YYYY'); // trasformo in date
			var dIni = clsDate.str2date(data_ini_rico,'YYYYMMDD'); // trasformo in date
			if (dFiltro < dIni) {
				alert('La data di inizio periodo non può essere anteriore alla data di inizio ricovero');
				// la data viene rimessa a inizio ricovero nel reparto attuale
				$("#txtDaData").val(clsDate.str2str(data_ini_rico, 'YYYYMMDD', 'DD/MM/YYYY'));
				return;
			}
		}
		else {
			alert('La data di inizio periodo non può essere vuota');
			// la data viene rimessa a inizio ricovero nel reparto attuale
			$('#txtDaData').val(clsDate.str2str(data_ini_rico,'YYYYMMDD','DD/MM/YYYY'));
			return;
		}
		
		// data fine non può essere minore di data inizio
		var aData = $('#txtAData').val();
		if (aData != '') {
			var dFiltro = clsDate.str2date(aData,'DD/MM/YYYY'); // trasformo in date
			var dIni = clsDate.str2date(daData,'DD/MM/YYYY'); // trasformo in date
			if (dFiltro < dIni) {
				alert('La data di fine periodo non può essere anteriore alla data di inizio');
				// la data viene impostata alla data attuale
				$("#txtAData").val(clsDate.getData(new Date(), 'DD/MM/YYYY'));
				return;
			}
		}
		
		// testo ricerca non può essere lungo meno di 4 caratteri
		var text = $("#txtTestoRicerca").val();
		if (typeof text !== 'string') {
			text = "";
		} else if (text != "") {
			if (text.length < 4) {
				return alert('Il testo di ricerca è troppo breve. Inserire almeno 4 caratteri.');
			}
		}
		
		// rimuove la punteggiatura
		text = text.replace(/[!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/g, "?");
		text = text.replace(/^[\%\?]+|[\%\?]+$/, "")+"%";
		
		// con i parametri appena controllati, calcolo il filtro where
		var WHERE_WK = getFiltroWhereWk(clsDate.str2str($('#txtDaData').val(), 'DD/MM/YYYY', 'YYYYMMDD'), clsDate.str2str($('#txtAData').val(), 'DD/MM/YYYY', 'YYYYMMDD'), arrayIden, text, arrayCdc);
		sqlFiltri['WHERE_WK_DIARI'] = WHERE_WK.generale;
		sqlFiltri['WHERE_WK_EPICRISI'] = WHERE_WK.epicrisi;
		
		aggiorna();
	};
	
	/**
	 * Reimposta il form.
	 */
	this.resettaCampi = function() {
		$("#txtDaData").val(clsDate.str2str(data_ini_rico, 'YYYYMMDD', 'DD/MM/YYYY'));
		$("#txtAData").val('');
		
		// illumino i pulsanti selezionati di default
		$('UL[id="elenco_metodiche"] LI')
			.removeClass("pulsanteLISelezionato")
			.filter(function(){return $.inArray($(this).attr("id").replace(/^[^_]*_/,""), arrIdPulsanti) !== -1;})
			.addClass("pulsanteLISelezionato");
	};
	
	/**
	 * Gestisce l'evento del click sui pulsanti dei diari.
	 * @param value, il valore selezionato
	 */
	this.btnClickDiario = function(value) {
		var id = "metodica_"+value;

		var obj = document.getElementById(id);

		//se seleziono TUTTI gli altri diari devono essere deselezionati; TUTTI non è deselezionabile da se stesso 
		if (id=='metodica_btnTuttiDiari'){
			if (!hasClass(obj,"pulsanteLISelezionato")){
				addClass(obj,"pulsanteLISelezionato");
			}	

			$('UL[id="elenco_metodiche"] LI').each(function(){
				if ($(this).attr('id')!='metodica_btnTuttiDiari'){
					$(this).removeClass('pulsanteLISelezionato');
				}
			});
		}
		else{
			if (!hasClass(obj,"pulsanteLISelezionato")){
				addClass(obj,"pulsanteLISelezionato");
				$('#metodica_btnTuttiDiari').removeClass('pulsanteLISelezionato');
			}else{
				removeClass(obj,"pulsanteLISelezionato");				
			}
		}
	};
	
	/**
	 * Restituisce due array contenenti i tipi di diari associati ai pulsanti passati come parametro
	 * @param id
	 * @returns {Array}
	 */
	this.getFiltroPulsante = function(id/*, id */) {
		var arrValue = new Array();
		arrValue[0] = [];
		arrValue[1] = [];
		for (var i=0; i<arguments.length;i++) {
			var id = arguments[i];
			if (configPulsanti[id] != undefined) {
				if (configPulsanti[id]["generale"] != undefined) {
					$.merge(arrValue[0], configPulsanti[id].generale);
				}
				if (configPulsanti[id]["epicrisi"] != undefined) {
					$.merge(arrValue[1], configPulsanti[id].epicrisi);
				}
			}
		}
		return arrValue;
	};
	
	/**
	 * Determina se mostrare il frame dell'epicrisi a seconda del pulsante selezionato
	 * @returns boolean
	 */
	this.isEpicrisiConfigurata = function() {
		return $('ul.pulsanteULCenter > li.pulsanteLISelezionato, ul.pulsanteULCenter > li#metodica_btnTuttiDiari.pulsanteLISelezionato').filter(function(){
			var showEpicrisi = false;
			try {
				var id = $(this).attr('id').replace('metodica_', '');
				switch(id) {
					case 'btnTuttiDiari':
						showEpicrisi = true;
						break;
					default:
						var diarioSelezionato = configPulsanti[id].generale[0];
						showEpicrisi = (config.tipi[diarioSelezionato].epicrisi == 'S');
				}
			} catch(e) {}
			return showEpicrisi;
		}).length > 0;
	};
	
	/**
	 * Determina se è stato selezionato il diario medico nei filtri
	 * @returns boolean
	 */
	this.isDiarioMedicoSelezionato = function() {
		return $('ul.pulsanteULCenter > li.pulsanteLISelezionato, ul.pulsanteULCenter > li#metodica_btnTuttiDiari.pulsanteLISelezionato').filter(function(){
			var id = $(this).attr('id').replace('metodica_', '');
			switch(id) {
				case 'btnDiarioMed': case 'btnTuttiDiari':
					return true;
				default:
					return false;
			}
		}).length > 0;
	};
	
	this.loadWkDiari = function() {
		loadWkDiari();
	};
	
	this.loadWkEpicrisi = function() {
		loadWkEpicrisi();
	};
	
    this.setManualOrder = function(key, value) {
		sqlFiltri[key] = value;
    };
    
    this.apriSchedaMET = function() {
    	var readonly = String($('form[name=EXTERN] input[name=CONTEXT_MENU]').val()) == 'LETTURA'; 
    	WindowCartella.apriScheda('SCHEDA_MET', 'Scheda M.E.T.al', {
    		key_legame:'SCHEDA_MET',
    		LETTURA: readonly ? 'S' : 'N',
    	    MODIFICA: readonly ? 'N' : 'S',
    		IDEN_SCHEDA: idenSchedaMET,
    		KEY_TABULATORE:'SCHEDA_MET.tabulatore'
    	}, {
    		RefreshFunction: WindowCartella.progettoMetal,
    		InfoRegistrazione: false
    	});
    };
    
	this.apriWorklistMET = function() {
		WindowCartella.progettoMetal();
	};
    
    this.apriSchedaCCOR = function() {
    	var readonly = String($('form[name=EXTERN] input[name=CONTEXT_MENU]').val()) == 'LETTURA';
    	WindowCartella.apriScheda('SCHEDA_OUTREACH', 'Scheda Outreach', {
    		key_legame: 'SCHEDA_OUTREACH',
    		LETTURA: readonly ? 'S' : 'N',
    	    MODIFICA: readonly ? 'N' : 'S',
    		IDEN_SCHEDA_MET: idenSchedaMET,
			KEY_TABULATORE: 'SCHEDA_OUTREACH.tabulatore' 
    	}, {
    		RefreshFunction: WindowCartella.progettoMetal
    	});
    };
	
	/* Medoti privati */
	
	function selezionaDiario() {
		arrIdPulsanti = [];
		var title = '';
		
		tipoDiario = $("form[name=EXTERN] input[name=KEY_TIPO_DIARIO]").val() || '';
		title = $("form[name=EXTERN] input[name=NOME_DIARIO]").val() || '';
		
		// Configurazioni del diario in base ad un tipo utente specifico
		var diarioScelto = tipoDiario || baseUser.TIPO;
		switch(diarioScelto) {
			case 'M': diarioScelto = 'MEDICO';
			case 'MEDICO':
				if (title == '') { title = "DIARIO MEDICO"; };
				if (typeof config.tipi[diarioScelto] === 'undefined') config.tipi[diarioScelto] = {};
				config.tipi[diarioScelto]['epicrisi'] = typeof config.tipi[diarioScelto]['epicrisi'] === 'undefined' ? 'S' : config.tipi[diarioScelto].epicrisi;
				config.tipi[diarioScelto]['filtri']   = typeof config.tipi[diarioScelto]['filtri']   === 'undefined' ? 'N' : config.tipi[diarioScelto].filtri;
				config.tipi[diarioScelto]['worklist'] = typeof config.tipi[diarioScelto]['worklist'] === 'undefined' ? 'DIARIO_MEDICO' : config.tipi[diarioScelto].worklist;
				config.tipi[diarioScelto]['context']  = typeof config.tipi[diarioScelto]['context']  === 'undefined' ? 'WK_DM_DATA_LETTURA' : config.tipi[diarioScelto].context;
				config.tipi[diarioScelto]['contextEpicrisi']  = typeof config.tipi[diarioScelto]['contextEpicrisi']  === 'undefined' ? 'WK_EPICRISI_LETTURA' : config.tipi[diarioScelto].contextEpicrisi;
				config.tipi[diarioScelto]['pulsanti'] = typeof config.tipi[diarioScelto]['pulsanti'] === 'undefined' ? ['btnDiarioMed'] : config.tipi[diarioScelto].pulsanti;
				
				//  Impedisco la modifica ad altri utenti
				if ($('form[name=EXTERN] input[name=CONTEXT_MENU]').val() != 'LETTURA' && baseUser.TIPO == 'M') {
					config.tipi[diarioScelto].context = "";
					config.tipi[diarioScelto].contextEpicrisi = "";
				}
				break;
			case 'I': diarioScelto = 'INFERMIERE';
			case 'INFERMIERE':
				if (title == '') { title = "DIARIO INFERMIERISTICO"; }
				if (typeof config.tipi[diarioScelto] === 'undefined') config.tipi[diarioScelto] = {};
				config.tipi[diarioScelto]['epicrisi'] = typeof config.tipi[diarioScelto]['epicrisi'] === 'undefined' ? 'N' : config.tipi[diarioScelto].epicrisi;
				config.tipi[diarioScelto]['filtri']   = typeof config.tipi[diarioScelto]['filtri']   === 'undefined' ? 'N' : config.tipi[diarioScelto].filtri;
				config.tipi[diarioScelto]['worklist'] = typeof config.tipi[diarioScelto]['worklist'] === 'undefined' ? 'DIARIO_INFERMIERISTICO' : config.tipi[diarioScelto].worklist;
				config.tipi[diarioScelto]['context']  = typeof config.tipi[diarioScelto]['context']  === 'undefined' ? 'WK_DM_DATA_LETTURA' : config.tipi[diarioScelto].context;
				config.tipi[diarioScelto]['contextEpicrisi']  = typeof config.tipi[diarioScelto]['contextEpicrisi']  === 'undefined' ? 'WK_EPICRISI_LETTURA' : config.tipi[diarioScelto].contextEpicrisi;
				config.tipi[diarioScelto]['pulsanti'] = typeof config.tipi[diarioScelto]['pulsanti'] === 'undefined' ? ['btnDiarioInf'] : config.tipi[diarioScelto].pulsanti;
				
				//  Impedisco la modifica ad altri utenti
				if ($('form[name=EXTERN] input[name=CONTEXT_MENU]').val() != 'LETTURA' && baseUser.TIPO == 'I') {
					config.tipi[diarioScelto].context = "";
					config.tipi[diarioScelto].contextEpicrisi = "";
				}
				break;
			case 'RIABILITATIVO':
				if (typeof config.tipi[diarioScelto] === 'undefined') config.tipi[diarioScelto] = {};
				config.tipi[diarioScelto]['epicrisi'] = typeof config.tipi[diarioScelto]['epicrisi'] === 'undefined' ? 'N' : config.tipi[diarioScelto].epicrisi;
				config.tipi[diarioScelto]['filtri']   = typeof config.tipi[diarioScelto]['filtri']   === 'undefined' ? 'S' : config.tipi[diarioScelto].filtri;
				config.tipi[diarioScelto]['worklist'] = typeof config.tipi[diarioScelto]['worklist'] === 'undefined' ? 'WK_DIARI' : config.tipi[diarioScelto].worklist;
				config.tipi[diarioScelto]['context']  = typeof config.tipi[diarioScelto]['context']  === 'undefined' ? 'WK_DIARI_LETTURA' : config.tipi[diarioScelto].context;
				config.tipi[diarioScelto]['contextEpicrisi']  = typeof config.tipi[diarioScelto]['contextEpicrisi']  === 'undefined' ? 'WK_EPICRISI_LETTURA' : config.tipi[diarioScelto].contextEpicrisi;
				config.tipi[diarioScelto]['pulsanti'] = typeof config.tipi[diarioScelto]['pulsanti'] === 'undefined' ? ['btnDiarioFis','btnDiarioRob','btnDiarioLog'] : config.tipi[diarioScelto].pulsanti;
				
				//  Impedisco la modifica ad altri utenti
				if ($('form[name=EXTERN] input[name=CONTEXT_MENU]').val() != 'LETTURA' && 'F,L'.indexOf(baseUser.TIPO) > -1) {
					config.tipi[diarioScelto].context = "";
					config.tipi[diarioScelto].contextEpicrisi = "";
				}
				break;
			case "F": diarioScelto = 'RIABILITATIVO';
			case "FISIOTERAPISTA":
				if (typeof config.tipi[diarioScelto] === 'undefined') config.tipi[diarioScelto] = {};
				config.tipi[diarioScelto]['epicrisi'] = typeof config.tipi[diarioScelto]['epicrisi'] === 'undefined' ? 'N' : config.tipi[diarioScelto].epicrisi;
				config.tipi[diarioScelto]['filtri']   = typeof config.tipi[diarioScelto]['filtri']   === 'undefined' ? 'S' : config.tipi[diarioScelto].filtri;
				config.tipi[diarioScelto]['worklist'] = typeof config.tipi[diarioScelto]['worklist'] === 'undefined' ? 'WK_DIARI' : config.tipi[diarioScelto].worklist;
				config.tipi[diarioScelto]['context']  = typeof config.tipi[diarioScelto]['context']  === 'undefined' ? 'WK_DIARI_LETTURA' : config.tipi[diarioScelto].context;
				config.tipi[diarioScelto]['contextEpicrisi']  = typeof config.tipi[diarioScelto]['contextEpicrisi']  === 'undefined' ? 'WK_EPICRISI_LETTURA' : config.tipi[diarioScelto].contextEpicrisi;
				config.tipi[diarioScelto]['pulsanti'] = typeof config.tipi[diarioScelto]['pulsanti'] === 'undefined' ? ['btnDiarioFis'] : config.tipi[diarioScelto].pulsanti;
				
				//  Impedisco la modifica ad altri utenti
				if ($('form[name=EXTERN] input[name=CONTEXT_MENU]').val() != 'LETTURA' && baseUser.TIPO == 'F') {
					config.tipi[diarioScelto].context = "";
					config.tipi[diarioScelto].contextEpicrisi = "";
				}
				break;
			case "ROBOTICA": 
				diarioScelto = 'RIABILITATIVO';
				if (title == '') { title = "DIARIO ROBOTICA"; }
				if (typeof config.tipi[diarioScelto] === 'undefined') config.tipi[diarioScelto] = {};
				config.tipi[diarioScelto]['epicrisi'] = typeof config.tipi[diarioScelto]['epicrisi'] === 'undefined' ? 'N' : config.tipi[diarioScelto].epicrisi;
				config.tipi[diarioScelto]['filtri']   = typeof config.tipi[diarioScelto]['filtri']   === 'undefined' ? 'S' : config.tipi[diarioScelto].filtri;
				config.tipi[diarioScelto]['worklist'] = typeof config.tipi[diarioScelto]['worklist'] === 'undefined' ? 'WK_DIARI' : config.tipi[diarioScelto].worklist;
				config.tipi[diarioScelto]['context']  = typeof config.tipi[diarioScelto]['context']  === 'undefined' ? 'WK_DIARI_LETTURA' : config.tipi[diarioScelto].context;
				config.tipi[diarioScelto]['contextEpicrisi']  = typeof config.tipi[diarioScelto]['contextEpicrisi']  === 'undefined' ? 'WK_EPICRISI_LETTURA' : config.tipi[diarioScelto].contextEpicrisi;
				config.tipi[diarioScelto]['pulsanti'] = typeof config.tipi[diarioScelto]['pulsanti'] === 'undefined' ? ['btnDiarioRob'] : config.tipi[diarioScelto].pulsanti;
				
				//  Impedisco la modifica ad altri utenti
				if ($('form[name=EXTERN] input[name=CONTEXT_MENU]').val() != 'LETTURA' && $.inArray("ROBOTICA", parent.baseUser.ATTRIBUTI) > -1) {
					config.tipi[diarioScelto].context = "";
					config.tipi[diarioScelto].contextEpicrisi = "";
				}
				break;
			case "L": diarioScelto = 'RIABILITATIVO';
			case "LOGOPEDISTA":
				if (title == '') { title = "DIARIO LOGOPEDISTA"; }
				if (typeof config.tipi[diarioScelto] === 'undefined') config.tipi[diarioScelto] = {};
				config.tipi[diarioScelto]['epicrisi'] = typeof config.tipi[diarioScelto]['epicrisi'] === 'undefined' ? 'N' : config.tipi[diarioScelto].epicrisi;
				config.tipi[diarioScelto]['filtri']   = typeof config.tipi[diarioScelto]['filtri']   === 'undefined' ? 'S' : config.tipi[diarioScelto].filtri;
				config.tipi[diarioScelto]['worklist'] = typeof config.tipi[diarioScelto]['worklist'] === 'undefined' ? 'WK_DIARI' : config.tipi[diarioScelto].worklist;
				config.tipi[diarioScelto]['context']  = typeof config.tipi[diarioScelto]['context']  === 'undefined' ? 'WK_DIARI_LETTURA' : config.tipi[diarioScelto].context;
				config.tipi[diarioScelto]['contextEpicrisi']  = typeof config.tipi[diarioScelto]['contextEpicrisi']  === 'undefined' ? 'WK_EPICRISI_LETTURA' : config.tipi[diarioScelto].contextEpicrisi;
				config.tipi[diarioScelto]['pulsanti'] = typeof config.tipi[diarioScelto]['pulsanti'] === 'undefined' ? ['btnDiarioLog'] : config.tipi[diarioScelto].pulsanti;
				
				//  Impedisco la modifica ad altri utenti
				if ($('form[name=EXTERN] input[name=CONTEXT_MENU]').val() != 'LETTURA' && baseUser.TIPO == 'L') {
					config.tipi[diarioScelto].context = "";
					config.tipi[diarioScelto].contextEpicrisi = "";
				}
				break;
			case 'D': diarioScelto = 'DIETISTA';
			case 'DIETISTA':
				if (title == '') { title = "Ricerca Diari Dietista"; }
				if (typeof config.tipi[diarioScelto] === 'undefined') config.tipi[diarioScelto] = {};
				config.tipi[diarioScelto]['epicrisi'] = typeof config.tipi[diarioScelto]['epicrisi'] === 'undefined' ? 'N' : config.tipi[diarioScelto].epicrisi;
				config.tipi[diarioScelto]['filtri']   = typeof config.tipi[diarioScelto]['filtri']   === 'undefined' ? 'N' : config.tipi[diarioScelto].filtri;
				config.tipi[diarioScelto]['worklist'] = typeof config.tipi[diarioScelto]['worklist'] === 'undefined' ? 'WK_DIARI' : config.tipi[diarioScelto].worklist;
				config.tipi[diarioScelto]['context']  = typeof config.tipi[diarioScelto]['context']  === 'undefined' ? 'WK_DIARI_LETTURA' : config.tipi[diarioScelto].context;
				config.tipi[diarioScelto]['contextEpicrisi']  = typeof config.tipi[diarioScelto]['contextEpicrisi']  === 'undefined' ? 'WK_EPICRISI_LETTURA' : config.tipi[diarioScelto].contextEpicrisi;
				config.tipi[diarioScelto]['pulsanti'] = typeof config.tipi[diarioScelto]['pulsanti'] === 'undefined' ? ['btnDiarioDiet'] : config.tipi[diarioScelto].pulsanti;
				
				//  Impedisco la modifica ad altri utenti
				if ($('form[name=EXTERN] input[name=CONTEXT_MENU]').val() != 'LETTURA' && baseUser.TIPO == 'D') {
					config.tipi[diarioScelto].context = "";
					config.tipi[diarioScelto].contextEpicrisi = "";
				}
				break;
			case 'OST': diarioScelto = 'OSTETRICO';
			case 'OSTETRICO':
				if (title == '') { title = "Ricerca Diari Ostetrica"; }
				if (typeof config.tipi[diarioScelto] === 'undefined') config.tipi[diarioScelto] = {};
				config.tipi[diarioScelto]['epicrisi'] = typeof config.tipi[diarioScelto]['epicrisi'] === 'undefined' ? 'N' : config.tipi[diarioScelto].epicrisi;
				config.tipi[diarioScelto]['filtri']   = typeof config.tipi[diarioScelto]['filtri']   === 'undefined' ? 'N' : config.tipi[diarioScelto].filtri;
				config.tipi[diarioScelto]['worklist'] = typeof config.tipi[diarioScelto]['worklist'] === 'undefined' ? 'WK_DIARI' : config.tipi[diarioScelto].worklist;
				config.tipi[diarioScelto]['context']  = typeof config.tipi[diarioScelto]['context']  === 'undefined' ? 'WK_DIARI_LETTURA' : config.tipi[diarioScelto].context;
				config.tipi[diarioScelto]['contextEpicrisi']  = typeof config.tipi[diarioScelto]['contextEpicrisi']  === 'undefined' ? 'WK_EPICRISI_LETTURA' : config.tipi[diarioScelto].contextEpicrisi;
				config.tipi[diarioScelto]['pulsanti'] = typeof config.tipi[diarioScelto]['pulsanti'] === 'undefined' ? ['btnDiarioOst'] : config.tipi[diarioScelto].pulsanti;
				
				//  Impedisco la modifica ad altri utenti
				if ($('form[name=EXTERN] input[name=CONTEXT_MENU]').val() != 'LETTURA' && baseUser.TIPO == 'OST') {
					config.tipi[diarioScelto].context = "";
					config.tipi[diarioScelto].contextEpicrisi = "";
				}
				break;
			case 'AS': diarioScelto = 'SOCIALE';
			case 'SOCIALE':
				if (title == '') { title = "Ricerca Diari Assistente Sociale"; }
				if (typeof config.tipi[diarioScelto] === 'undefined') config.tipi[diarioScelto] = {};
				config.tipi[diarioScelto]['epicrisi'] = typeof config.tipi[diarioScelto]['epicrisi'] === 'undefined' ? 'N' : config.tipi[diarioScelto].epicrisi;
				config.tipi[diarioScelto]['filtri']   = typeof config.tipi[diarioScelto]['filtri']   === 'undefined' ? 'N' : config.tipi[diarioScelto].filtri;
				config.tipi[diarioScelto]['worklist'] = typeof config.tipi[diarioScelto]['worklist'] === 'undefined' ? 'WK_DIARI' : config.tipi[diarioScelto].worklist;
				config.tipi[diarioScelto]['context']  = typeof config.tipi[diarioScelto]['context']  === 'undefined' ? 'WK_DIARI_LETTURA' : config.tipi[diarioScelto].context;
				config.tipi[diarioScelto]['contextEpicrisi']  = typeof config.tipi[diarioScelto]['contextEpicrisi']  === 'undefined' ? 'WK_EPICRISI_LETTURA' : config.tipi[diarioScelto].contextEpicrisi;
				config.tipi[diarioScelto]['pulsanti'] = typeof config.tipi[diarioScelto]['pulsanti'] === 'undefined' ? ['btnDiarioSoc'] : config.tipi[diarioScelto].pulsanti;
				
				//  Impedisco la modifica ad altri utenti
				if ($('form[name=EXTERN] input[name=CONTEXT_MENU]').val() != 'LETTURA' && baseUser.TIPO == 'AS') {
					config.tipi[diarioScelto].context = "";
					config.tipi[diarioScelto].contextEpicrisi = "";
				}
				break;
			default:
				if (typeof config.tipi[diarioScelto] === 'undefined') throw new Error('Il diario "' + diarioScelto + '" non è un tipo conosciuto o non è stato configurato.');
				config.tipi[diarioScelto]['epicrisi'] = typeof config.tipi[diarioScelto]['epicrisi'] === 'undefined' ? 'N' : config.tipi[diarioScelto].epicrisi;
				config.tipi[diarioScelto]['filtri']   = typeof config.tipi[diarioScelto]['filtri']   === 'undefined' ? 'S' : config.tipi[diarioScelto].filtri;
				config.tipi[diarioScelto]['worklist'] = typeof config.tipi[diarioScelto]['worklist'] === 'undefined' ? 'WK_DIARI' : config.tipi[diarioScelto].worklist;
				config.tipi[diarioScelto]['context']  = typeof config.tipi[diarioScelto]['context']  === 'undefined' ? 'WK_DIARI_LETTURA' : config.tipi[diarioScelto].context;
				config.tipi[diarioScelto]['contextEpicrisi']  = typeof config.tipi[diarioScelto]['contextEpicrisi']  === 'undefined' ? 'WK_EPICRISI_LETTURA' : config.tipi[diarioScelto].contextEpicrisi;
				config.tipi[diarioScelto]['pulsanti'] = typeof config.tipi[diarioScelto]['pulsanti'] === 'undefined' ? [] : config.tipi[diarioScelto].pulsanti;
				
				//  Impedisco la modifica ad altri utenti
				if ($('form[name=EXTERN] input[name=CONTEXT_MENU]').val() != 'LETTURA') {
					config.tipi[diarioScelto].context = "";
					config.tipi[diarioScelto].contextEpicrisi = "";
				}
		}
		
		// rimuove i pulsanti dei diari non inerenti al diario selezionato...
		arrIdPulsanti = config.tipi[diarioScelto].pulsanti;
		if (tipoDiario === diarioScelto) {
			if (arrIdPulsanti.length > 0) {
				$('UL[id="elenco_metodiche"] LI')
				.filter(function(){return $.inArray($(this).attr("id").replace(/^[^_]*_/,""), arrIdPulsanti) === -1;})
				.remove();
			}
		} else {
			// Sovrascrive i menù contestuali
			config.tipi[tipoDiario]['context'] = typeof config.tipi[diarioScelto]['context']  === 'undefined' ? 'WK_DIARIO_MET' : config.tipi[diarioScelto].context;
			config.tipi[tipoDiario]['contextEpicrisi']  = typeof config.tipi[diarioScelto]['contextEpicrisi']  === 'undefined' ? 'WK_EPICRISI_LETTURA' : config.tipi[diarioScelto].contextEpicrisi;
		}
		
		// Altre configurazioni del diario
		// Progetto M.E.T.al
		if (!isNaN(idenSchedaMET) && idenSchedaMET > 0) {
			arrIdPulsanti = ["btnDiarioMed", "btnDiarioInf"];
			config.tipi[tipoDiario]['epicrisi'] = 'N';
			config.tipi[tipoDiario]['filtri']   = 'N';
			config.tipi[tipoDiario]['context']  = ($('form[name=EXTERN] input[name=CONTEXT_MENU]').val() != 'LETTURA') ? "" : 'WK_DIARIO_MET';
		}
		
		// Cambia il layout della pagina (titolo, filtri, context menu, frame diari ed epicrisi)
		if (title != '') {var p = $.inArray("lblTitleDiari", arrayLabelName);if (p>0) arrayLabelValue[p] = title;}
		if (config.tipi[tipoDiario].filtri == 'S') {showFiltriRicerca();}
		$('form[name=EXTERN] input[name=KEY_TIPO_DIARIO]').val(diarioScelto);
		
		// Seleziona una diversa combinazione di pulsanti da illuminare
		switch (tipoDiario) {
			case 'RIABILITATIVO':
				if (baseUser.TIPO == 'L') {
					arrIdPulsanti = ["btnDiarioLog"];
				} else if (baseUser.TIPO == 'F') {
					if ($.inArray("ROBOTICA", baseUser.ATTRIBUTI) > -1) {
						arrIdPulsanti = ["btnDiarioRob"];
					} else {
						arrIdPulsanti = ["btnDiarioFis"];
					}
				}
				break;
			default: // non modifico l'array dei pulsanti
		}
		
		_this.resettaCampi();
	}
	
	function setDatepicker() {
		// si elimina la classe messa dal configuratore (che era senza minDate)
		$('#txtDaData').removeClass('hasDatepick');
		// si elimina il calendario
		$('#txtDaData').next().remove();
		// si reimposta la classe, configurando anche minDate, così viene anche rimesso il calendario
		$('#txtDaData').datepick({
			onClose: function() {
				jQuery(this).focus();
			},
			showOnFocus: false,
			minDate: function() {
				switch (WindowCartella.FiltroCartella.getLivelloValue()) {
					case "IDEN_ANAG": 
					case "ANAG_REPARTO":    return clsDate.setData(WindowCartella.getPaziente("DATA"),"00:00");
					case "NUM_NOSOLOGICO":  return clsDate.setData(WindowCartella.getRicovero("DATA_INIZIO"),"00:00");
					case "IDEN_VISITA":     return clsDate.setData(WindowCartella.getAccesso("DATA_INIZIO"),"00:00");
				}
			},
			showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"/>'
		});
	};
	
	function getValue(arrValue) {
		if (arrValue.length > 0) return "'"+arrValue.join("','")+"'";
		return "";
	}
	
	function getFiltroWhereWk(daData, aData, idenVisita, text, reparto) {
		var ret = {};
		var WHERE_WK = new Array();
		var WHERE_WK_EPICRISI = new Array();
		/* // FIXME
		// Creo il filtro sulla data
		if (daData != "") WHERE_WK.push("(substr(data_evento,7,4)||SUBSTR(DATA_EVENTO,4,2) || SUBSTR(DATA_EVENTO,1,2) >='"+daData+"')");
		if (aData != "") WHERE_WK.push("(substr(data_evento,7,4)||SUBSTR(DATA_EVENTO,4,2) || SUBSTR(DATA_EVENTO,1,2) <='"+aData+"')");
		*/
		// Creo il filtro sull'iden
		if (idenVisita.length > 0) WHERE_WK.push("(IDEN_VISITA IN ("+idenVisita.join(",")+") or PARENT IN ("+idenVisita.join(",")+"))");
		
		// Creo il filtro sul testo da cercare		
		if (text !== '' && text !== '%') WHERE_WK.push("(CONTAINS(CONTENUTO, q'{"+text+"}'||' INPATH (/PAGINA/CAMPI/CAMPO"+($("#chkTestoRicerca").is(":checked")? "[@KEY_CAMPO=''txtDiario'']" : "")+")') > 0)");
		
		// Creo il filtro sui diari
		var filtri_generale = [];
		var filtri_epicrisi = [];
		var pulsanti = $(".pulsanteLISelezionato");
		if (pulsanti.length > 0) {
			for (var i=0; i<pulsanti.length;i++) {
				var id = pulsanti[i]["id"].replace(/^[^_]*_/,"");
				var arrValue = _this.getFiltroPulsante(id);
				$.merge(filtri_generale, arrValue[0]);
				$.merge(filtri_epicrisi, arrValue[1]);
			};
		} else {
			// impedisce di selezionare tutti i diari quando non seleziono nessun pulsante
			filtri_generale.push("");
			filtri_epicrisi.push("");
		}
		
		// Creo il filtro sul reparto
		if (reparto.length > 0) WHERE_WK.push("REPARTO_DI_RICOVERO IN ("+getValue(reparto)+")");
		
		// Progetto M.E.T.al
		if (idenSchedaMET > 0) WHERE_WK = ["ARRIVATO_DA='CC_SCHEDE_METAL'", "IDEN_RIFERIMENTO="+idenSchedaMET];
		
		WHERE_WK_EPICRISI = WHERE_WK.slice(); // copia
		
		if (filtri_generale.length > 0) WHERE_WK.push("TIPO_DIARIO IN ("+getValue(filtri_generale)+")");
		if (filtri_epicrisi.length > 0) WHERE_WK_EPICRISI.push("TIPO_DIARIO IN ("+getValue(filtri_epicrisi)+")");
		
		if (WHERE_WK.length == 0 || WHERE_WK_EPICRISI.length == 0) {
			throw new Error("Attenzione! Condizione WHERE nulla.");
		}
		
		ret.generale = " WHERE "+WHERE_WK.join(" AND ");
		ret.epicrisi = " WHERE "+WHERE_WK_EPICRISI.join(" AND ");
		return ret;
	}
	
	function aggiorna() {
		if (idenSchedaMET == '0' && _this.isEpicrisiConfigurata()) {
			// Mostra l'epicrisi
		    $("iframe#frameDiari").height('60%');
		    $("iframe#frameEpicrisi").height('30%');
		    $("label#lblTitleEpicrisi").parent().parent().show();
		    ShowLayer('groupWkEpicrisi');
		} else {
			// Nasconde l'epicrisi
		    $("iframe#frameDiari").height('90%');
		    $("label#lblTitleEpicrisi").parent().parent().hide();
		    HideLayer('groupWkEpicrisi');
		}
		
		// applica i filtri selezionati (equivale alla funzione "applica_filtro")
		loadWkDiari();
		loadWkEpicrisi();
	}
	
	function loadWkDiari() {
		setVeloNero('frameDiari');
		sqlFiltri['url_diari'] = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK="+config.tipi[tipoDiario].worklist+"&CONTEXT_MENU="+config.tipi[tipoDiario].context+"&ILLUMINA="+encodeURIComponent("javascript:illumina(this.sectionRowIndex);")+"&WHERE_WK="+encodeURIComponent(sqlFiltri['WHERE_WK_DIARI'])+"&ORDER_FIELD_CAMPO="+sqlFiltri['_WK_ORDINA_CAMPO_DIARI'];
		document.all['frameDiari'].src = sqlFiltri['url_diari'];
	}

	function loadWkEpicrisi() {
		setVeloNero('frameSecondario');
		sqlFiltri['_WK_ORDINA_CAMPO_EPICRISI'] = 'IDEN DESC';
		sqlFiltri['url_epicrisi'] = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_EPICRISI&CONTEXT_MENU="+config.tipi[tipoDiario].contextEpicrisi+"&ILLUMINA="+encodeURIComponent("javascript:illumina(this.sectionRowIndex);")+"&WHERE_WK="+encodeURIComponent(sqlFiltri['WHERE_WK_EPICRISI'])+"&ORDER_FIELD_CAMPO="+sqlFiltri['_WK_ORDINA_CAMPO_EPICRISI'];
		if (config.tipi[tipoDiario].epicrisi == 'S') {
			document.all['frameSecondario'].src = sqlFiltri['url_epicrisi'];
		}
		else {
			document.all['frameSecondario'].src = '';
		}
	}
	
	function showFiltriRicerca() {
		$('div#groupFiltri').add($('div#groupFiltri').prev()).add($('div#groupFiltri').next()).show();
	}
	
	function hideFiltriRicerca() {
		$('div#groupFiltri').add($('div#groupFiltri').prev()).add($('div#groupFiltri').next()).hide();
	}
}).apply(NS_DIARIO_GENERICO);

// ridefinisce il comportamento dell'ordinamento manuale
var _WK_ORDINA_CAMPO = '';
applica_filtro = function(frame) {
	switch(frame) {
		case 'frameSecondario':
			NS_DIARIO_GENERICO.setManualOrder('_WK_ORDINA_CAMPO_EPICRISI', _WK_ORDINA_CAMPO);
			NS_DIARIO_GENERICO.loadWkEpicrisi();
			break;
		case 'frameDiari': default:
			NS_DIARIO_GENERICO.setManualOrder('_WK_ORDINA_CAMPO_DIARI', _WK_ORDINA_CAMPO);
			NS_DIARIO_GENERICO.loadWkDiari();
	}
};
