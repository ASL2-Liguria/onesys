/**
 * File JavaScript in uso dalla scheda Scala Trunk Control Test.
 * 
 * @author	gianlucab
 * @version	1.0
 * @since	2014-11-05
 */

var WindowCartella = null;
var punteggio = new Array();

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
    	SCALA_TCT.init();
    	SCALA_TCT.caricaDati();
    	SCALA_TCT.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    
    try {
    	/*catch nel caso non venga aperta dalla cartella*/
    	WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {}
});

var SCALA_TCT = {};
(function() {
	/* private attributes and methods */
	var _this = this;
	
	var punteggio = new Array();
	
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
		if (document.EXTERN.BISOGNO.value=='N'){
			document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
		}

		if (_STATO_PAGINA == 'L'){
			document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		}

		try {
			if(!WindowCartella.ModalitaCartella.isStampabile(document)){
				document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
			}
		} catch (e) {}
		
		// Layout
		$('#lblGirarsiLatoMalato, #lblGirarsiLatoSano, #lblPassaggioSupinoSeduto, #lblEquilibrioDaSeduto').addClass('labelLink').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div/>').addClass('help'));
		$('#lblLegenda').parent().css({"text-align":"justify", "padding-right":"5px"});

		// Attributi readonly
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#000000','background-color': 'transparent' ,'border':'1px solid transparent', 'text-align':'right'});
		
		// Aggiunta attributo "for" per le label accanto ai radio input
		$("input:radio").each(function() {
			var label = $(this).parent().find("label");

			if (typeof label[0] === 'object') {
				var idname = $(this).attr('name')+$(this).val();
				$(this).attr("id", idname);
				label.attr("for", idname);
			}
		});
		
		// Aggiunta attributo "for" per le label accanto ai check input
		$('label[name^=lblchk]').each(function () {
			var idname = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/, "$2");
			$(this).attr("for", idname);
		});
		
		// Inizializzazione dei punteggi
		$('#txtPunteggioTotale').parent().append("<input class='totale'/ name='txtTotale' value='/100'/>");
	};
	
	this.caricaDati = function() {
	};
	
	this.setEvents = function() {
		// Apre il popup di aiuto
		$('.help').live('click', function() {
			_this.openPopup($(this).parent().find('label').attr('id'));
		});
	};
	
	this.openPopup = function(id) {
		var obj = new Object();
		obj.id = 'divPopUpInfo';
		obj.width = 900;
		obj.height = 280;
		obj.title = "";
		obj.content = [];
		
		switch (id) {
			case 'lblGirarsiLatoMalato':
				obj.title = ritornaJsMsg(id)+": \"Dalla posizione supina, si giri sul lato patologico. Può tirarsi/spingersi sul letto con l'arto sano\".";
				obj.content = [
					{title: "(0) Incapace di eseguire",  text: 'Il paziente necessita dell\'aiuto di un assistente (anche minimo contatto fisico) per eseguire quanto richiesto.'},
					{title: "(12) Capace ma con caratteristiche non nella norma", text: 'Il paziente è in grado di effettuare il movimento richiesto soltanto aggrappandosi a sponde, trapezi, persone.'},
					{title: "(25) Capace normalmente", text: 'Il paziente effettua il movimento in maniera normale.'}
				];
                break;
			case 'lblGirarsiLatoSano':
				obj.title = ritornaJsMsg(id)+": \"Dalla posizione supina, si giri sul lato sano\".";
				obj.content = [
					{title: "(0) Incapace di eseguire",  text: 'Il paziente necessita dell\'aiuto di un assistente (anche minimo contatto fisico) per eseguire quanto richiesto.'},
					{title: "(12) Capace ma con caratteristiche non nella norma", text: 'Il paziente è in grado di effettuare il movimento richiesto soltanto aggrappandosi a sponde, trapezi, persone.'},
					{title: "(25) Capace normalmente", text: 'Il paziente effettua il movimento in maniera normale.'}
				];
                break;
			case 'lblPassaggioSupinoSeduto':
				obj.title = ritornaJsMsg(id)+": \"Si sieda partendo dalla posizione supina. Può spingersi/tirarsi con gli arti superiori\".";
				obj.content = [
					{title: "(0) Incapace di eseguire",  text: 'Il paziente necessita dell\'aiuto di un assistente (anche minimo contatto fisico) per eseguire quanto richiesto.'},
					{title: "(12) Capace ma con caratteristiche non nella norma", text: 'Il paziente è in grado di effettuare il movimento richiesto soltanto aggrappandosi a sponde, trapezi, persone.'},
					{title: "(25) Capace normalmente", text: 'Il paziente effettua il movimento in maniera normale.'}
				];
                break;
			case 'lblEquilibrioDaSeduto':
				obj.title = ritornaJsMsg(id)+": \"Seduto sul bordo del letto, piedi non appoggiati a terra, rimanga seduto in equilibrio per 30 secondi\".";
				obj.content = [
					{title: "(0) Incapace di eseguire",  text: 'Il paziente necessita dell\'aiuto di un assistente (anche minimo contatto fisico) per eseguire quanto richiesto.'},
					{title: "(12) Capace ma con caratteristiche non nella norma", text: 'Il paziente è in grado di effettuare il movimento richiesto soltanto aggrappandosi a sponde, trapezi, persone.'},
					{title: "(25) Capace normalmente", text: 'Il paziente effettua il movimento in maniera normale.'}
				];
                break;
        }
		NS_FUNCTIONS.openTablePopup(obj);
    };
	
    this.countChecked = function(inputName, update, idTotale) {
    	update = (typeof update === "boolean") ? update : true;
		var id = $('input[name="'+inputName+'"]:radio:checked');
		var p = parseInt(id.attr('value'));
		if (typeof punteggio[idTotale] === 'undefined') {
			punteggio[idTotale] = new Array();
		}
		punteggio[idTotale][id.attr('name')] = isNaN(p) ? 0 : p;
		
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
		    var vDati 		= WindowCartella.getForm();
		    var iden_visita	= vDati.iden_ricovero;
		    var funzione	= document.EXTERN.KEY_LEGAME.value;
		    var reparto		= vDati.reparto;
		    var anteprima	= 'S';
		    var sf			= '&prompt<pVisita>='+iden_visita;

		    WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);		
		} catch(e) {
			window.alert(e.message);
		}
	};
}).apply(SCALA_TCT);
