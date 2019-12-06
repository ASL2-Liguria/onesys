/*
	Inserimento di un paziente dal secondo frame contenente i risultati della parte di ricerca
	nel terzo frame di merge esami
*/
function riconcilia_esami()
{
	var doc = document.form_merge_paz;
	var idenAnag = '';
	var certificato = '';
	var READONLY = '';
	
	idenAnag = stringa_codici(iden);
	certificato = stringa_codici(array_certificato);
	READONLY = stringa_codici(readonly);
	
	if(idenAnag == 0)
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}
	else
	{
		doc.iden.value = idenAnag;
		doc.certificato.value = certificato;
		doc.readonly.value = READONLY;
		
		varRicEsa = window.open("","winRicEsa","top=1000000,left=0");
		
		doc.submit();
	}
}

function reloadFrame()
{
	opener.parent.RicPazUtilityFrame.location.reload("RiconciliaPazienti");
	self.close();
}

/*
	Funzione richiamata dalla menù di contesto 'Rimuovi da Elenco' nel terzo frame della Ricerca del Paziente
	Passaggio dell'iden del paziente (che si vuole eliminare dalla lista di selezione)
	alla servlet OperazioniTabRiconciliazione che effettua l'operazione fisica di cancellazione dalla tabella 
	tab_riconciliazione in base al webuser
*/
function canc_paz_tab_riconciliazione()
{
	var idenAnag = '';
	idenAnag = stringa_codici(iden);
	if(idenAnag == 0)
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}
else
	{
		varAnag = window.open("","winOpTabRiconc","top=1000000,left=0");
		document.form_merge_paz.iden_paz_canc.value = idenAnag;
		document.form_merge_paz.submit();
		reloadMerge();
		varAnag.close();
	}
}

function reloadMerge()
{
	location.reload("RiconciliaPazienti");
}


/*
	Eliminazione di entrambi i pazienti selezionati ed inseriti in tab_riconciliazione
	premendo il pulsante 'Annulla'
*/
function elimina_pazienti_tab_riconciliazione()
{
	varDel = window.open("","winOpTabRiconc","top=1000000,left=0");
	document.form_merge_paz.canc_paz_web_user.value = 'true';
	document.form_merge_paz.submit();
	
	reloadMerge();
	varDel.close();
}

/*
	Funzione utilizzata per effettuare il cambio fra paziente sorgente e destinazione (tab_riconciliazione.tipo)
	Viene passata alla servlet OperazioniTabRiconciliazioni l'iden del paziente sorgente
*/
function cambia_sorgente_destinazione()
{
	document.form_merge_paz.iden_sorgente.value = iden[0];
	varCambia = window.open("","winOpTabRiconc","top=1000000,left=0");
	document.form_merge_paz.submit();
}

/*
	Funzione che passa alla servlet MergeInizio i 2 iden_anag su cui effettuare il merge
	il primo iden passato corrisponde al paziente sorgente mentre il secondo a quello di destinazione
*/
function sposta_esami()
{
	document.form_merge_paz.id_sorgente.value = iden[0];
	document.form_merge_paz.riconcilia.value = 'false';
	varSpostaEsa = window.open("","winOpTabRiconc","top=1000000,left=0");
	document.form_merge_paz.submit();
}

/*
	Funzione chiamata con la pressione del pulsante 'Riconcilia' che chiamerà la stored procedura
*/
function riconcilia()
{
	var doc = document.form_merge_paz;
	var READONLY = null;
	var certificato = null;
	var iden_sorgente = null;
	if(baseUser.LOGIN == 'system'){
		
	}
	certificato = array_certificato[1];
	READONLY = array_readonly[1];
	iden_sorgente = iden[0];
	
	if(certificato == 'S' || READONLY == 'S'){
		alert('Attenzione: il paziente destinazione deve essere una posizione anagrafica NON CERTIFICATA e NON READONLY');
		return;
	}
	
	/****blocco dei merge anagrafici se l'anagrafica sorgente è pinnata****/
	dwr.engine.setAsync(false);	
	toolKitDB.getResultData("select id4 from radsql.cod_est_anag where iden_anag = " + iden_sorgente, function(returnValue) {
		if(returnValue[0] != ''){
			alert('Attenzione: il paziente sorgente ha un identificativo remoto, impossibile procedere con la riconciliazione anagrafica');
			return;
		}
		else{
			var scelta = confirm(ritornaJsMsg('confirm_riconcilia'));
			if(scelta == true) {			

				doc.riconcilia.value = 'true';
				doc.id_sorgente.value = iden[0];
				varRic = window.open("","winOpTabRiconc","top=1000000,left=0");
				doc.submit();
			}
		}
		
	});
	dwr.engine.setAsync(true);
}
/*
function riconciliaOLD()
{
	var doc = document.form_merge_paz;
	var READONLY = null;
	var certificato = null;
	
	certificato = array_certificato[1];
	READONLY = array_readonly[1];
	
	if(certificato == 'S' || READONLY == 'S'){
		alert('Attenzione: il paziente destinazione deve essere una posizione anagrafica NON CERTIFICATA e NON READONLY');
		return;
	}
	
	var scelta = confirm(ritornaJsMsg('confirm_riconcilia'));
    if(scelta == true) 
	{
		doc.riconcilia.value = 'true';
		doc.id_sorgente.value = iden[0];
		varRic = window.open("","winOpTabRiconc","top=1000000,left=0");
		doc.submit();
	}
}*/

function apri_chiudi()
{
	ShowHideLayer('div');
}
