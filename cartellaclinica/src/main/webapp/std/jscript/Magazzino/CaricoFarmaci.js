/**
 * User: matteopi
 * Date: 30/08/13
 * Time: 12.23
 */
var WindowHome = null;

jQuery(document).ready(function () {
    window.WindowHome = window;
    while ((window.WindowHome.name != 'Home' || window.WindowHome.name != 'schedaRicovero') && window.WindowHome.parent != window.WindowHome) {
        window.WindowHome = window.WindowHome.parent;
    }

    window.baseReparti 	= WindowHome.baseReparti;
    window.baseGlobal 	= WindowHome.baseGlobal;
    window.basePC 		= WindowHome.basePC;
    window.baseUser 	= WindowHome.baseUser;

    NS_CARICO_FARMACI.init();
    NS_CARICO_FARMACI.event();
});

var NS_CARICO_FARMACI = {
		
	init : function() {
		document.getElementById('hIdenMagazzino').value = $('#IDEN_MAGAZZINO').val();
		NS_GESTIONE_MAGAZZINO.unitaCaricoScarico('CARICO');
	},
	
	event: function () {
		$('[name="cmbRepartoProvenienza"]').change(function(){
			NS_GESTIONE_MAGAZZINO.unitaCaricoScarico('CARICO');
		});
	}
	
};
