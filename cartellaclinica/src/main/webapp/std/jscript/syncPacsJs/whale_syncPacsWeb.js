// JavaScript Document
// file Js che fa da "interfaccia"
// verso i pacs web
// AZIONI Possibili:
// SHOWSTUDY_STUDY
// SHOWSTUDY_PATIENT


var globalPacsAction= "";
var globalPacsIdPazDicom = "";
var globalNodeName = "";
var globalPacsIdEsameDicom = "";

// funzione che sincronizza il paziente
function syncPatientToPacs(pacsType,additionalParameters){
	var id_paz_dicom = "";
	var sql = "";
	
	setRiga();

	if (rigaSelezionataDalContextMenu==-1){
		iden_richiesta = stringa_codici(array_iden);
		globalPacsIdPazDicom = stringa_codici(array_id_paz_dicom).split("*")[0];
	}else{
		iden_richiesta = array_iden[rigaSelezionataDalContextMenu];
		globalPacsIdPazDicom = array_id_paz_dicom[rigaSelezionataDalContextMenu].split("*")[0];
	}
	
	globalPacsAction = "SHOWSTUDY_PATIENT";
	
	if (!controlliPreVisualizImg()){
		return;
	}
	
	//sql = "select infoweb.dettaglio_richieste.id_esame_dicom,  infoweb.dettaglio_richieste.aetitle,  infoweb.dettaglio_richieste.node_name from  infoweb.testata_richieste left outer join infoweb.dettaglio_richieste on (infoweb.dettaglio_richieste.iden_testata = infoweb.testata_richieste.iden) where  infoweb.testata_richieste.iden = " + iden_richiesta;
	sql = 	"select infoweb.dettaglio_richieste.id_esame_dicom,  infoweb.tab_aetitle.descr aetitle,  infoweb.tab_aetitle.node_name ";
	sql += 	"from infoweb.testata_richieste left join infoweb.dettaglio_richieste on (infoweb.dettaglio_richieste.iden_testata = infoweb.testata_richieste.iden) ";
	sql += 	"left join infoweb.tab_aetitle on (infoweb.dettaglio_richieste.iden_aetitle = infoweb.tab_aetitle.iden) ";
	sql += 	"where  infoweb.testata_richieste.iden = " + iden_richiesta;
	
	getXMLData("",parseSql(sql),"callbackSyncToPacs");		
}

// funzione che sincronizza l'esame
function syncStudyToPacs(pacsType,additionalParameters){

	setRiga();

	if (rigaSelezionataDalContextMenu==-1){
		iden_richiesta = stringa_codici(array_iden);
		globalPacsIdPazDicom = stringa_codici(array_id_paz_dicom).split("*")[0];
	}else{
		iden_richiesta = array_iden[rigaSelezionataDalContextMenu];
		globalPacsIdPazDicom = array_id_paz_dicom[rigaSelezionataDalContextMenu].split("*")[0];
	}
	
	globalPacsAction = "SHOWSTUDY_STUDY";
	
	if (!controlliPreVisualizImg()){
		return;
	}
	
	sql = "select infoweb.dettaglio_richieste.id_esame_dicom,  infoweb.tab_aetitle.descr aetitle,  infoweb.tab_aetitle.node_name ";
	sql += "from infoweb.testata_richieste left join infoweb.dettaglio_richieste on (infoweb.dettaglio_richieste.iden_testata = infoweb.testata_richieste.iden) ";
	sql += "left join infoweb.tab_aetitle on (infoweb.dettaglio_richieste.iden_aetitle = infoweb.tab_aetitle.iden) ";
	sql += "where  infoweb.testata_richieste.iden = " + iden_richiesta;
	
	//if (baseUser.LOGIN=='usrradiologi')alert(parseSql(sql));
	getXMLData("",parseSql(sql),"callbackSyncToPacs");		
}

function controlliPreVisualizImg(){
	
	var bolEsito = true;
	
	setRiga();

	if (rigaSelezionataDalContextMenu==-1){
		iden_richiesta = stringa_codici(array_iden);
		globalPacsIdPazDicom = stringa_codici(array_id_paz_dicom).split("*")[0];
	}else{
		iden_richiesta = array_iden[rigaSelezionataDalContextMenu];
		globalPacsIdPazDicom = array_id_paz_dicom[rigaSelezionataDalContextMenu].split("*")[0];
	}
	
	//alert(iden_richiesta + '\n' + globalNodeName);
	
	try{
		if(iden_richiesta.toString().indexOf('*') != '-1'){
			alert('Attenzione: selezionare una sola prenotazione/richiesta');
			return false;
		}	
		if(controllo_stato_richieste('R', 'stato refertato')){	
			// mi fermo
			return false;
		}
		if (globalPacsIdPazDicom==""){
			alert("Id paziente nullo, impossibile continuare.");
			return false;	
		}
	}
	catch(e){
		alert("controlliPreVisualizImg - Error: " + e.description);
		return false;
	}
	return bolEsito ;
	
}
function callbackSyncToPacs(xmlDoc){

	var strTmp = "";
	
	try{
		globalPacsIdEsameDicom = getValueXmlTagViaXmlDoc(xmlDoc, "ID_ESAME_DICOM","*");	
		globalNodeName = getValueXmlTagViaXmlDoc(xmlDoc, "NODE_NAME","*");
		globalNodeName  = globalNodeName.split("*")[0];
		performAction(globalPacsAction);
	}
	catch(e){
		alert("callbackSyncToPacs - Error: " + e.description);
	}
}


function performAction(azione){
	
	var urlCareStreamVEToCall = "";
	var regEx = /\*/g;
	var strAccessionNumber="";	
	var patId = "";


	urlCareStreamVEToCall = basePC.URL_VE;
	strAccessionNumber = globalPacsIdEsameDicom.replace(regEx,"\\");
	patId = globalPacsIdPazDicom;				
	//urlCareStreamVEToCall = urlCareStreamVEToCall + "&user_name=service";
	//urlCareStreamVEToCall = urlCareStreamVEToCall + "&password=service";
	// decommentare le righe sottostanti 
	// e commentare le 2 precedenti se si vuole
	// usare l'utente in quel momento autenticato
	//alert(top.opener.parent.parent.hideFrame.pwdDecrypted);
/*	urlCareStreamVEToCall = urlCareStreamVEToCall + "&user_name=" + baseUser.LOGIN;
	if(top.name=='schedaRicovero'){
		urlCareStreamVEToCall = urlCareStreamVEToCall + "&password=" + top.opener.parent.parent.hideFrame.pwdDecrypted;
	}else{
		urlCareStreamVEToCall = urlCareStreamVEToCall + "&password=" + parent.parent.hideFrame.pwdDecrypted;	
	}
	*/
	urlCareStreamVEToCall = urlCareStreamVEToCall + "&user_name=elco";
	if(top.name=='schedaRicovero'){
		urlCareStreamVEToCall = urlCareStreamVEToCall + "&password=elco";
	}else{
		urlCareStreamVEToCall = urlCareStreamVEToCall + "&password=elco";	
	}	
	
	
	//alert(objUtente);
	//alert(parent.parent.hideFrame.pwdDecrypted);
	//urlCareStreamVEToCall = urlCareStreamVEToCall + "?user_name="+ objUtente.LOGIN;
	//urlCareStreamVEToCall = urlCareStreamVEToCall + "&password="+ objUtente.PWD;
	
	switch (azione)
	{
		case "SHOWSTUDY_PATIENT":
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&patient_id="+ patId;
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&server_name="+ globalNodeName;				
			// in questo caso NON posso avere il node_name....
			break;
		case "SHOWSTUDY_STUDY":
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&patient_id="+ patId;					
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&accession_number="+ strAccessionNumber;
			urlCareStreamVEToCall = urlCareStreamVEToCall + "&server_name="+ globalNodeName;
			break;
		default:
			return;
	}	
	//alert(urlCareStreamVEToCall);
	var hndMP = window.open(urlCareStreamVEToCall,"wndMP","top=0,left=0,width=500,height=500");
	if (hndMP){
		hndMP.focus();
	}else{
		hndMP = window.open(urlCareStreamVEToCall,"wndMP","top=0,left=0,width=500,height=500");
	}
	
	/*
	var handle_medisurf = "";
	var tentativi = 0;	
	while ((handle_medisurf=="")&&(tentativi<100)){
		handle_medisurf = parent.parent.hideFrame.document.clsKillHome.getHandle("http://" + basePC.URL_VE.split("/")[2],true);
		tentativi++;
	}
	if (handle_medisurf!=""){
		parent.parent.hideFrame.document.clsKillHome.hideWindow("",handle_medisurf,true)
	}	
	*/
	
}

