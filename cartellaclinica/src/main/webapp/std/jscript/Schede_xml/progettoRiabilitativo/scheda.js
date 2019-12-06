/**
 * File JavaScript in uso dalla scheda Progetto Riabilitativo Individuale
 * 
 * @author	gianlucab
 * @version	1.0
 * @since	2015-12-28
 */
var WindowCartella = null;

$(document).ready(function() {
	try {
		// Gestione dell'apertura della pagina da finestra modale o dal menu
		if (typeof window.dialogArguments === 'object') {
			window.WindowCartella = window.dialogArguments.top.window;
		} else {
			window.WindowCartella = window;
			while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
				window.WindowCartella = window.WindowCartella.parent;
			}
		}

		if (WindowCartella.ModalitaCartella.isReadonly(document)) {
			_STATO_PAGINA = 'L';
		}
		
		NS_SCHEDA_PROGETTO_RIABILITATIVO.init();
		NS_SCHEDA_PROGETTO_RIABILITATIVO.caricaDati();
		NS_SCHEDA_PROGETTO_RIABILITATIVO.setEvents();
	} catch (e) {
		alert(e.message);
	}
});

var NS_SCHEDA_PROGETTO_RIABILITATIVO = new Function();
(function() {
	var _this = this;
	var _idenScheda = null;
	
	this.init = function() {
		_idenScheda = parseInt($('form[name=EXTERN] input[name=IDEN_SCHEDA]').val(),10) || null;

		if (_STATO_PAGINA == 'L') {
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		}

		if (!WindowCartella.ModalitaCartella.isStampabile(document) || _STATO_PAGINA == 'I') {
			document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
		}

		// Aggiunta attributo "for" per le label accanto i radio input
		$("input:radio").each(function() {
			var label = $(this).next().next();
			if (label.attr("tagName").toUpperCase() == 'LABEL') {
				var id = $(this).attr("id");
				if (id == '' || id == $(this).attr("name")) {
					id = $(this).attr("name")+$(this).val();
					$(this).attr("id", id);
				}
				label.attr("for", id);
			}
		});
		
		// Aggiunta attributo "for" per le label accanto ai check input
		$('label[name^=lblchk], label[name^=lblChk]').each(function () {
			var id = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/i, "$2");
			$(this).attr("for", id.charAt(0).toLowerCase() + id.slice(1));
		});
		
		$("textarea").TextAreaExpander(15*3);
		
		$('#lblAusili').parent().css({'vertical-align':'top','padding-top':'10px'}).attr('rowspan','3');
		$('#txtAusilio1, #txtAusilio2, #txtAusilio3').parent().css({'width':'20%'});
	};
	
	this.caricaDati = function() {
		switch(_STATO_PAGINA) {
		
		// Dati precompilati in fase di inserimento nuova scheda
		case 'I':
			if (_idenScheda != null) {
				// Duplicazione di una scheda esistente
				
				$('form[name=EXTERN]').append('<input type="hidden" name="DUPLICATO" value="'+_idenScheda+'"/>');
				$('form[name=EXTERN] input[name=IDEN_SCHEDA]').remove();
				
				WindowCartella.DatiNonRegistrati.init(window);
				WindowCartella.DatiNonRegistrati.set(true);

				_idenScheda = null;
			}
			break;
		default:
		}
	};
	
	this.setEvents = function() {
		// Campi non editabili (sola lettura)
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#6D6D6D','background-color': 'transparent' ,'border':'1px solid transparent'});
		
		if (_STATO_PAGINA == 'L') return;
		
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.getElementById('txtDataInserimento'));
		oDateMask.attach(document.getElementById('txtDataAusilio1'));
		oDateMask.attach(document.getElementById('txtDataAusilio2'));
		oDateMask.attach(document.getElementById('txtDataAusilio3'));
		
		// Controllo obbligatorietà valore numerico
	    $('#txtSettimanePreviste').keydown(NS_FUNCTIONS.controlloNumerico_onkeydown).blur(NS_FUNCTIONS.controlloNumerico_onblur);
	    
        var maxLength = 4000;
        var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
        jQuery('textarea').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
            maxlength(this, maxLength, msg);
        });
	};
	
	this.registra = function() {
		registra();
	};
	
	this.stampa = function() {
		try {
			var vDati 		= WindowCartella.getForm();
			var iden_visita	= vDati.iden_ricovero;
			var funzione	= document.EXTERN.FUNZIONE.value;
			var reparto		= vDati.reparto;
			var anteprima	= 'S';
			var sf			= "&prompt<pVisita>="+iden_visita+"&prompt<pIdenScheda>=" + (_idenScheda || 0);

			WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);		
		} catch(e) {
			window.alert(e.message);
		}
	};
	
	this.chiudi = function() {
		WindowCartella.progettoRiabilitativo();
	};
	
	this.okRegistra = function() {
		_this.chiudi();
	};
	
	function apriModificaScheda () {
		if (_STATO_PAGINA == 'I') {
			if (_idenScheda == null) {
				var rs = WindowCartella.executeQuery("schede.xml","getIdenScheda",[WindowCartella.getRicovero("IDEN"), document.EXTERN.FUNZIONE.value]);
				if (rs.next()) {
					_idenScheda = parseInt(rs.getString("IDEN"),10);
				}
			}
		   	WindowCartella.apriScheda('SCHEDA_PROGETTO_RIABILITATIVO', 'Progetto Riabilitativo Individuale', {
		   		key_legame:  'SCHEDA_PROGETTO_RIABILITATIVO',
				not_unique:  'S',
		   		modifica:    'S',
		   		iden_scheda: _idenScheda
		   	}, {
		   		RefreshFunction: WindowCartella.progettoRiabilitativo
		   	});
		}
	}
	
}).apply(NS_SCHEDA_PROGETTO_RIABILITATIVO);
