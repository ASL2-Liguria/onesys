/**
 * File JavaScript in uso dalla scheda Geneva Score.
 * 
 * @author	gianlucab
 * @version	1.1
 * @since	2014-12-09
 */

var WindowCartella = null;
var enableStampa = false;

$(document).ready(function() {
	// Gestione dell'apertura della pagina da finestra modale o dal menu
	if (typeof window.dialogArguments === 'object') {
		window.WindowCartella = window.dialogArguments.top.window;
	} else {
		window.WindowCartella = window;
		while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
			window.WindowCartella = window.WindowCartella.parent;
		}
	}

	window.baseReparti = WindowCartella.baseReparti;
	window.baseGlobal = WindowCartella.baseGlobal;
	window.basePC = WindowCartella.basePC;
	window.baseUser = WindowCartella.baseUser;

	try {
		SCALA_GENEVA.init();
		SCALA_GENEVA.caricaDati();
		SCALA_GENEVA.setEvents();
	} catch (e) {
		alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message);
	}
    
	try {
		/*catch nel caso non venga aperta dalla cartella*/
		WindowCartella.utilMostraBoxAttesa(false);
	} catch (e) {}
});

var SCALA_GENEVA = {};
(function() {
	/* private attributes and methods */
	var _this = this;
	
	var punteggio = new Array();
	var codifiche = new Array();
	
	function SommaPunteggio(array) {
		var ret = 0;
		if(Object.prototype.toString.call(array) !== '[object Array]') {
		    return ret;
		}
		for (var key in array) {
			ret += array[key];
		}
		if (ret > 0) ret += _this.offset;
		return ret;
	}
	
	/* public attributes and methods */
	this.offset = 0;
	
	this.init = function() {
		if ($("form[name=EXTERN] input[name=BISOGNO]").val()=='N'){
			$('#lblChiudi').parent().parent().hide();
		}

		if (_STATO_PAGINA == 'L'){
			$('#lblRegistra').parent().parent().hide();
		}

		try {
			if(!enableStampa || !WindowCartella.ModalitaCartella.isStampabile(document)){
				$('#lblStampa').parent().parent().hide();
			}
		} catch (e) {}
		
		// Aggiunge l'attributo "for" alle label accanto a radio input e checkbox
		NS_FUNCTIONS.addForLabel();
		
		// Layout
		$('td.classTdLabelLink label').not('#lblAtelectasia, #lblEmidiaframma').parent().attr("colspan","2");
		$('input[name=rdoAtelectasia][value=0]').parent().attr("colspan", $('input[name=rdoEmidiaframma][value=0]').parent().attr("colspan"));
		$('#lblRisultatiRadiografia').parent().attr("rowspan", "2");
		$('td.classTdLabelLink label').not('#lblPunteggioTotale').addClass('labelLink').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div/>').addClass('help'));
		$('#lblLegenda').parent().css({"text-align":"justify", "padding-right":"5px"});

		// Attributi readonly
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color': '#000000','background-color': 'transparent' ,'border':'1px solid transparent'});
	};
	
	this.caricaDati = function() {
		$('td.classTdField input:radio').each(function(){
			var name = $(this).attr("name");
			var id = $(this).attr("id");
			
			if (typeof codifiche[name] === 'undefined') {
				codifiche[name] = new Array();
			}
			codifiche[name].push({title: "("+$(this).val()+")",  text: $('label[for="'+id+'"]').text()});
		});
	};
	
	this.setEvents = function() {
		// Apre il popup di aiuto
		$('.help').live('click', function() {
			_this.openPopup($(this).parent().find('label').attr('id'));
		});
		
		// Aggiorna il punteggio al load e al click dei campi
		$('input[type=radio]:checked').each(function() {
			_this.countChecked($(this), false, "txtPunteggioTotale");
		}).live('click', function() {
			_this.countChecked($(this), true,  "txtPunteggioTotale");
		});
	};
	
	this.openPopup = function(id) {
		var obj = new Object();
		obj.id = 'divPopUpInfo';
		obj.width = 500;
		obj.height = 280;
		obj.title = "";
		obj.content = [];
		var name = id.replace("lbl", "rdo");
		
		switch (id) {
			default:
				obj.title = ritornaJsMsg(id);
				obj.content = codifiche[name];
				break;
		}
		NS_FUNCTIONS.openTablePopup(obj);
	};
	
	this.countChecked = function(input, update, idTotale) {
		update = (typeof update === "boolean") ? update : true;
		var p = parseInt(input.val());
		if (typeof punteggio[idTotale] === 'undefined') {
			punteggio[idTotale] = new Array();
		}
		punteggio[idTotale][input.attr('name')] = isNaN(p) ? 0 : p;
		if (update) $('#'+idTotale).attr('value', SommaPunteggio(punteggio[idTotale]));
	};
    
	this.registra = function() {
		registra();
	};
	
	this.chiudi = function() {
		self.close();
	};
	
	this.stampa = function() {
		try {
			var vDati       = WindowCartella.getForm();
			var iden_visita = vDati.iden_ricovero;
			var funzione    = document.EXTERN.KEY_LEGAME.value;
			var reparto     = vDati.reparto;
			var anteprima   = 'S';
			var sf          = '&prompt<pVisita>='+iden_visita;

			WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);		
		} catch(e) {
			window.alert(e.message);
		}
	};
}).apply(SCALA_GENEVA);
