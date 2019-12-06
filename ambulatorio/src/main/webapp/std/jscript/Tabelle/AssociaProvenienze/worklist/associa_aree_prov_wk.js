function avanti(pagina)
{
	var doc =  parent.RicercaProvenienzeFrame.document.form;
	
	document.form.action = 'SL_ProvenienzeDaAssociare';
	document.form.target = 'ProvenienzeDaAssociareFrame';
	
	document.form.pagina_da_vis.value = pagina;

	doc.text_ricerca.value = doc.text_ricerca.value.toUpperCase();

	if(doc.tipo_ricerca[1].checked)
		doc.order_by.value = ' COD_DEC';
	else
		doc.order_by.value = ' DESCR';
	
	if(doc.text_ricerca.value != '')
	{
		if(doc.tipo_ricerca[1].checked)
		{
			doc.where_condition.value += " AND COD_DEC LIKE '" + doc.text_ricerca.value + "%'"; 
		}
		else
			if(doc.tipo_ricerca[0].checked)
			{
				doc.where_condition.value += " AND DESCR LIKE '" + doc.text_ricerca.value + "%'"; 
			}
	}
	
	document.form.where_condition.value = doc.where_condition.value;
	
	if(doc.tipo_ricerca[0].checked)
		document.form.where_condition.value += ' ORDER BY DESCR';
	if(doc.tipo_ricerca[1].checked)
		document.form.where_condition.value += ' ORDER BY COD_DEC';
	
	
	
	//alert('WHERE CONDITION: ' + document.form.where_condition.value);
	
	
	document.form.submit();
}

function indietro(pagina)
{
	avanti(pagina);
}


function includi_provenienze()
{
	var elenco_iden_provenienze = stringa_codici(iden);
	var sal_mac_area_provenienze = '';
	
	if(elenco_iden_provenienze == '')
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}
	else
	{
		sal_mac_area_provenienze = parent.RicercaProvenienzeFrame.document.form.iden_sala.value + '@';
		sal_mac_area_provenienze += parent.RicercaProvenienzeFrame.document.form.iden_mac.value + '@';
		sal_mac_area_provenienze += parent.RicercaProvenienzeFrame.document.form.iden_area.value + '@';
		sal_mac_area_provenienze += elenco_iden_provenienze;
	
		dwr.engine.setAsync(false);
		CJsAreeProvenienze.insert_tab_aree_provenienze(sal_mac_area_provenienze, cbkAreeProvenienze);
		dwr.engine.setAsync(true);
	}
}


function cbkAreeProvenienze(messaggio)
{
	if(messaggio == '')
	{
		parent.RicercaProvenienzeFrame.applica();	
	}
	else
		alert(messaggio);
}

function seleziona_tutti()
{
	for(indice = 0; indice < iden.length; indice ++)
	{
		document.all.oTable.rows(indice).style.backgroundColor = sel;
		nuovo_indice_sel(indice);
	}
}

function deseleziona_tutti()
{
	for(indice = 0; indice < iden.length; indice ++)
	{
		document.all.oTable.rows(indice).style.backgroundColor = desel;
		rimuovi_indice(indice);
	}
}