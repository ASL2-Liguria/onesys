// JavaScript Document
function stampaReferto(valore){
	try{
		var stringa_stato_S = stringa_codici(array_stato);
		var controllaStato
		controllaStato=stringa_stato_S.indexOf("S")
		if ((controllaStato>0)&&(baseGlobal.DISABLEPRINTIFPENDING=="S")){
			alert(ritornaJsMsg("jsNoPrintIfPending"));
			return;			
		}
		var tipoStampa="";
		var stringa_iden_ref = "";
		
		if (valore==""){
			tipoStampa = "STAMPA";
		}
		else{
			tipoStampa = valore;
		}
		if (conta_esami_sel()==0){
			alert(ritornaJsMsg("jsmsg1"));
			return;
		}
		if (conta_esami_sel()>1){
			alert(ritornaJsMsg("jsmsgSoloUnEsame"));
			return;
		}
		// controllare se è stato almeno refertato
		// controllo se sono stati refertati
	
		stringa_iden_ref = stringa_codici(array_iden_ref);
		stringa_iden_ref = stringa_iden_ref.toString();
		stringa_iden_ref = stringa_iden_ref.replace("-1","");
	
		stringa_iden_ref = stringa_iden_ref.replace("*","");
		if(stringa_iden_ref==""){
			alert(ritornaJsMsg("jsmsgNonRefertato"));
			return;
		}
						   
		if (tipoStampa=="STAMPA"){
				document.frmStampa.stampaAnteprima.value = "N";
		}
		else{
				document.frmStampa.stampaAnteprima.value = "S";
			
		}
		// setto funzione di stampa
		document.frmStampa.stampaFunzioneStampa.value = "REFERTO_STD";
		document.frmStampa.stampaIdenEsame.value = stringa_codici(array_iden_esame);
		// inizializzare il reparto
		document.frmStampa.stampaReparto.value  = stringa_codici(array_reparto_referti);
		// *******************
		var wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
		if (wndPreviewPrint){
			wndPreviewPrint.focus();
		}
		else{
			wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
		}
		document.frmStampa.submit();
	}
	catch(e){
		alert("stampaReferto - Error: " + e.description);
	}
}


// funzione che stampa
// le etichette dell'esame
function stampaEtiEsame(){

	
	var stringa_iden_esame ="";
	
	if (conta_esami_sel()==0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	stringa_iden_esame = stringa_codici(array_iden_esame);
	// controllo reparto diverso
	if (!checkRepartoDiversi(stringa_iden_esame)){
		// problemi
		alert(ritornaJsMsg("jsmsgRepartoDiverso"));
		return;		
	}
	// controllo accettazioni diverse
	if (!checkEsamiAccettazioneDiverse(stringa_iden_esame)){
		alert(ritornaJsMsg("jsmsgErrAccDiv"));
		return;
	}	
	if(baseGlobal.STAMPA_ETICHETTE_PRENOTAZIONE=="N")
	{
		statoA=(array_stato[vettore_indici_sel[0]]).indexOf("A")
		if (statoA==-1){
			alert("jsmsgToAccept");
			return;
		}
	}
// setto funzione di stampa
	document.frmStampa.stampaFunzioneStampa.value = "ETICHETTE_STD";
	document.frmStampa.stampaAnteprima.value = "N"
	// inizializzo codici esami
	document.frmStampa.stampaIdenEsame.value = stringa_codici(array_iden_esame);
	// inizializzo codicea nag
	document.frmStampa.stampaIdenAnag.value = array_iden_anag[vettore_indici_sel[0]];
	// inizializzare il reparto
	document.frmStampa.stampaReparto.value  = array_reparto[vettore_indici_sel[0]];
	var wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (wndPreviewPrint){
		wndPreviewPrint.focus();
	}
	else{
		wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	document.frmStampa.submit();	
}


// funzione che stampa
// le etichette dell'anagrafica
function stampaEtiAnag(){
	
	var stringa_iden_esame ="";
	
	if (conta_esami_sel()!=1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}	
	// setto funzione di stampa
	document.frmStampa.stampaFunzioneStampa.value = "ETIPAZIENTE_STD";
	document.frmStampa.stampaAnteprima.value = "N"
	// inizializzo codici anag      
	document.frmStampa.stampaIdenAnag.value = stringa_codici(array_iden_anag);
	// inizializzare il reparto
	document.frmStampa.stampaReparto.value  = stringa_codici(array_reparto);
	var wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (wndPreviewPrint){
		wndPreviewPrint.focus();
	}
	else{
		wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	document.frmStampa.submit();	
}

// funzione che stampa
// la lista di lavoro
function stampaListaLavoro(){
	var wndWorkListPrint = window.open("ServletLL","wndWorkListPrint","top=0,left=0,width="+ screen.availWidth +",height=" + screen.availHeight +",status=yes,scrollbars=yes");
	if (wndWorkListPrint){
		wndWorkListPrint.focus();
	}
	else{
		wndWorkListPrint = window.open("ServletLL","wndWorkListPrint","top=0,left=0,width="+ screen.availWidth +",height=" + screen.availHeight +",status=yes,scrollbars=yes");
	}
}
function stampa_ticket(){
	if (conta_esami_sel()== 0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (conta_esami_sel() > 1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}
	
	
	var iden_esame = stringa_codici(array_iden_esame);
	var reparto = stringa_codici(array_reparto);
	//alert(iden_esame);
	//alert(reparto);
    var finestra = finestra = window.open('elabStampa?stampaFunzioneStampa=TICKET_STD&stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + '&stampaAnteprima=S'+"","","top=0,left=0");
	
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open('elabStampa?stampaFunzioneStampa=TICKET_STD&stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + '&stampaAnteprima=S'+"","","top=1000000,left=1000000");
	}
	
}

function stampaEsec(){
	if (conta_esami_sel()== 0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (conta_esami_sel() > 1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}
	
	
	var iden_esame = stringa_codici(array_iden_esame);
	var reparto = stringa_codici(array_reparto);
	//alert(iden_esame);
	//alert(reparto);
    var finestra = finestra = window.open('elabStampa?stampaFunzioneStampa=SCHEDA_ESEC_STD&stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + '&stampaAnteprima=S'+"","","top=0,left=0");
	
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open('elabStampa?stampaFunzioneStampa=SCHEDA_ESEC_STD&stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + '&stampaAnteprima=S'+"","","top=0,left=0");
	}
}
	function stampaConsInf(){
	if (conta_esami_sel()== 0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (conta_esami_sel() > 1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}
	
	
	var iden_esame = stringa_codici(array_iden_esame);
	var reparto = stringa_codici(array_reparto);
	
    var finestra = finestra = window.open('SL_ModuloMain?stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + "","","top=0,left=0,height=260,width=430");
	
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open('SL_ModuloMain?stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + "","","top=0,left=0,height=260,width=430");
	}
	
}