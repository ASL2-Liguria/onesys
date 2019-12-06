// JavaScript Document
// funzione
// di startup


function initGlobalObject(){
	fillLabels(arrayLabelName,arrayLabelValue);
	addAlternateColor();
	initLabelWk();
	closeWaitWindow();
	try{
		JSFX_FloatTopDiv();

	}
	catch(e){
		// nessun menu floating
		;
	}	
}


function closeWaitWindow(){
	top.home.chiudi_attesa();	
}

function loadWaitWindow(){
	top.home.apri_attesa();
}

// in base all'utente scelto
// completa il titolo della worklist
function initLabelWk(){
	var oggetto;
	
	oggetto = document.getElementById("lbltitolo");
	if (oggetto){
		oggetto.innerText = oggetto.innerText + defaultUser;
	}
}
