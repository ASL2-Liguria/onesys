/**
 * File JavaScript in uso dalla scala "Valutazione funzionale".
 * 
 * @author	gianlucab
 * @version	1.0
 * @since	2014-03-24
 */

var WindowCartella = null;

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
    
    // Nasconde il pulsante Stampa
    document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
    
    // Aggiunge un TD per allineare il campo in colonna
    $('#lblRotazioneInterna').parent().parent().prepend('<td class="classTdLabel"><label>&nbsp;</label></td>');
    
    // Sposta il campo txtCaricoParziale nel TD alla sua sinistra
    var parent = $('#txtCaricoParziale').parent();
    var e = $('#txtCaricoParziale').parent().prev();
    e.attr("colspan", "100");
    e.append('&nbsp;');
    $('#txtCaricoParziale').remove().appendTo(e);
    parent.remove();
    
    // Abilita il campo txtCaricoParziale solo quando è selezionato
    focusTxtCaricoParziale($("input[name=rdoDeambulazione]:radio:checked").next().next().html());
    $('input[name=rdoDeambulazione]:radio:checked').focus();
    $("input[name=rdoDeambulazione]:radio").click(function() {
    	focusTxtCaricoParziale($(this).next().next().html());
    });
    
    // Controlla che il campo txtCaricoParziale contenga un valore numerico corretto
    $('#txtCaricoParziale').keydown(function(e) {
        // Consenti: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Consenti: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Consenti: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 return;
        }
        // Garantisce che sia stato premuto una cifra e termina il keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    })
    .blur(function() {
    	var integer = parseFloat("0"+$(this).val());
    	$(this).val(integer);
    	if (isNaN(integer) || integer < 0 || integer >= 100) {
    		window.alert('Inserisci un valore compreso tra 0 e 99');
    		$(this).focus();
    	}
    });
});

function focusTxtCaricoParziale(label) {
	if (label === 'Parziale (%)') {
		document.getElementById("txtCaricoParziale").disabled=false;
		document.getElementById("txtCaricoParziale").focus();
	} else {
		document.getElementById("txtCaricoParziale").disabled=true;
		document.getElementById("txtCaricoParziale").value='';
	}
}

// Stampa la scheda
function stampa() {
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
