var oldSizeConsoleBottomFrame = "";
var bolConsoleBottomFrameOpened = false;

var dimensioniNuovoLayoutRiccio = "*,35";

window.onload = function startup(){try{initGlobalObject();}catch(e){;}};

function initGlobalObject(){
	try{
		window.onunload = function scaricaFrameset(){scarica();};
	}
	catch(e){
		alert("initGlobalObject - consolleInizio. Error: " + e.description);
	}
}


// funzione
// che chiude
// la finestra di attesa
function chiudi_attesa(){
// controllo che se il record è 
	// bloccato devo chiudere l'eventuale
	// finestra di attesa
	try{
		if (bolRecordLocked){
			opener.top.home.chiudi_attesa();
		}
	}
	catch(e){
		;
	}
}


//aggiorno il chiamante
function scarica(){
	try{
		// GESTIONE BOOLEAN CONSOLE		
		try{
			opener.top.hideFrame.bolOpenedConsole = false;
		}
		catch(e){
		}		
		if (opener){
			try{opener.aggiorna();}catch(e){alert('Opener non esiste!!!');}
		}
	}
	catch(e){
		;
	}
}

