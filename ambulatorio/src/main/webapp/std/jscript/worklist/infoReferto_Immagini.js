var currentTabulator ="idKeyImages";
var urlForGettingThumbNails = "getimagefromdb?getThumb=no";
var urlForGettingPdfReport = "getreport";

var listaDicomTag = new Array();
function infoDicomTag(pDicomTag, pDescr, pValue, pAccNum, pSop, pSeries, pStudy){
	try{
		this.dicomTag = pDicomTag;
		this.dicomDescr = pDescr;
		this.dicomValue = pValue;
		this.ACCNUM = pAccNum;
		this.SOP_INSTANCE_UID = pSop;
		this.SERIES_INSTANCE_UID = pSeries;
		this.STUDY_INSTANCE_UID = pStudy;
	}
	catch(e){
		alert("infoDicomTag - Error: " + e.description);
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

// funzione che ritorna l'indice della riga selezionata
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

function initGlobalObject(){
	try{fillLabels(arrayLabelName,arrayLabelValue);}catch(e){;}
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
	try{addAlternateColor();}catch(e){;}
	try{
		var collection;
		collection = getElementsByAttribute(document.body, "*", "className", "classNormalRow");
		for (var i =0;i<collection.length;i++){
			collection[i].ondblclick = function(){
				if (!isInConsole()){
					alert("Funzionalità disponibile solo in console di refertazione");
					return false;
				}			
				openImgSelector(this.sectionRowIndex);
			};
		}
	}
	catch(e){
		alert("initGlobalObject InfoImg - Error: " + e.description);
	}
	// controllo che se non sono in console 
	// non faccio apparire il menu di contesto
	if (!isInConsole()){
		removeHtmlElementById("contextualMenu_table");
	}		
	else{
		// sono in console
		// se uso tinyMCE devo togliere
		// menu di "incolla commento" per
		// problemi legati alla deselezione
		// del commento.
		// id del menu (riga) contenstuale menuDD_pasteComment		
		if (baseUser.USETINYMCE == 'S'){
			removeHtmlElementById("menuDD_pasteComment");			
		}
	}
}


function editDidascalia(){
	var indice ;
	try{
		if (!controlForEditing()){
			return false;
		}			
		indice = getSelectedRowId();
		if (getSelectedRowId==-1){
			altrt("Nessun elemento selezionato");
			return;
		}
		// ATTENZIONE : se cambia il num di colonne non funziona 
		// più il meccanismo
		cambiaDidascalia(document.getElementById("oTable").rows(indice).cells(9));
	}
	catch(e){
		alert("editDidascalia InfoImg - Error: " + e.description);
	}		
}


function pasteDidascalia(){
	var indiceRiga ;	
	var textToPaste = "";
	var sql = "";
	var regex =new RegExp("'" , "g");	
	try{
		if (!controlForEditing()){
			return false;
		}			
		indiceRiga = getSelectedRowId();
		if (getSelectedRowId==-1){
			altrt("Nessun elemento selezionato");
			return;
		}		
		// incollo didscalia
//		getReportControlSelectedtext
		textToPaste = parent.leftConsolle.getReportControlSelectedtext();
		if (textToPaste==""){
				if (!confirm("Il testo che si sta incollando è vuoto. Proseguire comunque?")){
					return;					
				}
		}
		sql ="update info_dicom_object ";
		sql += " set DIDASCALIA='"+ textToPaste.replace(regex,"''") +"' ";	
		sql += " where ID_ESAME_DICOM='"+ array_id_esame_dicom[indiceRiga] + "'";
		sql += " AND SOP_INSTANCE_UID='" + array_sop[indiceRiga] +"'";
		sql += " AND SERIES_INSTANCE_UID='"+ array_series[indiceRiga] +"'";
		sql += " AND STUDY_INSTANCE_UID='"+ array_study[indiceRiga] +"'";	
		callQueryCommand(sql);
		aggiorna();					
	}
	catch(e){
		alert("pasteDidascalia InfoImg - Error: " + e.description);
	}		
}


function openImgSelector(value){
	var idenEsa = "";	
	try{
		idenEsa = document.frmAggiorna.idenEsame.value;
		if(idenEsa==""){return;}
		var finestra = window.open("keySelector?idenEsa=" + idenEsa,"","status=yes,scrollbars=no,height=" + screen.availHeight +",width="+ screen.availWidth+ ", top=0, left=0");
		if (finestra){
			finestra.focus();
		}
		else{
			finestra = window.open("keySelector?idenEsa=" + idenEsa,"","status=yes,scrollbars=no,height=" + screen.availHeight +",width="+ screen.availWidth+ ", top=0, left=0");		
		}
	}
	catch(e){
		alert("openImgSelector - Error: " + e.description);
	}
}

function aggiorna(){
	try{
		document.frmAggiorna.submit();
	}
	catch(e){
		alert("openImgSelector - Error: " + e.description);
	}	
}


function spostaImg(oggetto, verso){
	try{
		TR = oggetto.parentNode.parentNode.parentNode;
		var indiceRiga = TR.sectionRowIndex;		
		var accNum = array_id_esame_dicom[indiceRiga];
		var sop = array_sop[indiceRiga];
		var series = array_series[indiceRiga];
		var study = array_study[indiceRiga];
		var ordine_corrente = array_ordine[indiceRiga];	
		var ordine_sopra = "";
		var ordine_sotto = "";
		
		if (!isInConsole()){
			alert("Funzionalità disponibile solo in console di refertazione");
			return false;
		}			
		if ((parseInt(verso))>0 && (indiceRiga==0)){
			alert("Impossibile spostare in su.");
			return;
		}
		
		if ((parseInt(verso))<0 && (indiceRiga==parseInt((array_id_esame_dicom.length) -1))){
			alert("Impossibile spostare in giù.");
			return;
		}	
		if (parseInt(verso)>0){
			// sposto in su
			ordine_sopra = array_ordine[indiceRiga-1];
			// aggiorno ordine del selezionato
			sql = "update info_dicom_object ";
			sql += "set ordine = " + ordine_sopra;
			sql += " where ID_ESAME_DICOM='"+ accNum + "'";
			sql += " AND SOP_INSTANCE_UID='" + sop +"'";
			sql += " AND SERIES_INSTANCE_UID='"+ series +"'";
			sql += " AND STUDY_INSTANCE_UID='"+ study +"'";
			// eseguo
			callQueryCommand(sql);
			// aggiorno il soprastante
			sql = "update info_dicom_object ";
			sql += "set ordine = " + ordine_corrente;
			sql += " where ID_ESAME_DICOM='"+ array_id_esame_dicom[indiceRiga-1] + "'";
			sql += " AND SOP_INSTANCE_UID='" + array_sop[indiceRiga-1] +"'";
			sql += " AND SERIES_INSTANCE_UID='"+ array_series[indiceRiga-1] +"'";
			sql += " AND STUDY_INSTANCE_UID='"+ array_study[indiceRiga-1] +"'";	

		}
		else{
			// sposto giù
			ordine_sotto = array_ordine[indiceRiga+1];
			// aggiorno ordine del selezionato
			sql = "update info_dicom_object ";
			sql += "set ordine = " + ordine_sotto;
			sql += " where ID_ESAME_DICOM='"+ accNum + "'";
			sql += " AND SOP_INSTANCE_UID='" + sop +"'";
			sql += " AND SERIES_INSTANCE_UID='"+ series +"'";
			sql += " AND STUDY_INSTANCE_UID='"+ study +"'";
			// eseguo
			callQueryCommand(sql);
			// aggiorno il soprastante
			sql = "update info_dicom_object ";
			sql += "set ordine = " + ordine_corrente;
			sql += " where ID_ESAME_DICOM='"+ array_id_esame_dicom[indiceRiga+1] + "'";
			sql += " AND SOP_INSTANCE_UID='" + array_sop[indiceRiga+1] +"'";
			sql += " AND SERIES_INSTANCE_UID='"+ array_series[indiceRiga+1] +"'";
			sql += " AND STUDY_INSTANCE_UID='"+ array_study[indiceRiga+1] +"'";	
		}
		// eseguo
		callQueryCommand(sql);		
		aggiorna();	
	}
	catch(e){
		alert("spostaImg - Error: " + e.description);
	}
}

function apriImmagine(oggetto){
	var urlToCall = "";
	var TR ;
	
	try{
		TR = oggetto.parentNode.parentNode.parentNode;
		var indiceRiga = TR.sectionRowIndex;		
		var accNum = array_id_esame_dicom[indiceRiga];
		var sop = array_sop[indiceRiga];
		var series = array_series[indiceRiga];
		var study = array_study[indiceRiga];
	
		//urlToCall = urlForGettingThumbNails + "&accNum=" + accNum + "&sopUID=" + sop + "&seriesUID=" + series + "&studyUID=" + study;
		
		urlToCall = "imageGallery?accNum=" +accNum +"&sopUID=" +sop;
	
		var finestra = window.open(urlToCall,"_blank","top=0, left =0, width=" + screen.availWidth + ", height="+ screen.availHeight + ", status=no");
		if (finestra){
			finestra.focus();
		}
		else{
			finestra = window.open(urlToCall,"_blank","top=0, left =0, width=" + screen.availWidth + ", height="+ screen.availHeight + ", status=no");
		}
		// setto titolo finestra con info paziente/esame
		finestra.document.title = infoPaziente + " / " + infoEsame;
	}
	catch(e){
		//alert("apriImmagine - Error: " + e.description);
	}
}


function controlForEditing(){
	var bolEsito = false;
	try{
		if (!isInConsole()){
			alert("Funzionalità disponibile solo in console di refertazione");
			return false;
		}	
		if (parent.leftConsolle.globalReadOnlyMode='N' && parent.leftConsolle.bolSospeso==false && baseUser.TIPO == 'M'){		
			return true;
		}
		else{
			alert("Non si hanno le permissioni per effettuare l'operazione \no il referto è sospeso o in sola lettura.");
			return false;
		}
	}
	catch(e){
		alert("controlForEditing - Error: " + e.description);
	}
}
function cambiaStatoOnReport(oggetto){
	var sql = "";
	var TR ;
	try{
		if (!controlForEditing()){
			return;
		}
		TR = oggetto.parentNode.parentNode.parentNode;
		var indiceRiga = TR.sectionRowIndex;		
		var accNum = array_id_esame_dicom[indiceRiga];
		var sop = array_sop[indiceRiga];
		var series = array_series[indiceRiga];
		var study = array_study[indiceRiga];
		var status = array_show_on_report[indiceRiga];
		
		sql ="update info_dicom_object ";
		if (status.toString().toUpperCase()=="N"){
			sql += " set SHOW_ON_REPORT='S' ";	
		}
		else{
			sql += " set SHOW_ON_REPORT='N' ";				
		}
		sql += " where ID_ESAME_DICOM='"+ accNum + "'";
		sql += " AND SOP_INSTANCE_UID='" + sop +"'";
		sql += " AND SERIES_INSTANCE_UID='"+ series +"'";
		sql += " AND STUDY_INSTANCE_UID='"+ study +"'";
		callQueryCommand(sql);
		aggiorna();
	}
	catch(e){
		alert("cambiaStatoOnReport - Error: " + e.description);
	}
}
// richiamato da click dx
// su didascalia
function cambiaDidascalia(oggetto){
	var didascalia = "";
	var myref = "";
	var indiceRiga = "";
	var sql = "";
	var regex =new RegExp("'" , "g");
	
	try{
		if (!controlForEditing()){
			return false;
		}	
		//alert("OK!" + oggetto.childNodes[0].childNodes[0].innerHTML);
		didascalia = oggetto.childNodes[0].childNodes[0].innerHTML;
		indiceRiga = oggetto.parentNode.sectionRowIndex;
		myref = prompt("Didascalia ?",didascalia);	
		if (myref!=null){
			if (myref!=didascalia){
				sql ="update info_dicom_object ";
				sql += " set DIDASCALIA='"+ myref.replace(regex,"''") +"' ";	
				sql += " where ID_ESAME_DICOM='"+ array_id_esame_dicom[indiceRiga] + "'";
				sql += " AND SOP_INSTANCE_UID='" + array_sop[indiceRiga] +"'";
				sql += " AND SERIES_INSTANCE_UID='"+ array_series[indiceRiga] +"'";
				sql += " AND STUDY_INSTANCE_UID='"+ array_study[indiceRiga] +"'";	
				//alert(sql);		
				callQueryCommand(sql);
				aggiorna();			
			}
		}
		return false;
	}
	catch(e){
		alert("cambiaDidascalia - Error: " + e.description);	
	}
}

// funzione richiamata
// dalla consolle
function setDidascaliaOnSelectedImage(testo){
	var indiceRiga ;
	var regex =new RegExp("'" , "g");	
	try{
		if (!controlForEditing()){
			return false;
		}			
		indiceRiga = getSelectedRowId();
		if (getSelectedRowId==-1){
			altrt("Nessun elemento selezionato");
			return;
		}
		sql ="update info_dicom_object ";
		sql += " set DIDASCALIA='"+ testo.replace(regex,"''") +"' ";	
		sql += " where ID_ESAME_DICOM='"+ array_id_esame_dicom[indiceRiga] + "'";
		sql += " AND SOP_INSTANCE_UID='" + array_sop[indiceRiga] +"'";
		sql += " AND SERIES_INSTANCE_UID='"+ array_series[indiceRiga] +"'";
		sql += " AND STUDY_INSTANCE_UID='"+ array_study[indiceRiga] +"'";	
		//alert(sql);		
		callQueryCommand(sql);
		aggiorna();				
	}
	catch(e){
		alert("setDidascaliaOnSelectedImage - Error: " + e.description);
	}
}

// esegue query di comando
function callQueryCommand(sql){
	if (sql==""){
		return;
	}
	try{
		dwr.engine.setAsync(false);
		ajaxQueryCommand.ajaxDoCommand("DATA",sql ,replyQueryCommand);
					
	}
	catch(e){
		alert("callQueryCommand - " + e.description);
	}	
	finally{
		dwr.engine.setAsync(true);			
	}
}

var replyQueryCommand = function (returnValue){
	
	var feedback;
	var tmp ="";
	feedback = returnValue.split("*");
	
	try{
		if (feedback[0].toString().toUpperCase()!="OK"){
			alert("Error: " + feedback[1]);
		}
		else{
//			alert("tutto ok");
		}
	}
	catch(e){
		alert("replyQueryCommand - Error: " + e.description);
	}
	finally{
		functionCallBack ="";
	}
};

// funzione che recupera le info
// dei tag Dicom dalla vista correlata

function apriInfoKeyImage(accNum, study,series, sop){
	var sql ="";
	try{
		// per far blinkare il tabulatore
		//setBlinkTabulator("idPrecedenti");
		// per la dialog window
		/*
		WRAPPER = "oTable"
		showDialog('! Attenzione !','Warning ','warning');
		*/
//		alert("Mostrare lista dicom tag");

		if (accNum==""){
			document.body.id ="myBody";
			WRAPPER = "myBody";
			showDialog('Error','Accession number nullo.','error',2);			
			return;
		}
		sql = "select * from view_infotag_keyimg ";
		sql += " where id_esame_dicom = '" + accNum + "'";
		sql += " and SOP_INSTANCE_UID = '" + sop + "'";
		sql += " and SERIES_INSTANCE_UID = '" + series + "'";
		sql += " and STUDY_INSTANCE_UID = '" + study + "'";
		// deprecato
		//sql += " and lingua ='" + baseUser.LINGUA +"'";
		getXMLData("",parseSql(sql),"processInfoKeyImage");		
	}
	catch(e){
		alert("apriInfoKeyImage - Error: " + e.description);
	}
}


// funzione di callback
// che viene chiamata solo in caso 
// non ci sia alcun errore
// in input si ha solo l'oggetto trovato tramite il tag
function processInfoKeyImage(xmlDoc){
// response
	
	var strTmp = "";
	var tag ;
	var rowTagObj;
	var i=0;
	var tabella ;

	try{
		if (xmlDoc){
			// resetto tag 
			listaDicomTag = new Array();			
			rowTagObj = xmlDoc.getElementsByTagName("ROW");
			if (rowTagObj){
				for (i=0; i < rowTagObj.length; i++){
					tag = new infoDicomTag(xmlDoc.getElementsByTagName("DICOM_TAG")[i].childNodes[0].nodeValue,xmlDoc.getElementsByTagName("DESCR_TAG")[i].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("DICOM_VALUE")[i].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("ID_ESAME_DICOM")[i].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("SOP_INSTANCE_UID")[i].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("SERIES_INSTANCE_UID")[i].childNodes[0].nodeValue, xmlDoc.getElementsByTagName("STUDY_INSTANCE_UID")[i].childNodes[0].nodeValue);
					listaDicomTag.push(tag);
				}
			}
		}			
		// chiamo funzione che ritorna la tabella costruita
		tabella = getDicomTagTable(listaDicomTag);
		// passo la tabella al metodo che crea il tooltip
		createToolTip(tabella);
		setPositionToolTip(0,0);
	}
	catch(e){
		alert("processInfoKeyImage parsing Error " + e.description)
	}
	
	
}

function getDicomTagTable(lista){
	
	var contenutoHtml="";
	var strTmp = "";
	try{

		contenutoHtml = "<table cellspacing='2' width = '100%' border='0' cellpadding='2' id ='oListDicomTag'><TBODY>";				
		
		if (lista.length==0){
			// nessun elemento
			contenutoHtml += "<TR><td class='tooltip_rigaDispari'>Nessun elemento</TD></TR>";
		}
		else{
			// testata
			contenutoHtml += "<TR class='tooltip_rigaTestata'><TD  width='120px'>Tag</TD><td >Descr.</td><td >Valore</td><TR>"
			for (i=0;i<lista.length;i++){
				if (i%2==0){
					// pari
					contenutoHtml += "<TR class='tooltip_rigaPari'>";
				}
				else{
					// dispari
					contenutoHtml += "<TR class='tooltip_rigaDispari'>";					
				}
				contenutoHtml += "<td class='tooltip_colonna'>" + lista[i].dicomTag +"</TD>";
				if (lista[i].dicomDescr.toString().toLowerCase() == "null"){
					contenutoHtml += "<td class='tooltip_colonna'>&nbsp;</TD>";
				}
				else{
					contenutoHtml += "<td class='tooltip_colonna'>" + lista[i].dicomDescr +"</TD>";
				}	
				if (lista[i].dicomValue.toString().toLowerCase() == "null"){
					contenutoHtml += "<td class='tooltip_colonna'>&nbsp;</TD></TR>";
				}
				else{
					contenutoHtml += "<td class='tooltip_colonna'>" + lista[i].dicomValue +"</TD></TR>";				
				}
				
								
			}
			strTmp = "<div class='infoInLineSubTitle'>";
			strTmp += "Dicom Tag List: ";
			strTmp += "<font color='yellow'>Acc.Num.: " + lista[0].ACCNUM + "</FONT>";
			//", sop: " + lista[0].SOP_INSTANCE_UID + "</FONT>";
			strTmp += "</DIV>";	
			contenutoHtml = strTmp + contenutoHtml;
		}
		contenutoHtml += "</TBODY></TABLE>"	
		return contenutoHtml;
	}
	catch(e){
		alert("getDicomTagTable - Error: " + e.description);
	}
}

function apriReferto(idenRef){
	var urlToCall = "";
	
	if (idenRef ==""){return;}
	urlToCall = urlForGettingPdfReport + "?idenRef=" + idenRef ;
	try{
		var finestra = window.open(urlToCall,"_blank","top=0, left =0, width=" + screen.availWidth + ", height="+ screen.availHeight + ", status=no");
		if (finestra){
			finestra.focus();
		}
		else{
			finestra = window.open(urlToCall,"_blank","top=0, left =0, width=" + screen.availWidth + ", height="+ screen.availHeight + ", status=no");
		}
		// setto titolo finestra con info paziente/esame
		finestra.document.title = infoPaziente + " / " + infoEsame;
	}
	catch(e){
		//alert("apriReferto - Error: " + e.description);
	}
}


// ***********************************
// creo livello con le informazioni
// dell'esame al suo interno
function createToolTip(textToAppend){
	
	var divInfoLayer
	var divInfoLayerInner
	var divInfoLayerShadow	
	var divGlobal
	
	var oggetto
	
	try{
		// prima devo controllare se già esiste in tal caso lo 
		// elimino
		oggetto = document.getElementById("infoGlobalLayer");
		if (oggetto){oggetto.parentNode.removeChild(oggetto);}
		divGlobal = document.createElement("DIV");
		divGlobal.id = "infoGlobalLayer";
		
		divInfoLayerInner = document.createElement("DIV");
		divInfoLayerInner.id = "infoInnerLayer";
		divInfoLayerInner.className = "boxInfoLayer-inner";	
		divInfoLayerInner.innerHTML = textToAppend;
		divInfoLayer = document.createElement("DIV");
		try{		divInfoLayer.title = ritornaJsMsg('tooltipInfoLayer');}catch(e){;}
		divInfoLayer.id = "infoLayer";
		divInfoLayer.className = "boxInfoLayer";
		divInfoLayer.appendChild(divInfoLayerInner);
//		divInfoLayer.style.visibility = "visible";
		divInfoLayer.onclick = function(){this.style.visibility = "hidden";document.getElementById("infoShadowLayer").style.visibility="hidden";}

		// shadow
		divInfoLayerShadow = document.createElement("DIV");
		divInfoLayerShadow.id = "infoShadowLayer";
		divInfoLayerShadow.className = "boxInfoLayerShadow";
		divGlobal.appendChild(divInfoLayer);
		divGlobal.appendChild(divInfoLayerShadow);
		document.body.appendChild(divGlobal);
	}
	catch(e){
		alert("createDivPatientListOfRoom " + e.description);
	}
}

function apriHtmlSR(accNum,sop,series,study){
	var sql;
	try{
		sql = "select html_sr from info_dicom_object ";
		sql += " where id_esame_dicom = '" + accNum + "'";
		sql += " and SOP_INSTANCE_UID = '" + sop + "'";
		sql += " and SERIES_INSTANCE_UID = '" + series + "'";
		sql += " and STUDY_INSTANCE_UID = '" + study + "'";
		// deprecato
		//sql += " and lingua ='" + baseUser.LINGUA +"'";
		getXMLData("",parseSql(sql),"processHtmlSR");	
	}
	catch(e){
		alert("apriHtml " + e.description);
	}
}


function processHtmlSR(xmlDoc){
// response
	
	var strTmp = "";
	var testoSR ;
	var rowTagObj;
	
	var finestra ;

	try{
		if (xmlDoc){
			// resetto tag 
			testoSR = getValueXmlTagViaXmlDoc(xmlDoc, "HTML_SR","@").split("@");
			if (testoSR!=""){
				finestra = window.open("","_blank","top=0, left =0, width=" + screen.availWidth + ", height="+ screen.availHeight + ", status=yes, scrollbars=auto");			
				finestra.document.write(testoSR);
				finestra.document.title = "Paziente:"+ infoPaziente + " - Esame: " + infoEsame;
			}
			else{			
				alert("Nessun testo");
			}
		}			
		
	}
	catch(e){
		alert("processHtmlSR parsing Error " + e.description)
	}
	
	
}

function setPositionToolTip(top,left){
	var altezzaDocumento = document.body.offsetHeight;	
	var larghezzaDocumento = document.body.offsetWidth;		
	var obj = document.getElementById("infoLayer");

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
			// posizionamento orizzontale
			if ((left+obj.scrollWidth)>larghezzaDocumento){
				if ((left-obj.scrollWidth)>0){
					posizioneLeft = document.body.scrollLeft+(left-obj.scrollWidth);
					}
				else{
					posizioneLeft = document.body.scrollLeft
				}
				
			}
			else{
				posizioneLeft = document.body.scrollLeft+left;
			}				
			// ******************************
			
			
			obj.style.left = posizioneLeft ;
			obj.style.top = posizioneTop;
		}
		// sposto anche l'ombra
		var objShadow = document.getElementById("infoShadowLayer");
		if (objShadow){
			objShadow.style.visibility = 'visible';		
			objShadow.style.position = "absolute";
			objShadow.style.left = parseInt(posizioneLeft+5);
			objShadow.style.top =  parseInt(posizioneTop+5);
		}
	}
	catch(e){
		alert("setPositionPatientListOfRoom " + e.description);
	}

}
