function aggiorna()
{
	var da_data = document.opzioni.da_data.value;
	var a_data = document.opzioni.a_data.value;
	
	da_data = da_data.substring(6, 10) + da_data.substring(3, 5) + da_data.substring(0, 2);
	a_data = a_data.substring(6, 10) + a_data.substring(3, 5) + a_data.substring(0, 2);
	
	parent.frameElenco.document.location.replace('disabilitaMacchinaElenco?Hiden_sal=' + document.opzioni.selSala.value + '&Hiden_mac=' + document.opzioni.selMac.value + '&Hiden_are=' + document.opzioni.selArea.value + '&da_data=' + da_data + '&a_data=' + a_data + '&Hstato=' + document.opzioni.Hstato.value);
}