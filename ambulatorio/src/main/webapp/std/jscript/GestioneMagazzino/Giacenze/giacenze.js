function chiudi()
{
	opener.parent.RicercaMagazzinoFrame.ricerca();
    self.close();
}

function cambia_magazzino()
{
	document.form_mg_giacenze.submit();
}


function chiudi_ins_mod()
{
	opener.parent.RicercaMagazzinoFrame.document.form_ric_maga.descr_art.value = document.form_mg_giacenze.descr_art.value;
	opener.parent.RicercaMagazzinoFrame.document.form_ric_maga.cod_bar.value   = document.form_mg_giacenze.cod_bar.value;
	chiudi();
}

function registra()
{
	if(document.form_mg_giacenze.magazzino.value == '')
	{
		alert(ritornaJsMsg('alert_magazzino'));
		return;
	}
	if(document.form_mg_giacenze.giacenza.value == '')
	{
		document.form_mg_giacenze.giacenza.value = '';
		document.form_mg_giacenze.giacenza.focus();
		alert(ritornaJsMsg('alert_giacenza'));
		return;
	}
	if(document.form_mg_giacenze.scorta_minima.value == '')
	{
		document.form_mg_giacenze.scorta_minima.value = '';
		document.form_mg_giacenze.scorta_minima.focus();
		alert(ritornaJsMsg('alert_scorta_minima'));
		return;
	}
	if(document.form_mg_giacenze.qta_da_ordinare.value == '')
	{
		document.form_mg_giacenze.qta_da_ordinare.value = '';
		document.form_mg_giacenze.qta_da_ordinare.focus();
		alert(ritornaJsMsg('alert_qta_da_ordinare'));
		return;
     }
	document.form_modifica.iden_art.value = document.form_mg_giacenze.iden_mag.value;
    document.form_modifica.magazzino.value = document.form_mg_giacenze.magazzino.value;
    document.form_modifica.giacenza.value = document.form_mg_giacenze.giacenza.value;
    document.form_modifica.scorta_minima.value = document.form_mg_giacenze.scorta_minima.value;
    document.form_modifica.qta_da_ordinare.value = document.form_mg_giacenze.qta_da_ordinare.value;
    document.form_modifica.nome_campi.value = 'iden_art*iden_magazzino*giacenza*scorta_minima*qta_da_ordinare';
    document.form_modifica.request.value = 'iden_art*magazzino*giacenza*scorta_minima*qta_da_ordinare';
    document.form_modifica.tipo_campo_db.value = 'L*L*L*L*L';
    document.form_modifica.operazione.value = 'MG_GIACENZE';
            
	document.form_modifica.submit();
	alert(ritornaJsMsg('registrazione'));//Registrazione effettuata
	
	chiudi_ins_mod();
}
            
function cancella_art_magazzino()
{
	var doc = document.form_mg_giacenze;
	
	if(doc.magazzino.value == '' || (doc.giacenza.value == '' || doc.scorta_minima.value == '' || doc.qta_da_ordinare.value == ''))
	{
		if(doc.magazzino.value == '')
		{
			alert(ritornaJsMsg('alert_magazzino'));
			return;
		}
		else
		{
			alert(ritornaJsMsg('alert_giacenza_vuota'));
			return;
        }
	}
	else
	{
		document.form_modifica.operazione.value = 'CANC';
		/*iden_art*/
		document.form_modifica.iden_art.value = doc.iden_mag.value;
		
		/*iden_magazzino*/
		document.form_modifica.magazzino.value = doc.magazzino.value;
		
		/*alert('articolo: ' + document.form_modifica.iden_art.value);
		alert('magazzino: ' + document.form_modifica.magazzino.value);*/
		
		document.form_modifica.submit();
		
        //chiudi();
	}
}