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

    NS_SCARICO_FARMACI.init();
    NS_SCARICO_FARMACI.event();
});

var NS_SCARICO_FARMACI = {
		
		init : function () {
			document.getElementById('hIdenMagazzino').value = $('#IDEN_MAGAZZINO').val();
	    	document.getElementById('hIdenDettaglio').value = ($('#IDEN_DETTAGLIO').val() == undefined) ? '' : $('#IDEN_DETTAGLIO').val();
	    	NS_GESTIONE_MAGAZZINO.unitaCaricoScarico('SCARICO');
	    },

	    event: function () {
	    }
	    
};
