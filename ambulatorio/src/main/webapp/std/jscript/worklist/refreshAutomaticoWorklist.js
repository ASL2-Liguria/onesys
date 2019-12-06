// JavaScript Document
// NB considero baseUser.WORKLIST_REFRESH
// espresso in secondi
var timerRefreshAutomaticoWorklist
var segnalazioneVariazioneGiaAttiva = false;

function attivaRefreshAutomaticoWorklist(){
	
	var intervallo
	
	try{
		intervallo = parseInt(baseUser.WORKLIST_REFRESH)*1000*60;
	}
	catch(e){
		alert("attivaRefreshAutomaticoWorklist - " + e.description);
	}
	creaLayerNotificaVariazione	();
	timerRefreshAutomaticoWorklist = setInterval("callCheckUpdatedDataWk()",intervallo);
}

// crea e appende
// al documento il layer 
// di notifica variazione
// NB linkare anche il file css che 
// lo gestisca
function creaLayerNotificaVariazione(){
	
	var refreshDiv
	var textRefreshDiv
	var textCloseDiv
	var idLinkClose

	textRefreshDiv = document.createElement("div");
	textRefreshDiv.id = "idTestoRefreshWk";
	textRefreshDiv.innerHTML = ritornaJsMsg("jsmsgUpdatedData");
	
	
	// layer chiusura
	idCloseText = document.createElement("div");
	idCloseText.id = "idCloseText";
	
	idLinkClose = document.createElement("A");
	idLinkClose.href = "javascript:nascondiLivelloRefresh();";
	idLinkClose.innerHTML = ritornaJsMsg("jsmsgCloseWarning");
	idCloseText.appendChild(idLinkClose);

	
	// ******
	
	refreshDiv = document.createElement("div");
	// set div attributes 
//	refreshDiv.className = "x";
	refreshDiv.id = "idRefreshWk";
	refreshDiv.appendChild(textRefreshDiv);
	refreshDiv.appendChild(idCloseText);
	

	document.body.appendChild(refreshDiv);	// or some other node
	
}

// ****************************************
// *********** AJAX ***********************

function callCheckUpdatedDataWk(){

	if (segnalazioneVariazioneGiaAttiva){
		return;
	}
	try{
		ajaxCheckUpdatedDataWk.ajaxCheckUpdate(nRigheWorklist,sqlWorklist,replyCheckUpdatedDataWk);
	}
	catch(e){
		alert("callCheckUpdatedDataWk - " + e.description);
	}
}

var replyCheckUpdatedDataWk = function(returnValue){
	var strOutput = "";
	var winSound
	
	if(returnValue){
		// cancello timer
//		clearTimeout(timerRefreshAutomaticoWorklist);		
		segnalazioneVariazioneGiaAttiva = true;
		if (basePC.ALEUS_PLAYSOUND=="S"){
			winSound = window.open('','suono','left=60,top=60,width=1,height=1,menubar=no,status=no,location=no,toolbar=no,scrollbars=no');	
			try{
				if (winSound){
					strOutput = "<html>";
					strOutput += "<head>";
					strOutput += "<title>suono</title>";
					strOutput += "</head>";
					strOutput += "<body TOPMARGIN=0 LEFTMARGIN=0 MARGINHEIGHT=0 MARGINWIDTH=0>";
					strOutput += "<bgsound volume='0' src='sounds/tada.wav' id=music loop=1 autostart='true'>";
					strOutput += "<script type='text/javascript'>";
					strOutput += "setTimeout('chiudi()', 1000);";
					strOutput += "function chiudi(){self.close();}";
					strOutput += "</script>";
					strOutput += "</body>";
					strOutput += "</html>";
					winSound.document.write(strOutput);
				}
			}
			catch(e){
				alert("replyCheckUpdatedDataWk - error: " +  e.description);
			}
	
		}
		// mostro livello
		ShowLayer("idRefreshWk");
	}
	else{
		//alert("NESSUNA variazione");
	}
}
// ****************************************

function nascondiLivelloRefresh(){
	HideLayer('idRefreshWk');
	segnalazioneVariazioneGiaAttiva = false;
}