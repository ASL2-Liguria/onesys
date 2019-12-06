/*
	Funzione richiamata all'onLoad della pagina
	NB se metto il focus al campo non funziona correttamente la pageModal.js
	NB2 ho eliminato la chiamata alla funzione pageModal.js dalla classe CAnnullamentoRichiesta
*/
function onLoad()
{
	//document.form_ins_motivazione.motivo_annullamento.focus();
}

function inserisci_motivazione()
{
	var doc = document.form_ins_motivazione;
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
	win_upd.close();
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