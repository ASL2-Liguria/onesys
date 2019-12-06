// JavaScript Document
function caricaOnTop(){

	var localHref = "errorMsg";
	var topHref = top.document.location.href;
	var openerHref =  "";
	var esisteOpener = false;
	
	var parametri = "";
	
	

	if (ricarica=="N"){
		return;
	}
	// controllo se sono in una finestra aperta
	try{
		if (opener=="[object]")
			esisteOpener = true;
		}
	catch(e){
		esisteOpener = false;
	}
	//
	parametri = "?errore=" + errore + "&ricarica=N";			
	if (esisteOpener){
		// chiudo finestra locale
		top.close();
		// carico errore in opener.top
		opener.top.document.location.replace(localHref + parametri);
	}
	else{
		if (topHref.lastIndexOf(localHref)==-1){
			top.document.location.replace(localHref + parametri);
		}
	}
}



function initGlobalObject(){
	
	try{
		if (varCaricaOnTop=="S"){
			caricaOnTop();
		}
	}
	catch(e){
			;
	}
	try{
		fillLabels(arrayLabelName,arrayLabelValue);
	}
	catch(e){
		initLabelErroreConfigurazione();
	}
}

function initLabelErroreConfigurazione(){
	
	// modificare in modo
	// tale che sia in base alla lingua
	// aggiungere variabile js per la lingua di default
	// in quanto se si chiama
	// questa funzione vuol dire che 
	// non è stato ancora creato l'utente
	try{
	document.all.lblConfigError.innerText = "Sistema non correttamente configurato. Contattare il fornitore del prodotto riportando il codice seguente: ";
	}
	catch(e){
		;
	}
}