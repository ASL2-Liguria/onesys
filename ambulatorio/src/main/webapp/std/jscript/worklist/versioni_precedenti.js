function versioni_precedenti()
{
	var iden_ref = '';
	var iden_anga = '';
	if (conta_esami_sel() == 0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (conta_esami_sel() > 1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}
	
	/*Per visualizzare le versioni precedenti dei referti l'esame deve essere associato ad un referto validato
	ovvero il campo REFERTO.firmato = 'S'*/
	var firmato = stringa_codici(array_firmato);
	if(firmato != 'S'){
		alert(ritornaJsMsg("referto_non_firmato"));
		return;
	}
	var reparto = stringa_codici(array_reparto);
	
	if(baseUser.LISTAREPARTI.toString().indexOf(reparto)<1) 
	{
		alert('Utente non abilitato alla visualizzazione');
		return;
	}
	iden_ref = stringa_codici(array_iden_ref);
	iden_anag = stringa_codici(array_iden_anag);
	//parent.document.location.replace("SL_VersioniPrecedentiFrameset?iden_ref="+iden_ref+"&sorgente="+document.frmAggiorna.sorgente.value+"&iden_anag="+iden_anag);
	
	win_versioni_pecedenti = window.open("SL_VersioniPrecedentiFrameset?iden_ref="+iden_ref+"&sorgente="+document.frmAggiorna.sorgente.value+"&iden_anag="+iden_anag, '','width=1000, height=680, status=yes, top=0,left=0');
	
}

