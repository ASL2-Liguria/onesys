//JavaScript Document
var UrlRepo="";
function StampaPren()
{
	var idenAnag = stringa_codici(array_iden_esame);
	if (idenAnag=='')
	{
		alert ('Selezionare un Esame')
		return
	}

	try
	{
		idenAnag=idenAnag.replace(/\*/g, ",");
	}
	catch(ex)
	{
	}
	var sf= '{ESAMI.IDEN} in [' + idenAnag  + ']';
	var reparto = stringa_codici(array_reparto);
	
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICEVUTA_PRENO_STD&stampaSelection=' + sf + '&stampaReparto=' + reparto + '&stampaAnteprima=N'+"","","top=0,left=0");

	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=RICEVUTA_PRENO_STD&stampaSelection=' + sf + '&stampaReparto=' + reparto + '&stampaAnteprima=N'+"","","top=0,left=0");
	}
}

function stampaRitiro()
{

	aa=SceltaStampa.SelectReparto("RICEVUTA_STD*",step2);


}


function step2(ret){
	arrErr=ret.split("*")

	var iden=stringa_codici(array_iden_esame);

	if (arrErr[0]=='NO')
	{
		var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICEVUTA_STD&stampaIdenEsame=' + iden + '&stampaAnteprima=N'+"","","top=0,left=0");

		if(finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra  = window.open('elabStampa?stampaFunzioneStampa=RICEVUTA_STD&stampaIdenEsame=' + iden + '&stampaAnteprima=N'+"","","top=0,left=0");
		}
	}
	else
	{
		if (arrErr[0]=='KO')
		{
			alert(arrErr[1])
		}
		else
		{
			var myObject = new Object();
			myObject.arrRep = arrErr[1];
			myObject.defRep= stringa_codici(array_reparto);
			var reparto=null;
			reparto=window.showModalDialog('scelta_repato.html' ,myObject,'center:1;dialogHeight:110px;dialogWidth:480px;status:0');
			if (reparto==null || reparto =="")
				return;

			var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICEVUTA_STD&stampaIdenEsame=' + iden + '&stampaAnteprima=N&stampaReparto='+ reparto,"","top=0,left=0");

			if(finestra)
			{
				finestra.focus();
			}
			else
			{
				var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICEVUTA_STD&stampaIdenEsame=' + iden + '&stampaAnteprima=N&stampaReparto='+ reparto,"","top=0,left=0");
			}
		}

	}
}



// modifica 22-7-16
function stampa_lista()
{
	var altezza = screen.availHeight;
	var largh = screen.availWidth;

	if (array_iden_esame =='')
	{
		alert ('Selezionare almeno un Esame')
		return
	}

	var selCdc = parent.worklistTopFrame.$("#td_cdc").html();
	selCdc = selCdc.replace(/ /g, '');
//	alert(selCdc);
	if (selCdc.split(",").length>1){
		alert("Prego filtrare per una sola unit\u00E0 erogante (Cdc).");
		return;
	}
		
	var sf= '{VIEW_ETICHETTE.IDEN} in [' + array_iden_esame + ']'
	var cdcFolder = "&stampaReparto=" + selCdc;
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTAWK_STD&stampaSelection=' + sf + '&stampaAnteprima=S'+ cdcFolder +"","","toolbar=no, menubar=no, resizable=yes, height=" + altezza + ", width=" + largh +",top=0,left=0,status=yes");
	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTAWK_STD&stampaSelection=' + sf + '&stampaAnteprima=S'+ cdcFolder +"","","toolbar=no, menubar=no, resizable=yes, height=" + altezza + ", width=" + largh +",top=0,left=0,status=yes");

	}
}
// ***** fine modifica 22-7-16

function VisualRepo(){

	dwrRepository.dwrGetUrlRepo("RADIO",VisualRepo2);
}

function VisualRepo2(urlReo){
	UrlRepo=urlReo;
	try{
		var idenAnag = stringa_codici(array_iden_anag);
	}
	catch (e)
	{
		var idenAnag = stringa_codici(iden);
	}
	dwrRepository.dwrGetIdenRemoto(idenAnag,VisualRepo3);
}

function VisualRepo3(variabili){
	var altezza = screen.availHeight;
	var largh = screen.availWidth;
//	alert(baseGlobal.URI_REGISTRY);

//	alert(call);

	var myWin=window.open(UrlRepo+"?User=ImagoWeb&IdPatient="+variabili,"","toolbar=no, menubar=no, resizable=yes, height=" + altezza + ", width=" + largh +",top=0,left=0,status=yes");


}


function cancella_versione()
{
	var iden_to_ann=stringa_codici(array_iden_ref).toString();
	if (iden_to_ann.length<1)
	{
		alert('Selezionare almeno un esame')
		return;
	}
	if (iden_to_ann.indexOf('*')>0)
	{
		alert('Selezionare un solo esame')
		return;
	}
	var continua = confirm("Si sta per cancellare definitivamente l'esame e il referto associato. Si vuole continuare?")
	if (continua)
	{

		motivo=window.showModalDialog('motivo_cref.html','','center:1;dialogHeight:110px;dialogWidth:480px;status:0');
		functionDwr.launch_sp('SP_CANCELLA_VERSIONE@IString#IString#IString@' + iden_to_ann + '#' + baseUser.IDEN_PER+'#'+motivo, risposta_cancella_versione);// + '@O#S', risposta_cancella_versione);
	}
}

function risposta_cancella_versione(risp)
{
	aggiorna();
}

function rigenera_versione()
{
	var iden_to_ann=stringa_codici(array_iden_ref).toString();
	if (iden_to_ann.length<1)
	{
		alert('Selezionare almeno un esame')
		return;
	}
	if (iden_to_ann.indexOf('*')>0)
	{
		alert('Selezionare un solo esame')
		return;
	}
	var fi_s_n=stringa_codici(array_firmato);
	if (fi_s_n!='S')
	{
		alert('Selezionare un esame validato')
		return;

	}

	var continua = confirm("Si desidera rigenerare il pdf e creare una nuova versione?")
	if (continua)
	{
		functionDwr.launch_sp('SP_RIGENERA_REFERTO@IString#IString@' + iden_to_ann + '#' + baseUser.IDEN_PER, rigenera_versione_call);// + '@O#S', risposta_cancella_versione);
	}
}

function rigenera_versione_call(risp)
{

	aggiorna();
}

function EseguiVerificaRfid()
{
	var idenEsame = stringa_codici(array_iden_esame);
	idenEsame=idenEsame.toString();
	if (idenEsame=='')
	{
		alert ('Selezionare un Esame')
		return
	}
	/*if (idenEsame.indexOf('*')>0)
{
        alert ('Selezionare un Esame')
	return
}*/

	idenEsame=idenEsame.replace(/\*/g,',');

	var finestra  = window.open('SrvRFID?hiden_Esame=' + idenEsame +"","","top=0,left=0");

	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open('SrvRFID?hiden_Esame=' + idenEsame +"","","top=0,left=0");
	}
}

function ModificaImmaginiEsami()
{
	var idenEsame = stringa_codici(array_iden_esame);
	idenEsame=idenEsame.toString();
	if (idenEsame=='')
	{
		alert ('Selezionare un Esame')
		return
	}
	if (idenEsame.indexOf('*')>0)
	{
		alert ('Selezionare un Esame')
		return
	}

	var finestra  = window.open('SrvImmaginiEsame?hiden_Esame=' + idenEsame +"","","top=0,left=0");

	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open('SrvImmaginiEsame?hiden_Esame=' + idenEsame +"","","top=0,left=0");
	}
}

function cancella_versione()
{
	var iden_to_ann=stringa_codici(array_iden_ref).toString();
	if (iden_to_ann.length<1)
	{
		alert('Selezionare almeno un esame')
		return;
	}
	if (iden_to_ann.indexOf('*')>0)
	{
		alert('Selezionare un solo esame')
		return;
	}
	var continua = confirm("Si sta per cancellare definitivamente l'esame e il referto associato. Si vuole continuare?")
	if (continua)
	{

		motivo=window.showModalDialog('motivo_cref.html','','center:1;dialogHeight:110px;dialogWidth:480px;status:0');
		functionDwr.launch_sp('SP_CANCELLA_VERSIONE@IString#IString#IString@' + iden_to_ann + '#' + baseUser.IDEN_PER+'#'+motivo, risposta_cancella_versione);// + '@O#S', risposta_cancella_versione);
	}
}

function risposta_cancella_versione(risp)
{
	aggiorna();
}

function set_referto_oscurato(valore)
{
	var iden_to_ann=stringa_codici(array_iden_esame).toString();

	if (iden_to_ann.length<1)
	{
		alert('Selezionare almeno un esame')
		return;
	}
	if (iden_to_ann.indexOf('*')>0)
	{
		alert('Selezionare un solo esame')
		return;
	}

	var stato_now=stringa_codici(array_consenso).toString();
	var to_upd='N';
	if (stato_now=='' || stato_now=='S')
	{
		var continua = confirm("L'esame sta per essere marcato da NON inviare a " + valore + ", continuare?")
		to_upd='N';
	}
	else
	{
		var continua = confirm("L'esame sta per essere marcato da inviare a " + valore + ", continuare?")
		to_upd='S';
	}
	if (continua)
	{

		//  motivo=window.showModalDialog('motivo_cref.html','','center:1;dialogHeight:110px;dialogWidth:480px;status:0');
		functionDwr.launch_sp('Sp_marca_non_inviare@IString#IString#IString#IString@' + iden_to_ann + '#' + baseUser.LOGIN+'#'+to_upd+'#'+valore, risposta_marca_non_inviare);// + '@O#S', risposta_cancella_versione);
	}
}

function risposta_marca_non_inviare(risp)
{

	aggiorna();
}


function set_paziente_non_presentato(valore)
{
	var iden_to_ann=stringa_codici(array_iden_esame).toString();

	if (iden_to_ann.length<1)
	{
		alert('Selezionare almeno un esame')
		return;
	}
	if (iden_to_ann.indexOf('*')>0)
	{
		alert('Selezionare un solo esame')
		return;
	}

	var stato_now=stringa_codici(array_np).toString();
	var to_upd='N';
	if (stato_now=='' || stato_now=='S')
	{
		var continua = confirm("Si sta per marcare l'esame come 'Paziente non Presentato' , continare?")
		to_upd='S';
	}
	else
	{
		var continua = confirm("Si sta per levare la spunta 'Paziente non Presentato', continuare?")
		to_upd='N';
	}
	if (continua)
	{

		motivo=window.showModalDialog('motivo_cref.html','','center:1;dialogHeight:110px;dialogWidth:480px;status:0');
		functionDwr.launch_sp('Sp_paziente_np@IString#IString#IString#IString@' + iden_to_ann + '#' + baseUser.LOGIN+'#'+to_upd+'#'+motivo, risposta_marca_non_inviare);// + '@O#S', risposta_cancella_versione);
	}
}
function changeEquipe()
{
	var iden_to_chg=stringa_codici(array_iden_sal).toString();

	if (iden_to_chg.length<1)
	{
		alert('Selezionare almeno un esame')
		return;
	}
	if (iden_to_chg.indexOf('*')>0)
	{
		alert('Selezionare un solo esame')
		return;
	}
	var finestra  = window.open('ServletTabPerSal?IDEN_SAL='+ iden_to_chg ,"","top=0,left=0");

}



/*Tasto destro con la funzione LISTA WK VITRO per avere la stampa delle liste lavoro esami vitro ordinati per N. turno 
 */
function stampa_lista_vitro()
{
	if (array_iden_esame =='')
	{
		alert ('Selezionare almeno un Esame')
		return
	}

	var sf= '{VIEW_ETICHETTE.IDEN} in [' + array_iden_esame + ']'
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTAWK_STD_VITRO&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");

	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTAWK_STD_VITRO&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");
	}
}



/*Tasto destro con la funzione LISTA WK TRACCIATO per avere la stampa delle liste per la norma di buona preparazione del radiofarmaco 
 */
function stampa_lista_tracciato()
{
	if (array_iden_esame =='')
	{
		alert ('Selezionare almeno un Esame')
		return
	}

	var sf= '{VIEW_ETICHETTE.IDEN} in [' + array_iden_esame + ']'
	var finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTAWK_STD_TRACCIATO&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0");

	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTAWK_STD_TRACCIATO&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0");
	}
}


function StampaMammo()
{
	var idenAnag = stringa_codici(array_iden_esame).toString();
	if (idenAnag=='')
	{
		alert ('Selezionare un Esame')
		return
	}

	if (idenAnag.indexOf('*')>0)
	{
		alert('Selezionare un solo esame')
		return;
	}
	var strutt=stringa_codici(array_scheda_appropriatezza)

	if (strutt!='TAB_APP_SCREEN' )
	{
		alert('Selezionare un esame mammografico')
		return;
	}
	var refertato_iden=stringa_codici(array_iden_ref)

	if (refertato_iden<1)
	{
		alert('Selezionare un esame refertato')
		return;
	}

	var sf= '{ESAMI.IDEN} = ' + idenAnag

	var finestra  = window.open('elabStampa?stampaFunzioneStampa=MAMMO_STD&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");

	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=MAMMO_STD&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");
	}
}