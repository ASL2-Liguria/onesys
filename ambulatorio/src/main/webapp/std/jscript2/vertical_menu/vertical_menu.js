function apri(valore)
{
	var url = 'blank';
	
	switch(valore)
	{
		case 'worklist':
             url = 'worklistInizio';
			 break;
		
		// Genera Agenda...
		case 'genera_agenda':
			url = "agendaInizio";
			break;
		
		// Prenota esame
		case 'prenotazione':
			url = "prenotazioneFrame?visual_bt_direzione=S&servlet=sceltaEsami%3Ftipo_registrazione%3DP%26cmd_extra%3Dparent.parametri%253Dnew+Array('PRENOTAZIONE')%3B%26next_servlet%3Djavascript:next_prenotazione();%26Hclose_js%3Dchiudi_prenotazione()%3B&events=onunload&actions=libera_all('" + baseUser.IDEN_PER + "', '" + basePC.IP + "');&visual_bt_direzione=N";
			break;
		
		// Consulta prenotazione
		case 'consulta_prenotazione':
			url = "prenotazioneFrame?servlet=consultazioneInizio%3Ftipo%3DCDC&events=onunload&actions=libera_all('" + baseUser.IDEN_PER + "', '" + basePC.IP + "');";
			break;
		
		// Disabilita macchine/ Modifica orari
		case 'disab_mac':
			url = "disabilitaMacchinaInizio";
			break;
		
		// Disabilita macchine/ Modifica orari
		case 'statistiche_prenotazione':
			url = "statisticheEsami";
			break;

	}
	
	document.apriAttesa('Caricamento in corso...', true);
	
	/*jQuery('#oIFWork').ready(function(){document.chiudiAttesa()});*/
	jQuery('#oIFWork').attr('src', url);
}