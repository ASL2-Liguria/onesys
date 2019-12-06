/**
 * @author Lino 05/12/2011
 * 
 * @date 2015-03-13: rimosse dalla stampa con applet la parte di ricetta che userà l'applet di whale ma la parte di stampa di RrPt/whaleMods
 */

/* Funzione Generica di Stampa*/
function stampa(funzione,sf,anteprima,reparto,stampante,stampaFromModal)
{
	if (basePC.USO_APPLET_STAMPA =='S' && (funzione == 'ETICHETTA_VITRO')){
	    /*Rimossa la chiamata java all'applet perchè poteva causare problemi di sincronizzazione se fosse stata usata all'interno di un loop, come per esempio per le stampe delle etichette*/
		var url = getUrlDocument()+'ServletStampe?';
		url += 'report='+ NS_PRINT.confStampe[funzione];
		url += sf;
		var st;
		var option=[];
		/*Finchè viene richiamato da dentro RrPt non dovrebe mai entrare nei case RICETTA_ROSSA_FARMACI/RICETTA_ROSSA_PRESTAZIONI*/
		
		var wndPrint = '';
		var adtApplet = false;
		var wndFocus = window;
		if (top.name=='Home'){
			/*Richiamata dalla wk esami/consulenze*/
			wndPrint = window;
		}else{
			if (typeof (document.EXTERN.pagina)!='undefined' && typeof (document.EXTERN.pagina.value)!='undefined' && document.EXTERN.pagina.value==='CARTELLAPAZIENTEADT'){
				NS_PRINT.init(basePC.IP);
				adtApplet = true;
				wndPrint = window;
			}else{
				wndPrint = opener.top;				
			}
			/*Richiamata dalla wk esami/consulenze del paziente o richiamato da adt*/

		}
		
		switch (funzione){
			case 'ETICHETTA_VITRO':
				option['stampante'] 	= wndPrint.NS_PRINT.etichette.getStampante();
				option['configurazione']= wndPrint.NS_PRINT.etichette.getConfigurazione();
				break;			
			default :
				option['stampante'] 	= wndPrint.NS_PRINT.referti.getStampante();
				option['configurazione']= wndPrint.NS_PRINT.referti.getConfigurazione();			
				break;
		}
		
		
		var ritorno = NS_PRINT.print({
			url:url,
			stampante:option.stampante,
			opzioni:option.configurazione,
			appletAdt:adtApplet
		});
		
		if (adtApplet){
			top.opener.top.NS_ADT_API.focusCartella(wndFocus)
		}
		
		if (!ritorno){
			return ('Contattare Assistenza. Riscontrato problema con applet di stampa')
		}
	}else{
		var url;
	    if (typeof stampaFromModal=='undefined'){
	    	url =  'elabStampa?';
	    }
	    else{
	    	url =  getAbsolutePath()+'elabStampa?';
	    }    
	    var stampaPdfDiretto='N'
	    if (baseGlobal.SITO == 'VERONA'){
	    	stampaPdfDiretto = 'S'
	    }    
	    url += creaUrl(funzione, sf, anteprima, reparto, stampante, stampaPdfDiretto);		

		var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		try{
			closeWhale.pushFinestraInArray(finestra);
		}catch(e)
		{
			try {
				window.opener.top.closeWhale.pushFinestraInArray(finestra);
			} catch(ex) {
				
			}
		}
	}	
}

function creaUrl(funzione,sf,anteprima,reparto,stampante,checkPdfDiretto){
    var url;
    url = 'stampaFunzioneStampa='+funzione;

	url += '&stampaAnteprima='+anteprima;
	if(reparto!=null && reparto!='')		
		url += '&stampaReparto='+reparto;
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	
	
	url += '&stampaPdfDiretto='+checkPdfDiretto;
	url += '&ServletStampe=N';	
	return url;
}


/*Funzione Di Configurazione Del Reparto
 * stampe configurabili: tutte quelle in cartella
 * stampe non configurabili: tutte le richieste + stampa etichette
 * 
 * */
function confStampaReparto(funzione,sf,anteprima,reparto,stampante,tipologia_ricovero,stampaFromModal)
{
    var rep = '';
    if (typeof tipologia_ricovero=='undefined' || tipologia_ricovero=='' || tipologia_ricovero==null){
        if (reparto=='')
        {
            var key 	= 'SITO';
            rep = baseReparti.getValue('',key);
        }
        else
        {
            var key 	= 'STAMPA_'+funzione;
            rep = baseReparti.getValue(reparto,key);	
        }
    }else{
        var pBinds = new Array();
        pBinds.push(reparto);
        pBinds.push('STAMPA_'+funzione);
        pBinds.push(tipologia_ricovero);
        var rs = executeQuery("configurazioni.xml","stampe.recuperaRepartoConfigurazione",pBinds);
        while (rs.next())
        {
            rep = rs.getString('reparto');
        }
    }
        stampa(funzione,sf,anteprima,rep,stampante,stampaFromModal);
}

/*Funzione Di Stampa Della Prenotazione Direttamente Da Polaris*/
function stampaPrenotazioneDirettaSuPolaris(connection,funzione,sf,anteprima,reparto,stampante)
{
	var url =connection+ '/ServletStampe?report=';	
	if(reparto!=null && reparto!='')
		url += reparto+"/"+funzione;	
	if(sf!=null && sf!='')
		url += "&sf="+sf;	
	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
}

/*Funzione Di Stampa Della Prenotazione*/
function stampaPrenotazioneDirettaSuAmbulatorio(applicazione,funzione,sf,anteprima,reparto,stampante)
{
	var url =  'elabStampa?stampaFunzioneStampa='+funzione;
	url += '&stampaAnteprima='+anteprima;
	if(reparto!=null && reparto!='')		
		url += '&stampaReparto='+reparto;
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	
	url = top.NS_APPLICATIONS.switchTo(applicazione,url);
	
	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
}


function getAbsolutePath()
{
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}
/**
 * @author Lino 26/01/2015 Namespace per il caricamento dell'applet e del div di
 *         configurazione
 */

var NS_LOAD_APPLET_PRINT = {
	/**
	 * Appendo alla pagina di configurazione di whale l'applet di stampa
	 */
	init : function(ip) {
		var jnlp = "";

		// Da ridefinire il comportamento del jnlp
		$('body').append(NS_LOAD_APPLET_PRINT.getObjectHtml({
 			jnlp_href : "std/app/AppStampaASL2.jnlp"
//			jnlp_href : "std/app/AppStampa.jnlp"
		}));
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
 * @author Lino 26/01/2015 NameSpace di gestione della stampa della ricetta
 *         rossa
 */
var NS_PRINT = {
	//
	etichette:'',
	//
	referti:'',
	//
	ricette:'',
	//
	ricettabianca:'',
	//
	ricettadema:'',
	// definita ma non utilizzata
	init : function(ip) {
		NS_PRINT.setPrinterOptionFromDb(ip);
 	},
	/**
	 * Caricamento opzioni di stampa da db(non refresho il basePC)
	 * @param ip
	 */
	setPrinterOptionFromDb : function(ip) {
		var file = 'appletStampa.xml';
		var statement = 'loadConf';
		var rs = executeQuery(file, statement, [ ip ]);
		while (rs.next()) {
			this.etichette 		= new confStampanti(rs.getString('PRINTERNAME_ETI_CLIENT'),rs.getString('CONFIGURAZIONE_APPLET_ETI'));
			this.referti 		= new confStampanti(rs.getString('PRINTERNAME_REF_CLIENT'),rs.getString('CONFIGURAZIONE_APPLET_REF'));
			this.ricettarossa 	= new confStampanti(rs.getString('PRINTERNAME_RICETTA_ROSSA'),rs.getString('CONFIGURAZIONE_APPLET_RICETTA'));
			this.ricettabianca 	= new confStampanti(rs.getString('PRINTERNAME_RICETTA_BIANCA'),rs.getString('CONFIGURAZIONE_APPLET_BIANCA'));
			this.ricettadema	= new confStampanti(rs.getString('PRINTERNAME_RICETTA_DEMA'),rs.getString('CONFIGURAZIONE_APPLET_DEMA'));
		}
	},
	/**
	 * Funzione di stampa
	 * @param param-> url (url da stampare),stampante (stampante su cuistampare), opzioni (opzioni con il quale stampare)
	 */
	print : function(param) {
		var ritorno;
		if (param.stampante == ""){
			ritorno = false;
			return ritorno;
		}
		var obj;
		if (window.name == 'schedaRicovero'){
			if (typeof(param.appletAdt)!='undefined' && param.appletAdt){
				obj = top.opener.top.home.AppStampa;
			}else{
				obj = top.opener.AppStampa;				
			}
		}else{
			obj = AppStampa;
		}
		
		obj.setSrcFromUrl(param.url);
		ritorno = obj.print(param.stampante, param.opzioni);
		return ritorno;
	},
	/**
	 * Array per la creazione delle url di stampa direttamente da servletStampe
	 * senza passare da elabStampa
	 */
	confStampe : {
		'RICETTA_ROSSA_FARMACI' 	: baseGlobal.SITO+'/RICETTA_ROSSA/FARMACI_APPLET.RPT',
		'RICETTA_ROSSA_PRESTAZIONI' : baseGlobal.SITO+'/RICETTA_ROSSA/PRESTAZIONI_APPLET.RPT',
		'ETICHETTA_VITRO'			: baseGlobal.SITO+'/LABO_ETI_WHALE.rpt'
	}
};



/**
 * Oggetto caricato la stampante e la relativa configurazione
 * @param stampante,conf
 */
var confStampanti = function(stampante,conf) { 
	this._stampante 			= stampante;
	this._configurazione		= conf;
}

confStampanti.prototype = {
	
	getStampante: function(){
		return this._stampante;
	},
	
	getConfigurazione :function(){
		return this._configurazione;
	}	
};

function getUrlDocument() {
	var pdfPosition = ""
	dwr.engine.setAsync(false);
	dwrUtility.getBaseUrl(function(resp) {
		pdfPosition = resp;
	});
	dwr.engine.setAsync(true);

	return pdfPosition;
};


var NS_FENIX_PRINT = {
		documentChangeHandler:function(url){
			
		}
	};