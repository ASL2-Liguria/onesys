
function setInizio()
{
	document.form_ins_motivazione.motivo_cancellazione.focus();
}

function inserisciMotivazione(){

	if(document.form_ins_motivazione.motivo_cancellazione.value==''){
	alert('Attenzione, inserire una motivazione');	
	return;
	}
		
	parent.cancellaRecord(document.form_ins_motivazione.motivo_cancellazione.value);

}

function chiudiInsMotivazione()
{
	parent.$.fancybox.close(); 	
}