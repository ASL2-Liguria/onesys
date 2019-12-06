var iden_ese_selezionato_old ="";
var rigaSelezionataDalContextMenu = "";


function initGlobalObject(){
	// se non è caricata Lingue va in errore
	try{
		fillLabels(arrayLabelName,arrayLabelValue);
	}
	catch(e){
		;
	}
	try{
		// chiamo funzione presente in infoRefertoEngine.js		
		initBaseClass();
	}
	catch(e){
		;
	}	
	try{
		addAlternateColor();
	}
	catch(e){
		;
	}
	try{
		// chiamo funzione presente in infoRefertoEngine.js
		createMaximizeTabulator();
	}
	catch(e){;}	
	// controllo se devo massimizzare
	try{
		if (inputMaximized ){
			risezeConsoleBottomFrame(true);			
		}
	}
	catch(e){;}		
	
}

// gestione da link su descrizione
function visualizzaDocumento(indice){
	// ******
	var iden_doc_allegato="";
	try{
		if (indice>=array_iden.length){
			return;
		}
		//carico info referto
		if(typeof indice == 'undefined')
			iden_doc_allegato = stringa_codici(array_iden);
		else
			iden_doc_allegato= array_iden[indice];
		
		if (iden_doc_allegato==""){
			// nessun iden collegato
			return;
		}
		// alert(iden_doc_allegato);
		// ******
		showDocument(iden_doc_allegato);	
	}
	catch(e){
		alert("visualizzaDocumento - Error: " + e.description);
	}
}

// gestione da menu di contesto
function visualizzaDocumentoDaContext(){
	
	var iden_doc_allegato="";

	try{
		//carico info referto
		iden_doc_allegato= stringa_codici(array_iden);
		if (iden_doc_allegato==""){
			// nessun iden collegato
			return;
		}
		showDocument(iden_doc_allegato);
	}
	catch(e){
		alert("visualizzaDocumentoDaContext - Error: " + e.description);
	}

}

// gestione da menu di contesto
function cancellaDocumento(){
	var iden_doc_allegato="";

	try{
		//carico info referto
		iden_doc_allegato= stringa_codici(array_iden);
		if (iden_doc_allegato==""){
			// nessun iden collegato
			return;
		}
		deleteDocument(iden_doc_allegato);
	}
	catch(e){
		alert("cancellaDocumento - Error: " + e.description);
	}	
}



// funzione che richiama servlet
// per visualizzazione documento
function showDocument(idenDocAllegato){
	altezza = screen.availHeight;
		largh = screen.availWidth;
	
	try{
		if (idenDocAllegato==""){return;}
		var popup = window.open('SrvVisualizzaFrameset?iden='+idenDocAllegato+'&iden_anag=' + document.frmTabulator.idenAnag.value +'&iden_esame=' + document.frmTabulator.idenEsame.value, 'winstd', 'status = yes, scrollbars = no, height = '+ altezza +', width = '+ largh +', top = 0, left = 0');
		if(popup) popup.focus();
			else popup = window.open('SrvVisualizzaFrameset?iden='+idenDocAllegato+'&iden_anag=' + document.frmTabulator.idenAnag.value +'&iden_esame=' + document.frmTabulator.idenEsame.value, 'winstd', 'status = yes, scrollbars = no, height = '+ altezza +', width = '+ largh +', top = 0, left = 0');
	}
	catch(e){
		alert("showDocument - Error: " + e.description);
	}		
}

// funzione che effettiamente
// cancella (logicamente) il documento
function deleteDocument(idenDocAllegato){
	
	var sql = "";
	
	try{	
		if (idenDocAllegato==""){return;}	
		if (confirm(ritornaJsMsg("jsmsgDelDocument"))){		
			sql = "UPDATE DOCUMENTI_ALLEGATI SET DELETED='S' where IDEN = " + idenDocAllegato;
			callQueryCommand (sql);
		}
		else{ return;}
	}
	catch(e){
		alert("deleteDocument - Error: " + e.description);
	}	
}


// funzione per aggirnare la pagina
function aggiorna(){
	try{
		document.frmAggiorna.submit();
	}
	catch(e){
		alert("aggiorna - Error: " + e.description);
	}	
}

//
function apriDocLink(oggetto){
	
	var finestra;
	var url = "";
	
	try{
		url = oggetto.childNodes[0].data;
		finestra = window.open(url, "","top=0,left=0, width=" + screen.availWidth +", height=" + screen.availHeight + ", status = yes, scrollbars=auto");
	}
	catch(e){
		alert("apriDocLink - Error:  "+ e.description);
	}
}
// *****************************************
// ***************** AJAX

// esegue query di comando
function callQueryCommand(sql){
	if (sql==""){
		return;
	}
	try{
		ajaxQueryCommand.ajaxDoCommand("DATA",sql ,replyQueryCommand)
	}
	catch(e){
		alert("callQueryCommand - " + e.description)
	}	
}

var replyQueryCommand = function (returnValue){
	
	var feedback;
	
	feedback = returnValue.split("*");
	

	try{
		if (feedback[0].toString().toUpperCase()!="OK"){
			// azzero funzione di callback 
			// da chiamare per interrompere la catena in caso di errore
			functionCallBack = "";
			alert("Error: " + feedback[1]);
		}
		else{
			aggiorna();
		}
	}
	catch(e){
		alert("replyQueryCommand - Error: " + e.description);
	}
	
}

// *****************************************

// ************** modifica 3-3-2015
function cambiaDescrDocumento(){
	try{
	//				cambiaDidascalia(document.getElementById("oTable").rows(indice).cells(7));
		var homeFrame;
		var indice = getSelectedRowId();
		if (getSelectedRowId==-1){
			alert("Nessun elemento selezionato");
			return;
		}
		var oggetto = document.getElementById("oTable").rows(indice).cells(3);
		var didascalia = oggetto.childNodes[0].childNodes[0].innerHTML;
		var indiceRiga = oggetto.parentNode.sectionRowIndex;
		var myref = prompt("Descrizione del documento",didascalia);	
		if (myref!=null){
			if (myref!=didascalia){
				// e' diversa quindi la cambio
				if (isInConsole()){
					homeFrame = parent.leftConsolle.getHomeFrame();
				}
				else{
					homeFrame = top;
				}
				var out = homeFrame.executeStatement('documenti.xml','updateDocDescr',[array_iden[indice],myref]);
				if (out[0] != 'OK') {
					alert("Errore " + out[1]);
				} 
				else{
					aggiorna();
				}
			}
		}
	}
	catch(e){
		alert("cambiaDescrDocumento - Error: " + e.description);
	}	
}

function getSelectedRowId(){
	var indice = -1;
	try{
		var oggetto;
		oggetto = document.getElementById("oTable");
		if (oggetto){
			for (var i=0;i<document.all.oTable.rows.length;i++){
				if (hasClass(document.all.oTable.rows(i), "sel")){
					indice = i;
					break;
				}
			}
		}
		return indice;
	}
	catch(e){
		alert("getSelectedRowId - Error: " + e.description);
	}		
}

function isInConsole(){
	var bolEsito=false;
	try{
		var test = parent.document.all.framesetConsolle.rows;			
		bolEsito = true;	
	}
	catch(e){
		bolEsito = false;
	}
	return bolEsito;
}
// *****************************************