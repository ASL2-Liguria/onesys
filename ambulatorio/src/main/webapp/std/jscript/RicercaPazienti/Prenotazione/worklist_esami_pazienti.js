/*
Funzione richiamata dalla Ricerca Pazienti in Prenotazione premendo il menu Visualizza Esami
*/
function worklist_esami_da_prenotazione()
{
	var doc = document.form_esami_paziente;
	
	doc.target = 'RicPazWorklistFrame';//RicPazRecordFrame
	
	iden_anag = stringa_codici(iden);
	
	if(iden_anag == '' || iden_anag == 'undefined')
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}
	
	doc.hidWhere.value = ' where iden_anag = ' + iden_anag;//  + ' order by dat_esa'; 

	doc.submit();
}


