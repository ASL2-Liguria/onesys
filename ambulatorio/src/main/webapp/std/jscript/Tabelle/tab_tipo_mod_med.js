function registra()
{
	var doc = document.form_tab_tipo_mod_med;
	
	if(opener.document.form.procedura.value == 'T_TAB_TIPO_MOD_MED_A')
		doc.tipo.value = 'A';
	else
		if(opener.document.form.procedura.value == 'T_TAB_TIPO_MOD_MED_M')
			doc.tipo.value = 'M';
		else
			doc.tipo.value = 'P';
	
	
	if(doc.codice.value == '')
	{
		alert(ritornaJsMsg('alert_codice')); 
		return;		
	}
	
	if(doc.attivo.checked)
		doc.hattivo.value = 'N';
	else
		doc.hattivo.value = 'S';
		
	doc.registra.value = 'S';
	
	if(doc.hiden.value == '')
		doc.operazione.value = 'INS';
	else
		doc.operazione.value = 'UPD';
		
	doc.action = 'SL_TabTipoModMed';
	doc.method = 'POST';
	doc.targer = '_self';
	
	doc.submit();	
	
	chiudi_ins_mod();
}


function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}


/*
	Funzione richiamata dalla funzione di callback del dwr (cbkJsCheck())
	contenuta nel file check.js
*/
function funzione()
{
	document.form_tab_tipo_mod_med.codice.value = '';
	document.form_tab_tipo_mod_med.codice.focus();
}


function chiudi_ins_mod(){
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCR')
		campo_descr = document.form_tab_tipo_mod_med.descr.value;
    else
		campo_descr = document.form_tab_tipo_mod_med.codice.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();
}