function initGlobalObject(){
	fillLabels(arrayLabelName,arrayLabelValue);
	try{
		// chiamo funzione presente in infoRefertoEngine.js		
		initBaseClass();
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
	try{
		//if(parent.leftConsolle.getHomeFrame().home.getConfigParam("SITO")=="FERRARA"){
			var listaIdenEsamiConsole = new Array();
			listaIdenEsamiConsole = parent.leftConsolle.array_iden_esame.toString().split(",");
			var idenEsamePrecedente = document.frmAggiorna.idenPrecedente.value;
			var bolEsameInRefertazione = false;
			// per problemi a inArray di jquery faccio un ciclo classico
			for (var k=0;k<listaIdenEsamiConsole.length;k++){
				if (listaIdenEsamiConsole[k]==idenEsamePrecedente){
					bolEsameInRefertazione = true;
					break;
				}
			}
			if (!bolEsameInRefertazione){
				$("#idTableDetail").prepend("<tr><td colspan='2'><a class='button-secondary pure-button-fullWidth' href='javascript:importaReferto();'>Importa referto</a></td></tr>");
			}
		//}
	}catch(e){;}
}

function initSubGlobalObject(){
}

// funzione fatta per ferrara
function importaReferto(){
	try{
		//dati 
		// frmAggiorna.idenPrecedente.value
		// frmAggiorna.idenAnag.value
		parent.leftConsolle.window.frames["objReportControl"].importaRefertoPrecedente(document.frmAggiorna.idenPrecedente.value);

	}
	catch(e){
		alert("importaReferto - Error: " + e.description);
	}
}