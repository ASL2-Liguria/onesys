
		
function initGlobalObject(){
	window.onunload = function scaricaFrameset(){scarica();};
	initbaseGlobal();
	initbaseUser();
	initbasePC();	
}

// funzione chiamata
// sull'unload del frameset
function scarica(){
	if(opener){
		opener.aggiorna();
	}
}	
