var reg = false;

function chiudi(){
	opener.aggiorna_worklist();
	self.close();
}


function chiudi_ins_mod(){
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCR')
		campo_descr = document.form_stato_cartella.descr.value;
    else
		campo_descr = document.form_stato_cartella.cod_dec.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();
}
    
function salva(){
	reg = true;
    doc=document.form_stato_cartella;
    if (doc.cod_dec.value==''){
        	alert(ritornaJsMsg('a1'));
			doc.cod_dec.focus();
        	return;
	}
    if (doc.descr.value==''){
        	alert(ritornaJsMsg('a2'));
			doc.descr.focus();
        	return;
	}
    if (doc.attivo.checked==1) 
        	doc.hattivo.value='N';
    else
    	   	doc.hattivo.value='S';
    doc.registrazione.value = reg;
    doc.submit(); 
    alert(ritornaJsMsg('a3'));
    chiudi_ins_mod();
}

/*
	Funzione richiamata dalla funzione di callback del dwr (cbkJsCheck())
	contenuta nel file check.js
*/
function funzione()
{
	document.form_stato_cartella.cod_dec.value = '';
	document.form_stato_cartella.cod_dec.focus();
}