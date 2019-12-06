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
        EOS_CARDIOLOGIA.init();
        EOS_CARDIOLOGIA.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
});

var EOS_CARDIOLOGIA = {
    init: function() {
        if (top.ModalitaCartella.isReadonly(document)) {
            document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
        }

        if (!top.ModalitaCartella.isStampabile(document)) {
            document.getElementById('lblstampa').parentElement.parentElement.style.display = 'none';
        }

        try {
            eval(baseReparti.getValue(top.getForm(document).reparto, 'ESAME_OBIETTIVO_SPECIALISTICO'));
        } catch (e) {
            alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
        }        
    },
    setEvents: function() {
		// Controllo obbligatorietà valore numerico
	    $('input[name=txtPeso], input[name=txtAltezza]').keydown(NS_FUNCTIONS.controlloNumerico_onkeydown).blur(NS_FUNCTIONS.controlloNumerico_onblur);

		// Campi non editabili (sola lettura)
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#6D6D6D','background-color': 'transparent' ,'border':'1px solid transparent'});
	    
        $('#txtPeso').blur(function() {
            var statura = parseFloat($('#txtAltezza').val(), 10);
            var peso = parseFloat($(this).val(), 10);
            statura = isNaN(statura) ? 0 : statura;
            peso = isNaN(peso) ? 0 : peso;
            if (statura > 0 && peso > 0) {
                $(this).val(String(peso));
                $('#txtBMI').val(NS_FUNCTIONS.calculateBMI(peso, statura*100));
            } else {
                $('#txtBMI').val('');
            }
        });
        
        $('#txtAltezza').blur(function() {
            var statura = parseFloat($(this).val(), 10);
            var peso = parseFloat($('#txtPeso').val(), 10);
            statura = isNaN(statura) ? 0 : statura;
            peso = isNaN(peso) ? 0 : peso;
            if (statura > 0 && peso > 0) {
                $(this).val(String(statura));
                $('#txtBMI').val(NS_FUNCTIONS.calculateBMI(peso, statura*100));
            } else {
                $('#txtBMI').val('');
            }
        });
    },
    registraEsameObiettivoSpecialistico: function() {
    	// Controllo che sia spuntata almeno una voce del campo 'Ispezione Addome'.
    	var chkIspezioneAddome = $('input[name=chkPiano]:checked, input[name=chkGloboso]:checked, input[name=chkRetiVenose]:checked, input[name=chkAscite]:checked');
    	$('input[name=chkPiano]').val(chkIspezioneAddome.length > 0 ? 'S' : '');
    	NS_FUNCTIONS.setCampoStato('chkPiano','lblIspezioneAddome','O'); 
        
    	// Salvataggio dei campi
    	NS_FUNCTIONS.records();
        
        // Ripristino il valore di default
        $('input[name=chkPiano]').val('');
    },
    stampaEsameObiettivoSpecialistico: function() {
        NS_FUNCTIONS.print('ESAME_OBIETTIVO_SPECIALISTICO', 'S');
    }						
};
