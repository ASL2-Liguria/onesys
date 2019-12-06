var reg = false;

function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}

function funzione()
{
	var doc = document.form_prov;

	doc.cod_dec.value = '';
	doc.cod_dec.focus();
}


function salva()
{
	reg = true;
	var mancano = '';
	doc=document.form_prov;
	
	if(doc.tipologia[0].checked == 1)
		doc.htipologia.value = 'I';
	if(doc.tipologia[1].checked == 1)
		doc.htipologia.value = 'E';
	if(doc.tipologia[2].checked == 1)
		doc.htipologia.value = 'P';
	if(doc.tipologia[3].checked == 1)
		doc.htipologia.value = 'O';
	if(doc.tipologia[4].checked == 1)
		doc.htipologia.value = 'L';

	var gestione_cdc = filtro_cdc();
	if(gestione_cdc)
		document.form_prov.idenCampi.value = getAllOptionCode('selCampiDx');
	else
		document.form_prov.idenCampi.value = 'NO GESTIONE CDC';
		
	if(doc.cod_dec.value == '' || doc.descr.value == '' || isNaN(doc.num_cop.value) || doc.htipologia.value == ''
	   || document.form_prov.idenCampi.value == '')
	{
		if (doc.cod_dec.value == '')
		{
			mancano += '- Codifica\n';
		}
		
		if (doc.descr.value == '')
		{
			mancano += '- Descrizione\n';
		}
		
		if (isNaN(doc.num_cop.value))
		{
			doc.num_cop.value = '';
			mancano += '- Numero copie referto(valore numerico)\n';
		}
		
		if(doc.htipologia.value == '')
		{
			mancano += '- Tipologia\n';
		}
		
		if(gestione_cdc)
		{
			if(document.form_prov.idenCampi.value == '')
			{
				 mancano += '- Almeno un centro di costo\n';
			}
		}
		
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
		
	}

	if(!gestione_cdc)
		document.form_prov.idenCampi.value = '';

	if (doc.attivo.checked==1) 
		doc.hattivo.value="N";
	else
		doc.hattivo.value="S";
		
	if (doc.ricerca_anagrafica[0].checked == 1) 
		doc.hricerca_anagrafica.value = "0";
	if (doc.ricerca_anagrafica[1].checked == 1) 
		doc.hricerca_anagrafica.value = "1";
	
	doc.hcolore.value	=	doc.colore.value;
	doc.hone.value		=	doc.comboone.value;
	doc.registrazione.value = reg;
	
	doc.submit(); 
	alert(ritornaJsMsg('a5'));
	
	chiudi_ins_mod_prov();
}


function chiudi_ins_mod_prov()
{
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCR')
		campo_descr = document.form_prov.descr.value;
	else
		campo_descr = document.form_prov.cod_dec.value;
		
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();
}