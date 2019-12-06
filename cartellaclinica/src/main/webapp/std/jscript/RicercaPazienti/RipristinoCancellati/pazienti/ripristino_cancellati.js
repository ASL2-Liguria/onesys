/*
	Operazione fattibile solo su pazienti cancellati.
*/
/*function ripristina_paz_canc()
{
	var cancellato = stringa_codici(deleted);
	if(cancellato == '')
	{
		alert(ritornaJsMsg("selezionare"));
		return;
	}
	else
		if(cancellato == 'N')
		{
			alert(ritornaJsMsg("non_cancellato"));
			return;
		}

	document.form_canc_paz.action = 'SL_RipristinoCancellati';
	document.form_canc_paz.target = 'win_update_anag';
	document.form_canc_paz.method  = 'POST';
	
	document.form_canc_paz.operazione.value = 'ripristina_utente';
	document.form_canc_paz.iden_paz_canc.value = stringa_codici(iden);
	
	var win_update_anag = window.open('','win_update_anag','top=1000000, left=0');

	document.form_canc_paz.submit();

	if(win_update_anag)
		win_update_anag.close();


	parent.RicPazRicercaFrame.applica();
}*/


function ripristina_paz_canc()
{
	var cancellato = stringa_codici(deleted);
	if(cancellato == '')
	{
		alert(ritornaJsMsg("selezionare"));
		return;
	}
	else
		if(cancellato == 'N')
		{
			alert(ritornaJsMsg("non_cancellato"));
			return;
		}

	CJsGestioneCancellati.ripristina_utente(stringa_codici(iden), cbk_ripristina_paz_canc);

}

function cbk_ripristina_paz_canc(message)
{
	if(message != '')
		alert(message);
	
	CJsGestioneCancellati = null;
	
	parent.RicPazRicercaFrame.applica();
}


/*
	Operazione fattibile solo su pazienti NON CANCELLATI
*/
function visualizza_esami()
{
	var cancellato = stringa_codici(deleted);
	if(cancellato == '' || cancellato == 'undefined')
	{
		alert(ritornaJsMsg("selezionare"));
		return;
	}
	else
		if(cancellato == 'S')
		{
			alert(ritornaJsMsg("cancellato"));
			return;
		}

	document.form_canc_paz.action = 'SL_VisualizzaEsami';
	document.form_canc_paz.target = 'RicPazRecordFrame';
	document.form_canc_paz.method  = 'POST';
	
	document.form_canc_paz.iden_paz_canc.value = stringa_codici(iden);
	
	document.form_canc_paz.submit();
}