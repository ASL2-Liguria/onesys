// per la SCANDB
// setto di defalut S
var enableAlternateColors='S';
var oldCampoRicerca = "";

// JavaScript Document
function initGlobalObject(){
	var oggetto;
	// ***
	initbaseGlobal();
	initbaseUser();
	initbasePC();
	fillLabels(arrayLabelName,arrayLabelValue);
	// sposta 
	initPositionDimension();
	// setta la posizione e diminesione
	document.frmricerca.ricerca.focus();
	// controllo se esiste un solo elemento 
	// lo seleziono in automatico
	if (array_codici.length==1){
		illumina(1);
		ricerca();
	}
	try{
		// E' stato commentato
		// perchè interferisce con la generazione
		// degli eventi che si ha sul campo textbox
		// di ricerca: dopo il primo invio non viene
		// + generato l'evento keypress se non cliccando
		// manualmente all'interno del campo
		//setPage(document); 
	}
	catch(e){
		return;
	}
	addAlternateColor();
	
}

// funzione che setta dimensione e posizione
function initPositionDimension(){
	window.moveTo(winpos_left, winpos_top);
	window.resizeTo(winpos_width, winpos_height);
}


// funzione CHIUDI
function chiudi(){
	 top.close();
}



// funzione CERCA
function cerca(){
	var nuovoValore 
	
  	 nuovoValore = document.frmricerca.ricerca.value.toString();
	 if (oldCampoRicerca==""){
		 // aggiorno il primo 
		 oldCampoRicerca = nuovoValore;
	 }
	 if (oldCampoRicerca.toString().toUpperCase() != nuovoValore.toString().toUpperCase()){
		 oldCampoRicerca = nuovoValore;
		 // resetto pagina 
		 // nel caso in cui la nuova ricerca producesse un numero di pagine differenti (minore)
		 document.frmricerca.numpagina.value=1;
	 }
	 document.frmricerca.ricerca.value = document.frmricerca.ricerca.value.toUpperCase();
	 document.frmricerca.myric.value = document.frmricerca.ricerca.value;
	 document.frmricerca.action = window.location.pathname;
	 document.frmricerca.submit();
}


// funzione INTERCETTA_TASTI
function intercetta_tasti(){
 if (window.event.keyCode==13){
	 window.event.returnValue=false;
	 cerca();
}
}


// funzione CAMBIA PAGINA
function cambia_pagina(valore){
 if (valore==""){
	 return;
 }
 document.frmricerca.numpagina.value=valore;
 cerca();
}



// funzione CAMBIA ORDINE
function cambia_ordine(valore){
 if (valore==""){
	 return;
 }
 document.frmricerca.ordinecampo.value=valore;
// sul cambio ordine resetto anche la pagina
 document.frmricerca.numpagina.value=1;
 cerca();
}



// funzione FILTRA_CDC
function filtracdc(){
	if (document.frmricerca.filtro_cdc_attivo.value=="S"){
		document.frmricerca.filtro_cdc_attivo.value="N";
	}
	else{
		document.frmricerca.filtro_cdc_attivo.value="S";
	}
	cerca();
}
         
// funzione che 
// passa i codici della riga selezionata al chiamante
function ricerca(){
	var funzioneRicerca = "";
	var chiaveRicerca = array_codici[vettore_indici_sel[0]-1];

	var vettore
	var i =0;
	
	vettore = chiaveRicerca.split("@");

	funzioneRicerca = ""

	for (i=0; i < vettore.length;i++){
		tmp = vettore[i].toString();
		if (funzioneRicerca==""){
			funzioneRicerca = "\"" + tmp.substr(1, tmp.length-2) + "\"";
		}
		else{
			funzioneRicerca = funzioneRicerca + " , \"" + tmp.substr(1, tmp.length-2) + "\"";
		}
	}
	funzioneRicerca = "seleziona(" + funzioneRicerca + ")";
	eval(funzioneRicerca);
}