function initGlobalObject(){

	addAlternateColor();	
	// controllo se è stata richiesta la ricerca multipla
	// in tal caso devo caricare automaticamente il testo
	if (bolRicercaMultipla){
		parent.frameTopRefStd.pasteTesto(testoMultiplo);
		parent.frameTopRefStd.chiudi();
	}

}

function caricaRefertoStd(){
	
	var codEsa ="";
	var idenMedR = "";
	var iden_refstd = "";
	if (vettore_indici_sel.length){
		// ci sono elementi selezionati
		codEsa = array_cod_esa[vettore_indici_sel[0]];
		idenMedR = array_iden_medr[vettore_indici_sel[0]];
		iden_refstd = array_iden_refstd[vettore_indici_sel[0]];
		if (parseInt(idenMedR)>0){
			document.frmRefStd.idenMedR.value = idenMedR;
		}
		else{
			document.frmRefStd.idenMedR.value = "";
		}
		// ho sempre un solo un elemento selezionato
		document.frmRefStd.codEsa.value = codEsa;
		document.frmRefStd.iden_refstd.value = iden_refstd;
		document.frmRefStd.submit();
	}
	else{
		resettaBottomFrame();
	}
}

function resettaBottomFrame(){
	parent.frameBottomRefStd.document.location.replace ("blank.htm");
}