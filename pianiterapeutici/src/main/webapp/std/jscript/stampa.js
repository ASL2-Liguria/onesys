/**
 * @author Lino 05/12/2011
 */

/* Funzione Generica di Stampa */
function stampa(funzione, sf, anteprima, reparto, stampante) {
	var url = 'elabStampa?stampaFunzioneStampa=' + funzione;
	url += '&stampaAnteprima=' + anteprima;
	if (reparto != null && reparto != '')
		url += '&stampaReparto=' + reparto;
	if (sf != null && sf != '')
		url += '&stampaSelection=' + sf;
	if (stampante != null && stampante != '')
		url += '&stampaStampante=' + stampante;

	var finestra = window.open(url, "", "top=0,left=0,width="
			+ screen.availWidth + ",height=" + screen.availHeight);

	if (finestra) {
		finestra.focus();
	} else {
		var finestra = window.open(url, "", "top=0,left=0,width="
				+ screen.availWidth + ",height=" + screen.availHeight);
	}
	try {
		ArrayWindowOpened.push(finestra);
	} catch (e) {
		window.opener.top.ArrayWindowOpened.push(finestra);

	}
}

/*
 * Funzione Di Configurazione Del Reparto stampe configurabili: tutte quelle in
 * cartella stampe non configurabili: tutte le richieste + stampa etichette
 * 
 */
function confStampaReparto(funzione, sf, anteprima, reparto, stampante) {

	if (reparto == '') {
		var key = 'SITO';
		var rep = baseReparti.getValue('', key);
	} else {
		var key = 'STAMPA_' + funzione;
		var rep = baseReparti.getValue(reparto, key);
	}
	stampa(funzione, sf, anteprima, rep, stampante);
}

/* Funzione Di Stampa Della Prenotazione Direttamente Da Polaris */
function stampaPrenotazioneDirettaSuPolaris(connection, funzione, sf,
		anteprima, reparto, stampante) {
	var url = connection + '/ServletStampe?report=';
	if (reparto != null && reparto != '')
		url += reparto + "/" + funzione;
	if (sf != null && sf != '')
		url += "&sf=" + sf;
	var finestra = window.open(url, "", "top=0,left=0,width="
			+ screen.availWidth + ",height=" + screen.availHeight);
}

function getAbsolutePath() {
	var loc = window.location;
	var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
	return loc.href
			.substring(
					0,
					loc.href.length
							- ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}

/**
 * @author Lino 28/10/2014 Namespace per il caricamento dell'applet e del div di
 *         configurazione
 */

var NS_LOAD_APPLET_PRINT = {
	init : function(ip) {
		var jnlp = "";
		switch(baseGlobal.SITO) {
		case "ASL2":
			jnlp = "std/app/AppStampaASL2.jnlp"; break;
		case "SITO"://ASL3
			jnlp = "std/app/AppStampaASL3.jnlp"; break;
		default:
			jnlp = "std/app/AppStampa.jnlp"; break;
		}		
		// Da ridefinire il comportamento del jnlp
		$('body').append(NS_LOAD_APPLET_PRINT.getObjectHtml({jnlp_href : jnlp}));
		// Creazione div di configurazione
		var $div = jQuery('<div/>', {
			'id' : 'divConfigStampa'
		});

		// Creazione iframe di configurazione
		var $iframe = jQuery('<iframe/>', {
			'id' : 'iframeConfigStampa',
			'src' : window.location.pathname.substring(0,
					window.location.pathname.lastIndexOf('/') + 1)
					+ '/iFrameStampa.html'
		});
		$div.append($iframe);
		$('body').append($div);
		$('#divConfigStampa').hide();
	},

	/**
	 * Rende visibile il div di configurazione
	 */
	showApplet : function() {
		NS_LOAD_APPLET_PRINT.setDimension();
		$('#divConfigStampa').show();

		var wnd = $('#divConfigStampa iframe#iframeConfigStampa')[0];
		wnd = wnd.contentWindow || wnd.contentDocument;
		wnd.NS_PRINT_CONFIG.setEvents();
		

	},

	/**
	 * Resize della pagina per visualizzare il frame di configurazione
	 */
	setDimension : function() {
		var altezzaDiv = $('#divConfigStampa').height();
		var altezzaFrame = $('#iframe_main').height();
		var posizione = parseInt(altezzaFrame) - parseInt(altezzaDiv);
		// ridimensiono frame
		$('#iframe_main').height(posizione + 'px');
		// posizione div configurazione
		var posizione = posizione + parseInt($('#Home').height());
		$('#divConfigStampa').css('top', posizione + 'px');
	},
	/**
	 * Creazione html applet di stampa
	 */
	getObjectHtml : function(options) {
		var def = {
			height : "0px",
			width : "0px",
			name : "AppStampa",
			id : "AppStampa",
			loadStampe : true,
			loadFirma : false,
			loadSCL : false,
			loadAQ : false,
			ShowMediaTrays : "S"
		};
		if (typeof options == "undefined")
			options = {};
		for (o in def) {
			if (typeof options[o] == "undefined") {
				options[o] = def[o];
			}
		}
		;
		var ritorno = '<object height=' + options.height + '" name="'
				+ options.id + '" width="' + options.width
				+ '" type="application/x-java-applet" id="' + options.id + '">';
		ritorno += '<param name="loadStampe" value="' + options.loadStampe
				+ '"/>';
		ritorno += '<param name="SCLclass" value="it.elco.applet.smartCard.login.LoggedCardListener"/>';
		if (options.jnlp_href == "") {
			ritorno += '<param name="archive" value="std/app/SignedFenixApplet.jar,std/app/JSon.jar,std/app/PDFOne.jar,std/app/bcpkix-jdk15on-148.jar,std/app/bcprov-jdk15on-148.jar,std/app/commons-lang-2.6.jar"/>';
			ritorno += '<param name="code" value="it.elco.applet.elcoApplet"/>';
/*			ritorno += '<param name="cache_option" value="Plugin"/>';
			ritorno += '<param name="cache_archive" value="std/app/activemq-all-5.6.0.jar,std/app/bcmail-jdk15on-148.jar,std/app/bcpkix-jdk15on-148.jar,std/app/bcprov-jdk15on-148.jar,std/app/commons-io-2.4.jar,std/app/commons-lang-2.6.jar,std/app/commons-logging-1.1.3.jar,std/app/httpclient-4.2.5.jar,std/app/httpcore-4.2.4.jar,std/app/JSon.jar,std/app/JTwain.jar,std/app/ojdbc14.jar,std/app/PDFOne.jar,std/app/SignedFenixApplet.jar,std/app/xfe_jdk-14.jar"/>';			*/
		} else {
			ritorno += '<param name="jnlp_href" value="' + options.jnlp_href + '"/>';
/*			ritorno += '<param name="cache_option" value="Plugin"/>';
			ritorno += '<param name="cache_archive" value="std/app/SignedFenixApplet.jar,std/app/activemq-all-5.6.0.jar,std/app/bcmail-jdk15on-148.jar,std/app/bcpkix-jdk15on-148.jar,std/app/bcprov-jdk15on-148.jar,std/app/commons-io-2.4.jar,std/app/commons-lang-2.6.jar,std/app/commons-logging-1.1.3.jar,std/app/httpclient-4.2.5.jar,std/app/httpcore-4.2.4.jar,std/app/JSon.jar,std/app/JTwain.jar,std/app/ojdbc14.jar,std/app/PDFOne.jar,std/app/SignedFenixApplet.jar,std/app/xfe_jdk-14.jar"/>';			
*/
		}
		ritorno += '<param name="wmode" value="transparent"/>';
		ritorno += '<param name="initial_focus" value="false"/>';
		ritorno += '<param name="loadFirma" value="' + options.loadFirma+ '"/>';
		ritorno += '<param name="loadSCL" value="' + options.loadSCL + '"/>';
		ritorno += '<param name="loadAQ" value="' + options.loadAQ + '"/>';
		ritorno += '<param name="ShowMediaTrays" value="'+ options.ShowMediaTrays + '"/>';
		ritorno += '<param name="disableChangeHandler" value="true"/>';
		ritorno += '</object>';

		return ritorno;
	}
};

/**
 * @author Lino 28/10/2014 NameSpace di gestione della stampa della ricetta
 *         rossa
 */
var NS_PRINT = {
	ricettarossa:'',
	ricettabianca:'',
	ricettadema:'',
	// definita ma non utilizzata
	init : function(ip) {
		NS_PRINT.setPrinterOptionFromDb(ip);
	},
	setPrinterOptionFromDb : function(ip) {
		var file = 'appletStampa.xml';
		var statement = 'loadConf';
		var rs = top.executeQuery(file, statement, [ ip ]);
		while (rs.next()) {
			NS_PRINT.ricettarossa  	= new objStampantiRicette(rs.getString('printername_ricetta_rossa'),rs.getString('CONFIGURAZIONE_APPLET_RICETTA'));
			NS_PRINT.ricettabianca 	= new objStampantiRicette(rs.getString('printername_ricetta_bianca'),rs.getString('CONFIGURAZIONE_APPLET_BIANCA'));
			NS_PRINT.ricettadema	= new objStampantiRicette(rs.getString('PRINTERNAME_RICETTA_DEMA'),rs.getString('CONFIGURAZIONE_APPLET_DEMA'));			
		}
	},
	print : function(param) {
		var ritorno;
		//gestisce il cambiamento della stampante senza dover ricaricare il basePC
//		if (NS_PRINT.getPrinter()!="")
//			param.stampante = NS_PRINT.getPrinter();

		if (param.stampante == ""){
			return ('Problema configurazione stampante. Contattare assistenza')
		}
		
		AppStampa.setSrcFromUrl(param.url);
		ritorno = AppStampa.print(param.stampante, param.opzioni);
		return ritorno;
	},
	/**
	 * Array per la creazione delle url di stampa direttamente da servletStampe
	 * senza passare da elabStampa
	 */
	confStampe : {
		'RICETTA_ROSSA_FARMACI' : baseGlobal.SITO+'/RICETTA_ROSSA_NEW/FARMACI.RPT',
		'RICETTA_ROSSA_PRESTAZIONI' : baseGlobal.SITO+'/RICETTA_ROSSA_NEW/PRESTAZIONI.RPT',
		'RICETTA_BIANCA' : baseGlobal.SITO+'/RICETTA_ROSSA_NEW/RICETTA_BIANCA.RPT',
		'RICETTA_FARMACI_DEMATERIALIZZATA' : baseGlobal.SITO+'/RICETTA_ROSSA_NEW/FARMACI_DEMATERIALIZZATA.RPT',
		'RICETTA_PRESTAZIONI_DEMATERIALIZZATA' : baseGlobal.SITO+'/RICETTA_ROSSA/PRESTAZIONI_DEMATERIALIZZATA.RPT'
	}
}


var objStampantiRicette = function(stampante,conf) { 
	this._stampante 			= stampante;
	this._configurazione		= conf;
}

objStampantiRicette.prototype = {
	
	getStampante: function(){
		return this._stampante;
	},
	
	getConfigurazione :function(){
		return this._configurazione;
	}
}


var NS_FENIX_PRINT = {
		documentChangeHandler:function(url){
			var test = url;
		}
	};