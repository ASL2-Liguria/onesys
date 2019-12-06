// JavaScript Document
// file Js che fa da "interfaccia"
// verso i pacs web
// AZIONI Possibili:
// SHOWSTUDY_STUDY
// SHOWSTUDY_PATIENT

var globalUtente 
var globalStudio 
var globalAzione = ""


function sendToWebPacs(azione, objUtente, objStudio, additionalParameters){

	var regEx = /\*/g;
	var strAccessionNumber = objStudio.ACCNUM.replace(regEx,"\\");
	var strAetitle = objStudio.AETITLE.split("*")[0];
	
	globalAzione = azione;
	if (azione == "SHOWSTUDY_STUDY"){
		// prima cosa da fare è verificare dove andare a prendere le immagini
		// quindi devo interrogare l'archivio systemv per sapere l'aetitle
		// per far ciò chiamo checkNumImagesOnCareStreamEngine
		globalUtente = objUtente;
		globalStudio = objStudio;
//		alert("acc.num  " + strAccessionNumber + "@@" + strAetitle);
		callRetrieveImgNumber (azione, strAccessionNumber, strAetitle);
	}
	else{
		// paziente
		globalUtente = objUtente;		
		globalStudio = objStudio;
		myCallGetNodeNameByIdenAeTitle(basePC.IDEN_AETITLE_VE);
//		performAction (azione, objUtente, objStudio, additionalParameters);
	}
}



function openCheckAetile(azione, basePacsStudy){
	var regEx = /\*/g;

	strAccessionNumber = basePacsStudy.ACCNUM.replace(regEx,"\\");
	strAetitle = basePacsStudy.AETITLE.split("*")[0];
	datiDaMandare = "?aetitle_esame=" + strAetitle;
	datiDaMandare = datiDaMandare + "&accnum="+strAccessionNumber;
	datiDaMandare = datiDaMandare + "&azione="+azione;
	var wndCheckDbSystemV = window.open("checkNumImagesOnCareStream" + datiDaMandare,"wndCheckDbSystemV","top=60000,left=60000,width=600,height=600,statusbar=yes");
	if (wndCheckDbSystemV){
		wndCheckDbSystemV.focus();
	}
	else{
		wndCheckDbSystemV = window.open("checkNumImagesOnCareStream" + datiDaMandare,"wndCheckDbSystemV","top=60000,left=60000,width=600,height=600,statusbar=yes");
	}
	
}


// questa funzione viene chiamata come callback
// da checkNumImagesOnCareStreamEngine
//
// ******** ATTENZIONE ********
// verificare i corretti parametri da passare a VE
// ******** ATTENZIONE ********
// verificare differenze chiamate tra studio e paziente
// ******** ATTENZIONE ********
// l'integrazione tra ImagoWard e VE
// era stata sviluppata con un controllo sulla
// differenza di aetitle richiamati (consecutivamente)
// in tal caso si forzava (kill processo) la chiusura di VE
// NON lo implemento (forse) il baco è stato corretto
function performAction(azione,objUtente, objStudio, additionalParameter){
	
	var urlCareStreamVEToCall = "";
	var regEx = /\*/g;
	var strAccessionNumber="";	
	var patId = "";

	//alert("performAction " + azione);
	urlCareStreamVEToCall = basePC.URL_VE;
	strAccessionNumber = objStudio.ACCNUM.replace(regEx,"\\");
	patId = objStudio.PATID;				
	// attenzione cablo utente service *solo* per Lagosanto
	// dove avranno il WX !!!! e non, per ora, il VE !!!
	// implemtare 2 campi per l'uso
	// dell'utente generico
	// con specificati utente / password
	urlCareStreamVEToCall = urlCareStreamVEToCall + "&user_name=service"
	urlCareStreamVEToCall = urlCareStreamVEToCall + "&password=service";
	switch (azione)
	{
		case "SHOWSTUDY_PATIENT":
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&patient_id="+ patId;
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&server_name="+ objStudio.NODE_NAME;				
			// in questo caso NON posso avere il node_name....
			break;
		case "SHOWSTUDY_STUDY":
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&patient_id="+ patId;		
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&accession_number="+ strAccessionNumber;
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&server_name="+ objStudio.NODE_NAME;									
			break;
		default:
			return;
	}	
	//alert(urlCareStreamVEToCall);
	var hndMP = window.open(urlCareStreamVEToCall,"wndMP","top=0,left=0,width=500,height=500");
	if (hndMP){
		hndMP.focus();
	}
	else{
		hndMP = window.open(urlCareStreamVEToCall,"wndMP","top=0,left=0,width=500,height=500");
	}

	var handle_medisurf = "";
	var tentativi = 0;

	while ((handle_medisurf=="")&&(tentativi<100)){
		if (baseGlobal.USAOCXKILLHOME=="S"){		
			handle_medisurf = parent.parent.hideFrame.document.clsKillHome.getHandle("http://" + basePC.URL_VE.split("/")[2],true);
		}
		else{
			handle_medisurf = parent.parent.hideFrame.clsKillHomeJsObject.getHandle("http://" + basePC.URL_VE.split("/")[2],true);			
		}
		tentativi++;
	}
	if (handle_medisurf!=""){
		if (baseGlobal.USAOCXKILLHOME=="S"){			
			parent.parent.hideFrame.document.clsKillHome.hideWindow("",handle_medisurf,true);
		}
		else{
			parent.parent.hideFrame.clsKillHomeJsObject.hideWindow("",handle_medisurf,true);			
		}
	}	
	
}


// ************************************************************
// ************************ AJAX ******************************
// ************************************************************
function callRetrieveImgNumber(azione, accessionNumber,aetitleTarget){

	if (accessionNumber==""){return;}
	try{
		ajaxRetrieveImgNumber.getAeTitleToCall(azione, accessionNumber,aetitleTarget,replyRetrieveImgNumber);
	}
	catch(e){
		alert("callRetrieveImgNumber - " + e.description)
	}
}

// funzione di callback

var replyRetrieveImgNumber = function (returnValue){
	
	var aetitleToCall = "";
	var numImg = "";
	var azione = "";
	var node_name = "";

//alert("back");
	if (returnValue==""){return ;}
	//alert(" callRetrieveImgNumber retrieveValue:" + returnValue);
	try{
		azione= returnValue.toString().split('*')[0];
		numImg = returnValue.toString().split('*')[1];
		aetitleToCall = returnValue.toString().split('*')[2];
		node_name = returnValue.toString().split('*')[3];
		// rimappo info dello studio
		globalStudio.AETITLE = aetitleToCall;
		globalStudio.NODE_NAME = node_name;
		
		// **************
		performAction (azione, globalUtente, globalStudio, "")
		// azzero variabili
		globalUtente = null;
		globalStudio = null;		
	}
	catch(e){
		alert("replyRetrieveImgNumber - " + e.description);
	}
	
}
// ************************************************************

function myCallGetNodeNameByIdenAeTitle(idenAetitleTarget){


	if (idenAetitleTarget==""){
		alert("Can't continue: aeTitle target null.");
		return;
	}
	try{
		ajaxRetrieveImgNumber.callGetNodeNameByIdenAeTitle(idenAetitleTarget,replyGetNodeName);
	}
	catch(e){
		alert("callGetNodeName - " + e.description)
	}
	
}

var replyGetNodeName = function (returnValue){
	try{
		if (returnValue==""){return;}
		globalStudio.NODE_NAME = returnValue;
		performAction (globalAzione, globalUtente, globalStudio, "");
		// azzero variabili
		globalUtente = null;
		globalStudio = null;		
	}
	catch(e){
		alert("replyGetNodeName - " + e.description);
	}
	
}