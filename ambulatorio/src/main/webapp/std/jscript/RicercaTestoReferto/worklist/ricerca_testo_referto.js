function anteprima_referto()
{
	var referto = stringa_codici(iden_ref);
	//alert('IDEN REFERTO: ' + referto);
	
	if(referto == '')
	{
		alert('Prego, effettuare una selezione');
		return;
	}
	
	document.form_stampa.action = 'elabStampa';
	document.form_stampa.target = 'wndPreviewPrint';
	
	document.form_stampa.stampaSorgente.value       = 'ricerca_testo_referto';
	document.form_stampa.stampaFunzioneStampa.value = 'REFERTO_STD';
	document.form_stampa.stampaIdenRef.value        = referto;
	document.form_stampa.stampaAnteprima.value      = "S";
	
	var wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (wndPreviewPrint){
		wndPreviewPrint.focus();
	}
	else{
		wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	
	
	document.form_stampa.submit();
}

function aggiorna()
{
	parent.Ricerca.applica();
}


/**
* Funzione richiamata alla fine del caricamento della wk della ricerca nel testo del referto
* che controlla se è stato superato il limite di record visualizzabili per la wk corrente
* TIPO_WK.limite_record
*/

function controlloLimiteRecord(limite_record_wk)
{
	//alert(limite_record_wk);
	//alert(iden_ref.length);
	var int_limite_record_wk = 0;
	try
	{
		if (limite_record_wk == '')
		{
			return;
		}
		else 
		{
			int_limite_record_wk = parseInt(limite_record_wk);
			if (iden_ref.length > int_limite_record_wk)
			{
				alert(ritornaJsMsg("alert_num_max_record") + " " + int_limite_record_wk);
			}
		}
	}
	catch(e)
	{
	}
}

function visualizza_esami()
{
	var referto = stringa_codici(iden_ref);
	//alert('IDEN REFERTO: ' + referto);
	
	if(referto == '')
	{
		alert('Prego, effettuare una selezione');
		return;
	}
	
	document.form.action = 'worklist?hidWhere= where iden_ref = ' + referto + "&namecontextmenu=ric_testo_referto";//wk_ricerca_testo_ref
	document.form.target = '_self';
	
	document.form.submit();
}