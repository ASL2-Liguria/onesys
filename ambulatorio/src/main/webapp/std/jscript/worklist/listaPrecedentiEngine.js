// JavaScript Document

var rightZoomClass="toRight";
var leftZoomClass ="toLeft";

function riposizionaHeader()
{
	/*jQuery('div.clsWorklist').css({'top': '25px', 'left': '0px'});
	jQuery('div.clsWorklist div.clsHeaderFixed').css({'left': '-280px'});
	jQuery('div.clsWorklist div.clsTableScroll').css({'top': '1px', 'left': '0px'});*/
}

function initGlobalObject(){
	// carico info referto
	// automaticamente in base al tab nel quale mi trovo(info esame, precedenti)
	// verrà richiamata la funzione corretta
	// inoltre se non viene specificato nessun tab
	// da caricare nel frame sottostante verrà
	// preso quello di default (selezionato=S in tab_tabulatori)
	try{
		try{
			initbaseGlobal();
			initbasePC();
			initbaseUser();
		}
		catch(e){
			alert("listaPrecedenti - Failed init baseClasses - " + e.description);
		}
		
		try
		{
			if(jQuery('table script').size() > 0)
			{
				//jQuery('div#div_idTabPrecedenti').hide();
				//jQuery('table[id=""]').each(function(){jQuery(this).remove()});
				jQuery().callJSAfterInitWorklist('caricaInfoReferto();');
				jQuery().callJSAfterInitWorklist('riposizionaHeader();');
			}
			else
			{
				caricaInfoReferto();
				
				try
				{
					addAlternateColor();
				}
				catch(e)
				{
		//			alert("listaPrecedenti - failed ternateColor - " + e.description);
				}		
			}
		}
		catch(e){
			alert("listaPrecedenti - failed caricaInfoReferto - " + e.description);
		}

		try{fillLabels(arrayLabelName, arrayLabelValue);}catch(e){;}
		
		
		initSubMainObject();
		/*
		try{
			if (baseGlobal.GESTIONE_SITI_REMOTI == 'S'){
				initCalendario();
				initInfoFiltriRemoti();
			}
		}catch(e){;}
		initCalendarioById("idDaDataTipologia","imgDaDataTipologia");
		initInfoFiltriTipologia();*/
		
		/*
		try{
			jQuery( "#casiTag" ).autocomplete({
				source: ['a','b','c']
			});	
		}catch(e){
			alert("Error on autocomplete");
		}*/
	}
	catch(e){
		alert("initGlobalObject - precedentiEngine: " + e.description);
	}
}

function caricaTab(valore){
	try{
		if (valore==""){
			return;
		}
		// carico il tabulatore selezionato
		document.frmTabulator.idTabulator.value = valore
		document.frmTabulator.submit();
	}
	catch(e){
		alert("caricaTab - Error: " + e.description);
	}
}


// funzione che gestisce lo zoom
function zoomConsolleRightFrame(){
	
	try{
		var objectNode = document.getElementById("divBtZoom");
		if (objectNode){
			if (objectNode.className==leftZoomClass){
				// zoom max
				setZoomClass("divBtZoom",rightZoomClass);
				parent.parent.leftConsolle.resizeRightFrame(screen.availWidth);
			}
			else{
				//zoom normale
				setZoomClass("divBtZoom",leftZoomClass);
				parent.parent.leftConsolle.resizeRightFrame(parent.parent.leftConsolle.dimensioneDefaultRightFrame);
			}
		}
	}
	catch(e){
		alert("zoomConsolleRightFrame - Error: " + e.description);
	}
}



// setta la classe 
// dello zoom per avere il pulsante
// girato a sx o dx
function setZoomClass(valore,classType){
	try{
		if (valore==""){return;}
		objectNode = document.getElementById(valore);
		if (objectNode){
			objectNode.className=classType;
		}
	}
	catch(e){
		alert("setZoomClass - Error: " + e.description);
	}	
}

// funzione che gestisce
// lo zoom del frame di sinistra
