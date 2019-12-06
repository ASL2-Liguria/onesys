
function inserisci(){
	
	var url='servletGenerator?KEY_LEGAME='+document.EXTERN.TIPO.value+'&ID_REMOTO='+parent.document.EXTERN.PATID.value+'&STATO=INS&IDEN=';
//	alert(url);
	window.open(url,'','fullscreen=no resizable=yes status=no scrollbars=yes width=1300 heigth=800');

}

function modifica(){
	
	//alert(stringa_codici(array_iden));
	if (stringa_codici(array_iden) == ''){
		alert('Selezionare una riga');
		return;	
	}
	
	var url='servletGenerator?KEY_LEGAME='+document.EXTERN.TIPO.value+'&ID_REMOTO='+parent.document.EXTERN.PATID.value+'&STATO=MOD&IDEN='+stringa_codici(array_iden);
	//alert(url);
	window.open(url,'','fullscreen=yes resizable=yes status=no scrollbars=yes');

}

function visualizza(){
	
	if (stringa_codici(array_iden) == ''){
		alert('Selezionare una riga');
		return;	
	}
	
	var url='servletGenerator?KEY_LEGAME='+document.EXTERN.TIPO.value+'&ID_REMOTO='+parent.document.EXTERN.PATID.value+'&STATO=VIS&IDEN='+stringa_codici(array_iden);
	//alert(url);
	window.open(url,'','fullscreen=yes resizable=yes status=no scrollbars=yes');

}

function cancella(){

	if (stringa_codici(array_iden) == ''){
		alert('Selezionare una riga');
		return;	
	}
	
	var iden=stringa_codici(array_iden);
	var sql = 'update radsql.TAB_SAVE_IPCCC set deleted = \'S\' where iden = '+ iden ;
	//alert(sql);return;
	
	if (confirm('Si vuole cancellare la riga selezionata?')){
		
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(sql);	
		dwr.engine.setAsync(true);

	}else{
		//alert('cancellazione annullata');
	}
	
	//ricarico la wk... così, se anche scelgono no, sparisce il menu contestuale e si può reinserire un intervento...
	var tipo='';
	// alert(document.EXTERN.TIPO.value)
	if (document.EXTERN.TIPO.value == 'PAG_INS_DIAGNOSI_IPCCC'){
		tipo='DIAGNOSI';
	}else if(document.EXTERN.TIPO.value == 'PAG_INS_INTERVENTI_IPCCC'){
		tipo='INTERVENTI';
	}

	var where1="where PATID=\'"+parent.document.EXTERN.PATID.value+"\' AND TIPO_IPCCC=\'"+tipo+"\'";
	var url='servletGenerator?KEY_LEGAME=WK_IPCCC&WHERE_WK='+where1+'&TIPO='+document.EXTERN.TIPO.value;
	// alert(url);
	document.location.replace(url);
		
}




