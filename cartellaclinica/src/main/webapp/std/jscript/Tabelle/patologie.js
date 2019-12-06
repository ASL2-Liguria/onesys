function registra()
{
	var doc = document.form_patologie;
	
	if(doc.cod_patologia.value == '')
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
		
	doc.action = 'SL_TabPatologie';
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
	document.form_patologie.cod_patologia.value = '';
	document.form_patologie.cod_patologia.focus();
}


function chiudi_ins_mod()
{
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCR')
		campo_descr = document.form_patologie.descr.value;
    else
		campo_descr = document.form_patologie.cod_patologia.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();
}