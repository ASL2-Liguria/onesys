var reg = false;

function chiudi(){
	opener.aggiorna_worklist();
	self.close();
}


function chiudi_ins_mod(){
	var tipo_ricerca;
	var campo_descr;
	doc = document.form_com;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'COMUNE')
		campo_descr = doc.comune.value;
    if(tipo_ricerca == 'CAP')
		campo_descr = doc.cap.value;
	if(tipo_ricerca == 'XXX_CCOM')
		campo_descr = doc.cod_dec.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();
}

function salva(){
	reg = true;
    doc=document.form_com;
    if(doc.cod_dec.value == '')
	{
    	alert(ritornaJsMsg('a1'));
		doc.cod_dec.focus();
        return;
    }
    if(doc.comune.value == ''){
    	alert(ritornaJsMsg('a2'));
		doc.comune.focus();
        return;
    }
    if (doc.attivo.checked==1) 
        doc.hattivo.value = 'N';
     else
        doc.hattivo.value = 'S';
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
	document.form_com.cod_dec.value = '';
	document.form_com.cod_dec.focus();
}