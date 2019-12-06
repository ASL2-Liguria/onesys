// ************* FUNCTION IntercettaTasti
function intercetta_tasti(){
	 if (window.event.keyCode==13){
		 window.event.returnValue=false;
		 // lancio la ricerca
		 document.frmRefStd.pulsantePremuto.value="btFind";
		 ricerca();		 
	 }
}



function initGlobalObject(){
	fillLabels(arrayLabelName,arrayLabelValue);
	ricercaDiretta();
	document.frmMain.txtChiave.focus();	
}

// function che controlla formato chiave
// nel caso di ricerca multipla
function controllaChiaveMultipla(){
	var chiave = document.frmMain.txtChiave.value;
	var posizioneMarker;
	
	if (controllaChiave()==true){
		posizioneMarker = chiave.indexOf(",");
		if (posizioneMarker<0)
		{
			alert(ritornaJsMsg("jsmsg2"))
			return false;
		}
		posizioneMarker = chiave.indexOf(";");
		if (posizioneMarker>-1)
		{
			alert(ritornaJsMsg("jsmsg3"))		
			return false;
		}
		return true;
	}
	else{
		return false;
	}		
}


// function che controlla formato chiave
function controllaChiave(){
	var chiave = document.frmMain.txtChiave.value;
	var posizioneMarker;

	
	if (chiave.length < 1)
	{
		alert(ritornaJsMsg("jsmsg1"))
		
		document.frmMain.txtChiave.focus();
		return false;
	}
	
	return true;
}

// ricerca tramite chiave di ricerca
function ricerca(){
	
	document.frmMain.txtChiave.value = document.frmMain.txtChiave.value.toUpperCase();
	if (controllaChiave()==true){
		document.frmRefStd.codEsa.value = document.frmMain.txtChiave.value;
		ricercaDiretta();
	}
}

// ricerca di chiave multipla
function multiRicerca(){
	var codici=""
	var regEx = /\,/g;	
	
	if (controllaChiaveMultipla()==true){
		codici = document.frmMain.txtChiave.value;
		//codici = codici.replace(",","*");
		codici = codici.replace(regEx,"*");
		document.frmRefStd.codEsa.value = codici;
		ricercaDiretta();
	}
}

// ricerco direttamente
// dato che ho già i campi cod_esa riempiti
function ricercaDiretta(){
	if (document.frmRefStd.codEsa.value !=""){
		document.frmRefStd.submit();
	}
	
}

// funzione che importa il testo
// del singolo referto standard nel controllo
function importa(){
	var testo ="";
	
	try{
		if (parent.frameBottomRefStd.document.frmMain.txtRefStd=="[object]"){
			testo = parent.frameBottomRefStd.document.frmMain.txtRefStd.value;
		}
		pasteTesto(testo);
		chiudi();
	}
	catch(e){
		alert(ritornaJsMsg("jsmsg4"));
		return;
	}
}

// funzione che importa testo
// passato per parametro nel controllo attivo
function pasteTesto(myTesto){
	top.opener.pasteText(myTesto);
}


function chiudi(){
	top.close();
}