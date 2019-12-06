function richiedi_consulenza(iden_esame) {
	var url='RichiesteConsulenza?IDEN_ESAME=';
	
	var vettore_eseguito;
	var vettore_refertato;
	
	var stringa_iden_esame;
	if (iden_esame) {
		stringa_iden_esame = iden_esame;
		vettore_eseguito = '1';
	} else {
		stringa_iden_esame = stringa_codici(array_iden_esame);
		vettore_eseguito = stringa_codici(array_eseguito);
		vettore_refertato = stringa_codici(array_iden_ref); /* eventualmente array_firmato */

		if (stringa_iden_esame.indexOf('*') > -1) {
			alert('Selezionare un solo esame');
			return;
		}
		if (vettore_eseguito.indexOf('0') > -1) {
			alert('Selezionare solo esami eseguiti');
			return;
		}
		if (vettore_refertato != 'undefined' && vettore_refertato != null && vettore_refertato.length > 0) {
			alert('Impossibile fare richieste di teleconsulto per esami refertati');
			return;
		}
	}
	
	if (stringa_iden_esame && stringa_iden_esame != '') {

		try {
			stringa_iden_esame=stringa_iden_esame.replace(/\*/g, ",");
		} catch (e) {};
		
		url=url+stringa_iden_esame;
		var finestra = window.open(url,"wndRichiesteConsulenza","status=0,scrollbars=1,menubar=0,height=600,width=800,top=50,left=50");
		if (finestra){
			finestra.focus();
		}
		else{
			finestra = window.open(url,"wndRichiesteConsulenza","status=0,scrollbars=1,menubar=0,height=600,width=800,top=50,left=50");
		}
	} else {
		alert('Selezionare un esame');
	}
}