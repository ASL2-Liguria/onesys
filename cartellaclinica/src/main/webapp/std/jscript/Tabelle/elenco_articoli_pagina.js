function intercetta_tasti()
{
	if (window.event.keyCode==13)
	{
		 window.event.keyCode = 0;
		 where_condition();
	}
}

function where_condition()
{
	var doc = document.form_articoli;
	var where_cond = '';
	
	doc.articolo.value = doc.articolo.value.toUpperCase();
	
	if(doc.ricerca[0].checked)
	{
		doc.htipo_ricerca.value = doc.ricerca[0].value;
		if(doc.articolo.value != '')
		{
			where_cond = " WHERE descr like '%" + replace_stringa(doc.articolo.value, "'") + "%'";
		}
		where_cond += ' ORDER BY descr';
	}
	
	if(doc.ricerca[1].checked)
	{
		doc.htipo_ricerca.value = doc.ricerca[1].value;
		if(doc.articolo.value != '')
		{
			where_cond = " WHERE cod_art like '%" + replace_stringa(doc.articolo.value, "'") + "%'";
		}
		where_cond += ' ORDER BY cod_art';
	}
	
	if(doc.ricerca[2].checked)
	{
		doc.htipo_ricerca.value = doc.ricerca[2].value;
		if(doc.articolo.value != '')
		{
			where_cond = " WHERE descr like '%" + replace_stringa(doc.articolo.value, "'") + "%'";
			where_cond += " and mdc_sino = 'S' order by descr";
		}
		else
			where_cond = " where mdc_sino = 'S' order by descr";
	}
	
	if(doc.ricerca[3].checked)
	{
		doc.htipo_ricerca.value = doc.ricerca[3].value;
		if(doc.articolo.value != '')
		{
			where_cond = " WHERE descr like '%" + replace_stringa(doc.articolo.value, "'") + "%'";
			where_cond += " and tracciante = 'S' order by descr";
		}
		else
			where_cond = " where tracciante = 'S' order by descr";
	}
	
	doc.hwhere_condition.value = where_cond;
	
	document.form_articoli.iden_esame.value = document.form_articoli.iden_esa.value;
	
	//alert(document.form_articoli.iden_esame.value);
	
	doc.action = 'ElencoArticoli';
	doc.target = '_self';//ArticoliEsamiAssociatiFrame
	doc.method = 'POST';	
	doc.submit();

}


function on_load()
{
	fillLabels(arrayLabelName,arrayLabelValue);
	document.form_articoli.articolo.focus();

	if(document.form_articoli.htipo_ricerca.value == '')
		document.form_articoli.ricerca[0].checked = 1;
}

function controlla_esistenza_esame_articolo()
{
	var mancano = '';
	
	var doc_art = document.form_articoli;
	var doc_controllo = document.form_controllo_esa_art;

	if(doc_art.qta.value == '' || doc_art.elenco_articoli.value == '' || doc_art.htipologia.value == '')
	{
		if(doc_art.elenco_articoli.value == '')
		{
			 /*alert(ritornaJsMsg('elenco_articoli'));
			 doc_art.elenco_articoli.focus();
			 return;*/
			 mancano = '- ARTICOLO\n';
		}
		if(doc_art.qta.value == '')
		{
			 /*alert(ritornaJsMsg('qta_number'));
			 doc_art.qta.focus();
			 return;*/
			 mancano += '- QUANTITA\' DEL MATERIALE\n';
		}
		if(doc_art.htipologia.value == '')
		{
			 /*alert(ritornaJsMsg('alert_tipologia'));
			 return;*/
			 mancano += '- TIPOLOGIA\n';
		}
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	}
	else
	{
		doc_controllo.action = 'CheckEsaArtMatEsa';
		doc_controllo.target = 'winControlloEsaArt';
		
		var controllo = window.open('','winControlloEsaArt','width=100,height=100, resizable=yes,top=10,left=100000');
		doc_controllo.nome_campi_check.value = 'iden_art*iden_esa';
		
		var valori = doc_art.elenco_articoli.value + '*' + document.form_articoli.iden_esa.value;
		
		//alert('valori x la servlet CheckEsaArtMatEsa: ' + valori);
		
		doc_controllo.valore_campi_check.value = valori;

		doc_controllo.submit();
	}
}
            

function inserisci(operazione)
{
	var doc = document.form_articoli;
	doc.operazione_modifica.value = operazione;
	
	doc.iden_esame.value = document.form_articoli.iden_esa.value;
	
	//alert(doc.iden_esame.value);
	
	doc.submit();
	doc.qta.value = '';
	doc.tipologia[0].checked = 0;
	doc.tipologia[1].checked = 0;
	doc.htipologia.value = '';
}