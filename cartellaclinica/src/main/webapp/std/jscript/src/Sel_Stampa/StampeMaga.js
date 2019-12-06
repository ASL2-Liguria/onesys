function stampa_lista()
{

	alert();
	var sf= '{VIEW_MG_ART_ELENCO.IDEN}>1'
			var finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTAART_STD&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0");
		
		if(finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra  = window.open('elabStampa?stampaFunzioneStampa=LISTAART_STD&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0");
		}
	}

