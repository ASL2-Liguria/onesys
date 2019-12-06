/*
	Funzione per il controllo della correttezza del codice fiscale effettuato con una regular expression
	* @param document_nome_form_campo:   parametro contenente document + nome della form e del campo su cui effettuare il controllo
    * @param nome_label_alert:      indica il nome della label per l'alert
    * @return:						1 se il codice fiscale è corretto
									0 altrimenti
*/

function controllo_correttezza_cod_fisc(document_nome_form_campo, nome_label_alert){
	var res;
	var re = /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z]{1}[0-9]{2}[a-zA-Z]{1}[0-9]{3}[a-zA-Z]{1}$/;
	var valore = document_nome_form_campo.value;
	var verifica = valore.match(re);
	
	if(verifica){
		res = 1;
	}
	else{
		alert(ritornaJsMsg(nome_label_alert));
		document_nome_form_campo.value = '';
		try{
			if(document.getElementById('div').style.display != 'none')
				document_nome_form_campo.focus();
		}
		catch(e){
		}		
		res = 0;
	}
	return res;	
}