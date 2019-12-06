/*Ripetizion esame*/
function ripeti_esame()
{
	var prenotato = stringa_codici(array_prenotato);
	var id = stringa_codici(array_iden_esame);
	var wRipeti = null;
	
	wRipeti = window.open('prenotazioneRipeti?iden_esame=' + id, 'wndripeti' , 'status = no, scrollbars = no, height = 230, width = 600, top = 150, left = 150');
	if(wRipeti)
	{
		wRipeti.focus();
	}
	else
	{
		wRipeti = window.open('prenotazioneRipeti?iden_esame=' + id, 'wndripeti' , 'status = no, scrollbars = no, height = 230, width = 600, top = 150, left = 150');
	}
}