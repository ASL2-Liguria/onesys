function gestione_personale_sala() {
	var url='ServletTabPerSal?IDEN_SAL=';
	
	var iden_sal = new String(stringa_codici(iden));
	
	if (iden_sal && iden_sal != '' && iden_sal.indexOf('*') < 0) {
		url=url + '' + iden_sal;
		var finestra = window.open(url,"wndGestioneTabPerSal","status=0,scrollbars=1,menubar=0,height=600,width=800,top=50,left=50");
		if (finestra){
			finestra.focus();
		}
		else{
			finestra = window.open(url,"wndGestioneTabPerSal","status=0,scrollbars=1,menubar=0,height=600,width=800,top=50,left=50");
		}
	} else {
		alert('Selezionare una (e una sola) sala');
	}
}