var _filtro_list_gruppo = null;
var _filtro_list_profili = null;
var _filtro_list_elenco = null;
var _filtro_list_scelti = null;
var _ID_PROFILO = null;
var _POS_PROFILO = null;
var _tipo = null;
var tipoRic = '';

jQuery(document).ready(function() {
	// assegno alcune classi all'apertura della pagina
	addClass(document.all['txtProfilo'], 'textProfilo');
	document.all['lstEsamiScelti'].className = '';
	addClass(document.all['lstEsamiScelti'], 'listboxVerde');
	document.getElementById('lblAnnulla').parentElement.style.display = 'none';
	document.EXTERN.INSERIMENTO.value = 'N';

	//$('form[name=EXTERN]').append('<input id="REPARTO" value="UTIM_SV" name="REPARTO" type="hidden"/>');//FIXME
	
	// Apertura della pagina dal modulo di Ricetta Rossa (visualizza SOLO Prestazioni e Farmaci)
	switch (typeof $('form[name=EXTERN] input[name=REPARTO]').val()) {
	case 'undefined':
		$('form[name=EXTERN]').append('<input id="REPARTO" value="" name="REPARTO" type="hidden"/>');
		$('select[name=cmbGruppo] option').filter(function(index) { return $.inArray($(this).val(), ['RR_PRESTAZIONI', 'RR_FARMACI']) === -1;}).remove();
		$('#lblUrgenzaProfilo').hide();
		break;

	// Apertura della pagina dalla Cartella Clinica con parametro REPARTO definito (visualizza TUTTO ECCETTO Prestazioni e Farmaci)
	default:
		$('select[name=cmbGruppo] option').filter(function(index) { return $.inArray($(this).val(), ['RR_PRESTAZIONI', 'RR_FARMACI']) !== -1;}).remove();

		// La prima selezione è LABO
		creaPulsantiUrgenza("pulsanteUrgenza0", "pulsanteUrgenza2", "pulsanteUrgenza3").parent().show();
	}

	// do al pulsante chiudi la funzione corretta per la chiusura, dato che non so
	// da dove deve aprirsi il configuratore dei profili
	// $("#lblChiudi").attr("href","javascript:self.close();");
	
	// Ricerca Esami da Inserire nel profilo
	$('#txtEsamiRicerca').bind('keypress', function(e) {
		// Evento invio sul testo da ricercare
		ricerca_testo(e.keyCode == '13' ? true : false);
	});

	$('select[name=chkTipoRicerca]').bind('change', function(e) {
		ricerca_testo(false);
	});
});

function filtroQuery() {

	if (document.EXTERN.TIPO != undefined) {

		for ( var i = 0; i < document.dati.cmbGruppo.length; i++) {
			if (document.dati.cmbGruppo.options(i).value == document.EXTERN.TIPO.value) {
				document.dati.cmbGruppo.options(i).selected = true;
				break;
			}
		}

		document.dati.cmbGruppo.disabled = true;
	}

	_filtro_list_profili = new FILTRO_QUERY('lstProfili', 'txtDescr');
	_filtro_list_profili.setDistinctQuery('S');
	_filtro_list_profili.setEscapeHTML('S');

	_filtro_list_scelti = new FILTRO_QUERY('lstEsamiScelti', null);
	_filtro_list_scelti.setEnableWait('S');
	_filtro_list_scelti.setEscapeHTML('S');
	
	_filtro_list_elenco = new FILTRO_QUERY('lstEsami', 'txtEsamiRicerca');
	_filtro_list_elenco.setEnableWait('S');
	_filtro_list_elenco.setDistinctQuery('S');
	_filtro_list_elenco.setEscapeHTML('S');
	
	switch (document.dati.cmbGruppo.value) {
	case 'RR_PRESTAZIONI':
		// Elenco profili
		_filtro_list_profili.setValueFieldQuery('CODICE_PROFILO');
		_filtro_list_profili.setDescrFieldQuery('DESCR_PROFILO');
		_filtro_list_profili.setFromFieldQuery('radsql.VIEW_RR_PROFILI_FARMADATI');
		_filtro_list_profili.setWhereBaseQuery(' UTENTE='
				+ document.EXTERN.USER_ID.value + ' and SITO=\''
				+ document.dati.cmbGruppo.value + '\'');
		_filtro_list_profili.setOrderQuery('DESCR_PROFILO ASC');

		// Prestazioni scelte
		_filtro_list_scelti.setValueFieldQuery('IDEN');
		_filtro_list_scelti.setDescrFieldQuery("COD", "DESCRIZIONE");
		_filtro_list_scelti.setFromFieldQuery('radsql.VIEW_RR_PROFILI_FARMADATI');
		_filtro_list_scelti.setWhereBaseQuery('ATTIVO = \'S\' ');
		_filtro_list_scelti.setOrderQuery('DESCRIZIONE ASC');
		
		// Elenco prestazioni
		_filtro_list_elenco.setValueFieldQuery('IDEN'); // devo fare come con le
														// cicliche e aggiungere
														// la partein più?????
		_filtro_list_elenco.setDescrFieldQuery("DM_CODICE", "DESCRIZIONE");
		_filtro_list_elenco.setFromFieldQuery('radsql.VIEW_RR_PRESTAZIONI');
		_filtro_list_elenco.setWhereBaseQuery('ATTIVO=\'S\'');
		break;
	
	case 'RR_FARMACI':
		// Elenco profili
		_filtro_list_profili.setValueFieldQuery('CODICE_PROFILO');
		_filtro_list_profili.setDescrFieldQuery('DESCR_PROFILO');
		_filtro_list_profili.setFromFieldQuery('radsql.VIEW_RR_PROFILI_FARMADATI');
		_filtro_list_profili.setWhereBaseQuery(' UTENTE='
				+ document.EXTERN.USER_ID.value + ' and SITO=\''
				+ document.dati.cmbGruppo.value + '\'');
		_filtro_list_profili.setOrderQuery('DESCR_PROFILO ASC');
		
		// Farmaci scelti
		_filtro_list_scelti.setValueFieldQuery('CODICE');
		_filtro_list_scelti.setDescrFieldQuery("DESCRIZIONE", "COD");
		_filtro_list_scelti.setFromFieldQuery('radsql.VIEW_RR_PROFILI_FARMADATI');
		_filtro_list_scelti.setWhereBaseQuery('ATTIVO = \'S\' ');
		_filtro_list_scelti.setOrderQuery('DESCRIZIONE ASC');
		
		// Elenco farmaci
		_filtro_list_elenco.setValueFieldQuery("CODICE_PRODOTTO");
		_filtro_list_elenco.setDescrFieldQuery("DESCRIZIONE", "PRINCIPIO_ATTIVO");
		_filtro_list_elenco.setFromFieldQuery("MMG.FARMADATI$VM_PRODOTTI_RICERCA");
		_filtro_list_elenco.setWhereBaseQuery('COMMERCIO=\'S\'');
		_filtro_list_elenco.setOrderQuery("DESCRIZIONE ASC");
		break;
		
	default:
		// Elenco profili
		_filtro_list_profili.setValueFieldQuery('CODICE_PROFILO');
		_filtro_list_profili.setDescrFieldQuery('DESCR_PROFILO');
		_filtro_list_profili.setDataFieldQuery('data-urgenza', 'URGENZA');
		_filtro_list_profili.setFromFieldQuery('radsql.VIEW_RR_PROFILI_PRESTAZIONI');
		_filtro_list_profili.setWhereBaseQuery(' REPARTO_PROFILO=\''
				+ document.EXTERN.REPARTO.value + '\' and SITO=\''
				+ document.dati.cmbGruppo.value + '\'');
		_filtro_list_profili.setOrderQuery('DESCR_PROFILO ASC');

		// Esami scelti
		_filtro_list_scelti.setValueFieldQuery('IDEN');
		_filtro_list_scelti.setDescrFieldQuery("DESCRIZIONE");
		_filtro_list_scelti.setFromFieldQuery('radsql.VIEW_RR_PROFILI_PRESTAZIONI');
		_filtro_list_scelti.setWhereBaseQuery('ATTIVO = \'S\' ');
		_filtro_list_scelti.setOrderQuery('DESCRIZIONE ASC');
		
		// Elenco esami
		_filtro_list_elenco.setValueFieldQuery('IDEN');
		_filtro_list_elenco.setDescrFieldQuery('COD', 'DESCR');
		_filtro_list_elenco.setFromFieldQuery('radsql.VIEW_TAB_ESA_REPARTO');
		
		switch (document.dati.cmbGruppo.value) {
		case 'LABO':
			_filtro_list_elenco.setWhereBaseQuery(' BRANCA = \'L\' AND REPARTO_DESTINAZIONE = \'LABO\' '+
					'AND TIPO = \'R\' AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND (URGENZA = \'' + document.getElementById('hUrgenza').value + '\' OR URGENZA IS NULL)');
			break;
		case 'RADIO':
			_filtro_list_elenco.setWhereBaseQuery(' REPARTO_DESTINAZIONE = \'RADIO\' '+
					//'AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND TIPO=\'R\' AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE is null OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND (URGENZA = \'' + document.getElementById('hUrgenza').value + '\' OR URGENZA IS NULL)');
			break;
		case 'CARDIO':
			_filtro_list_elenco.setWhereBaseQuery(' REPARTO_DESTINAZIONE LIKE \'CARDIO%\' '+
					//'AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND TIPO=\'R\' AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE is null OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND (URGENZA = \'' + document.getElementById('hUrgenza').value + '\' OR URGENZA IS NULL)');
			break;
		case 'ANATOMIA_PATOLOGICA':
			_filtro_list_elenco.setWhereBaseQuery(' REPARTO_DESTINAZIONE = \'ANATOMIA_PATOLOGICA\' '+
					//'AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND TIPO=\'R\' AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE is null OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND (URGENZA = \'' + document.getElementById('hUrgenza').value + '\' OR URGENZA IS NULL)');
			break;
		case 'MICRO': //TODO
		case 'MEDNUC': //TODO
		default:
			_filtro_list_elenco.setWhereBaseQuery('1=0');
		}
		_filtro_list_elenco.setOrderQuery("DESCR ASC");
		break;
	}

	// per scelgliere tramite box di ricerca
	_filtro_list_profili.searchListRefresh();
	
	cambiaTipo();
}

function call_function_db(id, gruppo, descr, esa, iden_per, reparto, urgenza, call_back) {
	sql = "{call ? := GESTIONE_PROFILI_RICETTA('" + id + "','" + gruppo
			+ "', '" + descr + "', '" + esa + "','" + iden_per + "','" + reparto + "','" + urgenza + "') }";

	dwr.engine.setAsync(false);
	toolKitDB.executeFunctionData(sql, call_back);
	dwr.engine.setAsync(true);
}

// funzione che apre il div del dettaglio dei profili. Si passa id del profilo e
// la posizione
function Dettaglio_Profilo() {

	if (document.all['lstProfili'].selectedIndex >= 0) {

		id = document.all['lstProfili'].options(document.all['lstProfili'].selectedIndex).value;
		pos = document.all['lstProfili'].selectedIndex;

		document.dati.txtProfilo.value = document.dati.lstProfili.options(pos).text;

		nascondiCampi();

		_ID_PROFILO = id;
		_POS_PROFILO = pos;

		_filtro_list_elenco.setEnableWait("S");
		switch (document.dati.cmbGruppo.value) {
		case 'RR_PRESTAZIONI':
			_filtro_list_elenco
					.setWhereBaseQuery(" IDEN not in (select /*+first_rows(100)*/ IDEN from VIEW_RR_PROFILI_FARMADATI where CODICE_PROFILO = '"
							+ _ID_PROFILO + "' AND IDEN IS NOT NULL) ");
			
			// _filtro_list_elenco.refreshList();
			_filtro_list_elenco.setEnableWait("S");
			_filtro_list_scelti.searchListRefresh(" CODICE_PROFILO = '"
					+ _ID_PROFILO + "'", "RICERCA_ELENCO_SCELTI");
			break;
		case 'RR_FARMACI':
			// _filtro_list_elenco.setWhereBaseQuery(" CODICE_PRODOTTO not in
			// (select /*+first_rows(100)*/ CODICE from
			// VIEW_RR_PROFILI_FARMADATI where CODICE_PROFILO = '" + _ID_PROFILO
			// + "' AND CODICE IS NOT NULL) ");
			_filtro_list_elenco
					.setWhereBaseQuery(" COMMERCIO = 'S' AND CODICE_PRODOTTO not in (select /*+first_rows(100)*/ CODICE from VIEW_RR_PROFILI_FARMADATI where CODICE_PROFILO = '"
							+ _ID_PROFILO + "' AND IDEN IS NOT NULL) ");
			
			// _filtro_list_elenco.refreshList();
			_filtro_list_elenco.setEnableWait("S");
			_filtro_list_scelti.searchListRefresh(" CODICE_PROFILO = '"
					+ _ID_PROFILO + "'", "RICERCA_ELENCO_SCELTI");
			break;
			
		default:
			_filtro_list_elenco.searchListRefresh(" IDEN not in (select /*+first_rows(100)*/ IDEN from VIEW_RR_PROFILI_PRESTAZIONI where CODICE_PROFILO = '" + _ID_PROFILO + "'"
					+ " AND IDEN IS NOT NULL)",
					"RICERCA_ELENCO_FILTRATO");
			// _filtro_list_elenco.refreshList();
			_filtro_list_elenco.setEnableWait("S");
			
			_filtro_list_scelti.searchListRefresh(" CODICE_PROFILO = '"
					+ _ID_PROFILO + "' AND REPARTO_PROFILO = '"+ document.EXTERN.REPARTO.value + "'", "RICERCA_ELENCO_SCELTI");
			
			document.getElementById("hUrgenza").value = $('select[name=lstProfili] option:selected').attr("data-urgenza");
			setUrgenza();
		}

		document.getElementById('divDettaglioGruppo').style.display = 'block';
		// document.getElementById('divElencoEsami').style.display='block';

		// Tipo Ricerca per Nome Descrizione.
		document.getElementsByName('chkTipoRicerca')[0].checked = true;
	}
}

// funzione che apre il dettaglio dei profili valorizzando la variabile
// INSERIMENTO settandola ad S in modo da poter inserire un nuovo profilo
function inserisci() {

	nascondiCampi();

	_ID_PROFILO = 0;
	_POS_PROFILO = -1;

	document.getElementById('divDettaglioGruppo').style.display = 'block';
	// document.getElementById('divElencoEsami').style.display='block';

	// Tipo Ricerca per Nome Descrizione.
	document.getElementsByName('chkTipoRicerca')[0].checked = true;

	document.EXTERN.INSERIMENTO.value = 'S';

	document.all['lstProfili'].selectedIndex = -1;
	document.getElementById('txtProfilo').value = '';
	document.getElementById('txtEsamiRicerca').value = '';
	document.getElementById('lstEsamiScelti').length = 0;
	document.dati.txtProfilo.focus();
}

// funzione che prende l'id del profilo selezionato e lancia la funzione
// 'call_function_db'
function cancella() {
	if (document.all['lstProfili'].selectedIndex >= 0) {
		if (confirm('Confermare la cancellazione?')) {
			_ID_PROFILO = document.all['lstProfili']
					.options(document.all['lstProfili'].selectedIndex).value;
			call_function_db(_ID_PROFILO, document.dati.cmbGruppo.value,
					document.dati.txtProfilo.value, 'DEL',
					document.EXTERN.USER_ID.value, '', '', response_cancella_profilo);
		}
	} else {
		alert('Prego selezionare almeno un profilo!');
	}
}

function chiudiConfProf() {
	if (document.EXTERN.TIPO != undefined)
		opener.location.reload(false);

	self.close();
}

function response_cancella_profilo(risp) {
	if (risp.substr(0, 2) == 'OK') {
		alert('Cancellazione effettuata!');
	} else {
		var messaggio = risp.substr(risp.indexOf('*')+1);
		alert('Errore durante la cancellazione!\nMessaggio: ' + messaggio);
	}

	_ID_PROFILO = '0';

	// nascondiBloccoDiv('divElencoEsami,divElencoScelti,divDettaglioGruppo');
	// // da errore 'obj.style è nullo o non è un oggetto...

	_filtro_list_profili.refreshList();

	// document.getElementById('divDettaglioGruppo').style.display='none';
	visualizzaCampi();

	location.replace(location);

}

function InserisciEsami(iden_profilo, nome_profilo, iden_esame) {
	var Inserisci = false;
	var gruppo_profilo = document.getElementById("cmbGruppo").value;

	if ((iden_profilo != null) & (nome_profilo != null)
			& (reparto_profilo != null) & (gruppo_profilo != null)
			& (iden_esame != null)) {
		var sito;
		switch (gruppo_profilo) {
		case 'F':
			sito = "RR_FARMACI";
			break;
		case 'P': default:
			sito = "RR_PRESTAZIONI";
			break;
		}

		var sql = "insert into radsql.tab_esa_gruppi (sito, cod_gruppo, descr, iden_esa) Values ('"
				+ sito
				+ "', '"
				+ gruppo_profilo
				+ "','"
				+ iden_profilo.toUpperCase()
				+ "', '"
				+ nome_profilo.toUpperCase() + "', " + iden_esame + ")";

		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(sql);
		dwr.engine.setAsync(true);
		// Record Inserito..
		Inserisci = true;
	}
	return Inserisci;
}

function registra_profilo() {
	var msg = '';
	var id_esa = '';

	document.dati.txtProfilo.value = trim(document.dati.txtProfilo.value)
			.toUpperCase();
	if (document.dati.txtProfilo.value == '') {
		msg += '\n\t- Inserire nome del profilo;';
	}
	if (document.dati.lstEsamiScelti.options.length == 0) {
		msg += '\n\t- Aggiungere almeno un esame;';
	}
	if (msg == '') {
		id_esa = getAllOptionCodeWithSplitElement('lstEsamiScelti', ',');
		var profilo = document.dati.txtProfilo.value;

		if (document.all['lstProfili'].options.length > 0) {
			for (var i = 0; i < document.all['lstProfili'].options.length; i++) {
				// controllo se il nome del profilo è già presente nella lista e
				// se siamo in inserimento nuovo profilo
				if (document.all['lstProfili'].options[i].text.toUpperCase() == profilo
						&& document.EXTERN.INSERIMENTO.value == 'S') {
					alert('Attenzione! Nome profilo inserito già esistente.\nScegliere un nuovo nome');
					// document.dati.txtProfilo.value = ''; //Decommentare nel
					// caso si voglia cancellare completamente il nome del
					// profilo se già presente nella lista
					document.dati.txtProfilo.focus();
					addClass(document.all['txtProfilo'], 'textProfilo');
					return;

				}
			}
		}

		call_function_db(
			_ID_PROFILO, document.dati.cmbGruppo.value, document.dati.txtProfilo.value, id_esa,
			document.EXTERN.USER_ID.value, document.EXTERN.REPARTO.value, document.getElementById("hUrgenza").value, response_registra_profilo
		);
	} else {
		alert('Attenzione!' + msg);
	}

}

function response_registra_profilo(risp) {
	var ret = risp.substr(risp.indexOf('*')+1);
	
	if (risp.substr(0, 2) == 'OK') {
		alert('Registrazione effettuata!');
		_ID_PROFILO = ret;

	} else {
		alert('Errore durante il salvataggio!\nMessaggio: ' + ret);
	}

	document.EXTERN.INSERIMENTO.value = 'N';

	location.replace(location);

	_filtro_list_profili.refreshList();

	seleziona_profilo(_ID_PROFILO);

	document.getElementById('divDettaglioGruppo').style.display = 'none';

	visualizzaCampi();

}

function seleziona_profilo(id) {
	for ( var idx = 0; document.dati.lstProfili.options.length; idx++) {
		if (document.dati.lstProfili.options(idx).value == id) {
			document.dati.lstProfili.options(idx).selected = true;
			break;
		}
	}
}

function aggiornaListaProfili() {
	_filtro_list_elenco = new FILTRO_QUERY('lstEsami', 'txtEsamiRicerca');
	_filtro_list_elenco.setEnableWait('S');
	_filtro_list_elenco.setDistinctQuery('S');
	_filtro_list_elenco.setEscapeHTML('S');
	
	switch (document.dati.cmbGruppo.value) {
	case 'RR_PRESTAZIONI':
		// Elenco profili
		_filtro_list_profili.setWhereBaseQuery(' UTENTE='
				+ document.EXTERN.USER_ID.value + ' and SITO=\''
				+ document.dati.cmbGruppo.value + '\'');
		_filtro_list_profili.searchListRefresh();
		
		// Elenco prestazioni
		
		_filtro_list_elenco.setValueFieldQuery('IDEN');
		_filtro_list_elenco.setDescrFieldQuery('DM_CODICE', 'DESCRIZIONE');
		_filtro_list_elenco.setFromFieldQuery('radsql.VIEW_RR_PRESTAZIONI');
		_filtro_list_elenco.setWhereBaseQuery('ATTIVO=\'S\'');
		_filtro_list_elenco.setOrderQuery("DESCRIZIONE  ASC");
		break;
	case 'RR_FARMACI':
		// Elenco profili
		_filtro_list_profili.setWhereBaseQuery(' UTENTE='
				+ document.EXTERN.USER_ID.value + ' and SITO=\''
				+ document.dati.cmbGruppo.value + '\'');
		_filtro_list_profili.searchListRefresh();
		
		// Elenco farmaci
		_filtro_list_elenco.setValueFieldQuery("CODICE_PRODOTTO");
		_filtro_list_elenco.setDescrFieldQuery("DESCRIZIONE", "PRINCIPIO_ATTIVO");
		_filtro_list_elenco.setFromFieldQuery("MMG.FARMADATI$VM_PRODOTTI_RICERCA");
		_filtro_list_elenco.setWhereBaseQuery("COMMERCIO='S'");
		_filtro_list_elenco.setOrderQuery("DESCRIZIONE ASC");
		break;
	default:
		// Elenco profili
		_filtro_list_profili.setWhereBaseQuery(' REPARTO_PROFILO=\''
				+ document.EXTERN.REPARTO.value + '\' and SITO=\''
				+ document.dati.cmbGruppo.value + '\'');
		_filtro_list_profili.searchListRefresh();
		
		// Elenco esami
		_filtro_list_elenco.setValueFieldQuery('IDEN');
		_filtro_list_elenco.setDescrFieldQuery('COD', 'DESCR');
		_filtro_list_elenco.setFromFieldQuery('radsql.VIEW_TAB_ESA_REPARTO');
		switch(document.dati.cmbGruppo.value) {
		case 'LABO':
			_filtro_list_elenco.setWhereBaseQuery(' BRANCA = \'L\' AND REPARTO_DESTINAZIONE = \'LABO\' '+
					'AND TIPO = \'R\' AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND (URGENZA = \'' + document.getElementById('hUrgenza').value + '\' OR URGENZA IS NULL)');
			break;
		case 'RADIO':
			_filtro_list_elenco.setWhereBaseQuery(' REPARTO_DESTINAZIONE = \'RADIO\' '+
					//'AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND TIPO = \'R\' AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE is null OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND (URGENZA = \'' + document.getElementById('hUrgenza').value + '\' OR URGENZA IS NULL)');
			break;
		case 'CARDIO':
			_filtro_list_elenco.setWhereBaseQuery(' REPARTO_DESTINAZIONE LIKE \'CARDIO%\' '+
					//'AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND TIPO=\'R\' AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE is null OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND (URGENZA = \'' + document.getElementById('hUrgenza').value + '\' OR URGENZA IS NULL)');
			break;
		case 'ANATOMIA_PATOLOGICA':
			_filtro_list_elenco.setWhereBaseQuery(' REPARTO_DESTINAZIONE = \'ANATOMIA_PATOLOGICA\' '+
					//'AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND TIPO = \'R\' AND (REPARTO_SORGENTE = \''+document.EXTERN.REPARTO.value+'\' OR REPARTO_RICHIEDENTE is null OR REPARTO_RICHIEDENTE = \''+document.EXTERN.REPARTO.value+'\')' +
					'AND (URGENZA = \'' + document.getElementById('hUrgenza').value + '\' OR URGENZA IS NULL)');
			break;
		case 'MICRO': //TODO
		case 'MEDNUC': //TODO
		default:
			_filtro_list_elenco.setWhereBaseQuery("1=0");
		}	
		_filtro_list_elenco.setOrderQuery("DESCR ASC");
		break;
	}
	// nascondo blocco div
	document.getElementById('divDettaglioGruppo').style.display = 'none';
}

// funzione che rende opaca la parte di scelta profili
function nascondiCampi() {
	addClass(document.getElementById('txtDescr'), 'opacity');
	document.getElementById('txtDescr').disabled = true;
	addClass(document.getElementById('lblDescr').parentElement, 'opacity');
	addClass(document.getElementById('cmbGruppo'), 'opacity');
	document.getElementById('cmbGruppo').disabled = true;
	addClass(document.getElementById('lblGruppo').parentElement, 'opacity');
	addClass(document.getElementById('lstProfili'), 'opacity');
	// document.getElementById('lstProfili').style.display='none';
	// document.getElementById('lstProfili').disabled=true;
	document.getElementById('lblInserisci').parentElement.parentElement.style.display = 'none';
	// document.getElementById('lblCancella').parentElement.parentElement.style.display='none';
	document.getElementById('lblAnnulla').parentElement.style.display = 'block';
}

// funzione che toglie l'opacità dalla parte di scelta profili
function visualizzaCampi() {
	removeClass(document.getElementById('txtDescr'), 'opacity');
	document.getElementById('txtDescr').disabled = false;
	removeClass(document.getElementById('lblDescr').parentElement, 'opacity');
	removeClass(document.getElementById('cmbGruppo'), 'opacity');

	if (document.EXTERN.TIPO == undefined) {
		document.getElementById('cmbGruppo').disabled = false;
	}

	removeClass(document.getElementById('lblGruppo').parentElement, 'opacity');
	removeClass(document.getElementById('lstProfili'), 'opacity');
	// document.getElementById('lstProfili').style.display='block';
	// document.getElementById('lstProfili').disabled=false;
	document.getElementById('lblInserisci').parentElement.parentElement.style.display = 'block';
	// document.getElementById('lblCancella').parentElement.parentElement.style.display='block';
	document.getElementById('lblAnnulla').parentElement.style.display = 'none';
	document.getElementById('divDettaglioGruppo').style.display = 'none';
}

function annulla() {
	$('#txtEsamiRicerca').val("");
	$('#txtDescr').val("");
	svuotaListBox('lstEsami');
	visualizzaCampi();
	filtroQuery();
}

// funzione che agisce sull'onchange
function cambiaTipo() {
	aggiornaListaProfili();

	switch (document.dati.cmbGruppo.value) {
	// Ricetta Rossa
	case 'RR_PRESTAZIONI':
		document.getElementById('lblEsami').innerText = 'Elenco Prestazioni';
		document.getElementById('lblEsamiScelti').innerText = 'Elenco Prestazioni presenti nel profilo';
		document.getElementById("hUrgenza").value = '';
		break;
	case 'RR_FARMACI':
		document.getElementById('lblEsami').innerText = 'Elenco Farmaci';
		document.getElementById('lblEsamiScelti').innerText = 'Elenco Farmaci presenti nel profilo';
		document.getElementById("hUrgenza").value = '';
		break;
	
	// Cartella Clinica
	case 'LABO':
		document.getElementById('lblEsami').innerText = 'Elenco Esami';
		document.getElementById('lblEsamiScelti').innerText = 'Elenco Esami presenti nel profilo';
		creaPulsantiUrgenza("pulsanteUrgenza0", "pulsanteUrgenza2", "pulsanteUrgenza3").parent().show();
		document.getElementById("hUrgenza").value = '0';
		break;
	case 'RADIO': case 'CARDIO':
		document.getElementById('lblEsami').innerText = 'Elenco Esami';
		document.getElementById('lblEsamiScelti').innerText = 'Elenco Esami presenti nel profilo';
		creaPulsantiUrgenza("pulsanteUrgenza0", "pulsanteUrgenza1", "pulsanteUrgenza2", "pulsanteUrgenza3").parent().show();
		document.getElementById("hUrgenza").value = '0';
		break;
	case 'MEDNUC':
		document.getElementById('lblEsami').innerText = 'Elenco Esami';
		document.getElementById('lblEsamiScelti').innerText = 'Elenco Esami presenti nel profilo';
		creaPulsantiUrgenza("pulsanteUrgenza0", "pulsanteUrgenza2").parent().show();
		document.getElementById("hUrgenza").value = '0';
		break;
	case 'ANATOMIA_PATOLOGICA':
		document.getElementById('lblEsami').innerText = 'Elenco Esami';
		document.getElementById('lblEsamiScelti').innerText = 'Elenco Esami presenti nel profilo';
		creaPulsantiUrgenza("pulsanteUrgenza0", "pulsanteUrgenza1", "pulsanteUrgenza2").parent().show();
		document.getElementById("hUrgenza").value = '0';
		break;
	case 'MICRO':
	default:
		document.getElementById('lblEsami').innerText = 'Elenco Esami';
		document.getElementById('lblEsamiScelti').innerText = 'Elenco Esami presenti nel profilo';
		$('#lblUrgenzaProfilo').hide();
		document.getElementById("hUrgenza").value = '0';
		break;
	}
	setUrgenza();
	SetRicerca(document.dati.cmbGruppo.value);
}

function svuotaListBox(elemento) {
	var object;
	var indice;
	object = document.getElementById(elemento);
	if (object) {
		indice = parseInt(object.length);
		while (indice > -1) {
			object.options.remove(indice);
			indice--;
		}
	}
}

function ricerca_testo(showAlerts) {
	showAlerts = typeof showAlerts === 'boolean' ? showAlerts : true;
	
	if ($('#txtEsamiRicerca').val().length < 3) {
		if (showAlerts)
			alert("Inserire almeno 3 caratteri nel campo di ricerca.");
		return;
	}
	var ricerca = document.getElementById("chkTipoRicerca");
	var TipoProfilo = document.dati.cmbGruppo.value;
	var TipoRicerca = "";
	var target_field = "";
	for ( var i = ricerca.length - 1; i >= 0; i--) {
		if (ricerca.options[i].selected) {
			TipoRicerca = ricerca[i].value;
		}
	}

	switch (TipoProfilo) {
	case 'RR_PRESTAZIONI':
		if (TipoRicerca == '1') {
			target_field = "DESCRIZIONE";
		} else if (TipoRicerca == '2') {
			target_field = "DM_CODICE";
		}
		_filtro_list_elenco.searchListRefresh(target_field + " like '%"
				+ document.dati.txtEsamiRicerca.value.toUpperCase() + "%'",
				"RICERCA_ELENCO");
		break;
	case 'RR_FARMACI':
		if (TipoRicerca == '1') {
			//Usa l'indice FULLTEXT
			var match = document.dati.txtEsamiRicerca.value.toUpperCase().replace(/'/g, "''").replace(/([!"#$%&\(\)\*\+\,\-\.\/:;<=>?@\[\]^_`\\\{|\}~])/g, "\\$1");
			//alert(match);
			_filtro_list_elenco.searchListRefresh("CONTAINS(DESCRIZIONE, '" + match + "%') > 0", "RICERCA_ELENCO");
		} else if (TipoRicerca == '2') {
			_filtro_list_elenco.searchListRefresh("PRINCIPIO_ATTIVO like '%"
					+ document.dati.txtEsamiRicerca.value.toUpperCase() + "%'",
					"RICERCA_ELENCO");
		}
		break;
		
	default:
		if (TipoRicerca == '1') {
			target_field = "DESCR";
		} else if (TipoRicerca == '2') {
			target_field = "COD";
		}
		_filtro_list_elenco.searchListRefresh(target_field + " like '%"
				+ document.dati.txtEsamiRicerca.value.toUpperCase() + "%'",
				"RICERCA_ELENCO");
		break;
	}

}

// Get radio button list value
function SetRicerca(tipoprof) {
	var ricerca = document.getElementById("chkTipoRicerca");
	for ( var i = ricerca.length - 1; i >= 0; i--) {
		ricerca.remove(i);
	}

	switch (tipoprof) {
	case 'RR_PRESTAZIONI':
		var oOpt1 = document.createElement("Option");
		oOpt1.text = "Descrizione";
		oOpt1.value = "1";
		ricerca.add(oOpt1);
		var oOpt2 = document.createElement("Option");
		oOpt2.text = "Codice Prontuario";
		oOpt2.value = "2";
		ricerca.add(oOpt2);
		break;
	case 'RR_FARMACI':
		var oOpt1 = document.createElement("Option");
		oOpt1.text = "Nome commerciale";
		oOpt1.value = "1";
		ricerca.add(oOpt1);
		var oOpt2 = document.createElement("Option");
		oOpt2.text = "Principio Attivo";
		oOpt2.value = "2";
		ricerca.add(oOpt2);
		break;
	default:
		var oOpt1 = document.createElement("Option");
		oOpt1.text = "Descrizione";
		oOpt1.value = "1";
		ricerca.add(oOpt1);
		var oOpt2 = document.createElement("Option");
		oOpt2.text = "Codice Esame";
		oOpt2.value = "2";
		ricerca.add(oOpt2);
		break;
	}
}

function setUrgenza() {
	var lblTitleUrgenza = $("#lblUrgenzaProfilo legend").get(0);
	
	switch(document.getElementById("hUrgenza").value) {
		// Non urgente
		case '0':
			var urgenza = $("div.pulsanteUrgenza0 a").text().toUpperCase();
			lblTitleUrgenza.innerText = '    Grado Urgenza:   ' + urgenza + '    ';
			lblTitleUrgenza.className = '';
			addClass(lblTitleUrgenza, 'routine');
			break;
		
		// Urgenza differita
		case '1':
			var urgenza = $("div.pulsanteUrgenza1 a").text().toUpperCase();
			lblTitleUrgenza.innerText = '    Grado Urgenza:   ' + urgenza + '    ';
			lblTitleUrgenza.className = '';
			addClass(lblTitleUrgenza, 'urgenzaDifferita');
			break;
			
		// Urgenza
		case '2':
			var urgenza = $("div.pulsanteUrgenza2 a").text().toUpperCase();
			lblTitleUrgenza.innerText = '    Grado Urgenza:   ' + urgenza + '    ';
			lblTitleUrgenza.className = '';
			addClass(lblTitleUrgenza, 'urgenza');
			break;

		// Emergenza
		case '3':
			var urgenza = $("div.pulsanteUrgenza3 a").text().toUpperCase();
			lblTitleUrgenza.innerText = '    Grado Urgenza:   ' + urgenza + '    ';
			lblTitleUrgenza.className = '';
			addClass(lblTitleUrgenza, 'emergenza');
			break;
		default:
	}
}

function creaPulsantiUrgenza(/* default pulsanteUrgenza0*/) {
	var strFunction = "if (document.getElementById('txtEsamiRicerca').value.length > 2) { ricerca_testo(); }";
	if (document.dati.cmbGruppo.value == 'CARDIO') strFunction = "ricerca_testo(false);";
	
	var table = "<div id='divUrgenzaProfilo'><table class='classDataEntryTable'><tr><td width='25%' class='classTdField'><input id='hUrgenza' STATO_CAMPO='E' value='"+ document.getElementById("hUrgenza").value +"' name='hUrgenza' type='hidden'></input><div class='pulsanteUrgenza0'><a href=\"javascript:document.all.hUrgenza.value='0';setUrgenza();" + strFunction + "\">Routine</a></div></td>";
	for (var i=0, length=arguments.length; i<length; i++) {
		var pulsante = arguments[i];
		var label = '';
		var value = '';
		switch(pulsante) {
		case 'pulsanteUrgenza1':
			label = document.dati.cmbGruppo.value == 'ANATOMIA_PATOLOGICA' ? 'Intraoperatorio' : 'Urgenza differita';
			value = '1';
			break;
		case 'pulsanteUrgenza2':
			label = 'Urgenza';
			value = '2';
			break;
		case 'pulsanteUrgenza3':
			label = 'Emergenza';
			value = '3';
			break;
		default:
			pulsante = '';
		}
		
		if (pulsante != '') {
			table += "<td width='25%' class='classTdField'><div class='" + pulsante + "'><a href=\"javascript:document.all.hUrgenza.value='" + value + "';setUrgenza();" + strFunction + "\">" + label + "</a></div></td>";
		}
	}
	table += "</tr><colgroup><col width=''/><col width=''/><col width=''/><col width=''/></colgroup></table>";
	
	$("#divUrgenzaProfilo table").remove();
	return $("#divUrgenzaProfilo").append(table);
}