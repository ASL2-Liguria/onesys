var reg = false;

function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}

function funzione()
{
	document.form_operatore.cod_dec.value = '';
	document.form_operatore.cod_dec.focus();
}

function codice_fiscale()
{
	if(document.form_operatore.cod_fisc.value.length < 16 && document.form_operatore.cod_fisc.value != '')
	{
		alert(ritornaJsMsg('alert_cod_fisc'));
		document.form_operatore.cod_fisc.value = '';
		document.form_operatore.cod_fisc.focus();
	}
	else
		document.form_operatore.cod_fisc.value = document.form_operatore.cod_fisc.value.toUpperCase();
}

function salva()
{
	reg = true;
	doc=document.form_operatore;
	var mancano = '';
	
	var gestione_cdc = filtro_cdc();
	if(gestione_cdc)
		doc.idenCampi.value = getAllOptionCode('selCampiDx');
	else
		doc.idenCampi.value = 'NO GESTIONE CDC';
	
	
	if(doc.cod_dec.value=='' || doc.titolo.value=='' || doc.nome.value=='' || doc.cognome.value=='' || doc.idenCampi.value == '')
	{
		if (doc.cod_dec.value==''){
			mancano += '- Codifica\n';
		}
		if (doc.titolo.value==''){
		    mancano += '- Titolo\n';
		}
		
		if (doc.nome.value==''){
			mancano += '- Nome\n';
		}
		if (doc.cognome.value==''){
			mancano += '- Cognome\n';
		}
		
		if(gestione_cdc)
		{
			if(doc.idenCampi.value == '')
			{
				 mancano += '- Almeno un centro di costo\n';
			}
		}
		
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	}
	
	if(!gestione_cdc)
		doc.idenCampi.value = '';
	
	if (doc.attivo.checked==1) 
		doc.hattivo.value='N';
	else
		doc.hattivo.value='S';
	
	
	doc.registrazione.value = reg;
	doc.submit(); 
	alert(ritornaJsMsg('a4'));
	
	chiudi_ins_mod_tab_per(document.form_operatore);

}