/*
	Funzione della parte di RICERCA degli esami
*/
function applica()
{
	var doc =  parent.RicercaEsamiFrame.document.form;
	
	doc.action = 'SL_EsamiDaAssociare';
	doc.target = 'EsamiDaAssociareFrame';
	
	var metodiche = parent.RicercaEsamiFrame.ricerca_metodiche();

	doc.text_ricerca.value = doc.text_ricerca.value.toUpperCase();

	doc.where_condition.value = doc.sub_select.value + metodiche;
	
	if(doc.tipo_ricerca[1].checked)
		doc.order_by.value = ' COD_ESA';
	else
		doc.order_by.value = ' DESCR';
	
	if(doc.text_ricerca.value != '')
	{
		if(doc.tipo_ricerca[1].checked)
		{
			doc.where_condition.value += " AND COD_ESA LIKE '" + doc.text_ricerca.value + "%'"; 
		}
		else
			if(doc.tipo_ricerca[0].checked)
			{
				doc.where_condition.value += " AND DESCR LIKE '" + doc.text_ricerca.value + "%'"; 
			}
	}
	
	if(parent.RicercaEsamiFrame.debug == 1)
		alert('FUNZIONE APPLICA: ' + doc.where_condition.value + " ORDER BY " + doc.order_by.value);
		
	doc.submit();
}

/*
	Funzione richiamata dalla pressione del tasto invio dalla text box della descrizione
	dell'esame 
*/
function intercetta_tasti()
{
	if (window.event.keyCode == 13)
		applica();
}



/*
	Funzione appartente alla worklist degli esami da associare alla Sala-Macchina-Area
	richiamata dal menù di Contesto 'Includi Esami' dalla wk degli esami da associare
*/
function aggiorna_tab_esa_prov()
{
	
	var elenco_iden_esami = stringa_codici(iden);
	if(elenco_iden_esami == '')
	{
		alert(ritornaJsMsg('selezionare_esame'));
		return;
	}
	else
	{
		
		sal_mac_are_esami = 'I@';
		sal_mac_are_esami += parent.RicercaEsamiFrame.document.form.iden_pro.value + '@';
		sal_mac_are_esami += elenco_iden_esami;
	
		dwr.engine.setAsync(false);
		CJsUpdTareEsa.update_tab_esa_prov(sal_mac_are_esami, cbkUpdateTareEsa);
		dwr.engine.setAsync(true);
	}

}
function aggiorna_tare_esa()
{
	var elenco_iden_esami = stringa_codici(iden);
	if(elenco_iden_esami == '')
	{
		alert(ritornaJsMsg('selezionare_esame'));
		return;
	}
	else
	{
		var sal_mac_are_esami = parent.RicercaEsamiFrame.document.form.iden_sala.value + '@';
		sal_mac_are_esami += parent.RicercaEsamiFrame.document.form.iden_mac.value + '@';
		sal_mac_are_esami += parent.RicercaEsamiFrame.document.form.iden_area.value + '@';
		sal_mac_are_esami += elenco_iden_esami;
	
		dwr.engine.setAsync(false);
		CJsUpdTareEsa.update_tare_esa(sal_mac_are_esami, cbkUpdateTareEsa);
		dwr.engine.setAsync(true);
	}
}

function cbkUpdateTareEsa(messaggio)
{
	if(messaggio == '')
	{
		applica();	
	}
	else
		alert(messaggio);
}


function crea_where_condition(in_not_in)
{
	var iden_sala 	= parent.RicercaEsamiFrame.document.form.iden_sala.value;
	var iden_mac 	= parent.RicercaEsamiFrame.document.form.iden_mac.value;
	var iden_area 	= parent.RicercaEsamiFrame.document.form.iden_area.value;
	
	var where_condition = ' where iden ' + in_not_in + ' (select iden from tare_esa where iden_sal = ' + iden_sala;
	where_condition += ' and iden_mac = ' + iden_mac;											   
	where_condition += ' and iden_are = ' + iden_area;		
	where_condition += " and deleted = 'N')";	
	
	if(parent.RicercaEsamiFrame.debug == 1)
		alert(where_condition);
	
	return where_condition;
}

/////////////////////*********************		ESAMI DA ASSOCIARE		************************////////////////////////////////////////
function avanti_esa_da_ass(pagina)
{
	var doc =  parent.RicercaEsamiFrame.document.form;
	
	document.form.action = 'SL_EsamiDaAssociare';
	document.form.target = 'EsamiDaAssociareFrame';
	
	document.form.pagina_da_vis.value = pagina;
	//document.form.where_condition.value = crea_where_condition('not in');
	
	
	var metodiche = parent.RicercaEsamiFrame.ricerca_metodiche();

	doc.text_ricerca.value = doc.text_ricerca.value.toUpperCase();

	doc.where_condition.value = doc.sub_select.value + metodiche;
	
	if(doc.tipo_ricerca[1].checked)
		doc.order_by.value = ' COD_ESA';
	else
		doc.order_by.value = ' DESCR';
	
	if(doc.text_ricerca.value != '')
	{
		if(doc.tipo_ricerca[1].checked)
		{
			doc.where_condition.value += " AND COD_ESA LIKE '" + doc.text_ricerca.value + "%'"; 
		}
		else
			if(doc.tipo_ricerca[0].checked)
			{
				doc.where_condition.value += " AND DESCR LIKE '" + doc.text_ricerca.value + "%'"; 
			}
	}
	
	
	document.form.where_condition.value = doc.where_condition.value;
	
	//alert(document.form.where_condition.value);
	
	
	document.form.submit();
}

function indietro_esa_da_ass(pagina)
{
	/*
	document.form.action = 'SL_EsamiDaAssociare';
	document.form.target = 'EsamiDaAssociareFrame';
	document.form.where_condition.value = crea_where_condition('not in');
	document.form.pagina_da_vis.value = pagina;
	
	document.form.submit();
	*/
	avanti_esa_da_ass(pagina);
}

/////////////////////******************		ESAMI ASSOCIATI		************************////////////////////////////////////////
/*function avanti_esa_ass(pagina)
{
	document.form.action = 'SL_EsamiAssociati';
	document.form.target = 'EsamiAssociatiFrame';
	document.form.pagina_da_vis.value = pagina;
	document.form.where_condition.value = crea_where_condition('in');
	document.form.submit();
}

function indietro_esa_ass(pagina)
{
	document.form.action = 'SL_EsamiAssociati';
	document.form.target = 'EsamiAssociatiFrame';
	document.form.pagina_da_vis.value = pagina;
	document.form.where_condition.value = crea_where_condition('in');
	document.form.submit();
}

function aggiorna_wk_esami_associati()
{
	document.form.action = 'SL_EsamiAssociati';
	document.form.target = 'EsamiAssociatiFrame';
	document.form.where_condition.value = crea_where_condition('in');
	document.form.submit();
}


function aggiorna_worklist()
{
	applica();
	aggiorna_wk_esami_associati();
}

*/


function registra()
{
	alert('Registrazione Effettuata');
}

/*Funzione richiamata dalla pagina di scelta dell'associazione degli esami*/
function chiudi()
{

	if(parent.RicercaEsamiFrame.document.form.iden_sala.value=="" || parent.RicercaEsamiFrame.document.form.iden_sala.value==0)
	{
		parent.opener.parent.Ricerca.ricerca();
	}
	else
	{
		parent.opener.parent.Ricerca.document.location.replace("SL_Manu_Tab_Ricerca?procedura=T_TARE_ESA&iden_sala="+parent.RicercaEsamiFrame.document.form.iden_sala.value+"&iden_mac="+parent.RicercaEsamiFrame.document.form.iden_mac.value+"&iden_area="+parent.RicercaEsamiFrame.document.form.iden_area.value);
	}
	parent.close();
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