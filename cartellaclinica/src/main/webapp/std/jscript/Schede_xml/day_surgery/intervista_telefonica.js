var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
    
    try {
        NS_INTERVISTA_TELEFONICA.init();
        NS_INTERVISTA_TELEFONICA.setEvents();
    } catch (e) {
        alert(e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description);
    }
});

var NS_INTERVISTA_TELEFONICA = {
    init: function() {
        NS_FUNCTIONS.disableEnableInputText('txtQuantiAntidolorifici', $('INPUT[name="radPrendeAnticolorifici"]:checked').val() === undefined ? "": $('INPUT[name="radPrendeAnticolorifici"]:checked').val(), 'S');
        NS_FUNCTIONS.disableEnableInputText('txtOrdineMedicazionePerche', $('INPUT[name="radOrdineMedicazione"]:checked').val() === undefined ? "": $('INPUT[name="radOrdineMedicazione"]:checked').val(), 'N');
        if (_STATO_PAGINA == 'L'){
   		 document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
       }  
    },
    setEvents: function() {     
        $('INPUT[name="radPrendeAnticolorifici"]').change(function() {NS_FUNCTIONS.disableEnableInputText('txtQuantiAntidolorifici', $(this).is(':checked') ? $(this).val() : "", 'S');});         
        $('INPUT[name="radOrdineMedicazione"]').change(function() {NS_FUNCTIONS.disableEnableInputText('txtOrdineMedicazionePerche', $(this).is(':checked') ? $(this).val() : "", 'N');});         
    },
    stampaModulo: function() {
        var funzione = document.EXTERN.FUNZIONE.value;
        var anteprima = 'S';
        var reparto = WindowCartella.getAccesso("COD_CDC");
        var sf = '&prompt<pIdenVisita>=' + WindowCartella.getRicovero("IDEN");

        WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, basePC.PRINTERNAME_REF_CLIENT);
    }
};
