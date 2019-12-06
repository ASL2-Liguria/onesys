/*
	File javascript non più richiamato poichè si è deciso di visualizzare la worklist
	degli esami sotto la ricerca del paziente e non più in un'altra pagina.
*/

function visualizza_testo_referto()
{
	var progressivo = stringa_codici(progr);
	var iden_referto = stringa_codici(iden_ref);
	if(iden_referto == '')
	{
		return;
	}
	/*DEBUG*/
	//alert('IDEN REFERTO:'+iden_referto);
	//alert('PROGRESSIVO:'+progressivo);
	
	document.form_elenco.iden_ref.value = iden_referto;
	document.form_elenco.progr.value = progressivo;
	
	document.form_elenco.submit();
}

function chiudi()
{
	//alert('IDEN_ANAG:' + document.form_testo.iden_anag.value);
	//alert('WHERE_COND_WK:' + document.form_testo.hidWhere.value);
	//alert('SORGENTE:' + document.form_testo.sorgente.value);
	
	if(document.form_testo.sorgente.value == 'ANAGRAFICA')
	{
		parent.opener.aggiorna();
		parent.close();
		//parent.document.location.replace("SL_Visualizza_Esami_Frameset?iden_anag="+document.form_testo.iden_anag.value+"&hidWhere="+document.form_testo.hidWhere.value+"&sorgente="+document.form_testo.sorgente.value);
	}
	else
	{
		/*SORGENTE = FILTRI*/
		parent.opener.aggiorna();
		parent.close();
		//parent.document.location.replace("worklistInizio");
	}
}


function anteprima_referto()
{
	var referto = stringa_codici(iden_ref);
	var progressivo = stringa_codici(progr);
	
	/*alert('IDEN REFERTO: ' + referto);
	alert('PROGRESSIVO: ' + progressivo);*/
	
	if(referto == '')
	{
		alert('Prego, effettuare una selezione');
		return;
	}

	document.form_stampa.action = 'elabStampa';
	document.form_stampa.target = 'wndPreviewPrint';
	
	document.form_stampa.stampaSorgente.value       = 'versioni_precedenti';//ricerca_testo_referto
	document.form_stampa.stampaFunzioneStampa.value = 'REFERTO_STD';
	document.form_stampa.stampaIdenRef.value        = referto;
	document.form_stampa.stampaProgr.value        	= progressivo;
	document.form_stampa.stampaAnteprima.value      = "S";
	
	var wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	
	if (wndPreviewPrint)
	{
		wndPreviewPrint.focus();
	}
	else
	{
		wndPreviewPrint = window.open("","wndPreviewPrint","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
		
	document.form_stampa.submit();
}

function aggiorna()
{
	
}