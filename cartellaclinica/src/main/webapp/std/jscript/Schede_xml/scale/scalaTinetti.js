/**
 * File JavaScript in uso dalla scheda Scala Tinetti.
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
    	TINETTI.init();
    	TINETTI.caricaDati();
    	TINETTI.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    
    try {
    	/*catch nel caso non venga aperta dalla cartella*/
    	WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {}
});

var TINETTI = {};
(function() {
	/* private attributes and methods */
	var _this = this;
	
	var punteggio = new Array();
	var idTinettiScore = 'txtTinettiScore';
	var codifiche = new Array();
	
	function SommaPunteggio(array) {
		var ret = 0;
		if(Object.prototype.toString.call(array) !== '[object Array]') {
		    return ret;
		}
		for (var key in array) {
			ret += array[key];
		}
		return ret;
	}
	
	/* public attributes and methods */
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
		$('#lblEquilibrioDaSeduto, #lblAlzarsiDallaSedia, #lblTentativoDiAlzarsi, #lblEquilibrioImmediato, #lblEquilibrioProlungato, #lblSpintaLeggera, #lblOcchiChiusi, #lblRotazione, #lblSedersi, '+
		  '#lblPartenza, #lblLunghezzaPassoDx, #lblAltezzaPassoDx, #lblLunghezzaPassoSx, #lblAltezzaPassoSx, #lblSimmetriaPasso, #lblContinuitaPasso, #lblTraiettoria, #lblStabilita, #lblCammino').addClass('labelLink').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div/>').addClass('help'));
		$('#lblLegenda').parent().css({"text-align":"justify", "padding-right":"5px"});
		$('#lblPunteggioEquilibrio, #lblPunteggioAndatura'/*, #lblTinettiScore*/).css("cursor", "pointer").parent().attr("class", "classTdLabel");
		
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
		$('#txtPunteggioEquilibrio').parent().append("<input class='totale'/ name='txtTotale' value='/16'/>");
		$('#txtPunteggioAndatura').parent().append("<input class='totale'/ name='txtTotale' value='/12'/>");
		$('#txtTinettiScore').parent().append("<input class='totale'/ name='txtTotale' value='/28'/>");
	};
	
	this.caricaDati = function() {
		var pBinds = [];
		pBinds.push('SCALA_TINETTI');
		var rs = WindowCartella.executeQuery("configurazioni.xml","getTabCodificheScheda",pBinds);
		while(rs.next()) {
			var name = rs.getString("tipo_dato");
			if (typeof codifiche[name] === 'undefined') {
				codifiche[name] = new Array();
			}
			codifiche[name].push({title: "("+rs.getString("codice")+")",  text: rs.getString("descrizione")});
		}
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
	
    this.countChecked = function(inputName, update, idTotale) {
    	update = (typeof update === "boolean") ? update : true;
		var id = $('input[name="'+inputName+'"]:radio:checked');
		var p = parseInt(id.attr('value'));
		if (typeof punteggio[idTotale] === 'undefined') {
			punteggio[idTotale] = new Array();
		}
		punteggio[idTotale][id.attr('name')] = isNaN(p) ? 0 : p;

		/* Punteggio complessivo */
		if (typeof punteggio[idTinettiScore] === 'undefined') {
			punteggio[idTinettiScore] = new Array();
		}
		punteggio[idTinettiScore][id.attr('name')] = isNaN(p) ? 0 : p;
		
		if (update) {
			$('#'+idTotale).attr('value', SommaPunteggio(punteggio[idTotale]));
			$('#'+idTinettiScore).attr('value', SommaPunteggio(punteggio[idTinettiScore]));
		}
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
}).apply(TINETTI);
