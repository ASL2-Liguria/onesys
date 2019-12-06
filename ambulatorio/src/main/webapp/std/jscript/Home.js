window.name= 'Home';
// ***************************
// variabile usate per "tamponare" il 
// problema di prenotazioni "automatiche"
// su pazienti NON effettivamente scelti 
// , come se si provenisse dalla funzionalità
// "prenota su paziente" della worklist !!
// il flag verrà posto ad S *solo* quando 
// si passa da consulta e "N" quando si passa
// da "prenota su paziente". Il flag verrà
// azzerato al termine della prenotazione
// per ora solo in "scheda esame"
var prenotaDaConsulta = "";

// configurazioni di ges_Config_page
// usate per popolare jsonConfigurazioni
// la cui chiave è il nome del parametro
// ed il valore il suo valore effettivo 
/*
var configurazioniToLoad = new Array("FUNZIONALITA*GESTIONE_SOLE","FUNZIONALITA*NOTIFICA_EVENTO_NON_PRESENTATO", "PRIVACY*GESTIONE_ATTIVA_PVCY", "FUNZIONALITA*IDENTIFICA_PAZ", "AMBULATORIO*SITO", "FUNZIONALITA*IDENTIFICA_PAZ.EFFETTUATO_DA", "FUNZIONALITA*IDENTIFICA_PAZ.PAGE", "SCHEDA_ESAME*SHOW_SAVE_PRINT", "STARTUP*MOSTRA_LISTA_PAZ_NP", "SCHEDA_ESAME*MOSTRA_NUM_CART_RADIOTERAP", "FILTRI_WK*ABILITA_ARCO_TEMPO", "QUIT_AMBULATORIO*CONFERMA_QUIT", "PRIVACY*CHECK_COINVOLTO_CURA", "PRIVACY*FRASE_NO_COINVOLTO_CURA", "FUNZIONALITA*ABILITA_NOTIFICHE_SISTEMA","FUNZIONALITA*MOSTRA_NOTIFICA_DIAGNOSI_IN_WK", "SCHEDA_ANAG*SHOW_BT_PAZ_SCONOSCIUTO", "FILTRI_WK*ABILITA_CAMBIO_CDC", "FILTRI_WK*ABILITA_CAMBIO_METODICA","CONSOLLE*GESTIONE_PRONTO_VALIDAZIONE","CONSOLLE*MODULO_REFERTAZIONE_GENERICO","CONSOLLE*ABILITA_SECONDO_MEDICO", "CONSOLLE*SCAN_DB_MEDICO_2", "CONSOLLE*RIMAPPA_IDEN_ESAMI_DA_REFERTARE", "SCELTA_ESAME*STARTUP.CARICA_TUTTE_PRESTAZIONI", "FUNZIONALITA*ESEGUI_PRENOTAZIONI", "FUNZIONALITA*REFERTA_UN_SOLO_ESAME", "SCELTA_ESAME*MOSTRA_DESCR_CDC", "SCELTA_ESAME*MOSTRA_OMINO", "FUNZIONALITA*NON_PRESENTATO.GG_ANTECEDENTI","QUIT_AMBULATORIO*NOTIFICA_TODO", "QUIT_AMBULATORIO*NOTIFICA_FINE_GIORNATA","CANCELLAZIONE_ESAME*IDEN_PRO_CUP","CANCELLAZIONE_ESAME*CANCELLA_ESAMI_CUP","FUNZIONALITA*GESTIONE_NUM_CART_RADTERAP.UTENTI_ABILITATI","FUNZIONALITA*GESTIONE_NUM_CART_RADTERAP.UTENTI_ABILITATI");
*/
var jsonConfigurazioni = {};

function apri(url) {
		try{
		// modifica aldo 1-12-14
		switch (url){
			case "creaNotificheSistema":
				// apertura in fancybox del modulo di 
				// gestione amministrativa delle notifiche
				try{gestioneNotifiche.create();}catch(e){;}
				break;
			/*case "gestioneFormat":
				document.getElementById('iframe_main').src = "addOn/gestioneFormat/gestioneFormat.html";				
				break;
			case "gestioneAllineamenti":
				// modifica per ferrara 
				document.getElementById('iframe_main').src = "addOn/gestioneAllinementi/gestioneAllinementi.html";							
				break;*/
			default:
				document.getElementById('iframe_main').src = url;
				home.setStartupPage(url);			
				break;
		}
		// **********
	}catch(e){alert("Error on switch " + e.description);}
	
}

// *************************
// modifica aldo 16/10/14
// *************************
function consulenze(){
	try{
		var urlToCall = "";
		var myWin;
//		alert("consulenze");
		urlToCall = home.getConfigParam("WHALE_URL_AUTOLOGIN");
		urlToCall += "?utente=" + baseUser.LOGIN ;
		urlToCall += "&postazione="+  basePC.IP ;
		urlToCall += "&pagina=CONSULENZE";
		urlToCall += "&opener=AMB";
		myWin=window.open(urlToCall,"","top=0,left=0, width=" + screen.availWidth +", height=" + screen.availHeight + ", status=no, scrollbars=yes"); 
	}
	catch(e){
		alert("consulenze - Errore: " + e.description);
	}
}
// *************************

// *************************
// modifica aldo 16/02/16
// *************************
function richInviate(){
	try{
		var urlToCall = "";
		var myWin;

// autoLogin?utente=web.webuser&postazione=configura_pc.ip&pagina=FILTRO_RICHIESTE_RICOVERATI_GENERICHE
		urlToCall = home.getConfigParam("WHALE_URL_AUTOLOGIN");
		urlToCall += "?utente=" + baseUser.LOGIN ;
		urlToCall += "&postazione="+  basePC.IP ;
		urlToCall += "&pagina=FILTRO_RICHIESTE_RICOVERATI_GENERICHE";
		myWin=window.open(urlToCall,"","top=0,left=0, width=" + screen.availWidth +", height=" + screen.availHeight + ", status=no, scrollbars=yes"); 
	}
	catch(e){
		alert("richInviate - Errore: " + e.description);
	}
}
// *************************

function loadInFancybox(param){
	$.fancybox({
		'padding'	: 3,
		'width'		: document.documentElement.offsetWidth/10*9,
		'height'	: document.documentElement.offsetHeight/10*8,
		'href'		: param.url,
		'onClosed'	: typeof param.onClosed == 'function' ? param.onClosed : function(){},
		'type'		: 'iframe',
		'hideOnOverlayClick':false,
		'hideOnContentClick':false,
		'showCloseButton'	: typeof param.showCloseButton != 'undefined' ? param.showCloseButton : true		,
		'enableEscapeButton': typeof param.enableEscapeButton != 'undefined' ? param.enableEscapeButton : true
	});	
}

function manu_tab(procedura, frame_rows) {
	if (typeof frame_rows == 'undefined' || frame_rows == null)
		frame_rows = '133,*';
	apri('SL_Manu_Tab_Frameset?procedura=' + procedura + "&frame_rows=" + frame_rows);
}

function servletGenerator(pagina) {
	apri('servletGenerator?KEY_LEGAME=' + pagina);
}

$(document).ready(function(){
	home.init();
	closeWhale.init();
	try{
		hideFrame.initbasePacsStudy();
		hideFrame.initbasePacsUser();
	}
	catch(e){
		alert("can't init hideFrame")
	}
	//***************************
	//****** modifica DEMA ******
	//***************************	
	// tappullo per chiamata da whale "allega file"
	// da verificare come mai baseUser sia undefined
	try{
		WEB_ATTRIBUTES.init(baseUser.LOGIN);
	}catch(e){
		try{WEB_ATTRIBUTES.init(top.baseUser.LOGIN);}catch(e){;}
	}
	//***************************			
	// modifica 30-04-2015		
	try{
		if (home.getConfigParam("ABILITA_NOTIFICHE_SISTEMA")=="S"){
			// metodo check che controllo se esistono
			// notifiche per il personale loggato 
			// e crea icona di notifica
			try{gestioneNotifiche.check(baseUser.COD_DEC_PERSONALE);}catch(e){;}
			// creo menu se e solo se l'utente è abilitato
			// ****************************
			// ******** MED INIZIATIVA
			// ****************************			
			// modifica 11-6-15
//			if (WEB_ATTRIBUTES.getAttributeValue("MESSAGGISTICA.CREAZIONE")=="S"){
				gestioneNotifiche.buildNewMsgIcon();
	//		}
			// **************
			
		}
	}
	catch(e){
		alert("Error on ABILITA_NOTIFICHE_SISTEMA param " + e.description);
	}
	// ***********************	

});

var home = {
		
	init : function() {
		if (home.getOpener()=='AMBULATORIO' && top.opener) {
			try {
				top.opener.chiudiHomepage();
			} catch (e) {
				;
			}
		}
		document.body.onunload=function(){
			// controllo chiamata in standalone dell'allega documenti
			if ((typeof caller) != "undefined")
				return;
			try{home.setStartupPageOnUnload();}catch(e){}
			if (!closeWhale.closing)
				closeWhale.chiudiWhale();
		};
		/*window.scrollTo(0, 0);*/
		try{
		$slidemenu.buildmenuClick("menuMain", arrowimages);
		jQuery("#menumain li[show]").each(function(){
			try {
				if (typeof this.show != 'undefined') {
					if (eval(this.show) == true) {
						jQuery(this).show();
					} else {
						jQuery(this).hide();
					}
				}
			} catch (m) {

			}
		});
		//creazione box con le info dell'utente
		home.creaBoxInfoUtente();}catch(e){;}
		// carica info parametri ges_config_page
		var rs;
		var strToEval;
		try{
			// test
			// caricarli in automatico da configurazione pre esistente
			// valutare di fare una query unica !!!!
			
			
			// dal momento che tutti i parametri che mi
			// interessano hanno nome univoco, faccio query di "gruppo"
			try{
				var strParamTmp = "";
//				rs =  executeQuery('configurazioni.xml','getAllConfigParam',[strParamTmp]);
				// modifica del 28/8/14
				// verranno presi tutti i parametri
				// filtrati per TIPO = 'S'
				rs =  executeQuery('configurazioni.xml','getAllConfigParamNoFilter',[]);
				var valoreParametro = "";
				while(rs.next()){
					try{
						valoreParametro = rs.getString("valore");
						valoreParametro = valoreParametro.replace(/"/g, "'")
						strToEval = "jsonConfigurazioni[\"" + 	rs.getString("parametro") + "\"] = \"" +  valoreParametro + "\";"		
						eval(strToEval);
					}
					catch(e){
						alert("Errore sul parametro: "+rs.getString("parametro") + "\n" + e.description);
					}
				}
				// aggancio il menu della fine giornata
				if (home.getConfigParam("SITO")=="FERRARA"){
					home.createMenu("idFineGiornata", "Fine giornata", "Fine giornata", "bar_menu.fineGiornata()", "imagexPix/button/mini/fineGiornata.png");
				}
			}
			catch(e){
				alert("Error loading param list " + e.description);
			}
		}
		catch(e){
			alert("initConfigurazioniFromDb - error: " + e.description);
		}				
		// ***********
	
	},
	
	v_load_on_startup : '',
	v_pacsActive: false,
	setStartupPage : function(url){
		home.v_load_on_startup=url;
	},
	
	//funzione che setta il campo loadonstartup con la url appena chiusa
	setStartupPageOnUnload : function(){
		var url=home.v_load_on_startup;
		try{
		if (url!=''){
			if(url!=baseUser.LOADONSTARTUP){
				top.executeStatement("Web.xml","setLoadOnStartup",[baseUser.LOGIN,url]);
			}
		}}catch(e){;}

		function callBack(resp){
		}
	},
	
	getApplicazione : function() {
		if (typeof top.document.EXTERN != 'undefined')
			return top.document.EXTERN.applicazione.value;
	},	
	
	getOpener : function() {
		try{
			if (typeof top.document.EXTERN.opener != 'undefined')
				return top.document.EXTERN.opener.value;
			else
				return '';
		}catch(e){;}
	},
	
	getAbsolutePath : function(loc)
	{
		if (typeof loc == 'undefined')
			loc = window.location;
	    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
	    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
	},
	
	getReturnHomepage : function(){
		var opener_name = home.getOpener();
		var url = '';
		if (opener_name == home.getApplicazione()) {
			url = home.getAbsolutePath();
		} else {
			if (top.opener) {
				url = home.getAbsolutePath(top.opener.location);
			} else {
				url = home.getAbsolutePath();
				url = url.substr(0,homepageJS.length-1);
				url = url.substr(0,homepageJS.lastIndexOf('/')+1);
				switch (opener_name){
					case 'UNISYS' 	:
						url = url + 'unisys';
						break;
					case 'WHALE' 	:
						url = url + 'whale';
						break;
					default			:
						url = url + opener_name.toLowerCase();
						break;
				}
			}
		}
		return url;
	},

	creaBoxInfoUtente : function(){
		var oggetto;
		try{
			oggetto = document.getElementById("infoBar");
			oggetto.innerHTML = "<font color='white'>User: </font>" + baseUser.LOGIN +" - "+ baseUser.DESCRIPTION + " <font color='white'> - ip: </font>" + basePC.IP;
			oggetto.title = "User: " + baseUser.LOGIN +" - "+ baseUser.DESCRIPTION + " - ip: " + basePC.IP;	
		}
		catch(e){
			alert("creaBoxInfoUtente - Error: " + e.description);
		}
	},
	
	newWindow : function(name){
		//funzione che gestisce l'apertura di una nuovaFinestra
		if (typeof name == 'undefined')
			name = 'wnd_'+home.getOpener().toLowerCase(); 
		var winOpen = window.open("",name,"top=0,left=0,height=" + screen.availHeight + ", width=" + screen.availWidth);
		if (winOpen){
			winOpen.focus();
		}else{
			winOpen = window.open("",name,"top=0,left=0,height=" + screen.availHeight + ", width=" + screen.availWidth);
		}
		return winOpen;
	},
	
	closeWindow : function()
	{
	    if($.browser.safari || navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1)
	    {
	        //IE 7 or Safari
	        window.open('','_self');
	        window.close();
	    }
	    else if($.browser.mozilla )
		{
	    	window.open('', '_parent', '');
	        window.close();
		}
	    else
	    {
	        //IE 6 in giù...
	        top.opener = null;
	        self.close();
	    }
	},
	
	hnd_attesa : null,
	
	apri_attesa: function()
	{
		try{
			altezza = screen.height
			largh = screen.width
			if(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1)
			{
				//IE 7...
				home.hnd_attesa = window.open("classAttesa","wnd_attesa","left=" + (largh/2-80)+ " ,top=" + (altezza/2-35) +",width=240,height=70,statusbar=no")
			}
			else
			{
				//IE 6 in giù...
				home.hnd_attesa = window.open("classAttesa","wnd_attesa","left=" + (largh/2-80)+ " ,top=" + (altezza/2-35) +",width=260,height=70,statusbar=no")
			}	
		}
		catch(e){
			//alert("apri_attesa - Error: " + e.description);
		}
	},

	chiudi_attesa: function()
	{
		try{
			if (home.hnd_attesa)
			{
				home.hnd_attesa.close();
			}
		}
		catch(e){
		}
	},
	// *********** ferrara
	// ritorna paraemtro di ges_config_page
	getConfigParam: function(paramName){
		var strValue ="";
		try{strValue = jsonConfigurazioni[paramName];}catch(e){alert("Parametro " + paramName + " non esistente");}


		return strValue;
	},
	createMenu: function(id, label, title, doFunction, imgUrl){
		if (label  == ""){return;}
		var strToPrepend = "";
		// parametrizzare l'immagine o usare una clase
		strToPrepend = "<li id='" + id +"' title='" + title +"'><img src='" + imgUrl + "'><a href='#' onClick='javascript:"+ doFunction + ";return false;'>"+label+"</a></li>";
		$("#menuBar ul").prepend(strToPrepend);			

	}
	// *******************
	//***************************
	//****** modifica DEMA ******
	//***************************	
	,
	getWebAttributeValue: function(value){
		var strTmp="";
		try{
			strTmp = WEB_ATTRIBUTES.getAttributeValue("DEMA");
		}catch(e){alert("in catch " + e.description);}
		return strTmp;
	}
	// *******************
};

function executeStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	
	//serve per le pagine aperte con window.open
	var vBinds=$.extend(true,[],retArrayForStatement(pBinds));
	var oggettoDWR ;
	/*try{
		
	if (typeof (top.dwr) =="undefined"){
		oggettoDWR = dwr.engine;
	}
	else{
		oggettoDWR = top.dwr.engine;
	}}catch(e){oggettoDWR = dwr.engine;}
	*/
	oggettoDWR = dwr.engine;
	oggettoDWR.setAsync(false);
	dwrUtility.executeStatement(pFileName,pStatementName,vBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	oggettoDWR.setAsync(true);
	return vResponse;

	function callBack(resp){
		vResponse = resp;
	}
}

function executeBatchStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	//serve per le pagine aperte con window.open
	var vBinds=$.extend(true,[[]],retArrayForStatement(pBinds));
	
	var oggettoDWR ;
	/*try{
	if (typeof (top.dwr) =="undefined"){
		oggettoDWR = dwr.engine;
	}
	else{
		oggettoDWR = top.dwr.engine;
	}}catch(e){oggettoDWR = dwr.engine;}*/
	oggettoDWR = dwr.engine;
	oggettoDWR.setAsync(false);
	dwrUtility.executeBatchStatement(pFileName,pStatementName,vBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	oggettoDWR.setAsync(true);
	return vResponse;
	
	function callBack(resp){
		vResponse = resp;
	}
}

/*
 * Da inizioEngine.js
 */

function executeQuery(pFileName , pStatementName , pBinds){

	var vResponse;
	
	//serve per le pagine aperte con window.open
	var vBinds=$.extend(true,[],retArrayForStatement(pBinds));
	
	var oggettoDWR ;
	// inutile ?
	/* 
	try{
	if (typeof (top.dwr) =="undefined"){
		oggettoDWR = dwr.engine;
	}
	else{
		oggettoDWR = top.dwr.engine;
	}}catch(e){oggettoDWR = dwr.engine;}*/
	try{
		oggettoDWR = dwr.engine;
		oggettoDWR.setAsync(false);
		dwrUtility.executeQuery(pFileName,pStatementName,vBinds,callBack);
	}
	catch(e){
		alert(e.description);
	}
	finally{
		try{oggettoDWR.setAsync(true);}catch(e){;}
	}
		
	
	
	return vRs;

	function callBack(resp){
		var valid=true;
		var error='';
		var ArColumns,ArData;
		
		if(resp[0][0]=='KO'){
			isValid = false;
			error = resp[0][1];
			ArColumns =  ArData =  new Array();
		}else{
			ArColumns = resp[1];
			ArData = resp.splice(2,resp.length-1);
		}
		vRs = {
			isValid:valid,
			getError:function(){return error;},
			columns:ArColumns,
			data:ArData,
			size:ArData.length,
			current:null,
			next:function(){
				if(this.current==null && this.size>0){
					this.current = 0;
					return true;
				}else{
					return ++this.current < this.size;
				}
			},
			getString:function(pColumnName){
				return this.data[this.current][this.getColumnIndex(pColumnName)];
			},
			getInt:function(pColumnName){
				return parseInt(this.getString(pColumnName),10);
			},
			getColumnIndex:function(pColumnName){
				try{
					if (typeof(pColumnName) !="undefined"){
						pColumnName = pColumnName.toUpperCase();
						for (var i = 0; i< this.columns.length;i++){
							if(this.columns[i] == pColumnName){
								return i;
							}
						}
					}
				}catch(e){;}
			}
		}
	}
}

function retArrayForStatement(pBinds){
	var retArray = new Array();
	switch (typeof pBinds){
	case 'object': 
		retArray = pBinds;
		break;
	case 'undefined':
		break;
	default:     
		retArray.push(pBinds); 
	break;
	}
	return retArray;    
}

/*Gestione della chiusura delle schede di whale con il logout effettuato con la smartcard o con il bottone esci*/
var closeWhale = {
	arrayWindowOpened : new Array(),
	
	init:function(){
		var $newobj = $('<OBJECT type="application/x-java-applet" height="0" width="0">'+
				'<param name="code" value="it.elco.applet.NomeHostSmartCardLogOff.class">'+
				'<param name="archive" value="std/app/SignedAppletHostSmartCard.jar">'+	
				'</OBJECT>');

		$('body').append($newobj);
	},
	
	pushFinestraInArray:function(finestra){
		closeWhale.arrayWindowOpened.push(finestra);
	},
	
	clearArray: function(){
		for (var i=0;i<closeWhale.arrayWindowOpened.length;i++){
			try
			{
				closeWhale.arrayWindowOpened[i].close();	
			}
			catch(e)
			{
				//alert('clearArray'+e.description);
			}
		}
	},
	
	retLenghtArray:function(){
		alert(closeWhale.arrayWindowOpened.length);
	},
	
	closing : false,
	
	chiudiWhale : function(changeLogin) {
		closeWhale.closing = true;
		try {
			closeWhale.clearArray();
		} catch(e) {
			alert('chiudiWhale'+e.description);
		}
		if (typeof changeLogin == 'undefined') {
			changeLogin = false;
		}
		var unload_url = "unloadSession";
		if (changeLogin) {
			unload_url = unload_url + "?changeLogin=S";
		}
		top.location.replace (unload_url);
		home.closeWindow();
	}
};

/*Gestione delle funzioni associate ai bottoni presenti sulla barra in alto(Cambia Login,Torna Menu,Esci)*/
var bar_menu = {
				
	cambiaLogin : function(){
		home.newWindow().location.replace(home.getReturnHomepage());
		switch (home.getOpener()) {
		case 'UNISYS':
			window.opener.closeHomepage();
			break;
		default:
		}
		closeWhale.chiudiWhale(true);
	},
	
	chiudi : function(){
		if (home.getConfigParam("CONFERMA_QUIT")=="S"){
			if (!confirm("Attenzione: si sta uscendo dal programma, proseguire?")){
				return;
			}
		}
		switch (home.getOpener()) {
		case 'UNISYS':
			top.opener.closeHomepage();
			break;
		default:
		}
		closeWhale.chiudiWhale();
	},
	
	tornaMenu : function(){
		switch (home.getOpener()){
		case 'UNISYS'	:
			window.opener.location.reload();
			closeWhale.chiudiWhale();
			break;
		default			: 
			alert('funzione da definire'); 
		}
	}
 
};




var hideFrame = {
	basePacsStudy : new Object(),
	basePacsUser : new Object(),
	bolOpenedConsole : false,
	initbasePacsStudy: function(){
		try{
			hideFrame.basePacsStudy.ACCNUM = "";
			hideFrame.basePacsStudy.AETITLE = "";
			hideFrame.basePacsStudy.REPARTO = "";
			hideFrame.basePacsStudy.PATID = "";	
			hideFrame.basePacsStudy.NODE_NAME = "";		
		}
		catch(e)
		{
			alert("initbasePacsStudy - Error: " + e.description);
		}
	},
	initbasePacsUser : function(){
		try{
			if (typeof hideFrame.basePacsUser.LOGIN != "undefined"){
				hideFrame.basePacsUser.LOGIN = baseUser.LOGIN;
				// mettere decodifica
				
				dwr.engine.setAsync(false);
				ajaxUserManage.ajaxGetFlatPwd(baseUser.LOGIN,function(value){
						try{
							hideFrame.basePacsUser.PWD = value;
						}catch(e){alert(e.description);}
				
					});
				
				ajaxUserManage.ajaxGetCryptedPwd(baseUser.LOGIN,function(value){
					try{
						hideFrame.basePacsUser.PWD_CRYPTED = value;
					}catch(e){alert(e.description);}
		
				});
				dwr.engine.setAsync(true);	
			}
		}
		catch(e)
		{
			alert("initbasePacsUser - Error: " + e.description);
		}
	},
	resetStudyObject: function(){
		hideFrame.basePacsStudy.ACCNUM = "";
		hideFrame.basePacsStudy.AETITLE = "";
		hideFrame.basePacsStudy.REPARTO = "";
		hideFrame.basePacsStudy.PATID = "";	
		hideFrame.basePacsStudy.NODE_NAME = "";		
	},
	sendToPacs: function(azione, pacsType, additionalParameters){ 
		var oggettoPacs;
		var strEval = "";
		try{
			if (azione == ""){return;}
			azione = azione.toUpperCase();
			actionMediSurf(azione,hideFrame.basePacsUser, hideFrame.basePacsStudy, additionalParameters, pacsType);
			//logActionRisPacs(azione,basePacsUser,basePacsStudy, additionalParameters);
		}
		catch(e){
			alert("sendToPacs - Error: "+ e.description);
		}
	}
};

var NS_APPLICATIONS={
	
	addApplication:function(pKey,pApplicationPath,pCampoSwitch,pCampoUser,pCampoIp){
		NS_APPLICATIONS.applications[pKey] = {
			path:'/'+pContextPath+'/',
			session_created:false,
			campo_switch:typeof pCampoSwitch != 'undefined' ? pCampoSwitch : 'KEY',
			campo_user:typeof pCampoUser != 'undefined' ? pCampoUser : 'USER',
			campo_ip:typeof pCampoIp != 'undefined' ? pCampoIp : 'IP'						
		};
	},
	
	applications:{
		'WHALE':{path:'/whale/',session_created:false,campo_switch:'pagina',campo_user:'utente',campo_ip:'postazione'},
		'POLARIS':{path:null,session_created:false},
		'AMBULATORIO':{path:'',session_created:true}
	},

	getApplicationCampoSwitch:function(pApplication){
		var app = NS_APPLICATIONS.applications[pApplication];
		return typeof app.campo_switch != 'undefined' ? app.campo_switch :'KEY';
	},
	
	getApplicationCampoUser:function(pApplication){
		var app = NS_APPLICATIONS.applications[pApplication];
		return typeof app.campo_user != 'undefined' ? app.campo_user :'USER';
	},		
	
	getApplicationCampoIp:function(pApplication){
		var app = NS_APPLICATIONS.applications[pApplication];
		return typeof app.campo_ip != 'undefined' ? app.campo_ip :'IP';
	},		
	
	getApplicationPath:function(pApplication){
		
		if(NS_APPLICATIONS.applications[pApplication].path == null){
			dwr.engine.setAsync(false);
			dwrUtility.getApplicationUrl(pApplication,function(resp){
				NS_APPLICATIONS.applications[pApplication].path = resp;
			});
			dwr.engine.setAsync(true);
		}
		
		return NS_APPLICATIONS.applications[pApplication].path
	},
	
	performLogin:function(pApplication){
		
		var success = false;
		
		if(NS_APPLICATIONS.applications[pApplication].session_created){
			success = true;
		}else{

			var url_autologin = NS_APPLICATIONS.getApplicationPath(pApplication)
							+	"autoLogin"
							+	"?" + NS_APPLICATIONS.getApplicationCampoSwitch(pApplication) + "=CHECK_LOGIN"
							+	"&" + NS_APPLICATIONS.getApplicationCampoUser(pApplication) + "=" +baseUser.LOGIN
							+	"&" + NS_APPLICATIONS.getApplicationCampoIp(pApplication) + "=" +basePC.IP;

			$.ajax({
				url: url_autologin,
				async:false,
				success:function(data){
						NS_APPLICATIONS.applications[pApplication].session_created=true;
						success = true;
					},
				error:function(obj,message){
						alert('Login application['+pApplication+'] error:' + message);
					}
			});

		}
		
		return success;
				
	},
	
	switchTo:function(pApplication,pResuorce){

		if(NS_APPLICATIONS.performLogin(pApplication)){			
			return NS_APPLICATIONS.getApplicationPath(pApplication) + pResuorce;
		}else{
			return alert('Risorsa temporaneamente non disponibile');
		}
		
	}	
	
};

// ***************
// modifica del 26-2-15
var MOTIVAZIONE_HANDLER ={
	setInputObj: function(pWebuser, pIdenPer, pIp, pIden_anag,pIden_esa,pFunzionalita,pStmFile){
		MOTIVAZIONE_HANDLER.inputInfo.WEBUSER = typeof pWebuser != 'undefined' ? pWebuser : '',		
		MOTIVAZIONE_HANDLER.inputInfo.IDEN_PER = typeof pIdenPer != 'undefined' ? pIdenPer : '',	
		MOTIVAZIONE_HANDLER.inputInfo.IP = typeof pIp != 'undefined' ? pIp : '',			
		MOTIVAZIONE_HANDLER.inputInfo.IDEN_ANAG = typeof pIden_anag != 'undefined' ? pIden_anag : '',
//		MOTIVAZIONE_HANDLER.inputInfo.IDEN_ESAMI = pIden_esa instanceof Array? pIden_esa : pIden_esa.toString().split("*"),
		MOTIVAZIONE_HANDLER.inputInfo.FUNZIONALITA = typeof pFunzionalita != 'undefined' ? pFunzionalita : '',
		MOTIVAZIONE_HANDLER.inputInfo.STMFILE = typeof pStmFile != 'undefined' ? pStmFile : ''	;
		
		if (pIden_esa.constructor == Array){
			MOTIVAZIONE_HANDLER.inputInfo.IDEN_ESAMI = pIden_esa;
		}
		else{
			if (typeof(pIden_esa)!="undefined" && pIden_esa!=""){
				MOTIVAZIONE_HANDLER.inputInfo.IDEN_ESAMI = [pIden_esa];
			}
			else{
				MOTIVAZIONE_HANDLER.inputInfo.IDEN_ESAMI = [];
			}
			
		}
	},		
	CALLER: {},
	CALLBACK:'',
	OUTPUT_FROM_FANCY:'',
	inputInfo:{
		'WEBUSER':'',
		'IDEN_PER':'',
		'IP':'',
		'IDEN_ANAG':'',
		'IDEN_ESAMI':[],
		'FUNZIONALITA':'',
		'STMFILE':''
	},
	getInputParam:function(){
		var ogg = this.inputInfo;
		return JSON.stringify(ogg);
	},
	setCallback: function(value){
		this.CALLBACK = value;
	},
	getCallback: function(){
		return this.CALLBACK;
	},
	setOutputFromFancy: function(value){
		this.OUTPUT_FROM_FANCY = value;
	},
	getOutputFromFancy: function(){
		return this.OUTPUT_FROM_FANCY;
	},	
	setCaller: function(oggetto){
		this.CALLER = oggetto;
	},
	getCaller: function(){
		return this.CALLER;
	},
	openForm: function(){
		var urlMotivazione="addOn/gestioneMotivazioni/gestioneMotivazioni.html";

		// in base al chiamante devo chiamare jquery diversamente ? 
		// console j$, o va bene jquery generico ? testare
		var param = "";
		param = "?parametri=" + encodeURI(this.getInputParam()); 
		if (this.getCaller().name =='RicPazWorklistFrame' || this.getCaller().name =='worklistMainFrame'){
			// worklist
			$.fancybox({
				'href'			: urlMotivazione + param + "&sorgente=worklist",
				'width'				: '40%',
				'height'			: 200,
				'autoScale'     	: false,
				'transitionIn'	:	'elastic',
				'transitionOut'	:	'elastic',
				'type'				: 'iframe',
				'showCloseButton'	: false,
				'iframe': {
					preload: false // fixes issue with iframe and IE
				},
				'scrolling'   		: 'no',
				onStart		:	function() {
					//return window.confirm('Continue?');
				},
				onCancel	:	function() {
					//alert('Canceled!');
				},
				onComplete	:	function() {
					//alert('Completed!');
				},
				onCleanup	:	function() {
					//return window.confirm('Close?');
				},
				onClosed	:	function() {
					try{
						if (MOTIVAZIONE_HANDLER.getCallback()!=""){
							eval("MOTIVAZIONE_HANDLER.getCaller()."+ MOTIVAZIONE_HANDLER.getCallback());
						}
					}catch(e){alert(e.description +"##");}
					//aggiorna();
				}
			});
		}
		else{
			// consolle
			MOTIVAZIONE_HANDLER.getCaller().j$.fancybox({
				'width'		: MOTIVAZIONE_HANDLER.getCaller().document.documentElement.offsetWidth/10*9,
				'height'	: MOTIVAZIONE_HANDLER.getCaller().document.documentElement.offsetHeight/10*8,
				'autoScale'     	: false,
				'transitionIn'	:	'elastic',
				'transitionOut'	:	'elastic',
				'title'	:	'Stampa moduli', 
				'href'	:	urlMotivazione + param + "&sorgente=consolle",
				'iframe': {
					preload: false // fixes issue with iframe and IE
				},
				'type'				: 'iframe',
				'scrolling'   		: 'yes',
				'showCloseButton'	: true,
				'onStart'	: function(  ) {try{ MOTIVAZIONE_HANDLER.getCaller().showHideReportControlLayer(false);}catch(e){;}},
				'onClosed': function() {
					try{
						if (MOTIVAZIONE_HANDLER.getCallback()!=""){
							eval("MOTIVAZIONE_HANDLER.getCaller()."+ MOTIVAZIONE_HANDLER.getCallback());
						}
					}catch(e){alert(e.description +"##");}		
					finally{
						try{ MOTIVAZIONE_HANDLER.getCaller().showHideReportControlLayer(true);}catch(e){;}
					}
				}																
														
														
				
			});
		}
		
	}
}
// *****************


// ************** nuovo privacy
var PVCY_HANDLER = {
	msgPrivacyConsUnicoNotCompiled : "Impossibile continuare: il consenso unico non e' stato compilato.",
	msgPrivacyNotCompiled : "Impossibile continuare: i moduli del consenso per il\ntrattamento dei dati non sono stati compilati.",
	msgPrivacyReportNotAllowed : "Impossibile continuare: non e' stato dato il consenso alla refertazione.",
	getErrorMessage: function(value){
		var strOutput = "";
		switch(value){
			case "PVCY_NOT_COMPILED":
				strOutput = this.msgPrivacyNotCompiled;
				break;
			case "CANNOT_REPORT":
				strOutput = this.msgPrivacyReportNotAllowed;		 	
				break;				
			default:
				strOutput = "Nessun messaggio associato a " + value;
				break;
		}
		return strOutput;
	}
}

// ************** controllo *******
// oggetto infoObj così strutturato:
// IDEN_ANAG: anag.iden
// IDEN_ESAME: array di esami.iden
// IDEN_REF: referti.iden
var CTX_MENU_CHECKER = {
	setInfoObj: function(pIden_anag,pIden_esa,pIden_ref,pCallerReference){
		CTX_MENU_CHECKER.infoObj.IDEN_ANAG = typeof pIden_anag != 'undefined' ? pIden_anag : '',
		CTX_MENU_CHECKER.infoObj.IDEN_ESAMI = typeof pIden_esa != 'undefined' ? pIden_esa : '',
		CTX_MENU_CHECKER.infoObj.IDEN_REF = typeof pIden_ref != 'undefined' ? pIden_ref : ''		
		CTX_MENU_CHECKER.infoObj.CALLER = typeof pCallerReference != 'undefined' ? pCallerReference : ''		
	},	
	infoObj:{
		'IDEN_ANAG':'',
		'IDEN_ESAMI':[],
		'IDEN_REF':'',
		'CALLER':{}
	},
	getIDEN_ANAG:function(){
		var ogg = CTX_MENU_CHECKER.infoObj;
		return typeof ogg.IDEN_ANAG != 'undefined' ? ogg.IDEN_ANAG :'';
	},		
	getIDEN_ESAMI:function(){
		var ogg = CTX_MENU_CHECKER.infoObj;
		return typeof ogg.IDEN_ESAMI != 'undefined' ? ogg.IDEN_ESAMI :'';
	},			
	getIDEN_REF:function(){
		var ogg = CTX_MENU_CHECKER.infoObj;
		return typeof ogg.IDEN_REF != 'undefined' ? ogg.IDEN_REF :'';
	},	
	getCALLER:function(){
		var ogg = CTX_MENU_CHECKER.infoObj;
		return typeof ogg.CALLER != 'undefined' ? ogg.CALLER :'';
	},				
	isAvailable:function(functionType){
		var bolAvailable = false; 
		var consenso = "";
		var consensiNegati = new Array("","X","N");
		if (typeof functionType == "undefined" ){ return false; }
		switch (functionType){
			case "SOLE_DISPONIBILE":
				// controllo se il BB di Sole
				// è disponibile in base al fatto se il paziente ha
				// dato il consenso e NON sia negativo, quindi 
				// <> 'X' e <> 'N'
				// lavorare su array_consenso_sole
				// oppure su Anag.Consenso_Sole
				try{
					// *****************************		
					// modifica del 23-2-15
					//***********************
					// workaround per vecchi browser
					if(![].indexOf){
						Array.prototype.indexOf= function(what, i){
							i= i || 0;
							var L= this.length;
							while(i< L){
								if(this[i]=== what) return i;
								++i;
							}
							return -1;
						}
					}
//					alert("qui" + typeof (this.getCALLER().array_consenso_sole) +"@");
					// **********					
					if (typeof (this.getCALLER().array_consenso_sole)!= "undefined"){
						// notifica sul paziente, quinddi prendo il primo 
	//					alert(this.getCALLER().array_consenso_sole);
						try{
							consenso = this.getCALLER().stringa_codici(this.getCALLER().array_consenso_sole).split("*")[0];
						}catch(e){alert(e.description);}
						// 3-3-2015 
						// NB NON funziona !!!
						// faccio ciclo classico
						bolAvailable = true;
						for (var z=0;z<consensiNegati.length;z++){
							if (consensiNegati[z]==consenso){
								bolAvailable = false;
								break;
							}
						}
						/*
						if (consensiNegati.indexOf(consenso)==-1){
							bolAvailable = true;
						}*/
						
						// soluzione con jquery
						/*if (jQuery.inArray(consenso, consensiNegati)==-1){
							bolAvailable = true;
						}*/
					}
					else{
						var rs = executeQuery('consensoSole.xml','getConsensoSole',[this.getIDEN_ANAG()]);
						if (rs.next()){
							var valore = rs.getString("valore");
							if (valore !=""){
								consenso = valore.split('*')[0];
								bolAvailable = true;
								for (var z=0;z<consensiNegati.length;z++){
									if (consensiNegati[z]==consenso){
										bolAvailable = false;
										break;
									}
								}								
								/*if (consensiNegati.indexOf(consenso)==-1){
									bolAvailable = true;
								}*/
							}
						}
						else{
							bolAvailable = false;
						}
					}
				}
				catch(e){
					alert("CTX_MENU_CHECKER.isAvailable - Error: " + e.description);
				}
				
				break;
			default:
				break;
		}
		return bolAvailable;
	}
}
// ********************************



//***************************
//****** modifica DEMA ******
//***************************	
var WEB_ATTRIBUTES ={
	init: function(pWebuser){
		//  caricare dati da xml
		WEB_ATTRIBUTES.inputInfo.WEBUSER = typeof pWebuser != 'undefined' ? pWebuser : '';
		
		try{var rs = top.executeQuery('configurazioni.xml','getAllWebAttributes',[this.getUser()]);}catch(e){alert("Error on getConsensoSoleDiretto"); return;}
		if (rs.next()){
			this.setAttributes(rs.getString("PROPRIETA"));
		}

	},		
	CALLER: {},
	inputInfo:{
		'WEBUSER':'',
		'attributi':{}
	},
	getUser: function(){
		return this.inputInfo.WEBUSER;
	},	
	getInputParam:function(){
		var ogg = this.inputInfo;
		return JSON.stringify(ogg);
	},
	getAttributeValue: function(value){
		var strOutput = "";
		//@TODO
		if(this.getAllAttributes().hasOwnProperty(value)){
			strOutput = this.getAllAttributes()[value];
		}
		else{
			strOutput = "N";
		}
		return strOutput;
	},
	setAttributes: function(value){
		try{
			this.inputInfo.attributi = JSON.parse(value);
		}
		catch(e){
			alert("setAttributes - Error: " + e.description);
		}
	},	
	getAllAttributes: function(){
		//@TODO		
		return this.inputInfo.attributi;
	}
}
// *****************