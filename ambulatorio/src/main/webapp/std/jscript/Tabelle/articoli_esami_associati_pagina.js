function chiudi(){
	//parent.opener.location.replace('Manu_Tab');
	parent.opener.aggiorna_worklist();
	parent.close();
}

function cancellazione(){
	var iden_mat_esa = stringa_codici(iden);
    if(iden_mat_esa != ''){
    	document.form_esa_art.iden_mat_esa_canc.value = iden_mat_esa;
        document.form_esa_art.submit();
    }
    else
	{
    	alert(ritornaJsMsg('selezione'));
        return;
    }
}