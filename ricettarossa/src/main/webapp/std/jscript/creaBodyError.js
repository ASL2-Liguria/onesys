
// file js che gestisce l'errore js 
// che si viene a creare nei precontrolli 
// tipicamente nei salvataggi

function showErrore(){
	if (structErroreControllo.STRJSMSGERR!=""){
		alert(ritornaJsMsg(structErroreControllo.STRJSMSGERR));
	}
	else{
		alert(structErroreControllo.STRDESCRERRORE);
	}
}

// funzione
// di startup
function initGlobalObject(valore){
	initstructErroreControllo();
	showErrore();
	if (valore!=""){
		try{
			eval(valore)
		}
		catch(e){
		}
		
	}
	top.close();
}



// funzione
// che chiude
// la finestra di attesa
function chiudi_attesa(){
// controllo che se il record è 
	// bloccato devo chiudere l'eventuale
	// finestra di attesa
	try{
		opener.top.hideFrame.chiudi_attesa();
	}
	catch(e){
		;
	}
}


