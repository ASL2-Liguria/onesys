/*
Vedi funzione finestra_attesa(provenienza) che non è + richiamata con la ricerca dal db
*/
var lastOperation = "";
function funzione()
{
	// ***************************
	// *** azzero variabile per problema prenotazione
	top.prenotaDaConsulta = "";
	// ***************************
	try{
		top.home.chiudi_attesa();//parent.RicPazRicercaFrame.chiudi_attesa();
	}
	catch(e){
		//alert(e.description);
	}	
	// ********** toniutti
	try{
			// setto cosa fare dopo caricamento
			// worklist nuova
			jQuery('#oTable').callJSAfterInitWorklist("buildIconeLettera();toDoAfterWkBuild();");
		}catch(e){
			//alert(e.description);
		}
	// ********************
	
	var oggetto = document.getElementById("oTable");

	if(document.form.provenienza.value == 'ripristino_cancellati'){
		oggetto.ondblclick = function(){visualizza_esami();}
	}
	else{
		try{
			oggetto.ondblclick = function(){gestioneAnagrafica('VIS_ESA');}
		}
		catch(e){
			oggetto.ondblclick = function(){worklist_esami_da_prenotazione();}
		}
	}
	//alert("qui " + document.form.provenienza.value);
	if(document.form.provenienza.value == 'RiconciliaSpostaEsami'){
		parent.RicPazUtilityFrame.location.reload("RiconciliaPazienti");
		
		//RiconciliaPazienti?servlet_call=" + this.menuVerticalMenu + "&cdc=" + this.cdc + "&elenco_richieste_da_accettare=" + this.elenco_richieste_da_accettare + "&stato_esame=" + this.tipo_registrazione
	}
}


/*
	Funzione richiamata dopo l'inserimento di un esame o l'annullamento
	dell'inserimento di un esame
*/
function aggiorna()
{
	var iden_anag = "";
	//parent.RicPazRicercaFrame.applica();
	//alert("lastOperation: "+ lastOperation);
	if ((lastOperation=="INS_ESA")|| (lastOperation == 'RIPETI_ESA')){ 
		lastOperation= "";
		iden_anag = stringa_codici(iden);
		worklist_esami(iden_anag);
	}
	else{
		parent.RicPazRicercaFrame.ricercaCognNomeData();
	}
	self.close();	
}


function aggiorna_anag(cogn, nome, data, cod_fisc, id_paz_dicom, num_nos, num_arc, tipo_ricerca, provenienza)
{
	//alert(cogn + ' - ' + nome + ' - ' + data + ' - ' + cod_fisc + ' - ' + id_paz_dicom + ' - ' + num_nos);
	//alert('TIPO RICERCA: ' + tipo_ricerca + ' - PROVENIENZA: ' + provenienza);
	
	if(tipo_ricerca == '0')//COGN,NOME,DATA
	{
		parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;
		
		/*parent.RicPazRicercaFrame.document.forms[0].elements(6).value = cogn;
		parent.RicPazRicercaFrame.document.forms[0].elements(7).value = nome;
		parent.RicPazRicercaFrame.document.forms[0].elements(8).value = data.substring(6,8) + "/" + data.substring(4,6) + "/" + data.substring(0,4);*/
		
		
		parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value = cogn;
		parent.RicPazRicercaFrame.document.form_pag_ric.NOME.value = nome;
		parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value = data.substring(6,8) + "/" + data.substring(4,6) + "/" + data.substring(0,4);
		
		parent.RicPazRicercaFrame.ricercaCognNomeData();
	}
	else
		if(tipo_ricerca == '1')//COD_FISC
		{
			parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;
			//parent.RicPazRicercaFrame.document.forms[0].elements(3).value = cod_fisc;
			parent.RicPazRicercaFrame.document.form_pag_ric.COD_FISC.value = cod_fisc;
			parent.RicPazRicercaFrame.ricercaCodiceFiscale();
		}
		else
			if(tipo_ricerca == '3')//ID_PAZ_DICOM
			{
				parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;
				
				//parent.RicPazRicercaFrame.document.form_pag_ric.ID_PAZ_DICOM.value = id_paz_dicom;
				parent.RicPazRicercaFrame.ricercaIdPazDicom();
			}
			else
				if(tipo_ricerca == '4')//NUM_NOSOLOGICO
				{
					parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;
					
					//parent.RicPazRicercaFrame.document.form_pag_ric.NUM_NOSOLOGICO.value = num_nos;
					parent.RicPazRicercaFrame.ricercaNumeroNosologico();
				}
				else
					if(tipo_ricerca == '2')//NUM_ARC
					{
						parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;
				
						parent.RicPazRicercaFrame.document.form_pag_ric.NUM_ARC.value = num_arc;
						parent.RicPazRicercaFrame.ricercaNumeroArchivio();
					}
					else
						if(tipo_ricerca == '5')//NUM_OLD
						{
							parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;

							parent.RicPazRicercaFrame.ricercaNumeroArchivioNumOld();
						}
						else
							if(tipo_ricerca == '6')//DA_CONFIGURARE
							{
								parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;

								parent.RicPazRicercaFrame.ricercaDaConfigurare();
							}
}


function aggiorna_chiudi()
{
	parent.RicPazRicercaFrame.applica(document.form.pagina_da_vis.value);
}


function aggiorna_chiudi_canc()
{
	var pag_da_vis = document.form.pagina_da_vis.value;
	var elenco_paz = iden.length;
	
	if(elenco_paz == 1)
		pag_da_vis = pag_da_vis - 1;
		
	parent.RicPazRicercaFrame.applica(pag_da_vis);
}

/*
	utilizzo DWR solo ed esclusivamente per la ricerca del paziente che
	può essere effettuata in locale o remoto
*/
function gestioneAnagrafica(tipo_operazione)
{
	lastOperation = tipo_operazione;
	var tipo_ricerca = document.form.ricerca_anagrafica.value;//document.form_canc_paz.ricerca_anagrafica.value;
	var iden_remote_anag = stringa_codici(iden);
	
	/*alert('Tipo Ricerca Remota: ' + tipo_ricerca);
	alert('Tipo Operazione: ' + tipo_operazione);
	alert(iden_remote_anag);*/
	if(iden_remote_anag == '')
	{
		alert(ritornaJsMsg('selezionare'));//Prego, effettuare una selezione
		return;
	}
	
	// modifica 3-12-15
	if (checkPvcy1A()){return false;}
	// ******************	
	
	//*******************************
	// modifica 01-04-2015
	try{
		if (tipo_operazione=="INS_PRENO_CONSULTA"){
			// controllo telefono
			var rs = top.executeStatement('worklist_main.xml','checkAnagPrenotabile',[iden_remote_anag],2);
			if (rs[0] == 'KO') { /* errori database */
				// **************************					
				// modifica 18-3-15
				if (rs[1].toString().indexOf("lettura del file")>-1){
					return true;
				}
				// **************************
				alert('checkAnagPrenotabile - ' + rs[1]);
				alert("ATTENZIONE : ID anagrafico non valido - ID: " + iden_anag);
				return false;
			}
			if (rs[2] == 'KO') { /* errori di flusso/logica */
				if (confirm(rs[3])) {
					//apro scheda anag
					modificaAnagrafica(iden_remote_anag);
					return;
				}
			}		
		}
	}catch(e){;}
	//*******************************	
	/*Controllo se il paziente è READONLY se la ricerca è in locale*/
	if(tipo_operazione == 'VIS_NUM_ARCH')
	{
		if((tipo_ricerca != '2' || tipo_ricerca != '3') && isLockPage('ANAGRAFICA', iden_remote_anag, 'ANAG') && tipo_operazione != 'VIS_ESA' && tipo_operazione != 'MOD')
		{
			alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
			return;		
		}
	}
	/**/
	
	if(tipo_operazione == 'MOD')
	{
		if(tipo_ricerca == 2){
			dwr.engine.setAsync(false);
			CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, modificaAnagrafica);
			dwr.engine.setAsync(true);
		}
		else
			modificaAnagrafica();
	}
	if(tipo_operazione == 'CANC')
	{
		if(tipo_ricerca == 2)
		{
			alert(ritornaJsMsg('no_canc_paz_remoti'));//Non si possono effettuare cancellazioni di pazienti remoti.
		}
		else
			cancellaAnagrafica();
	}
	if(tipo_operazione == 'VIS_ESA')
	{
		
		//  DA TOGLIERE 
//		if (errorOnCheck){return;}
		// ****************			
		if(tipo_ricerca == 2){
			dwr.engine.setAsync(false);
			CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, worklist_esami);
			dwr.engine.setAsync(true);
		}
		else
			worklist_esami(iden_remote_anag);
	}
	if((tipo_operazione == 'INS_ESA') || (tipo_operazione == 'RIPETI_ESA'))
	{
	
		if(tipo_ricerca == 2){
			dwr.engine.setAsync(false);
			CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, inserimentoEsame);
			dwr.engine.setAsync(true);
		}
		else
			inserimentoEsame();
	}
	/*DA VERIFICARE PER LA RICERCA REMOTA*/
	if(tipo_operazione == 'VIS_NUM_ARCH')
	{
		if(tipo_ricerca == 2){
			dwr.engine.setAsync(false);
			CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, cbk_visualizza_numeri_archivio);
			dwr.engine.setAsync(true);
		}
		else
			visualizza_numeri_archivio();
	}
	
	/*
	 * Ambulatorio
	 */
	var funzione;
	var iden_anag;

	switch (tipo_operazione) {
		case 'INS_PRENO':
			funzione = cbk_ambu_pren;
			// commentato 31/7/14 aldo
//			return;
			break;
		case 'INS_PRENO_CONSULTA':
			funzione = cbk_ambu_pren_consulta;
			break;

		default:
			return;
	}

	try{
		if (tipo_ricerca == 2) {
			dwr.engine.setAsync(false);
			CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, funzione);
			dwr.engine.setAsync(true);
		} else {
			iden_anag = stringa_codici(iden);
			funzione(iden_anag);
		}
	}
	catch(e){
		alert("gestioneAnagrafica, tipo_operazione: " + tipo_operazione + " error: " + e.description);
	}
	
}

function cbk_common(funzione, anagIden) {
	anagIden = new String(anagIden);
	try {
		if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
			return;
		}
		funzione(anagIden);
	}
	catch(e) {
		alert(funzione.name + " - Error: " + e.description);
	}
}

function cbk_common_apri(funzione_chiamata, anagIden, url) {
	anagIden = new String(anagIden);
	// ************************************
	// ******** controllo readonly	
	try{
		/* modifica aldo 07-01-15 */
		if (!isPatientReadOnlyCheck(anagIden)){return;}
	}
	catch(e){;}
	// *********************************	
	try{
		if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
			return;
		}
		top.apri(url);
	}
	catch(e){
		alert(funzione_chiamata + " - Error: " + e.description);
	}
}

function cbk_ambu_pren(anagIden){
		// ***************************
		top.prenotaDaConsulta = "N";
		// ***************************
	cbk_common_apri('cbk_ambu_pren', anagIden, "prenotazioneFrame?visual_bt_direzione=S&servlet=sceltaEsami%3Ftipo_registrazione%3DP%26visualizza_metodica%3DN%26cmd_extra%3DhideMan()%3Bparent.parametri%253Dnew+Array('PRENOTAZIONE')%3B%26next_servlet%3Djavascript:next_prenotazione();%26Hclose_js%3Dchiudi_prenotazione()%3B%26Hiden_anag%3D" + anagIden + "&events=onunload&actions=libera_all('" + baseUser.IDEN_PER + "', '" + basePC.IP + "');&visual_bt_direzione=N");
}

function cbk_ambu_pren_consulta(anagIden){
		// ***************************
		top.prenotaDaConsulta = "S";
		// ***************************
	cbk_common_apri('cbk_ambu_pren_consulta', anagIden, "prenotazioneFrame?servlet=consultazioneInizio%3Ftipo%3DCDC%26Hiden_anag%3D" + anagIden + "&events=onunload&actions=libera_all('" + baseUser.IDEN_PER + "', '" + basePC.IP + "');&Hiden_anag=" + anagIden);
}

function cbk_visualizza_numeri_archivio(anagIden)
{
	//alert('anag locale ' + anagIden);
	
	try{
		if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
			return;
		}
	}
	catch(e){
	}
	
	visualizza_numeri_archivio(anagIden);
}


/*
	Funzione di callback
	modifica anagrafica
*/
function modificaAnagrafica(anagIden)
{
	var readOnly = '';

	try{
		if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
			return;
		}
	}
	catch(e){
	}

	if(isNaN(anagIden))
		anagIden = stringa_codici(iden);

	if(anagIden == 0)
	{
    	alert(ritornaJsMsg('selezionare'));
        return;
    }
	
	/* modifica aldo 12-14 */
	if (!isPatientReadOnlyCheck(anagIden)){return;}
	/* ******************* */						
	
	if(readOnly == '')
    	readOnly = stringa_codici(readonly);
	
	// modifica aldo 12-12-14
	// chiedere conferma, nel caso di readonly,
	// se lo si vuole modificare
	
	// ***************************
	
	
	/******************************************************************/
	// modificare : readOnly è sbagliato !! Viene passato div...
	// READONLY=<div class="bianco" title="">
	// <div class="rosso" title="Readonly">
	// modifica aldo 15-12-14
	var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA&IDEN_ANAG='+anagIden+'&READONLY='+ (readOnly.indexOf("rosso")>-1?"S":"N");
	
	var finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	if (finestra) {
		finestra.focus();
	} else {
		finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	}
	
	return finestra;
	/******************************************************************/
}

function inserimentoAnagrafica(){
	var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA';
	
	var ric_per_nome = parent.RicPazRicercaFrame.document.getElementsByName('NOME');
	var ric_per_cod_fisc = parent.RicPazRicercaFrame.document.getElementsByName('COD_FISC');
	
	if(ric_per_nome.length > 0){
		var strCogn = parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value;
        var strNome = parent.RicPazRicercaFrame.document.form_pag_ric.NOME.value;
        var strData = parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value;
		if(strCogn != "") url += "&COGNOME="+strCogn;
		if(strNome != "") url += "&NOME="+strNome;
		if(strData != "") url += "&DATA="+strData;
	}	
	if(ric_per_cod_fisc.length > 0){
        var strCF = parent.RicPazRicercaFrame.document.form_pag_ric.COD_FISC.value;
		if(strCF != "") url += "&COD_FISC="+strCF;
	}
	
	var finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	if (finestra) {
		finestra.focus();
	} else {
		finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	}
	
	return finestra;
}

/*Modifica anagrafica da un link di una worklist*/
function modificaAnagLink(valore){

	var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA';
	
	var idenAnag = '';
    var readOnly = '';
	var doc = document.form_scheda_anag;
	var varAnag = null;
	
	if(valore.toString() == '')
    	idenAnag = stringa_codici(iden);
	else{
		idenAnag = iden[valore];
		readOnly = readonly[valore];
	}
    if(idenAnag == 0){
    	alert(ritornaJsMsg('selezionare'));
        return;
    }

	/* modifica aldo 12-14 */
	if (!isPatientReadOnlyCheck(idenAnag)){return;}
	/* ******************* */					
	
	if(readOnly == '')
    	readOnly = stringa_codici(readonly);
    // modifica aldo 15-12-14
	url = url + "&IDEN_ANAG=" + idenAnag + "&READONLY=" + (readOnly.indexOf("rosso")>-1?"S":"N");	
	var finestra = window.open(url,"wndModificaAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	if (finestra) {
		finestra.focus();
	} else {
		finestra = window.open(url,"wndModificaAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	}
	
	return finestra;
}


function cancellaAnagrafica(iden_canc)
{
	var doc = document.form_canc_paz;
	var scelta = '';
	var ins_pwd = null;
	var finestra = null;
	
	if(isNaN(iden_canc))
		iden_canc = stringa_codici(iden);

    if(iden_canc == 0){
    	alert(ritornaJsMsg('selezionare'));
        return;
    }

	if(baseGlobal.OB_PWD_CANC == 'S'){//doc.ob_pwd_canc.value
		ins_pwd = window.open('SL_InsPwdCancellazione?provenienza=ANAG','', 'height=250,width=400,scrollbars=no,top=200,left=300');
		return;
	}
	else
    	scelta = confirm(ritornaJsMsg('c1'));//Sei sicuro di voler cancellare il record selezionato?
		
    if(scelta == true) 
	{
	    finestra = window.open("","winCancPaz","top=0,left=100000000");
		if (finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra = window.open("","winCancPaz","top=0,left=100000000");
		}
		
		doc.iden_paz_canc.value=iden_canc;
		
		doc.permissione.value = baseUser.COD_OPE;
		doc.ob_pwd_canc.value = baseUser.OB_PWD_CANC;
		doc.ricerca_anagrafica.value = baseGlobal.RICERCA_ANAGRAFICA;
        
		doc.submit();
	}
}

/*
	Funzione utilizzata dalla pagina di Riconciliazione/Sposta Esami
	che deve ricaricare la worklist della riconciliazione in caso 
	della cancellazione di un paziente
*/
function cancAnagRicSpEsami()
{
	var doc = document.form_canc_paz;
	var scelta = '';
	
	iden_canc = stringa_codici(iden);
	doc.permissione.value = baseUser.COD_OPE;
	
	//alert('TIPO RICERCA: ' + document.form.ricerca_anagrafica.value);
	if(document.form.ricerca_anagrafica.value == 2)
	{
		alert(ritornaJsMsg('no_canc_paz_remoti'));//Non si possono effettuare cancellazioni di pazienti remoti.
		return;
	}
    if(iden_canc == 0)
	{
    	alert(ritornaJsMsg('selezionare'));
        return;
    }
    //var scelta = confirm(ritornaJsMsg('c1'));//Sei sicuro di voler cancellare il record selezionato?

	
	if(doc.ob_pwd_canc.value == 'S')
	{
		var ins_pwd = window.open('SL_InsPwdCancellazione?provenienza=ANAG','', 'height=250,width=400,scrollbars=no,top=200,left=300');
		return;
	}
	else
    	scelta = confirm(ritornaJsMsg('c1'));//Sei sicuro di voler cancellare il record selezionato?
	
	
    if(scelta == true) 
	{
		var finestra = window.open("","winCancPaz","top=0,left=100000000");
		if (finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra = window.open("","winCancPaz","top=0,left=100000000");
		}
		
		doc.iden_paz_canc.value=iden_canc;
		
        doc.submit();
		
		parent.RicPazUtilityFrame.reloadMerge();
	}
}


function getCampiRicerca()
{
	var doc = document.form;
	try{
		if(parent.RicPazRicercaFrame.document.form_pag_ric.NOME){
			doc.NOME.value = parent.RicPazRicercaFrame.document.form_pag_ric.NOME.value;	
			doc.COGN.value = parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value;	
			doc.DATA.value = parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value;	
		}
		
		if(parent.RicPazRicercaFrame.document.form_pag_ric.COD_FISC){
			doc.COD_FISC.value = parent.RicPazRicercaFrame.document.form_pag_ric.COD_FISC.value;	
		}
	}
	catch(e){
	}
	
	doc.hidWhere.value = parent.RicPazRicercaFrame.document.form_pag_ric.hidWhere.value;	
	doc.hidOrder.value = parent.RicPazRicercaFrame.document.form_pag_ric.hidOrder.value;	
}


function avanti(numero_pagina)
{
	var doc = document.form;
	
	doc.pagina_da_vis.value = numero_pagina;
	getCampiRicerca();

	doc.submit();
}

function indietro(numero_pagina)
{
	var doc = document.form;
	
	doc.pagina_da_vis.value = numero_pagina;
	getCampiRicerca();
	
	doc.submit();
}

function inserimentoEsame(iden_anag)
{
	//alert('inserimentoEsame: ' + iden_anag);
	var query = null;
	
	try{
		if(iden_anag.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + iden_anag);
			return;
		}
	}
	catch(e){
	}
	
	if(isNaN(iden_anag))
		iden_anag = stringa_codici(iden);
	
	if(iden_anag == '')
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}
	//****** modifica del 10-02-15
	if (top.home.getConfigParam("GESTIONE_ATTIVA_PVCY")=="S"){
		// controllo che abbia compilato il consenso unico
		/*
		if (canInsertPrivacy()){
				alert(top.PVCY_HANDLER.getErrorMessage("PVCY_NOT_COMPILED"));
				return;
		}*/
	}
	// ******************************		
	if(parent.RicPazRicercaFrame.document.form_pag_ric.NUM_NOSOLOGICO){
		//alert('baseGlobal.REPARTO_DI_RICOVERO: ' + baseGlobal.REPARTO_DI_RICOVERO);
		if(baseGlobal.REPARTO_DI_RICOVERO == 'S'){
			query = 'select iden_pro provenienza from nosologici_paziente where iden_anag = ';
			query += iden_anag + " and dimesso = 'N' and deleted = 'N'";
			//alert(query);
			dwr.engine.setAsync(false);
			CJsGestioneAnagrafica.getRepartoRicovero(iden_anag, query, cbk_inserimentoEsame);
			dwr.engine.setAsync(true);
		}
		else
			cbk_inserimentoEsame(iden_anag + ", ''");
	}
	else	
		cbk_inserimentoEsame(iden_anag + ", ''");
}

/**
 */
function cbk_inserimentoEsame(iden_anagIden_pro){
	//alert('cbk_inserimentoEsame: ' + iden_anagIden_pro);
	var iden_anag = null;
	var iden_pro = null;
	var finestra = null;
	var doc = document.form_accetta_paziente;

	// ************************************
	// ******** controllo readonly	
	try{
		/* modifica aldo 07-01-15 */
		if (!isPatientReadOnlyCheck(iden_anagIden_pro.split(",")[0])){return;}
	}
	catch(e){;}
	// *********************************

	try{
		iden_anag = iden_anagIden_pro.split(",")[0];
		iden_pro = iden_anagIden_pro.split(",")[1];
	}
	catch(e){
		alert('ATTENZIONE errore: ' + iden_anagIden_pro + ' - ' + e.description);
	}
	try{
		// ambulatorio
		if (lastOperation !="RIPETI_ESA"){
			doc.action = 'sceltaEsami?cmd_extra=hideMan();&visualizza_metodica=N';
		}
		else{
			doc.action = 'sceltaEsami?extra_where=tab_esa.cod_esa in (select distinct valore_campo_filtro from imagoweb.attributi where attributo=\'INIZIO_CICLO\')&visualizza_metodica=N';
		}
		doc.target = 'winSceltaEsami';
		finestra = window.open("","winSceltaEsami","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
		if (finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra = window.open("","winSceltaEsami","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
		}

		doc.Hiden_anag.value = iden_anag;

		iden_pro = iden_pro.replace(/\'/g, "");
		if(iden_pro != "''")
			doc.Hiden_pro.value = iden_pro;
		else
			doc.Hiden_pro.value = '';

		doc.tipo_registrazione.value = "I";		

		/*Aggiungo il campo hidden per poter ricaricare la worklist degli esami dall'inserimento esame
	dalla ricerca del paziente*/
		var campo_carica_worklist_esami = document.createElement("input");
		campo_carica_worklist_esami.type = 'hidden';
		campo_carica_worklist_esami.name = 'Hservlet_succ';
		if (lastOperation !="RIPETI_ESA"){
			campo_carica_worklist_esami.value = "javascript:opener.worklist_esami(" + iden_anag + ");self.close();";
		}
		else{
			//  try{var pServlet = 'call_servlet("javascript:alert("apro multi calendario");");';}catch(e){;}
			var urlCiclica = "ciclicheAnnuali.html?sorgente=ricercaPazienti&idenEsame=";
			campo_carica_worklist_esami.value = "javascript:document.location.replace(\"" + urlCiclica + "\" + s_iden);";
		}
		
		// modifica RRF, gestione ciclica !!
		// rimappare il valore di Hservlet_succ
		// affinchè apra la finestra del calendario per
		// le cicliche
		// mettere in scheda esame ? o registra_esame ?
		// copiare qui la funzione generaEsamiCiclici di worklistEngine.js
		/*
		$.fancybox({
			'width'				: 800,
			'height'			: '95%',
			'autoScale'     	: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'type'				: 'iframe'		,
			'href'		: 'ciclicheAnnuali.html?sorgente=prenRapporto'	
		});	*/
		
		// ************************


		doc.appendChild(campo_carica_worklist_esami);

		doc.submit();
	}
	catch(e){
		alert("cbk_inserimentoEsame - Error: "+ e.description);
	}
}

function apri_worklist()
{
	parent.document.location.replace("worklistInizio");
}


function conta_record_trovati()
{
	var risultato_ricerca = document.all.oTable.rows.length;	
	
	//alert('Risultato Ricerca: ' + risultato_ricerca);
	try
	{
		if(risultato_ricerca == 0 && (parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value != '' || parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value != ''))
		{	
		document.write('<html><head></head><body><table id="ricPazTable" class="classDataTable"><tr><td class="bianco"><div class="classRicVuota">Nessun Paziente trovato con i criteri impostati</div></td></tr></table></body></html>');
		}
	}
	catch(e){
	}
}


function finestra_attesa(provenienza)
{
	alert('PROVENIENZA: ' + provenienza);

	try{
		top.home.chiudi_attesa();	
	}
	catch(e){
		try{
			parent.top.home.chiudi_attesa();	
		}
		catch(e){
		}
	}
	
	var oggetto = document.getElementById("oTable");

	if(oggetto && provenienza != 'prenotazioneOrario')
		oggetto.ondblclick = function(){gestioneAnagrafica('VIS_ESA');}//oggetto.ondblclick = function(){worklist_esami();}
	else
		oggetto.ondblclick = function(){worklist_esami_da_prenotazione();}
}


function worklist_esami(iden_anag)
{
	//alert('worklist_esami: ' + iden_anag);
	var doc = document.form_visualizza_esami;
	
	try{
		if(iden_anag.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + iden_anag);
			return;
		}
	}
	catch(e){
	}
	
	if(isNaN(iden_anag))
	{
		iden_anag = stringa_codici(iden);
		if(isNaN(iden_anag))
			iden_anag = iden[0];
	}
	//Non dovrebbe servire
	if(iden_anag == '')
		iden_anag = -100;
	
	doc.iden_anag.value = iden_anag;

	doc.target = 'RicPazWorklistFrame';//RicPazRecordFrame
	doc.action = 'worklist';
	
	doc.tipowk.value = 'WK_AMB_ESAMI_PER_UTENTE';

	if(parent.RicPazUtilityFrame)
		doc.namecontextmenu.value = 'worklistRiconciliaSpostaEsami';
	else
		doc.namecontextmenu.value = 'worklistRicPaz';
	
	doc.hidWhere.value = 'where iden_anag = ' + iden_anag;
	
	//alert('TEST: ' + doc.hidWhere.value);

	doc.submit();
}

/**
Funzione richiamata da Inserimento Paziente solo a VERONA
*/
function inserimentoAnagraficaVerona()
{

 if(parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value=='' || parent.RicPazRicercaFrame.document.form_pag_ric.NOME.value=='' || parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value=='' )
	{
	alert("Effettuare prima la ricerca compilando nome cognome e data di nascita del paziente")
	return;
	}

	inserimentoAnagrafica()
}



function diarioMedico(){
	var iden_anag = null;
	var servlet = null;
	
	iden_anag = stringa_codici(iden);
	if(iden_anag == ''){
		alert('Attenzione: selezionare un paziente');
		return;
	}
	
	//alert(iden_anag);
	
	servlet = "SL_RicercaGenericaFrameset?modulo=DIARIO_MEDICO";
	servlet += "&rf1=105&rf2=*&rf3=0";
	servlet += "&provenienza=ricercaPaziente";
	servlet += "&tipo_ricerca=7";
	servlet += "&iden_anag="+iden_anag;
	
	//window.open(servlet,"","width="+screen.width+",height="+screen.height+", status=yes, top=0,left=0");
	window.open(servlet,"","width=1280,height=1024, status=yes, top=0,left=0");
}



// ********************** ambulatorio
function apriRepository(){
	var myLista = new Array();
	var urlRepo = "";
	var rs ;
	var paramUrl = "";
	var stm ;
	
	try{

		myLista = new Array();
		myLista.push("RADIO");
		var anagIden = stringa_codici(iden);
		if (anagIden==""){
			alert("Errore: codice anagrafica non valido");
			return;
		}
		myLista.push(anagIden);
		
		stm = top.executeStatement('info_repository.xml','getRepositoryKeys',myLista,2);
		if (stm[0]!="OK"){
			alert("Errore: problemi nel recupero dati Repository");
			return;
		}
		urlRepo = stm[2]; // primo parametro output
		paramUrl = stm[3]; // secondo parametro output
		if ((urlRepo=="")||(paramUrl=="")){
			alert("Errore: Url repository non corretta. urlRepo: " + urlRepo  +" paramUrl: " + paramUrl);
			return;
		}
		// apro repository
		//alert("chiamo: " + urlRepo+"?User=ImagoWeb&IdPatient="+paramUrl);
		var myWin=window.open(urlRepo+"?User=ImagoWeb&IdPatient="+paramUrl,"","toolbar=no, menubar=no, resizable=yes, height=500, width=400,top=0,left=0,status=yes");
	}
	catch(e){
		alert("apriRepository - Error: " + e.description);
	}
}



function apriIPatient(){
	// getParamConfigPage   info_repository.xml
	// select valore from ges_config_page where parametro ='WHALE_URL_AUTOLOGIN' and pagina ='SNODO';
	
	var idenAnag = ""		;
	var nEsami ; var idenRemoto = "";
	var myLista = new Array();
	var urlWhale=""; var urlToCall="";
	var rs ;
	try{
		idenAnag = stringa_codici(iden);
		
		myLista.push("WHALE_URL_AUTOLOGIN");		
		myLista.push("SNODO");
		rs = top.executeQuery('info_repository.xml','getParamConfigPage',myLista);
		if (rs.next()){
			urlWhale = rs.getString("valore");
		}
		else{	alert("Errore: non definita pagina di configurazione nel DB");return;		}
		
		// **** da togliere
		// usato solo per il test
//		urlWhale = "http://10.99.1.129:9314/whale/autoLogin";
		// ****************************
	
		//alert(urlWhale + " " + idenAnag );
		// http://10.99.1.129:9314/whale/autoLogin?utente=<user>&pagina=I-PATIENT&ID_PAZIENTE=<idRemoto>&PROV_CHIAMATA=AMBULATORIO
		myLista = new Array();
		myLista.push(idenAnag);
		rs = top.executeQuery('info_repository.xml','getIdenRemoto',myLista);
		if (rs.next()){
			idenRemoto = rs.getString("ID_REMOTO");
		}
		if (idenRemoto==""){alert("Errore: idenRemoto nullo");return;	}
		urlToCall = urlWhale + "?utente=" + top.baseUser.LOGIN + "&pagina=I-PATIENT&ID_PAZIENTE=" + idenRemoto + "&PROV_CHIAMATA=AMBULATORIO";
		//alert(urlToCall);
		myWinCartella = window.open(urlToCall,"schedaRicovero","top=0,left=0, width=" + screen.availWidth +", height=" + screen.availHeight + ", status=no, scrollbars=yes");
		
	}
	catch(e){
		alert("apriIPatient - Error: " + e.description );
	}	
}


// **************** TONIUTTI *****************
function buildIconeLettera(){
	var idenAnag = "";
	var idenEsame = "";
	var stringaReparto = "";
	var idenRemoto= "";
	var diagnosi = "";
	var myLista;
	try{
		$("SPAN[class='placeHolderCreaLettera']").each(function(){		
			try{
				//jQuery(this).addClass("icoCompDiagnosiCompilata");
				idenAnag = jQuery(this).attr("id").toString().split("_")[1];
				jQuery(this).attr('title','Crea nuova lettera');
				jQuery(this).click(function(){
					//setTimeout("apriLettera(" + idenAnagLettera+ ");",1000);
					apriLettera(this);
					return true;
				});
			}catch(e){;}
		});
	}catch(e){alert("buildIconeLettera - Error: " + e.description);}
}


function apriLettera(oggetto){
	var myLista = new Array();
	var idenEsame = "";
	var rs , stm , oggetto;
	var myWin;	
	var urlLettera = "layoutLettera/consoleLettera.html";
	var paramLettera ="";
	try{
		var idenAnag="";
		idenAnag = oggetto.id.toString().split("_")[1];
		myLista = new Array();
		if ((typeof idenAnag=="undefined")||(idenAnag=="")){alert("Errore: id anagrafico null");return;}
		myLista.push(idenAnag);		
		myLista.push(baseUser.IDEN_PER);
		stm = top.executeStatement('lettera.xml','createExam',myLista,1);
		if (stm[0]!="OK"){
			alert("Errore: problemi nella creazione della prestazione");
			return;
		}
		idenEsame = stm[2]; // primo parametro output
		if ((idenEsame=="")){
			alert("Errore: ID esame non valido.");
			return;
		}		
		
		paramLettera = "?iden_anag=" + idenAnag + "&iden_esame=" + idenEsame + "&iden_ref=&login=" +  baseUser.LOGIN + "&iden_medr=" + baseUser.IDEN_PER;
//		alert(urlLettera + paramLettera);
		var finestra = window.open(urlLettera + paramLettera,"wndInserimentoAnagrafica","status=1,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
		if (finestra) {
			finestra.focus();
		} else {
			finestra = window.open(urlLettera + paramLettera,"wndInserimentoAnagrafica","status=1,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
		}		
	}
	catch(e){
		alert("apriLettera - Error: " + e.description);
	}
}

// *******************************

function allegafile_fromWkAnag() {

	var url_send ="";
	var iden_anag = "";
	try{
		iden_anag = stringa_codici(iden);
		if (iden_anag == ""){
			alert("Prego, selezionare un paziente.");
			return;
		}
		// modifica 3-12-15
		if (checkPvcy1A()){return false;}
		// ******************			
		url_send = 'SrvScanFrameset?all_iden_esa=&all_iden_anag=' + iden_anag;
		var wndScan = window.open(url_send,"wndScan","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
		if(wndScan)
		{
			wndScan.focus();
		}
		else
		{
			wndScan = window.open(url_send,"wndScan","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
		}
	}
	catch(e){
		alert("allegafile_fromWkAnag - Error: "+ e.description);
	}
}


function toDoAfterWkBuild(){
	try{
		try{
			if (top.home.getConfigParam("GESTIONE_SOLE")=="S"){
				creaLivelloConsensoSole();
			}
		}catch(e){;}
		// ***********************
		// modifica 30-04-2015
		try{
			if (top.home.getConfigParam("SITO")=="SAVONA"){
				$("span[id^='anagIniziativa_']").each(function() {
					$(this).click(function( event ) {
						event.stopPropagation();
						var idAnag = $(this).attr("id").split("_")[1];
						top.gestioneNotifiche.openByIdenAnag(idAnag);
					})
				});
			}
		}catch(e){;}
		// ***********************
		// modifica 14-5-15
		//anonym_	
		// subordinare click su attributo GESTIONE_ANONIMATO
		// dell'utente
		$("span[id^='anonym_']").each(function() {
			$(this).click(function( event ) {
				event.stopPropagation();
				var idAnag = $(this).attr("id").split("_")[1];
				creaCodiceAnonimato(idAnag);
			})
		});				
	}
	catch(e){
		alert("toDoAfterWkBuild - Error: " + e.description);
	}
}


// ************************************
// ******** modifica cicliche 
// ************************************
function ripetiCiclo(){
	try{
//		alert("ripeti !");
		gestioneAnagrafica('RIPETI_ESA')
	}
	catch(e){
		alert ("ripetiCiclo - Error: " + e.description);
	}
}


// modifica 10-3-2015
// modifica 27-4-15
// modifica 11-5-15
// modifica 14-6-16
// modifica 14-7-16
// prendere in toto
function generaEsamiCiclici(valore, idenEsame, jsonObj, closeOnExit){
	try{
		var bolEsitoInsert = true;
		var strTmpData = "";
		// valore contiene le date in formato gg/mm/yyyy
		var listaDate ;
		var myLista 
		var stm;
		var myJson ;

		var myCloseOnExit = true;
		if (typeof closeOnExit=="undefined"){myCloseOnExit = true;		}
		else{	myCloseOnExit = closeOnExit;}
		
		try{
			myJson = JSON.parse(jsonObj);
		}
		catch(e){
			alert("Errore di conversione dati. Impossibile continuare.");
			return;
		}

		if (valore==""){
			alert("Nessuna data valida selezionata");
			return;
		}
		if (myJson.ora_accettazione=="" || myJson.ora_accettazione=="undefined"){
			alert("Nessuna ora valida selezionata");
			return ;
		}		
		/*
		if (isNaN(idenEsame)){
			alert("Errore: id esame nullo !!");
			gestioneAnagrafica('VIS_ESA');
		}*/
		
//		alert(valore); return;
		listaData = valore.split(",");
		//var idenEsame = stringa_codici(array_iden_esame);
		var idenPerUtente = baseUser.IDEN_PER ;
		

		var listaEsami = idenEsame.split("*");
		var ID_GRUPPO_CICLICA = "";		
		
		for (var z=0;z<listaEsami.length;z++){
			ID_GRUPPO_CICLICA = "";			
			// *** nuovo 
			// genero id aggregante
			stm = top.executeStatement('worklist_main.xml','getIdGruppoCiclica',[],1);
			if (stm[0]!="OK"){
				alert("Errore: problemi nel recupero id gruppo cicliche.\n"+ + stm[1]);
				return;
			}
			ID_GRUPPO_CICLICA = stm[2]; // primo parametro output
			if (isNaN(ID_GRUPPO_CICLICA)){
				alert("Errore: codice gruppo ciclica NON numerico.");
				return;			
			}
			for (var i=0;i<listaData.length;i++){
				myLista = new Array();
//				myLista.push(idenEsame);		
				myLista.push(listaEsami[z]);		
				myLista.push(idenPerUtente);
				strTmpData = listaData[i].substring(6,10) + listaData[i].substring(3,5) + listaData[i].substring(0,2);
				myLista.push(strTmpData);
				myLista.push(parseInt(ID_GRUPPO_CICLICA)); 
				// *************
				if (i== listaData.length-1){
					// ultimo del pacchetto
					myLista.push("S");
				}
				else{
					myLista.push("N");
				}
				//***********
				myLista.push(myJson.ora_accettazione);
				myLista.push(myJson.note_accettazione);			
	//			alert(idenEsame +"#"+ idenPerUtente + "#" + strTmpData+"#" + JSON.stringify(myJson));
				stm = top.executeStatement('worklist_main.xml','creaEsameCiclico',myLista,0);
				if (stm[0]!="OK"){
					alert("Errore: problemi nel salvataggio dell'esame ciclico.\n" + stm[1]);
					bolEsitoInsert = false;
					break;
				}			
			} // fine loop sulle data
		} // fine loop su esami
		if (!bolEsitoInsert){
			// ERRORE!!
			// todo completare
			return;
		}
		else{
			// alla fine vado a visualizzare tutti gli esami del paziente
			if(myCloseOnExit){gestioneAnagrafica('VIS_ESA');}
		}
	}
	catch(e){
		alert("generaEsamiCiclici - Error: " + e.description);
	}	
}
// ************************************



/* modifica aldo 12-14 */
// ritorna true se è tutto ok e si può procedere
function isPatientReadOnlyCheck(idenAnag){
	var bolCheck = false;
	var readOnly = "";
	try{var rs = top.executeQuery('anagrafica.xml','getReadOnlyState',[idenAnag]);}catch(e){alert("Error on getReadOnlyState"); return;}
	if (rs.next()){
			readOnly = rs.getString("readonly");
	}
	else{
		 alert("Errore grave: non esiste il paziente"); return false;
	}

	if (readOnly == "S"){
		bolCheck = false;
		if (confirm("Attenzione l'anagrafica non e' completa, per agire su di essa si devono compilare le informazioni obbligatorie, procedere?")){
			// apro scheda anagrafica
			var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA';
			url = url + "&IDEN_ANAG=" + idenAnag + "&READONLY=" + readOnly + "&SBLOCCA_READONLY=S";
			var finestra = window.open(url,"wndModificaAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
			if (finestra) {
				finestra.focus();
			} else {
				finestra = window.open(url,"wndModificaAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
			}			
		}
	}
	else{
		bolCheck = true;
	}
	return bolCheck;
}
/* ******************* */



// ***********************
// modifica 12-5-15
// ***********************
String.prototype.getTodayStringFormat = function()
{
	var dataOggi ;
	dataOggi=new Date();
	var dataOggiGiorno=dataOggi.getDate();
	if (parseInt(dataOggiGiorno)<10){dataOggiGiorno = "0" + dataOggiGiorno.toString();}
	var dataOggiMese=dataOggi.getMonth()+1;
	if (parseInt(dataOggiMese)<10){dataOggiMese = "0" + dataOggiMese.toString(); }
	var dataOggiAnno=dataOggi.getFullYear();
	var dataOggiStringa= dataOggiAnno.toString() + dataOggiMese.toString() + dataOggiGiorno.toString();
	return dataOggiStringa;
};

function stampaReport(funzione_chiamante){
	try{
		var idenAnag = "", sf = "";var finestraStampa;
		if (funzione_chiamante==""){return;}
		//alert(funzione_chiamante);
		// modifica 3-12-15
		if (stringa_codici(iden)==""){
			alert(ritornaJsMsg('selezionare'));
			return;		
		}
		if (checkPvcy1A()){return false;}
		// ******************		
		switch (funzione_chiamante){
			case"LISTA_PRENO_PAZ":
				idenAnag = stringa_codici(iden).split("*")[0];
//				idenEsame=idenEsame.replace(/\*/g, ",");
				sf= "{ESAMI.IDEN_ANAG} = " + idenAnag  + " and {ESAMI.REPARTO} in ['" +  baseUser.LISTAREPARTI.toString().replace(/,/g, "','") + "']";
				sf += " AND {ESAMI.DAT_ESA} >'" + (new String("")).getTodayStringFormat() +"'";
				// modifica 2-10-15
//				sf += " AND {ESAMI.PRENOTATO} ='1' and {ESAMI.ACCETTATO} ='0'";
				sf += " AND {ESAMI.ESEGUITO} ='0'";
				// *****
				sf += " AND {ESAMI.DELETED} ='N'";
				strUrl = "elabStampa?stampaFunzioneStampa="+funzione_chiamante+"&stampaSelection=" + sf + "&stampaAnteprima=S";
					finestraStampa  = window.open(strUrl,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight); 
				if(finestraStampa){finestraStampa.focus();}
					else{finestraStampa  = window.open(strUrl,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);}
				break;
			default:
				break;
		}
	}	
	catch(e){
		alert("stampaReport - error: " + e.description);
	}
}
// ***********************

// modifica 14-5-15
function creaCodiceAnonimato(){
	try{
/*
		if (!confirm("Proseguire con la creazione di un codice di anonimato per il paziente selezionato ?")){
			return false;
		}*/
	
		if (stringa_codici(iden)==""){
			alert(ritornaJsMsg('selezionare'));
			return;		
		}
		// modifica 3-12-15
		if (checkPvcy1A()){return false;}
		// ******************			
		var urlGestAnonimato="addOn/gestioneAnonimato/gestioneAnonimato.html";
		var param = "";
		param = "?idenAnag=" + stringa_codici(iden); + "&struttura=" ;
		$.fancybox({
			'href'			: urlGestAnonimato + param + "&sorgente=worklist",
			'width'				: '60%',
			'height'			: 250,
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
			'type'				: 'iframe',
			'showCloseButton'	: false,
			'iframe': {
				preload: false // fixes issue with iframe and IE
			},
			'scrolling'   		: 'no',
			onStart		:	function() {
				//return window.confirm('Continue?');
			},
			onCancel	:	function() {
				//alert('Canceled!');
			},
			onComplete	:	function() {
				//alert('Completed!');
			},
			onCleanup	:	function() {
				//return window.confirm('Close?');
			},
			onClosed	:	function() {
				try{
					//alert("onclosed");
				}catch(e){alert(e.description +"##");}
				//aggiorna();
			}
		});	
	}	
	catch(e){
		alert("creaCodiceAnonimato - error: " + e.description);
	}		
	
}

// modifica 5-6-15
function openCertEsenzioni(){
	try{
		if (stringa_codici(iden)==""){
			alert(ritornaJsMsg('selezionare'));
			return;		
		}		
		var urlGestEsenzioni="addOn/moduliEsenzioni/moduliEsenzioni.html";
		var param = "";
		param = "?idenAnag=" + stringa_codici(iden);
		window.open(urlGestEsenzioni + param + "&sorgente=worklist","",'top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight+ ",status=yes,scrollbars=yes");
		return;
		$.fancybox({
			'href'			: urlGestEsenzioni + param + "&sorgente=worklist",
			'width'				: '90%',
			'height'			: '90%',
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
			'type'				: 'iframe',
			'showCloseButton'	: false,
			'iframe': {
				preload: false // fixes issue with iframe and IE
			},
//			'scrolling'   		: 'no',
			onStart		:	function() {
				//return window.confirm('Continue?');
			},
			onCancel	:	function() {
				//alert('Canceled!');
			},
			onComplete	:	function() {
				//alert('Completed!');
			},
			onCleanup	:	function() {
				//return window.confirm('Close?');
			},
			onClosed	:	function() {
				try{
					//alert("onclosed");
				}catch(e){alert(e.description +"##");}
				//aggiorna();
			}
		});			
	}	
	catch(e){
		alert("openCertEsenzioni - error: " + e.description);
	}		
}

// modifica 3-12-15
// return true se OSCURATO
// return false se VISIBILE
function checkPvcy1A(){
	var bolEsito = false;
	try{
		if ((top.home.getConfigParam("SITO")=="SAVONA")&& (top.home.getConfigParam("GESTIONE_ATTIVA_PVCY")=="S")){
			// controllo se è oscurato
			if (isOscurato()){
				bolEsito = true;
				alert(top.PVCY_HANDLER.getErrorMessage("PVCY_1A_SET"));
			}
		}	
	}catch(e){;}
	return  bolEsito;
}


//  modifica 20-1-16
function rimuoviCodiceAnonimato(){
	try{
		if (stringa_codici(iden)==""){
			alert(ritornaJsMsg('selezionare'));
			return;		
		}	
		var idPaziente=stringa_codici(iden).split("*")[0];

		if (idPaziente!=""){
			if (!confirm("Procedere con la rimozione dell'anonimato per tutte le unita' eroganti di propria competenza?")){return;}
			var out = top.executeStatement('gestione_anonimato.xml','rimuoviAnonimoByIdenAnag',[idPaziente]);			
			if (out[0] != 'OK') {
				alert("Errore " + out[1]);
			}
			else{
				alert("Anonimato rimosso correttamente.");
				aggiorna();
			}
		}
		else{
			alert("Errore grave, codici nulli!!\n" + idPaziente + "#\n" + cdc +"#");
		}
		
	}	
	catch(e){
		alert("rimuoviCodiceAnonimato - error: " + e.description);
	}			
}