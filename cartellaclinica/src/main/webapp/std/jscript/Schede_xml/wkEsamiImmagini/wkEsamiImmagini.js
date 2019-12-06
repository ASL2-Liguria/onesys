

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

