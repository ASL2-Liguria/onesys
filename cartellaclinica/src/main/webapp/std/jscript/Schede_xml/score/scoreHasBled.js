/**
 * File JavaScript in uso dalla scheda HAS-BLED Score.
 * 
 * @author  alessandroa
 * @author  matteop
 * @author  gianlucab
 * @version 1.4
 * @since   2012-08-14
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
		
		$('td.classTdLabelLink label').not('#lblHasBledTotale, #lblHasBledPerc').addClass('labelLink').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div/>').addClass('help'));
		
		// Campi non editabili (sola lettura)
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color': '#000000','background-color': 'transparent' ,'border':'1px solid transparent'});
		
		// Textarea espandibili
		$('textarea').TextAreaExpander(20);
	};
	
	this.caricaDati = function() {
		// Seleziona l'età
		var eta = clsDate.getAge(clsDate.str2date(WindowCartella.getPaziente("DATA"), 'YYYYMMDD')) || NaN;
		if (!isNaN(eta) && !$('input[name="chkHasBledDom6"]:checked').val()) {
			if (eta > 65) {
				$("#chkHasBledDom6a").attr("checked", true);
			} else  {
				$("#chkHasBledDom6b").attr("checked", true);
			}
		}
		
		$('td.classTdField input:radio').each(function(){
			var name = $(this).attr("name");
			var id = $(this).attr("id");
			
			if(typeof codifiche[name] === 'undefined') {
				codifiche[name] = new Array();
			}
			codifiche[name].push({title: "("+getValoreRisposta(id)+")", text: $('label[for="'+id+'"]').text()});
		});
		
		$(['chkHasBledDom2', 'chkHasBledDom7']).each(function(i, name){
			$('td.classTdField input[type="checkbox"][name^="'+name+'"]').each(function(){
				var id = $(this).attr("id");
				
				if(typeof codifiche[name] === 'undefined') {
					codifiche[name] = new Array();
				}
				
				var descrizione = arrayLabelValue[$.inArray(id.replace('chk','lbl'), arrayLabelName)];
				codifiche[name].push({title: "("+getValoreRisposta(id)+")", text: descrizione});
			});
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
		var chkHasBledDom2 = {'00': 'No', '10': arrayLabelValue[$.inArray('lblHasBledDom2a', arrayLabelName)], '01': arrayLabelValue[$.inArray('lblHasBledDom2b', arrayLabelName)], '11': 'Entrambe le disfunzioni'};
		var chkHasBledDom7 = {'00': 'No', '10': arrayLabelValue[$.inArray('lblHasBledDom7a', arrayLabelName)], '01': arrayLabelValue[$.inArray('lblHasBledDom7b', arrayLabelName)], '11': 'Entrambe le assunzioni'};
		var val2 = ($('input[name="chkHasBledDom2a"]').is(':checked') ? '1' : '0') + ($('input[name="chkHasBledDom2b"]').is(':checked') ? '1' : '0');
		var val7 = ($('input[name="chkHasBledDom7a"]').is(':checked') ? '1' : '0') + ($('input[name="chkHasBledDom7b"]').is(':checked') ? '1' : '0');
		
		$('input[name="chkHasBledDom2"]').val(chkHasBledDom2[val2]);
		$('input[name="chkHasBledDom7"]').val(chkHasBledDom7[val7]);
		
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
			case "chkHasBledDom1a":
			case "chkHasBledDom2a":
			case "chkHasBledDom2b":
			case "chkHasBledDom3a":
			case "chkHasBledDom4a":
			case "chkHasBledDom5a":
			case "chkHasBledDom6a":
			case "chkHasBledDom7a":
			case "chkHasBledDom7b":
				// In questa scala tutte le risposte affermative valgono 1
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
		
		$('#txtHasBledTotale').val(punteggio);
		getPercentualeRischio(punteggio);
	}
	
	function getPercentualeRischio(points) {
		//alert(points);		
		var percentuale	= '0%';
		switch (points){
		case 0 :
			percentuale	= '1.13%';
			break;
		case 1 :
			percentuale	= '1.02%';
			break;
		case 2 :
			percentuale	= '1.88%';
			break;
		case 3 :
			percentuale	= '3.74%';
			break;
		case 4 :
			percentuale	= '8.7%';
			break;
		case 5 :
			percentuale	= '12.5%';
			break;
		default:
			percentuale	= 'N/D';
			break;
		}
		$('#txtHasBledPerc').val(percentuale);
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
