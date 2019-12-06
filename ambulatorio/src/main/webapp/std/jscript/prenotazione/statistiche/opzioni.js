function cambia_cdc(cdc)
{
	document.opzioni.Hreparto.value = cdc;
}

function aggiorna()
{
	document.opzioni.Hreparto.value = document.opzioni.selCDC.value;
	document.opzioni.data.value = document.opzioni.txtdata.value.substr(6, 4) + document.opzioni.txtdata.value.substr(3,2) + document.opzioni.txtdata.value.substr(0,2);
	
	parent.frameGrafico.location.replace('statisticheGrafico?Hreparto=' + document.opzioni.Hreparto.value + '&data=' + document.opzioni.data.value);
}

function annulla_invio()
{
	if (window.event.keyCode==13)
	{
		window.event.returnValue=false;
		aggiorna();
	}
}