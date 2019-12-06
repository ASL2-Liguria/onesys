var _A_SEL_PARTE = new Array();
var _filtro_list = null;

function generateWhereCorpo()
{
	var ret = '';
	
	for(var idx in _A_SEL_PARTE)
	{
		if(_A_SEL_PARTE[idx] != null && typeof idx == 'string' && typeof _A_SEL_PARTE[idx] != 'undefined' && typeof _A_SEL_PARTE[idx] != 'function')
		{
			if(typeof _A_SEL_PARTE[idx].parte != 'undefined' && _A_SEL_PARTE[idx].parte != '')
				ret += (ret != '' ? ' or ':'') + ' CORPO like \'%' + idx + '%\'';
		}
	}
	
	return ret;
}

function generateWhereMetodica()
{
	var a_bt   = document.getElementsByAttribute('li', 'className', 'pulsanteLISelezionato');
	var elenco = '';
	
	for(var idx = 0; idx < a_bt.length; idx++)
	{
		if(elenco != '')
			elenco += ', ';
		elenco += '\'' + a_bt[idx].id.split('_')[1] + '\'';
	}
	
	return elenco != '' ? 'METODICA in (' + elenco + ')':'';
}

function set_parte_corpo(parte)
{
	var area_sel = document.getElementById('ominde_canvas');
	
	if(typeof _A_SEL_PARTE[parte] == 'undefined' || _A_SEL_PARTE[parte] == null)
	{
		_A_SEL_PARTE[parte] = document.createElement('canvas');
		_A_SEL_PARTE[parte].id = 'CANVAS_' + parte;
		_A_SEL_PARTE[parte].parte = parte;
		_A_SEL_PARTE[parte].innerHTML = area_sel.innerHTML;
		_A_SEL_PARTE[parte].style.cursor = 'hand';
		_A_SEL_PARTE[parte].onclick = new Function('set_parte_corpo("' + parte + '")');
		
		document.all['body'].appendChild(_A_SEL_PARTE[parte]);
	}
	else
	{
		document.all['body'].removeChild(_A_SEL_PARTE[parte]);
		
		_A_SEL_PARTE[parte].parte = null;
		_A_SEL_PARTE[parte].innerHTML = '';
		_A_SEL_PARTE[parte] = null;
		_A_SEL_PARTE.splice(parte, 1);
	}
	
	_filtro_list.refreshList(generateWhereCorpo(), 'CORPO');
}

function ripristina_parte_corpo()
{
	for(var idx in _A_SEL_PARTE)
	{
		if(_A_SEL_PARTE[idx] != null && typeof idx == 'string' && typeof _A_SEL_PARTE[idx] != 'undefined' && typeof _A_SEL_PARTE[idx] != 'function')
		{
			if(typeof _A_SEL_PARTE[idx].parte != 'undefined' && _A_SEL_PARTE[idx].parte != '')
			{
				document.all['body'].removeChild(_A_SEL_PARTE[idx]);
				
				_A_SEL_PARTE[idx].parte = null;
				_A_SEL_PARTE[idx].innerHTML = '';
				_A_SEL_PARTE[idx] = null;
				_A_SEL_PARTE.splice(idx, 1);
			}
		}
	}
	
	_filtro_list.refreshList(generateWhereCorpo(), 'CORPO');
}

function set_metodica(valore)
{
	var bt = document.all['metodica_' + valore];
	
	if(bt.className == '' || typeof bt.className == 'undefined')
	{
		bt.className = 'pulsanteLISelezionato';
	}
	else
	{
		bt.className = '';
	}
	
	_filtro_list.refreshList(generateWhereMetodica(), 'METODICA');
}

function ripristina_filtro()
{
	var a_bt = document.getElementsByAttribute('li', 'className', 'pulsanteLISelezionato');
	
	for(var idx = 0; idx < a_bt.length; idx++)
	{
		a_bt[idx].className = '';
	}
	
	_filtro_list.refreshList(generateWhereMetodica(), 'METODICA');
}

function add_esame_ACR(id, descr)
{
	if(id != '' && descr != '')
	{
		add_elem('elencoEsamiScelti', id, descr);
		sortSelect('elencoEsamiScelti');
	}
}

function annulla()
{
	if(window.opener != null)
	{
		if(typeof window.opener.aggiorna == 'function')
			window.opener.aggiorna();
		
		self.close();
	}
	else
	{
		// Non è aperta da parte, blank!
		document.forms[0].target = '_self';
		document.forms[0].action = 'blank';
		document.forms[0].submit();
	}
}

function continua()
{
	var risp;
	
	if(document.all['elencoEsamiScelti'].options.length > 0)
	{
		if(typeof document.all['elencoEsamiScelti'].conferma == 'function')
			document.all['elencoEsamiScelti'].conferma();
		
		if(typeof document.all['elencoEsamiScelti'].chiusura == 'function')
			document.all['elencoEsamiScelti'].chiusura();
		else
			annulla();
	}
	else
		alert('Scegliere almeno un esame per proseguire!');
	
	
}

//funzione per aggiungere gli esami di un gruppo

function aggiungiEsami(){
	
	var object = document.dati.elencoGruppi;
	
	dwr.engine.setAsync(false);

	toolKitDB.getListResultData("select TAB_ESA.iden, TAB_ESA.DESCR from TAB_ESA join tab_esa_gruppi on (tab_esa_gruppi.iden_esa = tab_esa.iden) where TAB_ESA_GRUPPI.cod_GRUPPO = '" +  object.options(object.selectedIndex).value + "'", callEsami);

	dwr.engine.setAsync(true);
	
	
	
	
}

//funzione callback per inserirli in un campo

function callEsami (esami){
	
	for (var i = 0; i<esami.length; i++)
	{
		add_elem('elencoEsamiScelti', esami[i][0], esami[i][1]);
	}
	sortSelect('elencoEsamiScelti');
		
}


// funzione che esclude uno dei due checkbox alla selezione dell'altro; si può utilizzare per più checkbox

function escludiCheck(){
	
	var checkUno = document.dati.chkMestrua;
	var checkDue = document.dati.chkMeno;
	
	
	if (checkUno.checked){
		
		checkDue.value = 'N';
		checkDue.disabled = true;
		
	}else{
		
		checkDue.value = 'S';
		checkDue.disabled = false;
		
	}
	
	if (checkDue.checked){
		
		checkUno.value = 'N';
		checkUno.disabled = true;
		
	}else{
		
		checkUno.value = 'S';
		checkUno.disabled = false;
		
	}
	
}
	


