function ripristina_referti_canc()
{
	var elenco_referti_cancellati = stringa_codici(deleted);
	var ar_elenco_referti_cancellati = elenco_referti_cancellati.split('*');
	
	if(ar_elenco_referti_cancellati.length == 1)
	{
		if(ar_elenco_referti_cancellati[0] == '')
		{
			alert(ritornaJsMsg("selezionare"));
			return;
		}
	}
	
	
	if(ar_elenco_referti_cancellati.length > 1)
	{
		for(i = 0; i < ar_elenco_referti_cancellati.length; i++)
			if(ar_elenco_referti_cancellati[i] == 'N')
			{
				alert(ritornaJsMsg("non_cancellato_ref"));
				return;
			}
	}
	else
		if(elenco_referti_cancellati == 'N')
			{
				alert(ritornaJsMsg("non_cancellato_ref"));
				return;
			}
		
	var array = stringa_codici(iden_ref) + '@' + document.form.iden_esami.value;
	
	//alert('IDEN_REF: ' + stringa_codici(iden_ref) + '\n\nIDEN ESAME: ' + document.form.iden_esami.value);

	CJsGestioneCancellati.ripristina_referto(array, cbk_ripristina_referto);
}

function cbk_ripristina_referto(message)
{
	if(message != '' && message != null)
		alert(message);
		
	CJsGestioneCancellati = null;	
	
	document.location.replace('SL_VisualizzaReferti?iden_referti='+document.form.iden_referti.value);
}


/*function ripristina_referti_canc()
{
	var elenco_referti_cancellati = stringa_codici(deleted);
	var ar_elenco_referti_cancellati = elenco_referti_cancellati.split('*');
	
	if(ar_elenco_referti_cancellati.length == 1)
	{
		if(ar_elenco_referti_cancellati[0] == '')
		{
			alert(ritornaJsMsg("selezionare"));
			return;
		}
	}
	
	
	if(ar_elenco_referti_cancellati.length > 1)
	{
		for(i = 0; i < ar_elenco_referti_cancellati.length; i++)
			if(ar_elenco_referti_cancellati[i] == 'N')
			{
				alert(ritornaJsMsg("non_cancellato_ref"));
				return;
			}
	}
	else
		if(elenco_referti_cancellati == 'N')
			{
				alert(ritornaJsMsg("non_cancellato_ref"));
				return;
			}
		

	if(debug == 1)
	{
		alert("IDEN_ANAG: " + document.form.iden_anag.value);
		alert('IDEN ESAME: ' + document.form.iden_esami.value);
	}

	document.form.action = 'SL_RipristinoCancellati';
	document.form.target = 'win_update_referti';//_self
	document.form.method  = 'POST';
	
	document.form.iden_referti.value = stringa_codici(iden_ref);
	document.form.operazione.value   = 'ripristina_referto';
	
	var win_update_referti  = window.open('', 'win_update_referti', 'top=1000000, left=0');
	
	
	document.form.submit();

	if(win_update_referti)
		win_update_referti.close();

	document.location.replace('SL_VisualizzaReferti?iden_referti='+document.form.iden_referti.value);
}
*/
