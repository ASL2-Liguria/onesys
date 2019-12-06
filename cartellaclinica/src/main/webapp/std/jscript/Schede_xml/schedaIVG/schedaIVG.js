/**
 * File JavaScript in uso dalla scheda I.V.G
 * 
 * @author	gianlucab
 * @version	1.0
 * @since	2015-11-16
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
		
		NS_SCHEDA_IVG.init();
		NS_SCHEDA_IVG.caricaDati();
		NS_SCHEDA_IVG.setEvents();
	} catch (e) {
		alert(e.message);
	}
});

$(window).load(function() {
	// Per le schede nello stato di bozza vengono segnalati i campi importati da altre schede non ancora registrati nell'xml
	if (_STATO_PAGINA == 'I') {
		NS_FUNCTIONS.segnalaCampiNonRegistrati();
		if ($('[data-uncommitted]').length > 0) {
			alert('Sono presenti dati non salvati provenienti da altre schede.\n\nPer convalidare l\'importazione è necessario registrare la scheda.');
		}
	}
	
	WindowCartella.utilMostraBoxAttesa(false);
});

var NS_SCHEDA_IVG = new Function();
(function() {
	var _this = this;
	
	this.init = function() {
		
		if($('#hRegistrato').val()=='S'){
			_STATO_PAGINA='E';
		}
		$('#hRegistrato').val('S');
		
		if (document.EXTERN.BISOGNO.value == 'N') {
			document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
		}

		if (_STATO_PAGINA == 'L') {
			document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		}

		try {
			if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
				document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
			}
		} catch (e) {
		}

		try {
			if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
				document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
			}
		} catch (e) {
		}

		$('#txtNote').focus().addClass("expand").parent().css('width', '80%');
		$("textarea.expand").TextAreaExpander(40);

		$('input[name=chkLivello]').each(function(){
			var id = $(this).attr('id').replace(/^[^0-9]+/, '');
			$('#lblDescrizione'+id).attr("for", $(this).attr('id'));
		});

		$('#lblSezione1').parent().css('width','50%').attr('colspan','2');
		$('#lblSezione1').parent().css('width','50%');
		
		$('#txtDataInterruzione, #txtDataCertificazione, #lblConsultorio, #lblAssensoGenitori, #lblAnestesiaGenerale, input[name=rdoRegimeRicovero], #chkNessunaComplicazione').parent().attr('colspan','14');
		$('#lblCondizioneProfessionale, #lblGravidanzePrecedenti').parent().attr('colspan','2');
		$('#lblRilascioCertificazione').parent().css({'vertical-align':'top','padding-top':'10px'}).attr('rowspan','5');
		$('#lblEtaGestazionale, #lblPresenzaMalformazioni, #lblRegimeRicovero').parent().css({'vertical-align':'top','padding-top':'10px'}).attr('rowspan','2');
		$('#lblStatoCivile, #lblTitoloStudio, #lblAssensoMinore').parent().css({'vertical-align':'top','padding-top':'10px'}).attr('rowspan','4');
		$('#lblRamoAttivita, #lblLuogo').parent().css({'vertical-align':'top','padding-top':'10px'}).attr('rowspan','5');
		$('#lblOccupazione, #lblPosizioneProfessionale, #lblTerapiaAntalgica').parent().css({'vertical-align':'top','padding-top':'10px'}).attr('rowspan','6');
		$('#lblComplicazioni').parent().css({'vertical-align':'top','padding-top':'10px'}).attr('rowspan','7');
		$('#lblTipoIntervento').parent().css({'vertical-align':'top','padding-top':'10px'}).attr('rowspan','8');
		
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
		
		// Campi non editabili (sola lettura)
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#6D6D6D','background-color': 'transparent' ,'border':'1px solid transparent'});
	};
	
	this.caricaDati = function() {
		switch(_STATO_PAGINA) {
		
		// Dati precompilati in fase di inserimento nuova scheda
		case 'I':
			$('#lblTitle')
				.attr('id','lblTitleBozza')
				.attr('name','lblTitleBozza');
			
			$('#hIdenAnag').val(WindowCartella.getPaziente("IDEN") || 0);
			$('#hCognome').val(WindowCartella.getPaziente("COGN"));
			$('#hNome').val(WindowCartella.getPaziente("NOME"));
			
			NS_FUNCTIONS.assegnaCampoRadioNonRegistrato($('input[name=rdoLuogo]'), $('#rdoIstitutoPubblico').val());

			var rs = WindowCartella.executeQuery("schedaIVG.xml","caricaDati",[WindowCartella.getRicovero('IDEN'), WindowCartella.getPaziente('IDEN')]);
			while(rs.next()){
				var campo = rs.getString("CAMPO");
				var valore = rs.getString("VALORE");
				switch(campo) {
				case 'txtStatoCivile':
					var rdoStatoCivile = '';
					
					if (/(nubile|single|libero|libera|fidanzata|convivente)/gi.test(valore)) {
						rdoStatoCivile = $('input[name=rdoStatoCivile][value=1]').val();
					} else if (/(coniugata|sposata|coniuge|moglie)/gi.test(valore)) {
						rdoStatoCivile = $('input[name=rdoStatoCivile][value=2]').val();
					} else if (/(separata|divorziata)/gi.test(valore)) {
						rdoStatoCivile = $('input[name=rdoStatoCivile][value=3]').val();
					} else if (/(vedova)/gi.test(valore)) {
						rdoStatoCivile = $('input[name=rdoStatoCivile][value=4]').val();
					}
					
					if (typeof rdoStatoCivile === 'string') {
						NS_FUNCTIONS.assegnaCampoRadioNonRegistrato($('input[name=rdoStatoCivile]'), rdoStatoCivile);
					}
					$('#txtStatoCivile').val(valore);
					break;
				case 'hDescrAttivita':
					$('#txtCondizioneProfessionale').val(valore);
					break;
				case 'txtEtaGestazionale':
					var n = parseInt(valore, 10) || 0;
					if (n > 0 && n <= 90) {
						NS_FUNCTIONS.assegnaCampoRadioNonRegistrato($('input[name=rdoEtaGestazionale]'), $('#rdoPrimi90Giorni').val());
					} else if (n > 90) {
						NS_FUNCTIONS.assegnaCampoRadioNonRegistrato($('input[name=rdoEtaGestazionale]'), $('#rdoOltre90Giorni').val());
					}
					break;
				default:
					var obj = document.getElementsByName(campo)[0];
					if (typeof obj === 'object') {
						NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($(obj), valore, false /* non sovrascrive */);
					}
				}
			}
			
			break;
		default:
		}
	};
	
	this.setEvents = function() {
		if (_STATO_PAGINA == 'L') return;

		var rdoPosizioneProfessionale = new Array('rdoImprenditrice','rdoLavoratriceAutonoma', 'rdoDirigente', 'rdoImpiegata', 'rdoOperaia', 'rdoLavoratriceDipendente', 'rdoAgricoltura', 'rdoIndustria', 'rdoCommercio', 'rdoPubblicaAmministrazione', 'rdoAltriServizi');
		NS_FUNCTIONS.enableDisableRadio($('input[name="rdoCondizioneProfessionale"]:radio:checked'), ['1'], rdoPosizioneProfessionale);		
		NS_FUNCTIONS.enableDisable($('input[name="rdoTipoIntervento"]:radio:checked'), ['7'], ['txtAltroIntervento']);
		
		$('input[name="rdoCondizioneProfessionale"]:radio').click(function() {
			NS_FUNCTIONS.enableDisableRadio($('input[name="rdoCondizioneProfessionale"]:radio:checked'), ['1'], rdoPosizioneProfessionale);
		});
		
		$('input[name="rdoTipoIntervento"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoTipoIntervento"]:radio:checked'), [$('#rdoAltroIntervento').val()], ['txtAltroIntervento'], true);
		});
		
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.getElementById('txtDataNascita'));
		oDateMask.attach(document.getElementById('txtDataInterruzione'));
		oDateMask.attach(document.getElementById('txtDataCertificazione'));
		
		// Controllo obbligatorietà valore numerico
	    $('#txtNatiVivi, #txtNatiMorti, #txtAbortiSpontanei, #txtIVG, #txtSettimaneAmenorrea, #txtGiornateAccessi').keydown(NS_FUNCTIONS.controlloNumerico_onkeydown).blur(NS_FUNCTIONS.controlloNumerico_onblur);
		
		// I campi importati da altre schede sono ora registrati nell'xml
		document.body.ok_registra = function() {
			NS_FUNCTIONS.segnalaCampiRegistrati();
		};
	};
	
	this.registra = function() {
		registra();
	};
}).apply(NS_SCHEDA_IVG);
