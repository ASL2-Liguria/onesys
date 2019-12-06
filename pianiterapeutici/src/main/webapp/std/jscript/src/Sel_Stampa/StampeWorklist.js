// JavaScript Document
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
	var sf= '{ESAMI.IDEN} in [' + idenAnag  + ']'

	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICEVUTA_PRENO_STD&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");

	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=RICEVUTA_PRENO_STD&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");
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

function stampa_lista()
{
if (array_iden_esame =='')
{
	alert ('Selezionare almeno un Esame')
	return
}

	var sf= '{VIEW_ETICHETTE.IDEN} in [' + array_iden_esame + ']'
			var finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTAWK_STD&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");

		if(finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTAWK_STD&stampaSelection=' + sf + '&stampaAnteprima=N'+"","","top=0,left=0");
		}
	}

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
//alert(baseGlobal.URI_REGISTRY);

//alert(call);

var myWin=window.open(UrlRepo+"?User=ImagoWeb&IdPatient="+variabili,"","toolbar=no, menubar=no, resizable=yes, height=" + altezza + ", width=" + largh +",top=0,left=0,status=yes");


}
