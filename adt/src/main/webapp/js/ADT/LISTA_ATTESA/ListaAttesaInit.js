jQuery(document).ready(function () {

	_STATO_PAGINA = document.getElementById('STATO_PAGINA').value;
	_ACTION = typeof $('#ACTION').val() == 'undefined' ? null : $('#ACTION').val();

	if (_STATO_PAGINA === 'I'){
		$('#tabs-INS_LISTA_ATTESA li[data-tab!="tabInserimentoLista"]').hide();
		$('#tabs-INS_LISTA_ATTESA li[data-tab="tabInserimentoLista"]').css({"border-top-right-radius" : "6px"});
	}

	if (_STATO_PAGINA === 'E'){
		$('#tabs-LISTA_ATTESA_WRAPPER').click(function(){NS_SCHEDA.setTabulatoreScheda();});
		$(".butSalvaListaEPrericovero").hide();
	}

	if (_ACTION != null) {
		$('#li-' + _ACTION).trigger('click');
	} else {
		NS_LISTA_ATTESA.init();
	}

});

var _STATO_PAGINA = null;

var NS_SCHEDA = {

		setTabulatoreScheda : function(){

			var tabAcctive = $('li.tabActive').attr('data-tab');

			switch  (tabAcctive) {
		        case 'tabInserimentoLista':
		        	NS_LISTA_ATTESA.definisciComportamento();
		            break;
		        case 'tabAttivitaLista':
		        	NS_LISTA_ATTESA_ATTIVITA.init();
		        	NS_LISTA_ATTESA_ATTIVITA.Events.setEvents();
		            break;
		        case 'tabRiepilogoLista':
		        	NS_LISTA_ATTESA_RIEPILOGO.init();
		            break;
		        default :
					logger.error("Tabulatore non riconosciuto " + tabAcctive);
					//return alert('ATTENZIONE TABULATORE NON RICONOSCIUTO');
		    }
		}
};
