/*
	Funzione per il controllo della correttezza di un indirizzo ip effettuato con una regular expression
	(il campo di indirizzo ip con questa regular expression deve contenere  il formato dell'indirizzo ip separato 
	dal punto oppure un nome host composto da sole lettere, da soli numeri o da ambedue)
	
	* @param document_nome_form_campo:   parametro contenente document + nome della form e del campo su cui effettuare il controllo
    * @param nome_label_alert:      	 indica il nome della label per l'alert
    * @return:							 1 se l'ip è corretto
										 0 altrimenti
*/

function controllo_correttezza_ip(document_nome_form_campo, nome_label_alert)
{
	var risultato;
	var re=/^[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}$|^[a-zA-Z0-9]+$/;
	var valore_in = document_nome_form_campo.value;
	var check = valore_in.match(re);
	if(check)
	{
		risultato = 1;
		valore_in = '';
		var s = new String(valore_in);
    	var sr = s.replace(/'/g, "");
	}
	else
	{
 		alert(ritornaJsMsg(nome_label_alert));
		risultato = 0;
		document_nome_form_campo.value = '';
		document_nome_form_campo.focus();
		return;
    }
	//document_nome_form_campo.value = document_nome_form_campo.value.toUpperCase();
	return risultato;
}
