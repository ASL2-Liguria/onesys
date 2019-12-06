
jQuery(document).ready(function(){
	
	try{
		var idScheda=document.EXTERN.IDEN.value;
	}catch(e){
		idScheda='';
	}
	
	/*if (idScheda=='2400'||
		idScheda=='2401'||
		idScheda=='2402'||
		idScheda=='2403'||
		idScheda=='2404'||
		idScheda=='2406'||
		idScheda=='2407'||
		idScheda=='2408'||
		idScheda=='2409')
	{
		if (baseUser.LOGIN=='02352'){
			//alert('Utente: Battolla');
			document.getElementById('lblRegistra').parentElement.style.display='none';
		}
	}*/


	try{
		document.getElementById('hUrgenza').value=document.EXTERN.URGENZA.value;
		// alert('document.getElementById(\'hUrgenza\').value : '+document.getElementById('hUrgenza').value);
		// alert(document.EXTERN.URGENZA.value);
		
	}catch(e){}
	
});


function apriLayout(mod){

//	alert('tipo_Scheda: '+parent.document.EXTERN.TIPO_SCHEDA.value);
//	alert('iden_Scheda: '+parent.document.EXTERN.IDEN.value);
//	alert('iden_Scheda: '+document.EXTERN.IDEN.value);

	var urgenza = document.getElementById('oIFScheda').contentWindow.document.getElementById('cmbUrgenza').value;
	var tipo=parent.document.EXTERN.TIPO_SCHEDA.value;
	
	//fisso l'ordine attuale dei tappi
	ordinaTappi();
	
	
	if (tipo==''){
	
		alert('Nessun Layout da caricare.\nAccertarsi di aver configurato la scheda (contenitori e analisi) prima di procedere nuovamente');
	
	}
	
	if (tipo=='LABORATORIO'){
		if (mod=='INS'){ 
			parent.document.all['oIFLayout'].src="sceltaEsamiLabo?Hiden_sc_labo="+parent.document.EXTERN.IDEN.value+"&URGENZA="+urgenza+"&REPARTO=TEST&MODIFICA=S&LETTURA=N";
		}else if(mod=='MOD'){
			parent.document.all['oIFLayout'].src="sceltaEsamiLabo?Hiden_sc_labo="+parent.document.EXTERN.IDEN.value+"&URGENZA="+urgenza+"&REPARTO=TEST&MODIFICA=S&LETTURA=N";
		}else if(mod=='VIS'){
			parent.document.all['oIFLayout'].src="sceltaEsamiLabo?Hiden_sc_labo="+parent.document.EXTERN.IDEN.value+"&URGENZA="+urgenza+"&REPARTO=TEST&MODIFICA=N&LETTURA=S";
		}
	}
	
	if (tipo=='MICROBIOLOGIA'){
	
		if (mod=='INS'){
			document.all['oIFLayout'].src="Microbiologia2?Hiden_sc_micro="+parent.document.EXTERN.IDEN.value+"&URGENZA="+urgenza+"&MODIFICA=S&LETTURA=N";
		}else if(mod=='MOD'){
			document.all['oIFLayout'].src="Microbiologia2?Hiden_sc_micro="+parent.document.EXTERN.IDEN.value+"&URGENZA="+urgenza+"&MODIFICA=S&LETTURA=N";
		}else if(mod=='VIS'){
			document.all['oIFLayout'].src="Microbiologia2?Hiden_sc_micro="+parent.document.EXTERN.IDEN.value+"&URGENZA="+urgenza+"&MODIFICA=N&LETTURA=S";
		}
	}
	
	//BIOLOGIA MOLECOLARE
	if (tipo=='BIOMOL'){
	
		if (mod=='INS'){
			document.all['oIFLayout'].src="sceltaEsamiBioMol?Hiden_sc_bio="+parent.document.EXTERN.IDEN.value+"&URGENZA="+urgenza+"&MODIFICA=S&LETTURA=N";
		}else if(mod=='MOD'){
			document.all['oIFLayout'].src="sceltaEsamiBioMol?Hiden_sc_bio="+parent.document.EXTERN.IDEN.value+"&URGENZA="+urgenza+"&MODIFICA=S&LETTURA=N";
		}else if(mod=='VIS'){
			document.all['oIFLayout'].src="sceltaEsamiBioMol?Hiden_sc_bio="+parent.document.EXTERN.IDEN.value+"&URGENZA="+urgenza+"&MODIFICA=N&LETTURA=S";
		}
	}
}


//funzione di salvataggio che richiama le funzione di salvataggio di PAGINA_DITTE
function aux_registra(){
	
	//ordinaTappi(); lo fa già nel presalvataggio del frame dei tappi
	utilCreaBoxAttesa();
	utilMostraBoxAttesa(true);
	
	document.frames['oIFReparti'].preSalvataggio();
	document.frames['oIFTappi'].preSalvataggio();
	document.frames['oIFScheda'].preSalvataggio();
	
}

//funzione che carica nel campo nascosto Hiden il next.val di SEQ_TAB_LABO_SCHEDE nel caso siamo in inserimento (STATO='INS')
function caricaIden(){

	var sql='SELECT SEQ_TAB_LABO_SCHEDE.nextval FROM dual';
	//alert('sql: '+sql);

	dwr.engine.setAsync(false);		
	toolKitDB.getListResultData(sql, settaIden);		
	dwr.engine.setAsync(true);
	
	function settaIden(res){
		document.EXTERN.IDEN.value=res;
	}
}


//funzione di controllo che cancella tutte le righe su GESTIONE_LABORATORIO 'provvisorie'
function chiudiScheda(){

	var utente=document.EXTERN.USER_ID.value;
	var operazione='';

	if (document.EXTERN.STATO.value == 'MOD'){
		operazione='ANNULLA';
	}else if (document.EXTERN.STATO.value == 'INS'){
		operazione='CANCELLA';
	}

	//alert(operazione);
	
	if (confirm('Chiudere la scheda prima del salvataggio?\nLe modifiche non verranno salvate')){
			
		var sql = "{call ? := RADSQL.CLS_SALVA_CANC_SCHEDA('','','"+operazione+"',"+utente+","+document.EXTERN.IDEN.value+")}";
			
		dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, callIdenGest);
		dwr.engine.setAsync(true);
		self.close();
		opener.document.location.replace(opener.document.location);
	}
	
}

//function di callback
function callIdenGest(resp){
	//alert(resp);
}


//funzione che controlla se l'elemento dell'oggetto val1 è presente nell'oggetto val2. Si usa pevalentemente con i listbox. Linkare alla pagina il file optionJsUtil.js
function controllaPresObj(val1,val2) {

	var opt= val1.options[val1.selectedIndex].value;
	
	//alert('opt: '+opt   );
	
	for (var i=0;i<val2.length;i++){

		if (val2.options[i].value==opt){
		
			alert('Attenzione! Elemento già presente nella lista');
			return;
		}		
	}

	add_selected_elements(val1.name, val2.name, true);sortSelect(val1.name);
}

//funzione che da la src ai frame a seconda di come viene richiamata la pagina (INS, MOD, VIS)
function generateSource(){
	
	//alert(document.EXTERN.STATO.value);	
	
	document.all['lblRegistra'].innerText='Conferma';
	document.all['lblAnnulla'].innerText='Annulla';
	
	 if (document.EXTERN.STATO.value == 'VIS'){
	
		
		// alert(document.all['oIFScheda']);
	
		document.all['oIFScheda'].src="servletGenerator?KEY_LEGAME=PAGINA_SCHEDA&INSERIMENTO=N&MODIFICA=N&LETTURA=S&IDEN="+document.EXTERN.IDEN.value;
	
		document.all['oIFTappi'].src="servletGenerator?KEY_LEGAME=GESTIONE_TAPPI&MODIFICA=N&LETTURA=S&INSERIMENTO=N";

		document.all['oIFReparti'].src="servletGenerator?KEY_LEGAME=ASSOCIA_REPARTI_SCHEDA&MODIFICA=S&INSERIMENTO=N&LETTURA=S&IDEN="+document.EXTERN.IDEN.value;

		//document.all['oIFLayout'].src="servletGenerator?KEY_LEGAME=PAGINA_SCHEDA&Hiden_pro=317&URGENZA=0&REPARTO=MED_1&IDPAGINA=3&MODIFICA=S&LETTURA=S";
		
		document.dati.Hiden.value=document.EXTERN.IDEN.value;
	
	}

	if (document.EXTERN.STATO.value  == 'MOD'){
	
		document.all['oIFScheda'].src="servletGenerator?KEY_LEGAME=PAGINA_SCHEDA&MODIFICA=S&LETTURA=N&IDEN="+document.EXTERN.IDEN.value;
	
		document.all['oIFTappi'].src="servletGenerator?KEY_LEGAME=GESTIONE_TAPPI&MODIFICA=S&LETTURA=N&INSERIMENTO=N";

		document.all['oIFReparti'].src="servletGenerator?KEY_LEGAME=ASSOCIA_REPARTI_SCHEDA&MODIFICA=S&INSERIMENTO=N&LETTURA=N&IDEN="+document.EXTERN.IDEN.value;
		
		//document.all['oIFLayout'].src="servletGenerator?KEY_LEGAME=SCELTA_ESAMI_LABO&Hiden_pro=317&URGENZA=0&REPARTO=MED_1&IDPAGINA=3&MODIFICA=S&LETTURA=N";
		
		document.dati.Hiden.value=document.EXTERN.IDEN.value;
	
	}
	
	if (document.EXTERN.STATO.value  == 'INS'){
	
		document.all['oIFScheda'].src="servletGenerator?KEY_LEGAME=PAGINA_SCHEDA&MODIFICA=N&INSERIMENTO=S&LETTURA=N&IDEN=";
	
		document.all['oIFTappi'].src="servletGenerator?KEY_LEGAME=GESTIONE_TAPPI&MODIFICA=N&LETTURA=N&INSERIMENTO=S";

		document.all['oIFReparti'].src="servletGenerator?KEY_LEGAME=ASSOCIA_REPARTI_SCHEDA&MODIFICA=N&LETTURA=N&&INSERIMENTO=S&IDEN=";

		//document.all['oIFLayout'].src="?KEY_LEGAME=SCELTA_ESAMI_LABO&Hiden_pro=317&URGENZA=0&REPARTO=MED_1&IDPAGINA=3&MODIFICA=S&LETTURA=N";
		//document.all['oIFLayout'].src="blank.htm";
		
		caricaIden(); //vedi inizio file
	
	}
}


//funzione che cicla GESTIONE_LABORATORIO e inserisci gli esami per ogni reparto selezionato nella scheda
function salvaScheda(){

	//alert(document.EXTERN.IDEN.value);	
	
	var utente=document.EXTERN.USER_ID.value;
	var elencoReparti=document.getElementById('hReparti').value;
	var elencoTappi=document.getElementById('hTappi').value;
	var operazione='SALVA';
	//alert('utente: '+utente);
	var sql = "{call ? := RADSQL.CLS_SALVA_CANC_SCHEDA('"+elencoReparti+"','"+elencoTappi+"','"+operazione+"',"+utente+","+document.EXTERN.IDEN.value+")}";
	//alert(sql);
	
	if (elencoReparti =='' && document.EXTERN.ATTIVO.value=='S'){
	
		alert('Impossibile procedere nel salvataggio! Non è consentito eliminare ogni associazione scheda-reparto in una scheda ATTIVA'	);
	
	}else{
		
		dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, callIdenGest);
		dwr.engine.setAsync(true);
		self.close();
		opener.document.location.replace(opener.document.location);	
	}
}

function ordinaTappi(){
	
	document.frames['oIFTappi'].preSalvataggio();
	
}


