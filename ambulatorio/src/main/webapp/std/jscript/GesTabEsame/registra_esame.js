var bolCallServletCalled = false;

function chiudi_registrazione()
{
	try{
		//alert(opener.location.href);
		opener.aggiorna();
	}
	catch(e){
		alert("chiudi_registrazione - error: " + e.description);
	}
	finally{
		try{self.close();}catch(e){;}
	}
}

function ritorna_prenotazione()
{
	document.registrazione.action = 'prenotazioneInizio';
	document.registrazione.submit();
}

function call_servlet(servlet)
{
	try{
		servlet = servlet.replace(/&stampaIdenEsame=&stampaReparto=/g,"&stampaIdenEsame=" + s_iden + "&stampaReparto=");
		
	//	alert(	alert(opener.name));
	//	alert(opener.top.home.getConfigParam("SITO"));return;
	//	alert("eval "  + servlet.substring(11));
		eval(servlet.substring(11));
	}
	catch(e){
		alert(e.description + "\n" + servlet);
	}
	// ambulatorio
	// attenzione
	// non considero più la stampa, x ora
	
	//call_servlet("javascript:opener.worklist_esami(639860);document.location.replace("elabStampa?stampaFunzioneStampa=ETICHETTE_STD&stampaIdenEsame=&stampaReparto=AMB&stampaAnteprima=N&stampaIdenAnag=639860");");
	// *****************
	servlet = servlet.replace(/&stampaIdenEsame=&stampaReparto=/g,"&stampaIdenEsame=" + s_iden + "&stampaReparto=");
	bolCallServletCalled = true;
	document.location.replace(servlet);
}

function call_servlet_dema(idenEsami,reparto,idenAnag,stampato)
{
	if (idenEsami=="") idenEsami = s_iden;
	var iden=idenEsami.split('*')[0];
	var sf = "{Query.IDEN} = " + iden;
	urlStampa = 'elabStampa?stampaFunzioneStampa=PRESTAZIONI_DEMA&stampaSelection=' + sf + '&stampaAnteprima=N';
	var finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open(urlStampa,'','top=100000,left=100000, width=' + screen.availWidth+', height=' + screen.availHeight);
	}		
		// verifica se serve questo setting
	bolCallServletCalled = true;	
	if (stampato=="S"){
		alert("test manutenzione - Stampa etichette ");
		document.location.replace('elabStampa?stampaFunzioneStampa=ETICHETTE_STD&stampaIdenEsame=' + idenEsami + '&stampaReparto=' + reparto + '&stampaAnteprima=N'+ '&stampaIdenAnag='+idenAnag);
	}
	else{
		chiudi_registrazione()
	}
}
