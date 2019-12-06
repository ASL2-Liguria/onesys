function accetta_paziente()
{
	var iden_anag = stringa_codici(iden);

	if(iden_anag == 0)
	{
		alert(ritornaJsMsg('selezionare'));
        return;
    }
    
	/*Controllo se il paziente è READONLY*/	
	if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
	{
		alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
		return;		
	}
	/**/
	
	/*document.form_accetta_paziente.Hiden_anag.value = iden_anag;
	document.form_accetta_paziente.Hiden_esa.value = parent.RicPazRicercaFrame.document.form_pag_ric.Hiden_esa.value;
	document.form_accetta_paziente.Hiden_posto.value = parent.RicPazRicercaFrame.document.form_pag_ric.Hiden_posto.value;
	
    document.form_accetta_paziente.tipo_registrazione.value = 'P';
	document.form_accetta_paziente.method = 'get';
	document.form_accetta_paziente.action = 'prenotazioneRegistrazione';
    document.form_accetta_paziente.submit();*/
	
	if(parent.parent.frameDirezione)
	{
		parent.parent.document.all.frameMainPrenotazione.rows = "0,*";
	}

	
	var tipo_ricerca = document.form_canc_paz.ricerca_anagrafica.value;
	
	//alert('parametro iden_anag:' + iden_anag);
	//alert('baseGlobal.RICERCA_ANAGRAFICA: ' + parent.RicPazRicercaFrame.baseGlobal.RICERCA_ANAGRAFICA);
	//alert('tipo ricerca attuale ' + tipo_ricerca);
	
	if(tipo_ricerca == '2')//parent.RicPazRicercaFrame.baseGlobal.RICERCA_ANAGRAFICA != '0'
		CJsGestioneAnagrafica.gestione_anagrafica(iden_anag, check_dwr);
	else
		parent.document.location.replace('prenotazioneRegistrazione?Hiden_anag=' + iden_anag);
}

function check_dwr(ret)
{
	//alert('anag.iden:' + ret);
	if(ret.indexOf('Exception') > 0 || ret == '0')
		alert('Errore durante l\'elaborazione del paziente con la gestione remota: ' + ret);
	else
		parent.document.location.replace('prenotazioneRegistrazione?Hiden_anag=' + ret);
}