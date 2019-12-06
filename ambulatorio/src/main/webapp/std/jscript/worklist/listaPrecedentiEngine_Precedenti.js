// ultimo iden_esa selezionato
// ne tengo traccia per non ricaricare n volte 
// le stesso info nel fram di sotto
var iden_ese_selezionato_old ="";

var enableAlternateColors='S';

var riferimentoHideFrame

var idInfoLayerAboutExam = "idInfoLayerAboutExam";
var idInfoLayerAboutExamInner = "idInfoLayerAboutExamInner";
var idInfoLayerAboutExamShadow = "idInfoLayerAboutExamShadow";
var bolCreatedInfoExamLayer =false;

// funzione chiamata "onload" dal
// container "listaPrecedentiEngine.js"
function initSubMainObject(){
	
	
	 // modifica per allargare il frame dei precedenti,
	 // con l'aumentare delle icone serve più spazio
	 // quindi, per il momento, allargo il frame.
	 // ATTENZIONE ho modificato la creazione dei frameset
	 // affinche venga creato già con 30% e non 300px
	 // quindi non serve il resize
//	try{parent.document.all.rightFramesetConsolle.cols = "*,30%";}catch(e){;}
	//****
	try{
		if (baseGlobal.GESTIONE_SITI_REMOTI == 'S'){
			initCalendario();
			initInfoFiltriRemoti();
		}
	}catch(e){;}
	try{
		initCalendarioById("idDaDataTipologia","imgDaDataTipologia");
		initInfoFiltriTipologia();
	}catch(e){;}
	try{
		// setto cosa fare dopo caricamento
		// worklist nuova
		jQuery('#oTable').callJSAfterInitWorklist("buildDiarioInfo();");
	}catch(e){
		//alert(e.description);
	}
	// **** nuovo privacy
	if (top.opener.top.home.getConfigParam("GESTIONE_ATTIVA_PVCY")=="S"){
		creaLivelloInfoFascioloParziale();
	}
	// ***********************
	// modifica 11/2/15
	try{
		if (top.opener.top.home.getConfigParam("NASCONDI_TIPOLOGIA_PRECEDENTI")=="S"){
			$("#idHeaderRicTipologia").hide();
		}
	}catch(e){}
	// ********************
	// definisci prototype array
	if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
	        "use strict";
	        if (this == null) {
	            throw new TypeError();
	        }
	        var t = Object(this);
	        var len = t.length >>> 0;
	        if (len === 0) {
	            return -1;
	        }
	        var n = 0;
	        if (arguments.length > 1) {
	            n = Number(arguments[1]);
	            if (n != n) { // shortcut for verifying if it's NaN
	                n = 0;
	            } else if (n != 0 && n != Infinity && n != -Infinity) {
	                n = (n > 0 || -1) * Math.floor(Math.abs(n));
	            }
	        }
	        if (n >= len) {
	            return -1;
	        }
	        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
	        for (; k < len; k++) {
	            if (k in t && t[k] === searchElement) {
	                return k;
	            }
	        }
	        return -1;
	    }
	}	
	
	
}

function creaLivelloInfoFascioloParziale(){
	var strToAppend = "";
	try{
//		strToAppend ="<div id='divInfoFascParz' style='position:absolute; left:20; width:410px; height:10; visibility:hidden'>   <font face='verdana, arial, helvetica, sans-serif' size='2'>    <div style='float:left; background-color:yellow; padding:3px; border:1px solid black'>    <span style='float:right; background-color:gray; color:white; font-weight:bold; width='20px'; text-align:center; cursor:pointer' onclick='javascript:hideIt()'>&nbsp;X&nbsp;</span>Il fascicolo puo' non essere completo</div>   </font></font></div>";
		strToAppend ="<div id='divInfoFascParz'><div id ='divInfoFascParz_inside' >Il fascicolo puo' non essere completo</div></div>";
		$(strToAppend).appendTo('body');
		window.setTimeout(function(){
			document.getElementById("divInfoFascParz").style.top = "180px";
			document.getElementById("divInfoFascParz").style.left = "5px";			
			document.getElementById("divInfoFascParz").style.visibility='visible';}, 10);
		//window.setTimeout("placeIt()", 10);	
	}
	catch(e){
		alert("creaLivelloInfoFascioloParziale - Error: " +e.description);
	}
}


function getPacsIframe(){
	
	var iFrameObj ;
	var oggetto;
	var epicFrame;
	
	try{
		epicFrame = document.getElementById(iFrameId4NeoLogica);
		if (epicFrame){
			return epicFrame;
		}
		else{
			iFrameObj =  document.createElement("IFRAME");
			//iFrameObj.src = "vocalchat.html";	
			//iFrameObj.className = "iframeVocalBox";
			iFrameObj.style.height = "1px";
			iFrameObj.style.width = "1px";			
			iFrameObj.id = iFrameId4NeoLogica;			
			//iFrameObj.onreadystatechange = function(){alert('Caricato!');};		
			oggetto = document.body;
			if (oggetto){
				oggetto.appendChild(iFrameObj);
			}
			return iFrameObj
		}
		
	}
	catch(e){
		alert("getPacsIframe " + e.description);
	}
}

// **********************************************************


function apriChiudiInfoReferto(){
	showTestoRefertoLayer();
}

function caricaInfoReferto(){
	var iden_esa_selezionato="";
	//carico info referto
	var bolInConsole = false;
	var comboServer ;
	try{
		if (document.frmInfoReferto){
			// sono in console
			bolInConsole = true;
		}
		else{
			// worklist
			// non faccio nulla
			return;
		}
		iden_esa_selezionato= stringa_codici(array_iden_esame);
		/*if (iden_ese_selezionato_old==""){
			iden_ese_selezionato_old = iden_esa_selezionato;
		}
		else{
			// se il selezionato è uguale al vecchio esco
			if (iden_ese_selezionato_old == iden_esa_selezionato){return;}
		}*/
		if (iden_esa_selezionato!=""){
			// scelto esame da lista precedenti
			document.frmInfoReferto.idenEsame.value = iden_esa_selezionato;
			document.frmInfoReferto.inputMaximized.value = true;
			
			if (parent.frameBottomConsolle.currentTabulator != 'idInfoProcessedReport'){
				document.frmInfoReferto.idTabulator.value = "idInfoReferto";				
			}
			// controllo se sono in ricerca remota
			comboServer = document.getElementById("idComboRis");
			if (comboServer){
				document.frmInfoReferto.cod_server_remoto.value = getValue("idComboRis");
				document.frmInfoReferto.filtri_remoti.value = getValue("idComboMetodiche") + "@" + document.getElementById("idDaData").value;
			}
			// ******************************
			// @deprecated
			document.frmInfoReferto.idenPrecedente.value = iden_esa_selezionato;
			document.frmInfoReferto.schedaPrecedente.value  = stringa_codici(array_scheda_in_console);
			// **
		}
		/*
		else{
			// forzo caricarmento tabulatore del referto
			// vedere se può essere interessante
			// parametrizzare a livello di utente
			// cosa caricare sulla selezione del precedente
			// ******************************
			// @deprecated			
			document.frmInfoReferto.idenPrecedente.value = "";
			document.frmInfoReferto.schedaPrecedente.value  = "";
			// *****
			document.frmInfoReferto.idTabulator.value = "idInfoEsami";		
		}*/
		// *********** ambulatorio ***
		//document.frmInfoReferto.iden_ref.value = stringa_codici(array_iden_ref); 
		//document.frmInfoReferto.idTabulator.value = currentTabulator;
		// ***************************
		// cmq faccio la submit
		document.frmInfoReferto.submit();
	}
	catch(e){
		alert("caricaInfoReferto - Error: " + e.description);
	}

}


// funzion che carica le immagini
// sul pacs
function syncToPacs(pacsType){
	
	var strAccession_number = "";
	var strAETITLE = "";
	var strReparto = "";
	var strPatId = "";
	var oggetto 
	
	try{
		indice = vettore_indici_sel[0]
		if (indice.toString()==""){return;}
	
		strAccession_number = array_id_esame_dicom[indice];
		strAETITLE =  array_aetitle[indice]; 
		strReparto =  array_reparto[indice];
		strPatId = stringa_codici(array_id_paz_dicom);
		if ((strAccession_number==""))
		{
			alert(ritornaJsMsg("jsmsgAccNumNotValid"));
			return;
		}	
		oggetto = parent.top.opener.top;
		oggetto.hideFrame.basePacsStudy.ACCNUM = strAccession_number;
		oggetto.hideFrame.basePacsStudy.AETITLE = strAETITLE;
		oggetto.hideFrame.basePacsStudy.REPARTO = strReparto;
		oggetto.hideFrame.basePacsStudy.PATID = strPatId;
		// *****
		oggetto.hideFrame.sendToPacs("ADDIMAGES",pacsType,"fromConsole=true");

	}
	catch(e){
		alert("syncToPacs - Error: " + e.description);
	}	
}


// ritorna in base a chi mi carica
// il riferimento all'hideframe
function getHideFrameLink(){
	var oggetto
	try{
		// da console
		oggetto = parent.parent.opener.parent.parent.hideFrame;
	}
	catch(e){
		// da worklist
		try{
			oggetto = parent.parent.hideFrame;
		}
		catch(e){;}
	}
	
	return oggetto;
}


function printReport(){
	try{
		// ATTENZIONE !!! worklistStampe prevede
		// il reparto del REFERTO e non di esami !!
		// ma la vista view_precedenti , al momento,
		// fornisce solo quella degli esami
		stampaReferto('STAMPA')	;
	}
	catch(e){
		alert("printReport - Error: " + e.description);
	}
}

// *** vedere se mettere queste 2 function fuori
function conta_esami_sel()
//conta numero esami selezionati
{
	return vettore_indici_sel.length;
}


// ritorna true se ssi trova in console
function isInConsole(){
	var oggetto
	try{
		// da console
		oggetto = parent.parent.opener.parent.parent.hideFrame;
		return true;
	}
	catch(e){
		// da worklist
		return false;
	}
}


//********************************
function showTestoRefertoLayer(){
	var oggetto;
	var sql = "";
	var iden_esa_selezionato = "";
	try{
		// verifico se sono da worklist
		try{
			if (!isInConsole()){
				iden_esa_selezionato= array_iden_esame[vettore_indici_sel[0]];
				if ((array_iden_ref[vettore_indici_sel[0]]!="")&&(array_iden_ref[vettore_indici_sel[0]]=="-1")){
					alert("Esame non refertato");
					return;
				}
				if ((document.frmAggiorna.cod_server_remoto.value=="")||(document.frmAggiorna.cod_server_remoto.value=="local")){
					sql = "select  e.dat_esa, e.reparto, te.descr esame, r.testo , tp.descr medico, r.iden_ref iden_ref, e.iden iden";
					sql += " from esami e,tab_per tp, tab_esa te, reftxt r";
					sql += " where e.iden_ref = r.iden_ref and";
					sql += " tp.iden = e.iden_medr and";
					sql += " te.iden = e.iden_esa";
					sql += " and e.iden= " + iden_esa_selezionato;
				}
				else{
					// remoto
					sql = "select descr_esame esame, reparto_referto reparto, refertante medico,testo_referto testo from ";
					sql += " tab_precedenti_remoti where ";
					sql += " iden =" + + iden_esa_selezionato;
				}
				getXMLData("",parseSql(sql),"processTestoReferto");
			}
		}
		catch(e){;}
	}
	catch(e){
		alert("getTestoReferto - Error: " + e.description);
	}
}


function processTestoReferto(xmlDoc){
	
	var tagObj;
	var tagObjValue;

	var textToDisplay = "";
	
	try{
		if (xmlDoc){
			textToDisplay = "<TABLE class='classDataTable'><TR>";
			// descr esame
			tagObj = xmlDoc.getElementsByTagName("ESAME")[0];
			if (tagObj){
				tagObjValue = tagObj.childNodes[0].nodeValue;
				if (tagObjValue=="null"){tagObjValue="";}				
				textToDisplay += "<TD class='classTdLabel'>Esame:</TD><TD>" + tagObjValue +"</TD></TR>";
			}			
			// CDC
			tagObj = xmlDoc.getElementsByTagName("REPARTO")[0];
			if (tagObj){
				tagObjValue = tagObj.childNodes[0].nodeValue;
				if (tagObjValue=="null"){tagObjValue="";}
				textToDisplay += "<TR><TD class='classTdLabel'>CDC:</TD><TD>" + tagObjValue +"</TD>";
			}	
			// MEDICO
			tagObj = xmlDoc.getElementsByTagName("MEDICO")[0];
			if (tagObj){
				tagObjValue = tagObj.childNodes[0].nodeValue;
				if (tagObjValue=="null"){tagObjValue="";}				
				textToDisplay += "<TR><TD class='classTdLabel'>Med.Refertante:</TD><TD>" + tagObjValue +"</TD>";				
			}		
			tagObj = xmlDoc.getElementsByTagName("TESTO")[0];
			if (tagObj){
				tagObjValue = tagObj.childNodes[0].nodeValue;
				if (tagObjValue=="null"){tagObjValue="";}				
				textToDisplay += "<TR><TD class='classTdLabel'>Referto:</TD><TD>" + tagObjValue +"</TD>";					
			}				
			if (!bolCreatedInfoExamLayer){
				//creo x la prima volta il layer
				createDivInfoExamLayer();		
			}
			// setto posizione layer
			setLayerPosition(0,0);
			// setto contenuto
			setContentLayer(idInfoLayerAboutExamInner,textToDisplay);

		}
	}
	catch(e){
		alert("processTestoReferto - Error: " + e.description);
	}
	
}


function bindReportLayerEvent(){
	try{
		var oggetto ;
		var i=0;
		if (!isInConsole()){
			// sono in worklist aggancio
			// evento per mostrare il testo del referto
			// verificare se limitarlo solo in worklist
			oggetto = document.getElementById("oTable");
			if (oggetto){
				for (i=0;i<oggetto.rows.length;i++){
					oggetto.rows(i).ondblclick = function(){showTestoRefertoLayer();};
					oggetto.rows(i).title = "Doppio click per info referto";
				}
			}
		}
	}
	catch(e){
		alert("bindReportLayerEvent- Error: " + e.description);
	}

}




// **************************************************
var clientx 
var clienty 

// creo livello con le informazioni
// dell'esame al suo interno
function createDivInfoExamLayer(){
	
	var divInfoLayer
	var divInfoLayerInner
	var divInfoLayerShadow	
	
	
	try{
		divInfoLayerInner = document.createElement("DIV");
		divInfoLayerInner.id = idInfoLayerAboutExamInner;
		divInfoLayerInner.className = "boxInfoLayer-inner";	
		
		divInfoLayer = document.createElement("DIV");
		divInfoLayer.title = "Doppio click per chiudere";
		divInfoLayer.id = idInfoLayerAboutExam;
		divInfoLayer.className = "boxInfoLayer";
		divInfoLayer.appendChild(divInfoLayerInner);
//		divInfoLayer.style.visibility = "visible";

		// shadow
		divInfoLayerShadow = document.createElement("DIV");
		divInfoLayerShadow.id = idInfoLayerAboutExamShadow;
		divInfoLayerShadow.className = "boxInfoLayerShadow";
		
		divInfoLayer.onclick = function(){divInfoLayer.style.visibility = "hidden";divInfoLayerShadow.style.visibility = "hidden";divInfoLayerInner.style.visibility = "hidden"; }		
		
		document.body.appendChild(divInfoLayer);
		document.body.appendChild(divInfoLayerShadow);
		bolCreatedInfoExamLayer = true;
	}
	catch(e){
		alert("createDivInfoExamLayer " + e.description);
	}
}
// funzione 
// che compone il 
// contenuto del layer
// nel formato html
function setContentLayer(id, value){
	
	var obj = document.getElementById(id);
	var contenutoHtml = ""
	
	try{
		if(obj){
			obj.innerHTML = value;
			obj.style.visibility = 'visible';
		}
	}
	catch(e){
		alert("setContentLayer - Error: " + e.description);
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

// **************************************************

function initCalendario(){
	try{
		if (document.getElementById("lblInfoFiltroRicRem")){
			Calendar.setup(
			{
				inputField : "idDaData", // ID of the input field
				ifFormat : "%d/%m/%Y", // the date format
				button : "imgDaData" // ID of the button
			});
		}
		
	}
	catch(e){
		alert("initCalendario " + e.description);
	}	
}



function initCalendarioById(idTextData, imgId){
	try{
		if ((idTextData=="")||(imgId=="")){return;}
		Calendar.setup(
		{
			inputField : idTextData, // ID of the input field
			ifFormat : "%d/%m/%Y", // the date format
			button : imgId // ID of the button
		});
	}
	catch(e){
		alert("initCalendarioById " + e.description);
	}	
}
// funzione che inizializza la label
// indicante su cosa si sta filtrando
function initInfoFiltriRemoti(){

	var oggetto;
	var metodica = "";
	var daData = "";
	var strMsg = "";
	
	try{
		oggetto = document.getElementById("lblInfoFiltroRicRem");
		if (oggetto){
			if (document.frmAggiorna.filtri_remoti.value==""){
				// nessun filtro
				strMsg = getText("idComboRis") + " - Nessun filtro";
			}
			else{
				metodica = document.frmAggiorna.filtri_remoti.value.split("@")[0];
				daData = document.frmAggiorna.filtri_remoti.value.split("@")[1];
				strMsg = getText("idComboRis");
				if (metodica!=""){
					strMsg += " - Metodica: " + getText("idComboMetodiche");
				}
				if (daData!=""){
					strMsg += " - da: " + document.getElementById("idDaData").value;				
				}
			}
			oggetto.className = "infoFiltroRemoto";
			oggetto.innerHTML = strMsg; 				
		}		
	}
	catch(e){
		alert("initInfoFiltriRemoti " + e.description);
	}	
	
}

function initInfoFiltriTipologia(){

	var oggetto;
	var daData = "", strMsg = "", strTmp = "";
	var lista ;
	try{
		oggetto = document.getElementById("lblInfoFiltroRicTip");
		if (oggetto){
			// controllo esista
			if (typeof jsonFiltriTipo!="undefined"){
				//alert(jsonFiltriTipo);
				//alert(jsonFiltriTipo.tipologie.length);
				strTmp = getAllSelectedOptionText("idComboTipologie");
				lista = strTmp.split("*");
				//alert(lista.length + ", " + lista[0]+ ", "+ getAllSelectedOptionText("idComboTipologie") +"#");
				if (strTmp==""){
					strMsg = "Tipologia: [Tutti]";
				}
				else{
					for (var i =0;i<lista.length;i++){
						if (strMsg==""){
							strMsg = "Tipologia: "+ lista[i];
						}
						else{
							strMsg += ", " + lista[i];
						}
					}
				}
				if (daData!=""){
					strMsg += " - dal: " + document.getElementById("idDaData").value;				
				}
			}
			daData = document.getElementById("idDaDataTipologia").value;
			if (daData!=""){
				strMsg += " - da: " + document.getElementById("idDaDataTipologia").value;				
			}
			if (strMsg==""){strMsg= "Nessun filtro";}
			oggetto.className = "infoFiltroRemoto";
			oggetto.innerHTML = strMsg; 				
		}
		// var jsonFiltriTipo = {"tipologie" :[{"value" : 4480,"descr" : "Visita", "sel":true},{"value" : 4040,"descr" : "Prelievo", "sel":false},{"value" : 5580,"descr" : "PRIMA VISITA", "sel": true}],"DaData" : {"value" : ""}}
	}
	catch(e){
		alert("initInfoFiltriTipologia " + e.description);
	}		
}


function cerca(){
	var daData = "";
	var strTmp = "";
	try{
		
		daData = document.getElementById("idDaDataTipologia").value;
		jsonFiltriTipo.DaData.value = daData;
		object = document.getElementById("idComboTipologie");
		if (object){
			for (i=0;i<object.length;i++){
				if (strTmp == ""){
					if (object.options(i).selected){
						strTmp = '{"value" : ' + object.options(i).value.toString() + ',"descr" : "' + object.options(i).text.toString()  +'", "sel":true}';
					}
					else{
						strTmp = '{"value" : ' + object.options(i).value.toString() + ',"descr" : "' + object.options(i).text.toString()  +'", "sel":false}';
					}
				}
				else{
					if (object.options(i).selected){
						strTmp += ',{"value" : ' + object.options(i).value.toString() + ',"descr" : "' + object.options(i).text.toString()  +'", "sel":true}';
					}
					else{
						strTmp += ',{"value" : ' + object.options(i).value.toString() + ',"descr" : "' + object.options(i).text.toString()  +'", "sel":false}';
					}
				}
			}
		}
		strTmp = "[" + strTmp +"]";
		jsonFiltriTipo.tipologie = JSON.parse(strTmp);
		strTmp = JSON.stringify(jsonFiltriTipo);
		document.frmInfoReferto.jsonFiltriTipo.value = strTmp;
		document.frmAggiorna.jsonFiltriTipo.value = strTmp;
		document.frmAggiorna.submit();
	}
	catch(e){
		alert("cerca " + e.description);
	}	
}

function resetDaData(){
	try{
		// idDaDataTipologia
		try{document.getElementById("idDaDataTipologia").value = "";}catch(e){;}
		try{document.getElementById("idDaData").value = "";}catch(e){;}
		cerca();
	}
	catch(e){
		alert("resetDaData " + e.description);
	}	
}

function resetTipologia(){
	try{
		// idComboTipologie
		deSelectAllElement("idComboTipologie");
		cerca();
	}
	catch(e){
		alert("resetTipologia " + e.description);
	}
}

function showReport(idenAnag, idenRef){
	var strRptOnRepo = "";
	var jsonObj ;
	var indice = -1;
	try{
		if (idenAnag==""){alert("Errore : codice anagrafico nullo."); return;}
		// controllare se è refertato
		if (idenRef==""){alert("Prestazione non refertata.");return;}
		for (var k=0;k<array_iden_ref.length;k++){
			if (array_iden_ref[k] == idenRef){
				indice = k;
				break;
			}
		}
		//indice = array_iden_ref.indexOf(idenRef);
		
		if (indice==-1){
			// errore
			alert("Errore: Nessuna definizione delle permissioni sul referto.");
			return;
		}
		jsonObj = JSON.parse(array_contextmenu[indice]);
		strRptOnRepo = jsonObj.RPT_ON_REPO;
		if (strRptOnRepo=="S"){
			if (isInConsole()){
				// sono in console
				parent.leftConsolle.apriRepository_byIdenAnag(idenAnag, parent.leftConsolle);
			}
		} 
		else{
			// metodo classico : tabulatore
		}
		
	}
	catch(e){
		alert("showReport " + e.description);
	}	

}


function apriCartella(funzione, iden_esame) {
	var urlCartella  = "Snodo?azione=Cartella&DO=OPEN";
	var myWin;
	try{
		//alert("cartella: " + funzione + "  "+ iden_esame);
		if (isInConsole()){
			// uso funzione presente nella worklist
			// x non duplicare il codice
			// MA attenzione che la finestra venga in primo piano
			
			// top.opener.apriCartella(funzione, iden_esame) ;
			urlCartella += "&IDEN_ESAME=" + iden_esame;
			urlCartella += "&FUNZIONE=" + funzione;
			//alert("urlCartella: "+ urlCartella);
			myWin = window.open(urlCartella,"schedaRicovero","top=0,left=0, width=" + screen.availWidth +", height=" + screen.availHeight + ", status=no, scrollbars=yes");
			setTimeout(function (){myWin.focus();}, 2500 );
		}
	}
	catch(e){
		alert("showReport " + e.description);
	}	
}


var globalTestoDiario = "";
function buildDiarioInfo(){
	var idenAnag = "";
	var stringaReparto = "";
	var idenRemoto= "";
	var diagnosi = "";
	var myLista;
	var strToAppend = "";
	var bolOneAtLeast = false;

	// per sapere iden_visita
	// select * from cc_problemi_ricovero where iden_visita in (SELECT IDEN FROM NOSOLOGICI_PAZIENTE WHERE IDEN_ANAG = 563735);
	try{
		myLista = new Array();
		if ( parent.leftConsolle.globalIdenAnag ==""){alert("Errore: idenAnag locale nullo");return;}
		myLista.push(parent.leftConsolle.globalIdenAnag);
		rs = parent.top.opener.top.executeQuery('info_repository.xml','getIdenRemoto',myLista);
		if (rs.next()){
			idenRemoto = rs.getString("ID_REMOTO");  // PNCPLL61L23A122J
		}
		if (idenRemoto==""){alert("Errore: idenRemoto nullo");return;	}
		myLista = new Array();
		myLista.push(idenRemoto);
		myLista.push(baseUser.LISTAREPARTI.toString());
		try{rs = parent.top.opener.top.executeQuery('consolle.xml','getInfoDiario',myLista);}catch(e){alert("Errore: getInfoDiario");return;}				
		while (rs.next()){
			bolOneAtLeast = true;
//			utente_inserimento, data_ora_evento, data_modifica, testo, deleted, descr_rep_reg
			strToAppend += "<tr>";
			strToAppend += "<td style='border: 1px solid #6AA8F2;'>" + rs.getString("utente_inserimento") + "</td>";			
			strToAppend += "<td style='border: 1px solid #6AA8F2;'>" + rs.getString("data_ora_evento") + "</td>";
			strToAppend += "<td style='border: 1px solid #6AA8F2;'>" + rs.getString("data_modifica") + "</td>";
			strToAppend += "<td style='border: 1px solid #6AA8F2;'>" + rs.getString("testo") + "</td>";									
			strToAppend += "<td style='border: 1px solid #6AA8F2;'>" + rs.getString("deleted") + "</td>";			
			strToAppend += "<td style='border: 1px solid #6AA8F2;'>" + rs.getString("descr_rep_reg") + "</td>";		
			strToAppend += "</tr>";
//			<table  cellspacing='1' class='classTabHeader' cellpadding='1' width='100%' style='border:thin #000 solid'><thead style='background-color:#CCC; color:black; text-align:center;'><tr ><td>1</td><td>2</td></tr></thead><tbody style='background-color:#E1F9FF; color:black; text-align:center;'><tr style='border-bottom:thin #000 solid;' ><td >a</td><td>b</td></tr><tr><td>c</td><td>d</td></tr><tr><td>e</td><td>f</td></tr></tbody></table> 
		}
		//da togliere
		//bolOneAtLeast = true;
		if (bolOneAtLeast){
			globalTestoDiario = "<table width='100%' style='font-family: Arial, Helvetica, sans-serif;	font-size: 12px;	border: 1px solid #6AA8F2;	background-color:#FFFFF0;	border-collapse : collapse;	width:100%;	overflow:hidden;'><thead ><tr>";
			globalTestoDiario += "<td style='text-align:center;background-color:#C2FAFE;border: 1px solid #6AA8F2;font-weight:bold;'>Utente</td>";	
			globalTestoDiario += "<td style='text-align:center;background-color:#C2FAFE;border: 1px solid #6AA8F2;font-weight:bold;'>Data/ora evento</td>";
			globalTestoDiario += "<td style='text-align:center;background-color:#C2FAFE;border: 1px solid #6AA8F2;font-weight:bold;'>Data ultima modifica</td>";			
			globalTestoDiario += "<td style='text-align:center;background-color:#C2FAFE;border: 1px solid #6AA8F2;font-weight:bold;'>Testo</td>";						
			globalTestoDiario += "<td style='text-align:center;background-color:#C2FAFE;border: 1px solid #6AA8F2;font-weight:bold;'>Cancellato</td>";						
			globalTestoDiario += "<td style='text-align:center;background-color:#C2FAFE;border: 1px solid #6AA8F2;font-weight:bold;'>Reparto registrazione</td>";						
			globalTestoDiario += "</tr></thead>";
			globalTestoDiario += "<tbody >"		
			globalTestoDiario += strToAppend
			globalTestoDiario += "</tbody>";
			// aggiungo pulsante
			// <a id='idADiarioTip' href='javascript:apriInfoDiario();' class='btDiario'>Diario medico</a>
//			$( "<table cellspacing='1' width='100%' cellpadding='1' class='classDataTable'><tr><td><span id='idSpanDiarioTip' class='pulsanteInline'><a id='idADiarioTip' href='javascript:apriInfoDiario();'>Diario</a></span></td></tr></table>" ).insertAfter( "#idHeaderRicTipologia" );			
			$( "<a id='idADiarioTip' href='javascript:apriInfoDiario();' class='btDiario'>Diario medico</a>" ).insertAfter( "#idHeaderRicTipologia" );			
		}

	}
	catch(e){
		alert("buildDiarioInfo - Error: " + e.description);
	}
}


function apriInfoDiario(){
	var myLista = new Array();
	var objHomeFrame;
	var rs;
	var testoDiario = "";
	try{
		//da togliere
		/*
		globalTestoDiario = "<table width='100%' style='table-layout:fixed;	font-family: Arial, Helvetica, sans-serif;	font-size: 12px;	border: 1px solid #6AA8F2;	background-color:#FFFFF0;	border-collapse : collapse;	width:100%;	overflow:hidden;'><thead ><tr><td style='text-align:center;background-color:#C2FAFE;border: 1px solid #6AA8F2;font-weight:bold;'>1</td><td style='text-align:center;background-color:#C2FAFE;border: 1px solid #6AA8F2;font-weight:bold;'>2</td></tr></thead>"
		globalTestoDiario += "<tbody ><tr  ><td style='border: 1px solid #6AA8F2;'>a</td><td style='border: 1px solid #6AA8F2;'>b</td></tr><tr><td style='border: 1px solid #6AA8F2;'>c</td><td style='border: 1px solid #6AA8F2;'>d</td></tr><tr><td style='border: 1px solid #6AA8F2;'>e</td><td style='border: 1px solid #6AA8F2;'>f</td></tr></tbody></table>";
		*/
		// *********************
		// 		parent.leftConsolle.showHideReportControlLayer(false);
		if (!parent.leftConsolle.isMsgInfoOpen()){
			parent.leftConsolle.openMsgInfo(globalTestoDiario, "Diario medico");
		}else{
			parent.leftConsolle.closeMsgInfo();
		}
	}
	catch(e){
		alert("apriInfoDiario " + e.description);
	}			
}

function cancelBubble(e) {
	var evt = e ? e:window.event;
	if (evt.stopPropagation)    evt.stopPropagation();
	if (evt.cancelBubble!=null) evt.cancelBubble = true;
}