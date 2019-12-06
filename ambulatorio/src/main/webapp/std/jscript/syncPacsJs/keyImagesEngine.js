var altezzaLayerKeyImage = 80;
var urlForGettingThumbNails = "getimagefromdb?getThumb=yes";


var 	larghezzaRptControlBeforeResizing ="";
var		altezzaRptControlBeforeResizing = "";

var timeoutToCheckKeyImages = 2000;
var timerToCheckKeyImages 

var globalAeTitleWhereImgAre = "";
// JavaScript Document
// gli accNumber arrivano splittati
// da *
// callbackAfterRetrieving indica cosa fare dopo
function callRetrieveKeyImages(iden_anag, accNumber,callbackAfterRetrieving){

	var strAeTitle  = "";
	var idenEsaSelezionati = "";
	// getAeTitleToCall indica ove effettivamente si trova l'immagine!!!
	var strAeTitleWhereStored = "";
	var strAeTitleWhereRetrieving = "";
	var strIdenRef = "";
	
	if ((accNumber=="")||(iden_anag=="")){return;}
	try{
		// chiamo la funzione che tira giù
		// le immagini chiave e deve essere definita
		// pacs per pacs (NB in tab_ext_files avremo il js subordinato dalla classe Java
		// che verifica se caricare il file o meno)
		idenEsaSelezionati = getAllOptionCode('oEsa_Ref');
		strAeTitle = ritornaInfoEsame(idenEsaSelezionati, array_iden_esame,array_aetitle); 	
		// *******************************************************************		
		// *******************************************************************
		// passo come azione SHOWSTUDY anche se non è rilevante
		// lavoro sempre sul primo esame ipotizzando che siano tutti storati
		// nello stesso archivio
		// *******************************************************************
		// *******************************************************************
		strAeTitleWhereStored = getAeTitleWhereStored("SHOWSTUDY",accNumber.split("*")[0], strAeTitle.split("*")[0]);
		//alert("strAeTitleWhereStored: " + strAeTitleWhereStored);
//		alert("chiamo ajax");
		// devo "normalizzare" il numero di aetitle e di idenRef al numero
		// di esami per l'ipotesi suddetta, in quanto la classe java
		// prevede anche la possibilità che gli studi siano su archivi differenti
		// situazioni che per ora NON consideriamo
		for (var k=0; k < idenEsaSelezionati.split("*").length; k++){
			if (k==0){
				strIdenRef = classReferto.IDEN;
				
			}
			else{
				strIdenRef = strIdenRef + "*" + classReferto.IDEN;				
				
			}
		}
		strAeTitleWhereRetrieving = ""
		for (var j=0; j < idenEsaSelezionati.split("*").length; j++){
			if (j==0){
				strAeTitleWhereRetrieving = strAeTitleWhereStored;
			}
			else{
				strAeTitleWhereRetrieving += "*" + strAeTitleWhereStored ;				
			}
		}
		// setto variabile globale utile anche al calcolo della dose
		globalAeTitleWhereImgAre = strAeTitleWhereRetrieving
		// alert("strIdenRef: " + strIdenRef);
		// passo *tutti* gli accNum con il primo aetitle dove è stato trovato
		retrieveKeyImages(iden_anag, accNumber, strAeTitleWhereRetrieving, strIdenRef) ;
		//alert("qui")
	}
	catch(e){
		alert("callRetrieveKeyImages " + e.description);		
	}
	if (callbackAfterRetrieving==""){
		return;
	}
	else{
		try{
			eval(callbackAfterRetrieving);
		}
		catch(e){
			alert("callRetrieveKeyImages " + e.description);
		}
	}	
	

}


function callRetrieveKeyImagesAfterTimeout(iden_anag, accNumber,callbackAfterRetrieving){
	
	}

function AppendRow(srcTable){if(srcTable != null){return srcTable.insertRow();}else{alert("Error while creating table. Cause: Container Table is null!");}}

function AppendCell(srcRow){if(srcRow != null){return srcRow.insertCell();}else{alert("Error while creating table. Cause: Container row is null!");}}

// funzione che aggiunge la
// riga alla tabella tableSecondLayer
// e carica il div idDivKeyImages
function addRowForKeyImages(){
	
	var larghezzaRptControl = "";
	var altezzaRptControl = "";
	var oggetto 
	var myTR
	var myTD
	var divObject ;
	
		
	var objText


	try{
		oggetto = document.getElementById("tableSecondLayer");
		myTR = AppendRow(oggetto);
		myTR.id = "idRowKeyImages";
		myTD = AppendCell(myTR);	
		myTD.colSpan = 2;
		myTD.style.height = altezzaLayerKeyImage +"px";
		divObject =  document.createElement("DIV");
		divObject.id = "idDivKeyImages";
		divObject.innerHTML = "&nbsp;";
		
		myTD.appendChild(divObject);
		larghezzaRptControl = getReportControlWidth();
		altezzaRptControl =  getReportControlHeight();

		// salvo dimensioni originali
		larghezzaRptControlBeforeResizing = larghezzaRptControl;
		altezzaRptControlBeforeResizing = altezzaRptControl;
		altezzaRptControl = parseInt(altezzaRptControl) - parseInt(altezzaLayerKeyImage);
		//alert("altezzaRptControlBeforeResizing: " + altezzaRptControlBeforeResizing + "altezzaRptControl: "+ altezzaRptControl +" - altezzaLayerKeyImage: " + altezzaLayerKeyImage);

		try{
			setReportControlObjectSize (larghezzaRptControl, altezzaRptControl);	
		}
		catch(e){
			alert("addRowForKeyImages - Error resizing report control" + e.description);
		}
	}
	catch(e){
		alert("addRowForKeyImages - "+ e.description);
	}
	
}


// funzione che carica le keyimages all'interno
// della console 
// ****** ATTENZIONE ****
// se il flag baseGlobal.deleteDicomFileEachSign =S
// le immagini NON saranno su disco 
// bensi solo incapsulate all'interno del PDF
// vengono accettati in input
// gli accNum con carattere di split "*"
function loadKeyImagesInsideIFrameOnStartUp(accNum){
	//alert("Carico le keyimages dentro iframe");
	
	var sql = "";
	var lista ;
	var strWhere = "";
	
	if (accNum==""){return;}
	try{
		// verifico che ci siano delle immagini chiave associate
		// se esistono allora le carico
		lista = accNum.split("*");
		if (lista.length<1){return;}
		for (var i=0;i<lista.length;i++){
			if (strWhere ==""){
				strWhere += " id_esame_dicom='" + lista[i] + "'";			
			}
			else{
				strWhere += " OR id_esame_dicom='" + lista[i] + "'";
			}
		}
		sql = "select * from info_dicom_object where (" +strWhere +")";
		getXMLData("",parseSql(sql),"callbackLoadKeyImagesInsideIFrameOnStartUp");		
	}
	catch(e){
		alert("loadKeyImagesInsideIFrameOnStartUp - " + e.description);
	}
}


// funzione che viene chiamata in automatico
// dopo che sono state reperite le immagini chiave
function callbackLoadKeyImagesInsideIFrameOnStartUp(xmlDoc){
	var imagesURL = ""
	var sopInfo = "";
	var seriesInfo = "";
	var studyInfo = "";
	var listaURL;
	var listaAccNum 

	try{
		// 19/1/2010
		parent.frameBottomConsolle.caricaTab("idKeyImages");
		return;
		/*
		imagesURL = getValueXmlTagViaXmlDoc(xmlDoc, "IMAGE_URL","*");
		if (imagesURL==""){
			//alert("No keyimages")
			return;
		}*/
		sopInfo = getValueXmlTagViaXmlDoc(xmlDoc, "SOP_INSTANCE_UID","*");
		if (sopInfo==""){
			//alert("No keyimages")
			return;
		}		
		seriesInfo = getValueXmlTagViaXmlDoc(xmlDoc, "SERIES_INSTANCE_UID","*");
		studyInfo =  getValueXmlTagViaXmlDoc(xmlDoc, "STUDY_INSTANCE_UID","*");
		listaAccNum = getValueXmlTagViaXmlDoc(xmlDoc, "ID_ESAME_DICOM","*").split("*");
		if (listaAccNum.length>0){
			// aggiungo riga
			addRowForKeyImages();
			// chiamo funnzione che carica
			// la slideshow delle keyimages
			loadSlideShowKeyImages(listaAccNum, sopInfo.split("*"), seriesInfo.split("*"), studyInfo.split("*"));
		}
	}
	catch(e){
		alert("callbackLoadKeyImagesInsideIFrameOnStartUp - " + e.description);
	}
	
}


function removeLayerKeyImages(){
	
	var bolEsisteRigaKeyImages = false;
	var oggetto ;
	var altezzaRptControl ;
	// rimuovo la riga con le keyimages e le ricarico
	try{	
		oggetto = document.getElementById("idRowKeyImages");
		if (oggetto){
			bolEsisteRigaKeyImages = true
		}
		if (bolEsisteRigaKeyImages){
			removeElementById("idRowKeyImages");

			setReportControlObjectSize (larghezzaRptControlBeforeResizing, altezzaRptControlBeforeResizing);				
		}
	}
	catch(e){;}	
}

// tiro su le thumb
// attraverso il "servizio" getImageFromDb
function loadSlideShowKeyImages( listaAccNum, listaSop, listaSeries, listaStudy){
	var layerKeyImages 
	var imgObject 
	var aObject 
	var i = 0;
	var srcImmagine = "";
	
	
	try{
		layerKeyImages = document.getElementById("idDivKeyImages");
		if (layerKeyImages){
			for (i=0;i<listaSop.length;i++){
				imgObject = document.createElement("IMG");
				srcImmagine = urlForGettingThumbNails + "&accNum=" + listaAccNum[i] + "&sopUID=" + listaSop[i] +"&seriesUID=" + listaSeries[i] + "&studyUID=" + listaStudy[i];
//				alert(srcImmagine);
				imgObject.src = srcImmagine;
				// ATTENZIONE !! 
				// viene tirata su l'immagine intera 
				// quindi ridimensionata nel browser
				// prevedere job per creazione Thumbnails
				imgObject.width = "60";
				imgObject.height = "60";
				imgObject.className = "ThumbStyle";
				imgObject.style.borderWidth = "0";
				imgObject.alt = ritornaJsMsg("jsShowImg") + "\nAcc.Num: " + listaAccNum[i];
				aObject = document.createElement("A");
				// link per aprire semplicemente l'immagine
				//aObject.href = "javascript:var finestra = open('" + srcImmagine + "','cippalippa', 'status=no');if(finestra){finestra.focus();}else{finestra = open('" + srcImmagine + "','cippalippa', 'status=no');}";	
				if (pacsType==""){
					// stazione NON sincronizzata col pacs
					// apro visualizzatore di immagini
						aObject.href = "javascript:openViewerKeyImages(" + classReferto.IDEN + ")"
				}
				else{
					// stazione sincronizzata
					// dal momento che la funzione syncToPacs
					// agisce sugli esami
					aObject.href = "javascript:callKeyImageOnPacsFromConsole(\"" + listaAccNum[i] + "\");"
				}
				aObject.appendChild(imgObject);
				layerKeyImages.appendChild(aObject);
				imgObject = null;
				aObject = null;
			}
		}
		try{
			parent.opener.parent.parent.hideFrame.chiudi_attesa();			
		}
		catch(e){
		}
	}
	catch(e){
		alert("loadSlideShowKeyImages - " + e.description);
	}
	
	// test * caricare le immagini
	
}


function callKeyImageOnPacsFromConsole(accNum){
	
	var idenEsa = "";
	// deseleziono tutti gli esami del listbox
	deSelectAllElement("oEsa_Ref");
	//  tiro su esami.iden
	idenEsa = ritornaInfoEsame(accNum,array_id_esame_dicom, array_iden_esame);
	// seleziono solo l'esame  in oggetto
	selectOptionByValue("oEsa_Ref",idenEsa);
	// con solo l'esame  in oggetto selezionato
	// posso simulare la pressione del pulsante della sinc Pacs	
	syncToPacs(pacsType,"");
	
}
/*
var replyRetrieveKeyImages = function (returnValue){
	alert(returnValue);
}*/

function openViewerKeyImages(idenRef){
	//alert("idenRef: "+ idenRef);
	var handleViewer = window.open("viewerkeyimages?iden_ref=" + idenRef ,"","top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight +" , status=yes , scrollbars=yes, fullscreen = yes");
	if (handleViewer){
		handleViewer.focus();
	}
	else{
		handleViewer = window.open("viewerkeyimages?iden_ref=" + idenRef,"","top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight +" , status=yes , scrollbars=yes, fullscreen = yes");		
	}
}



// funzione che rimuove elemento html
// dalla pagina html
function removeElementById(elName) {
	var el = document.getElementById(elName);
	try{
		el.parentNode.removeChild(el);
	}
	catch(e){
		//alert("removeElementById - " + e.description);
	}
}
