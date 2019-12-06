function init()
{
	var oggetto = document.getElementById("oTable");
	if (oggetto)
		oggetto.ondblclick = function(){abilita_disabilita();}
}

function disattiva()
{
	var iden_da_disabilitare = iden;
	
	//alert('FILTRI DA DISABILITARE: ' + iden_da_disabilitare);

	CJsFiltroStato.abilita_disabilita('@' + iden_da_disabilitare, cbkFiltroStato);
}


function attiva()
{
	var iden_da_abilitare = iden;
	
	//alert('FILTRI DA ABILITARE: ' + iden_da_disabilitare);

	CJsFiltroStato.abilita_disabilita(iden_da_abilitare + '@', cbkFiltroStato);
}

function abilita_disabilita()
{
	var tabFiltriStato_iden = stringa_codici(iden);

	if(tabFiltriStato_iden == '')
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}
	
	var tabFiltriStato_abilitato = stringa_codici(abilitato);
	
	//alert('IDEN ' + tabFiltriStato_iden);
	//alert('ABILITATO ' + tabFiltriStato_abilitato);
	
	var filtri_da_disabilitare = '';
	var filtri_da_abilitare    = '';
	
	var abil_disabil = '';
	var elenco_iden = '';
	
	try{
		abil_disabil = tabFiltriStato_abilitato.split('*');
	}
	catch(e){
		abil_disabil = tabFiltriStato_abilitato;
	}
	try{
		elenco_iden = tabFiltriStato_iden.split('*');
	}
	catch(e){
		elenco_iden = tabFiltriStato_iden;
	}
	
	var iden_da_abilitare    = '';
	var iden_da_disabilitare = '';
	
	if(abil_disabil.length == 1)
	{
		if(abil_disabil == 'S')
			filtri_da_disabilitare += elenco_iden;
		else
			filtri_da_abilitare += elenco_iden;
			
		iden_da_abilitare    = filtri_da_abilitare;
	    iden_da_disabilitare = filtri_da_disabilitare;
	}
	else
	{
		for(i = 0; i < abil_disabil.length; i++)
		{
			if(abil_disabil[i] == 'S')
			{
				filtri_da_disabilitare += elenco_iden[i] + ', ';
			}
			else
			{
				filtri_da_abilitare += elenco_iden[i] + ', ';
			}
		}

		try{
			iden_da_abilitare  = filtri_da_abilitare.substring(0, filtri_da_abilitare.length-2);
		}
		catch(e){
			iden_da_abilitare = filtri_da_abilitare;
		}
		try{
			iden_da_disabilitare = filtri_da_disabilitare.substring(0, filtri_da_disabilitare.length-2);
		}
		catch(e){
			iden_da_disabilitare = filtri_da_disabilitare;
		}
	}
	
	//alert('FILTRI DA ABILITARE: ' + iden_da_abilitare);
	//alert('FILTRI DA DISABILITARE: ' + iden_da_disabilitare);

	CJsFiltroStato.abilita_disabilita(iden_da_abilitare + '@' + iden_da_disabilitare, cbkFiltroStato);
}

function inserimento()
{
	document.form.action='SL_GestioneStato';
	document.form.target='gestione_stato';
	document.form.operazione.value = 'INS';
	window.open('', 'gestione_stato', 'width=1000,height=600, status=yes, top=10,left=10');
	document.form.submit();
}


function modifica()
{
	var tabFiltriStato_valore_filtro 			 = stringa_codici(valore_filtro);
	var tabFiltriStato_nome_filtro   			 = stringa_codici(nome_filtro);
	var tabFiltriStato_iden          			 = stringa_codici(iden);
	
	if(tabFiltriStato_iden == '')
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}
	
	//alert('NOME FILTRO: ' + tabFiltriStato_nome_filtro + ' - VALORE FILTRO: ' + tabFiltriStato_valore_filtro);
	try
	{
		var selezionati = tabFiltriStato_valore_filtro.split('*');
	
		if(selezionati.length > 1)
		{
			alert(ritornaJsMsg('singola_selezione'));
			return;
		}
	}
	catch(e)
	{
	}
	
	document.form.action='SL_GestioneStato';
	document.form.target='gestione_stato';
	window.open('', 'gestione_stato', 'width=1000,height=600, status=yes, top=10,left=10');
	document.form.tabFiltriStato_valore_filtro.value = tabFiltriStato_valore_filtro;
	document.form.tabFiltriStato_nome_filtro.value = tabFiltriStato_nome_filtro;
	document.form.tabFiltriStato_iden.value = tabFiltriStato_iden;
	document.form.operazione.value = 'MOD';
	document.form.submit();
	
}

function cancellazione()
{
	var tabFiltriStato_iden = stringa_codici(iden);
	if(tabFiltriStato_iden == '')
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}
	//alert('iden da cancellare ' + tabFiltriStato_iden);
	CJsFiltroStato.cancellazione(tabFiltriStato_iden, cbkFiltroStato);
}

function cbkFiltroStato(errore)
{
	if(errore != '')
		alert(errore);
	aggiorna();
}


function aggiorna()
{
	opener.gestioneStato(opener.document);
}


function applica()
{
	var iden_stati_abilitati  	  = '';
	var nomi_filtri_abilitati 	  = '';
	var where_condition_abilitate = '';
	var num_stati_attivi      	  = 0;

	for(i = 0; i < abilitato.length; i++)
	{	
		if(abilitato[i].toString() == 'S')
		{
			iden_stati_abilitati  += iden[i] + ', ';
			nomi_filtri_abilitati += nome_filtro[i] + ', ';
			num_stati_attivi = num_stati_attivi + 1;
			where_condition_abilitate += where_cond_filtro[i] + ' OR ';
		}
	}
	
	var iden_stati = iden_stati_abilitati.substring(0, iden_stati_abilitati.length-2);
	var nome_stati = nomi_filtri_abilitati.substring(0, nomi_filtri_abilitati.length-2);
	
	opener.document.all.hstato_iden.value = iden_stati;
	
	opener.document.all.hstato_whereCondition.value = where_condition_abilitate.substring(0, where_condition_abilitate.length - 4);

	opener.document.all.tabella_stato.title = nome_stati;
	
	var label_stati = nome_stati;
	if(nome_stati.length > 25)
		label_stati = nome_stati.substring(0,25) + '...';
	
	if(nome_stati.length == 0)
		label_stati = ritornaJsMsg('nfs');//'Nessun Filtro sullo Stato';
		
		
	opener.document.all.td_FILTRI_STATO.innerText = label_stati;//'N° Stati sel.:' + num_stati_attivi;

	//alert('NOME ATTIVI: ' + nome_stati);
	//alert('IDEN ATTIVI: ' + iden_stati);
	//alert('NUM ATTIVI:  ' + num_stati_attivi);
	
	//alert('iden stato ' + opener.document.all.hstato_iden.value);
	//alert('where cond stato ' + opener.document.all.hstato_whereCondition.value);
	
	/*
	Nella tabella FILTRI non si azzera mai il campo lastvaluechar per tipo = 14
	ma la wherecondition risulta corretta perchè guardo la tabella TAB_FILTRI_STATO.
	Evito il seguente update:
	CJsFiltroStato.update_tabella_filtri(iden_stati, cbkUpdateTabellaFiltri);
	*/
	
	self.close();
}

/*
function cbkUpdateTabellaFiltri(where_cond_stato)
{
	self.close();
}
*/


function chiudi()
{
	//opener.parent.parent.parent.mainFrame.workFrame.document.location.replace("worklistInizio");
	self.close();
}