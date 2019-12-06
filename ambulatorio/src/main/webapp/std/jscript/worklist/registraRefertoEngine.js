
// funzione che viene chiamata dopo la registrazione
// del referto
function dopoRegistrazione(){
	var puntoChiamato = "0";
//	alert("idenRef:" + idenRef);
	//alert("sorgente:" + sorgente);
	//alert("actionAfterSave:" + actionAfterSave);
	// aggiorno iden del referto
	try{	
		var puntoChiamato = "0";
		if(sorgente=="consolle"){
			var puntoChiamato = "1";
			opener.document.frmMain.HIDEN_REF.value = idenRef;
			var puntoChiamato = "2";		
			opener.classReferto.IDEN = idenRef;
			var puntoChiamato = "3";
			// aggiorno modalità
			opener.tipoModalita = "MODIFICA";
			var puntoChiamato = "4";			
			// controllo se devo fare altre
			// operazione dopo il salvataggio
			// tipo:definitivo, stampa..
			opener.afterSave(actionAfterSave);
			var puntoChiamato = "5";			
		}
		var puntoChiamato = "6";		
		top.close();
		var puntoChiamato = "7";
	}
	catch(e){
		alert("Error " + puntoChiamato + " - Opener is null - " + e.description);
		top.close();		
	}
	finally{
		// 20090828
		try{opener.mostraBoxAttesa(false);}catch(e){;}
		// ***********		
	}
}



function initGlobalObject(){
	try{
		eval(functionToCall);
	}
	catch(e){
		alert("Error calling: " + functionToCall + " - " + e.description);
	}
		
}