function refresh_giorni()
{
	var da_data = document.impostazioni.da_data.value;
	var a_data = document.impostazioni.a_data.value;
	
	if(document.impostazioni.Hstato.value == '')
	{
		return;
	}
	
	da_data = da_data.substring(6, 10) + da_data.substring(3, 5) + da_data.substring(0, 2);
	a_data = a_data.substring(6, 10) + a_data.substring(3, 5) + a_data.substring(0, 2);
	
	document.impostazioni.Hiden_sal.value = parent.parent.frameFiltri.document.filtri.selSala.value;
	document.impostazioni.Hiden_mac.value = parent.parent.frameFiltri.document.filtri.selMac.value;
	document.impostazioni.Hiden_are.value = parent.parent.frameFiltri.document.filtri.selArea.value;
	
	parent.frameGiorni.document.location.replace('gesDisabMaccElabGiorni?Hiden_are=' + document.impostazioni.Hiden_are.value + '&da_data=' + da_data + '&a_data=' + a_data);
}

function blank_giorni()
{
	parent.frameGiorni.document.location.replace('gesDisabMaccElabGiorni');
}

function nuovo()
{
	document.impostazioni.Hiden_dettaglio.value = '';
	document.impostazioni.Hstato.value = '';
	document.impostazioni.da_data.value = '';
	document.impostazioni.a_data.value = '';
	document.impostazioni.descrizione.value = '';
	document.impostazioni.rStato[0].checked = false;
	document.impostazioni.rStato[1].checked = false;
	
	set_stato_campi(false);
	
	refresh_giorni();
}

function registra()
{
	document.impostazioni.Hiden_sal.value = parent.parent.frameFiltri.document.filtri.selSala.value;
	document.impostazioni.Hiden_mac.value = parent.parent.frameFiltri.document.filtri.selMac.value;
	document.impostazioni.Hiden_are.value = parent.parent.frameFiltri.document.filtri.selArea.value;
	
	if(document.impostazioni.Hiden_mac.value == '')
	{
		alert('Selezionare SALA/MACCHINA!!!');
		return;
	}
	
	if(document.impostazioni.Hstato.value == '')
	{
		alert('Selezionare tipo di operazione!!!');
		return;
	}
	
	if(document.impostazioni.Hiden_are.value == '' && document.impostazioni.Hstato.value == 'R')
	{
		alert('Selezionare AREA!!!');
		return;
	}
	
	if(document.impostazioni.da_data.value == '')
	{
		alert('Inserire la data di partenza!');
		return;
	}
	
	if(document.impostazioni.a_data.value == '')
	{
		alert('Inserire la data di fine!');
		return;
	}
	
	if(document.impostazioni.descrizione.value == '')
	{
		alert('Inserire la motivazione!');
		return;
	}
	
	/*if(document.impostazioni.Hstato.value != 'R')
	{
		document.impostazioni.Hiden_are.value = '';
	}*/
	
	set_stato_campi(false);
	
	document.impostazioni.giorni.value = parent.frameGiorni.genera_stringa_gg();
	
	document.impostazioni.target = '_self';
	document.impostazioni.method = 'GET';
	document.impostazioni.action = 'gestioneDisabilitaMacchinaRegistra';
	
	document.impostazioni.submit();
}

function disabilita_abilita_campi()
{
	var tf = document.impostazioni.Hiden_dettaglio.value != '';
	
	set_stato_campi(tf);
}

function set_stato_campi(val)
{
	document.impostazioni.rStato[0].disabled = val;
	document.impostazioni.rStato[1].disabled = val;
	document.impostazioni.da_data.disabled = val;
	document.impostazioni.a_data.disabled = val;
}