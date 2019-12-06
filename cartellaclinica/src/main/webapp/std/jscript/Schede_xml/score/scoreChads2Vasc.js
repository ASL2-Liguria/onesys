/**
 * File JavaScript in uso dalla scheda CHA2DS2-VASC Score.
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
		
		$('td.classTdLabelLink label').not('#lblChads2VascTotale, #lblChads2VascPerc').addClass('labelLink').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div/>').addClass('help'));
		
		// Campi non editabili (sola lettura)
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color': '#000000','background-color': 'transparent' ,'border':'1px solid transparent'});
		
		// Textarea espandibili
		$('textarea').TextAreaExpander(20);
	};
	
	this.caricaDati = function() {
		// Seleziona l'età
		var eta = clsDate.getAge(clsDate.str2date(WindowCartella.getPaziente("DATA"), 'YYYYMMDD')) || NaN;
		if (!isNaN(eta) && !$('input[name="chkChads2VascDom3"]:checked').val() && !$('input[name="chkChads2VascDom7"]:checked').val()) {
			if (eta >= 75) {
				$("#chkChads2VascDom3a").attr("checked", true);
				$("#chkChads2VascDom7b").attr("checked", true);
			} else if (eta >= 65) {
				$("#chkChads2VascDom3b").attr("checked", true);
				$("#chkChads2VascDom7a").attr("checked", true);
			} else {
				$("#chkChads2VascDom3b").attr("checked", true);
				$("#chkChads2VascDom7b").attr("checked", true);
			}
		}
		
		// Seleziona il sesso
		var sesso = WindowCartella.getPaziente('SESSO');
		if (/[MF]/i.test(sesso) && !$('input[name="chkChads2VascDom8"]:checked').val()) {
			$('input[name="chkChads2VascDom8"][value="'+WindowCartella.getPaziente('SESSO')+'"]').attr("checked", true);
		}
		
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
				$(this).click(function(){
					// Controllo sull'età
					if ("chkChads2VascDom3a" === $(this).attr('id') && $("#chkChads2VascDom7a").is(":checked")) {
						$("#chkChads2VascDom7b").attr("checked", true);
					} else if ("chkChads2VascDom7a" === $(this).attr('id') && $("#chkChads2VascDom3a").is(":checked")) {
						$("#chkChads2VascDom3b").attr("checked", true);
					}
					countCheck();
				});
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
			case "chkChads2VascDom3a":
			case "chkChads2VascDom5a":
				return 2;
			case "chkChads2VascDom1a":
			case "chkChads2VascDom2a":
			case "chkChads2VascDom4a":
			case "chkChads2VascDom6a":
			case "chkChads2VascDom7a":
			case "chkChads2VascDom8b":
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
		
		$('#txtChads2VascTotale').val(punteggio);
		getPercentualeRischio(punteggio);
	}
	
	function getPercentualeRischio(points) {
		//alert(points);		
		var percentuale	= '0%';
		switch (points){
		case 0 :
			percentuale	= '0%';
			break;
		case 1 :
			percentuale	= '1.3%';
			break;
		case 2 :
			percentuale	= '2.2%';
			break;
		case 3 :
			percentuale	= '3.2%';
			break;
		case 4 :
			percentuale	= '4.0%';
			break;
		case 5 :
			percentuale	= '6.7%';
			break;
		case 6 :
			percentuale	= '9.8%';
			break;
		case 7 :
			percentuale	= '9.6%';
			break;
		case 8 :
			percentuale	= '6.7%';
			break;
		case 9 :
			percentuale	= '15.2%';
			break;
		default:
			percentuale	= 'N/D';
			break;
		}
		$('#txtChads2VascPerc').val(percentuale);
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
