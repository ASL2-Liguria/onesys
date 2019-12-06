// titolo del frameset della console
var framesetTitleConsolePolaris = "_Console";
var toolBarTitle = "_Toolbar";
var timerToolBar ;
var delaySetToolBarOnTop = 10000;
var handleToolbar



// indicano se l'utente
// ha effettuato un cambio login da homepage
var afterChangePwd_vecchiaPwd = "";
var afterChangePwd_cambioPwd = "";

// indica l'ultimo accNum aperto;
var lastAccessionNumberOpened = "";
// parametro usato dopo la registrazione
// del referto per passare DISMISS o CONFIRM
var actionAfterSaveReport="";



var hnd_attesa
// indica se è stato premuto il 
// tasto di cambia login
var changeLogin = "N";

// variabili per gestione 
// finestra temporizzata
var handleTimeoutWindow
var timerTimeoutWindow
// ******************************

var timerCheckDrivePcEvent
var timeoutToCheckDrivePcEvent = 2000;

// GESTIONE BOOLEAN CONSOLE
// variabile usata per sapere se la console è aperta
var bolOpenedConsole = false;

function initTimerAccordingToConfiguration(){
	try{
		timeoutToCheckDrivePcEvent = parseInt(basePC.TIMER_DRIVEPC);
	}
	catch(e){
		alert("initTimerAccordingToConfiguration - " + e.description);
	}
}


// funzione 
// che apre la finestra di attesa
// utile per i lunghi caricamenti
function apri_attesa()
{
	try{
		altezza = screen.height
		largh = screen.width
		if(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1)
		{
			//IE 7...
			hnd_attesa = window.open("classAttesa","wnd_attesa","left=" + (largh/2-80)+ " ,top=" + (altezza/2-35) +",width=240,height=70,statusbar=no")
		}
		else
		{
			//IE 6 in giù...
			hnd_attesa = window.open("classAttesa","wnd_attesa","left=" + (largh/2-80)+ " ,top=" + (altezza/2-35) +",width=260,height=70,statusbar=no")
		}	
	}
	catch(e){
		//alert("apri_attesa - Error: " + e.description);
	}
	
	

}


// funzione 
// che chiude la finestra di attesa
// utile per i lunghi caricamenti
function chiudi_attesa()
{
	try{
		if (hnd_attesa)
		{
			hnd_attesa.close();
		}
	}
	catch(e){
	}
}



// funzione che ritorna 
// l'ip del client
function getIPclient(){
	try{
		if (baseGlobal.USAOCXKILLHOME=="S"){		
			if (document.all.clsKillHome){
				return document.all.clsKillHome.getIpAddress();
			}
			else{return "";}
		}
		else{
			if (clsKillHomeJsObject){
				return clsKillHomeJsObject.getIpAddress();
			}
			else{return "";}			
		}
	}
	catch(e){
		alert("getIPclient - Error: " + e.description);
	}
}

// funzione che ritorna
// l'host name del client
function getHostNameClient(){
	try{
		if (baseGlobal.USAOCXKILLHOME=="S"){				
			return document.all.clsKillHome.getHostName(getIPclient());
		}
		else{
			return clsKillHomeJsObject.getHostName();
		}
	}
	catch(e){
		alert("getHostNameClient - Error: " + e.description);
	}
}


function initGlobalObject(){
	window.onunload = function scaricaTutto(){scarica();};
	initbaseGlobal();
	initbasePC();
	initbaseUser();
	fillLabels(arrayLabelName,arrayLabelValue);
	initTimerAccordingToConfiguration();	
	 afterChangePwd_vecchiaPwd = top.vecchiaPwd;
	 afterChangePwd_cambioPwd = top.cambioPwd;
	startTimerToCheckDrivePcEvent();
}



// *********************




// funzione
// chiamata sull unload del frame
function scarica(){
	
	var finestraUnloadSession = window.open("unloadSession?changeLogin=" + changeLogin ,"wndUnloadSession","top=10000,left=10000,width=300,height=300");
	if(finestraUnloadSession){
		try{
			finestraUnloadSession.focus();
		}
		catch(e){
			return;
		}
	}
	else{
		finestraUnloadSession = window.open("unloadSession?changeLogin=" + changeLogin,"wndUnloadSession","top=10000,left=10000,width=300,height=300");
	}
	changeLogin = "N";
	try{	
		ajaxPcManage = null;
	}
	catch(e){;}	
}


// funzione che mette on top una finestra
function setConsoleOnTop(windowTitle){
	// faccio retrieve del nome della consolle
	//  che DEVE essere definito nell'opener
	var strHndConsolePolaris;
	var returnValue;
	
	if (windowTitle==""){return;}
	// ATTENZIONE è da RIVEDERE !!
	return ; 
	try{
	 	if (baseGlobal.USAOCXKILLHOME=="S"){
			strHndConsolePolaris = document.all.clsKillHome.getHandle(windowTitle, true);
			returnValue = document.all.clsKillHome.HideWindow("", strHndConsolePolaris, true);
			returnValue = document.all.clsKillHome.HideWindow("", strHndConsolePolaris, false);
		}
		else{
			strHndConsolePolaris = clsKillHomeJsObject.getHandle(windowTitle, true);
			returnValue = clsKillHomeJsObject.HideWindow("", strHndConsolePolaris, true);
			returnValue = clsKillHomeJsObject.HideWindow("", strHndConsolePolaris, false);			
		}
	}
	catch(e){
		alert("setConsoleOnTop - Error on object: "+ e.description);
	}
}





function functionHandleTimeoutWindow(){
	try{
		clearTimeout(timerTimeoutWindow);
		if (handleTimeoutWindow){
			handleTimeoutWindow.close();
		}
	}
	catch(e){
		alert("handleTimeoutWindow "+ e.description);
	}
}


// funzione che crea al volo una finestra
// di notifica info temporizzata, ed eventuale setOnTop rispetto
// le altre
function showTimeoutWindow(larghezza, altezza, titoloFinestra, testo, nTimeout, bolSetOnTop ){
	var parametri = "";
	var strDiv = "";
	var larghezzaDefault = "400";
	var larg
	var altezzaDefault = "150";
	var alt
	
	if (larghezza.toString()==""){
		larg = larghezzaDefault
	}
	else{
		larg = larghezza.toString();
	}
	if (altezza.toString()==""){
		alt = altezzaDefault
	}
	else{
		alt = altezza.toString();
	}
	try{
		parametri = "height=" + alt + "px, width=" + larg +"px, scrollbars=no, status=no ";
		handleTimeoutWindow = window.open("","", parametri);
		strDiv  = "<style type='text/css'>body{margin:0px 0px 0px 0px;}</style>";
		strDiv += "<div style='" ;
		strDiv += "width:" + larg + "px ; height:" + alt +"px; overflow:auto;padding: 4px;  border:1px solid #EEE;border-right:0 solid; background:url(imagexPix/button/gradient/gradient.png) repeat-x fixed top left; text-align:center;";
	//	strDiv += "left:" + (parseInt(screen.availWidth/2) - (parseInt(larg/2))) + "px; top:" + (parseInt(screen.availHeight/2) - (parseInt(alt/2))) + "px;";
		strDiv += "' >" 
		strDiv += testo + "</div>";
		handleTimeoutWindow.document.writeln(strDiv);
		handleTimeoutWindow.document.title = titoloFinestra ;
		handleTimeoutWindow.moveTo((parseInt(screen.availWidth/2) - (parseInt(larg/2))),(parseInt(screen.availHeight/2) - (parseInt(alt/2))) );
		if ((bolSetOnTop)&&(titoloFinestra!="")){
			setConsoleOnTop(titoloFinestra);
		}
		timerTimeoutWindow = window.setTimeout("functionHandleTimeoutWindow()",nTimeout);
	}
	catch(e){
		alert("showTimeoutWindow " + e.description);
	}
}


// ******************************************************
// ******************** polling su drive_pc *************
function checkNewDrivePcEvent(){
	// basePC
	var sql = "";
	
	sql = "select * from imagoweb.drive_pc where ip='" + basePC.IP + "' and letto='0' order by iden asc"
	getXMLData("",parseSql(sql),"callbackCheckNewDrivePcEvent");
//	timerCheckDrivePcEvent
	
}

function callbackCheckNewDrivePcEvent(xmlDoc){
	
	var idenEvent = "";
	
	try{
		clearTimeout(timerCheckDrivePcEvent);
	}
	catch(e){;}
	idenEvent = getTagXmlValue(xmlDoc, "IDEN");
	if ((idenEvent=="")||(idenEvent == null)||(idenEvent == "undefined")){
		startTimerToCheckDrivePcEvent();
		return;
	}
	// riempio oggetto JSon
	objDrivePc.drivePcObj[0].iden = idenEvent;
	objDrivePc.drivePcObj[0].ip = getTagXmlValue(xmlDoc, "IP");
	objDrivePc.drivePcObj[0].iden_anag = getTagXmlValue(xmlDoc, "IDEN_ANAG");
	objDrivePc.drivePcObj[0].iden_esame = getTagXmlValue(xmlDoc, "IDEN_ESAME");
	objDrivePc.drivePcObj[0].iden_ref = getTagXmlValue(xmlDoc, "IDEN_REF");	
	objDrivePc.drivePcObj[0].procedura = getTagXmlValue(xmlDoc, "PROCEDURA");	
	objDrivePc.drivePcObj[0].utente_chiamante = getTagXmlValue(xmlDoc, "UTENTE_CHIAMANTE");	
	objDrivePc.drivePcObj[0].ip_chiamante = getTagXmlValue(xmlDoc, "IP_CHIAMANTE");
	objDrivePc.drivePcObj[0].parametri = getTagXmlValue(xmlDoc, "PARAMETRI");	
	// setto a letto
	callDrivePc_setEventAsRead();
}


function callDrivePc_setEventAsRead(){
	try{
		ajaxPcManage.ajaxDrivePc_setEventAsRead(objDrivePc.drivePcObj[0].iden,replyDrivePc_setEventAsRead);
	}
	catch(e){
		alert("callDrivePc_setEventAsRead - " + e.description);
	}
}

replyDrivePc_setEventAsRead = function(returnValue){
	if (returnValue){
		evalDrivePcEvent();
		startTimerToCheckDrivePcEvent();		
	}
}

// fa partire controllo per
// eventi per pilotare il pc
function startTimerToCheckDrivePcEvent(){
	try{
		if (parseInt(timeoutToCheckDrivePcEvent)==0){return;}
	}
	catch(e){return;}
	try{
		timerCheckDrivePcEvent = setTimeout("checkNewDrivePcEvent()",timeoutToCheckDrivePcEvent);
	}
	catch(e){
		alert("startTimerToCheckDrivePcEvent - " + e.description);
	}
}

// parserizza gli eventi
// DEVO prevedere il passaggio di un parametro
// alla servlet dei filtri per BYPASSARE 
// i filtri classici
function evalDrivePcEvent(){
	
	var idenEvento = "";
	var pageToLoad = "";
	var lista ;
	var parametri = "";
	var whatToDo = "";
	
	idenEvento = objDrivePc.drivePcObj[0].iden;
	// compongo la stringa da richiamre nel frame principale
	pageToLoad = "worklistInizio";
	pageToLoad += "?whereForDriving=where iden_anag=" + objDrivePc.drivePcObj[0].iden_anag.toString().split("*")[0];
	pageToLoad += " AND iden=" + objDrivePc.drivePcObj[0].iden_esame.toString().split("*")[0];
	parametri = objDrivePc.drivePcObj[0].parametri;
	try{
		switch(objDrivePc.drivePcObj[0].procedura){
			case "ALERT":
					if (parametri==""){
						return;
					}
					whatToDo = "alert('" + parametri + "');"
					callDrivePc_setEventAsExecuted(idenEvento,whatToDo);					
					break;			
			case "CMD":
				try{
					if (parametri==""){
						return;
					}
					if (baseGlobal.USAOCXKILLHOME=="S"){					
						whatToDo = "document.all.clsKillHome.openShell('" + parametri + "');"
					}
					else{
						whatToDo = "clsKillHomeJsObject.openShell('" + parametri + "');"
					}
					callDrivePc_setEventAsExecuted(idenEvento,whatToDo);					
					break;
				}
				catch(e){;}
			case "SHOW_TIMEOUT_WINDOW":
				if (parametri==""){
					return;
				}			
				try{
					whatToDo = "showTimeoutWindow('',''" ;
					whatToDo += ", '" + parametri.split("*")[0] + "', ";
					whatToDo += "'" + parametri.split("*")[1] + "', ";					
					whatToDo += "'" + parametri.split("*")[2] + "', ";										
					whatToDo += "'" + parametri.split("*")[3] + "') ";										
					callDrivePc_setEventAsExecuted(idenEvento,whatToDo);					
					break;
				}
				catch(e){
					;
				}			
				break;
			case "WK_AMB_REFERTAZIONE":
				// devo caricare la worklist
				// WK_AMB_REFERTAZIONE passando l'iden_esame
				// quindi selezionare il record
				// infine 
				parent.top.leftFrame.verticalMenu_drivePc(pageToLoad);
				break;
			case "CONSOLE":
				parent.top.leftFrame.verticalMenu_drivePc(pageToLoad);
				break;
			case "QUIT":
				// chiudo tutto 
				callDrivePc_setEventAsExecuted(idenEvento,"top.close()");				
				break;
			default:
				break;
		}
	}
	catch(e){
		alert("HideIntegrazioni.evalDrivePcEvent - " + e.description);
	}
}
// ******************************************************
// ******************************************************




