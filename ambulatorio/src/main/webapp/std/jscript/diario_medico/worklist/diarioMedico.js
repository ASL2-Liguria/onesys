/**
*/
function funzione(){
	var oggetto = document.getElementById("oTable");
	
	if (oggetto){
		oggetto.ondblclick = function(){visualizza_diario();};
	}
		
	try{
			connectDragDropToObjectById();
			// definisco la funzione di callback
			// che DOVRA' accettare in ingresso 2 parametri (nomeCampo, variazioneRelativa
			setCallBackAfterDragDrop("callBackFunctionAfterColResizing");
		}
		catch(e){
			alert(e.description);
		}

	if(top.opener.name == 'worklistMainFrame'){
		document.all.titolo.innerHTML = 'Paziente: ' + top.opener.stringa_codici(top.opener.array_cogn) + ' '  + top.opener.stringa_codici(top.opener.array_nome) +  ' '  + top.opener.stringa_codici(top.opener.array_data);
	}
	else{
		document.all.titolo.innerHTML = 'Paziente: ' + top.opener.stringa_codici(top.opener.array_paziente);
	}
}


/**
*/
function visualizza_diario(){
	var iden_diario = null;
	var parametri = null;
	
	iden_diario = stringa_codici(array_iden);
	
	if(iden_diario == ''){
		alert('Attenzione: selezionare un diario medico');
		return;
	}
	
	parametri = 'select testo from diario_medico where iden = ' + iden_diario;
	parametri += '@testo@1';
	
	//alert(parametri);
	
	dwr.engine.setAsync(false);
	CJsUpdate.select(parametri, cbk_visualizza_diario);
	dwr.engine.setAsync(true);
}


/**
*/
function cbk_visualizza_diario(testoDiarioMedico){
	//alert(testoDiarioMedico);
	var appo = testoDiarioMedico.split("$");
	
	showDialog('Diario Medico', appo[0].substring(0, appo[0].length-1),'warning');
}


/**
*/
function ins_mod_canc(operazione){
	if(operazione == 'I')
		inserimento();
	if(operazione == 'M')
		modifica();
	if(operazione == 'C')
		cancellazione();
}


/**
*/
function inserimento(){
	var iden_anag = null;
	
	iden_anag = parent.RicercaFrame.document.form_ricerca.iden_anag.value;
	
	//alert('IDEN_ANAG: ' + iden_anag);
	
	window.open("SL_DiarioMedico?iden_diario=-1&hoperazione=I&iden_anag="+iden_anag, "wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
}


/**
*/
function modifica(){
	var iden_diario = null;
	var iden_anag = null;
	var diarioCancellato = null;
	
	diarioCancellato = stringa_codici(array_deleted);
	iden_diario = stringa_codici(array_iden);
	iden_anag = parent.RicercaFrame.document.form_ricerca.iden_anag.value;
	
	if(iden_diario == ''){
		alert('Attenzione: effettuare una selezione');
		return;
	}
	
	if(diarioCancellato == 'S'){
		alert('Attenzione diario cancellato: impossibile modificalo');
		return;
	}
	
	window.open("SL_DiarioMedico?hoperazione=M&iden_diario="+iden_diario+"&iden_anag="+iden_anag, "wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
}


/**
*/
function cancellazione(){
	var iden_diario = null;
	var deleteQuery = null;
	var diarioCancellato = null;
	
	diarioCancellato = stringa_codici(array_deleted);	
	iden_diario = stringa_codici(array_iden);

	if(iden_diario == ''){
		alert('Attenzione: effettuare una selezione');
		return;
	}
	
	if(diarioCancellato == 'S'){
		alert('Attenzione diario già cancellato');
		return;
	}
	

	deleteQuery = "2@update diario_medico set deleted = 'S', ute_canc = " + baseUser.IDEN_PER;
	deleteQuery += " where iden = " + iden_diario;
	
	dwr.engine.setAsync(false);
	CJsUpdate.insert_update(deleteQuery, cbk_cancellazione);
	dwr.engine.setAsync(true);
}


/**
*/
function cbk_cancellazione(error){
	CJsUpdate = null;
	if(error != ''){
		alert('cbk_cancellazione: ' + error);
		return;
	}	
	else
		parent.RicercaFrame.ricercaDiarioMedico();
}


/**
*/
function chiudiGestioneDiarioMedico(){
	top.close();
}


/**
*/
function aggiorna(){
	var servlet = null;
	var doc = document.frmAggiorna;
	
	servlet = 'SL_RicercaGenericaWorklist?tipo_wk=WK_DIARIO_MEDICO';
	servlet += '&context_menu=diarioMedicoRicerca';
	servlet += '&hidWhere='+document.form.hidWhere.value;
	servlet += '&hidOrder='+document.form.hidOrder.value;
	
	//alert(servlet);
	
	doc.action = servlet;	
	
	doc.target = 'WorklistFrame';
	doc.method = 'POST';
	
	doc.submit();
}


/**
*/
function stampa_diario_medico()
{
   var iden_diario = null;

   var parametri = null;

   iden_diario = stringa_codici(array_iden);

   if (iden_diario =='')
   {
       alert ('Selezionare almeno una Visita');
       return;
   }

   var sf= '{VIEW_DIARIO_MEDICO.IDEN} in [' + iden_diario + ']'

   var finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTA_DIARIO&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");

	 if(finestra)
		finestra.focus();
	 else
	 {
		finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTA_DIARIO&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");
	
	 }     
}