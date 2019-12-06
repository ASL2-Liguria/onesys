// JavaScript Document
function stampaMod(iden,funzione,reparto){
	//alert("salve");
	alert(reparto);
	if (iden!='')
	{var finestra = finestra = window.open('elabStampa?stampaFunzioneStampa=' + funzione + '&stampaIdenEsame=' + iden + '&stampaReparto=' + reparto + '&stampaAnteprima=S'+"","","top=0,left=0");
	
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open('elabStampa?stampaFunzioneStampa=' + funzione + '&stampaIdenEsame=' + iden + '&stampaReparto=' + reparto + '&stampaAnteprima=S'+"","","top=0,left=0");
	}}
}