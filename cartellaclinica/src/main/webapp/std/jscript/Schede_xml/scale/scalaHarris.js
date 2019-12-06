/**
 * File JavaScript in uso dalla scheda Harris Hip Score (HHS).
 * 
 * @author	gianlucab
 * @version	1.1
 * @since	2014-03-24
 */

var WindowCartella = null;
var punteggio = new Array();

$(document).ready(function() {
	//Rimozione della scritta "caricamento"
	window.WindowCartella = window;
	while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
		window.WindowCartella = window.WindowCartella.parent;
	}
	try {
		 WindowCartella.utilMostraBoxAttesa(false);
	} catch (e) {
		/*catch nel caso non venga aperta dalla cartella*/
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
    try{
        if(!WindowCartella.ModalitaCartella.isStampabile(document)){
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    }
    catch(e){}
    
	// Aggiunta attributo "for" per le label accanto i radio input
	$("input:radio").each(function() {
		var label = $(this).next().next();
		if (label.attr("tagName").toUpperCase() == 'LABEL') {
			var idname = $(this).val();
			$(this).attr("id", idname);
    		label.attr("for", idname);
		}
    });
	
    // Aggiunta attributo "for" per le label accanto ai check input
    $('label[name^=lblchk]').each(function () {
    	var idname = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/, "$2");
    	$(this).attr("for", idname);
    });
	
	// Aggiunge dei TD per allineare i campi in colonna
    $('#lblAbduzione').parent().parent().prepend('<td class="classTdLabel"><label>&nbsp;</label></td>');
    $('#lblExtrarotazione').parent().parent().prepend('<td class="classTdLabel"><label>&nbsp;</label></td>');
	
	// Inizializzazione del punteggio
	$('#txtTotale').attr('readonly', 'readonly');
	// (pure JavaScript equivalent)
	// document.getElementById("txtTotale").readOnly=true;
    // document.getElementById("txtTotale").disabled=true;
	
	if ($('#txtTotale').attr('value') == '') $('#txtTotale').attr('value', '0') ;
    $('input:radio:checked').each(function () {
    	// Ricarica il punteggio senza sovrascrivere il campo salvato nell'XML
    	countChecked($(this).attr('name'), false);
    });
    
    // Nasconde il pulsante Stampa
    document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
});

// Aggiorna il punteggio della scheda ad ogni click
function countChecked(inputName, update){
	update = (typeof update === "boolean") ? update : true;
	var id = $('input[name="'+inputName+'"]:radio:checked');
	var p = parseInt(id.attr('value'));
	punteggio[id.attr('name')] = isNaN(p) ? 0 : p;
	if (update) $('#txtTotale').attr('value', SommaPunteggio(punteggio));
}

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

// Stampa la scheda
function stampa(){
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
}
