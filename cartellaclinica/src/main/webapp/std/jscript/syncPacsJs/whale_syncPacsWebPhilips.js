// JavaScript Document
// file Js che fa da "interfaccia"
// verso i pacs web
// AZIONI Possibili:
// SHOWSTUDY_STUDY
// SHOWSTUDY_PATIENT

//funzione che sincronizza l'esame
function syncStudyToPacs(pacsType,tipoPagina){
	var globalPacsIdPazDicom = "";
	var globalPacsIdEsameDicom = ""; 
	var repartoSorgente = "";	

	if (typeof tipoPagina!='undefined' && tipoPagina=='WK_ESAMI_IMMAGINI')
	{
		globalPacsIdPazDicom 	= stringa_codici(array_id_paz_dicom);
		globalPacsIdEsameDicom 	= stringa_codici(array_id_esame_dicom);
		
		if (!controlliPreVisualizImg(tipoPagina)){
			return;
		}
		
		performAction('WK_ESAMI_IMMAGINI',globalPacsIdPazDicom,globalPacsIdEsameDicom);
	}
	else
	{		
		setRiga();
		
		if (rigaSelezionataDalContextMenu==-1){
			iden_richiesta		= stringa_codici(array_iden);
			repartoSorgente		= stringa_codici(array_reparto_sorgente)
			globalPacsIdPazDicom= stringa_codici(array_id_paz_dicom);
		}else{
			iden_richiesta 		= array_iden[rigaSelezionataDalContextMenu];
			repartoSorgente		= array_reparto_sorgente[rigaSelezionataDalContextMenu];
			globalPacsIdPazDicom= array_id_paz_dicom[rigaSelezionataDalContextMenu];
		}
		
		if (!controlliPreVisualizImg()){
			return;
		}
	
		var statementFile = "OE_Richiesta.xml";
		var statementName = "pacs.retrieveIdEsameDicom";
		var parameters 	= [iden_richiesta];
		
		
		var vRs = top.executeQuery(statementFile,statementName,parameters);
		
		while(vRs.next()){
			globalPacsIdEsameDicom = vRs.getString("ID_ESAME_DICOM");
		}
		
		performAction(repartoSorgente,globalPacsIdPazDicom,globalPacsIdEsameDicom);
	}
	
}


function controlliPreVisualizImg(tipoPagina){
	
	var bolEsito = true;
	
	if (typeof tipoPagina!='undefined' && tipoPagina=='WK_ESAMI_IMMAGINI'){
		globalPacsIdPazDicom 	= stringa_codici(array_id_paz_dicom);
		iden_esame 				= stringa_codici(array_iden_esame);
		try{
			if(iden_esame.toString().indexOf('*') != '-1'){
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
	}else{
		setRiga();

		if (rigaSelezionataDalContextMenu==-1){
			iden_richiesta = stringa_codici(array_iden);
			globalPacsIdPazDicom = stringa_codici(array_id_paz_dicom).split("*")[0];
		}else{
			iden_richiesta = array_iden[rigaSelezionataDalContextMenu];
			globalPacsIdPazDicom = array_id_paz_dicom[rigaSelezionataDalContextMenu].split("*")[0];
		}
		
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
		
	}
	return bolEsito ;
	
}


function performAction(repartoSorgente,a_id_paz_dicom,a_id_esame_dicom){
	//imagoweb.configura_pc.url_ve : url del pacs philips
	var urlPhilipsPacs = basePC.URL_VE+'&acc='+ a_id_esame_dicom +'&mrn='+ a_id_paz_dicom;

	logAction(repartoSorgente,a_id_paz_dicom,a_id_esame_dicom);
	
	var wndIsite=window.open(urlPhilipsPacs);
	if (wndIsite)
	{
		wndIsite.focus();
	}
	else
	{
		wndIsite=window.open(urlPhilipsPacs);
	}

	
}


function logAction(repSorgente,a_id_paz_dicom,a_id_esame_dicom){
	dwr.engine.setAsync(false);
	dwrTraceUserAction.callTraceUserAction(repSorgente,'APRI PACS PHILIPS','','APERTURA PACS: ID_PAZ_DICOM:'+a_id_paz_dicom+' ESAME_DICOM:'+a_id_esame_dicom);
	dwr.engine.setAsync(true);
	
}

function visualizza_referto_ris()
{

	var firmato;
	var testo_referto;

	firmato = stringa_codici(array_firmato);
	testo_referto = stringa_codici(array_testo_referto);


	if (firmato =='N' || firmato=='')
	{
		alert("Esame non selezionato o referto non firmato");			
	}
	else
	{
		showDialog('Visualizza Referto',testo_referto,'success');
	}

}


function controllo_stato_richieste(stato_richiesta_necessario, label_alert){
	
	var stato;
	
	if (rigaSelezionataDalContextMenu==-1){
			stato =stringa_codici(array_stato);
		}else{
			stato = array_stato[rigaSelezionataDalContextMenu];
		}
	
	var errore = false;
	var stati = stato.split('*');
	
	for(var i = 0; i < stati.length; i++){
		if(stati[i].indexOf(stato_richiesta_necessario)<0 ){
			errore = true;
			alert('Attenzione: la richiesta deve essere nello ' +label_alert);
			i = stati.lenght;
		}
	}
	
	return errore;
}


