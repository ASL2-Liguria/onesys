//ex worklist_esami_pazienti
function worklist_esami_da_prenotazione()
{
	var doc = document.form_esami_paziente;
	
	doc.target = 'RicPazRecordFrame';
	
	iden_anag = stringa_codici(iden);
	if(iden_anag == '' || iden_anag == 'undefined')
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}
	
	doc.hidWhere.value = ' where iden_anag = ' + iden_anag;//  + ' order by dat_esa'; 

	doc.submit();
}


