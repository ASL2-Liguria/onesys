function check_aggiorna()
{
	var id_s = document.filtri.selSala.value;
	var id_m = document.filtri.selMac.value;
	var id_a = document.filtri.selArea.value;
	
	parent.frameElaborazione.frameDati.nuovo();
	parent.frameElaborazione.frameDati.document.impostazioni.Hiden_sal.value = id_s;
	parent.frameElaborazione.frameDati.document.impostazioni.Hiden_mac.value = id_m;
	parent.frameElaborazione.frameDati.document.impostazioni.Hiden_are.value = id_a;
	
	parent.frameElaborazione.frameDati.refresh_giorni();
	parent.frameRiepilogo.aggiorna(id_s, id_m, id_a, '', '', 'WK_DISABILITA_MACCHINA_DETTAGLIO', 'disabilita_macchina_dettaglio', 'modifica_dettaglio(this.sectionRowIndex);');
}

function chiudi()
{
	top.close();
}