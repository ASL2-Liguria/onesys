//var hnd_attesa='';

/**
	Funzione richiamata all'onLoad della parte di ricerca di Ricerca Pazienti
*/
function caricamento()
{
	fillLabels(arrayLabelName,arrayLabelValue);
	document.getElementById("idcampo0").focus();
	tutto_schermo();

}

/**
	
*/
function raddoppia_apici(valore)
{
	var stringa = valore.replace('\'', '\'\'');
	return stringa;
}

/**
	

function apri_attesa()
{
	altezza = screen.height;
	largh 	= screen.width;
	hnd_attesa = window.open("classAttesa","wnd_attesa","left=" + (largh/2-300)+ " ,top=" + (altezza/2-100) +",width=300,height=170,statusbar=no");
}*/

/**
	

function chiudi_attesa()
{
	parent.RicPazRecordFrame.conta_record_trovati();
	
	if(hnd_attesa)
	{
		hnd_attesa.close();
	}
}*/

/**
	
*/
function chiudi()
{
	parent.opener.parent.worklistTopFrame.ricerca();
	parent.close();
}



function gestioneCDC()
{
	var doc = document.form_cdc;
	var win_cdc = null;
	
	doc.method = 'POST';
	doc.action = 'SL_GestFiltroCDC';
	doc.target = 'gest_cdc';
	
	doc.nome_funzione_applica.value = 'applica_wk_ricoverati()';
	doc.nome_funzione_chiudi.value = 'chiudi()';
	doc.tipo_cdc.value = '200';
	doc.hCdc.value = document.form_pag_ric.hcdc.value;
	
    win_cdc = window.open('', 'gest_cdc','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');
	if(win_cdc)
		win_cdc.focus();
	else
		win_cdc = window.open('', 'gest_cdc','width=1000,height=600, status=yes, top=10,left=10, scrollbars=yes');
	try
	{
			doc.submit();
	}
	catch(e)
	{
		alert('Non ha trovato il document');
	}
}