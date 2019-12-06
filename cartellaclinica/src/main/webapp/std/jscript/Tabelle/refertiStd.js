var reg = false;

function salva()
{
	var doc = document.form_ref;
	doc.hduplicazione.value = duplicazione;//== D quando premo il pulsante duplica
	reg = true;
	if (doc.cod_dec.value=="")
	{
    	alert(ritornaJsMsg('a0'));
    	doc.cod_dec.focus();
    	return;
	}
	if(doc.descr.value=="")
	{
    	alert(ritornaJsMsg('a1'));
    	doc.descr.focus();
    	return;
	}
	if (doc.attivo.checked==1) 
    	doc.hattivo.value="N";
	else
    	doc.hattivo.value="S";
    
	doc.hregistrazione.value = reg;
	
	if((doc.hoperazione.value == 'MOD' && doc.hduplicazione.value == 'D'))// || doc.hoperazione.value == 'INS'
	{
		checkForInsertTabRef();
	}
	else
	{
		//document.form_ref.testo.value = document.form_ref.testo.value.toLowerCase();
		doc.submit();
		chiudi_ins_mod();
	}
}

function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}

function chiudi_ins_mod()
{
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCR')
		campo_descr = document.form_ref.descr.value;
    else
		campo_descr = document.form_ref.cod_dec.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();	
}

function duplica()
{
	document.form_duplica.tipo.value = 'D';
	document.form_duplica.cod_refDup.value = document.form_ref.cod_dec.value;
	document.form_duplica.iden_medDup.value = document.form_ref.medico.value;
	document.form_duplica.opDup.value = 'MOD';
	document.form_duplica.submit();
}


function funzione(operazione)
{
	//alert('funzione(): ' + operazione);
	if(operazione == 'inserimento')
	{
		document.form_ref.submit();
		chiudi_ins_mod();
	}
}
