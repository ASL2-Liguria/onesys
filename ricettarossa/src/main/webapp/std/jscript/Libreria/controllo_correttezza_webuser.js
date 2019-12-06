/*
	Funzione per il controllo della correttezza del nome del webuser effettuato con una regular expression
	(il campo di webuser con questa regular expression deve contenere lettere e numeri e i caratteri 'speciali'
	 '-' e '_')
	
	* @param document_nome_form_campo:   parametro contenente document + nome della form e del campo su cui effettuare il controllo
    * @param nome_label_alert:      	 indica il nome della label per l'alert
    * @return:							 1 se il nome del webuser è accettabile
										 0 altrimenti
*/

function controllo_correttezza_webuser(document_nome_form_campo, nome_label_alert){
var risultato;
var re=/^[a-zA-Z]$|^[a-zA-Z0-9]$|^[a-zA-Z0-9\-\_]+$/;
var valore_in = document_nome_form_campo.value;
var check = valore_in.match(re);
if(check){
	risultato = 1;
	valore_in = '';
	var s = new String(valore_in);
    var sr = s.replace(/'/g, "");
}
else{
	if(document_nome_form_campo.value == '')
		return;
 	alert(ritornaJsMsg(nome_label_alert));
	risultato = 0;
	document_nome_form_campo.value = '';
	document_nome_form_campo.focus();
	return;
    }
return risultato;
}
