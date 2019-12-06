var prenota_auto = false; 
var consulta     = false; 
var timer_sel    = null;
var forzatura    = 'N'; 
var oforzatura   = 'N';
var numero_esami = 0;
var indice_esame = '';
var apri_scheda  = ''; 



Array.prototype.indexOf = function(elt /*, from*/)
{
	var len = this.length;
	
	var from = Number(arguments[1]) || 0;
	from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	if(from < 0)
		from += len;
	
	for(; from < len; from++)
	{
		if (from in this && this[from] === elt)
			return from;
	}
	
	return -1;
};


// modifica 18-4-16
$(function(){
	try{
		var targetCdc = "";			
		var objCaller =  window.parent.parent.objCaller;
		var caller;
		try{caller = objCaller.caller;}catch(e){caller="";}
		if ((caller=="undefined")||(typeof(caller)=="undefined")){
			caller = "";
		}		
		if (caller!=""){
			// il target CDC da dove lo prendo ?!?!?!
			// da frameDettaglio
//			alert(window.parent.frameDettaglio.document.getElementById("oTable").innerHTML);
			var listaParametri =objCaller.url.split("?")[1].split("&");
			for (var z=0;z<listaParametri.length;z++){
				if (listaParametri[z].substr(0, 4).toUpperCase()=="HCDC"){
					targetCdc = listaParametri[z].split("=")[1].split("@")[0];
					break;
				}
			}
			hidePrenotaConForzatura();
			// verifico se nascondere anche "aggiungi orario"
			var listaCdcUtente = baseUser.LISTAREPARTI;
			var bolFound = false;
			for (var z=0;z<listaCdcUtente.length;z++){
				if (targetCdc==listaCdcUtente[z]){
					bolFound = true;
					break;
				}
				if (bolFound){break;}
			}
			// se non faccio autoprenotazione
			// nascondo inserisci orario !
			if (!bolFound){
				hideInserisciOrario();				
			}
		}
	}
	catch(e){
		alert("Orario ready - " + e.description);
	}
});		
// *********************


// modifica 27-10-16
function aggiorna(idenImpSale)
{
	try{
		// modifica 19-4-16
		// valutare se farlo solo per la cancellazione
		try{
			var id_imp = document.dettaglio.id_imp.value;
			if (typeof(idenImpSale)!="undefined"){
				toolKitDB.executeQueryData('{call SP_CALCOLAMINUTILIBERIAGENDA(' + parseInt(idenImpSale) + ')}');						
			}else{
				// caso classico
	//			alert("call SP_CALCOLAMINUTILIBERIAGENDA " +id_imp );
				// attenzione : viene presupposto che vi sia una sola agenda!!
				// diversamente ricalcola solo la prima
				toolKitDB.executeQueryData('{call SP_CALCOLAMINUTILIBERIAGENDA(' + parseInt(id_imp) + ')}');		
			}
			
		}catch(e){
			alert("Error on SP_CALCOLAMINUTILIBERIAGENDA " + e.description);
		}
		// ************************
		
		
		if (typeof document.dettaglio.cmbArea != 'undefined') {
			document.dettaglio.id_area.value = document.dettaglio.cmbArea.value;//options[document.dettaglio.cmbArea.selectedIndex].value;
			document.dettaglio.idx_dett.value = document.dettaglio.cmbArea.selectedIndex;
		}
		document.dettaglio.method = 'get';
		document.dettaglio.href = 'prenotazioneDettaglio';
		document.dettaglio.submit();
	}
	catch(e){
		alert("aggiorna - Error: "+ e.description);
	}
}
// ****************

// Serve x il flag dei liberi...
function swap_img_flag()
{
	if(document.dettaglio.HCheck.value=="S")
	{
		document.dettaglio.HCheck.value="N";
		document.dettaglio.img_flag.src = "imagexPix/schedaAnag/nospuntaradio.gif";
	}
	else
	{
		document.dettaglio.HCheck.value="S";
		document.dettaglio.img_flag.src = "imagexPix/schedaAnag/spuntaradio2.gif";
	}
	
	aggiorna();
}

// Richiama il dwr x occupare o liberare i posti...
function occupa(idx, conf)
{
	// Nuova parte!!
	var sTmp;
	var aTmp;
	
	if(typeof conf == 'undefined' || conf == null)
	{
		conf = 'N';
	}
	
	if(vettore_indici_sel.length == 0)
	{
		return;
	}
	
	var cod = '' + a_iden_dettaglio[idx];  // Funzionante!
	var esa = '';
	var parametro = '';
	
	if(consulta)
	{
		esa = '0';
	}
	else
	{
		// 10/05/2007 Commento... nuova parte!!!!
		//esa = parent.frameElenco.stringa_codici(parent.frameElenco.a_id_esa);
		try{sTmp = parent.frameElenco.getStringEsa('S');}
		catch(e){sTmp = parent.parent.frameElenco.getStringEsa('S');}
		aTmp = sTmp.split('*');
		
		document.dettaglio.id_esame.value = aTmp[0];
		document.dettaglio.idx_esame.value = aTmp[1];
		
		esa = document.dettaglio.id_esame.value;
	}
	
	cod = cod.replace(/\*/g, ",");
	esa = esa.replace(/\*/g, ",");
	// per DEMA
	// modifica 19-7-16
	esa = esa.replace(".0", "");
	// *************
	parametro = cod + '*' + esa + '*' + conf + '*' + forzatura;
//		alert("occupa_posto "+ parametro + "!");
	prenDWRClient.occupa_posto(parametro, messaggio);
}

function messaggio(msg)
{
	var aDati;
	
	document.dettaglio.id_dett.value = '';
	
	if(msg.substr(1, 5).toUpperCase() == 'ERROR')
	{
		alert(msg);
	}
	else
	{
		aDati = msg.split("*");
		if(aDati[0].toUpperCase() == 'ERROR')
		{
			alert(aDati[1]);
		}
		else
		{
			if(aDati[1] == '')
			{
				alert('Errore ricezione dati!!!');
			}
			else
			{
				document.dettaglio.id_dett.value = aDati[1].replace(/\,/g, "*");
				
				if(prenota_auto)
				{
					if(consulta)
					{
						prenota_consulta();
					}
					else
					{
						prenota();
					}
				}
			}
		}
	}
	//alert('DWR: ' + document.dettaglio.id_dett.value + '\n' + msg);
}

// Aggiungo l'esame nel riepilogo...
function prenotaOLD()
{
	var idx = '-1';
	var forza = stringa_codici(a_forzatura);
	var cod = stringa_codici(a_iden_esame);
	var id_dett = document.dettaglio.id_dett.value; //stringa_codici(a_iden_dettaglio);
	
	if(check_data())
	{
		if((cod == '-1' || cod == '') && forza == 'S')
		{
			forzatura = 'S';
		}
		
		if(id_dett == '')
		{
			id_dett = 'x';
			//document.dettaglio.id_dett.value = 'x';
			prenota_auto = true;
			occupa(vettore_indici_sel[0], 'S');
			return;
		}
		else
		{
			if(id_dett == 'x')
			{
				id_dett = '';
				prenota_auto = false;
				alert('Selezionare Orario!');
				return;
			}
			else
			{
				//occupa(vettore_indici_sel[0], 'S');
			}
		}
		// modifica 4-4-16
		if(id_dett != -1 && id_dett != null && (((cod == -1 || cod == '') && cod != null && forzatura != 'S') || (forzatura == 'S' || forzatura == 'SE'))){

			idx = document.dettaglio.idx_esame.value; //parent.frameElenco.document.elenco.indice.value;
			// 10/05/2007
			//parent.frameElenco.rimuovi_esame(idx);
			
			// 10/05/2007
			//parent.frameElenco.checkBlank();
			document.dettaglio.indici.value = idx;
			if (typeof document.dettaglio.cmbArea != 'undefined')
				document.dettaglio.id_area.value = document.dettaglio.cmbArea.options[document.dettaglio.cmbArea.selectedIndex].value;
			
			// 10/05/2007
			//parent.frameRiepilogo.document.location.replace('prenotazioneRiepilogo?id_area=' + document.dettaglio.id_area.value + '&id_dett=' + id_dett + '&indice=' + idx);
			apri_scelta_esami();
		}
		else
		{
			alert('Selezionare solo posti liberi!!!!');
		}			
	}
}


// Aggiungo l'esame nel riepilogo...
function prenota()
{
	var idx = '-1';
	var forza = stringa_codici(a_forzatura);
	var cod = stringa_codici(a_iden_esame);
	var id_dett = document.dettaglio.id_dett.value; //stringa_codici(a_iden_dettaglio);
	
	if(check_data())
	{
		if((cod == '-1' || cod == '') && forza == 'S')
		{
			forzatura = 'S';
		}
		// **********************
		// modifica 4-4-16
		if ((cod != -1 && cod != '') && (forzatura.substr(0, 1)!="S")) {
			alert('Attenzione: prego selezionare solo posti liberi.');
			return;
		}		
		// **********
		
		if(id_dett == '')
		{
			id_dett = 'x';
			//document.dettaglio.id_dett.value = 'x';
			prenota_auto = true;
			occupa(vettore_indici_sel[0], 'S');
			return;
		}
		else
		{
			if(id_dett == 'x')
			{
				id_dett = '';
				prenota_auto = false;
				alert('Selezionare Orario!');
				return;
			}
			else
			{
				//occupa(vettore_indici_sel[0], 'S');
			}
		}
		idx = document.dettaglio.idx_esame.value; //parent.frameElenco.document.elenco.indice.value;
		// 10/05/2007
		//parent.frameElenco.rimuovi_esame(idx);
		
		// 10/05/2007
		//parent.frameElenco.checkBlank();
		document.dettaglio.indici.value = idx;
		if (typeof document.dettaglio.cmbArea != 'undefined')
			document.dettaglio.id_area.value = document.dettaglio.cmbArea.options[document.dettaglio.cmbArea.selectedIndex].value;
		
		// 10/05/2007
		//parent.frameRiepilogo.document.location.replace('prenotazioneRiepilogo?id_area=' + document.dettaglio.id_area.value + '&id_dett=' + id_dett + '&indice=' + idx);
		apri_scelta_esami();
	}
}


function prenota_forzata(tipo)
{
	var id = stringa_codici(a_iden_esame);
	
	if(check_data())
	{
		forzatura = typeof tipo != 'undefined' ? tipo:'S';
		prenota();
	}
}

function apri_scelta_esami(ok)
{
	var sTmp;
	var aTmp;
	var oldClick = document.dettaglio.js_click.value;
	var wScelta;
	
	try{sTmp = parent.frameElenco.getStringEsa('S');}
	catch(e){sTmp = parent.parent.frameElenco.getStringEsa('S');}
	aTmp = sTmp.split('*');
	
	document.dettaglio.id_esame.value = aTmp[0];
	document.dettaglio.idx_esame.value = aTmp[1];
	
	apri_scheda = 'P';
	
	if(ok == null)
	{
		conta_esami();
	}
	else
	{
		if(numero_esami > 1)
		{
			//if(document.dettaglio.attiva_scelta.value == 'S')
			//{
				wScelta = window.open('', 'wndscelta' , 'status = yes, scrollbars = yes, height = 450, width = 800, top = 150, left = 150');
				if(wScelta)
					wScelta.focus();
				else 
					wScelta = window.open('', 'wndscelta' , 'status = yes, scrollbars = yes, height = 450, width = 800, top = 150, left = 150');
				
				document.dettaglio.js_click.value = 'javascript:registra();';
				
				document.dettaglio.target = 'wndscelta';
				document.dettaglio.action = 'sceltaEsamiPrenotazione'
				document.dettaglio.method = 'get';
				document.dettaglio.submit();
				
				document.dettaglio.js_click.value = oldClick;
				document.dettaglio.target = '_self';
				document.dettaglio.action = ''
			//}
			//else
			//{
			//	inserisci_prenotazione(document.dettaglio.idx_esame.value.replace(/,/g, '*'));
			//}
		}
		else
		{
			if(numero_esami == 1)
			{
				inserisci_prenotazione(indice_esame);
			}
			else
			{
				alert('Errore interno!');
			}
		}
	}
}

function inserisci_prenotazione(idx)
{
	// 10/05/2007
	try{parent.frameElenco.rimuovi_esame(idx, true);}
	catch(e){parent.parent.frameElenco.rimuovi_esame(idx, true);}
}

// 08/11/2007
function inserisci_prenotazione_confirm(idx)
{
	var id_dett = document.dettaglio.id_dett.value;
	var sTmp;
	var aTmp;
	try{
		try{sTmp = parent.frameElenco.getStringEsa('S');}
		catch(e){sTmp = parent.parent.frameElenco.getStringEsa('S');}
		aTmp = sTmp.split('*');

		document.dettaglio.id_esame.value = aTmp[0];
		document.dettaglio.idx_esame.value = aTmp[1];

		try{parent.frameRiepilogo.document.location.replace('prenotazioneRiepilogo?id_area=' + document.dettaglio.id_area.value + '&id_dett=' + id_dett + '&indice=' + idx + '&forzatura=' + forzatura);}
		catch(e){parent.parent.frameRiepilogo.document.location.replace('prenotazioneRiepilogo?id_area=' + document.dettaglio.id_area.value + '&id_dett=' + id_dett + '&indice=' + idx + '&forzatura=' + forzatura);}

		//parent.frameElenco.seleziona_tutto(false, true, true);
		try{parent.frameElenco.seleziona_tutto(true, true, true);}
		catch(e){parent.parent.frameElenco.seleziona_tutto(true, true, true);}
	}catch(e){alert("inserisci_prenotazione_confirm - Error: " + e.description)}
}

// CONSULTAZIONE //
// Funzione per tagliare l'esame da spostare...
function check_cut(msg)
{
	if(msg != null && msg != '')
	{
		alert(msg);
	}
	else
	{
		aggiorna();
	}
}

function check_paste(msg)
{
	try{
		if(msg != null && msg != '')
		{
			alert(msg.replace('ERROR*', ''));
		}
		else
		{
			// ****************************
			// modifica 18-03-2015
			try{
				var sql = "update ESAMI set  UTE_PRE =" + baseUser.IDEN_PER +" where iden = (select iden_esame from dettaglio_imp_sale where iden = " + stringa_codici(a_iden_dettaglio) +")";
				dwr.engine.setAsync(false);
				toolKitDB.executeQueryData(sql, function(message){	
					//alert(message);
				});
				dwr.engine.setAsync(true);
			}
			catch(e){;}
			// ****************************	
			
			// modifica riccio 
			// cambio stato in dett_esami in automatico
			// mettendolo disdetto e riprenotato
			var myLista = new Array();
			// setto stato disdetto e riprenotato
			myLista.push('DP');		
			// stringa_codici(a_iden_dettaglio) contiene l'iden del dettaglio di destinazione
			// che dopo l'incolla dovrebbe contenere l'iden dell'esame
			// select iden_esame from DETTAGLIO_IMP_SALE where iden = xxx
			var idenDett = stringa_codici(a_iden_dettaglio);
			myLista.push(idenDett);
			var stm = top.executeStatement('cambioStato.xml','setStatoAggiuntivoDaConsPren',myLista,0);
			if (stm[0]!="OK"){
				try{
					//alert("Errore: problemi nel salvataggio dello stato. Errore: " + stm[1] + " idDettaglio: " + idenDett);
				}catch(e){alert("Errore: problemi nel salvataggio dello stato!");}
				//return;
			}		
			// ***********************			
		
			/*
			 * frameMain (frameset id)
frameOpzioni
frameCalendario
			 */
			//alert("sono qui...");
			document.dettaglio.id_esame_seleziona.value = '';
			// chiama function che aggiorna se stessa
			//try{parent.parent.frameCalendario.aggiorna();}catch(e){alert("err: "  + e.description);}
			//alert(parent.parent.frameOpzioni.document.getElementById("lblAggiorna").href);
			try{parent.parent.frameOpzioni.aggiorna_apri_dettaglio();}catch(e){alert("err: "  + e.description);}
			// **********
			
			
			return;
			aggiorna();
		}
	}
	catch(e){
		alert("check_paste - Error: "+ e.description);
	}
}

function check_copy(msg)
{
	if(msg != null && msg != '')
	{
		alert(msg);
	}
	else
	{
		aggiorna();
	}
}

function check_delete(msg)
{
	if(msg != null && msg != '')
	{
		alert(msg);
	}
	else
	{
		aggiorna();
	}
}

function check_data()
{
	var data  = new Date();
	var dd    = '00' + data.getDate();
	var mm    = '00' + (data.getMonth() + 1);
	var yyyy  = data.getYear();
	var oggi  = '';
	var stato = stringa_codici(a_flag_stato);
	
	if(stato.indexOf('2') >= 0)
	{
		alert('Attenzione! Sono presenti degli slot sospesi, impossibile prenotare!');
		return false;
	}
	
	dd = dd.substr(dd.length-2, dd.length);
	mm = mm.substr(mm.length-2, mm.length);
	
	oggi = yyyy + mm + dd;
	
	if(parseInt(document.dettaglio.Hdata.value, 10) >= parseInt(oggi, 10))
	{
		return true;
	}
	else
	{
		alert('Impossibile prenotare, \nla data deve essere uguale o superiore a oggi!');
		return false;
	}
}

/*function conta_esami(ok)
{
	
	prenDWRClient.copia(cod + '*' + id, check_conta_esami);
}*/

function check_copia_taglia(msg)
{
	var stato = stringa_codici(a_accettato);
	if(stato == '1')
	{
		alert("Attenzione! Esame gia' accettato! Impossibile effetuare " + msg + "!");
		return false;
	}
	else
	{
		return true;
	}
}

function copia()
{
	var cod;
	var id;
	
	id = stringa_codici(a_iden_esame);
	
	
	// modifica 31-8-16
	if (checkEsamiDematerializzati(stringa_codici(a_iden_esame))){
		alert("Impossibile proseguire: \u00E8 stata selezionata almeno una prestazione dematerializzata");
		return false;
	}
	// *************

	if(isLockPage('PRENOTAZIONE_COPIA', id, 'ESAMI'))
	{
//		alert('Attenzione! Paziente di sola lettura!');
		alert("Attenzione! Impossibile proseguire, paziente di sola lettura!\nPer renderlo utilizzabile aprire una segnalazione alla assistenza tecnica\ncomunicando le informazioni anagrafiche corrette.");		
	}
	else
	{
		if(check_copia_taglia('la copia'))
		{
			cod = stringa_codici(a_iden_dettaglio);
			
			if(id != '' && id != '-1')
			{
				prenDWRClient.copia(cod + '*' + id, check_copy);
			}
		}
	}
}

function taglia()
{
	var cod;
	var id;
	
	id = stringa_codici(a_iden_esame);
	
	// modifica 31-8-16
	/*if (checkEsamiDematerializzati(stringa_codici(a_iden_esame))){
		alert("Impossibile proseguire: \u00E8 stata selezionata almeno una prestazione dematerializzata");
		return false;
	}*/
	// *************
	
	if(isLockPage('PRENOTAZIONE_TAGLIA', id, 'ESAMI'))
	{
		alert('Attenzione! Paziente di sola lettura!');
	}
	else
	{
		if(check_copia_taglia('il taglia'))
		{
			cod = stringa_codici(a_iden_dettaglio);
			
			if(id != '' && id != '-1')
			{
				prenDWRClient.taglia(cod + '*' + id, check_cut);
			}
		}
	}
}

function incolla()
{
	try{
	var cod   = stringa_codici(a_iden_dettaglio);
	var stato = stringa_codici(a_flag_stato);
	
	
	if(stato.indexOf('2') >= 0)
		alert('Impossibile incollare! Slot sospeso!');
	else
		//alert(cod); 
		prenDWRClient.incolla(cod, check_paste);
	}
	catch(e){
		alert("incolla - errore: " + e.description);
	}
}

// ************** lasciare , può tornare utile
// per capire se arrivo da consulta prenotazione 
// (il dettaglio è posto in un iframe) o meno 
/*
var bolArrivoDaConsultaCalendario = false;
window.onload = function(){
	if(parent.document.calendario){
		bolArrivoDaConsultaCalendario = true;
	}
	else{
		bolArrivoDaConsultaCalendario = false
	} 
}*/

function seleziona(idx)
{
	
	
	initbaseUser();
	
	try
	{
		seleziona_taglia(idx);
		seleziona_occupati(idx);
	}
	catch(ex)
	{
	}
}

function seleziona_taglia(idx)
{
	var id = document.dettaglio.id_esame_seleziona.value;
	var a_id = id.split('*');
	
	if(id != '' && id != null)
	{
		if(typeof idx != 'undefined')
		{
			//if(id == a_iden_esame[idx] && document.all.oTable.rows(idx).style.backgroundColor != sel && document.all.oTable.rows(idx).style.backgroundColor.toUpperCase() != col_over)
			if(a_id.indexOf(a_iden_esame[idx]) >= 0 && document.all.oTable.rows(idx).style.backgroundColor != sel && document.all.oTable.rows(idx).style.backgroundColor.toUpperCase() != col_over)
			{
				document.all.oTable.rows(idx).style.backgroundColor = '#00FF00';
				for(c = 0; c < document.all.oTable.rows(i).cells.length; c++)
				{
					document.all.oTable.rows(idx).cells(c).style.backgroundColor = '#00FF00';
				}
			}
		}
		else
		{
			for(i=0; i<a_iden_esame.length; i++)
			{
				//if(id == a_iden_esame[i] && document.all.oTable.rows(i).style.backgroundColor != sel && document.all.oTable.rows(i).style.backgroundColor.toUpperCase() != col_over)
				if(a_id.indexOf(a_iden_esame[i]) >= 0 && document.all.oTable.rows(i).style.backgroundColor != sel && document.all.oTable.rows(i).style.backgroundColor.toUpperCase() != col_over)
				{
					document.all.oTable.rows(i).style.backgroundColor = '#00FF00';
					for(c = 0; c < document.all.oTable.rows(i).cells.length; c++)
					{
						document.all.oTable.rows(i).cells(c).style.backgroundColor = '#00FF00';
					}
				}
			}
		}
	}
}

function seleziona_occupati(idx)
{
	var i;
	
	for(i=0; i<a_iden_esa.length; i++)
	{
		if(a_iden_esa[i] > 0 && a_iden_esame[i] == -1 && document.all.oTable.rows(i).style.backgroundColor != sel && document.all.oTable.rows(i).style.backgroundColor.toUpperCase() != col_over)
		{
			document.all.oTable.rows(i).style.backgroundColor = '#CCCCCC';
			
			for(c = 0; c < document.all.oTable.rows(i).cells.length; c++)
			{
				document.all.oTable.rows(i).cells(c).style.backgroundColor = '#CCCCCC';
			}
		}
		else
		{
			//clear_seleziona(i);
		}
	}
	
	for(i=0; i<a_ip.length && i<document.all.oTable.rows.length; i++)
	{
		if(a_ip[i] != '' && a_ip[i] != ip_locale && a_iden_esame[i] == -1 && document.all.oTable.rows(i).style.backgroundColor != sel && document.all.oTable.rows(i).style.backgroundColor.toUpperCase() != col_over)
		{
			document.all.oTable.rows(i).style.backgroundColor = '#CCCCCC';
			
			for(c = 0; c < document.all.oTable.rows(i).cells.length; c++)
			{
				document.all.oTable.rows(i).cells(c).style.backgroundColor = '#CCCCCC';
			}
		}
		else
		{
			clear_seleziona(i); // Ok!
			seleziona_taglia(i);
		}
	}
	
	if(idx != null)
	{
		if(a_iden_esa[i] > 0 && a_iden_esame[i] == -1 && document.all.oTable.rows(idx).style.backgroundColor != sel && document.all.oTable.rows(idx).style.backgroundColor.toUpperCase() != col_over)
		{
			document.all.oTable.rows(idx).style.backgroundColor = '#CCCCCC';
			
			for(c = 0; c < document.all.oTable.rows(idx).cells.length; c++)
			{
				document.all.oTable.rows(idx).cells(c).style.backgroundColor = '#CCCCCC';
			}
		}
	}
	else
	{
		for(i=0; i<a_iden_esa.length; i++)
		{
			if(a_iden_esa[i] > 0 && a_iden_esame[i] == -1 && document.all.oTable.rows(i).style.backgroundColor != sel && document.all.oTable.rows(i).style.backgroundColor.toUpperCase() != col_over)
			{
				document.all.oTable.rows(i).style.backgroundColor = '#CCCCCC';
				
				for(c = 0; c < document.all.oTable.rows(i).cells.length; c++)
				{
					document.all.oTable.rows(i).cells(c).style.backgroundColor = '#CCCCCC';
				}
			}
			else
			{
				//clear_seleziona(i);
			}
		}
	}
}

function seleziona_intervallo()
{
	var id_dett = a_iden_dettaglio[0];
	var check_free = document.dettaglio.HCheck.value;
	
	if(check_free == '')
	{
		check_free = 'N';
	}
	
	prenDWRClient.refresh_occupati(id_dett + '*' + check_free, check_sel);
}

function check_sel(ret)
{
	var aIP;
	var i;
	
	if(ret.substr(1, 5).toUpperCase() == 'ERROR')
	{
		alert(ret);
	}
	else
	{
		aIP = ret.split(",");
		a_ip = new Array(aIP.length);
		for(i=0; i<aIP.length; i++)
		{
			a_ip[i] = aIP[i];
		}
		seleziona();
	}
}

function abilita_seleziona_intervallo()
{
    try {
        // modifica per ampliare il frame 
        // del dettaglio e allargare il riepilogo
        // il default (da java è 36, 61, 80, 120, 100)
        // **********************************************		
        try {
            parent.document.getElementById('frameMain').rows = "36, 61, 80, 200, 80";
        } catch (e) {
            ;
        }
        // **********************************************
        // **********************************************

        if (typeof a_iden_dettaglio != 'undefined')
            if (a_iden_dettaglio[0] != null)
            {
                //timer_sel = setInterval('seleziona_intervallo()', 1500);
            }

       
    }
    catch (e) {
        alert("abilita_seleziona_intervallo " + e.description);
    }
}

function disabilita_seleziona_intervallo()
{
	clearInterval(timer_sel);
}

function clear_seleziona(idx)
{
	var i;
	
	if(idx != null)
	{
		if(document.all.oTable.rows(idx).style.backgroundColor.toUpperCase() != col_over)
		{
			rowSelect_out(idx);
		}
	}
	else
	{
		for(i=0; i<document.all.oTable.rows.length; i++)
		{
			if(document.all.oTable.rows(i).style.backgroundColor.toUpperCase() != col_over)
			{
				rowSelect_out(i);
			}
		}
	}
}

function cancella()
{
	var esa       = stringa_codici(a_iden_esame);
	var stato     = stringa_codici(a_eseguito);
	var permit    = document.frmCancEsa.permissione.value.substring(9,10);
	var w_ins_pwd = null;
	
	initbaseGlobal();
	
	if(permit == 0)
	{
		alert('L\'utente non &egrave; abilitato alla cancellazione di esami!');
	}
	else
	{
		if(isLockPage('PRENOTAZIONE_CANCELLA', esa, 'ESAMI'))
		{
			alert('Attenzione! Paziente di sola lettura!');
		}
		else
		{
			if(stato == '1')
			{
				alert('Impossibile cancellare, esame gi&agrave; eseguito!');
			}
			else
			{
				try
				{
					esa = esa.replace(/\*/g, ",");
				}
				catch(ex)
				{
				}
				
				if(esa != '' && esa != '-1')
				{
					if(confirm('Sei sicuro di voler cancellare la prenotazione?'))
					{
						//document.frmCancEsa.idenEsame.value = esa;
						document.frmCancEsa.idenEsame.value = '';
						//prenDWRClient.cancella(esa, check_delete);
						if(baseGlobal.OB_PWD_CANC == 'S')
						{
							w_insPwd = window.open('SL_InsPwdCancellazione?provenienza=ESAMI','', 'height=250,width=400,scrollbars=no,top=200,left=300');
						}
						else
						{
							cancellazioneEsami(true);
						}
					}
				}
			}
		}
	}
}

function cancellazioneEsami(canc_esa)
{
	var w_motivo = null;
	
	if(canc_esa)
	{
		document.frmCancEsa.action = 'SL_CancellazioneEsami';
		document.frmCancEsa.target = 'winInsertMotivazione';
		
		w_motivo = window.open("","winInsertMotivazione","top=200,left=120,width=800,height=223,status=yes,scrollbars=no");
		if(w_motivo)
		{
			w_motivo.focus();
		}
		else
		{
			w_motivo = window.open("","winInsertMotivazione","top=200,left=120,width=800,height=223,status=yes,scrollbars=no");
		}
		
		document.frmCancEsa.submit();
	}
}

function cancellaESAMI()
{
	if(document.form.pwd.value == '')
	{
		alert('Prego, inserire la password.');
		document.form.pwd.focus();
		return;
	}
	var webpassword = document.form.hpwd.value;//web.webpassword
	var pwd_inserita = document.form.pwd.value;
	
	if(webpassword != pwd_inserita)
	{
		alert('Password errata.');
		document.form.pwd.value = '';
		document.form.pwd.focus();
		return;
	}
	else
	{
		opener.cancellazioneEsami(true);
		self.close();
	}
}

function annullaESAMI()
{
	opener.aggiorna();
	self.close();
}

function conta_esami()
{
	var par = '';
	
	par = document.dettaglio.id_esame.value;
	par += '*' + document.dettaglio.idx_esame.value;
	par += '*' + document.dettaglio.id_area.value;
	// modifica 31-8-16
	// mettere magari un messaggio che notifichi all'utente 
	// di selezionare almeno un esame nel frame apposito !
	if ((document.dettaglio.id_esame.value=="") || (document.dettaglio.id_esame.value=="undefined")){
		alert("Attenzione: non \u00E8 stato selezionato alcun esame dalla lista 'Esami da prenotare'.\nPrego selezionare almeno un esame.");
		return;
	}
	// *****************	
	prenDWRClient.conta_esami(par, check_conta_esami);
}

function check_conta_esami(ret)
{
	var aRet = ret.split("*");
	
	indice_esame = aRet[0];
	numero_esami = parseInt(aRet[1]);
	
	if(apri_scheda == 'C')
	{
		apri_scelta_esami_consulta('S');
	}
	else
	{
		apri_scelta_esami('S');
	}
}

function check_anag_prenotabile() {
	
	try{
		
		try{
			var iden_anag = parent.parent.parent.iden_anag;}
		catch(e){
			var iden_anag = parent.parent.parent.parent.iden_anag;}
		
		if (typeof iden_anag != 'undefined' && iden_anag != '' && iden_anag != 0) {
			// aggiunto 20130802
			if (isNaN(iden_anag)){
				// 20140729 e' un CF ?!?!?! provare ricavare il vero ID !!!!
				alert("ATTENZIONE : ID anagrafico non valido. Contattare l'amministratore di sistema! ID: " + iden_anag);
				// 20140729 perchè ritorna true e NON false ?!?!?!?! con true va avanti la prenotazione!!!!
				return true;
			}
			// ****************
			var rs = top.executeStatement('worklist_main.xml','checkAnagPrenotabile',[iden_anag],2);
			if (rs[0] == 'KO') { /* errori database */
				//	mega tappullo
				if (rs[1].toString().indexOf("lettura del file")>-1){
					// sono in whale 
					return true;
				}
				alert('checkAnagPrenotabile - ' + rs[1]);
				alert("ATTENZIONE : ID anagrafico non valido - ID: " + iden_anag);
				return false;
			}
			if (rs[2] == 'KO') { /* errori di flusso/logica */
				if (confirm(rs[3])) {
					//apro scheda anag
					var w = modificaAnagLinkOrario(null, iden_anag);
				}
			}
		}
	} catch (e) {
		alert("Errore: checkAnagPrenotabile");
	}
	return true;
}


function getframeRiepilogo(){
	try{
		var oggetto;
		try{
			var test = parent.frameRiepilogo.location;
			oggetto = parent.frameRiepilogo;
		}
		catch(e){
			oggetto = parent.parent.frameRiepilogo;
		}
	}
	catch (e) {		alert("getframeRiepilogo Errore: "+ e.description);	}
}

function prenota_consulta()
{
	try{
		var cod = stringa_codici(a_iden_esame);
		var id = stringa_codici(a_iden_dettaglio);
		var forza = stringa_codici(a_forzatura);
		var id_dett = document.dettaglio.id_dett.value;

		var id_are = stringa_codici(a_iden_are);


		//parent.parent.parametri[10] = id_dett;
		window.iFrameMain.parametri.ID_DETTAGLIO = id_dett;
//		parent.parent.parametri[11] = document.dettaglio.valore.value;
		window.iFrameMain.parametri.VALORE = document.dettaglio.valore.value;
//		alert(parent.parent.parametri.length);
//		parent.parent.parametri[]	
		if(check_data())
		{
			consulta = true;

			if((cod == '-1' || cod == '') && forza == 'S')
			{
				forzatura = 'S';
			}

			if(document.dettaglio.id_esame.value != '' && document.dettaglio.idx_esame.value != '')
			{
				// alert(parent.top.location.href);  inizioServlet
				// alert(parent.parent.frameRiepilogo.location.href);
				
				try{document.dettaglio.indici.value = parent.frameRiepilogo.getIdxEsa();}
				catch(e){document.dettaglio.indici.value = parent.parent.frameRiepilogo.getIdxEsa();}
				//alert("dopo " + document.dettaglio.indici.value);
				oforzatura = forzatura;
				apri_scelta_esami_consulta();
			}
			else
			{
				// Prenotazione normale con esami ancora da definire...
				if(id_dett == '')
				{
					id_dett = 'x';
					prenota_auto = true;
					if (check_anag_prenotabile()) { // verifico esistenza numero di telefono eccetera
						occupa(vettore_indici_sel[0]);
					}
					return;
				}
				else
				{
					if(id_dett == 'x')
					{
						id_dett = '';
						prenota_auto = false;
						alert('Selezionare Orario!');
						return;
					}
				}

				if(id != -1 && id != null && (((cod == -1 || cod == '') && cod != null && forzatura != 'S') || (forzatura == 'S' || forzatura == 'SE')))
				{
					window.iFrameMain.parametri.ID_AREA = id_are;//document.dettaglio.cmbArea.value; 


					//parent.document.location.replace('sceltaEsami?tipo_registrazione=P&next_servlet=javascript:check_dati_prenota(' + id + ',"' + forzatura + '");&Hclose_js=chiudi_prenotazione();&Hiden_are=' + document.dettaglio.cmbArea.options[document.dettaglio.cmbArea.selectedIndex].value + '&Ha_sel_iden=' + cod);
					//alert('sceltaEsami?tipo_registrazione=P&next_servlet=javascript:check_dati_prenota')
					//(' + id + ',"' + forzatura + '");&Hclose_js=chiudi_prenotazione();&Hiden_are=' + id_are + '&Ha_sel_iden=' + cod);

					// ambulatorio 
					//parent.document.location.replace('sceltaEsami?tipo_registrazione=P&next_servlet=javascript:check_dati_prenota(' + id + ',"' + forzatura + '");&Hforzatura=' + forzatura + '&Hclose_js=chiudi_prenotazione();&Hiden_are=' + id_are + '&Ha_sel_iden=' + cod + "&visualizza_metodica=N&cmd_extra=hideMan();");
					parent.parent.document.location.replace('sceltaEsami?tipo_registrazione=P&next_servlet=javascript:check_dati_prenota(' + id + ',"' + forzatura + '");&Hforzatura=' + forzatura + '&Hclose_js=chiudi_prenotazione();&Hiden_are=' + id_are + '&Ha_sel_iden=' + cod + "&visualizza_metodica=N&cmd_extra=hideMan();");
				}
				else
				{
					alert('Selezionare solo posti liberi!!!');
				}
			}

			forzatura = 'N';
		}
	}
	catch(e){alert("prenota_consulta - Error: " + e.description);}
}

function prenota_consulta_forzata(tipo)
{
	var id = stringa_codici(a_iden_esame);
	
	if(check_data())
	{
		// attenzione : verificare se è sufficiente
		// commentare questo pezzo di codice
		
		/*if(id != '' && id != '-1')
		{
			alert('Selezionare solo posti liberi!');
		}
		else
		{*/
			forzatura = typeof tipo != 'undefined' ? tipo:'S';
				
			prenota_consulta();
		/* } */
	}
}

function apri_scelta_esami_consulta(ok)
{
	var wScelta;
	var oldClick = document.dettaglio.js_click.value;
	
	apri_scheda = 'C';
	forzatura = oforzatura;
	
	if(ok == null)
	{
		conta_esami();
	}
	else
	{
		if(numero_esami > 1)
		{
			wScelta = window.open('', 'wndscelta' , 'status = yes, scrollbars = yes, height = 450, width = 800, top = 150, left = 150');
			if(wScelta)
				wScelta.focus();
			else 
				wScelta = window.open('', 'wndscelta' , 'status = yes, scrollbars = yes, height = 450, width = 800, top = 150, left = 150');
			
			document.dettaglio.js_click.value = 'javascript:registra_consulta();';
			
			document.dettaglio.target = 'wndscelta';
			document.dettaglio.action = 'sceltaEsamiPrenotazione'
			document.dettaglio.method = 'get';
			document.dettaglio.submit();
			
			document.dettaglio.js_click.value = oldClick;
			document.dettaglio.target = '_self';
			document.dettaglio.action = ''
		}
		else
		{
			if(numero_esami == 1)
			{
				inserisci_prenotazione_consultazione(indice_esame);
			}
			else
			{
				alert('Errore interno durante');
			}
		}
	}
}

function inserisci_prenotazione_consultazione(idx)
{
	var parametro;
	var id_dett = a_iden_dettaglio[vettore_indici_sel[0]];
	var esa;
	
	document.dettaglio.indici.value = idx;
	
	try{	esa = parent.frameRiepilogo.getIdenEsa(idx);}
	catch(e){esa = parent.parent.frameRiepilogo.getIdenEsa(idx);}
	parametro = id_dett + '*' + esa + '*S*' + forzatura;
	
	prenDWRClient.occupa_posto(parametro, check_ins_consulta);
}

function check_ins_consulta(msg)
{
	var aDati;
	var id_are = stringa_codici(a_iden_are);

	if(msg.substr(1, 5).toUpperCase() == 'ERROR')
	{
		alert(msg);
	}
	else
	{
		aDati = msg.split('*');
		if(aDati[0].toUpperCase() == 'ERROR')
		{
			alert(aDati[1]);
		}
		else
		{
			if(aDati[1] == '')
			{
				alert('Errore ricezione dati!!!');
			}
			else
			{
				document.dettaglio.id_dett.value = aDati[1].replace(/\,/g, "*");
				// Setto la prenotazione!!!!
				try{parent.frameRiepilogo.document.location.replace('consultazioneRiepilogo?id_area=' + id_are + '&id_dett=' + document.dettaglio.id_dett.value + '&indice=' + document.dettaglio.indici.value + '&forzatura=' + forzatura);}
				catch(e){parent.parent.frameRiepilogo.document.location.replace('consultazioneRiepilogo?id_area=' + id_are + '&id_dett=' + document.dettaglio.id_dett.value + '&indice=' + document.dettaglio.indici.value + '&forzatura=' + forzatura);}
			}
		}
	}
}

function note(tipo)
{
	var tipoNota = "";

	if (tipo=="undefined" || typeof(tipo)=="undefined"){
		tipoNota = "S";
	}
	else{
		tipoNota = tipo;
	}
	switch (tipoNota){
		case "S":
			sospendi_note(tipoNota);
			// classico
			break;
		case "A":
			// nota su appuntamento
			
			var noteDialog = "<div id='dialog-modal' title='Inserimento / modifica Nota appuntamento' style='display:none;visibility:hidden;background-color:#E9FEFE;'><label id='lblNoteApt' style='display:block;font-weight:bold;'>Nota</label><hr/><textarea id='noteApt'  rows='6'  maxlength='4000'  style='border: 1px solid #09F;    width: 95%;'></textarea></div>";
			if (document.getElementById("dialog-modal")){ 
				// esiste
			}
			else{
				// non esiste
				$("form[name='dettaglio']").each(function(i) {
					$(this).append(noteDialog);
				});
			}
			noteAppuntamento();
			break;		
		default:
			sospendi_note(tipoNota);
			break;
	}
}

function noteAppuntamento(){
try{
		var titoloDialog = "";

		var regex =new RegExp("&#13&#10" , "g");
		$( "#dialog-modal" ).dialog({
			height: 200,
			//			  width: parseInt((screen.availWidth - (screen.availWidth * 30 /100))), 
			width: 400, 
			modal: true,
			open : function() {
				var t = $(this).parent(), w = window;
				t.offset({
					top: 0,
					left: parseInt(screen.availWidth/2)-($(this).width()/2)
				});
			},
			'position':'center',
			buttons: {
				"Chiudi": function() {
					$( this ).dialog( "close" );
				},
				"Registra": function() {
					var bolEsito = false;
					// registra duplicato
					bolEsito = doSaveNote();
					// *****
					$( this ).dialog( "close" );					
					if (bolEsito){
						aggiorna();
					}
				}
			}			  
		});
	 	$('#dialog-modal').css('visibility', 'visible');
		$('#dialog-modal').css('height','200');

		try{
			var idenDett = stringa_codici(a_iden_dettaglio);
			if (idenDett==""){return;}
			var rs = top.executeQuery('Prenotazione.xml','getNotaByIdenDett',[idenDett]);
		}catch(e){
			alert("Errore: getNotaByIdenDett");
			return;
		}		
		if (rs.next()){
			var txtNote = rs.getString("note");
			$("#noteApt").val(txtNote);
		}	
		else{
			$("#testoEsitoStd").val("");
		}
		if (txtNote==""){
			titoloDialog = "Inserimento nota - orario: " + stringa_codici(a_ora);
		}
		else{
			titoloDialog = "Modifica nota - orario: " + stringa_codici(a_ora);			
		}

		$("span[class='ui-dialog-title']").html(titoloDialog);
	}
	catch(e){
		alert("noteAppuntamento Error: " + e.description);
	}
	
}


function doSaveNote(){
	var idenDett = stringa_codici(a_iden_dettaglio);
	var bolEsito = false;

	try{
		var stm = top.executeStatement('Prenotazione.xml','updateNotaByIdenDett',[idenDett,$("#noteApt").val()],0);
		if (stm[0]!="OK"){
			try{
				alert("Errore: problemi nel salvataggio della nota. Errore: " + stm[1] + " idDettaglio: " + idenDett);
			}
			catch(e){
				alert("Errore: problemi nel salvataggio della nota!");
			}
			//return;
		}	
		else{bolEsito = true;}
	}
	catch(e){
		alert("doSaveNote Error: " + e.description);
	}
	return bolEsito;
}
// ********************************************


function sospendi()
{
	sospendi_note('2');
}

function sospendi_note(tipo)
{
	var id_nota = stringa_codici(a_id_note);
	var id_imp = stringa_codici(a_imp_sale);//document.dettaglio.id_imp.value;
	var tipo_sel = stringa_codici(a_flag_stato);
	

	var data = document.dettaglio.Hdata.value;
	var ora = stringa_codici(a_ora); // l'ora puo' essere un div. Devo estrarre l'ora corretta.
	var regex = /(.*)>(.*)<(.*)/;
	try {
		var tmp_ora = ora.match(regex)[2];
		ora = tmp_ora;
	} catch (e) {
		//l'ora e' corretta
	}
	
	var wSospNote = null;
	if(id_nota == '-1')
	{
		id_nota = '';
	}
	
	if(((tipo != '2' && tipo_sel == '2') || (tipo == '2' && tipo_sel == 'S')) && id_nota != '')
	{
		if(tipo_sel == '2')
		{
			alert('Attenzione! Slot gia\' sospeso!');
		}
		else
		{
			alert('Attenzione! Slot gia\' con la nota!');
		}
	}
	else
	{
    document.dettaglio.id_area.value = stringa_codici(a_iden_are);
    
		wSospNote = window.open('prenotazioneSospendiNoteInizio?tipo=' + tipo + '&data=' + data + '&Hda_ora=' + ora + '&Ha_ora=' + ora + '&id_note=' + id_nota + '&iden_imp_sale=' + id_imp, 'wndsospendi' , 'status = yes, scrollbars = no, height = 450, width = 800, top = 150, left = 150');
		if(wSospNote)
			wSospNote.focus();
		else 
			wSospNote = window.open('prenotazioneSospendiNoteInizio?tipo=' + tipo + '&Hda_ora=' + ora + '&Ha_ora=' + ora + '&data=' + data + '&id_note=' + id_nota + '&iden_imp_sale=' + id_imp, 'wndsospendi' , 'status = yes, scrollbars = no, height = 450, width = 800, top = 150, left = 150');
	}
}

function canc_sosp_note()
{
	var id_nota = stringa_codici(a_id_note);
	var id_imp = document.dettaglio.id_imp.value;

	if(id_nota != '-1' && id_nota != '')
	{
		prenDWRClient.cancella_spospensione_note(id_nota, check_delete);
		toolKitDB.executeQueryData('{call  SP_CALCOLAMINUTILIBERIAGENDA(' + id_imp + ')}');
	}
}

function ritorna_consulta(tipo, valore, valore2, filtro_esami, offset, pagina)
{
	//alert(tipo+'\n'+valore+'\n'+valore2+'\n'+filtro_esami+'\n'+offset+'\n'+pagina)

	if(filtro_esami != '')
	{
		try{filtro_esami = parent.frameRiepilogo.getIdenEsa();}
		catch(e){filtro_esami = parent.parent.frameRiepilogo.getIdenEsa();}
	}
	
	document.location.replace((typeof pagina == 'undefined' ? 'consultazioneCalendario':pagina) +'?valore=' + valore + '&valore2=' + valore2 + '&filtro_esami=' + filtro_esami + '&tipo=' + tipo + '&Hoffset=' + offset);
}

function ripeti_esame()
{
	var id = stringa_codici(a_iden_esame);
	var wRipeti = null;
	
	if(id == '' || id == '-1')
	{
		alert('Selezionare almeno un\'esame!');
	}
	else
	{
		if(isLockPage('PRENOTAZIONE_RIPETI', id, 'ESAMI'))
		{
			alert('Attenzione! Paziente di sola lettura!');
		}
		else
		{
			wRipeti = window.open('prenotazioneRipeti?iden_esame=' + id, 'wndripeti' , 'status = no, scrollbars = no, height = 230, width = 600, top = 150, left = 150');
			if(wRipeti)
			{
				wRipeti.focus();
			}
			else
			{
				wRipeti = window.open('prenotazioneRipeti?iden_esame=' + id, 'wndripeti' , 'status = no, scrollbars = no, height = 230, width = 600, top = 150, left = 150');
			}
		}
	}
}

function forza_orario()
{
	var wForza;
	var id_imp = document.dettaglio.id_imp.value;
	
	wForza = window.open('prenotazioneInsOrario?iden_imp_sale=' + id_imp, '', 'top=0,left=0,width=360,height=60,status=yes');
	if(wForza)
	{
		wForza.focus();
	}
	else
	{
		wForza = window.open('prenotazioneInsOrario?iden_imp_sale=' + id_imp, '', 'top=0,left=0,width=360,height=60,status=yes');
	}
}

function riprenota_esame()
{
	var id = stringa_codici(a_iden_esame);
	var met = stringa_codici(a_metodica);
	var url_send;
	
	if(id == '' || id == '-1')
	{
		alert('Selezionare almeno un\'esame!');
	}
	else
	{
		if(met == '3')
		{
			url_send = "prenotazioneFrame?";
			//url_send += "servlet=sceltaEsami%3F";
			url_send += "servlet=prenotazioneInizio%3F";
			url_send += "Hiden_esame%3D" + id + "%26";
			url_send += "tipo_registrazione%3DP%26";
			url_send += "next_servlet%3Djavascript%3Acheck_riprenota()%3B%26";
			url_send += "Hclose_js%3Dchiudi_prenotazione()%3B";
			url_send += "&events=onunload&actions=libera_all('" + utente_locale + "', '" + ip_locale + "');";
			
			window.HomeWindow.apri(url_send);
		}
		else
		{
			alert('Selezionare esami tac!');
		}
	}
}

jQuery(document).ready(function()
{
	jQuery().callJSAfterInitWorklist('seleziona();collapseAllRows();');
});

function modificaAnagLinkOrario(valore, iden_anag)
{
	if (typeof iden_anag != 'undefined') {
		idenAnag = iden_anag;
	} else {
		idenAnag = a_iden_anag[valore];
		if(idenAnag == 0){
	    	alert(ritornaJsMsg('selezionare'));
	        return;
	    }
	}
	readOnly ='N';
	var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA&IDEN_ANAG='+idenAnag+'&READONLY='+readOnly;
	
	
	var finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	if (finestra) {
		finestra.focus();
	} else {
		finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	}
	
	return finestra;
}

function modEsameOrario(valore)
{
var codice='';
// controllo se nessuno � definito
	if (valore == undefined){
		if (conta_esami_sel()!=1){
			alert(ritornaJsMsg("jsmsgSoloUnEsame"));
			return;
		}			
		codice = a_iden_esame[vettore_indici_sel[0]];
	}
	else{
		
		codice = a_iden_esame[valore];
	}
	
	if ((codice == 0 )||(codice=="")){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}

	var finestra = window.open("schedaEsame?tipo_registrazione=M&Hiden_esame=" + codice,"wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("schedaEsame?tipo_registrazione=M&Hiden_esame=" + codice,"wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	// resetto i valori 
	
}
function stampa_ticket(){

	
	var iden_esame = stringa_codici(a_iden_esame);
if(iden_esame=='')
{
	alert('Selezionare un posto occupato')
	return;
}
initbasePC();
	var reparto = basePC.DIRECTORY_REPORT ;

	//alert(iden_esame);
	//alert(reparto);
    var finestra = finestra = window.open('elabStampa?stampaFunzioneStampa=TICKET_STD&stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + '&stampaAnteprima=S'+"","","top=0,left=0");
	
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open('elabStampa?stampaFunzioneStampa=TICKET_STD&stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + '&stampaAnteprima=S'+"","","top=1000000,left=1000000");
	}
	
}

function stampaEtiEsame(){
	var iden_esame = stringa_codici(a_iden_esame);
if(iden_esame=='')
{
	alert('Selezionare un posto occupato')
	return;
}
var iden_anag = stringa_codici(a_iden_anag);

initbasePC();
	var reparto = basePC.DIRECTORY_REPORT ;

	//alert(iden_esame);
	//alert(reparto);
    var finestra = finestra = window.open('elabStampa?stampaFunzioneStampa=ETICHETTE_STD&stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + '&stampaAnteprima=S&stampaIdenAnag=' + iden_anag +"","","top=0,left=0");
	
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open('elabStampa?stampaFunzioneStampa=ETICHETTE_STD&stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + '&stampaAnteprima=S&stampaIdenAnag=' + iden_anag +"","","top=1000000,left=1000000");
	}
	
}

function stampa()
{

	var idenAnag = stringa_codici(a_iden_esame) + '';
  if (idenAnag=='')
  {
  alert('Selezionare almeno 1 esame')
  return;
  }
		idenAnag=idenAnag.replace(/\*/g, ",");

	var sf= '{ESAMI.IDEN} in [' + idenAnag  + ']'

	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICEVUTA_PRENO_STD&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");
	
	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=RICEVUTA_PRENO_STD&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");
	}
}


function hidePrenotaConForzatura(){
	try{
		var jsLink = "javascript:prenota_forzata('S');return false;";
		jQuery("ul li a").each(function(){		
			jsLink = jQuery(this).attr("onclick");
			if (jsLink.toString().indexOf("prenota_forzata")!=-1){
//				jQuery(this).hide();
				jQuery(jQuery(this).parent().get( 0 )).remove();
			}
		});
//		
	}
	catch(e){
		alert("hidePrenotaConForzatura - Error: "+  e.description);
	}
}


// modifica 18-4-16
function hideInserisciOrario(){
	try{
		var jsLink = "";
		jQuery("ul li a").each(function(){		
			jsLink = jQuery(this).attr("onclick");
			if (jsLink.toString().indexOf("forza_orario")!=-1){
				jQuery(jQuery(this).parent().get( 0 )).remove();
			}
		});
	}
	catch(e){
		alert("hideInserisciOrario - Error: "+  e.description);
	}
}
// *************



// modifica aldo 
function canPrintReport(){
	try{
		// se la riga ha un paziente
		// mostro stampa foglio
		var cod = stringa_codici(a_iden_esame);
		if (typeof (cod)!="undefined" && cod!=""){
			return true;
		}
		else{
			return false;
		}
	}
	catch(e){
		alert("canPrintReport - Error: " + e.description);
	}	
}


function stampaFoglio(){
		try{
			var idenEsame = stringa_codici(a_iden_esame);
			initbasePC();
			var sf= '{ESAMI.IDEN} in [' + idenEsame  + ']'
			// mettere anteprima N
			var strUrl = "elabStampa?stampaFunzioneStampa=RICEVUTA_PRENO_STD&stampaSelection=" + sf + "&stampaAnteprima=S";
			strUrl += "&stampaIdenEsame=" + idenEsame;
			strUrl += "&stampaReparto=" + basePC.DIRECTORY_REPORT ;
			// stampaReparto a_reparto
			var finestra  = window.open(strUrl,"","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
			if(finestra)
			{
				finestra.focus();
			}
			else
			{
				finestra  = window.open(strUrl,"","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
			}			
		}
	catch(e){
		alert("stampaFoglio - Error: " + e.description);
	}	
}


// modifica Aldo 16/10/2014
function stampaPrenotazioni(){
	try{

//		alert(a_iden_esame);return;
		var modulo = "STAMPAWK_PREN";
		
		var strIdenEsami = "";
		for (var i=0;i<a_iden_esame.length;i++){
			if (a_iden_esame[i]!=""){
				if (strIdenEsami==""){
					strIdenEsami = a_iden_esame[i];
				}
				else{
					strIdenEsami += ","+ a_iden_esame[i];
				}
			}
		}
		if (strIdenEsami==""){
			alert("Attenzione: non e' presente alcuna prenotazione da stampare.");
			return;
		}
		var sf= '{ESAMI.IDEN} in [' + strIdenEsami + ']'
		var urlStampa = 'elabStampa?stampaFunzioneStampa=' + modulo +'&stampaSelection=' + sf + '&stampaAnteprima=S';
		var finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
		if(finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
		}
	}
	catch(e){
		alert("stampaFoglio - Error: " + e.description);
	}	
}
// *************************


// modifica aldo 24/9/2014
function stampaPrenCancellate(){
	try{
		var sf = "";
		var modulo = "STAMPAWK_DELETED";
		var data = document.dettaglio.Hdata.value;
		var iden_are	= stringa_codici(a_iden_are);				
		//var iden_esame = opener.stringa_codici(opener.a_iden_esame); 				
//		var ora	= opener.stringa_codici(opener.a_ora);
	//	var iden_anag	= opener.stringa_codici(opener.a_iden_anag);		
//		var iden_esa = opener.stringa_codici(opener.a_iden_esa);
		sf = "{PRENOTAZIONI_CANCELLATE.DATA} ='" + data +"' and {PRENOTAZIONI_CANCELLATE.IDEN_ARE} = " +iden_are.split("*")[0];
		urlStampa = 'elabStampa?stampaFunzioneStampa=' + modulo +'&stampaSelection=' + sf + '&stampaAnteprima=S';
		var finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
		if(finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
		}
	}
	catch(e){
		alert("stampaPrenCancellate - Error: " + e.description);
	}
}




// modifica 31-8-16
// idenEsami splittati da *
// return true se almeno uno � dema
function checkEsamiDematerializzati(idenEsami){
	try{
		var bolDematerializzata =false; var rs;	var listaIdenEsame = idenEsami.split("*");
		for (var z=0;z<listaIdenEsame.length;z++){
			rs = top.executeQuery('dema.xml','is_dematerializzata',[listaIdenEsame[z]]);
			if (rs.next()){
				if (rs.getString("cod11")=="DEMATERIALIZZATA"){
					bolDematerializzata = true;
					break;
				}
			}		
		}
		return bolDematerializzata;
		// *************
	}catch(e){
		alert("checkEsamiDematerializzati - Error: " + e.description);
	}	
}