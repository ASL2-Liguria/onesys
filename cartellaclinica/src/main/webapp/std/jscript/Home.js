window.name= 'Home';

function apri(url) {
	document.getElementById('iframe_main').src = url;
        home.setStartupPage(url);
}

function apriListaAttesa() {
	 var url='';
	 var aTmp = document.location.href.split('/');
	 var sRet = '';
	 for(var idx = 0; idx < aTmp.length - 2; sRet += aTmp[idx++] + "/");
	 url=sRet+"onesys-adt/Autologin?";
	 url+="username="+baseUser.LOGIN;
	 url+="&scheda=TAB_HOME_LISTA_ATTESA%26STATO_PAGINA=E%26nomeHost="+basePC.IP+"%26NO_APPLET=N%26EXIT_ALL=S%26TAB_SEL=li-filtroListaAttesa";

	 var finestra = window.open(url,"","fullscreen=yes"); 
}

function loadInFancybox(param){
	$.fancybox({
		'padding'	: 3,
		'width'		: document.documentElement.offsetWidth/10*9,
		'height'	: document.documentElement.offsetHeight/10*8,
		'href'		: param.url,
		'onClosed'	: typeof param.onClosed == 'function' ? param.onClosed : function(){},
		'type'		: 'iframe',
		'hideOnOverlayClick':false,
		'hideOnContentClick':false
	});	
}

function manu_tab(procedura, frame_rows) {
	if (typeof frame_rows == 'undefined' || frame_rows == null)
		frame_rows = '133,*';
	if(procedura=='T_CDC'){
		apri('servletGenerator?KEY_LEGAME=RICERCA_REPARTI');
	}
	else if(procedura=='T_STANZE'){
		apri('servletGenerator?KEY_LEGAME=RICERCA_STANZE');
	}
	else{
	apri('SL_Manu_Tab_Frameset?procedura=' + procedura + "&frame_rows=" + frame_rows);
	}
}

function servletGenerator(pagina) {
	apri('servletGenerator?KEY_LEGAME=' + pagina);
}

$(document).ready(function(){
	home.init();

	/*closeWhale.init();*/

	//NS_APPLICATIONS.performLogin("AMBULATORIO");
	$('#iframe_main').attr("src",$('#iframe_main').data("src"));

	$('#iframe_main').attr("src",$('#iframe_main').data("src"));

	NS_CACHED_DATA.load("getReparti","reparti","COD_CDC");
	/*test funzionante
	NS_CACHED_DATA.load("getTipiRicovero","tipi_ricovero","IDEN");
	NS_CACHED_DATA.load("getModalitaDimissione","tipi_dimissione","IDEN");*/
	
});

var home = {
		
	init : function() {
		
		if (/\bMSIE 6/.test(navigator.userAgent) && !window.opera) {
			$('#iframe_main').css({position:'absolute'});
			}
		
		if (home.getOpener()=='WHALE' && top.opener) {
			try {
				top.opener.chiudiHomepage();
			} catch (e) {
				;
			}
		}
		document.body.onbeforeunload=function(){

			if (!closeWhale.closing) {
				closeWhale.chiudiWhale();
			}
		};
		/*window.scrollTo(0, 0);*/
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
		home.creaBoxInfoUtente();//creazione box con le info dell'utente
		eval('privacy = ' + baseReparti.getValue(baseUser.LISTAREPARTI[0],'ATTIVA_PRIVACY'));
                if (basePC.USO_APPLET_STAMPA =="S"){
			/*Caricamento applet*/
			NS_LOAD_APPLET_PRINT.init(basePC.IP);
			NS_PRINT.init(basePC.IP);			
		}	
	},
	
	checkPrivacy : function(funzione) {
		if(privacy[funzione].ATTIVA=='S')
			return true;
		else
			return false;

	},

	getFileQuery : function(funzione) {
		if(privacy[funzione].ATTIVA=='S')
			return privacy[funzione].fileQuerySI;
		else
			return privacy[funzione].fileQueryNO;

	},	
	
	v_load_on_startup : '',
	
	setStartupPage : function(url){
		home.v_load_on_startup=url;
	},
	
	/*funzione che setta il campo loadonstartup con la url appena chiusa
        @deprecated: per problemi di sincronizzazione con la funzione in cui veniva richiamata
        setStartupPageOnUnload : function(){
		var url=home.v_load_on_startup;
		if (url!=''){
			if(url!=baseUser.LOADONSTARTUP){
				top.executeStatement("Web.xml","setLoadOnStartup",[baseUser.LOGIN,url],0,callBack);
			}
		}
                
                
		function callBack(resp){
                    return true;
                }
	},*/
	
	getApplicazione : function() {
		return top.document.EXTERN.applicazione.value;
	},
	
	getOpener : function() {
/*		if (typeof top.document.EXTERN.opener != 'undefined')
			return top.document.EXTERN.opener.value;
		else
			return '';*/
		if (typeof document.EXTERN.opener != 'undefined')
			return document.EXTERN.opener.value;
		else
			return '';
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
			altezza = screen.height;
			largh = screen.width;
			if(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1)
			{
				//IE 7...
				home.hnd_attesa = window.open("classAttesa","wnd_attesa","left=" + (largh/2-80)+ " ,top=" + (altezza/2-35) +",width=240,height=70,statusbar=no");
			}
			else
			{
				//IE 6 in giù...
				home.hnd_attesa = window.open("classAttesa","wnd_attesa","left=" + (largh/2-80)+ " ,top=" + (altezza/2-35) +",width=260,height=70,statusbar=no");
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
	}

};

var IPatient = {

    apri: function(idPaziente, isEmergenzaMedica, nosologico) {
     
        
    /*    if (IPatient.bloccaAperturaIpatient(idPaziente)) {
            return alert('Dati non disponibili in quanto il paziente ha negato il consenso privacy alla creazione del proprio fascicolo sanitario su sistema Onesys.');
        }*/
        
        var url = 'servletGeneric?class=iPatient.iPatient&id_paziente=' + idPaziente;
        url += '&PROV_CHIAMATA=CARTELLA';
        if (baseUser.TIPO == 'M' && baseUser.TIPO_MED == 'I') {
            url += isEmergenzaMedica ? '&SET_EMERGENZA_MEDICA=TRUE' : '&SET_EMERGENZA_MEDICA=FALSE';
        } 
        
        if (home.checkPrivacy('IPATIENT')){
        	url += '&SET_ATTIVA_PRIVACY=TRUE';
        }else{
        	url += '&SET_ATTIVA_PRIVACY=FALSE'
        }
        
        url += '&TIPOLOGIA_ACCESSO='+baseUser.MODALITA_ACCESSO;
        url += '&EVENTO_CORRENTE='+nosologico;
        
    	url += '&fileQuery='+home.getFileQuery('IPATIENT');        
        
        if (baseUser.LOGIN == 'arry') {
            alert('Alert DEBUG: \n' + url);
        }
        
        var finestra = window.open(url, "", "FULLSCREEN=YES");
        top.closeWhale.pushFinestraInArray(finestra);
    },
    
    bloccaAperturaIpatient : function(idPaziente){
        var idPazienteBloccati = new Array();
        idPazienteBloccati.push('PRZVLV44B62B104T');
        idPazienteBloccati.push('PPERFL62H15A145D');
        idPazienteBloccati.push('PPELSN66E05A145T');
        
        if (jQuery.inArray( idPaziente, idPazienteBloccati )>-1)
            return true;
        else 
            return false;
            return false;
    }
	
};

function executeStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	//serve per le pagine aperte con window.open
	var vBinds=$.extend(true,[],retArrayForStatement(pBinds));

	window.dwr.engine.setAsync(false);
	dwrUtility.executeStatement(pFileName,pStatementName,vBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	window.dwr.engine.setAsync(true);
	return vResponse;

	function callBack(resp){
		vResponse = resp;
	}
}

function executeBatchStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	
	var vResponse;
	//serve per le pagine aperte con window.open
	var vBinds=$.extend(true,[[]],retArrayForStatement(pBinds));

	window.dwr.engine.setAsync(false);
	dwrUtility.executeBatchStatement(pFileName,pStatementName,vBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	window.dwr.engine.setAsync(true);
	return vResponse;
	
	function callBack(resp){
		vResponse = resp;
	}
}

/*
 * Da inizioEngine.js
 */

function executeQuery(pFileName , pStatementName , pBinds, pCallBack){
	var vRs;
	var vResponse;
	var async = (typeof pCallBack == 'function');
	
	//serve per le pagine aperte con window.open
	var vBinds=$.extend(true,[],retArrayForStatement(pBinds));
	
	dwr.engine.setAsync(async);
	
	if(async){
		dwrUtility.executeQuery(pFileName,pStatementName,vBinds,function(resp){
			vRs = getResultset(resp);
			pCallBack(vRs);
		});
	
	}else{
		dwrUtility.executeQuery(pFileName,pStatementName,vBinds,callBack);
		return vRs;
	}
	
	function callBack(resp){
		vRs = getResultset(resp);
	}
	
	function getResultset(resp){
		var valid=true;
		var error='';
		var ArColumns,ArData;

		if (resp[0][0] == 'KO') {
			valid = false;
			error = resp[0][1];
			ArColumns =  ArData = new Array();
		} else {
			ArColumns = resp[1];
			ArData = resp.splice(2, resp.length-1);
		}
		return {
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
				pColumnName = pColumnName.toUpperCase();
				for (var i = 0; i< this.columns.length;i++){
					if(this.columns[i] == pColumnName){
						return i;
					}
				}
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
		if (!closeWhale.checkSito()){
			var $newobj = $('<OBJECT type="application/x-java-applet" height="0" width="0">'+
					'<param name="code" value="it.elco.applet.NomeHostSmartCardLogOff.class">'+
					'<param name="archive" value="std/app/SignedAppletHostSmartCard.jar">'+	
					'</OBJECT>');

			$('body').append($newobj);
		}
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
                var url=home.v_load_on_startup;
                
		if (url!=''){
                    if(url!=baseUser.LOADONSTARTUP){
                        top.dwr.engine.setAsync(false);
                        dwrUtility.executeStatement("Web.xml","setLoadOnStartup",[baseUser.LOGIN,url],0,callBack);
                        top.dwr.engine.setAsync(true);
                        function callBack(resp){}
                    }
		}
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
/*                top.location.replace (unload_url);
                home.closeWindow();    */
				
				try{
                if (document.EXTERN.opener.value=='ADT'){
					home.closeWindow();                
				}else{
					top.location.replace (unload_url);
					home.closeWindow();
				}
				}
				catch(e){}
               
	},
	
	checkSito:function(){
		var statementFile = 'Web.xml';
		var statementName = 'abilitaLogOutSmartcardJava';
		var parameters = [baseGlobal.SITO,'abilitaLogOutSmartcardJava'];
//		var vResp=top.executeQuery(statementFile, statementName, parameters);
		var vResp=executeQuery(statementFile, statementName, parameters);
		var abilitaLogOutSmartcardJava = '';	
		if (vResp.next()){
			abilitaLogOutSmartcardJava = vResp.getString("valore");
		}else{
			abilitaLogOutSmartcardJava='';
		}
		
		if (abilitaLogOutSmartcardJava=='N'){
			return true;
		}else{
			return false;
		}
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
		closeWhale.chiudiWhale();
                switch (home.getOpener()) {
		case 'UNISYS':
			top.opener.closeHomepage();
			break;
		default:
		}

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

var NS_CACHED_DATA = {

	load:function(pStatementName,pKeyJs,pKeyCampo){

		var rs = executeQuery("cached_data.xml",pStatementName,[]);
		
		while(rs.next()){
			var _key = rs.getString(pKeyCampo);
			NS_CACHED_DATA[pKeyJs][_key] = {};

			for (var i = 0; i< rs.columns.length;i++){				
				NS_CACHED_DATA[pKeyJs][_key][rs.columns[i]] = rs.getString(rs.columns[i]);
			}

		}	
		
	},
	
	reparti:{},	
	tipi_ricovero:{},
	tipi_dimissione:{}
	
};

var NS_CARTELLA_PAZIENTE = {

	size				:null,

	index				:null,	
	iden_anag			:null,
	iden_evento			:null,
	iden_ricovero		:null,
	iden_visita			:null,
	cod_cdc				:null,
	funzione			:null,
	ModalitaAccesso	:null,
	DatiInterfunzione	:null,
	window				:null,

	apri:function(pParam){
		/*index,iden_anag,iden_evento,iden_ricovero,iden_visita,cod_cdc,funzione,modalita,interfunzione*/
		NS_CARTELLA_PAZIENTE.size				= null;
		
		NS_CARTELLA_PAZIENTE.index = 
		NS_CARTELLA_PAZIENTE.iden_anag =
		NS_CARTELLA_PAZIENTE.iden_evento = 
		NS_CARTELLA_PAZIENTE.iden_ricovero = 
		NS_CARTELLA_PAZIENTE.iden_visita = 
		NS_CARTELLA_PAZIENTE.cod_cdc = 
		NS_CARTELLA_PAZIENTE.funzione = 
		NS_CARTELLA_PAZIENTE.ModalitaAccesso = 
		NS_CARTELLA_PAZIENTE.DatiInterfunzione = null;
		
		for (var key in pParam)
			NS_CARTELLA_PAZIENTE[key] = typeof pParam[key] == 'undefined' ? null : pParam[key];
		
		if(NS_CARTELLA_PAZIENTE.iden_evento == null){
			
			if(NS_CARTELLA_PAZIENTE.iden_visita != null && NS_CARTELLA_PAZIENTE.iden_ricovero !=null){

				NS_CARTELLA_PAZIENTE.iden_evento = [];

				for(var i = 0 ; i < NS_CARTELLA_PAZIENTE.iden_visita.length ; i++){
					NS_CARTELLA_PAZIENTE.iden_evento.push(
						(NS_CARTELLA_PAZIENTE.isValid(NS_CARTELLA_PAZIENTE.iden_visita[i]) ? 
						NS_CARTELLA_PAZIENTE.iden_visita[i] :
						NS_CARTELLA_PAZIENTE.iden_ricovero[i])
					);				
				}

			}else{
				 if(NS_CARTELLA_PAZIENTE.iden_visita != null){
					 NS_CARTELLA_PAZIENTE.iden_evento = NS_CARTELLA_PAZIENTE.iden_visita;
				 }
				 if(NS_CARTELLA_PAZIENTE.iden_ricovero != null){
					 NS_CARTELLA_PAZIENTE.iden_evento = NS_CARTELLA_PAZIENTE.iden_ricovero;
				 }				 
			}
			
		}

		/*alert(
			"iden_evento :" + NS_CARTELLA_PAZIENTE.iden_evento + '\n' +
			"iden_visita :" + NS_CARTELLA_PAZIENTE.iden_visita + '\n' +
			"iden_ricovero :" + NS_CARTELLA_PAZIENTE.iden_ricovero + '\n'						
		);*/
		if(NS_CARTELLA_PAZIENTE.index != null){
			
			NS_CARTELLA_PAZIENTE.size = NS_CARTELLA_PAZIENTE.iden_evento != null ? NS_CARTELLA_PAZIENTE.iden_evento.length : NS_CARTELLA_PAZIENTE.iden_anag.length;		
			
		}
			
		NS_CARTELLA_PAZIENTE.load();
	},
	
	load:function(){
		
		var data = NS_CARTELLA_PAZIENTE.getData();
		var url='servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente';		
		
		url += '&iden_evento=' 		 + data.iden_evento;
		url += '&iden_anag=' 		 + data.iden_anag;
		url += '&reparto=' 			 + data.cod_cdc;
		url += '&funzione=' 		 + data.funzione;
		url += '&DatiInterfunzione=' + data.DatiInterfunzione;
		url += '&ModalitaAccesso='  + data.ModalitaAccesso;		

		var finestra = window.open(url, 'schedaRicovero', 'fullscreen=yes, status=no, scrollbars=no');
		closeWhale.pushFinestraInArray(finestra);		
	},
	
	next:function(){
		NS_CARTELLA_PAZIENTE.index++;
		if(NS_CARTELLA_PAZIENTE.index == NS_CARTELLA_PAZIENTE.size)
			NS_CARTELLA_PAZIENTE.index = 0;
	},
	
	previous:function(){
		NS_CARTELLA_PAZIENTE.index--;
		if(NS_CARTELLA_PAZIENTE.index < 0)
			NS_CARTELLA_PAZIENTE.index = NS_CARTELLA_PAZIENTE.size -1;
	},
	
	refreshCaller:function(){

		if(NS_CARTELLA_PAZIENTE.window != null && NS_CARTELLA_PAZIENTE.window !=''){
			try{
				NS_CARTELLA_PAZIENTE.window.aggiorna();
			}catch(e){/*alert(e.description);*/}
		}
	},
	
	getData:function(){
		return {
			iden_evento			: NS_CARTELLA_PAZIENTE.checkType("iden_evento"),
			iden_anag			: NS_CARTELLA_PAZIENTE.checkType("iden_anag"),
			cod_cdc				: NS_CARTELLA_PAZIENTE.checkType("cod_cdc"),
			funzione			: NS_CARTELLA_PAZIENTE.checkType("funzione"),
			DatiInterfunzione   : NS_CARTELLA_PAZIENTE.checkType("DatiInterfunzione"),
			ModalitaAccesso     : NS_CARTELLA_PAZIENTE.checkType("ModalitaAccesso",( baseUser.MODALITA_ACCESSO == '' ? "REPARTO" : baseUser.MODALITA_ACCESSO))
		};
	},
	
	isValid:function(pValue){
		var bool =  
			typeof pValue != 'undefined' &&
			pValue != null &&
			pValue != "" &&
			pValue != 0 &&
			pValue != "0" &&
			pValue != -1 &&
			pValue != "-1";
		return bool;
	},
	
	checkType:function(pName,pDefault){
		if(NS_CARTELLA_PAZIENTE[pName] == null)
            return (typeof pDefault == 'undefined'?'':pDefault);
		
		if(typeof NS_CARTELLA_PAZIENTE[pName] != "object"){
			return NS_CARTELLA_PAZIENTE[pName];
		}else{
			return NS_CARTELLA_PAZIENTE[pName][NS_CARTELLA_PAZIENTE.index];
		
		}
	}
};

/*var NS_APPLICATIONS={
	
	addApplication:function(pKey,pApplicationPath,pCampoSwitch,pCampoUser,pCampoIp){
		NS_APPLICATIONS.applications[pKey] = {
			path:'/'+pApplicationPath+'/',
			session_created:false,
			campo_switch:typeof pCampoSwitch != 'undefined' ? pCampoSwitch : 'KEY',
			campo_user:typeof pCampoUser != 'undefined' ? pCampoUser : 'USER',
			campo_ip:typeof pCampoIp != 'undefined' ? pCampoIp : 'IP'						
		};
	},
	
	applications:{
		'WHALE':{path:null,session_created:true,campo_switch:'pagina',campo_user:'utente',campo_ip:'postazione'},
		'POLARIS':{path:null,session_created:false},
		'AMBULATORIO':{path:null,session_created:false}
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
			
			if (url_autologin != null)
			{
				url_autologin  +=	"autoLogin"
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
		}
		
		return success;
				
	},
	
	switchTo:function(pApplication,pResuorce){

		if(NS_APPLICATIONS.performLogin(pApplication)){			
			return NS_APPLICATIONS.getApplicationPath(pApplication) + pResuorce;
		}
		
	}	
	
};*/


var gericos = {

	getUrlPrenotazione:function(user, reparto, id_noso){
		//v_user = user != ''?user:'';
		v_reparto = reparto != '' ? reparto : '';
		v_id_noso = id_noso != '' ? id_noso: '' ;
		url=baseGlobal.URL_PRENOTAZIONE + '/autoLogin?KEY=VISIONE&USER='+user;
		if(v_id_noso == ''){
			url+='&REPARTO='+reparto;
		}else  if(reparto == ''){
			url+='&ID_NOSO='+v_id_noso;
		}
		
		var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	
		if(finestra){ 
			finestra.focus();
		}else{
			finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		}
	},
	
	getCodDecUtente:function(){
		
		var rep = baseUser.LISTAREPARTI;
		var statementFile = 'Web.xml';
		var statementName = 'getCodDec';
		var pBinds = new Array();
		var resp='';

		for(var i=0;i< rep .length;i++){
			
			pBinds.push(rep[i]);
			
		}
	
		var vResp=executeQuery(statementFile, statementName, [pBinds.toString()]);
		
		if (vResp.next()){
			resp = vResp.getString("cod_dec");
			//alert(resp);
			gericos.getUrlPrenotazione(baseUser.LOGIN, resp, '');
		}else{
			resp='';
		}
	}
};

var Actions = {
	execute:function(scope,key,parameters,pCallBack){
		
		pCallBack = typeof pCallBack ==  "function" ? pCallBack : callBack;

		dwr.engine.setAsync(false);		
		dwrUtility.executeAction(
			scope,
			key,
			(typeof parameters == 'object' ? JSON.stringify(parameters) : parameters),
			pCallBack
		);
		dwr.engine.setAsync(true);
		
		function callBack(response){
			if(response.success == false){
				alert(response.message);
			}
		}
	}
};

window.executeAction			= Actions.execute;


function stampaListaConsegnaCCE(){
    var arrayTipoRicoveroText = new Array('ODS','DS','ORD');
    var arrayTipoRicoveroVal = new Array('VPO_RIC_ODS','VPO_RIC_DS','VPO_RIC_ORD');

    var paramReturn = getDaDataADataDiarioRicovero(
        clsDate.getData(clsDate.dateAdd(new Date(),'D','1'), 'DD/MM/YYYY'),
        clsDate.getData(clsDate.dateAdd(new Date(),'D','1'), 'DD/MM/YYYY'),
        arrayTipoRicoveroText,
        arrayTipoRicoveroVal
    );
    if (typeof paramReturn!='undefined'){   
        var sf = '&prompt<pDataIni>='+ paramReturn.dataIni+
                 '&prompt<pDataFine>='+ paramReturn.dataFine+
                 '&prompt<pTipoRicovero>='+paramReturn.tiporicovero;
        var pFunzioneAttiva = 'WK_RICOVERATI_CONSEGNA_CCE';
        confStampaReparto(pFunzioneAttiva,sf,'S','',null);
    }
}


function stampaListaRiepilogoPreOperatorio(){  
    $.fancybox({
		'padding'	: 3,
		'width'		: 800,
		'height'	: 550,
		'href'		: getAbsolutePath()+'modalUtility/preOperatorio/DaDataADataFiltroStampa.html',
		'type'		: 'iframe',
		'hideOnOverlayClick':false,
		'hideOnContentClick':false
	});	
    
}

function callParameterForFancybox(){
    var arrayTipoFiltroText = new Array();
    var arrayTipoFiltroVal = new Array();
    var vRs = executeQuery('OE_Refertazione_Visita_Anestesiologica.xml','caricaCodiceVpo');
    while(vRs.next()){
        arrayTipoFiltroText.push(vRs.getString('descr'));
        arrayTipoFiltroVal.push(vRs.getString('cod_esa'));
    }
    
    var arrayDescrReparti = new Array();
    var arrayIdenProReparti = new Array();
    $.each(baseUser.LISTAREPARTI,function(key,value){
        var array = new Array();
        array.push(value);
        var rs = executeQuery('utilita.xml','descr_centri_di_costo',array);
        while (rs.next()){
            arrayDescrReparti.push(rs.getString("descr"));
        }
        var rs2 = executeQuery('utilita.xml','iden_pro_centri_di_costo',array);
        while (rs2.next()){
            arrayIdenProReparti.push(rs2.getString("iden"));
        }        
    });

    var param = {
        dataIni         : clsDate.getData(clsDate.dateAdd(new Date(),'D','1'), 'DD/MM/YYYY'),
        tipofiltroTxt   : arrayTipoFiltroText,
        tipofiltroVal   : arrayTipoFiltroVal,
        arrayDescrRep   : arrayDescrReparti,
        arrayIdenProRep : arrayIdenProReparti
    };
    
    return param;
}



function callbackStampa(paramReturn){
    if (typeof paramReturn!='undefined'){
        var sf = '&prompt<pDataIni>='+ paramReturn.dataIni;
        sf += '&prompt<pDataFine>='+ paramReturn.dataFine;
        if (paramReturn.esameSelezionati.length==0)
            sf += '&prompt<pTipologia>='+paramReturn.esamiDefault;
        else
            sf += '&prompt<pTipologia>='+ paramReturn.esameSelezionati;     
        if (paramReturn.repartiSelezionati.length==0)
            sf += '&prompt<pIdenReparti>='+paramReturn.repartiDefault;
        else
            sf += '&prompt<pIdenReparti>='+ paramReturn.repartiSelezionati;        
        
        var pFunzioneAttiva = 'WK_PREOPERATORIO_RIEPILOGATIVO';
        var stampaFromModal = true;
        
        confStampaReparto(pFunzioneAttiva,sf,'S','',null,null,stampaFromModal);
    }
}

function apriDiario(tipo, reparto){
	tipo = typeof tipo === 'string' ? tipo : '';
	reparto = typeof reparto === 'string' ? reparto : '';
	apri('servletGenerator?KEY_LEGAME=DIARI&KEY_IDEN_VISITA=&KEY_NOSOLOGICO=&KEY_TIPO_DIARIO='+tipo+'&REPARTO='+reparto+'&CONTEXT_MENU=');
}

function apriPentaho(){
	var psw='';
	var url =  'http://10.106.0.128:8082/pentaho/Home?';    
	if (!$('form#formPentaho').length){
    	var vResp =executeStatement("utilita.xml" , "getFlatPassword" , [baseUser.LOGIN] , 1);
    	if(vResp[0]=='KO'){
    		alert(vResp[1]);
    	}else{
    		psw=vResp[2];
    	}
		
	    $('body').append('<form id="formPentaho" />');
	    $("form#formPentaho").append('<input type="hidden" name="userid" id="userid"/>');
	    $("form#formPentaho input#userid").val(baseUser.LOGIN);
	    $("form#formPentaho").append('<input type="hidden" name="password" id="password"/>');
	    $("form#formPentaho input#password").val(psw);
	}    
    var finestra = window.open("","pentaho","fullscreen=no scrollbars=no");
	$("form#formPentaho").attr('target','pentaho');
	$("form#formPentaho").attr('action',url);
    $("form#formPentaho").attr('method','POST');
    $("form#formPentaho").submit();     
}