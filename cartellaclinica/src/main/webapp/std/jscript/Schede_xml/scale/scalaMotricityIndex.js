/**
 * File JavaScript in uso dalla scheda Scala Motricity Index.
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
    	MOTRICITY.init();
    	MOTRICITY.caricaDati();
    	MOTRICITY.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    
    try {
    	/*catch nel caso non venga aperta dalla cartella*/
    	WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {}
});

var MOTRICITY = {};
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
		$('#lblPresaPinzaDx, #lblFlessioneGomitoDx, #lblAbduzioneSpallaDx, #lblPresaPinzaSx, #lblFlessioneGomitoSx, #lblAbduzioneSpallaSx, #lblDorsiflessioneCavigliaDx, #lblEstensioneGinocchioDx, #lblFlessioneAncaDx, #lblDorsiflessioneCavigliaSx, #lblEstensioneGinocchioSx, #lblFlessioneAncaSx').addClass('labelLink').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div/>').addClass('help'));

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
		$('#txtTotaleArtoSuperioreDx').parent().append("<input class='totale'/ name='txtTotale' value='/100'/>");
		$('#txtTotaleArtoSuperioreSx').parent().append("<input class='totale'/ name='txtTotale' value='/100'/>");
		$('#txtTotaleArtoInferioreDx').parent().append("<input class='totale'/ name='txtTotale' value='/100'/>");
		$('#txtTotaleArtoInferioreSx').parent().append("<input class='totale'/ name='txtTotale' value='/100'/>");
		
		// Arrotondamento punteggi
		this.offset = 1;
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
		obj.title = "";
		obj.content = [];
		
		switch (id.replace(/(Dx|Sx)$/i,"")) {
			case 'lblPresaPinza':
				obj.title = ritornaJsMsg(id)+": \"Afferri un oggetto tra il pollice e l'indice e lo ponga su una superficie piana\".";
				obj.height = 300;
				obj.content = [
					{title: "(0)",  text: 'Nessun movimento.'},
					{title: "(11)", text: 'Inizio di prensione, qualche movimento di pollice o indice.'},
					{title: "(19)", text: 'Presa possibile ma non contro gravità (l\'oggetto cade quando viene sollevato).'},
					{title: "(22)", text: 'Presa possibile contro gravità ma non contro resistenza (l\'oggetto può essere rimosso con facilità).'},
					{title: "(26)", text: 'Presa possibile contro resistenza ma più debole della controlaterale.'},
					{title: "(33)", text: 'Presa normale.'}
				];
                break;
			case 'lblFlessioneGomito':
            	obj.title = ritornaJsMsg(id)+": \"Con il gomito flesso a 90°, avambraccio orizzontale e braccio verticale, pieghi il gomito in modo che la sua mano tocchi la spalla\".";
        		obj.height = 350;
				obj.content = [
					{title: "(0)",  text: 'Nessun movimento.'},
					{title: "(9)",  text: 'Contrazione palpabile del muscolo ma senza movimento apprezzabile.'},
					{title: "(14)", text: 'Movimento visibile ma non per l\'intero range articolare o contro gravità (non è visibile alcun movimento, ma il gomito resta flesso a 90°).'},
					{title: "(19)", text: 'Movimento possibile per l\'intero range articolare contro gravità ma non contro resistenza.'},
					{title: "(25)", text: 'Movimento possibile contro resistenza ma più debole del controlaterale.'},
					{title: "(33)", text: 'Movimento eseguito con forza normale.'}
				];
				break;
			case 'lblAbduzioneSpalla':
            	obj.title = ritornaJsMsg(id)+": \"Con il gomito completamente flesso e contro il petto, abduca il braccio.\".";
        		obj.height = 320;
				obj.content = [
					{title: "(0)",  text: 'Nessun movimento.'},
					{title: "(9)",  text: 'Contrazione palpabile del muscolo ma senza movimento apprezzabile.'},
					{title: "(14)", text: 'Movimento visibile ma non per l\'intero range articolare o contro gravità.'},
					{title: "(19)", text: 'Movimento possibile per l\'intero range articolare contro gravità ma non contro resistenza (abduce più di 90°, oltre l\'orizzontale).'},
					{title: "(25)", text: 'Movimento possibile contro resistenza ma più debole del controlaterale.'},
					{title: "(33)", text: 'Movimento eseguito con forza normale.'}
				];
				break;
			case 'lblDorsiflessioneCaviglia':
				obj.title = ritornaJsMsg(id)+": \"Con i piedi rilassati in posizione di flessione plantare, fletta il dorso del piede\".";
				obj.height = 320;
				obj.content = [
					{title: "(0)",  text: 'Nessun movimento.'},
					{title: "(9)",  text: 'Contrazione palpabile del muscolo ma senza movimento apprezzabile.'},
					{title: "(14)", text: 'Movimento visibile ma non per l\'intero range articolare o contro gravità (meno dell\'intero range articolare della dorsiflessione).'},
					{title: "(19)", text: 'Movimento possibile per l\'intero range articolare contro gravità ma non contro resistenza.'},
					{title: "(25)", text: 'Movimento possibile contro resistenza ma più debole del controlaterale.'},
					{title: "(33)", text: 'Movimento eseguito con forza normale.'}
				];
                break;
			case 'lblEstensioneGinocchio':
            	obj.title = ritornaJsMsg(id)+": \"Con i piedi appoggiati e le ginocchia a 90°, estenda completamente il ginocchio\".";
				obj.height = 380;
				obj.content = [
					{title: "(0)",  text: 'Nessun movimento.'},
					{title: "(9)",  text: 'Contrazione palpabile del muscolo ma senza movimento apprezzabile.'},
					{title: "(14)", text: 'Movimento visibile ma non per l\'intero range articolare o contro gravità (meno dell\'estensione completa).'},
					{title: "(19)", text: 'Movimento possibile per l\'intero range articolare contro gravità ma non contro resistenza (ginocchio esteso completamente, ma può essere spinto giù facilmente).'},
					{title: "(25)", text: 'Movimento possibile contro resistenza ma più debole del controlaterale.'},
					{title: "(33)", text: 'Movimento eseguito con forza normale.'}
				];
				break;
			case 'lblFlessioneAnca':
            	obj.title = ritornaJsMsg(id)+": \"In posizione seduta con le anche flesse a 90°, sollevi il ginocchio verso il mento\".";
				obj.height = 350;
				obj.content = [
					{title: "(0)",  text: 'Nessun movimento.'},
					{title: "(9)",  text: 'Contrazione palpabile del muscolo ma senza movimento apprezzabile.'},
					{title: "(14)", text: 'Movimento visibile ma non per l\'intero range articolare o contro gravità (meno del range completo della flessione).'},
					{title: "(19)", text: 'Movimento possibile per l\'intero range articolare contro gravità ma non contro resistenza (flessione completa, ma può essere facilmente spinta giù).'},
					{title: "(25)", text: 'Movimento possibile contro resistenza ma più debole del controlaterale.'},
					{title: "(33)", text: 'Movimento eseguito con forza normale.'}
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
}).apply(MOTRICITY);
