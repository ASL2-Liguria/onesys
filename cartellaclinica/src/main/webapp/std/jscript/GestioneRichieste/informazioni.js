// JavaScript Document

var oggettoInfoRichiesta = new Object();
var idInfoLayerAboutExam = "idInfoLayerAboutExam";
var idInfoLayerAboutExamInner = "idInfoLayerAboutExamInner";
var idInfoLayerAboutExamShadow = "idInfoLayerAboutExamShadow";
var divCreato =false;

var clientx 
var clienty 


function initOggettoRichiesta(){
	oggettoInfoRichiesta.ESAMI_RICHIESTI = "";
	oggettoInfoRichiesta.MEDICO_PRESCRITTORE = "";
	oggettoInfoRichiesta.OPERATORE_RICHIEDENTE = "";
	oggettoInfoRichiesta.STATO_PAZIENTE = "";
	oggettoInfoRichiesta.QUESITO = "";
    oggettoInfoRichiesta.QUADRO_CLINICO = "";
    oggettoInfoRichiesta.OPERATORE_CONTROLLO = "";
	oggettoInfoRichiesta.OPERATORE_ANNULLA = "";
	oggettoInfoRichiesta.NOTE = "";
}

function mostraInfoRichiesta(posizioneArray, oggetto){
	
	var idenRichiesta = '';
	var sql = ""
	clientx = event.clientX;
	clienty = event.clientY;
	
	try{
		idenRichiesta = array_iden[posizioneArray];
		
		//alert(posizioneArray + '\n' + oggetto + '\n' + idenRichiesta);
		
		initOggettoRichiesta();
		
		// chiudo quello eventualmente aperto
		hideInfoLayerInWorklist();
				
		if(idenRichiesta == ''){return;}

		//CHI TOCCA MUORE!
		//select che va a prendere i dati dalla vista view_vis_richiesta
		sql =  "select DESCR,TR_IDEN,DESCR_MED_RICHIEDENTE,OPE_RICH, DESCR_MED_RICHIEDENTE, DESCR_TAB_SPAZ, QUESITO,";
		sql += "QUADRO_CLI, DESCR_UTE_CONTROLLO, DESCR_UTE_ANNULLA,NOTE ";
		sql += "from INFOWEB.VIEW_VIS_RICHIESTA ";
		sql += "where tr_iden="+idenRichiesta;

		//alert(sql);

		getXMLData("", parseSql(sql),"processXmlDocument");
	}
	catch(e){
		alert("mostraInfoRichiesta:errore " + e.description)
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


// funzione di callback
// che viene chiamata solo in caso 
// non ci sia alcun errore
// in input si ha solo l'oggetto trovato tramite il tag
// response
function processXmlDocument(xmlDoc){
	var tagElencoEsami = '';
	var tagMedicoRichiedente = null;
	var tagOperatoreRichiedente = null;
	var tagStatoPaziente = null;
	var tagQuesito = null;
	var tagQuadroClinico = null;
	var tagUtenteControllo = null;
	var tagUtenteAnnulla = null;
	var tagUtenteNote = null;
	
	
	var numeroEsami = 0;
	var valoreEsamiRichiesti = '';
	var valoreMedicoRichiedente = null;
	var valoreOperatoreRichiedente = null;
	var valoreStatoPaziente = null;
	var valoreQuesito = null;
	var valoreQuadroClinico = null;
	var valoreUtenteControllo = null;
	var valoreUtenteAnnulla = null;
	var valoreUtenteNote = null;
	
	try{
		if (xmlDoc){
			//ESAMI RICHIESTI
			var esami = xmlDoc.getElementsByTagName("DESCR");
			
			numeroEsami = esami.length;
			
			for(var i = 0; i < (numeroEsami-1); i++){

				tagElencoEsami = esami[i].childNodes[0].nodeValue + '<br>';
				valoreEsamiRichiesti += tagElencoEsami;
			}
			
			//DESCR_MED_RICHIEDENTE
			tagMedicoRichiedente = xmlDoc.getElementsByTagName("DESCR_MED_RICHIEDENTE")[0];
			if(tagMedicoRichiedente){
				valoreMedicoRichiedente = tagMedicoRichiedente.childNodes[0].nodeValue;
				//alert(valoreMedicoRichiedente);		
			}
			//OPE_RICH
			tagOperatoreRichiedente = xmlDoc.getElementsByTagName("OPE_RICH")[0];
			if(tagOperatoreRichiedente){
				valoreOperatoreRichiedente = tagOperatoreRichiedente.childNodes[0].nodeValue;
				//alert(valoreOperatoreRichiedente);
			}	
			//DESCR_TAB_SPAZ
			tagStatoPaziente = xmlDoc.getElementsByTagName("DESCR_TAB_SPAZ")[0];
			if(tagStatoPaziente){
				valoreStatoPaziente = tagStatoPaziente.childNodes[0].nodeValue;
				//alert(valoreStatoPaziente);
			}	
			//QUESITO
			tagQuesito = xmlDoc.getElementsByTagName("QUESITO")[0];
			if(tagQuesito){
				valoreQuesito = tagQuesito.childNodes[0].nodeValue;
				//alert(valoreQuesito);
			}	
			//QUADRO_CLI
			tagQuadroClinico = xmlDoc.getElementsByTagName("QUADRO_CLI")[0];
			if(tagQuadroClinico){
				valoreQuadroClinico = tagQuadroClinico.childNodes[0].nodeValue;
				//alert(valoreQuadroClinico);
			}		
			//DESCR_UTE_CONTROLLO
			tagUtenteControllo = xmlDoc.getElementsByTagName("DESCR_UTE_CONTROLLO")[0];
			if(tagUtenteControllo){
				valoreUtenteControllo = tagUtenteControllo.childNodes[0].nodeValue;
				//alert(valoreUtenteControllo);
			}	
			//DESCR_UTE_ANNULLA
			tagUtenteAnnulla = xmlDoc.getElementsByTagName("DESCR_UTE_ANNULLA")[0];
			if(tagUtenteAnnulla){
				valoreUtenteAnnulla = tagUtenteAnnulla.childNodes[0].nodeValue;
				//alert(valoreUtenteAnnulla);
			}	
			//NOTE
			tagUtenteNote = xmlDoc.getElementsByTagName("NOTE")[0];
			if(tagUtenteNote){
				valoreUtenteNote = tagUtenteNote.childNodes[0].nodeValue;
				//alert(valoreUtenteNote);
			}
		}
	}
	catch(e){
		alert("processXmlResponse " + e.description)
	}
	
	oggettoInfoRichiesta.ESAMI_RICHIESTI = valoreEsamiRichiesti;
	oggettoInfoRichiesta.MEDICO_PRESCRITTORE = valoreMedicoRichiedente;
	oggettoInfoRichiesta.OPERATORE_RICHIEDENTE = valoreOperatoreRichiedente;
	oggettoInfoRichiesta.STATO_PAZIENTE = valoreStatoPaziente;
	oggettoInfoRichiesta.QUESITO = valoreQuesito;
	oggettoInfoRichiesta.QUADRO_CLINICO = valoreQuadroClinico;
	oggettoInfoRichiesta.OPERATORE_CONTROLLO = valoreUtenteControllo;
	oggettoInfoRichiesta.OPERATORE_ANNULLA = valoreUtenteAnnulla;
	oggettoInfoRichiesta.NOTE = valoreUtenteNote;

	 // creo layer
	if (!divCreato){
		//creo x la prima volta il layer
		createDivInfoRichieste();		
	}
	// setto posizione layet
	setLayerPosition(clienty,clientx);
	// setto contenuto
	setContentLayer(idInfoLayerAboutExamInner);

//	idInfoLayerAboutExamInner;
	
}




// creo livello con le informazioni
// dell'esame al suo interno
function createDivInfoRichieste(){
	
	var divInfoLayer
	var divInfoLayerInner
	var divInfoLayerShadow	
	
	
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
		divInfoLayer.onclick = function(){hideInfoLayerInWorklist();}
		
		
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
function setContentLayer(id){
	
	var obj = document.getElementById(id);
	var contenutoHtml = ""
	
	if(obj){		
		contenutoHtml = "<label class='Titolo'>Esami Richiesti</label>";		
		contenutoHtml += oggettoInfoRichiesta.ESAMI_RICHIESTI;		
		
		if ((oggettoInfoRichiesta.MEDICO_PRESCRITTORE != "null") && (oggettoInfoRichiesta.MEDICO_PRESCRITTORE != "undefined")){
			contenutoHtml += "<label class='Titolo'>Medico Prescrittore</label>";		
			contenutoHtml += oggettoInfoRichiesta.MEDICO_PRESCRITTORE;				
		}
		
		if ((oggettoInfoRichiesta.STATO_PAZIENTE != "null") && (oggettoInfoRichiesta.STATO_PAZIENTE != "undefined")){
			contenutoHtml += "<label class='Titolo'>Stato Paziente</label>";
			contenutoHtml += oggettoInfoRichiesta.STATO_PAZIENTE ;
		}
		
		if ((oggettoInfoRichiesta.OPERATORE_RICHIEDENTE != "null") && (oggettoInfoRichiesta.OPERATORE_RICHIEDENTE != "undefined")){
			contenutoHtml += "<label class='Titolo'>Operatore Richiedente</label>"
			contenutoHtml += oggettoInfoRichiesta.OPERATORE_RICHIEDENTE ;
		}
		
		if ((oggettoInfoRichiesta.QUESITO != "null") && (oggettoInfoRichiesta.QUESITO != "undefined")){
			contenutoHtml += "<label class='Titolo'>Quesito</label>"
			contenutoHtml += oggettoInfoRichiesta.QUESITO ;
			contenutoHtml += "<BR><br><br>";
		}
		
		if ((oggettoInfoRichiesta.QUADRO_CLINICO != "null") && (oggettoInfoRichiesta.QUADRO_CLINICO != "undefined")){
			contenutoHtml += "<label class='Titolo'>Quadro Clinico</label>"
			contenutoHtml += oggettoInfoRichiesta.QUADRO_CLINICO ;
		}
		
		if ((oggettoInfoRichiesta.OPERATORE_CONTROLLO != "null") && (oggettoInfoRichiesta.OPERATORE_CONTROLLO != "undefined")){
			contenutoHtml += "<label class='Titolo'>Operatore che ha dato il controllo</label>"
			contenutoHtml += oggettoInfoRichiesta.OPERATORE_CONTROLLO ;
		}
		
		if ((oggettoInfoRichiesta.OPERATORE_ANNULLA != "null") && (oggettoInfoRichiesta.OPERATORE_ANNULLA != "undefined")){
			contenutoHtml += "<label class='Titolo'>Operatore che ha annullato</label>"
			contenutoHtml += oggettoInfoRichiesta.OPERATORE_ANNULLA ;
		}
		
		if ((oggettoInfoRichiesta.NOTE != "null") && (oggettoInfoRichiesta.NULL != "undefined")){
			contenutoHtml += "<label class='Titolo'>Note</label>"
			contenutoHtml += oggettoInfoRichiesta.NOTE ;
		}
		
		obj.innerHTML = contenutoHtml;
		obj.style.visibility = 'visible';
	}
}

function setLayerPosition(top,left){
	var altezzaDocumento = document.body.offsetHeight;	
	var obj = document.getElementById(idInfoLayerAboutExam);

	var posizioneTop
	var posizioneLeft
	
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
					posizioneTop = document.body.scrollTop
				}
				
			}
			else{
				posizioneTop = document.body.scrollTop+top;
			}	
			obj.style.left = posizioneLeft ;
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


