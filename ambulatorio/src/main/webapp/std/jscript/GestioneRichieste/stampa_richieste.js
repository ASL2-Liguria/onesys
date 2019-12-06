function stampa_richieste()
{
	var idenAnag = stringa_codici(iden_worklist) + '';
	idenAnag=idenAnag.replace(/\*/g, ",");
if (idenAnag=='')
{
	alert('Selezionare una Richiesta')
	return;
}
	var sf= '{VIEW_VIS_RICHIESTA.IDEN_TESTATA} in [' + idenAnag  + ']'

	var finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_STD&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0");
	
	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open('elabStampa?stampaFunzioneStampa=RICHIESTA_STD&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0");
	}
}

function stampa_lista_richieste()
{
	var urlStampa="";
	var idenTestate = iden_worklist;
	if (idenTestate=='')
	{
		alert('Selezionare una Richiesta')
		return;
	}
	var sf= '{VIEW_AMB_RICHIESTE_WORKLIST.IDEN} in [' + idenTestate  + ']'
	urlStampa = "elabStampa?stampaFunzioneStampa=LL_RICH&stampaSelection=" + sf + "&stampaAnteprima=S";
	urlStampa += "&stampaReparto=LL_RICH";
	var finestra  = window.open(urlStampa,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	if(finestra)
	{		finestra.focus();	}
	else
	{		finestra  = window.open(urlStampa,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);}
}

