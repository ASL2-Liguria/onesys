function importa_paziente(tipo_operazione)
{
	var iden_remote_anag = stringa_codici(iden);//array_id_anagremota

	//alert('IDEN REMOTO: ' + iden_remote_anag);
	
	if(iden_remote_anag == '')
	{
		alert(ritornaJsMsg('selezionare'));//Prego, effettuare una selezione
		return;
	}
	
	var cognome = stringa_codici(array_cognome);
	
	var nome = stringa_codici(array_nome);
	
	var sesso = stringa_codici(array_sesso);
	
	var data = stringa_codici(array_data);
	
	var parametri = iden_remote_anag + '@' + cognome + '@' + nome + '@' + data + '@' + sesso;
	
	//alert(parametri);

	CJsGestAnagRemotaLagosanto.esiste_anagrafica(parametri, cbk_esiste_anag_lagosanto);
}


function cbk_esiste_anag_lagosanto(messaggio)
{	
	var iden_remote_anag = stringa_codici(iden);//array_id_anagremota
	
	var cognome = stringa_codici(array_cognome);
	
	var nome = stringa_codici(array_nome);
	
	var sesso = stringa_codici(array_sesso);
	
	var data = stringa_codici(array_data);
	
	var parametri = iden_remote_anag + '@' + cognome + '@' + nome + '@' + data + '@' + sesso;
	
	//alert(parametri);
	
	if(messaggio == 'NO_RECORD_IN_LOCALE')
	{
		if(confirm('Il paziente NON ESISTE in LOCALE.Si vuole procedere all\'inserimento?'))
		{
			CJsGestAnagRemotaLagosanto.ins_mod_anagrafica(parametri, cbk_ins_mod_anagrafica);
		}
		return;
	}
	else
		if(messaggio == 'SI_RECORD_IN_LOCALE')
		{
			if(confirm('Il paziente ESISTE in LOCALE.Si vuole procedere all\'aggiornamento?'))
			{
				CJsGestAnagRemotaLagosanto.ins_mod_anagrafica(parametri, cbk_ins_mod_anagrafica);
			}
			else
			{
				if(confirm('Si vuole procedere all\'inserimento di un omonimo?'))
				{
					parametri += '@I';
					CJsGestAnagRemotaLagosanto.ins_mod_anagrafica(parametri, cbk_ins_mod_anagrafica);
				}
			}
			return;
		}
}

function cbk_ins_mod_anagrafica(anagIden)
{
	//alert('anag locale ' + anagIden);
	
	CJsGestAnagRemotaLagosanto = null;
	
	chiudi();
}



function chiudi()
{
	opener.aggiorna();
	self.close();
}


function cbk_esiste_anag_Conegliano(messaggio)
{	
	var iden_remote_anag = stringa_codici(iden);//array_id_anagremota
	
	var cognome = stringa_codici(array_cognome);
	
	var nome = stringa_codici(array_nome);
	
	var sesso = stringa_codici(array_sesso);
	
	var data = stringa_codici(array_data);
	
	var parametri = iden_remote_anag + '@' + cognome + '@' + nome + '@' + data + '@' + sesso;
	
	
			
				if(confirm('Si vuole procedere all\'inserimento di un omonimo?'))
				{
					parametri += '@I';
					CJsGestAnagRemotaLagosanto.ins_mod_anagrafica(parametri, cbk_ins_mod_anagrafica);
				}
			
			return;
		}




function importa_paziente_conegliano(tipo_operazione)
{
	var iden_remote_anag = stringa_codici();

	alert('IDEN REMOTO: ' + iden_remote_anag);
	
	if(iden_remote_anag == '')
	{
		alert(ritornaJsMsg('selezionare'));//Prego, effettuare una selezione
		return;
	}
	
	var cognome = stringa_codici(array_cognome);
	
	var nome = stringa_codici(array_nome);
	
	var sesso = stringa_codici(array_sesso);
	
	var data = stringa_codici(array_data);
	
	var parametri = iden_remote_anag + '@' + cognome + '@' + nome + '@' + data + '@' + sesso;
	
	//alert(parametri);

	CJsGestAnagRemotaLagosanto.esiste_anagrafica(parametri, cbk_esiste_anag_Conegliano);
}