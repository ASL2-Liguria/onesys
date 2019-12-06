function gestione_filtri()
{	
	var webuser = stringa_codici(utenti);
	if(webuser == '')
	{
		alert(ritornaJsMsg('esegui_1'));
		return;
	}
	else
	{
		var win = window.open('', 'winGestioneFiltri','width=1000, height=600, status=yes, top=0,left=0');
		document.form_gestione_filtri.webuser.value = webuser;
		document.form_gestione_filtri.submit();
	}
}
	
	
	