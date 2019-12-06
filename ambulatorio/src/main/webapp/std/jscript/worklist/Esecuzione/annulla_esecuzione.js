var finestra = '';

function annulla_esecuzione()
{
	if (conta_esami_sel()== 0)
	{
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	
	/*Controllo se il paziente è READONLY*/
	var iden_anag = stringa_codici(array_iden_anag);
	
	if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
	{
		alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
		return;		
	}
	/**/
	
	
	check_accettato_eseguito_noRefertato();
	
	//check_delete_appropriatezza();
}

/*
	Funzione che effettua il controllo per l'annullamento dell'esecuzione(multipla)
	ESAMI.ACCETTATO == 1
	ESAMI.ESEGUITO  == 1
	ESAMI.IDEN_REF  is null
*/
function check_accettato_eseguito_noRefertato()
{
	/*
	L'esame deve essere accettato ed eseguito.
	Non posso annullare l'esecuzione se l'esame è refertato (ESAMI.iden_ref != null).
	*/
	try
	{
		var accettato = stringa_codici(array_accettato).split('*');
		var eseguito  = stringa_codici(array_eseguito).split('*');
		var iden_ref  = stringa_codici(array_iden_ref).split('*');
		/*alert(accettato + "," + array_accettato);
		alert(eseguito + "," + array_eseguito);
		alert(iden_ref + "," + array_iden_ref);*/
		for(i = 0; i < conta_esami_sel(); i++)
		{
			if(accettato[i] == '0')
			{
				//alert('no accettato');
				alert(ritornaJsMsg("impossibile_togliere_eseguito")+ "\nEsame non accettato");
				return;
			}
			if(eseguito[i] == '0')
			{
				//alert('no eseguito');
				alert(ritornaJsMsg("impossibile_togliere_eseguito")+ "\nEsame non eseguito");
				return;
			}
			if ((iden_ref[i] != '-1') && (typeof(iden_ref[i])!="undefined") && (iden_ref[i] != ''))		
			{
				//alert('già refertato');
				alert(ritornaJsMsg("impossibile_togliere_eseguito")+ "\nEsame gia' refertato");
				return;
			}
		}
	}
	catch(e)
	{
		accettato = stringa_codici(array_accettato);
		eseguito  = stringa_codici(array_eseguito);
		iden_ref  = stringa_codici(array_iden_ref);
		if(accettato == '0')
		{
			//alert('no accettato');
			alert(ritornaJsMsg("impossibile_togliere_eseguito")+ "\nEsame non accettato");
			return;
		}
		if(eseguito == '0')
		{
			//alert('no eseguito');
			alert(ritornaJsMsg("impossibile_togliere_eseguito")+ "\nEsame non eseguito");
			return;
		}
		if ((iden_ref[i] != '-1') && (typeof(iden_ref[i])!="undefined") && (iden_ref[i] != ''))		
		{
			//alert('Già refertato');
			alert(ritornaJsMsg("impossibile_togliere_eseguito")+ "\nEsame gia' refertato");
			return;
		}
	}
	
	var ins_pwd = null;
	var cancella = null;
	
	cancella = confirm(ritornaJsMsg('conferma_canc'));//Sei sicuro di voler annullare l'esecuzione degli esami selezionati?
	if(cancella)
	{
		if(baseUser.OB_INS_PWD_ESECUZIONE == 'S')
		{
			ins_pwd = window.open('SL_GestioneUtentePwd?provenienza=ANNULLA_ESECUZIONE&login=N&next_function=opener.apriFinestraAnnullamentoEsecuzione()','wndEsec', 'height=250,width=400,scrollbars=no,top=200,left=300');
		}
		else
			apriFinestraAnnullamentoEsecuzione();
	}
}

/**
*/
function apriFinestraAnnullamentoEsecuzione(){
	var iden_esame = null; 
	var finestra = null;
	
	iden_esame = stringa_codici(array_iden_esame);
	//alert('apriFinestraAnnullamentoEsecuzione: ' + iden_esame);

	finestra = finestra = window.open("SL_AnnullaEsecEsame?esame="+iden_esame+"", "", "status=yes,scrollbars=no,top=10, left=10000");
	if (finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra = window.open("SL_AnnullaEsecEsame?esame="+iden_esame+"","","status=yes,scrollbars=no,top=10, left=10000");
	}
}


/*
Funzione che chiama il dwr annullamentoGestione per effettuare la cancellazione delle schede di appropriatezza
eventualemente inserite in esecuzione (quindi lo stato dell'esame deve essere EQ; se ha la Y non verranno cancellati
									   i record in APPROPRIATEZZA_ESAME e nella tabella specifica)
*/
function check_delete_appropriatezza()
{
	var iden_esame = opener.stringa_codici(opener.array_iden_esame);
	annullamentoGestione.annullaAppr(iden_esame, aggiornamento);
}

function aggiornamento(message)
{
	// **********************
	var lista = new Array();
	var iden_esame = opener.stringa_codici(opener.array_iden_esame).replace(/\*/g, ',');
	lista.push(iden_esame);
	lista.push("");
//				alert(iden_esame)
	try{
		var out = opener.top.executeStatement('worklist_main.xml','updateStatoCiclo',lista);
		if (out[0] != 'OK') {
			alert("Errore " + out);
		}
	}
	catch(e){
		alert(e.description);
	}
	// *********************
	annullamentoGestione = null;
	if(message != '')
	{
		alert(message);
		return;
	}
	opener.aggiorna();
	self.close();
}