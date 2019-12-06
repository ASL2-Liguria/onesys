/*
	Metodo privato per la costruzione della funzione <B>Java Script</B> esegui

* @param winName Indica il nome della finestra quando si esegue la <B>window.open</B>
* @param nomeForm Indica il nome del Form dove sono contenuti i dati necessari
* @return Ritorna la funzione <B>Java Script</B> esegui
*/	 
function esegui(valore)
{
	var val 			= valore;
	var idenFiltro	    = '';
	var tipi 			= '';
	var arr_tipi 		= '';
	var arr_iden_filtri = '';
	var arr_tipi_ab_dis = '';
	var arr_iden_filtri_ab_dis = '';
		
	if(valore == '' || valore != 'ATTDIS') 
		return;
	
	idenFiltro = stringa_codici(iden_filtri);
	tipi = stringa_codici(tipo);

	if(idenFiltro == '')
	{
		alert(ritornaJsMsg("MSG_EFFETTUARESELEZIONE"));
		return;
	}

	if(vettore_indici_sel.length == 1)
	{
		if(!gestione_alert(tipi))
		{
			arr_tipi_ab_dis += tipi + "*";
			arr_iden_filtri_ab_dis += idenFiltro + "*";
		}
	}
	else
	{
		arr_tipi = tipi.split(['*']);
		arr_iden_filtri = idenFiltro.split(['*']);
		for(i = 0; i < arr_tipi.length; i++)
		{
			if(!gestione_alert(arr_tipi[i]))
			{
				arr_tipi_ab_dis += arr_tipi[i] + "*";
				arr_iden_filtri_ab_dis += arr_iden_filtri[i] + "*";
			}
		}
	}
	if(arr_iden_filtri_ab_dis != '' && arr_tipi_ab_dis != '')
	{
		arr_tipi_ab_dis = arr_tipi_ab_dis.substring(arr_tipi_ab_dis.length-1, '');
		arr_iden_filtri_ab_dis = arr_iden_filtri_ab_dis.substring(arr_iden_filtri_ab_dis.length-1, '');
		abilita_disabilita(arr_tipi_ab_dis, arr_iden_filtri_ab_dis);
	}
}
					
				
function abilita_disabilita(tipo_filtro, iden_filtro)
{
	var webuser = stringa_codici(user_name).split(['*']);

	var scelta = confirm(ritornaJsMsg("CNF_PROCEDEREOPERAZIONE"));
	if(scelta == true)
	{
		document.form_hidden.hIdenFilter.value = iden_filtro;
		document.form_hidden.hFilterType.value = tipo_filtro;
		document.form_hidden.webuser.value = webuser[0];
		document.form_hidden.submit();
	}
	return;
}
					

function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}

function gestione_alert(tipo)
{
	var tipo_x = false;
	if(tipo == 1 || tipo == 100)
	{
		alert(ritornaJsMsg('alert_metodica'));//alert('Il filtro sulla metodica non può essere disabilitato');
		tipo_x = true;
	}
	if(tipo == 2)
	{
		alert(ritornaJsMsg('alert_cdc'));//alert('Il filtro sui centri di costo non può essere disabilitato');
		tipo_x = true;
	}
	if(tipo == 4)
	{
		alert(ritornaJsMsg('alert_sala'));//alert('Il filtro sulle sale non può essere disabilitato');	
		tipo_x = true;
	}
	return tipo_x;
}


/*
* Metodo privato per la costruzione della funzione <B>Java Script</B> sendData.
* Tale funzione era richiamata quando vi era la scelta dell'utente su cui gestire i filtri
* e vi era un pulsante 'Applica'
*
* @return Ritorna la funzione <B>Java Script</B> sendData

function sendData()
{
	document.form_hidden.hIdenUser.value=document.frmSearch.lstUser.value;
	document.frmSearch.submit();
}
*/