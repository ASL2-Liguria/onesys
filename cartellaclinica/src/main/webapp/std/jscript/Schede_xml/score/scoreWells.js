/**
 * File JavaScript in uso dalla scheda Wells Score.
 * 
 * @author  gianlucab
 * @version 1.0
 * @since   2016-04-22
 */
var WindowCartella = null;

$(document).ready(function() {
	window.WindowCartella = window;
	while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
		window.WindowCartella = window.WindowCartella.parent;
	}
	window.baseReparti = WindowCartella.baseReparti;
	window.baseGlobal = WindowCartella.baseGlobal;
	window.basePC = WindowCartella.basePC;
	window.baseUser = WindowCartella.baseUser;
	
	try {
		NS_MANAGE_PAGE.init();
		NS_MANAGE_PAGE.caricaDati();
		NS_MANAGE_PAGE.setEvents();
	} catch (e) {
		alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message);
	}
	
    try {
    	/*catch nel caso non venga aperta dalla cartella*/
    	WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {}
});

var NS_MANAGE_PAGE = new Function();
(function() {
	/* private attributes and methods */
	var _this = this;
	
	var codifiche = new Object();
	
	this.init = function() {
		switch(_STATO_PAGINA) {
			case 'I':
			case 'E':
				if (typeof WindowCartella.DatiNonRegistrati === 'object') {
					WindowCartella.DatiNonRegistrati.init(window);
					document.body.ok_registra = function(){
						WindowCartella.DatiNonRegistrati.reset();
					};
				}
				break;
			case 'L':
				document.getElementById('lblRegistra').parentElement.style.display = 'none';
				break;
			default:
		}
		
		// Aggiunge l'attributo "for" alle label accanto a radio input e checkbox
		NS_FUNCTIONS.addForLabel("%z");
		
		$('.classTdLabelLink').css('width', '300px');
		$('#lblLegenda').parent().css('width','auto');
		
		$('td.classTdLabelLink label').not('#lblWellsTotale, #lblWellsPerc').addClass('labelLink').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div/>').addClass('help'));
		
		// Campi non editabili (sola lettura)
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color': '#000000','background-color': 'transparent' ,'border':'1px solid transparent'});
		
		// Textarea espandibili
		$('textarea').TextAreaExpander(20);
	};
	
	this.caricaDati = function() {
		$('td.classTdField input:radio').each(function(){
			var name = $(this).attr("name");
			var id = $(this).attr("id");
			
			if(typeof codifiche[name] === 'undefined') {
				codifiche[name] = new Array();
			}
			codifiche[name].push({title: "("+getValoreRisposta(id)+")", text: $('label[for="'+id+'"]').text()});
		});
	};
	
	/**
	 * Al caricamento della pagina setta l'handler che al click del radio button fa il conteggio
	 */
	this.setEvents = function() {
		// Apre il popup di aiuto
		$('.help').live('click', function() {
			openPopup($(this).parent().find('label').attr('id'));
		});
		
		// Imposta il click sui radio button per aggiornare il punteggio di score
		$('input:radio, input:checkbox').each(
			function(){
				$(this).click(countCheck);
			}
		);
	};
	
	this.registra = function() {
		registra();
	};
	
	/**
	 * Restituisce il punteggio della risposta selezionata
	 * 
	 * @param {String} id     identificativo dell'input radio o checkbox
	 * @returns {Number}      punteggio
	 */
	function getValoreRisposta(id) {
		switch(id) {
			case "chkWellsDom1a":
			case "chkWellsDom2a":
			case "chkWellsDom5a":
				return 1.5;
			case "chkWellsDom6a":
			case "chkWellsDom7a":
				return 3;
			case "chkWellsDom3a":
			case "chkWellsDom4a":
				return 1;
			default:
		}
		return 0;
	}
	
	/**
	 * Calcola il punteggio e imposta il risultato totale
	 */
	function countCheck() {
		// Conta i valori dello score
		var punteggio = 0;
		
		// Calcola il punteggio di score per i radio button e i checkbox selezionati
		$('input:radio:checked, input:checkbox:checked').each(
			function(){
				punteggio += getValoreRisposta($(this).attr('id'));
			}
		);
		
		$('#txtWellsTotale').val(punteggio);
		getPercentualeRischio(punteggio);
	}
	
	function getPercentualeRischio(points) {
		//alert(points);		
		var percentuale	= '0%';
		if (points < 2) {
			percentuale	= '1.3%';
		} else if (points <= 6) {
			percentuale	= '16.2%';
		} else {
			percentuale	= '37.5%';
		}
		$('#txtWellsPerc').val(percentuale);
	}
	
	function openPopup(id) {
		var obj = new Object();
		obj.id = 'divPopUpInfo';
		obj.width = 500;
		obj.height = 280;
		obj.title = "";
		obj.content = [];
		var name = id.replace("lbl", "chk");
		
		switch (id) {
			default:
				obj.title = ritornaJsMsg(id);
				obj.content = codifiche[name];
				break;
        }
		NS_FUNCTIONS.openTablePopup(obj);
    }
}).apply(NS_MANAGE_PAGE);
