function abilita_disabilita_data()
{
	document.ripeti.data_fine.readOnly = !document.ripeti.ab_data_fine.checked;
	if(document.ripeti.ab_data_fine.checked)
	{
		document.ripeti.data_fine.focus();
	}
	else
	{
		document.ripeti.data_fine.value = '';
	}
}

function chiudi()
{
	opener.aggiorna();
	self.close();
}

function abilita_disabilita_ripetizione()
{
	var attivo = !document.ripeti.ab_ripeti.checked;
	
	document.ripeti.parti_da_ora.readOnly = attivo;
	document.ripeti.alterna_giorni.readOnly = attivo;
	document.ripeti.ripeti_ogni.readOnly = attivo;
	document.ripeti.ripeti_tipo.disabled = attivo;
	document.ripeti.optFino[0].disabled = attivo;
	document.ripeti.optFino[1].disabled = attivo;
	document.ripeti.ripeti_fino.readOnly = attivo;
	
	if(!attivo)
	{
		document.ripeti.optFino[0].checked = true;
		document.ripeti.optFino[1].checked = false;
		document.ripeti.ripeti_ogni.focus();
	}
	else
	{
		document.ripeti.ripeti_ogni.value = '';
		document.ripeti.ripeti_fino.value = '';
		document.ripeti.ripeti_durata.value = '';
		document.ripeti.optFino[0].checked = false;
		document.ripeti.optFino[1].checked = false;
	}
}

function set_opt_field()
{
	var attivo = !document.ripeti.optFino[0].checked;
	
	document.ripeti.ripeti_fino.readOnly = attivo;
	document.ripeti.ripeti_durata.readOnly = !attivo;
	document.ripeti.ripeti_tipo_durata.disabled = !attivo;
	
	if(!attivo)
	{
		document.ripeti.ripeti_durata.value = '';
	}
	else
	{
		document.ripeti.ripeti_fino.value = '';
	}
}

function registra()
{
	var par    = '';
	var errMsg = '';
	
	// Inizio controlli...
	if(document.ripeti.data_inizio.value == '')
	{
		errMsg += 'Data inizio\n'
	}
	
	if(document.ripeti.ab_data_fine.checked && document.ripeti.data_fine.value == '')
	{
		errMsg += 'Data fine\n'
	}
	
	if(document.ripeti.ab_ripeti.checked)
	{
		if(document.ripeti.ripeti_ogni.value == '')
		{
			errMsg += 'Ogni\n';
		}
		
		if(document.ripeti.optFino[0].checked)
		{
			if(document.ripeti.ripeti_ogni.value == '')
			{
				errMsg += 'Fino a ora\n';
			}
		}
		else
		{
			if(document.ripeti.ripeti_durata.value == '')
			{
				errMsg += 'Fino a durata';
			}
		}
	}
	// Fine controlli!!!
	
	if(errMsg != '')
	{
		alert('Attenzione! Mancano i seguenti campi:\n' + errMsg);
	}
	else
	{
		par = iden_esame + '*'; // IDEN ESAME
		par += document.ripeti.data_inizio.value.substr(6, 4) + document.ripeti.data_inizio.value.substr(3,2) + document.ripeti.data_inizio.value.substr(0,2) + '*'; // DATA INIZIO
		par += document.ripeti.data_fine.value.substr(6, 4) + document.ripeti.data_fine.value.substr(3,2) + document.ripeti.data_fine.value.substr(0,2) + '*'; // DATA FINE
		par += document.ripeti.parti_da_ora.value + '*'; // PARTI DA ORA
		par += document.ripeti.alterna_giorni.value + '*'; // ALTERNA GIORNO
		par += document.ripeti.ripeti_ogni.value + '*'; // OGNI
		par += document.ripeti.ripeti_tipo.value + '*'; // TIPO OGNI
		par += document.ripeti.ripeti_fino.value + '*'; // FINO A ORA
		par += document.ripeti.ripeti_durata.value + '*'; // DURATA
		par += document.ripeti.ripeti_tipo_durata.value; // TIPO DURATA
		
		pRipetiDWR.ripeti_esami(par, check_registra);
	}
}

function check_registra(res)
{
	if(res != null && res != '')
	{
		alert(res);
	}
	
	opener.aggiorna();
	self.close();
}