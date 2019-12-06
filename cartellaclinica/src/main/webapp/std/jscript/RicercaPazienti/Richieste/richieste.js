/*
  Funzione richiamata dalla Ricerca del paziente per aprire la scheda Esame
  
  @param esame_paz indica gli iden degli esami di tutte le richieste 
  @param accettazione_prenotazione  distingue 2 casi:
  		 se nella pagina precedente è stata scelta la voce Accettazione (call_accettazione_prenotazione()) 
		 conterrà la lettera A = Accettazione;
		 se è stata scelta Prenotazione (=> da FARE)
  @param campi_scheda_esame contiene l'elenco dei campi della tabella infoweb.TESTATA_RICHIESTE TR che occorrono per 
  							valorizzare i campi della scheda esame e sono:
							TR.data_richiesta
							TR.ora_richiesta
							TR.cod_dec_med
							TR.cod_dec_pro
							TR.cod_dec_sala
							TR.note
							TR.quadro_cli
							TR.quesito
							TR.urgenza
							TR.iden
							
  */
function accettazione_prenotazione(esame_paz, accettazione_prenotazione, campi_scheda_esame)//infowebAnag_iden, 
{	
	if(accettazione_prenotazione == 'A')
		apri_accettazione(infowebAnag_iden, accettazione_prenotazione + 'R', esame_paz, campi_scheda_esame);
	else
		if(accettazione_prenotazione == 'P')
			alert('Richiesta di una prenotazione');
}

function apri_accettazione(infowebAnag_iden, stato_esame, esame_paz, campi_scheda_esame)
{
	var doc = document.form_accetta_richiesta;
	doc.action = 'schedaEsame';
	doc.target = 'winAccettaRichieste';//workFrame
	
	var iden_anag = stringa_codici(iden);
	
	if(iden_anag == '')
	{
		alert(ritornaJsMsg("selezionare"));
		return;
	}

	doc.Hiden_anag.value 		 = iden_anag;//stringa_codici(array_iden);
	doc.tipo_registrazione.value = 'IR';//inserimento richieste
	doc.Hiden_esa.value 		 = esame_paz;//stringa_codici(iden_worklist);
	doc.Hiden_infoweb_anag.value = infowebAnag_iden;
	
	doc.data_acc.value           = campi_scheda_esame[0];
	doc.ora_acc.value 			 = campi_scheda_esame[1];
	doc.cod_dec_med.value 		 = campi_scheda_esame[2];
	doc.cod_dec_pro.value 		 = campi_scheda_esame[3];
	doc.cod_dec_sala.value 		 = campi_scheda_esame[4];
	doc.txtNote.value 			 = campi_scheda_esame[5];
	doc.txtQuadroClinico.value 	 = campi_scheda_esame[6];
	doc.txtQuesitoClinico.value  = campi_scheda_esame[7];
	doc.urgente.value  			 = campi_scheda_esame[8];
	doc.Hiden_infoweb_richiesta.value = campi_scheda_esame[9];
	doc.Hreparto.value 			 = campi_scheda_esame[10];

	 
	var win_scheda_esame = window.open('', 'winAccettaRichieste', 'width=1000, height=600, status=yes, top=0,left=0');
	doc.submit();
}

function aggiorna()
{
	//alert('aggiorna richieste');
	parent.RicPazRicercaFrame.applica();
}

/*
	Funzione richiamata dalla Gestione delle richieste in fase di accettazione o prenotazione
	che effettua la chiamata alla servlet per poter eseguire l'aggiornamento della tabella COD_EST_ANAG

function update_cod_est_anag(iden_anag_infoweb){
	/*iden_anag_radsql = stringa_codici(iden);
	if(iden_anag_radsql == '')
	{
		alert(ritornaJsMsg("selezionare_una_richiesta"));
		return;
	}
	document.form_accettazione_prenotazione_richiesta.tipo_connessione.value = 'DATA';
	document.form_accettazione_prenotazione_richiesta.tipo_operazione.value = 'UPD';
	var iden_anag_radsql = stringa_codici(iden);
	document.form_accettazione_prenotazione_richiesta.query.value = "update COD_EST_ANAG set iden_infoweb_anag = " + iden_anag_infoweb + " where iden_anag =" + iden_anag_radsql;
	var upd = window.open('','update','width=10,height=10, resizable = yes, status=yes, top=5000,left=5000');
	document.form_accettazione_prenotazione_richiesta.submit();
	upd.close();
}
*/