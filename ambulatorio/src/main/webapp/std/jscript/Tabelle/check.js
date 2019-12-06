/*GESTIONE DWR(Direct Web Remoting)*/

function checkForInsert(campo_select, nome_tabella, nome_campo, codice)
{
	var valori = campo_select + ", iden@" + nome_tabella + "@" + nome_campo + "@" + codice;
	if(codice != '' || nome_tabella == 'tab_fasce_orarie' || nome_tabella == 'tab_ref'){
		window.XMLHttpRequest = undefined;
		dwr.engine.setAsync(false);
		CJsCheck.checkCodiceUnivoco(valori, cbkJsCheck);
		dwr.engine.setAsync(true);
	}
}

/* 
 Funzione di callback della funzione CJsCheck.checkCodiceUnivoco
 @param msg contiene:
 primo parametro: 0: record non presente in tabella;
             	  1: record presente in tabella ed attivo(verrà richiamata la funzione js funzione() dalla funzione di callback);
              	  2: record presente in tabella ed inattivo(verrà chiesto all'utente se si vuole procedere alla riattivazione di tale 
		             record o meno);
              	  stringa di errore se la select restituisce una eccezione;
 secondo parametro:
 				  nome del campo che deve essere univoco
 terzo parametro:				  
				  iden del record nel caso in cui si voglia riattivare un record disattivo;
 quarto parametro:				  
				  nome della tebella sulla quale si sta lavorando;
 quinto parametro:
 				  valore del campo che deve essere univoco
*/
function cbkJsCheck(msg)
{
	//alert('parameti passati da CJsCheck.checkCodiceUnivoco: ' + msg);
	var spl = msg.split('@');
	message = spl[0];
	if(message == '0' || message == '1' || message == '2')
	{
		if(message == '0')
		{
			if(spl[3] == 'tab_ref')
			{
				funzione('inserimento');
			}
			return;
		}
		else
			if(message == '1')
				{
					/*record esistente ATTIVO*/
					alert(ritornaJsMsg('record_esistente'));//Il record è già presente nel database.Prego, modificare il campo codice
					funzione(spl[1]);
					return;	
				}
			else
			 	if(message == '2')
				{
			 		/*record esistente DISATTIVO*/
					riattivazione_record(spl[1], spl[2], spl[3], spl[4]);
				}
	}
	else
	{
		/*Eccezione*/
		CJsCheck = null;
		CJsCheckOrdineCdc = null;
		CJsCheckCodSirm = null;
		
		alert(message);
		try{
			chiudi_ins_mod();
		}
		catch(e){
		}
	}
}

/*
	Funzione che gestisce il caso in cui il record con il codice inserito esista
	già nel db ed è disattivo.
	Si può procedere all'attivazione o all'inserimento di un codice non esistente nel db
*/
function riattivazione_record(nome_campi, iden, nome_tabella, valore_campo)
{
	var riattiva = confirm(ritornaJsMsg('riattivare'));
    if(riattiva == true) 
	{
		dwr.engine.setAsync(false);
		CJsCheck.riattiva_record(nome_tabella + '@' + iden + '@' + valore_campo, cbkRiattivaRecord);
		dwr.engine.setAsync(true);
	}
	else
	{
		funzione(nome_campi);
		return;
	}
}

/*
	Funzione di callback del metodo CJsCheck.riattiva_record
	@param messaggio contiene in caso di errore l'eccezione sollevata dal metodo + '@' + 
					 nome della tabella + '@' + 
					 il valore inserito che deve essere univoco.
*/
function cbkRiattivaRecord(messaggio)
{
	//alert('Parametri passati da CJsCheck.riattiva_record() ' + messaggio);
	var msg = messaggio.split('@');
	/*Caso dell'eccezione*/
	if(msg[0] != '')
	{
		alert(msg[0]);
		return;
	}
	
	opener.parent.Ricerca.document.form_ricerca.tipo_ricerca[1].checked = true;
	opener.parent.Ricerca.document.form_ricerca.attivo[2].checked = true;
	opener.parent.Ricerca.document.form_ricerca.hattivo.value = '';
	
	//alert(msg[1]);
	
if(msg[1] == 'tab_per' || msg[1] == 'tab_onere' || msg[1] == 'tab_prf' || msg[1] == 'tab_sal' || msg[1] == 'tab_mac' || msg[1] == 'tab_are' || msg[1] == 'tab_tick')
	opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'COD_DEC';
else
	if(msg[1] == 'comuni')
		opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'XXX_CCOM';
	else
		if(msg[1] == 'centri_di_costo')
			opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'COD_CDC';
		else	
			if(msg[1] == 'tab_pro')
				opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'COD_DEC';//COD_PRO
			else
				if(msg[1] == 'tab_spaz')
					opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'TIP_ESEC';
				else
					if(msg[1] == 'tab_stato_cartella')
						opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'COD_STATO';
					else
						if(msg[1] == 'tab_esa')
							opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'COD_ESA';
						else
							if(msg[1] == 'tab_fasce_orarie')
							{
								opener.parent.Ricerca.document.form_ricerca.tipo_ricerca[0].checked = true;
								opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'DESCR';
							}
							else
								if(msg[1] == 'tab_ref')
									opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'COD_REF';
								else
									if(msg[1] == 'tab_codici_scientifici' || msg[1] == 'tab_codici_scientifici_1')
										opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'CODICE';
									else
										if(msg[1] == 'tab_patologie')
											opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'cod_patologia';
										else
											opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value = 'CODICE';
	
	
	opener.parent.Ricerca.put_last_value(msg[2]);
	opener.parent.Ricerca.ricerca();
	
	
	CJsCheck = null;
	CJsCheckOrdineCdc = null;
	CJsCheckCodSirm = null;
	
	self.close();
}


/*CONROLLO CAMPO CENTRI_DI_COSTO.ORDINE*/
function checkOrdineCdc(ordine)
{	
	if(isNaN(document.form_cdc.ordine.value)) 
	{
		alert(ritornaJsMsg('a5'));
		document.form_cdc.ordine.value= '';
		document.form_cdc.ordine.focus();
		return;
	} 
	else
	{
		if(document.form_cdc.ordine.value != ''){
			dwr.engine.setAsync(false);
			CJsCheckOrdineCdc.checkOrdineCdc(document.form_cdc.ordine.value, cbkJsCheckOrdine);
			dwr.engine.setAsync(true);
		}
	}
}

/* funzione di callback per checkOrdineCdc*/
function cbkJsCheckOrdine(message)
{
	if(message == '1' || message == '0')
	{
		if(message == '0')
		{
			alert(ritornaJsMsg('ordine_esistente')); //alert('Campo ordine centri di costo già esistente.Prego, modificarlo.');
			document.form_cdc.ordine.value = '';
			document.form_cdc.ordine.focus();
		}
	}
	else
	{
		alert(message);
	}
}


function checkCodSirm(campo_cod_sirm)
{
	if(campo_cod_sirm != ''){
		dwr.engine.setAsync(false);
		CJsCheckCodSirm.checkCodSirm(campo_cod_sirm, cbkJsCheckSirm);
		dwr.engine.setAsync(true);
	}
}

function cbkJsCheckSirm(message)
{
	if(message == '0')
	{
		alert(ritornaJsMsg('sirm_non_esistente')); //alert('Attenzione:codice sirm inesistente');
		document.form_esa.cod_sirm.value = '';
		document.form_esa.cod_sirm.focus(); 
		return;
	}
}

/*
	Nel caso della modifica il campo medico non può venire modificato.
	Facendo il controllo in ogni caso ho la descrizione piuttosto che l'iden 
	(quindi ho inserito like anzichè = nella where_condition)
*/
function checkForInsertTabRef()
{
	var medico = document.form_ref.medico.value;
	var valori = "cod_ref='" + document.form_ref.cod_dec.value + "'";
	if(medico == '')
		valori += " and iden_med is null ";
	else
		valori += " and iden_med like '" + medico + "'";
	
	//valori += "@cod_ref";
	
	//CJsCheck.checkCodiceUnivoco(valori, cbkJsCheck);
	
	checkForInsert('attivo, cod_ref', 'tab_ref', valori, '');

}   

function checkForInsertTabFasceOrarie()
{
	if(document.form_fasce.hora_ini.value != '' && document.form_fasce.hora_ini.value != '')
	{
		var where = "ora_ini = '" + document.form_fasce.hora_ini.value + "'";
		where += " and ora_fine = '" + document.form_fasce.hora_fine.value + "'";

		checkForInsert('attivo, descr', 'tab_fasce_orarie', where, '');
	}
}