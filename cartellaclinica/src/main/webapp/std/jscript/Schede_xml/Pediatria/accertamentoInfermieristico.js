/**
 * File JavaScript in uso dalla scheda 'ACCERTAMENTO_INFERMIERISTICO_ASL2_PEDI'.
 * 
 * @author	gianlucab
 * @version	1.1
 * @since	2014-05-15
 */

var WindowCartella = null;

$(document).ready(function() {	
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try {
        PEDIATRIA.init();
        PEDIATRIA.caricaDati();
        PEDIATRIA.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    
    if (document.EXTERN.BISOGNO.value=='N'){
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }

    if (_STATO_PAGINA == 'L'){
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }

    try{
        if(!WindowCartella.ModalitaCartella.isStampabile(document)){
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    }
    catch(e){}
        
    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
});

var PEDIATRIA = {
	init: function() {	    
		// Aggiunta attributo "for" per le label accanto i radio input
		$("input:radio").each(function() {
			var label = $(this).next().next();
			if (label.attr("tagName").toUpperCase() == 'LABEL') {
				var idname = $(this).attr('name') + '_' + $(this).val();
				$(this).attr("id", idname);
				label.attr("for", idname);
			}
		});
		
		// Aggiunta attributo "for" per le label accanto ai check input
		$('label[name^=lblchk]').each(function () {
			var idname = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/, "$2");
			$(this).attr("for", idname);
		});
		
		NS_FUNCTIONS.moveLeftField({name: 'txtAspetto', colspan: 2, width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtTipoRespiro', colspan: 2, width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtOssigenoterapia', colspan: 1, width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtDieta', colspan: 2, width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtNutrizione', colspan: 1, width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtFrequenzaIntestino', colspan: 1, width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtCaratteristicheFeci', colspan: 1, width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtFrequenzaUrine', colspan: 1, width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtCaratteristicheUrine', colspan: 1, width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtPostura', colspan: 2, space: '&nbsp;&nbsp;&nbsp;', node: $('#rdoPostura_1').parent()});
		NS_FUNCTIONS.moveLeftField({name: 'txtAbitudini', colspan: 1, width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtRelazione', colspan: 1, width: '100%', space: '&nbsp;&nbsp;&nbsp;'});

		$('#rdoAllattamento_1').parent().css('width', '75%');
		$('#rdoFrequenzaIntestino_1').parent().css('width', '70%');
		$('#rdoFrequenzaUrine_1').parent().css('width', '70%');
		$('#rdoAutonomia_2').parent().attr('width', '50%');
		$('#txtProblemi').css('width', '100%');
	},
	caricaDati: function() {
	},
	setEvents: function() {
		NS_FUNCTIONS.enableDisable($('input[name="rdoAspetto"]:radio:checked'), [$('#rdoAspetto_3').val()], ['txtAspetto']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoTipoRespiro"]:radio:checked'), [$('#rdoTipoRespiro_1').val()], ['txtTipoRespiro']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoOssigenoterapia"]:radio:checked'), [$('#rdoOssigenoterapia_2').val()], ['txtOssigenoterapia']);
		NS_FUNCTIONS.enableDisable($('input[name="chkDieta"]:checked'), ['S'], ['txtDieta']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoNutrizione"]:radio:checked'), [$('#rdoNutrizione_2').val()], ['txtNutrizione']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoFrequenzaIntestino"]:radio:checked'), [$('#rdoFrequenzaIntestino_1').val()], ['txtFrequenzaIntestino']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoCaratteristicheFeci"]:radio:checked'), [$('#rdoCaratteristicheFeci_1').val()], ['txtCaratteristicheFeci']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoFrequenzaUrine"]:radio:checked'), [$('#rdoFrequenzaUrine_1').val()], ['txtFrequenzaUrine']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoCaratteristicheUrine"]:radio:checked'), [$('#rdoCaratteristicheUrine_1').val()], ['txtCaratteristicheUrine']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoPostura"]:radio:checked'), [$('#rdoPostura_1').val()], ['txtPostura']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoRelazione"]:radio:checked'), [$('#rdoRelazione_1').val()], ['txtRelazione']);
		NS_FUNCTIONS.enableDisable($('input[name="rdoAbitudini"]:radio:checked'), [$('#rdoAbitudini_1').val()], ['txtAbitudini']);
		
		$('input[name="rdoAspetto"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoAspetto"]:radio:checked'), [$('#rdoAspetto_3').val()], ['txtAspetto'], true);
		});
		$('input[name="rdoTipoRespiro"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoTipoRespiro"]:radio:checked'), [$('#rdoTipoRespiro_1').val()], ['txtTipoRespiro'], true);
		});
		$('input[name="rdoOssigenoterapia"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoOssigenoterapia"]:radio:checked'), [$('#rdoOssigenoterapia_2').val()], ['txtOssigenoterapia'], true);
		});
		$('input[name="chkDieta"]').click(function() {
			$(this).val($(this).is(':checked') ? 'S' : 'N');
			NS_FUNCTIONS.enableDisable($('input[name="chkDieta"]'), ['S'], ['txtDieta'], true);
		});
		$('input[name="rdoNutrizione"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoNutrizione"]:radio:checked'), [$('#rdoNutrizione_2').val()], ['txtNutrizione'], true);
		});
		$('input[name="rdoFrequenzaIntestino"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoFrequenzaIntestino"]:radio:checked'), [$('#rdoFrequenzaIntestino_1').val()], ['txtFrequenzaIntestino'], true);
		});
		$('input[name="rdoCaratteristicheFeci"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoCaratteristicheFeci"]:radio:checked'), [$('#rdoCaratteristicheFeci_1').val()], ['txtCaratteristicheFeci'], true);
		});
		$('input[name="rdoFrequenzaUrine"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoFrequenzaUrine"]:radio:checked'), [$('#rdoFrequenzaUrine_1').val()], ['txtFrequenzaUrine'], true);
		});
		$('input[name="rdoCaratteristicheUrine"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoCaratteristicheUrine"]:radio:checked'), [$('#rdoCaratteristicheUrine_1').val()], ['txtCaratteristicheUrine'], true);
		});
		$('input[name="rdoPostura"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoPostura"]:radio:checked'), [$('#rdoPostura_1').val()], ['txtPostura'], true);
		});
		$('input[name="rdoAbitudini"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoAbitudini"]:radio:checked'), [$('#rdoAbitudini_1').val()], ['txtAbitudini'], true);
		});
		$('input[name="rdoRelazione"]:radio').click(function() {
			NS_FUNCTIONS.enableDisable($('input[name="rdoRelazione"]:radio:checked'), [$('#rdoRelazione_1').val()], ['txtRelazione'], true);
		});	
	},
	save: function(){
		NS_FUNCTIONS.records();
	}
};

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
