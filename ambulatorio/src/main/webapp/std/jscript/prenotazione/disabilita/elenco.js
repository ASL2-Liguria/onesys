function gestione()
{
	var id_sal = stringa_codici(a_iden_sal);
	var id_mac = stringa_codici(a_iden_mac);
	var id_are = stringa_codici(a_iden_are);
	var url = 'gestioneDisabilitaMacchina?Hiden_sal=' + id_sal + '&Hiden_mac=' + id_mac + '&Hiden_are=' + id_are;
	var wnd = window.open(url, 'gestione', 'status = yes, scrollbars = no, height = 100, width = 100, top = 0, left = 0');
	
	if(wnd)
	{
		wnd.focus();
	}
	else
	{
		wnd = window.open(url, 'gestione', 'status = yes, scrollbars = no, height = 100, width = 100, top = 0, left = 0');
	}
}

function cancella()
{
	var id_dett = stringa_codici(a_iden_dettaglio);
	
	disabilitaMacchinaDWR.elimina_dettaglio(id_dett);
	
	aggiorna();
}

function aggiorna(id_sala, id_macchina, id_area, da_data, a_data, wk_name, wk_menu, wk_onclick)
{
	if(id_sala == null)
	{
		id_sala = document.elenco.Hiden_sal.value;
	}
	
	if(id_macchina == null)
	{
		id_macchina = document.elenco.Hiden_mac.value;
	}
	
	if(id_area == null)
	{
		id_area = document.elenco.Hiden_are.value;
	}
	
	if(da_data == null)
	{
		da_data = document.elenco.da_data.value;
	}
	
	if(a_data == null)
	{
		a_data = document.elenco.a_data.value;
	}
	
	if(wk_name == null)
	{
		wk_name = document.elenco.wk_name.value;
	}
	
	if(wk_menu == null)
	{
		wk_menu = document.elenco.wk_menu.value;
	}
	
	if(wk_onclick == null)
	{
		wk_onclick = document.elenco.wk_onclick.value;
	}
	
	document.location.replace('disabilitaMacchinaElenco?wk_name=' + wk_name + '&wk_menu=' + wk_menu + '&wk_onclick=' + wk_onclick + '&Hiden_sal= ' + id_sala + '&Hiden_mac=' + id_macchina + '&Hiden_are=' + id_area + '&da_data=' + da_data + '&a_data=' + a_data);
}

function refresh_wk()
{
	document.elenco.target = '_self';
	document.elenco.method = 'get';
	document.elenco.action = 'disabilitaMacchinaElenco';
	document.elenco.submit();
}

function modifica_dettaglio(idx)
{
	var cod = a_iden_dettaglio[idx];
	
	parent.frameElaborazione.frameDati.document.location.replace('gesDisabMaccElabImpostazioni?Hiden_dettaglio=' + cod);
	parent.frameElaborazione.frameGiorni.document.location.replace('gesDisabMaccElabGiorni?Hiden_dettaglio=' + cod);
}

function cancella_dettaglio()
{
	var id_dett = stringa_codici(a_iden_dettaglio);
	
	disabilitaMacchinaDWR.elimina_dettaglio(id_dett);
	
	parent.frameElaborazione.frameDati.nuovo();
	
	aggiorna();
}