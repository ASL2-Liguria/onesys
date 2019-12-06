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
        NS_CHECK_LIST_INTERVENTO.init();
        NS_CHECK_LIST_INTERVENTO.setEvents();
    } catch (e) {
        alert(e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description);
    }
});

var NS_CHECK_LIST_INTERVENTO = {
    init: function() {
        NS_FUNCTIONS.setColumnsDimension("groupChkListIntervento", ["25%", "15%", "10%", "50%"]);  
        
        if (_STATO_PAGINA == 'L'){
     		 document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
         }
    },
    setEvents: function() {  
        // Controllo sulla data
        var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
        oDateMask.attach($('input[name=txtData]')[0]);
    },
    stampaModulo: function() {
        var funzione = document.EXTERN.FUNZIONE.value;
        var anteprima = 'S';
        var reparto = WindowCartella.getAccesso("COD_CDC");
        var sf = '&prompt<pIdenPreRicovero>=' + WindowCartella.getRicovero("IDEN_PRERICOVERO") + '&prompt<pIdenRicovero>=' + WindowCartella.getRicovero("IDEN");

        WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, basePC.PRINTERNAME_REF_CLIENT);
    }
};
