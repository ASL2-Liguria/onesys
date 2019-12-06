function apri_richiesta_modifica(parametri,indice) {
//if(baseUser.RICH_MOD_INSERIMENTO=='S')
//{
	var url='servletGenerator?KEY_LEGAME=GESTIONE_RICHIESTA_MODIFICA';
	
	if (parametri) {
		url=url + '&' + parametri;
	}
	
	var iden_richiesta='';
	var iden_esame='';
	var iden_anag='';
	
	if (typeof(indice) == 'undefined') {
		if (typeof(array_iden_richiesta) != 'undefined') {
			iden_richiesta = '&IDEN_RICHIESTA=' + stringa_codici(array_iden_richiesta);
		}
		
		if (typeof(array_iden_esame) != 'undefined') {
			iden_esame = '&IDEN_ESAME=' + stringa_codici(array_iden_esame);
		}
		if (typeof(array_iden_anag) != 'undefined') {
			iden_anag = '&IDEN_ANAG=' + stringa_codici(array_iden_anag);
		}
	} else {
		if (typeof(array_iden_richiesta) != 'undefined') {
			iden_richiesta = '&IDEN_RICHIESTA=' + array_iden_richiesta[indice];
		}
		
		if (typeof(array_iden_esame) != 'undefined') {
			iden_esame = '&IDEN_ESAME=' + array_iden_esame[indice];
		}
		if (typeof(array_iden_anag) != 'undefined') {
			iden_anag = '&IDEN_ANAG=' + array_iden_anag[indice];
		}
	}
	
	url=url + iden_esame + iden_anag + iden_richiesta;
	
	var finestra = window.open(url,"wndRichiestaModifica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	if (finestra) {
		finestra.focus();
	} else {
		finestra = window.open(url,"wndRichiestaModifica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	}
	
	return finestra;
//}
//else{
	//alert('Utente non Abilitato')
}
//}