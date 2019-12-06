// JavaScript Document
// Questo file deve fare da "multiplexer" 
// per le varie integrazioni pacs web
// In base al tipo di oggetto strPacsType
// deve essere definito un file relativo
// per la le chiamate al pacs web
// il file DEVE implementare la stessa "interfaccia"
// per le varie chiamate


// variabile usata per definire
// il nome del file esterno da caricare
var pathNameExternalFileForSync ="";


// carica on the fly un js esterno
// ATTENZIONE
// il file esterno NON può essere caricato
// e subito richiamata una sua funzione
// per via dei tempi di caricamento
// quindi è necessario fare una chiamata ritardata ad una funzione
// che viene "temporizzata", sull'evento del cambio stato, dopo il caricamento
// 
function dhtmlLoadScript(url, idScript, functionToCallAfter)
{
	var fileref;
	try{
		fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", url);	   
		fileref.setAttribute("id", idScript);	   
		fileref.onreadystatechange = function extFileLoaded(){toDoAfter(idScript,functionToCallAfter);};				
		document.getElementsByTagName("head").item(0).appendChild(fileref)		
	}
	catch(e){
		alert("Error: " + e.description);
	}
	return false;
}



// gestisce cosa fare
// quando il file esterno è stato caricato
function toDoAfter(idFileScript, toDoAfter){
	var oggetto
	
	if (toDoAfter==""){return;}
	
	oggetto = document.getElementById(idFileScript);
	if(oggetto.readyState!="loading"){
		if (toDoAfter!=""){
			eval(toDoAfter);
		}
	}
}


// funzione che sincronizza il paziente
function syncPatientToPacs(pacsType,additionalParameters){
	// serve ??
	// initPacsInfoObject();
	try{
		sendToWebPacs("SHOWSTUDY_PATIENT", top.hideFrame.basePacsUser, top.hideFrame.basePacsStudy, additionalParameters);
	}
	catch(e){
		alert("syncPatientToPacs - Error: " + e.description);
	}
}

//funzione che sincronizza l'esame
function syncStudyToPacs(pacsType,additionalParameters){
	// serve ??
	//	initPacsInfoObject();
	try{
		sendToWebPacs("SHOWSTUDY_STUDY", top.hideFrame.basePacsUser, top.hideFrame.basePacsStudy, additionalParameters);
	}
	catch(e){
		alert("syncStudyToPacs - Error: " + e.description);
	}
}


// ****
// questa funzione effettua dei controlli
// sulla selezione ed effettua l'inizializzazione
// di oggetti, quali basePacsStudy
function initPacsInfoObject(){
	var stringa_iden_esame="";
	var strAccession_number = "";
	var strAETITLE = "";
	var strReparto = "";
	var strPatId = ""
	var oldAEtitle;
	

	// controllo AETITLE diversi
	// ********************************
	try{
		// verifico che se sono nel caso di lista
		// pazienti posso non avere le info dell'esame
		oldAEtitle = array_aetitle[vettore_indici_sel[0]];
		var AEdiversi = 0
		for (i=0;i<vettore_indici_sel.length;i++)
		{
			if (oldAEtitle != array_aetitle[vettore_indici_sel[i]])
			{
				// errore
				AEdiversi = 1;
				break;
			}
		}
		if (AEdiversi==1)
		{
	//		alert(ritornaJsMsg("jsmsgAetitleNotValid"));
			alert("errore aretitle diversi");
			return;
		}
		// ****************************
		strAccession_number = stringa_codici(array_id_esame_dicom);
		strAETITLE = stringa_codici(array_aetitle);
		strReparto = stringa_codici(array_reparto);
		if (strAccession_number==""){
			//alert(ritornaJsMsg("jsmsgAccNumNotValid"));
			alert("num acc non valdido");
			return;
		}
	}
	catch(e){
		// non faccio nulla
	}
	
	strPatId = stringa_codici(array_id_paz_dicom);
	if ((strPatId=="")&&(strAccession_number=="")) {
		alert("Impossibile continuare. Nessun elemento selezionato");
		return;
	}
	// devo riempire struttura
	// dello studio
	parent.parent.hideFrame.basePacsStudy.ACCNUM = strAccession_number;
	parent.parent.hideFrame.basePacsStudy.AETITLE = strAETITLE;
	parent.parent.hideFrame.basePacsStudy.REPARTO = strReparto;
	parent.parent.hideFrame.basePacsStudy.PATID = strPatId;	
	// valutare se riempire anche la proprietà node_name
	
}

// questa funzione DEVE
// essere chiamata per prima
// e permette di inizializzare
// i vari oggetti/files per la sync
function initPacsWebObject(){
	
	// funzione che viene eseguita
	// dopo l'avvenuto caricamento del file esterno
	var functionToCallAfterLoading = "";
	var pacsType = "";
	
	
	try{
		//	faccio controllo direttamente sui parametri dei PC
		if (basePC.ABILITA_SYNC_VE=="S"){
			pacsType = "jsSYSTEMV_VE";
		}
		switch (basePC.WEBSYSV_JS_OBJECT) {
		   case "jsSYSTEMV_VE" :
				pathNameExternalFileForSync = "std/jscript/syncPacsJs/syncVE.js";
				break;
		   case "jsSYSTEMV_WX" :
				pathNameExternalFileForSync = "std/jscript/syncPacsJs/syncWX.js";
				break;	
		   case "jsDREVIEW":
				pathNameExternalFileForSync = "std/jscript/syncPacsJs/syncDReview.js";
				break;	
		   default :
				break;
		} 	
		if (pacsType==""){return;}
		if (pathNameExternalFileForSync!=""){
			// carico al volo il file
			dhtmlLoadScript(pathNameExternalFileForSync,"idExternalFileForPacsSync", functionToCallAfterLoading);
			// azzero variabile
			pathNameExternalFileForSync = "";
		}
	}
	catch(e){
		alert("initPacsWebObject - Error: " + e.description);
	}
	
}
