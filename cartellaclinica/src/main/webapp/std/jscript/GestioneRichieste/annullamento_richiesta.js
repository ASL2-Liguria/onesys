/*
	Funzione richiamata all'onLoad della pagina
	NB se metto il focus al campo non funziona correttamente la pageModal.js
	NB2 ho eliminato la chiamata alla funzione pageModal.js dalla classe CAnnullamentoRichiesta
*/
function setInizio()
{
	/*alert(opener.FinestraAnnullamentoParametri);
	
	for (var i in opener.FinestraAnnullamentoParametri){
		alert(i+':'+opener.FinestraAnnullamentoParametri[i]);
	}*/

	 if(opener.FinestraAnnullamentoParametri.tipo_utente=='M'){
		$('#lblMedPrescr').parent().parent().hide();
	 }
	 else{
		 $('#txtMedPrescr').attr('disabled', 'disabled');
	 }
		
	document.dati.motivo_annullamento.focus();
}


/**
Funzione richiamata dall'annullamento di una richiesta di Whale parte invio richieste
*/
function inserisciMotivazione(){

	var argsVariable
	var richiediCredenziali;

	richiediCredenziali	= opener.top.baseReparti.getValue('','richiediCredenzialiAnnullaRichiesta');

	/*if(opener.top.baseUser.LOGIN == 'arry'){
		alert('Alert Solo Per Admin \n - Motivo Inserito: ' + document.dati.motivo_annullamento.value + '\n - Nome Opener: ' + opener.name + '\n - Richiesta Credenziali: ' + richiediCredenziali);
	}*/
	
	if (richiediCredenziali == 'S')
	{
		var answer = window.showModalDialog("bolwincheckuser",argsVariable,"dialogWidth:380px; dialogHeight:200px; center:yes");
		if (!answer)
		{
			// autenticazione Fallita
			return;
		}

	}

	try{
		
		 if(opener.FinestraAnnullamentoParametri.tipo_utente!='M' && $('#Hiden_MedPrescr').val()=='' && opener.FinestraAnnullamentoParametri.tipologia=='CONSULENZA'){
			 alert('Inserire il medico richiedente');
			 return;
		 }
		
		opener.FinestraAnnullamentoParametri.callBackOk(document.dati.motivo_annullamento.value,document.dati.Hiden_MedPrescr.value);
	}
	catch(e){
		//alert('1: ' + e.description);
	}
	try{
		chiudi();
	}
	catch(e){
		self.close();
	}
}


function inserisci_motivazione()
{
	var doc = document.dati;
	doc.action = 'SL_MotivoAnnullamentoRichiesta';
	doc.target = 'upd_testata_richieste';
	
	//alert(doc.iden_richiesta.value);
	//alert(doc.motivo_annullamento.value);
	
	if(doc.motivo_annullamento.value == '')
	{
		alert(ritornaJsMsg("ins_motivazione"));//alert('Prego, inserire la motivazione dell'annullamento della richiesta');
		return;
	}
	
	var win_upd = window.open("","upd_testata_richieste", "top=0,left=1000000000");
	if (win_upd)
	{
		win_upd.focus();
	}
	else
	{
		win_upd = window.open("","upd_testata_richieste", "top=0,left=1000000000");
	}
	
	doc.submit();
	
	chiudi();
	//win_upd.close();
}


/*
	Aggiorno la worklist delle richiesta con i parametri della ricerca
	e chiudo la finestra per l'inserimento della motivazione dell'annullamento della richiesta
*/
function chiudi()
{
	opener.aggiorna();
	self.close();
}