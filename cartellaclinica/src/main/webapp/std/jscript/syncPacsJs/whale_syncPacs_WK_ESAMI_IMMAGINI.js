//Lino
//JavaScript Document
//file Js permette di aprire le immagini presenti su polaris
//dalla nuova worklist WK_ESAMI_IMMAGINI
//AZIONI Possibili:
//SHOWSTUDY_STUDY 		(apre l'immagine associata all'id_esame_dicom)
//SHOWSTUDY_PATIENT 	(apre l'immagine associata all'id_esame_dicom)


var globalPacsAction= "";
var globalPacsIdPazDicom = "";
var globalNodeName = "";
var globalPacsIdEsameDicom = "";
var iden_whale="";
//funzione che ritorna l'iden di polaris

/*
Deve avvertire l'utente se non viene selezionato nessun paziente
 */
function ret_iden_anag(idenAnag,tipo_ricerca){

	if (tipo_ricerca == '2'){
		if(idenAnag.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + idenAnag);
			return;
		}
	}
	iden_whale = idenAnag;

	return iden_whale;
}


function retIdenPolaris(){
	var tipo_ricerca = document.form.ricerca_anagrafica.value;
	iden_remote_anag = stringa_codici(iden);


	if(tipo_ricerca == 2){
		dwr.engine.setAsync(false);
		CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, ret_iden_anag);
		dwr.engine.setAsync(true);
	}
	else
	{
		ret_iden_anag(iden_remote_anag,tipo_ricerca);
	}


	var nome; var cognome;
	var data; var tempdata;
	var ret;

	nome=stringa_codici(array_nome);
	nome=nome.replace(/'/gi,"''");
	cognome=stringa_codici(array_cognome);
	cognome=cognome.replace(/'/gi,"''");
	data=stringa_codici(array_data);
	if (nome==null || nome==''){
		alert('Selezionare un paziente');return;}
	else{
		tempdata=data.split('/')
		data=tempdata[2]+tempdata[1]+tempdata[0];
//		var finestra = window.open("servletGenerator?KEY_LEGAME=WK_ESAMI_IMMAGINI&WHERE_WK=" + escape("where cognome='"+ cognome +"' and nome like '"+ nome +"%' and data='"+data+"'") + "&HidenAnag="+iden_whale,"",'fullscreen=yes status=yes scrollbars=auto');		return ret;}
		var finestra = window.open("servletGenerator?KEY_LEGAME=WK_ESAMI_IMMAGINI&WHERE_WK=" + escape("where id_remoto='"+ stringa_codici(array_id_remoto) +"'") + "&HidenAnag="+iden_whale,"",'fullscreen=yes status=yes scrollbars=auto');		return ret;}
    try{
		top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){alert(e.description)}	 
}	

function syncPatientToPolaris(pacsType,additionalParameters){

	globalPacsIdPazDicom   	= stringa_codici(array_id_paz_dicom);
	if(globalPacsIdPazDicom=='') return alert("Effettuare una selezione");
	globalPacsIdEsameDicom 	= stringa_codici(array_id_esame_dicom);
	globalNodeName			= stringa_codici(array_node_name);
	globalPacsAction = "SHOWSTUDY_PATIENT";	

	componiUrl(globalPacsAction);
}

//funzione che sincronizza l'esame
function syncStudyToPolaris(pacsType,additionalParameters){

	globalPacsIdPazDicom   	= stringa_codici(array_id_paz_dicom);
	if (globalPacsIdPazDicom=='') {
		return alert("Effettuare una selezione");
	} 
	globalPacsIdEsameDicom 	= stringa_codici(array_id_esame_dicom);
	globalNodeName			= stringa_codici(array_node_name);
	globalPacsAction = "SHOWSTUDY_STUDY";

	componiUrl(globalPacsAction);
}

function controlliPreVisualizImg(){
	var bolEsito = true;
	try{
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

/*Composizione url delle immagini dell'esame o delle immagini del paziente */
function componiUrl(azione){
	var urlCareStreamVEToCall = "";
	var regEx = /\*/g;
	var strAccessionNumber="";	
	var patId = "";
	urlCareStreamVEToCall = basePC.URL_VE;
	strAccessionNumber = globalPacsIdEsameDicom.replace(regEx,"\\");
	patId = globalPacsIdPazDicom;				
	urlCareStreamVEToCall = urlCareStreamVEToCall + "&user_name=elco&password=elco";		
	//alert(urlCareStreamVEToCall)		
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
//	alert(urlCareStreamVEToCall);
	var hndMP = window.open(urlCareStreamVEToCall,"wndMP","top=0,left=0,width=500,height=500");
	if (hndMP){
		hndMP.focus();
	}
	else{
		hndMP = window.open(urlCareStreamVEToCall,"wndMP","top=0,left=0,width=500,height=500");
	}
}


function VisualizzaAnagLink(){
	var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA';

	var idenAnag = document.EXTERN.HidenAnag.value;


	var readOnly = 'S';
	var doc = document.form_scheda_anag;
	var varAnag = null;

	if(idenAnag == 0){
		alert(ritornaJsMsg('selezionare'));
		return;
	}

	/*if(readOnly == '')
    	readOnly = stringa_codici(readonly);
	 */
	url = url + "&IDEN_ANAG=" + idenAnag + "&READONLY=" + readOnly;	
	var finestra = window.open(url,"wndModificaAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	if (finestra) {
		finestra.focus();
	} else {
		finestra = window.open(url,"wndModificaAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	}
	try{
		top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}	
	return finestra;
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

function stampa(funzione,sf,anteprima,reparto,stampante){


	/*Setto direttamente la connessione a polaris*/
	var polaris_connection=baseGlobal.URL_PRENOTAZIONE;
	url =polaris_connection + '/ServletStampe?report=';

	if(reparto!=null && reparto!='')
		url += reparto+"/"+funzione;	
	if(sf!=null && sf!='')
		url += "&sf="+sf;

	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);

	if(finestra){ 
		finestra.focus();}
	else{
		var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
	try{
		top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}	
}


function visualizza_referto_firmato_ris()
{
	var firmato 	= stringa_codici(array_firmato);
	var progr		= stringa_codici(array_progr);
	var iden_esame	= stringa_codici(array_iden_esame);
	if (firmato =='N' || firmato=='')
	{
		alert("Esame non selezionato o referto non firmato");			
	}else
	{
		apriPdfSuPolaris(iden_esame,progr);	
	}

}

function apriPdfSuPolaris(iden_esame,progr)
{
	var url = "ApriPDFfromDB?db=POLARIS&progr="+progr+"&idenVersione=" + iden_esame + "&AbsolutePath="+baseGlobal.URL_PRENOTAZIONE;
	window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	try{
		top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}	
}

