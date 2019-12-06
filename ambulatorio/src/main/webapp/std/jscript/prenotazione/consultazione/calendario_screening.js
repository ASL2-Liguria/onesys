function change_week(num)
{
	document.calendario.Hoffset.value = (parseInt(document.calendario.Hoffset.value, 10) + num) + '';
	aggiorna();
}

function dettaglio(data, aree, cdc)
{
	// Mi servono per ritornare indietro...
	parent.parent.parametri = new Array(10);
	parent.parent.parametri[0] = 'CONSULTAZIONE'; // Origine
	parent.parent.parametri[1] = document.calendario.valore.value; // Valore selezionato
	parent.parent.parametri[2] = data; // Giorno selezionato
	parent.parent.parametri[3] = aree; // Aree di quel giorno
	parent.parent.parametri[4] = ''; // Area selezionata dal dettaglio (la setto dentro al dettaglio...)
	parent.parent.parametri[5] = document.calendario.tipo.value;
	parent.parent.parametri[6] = document.calendario.Hoffset.value;
	parent.parent.parametri[7] = document.calendario.valore2.value; // Valore secondario selezionato
	parent.parent.parametri[8] = document.calendario.filtro_esami.value; // Filtro degli esami...
	
	if(typeof(parent.frameOpzioni)!= 'undefined'){
		parent.parent.parametri[9] = parent.frameOpzioni.document.opzioni.prenota.value; // Prenotazione o no delle richieste...
	}else{
		document.calendario.menu_tenda.value = 'prenotazioneScreening'; //non c'è allora l ho aperta dallo screening;
	}
	if(typeof(parent.frameOpzioni)!= 'undefined'){
		if(parent.frameOpzioni.document.opzioni.prenota.value == 'S')
		{
			document.calendario.id_esame.value = parent.frameRiepilogo.getIdenEsa();
			document.calendario.idx_esame.value = parent.frameRiepilogo.getIdxEsa();
		}
	}
	
	document.calendario.Hdata.value = data;
	document.calendario.id_aree.value = aree;
	document.calendario.id_area.value = ''; // ANCORA DA FINIREEEEEE
	document.calendario.js_click.value = 'javascript:';
	document.calendario.js_indietro.value = 'javascript:ritorna_consulta("' + document.calendario.tipo.value + '", "' + document.calendario.valore.value + '", "' + document.calendario.valore2.value + '", "' + document.calendario.filtro_esami.value + '", "' + document.calendario.Hoffset.value + '", "consultazioneCalendarioScreening");';
	
	document.calendario.valore.value = cdc;
	
	aggiorna('prenotazioneDettaglio');
}

function aggiorna(pagina)
{
	if(pagina == null || pagina == '')
	{
		pagina = 'consultazioneCalendarioScreening';
	}
	
	document.calendario.target = '_self';
	document.calendario.method = 'get';
	document.calendario.action = pagina;
	document.calendario.submit();
}

function stampa()
{
	var wStampa = window.open('elabStampa?stampaFunzioneStampa=LISTA_GIORNATA_STD&data=' + document.calendario.Hdata.value +'&aree=' + document.calendario.id_aree.value, '', 'top=0,left=0');
	
	if(wStampa)
	{
		wStampa.focus();
	}
	else
	{
		wStampa = window.open('elabStampa?stampaFunzioneStampa=LISTA_GIORNATA_STD&data=' + document.calendario.Hdata.value +'&aree=' + document.calendario.id_aree.value, '', 'top=0,left=0');
	}
}

function dettaglio_orario(sala_id, tr_id, ifr_id)
{
	if(sala_id != null && sala_id != '' && tr_id != null && tr_id != '' && ifr_id != null && ifr_id != '')
	{
		if(document.all[tr_id].style.display != 'block')
		{
			document.all[tr_id].style.display = 'block';
			document.all[ifr_id].src = 'consultazioneCalendarioScreening?tipo=SALE&light=S&js_path=parent.&Hoffset=' + document.calendario.Hoffset.value + '&valore=' + sala_id + '&filtro_esami=' + document.calendario.filtro_esami.value;
		}
		else
		{
			document.all[tr_id].style.display = 'none';
			document.all[ifr_id].src = 'blank';
		}
	}
}

function salva_note(oTxt, data)
{
	var par = oTxt.value + '###' + data;
	
	consultazioneDWR.salva_nota(par);
}

function disabilita_giorno()
{
	var aree = document.calendario.id_aree.value;
	var data = document.calendario.Hdata.value;
	var sql  = "{call ? := DISABILITA_GIORNO_AGENDA('" + aree + "', '" + data + "')}";
	
	if(confirm('Si vuole disabilitare definitivamente TUTTE le aree del giorno ' + data.substr(6, 2) + '/' + data.substr(4, 2) + '/' + data.substr(0, 4) +'?'))
	{
		dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, check_disabilita_giorno);
		dwr.engine.setAsync(true);
	}
}

function check_disabilita_giorno(value)
{
	if(value != null && value != '')
		alert(value);
	else
		aggiorna();
}