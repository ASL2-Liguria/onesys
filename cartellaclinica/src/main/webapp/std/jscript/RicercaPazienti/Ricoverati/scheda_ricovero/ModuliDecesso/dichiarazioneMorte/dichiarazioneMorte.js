/**
 * User: matteopi
 * Date: 05/07/13
 * Time: 11.59
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

    NS_DICH_MORT.init();
    NS_DICH_MORT.event();
});

var NS_DICH_MORT = {
    init : function () {
        try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}
        $('#frameCertNecro').attr('src','servletGenerator?KEY_LEGAME=CERT_NECROSCOPICO&KEY_ID=');
    },
    event: function () {

    }
}


