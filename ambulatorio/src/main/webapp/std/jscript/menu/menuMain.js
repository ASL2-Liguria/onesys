
var handle_polaris_windows;
var titoloPolarisToFind = "Polaris";
//variabile che 
var startInitTabulator="";


// *****************
var mTimer;






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


function initGlobalObject(){
	chiudiHomepage();
	initbaseGlobal();
	initbaseUser();
	initbasePC();	
	
	/*if(baseUser.PERSONALCSS == 'design2010'){
		frameOpen = 180;
	
		var righe_frame = parent.workFrame.document.all.oFramesetWorklist.rows;
		vettore = righe_frame.split(',');
		var info_ref = vettore[3];
		parent.workFrame.document.all.oFramesetWorklist.rows = '180,0,*,' + info_ref;
	}*/
	
	//	Notifica nuove "Richieste modifica"
	if (baseUser.RICH_MOD_NOTIFICHE.toString() == "S"){
		addMsgRichMod();
		document.body.onunload = function(){try{clearInterval(timerRichMod);}catch(e){;}};	
		startCheckRichMod();
	}
	
	
	creaBoxInfoUtente();
}

/********************************************************************************************/
/*	TIMER PER NOTIFICA NUOVE RICHIESTE MODIFICA												*/
/********************************************************************************************/
	// timeout per check Nuove Richieste Modifica
	var timeoutToCheckNewRichMod = 1000;
	var timerRichMod;
	
	
	//	timeoutToCheckNewRichMod indica ogni quanti ms viene ripetuta la funzione checkNewRichMod
	function startCheckRichMod(){
		timerRichMod = setTimeout("checkNewRichMod()",timeoutToCheckNewRichMod);	
	}

	function checkNewRichMod(){
		var sql = "";
		var nRichMod = 0;
		
		sql = "select * from radsql.view_richieste_modifica_utente where username = '"+baseUser.LOGIN+"'";			
		
		getXMLData("",parseSql(sql),"checkNewRichModCallBack_1");
	}

	function checkNewRichModCallBack_1(xmlDoc){
		var rowTagObj;
		var bolNuoveRichMod =false;
	
		if (xmlDoc){
			rowTagObj = xmlDoc.getElementsByTagName("ROW");
			nRichMod = rowTagObj.length;
		}
		sql = "select * from radsql.view_richieste_modifica_admin where username = '"+baseUser.LOGIN+"'";		
		getXMLData("",parseSql(sql),"checkNewRichModCallBack_2");
	}
	
	function checkNewRichModCallBack_2(xmlDoc){
		var rowTagObj;
		var bolNuoveRichMod =false;
	
		clearInterval(timerRichMod);
		if (xmlDoc){
			rowTagObj = xmlDoc.getElementsByTagName("ROW");
			if (rowTagObj){
				nRichMod += rowTagObj.length;
				
				if(nRichMod != 0) document.getElementById("msgRichMod").innerHTML = "<a href='#' onclick=\"javascript:apriWkRichAssist('console_admin');\" style=\"background:url('imagexPix/RichiesteModifica/warning.png') no-repeat top left ; display:inline;padding: 0 0 0px 30px;height:18px;line-height:18px;margin:0;text-decoration:underline;\" title=\"Vai alla Console di Gestione Richieste Modifica\">(" + nRichMod + ")</a> |";
				else document.getElementById("msgRichMod").innerHTML = "";
			}
			else{
				bolNuoveRichMod = false;
			}			
		}
		timeoutToCheckNewRichMod = 600000;
		startCheckRichMod();
	}
	
	function apriWkRichAssist (value){
		try{
			top.leftFrame.apri(value);
		}
		catch(e){
			alert("apriWkRichAssist - Error: " + e.description);
		}
	}
	
	
	/*	Aggiunge uno span per eventuali messaggi di nuove Richieste Modifica	*/
	function addMsgRichMod(){
		var container = document.getElementById('barMenuMain');
		var new_element = document.createElement('span');
		new_element.setAttribute("id","msgRichMod");
		new_element.innerHTML = "";
		container.insertBefore(new_element, container.firstChild);
	}
/********************************************************************************************/
/*	FINE TIMER PER CONTROLLO NUOVE RICHIESTE MODIFICA										*/
/********************************************************************************************/




// funzione per il cambio login
function cambiaLogin(){
	parent.hideFrame.changeLogin = "S";
	top.location.replace ("unloadSession?changeLogin=S");
	try{
		top.opener = null;
	}
	catch(e){
		;
	}
	//alert(homepage);
	var winOpen = window.open("","nuovaFinestra","top=0,left=0,height=" + screen.availHeight + ", width=" + screen.availWidth);
	if (winOpen){
		winOpen.focus();
	}
	else{
		winOpen = window.open("","nuovaFinestra","top=0,left=0,height=" + screen.availHeight + ", width=" + screen.availWidth);
	}
	
	winOpen.location.replace (homepage);
}


// lock workstation
function lockWorkstation(){
	
}

function unlockWorkstation(){
	
	
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
/*		strHndConsolePolaris = parent.hideFrame.clsKillHome.getHandle(strObjectToRaise, true)
		returnValue = parent.hideFrame.clsKillHome.HideWindow("", strHndConsolePolaris, true)
		returnValue = parent.hideFrame.clsKillHome.HideWindow("", strHndConsolePolaris, false)*/
	}
	catch(e){
		alert("in menuMain mainsetConsoleOnTop Error on object: "+ e.description);
	}

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
