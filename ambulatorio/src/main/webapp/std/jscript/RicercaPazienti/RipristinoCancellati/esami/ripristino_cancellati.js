/*
	Il ripristino avviene sugli esami e sui referti ad essi collegati
	se e solo se gli esami sono cancellati.

function ripristina_esami_canc()
{
	var elenco_esami_cancellati    = stringa_codici(deleted);
	var ar_elenco_esami_cancellati = elenco_esami_cancellati.split('*');

	if(ar_elenco_esami_cancellati.length == 1)
	{
		if(ar_elenco_esami_cancellati[0] == '')
		{
			alert(ritornaJsMsg("selezionare"));
			return;
		}
	}

	if(ar_elenco_esami_cancellati.length > 1)
	{
		for(i = 0; i < ar_elenco_esami_cancellati.length; i++)
			if(ar_elenco_esami_cancellati[i] == 'N')
			{
				alert(ritornaJsMsg("non_cancellato"));
				return;
			}
	}
	else
		if(elenco_esami_cancellati == 'N')
			{
				alert(ritornaJsMsg("non_cancellato"));
				return;
			}
		
	alert(ritornaJsMsg("ripristino_esami"));//Attenzione: NON verranno ripristinati gli eventuali referti associati
	
	document.form.action = 'SL_RipristinoCancellati';
	document.form.target = 'win_update_esami';//_self
	document.form.method = 'POST';
	
	document.form.iden_esami.value 	 = stringa_codici(iden);//document.form.iden_referti.value = stringa_codici(iden_ref);
	document.form.operazione.value   = 'ripristina_esami';
	
	
	var win_update_esami  = window.open('', 'win_update_esami', 'top=1000000, left=0');
	
	document.form.submit();

	if(debug == 1)
	{
		alert("IDEN_ANAG: " + document.form.iden_anag.value);
		alert("ELENCO ESAMI DA RIPR: " + stringa_codici(iden));
		//alert("ELENCO REFERTI DA RIPR: " + stringa_codici(iden_ref));
	}

	if(win_update_esami)
		win_update_esami.close();

	document.location.replace('SL_VisualizzaEsami?iden_paz_canc='+document.form.iden_anag.value);
}
*/

function ripristina_esami_canc()
{
	var elenco_esami_cancellati    = stringa_codici(deleted);
	var ar_elenco_esami_cancellati = elenco_esami_cancellati.split('*');

	if(ar_elenco_esami_cancellati.length == 1)
	{
		if(ar_elenco_esami_cancellati[0] == '')
		{
			alert(ritornaJsMsg("selezionare"));
			return;
		}
	}

	if(ar_elenco_esami_cancellati.length > 1)
	{
		for(i = 0; i < ar_elenco_esami_cancellati.length; i++)
			if(ar_elenco_esami_cancellati[i] == 'N')
			{
				alert(ritornaJsMsg("non_cancellato"));
				return;
			}
	}
	else
		if(elenco_esami_cancellati == 'N')
			{
				alert(ritornaJsMsg("non_cancellato"));
				return;
			}
		
	alert(ritornaJsMsg("ripristino_esami"));//Attenzione: NON verranno ripristinati gli eventuali referti associati
	
	CJsGestioneCancellati.ripristina_esami(stringa_codici(iden), cbk_ripristina_esami);
}

function cbk_ripristina_esami(message)
{
	if(message != '')
		alert(message);
		
	CJsGestioneCancellati = null;
	
	document.location.replace('SL_VisualizzaEsami?iden_paz_canc='+document.form.iden_anag.value);
}


//conta numero esami selezionati
function conta_esami_sel()
{
	return vettore_indici_sel.length;
}


function visualizza_referto()
{
	document.form.hidManualOrderAsc.value = '';
	document.form.hidManualOrderDesc.value = '';
	if(conta_esami_sel() == 0)
	{
		alert(ritornaJsMsg("selezionare"));
		return;
	}
	if (conta_esami_sel()!=1)
	{
		alert(ritornaJsMsg("soloUnEsame"));
		return;
	}	
	var cancellato = stringa_codici(deleted);
	if(cancellato == 'S')
	{
		alert(ritornaJsMsg("cancellato_esa"));
		return;
	}
	
	document.form.action = 'SL_VisualizzaReferti';
	document.form.target = 'RicPazWorklistFrame';//RicPazRecordFrame
	document.form.method  = 'POST';
	
	if(debug == 1)
	{
		alert('ESAME: ' + stringa_codici(iden));
		alert('REFERTATO: ' + stringa_codici(array_refertato));
		alert('IDEN REF: ' + stringa_codici(iden_ref));
		alert('LAST IDEN REF: ' + stringa_codici(array_last_iden_ref));
	}

	var last_iden_ref = stringa_codici(array_last_iden_ref);
	var refertato = stringa_codici(array_refertato);
	
	if(refertato == '1')
		document.form.iden_referti.value = stringa_codici(iden_ref);//ESAMI.iden_ref
	else
		if(last_iden_ref != '')
			document.form.iden_referti.value = stringa_codici(array_last_iden_ref);//ESAMI.last_iden_ref
	
	document.form.iden_esami.value = stringa_codici(iden);
	
	
	document.form.submit();

}