/**
*/
function setPage(doc){
	doc.all.div_info.style.display = 'none';
	doc.all.form.testo.focus();
	tutto_schermo();
}

/**
*/
function registra(){
	var sp = null;
	var parametri = null;
	var doc = document.form;
	
	if(doc.testo.value == ''){
		alert('Attenzione: inserire il testo del diario medico');
		doc.testo.focus();
		return;
	}
	
	parametri = 'radsql.SP_GESTIONE_DIARIO_MEDICO';
	parametri += "@" + baseUser.LOGIN + ',' + Number(doc.hiden.value);
	parametri += "," + doc.testo.value.toUpperCase().replace(/'/g, "''").replace(/,/g, "^");
	parametri += ',' + Number(doc.iden_anag.value);
	parametri += ',' + Number(baseUser.IDEN_PER);
	parametri += ',' + doc.hoperazione.value;
	parametri += '@FALSE@ ';
	
	//alert('insert: ' + parametri);
	
	dwr.engine.setAsync(false);
	CJsUpdate.call_stored_procedure(parametri, cbk_registra);
	dwr.engine.setAsync(true);		
}


/**
*/
function cbk_registra(error){
	CJsUpdate = null;
	if(error != ''){
		alert('cbk_registra: ' + error);
		return;
	}	
	else{
		chiudi();
	}
}



/**
*/
function chiudi(){
	opener.parent.RicercaFrame.ricercaDiarioMedico();
	self.close();
}