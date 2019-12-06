
var doppioFrameScheda = false;
//@deprecated
var tableNoRelatedFormTable = "<table class='Titolo'><tr><th><label id='lblNoInfoProcessedReport'>L'esame non presenta alcuna scheda associata !</label></th></tr><colgroup></colgroup></table>";
//@deprecated
var tableNoRelatedFormOld = "<span class='spanTitle'>L'esame non presenta alcuna scheda associata !</span>"; 
var tableNoRelatedForm = "<div class='Titolo'>L'esame non presenta alcuna scheda associata !</div>";


function initSubGlobalObject(){
	fillLabels(arrayLabelName,arrayLabelValue);
	/*try{
		// chiamo funzione presente in infoRefertoEngine.js		
		initBaseClass();
	}
	catch(e){
		;
	}	*/
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
	// controllo sulla tipologia tabulatore

	if (document.getElementById("containerSchedaCaso")){
		initIFrame();
	}



}

function initIFrame (){
	try{
		var iden_scheda_in_console ="";
		var console_schedaDaCaricare = "";
		var urlSchedaEsameConsole = "";
		var strInnerHtmlContainer = "";
		var altezzaIframe;

		/*
		try{alert(parent.leftConsolle.getLeftFrameWidth());}catch(e){;}
		try{alert(parent.parent.framesetConsolle.rows.split(","));}catch(e){;}
		try{alert(parent.leftConsolle.height);}catch(e){;}
		 */
		if (!isInConsole()){
			// NON sono in console
			// SONO in worklist
			//
			doppioFrameScheda = false;
			if (idenSchedaEsameScelto!=""){
				document.getElementById("ifrmInfoSchedaLeft").src = urlSchedaEsameScelto;
			}
			else{
				document.getElementById("schedaCasoLeftFrame").innerHTML = tableNoRelatedForm;
			}			
		}
		else{
			// SONO in console
			var iden_esame_selezionato = "";
			iden_esame_selezionato = parent.leftConsolle.getValue("oEsa_Ref");
			//alert("iden_esame_selezionato " + iden_esame_selezionato + " idenEsame input: " +document.frmTabulator.idenEsame.value);
			
			//alert("iden_esame_selezionato in console:" + iden_esame_selezionato);
			// cambiare anche il riferimento a iden_scheda_in_console e console_schedaDaCaricare !!!
			// basarsi su listaSchedaConsole listaIdenSchedaConsole listaIdenEsame_SchedaConsole
			idenScheda_ValueScheda = parent.leftConsolle.getScheda_e_iden_da_idenEsa(iden_esame_selezionato);
			if (idenScheda_ValueScheda!=""){
				iden_scheda_in_console = idenScheda_ValueScheda.split("*")[0];
				console_schedaDaCaricare = idenScheda_ValueScheda.split("*")[1];
			}
			
			if (iden_esame_selezionato==document.frmTabulator.idenEsame.value){
				// LO STESSO ESAME !
				// non faccio nulla
				// se non caricare un solo frame
				doppioFrameScheda = false;
				if (iden_scheda_in_console!=""){
					document.getElementById("ifrmInfoSchedaLeft").src = urlSchedaEsameScelto;
				}
				else{
					document.getElementById("schedaCasoLeftFrame").innerHTML = tableNoRelatedForm;
				}
			}
			else{
				// sono DIVERSI !
				// quindi devo caricare anche il secondo 
				// quello della console lo carico SEMPRE a sinistra !

				doppioFrameScheda = true;
				//style="height:333;"
				if (parent.bolConsoleBottomFrameOpened == true ){
					// GIa' aperto !
					altezzaIframe = screen.availHeight - parseInt(parent.parent.framesetConsolle.rows.split(",")[0]) + 75;
				}
				else{
					altezzaIframe = screen.availHeight - parseInt(parent.parent.framesetConsolle.rows.split(",")[0]) - 75;					
				}
				// ricreo contenuto al volo 
				// parto con quello scelto in console a sx (in fase di refertazione)
				if (iden_scheda_in_console!=""){
					urlSchedaEsameConsole = console_schedaDaCaricare + ".html?iden_esame="+ iden_esame_selezionato ;
					urlSchedaEsameConsole += "&iden_anag=" + document.frmTabulator.idenAnag.value;
					urlSchedaEsameConsole += "&scheda=" + console_schedaDaCaricare;
					urlSchedaEsameConsole += "&iden_scheda=" + iden_scheda_in_console; 
					urlSchedaEsameConsole += "&iden_ref=" + document.frmTabulator.idenRef.value;
					urlSchedaEsameConsole += "&ute_mod=" + baseUser.IDEN_PER;
					urlSchedaEsameConsole += "&reading_mode=S";

					strInnerHtmlContainer = "<div id='schedaCasoLeftFrame' class='mezzo'>" ;
					strInnerHtmlContainer += "<DIV class='sottoTitoloTabulatoreCorrente'>Esame in fase di refertazione</DIV>"  ;
					strInnerHtmlContainer += "<iframe id='ifrmInfoSchedaLeft' class='classFrmInfoScheda' src='" + urlSchedaEsameConsole +
					"' style='height:" + altezzaIframe +";'></iframe></DIV>";						
				}
				else{
					// VUOTO !!
					strInnerHtmlContainer = "<div id='schedaCasoLeftFrame' class='mezzo'><DIV class='sottoTitoloTabulatoreCorrente'>Esame in fase di refertazione</DIV>" + tableNoRelatedForm + "</DIV>" ;	
				}
				// lavoro sul precedente
				if (idenSchedaEsameScelto!=""){
					strInnerHtmlContainer += "<div id='schedaCasoRightFrame' class='mezzo'>";
					strInnerHtmlContainer += "<DIV class='sottoTitoloTabulatorePrecedente'>Esame precedente</DIV>";
					strInnerHtmlContainer += "<iframe src='" + urlSchedaEsameScelto + "' class='classFrmInfoScheda'  id='ifrmInfoSchedaRight' style='height:" + altezzaIframe +";'></iframe></div>";
				}
				else{
					// VUOTO !
					strInnerHtmlContainer += "<div id='schedaCasoRightFrame' class='mezzo'><DIV class='sottoTitoloTabulatorePrecedente'>Esame precedente</DIV>" + tableNoRelatedForm + "</div>";						
				}
				//alert("#" + strInnerHtmlContainer +"#");
				document.getElementById("containerSchedaCaso").innerHTML = strInnerHtmlContainer;
				/*document.getElementById("ifrmInfoSchedaLeft").src = urlSchedaEsameConsole;
					document.getElementById("ifrmInfoSchedaRight").src = urlSchedaEsameScelto;*/
			}



		}
	}
	catch(e){
		alert("initIFrame - Error: " + e.description);
	}
}


function isDoubleIFrame(){
	return doppioFrameScheda;
}

/*
 * iFrameObj = document.getElementById(idIframe);
		if (iFrameObj){
			if ( iFrameObj.contentDocument ) { // DOM
				objText = iFrameObj.contentDocument.getElementById(idObject);
			} else if ( iFrameObj.contentWindow ) { // IE win questo è ok
				objText = iFrameObj.contentWindow.document.getElementById(idObject);
			}
			if (objText){
				strOutput = objText.value;
			}
		}
 */

function isInConsole(){
	var bolInConsole = false; 
	try{
		// sono in console
		var dimensioneFrameset = parent.document.all.framesetConsolle.rows;			
		bolInConsole = true;			
	}
	catch(e){
		bolInConsole = false;
	}
	return bolInConsole;
}