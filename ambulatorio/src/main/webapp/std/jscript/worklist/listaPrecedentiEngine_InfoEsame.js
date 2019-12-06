
function initGlobalObject(){
	try{utilCreaBoxAttesa();}catch(e){;}
	try{utilMostraBoxAttesa(true,"");}catch(e){;}
	// se non è caricata Lingue va in errore
	try{
		fillLabels(arrayLabelName,arrayLabelValue);
	}
	catch(e){
		;
	}
	try{
		// chiamo funzione presente in infoRefertoEngine.js		
		initBaseClass();
	}
	catch(e){
		;
	}	
	try{
		// chiamo funzione presente in infoRefertoEngine.js
		createMaximizeTabulator();
	}
	catch(e){;}
	// mettere controllo se abilitato il salvataggio
	// , con clausola try/catch, 
	// mettere creazione riga appesa alla tabella idTableDetail
	// o tabella a parte

	// richiamo funzione in infoRefertoEngine.js
	/*try{
		creaRadioButtonValutazione();
		caricaValoreRadioValutazione();
	}
	catch(e){
		alert("Impossibile creare pulsante per radioButton. " + e.description);
	}*/
	finally{
		try{utilMostraBoxAttesa(false);}catch(e){;}
	}
	try{
		creaPulsanteRegistrazione();
	}
	catch(e){
		alert("Impossibile creare pulsante per registrare. " + e.description);
	}
	finally{
		try{utilMostraBoxAttesa(false);}catch(e){;}
	}

}

function caricaValoreRadioValutazione()
{
	dwr.engine.setAsync(false);
	sql= 'select nvl(max(valutazione),0) aa from ESAMI_VALUTAZIONE where iden_esame='+ document.frmAggiorna.idenEsame.value;
	toolKitDB.getResultData(sql, popola_radio);

	dwr.engine.setAsync(true);
}

function popola_radio(val)
{

	setCheckedValue(document.all.radValutazione,val)
}

function setCheckedValue(radioObj, newValue) {
	if(!radioObj)
		return;
	var radioLength = radioObj.length;
	if(radioLength == undefined) {
		radioObj.checked = (radioObj.value == newValue.toString());
		return;
	}
	for(var i = 0; i < radioLength; i++) {
		radioObj[i].checked = false;
		if(radioObj[i].value == newValue.toString()) {
			radioObj[i].checked = true;
		}
	}
}


function caricaInfoReferto(){
	try{
		document.frmInfoReferto.submit();
	}
	catch(e){
		;
	}
}
