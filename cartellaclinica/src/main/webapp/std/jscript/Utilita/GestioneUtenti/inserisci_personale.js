/**
 * File JavaScript in uso dalla pagina INSERISCI_PERSONALE.
 * 
 * @author  gianlucab
 * @version 1.0
 * @since   2014-08-25
 */

$(document).ready(function() {
    try {
    	INSERISCI_PERSONALE.init();
    	INSERISCI_PERSONALE.caricaDati();
    	INSERISCI_PERSONALE.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
});

$(window).load(function() {
	var operazione = INSERISCI_PERSONALE.getOperazione();
	switch (operazione) {
	case 'INS':
		var label = ritornaJsMsg('label_titolo_1');
		document.title = label;
		$('label[name=label_titolo_1]').text(label);
		break;
	case 'MOD':
		var label = ritornaJsMsg('label_titolo_2');
		document.title = label;
		$('label[name=label_titolo_1]').text(label);
		break;
	default:
	}
});

var INSERISCI_PERSONALE = {};
(function() {
	this.init = function() {
		switch(window.parent.name) {
		case 'winTabMed':
		case 'winTabTecInf':
		case 'winTabOpe':
			WindowCartella = opener.top;
			break;
		default:
			WindowCartella = opener.opener.top;
		}
		operazione = $('form[name=EXTERN] input[name=OPERAZIONE]').val(); // INS o MOD
		operazione = typeof operazione !== 'string' || operazione.match(/^(undefined||null|INS)$/i) ? 'INS' : operazione.toUpperCase();
		
		// CSS
		$('td.classTdLabel').css('width', '35%');
		$('#cod_dec').css('text-transform', 'lowercase');
		$('#nome, #cognome, #cod_fisc').css('text-transform', 'uppercase');

		// JS
		$('#cod_dec').attr('maxlength', '30');
		$('#nome, #cognome').attr('maxlength', '50');
		$('#cod_fisc').attr('maxlength', '16');
		$('#cod_dec, select[name=titolo], #nome, #cognome, #cod_fisc, input[type=checkbox]').parent().attr('colspan','14');
		
		$('#lblTipologiaUtente').parent().attr('rowspan','2');
		$('input[name=tipo_utente]').last().parent().attr('colspan', '3');
		$('input[name=medico]').last().parent().attr('colspan', '1');
	};
	
	this.caricaDati = function() {
		var tipo_utente = 'M';
		var titolo = '';

		switch (operazione) {		
		// Modifica personale
		case 'MOD':
			var pBinds = new Array();
			pBinds.push($('form[name=EXTERN] input[name=CODICE]').val());
			var rs = WindowCartella.executeQuery("gestione_utenti.xml","personale",pBinds);
			if(rs.next()){
				$('input[name=cod_dec]').val(rs.getString('cod_dec'));
				titolo = rs.getString('titolo');
				$('input[name=nome]').val(rs.getString('nome'));
				$('input[name=cognome]').val(rs.getString('cognome'));
				$('input[name=cod_fisc]').val(rs.getString('cod_fisc'));
				tipo_utente = rs.getString('tipo_utente');
				$('input[name=medico][value='+rs.getString('medico')+']').attr('checked',true);
				document.form.hmedico_reparto.value = rs.getString('medico_reparto') == 'S'? 'S' : 'N';
				if (rs.getString('attivo') == 'N') $('input[name=disattivo]').attr('checked',true);
				
				// Attributi readonly
				$('input[name=cod_dec]').attr('readonly',true);
				
				break;
			}	
			// Se non trovo il personale da modificare, proseguo con un inserimento
			operazione = 'INS';
			
		// Inserimento personale
		case 'INS':		
			var webuser = $('form[name=EXTERN] input[name=WEBUSER]').val();
			$('#cod_dec').val(webuser);
			
			tipo_utente = $('form[name=EXTERN] input[name=TIPO]').val();
			
			document.form.hmedico_reparto.value = 'S';
			
			break;
		default:
		}

		if (tipo_utente == 'M') {
			$('input[name=tipo_utente][value='+tipo_utente+']').attr('checked',true);
			//$('input[name=medico]').attr('disabled',false);
		} else if (tipo_utente.match(/^(undefined||null)$/i)) {
			tipo_utente = 'M';
			$('input[name=tipo_utente]:checked').attr('checked',false);
			$('input[name=medico]').attr('disabled',true);
			$('input[name=medico]:checked').attr('checked',false);
		} else {
			$('input[name=tipo_utente][value='+tipo_utente+']').attr('checked',true);
			$('input[name=medico]').attr('disabled',true);
			$('input[name=medico]:checked').attr('checked',false);
		}
		
		var rs = WindowCartella.executeQuery("gestione_utenti.xml","titoli_utente",[]);
		while(rs.next()){
			var tipo = rs.getString('tipo').toUpperCase();
			if (typeof arrTitoli[tipo] === 'undefined') arrTitoli[tipo] = [];
			arrTitoli[tipo].push({'descrizione': rs.getString('descrizione'), 'codice': rs.getString('codice')});
		}
		aggiornaTitoli(tipo_utente, titolo);
	};
	
	this.setEvents = function() {
		// Apertura a tutto schermo e focus sul cod_dec
		tutto_schermo();
		$('#cod_dec').focus();
		
		$('input[name=tipo_utente]').click(function(){
			if ($(this).val()=='M') {
				$('input[name=medico]').attr('disabled',false);
			} else {
				$('input[name=medico]').attr('disabled',true);
				$('input[name=medico]:checked').attr('checked', false);
			}
			aggiornaTitoli($(this).val());
		});
		
		// Aggiunta attributo "for" per le label accanto ai radio input
		$("input:radio").each(function() {
			var label = $(this).next().next();
			if (label.attr("tagName").toUpperCase() == 'LABEL') {
				var idname = $(this).attr('name')+'_'+$(this).val();
				$(this).attr("id", idname);
				label.attr("for", idname);
			}
		});
		
		// Controllo sul cod_dec
		$('form[name=form] input[name=cod_dec]').blur(function() {
			if (operazione == 'MOD') return;
			
			// Controllo inserimento cod_dec
			var cod_dec = $(this).val().toLowerCase();
			if (cod_dec.match(/[^a-z0-9\-\_]/)) {
				alert(ritornaJsMsg('alert_wrong_cod_dec'));
				$(this).val('');
				return;
			}
			var rs = WindowCartella.executeQuery("gestione_utenti.xml","info_personale",[$(this).val().toLowerCase()]);
			if(rs.next())
			{
				alert(ritornaJsMsg("record_esistente"));
				$(this).val('');
				$(this).focus();
				return;
			}
		});
		
		// Controllo sul codice fiscale
		$('#cod_fisc').keydown(codice_fiscale_onkeydown).blur(codice_fiscale_onblur);
	};
	
	this.salva = function() {
		try {
			salva();
		} catch(e) {
			alert(e.message);
		}
	};
	
	this.close = function() {
		try {
			alert(ritornaJsMsg('reg'));
			if (typeof opener.GESTIONE_UTENTI === 'object')
				opener.GESTIONE_UTENTI.aggiornaPersonale($('#cod_dec').val());
		} catch (e) {
			alert(e.message);
		}
		self.close();
	};
	
	this.getOperazione = function() {
		return operazione;
	};
	
	//// funzioni e variabili private ////////////////////////////////////////////////////////
	var WindowCartella = null;
	var operazione = "";
	var arrTitoli = [];
	
	function aggiornaTitoli(tipo_utente, selection)
	{
		selection = typeof selection === 'string' ? selection : $("select[name=titolo]").val();
		$("select[name=titolo] option").remove();
		var option = $("<option value=''>&nbsp;</option>");
		$('select[name=titolo]').append(option);
		for (var i in arrTitoli[tipo_utente]) {
			option = $("<option></option>").attr("value",arrTitoli[tipo_utente][i].codice).text(arrTitoli[tipo_utente][i].descrizione);
			$('select[name=titolo]').append(option);
		}
		$("select[name=titolo] option[value="+selection+"]").attr('selected',true);
	}
	
	function salva()
	{
		var mancano = '';
		var doc = document.form;
		
		//CAMPI OBBLIGATORI
		doc.cod_dec.value = trim(doc.cod_dec.value.toLowerCase());
		if (doc.cod_dec.value == '')
		{
			mancano += '- Codifica\n';
		}
		
		if (doc.titolo.value == '')
		{
			mancano += '- Titolo\n';
		}
		
		doc.nome.value = trim(doc.nome.value.toUpperCase());
		if (doc.nome.value == '')
		{
			mancano += '- Nome\n';
		}
		
		doc.cognome.value = trim(doc.cognome.value.toUpperCase());
		if (doc.cognome.value == '')
		{
			mancano += '- Cognome\n';
		}

		// Attenzione: il codice fiscale non è obbligatorio, ma se è inserito deve essere corretto
		doc.cod_fisc.value = doc.cod_fisc.value.toUpperCase();
		if (doc.cod_fisc.value.match(/^$|^[A-Z0-9]{16}$/)==null)
		{
			mancano += '- Codice fiscale\n';
		}
		
		if ($('input[name=tipo_utente]:checked').val()==null)
		{
			mancano += '- Tipologia dell\'utente\n';
		}
		else if ($('input[name=tipo_utente]:checked').val()=='M' && $('input[name=medico]:checked').val()==null)
		{
			mancano += '- Tipologia del medico\n';
		}
		
		if (mancano != '')
		{
			alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
			return;
		}

		doc.htipo_utente.value = $('input[name=tipo_utente]:checked').val(); if (doc.htipo_utente.value == 'undefined') doc.htipo_utente.value = '';
		if (doc.htipo_utente.value != 'M') doc.hmedico_reparto.value = 'N';
		doc.hmedico.value = $('input[name=medico]:checked').val(); if (doc.hmedico.value == 'undefined') doc.hmedico.value = '';
		doc.hattivo.value = doc.disattivo.checked ? 'N' : 'S';
		
		registra();
	}
	
	function codice_fiscale_onkeydown(e)
	{
		// Consenti: backspace, delete, tab, escape, enter
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
			// Consenti: Ctrl+Z, Ctrl+X, Ctrl+C, Ctrl+V, Ctrl+A
			($.inArray(e.keyCode, [90, 88, 67, 86, 65]) !== -1 && e.ctrlKey === true) || 
			// Consenti: home, end, left, right
			(e.keyCode >= 35 && e.keyCode <= 39)) {
				 return;
		}

		// Garantisce che sia stato premuto un carattere alfanumerico e termina il keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && (e.keyCode < 65 || e.keyCode > 90))
		{
			e.preventDefault();
		}
	}
	
	function codice_fiscale_onblur(e)
	{
		var value = $(this).val().toUpperCase();
		if (!value.match(/^[A-Z0-9]{16}$|^$/)) {
			alert(ritornaJsMsg('alert_cod_fisc'));
		}
	}
	
	function trim(s)
	{
		if (typeof s === 'string')
		{
			return s.replace(/^\s+|\s+$/, '');
		}
		return '';
	}
	
}).apply(INSERISCI_PERSONALE);