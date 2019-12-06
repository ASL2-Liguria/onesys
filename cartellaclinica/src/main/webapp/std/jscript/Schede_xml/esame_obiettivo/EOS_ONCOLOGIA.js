/**
 * File JavaScript in uso dalla scheda 'EOS_ONCOLOGIA'.
 * 
 * @author	gianlucab
 * @version	1.0
 * @since	2014-09-05
 */

var WindowCartella = null;
$(function() {
	window.WindowCartella = window;
	while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
		window.WindowCartella = window.WindowCartella.parent;
	}
    baseReparti = WindowCartella.baseReparti;
    baseGlobal = WindowCartella.baseGlobal;
    basePC = WindowCartella.basePC;
    baseUser = WindowCartella.baseUser;


	try {
		WindowCartella.utilMostraBoxAttesa(false);
	} catch (e) {
		/*catch nel caso non venga aperta dalla cartella*/
	}

	try {
		EOS_ONCOLOGIA.init();
		EOS_ONCOLOGIA.setEvents();
	} catch (e) {
		alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
	}
});

var EOS_ONCOLOGIA = {};
(function() {
	
	/* Metodi e attributi pubblici */
	this.init = function() {
		try {
			eval(baseReparti.getValue(top.getForm(document).reparto, 'ESAME_OBIETTIVO_SPECIALISTICO'));
		} catch (e) {
			alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
		}

		//NS_FUNCTIONS.hideRecordsPrint('lblregistra', 'lblstampa');

		if(_STATO_PAGINA == 'L') {
			$("#lblregistra").parent().parent().hide();
			$("td[class=classTdLabelLink]").attr('disabled', 'disabled');
		}
		
		if (!top.ModalitaCartella.isStampabile(document)) {
			document.getElementById('lblstampa').parentElement.parentElement.style.display = 'none';
		}
	};
	
	this.setEvents = function() {
        var maxLength = 4000;
        var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
		jQuery("textarea").addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
            maxlength(this, maxLength, msg);
        });

		jQuery("textarea[class*=expand]").TextAreaExpander();
	};

	this.registraEsameObiettivoSpecialistico = function() {
		//alert("registraEsameObiettivoSpecialistico");
		NS_FUNCTIONS.records();
	};
	
	this.stampaEsameObiettivoSpecialistico = function() {
		//alert("stampaEsameObiettivoSpecialistico");
		NS_FUNCTIONS.print('ESAME_OBIETTIVO_SPECIALISTICO', 'S');
	};

	/* Medoti e attributi privati */
	
}).apply(EOS_ONCOLOGIA);

// Stampa la scheda
function stampa(){
	try {
		var vDati 		= WindowCartella.getForm();
		var iden_visita	= vDati.iden_ricovero;
		var funzione	= document.EXTERN.FUNZIONE.value;
		var reparto		= vDati.reparto;
		var anteprima	= 'S';
		var sf			= '&prompt<pVisita>='+iden_visita;

		WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);		
	} catch(e) {
		window.alert(e.message);
	}
}
