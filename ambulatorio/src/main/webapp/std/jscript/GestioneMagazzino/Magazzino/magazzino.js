function chiudi(pagina_da_vis)
{
	var pagina = 1;
	if(pagina_da_vis != 1)
		pagina = opener.document.form_ric_maga.pagina_da_vis.value;
	
	opener.parent.RicercaMagazzinoFrame.ricerca(pagina);
	self.close();
}

function chiudi_ins_mod()
{
	opener.parent.RicercaMagazzinoFrame.document.form_ric_maga.descr_maga.value = document.form_mg_mag.descr.value;
	chiudi(1);
}
            
function registra()
{
	var doc = document.form_mg_mag;
	var mancano = '';
	
	if(doc.cod_magazzino.value == '' || doc.descr.value == '')
	{
		if(doc.cod_magazzino.value == '')
		{
			/*alert(ritornaJsMsg('empty_value_cod_magazzino'));
			document.form_mg_mag.cod_magazzino.focus();
			return;*/
			mancano = '- CODICE\n';
		 }
		if(doc.descr.value == '')
		{
			/*alert(ritornaJsMsg('empty_value_descr'));
			document.form_mg_mag.descr.focus();
			return;*/
			mancano += '- DESCRIZIONE\n';
		}
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	}
		
	if(doc.scarico_per_accettazione.checked == 1)
		doc.hscarico_per_accettazione.value = 'S';
	else
		doc.hscarico_per_accettazione.value = 'N';
		
	doc.nome_campi.value = 'cod_magazzino*descr*note*scarico_per_accettazione';
	doc.request.value = 'cod_magazzino*descr*note*hscarico_per_accettazione';
	doc.tipo_campo_db.value = 'S*S*S*S';
	
	doc.submit();
	
	alert(ritornaJsMsg('registrazione'));//Registrazione effettuata
	
	chiudi_ins_mod();
	
	CJsCheck = null;		
}
            
function controlla_cod_magazzino()
{
	dwr.engine.setAsync(false);
	CJsCheck.esistenzaCodice("cod_magazzino@mg_magazzini@cod_magazzino = '" + document.form_mg_mag.cod_magazzino.value.toUpperCase() + "'", cbkCodice);			
	dwr.engine.setAsync(true);
}

/*
	0: record inesistente
	1: record esistente
	errore
*/
function cbkCodice(message)
{
	if(message == '1')
	{
		alert(ritornaJsMsg('record_esistente'));//Il codice magazzino è già presente nel db.Prego, modificare il campo
		document.form_mg_mag.cod_magazzino.value = '';
		document.form_mg_mag.cod_magazzino.focus();
		return;
	}
	else
		if(message != '0')
			{
				alert(message);//errore
				document.form_mg_mag.cod_magazzino.value = '';
				return;
			}
	//CJsCheck = null;		
}