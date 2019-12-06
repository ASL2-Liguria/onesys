/**
 * Genera un box informativo per le worklist.
 * 
 * @author  gianlucab
 * @version 1.1
 * @since   2014-04-11
 */

var oggettoInfoRequest = null;
var idInfoLayerAboutExam = "idInfoLayerAboutExamGeneric";
var idInfoLayerAboutExamInner = "idInfoLayerAboutExamInnerGeneric";
var idInfoLayerAboutExamShadow = "idInfoLayerAboutExamShadowGeneric";
var divCreato = false;

var clientx;
var clienty;

function mostraInfoRichiestaGenerico(posizioneArray, oggetto, query) {
	var idenRichiesta = '';
	
	try{
		if (posizioneArray == null) {
			setRiga();
			idenRichiesta = array_iden[rigaSelezionataDalContextMenu];
		} else {
			idenRichiesta = array_iden[posizioneArray];	
		}
		if(idenRichiesta == ''){return;}
		
		//alert(posizioneArray + '\n' + oggetto + '\n' + idenRichiesta);
		
		if (oggettoInfoRequest==null)
			oggettoInfoRequest = new Object();
		
		// Definizione dei campi da visualizzare
		switch(query) {
			case 'getEsameSottoIndagine':
				oggettoInfoRequest = new Array(
						{"key": "TIPO", "label": "Tipologia Esame Sotto Indagine", "value": []},
						{"key": "DESCR_ESAME", "label": "Descrizione Esame Richiesto", "value": []},
						{"key": "STATO", "label": "Stato Esame Sotto Indagine", "value": []}
				);
				break;
			case 'getInfoEsamiRichiesti':
				oggettoInfoRequest = new Array(
						{"key": "DESCR", "label": "Esami richiesti", "value": []},
						{"key": "DESCR_MED_RICHIEDENTE", "label": "Medico Prescrittore", "value": []},
						{"key": "DESCR_TAB_SPAZ", "label": "Stato Paziente", "value": []},
						{"key": "OPE_RICH", "label": "Operatore Richiedente", "value": []},
						{"key": "QUESITO", "label": "Quesito", "value": []},
						{"key": "QUADRO_CLI", "label": "Quadro Clinico", "value": []},
						{"key": "DESCR_UTE_CONTROLLO", "label": "Operatore che ha dato il controllo", "value": []},
						{"key": "DESCR_UTE_ANNULLA", "label": "Operatore che ha annullato", "value": []},
						{"key": "NOTE", "label": "Note", "value": []}
				);
				break;
			default:
				throw new Error("Nessuna query definita.");
		}
		
		// Chiudo il box informativo eventualmente già aperto
		hideInfoLayerInWorklist();

		// Imposto la posizione del layer che verrà generato dalla funzione processXmlDocument
		clientx = event.clientX;
		clienty = event.clientY;

		processResultSet(top.executeQuery("OE_Richiesta.xml",query,[idenRichiesta]),query);
	}
	catch(e){
		alert("mostraInfoRichiesta:errore " + e.description);
	}
}


// funzione che nasconde livello
// riguardante le info dell'esame (quesito, quadro)
function hideInfoLayerInWorklist(){
	hideInfoLayerById(idInfoLayerAboutExam);
	hideInfoLayerById(idInfoLayerAboutExamInner);
	hideInfoLayerById(idInfoLayerAboutExamShadow);		
}

function hideInfoLayerById(id){
	var obj = document.getElementById(id);
	if (obj){
		obj.style.visibility = 'hidden';
	}	
}

function processResultSet(resultSet){
	try{
		if (resultSet){
			for(var i=0; resultSet.next(); i++){
				for(var k in oggettoInfoRequest) {
					oggettoInfoRequest[k]["value"][i] = resultSet.getString(oggettoInfoRequest[k]["key"]);
					//alert(oggettoInfoRequest[k]["key"] + ": " + resultSet.getString(oggettoInfoRequest[k]["key"]));
				}
			}
		}
	}
	catch(e){
		alert("processResultSet " + e.description);
	}

	 // creo layer
	if (!divCreato){
		//creo x la prima volta il layer
		createDivInfoRichieste();		
	}
	// setto posizione layet
	setLayerPosition(clienty,clientx);
	// setto contenuto
	setContentLayerGenerico(idInfoLayerAboutExamInner);

//	idInfoLayerAboutExamInner;
	
}

// creo livello con le informazioni
// dell'esame al suo interno
function createDivInfoRichieste(){
	
	var divInfoLayer;
	var divInfoLayerInner;
	var divInfoLayerShadow;
	
	try{
		divInfoLayerInner = document.createElement("DIV");
		divInfoLayerInner.id = idInfoLayerAboutExamInner;
		divInfoLayerInner.className = "boxInfoLayer-inner";	
		
		divInfoLayer = document.createElement("DIV");
//		divInfoLayer.title = ritornaJsMsg('tooltipInfoLayer');
		divInfoLayer.id = idInfoLayerAboutExam;
		divInfoLayer.className = "boxInfoLayer";
		divInfoLayer.appendChild(divInfoLayerInner);
//		divInfoLayer.style.visibility = "visible";
		divInfoLayer.onclick = function(){hideInfoLayerInWorklist();};
		
		// shadow
		divInfoLayerShadow = document.createElement("DIV");
		divInfoLayerShadow.id = idInfoLayerAboutExamShadow;
		divInfoLayerShadow.className = "boxInfoLayerShadow";
		
		
		document.body.appendChild(divInfoLayer);
		document.body.appendChild(divInfoLayerShadow);
		divCreato = true;
	}
	catch(e){
		alert("createDivInfoRichieste " + e.description);
	}
}

// funzione 
// che compone il 
// contenuto del layer
// nel formato html
function setContentLayerGenerico(id){
	
	var obj = document.getElementById(id);
	var contenutoHtml = "";
	
	if(obj){
		var size = oggettoInfoRequest[0].value.length;
		for (var i=0; i<size;i++) {
			for (var k in oggettoInfoRequest) {
				if (oggettoInfoRequest[k]["value"][i] != "" && oggettoInfoRequest[k]["value"][i] != "null" && oggettoInfoRequest[k]["value"][i] != "undefined"){
					/*
					 * Modifica richiesta per getEsameSottoIndagine:
					 * 
					 */if (oggettoInfoRequest[k]["key"] == 'DESCR_ESAME') contenutoHtml += "<br>"; else /*
					 */
					
					contenutoHtml += "<label class='Titolo'>"+ oggettoInfoRequest[k]["label"] +"</label>";
					contenutoHtml += oggettoInfoRequest[k]["value"][i];
				}
			}	
			contenutoHtml += "<br><br>";
		}
		
		obj.innerHTML = contenutoHtml;
		obj.style.visibility = 'visible';
	}
}

function setLayerPosition(top,left){
	var altezzaDocumento = document.body.offsetHeight;	
	var obj = document.getElementById(idInfoLayerAboutExam);

	var posizioneTop = "";
	var posizioneLeft = "";
	
	try{
		if (obj){
			obj.style.visibility = 'visible';		
			obj.style.position = "absolute";
			posizioneLeft = left;
			// posizionamento verticale
			if ((top+obj.scrollHeight)>altezzaDocumento){
				if ((top-obj.scrollHeight)>0){
					posizioneTop = document.body.scrollTop+(top-obj.scrollHeight);
					}
				else{
					posizioneTop = document.body.scrollTop;
				}
				
			}
			else{
				posizioneTop = document.body.scrollTop+top;
			}	
			obj.style.left = posizioneLeft;
			obj.style.top = posizioneTop;
		}
		// sposto anche l'ombra
		var objShadow = document.getElementById(idInfoLayerAboutExamShadow);
		if (objShadow){
			objShadow.style.visibility = 'visible';		
			objShadow.style.position = "absolute";
			objShadow.style.left = parseInt(posizioneLeft+5);
			objShadow.style.top =  parseInt(posizioneTop+5);
		}
	}
	catch(e){
		alert("setLayerPosition " + e.description);
	}

}

function XMLToString(oXML)
{
	//code for IE
	if (window.ActiveXObject) {
		var oString = oXML.xml; return oString;
	}
	// code for Chrome, Safari, Firefox, Opera, etc.
	else {
		return (new XMLSerializer()).serializeToString(oXML);
	}
}
