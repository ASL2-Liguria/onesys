/**
 * File JavaScript in uso dalla worklist WK_RICETTE_CONFERMATE.
 */

var tipoUtente=baseUser.TIPO;
var wnd = top;

$(document).ready(function(){
	try {
		top.removeVeloNero('oIFWk');
		wnd = top;
	} catch(e) {
		parent.removeVeloNero('oIFWk');
		wnd = parent;
	}
});

/**
 * Apre la pagina di inserimento ricetta farmaci.
 */
function Ricetta_Farmaci_Ins() {
	var codFisc = parent.document.getElementById('idRemoto') ? parent.document.getElementById('idRemoto').value : stringa_codici(array_id_remoto);
	if (codFisc == '') {
		return alert('Attenzione! Nessun paziente selezionato.');
	}

	var param = [
		"KEY_LEGAME=RICETTA_FARMACI",
		"idRemoto="+codFisc,
		"utente="+baseUser.LOGIN,
		//"DA_DATA="+(parent.$("form[name=EXTERN] input[name=DA_DATA]").val() || ""),
		//"A_DATA="+(parent.$("form[name=EXTERN] input[name=A_DATA]").val() || ""),
		"PROV="+(parent.$("form[name=EXTERN] input[name=PROV]").val() || ""),
	];
	wnd.location.replace("servletGenerator?"+param.join("&"));
}

/**
 * Apre la pagina di inserimento ricetta prestazioni.
 */
function Ricetta_Prestazioni_Ins() {
	var codFisc = parent.document.getElementById('idRemoto') ? parent.document.getElementById('idRemoto').value : stringa_codici(array_id_remoto);
	if (codFisc == '') {
		return alert('Attenzione! Nessun paziente selezionato.');
	}
	
	var param = [
		"KEY_LEGAME=RICETTA_PRESTAZIONI",
		"idRemoto="+codFisc,
		"utente="+baseUser.LOGIN,
		//"DA_DATA="+(parent.$("form[name=EXTERN] input[name=DA_DATA]").val() || ""),
		//"A_DATA="+(parent.$("form[name=EXTERN] input[name=A_DATA]").val() || ""),
		"PROV="+(parent.$("form[name=EXTERN] input[name=PROV]").val() || ""),
	];
	wnd.location.replace("servletGenerator?"+param.join("&"));
}

/**
 * Modifica la ricetta selezionata nella worklist.
 * Nota: nel caso di una ricetta nello stato I, la cancellazione delle ricette dalla testata viene fatta
 * alla registrazione della scheda.
 * 
 * @param idenProgressivo
 * @param tipoRicetta
 * @param statoRicetta
 */
function Ricetta_Modifica(idenProgressivo, tipoRicetta, statoRicetta) {
	// Se nella worklist è presente soltanto una riga, la seleziona
	if ($('table#oTable tr').length == 1) {
		illumina(0);
	}
	else if (vettore_indici_sel.toString() == '') {
		alert('Attenzione! Selezionare una riga');
		return;
	}
	else if(vettore_indici_sel.toString().indexOf(",")!='-1') {
		alert('Attenzione! Selezionare soltanto una riga');
		return;
	}
	
	var codFisc = parent.document.getElementById('idRemoto') ? parent.document.getElementById('idRemoto').value : stringa_codici(array_id_remoto);
	if (codFisc == '') {
		return alert('Attenzione! Nessun paziente selezionato.');
	}
	
	if (typeof idenProgressivo == 'undefined'){
		idenProgressivo=array_progressivo[vettore_indici_sel];
		tipoRicetta=array_tipo_ricetta[vettore_indici_sel];
		statoRicetta=array_stato[vettore_indici_sel];
	}
	
	if ((Number(idenProgressivo) || 0) < 1)
		return alert('Attenzione! La ricetta non può essere modificata da questa interfaccia');
	
	switch(statoRicetta) {
	case 'D':
		alert('Attenzione! La ricetta è stata cancellata, non può essere modificata');
		return;
	case 'C':
		if(confirm('Attenzione! La ricetta è già confermata.\nDuplicare la ricetta selezionata?')){
			Ricetta_Duplica(idenProgressivo,tipoRicetta,statoRicetta);
		}
		return;
	case 'S':
		if(confirm('Attenzione! La ricetta è già stata inviata.\nDuplicare la ricetta selezionata?')){
			Ricetta_Duplica(idenProgressivo,tipoRicetta,statoRicetta);
		}
		return;
	default:
	}

	var call_Tipo= tipoRicetta;
	
	//Apertura Ricetta con dati precedentemente inseriti.
	var Tipo_Scheda="RICETTA_PRESTAZIONI";
	
	if (call_Tipo == "P" || call_Tipo=="Q"){
		
		Tipo_Scheda="RICETTA_PRESTAZIONI";
	
	}else if (call_Tipo == "F" || call_Tipo=="B"){
		
		Tipo_Scheda="RICETTA_FARMACI";
	}
	
/*	var finestra = window.open("servletGenerator?KEY_LEGAME="+Tipo_Scheda+"&SITO=LOAD&idenprogressivo="+idenProgressivo+"&DUPLICA=N","","status=yes fullscreen=yes scrollbars=yes", true);	
	//Chiusura Worklist
	chiudi();*/
	
	var param = [
		"KEY_LEGAME="+Tipo_Scheda,
		"SITO=LOAD",
		"idRemoto="+codFisc,
		"idenprogressivo="+idenProgressivo,
		"DUPLICA=N",
		//"DA_DATA="+(parent.$("form[name=EXTERN] input[name=DA_DATA]").val() || ""),
		//"A_DATA="+(parent.$("form[name=EXTERN] input[name=A_DATA]").val() || ""),
		"PROV="+(parent.$("form[name=EXTERN] input[name=PROV]").val() || ""),
	];
	wnd.location.replace("servletGenerator?"+param.join("&"));
}

/**
 * Duplica la ricetta selezionata nella worklist.
 * 
 * @param idenProgressivo
 * @param tipoRicetta
 * @param statoRicetta
 */
function Ricetta_Duplica(idenProgressivo, tipoRicetta, statoRicetta){	
	// Se nella worklist è presente soltanto una riga, la seleziona
	if ($('table#oTable tr').length == 1) {
		illumina(0);
	}
	else if (vettore_indici_sel.toString() == '') {
		alert('Attenzione! Selezionare una riga');
		return;
	}
	else if(vettore_indici_sel.toString().indexOf(",")!='-1') {
		alert('Attenzione! Selezionare soltanto una riga');
		return;
	}

	var codFisc = parent.document.getElementById('idRemoto') ? parent.document.getElementById('idRemoto').value : stringa_codici(array_id_remoto);
	if (codFisc == '') {
		return alert('Attenzione! Nessun paziente selezionato.');
	}
	
	if (typeof idenProgressivo == 'undefined'){
		idenProgressivo=array_progressivo[vettore_indici_sel];
		tipoRicetta=array_tipo_ricetta[vettore_indici_sel];
		statoRicetta=array_stato[vettore_indici_sel];
	}

	var call_Tipo= tipoRicetta;
	
	//Apertura Ricetta con dati precedentemente inseriti.
	var Tipo_Scheda="RICETTA_PRESTAZIONI";
	
	if (call_Tipo == "P" || call_Tipo=="Q"){
		
		Tipo_Scheda="RICETTA_PRESTAZIONI";
	
	}else if (call_Tipo == "F" || call_Tipo=="B"){
		
		Tipo_Scheda="RICETTA_FARMACI";
	}
	
	var param = [
		"KEY_LEGAME="+Tipo_Scheda,
		"SITO=LOAD",
		"idRemoto="+codFisc,
		"idenprogressivo="+idenProgressivo,
		"DUPLICA=S",
		//"DA_DATA="+(parent.$("form[name=EXTERN] input[name=DA_DATA]").val() || ""),
		//"A_DATA="+(parent.$("form[name=EXTERN] input[name=A_DATA]").val() || ""),
		"PROV="+(parent.$("form[name=EXTERN] input[name=PROV]").val() || ""),
	];
	
	wnd.location.replace("servletGenerator?"+param.join("&"));
	//window.open("servletGenerator?KEY_LEGAME="+Tipo_Scheda+"&SITO=ALL&idRemoto="+parent.document.getElementById('idRemoto').value+"&idenprogressivo="+idenProgressivo+"&DUPLICA=S","","status=yes fullscreen=yes scrollbars=yes", true);
	
	//Chiusura Worklist
	//chiudi();
	//parent.location.replace("servletGenerator?KEY_LEGAME="+Tipo_Scheda+"&SITO=LOAD&idenprogressivo="+idenProgressivo+"&DUPLICA=S","","status=yes fullscreen=yes scrollbars=yes", true);
}

/**
 * Cancella la ricetta selezionata.
 */
function Ricetta_Cancella(){
	// Se nella worklist è presente soltanto una riga, la seleziona
	if ($('table#oTable tr').length == 1) {
		illumina(0);
	}	
	else if (vettore_indici_sel.toString() == '') {
		alert('Attenzione! Selezionare una riga');
		return;
	}
	else if(vettore_indici_sel.toString().indexOf(",")!='-1') {
		alert('Attenzione! Selezionare soltanto una riga');
		return;
	}
	
	var x = vettore_indici_sel[0];
	statoRicetta=array_stato[x];
	if (statoRicetta=="D"){
		alert("Attenzione! La ricetta è già stata cancellata!");
		return;
	}
	else{ 
		if(confirm('Si conferma la cancellazione della ricetta selezionata?')){
			dwr.engine.setAsync(false);
			dwrUtility.executeStatement("rr_statement.xml", "cancellaRicetta", [array_iden_testata[x]], 1, function(resp) {
				if(resp[0]=='OK') {
					if (/^OK/i.test(resp[2]) == false) {
						return alert(resp[2]);
					}
					parent.Ricerca();
				} else{
					alert(resp[1]);
				}
			});
			dwr.engine.setAsync(true);
		}
	}
		
	//Chiusura Worklist
	//chiudi();
}

/**
 * Conferma e stampa (opzionalmente) le ricette rosse tradizionali.
 * 
 * @param opzioni
 */
function Ricetta_Conferma_Stampa(opzioni){
	opzioni = typeof opzioni === 'object' ? opzioni : {};
	opzioni.stampa = typeof opzioni.stampa === 'boolean' ? opzioni.stampa : true;
	
	// Se nella worklist è presente soltanto una riga, la seleziona
	if ($('table#oTable tr').length == 1) {
		illumina(0);
	}
	else if (vettore_indici_sel.toString() == '') {
		var ricette = parent.$('#RICETTE_CREATE').val();
		if (opzioni.stampa == true && $('table#oTable tr').length > 0 && typeof ricette === 'string') {
			for (var i=0, length=$('table#oTable tr').length; i<length; i++) {
				if (ricette.indexOf(array_iden_testata[i].toString()) > -1) {
					illumina_multiplo_generica(i, array_iden_testata);
				}
			}
		}
		else {
			alert('Attenzione! Selezionare una riga');
			return;
		}
	}
	
	var tipoRicetta = '';
	var idenRicetteDaStampare = [];
	var idenRicetteDaConfermare = [];
	var arrayTipoRicettaStampa = [];
	var statoRicetta = '';
	var dematerializzata = '';
	var confermabile = '';
	for(var i=0;i<vettore_indici_sel.length;i++){		
		var x = vettore_indici_sel[i];
		
		// Se la ricetta corrente è dematerializzata, salta e passa alla ricetta successiva
		dematerializzata = array_dematerializzata[x];
		if (dematerializzata!='N') continue;
		
		var idenTestata=array_iden_testata[x];
		tipoRicetta=array_tipo_ricetta[x];
		statoRicetta=array_stato[x];
		confermabile=array_confermabile[x];
		
		if (confermabile=='S'){
			idenRicetteDaConfermare.push(idenTestata);
		}
		
		if (tipoRicetta == 'F' || tipoRicetta == 'P'){
			if (statoRicetta == 'I' || statoRicetta=='C' || statoRicetta=='S'){
				idenRicetteDaStampare.push(idenTestata);
				arrayTipoRicettaStampa.push(tipoRicetta);
			}
		}
	}
	if (idenRicetteDaConfermare.length == 0) {
		if (!opzioni.stampa){
			alert('Attenzione! Solo le ricette Inserite non dematerializzate possono essere Confermate');
			return;
		}
	} else if (tipoUtente == 'I') {
		alert('Attenzione! A questo tipo di utente non è consentita la conferma o la stampa di ricette inserite');
		return;
	}
	if (idenRicetteDaStampare.length == 0){
		alert('Attenzione! Nessuna delle ricette selezionate è confermabile o stampabile come ricetta rossa');
		return;
	}
	if (idenRicetteDaStampare.length != vettore_indici_sel.length){
		if (!opzioni.stampa) {
			alert('Attenzione! Solo le ricette Inserite non dematerializzate possono essere Confermate');
		} else {
			alert('Attenzione! Alcune delle ricette selezionate non sono stampabili come ricetta rossa o sono state cancellate');
		}
		return;
	}
	
	dwr.engine.setAsync(false);
	dwrUtility.executeStatement("rr_statement.xml", "confermaRicetta", [idenRicetteDaConfermare.join(","), idenRicetteDaStampare.join(","), 'C', (opzioni.stampa ? 'S' : 'N')], 1, function(resp) {
		if(resp[0]=='OK') {
			if (/^OK/i.test(resp[2]) == false) {
				return alert(resp[2]);
			}
			if (opzioni.stampa){
				try {
					NS_STAMPA_RICETTE.configuraStampa(idenRicetteDaStampare,arrayTipoRicettaStampa);
				} catch (e) {
					alert(e.message);
				}
			} else {
				parent.Ricerca();
			}
		} else{
			alert(resp[1]);
		}
	});
	dwr.engine.setAsync(true);
	
	//Chiusura Worklist
	//chiudi();
}

/**
 * Stampa le ricette bianche di farmaci prestazioni.
 */
function Ricetta_Bianca(){
	// Se nella worklist è presente soltanto una riga, la seleziona
	if ($('table#oTable tr').length == 1) {
		illumina(0);
	}
	else if (vettore_indici_sel.toString() == '') {
		var ricette = parent.$('#RICETTE_CREATE').val();
		if ($('table#oTable tr').length > 0 && typeof ricette === 'string') {
			for (var i=0, length=$('table#oTable tr').length; i<length; i++) {
				if (ricette.indexOf(array_iden_testata[i].toString()) > -1) {
					illumina_multiplo_generica(i, array_iden_testata);
				}
			}
		}
		else {
			alert('Attenzione! Selezionare una riga');
			return;
		}
	}
	
	var idenRicette = [];
	var arrayTipoRicettaStampa=[];
	for(var i=0;i<vettore_indici_sel.length;i++){
		var x = vettore_indici_sel[i];
		
		var idenTestata=array_iden_testata[x];
		var tipoRicetta=array_tipo_ricetta[x];
		
		if (tipoRicetta == 'B' || tipoRicetta == 'Q'){
			idenRicette.push(idenTestata);
			arrayTipoRicettaStampa.push(tipoRicetta);
		}
	}
	
	if (idenRicette.length == 0){
		alert('Attenzione! Nessuna delle ricette selezionate è stampabile come ricetta bianca o è stata cancellata');
		return;
	}
	if (idenRicette.length != vettore_indici_sel.length){
		alert('Attenzione! Alcune delle ricette selezionate non sono stampabili come ricetta bianca o sono state cancellate');
		return;
	}
	
	dwr.engine.setAsync(false);
	dwrUtility.executeStatement("rr_statement.xml", "stampaRicetta", [idenRicette.join(",")], 1, function(resp) {
		if(resp[0]=='OK') {
			if (/^OK/i.test(resp[2]) == false) {
				return alert(resp[2]);
			}
			try {
				NS_STAMPA_RICETTE.configuraStampa(idenRicette,arrayTipoRicettaStampa);
			} catch (e) {
				alert(e.message);
			}
		} else{
			alert(resp[1]);
		}
	});
	dwr.engine.setAsync(true);
	
	//Chiusura Worklist
	//chiudi();
}

/**
 * Stampa le ricette dematerializzate.
 */
function Ricetta_Dema() {
	// Se nella worklist è presente soltanto una riga, la seleziona
	if ($('table#oTable tr').length == 1) {
		illumina(0);
	}
	else if (vettore_indici_sel.toString() == '') {
		var ricette = parent.$('#RICETTE_CREATE').val();
		if ($('table#oTable tr').length > 0 && typeof ricette === 'string') {
			for (var i=0, length=$('table#oTable tr').length; i<length; i++) {
				if (ricette.indexOf(array_iden_testata[i].toString()) > -1) {
					illumina_multiplo_generica(i, array_iden_testata);
				}
			}
		}
		else {
			alert('Attenzione! Selezionare una riga');
			return;
		}
	}
	
	var idenRicette = [];
	var arrayTipoRicettaStampa=[];
	for(var i=0;i<vettore_indici_sel.length;i++){
		var x = vettore_indici_sel[i];
		var idenTestata=array_iden_testata[x];
		var tipoRicetta=array_tipo_ricetta[x];
		var dematerializzata = array_dematerializzata[x];
		
		if (dematerializzata=='S') {
			idenRicette.push(idenTestata);
			arrayTipoRicettaStampa.push(tipoRicetta+'D');
		}
	}
	
	if (idenRicette.length == 0){
		alert('Attenzione! Nessuna delle ricette selezionate è stampabile come dematerializzata');
		return;
	}
	if (idenRicette.length != vettore_indici_sel.length){
		alert('Attenzione! Alcune delle ricette selezionate non sono stampabili come dematerializzata');
		return;
	}
	
	dwr.engine.setAsync(false);
	dwrUtility.executeStatement("rr_statement.xml", "stampaRicetta", [idenRicette.join(",")], 1, function(resp) {
		if(resp[0]=='OK') {
			if (/^OK/i.test(resp[2]) == false) {
				return alert(resp[2]);
			}
			try {
				NS_STAMPA_RICETTE.configuraStampa(idenRicette,arrayTipoRicettaStampa);
			} catch (e) {
				alert(e.message);
			}
		} else{
			alert(resp[1]);
		}
	});
	dwr.engine.setAsync(true);
	
	//Chiusura Worklist
	//chiudi();
}

/**
 * Conferma e stampa tutte le ricette presenti nella worklist.
 *
 * @param opzioni
 */
function Ricetta_Conferma_Stampa_Tutte(opzioni){
	opzioni = typeof opzioni === 'object' ? opzioni : {};
	opzioni.stampa = typeof opzioni.stampa === 'boolean' ? opzioni.stampa : true;
	
	// Se nella worklist è presente soltanto una riga, la seleziona
	if ($('table#oTable tr').length == 1) {
		illumina(0);
	}
	else if (vettore_indici_sel.toString() == '') {
		var ricette = parent.$('#RICETTE_CREATE').val();
		if ($('table#oTable tr').length > 0 && typeof ricette === 'string') {
			for (var i=0, length=$('table#oTable tr').length; i<length; i++) {
				if (ricette.indexOf(array_iden_testata[i].toString()) > -1) {
					illumina_multiplo_generica(i, array_iden_testata);
				}
			}
		}
		else {
			alert('Attenzione! Selezionare una riga');
			return;
		}
	}
	
	var idenRicetteDaConfermare = [];
	var idenRicetteDaStampare = [];
	var arrayTipoRicettaStampa=[];
	for(var i=0;i<vettore_indici_sel.length;i++){
		var x = vettore_indici_sel[i];
		var idenTestata=array_iden_testata[x];
		var tipoRicetta=array_tipo_ricetta[x];
		var dematerializzata = array_dematerializzata[x];
		var confermabile=array_confermabile[x];
		
		if (confermabile=='S'){
			idenRicetteDaConfermare.push(idenTestata);
		}
		
		idenRicetteDaStampare.push(idenTestata);
		arrayTipoRicettaStampa.push(tipoRicetta+(dematerializzata=='S' ? 'D' : ''));
	}
	
	dwr.engine.setAsync(false);
	dwrUtility.executeStatement("rr_statement.xml", "confermaRicetta", [idenRicetteDaConfermare.join(","), idenRicetteDaStampare.join(","), 'C', (opzioni.stampa ? 'S' : 'N')], 1, function(resp) {
		if(resp[0]=='OK') {
			if (/^OK/i.test(resp[2]) == false) {
				return alert(resp[2]);
			}
			if (opzioni.stampa){
				try {
					NS_STAMPA_RICETTE.configuraStampa(idenRicetteDaStampare,arrayTipoRicettaStampa);
				} catch (e) {
					alert(e.message);
				}
			} else {
				parent.Ricerca();
			}
		} else{
			alert(resp[1]);
		}
	});
	dwr.engine.setAsync(true);
	
	//Chiusura Worklist
	//chiudi();
}

function visualizzaInfo() {
	var rigaSelezionataDalContextMenu = setRiga();
	
	if (rigaSelezionataDalContextMenu > -1){
		try {
			MsgBox("Riepilogo invio", $($.parseXML(array_xml_risposta[rigaSelezionataDalContextMenu])));
		} catch(e) {
			MsgBox("Errore", "Impossibile recuperare il messaggio di risposta, si prega di contattare l'assistenza ("+e.message+").");
		}
	}
	
	function MsgBox(title, message) {
		var vObj = $('<table width="100%" cellpadding="3px" cellspacing="3px"/>');//.css("font-size","12px")
		
		if (typeof message === 'string') {
			vObj = vObj.append($('<tr/>').append($('<td/>').text(message)));
		} else if (typeof message === 'object') {
			var i=0;
			message.find('elencoErrori errore').each(function(){
				var codice = $(this).find('codEsito').text();
				var descrizione = $(this).find('esito').text();
				var tipo = $(this).find('tipoErrore').text();
				
				vObj = vObj.append($('<tr/>')
					.append($('<th/>').text(tipo))
					.append($('<td style="text-align:justify"/>').text(descrizione+' [Cod. '+codice+']'))
				);
				i++;
			});
			if (i==0) {
				throw new Error("Il file xml non contiene errori");
			}
		}

		var paramObj = {
			"obj"   : vObj,
			"title" : title,
			"width" : 400
		};
		PopupInfo.append(paramObj);
	}
}

var PopupInfo ={
		append:function(pParam){
			PopupInfo.remove();
			
			pParam.header = (typeof pParam.header != 'undefined' 	? pParam.header : null);
			pParam.footer = (typeof pParam.footer != 'undefined' 	? pParam.footer : null);
			pParam.title = 	(typeof pParam.title != 'undefined' 	? pParam.title 	: null);
			pParam.width = 	(typeof pParam.width != 'undefined' 	? pParam.width 	: null);
			pParam.height = (typeof pParam.height != 'undefined' 	? pParam.height : null);				
			$("body").append(
				$("<div id='divPopupInfo'/>")
					.css("font-size","12px")
					.append(pParam.header)
					.append(pParam.obj)
					.append(pParam.footer)
					.attr("title",pParam.title)
			);
			
			$("#divPopupInfo").dialog({
				position:	[event.clientX,event.clientY],
				width:		pParam.width,
				height:		pParam.height
			});
	
			PopupInfo.setRemoveEvents();
		},
	
	remove:function(){
		$('#divPopupInfo').remove();
	},
	
	setRemoveEvents:function(){
		$("#divPopupInfo").live("click", PopupInfo.remove);
	}
};

function setRiga(obj){
	if(typeof obj =='undefined') obj = event.srcElement;

	while(obj.nodeName.toUpperCase() != 'TR'){
		obj = obj.parentNode;
	}
	return obj.sectionRowIndex;
}

/**
 * Chiude la worklist.
 */
function chiudi(){
	if(top.name != 'schedaRicovero'){
		try{
		parent.self.close();
		}
		catch(e){
			self.close();
		}
	}else{
//		alert('Dentro Cartella');
		//self.close();
//		parent.location.replace("blank.htm");
	}
}

//@deprecata
function Ricetta_ConfStampa(){	
	var controllo="";
	var splitIndice=vettore_indici_sel.toString().split(',');
	//alert('splitIndice: '+splitIndice);
	if (splitIndice==""){
		alert("Attenzione! Selezionare le ricette da confermare e stampare");
		return;
	}
	for(var i=0;i<splitIndice.length;i++){
		
		var x = splitIndice[i];
		var idenProgressivo=array_progressivo[x];
		var idenTestata=array_iden_testata[x];
		var tipoRicetta=array_tipo_ricetta[x];
		var statoRicetta=array_stato[x];
		controllo="";
		
		//if (statoRicetta!="D"){
		if (statoRicetta=="I" || statoRicetta=="C"){
			//Aggiornamento record Stato & Stampato
			if (tipoUtente=='I'){
				sqlconfstampa = " STAMPATO  = 'S' ";
			}else{
				sqlconfstampa = " STATO  = 'C', STAMPATO  = 'S' ";
			}
			
			set_Ricette(idenProgressivo, sqlconfstampa, 'S');
			//Anteprima di Stampa
		
			Init_stampaRicetta(tipoRicetta,statoRicetta,idenTestata);	
		}	
		else {
			controllo += 'KO';
		}
	}
	if (controllo!=""){
		if(controllo.length>2){
			alert('Attenzione! Alcune delle ricette selezionate non sono state stampate perchè cancellate o già inviate');
		}else{
			alert('Attenzione! Una delle ricette selezionate non è stata stampata perchè cancellata o già inviata');
		}
	}
	else{
		chiudi();
	}
}

//@deprecata
function set_Ricette(Progressivo, sqlfield, ricarica){
	
	if (Progressivo!=null){
		var sql="update VIEW_RR_TESTATA set "+sqlfield+" where PROGRESSIVO="+Progressivo;
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(sql, callBack);	
		dwr.engine.setAsync(true);	
	}
	
	function callBack(resp){
		//alert('resp della callback: '+resp);
	}
	
	if (typeof ricarica != 'undefined' && ricarica == 'S'){
		parent.applica_filtro();
	}
}

//@deprecata
function setSingolaRicetta(idenTestata, sqlField, ricarica){
	if (idenTestata!=null){
		var sql="update view_rr_testata set "+ sqlField +" where iden="+idenTestata;
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(sql, callBack);	
		dwr.engine.setAsync(true);
	}
	
	function callBack(resp){
		//alert('resp della callback: '+resp);
	}
	
	if (typeof ricarica != 'undefined' && ricarica == 'S'){
		parent.applica_filtro();
	}
}

//@deprecata
function Init_stampaRicetta(tipoRicetta,statoRicetta,idenTestata){	

	//var splitIndice=vettore_indici_sel.toString().split(",");
	var reparto		= baseGlobal.SITO; 									//CONFIGURA_SATMPE.CDC
	var funzione	= 'RICETTA_ROSSA_PRESTAZIONI';				//CONFIGURA_STAMPE.FUNZIONE_CHIAMANTE 
	var anteprima	= 'N';
	var stampante 	= "";
	var sf			= "";
	
	if (tipoRicetta==null) {return;}
	
	/*for(var i=0;i<splitIndice.length;i++){
		
		var x = splitIndice[i];
		var idenTestata=array_iden_testata[x];
		var tipoRicetta=array_tipo_ricetta[x];
		var statoRicetta=array_stato[x];*/

		if (tipoRicetta=='P'){
			
			funzione="RICETTA_ROSSA_PRESTAZIONI";
			sf = '&prompt<pIdenTestata>='+idenTestata;
			
			/*imposto la stampante dedicata e se non c'é ne imposto la visualizzazione dell'anteprima*/
			stampante = basePC.PRINTERNAME_RICETTA_ROSSA;
			StampaRicetta(funzione,sf,anteprima,reparto,stampante);
			
		}else if (tipoRicetta== "F"){ 
			
			funzione="RICETTA_ROSSA_FARMACI";
			sf = '&prompt<pIdenTestata>='+idenTestata;
			
			/*imposto la stampante dedicata e se non c'é ne imposto la visualizzazione dell'anteprima*/
			stampante = basePC.PRINTERNAME_RICETTA_ROSSA;
			StampaRicetta(funzione,sf,anteprima,reparto,stampante);
		
		}else{ 
			
			funzione="RICETTA_BIANCA";
			sf = '&prompt<pIdenTestata>='+idenTestata;
			
			/*imposto la stampante dedicata e se non c'é ne imposto la visualizzazione dell'anteprima*/
			stampante = basePC.PRINTERNAME_REF_CLIENT;		
			StampaRicetta(funzione,sf,anteprima,reparto,stampante);
		}
	//}
}

//@deprecata
function StampaRicetta(funzione,sf,anteprima,reparto,stampante){	
	if (basePC.USO_APPLET_STAMPA=='S' && (funzione =="RICETTA_ROSSA_PRESTAZIONI" || funzione =="RICETTA_ROSSA_FARMACI" )){
		var wnd;
		var opzioniStampa;
		if (top.name == 'schedaRicovero'){
			wnd = top;
			opzioniStampa = wnd.opener.NS_PRINT.ricette.getConfigurazione();
		}else{
			wnd = top.opener.top;
			opzioniStampa = wnd.NS_PRINT.getOption();
		}
		//var wnd = top.opener.top;
		var url = getAbsolutePath()+'ServletStampe?';
		url += 'report='+ wnd.NS_PRINT.confStampe[funzione];
		url += sf;
		
		var ritorno = wnd.NS_PRINT.print({
			url:url,
			stampante:stampante,
			opzioni:opzioniStampa
			
		});
		
		if (ritorno && top.name == 'schedaRicovero'){
			wnd.visualizzaWorklistRicette();
		}
		
		if (!ritorno){
			return ('Contattare Assistenza. Riscontrato problema con applet di stampa');
		}
	
	}else{
		if(baseUser.LOGIN=='ricettarossa'){
			anteprima = 'S';
			//alert('anteprima: '+anteprima+'\nfunzione: '+funzione+'\nsf:'+sf+'\nreparto: '+reparto+'\nstampante: '+stampante);
		}
		if(stampante == '' || stampante == null)
			anteprima = 'S';
		
		var url =	'elabStampa?stampaFunzioneStampa='+funzione;
		url += 		'&stampaAnteprima='+anteprima;
	
		if(reparto!=null && reparto!='')
			url += '&stampaReparto='+reparto;	
		if(sf!=null && sf!='')
			url += '&stampaSelection='+sf;	
		if(stampante!=null && stampante!='')
			url += '&stampaStampante='+stampante;	
		//alert(url);
		var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
			
		if(finestra){ 
			finestra.focus(); 
		}else{ 
			finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		}
	}
	/*try{
		top.opener.parent.idRicPazRicercaFrame.closeWhale.pushFinestraInArray(finestra);
	   	}catch(e){alert(e.description);}*/
}

//@deprecata
function getAbsolutePath()
{
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}