function apri(url) {
	document.getElementById('iframe_main').src = url;
	home.setStartupPage(url);
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
	$('#iframe_main').attr("src",$('#iframe_main').data("src"));

	$('#iframe_main').attr("src",$('#iframe_main').data("src"));
	closeWhale.init();
	
	//Caricamento applet stampa
	if ((baseGlobal.SITO =='SITO' || baseGlobal.SITO =='ASL2') && basePC.USO_APPLET_STAMPA =="S"){
		if (top.name=='schedaRicovero')
			return;
		else{
			NS_LOAD_APPLET_PRINT.init(basePC.IP);
			NS_PRINT.init(basePC.IP);						
		}
	}
});

var home = {
		
	init : function() {
		if (home.getOpener()=='WHALE' && top.opener) {
			try {
				top.opener.chiudiHomepage();
			} catch (e) {
				;
			}
		}
		document.body.onunload=function(){
/*			home.setStartupPageOnUnload(); // Meglio solo su Whale */
		};
		/*window.scrollTo(0, 0);*/
		$slidemenu.buildmenuClick("menuMain", arrowimages);
		if (top.name!='schedaRicovero'){
			home.creaBoxInfoUtente();//creazione box con le info dell'utente
		}else{
			$('ul.menuBar li').hide()
		}
			
	},
	
	v_load_on_startup : '',
	
	setStartupPage : function(url){
		home.v_load_on_startup=url;
	},
	
	//funzione che setta il campo loadonstartup con la url appena chiusa
	setStartupPageOnUnload : function(){
		var url=home.v_load_on_startup;

		if (url!=''){
			if(url!=baseUser.LOADONSTARTUP){
				top.executeStatement("Web.xml","setLoadOnStartup",[baseUser.LOGIN,url]);
			}
		}

		function callBack(resp){
		}
	},
	
	getApplicazione : function() {
		return top.document.EXTERN.applicazione.value;
	},
	
	getOpener : function() {
		if (typeof top.document.EXTERN.opener != 'undefined')
			return top.document.EXTERN.opener.value;
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
	        //IE 6 in gi�...
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
				//IE 6 in gi�...
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
	}

};

function executeStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	top.dwr.engine.setAsync(false);
	dwrUtility.executeStatement(pFileName,pStatementName,pBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	top.dwr.engine.setAsync(true);
	return vResponse;

	function callBack(resp){
		vResponse = resp;
	}
}

function executeBatchStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	top.dwr.engine.setAsync(false);
	dwrUtility.executeBatchStatement(pFileName,pStatementName,pBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	top.dwr.engine.setAsync(true);
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
/*		var $newobj = $('<OBJECT type="application/x-java-applet" height="0" width="0">'+
				'<param name="code" value="it.elco.applet.NomeHostSmartCardLogOff.class">'+
				'<param name="archive" value="std/app/SignedAppletHostSmartCard.jar">'+	
				'</OBJECT>');
		
		$('body').append($newobj);*/
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
	
	chiudiWhale : function(changeLogin) {
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
	},
	
	showConfigApplet:function(){
		NS_LOAD_APPLET_PRINT.showApplet();	
	},
	showConfiguraPC:function(){
			window.open(
					'servletGenerator?KEY_LEGAME=GESTIONE_PC&OPERAZIONE=MOD&WEBUSER=&TIPO=O&IP='+basePC.IP,
					'',
					'left=0,top=0,directories=no,titlebar=no,toolbar=no,location=no,status=yes,menubar=no,scrollbars=yes,resizable=no,fullscreen=yes'
				);
		}

};

var NS_CACHED_DATA = {

	load:function(pStatementName,pKeyJs,pKeyCampo){

		var rs = top.executeQuery("cached_data.xml",pStatementName,[]);
		
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
