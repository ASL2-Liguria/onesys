function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}

function salva()
{
	var reg = true;
    var doc = document.form;
	
	doc.tabella.value = opener.parent.Ricerca.document.form_ricerca.procedura.value;
	if(doc.tabella.value == 'T_CS')
	{
		doc.sequence.value = 'SEQ_TAB_CODICI_SCENTIFICI';
		doc.tabella.value  = 'TAB_CODICI_SCIENTIFICI';
	}
	else
	{
		doc.sequence.value = 'SEQ_TAB_CODICI_SCENTIFICI_1';
		doc.tabella.value  = 'TAB_CODICI_SCIENTIFICI_1';
	}
	
    if (doc.codice.value=='')
	{
        	alert(ritornaJsMsg('alert_codice'));
			doc.codice.focus();
        	return;
	}
    if (doc.descrizione.value=='')
	{
        	alert(ritornaJsMsg('alert_descr'));
			doc.descrizione.focus();
        	return;
	}
    if (doc.attivo.checked==1) 
        	doc.hattivo.value='N';
    else
        	doc.hattivo.value='S';
    doc.registrazione.value = reg;
    doc.submit(); 
    alert(ritornaJsMsg('reg_ok'));
    chiudi_ins_mod(); 
}


function chiudi_ins_mod()
{
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCRIZIONE')
		campo_descr = document.form.descrizione.value;
    else
		campo_descr = document.form.codice.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();
}

function funzione()
{
	document.form.codice.value = '';
	document.form.codice.focus();
}