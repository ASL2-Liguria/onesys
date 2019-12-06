function switch_tab(indice)
{
	var idx;
	
	for(idx = indice; idx < document.all['tabPage'].length; document.all['tabPage'](idx++).style.display = 'none');
	for(idx = indice; idx >= 0; document.all['tabPage'](idx--).style.display = 'none');
	
	document.all['tabPage'](indice).style.display = 'block';
}

function remove_tab(indice)
{
	var idx_sel = -1;
	var idx;
	
	document.all['tabPage'](indice).style.display = 'none';
	document.all['tabPage'](indice).setAttribute('CHIUSO', 'S');
	document.all['tabTabulazioneCella'](indice).style.display = 'none';
	
	for(idx = indice - 1; idx >= 0 && idx_sel < 0; idx--)
	{
		if(document.all['tabPage'](idx).getAttribute('CHIUSO') != 'S')
		{
			idx_sel = idx;
		}
	}
	
	for(idx = indice + 1; idx < document.all['tabPage'].length && idx_sel < 0; idx++)
	{
		if(document.all['tabPage'](idx).getAttribute('CHIUSO') != 'S')
		{
			idx_sel = idx;
		}
	}
	
	if(idx_sel >= 0)
	{
		switch_tab(idx_sel);
	}
	else
	{
		//self.close();
	//	chiudi_tabulazione();
	}
}

function registra_tabulazione()
{
	var msg 	= '';
	var msg_tmp;
	var idx;
	
	unisci_form();
	
	for(idx = 0; idx < document.all['tabPage'].length; idx++)
	{
		msg_tmp = document.all['tabPageFrame'](idx).contentWindow.check_dati(false);
		
		if(msg_tmp != '')
		{
			msg += '\n' + document.all['tabPage'](idx).LABEL_PAGINA + msg_tmp;
		}
	}
	
	if(msg == '')
	{
		for(idx = 0; idx < document.all['tabPage'].length; idx++)
		{
			document.all['tabPageFrame'](idx).contentWindow.registra();
			msg += document.all['tabPageFrame'](idx).contentWindow.errori();
		}
	}
	else
	{
		alert('Attenzione! Compilare le seguenti pagine!' + msg);
	}
	
	_MSG_ERROR = msg;
	
}

function chiudi_tabulazione(funz_call)
{
	if(typeof funz_call != 'undefined')
	{
		eval(funz_call);
	}
	else
	{
		richiama_conclusione('alert("sei finito");');//'self.close();');
	}
}