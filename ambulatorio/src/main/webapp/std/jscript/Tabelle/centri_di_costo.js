var reg = false;

function chiudi(){
	opener.aggiorna_worklist();
	self.close();
}

function check_cdc()
{
	document.form_cdc.cod_dec.value = document.form_cdc.cod_dec.value.toUpperCase();
	if(document.form_cdc.cod_dec.value.length < 3)
	{ 
		alert(ritornaJsMsg('alert_lungh_codice')); 
		document.form_cdc.cod_dec.value = ''; 
		document.form_cdc.cod_dec.focus(); 
	} 
	else 
		checkForInsert('attivo', 'centri_di_costo', 'cod_cdc', document.form_cdc.cod_dec.value.toUpperCase());
}

function chiudi_ins_mod(){
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCR')
		campo_descr = document.form_cdc.descr.value;
    else
		campo_descr = document.form_cdc.cod_dec.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();
}



function salva(){
	reg = true;
    doc = document.form_cdc;
    if (doc.cod_dec.value == '')
	{
        alert(ritornaJsMsg('a1'));
        doc.cod_dec.focus();
        return;
    }
    if (doc.ordine.value == '')
	{
        alert(ritornaJsMsg('a2'));
        doc.ordine.focus();
        return;
    }
    if (doc.descr.value == '')
	{
        alert(ritornaJsMsg('a3'));//\"Inserire una descrizione prego\"
        doc.descr.focus();
        return;
    }
    if(document.form_cdc.attivo.checked == 1)
        document.form_cdc.hattivo.value = 'N';
    else
        document.form_cdc.hattivo.value = 'S';
    doc.registrazione.value = reg;
    doc.submit();
    alert(ritornaJsMsg('a4'));
    
	chiudi_ins_mod();
}

/*
	Funzione richiamata dalla funzione di callback del dwr (cbkJsCheck())
	contenuta nel file check.js
*/
function funzione()
{
	document.form_cdc.cod_dec.value = '';
	document.form_cdc.cod_dec.focus();
}