var array_valori_stato = new Array('I','E', 'X', 'V', 'W');
array_valori_stato['I'] = 'IEX';
array_valori_stato['E'] = 'VW';
array_valori_stato['V'] = 'W';
array_valori_stato['W'] = 'EX';
array_valori_stato['X'] = 'I';
array_valori_stato['%'] = 'IEXVW';

var stringa_valori_stato = new String(array_valori_stato).replace(',','');

function variazione_stato_valida(vecchio, nuovo) {
	if (array_valori_stato[vecchio].indexOf(nuovo) != -1)
		return true;
	else
		return false;
}

function contestualizza_pulsanti() {
	var stato = parent.document.forms['dati'].statoMod.value;
	for (x=0; x < array_valori_stato.length; x++) {
		var stato_possibile = array_valori_stato[x];
		if (array_valori_stato[stato].indexOf(stato_possibile) > -1) {
			display_pulsante_stato(stato_possibile,'block');
		} else {
			display_pulsante_stato(stato_possibile,'none');
		}
	}
}

function conta_righe() {
	var l=parent.document.getElementById('lblWkTitle');
	l.innerHTML= "Richieste corrispondenti alla ricerca: " + _TOTALE_RECORD_WK;
	var nodelist  = document.getElementById('oTable').getElementsByTagName('tr');
	for (r=0; r < nodelist.length; r++) {
		nodelist[r].getElementsByTagName('td')[0].innerHTML = (parent._WK_PAGINE_ATTUALE -1) * _RECORD_PER_PAGINA_WK + r + 1; 
	}
}

function get_pulsante_stato(stato) {
	return document.getElementById('stato_' + stato);
}

function display_pulsante_stato(stato,display) { // none, block
	var pulsante = get_pulsante_stato(stato);
	if (pulsante != null && typeof(pulsante) != 'undefined')
		pulsante.style.display = display;
}

function cambia_stato_richiesta(stato_desiderato) {
/*	if (stato_desiderato=='I') {
		check_cambia_stato_richiesta(stato_desiderato)
	} else {*/
	document.richiediUtentePassword.setRichiediPwdRegistra(true);
	document.richiediUtentePassword.view('check_cambia_stato_richiesta("' + stato_desiderato + '");', 'S');
}

var grm_registra;

function check_cambia_stato_richiesta(stato_desiderato) {

	grm_registra = false;

	var stato_attuale = '';
	var iden_richiesta = '';
	var richiedenti = '';
	if (typeof(array_stato_richiesta) == 'undefined' || typeof(array_iden_richiesta) == 'undefined' || typeof(array_richiedenti) == 'undefined') {
		alert('Errore di configurazione (array). Contattare l\'assistenza.');
		return;
	} else {
		stato_attuale = stringa_codici(array_stato_richiesta);
		iden_richiesta = stringa_codici(array_iden_richiesta);
		richiedenti = stringa_codici(array_richiedenti);
	}
	
	if (!variazione_stato_valida(stato_attuale,stato_desiderato)) {
		alert('Non è possibile effettuare questa variazione di stato (' + stato_attuale + '=>' + stato_desiderato + ') della richiesta di modifica');
		return;
	}
	
	/*
	 * Autenticazione utente!
	 */
/*	if (stato_desiderato == 'I') {
		var iden_per = baseUser.IDEN_PER;
		var is_admin = parent.user_is_admin;
	} else { */
	var iden_per = document.richiediUtentePassword.getValore('IDEN_PER');
	var is_admin = (document.richiediUtentePassword.getValore('RICH_MOD_ADMIN') == 'S');
	
	var saveframe = parent.frames['oIFsave'];
	var saveform = saveframe.document.forms['dati'];
	var extern = saveframe.document.forms['EXTERN'];
	saveform.IdenRichiesta.value = iden_richiesta;
	saveform.StatoRichiesta.value = stato_desiderato;
	extern.USER_ID.value = iden_per;
	
	var is_richiedente = (richiedenti.indexOf('@' + iden_per + '@') > -1);
	
	switch(stato_desiderato) {
	case 'E':
		if (!is_admin) { /* Se si autentica l'utente è un ERRORE!!! */
			alert('Non si dispone dei permessi per effettuare questa operazione');
			return;
		}
		if (is_richiedente) {
			alert('Non e\' possibile eseguire le proprie richieste');
			return;
		}
		break;
	case 'X':
		if (!is_richiedente) {
			alert('Impossibile annullare la richiesta, l\'utente non e\' tra i richiedenti');
			return;
		}
		if (!confirm('Sei sicuro di voler annullare la richiesta? Sarà possibile modificarla e reinserirla.')) {
			return;
		}
		break;
	case 'V':
		if (!is_richiedente) {
			alert('Impossibile validare l\'esecuzione della richiesta, l\'utente non e\' tra i richiedenti');
			return;
		}
		break;
	case 'W':
		if (!is_richiedente) {
			alert('Impossibile rendere non valida l\'esecuzione della richiesta, l\'utente non e\' tra i richiedenti');
			return;
		}
		if (confirm('Sei sicuro di non voler validare la modifica?')) {
		}
		break;
	case 'I':
		if (!is_richiedente) {
			alert('Impossibile modificare la richiesta, l\'utente non e\' tra i richiedenti');
			return;
		}
		var finestra=apri_richiesta_modifica();
		while (!finestra.closed);
		if (!grm_registra)
			return;
		break;
	default:
		alert('Caso non previsto!');
		return;
	}
	saveframe.registra();
}
