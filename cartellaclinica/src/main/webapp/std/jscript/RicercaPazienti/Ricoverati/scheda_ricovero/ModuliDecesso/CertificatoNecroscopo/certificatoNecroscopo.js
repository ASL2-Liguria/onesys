/**
 * User: matteopi
 * Date: 05/07/13
 * Time: 14.11
 */
var WindowCartella = null;
jQuery(document).ready(function () {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    NS_CERT_NECROSCOPO.init();
    NS_CERT_NECROSCOPO.event();
});

var NS_CERT_NECROSCOPO = {
    init : function () {
        try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}
        $('#lblSottoscrittoD, #lblTerminata ,#lblAttivita ').width(500).parent().width(500);
    },
    event: function () {

    }
}


