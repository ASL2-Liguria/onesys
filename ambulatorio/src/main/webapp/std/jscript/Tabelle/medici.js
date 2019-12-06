/*
	Questo file è comune a tutte e 3 le tabelle del personale:
	MEDICI
	OPERATORI
	TECNICI-INFERMIERI e 
	PROVENIENZE
	Tale file è contenuto in imago.Tabelle.utilTabelle.java che effettua la gestione dei 
	centri_di_costo
*/

var reg = false;


function cod_regionale()
{
	document.form_medico.cod_reg.value = document.form_medico.cod_reg.value.toUpperCase();
}

function codice_fiscale()
{
	if(document.form_medico.cod_fisc.value.length < 16 && document.form_medico.cod_fisc.value != '')
	{
		alert(ritornaJsMsg('alert_cod_fisc'));
		document.form_medico.cod_fisc.value = '';
		document.form_medico.cod_fisc.focus();
	}
	else
		document.form_medico.cod_fisc.value = document.form_medico.cod_fisc.value.toUpperCase();
}



function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}

function funzione()
{
	document.form_medico.cod_dec.value = '';
	document.form_medico.cod_dec.focus();
}


function salva()
{
	reg = true;
	var mancano = '';
	doc = document.form_medico;
	
	if(doc.medico[0].checked == 1)
		doc.htipologia.value = 'R';
	if(doc.medico[1].checked == 1)
		doc.htipologia.value = 'I';
	if(doc.medico[2].checked == 1)
	   doc.htipologia.value = 'P';
	if(doc.medico[3].checked == 1)
		doc.htipologia.value = 'A';
	if(doc.medico[4].checked == 1)
		doc.htipologia.value = 'S';
		
	var gestione_cdc = filtro_cdc();
	if(gestione_cdc)
		doc.idenCampi.value = getAllOptionCode('selCampiDx');
	else
		doc.idenCampi.value = 'NO GESTIONE CDC';	
	
	if(doc.cod_dec.value=='' || doc.titolo.value == '' || doc.nome.value == '' || doc.cognome.value == '' ||
	   doc.htipologia.value == '' || doc.idenCampi.value == '')
	{
		if (doc.cod_dec.value=='')
		{
			mancano += '- Codifica\n';
		}
		
		if (doc.titolo.value == ''){
			mancano += '- Titolo\n';
		}
		
		if (doc.nome.value == ''){
			mancano += '- Nome\n';
		}
		
		if (doc.cognome.value == ''){
			mancano += '- Cognome\n';
		}

		if(doc.htipologia.value == ''){
			mancano += '- Tipologia del medico\n';
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

	if(doc.medico_reparto.checked == 1)
		doc.hmedico_reparto.value = 'S';
	else
		doc.hmedico_reparto.value = 'N';
	
	if (doc.attivo.checked==1) 
		doc.hattivo.value = 'N';
	else
		doc.hattivo.value = 'S';
	
	doc.registrazione.value = reg;
	doc.submit(); 
	alert(ritornaJsMsg('a4'));//Registrazione Effettuata
	
	chiudi_ins_mod_tab_per(document.form_medico);

}