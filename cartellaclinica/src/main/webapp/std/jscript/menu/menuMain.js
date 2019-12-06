var applicativo = "";
var hlinguettaMenuVerticale = 'none';

var pacsType ;
var handle_polaris_windows;
var titoloPolarisToFind = "Polaris";
//variabile che
var startInitTabulator="";

// funzione che chiude
// la pagina iniziale di login
function chiudiHomepage(){
	try{
		top.opener.chiudiHomepage();
	}
	catch(e){
		;
	}
}

/*function chiudiWhale()
{
	var connection = top.getAbsolutePath();
	connection	   = connection.substr(0,connection.length-1);
	connection	   = connection.substr(0,connection.lastIndexOf("/",0)+1);
	top.closeWhale.chiudiWhale()
//	top.CloseWindowsOpened();
	top.close();
}*/


function initGlobalObject(){
	chiudiHomepage();
	initbaseGlobal();
	initbaseUser();
	initbasePC();
/*lino - funzione di inizializzazione della applet per il controllo della chiusura con javascript*/
	if (baseGlobal.SITO!='ASL5'){
		initAppletLogout();		
	}	
	
	if(baseUser.LOGIN=='fra')
		document.getElementById('msgBacheca').innerHTML = '<a href="javascript:window.showModalDialog(\'visto.gif\',null,\'dialogWidth:150px;dialogHeight:150px;\')" title="Per contattare l\'assistenza">Help | </a>';


	creaBoxInfoUtente();
}


// funzione per il cambio login
function cambiaLogin(){
	
	parent.hideFrame.changeLogin = "S";
	top.location.replace ("unloadSession?changeLogin=S");
	var winOpen = window.open("","nuovaFinestra","top=0,left=0,height=" + screen.availHeight + ", width=" + screen.availWidth);
	
	if (winOpen){
		winOpen.focus();
	}else{
		winOpen = window.open("","nuovaFinestra","top=0,left=0,height=" + screen.availHeight + ", width=" + screen.availWidth);
	}
	var homepageJS = top.getAbsolutePath();
	homepageJS = homepageJS.substr(0,homepageJS.length-1);
	homepageJS = homepageJS.substr(0,homepageJS.lastIndexOf('/')+1);
	
	try{
		top.opener.closeHomepage();
		winOpen.location.replace (homepageJS+'unisys');
	}catch(e){
		winOpen.location.replace (homepageJS+'whale');				
	}
}


function tornaMenu(){
	try{
		top.opener.location.reload();
		parent.hideFrame.changeLogin = "S";
		top.location.replace ("unloadSession?changeLogin=S");
	}catch(e){
		alert('Funzionalità non disponibile')
	}
	
	/*var winOpen = window.open("","nuovaFinestra","top=0,left=0,height=" + screen.availHeight + ", width=" + screen.availWidth);
	
	if (winOpen){
		winOpen.focus();
	}else{
		winOpen = window.open("","nuovaFinestra","top=0,left=0,height=" + screen.availHeight + ", width=" + screen.availWidth);
	}

	var homepageJS = top.getAbsolutePath();
	homepageJS = homepageJS.substr(0,homepageJS.length-1);
	homepageJS = homepageJS.substr(0,homepageJS.lastIndexOf('/')+1);
	winOpen.location.replace (homepageJS+'unisys/menu_principale');*/
}



// lock workstation
function lockWorkstation(){

	var argsVariable;
	var i = 0;
	var lista_handle;
	var handleResponse;

	pacsType = parent.hideFrame.objectSyncPacs;
	if (pacsType!=""){
		parent.hideFrame.sendToPacs("LOCKWORKSTATION",parent.hideFrame.objectSyncPacs,"","");
	}
	// trova la lista degli handle
	handle_polaris_windows = clsKillHome.getHandle(titoloPolarisToFind, true);
	lista_handle = handle_polaris_windows.split("*");
	// *****
	for (i=0;i<lista_handle.length;i++){
		handleResponse = clsKillHome.hideWindow("",lista_handle[i],true);
	}

	var answer = window.showModalDialog("bolwincheckuser",argsVariable,"dialogWidth:380px; dialogHeight:200px; center:yes");
	if (answer==true){
		// autenticazione corretta
		unlockWorkstation();
	}
	else{
		unlockWorkstation();
		cambiaLogin();
	}

}

function unlockWorkstation(){

	var lista_handle;
	var i = 0;
	var handleResponse;

	try{
		lista_handle = handle_polaris_windows.split("*");
		for (i=0;i<lista_handle.length;i++){
			handleResponse = clsKillHome.hideWindow("",lista_handle[i],false);
		}
		handle_polaris_windows="";
		if (pacsType!=""){
			parent.hideFrame.sendToPacs("UNLOCKWORKSTATION",parent.hideFrame.objectSyncPacs,"","");
		}
	}
	catch(e){
		alert("unlockWorkstation -" + e.description);
		handle_polaris_windows = "";
	}
}


function getStartInitTabulator(){
	return startInitTabulator;
}

function resetStartInitTabulator(){
	startInitTabulator = "";
}


// funzione che mette on top una finestra
function setConsoleOnTop(){
	// faccio retrieve del nome della consolle
	//  che DEVE essere definito nell'opener
	var strObjectToRaise = "";
	var strHndConsolePolaris;
	var returnValue;

	try{
		if (opener){
			strObjectToRaise = opener.framesetTitleConsolePolaris;
		}
	}
	catch(e){
		//alert("Error: " +e.description);
	}
	if (strObjectToRaise==""){
		strObjectToRaise = "Polaris";
	}
	try{
		// ATTENZIONE da rivedere
		return;
		strHndConsolePolaris = clsKillHome.getHandle(strObjectToRaise, true);
		returnValue = clsKillHome.HideWindow("", strHndConsolePolaris, true);
		returnValue = clsKillHome.HideWindow("", strHndConsolePolaris, false);
	}
	catch(e){
		alert("in menuMain mainsetConsoleOnTop Error on object: "+ e.description);
	}

}



/**
*/
function invio_gestioneRichieste(){
	var pagina = '';
	var inner = '';

	if(baseUser.MENUONSTARTUP == 'GESTIONE_RICHIESTE'){
		applicativo = 'INVIO_RICHIESTE';
		pagina = 'worklistRicoverati';
		inner = 'Ambulatorio/<font style="color=yellow">Reparto</font>';
	}
	else{
		applicativo = 'GESTIONE_RICHIESTE';
		pagina = 'worklist';
		inner = '<font style="color=yellow">Ambulatorio</font>/Reparto';
	}

	document.all.linkSwitch.innerHTML = inner;

	baseUser.MENUONSTARTUP = applicativo;

	if(top.statoFrame == "aperto"){
		hlinguettaMenuVerticale = 'block';
	}
	if(top.statoFrame == "chiuso"){
		hlinguettaMenuVerticale = 'none';
	}

	top.leftFrame.location.replace("menuVerticalMenu?applicativo=" + applicativo + "&hlinguettaMenuVerticale="+hlinguettaMenuVerticale);

	top.leftFrame.apri(pagina);

}


function gestioneProfiliWk(profilo){
	
	if (typeof profilo == 'undefined'){
	
			profilo = 'REPARTO';		
	}

	url = 'servletGenerator?KEY_LEGAME=FILTRO_WK_RICOVERATI';
	url+= '&MODALITA_ACCESS0='+profilo.toString();

	top.mainFrame.workFrame.document.location.replace(url);
	
}


function creaBoxInfoUtente(){
	var oggetto;
	try{
		oggetto = document.createElement("SPAN");
		oggetto.id = "idSPANinfoUtente";
		oggetto.innerHTML = "<font color='white'>User: </font>" + baseUser.LOGIN +" - "+ baseUser.DESCRIPTION + " <font color='white'> - ip: </font>" + basePC.IP;
		oggetto.title = "User: " + baseUser.LOGIN +" - "+ baseUser.DESCRIPTION + " - ip: " + basePC.IP;
		document.body.appendChild(oggetto);
	
	}
	catch(e){
		alert("creaBoxInfoUtente - Error: " + e.description);
	}
}




