function non_cancellazione()
{
	try{
		/*Cancellazione mediante richiesta password*/
		opener.opener.aggiorna_chiudi_canc();
		opener.close();
	}
	catch(e)
	{
		/*Cancellazione con sola finestra di conferma cancellazione*/
		opener.aggiorna_chiudi_canc();
	}
	
	alert('Il paziente non potrà essere cancellato poichè ha esami associati.');
	
	self.close();
}

function cancellazione()
{
	try{
		/*Cancellazione mediante richiesta password*/
		opener.opener.aggiorna_chiudi_canc();
		opener.close();
		
		try{
			/*Caso della cancellazione di un paziente dalla Riconcilia/Sposta Esami*/
			opener.opener.parent.RicPazMergeFrame.reloadMerge();
		}
		catch(e){
		}
	}
	catch(e)
	{
		/*Cancellazione con sola finestra di conferma cancellazione*/
		opener.aggiorna_chiudi_canc();
	}
	
	alert('Il paziente è stato cancellato.');
	
	self.close();
	
}

function anag_remote()
{
	try{
		/*Cancellazione mediante richiesta password*/
		opener.opener.aggiorna_chiudi_canc();
		opener.close();
	}
	catch(e)
	{
		/*Cancellazione con sola finestra di conferma cancellazione*/
		opener.aggiorna_chiudi_canc();
	}
	
	alert('Il paziente non potrà essere cancellato poichè è collegato ad anagrafiche remote.');
	
	self.close();
}

/*Funzioni della finestra di inserimento password per la gestione della
  cancellazione di una anagrafica.
 */
function cancellaANAG()
{
	if(document.form.pwd.value == '')
	{
		alert('Prego, inserire la password.');
		document.form.pwd.focus();
		return;
	}
	var webpassword = document.form.hpwd.value;
	var pwd_inserita = document.form.pwd.value;
	
	if(webpassword != pwd_inserita)
	{
		alert('Password errata.');
		document.form.pwd.value = '';
		document.form.pwd.focus();
		return;
	}
	else
	{
		var finestra = window.open("","winCancPaz","top=0,left=100000000");
		if (finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra = window.open("","winCancPaz","top=0,left=100000000");
		}
		opener.document.form_canc_paz.iden_paz_canc.value = opener.stringa_codici(opener.iden);
        opener.document.form_canc_paz.submit();
	}
}

function annullaANAG()
{
	opener.aggiorna_chiudi();
	self.close();
}